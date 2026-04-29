import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import TablesPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/tables",
  };
});

vi.mock("@/components/examples/Tables", () => ({
  Tables: () => createElement("div", { "data-testid": "tables-example" }, "Mocked Tables"),
}));

function TablesRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <TablesPage />
    </Fragment>
  );
}

describe("Tables route integration", () => {
  it("renders the Tables route and marks the Tables nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(TablesRouteHarness));

    // Route content renders.
    expect(getByTestId("tables-example")).toBeInTheDocument();

    // Tables nav link is the active route.
    const tablesLink = getByRole("link", { name: "Tables" });
    expect(tablesLink).toHaveAttribute("href", "/tables");
    expect(tablesLink).toHaveAttribute("aria-current", "page");

    const tablesButton = getByRole("button", { name: "Tables" });
    expect(tablesButton.className).toContain("btn-active");
    expect(tablesButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

