import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageMarkdownProps {
  children: string;
  variant: "user" | "assistant";
}

// User messages keep contrast on a dark bubble; assistant uses normal foreground.
// Tailwind classes here intentionally avoid prose plugin to keep deps minimal.
const components: Components = {
  p: ({ children }) => <p className="leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 my-1.5 space-y-0.5">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 my-1.5 space-y-0.5">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:opacity-80"
    >
      {children}
    </a>
  ),
  code: ({ className, children }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="rounded bg-foreground/10 px-1 py-0.5 font-mono text-[0.9em]">
          {children}
        </code>
      );
    }
    return (
      <code className="block overflow-x-auto rounded-md bg-foreground/10 p-3 font-mono text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  h1: ({ children }) => <h1 className="text-lg font-semibold mt-2 mb-1">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold mt-2 mb-1">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold mt-1.5 mb-0.5">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-foreground/30 pl-3 italic my-1.5">
      {children}
    </blockquote>
  ),
};

export function MessageMarkdown({ children, variant }: MessageMarkdownProps) {
  return (
    <div
      className={cn(
        "text-base leading-relaxed [&>*+*]:mt-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        variant === "user" ? "[&_a]:text-primary-foreground" : ""
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
