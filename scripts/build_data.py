#!/usr/bin/env python3
"""
Kindle Calm Hub - Data & Puzzle Pipeline (Catalan Lexicon, Sudoku, Nonograms, EPUB Logic)
Generates:
  - web/js/data.js (compact, ES5/ES6 compatible bundle for Kindle browser)
  - data/puzzles_bundle.json (structured data for the offline EPUB3 generator & test suite)
"""

from __future__ import annotations

import json
import os
import random
import re
import subprocess
import unicodedata
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT_DIR / "data" / "raw_softcatala"
DATA_DIR = ROOT_DIR / "data"
WEB_JS_DIR = ROOT_DIR / "web" / "js"

SOFTCATALA_BASE = "https://raw.githubusercontent.com/Softcatala/catalan-dict-tools/master/diccionari-arrel"
SOFTCATALA_FILES = [
    "noms-fdic.txt",
    "adjectius-fdic.txt",
    "verbs-fdic.txt",
    "adverbis-lt.txt",
    "resta-lt.txt",
]

# Curated seed of everyday, evocative Catalan words (5 normalized letters for Motle)
# Used to prioritize recognizable solutions while still validating against Softcatala LT dictionary.
CURATED_COMMON_SEEDS = [
    "aigua", "airet", "albar", "album", "àlbum", "alè", "aleta", "algues", "amica", "amiga",
    "amorós", "ample", "ampla", "ànima", "anell", "àngel", "anís", "anyal", "aplec", "arbre",
    "arena", "aroma", "arròs", "aspre", "aspra", "astre", "atles", "aturar", "avenç", "aving",
    "avió", "badia", "balla", "banca", "banda", "barca", "barri", "bassa", "bastó", "beure",
    "blanc", "blava", "boira", "bolca", "bomba", "bonic", "bossa", "botó", "brasa", "brava",
    "breu", "brisa", "broll", "broma", "branca", "bruix", "buidar", "busca", "cabal", "cabra",
    "cacau", "cadir", "caure", "caixa", "caliu", "calma", "calor", "camí", "campa", "canal",
    "cançó", "canta", "canvi", "capça", "caput", "caram", "cargo", "carné", "carta", "casal",
    "casca", "casta", "cauen", "causa", "cavar", "cel·la", "cendra", "cerca", "cerol", "cesta",
    "cicle", "cigró", "cimer", "cinta", "cirer", "cistell", "ciutat", "clara", "clau", "clima",
    "closa", "cobla", "cobre", "cocó", "cofre", "colla", "colom", "color", "colze", "comte",
    "conca", "conte", "copia", "còpia", "corba", "corda", "corna", "corró", "córrer", "costa",
    "cotó", "cotxe", "coure", "covar", "crema", "creta", "criar", "crida", "crist", "crost",
    "cruel", "cuina", "culpa", "curar", "cursa", "curta", "dansa", "darrer", "datil", "dàtil",
    "debat", "deure", "dijous", "dinar", "diner", "ditet", "divan", "doble", "dolça", "dolor",
    "donar", "dona", "doral", "dormo", "dubte", "dues", "dulce", "durar", "edició", "efect",
    "eina", "eixam", "eixir", "elogi", "embús", "emès", "enllà", "entrar", "època", "equip",
    "ermàs", "error", "escala", "escut", "espai", "espès", "espia", "espiga", "estel", "estil",
    "estiu", "estol", "etapa", "èxit", "faula", "favor", "febre", "feina", "feliç", "ferma",
    "ferro", "festa", "fetge", "fibra", "figa", "filar", "final", "finor", "fira", "física",
    "flama", "flaire", "flauta", "florir", "flota", "fluix", "focal", "fogar", "fonda", "fondo",
    "fonta", "forat", "força", "forma", "forn", "fosca", "fòssil", "franja", "frase", "freda",
    "fresc", "frens", "fruita", "fugir", "fulla", "fumar", "fusta", "futur", "gàbia", "gaita",
    "galta", "ganes", "ganivet", "gansa", "garba", "gatet", "gaudi", "gelat", "gemec", "gener",
    "genoll", "gerra", "gerro", "gesta", "gebre", "girar", "glacera", "glaçó", "globus", "glòria",
    "goma", "gorja", "gorra", "gota", "gràcia", "graó", "grapa", "grava", "greix", "gremi",
    "grisa", "groga", "gruix", "guant", "guapa", "guiar", "guineu", "guix", "hàbit", "hamac",
    "herba", "heroi", "hivern", "homen", "honor", "horta", "hoste", "hotel", "humit", "humor",
    "icona", "ideal", "igual", "imatge", "imant", "índex", "indi", "inici", "illa", "jardi",
    "jardí", "jersei", "joia", "jove", "jugar", "juliol", "junta", "jurar", "justa", "labial",
    "llac", "llaga", "llamp", "llana", "llarg", "llauna", "llavi", "llei", "llenties", "lleny",
    "lleó", "llepa", "llera", "llest", "lletó", "lleu", "lliçó", "lliga", "llima", "lliri",
    "llisa", "llit", "lliure", "lloba", "lloc", "lloga", "llom", "lluny", "lluna", "llumí",
    "lluir", "lògic", "lucre", "madur", "màgia", "maig", "maina", "major", "malalt", "malla",
    "mama", "manar", "manca", "maner", "màniga", "manta", "març", "marca", "marge", "marí",
    "marina", "massa", "matar", "matí", "matís", "medir", "meló", "menja", "menys", "merit",
    "mèrit", "mesos", "metall", "meu", "midó", "miga", "millor", "minar", "minva", "mirar",
    "missa", "mitja", "mòbil", "model", "molí", "molla", "molsa", "molta", "món", "monja",
    "mora", "moral", "mosca", "motiu", "motor", "moure", "munt", "mural", "museu", "músic",
    "nadar", "nadal", "nafra", "naix", "natja", "natura", "naval", "nebot", "nedar", "negar",
    "negra", "negre", "neula", "nevar", "niuet", "nivell", "noble", "noces", "noia", "només",
    "norma", "nostra", "notar", "novell", "nucli", "nuesa", "núvol", "obaga", "obeir", "obert",
    "oblit", "obrar", "obrer", "ocell", "ocàs", "ocult", "odiar", "ofici", "oferir", "oliva",
    "olor", "ombra", "omplir", "onada", "oncle", "òpera", "opció", "oral", "ordre", "orella",
    "orgue", "orígen", "orina", "orlar", "ornar", "osset", "ovella", "pàgina", "pagar", "país",
    "palla", "palma", "palau", "paner", "pany", "paper", "parar", "parc", "paret", "parla",
    "part", "passa", "pasta", "patir", "pausa", "pauta", "pebre", "pedaça", "pedra", "pegar",
    "peix", "pelar", "pena", "penja", "pensa", "perdre", "perla", "però", "pesar", "pesta",
    "petit", "petó", "piano", "picar", "pilar", "pilota", "pinar", "pinça", "pinta", "pinya",
    "pipa", "pista", "pitjó", "plaça", "plaga", "plana", "planta", "plata", "platja", "plega",
    "plena", "ploma", "plora", "pluja", "poble", "pobre", "poda", "podar", "poder", "poema",
    "poeta", "polir", "polla", "polpa", "pols", "poma", "pomer", "ponç", "pont", "popa",
    "porc", "porta", "posar", "post", "pouar", "prada", "prat", "preu", "presa", "prima",
    "prims", "proa", "prosa", "prova", "pruna", "pujar", "punta", "puny", "puré", "quadre",
    "quasi", "quatre", "queda", "queix", "crema", "quilo", "quina", "quota", "ràbia", "ullal",
    "ràdio", "raïm", "rajar", "rama", "ramat", "rampa", "ranxo", "ràpid", "rasar", "rasca",
    "rasta", "ratlla", "ratolí", "raó", "rebost", "rebre", "recel", "regal", "regar", "regla",
    "regne", "reina", "remar", "remei", "remor", "renda", "renou", "repòs", "resum", "retir",
    "repte", "reüll", "revers", "ric", "riera", "rigor", "rima", "rimar", "racó", "riure",
    "rival", "roba", "robar", "robot", "roda", "rodar", "rodó", "roig", "roja", "romà",
    "ronda", "ronca", "rosa", "rosada", "roure", "rovell", "ruïna", "ulleres", "rumor", "rural",
    "russa", "ruta", "saber", "sabor", "sabó", "sacseig", "safata", "sàvia", "sageta", "salat",
    "salar", "saló", "salsa", "salta", "salut", "salvar", "samar", "sang", "santa", "sardina",
    "sastre", "secà", "sega", "segar", "segell", "segle", "segon", "segur", "selva", "sembla",
    "sempre", "senda", "seny", "senyal", "era", "serra", "servei", "setè", "setze", "seure",
    "sever", "sèrie", "xiula", "sigla", "signe", "silenci", "símbol", "sínia", "sisè", "situar",
    "sobre", "soci", "sòcia", "sofà", "sogra", "sogre", "solar", "solc", "soldat", "soler",
    "sòlid", "solta", "somni", "sonar", "sopa", "sopar", "sorda", "sorra", "sortir", "sostre",
    "suau", "suar", "subtil", "sucar", "sucre", "suïssa", "suma", "sumar", "super", "suport",
    "surar", "surt", "tabac", "taca", "tacar", "tacte", "tall", "talla", "taló", "tanca",
    "tanta", "tapa", "tapar", "tarda", "tasca", "tassa", "tasta", "taula", "tauró", "teatre",
    "teix", "tela", "tema", "temor", "temps", "tenda", "tendre", "tenir", "tensa", "teoria",
    "terç", "terme", "terra", "tesi", "testa", "teula", "tèbia", "timó", "tinta", "tipus",
    "tirar", "tisora", "títol", "tocar", "tòfona", "tomba", "tona", "tonel", "tòpic", "torba",
    "torna", "torre", "torta", "torxa", "tossir", "total", "trama", "trampa", "trapa", "trau",
    "trenc", "trena", "tren", "tresor", "treure", "triar", "tribu", "triga", "trist", "trona",
    "tronc", "tropa", "trobar", "truita", "túnel", "turó", "tutor", "últim", "ombra", "ungla",
    "unió", "unir", "unitat", "untar", "urbà", "urgent", "urna", "usar", "útil", "vaca",
    "vacant", "vagar", "vagó", "vall", "valor", "vals", "vapor", "vara", "variar", "vas",
    "vasta", "veïna", "veure", "vetlla", "veler", "vena", "venda", "vendre", "venir", "vent",
    "verda", "verge", "verí", "vers", "vespa", "vestir", "veto", "viatge", "vida", "vidre",
    "vigent", "vigor", "vila", "vinagre", "vincle", "vinya", "viola", "virar", "virus", "visió",
    "vista", "vital", "viuda", "viure", "vivaç", "ocal", "vocal", "voga", "volar", "volcà",
    "voler", "volta", "volum", "vora", "votar", "xafar", "xai", "xalet", "xamba", "xamfrà",
    "xarop", "xarxa", "xat", "xerra", "xifra", "ximple", "xinesa", "xiular", "xocar", "xocolata",
    "xop", "xoriguer", "xutar", "zebra", "zel", "zona",
]


