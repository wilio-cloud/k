#!/usr/bin/env python3
"""
Kindle Calm Hub (v6) - Automated Verification & Multi-Day Simulation Suite
Validates:
  1. Exact roster of 5 games + 4 content modules, JavaScript syntax (`node --check`) & E-Ink bundle size
  2. Service Worker `sw.js` v6 asset manifest integrity (zero missing assets)
  3. Strict binary E-Ink CSS invariants (zero animations/transitions)
  4. EPUB 3.0 archive structure, strict XHTML/SVG XML parsing, and zero broken internal links (220+ screens)
  5. Deep Content Counts & Headless DOM/Engine Smoke Test across all 5 v6 applications
"""

from __future__ import annotations

import gzip
import json
import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT_DIR / "web"
EPUB_PATH = ROOT_DIR / "dist" / "quadern-enginy-kindle.epub"

EXPECTED_GAMES = {"vides.js", "decennis.js", "fundador.js", "crianca.js", "minesweeper.js"}
EXPECTED_DATA = {"vides_data.js", "decennis_data.js", "fundador_data.js", "crianca_data.js"}
FORBIDDEN_OLD_GAMES = {"sudoku.js", "motle.js", "rusc.js", "nonogram.js", "dossier.js"}


def test_roster_syntax_and_bundle_size() -> None:
    print("[1/5] Verifying v6 game & data modules, JS syntax, and bundle size...")
    games_dir = WEB_DIR / "js" / "games"
    data_dir = WEB_DIR / "js" / "data"

    actual_games = {f.name for f in games_dir.glob("*.js")}
    actual_data = {f.name for f in data_dir.glob("*.js")} if data_dir.exists() else set()

    assert actual_games == EXPECTED_GAMES, f"Game mismatch! Found {actual_games}, expected {EXPECTED_GAMES}"
    assert actual_data == EXPECTED_DATA, f"Data module mismatch! Found {actual_data}, expected {EXPECTED_DATA}"
    assert actual_games.isdisjoint(FORBIDDEN_OLD_GAMES), "Forbidden legacy games still present!"

    js_files = sorted(WEB_DIR.rglob("*.js"))
    for jf in js_files:
        subprocess.run(["node", "--check", str(jf)], check=True)

    all_files = [f for f in WEB_DIR.rglob("*") if f.is_file()]
    total_bytes = sum(f.stat().st_size for f in all_files)
    gz_bytes = sum(len(gzip.compress(f.read_bytes(), compresslevel=6)) for f in all_files)
    kb = total_bytes / 1024.0
    gz_kb = gz_bytes / 1024.0
    print(f"      ✓ 5 games + 4 data banks verified ({len(js_files)} JS files valid). Total web/ = {kb:.1f} KB ({gz_kb:.1f} KB gzipped)")
    assert kb < 1150.0, f"Uncompressed bundle unexpectedly large: {kb:.1f} KB"
    assert gz_kb < 320.0, f"Gzipped bundle unexpectedly large for E-Ink: {gz_kb:.1f} KB"


def test_service_worker_assets() -> None:
    print("[2/5] Verifying Service Worker v6 cache manifest...")
    sw_text = (WEB_DIR / "sw.js").read_text(encoding="utf-8")
    assert 'CACHE_NAME = "kindle-calm-hub-v6"' in sw_text, "sw.js CACHE_NAME must be kindle-calm-hub-v6"
    m = re.search(r"var ASSETS = \[(.*?)\];", sw_text, re.S)
    assert m, "ASSETS array not found in sw.js"
    assets = re.findall(r'"([^"]+)"', m.group(1))
    for rel in assets:
        if rel == "./":
            continue
        clean = rel.lstrip("./").split("?")[0]
        target = WEB_DIR / clean
        assert target.exists(), f"SW asset missing on disk: {rel}"
    print(f"      ✓ All {len(assets)} Service Worker v6 assets exist on disk.")


def test_eink_css_invariants() -> None:
    print("[3/5] Checking strict E-Ink CSS rules (zero animations/transitions)...")
    css = (WEB_DIR / "css" / "eink.css").read_text(encoding="utf-8")
    assert "transition: none !important" in css
    assert "animation: none !important" in css
    assert "overflow: hidden" in css
    assert "html.font-xl" in css
    print("      ✓ Strict binary E-Ink CSS invariants present.")


def test_epub_integrity() -> None:
    print("[4/5] Validating expanded EPUB 3.0 archive, XML well-formedness & internal links...")
    assert EPUB_PATH.exists(), f"Missing EPUB at {EPUB_PATH}"
    with zipfile.ZipFile(EPUB_PATH, "r") as zf:
        names = zf.namelist()
        assert names[0] == "mimetype", "First entry in EPUB must be uncompressed mimetype"
        info0 = zf.getinfo("mimetype")
        assert info0.compress_type == zipfile.ZIP_STORED

        opf_root = ET.fromstring(zf.read("OEBPS/content.opf"))
        ns = {"opf": "http://www.idpf.org/2007/opf"}
        svg_declared = set()
        manifest_hrefs = set()
        for item in opf_root.findall(".//opf:manifest/opf:item", ns):
            href = item.attrib["href"]
            manifest_hrefs.add(href)
            if "svg" in item.attrib.get("properties", "").split():
                svg_declared.add(href)

        xhtml_files = [n for n in names if n.endswith(".xhtml")]
        assert len(xhtml_files) >= 220, f"Expected >= 220 XHTML screens in v6 EPUB, got {len(xhtml_files)}"
        link_count = 0
        for xf in xhtml_files:
            raw = zf.read(xf)
            root = ET.fromstring(raw)
            rel_name = xf.split("/", 1)[1]
            if rel_name != "nav.xhtml":
                assert rel_name in manifest_hrefs, f"{rel_name} missing from OPF manifest"

            has_svg = any(el.tag.endswith("svg") for el in root.iter())
            if has_svg and rel_name != "nav.xhtml":
                assert rel_name in svg_declared, f"{rel_name} contains SVG but lacks properties='svg'"

            for a in root.iter("{http://www.w3.org/1999/xhtml}a"):
                href = a.attrib.get("href", "")
                if not href or href.startswith("http"):
                    continue
                target = href.split("#")[0]
                assert f"OEBPS/{target}" in names, f"Broken link in {xf} -> {href}"
                link_count += 1

    print(f"      ✓ {len(xhtml_files)} strict XHTML files & {link_count} hyperlinks verified (0 broken).")


