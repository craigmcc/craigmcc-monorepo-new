import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import SignupsPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/signups",
  };
});

vi.mock("@/components/examples/Signups", () => ({
  Signups: () => createElement("div", { "data-testid": "signups-example" }, "Mocked Signups"),
}));

function SignupsRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <SignupsPage />
    </Fragment>
  );
}

describe("Signups route integration", () => {
  it("renders the Signups route and marks the SignUps nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(SignupsRouteHarness));

    // Route content renders.
    expect(getByTestId("signups-example")).toBeInTheDocument();

    // SignUps nav link is the active route.
    const signupsLink = getByRole("link", { name: "SignUps" });
    expect(signupsLink).toHaveAttribute("href", "/signups");
    expect(signupsLink).toHaveAttribute("aria-current", "page");

    const signupsButton = getByRole("button", { name: "SignUps" });
    expect(signupsButton.className).toContain("btn-active");
    expect(signupsButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

