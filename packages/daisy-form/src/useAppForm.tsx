"use client";

/**
 * Shared infrastructure for forms based on TanStack Form.
 */

// External Modules ----------------------------------------------------------

import { createFormHook } from "@tanstack/react-form";

// Internal Modules ----------------------------------------------------------

import { FieldInput } from "./FieldInput";
import { FormResetButton } from "./FormResetButton";
import { FormSubmitButton } from "./FormSubmitButton";
import { fieldContext, formContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FieldInput,
  },
  fieldContext,
  formComponents: {
    FormResetButton,
    FormSubmitButton,
  },
  formContext,
});
