# shrividya.github.io — Airflow-Themed Career Profile

Personal portfolio built with Jekyll, styled as an Apache Airflow DAG scheduler UI.

## 🚀 Deploy in 5 Minutes

**Option A — GitHub web UI (no terminal needed):**
1. Create a repo named exactly `shrividya.github.io` on GitHub
2. Drag and drop ALL files from this folder into the repo
3. Go to Settings → Pages → Source → `main` branch → Save
4. Live at `https://shrividya.github.io` in ~2 minutes ✓

**Option B — Git CLI:**
```bash
cd jekyll-final
git init
git remote add origin https://github.com/Shrividya/shrividya.github.io.git
git add .
git commit -m "Launch: Airflow-themed career profile"
git push -u origin main
```
Then enable Pages in repo Settings.

---

## 📁 File Structure

```
shrividya.github.io/
├── _config.yml          ← Your info: name, email, social handles
├── index.html           ← The full Airflow-themed profile page
├── Gemfile              ← Ruby deps (for local preview only)
│
├── _layouts/
│   ├── default.html     ← HTML shell with SEO + JSON-LD
│   └── post.html        ← Blog post layout
│
├── _posts/              ← Blog posts (Markdown)
│   └── 2025-01-15-getting-started-with-airflow.md
│
└── assets/
    └── css/
        └── style.css    ← Full Airflow dark theme CSS
```

---

## ✏️ Updating Your Info

Edit `_config.yml` — change once, updates everywhere:

```yaml
author:
  name: "Shrividya Hegde"
  email: "shrividyahegde222@gmail.com"
  github: "Shrividya"
  linkedin: "shrividya-hegde-shri-91562365"
  medium: "@shrihegde"
  substack: "@shrividyahegde"
  youtube: "@shrividyahegde3119"
```

---

## 📝 Adding Blog Posts

Create `_posts/YYYY-MM-DD-your-title.md`:

```markdown
---
layout: post
title: "Your Post Title"
date: 2025-03-01
tags: [airflow, python]
---

Your content here...
```

Posts auto-appear in the "Recent Blog Posts" section on the homepage.

---

## 💻 Local Preview (optional)

Requires Ruby 3.2+ (see rbenv setup if needed):

```bash
gem install bundler
bundle install
bundle exec jekyll serve
# Open http://localhost:4000
```

---

## 🌐 Custom Domain (optional)

1. Buy a domain e.g. `shrividya.dev` (~$12/yr)
2. Add a `CNAME` file containing: `shrividya.dev`
3. Add DNS A records at your registrar:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
4. GitHub Settings → Pages → Custom domain → enter domain

---

## 🎨 Theme Notes

The site is styled as an Apache Airflow UI:
- **Top bar** mimics Airflow's navigation
- **Left sidebar** shows DAG runs as your career timeline (years)
- **Task graph** shows your career as a pipeline: Ingest → Transform → Validate → AI/RAG → Serve
- **Each stage** opens with log output, stats, and task instance tables
- **Scheduler dot** pulses green — always running!
