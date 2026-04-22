import { renderWithProviders } from "@repo/testing-react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { FormSubmitButton } from "./FormSubmitButton";
import { useFormContext } from "./useAppContexts";

vi.mock("@repo/daisy-ui/Button", () => ({
  Button: vi.fn((props: Record<string, unknown>) => {
    return (
      <button disabled={Boolean(props.disabled)} onClick={props.onClick as never} type={props.type as "button" | "submit" | "reset"}>
        {props.children as never}
      </button>
    );
  }),
}));

vi.mock("lucide-react", () => ({
  LoaderCircle: (props: Record<string, unknown>) => <svg data-testid="loader-circle" {...props} />,
}));

vi.mock("./useAppContexts", () => ({
  useFormContext: vi.fn(),
}));

import { Button } from "@repo/daisy-ui/Button";

describe("FormSubmitButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("disables submit and shows loader while submitting", () => {
    const form = {
      Subscribe: ({ children }: { children: (value: [boolean, boolean]) => React.ReactNode }) => (
        <>{children([true, true])}</>
      ),
    };

    vi.mocked(useFormContext).mockReturnValue(form as never);

    const { getByTestId } = renderWithProviders(<FormSubmitButton />);

    expect(vi.mocked(Button).mock.calls.length).toBe(1);
    const firstCall = vi.mocked(Button).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const buttonProps = firstCall?.[0] as Record<string, unknown>;
    expect(buttonProps.type).toBe("submit");
    expect(buttonProps.color).toBe("primary");
    expect(buttonProps.disabled).toBe(true);
    expect(getByTestId("loader-circle")).toBeTruthy();
  });

  it("uses label and enabled state when form can submit", () => {
    const form = {
      Subscribe: ({ children }: { children: (value: [boolean, boolean]) => React.ReactNode }) => (
        <>{children([true, false])}</>
      ),
    };

    vi.mocked(useFormContext).mockReturnValue(form as never);

    const { getByText } = renderWithProviders(<FormSubmitButton label="Create" />);

    const firstCall = vi.mocked(Button).mock.calls[0];
    expect(firstCall).toBeTruthy();
    const buttonProps = firstCall?.[0] as Record<string, unknown>;
    expect(buttonProps.disabled).toBe(false);
    expect(getByText("Create")).toBeTruthy();
  });
});


