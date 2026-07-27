#!/usr/bin/env python3
"""Render resume/resume.md -> assets/resume.pdf.

Requires: pip install markdown weasyprint
Run scripts/build_resume.py first to refresh the auto-generated sections.
"""
import sys
from pathlib import Path

import markdown
from weasyprint import HTML

ROOT = Path(__file__).resolve().parent.parent
RESUME_MD = ROOT / "resume" / "resume.md"
RESUME_CSS = ROOT / "resume" / "resume.css"
OUTPUT_PDF = ROOT / "assets" / "resume.pdf"


def main():
    md_text = RESUME_MD.read_text(encoding="utf-8")
    body_html = markdown.markdown(md_text, extensions=["extra"])
    html = f"""<!doctype html>
<html><head><meta charset="utf-8"></head>
<body>{body_html}</body></html>"""
    HTML(string=html, base_url=str(ROOT)).write_pdf(
        str(OUTPUT_PDF), stylesheets=[str(RESUME_CSS)]
    )
    print(f"Wrote {OUTPUT_PDF.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
