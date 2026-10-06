#!/usr/bin/env python3
"""Audit heading structure in Saraswat Academy HTML pages.

Rules:
- Exactly one page-level H1 per indexable document.
- H2 = major page sections.
- H3 = subsections / question groups under an H2.
- H4 = deeper subsections only when an H3 parent exists.
- CSS selectors containing h1/h2/h3 are ignored.
- Script reports violations only; it deliberately does not mass-rewrite
  educational question text because question headings often carry content
  semantics that require page-level context.
"""

from pathlib import Path
from html.parser import HTMLParser
import re
from collections import Counter

ROOT = Path(".")
SKIP_DIRS = {".git", ".github", "node_modules", "templates"}
EXCLUDE_FILES = {"header.html", "footer.html"}

class HeadingParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.headings = []

    def handle_starttag(self, tag, attrs):
        self.stack.append(tag.lower())
        if tag.lower() in {"h1", "h2", "h3", "h4", "h5", "h6"}:
            self.headings.append({"level": int(tag[1]), "text": "", "tag": tag.lower()})

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in {"h1", "h2", "h3", "h4", "h5", "h6"} and self.headings:
            return
        if self.stack and self.stack[-1] == t:
            self.stack.pop()

    def handle_data(self, data):
        if self.headings:
            self.headings[-1]["text"] += data

def clean(text):
    return re.sub(r"\s+", " ", text).strip()

def audit(path):
    source = path.read_text(encoding="utf-8", errors="ignore")
    parser = HeadingParser()
    try:
        parser.feed(source)
    except Exception as exc:
        return [{"type": "PARSE_ERROR", "detail": str(exc)}]

    hs = parser.headings
    issues = []
    h1_count = sum(h["level"] == 1 for h in hs)

    if h1_count == 0:
        issues.append({"type": "MISSING_H1"})
    elif h1_count > 1:
        issues.append({"type": "MULTIPLE_H1", "count": h1_count})

    prev = None
    for h in hs:
        level = h["level"]
        if prev is not None and level > prev + 1:
            issues.append({
                "type": "SKIPPED_LEVEL",
                "from": prev,
                "to": level,
                "text": clean(h["text"])[:120],
            })
        prev = level

    for i, h in enumerate(hs):
        if h["level"] == 4:
            prior_levels = [x["level"] for x in hs[:i]]
            if 3 not in prior_levels:
                issues.append({
                    "type": "H4_WITHOUT_H3_PARENT",
                    "text": clean(h["text"])[:120],
                })

    if issues:
        return issues
    return []

files = sorted(
    p for p in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in p.parts)
    and p.name not in EXCLUDE_FILES
)

totals = Counter()
bad_files = 0

for path in files:
    issues = audit(path)
    if issues:
        bad_files += 1
        print(f"FILE: {path.as_posix()}")
        for issue in issues:
            totals[issue["type"]] += 1
            print("  ", issue)
        print()

print(f"HTML_FILES={len(files)}")
print(f"FILES_WITH_HEADING_ISSUES={bad_files}")
for key, value in sorted(totals.items()):
    print(f"{key}={value}")
