"use client";

/**
 * TanStack Form field error messages component.
 */

// External Modules ----------------------------------------------------------

import { AnyFieldApi } from "@tanstack/react-form";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

type Props = {
  // The field API for which to display errors.
  field: AnyFieldApi;
  // Optional visibility policy controlling when errors are shown.
  visibilityPolicy?: FieldErrorVisibilityPolicy;
}

export type FieldErrorVisibilityState = {
  hasSubmitAttempt: boolean;
  isPristine: boolean;
  isTouched: boolean;
};

export type FieldErrorVisibilityPolicy =
  | "submit-or-interaction"
  | "dirty-or-touched"
  | "submit-only"
  | "touched-only"
  | ((state: FieldErrorVisibilityState) => boolean);

export const DEFAULT_FIELD_ERROR_VISIBILITY_POLICY: FieldErrorVisibilityPolicy = "submit-or-interaction";

function collectErrorMessages(error: unknown, collector: string[], fieldName?: string) {
  if (error === null || error === undefined) {
    return;
  }

  if (typeof error === "string") {
    if (error.trim().length > 0) {
      collector.push(error);
    }
    return;
  }

  if (Array.isArray(error)) {
    error.forEach((entry) => collectErrorMessages(entry, collector, fieldName));
    return;
  }

  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const message = typeof record.message === "string" ? record.message : undefined;
    const formMessage = typeof record.form === "string" ? record.form : undefined;
    const hasMessage = typeof message === "string" && message.trim().length > 0;
    const hasForm = typeof formMessage === "string" && formMessage.trim().length > 0;
    const knownContainerKeys = [
      "errors",
      "issues",
      "_errors",
      "fieldErrors",
      "fields",
      "onBlur",
      "onChange",
      "onSubmit",
    ] as const;
    const hasKnownContainers = knownContainerKeys.some((key) => key in record);

    if (hasMessage) {
      collector.push(message);
    }

    if (hasForm) {
      collector.push(formMessage);
    }

    // Known schema/tanstack containers for nested validation message payloads
    collectErrorMessages(record.errors, collector, fieldName);
    collectErrorMessages(record.issues, collector, fieldName);
    collectErrorMessages(record._errors, collector, fieldName);
    if (fieldName && typeof record.fieldErrors === "object" && record.fieldErrors !== null) {
      const fieldErrorsRecord = record.fieldErrors as Record<string, unknown>;
      collectErrorMessages(fieldErrorsRecord[fieldName], collector, fieldName);
    } else {
      collectErrorMessages(record.fieldErrors, collector, fieldName);
    }
    if (fieldName && typeof record.fields === "object" && record.fields !== null) {
      const fieldsRecord = record.fields as Record<string, unknown>;
      collectErrorMessages(fieldsRecord[fieldName], collector, fieldName);
    } else {
      collectErrorMessages(record.fields, collector, fieldName);
    }
    collectErrorMessages(record.onBlur, collector, fieldName);
    collectErrorMessages(record.onChange, collector, fieldName);
    collectErrorMessages(record.onSubmit, collector, fieldName);

    // Fallback for plain nested maps like { email: [...] }.
    if (!hasMessage && !hasForm && !hasKnownContainers) {
      if (fieldName && fieldName in record) {
        collectErrorMessages(record[fieldName], collector, fieldName);
      } else {
        Object.values(record).forEach((entry) => collectErrorMessages(entry, collector, fieldName));
      }
    }

    return;
  }

  collector.push(String(error));
}

function getFieldErrorMessages(field: AnyFieldApi): string[] {
  const collector: string[] = [];
  collectErrorMessages(field.state.meta.errors, collector, field.name);
  collectErrorMessages(field.state.meta.errorMap, collector, field.name);
  return [...new Set(collector)];
}

function shouldShowFieldErrors(
  field: AnyFieldApi,
  visibilityPolicy: FieldErrorVisibilityPolicy = DEFAULT_FIELD_ERROR_VISIBILITY_POLICY,
): boolean {
  const meta = field.state.meta as {
    isPristine?: boolean;
    isTouched?: boolean;
  };
  const formState = (field.form as { state?: { submissionAttempts?: number } } | undefined)?.state;
  const visibilityState: FieldErrorVisibilityState = {
    hasSubmitAttempt: (formState?.submissionAttempts ?? 0) > 0,
    isPristine: meta.isPristine !== false,
    isTouched: Boolean(meta.isTouched),
  };

  if (typeof visibilityPolicy === "function") {
    return visibilityPolicy(visibilityState);
  }

  if (visibilityPolicy === "submit-only") {
    return visibilityState.hasSubmitAttempt;
  }

  if (visibilityPolicy === "touched-only") {
    return visibilityState.isTouched;
  }

  if (visibilityPolicy === "dirty-or-touched") {
    return visibilityState.isTouched || !visibilityState.isPristine;
  }

  return visibilityState.isTouched || !visibilityState.isPristine || visibilityState.hasSubmitAttempt;
}

export function FieldErrors({ field, visibilityPolicy }: Props) {
  const messages = getFieldErrorMessages(field);
  const isVisible = shouldShowFieldErrors(field, visibilityPolicy);

  return (
    <>
    {isVisible && messages.length > 0 && (
      <span>
        {messages.join(", ")}
      </span>
      )}
    </>
  )
}
