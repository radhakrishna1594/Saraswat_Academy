#!/usr/bin/env python3
import html
import re
from pathlib import Path

ROOT = Path(".")
DOMAIN = "https://www.saraswatacademy.in"
EXCLUDE = {"header.html", "footer.html"}
NOINDEX_DIRS = ("student/",)
NOINDEX_FILES = {
    "thank-you.html",
    "thank-you-tutor.html",
    "under-construction.html",
    "experimental.html",
}
SKIP_DIRS = {".git", ".github", "node_modules"}


def clean(value):
    value = re.sub(r"\s+", " ", value or "").strip()
    return html.unescape(value)


def text_from_html(value):
    value = re.sub(r"<script\b[\s\S]*?</script>", " ", value, flags=re.I)
    value = re.sub(r"<style\b[\s\S]*?</style>", " ", value, flags=re.I)
    return clean(re.sub(r"<[^>]+>", " ", value))


def first_tag(value, tag):
    match = re.search(
        rf"<{re.escape(tag)}\b[^>]*>([\s\S]*?)</{re.escape(tag)}>",
        value,
        flags=re.I,
    )
    return clean(text_from_html(match.group(1))) if match else ""


def meta(value, name):
    patterns = (
        rf'<meta\b[^>]*\bname=["\']{re.escape(name)}["\'][^>]*\bcontent=["\']([^"\']*)["\']',
        rf'<meta\b[^>]*\bcontent=["\']([^"\']*)["\'][^>]*\bname=["\']{re.escape(name)}["\']',
    )
    for pattern in patterns:
        match = re.search(pattern, value, flags=re.I)
        if match:
            return html.unescape(match.group(1)).strip()
    return ""


def set_meta(value, name, new_value):
    escaped = html.escape(new_value, quote=True)
    pattern = rf'<meta\b([^>]*\bname=["\']{re.escape(name)}["\'][^>]*)>'
    match = re.search(pattern, value, flags=re.I)
    if match:
        attrs = match.group(1)
        if re.search(r"\bcontent\s*=", attrs, flags=re.I):
            attrs = re.sub(
                r'\bcontent\s*=\s*["\'][^"\']*["\']',
                f'content="{escaped}"',
                attrs,
                count=1,
                flags=re.I,
            )
        else:
            attrs = attrs.rstrip() + f' content="{escaped}"'
        return value[:match.start()] + "<meta" + attrs + ">" + value[match.end():]

    reverse = rf'<meta\b([^>]*\bcontent=["\'][^"\']*["\'][^>]*)\bname=["\']{re.escape(name)}["\']([^>]*)>'
    match = re.search(reverse, value, flags=re.I)
    if match:
        attrs = match.group(1)
        attrs = re.sub(
            r'\bcontent\s*=\s*["\'][^"\']*["\']',
            f'content="{escaped}"',
            attrs,
            count=1,
            flags=re.I,
        )
        return value[:match.start()] + "<meta" + attrs + ' name="' + name + '">' + match.group(2) + value[match.end():]

    return re.sub(
        r"(</head>)",
        f'  <meta name="{name}" content="{escaped}">\n\\1',
        value,
        count=1,
        flags=re.I,
    )


def set_property(value, prop, new_value):
    escaped = html.escape(new_value, quote=True)
    pattern = rf'<meta\b([^>]*\bproperty=["\']{re.escape(prop)}["\'][^>]*)>'
    match = re.search(pattern, value, flags=re.I)
    if match:
        attrs = match.group(1)
        attrs = re.sub(r'\bcontent\s*=\s*["\'][^"\']*["\']', f'content="{escaped}"', attrs, count=1, flags=re.I)
        return value[:match.start()] + "<meta" + attrs + ">" + value[match.end():]
    return re.sub(r"(</head>)", f'  <meta property="{prop}" content="{escaped}">\n\1', value, count=1, flags=re.I)


def remove_duplicate_meta(value, attr, name):
    pattern = rf'<meta\b[^>]*\b{attr}=["\']{re.escape(name)}["\'][^>]*>'
    matches = list(re.finditer(pattern, value, flags=re.I))
    if len(matches) <= 1:
        return value
    for match in reversed(matches[1:]):
        value = value[:match.start()] + value[match.end():]
    return value


