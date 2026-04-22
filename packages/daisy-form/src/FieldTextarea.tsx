"use client";
/**
 * Tanstack Form input field for a textarea with a label.
 */
// External Modules ----------------------------------------------------------
import { Textarea, TextareaProps } from "@repo/daisy-ui/Textarea";
// Internal Modules ----------------------------------------------------------
import { FieldErrors, FieldErrorVisibilityPolicy } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";
// Public Objects ------------------------------------------------------------
type FieldTextareaProps = {
  errorVisibilityPolicy?: FieldErrorVisibilityPolicy;
} & Omit<TextareaProps, "errors" | "handleBlur" | "handleChange" | "name" | "value">;

export function FieldTextarea({ errorVisibilityPolicy, ...props }: FieldTextareaProps) {
  const field = useFieldContext<string>();
  return (
    <Textarea
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
