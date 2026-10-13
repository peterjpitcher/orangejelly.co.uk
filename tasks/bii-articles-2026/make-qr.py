#!/usr/bin/env python3
"""Print-ready QR code for a BII article short link.

A printed code cannot be reissued, so it encodes the short link on our own domain
(for example https://www.orangejelly.co.uk/pub-ai) and never the guide's own address:
the short link is a temporary redirect in src/lib/route-manifest.js that can be
repointed for as long as the magazine is in circulation.

Same tool and sizes as marketing/bii-summer-2026/ (segno, 10 px modules for the SVG,
60 px for the PNG), with two deliberate differences. Error correction is fixed at Q
(a quarter of the code can be damaged or badly printed and it still scans) rather
than left to chance, and the white background is drawn into the SVG so the quiet
zone survives being placed on a tinted page.

Usage:
    python3 tasks/bii-articles-2026/make-qr.py <url> <output-directory> <file-stem>

Writes <file-stem>.svg and <file-stem>.png and prints what was encoded.
Needs segno (pip show segno). It does not touch the network.
"""

import math
import sys
from pathlib import Path

import segno

ALLOWED_PREFIX = "https://www.orangejelly.co.uk/"


def main() -> int:
    if len(sys.argv) != 4:
        print(__doc__)
        return 1

    url, out_dir, stem = sys.argv[1], Path(sys.argv[2]), sys.argv[3]

    if not url.startswith(ALLOWED_PREFIX) or "?" in url or url.endswith("/"):
        print(f"Refusing to encode {url!r}.")
        print(f"Encode the bare short link only: {ALLOWED_PREFIX}<alias>, no query string, no trailing slash.")
        return 1

    out_dir.mkdir(parents=True, exist_ok=True)
    code = segno.make(url, error="q", boost_error=False, micro=False)
    border = 4  # the quiet zone the QR standard requires, in modules
    modules = code.symbol_size(border=border)[0]

    svg = out_dir / f"{stem}.svg"
    png = out_dir / f"{stem}.png"
    code.save(str(svg), scale=10, border=border, dark="#000", light="#fff")
    code.save(str(png), scale=60, border=border, dark="#000", light="#fff")

    # 0.5 mm per module is a comfortable floor for magazine print at arm's length.
    minimum_mm = max(20, math.ceil(modules * 0.5))
    print(f"Encoded:      {url}")
    print(f"QR version:   {code.version}, error correction {code.error}")
    print(f"Modules:      {modules} x {modules} including the quiet zone")
    print(f"Wrote:        {svg} (vector, use for print)")
    print(f"Wrote:        {png} ({modules * 60} x {modules * 60} px)")
    print(f"Print size:   {minimum_mm} mm x {minimum_mm} mm or larger")
    return 0


if __name__ == "__main__":
    sys.exit(main())
