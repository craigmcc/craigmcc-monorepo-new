import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import ButtonsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/buttons",
  };
});

vi.mock("@/components/examples/Buttons", () => ({
  Buttons: () => createElement("div", { "data-testid": "buttons-example" }, "Mocked Buttons"),
}));

function ButtonsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <ButtonsPage />
    </Fragment>
  );
}

describe("Buttons route integration", () => {
  it("renders the Buttons route and marks the Buttons nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(ButtonsRouteHarness));

    // Route content renders.
    expect(getByTestId("buttons-example")).toBeInTheDocument();

    // Buttons nav link is the active route.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).toHaveAttribute("href", "/buttons");
    expect(buttonsLink).toHaveAttribute("aria-current", "page");

    const buttonsButton = getByRole("button", { name: "Buttons" });
    expect(buttonsButton.className).toContain("btn-active");
    expect(buttonsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const cardsLink = getByRole("link", { name: "Cards" });
    expect(cardsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Cards" }).className).toContain("btn-outline");
  });
});

