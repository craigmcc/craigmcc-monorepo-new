type CodeBlockProps = {
  code: string;
};

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="overflow-x-auto rounded bg-neutral p-4 text-neutral-content">
      <code>{code}</code>
    </pre>
  );
}

