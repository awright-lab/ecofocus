export type ReportBodyBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ordered" | "unordered"; items: string[]; start: number };

// A deliberately small text format for Payload's overview textarea. HTML is
// always rendered as text, and existing plain-text overviews remain supported.
export function parseReportBody(body: string): ReportBodyBlock[] {
  const blocks: ReportBodyBlock[] = [];
  for (const raw of body.replace(/\r\n?/g, "\n").split(/\n\s*\n/)) {
    const lines = raw.trim().split("\n");
    for (const [lineIndex, line] of lines.entries()) {
      const text = line.trim();
      if (!text) continue;
      const heading = /^#{2,3}\s+(.+)$/.exec(text);
      const bullet = /^[-*]\s+(.+)$/.exec(text);
      const numbered = /^(\d+)\.\s+(.+)$/.exec(text);
      const previous = blocks.at(-1);
      if (heading) blocks.push({ type: "heading", text: heading[1] });
      else if (bullet || numbered) {
        const type = bullet ? "unordered" : "ordered";
        const item = bullet ? bullet[1] : numbered![2];
        if (previous?.type === type) previous.items.push(item);
        else blocks.push({ type, items: [item], start: numbered ? Number(numbered[1]) : 1 });
      } else if (previous?.type === "paragraph" && lineIndex > 0) {
        previous.text += `\n${text}`;
      } else blocks.push({ type: "paragraph", text });
    }
  }
  return blocks;
}
