#!/usr/bin/env python3
"""Sort a folder of untouched exports into the pull folders a run expects.

Peter does not rename exports, and he should not have to: every Search Console export
carries its own filters and date range inside it, and every Keyword Planner export
carries its layout and its keywords. This reads those and files each export against
`request.json`, so the download folder can be tipped straight into `raw/inbox/`.

Usage:
    python3 tasks/keyword-plan/sort-inbox.py --run 2026-09-08-01-setup [--dry-run]

Matching, in order of confidence:
  Search Console, no Query filter  ->  the property pull whose preset matches Filters.csv `Date`.
  Search Console, with a Query filter  ->  the cluster pull whose regex matches the filter text.
        Google's exact wording for a regex filter is not contractually fixed, so when the text
        does not match, every candidate regex is scored against the export's own Queries.csv and
        the best scorer wins. A tie, or a zero score, is left unsorted rather than guessed.
  Keyword Planner, volumes layout  ->  the volumes pull.
  Keyword Planner, discover layout  ->  the discovery pull whose seeds overlap the returned
        keywords most. Discovery returns the seeds plus suggestions, so overlap is reliable.

Nothing is deleted. Files are moved, zips are extracted, and anything unmatched is named.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path

DEFAULT_WORKSPACE = Path(__file__).resolve().parent


def read_gsc_member(root: Path | zipfile.ZipFile, name: str) -> list[dict]:
    """Rows of one tab, from a folder or a zip. Empty list when the tab is absent."""
    try:
        if isinstance(root, zipfile.ZipFile):
            match = next((n for n in root.namelist() if Path(n).name.lower() == name.lower()), None)
            if match is None:
                return []
            raw = root.read(match).decode("utf-8-sig")
        else:
            path = next((p for p in root.iterdir() if p.name.lower() == name.lower()), None)
            if path is None:
                return []
            raw = path.read_text(encoding="utf-8-sig")
    except (KeyError, OSError, UnicodeDecodeError):
        return []
    return list(csv.DictReader(io.StringIO(raw)))


def gsc_facts(root: Path | zipfile.ZipFile) -> dict | None:
    """Date preset, query filter text, country and window, read from the export itself."""
    filters = read_gsc_member(root, "Filters.csv")
    chart = read_gsc_member(root, "Chart.csv")
    if not chart:
        return None
    seen = {}
    for row in filters:
        key = (row.get("Filter") or "").strip()
        value = (row.get("Value") or "").strip()
        if key:
            seen[key.split()[0].lower()] = value
    dates = sorted(r["Date"] for r in chart if r.get("Date"))
    query_raw = seen.get("query", "")
    return {
        "preset": seen.get("date", ""),
        "country": seen.get("country", ""),
        "query_raw": query_raw,
        "query_text": query_raw.rsplit(": ", 1)[-1].strip() if query_raw else "",
        "window_start": dates[0] if dates else "",
        "window_end": dates[-1] if dates else "",
        "queries": [r.get("Top queries", "") for r in read_gsc_member(root, "Queries.csv")],
    }


def gkp_facts(path: Path) -> dict | None:
    """Layout and keyword list of a Keyword Planner export (UTF-16 with a two line preamble)."""
    for encoding in ("utf-16", "utf-8-sig"):
        try:
            text = path.read_text(encoding=encoding)
            break
        except (UnicodeDecodeError, UnicodeError):
            continue
    else:
        return None
    lines = [ln for ln in text.splitlines() if ln.strip()]
    if len(lines) < 3 or "\t" not in lines[2]:
        return None
    header = [h.strip().lower() for h in lines[2].split("\t")]
    if "keyword" not in header:
        return None
    words = []
    for line in lines[3:]:
        cell = line.split("\t")[0].strip()
        if cell:
            words.append(cell.lower())
    # A discovery export returns far more than was typed in; a volumes export returns what was asked.
    layout = "volumes" if "in account" in header or "in plan" in header else "discover"
    return {"layout": layout, "keywords": words, "window": lines[1].strip().strip('"')}


def norm(text: str) -> str:
    return re.sub(r"\s+", "", text or "").lower()


def match_gsc(facts: dict, pulls: list[dict]) -> tuple[dict | None, str]:
    gsc = [p for p in pulls if p["source"] == "gsc"]
    if not facts["query_text"]:
        candidates = [p for p in gsc if p["expected"]["filter_type"] == "none"
                      and norm(p["expected"].get("preset", "")) == norm(facts["preset"])]
        if len(candidates) == 1:
            return candidates[0], f"no query filter, date preset {facts['preset']!r}"
        return None, f"no query filter and preset {facts['preset']!r} matched {len(candidates)} pulls"

    filtered = [p for p in gsc if p["expected"]["filter_type"] == "query"]
    exact = [p for p in filtered if norm(p["expected"]["filter_value"]) == norm(facts["query_text"])]
    if len(exact) == 1:
        return exact[0], "query filter text matched exactly"

    # Google's regex filter wording is not fixed, so fall back to behaviour: which candidate
    # pattern actually explains the queries this export returned?
    scored = []
    for pull in filtered:
        try:
            rx = re.compile(pull["expected"]["filter_value"])
        except re.error:
            continue
        hits = sum(1 for q in facts["queries"] if rx.search(q))
        scored.append((hits, pull))
    scored.sort(key=lambda item: -item[0])
    if scored and scored[0][0] > 0 and (len(scored) == 1 or scored[0][0] > scored[1][0]):
        best = scored[0]
        return best[1], f"filter text differed; {best[0]} of {len(facts['queries'])} queries match its regex"
    return None, "query filter text did not match and no single regex explains the returned queries"


def match_gkp(facts: dict, pulls: list[dict]) -> tuple[dict | None, str]:
    if facts["layout"] == "volumes":
        candidates = [p for p in pulls if p["source"] == "gkp-volumes"]
        if len(candidates) == 1:
            return candidates[0], "only volumes pull in this run"
        returned = set(facts["keywords"])
        best = max(candidates, key=lambda p: len(returned & {k.lower() for k in p.get("keywords", [])}),
                   default=None)
        return (best, "best keyword overlap") if best else (None, "no volumes pull to match")

    returned = set(facts["keywords"])
    scored = []
    for pull in (p for p in pulls if p["source"] == "gkp-discover"):
        seeds = {s.lower() for s in pull.get("seeds", [])}
        scored.append((len(returned & seeds), pull))
    scored.sort(key=lambda item: -item[0])
    if scored and scored[0][0] > 0 and (len(scored) == 1 or scored[0][0] > scored[1][0]):
        return scored[0][1], f"{scored[0][0]} of its seeds present in the returned keywords"
    return None, "no discovery pull's seeds stand out in the returned keywords"


def target_of(pull: dict) -> str:
    return pull.get("target_folder") or pull.get("target_file") or ""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--workspace", default=str(DEFAULT_WORKSPACE))
    ap.add_argument("--run", required=True)
    ap.add_argument("--inbox", default="raw/inbox")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    run_dir = Path(args.workspace) / "runs" / args.run
    request_path = run_dir / "request.json"
    if not request_path.exists():
        print(f"no request.json at {request_path}", file=sys.stderr)
        return 2
    pulls = json.loads(request_path.read_text())["pulls"]
    inbox = run_dir / args.inbox
    if not inbox.is_dir():
        print(f"no inbox at {inbox}", file=sys.stderr)
        return 2

    entries = sorted(p for p in inbox.iterdir() if not p.name.startswith("."))
    taken: dict[str, Path] = {}
    unmatched: list[tuple[Path, str]] = []
    plan: list[tuple[Path, dict, str]] = []

    for entry in entries:
        facts = why = None
        if entry.suffix.lower() == ".zip":
            try:
                with zipfile.ZipFile(entry) as zf:
                    facts = gsc_facts(zf)
            except zipfile.BadZipFile:
                unmatched.append((entry, "not a readable zip"))
                continue
            if facts is None:
                unmatched.append((entry, "zip has no readable Chart.csv"))
                continue
            pull, why = match_gsc(facts, pulls)
        elif entry.is_dir():
            facts = gsc_facts(entry)
            if facts is None:
                unmatched.append((entry, "folder has no readable Chart.csv"))
                continue
            pull, why = match_gsc(facts, pulls)
        elif entry.suffix.lower() == ".csv":
            facts = gkp_facts(entry)
            if facts is None:
                unmatched.append((entry, "not a readable Keyword Planner export"))
                continue
            pull, why = match_gkp(facts, pulls)
        else:
            unmatched.append((entry, "not a zip, folder or csv"))
            continue

        if pull is None:
            unmatched.append((entry, why))
            continue
        pid = pull["pull_id"]
        if pid in taken:
            unmatched.append((entry, f"{pid} already claimed by {taken[pid].name}"))
            continue
        taken[pid] = entry
        plan.append((entry, pull, why))

    for entry, pull, why in plan:
        dest = run_dir / target_of(pull)
        print(f"  {entry.name}\n      -> {target_of(pull)}  ({why})")
        if args.dry_run:
            continue
        if pull["source"] == "gsc":
            dest.mkdir(parents=True, exist_ok=True)
            if entry.suffix.lower() == ".zip":
                with zipfile.ZipFile(entry) as zf:
                    for member in zf.namelist():
                        name = Path(member).name
                        if not name or member.endswith("/"):
                            continue
                        (dest / name).write_bytes(zf.read(member))
                entry.unlink()
            else:
                for item in entry.iterdir():
                    shutil.move(str(item), dest / item.name)
                entry.rmdir()
        else:
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.move(str(entry), dest)

    outstanding = [p["pull_id"] for p in pulls if p["pull_id"] not in taken]
    print(f"\nsorted {len(plan)} of {len(entries)} files; {len(outstanding)} pull(s) still outstanding")
    if unmatched:
        print("\nnot sorted, left in the inbox:")
        for entry, why in unmatched:
            print(f"  {entry.name}: {why}")
    if outstanding:
        print("\nstill outstanding: " + ", ".join(outstanding))
    return 1 if (unmatched or outstanding) else 0


if __name__ == "__main__":
    raise SystemExit(main())
