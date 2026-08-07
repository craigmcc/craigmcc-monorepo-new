/**
 * Integration tests for idempotent operation execution wrapper behavior.
 */

// External Imports ----------------------------------------------------------

import type { ActionResult } from "@repo/daisy-form/ActionResult";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { serverLogger as logger } from "@repo/shared-utils/ServerLogger";

// Internal Imports ----------------------------------------------------------

import { executeIdempotentOperation } from "@/lib/ExecuteIdempotentOperation";
import { lookupOperationRecord } from "@/lib/OperationRecordRepository";
import {
  getOperationMetricsByTypeSnapshot,
  getOperationMetricsSnapshot,
  resetOperationMetrics,
  setOperationMetricEmitter,
  type OperationMetricEmitterPayload,
} from "@/lib/OperationObservabilityHelpers";
import { BaseUtils } from "@/test/BaseUtils";

// Test Specifications -------------------------------------------------------

const UTILS = new BaseUtils();

describe("ExecuteIdempotentOperation", () => {
  let actorProfileId = "";

  beforeEach(async () => {
    const { profiles } = await UTILS.loadData({
      withProfiles: true,
    });
    actorProfileId = profiles[0]!.id;
    resetOperationMetrics();
    setOperationMetricEmitter(null);
    vi.clearAllMocks();
  });

  it("executes first-seen operation and stores COMPLETED snapshot", async () => {
    let executions = 0;

    const result = await executeIdempotentOperation({
      actorProfileId,
      operationId: "33333333-3333-4333-8333-333333333333",
      operationType: "updateProfile",
      payload: {
        name: "First",
      },
    }, async (): Promise<ActionResult<{ name: string }>> => {
      executions += 1;
      return {
        model: {
          name: "First",
        },
      };
    });

    const record = await lookupOperationRecord(actorProfileId, "33333333-3333-4333-8333-333333333333");

    expect(executions).toBe(1);
    expect(result.model).toEqual({ name: "First" });
    expect(record).not.toBeNull();
    expect(record!.status).toBe("COMPLETED");
    expect(record!.responseBody).toEqual(result);
  });

  it("replays stored response for duplicate operation with same payload", async () => {
    let executions = 0;

    const first = await executeIdempotentOperation({
      actorProfileId,
      operationId: "44444444-4444-4444-8444-444444444444",
      operationType: "updateProfile",
      payload: {
        name: "Replay",
      },
    }, async (): Promise<ActionResult<{ name: string }>> => {
      executions += 1;
      return {
        model: {
          name: "Replay",
        },
      };
    });

    const second = await executeIdempotentOperation({
      actorProfileId,
      operationId: "44444444-4444-4444-8444-444444444444",
      operationType: "updateProfile",
      payload: {
        name: "Replay",
      },
    }, async (): Promise<ActionResult<{ name: string }>> => {
      executions += 1;
      return {
        model: {
          name: "Should Not Run",
        },
      };
    });

    expect(executions).toBe(1);
    expect(second).toEqual(first);
  });

  it("rejects duplicate operationId when payload hash differs", async () => {
    await executeIdempotentOperation({
      actorProfileId,
      operationId: "55555555-5555-4555-8555-555555555555",
      operationType: "updateProfile",
      payload: {
        name: "Original",
      },
    }, async (): Promise<ActionResult<{ name: string }>> => {
      return {
        model: {
          name: "Original",
        },
      };
    });

    const conflict = await executeIdempotentOperation({
      actorProfileId,
      operationId: "55555555-5555-4555-8555-555555555555",
      operationType: "updateProfile",
      payload: {
        name: "Changed",
      },
    }, async (): Promise<ActionResult<{ name: string }>> => {
      return {
        model: {
          name: "Should Not Run",
        },
      };
    });

    expect(conflict.model).toBeUndefined();
    expect(conflict.message).toBe("Operation payload does not match existing operationId");
    expect(conflict.status).toBe(409);
  });

  describe("observability and metrics", () => {
    it("logs and records metrics for first-seen accepted operation", async () => {
      const logSpy = vi.spyOn(logger, "info");
      const emitter = vi.fn<(payload: OperationMetricEmitterPayload) => void>();
      setOperationMetricEmitter(emitter);

      await executeIdempotentOperation({
        actorProfileId,
        operationId: "11111111-1111-4111-8111-111111111111",
        operationType: "createCategory",
        payload: {
          name: "Test Category",
        },
      }, async (): Promise<ActionResult<{ name: string }>> => {
        return {
          model: {
            name: "Test Category",
          },
        };
      });

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "accepted",
          operationId: "11111111-1111-4111-8111-111111111111",
          operationType: "createCategory",
          actorProfileId,
        }),
      );

      const metrics = getOperationMetricsSnapshot();
      expect(metrics.accepted).toBe(1);
      expect(metrics.replay).toBe(0);

      const byType = getOperationMetricsByTypeSnapshot();
      expect(byType.createCategory?.accepted).toBe(1);

      expect(emitter).toHaveBeenCalledWith({
        metricName: "operation.accepted",
        outcome: "accepted",
        operationType: "createCategory",
        tags: {
          outcome: "accepted",
          operationType: "createCategory",
        },
        value: 1,
      });
    });

    it("logs and records metrics for replay operation", async () => {
      const logSpy = vi.spyOn(logger, "info");

      // First call
      await executeIdempotentOperation({
        actorProfileId,
        operationId: "22222222-2222-4222-8222-222222222222",
        operationType: "updateItem",
        payload: {
          itemId: "item-1",
        },
      }, async (): Promise<ActionResult<{ itemId: string }>> => {
        return {
          model: {
            itemId: "item-1",
          },
        };
      });

      // Reset spy to check only the replay call
      logSpy.mockClear();

      // Replay call
      await executeIdempotentOperation({
        actorProfileId,
        operationId: "22222222-2222-4222-8222-222222222222",
        operationType: "updateItem",
        payload: {
          itemId: "item-1",
        },
      }, async (): Promise<ActionResult<{ itemId: string }>> => {
        return {
          model: {
            itemId: "item-1",
          },
        };
      });

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "replay",
          operationId: "22222222-2222-4222-8222-222222222222",
          operationType: "updateItem",
        }),
      );

      const metrics = getOperationMetricsSnapshot();
      expect(metrics.accepted).toBe(1);
      expect(metrics.replay).toBe(1);
    });

    it("logs and records metrics for payload mismatch rejection", async () => {
      const logSpy = vi.spyOn(logger, "warn");

      // First call
      await executeIdempotentOperation({
        actorProfileId,
        operationId: "33333333-3333-4333-8333-333333333333",
        operationType: "deleteList",
        payload: {
          listId: "list-1",
        },
      }, async (): Promise<ActionResult<null>> => {
        return {
          model: null,
        };
      });

      // Reset spy to check only the rejection call
      logSpy.mockClear();

      // Mismatch call
      await executeIdempotentOperation({
        actorProfileId,
        operationId: "33333333-3333-4333-8333-333333333333",
        operationType: "deleteList",
        payload: {
          listId: "list-2", // Different payload
        },
      }, async (): Promise<ActionResult<null>> => {
        return {
          model: null,
        };
      });

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "rejected",
          operationId: "33333333-3333-4333-8333-333333333333",
          operationType: "deleteList",
          reason: "payload_mismatch",
        }),
      );

      const metrics = getOperationMetricsSnapshot();
      expect(metrics.accepted).toBe(1);
      expect(metrics.rejected).toBe(1);
    });

    it("logs validation failure as validation-failed outcome", async () => {
      const logSpy = vi.spyOn(logger, "warn");

      await executeIdempotentOperation({
        actorProfileId,
        operationId: "66666666-6666-4666-8666-666666666666",
        operationType: "updateProfile",
        payload: {
          name: "",
        },
      }, async (): Promise<ActionResult<{ name: string }>> => {
        return {
          message: "Validation failed",
          status: 400,
        };
      });

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          outcome: "validation-failed",
          operationId: "66666666-6666-4666-8666-666666666666",
          responseStatus: 400,
        }),
      );

      const metrics = getOperationMetricsSnapshot();
      expect(metrics.accepted).toBe(0);
      expect(metrics.validationFailed).toBe(1);
    });
  });
});
