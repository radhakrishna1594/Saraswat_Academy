#!/usr/bin/env python3
"""Repository-wide SEO audit and safe fixer for Saraswat Academy."""

import html
import os
import re
from collections import Counter
from pathlib import Path

ROOT = Path(".")
DOMAIN = "https://www.saraswatacademy.in"
SKIP_DIRS = {".git", ".github", "node_modules", "templates"}
EXCLUDE_FILES = {"header.html", "footer.html"}
NOINDEX_FILES = {
    "thank-you.html",
    "thank-you-tutor.html",
    "under-construction.html",
    "experimental.html",
}
NOINDEX_DIRS = ("student/",)


def clean(value):
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def tags(source, attr, name):
    pattern = rf'<meta\b[^>]*\b{attr}=["\']{re.escape(name)}["\'][^>]*>'
    return list(re.finditer(pattern, source, flags=re.I))


def meta_value(source, attr, name):
    matches = tags(source, attr, name)
    if not matches:
        return ""
    m = re.search(r'\bcontent=["\']([^"\']*)["\']', matches[0].group(0), flags=re.I)
    return html.unescape(m.group(1)).strip() if m else ""


def title_value(source):
    m = re.search(r"<title\b[^>]*>([\s\S]*?)</title>", source, flags=re.I)
    return clean(re.sub(r"<[^>]+>", " ", m.group(1))) if m else ""


def heading(source, tag="h1"):
    m = re.search(rf"<{tag}\b[^>]*>([\s\S]*?)</{tag}>", source, flags=re.I)
    return clean(re.sub(r"<[^>]+>", " ", m.group(1))) if m else ""


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


def replace_meta(source, attr, name, value):
    escaped = html.escape(value, quote=True)
    pattern = rf'<meta\b[^>]*\b{attr}=["\']{re.escape(name)}["\'][^>]*>'
    tag = f'<meta {attr}="{name}" content="{escaped}">'
    matches = list(re.finditer(pattern, source, flags=re.I))
    if matches:
        first = matches[0]
        source = source[:first.start()] + tag + source[first.end():]
        for match in reversed(list(re.finditer(pattern, source, flags=re.I))[1:]):
            source = source[:match.start()] + source[match.end():]
        return source
    return re.sub(r"</head>", f"  {tag}\n</head>", source, count=1, flags=re.I)


def replace_property(source, prop, value):
    return replace_meta(source, "property", prop, value)


def replace_canonical(source, href):
    pattern = r'<link\b[^>]*\brel=["\']canonical["\'][^>]*>'
    tag = f'<link rel="canonical" href="{html.escape(href, quote=True)}">'
    matches = list(re.finditer(pattern, source, flags=re.I))
    if matches:
        first = matches[0]
        source = source[:first.start()] + tag + source[first.end():]
        for match in reversed(list(re.finditer(pattern, source, flags=re.I))[1:]):
            source = source[:match.start()] + source[match.end():]
        return source
    return re.sub(r"</head>", f"  {tag}\n</head>", source, count=1, flags=re.I)


def fix_main_entity(source, canonical):
    return re.sub(
        r'("mainEntityOfPage"\s*:\s*")[^"]+(")',
        rf"\1{canonical}\2",
        source,
        count=1,
        flags=re.I,
    )


