import { renderWithProviders } from "@repo/testing-react";
import { describe, expect, it } from "vitest";

import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    const { getByText } = renderWithProviders(
      <Card>
        <Card.Body>Card content</Card.Body>
      </Card>
    );
    expect(getByText("Card content")).toBeTruthy();
  });

  it("applies default variant classes", () => {
    const { container } = renderWithProviders(<Card>Default</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("card");
    expect(card?.className).toContain("bg-base-300");
    expect(card?.className).toContain("card-md");
  });

  it("applies color variant class", () => {
    const { container } = renderWithProviders(<Card color="primary">Color</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("bg-primary");
    expect(card?.className).toContain("text-primary-content");
  });

  it("applies size variant classes", () => {
    const { container } = renderWithProviders(<Card size="lg">Size</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("card-lg");
  });

  it("applies border variant class", () => {
    const { container } = renderWithProviders(<Card border>Border</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("card-border");
  });

  it("applies dash variant class", () => {
    const { container } = renderWithProviders(<Card dash>Dash</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("card-dash");
  });

  it("forwards extra className", () => {
    const { container } = renderWithProviders(<Card className="my-custom-card">Custom</Card>);
    const card = container.firstElementChild;
    expect(card?.className).toContain("my-custom-card");
  });

  it("renders Card.Body with base class", () => {
    const { container } = renderWithProviders(
      <Card>
        <Card.Body>Body content</Card.Body>
      </Card>
    );
    const body = container.querySelector(".card-body");
    expect(body).toBeTruthy();
    expect(body?.textContent).toBe("Body content");
  });

  it("renders Card.Title with base class", () => {
    const { container } = renderWithProviders(
      <Card>
        <Card.Title>My Title</Card.Title>
      </Card>
    );
    const title = container.querySelector(".card-title");
    expect(title).toBeTruthy();
    expect(title?.textContent).toBe("My Title");
  });

  it("renders Card.Actions with base class", () => {
    const { container } = renderWithProviders(
      <Card>
        <Card.Actions>
          <button>OK</button>
        </Card.Actions>
      </Card>
    );
    const actions = container.querySelector(".card-actions");
    expect(actions).toBeTruthy();
    expect(actions?.textContent).toBe("OK");
  });

  it("throws when Card.Body is used outside Card", () => {
    expect(() => renderWithProviders(<Card.Body>Orphan</Card.Body>)).toThrow(
      "Card child components must be wrapped in <Card/>"
    );
  });

  it("throws when Card.Title is used outside Card", () => {
    expect(() => renderWithProviders(<Card.Title>Orphan</Card.Title>)).toThrow(
      "Card child components must be wrapped in <Card/>"
    );
  });

  it("throws when Card.Actions is used outside Card", () => {
    expect(() => renderWithProviders(<Card.Actions>Orphan</Card.Actions>)).toThrow(
      "Card child components must be wrapped in <Card/>"
    );
  });
});

