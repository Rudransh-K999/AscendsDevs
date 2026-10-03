/* =============================================================
   ASCENDDEVS — CONTACT CHANNELS
   Single source of truth for how people reach the team.

   Edit a channel here and it changes everywhere on the site
   (header, hero, mobile menu, contact section, FAQ, final CTA,
   footer, store).

   Load this file BEFORE main.js so the magnetic-button binding
   picks up the buttons rendered here.

   HTML hooks (each mount keeps its original Discord link inside
   as a no-JavaScript fallback, JS swaps it out):

     data-contact="menu"    "Let's Talk" style dropdown
                              data-label="Let's Talk"
                              data-trigger="nav__cta" | "btn btn--ghost" ...
                              data-align="end" | "center" | "start"
     data-contact="cards"   three contact cards
     data-contact="dock"    one pill split into three segments
     data-contact="list"    footer link list
     data-contact="mobile"  mobile-menu group
     data-contact="alt"     inline "or reach us on …" line
                              data-exclude="discord"   (optional)
     data-contact-link="id" turns an existing <a> into that channel's link
============================================================= */
(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. THE CHANNELS — add / reorder / edit here only
  ----------------------------------------------------------- */
  var CHANNELS = [
    {
      id: 'discord',
      label: 'Discord',
      note: 'Join our community',
      href: 'https://discord.gg/WDzhZU5xwJ',
      external: true
    },
    {
      id: 'instagram',
      label: 'Instagram',
      note: '@ascenddevs',
      href: 'https://instagram.com/ascenddevs',
      external: true
    },
    {
      id: 'email',
      label: 'Email',
      note: 'ascenddevs.business@gmail.com',
      href: 'mailto:ascenddevs.business@gmail.com',
      external: false
    }
  ];

  /* -----------------------------------------------------------
     2. ICONS — inline SVG, same 1.6 line weight as the rest of
        the site (Discord is the brand glyph, filled)
  ----------------------------------------------------------- */
  var ICONS = {
    discord:
      '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',
    instagram:
      '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25"/><circle cx="12" cy="12" r="4.1"/><path d="M17.4 6.6h.01" stroke-width="2.2"/></svg>',
    email:
      '<svg class="ci" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.75" y="4.75" width="18.5" height="14.5" rx="3"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>'
  };

  /* -----------------------------------------------------------
     3. SMALL HELPERS
  ----------------------------------------------------------- */
  function get(id) {
    for (var i = 0; i < CHANNELS.length; i++) if (CHANNELS[i].id === id) return CHANNELS[i];
    return null;
  }

  function attrs(c) {
    return 'href="' + c.href + '"' + (c.external ? ' target="_blank" rel="noopener"' : '');
  }

  // Screen-reader hint for links that leave the page.
  function sr(c) {
    return c.external ? '<span class="sr-only"> (opens in a new tab)</span>' : '';
  }

  function list(mount) {
    var skip = (mount.getAttribute('data-exclude') || '').split(/[\s,]+/);
    return CHANNELS.filter(function (c) { return skip.indexOf(c.id) === -1; });
  }

  var ARROW = '<span class="arrow" aria-hidden="true">↗</span>';

  /* -----------------------------------------------------------
     4. RENDERERS
  ----------------------------------------------------------- */

  // Dropdown: a trigger button + a small panel of the three channels.
  var menuCount = 0;
  function renderMenu(mount) {
    var label   = mount.getAttribute('data-label') || "Let's Talk";
    var trigCls = mount.getAttribute('data-trigger') || 'nav__cta';
    var align   = mount.getAttribute('data-align') || 'end';
    var isBtn   = /(^|\s)btn(\s|$)/.test(trigCls);
    var pid     = 'contactPanel' + (++menuCount);
    var text    = label + ' ' + ARROW;

    var items = list(mount).map(function (c) {
      return '<li><a class="contact-item" ' + attrs(c) + '>' +
        '<span class="contact-item__icon">' + ICONS[c.id] + '</span>' +
        '<span class="contact-item__body">' +
          '<span class="contact-item__label">' + c.label + sr(c) + '</span>' +
          '<span class="contact-item__note">' + c.note + '</span>' +
        '</span>' +
        ARROW +
      '</a></li>';
    }).join('');

    mount.classList.add('contact-menu', 'contact-menu--' + align);
    mount.innerHTML =
      '<button type="button" class="' + trigCls + '" data-magnet aria-haspopup="true" aria-expanded="false" aria-controls="' + pid + '">' +
        (isBtn ? '<span class="btn__fill"></span><span class="btn__label">' + text + '</span>' : text) +
      '</button>' +
      '<div class="contact-panel" id="' + pid + '" role="group" aria-label="Contact AscendDevs">' +
        '<p class="contact-panel__eyebrow">Reach the team</p>' +
        '<ul>' + items + '</ul>' +
      '</div>';
  }

  // Three cards — the main "Let's build something" section.
  function renderCards(mount) {
    mount.classList.add('contact-cards');
    mount.innerHTML = list(mount).map(function (c) {
      return '<li class="reveal"><a class="contact-card" ' + attrs(c) + '>' +
        '<span class="contact-card__icon">' + ICONS[c.id] + '</span>' +
        '<span class="contact-card__body">' +
          '<span class="contact-card__label">' + c.label + sr(c) + '</span>' +
          '<span class="contact-card__note">' + c.note + '</span>' +
        '</span>' +
        ARROW +
      '</a></li>';
    }).join('');
  }

  // One pill split into three segments — the final CTA.
  function renderDock(mount) {
    mount.classList.add('contact-dock');
    mount.setAttribute('role', 'group');
    mount.setAttribute('aria-label', 'Contact AscendDevs');
    mount.innerHTML = list(mount).map(function (c) {
      return '<a class="contact-dock__item" ' + attrs(c) + '>' +
        '<span class="contact-dock__fill"></span>' +
        '<span class="contact-dock__label">' + ICONS[c.id] + '<span>' + c.label + sr(c) + '</span></span>' +
      '</a>';
    }).join('');
  }

  // Footer column.
  function renderList(mount) {
    mount.classList.add('footer__contact');
    mount.innerHTML = list(mount).map(function (c) {
      return '<a class="footer__contact-link" data-magnet ' + attrs(c) + '>' +
        ICONS[c.id] + '<span>' + c.label + sr(c) + '</span>' + ARROW +
      '</a>';
    }).join('');
  }

  // Mobile menu: label + a row of chips.
  function renderMobile(mount) {
    mount.classList.add('mobile-menu__contact');
    mount.innerHTML =
      '<p class="mobile-menu__label">Contact</p>' +
      '<div class="mobile-menu__chips">' +
      list(mount).map(function (c) {
        return '<a ' + attrs(c) + '>' + ICONS[c.id] + '<span>' + c.label + sr(c) + '</span></a>';
      }).join('') +
      '</div>';
  }

  // Inline "Or reach us on Instagram · Email".
  function renderAlt(mount) {
    var lead = mount.getAttribute('data-lead') || 'Or reach us on';
    var links = list(mount).map(function (c) {
      return '<a ' + attrs(c) + '>' + ICONS[c.id] + '<span>' + c.label + sr(c) + '</span></a>';
    });
    mount.classList.add('contact-alt');
    mount.innerHTML = '<span class="contact-alt__lead">' + lead + '</span>' + links.join('');
  }

  // Existing <a data-contact-link="email"> inside FAQ copy etc.
  function wireLink(a) {
    var c = get(a.getAttribute('data-contact-link'));
    if (!c) return;
    a.setAttribute('href', c.href);
    if (c.external) { a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); }
    if (!a.textContent.trim()) a.textContent = c.id === 'email' || c.id === 'instagram' ? c.note : c.label;
    a.classList.add('contact-inline');
  }

  var RENDERERS = {
    menu: renderMenu, cards: renderCards, dock: renderDock,
    list: renderList, mobile: renderMobile, alt: renderAlt
  };

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-contact]'), function (mount) {
      var fn = RENDERERS[mount.getAttribute('data-contact')];
      if (fn) fn(mount);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-contact-link]'), wireLink);
  }

  /* -----------------------------------------------------------
     5. DROPDOWN BEHAVIOUR
        click toggles · outside click / Esc / Tab-away closes ·
        flips upward or nudges sideways if there isn't room
  ----------------------------------------------------------- */
  function bounds(el) {
    var top = 0, bottom = window.innerHeight;
    for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      var s = window.getComputedStyle(p);
      if (/(hidden|auto|scroll|clip)/.test(s.overflowX + s.overflowY)) {
        var r = p.getBoundingClientRect();
        top = Math.max(top, r.top);
        bottom = Math.min(bottom, r.bottom);
      }
    }
    return { top: top, bottom: bottom };
  }

  function place(menu) {
    var trig = menu.querySelector('button');
    var panel = menu.querySelector('.contact-panel');
    menu.classList.remove('is-up');
    panel.style.removeProperty('--cp-shift');

    var tr = trig.getBoundingClientRect();
    var need = panel.offsetHeight + 20;
    var b = bounds(menu);
    var below = b.bottom - tr.bottom;
    var above = tr.top - b.top;
    if (below < need && above > below) menu.classList.add('is-up');

    var pr = panel.getBoundingClientRect();
    var vw = document.documentElement.clientWidth, pad = 12, shift = 0;
    if (pr.left < pad) shift = pad - pr.left;
    else if (pr.right > vw - pad) shift = vw - pad - pr.right;
    if (shift) panel.style.setProperty('--cp-shift', Math.round(shift) + 'px');
  }

  // On small screens the hero's panel is laid out in the page flow (see CSS)
  // instead of floating, so it can't cover the headline or get clipped.
  function inFlow(menu) {
    var panel = menu.querySelector('.contact-panel');
    return window.getComputedStyle(panel).position === 'static';
  }

  function setOpen(menu, open) {
    var trig = menu.querySelector('button');
    var flow = inFlow(menu);
    if (open && !flow) place(menu);
    if (flow) {
      menu.classList.remove('is-up');
      menu.querySelector('.contact-panel').style.removeProperty('--cp-shift');
    }
    menu.classList.toggle('is-open', open);
    trig.setAttribute('aria-expanded', open ? 'true' : 'false');

    if (open && flow) {
      // once it has finished growing, bring the whole panel on screen
      // (scrollBy rather than scrollIntoView: the hero clips overflow)
      var panel = menu.querySelector('.contact-panel');
      var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        if (!menu.classList.contains('is-open')) return;
        var navH = parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
        var r = panel.getBoundingClientRect();
        var need = r.bottom + 20 - window.innerHeight;          // hanging below the fold
        var room = r.top - (navH + 8);                           // don't slide under the header
        var by = Math.min(need, room);
        if (by > 1) window.scrollBy({ top: by, behavior: calm ? 'auto' : 'smooth' });
      }, calm ? 0 : 560);
    }
  }

  function closeAll(except) {
    Array.prototype.forEach.call(document.querySelectorAll('.contact-menu.is-open'), function (m) {
      if (m !== except) setOpen(m, false);
    });
  }

  function bindMenus() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target : e.target.parentElement;
      var trig = t && t.closest('.contact-menu > button');
      if (trig) {
        var menu = trig.parentElement;
        var willOpen = !menu.classList.contains('is-open');
        closeAll(menu);
        setOpen(menu, willOpen);
        return;
      }
      var inside = t && t.closest('.contact-menu');
      if (inside) { if (t.closest('.contact-item')) setOpen(inside, false); return; }
      closeAll();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('.contact-menu.is-open');
      if (!open) return;
      setOpen(open, false);
      open.querySelector('button').focus();
    });

    document.addEventListener('focusout', function (e) {
      var menu = e.target.closest && e.target.closest('.contact-menu');
      if (menu && e.relatedTarget && !menu.contains(e.relatedTarget)) setOpen(menu, false);
    });

    // The header tucks away on scroll; don't leave its panel hanging.
    window.addEventListener('scroll', function () {
      var m = document.querySelector('.nav .contact-menu.is-open');
      if (m) setOpen(m, false);
    }, { passive: true });

    window.addEventListener('resize', function () { closeAll(); });
  }

  /* -----------------------------------------------------------
     6. PUBLIC API (store.js reads the Discord link from here)
  ----------------------------------------------------------- */
  window.AscendContact = {
    channels: CHANNELS,
    get: get,
    href: function (id) { var c = get(id); return c ? c.href : ''; }
  };

  init();
  bindMenus();
})();
