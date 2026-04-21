import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

const OPTIONS = [
  { label: "Option A", value: "a" },
  { label: "Option B", value: "b" },
];

const BASE_PROPS = {
  handleChange: vi.fn(),
  label: "Choose one",
  name: "choice",
  options: OPTIONS,
  value: "",
};

describe("Select", () => {
  it("renders label text", () => {
    const { getByText } = renderWithProviders(<Select {...BASE_PROPS} />);
    expect(getByText("Choose one")).toBeTruthy();
  });

  it("renders description text when provided", () => {
    const { getByText } = renderWithProviders(
      <Select {...BASE_PROPS} description="Pick the best option." />
    );
    expect(getByText("Pick the best option.")).toBeTruthy();
  });

  it("renders errors slot when provided", () => {
    const { getByText } = renderWithProviders(
      <Select {...BASE_PROPS} errors={<span>Selection required</span>} isInvalid />
    );
    expect(getByText("Selection required")).toBeTruthy();
  });

  it("does not render description or errors when omitted", () => {
    const { queryByText } = renderWithProviders(<Select {...BASE_PROPS} />);
    expect(queryByText("Pick the best option.")).toBeNull();
    expect(queryByText("Selection required")).toBeNull();
  });

  it("applies fieldsetClassName to outer fieldset", () => {
    const { container } = renderWithProviders(
      <Select {...BASE_PROPS} fieldsetClassName="my-custom-fieldset" />
    );
    expect(container.querySelector("fieldset")?.className).toContain("my-custom-fieldset");
  });

  it("renders the trigger button with default variant classes", () => {
    const { getByRole } = renderWithProviders(<Select {...BASE_PROPS} />);
    const button = getByRole("button");
    expect(button.className).toContain("select");
    expect(button.className).toContain("select-neutral");
    expect(button.className).toContain("select-md");
  });

  it("applies color and size variant classes to trigger button", () => {
    const { getByRole } = renderWithProviders(
      <Select {...BASE_PROPS} color="primary" size="lg" />
    );
    const button = getByRole("button");
    expect(button.className).toContain("select-primary");
    expect(button.className).toContain("select-lg");
  });
});



