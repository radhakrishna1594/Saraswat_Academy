#!/usr/bin/env python3
"""Repository-wide SEO audit and safe fixer for Saraswat Academy."""

import html
import re
from pathlib import Path

ROOT = Path(".")
DOMAIN = "https://www.saraswatacademy.in"
SKIP_DIRS = {".git", ".github", "node_modules"}
EXCLUDE_FILES = {"header.html", "footer.html"}
NOINDEX_FILES = {
    "thank-you.html",
    "thank-you-tutor.html",
    "under-construction.html",
    "experimental.html",
}
NOINDEX_DIRS = ("student/",)


def clean(value):
    value = re.sub(r"\s+", " ", value or "").strip()
    return html.unescape(value)


def meta_tags(source, attr, name):
    pattern = rf"<meta\\b[^>]*\\b{attr}=[\\"']{re.escape(name)}[\\"'][^>]*>"
    return list(re.finditer(pattern, source, flags=re.I))


def meta_value(source, attr, name):
    matches = meta_tags(source, attr, name)
    if not matches:
        return ""
    tag = matches[0].group(0)
    match = re.search(r"\\bcontent=[\\"']([^\\"']*)[\\"']", tag, flags=re.I)
    return html.unescape(match.group(1)).strip() if match else ""


def title_value(source):
    match = re.search(r"<title\\b[^>]*>([\\s\\S]*?)</title>", source, flags=re.I)
    return clean(match.group(1)) if match else ""


def first_heading(source, tag="h1"):
    match = re.search(
        rf"<{tag}\\b[^>]*>([\\s\\S]*?)</{tag}>",
        source,
        flags=re.I,
    )
    if not match:
        return ""
    text = re.sub(r"<[^>]+>", " ", match.group(1))
    return clean(text)


def canonical_for(path):
    relative = path.as_posix()
    return DOMAIN + "/" if relative == "index.html" else f"{DOMAIN}/{relative}"


def should_index(path, source):
    relative = path.as_posix()
    if path.name in EXCLUDE_FILES or relative in NOINDEX_FILES:
        return False
    if any(relative.startswith(prefix) for prefix in NOINDEX_DIRS):
        return False
    return "noindex" not in meta_value(source, "name", "robots").lower()


def replace_or_insert_meta(source, attr, name, value):
    escaped = html.escape(value, quote=True)
    matches = meta_tags(source, attr, name)
    tag = f'<meta {attr}="{name}" content="{escaped}">'
    if matches:
        first = matches[0]
        source = source[:first.start()] + tag + source[first.end():]
        matches = meta_tags(source, attr, name)
        for match in reversed(matches[1:]):
            source = source[:match.start()] + source[match.end():]
        return source
    return re.sub(r"</head>", f"  {tag}\\n</head>", source, count=1, flags=re.I)


def replace_or_insert_canonical(source, href):
    pattern = r"<link\\b[^>]*\\brel=[\\"']canonical[\\"'][^>]*>"
    tag = f'<link rel="canonical" href="{html.escape(href, quote=True)}">'
    matches = list(re.finditer(pattern, source, flags=re.I))
    if matches:
        first = matches[0]
        source = source[:first.start()] + tag + source[first.end():]
        matches = list(re.finditer(pattern, source, flags=re.I))
        for match in reversed(matches[1:]):
            source = source[:match.start()] + source[match.end():]
        return source
    return re.sub(r"</head>", f"  {tag}\\n</head>", source, count=1, flags=re.I)


def replace_or_insert_property(source, prop, value):
    return replace_or_insert_meta(source, "property", prop, value)


def fix_jsonld_main_entity(source, canonical):
    pattern = r'("mainEntityOfPage"\\s*:\\s*")[^"]+(")'
    return re.sub(pattern, rf"\\1{canonical}\\2", source, count=1, flags=re.I)


def duplicate_asset_references(source):
    seen = set()

    def replace(match):
        tag = match.group(0)
        attr = re.search(r"\\b(?:href|src)=[\\"']([^\\"']+)[\\"']", tag, flags=re.I)
        if not attr:
            return tag
        url = attr.group(1)
        if not re.search(r"\\.(?:css|js)(?:\\?[^\\"']*)?$", url, flags=re.I):
            return tag
        key = url.lower()
        if key in seen:
            return ""
        seen.add(key)
        return tag

    return re.sub(
        r"<(?:link|script)\\b[^>]*(?:href|src)=[\\"'][^\\"']+[\\"'][^>]*>(?:</script>)?",
        replace,
        source,
        flags=re.I,
    )


def empty_alt_count(source):
    return len(re.findall(
        r"<img\\b[^>]*\\balt=[\\"']\\s*[\\"'][^>]*>",
        source,
        flags=re.I,
    ))