def normalize_social(value, title, description, canonical):
    for prop, val in (
        ("og:type", "website"),
        ("og:title", title),
        ("og:description", description),
        ("og:url", canonical),
    ):
        value = remove_duplicate_meta(value, "property", prop)
        value = set_property(value, prop, val)

    for name, val in (
        ("twitter:title", title),
        ("twitter:description", description),
    ):
        value = remove_duplicate_meta(value, "name", name)
        value = set_meta(value, name, val)

    value = remove_duplicate_meta(value, "name", "twitter:card")
    card = "summary_large_image" if re.search(r'<meta\b[^>]*\bproperty=["\']og:image["\'][^>]*>', value, flags=re.I) else "summary"
    value = set_meta(value, "twitter:card", card)

    og_image = re.search(r'<meta\b[^>]*\bproperty=["\']og:image["\'][^>]*\bcontent=["\']([^"\']+)', value, flags=re.I)
    if og_image:
        value = remove_duplicate_meta(value, "name", "twitter:image")
        value = set_meta(value, "twitter:image", og_image.group(1))
    return value


def set_link(value, rel, href):
    pattern = rf'<link\b[^>]*\brel=["\']{re.escape(rel)}["\'][^>]*>'
    tag = f'<link rel="{rel}" href="{html.escape(href, quote=True)}">'
    if re.search(pattern, value, flags=re.I):
        return re.sub(pattern, tag, value, count=1, flags=re.I)
    return re.sub(r"(</head>)", f"  {tag}\n\\1", value, count=1, flags=re.I)


def set_main_entity(value, href):
    """Keep an existing JSON-LD mainEntityOfPage aligned with the page canonical."""
    pattern = r'("mainEntityOfPage"\s*:\s*")[^"]+(")'
    return re.sub(pattern, rf'\1{href}\2', value, count=1, flags=re.I)


def dedupe_asset_references(value):
    """Remove duplicate local CSS/JS references while preserving first occurrence."""
    seen = set()

    def replace_tag(match):
        tag = match.group(0)
        attr = re.search(r'\b(?:href|src)=["\']([^"\']+)["\']', tag, flags=re.I)
        if not attr or not re.search(r'\.(?:css|js)(?:\?[^"\']*)?$', attr.group(1), flags=re.I):
            return tag
        url = attr.group(1).replace('.././', '../')
        url = re.sub(r'^(?:\.\./)+assets/', '/assets/', url)
        key = url.lower()
        if key in seen:
            return ''
        seen.add(key)
        if url != attr.group(1):
            return tag[:attr.start(1)] + url + tag[attr.end(1):]
        return tag

    return re.sub(
        r'<(?:link|script)\b[^>]*?(?:href|src)=["\'][^"\']+["\'][^>]*>(?:</script>)?',
        replace_tag,
        value,
        flags=re.I,
    )


def should_index(path, value):
    relative = path.as_posix()
    if (
        path.name in EXCLUDE
        or relative in NOINDEX_FILES
        or any(relative.startswith(prefix) for prefix in NOINDEX_DIRS)
    ):
        return False
    return "noindex" not in meta(value, "robots").lower()


html_files = [
    path
    for path in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in path.parts)
]

changed = []
indexable = []

