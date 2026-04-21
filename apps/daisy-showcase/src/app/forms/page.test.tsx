import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import FormsPage from "./page";

vi.mock("@/components/examples/Forms", () => ({
  Forms: () => createElement("div", { "data-testid": "forms-example" }, "Mocked Forms"),
}));

describe("FormsPage", () => {
  it("renders the page wrapper and Forms content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(FormsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("forms-example")).toBeInTheDocument();
  });
});

