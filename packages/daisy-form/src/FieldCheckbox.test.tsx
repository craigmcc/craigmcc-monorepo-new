import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldCheckbox } from "./FieldCheckbox";
import { useFieldContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Checkbox", () => ({
  Checkbox: vi.fn(() => null),
}));

vi.mock("./useAppContexts", () => ({
  useFieldContext: vi.fn(),
}));

import { Checkbox } from "@repo/daisy-ui/Checkbox";

describe("FieldCheckbox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps field context state/handlers into Checkbox props", () => {
    const field = {
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      name: "terms",
      state: {
        meta: {
          errors: [{ message: "You must accept the terms" }],
          isTouched: true,
        },
        value: true,
      },
    };

    vi.mocked(useFieldContext).mockReturnValue(field as never);

    renderWithProviders(
      <FieldCheckbox
        disabled
        handleChange={() => undefined}
        label="Accept Terms"
        name="ignored"
        value={false}
      />
    );

    expect(vi.mocked(Checkbox).mock.calls.length).toBe(1);

    const firstCall = vi.mocked(Checkbox).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const checkboxProps = firstCall?.[0] as Record<string, unknown>;
    expect(checkboxProps.id).toBe("terms");
    expect(checkboxProps.name).toBe("terms");
    expect(checkboxProps.value).toBe(true);
    expect(checkboxProps.disabled).toBe(true);

    (checkboxProps.handleBlur as () => void)();
    expect(field.handleBlur).toHaveBeenCalledTimes(1);

    (checkboxProps.handleChange as (nextValue: boolean) => void)(false);
    expect(field.handleChange).toHaveBeenCalledWith(false);

    const { getByText } = renderWithProviders(checkboxProps.errors as React.ReactElement);
    expect(getByText("You must accept the terms")).toBeTruthy();
  });
});


