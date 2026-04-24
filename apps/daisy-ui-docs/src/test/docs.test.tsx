import { describe, expect, it } from "vitest";

import { getComponentDoc, getDocIndex } from "@/lib/docs";

describe("docs metadata index", () => {
  it("returns the seeded components", () => {
    const entries = getDocIndex();
    expect(entries.map((entry) => entry.slug)).toEqual(["button", "input", "modal"]);
  });

  it("resolves a component detail by slug", () => {
    const meta = getComponentDoc("button");
    expect(meta?.component).toBe("Button");
  });
});

