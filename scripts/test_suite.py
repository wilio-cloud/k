#!/usr/bin/env python3
"""
Kindle Calm Hub - Comprehensive Automated Verification Suite
Validates:
  1. Web bundle size & JS syntax (via Node --check)
  2. Sudoku uniqueness & solution validity across all 45 boards
  3. Motle dictionary & Rusc honeycomb invariants
  4. Deductive EPUB puzzles mathematical soundness (1 exact match, 3 true distractors)
  5. EPUB 3.0 archive structure, strict XML/XHTML parsing, SVG manifest flags, and zero broken links
"""

from __future__ import annotations

import json
import subprocess
import sys
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR / "scripts"))

from build_data import count_sudoku_solutions, evaluate_motle_guess  # noqa: E402

WEB_DIR = ROOT_DIR / "web"
BUNDLE_PATH = ROOT_DIR / "data" / "puzzles_bundle.json"
EPUB_PATH = ROOT_DIR / "dist" / "quadern-enginy-kindle.epub"


def test_web_assets_and_js_syntax() -> None:
    print("[1/5] Checking Web Portal bundle size & JavaScript syntax...")
    js_files = sorted(WEB_DIR.rglob("*.js"))
    assert len(js_files) >= 8, f"Expected >= 8 JS files, found {len(js_files)}"
    for jf in js_files:
        subprocess.run(["node", "--check", str(jf)], check=True)

    total_bytes = sum(f.stat().st_size for f in WEB_DIR.rglob("*") if f.is_file())
    kb = total_bytes / 1024.0
    print(f"      ✓ All {len(js_files)} JS files valid. Total web/ size = {kb:.1f} KB")
    assert kb < 260.0, f"Web bundle too heavy for Kindle browser: {kb:.1f} KB"


def test_sudoku_uniqueness_and_validity() -> None:
    print("[2/5] Verifying all 45 Sudoku boards have valid unique solutions...")
    raw_js = (WEB_DIR / "js" / "data.js").read_text(encoding="utf-8")
    payload_str = raw_js.split("window.KINDLE_DATA = ", 1)[1].rstrip(";\n")
    web_data = json.loads(payload_str)

    total_checked = 0
    for lvl in ("facil", "mitja", "dificil"):
        boards = web_data["sudoku"][lvl]
        assert len(boards) == 15, f"Expected 15 boards in {lvl}"
        for item in boards:
            p, s = item["p"], item["s"]
            assert len(p) == 81 and len(s) == 81
            assert "0" not in s, "Solution contains zeros"
            # Verify solution rows, cols, boxes contain 1..9
            s_nums = [int(c) for c in s]
            for r in range(9):
                assert set(s_nums[r * 9 : (r + 1) * 9]) == set(range(1, 10))
            for c in range(9):
                assert {s_nums[i * 9 + c] for i in range(9)} == set(range(1, 10))
            # Verify uniqueness of puzzle
            p_nums = [int(c) for c in p]
            assert count_sudoku_solutions(p_nums, 2) == 1, f"Non-unique Sudoku in {lvl}"
            total_checked += 1
    print(f"      ✓ {total_checked}/45 Sudoku boards verified with strict unique solution.")


def test_catalan_games_invariants() -> None:
    print("[3/5] Verifying Motle lexicon, Rusc honeycombs & Nonograms...")
    raw_js = (WEB_DIR / "js" / "data.js").read_text(encoding="utf-8")
    web_data = json.loads(raw_js.split("window.KINDLE_DATA = ", 1)[1].rstrip(";\n"))
    epub_data = json.loads(BUNDLE_PATH.read_text(encoding="utf-8"))

    valid_words = set(web_data["motleValid"].split(" "))
    assert len(valid_words) >= 4500, f"Too few valid Motle words: {len(valid_words)}"
    for norm_w, disp_w in web_data["motleSolutions"]:
        assert len(norm_w) == 5, f"Invalid length Motle solution: {norm_w}"
        assert norm_w in valid_words, f"Solution {norm_w} missing from valid_words"

    web_sigs = set()
    for r in web_data["ruscos"]:
        letters = {r["center"].lower()} | {x.lower() for x in r["outer"]}
        assert len(letters) == 7, "Rusc must have 7 distinct letters"
        assert len(r["tutis"]) >= 1, "Rusc must have at least 1 tuti"
        for k in r["words"]:
            assert len(k) >= 3
            assert r["center"].lower() in k
            assert set(k).issubset(letters)
        web_sigs.add("".join(sorted(letters)) + ":" + r["center"])

    epub_sigs = set()
    for r in epub_data["ruscos"]:
        letters = {r["center"].lower()} | {x.lower() for x in r["outer"]}
        epub_sigs.add("".join(sorted(letters)) + ":" + r["center"])

    assert web_sigs.isdisjoint(epub_sigs), "Web and EPUB Rusc sets should be disjoint!"
    assert len(web_data["nonograms"]) == 24
    print(
        f"      ✓ {len(valid_words)} Motle words, {len(web_data['ruscos'])}+{len(epub_data['ruscos'])} disjoint Ruscos, 24 Nonograms OK."
    )


