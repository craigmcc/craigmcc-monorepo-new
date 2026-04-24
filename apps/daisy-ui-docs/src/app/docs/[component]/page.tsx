import { notFound } from "next/navigation";

import { ComponentApiPage } from "@repo/docs-kit";

import { getComponentDoc, getDocIndex } from "@/lib/docs";

export function generateStaticParams() {
  return getDocIndex().map((entry) => ({ component: entry.slug }));
}

export default function ComponentPage({ params }: { params: { component: string } }) {
  const meta = getComponentDoc(params.component);
  if (!meta) {
    notFound();
  }

  return <ComponentApiPage meta={meta} />;
}

