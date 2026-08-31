# Internal links inside the guides that point at retiring pages

Found 30 August 2026 while re-chroming the guides. Not fixed here, deliberately: the
guide markdown files already carry Peter's uncommitted hero-image work, and editing
them would mix the two in one commit.

## What it is

43 of the 106 guide articles contain links, written into the article body, to pages
that redirect at phase 4. They are not broken today. At phase 4 each becomes a
redirect hop, and the July crawl already flagged redirect chains as a problem.

| Link in the markdown | Count | Should point at |
|---|---|---|
| `/ways-to-work` | 14 | `/how-we-work` |
| `/fix-my-pub` | 6 | the renamed rescue page |
| `/services` | 5 | `/how-we-work` |
| `/services/instagram-services-for-pubs` | 1 | `/services/social-media-marketing-for-pubs` |

Total 26 links across 43 files.

`/ways-to-work/growth-fix`, `/ways-to-work/growth-partner`,
`/ways-to-work/momentum-month` and `/ways-to-work/turnaround-intensive` also appear,
17 times between them, but those pages are live and have no phase 4 entry, so they
are left alone.

## The one thing to check before running it

The anchor text. A link reading "see our packages" repointed at `/how-we-work` reads
oddly even though the destination is right. Fourteen of the twenty-six are
`/ways-to-work`, which was the packages page, so those are the ones worth eyeballing.

## The change

Once the blog markdown is committed, this is a single pass:

```bash
cd /Users/peterpitcher/Cursor/OJ-OrangeJelly.co.uk
sed -i '' \
  -e 's#](/ways-to-work)#](/how-we-work)#g' \
  -e 's#](/services)#](/how-we-work)#g' \
  -e 's#](/services/instagram-services-for-pubs)#](/services/social-media-marketing-for-pubs)#g' \
  content/blog/*.md
```

`/fix-my-pub` is left out of that command on purpose: its destination is the rescue
page, whose slug is changing, so it should be done in the same pass as the rename.

---

## Also in the article text: instructions to press a button that is not there

Six guides tell the reader:

> Tap the sticky "Get in Touch" button on orangejelly.co.uk or email peter@orangejelly.co.uk

There has never been a button with that label. The sticky bar on a guide now reads
"Let's talk" and goes to `/start-here`, so the sentence is wrong twice.

Same reason as above for not fixing it here: it is markdown, and those files carry
uncommitted work. Find them with:

```bash
grep -rl "Tap the sticky" content/blog/
```

The replacement is a link to `/start-here`, not a description of a button. Telling
someone which control to press ages badly, as this shows.
