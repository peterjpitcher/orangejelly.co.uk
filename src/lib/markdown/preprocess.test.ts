import { preprocessMarkdown } from './preprocess';

describe('preprocessMarkdown', () => {
  it('converts emoji lines to a list', () => {
    const md = `Forget What You Think They Want
❌ Generic quiz nights
❌ Cheesy themed parties`;

    const out = preprocessMarkdown(md);
    expect(out).toContain('- ❌ Generic quiz nights');
    expect(out).toContain('- ❌ Cheesy themed parties');
    // Should have blank line before list
    expect(out).toMatch(/Want\n\n- ❌/);
  });

  it('preserves bold + description lines', () => {
    const md = `What Actually Works
✅ **Bottomless Brunch Done Right** - Not just prosecco`;
    const out = preprocessMarkdown(md);
    expect(out).toContain('- ✅ **Bottomless Brunch Done Right** - Not just prosecco');
  });

  it('does not touch standard lists', () => {
    const md = `- Item one
- Item two`;
    expect(preprocessMarkdown(md)).toBe(md);
  });

  it('handles mixed content with spacing', () => {
    const md = `## Heading

Para

✅ One
✅ Two

Another para`;
    const out = preprocessMarkdown(md);
    // Ensure blank lines around the list so it parses as a block list
    expect(out).toMatch(/Para\n\n- ✅ One\n- ✅ Two\n\nAnother para/);
  });

  it('handles multiple emoji types', () => {
    const md = `List of items:
❌ No item
✅ Yes item
✓ Check item
• Bullet item
🔥 Fire item
💡 Idea item`;

    const out = preprocessMarkdown(md);
    expect(out).toContain('- ❌ No item');
    expect(out).toContain('- ✅ Yes item');
    expect(out).toContain('- ✓ Check item');
    expect(out).toContain('- • Bullet item');
    expect(out).toContain('- 🔥 Fire item');
    expect(out).toContain('- 💡 Idea item');
  });

  it('preserves indentation in emoji lines', () => {
    const md = `  ✅ Indented item
  ✅ Another indented`;

    const out = preprocessMarkdown(md);
    expect(out).toContain('  - ✅ Indented item');
    expect(out).toContain('  - ✅ Another indented');
  });

  it('handles emoji list followed by regular paragraph', () => {
    const md = `Some intro text

✅ First item
✅ Second item
This is a regular paragraph`;

    const out = preprocessMarkdown(md);
    // Should have blank line after list before paragraph
    expect(out).toMatch(/- ✅ Second item\n\nThis is a regular paragraph/);
  });

  it('handles empty lines within content', () => {
    const md = `Title

✅ Item one

✅ Item two

Regular text`;

    const out = preprocessMarkdown(md);
    // Should maintain structure with proper spacing
    expect(out).toContain('- ✅ Item one');
    expect(out).toContain('- ✅ Item two');
  });

  it('does not modify code blocks', () => {
    const md = `\`\`\`
✅ This should not be converted
❌ Neither should this
\`\`\``;

    // Code blocks should be preserved as-is
    const out = preprocessMarkdown(md);
    expect(out).toContain('✅ This should not be converted');
    expect(out).not.toContain('- ✅ This should not be converted');
  });

  it('strips a leading duplicate H1 so the hero stays the only H1', () => {
    const md = `# Quiz Night Ideas: 25 Formats

A great quiz night is about variety.
## Cluster 1
- One`;
    const out = preprocessMarkdown(md);
    expect(out).not.toContain('# Quiz Night Ideas: 25 Formats');
    expect(out.startsWith('A great quiz night')).toBe(true);
    // section headings are untouched
    expect(out).toContain('## Cluster 1');
  });

  it('only strips a LEADING h1 — not h2s or later headings', () => {
    expect(preprocessMarkdown('## Section\nBody')).toContain('## Section');
    expect(preprocessMarkdown('Intro paragraph\n# Later H1')).toContain('# Later H1');
  });

  it('handles real-world example from blog', () => {
    const md = `## Events They Actually Want

Forget What You Think They Want
❌ Generic quiz nights
❌ Cheesy themed parties
❌ "Student nights" with cheap shots
❌ DJ playing music from 2010

What Actually Works
✅ **Bottomless Brunch Done Right** - Not just prosecco, but craft cocktails, decent food, 90 minutes, £35
✅ **Board Game Cafés** - Partner with local board game groups, Sunday afternoons, coffee focus
✅ **Small Plate Sundays** - Tapas-style sharing, encourages groups, lower price point
✅ **Work From Pub Days** - Fast WiFi, coffee, lunch deals, quiet background music till 5pm`;

    const out = preprocessMarkdown(md);

    // Check structure is correct
    expect(out).toContain('## Events They Actually Want');
    expect(out).toContain('Forget What You Think They Want\n\n- ❌ Generic quiz nights');
    expect(out).toContain('- ❌ DJ playing music from 2010\n\nWhat Actually Works');
    expect(out).toContain('- ✅ **Bottomless Brunch Done Right**');
    expect(out).toContain('- ✅ **Work From Pub Days**');
  });
});
