# shrividya.github.io — Jekyll Profile Site

Personal portfolio and profile site built with Jekyll, hosted on GitHub Pages.

## 🚀 Quick Deploy (5 minutes)

1. **Create the repo** on GitHub named exactly: `shrividya.github.io`
2. **Push this folder** to the `main` branch
3. Go to **Settings → Pages → Source → main branch / root**
4. Your site is live at `https://shrividya.github.io` in ~2 minutes

---

## 🏗️ Project Structure

```
shrividya.github.io/
├── _config.yml          ← ✏️ Edit this: your name, socials, bio
├── index.md             ← Homepage — pulls in all sections via includes
├── Gemfile              ← Ruby dependencies (for local preview)
│
├── _layouts/
│   ├── default.html     ← HTML shell: head, nav, header, footer
│   └── post.html        ← Layout for blog posts
│
├── _includes/           ← Page sections (edit content here)
│   ├── nav.html
│   ├── hero.html
│   ├── about.html       ← ✏️ Update bio text
│   ├── writing.html     ← ✏️ Replace with your real article links
│   ├── analytics.html
│   ├── techstack.html
│   ├── projects.html    ← ✏️ Add/remove project rows
│   ├── achievements.html
│   ├── connect.html
│   └── footer.html
│
├── _posts/              ← Blog posts (Markdown files)
│   └── 2025-01-15-getting-started-with-airflow.md
│
└── assets/
    └── css/
        └── style.css    ← All styles
```

---

## ✏️ Updating Your Info

Most info is in `_config.yml` — change it once, updates everywhere:

```yaml
author:
  name: "Shrividya Hegde"
  github: "Shrividya"
  linkedin: "shrividya-hegde-shri-91562365"
  # ...etc
```

---

## 📝 Writing a New Blog Post

Create a file in `_posts/` named: `YYYY-MM-DD-your-post-title.md`

```markdown
---
layout: post
title: "Your Post Title"
date: 2025-03-01
tags: [airflow, python]
---

Your content here in Markdown...
```

The post automatically appears in the Blog section on the homepage.

---

## 💻 Local Preview

Requires Ruby. Install once:

```bash
gem install bundler
bundle install
```

Then to preview:

```bash
bundle exec jekyll serve
# Open http://localhost:4000
```

---

## 🌐 Custom Domain (Optional)

1. Buy a domain (e.g. `shrividya.dev`) — ~$12/year
2. Add a `CNAME` file to this repo containing: `shrividya.dev`
3. In your domain registrar, add these DNS records:
   ```
   A     185.199.108.153
   A     185.199.109.153
   A     185.199.110.153
   A     185.199.111.153
   ```
4. In GitHub Settings → Pages → Custom domain → enter your domain
