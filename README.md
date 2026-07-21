# FORGE_site_dev

Stage-C design repo — ui / design / flow only. **All data is stubbed.**

## Flow (locked from the flow chart)

    index.html   splash — strike-to-ignite (animated), ENTER →
    dash1.html   model select toggle dash: LLP · MUSIC GENRE · PHONON · TUTORIAL
    dash2.html   per-model mode select: [FIDGET] [FORGE]
    fidget.html  hands-on demo stub
    forge.html   THE dashboard — 4 tenet gauges, console, graph stage, controls
    audit.html   generate-audit target (opens in a new tab)

## The dashboard (forge.html)

- top-left: MODEL LOADED (name, bundle LEDs)
- top-right: G1–G4 — the four tenets condensed into gauges
    G1 POSTERIOR  % data-determined directions at τ      (cyan)
    G2 DATA·FRAC  % σ gain per doubling of data           (gold)
    G3 HMC        % LLLA↔HMC fidelity, R̂-gated           (flame)
    G4 ATTRIB     % top-5 focus of dσ/dφ                  (magenta)
- mid-left console: user text alerts · model data · gauge legend · graph map
- mid-right: graph stage, ◀▶ toggle, ◯ expand popup
- bottom: user controls (τ, data fraction, mc samples, example) · RUN FULL HMC · GENERATE AUDIT ↗

Stub couplings that sell the design: τ slider ⇄ G1 + posterior/eigen graphs,
data-fraction slider ⇄ G2 + sweep graph, RUN FULL HMC dips/recovers G3.

## Palette

Black/grey stage (#060608 → #1b1b22) so the pop colors carry:
cyan #2DD4FF · gold #FFC857 · flame #FF7A0D · ember #FF4D1F · magenta #FF2D7A · ok #37E08B.
Fonts: Orbitron (display) + Share Tech Mono.

## Splash tweaks vs forge_splash (4) (2).html

1. Phase rail (progress gauge) enlarged: 640px wide, 5px track, 15px nodes, 11px labels, raised clear of the tagline.
2. HMC animation (burn-in walkers + sample cloud) brightened: chain lines .16→.36 α + thicker, dots .5→.85, samples ~2× alpha.
3. ENTER_TARGET = "dash1.html".
