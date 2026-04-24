import { z } from "zod";

export const propMetaSchema = z.object({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string().min(1),
  enumValues: z.array(z.string()).optional(),
  deprecated: z.union([z.boolean(), z.string()]).optional(),
  since: z.string().optional(),
});

export const exampleMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  code: z.string().min(1),
});

export const subcomponentMetaSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  props: z.array(propMetaSchema),
});

export const componentMetaSchema = z.object({
  component: z.string().min(1),
  package: z.string().min(1),
  description: z.string().min(1),
  props: z.array(propMetaSchema),
  examples: z.array(exampleMetaSchema).default([]),
  slots: z.array(z.string()).optional(),
  subcomponents: z.array(z.string()).optional(),
  subcomponentDocs: z.array(subcomponentMetaSchema).optional(),
});

export type PropMeta = z.infer<typeof propMetaSchema>;
export type ExampleMeta = z.infer<typeof exampleMetaSchema>;
export type SubcomponentMeta = z.infer<typeof subcomponentMetaSchema>;
export type ComponentMeta = z.infer<typeof componentMetaSchema>;

