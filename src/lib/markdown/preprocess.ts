// /src/lib/markdown/preprocess.ts
const EMOJI_BULLET = /^([ \t]*)([❌✅✓✗•▪▫►▶▹▸🔥⭐️⭐︎💡👉])\s+(.*)$/u;

export function preprocessMarkdown(src: string): string {
  const lines = src.split(/\r?\n/);

  // Strip a leading duplicate H1. Guide pages render the post title as an <h1> in the
  // category hero (see BlogPost.tsx — "Category hero handles the visual header"), and the
  // markdown body repeats it as a top-level "# Title", producing two H1s per page — an SEO
  // defect. Remove the first heading (and one following blank line) when it is an H1 at the
  // top of the body so the hero stays the single H1. Only the first line is considered, and
  // only when it is a single-'#' heading (H2+ and ordinary text are left untouched).
  let firstContent = 0;
  while (firstContent < lines.length && lines[firstContent].trim() === '') firstContent++;
  if (firstContent < lines.length && /^#\s+\S/.test(lines[firstContent])) {
    lines.splice(0, firstContent + 1);
    if (lines.length > 0 && lines[0].trim() === '') lines.shift();
  }

  const out: string[] = [];
  let inEmojiBlock = false;
  let inCodeBlock = false;

  const flushIfNeeded = () => {
    if (out.length && out[out.length - 1].trim() !== '') out.push('');
  };

  for (const line of lines) {
    // Check for code block markers
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      out.push(line);
      continue;
    }

    // Don't process emoji bullets inside code blocks
    if (inCodeBlock) {
      out.push(line);
      continue;
    }

    const m = line.match(EMOJI_BULLET);
    if (m) {
      const indent = m[1];
      const emoji = m[2];
      const rest = m[3];

      if (!inEmojiBlock) {
        // starting an emoji list
        flushIfNeeded();
        inEmojiBlock = true;
      }
      // turn "  ✅ Text" into "  - ✅ Text" (preserving indentation)
      out.push(`${indent}- ${emoji} ${rest}`);
      continue;
    }

    // if we were in a list and hit a non-emoji line, close the list with a blank line (unless already blank)
    if (inEmojiBlock && line.trim() !== '') {
      flushIfNeeded();
      inEmojiBlock = false;
    }

    out.push(line);
  }

  // end with a blank line after a list block for safety
  if (inEmojiBlock) flushIfNeeded();

  return out.join('\n');
}
