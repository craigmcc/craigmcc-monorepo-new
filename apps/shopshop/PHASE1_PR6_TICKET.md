# Phase 1 PR-6: Observability + retention for operation idempotency

## Objective

Add observability and lifecycle management around the operation-envelope/idempotency system introduced in Phase 1 PR-1 through PR-5 so the write path is easier to monitor, debug, and maintain in production.

PR-5 completed the route-level conversion of the remaining write endpoints.
PR-6 focuses on the operational layer around that contract: structured logs, metrics, retention, and cleanup for persisted idempotency records.

## Scope

- Add structured logging for idempotent operations with consistent operation context.
- Add metrics or counters for accepted, replayed, rejected, and auth-failed write operations.
- Define and implement a retention policy for stale idempotency records.
- Add a cleanup job or maintenance script to remove expired operation records safely.
- Document operational guidance for monitoring and maintenance.
- Keep scope limited to operational support for the Phase 1 idempotency system.
- Do not change the route contract introduced in PR-4/PR-5 unless small shared helper alignment is required.
- Do not begin Phase 2 client-side queue/optimistic projection work in this PR.

## Why This PR Exists

PR-1 introduced the shared operation envelope.
PR-2 introduced persistence for idempotency records.
PR-3 integrated the execution wrapper into actions.
PR-4 proved the route contract with the first endpoint conversion.
PR-5 expanded the route contract to the remaining write endpoints.

PR-6 is the operational hardening step that makes the idempotency system easier to observe and keep healthy before the team moves on to client-side queueing or realtime work.

## Primary Goals

The PR should make it possible to answer these questions from logs/metrics and maintenance tools:

- Which operation types are being accepted, replayed, or rejected most often?
- Which actors or lists are generating the most write activity?
- Are retries or payload mismatches increasing?
- How old are idempotency records, and when should they be cleaned up?
- Can old operation records be removed without affecting replay correctness for recent requests?

## Suggested Files

### Observability and retention implementation

- `apps/shopshop/src/lib/ExecuteIdempotentOperation.ts`
- `apps/shopshop/src/lib/OperationIdempotencyHelpers.ts`
- `apps/shopshop/src/lib/OperationRecordRepository.ts`
- `apps/shopshop/src/lib/OperationRouteHelpers.ts`
- `apps/shopshop/src/lib/*` logging/metrics helpers as needed
- `apps/shopshop/src/actions/CategoryActions.ts`
- `apps/shopshop/src/actions/ItemActions.ts`
- `apps/shopshop/src/actions/ListActions.ts`
- `apps/shopshop/src/actions/ProfileActions.ts`

### Cleanup/maintenance entrypoints

- `apps/shopshop/scripts/*` or `scripts/*`
- `packages/db-shopshop/prisma/*` if retention requires schema/index support

### Tests

- `apps/shopshop/src/lib/ExecuteIdempotentOperation.test.ts`
- `apps/shopshop/src/lib/OperationIdempotencyHelpers.test.ts`
- `apps/shopshop/src/lib/OperationRecordRepository.test.ts`
- Any targeted route/action tests that should assert logging or retention behavior where practical

## Deliverables

### 1. Structured logging

Add structured server logging for operation-aware writes so each mutation can be traced with consistent context.

Recommended log fields:

- `operationId`
- `operationType`
- `actorProfileId`
- `listId` when available
- outcome label such as accepted / replay / rejected / auth-failed
- latency or duration where practical

Desired behavior:

- Logs should help diagnose first-seen execution vs replay vs conflict.
- Logs should avoid secrets or sensitive payload content.
- Logs should be consistent across the different write endpoints.

### 2. Metrics / counters

Add lightweight counters or comparable instrumentation for the main operation outcomes.

Recommended outcome buckets:

- accepted
- replayed
- rejected
- auth-failed

Optional follow-up metrics if simple to collect:

- replay latency
- payload mismatch frequency
- validation failure frequency

### 3. Retention policy and cleanup

Define how long idempotency records should be retained and how cleanup should run.

Expected work:

- choose a retention window appropriate for replay safety
- implement a cleanup path for stale records
- ensure cleanup is safe and does not interfere with active recent operations
- document how and when cleanup runs

### 4. Documentation / runbook

Document how to monitor and maintain the idempotency system.

The docs should explain:

- what gets logged
- what counters or signals to watch
- how to run the cleanup job
- what to do if replay/mismatch rates spike
- how retention settings should be reviewed over time

## Suggested milestones

1. [x] Observability helper foundation
   - Add or extend shared logging helpers for operation-aware writes.
   - Ensure the helpers are reusable from actions and/or route support code.
   - Keep the logging shape consistent across the Phase 1 write paths.

2. [x] Metrics instrumentation
   - Add counters or similar instrumentation for accepted, replayed, rejected, and auth-failed outcomes.
   - Capture enough context to distinguish operation types and identify hotspots.
   - Keep instrumentation low overhead and server-side only.

3. [x] Retention and cleanup job
   - Define the retention policy for stale idempotency records.
   - Implement a cleanup script or scheduled maintenance entrypoint.
   - Add tests for safe cleanup behavior and any repository-level filtering.

4. [x] Runbook and rollout notes
   - Document the observability signals and cleanup procedure.
   - Add rollout guidance for enabling the cleanup job and validating metrics/logging.
   - Record any operational caveats discovered while implementing the PR.

## Deliverables Checklist

