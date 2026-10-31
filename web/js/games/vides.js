// Joc 1: Vides & Capital (Simulador Procedimental de Vida, Inversions i FIRE)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "vides_state_v1";
  var STATS_KEY = "vides_best_v1";

  var ORIGINS = [
    {
      id: "eng",
      name: "Enginyeria & Ambició",
      sub: "Sou 1.900€/m · Despesa 1.200€/m · Estalvi 3.500€",
      desc: "Bon potencial salarial però risc alt d'estrès corporatiu.",
      salary: 1900,
      expenses: 1200,
      netWorth: 3500,
      health: 80,
      joy: 72,
      alloc: { cash: 25, index: 50, realestate: 25, venture: 0 }
    },
    {
      id: "crea",
      name: "Ment Creativa & Digital",
      sub: "Sou 1.450€/m · Despesa 1.050€/m · Estalvi 1.500€",
      desc: "Ingressos inicials modestos però facilitat per crear projectes propis.",
      salary: 1450,
      expenses: 1050,
      netWorth: 1500,
      health: 86,
      joy: 84,
      alloc: { cash: 50, index: 25, realestate: 0, venture: 25 }
    },
    {
      id: "ofici",
      name: "Ofici Pràctic al Poble",
      sub: "Sou 1.750€/m · Despesa 920€/m · Estalvi 9.000€",
      desc: "Cost de vida baix des del primer dia: benzina pura per a l'interès compost.",
      salary: 1750,
      expenses: 920,
      netWorth: 9000,
      health: 88,
      joy: 78,
      alloc: { cash: 25, index: 50, realestate: 25, venture: 0 }
    },
    {
      id: "trampa",
      name: "Mode Repte: Aparador Car",
      sub: "Sou 2.050€/m · Despesa 1.850€/m · Deute -7.000€",
      desc: "Cotxe finançat al 8% i lloguer car. Podràs escapar de la cursa de la rata?",
      salary: 2050,
      expenses: 1850,
      netWorth: -7000,
      health: 76,
      joy: 68,
      alloc: { cash: 50, index: 25, realestate: 0, venture: 25 }
    }
  ];

  var REGIMES = [
    { id: "calm", label: "Expansió Suau · Inflació 2%", rCash: 0.025, rIdx: 0.095, rRe: 0.07, rVen: 0.14, inf: 0.02 },
    { id: "bull", label: "Eufòria Tecnològica · Mercat Alcista", rCash: 0.02, rIdx: 0.17, rRe: 0.08, rVen: 0.42, inf: 0.025 },
    { id: "infl", label: "Inflació Alta 6,5% · Tipus al 4,5%", rCash: 0.04, rIdx: 0.02, rRe: 0.09, rVen: -0.18, inf: 0.055 },
    { id: "crash", label: "Crac Borsari i Recessió (-28%)", rCash: 0.03, rIdx: -0.24, rRe: -0.06, rVen: -0.48, inf: 0.015 },
    { id: "recov", label: "Rebot Post-Crisi · Oportunitats", rCash: 0.02, rIdx: 0.21, rRe: 0.11, rVen: 0.32, inf: 0.022 }
  ];

  // Rich procedural pool of life & investment dilemmas
  var EVENTS = [
    {
      id: "first_raise", minAge: 22, maxAge: 34, tag: "CARRERA",
      title: "Oferta d'una consultora exigent",
      body: "Et proposen pujar el sou un +32%, però saps que s'hi fan jornades llargues i viatges constants.",
      opts: [
        { k: "A", t: "Acceptar i estalviar el 100% de l'augment", s: "Sou +32% · Salut -8 · Felicitat -5", fn: function (st) { st.salary = Math.round(st.salary * 1.32); st.health -= 8; st.joy -= 5; return "Cobres molt més i no apuges despeses: la teva taxa d'estalvi es dispara."; } },
        { k: "B", t: "Negociar teletreball amb +14% de pujada", s: "Sou +14% · Equilibri mantingut", fn: function (st) { st.salary = Math.round(st.salary * 1.14); st.joy += 4; return "Pactes un augment raonable conservant les tardes lliures."; } },
        { k: "C", t: "Quedar-te on ets i estudiar inversió i habilitats", s: "Felicitat +5 · Bonus futur", fn: function (st) { st.joy += 5; st.flags.upskilled = true; st.salary = Math.round(st.salary * 1.06); return "Inverteixes el teu temps lliure a formar-te amb calma."; } }
      ]
    },
    {
      id: "car_trap", minAge: 22, maxAge: 42, tag: "ESTIL DE VIDA",
      title: "El teu cotxe vell comença a fer sorolls estranys",
      body: "El concessionari et tempta amb un SUV híbrid nou per «només 360 €/mes». Alhora, un mecànic de confiança ven un utilitari fiabilíssim per 4.200 €.",
      opts: [
        { k: "A", t: "Comprar l'utilitari de segona mà al comptat", s: "-4.200 € · Sense quota mensual", fn: function (st) { st.netWorth -= 4200; st.joy += 2; return "Zero lletres mensuals. Els teus amics riuen avui; el teu jo de 45 anys t'ho agrairà."; } },
        { k: "B", t: "Finançar el SUV nou d'estrena", s: "-3.000 € entrada · Despesa +290 €/m", fn: function (st) { st.netWorth -= 3000; st.expenses += 290; st.joy += 6; return "Olora a cotxe nou, però acabes de comprometre anys d'estalvi futur."; } },
        { k: "C", t: "Vendre el cotxe i moure't en tren i bici", s: "+1.200 € · Despesa -110 €/m · Salut +7", fn: function (st) { st.netWorth += 1200; st.expenses = Math.max(650, st.expenses - 110); st.health += 7; return "Guanyes cames, salut i alliberes més de 1.300 € l'any per indexar."; } }
      ]
    },
    {
      id: "cousin_padel", minAge: 24, maxAge: 58, tag: "INVERSIÓ TRAMPA?",
      title: "El cunyat i el club de pàdel «infal·lible»",
      body: "En un dinar familiar et jura que muntar pistes de pàdel amb bar gourmet donarà un 25% anual garantit. Et demana 12.000 € com a soci.",
      opts: [
        { k: "A", t: "Declinar amb somriure diplomàtic i seguir indexat", s: "Zero drama · Capital protegit", fn: function (st) { st.joy += 2; return " Quan algú diu «25% garantit», el risc és que no veu el risc. Bona esquivada!"; } },
        { k: "B", t: "Posar-hi 12.000 € per no quedar-ne fora", s: "Aposta binària (sort o desastre)", fn: function (st, rng) { if (rng() < 0.28) { st.netWorth += 19000; st.joy += 6; return "Contra tot pronòstic, el bar s'omple cada cap de setmana i et reparteixen dividends (+19k €)!"; } st.netWorth -= 12000; st.joy -= 8; return "Sobrecostos d'obra i baralles entre socis: perds els 12.000 € i els sopars de Nadal es refreden."; } },
        { k: "C", t: "Oferir-li només 2.000 € com a préstec documentat", s: "Risc molt acotat", fn: function (st) { st.netWorth -= 500; return "Recuperes gairebé tot el préstec tard i malament (-500 €), però aprens una lliçó barata."; } }
      ]
    },
    {
      id: "flat_opportunity", minAge: 26, maxAge: 48, needWorth: 18000, noFlag: "hasFlat", tag: "IMMOBILIARI",
      title: "Pis fosc amb llogater antic o reforma integral",
      body: "Surt un pis ben situat un 22% sota preu de mercat perquè necessita cuina i bany nous. El banc t'ofereix hipoteca fixa suau si poses 22.000 €.",
      opts: [
        { k: "A", t: "Comprar, reformar i posar-lo en lloguer de llarga durada", s: "-22k € líquids · +38k € valor net + renda +320€/m", fn: function (st) { st.netWorth += 16000; st.passiveIncome += 320; st.flags.hasFlat = true; st.health -= 4; return "Tres mesos de pols i paletes, però ara tens un actiu palanquejat que et paga 320 €/mes nets."; } },
        { k: "B", t: "Comprar-lo per viure-hi i deixar de pagar lloguer", s: "Despesa mensual -340 €/m · Felicitat +8", fn: function (st) { st.netWorth += 8000; st.expenses = Math.max(600, st.expenses - 340); st.joy += 8; st.flags.hasFlat = true; return "Estabilitzes per sempre el teu cost d'habitatge amb quota fixa."; } },
        { k: "C", t: "Passar d'obres i mantenir el capital 100% líquid/borsa", s: "Zero maldecaps · Salut +3", fn: function (st) { st.health += 3; return "Evites la concentració immobiliària i deixes que els mercats treballin sense trucades d'avaries."; } }
      ]
    },
    {
      id: "market_panic", minAge: 24, maxAge: 70, tag: "PSICOLOGIA DE MERCAT",
      title: "Titulars vermells: «La pitjor setmana borsària en 15 anys»",
      body: "Les tertúlies parlen de fi d'un model econòmic. Les teves posicions en renda variable cauen fort en poques setmanes.",
      opts: [
        { k: "A", t: "No mirar el compte i mantenir l'aportació automàtica", s: "Sang freda · Rebot futur +14% extra", fn: function (st) { if (st.netWorth > 5000) st.netWorth = Math.round(st.netWorth * 1.11); st.joy += 3; return "Compres participacions barates mentre tothom ven espantat. La paciència paga."; } },
        { k: "B", t: "Utilitzar la teva liquiditat per comprar agressivament al fons", s: "Si tens caixa, fort impuls patrimonial", fn: function (st) { var bonus = Math.max(1500, Math.round(Math.max(0, st.netWorth) * (st.alloc.cash / 100) * 0.35)); st.netWorth += bonus; st.health -= 2; return "Actues amb mentalitat contrària i captures +" + window.CalmUI.fmtEur(bonus) + " en la recuperació!"; } },
        { k: "C", t: "Vendre-ho tot a liquiditat fins que «s'aclareixi el panorama»", s: "Cristal·litzes pèrdues (-14%) · Dorms tranquil avui", fn: function (st) { if (st.netWorth > 0) st.netWorth = Math.round(st.netWorth * 0.86); st.alloc = { cash: 100, index: 0, realestate: 0, venture: 0 }; return "Vens al pitjor moment i et perds el rebot posterior. L'error clàssic més car d'invertir."; } }
      ]
    },
    {
      id: "partner_align", minAge: 25, maxAge: 44, noFlag: "hasPartner", tag: "VIDA & PARELLA",
      title: "Una relació que va de debò i converses de diners",
      body: "Porteu un any genial i us plantegeu compartir pis i projecte vital. Teniu hàbits financers força diferents.",
      opts: [
        { k: "A", t: "Anar a viure junts amb compte comú clar i objectius compartits", s: "Despesa -220 €/m · Felicitat +14", fn: function (st) { st.flags.hasPartner = true; st.expenses = Math.max(650, st.expenses - 220); st.joy += 14; return "Compartir sostre i parlar obertament de diners multiplica tant la felicitat com l'estalvi."; } },
        { k: "B", t: "Mudar-vos a un àtic espectacular per celebrar-ho", s: "Despesa +280 €/m · Felicitat +12", fn: function (st) { st.flags.hasPartner = true; st.expenses += 280; st.joy += 12; return "La terrassa és un somni, tot i que el nou lloguer es menja bona part del marge mensual."; } },
        { k: "C", t: "Mantenir pisos separats de moment per preservar independència", s: "Felicitat +4 · Despesa intacta", fn: function (st) { st.joy += 4; return "Cadascú al seu espai: menys sinergia econòmica però màxima autonomia."; } }
      ]
    },
    {
      id: "side_project", minAge: 24, maxAge: 56, noFlag: "hasSideBiz", tag: "EMPRENEDORIA",
      title: "Una eina que vas fer als vespres crida l'atenció",
      body: "Tres petits negocis et pregunten si els pots oferir com a servei mensual allò que vas muntar per a tu.",
      opts: [
        { k: "A", t: "Dedicar-hi els dissabtes durant un any per automatitzar-ho", s: "Renda extra +420 €/m · Salut -6", fn: function (st) { st.passiveIncome += 420; st.health -= 6; st.flags.hasSideBiz = true; return "Cansat però eufòric: acabes de crear un actiu digital que factura 420 €/m cada mes!"; } },
        { k: "B", t: "Deixar la feina i llançar-t'hi al 100% amb els teus estalvis", s: "Alt risc: gran salt o sotrac", fn: function (st, rng) { st.flags.hasSideBiz = true; if (rng() < 0.55 || st.flags.upskilled) { st.salary = Math.round(st.salary * 1.55); st.joy += 12; return "La jugada surt rodona! Factures molt més que abans i ets amo del teu calendari."; } st.netWorth -= 9000; st.salary = Math.round(st.salary * 0.85); st.health -= 7; return "Costa més captar clients del que semblava: cremes 9.000 € abans de tornar a buscar feina."; } },
        { k: "C", t: "Vendre'ls el codi tancat per 4.500 € i oblidar-te'n", s: "+4.500 € nets avui · Zero manteniment", fn: function (st) { st.netWorth += 4500; st.joy += 4; return "Diners ràpids al sarró i caps de setmana lliures."; } }
      ]
    },
    {
      id: "kids_arrival", minAge: 28, maxAge: 44, reqFlag: "hasPartner", noFlag: "hasKids", tag: "FAMÍLIA & CRIANÇA",
      title: "Ampliar la família i redefinir el temps",
      body: "Arriba una criatura a casa! Tot canvia de prioritat: el temps val or i apareixen noves despeses fixes.",
      opts: [
        { k: "A", t: "Reduir una mica jornada un dels dos per viure la criança amb calma", s: "Sou -12% · Despesa +260€/m · Felicitat +18 · Salut +5", fn: function (st) { st.flags.hasKids = true; st.salary = Math.round(st.salary * 0.88); st.expenses += 260; st.joy += 18; st.health += 5; return "Guanyes menys durant uns anys, però els records d'aquesta etapa no es compren amb cap dividend."; } },
        { k: "B", t: "Mantenir tots dos la carrera a fons amb cangur i escola bressol", s: "Despesa +580€/m · Felicitat +9 · Salut -7", fn: function (st) { st.flags.hasKids = true; st.expenses += 580; st.joy += 9; st.health -= 7; return "Els ingressos aguanten forts, tot i que aneu amb la llengua fora cada vespre."; } },
        { k: "C", t: "Obrir també un petit fons indexat infantil de 75 €/m als 0 anys", s: "Despesa +410€/m · Felicitat +14 · Llegat futur", fn: function (st) { st.flags.hasKids = true; st.flags.kidFund = true; st.expenses += 410; st.joy += 14; return "Comences la criança i alhora plantes una llavor d'interès compost a 20 anys vista."; } }
      ]
    },
    {
      id: "burnout_warn", minAge: 30, maxAge: 58, tag: "SALUT & CALMA",
      title: "Insomni dels diumenges i esquena contracturada",
      body: "El cos t'envia senyals clars: dorms malament pensant en pendent i fa mesos que no fas esport ni llegeixes tranquil.",
      opts: [
        { k: "A", t: "Agafar 3 mesos d'excedència, caminar per la muntanya i fer ioga", s: "-3.800 € · Salut +20 · Felicitat +16", fn: function (st) { st.netWorth -= 3800; st.health += 20; st.joy += 16; return "Per això serveix tenir coixí financer! Tornes amb la ment nítida i deu anys més jove."; } },
        { k: "B", t: "Posar límits estrictes a les 18h i apuntar-te a entrenar 3 cops/setmana", s: "Despesa +55€/m · Salut +13 · Felicitat +8", fn: function (st) { st.expenses += 55; st.health += 13; st.joy += 8; return "Deixes de ser l'empleat que respon correus a les onze de la nit i recuperes l'energia."; } },
        { k: "C", t: "Aguantar amb cafè: «ja descansaré d'aquí uns anys»", s: "Bonus +3.000 € · Salut -16 · Felicitat -12", fn: function (st) { st.netWorth += 3000; st.health -= 16; st.joy -= 12; return "Cobres el bonus anual, però la salut passa una factura silenciosa i perillosa."; } }
      ]
    },
    {
      id: "remote_geo", minAge: 28, maxAge: 56, noFlag: "movedTown", tag: "GEO-ARBITRATGE",
      title: "Viure a 45 minuts de la capital prop de natura",
      body: "Descobreixes un poble ben connectat amb fibra òptica, aire net i habitatge un 35% més assequible.",
      opts: [
        { k: "A", t: "Fes les maletes: mateix sou digital amb cost de vida molt menor", s: "Despesa -310 €/m · Salut +10 · Felicitat +8", fn: function (st) { st.flags.movedTown = true; st.expenses = Math.max(620, st.expenses - 310); st.health += 10; st.joy += 8; return "Geo-arbitratge de manual: estalvies gairebé 4.000 € més l'any i despertes sentint ocells."; } },
        { k: "B", t: "Quedar-te al centre urbà per la vida cultural i contactes", s: "Sou +8% per xarxa · Despesa +90 €/m", fn: function (st) { st.salary = Math.round(st.salary * 1.08); st.expenses += 90; st.joy += 3; return "L'energia de la ciutat et porta nous contactes professionals, tot i el preu del cafè."; } },
        { k: "C", t: "Llogar-hi només una caseta senzilla d'estiu un mes l'any", s: "-1.600 € · Felicitat +7", fn: function (st) { st.netWorth -= 1600; st.joy += 7; st.health += 4; return "Tastes la calma sense canviar tota la logística familiar."; } }
      ]
    },
    {
      id: "first_100k", minAge: 26, maxAge: 62, needWorth: 100000, noFlag: "hit100k", tag: "FITA PATRIMONIAL",
      title: "Has superat la barrera mítica dels 100.000 €!",
      body: "Charlie Munger deia que els primers 100k són els més durs; a partir d'aquí la bola de neu comença a empènyer sola.",
      opts: [
        { k: "A", t: "Celebrar-ho amb un sopar especial (200 €) i mantenir el rumb intacte", s: "-200 € · Felicitat +9 · Disciplina total", fn: function (st) { st.flags.hit100k = true; st.netWorth -= 200; st.joy += 9; return "Assaboreixes la fita sense inflar el teu estil de vida. Ara el capital ja guanya un sou extra per tu."; } },
        { k: "B", t: "Diversificar una part a deute/immobles per reduir sotracs", s: "Reequilibri prudent · Salut +4", fn: function (st) { st.flags.hit100k = true; st.alloc = { cash: 25, index: 50, realestate: 25, venture: 0 }; st.health += 4; return "Consolides una cartera tot-terreny ben equilibrada."; } },
        { k: "C", t: "Regalar-te un viatge llarg de somni per valor de 6.500 €", s: "-6.500 € · Felicitat +16 · Salut +6", fn: function (st) { st.flags.hit100k = true; st.netWorth -= 6500; st.joy += 16; st.health += 6; return "Els diners també són per transformar-los en memòria vital de qualitat!"; } }
      ]
    },
    {
      id: "inheritance_surprise", minAge: 36, maxAge: 64, noFlag: "gotInher", tag: "IMPREVIST",
      title: "El llegat de la tieta Mercè",
      body: "Una tieta llunyana molt estalviadora et deixa 28.000 € nets després d'impostos i un rellotge antic.",
      opts: [
        { k: "A", t: "Aportar-los escalonadament (DCA) a la teva cartera actual", s: "+28.000 € al motor d'interès compost", fn: function (st) { st.flags.gotInher = true; st.netWorth += 28000; st.joy += 4; return "Honores el seu esforç convertint l'herència en anys de llibertat futura."; } },
        { k: "B", t: "Amortitzar deutes/despeses estructurals i guardar 20.000 €", s: "+20.000 € · Despesa -120 €/m · Calma +8", fn: function (st) { st.flags.gotInher = true; st.netWorth += 20000; st.expenses = Math.max(600, st.expenses - 120); st.joy += 8; return "Elimines càrregues fixes i dorms com un tronc."; } },
        { k: "C", t: "Invertir 18.000 € i destinar 10.000 € a experiències amb la gent que estimes", s: "+18.000 € · Felicitat +15 · Salut +5", fn: function (st) { st.flags.gotInher = true; st.netWorth += 18000; st.joy += 15; st.health += 5; return "Equilibri d'or entre el futur i gaudir d'avui amb els teus."; } }
      ]
    },
    {
      id: "crypto_hype", minAge: 22, maxAge: 60, tag: "BOMBOLLA & FOMO",
      title: "Fília col·lectiva per un nou token d'IA descentralitzada",
      body: "Al grup de WhatsApp d'amics tothom ensenya captures amb guanys del +300% en dos mesos. Et pica la curiositat.",
      opts: [
        { k: "A", t: "Posar-hi només «diners de casino» (1.500 €) sabent que pot anar a zero", s: "Risc controlat i asimètric", fn: function (st, rng) { if (rng() < 0.35) { st.netWorth += 5500; return "Vens a temps abans que punxi la bombolla i rasques +5.500 € nets!"; } st.netWorth -= 1500; return "El token cau un -92%, però com que només hi vas posar 1.500 €, el teu pla vital ni ho nota."; } },
        { k: "B", t: "Entrar-hi fort amb 20.000 €: «aquesta vegada és diferent!»", s: "Altíssima volatilitat", fn: function (st, rng) { if (rng() < 0.22) { st.netWorth += 48000; st.joy += 10; return "Cop de sort brutal (+48.000 €)! Surts just abans que el fundador desaparegui a Dubai."; } st.netWorth -= 17000; st.joy -= 12; st.health -= 5; return "Arribes quan els primers ja estaven venent: perds 17.000 € en tres setmanes."; } },
        { k: "C", t: "Silenciar el grup 8 hores i anar a passejar", s: "Salut mental +6 · 0 € perduts", fn: function (st) { st.joy += 6; st.health += 3; return "Sis mesos després ningú al grup torna a parlar del token. La calma sempre guanya."; } }
      ]
    },
    {
      id: "flat_sell_or_keep", minAge: 34, maxAge: 66, reqFlag: "hasFlat", noFlag: "soldFlat", tag: "PATRIMONI IMMOBILIARI",
      title: "El barri s'ha revaloritzat amb força",
      body: "Una agència et truca perquè tenen un comprador disposat a pagar una prima molt sucosa pel teu immoble.",
      opts: [
        { k: "A", t: "Vendre amb forta plusvàlua (+52.000 € nets) i passar-ho a indexats", s: "+52.000 € capital · -320 €/m lloguer però zero gestió", fn: function (st) { st.flags.soldFlat = true; st.netWorth += 52000; st.passiveIncome = Math.max(0, st.passiveIncome - 320); st.joy += 5; return "Simplifiques el teu patrimoni en un sol clic i consolides una gran plusvàlua."; } },
        { k: "B", t: "Mantenir l'immoble i actualitzar el lloguer amb un bon inquilí", s: "Renda passiva +85 €/m extra", fn: function (st) { st.passiveIncome += 85; return "Conserves la gallina dels ous d'or com a pilar de renda real."; } },
        { k: "C", t: "Refinançar un petit tram per comprar una plaça de pàrquing rendible", s: "-8.000 € · Renda passiva +95 €/m", fn: function (st) { st.netWorth -= 2000; st.passiveIncome += 95; return "Afegeixes una plaça d'aparcament que gairebé no demana manteniment."; } }
      ]
    },
    {
      id: "midlife_pivot", minAge: 40, maxAge: 54, noFlag: "midlifeDone", tag: "CRUÏLLA DELS 40+",
      title: "Replantejar la segona meitat de la partida",
      body: "Mires enrere i t'adones que ja saps què t'omple i què et drena l'energia. Tens tres camins sobre la taula.",
      opts: [
        { k: "A", t: "Passar a consultor sènior 4 dies per setmana (divendres lliures!)", s: "Sou -10% · Salut +14 · Felicitat +15", fn: function (st) { st.flags.midlifeDone = true; st.salary = Math.round(st.salary * 0.9); st.health += 14; st.joy += 15; return "La setmana de 4 dies et regala 52 divendres lliures cada any. Qualitat de vida immensa!"; } },
        { k: "B", t: "Acceptar una direcció general ben pagada durant uns últims anys forts", s: "Sou +38% · Salut -11 · Felicitat -4", fn: function (st) { st.flags.midlifeDone = true; st.salary = Math.round(st.salary * 1.38); st.health -= 11; st.joy -= 4; return "Acceleres fort cap a la jubilació anticipada a canvi d'alta pressió."; } },
        { k: "C", t: "Muntar un petit taller/projecte vocacional sense pressa", s: "Sou -25% · Renda pròpia +250€/m · Felicitat +18", fn: function (st) { st.flags.midlifeDone = true; st.salary = Math.round(st.salary * 0.75); st.passiveIncome += 250; st.joy += 18; st.health += 8; return "Alinees el que fas cada matí amb el que realment t'agrada."; } }
      ]
    },
    {
      id: "fire_unlocked_choice", minAge: 34, maxAge: 66, needFire: true, noFlag: "retiredEarly", tag: "★ LLIBERTAT FINANCERA",
      title: "El teu patrimoni ja cobreix el 100% de les teves despeses!",
      body: "Segons la regla del 4% i les teves rendes, treballar per diners ja és opcional per a tu. Què fas amb la teva llibertat?",
      opts: [
        { k: "A", t: "Declarar el FIRE! Deixar la feina i viure del teu capital i passions", s: "Sou 0 € · Salut +22 · Felicitat +25", fn: function (st) { st.flags.retiredEarly = true; st.flags.fireAge = st.age; st.salary = 0; st.health += 22; st.joy += 25; return "Llibertat conquerida als " + st.age + " anys! Despertar sense despertador és el millor dividend."; } },
        { k: "B", t: "Fer «Coast FIRE»: treballar a mig gas només en el que et diverteix", s: "Sou a la meitat · Salut +15 · Patrimoni segueix doblant", fn: function (st) { st.flags.retiredEarly = true; st.flags.fireAge = st.age; st.salary = Math.round(st.salary * 0.5); st.health += 15; st.joy += 18; return "El millor dels dos mons: zero estrès financer i activitat intel·lectual a mida."; } },
        { k: "C", t: "Seguir 2 anys més («One More Year») per blindar un marge extra", s: "Més coixí · Felicitat +4", fn: function (st) { st.joy += 4; return "Sumes una capa extra de seguretat amb la tranquil·litat de saber que pots plegar demà."; } }
      ]
    },
    {
      id: "tax_audit", minAge: 28, maxAge: 68, tag: "FISCALITAT",
      title: "Planificació fiscal de final d'any",
      body: "Un assessor et proposa optimitzar impostos: des de fons d'acumulació (que difereixen impostos) fins a una estructura agressiva al límit.",
      opts: [
        { k: "A", t: "Usar fons indexats traspasables per diferir impostos 100% legalment", s: "+2.400 € estalvi fiscal net · Zero riscos", fn: function (st) { st.netWorth += 2400; return "El diferiment fiscal en fons d'acumulació fa que Hisenda et deixi compondre el capital dècades!"; } },
        { k: "B", t: "Provar l'estructura agressiva que promet estalviar 9.000 €", s: "Pot estalviar 9k € o rebre sanció de 15k €", fn: function (st, rng) { if (rng() < 0.4) { st.netWorth += 9000; return "Aquesta vegada passa el filtre i t'estalvies 9.000 €."; } st.netWorth -= 15000; st.joy -= 9; return "Carta certificada tres anys després: inspecció, interessos i sanció (-15.000 €)."; } },
        { k: "C", t: "No tocar res i fer l'esborrany ràpid pel teu compte", s: "Sense canvis", fn: function (st) { return "Tràmit ràpid, tot i deixar escapar algunes deduccions legals."; } }
      ]
    },
    {
      id: "health_checkup", minAge: 44, maxAge: 70, tag: "LONGEVITAT",
      title: "Revisió mèdica i hàbits de força i descans",
      body: "Amb els anys t'adones que la millor cartera del món no val res sense vitalitat per gaudir-la als 70.",
      opts: [
        { k: "A", t: "Invertir en entrenador de força, bona alimentació i son de 8h", s: "Despesa +90 €/m · Salut +18 · Felicitat +10", fn: function (st) { st.expenses += 90; st.health += 18; st.joy += 10; return "L'interès compost muscular i cardiovascular és encara més potent que el borsari."; } },
        { k: "B", t: "Caminades diàries gratuïtes i cuinar més a casa", s: "Despesa -60 €/m · Salut +11 · Felicitat +6", fn: function (st) { st.expenses = Math.max(600, st.expenses - 60); st.health += 11; st.joy += 6; return "Hàbits senzills, sostenibles i que fins i tot redueixen la despesa mensual!"; } },
        { k: "C", t: "Posposar-ho perquè tens massa assumptes pendents", s: "Salut -10", fn: function (st) { st.health -= 10; return "El sedentarisme acumula deute biològic."; } }
      ]
    },
    {
      id: "generosity_family", minAge: 46, maxAge: 70, needWorth: 180000, tag: "PROPÒSIT & VINCULACIÓ",
      title: "Compartir l'abundància en vida",
      body: "Tens una posició sòlida i sorgeix l'ocasió d'ajudar algú molt proper en un moment clau o impulsar una beca local.",
      opts: [
        { k: "A", t: "Ajudar amb 12.000 € ben estructurats i acompanyament financer", s: "-12.000 € · Felicitat +19", fn: function (st) { st.netWorth -= 12000; st.joy += 19; return "Donar amb criteri en vida omple d'un sentit profund tot el camí fet."; } },
        { k: "B", t: "Organitzar una trobada anual de tota la família pagada per tu (3.500 €)", s: "-3.500 € · Felicitat +14 · Salut +4", fn: function (st) { st.netWorth -= 3500; st.joy += 14; st.health += 4; return "Crees una tradició inoblidable que uneix generacions."; } },
        { k: "C", t: "Mantenir el capital intacte per prudència", s: "Patrimoni intacte", fn: function (st) { return "Prioritzes la seguretat màxima davant imprevistos."; } }
      ]
    }
  ];

  function fireTarget(st) {
    var annualNeed = Math.max(0, (st.expenses - st.passiveIncome) * 12);
    return Math.round(annualNeed * 25); // 4% SWR rule
  }

  function firePct(st) {
    var tgt = fireTarget(st);
    if (tgt <= 0) return 100;
    if (st.netWorth <= 0) return 0;
    return Math.min(999, Math.round((st.netWorth / tgt) * 100));
  }

  function createNewRun(originId) {
    var orig = ORIGINS[0];
    for (var i = 0; i < ORIGINS.length; i++) {
      if (ORIGINS[i].id === originId) orig = ORIGINS[i];
    }
    var seed = Math.floor(Math.random() * 900000) + 100000;
    var st = {
      choosingOrigin: false,
      seed: seed,
      step: 0,
      age: 22,
      originName: orig.name,
      salary: orig.salary,
      passiveIncome: 0,
      expenses: orig.expenses,
      lifestyle: "balanced", // frugal | balanced | lavish
      netWorth: orig.netWorth,
      health: orig.health,
      joy: orig.joy,
      alloc: {
        cash: orig.alloc.cash,
        index: orig.alloc.index,
        realestate: orig.alloc.realestate,
        venture: orig.alloc.venture
      },
      regimeIdx: 0,
      tab: "vida", // vida | cartera | cronica
      flags: {},
      seenEvents: {},
      currentEventId: null,
      lastOutcome: null,
      status: "playing", // playing | ended
      endSummary: null,
      historyWorth: [orig.netWorth],
      historyFire: [Math.round(orig.expenses * 12 * 25)],
      log: ["22a · Inici amb perfil «" + orig.name + "» (" + window.CalmUI.fmtEur(orig.netWorth) + ")."]
    };
    pickNextEvent(st);
    return st;
  }

  function createOriginPickerState() {
    return { choosingOrigin: true };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && (saved.choosingOrigin || typeof saved.age === "number")) return saved;
    return createOriginPickerState();
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function pickNextEvent(st) {
    var rng = window.CalmUI.seededRng(st.seed + st.age * 97 + st.step * 31);
    var isFire = firePct(st) >= 100;
    var candidates = [];

    for (var i = 0; i < EVENTS.length; i++) {
      var ev = EVENTS[i];
      if (st.seenEvents[ev.id]) continue;
      if (st.age < ev.minAge || st.age > ev.maxAge) continue;
      if (ev.needWorth && st.netWorth < ev.needWorth) continue;
      if (ev.needFire && !isFire) continue;
      if (ev.reqFlag && !st.flags[ev.reqFlag]) continue;
      if (ev.noFlag && st.flags[ev.noFlag]) continue;
      // Prioritize milestone events like FIRE or 100k
      if (ev.needFire || ev.id === "first_100k") {
        candidates.push(ev);
        candidates.push(ev);
        candidates.push(ev);
      } else {
        candidates.push(ev);
      }
    }

    if (candidates.length === 0) {
      // Procedural dynamic market/life turn when custom events exhausted
      st.currentEventId = "proc_" + st.age;
      return;
    }

    var pick = candidates[Math.floor(rng() * candidates.length)];
    st.currentEventId = pick.id;
  }

  function getEventObject(st) {
    for (var i = 0; i < EVENTS.length; i++) {
      if (EVENTS[i].id === st.currentEventId) return EVENTS[i];
    }
    // Procedural fallback event with eternal variety
    return {
      id: st.currentEventId,
      tag: "DECISIÓ BIENNAL",
      title: "Equilibri entre capital, salut i projectes (" + st.age + " anys)",
      body: "S'obre un nou bienni. Pots prémer l'accelerador professional, rebaixar despeses supèrflues o invertir temps en benestar i relacions.",
      opts: [
        { k: "A", t: "Negociar millora d'ingressos o nous clients", s: "Ingressos +9% · Salut -4", fn: function (s) { if (s.salary > 0) s.salary = Math.round(s.salary * 1.09); else s.passiveIncome += 140; s.health -= 4; return "Empentes els ingressos un esglaó més amunt."; } },
        { k: "B", t: "Simplificar subscripcions i costos fixos inútils", s: "Despesa -95 €/m · Calma +4", fn: function (s) { s.expenses = Math.max(600, s.expenses - 95); s.joy += 4; return "Neteges despeses silencioses i guanyes marge de llibertat cada mes."; } },
        { k: "C", t: "Prioritzar esport, descans i temps amb els teus", s: "Salut +10 · Felicitat +9", fn: function (s) { s.health += 10; s.joy += 9; return "Un bienni serè que recarrega piles a fons."; } }
      ]
    };
  }

  function stepSimulation(st, optIdx) {
    var rng = window.CalmUI.seededRng(st.seed + st.age * 313 + optIdx * 17);
    var ev = getEventObject(st);
    var opt = ev.opts[optIdx] || ev.opts[0];
    st.seenEvents[ev.id] = true;

    var prevWorth = st.netWorth;
    var prevHealth = st.health;
    var prevJoy = st.joy;

    // 1. Apply 2 years of compounding & cashflow BEFORE/WITH choice
    var reg = REGIMES[st.regimeIdx];
    var wCash = st.alloc.cash / 100;
    var wIdx = st.alloc.index / 100;
    var wRe = st.alloc.realestate / 100;
    var wVen = st.alloc.venture / 100;

    var noise = (rng() - 0.5) * 0.04;
    var annualPortRet = wCash * reg.rCash + wIdx * (reg.rIdx + noise) + wRe * reg.rRe + wVen * (reg.rVen + noise * 2.2);

    // 2 years simulation
    for (var y = 0; y < 2; y++) {
      if (st.netWorth >= 0) {
        st.netWorth = Math.round(st.netWorth * (1 + annualPortRet));
      } else {
        // Debt compounds against you at 8.5%!
        st.netWorth = Math.round(st.netWorth * 1.085);
      }
      var monthlyNet = st.salary + st.passiveIncome - st.expenses;
      st.netWorth += monthlyNet * 12;

      // Mild inflation adjustment on salary & expenses
      if (st.salary > 0) st.salary = Math.round(st.salary * (1 + reg.inf * 0.75));
      st.expenses = Math.round(st.expenses * (1 + reg.inf * 0.65));
      if (st.passiveIncome > 0) st.passiveIncome = Math.round(st.passiveIncome * (1 + reg.inf * 0.6));
    }

    // Lifestyle drift
    if (st.lifestyle === "frugal") {
      st.netWorth += Math.round(st.expenses * 0.14 * 24);
      st.joy -= 2;
    } else if (st.lifestyle === "lavish") {
      st.netWorth -= Math.round(st.expenses * 0.22 * 24);
      st.joy += 3;
    } else {
      st.health += 1;
      st.joy += 1;
    }

    // Apply player's decision
    var narrative = opt.fn(st, rng);

    // Emergency buffer check: if Cash == 0% during a crash, forced bad sale
    var extraNote = "";
    if (reg.id === "crash" && st.alloc.cash === 0 && st.netWorth > 15000) {
      var penalty = Math.round(st.netWorth * 0.06);
      st.netWorth -= penalty;
      extraNote = " (Sense coixí de liquiditat, un imprevist t'obliga a malvendre actius: -" + window.CalmUI.fmtEur(penalty) + ").";
    }

    st.age += 2;
    st.step += 1;
    st.health = window.CalmUI.clamp(st.health - 1, 0, 100);
    st.joy = window.CalmUI.clamp(st.joy, 0, 100);

    st.historyWorth.push(st.netWorth);
    st.historyFire.push(fireTarget(st));

    var dWorth = st.netWorth - prevWorth;
    var dHealth = st.health - prevHealth;
    var dJoy = st.joy - prevJoy;

    var logEntry = st.age + "a · " + ev.title.slice(0, 34) + " → " + (dWorth >= 0 ? "+" : "") + window.CalmUI.fmtEur(dWorth);
    st.log.unshift(logEntry);
    if (st.log.length > 6) st.log.pop();

    // Advance macro regime stochastically
    var rRoll = rng();
    if (rRoll < 0.32) st.regimeIdx = 0;
    else if (rRoll < 0.54) st.regimeIdx = 1;
    else if (rRoll < 0.72) st.regimeIdx = 2;
    else if (rRoll < 0.86) st.regimeIdx = 3;
    else st.regimeIdx = 4;

    // Check game end conditions (Age 72 or Health collapse)
    if (st.health <= 0 || st.age >= 72) {
      st.status = "ended";
      st.endSummary = computeEndArchetype(st);
      recordBestScore(st);
      st.lastOutcome = null;
      return;
    }

    st.lastOutcome = {
      title: ev.title,
      narrative: narrative + extraNote,
      dWorth: dWorth,
      dHealth: dHealth,
      dJoy: dJoy,
      portRetPct: Math.round(annualPortRet * 100)
    };

    pickNextEvent(st);
  }

  function computeEndArchetype(st) {
    if (st.health <= 0) {
      return {
        rank: "Col·lapse per Esgotament",
        quote: "Vas acumular " + window.CalmUI.fmtEur(st.netWorth) + ", però el cos va dir prou als " + st.age + " anys. Cap rendibilitat compensa descuidar la salut."
      };
    }
    var bonusKid = st.flags.kidFund ? " El fons que vas obrir per a la criatura ja supera els 42.000 €!" : "";
    if (st.flags.retiredEarly && st.joy >= 75 && st.health >= 65) {
      return {
        rank: "★ Mestre/a del Temps Lliure (FIRE als " + st.flags.fireAge + "a)",
        quote: "Patrimoni final de " + window.CalmUI.fmtEur(st.netWorth) + " amb salut (" + st.health + ") i plenitud (" + st.joy + "). Vas entendre que els diners serveixen per comprar temps i calma." + bonusKid
      };
    }
    if (st.netWorth >= 1500000 && st.joy < 50) {
      return {
        rank: "Magnat Solitari",
        quote: "Arribes als 72 anys amb " + window.CalmUI.fmtEur(st.netWorth) + ", però amb felicitat baixa (" + st.joy + "). Vas guanyar el joc de l'Excel perdent pel camí tardes irrepetibles."
      };
    }
    if (st.netWorth >= 900000 && st.joy >= 70) {
      return {
        rank: "Arquitecte/a d'Abundància Serena",
        quote: "Patrimoni de " + window.CalmUI.fmtEur(st.netWorth) + ", salut cuidada i relacions vives. L'interès compost i el sentit comú han fet màgia." + bonusKid
      };
    }
    if (st.netWorth >= 350000) {
      return {
        rank: "Jubilació Sòlida i Tranquil·la",
        quote: "Tanques l'etapa laboral amb " + window.CalmUI.fmtEur(st.netWorth) + " i llibertat per gaudir sense sobresalts financers." + bonusKid
      };
    }
    if (st.netWorth >= 40000 && st.joy >= 75) {
      return {
        rank: "Hedonista Savi del Mediterrani",
        quote: "Patrimoni modest (" + window.CalmUI.fmtEur(st.netWorth) + "), però has viscut amb una alegria envejable (" + st.joy + "/100) cada dècada."
      };
    }
    return {
      rank: "Supervivent de Muntanya Russa",
      quote: "Acabes amb " + window.CalmUI.fmtEur(st.netWorth) + ". Les crisis, el deute o les apostes arriscades t'han fet suar, però tens mil històries per explicar!"
    };
  }

  function recordBestScore(st) {
    var best = window.CalmStorage.get(STATS_KEY, { runs: 0, maxWorth: 0, bestRank: "" });
    best.runs = (best.runs || 0) + 1;
    if (st.netWorth > (best.maxWorth || 0)) {
      best.maxWorth = st.netWorth;
      best.bestRank = st.endSummary ? st.endSummary.rank : "";
    }
    window.CalmStorage.set(STATS_KEY, best);
  }

  function adjustAlloc(st, key, delta) {
    var cur = st.alloc[key];
    var next = window.CalmUI.clamp(cur + delta, 0, 100);
    var diff = next - cur;
    if (diff === 0) return;

    // Balance against other buckets in priority order
    var others = ["cash", "index", "realestate", "venture"];
    for (var i = 0; i < others.length && diff !== 0; i++) {
      var ok = others[i];
      if (ok === key) continue;
      if (diff > 0 && st.alloc[ok] > 0) {
        var take = Math.min(st.alloc[ok], diff);
        st.alloc[ok] -= take;
        st.alloc[key] += take;
        diff -= take;
      } else if (diff < 0 && st.alloc[ok] < 100) {
        var give = Math.min(100 - st.alloc[ok], -diff);
        st.alloc[ok] += give;
        st.alloc[key] -= give;
        diff += give;
      }
    }
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // 0. Origin Selection Screen
      if (st.choosingOrigin) {
        var intro = document.createElement("div");
        intro.className = "scenario-card";
        intro.innerHTML =
          '<div class="scenario-kicker"><span>NOVA PARTIDA · 22 ANYS</span><span>MILIONS DE CAMINS</span></div>' +
          '<h3 class="scenario-title">Amb quin punt de partida comences la teva vida adulta?</h3>' +
          '<p class="scenario-body">Cada partida genera cicles econòmics i dilemes vitals diferents. Equilibra patrimoni, llibertat financera (FIRE), salut i felicitat fins als 72 anys.</p>';
        wrap.appendChild(intro);

        var stack = document.createElement("div");
        stack.className = "choice-stack";
        ORIGINS.forEach(function (orig, idx) {
          var btn = document.createElement("button");
          btn.className = "choice-btn";
          btn.innerHTML =
            '<span class="choice-key">' + (idx + 1) + "</span>" +
            '<div class="choice-content">' +
            '<div class="choice-main">' + orig.name + "</div>" +
            '<div class="choice-sub">' + orig.sub + "</div>" +
            "</div>";
          btn.onclick = function () {
            st = createNewRun(orig.id);
            saveState(st);
            redraw();
          };
          stack.appendChild(btn);
        });
        wrap.appendChild(stack);
        container.appendChild(wrap);
        return;
      }

      // 1. Top 4-Cell HUD
      var fPct = firePct(st);
      var mFlow = st.salary + st.passiveIncome - st.expenses;
      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell' + (fPct >= 100 ? " invert" : "") + '">' +
          '<div class="hud-label">EDAT · FIRE</div>' +
          '<div class="hud-val">' + st.age + "a · " + (fPct >= 100 ? "★100%" : fPct + "%") + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + Math.min(100, fPct) + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">PATRIMONI</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.netWorth) + "</div>" +
          '<div class="hud-label">Obj: ' + window.CalmUI.fmtEur(fireTarget(st)) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">ESTALVI/MES</div>' +
          '<div class="hud-val">' + (mFlow >= 0 ? "+" : "") + window.CalmUI.fmtEur(mFlow) + "</div>" +
          '<div class="hud-label">Renda: ' + window.CalmUI.fmtEur(st.passiveIncome) + "/m</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">SALUT · GOIG</div>' +
          '<div class="hud-val">♥' + st.health + " · ☺" + st.joy + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.health + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // 2. Navigation Tabs + New Life button
      var bar = document.createElement("div");
      bar.className = "toolbar-row";

      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "vida", label: "Decisions" },
        { id: "cartera", label: "Cartera (" + st.alloc.index + "/" + st.alloc.realestate + ")" },
        { id: "cronica", label: "Gràfic" }
      ].forEach(function (tb) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.tab === tb.id ? " active" : "");
        b.textContent = tb.label;
        b.onclick = function () {
          st.tab = tb.id;
          saveState(st);
          redraw();
        };
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      var btnNew = document.createElement("button");
      btnNew.className = "btn-sm";
      btnNew.textContent = "↻ Nova vida";
      btnNew.onclick = function () {
        st = createOriginPickerState();
        saveState(st);
        redraw();
      };
      bar.appendChild(btnNew);
      wrap.appendChild(bar);

      // 3A. Ended Summary View
      if (st.status === "ended" && st.tab === "vida") {
        var endCard = document.createElement("div");
        endCard.className = "outcome-panel";
        endCard.innerHTML =
          '<div>' +
            '<div class="scenario-kicker"><span>BALANÇ DE VIDA · ' + st.age + ' ANYS</span><span>PERFIL: ' + st.originName.toUpperCase() + '</span></div>' +
            '<h3 class="scenario-title" style="margin-top:6px;">' + st.endSummary.rank + "</h3>" +
            '<p class="scenario-body" style="margin-top:6px;">' + st.endSummary.quote + "</p>" +
          "</div>" +
          '<div class="chart-box">' +
            window.CalmUI.buildDualChartSVG(st.historyWorth, st.historyFire, {
              height: 145,
              xStartLabel: "22 anys",
              xEndLabel: st.age + " anys (Línia punt.: Obj. FIRE)"
            }) +
          "</div>";

        var btnReplay = document.createElement("button");
        btnReplay.className = "btn-lg active";
        btnReplay.style.width = "100%";
        btnReplay.textContent = "Començar una altra vida completament diferent →";
        btnReplay.onclick = function () {
          st = createOriginPickerState();
          saveState(st);
          redraw();
        };
        endCard.appendChild(btnReplay);
        wrap.appendChild(endCard);
        container.appendChild(wrap);
        return;
      }

      // 3B. TAB: CARTERA & ESTIL DE VIDA
      if (st.tab === "cartera") {
        var allocCard = document.createElement("div");
        allocCard.className = "scenario-card";
        allocCard.innerHTML =
          '<div class="scenario-kicker"><span>ASSIGNACIÓ D\'ACTIUS</span><span>S\'APLICA CADA BIENNI</span></div>' +
          '<p class="scenario-body">Ajusta com treballa el teu patrimoni amb tocs de 25%. Mantenir un mínim de liquiditat evita malvendre en anys de recessió.</p>';
        wrap.appendChild(allocCard);

        var list = document.createElement("div");
        list.className = "alloc-list";
        var buckets = [
          { k: "cash", name: "Liquiditat / Compte Remunerat", meta: "Coixí d'emergència · ~2–4% · Risc nul" },
          { k: "index", name: "Fons Indexats Globals (MSCI World)", meta: "Motor compost · ~8–10% llarg termini · Volàtil" },
          { k: "realestate", name: "Immobiliari / SOCIMIs & Rendes", meta: "Cobertura d'inflació · ~6–8% · Estable" },
          { k: "venture", name: "Alt Risc / Startups & Cripto", meta: "Asimètric · Pot fer +40% o caure -50%" }
        ];
        buckets.forEach(function (bk) {
          var row = document.createElement("div");
          row.className = "alloc-row";
          row.innerHTML =
            '<div class="alloc-info">' +
              '<div class="alloc-name">' + bk.name + "</div>" +
              '<div class="alloc-meta">' + bk.meta + "</div>" +
            "</div>";
          var ctrls = document.createElement("div");
          ctrls.className = "alloc-controls";

          var bMinus = document.createElement("button");
          bMinus.className = "btn-sm";
          bMinus.textContent = "−25%";
          bMinus.onclick = function () {
            adjustAlloc(st, bk.k, -25);
            saveState(st);
            redraw();
          };

          var pct = document.createElement("span");
          pct.className = "alloc-pct";
          pct.textContent = st.alloc[bk.k] + "%";

          var bPlus = document.createElement("button");
          bPlus.className = "btn-sm";
          bPlus.textContent = "+25%";
          bPlus.onclick = function () {
            adjustAlloc(st, bk.k, 25);
            saveState(st);
            redraw();
          };

          ctrls.appendChild(bMinus);
          ctrls.appendChild(pct);
          ctrls.appendChild(bPlus);
          row.appendChild(ctrls);
          list.appendChild(row);
        });
        wrap.appendChild(list);

        // Lifestyle selector
        var lifeRow = document.createElement("div");
        lifeRow.className = "toolbar-row";
        var lifeSeg = document.createElement("div");
        lifeSeg.className = "segmented";
        lifeSeg.style.width = "100%";
        [
          { id: "frugal", label: "Frugal (+Estalvi)" },
          { id: "balanced", label: "Conscient" },
          { id: "lavish", label: "Hedonista (+Goig)" }
        ].forEach(function (lf) {
          var b = document.createElement("button");
          b.style.flex = "1";
          b.className = "btn-sm" + (st.lifestyle === lf.id ? " active" : "");
          b.textContent = lf.label;
          b.onclick = function () {
            st.lifestyle = lf.id;
            saveState(st);
            redraw();
          };
          lifeSeg.appendChild(b);
        });
        lifeRow.appendChild(lifeSeg);
        wrap.appendChild(lifeRow);

        container.appendChild(wrap);
        return;
      }

      // 3C. TAB: GRÀFIC & CRÒNICA
      if (st.tab === "cronica") {
        var chartWrap = document.createElement("div");
        chartWrap.className = "chart-box";
        chartWrap.innerHTML =
          '<div class="scenario-kicker" style="margin-bottom:4px;"><span>CORBA PATRIMONIAL (SÒLIDA) VS OBJECTIU FIRE (PUNT.)</span></div>' +
          window.CalmUI.buildDualChartSVG(st.historyWorth, st.historyFire, {
            height: 165,
            xStartLabel: "22a",
            xEndLabel: st.age + "a"
          });
        wrap.appendChild(chartWrap);

        var logBox = document.createElement("div");
        logBox.className = "log-list";
        st.log.forEach(function (entry) {
          var d = document.createElement("div");
          d.className = "log-item";
          d.textContent = entry;
          logBox.appendChild(d);
        });
        wrap.appendChild(logBox);

        var btnBack = document.createElement("button");
        btnBack.className = "btn-lg active";
        btnBack.textContent = "Tornar a les decisions (" + st.age + " anys)";
        btnBack.onclick = function () {
          st.tab = "vida";
          saveState(st);
          redraw();
        };
        wrap.appendChild(btnBack);
        container.appendChild(wrap);
        return;
      }

      // 3D. TAB: VIDA (Active Dilemma or Outcome)
      var regNow = REGIMES[st.regimeIdx];
      var banner = document.createElement("div");
      banner.className = "context-banner";
      banner.innerHTML =
        "<span>CLIMA: " + regNow.label + "</span>" +
        "<span>SOU: " + window.CalmUI.fmtEur(st.salary) + "/m</span>";
      wrap.appendChild(banner);

      if (st.lastOutcome) {
        var out = st.lastOutcome;
        var outBox = document.createElement("div");
        outBox.className = "outcome-panel";
        outBox.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>RESULTAT DEL BIENNI (' + (st.age - 2) + " → " + st.age + ' ANYS)</span><span>CARTERA: ' + (out.portRetPct >= 0 ? "+" : "") + out.portRetPct + "%/any</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + out.title + "</h3>" +
            '<p class="scenario-body" style="margin-top:6px;">' + out.narrative + "</p>" +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">Patrimoni ' + (out.dWorth >= 0 ? "+" : "") + window.CalmUI.fmtEur(out.dWorth) + "</span>" +
            '<span class="delta-pill">Salut ' + (out.dHealth >= 0 ? "+" : "") + out.dHealth + "</span>" +
            '<span class="delta-pill">Felicitat ' + (out.dJoy >= 0 ? "+" : "") + out.dJoy + "</span>" +
            '<span class="delta-pill">Progrés FIRE: ' + fPct + "%</span>" +
          "</div>";

        var btnCont = document.createElement("button");
        btnCont.className = "btn-lg active";
        btnCont.style.width = "100%";
        btnCont.textContent = "Avançar als " + st.age + " anys →";
        btnCont.onclick = function () {
          st.lastOutcome = null;
          saveState(st);
          redraw();
        };
        outBox.appendChild(btnCont);
        wrap.appendChild(outBox);
        container.appendChild(wrap);
        return;
      }

      var ev = getEventObject(st);
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>' + ev.tag + '</span><span>EDAT: ' + st.age + " ANYS</span></div>" +
        '<h3 class="scenario-title">' + ev.title + "</h3>" +
        '<p class="scenario-body">' + ev.body + "</p>";
      wrap.appendChild(card);

      var choices = document.createElement("div");
      choices.className = "choice-stack";
      ev.opts.forEach(function (op, idx) {
        var b = document.createElement("button");
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + op.k + "</span>" +
          '<div class="choice-content">' +
            '<div class="choice-main">' + op.t + "</div>" +
            '<div class="choice-sub">' + op.s + "</div>" +
          "</div>";
        b.onclick = function () {
          stepSimulation(st, idx);
          saveState(st);
          redraw();
        };
        choices.appendChild(b);
      });
      wrap.appendChild(choices);

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    if (!st.choosingOrigin && st.status === "playing") {
      return st.age + "a · " + window.CalmUI.fmtEur(st.netWorth);
    }
    var best = window.CalmStorage.get(STATS_KEY, null);
    if (best && best.runs > 0) {
      return "Rècord " + window.CalmUI.fmtEur(best.maxWorth);
    }
    return "22→72a · FIRE";
  }

  window.CalmGames.vides = {
    id: "vides",
    title: "Vides & Capital",
    desc: "Simulador procedimental de vida, inversions, cicles econòmics i llibertat financera (FIRE).",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Vides & Capital · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Comences als <b>22 anys</b> i avances de 2 en 2 anys fins als <b>72</b> prenent decisions de carrera, habitatge, parella, salut i inversió.</li>" +
      "<li><b>Pestanya Cartera:</b> reparteix el teu patrimoni entre Liquiditat, Indexats, Immobiliari i Alt Risc, i tria el teu estil de vida.</li>" +
      "<li><b>Objectiu FIRE (Regla del 4%):</b> quan el teu patrimoni multiplica per 25 la teva despesa anual neta, assoleixes el <b>100% FIRE</b> i treballar esdevé opcional!</li>" +
      "<li>Vigila la <b>Salut (♥)</b>: si cau a zero per estrès, la partida s'acaba abans d'hora.</li>" +
      "</ul>"
  };
})();
