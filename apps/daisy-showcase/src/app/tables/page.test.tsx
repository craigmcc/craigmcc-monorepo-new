import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import TablesPage from "./page";

describe("TablesPage", () => {
  it("renders the page wrapper and placeholder content", () => {
    const { container, getByText } = renderWithProviders(createElement(TablesPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByText(/Tables page coming soon/)).toBeInTheDocument();
  });
});