### Observability

- [x] Structured logs include operation context and outcome
- [x] Logs are consistent across the operation-aware write paths
- [x] Logs avoid secrets and sensitive request data

### Metrics

- [x] Counters exist for accepted, replayed, rejected, and auth-failed operations
- [x] Metrics can be used to spot replay spikes or validation issues
- [x] Instrumentation is lightweight and server-side only

### Retention

- [x] Retention policy is defined and documented
- [x] Stale idempotency records can be cleaned up safely
- [x] Cleanup behavior is covered by tests

### Documentation

- [x] Runbook or maintenance notes explain observability signals and cleanup
- [x] Rollout guidance is captured for production use

### Verification

- [x] `pnpm --filter shopshop test:ci` passes
- [x] `pnpm --filter shopshop lint` passes
- [x] `pnpm --filter shopshop check-types` passes

## Test Cases

### Logging and instrumentation

- [x] First-seen operation logs the expected context and accepted outcome.
- [x] Replay logs a distinct replay outcome and does not create a second mutation.
- [x] Payload mismatch logs a rejection outcome.
- [x] Auth failures are visible in logs or counters.

### Retention / cleanup

- [x] Cleanup removes only stale operation records.
- [x] Recent records remain available for replay.
- [x] Cleanup does not change the response of active, recent operations.

### Regression coverage

- [x] Existing route/action idempotency behavior remains unchanged.
- [x] Phase 1 write routes still pass their replay and mismatch tests.

## Implementation Notes

- Prefer small shared helpers over duplicating logging logic in each action.
- Reuse `@repo/shared-utils/ServerLogger` for PR-6 logging so the observability work matches the existing action-layer logging pattern in `shopshop`.
- Keep the cleanup policy conservative so replay correctness is preserved.
- Avoid changing route contract semantics while adding observability.
- Treat the retention job as an operational concern, not a product feature.
- Use CI-mode validation during development.

## Suggested Commit Messages

1. `Add operation observability for idempotent writes`
2. `Add retention cleanup for operation records`
3. `Document idempotency observability and maintenance`

## Pull Request Description Template

```markdown
## Summary

Implements Phase 1 PR-6 by adding observability and retention support for the operation-envelope idempotency system.

This PR adds:
- structured logging for operation-aware writes
- counters or metrics for accepted, replayed, rejected, and auth-failed outcomes
- retention and cleanup for stale idempotency records
- operational documentation for monitoring and maintenance

## Scope

This PR focuses on the operational hardening of the Phase 1 write path:

- `apps/shopshop/src/lib/ExecuteIdempotentOperation.ts`
- `apps/shopshop/src/lib/OperationIdempotencyHelpers.ts`
- `apps/shopshop/src/lib/OperationRecordRepository.ts`
- `apps/shopshop/src/lib/OperationRouteHelpers.ts`
- supporting logging/metrics helpers
- cleanup job or script entrypoint

## Behavior Changes

- **Operation accepted**
  - Logs structured success context
  - Emits accepted metrics/counters

- **Operation replayed**
  - Logs replay context
  - Emits replay metrics/counters

- **Operation rejected**
  - Logs rejection context
  - Emits rejected metrics/counters

- **Auth failure**
  - Logs and/or counts auth-failed operations

- **Stale records**
  - Cleanup job removes expired idempotency records safely

## What Did Not Change

- No new route contract work
- No client-side queue work
- No realtime fan-out work
- No mobile API work

## Testing

### Added/Updated
- Tests for observability helpers and instrumentation where practical
- Tests for cleanup/retention behavior
- Regression verification that replay/mismatch behavior still passes

### Verification Commands

```bash
cd "/Users/craigmcc/Git.Craigmcc/craigmcc-monorepo"
pnpm --filter shopshop test:ci
pnpm --filter shopshop lint
pnpm --filter shopshop check-types
```

## Risk / Rollout Notes

- Main risk is making cleanup too aggressive and interfering with valid replay windows.
- Mitigation: use a conservative retention policy, test cleanup boundaries, and keep route/action semantics unchanged.
- This PR completes the Phase 1 idempotency hardening step before Phase 2 sync work begins.

## Checklist

- [ ] Structured logging is in place for operation-aware writes
- [ ] Metrics or counters capture accepted, replayed, rejected, and auth-failed outcomes
- [ ] Retention policy is defined and cleanup is implemented
- [ ] Cleanup behavior is tested
- [ ] Runbook/documentation is updated
- [ ] `test:ci`, `lint`, and `check-types` pass
- [ ] Scope remains limited to observability and retention
```

## Task Checklist

- [ ] Add observability helpers and/or instrumentation for operation-aware writes.
- [ ] Add retention and cleanup support for stale operation records.
- [ ] Update or add tests for observability and cleanup behavior.
- [ ] Document operational guidance and rollout notes.
- [ ] Verify lint: `pnpm --filter shopshop lint`.
- [ ] Verify types: `pnpm --filter shopshop check-types`.
- [ ] Verify tests: `pnpm --filter shopshop test:ci`.

## Definition of Done

- [ ] Operation-aware writes are observable through structured logs and/or metrics.
- [ ] Stale idempotency records can be cleaned up safely.
- [ ] Replay behavior remains correct for active recent operations.
- [ ] Documentation explains monitoring and cleanup.
- [ ] CI is green.
- [ ] PR scope stays limited to observability and retention for Phase 1.




