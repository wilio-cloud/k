#!/usr/bin/env python3
"""
Kindle Calm Hub - Offline Interactive EPUB 3.0 Compiler (v3: Inversions, Empresa & Criança)
Generates `dist/quadern-enginy-kindle.epub` (100% Airplane-Mode compatible via Send to Kindle / USB).

Chapters:
  1. Vides & Capital (Llibre-Joc ramificat amb múltiples camins i 8 finals vitals/FIRE)
  2. El Joc dels Decennis & Fundador (14 escenaris tàctics d'inversió i empresa amb resposta sense espòilers)
  3. Créixer amb Calma & Ioga Suau (12 situacions interactives de criança respectuosa + 3 làmines SVG de respiració)
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

BOOK_UUID = "urn:uuid:8f4e2c10-9b3a-4d7e-a612-kindlecalm2026v3"
BOOK_TITLE = "Vides, Capital i Calma (Quadern Interactiu Mode Avió)"
BOOK_AUTHOR = "Racó Calmat · Kindle E-Ink"

EPUB_CSS = """\
body {
  font-family: "Bookerly", Georgia, Palatino, serif;
  color: #000000;
  background-color: #ffffff;
  margin: 0;
  padding: 0.45em 0.65em;
  line-height: 1.42;
}
h1, h2, h3 {
  font-weight: bold;
  margin: 0.25em 0 0.35em 0;
  line-height: 1.22;
}
h1 { font-size: 1.4em; text-align: center; }
h2 { font-size: 1.14em; border-bottom: 2px solid #000000; padding-bottom: 0.2em; }
h3 { font-size: 1.02em; }
p { margin: 0.4em 0; }
.kicker {
  font-family: monospace;
  font-size: 0.8em;
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
  padding: 0.4em;
  border: 1px solid #000000;
}
a.choice {
  display: block;
  padding: 0.5em 0.7em;
  margin: 0.4em 0;
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


# ==================== CHAPTER 1: BRANCHING LIFE & CAPITAL CYOA ====================
CYOA_NODES: Dict[str, dict] = {
    "start": {
        "kicker": "25 ANYS · EL PRIMER ESTALVI",
        "title": "18.000 € al compte i tres filosofies de vida",
        "body": "Acabes d'estalviar els teus primers 18.000 € nets després d'uns anys treballant. Els teus amics s'estan comprant cotxes nous a terminis, la teva família et diu que et compris un pis com sigui, i tu llegeixes sobre interès compost i emprenedoria.",
        "choices": [
            ("Automatitzar 500 €/mes a Fons Indexats Globals i viure de lloguer contingut", "n_index"),
            ("Demanar hipoteca fixa per comprar un pis vell per reformar i llogar habitacions", "n_flat"),
            ("Invertir 12.000 € i les tardes a llançar un negoci digital propi", "n_biz"),
        ],
    },
    "n_index": {
        "kicker": "31 ANYS · PRIMERA TEMPESTA DE MERCAT",
        "title": "El teu fons puja a 68.000 €... i de cop cau un -32%",
        "body": "Sis anys de disciplina impecable et porten a 68.000 €. Però esclata una crisi financera global i en dos mesos la pantalla marca 46.200 €. Al mateix temps, una empresa estrangera t'ofereix teletreballar des d'on vulguis.",
        "choices": [
            ("Comprar més aprofitant les rebaixes i mudar-te a un poble tranquil (Geo-arbitratge)", "n_geo_fire"),
            ("Mantenir l'aportació sense mirar la borsa i acceptar un càrrec directiu a la ciutat", "n_corp_climb"),
            ("Vendre-ho tot per por que baixi més i deixar els diners en un dipòsit al 1%", "end_panic_saver"),
        ],
    },
    "n_flat": {
        "kicker": "31 ANYS · PALANQUEJAMENT IMMOBILIARI",
        "title": "El pis ja es paga sol i ha pujat de valor",
        "body": "La reforma va ser dura, però ara la quota fixa és molt inferior al mercat i et deixa 450 €/mes lliures. El banc t'ofereix refinançar per comprar dos pisos més, o bé pots diversificar cap a borsa i guanyar tranquil·litat.",
        "choices": [
            ("Diversificar: enviar els 450 €/mes i l'estalvi salarial a Fons Indexats", "n_hybrid_wealth"),
            ("Apalancar-te al màxim comprant 2 pisos més amb hipoteca variable", "n_heavy_debt"),
        ],
    },
    "n_biz": {
        "kicker": "30 ANYS · TRACCIÓ EMPRESARIAL",
        "title": "El projecte ja factura 7.500 €/mes nets!",
        "body": "Després de molts dissabtes picant pedra, la teva petita empresa funciona i creix. Un grup més gran t'ofereix 380.000 € al comptat per comprar-te-la avui mateix.",
        "choices": [
            ("Vendre per 380.000 €, indexar el capital i viure sense estrès (Coast FIRE)", "end_early_exit"),
            ("Rebutjar l'oferta, delegar operacions a una directora i escalar-la", "n_scale_biz"),
            ("Voler-ho controlar tot tu sol treballant 70 hores per setmana", "end_burnout_founder"),
        ],
    },
    "n_geo_fire": {
        "kicker": "39 ANYS · LLIBERTAT ASSOLIDA",
        "title": "El rebot borsari i el baix cost de vida fan màgia",
        "body": "Les accions comprades durant el crac s'han triplicat i viure prop de la natura t'ha permès estalviar el 55% del sou amb salut plena. Tens 490.000 € i les teves despeses són de 1.400 €/mes.",
        "choices": [
            ("Declarar el FIRE als 39 anys i dedicar-te a família, esport i projectes lliures", "end_zen_fire"),
            ("Treballar només 2 dies per setmana en consultoria selectiva i viatjar", "end_coast_master"),
        ],
    },
    "n_corp_climb": {
        "kicker": "44 ANYS · CÀRREC D'ALTA PRESSIÓ",
        "title": "620.000 € al compte, però l'esquena i el son avisen",
        "body": "La cartera ha recuperat amb escreix i cobres molt bé, però gairebé no tens temps entre setmana i notes esgotament.",
        "choices": [
            ("Baixar un esglaó ara que el patrimoni ja treballa sol i prioritzar la salut", "end_balanced_exec"),
            ("Prémer les dents 8 anys més per arribar als 2 milions costin el que costin", "end_rich_tired"),
        ],
    },
    "n_hybrid_wealth": {
        "kicker": "45 ANYS · CARTERA TOT-TERRENY",
        "title": "Immoble pagat + 340.000 € líquids en indexats",
        "body": "Tens el millor dels dos mons: sostre i rendes descorrelacionades més liquiditat global instantània.",
        "choices": [
            ("Reduir jornada a 4 dies i gaudir d'una maduresa serena i abundant", "end_hybrid_master"),
        ],
    },
    "n_heavy_debt": {
        "kicker": "36 ANYS · XOC DE TIPUS D'INTERÈS",
        "title": "L'Euríbor es dispara al 4,5% i un llogater deixa de pagar",
        "body": "Les quotes variables es mengen tot el teu sou i vas ofegat de liquiditat.",
        "choices": [
            ("Vendre un dels pisos ràpid per eixugar deute i aprendre la lliçó del risc", "end_debt_lesson"),
        ],
    },
    "n_scale_biz": {
        "kicker": "36 ANYS · EMPRESA AUTÒNOMA",
        "title": "Benefici de 12.000 €/mes treballant 20 hores setmanals",
        "body": "Haver sabut delegar a temps ha multiplicat el valor del negoci sense cremar la teva salut.",
        "choices": [
            ("Mantenir l'empresa com a màquina de dividends i invertir els excedents", "end_cashcow_king"),
        ],
    },
    # ENDINGS
    "end_panic_saver": {
        "ending": True,
        "rank": "FINAL 1/8 · El Cost Ocult de la Por",
        "body": "Vas vendre al fons del crac i la inflació va anar rosegant el teu dipòsit durant dues dècades. Arribes als 67 anys treballant per necessitat, però amb una gran lliçó apresa: en renda variable, la paciència ho és tot.",
    },
    "end_early_exit": {
        "ending": True,
        "rank": "FINAL 2/8 · Mestre del Coast FIRE als 30!",
        "body": "Aquells 380.000 € ben indexats es van doblar cada 9 anys sense que haguessis d'acceptar mai més cap feina que no et vingués de gust. Temps, calma i llibertat total.",
    },
    "end_burnout_founder": {
        "ending": True,
        "rank": "FINAL 3/8 · Presoner del Teu Propi Èxit",
        "body": "Vas guanyar molts diners, però no saber delegar et va portar a un esgotament sever als 35 anys. Recorda: una empresa que depèn 100% de les teves hores no és un actiu, és una gàbia daurada.",
    },
    "end_zen_fire": {
        "ending": True,
        "rank": "★ FINAL 4/8 · Llibertat Financera Serena (FIRE als 39a)",
        "body": "Vas combinar estalvi constant, compres valentes en plena crisi i un cost de vida conscient. Tens tot el dia per llegir, entrenar, criar i viure sense pressa!",
    },
    "end_coast_master": {
        "ending": True,
        "rank": "★ FINAL 5/8 · L'Artesà Lliure ( Patrmoni > 1,1M € )",
        "body": "Treballar només unes hores per plaer intel·lectual mentre la cartera creix sola t'ha donat la vida més llarga, sana i estimulant possible.",
    },
    "end_balanced_exec": {
        "ending": True,
        "rank": "FINAL 6/8 · Rectificació Sàvia a Temps",
        "body": "Frenar als 44 anys et va retornar el son, l'energia i els vincles personals mentre el capital acumulat feia la resta del camí.",
    },
    "end_rich_tired": {
        "ending": True,
        "rank": "FINAL 7/8 · Multimilionari sense Temps (2,1M €)",
        "body": "Has batut tots els rècords financers del teu entorn, però t'has perdut massa tardes pel camí. Els diners són un excel·lent servent, però un mal amo.",
    },
    "end_hybrid_master": {
        "ending": True,
        "rank": "★ FINAL 8A · Arquitecte Patrimonial Complet",
        "body": "Combinant un immoble ben comprat a tipus fix amb l'agilitat dels fons indexats has construït una fortalesa immune tant a la inflació com a les recessions.",
    },
    "end_debt_lesson": {
        "ending": True,
        "rank": "FINAL 8B · Supervivent del Palanquejament",
        "body": "Vendre a temps et va salvar de la fallida i vas reconstruir una cartera prudent i sòlida. El deute variable excessiu és l'únic capaç de trencar l'interès compost.",
    },
    "end_cashcow_king": {
        "ending": True,
        "rank": "★ FINAL ESPECIAL · Fundador amb Sistemes i Vida",
        "body": "Delegar i construir processos et va permetre facturar sis xifres anuals tenint totes les tardes lliures per als teus.",
    },
}


# ==================== CHAPTER 2: TACTICAL MARKET & BUSINESS CASES ====================
MARKET_CASES = [
    {
        "kicker": "DECENNIS · CAS 1 · PER 35x / EUFÒRIA",
        "title": "El veí ha doblat estalvis en 4 mesos amb accions de moda",
        "prompt": "Els múltiples cotitzen al doble de la mitjana històrica i els informatius obren parlant d'un nou paradigma infinit. Tens 100.000 € invertits.",
        "opts": [
            ("A", "Moure-ho tot a les 3 accions de moda per no perdre el tren", False, "Compres exactament al cim d'eufòria (FOMO). En els tres anys següents el sector cau un -58%."),
            ("B", "Reequilibrar venent la part inflada cap a valoracions raonables i bons", True, "Exacte! Reequilibrar força a vendre car i comprar barat de manera automàtica i sense emocions."),
            ("C", "Demanar un préstec personal per invertir el doble", False, "Apalancar-se a múltiples de PER 35x és la recepta clàssica per a la ruïna patrimonial."),
        ],
    },
    {
        "kicker": "DECENNIS · CAS 2 · PER 10,5x / PÀNIC",
        "title": "Caiguda del -38% i portades apocalíptiques",
        "prompt": "Les millors empreses del món cotitzen a preus de derribo després d'una recessió. El teu entorn ven per refugiar-se en comptes corrents al 0,5%.",
        "opts": [
            ("A", "Vendre ara i esperar que les notícies tornin a ser positives", False, "Quan les notícies tornen a ser bones, el mercat ja ha pujat un +45% des dels mínims."),
            ("B", "Mantenir el pla i usar l'excés de liquiditat per comprar participacions barates", True, "Brillant! Les grans fortunes a llarg termini es forgen comprant amb calma durant les rebaixes."),
            ("C", "Mirar la cotització cada 15 minuts amb angoixa", False, "Mirar el preu cada hora dispara l'amígdala i multiplica el risc de prendre una mala decisió."),
        ],
    },
    {
        "kicker": "DECENNIS · CAS 3 · INFLACIÓ 8,2%",
        "title": "Xoc inflacionari i pujada vertical de tipus",
        "prompt": "Els preus es disparen un 8% anual i els bancs centrals apugen tipus del 0% al 4,5% en un any.",
        "opts": [
            ("A", "Deixar tots els estalvis immòbils al compte corrent durant 5 anys", False, "Encara que la xifra nominal no canviï, perds més d'un 30% de poder adquisitiu real!"),
            ("B", "Combinar actius reals i empreses amb poder de fixació de preus (marges alts)", True, "Encertat! Les empreses amb fort poder de marca traslladen la inflació als preus i protegeixen el capital real."),
            ("C", "Comprar bons a 30 anys sense cupó just abans que pugin els tipus", False, "Els bons llargs sense cupó pateixen caigudes de preu severes quan els tipus d'interès pugen."),
        ],
    },
    {
        "kicker": "FUNDADOR · CAS 4 · CAIXA VS FACTURACIÓ",
        "title": "Creixement ràpid però la caixa baixa cada mes",
        "prompt": "La teva startup factura 12.000 €/mes però en gasta 16.500 €/mes i només queden 18.000 € al banc (4 mesos de vida).",
        "opts": [
            ("A", "Ignorar la caixa i contractar dues persones més per si sona la flauta", False, "Redueixes el Runway a 6 setmanes i entres en concurs de creditors abans de tancar cap venda nova."),
            ("B", "Oferir descompte per pagament anual avançat als clients i podar costos no essencials", True, "Maniobra mestra de fundador! Finançar-te amb els clients (cobrant l'any per avançat) et fa rendible sense diluir el teu equity."),
            ("C", "Baixar preus a la meitat per fer més volum", False, "Amb marges negatius, vendre el doble només t'enfonsa el doble de ràpid!"),
        ],
    },
    {
        "kicker": "FUNDADOR · CAS 5 · DEPENDÈNCIA D'UN SOL CLIENT",
        "title": "Un únic client representa el 70% dels teus ingressos",
        "prompt": "Et demana rebaixar tarifes i fer funcions exclusives només per a ells amenaçant de marxar.",
        "opts": [
            ("A", "Acceptar-ho tot i deixar d'atendre la resta del mercat", False, "Ja no tens una empresa pròpia: tens un sol cap disfressat de client amb tot el poder sobre tu."),
            ("B", "Pactar una transició raonable mentre diversifiques vendes perquè cap client superi el 15%", True, "Excel·lent! Diversificar la cartera de clients multiplica el múltiple de valoració de la teva empresa si mai la vols vendre."),
            ("C", "Tancar el telèfon d'un cop de porta avui mateix sense pla B", False, "Perdre el 70% d'ingressos en 24 hores sense coixí posa en perill la nòmina del mes vinent."),
        ],
    },
    {
        "kicker": "FISCALITAT & COMPOST · CAS 6",
        "title": "Rotar accions cada any pagant el 19–23% o diferir impostos?",
        "prompt": "Tens dos vehicles amb un 8% anual brut durant 25 anys: un passa per caixa fiscal cada desembre i l'altre difereix impostos fins al final.",
        "opts": [
            ("A", "Tant se val, al final pagaré el mateix", False, "Error matemàtic! Pagar impostos cada any frena la base sobre la qual s'aplica l'interès compost."),
            ("B", "Diferir impostos amb fons d'acumulació traspasables genera desenes de milers d'euros extra nets", True, "Exacte! Els impostos no pagats avui es queden generant rendiment per a tu durant 25 anys."),
            ("C", "No invertir per no haver de pagar mai plusvàlues", False, "Pagar plusvàlues vol dir que has guanyat diners; renunciar a guanyar 100 per no pagar 19 mai és bon negoci."),
        ],
    },
]


# ==================== CHAPTER 3: PARENTING SCENES & CALM SVGS ====================
PARENTING_CASES = [
    {
        "kicker": "CRIANÇA · 2-3 ANYS · REBEQUERIA",
        "title": "Es tira a terra plorant perquè la galeta s'ha trencat en dos",
        "body": "Li dones la galeta que t'ha demanat, es parteix per la meitat i comença un plor inconsolable dient que la vol sencera.",
        "opts": [
            ("A", "«Però si va a la panxa igualment! No ploris per ximpleries!»", "Se sent incomprès i el plor escala encara més alt.", "Quan l'amígdala està encesa, la lògica adulta no entra. El plor per la galeta sol ser la vàlvula per buidar el cansament del dia."),
            ("B", "Ajupir-te amb calma: «Ostres, volies la galeta sencera i s'ha trencat. Quin greu, vine aquí.»", "Plora un minutet als teus braços, respira fons i es menja els dos trossets tranquil.", "Validar el que sent no és donar-li una altra capsa de galetes; és fer-li sentir que totes les seves emocions tenen permís d'existir al teu costat."),
            ("C", "Cridar que si plora es queda sense berenar", "Calla per por però acumula tensió i ràbia.", "Reprimir el plor amb amenaces desconnecta l'infant dels seus senyals interns."),
        ],
    },
    {
        "kicker": "CRIANÇA · 4 ANYS · PRESSA MATINAL",
        "title": "No es vol posar la jaqueta per anar a l'escola",
        "body": "Falten 5 minuts per sortir i corre pel passadís rient o dient «NO!» amb la jaqueta a terra.",
        "opts": [
            ("A", "Convertir-ho en elecció o joc: «Te la poses pel mètode papallona (caputxa a terra) o t'ajudo jo amb cronòmetre?»", "S'encén la seva espurna de joc, posa els braços dins les mànigues i sortiu rient!", "Als 4 anys necessiten sentir poder de decisió. Oferir dues opcions dins del teu límit evita el xoc frontal."),
            ("B", "Perseguir-lo enfadada amb un sermó sobre la puntualitat", "Comença una lluita física i sortiu plorant tots dos.", "Un infant de 4 anys encara no té noció abstracta del rellotge adult."),
            ("C", "Sortir al fred d'hivern sense portar la jaqueta ni a la bossa", "Passa fred i tu pateixes tot el camí.", "Podem portar la jaqueta a la mà sense baralla: quan noti la fresca al portal, la natura farà de mestra sense crits!"),
        ],
    },
    {
        "kicker": "CRIANÇA · 5-6 ANYS · REPARACIÓ DEL VINCLE",
        "title": "Has tingut un mal dia i has contestat amb un crit",
        "body": "Estaves esgotada, t'ha interromput per quarta vegada i li has cridat bruscament. Es queda en silenci amb els ulls vidriosos.",
        "opts": [
            ("A", "Fer veure que no ha passat res perquè no perdi el «respecte»", "Aprèn a guardar-se el dolor en silenci i a no demanar mai perdó quan ell s'equivoqui.", "L'autoritat real neix de la coherència i l'honestedat, mai de fingir infal·libilitat."),
            ("B", "Acostar-t'hi quan t'hagis calmat: «Perdona'm per haver cridat. Estava cansada i m'he equivocat en la forma. T'estimo molt.»", "Respira alleujat, t'abraça i la confiança entre vosaltres es fa encara més forta.", "Segons Ed Tronick, els pares segurs no són els que mai fallen, sinó els que reparen les desconnexions amb humilitat i amor."),
            ("C", "Dir-li: «Mira com m'has fet posar per culpa teva!»", "Interioritza que ell té la culpa de les emocions dels adults.", "Cadascú és responsable de com expressa el seu cansament."),
        ],
    },
    {
        "kicker": "CRIANÇA · 7-9 ANYS · FRUSTRACIÓ",
        "title": "«Tot em surt malament, no ho tornaré a provar mai més!»",
        "body": "Està aprenent una habilitat nova (bicicleta, dibuix o matemàtiques) i s'encalla amb ràbia.",
        "opts": [
            ("A", "Fer-l'hi tu ràpidament perquè no pateixi", "S'estalvia el malestar avui però sent que no és capaç per si sol.", "La sobreprotecció benintencionada debilita l'autoeficàcia («jo puc aprendre»)."),
            ("B", "Acompanyar sense resoldre-ho per ell: «És difícil i fa ràbia quan encara no surt. Fem una pausa i mirem quin trosset ja tens dominat?»", "Baixa la frustració, veu el que sí que ha avançat i decideix fer un intent més.", "Afegir la paraula «ENCARA» transforma el fracàs en aprenentatge en curs."),
            ("C", "Comparar-lo: «Doncs a la teva cosina li sortia a la primera!»", "Sente vergonya i agafa mania tant a l'activitat com a les comparacions.", "Comparar mai motiva per dins; només fereix la pertinença."),
        ],
    },
]


def build_epub() -> Path:
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    pages: List[Tuple[str, str, str, bool]] = []  # (filename, title, xhtml, has_svg)

    # 1. Cover / Home Index
    cover_body = """
    <h1>Vides, Capital i Calma</h1>
    <p style="text-align:center;"><i>Quadern Interactiu per a Mode Avió · Kindle E-Ink</i></p>
    <div class="box">
      <div class="kicker">TRIA LA TEVA EXPERIÈNCIA SENSE PANTALLES BRILLANTS</div>
      <p>Toca qualsevol capítol per començar. Funciona 100% amb el Wi-Fi apagat des de la teva biblioteca.</p>
      <a class="choice" href="cyoa_start.xhtml">1 · Vides &amp; Capital (Llibre-Joc amb 10 Finals)</a>
      <a class="choice" href="mkt_0.xhtml">2 · El Joc dels Decennis &amp; Fundador (Casos Tàctics)</a>
      <a class="choice" href="par_0.xhtml">3 · Créixer amb Calma (Situacions Reals de Criança)</a>
      <a class="choice" href="calm_svg.xhtml">4 · Pauses de Respiració i Ioga Suau (Il·lustrat)</a>
    </div>
    """
    pages.append(("index.xhtml", BOOK_TITLE, xhtml_doc(BOOK_TITLE, cover_body), False))

    # 2. Chapter 1: CYOA Nodes
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
              <a class="btn-dark" href="cyoa_start.xhtml">↻ Viure una altra vida des dels 25 anys</a>
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

    # 3. Chapter 2: Market & Founder Tactical Cases (Zero-spoiler separate answer screens)
    for idx, mc in enumerate(MARKET_CASES):
        q_file = f"mkt_{idx}.xhtml"
        next_file = f"mkt_{idx + 1}.xhtml" if idx + 1 < len(MARKET_CASES) else "index.xhtml"
        next_lbl = "Següent cas →" if idx + 1 < len(MARKET_CASES) else "Tornar a l'Índex"

        opts_links = []
        for oi, (key, txt, is_ok, expl) in enumerate(mc["opts"]):
            ans_file = f"mkt_{idx}_opt{oi}.xhtml"
            opts_links.append(f'<a class="choice" href="{ans_file}">[{key}] {html.escape(txt)}</a>')

            verdict = "★ DECISIÓ SÒLIDA D'ALT VALOR" if is_ok else "⚠ TRAMPA CONDUCTUAL O DE CAIXA"
            ans_body = f"""
            <div class="kicker">{html.escape(mc['kicker'])} · ANÀLISI</div>
            <h2>{verdict}</h2>
            <div class="box">
              <p><b>La teva tria [{key}]:</b> {html.escape(txt)}</p>
              <p>{html.escape(expl)}</p>
            </div>
            <p>
              <a class="btn" href="{q_file}">↺ Tornar al cas</a>
              <a class="btn-dark" href="{next_file}">{next_lbl}</a>
            </p>
            """
            pages.append((ans_file, f"Anàlisi Cas {idx+1}", xhtml_doc(f"Anàlisi Cas {idx+1}", ans_body), False))

        q_body = f"""
        <div class="kicker">{html.escape(mc['kicker'])} ({idx+1}/{len(MARKET_CASES)})</div>
        <h2>{html.escape(mc['title'])}</h2>
        <p>{html.escape(mc['prompt'])}</p>
        {''.join(opts_links)}
        <p><a class="btn" href="index.xhtml">← Índex</a></p>
        """
        pages.append((q_file, mc["title"], xhtml_doc(mc["title"], q_body), False))

    # 4. Chapter 3: Créixer amb Calma interactive scenes
    for idx, pc in enumerate(PARENTING_CASES):
        q_file = f"par_{idx}.xhtml"
        next_file = f"par_{idx + 1}.xhtml" if idx + 1 < len(PARENTING_CASES) else "calm_svg.xhtml"
        next_lbl = "Següent escena →" if idx + 1 < len(PARENTING_CASES) else "Anar a Pauses de Calma →"

        opts_links = []
        for oi, (key, txt, react, neuro) in enumerate(pc["opts"]):
            ans_file = f"par_{idx}_opt{oi}.xhtml"
            opts_links.append(f'<a class="choice" href="{ans_file}">[{key}] {html.escape(txt)}</a>')

            ans_body = f"""
            <div class="kicker">{html.escape(pc['kicker'])} · QUÈ PASSA SOTA L'ICEBERG</div>
            <h2>Lectura Emocional i Neurociència</h2>
            <div class="box">
              <p><b>Reacció a l'escena:</b> {html.escape(react)}</p>
              <div class="quote">{html.escape(neuro)}</div>
            </div>
            <p>
              <a class="btn" href="{q_file}">↺ Provar una altra resposta</a>
              <a class="btn-dark" href="{next_file}">{next_lbl}</a>
            </p>
            """
            pages.append((ans_file, f"Escena {idx+1} · Resposta {key}", xhtml_doc(f"Escena {idx+1}", ans_body), False))

        q_body = f"""
        <div class="kicker">{html.escape(pc['kicker'])} ({idx+1}/{len(PARENTING_CASES)})</div>
        <h2>{html.escape(pc['title'])}</h2>
        <p>{html.escape(pc['body'])}</p>
        {''.join(opts_links)}
        <p><a class="btn" href="index.xhtml">← Índex</a> <a class="btn" href="calm_svg.xhtml">◯ Pausa Calma</a></p>
        """
        pages.append((q_file, pc["title"], xhtml_doc(pc["title"], q_body), False))

    # 5. Chapter 4: Illustrated SVG Restorative Yoga & Breath Guide
    calm_body = """
    <div class="kicker">IOGA RESTAURATIU &amp; REGULACIÓ EN 1 MINUT</div>
    <h2>Pausa de Calma sense Pantalles</h2>
    <div class="box">
      <h3>1. Sospir Fisiològic Doble (30 segons)</h3>
      <div class="svg-box">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 70" width="220" height="64">
          <path d="M12,54 Q48,18 78,26 Q98,8 120,10 Q168,16 226,56" fill="none" stroke="#000000" stroke-width="2.6"/>
          <circle cx="78" cy="26" r="3.5" fill="#000000"/>
          <circle cx="120" cy="10" r="4" fill="#000000"/>
          <text x="32" y="66" font-family="monospace" font-size="9" fill="#000000">Inhala</text>
          <text x="90" y="66" font-family="monospace" font-size="9" fill="#000000">+Inhala</text>
          <text x="158" y="66" font-family="monospace" font-size="9" fill="#000000">Exhala llarg</text>
        </svg>
      </div>
      <p>Inspira pel nas, afegeix una segona petita inhalació curta per obrir els alvèols i deixa anar l'aire molt a poc a poc per la boca 3 vegades.</p>
    </div>
    <div class="box">
      <h3>2. Balasana Suau / Alliberar Esquena i Mandíbula</h3>
      <p>Seu sobre els talons (o recolza el front sobre els avantbraços), afluixa les espatlles lluny de les orelles i fes 5 respiracions sentint com s'eixampla la zona lumbar.</p>
    </div>
    <p style="text-align:center;">
      <a class="btn-dark" href="par_0.xhtml">← Tornar a Créixer amb Calma</a>
      <a class="btn" href="index.xhtml">Índex principal</a>
    </p>
    """
    pages.append(("calm_svg.xhtml", "Pausa de Calma i Ioga Suau", xhtml_doc("Pausa de Calma", calm_body), True))

    # Navigation TOC
    nav_xhtml = xhtml_doc(
        "Taula de Continguts",
        """
        <h1>Índex del Quadern</h1>
        <nav epub:type="toc" id="toc">
          <ol>
            <li><a href="index.xhtml">Portada Interactiva</a></li>
            <li><a href="cyoa_start.xhtml">1. Vides &amp; Capital (Llibre-Joc)</a></li>
            <li><a href="mkt_0.xhtml">2. El Joc dels Decennis &amp; Fundador</a></li>
            <li><a href="par_0.xhtml">3. Créixer amb Calma</a></li>
            <li><a href="calm_svg.xhtml">4. Pauses de Respiració i Ioga Suau</a></li>
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
