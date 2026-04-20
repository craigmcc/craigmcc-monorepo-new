import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import ModalsPage from "./page";

vi.mock("@/components/examples/Modals", () => ({
  Modals: () => createElement("div", { "data-testid": "modals-example" }, "Mocked Modals"),
}));

describe("ModalsPage", () => {
  it("renders the page wrapper and Modals content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(ModalsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("modals-example")).toBeInTheDocument();
  });
});