def ensure_softcatala_files() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    for fname in SOFTCATALA_FILES:
        target = RAW_DIR / fname
        if not target.exists() or target.stat().st_size == 0:
            url = f"{SOFTCATALA_BASE}/{fname}"
            print(f"Downloading {fname}...")
            subprocess.run(["curl", "-fsSL", url, "-o", str(target)], check=True)


def normalize_motle(word: str) -> Optional[str]:
    """
    Normalize a Catalan word for 5-letter Motle:
    - Keeps Ç as distinct letter 'Ç'
    - Converts l·l / l-l -> LL
    - Strips accents/diaeresis on vowels (à->A, è/é->E, í/ï->I, ò/ó->O, ú/ü->U)
    - Rejects hyphens, spaces, apostrophes, numbers, ñ, etc.
    """
    w = word.strip().lower()
    w = w.replace("l·l", "ll")
    if not w:
        return None
    out = []
    trans = {
        "à": "A", "á": "A",
        "è": "E", "é": "E",
        "í": "I", "ï": "I",
        "ò": "O", "ó": "O",
        "ú": "U", "ü": "U",
        "ç": "Ç",
    }
    for ch in w:
        if ch in trans:
            out.append(trans[ch])
        elif "a" <= ch <= "z":
            out.append(ch.upper())
        else:
            return None
    return "".join(out)


