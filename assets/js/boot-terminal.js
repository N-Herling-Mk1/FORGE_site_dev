/* ────────────────────────────────────────────────────────────────────────────
   boot-terminal.js — dash1 cold-open.

   A translucent keyboard and a shell prompt. `./forge_init` types itself, the
   keys light as it goes, ENTER lands, the board pixelates away and the deck's
   own flame pixels in underneath — at which point dash1's boot takes over and
   plays exactly as it always has.

   Integration: this file sets window.__BOOT_TERMINAL before dash1's script
   runs, so dash1 defers `place(); loop();` into window.__deckStart(). Since
   dash1's whole timeline is driven by `t`, and `t` only advances inside
   loop(), delaying loop() shifts ZOOM / RINGPOP / PRINT / DEMO together — no
   per-constant offsets, nothing to keep in sync.

   To disable: drop the <script> tag. dash1 falls back to booting immediately.
   ──────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";

  var qs = new URLSearchParams(location.search);
  var FORCE = qs.has("boot");                 // ?boot=1 runs it no matter what
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RETURNING = qs.has("model");

  // Say out loud what was decided. A silent skip is indistinguishable from a
  // script that never loaded, which is exactly the wrong thing to be guessing at.
  function shout(msg, bad) {
    console.log("%c[boot-terminal] " + msg,
      "color:" + (bad ? "#ff6a2b" : "#ffb24a") + ";font-weight:700");
    if (!bad) return;
    var n = document.createElement("div");
    n.textContent = "boot-terminal skipped \u2014 " + msg;
    n.style.cssText = "position:fixed;left:50%;top:14px;transform:translateX(-50%);" +
      "z-index:9999;font:600 12px 'Share Tech Mono',monospace;letter-spacing:.18em;" +
      "text-transform:uppercase;color:#ffd27a;background:rgba(10,5,1,.92);" +
      "border:1px solid rgba(255,178,74,.5);padding:9px 16px;pointer-events:none";
    function put() { document.body.appendChild(n);
      setTimeout(function () { n.remove(); }, 6000); }
    if (document.body) put(); else addEventListener("DOMContentLoaded", put);
  }

  if (!FORCE && reduce)    { shout("prefers-reduced-motion is ON (system setting)", 1); return; }
  if (!FORCE && RETURNING) { shout("URL has ?model= (backlink return)", 1); return; }
  shout("running \u2014 build mk38");

  window.__BOOT_TERMINAL = true;              // dash1 checks this and waits

  // ── palette (matches dash1's tokens) ──────────────────────────────────────
  var VOID = "#0b0203", SOL = "#ff3b30", HOT = "#ff6a5a",
      DIM = "rgba(255,59,48,.32)", FACE = "rgba(255,59,48,.06)",
      TXT = "#ffe0da", MUTED = "rgba(226,150,142,.55)";
  var GLOW = "rgba(255,59,48,.55)", GLOW_HOT = "rgba(255,59,48,.85)",
      KEY_ON_FILL = "rgba(255,59,48,.20)", KEY_ON_TXT = "#fff0ec";
  var WHITE = "#ffffff", WHITE_DIM = "rgba(255,255,255,.62)";

  // ── timeline (seconds) ────────────────────────────────────────────────────
  // Board is up and blinking for a full second, then every line types itself:
  // two welcome lines, then ./forge_init over 2.00s, a 0.90s beat, then ENTER.
  // ── AUDIO SYNC ──────────────────────────────────────────────────────────
  // The beat drop in assets/audio/forge-boot.wav sits at 6.96s (measured:
  // strongest spectral-flux onset; sustained RMS rise 0.452 -> 0.641 at 7.10).
  // Everything below is timed so ENTER lands exactly on it. Splash ignition
  // runs 1.70 + 0.45 + 0.40 = 2.55s, leaving 4.41s of terminal before ENTER.
  var DROP_AT = 6.96;
  var T_FADE = 0.25,   // keyboard + prompt fade up
      T_WAIT = 0.35,   // ... held on screen, cursor blinking  (fade+wait = 0.60s)
      T_MSG  = 0.030,  // sec/char for the welcome lines
      T_CMD  = 1.26 / 12,  // sec/char for ./forge_init
      T_ENTER = 0.30,  // ENTER held down
      T_WIPE = 0.50;   // bright line sweeps across, revealing the deck

  var CMD = "./forge_init";
  // prompt is drawn per-segment: brackets and caret white, the word red
  var PROMPT_SEG = [["[", 0], ["shell", 1], ["]", 0], ["> ", 0]];
  var PROMPT = "[shell]> ";
  var TITLE = "// TERMINAL \u2014 /dev/forge";

  // Every line is typed, not printed. t = text, c = sec/char, p = pause after.
  var SCRIPT = [
    { t: "Welcome to F-O-R-G-E Observatory.", c: T_MSG, p: 0.22 },
    { t: "Booting Deck Interface.",           c: T_MSG, p: 0.25 },
    { t: CMD,                                 c: T_CMD, p: 0.40, enter: true, keys: true }
  ];

  // Absolute times for each line: start / end-of-typing / end-of-pause / end.
  var SCHED = (function () {
    var a = [], t = T_FADE + T_WAIT, i, L, s1, s2;
    for (i = 0; i < SCRIPT.length; i++) {
      L = SCRIPT[i];
      s1 = t + L.t.length * L.c;
      s2 = s1 + L.p;
      a.push({ start: t, typeEnd: s1, pauseEnd: s2, end: L.enter ? s2 + T_ENTER : s2 });
      t = a[i].end;
    }
    return a;
  })();
  var LAST = SCHED[SCHED.length - 1];
  var T_WIPE_AT = LAST.end;
  var ENTER_LOCAL = LAST.pauseEnd;  // terminal-relative moment ENTER goes down
  var LEAD = 1.00;                  // deck warm-up lead before the wipe starts

  // Resume the splash track at the correct offset. Page-load time is absorbed
  // here rather than allowed to drift the sync.
  var STAMP = 0;
  try { STAMP = +(sessionStorage.getItem("forgeAudioT0") || 0); } catch (e) {}
  function resumeAudio() {
    if (!STAMP) return;
    var A = new Audio("assets/audio/forge-boot.wav"), off = (Date.now() - STAMP) / 1000;
    A.volume = 0.9;
    A.addEventListener("loadedmetadata", function () {
      A.currentTime = Math.max(0, Math.min(off, A.duration - 0.05));
    });
    window.__forgeAudio = A;
    A.play().catch(function () {
      var b = document.createElement("button");
      b.textContent = "\u25B6 ENABLE AUDIO";
      b.style.cssText = "position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9999;" +
        "font:600 11px 'Share Tech Mono',monospace;letter-spacing:.2em;padding:10px 18px;" +
        "color:#ffd27a;background:rgba(10,5,1,.92);border:1px solid rgba(255,178,74,.5);cursor:pointer";
      b.onclick = function () {
        A.currentTime = Math.max(0, (Date.now() - STAMP) / 1000);
        A.play(); b.remove();
      };
      document.body.appendChild(b);
    });
  }

  // ── keyboard layout: rows of [label, widthUnits] ──────────────────────────
  var ROWS = [
    [["`", 1], ["1", 1], ["2", 1], ["3", 1], ["4", 1], ["5", 1], ["6", 1],
     ["7", 1], ["8", 1], ["9", 1], ["0", 1], ["-", 1], ["=", 1], ["\u232B", 1.8]],
    [["TAB", 1.5], ["Q", 1], ["W", 1], ["E", 1], ["R", 1], ["T", 1], ["Y", 1],
     ["U", 1], ["I", 1], ["O", 1], ["P", 1], ["[", 1], ["]", 1], ["\\", 1.3]],
    [["CAPS", 1.8], ["A", 1], ["S", 1], ["D", 1], ["F", 1], ["G", 1], ["H", 1],
     ["J", 1], ["K", 1], ["L", 1], [";", 1], ["'", 1], ["ENTER", 2.0]],
    [["SHIFT", 2.3], ["Z", 1], ["X", 1], ["C", 1], ["V", 1], ["B", 1], ["N", 1],
     ["M", 1], [",", 1], [".", 1], ["/", 1], ["SHIFT", 2.5]],
    [["CTRL", 1.4], ["ALT", 1.2], ["", 7.2], ["ALT", 1.2], ["CTRL", 1.4]]
  ];

  // which keys light for a given character
  function keysFor(ch) {
    if (ch === "_") return ["SHIFT", "-"];
    if (ch === "/") return ["/"];
    if (ch === ".") return ["."];
    if (ch === " ") return [""];
    return [ch.toUpperCase()];
  }

  // ── overlay ───────────────────────────────────────────────────────────────
  var host = document.createElement("div");
  host.id = "bterm";
  host.setAttribute("aria-hidden", "true");
  // Sits ONLY over the region the deck renders into — right of the left rail.
  // z-index 29 keeps it under #dock (30) and the z-40 banner widgets, so the
  // rail, brand, zoom key, orientation gizmo and back-button are untouched.
  host.style.cssText =
    "position:fixed;top:0;right:0;bottom:0;left:0;z-index:29;" +
    "pointer-events:none;background:" + VOID + ";";
  var cv = document.createElement("canvas");
  cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  host.appendChild(cv);

  function start() {
    resumeAudio();
    document.body.appendChild(host);
    resize();                                  // needs host in the DOM for clientWidth
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", start);
  else start();

  var ctx = cv.getContext("2d");
  var board = document.createElement("canvas");     // keyboard + shell, offscreen
  var bctx = board.getContext("2d");
  var tmp = document.createElement("canvas");       // pixelation scratch
  var tctx = tmp.getContext("2d");

  var W = 0, H = 0, DPR = 1, geom = null;

  // left edge of the deck pane = right edge of the side rail
  function paneLeft() {
    var sp = document.getElementById("sidepanel");
    if (!sp) return 0;
    var r = sp.getBoundingClientRect();
    return (r.width && r.right < window.innerWidth * 0.6) ? Math.round(r.right) : 0;
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    host.style.left = paneLeft() + "px";
    W = host.clientWidth || window.innerWidth;
    H = host.clientHeight || window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    board.width = cv.width; board.height = cv.height;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    layout();
  }

  function layout() {
    // keyboard occupies the lower band, centred, capped so it never dominates
    var kbW = Math.min(W * 0.74, 1080);
    var units = 0, i;
    for (i = 0; i < ROWS[0].length; i++) units += ROWS[0][i][1];
    var gap = Math.max(3, kbW * 0.006);
    var u = (kbW - gap * (units - 1)) / units;           // one key unit
    var kh = u * 0.92;
    var kbH = ROWS.length * kh + (ROWS.length - 1) * gap;
    var top = H - kbH - Math.max(34, H * 0.055);
    var fs = Math.max(13, Math.min(24, kbW * 0.023));       // terminal body text
    var lh = fs * 1.95;                                     // line height
    var head = fs * 2.1;                                    // title bar height
    var padX = fs * 1.5, padY = fs * 1.9;
    var lines = SCRIPT.length + 3;                          // + headroom below
    var boxH = head + padY * 2 + lines * lh;
    var boxY = top - Math.max(30, H * 0.055) - boxH;
    geom = {
      x: (W - kbW) / 2, y: top, w: kbW, h: kbH, u: u, kh: kh, gap: gap,
      boxX: (W - kbW) / 2, boxY: Math.max(H * 0.04, boxY), boxW: kbW, boxH: boxH,
      fs: fs, lh: lh, head: head, padX: padX, padY: padY
    };
  }
  window.addEventListener("resize", resize);

  // ── drawing ───────────────────────────────────────────────────────────────
  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath();
  }

  function drawBoard(lit, alpha, enterDown) {
    var g = bctx, G = geom;
    g.clearRect(0, 0, W, H);
    g.globalAlpha = alpha;

    // ── terminal window ────────────────────────────────────────────────
    var bx = G.boxX, by = G.boxY, bw = G.boxW, bh = G.boxH;
    roundRect(g, bx, by, bw, bh, 3);
    g.fillStyle = "rgba(14,3,4,.82)"; g.fill();
    g.lineWidth = 1.5; g.strokeStyle = DIM; g.stroke();

    // title bar
    g.save();
    roundRect(g, bx, by, bw, G.head, 3); g.clip();
    g.fillStyle = "rgba(255,59,48,.09)"; g.fillRect(bx, by, bw, G.head);
    g.restore();
    g.beginPath(); g.moveTo(bx, by + G.head); g.lineTo(bx + bw, by + G.head);
    g.strokeStyle = DIM; g.lineWidth = 1; g.stroke();
    g.font = "600 " + (G.fs * 0.82) + "px 'Share Tech Mono',ui-monospace,monospace";
    g.textAlign = "left"; g.textBaseline = "middle";
    g.fillStyle = MUTED;
    g.fillText(TITLE, bx + G.padX, by + G.head / 2 + 1);
    for (var d = 0; d < 3; d++) {                       // bezel LEDs
      g.beginPath();
      g.arc(bx + bw - G.padX - d * G.fs * 0.95, by + G.head / 2, G.fs * 0.22, 0, 6.2832);
      g.fillStyle = d === 0 ? SOL : "rgba(255,59,48,.28)";
      g.fill();
    }

    // body: finished lines as history, then the line currently being typed
    g.font = "600 " + G.fs + "px 'Share Tech Mono',ui-monospace,monospace";
    g.textAlign = "left"; g.textBaseline = "alphabetic";
    var tx = bx + G.padX, ty = by + G.head + G.padY + G.fs;
    var pw = g.measureText(PROMPT).width, li, k, x2;
    function prompt(y, faded) {
      x2 = tx;
      for (k = 0; k < PROMPT_SEG.length; k++) {
        g.fillStyle = PROMPT_SEG[k][1]
          ? (faded ? "rgba(255,59,48,.62)" : SOL)
          : (faded ? WHITE_DIM : WHITE);
        g.fillText(PROMPT_SEG[k][0], x2, y);
        x2 += g.measureText(PROMPT_SEG[k][0]).width;
      }
    }
    for (li = 0; li < hist.length; li++) {
      prompt(ty, 1);
      g.fillStyle = WHITE_DIM; g.fillText(hist[li], tx + pw, ty);
      ty += G.lh;
    }
    if (hist.length < SCRIPT.length) {
      prompt(ty, 0);
      g.fillStyle = WHITE;
      g.fillText(typed, tx + pw, ty);
      if (cursorOn) {
        g.fillStyle = WHITE;
        g.fillRect(tx + pw + g.measureText(typed).width + 2, ty + 3,
                   G.fs * 0.58, Math.max(2, G.fs * 0.10));
      }
    }

    // keys
    var y = G.y;
    for (var r = 0; r < ROWS.length; r++) {
      var x = G.x;
      for (var i = 0; i < ROWS[r].length; i++) {
        var label = ROWS[r][i][0], wUnits = ROWS[r][i][1];
        var kw = wUnits * G.u + (wUnits - 1) * G.gap;
        var on = lit.indexOf(label) >= 0 || (label === "ENTER" && enterDown);
        var press = on ? Math.max(1, G.kh * 0.045) : 0;

        roundRect(g, x, y + press, kw, G.kh - press, Math.max(2, G.u * 0.10));
        g.fillStyle = on ? KEY_ON_FILL : FACE;
        g.fill();
        g.lineWidth = on ? 2 : 1;
        g.strokeStyle = on ? SOL : DIM;
        if (on) { g.shadowColor = GLOW_HOT; g.shadowBlur = 16; }
        g.stroke();
        g.shadowBlur = 0;

        if (label) {
          var fs = label.length > 1 ? G.u * 0.26 : G.u * 0.38;
          g.font = "600 " + fs + "px 'Share Tech Mono',ui-monospace,monospace";
          g.textAlign = "center"; g.textBaseline = "middle";
          g.fillStyle = on ? KEY_ON_TXT : "rgba(226,150,142,.62)";
          g.fillText(label, x + kw / 2, y + press + (G.kh - press) / 2 + 1);
        }
        x += kw + G.gap;
      }
      y += G.kh + G.gap;
    }
    g.globalAlpha = 1;
    g.textAlign = "left"; g.textBaseline = "alphabetic";
  }

  // blit the offscreen board through a pixelation filter. q=0 sharp, q=1 mush.
  function blitPixelated(q) {
    if (q <= 0.001) { ctx.drawImage(board, 0, 0, W, H); return; }
    var bs = 1 + 40 * q * q;
    var sw = Math.max(1, Math.round(W / bs)), sh = Math.max(1, Math.round(H / bs));
    tmp.width = sw; tmp.height = sh;
    tctx.imageSmoothingEnabled = true;
    tctx.clearRect(0, 0, sw, sh);
    tctx.drawImage(board, 0, 0, sw, sh);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = Math.max(0, 1 - q * 0.85);
    ctx.drawImage(tmp, 0, 0, W, H);
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = true;
  }

  // A single bright line sweeps left to right. Everything it passes is cleared,
  // so the deck shows through behind it. Same read as the splash-page wipe.
  function drawWipe(p) {
    var x = W * p, ew = Math.max(70, W * 0.075);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = VOID; ctx.fillRect(0, 0, W, H);
    ctx.drawImage(board, 0, 0, W, H);
    ctx.clearRect(0, 0, Math.max(0, x - 2), H);          // revealed: deck beneath
    var lg = ctx.createLinearGradient(x - ew, 0, x + ew * 0.16, 0);
    lg.addColorStop(0.00, "rgba(255,59,48,0)");
    lg.addColorStop(0.55, "rgba(255,59,48,.42)");
    lg.addColorStop(0.88, "rgba(255,120,96,.92)");
    lg.addColorStop(0.97, "rgba(255,240,236,1)");
    lg.addColorStop(1.00, "rgba(255,240,236,0)");
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = lg; ctx.fillRect(x - ew, 0, ew * 1.18, H);
    ctx.globalCompositeOperation = "source-over";
  }

  // ── state machine ─────────────────────────────────────────────────────────
  var t0 = 0, typed = "", hist = [], cursorOn = true, deckStarted = false, done = false;

  function handoff() {
    if (deckStarted) return;
    deckStarted = true;
    if (typeof window.__deckStart === "function") {
      window.__deckStart(LEAD + T_WIPE);   // keep the flame framed through the reveal
      return;
    }
    // The deck never defined its start hook — almost always because three.js
    // failed to load (offline, blocked CDN, firewall). Don't leave a dead
    // screen behind a finished animation; say so.
    shout("deck never initialised \u2014 three.js likely failed to load", 1);
  }

  function frame(now) {
    if (done) return;
    if (!t0) {
      // Anchor the terminal to the STRIKE, not to page load, so ENTER lands on
      // the drop no matter how long the navigation took. If loading overran,
      // t0 sits in the past and the intro starts partway through rather than
      // pushing the drop late.
      if (STAMP) t0 = now - (Date.now() - (STAMP + (DROP_AT - ENTER_LOCAL) * 1000));
      else t0 = now;
    }
    var e = (now - t0) / 1000;
    cursorOn = (Math.floor(e * 2.2) % 2) === 0;

    var tWipe = T_WIPE_AT, tEnd = tWipe + T_WIPE;
    var lit = [], alpha = 1, enterDown = false, i, S, L;

    if (e < T_FADE) alpha = e / T_FADE;

    hist = []; typed = "";
    for (i = 0; i < SCHED.length; i++) {
      S = SCHED[i]; L = SCRIPT[i];
      if (e >= S.end) { hist.push(L.t); continue; }   // this line is finished
      if (e >= S.start) {                             // ...being typed right now
        var n = (e >= S.typeEnd) ? L.t.length
              : Math.min(L.t.length, Math.floor((e - S.start) / L.c) + 1);
        typed = L.t.slice(0, n);
        // Only the command line drives the keyboard. The welcome lines are
        // machine output — nobody is typing them, so no keys light.
        if (L.keys && e < S.typeEnd) {
          var since = (e - S.start) - (n - 1) * L.c;
          if (since < L.c * 0.62) lit = keysFor(L.t.charAt(n - 1));
        }
        if (L.enter && e >= S.pauseEnd) enterDown = true;
      }
      break;                                          // nothing after this yet
    }

    if (enterDown || e >= tWipe) cursorOn = false;
    // Bring the deck up a full second BEFORE the wipe so three.js has finished
    // initialising and is actually painting the flame by the time the line
    // uncovers it. extraHold parks the camera on the flame for LEAD + wipe, so
    // the deck's own 1.2s hold still runs in full *after* the reveal.
    if (e >= T_WIPE_AT - LEAD) handoff();

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    if (e < tWipe) {
      ctx.fillStyle = VOID; ctx.fillRect(0, 0, W, H);
      drawBoard(lit, alpha, enterDown);
      blitPixelated(0);
    } else if (e < tEnd) {
      drawBoard([], 1, true);
      drawWipe((e - tWipe) / T_WIPE);
    } else {
      handoff();
      done = true;
      host.style.transition = "opacity .18s";
      host.style.opacity = "0";
      setTimeout(function () { host.remove(); }, 200);
      return;
    }
    requestAnimationFrame(frame);
  }
})();
