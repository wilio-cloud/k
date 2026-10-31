#!/usr/bin/env python3
"""
Kindle Calm Hub - Offline Interactive EPUB 3.0 Compiler
Generates `dist/quadern-enginy-kindle.epub` (100% Airplane-Mode compatible via Send to Kindle / USB).

Includes:
  - Chapter 1: 25 Ruscos Mentals (SVG Honeycomb + Prefix Hints + Full Normative Solutions)
  - Chapter 2: 30 Motle Deductiu puzzles (SVG E-Ink Clues + 4 Interactive Choices with Zero-Spoiler Feedback)
  - Chapter 3: 25 Casella Incògnita Sudoku puzzles (SVG 9x9 Grid + Interactive [1]..[9] Verification)
"""

from __future__ import annotations

import html
import json
import math
import uuid
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
BUNDLE_PATH = ROOT_DIR / "data" / "puzzles_bundle.json"
DIST_DIR = ROOT_DIR / "dist"
OUTPUT_EPUB = DIST_DIR / "quadern-enginy-kindle.epub"

BOOK_UUID = "urn:uuid:8f4e2c10-9b3a-4d7e-a612-kindlecalm2026"
BOOK_TITLE = "Quadern d'Enginy i Paraules (Mode Avió)"
BOOK_AUTHOR = "Racó Calmat · Kindle E-Ink"


EPUB_CSS = """\
/* Stylesheet optimized for Amazon Kindle E-Ink (KFX / KF8 / EPUB3) */
body {
  font-family: "Bookerly", Georgia, Palatino, serif;
  color: #000000;
  background-color: #ffffff;
  margin: 0;
  padding: 0.4em 0.6em;
  line-height: 1.4;
}

h1, h2, h3 {
  font-weight: bold;
  margin: 0.25em 0 0.35em 0;
  line-height: 1.2;
}

h1 { font-size: 1.45em; text-align: center; }
h2 { font-size: 1.15em; border-bottom: 2px solid #000000; padding-bottom: 0.2em; }
h3 { font-size: 1.02em; }

p {
  margin: 0.35em 0;
}

.center {
  text-align: center;
}

.subtle {
  font-size: 0.88em;
}

.svg-box {
  text-align: center;
  margin: 0.4em auto;
  page-break-inside: avoid;
  break-inside: avoid;
}

.btn-row {
  text-align: center;
  margin: 0.55em 0;
  page-break-inside: avoid;
  break-inside: avoid;
}

a.btn {
  display: inline-block;
  padding: 0.42em 0.78em;
  margin: 0.22em 0.18em;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #000000;
  background-color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95em;
}

a.btn-dark {
  display: inline-block;
  padding: 0.45em 0.85em;
  margin: 0.22em 0.18em;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #ffffff;
  background-color: #000000;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.95em;
}

a.btn-choice {
  display: block;
  padding: 0.48em 0.7em;
  margin: 0.35em auto;
  max-width: 17em;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #000000;
  background-color: #ffffff;
  text-decoration: none;
  font-weight: bold;
  font-family: monospace;
  font-size: 1.05em;
  text-align: center;
}

a.btn-num {
  display: inline-block;
  width: 2.1em;
  padding: 0.38em 0;
  margin: 0.18em 0.12em;
  border: 2px solid #000000;
  border-radius: 4px;
  color: #000000;
  background-color: #ffffff;
  text-decoration: none;
  font-family: monospace;
  font-weight: bold;
  font-size: 1.05em;
  text-align: center;
}

.verdict-box {
  border: 3px solid #000000;
  padding: 0.8em;
  margin: 0.8em 0;
  border-radius: 6px;
}

.verdict-title {
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 0.4em;
}

.words-box {
  border: 1px solid #000000;
  padding: 0.6em;
  margin: 0.5em 0;
  font-size: 0.92em;
  line-height: 1.5;
}

.index-grid a {
  display: inline-block;
  min-width: 2.5em;
  padding: 0.32em 0.45em;
  margin: 0.18em;
  border: 1px solid #000000;
  border-radius: 4px;
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  text-align: center;
  font-size: 0.9em;
}
"""


