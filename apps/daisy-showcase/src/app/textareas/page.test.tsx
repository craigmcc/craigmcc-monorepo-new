import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import TextareasPage from "./page";

vi.mock("@/components/examples/Textareas", () => ({
  Textareas: () => createElement("div", { "data-testid": "textareas-example" }, "Mocked Textareas"),
}));

describe("TextareasPage", () => {
  it("renders the page wrapper and Textareas content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(TextareasPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("textareas-example")).toBeInTheDocument();
  });
});
