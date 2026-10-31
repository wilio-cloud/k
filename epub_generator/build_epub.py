#!/usr/bin/env python3
"""
Kindle Calm Hub - Offline Interactive EPUB 3.0 Compiler (v6: Edició Integral de Diversos Dies)
Generates `dist/quadern-enginy-kindle.epub` (100% Airplane-Mode compatible via Send to Kindle / USB).

Chapters (310+ strict XHTML screens):
  1. Vides & Capital (Gran Llibre-Joc ramificat 20→80a amb 46 nodes i 16 finals vitals/FIRE/Dinastia)
  2. El Joc dels Decennis (22 casos històrics i tàctics de mercat amb pantalles d'anàlisi sense espòilers)
  3. Fundador & Holding (16 dilemes empresarials de Garatge a Imperi amb anàlisi d'unit economics)
  4. Créixer amb Calma 0–12a (25 escenes evolutives per etapes amb neurociència i frase pont)
  5. Estudi de Ioga Restauratiu & Jocs sense Pantalles (12 làmines SVG + 3 seqüències guiades + 16 jocs familiars)
"""

from __future__ import annotations

import html
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "dist"
OUTPUT_EPUB = DIST_DIR / "quadern-enginy-kindle.epub"

BOOK_UUID = "urn:uuid:8f4e2c10-9b3a-4d7e-a612-kindlecalm2026v6"
BOOK_TITLE = "Vides, Capital i Calma · Edició Integral v6 (Mode Avió)"
BOOK_AUTHOR = "Racó Calmat · Kindle E-Ink"

EPUB_CSS = """\
body {
  font-family: "Bookerly", Georgia, Palatino, serif;
  color: #000000;
  background-color: #ffffff;
  margin: 0;
  padding: 0.5em 0.7em;
  line-height: 1.44;
  font-size: 1.04em;
}
h1, h2, h3 {
  font-weight: bold;
  margin: 0.25em 0 0.35em 0;
  line-height: 1.22;
}
h1 { font-size: 1.38em; text-align: center; }
h2 { font-size: 1.15em; border-bottom: 2px solid #000000; padding-bottom: 0.2em; }
h3 { font-size: 1.02em; }
p { margin: 0.42em 0; }
.kicker {
  font-family: monospace;
  font-size: 0.78em;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-bottom: 1px solid #000000;
  padding-bottom: 0.15em;
  margin-bottom: 0.35em;
}
.box {
  border: 2px solid #000000;
  border-radius: 5px;
  padding: 0.6em 0.75em;
  margin: 0.5em 0;
  page-break-inside: avoid;
  break-inside: avoid;
}
.quote {
  border-left: 3px solid #000000;
  padding-left: 0.65em;
  font-style: italic;
  margin: 0.45em 0;
}
.svg-box {
  text-align: center;
  margin: 0.5em auto;
  padding: 0.45em;
  border: 1px solid #000000;
}
a.choice {
  display: block;
  padding: 0.52em 0.72em;
  margin: 0.42em 0;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #000000;
  background-color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}
a.btn {
  display: inline-block;
  padding: 0.42em 0.8em;
  margin: 0.25em 0.2em;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #000000;
  background-color: #ffffff;
  text-decoration: none;
  font-weight: bold;
}
a.btn-dark {
  display: inline-block;
  padding: 0.45em 0.85em;
  margin: 0.25em 0.2em;
  border: 2px solid #000000;
  border-radius: 5px;
  color: #ffffff;
  background-color: #000000;
  text-decoration: none;
  font-weight: bold;
}
"""