def wrap_xhtml(title: str, body_html: str) -> str:
    esc_title = html.escape(title)
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE html>\n'
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ca" lang="ca">\n'
        "<head>\n"
        '  <meta charset="UTF-8" />\n'
        f"  <title>{esc_title}</title>\n"
        '  <link rel="stylesheet" type="text/css" href="styles.css" />\n'
        "</head>\n"
        "<body>\n"
        f"{body_html}\n"
        "</body>\n"
        "</html>\n"
    )


# ==============================================================================
# CRISP MONOCHROME SVG GENERATORS FOR E-INK
# ==============================================================================

def hex_points(cx: float, cy: float, r: float) -> str:
    pts = []
    for k in range(6):
        ang = math.radians(60 * k)
        px = cx + r * math.cos(ang)
        py = cy + r * math.sin(ang)
        pts.append(f"{px:.1f},{py:.1f}")
    return " ".join(pts)


def svg_honeycomb(center: str, outer: List[str]) -> str:
    """Renders a 7-hexagon Catalan Rusc diagram with black center hex."""
    r = 34.0
    dx = 1.5 * r + 4.0
    dy = math.sqrt(3) * r + 4.0
    cx, cy = 150.0, 125.0

    # Positions around center: top, top-right, bottom-right, bottom, bottom-left, top-left
    coords = [
        (cx, cy - dy),
        (cx + dx, cy - dy / 2),
        (cx + dx, cy + dy / 2),
        (cx, cy + dy),
        (cx - dx, cy + dy / 2),
        (cx - dx, cy - dy / 2),
    ]

    parts = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250" width="240" height="200">'
    ]
    # Outer hexagons
    for i, (ox, oy) in enumerate(coords):
        letter = html.escape(outer[i])
        pts = hex_points(ox, oy, r)
        parts.append(
            f'<polygon points="{pts}" fill="#ffffff" stroke="#000000" stroke-width="3" />'
            f'<text x="{ox:.1f}" y="{oy + 9:.1f}" text-anchor="middle" '
            f'font-family="monospace" font-size="26" font-weight="bold" fill="#000000">{letter}</text>'
        )
    # Center hexagon (solid black fill)
    c_pts = hex_points(cx, cy, r)
    c_let = html.escape(center)
    parts.append(
        f'<polygon points="{c_pts}" fill="#000000" stroke="#000000" stroke-width="3" />'
        f'<text x="{cx:.1f}" y="{cy + 9:.1f}" text-anchor="middle" '
        f'font-family="monospace" font-size="27" font-weight="bold" fill="#ffffff">{c_let}</text>'
    )
    parts.append("</svg>")
    return "".join(parts)


