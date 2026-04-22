"use client";

/**
 * Tanstack Form input field for a text field with a label.
 */

// External Modules ----------------------------------------------------------

import { Input, InputProps } from "@repo/daisy-ui/Input";

// Internal Modules ----------------------------------------------------------

import { FieldErrors, FieldErrorVisibilityPolicy } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FieldInputProps = {
  errorVisibilityPolicy?: FieldErrorVisibilityPolicy;
} & Omit<InputProps, "errors" | "handleBlur" | "handleChange" | "name" | "value">;

export function FieldInput({ errorVisibilityPolicy, ...props }: FieldInputProps) {

  const field = useFieldContext<string>();

  return (
    <Input
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
