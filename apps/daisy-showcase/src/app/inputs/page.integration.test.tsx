import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import InputsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/inputs",
  };
});

vi.mock("@/components/examples/Inputs", () => ({
  Inputs: () => createElement("div", { "data-testid": "inputs-example" }, "Mocked Inputs"),
}));

function InputsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <InputsPage />
    </Fragment>
  );
}

describe("Inputs route integration", () => {
  it("renders the Inputs route and marks the Inputs nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(InputsRouteHarness));

    // Route content renders.
    expect(getByTestId("inputs-example")).toBeInTheDocument();

    // Inputs nav link is the active route.
    const inputsLink = getByRole("link", { name: "Inputs" });
    expect(inputsLink).toHaveAttribute("href", "/inputs");
    expect(inputsLink).toHaveAttribute("aria-current", "page");

    const inputsButton = getByRole("button", { name: "Inputs" });
    expect(inputsButton.className).toContain("btn-active");
    expect(inputsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

