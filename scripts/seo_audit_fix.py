#!/usr/bin/env python3
import os,re,html
from pathlib import Path
from urllib.parse import urljoin,urlparse
from html.parser import HTMLParser

ROOT=Path(".")
DOMAIN="https://www.saraswatacademy.in"
EXCLUDE={"header.html","footer.html"}
NOINDEX_DIRS=("student/",)
NOINDEX_FILES={"thank-you.html","thank-you-tutor.html","under-construction.html","experimental.html"}
SKIP_DIRS={".git",".github","node_modules"}

def clean(s):
    s=re.sub(r"\\s+"," ",s or "").strip()
    return html.unescape(s)

def text_from_html(s):
    s=re.sub(r"<script[\\s\\S]*?</script>"," ",s,flags=re.I)
    s=re.sub(r"<style[\\s\\S]*?</style>"," ",s,flags=re.I)
    return clean(re.sub(r"<[^>]+>"," ",s))

def first_tag(s,tag):
    m=re.search(r"<"+tag+r"\\b[^>]*>([\\s\\S]*?)</"+tag+r">",s,re.I)
    return clean(text_from_html(m.group(1))) if m else ""

def meta(s,name):
    m=re.search(r'<meta[^>]+name=["\\\']'+re.escape(name)+r'["\\\'][^>]*content=["\\\']([^"\\\']*)["\\\']',s,re.I)
    if not m:
        m=re.search(r'<meta[^>]+content=["\\\']([^"\\\']*)["\\\'][^>]+name=["\\\']'+re.escape(name)+r'["\\\']',s,re.I)
    return html.unescape(m.group(1)).strip() if m else ""

def set_meta(s,name,value):
    pat=r'<meta([^>]+name=["\\\']'+re.escape(name)+r'["\\\'][^>]*)>'
    if re.search(pat,s,re.I):
        return re.sub(pat,lambda m: re.sub(r'content=["\\\'][^"\\\']*["\\\']', 'content="'+html.escape(value,quote=True)+'"',m.group(1),flags=re.I) if re.search(r'content=',m.group(1),re.I) else m.group(1).rstrip()+ ' content="'+html.escape(value,quote=True)+'">',s,count=1,flags=re.I)
    pat2=r'<meta([^>]+content=["\\\'][^"\\\']*["\\\'][^>]*)name=["\\\']'+re.escape(name)+r'["\\\']([^>]*)>'
    if re.search(pat2,s,re.I):
        return re.sub(pat2,lambda m:'<meta'+m.group(1).rsplit('content=',1)[0]+'content="'+html.escape(value,quote=True)+'" name="'+name+'">'+m.group(2),s,count=1,flags=re.I)
    return re.sub(r'(</head>)','  <meta name="'+name+'" content="'+html.escape(value,quote=True)+'">\\n\\1',s,count=1,flags=re.I)

def set_link(s,rel,value):
    pat=r'<link[^>]+rel=["\\\']'+re.escape(rel)+r'["\\\'][^>]*>'
    tag='<link rel="'+rel+'" href="'+html.escape(value,quote=True)+'">'
    if re.search(pat,s,re.I): return re.sub(pat,tag,s,count=1,flags=re.I)
    return re.sub(r'(</head>)','  '+tag+'\\n\\1',s,count=1,flags=re.I)

def canonical_for(path):
    return DOMAIN+"/"+path.as_posix() if path.as_posix()!="index.html" else DOMAIN+"/"

def should_index(path,s):
    p=path.as_posix()
    if path.name in EXCLUDE or p in NOINDEX_FILES or any(p.startswith(x) for x in NOINDEX_DIRS): return False
    return "noindex" not in meta(s,"robots").lower()

html_files=[]
for p in ROOT.rglob("*.html"):
    if any(part in SKIP_DIRS for part in p.parts): continue
    html_files.append(p)