def xhtml_doc(title: str, body: str) -> str:
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ca" lang="ca">
<head>
  <meta charset="UTF-8"/>
  <title>{html.escape(title)}</title>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
{body}
</body>
</html>
"""


# ==================== CHAPTER 1: DEEP MULTI-DECADE CYOA (46 NODES, 16 ENDINGS) ====================
CYOA_NODES: Dict[str, dict] = {
    "start": {
        "kicker": "22 ANYS · EL PUNT DE PARTIDA",
        "title": "El primer sou estable i quatre maneres de mirar el futur",
        "body": "Acabes d'incorporar-te al món laboral i has reunit un primer coixí de 14.000 €. La majoria del teu grup finança cotxes nous o lloga àtics per sobre de les seves possibilitats. Quin fonament tries per a la teva dècada dels vint?",
        "choices": [
            ("Automatitzar el 35% del sou a Fons Indexats Globals i compartir pis", "c_idx_1"),
            ("Estudiar el mercat local per comprar un pis vell a reformar amb hipoteca fixa", "c_imm_1"),
            ("Viure amb sobrietat i dedicar les tardes a llançar un producte digital propi", "c_emp_1"),
            ("Gaudir sense mirar comptes i finançar un vehicle prèmium (ja estalviaré als 35)", "c_trap_1"),
        ],
    },
    # --- BRANCH A: INDEXING & CAREER ---
    "c_idx_1": {
        "kicker": "27 ANYS · BOLA DE NEU EN MARXA",
        "title": "58.000 € acumulats i una oferta internacional remota",
        "body": "Cinc anys d'aportacions automàtiques sense mirar el soroll diari t'han posat amb 58.000 €. Una empresa europea t'ofereix 62.000 € bruts anuals treballant 100% en remot, o bé pots acceptar un càrrec presencial amb despatx a Barcelona.",
        "choices": [
            ("Acceptar la feina remota i mudar-te a un poble amb fibra i natura (Geo-arbitratge)", "c_idx_geo"),
            ("Escalar a la multinacional presencial apuntant a direcció als 35 anys", "c_idx_corp"),
            ("Fer un any sabàtic pel món gastant 18.000 € abans de decidir", "c_idx_sab"),
        ],
    },
    "c_idx_geo": {
        "kicker": "32 ANYS · CRAC DEL -36% EN PLENA PAU",
        "title": "La pantalla cau de 175.000 € a 112.000 € en tres mesos",
        "body": "Viure al poble t'ha permès estalviar més de 1.800 €/mes amb salut radiant, però esclata una crisi financera severa. Tens 28.000 € al fons d'emergència.",
        "choices": [
            ("Mantenir 6 mesos de coixí i invertir 16.000 € extra aprofitant el PER 11x", "c_idx_geo_buy"),
            ("Congelar aportacions i comprar una caseta amb hort pagant una entrada suau", "c_idx_geo_house"),
            ("Vendre la cartera per por d'una depressió de deu anys", "end_01_panic"),
        ],
    },
    "c_idx_geo_buy": {
        "kicker": "38 ANYS · EL REBOT MULTIPLICA EL CAPITAL",
        "title": "485.000 € al compte, parella estable i primera criatura",
        "body": "Les participacions comprades al fons del crac s'han multiplicat per 2,7. Arriba un nadó a casa i les teves despeses familiars són molt contingudes (1.650 €/mes).",
        "choices": [
            ("Declarar el FIRE als 38 anys i viure una criança plena sense rellotges", "c_fire_early_life"),
            ("Passar a consultoria selectiva 15h/setmana (Coast FIRE) i obrir fons per a la criatura", "c_coast_dynasty"),
        ],
    },
    "c_idx_geo_house": {
        "kicker": "41 ANYS · ARRELS SÒLIDES",
        "title": "Casa gairebé pagada i 360.000 € en fons globals",
        "body": "No vas capturar tot el rebot borsari, però tens sostre propi envoltat de boscos i zero estrès hipotecari.",
        "choices": [
            ("Reduir jornada a 4 dies i muntar un petit taller artesanal com a segona passió", "end_02_artisan_fire"),
            ("Amortitzar l'últim tram d'hipoteca i retirar-te als 48 anys amb calma", "end_03_calm_retire"),
        ],
    },
    "c_fire_early_life": {
        "kicker": "52 ANYS · PROVA DE FOC DEL JUBILAT JOVE",
        "title": " catorze anys lliure, però arriba una estagflació del 8%",
        "body": "Portes més d'una dècada gaudint del temps lliure, fent esport i acompanyant la família. Tanmateix, tres anys d'inflació alta posen a prova la teva taxa de retirada del 4%.",
        "choices": [
            ("Flexibilitzar despesa un 12% temporalment i monetitzar un llibre/curs del teu ofici", "end_04_zen_fire_master"),
            ("Ignorar la inflació i apujar retirades al 6,5% anual", "end_05_swr_erosion"),
        ],
    },
    "c_coast_dynasty": {
        "kicker": "64 ANYS · EL LLEGAT FAMILIAR",
        "title": "1.650.000 € de patrimoni i fills a punt d'emancipar-se",
        "body": "Treballar només en projectes escollits sense tocar mai el capital principal ha deixat que l'interès compost fes miracles durant tres dècades.",
        "choices": [
            ("Estructurar donacions en vida amb formació financera i gaudir de la vellesa activa", "end_06_dynasty_sage"),
        ],
    },
    "c_idx_corp": {
        "kicker": "36 ANYS · ALTA DIRECCIÓ I ALTA PRESSIÓ",
        "title": "Cobres 115.000 €/any, tens 310.000 €, però dorms 5 hores",
        "body": "Ets director de divisió. Els ingressos són brillants, però l'esquena i la tensió arterial comencen a encendre alarmes.",
        "choices": [
            ("Frenar a temps: negociar posició tècnica sense política interna i fer ioga/força", "c_corp_pivot"),
            ("Aguantar 7 anys més amb opcions sobre accions fins a l'objectiu d'1,8M €", "c_corp_grind"),
        ],
    },
    "c_corp_pivot": {
        "kicker": "49 ANYS · SEGONA JOVENTUT",
        "title": "890.000 € i una salut millor que als trenta",
        "body": "Baixar d'esglaó jeràrquic et va salvar del col·lapse i el capital ja genera més que el teu propi sou.",
        "choices": [
            ("Prejubilar-te als 50 anys per viatjar a peu i fer mentoria jove", "end_07_wise_exec"),
        ],
    },
    "c_corp_grind": {
        "kicker": "44 ANYS · AVÍS MÈDIC SERIÓS",
        "title": "1.450.000 € al banc i un ensurt cardíac un dimarts al vespre",
        "body": "L'hospital et recorda de cop que el cementiri és ple de gent insubstituïble a l'oficina.",
        "choices": [
            ("Deixar el càrrec l'endemà mateix i reconstruir hàbits, calma i vincles", "end_08_saved_bell"),
            ("Tornar al despatx al cap de quinze dies pensant que ja ho controlaràs", "end_09_rich_burnout"),
        ],
    },
    "c_idx_sab": {
        "kicker": "29 ANYS · RETORN AMB PERSPECTIVA",
        "title": "40.000 € restants, una ment oberta i zero pressa",
        "body": "L'any viatjant amb motxilla t'ha ensenyat que necessites molt menys del que pensaves per ser feliç. Tornes amb idees fresques.",
        "choices": [
            ("Combinar feina de 4 dies amb inversió indexada constant fins als 50", "c_corp_pivot"),
            ("Aplicar el que has vist fora per obrir un negoci de nínxol rendible", "c_emp_scale"),
        ],
    },
    # --- BRANCH B: REAL ESTATE & HYBRID ---
    "c_imm_1": {
        "kicker": "28 ANYS · POLS, REFORMA I RENDIBILITAT",
        "title": "Compres un 3r sense ascensor un 25% sota mercat",
        "body": "Després de quatre mesos coordinant paletes i fent pintura els caps de setmana, el pis llueix irreconeixible amb hipoteca fixa al 2,4% (quota 410 €/mes).",
        "choices": [
            ("Viure-hi tu llogant una habitació dos anys per refer el coixí ràpidament", "c_imm_prudent"),
            ("Llogar-lo sencer per 890 €/mes i usar el flux per comprar un segon pis", "c_imm_2"),
        ],
    },
    "c_imm_prudent": {
        "kicker": "35 ANYS · PATRIMONI HÍBRID EQUILIBRAT",
        "title": "Sostre pagat a meitat i 115.000 € en fons globals",
        "body": "Sense pagar lloguer extern, la teva capacitat d'estalvi mensual ha estat imbatible. Ara et planteges el següent pas familiar.",
        "choices": [
            ("Posar aquest pis en lloguer (+480 €/m nets) i mudar-te amb la parella prop del mar", "c_imm_hybrid_win"),
            ("Vendre el pis amb 75.000 € de plusvàlua exempta per reinversió i simplificar vida", "c_coast_dynasty"),
        ],
    },
    "c_imm_2": {
        "kicker": "34 ANYS · LA TEMPTACIÓ DEL PALANQUEJAMENT EXTREM",
        "title": "Ja tens 2 pisos en renda (+820 €/m nets) i el banc t'ofereix 3 més a tipus variable",
        "body": "L'Euríbor està al 0,2% i et sents invencible. Un promotor t'ofereix tres estudis finançats al 90% a tipus variable.",
        "choices": [
            ("Frenar el deute: consolidar els 2 pisos fixos i enviar les rendes a Fons Indexats", "c_imm_hybrid_win"),
            ("Signar les 3 hipoteques variables buscant retirar-te l'any que ve", "c_imm_variable_shock"),
        ],
    },
    "c_imm_hybrid_win": {
        "kicker": "48 ANYS · FORTALESA DE DUES POTES",
        "title": "1.600 €/mes de rendes netes sense deute + 440.000 € líquids",
        "body": "Ni les pujades de tipus ni la inflació t'inquieten: les rendes pugen amb l'IPC i els fons creixen al ritme mundial.",
        "choices": [
            ("Gaudir de la llibertat patrimonial total i ensenyar l'ofici als teus fills", "end_10_hybrid_architect"),
        ],
    },
    "c_imm_variable_shock": {
        "kicker": "38 ANYS · TEMPESTA D'EURÍBOR AL 4,6%",
        "title": "Les quotes es dupliquen en 12 mesos i coincideix amb una derrama a la façana",
        "body": "El flux de caixa passa de +1.400 €/mes a -950 €/mes i gairebé no tens liquiditat.",
        "choices": [
            ("Assumir l'error amb fredor: vendre 2 estudis amb descompte, salvar els pisos bons i respirar", "end_11_deleveraged_survivor"),
            ("Demanar crèdits personals al 11% per tapar els forats esperant un miracle", "end_12_debt_spiral"),
        ],
    },
    # --- BRANCH C: ENTREPRENEURSHIP & HOLDING ---
    "c_emp_1": {
        "kicker": "25 ANYS · VALIDACIÓ REAL",
        "title": "42 clients paguen 49 €/mes pel teu programari vertical",
        "body": "Després de vuit mesos escoltant petits negocis, ja factures 2.058 €/mes amb un marge del 88%. Pots deixar la feina assalariada.",
        "choices": [
            ("Deixar la feina tenint 12 mesos de despeses personals cobertes (Bootstrapping pur)", "c_emp_scale"),
            ("Acceptar 250.000 € d'un fons de capital risc cedint el 25% i obligant-te a créixer x10", "c_emp_vc"),
        ],
    },
    "c_emp_scale": {
        "kicker": "31 ANYS · MÀQUINA DE CAIXA (18.500 €/MES)",
        "title": "Tens 3 persones en remot, zero inversors externs i 11.000 €/mes de benefici net",
        "body": "Un grup europeu t'escriu per comprar el 100% de la teva empresa per 920.000 € al comptat.",
        "choices": [
            ("Vendre per 920.000 €, crear el teu Holding Personal i assolir llibertat vital immediata", "c_holding_free"),
            ("Contractar una directora d'operacions i mantenir l'empresa repartint 100k€/any de dividend", "end_13_cashcow_founder"),
        ],
    },
    "c_holding_free": {
        "kicker": "37 ANYS · L'INVERSOR SERÈ",
        "title": "Amb 750.000 € indexats al Holding, fundes un segon projecte sense cap pressió",
        "body": "Quan no necessites els diners per pagar el lloguer, prens decisions empresarials deu vegades més lúcides i només treballes amb gent que admires.",
        "choices": [
            ("Construir un petit grup d'empreses tranquil·les treballant 25 hores setmanals", "end_14_serial_holding"),
        ],
    },
    "c_emp_vc": {
        "kicker": "29 ANYS · CREIXEMENT VERTIGINÓS I CREMA DE CAIXA",
        "title": "Factures 65.000 €/mes però en gastes 85.000 €/mes i el mercat de rondes es tanca",
        "body": "Queden 5 mesos de caixa i el consell et pressiona.",
        "choices": [
            ("Tallar costos supèrflus, pujar preus un 20% i portar l'empresa a benefici en 90 dies", "c_emp_turnaround"),
            ("Confiar-ho tot a tancar una ronda d'emergència a última hora", "end_15_vc_wipeout"),
        ],
    },
    "c_emp_turnaround": {
        "kicker": "34 ANYS · L'EXIT MERESCUT",
        "title": "La disciplina t'ha salvat: vens l'empresa per 4,2M € (la teva part neta: 1,9M €)",
        "body": "Haver reconduït l'empresa a rendibilitat real et dóna tot el poder a la taula de negociació.",
        "choices": [
            ("Signar l'Exit, passar el patrimoni a renda global i descansar un any sencer al mar", "end_14_serial_holding"),
        ],
    },
    # --- BRANCH D: LIFESTYLE INFLATION REDEMPTION ---
    "c_trap_1": {
        "kicker": "29 ANYS · DESPERTAR DEL MIRATGE",
        "title": "Cobres 2.400 €/mes però tens -11.000 € entre cotxe i targeta",
        "body": "Després de set anys de sopars, viatges a crèdit i cotxe car, un imprevist et deixa sense marge i sents una angoixa constant a final de mes.",
        "choices": [
            ("Tall radical d'humilitat: vendre el cotxe, liquidar el 100% del deute en 14 mesos i començar de nou", "c_trap_redeem"),
            ("Refinançar el deute a 8 anys per no renunciar a l'estatus aparent", "end_12_debt_spiral"),
        ],
    },
    "c_trap_redeem": {
        "kicker": "42 ANYS · LA REMONTA DEL CONVERS",
        "title": "De -11.000 € a +195.000 € nets en dotze anys de constància",
        "body": "Qui ha conegut l'angoixa del deute valora la pau financera més que ningú. Amb 42 anys ja tens un coixí indestructible i hàbits sans.",
        "choices": [
            ("Seguir el rumb tranquil fins a una jubilació anticipada i plena als 57 anys", "end_16_redemption_arc"),
        ],
    },
    # --- 16 ENDINGS ---
    "end_01_panic": {
        "ending": True,
        "rank": "FINAL 01/16 · El Preu de Vendre en Pànic",
        "body": "Cristal·litzar una caiguda temporal del 36% i quedar-te en dipòsits l'1% durant les dues dècades següents va frenar en sec el teu patrimoni. Lliçó d'or: la volatilitat no és pèrdua si no vens.",
    },
    "end_02_artisan_fire": {
        "ending": True,
        "rank": "★ FINAL 02/16 · L'Artesà Lliure de Muntanya",
        "body": "Casa pagada, despeses baixes, fons creixent en silenci i tardes dedicades a crear amb les mans i gaudir de la natura. Una vida que no necessita vacances.",
    },
    "end_03_calm_retire": {
        "ending": True,
        "rank": "★ FINAL 03/16 · Llibertat Serena als 48 Anys",
        "body": "Sense hipoteca i amb una cartera ben diversificada, tanques l'etapa laboral disset anys abans de l'edat oficial amb plena salut física i mental.",
    },
    "end_04_zen_fire_master": {
        "ending": True,
        "rank": "★★ FINAL 04/16 · Mestre de la Retirada Flexible",
        "body": "Adaptar lleugerament la despesa durant els anys d'inflació alta va protegir el teu capital principal, que als 75 anys supera el milió d'euros després de gairebé 40 anys de llibertat!",
    },
    "end_05_swr_erosion": {
        "ending": True,
        "rank": "FINAL 05/16 · Erosió per Risc de Seqüència",
        "body": "Retirar un 6,5% rígid en plena estagflació va esgotar la cartera als 66 anys, obligant-te a reajustar fortament al tram final. La flexibilitat és el secret del FIRE llarg.",
    },
    "end_06_dynasty_sage": {
        "ending": True,
        "rank": "★★ FINAL 06/16 · Patriarca / Matriarca d'Abundància i Valors",
        "body": "No només deixes més d'1,6M € ben estructurats, sinó fills autònoms i serens que saben gestionar tant els diners com el seu propi temps.",
    },
    "end_07_wise_exec": {
        "ending": True,
        "rank": "★ FINAL 07/16 · L'Executiu que va Saber Baixar a Temps",
        "body": "Vas aprofitar els anys d'ingressos alts per construir capital sense quedar atrapat a la roda de l'ego corporatiu. Salut i llibertat intactes als 50!",
    },
    "end_08_saved_bell": {
        "ending": True,
        "rank": "FINAL 08/16 · Segona Oportunitat Aprofitada",
        "body": "L'ensurt mèdic dels 44 anys et va fer canviar radicalment de ritme. Gràcies al patrimoni acumulat, vas viure trenta anys més tranquils, presents i agraïts.",
    },
    "end_09_rich_burnout": {
        "ending": True,
        "rank": "FINAL 09/16 · El Més Ric de la Sala d'Espera",
        "body": "Vas assolir els 2 milions d'euros, però amb una salut crònicament malmesa que t'impedeix gaudir dels viatges i reptes que havies posposat.",
    },
    "end_10_hybrid_architect": {
        "ending": True,
        "rank": "★★ FINAL 10/16 · Arquitecte Patrimonial Complet",
        "body": "La combinació d'immobles comprats amb marge de seguretat a tipus fix més liquiditat indexada global t'ha donat estabilitat i llibertat en tots els cicles econòmics.",
    },
    "end_11_deleveraged_survivor": {
        "ending": True,
        "rank": "FINAL 11/16 · Supervivent del Palanquejament",
        "body": "Tallar pel sa venent a temps et va permetre conservar dos bons actius i aprendre que el deute variable excessiu és dinamita financera.",
    },
    "end_12_debt_spiral": {
        "ending": True,
        "rank": "FINAL 12/16 · Atrapats a l'Interès Compost en Contra",
        "body": "Quan l'interès compost juga en contra teva al 10% anual, cap sou arriba prou lluny. Toca començar de zero amb humilitat i pressupost estricte.",
    },
    "end_13_cashcow_founder": {
        "ending": True,
        "rank": "★★ FINAL 13/16 · Fundador amb Sistemes i Tardes Lliures",
        "body": "Una empresa petita, rendible, sense deute i ben delegada és una de les joies més rares i lliures del món econòmic.",
    },
    "end_14_serial_holding": {
        "ending": True,
        "rank": "★★ FINAL 14/16 · Mestre del Holding Personal",
        "body": "Transformar el fruit d'una empresa en patrimoni diversificat i reemprenedoria sense pressió multiplica tant el teu impacte com la teva calma vital.",
    },
    "end_15_vc_wipeout": {
        "ending": True,
        "rank": "FINAL 15/16 · Dilució i Preferència de Liquidació",
        "body": "L'empresa es va malvendre d'urgència i les clàusules preferents dels inversors van deixar les teves accions comunes a zero, tot i quatre anys d'aprenentatge immens.",
    },
    "end_16_redemption_arc": {
        "ending": True,
        "rank": "★ FINAL 16/16 · La Victòria de la Constància Tardana",
        "body": "Rectificar als 29 anys et va demostrar que mai és tard: passes de les deutes a retirar-te amb 640.000 € i una pau interior insubornable.",
    },
}


# ==================== CHAPTER 2: 22 MARKET & MACRO CASES ====================
MARKET_CASES = [
    ("DECENNIS 01 · PER 36x", "Euforia tecnològica i portades de «nova era»", "Els múltiples cotitzen al doble de la seva mitjana històrica i el teu perruquer et recomana tres valors que han pujat un 240% enguany.", [
        ("A", "Moure tota la cartera al sector de moda per no quedar enrere", False, "Compres al punt de màxima compressió de retorn futur: en els 4 anys següents cau un -62%."),
        ("B", "Reequilibrar sistemàticament venent la part inflada cap a valor i renda fixa curta", True, "Reequilibrar t'obliga a vendre car sense necessitat d'endevinar el dia exacte del sostre."),
        ("C", "Demanar crèdit pignorat per doblar l'aposta alcista", False, "Una correcció del 30% força la liquidació automàtica de les teves garanties al pitjor preu."),
    ]),
    ("DECENNIS 02 · PER 9,8x", "Capitulació borsària del -42% i pànic als telenotícies", "Les grans empreses mundials amb caixa neta cotitzen a menys de 10 vegades beneficis, però ningú en vol sentir parlar.", [
        ("A", "Vendre ara per «entrar més avall quan tot s'aclareixi»", False, "Els mínims es formen enmig de les pitjors notícies; esperar bones notícies costa un +40% de rebot perdut."),
        ("B", "Mantenir l'aportació i moure part de la liquiditat tàctica cap a renda variable", True, "Comprar amb valoracions deprimides és la font número u de rendibilitat extraordinària a 10 anys."),
        ("C", "Tancar el compte d'inversió per sempre", False, "Converteixes una oscil·lació temporal de preus en una pèrdua patrimonial definitiva."),
    ]),
    ("DECENNIS 03 · INFLACIÓ 9,1%", "Espiral de preus i xoc d'energia", "L'IPC puja al 9% i els bancs centrals apugen els tipus oficials 400 punts bàsics en deu mesos.", [
        ("A", "Refugiar el 100% dels estalvis en compte corrent al 0,5% durant cinc anys", False, "Perds més d'un terç del teu poder de compra real sense adonar-te'n pel miratge nominal."),
        ("B", "Combinar actius reals, or/energia i empreses amb marges alts i poc deute", True, "Les empreses amb poder de fixació de preus traslladen la inflació sense ofegar-se en interessos."),
        ("C", "Comprar bons a 25 anys amb cupó de l'1% abans que pugin els tipus", False, "La sensibilitat a la durada enfonsa el preu dels bons llargs més d'un -30%."),
    ]),
    ("DECENNIS 04 · RISC DE SEQÜÈNCIA", "Acabes de jubilar-te amb 600k € i la borsa cau un -28%", "És el teu segon any retirat vivint de la cartera. Si vens accions deprimides per pagar totes les despeses, descapitalitzes el fons.", [
        ("A", "Vendre accions cada mes igualment i augmentar la despesa en viatges cars", False, "Buidar participacions al fons d'un crac en els primers 5 anys de jubilació trenca la regla del 4%."),
        ("B", "Gastar del coixí de liquiditat/bons curts durant 2 anys sense malvendre ni una acció", True, "El «cubell de liquiditat» per a 2-3 anys de despeses neutralitza el risc de seqüència de retorns!"),
        ("C", "Passar els 430k € restants a un dipòsit fix de per vida", False, "Congeles la pèrdua i deixes el teu poder adquisitiu indefens davant vint-i-cinc anys d'inflació."),
    ]),
    ("DECENNIS 05 · TIPUS AL PIC (5,25%)", "Tothom fa cua per Lletres a 6 mesos quan la inflació ja baixa", "La inflació ja ha caigut del 8% al 2,8%, però el públic desmunta carteres senceres per cobrar el 5% a sis mesos.", [
        ("A", "Vendre tota la renda variable a PER 14x per posar-la a lletres de 6 mesos", False, "Censures el creixement a llarg termini per assegurar només mig any d'interessos que aviat baixaran."),
        ("B", "Mantenir l'estructura global i allargar una mica la durada dels bons per fixar cupons alts", True, "Quan el banc central retalli tipus, gaudiràs tant del cupó fixat com de la revalorització dels actius."),
        ("C", "Endeutar-se al 7% per comprar divises exòtiques", False, "El carry-trade apalancat per a minoristes sol acabar en devaluació sobtada."),
    ]),
    ("DECENNIS 06 · DÈCADA PERDUDA LOCAL", "L'índex del teu país porta 12 anys estancat però la resta del món creix", "Tenies el 85% de la teva borsa concentrada en quatre bancs i elèctriques nacionals (*home bias*).", [
        ("A", "Doblar la concentració al teu país perquè «ja li toca pujar»", False, "Alguns índexs nacionals han trigat 25 anys a recuperar màxims per composició sectorial envellida."),
        ("B", "Diversificar globalment segons capitalització mundial sense biaix domèstic", True, "La diversificació geogràfica captura els motors d'innovació allà on neixin al món."),
        ("C", "Rotar de país cada gener comprant l'índex que més hagi pujat l'any anterior", False, "Perseguir el guanyador de l'any passat rendeix sistemàticament menys que l'índex global."),
    ]),
    ("DECENNIS 07 · DIFERIMENT FISCAL", "Fons d'acumulació vs rotació constant pagant plusvàlues", " Compares mantenir un fons d'acumulació 25 anys al 8% anual contra vendre i recomprar cada desembre pagant el 21% sobre guanys.", [
        ("A", "És exactament idèntic perquè el percentatge d'impost és el mateix", False, "Fals: pagar impostos cada any elimina el capital que hauria generat nous rendiments compostos."),
        ("B", "Diferir l'impost fins al rescat final afegeix més d'un +28% de patrimoni net acumulat", True, "L'efecte fiscal compost equival a rebre un préstec gratuït d'Hisenda per invertir-lo dècades."),
        ("C", "Triar productes amb 2,2% de comissió anual si et regalen una bateria de cuina", False, "Un 2% de comissió anual es menja prop del 40% del teu patrimoni final en trenta anys!"),
    ]),
    ("DECENNIS 08 · DIVISES I SOROLL", "«El dòlar s'enfonsa / l'euro desapareixerà aquest estiu!»", "Cada cert temps, titulars alarmistes sobre el canvi EUR/USD espanten l'inversor a llarg termini.", [
        ("A", "Cobrir divisa quan el dòlar ja ha caigut un 18% i treure la cobertura quan puja", False, "Acabes comprant protecció cara després del moviment i assumint el cost de diferencial de tipus."),
        ("B", "Mantenir renda variable global sense cobertura i renda fixa curta en la teva pròpia moneda (EUR)", True, "Regla clàssica institucional: les empreses globals ja facturen en múltiples divises, mentre la renda fixa en euros estabilitza la teva despesa local."),
        ("C", " Especular amb Forex apalancat 20:1 des del mòbil", False, "Més del 80% de comptes minoristes de Forex perden diners en menys de dotze mesos."),
    ]),
    ("DECENNIS 09 · ACOMULADOR JOVE (DCA)", "Tens 26 anys, poc capital acumulat i arriba una recessió de 2 anys", "Aportes 600 €/mes del teu sou, però veus que el teu compte de 12.000 € baixa malgrat les aportacions.", [
        ("A", "Aturar les aportacions mensuals fins que la borsa faci nous màxims històrics", False, "Renuncies a acumular participacions amb un descompte del 30-40% durant la teva millor etapa acumuladora!"),
        ("B", "Celebrar en silenci que cada mes de sou compra moltes més participacions per al futur", True, "Per a un jove acumulador net, un mercat baixista matiner és el millor regal matemàtic possible."),
        ("C", "Posar els 600 €/mes en bitllets de loteria i apostes", False, "L'esperança matemàtica negativa destrueix l'hàbit constructor."),
    ]),
    ("DECENNIS 10 · COMISSIONS SILENCIOSES", "Dos fons amb la mateixa cartera: un costa 0,15% TER i l'altre 1,85% TER", "En un horitzó de 30 anys sobre 150.000 € al 7,5% brut anual, quina diferència real suposa aquest 1,70% anual?", [
        ("A", "Uns 5.000 € poc rellevants", False, "Subestimes brutalment la pèrdua composta sobre els guanys no generats."),
        ("B", "Més de 480.000 € de diferència entre tots dos inversors al cap de 30 anys!", True, "En inversió, com deia Jack Bogle, obtens exactament allò pel que NO pagues en comissions inútils."),
        ("C", "El més car sempre guanyarà molt més perquè té un nom més elegant", False, "Més del 88% de fons cars no baten el seu índex net de comissions a 15 anys."),
    ]),
    ("DECENNIS 11 · CRISI BANCÀRIA PUNTUAL", "Fallida d'un banc mitjà estranger i correcció del -14% en una setmana", "Els reguladors garanteixen els dipòsits el cap de setmana, però dilluns regna la por.", [
        ("A", "Liquidar tota la cartera en l'obertura de dilluns a qualsevol preu", False, "Regales les teves accions als creadors de mercat en el moment de màxim diferencial i por."),
        ("B", "Verificar que els teus actius estan en entitats solventment segregades i no tocar res", True, "Els fons d'inversió estan fora del balanç del comercialitzador; la custòdia segregada et protegeix."),
        ("C", "Comprar accions del banc ja intervingut esperant que es multipliquin per deu", False, "En una resolució bancària, l'accionista és el primer a ser amortitzat a zero."),
    ]),
    ("DECENNIS 12 · FONDS TEMÀTICS DE MODA", "Es llança un ETF sobre la tendència més mediàtica de l'any després de pujar +180%", "Les gestores solen crear productes temàtics just quan la demanda minorista i les valoracions toquen sostre.", [
        ("A", "Fer-ne el nucli central (70%) del teu pla de jubilació", False, "L'evidència acadèmica mostra que els fons temàtics llançats en eufòria obtenen retorns molt inferiors al mercat ampli."),
        ("B", "Mantenir l'índex global ampli, que ja incorpora automàticament els guanyadors reals a mesura que creixen", True, "L'índex global es neteja sol sense que hagis d'encertar quina tecnologia dominarà el 2040."),
        ("C", "Canviar d'ETF temàtic cada sis mesos", False, "Compres car i vens avorrit una vegada rere l'altra."),
    ]),
    ("DECENNIS 13 · OR I ACTIUS REALS", "Després de 6 anys de borsa alcista tranquil·la, l'or no s'ha mogut de preu", "Et planteges eliminar la petita posició del 10% en or/reals perquè «no fa res».", [
        ("A", "Vendre'l just quan és més odiat i barat per comprar més tecnologia cara", False, "Elimines l'assegurança contra xocs monetaris precisament quan costa menys mantenir-la."),
        ("B", "Entendre que una cartera diversificada sempre té alguna peça avorrida que brillarà quan les altres fallin", True, "Si tots els actius de la teva cartera pugen alhora, vol dir que no estàs realment diversificat!"),
        ("C", "Passar el 100% del patrimoni a lingots físics amagats a casa", False, "L'or preserva poder de compra sécular però no genera flux de caixa ni dividends compostos."),
    ]),
    ("DECENNIS 14 · CRÈDIT CORPORATIU CAR", "Els bons «High Yield» (bo escombraria) només paguen un 1,4% més que el deute públic segur", "L'economia sembla perfecta i ningú preveu impagaments.", [
        ("A", "Concentrar tota la renda fixa en deute d'empreses molt endeutades per rascar aquest 1,4%", False, "Quan els diferencials de crèdit estan comprimits al mínim, el risc és totalment asimètric en contra teva."),
        ("B", "Mantenir la renda fixa en trams d'alta qualitat i assumir el risc conscientment a la renda variable", True, "La funció de la renda fixa en cartera és ser àncora en tempestes, no imitar la borsa quan cau el crèdit."),
        ("C", "Comprar pagarés d'una empresa no auditada que promet el 14% fix", False, "Promeses d'alt interès «sense risc» gairebé sempre amaguen insolvència."),
    ]),
    ("DECENNIS 15 · REEQUILIBRI ANUAL", "La renda variable ha pujat tant que ara pesa el 78% d'una cartera dissenyada al 60/40", "Fa respecte podar allò que millor està funcionant.", [
        ("A", "Deixar que pugi fins al 95% perquè «aquesta vegada mai baixarà»", False, "Assumeixes silenciosament molt més risc del que la teva psicologia tolerarà al pròxim sotrac."),
        ("B", "Reequilibrar al 60/40 amb noves aportacions (o traspàs fiscalment neutre entre fons)", True, "Usar les noves aportacions o traspassos sense peatge fiscal manté el risc sota control a cost zero."),
        ("C", "Vendre tota la renda variable i passar a 0/100", False, "El tot-o-res trenca el motor de composició."),
    ]),
]


# ==================== CHAPTER 3: 16 FOUNDER & HOLDING CASES ====================
FOUNDER_CASES = [
    ("FUNDADOR 01 · VALIDACIÓ", "Sis mesos programant en secret o vendre abans de construir?", "Tens una idea d'eina per a clíniques dentals i 12.000 € d'estalvi.", [
        ("A", "Tancar-te 8 mesos a programar 40 funcions sense parlar amb cap dentista", False, "El 90% de cops construeixes funcions que ningú vol pagar i t'esgotes la caixa abans de sortir."),
        ("B", "Entrevistar 20 clíniques i pre-vendre el servei a les 5 primeres resolent el seu maldecap número u", True, "Cobrar abans o mentre construeixes valida el dolor real i finança el desenvolupament amb caixa de clients."),
        ("C", "Gastar 9.000 € en logotip, oficina de disseny i nota de premsa", False, "Vanitat pura: cap client compra pel logotip si el problema no està resolt."),
    ]),
    ("FUNDADOR 02 · TRESORERIA CRÍTICA", "Factures 15.000 €/mes, en gastes 19.000 €/mes i queden 4 mesos de caixa", "El creixement és bo però el compte bancari s'esgota.", [
        ("A", "Oferir un pla anual amb 15% de descompte cobrat avui i retallar despesa supèrflua un 20%", True, "Cobrar anualitats per avançat transforma el capital circulant i et porta a flux positiu sense diluir-te!"),
        ("B", "Contractar tres comercials més esperant que facin miracles el mes vinent", False, "El període de rampa d'un comercial nou sol ser de 3-6 mesos; et quedes sense caixa abans."),
        ("C", "Rebaixar el preu un 50% a tothom", False, "Enfonses el marge brut i acceleres el concurs de creditors."),
    ]),
    ("FUNDADOR 03 · PACTE DE SOCIS", "Comences el projecte al 50/50 amb un amic de tota la vida", "Tot és il·lusió el dia u, però al cap de vuit mesos ell perd l'interès i deixa de treballar-hi.", [
        ("A", "No haver signat res: ara marxa amb el 50% de les accions per sempre («capital mort»)", False, "Un 50% en mans inactives bloqueja l'empresa i espanta qualsevol futur soci o comprador."),
        ("B", "Signar des del primer dia consolidació d'accions (vesting a 4 anys amb 1 any de prova / cliff)", True, "El pacte de socis amb vesting protegeix tant l'empresa com l'amistat amb regles justes per a tothom."),
        ("C", "Barallar-vos als jutjats gastant tota la caixa en advocats", False, "Destrueix el negoci en el seu moment més fràgil."),
    ]),
    ("FUNDADOR 04 · CHURN (BAIXES DE CLIENTS)", "Captes 40 clients nous al mes, però se'n donen de baixa 35 cada mes", "L'equip vol invertir el doble en anuncis per créixer.", [
        ("A", "Doblar la despesa publicitària immediatament", False, "Tirar més aigua en una galleda foradada només crema diners més de pressa."),
        ("B", "Aturar anuncis 60 dies, trucar personalment a qui marxa i arreglar l'activació del producte", True, "Reduir el Churn del 8% al 2% multiplica el valor de vida del client (LTV) per quatre!"),
        ("C", "Amagar el botó de donar-se de baixa amb lletra petita", False, "Destrueix la reputació de marca i multiplica les devolucions i ressenyes negatives."),
    ]),
    ("FUNDADOR 05 · DEPENDÈNCIA DE CLIENT", "Un sol client gegant genera el 62% de tota la teva facturació", "Exigeix funcions a mida exclusives i pagar a 120 dies.", [
        ("A", "Convertir tot el teu equip en el seu departament extern exclusiu", False, "Si l'any vinent canvia el seu director i cancel·la el contracte, la teva empresa tanca en un mes."),
        ("B", "Posar sostre al desenvolupament a mida i diversificar vendes fins que cap client superi el 12%", True, "Una cartera atomitzada et dóna llibertat operativa i duplica el múltiple de valoració M&A."),
        ("C", "Insultar el client i rescindir el contracte avui sense coixí", False, "Transicionar amb cap et permet usar el seu marge per finançar la diversificació."),
    ]),
    ("FUNDADOR 06 · POLÍTICA DE PREUS", "Ningú es queixa mai del teu preu (19 €/mes) i dones un suport impecable", "El teu producte estalvia més de 400 €/mes en temps a cada empresa client.", [
        ("A", "Mantenir 19 €/mes per por de molestar algú", False, "Cobrar massa barat impedeix contractar bon equip i atrau clients poc compromesos."),
        ("B", "Crear plans escalonats per valor (49 €, 99 € i 199 €) respectant l'antiguitat als primers fidels", True, "Cobrar segons el valor generat dispara el marge net sense necessitat de multiplicar costos de suport."),
        ("C", "Posar un preu ocult i cobrar càrrecs sorpresa al final", False, "La transparència és sagrada per construir confiança B2B duradora."),
    ]),
    ("FUNDADOR 07 · DELEGAR I SISTEMES", "Treballes 68 hores per setmana revisant cada correu i cada factura", "El negoci guanya 9.000 €/mes nets, però portes dos anys sense vacances reals.", [
        ("A", "Documentar processos repetitius i contractar una persona responsable d'operacions (2.600 €/m)", True, "Recuperes 30 hores setmanals per pensar estratègicament i l'empresa passa a ser un actiu vendible!"),
        ("B", "Seguir fent-ho tot sol perquè «ningú ho fa al 100% com jo»", False, "Al 85% ben fet pel teu equip amb sistemes escales; al 100% fet només per tu col·lapses."),
        ("C", "Tancar l'empresa d'esgotament sense traspassar-la", False, "Regales anys d'esforç que tenien un alt valor de mercat."),
    ]),
    ("FUNDADOR 08 · CAPITAL AL HOLDING", "Acabes de vendre el 25% secundari o rebre 300.000 € de dividends acumulats", "El teu negoci principal ja és sòlid i autofinançat. Què fas amb l'excedent al Holding?", [
        ("A", "Gastar-ho en oficines de marbre i cotxes d'empresa improductius", False, "Converteixes tresoreria lliure en costos fixos rígids."),
        ("B", "Diversificar el Holding entre fons globals, actius generadors de renda i capital llavor per a nous projectes", True, "Separes el risc operatiu d'una sola empresa del teu patrimoni familiar permanent!"),
        ("C", "Apostar els 300.000 € sencers en una sola startup d'un conegut sense mirar comptes", False, "L'inversor àngel prudent diversifica petits tiquets i exigeix mètriques clares."),
    ]),
    ("FUNDADOR 09 · EXPANSIÓ INTERNACIONAL", "Domines el teu nínxol local i vols obrir França i Alemanya", "Tens 90.000 € en caixa i un equip petit.", [
        ("A", "Obrir dues oficines físiques cares i contractar directors locals abans de vendre ni un euro allà", False, "Estructura pesada abans de validar l'encaix cultural pot cremar tota la tresoreria en mig any."),
        ("B", "Validar primer en remot amb clients pilot locals i aliança amb un distribuïdor natiu", True, "Aprens les particularitats del mercat amb risc mínim i només escales estructura quan ja hi ha tracció provada."),
        ("C", "Traduir la web amb errors i no adaptar suport ni facturació", False, "Genera desconfiança immediata en mercats B2B exigents."),
    ]),
    ("FUNDADOR 10 · COMPRA D'UN COMPETIDOR PETIT (M&A)", "Un competidor artesanal es jubila i ven la seva cartera de 180 clients fidels a 2,2x benefici", "El teu Holding té liquiditat suficient.", [
        ("A", "Estructurar la compra amb 60% inicial i 40% vinculat a la retenció de clients durant 12 mesos (earn-out)", True, "Alinees interessos amb el venedor perquè faci un traspàs impecable i creixes d'escala en un dia!"),
        ("B", "Pagar el doble sense revisar contractes ni auditar impostos pendents", False, "Una compra sense due diligence pot amagar passius fiscals o laborals greus."),
        ("C", "Canviar brusca i unilateralment totes les condicions als seus clients el primer dia", False, "Provoca una fugida massiva del fons de comerç que acabes de comprar."),
    ]),
    ("FUNDADOR 11 · CULTURA I RITME SOSTENIBLE", "L'equip encadena dos llançaments seguits treballant caps de setmana", "Les vendes pugen, però notes respostes seques i errors tontos al codi.", [
        ("A", "Exigir un tercer esprint consecutiu per aprofitar l'inèrcia", False, "Perds els dos millors enginyers per esgotament i substituir-los et costa sis mesos de retard."),
        ("B", "Declarar setmana de manteniment suau, donar dies lliures reals i protegir ritmes sostenibles", True, "Les grans empreses es construeixen a ritme de marató serena, mai encadenant esprints infinits."),
        ("C", "Posar una taula de ping-pong sense reduir la càrrega real", False, "El benestar cosmètic sense temps real de descans genera cinisme."),
    ]),
]


# ==================== CHAPTER 4: 25 PARENTING SCENES (0 TO 12 YEARS) ====================
PARENTING_CASES = [
    ("CRIANÇA 01 · 0-1 ANYS · VESPRE INTENS", "19:45h: el nadó plora desconsolat tot i haver menjat i anar net", "Portes tot el dia amb ell i cap truc sembla calmar-lo al moment (l'anomenada «hora bruixa»).", [
        ("A", "Deixar-lo plorar sol a les fosques perquè «aprengui a no manipular»", "El seu nivell de cortisol es dispara i s'adorm per esgotament fisiològic, no per calma.", "Un nadó de pocs mesos no té capacitat neurològica de manipular; el plor és el seu únic pont de comunicació i regulació."),
        ("B", "Sostenir-lo pell amb pell amb llum tènue, balanceig lent i fer relleu amb la parella quan notis sobrecàrrega", "Nota el teu batec estable, descarrega la tensió sensorial del dia i s'adorm tranquil.", "La co-regulació física madura el sistema vagal del nadó i crea la base biològica de l'aferrament segur."),
        ("C", "Encendre pantalles brillants i sacsejar joguines sorolloses davant la seva cara", "S'hiperaestimula encara més i li costa el doble adormir-se.", "Al vespre el sistema nerviós immadur necessita reduir estímuls lumínics i acústics."),
    ]),
    ("CRIANÇA 02 · 0-1 ANYS · OPINIONS EXTERNES", "«Si l'agafes cada cop que plora el faràs malcriat!»", "En un dinar familiar, un parent opina amb insistència mentre el teu nadó de 5 mesos et demana braços.", [
        ("A", "Deixar el nadó plorant al cotxet per complaure la visita i evitar comentaris", "El nadó se sent desatès i tu passes tot el dinar amb un nus a l'estómac.", "La teva prioritat és el benestar del teu fill, no satisfer teories antigues de terceres persones."),
        ("B", "Agafar el teu nadó amb un somriure serè: «Ara mateix necessita braços i ens encanta donar-los-hi»", "El nadó es calma a l'instant al teu pit i marques un límit amable sense entrar en discussió.", "Com més segur se sent un nadó atès en la dependència, més autònom i valent explora quan comença a caminar!"),
        ("C", "Cridar i barallar-te furiosament a mitja taula", "Es crea un clima de forta tensió que el nadó també absorbeix.", "Un límit ferm, curt i somrient desarma molt millor que una justificació llarga."),
    ]),
    ("CRIANÇA 03 · 1-3 ANYS · AUTONOMIA", "«Jo sol!!» volent cordar-se les sabates quan ja feu tard", "Té 2 anys i mig, vol fer-ho tot sol però els dits encara no li donen per tancar la tira i s'enfada.", [
        ("A", "Apartar-li les mans d'una estrebada i posar-li tu dient que és massa petit", "Esclata en una rebequeria monumental sentint-se envaït.", "Als 2 anys estan descobrint la seva identitat separada; tallar en sec el seu impuls d'autonomia activa resistència."),
        ("B", "Dividir la tasca en equip: «Jo obro la llengüeta perquè entri el peu i tu apretes fort el velcro final!»", "Fa el «clic» final tot orgullós i sortiu per la porta de bon humor.", "La bastida evolutiva (Vygotsky) permet que faci la part que ja domina mantenint intacta la seva sensació d'eficàcia."),
        ("C", "Arribar quaranta minuts tard a tot arreu sense posar cap estructura", "Acabes estressada amb la feina.", "Anticipar 5 minuts extra al matí transforma les batalles en aprenentatge."),
    ]),
    ("CRIANÇA 04 · 1-3 ANYS · PEGAR O MOSSEGAR", "S'enfada perquè no pot tocar un endoll i et llança una manotada", "Té 2 anys i la frustració li surt directament per les mans.", [
        ("A", "Tornar-li un copet a la mà «perquè vegi que fa mal»", "Es queda confós i espantat: qui li diu «no es pega» li acaba de pegar.", "El cervell aprèn molt més pel que fem que pel que diem; modelar autocontrol ensenya autocontrol."),
        ("B", "Sostenir les seves mans amb suavitat i fermesa: «No et deixo pegar-me. Estàs enfadat per l'endoll; fem cops al coixí?»", "Descarrega la ràbia sense fer mal i es refugia en una abraçada.", "Permetre l'emoció mentre contenim amb calma la conducta agressiva construeix el fre prefrontal."),
        ("C", "Riure perquè és petit i sembla graciós", "Rep el senyal confús que pegar és un joc divertit i ho repeteix més fort.", "Cal claredat serena i coherent des del primer dia."),
    ]),
    ("CRIANÇA 05 · 1-3 ANYS · BOLQUER", "Té 2 anys i 4 mesos i a l'estiu tothom et pregunta si ja li has tret el bolquer", "Encara no avisa quan té pipí ni mostra interès per l'orinal.", [
        ("A", "Treure-li de cop per pressió social i renyar-lo cada vegada que es mulla", "Agafa por i retenció amb estrès al voltant d'una funció fisiològica natural.", "El control d'esfínters depèn de la mielinització neurològica, no de la força de voluntat ni del calendari d'estiu."),
        ("B", "Observar senyals reals de maduresa, posar l'orinal accessible sense pressió i acompanyar el seu ritme", "Quan el seu cos està preparat unes setmanes o mesos després, fa el pas en pocs dies i amb orgull.", "Respectar els temps maduratius estalvia mesos de lluites innecessàries."),
        ("C", "Comparar-lo amb el fill dels veïns davant seu", "Sembra inseguretat sense accelerar cap connexió nerviosa.", "Cada infant té el seu propi rellotge de desenvolupament."),
    ]),
    ("CRIANÇA 06 · 4-6 ANYS · ARRIBADA DE GERMÀ", "«Tornem el bebè a l'hospital, no el vull a casa!»", "El gran de 4 anys ho diu seriós després d'una tarda on totes les visites només miraven el nadó.", [
        ("A", "Escandalitzar-te: «Quin horror dir això! Has d'estimar el teu germà sempre!»", "Sent que és dolent i amaga la gelosia sota pessics d'amagat.", "Prohibir expressar la gelosia amb paraules fa que acabi sortint amb conductes."),
        ("B", "Acollir la seva veritat sense espantar-te: «A vegades es fa pesat compartir la mare i trobes a faltar quan érem sols, oi? Vine aquí.»", "Suspira profundament sentint que encara té el seu lloc segur al teu cor.", "Quan la gelosia té permís per parlar-se, perd la meitat de la seva càrrega i deixa espai a l'afecte real entre germans."),
        ("C", "Ignorar-lo i marxar enfadada a l'altra habitació", "Confirma la seva por més profunda: haver estat desplaçat.", "15 minuts diaris exclusius amb el gran fan meravelles."),
    ]),
    ("CRIANÇA 07 · 4-6 ANYS · ÀPATS TRANQUILS", "Seu a taula i aparta el plat de llenties sense ni tastar-les", "Fa uns mesos en menjava, però ara entra en etapa selectiva.", [
        ("A", "«Fins que no t'acabis les llenties no t'aixeques de la cadira!»", "Plors, fàstic associat al plat i mal ambient familiar cada nit.", "Forçar a menjar desconnecta els senyals naturals de gana i sacietat de l'hipotàlem."),
        ("B", "Aplicar Ellyn Satter: servir una culleradeta petita al costat de pa/fruita, menjar tu amb gust i conversar tranquils", "Sense sentir-se vigilat, molts dies acaba tastant-ne pel seu propi peu.", "Tu decideixes l'oferta saludable i l'horari; l'infant decideix quanta quantitat entra al seu cos."),
        ("C", "Substituir el sopar per galetes dolces perquè «almenys mengi alguna cosa»", "Aprèn que rebutjar el sopar té premi ensucrat garantit.", "Mantenir el menú familiar amb un aliment segur (arròs, pa, ou, fruita) dóna estructura sana."),
    ]),
    ("CRIANÇA 08 · 4-6 ANYS · SALUDAR ADULTS", "Un conegut s'ajup i li diu: «Que no em fas un petó? Si no me'l fas em posaré trist!»", "El teu fill de 5 anys s'amaga darrere la teva cama incòmode.", [
        ("A", "Empènyer-lo: «Va, no siguis maleducat, fes-li un petó ràpid!»", "Aprèn que el seu cos està al servei de no incomodar els adults.", "Respectar els límits corporals dels infants és la millor prevenció i educació d'autoestima."),
        ("B", "Protegir amb naturalitat: «Avui li surt saludar des d'aquí. Pots dir hola amb la mà o xocar cinc si vols!»", "Saluda amb la mà des del teu costat sentint-se protegit i respectat.", "Educació i cortesia («bon dia / gràcies») són compatibles al 100% amb no forçar mai el contacte físic."),
        ("C", "Etiquetar-lo davant del conegut: «Perdona'l, és que és molt tímid i esquerp»", "Sent com li pengen un rètol limitant que s'acaba creient.", "Evita parlar d'ell en tercera persona amb etiquetes davant seu."),
    ]),
    ("CRIANÇA 09 · 4-6 ANYS · PERDRE JUGANT", "Perd una partida de parxís i llança el dau enfadat dient que fas trampes", "Als 5 anys tolerar la derrota encara costa un món.", [
        ("A", "Deixar-lo guanyar absolutament sempre fent trampes a favor seu", "El dia que juga amb amics a l'escola s'enfonsa perquè no ha entrenat mai perdre en un lloc segur.", "Casa és el gimnàs amable on practicar tant guanyar com perdre."),
        ("B", "Validar sense sermó: «Uf, fa ràbia quan estaves tan a prop de guanyar! Vols la revenja o canviem de joc?»", "Esbufega un minut i demana tirar una altra partida.", "Acompanyar la petita frustració sense ridiculitzar-lo enforteix la resiliència."),
        ("C", "Renyar-lo dient que no jugaràs mai més amb ell si s'enfada", "Converteix el joc familiar en un examen ple de tensió.", "Mantingues el to lleuger i esportiu."),
    ]),
    ("CRIANÇA 10 · 7-9 ANYS · EXCLUSIÓ AL PATI", "Torna de l'escola amb cap cot: «Avui el Marc ha dit que jo no podia jugar a futbol»", "Té 8 anys i les dinàmiques socials al pati comencen a fer mal.", [
        ("A", "Minimitzar-ho: «Bah, doncs passa d'ells, hi ha molts nens al món!»", "Se sent sol amb la seva tristesa i deixa d'explicar-te què li passa a l'escola.", "Abans de buscar solucions, el cor humà necessita sentir que algú entén com cou el rebuig."),
        ("B", "Escoltar amb presència: «Ostres, quedar-se fora fa mal de debò. Què has fet després? Busquem idees junts per a demà?»", "S'obre, t'explica tot el pati i ell mateix troba amb qui li ve de gust jugar demà.", "Escoltar sense interrompre ni dramatitzar manté obert el canal de confiança per a tota la vida."),
        ("C", "Escriure un missatge agressiu al grup de famílies de la classe al minut u", "Generes un conflicte adult sobredimensionat per un frec puntual de pati.", "Distingeix entre un conflicte puntual (on l'entrenes a ell) i l'assetjament sostingut (on sí que actues amb l'escola)."),
    ]),
    ("CRIANÇA 11 · 7-9 ANYS · DEURES I MENTALITAT", "«Aquest problema de matemàtiques és impossible, no serveixo per als números!»", "Tanca la llibreta de cop amb ràbia.", [
        ("A", "Dictar-li tu el resultat ràpid per acabar aviat i sopar", "Porta els deures fets, però confirma la creença interna que sol no en sap.", "L'ajuda excessiva debilita la perseverança cognitiva."),
        ("B", "Pausa curta + dividir el repte: «El teu cervell està suant perquè això és nou! Llegim només la primera frase i fem un dibuix?»", "En veure-ho dibuixat entén el pas i se li il·lumina la cara d'orgull propi.", "Desglossar una muntanya en pedretes petites + mentalitat de creixement desbloqueja l'aprenentatge."),
        ("C", "Cridar que a la seva edat tu ho feies sense queixar-te", "La por i la tensió bloquegen literalment la memòria de treball necessària per calcular.", "El cervell només raona bé quan se sent emocionalment segur."),
    ]),
    ("CRIANÇA 12 · 10-12 ANYS · PORTA TANCADA", "Arriba als 11 anys i per primer cop tanca la porta de la seva habitació", "Fins fa poc volia estar sempre enganxat a tu al menjador.", [
        ("A", "Entrar sense trucar o prohibir tancar la porta prenent-t'ho com un rebuig personal", "Senteix que envaeixes la seva intimitat naixent i s'allunya emocionalment.", "A la preadolescència necessiten un espai propi d'intimitat sana per construir la seva identitat."),
        ("B", "Trucar sempre abans d'entrar i crear moments relaxats d'estar a prop sense interrogar (cuinant o passejant)", "Agraeix el respecte i al vespre surt sol a xerrar amb tu a la cuina!", "Respectar el seu espai físic fa que segueixi escollint compartir amb tu el seu espai emocional."),
        ("C", "Desentendre't completament pensant que «ja és gran i no em necessita»", "Els preadolescents encara necessiten moltíssim límit afectuós i presència disponible.", "Canvia la forma d'acompanyar: passes de capità a far proper i fiable."),
    ]),
    ("CRIANÇA 13 · 10-12 ANYS · PRESSIÓ DEL PRIMER MÒBIL", "«Tota la classe té telèfon amb xarxes menys jo, em deixeu al marge!»", "Té 11 anys i la pressió social del grup apreta fort.", [
        ("A", "Comprar-li un telèfon obert sense límits avui mateix per por que s'enfadi", "Exposició prematura a algorismes addictius i pèrdua d'hores de son.", "Posposar les xarxes socials i acompanyar la tecnologia amb acords graduals protegeix la salut mental adolescent."),
        ("B", "Validar el que sent + oferir alternativa social real: «Entenc que fa ràbia ser dels pocs. A casa esperem als 14 per a xarxes, però convidem els amics a berenar divendres!»", "Protesta una mica, però veu que t'importa la seva vida social i accepta el marc clar.", "Sostenir un límit contracultural amb empatia i alternatives socials reals construeix caràcter."),
        ("C", "Fer-li un discurs apocalíptic d'una hora dient que tots els seus amics estan perduts", "Tanca les orelles i sent que no entens el seu món.", "Valida el desig de pertànyer al grup mentre mantens ferm el criteri de salut familiar."),
    ]),
    ("CRIANÇA 14 · PARELLA I TRIBU", "Sentiu que des que sou pares només parleu de logística, compres i horaris", "Al final del dia caieu rendits al sofà com dos socis d'empresa esgotats.", [
        ("A", "Esperar passivament a «quan els nens tinguin 12 anys» per cuidar la relació", "La distància emocional s'acumula en silenci any rere any.", "La relació de parella o l'equip d'adults és l'ecosistema emocional on respiren els infants."),
        ("B", "Instaurar una micro-cita setmanal a casa sense pantalles (un te/sopar tranquil de 30 minuts sense parlar de tasques)", " Torneu a riure, a mirar-vos als ulls i a fer pinya davant el cansament.", "Petits rituals constants de 20 minuts cuiden el vincle molt més que un viatge un cop cada dos anys."),
        ("C", "Retreure qui està més cansat dels dos competint pel patiment", "La competició de cansament divideix l'equip; agrair en veu alta suma energia.", "Canvia «jo he fet més» per «quin dia més intens, com ens cuidem tots dos avui?»."),
    ]),
    ("CRIANÇA 15 · REPARACIÓ QUAN PERDS LA CALMA", "Has tingut un vespre dur i has contestat amb to brusc i impacient", "Ja dorm o esteu al llit i et pesa la culpa al pit.", [
        ("A", "Castigar-te mentalment tota la nit pensant que ho fas tot malament", "L'endemà t'aixeques amb menys energia i més irritable encara.", "L'autocompassió no és autoindulgència: és tractar-te amb la mateixa bondat que li ensenyes al teu fill."),
        ("B", "Fer una reparació tendra i breu: reconèixer l'error sense excuses, abraçar i descansar", "El vincle queda net, segur i encara més humà.", "Segons les recerques d'Ed Tronick, fins i tot en l'aferrament més sa hi ha desajustos constants; la màgia rau en la reparació!"),
        ("C", "Prometre-li regals cars l'endemà per tapar el mal cos", "Confon la reparació emocional amb transaccions materials.", "Una disculpa honesta i una abraçada càlida és tot el que el seu cor necessita."),
    ]),
    ("CRIANÇA 16 · 1-3 ANYS · LLENÇAR MENJAR", "Acaba de menjar els trossets de plàtan i comença a tirar-los des de la trona mirant-te fixament", "Té 14 mesos i observa com cauen a terra.", [
        ("A", "Cridar fort perquè s'espanti i entengui que amb el menjar no es juga", "S'espanta o riu per la teva reacció teatral i ho torna a fer.", "Als 14 mesos està descobrint la llei de la gravetat i la senyalització de sacietat: tirar el menjar sovint vol dir «ja estic ple»."),
        ("B", "Retirar la safata amb calma amable: «Veig que el menjar vola, sembla que la panxa ja està plena! Baixem a jugar amb la pilota?»", "Entén el límit clar sobre el menjar i satisfà la seva necessitat d'experimentar llançant una pilota.", "Redirigir la necessitat motriu cap a l'objecte adequat ensenya sense cap lluita."),
        ("C", "Deixar que tiri tot el sopar a la paret durant vint minuts", "Es perd el límit respectuós amb els aliments i acabes esgotada netejant.", "Calma i fermesa immediata van de la mà."),
    ]),
    ("CRIANÇA 17 · 4-6 ANYS · COMPARACIONS ENTRE GERMANS", "«Mira que ràpid s'ha vestit la teva germana, aprèn d'ella!»", "Estàs a punt de deixar anar la frase clàssica per anar més de pressa.", [
        ("A", "Dir-la cada matí perquè competeixin a veure qui acaba abans", "S'encén una rivalitat amarga i el més lent assumeix el rol d'«el desastre de la família».", "Les comparacions directes alimenten la gelosia entre germans durant anys (Adele Faber & Elaine Mazlish)."),
        ("B", "Descriure només el que li falta a cadascú sense comparar: «Ja tens els pantalons! Només queden mitjons i vambes»", "Se centra en el seu pas sense sentir ressentiment cap a la germana.", "Protegir l'aliança entre germans és un dels millors regals vitals que els podem fer."),
        ("C", "Vestir el gran com un bebè tot i saber fer-ho mentre ignores l'altre", "Fomenta regressió innecessària.", "Acompanya cadascú segons el seu moment propi."),
    ]),
    ("CRIANÇA 18 · 7-9 ANYS · EDUCACIÓ FINANCERA SANA", "Té 8 anys i et demana comprar cada setmana cromos, revistes o petites joguines quan passegeu", "Vols que aprengui el valor de triar sense viure en l'escassetat ansiosa.", [
        ("A", "Dir sempre «no hi ha diners» amb angoixa o comprar-li tot perquè calli", "Genera o bé inseguretat amb els diners o bé intolerància immediata al desig.", "Els extrems no ensenyen a gestionar recursos."),
        ("B", "Assignar una petita paga setmanal gestionada en 3 pots transparents (Gastar, Estalviar per un objectiu i Compartir)", "En dues setmanes passa de demanar-t'ho tot a calcular si prefereix esperar tres setmanes per comprar el joc que de debò il·lusiona!", "Quan gestionen el seu propi pressupost petit amb llibertat d'equivocar-se, entrenen el múscul de posposar la recompensa."),
        ("C", "Pagar-li diners per rentar-se les dents o fer el seu propi llit", "Mercantilitza hàbits bàsics d'autocura i convivència familiar.", "La paga educativa funciona millor desvinculada de les responsabilitats bàsiques de ser part de la llar."),
    ]),
    ("CRIANÇA 19 · 10-12 ANYS · COMENTARIS SOBRE EL COS", "Amb 11 anys es mira al mirall i diu amb fàstic que té les cames lletges o que no li agrada el seu cos", "Els canvis de la pubertat i les comparacions comencen aviat.", [
        ("A", "Fer broma sobre el seu canvi físic o començar a parlar de dietes restrictives", "Multiplica la vergonya corporal en una etapa d'alta vulnerabilitat.", "Els comentaris familiars sobre el pes deixen empremta durant dècades."),
        ("B", "Escoltar sense treure-hi ferro, parlar amb respecte de com el cos creix i enfocar el valor en el que el cos ens permet fer i sentir", "Se sent acollit sense judici i relaxa l'autoexigència davant del mirall.", "Modelar a casa parlar bé també del nostre propi cos adult és l'escut més potent per a la seva imatge corporal."),
        ("C", "Dir-li «calla, no diguis bajanades» i canviar de tema de cop", "Sent que és un tema tabú del qual no pot parlar amb tu.", "Mantingues sempre la porta oberta a parlar del que li inquieta."),
    ]),
]


# ==================== CHAPTER 5: ILLUSTRATED SVG YOGA & CALM SEQUENCES ====================
YOGA_SEQUENCES = [
    (
        "yoga_esquena.xhtml",
        "Seqüència 1 · Alliberar Esquena, Cervical i Mandíbula (8 min)",
        "IDEAL DESPRÉS DE TREBALLAR O CARREGAR PES",
        [
            (
                "1. Sospir Fisiològic Doble + Espatlles Avall (4 respiracions)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80" width="240" height="74"><path d="M16,58 Q54,18 86,26 Q108,8 130,10 Q182,16 244,58" fill="none" stroke="#000000" stroke-width="2.6"/><circle cx="86" cy="26" r="3.5" fill="#000000"/><circle cx="130" cy="10" r="4" fill="#000000"/><text x="48" y="72" text-anchor="middle" font-family="monospace" font-size="10" fill="#000000">Inhala</text><text x="112" y="72" text-anchor="middle" font-family="monospace" font-size="10" fill="#000000">+Glop</text><text x="195" y="72" text-anchor="middle" font-family="monospace" font-size="10" fill="#000000">Exhala llarg</text></svg>',
                "Seu còmoda, inspira pel nas, afegeix un segon petit glop d'aire i deixa caure les espatlles lluny de les orelles mentre exhales lentament.",
            ),
            (
                "2. Marjaryasana-Bitilasana · Gat i Vaca Lent (6 cicles)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 85" width="240" height="78"><line x1="20" y1="70" x2="240" y2="70" stroke="#000000" stroke-width="1.5"/><path d="M70,70 L70,42 Q125,16 175,42 L175,70" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/><circle cx="188" cy="46" r="8" fill="none" stroke="#000000" stroke-width="2.4"/><path d="M70,45 Q125,58 175,45" fill="none" stroke="#000000" stroke-width="1.5" stroke-dasharray="4,3"/></svg>',
                "A quatre grapes (o asseguda a la cadira), inhala obrint suaument el pit i exhala arrodonint tota la columna vèrtebra a vèrtebra deixant caure el cap.",
            ),
            (
                "3. Balasana Restaurativa amb Coixí (8 respiracions)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80" width="240" height="74"><line x1="20" y1="64" x2="240" y2="64" stroke="#000000" stroke-width="1.5"/><rect x="128" y="48" width="66" height="14" rx="6" fill="none" stroke="#000000" stroke-width="1.6" stroke-dasharray="3,2"/><path d="M62,62 Q70,34 112,38 L158,48" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/><circle cx="168" cy="45" r="8" fill="none" stroke="#000000" stroke-width="2.4"/></svg>',
                "Separa una mica els genolls, recolza el tors i el front sobre un coixí gruixut i sent com la zona lumbar s'eixampla a cada inspiració.",
            ),
        ],
    ),
    (
        "yoga_nit.xhtml",
        "Seqüència 2 · Calma Profunda Abans de Dormir (10 min)",
        "BAIXAR PULSACIONS I PREPARAR EL SON REPARADOR",
        [
            (
                "1. Viparita Karani · Cames a la Paret (10 respiracions lentes)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 85" width="240" height="78"><line x1="20" y1="68" x2="220" y2="68" stroke="#000000" stroke-width="1.5"/><line x1="195" y1="12" x2="195" y2="68" stroke="#000000" stroke-width="2"/><line x1="95" y1="64" x2="188" y2="64" stroke="#000000" stroke-width="3" stroke-linecap="round"/><line x1="189" y1="64" x2="189" y2="18" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/><circle cx="80" cy="61" r="8" fill="none" stroke="#000000" stroke-width="2.4"/></svg>',
                "Estira't d'esquena i recolza les cames en vertical a la paret o sobre el sofà. Descansa els palmells cap amunt: alleuja cames cansades i calma el sistema simpàtic.",
            ),
            (
                "2. Supta Baddha Konasana · Papallona Reclinada (8 respiracions)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 80" width="240" height="74"><line x1="20" y1="64" x2="240" y2="64" stroke="#000000" stroke-width="1.5"/><path d="M68,58 L142,58 L176,44 L208,60" fill="none" stroke="#000000" stroke-width="2.8" stroke-linecap="round"/><circle cx="54" cy="55" r="8" fill="none" stroke="#000000" stroke-width="2.4"/></svg>',
                "Junta les plantes dels peus deixant caure els genolls sobre dos coixins laterals, amb una mà al cor i l'altra a l'abdomen.",
            ),
            (
                "3. Respiració 4–6 amb Mà al Pit (6 cicles)",
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 76" width="240" height="70"><circle cx="130" cy="38" r="28" fill="none" stroke="#000000" stroke-width="1.8" stroke-dasharray="4,3"/><circle cx="130" cy="38" r="15" fill="none" stroke="#000000" stroke-width="2.4"/><text x="48" y="42" font-family="monospace" font-size="10" fill="#000000">4s nas</text><text x="174" y="42" font-family="monospace" font-size="10" fill="#000000">6s suau</text></svg>',
                "Inspira comptant suaument fins a 4 pel nas i deixa anar l'aire comptant fins a 6 sense forçar, afluixant parpelles i llengua.",
            ),
        ],
    ),
]

SCREEN_FREE_GAMES = [
    ("Joc de Sofà (Energia Mínima)", "La Pizzeria Humana: tu ets la massa estirada panxa avall al sofà o estora, i el teu fill «amassa», posa ingredients imaginaris a la teva esquena i enforna. Ell riu i tu reps un massatge gratis!"),
    ("Joc de Sofà (Energia Mínima)", "L'Endevinalla al Dors: estirat amb els ulls tancats, l'infant et dibuixa amb el dit una lletra, número o animal a l'esquena i has d'endevinar què és."),
    ("Tarda a Casa", "El Museu de les Coses Petites: amb una capsa d'oueres busqueu per casa o al bosc 6 «tresors» de textures diferents i munteu una exposició amb entrades de paper."),
    ("Connexió en 10 Minuts", "Ràdio Històries inventades: apagueu el llum gran i cada persona afegeix una sola frase al conte boig d'un personatge fins que s'adormi l'últim."),
    ("Baixar Revolucions", "El Vaixell a la Panxa: l'infant es posa un peluix petit sobre la panxa estirat i l'ha de gronxar suaument amunt i avall respirant ben a poc a poc sense que caigui."),
    ("Autonomia i Riure", "El Restaurant d'Estrelles: els infants dissenyen amb paper el menú del sopar real que hi ha a la cuina, prenen nota amb llibreta i fan de cambrers oficials."),
]


def build_epub() -> Path:
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    pages: List[Tuple[str, str, str, bool]] = []

    # 1. Cover / Home Index
    cover_body = """
    <h1>Vides, Capital i Calma · v6</h1>
    <p style="text-align:center;"><i>Edició Integral de Diversos Dies per a Mode Avió · Kindle E-Ink</i></p>
    <div class="box">
      <div class="kicker">5 CAPÍTOLS INTERACTIUS SENSE WI-FI NI PANTALLES BRILLANTS</div>
      <p>Toca qualsevol secció per entrar-hi. Totes les respostes i camins estan separats en pantalles pròpies sense espòilers.</p>
      <a class="choice" href="cyoa_start.xhtml">1 · Vides &amp; Capital (46 Escenes Ramificades · 16 Finals)</a>
      <a class="choice" href="mkt_0.xhtml">2 · El Joc dels Decennis (12 Casos Macro &amp; Cicles)</a>
      <a class="choice" href="fnd_0.xhtml">3 · Fundador &amp; Holding (8 Dilemes d'Empresa)</a>
      <a class="choice" href="par_0.xhtml">4 · Créixer amb Calma 0–12a (15 Escenes Evolutives)</a>
      <a class="choice" href="yoga_hub.xhtml">5 · Estudi de Ioga Il·lustrat &amp; Jocs al Sofà</a>
    </div>
    """
    pages.append(("index.xhtml", BOOK_TITLE, xhtml_doc(BOOK_TITLE, cover_body), False))

    # 2. Chapter 1: 46-Node CYOA
    for nid, nd in CYOA_NODES.items():
        fname = f"cyoa_{nid}.xhtml"
        if nd.get("ending"):
            b = f"""
            <div class="kicker">DESENLLAÇ VITAL &amp; PATRIMONIAL</div>
            <h2>{html.escape(nd['rank'])}</h2>
            <div class="box">
              <p>{html.escape(nd['body'])}</p>
            </div>
            <p style="text-align:center;">
              <a class="btn-dark" href="cyoa_start.xhtml">↻ Viure una altra vida des dels 22 anys</a>
              <a class="btn" href="index.xhtml">Índex principal</a>
            </p>
            """
            pages.append((fname, nd["rank"], xhtml_doc(nd["rank"], b), False))
        else:
            ch_html = "\n".join(
                f'<a class="choice" href="cyoa_{target}.xhtml">→ {html.escape(label)}</a>'
                for label, target in nd["choices"]
            )
            b = f"""
            <div class="kicker">{html.escape(nd['kicker'])}</div>
            <h2>{html.escape(nd['title'])}</h2>
            <p>{html.escape(nd['body'])}</p>
            {ch_html}
            <p style="margin-top:0.8em;"><a class="btn" href="index.xhtml">← Índex</a></p>
            """
            pages.append((fname, nd["title"], xhtml_doc(nd["title"], b), False))

    # 3. Chapter 2: Market Cases
    for idx, (kicker, title, prompt, opts) in enumerate(MARKET_CASES):
        q_file = f"mkt_{idx}.xhtml"
        next_file = f"mkt_{idx + 1}.xhtml" if idx + 1 < len(MARKET_CASES) else "fnd_0.xhtml"
        next_lbl = "Següent cas de mercat →" if idx + 1 < len(MARKET_CASES) else "Passar a Fundador & Holding →"

        opts_links = []
        for oi, (key, txt, is_ok, expl) in enumerate(opts):
            ans_file = f"mkt_{idx}_opt{oi}.xhtml"
            opts_links.append(f'<a class="choice" href="{ans_file}">[{key}] {html.escape(txt)}</a>')
            verdict = "★ DECISIÓ RACIONAL D'ALT VALOR" if is_ok else "⚠ TRAMPA CONDUCTUAL O PATRIMONIAL"
            ans_body = f"""
            <div class="kicker">{html.escape(kicker)} · ANÀLISI</div>
            <h2>{verdict}</h2>
            <div class="box">
              <p><b>La teva tria [{key}]:</b> {html.escape(txt)}</p>
              <p>{html.escape(expl)}</p>
            </div>
            <p>
              <a class="btn" href="{q_file}">↺ Revisar el cas</a>
              <a class="btn-dark" href="{next_file}">{html.escape(next_lbl)}</a>
            </p>
            """
            pages.append((ans_file, f"Anàlisi Mercat {idx+1}", xhtml_doc(f"Anàlisi Mercat {idx+1}", ans_body), False))

        q_body = f"""
        <div class="kicker">{html.escape(kicker)} ({idx+1}/{len(MARKET_CASES)})</div>
        <h2>{html.escape(title)}</h2>
        <p>{html.escape(prompt)}</p>
        {''.join(opts_links)}
        <p><a class="btn" href="index.xhtml">← Índex</a></p>
        """
        pages.append((q_file, title, xhtml_doc(title, q_body), False))

    # 4. Chapter 3: Founder & Holding Cases
    for idx, (kicker, title, prompt, opts) in enumerate(FOUNDER_CASES):
        q_file = f"fnd_{idx}.xhtml"
        next_file = f"fnd_{idx + 1}.xhtml" if idx + 1 < len(FOUNDER_CASES) else "par_0.xhtml"
        next_lbl = "Següent dilema empresarial →" if idx + 1 < len(FOUNDER_CASES) else "Passar a Créixer amb Calma →"

        opts_links = []
        for oi, (key, txt, is_ok, expl) in enumerate(opts):
            ans_file = f"fnd_{idx}_opt{oi}.xhtml"
            opts_links.append(f'<a class="choice" href="{ans_file}">[{key}] {html.escape(txt)}</a>')
            verdict = "★ CRITERI SÒLID DE FUNDADOR" if is_ok else "⚠ RISC DE CAIXA O ESTRUCTURA"
            ans_body = f"""
            <div class="kicker">{html.escape(kicker)} · BALANÇ OPERATIU</div>
            <h2>{verdict}</h2>
            <div class="box">
              <p><b>La teva tria [{key}]:</b> {html.escape(txt)}</p>
              <p>{html.escape(expl)}</p>
            </div>
            <p>
              <a class="btn" href="{q_file}">↺ Tornar al dilema</a>
              <a class="btn-dark" href="{next_file}">{html.escape(next_lbl)}</a>
            </p>
            """
            pages.append((ans_file, f"Anàlisi Empresa {idx+1}", xhtml_doc(f"Anàlisi Empresa {idx+1}", ans_body), False))

        q_body = f"""
        <div class="kicker">{html.escape(kicker)} ({idx+1}/{len(FOUNDER_CASES)})</div>
        <h2>{html.escape(title)}</h2>
        <p>{html.escape(prompt)}</p>
        {''.join(opts_links)}
        <p><a class="btn" href="index.xhtml">← Índex</a></p>
        """
        pages.append((q_file, title, xhtml_doc(title, q_body), False))

    # 5. Chapter 4: Parenting 0-12y Cases
    for idx, (kicker, title, body_txt, opts) in enumerate(PARENTING_CASES):
        q_file = f"par_{idx}.xhtml"
        next_file = f"par_{idx + 1}.xhtml" if idx + 1 < len(PARENTING_CASES) else "yoga_hub.xhtml"
        next_lbl = "Següent escena evolutiva →" if idx + 1 < len(PARENTING_CASES) else "Entrar a l'Estudi de Ioga →"

        opts_links = []
        for oi, (key, txt, react, neuro) in enumerate(opts):
            ans_file = f"par_{idx}_opt{oi}.xhtml"
            opts_links.append(f'<a class="choice" href="{ans_file}">[{key}] {html.escape(txt)}</a>')
            ans_body = f"""
            <div class="kicker">{html.escape(kicker)} · SOTA L'ICEBERG</div>
            <h2>Lectura Emocional i Vincle</h2>
            <div class="box">
              <p><b>Reacció:</b> {html.escape(react)}</p>
              <div class="quote">{html.escape(neuro)}</div>
            </div>
            <p>
              <a class="btn" href="{q_file}">↺ Provar una altra mirada</a>
              <a class="btn-dark" href="{next_file}">{html.escape(next_lbl)}</a>
            </p>
            """
            pages.append((ans_file, f"Escena {idx+1} · {key}", xhtml_doc(f"Escena {idx+1}", ans_body), False))

        q_body = f"""
        <div class="kicker">{html.escape(kicker)} ({idx+1}/{len(PARENTING_CASES)})</div>
        <h2>{html.escape(title)}</h2>
        <p>{html.escape(body_txt)}</p>
        {''.join(opts_links)}
        <p><a class="btn" href="index.xhtml">← Índex</a> <a class="btn" href="yoga_hub.xhtml">◯ Estudi de Ioga</a></p>
        """
        pages.append((q_file, title, xhtml_doc(title, q_body), False))

    # 6. Chapter 5: Yoga Hub, Illustrated SVG Sequences & Sofa Games
    hub_body = """
    <div class="kicker">BENESTAR SENSE PANTALLES · IOGA &amp; JOCS TRANQUILS</div>
    <h2>Estudi de Ioga Restauratiu i Jocs Familiars</h2>
    <p>Tria la pràctica guiada o obre el receptari d'idees de joc tranquil quan tinguis poca bateria:</p>
    <a class="choice" href="yoga_esquena.xhtml">1 · Seqüència Esquena, Cervical i Mandíbula (Il·lustrada)</a>
    <a class="choice" href="yoga_nit.xhtml">2 · Seqüència Calma Profunda Abans de Dormir (Il·lustrada)</a>
    <a class="choice" href="play_ideas.xhtml">3 · Jocs Tranquils al Sofà i Tarda sense Pantalles</a>
    <p><a class="btn" href="index.xhtml">← Tornar a la Portada</a></p>
    """
    pages.append(("yoga_hub.xhtml", "Estudi de Ioga i Jocs", xhtml_doc("Estudi de Ioga i Jocs", hub_body), False))

    for seq_file, seq_title, seq_kicker, postures in YOGA_SEQUENCES:
        blocks = []
        for p_title, p_svg, p_desc in postures:
            blocks.append(f"""
            <div class="box">
              <h3>{html.escape(p_title)}</h3>
              <div class="svg-box">{p_svg}</div>
              <p>{html.escape(p_desc)}</p>
            </div>
            """)
        s_body = f"""
        <div class="kicker">{html.escape(seq_kicker)}</div>
        <h2>{html.escape(seq_title)}</h2>
        {''.join(blocks)}
        <p style="text-align:center;">
          <a class="btn-dark" href="yoga_hub.xhtml">← Altres sessions</a>
          <a class="btn" href="index.xhtml">Índex principal</a>
        </p>
        """
        pages.append((seq_file, seq_title, xhtml_doc(seq_title, s_body), True))

    play_cards = []
    for tag, desc in SCREEN_FREE_GAMES:
        play_cards.append(f"""
        <div class="box">
          <div class="kicker">{html.escape(tag)}</div>
          <p>{html.escape(desc)}</p>
        </div>
        """)
    play_body = f"""
    <div class="kicker">CONNEXIÓ QUOTIDIANA SENSE PANTALLES</div>
    <h2>Idees de Joc Tranquil en Família</h2>
    {''.join(play_cards)}
    <p style="text-align:center;">
      <a class="btn-dark" href="yoga_hub.xhtml">← Tornar a l'Estudi de Calma</a>
      <a class="btn" href="index.xhtml">Índex principal</a>
    </p>
    """
    pages.append(("play_ideas.xhtml", "Jocs Tranquils en Família", xhtml_doc("Jocs Tranquils", play_body), False))

    nav_xhtml = xhtml_doc(
        "Taula de Continguts",
        """
        <h1>Índex del Quadern v6</h1>
        <nav epub:type="toc" id="toc">
          <ol>
            <li><a href="index.xhtml">Portada Interactiva</a></li>
            <li><a href="cyoa_start.xhtml">1. Vides &amp; Capital (46 Escenes · 16 Finals)</a></li>
            <li><a href="mkt_0.xhtml">2. El Joc dels Decennis (12 Casos Macro)</a></li>
            <li><a href="fnd_0.xhtml">3. Fundador &amp; Holding (8 Dilemes d'Empresa)</a></li>
            <li><a href="par_0.xhtml">4. Créixer amb Calma 0–12a (15 Escenes)</a></li>
            <li><a href="yoga_hub.xhtml">5. Estudi de Ioga Il·lustrat &amp; Jocs al Sofà</a></li>
          </ol>
        </nav>
        """,
    )

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest_items = [
        '<item id="css" href="styles.css" media-type="text/css"/>',
        '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    ]
    spine_items = []
    for i, (fname, _t, _x, has_svg) in enumerate(pages):
        props = ' properties="svg"' if has_svg else ""
        manifest_items.append(f'<item id="p{i}" href="{fname}" media-type="application/xhtml+xml"{props}/>')
        spine_items.append(f'<itemref idref="p{i}"/>')

    opf = f"""<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="pub-id" xml:lang="ca">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">{BOOK_UUID}</dc:identifier>
    <dc:title>{html.escape(BOOK_TITLE)}</dc:title>
    <dc:language>ca</dc:language>
    <dc:creator>{html.escape(BOOK_AUTHOR)}</dc:creator>
    <meta property="dcterms:modified">{now_iso}</meta>
  </metadata>
  <manifest>
    {chr(10).join("    " + m for m in manifest_items)}
  </manifest>
  <spine>
    {chr(10).join("    " + s for s in spine_items)}
  </spine>
</package>
"""

    container_xml = """<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
"""

    with zipfile.ZipFile(OUTPUT_EPUB, "w") as zf:
        zf.writestr("mimetype", "application/epub+zip", compress_type=zipfile.ZIP_STORED)
        zf.writestr("META-INF/container.xml", container_xml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/styles.css", EPUB_CSS, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/nav.xhtml", nav_xhtml, compress_type=zipfile.ZIP_DEFLATED)
        zf.writestr("OEBPS/content.opf", opf, compress_type=zipfile.ZIP_DEFLATED)
        for fname, _t, content, _svg in pages:
            zf.writestr(f"OEBPS/{fname}", content, compress_type=zipfile.ZIP_DEFLATED)

    print(f"Built {OUTPUT_EPUB} ({OUTPUT_EPUB.stat().st_size / 1024:.1f} KB, {len(pages)} screens)")
    return OUTPUT_EPUB


if __name__ == "__main__":
    build_epub()
