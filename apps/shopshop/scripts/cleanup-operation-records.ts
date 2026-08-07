/**
 * CLI entrypoint to clean up stale idempotency operation records.
 */

// External Imports ----------------------------------------------------------

import { serverLogger } from "@repo/shared-utils/ServerLogger";

// Internal Imports ----------------------------------------------------------

import {
  cleanupStaleOperationRecords,
  DEFAULT_OPERATION_RECORD_RETENTION_HOURS,
} from "@/lib/OperationRecordRepository";

// Public Objects ------------------------------------------------------------

export async function runOperationRecordCleanupFromCli(): Promise<void> {
  const args = process.argv.slice(2);
  const argSet = new Set(args);

  const result = await cleanupStaleOperationRecords({
    dryRun: argSet.has("--dry-run"),
    retentionHours: parseRetentionHours(args),
  });

  serverLogger.info({
    context: "OperationRecordCleanup",
    cutoff: result.cutoff.toISOString(),
    deletedCount: result.deletedCount,
    dryRun: result.dryRun,
    retentionHours: result.retentionHours,
  });
}

// Private Objects -----------------------------------------------------------

function parseRetentionHours(args: string[]): number {
  const flagIndex = args.indexOf("--retention-hours");
  if (flagIndex === -1) {
    return DEFAULT_OPERATION_RECORD_RETENTION_HOURS;
  }

  const value = args[flagIndex + 1];
  if (!value) {
    throw new Error("--retention-hours requires a numeric value");
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error("--retention-hours must be a positive integer");
  }

  return parsed;
}

void runOperationRecordCleanupFromCli();

