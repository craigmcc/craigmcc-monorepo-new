import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import MenusPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/menus",
  };
});

vi.mock("@/components/examples/Menus", () => ({
  Menus: () => createElement("div", { "data-testid": "menus-example" }, "Mocked Menus"),
}));

function MenusRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <MenusPage />
    </Fragment>
  );
}

describe("Menus route integration", () => {
  it("renders the Menus route and marks the Menus nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(MenusRouteHarness));

    // Route content renders.
    expect(getByTestId("menus-example")).toBeInTheDocument();

    // Menus nav link is the active route.
    const menusLink = getByRole("link", { name: "Menus" });
    expect(menusLink).toHaveAttribute("href", "/menus");
    expect(menusLink).toHaveAttribute("aria-current", "page");

    const menusButton = getByRole("button", { name: "Menus" });
    expect(menusButton.className).toContain("btn-active");
    expect(menusButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

