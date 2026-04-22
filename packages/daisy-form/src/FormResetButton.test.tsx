import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FormResetButton } from "./FormResetButton";
import { useFormContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Button", () => ({
  Button: vi.fn((props: Record<string, unknown>) => {
    return (
      <button onClick={props.onClick as never} type={props.type as "button" | "submit" | "reset"}>
        {props.children as never}
      </button>
    );
  }),
}));

vi.mock("./useAppContexts", () => ({
  useFormContext: vi.fn(),
}));

import { Button } from "@repo/daisy-ui/Button";

describe("FormResetButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("wires click to form.reset and prevents default", async () => {
    const userReset = vi.fn();
    const form = {
      reset: userReset,
    };

    vi.mocked(useFormContext).mockReturnValue(form as never);

    const { getByText, user } = renderWithProviders(<FormResetButton label="Clear" />);

    const firstCall = vi.mocked(Button).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const buttonProps = firstCall?.[0] as Record<string, unknown>;
    expect(buttonProps.type).toBe("reset");
    expect(buttonProps.color).toBe("secondary");
    expect(getByText("Clear")).toBeTruthy();

    await user.click(getByText("Clear"));
    expect(userReset).toHaveBeenCalledTimes(1);
  });
});