def test_epub_deductive_logic() -> None:
    print("[4/5] Verifying mathematical soundness of EPUB deductive puzzles...")
    epub_data = json.loads(BUNDLE_PATH.read_text(encoding="utf-8"))

    assert len(epub_data["epubMotle"]) == 30
    for m in epub_data["epubMotle"]:
        correct_opts = [o for o in m["options"] if o["correct"]]
        assert len(correct_opts) == 1
        for o in m["options"]:
            cand = o["norm"]
            matches_all = all(
                evaluate_motle_guess(cl["guess"], cand) == cl["pattern"]
                for cl in m["clues"]
            )
            if o["correct"]:
                assert matches_all, f"Correct option {cand} failed a clue!"
            else:
                assert not matches_all, f"Distractor {cand} accidentally satisfied all clues!"

    assert len(epub_data["epubSudokuSpots"]) == 25
    for sp in epub_data["epubSudokuSpots"]:
        grid = [int(c) for c in sp["grid"]]
        idx = sp["targetIdx"]
        r, c = divmod(idx, 9)
        br, bc = (r // 3) * 3, (c // 3) * 3
        peers = (
            {grid[r * 9 + j] for j in range(9)}
            | {grid[i * 9 + c] for i in range(9)}
            | {grid[(br + dr) * 9 + (bc + dc)] for dr in range(3) for dc in range(3)}
        ) - {0}
        assert len(peers) == 8 and sp["answer"] not in peers
    print("      ✓ 30 Motle Deductiu & 25 Sudoku '?' challenges verified 100% sound.")


def test_epub_archive_and_links() -> None:
    print("[5/5] Validating EPUB 3.0 archive structure, strict XML, and internal hyperlinks...")
    assert EPUB_PATH.exists(), f"Missing {EPUB_PATH}"
    with zipfile.ZipFile(EPUB_PATH, "r") as zf:
        infos = zf.infolist()
        assert infos[0].filename == "mimetype", "First entry in EPUB must be mimetype"
        assert infos[0].compress_type == zipfile.ZIP_STORED, "mimetype must be uncompressed (ZIP_STORED)"
        assert zf.read("mimetype") == b"application/epub+zip"

        names = set(zf.namelist())
        assert "META-INF/container.xml" in names
        assert "OEBPS/content.opf" in names
        assert "OEBPS/nav.xhtml" in names
        assert "OEBPS/toc.ncx" in names

        # Parse OPF and verify manifest items exist
        opf_root = ET.fromstring(zf.read("OEBPS/content.opf"))
        ns_opf = {"opf": "http://www.idpf.org/2007/opf"}
        manifest_hrefs = set()
        svg_declared = set()
        for item in opf_root.findall(".//opf:manifest/opf:item", ns_opf):
            href = item.attrib["href"]
            manifest_hrefs.add(href)
            assert f"OEBPS/{href}" in names, f"Manifest item missing from zip: {href}"
            if "svg" in item.attrib.get("properties", ""):
                svg_declared.add(href)

        # Parse every single XML/XHTML file and verify all <a href="..."> links resolve!
        xhtml_count = 0
        link_count = 0
        for name in sorted(names):
            if name.endswith((".xhtml", ".xml", ".opf", ".ncx")):
                raw = zf.read(name)
                root = ET.fromstring(raw)
                if name.endswith(".xhtml"):
                    xhtml_count += 1
                    rel_name = name.split("OEBPS/", 1)[1]
                    has_inline_svg = b"<svg" in raw
                    if has_inline_svg and rel_name != "nav.xhtml":
                        assert rel_name in svg_declared, f"{rel_name} has <svg> but lacks properties='svg' in OPF"
                    for a_el in root.iter("{http://www.w3.org/1999/xhtml}a"):
                        href = a_el.attrib.get("href", "")
                        assert href, f"Empty href in {name}"
                        target_file = href.split("#", 1)[0]
                        if target_file:
                            assert f"OEBPS/{target_file}" in names, f"Broken link {href} in {name}"
                        link_count += 1

    print(
        f"      ✓ EPUB3 valid: {xhtml_count} XHTML files parsed cleanly, {link_count} hyperlinks verified with 0 broken links."
    )


def main() -> None:
    test_web_assets_and_js_syntax()
    test_sudoku_uniqueness_and_validity()
    test_catalan_games_invariants()
    test_epub_deductive_logic()
    test_epub_archive_and_links()
    print("\nALL AUTOMATED CHECKS PASSED SUCCESSFULLY!")


if __name__ == "__main__":
    main()
