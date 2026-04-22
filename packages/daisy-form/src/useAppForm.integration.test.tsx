import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

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
            handleChange={() => undefined}
            label="Email"
            name="email"
            value=""
          />
        )}
      </form.AppField>

      <form.AppField name="notes">
        {(field) => (
          <field.FieldTextarea
            handleChange={() => undefined}
            label="Notes"
            name="notes"
            rows={3}
            value=""
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
            handleChange={() => undefined}
            label="Country"
            name="country"
            options={[
              { label: "United States", value: "us" },
              { label: "Canada", value: "ca" },
            ]}
            value=""
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
            handleChange={() => undefined}
            label="Accept Terms"
            name="accepted"
          />
        )}
      </form.AppField>

      <button type="submit">Submit</button>
      <button onClick={() => form.reset()} type="button">Reset</button>
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
});



