import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FieldTextarea } from "./FieldTextarea";
import { useFieldContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Textarea", () => ({
  Textarea: vi.fn(() => null),
}));

vi.mock("./useAppContexts", () => ({
  useFieldContext: vi.fn(),
}));

import { Textarea } from "@repo/daisy-ui/Textarea";

describe("FieldTextarea", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("maps field context state/handlers into Textarea props", () => {
    const field = {
      handleBlur: vi.fn(),
      handleChange: vi.fn(),
      name: "message",
      state: {
        meta: {
          errors: [{ message: "Message is required" }],
          isTouched: true,
        },
        value: "Initial message",
      },
    };

    vi.mocked(useFieldContext).mockReturnValue(field as never);

    renderWithProviders(
      <FieldTextarea
        disabled
        handleChange={() => undefined}
        label="Message"
        name="ignored"
        rows={4}
        value=""
      />
    );

    expect(vi.mocked(Textarea).mock.calls.length).toBe(1);

    const firstCall = vi.mocked(Textarea).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const textareaProps = firstCall?.[0] as Record<string, unknown>;
    expect(textareaProps.id).toBe("message");
    expect(textareaProps.name).toBe("message");
    expect(textareaProps.value).toBe("Initial message");
    expect(textareaProps.disabled).toBe(true);

    (textareaProps.handleBlur as () => void)();
    expect(field.handleBlur).toHaveBeenCalledTimes(1);

    (textareaProps.handleChange as (nextValue: string) => void)("Updated message");
    expect(field.handleChange).toHaveBeenCalledWith("Updated message");

    const { getByText } = renderWithProviders(textareaProps.errors as React.ReactElement);
    expect(getByText("Message is required")).toBeTruthy();
  });
});


