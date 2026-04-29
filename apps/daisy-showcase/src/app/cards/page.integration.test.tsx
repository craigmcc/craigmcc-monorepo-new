import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import CardsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/cards",
  };
});

vi.mock("@/components/examples/Cards", () => ({
  Cards: () => createElement("div", { "data-testid": "cards-example" }, "Mocked Cards"),
}));

function CardsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <CardsPage />
    </Fragment>
  );
}

describe("Cards route integration", () => {
  it("renders the Cards route and marks the Cards nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(CardsRouteHarness));

    // Route content renders.
    expect(getByTestId("cards-example")).toBeInTheDocument();

    // Cards nav link is the active route.
    const cardsLink = getByRole("link", { name: "Cards" });
    expect(cardsLink).toHaveAttribute("href", "/cards");
    expect(cardsLink).toHaveAttribute("aria-current", "page");

    const cardsButton = getByRole("button", { name: "Cards" });
    expect(cardsButton.className).toContain("btn-active");
    expect(cardsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

