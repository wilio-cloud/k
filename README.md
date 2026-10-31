# Racó Calmat · Kindle E-Ink (`wilio-cloud.github.io/k`) · Edició Integral v6

Portal web ultralleuger i quadern interactiu EPUB 3.0 en català dissenyats exclusivament per a pantalles de tinta electrònica **Amazon Kindle (Paperwhite / Basic / Scribe)**. Zero animacions, zero *scroll* vertical i contrast binari pur per descansar els ulls durant dies i setmanes.

## Experiències de llarg recorregut (`v6`)

### Dinastia, Mercats, Holding & Enginy
1. **Vides & Capital: Dinastia (`vides.js` + `vides_data.js`)**: Simulador any a any dels 18 als 85 anys amb 115 esdeveniments escrits a mà + generador combinatori, cadenes vitals, 6 carteres líquides, compra directa de 8 immobles amb hipoteca fixa/amortització, carrera i formació (8 cursos), i **Dinastia intergeneracional** (`Gen 2, 3...`).
2. **El Joc dels Decennis (`decennis.js` + `decennis_data.js`)**: **8 campanyes històriques de 40 anys** (20 biennis cadascuna), 72 butlletins macroeconòmics, 6 classes d'actius, càlcul de poder adquisitiu real descomptada la inflació, *Repte del Jubilat* (risc de seqüència), *Constructor DCA* i *Mode Mestre sense pistes*.
3. **Fundador des de Zero: De Garatge a Holding (`fundador.js` + `fundador_data.js`)**: Carrera empresarial oberta en 5 fases orgàniques sense límit artificial de trimestres, 90 dilemes reals, 4 departaments ampliables, polítiques de tarifes i dividends, venda M&A o sortida a borsa (OPV) i **Holding Patrimonial persistent** amb 8 actius de Micro-Private Equity.
4. **Buscamines Tàctil (`minesweeper.js`)**: Campanya progressiva **Camí dels 30 Cims** (`7×7` fins a `10×11` amb 26 mines) i mode lliure en tres mides (`8×8`, `9×10` i `10×11` Expert) amb rècords i ratxes.

### Criança 0–12a, Estudi de Ioga & Família
5. **Créixer amb Calma (`crianca.js` + `crianca_data.js`)**: **85 situacions interactives** dividides en 5 etapes evolutives (`0–1`, `1–3`, `4–6`, `7–9` i `10–12 anys`) amb neurociència sota l'iceberg i reparació, **Estudi de Ioga Restauratiu & Pranayama** a mida amb 18 postures il·lustrades en SVG monocrom, **34 jocs familiars sense pantalles** i **38 frases pont**.

### Mode Avió 100% Nadiu (`dist/quadern-enginy-kindle.epub`)
- Llibre interactiu EPUB 3.0 de **225 pantalles XHTML estrictes** i **589 enllaços verificats** amb novel·la ramificada *Tres Vides i un Patrimoni*, *30 Dilemes de Criança*, *12 Seqüències de Ioga SVG* i *48 Reptes d'Enginy*.

## Verificació i Compilació

```bash
python3 epub_generator/build_epub.py
python3 scripts/test_suite.py
```
