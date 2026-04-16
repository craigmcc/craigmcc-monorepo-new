import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import SelectsPage from "./page";

vi.mock("@/components/examples/Selects", () => ({
  Selects: () => createElement("div", { "data-testid": "selects-example" }, "Mocked Selects"),
}));

describe("SelectsPage", () => {
  it("renders the page wrapper and Selects content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(SelectsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("selects-example")).toBeInTheDocument();
  });
});

