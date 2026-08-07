/* help-nav.js — monitor paging + HELP button.
   Reads the screens from assets/data/help-screens.json when the page is served
   over http; falls back to window.FORGE_HELP (assets/js/help-screens.js) under
   file://, where Chrome blocks fetch() of local JSON.

   While the user is paging, window.__helpManual is true and dash1's own
   monitorHelp()/monitorFact() bow out; after IDLE_MS of no interaction control
   returns to the deck-synced log. */
(function () {
  "use strict";
  var IDLE_MS = 14000;

  var monText = document.getElementById("mon-text"),
      monMode = document.getElementById("mon-mode"),
      monSrc  = document.getElementById("mon-src"),
      screenEl = document.getElementById("screen"),
      nav = document.getElementById("mon-nav"),
      page = document.getElementById("mon-page"),
      helpBtn = document.getElementById("helpbtn"),
      quitBtn = document.getElementById("quithelp");
  if (!monText || !nav) return;

  var screens = [], idx = 0, idleTimer = null;

  function render(i, flash) {
    if (!screens.length) return;
    idx = (i % screens.length + screens.length) % screens.length;
    var S = screens[idx];
    window.__helpManual = true;
    if (monMode) monMode.textContent = S.title || "// MONITOR \u2014 HELP";
    if (monSrc) monSrc.textContent = S.lead || "";
    monText.className = "help";
    monText.innerHTML = S.rows.map(function (r, k) {
      return '<div class="hrow" style="animation-delay:' + (k * 0.07).toFixed(2) +
             's"><b>' + r.k + "</b><span>" + r.v + "</span></div>";
    }).join("");
    page.textContent = (idx + 1) + " / " + screens.length;
    if (quitBtn) quitBtn.classList.add("on");
    if (flash && screenEl) {
      screenEl.classList.remove("flash");
      void screenEl.offsetWidth;
      screenEl.classList.add("flash");
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(release, IDLE_MS);
  }

  function release() {
    window.__helpManual = false;
    if (screenEl) screenEl.classList.remove("flash");
    if (typeof window.__monitorHelp === "function") window.__monitorHelp();
    if (page) page.textContent = "\u2014";
    if (quitBtn) quitBtn.classList.remove("on");
  }

  nav.addEventListener("click", function (e) {
    if (e.target.closest("#quithelp")) { clearTimeout(idleTimer); release(); return; }
    var b = e.target.closest("button[data-d]");
    if (b) render(idx + (+b.dataset.d), false);
  });
  if (helpBtn) helpBtn.addEventListener("click", function () {
    var a = 0, k;
    for (k = 0; k < screens.length; k++) if (screens[k].flash) { a = k; break; }
    render(a, true);
  });

  function boot(d) {
    if (!d || !d.screens || !d.screens.length) return;
    screens = d.screens;
    page.textContent = "\u2014";
  }

  if (location.protocol === "file:") { boot(window.FORGE_HELP); return; }
  fetch("assets/data/help-screens.json")
    .then(function (r) { return r.json(); })
    .then(boot)
    .catch(function () { boot(window.FORGE_HELP); });
})();
