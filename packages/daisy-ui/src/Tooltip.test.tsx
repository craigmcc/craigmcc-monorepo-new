import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it } from "vitest";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renders children and default variant classes", () => {
    const { getByText } = renderWithProviders(
      <Tooltip tip="Helpful text">Hover me</Tooltip>,
    );

    const tooltip = getByText("Hover me");
    expect(tooltip.tagName).toBe("SPAN");
    expect(tooltip.className).toContain("tooltip");
    expect(tooltip.className).toContain("tooltip-neutral");
    expect(tooltip.className).toContain("tooltip-top");
  });

  it("applies variant classes for color and side", () => {
    const { getByText } = renderWithProviders(
      <Tooltip color="warning" side="left" tip="Warnings appear here">
        Variant tooltip
      </Tooltip>,
    );

    const tooltip = getByText("Variant tooltip");
    expect(tooltip.className).toContain("tooltip-warning");
    expect(tooltip.className).toContain("tooltip-left");
  });

  it("sets data-tip and merges custom className", () => {
    const { getByText } = renderWithProviders(
      <Tooltip className="my-custom-tooltip" tip="Custom tooltip text">
        Styled tooltip
      </Tooltip>,
    );

    const tooltip = getByText("Styled tooltip");
    expect(tooltip.getAttribute("data-tip")).toBe("Custom tooltip text");
    expect(tooltip.className).toContain("tooltip");
    expect(tooltip.className).toContain("my-custom-tooltip");
  });

  it("passes through standard span attributes", () => {
    const { getByText } = renderWithProviders(
      <Tooltip aria-label="Tooltip trigger" id="help-tip" title="hover title" tip="Accessible tooltip">
        Help icon
      </Tooltip>,
    );

    const tooltip = getByText("Help icon");
    expect(tooltip.getAttribute("id")).toBe("help-tip");
    expect(tooltip.getAttribute("title")).toBe("hover title");
    expect(tooltip.getAttribute("aria-label")).toBe("Tooltip trigger");
  });
});