def svg_motle_clues(clues: List[Dict]) -> str:
    """Renders 3 played Motle rows with geometric monochrome E-Ink coding."""
    tile = 44
    gap = 6
    rows = len(clues)
    w = 5 * tile + 4 * gap + 16
    h = rows * tile + (rows - 1) * gap + 16

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
    ]
    for r_idx, cl in enumerate(clues):
        word = cl["guess"]
        pat = cl["pattern"]
        y = 8 + r_idx * (tile + gap)
        for c_idx in range(5):
            x = 8 + c_idx * (tile + gap)
            ch = html.escape(word[c_idx])
            st = pat[c_idx]
            cx = x + tile / 2
            cy = y + tile / 2

            if st == 2:
                # Exact: solid black square, white bold letter
                parts.append(
                    f'<rect x="{x}" y="{y}" width="{tile}" height="{tile}" rx="4" fill="#000000" stroke="#000000" stroke-width="2.5" />'
                    f'<text x="{cx}" y="{cy + 8}" text-anchor="middle" font-family="monospace" font-size="23" font-weight="bold" fill="#ffffff">{ch}</text>'
                )
            elif st == 1:
                # Present elsewhere: dashed thick circle + corner ring dot
                parts.append(
                    f'<rect x="{x}" y="{y}" width="{tile}" height="{tile}" rx="4" fill="#ffffff" stroke="#000000" stroke-width="1" />'
                    f'<circle cx="{cx}" cy="{cy}" r="{tile / 2 - 4}" fill="none" stroke="#000000" stroke-width="3" stroke-dasharray="6,3" />'
                    f'<circle cx="{x + tile - 7}" cy="{y + 7}" r="2.5" fill="none" stroke="#000000" stroke-width="1.5" />'
                    f'<text x="{cx}" y="{cy + 8}" text-anchor="middle" font-family="monospace" font-size="22" font-weight="bold" fill="#000000">{ch}</text>'
                )
            else:
                # Absent: dotted border + diagonal strike line
                parts.append(
                    f'<rect x="{x}" y="{y}" width="{tile}" height="{tile}" rx="4" fill="#ffffff" stroke="#777777" stroke-width="1.5" stroke-dasharray="2,3" />'
                    f'<text x="{cx}" y="{cy + 8}" text-anchor="middle" font-family="monospace" font-size="21" fill="#666666">{ch}</text>'
                    f'<line x1="{x + 9}" y1="{y + tile - 9}" x2="{x + tile - 9}" y2="{y + 9}" stroke="#555555" stroke-width="1.5" />'
                )
    parts.append("</svg>")
    return "".join(parts)


def svg_sudoku_spot(grid_str: str, target_idx: int) -> str:
    """Renders a 9x9 Sudoku SVG highlighting cell `target_idx` with a bold '?' and margin arrows."""
    cell = 32
    pad = 18
    size_px = 9 * cell
    total_w = size_px + 2 * pad
    total_h = size_px + 2 * pad
    tr, tc = divmod(target_idx, 9)

    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {total_w} {total_h}" width="295" height="295">'
    ]

    # Margin arrows pointing to target row & column for effortless eye tracking
    arrow_y = pad + tr * cell + cell / 2
    arrow_x = pad + tc * cell + cell / 2
    parts.append(
        f'<polygon points="4,{arrow_y - 5} 13,{arrow_y} 4,{arrow_y + 5}" fill="#000000" />'
        f'<polygon points="{arrow_x - 5},4 {arrow_x},13 {arrow_x + 5},4" fill="#000000" />'
    )

    # Cells & numbers
    for idx in range(81):
        r, c = divmod(idx, 9)
        x = pad + c * cell
        y = pad + r * cell
        val = grid_str[idx]

        if idx == target_idx:
            parts.append(
                f'<rect x="{x + 2}" y="{y + 2}" width="{cell - 4}" height="{cell - 4}" fill="#000000" />'
                f'<text x="{x + cell / 2}" y="{y + cell / 2 + 7}" text-anchor="middle" '
                f'font-family="monospace" font-size="21" font-weight="bold" fill="#ffffff">?</text>'
            )
        elif val != "0":
            parts.append(
                f'<text x="{x + cell / 2}" y="{y + cell / 2 + 6}" text-anchor="middle" '
                f'font-family="monospace" font-size="18" font-weight="bold" fill="#000000">{val}</text>'
            )

    # Grid lines
    for i in range(10):
        sw = "3" if i % 3 == 0 else "1"
        stroke = "#000000" if i % 3 == 0 else "#666666"
        pos = pad + i * cell
        parts.append(
            f'<line x1="{pad}" y1="{pos}" x2="{pad + size_px}" y2="{pos}" stroke="{stroke}" stroke-width="{sw}" />'
            f'<line x1="{pos}" y1="{pad}" x2="{pos}" y2="{pad + size_px}" stroke="{stroke}" stroke-width="{sw}" />'
        )

    parts.append("</svg>")
    return "".join(parts)


