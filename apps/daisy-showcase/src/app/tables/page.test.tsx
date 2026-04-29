import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import TablesPage from "./page";

vi.mock("@/components/examples/Tables", () => ({
  Tables: () => createElement("div", { "data-testid": "tables-example" }, "Mocked Tables"),
}));

describe("TablesPage", () => {
  it("renders the page wrapper and Tables content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(TablesPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("tables-example")).toBeInTheDocument();
  });
});

