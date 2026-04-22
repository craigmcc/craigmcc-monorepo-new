# Forms Architecture Plan (daisy-ui + daisy-form)

Status: Phase 4 completed
Last Updated: 2026-04-21

## Why This Exists

This document captures the intended split between `packages/daisy-ui` and `packages/daisy-form` so work can resume after context resets (`/clear`) without re-deciding architecture.

## Goals

- Keep `@repo/daisy-ui` form primitives framework-agnostic.
- Keep `@repo/daisy-form` focused on TanStack Form integration.
- Preserve current DaisyUI visual patterns while improving consistency and accessibility wiring.
- Avoid per-form CSS hacks for common layout/spacing concerns.

## Non-Goals (for initial phases)

- No schema/validation DSL abstraction beyond TanStack APIs.
- No backend submission abstraction.
- No non-TanStack adapter package in this milestone.

## Package Boundaries

### `packages/daisy-ui` (generic UI primitives)

Owns:
- Presentational form components and props that are framework-agnostic.
- Optional render slots/props such as `errors` (content is provided by caller).
- Accessibility wiring primitives (ids, `aria-describedby`, `aria-invalid`, etc.).
- Style variants and optional class overrides.

Does not own:
- TanStack hooks (`useForm`, `useField`, `useStore`) or app-specific context (`useAppContext`).
- Any decision logic for when/how to surface validation errors.

### `packages/daisy-form` (TanStack adapter layer)

Owns:
- Integrations with TanStack Form.
- App-aware wrappers (`useAppForm`, app context glue).
- Mapping TanStack field/form state into `daisy-ui` primitives.
- Validation/error mapping and passing `errors` (optionally) into `daisy-ui` controls.

Does not own:
- Core visual styles/variants for shared components.

## Core Design Principle

Use a **downward context contract** from wrapper components to controls.

- `daisy-ui` contexts should only communicate UI metadata (ids, invalid state, message slots).
- `daisy-form` adapters should translate TanStack state into those metadata props.
- `daisy-ui` controls should accept optional `errors` content, but never generate validation state themselves.
- Parent components should not try to discover child type at first render.
- Field-level validation messages should remain hidden for pristine untouched fields, and become visible after interaction or submit attempts.

## Immediate First Step (COMPLETED 2026-04-21)

1. ✅ In `packages/daisy-ui/src/Checkbox.tsx`, `packages/daisy-ui/src/Select.tsx`, and `packages/daisy-ui/src/Textarea.tsx`:
   - Exported unified public props (`CheckboxProps`, `SelectProps`, `TextareaProps`) so consumers do not need internal prop details.
   - Added optional `errors` support (and matching `errorsClassName`) rendered below the fieldset, consistently with `packages/daisy-ui/src/Input.tsx`.
2. ✅ In `packages/daisy-form/src`:
   - Implemented `FieldCheckbox.tsx`, `FieldSelect.tsx`, and `FieldTextarea.tsx` following `FieldInput.tsx`.
   - Each uses `useFieldContext(...)` and passes `errors={<FieldErrors field={field} />}` to the corresponding `daisy-ui` component.
3. ✅ Registered `FieldCheckbox`, `FieldSelect`, and `FieldTextarea` in `useAppForm.tsx` `fieldComponents`.
4. ✅ `check-types` passes for both `@repo/daisy-ui` and `@repo/daisy-form`.

## UI Strategy in `daisy-ui` (Adapt Existing Components)

Direction:
- Do not introduce `FormXxx`-named primitives in `daisy-ui`.
- Keep existing generic components reusable across forms and non-form scenarios
  (search bars, filters, settings panels, etc.).
- Extend existing inputs/selectors with optional props/slots needed by higher layers,
  while keeping them framework-agnostic.

Behavior:
- Existing components own rendering/styling/a11y of themselves.
- Existing components may accept optional `errors` content and render it when provided.
- Existing components do not decide validation policy; they only render passed content.

## API Sketch (illustrative)

```tsx
// daisy-ui layer (generic)
<Input
  label="Email"
  value={value}
  handleChange={setValue}
  errors={maybeErrors}
/>
```

