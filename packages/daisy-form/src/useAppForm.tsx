"use client";

/**
 * Shared infrastructure for forms based on TanStack Form.
 */

// External Modules ----------------------------------------------------------

import { createFormHook } from "@tanstack/react-form";

// Internal Modules ----------------------------------------------------------

import { FieldCheckbox } from "./FieldCheckbox";
import { FieldInput } from "./FieldInput";
import { FieldSelect } from "./FieldSelect";
import { FieldTextarea } from "./FieldTextarea";
import { FormResetButton } from "./FormResetButton";
import { FormSubmitButton } from "./FormSubmitButton";
import { fieldContext, formContext } from "./useAppContexts";

// Public Objects ------------------------------------------------------------

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    FieldCheckbox,
    FieldInput,
    FieldSelect,
    FieldTextarea,
  },
  fieldContext,
  formComponents: {
    FormResetButton,
    FormSubmitButton,
  },
  formContext,
});
