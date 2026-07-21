/* ============================================================
   FORGE_site_dev · gauges.js
   Analog instrument dial (SVG): grey chrome, colored zone band,
   white needle, digital readout. Values are STUBS — a slow
   random walk around a set point; setTarget() retunes it.
   ============================================================ */
(function (global) {
  "use strict";

  const SWEEP = 240;                 // degrees of dial travel
  const A0 = -210, A1 = A0 + SWEEP;  // start/end angles (deg, 0 = 3 o'clock)
  const D2R = Math.PI / 180;

  const pol = (cx, cy, r, deg) => [cx + r * Math.cos(deg * D2R), cy + r * Math.sin(deg * D2R)];

  function arcPath(cx, cy, r, d0, d1) {
    const [x0, y0] = pol(cx, cy, r, d0), [x1, y1] = pol(cx, cy, r, d1);
    const large = (d1 - d0) > 180 ? 1 : 0;
    return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }

  /**
   * makeGauge(el, opts)
   *  el    — .gauge container (gets svg + name + readout appended)
   *  opts  — { id, name, unit, min, max, value, accent (css color),
   *            zones: [{from,to,color,alpha}], majors, decimals, size }
   */
  function makeGauge(el, opts) {
    const o = Object.assign(
      { min: 0, max: 100, value: 50, decimals: 1, majors: 5, size: 128, unit: "%", zones: [] },
      opts
    );
    const S = o.size, cx = S / 2, cy = S / 2, R = S / 2 - 8;
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${S} ${S}`);
    svg.setAttribute("width", S); svg.setAttribute("height", S);

    const put = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(n); return n;
    };

    // chrome ring
    put("path", { d: arcPath(cx, cy, R, A0, A1), fill: "none", stroke: "#23232c", "stroke-width": 7, "stroke-linecap": "round" });

    // zone bands (the color that pops)
    for (const z of o.zones) {
      const d0 = A0 + ((z.from - o.min) / (o.max - o.min)) * SWEEP;
      const d1 = A0 + ((z.to   - o.min) / (o.max - o.min)) * SWEEP;
      put("path", { d: arcPath(cx, cy, R, d0, d1), fill: "none", stroke: z.color,
                    "stroke-width": 7, "stroke-linecap": "butt", opacity: z.alpha == null ? 0.85 : z.alpha });
    }

    // ticks + labels
    for (let i = 0; i <= o.majors * 4; i++) {
      const major = i % 4 === 0;
      const d = A0 + (i / (o.majors * 4)) * SWEEP;
      const [x0, y0] = pol(cx, cy, R - (major ? 11 : 7), d);
      const [x1, y1] = pol(cx, cy, R - 3, d);
      put("line", { x1: x0, y1: y0, x2: x1, y2: y1, stroke: major ? "#a8aeb9" : "#4a4f5b",
                    "stroke-width": major ? 1.6 : 1 });
      if (major) {
        const v = o.min + (i / (o.majors * 4)) * (o.max - o.min);
        const [tx, ty] = pol(cx, cy, R - 21, d);
        put("text", { x: tx, y: ty + 3, fill: "#767c89", "font-size": 8.5,
                      "text-anchor": "middle", "font-family": "Share Tech Mono, monospace" })
          .textContent = Math.round(v);
      }
    }

    // needle (white, glowing accent tip) + hub
    const needle = put("g", {});
    put("line", { x1: cx, y1: cy, x2: cx + R - 14, y2: cy, stroke: "#f4f7fb", "stroke-width": 2.4, "stroke-linecap": "round" }, needle);
    put("line", { x1: cx + R - 26, y1: cy, x2: cx + R - 14, y2: cy, stroke: o.accent, "stroke-width": 3.2,
                  "stroke-linecap": "round", filter: "" }, needle);
    put("line", { x1: cx, y1: cy, x2: cx - 12, y2: cy, stroke: "#f4f7fb", "stroke-width": 2.4, "stroke-linecap": "round" }, needle);
    put("circle", { cx, cy, r: 5.5, fill: "#0c0c10", stroke: "#e8ecf2", "stroke-width": 1.6 });
    put("circle", { cx, cy, r: 1.8, fill: o.accent });

    el.style.setProperty("--ac", o.accent);
    el.appendChild(svg);
    const nameEl = document.createElement("div");
    nameEl.className = "gname"; nameEl.textContent = `${o.id} · ${o.name}`;
    const readEl = document.createElement("div");
    readEl.className = "gread";
    const unitEl = document.createElement("div");
    unitEl.className = "gunit"; unitEl.textContent = o.unit;
    el.appendChild(nameEl); el.appendChild(readEl); el.appendChild(unitEl);

    // ---- animation state (stub feed) ----
    let target = o.value, shown = o.value, wobble = 0;

    function angleOf(v) {
      const f = Math.min(1, Math.max(0, (v - o.min) / (o.max - o.min)));
      return A0 + f * SWEEP;
    }
    function frame(t) {
      wobble = Math.sin(t / 900 + S) * (o.max - o.min) * 0.004;
      shown += (target + wobble - shown) * 0.08;
      needle.setAttribute("transform", `rotate(${angleOf(shown).toFixed(2)} ${cx} ${cy})`);
      readEl.innerHTML = `<b>${shown.toFixed(o.decimals)}</b>`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // gentle stub drift so the cluster feels alive
    const drift = setInterval(() => {
      target += (Math.random() - 0.5) * (o.max - o.min) * 0.012;
      target = Math.min(o.max, Math.max(o.min, target));
    }, 1400);

    return {
      el, opts: o,
      setTarget(v, hard) { target = Math.min(o.max, Math.max(o.min, v)); if (hard) shown = target; },
      getValue() { return shown; },
      stopDrift() { clearInterval(drift); },
    };
  }

  global.FORGE_GAUGES = { makeGauge };
})(window);
