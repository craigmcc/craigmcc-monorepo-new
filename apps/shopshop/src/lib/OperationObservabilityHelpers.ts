/**
 * Structured logging and metrics helpers for operation idempotency observability.
 * Provides consistent context and outcome tracking for operation-aware writes.
 */

// External Imports ----------------------------------------------------------

import { serverLogger as logger } from "@repo/shared-utils/ServerLogger";

// Internal Imports ----------------------------------------------------------

// Public Objects ----------------------------------------------------------

/**
 * Context required for operation logging and metrics.
 * All fields except listId are required.
 */
export type OperationObservationContext = {
  // The unique operation ID
  operationId: string;
  // The operation type (e.g., "createCategory", "updateList", "deleteItem")
  operationType: string;
  // The actor who initiated the operation
  actorProfileId?: string;
  // The list being mutated, if applicable
  listId?: string;
};

/**
 * Possible operation outcomes that should be observed.
 */
export type OperationOutcome = "accepted" | "replay" | "rejected" | "auth-failed" | "validation-failed";

export type OperationMetricEmitterPayload = {
  metricName: string;
  outcome: OperationOutcome;
  operationType?: string;
  tags: Record<string, string>;
  value: number;
};

export type OperationMetricEmitter = (payload: OperationMetricEmitterPayload) => void;

/**
 * Log structured information about an operation outcome.
 * Chooses log level based on outcome severity:
 * - "accepted" and "replay": info level
 * - "rejected", "validation-failed": warn level
 * - "auth-failed": warn level
 */
export function logOperationOutcome(
  context: OperationObservationContext,
  outcome: OperationOutcome,
  details?: Record<string, unknown>,
): void {
  const logPayload: Record<string, unknown> = {
    context: "OperationObservability",
    operationId: context.operationId,
    operationType: context.operationType,
    outcome,
  };

  if (context.actorProfileId) {
    logPayload.actorProfileId = context.actorProfileId;
  }

  if (context.listId) {
    logPayload.listId = context.listId;
  }

  if (details) {
    Object.assign(logPayload, details);
  }

  // Log level depends on outcome severity
  if (outcome === "accepted" || outcome === "replay") {
    logger.info(logPayload);
  } else {
    logger.warn(logPayload);
  }
}

/**
 * In-memory metrics counters for operation outcomes.
 * In a production system, these would be emitted to a metrics backend.
 * For now, this serves as the foundation that can be extended to emit
 * to a proper metrics collector.
 */
export const operationMetrics = {
  // First-seen operations that completed successfully
  accepted: 0,
  // Operations that were replayed (same operationId, same payload)
  replay: 0,
  // Operations that were rejected (same operationId, different payload)
  rejected: 0,
  // Operations that failed authentication
  authFailed: 0,
  // Operations that failed validation
  validationFailed: 0,
};

export const operationMetricsByType: Record<string, typeof operationMetrics> = {};

/**
 * Register an optional backend emitter for operation metrics.
 * The emitter is called on each metric increment with normalized tags.
 */
export function setOperationMetricEmitter(emitter: OperationMetricEmitter | null): void {
  operationMetricEmitter = emitter;
}

/**
 * Increment the appropriate metric counter for the given outcome.
 */
export function incrementOperationMetric(
  outcome: OperationOutcome,
  options?: {
    operationType?: string;
  },
): void {
  const counterKey = counterKeyFromOutcome(outcome);

  switch (outcome) {
    case "accepted":
      operationMetrics.accepted++;
      break;
    case "replay":
      operationMetrics.replay++;
      break;
    case "rejected":
      operationMetrics.rejected++;
      break;
    case "auth-failed":
      operationMetrics.authFailed++;
      break;
    case "validation-failed":
      operationMetrics.validationFailed++;
      break;
  }

  if (options?.operationType) {
    const operationTypeMetrics = getOrCreateOperationTypeMetrics(options.operationType);
    operationTypeMetrics[counterKey]++;
  }

  emitOperationMetric(outcome, options?.operationType);
}

/**
 * Reset all metrics counters to zero.
 * Useful for testing.
 */
export function resetOperationMetrics(): void {
  operationMetrics.accepted = 0;
  operationMetrics.replay = 0;
  operationMetrics.rejected = 0;
  operationMetrics.authFailed = 0;
  operationMetrics.validationFailed = 0;

  for (const operationType of Object.keys(operationMetricsByType)) {
    delete operationMetricsByType[operationType];
  }
}

/**
 * Get a snapshot of the current metrics.
 * Useful for testing and exporting metrics.
 */
export function getOperationMetricsSnapshot(): typeof operationMetrics {
  return { ...operationMetrics };
}

export function getOperationMetricsByTypeSnapshot(): Record<string, typeof operationMetrics> {
  const snapshot: Record<string, typeof operationMetrics> = {};

  for (const [operationType, metrics] of Object.entries(operationMetricsByType)) {
    snapshot[operationType] = { ...metrics };
  }

  return snapshot;
}

// Private Objects -----------------------------------------------------------

let operationMetricEmitter: OperationMetricEmitter | null = null;

const OPERATION_OUTCOME_TO_COUNTER_KEY: Record<OperationOutcome, keyof typeof operationMetrics> = {
  accepted: "accepted",
  replay: "replay",
  rejected: "rejected",
  "auth-failed": "authFailed",
  "validation-failed": "validationFailed",
};

const OPERATION_OUTCOME_TO_TAG_VALUE: Record<OperationOutcome, string> = {
  accepted: "accepted",
  replay: "replay",
  rejected: "rejected",
  "auth-failed": "auth_failed",
  "validation-failed": "validation_failed",
};

function counterKeyFromOutcome(outcome: OperationOutcome): keyof typeof operationMetrics {
  return OPERATION_OUTCOME_TO_COUNTER_KEY[outcome];
}

function emitOperationMetric(outcome: OperationOutcome, operationType?: string): void {
  if (!operationMetricEmitter) {
    return;
  }

  const metricOutcome = OPERATION_OUTCOME_TO_TAG_VALUE[outcome];
  const metricName = `operation.${metricOutcome}`;
  const tags: Record<string, string> = {
    outcome: metricOutcome,
  };

  if (operationType) {
    tags.operationType = operationType;
  }

  operationMetricEmitter({
    metricName,
    outcome,
    operationType,
    tags,
    value: 1,
  });
}

function getOrCreateOperationTypeMetrics(operationType: string): typeof operationMetrics {
  const existing = operationMetricsByType[operationType];
  if (existing) {
    return existing;
  }

  const created: typeof operationMetrics = {
    accepted: 0,
    replay: 0,
    rejected: 0,
    authFailed: 0,
    validationFailed: 0,
  };
  operationMetricsByType[operationType] = created;
  return created;
}

