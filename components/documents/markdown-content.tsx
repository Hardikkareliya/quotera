import { parseSimpleMarkdown } from "@/lib/simple-markdown";
import { cn } from "@/lib/utils";

export function MarkdownContent({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const blocks = parseSimpleMarkdown(text);
  if (!blocks.length) return null;

  return (
    <div className={cn("space-y-1 text-sm text-muted-foreground", className)}>
      {blocks.map((block, index) => {
        const content = block.parts.map((part, i) =>
          part.type === "bold" ? (
            <strong key={i} className="font-medium text-foreground">
              {part.value}
            </strong>
          ) : (
            <span key={i}>{part.value}</span>
          ),
        );

        if (block.type === "bullet") {
          return (
            <p key={index} className="flex gap-2 pl-0.5">
              <span className="shrink-0 text-muted-foreground">•</span>
              <span className="min-w-0">{content}</span>
            </p>
          );
        }

        return (
          <p key={index} className="min-w-0">
            {content}
          </p>
        );
      })}
    </div>
  );
}