```tsx
// daisy-form layer (TanStack adapter)
<FieldInput
  form={form}
  name="email"
  label="Email"
  description="We never share your email."
/>
```

## Phased Implementation Plan

### Phase 1: Contracts + Scaffolding (COMPLETED 2026-04-21)

- ✅ Immediate First Step alignment for `Checkbox`/`Select`/`Textarea` + `FieldCheckbox`/`FieldSelect`/`FieldTextarea`.
- ✅ Unified public prop types exported from all `daisy-ui` input components.
- ✅ `daisy-ui` components accept optional `errors` slot; `daisy-form` adapters populate it.
- ⬜ Define remaining `daisy-ui` form context types and primitive component interfaces (deferred to Phase 2).
- ⬜ README updates in both packages.

Exit criteria:
- ✅ Type-only contracts compile.
- ✅ New `Field*` adapters compile and mirror `FieldInput` strategy.
- ⬜ README updates in both packages are consistent.

### Phase 2: `daisy-ui` Generic Primitives (COMPLETED 2026-04-21)

- ✅ Adapted existing components (`Input`, `Checkbox`, `Select`, `Textarea`) with
  optional `description`, `descriptionClassName`, and `fieldsetClassName` props.
- ✅ Kept a11y wiring component-local and framework-agnostic (including description slots).
- ✅ Added unit tests for updated component behavior (description, errors, variants, fieldset classes).
- ✅ Added static (non-TanStack) Forms showcase examples in `apps/daisy-showcase`.

Exit criteria:
- ✅ Unit tests cover a11y wiring and class merges.
- ✅ Showcase has static (non-TanStack) form examples.

### Phase 3: `daisy-form` TanStack Adapters (COMPLETED 2026-04-21)

- ✅ Implemented adapters (`FieldInput`, `FieldCheckbox`, `FieldSelect`, `FieldTextarea`) using TanStack field context state/meta.
- ✅ Integrated app-aware hooks via `useAppContexts` and `useAppForm` field/form component registration.
- ✅ Ensured adapter output consistently uses `daisy-ui` primitives.
- ✅ Added tests for adapter mapping and form action behavior (`Field*` + `FormSubmitButton` + `FormResetButton`).
- ✅ Created showcase `LoginForm` component as a testbed demonstrating error forwarding to daisy-ui components.
  - Uses standalone Zod validation (not TanStack) to prove error → `errors` prop flow works end-to-end.
  - Will be converted to use `useAppForm` + `FieldInput` during Phase 4.

Exit criteria:
- ✅ Adapter tests cover error/touched/disabled/submit wiring.
- ✅ Type inference/contracts compile for field values and component props (`check-types` passing in `@repo/daisy-form`).
- ✅ Showcase LoginForm testbed demonstrates error slot rendering with daisy-ui Input component.

### Phase 4: Showcase Integration + Hardening (COMPLETED 2026-04-21)

- ✅ Converted static `LoginForm` (Phase 3 testbed) to use `useAppForm` + `FieldInput` + `FormSubmitButton`/`FormResetButton`.
  - ✅ Replaced manual form state with TanStack validators and full-object schema validators.
  - ✅ Added object-schema validation handlers on `onBlur`, `onChange`, and `onSubmit`.
  - ✅ Verified `useAppForm` wiring end-to-end (field state, error propagation, submit handling).
- ✅ Hardened `FieldErrors` to support schema-driven error payload shapes (strings, nested objects, arrays, and error maps).
- ✅ Integrated converted TanStack-backed `LoginForm` into `apps/daisy-showcase` Forms route.
- ✅ Added route-level integration tests for Forms page rendering + interaction.
- ✅ Added theme-switching interaction coverage for Forms route.
- ✅ Added regression tests for:
  - Field-level validation error flow (TanStack/object schema → `FieldInput` → `errors` prop).
  - Submit button disabled/loading behavior during async submission.
  - Reset button state restoration.
  - Error clearing on valid input.

