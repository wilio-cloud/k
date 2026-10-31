// Joc 2 Data Bank: El Joc dels Decennis v6 (8 Campanyes de 40 Anys, 6 Actius, 16 Insígnies i 72 Butlletins Macro)
(function () {
  window.CalmData = window.CalmData || {};

  var ASSETS = [
    { k: "eqGlobal",   short: "Global", name: "Accions Globals & Valor",        meta: "Motor sòlid · Brilla a CAPE <16x · Dividends estables" },
    { k: "eqGrowth",   short: "Tech",   name: "Tecnologia & Alt Creixement",    meta: "Alta beta · Vola amb tipus baixos · Pateix a CAPE >32x" },
    { k: "bondShort",  short: "Lletres", name: "Lletres i Bons Curts (1–3a)",   meta: "Coixí tàctic · Risc mínim · Captura pujades de tipus" },
    { k: "bondLong",   short: "Bons 20a", name: "Bons Sobirans Llargs (20a)",   meta: "Escut de deflació/recessió · Cau fort amb inflació" },
    { k: "realAssets", short: "Immob.", name: "SOCIMIs & Infraestructures",     meta: "Rendes indexades · Pateix xocs bruscos de crèdit" },
    { k: "gold",       short: "Or/Mat.", name: "Or & Matèries Primeres",        meta: "Assegurança en estagflació, pànic monetari i crisis" }
  ];

  var PRESETS = [
    { id: "classic6040", label: "60/40 Global",      alloc: { eqGlobal: 40, eqGrowth: 20, bondShort: 20, bondLong: 20, realAssets: 0,  gold: 0  } },
    { id: "permanent",   label: "Permanent 4×25",    alloc: { eqGlobal: 30, eqGrowth: 0,  bondShort: 20, bondLong: 25, realAssets: 0,  gold: 25 } },
    { id: "allweather",  label: "Tot-Terreny",       alloc: { eqGlobal: 30, eqGrowth: 10, bondShort: 10, bondLong: 20, realAssets: 15, gold: 15 } },
    { id: "shield",      label: "Escut Inflació",    alloc: { eqGlobal: 30, eqGrowth: 0,  bondShort: 20, bondLong: 0,  realAssets: 25, gold: 25 } }
  ];

  var CAMPAIGNS = [
    {
      id: "cicle_complet",
      num: 1,
      name: "El Gran Cicle de 40 Anys",
      sub: "Inici 100k € · 20 biennis · Tots els règims macro",
      desc: "Recorregut complet de quatre dècades amb reversió a la mitjana del CAPE, recessions, eufòries i canvis de tipus.",
      startCap: 100000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 17, rate: 3.0, inf: 2.2 },
      weights: { mid: 3, boom: 2, mania: 1, crash: 2, stagflation: 1, rate_peak: 1, recovery: 2, zirp: 1, geopolitics: 1 }
    },
    {
      id: "estagflacio",
      num: 2,
      name: "Tempesta d'Estagflació (1968–2008)",
      sub: "Inici 100k € · IPC 5–10% · Defensa el poder real!",
      desc: "Inspirada en els xocs energètics dels setanta: la inflació rosega l'efectiu i els bons llargs pateixen fins al gir de tipus.",
      startCap: 100000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 19, rate: 5.5, inf: 6.8 },
      weights: { stagflation: 4, rate_peak: 3, geopolitics: 2, recovery: 2, mid: 2, crash: 1, boom: 1 }
    },
    {
      id: "bombolles_tech",
      num: 3,
      name: "Febre Tecnològica i Soroll Digital",
      sub: "Inici 100k € · Eufories CAPE 36x i cracs -50%",
      desc: "Revolucions tecnològiques reals envoltades d'especulació salvatge. Sabràs capturar la innovació sense cremar-te al pic?",
      startCap: 100000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 29, rate: 4.0, inf: 2.5 },
      weights: { mania: 4, boom: 3, crash: 3, zirp: 2, recovery: 2, mid: 1 }
    },
    {
      id: "jubilat_swr",
      num: 4,
      name: "El Repte del Jubilat (Risc de Seqüència)",
      sub: "Inici 600k € · Retires 48k €/bienni (+IPC) per viure!",
      desc: "Ja no treballes: cada bienni retires 48.000 € ajustats a la inflació. Si malvens accions en un crac inicial, t'arruïnes abans de l'Any 40!",
      startCap: 600000,
      biContrib: 0,
      biWithdraw: 48000,
      blindHints: false,
      startMacro: { cape: 24, rate: 2.8, inf: 2.6 },
      weights: { crash: 3, stagflation: 2, mid: 3, recovery: 2, boom: 2, rate_peak: 2, geopolitics: 1 }
    },
    {
      id: "acumulador_dca",
      num: 5,
      name: "De 5.000 € al Milió (Constructor DCA)",
      sub: "Inici 5k € + Aportes 20k €/bienni del teu estalvi",
      desc: "Comences gairebé de zero però aportes estalvi salarial constant. Aquí les caigudes dels primers 15 anys són un regal matemàtic!",
      startCap: 5000,
      biContrib: 20000,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 21, rate: 3.2, inf: 2.3 },
      weights: { crash: 2, recovery: 3, mid: 3, boom: 2, stagflation: 1, zirp: 2, mania: 1 }
    },
    {
      id: "hivern_deflacio",
      num: 6,
      name: "L'Hivern Japonès (CAPE 42x i Tipus 0%)",
      sub: "Inici 120k € · Esclat immobiliari i deflació llarga",
      desc: "Arrenques al cim d'una bombolla colossal seguida per dècades de creixement lent, tipus zero i falsos rebots.",
      startCap: 120000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 40, rate: 4.5, inf: 2.8 },
      weights: { mania: 2, crash: 3, zirp: 4, mid: 2, recovery: 1, geopolitics: 1 }
    },
    {
      id: "dividends_valor",
      num: 7,
      name: "Caçador de Valor i Crèdit",
      sub: "Inici 100k € · Divergències extremes i xocs bancaris",
      desc: "Mercats laterals enganyosos on la diferència entre pagar múltiplos cars o comprar flux de caixa real decideix tota la partida.",
      startCap: 100000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: false,
      startMacro: { cape: 22, rate: 3.8, inf: 3.0 },
      weights: { mid: 3, geopolitics: 3, rate_peak: 2, crash: 2, recovery: 2, boom: 2 }
    },
    {
      id: "mestre_cec",
      num: 8,
      name: "★ Mode Mestre (Sense Pistes)",
      sub: "Inici 100k € · Només dades macro crues i el teu criteri!",
      desc: "S'amaguen totes les pistes de les sub-línies: només tens el CAPE, els tipus, la inflació i els titulars per separar el gra de la palla.",
      startCap: 100000,
      biContrib: 0,
      biWithdraw: 0,
      blindHints: true,
      startMacro: { cape: 20, rate: 3.4, inf: 2.5 },
      weights: { mania: 2, boom: 2, crash: 2, stagflation: 2, rate_peak: 2, recovery: 2, zirp: 2, mid: 2, geopolitics: 2 }
    }
  ];

  var BADGES = [
    { id: "first_40y",     title: "40 Anys al Mercat",       desc: "Completa la teva primera campanya sencera de 40 anys." },
    { id: "beat_bench",    title: "Generador d'Alfa",        desc: "Acaba una campanya superant l'Índex Passiu 60/40." },
    { id: "alpha_250k",    title: "Alfa Extraordinari",      desc: "Supera l'Índex 60/40 per més de +250.000 €." },
    { id: "zero_fomo",     title: "Immune als Cants de Sirena", desc: "Completa 40 anys amb 0 errors de FOMO." },
    { id: "zero_panic",    title: "Sang de Gel",             desc: "Completa 40 anys amb 0 vendes en pànic." },
    { id: "perfect_mind",  title: "Deixeble de Howard Marks", desc: "Completa 40 anys amb 0 FOMO, 0 Pànic i Alfa positiu." },
    { id: "millionaire",   title: "Club de les 7 Xifres",    desc: "Supera 1.000.000 € de capital nominal final." },
    { id: "two_million",   title: "Patrimoni Institucional", desc: "Supera 2.000.000 € al tancament d'una campanya." },
    { id: "real_double",   title: "Poder Adquisitiu Blindat", desc: "Triplica el capital real descontada tota la inflació." },
    { id: "stag_winner",   title: "Domador d'Estagflació",   desc: "Supera la Campanya 2 batent la inflació i l'índex." },
    { id: "bubble_surfer", title: "Domador de Bombolles",    desc: "Supera la Campanya 3 amb Alfa positiu." },
    { id: "retiree_safe",  title: "Jubilació Intacta 40a",   desc: "Acaba el Repte del Jubilat (#4) amb més de 600k € vius!" },
    { id: "dca_million",   title: "Màgia de l'Aportació DCA", desc: "Arriba a 1.000.000 € sortint de 5k € a la Campanya 5." },
    { id: "tokyo_survivor", title: "Supervivent de Tòquio",  desc: "Multiplica per >3x el capital a l'Hivern Japonès (#6)." },
    { id: "blind_master",  title: "★ Mestre Sense Pistes",   desc: "Bat l'índex 60/40 al Mode Mestre (#8) sense cap ajuda." },
    { id: "all_8_camps",   title: "★★ Llegenda dels Cicles", desc: "Completa amb èxit les 8 campanyes històriques!" }
  ];

  // 72 distinct market bulletins (each turn = 2 years cumulative base returns across 6 assets)
  var BULLETINS = [
    // --- MID / EXPANSION (1..10) ---
    {
      id: "m01", phase: "mid", cape: 16, rate: 2.8, inf: 2.1,
      headline: "«L'economia creix sense drames: els tertulians s'avorreixen i busquen el pròxim casino»",
      context: "Beneficis empresarials creixent al 7% anual i balanços sanejats. Cap excés evident de valoració.",
      ret: { eqGlobal: 0.19, eqGrowth: 0.22, bondShort: 0.06, bondLong: 0.07, realAssets: 0.15, gold: 0.05 },
      good: { label: "Mantenir empreses de qualitat i reinvertir tots els dividends en silenci", bonus: 0.04, bias: "cool", note: "La paciència en anys avorrits compon sense friccions ni impostos (+4%)." },
      trap: { label: "Rotar setmanalment d'accions buscant més adrenalina", bonus: -0.06, bias: "fomo", note: "Comissions, horquilles i mal timing et resten un -6% gratuït." },
      lesson: "Paul Samuelson deia que invertir bé ha de ser tan emocionant com mirar com s'asseca la pintura o com creix l'herba."
    },
    {
      id: "m02", phase: "mid", cape: 17, rate: 3.1, inf: 2.3,
      headline: "«Rècord de recompres d'accions: la indústria tradicional retorna caixa massiva als accionistes»",
      context: "Les companyies avorrides de consum, logística i salut generen més caixa que mai mentre la premsa només mira startups.",
      ret: { eqGlobal: 0.21, eqGrowth: 0.16, bondShort: 0.06, bondLong: 0.06, realAssets: 0.14, gold: 0.04 },
      good: { label: "Sobreponderar generadors de caixa lliure amb recompres a múltiples raonables", bonus: 0.05, bias: "cool", note: "Cada recompra a preu just augmenta el teu percentatge de propietat sense pagar impostos (+5%)." },
      trap: { label: "Vendre les empreses rendibles per perseguir OPVs deficitàries de moda", bonus: -0.08, bias: "fomo", note: "Les sortides a borsa calentes es desinflen un cop venç el bloqueig dels fundadors (-8%)." },
      lesson: "Quan una empresa ben gestionada recompra accions barates, el benefici per acció puja encara que les vendes creixin poc."
    },
    {
      id: "m03", phase: "mid", cape: 15, rate: 3.0, inf: 2.0,
      headline: "«Dos anys de mercat lateral: els impacients tanquen fons perquè 'la borsa ja no funciona'»",
      context: "L'índex amb prou feines s'ha mogut en 18 mesos, però els beneficis empresarials han pujat un 18%, abaratint el PER.",
      ret: { eqGlobal: 0.23, eqGrowth: 0.24, bondShort: 0.06, bondLong: 0.08, realAssets: 0.16, gold: 0.03 },
      good: { label: "Acumular amb disciplina aprofitant la compressió silenciosa de múltiples", bonus: 0.05, bias: "cool", note: "La molla comprimida es dispara quan ningú s'ho espera (+5%)." },
      trap: { label: "Comprar productes estructurats bancaris amb lletra petita i capital 'garantit'", bonus: -0.07, bias: "panic", note: "Les comissions implícites de l'estructurat et deixen sense la pujada real (-7%)." },
      lesson: "Els mercats corregeixen per preu (caient) o per temps (lateralitzant mentre els beneficis pugen)."
    },
    {
      id: "m04", phase: "mid", cape: 18, rate: 2.6, inf: 1.8,
      headline: "«L'automatització logística redueix costos i eixampla marges a tota la cadena industrial»",
      context: "Innovació pràctica aplicada a fàbriques i transport millora la productivitat sense pressionar els preus al consum.",
      ret: { eqGlobal: 0.20, eqGrowth: 0.25, bondShort: 0.05, bondLong: 0.09, realAssets: 0.17, gold: 0.02 },
      good: { label: "Deixar córrer la cartera diversificada sense tallar els guanyadors abans d'hora", bonus: 0.04, bias: "cool", note: "Com deia Peter Lynch, no arrenquis les flors per regar les males herbes (+4%)." },
      trap: { label: "Apostar a la baixa (posar-se curt) pensant que el mercat ha pujat massa seguit", bonus: -0.11, bias: "panic", note: "Posar-se curt contra un cicle de productivitat real crema capital a tota velocitat (-11%)." },
      lesson: "A llarg termini, el creixement de la productivitat real és el vent de cua més net per a accions i bons alhora."
    },
    {
      id: "m05", phase: "mid", cape: 16, rate: 3.3, inf: 2.4,
      headline: "«Eleccions polaritzades: la meitat del país jura que si guanya l'altre candidat la borsa s'enfonsarà»",
      context: "Soroll polític eixordador a totes les tertúlies, però els consumidors continuen comprant i les empreses facturant.",
      ret: { eqGlobal: 0.18, eqGrowth: 0.19, bondShort: 0.06, bondLong: 0.07, realAssets: 0.13, gold: 0.06 },
      good: { label: "Separar del tot les idees polítiques de la cartera d'inversió", bonus: 0.04, bias: "cool", note: "Les empreses s'adapten a qualsevol govern; qui ven per política sempre arriba tard (+4%)." },
      trap: { label: "Liquidar tota la cartera la nit electoral per por del resultat", bonus: -0.09, bias: "panic", note: "El mercat puja un 18% al bienni malgrat els auguris partidistes (-9%)." },
      lesson: "Barrejar política i cartera és un dels biaixos cognitius més cars documentats en finances conductuals."
    },
    {
      id: "m06", phase: "mid", cape: 19, rate: 2.9, inf: 2.2,
      headline: "«Els mercats emergents tornen a créixer impulsats per la classe mitjana asiàtica»",
      context: "Mentre Occident creix al 2%, noves economies exportadores redueixen deute i atrauen inversió productiva.",
      ret: { eqGlobal: 0.22, eqGrowth: 0.20, bondShort: 0.06, bondLong: 0.06, realAssets: 0.15, gold: 0.08 },
      good: { label: "Mantenir diversificació global àmplia que capturi el creixement mundial", bonus: 0.04, bias: "cool", note: "No tenir biaix domèstic et permet recollir el creixement vingui d'on vingui (+4%)." },
      trap: { label: "Concentrar el 80% en un sol país exòtic de moda sense seguretat jurídica", bonus: -0.10, bias: "fomo", note: "Un control de capitals inesperat congela i devalua la teva aposta concentrada (-10%)." },
      lesson: "Creixement del PIB d'un país no sempre equival a retorn per a l'accionista si no hi ha protecció dels minoritaris."
    },
    {
      id: "m07", phase: "mid", cape: 17, rate: 3.4, inf: 2.5,
      headline: "«El gurú estrella de l'any passat llança un nou fons amb un 2,3% de comissió anual»",
      context: "Després de dos anys brillants, capta milers de milions en publicitat prometent batre sempre el mercat.",
      ret: { eqGlobal: 0.17, eqGrowth: 0.18, bondShort: 0.07, bondLong: 0.06, realAssets: 0.14, gold: 0.05 },
      good: { label: "Ignorar el màrqueting de gestors estrella i vigilar costos (<0,20% TER)", bonus: 0.04, bias: "cool", note: "Estalvies comissions abusives mentre el fons estrella pateix reversió a la mitjana (+4%)." },
      trap: { label: "Traspassar-ho tot al gestor de moda pagant comissió d'èxit i de gestió alta", bonus: -0.07, bias: "fomo", note: "El fons s'infla massa per moure's àgilment i queda molt per sota de l'índex (-7%)." },
      lesson: "Segons l'estudi SPIVA, menys del 12% dels fons actius que brillen un trienni es mantenen al primer quartil el trienni següent."
    },
    {
      id: "m08", phase: "mid", cape: 18, rate: 2.5, inf: 1.9,
      headline: "«Estabilitat demogràfica i boom de salut preventiva i biotecnologia rendible»",
      context: "L'envelliment poblacional sosté una demanda previsible en salut, assegurances i serveis essencials.",
      ret: { eqGlobal: 0.19, eqGrowth: 0.21, bondShort: 0.05, bondLong: 0.08, realAssets: 0.16, gold: 0.04 },
      good: { label: "Reequilibrar anualment la cartera cap als teus pesos objectiu sense soroll", bonus: 0.03, bias: "cool", note: "Disciplina de rellotger suís que consolida guanys (+3%)." },
      trap: { label: "Apostar a micro-biotechs sense cap fàrmac aprovat esperant un +500%", bonus: -0.09, bias: "fomo", note: "L'assaig clínic fase III falla i l'acció cau un 75% en una sessió (-9%)." },
      lesson: "Les tendències demogràfiques lentes s'aprofiten millor amb cistelles àmplies d'empreses ja rendibles."
    },

    // --- BOOM / LATE CYCLE (9..16) ---
    {
      id: "b01", phase: "boom", cape: 25, rate: 3.8, inf: 3.1,
      headline: "«Cinc anys seguits de pujades: el sopar de Nadal va ple de consells d'accions infal·libles»",
      context: "L'optimisme és generalitzat, l'atur marca mínims i les empreses comencen a endeutar-se per comprar rivals cars.",
      ret: { eqGlobal: 0.11, eqGrowth: 0.14, bondShort: 0.08, bondLong: 0.03, realAssets: 0.10, gold: 0.09 },
      good: { label: "Podar una mica el que més ha pujat i reforçar qualitat i liquiditat curta", bonus: 0.05, bias: "cool", note: " Prepares munició líquida mentre encara regna la complaença (+5%)." },
      trap: { label: "Eliminar tota la renda fixa perquè 'només llasta la rendibilitat'", bonus: -0.06, bias: "fomo", note: "Augmentes el risc just quan la prima de valoració és més estreta (-6%)." },
      lesson: "El risc no és més alt quan els preus han caigut, sinó quan tothom creu que ja no existeix cap risc."
    },
    {
      id: "b02", phase: "boom", cape: 26, rate: 4.1, inf: 3.3,
      headline: "«Febre immobiliària i de crèdit: es venen pisos sobre plànol en un matí sense mirar ràtios»",
      context: "Els bancs relaxen criteris hipotecaris i les promotores cotitzen a múltiples mai vistos.",
      ret: { eqGlobal: 0.07, eqGrowth: 0.05, bondShort: 0.08, bondLong: 0.09, realAssets: -0.14, gold: 0.12 },
      good: { label: "Reduir exposició a immobiliari apalancat i diversificar globalment", bonus: 0.07, bias: "cool", note: "Esquives la punxada del crèdit promotor quan els tipus estrenyen (+7%)." },
      trap: { label: "Concentrar cartera en SOCIMIs molt endeutades i bancs locals", bonus: -0.11, bias: "fomo", note: "La frenada hipotecària castiga durament el totxo finançat a variable (-11%)." },
      lesson: "Els cicles immobiliaris són més lents que els borsaris, però quan el crèdit gira, el palanquejament magnifica la caiguda."
    },
    {
      id: "b03", phase: "boom", cape: 27, rate: 4.4, inf: 3.4,
      headline: "«Rècord històric de fusions gegants pagant primes del 60% amb deute bancari»",
      context: "Els consells d'administració no saben què fer amb el crèdit fàcil i compren creixement a qualsevol preu.",
      ret: { eqGlobal: 0.06, eqGrowth: 0.03, bondShort: 0.09, bondLong: 0.05, realAssets: 0.04, gold: 0.11 },
      good: { label: "Prioritzar empreses amb caixa neta i bons curts ben remunerats al 4,4%", bonus: 0.06, bias: "cool", note: "Cobres gairebé un 9% biennal tranquil en lletres mentre els excessos es purguen (+6%)." },
      trap: { label: "Comprar deute subordinat d'empreses molt apalancades pel 6% d'interès", bonus: -0.09, bias: "fomo", note: "Els impagaments es disparen i el cupó extra no compensa la quitança (-9%)." },
      lesson: "Les grans onades d'adquisicions amb deute als cims del cicle solen destruir valor per al comprador."
    },
    {
      id: "b04", phase: "boom", cape: 24, rate: 3.6, inf: 2.9,
      headline: "«Els joves deixen la feina per fer day-trading des de la platja amb cursos de xarxes socials»",
      context: "L'activitat d'opcions a curtíssim termini es multiplica per quatre i la volatilitat implícita marca mínims.",
      ret: { eqGlobal: 0.12, eqGrowth: 0.09, bondShort: 0.07, bondLong: 0.06, realAssets: 0.08, gold: 0.07 },
      good: { label: "Mantenir el rumb serè i no tocar cap derivat ni palanquejament", bonus: 0.04, bias: "cool", note: "Evites cremar-te en el soroll intradia i sumes rendiment net (+4%)." },
      trap: { label: "Destinar un 20% a opcions setmanals fora de diners per multiplicar ràpid", bonus: -0.12, bias: "fomo", note: "El pas del temps (theta) fon les primes de les opcions fins a zero (-12%)." },
      lesson: "Com més fàcil sembla guanyar diners ràpids sense esforç a les xarxes, més madur està el cicle alcista."
    },
    {
      id: "b05", phase: "boom", cape: 28, rate: 4.2, inf: 3.2,
      headline: "«Les 7 empreses més grans del món ja pesen el 34% de tot l'índex global!»",
      context: "Concentració històrica en pocs gegants d'altíssima qualitat però a valoracions molt exigents (PER 36x).",
      ret: { eqGlobal: 0.13, eqGrowth: -0.06, bondShort: 0.08, bondLong: 0.07, realAssets: 0.11, gold: 0.10 },
      good: { label: "Equilibrar el pes excessiu de creixement car cap a valor global i mitjanes empreses", bonus: 0.06, bias: "cool", note: "La rotació cap a la resta del mercat protegeix i suma alfa (+6%)." },
      trap: { label: "Vendre la diversificació per tenir només les 5 accions més famoses del món", bonus: -0.09, bias: "fomo", note: "Fins i tot empreses excel·lents donen mals retorns si es compren massa cares (-9%)." },
      lesson: "Una gran empresa no sempre és una gran inversió si el preu ja descompta deu anys de perfecció absoluta."
    },
    {
      id: "b06", phase: "boom", cape: 25, rate: 3.9, inf: 2.8,
      headline: "«Augmenta la inversió en infraestructures elèctriques i xarxes d'aigua arreu del continent»",
      context: "Cicle d'inversió física sostinguda per modernitzar xarxes envellides.",
      ret: { eqGlobal: 0.14, eqGrowth: 0.11, bondShort: 0.08, bondLong: 0.05, realAssets: 0.19, gold: 0.09 },
      good: { label: "Mantenir una pota d'actius reals i valor amb fluxos regulats", bonus: 0.05, bias: "cool", note: "Els peatges indexats a l'IPC donen estabilitat i bon dividend (+5%)." },
      trap: { label: "Entrar apalancat en promotores solars sense contractes tancats", bonus: -0.08, bias: "fomo", note: "La caiguda del preu majorista escanya els projectes sense cobertura (-8%)." },
      lesson: "En infraestructures, la qualitat del balanç i els contractes a llarg termini separen la renda segura de l'especulació."
    },

    // --- MANIA / EUPHORIA (17..24) ---
    {
      id: "e01", phase: "mania", cape: 35, rate: 4.0, inf: 2.9,
      headline: "«PORTADA: Els beneficis ja no importen! En el nou paradigma només compten els clics i la narrativa»",
      context: "Empreses sense ingressos dupliquen el preu el primer dia de borsa. Qui parla de PER 15x és ridiculitzat com un dinosaure.",
      ret: { eqGlobal: -0.12, eqGrowth: -0.38, bondShort: 0.08, bondLong: 0.16, realAssets: 0.06, gold: 0.14 },
      good: { label: "Recollir beneficis dels sectors eufòrics i refugiar-se en valor barat, bons i caixa", bonus: 0.10, bias: "cool", note: "Acceptes semblar tonto sis mesos per no arruïnar-te els tres anys següents (+10%)!" },
      trap: { label: "Posar el 100% en creixement extrem per por de quedar fora del tren històric", bonus: -0.15, bias: "fomo", note: "Quan punxa la bombolla perds la meitat de la cartera en divuit mesos (-15%)." },
      lesson: "Les quatre paraules més perilloses de la història financera són sempre: «Aquesta vegada és diferent» (Sir John Templeton)."
    },
    {
      id: "e02", phase: "mania", cape: 37, rate: 3.6, inf: 2.7,
      headline: "«El teu cunyat guanya 40.000 € en un mes amb monedes digitals temàtiques i es compra un iot»",
      context: "Eufòria especulativa pura en actius sense flux de caixa mentre la renda fixa i el valor cotitzen oblidats.",
      ret: { eqGlobal: -0.08, eqGrowth: -0.32, bondShort: 0.07, bondLong: 0.14, realAssets: 0.05, gold: 0.11 },
      good: { label: "Felicitar el cunyat amb un somriure i executar fredament el teu reequilibri cap a actius defensius", bonus: 0.09, bias: "cool", note: "No hi ha res més difícil ni més rendible que veure altres enriquir-se ràpid sense perdre el nord (+9%)." },
      trap: { label: "Hipotecar part de la cartera per imitar l'aposta abans que s'acabi la festa", bonus: -0.16, bias: "fomo", note: "Entres exactament com a liquiditat de sortida dels primers especuladors (-16%)." },
      lesson: "Charles Kindleberger: «No hi ha res que pertorbi tant el judici i el benestar d'una persona com veure un amic fer-se ric sense esforç»."
    },
    {
      id: "e03", phase: "mania", cape: 39, rate: 4.5, inf: 3.1,
      headline: "«El sol d'una capital asiàtica ja val sobre paper més que tot un continent sencer!»",
      context: "CAPE a prop de 40x i múltiples immobiliaris de 80 anys de lloguer. Els bancs centrals comencen a estrènyer el crèdit.",
      ret: { eqGlobal: -0.16, eqGrowth: -0.34, bondShort: 0.09, bondLong: 0.18, realAssets: -0.24, gold: 0.13 },
      good: { label: "Sortir de qualsevol bombolla local extrema cap a bons sobirans i diversificació internacional", bonus: 0.11, bias: "cool", note: "Salves el patrimoni d'una caiguda secular de dues dècades (+11%)!" },
      trap: { label: "Mantenir el 100% concentrat perquè 'la terra i la borsa local mai han caigut'", bonus: -0.14, bias: "fomo", note: "Com al Nikkei el 1989, pagar PER 40x condemna a anys de travessia pel desert (-14%)." },
      lesson: "Cap arbre creix fins al cel: a CAPE >38x l'esperança matemàtica de retorn real a 10 anys tendeix a zero o negatiu."
    },
    {
      id: "e04", phase: "mania", cape: 33, rate: 3.2, inf: 2.4,
      headline: "«Vehicles especials en blanc (SPACs) i famosos anunciant aplicacions de borsa a la mitja part»",
      context: "Qualsevol projecte amb una presentació bonica aixeca centenars de milions sense auditoria rigorosa.",
      ret: { eqGlobal: -0.06, eqGrowth: -0.29, bondShort: 0.07, bondLong: 0.11, realAssets: 0.04, gold: 0.09 },
      good: { label: "Exigir beneficis reals auditats i mantenir coixí en lletres i valor clàssic", bonus: 0.08, bias: "cool", note: "Quan baixa la marea es veu qui nedava despullat; tu vas ben vestit (+8%)." },
      trap: { label: "Comprar una cistella dels 10 projectes més virals a televisió", bonus: -0.14, bias: "fomo", note: "L'índex d'SPACs perd un 65% de valor en tancar-se l'aixeta de liquiditat (-14%)." },
      lesson: "Quan les celebritats esportives protagonitzen anuncis d'inversió especulativa, el sostre del cicle sol ser a tocar."
    },
    {
      id: "e05", phase: "mania", cape: 34, rate: 3.9, inf: 2.8,
      headline: "«Els analistes eleven preus objectiu cada divendres per justificar les cotitzacions actuals»",
      context: "S'inventen noves mètriques ('benefici ajustat abans de gairebé totes les despeses') per fer semblar barat el que és car.",
      ret: { eqGlobal: -0.09, eqGrowth: -0.31, bondShort: 0.08, bondLong: 0.13, realAssets: 0.03, gold: 0.12 },
      good: { label: "Mirar només flux de caixa lliure real i rebaixar risc de renda variable cara", bonus: 0.08, bias: "cool", note: "La comptabilitat creativa s'esvaeix; la caixa real roman (+8%)." },
      trap: { label: "Confiar cegament en els informes de compra dels mateixos bancs que col·loquen les accions", bonus: -0.12, bias: "fomo", note: "Conflicte d'interessos de manual que et deixa atrapat al cim (-12%)." },
      lesson: "Charlie Munger solia dir que sempre que vegis 'EBITDA ajustat creativament', substitueixis el terme per 'guanys de mentida'."
    },

    // --- CRASH / PANIC (25..36) ---
    {
      id: "c01", phase: "crash", cape: 11, rate: 1.5, inf: 0.9,
      headline: "«CAPITULACIÓ TOTAL: La borsa s'ensorra un 42% i les portades parlen de la fi del capitalisme»",
      context: "Vendes forçades de fons apalancats fan que empreses mundials impecables cotitzin a PER 10x i 5% de dividend.",
      ret: { eqGlobal: 0.44, eqGrowth: 0.52, bondShort: 0.04, bondLong: 0.06, realAssets: 0.31, gold: 0.12 },
      good: { label: "Comprar renda variable amb sang freda usant el coixí de liquiditat i bons", bonus: 0.12, bias: "cool", note: "Compres euros a 50 cèntims en plena tempesta i captures un rebot històric (+12%)!" },
      trap: { label: "Vendre-ho tot a efectiu fins que 'torni la tranquil·litat als telenotícies'", bonus: -0.22, bias: "panic", note: "Quan els telenotícies es calmen, l'índex ja ha pujat un +48% sense tu (-22%)." },
      lesson: "Warren Buffett: «Sigues prudent quan els altres siguin cobdiciosos, i sigues valent quan tothom tingui pànic»."
    },
    {
      id: "c02", phase: "crash", cape: 12, rate: 1.8, inf: 1.1,
      headline: "«Fallida d'un gegant financer centenari: es congela el mercat interbancari un dilluns negre»",
      context: "Por sistèmica aguda. Els bancs centrals convoquen reunions d'emergència de matinada per injectar liquiditat il·limitada.",
      ret: { eqGlobal: 0.39, eqGrowth: 0.46, bondShort: 0.04, bondLong: 0.08, realAssets: 0.25, gold: 0.16 },
      good: { label: "Mantenir la calma, verificar diversificació global i reequilibrar comprant accions caigudes", bonus: 0.11, bias: "cool", note: "La resposta monetària massiva encén la recuperació dels actius productius (+11%)." },
      trap: { label: "Treure tots els diners en metàl·lic i tancar el compte d'inversió", bonus: -0.19, bias: "panic", note: "Cristal·litzes el mínim exacte de la dècada per pura angoixa (-19%)." },
      lesson: "En un pànic de liquiditat es ven el que es pot vendre (les millors accions), oferint oportunitats irrepetibles a qui no té deutes."
    },
    {
      id: "c03", phase: "crash", cape: 13, rate: 1.2, inf: 0.6,
      headline: "«Paralització sobtada del comerç mundial: fàbriques i avions aturats durant setmanes»",
      context: "Xoc extern imprevist desploma el PIB un trimestre un -10%, però governs i bancs centrals llancen estímuls fiscals rècord.",
      ret: { eqGlobal: 0.38, eqGrowth: 0.54, bondShort: 0.03, bondLong: 0.02, realAssets: 0.24, gold: 0.18 },
      good: { label: "Mirar a 5 anys vista més enllà del xoc temporal i aportar al pla previst", bonus: 0.10, bias: "cool", note: "La borsa descompta la reobertura nou mesos abans que les estadístiques oficials (+10%)." },
      trap: { label: "Vendre després d'un -30% pensant que caurà un altre -50% segur", bonus: -0.18, bias: "panic", note: "El rebot en V et deixa mirant des de la barrera amb pèrdues bloquejades (-18%)." },
      lesson: "La borsa és una màquina d'anticipar el futur a 12-18 mesos, mai un mirall del titular d'avui."
    },
    {
      id: "c04", phase: "crash", cape: 12, rate: 2.2, inf: 1.4,
      headline: "«Doble sotrac: el primer rebot falla i els últims alcistes llancen la tovallola per esgotament»",
      context: "Ja ningú no vol parlar de borsa als sopars. Les portades de revistes declaren 'La Mort de les Accions'.",
      ret: { eqGlobal: 0.42, eqGrowth: 0.45, bondShort: 0.05, bondLong: 0.07, realAssets: 0.29, gold: 0.08 },
      good: { label: "Usar la portada sobre 'La Mort de les Accions' com el millor senyal contrari de compra", bonus: 0.11, bias: "cool", note: "Com el famós titular de BusinessWeek del 1979, l'apatia total precedeix grans dècades alcistes (+11%)!" },
      trap: { label: "Rendir-se per cansament psicològic i passar a dipòsits fixos", bonus: -0.17, bias: "panic", note: "Abandones la marató al quilòmetre 40 just abans de l'arribada (-17%)." },
      lesson: "Els mercats baixistes més durs no acaben amb crits, sinó amb apatia i desinterès absolut del públic."
    },
    {
      id: "c05", phase: "crash", cape: 13, rate: 2.5, inf: 1.5,
      headline: "«Escàndol comptable en dues grans corporacions: desconfiança general cap als balanços»",
      context: "El frau de dues empreses arrossega per contagi companyies honestes i auditades amb caixa real.",
      ret: { eqGlobal: 0.34, eqGrowth: 0.36, bondShort: 0.05, bondLong: 0.09, realAssets: 0.22, gold: 0.09 },
      good: { label: "Confiar en la diversificació d'índexs amplis on cap empresa pesa més de l'1-2%", bonus: 0.08, bias: "cool", note: "La diversificació absorbeix qualsevol poma podrida i captura la neteja reguladora (+8%)." },
      trap: { label: "Intentar 'pescar ganivets' posant la meitat dels diners en l'empresa acusada de frau", bonus: -0.20, bias: "fomo", note: "Com a Enron o Wirecard, el preu aparentment barat acaba exactament a 0,00 € (-20%)." },
      lesson: "Comprar el mercat sencer quan cau és inversió contrària; comprar una sola empresa fraudulenta és ruleta russa."
    },
    {
      id: "c06", phase: "crash", cape: 14, rate: 2.0, inf: 1.2,
      headline: "«Crisi de deute sobirà perifèric: primes de risc disparades i rumors de ruptura monetària»",
      context: "Pànic regional sever mentre les multinacionals exportadores cotitzen amb descomptes del 35%.",
      ret: { eqGlobal: 0.33, eqGrowth: 0.35, bondShort: 0.04, bondLong: 0.12, realAssets: 0.20, gold: 0.11 },
      good: { label: "Mantenir cartera global sense pànic local i comprar qualitat penalitzada per geografia", bonus: 0.09, bias: "cool", note: "El banc central pronuncia 'farem el que calgui' i els actius es disparen (+9%)." },
      trap: { label: "Malvendre pisos i fons a preu de saldo per portar bitllets en una maleta", bonus: -0.16, bias: "panic", note: "Regales patrimoni productiu al moment de màxima histèria mediàtica (-16%)." },
      lesson: "Tenir el patrimoni diversificat globalment evita que una crisi local comprometi el teu futur."
    },
    {
      id: "c07", phase: "crash", cape: 11, rate: 1.6, inf: 0.8,
      headline: "«Crac llampec algorítmic del -22% en poques sessions sense canvi en l'economia real»",
      context: "Liquidacions automàtiques de fons de paritat de risc i cobertures provoquen una caiguda vertical tècnica.",
      ret: { eqGlobal: 0.37, eqGrowth: 0.41, bondShort: 0.04, bondLong: 0.07, realAssets: 0.23, gold: 0.07 },
      good: { label: "Aprofitar la venda forçada mecànica d'altres per reequilibrar al teu favor", bonus: 0.09, bias: "cool", note: "Com l'octubre del 1987, qui no tenia deute i va mantenir va recuperar en poc temps (+9%)." },
      trap: { label: "Posar ordres de venda automàtica (stop-loss) que salten al mínim exacte", bonus: -0.15, bias: "panic", note: "L'stop-loss t'executa al pou i el mercat rebota un +18% la setmana següent (-15%)." },
      lesson: "Els inversors a llarg termini sense palanquejament tenen el superpoder de no estar mai obligats a vendre en un mal dia."
    },
    {
      id: "c08", phase: "crash", cape: 12, rate: 1.9, inf: 1.0,
      headline: "«Onada d'acomiadaments al sector tecnològic i tancament del capital risc durant 18 mesos»",
      context: "Les valoracions de creixement cauen un 55%: els negocis amb programari crític i beneficis reals paguen els plats trencats de les startups fum.",
      ret: { eqGlobal: 0.31, eqGrowth: 0.56, bondShort: 0.04, bondLong: 0.08, realAssets: 0.19, gold: 0.09 },
      good: { label: "Seleccionar tecnologia rendible de missió crítica ara que cotitza a múltiples barats", bonus: 0.10, bias: "cool", note: "Quan el sector retalla despesa supèrflua, els marges es disparen (+10%)." },
      trap: { label: "Jurar que la tecnologia està morta per sempre i vendre al fons del sotrac", bonus: -0.16, bias: "panic", note: "T'exclouen de l'any d'eficiència i recuperació més fort de la dècada (-16%)." },
      lesson: "Les purgues sectorials destrueixen els projectes sense model de negoci i fan més forts els líders amb caixa."
    },

    // --- MORE MID / BOOM / MANIA (27..33) ---
    {
      id: "m09", phase: "mid", cape: 17, rate: 2.7, inf: 2.0,
      headline: "«Reforma fiscal moderada i acord comercial atlàntic redueixen aranzels industrials»",
      context: "Menys friccions duaneres impulsen exportadors europeus, maquinària de precisió i ports.",
      ret: { eqGlobal: 0.21, eqGrowth: 0.19, bondShort: 0.05, bondLong: 0.07, realAssets: 0.16, gold: 0.03 },
      good: { label: "Mantenir l'exposició internacional i deixar treballar l'interès compost", bonus: 0.04, bias: "cool", note: "El comerç obert premia les cadenes globals ben diversificades (+4%)." },
      trap: { label: "Especular amb divises a curt termini intentant endevinar el canvi euro-dòlar", bonus: -0.07, bias: "fomo", note: "El mercat de divises a curt termini és un joc de suma zero dominat per bancs centrals (-7%)." },
      lesson: "Intentar encertar moviments trimestrals de divises gairebé mai aporta valor net a una cartera patrimonial."
    },
    {
      id: "m10", phase: "mid", cape: 16, rate: 3.2, inf: 2.2,
      headline: "«Empreses familiars cotitzades sense deute lideren la rendibilitat silenciosa de la dècada»",
      context: "Directius que es juguen el seu propi patrimoni inverteixen en R+D a 10 anys vista lluny dels focus.",
      ret: { eqGlobal: 0.22, eqGrowth: 0.18, bondShort: 0.06, bondLong: 0.06, realAssets: 0.15, gold: 0.05 },
      good: { label: "Acompanyar companyies amb alineació directiva ('skin in the game') i horitzó llarg", bonus: 0.05, bias: "cool", note: "La prudència financera de les empreses amb propietari visible bat el mercat (+5%)." },
      trap: { label: "Canviar-les per conglomerats dirigits per mercenaris amb bonus a 12 mesos", bonus: -0.06, bias: "fomo", note: "Els directius de pas maquillen un any i deixen un forat l'any següent (-6%)." },
      lesson: "Nassim Taleb recorda la regla d'or: mai confiïs en qui pren riscos amb els teus diners sense jugar-s'hi res propi."
    },
    {
      id: "b07", phase: "boom", cape: 26, rate: 4.3, inf: 3.1,
      headline: "«Falta mà d'obra qualificada: els salaris pugen de pressa i comprimeixen marges empresarials»",
      context: "Plena ocupació tensa. Les empreses sense poder de fixació de preus no poden traslladar l'augment salarial.",
      ret: { eqGlobal: 0.09, eqGrowth: 0.10, bondShort: 0.08, bondLong: 0.04, realAssets: 0.11, gold: 0.10 },
      good: { label: "Prioritzar negocis amb fort poder de marca capaços d'apujar preus sense perdre clients", bonus: 0.05, bias: "cool", note: "Els fossats defensius protegeixen el marge brut en cicle madur (+5%)." },
      trap: { label: "Invertir en aerolínies i distribuïdors de marge ínfim i alt cost laboral", bonus: -0.09, bias: "fomo", note: "Dos punts més de cost salarial s'emporten tot el benefici net (-9%)." },
      lesson: "Warren Buffett defineix un bon negoci amb una sola prova: pot apujar preus un 5% sense resar abans?"
    },
    {
      id: "b08", phase: "boom", cape: 27, rate: 4.0, inf: 2.9,
      headline: "«Febre del luxe i l'art contemporani: rellotges i col·leccionables es venen amb llista d'espera»",
      context: "L'efecte riquesa de set anys alcistes dispara el consum ostentós a màxims cíclics.",
      ret: { eqGlobal: 0.08, eqGrowth: 0.07, bondShort: 0.08, bondLong: 0.06, realAssets: 0.09, gold: 0.08 },
      good: { label: "Reequilibrar guanys cíclics cap a renda fixa curta i actius descorrelacionats", bonus: 0.05, bias: "cool", note: "Blindes beneficis abans que es refredi el consum aspiracional (+5%)." },
      trap: { label: "Comprar fraccions d'objectes de col·lecció il·líquids sense cap dividend", bonus: -0.10, bias: "fomo", note: "Quan l'eufòria afluixa no hi ha cap comprador a l'altra banda (-10%)." },
      lesson: "La liquiditat no es valora gens durant les festes alcistes, fins al dia exacte que tothom vol sortir per la mateixa porta."
    },
    {
      id: "e06", phase: "mania", cape: 36, rate: 3.7, inf: 2.6,
      headline: "«Fons temàtics d'una sola paraula de moda capten més diners en 6 mesos que en els 15 anys previs!»",
      context: "Qualsevol empresa que afegeix la paraula tecnològica de moda al seu nom puja un +35% l'endemà.",
      ret: { eqGlobal: -0.07, eqGrowth: -0.35, bondShort: 0.07, bondLong: 0.12, realAssets: 0.07, gold: 0.10 },
      good: { label: "Evitar ETFs temàtics llançats al pic de popularitat i mantenir valor global", bonus: 0.09, bias: "cool", note: "Els ETFs temàtics es creen gairebé sempre quan la valoració ja està esgotada (+9%)." },
      trap: { label: "Concentrar mitja cartera en l'ETF temàtic que ha pujat +110% l'any passat", bonus: -0.16, bias: "fomo", note: "Com va passar amb tants fons temàtics el 2021, arriba una caiguda del -60% (-16%)." },
      lesson: "Els estudis acadèmics mostren que l'inversor mitjà en fons temàtics guanya molt menys que el propi fons perquè sempre hi entra al pic."
    },
    {
      id: "e07", phase: "mania", cape: 38, rate: 4.2, inf: 3.0,
      headline: "«Els brokers regalen crèdit al marge amb un clic: el deute borsari de particulars marca rècord»",
      context: "Milions de petits inversors compren accions amb diners prestats al 7% convençuts que pujaran un 25% anual.",
      ret: { eqGlobal: -0.14, eqGrowth: -0.36, bondShort: 0.08, bondLong: 0.15, realAssets: -0.05, gold: 0.13 },
      good: { label: "Zero palanquejament i augmentar pes de bons i liquiditat remunerada", bonus: 0.10, bias: "cool", note: "Quan arriben els margin-calls aliens, la teva cartera neta resisteix intacta (+10%)." },
      trap: { label: "Demanar préstec pignorat al màxim per doblar posició en creixement", bonus: -0.21, bias: "fomo", note: "Una correcció del 25% força el broker a liquidar-te les accions al mínim (-21%)." },
      lesson: "Rick Guerin era el tercer soci de Buffett i Munger, però tenia pressa i anava apalancat; el crac del 1973 el va forçar a malvendre."
    },
    {
      id: "e08", phase: "mania", cape: 33, rate: 3.5, inf: 2.5,
      headline: "«Desdoblament d'accions (splits 10 a 1) celebrats amb eufòria com si creessin valor real!»",
      context: "Les cotitzacions pugen un 15% només per tallar la mateixa pizza en deu trossos més petits.",
      ret: { eqGlobal: -0.05, eqGrowth: -0.26, bondShort: 0.07, bondLong: 0.10, realAssets: 0.06, gold: 0.09 },
      good: { label: "Recordar que tallar la pizza en més trossos no alimenta més i podar excessos", bonus: 0.07, bias: "cool", note: "Mantens el cap fred davant l'il·lusió òptica del preu per acció (+7%)." },
      trap: { label: "Comprar a cegues cada empresa que anuncia un split perquè 'ara sembla barata'", bonus: -0.11, bias: "fomo", note: "Confons preu unitari d'una acció amb valoració de l'empresa (-11%)." },
      lesson: "Un split no afegeix ni un sol euro al flux de caixa; quan el mercat ho celebra amb bogeria, regna l'especulació pura."
    },

    // --- STAGFLATION (34..42) ---
    {
      id: "s01", phase: "stagflation", cape: 18, rate: 6.2, inf: 7.9,
      headline: "«XOC ENERGÈTIC: El barril es triplica i l'IPC salta al 7,9% mentre les fàbriques frenen!»",
      context: "El pitjor malson per a les carteres clàssiques 60/40: accions i bons llargs cauen alhora per la inflació.",
      ret: { eqGlobal: -0.09, eqGrowth: -0.24, bondShort: 0.11, bondLong: -0.23, realAssets: 0.08, gold: 0.34 },
      good: { label: "Protegir poder adquisitiu amb or, matèries primeres, lletres curtes i empreses d'energia/valor", bonus: 0.10, bias: "cool", note: "Els actius reals i la duració curta neutralitzen la fiblada inflacionista (+10%)." },
      trap: { label: "Refugiar-se en bons sobirans a 20 anys pensant que sempre pugen quan hi ha crisi", bonus: -0.14, bias: "panic", note: "Amb inflació desbocada, els bons llargs pateixen la pitjor patacada en 50 anys (-14%)." },
      lesson: "Els bons llargs protegeixen de recessions deflacionistes, però són verí pur durant un xoc d'inflació."
    },
    {
      id: "s02", phase: "stagflation", cape: 15, rate: 7.4, inf: 8.6,
      headline: "«Espiral preus-salaris: vagues al transport i el cistell del supermercat puja un 16% en dos anys»",
      context: "L'efectiu al compte corrent perd gairebé una cinquena part del seu poder de compra real.",
      ret: { eqGlobal: 0.04, eqGrowth: -0.12, bondShort: 0.14, bondLong: -0.16, realAssets: 0.15, gold: 0.28 },
      good: { label: "Evitar l'efectiu mort al 0% i combinar lletres al 7,4%, actius reals i accions amb poder de preu", bonus: 0.08, bias: "cool", note: "Empates o superes l'IPC mentre qui deixa diners al banc s'empobreix en silenci (+8%)." },
      trap: { label: "Deixar tots els estalvis al compte corrent 'per seguretat' sense remunerar", bonus: -0.13, bias: "panic", note: "Veus el mateix saldo nominal a la pantalla, però pots comprar un 16% menys de vida (-13%)." },
      lesson: "La il·lusió monetària fa creure que 100.000 € parats no tenen risc, quan la inflació és un impost invisible implacable."
    },
    {
      id: "s03", phase: "stagflation", cape: 14, rate: 8.0, inf: 7.5,
      headline: "«Escassetat de fertilitzants, coure i gra: el món descobreix deu anys de subinversió minera»",
      context: "No es pot imprimir coure ni petroli amb un teclat: els actius físics escassos prenen el relleu.",
      ret: { eqGlobal: 0.08, eqGrowth: -0.08, bondShort: 0.15, bondLong: -0.11, realAssets: 0.18, gold: 0.31 },
      good: { label: "Mantenir diversificació estructural que inclogui actius reals i productors de recursos", bonus: 0.08, bias: "cool", note: "La pota real de la cartera compensa de sobres la debilitat tecnològica (+8%)." },
      trap: { label: "Tenir només empreses de programari de multiplos alts que descompten guanys a 2040", bonus: -0.11, bias: "fomo", note: "Quan el tipus de descompte puja al 8%, els beneficis llunyans valen molt menys avui (-11%)." },
      lesson: "Les empreses de creixement llunyà es comporten matemàticament com bons de duració llarga: pateixen quan pugen els tipus."
    },
    {
      id: "s04", phase: "stagflation", cape: 13, rate: 8.5, inf: 8.1,
      headline: "«Controls de preus governamentals fracassen i generen cues i desabastiment puntual»",
      context: "Pessimisme social intens, però les valoracions borsàries comencen a ser extraordinàriament barates en termes reals.",
      ret: { eqGlobal: 0.12, eqGrowth: 0.02, bondShort: 0.16, bondLong: -0.06, realAssets: 0.14, gold: 0.22 },
      good: { label: "Cobrar l'alt interès de les lletres i anar acumulant accions globals de PER 11x", bonus: 0.07, bias: "cool", note: "Sembres a preus de ganga mentre tothom està desesperançat (+7%)." },
      trap: { label: "Comprar or amb palanquejament pensant que l'IPC anirà al 30% eternament", bonus: -0.10, bias: "fomo", note: "El cost de finançar el palanquejament al 10% es menja el guany (-10%)." },
      lesson: "Fins i tot en estagflació, les empreses amb actius tangibles i poc capital circulant acaben adaptant les tarifes."
    },
    {
      id: "s05", phase: "stagflation", cape: 16, rate: 5.8, inf: 6.4,
      headline: "«Segona onada d'inflació: el banc central va baixar tipus massa aviat i l'IPC rebota amb fúria!»",
      context: "Com als anys 1977-1979, cantar victòria abans d'hora contra la inflació provoca un segon ensurt més dur.",
      ret: { eqGlobal: -0.05, eqGrowth: -0.18, bondShort: 0.12, bondLong: -0.19, realAssets: 0.11, gold: 0.29 },
      good: { label: "No allargar duració de bons fins que els tipus reals siguin clarament positius", bonus: 0.09, bias: "cool", note: "Evites la trampa de la falsa desinflació prematura (+9%)." },
      trap: { label: "Apostar tota la cartera a una baixada immediata de tipus amb bons a 30 anys", bonus: -0.15, bias: "fomo", note: "El repunt inflacionista enfonsa un altre 19% el preu dels bons llargs (-15%)." },
      lesson: "La història dels anys setanta ensenya que la inflació rarament baixa en línia recta sense una segona escomesa."
    },
    {
      id: "s06", phase: "stagflation", cape: 15, rate: 6.5, inf: 6.0,
      headline: "«Els lloguers logístics i comercials vinculats per contracte a l'IPC revisen rendes a l'alça»",
      context: "Els immobles ben ubicats i amb deute fix antic a tipus baix actuen d'escut patrimonial.",
      ret: { eqGlobal: 0.09, eqGrowth: -0.04, bondShort: 0.13, bondLong: -0.08, realAssets: 0.21, gold: 0.17 },
      good: { label: "Mantenir actius reals amb poc deute o deute fix i contractes indexats", bonus: 0.07, bias: "cool", note: "La inflació redueix el pes real del deute fix mentre les rendes pugen (+7%)." },
      trap: { label: "Comprar SOCIMIs carregades de deute a tipus variable que venç enguany", bonus: -0.12, bias: "fomo", note: "El refinançament al 7% devora tot el flux de caixa del lloguer (-12%)." },
      lesson: "En inflació alta, tenir actius reals amb deute fix llarg és una mina; tenir deute variable curt és una trampa."
    },
    {
      id: "s07", phase: "stagflation", cape: 14, rate: 7.0, inf: 6.9,
      headline: "«Coll d'ampolla marítim global: el cost d'enviar un contenidor es multiplica per sis»",
      context: "Desordre a les cadenes de subministrament castiga importadors però dispara navilieres i productors locals.",
      ret: { eqGlobal: 0.06, eqGrowth: -0.10, bondShort: 0.13, bondLong: -0.12, realAssets: 0.13, gold: 0.21 },
      good: { label: "Conservar una cartera tot-terreny equilibrada entre valor, lletres i actius reals", bonus: 0.06, bias: "cool", note: "Quan una peça pateix, l'altra compensa sense haver d'endevinar el futur (+6%)." },
      trap: { label: "Comprar navilieres al màxim històric de tarifes pensant que mai es construiran més vaixells", bonus: -0.13, bias: "fomo", note: "En cicles marítims, els preus de noli s'enfonsen un 80% tan bon punt arriben nous vaixells (-13%)." },
      lesson: "En sectors cíclics purs (vaixells, mines, acer), cal comprar quan el PER sembla alt per baixos beneficis, mai al pic de guanys!"
    },
    {
      id: "s08", phase: "stagflation", cape: 13, rate: 7.8, inf: 7.2,
      headline: "«Desencís general: els diaris expliquen que 10 anys de borsa amb prou feines han batut l'IPC»",
      context: "La dècada d'estagflació esgota la paciència del públic just quan les valoracions preparen el proper gran cicle alcista.",
      ret: { eqGlobal: 0.15, eqGrowth: 0.08, bondShort: 0.15, bondLong: -0.02, realAssets: 0.16, gold: 0.18 },
      good: { label: "Persistir amb disciplina i començar a acumular accions barates amb els cupons cobrats", bonus: 0.08, bias: "cool", note: "Com el 1981, la paciència al tram final de l'estagflació et situa a primera fila (+8%)." },
      trap: { label: "Abandonar la inversió financera i gastar-ho per pur pessimisme vital", bonus: -0.14, bias: "panic", note: "Renuncies a l'interès compost just abans que canviï el vent secular (-14%)." },
      lesson: "Els règims macroeconòmics duren més del que voldríem, però cap règim és etern."
    },

    // --- RATE PEAK / VOLCKER PIVOT (43..50) ---
    {
      id: "p01", phase: "rate_peak", cape: 11, rate: 9.2, inf: 5.4,
      headline: "«COP DE PUNY MONETARI: El banc central apuja tipus al 9,2% per trencar l'espinada a la inflació!»",
      context: "Recessió provocada expressament per curar els preus. Tant les accions com els bons a 20 anys ofereixen rendibilitats històriques!",
      ret: { eqGlobal: 0.36, eqGrowth: 0.32, bondShort: 0.17, bondLong: 0.38, realAssets: 0.24, gold: -0.10 },
      good: { label: "Bloquejar rendibilitats altes en bons llargs i comprar accions abans que baixin tipus!", bonus: 0.11, bias: "cool", note: "Moviment mestre a l'estil 1982: guanyes cupó alt i plusvàlua en caure la inflació (+11%)!" },
      trap: { label: "Posar el 100% en or ara que tothom parla de la inflació passada", bonus: -0.12, bias: "fomo", note: "Amb tipus reals positius del +4%, l'or corregeix mentre bons i borsa volen (-12%)." },
      lesson: "Quan el banc central restaura la credibilitat amb tipus reals alts, neixen mercats alcistes memorables en bons i accions."
    },
    {
      id: "p02", phase: "rate_peak", cape: 15, rate: 5.5, inf: 3.4,
      headline: "«Els tipus d'interès toquen sostre al 5,5%: tres bancs regionals pateixen fugues per bons mal coberts»",
      context: "L'enduriment monetari fa petar les baules febles, però la inflació ja baixa cap a l'objectiu del 2-3%.",
      ret: { eqGlobal: 0.27, eqGrowth: 0.34, bondShort: 0.10, bondLong: 0.21, realAssets: 0.22, gold: 0.08 },
      good: { label: "Allargar progressivament duració de renda fixa i mantenir accions de qualitat", bonus: 0.08, bias: "cool", note: "Captures el gir a la baixa dels tipus abans que s'acabin les lletres al 5% (+8%)." },
      trap: { label: "Quedar-se 100% en dipòsits a 3 mesos convençut que sempre pagaran el 5,5%", bonus: -0.07, bias: "panic", note: "Risc de reinversió: quan vencen els dipòsits els tipus ja han baixat i la borsa s'ha escapat (-7%)." },
      lesson: "Les lletres a curt termini donen pau avui, però al pic de tipus tenen 'risc de reinversió' quan els tipus tornen a baixar."
    },
    {
      id: "p03", phase: "rate_peak", cape: 16, rate: 5.2, inf: 3.1,
      headline: "«Corba de tipus invertida durant 18 mesos: tots els economistes anuncien la recessió més telegrafiada»",
      context: "Com que tothom espera la recessió i té liquiditat, les empreses ja han ajustat inventaris per endavant.",
      ret: { eqGlobal: 0.24, eqGrowth: 0.29, bondShort: 0.10, bondLong: 0.16, realAssets: 0.18, gold: 0.09 },
      good: { label: "No intentar fer market-timing macroeconòmic i seguir invertit amb cartera equilibrada", bonus: 0.07, bias: "cool", note: "La 'recessió més anunciada de la història' no arriba i el mercat puja el mur de la por (+7%)." },
      trap: { label: "Vendre totes les accions esperant el senyal de vuit indicadors macroeconòmics", bonus: -0.12, bias: "panic", note: "Peter Lynch: s'ha perdut molt més diner preparant-se per correccions que en les correccions mateixes (-12%)." },
      lesson: "Quan un risc és a totes les portades des de fa un any, bona part ja està descomptat als preus."
    },
    {
      id: "p04", phase: "rate_peak", cape: 14, rate: 6.0, inf: 3.8,
      headline: "«Les hipoteques al 6% congelen la compravenda d'habitatge, però els fons immobiliaris cotitzen a -35% sobre valor net»",
      context: "La borsa ja castiga les SOCIMIs com si els edificis valguessin un terç menys que al carrer.",
      ret: { eqGlobal: 0.22, eqGrowth: 0.21, bondShort: 0.11, bondLong: 0.23, realAssets: 0.31, gold: 0.05 },
      good: { label: "Aprofitar el descompte extrem en actius reals de primer nivell i bons abans del gir de tipus", bonus: 0.08, bias: "cool", note: "En suavitzar-se els tipus, el descompte sobre el valor dels edificis es tanca de cop (+8%)." },
      trap: { label: "Vendre actius reals cotitzats just al pic dels tipus hipotecaris", bonus: -0.10, bias: "panic", note: "Vens exactament al moment de màxima pressió financera abans de l'alleujament (-10%)." },
      lesson: "Els actius sensibles als tipus solen fer sòl mesos abans de la primera retallada oficial del banc central."
    },
    {
      id: "p05", phase: "rate_peak", cape: 13, rate: 6.4, inf: 4.0,
      headline: "«Empreses zombies sense beneficis fan fallida en acabar-se el refinançament barat»",
      context: "Sanejament darwinista del mercat: moren els competidors febles i els líders solvents guanyen quota.",
      ret: { eqGlobal: 0.25, eqGrowth: 0.20, bondShort: 0.12, bondLong: 0.19, realAssets: 0.17, gold: 0.06 },
      good: { label: "Mantenir empreses amb balanç fort que compren actius dels rivals en concurs", bonus: 0.07, bias: "cool", note: "Els líders amb caixa surten de cada cicle de tipus alts amb més monopoli natural (+7%)." },
      trap: { label: "Comprar bons escombraries (high yield) d'empreses zombies atret per un cupó de l'11%", bonus: -0.13, bias: "fomo", note: "Una onada d'impagaments et deixa atrapat en reestructuracions judicials (-13%)." },
      lesson: "En el tram final d'un cicle de tipus alts, la qualitat creditícia és innegociable."
    },
    {
      id: "p06", phase: "rate_peak", cape: 15, rate: 5.0, inf: 2.7,
      headline: "«El governador del banc central insinua la primera baixada de tipus després de dos anys durs»",
      context: "La desinflació es confirma sense destruir l'ocupació ('aterratge suau').",
      ret: { eqGlobal: 0.26, eqGrowth: 0.31, bondShort: 0.09, bondLong: 0.20, realAssets: 0.23, gold: 0.10 },
      good: { label: "Mantenir plena exposició al pla d'inversió combinant accions i duració mitjana", bonus: 0.06, bias: "cool", note: "L'aterratge suau impulsa alhora la renda variable i la renda fixa (+6%)." },
      trap: { label: "Esperar que els tipus tornin a l'1% abans d'entrar en borsa", bonus: -0.10, bias: "panic", note: "Quan els tipus arriben a baix, el mercat ja fa dos anys que puja (-10%)." },
      lesson: "No esperis mai el semàfor verd perfecte de l'economia per invertir: al mercat la llum verda surt cara."
    },
    {
      id: "p07", phase: "rate_peak", cape: 14, rate: 5.8, inf: 3.3,
      headline: "«Els fons monetaris acumulen un rècord històric de 6 bilions en efectiu al marge del mercat»",
      context: "Muntanya gegant de liquiditat prudent que acabarà buscant destí quan baixi el rendiment de les lletres.",
      ret: { eqGlobal: 0.23, eqGrowth: 0.26, bondShort: 0.10, bondLong: 0.18, realAssets: 0.19, gold: 0.07 },
      good: { label: "Posicionar-se en actius productius abans que la muntanya de liquiditat hi entri en massa", bonus: 0.06, bias: "cool", note: "El transvasament gradual des de monetaris actua de coixí alcista sostingut (+6%)." },
      trap: { label: "Mantenir el 100% en monetaris indefinidament per comoditat psicològica", bonus: -0.08, bias: "panic", note: "La comoditat a curt termini té un cost d'oportunitat enorme a 10 i 20 anys (-8%)." },
      lesson: "La liquiditat rècord fora del mercat no és un senyal baixista, sinó benzina futura pendent d'entrar."
    },
    {
      id: "p08", phase: "rate_peak", cape: 12, rate: 7.2, inf: 4.2,
      headline: "«Els pressupostos públics pateixen pel cost dels interessos i s'anuncia contenció fiscal»",
      context: "Menys despesa pública frena el PIB nominal però modera definitivament les tensions inflacionistes.",
      ret: { eqGlobal: 0.21, eqGrowth: 0.19, bondShort: 0.13, bondLong: 0.27, realAssets: 0.16, gold: 0.02 },
      good: { label: "Equilibrar bons sobirans que ara paguen molt bé amb renda variable global barata", bonus: 0.07, bias: "cool", note: "La disciplina fiscal fa caure les rendibilitats exigides i dispara el preu dels bons (+7%)." },
      trap: { label: "Vendre tota la cartera per por dels titulars sobre el dèficit públic", bonus: -0.11, bias: "panic", note: "Confons un ajustament saludable amb l'apocalipsi i perds el ral·li (+11% perdut -> -11%)." },
      lesson: "Els mercats de bons premien amb rapidesa qualsevol gir creïble cap a l'estabilitat monetària i fiscal."
    },

    // --- RECOVERY / EARLY BULL (51..58) ---
    {
      id: "r01", phase: "recovery", cape: 13, rate: 2.0, inf: 1.5,
      headline: "«L'atur encara puja als telenotícies, però la borsa ja rebota un +26% des dels mínims!»",
      context: "Desconnexió clàssica d'inici de cicle: els indicadors laborals van amb retard mentre la borsa mira l'any vinent.",
      ret: { eqGlobal: 0.31, eqGrowth: 0.37, bondShort: 0.04, bondLong: 0.09, realAssets: 0.26, gold: 0.06 },
      good: { label: "Ignorar que l'atur és un indicador retardat i mantenir les accions comprades a baix", bonus: 0.08, bias: "cool", note: "Captures la fase més explosiva i rendible de tot el cicle borsari (+8%)." },
      trap: { label: "Vendre el primer +15% de rebot convençut que 'amb aquest atur és una pujada falsa'", bonus: -0.13, bias: "panic", note: "Et quedes fora de tota la recuperació mirant com l'índex s'escapa un +35% més (-13%)." },
      lesson: "L'ocupació és l'últim indicador que millora en una recuperació; si esperes bones xifres d'atur, ja s'ha fet el 60% del ral·li."
    },
    {
      id: "r02", phase: "recovery", cape: 14, rate: 2.2, inf: 1.7,
      headline: "«Palanquejament operatiu: amb només un +6% més de vendes, els beneficis empresarials salten un +28%!»",
      context: "Després d'aprimar estructures durant la crisi, cada euro nou de facturació baixa gairebé net al resultat.",
      ret: { eqGlobal: 0.29, eqGrowth: 0.33, bondShort: 0.05, bondLong: 0.07, realAssets: 0.24, gold: 0.05 },
      good: { label: "Mantenir el pes fort en renda variable mentre els marges es recuperen des de mínims", bonus: 0.07, bias: "cool", note: "L'expansió de marges i de múltiples treballen alhora al teu favor (+7%)." },
      trap: { label: "Refugiar-se només en bons a 1 any al 2% per trauma de la recessió anterior", bonus: -0.09, bias: "panic", note: "Les cicatrius recents et fan perdre l'inici d'una dècada generosa (-9%)." },
      lesson: "El trauma de l'última caiguda (biaix de recència) sol fer que els inversors siguin massa conservadors quan menys risc real hi ha."
    },
    {
      id: "r03", phase: "recovery", cape: 15, rate: 2.4, inf: 1.8,
      headline: "«Tornen els dividends i s'obren de nou les emissions de crèdit corporatiu solvent»",
      context: "La confiança empresarial es normalitza gradualment, tot i que el públic particular segueix escèptic.",
      ret: { eqGlobal: 0.25, eqGrowth: 0.28, bondShort: 0.05, bondLong: 0.08, realAssets: 0.22, gold: 0.04 },
      good: { label: "Reinvertir cada dividend cobrat automàticament en fons d'acumulació", bonus: 0.05, bias: "cool", note: "Els dividends reinvertits a múltiples baixos acceleren la bola de neu (+5%)." },
      trap: { label: "Gastar tots els dividends cobrats pensant que són 'diners gratis'", bonus: -0.06, bias: "fomo", note: "Frenes la capitalització composta en el tram més fèrtil (+0% extra i pèrdua relativa -6%)." },
      lesson: "A llarg termini, més del 45% del retorn total històric de les borses mundials prové de la reinversió dels dividends."
    },
    {
      id: "r04", phase: "recovery", cape: 14, rate: 1.8, inf: 1.6,
      headline: "«Les petites i mitjanes empreses industrials desperten amb descomptes del 30% respecte a les grans»",
      context: "L'amplitud del mercat millora: ja no pugen només quatre gegants, sinó milers de companyies reals.",
      ret: { eqGlobal: 0.28, eqGrowth: 0.26, bondShort: 0.04, bondLong: 0.07, realAssets: 0.25, gold: 0.05 },
      good: { label: "Mantenir un índex global ampli que inclogui empreses mitjanes i industrials", bonus: 0.06, bias: "cool", note: "La recuperació de l'economia física impulsa tot el teixit productiu (+6%)." },
      trap: { label: "Comprar només l'acció defensiva que va resistir la crisi passada a PER 30x", bonus: -0.07, bias: "panic", note: "El que va fer d'escut ahir es queda endarrerit quan torna el creixement (+0% relatiu -> -7%)." },
      lesson: "Conduir mirant només el retrovisor de l'any passat fa comprar l'escut quan la tempesta ja ha escampat."
    },
    {
      id: "r05", phase: "recovery", cape: 15, rate: 2.5, inf: 2.0,
      headline: "«El crèdit hipotecari es reactiva a tipus moderats i s'absorbeix l'estoc d'oficines i habitatges»",
      context: "Normalització immobiliària sense excessos: rendibilitats per lloguer saludables del 6%.",
      ret: { eqGlobal: 0.22, eqGrowth: 0.24, bondShort: 0.05, bondLong: 0.08, realAssets: 0.27, gold: 0.04 },
      good: { label: "Mantenir l'assignació estratègica amb reequilibris disciplinats", bonus: 0.05, bias: "cool", note: "Totes les peces productives de la cartera remen en la mateixa direcció (+5%)." },
      trap: { label: "Intentar endevinar correccions del 5% entrant i sortint cada mes", bonus: -0.08, bias: "fomo", note: "Perds els deu millors dies del bienni, que concentren gairebé tot el guany (-8%)." },
      lesson: "Estar fora del mercat només els 10 millors dies d'una dècada redueix la rendibilitat acumulada a la meitat."
    },
    {
      id: "r06", phase: "recovery", cape: 16, rate: 2.3, inf: 1.9,
      headline: "«Nova generació de xips i programari empresarial dispara la inversió en béns d'equip»",
      context: "Les empreses renoven sistemes informàtics i maquinària després de dos anys d'ajornar despesa.",
      ret: { eqGlobal: 0.24, eqGrowth: 0.34, bondShort: 0.05, bondLong: 0.07, realAssets: 0.18, gold: 0.03 },
      good: { label: "Participar en la innovació global a preus encara raonables sense caure en palanquejament", bonus: 0.06, bias: "cool", note: "Captures la fase sana d'una onada tecnològica amb fonaments reals (+6%)." },
      trap: { label: "Vendre totes les accions tecnològiques només perquè ja han pujat un 25% des del sòl", bonus: -0.08, bias: "panic", note: "L'ancoratge al preu mínim de la crisi et fa sortir al primer esglaó d'una escala llarga (-8%)." },
      lesson: "No t'ancoris mai al preu mínim que vas veure un dia de pànic; valora l'empresa pels beneficis futurs que genera."
    },
    {
      id: "r07", phase: "recovery", cape: 15, rate: 2.6, inf: 2.1,
      headline: "«Els bancs sanejats amb capital rècord reprenen el pagament de dividends del 6%»",
      context: "Després d'anys de regulació estricta, el sector financer torna a ser rendible sense bogeries.",
      ret: { eqGlobal: 0.23, eqGrowth: 0.20, bondShort: 0.05, bondLong: 0.07, realAssets: 0.19, gold: 0.05 },
      good: { label: "Deixar que la pota de valor global reculli la normalització bancària i industrial", bonus: 0.05, bias: "cool", note: "Els sectors odiats durant deu anys sorprenen a l'alça quan es netegen (+5%)." },
      trap: { label: "Posar tots els estalvis en accions d'un únic banc local pel seu dividend", bonus: -0.08, bias: "fomo", note: "Un impost extraordinari local frena el teu únic cavall mentre la resta puja (-8%)." },
      lesson: "Cobrar dividends globals de 1.500 empreses és prudència; dependre del dividend d'un sol banc és concentració innecessària."
    },
    {
      id: "r08", phase: "recovery", cape: 16, rate: 2.1, inf: 1.8,
      headline: "«El mur de les preocupacions: malgrat cent titulars dubtosos, les borses encadenen màxims creixents»",
      context: "L'escepticisme sa evita l'eufòria i allarga la salut del cicle alcista.",
      ret: { eqGlobal: 0.21, eqGrowth: 0.25, bondShort: 0.04, bondLong: 0.08, realAssets: 0.17, gold: 0.04 },
      good: { label: "Seguir el teu pla escrit sense deixar-te espantar pel soroll diari", bonus: 0.04, bias: "cool", note: "Com deia Sir John Templeton, els mercats alcistes creixen en l'escepticisme (+4%)." },
      trap: { label: "Comprar assegurances de cartera complexes i cares cada trimestre", bonus: -0.07, bias: "panic", note: "El cost constant de cobrir-se de tot s'emporta un terç de la pujada (-7%)." },
      lesson: "Els mercats alcistes neixen en el pessimisme, creixen en l'escepticisme, maduren en l'optimisme i moren en l'eufòria."
    },

    // --- ZIRP / DEFLATION / JAPAN WINTER (59..65) ---
    {
      id: "z01", phase: "zirp", cape: 22, rate: 0.1, inf: -0.3,
      headline: "«TIPUS AL 0,0%: Els dipòsits no paguen res i els bons alemanys i japonesos donen rendiment negatiu!»",
      context: "Estancament secular i envelliment: excés d'estalvi mundial i inflació sota zero.",
      ret: { eqGlobal: 0.14, eqGrowth: 0.27, bondShort: 0.00, bondLong: 0.13, realAssets: 0.18, gold: 0.12 },
      good: { label: "Combinar empreses globals de qualitat, actius reals i or evitant quedar atrapat al 0% etern", bonus: 0.06, bias: "cool", note: "Els fluxos de caixa creixents i escassos es revaloren amb tipus zero (+6%)." },
      trap: { label: "Comprar bons a 30 anys amb rendibilitat negativa del -0,4% per especular", bonus: -0.10, bias: "fomo", note: "Prestar diners pagant per prestar-los viola tota lògica financera elemental (-10%)." },
      lesson: "En un món de tipus zero ('TINA'), la fam de rendibilitat pot empènyer l'inversor a assumir riscos ocults enormes."
    },
    {
      id: "z02", phase: "zirp", cape: 26, rate: 0.0, inf: 0.4,
      headline: "«Expansió quantitativa (QE): els bancs centrals compren bilions en bons i inunden el mercat de liquiditat»",
      context: "L'economia real creix a pas de tortuga (+1,2%), però la liquiditat infla tots els actius financers de qualitat.",
      ret: { eqGlobal: 0.18, eqGrowth: 0.31, bondShort: 0.00, bondLong: 0.09, realAssets: 0.20, gold: 0.14 },
      good: { label: "Mantenir actius productius globals sense apalancar-se però sense quedar fora en efectiu", bonus: 0.06, bias: "cool", note: "No lluites contra el banc central, però mantens diversificació per si canvia el règim (+6%)." },
      trap: { label: "Mantenir 100% en efectiu deu anys esperant que torni el patró or demà mateix", bonus: -0.11, bias: "panic", note: "Una dècada sencera al 0,0% et deixa a anys llum del creixement patrimonial global (-11%)." },
      lesson: "En règims de repressió financera (tipus sota la inflació), l'estalviador pur en compte corrent és qui paga la factura."
    },
    {
      id: "z03", phase: "zirp", cape: 28, rate: 0.2, inf: -0.5,
      headline: "«Trampa de liquiditat i desendeutament: famílies i bancs paguen deutes vells i ningú demana crèdit nou»",
      context: "Recessió de balanços a l'estil japonès: la borsa local arrossega pes mort bancari mentre l'exterior creix.",
      ret: { eqGlobal: 0.15, eqGrowth: 0.19, bondShort: 0.01, bondLong: 0.14, realAssets: -0.04, gold: 0.11 },
      good: { label: "Diversificar fora del país estancat cap a borses globals i bons sobirans", bonus: 0.08, bias: "cool", note: "Un japonès amb cartera global va multiplicar patrimoni mentre el Nikkei trigava 34 anys a recuperar-se (+8%)!" },
      trap: { label: "Posar el 90% del patrimoni només en accions i pisos del teu propi país estancat", bonus: -0.12, bias: "fomo", note: "El biaix domèstic et lliga de mans i peus a tres dècades perdudes (-12%)." },
      lesson: "El cas del Japó (1989–2023) és la prova definitiva de per què mai s'ha d'invertir només al propi país."
    },
    {
      id: "z04", phase: "zirp", cape: 24, rate: 0.0, inf: 0.8,
      headline: "«Fam desesperada de rendes: es comercialitzen pagarés exòtics al 5% com si fossin dipòsits segurs!»",
      context: "Com que les lletres paguen 0%, xarxes comercials col·loquen deute complex d'alt risc a estalviadors conservadors.",
      ret: { eqGlobal: 0.16, eqGrowth: 0.22, bondShort: 0.00, bondLong: 0.07, realAssets: 0.15, gold: 0.09 },
      good: { label: "Rebutjar productes opacs 'substituts del dipòsit' i separar clarament liquiditat segura i renda variable transparent", bonus: 0.07, bias: "cool", note: "Esquives el corralito dels pagarés i preferents mal venudes (+7%)." },
      trap: { label: "Posar el fons de seguretat en preferents perpètues d'una entitat mediocre pel 5%", bonus: -0.15, bias: "fomo", note: "Assumies risc d'accions a canvi d'un petit cupó i pateixes una quitança del 60% (-15%)." },
      lesson: "Raymond DeVoe: «S'ha perdut més diner buscant un 1% extra de rendiment en renda fixa que a punta de pistola»."
    },
    {
      id: "z05", phase: "zirp", cape: 21, rate: 0.3, inf: 0.2,
      headline: "«Fals rebot en l'hivern deflacionista: el govern llança obres públiques però el consum segueix glaçat»",
      context: "Ral·li tàctic breu seguit de recaiguda per impostos al consum.",
      ret: { eqGlobal: 0.12, eqGrowth: 0.16, bondShort: 0.01, bondLong: 0.11, realAssets: 0.05, gold: 0.10 },
      good: { label: "Mantenir cartera global reequilibrada amb bons que actuen d'amortidor deflacionista", bonus: 0.06, bias: "cool", note: "En deflació, els bons llargs i la diversificació exterior funcionen com un rellotge (+6%)." },
      trap: { label: "Endeutar-se per comprar locals comercials secundaris en una població minvant", bonus: -0.12, bias: "fomo", note: "En deflació el deute pesa cada any més i els locals queden buits (-12%)." },
      lesson: "La demografia i la deflació castiguen implacablement l'immobiliari secundari apalancat."
    },
    {
      id: "z06", phase: "zirp", cape: 25, rate: 0.1, inf: 0.9,
      headline: "«Els gegants tecnològics amb caixa neta emeten bons a 10 anys al 0,8% per recomprar les seves pròpies accions»",
      context: "Arbitratge financer històric a favor de les empreses amb millor qualificació creditícia del planeta.",
      ret: { eqGlobal: 0.19, eqGrowth: 0.29, bondShort: 0.00, bondLong: 0.05, realAssets: 0.16, gold: 0.08 },
      good: { label: "Ser copropietari d'aquestes fortaleses globals dins d'una cartera equilibrada", bonus: 0.05, bias: "cool", note: "Les millors empreses es financen gairebé gratis en benefici de l'accionista (+5%)." },
      trap: { label: "Comprar els seus bons al 0,8% a 10 anys en lloc d'una cartera equilibrada", bonus: -0.07, bias: "panic", note: "Qualsevol mínima pujada futura d'inflació es menja deu anys de cupons ridículs (-7%)." },
      lesson: "Quan una empresa solvent et demana prestat al 0,8% a deu anys, el bon negoci el fa l'accionista que rep el capital, no el bonista."
    },
    {
      id: "z07", phase: "zirp", cape: 20, rate: 0.4, inf: 1.1,
      headline: "«Reformes de govern corporatiu obliguen empreses asiàtiques que acumulaven caixa morta a repartir-la!»",
      context: "Centenars de companyies que cotitzaven per sota del seu valor en llibres doblen dividends i recompres.",
      ret: { eqGlobal: 0.23, eqGrowth: 0.18, bondShort: 0.01, bondLong: 0.04, realAssets: 0.14, gold: 0.09 },
      good: { label: "Capturar el despertar del valor internacional gràcies a la diversificació global", bonus: 0.06, bias: "cool", note: "Quan la caixa acumulada durant dècades s'allibera, el valor es revalora de cop (+6%)." },
      trap: { label: "Entrar-hi només després que ja hagin duplicat preu i a cobert de divisa car", bonus: -0.07, bias: "fomo", note: "Arribes tard a la festa per perseguir rendibilitats recents (-7%)." },
      lesson: "El valor amagat necessita un catalitzador de governança; la diversificació global fa que ja hi siguis a dins quan passa."
    },

    // --- GEOPOLITICS / CURRENCY / SUPPLY SHOCKS (66..72) ---
    {
      id: "g01", phase: "geopolitics", cape: 17, rate: 3.9, inf: 4.1,
      headline: "«TENSIÓ GEOPOLÍTICA AGUDA: Bloqueig d'un estret marítim clau dispara el petroli i l'or en 48 hores!»",
      context: "Titulars bèl·lics d'última hora fan caure les borses un -12% la primera setmana mentre l'or i l'energia pugen.",
      ret: { eqGlobal: 0.13, eqGrowth: 0.10, bondShort: 0.08, bondLong: 0.03, realAssets: 0.11, gold: 0.25 },
      good: { label: "Mantenir sang freda: l'or i la liquiditat amorteixen l'ensurt sense malvendre les accions", bonus: 0.07, bias: "cool", note: "Estadísticament, el 85% dels xocs geopolítics puntuals es recuperen en menys de 12 mesos (+7%)." },
      trap: { label: "Vendre tota la borsa el matí de màxim pànic televisiu", bonus: -0.13, bias: "panic", note: "Vens al mínim de l'ensurt i veus com el mercat recupera tot el terreny en sis mesos (-13%)." },
      lesson: "Nathan Rothschild ja ho resumia al segle XIX: el pànic dels titulars geopolítics gairebé sempre és mal conseller per vendre."
    },
    {
      id: "g02", phase: "geopolitics", cape: 18, rate: 4.2, inf: 3.6,
      headline: "«Guerra aranzelària i relocalització industrial ('nearshoring'): es reescriuen les cadenes mundials»",
      context: "Més cost de producció a curt termini, però fort cicle d'inversió en noves fàbriques, robòtica i xarxes.",
      ret: { eqGlobal: 0.15, eqGrowth: 0.14, bondShort: 0.08, bondLong: 0.02, realAssets: 0.17, gold: 0.16 },
      good: { label: "Combinar accions globals, infraestructures reals i or per navegar un món multipolar", bonus: 0.06, bias: "cool", note: "La cartera resisteix la fragmentació comercial i suma en tots els fronts (+6%)." },
      trap: { label: "Apostar-ho tot a un sol sector exportador ultra-dependent d'aranzels polítics", bonus: -0.10, bias: "fomo", note: "Un decret duaner de divendres a la nit retalla un 30% el valor del sector (-10%)." },
      lesson: "En un món multipolar amb friccions comercials, la diversificació geogràfica i l'or tornen a guanyar pes estratègic."
    },
    {
      id: "g03", phase: "geopolitics", cape: 16, rate: 4.6, inf: 3.9,
      headline: "«Crisi cambial en tres mercats emergents i compres rècord d'or per part de bancs centrals!»",
      context: "Els bancs centrals d'Àsia i Orient Mitjà diversifiquen reserves cap al metall groc a ritme històric.",
      ret: { eqGlobal: 0.14, eqGrowth: 0.15, bondShort: 0.09, bondLong: 0.04, realAssets: 0.12, gold: 0.27 },
      good: { label: "Mantenir una posició estructural moderada (10–20%) en or i actius forts", bonus: 0.06, bias: "cool", note: "L'or fa exactament la seva feina d'assegurança monetària sense deute de ningú (+6%)." },
      trap: { label: "Comprar bons locals en divises febles atret per un interès aparent del 18%", bonus: -0.14, bias: "fomo", note: "Cobres un 18% d'interès però la divisa es devalua un 45% contra l'euro (-14%)." },
      lesson: "Un cupó del 18% en una moneda inestable gairebé mai és un regal: és la prima d'una devaluació imminent."
    },
    {
      id: "g04", phase: "geopolitics", cape: 19, rate: 3.5, inf: 2.8,
      headline: "«Ciberatac global paralitza ports i logística una setmana: es dispara la despesa en ciberseguretat i defensa»",
      context: "Empreses i estats blinden xarxes crítiques, telecomunicacions i redundància industrial.",
      ret: { eqGlobal: 0.17, eqGrowth: 0.23, bondShort: 0.07, bondLong: 0.06, realAssets: 0.14, gold: 0.12 },
      good: { label: "Mantenir la calma davant l'incident operatiu i seguir invertit en líders globals", bonus: 0.05, bias: "cool", note: "L'economia absorbeix l'incident i reforça la inversió tecnològica (+5%)." },
      trap: { label: "Liquidar fons per por que internet deixi de funcionar demà", bonus: -0.09, bias: "panic", note: "Reacció emocional desproporcionada que et fa vendre amb descompte (-9%)." },
      lesson: "Distingir entre un contratemps operatiu d'una setmana i un dany permanent al capital és clau per no sobrereaccionar."
    },
    {
      id: "g05", phase: "geopolitics", cape: 17, rate: 3.7, inf: 3.2,
      headline: "«Referèndum inesperat provoca la sortida d'un gran país d'un bloc comercial i enfonsa la seva moneda un 15%»",
      context: "Xoc polític de divendres al matí; tanmateix, les multinacionals d'aquell país facturen el 75% a l'exterior!",
      ret: { eqGlobal: 0.18, eqGrowth: 0.19, bondShort: 0.07, bondLong: 0.08, realAssets: 0.10, gold: 0.14 },
      good: { label: "Analitzar d'on venen els ingressos reals de les empreses i no entrar en pànic pel titular", bonus: 0.06, bias: "cool", note: "Com al Brexit del 2016, les multinacionals globals van pujar en beneficiar-se d'exportar més barat (+6%)." },
      trap: { label: "Vendre en obertura amb un -10% seguint el pànic de les tertúlies matinals", bonus: -0.11, bias: "panic", note: "Regales les teves participacions en el minut de màxima confusió (-11%)." },
      lesson: "L'índex borsari d'un país no és el PIB d'aquell país: sovint agrupa multinacionals que venen a tot el planeta."
    },
    {
      id: "g06", phase: "geopolitics", cape: 18, rate: 4.1, inf: 3.5,
      headline: "«Sequera severa a grans conques hidroelèctriques i canals de navegació encareix energia i gra»",
      context: "Fenomen climàtic extrem altera costos d'electricitat i transport fluvial durant dotze mesos.",
      ret: { eqGlobal: 0.12, eqGrowth: 0.11, bondShort: 0.08, bondLong: 0.03, realAssets: 0.16, gold: 0.18 },
      good: { label: "Confiar en l'equilibri d'actius financers i reals sense perseguir matèries primeres al pic", bonus: 0.05, bias: "cool", note: "La pota d'infraestructures i matèries primeres esmorteeix l'encariment temporal (+5%)." },
      trap: { label: "Especular amb futurs agrícoles apalancats després que el blat ja hagi duplicat preu", bonus: -0.12, bias: "fomo", note: "Arriben les pluges la collita següent i el preu agrícola cau un 40% (-12%)." },
      lesson: "En matèries primeres climatològiques, la cura dels preus alts sempre acaba sent els mateixos preus alts (més sembra)."
    },
    {
      id: "g07", phase: "geopolitics", cape: 15, rate: 3.3, inf: 2.4,
      headline: "«Acord de pau històric i obertura de nous corredors comercials redueixen la prima de risc energètic»",
      context: "Després d'anys de tensió, la diplomàcia rebaixa el preu del transport i l'energia arreu del món.",
      ret: { eqGlobal: 0.25, eqGrowth: 0.27, bondShort: 0.06, bondLong: 0.11, realAssets: 0.19, gold: -0.06 },
      good: { label: "Reequilibrar els guanys previs de l'or cap a accions productives i bons", bonus: 0.07, bias: "cool", note: "Vens car l'escut que ja ha complert la seva funció i reforces el motor productiu (+7%)!" },
      trap: { label: "Aferrar-se al 100% d'or esperant un col·lapse mundial que s'allunya", bonus: -0.09, bias: "panic", note: "La distensió geopolítica refreda els refugis mentre el món productiu s'enlaira (-9%)." },
      lesson: "El reequilibri periòdic és màgic perquè t'obliga a vendre una mica de l'assegurança quan és cara i comprar motor quan és barat."
    }
  ];

  window.CalmData.decennis = {
    ASSETS: ASSETS,
    PRESETS: PRESETS,
    CAMPAIGNS: CAMPAIGNS,
    BADGES: BADGES,
    BULLETINS: BULLETINS
  };
})();
