import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

const BASE_PROPS = {
  handleChange: vi.fn(),
  label: "Accept terms",
  name: "terms",
};

describe("Checkbox", () => {
  it("renders label text", () => {
    const { getByText } = renderWithProviders(<Checkbox {...BASE_PROPS} />);
    expect(getByText("Accept terms")).toBeTruthy();
  });

  it("applies default variant classes to the indicator", () => {
    const { container } = renderWithProviders(<Checkbox {...BASE_PROPS} />);
    const indicator = container.querySelector(".checkbox");
    expect(indicator?.className).toContain("checkbox-neutral");
    expect(indicator?.className).toContain("checkbox-md");
  });

  it("applies color and size variant classes", () => {
    const { container } = renderWithProviders(
      <Checkbox {...BASE_PROPS} color="primary" size="lg" />
    );
    const indicator = container.querySelector(".checkbox");
    expect(indicator?.className).toContain("checkbox-primary");
    expect(indicator?.className).toContain("checkbox-lg");
  });

  it("renders description text when provided", () => {
    const { getByText } = renderWithProviders(
      <Checkbox {...BASE_PROPS} description="You must accept to continue." />
    );
    expect(getByText("You must accept to continue.")).toBeTruthy();
  });

  it("renders errors slot when provided", () => {
    const { getByText } = renderWithProviders(
      <Checkbox {...BASE_PROPS} errors={<span>Please check this box</span>} isInvalid />
    );
    expect(getByText("Please check this box")).toBeTruthy();
  });

  it("does not render description or errors when omitted", () => {
    const { queryByText } = renderWithProviders(<Checkbox {...BASE_PROPS} />);
    expect(queryByText("You must accept to continue.")).toBeNull();
    expect(queryByText("Please check this box")).toBeNull();
  });

  it("calls handleChange when clicked", async () => {
    const handleChange = vi.fn();
    const { getByRole, user } = renderWithProviders(
      <Checkbox {...BASE_PROPS} handleChange={handleChange} />
    );
    await user.click(getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("applies fieldsetClassName to outer fieldset", () => {
    const { container } = renderWithProviders(
      <Checkbox {...BASE_PROPS} fieldsetClassName="my-custom-fieldset" />
    );
    expect(container.querySelector("fieldset")?.className).toContain("my-custom-fieldset");
  });
});


