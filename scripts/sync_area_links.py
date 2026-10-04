#!/usr/bin/env python3
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
AREA_DIR = ROOT / "home-tutor" / "best-tutor-area-wise"

pages = sorted(AREA_DIR.glob("best-home-tutor-in-*-jaipur.html"))
areas = [(p.name, p.stem.removeprefix("best-home-tutor-in-").removesuffix("-jaipur")) for p in pages]

def label(slug):
    return " ".join(w.upper() if len(w) <= 2 else w[:1].upper() + w[1:] for w in slug.split("-"))

links = "\n".join(
    f'      <li><a href="/home-tutor/best-tutor-area-wise/{filename}"><strong>Home Tuition in {label(slug)}</strong></a></li>'
    for filename, slug in areas
)

replacement = f'''<!-- AREA-WISE HOME TUITION -->
<section class="section areas" id="areas">
  <div class="container">
    <div class="eyebrow">Areas We Serve</div>
    <h2 class="section-title">Search Area-Wise Home Tutors</h2>
<br>
    <ul>
{links}
    </ul>
  </div>
</section>'''

pattern = re.compile(r'<!-- AREA-WISE HOME TUITION -->\s*<section class="section areas" id="areas">.*?</section>', re.DOTALL)
changed = 0
for page in pages:
    text = page.read_text(encoding="utf-8")
    new_text, count = pattern.subn(replacement, text, count=1)
    if count and new_text != text:
        page.write_text(new_text, encoding="utf-8")
        changed += 1

print(f"Area pages found: {len(pages)}")
print(f"Area links generated: {len(areas)}")
print(f"Pages updated: {changed}")
