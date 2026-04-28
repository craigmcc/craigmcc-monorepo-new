import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import TooltipsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/tooltips",
  };
});

function TooltipsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <TooltipsPage />
    </Fragment>
  );
}

describe("Tooltips route integration", () => {
  it("renders the Tooltips route and marks the Tooltips nav item as active", () => {
    const { getByRole, getByText } = renderWithProviders(createElement(TooltipsRouteHarness));

    // Route content renders.
    expect(getByRole("table")).toBeInTheDocument();
    expect(getByText("Color")).toBeInTheDocument();

    // Tooltips nav link is the active route.
    const tooltipsLink = getByRole("link", { name: "Tooltips" });
    expect(tooltipsLink).toHaveAttribute("href", "/tooltips");
    expect(tooltipsLink).toHaveAttribute("aria-current", "page");

    const tooltipsButton = getByRole("button", { name: "Tooltips" });
    expect(tooltipsButton.className).toContain("btn-active");
    expect(tooltipsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});


