import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import CheckboxesPage from "./page";

vi.mock("@/components/examples/Checkboxes", () => ({
  Checkboxes: () => createElement("div", { "data-testid": "checkboxes-example" }, "Mocked Checkboxes"),
}));

describe("CheckboxesPage", () => {
  it("renders the page wrapper and Checkboxes content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(CheckboxesPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("checkboxes-example")).toBeInTheDocument();
  });
});

