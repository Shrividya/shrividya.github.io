---
layout: default
title: Home
---

{% include hero.html %}

<hr/>

{% include about.html %}

<hr/>

{% include writing.html %}

<hr/>

{% include analytics.html %}

<hr/>

{% include techstack.html %}

<hr/>

{% include projects.html %}

<hr/>

{% include achievements.html %}

<hr/>

{% if site.posts.size > 0 %}
<section aria-labelledby="blog-heading">
  <h2 id="blog-heading">Blog</h2>
  <ul class="post-list">
    {% for post in site.posts limit:5 %}
    <li class="post-item">
      <span class="post-date">{{ post.date | date: "%B %-d, %Y" }}</span>
      <a class="post-title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
      {% if post.excerpt %}<p class="post-excerpt">{{ post.excerpt | strip_html | truncate: 120 }}</p>{% endif %}
    </li>
    {% endfor %}
  </ul>
</section>
<hr/>
{% endif %}

{% include connect.html %}
