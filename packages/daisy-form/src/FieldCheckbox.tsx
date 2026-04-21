"use client";

/**
 * Tanstack Form input field for a checkbox with a label.
 */

// External Modules ----------------------------------------------------------

import { Checkbox, CheckboxProps } from "@repo/daisy-ui/Checkbox";

// Internal Modules ----------------------------------------------------------

import { FieldErrors } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FieldCheckboxProps = {
} & CheckboxProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FieldCheckbox({ handleBlur, handleChange, name, value, ...props }: FieldCheckboxProps) {

  const field = useFieldContext<boolean>();

  return (
    <Checkbox
      errors={<FieldErrors field={field} />}
      id={field.name}
      name={field.name}
      handleBlur={field.handleBlur}
      handleChange={(value) => field.handleChange(value)}
      value={field.state.value}
      {...props}
    />
  )

}