for path in sorted(html_files):
    source = path.read_text(encoding="utf-8", errors="ignore")
    original = source
    source = dedupe_asset_references(source)\n
    title_match = re.search(r"<title\b[^>]*>([\s\S]*?)</title>", source, flags=re.I)
    title = clean(title_match.group(1)) if title_match else ""
    h1 = first_tag(source, "h1")
    h2 = first_tag(source, "h2")
    description = meta(source, "description")

    bad_description = (
        not description
        or len(description) < 70
        or "Chapter Real Numbers" in description
        or "Free NCERT English Solutions" in description
        or "who we are, our mission" in description.lower()
        or "CHAPTER-1: ()" in description
        or (
            "Class 10 Mathematics Chapters" in description
            and not path.as_posix().startswith("link_page/")
        )
    )

    if bad_description:
        subject = text_from_html(h1 or h2 or title)
        if not subject:
            subject = path.stem.replace("-", " ").replace("_", " ")
        if len(subject) > 145:
            subject = subject[:142].rsplit(" ", 1)[0] + "..."

        if "chapter" in subject.lower() or "solution" in subject.lower():
            new_description = (
                f"Study {subject} with clear explanations, NCERT solutions, "
                "important questions and exam-oriented resources from Saraswat Academy."
            )
        elif "class" in subject.lower():
            new_description = (
                f"Explore {subject}, with NCERT solutions, notes, MCQs, worksheets "
                "and useful CBSE study resources from Saraswat Academy."
            )
        else:
            new_description = (
                f"Explore {subject} and useful CBSE study resources, notes, "
                "practice material and learning support from Saraswat Academy."
            )

        source = set_meta(source, "description", new_description[:158])

    # Repair the known copied Class 10 Maths "Real Numbers" title pattern.
    if (
        re.search(r"Class 10 Maths Chapter \d+ NCERT Solutions", title, flags=re.I)
        and "Real Numbers" in description
    ):
        chapter_heading = first_tag(source, "h1")
        chapter_match = re.search(
            r"Chapter\s+\d+\s*[:\-]\s*([^<\n]+)",
            source,
            flags=re.I,
        )
        chapter_name = clean(chapter_match.group(1)) if chapter_match else ""
        number_match = re.search(r"Chapter\s+(\d+)", title, flags=re.I)
        number = number_match.group(1) if number_match else ""

        if chapter_name:
            new_title = (
                f"Class 10 Maths Chapter {number} {chapter_name} "
                "| NCERT Solutions | Saraswat Academy"
            )
        elif chapter_heading:
            new_title = (
                f"Class 10 Maths Chapter {number} {chapter_heading} "
                "| NCERT Solutions | Saraswat Academy"
            )
        else:
            new_title = f"Class 10 Maths Chapter {number} NCERT Solutions | Saraswat Academy"

        source = re.sub(
            r"<title\b[^>]*>[\s\S]*?</title>",
            f"<title>{html.escape(new_title)}</title>",
            source,
            count=1,
            flags=re.I,
        )

    # Ensure a viewport on pages that have a head.
    if not re.search(r'<meta\b[^>]*\bname=["\']viewport["\']', source, flags=re.I):
        source = re.sub(
            r"(</head>)",
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\\1',
            source,
            count=1,
            flags=re.I,
        )

    # Canonical must always resolve to the current page URL derived from its repository path.
    # This prevents legacy/copied canonical URLs from surviving future audits.
    if should_index(path, source):
        canonical_url = canonical_for(path)
        source = set_link(source, "canonical", canonical_url)
        source = set_main_entity(source, canonical_url)
        source = normalize_social(source, title, description, canonical_url)
        indexable.append(path)

    if source != original:
        path.write_text(source, encoding="utf-8")
        changed.append(path.as_posix())


# Fix the known broken placeholder link in Class 10 Maths Chapter 8.
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


# Regenerate sitemap from indexable HTML pages.
urls = sorted({canonical_for(path) for path in indexable})
xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
xml.extend(f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls)
xml.append("</urlset>")
Path("sitemap.xml").write_text("\n".join(xml) + "\n", encoding="utf-8")

print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
, attr.group(1), flags=re.I):
            return tag
        url = attr.group(1).replace('.././', '../')
        url = re.sub(r'^(?:\\.\\./)+assets/', '/assets/', url)
        key = url.lower()
        if key in seen:
            return ''
        seen.add(key)
        if url != attr.group(1):
            return tag[:attr.start(1)] + url + tag[attr.end(1):]
        return tag

    return re.sub(r'<(?:link|script)\\b[^>]*?(?:href|src)=["\\'][^"\\']+["\\'][^>]*>(?:</script>)?', replace_tag, value, flags=re.I)


def canonical_for(path):
    relative = path.as_posix()
    return f"{DOMAIN}/" if relative == "index.html" else f"{DOMAIN}/{relative}"


def should_index(path, value):
    relative = path.as_posix()
    if (
        path.name in EXCLUDE
        or relative in NOINDEX_FILES
        or any(relative.startswith(prefix) for prefix in NOINDEX_DIRS)
    ):
        return False
    return "noindex" not in meta(value, "robots").lower()


