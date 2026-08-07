/**
 * Retention policy and cleanup helpers for idempotency operation records.
 */

// External Imports ----------------------------------------------------------

import { dbShopShop as db } from "@repo/db-shopshop";

// Internal Imports ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export const DEFAULT_OPERATION_RECORD_RETENTION_HOURS = 24 * 30;

export type CleanupOperationRecordsInput = {
  dryRun?: boolean;
  now?: Date;
  retentionHours?: number;
};

export type CleanupOperationRecordsResult = {
  cutoff: Date;
  deletedCount: number;
  dryRun: boolean;
  retentionHours: number;
};

export function computeOperationRecordCutoff(
  now: Date = new Date(),
  retentionHours: number = DEFAULT_OPERATION_RECORD_RETENTION_HOURS,
): Date {
  const retentionMs = retentionHours * 60 * 60 * 1000;
  return new Date(now.getTime() - retentionMs);
}

export async function cleanupStaleOperationRecords(
  input: CleanupOperationRecordsInput = {},
): Promise<CleanupOperationRecordsResult> {
  const retentionHours = input.retentionHours ?? DEFAULT_OPERATION_RECORD_RETENTION_HOURS;
  const cutoff = computeOperationRecordCutoff(input.now, retentionHours);
  const dryRun = input.dryRun ?? false;

  if (dryRun) {
    const staleCount = await countStaleOperationRecords(cutoff);
    return {
      cutoff,
      deletedCount: staleCount,
      dryRun,
      retentionHours,
    };
  }

  const result = await db.operationRecord.deleteMany({
    where: {
      completedAt: {
        lt: cutoff,
      },
      status: {
        in: ["COMPLETED", "REJECTED"],
      },
    },
  });

  return {
    cutoff,
    deletedCount: result.count,
    dryRun,
    retentionHours,
  };
}

export async function countStaleOperationRecords(cutoff: Date): Promise<number> {
  return db.operationRecord.count({
    where: {
      completedAt: {
        lt: cutoff,
      },
      status: {
        in: ["COMPLETED", "REJECTED"],
      },
    },
  });
}

