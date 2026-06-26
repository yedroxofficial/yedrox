/* ============================================
   YedRox — Professional Corporate Website
   script.js
   ============================================ */

(function () {
  'use strict';

  const intro = document.getElementById('intro');
  const introWord = document.getElementById('introWord');
  const introPercent = document.getElementById('introPercent');
  const introBarFill = document.getElementById('introBarFill');
  const introSkip = document.getElementById('introSkip');
  const showreelPlay = document.getElementById('showreelPlay');
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  const INTRO_WORDS = ['precision', 'reliability', 'innovation', 'performance', 'purpose'];
  const INTRO_KEY = 'yedrox-intro-seen';
  const INTRO_DURATION = 2000;

  let scrollTicking = false;
  let introDone = false;
  let introFrame = null;
  let introStart = 0;
  let lastWordIndex = -1;

  function finishIntro() {
    if (introDone) return;
    introDone = true;

    if (introFrame) {
      cancelAnimationFrame(introFrame);
      introFrame = null;
    }

    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch (e) { /* ignore */ }

    if (intro) {
      intro.classList.add('hidden');
    }

    document.body.classList.remove('intro-active');
    initHeroAnimations();
    initStatCounters();
  }

  function updateIntroWord(index) {
    if (!introWord) return;
    introWord.classList.add('fade');
    setTimeout(function () {
      introWord.textContent = INTRO_WORDS[index % INTRO_WORDS.length];
      introWord.classList.remove('fade');
    }, 200);
  }

  function runIntroProgress(timestamp) {
    if (!introStart) introStart = timestamp;
    var elapsed = timestamp - introStart;
    var progress = Math.min(100, Math.round((elapsed / INTRO_DURATION) * 100));

    if (introPercent) introPercent.textContent = progress + '%';
    if (introBarFill) introBarFill.style.width = progress + '%';

    var wordIndex = Math.min(INTRO_WORDS.length - 1, Math.floor((elapsed / INTRO_DURATION) * INTRO_WORDS.length));
    if (wordIndex !== lastWordIndex) {
      lastWordIndex = wordIndex;
      updateIntroWord(wordIndex);
    }

    if (elapsed >= INTRO_DURATION) {
      finishIntro();
      return;
    }

    introFrame = requestAnimationFrame(runIntroProgress);
  }

  function initIntro() {
    var skipIntro = false;

    try {
      skipIntro = sessionStorage.getItem(INTRO_KEY) === '1';
    } catch (e) { /* ignore */ }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      skipIntro = true;
    }

    if (!intro || skipIntro) {
      if (intro) intro.classList.add('hidden');
      initHeroAnimations();
      initStatCounters();
      return;
    }

    document.body.classList.add('intro-active');

    if (introSkip) {
      introSkip.addEventListener('click', finishIntro);
    }

    introFrame = requestAnimationFrame(runIntroProgress);
  }

  function initHeroAnimations() {
    document.querySelectorAll('.hero-content .reveal, .hero-scroll.reveal').forEach(function (el, index) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 80 + index * 80);
    });

    document.querySelectorAll('.hero-line, .hero-brand').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }

  function initPerformance() {
    var body = document.body;
    var reducedMotion = false;

    try {
      reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) { /* ignore */ }

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    var saveData = !!(conn && conn.saveData);
    var slowNet = !!(conn && (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g'));
    var lowMemory = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
    var lowCores = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4;
    var coarsePointer = false;

    try {
      coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    } catch (e) { /* ignore */ }

    var lite = saveData || slowNet || lowMemory || lowCores;

    if (reducedMotion) body.classList.add('perf-reduced-motion');
    if (lite) body.classList.add('perf-lite');
    if (coarsePointer) body.classList.add('perf-touch');

    window.YedRoxPerf = {
      reducedMotion: reducedMotion,
      lite: lite,
      touch: coarsePointer
    };
  }

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      var scrollPos = window.scrollY + 120;
      var sections = document.querySelectorAll('section[id]');

      sections.forEach(function (section) {
        var top = section.offsetTop;
        var height = section.offsetHeight;
        var id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });

      scrollTicking = false;
    });
  }

  function initNavbar() {
    if (!header) return;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initMobileMenu() {
    if (!navToggle || !navMenu) return;

    function setMenuOpen(isOpen) {
      navMenu.classList.toggle('open', isOpen);
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenuOpen(!navMenu.classList.contains('open'));
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (!navMenu.classList.contains('open')) return;
      if (navMenu.contains(e.target) || navToggle.contains(e.target)) return;
      setMenuOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
  }

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.08
    });

    revealElements.forEach(function (el) {
      if (!el.closest('.hero-content') && !el.classList.contains('hero-scroll')) {
        observer.observe(el);
      }
    });
  }

  function initScrollProgress() {
    var bar = document.getElementById('scrollProgress');
    if (!bar) return;

    var progressTicking = false;

    window.addEventListener('scroll', function () {
      if (progressTicking) return;
      progressTicking = true;

      requestAnimationFrame(function () {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docH > 0 ? (window.scrollY / docH) * 100 : 0;
        bar.style.width = pct + '%';
        progressTicking = false;
      });
    }, { passive: true });
  }

  function initStatCounters() {
    var stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;

    var animated = false;

    function runCounters() {
      if (animated) return;
      animated = true;

      stats.forEach(function (el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1400;
        var start = performance.now();

        function step(now) {
          var t = Math.min(1, (now - start) / duration);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
      });
    }

    if (!('IntersectionObserver' in window)) {
      runCounters();
      return;
    }

    var heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;

    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(heroStats);
  }

  function initShowreel() {
    if (!showreelPlay) return;

    showreelPlay.addEventListener('click', function () {
      var target = document.getElementById('showcase');
      if (!target) return;
      var headerOffset = (header && header.offsetHeight) || 72;
      var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          var headerOffset = (header && header.offsetHeight) || 72;
          var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });
  }

  function initPlayground() {
    var section = document.getElementById('playground');
    var canvas = document.getElementById('gameCanvas');
    if (!section || !canvas || !window.RoxLaunch) return;

    var started = false;

    function startGame() {
      if (started) {
        window.RoxLaunch.resume();
        return;
      }
      started = true;
      window.RoxLaunch.init(canvas);
    }

    if (!('IntersectionObserver' in window)) {
      startGame();
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          startGame();
        } else if (started) {
          window.RoxLaunch.pause();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  function initMarquee() {
    var marquee = document.querySelector('.marquee');
    var flow = document.querySelector('.marquee-flow');
    if (!flow) return;

    flow.style.animation = 'none';
    flow.style.willChange = 'transform';

    var offset = 0;
    var halfWidth = 0;
    var loopSeconds = 32;
    var lastTs = 0;
    var running = true;
    var rafId = null;

    function measure() {
      halfWidth = flow.scrollWidth / 2;
    }

    measure();
    window.addEventListener('resize', measure);

    function tick(ts) {
      rafId = requestAnimationFrame(tick);
      if (!running) return;

      if (!lastTs) lastTs = ts;
      var dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      if (halfWidth > 0) {
        offset += (halfWidth / loopSeconds) * dt;
        if (offset >= halfWidth) offset -= halfWidth;
        flow.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
      }
    }

    function setRunning(next) {
      running = next;
      if (running) lastTs = 0;
    }

    document.addEventListener('visibilitychange', function () {
      setRunning(!document.hidden);
    });

    if (marquee && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        var visible = entries.some(function (entry) { return entry.isIntersecting; });
        setRunning(visible && !document.hidden);
      }, { threshold: 0 });
      observer.observe(marquee);
    }

    rafId = requestAnimationFrame(tick);
  }

  function initPageVisibility() {
    document.addEventListener('visibilitychange', function () {
      if (!window.RoxLaunch) return;
      if (document.hidden) {
        window.RoxLaunch.pause();
      } else {
        var playground = document.getElementById('playground');
        if (!playground) return;
        var rect = playground.getBoundingClientRect();
        var inView = rect.bottom > 0 && rect.top < window.innerHeight;
        if (inView) window.RoxLaunch.resume();
      }
    });
  }

  function initShowcaseDrag() {
    var wrap = document.querySelector('.showcase-track-wrap');
    if (!wrap) return;

    var isCoarse = false;
    try {
      isCoarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    } catch (e) { /* ignore */ }

    if (isCoarse) {
      wrap.style.cursor = 'default';
      return;
    }

    var isDown = false;
    var startX = 0;
    var scrollLeft = 0;
    var activeId = null;

    function endDrag() {
      isDown = false;
      activeId = null;
      wrap.classList.remove('is-dragging');
    }

    wrap.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      isDown = true;
      activeId = e.pointerId;
      wrap.classList.add('is-dragging');
      startX = e.clientX;
      scrollLeft = wrap.scrollLeft;
      wrap.setPointerCapture(e.pointerId);
    });

    wrap.addEventListener('pointermove', function (e) {
      if (!isDown || e.pointerId !== activeId) return;
      e.preventDefault();
      wrap.scrollLeft = scrollLeft - (e.clientX - startX) * 1.2;
    });

    wrap.addEventListener('pointerup', endDrag);
    wrap.addEventListener('pointercancel', endDrag);
  }

  function init() {
    initPerformance();
    initIntro();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initMarquee();
    initPageVisibility();
    initShowreel();
    initSmoothScroll();
    initScrollProgress();
    initShowcaseDrag();
    initPlayground();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
