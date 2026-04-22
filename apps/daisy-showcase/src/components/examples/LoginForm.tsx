"use client";

import * as React from "react";

/**
 * LoginForm component demonstrating useAppForm with Zod validation.
 * Shows how validation errors flow through to daisy-ui Input components.
 */

import { Input } from "@repo/daisy-ui/Input";
import { z } from "zod";

// Zod schemas for individual field validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");
const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

type LoginFormValues = { email: string; password: string };

interface LoginFormProps {
  onSubmit?: (values: LoginFormValues) => void | Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [values, setValues] = React.useState<LoginFormValues>({ email: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string | null>>({ email: null, password: null });

  const handleValidateAndSubmit = () => {
    const emailResult = emailSchema.safeParse(values.email);
    const passwordResult = passwordSchema.safeParse(values.password);

    const newErrors = {
      email: emailResult.success
        ? null
        : emailResult.error.issues?.[0]?.message || "Invalid email",
      password: passwordResult.success
        ? null
        : passwordResult.error.issues?.[0]?.message || "Invalid password",
    };
    setErrors(newErrors);

    if (emailResult.success && passwordResult.success) {
      onSubmit?.(values);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        handleValidateAndSubmit();
      }}
      className="space-y-4"
    >
      <Input
        errors={errors.email ? <span>{errors.email}</span> : undefined}
        handleChange={(newValue) => {
          setValues((prev) => ({ ...prev, email: newValue }));
          if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
        }}
        label="Email"
        name="email"
        placeholder="you@example.com"
        type="email"
        value={values.email}
      />

      <Input
        errors={errors.password ? <span>{errors.password}</span> : undefined}
        handleChange={(newValue) => {
          setValues((prev) => ({ ...prev, password: newValue }));
          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
        }}
        label="Password"
        name="password"
        placeholder="••••••••"
        type="password"
        value={values.password}
      />

      <button
        type="submit"
        className="btn btn-primary w-full"
      >
        Sign In
      </button>
    </form>
  );
}





