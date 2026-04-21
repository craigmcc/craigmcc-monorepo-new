# Forms Architecture Plan (daisy-ui + daisy-form)

Status: Phase 1 in progress
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

### Phase 2: `daisy-ui` Generic Primitives

- Adapt existing components (`Input`, `Checkbox`, `Select`, `Textarea`, etc.) with
  optional props/slots needed by adapter layers.
- Ensure a11y wiring remains component-local and framework-agnostic.
- Add class override props for spacing/padding/extensibility.

Exit criteria:
- Unit tests cover a11y wiring and class merges.
- Showcase has static (non-TanStack) form examples.

### Phase 3: `daisy-form` TanStack Adapters

- Implement adapters (`FieldInput`, etc.) using TanStack state/meta.
- Integrate app-aware hooks where needed (`useAppContext`, `useAppForm`).
- Ensure adapter output consistently uses `daisy-ui` primitives.

Exit criteria:
- Adapter tests for error/touched/disabled/submit states.
- Type inference works for field names and values.

### Phase 4: Showcase Integration + Hardening

- Build real forms in `apps/daisy-showcase` Forms route.
- Validate with different themes and layout variants.
- Add regression tests for route-level rendering and key interactions.

Exit criteria:
- Forms route demonstrates generic and TanStack-backed usage.
- `test:ci` and `check-types` pass for affected packages/apps.

## Testing Strategy

- `daisy-ui`: component tests focused on a11y attributes + class behavior.
- `daisy-form`: adapter tests with TanStack state transitions.
- `daisy-showcase`: route smoke tests + key interaction tests.

## Open Questions (Decide During Phase 1)

1. Export strategy: deep imports only vs. package barrel exports.
2. Error visibility policy: show on touched vs. on submit vs. configurable.
3. Default spacing policy for generic input/selector components and error blocks.
4. Naming convention (`AppForm` vs. `TanstackFormProvider` vs. both).

## Decision Log

- 2026-04-20: Defer Card/Form nested spacing auto-detection until Form architecture exists.
- 2026-04-20: Keep split: generic primitives in `daisy-ui`, TanStack-specific integration in `daisy-form`.
- 2026-04-21: Completed Immediate First Step — `CheckboxProps`/`SelectProps`/`TextareaProps` exported, `errors` prop added to all three; `FieldCheckbox`/`FieldSelect`/`FieldTextarea` adapters created and registered in `useAppForm`.
- 2026-04-21: Both `@repo/daisy-ui` and `@repo/daisy-form` pass `check-types`.

## Resume Checklist (After `/clear`)

- Re-open this file.
- Confirm current package scripts (`check-types`, `test`, `test:ci`) still pass.
- **Phase 1 is done** — next work is Phase 2 (`daisy-ui` component adaptation + a11y props).
- Keep package boundary rule strict: no TanStack imports in `daisy-ui`.
