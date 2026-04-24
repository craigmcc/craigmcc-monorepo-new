import type { ComponentMeta } from "@repo/docs-schema";

import { ExampleBlock } from "./ExampleBlock";
import { PropsTable } from "./PropsTable";

type ComponentApiPageProps = {
  meta: ComponentMeta;
};

export function ComponentApiPage({ meta }: ComponentApiPageProps) {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-base-content/60">{meta.package}</p>
        <h1 className="text-3xl font-semibold">{meta.component}</h1>
        <p className="text-base-content/70">{meta.description}</p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Props</h2>
        <PropsTable props={meta.props} />
      </section>

      {meta.examples.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Examples</h2>
          <div className="grid gap-3">
            {meta.examples.map((example) => (
              <ExampleBlock key={example.title} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {meta.subcomponents?.length ? (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Subcomponents</h2>
          <ul className="list-disc pl-5">
            {meta.subcomponents.map((subcomponent) => (
              <li key={subcomponent}>
                <code>{subcomponent}</code>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

