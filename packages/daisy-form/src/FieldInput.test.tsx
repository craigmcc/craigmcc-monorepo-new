import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldInput } from "./FieldInput";
import { useFieldContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Input", () => ({
  Input: vi.fn(() => null),
}));

vi.mock("./useAppContexts", () => ({
  useFieldContext: vi.fn(),
}));

import { Input } from "@repo/daisy-ui/Input";

describe("FieldInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps field context state/handlers into Input props", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 0,
        },
      },
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      name: "email",
      state: {
        meta: {
          errors: [{ message: "Email is required" }],
          isPristine: true,
          isTouched: false,
        },
        value: "person@example.com",
      },
    };

    vi.mocked(useFieldContext).mockReturnValue(field as never);

    renderWithProviders(
      <FieldInput
        disabled
        label="Email"
      />
    );

    expect(vi.mocked(Input).mock.calls.length).toBe(1);

    const firstCall = vi.mocked(Input).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const inputProps = firstCall?.[0] as Record<string, unknown>;
    expect(inputProps.id).toBe("email");
    expect(inputProps.name).toBe("email");
    expect(inputProps.value).toBe("person@example.com");
    expect(inputProps.disabled).toBe(true);

    (inputProps.handleBlur as () => void)();
    expect(field.handleBlur).toHaveBeenCalledTimes(1);

    (inputProps.handleChange as (nextValue: string) => void)("next@example.com");
    expect(field.handleChange).toHaveBeenCalledWith("next@example.com");

    const { queryByText } = renderWithProviders(inputProps.errors as React.ReactElement);
    expect(queryByText("Email is required")).toBeNull();
  });
});