def normalize_rusc(word: str) -> Optional[str]:
    """
    Normalize a Catalan word for Paraulògic / El Rusc:
    - l·l -> ll
    - ç -> c (standard Paraulògic rule so 'C' forms 'cançó', 'plaça', 'força')
    - Strips vowel accents/diaeresis
    - Lowercase a-z only, length >= 3
    """
    m = normalize_motle(word)
    if not m:
        return None
    r = m.replace("Ç", "C").lower()
    if len(r) < 3:
        return None
    if not re.fullmatch(r"[a-z]+", r):
        return None
    return r


def parse_softcatala_lexicon() -> Tuple[Dict[str, str], Dict[str, str]]:
    """
    Returns:
      - motle_dict: {NORM5: normative_display_word}
      - rusc_dict: {norm_rusc: normative_display_word}
    Only keeps general dictionary words (fonts containing LT or DIEC, excluding obsolete/dialect-only).
    """
    ensure_softcatala_files()
    motle_dict: Dict[str, str] = {}
    rusc_dict: Dict[str, str] = {}

    bracket_re = re.compile(r"\[.*?\]")

    for fname in SOFTCATALA_FILES:
        fpath = RAW_DIR / fname
        with fpath.open("r", encoding="utf-8") as fh:
            for raw_line in fh:
                line = raw_line.strip()
                if not line or line.startswith("#"):
                    continue
                # Check source dictionary tags if present
                if "fonts:" in line:
                    meta = line.split("=", 1)[1] if "=" in line else ""
                    # Keep standard general lexicon (LT / DIEC / GDLC), skip pure medical/sigla/AVL-only
                    if not any(tag in meta for tag in ("LT", "DIEC")):
                        continue
                    if "sigla" in meta or "simbol" in meta or "data" in meta:
                        continue

                head = line.split("=", 1)[0]
                head = bracket_re.sub("", head).strip()
                # Split masculine / feminine pairs like "abaixador abaixadora" or slash variants
                tokens = re.split(r"[\s,/]+", head)
                for tok in tokens:
                    tok = tok.strip()
                    if not tok or not tok[0].islower():
                        continue
                    if any(ch.isdigit() for ch in tok):
                        continue

                    nm = normalize_motle(tok)
                    if nm and len(nm) == 5:
                        # Prefer accented display form if collision exists, or shorter/standard
                        if nm not in motle_dict:
                            motle_dict[nm] = tok

                    nr = normalize_rusc(tok)
                    if nr and 3 <= len(nr) <= 14:
                        if nr not in rusc_dict:
                            rusc_dict[nr] = tok

    return motle_dict, rusc_dict


