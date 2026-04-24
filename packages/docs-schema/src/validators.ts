import { componentMetaSchema, type ComponentMeta } from "./componentMeta";

export function parseComponentMeta(input: unknown): ComponentMeta {
  return componentMetaSchema.parse(input);
}

export function isComponentMeta(input: unknown): input is ComponentMeta {
  return componentMetaSchema.safeParse(input).success;
}

