import { describe, expect, it } from "vitest";

import { componentMetaSchema } from "../src/componentMeta";

describe("componentMetaSchema", () => {
  it("accepts valid metadata", () => {
    const parsed = componentMetaSchema.parse({
      component: "Button",
      package: "@repo/daisy-ui",
      description: "A button.",
      props: [
        {
          name: "color",
          type: "string",
          required: false,
          description: "Color variant",
        },
      ],
    });

    expect(parsed.component).toBe("Button");
  });

  it("rejects invalid metadata", () => {
    const result = componentMetaSchema.safeParse({
      component: "",
      package: "@repo/daisy-ui",
      description: "",
      props: [],
    });

    expect(result.success).toBe(false);
  });
});