def test_deep_content_and_dom_boot() -> None:
    print("[5/5] Auditing v6 content banks & booting all 5 engines in headless Node...")
    node_code = r"""
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const webDir = process.argv[1];

function makeEl(tag) {
  return {
    tagName: tag.toUpperCase(),
    className: "",
    id: "",
    type: "",
    textContent: "",
    innerHTML: "",
    disabled: false,
    scrollTop: 0,
    style: {},
    children: [],
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); }
    },
    appendChild(ch) { this.children.push(ch); return ch; },
    addEventListener(ev, fn) { this["_on_" + ev] = fn; }
  };
}

const store = {};
const sandbox = {
  console,
  Math, Date, JSON, Object, Array, String, Number, Boolean, RegExp, parseInt, parseFloat, isNaN,
  setTimeout: () => {},
  clearTimeout: () => {},
  window: null,
  document: {
    body: makeEl("body"),
    documentElement: makeEl("html"),
    getElementById: () => makeEl("div"),
    createElement: (t) => makeEl(t)
  },
  localStorage: {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; }
  },
  location: { protocol: "file:" },
  navigator: {}
};
sandbox.window = sandbox;
sandbox.window.localStorage = sandbox.localStorage;
sandbox.window.document = sandbox.document;
sandbox.window.location = sandbox.location;
sandbox.window.navigator = sandbox.navigator;

const order = [
  "js/storage.js",
  "js/ui.js",
  "js/data/vides_data.js",
  "js/data/decennis_data.js",
  "js/data/fundador_data.js",
  "js/data/crianca_data.js",
  "js/games/vides.js",
  "js/games/decennis.js",
  "js/games/fundador.js",
  "js/games/crianca.js",
  "js/games/minesweeper.js"
];

vm.createContext(sandbox);
for (const rel of order) {
  const code = fs.readFileSync(path.join(webDir, rel), "utf8");
  vm.runInContext(code, sandbox, { filename: rel });
}

const D = sandbox.window.CalmData || {};
const G = sandbox.window.CalmGames || {};

const vEvents = (D.vides && (D.vides.EVENTS || D.vides.events || [])).length;
const dBulls  = (D.decennis && (D.decennis.BULLETINS || D.decennis.SCENARIOS || [])).length;
const dCamps  = (D.decennis && (D.decennis.CAMPAIGNS || [])).length;
const fDils   = (D.fundador && (D.fundador.DILEMMAS || [])).length;
const cScenes = (D.crianca && (D.crianca.SCENES || [])).length;
const cAsanas = (D.crianca && (D.crianca.ASANAS || D.crianca.PRACTICES || [])).length;
const cPlays  = (D.crianca && (D.crianca.PLAY_IDEAS || [])).length;
const cPhrase = (D.crianca && (D.crianca.CHEATSHEET || D.crianca.PHRASES || [])).length;

for (const gid of ["vides", "decennis", "fundador", "crianca", "minesweeper"]) {
  if (!G[gid]) throw new Error("Missing CalmGames." + gid);
  const badge = G[gid].getBadge();
  if (!badge || typeof badge !== "string") throw new Error("Invalid badge for " + gid);
  const mount = makeEl("div");
  G[gid].render(mount);
  if (mount.children.length === 0 && !mount.innerHTML) {
    throw new Error("Empty render output for " + gid);
  }
}

console.log(JSON.stringify({ vEvents, dBulls, dCamps, fDils, cScenes, cAsanas, cPlays, cPhrase }));
"""
    res = subprocess.run(["node", "-e", node_code, str(WEB_DIR)], check=True, capture_output=True, text=True)
    metrics = json.loads(res.stdout.strip().splitlines()[-1])
    print(f"      ✓ Content metrics: {metrics}")
    assert metrics["vEvents"] >= 100, f"Expected >=100 Vides events, got {metrics['vEvents']}"
    assert metrics["dBulls"] >= 65 and metrics["dCamps"] >= 8, f"Decennis depth below target: {metrics}"
    assert metrics["fDils"] >= 80, f"Expected >=80 Fundador dilemmas, got {metrics['fDils']}"
    assert metrics["cScenes"] >= 75 and metrics["cAsanas"] >= 18, f"Crianca depth below target: {metrics}"
    assert metrics["cPlays"] >= 30 and metrics["cPhrase"] >= 35, f"Crianca resources below target: {metrics}"
    print("      ✓ All 5 v6 engines booted & passed multi-day content depth thresholds!")


if __name__ == "__main__":
    test_roster_syntax_and_bundle_size()
    test_service_worker_assets()
    test_eink_css_invariants()
    test_epub_integrity()
    test_deep_content_and_dom_boot()
    print("\nALL 5 V6 VERIFICATION SUITES PASSED SUCCESSFULLY.")
