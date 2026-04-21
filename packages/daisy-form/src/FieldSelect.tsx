"use client";
/**
 * Tanstack Form input field for a select field with a label.
 */
// External Modules ----------------------------------------------------------
import { Select, SelectProps } from "@repo/daisy-ui/Select";
// Internal Modules ----------------------------------------------------------
import { FieldErrors } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";
// Public Objects ------------------------------------------------------------
type FieldSelectProps = {
} & SelectProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FieldSelect({ handleBlur, handleChange, name, value, ...props }: FieldSelectProps) {
  const field = useFieldContext<string>();
  return (
    <Select
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
