import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { PropMeta } from "@repo/docs-schema";

import { PropsTable } from "../src";

describe("PropsTable", () => {
  it("renders a prop row", () => {
    const props: PropMeta[] = [
      {
        name: "value",
        type: "string",
        required: true,
        description: "Current value.",
      },
    ];

    render(<PropsTable props={props} />);

    expect(screen.getByText("value")).toBeInTheDocument();
    expect(screen.getByText("Current value.")).toBeInTheDocument();
  });
});








