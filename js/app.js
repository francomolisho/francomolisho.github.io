/* =====================================================================
   Franco Molisho — website engine
   Builds every page from window.SITE (js/content.js).
   Two homepage designs share the same content:
     settings.layout = "cinematic"  → dark, image-led (Design A)
     settings.layout = "index"      → light, editorial film index (Design B)
   Pages:  #/  home  ·  #work, #services …  home sections  ·  #/film/<id>  film page
   ===================================================================== */
(function () {
  'use strict';

  var S = window.SITE;
  var main = document.getElementById('main');
  var footer = document.getElementById('contact');

  if (!S || typeof S !== 'object') {
    main.innerHTML =
      '<div class="content-error"><h1>content.js could not be read</h1>' +
      '<p>The website text lives in <b>public/js/content.js</b>. A comma or quote is probably missing ' +
      'near the last line you changed. Undo that change, save, and refresh the page.</p></div>';
    return;
  }

  var SET = S.settings || {};
  var DEV = !!SET.showPlaceholderNotes;
  /* draftSections: show the layout of new sections (testimonials, photography) with empty frames
     while their content is being gathered. Keep false on the public site: empty sections stay hidden. */
  var DRAFT = DEV || !!SET.draftSections;
  var LAYOUT = SET.layout === 'index' ? 'index' : 'cinematic';
  /* Theme: starts with settings.theme (dark), visitors can switch with the sun/moon button.
     Their choice is remembered in their own browser only. */
  var THEME_KEY = 'fm-theme';
  function storedTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function storeTheme(t) { try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* storage unavailable: choice lasts for this visit */ } }
  var DEFAULT_THEME = SET.theme === 'light' ? 'light' : 'dark';
  var saved = SET.themeToggle === false ? null : storedTheme();
  var THEME = saved === 'light' || saved === 'dark' ? saved : DEFAULT_THEME;
  document.body.classList.add('layout-' + LAYOUT, 'theme-' + THEME);
  function applyTheme(t) {
    THEME = t;
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add('theme-' + t);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#F4EFE7' : '#14110E');
    var b = document.querySelector('.theme-btn');
    if (b) {
      b.setAttribute('aria-pressed', String(t === 'light'));
      b.setAttribute('aria-label', t === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
      b.setAttribute('title', t === 'light' ? 'Dark mode' : 'Light mode');
    }
  }
  /* Typeface: settings.font = "classic" | "montserrat" | "poppins" */
  var FONTS = {
    montserrat: 'Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300',
    poppins: 'Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300'
  };
  window.FM_setFont = function (name) {
    document.body.classList.remove('font-montserrat', 'font-poppins', 'type-sans');
    if (!FONTS[name]) return;
    if (!document.getElementById('font-' + name)) {
      var l = document.createElement('link');
      l.id = 'font-' + name; l.rel = 'stylesheet';
      l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[name] + '&display=swap';
      document.head.appendChild(l);
    }
    document.body.classList.add('font-' + name, 'type-sans');
  };
  window.FM_setFont(SET.font);
  /* Interface style: settings.ui = "classic" | "modern" (rounded cards, pill buttons, glass header) */
  window.FM_setUI = function (name) {
    document.body.classList.toggle('ui-modern', name === 'modern' || name === 'glass');
    document.body.classList.toggle('ui-glass', name === 'glass');
  };
  window.FM_setUI(SET.ui);
  if (DEV) document.body.classList.add('dev');
  var PAL = ((location.search || '').match(/palette=([a-z-]+)/) || [])[1] || SET.palette || '';
  if (PAL && PAL !== 'amber') document.body.classList.add('pal-' + PAL);
  else if (SET.accent) document.documentElement.style.setProperty('--accent', SET.accent);

  /* ---------- helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function joinRoles(a) { return (a || []).map(esc).join(' · '); }
  function films() { return S.films || []; }
  function filmById(id) { return films().filter(function (f) { return f.id === id; })[0]; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todo(text) { return DEV ? '<span class="note-missing">[' + esc(text) + ']</span>' : ''; }

  /* An image slot. Missing file → elegant placeholder.
     o.title: when set, a missing image shows the title as a quiet "title card" on the public site. */
  function media(src, o) {
    o = o || {};
    var label = DEV ? '<b>' + esc(o.note || '') + '</b>' + (src ? esc(src) : 'no file set') : '';
    var img = src
      ? '<img src="' + esc(src) + '" alt="' + esc(o.alt || '') + '"' +
        (o.eager ? ' fetchpriority="high"' : ' loading="lazy"') +
        ' decoding="async" onload="FM.loaded(this)" onerror="FM.missing(this)">'
      : '';
    var card = o.title
      ? '<span class="media-title" aria-hidden="true"><span class="mt-t">' + esc(o.title) + '</span>' +
        (o.sub ? '<span class="mt-s">' + esc(o.sub) + '</span>' : '') + '</span>'
      : '';
    return '<figure class="media ' + (o.cls || '') + (src ? '' : ' is-missing') + (o.title ? ' has-title' : '') +
      '" style="--ratio:' + (o.ratio || '16 / 9') + (o.focus ? ';--focus:' + esc(o.focus) : '') + '">' +
      '<span class="guides" aria-hidden="true"></span>' + img + card +
      '<figcaption class="media-label">' + label + '</figcaption></figure>';
  }

  function gallery(list, o) {
    o = o || {};
    var items = (list || []).filter(Boolean);
    if (!items.length) {
      var out = '';
      for (var i = 1; i <= (o.empty || 3); i++) out += media('', { ratio: o.ratio, note: o.note + ' · ' + pad(i) });
      return '<div class="gallery all-missing">' + out + '</div>';
    }
    return '<div class="gallery" data-gallery>' + items.map(function (src, i) {
      return media(src, { ratio: o.ratio, note: o.note + ' · ' + pad(i + 1), alt: o.alt ? o.alt + ' — still ' + (i + 1) : '' });
    }).join('') + '</div>';
  }

  window.FM = {
    loaded: function (img) { img.parentNode.classList.add('is-loaded'); },
    missing: function (img) {
      var fig = img.parentNode;
      fig.classList.add('is-missing');
      img.remove();
      var g = fig.closest('[data-gallery]');
      if (g && !g.querySelector('img')) g.classList.add('all-missing');
    }
  };

  /* festival laurel branch (left); mirrored with class "r" for the right side */
  var WREATH = (function () {
    // curved half-wreath: a stem bending outward, paired leaves that shrink towards the tip
    function B(t) { var u = 1 - t; return [u * u * 25 + 2 * u * t * 1 + t * t * 21, u * u * 94 + 2 * u * t * 52 + t * t * 6]; }
    function D(t) { var u = 1 - t; return [2 * u * (1 - 25) + 2 * t * (21 - 1), 2 * u * (52 - 94) + 2 * t * (6 - 52)]; }
    var leaves = '', n = 8;
    for (var i = 0; i < n; i++) {
      var t = 0.1 + i * (0.86 / (n - 1)), p = B(t), d = D(t), ang = Math.atan2(d[1], d[0]) * 180 / Math.PI;
      var sz = 1 - i * 0.055, rx = (6.6 * sz).toFixed(2), ry = (2.5 * sz).toFixed(2);
      var len = Math.sqrt(d[0] * d[0] + d[1] * d[1]), nx = -d[1] / len, ny = d[0] / len;
      var ox = p[0] - nx * 5.2 * sz, oy = p[1] - ny * 5.2 * sz, ix = p[0] + nx * 4.4 * sz, iy = p[1] + ny * 4.4 * sz;
      leaves += '<ellipse cx="' + ox.toFixed(1) + '" cy="' + oy.toFixed(1) + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + (ang + 32).toFixed(0) + ' ' + ox.toFixed(1) + ' ' + oy.toFixed(1) + ')"/>';
      if (i < n - 1) leaves += '<ellipse cx="' + ix.toFixed(1) + '" cy="' + iy.toFixed(1) + '" rx="' + (rx * 0.85).toFixed(2) + '" ry="' + (ry * 0.85).toFixed(2) + '" transform="rotate(' + (ang - 32).toFixed(0) + ' ' + ix.toFixed(1) + ' ' + iy.toFixed(1) + ')"/>';
    }
    var tip = B(0.99);
    leaves += '<ellipse cx="' + tip[0].toFixed(1) + '" cy="' + (tip[1] - 3).toFixed(1) + '" rx="2" ry="4.4" transform="rotate(14 ' + tip[0].toFixed(1) + ' ' + (tip[1] - 3).toFixed(1) + ')"/>';
    return '<svg class="wreath" viewBox="0 0 34 100" aria-hidden="true"><path d="M25 94 Q 1 52, 21 6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><g fill="currentColor">' + leaves + '</g></svg>';
  })();
  var PLAY = '<svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M1.5 1.5 L12.5 8 L1.5 14.5 Z"/></svg>';
  var ARROW = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 13 L13 3 M5 3 H13 V11"/></svg>';
  var DOWN = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M7 1 V13 M2 8 L7 13 L12 8"/></svg>';
  var RIGHT = '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M0 6 H15 M10 1 L15 6 L10 11"/></svg>';

  function embedUrl(url) {
    if (!url) return '';
    var y = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
    if (y) return 'https://www.youtube-nocookie.com/embed/' + y[1] + '?rel=0&modestbranding=1';
    var v = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
    if (v) return 'https://player.vimeo.com/video/' + v[1] + '?' + (v[2] ? 'h=' + v[2] + '&' : '') + 'title=0&byline=0&portrait=0&dnt=1';
    return '';
  }
  /* silent, looping, chrome-less background version of a Vimeo / YouTube link */
  function backgroundEmbed(url) {
    if (!url) return '';
    var y = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
    if (y) return 'https://www.youtube-nocookie.com/embed/' + y[1] + '?autoplay=1&mute=1&controls=0&loop=1&playlist=' + y[1] + '&playsinline=1&rel=0&modestbranding=1';
    var v = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
    if (v) return 'https://player.vimeo.com/video/' + v[1] + '?' + (v[2] ? 'h=' + v[2] + '&' : '') + 'background=1&autoplay=1&loop=1&muted=1&dnt=1';
    return '';
  }
  function showreelReady() { var r = S.showreel || {}; return !!(embedUrl(r.embedUrl) || r.videoFile); }

  /* A video player that never shows an empty frame.
     1. Visitors first see a still with a play button (fast page, no blank box).
     2. On click the Vimeo / YouTube player loads and starts.
     3. If the player does not answer within a few seconds (blocked by the browser, a network,
        or the video's privacy settings), the still comes back with a "Watch on Vimeo" button. */
  function playerHTML(url, o) {
    o = o || {};
    var src = embedUrl(url);
    if (!src) return '';
    var host = /youtu/.test(url) ? 'YouTube' : 'Vimeo';
    return '<div class="player vplayer" data-src="' + esc(src) + '" data-host="' + host + '" data-title="' + esc(o.title || '') + '" style="aspect-ratio:' + esc(o.ratio || '16 / 9') + '">' +
      (o.poster ? media(o.poster, { ratio: 'auto', focus: o.focus, alt: '' }) : '') +
      '<button class="vp-play" type="button" aria-label="Play — ' + esc(o.title || 'video') + '"><span class="vp-ring">' + PLAY + '</span>' +
      '<span class="vp-label">' + esc(o.label || 'Play') + '</span></button>' +
      '<div class="vp-fail" hidden><p class="vp-fail-t">Video not playing?</p>' +
      '<a class="btn" href="' + esc(url) + '" target="_blank" rel="noopener"><span class="ring">' + ARROW + '</span><span>Watch on ' + host + '</span></a></div>' +
      '</div>';
  }
  function bindPlayers(root) {
    Array.prototype.forEach.call(root.querySelectorAll('.vplayer'), function (p) {
      var b = p.querySelector('.vp-play');
      if (!b) return;
      b.addEventListener('click', function () {
        var src = p.getAttribute('data-src'), vimeo = p.getAttribute('data-host') === 'Vimeo';
        var f = document.createElement('iframe');
        f.src = src + (src.indexOf('?') < 0 ? '?' : '&') + 'autoplay=1' + (vimeo ? '&api=1' : '');
        f.title = p.getAttribute('data-title');
        f.allow = 'autoplay; fullscreen; picture-in-picture';
        f.setAttribute('allowfullscreen', '');
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        p.classList.add('is-playing');
        p.appendChild(f);
        var answered = false;
        function onMsg(e) {
          if (e.source !== f.contentWindow) return;
          answered = true; p.classList.add('is-ready'); p.classList.remove('is-failed');
          window.removeEventListener('message', onMsg);
        }
        window.addEventListener('message', onMsg);
        // the still fades away once the player has loaded
        f.addEventListener('load', function () { setTimeout(function () { p.classList.add('is-ready'); }, 600); });
        // no word from the player after 9 s: keep it in place, but offer the direct link on top
        setTimeout(function () { if (!answered) { p.classList.add('is-failed'); p.querySelector('.vp-fail').hidden = false; } }, 9000);
      });
    });
  }

  function watchTag(f) {
    if (embedUrl(f.link) || f.link) return '<p class="watch-tag"><span aria-hidden="true">▶</span> Full film online</p>';
    if (f.trailer) return '<p class="watch-tag"><span aria-hidden="true">▶</span> Teaser online</p>';
    return '';
  }
  function filmMeta(f) { return [f.year, f.kind, f.runtime].filter(Boolean).map(esc).join(' · '); }

  /* ======================= SHARED SECTIONS ======================= */
  function showreelSection() {
    if (!showreelReady() && !DEV) return '';
    var r = S.showreel || {}, player, src = embedUrl(r.embedUrl);
    if (src) {
      player = playerHTML(r.embedUrl, { title: 'Showreel — ' + S.person.name, label: 'Play showreel', poster: r.poster });
    } else if (r.videoFile) {
      player = '<div class="player"><video controls preload="none" playsinline' + (r.poster ? ' poster="' + esc(r.poster) + '"' : '') +
        ' src="' + esc(r.videoFile) + '"></video></div>';
    } else {
      player = '<div class="player is-pending">' + media(r.poster, { note: 'Showreel poster frame · 16:9' }) +
        '<div class="pending"><span class="ring" aria-hidden="true">' + PLAY + '</span>' +
        '<p class="eyebrow">' + esc(r.pendingNote || 'Showreel in progress') + '</p>' +
        '<p class="p-title">Coming <em class="it">soon</em></p>' +
        '<p class="note-missing">Hidden on the public site until showreel.embedUrl or showreel.videoFile is set</p></div></div>';
    }
    return '<section id="showreel" class="section wrap"><div class="section-head"><h2 class="section-title">Showreel</h2>' +
      '<span class="meta">' + esc(r.year || '') + '</span></div><div class="reveal">' + player + '</div></section>';
  }

  function servicesList(cls) {
    return (S.services || []).map(function (s, i) {
      return '<article class="' + cls + ' reveal"><p class="svc-n">' + pad(i + 1) + '</p>' +
        '<div class="svc-body"><h3 class="svc-t">' + esc(s.title) + '</h3><p class="svc-text">' + esc(s.text) + '</p></div>' +
        '<ul class="svc-items">' + (s.items || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></article>';
    }).join('');
  }
  function availableBlock() {
    var av = S.availableFor || [];
    return '<div class="available reveal">' +
      (av.length ? '<div><p class="meta">Available for</p><p class="av-list">' + av.map(esc).join('<span class="dot">·</span>') + '</p></div>' : '') +
      '<a class="btn" href="#contact"><span class="ring">' + RIGHT + '</span><span>Start a conversation</span></a></div>';
  }

  function experienceRows() {
    return '<div class="xp-list">' + (S.experience || []).map(function (e) {
      return '<div class="xp"><span class="xp-years">' + esc(e.years) + '</span>' +
        '<div class="xp-org"><p class="o">' + esc(e.org) + '</p>' + (e.note ? '<p class="n">' + esc(e.note) + '</p>' : '') + '</div>' +
        '<span class="xp-roles">' + joinRoles(e.roles) + '</span></div>';
    }).join('') + '</div>';
  }

  function commissionedImages(cls) {
    var gal = S.commissionedGallery || [];
    if (!gal.length) return '';
    return '<div class="' + cls + '">' + gal.map(function (g) {
      return '<figure class="citem reveal">' + media(g.image, { ratio: '3 / 2', note: 'Commissioned still · 3:2', alt: g.caption, focus: g.focus }) +
        '<figcaption class="meta-sm">' + esc(g.caption) + '</figcaption></figure>';
    }).join('') + '</div>';
  }

  function recognitionBlock() {
    function item(x, withFilm) {
      return '<div class="rec-item"><p class="meta">' + (x.year ? esc(x.year) : todo('Year to confirm')) + '</p>' +
        '<p class="t">' + esc(x.title) + '</p><p class="d">' + esc(x.detail) + '</p>' +
        (withFilm && x.film ? '<p class="f">' + esc(x.film) + '</p>' : '') + '</div>';
    }
    return '<div class="rec-grid">' +
      '<div class="reveal"><p class="eyebrow">Recognition</p><div class="rec-list">' + (S.recognition || []).map(function (x) { return item(x, true); }).join('') + '</div></div>' +
      '<div class="reveal"><p class="eyebrow">Training &amp; Programmes</p><div class="rec-list">' + (S.training || []).map(function (x) { return item(x, false); }).join('') + '</div></div>' +
      '</div>';
  }

  function aboutText() {
    var A = S.about || {}, P = S.person;
    return '<p class="about-lead">' + esc(A.lead) + '</p>' +
      '<div class="about-body">' + (A.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<div class="chips">' + (A.interests || []).map(function (t) { return '<span class="chip">' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="facts">' +
      '<div><p class="meta">Based in</p><p>' + esc(P.location) + '</p></div>' +
      '<div><p class="meta">Experience</p><p>' + esc(P.experienceYears) + '</p></div>' +
      '<div><p class="meta">Languages</p><p>' + (S.languages || []).map(function (l) { return esc(l.name); }).join(' · ') + '</p></div>' +
      '</div>';
  }

  function quoteHTML(cls) {
    var Ph = S.philosophy || {};
    return '<blockquote class="' + cls + '">“' + esc(Ph.quoteStart) + ' <em class="it">' + esc(Ph.quoteAccent) + '</em>”</blockquote>';
  }

  /* ======================= DESIGN A · CINEMATIC ======================= */
  function heroA() {
    var P = S.person, H = S.hero || {}, hl = S.highlights || [];
    var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var bg = calm ? '' : backgroundEmbed(H.backgroundVideo);
    var video = (!calm && !bg && H.video)
      ? '<video class="hero-video" autoplay muted loop playsinline disablepictureinpicture preload="auto" aria-hidden="true"' +
        (H.image ? ' poster="' + esc(H.image) + '"' : '') + ' onplaying="this.classList.add(\'is-playing\')">' +
        (H.videoWebm ? '<source src="' + esc(H.videoWebm) + '" type="video/webm">' : '') +
        '<source src="' + esc(H.video) + '" type="video/mp4" onerror="this.parentNode.remove()"></video>' : '';
    if (bg) video = '<div class="hero-embed" aria-hidden="true"><iframe src="' + esc(bg) + '" title="" tabindex="-1" allow="autoplay; fullscreen" loading="eager"></iframe></div>';
    var lpos = ((location.search || '').match(/laurels=(top|bottom)/) || [])[1] || S.laurelsPosition || 'bottom';
    var laurelItems = hl.map(function (h) {
      if (h.award) return '<div class="laurel lx">' + WREATH + '<span class="lx-text"><span class="lx-event">' + esc(h.event) + '</span>' +
        '<span class="lx-award">' + esc(h.award) + '</span><span class="lx-film">' + esc(h.film || '') + '</span></span>' + WREATH.replace('class="wreath"', 'class="wreath r"') + '</div>';
      return '<p class="laurel"><span class="l-top">' + esc(h.top) + '</span><span class="l-main">' + esc(h.main) + '</span></p>';
    }).join('');
    return '<section class="hero' + (lpos === 'top' ? ' has-top-laurels' : '') + '" aria-label="Introduction">' +
      media(H.image, { cls: 'fill', note: 'Hero · 16:9', eager: true, focus: H.focus }) + video +
      '<div class="hero-shade"></div>' +
      (video && H.videoSound ? '<button type="button" class="hero-sound" aria-pressed="false" aria-label="Turn sound on">' +
        '<span class="hs-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="hs-label">Sound off</span></button>' : '') +
      '<div class="hero-inner wrap">' +
      (hl.length && lpos === 'top' ? '<div class="laurels laurels-top rise">' + laurelItems + '</div>' : '') +
      '<div class="hero-text">' +
      '<p class="eyebrow rise">' + (S.heroKicker ? esc(S.heroKicker) + '<span class="dot">·</span>' : '') + '<span class="ey-loc">' + esc(P.location) + '</span>' + '</p>' +
      '<h1 class="rise" style="margin-top:22px">' + esc(P.name) + '</h1>' +
      '<p class="mono role rise-2">' + esc(P.title) + '</p>' +
      '<p class="tagline rise-3">' + esc(P.tagline) + '</p>' +
      '<div class="hero-ctas rise-3">' +
      '<a class="btn" href="#work"><span class="ring">' + DOWN + '</span><span>Watch the films</span></a>' +
      (showreelReady() ? '<a class="btn" href="#showreel"><span class="ring">' + PLAY + '</span><span>Showreel</span></a>' : '') +
      '<a class="btn btn-quiet" href="#contact"><span>Work with me</span></a>' +
      '</div></div></div>' +
      (hl.length && lpos !== 'top' ? '<div class="laurels wrap rise-3">' + laurelItems + '</div>' : '') +
      '</section>';
  }

  /* small labels shown on the film image (modern style only) */
  function filmBadges(f) {
    var b = [];
    if ((f.awards || []).length) b.push('<span class="badge badge-award">★ Award</span>');
    if (embedUrl(f.link) || f.link) b.push('<span class="badge">▶ Full film</span>');
    else if (f.trailer) b.push('<span class="badge">▶ Teaser</span>');
    return b.length ? '<span class="fc-badges" aria-hidden="true">' + b.join('') + '</span>' : '';
  }
  function filmCardA(f, n, big) {
    var a = (f.awards || [])[0];
    var line = big ? f.synopsis : (f.cardLine || f.synopsis);
    return '<a class="card film-card' + (big ? ' lead' : '') + ' reveal" href="#/film/' + esc(f.id) + '" aria-label="' + esc(f.title) + ' — view film">' +
      '<div class="fc-media">' + media(f.image, { ratio: big ? '2.39 / 1' : '16 / 9', note: f.title + ' · key visual', alt: f.title, title: f.title, sub: f.year + ' · ' + f.kind }) +
      filmBadges(f) + '</div>' +
      '<div class="fc-info"><div class="fc-main">' +
      '<p class="meta">' + pad(n) + ' · ' + filmMeta(f) + '</p>' +
      '<h3 class="fc-title ttl">' + esc(f.title) + '</h3>' +
      (line ? '<p class="' + (big ? 'logline' : 'fc-line') + '">' + esc(line) + '</p>' : todo('Synopsis to come')) +
      '</div><div class="fc-side">' +
      (a ? '<div class="award"><p class="a-top">' + esc(a.detail) + '</p><p class="a-main">' + esc(a.title) + '</p></div>' : '<p class="meta-sm accent">' + esc(f.context) + '</p>') +
      '<p class="meta-sm">' + joinRoles(f.roles) + '</p>' + watchTag(f) +
      '<span class="meta view accent">View film →</span></div></div></a>';
  }

  function filmsA() {
    var feat = films().filter(function (f) { return f.featured; });
    var other = films().filter(function (f) { return !f.featured; });
    var n = 0;
    var out = '<section id="work" class="section wrap"><div class="section-head"><h2 class="section-title">Selected Films</h2>' +
      '<span class="meta">' + films().length + ' films · 2022 — 2026</span></div>';
    if (feat[0]) out += filmCardA(feat[0], ++n, true);
    if (feat.length > 1) out += '<div class="pair">' + feat.slice(1).map(function (f) { return filmCardA(f, ++n, false); }).join('') + '</div>';
    if (other.length) out += '<div class="other"><p class="meta" style="margin-bottom:18px">Also</p>' + other.map(function (f) {
      ++n;
      return '<a class="card other-row reveal" href="#/film/' + esc(f.id) + '">' +
        '<span class="or-thumb">' + media(f.image, { ratio: '16 / 9', note: f.title + ' · key visual', alt: f.title, title: f.title, sub: f.year }) + '</span>' +
        '<span class="or-text"><span class="meta">' + pad(n) + ' · ' + filmMeta(f) + '</span>' +
        '<span class="other-title ttl">' + esc(f.title) + '</span>' +
        '<span class="or-ctx">' + esc(f.context) + '</span>' + watchTag(f).replace(/<p /, '<span ').replace('</p>', '</span>') + '</span>' +
        '<span class="meta view accent">View film →</span></a>';
    }).join('') + '</div>';
    return out + '</section>';
  }

  function servicesA() {
    return '<section id="services" class="section wrap"><div class="section-head"><h2 class="section-title">What I do</h2>' +
      '<span class="meta">Direction · Camera · Post · Production</span></div>' +
      '<div class="services">' + servicesList('svc') + '</div>' + availableBlock() + '</section>';
  }

  /* ======================= PARTNERS ======================= */
  function partners() { return S.partners || []; }
  function partnerById(id) { return partners().filter(function (p) { return p.id === id; })[0]; }
  function partnerHasPage(p) { return !!(p.cover && ((p.gallery || []).length || (p.films || []).length)); }
  function partnersSection() {
    var list = partners();
    if (!list.length) return commissionsA();
    var withPage = list.filter(partnerHasPage), others = list.filter(function (p) { return !partnerHasPage(p); });
    var tabs = withPage.map(function (p, i) {
      return '<button type="button" role="tab" class="pt-tab" id="ptt-' + esc(p.id) + '" aria-controls="ptp-' + esc(p.id) + '" aria-selected="' + (i === 0) + '">' +
        '<span class="pt-tab-n">' + pad(i + 1) + '</span>' + esc(p.name) + '</button>';
    }).join('');
    var panels = withPage.map(function (p, i) {
      var n = (p.gallery || []).length, nf = (p.films || []).length;
      var nv = (p.videos || []).length;
      var count = [nf ? nf + (nf > 1 ? ' films' : ' film') : '', nv ? nv + (nv > 1 ? ' videos' : ' video') : '', n ? n + ' images' : ''].filter(Boolean).join(' · ');
      var thumbs = (p.gallery || []).slice(0, 4).map(function (src, j) {
        return '<button type="button" class="pt-thumb" data-p="' + i + '" data-i="' + j + '" aria-label="Enlarge image ' + (j + 1) + '">' +
          media(src, { ratio: '1 / 1', alt: (p.name) + ' — image ' + (j + 1) }) + '</button>';
      }).join('');
      return '<div class="pt-panel" role="tabpanel" id="ptp-' + esc(p.id) + '" aria-labelledby="ptt-' + esc(p.id) + '"' + (i ? ' hidden' : '') + '>' +
        '<a class="pt-cover" href="#/partner/' + esc(p.id) + '" aria-label="Open ' + esc(p.full || p.name) + '">' +
        media(p.cover, { ratio: '16 / 10', focus: p.coverFocus, alt: p.full || p.name }) +
        '<span class="pt-count">' + count + '</span></a>' +
        '<div class="pt-info"><p class="meta">' + esc(p.years) + '<span class="dot">·</span>' + joinRoles(p.roles) + '</p>' +
        '<h3 class="pt-name">' + esc(p.full || p.name) + '</h3>' +
        (p.intro ? '<p class="pt-intro">' + esc(p.intro) + '</p>' : '') +
        (thumbs ? '<div class="pt-thumbs">' + thumbs + '</div>' : '') +
        '<a class="btn pt-go" href="#/partner/' + esc(p.id) + '"><span>View the work</span><span class="pt-arrow">→</span></a></div></div>';
    }).join('');
    return '<section id="partners" class="section partners-band"><div class="wrap">' +
      '<div class="section-head"><h2 class="section-title">Partners</h2><span class="meta">Institutions · NGOs · Travel</span></div>' +
      '<p class="section-intro reveal">Organisations I have filmed and photographed for.</p>' +
      '<div class="pt-tabs" role="tablist" aria-label="Partners">' + tabs + '</div>' +
      '<div class="pt-panels reveal">' + panels + '</div>' +
      (others.length ? '<p class="pt-also"><span class="meta">Also with</span>' + others.map(function (p) { return '<span>' + esc(p.full || p.name) + '</span>'; }).join('<span class="dot">·</span>') + '</p>' : '') +
      '<div class="xp-wrap reveal"><p class="eyebrow">Experience</p>' + experienceRows() + '</div></div></section>';
  }

  function bindPartners() {
    var sec = main.querySelector('#partners');
    if (!sec) return;
    var withPage = partners().filter(partnerHasPage);
    var tabs = sec.querySelectorAll('.pt-tab'), panels = sec.querySelectorAll('.pt-panel');
    Array.prototype.forEach.call(tabs, function (t, i) {
      t.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (x, j) { x.setAttribute('aria-selected', String(i === j)); });
        Array.prototype.forEach.call(panels, function (p, j) { p.hidden = i !== j; if (i === j) { p.classList.remove('pt-in'); void p.offsetWidth; p.classList.add('pt-in'); } });
        if (t.scrollIntoView && t.parentNode.scrollWidth > t.parentNode.clientWidth) t.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
      });
    });
    sec.addEventListener('click', function (e) {
      var b = e.target.closest('.pt-thumb');
      if (!b || !b.querySelector('img')) return;
      var p = withPage[+b.getAttribute('data-p')];
      var items = (p.gallery || []).map(function (src) { return { src: src, place: p.full || p.name, caption: '' }; });
      openViewer(items, +b.getAttribute('data-i'), b);
    });
  }

  function renderPartner(p) {
    var list = partners().filter(partnerHasPage), idx = list.indexOf(p), next = list[(idx + 1) % list.length];
    var fl = (p.films || []).map(filmById).filter(Boolean);
    var gal = (p.gallery || []);
    main.innerHTML = '<article class="film-page partner-page fade-page" aria-label="' + esc(p.full || p.name) + '">' +
      '<div class="wrap"><a class="navlink back" href="#partners">← All partners</a></div>' +
      '<div class="wrap film-hero">' + media(p.cover, { ratio: '2.39 / 1', eager: true, focus: p.coverFocus, alt: p.full || p.name }) + '</div>' +
      '<div class="wrap film-head"><p class="meta">' + esc(p.years) + '<span class="dot">·</span>' + joinRoles(p.roles) + '</p>' +
      '<h1 class="film-title' + ((p.full || p.name).length > 30 ? ' long' : '') + '">' + esc(p.full || p.name) + '</h1>' +
      (p.intro ? '<p class="film-syn">' + esc(p.intro) + '</p>' : '') + '</div>' +
      ((p.videos || []).length ? '<section class="wrap stills" aria-label="Videos"><div class="stills-head"><span class="meta">Videos</span><span class="meta">' + p.videos.length + '</span></div>' +
        '<div class="pv-grid">' + p.videos.map(function (v) {
          return '<figure class="pv-item' + (v.type ? ' pv-' + esc(v.type) : '') + '"><div class="pv-frame"><iframe src="' + esc(v.embed) + '" title="' + esc(v.title || p.name) + '" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen scrolling="no"></iframe></div>' +
            '<figcaption><span class="st-cap">' + esc(v.title || '') + '</span>' + (v.link ? '<a class="st-place" href="' + esc(v.link) + '" target="_blank" rel="noopener">' + esc(v.linkLabel || 'Watch on Instagram') + ' ↗</a>' : '') + '</figcaption></figure>';
        }).join('') + '</div></section>' : '') +
      (fl.length ? '<section class="wrap stills" aria-label="Films"><div class="stills-head"><span class="meta">Films</span><span class="meta">' + fl.length + '</span></div>' +
        '<div class="other">' + fl.map(function (f) {
          return '<a class="card other-row" href="#/film/' + esc(f.id) + '">' +
            '<span class="or-thumb">' + media(f.image, { ratio: '16 / 9', alt: f.title, title: f.title, focus: f.imageFocus }) + '</span>' +
            '<span class="or-text"><span class="meta">' + filmMeta(f) + '</span><span class="other-title ttl">' + esc(f.title) + '</span>' +
            (f.cardLine ? '<span class="or-ctx">' + esc(f.cardLine) + '</span>' : '') + watchTag(f).replace(/<p /, '<span ').replace('</p>', '</span>') + '</span>' +
            '<span class="meta view accent">View film →</span></a>';
        }).join('') + '</div></section>' : '') +
      (gal.length ? '<section class="wrap stills" aria-label="Images"><div class="stills-head"><span class="meta">Images</span><span class="meta">' + esc(p.name) + '</span></div>' +
        '<div class="ph-grid">' + gal.map(function (src, i) {
          var k = PH_PATTERN[i % PH_PATTERN.length];
          return '<figure class="ph-item ph-' + k + '"><button type="button" class="ph-open pg-open" data-i="' + i + '" aria-label="Enlarge image ' + (i + 1) + '">' +
            media(src, { ratio: 'auto', alt: (p.name) + ' — image ' + (i + 1) }) + '</button></figure>';
        }).join('') + '</div></section>' : '') +
      (next && next !== p ? '<nav class="wrap next" aria-label="Next partner"><a href="#/partner/' + esc(next.id) + '"><span class="meta">Next partner</span><p class="ttl">' + esc(next.full || next.name) + ' →</p></a></nav>' : '') +
      '</article>';
    document.title = (p.full || p.name) + ' — ' + S.person.name;
    var items = gal.map(function (src) { return { src: src, place: p.full || p.name, caption: '' }; });
    Array.prototype.forEach.call(main.querySelectorAll('.pg-open'), function (b) {
      b.addEventListener('click', function () { if (b.querySelector('img')) openViewer(items, +b.getAttribute('data-i'), b); });
    });
  }

  function commissionsA() {
    return '<section id="commissions" class="section wrap"><div class="section-head"><h2 class="section-title">Commissioned Work</h2>' +
      '<span class="meta">Institutions · NGOs · Travel</span></div>' +
      '<p class="section-intro reveal">Films and images made for international institutions, NGOs and travel companies in Burundi and the region.</p>' +
      commissionedImages('comm-grid') + experienceRows() + '</section>';
  }

  function fieldA() {
    var F = S.field || {}, J = F.journeys || [];
    return '<section id="field" class="section field-a"><div class="wrap">' +
      '<div class="section-head"><h2 class="section-title">' + esc(F.heading) + '</h2><span class="meta">' + esc(F.subheading) + '</span></div>' +
      '<div class="field-top"><p class="section-intro reveal">' + esc(F.intro) + '</p>' +
      '<div class="strip-ctrl"><button class="iconbtn" type="button" data-strip="-1" aria-label="Previous images"><span class="flip">' + RIGHT + '</span></button>' +
      '<button class="iconbtn" type="button" data-strip="1" aria-label="Next images">' + RIGHT + '</button></div></div></div>' +
      '<div class="strip" tabindex="0" role="region" aria-label="Field photographs — scroll sideways">' +
      J.map(function (j) {
        return '<figure class="jcard">' + media(j.image, { ratio: '4 / 5', focus: j.focus, note: 'Field · 4:5', alt: j.caption }) +
          '<figcaption><span class="j-place">' + esc(j.place) + '</span><span class="j-cap">' + esc(j.caption) + '</span></figcaption></figure>';
      }).join('') + '</div></section>';
  }

  function philosophyA() {
    var Ph = S.philosophy || {};
    return '<section id="philosophy" class="philosophy"><div class="wrap philosophy-inner">' +
      '<p class="eyebrow" style="margin-bottom:40px">Philosophy</p>' + quoteHTML('quote reveal') +
      '<div class="statement">' + (Ph.paragraphs || []).map(function (p) { return '<p class="reveal">' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<p class="signature">— ' + esc(S.person.name) + '</p></div>' +
      (Ph.image ? media(Ph.image, { ratio: '3.2 / 1', note: 'Wide still · 3.2:1', focus: Ph.imageFocus }) : '') + '</section>';
  }

  function aboutA() {
    var A = S.about || {};
    return '<section id="about" class="section wrap" style="padding-top:140px">' +
      '<div class="about-grid">' +
      '<div class="portrait">' + media(A.portrait, { ratio: '4 / 5', note: 'Portrait · 4:5', alt: 'Portrait of ' + S.person.name }) + '</div>' +
      '<div class="about-main reveal"><p class="eyebrow" style="margin-bottom:28px">About</p>' + aboutText() + '</div></div>' +
      '<div style="margin-top:110px">' + recognitionBlock() + '</div></section>';
  }

  function renderHomeA() {
    return heroA() + filmsA() + showreelSection() + servicesA() + testimonialsSection() + partnersSection() + photographySection() + fieldA() + philosophyA() + aboutA();
  }

  /* ======================= TESTIMONIALS ======================= */
  /* Words from people Franco has worked with. Only real, approved quotes go in content.js.
     Empty list → the section is hidden on the public site (draft mode shows the layout). */
  function testimonialsSection() {
    var T = S.testimonials || {}, items = (T.items || []).filter(function (t) { return t.quote; });
    if (!items.length && !DRAFT) return '';
    var slots = !items.length;
    // draft only: invented examples to judge the layout (never rendered on the public site)
    if (slots && (T.examples || []).length) items = T.examples.map(function (t) { var c = {}; for (var k in t) c[k] = t[k]; c.example = true; return c; });
    else if (slots) items = [1, 2, 3].map(function (n) { return { slot: n }; });
    function card(t, i) {
      if (t.slot) {
        return '<figure class="tcard is-slot reveal"><div class="t-mark" aria-hidden="true">“</div>' +
          '<div class="t-lines" aria-hidden="true"><span></span><span></span><span></span><span class="short"></span></div>' +
          '<p class="t-slot-note">Testimonial ' + pad(t.slot) + ' — their words, in their own voice</p>' +
          '<figcaption class="t-who"><span class="t-photo is-empty" aria-hidden="true"></span>' +
          '<span class="t-id"><span class="t-name">Name</span><span class="t-role">Role · Organisation</span></span></figcaption></figure>';
      }
      var photo = t.photo
        ? '<span class="t-photo"><img src="' + esc(t.photo) + '" alt="' + esc(t.name) + '" loading="lazy" style="object-position:' + esc(t.photoFocus || '50% 30%') + '" onerror="this.parentNode.classList.add(\'is-empty\');this.remove()"></span>'
        : '<span class="t-photo is-empty" aria-hidden="true">' + esc((t.name || '?').charAt(0)) + '</span>';
      var role = [t.role, t.organization].filter(Boolean).map(esc).join(' · ');
      return '<figure class="tcard reveal' + (i === 0 && items.length !== 2 ? ' is-lead' : '') + (t.example ? ' is-example' : '') + '">' +
        (t.example ? '<span class="t-example">Example — replace</span>' : '') + '<div class="t-mark" aria-hidden="true">“</div>' +
        '<blockquote class="t-quote">' + esc(t.quote) + '</blockquote>' +
        '<figcaption class="t-who">' + photo + '<span class="t-id"><span class="t-name">' + esc(t.name) + '</span>' +
        (role ? '<span class="t-role">' + role + '</span>' : '') +
        (t.project ? '<span class="t-proj">' + esc(t.project) + '</span>' : '') + '</span></figcaption></figure>';
    }
    return '<section id="testimonials" class="section wrap testimonials' + (slots ? ' is-draft' : '') + '"><div class="section-head"><h2 class="section-title">' + esc(T.heading || 'Kind words') + '</h2>' +
      '<span class="meta">' + esc(T.subheading || 'From the people I have worked with') + '</span></div>' +
      (slots ? '<p class="draft-flag">Draft — invented examples to show the layout. Hidden on the public site until real testimonials are added.</p>' : '') +
      // columns under the large first quote: 3 when they fill the row exactly, else 2
      '<div class="tgrid n' + (items.length < 3 ? items.length : ((items.length - 1) % 3 === 0 ? 3 : 2)) + '">' + items.map(card).join('') + '</div></section>';
  }

  /* ======================= PHOTOGRAPHY ======================= */
  function photoSeries() { return ((S.photography || {}).series || []); }
  // a series appears on the public site once it has at least 3 photos
  function seriesReady(s) { return (s.images || []).filter(function (i) { return i.src; }).length >= 2; }
  function photosReady() { return photoSeries().some(seriesReady); }
  // grid rhythm: one large frame, then smaller and wide frames, repeating
  var PH_PATTERN = ['big', 'n', 'n', 'n', 'wide', 'wide', 'n', 'n', 'n', 'n'];
  function photographySection() {
    var P = S.photography || {}, series = photoSeries();
    if (!photosReady() && !DRAFT) return '';
    var shown = series.filter(function (s) { return DRAFT || seriesReady(s); });
    if (!shown.length) return '';
    // open on the first series that already has photos
    var first = 0;
    shown.some(function (s, i) { if ((s.images || []).some(function (x) { return x.src; })) { first = i; return true; } return false; });
    var tabs = shown.length > 1
      ? '<div class="ph-tabs" role="tablist" aria-label="Photo series">' + shown.map(function (s, i) {
          return '<button type="button" role="tab" class="ph-tab" id="pht-' + esc(s.id) + '" aria-controls="php-' + esc(s.id) + '" aria-selected="' + (i === first) + '">' +
            '<span class="ph-tab-n">' + pad(i + 1) + '</span><span class="ph-tab-t">' + esc(s.title) + '</span></button>';
        }).join('') + '</div>'
      : '';
    tabs = shown.length > 1
      ? '<div class="ph-tabs st-tabs" role="tablist" aria-label="Countries">' + shown.map(function (s, i) {
          var c = (s.images || []).filter(function (x) { return x.src; }).length;
          return '<button type="button" role="tab" class="ph-tab st-tab" id="pht-' + esc(s.id) + '" aria-controls="php-' + esc(s.id) + '" aria-selected="' + (i === first) + '">' +
            '<span class="st-name">' + esc(s.title) + '</span><sup class="st-n">' + pad(c) + '</sup></button>';
        }).join('') + '</div>'
      : '';
    var panels = shown.map(function (s, si) {
      var imgs = (s.images || []).filter(function (i) { return i.src; });
      return '<div class="ph-panel st-panel" role="' + (tabs ? 'tabpanel' : 'region') + '" id="php-' + esc(s.id) + '"' + (tabs ? ' aria-labelledby="pht-' + esc(s.id) + '"' : ' aria-label="' + esc(s.title) + '"') + (si !== first ? ' hidden' : '') + '>' +
        '<div class="st-strip" tabindex="0" aria-label="' + esc(s.title) + ' photographs, scroll sideways">' + imgs.map(function (im, i) {
          return '<figure class="st-item' + (im.portrait ? ' st-p' : '') + '"><button type="button" class="ph-open" data-series="' + si + '" data-i="' + i + '" aria-label="Enlarge — ' + esc(im.caption || s.title) + '">' +
            media(im.src, { ratio: 'auto', focus: im.focus, alt: im.caption || s.title }) + '</button>' +
            '<figcaption><span class="st-i">' + pad(i + 1) + '</span><span class="st-cap">' + esc(im.caption || '') + '</span><span class="st-place">' + esc(im.place || '') + '</span></figcaption></figure>';
        }).join('') + '<span class="st-end" aria-hidden="true"></span></div>' +
        '<div class="wrap st-ctrl"><span class="st-count"><b>01</b> / ' + pad(imgs.length) + '</span>' +
        '<span class="st-bar"><i></i></span>' +
        '<span class="st-btns"><button type="button" class="st-prev" aria-label="Previous photograph">←</button><button type="button" class="st-next" aria-label="Next photograph">→</button></span></div></div>';
    }).join('');
    return '<section id="photography" class="section photography stills-v2"><div class="wrap">' +
      '<div class="section-head"><h2 class="section-title">' + esc(P.heading || 'Photography') + '</h2><span class="meta">' + esc(P.subheading || '') + '</span></div>' +
      (P.intro ? '<p class="section-intro reveal">' + esc(P.intro) + '</p>' : '') + tabs + '</div>' + panels + '</section>';
  }

  function bindHeroSound() {
    var b = main.querySelector('.hero-sound'), v = main.querySelector('.hero-video');
    if (!b || !v) return;
    var on = false, visible = true;
    function apply() {
      var audible = on && visible;
      v.muted = !audible;
      if (audible && v.paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      b.classList.toggle('is-on', on);
      b.querySelector('.hs-label').textContent = on ? 'Sound on' : 'Sound off';
    }
    b.addEventListener('click', function () { on = !on; apply(); });
    // mute automatically when the hero scrolls out of view, resume when it comes back
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; apply(); }, { threshold: 0.25 }).observe(main.querySelector('.hero'));
    }
  }

  function bindStills() {
    var sec = main.querySelector('#photography.stills-v2');
    if (!sec) return;
    Array.prototype.forEach.call(sec.querySelectorAll('.st-panel'), function (pn) {
      var strip = pn.querySelector('.st-strip'), items = strip.querySelectorAll('.st-item');
      var count = pn.querySelector('.st-count b'), bar = pn.querySelector('.st-bar i');
      function cur() {
        var best = 0, bd = 1e9, left = strip.getBoundingClientRect().left + parseFloat(getComputedStyle(strip).paddingLeft || 0);
        Array.prototype.forEach.call(items, function (it, i) { var d = Math.abs(it.getBoundingClientRect().left - left); if (d < bd) { bd = d; best = i; } });
        return best;
      }
      function update() {
        var i = cur(); if (count) count.textContent = pad(i + 1);
        var max = strip.scrollWidth - strip.clientWidth;
        if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? Math.max(0.08, strip.scrollLeft / max) : 1) + ')';
      }
      function go(d) {
        var i = Math.min(items.length - 1, Math.max(0, cur() + d)), it = items[i];
        strip.scrollTo({ left: strip.scrollLeft + it.getBoundingClientRect().left - strip.getBoundingClientRect().left - parseFloat(getComputedStyle(strip).paddingLeft || 0), behavior: 'smooth' });
      }
      strip.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
      pn.querySelector('.st-prev').addEventListener('click', function () { go(-1); });
      pn.querySelector('.st-next').addEventListener('click', function () { go(1); });
      update();
    });
    Array.prototype.forEach.call(sec.querySelectorAll('.st-tab'), function (t) {
      t.addEventListener('click', function () {
        var pn = sec.querySelector('#' + t.getAttribute('aria-controls'));
        if (pn) { pn.classList.remove('st-in'); void pn.offsetWidth; pn.classList.add('st-in'); var st = pn.querySelector('.st-strip'); st.scrollLeft = 0; st.dispatchEvent(new Event('scroll')); }
      });
    });
  }

  /* tabs + full-screen viewer for the photography section */
  function bindPhotos() {
    var sec = main.querySelector('#photography');
    if (!sec) return;
    var tabs = sec.querySelectorAll('.ph-tab'), panels = sec.querySelectorAll('.ph-panel');
    Array.prototype.forEach.call(tabs, function (t, i) {
      t.addEventListener('click', function () {
        Array.prototype.forEach.call(tabs, function (x, j) { x.setAttribute('aria-selected', String(i === j)); });
        Array.prototype.forEach.call(panels, function (p, j) { p.hidden = i !== j; });
      });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
      });
    });
    var shown = photoSeries().filter(function (s) { return DRAFT || seriesReady(s); });
    sec.addEventListener('click', function (e) {
      var b = e.target.closest('.ph-open');
      if (!b || !b.querySelector('img')) return;
      var list = (shown[+b.getAttribute('data-series')].images || []).filter(function (i) { return i.src; });
      openViewer(list, +b.getAttribute('data-i'), b);
    });
  }
  function openViewer(list, i, opener) {
    var v = document.createElement('div');
    v.className = 'viewer'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true'); v.setAttribute('aria-label', 'Photograph');
    v.innerHTML = '<button class="v-close" type="button" aria-label="Close">×</button>' +
      '<button class="v-nav v-prev" type="button" aria-label="Previous photo"><span class="flip">' + RIGHT + '</span></button>' +
      '<figure class="v-fig"><img alt=""><figcaption><span class="j-place"></span><span class="j-cap"></span><span class="v-count meta"></span></figcaption></figure>' +
      '<button class="v-nav v-next" type="button" aria-label="Next photo">' + RIGHT + '</button>';
    document.body.appendChild(v);
    document.body.classList.add('viewer-open');
    var img = v.querySelector('img');
    function show(n) {
      i = (n + list.length) % list.length;
      var it = list[i];
      img.src = it.src; img.alt = it.caption || '';
      v.querySelector('.j-place').textContent = it.place || '';
      v.querySelector('.j-cap').textContent = it.caption || '';
      v.querySelector('.v-count').textContent = pad(i + 1) + ' / ' + pad(list.length);
    }
    function close() { document.removeEventListener('keydown', key); v.remove(); document.body.classList.remove('viewer-open'); if (opener) opener.focus(); }
    function key(e) { if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(i + 1); else if (e.key === 'ArrowLeft') show(i - 1); }
    v.querySelector('.v-close').addEventListener('click', close);
    v.querySelector('.v-prev').addEventListener('click', function () { show(i - 1); });
    v.querySelector('.v-next').addEventListener('click', function () { show(i + 1); });
    v.addEventListener('click', function (e) { if (e.target === v) close(); });
    var sx = null;
    v.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    v.addEventListener('touchend', function (e) { if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); sx = null; });
    document.addEventListener('keydown', key);
    if (list.length < 2) Array.prototype.forEach.call(v.querySelectorAll('.v-nav'), function (b) { b.hidden = true; });
    show(i);
    v.querySelector('.v-close').focus();
  }

  /* ======================= DESIGN B · INDEX ======================= */
  function heroB() {
    var P = S.person, H = S.hero || {}, hl = S.highlights || [];
    return '<section class="hero-b wrap" aria-label="Introduction">' +
      '<div class="hb-text">' +
      '<p class="eyebrow rise">' + esc(P.location) + '</p>' +
      '<h1 class="hb-name rise">' + esc(P.name) + '</h1>' +
      '<p class="mono hb-role rise-2">' + esc(P.title) + '</p>' +
      '<p class="hb-tag rise-3">' + esc(P.tagline) + '</p>' +
      '<div class="hero-ctas rise-3">' +
      '<a class="btn" href="#work"><span class="ring">' + DOWN + '</span><span>See the films</span></a>' +
      '<a class="btn btn-quiet" href="#contact"><span>Work with me</span></a></div>' +
      (hl.length ? '<ul class="hb-laurels rise-3">' + hl.map(function (h) {
        return '<li><span class="l-main">' + esc(h.main) + '</span><span class="l-top">' + esc(h.top) + '</span></li>';
      }).join('') + '</ul>' : '') +
      '</div><div class="hb-image rise">' + media(H.image, { ratio: '4 / 5', note: 'Hero · 4:5', eager: true, focus: H.focusPortrait || '48% 55%' }) + '</div>' +
      '</section>';
  }

  function filmsB() {
    var list = films();
    return '<section id="work" class="section wrap"><div class="section-head"><h2 class="section-title">Films</h2>' +
      '<span class="meta">' + list.length + ' films · 2022 — 2026</span></div><ol class="findex">' +
      list.map(function (f, i) {
        var a = (f.awards || [])[0];
        return '<li class="reveal"><a class="frow" href="#/film/' + esc(f.id) + '" aria-label="' + esc(f.title) + ' — view film">' +
          '<span class="fr-num">' + pad(i + 1) + '</span>' +
          '<span class="fr-main"><span class="fr-title">' + esc(f.title) + '</span>' +
          '<span class="fr-sub">' + esc(f.kind) + ' · ' + esc(f.runtime) + ' · ' + joinRoles(f.roles) + '</span>' +
          (a ? '<span class="fr-award">' + esc(a.title) + ' — ' + esc(a.detail) + '</span>' : '<span class="fr-ctx">' + esc(f.context) + '</span>') +
          '</span><span class="fr-year">' + esc(f.year) + '</span>' +
          '<span class="fr-thumb">' + media(f.image, { ratio: '16 / 10', note: f.title, alt: f.title, title: f.title, sub: f.year }) + '</span>' +
          '</a></li>';
      }).join('') + '</ol></section>';
  }

  function servicesB() {
    return '<section id="services" class="section wrap"><div class="section-head"><h2 class="section-title">What I do</h2>' +
      '<span class="meta">Services</span></div><div class="svc-list">' + servicesList('svc-b') + '</div>' + availableBlock() + '</section>';
  }

  function mosaicB() {
    var F = S.field || {}, J = F.journeys || [], C = S.commissionedGallery || [];
    var tiles = [];
    J.forEach(function (j, i) { tiles.push({ image: j.image, place: j.place, caption: j.caption, focus: j.focus }); });
    C.forEach(function (c) { tiles.push({ image: c.image, place: 'Commissioned', caption: c.caption, focus: c.focus }); });
    // rows of 6 columns: w+t | t+w | s+s+s | t+t+t — every row is full and the same height
    var pattern = ['w', 't', 't', 'w', 's', 's', 's', 't', 't', 't'];
    return '<section id="field" class="section wrap"><div class="section-head"><h2 class="section-title">Field &amp; Commissions</h2>' +
      '<span class="meta">' + esc(F.subheading) + '</span></div>' +
      '<p class="section-intro reveal">' + esc(F.intro) + '</p>' +
      '<div class="mosaic">' + tiles.map(function (t, i, all) {
        var k = pattern[i % pattern.length], ratio = k === 'w' ? '16 / 10' : (k === 't' ? '4 / 5' : '1 / 1');
        var style = '';
        if (i === all.length - 1) {
          // last image: stretch it to the end of its row so the mosaic never ends with a gap
          var used = 0;
          for (var x = 0; x < all.length; x++) used += pattern[x % pattern.length] === 'w' ? 4 : 2;
          var left = (6 - used % 6) % 6;
          if (left) { var span = (k === 'w' ? 4 : 2) + left; style = ' style="grid-column: span ' + span + '"'; ratio = span === 6 ? '21 / 9' : '16 / 10'; }
        }
        return '<figure class="m-item m-' + k + ' reveal"' + style + '>' + media(t.image, { ratio: ratio, focus: t.focus, note: 'Mosaic', alt: t.caption }) +
          '<figcaption><span class="j-place">' + esc(t.place) + '</span><span class="j-cap">' + esc(t.caption) + '</span></figcaption></figure>';
      }).join('') + '</div>' +
      '<div class="clients reveal"><p class="eyebrow">Experience</p>' + experienceRows() + '</div></section>';
  }

  function aboutB() {
    var Ph = S.philosophy || {};
    return '<section id="about" class="section wrap about-b">' +
      '<div class="ab-grid"><div class="ab-quote reveal"><p class="eyebrow">Philosophy</p>' + quoteHTML('quote-b') +
      '<div class="ab-statement">' + (Ph.paragraphs || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
      '<div class="ab-text reveal"><p class="eyebrow">About</p>' + aboutText() + '</div></div>' +
      '<div style="margin-top:100px">' + recognitionBlock() + '</div></section>' +
      '<div class="band">' + media(Ph.image, { ratio: '3.2 / 1', note: 'Wide still · 3.2:1', focus: Ph.imageFocus }) + '</div>';
  }

  function renderHomeB() {
    return heroB() + filmsB() + showreelSection() + servicesB() + testimonialsSection() + photographySection() + mosaicB() + aboutB();
  }

  function renderHome() {
    main.innerHTML = '<div class="fade-page" id="top">' + (LAYOUT === 'index' ? renderHomeB() : renderHomeA()) + '</div>';
    document.title = SET.siteTitle || S.person.name;
    bindStrip();
    bindPlayers(main);
    bindPhotos();
    bindHeroSound();
    bindStills();
    bindPartners();
  }

  function bindStrip() {
    var strip = main.querySelector('.strip');
    if (!strip) return;
    Array.prototype.forEach.call(main.querySelectorAll('[data-strip]'), function (b) {
      b.addEventListener('click', function () {
        var card = strip.querySelector('.jcard');
        var step = card ? card.getBoundingClientRect().width + 20 : 400;
        strip.scrollBy({ left: step * 2 * (+b.getAttribute('data-strip')), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
    });
  }

  /* ======================= FILM PAGE ======================= */
  function renderFilm(f) {
    var list = films(), idx = list.indexOf(f), next = list[(idx + 1) % list.length];
    var awards = f.awards || [];
    var filmEmbed = embedUrl(f.link), teaserEmbed = filmEmbed ? '' : embedUrl(f.trailer);
    var playable = filmEmbed || teaserEmbed;
    var playerLabel = filmEmbed ? 'Watch the film' : 'Official teaser';
    var actions = [];
    if (filmEmbed) actions.push('<button class="btn" type="button" data-scrollto="watch"><span class="ring">' + PLAY + '</span><span>Watch the film</span></button>');
    else if (f.link) actions.push('<a class="btn" href="' + esc(f.link) + '" target="_blank" rel="noopener"><span class="ring">' + PLAY + '</span><span>Watch the film' + (/facebook\.com|fb\.watch/.test(f.link) ? ' on Facebook' : '') + '</span></a>');
    if (teaserEmbed) actions.push('<button class="btn" type="button" data-scrollto="watch"><span class="ring">' + PLAY + '</span><span>Watch the teaser</span></button>');
    else if (f.trailer && !filmEmbed) actions.push('<a class="btn" href="' + esc(f.trailer) + '" target="_blank" rel="noopener"><span class="ring">' + ARROW + '</span><span>Teaser</span></a>');
    if (!actions.length && DEV) actions.push('<span class="note-missing">[Film link — add "link" for this film in content.js]</span>');
    var watch = actions.join(''), trailer = '';
    var playerBlock = playable
      ? '<section class="wrap film-player" id="watch" aria-label="' + playerLabel + ' — ' + esc(f.title) + '"><div class="stills-head"><span class="meta">' + playerLabel + '</span><span class="meta">' + esc(f.title) + '</span></div>' +
        playerHTML(filmEmbed ? f.link : f.trailer, { title: f.title + ' — ' + playerLabel, label: filmEmbed ? 'Play the film' : 'Play the teaser', poster: f.posterFrame || f.image, focus: f.imageFocus, ratio: f.videoRatio }) +
        '<p class="player-alt"><a href="' + esc(filmEmbed ? f.link : f.trailer) + '" target="_blank" rel="noopener">' +
        'Watch on ' + (/youtu/.test(filmEmbed ? f.link : f.trailer) ? 'YouTube' : 'Vimeo') + ' <span aria-hidden="true">↗</span></a></p></section>'
      : '';
    var syn = f.synopsis
      ? '<p class="film-syn' + (f.synopsis.length > 260 ? ' plain' : '') + '">' + esc(f.synopsis) + '</p>'
      : (DEV ? '<p class="film-syn">' + todo('Synopsis to come — add "synopsis" in content.js') + '</p>' : '');

    main.innerHTML = '<article class="film-page fade-page" aria-label="' + esc(f.title) + '">' +
      '<div class="wrap"><a class="navlink back" href="#work">← All films</a></div>' +
      '<div class="wrap film-hero">' + media(f.image, { ratio: '2.39 / 1', note: f.title + ' · main image · 2.39:1', eager: true, alt: f.title, focus: f.imageFocus, title: f.title, sub: filmMeta(f).replace(/&amp;/g, '&') }) + '</div>' +
      '<div class="wrap film-head"><p class="meta">' + filmMeta(f) + '</p>' +
      '<h1 class="film-title' + (f.title.length > 30 ? ' long' : '') + '">' + esc(f.title) + '</h1>' +
      '<div class="film-body"><div class="film-main">' +
      (f.synopsis || DEV ? '<p class="eyebrow">' + esc(f.synopsisLabel || 'About the film') + '</p>' : '') + syn +
      ((watch || trailer) ? '<div class="film-actions">' + watch + trailer + '</div>' : '') +
      '</div><aside class="film-aside">' +
      (awards.length ? '<div class="award"><p class="a-top">' + esc(awards[0].detail) + '</p><p class="a-main" style="font-size:1.8rem">' + esc(awards[0].title) + '</p>' +
        awards.slice(1).map(function (x) { return '<p class="award-sub" style="margin-top:12px">' + esc(x.title) + ' — ' + esc(x.detail) + '</p>'; }).join('') + '</div>' : '') +
      '<div class="panel"><p class="meta-sm">Credits</p>' + (f.roles || []).map(function (r) {
        return '<div class="credit"><span>' + esc(r) + '</span><span>' + esc(S.person.name) + '</span></div>';
      }).join('') + '</div>' +
      (f.context ? '<div class="panel"><p class="meta-sm">Context</p><p>' + esc(f.context) + '</p></div>' : '') +
      '</aside></div></div>' + playerBlock +
      '<section class="wrap stills" aria-label="Stills"><div class="stills-head"><span class="meta">Stills</span><span class="meta">' + esc(f.title) + '</span></div>' +
      gallery(f.stills, { ratio: '16 / 9', note: f.title + ' · film still · 16:9', alt: f.title, empty: 3 }) +
      (f.behindTheScenes ? '<div class="bts">' + media(f.behindTheScenes, { ratio: '21 / 9', note: 'Behind the scenes · 21:9', alt: 'Behind the scenes — ' + f.title }) + '</div>' : '') +
      '</section>' +
      (next && next !== f ? '<nav class="wrap next" aria-label="Next film"><a href="#/film/' + esc(next.id) + '"><span class="meta">Next film</span><p class="ttl">' + esc(next.title) + ' →</p></a></nav>' : '') +
      '</article>';
    document.title = f.title + ' — ' + S.person.name;
    bindPlayers(main);
    var go = main.querySelector('[data-scrollto]');
    if (go) go.addEventListener('click', function () {
      var t = document.getElementById(go.getAttribute('data-scrollto'));
      if (t) t.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ======================= HEADER + FOOTER ======================= */
  function renderNav() {
    var D = S.documents || {};
    var items = LAYOUT === 'index'
      ? [['work', 'Films'], ['services', 'Services'], ['field', 'Field'], ['about', 'About'], ['contact', 'Contact']]
      : [['work', 'Films'], ['services', 'Services'], [partners().length ? 'partners' : 'commissions', partners().length ? 'Partners' : 'Commissions'], ['field', 'Field'], ['about', 'About'], ['contact', 'Contact']];
    if (showreelReady()) items.splice(1, 0, ['showreel', 'Showreel']);
    if (photosReady() || DRAFT) items.splice(items.length - 2, 0, ['photography', 'Photography']);
    var menu = document.getElementById('menu');
    menu.innerHTML = items.map(function (it) { return '<li><a class="navlink" href="#' + it[0] + '">' + it[1] + '</a></li>'; }).join('') +
      (D.cvFull ? '<li><a class="cv-pill" href="' + esc(D.cvFull) + '" target="_blank" rel="noopener">CV</a></li>' : '');
    var bn = document.querySelector('[data-bind="person.name"]'), br = document.querySelector('[data-bind="person.shortTitle"]');
    if (bn) bn.textContent = S.person.name;
    if (br) br.textContent = S.person.shortTitle || '';
    /* right side of the header (desktop): CV + call to action; the theme button joins it */
    var nav = document.querySelector('.nav');
    if (nav && !nav.querySelector('.nav-right')) {
      var r = document.createElement('div');
      r.className = 'nav-right';
      r.innerHTML = (D.cvFull ? '<a class="nav-cv" href="' + esc(D.cvFull) + '" target="_blank" rel="noopener">CV</a>' : '') +
        '<a class="nav-cta" href="#contact">' + esc((S.contact || {}).navCta || 'Work with me') + '</a>';
      nav.insertBefore(r, document.querySelector('.menu-btn'));
    }
  }

  /* header: fully transparent over the opening image, frosted glass once you scroll */
  function headerState() {
    var hero = main.querySelector('.hero');
    var y = window.scrollY || 0;
    document.body.classList.toggle('scrolled', y > 24);
    document.body.classList.toggle('over-hero', !!hero && y < hero.offsetHeight - 90);
  }
  window.addEventListener('scroll', headerState, { passive: true });
  window.addEventListener('hashchange', function () { setTimeout(headerState, 50); });

  /* Display style = interface (classic / modern / glass) + optional immersive layer (js/fx.js).
     Default from settings (ui + fx); visitors can switch in the footer; their choice is kept in their browser. */
  var STYLE_KEY = 'fm-style';
  function currentStyle() {
    var saved = null;
    if (SET.styleSwitch) { try { saved = localStorage.getItem(STYLE_KEY); } catch (e) {} }
    if (saved === 'immersive' || saved === 'glass' || saved === 'modern' || saved === 'classic') return saved;
    return SET.fx ? 'immersive' : (SET.ui || 'classic');
  }
  function applyStyle(name) {
    window.FM_setUI(name === 'immersive' ? 'glass' : name);
    var wantFx = name === 'immersive';
    if (window.FM_fx) window.FM_fx(wantFx);
    else if (wantFx && !document.getElementById('fx-js')) {
      window.FM_FX_AUTOSTART = true;
      var fxs = document.createElement('script'); fxs.id = 'fx-js'; fxs.src = 'js/fx.js?v=20261103c'; document.body.appendChild(fxs);
    }
    Array.prototype.forEach.call(document.querySelectorAll('.style-pick button'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-style') === name));
    });
  }
  window.FM_applyStyle = applyStyle;
  function bindStylePick() {
    Array.prototype.forEach.call(footer.querySelectorAll('.style-pick button'), function (b) {
      b.addEventListener('click', function () {
        var n = b.getAttribute('data-style');
        try { localStorage.setItem(STYLE_KEY, n); } catch (e) { /* choice lasts for this visit */ }
        applyStyle(n);
      });
    });
    var cur = currentStyle();
    Array.prototype.forEach.call(footer.querySelectorAll('.style-pick button'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-style') === cur)); });
  }

  function renderFooter() {
    var C = S.contact, P = S.person, D = S.documents || {};
    var cta = esc(C.cta);
    if (C.ctaAccentWord) cta = cta.replace(esc(C.ctaAccentWord), '<em class="it">' + esc(C.ctaAccentWord) + '</em>');
    var docs = [['cvFull', 'Download CV'], ['cvShort', 'One-page CV'], ['portfolio', 'Portfolio']]
      .filter(function (d) { return D[d[0]]; })
      .map(function (d, i) {
        return '<a class="' + (i === 0 ? 'doc-btn primary' : 'doc-btn') + '" href="' + esc(D[d[0]]) + '" target="_blank" rel="noopener">' + d[1] + ' <span aria-hidden="true">↓</span></a>';
      });
    footer.innerHTML = '<div class="wrap contact-inner">' +
      '<p class="eyebrow">Contact</p><h2 class="cta">' + cta + '</h2>' +
      '<p class="open-to">' + esc(C.openTo) + '</p>' +
      '<a class="mail" href="mailto:' + esc(C.email) + '">' + esc(C.email) + '</a>' +
      (docs.length ? '<div class="docs">' + docs.join('') + '</div>' : '') +
      '<div class="contact-grid">' +
      '<div><p class="meta">' + esc(P.name) + '</p><p>' + esc(P.title) + '</p></div>' +
      '<div><p class="meta">Based in</p><p>' + esc(P.location) + '</p></div>' +
      '<div><p class="meta">Phone / WhatsApp</p><a href="tel:' + esc(C.phone_link) + '">' + esc(C.phone) + '</a></div>' +
      '<div><p class="meta">Instagram</p><a href="' + esc(C.instagram_url) + '" target="_blank" rel="noopener">' + esc(C.instagram) + '</a></div>' +
      '</div><div class="colophon"><span>© ' + new Date().getFullYear() + ' ' + esc(P.name) + '</span>' +
      (SET.styleSwitch ? '<div class="style-pick" role="group" aria-label="Display style"><span class="sp-l">Display</span>' +
        [['immersive', 'Immersive'], ['glass', 'Glass'], ['modern', 'Modern'], ['classic', 'Classic']].map(function (o) {
          return '<button type="button" data-style="' + o[0] + '">' + o[1] + '</button>';
        }).join('') + '</div>' : '') +
      '<span>' + esc((S.footer || {}).production || '') + '</span></div></div>';
    bindStylePick();
  }

  /* ======================= ROUTER ======================= */
  var view = null;
  function route() {
    var h = location.hash || '';
    var m = h.match(/^#\/film\/([\w-]+)/);
    closeMenu();
    if (m) {
      var f = filmById(m[1]);
      if (f) { view = 'film:' + f.id; renderFilm(f); window.scrollTo(0, 0); observe(); return; }
    }
    var mp = h.match(/^#\/partner\/([\w-]+)/);
    if (mp) {
      var pt = partnerById(mp[1]);
      if (pt && partnerHasPage(pt)) { view = 'partner:' + pt.id; renderPartner(pt); window.scrollTo(0, 0); observe(); return; }
    }
    var fromFilm = view !== 'home';
    if (fromFilm) { view = 'home'; renderHome(); observe(); }
    var id = h.replace(/^#\/?/, '');
    if (id && id !== 'top') {
      var el = document.getElementById(id);
      if (el) el.scrollIntoView(fromFilm ? undefined : { behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    } else if (!fromFilm || h === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe() {
    Array.prototype.forEach.call(main.querySelectorAll('.reveal'), function (el) { io ? io.observe(el) : el.classList.add('in'); });
  }

  var btn = document.querySelector('.menu-btn'), menu = document.getElementById('menu');
  function closeMenu() { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Open menu'); }
  btn.addEventListener('click', function () {
    var open = !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  renderNav();
  if (SET.themeToggle !== false) {
    var SUN = '<svg class="i-sun" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><circle cx="9" cy="9" r="3.4"/><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.7 3.7l1.4 1.4M12.9 12.9l1.4 1.4M3.7 14.3l1.4-1.4M12.9 5.1l1.4-1.4"/></svg>';
    var MOON = '<svg class="i-moon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M14.5 11.2A6.2 6.2 0 0 1 6.8 3.5a6.2 6.2 0 1 0 7.7 7.7z"/></svg>';
    var tb = document.createElement('button');
    tb.type = 'button'; tb.className = 'theme-btn'; tb.innerHTML = SUN + MOON;
    var nav = document.querySelector('.nav'), mb = document.querySelector('.menu-btn');
    var nr = nav.querySelector('.nav-right');
    if (nr) nr.appendChild(tb); else nav.insertBefore(tb, mb);
    tb.addEventListener('click', function () { var t = THEME === 'light' ? 'dark' : 'light'; applyTheme(t); storeTheme(t); });
  }
  applyTheme(THEME);
  document.body.classList.add('hdr-v2');
  renderFooter();
  window.addEventListener('hashchange', route);
  route();
  headerState();
  applyStyle(currentStyle());
})();
