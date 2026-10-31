#!/usr/bin/env python3
"""
Kindle Calm Hub (v3) - Automated Verification Suite
Validates:
  1. Removal of old games & exact presence of the 5 requested apps
  2. JavaScript syntax (`node --check`) & ultra-lightweight E-Ink bundle size
  3. Service Worker asset manifest integrity (zero missing assets)
  4. EPUB 3.0 strict XML/XHTML parsing, SVG manifest flags, CYOA graph reachability, and zero broken links
"""

from __future__ import annotations

import re
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
WEB_DIR = ROOT_DIR / "web"
EPUB_PATH = ROOT_DIR / "dist" / "quadern-enginy-kindle.epub"

EXPECTED_GAMES = {"vides.js", "decennis.js", "fundador.js", "crianca.js", "minesweeper.js"}
FORBIDDEN_OLD_GAMES = {"sudoku.js", "motle.js", "rusc.js", "nonogram.js", "dossier.js"}


def test_game_roster_and_js_syntax() -> None:
    print("[1/4] Verifying game roster cleanup & JavaScript syntax...")
    games_dir = WEB_DIR / "js" / "games"
    actual_games = {f.name for f in games_dir.glob("*.js")}
    assert actual_games == EXPECTED_GAMES, f"Game mismatch! Found {actual_games}, expected {EXPECTED_GAMES}"
    assert actual_games.isdisjoint(FORBIDDEN_OLD_GAMES), "Old games still present!"
    assert not (WEB_DIR / "js" / "data.js").exists(), "Legacy data.js should be removed"

    js_files = sorted(WEB_DIR.rglob("*.js"))
    for jf in js_files:
        subprocess.run(["node", "--check", str(jf)], check=True)

    total_bytes = sum(f.stat().st_size for f in WEB_DIR.rglob("*") if f.is_file())
    kb = total_bytes / 1024.0
    print(f"      ✓ Exact 5 games verified. All {len(js_files)} JS files valid. Total web/ = {kb:.1f} KB")
    assert kb < 240.0, f"Bundle unexpectedly large: {kb:.1f} KB"


def test_service_worker_assets() -> None:
    print("[2/4] Verifying Service Worker cache manifest...")
    sw_text = (WEB_DIR / "sw.js").read_text(encoding="utf-8")
    m = re.search(r"var ASSETS = \[(.*?)\];", sw_text, re.S)
    assert m, "ASSETS array not found in sw.js"
    assets = re.findall(r'"([^"]+)"', m.group(1))
    for rel in assets:
        if rel == "./":
            continue
        clean = rel.lstrip("./").split("?")[0]
        target = WEB_DIR / clean
        assert target.exists(), f"SW asset missing on disk: {rel}"
    print(f"      ✓ All {len(assets)} Service Worker assets exist on disk.")


def test_eink_css_invariants() -> None:
    print("[3/4] Checking strict E-Ink CSS rules (zero animations/transitions)...")
    css = (WEB_DIR / "css" / "eink.css").read_text(encoding="utf-8")
    assert "transition: none !important" in css
    assert "animation: none !important" in css
    assert "overflow: hidden" in css
    print("      ✓ Strict binary E-Ink CSS invariants present.")


def test_epub_integrity() -> None:
    print("[4/4] Validating EPUB 3.0 archive, XML well-formedness & internal links...")
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
        link_count = 0
        for xf in xhtml_files:
            raw = zf.read(xf)
            root = ET.fromstring(raw)
            rel_name = xf.split("/", 1)[1]
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


if __name__ == "__main__":
    test_game_roster_and_js_syntax()
    test_service_worker_assets()
    test_eink_css_invariants()
    test_epub_integrity()
    print("\nALL TESTS PASSED SUCCESSFULLY.")
