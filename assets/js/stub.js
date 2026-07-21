/* ============================================================
   FORGE_site_dev · stub.js
   Everything fake lives here: model registry, stub numbers,
   canvas graph stubs, alert feed. Design-stage only.
   ============================================================ */
(function (global) {
  "use strict";

  // ---- model registry (dash1 → dash2 → forge/fidget carry ?model=) ----
  const MODELS = {
    llp:      { key: "llp",      name: "ATLAS LLP",   sub: "displaced-vertex search", accent: "#FF2D7A",
                family: "HEP classifier", likelihood: "softmax", n: "1.2M evt", d: 128, tau: "1.00" },
    genre:    { key: "genre",    name: "MUSIC GENRE", sub: "BEARDOWN · GTZAN",        accent: "#FFC857",
                family: "CNN + fusion",   likelihood: "softmax", n: "999 trk",  d: 512, tau: "1.00" },
    phonon:   { key: "phonon",   name: "PHONON DOS",  sub: "e3nn regression",         accent: "#2DD4FF",
                family: "E(3)-equivariant", likelihood: "gaussian", n: "1,220 mat", d: 32, tau: "1.00" },
    tutorial: { key: "tutorial", name: "TUTORIAL",    sub: "palmer penguins",         accent: "#37E08B",
                family: "small MLP",      likelihood: "softmax", n: "333 obs",  d: 16,  tau: "1.00" },
  };
  function modelFromQuery() {
    const k = new URLSearchParams(location.search).get("model") || "genre";
    return MODELS[k] || MODELS.genre;
  }

  // ---- deterministic-ish fake data ----
  let seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function gauss() { return (rnd() + rnd() + rnd() + rnd() - 2) / 1.2; }

  // ---- alert feed ----
  const ALERT_POOL = [
    ["INFO", "bundle mounted · phi_train / y_train / ggn_eig verified"],
    ["OK",   "phi/y alignment check passed (max|Δφ| 3.1e-7)"],
    ["INFO", "G1 recomputed in-browser · τ knob live"],
    ["WARN", "506/512 directions prior-led · model is data-limited"],
    ["INFO", "graph map synced · 5 stubs registered"],
    ["OK",   "LLLA↔HMC overlay within band"],
    ["HOT",  "attribution.npz absent · bay gated (stub)"],
    ["INFO", "edge cache DYNAMIC · perf pass parked"],
  ];
  function startAlerts(el) {
    let i = 0;
    function push() {
      const [lv, msg] = ALERT_POOL[i % ALERT_POOL.length]; i++;
      const t = new Date();
      const ts = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
      const row = document.createElement("div");
      row.className = "al";
      row.innerHTML = `<span class="ts">${ts}</span><span class="lv ${lv}">${lv}</span><span class="msg">${msg}</span>`;
      el.prepend(row);
      while (el.children.length > 24) el.lastChild.remove();
    }
    push(); push(); push();
    setInterval(push, 4200);
    return { push: (lv, msg) => { ALERT_POOL.unshift([lv, msg]); i = 0; push(); ALERT_POOL.shift(); } };
  }

  // ---- graph stubs (canvas) ----
  const INKS = { grid: "#1d1d26", axis: "#3a3f4c", text: "#767c89" };

  function frame(ctx, W, H, title) {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = INKS.grid; ctx.lineWidth = 1;
    for (let x = 40; x < W - 10; x += 46) { ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x, H - 26); ctx.stroke(); }
    for (let y = 12; y < H - 26; y += 34) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(W - 10, y); ctx.stroke(); }
    ctx.strokeStyle = INKS.axis; ctx.beginPath();
    ctx.moveTo(40, 12); ctx.lineTo(40, H - 26); ctx.lineTo(W - 10, H - 26); ctx.stroke();
    ctx.fillStyle = INKS.text; ctx.font = "10px 'Share Tech Mono', monospace";
    ctx.fillText("STUB DATA — design pass", 46, H - 10);
  }

  const GRAPHS = [
    { key: "posterior", title: "POSTERIOR BARS", gauge: "G1",
      draw(ctx, W, H, M, st) {
        frame(ctx, W, H);
        const n = 10, bw = (W - 70) / n;
        for (let i = 0; i < n; i++) {
          seed = 11 + i;
          const p = 0.08 + 0.85 * Math.exp(-((i - 3.2) ** 2) / (2 * (0.7 + st.tau) ** 2)) + rnd() * 0.05;
          const sig = (0.05 + 0.16 * st.tau) * (0.5 + rnd());
          const h = p * (H - 70), x = 48 + i * bw, y = H - 26 - h;
          ctx.fillStyle = M.accent + "33"; ctx.fillRect(x, y, bw - 8, h);
          ctx.strokeStyle = M.accent; ctx.lineWidth = 1.4; ctx.strokeRect(x, y, bw - 8, h);
          ctx.strokeStyle = "#e9eef5"; ctx.beginPath();                         // σ whisker
          ctx.moveTo(x + (bw - 8) / 2, y - sig * 60); ctx.lineTo(x + (bw - 8) / 2, y + sig * 60); ctx.stroke();
        }
      } },
    { key: "eigen", title: "GGN EIGENSPECTRUM", gauge: "G1",
      draw(ctx, W, H, M, st) {
        frame(ctx, W, H);
        const n = 60;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const lam = Math.exp(4 - i * 0.16), y = H - 26 - Math.log10(lam + 1e-3) * 28 - 40;
          const x = 44 + (i / n) * (W - 64);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = M.accent; ctx.lineWidth = 2; ctx.stroke();
        const tx = 44 + (0.12 / (st.tau + 0.4)) * (W - 64);                     // τ line
        ctx.strokeStyle = "#FFC857"; ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(tx, 14); ctx.lineTo(tx, H - 26); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "#FFC857"; ctx.fillText("τ", tx + 6, 24);
        ctx.fillStyle = INKS.text; ctx.fillText("data-determined ← | → prior-led", W / 2 - 90, 24);
      } },
    { key: "sweep", title: "DATA-FRACTION SWEEP", gauge: "G2",
      draw(ctx, W, H, M, st) {
        frame(ctx, W, H);
        ctx.beginPath();
        for (let i = 0; i <= 40; i++) {
          const f = i / 40, sig = 0.9 * Math.pow(1 - 0.82 * f * st.frac, 0.5) + 0.06;
          const x = 44 + f * (W - 64), y = 20 + (1 - sig) * (H - 56);
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.strokeStyle = M.accent; ctx.lineWidth = 2.2; ctx.stroke();
        ctx.fillStyle = INKS.text; ctx.fillText("σ̄ vs fraction of training data", 48, 24);
      } },
    { key: "hmctrace", title: "HMC TRACE", gauge: "G3",
      draw(ctx, W, H, M, st) {
        frame(ctx, W, H);
        seed = 23;
        for (let c = 0; c < 3; c++) {
          ctx.beginPath();
          let v = -2 + c;
          for (let i = 0; i <= 160; i++) {
            v += gauss() * 0.25 + (0 - v) * 0.10;
            const x = 44 + (i / 160) * (W - 64), y = H / 2 - 8 + v * 26;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          }
          ctx.strokeStyle = [M.accent, "#e9eef5", "#767c89"][c]; ctx.lineWidth = 1.3;
          ctx.globalAlpha = 0.9 - c * 0.22; ctx.stroke(); ctx.globalAlpha = 1;
        }
        ctx.fillStyle = INKS.text; ctx.fillText("3 chains · warmup shaded (stub) · R̂ 1.01 · ESS 412", 48, 24);
        ctx.fillStyle = "#15151d"; ctx.fillRect(41, 12, (W - 54) * 0.18, H - 38);
      } },
    { key: "confusion", title: "CONFUSION HEAT", gauge: "G4",
      draw(ctx, W, H, M) {
        frame(ctx, W, H);
        const n = 8, s = Math.min((W - 90) / n, (H - 70) / n);
        seed = 5;
        for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
          const v = r === c ? 0.55 + rnd() * 0.45 : rnd() * 0.22;
          ctx.fillStyle = M.accent; ctx.globalAlpha = 0.06 + v * 0.9;
          ctx.fillRect(60 + c * s, 22 + r * s, s - 2, s - 2); ctx.globalAlpha = 1;
        }
        ctx.fillStyle = INKS.text; ctx.fillText("true ↓ / predicted →", 60, 16);
      } },
  ];

  global.FORGE_STUB = { MODELS, modelFromQuery, GRAPHS, startAlerts };
})(window);
