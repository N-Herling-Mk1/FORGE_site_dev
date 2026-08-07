/* AUTO-GENERATED from assets/data/help-screens.json — do not edit by hand.
   Exists because Chrome blocks fetch() of local .json under file://.
   The monitor loader tries the JSON first and falls back to this global. */
window.FORGE_HELP = {
  "_comment": "FORGE deck-interface monitor screens. Canonical source. Because file:// blocks fetch(), assets/js/help-screens.js carries an identical copy for offline use — regenerate it with tools/build-help.py after editing this file.",
  "version": 1,
  "screens": [
    {
      "id": "controls",
      "title": "// MONITOR — HELP",
      "lead": "deck controls",
      "rows": [
        {
          "k": "SCROLL",
          "v": "zoom"
        },
        {
          "k": "DRAG",
          "v": "grab / spin"
        },
        {
          "k": "LEFT PANEL",
          "v": "select a model"
        },
        {
          "k": "CLICK PLATE",
          "v": "open mode select"
        }
      ]
    },
    {
      "id": "select-model",
      "title": "// MONITOR — SELECT",
      "lead": "choosing a model",
      "rows": [
        {
          "k": "PANEL",
          "v": "select panel below to pick a model"
        },
        {
          "k": "DECK",
          "v": "or click a plate on the deck itself"
        },
        {
          "k": "THEN",
          "v": "choose FIDGET or FORGE mode"
        }
      ],
      "demo": "select"
    },
    {
      "id": "grab",
      "title": "// MONITOR — ORBIT",
      "lead": "moving the deck",
      "rows": [
        {
          "k": "MOUSE",
          "v": "click and drag to grab the deck"
        },
        {
          "k": "DRAG X",
          "v": "spin around the vertical axis"
        },
        {
          "k": "DRAG Y",
          "v": "raise / lower the elevation"
        },
        {
          "k": "RELEASE",
          "v": "deck settles and holds"
        }
      ],
      "demo": "orbit"
    },
    {
      "id": "zoom",
      "title": "// MONITOR — ZOOM",
      "lead": "framing the deck",
      "rows": [
        {
          "k": "WHEEL UP",
          "v": "zoom in toward the deck"
        },
        {
          "k": "WHEEL DOWN",
          "v": "pull back and out"
        },
        {
          "k": "READOUT",
          "v": "zoom key, top right, shows %"
        },
        {
          "k": "RANGE",
          "v": "clamped between 11 and 60"
        }
      ],
      "demo": "zoom"
    },
    {
      "id": "keys",
      "title": "// MONITOR — KEYS",
      "lead": "keyboard shortcuts",
      "rows": [
        {
          "k": "A",
          "v": "open FIDGET mode"
        },
        {
          "k": "B",
          "v": "open FORGE mode"
        },
        {
          "k": "ESC",
          "v": "close popup / cancel"
        },
        {
          "k": "ENTER",
          "v": "confirm selection"
        },
        {
          "k": "◀ ▶",
          "v": "cycle folder stack"
        }
      ]
    },
    {
      "id": "advice",
      "title": "// MONITOR — HELP",
      "lead": "help mode",
      "rows": [
        {
          "k": "TOGGLE",
          "v": "use ◁ ▷ below to page these screens"
        },
        {
          "k": "SCREENS",
          "v": "controls · select · orbit · zoom · keys"
        },
        {
          "k": "RESUME",
          "v": "idle returns to the synced deck log"
        }
      ],
      "flash": true
    }
  ]
};
