import type { PropMeta } from "@repo/docs-schema";

export function sortProps(props: PropMeta[]): PropMeta[] {
  return [...props].sort((a, b) => {
    if (a.required !== b.required) {
      return a.required ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

