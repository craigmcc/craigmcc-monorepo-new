import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RestrictedMarkdown } from "../src";

describe("RestrictedMarkdown", () => {
  it("renders allowed markdown nodes", () => {
    render(
      <RestrictedMarkdown
        content={"Paragraph with **bold** and `code`.\n\n- first item\n- second item\n\n[Docs](https://example.com)"}
      />,
    );

    expect(screen.getByText("bold").tagName).toBe("STRONG");
    expect(screen.getByText("code").tagName).toBe("CODE");
    expect(screen.getByRole("list").tagName).toBe("UL");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "https://example.com");
  });

  it("does not render disallowed nodes or raw html wrappers", () => {
    const { container } = render(
      <RestrictedMarkdown
        content={"# Hidden heading\n\n<span>inline html</span>\n\nVisible paragraph"}
      />,
    );

    expect(screen.queryByRole("heading", { name: "Hidden heading" })).not.toBeInTheDocument();
    expect(screen.getByText("Hidden heading")).toBeInTheDocument();
    expect(screen.getByText("inline html")).toBeInTheDocument();
    expect(container.querySelector("span")).not.toBeInTheDocument();
    expect(screen.getByText("Visible paragraph")).toBeInTheDocument();
  });
});


