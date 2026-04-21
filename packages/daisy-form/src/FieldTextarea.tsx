"use client";
/**
 * Tanstack Form input field for a textarea with a label.
 */
// External Modules ----------------------------------------------------------
import { Textarea, TextareaProps } from "@repo/daisy-ui/Textarea";
// Internal Modules ----------------------------------------------------------
import { FieldErrors } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";
// Public Objects ------------------------------------------------------------
type FieldTextareaProps = {
} & TextareaProps;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FieldTextarea({ handleBlur, handleChange, name, value, ...props }: FieldTextareaProps) {
  const field = useFieldContext<string>();
  return (
    <Textarea
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
