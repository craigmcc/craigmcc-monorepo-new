/**
 * Integration tests for operation record repository behavior.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";
import { beforeEach, describe, expect, it } from "vitest";

// Internal Imports ----------------------------------------------------------

import {
  cleanupStaleOperationRecords,
  completeOperationRecord,
  computeOperationRecordCutoff,
  countStaleOperationRecords,
  createOperationRecord,
  isUniqueConstraintError,
  lookupOperationRecord,
} from "@/lib/OperationRecordRepository";
import { BaseUtils } from "@/test/BaseUtils";

// Test Specifications -------------------------------------------------------

const CONFLICT_CODE = "PAYLOAD_HASH_MISMATCH";
const OPERATION_ID = "operation-001";
const OPERATION_TYPE = "LIST_CREATE";
const PAYLOAD_HASH_A = "hash-a";
const PAYLOAD_HASH_B = "hash-b";
const RESPONSE_BODY = {
  model: {
    id: "list-123",
  },
  message: "Created",
};
const RESPONSE_STATUS = 201;
const UTILS = new BaseUtils();

describe("OperationRecordRepository", () => {
  let actorProfileId = "";

  beforeEach(async () => {
    const { profiles } = await UTILS.loadData({
      withProfiles: true,
    });

    actorProfileId = profiles[0]!.id;
  });

  describe("record creation", () => {

    it("creates a first-seen operation record with PENDING status", async () => {
      const created = await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      expect(created.actorProfileId).toBe(actorProfileId);
      expect(created.operationId).toBe(OPERATION_ID);
      expect(created.operationType).toBe(OPERATION_TYPE);
      expect(created.payloadHash).toBe(PAYLOAD_HASH_A);
      expect(created.status).toBe("PENDING");
      expect(created.completedAt).toBeNull();
    });

  });

  describe("lookup behavior", () => {

    it("returns null when no operation record exists", async () => {
      const found = await lookupOperationRecord(actorProfileId, OPERATION_ID);

      expect(found).toBeNull();
    });

    it("returns the operation record after create", async () => {
      await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      const found = await lookupOperationRecord(actorProfileId, OPERATION_ID);

      expect(found).not.toBeNull();
      expect(found!.actorProfileId).toBe(actorProfileId);
      expect(found!.operationId).toBe(OPERATION_ID);
      expect(found!.operationType).toBe(OPERATION_TYPE);
      expect(found!.payloadHash).toBe(PAYLOAD_HASH_A);
    });

  });

  describe("duplicate key behavior", () => {

    it("fails duplicate create with unique constraint and helper detects it", async () => {
      await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      let duplicateError: unknown = null;
      try {
        await createOperationRecord({
          actorProfileId,
          operationId: OPERATION_ID,
          operationType: OPERATION_TYPE,
          payloadHash: PAYLOAD_HASH_A,
        });
      } catch (error) {
        duplicateError = error;
      }

      expect(duplicateError).not.toBeNull();
      expect(isUniqueConstraintError(duplicateError)).toBe(true);
    });

  });

  describe("completion behavior", () => {

    it("stores response snapshot and transitions to terminal status", async () => {
      await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      const completed = await completeOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        responseBody: RESPONSE_BODY,
        responseStatus: RESPONSE_STATUS,
        status: "COMPLETED",
      });

      expect(completed.status).toBe("COMPLETED");
      expect(completed.responseStatus).toBe(RESPONSE_STATUS);
      expect(completed.responseBody).toEqual(RESPONSE_BODY);
      expect(completed.completedAt).toBeInstanceOf(Date);
      expect(completed.conflictCode).toBeNull();
    });

    it("stores conflictCode when completing with REJECTED status", async () => {
      await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      const completed = await completeOperationRecord({
        actorProfileId,
        conflictCode: CONFLICT_CODE,
        operationId: OPERATION_ID,
        responseBody: {
          message: "Rejected",
        },
        responseStatus: 409,
        status: "REJECTED",
      });

      expect(completed.status).toBe("REJECTED");
      expect(completed.conflictCode).toBe(CONFLICT_CODE);
      expect(completed.completedAt).toBeInstanceOf(Date);
    });

  });

  describe("payload mismatch preparation", () => {

    it("detects same key with different payload hash via lookup assertion", async () => {
      await createOperationRecord({
        actorProfileId,
        operationId: OPERATION_ID,
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });

      const existing = await lookupOperationRecord(actorProfileId, OPERATION_ID);

      expect(existing).not.toBeNull();
      expect(existing!.payloadHash).toBe(PAYLOAD_HASH_A);
      expect(existing!.payloadHash).not.toBe(PAYLOAD_HASH_B);

      const operationCount = await db.operationRecord.count({
        where: {
          actorProfileId,
          operationId: OPERATION_ID,
        },
      });
      expect(operationCount).toBe(1);
    });

  });

  describe("retention cleanup", () => {

    it("removes only stale terminal records", async () => {
      const now = new Date("2026-08-06T12:00:00.000Z");
      const staleCompletedAt = new Date("2026-08-01T12:00:00.000Z");
      const recentCompletedAt = new Date("2026-08-06T10:00:00.000Z");

      await createAndCompleteOperation(actorProfileId, "cleanup-stale-completed", "COMPLETED", staleCompletedAt);
      await createAndCompleteOperation(actorProfileId, "cleanup-stale-rejected", "REJECTED", staleCompletedAt);
      await createAndCompleteOperation(actorProfileId, "cleanup-recent-completed", "COMPLETED", recentCompletedAt);

      await createOperationRecord({
        actorProfileId,
        operationId: "cleanup-stale-pending",
        operationType: OPERATION_TYPE,
        payloadHash: PAYLOAD_HASH_A,
      });
      await db.operationRecord.update({
        where: {
          actorProfileId_operationId: {
            actorProfileId,
            operationId: "cleanup-stale-pending",
          },
        },
        data: {
          createdAt: staleCompletedAt,
        },
      });

      const result = await cleanupStaleOperationRecords({
        now,
        retentionHours: 24,
      });

      expect(result.deletedCount).toBe(2);

      const staleCompleted = await lookupOperationRecord(actorProfileId, "cleanup-stale-completed");
      const staleRejected = await lookupOperationRecord(actorProfileId, "cleanup-stale-rejected");
      const recentCompleted = await lookupOperationRecord(actorProfileId, "cleanup-recent-completed");
      const stalePending = await lookupOperationRecord(actorProfileId, "cleanup-stale-pending");

      expect(staleCompleted).toBeNull();
      expect(staleRejected).toBeNull();
      expect(recentCompleted).not.toBeNull();
      expect(stalePending).not.toBeNull();
      expect(stalePending!.status).toBe("PENDING");
    });

    it("reports stale record count during dry run without deleting", async () => {
      const now = new Date("2026-08-06T12:00:00.000Z");
      const staleCompletedAt = new Date("2026-08-01T12:00:00.000Z");

      await createAndCompleteOperation(actorProfileId, "cleanup-dry-run-stale", "COMPLETED", staleCompletedAt);

      const result = await cleanupStaleOperationRecords({
        dryRun: true,
        now,
        retentionHours: 24,
      });

      expect(result.dryRun).toBe(true);
      expect(result.deletedCount).toBe(1);

      const stillExists = await lookupOperationRecord(actorProfileId, "cleanup-dry-run-stale");
      expect(stillExists).not.toBeNull();
    });

    it("counts stale records using retention cutoff", async () => {
      const now = new Date("2026-08-06T12:00:00.000Z");
      const staleCompletedAt = new Date("2026-08-01T12:00:00.000Z");
      const cutoff = computeOperationRecordCutoff(now, 24);

      await createAndCompleteOperation(actorProfileId, "cleanup-count-stale", "COMPLETED", staleCompletedAt);
      await createAndCompleteOperation(actorProfileId, "cleanup-count-recent", "COMPLETED", now);

      const staleCount = await countStaleOperationRecords(cutoff);
      expect(staleCount).toBe(1);
    });

  });

});

async function createAndCompleteOperation(
  actorProfileId: string,
  operationId: string,
  status: "COMPLETED" | "REJECTED",
  completedAt: Date,
): Promise<void> {
  await createOperationRecord({
    actorProfileId,
    operationId,
    operationType: OPERATION_TYPE,
    payloadHash: PAYLOAD_HASH_A,
  });

  await completeOperationRecord({
    actorProfileId,
    operationId,
    responseBody: {
      message: status,
    },
    responseStatus: status === "COMPLETED" ? 200 : 409,
    status,
  });

  await db.operationRecord.update({
    where: {
      actorProfileId_operationId: {
        actorProfileId,
        operationId,
      },
    },
    data: {
      completedAt,
      createdAt: completedAt,
    },
  });
}