def explain_wrong_sudoku_digit(grid_str: str, target_idx: int, chosen_digit: int) -> str:
    """Finds why `chosen_digit` violates Sudoku rules at `target_idx`."""
    d_ch = str(chosen_digit)
    r, c = divmod(target_idx, 9)
    for j in range(9):
        if grid_str[r * 9 + j] == d_ch:
            return (
                f"El número {chosen_digit} no pot anar a la casella ? (fila {r + 1}, columna {c + 1}) "
                f"perquè a la mateixa fila {r + 1} ja hi ha un {chosen_digit} (a la columna {j + 1})."
            )
    for i in range(9):
        if grid_str[i * 9 + c] == d_ch:
            return (
                f"El número {chosen_digit} no pot anar a la casella ? (fila {r + 1}, columna {c + 1}) "
                f"perquè a la mateixa columna {c + 1} ja hi ha un {chosen_digit} (a la fila {i + 1})."
            )
    br, bc = (r // 3) * 3, (c // 3) * 3
    for dr in range(3):
        for dc in range(3):
            if grid_str[(br + dr) * 9 + (bc + dc)] == d_ch:
                return (
                    f"El número {chosen_digit} no pot anar a la casella ? "
                    f"perquè dins del seu mateix quadrant 3×3 ja hi figura un {chosen_digit} "
                    f"(fila {br + dr + 1}, columna {bc + dc + 1})."
                )
    return f"El número {chosen_digit} impedeix completar la resta del quadrant sense contradiccions."


# ==============================================================================
# EPUB BUILDER
# ==============================================================================

def build_epub() -> Path:
    if not BUNDLE_PATH.exists():
        raise FileNotFoundError(f"Missing {BUNDLE_PATH}. Run scripts/build_data.py first.")

    bundle = json.loads(BUNDLE_PATH.read_text(encoding="utf-8"))
    ruscos: List[Dict] = bundle["ruscos"]
    motles: List[Dict] = bundle["epubMotle"]
    spots: List[Dict] = bundle["epubSudokuSpots"]

    DIST_DIR.mkdir(parents=True, exist_ok=True)

    # Track (filename, xhtml_content, has_svg, in_linear_spine)
    pages: List[Tuple[str, str, bool, bool]] = []

    # 1. Cover & Home Hub Page
    cover_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 540" width="300" height="405">'
        '<rect x="8" y="8" width="384" height="524" fill="#ffffff" stroke="#000000" stroke-width="6"/>'
        '<rect x="20" y="20" width="360" height="500" fill="none" stroke="#000000" stroke-width="2"/>'
        '<text x="200" y="110" text-anchor="middle" font-family="Georgia, serif" font-size="20" letter-spacing="3">RACÓ CALMAT · E-INK</text>'
        '<line x1="70" y1="135" x2="330" y2="135" stroke="#000000" stroke-width="2"/>'
        '<text x="200" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold">QUADERN</text>'
        '<text x="200" y="235" text-anchor="middle" font-family="Georgia, serif" font-size="32" font-weight="bold">D’ENGINY</text>'
        '<text x="200" y="275" text-anchor="middle" font-family="Georgia, serif" font-size="24">I PARAULES</text>'
        '<polygon points="200,320 226,335 226,365 200,380 174,365 174,335" fill="#000000"/>'
        '<text x="200" y="357" text-anchor="middle" font-family="monospace" font-size="22" font-weight="bold" fill="#ffffff">★</text>'
        '<text x="200" y="435" text-anchor="middle" font-family="Georgia, serif" font-size="16">80 reptes interactius en català</text>'
        '<text x="200" y="462" text-anchor="middle" font-family="monospace" font-size="14">100% MODE AVIÓ · SENSE PANTALLES BRILLANTS</text>'
        '</svg>'
    )
    cover_body = (
        f'<div class="svg-box">{cover_svg}</div>'
        '<div class="btn-row"><a class="btn-dark" href="hub.xhtml">Obre l’Índex Interactiu →</a></div>'
    )
    pages.append(("cover.xhtml", wrap_xhtml(BOOK_TITLE, cover_body), True, True))

    # Hub Index Page
    rusc_links = "".join(
        f'<a href="rusc_{i + 1:02d}.xhtml">{i + 1}</a>' for i in range(len(ruscos))
    )
    motle_links = "".join(
        f'<a href="motle_{i + 1:02d}.xhtml">{i + 1}</a>' for i in range(len(motles))
    )
    spot_links = "".join(
        f'<a href="spot_{i + 1:02d}.xhtml">{i + 1}</a>' for i in range(len(spots))
    )

    hub_body = (
        "<h1>Índex de Reptes</h1>"
        '<p class="center subtle">Toca qualsevol número per anar directament al repte. Pensat per jugar en <b>Mode Avió</b> i amb llum frontal suau.</p>'
        "<h2>1. Ruscos Mentals (25 reptes)</h2>"
        '<p class="subtle">Troba mentalment (o en paper) tantes paraules com puguis i descobreix el <i>tuti</i> ocult.</p>'
        f'<div class="index-grid">{rusc_links}</div>'
        "<h2>2. Motle Deductiu (30 reptes)</h2>"
        '<p class="subtle">Analitza 3 intents previs i dedueix l’única paraula catalana que compleix totes les pistes.</p>'
        f'<div class="index-grid">{motle_links}</div>'
        "<h2>3. Casella Incògnita Sudoku (25 reptes)</h2>"
        '<p class="subtle">Dedueix per lògica visual quin número va a la casella marcada amb <b>?</b> i toca’l per verificar-ho.</p>'
        f'<div class="index-grid">{spot_links}</div>'
    )
    pages.append(("hub.xhtml", wrap_xhtml("Índex de Reptes", hub_body), False, True))

    # ==========================================================================
    # CHAPTER 1: 25 RUSCOS MENTALS
    # ==========================================================================
    for idx, r in enumerate(ruscos):
        num = idx + 1
        fn_main = f"rusc_{num:02d}.xhtml"
        fn_hint = f"rusc_{num:02d}_hint.xhtml"
        fn_sol = f"rusc_{num:02d}_sol.xhtml"
        next_href = f"rusc_{num + 1:02d}.xhtml" if num < len(ruscos) else "motle_01.xhtml"

        total_w = len(r["words"])
        n_tutis = len(r["tutis"])
        svg_h = svg_honeycomb(r["center"], r["outer"])

        mestre_pts = int(r["maxScore"] * 0.70)
        notable_pts = int(r["maxScore"] * 0.30)

        body_main = (
            f"<h2>Rusc Mental #{num} de {len(ruscos)}</h2>"
            f'<div class="svg-box">{svg_h}</div>'
            f'<p class="center">Lletra central obligatòria: <b>{html.escape(r["center"])}</b><br/>'
            f"Total admès: <b>{total_w} mots</b> · Tutis ocults: <b>{n_tutis}</b><br/>"
            f'<span class="subtle">Notable: {notable_pts} p. · Mestre: {mestre_pts} p. · Màxim: {r["maxScore"]} p.</span></p>'
            '<div class="btn-row">'
            f'<a class="btn" href="{fn_hint}">◈ Pista de Prefixos</a>'
            f'<a class="btn-dark" href="{fn_sol}">✓ Solucions</a>'
            "</div>"
            '<div class="btn-row">'
            '<a class="btn" href="hub.xhtml">Índex</a>'
            f'<a class="btn" href="{next_href}">Següent →</a>'
            "</div>"
        )
        pages.append((fn_main, wrap_xhtml(f"Rusc Mental #{num}", body_main), True, True))

        # Hint page
        prefixes: Dict[str, int] = {}
        for k in r["words"]:
            pr = k[:2].upper()
            prefixes[pr] = prefixes.get(pr, 0) + 1
        pref_str = " · ".join(f"<b>{html.escape(k)}</b> ({v})" for k, v in sorted(prefixes.items()))
        tuti_starts = ", ".join(
            f"<b>{html.escape(t[:2].upper())}…</b> ({len(t)} lletres)" for t in r["tutis"]
        )

        body_hint = (
            f"<h2>Pistes · Rusc #{num}</h2>"
            f"<p><b>Inici dels Tutis ({n_tutis}):</b> {tuti_starts}</p>"
            "<p><b>Recompte per les dues primeres lletres:</b></p>"
            f'<div class="words-box">{pref_str}</div>'
            '<div class="btn-row">'
            f'<a class="btn-dark" href="{fn_main}">← Torna al Rusc #{num}</a>'
            f'<a class="btn" href="{fn_sol}">Veure Solucions</a>'
            "</div>"
        )
        pages.append((fn_hint, wrap_xhtml(f"Pistes Rusc #{num}", body_hint), False, False))

        # Solutions page
        tutis_esc = ", ".join(f"<b>★ {html.escape(t)}</b>" for t in r["tutis"])
        all_disp = sorted(r["words"].values())
        words_esc = " · ".join(html.escape(w) for w in all_disp)

        body_sol = (
            f"<h2>Solucions · Rusc #{num}</h2>"
            f"<p><b>Tutis:</b> {tutis_esc}</p>"
            f"<p><b>Tots els {total_w} mots normatius:</b></p>"
            f'<div class="words-box">{words_esc}</div>'
            '<div class="btn-row">'
            f'<a class="btn" href="{fn_main}">← Rusc #{num}</a>'
            '<a class="btn" href="hub.xhtml">Índex</a>'
            f'<a class="btn-dark" href="{next_href}">Següent →</a>'
            "</div>"
        )
        pages.append((fn_sol, wrap_xhtml(f"Solucions Rusc #{num}", body_sol), False, False))

    # ==========================================================================
    # CHAPTER 2: 30 MOTLE DEDUCTIU CHALLENGES
    # ==========================================================================
    for idx, m in enumerate(motles):
        num = idx + 1
        fn_main = f"motle_{num:02d}.xhtml"
        next_href = f"motle_{num + 1:02d}.xhtml" if num < len(motles) else "spot_01.xhtml"
        svg_m = svg_motle_clues(m["clues"])

        choices_html = []
        for opt in m["options"]:
            lbl = opt["label"]
            fn_opt = f"motle_{num:02d}_{lbl}.xhtml"
            disp_up = html.escape(opt["disp"].upper())
            choices_html.append(
                f'<a class="btn-choice" href="{fn_opt}">{lbl} · {disp_up}</a>'
            )

            if opt["correct"]:
                verdict_body = (
                    f"<h2>Motle Deductiu #{num} · Resolució</h2>"
                    '<div class="verdict-box">'
                    '<div class="verdict-title">✓ Deducció Exacta!</div>'
                    f"<p>{html.escape(opt['feedback'])}</p>"
                    "</div>"
                    '<div class="btn-row">'
                    '<a class="btn" href="hub.xhtml">Índex</a>'
                    f'<a class="btn-dark" href="{next_href}">Següent repte →</a>'
                    "</div>"
                )
            else:
                verdict_body = (
                    f"<h2>Motle Deductiu #{num} · Pista</h2>"
                    '<div class="verdict-box">'
                    '<div class="verdict-title">✗ No encaixa amb totes les pistes</div>'
                    f"<p>{html.escape(opt['feedback'])}</p>"
                    "</div>"
                    '<div class="btn-row">'
                    f'<a class="btn-dark" href="{fn_main}">← Torna a provar el repte #{num}</a>'
                    "</div>"
                )
            pages.append((fn_opt, wrap_xhtml(f"Motle #{num} Opció {lbl}", verdict_body), False, False))

        body_m = (
            f"<h2>Motle Deductiu #{num} de {len(motles)}</h2>"
            f'<div class="svg-box">{svg_m}</div>'
            '<p class="center subtle"><b>■ Negra:</b> lloc exacte · <b>◌◦ Cercle:</b> un altre lloc · <b>Ratllada:</b> absent</p>'
            f'<div>{"".join(choices_html)}</div>'
            '<div class="btn-row">'
            '<a class="btn" href="hub.xhtml">Índex</a>'
            f'<a class="btn" href="{next_href}">Salta →</a>'
            "</div>"
        )
        pages.append((fn_main, wrap_xhtml(f"Motle Deductiu #{num}", body_m), True, True))

    # ==========================================================================
    # CHAPTER 3: 25 CASELLA INCÒGNITA (SUDOKU)
    # ==========================================================================
    for idx, sp in enumerate(spots):
        num = idx + 1
        fn_main = f"spot_{num:02d}.xhtml"
        next_href = f"spot_{num + 1:02d}.xhtml" if num < len(spots) else "hub.xhtml"
        svg_s = svg_sudoku_spot(sp["grid"], sp["targetIdx"])

        num_btns = []
        for digit in range(1, 10):
            fn_d = f"spot_{num:02d}_d{digit}.xhtml"
            num_btns.append(f'<a class="btn-num" href="{fn_d}">{digit}</a>')

            if digit == sp["answer"]:
                d_body = (
                    f"<h2>Casella Incògnita #{num} · Correcte!</h2>"
                    '<div class="verdict-box">'
                    f'<div class="verdict-title">✓ Exacte: és el {digit}!</div>'
                    f"<p>{html.escape(sp['explanation'])}</p>"
                    "</div>"
                    '<div class="btn-row">'
                    '<a class="btn" href="hub.xhtml">Índex</a>'
                    f'<a class="btn-dark" href="{next_href}">Següent repte →</a>'
                    "</div>"
                )
            else:
                reason = explain_wrong_sudoku_digit(sp["grid"], sp["targetIdx"], digit)
                d_body = (
                    f"<h2>Casella Incògnita #{num} · Revisió</h2>"
                    '<div class="verdict-box">'
                    f'<div class="verdict-title">✗ No pot ser el {digit}</div>'
                    f"<p>{html.escape(reason)}</p>"
                    "</div>"
                    '<div class="btn-row">'
                    f'<a class="btn-dark" href="{fn_main}">← Torna a mirar el tauler #{num}</a>'
                    "</div>"
                )
            pages.append((fn_d, wrap_xhtml(f"Sudoku #{num} tria {digit}", d_body), False, False))

        body_s = (
            f"<h2>Casella Incògnita #{num} de {len(spots)}</h2>"
            f'<div class="svg-box">{svg_s}</div>'
            f'<p class="center subtle">Quin número va a la casella <b>?</b> (fila {sp["row"]}, col. {sp["col"]})?</p>'
            f'<div class="btn-row">{"".join(num_btns)}</div>'
            '<div class="btn-row">'
            '<a class="btn" href="hub.xhtml">Índex</a>'
            f'<a class="btn" href="{next_href}">Salta →</a>'
            "</div>"
        )
        pages.append((fn_main, wrap_xhtml(f"Casella Incògnita #{num}", body_s), True, True))

    # ==========================================================================
    # NAVIGATION DOCUMENTS (EPUB3 nav.xhtml + NCX)
    # ==========================================================================
    nav_body = (
        '<nav epub:type="toc" id="toc">\n'
        "  <h1>Taula de Continguts</h1>\n"
        "  <ol>\n"
        '    <li><a href="cover.xhtml">Portada</a></li>\n'
        '    <li><a href="hub.xhtml">Índex Interactiu</a></li>\n'
        '    <li><a href="rusc_01.xhtml">1. Ruscos Mentals (25 reptes)</a></li>\n'
        '    <li><a href="motle_01.xhtml">2. Motle Deductiu (30 reptes)</a></li>\n'
        '    <li><a href="spot_01.xhtml">3. Casella Incògnita Sudoku (25 reptes)</a></li>\n'
        "  </ol>\n"
        "</nav>"
    )
    nav_xhtml = wrap_xhtml("Taula de Continguts", nav_body)

    toc_ncx = f"""<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="{BOOK_UUID}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>{html.escape(BOOK_TITLE)}</text></docTitle>
  <navMap>
    <navPoint id="np-1" playOrder="1"><navLabel><text>Portada</text></navLabel><content src="cover.xhtml"/></navPoint>
    <navPoint id="np-2" playOrder="2"><navLabel><text>Índex Interactiu</text></navLabel><content src="hub.xhtml"/></navPoint>
    <navPoint id="np-3" playOrder="3"><navLabel><text>1. Ruscos Mentals</text></navLabel><content src="rusc_01.xhtml"/></navPoint>
    <navPoint id="np-4" playOrder="4"><navLabel><text>2. Motle Deductiu</text></navLabel><content src="motle_01.xhtml"/></navPoint>
    <navPoint id="np-5" playOrder="5"><navLabel><text>3. Casella Incògnita Sudoku</text></navLabel><content src="spot_01.xhtml"/></navPoint>
  </navMap>
</ncx>
"""

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest_items = [
        '    <item id="css" href="styles.css" media-type="text/css"/>',
        '    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>',
        '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    ]
    spine_items = []

    for i, (fname, _, has_svg, is_linear) in enumerate(pages):
        item_id = f"p{i:04d}"
        props = ' properties="svg"' if has_svg else ""
        manifest_items.append(
            f'    <item id="{item_id}" href="{fname}" media-type="application/xhtml+xml"{props}/>'
        )
        linear_attr = "yes" if is_linear else "no"
        spine_items.append(f'    <itemref idref="{item_id}" linear="{linear_attr}"/>')

    content_opf = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid" xml:lang="ca">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">{BOOK_UUID}</dc:identifier>
    <dc:title>{html.escape(BOOK_TITLE)}</dc:title>
    <dc:creator>{html.escape(BOOK_AUTHOR)}</dc:creator>
    <dc:language>ca</dc:language>
    <dc:description>80 reptes interactius d'enginy, vocabulari i lògica per jugar al Kindle en Mode Avió.</dc:description>
    <meta property="dcterms:modified">{now_iso}</meta>
  </metadata>
  <manifest>
{chr(10).join(manifest_items)}
  </manifest>
  <spine toc="ncx">
{chr(10).join(spine_items)}
  </spine>
</package>
"""

    container_xml = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/epub+zip"/>
  </rootfiles>
</container>
"""

    # Pack EPUB archive (mimetype MUST be first entry and uncompressed)
    with zipfile.ZipFile(OUTPUT_EPUB, "w") as zf:
        zf.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        zf.writestr("META-INF/container.xml", container_xml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/styles.css", EPUB_CSS, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/toc.ncx", toc_ncx, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/nav.xhtml", nav_xhtml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/content.opf", content_opf, compress_type=zipfile.ZIP_DEFLATED)
        for fname, content, _, _ in pages:
            zf.writestr(f"OEBPS/{fname}", content, compress_type=zipfile.ZIP_DEFLATED)

    print(
        f"Built {OUTPUT_EPUB} ({OUTPUT_EPUB.stat().st_size / 1024:.1f} KB, "
        f"{len(pages)} interactive XHTML screens)"
    )
    return OUTPUT_EPUB


if __name__ == "__main__":
    build_epub()
