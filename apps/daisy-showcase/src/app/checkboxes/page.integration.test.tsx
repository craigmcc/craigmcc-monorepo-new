import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import CheckboxesPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/checkboxes",
  };
});

vi.mock("@/components/examples/Checkboxes", () => ({
  Checkboxes: () => createElement("div", { "data-testid": "checkboxes-example" }, "Mocked Checkboxes"),
}));

function CheckboxesRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <CheckboxesPage />
    </Fragment>
  );
}

describe("Checkboxes route integration", () => {
  it("renders the Checkboxes route and marks the Checkboxes nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(CheckboxesRouteHarness));

    // Route content renders.
    expect(getByTestId("checkboxes-example")).toBeInTheDocument();

    // Checkboxes nav link is the active route.
    const checkboxesLink = getByRole("link", { name: "Checkboxes" });
    expect(checkboxesLink).toHaveAttribute("href", "/checkboxes");
    expect(checkboxesLink).toHaveAttribute("aria-current", "page");

    const checkboxesButton = getByRole("button", { name: "Checkboxes" });
    expect(checkboxesButton.className).toContain("btn-active");
    expect(checkboxesButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

