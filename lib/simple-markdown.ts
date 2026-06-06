/** Minimal markdown: **bold**, `-` bullets, new lines. */

export function markdownToPlainText(md: string): string {
  return md
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return `• ${trimmed.slice(2)}`;
      }
      return line.replace(/\*\*([^*]+)\*\*/g, "$1");
    })
    .join("\n")
    .trim();
}

type InlinePart = { type: "text" | "bold"; value: string };

function parseInline(line: string): InlinePart[] {
  const parts: InlinePart[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > last) {
      parts.push({ type: "text", value: line.slice(last, match.index) });
    }
    parts.push({ type: "bold", value: match[1] });
    last = match.index + match[0].length;
  }

  if (last < line.length) {
    parts.push({ type: "text", value: line.slice(last) });
  }

  return parts.length ? parts : [{ type: "text", value: line }];
}

export type MarkdownBlock =
  | { type: "paragraph"; parts: InlinePart[] }
  | { type: "bullet"; parts: InlinePart[] };

export function parseSimpleMarkdown(text: string): MarkdownBlock[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({
        type: "bullet",
        parts: parseInline(trimmed.slice(2)),
      });
      continue;
    }

    blocks.push({ type: "paragraph", parts: parseInline(trimmed) });
  }

  return blocks;
}
