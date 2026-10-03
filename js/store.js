(function () {
  'use strict';

  /* =============================================================
     ADD / EDIT PRODUCTS HERE
     -------------------------------------------------------------
     Every card, filter pill, count, search result and detail
     window on the store is generated from the PRODUCTS array below.
     You never write card HTML.

     TO ADD A PRODUCT
       1. Copy an existing product object (including its { } and comma).
       2. Change the id (unique, lowercase, no spaces — e.g. "logo-pack").
       3. Change name / category / description.
       4. Change price.
       5. Drop its image into assets/store/ and point `image` at it.
          (No image yet? Leave it — a branded placeholder is shown.)
       6. Add features.
       7. Set featured: true or false.
       8. Save.
     Filters, counts, numbering and the detail window update by themselves.

     FIELDS  (only name is truly required — everything else is optional)
       id          unique key. Also makes the product linkable: /store#discord-setup
       number      "01", "02"… shown on the card. Leave out to number automatically.
       category    label shown on the card, e.g. "WEB DEVELOPMENT".
       filter      which filter pill it belongs to, e.g. "WEB", "DISCORD".
                   Leave out and the category is used. A new word here
                   creates a new pill automatically.
       name        product title.
       description short text on the card.
       longDescription  longer text in the detail window (falls back to description).
       price       shown as written: "₹999", "$15", "Custom" — any text works.
       priceLabel  small text above the price: "Starting at", "From"…
       oldPrice    struck-through price, e.g. "₹1,499". Leave "" for none.
       badge       small tag on the image: "POPULAR", "NEW"… Leave "" for none.
       featured    true = wider card with accent border and a FEATURED tag.
       image       path from the site root, e.g. "assets/store/website.jpg".
       imageAlt    alt text for the image (defaults to the product name).
       delivery    delivery estimate: "3–5 days".
       features    list of included items. Cards show the first few,
                   the detail window shows all of them.
       buttonText  label on the card button (default "View Service").
       buttonLink  where the "Order" button in the detail window goes.
                   Leave "#" or "" to use the Discord invite below.
       orderText   label of that Order button (default "Order on Discord").
       tone        1–8 colour of the placeholder (default: automatic).
  ============================================================= */

  var CONFIG = {
    // Where "Order" buttons go unless a product sets its own buttonLink.
    discord: 'https://discord.gg/WDzhZU5xwJ',

    // Order of the filter pills. Any filter not listed here is added after
    // these, in the order it first appears. "OTHER" always goes last.
    filterOrder: ['WEB', 'DESIGN', 'DISCORD', 'MINECRAFT', 'ROBLOX', 'OTHER'],

    // How many features to preview on a card (the featured card shows more).
    cardFeatures: 3,
    featuredCardFeatures: 4,

    orderText: 'Order on Discord'
  };

  var PRODUCTS = [
    {
      id: 'website-professional',
      number: '01',
      category: 'WEB DEVELOPMENT',
      filter: 'WEB',
      name: 'Professional Website',
      description: 'Modern responsive website built around your requirements.',
      longDescription: 'A custom-built, fully responsive website designed around your brand, content and goals — from a focused landing page to a multi-section business site. Clean layouts, smooth interactions, and source files handed over at the end.',
      price: '₹1999',
      priceLabel: 'Starting at',
      oldPrice: '',
      badge: '',
      featured: true,
      image: 'assets/store/website.jpg',
      delivery: '3–5 days',
      features: [
        'Responsive design',
        'Custom sections',
        'Modern animations',
        'Source files'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'thumbnails',
      number: '02',
      category: 'GRAPHIC DESIGN',
      filter: 'DESIGN',
      name: 'Custom Thumbnails',
      description: 'High-impact thumbnails and promotional graphics designed to earn the click.',
      price: '₹149',
      priceLabel: 'From',
      oldPrice: '₹199',
      badge: 'OFFER',
      image: 'assets/store/thumbnails.jpg',
      delivery: '24–48 hours',
      features: [
        'Custom artwork',
        'Optimised for YouTube',
        'PNG / JPG delivery',
        'Revisions'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'custom-bots',
      number: '03',
      category: 'DISCORD BOTS',
      filter: 'DISCORD',
      name: 'Custom Discord Bot',
      description: 'Bots, commands, automation and integrations tailored to your server.',
      price: '₹499',
      priceLabel: 'Starting at',
      image: 'assets/store/custom-bots.jpg',
      delivery: '3–7 days',
      features: [
        'Custom commands',
        'Moderation & automation',
        'Integrations',
        'Setup guidance'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'discord-setup',
      number: '04',
      category: 'DISCORD SETUP',
      filter: 'DISCORD',
      name: 'Discord Server Setup',
      description: 'Structure, channels, roles, permissions and bots — configured properly.',
      price: '₹299',
      priceLabel: 'Starting at',
      badge: 'POPULAR',
      image: 'assets/store/discord-setup.jpg',
      delivery: '1–2 days',
      features: [
        'Channel & category structure',
        'Roles & permissions',
        'Moderation bots',
        'Welcome & verification'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'sponsorships',
      number: '05',
      category: 'PARTNERSHIPS',
      filter: 'OTHER',
      name: 'Sponsorships & Partnerships',
      description: 'Business collaborations and sponsorship opportunities.',
      price: 'Custom',
      priceLabel: 'Pricing',
      image: 'assets/store/sponsorships.jpg',
      delivery: 'Varies',
      features: [
        'Tailored to your audience',
        'Flexible collaboration formats',
        'Discussed directly on Discord'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'roblox-services',
      number: '06',
      category: 'ROBLOX',
      filter: 'ROBLOX',
      name: 'Roblox Services',
      description: 'AFK grinding, resource grinding and game progression handled for you.',
      price: '₹199',
      priceLabel: 'Starting at',
      image: 'assets/store/roblox-services.jpg',
      delivery: 'Varies by task',
      features: [
        'AFK grinding',
        'Resource grinding',
        'Game progression'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'minecraft-animation',
      number: '07',
      category: 'MINECRAFT ANIMATION',
      filter: 'MINECRAFT',
      name: 'Minecraft Animation',
      description: 'Cinematic Minecraft scenes and animations produced to your brief.',
      price: '₹1,499',
      priceLabel: 'Starting at',
      image: 'assets/store/minecraft-animation.jpg',
      delivery: '5–10 days',
      features: [
        'Custom scenes',
        'Camera direction',
        'Rendered delivery'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    },
    {
      id: 'minecraft-server-development',
      number: '08',
      category: 'MINECRAFT SERVER',
      filter: 'MINECRAFT',
      name: 'Minecraft Server Development',
      description: 'Plugins, datapacks, configuration and custom gameplay for your server.',
      price: '₹1,999',
      priceLabel: 'Starting at',
      image: 'assets/store/minecraft-server-development.jpg',
      delivery: 'Varies by scope',
      features: [
        'Plugins & datapacks',
        'Server configuration',
        'Custom gameplay systems',
        'Testing before handoff'
      ],
      buttonText: 'View Service',
      buttonLink: '#'
    }
  ];

  /* =============================================================
     ENGINE — nothing below needs editing to add products.
  ============================================================= */

  var UI = window.AscendUI || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var body = document.body;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Timing comes from the site's own motion tokens so the store never
  // drifts from the rest of the design.
  function cssVar(name) { return getComputedStyle(root).getPropertyValue(name).trim(); }
  function cssMs(name, fallback) { var v = parseFloat(cssVar(name)); return isNaN(v) ? fallback : v; }
  var EASE = cssVar('--ease') || 'cubic-bezier(.16,.84,.44,1)';
  var FAST = cssMs('--fast', 220);
  var MED  = cssMs('--med', 480);

  var grid = $('#productGrid');
  if (!grid) return;

  var filtersEl   = $('#filters');
  var filtersPill = $('#filtersPill');
  var statusEl    = $('#resultCount');
  var resetBtn    = $('#resetBtn');
  var emptyEl     = $('#emptyState');
  var emptyQuery  = $('#emptyQuery');
  var emptyReset  = $('#emptyReset');
  var searchForm  = $('#search');
  var searchInput = $('#searchInput');
  var searchClear = $('#searchClear');

  var ROOT = body.getAttribute('data-root') || '';

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null && text !== '') node.textContent = text;
    return node;
  }

  // Image paths in PRODUCTS are written from the site root; this makes
  // them work from /store/ (and any host or sub-folder).
  function resolve(path) {
    if (!path) return '';
    if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(path) || /^(data|blob):/i.test(path) || path.charAt(0) === '/') return path;
    return ROOT + path.replace(/^\.\//, '');
  }

  function whenReady(fn) {
    if (body.classList.contains('is-ready')) { fn(); return; }
    var mo = new MutationObserver(function () {
      if (body.classList.contains('is-ready')) { mo.disconnect(); fn(); }
    });
    mo.observe(body, { attributes: true, attributeFilter: ['class'] });
  }

  /* ---------- normalise the data ---------- */
  var seen = {};
  var products = PRODUCTS.map(function (p, i) {
    var id = String(p.id || 'product-' + (i + 1));
    if (seen[id]) {
      if (window.console) console.warn('[store] Duplicate product id "' + id + '" — ids must be unique.');
      id = id + '-' + (i + 1);
    }
    seen[id] = true;

    var category = String(p.category || 'Service');
    var features = Array.isArray(p.features) ? p.features.filter(Boolean) : [];
    return {
      id: id,
      number: p.number ? String(p.number) : pad(i + 1),
      category: category,
      filter: String(p.filter || category).toUpperCase(),
      name: String(p.name || 'Untitled service'),
      description: p.description || '',
      longDescription: p.longDescription || p.description || '',
      price: p.price || '',
      priceLabel: p.priceLabel || '',
      oldPrice: p.oldPrice || '',
      badge: p.badge || '',
      featured: !!p.featured,
      image: p.image || '',
      imageAlt: p.imageAlt || '',
      delivery: p.delivery || '',
      features: features,
      buttonText: p.buttonText || 'View Service',
      buttonLink: p.buttonLink || '',
      orderText: p.orderText || CONFIG.orderText,
      tone: p.tone || ((i % 8) + 1)
    };
  });

  var byId = {};
  products.forEach(function (p) { byId[p.id] = p; });

  // Filter groups: configured order first, the rest as they appear, OTHER last.
  var groups = (function () {
    var present = [];
    products.forEach(function (p) { if (present.indexOf(p.filter) === -1) present.push(p.filter); });
    var ordered = CONFIG.filterOrder.filter(function (g) { return present.indexOf(g) !== -1 && g !== 'OTHER'; });
    present.forEach(function (g) { if (ordered.indexOf(g) === -1 && g !== 'OTHER') ordered.push(g); });
    if (present.indexOf('OTHER') !== -1) ordered.push('OTHER');
    return ordered;
  })();

  function countIn(group) {
    return products.filter(function (p) { return group === 'ALL' || p.filter === group; }).length;
  }

  // Live counts in the page (e.g. the hero: "08 digital services").
  $$('[data-store-count="products"]').forEach(function (n) { n.textContent = pad(products.length); });

  /* ---------- shared: image with automatic placeholder ---------- */
  function buildVisual(p, eager) {
    var v = el('div', 'visual');
    v.setAttribute('data-tone', String(p.tone));

    var ph = el('div', 'visual__ph');
    ph.setAttribute('aria-hidden', 'true');
    ph.appendChild(el('span', 'visual__ph-cat', p.category));
    ph.appendChild(el('span', 'visual__ph-num', p.number));
    ph.appendChild(el('span', 'visual__ph-tag', 'Image placeholder'));
    v.appendChild(ph);

    if (p.image) {
      var img = document.createElement('img');
      img.className = 'visual__img';
      img.alt = p.imageAlt || (p.name + ' preview');
      img.decoding = 'async';
      if (!eager) img.loading = 'lazy';
      // Listeners first, src last — a missing file just removes the <img>
      // and the placeholder underneath is what the visitor sees.
      img.addEventListener('load', function () {
        v.classList.add('has-image');
        img.classList.add('is-loaded');
      });
      img.addEventListener('error', function () {
        if (img.parentNode) img.parentNode.removeChild(img);
      });
      img.src = resolve(p.image);
      v.appendChild(img);
    }
    return v;
  }

  function buildPrice(p, cls) {
    var wrap = el('div', cls);
    if (p.priceLabel) wrap.appendChild(el('span', cls + '-label', p.priceLabel));
    var row = el('span', cls + '-row');
    row.appendChild(el('b', cls === 'product__price' ? 'product__amount' : '', p.price));
    if (p.oldPrice) row.appendChild(el('s', 'product__old', p.oldPrice));
    wrap.appendChild(row);
    return wrap;
  }

  /* ---------- product card ---------- */
  function buildCard(p) {
    var card = el('article', 'product' + (p.featured ? ' product--featured' : ''));
    card.setAttribute('data-id', p.id);
    card.setAttribute('data-cursor', 'View');
    card.setAttribute('aria-labelledby', 'product-title-' + p.id);

    var visual = buildVisual(p, false);
    if (p.featured || p.badge) {
      var badges = el('div', 'product__badges');
      if (p.featured) badges.appendChild(el('span', 'badge badge--featured', 'Featured'));
      if (p.badge) badges.appendChild(el('span', 'badge', p.badge));
      visual.appendChild(badges);
    }
    card.appendChild(visual);

    var bodyEl = el('div', 'product__body');

    var meta = el('div', 'product__meta');
    meta.appendChild(el('span', 'product__num', p.number));
    meta.appendChild(el('span', 'product__cat', p.category));
    bodyEl.appendChild(meta);

    var name = el('h3', 'product__name', p.name);
    name.id = 'product-title-' + p.id;
    bodyEl.appendChild(name);

    // The wider featured card has room for the longer text.
    var blurb = p.featured ? p.longDescription : p.description;
    if (blurb) bodyEl.appendChild(el('p', 'product__desc', blurb));

    if (p.features.length) {
      var limit = p.featured ? CONFIG.featuredCardFeatures : CONFIG.cardFeatures;
      var list = el('ul', 'product__features');
      p.features.slice(0, limit).forEach(function (f) { list.appendChild(el('li', '', f)); });
      if (p.features.length > limit) {
        list.appendChild(el('li', 'product__more', '+' + (p.features.length - limit) + ' more'));
      }
      bodyEl.appendChild(list);
    }

    var bottom = el('div', 'product__bottom');
    if (p.delivery) {
      var del = el('div', 'product__delivery');
      del.appendChild(el('span', '', 'Delivery'));
      del.appendChild(el('span', '', p.delivery));
      bottom.appendChild(del);
    }

    var foot = el('div', 'product__foot');
    if (p.price) foot.appendChild(buildPrice(p, 'product__price'));

    var cta = el('button', 'btn btn--sm product__cta ' + (p.featured ? 'btn--primary' : 'btn--ghost'));
    cta.type = 'button';
    cta.setAttribute('aria-haspopup', 'dialog');
    cta.setAttribute('aria-label', p.buttonText + ': ' + p.name);
    cta.appendChild(el('span', 'btn__fill'));
    var label = el('span', 'btn__label', p.buttonText + ' ');
    var arrow = el('span', 'arrow', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    label.appendChild(arrow);
    cta.appendChild(label);
    if (UI.magnet) UI.magnet(cta);
    foot.appendChild(cta);
    bottom.appendChild(foot);
    bodyEl.appendChild(bottom);

    card.appendChild(bodyEl);
    card.appendChild(el('span', 'product__ring'));
    return card;
  }

  var cards = products.map(function (p) {
    var node = buildCard(p);
    grid.appendChild(node);
    return {
      p: p,
      el: node,
      hay: [p.name, p.category, p.filter, p.description, p.longDescription, p.features.join(' ')].join(' \n ').toLowerCase()
    };
  });

  /* ---------- entrance animation (staggered, on scroll) ---------- */
  var IN_FRAMES = [
    { opacity: 0, transform: 'translateY(26px) scale(0.985)' },
    { opacity: 1, transform: 'none' }
  ];
  var running = [];

  function reveal(node, delay) {
    node.classList.add('is-in');
    if (reduce || !node.animate) return;
    running.push(node.animate(IN_FRAMES, { duration: MED + 200, delay: delay || 0, easing: EASE, fill: 'backwards' }));
  }

  var io = null;
  if (!reduce && 'IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      var d = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var node = entry.target;
        io.unobserve(node);
        if (node.classList.contains('is-in')) return;
        reveal(node, d);
        d = Math.min(d + 80, 400);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    // Wait for the loader to lift so the entrance is actually seen.
    whenReady(function () { cards.forEach(function (c) { if (!c.el.classList.contains('is-in')) io.observe(c.el); }); });
  } else {
    cards.forEach(function (c) { c.el.classList.add('is-in'); });
  }

  /* ---------- cursor-following light on cards ---------- */
  if (UI.fine && !reduce) {
    grid.addEventListener('pointermove', function (e) {
      var card = e.target.closest ? e.target.closest('.product') : null;
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- filters ---------- */
  var state = { group: 'ALL', query: '' };
  var terms = [];
  var filterButtons = [];

  ['ALL'].concat(groups).forEach(function (g) {
    var n = countIn(g);
    var b = el('button', 'filter');
    b.type = 'button';
    b.setAttribute('data-filter', g);
    b.setAttribute('aria-pressed', g === 'ALL' ? 'true' : 'false');
    b.setAttribute('aria-label', (g === 'ALL' ? 'All' : g) + ', ' + n + (n === 1 ? ' service' : ' services'));
    b.appendChild(el('span', 'filter__name', g));
    b.appendChild(el('span', 'filter__count', pad(n)));
    filtersEl.appendChild(b);
    filterButtons.push(b);
  });

  function activeFilterButton() {
    return filterButtons.filter(function (b) { return b.getAttribute('data-filter') === state.group; })[0];
  }

  function movePill(instant) {
    var btn = activeFilterButton();
    if (!btn || !filtersPill) return;
    if (instant) filtersPill.style.transition = 'none';
    filtersPill.style.width = btn.offsetWidth + 'px';
    filtersPill.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
    filtersPill.classList.add('is-on');
    if (instant) { void filtersPill.offsetWidth; filtersPill.style.transition = ''; }

    // On narrow screens the pill row scrolls sideways — keep the choice in view.
    if (filtersEl.scrollWidth > filtersEl.clientWidth) {
      filtersEl.scrollTo({
        left: btn.offsetLeft - (filtersEl.clientWidth - btn.offsetWidth) / 2,
        behavior: reduce || instant ? 'auto' : 'smooth'
      });
    }
  }

  filtersEl.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.filter') : null;
    if (!btn) return;
    var g = btn.getAttribute('data-filter');
    if (g === state.group) return;
    state.group = g;
    filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    movePill(false);
    update();
  });

  movePill(true);
  window.addEventListener('resize', function () { movePill(true); });
  window.addEventListener('load', function () { movePill(true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { movePill(true); });

  /* ---------- search ---------- */
  var searchTimer = null;

  function syncSearchUi() {
    searchForm.classList.toggle('has-value', searchInput.value.length > 0);
  }
  searchForm.addEventListener('submit', function (e) { e.preventDefault(); });
  searchInput.addEventListener('input', function () {
    syncSearchUi();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      state.query = searchInput.value.trim();
      update();
    }, 130);
  });
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    syncSearchUi();
    state.query = '';
    update();
    searchInput.focus();
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (searchInput.value) { searchClear.click(); e.stopPropagation(); }
    else searchInput.blur();
  });
  // "/" jumps to search from anywhere (unless you're already typing).
  document.addEventListener('keydown', function (e) {
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || modalOpen) return;
    var t = e.target;
    if (t && (/^(input|textarea|select)$/i.test(t.tagName) || t.isContentEditable)) return;
    e.preventDefault();
    searchInput.focus();
  });

  function resetAll() {
    searchInput.value = '';
    syncSearchUi();
    state.query = '';
    state.group = 'ALL';
    filterButtons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-filter') === 'ALL' ? 'true' : 'false'); });
    movePill(false);
    update();
  }
  resetBtn.addEventListener('click', resetAll);
  emptyReset.addEventListener('click', resetAll);

  /* ---------- filtering + search, with transitions ---------- */
  function matches(c) {
    if (state.group !== 'ALL' && c.p.filter !== state.group) return false;
    for (var i = 0; i < terms.length; i++) {
      if (c.hay.indexOf(terms[i]) === -1) return false;
    }
    return true;
  }

  function renderStatus(shown) {
    var total = cards.length;
    var filtered = state.group !== 'ALL' || terms.length > 0;
    statusEl.textContent = '';
    if (filtered) {
      statusEl.appendChild(document.createTextNode('Showing '));
      statusEl.appendChild(el('b', '', pad(shown)));
      statusEl.appendChild(document.createTextNode(' of ' + pad(total) + ' services'));
    } else {
      statusEl.appendChild(el('b', '', pad(total)));
      statusEl.appendChild(document.createTextNode(total === 1 ? ' service' : ' services'));
    }
    resetBtn.hidden = !filtered;
  }

  function cancelRunning() {
    running.forEach(function (a) { try { a.cancel(); } catch (err) { /* already finished */ } });
    running = [];
  }

  var token = 0;

  function update() {
    var my = ++token;
    cancelRunning();
    terms = state.query.toLowerCase().split(/\s+/).filter(Boolean);

    var stay = [], leave = [], enter = [];
    cards.forEach(function (c) {
      var show = matches(c);
      var visible = !c.el.hidden;
      if (show && visible) stay.push(c);
      else if (!show && visible) leave.push(c);
      else if (show && !visible) enter.push(c);
    });

    var shown = stay.length + enter.length;
    renderStatus(shown);
    emptyQuery.textContent = state.query ? '“' + state.query + '”' : (state.group !== 'ALL' ? state.group : '');

    function finish() {
      leave.forEach(function (c) { c.el.hidden = true; });
      enter.forEach(function (c) { c.el.hidden = false; if (io) io.unobserve(c.el); });
      emptyEl.hidden = shown !== 0;
    }

    if (reduce || !grid.animate) {
      finish();
      enter.forEach(function (c) { c.el.classList.add('is-in'); });
      return;
    }

    // 1. FIRST — remember where surviving cards are now.
    var first = stay.map(function (c) { return c.el.getBoundingClientRect(); });

    // 2. Cards that no longer match fade and drop away.
    leave.forEach(function (c) {
      running.push(c.el.animate(
        [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(12px) scale(0.985)' }],
        { duration: FAST, easing: EASE, fill: 'forwards' }
      ));
    });

    setTimeout(function () {
      if (my !== token) return;                      // a newer filter took over
      cancelRunning();
      finish();

      // 3. LAST + INVERT + PLAY — survivors glide to their new grid slots.
      stay.forEach(function (c, i) {
        var last = c.el.getBoundingClientRect();
        var dx = first[i].left - last.left;
        var dy = first[i].top - last.top;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
        running.push(c.el.animate(
          [{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
          { duration: MED + 160, easing: EASE }
        ));
      });

      // 4. Matching cards rise in, one after another.
      enter.forEach(function (c, i) { reveal(c.el, 40 + Math.min(i, 8) * 55); });
    }, leave.length ? FAST : 0);
  }

  /* ---------- detail window ---------- */
  var modal        = $('#modal');
  var panel        = $('#modalPanel');
  var modalVisual  = $('#modalVisual');
  var modalOpen    = false;
  var lastFocus    = null;
  var inertNodes   = $$('[data-inert-on-modal]');

  function setInert(on) {
    inertNodes.forEach(function (n) {
      if (on) { n.setAttribute('inert', ''); n.setAttribute('aria-hidden', 'true'); }
      else { n.removeAttribute('inert'); n.removeAttribute('aria-hidden'); }
    });
  }

  function fillModal(p) {
    $('#modalEyebrow').textContent = p.number + ' — ' + p.category;
    $('#modalTitle').textContent = p.name;
    $('#modalDesc').textContent = p.longDescription;

    // price
    var priceWrap = $('#modalPriceWrap');
    priceWrap.hidden = !p.price;
    $('#modalPriceLabel').textContent = p.priceLabel;
    $('#modalPriceLabel').hidden = !p.priceLabel;
    $('#modalPrice').textContent = p.price;
    $('#modalOld').textContent = p.oldPrice;
    $('#modalOld').hidden = !p.oldPrice;

    // delivery
    $('#modalDeliveryWrap').hidden = !p.delivery;
    $('#modalDelivery').textContent = p.delivery;

    // features
    var list = $('#modalFeatures');
    list.textContent = '';
    p.features.forEach(function (f) { list.appendChild(el('li', '', f)); });
    $('#modalFeaturesWrap').hidden = !p.features.length;

    // order button
    var cta = $('#modalCta');
    var link = p.buttonLink && p.buttonLink !== '#' ? p.buttonLink : CONFIG.discord;
    var external = /^https?:\/\//i.test(link);
    cta.setAttribute('href', link);
    if (external) { cta.setAttribute('target', '_blank'); cta.setAttribute('rel', 'noopener'); }
    else { cta.removeAttribute('target'); cta.removeAttribute('rel'); }
    $('#modalCtaText').textContent = p.orderText;

    // image
    modalVisual.textContent = '';
    modalVisual.appendChild(buildVisual(p, true));
  }

  function openProduct(id) {
    var p = byId[id];
    if (!p) return;
    if (!modalOpen) lastFocus = document.activeElement;
    fillModal(p);
    panel.scrollTop = 0;

    modalOpen = true;
    modal.classList.add('is-open');
    body.classList.add('is-locked');
    setInert(true);
    requestAnimationFrame(function () { panel.focus({ preventScroll: true }); });

    if (window.history && history.replaceState) history.replaceState(null, '', '#' + p.id);
  }

  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;
    modal.classList.remove('is-open');
    body.classList.remove('is-locked');
    setInert(false);

    if (window.history && history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    if (lastFocus && lastFocus !== body && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  // Open from a click anywhere on a card (the button is the keyboard route).
  grid.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.product') : null;
    if (card) openProduct(card.getAttribute('data-id'));
  });

  modal.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (!modalOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
    if (e.key !== 'Tab') return;

    // keep keyboard focus inside the window
    var f = $$('a[href], button:not([disabled])', modal).filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1], active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  });

  // Shareable links: /store#discord-setup opens that service.
  function openFromHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (id && byId.hasOwnProperty(id)) openProduct(id);
    else if (modalOpen) closeModal();
  }
  window.addEventListener('hashchange', openFromHash);
  if (location.hash.length > 1) {
    whenReady(function () { setTimeout(openFromHash, reduce ? 0 : 450); });
  }

  /* ---------- first paint ---------- */
  renderStatus(cards.length);
})();
