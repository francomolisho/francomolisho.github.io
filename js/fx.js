/* =====================================================================
   Franco Molisho — immersive layer (settings.fx = true)
   1. A living landscape of golden points behind the page: hills that breathe,
      a camera that flies over them as you scroll, light that follows the mouse.
   2. A soft cursor (dot + ring) that grows on links and says "View" / "Play".
   3. A section indicator on the left (desktop).
   4. Cinematic reveals: images unveil like a curtain, titles rise word by word.
   5. Magnetic buttons.
   Plain Canvas 2D, no library. Lighter on phones; still for "reduce motion".
   ===================================================================== */
(function () {
  'use strict';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var small = Math.min(innerWidth, innerHeight) < 700;
  var on = false, raf = 0, canvas, ctx, W = 0, H = 0, DPR = 1;
  var mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  var scrollP = 0, scrollT = 0, t0 = performance.now();
  var cursor, ring, dot, label, sideNav, io, observers = [];

  /* ---------- 1. golden landscape ---------- */
  var COLS = small ? 80 : 150, ROWS = small ? 40 : 64;
  var Z_NEAR = 180, Z_FAR = 2600, SX = small ? 30 : 22;
  var ZS = (Z_FAR - Z_NEAR) / ROWS;
  var BUCKETS = 14, paths = [];
  function height(x, z, t) {
    // layered waves = rolling hills that breathe slowly
    return Math.sin(x * 0.006 + t * 0.00012) * 70 +
      Math.sin(z * 0.004 - t * 0.0001) * 60 +
      Math.cos(x * 0.0021 - z * 0.003) * 90;
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    // size from the element itself (CSS: inset 0) so it never makes the page wider than the screen
    W = canvas.clientWidth || document.documentElement.clientWidth; H = canvas.clientHeight || innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  function draw(now) {
    var t = reduce ? 0 : now - t0;
    scrollP += (scrollT - scrollP) * 0.06;
    mouse.x += (mouse.tx - mouse.x) * 0.12; mouse.y += (mouse.ty - mouse.y) * 0.12;
    ctx.clearRect(0, 0, W, H);
    var light = document.body.classList.contains('theme-light');
    var focal = W * 0.9;
    var horizon = H * (0.34 + scrollP * 0.1);          // horizon drifts down as you scroll
    var camH = 230 + scrollP * 160;                     // camera climbs
    var k = (H - horizon) * Z_NEAR / (camH * focal);    // nearest row lands at the bottom
    var travel = scrollP * 1400 + t * 0.03;             // fly forward
    var frac = travel % ZS, base = travel - frac;
    var px = (mouse.x > -999 ? (mouse.x / W - 0.5) : 0) * 140;
    for (var b = 0; b < BUCKETS; b++) paths[b] = [];
    var glows = [];
    for (var r = ROWS - 1; r >= 0; r--) {
      var zc = Z_NEAR + r * ZS - frac;                  // distance from camera
      var zw = Z_NEAR + r * ZS + base;                  // position on the land
      var s = focal / zc;
      var depth = 1 - (zc - Z_NEAR) / (Z_FAR - Z_NEAR); // 1 near → 0 far
      var fade = Math.min(1, (1 - depth) * 2.6) * Math.min(1, depth * 3 + .15);
      for (var c = 0; c < COLS; c++) {
        var xw = (c - COLS / 2) * SX + px;
        var y = height(xw, zw, t);
        var sx = W / 2 + xw * s;
        if (sx < -4 || sx > W + 4) continue;
        var sy = horizon + (camH - y) * s * k;
        if (sy < -4 || sy > H + 4) continue;
        var dx = sx - mouse.x, dy = sy - mouse.y, d2 = dx * dx + dy * dy;
        var a = (0.1 + depth * 0.5) * (0.6 + (y + 200) / 500) * fade * 0.75;
        var size = 0.7 + depth * 1.3;
        if (d2 < 26000) { glows.push(sx, sy, size, 1 - d2 / 26000, a); continue; }
        var bi = Math.min(BUCKETS - 1, Math.max(0, a * BUCKETS | 0));
        paths[bi].push(sx, sy, size);
      }
    }
    var acc = (getComputedStyle(document.body).getPropertyValue('--accent-rgb') || '').replace(/\s/g, '') || '200,164,110';
    var rgb = light ? '133,97,44' : acc, ar = acc.split(',').map(Number);
    for (b = 0; b < BUCKETS; b++) {
      var P = paths[b]; if (!P.length) continue;
      ctx.fillStyle = 'rgba(' + rgb + ',' + ((b + 0.5) / BUCKETS * (light ? .8 : 1)).toFixed(3) + ')';
      ctx.beginPath();
      for (var i = 0; i < P.length; i += 3) ctx.rect(P[i], P[i + 1], P[i + 2], P[i + 2]);
      ctx.fill();
    }
    // points near the cursor lift and glow
    for (i = 0; i < glows.length; i += 5) {
      var g = glows[i + 3], sz = glows[i + 2] * (1 + g * 0.9);
      ctx.fillStyle = light ? 'rgba(133,97,44,' + Math.min(1, glows[i + 4] + g * .7).toFixed(3) + ')'
        : 'rgba(' + Math.min(255, ar[0] + g * 50 | 0) + ',' + Math.min(255, ar[1] + g * 60 | 0) + ',' + Math.min(255, ar[2] + g * 80 | 0) + ',' + Math.min(1, glows[i + 4] + g * .9).toFixed(3) + ')';
      ctx.fillRect(glows[i], glows[i + 1] - g * 8, sz, sz);
    }
    if (on && !reduce) raf = requestAnimationFrame(draw);
  }
  function onScroll() {
    var max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    scrollT = Math.min(1, scrollY / max);
    if (reduce && canvas) draw(performance.now());
    if (sideNav) updateSide();
  }
  function onMove(e) {
    mouse.tx = e.clientX; mouse.ty = e.clientY;
    if (cursor) { dot.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'; }
  }

  /* ---------- 2. soft cursor ---------- */
  var rx = 0, ry = 0;
  function cursorLoop() {
    if (!on || !cursor) return;
    rx += (mouse.tx - rx) * 0.18; ry += (mouse.ty - ry) * 0.18;
    ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
    requestAnimationFrame(cursorLoop);
  }
  function onOver(e) {
    if (!cursor) return;
    var el = e.target.closest('a, button, .ph-open, .vplayer');
    cursor.classList.toggle('is-link', !!el);
    var txt = '';
    if (e.target.closest('.film-card')) txt = 'View';
    else if (e.target.closest('.vp-play')) txt = 'Play';
    else if (e.target.closest('.ph-open')) txt = 'Open';
    label.textContent = txt;
    cursor.classList.toggle('has-label', !!txt);
  }

  /* ---------- 3. section indicator ---------- */
  function buildSide() {
    if (sideNav) sideNav.remove();
    sideNav = null;
    if (small) return;
    var secs = Array.prototype.filter.call(document.querySelectorAll('#main section[id], #contact'), function (s) {
      return ['work', 'showreel', 'services', 'testimonials', 'partners', 'commissions', 'photography', 'field', 'philosophy', 'about', 'contact'].indexOf(s.id) > -1;
    });
    if (secs.length < 3) return;
    var names = { work: 'Films', showreel: 'Showreel', services: 'Services', testimonials: 'Kind words', partners: 'Partners', commissions: 'Commissions', photography: 'Photography', field: 'Field', philosophy: 'Philosophy', about: 'About', contact: 'Contact' };
    sideNav = document.createElement('nav');
    sideNav.className = 'fx-side'; sideNav.setAttribute('aria-label', 'Sections');
    sideNav.innerHTML = secs.map(function (s) {
      return '<a href="#' + s.id + '" data-id="' + s.id + '"><span class="fx-tick"></span><span class="fx-name">' + names[s.id] + '</span></a>';
    }).join('');
    document.body.appendChild(sideNav);
    sideNav._secs = secs;
    updateSide();
  }
  function updateSide() {
    if (!sideNav) return;
    var mid = innerHeight * 0.4, cur = null;
    sideNav._secs.forEach(function (s) { if (s.getBoundingClientRect().top < mid) cur = s.id; });
    sideNav.classList.toggle('is-visible', !!cur && scrollY > innerHeight * 0.6);
    Array.prototype.forEach.call(sideNav.children, function (a) { a.classList.toggle('is-active', a.getAttribute('data-id') === cur); });
  }

  /* ---------- 4. cinematic reveals ---------- */
  function splitTitles() {
    Array.prototype.forEach.call(document.querySelectorAll('#main .section-title, #main .film-title, #contact .cta'), function (h) {
      if (h.dataset.split) return;
      h.dataset.split = '1';
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (n) {
          if (n.nodeType === 3) {
            var frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function (w) {
              if (!w) return;
              if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
              var o = document.createElement('span'); o.className = 'fx-w';
              var i = document.createElement('span'); i.className = 'fx-wi'; i.textContent = w;
              o.appendChild(i); frag.appendChild(o);
            });
            n.parentNode.replaceChild(frag, n);
          } else if (n.nodeType === 1) walk(n);
        });
      };
      walk(h);
      Array.prototype.forEach.call(h.querySelectorAll('.fx-wi'), function (w, k) { w.style.transitionDelay = (k * 0.06) + 's'; });
      h.classList.add('fx-split');
    });
    var targets = document.querySelectorAll('.fx-split, #main .card .fc-media, #main .citem .media, #main .ph-item, #main .jcard .media, #main .portrait .media, #main .film-hero .media, #main .philosophy > .media');
    io = io || new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('fx-r'); io.observe(el); });
  }

  /* ---------- 5. magnetic buttons ---------- */
  function magnet(e) {
    var b = e.target.closest('.btn, .cv-pill, .theme-btn, .doc-btn, .menu a.navlink[href="#contact"]');
    if (!b || !fine) return;
    var r = b.getBoundingClientRect();
    var x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
    b.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    b.onmouseleave = function () { b.style.transform = ''; };
  }

  function afterRender() { setTimeout(function () { splitTitles(); buildSide(); onScroll(); }, 60); }

  window.FM_fx = function (enable) {
    if (enable === on) return;
    on = enable;
    document.body.classList.toggle('fx', on);
    if (on) {
      canvas = document.createElement('canvas');
      canvas.className = 'fx-land'; canvas.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvas, document.body.firstChild);
      ctx = canvas.getContext('2d');
      resize();
      addEventListener('resize', resize);
      addEventListener('scroll', onScroll, { passive: true });
      addEventListener('mousemove', onMove, { passive: true });
      addEventListener('hashchange', afterRender);
      if (fine && !reduce) {
        cursor = document.createElement('div'); cursor.className = 'fx-cursor'; cursor.setAttribute('aria-hidden', 'true');
        document.body.classList.add('fx-cursor-on');
        cursor.innerHTML = '<span class="fx-dot"></span><span class="fx-ring"><span class="fx-label"></span></span>';
        document.body.appendChild(cursor);
        dot = cursor.querySelector('.fx-dot'); ring = cursor.querySelector('.fx-ring'); label = cursor.querySelector('.fx-label');
        document.addEventListener('mouseover', onOver);
        document.addEventListener('mousemove', magnet);
        requestAnimationFrame(cursorLoop);
      }
      afterRender();
      reduce ? draw(performance.now()) : (raf = requestAnimationFrame(draw));
    } else {
      cancelAnimationFrame(raf);
      removeEventListener('resize', resize); removeEventListener('scroll', onScroll); removeEventListener('mousemove', onMove); removeEventListener('hashchange', afterRender);
      document.removeEventListener('mouseover', onOver); document.removeEventListener('mousemove', magnet);
      [canvas, cursor, sideNav].forEach(function (n) { if (n) n.remove(); });
      canvas = cursor = sideNav = null;
      document.body.classList.remove('fx-cursor-on');
      Array.prototype.forEach.call(document.querySelectorAll('.fx-r'), function (el) { el.classList.add('fx-in'); });
    }
  };
  document.addEventListener('visibilitychange', function () {
    if (!on || reduce) return;
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw);
  });
  if (window.FM_FX_AUTOSTART) window.FM_fx(true);
})();
