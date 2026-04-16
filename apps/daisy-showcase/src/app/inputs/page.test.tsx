import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import InputsPage from "./page";

vi.mock("@/components/examples/Inputs", () => ({
  Inputs: () => createElement("div", { "data-testid": "inputs-example" }, "Mocked Inputs"),
}));

describe("InputsPage", () => {
  it("renders the page wrapper and Inputs content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(InputsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("inputs-example")).toBeInTheDocument();
  });
});

