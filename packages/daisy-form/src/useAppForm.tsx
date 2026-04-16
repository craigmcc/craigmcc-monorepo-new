"use client";

/**
 * Shared infrastructure for forms based on TanStack Form.
 */

// External Modules ----------------------------------------------------------

import { createFormHook } from "@tanstack/react-form";

// Internal Modules ----------------------------------------------------------

//import { FormInput } from "./FormInput";
import { FormResetButton } from "./FormResetButton";
import { FormSubmitButton } from "./FormSubmitButton";
import { fieldContext, formContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
//    FormInput,
  },
  fieldContext,
  formComponents: {
    FormResetButton,
    FormSubmitButton,
  },
  formContext,
});
