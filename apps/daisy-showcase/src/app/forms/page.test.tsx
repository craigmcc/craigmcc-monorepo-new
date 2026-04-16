import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import FormsPage from "./page";

describe("FormsPage", () => {
  it("renders the page wrapper and placeholder content", () => {
    const { container, getByText } = renderWithProviders(createElement(FormsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByText(/Forms page coming soon/)).toBeInTheDocument();
  });
});

