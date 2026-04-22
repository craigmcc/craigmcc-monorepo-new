"use client";
/**
 * Tanstack Form input field for a select field with a label.
 */
// External Modules ----------------------------------------------------------
import { Select, SelectProps } from "@repo/daisy-ui/Select";
// Internal Modules ----------------------------------------------------------
import { FieldErrors, FieldErrorVisibilityPolicy } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";
// Public Objects ------------------------------------------------------------
type FieldSelectProps = {
  errorVisibilityPolicy?: FieldErrorVisibilityPolicy;
} & Omit<SelectProps, "errors" | "handleBlur" | "handleChange" | "name" | "value">;

export function FieldSelect({ errorVisibilityPolicy, ...props }: FieldSelectProps) {
  const field = useFieldContext<string>();
  return (
    <Select
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
