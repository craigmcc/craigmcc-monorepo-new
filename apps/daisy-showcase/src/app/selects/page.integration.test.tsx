import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import SelectsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/selects",
  };
});

vi.mock("@/components/examples/Selects", () => ({
  Selects: () => createElement("div", { "data-testid": "selects-example" }, "Mocked Selects"),
}));

function SelectsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <SelectsPage />
    </Fragment>
  );
}

describe("Selects route integration", () => {
  it("renders the Selects route and marks the Selects nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(SelectsRouteHarness));

    // Route content renders.
    expect(getByTestId("selects-example")).toBeInTheDocument();

    // Selects nav link is the active route.
    const selectsLink = getByRole("link", { name: "Selects" });
    expect(selectsLink).toHaveAttribute("href", "/selects");
    expect(selectsLink).toHaveAttribute("aria-current", "page");

    const selectsButton = getByRole("button", { name: "Selects" });
    expect(selectsButton.className).toContain("btn-active");
    expect(selectsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

