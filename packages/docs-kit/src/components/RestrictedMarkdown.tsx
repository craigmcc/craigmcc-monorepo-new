import ReactMarkdown from "react-markdown";

type RestrictedMarkdownProps = {
  content: string;
  className?: string;
};

const ALLOWED_ELEMENTS = ["a", "blockquote", "code", "em", "li", "ol", "p", "pre", "strong", "ul"] as const;

export function RestrictedMarkdown({ content, className }: RestrictedMarkdownProps) {
  const classes = [
    "space-y-3 text-base-content/70 [&_a]:link [&_a]:link-primary [&_blockquote]:border-l-4 [&_blockquote]:border-base-300 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-base-200 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm [&_li]:leading-7 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-7 [&_pre]:overflow-x-auto [&_pre]:rounded-box [&_pre]:bg-base-200 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_ul]:list-disc [&_ul]:pl-5",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <ReactMarkdown
        allowedElements={[...ALLOWED_ELEMENTS]}
        skipHtml
        unwrapDisallowed
        components={{
          a: (props) => <a {...props} rel="noreferrer" target="_blank" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