def select_motle_solutions(motle_dict: Dict[str, str], rng: random.Random) -> List[List[str]]:
    """
    Select ~600 high-quality, recognizable 5-letter Catalan words for Motle daily/free targets.
    """
    selected: Dict[str, str] = {}

    # 1. Include all curated seeds that are 5 letters and validated in Softcatala
    for w in CURATED_COMMON_SEEDS:
        nm = normalize_motle(w)
        if nm and len(nm) == 5 and nm in motle_dict:
            selected[nm] = motle_dict[nm]

    # 2. Add clean, common-pattern 5-letter lemmas from Softcatala (avoiding rare chemical/archaic suffixes)
    common_endings = (
        "ar", "er", "ir", "re", "or", "at", "ut", "ia", "ió", "al", "el", "il",
        "ol", "ul", "an", "en", "in", "on", "un", "as", "es", "is", "os", "us",
        "et", "ot", "it", "ca", "ga", "na", "ra", "la", "ta", "da", "sa", "pa",
        "ma", "ba", "va", "xa", "ça", "ny", "ll", "nt", "rt", "st", "lt", "nc",
    )
    rare_substrings = ("kx", "w", "yy", "zz", "qq", "aa", "ii", "uu", "oo")
    candidates = []
    for nm, disp in sorted(motle_dict.items()):
        if nm in selected:
            continue
        low = disp.lower()
        if any(bad in low for bad in rare_substrings):
            continue
        if any(ch in nm for ch in ("W", "K", "Y")):
            continue
        # Count vowels (healthy Catalan 5-letter words have 2 or 3 vowels)
        vowels = sum(1 for c in nm if c in "AEIOU")
        if vowels not in (2, 3):
            continue
        if low.endswith(common_endings):
            candidates.append((nm, disp))

    rng.shuffle(candidates)
    for nm, disp in candidates:
        if len(selected) >= 620:
            break
        selected[nm] = disp

    items = [[nm, disp] for nm, disp in selected.items()]
    rng.shuffle(items)
    return items


def build_rusc_puzzles(rusc_dict: Dict[str, str], rng: random.Random, count: int = 60) -> List[Dict]:
    """
    Pre-computes balanced 7-letter Paraulògic ("El Rusc") puzzles:
    - 7 unique letters (2 or 3 vowels)
    - At least 1 'tuti' (pangram using all 7 letters)
    - Between 28 and 78 total valid words
    """
    # Group words by frozenset of letters (only words with <= 7 distinct letters)
    by_letterset: Dict[frozenset, List[Tuple[str, str]]] = {}
    pangram_sets: List[frozenset] = []

    for norm_w, disp_w in rusc_dict.items():
        if any(c in norm_w for c in "wky"):
            continue
        lset = frozenset(norm_w)
        if len(lset) <= 7:
            by_letterset.setdefault(lset, []).append((norm_w, disp_w))
            if len(lset) == 7:
                pangram_sets.append(lset)

    unique_7sets = sorted({tuple(sorted(s)) for s in pangram_sets})
    rng.shuffle(unique_7sets)

    # Pre-index all lettersets of size <= 7 by bitmask for fast subset lookup
    mask_to_words: Dict[int, List[Tuple[str, str]]] = {}
    for lset, wlist in by_letterset.items():
        mask = 0
        for ch in lset:
            mask |= 1 << (ord(ch) - ord("a"))
        mask_to_words[mask] = wlist

    puzzles = []
    used_signatures = set()

    for letters_tuple in unique_7sets:
        if len(puzzles) >= count:
            break
        vowels = sum(1 for ch in letters_tuple if ch in "aeiou")
        if vowels not in (2, 3):
            continue
        # Avoid Q without U
        if "q" in letters_tuple and "u" not in letters_tuple:
            continue

        # Generate all non-empty submasks of this 7-letter tuple (2^7 - 1 = 127 lookups!)
        idx_bits = [1 << (ord(ch) - ord("a")) for ch in letters_tuple]
        all_words_for_7: List[Tuple[str, str]] = []
        for sub in range(1, 128):
            m = 0
            for b_i in range(7):
                if sub & (1 << b_i):
                    m |= idx_bits[b_i]
            if m in mask_to_words:
                all_words_for_7.extend(mask_to_words[m])

        tutis = [disp for norm_w, disp in all_words_for_7 if len(set(norm_w)) == 7]
        if not tutis or len(tutis) > 6:
            continue
        # Ensure at least one accessible, idiomatic Catalan tuti (infinitive, common noun/adj suffix)
        friendly_suffixes = (
            "ar", "er", "ir", "re", "ció", "ment", "dor", "dora", "atge", "ura",
            "era", "esa", "ista", "ant", "ent", "ada", "ida", "uda", "ina", "ona",
        )
        if not any(t.endswith(friendly_suffixes) and len(t) <= 10 for t in tutis):
            continue
        # Avoid rare letters X, Z, J, Q in standard ruscos so gameplay feels fluid and relaxing
        if any(rare_ch in letters_tuple for rare_ch in ("w", "k", "y", "z", "x", "q")):
            continue

        # Try picking a center letter that yields 30..75 words
        letter_candidates = list(letters_tuple)
        rng.shuffle(letter_candidates)
        for center in letter_candidates:
            valid = [(nw, dw) for nw, dw in all_words_for_7 if center in nw]
            if 30 <= len(valid) <= 75:
                sig = "".join(letters_tuple)
                if sig in used_signatures:
                    break
                used_signatures.add(sig)
                outer = [ch.upper() for ch in letters_tuple if ch != center]
                rng.shuffle(outer)
                words_map = {nw: dw for nw, dw in sorted(valid)}
                max_score = 0
                for nw in words_map:
                    pts = 1 if len(nw) == 3 else (2 if len(nw) == 4 else len(nw))
                    if len(set(nw)) == 7:
                        pts += 10
                    max_score += pts

                puzzles.append({
                    "center": center.upper(),
                    "outer": outer,
                    "words": words_map,
                    "tutis": sorted(tutis),
                    "maxScore": max_score,
                })
                break

    return puzzles