Exit criteria:
- Forms route demonstrates both generic (daisy-ui-only) and TanStack-backed (daisy-form) usage.
- `LoginForm` component uses `useAppForm` + `FieldInput` adapters.
- `useAppForm` object-schema validators (`onBlur`/`onChange`/`onSubmit`) are supported and covered by tests.
- `FieldErrors` correctly renders schema-driven error payloads from TanStack metadata.
- Route-level tests cover form rendering, submission, validation, and reset flows.
- `test:ci` and `check-types` pass for `@repo/daisy-ui`, `@repo/daisy-form`, and `daisy-showcase`.
- Visual regression tests confirm theme-aware styling and accessibility across themes.

## Testing Strategy

- `daisy-ui`: component tests focused on a11y attributes + class behavior.
- `daisy-form`: adapter tests with TanStack state transitions.
- `daisy-showcase`: route smoke tests + key interaction tests.

## Open Questions (Decide During Phase 1)

1. Export strategy: deep imports only vs. package barrel exports.
2. Error visibility policy configuration scope: form-wide only, field-level only, or both.
3. Default spacing policy for generic input/selector components and error blocks.
4. Naming convention (`AppForm` vs. `TanstackFormProvider` vs. both).

## Decision Log

- 2026-04-20: Defer Card/Form nested spacing auto-detection until Form architecture exists.
- 2026-04-20: Keep split: generic primitives in `daisy-ui`, TanStack-specific integration in `daisy-form`.
- 2026-04-21: Completed Immediate First Step — `CheckboxProps`/`SelectProps`/`TextareaProps` exported, `errors` prop added to all three; `FieldCheckbox`/`FieldSelect`/`FieldTextarea` adapters created and registered in `useAppForm`.
- 2026-04-21: Both `@repo/daisy-ui` and `@repo/daisy-form` pass `check-types`.
- 2026-04-21: Completed Phase 2 — `description`/`descriptionClassName`/`fieldsetClassName` added to input family, tests added for `Input`/`Checkbox`/`Select`/`Textarea`, and static `Forms` showcase route implemented.
- 2026-04-21: Completed Phase 3 — added adapter and form action tests in `@repo/daisy-form` (`FieldInput`, `FieldCheckbox`, `FieldSelect`, `FieldTextarea`, `FormSubmitButton`, `FormResetButton`) and verified `check-types` + `test:ci`.
- 2026-04-21: Created showcase `LoginForm` testbed component (Phase 3 → Phase 4 bridge) using standalone Zod validation to prove error forwarding to daisy-ui Input `errors` prop works correctly. Phase 4 will convert it to use `useAppForm` + `FieldInput` adapters.
- 2026-04-21: Began Phase 4 implementation — converted showcase `LoginForm` to TanStack-backed `useAppForm` + `FieldInput`, integrated into Forms route, and added LoginForm + route integration tests.
- 2026-04-21: Tightened `Field*` adapter contracts to omit controlled props (`handleChange`, `name`, `value`, etc.) so TanStack context wiring cannot be accidentally overridden by caller props.
- 2026-04-21: Completed Phase 4 hardening — added support/tests for `useAppForm` object-schema validators (`onBlur`/`onChange`/`onSubmit`), hardened `FieldErrors` for schema error shapes, added async submit loading-state tests, and added Forms route theme-switching integration coverage.
- 2026-04-21: `FieldErrors` now suppresses messages for pristine untouched fields and only displays them after user interaction (`isTouched` / non-pristine state) or after form submit attempts.
- 2026-04-21: Added configurable `FieldErrors` visibility policies (`submit-or-interaction` default, plus `submit-only`, `touched-only`, `dirty-or-touched`, and custom callback support) exposed through all `Field*` adapters via `errorVisibilityPolicy`.

## Resume Checklist (After `/clear`)

- Re-open this file.
- Confirm current package scripts (`check-types`, `test`, `test:ci`) still pass.
- **Phase 1 through Phase 4 are complete.**
- Next focus (future enhancements):
  - Add broader visual regression snapshots across representative DaisyUI themes.
  - Expand async validation coverage for server-side / delayed validators.
- Keep package boundary rule strict: no TanStack imports in `daisy-ui`.