html_files = [
    path
    for path in ROOT.rglob("*.html")
    if not any(part in SKIP_DIRS for part in path.parts)
]

changed = []
indexable = []

for path in sorted(html_files):
    source = path.read_text(encoding="utf-8", errors="ignore")
    original = source

    title_match = re.search(r"<title\b[^>]*>([\s\S]*?)</title>", source, flags=re.I)
    title = clean(title_match.group(1)) if title_match else ""
    h1 = first_tag(source, "h1")
    h2 = first_tag(source, "h2")
    description = meta(source, "description")

    bad_description = (
        not description
        or len(description) < 70
        or "Chapter Real Numbers" in description
        or "Free NCERT English Solutions" in description
        or "who we are, our mission" in description.lower()
        or "CHAPTER-1: ()" in description
        or (
            "Class 10 Mathematics Chapters" in description
            and not path.as_posix().startswith("link_page/")
        )
    )

    if bad_description:
        subject = text_from_html(h1 or h2 or title)
        if not subject:
            subject = path.stem.replace("-", " ").replace("_", " ")
        if len(subject) > 145:
            subject = subject[:142].rsplit(" ", 1)[0] + "..."

        if "chapter" in subject.lower() or "solution" in subject.lower():
            new_description = (
                f"Study {subject} with clear explanations, NCERT solutions, "
                "important questions and exam-oriented resources from Saraswat Academy."
            )
        elif "class" in subject.lower():
            new_description = (
                f"Explore {subject}, with NCERT solutions, notes, MCQs, worksheets "
                "and useful CBSE study resources from Saraswat Academy."
            )
        else:
            new_description = (
                f"Explore {subject} and useful CBSE study resources, notes, "
                "practice material and learning support from Saraswat Academy."
            )

        source = set_meta(source, "description", new_description[:158])

    # Repair the known copied Class 10 Maths "Real Numbers" title pattern.
    if (
        re.search(r"Class 10 Maths Chapter \d+ NCERT Solutions", title, flags=re.I)
        and "Real Numbers" in description
    ):
        chapter_heading = first_tag(source, "h1")
        chapter_match = re.search(
            r"Chapter\s+\d+\s*[:\-]\s*([^<\n]+)",
            source,
            flags=re.I,
        )
        chapter_name = clean(chapter_match.group(1)) if chapter_match else ""
        number_match = re.search(r"Chapter\s+(\d+)", title, flags=re.I)
        number = number_match.group(1) if number_match else ""

        if chapter_name:
            new_title = (
                f"Class 10 Maths Chapter {number} {chapter_name} "
                "| NCERT Solutions | Saraswat Academy"
            )
        elif chapter_heading:
            new_title = (
                f"Class 10 Maths Chapter {number} {chapter_heading} "
                "| NCERT Solutions | Saraswat Academy"
            )
        else:
            new_title = f"Class 10 Maths Chapter {number} NCERT Solutions | Saraswat Academy"

        source = re.sub(
            r"<title\b[^>]*>[\s\S]*?</title>",
            f"<title>{html.escape(new_title)}</title>",
            source,
            count=1,
            flags=re.I,
        )

    # Ensure a viewport on pages that have a head.
    if not re.search(r'<meta\b[^>]*\bname=["\']viewport["\']', source, flags=re.I):
        source = re.sub(
            r"(</head>)",
            '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\\1',
            source,
            count=1,
            flags=re.I,
        )

    # Canonical must always resolve to the current page URL derived from its repository path.
    # This prevents legacy/copied canonical URLs from surviving future audits.
    if should_index(path, source):
        canonical_url = canonical_for(path)
        source = set_link(source, "canonical", canonical_url)
        source = set_main_entity(source, canonical_url)
        indexable.append(path)

    if source != original:
        path.write_text(source, encoding="utf-8")
        changed.append(path.as_posix())


# Fix the known broken placeholder link in Class 10 Maths Chapter 8.
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


# Regenerate sitemap from indexable HTML pages.
urls = sorted({canonical_for(path) for path in indexable})
xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
]
xml.extend(f"  <url><loc>{html.escape(url)}</loc></url>" for url in urls)
xml.append("</urlset>")
Path("sitemap.xml").write_text("\n".join(xml) + "\n", encoding="utf-8")

print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
