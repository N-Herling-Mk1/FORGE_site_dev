#!/usr/bin/env python3
"""Regenerate assets/js/help-screens.js from assets/data/help-screens.json.

Run after editing the JSON. The .js twin exists only because Chrome refuses to
fetch() local .json files under file://; the deck loads the JSON when served
over http and falls back to the global this script writes.
"""
import io, json, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
src = root / "assets" / "data" / "help-screens.json"
dst = root / "assets" / "js" / "help-screens.js"

data = json.load(io.open(src, encoding="utf-8"))
body = json.dumps(data, indent=2, ensure_ascii=False)
io.open(dst, "w", encoding="utf-8").write(
    "/* AUTO-GENERATED from assets/data/help-screens.json — do not edit by hand.\n"
    "   Exists because Chrome blocks fetch() of local .json under file://.\n"
    "   The monitor loader tries the JSON first and falls back to this global. */\n"
    "window.FORGE_HELP = " + body + ";\n")
print("wrote %s (%d screens)" % (dst.relative_to(root), len(data["screens"])))
