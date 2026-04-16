"use client";

/**
 * Tanstack Form Reset Button
 */

// External Modules ----------------------------------------------------------

import { Button, ButtonProps } from "@repo/daisy-ui/Button";

// Internal Modules ----------------------------------------------------------

import { useFormContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FormResetButtonProps = {
  // Optional label for this button [Reset]
  label?: string;
} & ButtonProps;

export function FormResetButton({label, ...props}: FormResetButtonProps) {

  const form = useFormContext();

  return (
    <Button
      aria-role="button"
      color="secondary"
      onClick={(e) => {
        e.preventDefault();
        form.reset();
      }}
      type="reset"
      {...props}
    >
      <span>{label? label : "Reset"}</span>
    </Button>
  )

}
