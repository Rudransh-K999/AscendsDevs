(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     LOADER
  --------------------------------------------------------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    setTimeout(function () {
      if (loader) loader.classList.add('is-hidden');
      document.body.classList.add('js-ready');
    }, reduceMotion ? 0 : 700);
  });
  // Fallback in case 'load' is slow to fire
  setTimeout(function () {
    document.body.classList.add('js-ready');
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('is-hidden');
  }, 2200);

  /* ---------------------------------------------------------
     NAV — scroll state + mobile toggle
  --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var navToggle = document.getElementById('navToggle');
  var mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.classList.toggle('is-open');
      mobileMenu.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navToggle.classList.remove('is-open');
        mobileMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  var cursor = document.getElementById('cursor');
  if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
    });
    (function raf() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(raf);
    })();
    var interactive = 'a, button, .service-row, .work-item, .accordion__trigger';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactive)) cursor.classList.add('is-active');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactive)) cursor.classList.remove('is-active');
    });
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var target = entry.target;
            var delay = 0;
            var group = target.closest('.service-list, .work-grid, .process-list, .principles__grid, .capabilities__list');
            if (group) {
              var siblings = Array.prototype.slice.call(group.children).filter(function(el){ return el.classList.contains('reveal'); });
              var idx = siblings.indexOf(target);
              delay = Math.max(0, idx) * 60;
            }
            setTimeout(function () {
              target.classList.add('is-visible');
            }, delay);
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------------------------------------------------
     ACCORDION (FAQ)
  --------------------------------------------------------- */
  var triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.accordion__item');
      var wasOpen = item.classList.contains('is-open');

      document.querySelectorAll('.accordion__item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        openItem.querySelector('.accordion__trigger').setAttribute('aria-expanded', 'false');
      });

      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------
     HERO CANVAS — fine animated lines / minimal particles
  --------------------------------------------------------- */
  var canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w, h, particles = [];
    var PARTICLE_COUNT = 46;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function init() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.4,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          o: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(143,233,220,' + p.o + ')';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    init();
    tick();
    window.addEventListener('resize', function () {
      resize(); init();
    });
  }

})();
