/* Gamified pointer effects: click bursts, button/card/badge polish, scroll reveals.
   Pure client-side, no network calls. Skipped for prefers-reduced-motion. */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var INTERACTIVE = 'a, button, [role="button"], .run-item, .task-node, .n-badge, .plink, .n-plink, .alink, .n-alink, summary, label';

  var HERO = '.n-cta-primary, .n-primary-ctas .n-cta-secondary';
  var CARDS = '.n-pcard, .n-acard, .n-scard, .n-cert-card, .wr-card, .n-tcard, .n-exp-body, .n-testi-card, .n-comm-card, .n-skill-group, .n-proj-card';
  var REVEAL = CARDS + ', .n-section-hd, .page-hero-title, .n-sh';

  function palette() {
    var cs = getComputedStyle(document.documentElement);
    var pick = function (name, fallback) { return (cs.getPropertyValue(name) || '').trim() || fallback; };
    return [pick('--accent-af', '#7c5ce8'), pick('--accent-n', '#b8a8f8'), pick('--success', '#34d874'), pick('--amber', '#f0b060')];
  }
  var colors = palette();
  var PETALS = ['#f4a7c8', '#f8c4da', '#e98fb7'];
  function petalColor() {
    var pool = PETALS.concat([colors[1], colors[0]]);
    return pool[(Math.random() * pool.length) | 0];
  }
  new MutationObserver(function () { colors = palette(); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Canvas for particles ────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d');
  var dpr = 1, W = 0, H = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  var particles = [];
  var rings = [];
  var MAX_PARTICLES = 260;

  function spawn(x, y, opts) {
    if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
    var a = opts.angle != null ? opts.angle : Math.random() * Math.PI * 2;
    var s = opts.speed != null ? opts.speed : 1 + Math.random() * 3;
    particles.push({
      x: x, y: y,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s,
      life: 1, decay: opts.decay || (0.02 + Math.random() * 0.02),
      size: opts.size || (1.5 + Math.random() * 2.5),
      color: opts.color || colors[(Math.random() * colors.length) | 0],
      gravity: opts.gravity != null ? opts.gravity : 0.06,
      shape: opts.shape || (Math.random() < 0.35 ? 'star' : 'dot'),
      rot: opts.rot != null ? opts.rot : Math.random() * Math.PI * 2,
      spin: opts.spin != null ? opts.spin : (Math.random() - 0.5) * 0.08,
      sway: Math.random() * Math.PI * 2,
      drag: opts.drag || 0.96
    });
  }

  function drawStar(x, y, r) {
    ctx.beginPath();
    for (var i = 0; i < 8; i++) {
      var rad = i % 2 === 0 ? r : r * 0.4;
      var ang = (Math.PI / 4) * i - Math.PI / 2;
      ctx.lineTo(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Lotus petal: pointed at both ends, wider toward the base
  function drawPetal(p) {
    var L = p.size * 2.6, Wd = p.size * 1.1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.beginPath();
    ctx.moveTo(0, -L);
    ctx.bezierCurveTo(Wd, -L * 0.35, Wd, L * 0.55, 0, L);
    ctx.bezierCurveTo(-Wd, L * 0.55, -Wd, -L * 0.35, 0, -L);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha *= 0.55;
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(0, -L * 0.75); ctx.lineTo(0, L * 0.75); ctx.stroke();
    ctx.restore();
  }

  var running = false;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx; p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      if (p.shape === 'petal') {
        // drift and flutter like a falling petal; drawn without additive glow so it stays soft
        p.sway += 0.08; p.x += Math.sin(p.sway) * 0.35; p.rot += p.spin;
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = Math.min(1, p.life * 1.4) * 0.85;
        ctx.shadowBlur = 4;
        drawPetal(p);
        ctx.globalCompositeOperation = 'lighter';
        continue;
      }
      ctx.globalAlpha = p.life;
      ctx.shadowBlur = 8;
      if (p.shape === 'star') drawStar(p.x, p.y, p.size * 1.8);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2); ctx.fill(); }
    }
    for (var j = rings.length - 1; j >= 0; j--) {
      var r = rings[j];
      r.radius += (r.max - r.radius) * 0.14;
      r.life -= 0.035;
      if (r.life <= 0) { rings.splice(j, 1); continue; }
      ctx.globalAlpha = r.life;
      ctx.strokeStyle = r.color;
      ctx.shadowColor = r.color;
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.5 * r.life;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
    if (particles.length || rings.length) requestAnimationFrame(loop);
    else running = false;
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

  function onClick(e) {
    var x = e.clientX, y = e.clientY;
    if (!x && !y) return; // keyboard-triggered click
    var target = e.target.closest && e.target.closest(INTERACTIVE);
    var hero = !!(e.target.closest && e.target.closest(HERO));
    var n = hero ? 30 : target ? 20 : 10;
    for (var i = 0; i < n; i++) {
      spawn(x, y, hero
        ? { speed: 3 + Math.random() * 6, size: 2.5 + Math.random() * 3, shape: Math.random() < 0.7 ? 'star' : 'dot', decay: 0.014 + Math.random() * 0.012 }
        : { speed: (target ? 2.5 : 1.5) + Math.random() * 4 });
    }
    // falling lotus petals
    var fall = hero ? 8 : target ? 5 : 3;
    for (var k = 0; k < fall; k++) {
      spawn(x, y, { shape: 'petal', color: petalColor(), angle: -Math.PI / 2 + (Math.random() - 0.5) * 2.4,
        speed: 1.5 + Math.random() * 2.5, size: 2.4 + Math.random() * 1.8, gravity: 0.035, drag: 0.95,
        decay: 0.008 + Math.random() * 0.006 });
    }
    // main CTAs: a ring of petals opening outward like a bloom
    if (hero) {
      var count = 10, off = Math.random() * Math.PI;
      for (var b = 0; b < count; b++) {
        var a = off + (Math.PI * 2 * b) / count;
        spawn(x, y, { shape: 'petal', color: petalColor(), angle: a, rot: a + Math.PI / 2, spin: 0,
          speed: 3.4, size: 4.2, gravity: 0, drag: 0.9, decay: 0.02 });
      }
    }
    rings.push({ x: x, y: y, radius: 2, max: hero ? 70 : target ? 46 : 30, life: 1, color: colors[(Math.random() * colors.length) | 0] });
    if (hero) rings.push({ x: x, y: y, radius: 2, max: 110, life: 0.8, color: colors[(Math.random() * colors.length) | 0] });
    kick();
  }

  function init() {
    document.body.appendChild(canvas);
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('click', onClick, { passive: true });
    document.documentElement.classList.add('fx-on');
    if (finePointer) setupTilt();
    setupReveal();
  }

  // ── Card tilt + glare ───────────────────────────────────
  function setupTilt() {
    var MAX = 5;
    document.querySelectorAll(CARDS).forEach(function (card) {
      card.classList.add('fx-card');
      var ownTilt = card.classList.contains('n-tilt'); // homepage already tilts these
      var raf = 0, ev = null;
      function apply() {
        raf = 0;
        var r = card.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
        card.style.setProperty('--fx-mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--fx-my', (py * 100).toFixed(1) + '%');
        if (!ownTilt) {
          card.style.transform = 'perspective(700px) rotateX(' + ((0.5 - py) * MAX * 2).toFixed(2) +
            'deg) rotateY(' + ((px - 0.5) * MAX * 2).toFixed(2) + 'deg) translateY(-3px)';
        }
      }
      card.addEventListener('mousemove', function (e) { ev = e; if (!raf) raf = requestAnimationFrame(apply); }, { passive: true });
      card.addEventListener('mouseleave', function () {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
        if (!ownTilt) card.style.transform = '';
      }, { passive: true });
    });
  }

  // ── Scroll reveal (skips anything the page already reveals) ─
  function setupReveal() {
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('fx-in');
        obs.unobserve(el);
        setTimeout(function () { el.classList.remove('fx-reveal', 'fx-in'); el.style.transitionDelay = ''; }, 900);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    var groups = new Map();
    document.querySelectorAll(REVEAL).forEach(function (el) {
      if (el.closest('.n-reveal, #view-airflow')) return;
      var parent = el.parentElement, i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms';
      el.classList.add('fx-reveal');
      obs.observe(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
