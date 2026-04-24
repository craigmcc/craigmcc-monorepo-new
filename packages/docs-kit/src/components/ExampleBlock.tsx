import type { ExampleMeta } from "@repo/docs-schema";

import { CodeBlock } from "./CodeBlock";

type ExampleBlockProps = {
  example: ExampleMeta;
};

export function ExampleBlock({ example }: ExampleBlockProps) {
  return (
    <article className="space-y-2 rounded border border-base-300 p-4">
      <h3 className="text-base font-semibold">{example.title}</h3>
      {example.description ? <p className="text-sm text-base-content/70">{example.description}</p> : null}
      <CodeBlock code={example.code} />
    </article>
  );
}

