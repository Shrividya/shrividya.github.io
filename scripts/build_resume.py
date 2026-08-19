#!/usr/bin/env python3
"""Regenerate the auto-generated sections of resume/resume.md from _data/*.yml.

Run before scripts/render_resume.py. Only touches text between
<!-- AUTO:<NAME>:START --> / <!-- AUTO:<NAME>:END --> marker pairs; everything
else in resume.md (summary, experience, skills, education) is left untouched.
"""
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "_data"
RESUME_MD = ROOT / "resume" / "resume.md"


def load_yaml(name):
    path = DATA / name
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f) or []


def render_certifications(items):
    by_category = {}
    for c in items:
        by_category.setdefault(c["category"], []).append(c)
    lines = []
    for category, certs in by_category.items():
        lines.append(f"**{category}**")
        lines.append("")
        for c in certs:
            date = f" ({c['date']})" if c.get("date") else ""
            lines.append(f"- {c['name']} — {c['org']}{date}")
        lines.append("")
    return "\n".join(lines).rstrip()


def render_projects(items):
    lines = []
    for p in items:
        lines.append(f"**{p['title']}** *({p['tag']})*")
        lines.append("")
        lines.append(f"- {p['description']}")
        lines.append(f"- Stack: {p['stack']}")
        lines.append("")
    return "\n".join(lines).rstrip()


def render_achievements(items):
    lines = []
    for a in items:
        date = f" — {a['date']}" if a.get("date") else ""
        lines.append(f"- **{a['title']}**, {a['org']}{date}: {a['description']}")
    return "\n".join(lines).rstrip()


SECTIONS = {
    "CERTIFICATIONS": ("certifications.yml", render_certifications),
    "PROJECTS": ("projects.yml", render_projects),
    "ACHIEVEMENTS": ("achievements.yml", render_achievements),
}


def replace_section(content, name, body):
    start = f"<!-- AUTO:{name}:START -->"
    end = f"<!-- AUTO:{name}:END -->"
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.DOTALL)
    if not pattern.search(content):
        raise SystemExit(f"Marker pair for {name} not found in resume.md")
    replacement = f"{start}\n{body}\n{end}"
    return pattern.sub(replacement, content, count=1)


def main():
    content = RESUME_MD.read_text(encoding="utf-8")
    for name, (filename, renderer) in SECTIONS.items():
        items = load_yaml(filename)
        body = renderer(items)
        content = replace_section(content, name, body)
    RESUME_MD.write_text(content, encoding="utf-8")
    print(f"Updated {RESUME_MD.relative_to(ROOT)}")


if __name__ == "__main__":
    sys.exit(main())
