import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import MenusPage from "./page";

vi.mock("@/components/examples/Menus", () => ({
  Menus: () => createElement("div", { "data-testid": "menus-example" }, "Mocked Menus"),
}));

describe("MenusPage", () => {
  it("renders the page wrapper and Menus content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(MenusPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("menus-example")).toBeInTheDocument();
  });
});

