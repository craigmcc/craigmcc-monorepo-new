/**
 * Tests for operation observability helpers.
 */

// External Imports ----------------------------------------------------------

import { describe, it, expect, beforeEach, vi } from "vitest";
import { serverLogger as logger } from "@repo/shared-utils/ServerLogger";

// Internal Imports ----------------------------------------------------------

import {
  logOperationOutcome,
  operationMetrics,
  incrementOperationMetric,
  resetOperationMetrics,
  getOperationMetricsSnapshot,
  type OperationObservationContext,
} from "@/lib/OperationObservabilityHelpers";

// Test Suite -----------------------------------------------------------------

describe("OperationObservabilityHelpers", () => {
  beforeEach(() => {
    resetOperationMetrics();
    vi.clearAllMocks();
  });

  describe("logOperationOutcome", () => {
    it("logs operation acceptance at info level", () => {
      const spy = vi.spyOn(logger, "info");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "createCategory",
        actorProfileId: "profile-456",
        listId: "list-789",
      };

      logOperationOutcome(context, "accepted", { responseStatus: 200 });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          context: "OperationObservability",
          operationId: "op-123",
          operationType: "createCategory",
          actorProfileId: "profile-456",
          listId: "list-789",
          outcome: "accepted",
          responseStatus: 200,
        }),
      );
    });

    it("logs operation replay at info level", () => {
      const spy = vi.spyOn(logger, "info");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "updateList",
      };

      logOperationOutcome(context, "replay");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "replay",
        }),
      );
    });

    it("logs operation rejection at warn level", () => {
      const spy = vi.spyOn(logger, "warn");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "deleteItem",
      };

      logOperationOutcome(context, "rejected", { reason: "payload_mismatch" });

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "rejected",
          reason: "payload_mismatch",
        }),
      );
    });

    it("logs auth failure at warn level", () => {
      const spy = vi.spyOn(logger, "warn");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "createCategory",
      };

      logOperationOutcome(context, "auth-failed");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "auth-failed",
        }),
      );
    });

    it("logs validation failure at warn level", () => {
      const spy = vi.spyOn(logger, "warn");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "updateCategory",
      };

      logOperationOutcome(context, "validation-failed");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "validation-failed",
        }),
      );
    });

    it("omits optional fields when not provided", () => {
      const spy = vi.spyOn(logger, "info");
      const context: OperationObservationContext = {
        operationId: "op-123",
        operationType: "createItem",
      };

      logOperationOutcome(context, "accepted");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          operationId: "op-123",
          operationType: "createItem",
          outcome: "accepted",
        }),
      );

      const callArgs = spy.mock.calls[0];
      if (callArgs && callArgs[0]) {
        const call = callArgs[0] as Record<string, unknown>;
        expect(call).not.toHaveProperty("actorProfileId");
        expect(call).not.toHaveProperty("listId");
      }
    });

    it("includes all provided context fields", () => {
      const spy = vi.spyOn(logger, "info");
      const context: OperationObservationContext = {
        operationId: "op-abc",
        operationType: "updateProfile",
        actorProfileId: "actor-xyz",
        listId: "list-uvw",
      };

      logOperationOutcome(context, "accepted");

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          operationId: "op-abc",
          operationType: "updateProfile",
          actorProfileId: "actor-xyz",
          listId: "list-uvw",
        }),
      );
    });
  });

  describe("incrementOperationMetric", () => {
    it("increments accepted counter", () => {
      expect(operationMetrics.accepted).toBe(0);

      incrementOperationMetric("accepted");
      expect(operationMetrics.accepted).toBe(1);

      incrementOperationMetric("accepted");
      expect(operationMetrics.accepted).toBe(2);
    });

    it("increments replay counter", () => {
      expect(operationMetrics.replay).toBe(0);

      incrementOperationMetric("replay");
      expect(operationMetrics.replay).toBe(1);

      incrementOperationMetric("replay");
      expect(operationMetrics.replay).toBe(2);
    });

    it("increments rejected counter", () => {
      expect(operationMetrics.rejected).toBe(0);

      incrementOperationMetric("rejected");
      expect(operationMetrics.rejected).toBe(1);
    });

    it("increments auth-failed counter", () => {
      expect(operationMetrics.authFailed).toBe(0);

      incrementOperationMetric("auth-failed");
      expect(operationMetrics.authFailed).toBe(1);
    });

    it("increments validation-failed counter", () => {
      expect(operationMetrics.validationFailed).toBe(0);

      incrementOperationMetric("validation-failed");
      expect(operationMetrics.validationFailed).toBe(1);
    });

    it("increments independent counters", () => {
      incrementOperationMetric("accepted");
      incrementOperationMetric("accepted");
      incrementOperationMetric("replay");
      incrementOperationMetric("rejected");

      expect(operationMetrics.accepted).toBe(2);
      expect(operationMetrics.replay).toBe(1);
      expect(operationMetrics.rejected).toBe(1);
      expect(operationMetrics.authFailed).toBe(0);
      expect(operationMetrics.validationFailed).toBe(0);
    });
  });

  describe("resetOperationMetrics", () => {
    it("resets all counters to zero", () => {
      incrementOperationMetric("accepted");
      incrementOperationMetric("replay");
      incrementOperationMetric("rejected");
      incrementOperationMetric("auth-failed");
      incrementOperationMetric("validation-failed");

      expect(operationMetrics.accepted).toBe(1);
      expect(operationMetrics.replay).toBe(1);
      expect(operationMetrics.rejected).toBe(1);
      expect(operationMetrics.authFailed).toBe(1);
      expect(operationMetrics.validationFailed).toBe(1);

      resetOperationMetrics();

      expect(operationMetrics.accepted).toBe(0);
      expect(operationMetrics.replay).toBe(0);
      expect(operationMetrics.rejected).toBe(0);
      expect(operationMetrics.authFailed).toBe(0);
      expect(operationMetrics.validationFailed).toBe(0);
    });
  });

  describe("getOperationMetricsSnapshot", () => {
    it("returns a copy of current metrics", () => {
      incrementOperationMetric("accepted");
      incrementOperationMetric("replay");

      const snapshot = getOperationMetricsSnapshot();

      expect(snapshot.accepted).toBe(1);
      expect(snapshot.replay).toBe(1);
      expect(snapshot.rejected).toBe(0);
    });

    it("returns an independent copy", () => {
      incrementOperationMetric("accepted");

      const snapshot1 = getOperationMetricsSnapshot();
      incrementOperationMetric("accepted");
      const snapshot2 = getOperationMetricsSnapshot();

      expect(snapshot1.accepted).toBe(1);
      expect(snapshot2.accepted).toBe(2);
    });

    it("does not modify metrics when snapshot is modified", () => {
      incrementOperationMetric("accepted");
      const snapshot = getOperationMetricsSnapshot();

      // Try to modify the snapshot (TypeScript won't allow this at runtime in a real scenario)
      (snapshot as Record<string, unknown>).accepted = 999;

      // Original metrics should be unchanged
      expect(operationMetrics.accepted).toBe(1);
    });
  });

  describe("integration", () => {
    it("logs and metrics work together for operation flow", () => {
      const logSpy = vi.spyOn(logger, "info");

      const context: OperationObservationContext = {
        operationId: "op-flow-test",
        operationType: "createCategory",
        actorProfileId: "actor-flow",
      };

      // First-seen accepted
      logOperationOutcome(context, "accepted", { responseStatus: 200 });
      incrementOperationMetric("accepted");

      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(operationMetrics.accepted).toBe(1);

      // Replay
      logOperationOutcome(context, "replay");
      incrementOperationMetric("replay");

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(operationMetrics.replay).toBe(1);
    });
  });
});



