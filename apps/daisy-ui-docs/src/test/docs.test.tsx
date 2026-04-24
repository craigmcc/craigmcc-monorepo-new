import { describe, expect, it } from "vitest";

import { getComponentDoc, getDocIndex } from "@/lib/docs";

describe("docs metadata index", () => {
  it("returns available component docs", async () => {
    const entries = await getDocIndex();
    expect(entries.map((entry) => entry.slug)).toEqual(["button", "input", "modal"]);
  });

  it("resolves a component detail by slug", async () => {
    const meta = await getComponentDoc("button");
    expect(meta?.component).toBe("Button");
  });
});
