/**
 * Operation Observability Helpers - Milestone 1 Foundation
 * =========================================================
 *
 * This document describes the structured logging and metrics infrastructure
 * for Phase 1 PR-6 Milestone 1: Observability Helper Foundation.
 */

## Overview

The Operation Observability Helpers provide a reusable foundation for structured logging and metrics collection around idempotent operation execution in the shopshop write path.

This is the foundation layer that enables consistent observability across all operation-aware write endpoints introduced in Phase 1 PR-4 and PR-5.

## Files

- `OperationObservabilityHelpers.ts` - Core logging and metrics helpers
- `OperationObservabilityHelpers.test.ts` - Comprehensive test coverage
- `ExecuteIdempotentOperation.ts` - Integration point for observability signals (updated)

## Architecture

### Core Concepts

1. **OperationObservationContext**: Contains the contextual information for an operation
   - `operationId`: Unique identifier for the operation
   - `operationType`: Type of operation (e.g., "createCategory", "updateList")
   - `actorProfileId`: Optional - the user performing the operation
   - `listId`: Optional - the list being mutated when applicable

2. **OperationOutcome**: Possible outcomes for an operation
   - `accepted`: First-seen operation that completed successfully
   - `replay`: Duplicate operation with same payload (safe to replay)
   - `rejected`: Duplicate operation with different payload (conflict)
   - `auth-failed`: Operation failed authentication (future use)
   - `validation-failed`: Operation failed validation

3. **Metrics**: In-memory counters for observability
   - `accepted`: Number of first-seen operations
   - `replay`: Number of replayed operations
   - `rejected`: Number of conflicting operations
   - `authFailed`: Number of auth failures
   - `validationFailed`: Number of validation failures
    - `operationMetricsByType`: Per-operation-type counters for hotspot detection

## Usage Guide

### Basic Integration Pattern

The `ExecuteIdempotentOperation` wrapper automatically emits observability signals:

```typescript
import { executeIdempotentOperation } from "@/lib/ExecuteIdempotentOperation";

export async function createCategory(
  data: CategoryCreateSchemaType,
  operationEnvelope?: unknown,
): Promise<ActionResult<Category>> {
  const profile = await findProfile();
  if (!profile) {
    return { message: ERRORS.AUTHENTICATION, status: 401 };
  }

  const operationId = extractOperationId(operationEnvelope, "createCategory");
  if (!operationId) {
    return { message: "Operation ID required", status: 400 };
  }

  return executeIdempotentOperation({
    actorProfileId: profile.id,
    operationId,
    operationType: "createCategory",
    payload: data,
  }, async () => {
    // Your business logic here
    return db.category.create({ data: { ...data, listId: result.data.listId } });
  });
}
```

The `executeIdempotentOperation` wrapper will:
1. Log operation acceptance/replay/rejection automatically
2. Increment the appropriate metrics
3. Use consistent log structure across all operations

### Manual Logging (Advanced)

For logging outside the idempotent wrapper, import and use directly:

```typescript
import {
  logOperationOutcome,
  incrementOperationMetric,
  type OperationObservationContext,
} from "@/lib/OperationObservabilityHelpers";

const context: OperationObservationContext = {
  operationId: "op-123",
  operationType: "createItem",
  actorProfileId: "actor-456",
  listId: "list-789",
};

if (someAuthCheck) {
  logOperationOutcome(context, "auth-failed");
  incrementOperationMetric("auth-failed");
}
```

## Structured Log Format

### Info Level (Accepted/Replay)

```json
{
  "level": 30,
  "time": "8/6/2026, 5:58:49 PM",
  "context": "OperationObservability",
  "operationId": "11111111-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "operationType": "createCategory",
  "actorProfileId": "bc21ec7c-aedd-4510-99dd-87cba3b04d55",
  "listId": "list-123",
  "outcome": "accepted",
  "responseStatus": 200
}
```

### Warn Level (Rejected/Auth Failed/Validation Failed)

```json
{
  "level": 40,
  "time": "8/6/2026, 5:58:50 PM",
  "context": "OperationObservability",
  "operationId": "22222222-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "operationType": "updateItem",
  "actorProfileId": "6916e4e9-4ed1-4fdb-acf1-c219e97933d4",
  "outcome": "rejected",
  "reason": "payload_mismatch"
}
```

## Log Fields

All structured logs include:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| context | string | Yes | Always "OperationObservability" for operation logs |
| operationId | string | Yes | Unique operation identifier |
| operationType | string | Yes | Operation type (createCategory, updateItem, etc.) |
| actorProfileId | string | No | User performing the operation |
| listId | string | No | List being modified, if applicable |
| outcome | string | Yes | One of: accepted, replay, rejected, auth-failed, validation-failed |
| responseStatus | number | Conditional | HTTP status for accepted/validation-failed outcomes |
| reason | string | Conditional | Reason for rejection (e.g., "payload_mismatch") |

## Metrics

Current metrics are stored in-memory and available via:

