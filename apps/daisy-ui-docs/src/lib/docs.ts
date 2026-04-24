import type { ComponentMeta } from "@repo/docs-schema";

import buttonMeta from "@/content/meta/button.json";
import inputMeta from "@/content/meta/input.json";
import modalMeta from "@/content/meta/modal.json";

const docsBySlug: Record<string, ComponentMeta> = {
  button: buttonMeta,
  input: inputMeta,
  modal: modalMeta,
};

export function getDocIndex() {
  return Object.entries(docsBySlug)
    .map(([slug, meta]) => ({
      slug,
      title: meta.component,
      description: meta.description,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getComponentDoc(slug: string): ComponentMeta | null {
  return docsBySlug[slug] ?? null;
}

