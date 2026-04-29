import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import ModalsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/modals",
  };
});

vi.mock("@/components/examples/Modals", () => ({
  Modals: () => createElement("div", { "data-testid": "modals-example" }, "Mocked Modals"),
}));

function ModalsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <ModalsPage />
    </Fragment>
  );
}

describe("Modals route integration", () => {
  it("renders the Modals route and marks the Modals nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(ModalsRouteHarness));

    // Route content renders.
    expect(getByTestId("modals-example")).toBeInTheDocument();

    // Modals nav link is the active route.
    const modalsLink = getByRole("link", { name: "Modals" });
    expect(modalsLink).toHaveAttribute("href", "/modals");
    expect(modalsLink).toHaveAttribute("aria-current", "page");

    const modalsButton = getByRole("button", { name: "Modals" });
    expect(modalsButton.className).toContain("btn-active");
    expect(modalsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

