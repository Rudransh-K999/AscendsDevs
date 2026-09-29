/* =============================================================
   ASCENDDEVS — MOTION & INTERACTION ENGINE
   -------------------------------------------------------------
   Everything is namespaced inside one IIFE and split into small
   modules. Each module bails out safely if its markup isn't on
   the page, so you can delete sections from index.html without
   breaking anything here.
============================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var clamp = function (v, a, b) { return Math.min(Math.max(v, a), b); };
  var lerp  = function (a, b, n) { return a + (b - a) * n; };

  /* -----------------------------------------------------------
     SHARED POINTER + SCROLL STATE
     One rAF loop drives every continuous animation on the page.
  ----------------------------------------------------------- */
  var pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false };
  var scroll  = { y: window.scrollY, last: window.scrollY, velocity: 0 };
  var frameTasks = [];
  var onFrame = function (fn) { frameTasks.push(fn); };

  document.addEventListener('pointermove', function (e) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  }, { passive: true });
  document.addEventListener('pointerdown', function () { pointer.down = true; });
  document.addEventListener('pointerup',   function () { pointer.down = false; });

  (function loop() {
    scroll.y = window.scrollY;
    scroll.velocity = scroll.y - scroll.last;
    scroll.last = scroll.y;
    for (var i = 0; i < frameTasks.length; i++) frameTasks[i]();
    requestAnimationFrame(loop);
  })();

  /* -----------------------------------------------------------
     1. SMOOTH SCROLL
     A virtual scroller: the wheel no longer moves the page
     directly, it moves a target value that the page eases toward
     each frame. Native scrolling still owns touch devices, where
     the OS momentum already feels better than anything we'd fake.
  ----------------------------------------------------------- */
  var smooth = (function () {
    var coarse  = window.matchMedia('(pointer: coarse)').matches;
    var enabled = fine && !coarse && !reduce;

    var EASE = 0.105;   // 0 = never arrives, 1 = instant. Lower feels heavier.
    var WHEEL = 1.0;    // multiplier on raw wheel delta

    var current = window.scrollY;
    var target  = current;
    var written = current;   // last position we wrote ourselves
    var running = false;

    function limit() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }
    function set(y) { target = clamp(y, 0, limit()); running = true; }

    var api = {
      enabled: enabled,
      to: function (y) {
        if (!enabled) { window.scrollTo({ top: clamp(y, 0, limit()), behavior: reduce ? 'auto' : 'smooth' }); return; }
        set(y);
      },
      by: function (d) {
        if (!enabled) { window.scrollBy({ top: d, behavior: reduce ? 'auto' : 'smooth' }); return; }
        set(target + d);
      }
    };

    if (!enabled) return api;

    // Our own easing replaces the CSS one, or the two fight each other.
    document.documentElement.style.scrollBehavior = 'auto';

    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey) return;                                  // leave pinch-zoom alone
      if (document.body.classList.contains('is-locked')) return; // menu open
      e.preventDefault();
      var d = e.deltaY;
      if (e.deltaMode === 1) d *= 16;                         // lines
      else if (e.deltaMode === 2) d *= window.innerHeight;    // pages
      set(target + d * WHEEL);
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      if (t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable)) return;
      if (document.body.classList.contains('is-locked')) return;

      var page = window.innerHeight * 0.88;
      switch (e.key) {
        case 'ArrowDown': api.by(120); break;
        case 'ArrowUp':   api.by(-120); break;
        case 'PageDown':  api.by(page); break;
        case 'PageUp':    api.by(-page); break;
        case ' ':         if (t !== document.body) return; api.by(e.shiftKey ? -page : page); break;
        case 'Home':      set(0); break;
        case 'End':       set(limit()); break;
        default: return;
      }
      e.preventDefault();
    });

    onFrame(function () {
      // Idle: follow the real scroll position so scrollbar drags,
      // find-in-page and focus jumps don't get yanked back.
      if (!running) { current = target = written = window.scrollY; return; }

      // Mid-glide, something else moved the page (scrollbar drag,
      // scrollIntoView, the browser restoring a position). Hand it over.
      if (Math.abs(window.scrollY - written) > 2) {
        current = target = written = window.scrollY;
        running = false;
        return;
      }

      target = clamp(target, 0, limit());   // page height can change mid-glide
      current = lerp(current, target, EASE);
      if (Math.abs(target - current) < 0.4) { current = target; running = false; }
      written = current;
      window.scrollTo(0, current);
    });

    return api;
  })();

  /* -----------------------------------------------------------
     2. ANCHOR LINKS — glide to the section, clear of the nav bar
  ----------------------------------------------------------- */
  $$('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (!id || id.length < 2) return;

    a.addEventListener('click', function (e) {
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();

      var navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
      var top  = el.getBoundingClientRect().top + window.scrollY;
      smooth.to(id === '#top' ? 0 : top - navH + 1);

      // Keep the URL and keyboard focus in step with where we landed.
      if (window.history && history.replaceState) history.replaceState(null, '', id);
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    });
  });

  /* -----------------------------------------------------------
     3. LOADER — counts to 100, then wipes away in columns
  ----------------------------------------------------------- */
  (function loader() {
    var el    = $('#loader');
    var count = $('#loaderCount');
    var rail  = $('#loaderRail');
    if (!el) { document.body.classList.add('is-ready'); return; }

    function finish() {
      el.classList.add('is-done');
      document.body.classList.add('is-ready');
      setTimeout(function () { el.classList.add('is-hidden'); }, 1100);
    }

    if (reduce) { el.classList.add('is-hidden'); document.body.classList.add('is-ready'); return; }

    var n = 0;
    var tick = setInterval(function () {
      n += Math.random() * 11 + 4;
      if (n >= 100) { n = 100; clearInterval(tick); setTimeout(finish, 260); }
      if (count) count.textContent = Math.floor(n);
      if (rail) rail.style.width = n + '%';
    }, 70);

    // Safety net: never let a slow asset trap the page behind the loader.
    setTimeout(function () { clearInterval(tick); finish(); }, 3400);
  })();

  /* -----------------------------------------------------------
     4. HERO ENTRANCE — index each staggered element
  ----------------------------------------------------------- */
  $$('[data-stagger]').forEach(function (el) {
    el.style.setProperty('--i', el.getAttribute('data-stagger'));
  });

  /* -----------------------------------------------------------
     5. SPLIT TEXT — headings rise word by word
     Each word gets its own masked wrapper so it can slide up
     from behind an invisible line.
  ----------------------------------------------------------- */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var wrap = document.createElement('span');
      wrap.className = 'split-word';
      var inner = document.createElement('i');
      inner.textContent = w;
      inner.style.setProperty('--d', (i * 55) + 'ms');
      wrap.appendChild(inner);
      el.appendChild(wrap);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* -----------------------------------------------------------
     6. SCROLL REVEALS — .reveal and [data-split]
  ----------------------------------------------------------- */
  (function reveals() {
    var items = $$('.reveal, [data-split]');
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var group = el.closest('.service-list, .work-grid, .process-list, .principles__grid, .capabilities__list, .accordion');
        var delay = 0;
        if (group) {
          var sibs = $$('.reveal', group);
          delay = Math.max(0, sibs.indexOf(el)) * 70;
        }
        setTimeout(function () { el.classList.add('is-visible'); }, delay);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* -----------------------------------------------------------
     7. NAV — progress bar, scroll state, auto-hide, active pill
  ----------------------------------------------------------- */
  (function navigation() {
    var nav  = $('#nav');
    var bar  = $('#scrollBar');
    var pill = $('#navPill');
    var links = $$('#navLinks a');
    if (!nav) return;

    var hidden = false;

    onFrame(function () {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (scroll.y / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';

      nav.classList.toggle('is-scrolled', scroll.y > 12);

      // Tuck the bar away when scrolling down past the hero,
      // bring it straight back on any upward scroll.
      var shouldHide = scroll.velocity > 3 && scroll.y > 600;
      var shouldShow = scroll.velocity < -3 || scroll.y < 200;
      if (shouldHide && !hidden) { hidden = true; nav.classList.add('is-tucked'); }
      else if (shouldShow && hidden) { hidden = false; nav.classList.remove('is-tucked'); }
    });

    // --- active section + sliding pill ---
    function movePill(target) {
      if (!pill || !target) return;
      pill.style.width = target.offsetWidth + 'px';
      pill.style.transform = 'translate(' + target.offsetLeft + 'px,' + target.offsetTop + 'px)';
      pill.classList.add('is-on');
    }

    var current = null;
    // Only in-page anchors ('#work') map to a section on this page. Links to
    // another page ('../#work') have no section here and are skipped.
    var sections = links.map(function (a) {
      var h = a.getAttribute('href') || '';
      return h.charAt(0) === '#' && h.length > 1 ? $(h) : null;
    });

    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = sections.indexOf(entry.target);
          if (idx < 0) return;
          links.forEach(function (a) { a.classList.remove('is-current'); });
          links[idx].classList.add('is-current');
          current = links[idx];
          movePill(current);
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { if (s) spy.observe(s); });
    }

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { movePill(a); });
    });
    var linkWrap = $('#navLinks');
    if (linkWrap) {
      linkWrap.addEventListener('mouseleave', function () {
        if (current) movePill(current);
        else if (pill) pill.classList.remove('is-on');
      });
    }
    window.addEventListener('resize', function () { if (current) movePill(current); });

    // A link marked aria-current="page" (Store, on /store) is the resting pill.
    var here = links.filter(function (a) { return a.getAttribute('aria-current') === 'page'; })[0];
    if (here) {
      current = here;
      here.classList.add('is-current');
      var place = function () { movePill(here); };
      place();
      window.addEventListener('load', place);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    }
  })();

  /* -----------------------------------------------------------
     8. MOBILE MENU — clip-path curtain + staggered links
  ----------------------------------------------------------- */
  (function mobileMenu() {
    var toggle = $('#navToggle');
    var menu   = $('#mobileMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(!toggle.classList.contains('is-open'));
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.classList.contains('is-open')) setOpen(false);
    });
  })();

  /* -----------------------------------------------------------
     9. CUSTOM CURSOR — trailing ring, contextual labels
  ----------------------------------------------------------- */
  (function customCursor() {
    var cur = $('#cursor');
    var label = $('#cursorLabel');
    if (!cur || !fine || reduce) return;

    var cx = pointer.x, cy = pointer.y;
    onFrame(function () {
      cx = lerp(cx, pointer.x, 0.22);
      cy = lerp(cy, pointer.y, 0.22);
      cur.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      cur.classList.toggle('is-down', pointer.down);
    });

    var hot = 'a, button, [data-cursor], .service-row, .work-item, .product, .accordion__trigger, .capabilities__list li, .review-card, .orbit-member';

    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest(hot);
      if (!t) return;
      var text = t.getAttribute('data-cursor');
      if (text && label) { label.textContent = text; cur.classList.add('is-label'); }
      else cur.classList.add('is-active');
    });
    document.addEventListener('mouseout', function (e) {
      if (!e.target.closest(hot)) return;
      cur.classList.remove('is-active', 'is-label');
    });
  })();

  /* -----------------------------------------------------------
     10. MAGNETIC ELEMENTS — buttons lean toward the cursor
  ----------------------------------------------------------- */
  function bindMagnet(el) {
    if (!fine || reduce || el.__magnet) return;
    el.__magnet = true;

    var tx = 0, ty = 0, x = 0, y = 0, active = false;

    el.addEventListener('mouseenter', function () { active = true; });
    el.addEventListener('mouseleave', function () { active = false; tx = 0; ty = 0; });
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var strength = clamp(r.width / 8, 8, 26);
      tx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength;
      ty = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength * 0.7;
    });

    onFrame(function () {
      if (!active && Math.abs(x) < 0.05 && Math.abs(y) < 0.05) return;
      x = lerp(x, tx, 0.18);
      y = lerp(y, ty, 0.18);
      el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
    });
  }
  $$('[data-magnet]').forEach(bindMagnet);

  /* -----------------------------------------------------------
     11. SERVICE PEEK — a card trails the cursor over each row
  ----------------------------------------------------------- */
  (function peek() {
    var card = $('#peek');
    var rows = $$('.service-row');
    if (!card || !rows.length || !fine || reduce) return;

    var title = $('.peek__title', card);
    var px = pointer.x, py = pointer.y, on = false;

    rows.forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        on = true;
        px = pointer.x + 150; py = pointer.y - 105;  // start in place, no fly-in
        if (title) title.textContent = row.getAttribute('data-peek') || '';
        card.setAttribute('data-tone', row.getAttribute('data-tone') || '1');
        card.classList.add('is-on');
      });
      row.addEventListener('mouseleave', function () {
        on = false;
        card.classList.remove('is-on');
      });
    });

    onFrame(function () {
      if (!on) return;
      px = lerp(px, pointer.x + 150, 0.12);
      py = lerp(py, pointer.y - 105, 0.12);
      card.style.left = px + 'px';
      card.style.top  = py + 'px';
    });
  })();

  /* -----------------------------------------------------------
     12. MISSING IMAGES — fall back to the frame's gradient rather
     than showing a broken-image box.
  ----------------------------------------------------------- */
  $$('.work-item__image').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
  });

  /* -----------------------------------------------------------
     13. TILT CARDS — work items rotate toward the cursor
  ----------------------------------------------------------- */
  (function tilt() {
    if (!fine || reduce) return;
    $$('[data-tilt]').forEach(function (el) {
      var frame = $('.work-item__frame', el) || el;
      var rx = 0, ry = 0, tx = 0, ty = 0, active = false;

      el.addEventListener('mouseenter', function () { active = true; });
      el.addEventListener('mouseleave', function () { active = false; tx = 0; ty = 0; });
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        ty = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 7;   // rotateY
        tx = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 7; // rotateX
      });

      onFrame(function () {
        if (!active && Math.abs(rx) < 0.02 && Math.abs(ry) < 0.02) return;
        rx = lerp(rx, tx, 0.12);
        ry = lerp(ry, ty, 0.12);
        frame.style.transform =
          'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)' +
          (active ? ' scale(1.015)' : '');
      });
    });
  })();

  /* -----------------------------------------------------------
     14. CAPABILITY GRID — cells glow under the pointer
  ----------------------------------------------------------- */
  (function capGlow() {
    var grid = $('#capGrid');
    if (!grid || !fine || reduce) return;
    var cells = $$('li', grid);

    grid.addEventListener('pointermove', function (e) {
      cells.forEach(function (cell) {
        var r = cell.getBoundingClientRect();
        cell.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        cell.style.setProperty('--my', (e.clientY - r.top) + 'px');
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        cell.style.setProperty('--glow', inside ? '1' : '0.35');
      });
    });
    grid.addEventListener('pointerleave', function () {
      cells.forEach(function (c) { c.style.setProperty('--glow', '0'); });
    });
  })();

  /* -----------------------------------------------------------
     15. MARQUEE — constant drift, nudged by scroll speed
  ----------------------------------------------------------- */
  (function marquee() {
    var track = $('#marqueeTrack');
    if (!track || reduce) return;

    // Duplicate the content so the loop has no visible seam.
    var original = track.innerHTML;
    track.innerHTML = original + original;

    var offset = 0, half = 0, speed = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener('resize', measure);

    onFrame(function () {
      speed = lerp(speed, 0.6 + clamp(Math.abs(scroll.velocity) * 0.08, 0, 5), 0.08);
      offset -= speed;
      if (half && offset <= -half) offset += half;
      track.style.transform = 'translate3d(' + offset.toFixed(2) + 'px,0,0)';
    });
  })();

  /* -----------------------------------------------------------
     16. PROCESS RAIL — fills and lights each step in turn
  ----------------------------------------------------------- */
  (function processRail() {
    var list = $('#processList');
    var fill = $('#processFill');
    if (!list || !fill) return;
    var steps = $$('.process-step', list);
    var vertical = window.matchMedia('(max-width: 860px)');

    onFrame(function () {
      var r = list.getBoundingClientRect();
      var start = window.innerHeight * 0.85;
      var span  = r.height + start - window.innerHeight * 0.3;
      var p = clamp((start - r.top) / span, 0, 1);

      if (vertical.matches) { fill.style.height = (p * 100) + '%'; fill.style.width = '100%'; }
      else { fill.style.width = (p * 100) + '%'; fill.style.height = '100%'; }

      steps.forEach(function (step, i) {
        step.classList.toggle('is-active', p >= (i / steps.length) + 0.04);
      });
    });
  })();

  /* -----------------------------------------------------------
     17. COUNT UP — numbers roll when they scroll into view
  ----------------------------------------------------------- */
  (function counters() {
    var nodes = $$('[data-count]');
    if (!nodes.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var t0 = performance.now(), dur = 1100;
        (function step(now) {
          var p = clamp((now - t0) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toString().padStart(
            el.getAttribute('data-count').length, '0'
          );
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nodes.forEach(function (n) { io.observe(n); });
  })();

  /* -----------------------------------------------------------
     18. ACCORDION — one panel open at a time
  ----------------------------------------------------------- */
  $$('.accordion__trigger').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion__item');
      var wasOpen = item.classList.contains('is-open');
      $$('.accordion__item.is-open').forEach(function (open) {
        open.classList.remove('is-open');
        $('.accordion__trigger', open).setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* -----------------------------------------------------------
     19. TEXT SCRAMBLE — brand and headline words shuffle on hover
  ----------------------------------------------------------- */
  (function scramble() {
    if (reduce) return;
    var GLYPHS = '!<>-_\\/[]{}—=+*^?#01';

    $$('[data-scramble]').forEach(function (el) {
      var real = el.textContent;
      var raf = null, running = false;

      function run() {
        if (running) return;
        running = true;
        var frame = 0;
        var queue = real.split('').map(function (ch, i) {
          return { ch: ch, start: Math.floor(Math.random() * 8) + i, end: Math.floor(Math.random() * 14) + i + 8 };
        });

        (function update() {
          var out = '', done = 0;
          queue.forEach(function (q) {
            if (frame >= q.end) { out += q.ch; done++; }
            else if (frame >= q.start) { out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
            else { out += q.ch; }
          });
          el.textContent = out;
          if (done === queue.length) { running = false; el.textContent = real; return; }
          frame++;
          raf = requestAnimationFrame(update);
        })();
      }

      el.addEventListener('mouseenter', run);
      el.addEventListener('focus', run);
      el.addEventListener('mouseleave', function () {
        if (raf) cancelAnimationFrame(raf);
        running = false;
        el.textContent = real;
      });
    });
  })();

  /* -----------------------------------------------------------
     20. PARALLAX — background layers drift at their own pace
  ----------------------------------------------------------- */
  (function parallax() {
    var layers = $$('[data-parallax]');
    if (!layers.length || reduce) return;

    onFrame(function () {
      layers.forEach(function (el) {
        var rate = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        var base = el.classList.contains('hero__visual') ? 'translate(-50%,-50%) ' : '';
        el.style.transform = base + 'translate3d(0,' + (scroll.y * rate).toFixed(2) + 'px,0)';
      });
    });
  })();

  /* -----------------------------------------------------------
     21. BACK TO TOP — ring traces how far down the page you are
  ----------------------------------------------------------- */
  (function toTop() {
    var btn = $('#toTop');
    var ring = $('#toTopRing');
    if (!btn) return;
    var CIRC = 129;

    onFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? clamp(scroll.y / max, 0, 1) : 0;
      btn.classList.toggle('is-on', scroll.y > window.innerHeight * 0.9);
      if (ring) ring.style.strokeDashoffset = (CIRC - CIRC * p).toFixed(1);
    });

    btn.addEventListener('click', function () {
      smooth.to(0);
    });
  })();

  /* -----------------------------------------------------------
     22. HERO CANVAS — a constellation that reacts to the cursor
     Nodes drift, link to their neighbours, and are pushed away
     by the pointer. Lines fade with distance.
  ----------------------------------------------------------- */
  (function constellation() {
    var canvas = $('#heroCanvas');
    if (!canvas || reduce) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, nodes = [], visible = true;
    var LINK = 132;      // px — max distance two nodes will link across
    var PUSH = 130;      // px — cursor repulsion radius

    function count() {
      var target = Math.round((w * h) / 20000);
      return clamp(target, 26, 84);
    }

    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      nodes = [];
      for (var i = 0; i < count(); i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: Math.random() * 1.5 + 0.6,
          o: Math.random() * 0.45 + 0.2
        });
      }
    }

    function draw() {
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);

      var rect = canvas.getBoundingClientRect();
      var mx = pointer.x - rect.left;
      var my = pointer.y - rect.top;

      for (var i = 0; i < nodes.length; i++) {
        var p = nodes[i];
        p.x += p.vx; p.y += p.vy;

        // wrap at the edges
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        // push away from the cursor
        var dx = p.x - mx, dy = p.y - my;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < PUSH && d > 0.01) {
          var f = (1 - d / PUSH) * 1.6;
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        // links to nearby nodes
        for (var j = i + 1; j < nodes.length; j++) {
          var q = nodes[j];
          var lx = p.x - q.x, ly = p.y - q.y;
          var ld = Math.sqrt(lx * lx + ly * ly);
          if (ld < LINK) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(143,233,220,' + (0.16 * (1 - ld / LINK)).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // link to the cursor itself
        if (d < PUSH * 1.8) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = 'rgba(169,140,217,' + (0.24 * (1 - d / (PUSH * 1.8))).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(143,233,220,' + p.o + ')';
        ctx.fill();
      }
    }

    resize(); seed();
    onFrame(draw);

    window.addEventListener('resize', function () { resize(); seed(); });

    // Stop painting once the hero has scrolled off screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }
  })();

  /* -----------------------------------------------------------
     PUBLIC API — lets other page scripts (js/store.js) reuse this
     engine for elements they create after load.
  ----------------------------------------------------------- */
  window.AscendUI = {
    reduce: reduce,
    fine: fine,
    onFrame: onFrame,
    magnet: bindMagnet,
    scrollTo: function (y) { smooth.to(y); }
  };

})();
