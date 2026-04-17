"use client";

/**
 * Tanstack Form input field for a text field with a label.
 */

// External Modules ----------------------------------------------------------

import { Input, InputProps } from "@repo/daisy-ui/Input";

// Internal Modules ----------------------------------------------------------

import { FieldErrors } from "./FieldErrors";
import { useFieldContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FieldInputProps = {
} & InputProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FieldInput({ handleBlur, handleChange, name, value, ...props }: FieldInputProps) {

  const field = useFieldContext<string>();

  return (
    <Input
      errors={<FieldErrors field={field}/>}
      id={field.name}
      name={field.name}
      handleBlur={field.handleBlur}
      handleChange={(value) => field.handleChange(value)}
      value={field.state.value}
      {...props}
    />
  )

}