def dedupe_assets(source):
    seen = set()

    def replace(match):
        tag = match.group(0)
        m = re.search(r'\b(?:href|src)=["\']([^"\']+)["\']', tag, flags=re.I)
        if not m or not re.search(r'\.(?:css|js)(?:\?[^"\']*)?, m.group(1), flags=re.I):
            return tag
        key = m.group(1).lower()
        if key in seen:
            return ""
        seen.add(key)
        return tag

    return re.sub(
        r'<(?:link|script)\b[^>]*(?:href|src)=["\'][^"\']+["\'][^>]*>(?:</script>)?',
        replace,
        source,
        flags=re.I,
    )


def image_alt_text(src, title="", caption=""):
    """Build a conservative human-readable alt value from available page context."""
    text = clean(caption) or clean(title)
    if text:
        return text[:180]

    value = re.sub(r"[/_+-]+", " ", src.rsplit("/", 1)[-1])
    value = re.sub(r"\.(?:png|jpe?g|webp|gif|svg|avif)$", "", value, flags=re.I)
    value = clean(value)
    value = re.sub(r"\b(?:img|image|pic|picture|photo|screenshot)\b", "", value, flags=re.I)
    value = clean(value)
    return value[:180]


def fix_missing_image_alts(source):
    """Add alt only when it is genuinely missing; preserve alt="" for decorative images."""
    changed = 0

    def replace(match):
        nonlocal changed
        tag = match.group(0)
        if re.search(r'\balt\s*=', tag, flags=re.I):
            return tag

        src_match = re.search(r'\bsrc\s*=\s*["\']([^"\']+)["\']', tag, flags=re.I)
        if not src_match:
            return tag

        src = html.unescape(src_match.group(1))
        alt = image_alt_text(src)
        if not alt:
            return tag

        changed += 1
        insertion = f' alt="{html.escape(alt, quote=True)}"'
        return re.sub(r"\s*/?>$", insertion + r"\g<0>", tag)

    fixed = re.sub(r"<img\b[^>]*>", replace, source, flags=re.I)
    return fixed, changed


def image_alt_issues(source):
    missing = 0
    empty = 0
    for tag in re.findall(r"<img\b[^>]*>", source, flags=re.I):
        m = re.search(r'\balt\s*=\s*["\']([^"\']*)["\']', tag, flags=re.I)
        if not m:
            missing += 1
        elif not m.group(1).strip():
            empty += 1
    return missing, empty


def relative_asset_issues(source):
    urls = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', source, flags=re.I)
    return [
        u for u in urls
        if u.startswith(".././") or u.startswith("../.././")
    ]


def bad_description(description):
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
    p for p in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in p.parts)
)

# Repeated embedded <style> blocks are a major source of duplicated CSS.
# Only exact CSS blocks repeated across multiple pages are externalized so
# page-specific styling is left untouched.
style_counts = Counter()
for path in html_files:
    source = path.read_text(encoding="utf-8", errors="ignore")
    for match in re.finditer(r"<style\b[^>]*>([\s\S]*?)</style>", source, flags=re.I):
        css = match.group(1).strip()
        if len(css) >= 200:
            style_counts[css] += 1

COMMON_STYLE_MIN_USES = 3
common_styles = {
    css for css, count in style_counts.items()
    if count >= COMMON_STYLE_MIN_USES
}
COMMON_STYLE_PATH = Path("assets/css/inline-common.css")

if common_styles:
    COMMON_STYLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    chunks = [
        "/* Shared CSS extracted automatically from repeated page-level <style> blocks. */",
        "/* Generated by scripts/seo_audit_fix.py — do not edit generated sections manually. */",
        "",
    ]
    for number, css in enumerate(sorted(common_styles), 1):
        chunks.extend([f"/* Shared block {number} — used on {style_counts[css]} pages */", css, ""])
    generated_css = "\n".join(chunks).rstrip() + "\n"
    if not COMMON_STYLE_PATH.exists() or COMMON_STYLE_PATH.read_text(encoding="utf-8", errors="ignore") != generated_css:
        COMMON_STYLE_PATH.write_text(generated_css, encoding="utf-8")


def externalize_common_styles(source, path):
    if not common_styles:
        return source
    rel = os.path.relpath(COMMON_STYLE_PATH, path.parent).replace(os.sep, "/")

    def replace(match):
        css = match.group(1).strip()
        if css not in common_styles:
            return match.group(0)
        return f'<link rel="stylesheet" href="{rel}">'

    return re.sub(
        r"<style\b[^>]*>([\s\S]*?)</style>",
        replace,
        source,
        flags=re.I,
    )


changed = []
issues = []
indexable = []

