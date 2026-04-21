import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./Textarea";

const BASE_PROPS = {
  handleChange: vi.fn(),
  label: "Comments",
  name: "comments",
  value: "",
};

describe("Textarea", () => {
  it("renders label and textarea element", () => {
    const { getByRole, getByLabelText } = renderWithProviders(<Textarea {...BASE_PROPS} />);
    expect(getByRole("textbox")).toBeTruthy();
    expect(getByLabelText("Comments")).toBeTruthy();
  });

  it("applies default variant classes", () => {
    const { getByRole } = renderWithProviders(<Textarea {...BASE_PROPS} />);
    const textarea = getByRole("textbox");
    expect(textarea.className).toContain("textarea");
    expect(textarea.className).toContain("textarea-neutral");
    expect(textarea.className).toContain("textarea-md");
  });

  it("applies color and size variant classes", () => {
    const { getByRole } = renderWithProviders(
      <Textarea {...BASE_PROPS} color="secondary" size="sm" />
    );
    const textarea = getByRole("textbox");
    expect(textarea.className).toContain("textarea-secondary");
    expect(textarea.className).toContain("textarea-sm");
  });

  it("renders description text when provided", () => {
    const { getByText } = renderWithProviders(
      <Textarea {...BASE_PROPS} description="Max 500 characters." />
    );
    expect(getByText("Max 500 characters.")).toBeTruthy();
  });

  it("renders errors slot when provided", () => {
    const { getByText } = renderWithProviders(
      <Textarea {...BASE_PROPS} errors={<span>Comments are required</span>} isInvalid />
    );
    expect(getByText("Comments are required")).toBeTruthy();
  });

  it("does not render description or errors when omitted", () => {
    const { queryByText } = renderWithProviders(<Textarea {...BASE_PROPS} />);
    expect(queryByText("Max 500 characters.")).toBeNull();
    expect(queryByText("Comments are required")).toBeNull();
  });

  it("sets aria-invalid when isInvalid=true", () => {
    const { getByRole } = renderWithProviders(<Textarea {...BASE_PROPS} isInvalid />);
    expect(getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("renders with specified rows attribute", () => {
    const { getByRole } = renderWithProviders(<Textarea {...BASE_PROPS} rows={6} />);
    expect(getByRole("textbox").getAttribute("rows")).toBe("6");
  });

  it("applies fieldsetClassName to outer fieldset", () => {
    const { container } = renderWithProviders(
      <Textarea {...BASE_PROPS} fieldsetClassName="my-custom-fieldset" />
    );
    expect(container.querySelector("fieldset")?.className).toContain("my-custom-fieldset");
  });
});