def missing_alt_count(source):
    return sum(
        1
        for tag in re.findall(r"<img\\b[^>]*>", source, flags=re.I)
        if not re.search(r"\\balt\\s*=", tag, flags=re.I)
    )


def bad_relative_assets(source):
    urls = re.findall(
        r"(?:src|href)=[\\"']([^\\"']+)[\\"']",
        source,
        flags=re.I,
    )
    return [
        url for url in urls
        if (
            url.startswith(".././")
            or url.startswith("../.././")
            or url.startswith("../assets/")
            or url.startswith("../../assets/")
        )
    ]


def description_is_bad(description):
    return (
        not description
        or len(description) < 70
        or len(description) > 170
        or "Chapter Real Numbers" in description
        or "Free NCERT English Solutions" in description
        or "who we are, our mission" in description.lower()
        or "CHAPTER-1: ()" in description
    )


html_files = sorted(
    path for path in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in path.parts)
)

changed = []
issues = []
indexable = []

for path in html_files:
    source = path.read_text(encoding="utf-8", errors="ignore")
    original = source

    title = title_value(source)
    description = meta_value(source, "name", "description")
    canonical = canonical_for(path)

    # --- Audit checks ---
    canonical_tags = list(re.finditer(
        r"<link\\b[^>]*\\brel=[\\"']canonical[\\"'][^>]*>",
        source,
        flags=re.I,
    ))
    if should_index(path, source) and (
        len(canonical_tags) != 1
        or canonical not in canonical_tags[0].group(0)
    ):
        issues.append(f"CANONICAL: {path}")

    for name in ("description", "viewport"):
        if len(meta_tags(source, "name", name)) != 1:
            issues.append(f"META_{name.upper()}: {path}")

    for prop in ("og:title", "og:description", "og:url"):
        if len(meta_tags(source, "property", prop)) > 1:
            issues.append(f"DUPLICATE_{prop.upper().replace(':', '_')}: {path}")

    if len(meta_tags(source, "name", "description")) > 1:
        issues.append(f"DUPLICATE_DESCRIPTION: {path}")

    if empty_alt_count(source) or missing_alt_count(source):
        issues.append(f"IMAGE_ALT: {path}")

    assets = bad_relative_assets(source)
    if assets:
        issues.append(f"RELATIVE_ASSET_PATH: {path} -> {assets}")

    if description_is_bad(description):
        issues.append(f"DESCRIPTION: {path}")

    # --- Safe automatic fixes ---
    source = duplicate_asset_references(source)

    if description_is_bad(description):
        subject = first_heading(source, "h1") or first_heading(source, "h2") or title
        subject = subject or path.stem.replace("-", " ").replace("_", " ")
        subject = subject[:120]
        new_description = (
            f"Study {subject} with clear explanations, NCERT solutions, "
            "important questions and exam-oriented resources from Saraswat Academy."
        )
        source = replace_or_insert_meta(source, "name", "description", new_description[:158])

    if not re.search(r"<meta\\b[^>]*\\bname=[\\"']viewport[\\"']", source, flags=re.I):
        source = replace_or_insert_meta(
            source,
            "name",
            "viewport",
            "width=device-width, initial-scale=1.0",
        )

    if should_index(path, source):
        source = replace_or_insert_canonical(source, canonical)
        source = replace_or_insert_property(source, "og:type", "website")
        source = replace_or_insert_property(source, "og:title", title_value(source))
        source = replace_or_insert_property(source, "og:description", meta_value(source, "name", "description"))
        source = replace_or_insert_property(source, "og:url", canonical)
        source = fix_jsonld_main_entity(source, canonical)
        indexable.append(path)

    if source != original:
        path.write_text(source, encoding="utf-8")
        changed.append(path.as_posix())

# Keep the known Class 10 Maths Chapter 8 placeholder fixed.
broken_link = Path("link_page/maths_10_ch8.html")
if broken_link.exists():
    source = broken_link.read_text(encoding="utf-8", errors="ignore")
    fixed = source.replace(
        'href=".././m"',
        'href=".././maths_10_ch8/maths_class10_ch8_ex8.1.html"',
    )
    if fixed != source:
        broken_link.write_text(fixed, encoding="utf-8")
        if broken_link.as_posix() not in changed:
            changed.append(broken_link.as_posix())

# Generate sitemap only from indexable HTML pages.
urls = sorted({canonical_for(path) for path in indexable})
xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
xml.extend(f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls)
xml.append("</urlset>")
Path("sitemap.xml").write_text("\\n".join(xml) + "\\n", encoding="utf-8")

print(f"SEO_AUDIT_HTML_FILES={len(html_files)}")
print(f"SEO_AUDIT_ISSUES={len(issues)}")
print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
for issue in issues:
    print(f"SEO_ISSUE={issue}")
