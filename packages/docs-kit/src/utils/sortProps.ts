import type { PropMeta } from "@repo/docs-schema";

export function sortProps(props: PropMeta[]): PropMeta[] {
  return [...props].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}
