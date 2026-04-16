import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import ButtonsPage from "./page";

vi.mock("@/components/examples/Buttons", () => ({
  Buttons: () => createElement("div", { "data-testid": "buttons-example" }, "Mocked Buttons"),
}));

describe("ButtonsPage", () => {
  it("renders the page wrapper and Buttons content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(ButtonsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("buttons-example")).toBeInTheDocument();
  });
});

