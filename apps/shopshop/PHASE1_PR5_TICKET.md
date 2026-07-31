# Phase 1 PR-5: Extend envelope conversion to remaining write endpoints

## Objective

Expand the route-level operation-envelope contract from the PR-4 pilot to the remaining write endpoints in `shopshop` so every mutation route uses the same deterministic idempotency flow.

PR-4 proved the full request/response contract for `POST /api/list`.
PR-5 applies the same pattern to the rest of the write surface area, without introducing new idempotency concepts or changing read routes.

## Scope

- Convert the remaining write endpoints to accept operation envelopes at the route boundary.
- Reuse the PR-3 idempotent action wrapper in the existing action layer.
- Return route responses with deterministic idempotency metadata for success, replay, and rejection paths.
- Update route tests for each converted endpoint to cover first-seen execution, replay, mismatch, and invalid-envelope behavior.
- Keep scope limited to mutation endpoints only.
- Do not convert any read routes in this PR.
- Do not change the already-converted `POST /api/list` pilot behavior except where shared helpers require consistency.

## Why This PR Exists

PR-1 introduced the shared operation envelope.
PR-2 introduced persistence for idempotency records.
PR-3 integrated the execution wrapper into actions.
PR-4 proved the route contract with the first endpoint conversion.

PR-5 is the broadening step that makes the remaining write endpoints follow the same route-level contract before later work focuses on observability and retention.

## Primary Targets

The endpoints below are the remaining write routes to convert:

- `POST /api/category`
- `POST /api/item`
- `PUT /api/list/:listId`
- `DELETE /api/list/:listId`
- `PUT /api/category/:categoryId`
- `DELETE /api/category/:categoryId`
- `PUT /api/item/:itemId`
- `DELETE /api/item/:itemId`
- `PUT /api/profile`

## Suggested Files

### Primary implementation

- `apps/shopshop/src/app/api/(actions)/category/route.ts`
- `apps/shopshop/src/app/api/(actions)/item/route.ts`
- `apps/shopshop/src/app/api/(actions)/list/[listId]/route.ts`
- `apps/shopshop/src/app/api/(actions)/category/[categoryId]/route.ts`
- `apps/shopshop/src/app/api/(actions)/item/[itemId]/route.ts`
- `apps/shopshop/src/app/api/(actions)/profile/route.ts`

### Route tests

- `apps/shopshop/src/app/api/(actions)/category/route.test.ts`
- `apps/shopshop/src/app/api/(actions)/item/route.test.ts`
- `apps/shopshop/src/app/api/(actions)/list/[listId]/route.test.ts`
- `apps/shopshop/src/app/api/(actions)/category/[categoryId]/route.test.ts`
- `apps/shopshop/src/app/api/(actions)/item/[itemId]/route.test.ts`
- `apps/shopshop/src/app/api/(actions)/profile/route.test.ts`

### Reused action-layer dependencies

- `apps/shopshop/src/actions/CategoryActions.ts`
- `apps/shopshop/src/actions/ItemActions.ts`
- `apps/shopshop/src/actions/ListActions.ts`
- `apps/shopshop/src/actions/ProfileActions.ts`

### Shared helpers to reuse

- `apps/shopshop/src/lib/ExecuteIdempotentOperation.ts`
- `apps/shopshop/src/lib/OperationEnvelopeHelpers.ts`
- `apps/shopshop/src/lib/OperationIdempotencyHelpers.ts`
- `apps/shopshop/src/lib/OperationRecordRepository.ts`
- `apps/shopshop/src/zod-schemas/OperationEnvelopeSchema.ts`
- `apps/shopshop/src/types/OperationEnvelope.ts`

## Deliverables

### 1. Route request contract

Every converted route should:

- accept an operation envelope instead of a raw mutation payload
- validate `operationType` at the route boundary
- validate `schemaVersion` at the route boundary
- validate the embedded payload shape before forwarding to the action layer
- reject malformed or mismatched envelopes deterministically

### 2. Route response contract

Every converted route should return deterministic response metadata for:

- first-seen success
- replay
- payload mismatch rejection
- malformed or mismatched envelope rejection

Success and replay responses should include:

- `operationId`
- a deterministic outcome indicator such as `accepted` / `rejected`
- `serverTimestamp`
- the resource payload when the operation succeeds

Rejection responses should include:

- `operationId`
- a deterministic rejection indicator
- stable error/status semantics

### 3. Endpoint coverage

Each converted route should have tests for:

- valid first-seen execution
- duplicate same-`operationId` and same-payload replay
- duplicate same-`operationId` and different-payload rejection
- invalid or mismatched envelope shape/type

## Test Cases

### First-seen execution

- [ ] A valid envelope for each endpoint returns success.
- [ ] The underlying mutation occurs exactly once.
- [ ] Response includes `operationId` and `serverTimestamp`.

### Replay

- [ ] The same envelope sent twice returns a deterministic response.
- [ ] No duplicate mutation occurs on replay.
- [ ] Replay response shape matches the first successful response contract.

### Payload mismatch

- [ ] The same `operationId` with a different payload is rejected.
- [ ] Response includes stable error/status semantics.
- [ ] Existing persisted data is not mutated a second time.

### Envelope validation

- [ ] Non-envelope requests fail cleanly.
- [ ] Wrong `operationType` for the route fails cleanly.
- [ ] Invalid `schemaVersion` or malformed fields fail cleanly.

## Implementation Notes

- Keep the route-level conversion narrow and consistent with PR-4.
- Validate envelopes at the route boundary rather than inside unrelated lower-level code.
- Reuse PR-3 action support rather than re-implementing idempotency in each route.
- Keep response shape deterministic across first-run, replay, and rejection paths.
- Preserve existing authentication and authorization behavior for unsigned or unauthorized callers.
- Keep `POST /api/list` unchanged except for any shared helper alignment needed to support the broader pattern.

