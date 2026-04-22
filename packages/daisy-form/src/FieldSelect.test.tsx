import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldSelect } from "./FieldSelect";
import { useFieldContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Select", () => ({
  Select: vi.fn(() => null),
}));

vi.mock("./useAppContexts", () => ({
  useFieldContext: vi.fn(),
}));

import { Select } from "@repo/daisy-ui/Select";

describe("FieldSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps field context state/handlers into Select props", () => {
    const field = {
      form: {
        state: {
          submissionAttempts: 0,
        },
      },
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      name: "country",
      state: {
        meta: {
          errors: [{ message: "Country is required" }],
          isPristine: true,
          isTouched: false,
        },
        value: "ca",
      },
    };

    vi.mocked(useFieldContext).mockReturnValue(field as never);

    renderWithProviders(
      <FieldSelect
        disabled
        label="Country"
        options={[
          { label: "Canada", value: "ca" },
          { label: "United States", value: "us" },
        ]}
      />
    );

    expect(vi.mocked(Select).mock.calls.length).toBe(1);

    const firstCall = vi.mocked(Select).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const selectProps = firstCall?.[0] as Record<string, unknown>;
    expect(selectProps.id).toBe("country");
    expect(selectProps.name).toBe("country");
    expect(selectProps.value).toBe("ca");
    expect(selectProps.disabled).toBe(true);

    (selectProps.handleBlur as () => void)();
    expect(field.handleBlur).toHaveBeenCalledTimes(1);

    (selectProps.handleChange as (nextValue: string) => void)("us");
    expect(field.handleChange).toHaveBeenCalledWith("us");

    const { queryByText } = renderWithProviders(selectProps.errors as React.ReactElement);
    expect(queryByText("Country is required")).toBeNull();
  });
});