for path in html_files:
    source = path.read_text(encoding="utf-8", errors="ignore")
    original = source
    canonical = canonical_for(path)
    description = meta_value(source, "name", "description")
    title = title_value(source)

    canonical_tags = list(re.finditer(
        r'<link\b[^>]*\brel=["\']canonical["\'][^>]*>',
        source,
        flags=re.I,
    ))
    if should_index(path, source) and (
        len(canonical_tags) != 1 or canonical not in canonical_tags[0].group(0)
    ):
        issues.append(f"CANONICAL: {path}")

    if len(tags(source, "name", "description")) != 1:
        issues.append(f"DESCRIPTION_TAG: {path}")
    if len(tags(source, "name", "viewport")) != 1:
        issues.append(f"VIEWPORT: {path}")

    for prop in ("og:title", "og:description", "og:url"):
        if len(tags(source, "property", prop)) > 1:
            issues.append(f"DUPLICATE_{prop.upper().replace(':', '_')}: {path}")

    missing_alt, empty_alt = image_alt_issues(source)
    if missing_alt or empty_alt:
        issues.append(f"IMAGE_ALT: {path} missing={missing_alt} empty={empty_alt}")

    bad_assets = relative_asset_issues(source)
    if bad_assets:
        issues.append(f"RELATIVE_ASSET_PATH: {path}")

    if bad_description(description):
        issues.append(f"DESCRIPTION: {path}")

    source, alt_fixed = fix_missing_image_alts(source)
    if alt_fixed:
        changed.append(path.as_posix())
        issues.append(f"IMAGE_ALT_FIXED: {path} count={alt_fixed}")

    source = externalize_common_styles(source, path)
    source = dedupe_assets(source)

    if bad_description(description):
        subject = heading(source, "h1") or heading(source, "h2") or title
        subject = subject or path.stem.replace("-", " ").replace("_", " ")
        new_description = (
            f"Study {subject[:120]} with clear explanations, NCERT solutions, "
            "important questions and exam-oriented resources from Saraswat Academy."
        )
        source = replace_meta(source, "name", "description", new_description[:158])

    if not re.search(r'<meta\b[^>]*\bname=["\']viewport["\']', source, flags=re.I):
        source = replace_meta(
            source,
            "name",
            "viewport",
            "width=device-width, initial-scale=1.0",
        )

    if should_index(path, source):
        source = replace_canonical(source, canonical)
        source = replace_property(source, "og:type", "website")
        source = replace_property(source, "og:title", title_value(source))
        source = replace_property(
            source,
            "og:description",
            meta_value(source, "name", "description"),
        )
        source = replace_property(source, "og:url", canonical)
        source = fix_main_entity(source, canonical)
        indexable.append(path)

    if source != original:
        path.write_text(source, encoding="utf-8")
        changed.append(path.as_posix())

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

urls = sorted({canonical_for(path) for path in indexable})
xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
xml.extend(f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls)
xml.append("</urlset>")
Path("sitemap.xml").write_text("\n".join(xml) + "\n", encoding="utf-8")

print(f"SEO_AUDIT_HTML_FILES={len(html_files)}")
print(f"SEO_AUDIT_ISSUES={len(issues)}")
print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
for issue in issues:
    print(f"SEO_ISSUE={issue}")
, m.group(1), flags=re.I):
            return tag
        key = m.group(1).lower()
        if key in seen:
            return ""
        seen.add(key)
        return tag

    return re.sub(
        r'<(?:link|script)\b[^>]*(?:href|src)=["\'][^"\']+["\'][^>]*>(?:</script>)?',
        replace,
        source,
        flags=re.I,
    )


def image_alt_issues(source):
    missing = 0
    empty = 0
    for tag in re.findall(r"<img\b[^>]*>", source, flags=re.I):
        m = re.search(r'\balt\s*=\s*["\']([^"\']*)["\']', tag, flags=re.I)
        if not m:
            missing += 1
        elif not m.group(1).strip():
            empty += 1
    return missing, empty


def relative_asset_issues(source):
    urls = re.findall(r'(?:src|href)=["\']([^"\']+)["\']', source, flags=re.I)
    return [
        u for u in urls
        if u.startswith(".././") or u.startswith("../.././")
    ]


def bad_description(description):
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
    p for p in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in p.parts)
)

# Repeated embedded <style> blocks are a major source of duplicated CSS.
# Only exact CSS blocks repeated across multiple pages are externalized so
# page-specific styling is left untouched.
style_counts = Counter()
for path in html_files:
    source = path.read_text(encoding="utf-8", errors="ignore")
    for match in re.finditer(r"<style\b[^>]*>([\s\S]*?)</style>", source, flags=re.I):
        css = match.group(1).strip()
        if len(css) >= 200:
            style_counts[css] += 1

COMMON_STYLE_MIN_USES = 3
common_styles = {
    css for css, count in style_counts.items()
    if count >= COMMON_STYLE_MIN_USES
}
COMMON_STYLE_PATH = Path("assets/css/inline-common.css")

