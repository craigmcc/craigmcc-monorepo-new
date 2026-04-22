import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { useAppForm } from "./useAppForm";

type TestFormValues = {
  accepted: boolean;
  country: string;
  email: string;
  notes: string;
};

function IntegrationTestForm({ onSubmit }: { onSubmit: (values: TestFormValues) => void }) {
  const form = useAppForm({
    defaultValues: {
      accepted: false,
      country: "us",
      email: "",
      notes: "",
    } as TestFormValues,
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.AppField
        name="email"
        validators={{
          onSubmit: ({ value }) => (value ? undefined : { message: "Email is required" }),
        }}
      >
        {(field) => (
          <field.FieldInput
            label="Email"
          />
        )}
      </form.AppField>

      <form.AppField name="notes">
        {(field) => (
          <field.FieldTextarea
            label="Notes"
            rows={3}
          />
        )}
      </form.AppField>

      <form.AppField
        name="country"
        validators={{
          onSubmit: ({ value }) => (value ? undefined : { message: "Country is required" }),
        }}
      >
        {(field) => (
          <field.FieldSelect
            label="Country"
            options={[
              { label: "United States", value: "us" },
              { label: "Canada", value: "ca" },
            ]}
          />
        )}
      </form.AppField>

      <form.AppField
        name="accepted"
        validators={{
          onSubmit: ({ value }) => (value ? undefined : { message: "Please accept the terms" }),
        }}
      >
        {(field) => (
          <field.FieldCheckbox
            label="Accept Terms"
          />
        )}
      </form.AppField>

      <button type="submit">Submit</button>
      <button onClick={() => form.reset()} type="button">Reset</button>
    </form>
  );
}

type SchemaFormValues = {
  email: string;
  password: string;
};

const schemaValidators = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

function SchemaValidatorsForm({ onSubmit }: { onSubmit: (values: SchemaFormValues) => void }) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SchemaFormValues,
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
    validators: {
      onBlur: schemaValidators,
      onChange: schemaValidators,
      onSubmit: schemaValidators,
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => <field.FieldInput label="Email" type="email" />}
      </form.AppField>

      <form.AppField name="password">
        {(field) => <field.FieldInput label="Password" type="password" />}
      </form.AppField>

      <button type="submit">Submit</button>
    </form>
  );
}

function TouchedOnlyVisibilityForm() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies SchemaFormValues,
    onSubmit: () => {},
    validators: {
      onBlur: schemaValidators,
      onChange: schemaValidators,
      onSubmit: schemaValidators,
    },
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.AppField name="email">
        {(field) => (
          <field.FieldInput
            errorVisibilityPolicy="touched-only"
            label="Email"
            type="email"
          />
        )}
      </form.AppField>

      <form.AppField name="password">
        {(field) => (
          <field.FieldInput
            errorVisibilityPolicy="touched-only"
            label="Password"
            type="password"
          />
        )}
      </form.AppField>

      <button type="submit">Submit</button>
    </form>
  );
}

describe("useAppForm integration", () => {
  it("submits current field values through onSubmit", async () => {
    const onSubmit = vi.fn();

    const { getByLabelText, getByRole, getByText, user } = renderWithProviders(
      <IntegrationTestForm onSubmit={onSubmit} />
    );

    await user.type(getByLabelText("Email"), "person@example.com");
    await user.type(getByLabelText("Notes"), "A few notes.");
    await user.click(getByRole("checkbox", { name: "Accept Terms" }));
    await user.click(getByText("Submit"));

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit).toHaveBeenCalledWith({
      accepted: true,
      country: "us",
      email: "person@example.com",
      notes: "A few notes.",
    });
  });

  it("shows submit-time validation errors and prevents submission", async () => {
    const onSubmit = vi.fn();

    const { getByLabelText, getByRole, getByText, queryByText, user } = renderWithProviders(
      <IntegrationTestForm onSubmit={onSubmit} />
    );

    await user.click(getByText("Submit"));

    expect(getByText("Email is required")).toBeTruthy();
    expect(getByText("Please accept the terms")).toBeTruthy();
    expect(onSubmit).toHaveBeenCalledTimes(0);

    await user.type(getByLabelText("Email"), "person@example.com");
    await user.click(getByRole("checkbox", { name: "Accept Terms" }));
    await user.click(getByText("Submit"));

    await vi.waitFor(() => {
      expect(queryByText("Email is required")).toBeNull();
      expect(queryByText("Please accept the terms")).toBeNull();
    });
  });

  it("resets values back to defaults", async () => {
    const onSubmit = vi.fn();

    const { getByLabelText, getByRole, getByText, user } = renderWithProviders(
      <IntegrationTestForm onSubmit={onSubmit} />
    );

    const emailInput = getByLabelText("Email") as HTMLInputElement;
    const notesTextarea = getByLabelText("Notes") as HTMLTextAreaElement;
    const termsCheckbox = getByRole("checkbox", { name: "Accept Terms" }) as HTMLInputElement;

    await user.type(emailInput, "temp@example.com");
    await user.type(notesTextarea, "Temporary notes");
    await user.click(termsCheckbox);

    expect(emailInput.value).toBe("temp@example.com");
    expect(notesTextarea.value).toBe("Temporary notes");
    expect(termsCheckbox.checked).toBe(true);

    await user.click(getByText("Reset"));

    expect(emailInput.value).toBe("");
    expect(notesTextarea.value).toBe("");
    expect(termsCheckbox.checked).toBe(false);
  });

  it("supports object-schema validators across blur/change/submit", async () => {
    const onSubmit = vi.fn();

    const { getByLabelText, getByText, queryByText, user } = renderWithProviders(
      <SchemaValidatorsForm onSubmit={onSubmit} />
    );

    const emailInput = getByLabelText("Email");
    const passwordInput = getByLabelText("Password");

    await user.click(emailInput);
    await user.tab();

    await vi.waitFor(() => {
      expect(getByText(/Email is required/)).toBeTruthy();
    });

    await user.type(emailInput, "not-an-email");
    await vi.waitFor(() => {
      expect(getByText(/Please enter a valid email address/)).toBeTruthy();
    });
    await user.type(passwordInput, "short");
    await vi.waitFor(() => {
      expect(getByText(/Password must be at least 8 characters/)).toBeTruthy();
    });

    await user.click(getByText("Submit"));
    expect(onSubmit).toHaveBeenCalledTimes(0);

    await user.clear(emailInput);
    await user.type(emailInput, "person@example.com");
    await user.clear(passwordInput);
    await user.type(passwordInput, "securepass123");
    await user.click(getByText("Submit"));

    await vi.waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(queryByText("Email is required")).toBeNull();
      expect(queryByText("Please enter a valid email address")).toBeNull();
      expect(queryByText("Password must be at least 8 characters")).toBeNull();
    });
  });

  it("can customize visibility with touched-only policy", async () => {
    const { getByLabelText, getByText, queryByText, user } = renderWithProviders(
      <TouchedOnlyVisibilityForm />
    );

    expect(queryByText(/Please enter a valid email address/)).toBeNull();

    await user.type(getByLabelText("Email"), "not-an-email");
    await vi.waitFor(() => {
      expect(getByText(/Please enter a valid email address/)).toBeTruthy();
    });
    expect(queryByText(/Password is required/)).toBeNull();
  });
});



