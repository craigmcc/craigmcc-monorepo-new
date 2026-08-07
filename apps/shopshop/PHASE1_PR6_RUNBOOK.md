# Phase 1 PR-6: Operations Runbook

## Idempotency Observability, Retention, and Maintenance

**Scope**: `apps/shopshop` — Phase 1 write path  
**Author milestone**: Phase 1 PR-6  
**Status**: Ready for production rollout

---

## Table of Contents

1. [Overview](#1-overview)
2. [Observability Signals](#2-observability-signals)
3. [In-Process Metrics](#3-in-process-metrics)
4. [What to Watch](#4-what-to-watch)
5. [Cleanup Job](#5-cleanup-job)
6. [Rollout Steps](#6-rollout-steps)
7. [Validation Checklist](#7-validation-checklist)
8. [Operational Caveats](#8-operational-caveats)

---

## 1. Overview

Phase 1 PR-6 adds operational hardening around the idempotency system introduced in PR-5. Every write operation that flows through `ExecuteIdempotentOperation` now:

- emits a structured log with outcome label and operation context
- increments an in-process counter per outcome and per operation type
- forwards a tagged metric event to any registered backend emitter
- persists a terminal operation record in the database

Stale terminal records (older than the retention window) can be removed safely with a CLI maintenance script.

---

## 2. Observability Signals

### 2.1 Log Format

All operation-outcome logs share the context key `"OperationObservability"` and are emitted by `logOperationOutcome` in `OperationObservabilityHelpers.ts`.

**Info-level (happy paths)**

```json
{
  "level": 30,
  "time": "2026-08-06T17:00:00.000Z",
  "context": "OperationObservability",
  "operationId": "11111111-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  "operationType": "createCategory",
  "actorProfileId": "bc21ec7c-aedd-4510-99dd-87cba3b04d55",
  "outcome": "accepted",
  "responseStatus": 200
}
```

```json
{
  "level": 30,
  "context": "OperationObservability",
  "operationId": "22222222-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  "operationType": "updateItem",
  "actorProfileId": "6916e4e9-4ed1-4fdb-acf1-c219e97933d4",
  "outcome": "replay"
}
```

**Warn-level (error paths)**

```json
{
  "level": 40,
  "context": "OperationObservability",
  "operationId": "33333333-cccc-4ccc-8ccc-cccccccccccc",
  "operationType": "updateItem",
  "actorProfileId": "6916e4e9-4ed1-4fdb-acf1-c219e97933d4",
  "outcome": "rejected",
  "reason": "payload_mismatch"
}
```

```json
{
  "level": 40,
  "context": "OperationObservability",
  "operationId": "44444444-dddd-4ddd-8ddd-dddddddddddd",
  "operationType": "createCategory",
  "actorProfileId": "bc21ec7c-aedd-4510-99dd-87cba3b04d55",
  "outcome": "validation-failed",
  "responseStatus": 400
}
```

### 2.2 Log Fields Reference

| Field | Level | Description |
|---|---|---|
| `context` | always | Always `"OperationObservability"` |
| `operationId` | always | UUID from client-supplied operation envelope |
| `operationType` | always | e.g. `"createCategory"`, `"deleteItem"` |
| `actorProfileId` | when available | Profile ID of the acting user |
| `listId` | when applicable | List being mutated |
| `outcome` | always | See §2.3 |
| `responseStatus` | accepted, validation-failed | HTTP status stored on the record |
| `reason` | rejected | Always `"payload_mismatch"` |

### 2.3 Outcome Reference

| Outcome | Log Level | Meaning |
|---|---|---|
| `accepted` | info | First-seen operation; handler ran and completed |
| `replay` | info | Duplicate operation with same payload; stored response returned |
| `rejected` | warn | Same `operationId`, different payload — conflict |
| `auth-failed` | warn | Operation rejected before reaching execution (auth layer) |
| `validation-failed` | warn | Handler returned an error status |

### 2.4 Cleanup Log

The maintenance script emits a single structured line when it finishes:

```json
{
  "level": 30,
  "context": "OperationRecordCleanup",
  "cutoff": "2026-07-07T17:00:00.000Z",
  "deletedCount": 142,
  "dryRun": false,
  "retentionHours": 720
}
```

---

## 3. In-Process Metrics

### 3.1 Global Counters

Accessible at runtime via `getOperationMetricsSnapshot()` from `OperationObservabilityHelpers.ts`:

| Counter | Meaning |
|---|---|
| `accepted` | First-seen operations |
| `replay` | Replayed operations |
| `rejected` | Payload-mismatch conflicts |
| `authFailed` | Auth-rejected operations |
| `validationFailed` | Handler validation failures |

### 3.2 Per-Operation-Type Counters

`getOperationMetricsByTypeSnapshot()` returns the same counters broken down by `operationType`. Use this to identify which mutation paths have elevated replay or rejection rates.

### 3.3 Backend Emitter Hook

To forward metrics to a time-series backend (Prometheus, StatsD, OpenTelemetry, etc.), call `setOperationMetricEmitter` once at server startup before traffic arrives:

```typescript
import { setOperationMetricEmitter } from "@/lib/OperationObservabilityHelpers";

setOperationMetricEmitter(({ metricName, value, tags }) => {
  // Example: statsd.increment(metricName, value, tags);
  // Example: prometheusCounter.inc(tags);
});
```

The payload includes:

| Field | Example |
|---|---|
| `metricName` | `"operation.accepted"` |
| `outcome` | `"accepted"` |
| `operationType` | `"createCategory"` |
| `tags` | `{ outcome: "accepted", operationType: "createCategory" }` |
| `value` | `1` |

Metric names emitted:

- `operation.accepted`
- `operation.replay`
- `operation.rejected`
- `operation.auth_failed`
- `operation.validation_failed`

---

## 4. What to Watch

### 4.1 Normal Baseline

In steady-state production:

- `replay` should be low relative to `accepted` (occasional duplicate submits are expected)
- `rejected` (payload mismatch) should be near zero — non-zero is a client/server sync anomaly
- `validation-failed` should reflect expected business validation failures, not spikes
- `auth-failed` should be near zero under normal operation

### 4.2 Alert Thresholds (Suggested Starting Points)

| Signal | Threshold | Likely Cause |
|---|---|---|
| `rejected` rate > 1% of `accepted` | Alert | Client re-using stale operation IDs with different payloads |
| `replay` rate > 20% of `accepted` | Investigate | Retry storms, aggressive client retry logic |
| `validation-failed` spikes | Alert | Schema change or bad deployment |
| `auth-failed` spikes | Alert | Auth service issue or replay attack attempt |

### 4.3 Useful Log Queries

```
# All outcome events for a specific operation
context = "OperationObservability" AND operationId = "<uuid>"

# Rejected operations in the last hour
context = "OperationObservability" AND outcome = "rejected"

# Which operation types have the most replays?
context = "OperationObservability" AND outcome = "replay"
GROUP BY operationType

# Validation failure breakdown
context = "OperationObservability" AND outcome = "validation-failed"
GROUP BY operationType
```

---

## 5. Cleanup Job

### 5.1 Retention Policy

| Setting | Default | Description |
|---|---|---|
| Retention window | 30 days (720 hours) | Terminal records older than this are eligible for removal |
| Eligible statuses | `COMPLETED`, `REJECTED` | `PENDING` records are never deleted by the cleanup path |
| Filter field | `completedAt` | Cleanup uses `completedAt < cutoff`, not `createdAt` |

### 5.2 Running the Cleanup

**Dry run (see what would be deleted without deleting):**

```bash
pnpm --filter shopshop cleanup:operations:dry-run
```

**With a custom retention window:**

```bash
pnpm --filter shopshop cleanup:operations:dry-run -- --retention-hours 168
```

**Live run:**

```bash
pnpm --filter shopshop cleanup:operations
```

**Live run with a custom retention window:**

```bash
pnpm --filter shopshop cleanup:operations -- --retention-hours 168
```

### 5.3 Scheduling

The cleanup script is a standalone CLI entrypoint (`scripts/cleanup-operation-records.ts`). It is not currently scheduled automatically. Options for production scheduling:

- **Cron job** on the app server: `0 3 * * * pnpm --filter shopshop cleanup:operations`
- **CI/CD scheduled workflow**: run as a weekly maintenance job
- **Database maintenance window**: trigger alongside other scheduled DB maintenance

Always run a dry run first after any significant traffic event before running a live cleanup.

### 5.4 Safety Guarantees

- The cleanup never touches `PENDING` records.
- Records within the retention window are never removed, regardless of status.
- Cleanup uses `completedAt` (not `createdAt`) so records that took a long time to complete are protected until the window elapses from their completion time.
- The dry-run mode is safe to run at any time and does not modify the database.

---

## 6. Rollout Steps

### 6.1 Pre-Rollout

- [ ] Verify `pnpm --filter shopshop test:ci` passes cleanly on the deployment branch
- [ ] Verify `pnpm --filter shopshop lint` and `pnpm --filter shopshop check-types` pass
- [ ] Confirm database migrations from PR-5 (`operation_records` table) are applied on the target environment
- [ ] Confirm `DATABASE_URL` is set correctly in `.env` (used by the cleanup script)

### 6.2 Deployment

No schema changes are introduced by PR-6 — this PR adds code only. A standard deployment is sufficient.

### 6.3 Post-Deploy Validation

After deploying:

1. **Trigger a write operation** (e.g., create a list or category through the UI).
2. **Check logs** for a structured `OperationObservability` entry with `outcome: "accepted"`.
3. **Replay the same operation** (same `operationId`, same payload).
4. **Confirm** the log shows `outcome: "replay"` and no second mutation occurred.
5. **Run the dry-run cleanup** to confirm the script connects to the database:

```bash
pnpm --filter shopshop cleanup:operations:dry-run
```

6. **Confirm** the cleanup log shows `"dryRun": true` and a plausible `deletedCount`.

### 6.4 First Live Cleanup

Before scheduling regular cleanup, run the dry run and inspect the count:

```bash
pnpm --filter shopshop cleanup:operations:dry-run -- --retention-hours 720
```

If `deletedCount` looks reasonable (proportional to expected write volume over 30 days), proceed:

```bash
pnpm --filter shopshop cleanup:operations -- --retention-hours 720
```

Record the `deletedCount` and `cutoff` from the output log as a baseline.

---

## 7. Validation Checklist

After rollout:

- [ ] Logs appear at `context = "OperationObservability"` for write operations
- [ ] First-seen operations log `outcome: "accepted"`
- [ ] Replayed operations log `outcome: "replay"` and return the stored response
- [ ] Payload conflicts log `outcome: "rejected"` with `reason: "payload_mismatch"`
- [ ] Auth failures log `outcome: "auth-failed"` when applicable
- [ ] Validation failures log `outcome: "validation-failed"` with `responseStatus`
- [ ] Cleanup dry run connects successfully and returns a structured summary log
- [ ] Live cleanup removes only records with `completedAt < cutoff`
- [ ] `PENDING` records are unaffected by cleanup
- [ ] Recent terminal records (within retention window) are unaffected by cleanup

---

## 8. Operational Caveats

### 8.1 In-Process Metrics Are Per-Instance

`operationMetrics` and `operationMetricsByType` are in-memory objects scoped to the Node.js process. In a multi-instance deployment:

- Each instance maintains its own counters
- Aggregating across instances requires either a backend emitter (§3.3) or log-based aggregation (§4.3)
- Counters reset to zero on process restart

### 8.2 PENDING Records Are Intentionally Preserved

If a process crashes after inserting a `PENDING` record but before calling `completeOperationRecord`, the record stays `PENDING` indefinitely. The cleanup job will not remove it. This is intentional — a `PENDING` record prevents a duplicate mutation from racing through after the crash.

In a future maintenance pass, consider a separate job to expire and reap very old `PENDING` records (e.g., older than 1 hour) that were never completed.

### 8.3 Clock Skew and Cutoff Accuracy

`computeOperationRecordCutoff` uses the server clock at the time the cleanup runs. If the database and application server have significant clock skew, the effective cutoff may drift slightly. This is conservative (skew moves the cutoff earlier), so no records will be deleted prematurely.

### 8.4 Retention Window Tuning

The default window of 30 days (720 hours) is intentionally generous. For write-heavy applications, consider:

- Shortening to 7 days if replay correctness is only required within a session window
- Keeping at 30 days if users may retry mutations across sessions or on mobile apps with long offline periods

Any change to the retention window should be dry-run validated before applying.

### 8.5 No Route-Layer Changes

PR-6 adds observability only. It does not change any route contracts, response shapes, or authentication behavior. Rollback is a standard code revert with no schema migration required.

---

**Last updated**: August 6, 2026  
**Milestone**: 4 of 4 — Runbook and Rollout Notes  
**Status**: ✅ Complete