```typescript
import {
  getOperationMetricsByTypeSnapshot,
  getOperationMetricsSnapshot,
  operationMetrics,
  setOperationMetricEmitter,
} from "@/lib/OperationObservabilityHelpers";

// Get current snapshot
const snapshot = getOperationMetricsSnapshot();
console.log(snapshot);
// { accepted: 100, replay: 5, rejected: 1, authFailed: 0, validationFailed: 2 }

// Or directly access
console.log(operationMetrics.accepted);

// Grouped counters by operation type
console.log(getOperationMetricsByTypeSnapshot());
// { createCategory: { accepted: 10, replay: 1, rejected: 0, authFailed: 0, validationFailed: 0 } }

// Optional backend emission hook
setOperationMetricEmitter((payload) => {
  // forward to Prometheus, StatsD, OpenTelemetry, etc.
  metricsService.increment(payload.metricName, payload.value, payload.tags);
});
```

### Production Metrics Export

Milestone 2 adds a backend emission hook and operation-type tagging:

1. `incrementOperationMetric` now accepts optional `operationType` metadata
2. `setOperationMetricEmitter` registers a backend forwarding callback
3. Emitted metrics include `metricName`, `value`, and `tags` (`outcome`, optional `operationType`)

Emitted metric names:

- `operation.accepted`
- `operation.replay`
- `operation.rejected`
- `operation.auth_failed`
- `operation.validation_failed`

This keeps instrumentation lightweight while enabling external dashboards and alerts.

## Testing

The helpers are thoroughly tested for:

1. **Log output verification** - All outcomes log at correct level
2. **Log field presence** - Context fields are included correctly
3. **Metrics accuracy** - Counters increment appropriately
4. **Independence** - Different counters don't interfere
5. **Reset functionality** - Metrics can be reset for testing

Test commands:

```bash
# Run tests
pnpm --filter shopshop test:ci

# Run only observability tests
pnpm --filter shopshop test:ci -- --grep "OperationObservability"
```

## Integration Points

### ExecuteIdempotentOperation

The main integration point is in `ExecuteIdempotentOperation.ts`:

- Logs operation acceptance when first-seen execution completes
- Logs operation replay when identical operation is re-executed
- Logs operation rejection when payload hash differs
- Logs validation-failed when handler returns error status
- Increments appropriate metrics for each outcome

### Action Integrations

All Phase 1 write actions automatically use observability:

- `createCategory`, `updateCategory`, `deleteCategory`
- `createItem`, `updateItem`, `deleteItem`
- `createList`, `updateList`, `deleteList`
- `updateProfile`

### Route Integrations

All corresponding API routes benefit from observability via the action layer.

## Monitoring Queries

### Via Structured Logs

Query logs to answer:

1. **Which operations are most common?**
   ```
   Search logs where context="OperationObservability"
   Group by operationType
   Count outcomes
   ```

2. **Which actors are most active?**
   ```
   Search logs where context="OperationObservability"
   Group by actorProfileId
   Count by outcome
   ```

3. **What's the replay rate?**
   ```
   Count(outcome="replay") / Count(outcome="accepted")
   ```

4. **Are there payload conflicts?**
   ```
   Search logs where outcome="rejected"
   Group by operationType
   ```

### Via Metrics

Use `getOperationMetricsSnapshot()` to:

- Build dashboards showing operation acceptance vs replay vs rejection
- Alert on high rejection rates (possible client/server sync issues)
- Track validation failure trends
- Monitor auth failure spikes

## Retention and Cleanup

Milestone 3 introduces lifecycle cleanup for stale idempotency records.

- Retention window: `30 days` by default (`720` hours)
- Cleanup target: terminal operation records only (`COMPLETED` or `REJECTED`)
- Safety guard: `PENDING` records are never removed by the cleanup path

CLI entrypoint:

```bash
pnpm --filter shopshop cleanup:operations
pnpm --filter shopshop cleanup:operations:dry-run
```

Optional retention override:

```bash
pnpm --filter shopshop cleanup:operations -- --retention-hours 168
```

The cleanup script logs a structured `OperationRecordCleanup` summary with:

- cutoff timestamp
- retention hours
- dry-run mode flag
- deleted (or would-delete) record count

## Future Enhancements

Milestone 1 foundation enables:

1. **Milestone 2 (Metrics)**: Emit to metrics backend (Prometheus, etc.)
2. **Milestone 3 (Retention/Cleanup)**: Use logs for retention policy decisions
3. **Operational Runbook**: Use logs/metrics to guide monitoring guidance

## Testing the Implementation

To verify observability is working:

```bash
# Run the full test suite
pnpm --filter shopshop test:ci

# Check specific test file
pnpm --filter shopshop test:ci -- OperationObservabilityHelpers.test.ts

# Verify lint/types
pnpm --filter shopshop lint
pnpm --filter shopshop check-types
```

All should pass with no warnings.

## Related Files

- **Phase 1 PR-6 Ticket**: `PHASE1_PR6_TICKET.md` - Full PR requirements
- **Phase 1 Architecture**: `ARCHITECTURE.md` - Overall system design
- **Operation Envelope**: `src/types/OperationEnvelope.ts` - Operation type definitions
- **Repository Functions**: `src/lib/OperationRecordRepository.ts` - Persistence layer
- **Execution Wrapper**: `src/lib/ExecuteIdempotentOperation.ts` - Wrapper with observability

## Author Notes

This foundation provides:

✓ **Consistent log structure** across all operation-aware writes  
✓ **Multiple outcome types** to distinguish accept/replay/reject paths  
✓ **In-memory metrics** ready for backend emission  
✓ **Comprehensive test coverage** of all observability paths  
✓ **Future-proof design** for metrics/retention work  

The design keeps logging concerns separate from business logic while remaining easy to integrate with existing actions.

