"use client";

/**
 * Tanstack Form input field for a checkbox with a label.
 */

// External Modules ----------------------------------------------------------

import { Checkbox, CheckboxProps } from "@repo/daisy-ui/Checkbox";

// Internal Modules ----------------------------------------------------------

import { FieldErrors, FieldErrorVisibilityPolicy } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FieldCheckboxProps = {
  errorVisibilityPolicy?: FieldErrorVisibilityPolicy;
} & Omit<CheckboxProps, "errors" | "handleBlur" | "handleChange" | "name" | "value">;

export function FieldCheckbox({ errorVisibilityPolicy, ...props }: FieldCheckboxProps) {

  const field = useFieldContext<boolean>();

  return (
    <Checkbox
      {...props}
      errors={<FieldErrors field={field} visibilityPolicy={errorVisibilityPolicy} />}
      id={field.name}
      name={field.name}
      handleBlur={field.handleBlur}
      handleChange={(value) => field.handleChange(value)}
      value={field.state.value}
    />
  )

}