# ==============================================================================
# SUDOKU GENERATOR & LOGIC EXPLAINER
# ==============================================================================

def sudoku_valid(board: List[int], idx: int, val: int) -> bool:
    r, c = divmod(idx, 9)
    row_start = r * 9
    for j in range(9):
        if board[row_start + j] == val:
            return False
    for i in range(9):
        if board[i * 9 + c] == val:
            return False
    br, bc = (r // 3) * 3, (c // 3) * 3
    for dr in range(3):
        for dc in range(3):
            if board[(br + dr) * 9 + (bc + dc)] == val:
                return False
    return True


def fill_sudoku(board: List[int], rng: random.Random) -> bool:
    for idx in range(81):
        if board[idx] == 0:
            nums = list(range(1, 10))
            rng.shuffle(nums)
            for v in nums:
                if sudoku_valid(board, idx, v):
                    board[idx] = v
                    if fill_sudoku(board, rng):
                        return True
                    board[idx] = 0
            return False
    return True


def count_sudoku_solutions(board: List[int], limit: int = 2) -> int:
    # Choose empty cell with minimum remaining values (MRV) for speed
    best_idx = -1
    best_candidates: List[int] = []
    for idx in range(81):
        if board[idx] == 0:
            cands = [v for v in range(1, 10) if sudoku_valid(board, idx, v)]
            if not cands:
                return 0
            if best_idx == -1 or len(cands) < len(best_candidates):
                best_idx = idx
                best_candidates = cands
                if len(cands) == 1:
                    break

    if best_idx == -1:
        return 1

    total = 0
    for v in best_candidates:
        board[best_idx] = v
        total += count_sudoku_solutions(board, limit - total)
        board[best_idx] = 0
        if total >= limit:
            return total
    return total


def generate_sudoku_puzzle(clues_target: int, rng: random.Random) -> Tuple[str, str]:
    full = [0] * 81
    fill_sudoku(full, rng)
    puzzle = full[:]
    indices = list(range(81))
    rng.shuffle(indices)

    clues = 81
    for idx in indices:
        if clues <= clues_target:
            break
        saved = puzzle[idx]
        puzzle[idx] = 0
        test_copy = puzzle[:]
        if count_sudoku_solutions(test_copy, 2) == 1:
            clues -= 1
        else:
            puzzle[idx] = saved

    p_str = "".join(str(x) for x in puzzle)
    s_str = "".join(str(x) for x in full)
    return p_str, s_str


def build_sudoku_packs(rng: random.Random) -> Dict[str, List[Dict[str, str]]]:
    packs = {"facil": [], "mitja": [], "dificil": []}
    configs = [("facil", 40, 15), ("mitja", 33, 15), ("dificil", 27, 15)]
    for key, target_clues, n_items in configs:
        print(f"Generating {n_items} Sudoku puzzles ({key})...")
        for _ in range(n_items):
            p, s = generate_sudoku_puzzle(target_clues, rng)
            packs[key].append({"p": p, "s": s})
    return packs


def build_epub_sudoku_spot_challenges(
    sudoku_packs: Dict[str, List[Dict[str, str]]], rng: random.Random, count: int = 25
) -> List[Dict]:
    """
    Finds single-step human-deducible '?' cells (Naked Single or Box Hidden Single)
    with a precise Catalan explanation for the offline EPUB book.
    """
    challenges = []
    pool = sudoku_packs["facil"] + sudoku_packs["mitja"] + sudoku_packs["dificil"]

    box_names = [
        ["superior esquerre", "superior central", "superior dret"],
        ["central esquerre", "central", "central dret"],
        ["inferior esquerre", "inferior central", "inferior dret"],
    ]

    for item in pool:
        if len(challenges) >= count:
            break
        grid = [int(ch) for ch in item["p"]]
        sol = [int(ch) for ch in item["s"]]

        empties = [i for i, v in enumerate(grid) if v == 0]
        rng.shuffle(empties)

        picked = None
        for idx in empties:
            r, c = divmod(idx, 9)
            ans = sol[idx]
            row_vals = {grid[r * 9 + j] for j in range(9) if grid[r * 9 + j] != 0}
            col_vals = {grid[i * 9 + c] for i in range(9) if grid[i * 9 + c] != 0}
            br, bc = (r // 3) * 3, (c // 3) * 3
            box_vals = {
                grid[(br + dr) * 9 + (bc + dc)]
                for dr in range(3)
                for dc in range(3)
                if grid[(br + dr) * 9 + (bc + dc)] != 0
            }
            seen = row_vals | col_vals | box_vals
            if len(seen) == 8 and ans not in seen:
                # Prefer Naked Singles where numbers come from a mix of row/col/box (more fun!)
                if len(row_vals) <= 7 and len(col_vals) <= 7 and len(box_vals) <= 7:
                    bname = box_names[r // 3][c // 3]
                    r_list = ", ".join(str(x) for x in sorted(row_vals)) or "cap"
                    c_list = ", ".join(str(x) for x in sorted(col_vals)) or "cap"
                    b_list = ", ".join(str(x) for x in sorted(box_vals)) or "cap"
                    explanation = (
                        f"Observant la casella ? (fila {r + 1}, columna {c + 1}): "
                        f"a la fila {r + 1} ja hi ha [{r_list}]; "
                        f"a la columna {c + 1} ja hi ha [{c_list}]; "
                        f"i al quadrant {bname} ja hi apareixen [{b_list}]. "
                        f"Combinant les tres restriccions, queden descartats vuit números i l'únic valor possible és el {ans}."
                    )
                    picked = {
                        "grid": item["p"],
                        "targetIdx": idx,
                        "row": r + 1,
                        "col": c + 1,
                        "answer": ans,
                        "explanation": explanation,
                    }
                    break
        if picked:
            challenges.append(picked)

    return challenges


# ==============================================================================
# MOTLE EVALUATION & EPUB DEDUCTIVE WORD CHALLENGES
# ==============================================================================

def evaluate_motle_guess(guess: str, target: str) -> List[int]:
    """
    Returns array of 5 statuses:
      2 = exact position (Black fill in E-Ink)
      1 = present elsewhere (Double dashed circle in E-Ink)
      0 = absent (Dotted light border in E-Ink)
    """
    res = [0] * 5
    rem: Dict[str, int] = {}
    for i in range(5):
        if guess[i] == target[i]:
            res[i] = 2
        else:
            rem[target[i]] = rem.get(target[i], 0) + 1
    for i in range(5):
        if res[i] == 0:
            ch = guess[i]
            if rem.get(ch, 0) > 0:
                res[i] = 1
                rem[ch] -= 1
    return res


def explain_motle_contradiction(candidate: str, candidate_disp: str, clues: List[Dict]) -> str:
    """
    Explains accurately in Catalan why `candidate` violates at least one clue in `clues`.
    """
    for step_idx, clue in enumerate(clues, start=1):
        g = clue["guess"]
        expected = clue["pattern"]
        actual = evaluate_motle_guess(g, candidate)
        if actual != expected:
            for pos in range(5):
                if actual[pos] != expected[pos]:
                    letter = g[pos]
                    if expected[pos] == 2:
                        return (
                            f"«{candidate_disp.upper()}» no compleix la pista de l'intent {step_idx} ({g}): "
                            f"la lletra {letter} estava marcada en negre sòlid (posició {pos + 1} fixa), "
                            f"però aquí hi té una «{candidate[pos]}»."
                        )
                    elif expected[pos] == 1 and actual[pos] == 2:
                        return (
                            f"«{candidate_disp.upper()}» no compleix la pista de l'intent {step_idx} ({g}): "
                            f"la lletra {letter} a la posició {pos + 1} tenia doble vora (és a la paraula però NO a la posició {pos + 1})."
                        )
                    elif expected[pos] == 1 and actual[pos] == 0:
                        return (
                            f"«{candidate_disp.upper()}» contradiu l'intent {step_idx} ({g}): "
                            f"la pista indicava que la paraula conté la lletra {letter} (o en conté més ocurrències), i aquí hi falta."
                        )
                    elif expected[pos] == 0:
                        return (
                            f"«{candidate_disp.upper()}» contradiu l'intent {step_idx} ({g}): "
                            f"la lletra {letter} hi figurava com a descartada (absent o sense repeticions extra), però «{candidate_disp.upper()}» la inclou."
                        )
    return f"«{candidate_disp.upper()}» no encaixa amb totes les pistes anteriors."


def build_epub_motle_deductive(
    solutions: List[List[str]], rng: random.Random, count: int = 30
) -> List[Dict]:
    """
    Generates 30 deductive Wordle puzzles for the offline EPUB:
    Each puzzle gives 3 played guesses + E-Ink pattern, and 4 multiple-choice options (A, B, C, D)
    where ONLY ONE option satisfies all 3 clue rows, and the 3 distractors satisfy 1 or 2 rows
    (making it a genuine, satisfying logic deduction!).
    """
    pool = solutions[:]
    rng.shuffle(pool)
    puzzles = []

    for sol_idx, (target_norm, target_disp) in enumerate(pool):
        if len(puzzles) >= count:
            break

        # Pick 3 distinct guesses that share some letters with target_norm
        others = [x for x in pool if x[0] != target_norm]
        # Score guesses by shared letters (1..3 shared letters makes great clues)
        scored = [
            x for x in others
            if 1 <= len(set(x[0]) & set(target_norm)) <= 4
        ]
        if len(scored) < 20:
            continue
        rng.shuffle(scored)

        chosen_clues = None
        chosen_distractors = None

        for attempt in range(25):
            g_items = rng.sample(scored[:80], 3)
            clues = []
            for g_norm, g_disp in g_items:
                pat = evaluate_motle_guess(g_norm, target_norm)
                clues.append({"guess": g_norm, "disp": g_disp, "pattern": pat})

            # Filter all solutions to see which ones match all 3 clues
            exact_matches = []
            near_matches = []
            for cand_norm, cand_disp in pool:
                matches_rows = sum(
                    1 for cl in clues if evaluate_motle_guess(cl["guess"], cand_norm) == cl["pattern"]
                )
                if matches_rows == 3:
                    exact_matches.append((cand_norm, cand_disp))
                elif matches_rows in (1, 2) and cand_norm not in {cl["guess"] for cl in clues}:
                    # Prefer distractors that match 2 out of 3 rows!
                    near_matches.append((matches_rows, len(set(cand_norm) & set(target_norm)), cand_norm, cand_disp))

            if len(exact_matches) == 1 and exact_matches[0][0] == target_norm and len(near_matches) >= 3:
                near_matches.sort(key=lambda t: (t[0], t[1]), reverse=True)
                distractors = [( t[2], t[3] ) for t in near_matches[:3]]
                chosen_clues = clues
                chosen_distractors = distractors
                break

        if chosen_clues and chosen_distractors:
            options_raw = [(target_norm, target_disp, True)] + [
                (dn, dd, False) for dn, dd in chosen_distractors
            ]
            rng.shuffle(options_raw)
            options = []
            for idx_opt, (onorm, odisp, is_correct) in enumerate(options_raw):
                label = "ABCD"[idx_opt]
                if is_correct:
                    feedback = (
                        f"Correcte! «{odisp.upper()}» compleix exactament totes les lletres fixes, "
                        f"les lletres canviades de lloc i tots els descarts dels tres intents."
                    )
                else:
                    feedback = explain_motle_contradiction(onorm, odisp, chosen_clues)
                options.append({
                    "label": label,
                    "norm": onorm,
                    "disp": odisp,
                    "correct": is_correct,
                    "feedback": feedback,
                })

            puzzles.append({
                "clues": chosen_clues,
                "answerNorm": target_norm,
                "answerDisp": target_disp,
                "options": options,
            })

    return puzzles


# ==============================================================================
# NONOGRAM (PICROSS) PIXEL-ART CATALOG & VERIFIER
# ==============================================================================

NONOGRAM_DESIGNS = [
    # --- 5x5 (Suau) ---
    ("Cor", 5, [
        "01010",
        "11111",
        "11111",
        "01110",
        "00100",
    ]),
    ("Veler", 5, [
        "00100",
        "01100",
        "00100",
        "11111",
        "01110",
    ]),
    (" Tassa", 5, [
        "11110",
        "10011",
        "10011",
        "11110",
        "11111",
    ]),
    ("Arbre", 5, [
        "01110",
        "11111",
        "01110",
        "00100",
        "01110",
    ]),
    ("Corona", 5, [
        "10101",
        "11111",
        "11111",
        "10101",
        "11111",
    ]),
    ("Avio", 5, [
        "00100",
        "11111",
        "00100",
        "01110",
        "01010",
    ]),
    ("Clau", 5, [
        "01110",
        "01010",
        "01110",
        "00100",
        "01100",
    ]),
    ("Caseta", 5, [
        "00100",
        "01110",
        "11111",
        "10101",
        "11011",
    ]),
    # --- 8x8 (Mitjà) ---
    ("Gat assegut", 8, [
        "01000100",
        "01111100",
        "01010100",
        "01111100",
        "00111001",
        "01111101",
        "01111110",
        "01101100",
    ]),
    ("Far de costa", 8, [
        "00011000",
        "01011010",
        "00111100",
        "00011000",
        "00100100",
        "00111100",
        "01111110",
        "11111111",
    ]),
    ("Tassa calenta", 8, [
        "00101000",
        "01000100",
        "00000000",
        "11111100",
        "11111111",
        "11111101",
        "01111011",
        "11111110",
    ]),
    ("Rellotge d'arena", 8, [
        "11111111",
        "01111110",
        "00111100",
        "00011000",
        "00011000",
        "00100100",
        "01111110",
        "11111111",
    ]),
    ("Àncora marina", 8, [
        "00011000",
        "00100100",
        "00011000",
        "01111110",
        "00011000",
        "10011001",
        "11011011",
        "01111110",
    ]),
    ("Nota musical", 8, [
        "00011111",
        "00010001",
        "00011111",
        "00010001",
        "00010001",
        "01110111",
        "11110111",
        "01100010",
    ]),
    ("Paraigua", 8, [
        "00011000",
        "01111110",
        "11111111",
        "10111101",
        "00011000",
        "00011000",
        "01011000",
        "01110000",
    ]),
    ("Llibre obert", 8, [
        "00000000",
        "01110111",
        "11011101",
        "10111011",
        "11011101",
        "10111011",
        "11110111",
        "00011000",
    ]),
    # --- 10x10 (Repte) ---
    ("Mussol nocturn", 10, [
        "0110000110",
        "0111111110",
        "1100110011",
        "1101111011",
        "1100110011",
        "0111001110",
        "0111111110",
        "0101111010",
        "0011111100",
        "0001001000",
    ]),
    ("Vaixell clàssic", 10, [
        "0000110000",
        "0001110000",
        "0011111000",
        "0111111100",
        "0000110000",
        "1111111111",
        "0111111110",
        "0011111100",
        "1000000001",
        "0111111110",
    ]),
    ("Castell antic", 10, [
        "1010000101",
        "1110110111",
        "1111111111",
        "0110110110",
        "0111111110",
        "0111001110",
        "0111001110",
        "1111001111",
        "1111001111",
        "1111111111",
    ]),
    ("Muntanyes i lluna", 10, [
        "0000001110",
        "0000011000",
        "0010011000",
        "0111001110",
        "1101100000",
        "1111110100",
        "1111111110",
        "1111111111",
        "1111111111",
        "1111111111",
    ]),
    ("Cafetera moka", 10, [
        "0001110000",
        "0011111100",
        "0111111011",
        "0011111001",
        "0001110011",
        "0001110000",
        "0011011000",
        "0111111100",
        "0111111100",
        "0011111000",
    ]),
    ("Tortuga marina", 10, [
        "0000110000",
        "0001111000",
        "1100110011",
        "0111111110",
        "0011001100",
        "0010110100",
        "0011001100",
        "0111111110",
        "1100110011",
        "0000100000",
    ]),
    ("Llanterna", 10, [
        "0001111000",
        "0001001000",
        "0111111110",
        "0010000100",
        "0010110100",
        "0010110100",
        "0010000100",
        "0111111110",
        "0111111110",
        "0011111100",
    ]),
    ("Bonsai", 10, [
        "0011111000",
        "0111111100",
        "1111101110",
        "0111001111",
        "0001110110",
        "0001100000",
        "0011000000",
        "1111111111",
        "0111111110",
        "0010000100",
    ]),
]


def compute_nonogram_clues(rows_str: List[str]) -> Tuple[List[List[int]], List[List[int]]]:
    size = len(rows_str)
    row_clues = []
    for r in range(size):
        runs = [len(m.group(0)) for m in re.finditer(r"1+", rows_str[r])]
        row_clues.append(runs if runs else [0])
    col_clues = []
    for c in range(size):
        col_s = "".join(rows_str[r][c] for r in range(size))
        runs = [len(m.group(0)) for m in re.finditer(r"1+", col_s)]
        col_clues.append(runs if runs else [0])
    return row_clues, col_clues


def build_nonograms() -> List[Dict]:
    out = []
    for idx, (title, size, rows) in enumerate(NONOGRAM_DESIGNS):
        clean_title = title.strip()
        assert len(rows) == size and all(len(r) == size for r in rows), f"Invalid nonogram {clean_title}"
        r_clues, c_clues = compute_nonogram_clues(rows)
        out.append({
            "id": idx + 1,
            "title": clean_title,
            "size": size,
            "grid": "".join(rows),
            "rowClues": r_clues,
            "colClues": c_clues,
        })
    return out


def main() -> None:
    rng = random.Random(20261031)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    WEB_JS_DIR.mkdir(parents=True, exist_ok=True)

    print("1/5 Parsing Softcatala root dictionaries...")
    motle_dict, rusc_dict = parse_softcatala_lexicon()
    print(f"    -> {len(motle_dict)} valid 5-letter Motle lemmas, {len(rusc_dict)} general Rusc lemmas.")

    print("2/5 Selecting curated Motle solutions & valid word list...")
    motle_solutions = select_motle_solutions(motle_dict, rng)
    motle_valid_str = " ".join(sorted(motle_dict.keys()))
    print(f"    -> {len(motle_solutions)} curated Motle target solutions.")

    print("3/5 Building 60 balanced 'El Rusc' (Paraulògic) puzzles...")
    rusc_puzzles = build_rusc_puzzles(rusc_dict, rng, count=60)
    print(f"    -> {len(rusc_puzzles)} Rusc puzzles generated.")

    print("4/5 Generating verified unique-solution Sudoku packs & Nonograms...")
    sudoku_packs = build_sudoku_packs(rng)
    nonograms = build_nonograms()

    print("5/5 Generating offline EPUB deductive challenges...")
    epub_motle = build_epub_motle_deductive(motle_solutions, rng, count=30)
    epub_sudoku_spots = build_epub_sudoku_spot_challenges(sudoku_packs, rng, count=25)
    print(f"    -> {len(epub_motle)} deductive Motle challenges, {len(epub_sudoku_spots)} Sudoku '?' spot challenges.")

    # Write compact JS bundle for Kindle browser (web/js/data.js)
    # Note: for web bundle, keep 36 Rusc puzzles to keep web/js/data.js super light (~120 KB total!)
    web_payload = {
        "motleSolutions": motle_solutions,
        "motleValid": motle_valid_str,
        "ruscos": rusc_puzzles[:35],
        "sudoku": sudoku_packs,
        "nonograms": nonograms,
    }
    js_path = WEB_JS_DIR / "data.js"
    js_content = (
        "// Auto-generated by scripts/build_data.py - Kindle Calm Hub Data Bundle\n"
        "window.KINDLE_DATA = " + json.dumps(web_payload, ensure_ascii=False, separators=(",", ":")) + ";\n"
    )
    js_path.write_text(js_content, encoding="utf-8")
    print(f"Wrote {js_path} ({js_path.stat().st_size / 1024:.1f} KB)")

    # Write full bundle for EPUB generator & tests
    epub_bundle_path = DATA_DIR / "puzzles_bundle.json"
    epub_bundle = {
        "ruscos": rusc_puzzles[35:60] if len(rusc_puzzles) >= 60 else rusc_puzzles[:25],
        "epubMotle": epub_motle,
        "epubSudokuSpots": epub_sudoku_spots,
        "sudoku": sudoku_packs,
        "nonograms": nonograms,
        "motleSolutionsCount": len(motle_solutions),
        "motleValidCount": len(motle_dict),
    }
    epub_bundle_path.write_text(json.dumps(epub_bundle, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {epub_bundle_path} ({epub_bundle_path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
