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

    index.html   splash — strike-to-ignite (animated), ENTER →
    dash1.html   HOLO DECK — dash 1 + dash 2 combined. Three.js spinning console:
                 4 model plates (LLP · MUSIC GENRE · PHONON · TUTORIAL); clicking a
                 plate pops the [FIDGET] [FORGE] window → that model's page.
                 Top model rail (4 chips): click = deck auto-spins to that plate,
                 then the mode window opens. Keys 1–4 do the same; ?model= deep-links.
                 SOLAR palette locked; center emblem = forge flame outline over the
                 projector orb (assets/images/forge_outline.png, alpha-processed;
                 inline base64 fallback keeps the flame alive on file:// opens).
                 Extras: forge root (click orb), subsystem folder stacks (hex nodes),
                 bit-mask shards, deck gizmo.
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

## Splash tweaks vs forge_splash (4) (2).html

1. Phase rail (progress gauge) enlarged: 640px wide, 5px track, 15px nodes, 11px labels, raised clear of the tagline.
2. HMC animation (burn-in walkers + sample cloud) brightened: chain lines .16→.36 α + thicker, dots .5→.85, samples ~2× alpha.
3. ENTER_TARGET = "dash1.html".
