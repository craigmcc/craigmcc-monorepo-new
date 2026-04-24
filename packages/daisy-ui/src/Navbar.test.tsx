import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it } from "vitest";

import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders children", () => {
    const { getByText } = renderWithProviders(
      <Navbar>
        <Navbar.Start>Brand</Navbar.Start>
      </Navbar>
    );
    expect(getByText("Brand")).toBeTruthy();
  });

  it("applies default base classes", () => {
    const { container } = renderWithProviders(<Navbar>Content</Navbar>);
    const nav = container.firstElementChild;
    expect(nav?.className).toContain("navbar");
    expect(nav?.className).toContain("bg-base-200");
  });

  it("forwards extra className", () => {
    const { container } = renderWithProviders(
      <Navbar className="my-custom-nav">Content</Navbar>
    );
    const nav = container.firstElementChild;
    expect(nav?.className).toContain("my-custom-nav");
  });

  it("renders Navbar.Start with base class", () => {
    const { container } = renderWithProviders(
      <Navbar>
        <Navbar.Start>Start Content</Navbar.Start>
      </Navbar>
    );
    const start = container.querySelector(".navbar-start");
    expect(start).toBeTruthy();
    expect(start?.textContent).toBe("Start Content");
  });

  it("renders Navbar.Center with base class", () => {
    const { container } = renderWithProviders(
      <Navbar>
        <Navbar.Center>Center Content</Navbar.Center>
      </Navbar>
    );
    const center = container.querySelector(".navbar-center");
    expect(center).toBeTruthy();
    expect(center?.textContent).toBe("Center Content");
  });

  it("renders Navbar.End with base class", () => {
    const { container } = renderWithProviders(
      <Navbar>
        <Navbar.End>End Content</Navbar.End>
      </Navbar>
    );
    const end = container.querySelector(".navbar-end");
    expect(end).toBeTruthy();
    expect(end?.textContent).toBe("End Content");
  });

  it("renders all three sections together", () => {
    const { container } = renderWithProviders(
      <Navbar>
        <Navbar.Start>Start</Navbar.Start>
        <Navbar.Center>Center</Navbar.Center>
        <Navbar.End>End</Navbar.End>
      </Navbar>
    );
    expect(container.querySelector(".navbar-start")?.textContent).toBe("Start");
    expect(container.querySelector(".navbar-center")?.textContent).toBe("Center");
    expect(container.querySelector(".navbar-end")?.textContent).toBe("End");
  });

  it("applies extra className to Navbar.Start", () => {
    const { container } = renderWithProviders(
      <Navbar>
        <Navbar.Start className="custom-start">Start</Navbar.Start>
      </Navbar>
    );
    expect(container.querySelector(".navbar-start")?.className).toContain("custom-start");
  });

  it("throws when Navbar.Start is used outside Navbar", () => {
    expect(() =>
      renderWithProviders(<Navbar.Start>Orphan</Navbar.Start>)
    ).toThrow("Navbar child components must be wrapped in <Navbar/>");
  });

  it("throws when Navbar.Center is used outside Navbar", () => {
    expect(() =>
      renderWithProviders(<Navbar.Center>Orphan</Navbar.Center>)
    ).toThrow("Navbar child components must be wrapped in <Navbar/>");
  });

  it("throws when Navbar.End is used outside Navbar", () => {
    expect(() =>
      renderWithProviders(<Navbar.End>Orphan</Navbar.End>)
    ).toThrow("Navbar child components must be wrapped in <Navbar/>");
  });
});

