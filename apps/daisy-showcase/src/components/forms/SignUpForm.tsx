"use client";

/**
 * Form for the Sign Up page.
 *
 * @packageDocumentation
 */

// External Modules ----------------------------------------------------------

import { ActionResult } from "@repo/daisy-form/ActionResult";
import { Card } from "@repo/daisy-ui/Card";
import { ServerResult } from "@repo/daisy-form/ServerResult";
import { useAppForm } from "@repo/daisy-form/useAppForm";
import { clientLogger as logger } from "@repo/shared-utils/ClientLogger";
//import { useRouter } from "next/navigation";
import {  useState } from "react";
import { toast } from "react-toastify";

// Internal Modules ----------------------------------------------------------

import { doSignUpAction } from "@/actions/AuthActions";
import { useCurrentProfileContext } from "@/contexts/CurrentProfileContext";
import { Profile } from "@/types/types";
import { SignUpSchema, type SignUpSchemaType } from "@/zod-schemas/SignUpSchema";

// Public Objects ------------------------------------------------------------

export function SignUpForm() {

  const [result, setResult] = useState<ActionResult<Profile> | null>(null);
  const { setCurrentProfile } = useCurrentProfileContext();
//  const router = useRouter();

  const defaultValues: SignUpSchemaType = {
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  }

  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await submitForm(value);
    },
    validators: {
      onBlur: SignUpSchema,
      onChange: SignUpSchema,
    },
  });

  async function submitForm(formData: SignUpSchemaType) {

    logger.trace({
      context: "SignUpForm.submitForm.input",
      formData: {
        ...formData,
        confirmPassword: "*REDACTED*",
        password:"*REDACTED*",
      }
    });

    const response = await doSignUpAction(formData);
    if (response.model) {
      setResult(null);
      setCurrentProfile(response.model);
      toast.success(`Profile for '${formData.firstName} ${formData.lastName}' was successfully created`);
      // In a real application, we would redirect the user to the home page
//      router.push("/");
    } else {
      setResult(response);
    }

  }

  return (
    <Card border className="w-lg" color="info">
      <Card.Body>
        <Card.Title>
          <p>Sign Up</p>
        </Card.Title>
        <ServerResult result={result}/>
        <form
          className="flex flex-col gap-2"
          name="SignUpForm"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex gap-2">
            <form.AppField name="email">
              {(field) =>
                <field.FieldInput
                  autoFocus
                  label="Email"
                  placeholder="Your email address"
                />}
            </form.AppField>
          </div>
          <div className="flex flex-row gap-2">
            <form.AppField name="firstName">
              {(field) =>
                <field.FieldInput
                  label="First Name"
                  placeholder="Your First Name"
                />}
            </form.AppField>
            <form.AppField name="lastName">
              {(field) =>
                <field.FieldInput
                  label="Last Name"
                  placeholder="Your Last Name"
                />}
            </form.AppField>
          </div>
          <div className="flex flex-row 2-full gap-2">
            <form.AppField name="password">
              {(field) =>
                <field.FieldInput
                  label="Password"
                  placeholder="Your Password"
                  type="password"
                />}
            </form.AppField>
            <form.AppField name="confirmPassword">
              {(field) =>
                <field.FieldInput
                  label="Confirm Password"
                  placeholder="Confirm Your Password"
                  type="password"
                />}
            </form.AppField>
          </div>
            <form.AppForm>
              <div className="flex flex-row justify-center pt-2 gap-4">
                <form.FormSubmitButton label="Sign Up" />
                <form.FormResetButton/>
                </div>
            </form.AppForm>
        </form>
      </Card.Body>
    </Card>
  )

}
