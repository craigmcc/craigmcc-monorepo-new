import { renderWithProviders } from "@repo/testing-react";
import { createElement, Fragment } from "react";
import { describe, expect, it, vi } from "vitest";

import { NavBar } from "@/components/layout/NavBar";

import TextareasPage from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>("next/navigation");
  return {
    ...actual,
    usePathname: () => "/textareas",
  };
});

vi.mock("@/components/examples/Textareas", () => ({
  Textareas: () => createElement("div", { "data-testid": "textareas-example" }, "Mocked Textareas"),
}));

function TextareasRouteHarness() {
  return (
    <Fragment>
      <NavBar />
      <TextareasPage />
    </Fragment>
  );
}

describe("Textareas route integration", () => {
  it("renders the Textareas route and marks the Textareas nav item as active", () => {
    const { getByRole, getByTestId } = renderWithProviders(createElement(TextareasRouteHarness));

    // Route content renders.
    expect(getByTestId("textareas-example")).toBeInTheDocument();

    // Textareas nav link is the active route.
    const textareasLink = getByRole("link", { name: "Textareas" });
    expect(textareasLink).toHaveAttribute("href", "/textareas");
    expect(textareasLink).toHaveAttribute("aria-current", "page");

    const textareasButton = getByRole("button", { name: "Textareas" });
    expect(textareasButton.className).toContain("btn-active");
    expect(textareasButton.className).not.toContain("btn-outline");

    // A different route remains inactive.
    const buttonsLink = getByRole("link", { name: "Buttons" });
    expect(buttonsLink).not.toHaveAttribute("aria-current");
    expect(getByRole("button", { name: "Buttons" }).className).toContain("btn-outline");
  });
});

