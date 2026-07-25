# FORGE_site_dev

Stage-C design repo — ui / design / flow only. **All data is stubbed.**

## Boot the site

`boot_site_mk1.ps1` lives at the **repo root** (same level as `index.html`) — it serves
whatever folder it sits in, so root placement makes `http://127.0.0.1:<port>/` land on
the splash.

    Unblock-File .\boot_site_mk1.ps1     # once, after download (mark-of-the-web)
    .\boot_site_mk1.ps1                  # boot

What it does: finds `py`/`python` → picks the first free port in 8000–8020
(127.0.0.1 bind only — no firewall popup, clear of the 5000-range turf war) →
starts a hidden `http.server` → probes until it answers → **prints the address**
→ **auto-opens your default browser on it** → streams the live request log in
the console.

    .\boot_site_mk1.ps1 -Port 8123       # pin a port
    .\boot_site_mk1.ps1 -NoOpen          # start server, skip the browser launch

Stop with **Ctrl+C** — the server is shut down for you (no orphaned python).
If boot fails, the script dumps python's own output for diagnosis.

Manual fallback (no script):

    py -m http.server 8000               # then open http://localhost:8000/

Double-clicking the .html files also works (the flame emblem has an inline
fallback for `file://`), but served-over-localhost is the intended loop.

## Flow (locked from the flow chart)

    index.html   splash — STRIKE TO IGNITE v3: the brand LOCKUP (crisp flame +
                 F·O·R·G·E + POSTERIOR OBSERVATORY, canvas-drawn) is the LARGE
                 central hero. Click anywhere on it — the CLICK POINT is the
                 ignition point (Enter seeds center). Zap flash (0.35s) → the
                 lockup burns off over 2.0s via the existing burn-front engine
                 (no graph sequence), phase rail = pure burn progress
                 (STRIKE/IGNITE/BURN/ETCH/REVEAL) — revealing the full FORGE
                 P(θ|D) card beneath. Reveal HOLDS; second click/Enter ("ENTER
                 THE OBSERVATORY") → dash1. Reduced-motion: instant reveal.
                 Flame: assets/images/forge_flame_hero.png (sharpened 900px). →
    dash1.html   HOLO DECK — dash 1 + dash 2 combined. Three.js spinning console:
                 4 model plates (LLP · MUSIC GENRE · PHONON · TUTORIAL); clicking a
                 plate pops the [FIDGET] [FORGE] window → that model's page.
                 LAYOUT: left panel (360px) = green-cathode SCREEN (fixed
                 240px face — no height jumping between HELP and facts) over
                 the 4 model buttons, with open space below for future
                 fixtures. Deck-area TOP-LEFT = flame + F·O·R·G·E brand (300px,
                 matches the zoom key's footprint) with a 190×174 BACK TO
                 SPLASH tile under it (matches the gizmo block); TOP-RIGHT =
                 ZOOM key (magnifier, % readout, meter) over the
                 deck-orientation gizmo (EL +17° standard). Boot ends with a
                 CONTROL DEMO outro: a zoom breath (SCROLL help row lights up),
                 then a gimbal tumble-twist (DRAG row lights up), settling back
                 at standard view — any input cancels it. Model buttons: hover = deck
                 snaps that plate to front, HOLDS it there, the center bulb
                 charges with that model's accent and projects its beam onto
                 the panel; zoom settles to normal 65% in 0.5s; leaving releases
                 the hold and deck animation resumes · click = opens the mode
                 window) — then the ZOOM key (magnifier icon, % readout, meter)
                 and the deck-orientation gizmo (standard view: EL +17°).
                 Highlighted plates grow larger and drop additive opacity so
                 the text reads crisp. SCREEN: amber chassis bezel, green
                 phosphor face, scanlines, refresh sweep, status LEDs, blinking
                 block cursor. HELP rows scroll in staggered; DECK LOG facts
                 TYPE on at ~55 cps, monochrome green (model accents stay on
                 the plates / beam).
                 BOOT — FOUR PHASES (~8s): (1) framed on the flame at max zoom
                 — the ring disk sits FLAT, a thin edge-on line behind it —
                 hold 1.2s; (2) zoom out + crane over the flat Saturn disk;
                 (3) the disks POP up into 3d space — tiers split to ±3.4 with
                 an overshoot, tilted rings trail in; (4) the orb PRINTS the
                 rest — beam sweeps a revolution, plates / hex nodes / shards
                 materialize under it with a flash pop, bands flicker in.
                 Any input skips straight to the finished deck; reduced-motion
                 gets it instant. Boot plays ONLY splash→deck: arrivals with
                 ?model= (backlinks from FORGE/FIDGET) land on the finished deck.
                 DECK LOG: when idle, the beam aperiodically (6–14s gaps)
                 self-scans a hex node / bit-mask shard / model plate and the
                 MONITOR shows that element's fun fact (source in its accent).
                 CLICKING a hex or shard fires the same scan manually — beam
                 locks on, fact in the monitor, 6s dwell. 17 facts mapped
                 across LLLA · HMC · BUNDLES · GAUGES · AUDIT · TELEMETRY,
                 SHARD-01…07, and the four models. Any interaction cancels a
                 scan and the monitor drops back to HELP. Keys 1–4 quick-select;
                 ?model= deep-links. (Parked: per-hex folder stacks + the
                 bit-mask editor are no longer click-reachable — core root
                 stack remains via the orb.)
                 SOLAR palette locked; center emblem = forge flame outline over the
                 projector orb (assets/images/forge_outline.png, alpha-processed;
                 inline base64 fallback keeps the flame alive on file:// opens).
                 Extras: forge root (click orb), subsystem folder stacks (hex nodes),
                 bit-mask shards.
    dash2.html   redirect → dash1.html (kept so old links don't 404)
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
Holo deck (dash1) runs the SOLAR machinery palette: #ffb24a base · #ff4d2e accent ·
#ffe9c8 hot on warm black #070402; model accents pop against it.

## Splash tweaks vs forge_splash (4) (2).html (superseded by STRIKE v2 above)

1. Phase rail (progress gauge) enlarged: 640px wide, 5px track, 15px nodes, 11px labels, raised clear of the tagline.
2. HMC animation (burn-in walkers + sample cloud) brightened: chain lines .16→.36 α + thicker, dots .5→.85, samples ~2× alpha.
3. ENTER_TARGET = "dash1.html".
