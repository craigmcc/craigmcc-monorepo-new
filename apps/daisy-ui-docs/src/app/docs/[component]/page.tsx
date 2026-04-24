import { notFound } from "next/navigation";

import { ComponentApiPage } from "@repo/docs-kit";

import { getComponentDoc, getDocIndex } from "@/lib/docs";

export function generateStaticParams() {
  return getDocIndex().map((entry) => ({ component: entry.slug }));
}

export default async function ComponentPage(
  { params }: { params: Promise<{ component: string }> },
) {
  const { component } = await params;
  const meta = getComponentDoc(component);
  if (!meta) {
    notFound();
  }

  return <ComponentApiPage meta={meta} />;
}
