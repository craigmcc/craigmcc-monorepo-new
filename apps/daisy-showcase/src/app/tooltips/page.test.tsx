import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import TooltipsPage from "./page";

vi.mock("@/components/examples/Tooltips", () => ({
  Tooltips: () => createElement("div", { "data-testid": "tooltips-example" }, "Mocked Tooltips"),
}));

describe("TooltipsPage", () => {
  it("renders the page wrapper and Tooltips content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(TooltipsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("tooltips-example")).toBeInTheDocument();
  });
});

