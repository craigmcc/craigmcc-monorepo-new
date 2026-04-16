import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import CardsPage from "./page";

vi.mock("@/components/examples/Cards", () => ({
  Cards: () => createElement("div", { "data-testid": "cards-example" }, "Mocked Cards"),
}));

describe("CardsPage", () => {
  it("renders the page wrapper and Cards content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(CardsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("cards-example")).toBeInTheDocument();
  });
});