if common_styles:
    COMMON_STYLE_PATH.parent.mkdir(parents=True, exist_ok=True)
    chunks = [
        "/* Shared CSS extracted automatically from repeated page-level <style> blocks. */",
        "/* Generated by scripts/seo_audit_fix.py — do not edit generated sections manually. */",
        "",
    ]
    for number, css in enumerate(sorted(common_styles), 1):
        chunks.extend([f"/* Shared block {number} — used on {style_counts[css]} pages */", css, ""])
    generated_css = "\n".join(chunks).rstrip() + "\n"
    if not COMMON_STYLE_PATH.exists() or COMMON_STYLE_PATH.read_text(encoding="utf-8", errors="ignore") != generated_css:
        COMMON_STYLE_PATH.write_text(generated_css, encoding="utf-8")


def externalize_common_styles(source, path):
    if not common_styles:
        return source
    rel = os.path.relpath(COMMON_STYLE_PATH, path.parent).replace(os.sep, "/")

    def replace(match):
        css = match.group(1).strip()
        if css not in common_styles:
            return match.group(0)
        return f'<link rel="stylesheet" href="{rel}">'

    return re.sub(
        r"<style\b[^>]*>([\s\S]*?)</style>",
        replace,
        source,
        flags=re.I,
    )


changed = []
issues = []
indexable = []

for path in html_files:
    source = path.read_text(encoding="utf-8", errors="ignore")
    original = source
    canonical = canonical_for(path)
    description = meta_value(source, "name", "description")
    title = title_value(source)

    canonical_tags = list(re.finditer(
        r'<link\b[^>]*\brel=["\']canonical["\'][^>]*>',
        source,
        flags=re.I,
    ))
    if should_index(path, source) and (
        len(canonical_tags) != 1 or canonical not in canonical_tags[0].group(0)
    ):
        issues.append(f"CANONICAL: {path}")

    if len(tags(source, "name", "description")) != 1:
        issues.append(f"DESCRIPTION_TAG: {path}")
    if len(tags(source, "name", "viewport")) != 1:
        issues.append(f"VIEWPORT: {path}")

    for prop in ("og:title", "og:description", "og:url"):
        if len(tags(source, "property", prop)) > 1:
            issues.append(f"DUPLICATE_{prop.upper().replace(':', '_')}: {path}")

    missing_alt, empty_alt = image_alt_issues(source)
    if missing_alt or empty_alt:
        issues.append(f"IMAGE_ALT: {path} missing={missing_alt} empty={empty_alt}")

    bad_assets = relative_asset_issues(source)
    if bad_assets:
        issues.append(f"RELATIVE_ASSET_PATH: {path}")

    if bad_description(description):
        issues.append(f"DESCRIPTION: {path}")

    source = externalize_common_styles(source, path)
    source = dedupe_assets(source)

    if bad_description(description):
        subject = heading(source, "h1") or heading(source, "h2") or title
        subject = subject or path.stem.replace("-", " ").replace("_", " ")
        new_description = (
            f"Study {subject[:120]} with clear explanations, NCERT solutions, "
            "important questions and exam-oriented resources from Saraswat Academy."
        )
        source = replace_meta(source, "name", "description", new_description[:158])

    if not re.search(r'<meta\b[^>]*\bname=["\']viewport["\']', source, flags=re.I):
        source = replace_meta(
            source,
            "name",
            "viewport",
            "width=device-width, initial-scale=1.0",
        )

    if should_index(path, source):
        source = replace_canonical(source, canonical)
        source = replace_property(source, "og:type", "website")
        source = replace_property(source, "og:title", title_value(source))
        source = replace_property(
            source,
            "og:description",
            meta_value(source, "name", "description"),
        )
        source = replace_property(source, "og:url", canonical)
        source = fix_main_entity(source, canonical)
        indexable.append(path)

    if source != original:
        path.write_text(source, encoding="utf-8")
        changed.append(path.as_posix())

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

urls = sorted({canonical_for(path) for path in indexable})
xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
xml.extend(f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls)
xml.append("</urlset>")
Path("sitemap.xml").write_text("\n".join(xml) + "\n", encoding="utf-8")

print(f"SEO_AUDIT_HTML_FILES={len(html_files)}")
print(f"SEO_AUDIT_ISSUES={len(issues)}")
print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
for issue in issues:
    print(f"SEO_ISSUE={issue}")