## PR-5 Kickoff Checklist and Suggested Commits

### Kickoff Checklist

1. Review the PR-4 implementation and route response pattern.
2. Confirm the remaining write endpoints listed in `apps/shopshop/ARCHITECTURE.md`.
3. Validate the current idempotency helpers and route-test conventions.
4. Convert the remaining routes in small, grouped changes.
5. Run the validation commands after each meaningful milestone.

### Suggested milestones

1. [x] Route contract for create endpoints
   - `POST /api/category`
   - `POST /api/item`
   - `PUT /api/profile`

2. [x] Route contract for list mutations
   - `PUT /api/list/:listId`
   - `DELETE /api/list/:listId`

3. [ ] Route contract for category mutations
   - `PUT /api/category/:categoryId`
   - `DELETE /api/category/:categoryId`

4. [ ] Route contract for item mutations
   - `PUT /api/item/:itemId`
   - `DELETE /api/item/:itemId`

5. [ ] Route test coverage and cleanup
   - Add/update replay, mismatch, and invalid-envelope tests for every converted endpoint
   - Re-run validation commands

### Suggested Commit Messages

1. `Convert create routes to operation envelope request contract`
2. `Convert list mutation routes to operation envelope request contract`
3. `Convert category and item mutation routes to operation envelope request contract`
4. `Update write route tests for replay and mismatch flows`

## Pull Request Description Template

```markdown
## Summary

Implements Phase 1 PR-5 by extending the operation-envelope route contract to the remaining write endpoints in `shopshop`.

This PR adds:
- route-level envelope validation across the remaining mutation routes
- forwarding into the existing PR-3 idempotent execution path
- deterministic response metadata for success, replay, and rejection paths
- route-level replay, mismatch, and malformed-envelope coverage across the converted endpoints

## Scope

Remaining write endpoints only:

1. `POST /api/category`
2. `POST /api/item`
3. `PUT /api/list/:listId`
4. `DELETE /api/list/:listId`
5. `PUT /api/category/:categoryId`
6. `DELETE /api/category/:categoryId`
7. `PUT /api/item/:itemId`
8. `DELETE /api/item/:itemId`
9. `PUT /api/profile`

Related reused dependencies:
- `apps/shopshop/src/actions/CategoryActions.ts`
- `apps/shopshop/src/actions/ItemActions.ts`
- `apps/shopshop/src/actions/ListActions.ts`
- `apps/shopshop/src/actions/ProfileActions.ts`
- `apps/shopshop/src/lib/ExecuteIdempotentOperation.ts`
- `apps/shopshop/src/lib/OperationEnvelopeHelpers.ts`
- `apps/shopshop/src/lib/OperationIdempotencyHelpers.ts`
- `apps/shopshop/src/lib/OperationRecordRepository.ts`

## Behavior Changes

- **Valid first-seen envelope**
  - Route accepts the envelope for the endpoint's operation type
  - Executes through the existing idempotent action path
  - Returns success payload plus deterministic metadata

- **Duplicate request with same payload**
  - Does not apply the mutation twice
  - Replays deterministic response metadata and payload shape

- **Duplicate request with different payload**
  - Returns deterministic rejection/conflict behavior
  - Includes stable error semantics and operation metadata

- **Malformed or mismatched envelope**
  - Fails cleanly at the route boundary
  - Does not reach unrelated mutation logic

## What Did Not Change

- No read-route conversions in this PR
- No re-implementation of idempotency logic in each route
- No unrelated contract changes outside the remaining write endpoints

## Testing

### Added/Updated
- Route-level tests for each converted endpoint covering:
  - valid first-seen execution
  - replay with same `operationId` and same payload
  - rejection for same `operationId` with different payload
  - invalid or mismatched envelope validation failures

### Verification Commands

```bash
cd "/Users/craigmcc/Git.Craigmcc/craigmcc-monorepo"
pnpm --filter shopshop test:ci
pnpm --filter shopshop lint
pnpm --filter shopshop check-types
```

## Risk / Rollout Notes

- Main risk is route/action contract drift while expanding the pattern beyond the pilot endpoint.
- Mitigation: keep each endpoint aligned to the PR-4 response contract, reuse the PR-3 wrapper, and verify deterministic replay and mismatch paths in tests.
- This PR is the final broadening step before observability and retention work in PR-6.

## Checklist

- [ ] Remaining write endpoints accept the operation envelope contract
- [ ] First-seen requests return deterministic success metadata
- [ ] Replay does not apply a mutation twice
- [ ] Payload mismatch returns deterministic rejection
- [ ] Invalid envelope validation fails cleanly at the route boundary
- [ ] `test:ci`, `lint`, and `check-types` pass
- [ ] Scope remains limited to the remaining write endpoints
```

## Task Checklist

- [ ] Update the remaining write routes to accept operation envelopes.
- [ ] Forward parsed envelopes to the matching action functions.
- [ ] Return route-level idempotency metadata in responses.
- [ ] Update route tests for the new contract.
- [ ] Add replay and payload-mismatch route tests for each converted endpoint.
- [ ] Verify lint: `pnpm --filter shopshop lint`.
- [ ] Verify types: `pnpm --filter shopshop check-types`.
- [ ] Verify tests: `pnpm --filter shopshop test:ci`.

## Definition of Done

- [ ] All remaining write endpoints use the operation-envelope contract.
- [ ] Replay and mismatch behavior are covered at the route level.
- [ ] No read routes are converted in this PR.
- [ ] CI is green.
- [ ] PR scope stays focused on the remaining write routes only.

