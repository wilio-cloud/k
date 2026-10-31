# Racó Calmat · Kindle Calm Hub (Sistema Híbrid E-Ink)

Plataforma personal d'enginy, lògica i paraules en català dissenyada exclusivament per a pantalles de tinta electrònica **Kindle Paperwhite i Kindle bàsic (2021+)**, creada per distreure's i descansar la vista sense pantalles retroil·luminades ni estímuls ràpids.

- **URL directa per al navegador del Kindle:** `https://wilio-cloud.github.io/k`

---

## Contingut del Sistema

### 1. Portal Web E-Ink (`web/`)
Aplicació web ultralleugera (`~240 KB` amb tot el diccionari i puzles inclosos, zero frameworks, mode fora de línia amb *Service Worker* i partides desades automàticament a `localStorage`):
- **Dossier Forense (estil *Murdle*):** 24 casos detectivescos verificats amb solver CSP en 3 modalitats (*Iniciació 3×3*, *Inspector 4×4* amb disjuncions lògiques i *Interrogatori Mentider* on l'únic culpable menteix), amb graella lògica croada en forma d'`L`, auto-descart i ratllat tàctil de pistes.
- **Sudoku Calmat:** 45 taulers verificats amb solució única (*Suau*, *Mitjà*, *Repte*), mode d'anotacions `3×3`, desfer i pistes lògiques raonades.
- **Motle Català:** Estil Wordle amb més de 5.200 mots catalans vàlids del DIEC/Softcatalà, mode *Mot del dia* i *Partida lliure*, teclat català amb `Ç` i codificació geomètrica monocroma sense dependre del color.
- **El Rusc de Mots:** Estil Paraulògic amb 35 ruscos equilibrats, *tutis* garantits, marcador de rangs i pistes per prefixos.
- **Nonogrames (Picross):** 24 figures píxel-art (`5×5`, `8×8`, `10×10`) amb marcatge automàtic de pistes completades i selector tàctil `■ Pintar` / `× Descartar`.
- **Buscamines Tàctil:** Taulers `8×8` i `9×10`, primera casella sempre segura, obertura ràpida per números complets i selector inferior `□ Obrir` / `⚑ Bandera` (sense necessitat de mantenir premut el dit).

### 2. Llibre-App Interactiu per a Mode Avió (`dist/quadern-enginy-kindle.epub`)
Llibre **EPUB 3.0** amb 543 pantalles enllaçades i gràfics vectorials SVG d'alt contrast (300 ppi) que s'obre des de la biblioteca nativa del Kindle amb el **Wi-Fi desactivat**:
- **15 Casos exclusius de Dossier Forense** amb verificació d'acusacions sense espòilers.
- **25 Ruscos Mentals** amb pàgina independent de pistes de prefixos i solucions completes.
- **30 Reptes de Motle Deductiu** d'opció múltiple amb validació immediata sense espòilers.
- **25 Reptes de Casella Incògnita (Sudoku)** amb botons interactius `[1]..[9]` i explicació del pas lògic.

---

## Com obrir-ho al teu Kindle

### Via A: Enviar el llibre EPUB per jugar en Mode Avió (30 segons)
1. Obre [amazon.es/sendtokindle](https://www.amazon.es/sendtokindle) al navegador del teu Mac.
2. Arrossega-hi el fitxer:
   ```text
   dist/quadern-enginy-kindle.epub
   ```
3. Al cap d'un minut apareixerà a la biblioteca del teu Kindle. Quan es descarregui, ja pots posar el Kindle en **Mode Avió**.

*(Alternativa per cable USB: connecta el Kindle al Mac i copia el fitxer o converteix-lo amb Calibre si tens un model molt antic).*

### Via B1: Obrir el Portal Web a l'instant per Wi-Fi de casa
Executa al terminal:
```bash
./serve_local.sh
```
L'script et mostrarà l'adreça exacta (ex. `http://192.168.1.XX:8080`). Obre el **Navegador web** del Kindle (menú superior `⋮` → *Navegador web*), escriu aquesta adreça i desa-la a les **Adreces d'interès (Marcadors)**.

### Via B2: Publicar el Portal Web gratis a Internet (per no dependre del Mac encès)
La carpeta `web/` és 100% estàtica i no requereix servidor ni base de dades:
- **Cloudflare Pages (sense codi):** Entra a Cloudflare Pages → *Upload assets* → arrossega la carpeta `web/` sencera. Tindràs una adreça `https://el-teu-nom.pages.dev` permanent i gratuïta.
- **GitHub Pages:** Puja aquest repositori a GitHub i a *Settings → Pages* selecciona la carpeta `/web` (o puja el contingut de `web/` a l'arrel).

---

## Regenerar reptes nous i executar tests

Per tornar a compilar les dades, generar un nou EPUB (pots canviar la llavor aleatòria a `scripts/build_data.py` quan vulguis 60 ruscos i 45 sudokus nous!) i passar els tests de qualitat:

```bash
python3 scripts/build_data.py
python3 epub_generator/build_epub.py
python3 scripts/test_suite.py
```
