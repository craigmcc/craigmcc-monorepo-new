import { renderWithProviders } from "@repo/testing-react";
import { createElement } from "react";
import { describe, expect, it, vi } from "vitest";

import SignupsPage from "./page";

vi.mock("@/components/examples/Signups", () => ({
  Signups: () => createElement("div", { "data-testid": "signups-example" }, "Mocked Signups"),
}));

describe("SignupsPage", () => {
  it("renders the page wrapper and Signups content", () => {
    const { container, getByTestId } = renderWithProviders(createElement(SignupsPage));

    expect(container.firstChild).toHaveClass("p-4");
    expect(getByTestId("signups-example")).toBeInTheDocument();
  });
});

