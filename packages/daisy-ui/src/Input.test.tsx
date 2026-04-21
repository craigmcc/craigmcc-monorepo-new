import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

const BASE_PROPS = {
  handleChange: vi.fn(),
  label: "Email",
  name: "email",
  value: "",
};

describe("Input", () => {
  it("renders label and input element", () => {
    const { getByRole, getByLabelText } = renderWithProviders(<Input {...BASE_PROPS} />);
    expect(getByRole("textbox")).toBeTruthy();
    expect(getByLabelText("Email")).toBeTruthy();
  });

  it("applies default variant classes", () => {
    const { getByRole } = renderWithProviders(<Input {...BASE_PROPS} />);
    const input = getByRole("textbox");
    expect(input.className).toContain("input");
    expect(input.className).toContain("input-neutral");
    expect(input.className).toContain("input-md");
  });

  it("applies color and size variant classes", () => {
    const { getByRole } = renderWithProviders(
      <Input {...BASE_PROPS} color="primary" size="lg" />
    );
    const input = getByRole("textbox");
    expect(input.className).toContain("input-primary");
    expect(input.className).toContain("input-lg");
  });

  it("renders description text when provided", () => {
    const { getByText } = renderWithProviders(
      <Input {...BASE_PROPS} description="Help text here." />
    );
    expect(getByText("Help text here.")).toBeTruthy();
  });

  it("renders errors slot when provided", () => {
    const { getByText } = renderWithProviders(
      <Input {...BASE_PROPS} errors={<span>Field required</span>} isInvalid />
    );
    expect(getByText("Field required")).toBeTruthy();
  });

  it("does not render description or errors when omitted", () => {
    const { queryByText } = renderWithProviders(<Input {...BASE_PROPS} />);
    expect(queryByText("Help text here.")).toBeNull();
    expect(queryByText("Field required")).toBeNull();
  });

  it("sets aria-invalid when isInvalid=true", () => {
    const { getByRole } = renderWithProviders(<Input {...BASE_PROPS} isInvalid />);
    expect(getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("calls handleChange when value changes", async () => {
    const handleChange = vi.fn();
    const { getByRole, user } = renderWithProviders(
      <Input {...BASE_PROPS} handleChange={handleChange} />
    );
    await user.type(getByRole("textbox"), "a");
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies fieldsetClassName to outer fieldset", () => {
    const { container } = renderWithProviders(
      <Input {...BASE_PROPS} fieldsetClassName="my-custom-fieldset" />
    );
    expect(container.querySelector("fieldset")?.className).toContain("my-custom-fieldset");
  });
});


