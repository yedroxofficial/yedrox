/* ============================================
   YedRox — Rox Launch Slingshot Game
   game-slingshot.js
   ============================================ */

window.RoxLaunch = (function () {
  'use strict';

  var Engine = Matter.Engine;
  var World = Matter.World;
  var Bodies = Matter.Bodies;
  var Body = Matter.Body;
  var Composite = Matter.Composite;
  var Events = Matter.Events;
  var Vector = Matter.Vector;

  var WORLD_W = 900;
  var WORLD_H = 500;
  var SLING_X = 130;
  var SLING_Y = 400;
  var PROJECTILE_R = 20;
  var MAX_PULL = 150;
  var LAUNCH_POWER = 0.21;
  var ROCKET_POWER_MULT = 2.1;
  var ROCKET_THRESHOLD = 0.88;
  var GROUND_H = 44;
  var GROUND_Y = WORLD_H - GROUND_H;

  /* Level coords: blocks sit ON ground / ON each other — no overlaps */
  var LEVELS = [
    {
      shots: 3,
      blocks: [
        { x: 550, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 590, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 570, y: 360, w: 70, h: 22, type: 'wood' },
        { x: 710, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 750, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 730, y: 360, w: 70, h: 22, type: 'wood' }
      ],
      targets: [
        { x: 570, y: 349, r: 22 },
        { x: 730, y: 349, r: 22 }
      ]
    },
    {
      shots: 4,
      blocks: [
        { x: 560, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 660, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 760, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 660, y: 360, w: 220, h: 22, type: 'wood' },
        { x: 660, y: 306.5, w: 22, h: 85, type: 'stone' },
        { x: 660, y: 253, w: 90, h: 22, type: 'stone' }
      ],
      targets: [
        { x: 560, y: 349, r: 22 },
        { x: 760, y: 349, r: 22 },
        { x: 660, y: 231, r: 24 }
      ]
    },
    {
      shots: 5,
      blocks: [
        { x: 520, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 560, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 540, y: 360, w: 70, h: 22, type: 'wood' },
        { x: 540, y: 306.5, w: 22, h: 85, type: 'stone' },
        { x: 540, y: 253, w: 70, h: 22, type: 'stone' },
        { x: 720, y: 413.5, w: 22, h: 85, type: 'wood' },
        { x: 760, y: 413.5, w: 22, h: 85, type: 'wood' },
        { x: 740, y: 360, w: 70, h: 22, type: 'wood' },
        { x: 620, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 660, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 640, y: 360, w: 70, h: 22, type: 'stone' }
      ],
      targets: [
        { x: 520, y: 349, r: 20 },
        { x: 740, y: 349, r: 20 },
        { x: 640, y: 325, r: 24 }
      ]
    },
    {
      shots: 5,
      blocks: [
        { x: 490, y: 430, w: 22, h: 50, type: 'wood' },
        { x: 515, y: 422, w: 22, h: 65, type: 'wood' },
        { x: 660, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 720, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 690, y: 360, w: 110, h: 22, type: 'stone' },
        { x: 690, y: 306.5, w: 22, h: 85, type: 'stone' },
        { x: 690, y: 253, w: 90, h: 22, type: 'stone' },
        { x: 640, y: 413.5, w: 22, h: 85, type: 'wood' }
      ],
      targets: [
        { x: 700, y: 231, r: 24 }
      ]
    },
    {
      shots: 6,
      blocks: [
        { x: 530, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 570, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 550, y: 360, w: 70, h: 22, type: 'wood' },
        { x: 550, y: 306.5, w: 22, h: 85, type: 'stone' },
        { x: 550, y: 253, w: 70, h: 22, type: 'stone' },
        { x: 710, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 750, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 730, y: 360, w: 70, h: 22, type: 'wood' },
        { x: 730, y: 306.5, w: 22, h: 85, type: 'stone' },
        { x: 730, y: 253, w: 70, h: 22, type: 'stone' },
        { x: 620, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 660, y: 413.5, w: 22, h: 85, type: 'stone' },
        { x: 640, y: 360, w: 50, h: 22, type: 'stone' }
      ],
      targets: [
        { x: 530, y: 349, r: 20 },
        { x: 570, y: 231, r: 20 },
        { x: 710, y: 349, r: 20 },
        { x: 750, y: 231, r: 20 }
      ]
    }
  ];

  var COLORS = {
    skyTop: '#1a1030',
    skyMid: '#2d1b4e',
    skyBottom: '#4a2c6a',
    hillFar: '#1e1228',
    hillNear: '#261530',
    grass: '#2d4a28',
    grassLight: '#3d6b35',
    ground: '#1a1a22',
    groundLine: '#3d6b35',
    wood: '#C4956A',
    woodMid: '#A67C52',
    woodDark: '#6B4423',
    stone: '#9CA3AF',
    stoneMid: '#6B7280',
    stoneDark: '#374151',
    target: '#4B5563',
    targetBelly: '#6B7280',
    targetAccent: '#DC2626',
    projectile: '#DC2626',
    projectileDark: '#991B1B',
    projectileGlow: 'rgba(220, 38, 38, 0.6)',
    slingshot: '#6D4C41',
    slingshotDark: '#4E342E',
    band: '#5D4037',
    sun: 'rgba(255, 200, 100, 0.15)'
  };

  var canvas = null;
  var ctx = null;
  var engine = null;
  var ground = null;
  var walls = [];
  var levelBodies = [];
  var targets = [];
  var projectile = null;
  var trail = [];

  var currentLevel = 0;
  var shotsLeft = 0;
  var totalScore = 0;
  var combo = 0;

  var isDragging = false;
  var dragPoint = { x: SLING_X, y: SLING_Y };
  var canShoot = true;
  var isFlying = false;
  var isSettling = false;
  var fearTremble = 0;
  var fearFleeTriggered = false;
  var activePointerId = null;
  var lastProjectilePos = null;
  var gamePaused = false;
  var gameOver = false;
  var levelWon = false;
  var animFrame = null;
  var scale = 1;
  var scaleX = 1;
  var scaleY = 1;
  var resizeObserver = null;
  var resizeCanvasRaf = null;
  var onOrientationChange = null;
  var lastCanvasLayout = { w: 0, h: 0, bw: 0, bh: 0 };
  var dpr = 1;
  var FIXED_DELTA = 1000 / 60;

  var particles = [];
  var floatTexts = [];
  var screenShake = 0;
  var isRocketShot = false;
  var rocketImpactTriggered = false;
  var rocketFlames = [];
  var shards = [];
  var debris = [];
  var isShattered = false;
  var projectileShattered = false;
  var winDelayTimer = null;
  var siteShakeTimer = null;
  var WIN_CELEBRATION_DELAY = 3200;

  var hud = {};

  function getBlockProps(type) {
    if (type === 'stone') {
      return { density: 0.003, friction: 0.55, restitution: 0.15, breakThreshold: 10 };
    }
    return { density: 0.0018, friction: 0.45, restitution: 0.25, breakThreshold: 7 };
  }

  function screenToWorld(x, y) {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return { x: (x - rect.left) / scaleX, y: (y - rect.top) / scaleY };
    }
    return {
      x: ((x - rect.left) / rect.width) * WORLD_W,
      y: ((y - rect.top) / rect.height) * WORLD_H
    };
  }

  function getPullRatio() {
    return Math.min(1, getPullVector().len / MAX_PULL);
  }

  function getFearLevel() {
    if (!isDragging || !canShoot) return 0;
    return getPullRatio();
  }

  function fearFleeTargets() {
    if (!isDragging || fearFleeTriggered) return;
    fearFleeTriggered = true;

    targets.forEach(function (t) {
      if (t.destroyed || t.fled) return;

      var body = t.body;
      t.fled = true;
      body.fled = true;
      body.panicTimer = 0;
      wakeBody(body);
      body.frictionAir = 0.018;

      var angle = Math.random() * Math.PI * 2;
      var speed = 9 + Math.random() * 7;
      Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 5
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 1.1);

      spawnFloatText(body.position.x, body.position.y - ((body.targetRadius || 20) + 18), 'AHHH!', '#FDE047');
      spawnParticles(body.position.x, body.position.y, COLORS.targetAccent, 14);
      spawnParticles(body.position.x, body.position.y - 6, '#FFFFFF', 6);
    });
  }

  function checkTargetFearFlee() {
    if (!isDragging || fearFleeTriggered) return;
    if (getPullRatio() >= 0.995) fearFleeTargets();
  }

  function updateFleeingTargets() {
    targets.forEach(function (t) {
      if (!t.fled || t.destroyed || !t.body) return;

      var body = t.body;
      var r = body.targetRadius || 20;
      var pos = body.position;
      var margin = r + 10;

      body.panicTimer = (body.panicTimer || 0) - 1;
      if (body.panicTimer <= 0) {
        body.panicTimer = 6 + Math.floor(Math.random() * 16);
        var panicAngle = Math.random() * Math.PI * 2;
        var panicSpeed = 5 + Math.random() * 9;
        body.panicTargetVx = Math.cos(panicAngle) * panicSpeed;
        body.panicTargetVy = Math.sin(panicAngle) * panicSpeed;
      }

      var vx = body.velocity.x * 0.9 + (body.panicTargetVx || 0) * 0.1;
      var vy = body.velocity.y * 0.9 + (body.panicTargetVy || 0) * 0.1;
      vx += (Math.random() - 0.5) * 3.2;
      vy += (Math.random() - 0.5) * 3.2;

      if (pos.x < margin) vx = Math.abs(vx) + 3 + Math.random() * 2;
      if (pos.x > WORLD_W - margin) vx = -Math.abs(vx) - 3 - Math.random() * 2;
      if (pos.y < margin + 50) vy = Math.abs(vy) + 2 + Math.random() * 2;
      if (pos.y > GROUND_Y - r - 6) vy = -Math.abs(vy) - 4 - Math.random() * 2;

      var maxSpeed = 16;
      var speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > maxSpeed) {
        vx = (vx / speed) * maxSpeed;
        vy = (vy / speed) * maxSpeed;
      }

      Body.setVelocity(body, { x: vx, y: vy });
      Body.setAngularVelocity(body, body.angularVelocity * 0.88 + (Math.random() - 0.5) * 0.45);

      if (Math.random() < 0.08) {
        spawnParticles(pos.x, pos.y - r * 0.3, 'rgba(147, 197, 253, 0.7)', 2);
      }
    });
  }

  function clampPull(dx, dy) {
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len > MAX_PULL) {
      var ratio = MAX_PULL / len;
      return { x: dx * ratio, y: dy * ratio, len: MAX_PULL };
    }
    return { x: dx, y: dy, len: len };
  }

  function getPullVector() {
    var dx = SLING_X - dragPoint.x;
    var dy = SLING_Y - dragPoint.y;
    return clampPull(dx, dy);
  }

  function hasShotsRemaining() {
    return shotsLeft > 0;
  }

  function updateHud() {
    if (hud.score) hud.score.textContent = String(totalScore);
    if (hud.level) hud.level.textContent = String(currentLevel + 1);
    if (hud.shots) hud.shots.textContent = String(Math.max(0, shotsLeft));
    if (hud.next) hud.next.hidden = !levelWon;
    if (hud.powerWrap) {
      hud.powerWrap.classList.toggle('is-active', isDragging);
      if (isDragging && hud.powerBar) {
        var pull = getPullVector();
        var pct = Math.round((pull.len / MAX_PULL) * 100);
        hud.powerBar.style.width = pct + '%';
        var isRocket = pull.len / MAX_PULL >= ROCKET_THRESHOLD;
        var fear = getFearLevel();
        hud.powerBar.classList.toggle('rocket-ready', isRocket);
        if (hud.powerLabel) {
          if (fear >= 0.995) {
            hud.powerLabel.textContent = '100% — suspect panics!';
          } else if (isRocket) {
            hud.powerLabel.textContent = pct + '% ROCKET!';
          } else if (fear >= 0.55) {
            hud.powerLabel.textContent = pct + '% — suspect scared!';
          } else {
            hud.powerLabel.textContent = pct + '%';
          }
        }
      }
    }
  }

  function showModal(title, text, showNext, onAction, onRetry) {
    if (!hud.modal) return;
    hud.modalTitle.textContent = title;
    hud.modalText.textContent = text;
    hud.modal.hidden = false;
    hud.modalAction.textContent = showNext ? 'Next Level' : 'Try Again';
    hud.modalAction.onclick = onAction;
    hud.modalRetry.onclick = onRetry || onAction;
    hud.modalRetry.hidden = showNext;
  }

  function hideModal() {
    if (hud.modal) hud.modal.hidden = true;
  }

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < count; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
        size: 3 + Math.random() * 5,
        color: color
      });
    }
  }

  function spawnFloatText(x, y, text, color) {
    floatTexts.push({ x: x, y: y, text: text, color: color || '#fff', life: 1, vy: -1.2 });
  }

  function spawnImpactBurst(x, y, impact, rocket) {
    var scale = Math.min(2.5, 0.8 + (impact || 5) * 0.15);
    var count = Math.floor((rocket ? 40 : 24) * scale);
    spawnParticles(x, y, '#ffffff', Math.floor(count * 0.35));
    spawnParticles(x, y, rocket ? '#F97316' : COLORS.projectile, Math.floor(count * 0.35));
    spawnParticles(x, y, rocket ? '#FDE047' : '#FCA5A5', Math.floor(count * 0.3));
    if (rocket) spawnParticles(x, y, COLORS.projectileDark, Math.floor(count * 0.2));
    screenShake = Math.max(screenShake, rocket ? 20 : Math.min(14, (impact || 5) * 1.2));
  }

  function spawnBlockDebris(body, impact) {
    var w = body.blockW || 20;
    var h = body.blockH || 20;
    var type = body.blockType || 'wood';
    var count = 5 + Math.floor(Math.random() * 4);
    var pos = body.position;

    for (var i = 0; i < count; i++) {
      var dw = Math.max(6, w * (0.18 + Math.random() * 0.28));
      var dh = Math.max(6, h * (0.18 + Math.random() * 0.28));
      var ox = (Math.random() - 0.5) * w * 0.8;
      var oy = (Math.random() - 0.5) * h * 0.8;

      var piece = Bodies.rectangle(pos.x + ox, pos.y + oy, dw, dh, {
        label: 'debris',
        density: 0.001,
        friction: 0.35,
        restitution: 0.2,
        frictionAir: 0.018
      });
      piece.blockType = type;
      piece.blockW = dw;
      piece.blockH = dh;
      piece.ttl = 100 + Math.floor(Math.random() * 80);

      var angle = Math.random() * Math.PI * 2;
      var force = 3 + Math.random() * 5 + (impact || 5) * 0.35;
      Body.setVelocity(piece, {
        x: Math.cos(angle) * force,
        y: Math.sin(angle) * force - 4
      });
      Body.setAngularVelocity(piece, (Math.random() - 0.5) * 0.5);

      debris.push(piece);
      World.add(engine.world, piece);
    }
  }

  function clearDebris() {
    debris.forEach(function (d) {
      World.remove(engine.world, d);
    });
    debris = [];
  }

  function clearWinTimer() {
    if (winDelayTimer) {
      clearTimeout(winDelayTimer);
      winDelayTimer = null;
    }
  }

  function allTargetsDestroyed() {
    return targets.every(function (t) { return t.destroyed; });
  }

  function scheduleLevelComplete() {
    if (!allTargetsDestroyed() || levelWon || gameOver) return;
    clearWinTimer();
    winDelayTimer = setTimeout(function () {
      winDelayTimer = null;
      showLevelComplete();
    }, WIN_CELEBRATION_DELAY);
  }

  function showLevelComplete() {
    if (levelWon || gameOver || !allTargetsDestroyed()) return;

    levelWon = true;
    var bonus = shotsLeft * 150;
    totalScore += bonus;
    combo = 0;
    updateHud();
    var isLast = currentLevel >= LEVELS.length - 1;
    showModal(
      isLast ? 'You Win!' : 'Level Complete!',
      isLast
        ? 'All targets destroyed! Final score: ' + totalScore
        : 'Great shot! Bonus +' + bonus + ' for remaining shots.',
      !isLast,
      function () {
        hideModal();
        if (!isLast) {
          currentLevel++;
          buildLevel(currentLevel);
        }
      },
      function () {
        hideModal();
        buildLevel(currentLevel);
      }
    );
  }

  function checkGameOver() {
    if (gameOver || levelWon) return;
    if (!canShoot && !isFlying && !isSettling && !isShattered && shotsLeft <= 0) {
      if (!allTargetsDestroyed()) {
        gameOver = true;
        combo = 0;
        showModal(
          'Out of Shots',
          'Pull back further for more power! Try aiming higher.',
          false,
          function () {
            hideModal();
            buildLevel(currentLevel);
          }
        );
      }
    }
  }

  function clearSiteShake() {
    if (siteShakeTimer) {
      clearTimeout(siteShakeTimer);
      siteShakeTimer = null;
    }
    document.body.classList.remove('site-shake');
  }

  function shatterPageTypography() {
    if (document.body.classList.contains('site-shattered')) return;
    document.body.classList.add('site-shattered', 'site-destroying');

    var cx = window.innerWidth * 0.5;
    var cy = window.innerHeight * 0.45;
    var maxDist = Math.sqrt(cx * cx + cy * cy) || 1;
    var globalIndex = 0;

    var skipTags = { SCRIPT: 1, STYLE: 1, CANVAS: 1, SVG: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1 };
    var skipSelectors = '#screenCracks, #gameCanvas, .playground-modal, .letter-shard';

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || skipTags[parent.tagName]) return NodeFilter.FILTER_REJECT;
        if (parent.closest(skipSelectors)) return NodeFilter.FILTER_REJECT;
        if (parent.classList && parent.classList.contains('letter-shard')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.textContent;
      var frag = document.createDocumentFragment();
      var parent = node.parentElement;
      var rect = parent.getBoundingClientRect();
      var px = rect.left + rect.width * 0.5;
      var py = rect.top + rect.height * 0.5;
      var dist = Math.sqrt((px - cx) * (px - cx) + (py - cy) * (py - cy));

      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === ' ' || ch === '\n' || ch === '\t') {
          frag.appendChild(document.createTextNode(ch === ' ' ? ' ' : ''));
          continue;
        }

        var span = document.createElement('span');
        span.className = 'letter-shard';
        span.textContent = ch;

        var rot = (Math.random() - 0.5) * 38;
        var tx = (Math.random() - 0.5) * 18;
        var ty = (Math.random() - 0.5) * 22;
        var sc = 0.88 + Math.random() * 0.28;
        var op = 0.42 + Math.random() * 0.52;
        var waveDelay = (dist / maxDist) * 2.1 + globalIndex * 0.006;
        globalIndex++;

        span.style.setProperty('--shard-r', rot.toFixed(1) + 'deg');
        span.style.setProperty('--shard-x', tx.toFixed(1) + 'px');
        span.style.setProperty('--shard-y', ty.toFixed(1) + 'px');
        span.style.setProperty('--shard-s', sc.toFixed(2));
        span.style.setProperty('--shard-o', op.toFixed(2));
        span.style.setProperty('--shard-d', waveDelay.toFixed(3) + 's');

        if (Math.random() > 0.7) span.classList.add('letter-shard--broken');
        if (Math.random() > 0.85) span.classList.add('letter-shard--fallen');

        frag.appendChild(span);
      }

      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    });

    setTimeout(function () {
      document.body.classList.remove('site-destroying');
    }, 3200);
  }

  function ensureCracksPortal() {
    var cracks = document.getElementById('screenCracks');
    if (cracks && cracks.parentElement !== document.documentElement) {
      document.documentElement.appendChild(cracks);
    }
    return cracks;
  }

  function resetCrackPathStyles() {
    var svg = document.querySelector('#screenCracks .screen-crack-glass');
    if (!svg) return;
    svg.querySelectorAll('.crack-layer path').forEach(function (path) {
      path.style.strokeDasharray = '';
      path.style.strokeDashoffset = '';
      path.style.opacity = '';
    });
  }

  function activateScreenCracks() {
    var cracks = ensureCracksPortal();
    if (!cracks || cracks.classList.contains('active')) return;

    cracks.hidden = false;
    cracks.classList.remove('screen-cracks--waapi', 'screen-cracks--css');
    resetCrackPathStyles();

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        cracks.classList.add('active');
        if (isTouchDevice()) {
          cracks.classList.add('screen-cracks--css');
        } else {
          cracks.classList.add('screen-cracks--waapi');
          animateCrackPaths();
        }
      });
    });
  }

  function animateCrackPaths() {
    var svg = document.querySelector('#screenCracks .screen-crack-glass');
    if (!svg) return;

    var paths = svg.querySelectorAll('.crack-layer path');
    var center = { x: 500, y: 500 };
    var easing = 'cubic-bezier(0.22, 0.03, 0.12, 1)';

    paths.forEach(function (path, index) {
      var len = path.getTotalLength();
      if (!len) return;

      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);

      var sampleLen = Math.min(len * 0.1, 30);
      var sample = path.getPointAtLength(sampleLen);
      var dx = sample.x - center.x;
      var dy = sample.y - center.y;
      var angle = Math.atan2(dy, dx);
      var wave = (angle + Math.PI) / (2 * Math.PI);
      var dist = Math.sqrt(dx * dx + dy * dy) / 500;

      var tier = path.getAttribute('data-tier');
      var isBranch = path.classList.contains('crack-branch');
      var isHair = path.classList.contains('crack-hair');
      var isHighlight = path.classList.contains('crack-highlight');
      var isShadow = path.closest('.crack-layer--shadow');

      var delay = wave * 0.42 + dist * 0.18 + (index % 7) * 0.018;
      var duration = 2000 + len * 0.65;

      if (tier === '2') delay += 0.22;
      if (isBranch) {
        delay += 0.72 + dist * 0.25;
        duration = 1100 + len * 0.45;
      }
      if (isHair) {
        delay += 1.05 + dist * 0.3;
        duration = 750 + len * 0.35;
      }
      if (isHighlight) {
        delay += 0.08;
        duration = 1600 + len * 0.5;
      }
      if (isShadow) delay += 0.04;

      path.animate([
        { strokeDashoffset: len, opacity: 0 },
        { strokeDashoffset: len * 0.96, opacity: 0.12, offset: 0.05 },
        { strokeDashoffset: len * 0.35, opacity: 0.75, offset: 0.5 },
        { strokeDashoffset: 0, opacity: 1 }
      ], {
        duration: duration,
        delay: delay * 1000,
        fill: 'forwards',
        easing: easing
      });
    });
  }

  function triggerRocketImpactEffects(x, y) {
    if (rocketImpactTriggered) return;
    rocketImpactTriggered = true;

    screenShake = 24;
    spawnImpactBurst(x, y, 14, true);

    var cracks = ensureCracksPortal();
    if (cracks && !cracks.classList.contains('active')) {
      activateScreenCracks();
    }

    clearSiteShake();
    requestAnimationFrame(function () {
      document.body.classList.add('site-shake');
    });
    siteShakeTimer = setTimeout(function () {
      document.body.classList.remove('site-shake');
      siteShakeTimer = null;
    }, 5000);

    setTimeout(function () {
      shatterPageTypography();
    }, 420);
  }

  function clearShards() {
    shards.forEach(function (s) {
      World.remove(engine.world, s);
    });
    shards = [];
  }

  function shatterProjectile(x, y, vel) {
    if (projectileShattered || !isRocketShot) return;
    projectileShattered = true;

    var v = vel || { x: 0, y: 0 };
    var labels = ['Y', 'e', 'd', 'R', 'o', 'x'];
    var pieceCount = 14;

    for (var i = 0; i < pieceCount; i++) {
      var angle = (Math.PI * 2 * i) / pieceCount + (Math.random() - 0.5) * 0.6;
      var offset = Math.random() * 7;
      var sx = x + Math.cos(angle) * offset;
      var sy = y + Math.sin(angle) * offset;
      var size = 5 + Math.random() * 8;
      var sides = 3 + Math.floor(Math.random() * 3);

      var shard = Bodies.polygon(sx, sy, sides, size, {
        label: 'shard',
        density: 0.001,
        friction: 0.3,
        restitution: 0.2,
        frictionAir: 0.012
      });

      shard.shardText = i < labels.length ? labels[i] : null;
      shard.shardColor = Math.random() > 0.4 ? COLORS.projectile : COLORS.projectileDark;
      shard.ttl = 120 + Math.floor(Math.random() * 60);

      var burst = 5 + Math.random() * 7 + (isRocketShot ? 12 : 0);
      Body.setVelocity(shard, {
        x: v.x * 0.2 + Math.cos(angle) * burst,
        y: v.y * 0.2 + Math.sin(angle) * burst
      });
      Body.setAngularVelocity(shard, (Math.random() - 0.5) * 0.7);

      shards.push(shard);
      World.add(engine.world, shard);
    }

    if (isRocketShot) {
      triggerRocketImpactEffects(x, y);
    }

    if (projectile) {
      World.remove(engine.world, projectile);
      projectile = null;
    }

    isFlying = false;
    isShattered = true;
    trail = [];
    rocketFlames = [];

    setTimeout(function () {
      finishShatterSettle();
    }, 1800);
  }

  function finishShatterSettle() {
    clearShards();
    isShattered = false;
    projectileShattered = false;
    isRocketShot = false;
    rocketImpactTriggered = false;
    isSettling = true;
    setTimeout(function () {
      isSettling = false;
      if (!allTargetsDestroyed() && hasShotsRemaining()) {
        createProjectile();
      } else {
        canShoot = false;
      }
      if (allTargetsDestroyed()) {
        scheduleLevelComplete();
      } else {
        checkGameOver();
      }
    }, 400);
  }

  function spawnRocketFlame(x, y) {
    rocketFlames.push({
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 1,
      size: 6 + Math.random() * 8,
      color: Math.random() > 0.5 ? '#F97316' : '#FDE047'
    });
  }

  function clearLevelBodies() {
    clearShards();
    clearDebris();
    clearWinTimer();
    clearSiteShake();
    levelBodies.forEach(function (body) {
      World.remove(engine.world, body);
    });
    targets.forEach(function (t) {
      World.remove(engine.world, t.body);
    });
    levelBodies = [];
    targets = [];
  }

  function removeProjectile() {
    if (projectile) {
      World.remove(engine.world, projectile);
      projectile = null;
    }
    clearShards();
    trail = [];
    rocketFlames = [];
    isFlying = false;
    isSettling = false;
    isShattered = false;
    isRocketShot = false;
    projectileShattered = false;
    rocketImpactTriggered = false;
    fearFleeTriggered = false;
    activePointerId = null;
    lastProjectilePos = null;
  }

  function createProjectile() {
    removeProjectile();
    if (!hasShotsRemaining() || gameOver || levelWon) {
      canShoot = false;
      checkGameOver();
      updateHud();
      return;
    }
    projectile = Bodies.circle(SLING_X, SLING_Y, PROJECTILE_R, {
      label: 'projectile',
      density: 0.002,
      friction: 0.2,
      frictionAir: 0.012,
      restitution: 0.45
    });
    Body.setStatic(projectile, true);
    World.add(engine.world, projectile);
    dragPoint = { x: SLING_X, y: SLING_Y };
    canShoot = true;
    isDragging = false;
    activePointerId = null;
    updateHud();
  }

  function makeStatic(body) {
    Body.setStatic(body, true);
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
  }

  function wakeBody(body) {
    if (!body || body.destroyed || !body.isStatic) return;
    Body.setStatic(body, false);
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
  }

  function horizontalOverlap(ax, aHalfW, bx, bHalfW) {
    return (ax + aHalfW) > (bx - bHalfW) && (ax - aHalfW) < (bx + bHalfW);
  }

  function blockHasSupport(block) {
    if (!block || block.destroyed) return true;

    var bw = (block.blockW || 20) / 2;
    var bh = (block.blockH || 20) / 2;
    var bottom = block.position.y + bh;
    var margin = 12;

    if (bottom >= GROUND_Y - margin) return true;

    for (var i = 0; i < levelBodies.length; i++) {
      var other = levelBodies[i];
      if (other === block || other.destroyed) continue;
      if (other.position.y <= block.position.y) continue;

      var obh = (other.blockH || 20) / 2;
      var obw = (other.blockW || 20) / 2;
      var otherTop = other.position.y - obh;

      if (!horizontalOverlap(block.position.x, bw, other.position.x, obw)) continue;
      if (Math.abs(otherTop - bottom) <= margin) return true;
    }

    return false;
  }

  function targetHasSupport(body) {
    if (!body || body.destroyed) return true;

    var r = body.targetRadius || 20;
    var bottom = body.position.y + r * 0.95;
    var margin = 14;

    if (bottom >= GROUND_Y - margin) return true;

    for (var i = 0; i < levelBodies.length; i++) {
      var block = levelBodies[i];
      if (block.destroyed) continue;

      var obh = (block.blockH || 20) / 2;
      var obw = (block.blockW || 20) / 2;
      var blockTop = block.position.y - obh;

      if (!horizontalOverlap(body.position.x, r * 0.9, block.position.x, obw)) continue;
      if (Math.abs(blockTop - bottom) <= margin) return true;
    }

    return false;
  }

  function checkUnsupportedStructures() {
    var pass;
    for (pass = 0; pass < 4; pass++) {
      var wokeAny = false;

      levelBodies.forEach(function (block) {
        if (!block.destroyed && block.isStatic && !blockHasSupport(block)) {
          wakeBody(block);
          wokeAny = true;
        }
      });

      targets.forEach(function (t) {
        if (t.destroyed || t.fled || !t.body || !t.body.isStatic) return;
        if (!targetHasSupport(t.body)) {
          wakeBody(t.body);
          wokeAny = true;
        }
      });

      if (!wokeAny) break;
    }
  }

  function wakeNearby(hitBody, radius) {
    radius = radius || 100;
    var pos = hitBody.position;
    levelBodies.forEach(function (b) {
      if (!b.destroyed && b.isStatic) {
        if (Vector.magnitude(Vector.sub(b.position, pos)) <= radius) wakeBody(b);
      }
    });
  }

  function wakeFromProjectileHit(hitBody) {
    wakeBody(hitBody);
    wakeNearby(hitBody, 110);
  }

  function buildLevel(index) {
    clearLevelBodies();
    removeProjectile();
    particles = [];
    floatTexts = [];
    combo = 0;
    isDragging = false;
    isRocketShot = false;
    projectileShattered = false;
    rocketImpactTriggered = false;
    fearFleeTriggered = false;
    fearTremble = 0;
    activePointerId = null;
    rocketFlames = [];
    isShattered = false;

    var level = LEVELS[index];
    if (!level) return;

    shotsLeft = level.shots;
    gameOver = false;
    levelWon = false;
    hideModal();

    level.blocks.forEach(function (b) {
      var props = getBlockProps(b.type);
      var body = Bodies.rectangle(b.x, b.y, b.w, b.h, {
        density: props.density,
        friction: props.friction,
        restitution: props.restitution,
        label: 'block'
      });
      body.blockType = b.type;
      body.blockW = b.w;
      body.blockH = b.h;
      body.breakThreshold = props.breakThreshold;
      body.hp = b.type === 'stone' ? 2 : 1;
      body.destroyed = false;
      makeStatic(body);
      levelBodies.push(body);
      World.add(engine.world, body);
    });

    level.targets.forEach(function (t) {
      var body = Bodies.circle(t.x, t.y, t.r, {
        label: 'target',
        density: 0.001,
        friction: 0.4,
        restitution: 0.2,
        isTarget: true
      });
      body.isTarget = true;
      body.targetRadius = t.r;
      body.destroyed = false;
      makeStatic(body);
      targets.push({ body: body, radius: t.r, destroyed: false, fled: false });
      World.add(engine.world, body);
    });

    createProjectile();
    updateHud();
  }

  function checkWinLose() {
    if (allTargetsDestroyed()) {
      scheduleLevelComplete();
    } else {
      checkGameOver();
    }
  }

  function onTargetDestroyed(targetEntry, x, y, impact) {
    if (targetEntry.destroyed) return;
    targetEntry.destroyed = true;
    targetEntry.body.destroyed = true;
    combo++;
    var pts = 500 + combo * 100;
    totalScore += pts;
    var px = x || targetEntry.body.position.x;
    var py = y || targetEntry.body.position.y;

    wakeBody(targetEntry.body);
    Body.setVelocity(targetEntry.body, {
      x: (Math.random() - 0.5) * 10,
      y: -6 - Math.random() * 4
    });
    Body.setAngularVelocity(targetEntry.body, (Math.random() - 0.5) * 0.6);

    spawnImpactBurst(px, py, impact || 10, isRocketShot);
    spawnParticles(px, py, COLORS.targetAccent, 28);
    spawnFloatText(px, py - 20, '+' + pts, '#FBBF24');
    updateHud();

    setTimeout(function () {
      if (targetEntry.body && engine) World.remove(engine.world, targetEntry.body);
    }, 1800);

    scheduleLevelComplete();
  }

  function canDestroyBlocks(hitter) {
    if (hitter && hitter.label === 'shard') return true;
    return isRocketShot;
  }

  function breakBlock(body, impact, hitter) {
    if (!body || body.destroyed || body.label !== 'block') return;
    if (!canDestroyBlocks(hitter)) return;

    var px = body.position.x;
    var py = body.position.y;
    spawnImpactBurst(px, py, impact, true);
    body.hp = (body.hp || 1) - 1;
    spawnParticles(px, py, body.blockType === 'stone' ? COLORS.stone : COLORS.wood, 14);

    if (body.hp <= 0 || impact > body.breakThreshold) {
      body.destroyed = true;
      spawnBlockDebris(body, impact);
      spawnParticles(px, py, body.blockType === 'stone' ? COLORS.stoneDark : COLORS.woodDark, 22);
      totalScore += body.blockType === 'stone' ? 75 : 50;
      spawnFloatText(px, py - 15, '+' + (body.blockType === 'stone' ? 75 : 50), '#A3E635');
      World.remove(engine.world, body);
      levelBodies = levelBodies.filter(function (b) { return b !== body; });
      screenShake = Math.max(screenShake, 8);
      updateHud();
      checkUnsupportedStructures();
    }
  }

  function settleCheck() {
    if (isShattered || projectileShattered) return;
    if (!isFlying || !projectile) return;
    var speed = Vector.magnitude(projectile.velocity);
    if (speed < 0.35) {
      isFlying = false;
      isSettling = true;
      combo = 0;
      setTimeout(function () {
        isSettling = false;
        removeProjectile();
        if (!allTargetsDestroyed() && hasShotsRemaining()) {
          createProjectile();
        } else {
          canShoot = false;
        }
        checkWinLose();
      }, 500);
    }
  }

  function launchProjectile() {
    if (!projectile || !canShoot || !hasShotsRemaining()) return;

    var pull = getPullVector();
    if (pull.len < 12) {
      dragPoint = { x: SLING_X, y: SLING_Y };
      if (projectile) Body.setPosition(projectile, dragPoint);
      return;
    }

    var powerRatio = pull.len / MAX_PULL;
    isRocketShot = powerRatio >= ROCKET_THRESHOLD;
    rocketImpactTriggered = false;
    projectileShattered = false;

    var launchPower = isRocketShot ? LAUNCH_POWER * ROCKET_POWER_MULT : LAUNCH_POWER;

    Body.setStatic(projectile, false);
    Body.setPosition(projectile, { x: SLING_X, y: SLING_Y });
    Body.setVelocity(projectile, {
      x: pull.x * launchPower,
      y: pull.y * launchPower
    });

    if (isRocketShot && projectile) {
      projectile.isRocket = true;
      projectile.frictionAir = 0.006;
    }

    canShoot = false;
    isFlying = true;
    isDragging = false;
    shotsLeft--;
    trail = [];
    lastProjectilePos = null;
    updateHud();
    dragPoint = { x: SLING_X, y: SLING_Y };

    if (hud.powerBar) hud.powerBar.classList.remove('rocket-ready');
  }

  function isTouchDevice() {
    return !!(window.YedRoxPerf && window.YedRoxPerf.touch) ||
      (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }

  function getSlingshotHitRadius() {
    return MAX_PULL + (isTouchDevice() ? 90 : 50);
  }

  function isNearSlingshot(pos) {
    var dx = pos.x - SLING_X;
    var dy = pos.y - SLING_Y;
    return Math.sqrt(dx * dx + dy * dy) < getSlingshotHitRadius();
  }

  function circleRectOverlap(cx, cy, r, body) {
    var w = body.blockW || 20;
    var h = body.blockH || 20;
    var pos = body.position;
    var cos = Math.cos(body.angle);
    var sin = Math.sin(body.angle);
    var dx = cx - pos.x;
    var dy = cy - pos.y;
    var localX = dx * cos + dy * sin;
    var localY = -dx * sin + dy * cos;
    var halfW = w / 2;
    var halfH = h / 2;
    var closestX = Math.max(-halfW, Math.min(halfW, localX));
    var closestY = Math.max(-halfH, Math.min(halfH, localY));
    var distX = localX - closestX;
    var distY = localY - closestY;
    return (distX * distX + distY * distY) < r * r;
  }

  function checkProjectileHitsAt(px, py, impact) {
    targets.forEach(function (t) {
      if (t.destroyed) return;
      var tp = t.body.position;
      var tr = t.radius;
      var dx = px - tp.x;
      var dy = py - tp.y;
      var hitR = PROJECTILE_R + tr;
      if (dx * dx + dy * dy < hitR * hitR) {
        wakeFromProjectileHit(t.body);
        onTargetDestroyed(t, px, py, impact);
      }
    });

    levelBodies.forEach(function (block) {
      if (block.destroyed) return;
      if (!circleRectOverlap(px, py, PROJECTILE_R, block)) return;

      wakeFromProjectileHit(block);
      if (canDestroyBlocks(projectile)) {
        breakBlock(block, impact, projectile);
      }
      if (isRocketShot) {
        shatterProjectile(px, py, { x: projectile.velocity.x, y: projectile.velocity.y });
      } else if (impact > 3) {
        spawnImpactBurst(px, py, Math.min(impact, 8), false);
      }
    });

    if (isRocketShot && py + PROJECTILE_R >= GROUND_Y) {
      shatterProjectile(px, py, { x: projectile.velocity.x, y: projectile.velocity.y });
    }
  }

  function checkProjectileOverlaps() {
    if (!isFlying || !projectile || projectileShattered) return;

    var pos = projectile.position;
    var px = pos.x;
    var py = pos.y;
    var impact = Vector.magnitude(projectile.velocity);

    if (lastProjectilePos) {
      var x0 = lastProjectilePos.x;
      var y0 = lastProjectilePos.y;
      var segDx = px - x0;
      var segDy = py - y0;
      var segLen = Math.sqrt(segDx * segDx + segDy * segDy);
      var steps = Math.max(2, Math.ceil(segLen / (PROJECTILE_R * 0.45)));
      var s;
      for (s = 0; s <= steps; s++) {
        var t = s / steps;
        checkProjectileHitsAt(x0 + segDx * t, y0 + segDy * t, impact);
        if (projectileShattered) return;
      }
    } else {
      checkProjectileHitsAt(px, py, impact);
    }

    lastProjectilePos = { x: px, y: py };
  }

  function stepPhysics() {
    var perf = window.YedRoxPerf || {};
    var steps = (isTouchDevice() || perf.lite) ? 5 : 1;
    var i;
    for (i = 0; i < steps; i++) {
      Engine.update(engine, FIXED_DELTA);
      if (isFlying && projectile) checkProjectileOverlaps();
    }
  }

  function onPointerDown(e) {
    if (!canShoot || !hasShotsRemaining() || gameOver || levelWon || gamePaused) return;
    if (activePointerId !== null) return;

    applyCanvasResize();
    var pos = screenToWorld(e.clientX, e.clientY);
    if (isNearSlingshot(pos)) {
      e.preventDefault();
      isDragging = true;
      fearFleeTriggered = false;
      activePointerId = e.pointerId;
      canvas.setPointerCapture(e.pointerId);
      onPointerMove(e);
    }
  }

  function onPointerMove(e) {
    if (!isDragging || e.pointerId !== activePointerId) return;
    e.preventDefault();
    applyCanvasResize();
    var pos = screenToWorld(e.clientX, e.clientY);
    var dx = pos.x - SLING_X;
    var dy = pos.y - SLING_Y;
    if (dx > 20) dx = 20;
    var pull = clampPull(dx, dy);
    dragPoint = { x: SLING_X + pull.x, y: SLING_Y + pull.y };
    if (projectile) Body.setPosition(projectile, dragPoint);
    updateHud();
    checkTargetFearFlee();
  }

  function onPointerUp(e) {
    if (!isDragging || e.pointerId !== activePointerId) return;
    e.preventDefault();
    isDragging = false;
    activePointerId = null;
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    updateHud();
    launchProjectile();
  }

  function resizeCanvas() {
    if (!canvas) return;
    if (resizeCanvasRaf) return;
    resizeCanvasRaf = requestAnimationFrame(function () {
      resizeCanvasRaf = null;
      applyCanvasResize();
    });
  }

  function applyCanvasResize() {
    if (!canvas) return;
    var wrap = canvas.parentElement;
    if (!wrap) return;

    var w = wrap.clientWidth;
    var h = wrap.clientHeight;
    if (w <= 0 || h <= 0) {
      requestAnimationFrame(applyCanvasResize);
      return;
    }

    dpr = Math.min(window.devicePixelRatio || 1, (window.YedRoxPerf && window.YedRoxPerf.lite) ? 1 : 2);
    var bw = Math.floor(w * dpr);
    var bh = Math.floor(h * dpr);

    if (
      lastCanvasLayout.w === w &&
      lastCanvasLayout.h === h &&
      lastCanvasLayout.bw === bw &&
      lastCanvasLayout.bh === bh
    ) {
      return;
    }

    scaleX = w / WORLD_W;
    scaleY = h / WORLD_H;
    scale = scaleX;

    canvas.width = bw;
    canvas.height = bh;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr * scaleX, 0, 0, dpr * scaleY, 0, 0);

    lastCanvasLayout = { w: w, h: h, bw: bw, bh: bh };
  }

  function drawBackground() {
    var sky = ctx.createLinearGradient(0, 0, 0, WORLD_H - GROUND_H);
    sky.addColorStop(0, COLORS.skyTop);
    sky.addColorStop(0.45, COLORS.skyMid);
    sky.addColorStop(1, COLORS.skyBottom);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    ctx.fillStyle = COLORS.sun;
    ctx.beginPath();
    ctx.arc(780, 80, 60, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = COLORS.hillFar;
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H - 120);
    ctx.quadraticCurveTo(250, WORLD_H - 200, 500, WORLD_H - 130);
    ctx.quadraticCurveTo(700, WORLD_H - 80, WORLD_W, WORLD_H - 150);
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.lineTo(0, WORLD_H);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = COLORS.hillNear;
    ctx.beginPath();
    ctx.moveTo(0, WORLD_H - 80);
    ctx.quadraticCurveTo(350, WORLD_H - 140, 650, WORLD_H - 90);
    ctx.quadraticCurveTo(800, WORLD_H - 60, WORLD_W, WORLD_H - 100);
    ctx.lineTo(WORLD_W, WORLD_H);
    ctx.lineTo(0, WORLD_H);
    ctx.closePath();
    ctx.fill();

    var grassY = GROUND_Y;
    var grass = ctx.createLinearGradient(0, grassY - 8, 0, grassY + GROUND_H);
    grass.addColorStop(0, COLORS.grassLight);
    grass.addColorStop(0.3, COLORS.grass);
    grass.addColorStop(1, COLORS.ground);
    ctx.fillStyle = grass;
    ctx.fillRect(0, grassY, WORLD_W, GROUND_H);

    ctx.strokeStyle = COLORS.groundLine;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, grassY);
    ctx.lineTo(WORLD_W, grassY);
    ctx.stroke();
  }

  function drawSlingshot() {
    var baseY = SLING_Y + 35;

    ctx.fillStyle = COLORS.slingshotDark;
    ctx.beginPath();
    ctx.ellipse(SLING_X, baseY, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    function drawFork(x) {
      var grad = ctx.createLinearGradient(x - 8, SLING_Y - 30, x + 8, baseY);
      grad.addColorStop(0, '#8D6E63');
      grad.addColorStop(1, COLORS.slingshotDark);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, baseY - 5);
      ctx.lineTo(x, SLING_Y - 28);
      ctx.stroke();
    }

    drawFork(SLING_X - 18);
    drawFork(SLING_X + 18);

    var bandEnd = canShoot && projectile ? dragPoint : { x: SLING_X, y: SLING_Y };
    ctx.strokeStyle = COLORS.band;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(SLING_X - 18, SLING_Y - 22);
    ctx.lineTo(bandEnd.x, bandEnd.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(SLING_X + 18, SLING_Y - 22);
    ctx.lineTo(bandEnd.x, bandEnd.y);
    ctx.stroke();
  }

  function drawTrajectoryPreview() {
    if (!isDragging || !canShoot) return;
    var pull = getPullVector();
    if (pull.len < 12) return;

    var vx = pull.x * LAUNCH_POWER;
    var vy = pull.y * LAUNCH_POWER;
    var px = SLING_X;
    var py = SLING_Y;
    var gravity = engine.gravity.y;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (var i = 1; i <= 14; i++) {
      var t = i * 4;
      var dotX = px + vx * t;
      var dotY = py + vy * t + 0.5 * gravity * t * t;
      if (dotY > GROUND_Y) break;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawWoodBlock(w, h) {
    var grad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    grad.addColorStop(0, COLORS.woodDark);
    grad.addColorStop(0.3, COLORS.wood);
    grad.addColorStop(0.7, COLORS.woodMid);
    grad.addColorStop(1, COLORS.woodDark);
    ctx.fillStyle = grad;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = COLORS.woodDark;
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = 'rgba(107, 68, 35, 0.45)';
    ctx.lineWidth = 1;
    for (var i = -h / 2 + 8; i < h / 2; i += 10) {
      ctx.beginPath();
      ctx.moveTo(-w / 2 + 2, i);
      ctx.lineTo(w / 2 - 2, i);
      ctx.stroke();
    }
  }

  function drawStoneBlock(w, h) {
    var grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grad.addColorStop(0, COLORS.stone);
    grad.addColorStop(0.5, COLORS.stoneMid);
    grad.addColorStop(1, COLORS.stoneDark);
    ctx.fillStyle = grad;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = COLORS.stoneDark;
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(-w / 2 + 3, -h / 2 + 3, w * 0.3, h * 0.25);
  }

  function drawTarget(r, fear) {
    fear = fear || 0;
    var fleeing = fear >= 1;
    var wingFlap = Math.sin(fearTremble * (4 + fear * 6)) * fear * 0.35;

    if (fear > 0.2) {
      ctx.fillStyle = 'rgba(75, 85, 99, 0.55)';
      [-1, 1].forEach(function (side) {
        ctx.beginPath();
        ctx.moveTo(side * r * 0.45, r * 0.05);
        ctx.quadraticCurveTo(
          side * (r * 0.95 + wingFlap * r * 0.4),
          -r * 0.35 - fear * r * 0.2,
          side * (r * 0.75 + wingFlap * r * 0.25),
          r * 0.35
        );
        ctx.quadraticCurveTo(side * r * 0.55, r * 0.1, side * r * 0.45, r * 0.05);
        ctx.fill();
      });
    }

    ctx.fillStyle = COLORS.target;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.1, r, r * (0.95 - fear * 0.04), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.targetBelly;
    ctx.beginPath();
    ctx.ellipse(0, r * 0.25, r * 0.75, r * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.targetAccent;
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.55, r * 0.55, r * 0.35, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    var eyeScale = 1 + fear * 0.9;
    var eyeY = -r * 0.05;
    var eyeGap = r * 0.28;

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-eyeGap, eyeY, r * 0.16 * eyeScale, r * 0.2 * eyeScale, 0, 0, Math.PI * 2);
    ctx.ellipse(eyeGap, eyeY, r * 0.16 * eyeScale, r * 0.2 * eyeScale, 0, 0, Math.PI * 2);
    ctx.fill();

    var pupilShift = fear * r * 0.06;
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.arc(-eyeGap + pupilShift, eyeY + fear * 2, r * (0.07 + fear * 0.03), 0, Math.PI * 2);
    ctx.arc(eyeGap + pupilShift, eyeY + fear * 2, r * (0.07 + fear * 0.03), 0, Math.PI * 2);
    ctx.fill();

    if (fear > 0.25) {
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-eyeGap - r * 0.18, eyeY - r * 0.22 - fear * r * 0.12);
      ctx.lineTo(-eyeGap + r * 0.04, eyeY - r * 0.28 - fear * r * 0.08);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(eyeGap + r * 0.18, eyeY - r * 0.22 - fear * r * 0.12);
      ctx.lineTo(eyeGap - r * 0.04, eyeY - r * 0.28 - fear * r * 0.08);
      ctx.stroke();
    }

    if (fear > 0.45) {
      ctx.fillStyle = 'rgba(147, 197, 253, 0.85)';
      var sweatBob = Math.sin(fearTremble * 5) * 1.5;
      ctx.beginPath();
      ctx.ellipse(-r * 0.62, r * 0.02 + sweatBob, r * 0.08, r * 0.12, -0.35, 0, Math.PI * 2);
      ctx.ellipse(r * 0.66, r * 0.08 - sweatBob, r * 0.07, r * 0.1, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = COLORS.targetAccent;
    ctx.lineWidth = 2;
    if (fear > 0.55) {
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.ellipse(0, r * 0.34, r * (0.12 + fear * 0.08), r * (0.16 + fear * 0.1), 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(0, r * 0.3, r * 0.2, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }

    if (fear > 0.75) {
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-r * 0.55, -r * 0.45);
      ctx.lineTo(-r * 0.42, -r * 0.58);
      ctx.moveTo(r * 0.55, -r * 0.45);
      ctx.lineTo(r * 0.42, -r * 0.58);
      ctx.stroke();
    }

    if (fleeing) {
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#FDE047';
      ctx.fillText('!', 0, -r * 0.85);
      ctx.textAlign = 'left';
    }
  }

  function drawProjectile() {
    var rocket = projectile && projectile.isRocket && isFlying;

    var grad = ctx.createRadialGradient(-5, -5, 2, 0, 0, PROJECTILE_R);
    grad.addColorStop(0, rocket ? '#FEF08A' : '#FCA5A5');
    grad.addColorStop(0.4, rocket ? '#F97316' : COLORS.projectile);
    grad.addColorStop(1, COLORS.projectileDark);
    ctx.shadowColor = rocket ? 'rgba(249, 115, 22, 0.8)' : COLORS.projectileGlow;
    ctx.shadowBlur = rocket ? 28 : 20;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, PROJECTILE_R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.arc(-6, -6, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 8px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillText('YedRox', 0.5, 0.5);
    ctx.fillStyle = '#ffffff';
    ctx.fillText('YedRox', 0, 0);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  function drawShard(body) {
    if (!body || body.destroyed) return;
    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);

    var verts = body.vertices;
    ctx.fillStyle = body.shardColor || COLORS.projectile;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(verts[0].x - body.position.x, verts[0].y - body.position.y);
    for (var i = 1; i < verts.length; i++) {
      ctx.lineTo(verts[i].x - body.position.x, verts[i].y - body.position.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (body.shardText) {
      ctx.font = 'bold 8px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(body.shardText, 0, 1);
    }

    ctx.restore();
  }

  function drawBody(body) {
    if (!body || body.destroyed) return;

    ctx.save();
    ctx.translate(body.position.x, body.position.y);
    ctx.rotate(body.angle);

    if (body.label === 'projectile') {
      drawProjectile();
    } else if (body.label === 'target') {
      var fear = body.fled ? 1 : getFearLevel();
      if (fear > 0) {
        var shake = body.fled ? 3.5 : fear * 2.8;
        ctx.translate(
          Math.sin(fearTremble * (3 + fear * 5)) * shake,
          Math.cos(fearTremble * 2.6) * shake * 0.5
        );
      }
      drawTarget(body.targetRadius || 20, fear);
    } else if (body.label === 'block' || body.label === 'debris') {
      var w = body.blockW || 20;
      var h = body.blockH || 20;
      if (body.blockType === 'stone') drawStoneBlock(w, h);
      else drawWoodBlock(w, h);
    }

    ctx.restore();
  }

  function drawTrail() {
    if (!isFlying || trail.length < 2) return;

    if (isRocketShot) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.55)';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (var i = 1; i < trail.length; i++) ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (var j = 1; j < trail.length; j++) ctx.lineTo(trail[j].x, trail[j].y);
      ctx.stroke();
    } else {
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.35)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (var k = 1; k < trail.length; k++) ctx.lineTo(trail[k].x, trail[k].y);
      ctx.stroke();
    }
  }

  function updateEffects() {
    if (screenShake > 0) screenShake *= 0.85;
    if (screenShake < 0.3) screenShake = 0;

    if (isDragging || targets.some(function (t) { return t.fled && !t.destroyed; })) {
      fearTremble += 0.1 + getFearLevel() * 0.22 + (targets.some(function (t) { return t.fled && !t.destroyed; }) ? 0.15 : 0);
    }

    updateFleeingTargets();

    if (isDragging) checkTargetFearFlee();

    checkUnsupportedStructures();

    if (isFlying && projectile) {
      trail.push({ x: projectile.position.x, y: projectile.position.y });
      if (trail.length > (isRocketShot ? 22 : 14)) trail.shift();
      if (isRocketShot && !projectileShattered) {
        spawnRocketFlame(projectile.position.x, projectile.position.y);
      }
    }

    shards.forEach(function (s) {
      if (s.ttl !== undefined) {
        s.ttl--;
        if (s.ttl <= 0) s.destroyed = true;
      }
    });
    shards = shards.filter(function (s) {
      if (s.destroyed) {
        World.remove(engine.world, s);
        return false;
      }
      return true;
    });

    debris.forEach(function (d) {
      if (d.ttl !== undefined) {
        d.ttl--;
        if (d.ttl <= 0) d.destroyed = true;
      }
    });
    debris = debris.filter(function (d) {
      if (d.destroyed) {
        World.remove(engine.world, d);
        return false;
      }
      return true;
    });

    rocketFlames = rocketFlames.filter(function (f) {
      f.x += f.vx;
      f.y += f.vy;
      f.life -= 0.06;
      f.size *= 0.94;
      return f.life > 0;
    });

    particles = particles.filter(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.life -= p.decay;
      return p.life > 0;
    });

    floatTexts = floatTexts.filter(function (f) {
      f.y += f.vy; f.life -= 0.018;
      return f.life > 0;
    });
  }

  function drawEffects() {
    rocketFlames.forEach(function (f) {
      ctx.globalAlpha = f.life * 0.8;
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size * f.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    particles.forEach(function (p) {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    floatTexts.forEach(function (f) {
      ctx.globalAlpha = f.life;
      ctx.font = 'bold 18px Outfit, sans-serif';
      ctx.fillStyle = f.color;
      ctx.textAlign = 'center';
      ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;
    ctx.textAlign = 'left';
  }

  function render() {
    if (!ctx || !engine) return;
    updateEffects();

    ctx.save();
    if (screenShake > 0) {
      ctx.translate(
        (Math.random() - 0.5) * screenShake,
        (Math.random() - 0.5) * screenShake
      );
    }

    drawBackground();
    drawTrajectoryPreview();

    levelBodies.forEach(function (body) { drawBody(body); });
    targets.forEach(function (t) { if (!t.destroyed) drawBody(t.body); });
    debris.forEach(function (d) { drawBody(d); });

    drawTrail();
    shards.forEach(function (s) { drawShard(s); });
    if (projectile && !projectileShattered) drawBody(projectile);
    drawSlingshot();
    drawEffects();

    ctx.restore();
  }

  var gameLoopLastTs = 0;

  function gameLoop(ts) {
    if (gamePaused) return;

    var perf = window.YedRoxPerf || {};
    var renderFrame = true;

    if (perf.lite) {
      if (!gameLoopLastTs) gameLoopLastTs = ts;
      if (ts - gameLoopLastTs < 33) {
        renderFrame = false;
      } else {
        gameLoopLastTs = ts;
      }
    }

    stepPhysics();
    settleCheck();

    if (!renderFrame) {
      animFrame = requestAnimationFrame(gameLoop);
      return;
    }

    render();
    animFrame = requestAnimationFrame(gameLoop);
  }

  function bindHud() {
    hud.score = document.getElementById('gameScore');
    hud.level = document.getElementById('gameLevel');
    hud.shots = document.getElementById('gameShots');
    hud.next = document.getElementById('gameNext');
    hud.modal = document.getElementById('gameModal');
    hud.modalTitle = document.getElementById('gameModalTitle');
    hud.modalText = document.getElementById('gameModalText');
    hud.modalAction = document.getElementById('gameModalAction');
    hud.modalRetry = document.getElementById('gameModalRetry');
    hud.powerWrap = document.getElementById('gamePowerWrap');
    hud.powerBar = document.getElementById('gamePowerBar');
    hud.powerLabel = document.getElementById('gamePowerLabel');

    document.getElementById('gameRestart').addEventListener('click', function () {
      hideModal();
      totalScore = 0;
      currentLevel = 0;
      buildLevel(0);
    });

    document.getElementById('gameNext').addEventListener('click', function () {
      if (currentLevel < LEVELS.length - 1) {
        currentLevel++;
        buildLevel(currentLevel);
      }
    });
  }

  function bindInput() {
    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', onPointerUp, { passive: false });
    canvas.addEventListener('pointercancel', onPointerUp, { passive: false });
    window.addEventListener('resize', resizeCanvas);

    if (window.ResizeObserver && canvas.parentElement) {
      resizeObserver = new ResizeObserver(function () {
        resizeCanvas();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    onOrientationChange = function () {
      resizeCanvas();
    };
    window.addEventListener('orientationchange', onOrientationChange);
  }

  function unbindInput() {
    if (!canvas) return;
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('resize', resizeCanvas);
    if (onOrientationChange) {
      window.removeEventListener('orientationchange', onOrientationChange);
      onOrientationChange = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  }

  function setupPhysics() {
    var perf = window.YedRoxPerf || {};
    var iterations = (perf.lite && !isTouchDevice()) ? 6 : 10;

    engine = Engine.create({ gravity: { x: 0, y: 1 } });
    engine.enableSleeping = false;
    engine.positionIterations = iterations;
    engine.velocityIterations = iterations;

    ground = Bodies.rectangle(WORLD_W / 2, GROUND_Y + GROUND_H / 2, WORLD_W + 200, GROUND_H, {
      isStatic: true,
      label: 'ground',
      friction: 0.9,
      restitution: 0.1
    });

    var leftWall = Bodies.rectangle(-25, WORLD_H / 2, 50, WORLD_H * 2, { isStatic: true, label: 'wall' });
    var rightWall = Bodies.rectangle(WORLD_W + 25, WORLD_H / 2, 50, WORLD_H * 2, { isStatic: true, label: 'wall' });
    var ceiling = Bodies.rectangle(WORLD_W / 2, -25, WORLD_W * 2, 50, { isStatic: true, label: 'wall' });
    walls = [leftWall, rightWall, ceiling];

    World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    Events.on(engine, 'collisionStart', function (event) {
      event.pairs.forEach(function (pair) {
        var a = pair.bodyA;
        var b = pair.bodyB;
        var impact = Vector.magnitude(Vector.sub(a.velocity, b.velocity));
        var projectileBody = a.label === 'projectile' ? a : (b.label === 'projectile' ? b : null);
        var structureBody = projectileBody === a ? b : (projectileBody === b ? a : null);

        if (projectileBody && structureBody && !projectileShattered) {
          if (structureBody.label === 'block' || structureBody.isTarget) {
            wakeFromProjectileHit(structureBody);
          }

          var hitGround = structureBody.label === 'ground';
          var hitStructure = structureBody.label === 'block' || structureBody.isTarget;

          if (isRocketShot && (hitStructure || hitGround)) {
            shatterProjectile(
              projectileBody.position.x,
              projectileBody.position.y,
              { x: projectileBody.velocity.x, y: projectileBody.velocity.y }
            );
          } else if (hitStructure && impact > 3) {
            spawnImpactBurst(projectileBody.position.x, projectileBody.position.y, Math.min(impact, 8), false);
          }
        }

        if (impact > 4 && (isRocketShot || impact > 12)) {
          screenShake = Math.max(screenShake, Math.min(impact * (isRocketShot ? 0.5 : 0.12), isRocketShot ? 18 : 3));
        }

        [a, b].forEach(function (body) {
          if (body.isTarget && !body.destroyed) {
            var other = body === a ? b : a;
            if (other.label === 'projectile' || other.label === 'shard') {
              var entry = targets.find(function (t) { return t.body === body; });
              if (entry) onTargetDestroyed(entry, body.position.x, body.position.y, impact);
            }
          }

          if (body.label === 'block' && !body.destroyed) {
            var hitter = body === a ? b : a;
            if (hitter.label === 'projectile' || hitter.label === 'shard') {
              if (canDestroyBlocks(hitter)) {
                breakBlock(body, impact, hitter);
              }
            }
          }
        });
      });
    });
  }

  var initialized = false;

  function init(canvasEl) {
    if (initialized || !canvasEl || typeof Matter === 'undefined') return;
    initialized = true;
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    bindHud();
    setupPhysics();
    bindInput();
    resizeCanvas();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        applyCanvasResize();
      });
    });
    currentLevel = 0;
    totalScore = 0;
    buildLevel(0);
    gamePaused = false;
    gameLoopLastTs = 0;
    animFrame = requestAnimationFrame(gameLoop);
  }

  function destroy() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = null;
    unbindInput();
    if (engine) { Engine.clear(engine); engine = null; }
    initialized = false;
    canvas = null;
    ctx = null;
  }

  function pause() {
    gamePaused = true;
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  }

  function resume() {
    if (!initialized || !gamePaused) return;
    gamePaused = false;
    gameLoopLastTs = 0;
    applyCanvasResize();
    resizeCanvas();
    animFrame = requestAnimationFrame(gameLoop);
  }

  return { init: init, destroy: destroy, pause: pause, resume: resume };
})();
