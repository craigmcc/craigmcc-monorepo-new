import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders with default classes", () => {
    const { getByRole } = renderWithProviders(<Button>Default</Button>);

    const button = getByRole("button", { name: "Default" });
    expect(button.className).toContain("btn");
    expect(button.className).toContain("btn-primary");
    expect(button.className).toContain("btn-md");
  });

  it("applies variant classes", () => {
    const { getByRole } = renderWithProviders(
      <Button active color="secondary" outline size="lg" soft>
        Variants
      </Button>
    );

    const button = getByRole("button", { name: "Variants" });
    expect(button.className).toContain("btn-active");
    expect(button.className).toContain("btn-secondary");
    expect(button.className).toContain("btn-outline");
    expect(button.className).toContain("btn-lg");
    expect(button.className).toContain("btn-soft");
  });

  it("calls onPress when clicked", async () => {
    const onPress = vi.fn();
    const { getByRole, user } = renderWithProviders(
      <Button onPress={onPress}>Click Me</Button>
    );

    await user.click(getByRole("button", { name: "Click Me" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});


