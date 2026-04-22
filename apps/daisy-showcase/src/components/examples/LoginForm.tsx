"use client";

/**
 * LoginForm component demonstrating daisy-form + TanStack + Zod validation.
 */

import { useAppForm } from "@repo/daisy-form/useAppForm";
import type { FieldErrorVisibilityPolicy } from "@repo/daisy-form/FieldErrors";
import { z } from "zod";

// Zod schema for full-form validation via useAppForm validators
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = { email: string; password: string };

interface LoginFormProps {
  errorVisibilityPolicy?: FieldErrorVisibilityPolicy;
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
}

export function LoginForm({ errorVisibilityPolicy, onSubmit }: LoginFormProps) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies LoginFormValues,
    onSubmit: async ({ value }) => {
      await onSubmit?.(value);
    },
    validators: {
      onBlur: loginSchema,
      onChange: loginSchema,
      onSubmit: loginSchema,
    },
  });

  return (
    <form
      data-testid="login-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.AppField name="email">
        {(field) => (
          <field.FieldInput
            description="We'll never share your email."
            errorVisibilityPolicy={errorVisibilityPolicy}
            label="Email"
            placeholder="you@example.com"
            type="email"
          />
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.FieldInput
            errorVisibilityPolicy={errorVisibilityPolicy}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />
        )}
      </form.AppField>

      <form.AppForm>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form.FormSubmitButton className="w-full" label="Sign In" />
          <form.FormResetButton className="w-full" />
        </div>
      </form.AppForm>
    </form>
  );
}