changed=[]
indexable=[]
for p in html_files:
    s=p.read_text(encoding="utf-8",errors="ignore")
    orig=s
    title_m=re.search(r"<title[^>]*>([\\s\\S]*?)</title>",s,re.I)
    title=clean(title_m.group(1)) if title_m else ""
    h1=first_tag(s,"h1")
    h2=first_tag(s,"h2")
    desc=meta(s,"description")
    # Correct obviously copied/generic descriptions and missing descriptions.
    bad_desc=(not desc or len(desc)<70 or "Chapter Real Numbers" in desc or "Free NCERT English Solutions" in desc or "who we are, our mission" in desc or "CHAPTER-1: ()" in desc or "Class 10 Mathematics Chapters" in desc and p.parts[0] != "link_page")
    if bad_desc:
        subject=text_from_html(h1 or h2 or title)
        if not subject: subject=p.stem.replace("-"," ").replace("_"," ")
        if len(subject)>145: subject=subject[:142].rsplit(" ",1)[0]+"..."
        if "chapter" in subject.lower() or "solution" in subject.lower():
            newdesc=f"Study {subject} with clear explanations, NCERT solutions, important questions and exam-oriented resources from Saraswat Academy."
        elif "class" in subject.lower():
            newdesc=f"Explore {subject}, with NCERT solutions, notes, MCQs, worksheets and useful CBSE study resources from Saraswat Academy."
        else:
            newdesc=f"Explore {subject} and useful CBSE study resources, notes, practice material and learning support from Saraswat Academy."
        desc=newdesc[:158]
        s=set_meta(s,"description",desc)
    # Repair generic chapter titles using the visible H1 + chapter heading when available.
    if re.search(r"Class 10 Maths Chapter \\d+ NCERT Solutions",title,re.I) and "Real Numbers" in desc:
        chapter=first_tag(s,"h1")
        cm=re.search(r"Chapter\\s+\\d+\\s*[:\\-]\\s*([^<\\n]+)",s,re.I)
        cname=clean(cm.group(1)) if cm else ""
        mnum=re.search(r"Chapter\\s+(\\d+)",title,re.I)
        num=mnum.group(1) if mnum else ""
        if cname: title=f"Class 10 Maths Chapter {num} {cname} NCERT Solutions | Saraswat Academy"
        else: title=f"Class 10 Maths Chapter {num} NCERT Solutions | Saraswat Academy"
        s=re.sub(r"<title[^>]*>[\\s\\S]*?</title>", "<title>"+html.escape(title)+"</title>", s, count=1, flags=re.I)
    # Ensure viewport on normal pages.
    if not re.search(r'<meta[^>]+name=["\\\']viewport["\\\']',s,re.I):
        s=re.sub(r'(</head>)','  <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n\\1',s,count=1,flags=re.I)
    # Canonicalize indexable pages; retain noindex pages without forcing indexability.
    if should_index(p,s):
        s=set_link(s,"canonical",canonical_for(p))
        indexable.append(p)
    if s!=orig:
        p.write_text(s,encoding="utf-8")
        changed.append(str(p))

# Fix known broken placeholder link in Class 10 Maths Chapter 8.
p=Path("link_page/maths_10_ch8.html")
if p.exists():
    s=p.read_text(encoding="utf-8")
    s=s.replace('href=".././m"','href=".././maths_10_ch8/maths_class10_ch8_ex8.1.html"')
    p.write_text(s,encoding="utf-8")

# Regenerate sitemap from indexable HTML pages. Exclude shared fragments and utility/noindex pages.
urls=sorted({canonical_for(p) for p in indexable})
xml=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u in urls: xml.append(f"  <url><loc>{html.escape(u)}</loc></url>")
xml.append("</urlset>")
Path("sitemap.xml").write_text("\\n".join(xml)+"\\n",encoding="utf-8")
print(f"SEO_FIX_CHANGED={len(changed)}")
print(f"SEO_SITEMAP_URLS={len(urls)}")
