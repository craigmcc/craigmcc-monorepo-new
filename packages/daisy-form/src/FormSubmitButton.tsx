"use client";

/**
 * Tanstack Form Submit Button
 */

// External Modules ----------------------------------------------------------

import { Button, ButtonProps } from "@repo/daisy-ui/Button";
import { LoaderCircle } from "lucide-react";

// Internal Modules ----------------------------------------------------------

import { useFormContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

type FormSubmitButtonProps = {
  // Optional label for this button [Save]
  label?: string;
} & ButtonProps;

export function FormSubmitButton({label, ...props}: FormSubmitButtonProps) {

  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) =>
        [state.canSubmit, state.isSubmitting]}
    >
      {([canSubmit, isSubmitting]) => (
        <Button
          aria-role="button"
          color="primary"
          disabled={!canSubmit || isSubmitting}
          type="submit"
          {...props}
        >
          {isSubmitting
            ? <LoaderCircle className="animate-spin"/>
            : <span>{label ? label : "Save"}</span>
          }
        </Button>
      )}
    </form.Subscribe>
  )

}
