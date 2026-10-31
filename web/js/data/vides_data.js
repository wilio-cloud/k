// Joc 1: Vides & Capital: Dinastia (v6) - Catàleg de Dades, Cadenes Vitals i Motor Combinatori
(function () {
  window.CalmData = window.CalmData || {};

  var DYNASTY_NAMES = [
    "Rovira", "Ferrer", "Vila", "Serra", "Puig", "Martí", "Soler", "Vidal",
    "Prat", "Bosch", "Casals", "Ribas", "Font", "Bruguera", "Mas", "Oliver"
  ];

  var KID_NAMES = [
    "Júlia", "Martí", "Laia", "Pol", "Clara", "Biel", "Ona", "Nil",
    "Bruna", "Arnau", "Queralt", "Oriol", "Núria", "Roger", "Mariona", "Guillem", "Aina", "Bernat"
  ];

  var ORIGINS = [
    {
      id: "eng",
      name: "Enginyeria & Tech",
      sub: "Sou 1.850€/m · Desp. 1.120€/m · Capital +3.200€",
      desc: "Alt potencial d'escalada salarial global, però amb risc elevat de desgast mental.",
      baseSalary: 1850,
      expenses: 1120,
      liquidAssets: 3200,
      personalDebt: 0,
      skills: 24,
      health: 82,
      joy: 74,
      alloc: { cash: 20, bonds: 0, index: 60, dividend: 0, reits: 20, venture: 0 }
    },
    {
      id: "salut",
      name: "Ciències de la Salut / Recerca",
      sub: "Sou 1.550€/m · Desp. 1.040€/m · Capital +2.400€",
      desc: "Inici exigent d'estudis i guàrdies amb gran estabilitat i salt retributiu madur.",
      baseSalary: 1550,
      expenses: 1040,
      liquidAssets: 2400,
      personalDebt: 0,
      skills: 26,
      health: 88,
      joy: 78,
      alloc: { cash: 20, bonds: 20, index: 40, dividend: 20, reits: 0, venture: 0 }
    },
    {
      id: "ofici",
      name: "Ofici Tècnic Autònom al Poble",
      sub: "Sou 1.780€/m · Desp. 860€/m · Capital +7.500€",
      desc: "Cost de vida baix des dels 18 anys i traça pràctica per reformar immobles.",
      baseSalary: 1780,
      expenses: 860,
      liquidAssets: 7500,
      personalDebt: 0,
      skills: 22,
      health: 86,
      joy: 80,
      alloc: { cash: 20, bonds: 0, index: 40, dividend: 20, reits: 20, venture: 0 }
    },
    {
      id: "crea",
      name: "Disseny, Contingut & Digital",
      sub: "Sou 1.420€/m · Desp. 990€/m · Capital +1.800€",
      desc: "Ingressos inicials modestos compensats amb agilitat per llançar productes propis.",
      baseSalary: 1420,
      expenses: 990,
      liquidAssets: 1800,
      personalDebt: 0,
      skills: 20,
      health: 85,
      joy: 86,
      alloc: { cash: 40, bonds: 0, index: 40, dividend: 0, reits: 0, venture: 20 }
    },
    {
      id: "opos",
      name: "Funció Pública + Inversió",
      sub: "Sou 1.680€/m · Desp. 1.000€/m · Capital +4.500€",
      desc: "Feina blindada davant recessions, horari intensiu i constància d'interès compost.",
      baseSalary: 1680,
      expenses: 1000,
      liquidAssets: 4500,
      personalDebt: 0,
      skills: 21,
      health: 87,
      joy: 81,
      alloc: { cash: 20, bonds: 20, index: 40, dividend: 0, reits: 20, venture: 0 }
    },
    {
      id: "deute",
      name: "Repte: Espiral de Crèdit (9% TAE)",
      sub: "Sou 1.620€/m · Desp. 1.440€/m · Net -9.500€",
      desc: "Atrapats als 18 anys amb microcrèdits i lletres al 9% TAE. Sortiràs del pou?",
      baseSalary: 1620,
      expenses: 1440,
      liquidAssets: 1500,
      personalDebt: 11000,
      skills: 14,
      health: 76,
      joy: 66,
      alloc: { cash: 60, bonds: 0, index: 20, dividend: 0, reits: 0, venture: 20 }
    }
  ];

  var REGIMES = [
    { id: "calm", label: "Expansió Suau · Infl. 2%", rCash: 0.025, rBonds: 0.036, rIdx: 0.092, rDiv: 0.078, rReits: 0.072, rVen: 0.14, reApprec: 0.032, inf: 0.02 },
    { id: "bull", label: "Mercat Alcista & IA", rCash: 0.022, rBonds: 0.028, rIdx: 0.165, rDiv: 0.115, rReits: 0.085, rVen: 0.38, reApprec: 0.052, inf: 0.025 },
    { id: "infl", label: "Inflació 6% · Tipus 4,5%", rCash: 0.041, rBonds: -0.025, rIdx: 0.025, rDiv: 0.055, rReits: 0.095, rVen: -0.18, reApprec: 0.048, inf: 0.056 },
    { id: "crash", label: "Crac Borsari (-25%)", rCash: 0.028, rBonds: 0.052, rIdx: -0.24, rDiv: -0.13, rReits: -0.09, rVen: -0.46, reApprec: -0.055, inf: 0.012 },
    { id: "recov", label: "Rebot Post-Crisi", rCash: 0.02, rBonds: 0.042, rIdx: 0.205, rDiv: 0.14, rReits: 0.115, rVen: 0.31, reApprec: 0.045, inf: 0.022 },
    { id: "defl", label: "Fre Econòmic · Bons Forts", rCash: 0.018, rBonds: 0.064, rIdx: 0.032, rDiv: 0.048, rReits: 0.025, rVen: -0.08, reApprec: 0.008, inf: 0.01 }
  ];

  var BUCKETS = [
    { k: "cash", name: "Liquiditat Remunerada", meta: "Coixí segur · ~2–4% · Evita malvendre" },
    { k: "bonds", name: "Renda Fixa / Bons Estatals", meta: "Estabilitat · ~3–6% · Escut en recessió" },
    { k: "index", name: "Indexats Globals MSCI World", meta: "Motor compost · ~9% llarg termini" },
    { k: "dividend", name: "Dividends Aristòcrates", meta: "Renda sòlida · ~7–8% · Menys caiguda" },
    { k: "reits", name: "SOCIMIs & Or Físic", meta: "Actiu real · ~7% · Cobertura d'inflació" },
    { k: "venture", name: "Alt Risc / Startups & Cripto", meta: "Asimètric · +38% o -46% en cracs" }
  ];

  var CAREER_RANKS = [
    { level: 0, title: "Júnior / Aprenent", minSkills: 0 },
    { level: 1, title: "Oficial / Tècnic", minSkills: 28 },
    { level: 2, title: "Especialista", minSkills: 42 },
    { level: 3, title: "Sènior Consolidat", minSkills: 56 },
    { level: 4, title: "Líder / Principal", minSkills: 70 },
    { level: 5, title: "Direcció / Soci", minSkills: 84 },
    { level: 6, title: "Referent / Càtedra", minSkills: 96 }
  ];

  var WORK_MODES = [
    { id: "full", label: "100% Jornada", shortLabel: "100%", salMult: 1.0, dHealth: 0, dJoy: 0, countsWork: true },
    { id: "intense", label: "Intensiva + Bonus", shortLabel: "Intensiva", salMult: 1.24, dHealth: -3, dJoy: -3, countsWork: true },
    { id: "fourday", label: "4 Dies / Setmana", shortLabel: "4 Dies", salMult: 0.84, dHealth: 3, dJoy: 4, countsWork: true },
    { id: "sabbatical", label: "Excedència Sabàtica", shortLabel: "Sabàtic", salMult: 0.0, dHealth: 9, dJoy: 11, countsWork: false },
    { id: "retired", label: "Jubilat / FIRE", shortLabel: "FIRE/Jub.", salMult: 0.0, dHealth: 4, dJoy: 7, countsWork: false }
  ];

  var COURSES = [
    {
      id: "angles_c1",
      name: "Anglès C1 per a Teletreball Global",
      cost: 1400,
      sub: "1.400 € · Skills +12 · Sou base +12%",
      skillsBonus: 12,
      salPctBonus: 12,
      sideBonus: 0,
      flag: "hasEnglishC1",
      rankUp: 0
    },
    {
      id: "curs_reforma",
      name: "Curs de Reforma d'Immobles",
      cost: 1900,
      sub: "1.900 € · Skills +8 · -8% cost compra pisos",
      skillsBonus: 8,
      salPctBonus: 0,
      sideBonus: 40,
      flag: "rehabSkill",
      rankUp: 0
    },
    {
      id: "ia_auto",
      name: "Certificació IA & Automatització",
      cost: 2400,
      sub: "2.400 € · Skills +14 · Sou +14% · +90€/m",
      skillsBonus: 14,
      salPctBonus: 14,
      sideBonus: 90,
      flag: "hasCertIA",
      rankUp: 0
    },
    {
      id: "marca_pers",
      name: "Marca Personal & Consultoria",
      cost: 2800,
      sub: "2.800 € · Skills +10 · Renda +240€/m",
      skillsBonus: 10,
      salPctBonus: 4,
      sideBonus: 240,
      flag: "hasBrand",
      rankUp: 0
    },
    {
      id: "taller_saas",
      name: "Taller / SaaS de Cap de Setmana",
      cost: 4200,
      sub: "4.200 € · Skills +12 · Renda +380€/m",
      skillsBonus: 12,
      salPctBonus: 0,
      sideBonus: 380,
      flag: "hasSideBiz",
      rankUp: 0
    },
    {
      id: "master_quant",
      name: "Màster Financer / Quant",
      cost: 6800,
      sub: "6.800 € · Skills +18 · Sou +18% · +0,6% cartera",
      skillsBonus: 18,
      salPctBonus: 18,
      sideBonus: 0,
      flag: "quantMaster",
      rankUp: 0
    },
    {
      id: "lideratge_exec",
      name: "Programa Executiu de Direcció",
      cost: 9500,
      sub: "9.500 € · Skills +20 · Sou +24% · +1 Rang",
      skillsBonus: 20,
      salPctBonus: 24,
      sideBonus: 0,
      flag: "execLeader",
      rankUp: 1
    },
    {
      id: "trust_fiscal",
      name: "Holding & Pacte Successori (92%)",
      cost: 12000,
      sub: "12.000 € · Skills +8 · Dinastia hereta el 92%",
      skillsBonus: 8,
      salPctBonus: 0,
      sideBonus: 110,
      flag: "trustPlan",
      rankUp: 0
    }
  ];

  var PROPERTIES = [
    { id: "parking", name: "Plaça de Pàrquing Cèntrica", basePrice: 14000, baseRent: 95, baseExp: 14, desc: "Manteniment gairebé nul" },
    { id: "estudi", name: "Estudi Universitari", basePrice: 85000, baseRent: 560, baseExp: 75, desc: "Alta demanda tot el curs" },
    { id: "comarca", name: "Pis per Reformar a Comarca", basePrice: 118000, baseRent: 760, baseExp: 95, desc: "Rendibilitat bruta elevada" },
    { id: "pirineus", name: "Casa de Poble als Pirineus", basePrice: 145000, baseRent: 940, baseExp: 135, desc: "Refugi climàtic i lloguer" },
    { id: "local", name: "Local Comercial Cantonada", basePrice: 165000, baseRent: 1120, baseExp: 140, desc: "Contracte llarg de comerç" },
    { id: "familiar", name: "Pis Familiar Urbà", basePrice: 215000, baseRent: 1180, baseExp: 155, desc: "Inquilins estables i solvents" },
    { id: "edifici", name: "Edifici de 3 Apartaments", basePrice: 390000, baseRent: 2450, baseExp: 330, desc: "Escala patrimonial mitjana" },
    { id: "nau", name: "Nau Logística Comarcal", basePrice: 520000, baseRent: 3450, baseExp: 420, desc: "Renda industrial de gran tonatge" }
  ];

  var ACHIEVEMENTS = [
    { id: "first_10k", title: "Primers 10.000 €", desc: "Supera els 10k € de patrimoni net." },
    { id: "club_100k", title: "Club dels 100k €", desc: "Assoleix la barrera mítica dels 100.000 €." },
    { id: "half_mil", title: "Mig Milió Serè", desc: "Arriba als 500.000 € de patrimoni net." },
    { id: "millionaire", title: "Patrimoni d'1 Milió", desc: "Consolida un patrimoni d'1.000.000 €." },
    { id: "fat_fire", title: "Fat FIRE (>1,5M €)", desc: "Supera 1,5M € amb el 100% FIRE cobert." },
    { id: "coast_fire", title: "Coast FIRE", desc: "Arriba al 50% FIRE abans dels 40 anys." },
    { id: "lean_fire_40", title: "Lean FIRE <40a", desc: "Assolir el 100% FIRE abans dels 40 anys." },
    { id: "debt_slayer", title: "Escapat del Deute", desc: "De l'origen Crèdit (-9,5k €) a +100k € nets." },
    { id: "first_brick", title: "Primer Maó", desc: "Compra el teu primer immoble directe." },
    { id: "rent_lord_3", title: "3 Immobles en Renda", desc: "Mantén 3 o més immobles en propietat." },
    { id: "mortgage_free", title: "Lliure d'Hipoteques", desc: "2+ immobles pagats amb 0 € de deute." },
    { id: "real_tycoon", title: "Baró Immobiliari", desc: "Acumula 5 o més immobles directes." },
    { id: "polymath", title: "Polímata Incansable", desc: "Completa 5 formacions a Carrera." },
    { id: "side_hustler", title: "Renda Lateral Sòlida", desc: "Genera 600 €/mes o més en projectes propis." },
    { id: "crisis_master", title: "Mestre de les Crisis", desc: "Viu 4 cracs borsaris i supera els 300k €." },
    { id: "iron_health_80", title: "Salut de Ferro 80a", desc: "Arriba a 80a amb Salut ≥80 i Goig ≥80." },
    { id: "full_life_85", title: "Saviesa dels 85 Anys", desc: "Completa una vida sencera fins als 85 anys." },
    { id: "dynasty_gen2", title: "Dinastia: Gen 2", desc: "Inicia la 2a Generació amb un fill o filla." },
    { id: "dynasty_gen3", title: "Nissaga Gen 3", desc: "Arriba a la 3a Generació de la dinastia." },
    { id: "dynasty_empire", title: "Imperi Dinàstic", desc: "Supera els 5.000.000 € de patrimoni net." }
  ];

  // ==================== 114+ ESDEVENIMENTS D'AUTOR I CADENES VITALS ====================
  var EVENTS = [
    // --- DÈCADA 18-24: EMANCIPACIÓ, HÀBITS INICIALS I FORMACIÓ (18 esdeveniments) ---
    {
      id: "ev_18_first_pay", minAge: 18, maxAge: 21, tag: "PRIMER SOU",
      title: "La primera nòmina i la regla de pagar-se primer",
      body: "Cobres el teu primer ingrés seriós als 18 anys. Els amics planegen cremar-ho tot en roba, concerts i sopars.",
      opts: [
        { k: "A", t: "Automatitzar el 25% d'estalvi el dia 1 de cada mes", s: "+1.200 € · Skills +4 · Goig +2", fn: function (st, rng, api) { api.cash(1200); api.stats(0, 2, 4); return "Automatitzar l'estalvi abans de veure els diners al compte corrent canvia tota la teva trajectòria."; } },
        { k: "B", t: "Guardar la meitat i celebrar l'altra meitat amb la colla", s: "+600 € · Goig +8", fn: function (st, rng, api) { api.cash(600); api.stats(1, 8, 2); return "Brindes amb els amics sense descuidar el teu primer coixí de seguretat."; } },
        { k: "C", t: "Gastar-ho tot i finançar un mòbil d'última gamma", s: "-1.100 € · Desp. +45€/m · Goig +5", fn: function (st, rng, api) { api.cash(-1100); api.exp(45); api.stats(0, 5, 0); return "Estrenes telèfon brillant, però afegeixes una quota innecessària al teu mes."; } }
      ]
    },
    {
      id: "ev_18_shared_flat", minAge: 18, maxAge: 24, tag: "HABITATGE JOVE",
      title: "Habitació assolellada o estudi en solitari?",
      body: "Vols guanyar autonomia. Un pis compartit amb gent endreçada costa molt menys que llogar un estudi petit tot sol.",
      opts: [
        { k: "A", t: "Compartir pis ben situat i dividir subministraments", s: "Despesa -160€/m · Goig +6", fn: function (st, rng, api) { api.exp(-160); api.stats(1, 6, 2); return "Conviure amb bons companys t'estalvia gairebé 2.000 € l'any i et fa fer amics per sempre."; } },
        { k: "B", t: "Llogar l'estudi individual per tenir silenci absolut", s: "Despesa +190€/m · Salut +4 · Goig +5", fn: function (st, rng, api) { api.exp(190); api.stats(4, 5, 2); return "Gaudeixes d'una pau immensa, tot i que el lloguer es menja bona part del sou jove."; } },
        { k: "C", t: "Quedar-te un parell d'anys més a casa aportant una quota", s: "+2.600 € estalviats · Goig -3", fn: function (st, rng, api) { api.cash(2600); api.stats(2, -3, 1); return "Sacrifiques una mica d'intimitat per acumular un coixí inicial formidable."; } }
      ]
    },
    {
      id: "ev_19_summer_abroad", minAge: 18, maxAge: 23, tag: "CAPITAL HUMÀ",
      title: "Estiu de feina a Europa o platja al poble",
      body: "Surt l'opció de treballar tres mesos d'estiu a Munic o Amsterdam cobrant força bé i practicant idiomes.",
      opts: [
        { k: "A", t: "Marxar tot l'estiu, treballar dur i practicar l'idioma", s: "+2.900 € · Skills +7 · Salut -2", fn: function (st, rng, api) { api.cash(2900); api.stats(-2, 5, 7); return "Tornes al setembre amb la ment oberta, l'anglès fluït i gairebé tres mil euros nets."; } },
        { k: "B", t: "Treballar mitja jornada a prop i descansar a la tarda", s: "+1.100 € · Salut +5 · Goig +7", fn: function (st, rng, api) { api.cash(1100); api.stats(5, 7, 3); return "Combines feina lleugera amb banys de mar i migdiades reparadores."; } },
        { k: "C", t: "Fer ruta d'Interrail gastant estalvis per veure món", s: "-1.650 € · Goig +14 · Salut +4", fn: function (st, rng, api) { api.cash(-1650); api.stats(4, 14, 2); return "Dormir en trens nocturns i recórrer vuit països et deixa records imborrables."; } }
      ]
    },
    {
      id: "ev_19_cooking_batch", minAge: 18, maxAge: 26, tag: "HÀBITS QUOTIDIANS",
      title: "Fiambrera casolana contra menjar a domicili",
      body: "Entre setmana és molt fàcil demanar sopars per aplicació i dinar de menú cada migdia sense adonar-te de la factura.",
      opts: [
        { k: "A", t: "Aprendre a cuinar diumenge (batch cooking) amb mercat fresc", s: "Despesa -125€/m · Salut +9 · Skills +2", fn: function (st, rng, api) { api.exp(-125); api.stats(9, 4, 2); return "Menges oli d'oliva, llegums i verdura de temporada estalviant 1.500 € cada any."; } },
        { k: "B", t: "Alternar menú de migdia amb sopars senzills a casa", s: "Equilibri neutre · Goig +3", fn: function (st, rng, api) { api.stats(2, 3, 0); return "Mantens la comoditat social dels dinars sense excessos nocturns."; } },
        { k: "C", t: "Seguir tirant de repartidors i cafeteries de moda", s: "Despesa +135€/m · Salut -5 · Goig +4", fn: function (st, rng, api) { api.exp(135); api.stats(-5, 4, 0); return "Comoditat màxima avui, però la butxaca i les analítiques ho noten."; } }
      ]
    },
    {
      id: "ev_20_used_scooter", minAge: 18, maxAge: 25, tag: "MOBILITAT",
      title: "Desplaçament diari al polígon o facultat",
      body: "Perds una hora i mitja en transbords. Pots comprar una bicicleta elèctrica, una moto d'ocasió o finançar un cotxe.",
      opts: [
        { k: "A", t: "Bicicleta elèctrica plegable + abonament de tren", s: "-1.150 € · Desp. -65€/m · Salut +8", fn: function (st, rng, api) { api.cash(-1150); api.exp(-65); api.stats(8, 5, 0); return "Arribes despert, fas exercici suau i oblides benzina, pàrquings i assegurances."; } },
        { k: "B", t: "Escúter 125cc de segona mà revisat al comptat", s: "-2.300 € · Estalvi de temps · Goig +6", fn: function (st, rng, api) { api.cash(-2300); api.exp(25); api.stats(0, 6, 1); return "Guanyes quaranta minuts diaris per estudiar o descansar sense endeutar-te."; } },
        { k: "C", t: "Cotxe compacte amb finançament multiopció", s: "-2.000 € · Desp. +240€/m · Goig +5", fn: function (st, rng, api) { api.cash(-2000); api.exp(240); api.stats(0, 5, 0); return "Vas còmode quan plou, però la lletra i l'assegurança llasten la teva dècada dels vint."; } }
      ]
    },
    {
      id: "ev_20_index_discovery", minAge: 19, maxAge: 26, tag: "EDUCACIÓ FINANCERA",
      title: "Un llibre de Bogle i l'efecte de les comissions",
      body: "Llegeixes per primer cop que una comissió bancària de l'1,8% anual es menja gairebé el 40% del patrimoni en 30 anys.",
      opts: [
        { k: "A", t: "Obrir cartera d'indexats de baix cost (0,15% TER) i aportar-hi ja", s: "+900 € · Skills +6", fn: function (st, rng, api) { api.cash(900); api.stats(0, 4, 6); return "Descobrir l'interès compost als vint anys val literalment centenars de milers d'euros futurs."; } },
        { k: "B", t: "Deixar els diners al dipòsit del banc tradicional de sempre", s: "Seguretat · Skills +1", fn: function (st, rng, api) { api.stats(0, 1, 1); return "Evites la volatilitat, tot i que la inflació va rosegant el poder de compra."; } },
        { k: "C", t: "Provar sort fent trading intradia amb palanquejament", s: "Alt risc d'aprenentatge car", fn: function (st, rng, api) { if (rng() < 0.25) { api.cash(2800); return "Tanques un parell d'operacions amb sort (+2.800 €) i retires fitxes a temps."; } api.cash(-1900); api.stats(-3, -6, 2); return "Els algorismes et desplomen el compte (-1.900 €), però n'aprens la lliçó per a tota la vida."; } }
      ]
    },
    {
      id: "ev_21_mentor_internship", minAge: 19, maxAge: 25, tag: "CARRERA",
      title: "Beca amb un mestre de l'ofici o feina rutinària ben pagada",
      body: "Tens dues ofertes: un equip punter on aprendràs moltíssim cobrant justet un any, o un lloc mecànic que paga més avui.",
      opts: [
        { k: "A", t: "Aprendre al costat dels millors pensant a cinc anys vista", s: "Skills +11 · Sou base +11%", fn: function (st, rng, api) { api.salPct(11); api.stats(0, 5, 11); return "Absorbeixes mètode, contactes i criteri que multipliquen el teu valor professional."; } },
        { k: "B", t: "Agafar la feina mecànica ben pagada i estalviar el sobrant", s: "+2.400 € · Goig -2", fn: function (st, rng, api) { api.cash(2400); api.stats(0, -2, 2); return "Engreixes el compte bancari ràpidament, encara que les tardes es fan repetitives."; } },
        { k: "C", t: "Negociar mitja jornada a l'equip punter i projectes pel teu compte", s: "+800 € · Skills +8 · Renda +60€/m", fn: function (st, rng, api) { api.cash(800); api.side(60); api.stats(-2, 4, 8); return "Combines mentoria de qualitat amb els teus primers encàrrecs propis."; } }
      ]
    },
    {
      id: "ev_21_dental_wisdom", minAge: 19, maxAge: 27, tag: "SALUT PREVENTIVA",
      title: "Queixals del seny i revisió bucodental",
      body: "Et molesta la mandíbula però encara és suportable. Arreglar-ho bé ara costa diners; deixar-ho córrer pot complicar-se.",
      opts: [
        { k: "A", t: "Fer l'extracció i higiene completa immediatament", s: "-680 € · Salut +9 · Goig +3", fn: function (st, rng, api) { api.cash(-680); api.stats(9, 3, 0); return "En salut bucodental, cada euro preventiu n'estalvia deu en urgències futures."; } },
        { k: "B", t: "Esperar a la llista pública cuidant molt la higiene", s: "-90 € · Salut +4", fn: function (st, rng, api) { api.cash(-90); api.stats(4, 0, 0); return "Paciència de mesos amb analgèsics puntuals, però resols el tràmit gairebé sense despesa."; } },
        { k: "C", t: "Ignorar-ho per no tocar els estalvis", s: "Risc d'infecció (-1.450 € si es complica)", fn: function (st, rng, api) { if (rng() < 0.7) { api.cash(-1450); api.stats(-8, -7, 0); return "Acabes d'urgències amb infecció i endodòncia cara (-1.450 €)."; } api.stats(-3, -2, 0); return "La molèstia remet de moment, però segueix latent."; } }
      ]
    },
    {
      id: "ev_22_festival_friends", minAge: 19, maxAge: 26, tag: "VIDA SOCIAL",
      title: "Festivals d'estiu i pressió de grup",
      body: "La colla vol anar a tres festivals seguits amb abonament VIP i hotels cars (1.900 €). A tu te'n fa il·lusió sobretot un.",
      opts: [
        { k: "A", t: "Anar només al festival que t'encanta i proposar acampada a la costa", s: "-450 € · Goig +10 · Salut +3", fn: function (st, rng, api) { api.cash(-450); api.stats(3, 10, 1); return "Aprens a dir «a aquest sí, als altres no» sense perdre ni l'amistat ni el pressupost."; } },
        { k: "B", t: "Apuntar-t'ho a tot per por de perdre't res (FOMO)", s: "-1.900 € · Goig +12 · Salut -4", fn: function (st, rng, api) { api.cash(-1900); api.stats(-4, 12, 0); return "Ho passes d'allò més bé, tot i acabar l'agost esgotat i amb el compte tiritant."; } },
        { k: "C", t: "Treballar a la barra d'un dels festivals amb acreditació lliure", s: "+550 € · Goig +7 · Salut -2", fn: function (st, rng, api) { api.cash(550); api.stats(-2, 7, 2); return "Escoltes els concerts de nit, fas pinya a la barra i tornes cobrant!"; } }
      ]
    },
    {
      id: "ev_22_emergency_fund", minAge: 20, maxAge: 28, tag: "FONAMENTS",
      title: "S'espatlla la rentadora i el portàtil la mateixa setmana",
      body: "La llei de Murphy colpeja un dimarts plujós: necessites substituir l'eina de treball i reparar l'electrodomèstic.",
      opts: [
        { k: "A", t: "Comprar portàtil professional reacondicionat amb garantia i reparar la peça", s: "-780 € · Skills +3", fn: function (st, rng, api) { api.cash(-780); api.stats(0, 3, 3); return "Un equip empresarial reacondicionat i un recanvi de 40 € resolen la crisi amb elegància."; } },
        { k: "B", t: "Comprar-ho tot nou d'alta gamma per oblidar problemes", s: "-2.250 € · Goig +5", fn: function (st, rng, api) { api.cash(-2250); api.stats(0, 5, 2); return "Material impecable per a molts anys, a canvi d'una bona mossegada a la caixa."; } },
        { k: "C", t: "Pagar a terminis amb targeta revolving del centre comercial", s: "-400 € avui · Desp. +95€/m · Goig -4", fn: function (st, rng, api) { api.cash(-400); api.exp(95); api.stats(-2, -4, 0); return "Els interessos ocults del crèdit ràpid encareixen la compra gairebé el doble."; } }
      ]
    },
    {
      id: "ev_23_public_library", minAge: 18, maxAge: 30, tag: "CULTURA & CALMA",
      title: "La biblioteca municipal i el club d'escacs i lectura",
      body: "Descobreixes que a deu minuts de casa tens premsa econòmica, llibres, sales fresques a l'estiu i gent interessant de franc.",
      opts: [
        { k: "A", t: "Fer-te'n habitual cada setmana i cancel·lar 3 plataformes", s: "Despesa -45€/m · Goig +8 · Skills +5", fn: function (st, rng, api) { api.exp(-45); api.stats(3, 8, 5); return "Canvies l'scroll passiu per lectura profunda i converses que t'enriqueixen."; } },
        { k: "B", t: "Anar-hi puntualment els dissabtes al matí", s: "Goig +4 · Skills +2", fn: function (st, rng, api) { api.stats(1, 4, 2); return "Un petit refugi setmanal de silenci i bons llibres."; } },
        { k: "C", t: "Comprar llibres nous en paper compulsivament sense llegir-los tots", s: "-380 € · Goig +3", fn: function (st, rng, api) { api.cash(-380); api.stats(0, 3, 1); return "La prestatgeria fa molt de goig, encara que la pila de pendents no para de créixer."; } }
      ]
    },
    {
      id: "ev_23_first_negotiation", minAge: 21, maxAge: 28, tag: "CARRERA",
      title: "Revisió anual després de salvar un projecte crític",
      body: "Has assumit responsabilitats molt per sobre de la teva categoria. L'empresa t'ofereix una pujada simbòlica del 3%.",
      opts: [
        { k: "A", t: "Presentar mètriques d'impacte i demanar un +16% amb calma ferma", s: "Sou base +16% · Skills +4", fn: function (st, rng, api) { api.salPct(16); api.stats(-1, 6, 4); return "Quan portes dades clares i alternatives, la direcció accepta reconèixer la teva vàlua."; } },
        { k: "B", t: "Acceptar el 3% a canvi de divendres a la tarda lliures i formació pagada", s: "Sou +3% · Skills +8 · Goig +7", fn: function (st, rng, api) { api.salPct(3); api.stats(3, 7, 8); return "Transformes l'energia negociadora en temps de qualitat i certificacions pagades."; } },
        { k: "C", t: "Callar per evitar incomoditat i queixar-te al cafè", s: "Goig -6 · Salut -2", fn: function (st, rng, api) { api.stats(-2, -6, 0); return "Qui no negocia amb respecte perd desenes de milers d'euros acumulats al llarg de la vida."; } }
      ]
    },
    {
      id: "ev_24_mountain_sport", minAge: 18, maxAge: 34, tag: "SALUT & NATURA",
      title: "Centre esportiu d'elit o grup d'excursionisme i cal·listènia",
      body: "Vols posar-te fort i guanyar resistència cardiovascular abans dels 30 anys.",
      opts: [
        { k: "A", t: "Barres al parc, córrer i cims cada diumenge amb amics", s: "-120 € botes · Salut +12 · Goig +9", fn: function (st, rng, api) { api.cash(-120); api.stats(12, 9, 1); return "Sol, desnivell i força amb el propi pes: salut de ferro per gairebé zero euros."; } },
        { k: "B", t: "Gimnàs complet al costat de la feina per no fallar mai", s: "Despesa +58€/m · Salut +11 · Goig +5", fn: function (st, rng, api) { api.exp(58); api.stats(11, 5, 0); return "La proximitat venç la mandra: hi vas tres cops per setmana religiosament."; } },
        { k: "C", t: "Pagar quota anual d'oferta i deixar d'anar-hi al febrer", s: "-520 € · Salut -3", fn: function (st, rng, api) { api.cash(-520); api.stats(-3, -2, 0); return "Subvencions el gimnàs com el 70% de matrícules de gener."; } }
      ]
    },
    {
      id: "ev_24_debt_snowball", minAge: 18, maxAge: 32, tag: "SANEJAMENT",
      title: "Auditoria radical de rebuts, comissions i deutes",
      body: "Dediques un diumenge de pluja a revisar totes les línies de l'extracte bancari: assegurances duplicades, tarifes velles i interessos.",
      opts: [
        { k: "A", t: "Renegociar fibra, llum i assegurances d'una tacada", s: "Despesa -85€/m · Skills +4", fn: function (st, rng, api) { api.exp(-85); api.stats(1, 5, 4); return "Tres trucades de vint minuts t'estalvien més de 1.000 € nets cada any!"; } },
        { k: "B", t: "Vendre trastos que no uses a segona mà i eixugar deute/invertir", s: "+950 € nets · Goig +5", fn: function (st, rng, api) { api.cash(950); api.stats(0, 5, 2); return "Alliberes espai als armaris i converteixes pols acumulada en capital viu."; } },
        { k: "C", t: "Tancar l'Excel perquè et fa mandra trucar a companyies", s: "Sense canvis · Goig -1", fn: function (st, rng, api) { api.stats(0, -1, 0); return "La inèrcia comercial continua gotejant euros silenciosament."; } }
      ]
    },
    {
      id: "ev_24_freelance_weekend", minAge: 20, maxAge: 29, tag: "INGRÉS EXTRA",
      title: "Un conegut necessita ajuda tècnica urgent per a una web i facturació",
      body: "Un comerç artesà del barri vol digitalitzar comandes abans de la campanya de Nadal i et proposa pagar-te per projecte.",
      opts: [
        { k: "A", t: "Fer el projecte impecable i pactar quota de manteniment mensual", s: "+1.400 € · Renda +85€/m · Skills +5", fn: function (st, rng, api) { api.cash(1400); api.side(85); api.stats(-2, 5, 5); return "Entregues a temps i guanyes tant el pagament inicial com una petita renda recurrent."; } },
        { k: "B", t: "Cobrar 1.800 € tancats sense manteniment posterior", s: "+1.800 € · Skills +3", fn: function (st, rng, api) { api.cash(1800); api.stats(-1, 4, 3); return "Factures l'encàrrec netament i conserves tots els caps de setmana futurs."; } },
        { k: "C", t: "Passar el contacte a un amic a canvi d'una petita comissió", s: "+300 € · Goig +3", fn: function (st, rng, api) { api.cash(300); api.stats(1, 3, 1); return "Ajudes dues persones alhora sense carregar la teva agenda."; } }
      ]
    },
    {
      id: "ev_24_roommate_startup", minAge: 19, maxAge: 26, tag: "OPORTUNITAT",
      title: "La proposta esbojarrada del company d'estudis",
      body: "Un company brillant però caòtic et convida a posar 2.500 € i hores en una aplicació de logística local.",
      opts: [
        { k: "A", t: "Aportar treball pactat per un 15% d'accions sense arriscar estalvis", s: "Risc zero d'euros · Possible premi", fn: function (st, rng, api) { if (rng() < 0.35) { api.cash(6500); api.stats(-3, 8, 6); return "L'app es ven a un grup regional i cobres 6.500 € per la teva participació!"; } api.stats(-2, 2, 5); return "El projecte no escala, però aprens moltíssim de producte sense perdre ni un euro."; } },
        { k: "B", t: "Invertir-hi els 2.500 € i anar a totes", s: "Aposta d'alt voltatge", fn: function (st, rng, api) { if (rng() < 0.32) { api.cash(14000); api.stats(-4, 12, 6); return "Encerteu el nínxol de ple i multipliques la inversió (+14.000 €)!"; } api.cash(-2500); api.stats(-3, -5, 3); return "El soci es cansa als sis mesos i es fumen els 2.500 €."; } },
        { k: "C", t: "Desitjar-li sort i centrar-te en la teva pròpia carrera", s: "Salut +3 · Skills +3", fn: function (st, rng, api) { api.stats(3, 2, 3); return "Prioritzes consolidar la teva base professional amb pas ferm."; } }
      ]
    },
    {
      id: "ev_24_sleep_mattress", minAge: 20, maxAge: 32, tag: "DESCANS",
      title: "El matalàs enfonsat del pis de lloguer",
      body: "Et lleves cada dia amb les lumbars carregades perquè el matalàs té quinze anys. Passem un terç de la vida dormint.",
      opts: [
        { k: "A", t: "Comprar un bon matalàs ferm i coixí ergonòmic teus", s: "-650 € · Salut +10 · Goig +7", fn: function (st, rng, api) { api.cash(-650); api.stats(10, 7, 0); return "Dormir profundament vuit hores dispara la teva energia, humor i claredat mental."; } },
        { k: "B", t: "Negociar amb el propietari pagar-lo a mitges", s: "-320 € · Salut +9 · Goig +6", fn: function (st, rng, api) { api.cash(-320); api.stats(9, 6, 2); return "Amb una trucada amable aconsegueixes que la propietat n'assumeixi la meitat!"; } },
        { k: "C", t: "Aguantar amb un sobre-matalàs barat", s: "-70 € · Salut -3", fn: function (st, rng, api) { api.cash(-70); api.stats(-3, -2, 0); return "Estalvies poc i les cervicals t'ho recorden cada matí."; } }
      ]
    },
    {
      id: "ev_24_tax_withholding", minAge: 19, maxAge: 27, tag: "FISCALITAT JOVE",
      title: "Dues empreses pagadores en un mateix any fiscal",
      body: "Has canviat de feina a mig any i la segona empresa t'aplica una retenció d'IRPF massa baixa a la nòmina.",
      opts: [
        { k: "A", t: "Demanar ajustar l'IRPF i apartar la diferència en compte remunerat", s: "+350 € interessos · Zero ensurts · Skills +3", fn: function (st, rng, api) { api.cash(350); api.stats(0, 4, 3); return "Quan arriba la campanya de la Renda ja tens els diners preparats i n'has cobrat interessos."; } },
        { k: "B", t: "Gastar la nòmina alta pensant que cobres més del real", s: "-1.650 € de cop al juny · Goig -6", fn: function (st, rng, api) { api.cash(-1650); api.stats(-1, -6, 1); return "Patacada clàssica de juny quan surt la declaració a pagar de cop."; } },
        { k: "C", t: "Aportar a un pla o deducció autonòmica jove abans del 31 de desembre", s: "+480 € estalvi fiscal net", fn: function (st, rng, api) { api.cash(480); api.stats(0, 3, 3); return "Aprofites les deduccions legals vigents abans de tancar l'exercici."; } }
      ]
    },

    // --- CADENA 1: PARELLA -> CONVIVÈNCIA -> CRIANÇA -> NÉTS (9 esdeveniments encadenats + monoparental) ---
    {
      id: "ch_fam_1_partner", minAge: 22, maxAge: 38, noFlag: "hasPartner", tag: "VIDA & PARELLA [1/8]",
      title: "Una complicitat inesperada en una caminada de tardor",
      body: "Coneixes algú amb sentit de l'humor, curiositat vital i serenor. Les converses s'allarguen fins tard sense mirar el mòbil.",
      opts: [
        { k: "A", t: "Cuidar el vincle amb cites autèntiques i converses honestes de futur", s: "Parella estable · Goig +14 · Salut +4", fn: function (st, rng, api) { st.flags.hasPartner = true; api.cash(-350); api.stats(4, 14, 1); return "Construïu una relació sòlida basada en confiança, tendresa i projecte compartit."; } },
        { k: "B", t: "Deixar-te portar per escapades cares cada cap de setmana", s: "Parella · -2.400 € · Goig +15", fn: function (st, rng, api) { st.flags.hasPartner = true; api.cash(-2400); api.stats(2, 15, 0); return "Un primer any de pel·lícula recorrent cales i hotels amb encant."; } },
        { k: "C", t: "Prioritzar ara mateix la solteria i el teu camí independent", s: "Solteria conscient · Skills +4 · Goig +3", fn: function (st, rng, api) { api.stats(2, 3, 4); return "Decideixes que encara vols uns anys de llibertat absoluta d'horaris."; } }
      ]
    },
    {
      id: "ch_fam_2_cohabit", minAge: 24, maxAge: 42, reqFlag: "hasPartner", noFlag: "cohabiting", tag: "CONVIVÈNCIA [2/8]",
      title: "Un sol joc de claus i comptes transparents",
      body: "Feu el pas de viure plegats. És el moment de decidir com repartiu lloguer/hipoteca, estalvi i capritxos individuals.",
      opts: [
        { k: "A", t: "Compte comú proporcional per a despeses fixes i carteres pròpies clares", s: "Despesa -240€/m · Goig +12 · Skills +3", fn: function (st, rng, api) { st.flags.cohabiting = true; api.exp(-240); api.stats(3, 12, 3); return "Compartir sostre i parlar de diners sense tabús redueix despeses i evita friccions."; } },
        { k: "B", t: "Mudar-vos a un pis més gran amb terrassa assolellada", s: "Despesa +180€/m · Goig +14 · Salut +3", fn: function (st, rng, api) { st.flags.cohabiting = true; api.exp(180); api.stats(3, 14, 0); return "Esmorzar al sol cada diumenge us fa immensament feliços, tot i pujar la quota mensual."; } },
        { k: "C", t: "Unificar el 100% de patrimonis i estalviar plegats cap al FIRE", s: "+3.500 € fons comú · Desp. -260€/m · Goig +10", fn: function (st, rng, api) { st.flags.cohabiting = true; api.cash(3500); api.exp(-260); api.stats(2, 10, 2); return "Remar en la mateixa direcció financera duplica la velocitat de creuer."; } }
      ]
    },
    {
      id: "ch_fam_3_birth", minAge: 26, maxAge: 43, reqFlag: "cohabiting", noFlag: "hadFirstKid", tag: "NAIXEMENT [3/8]",
      title: "Arriba una nova vida a casa!",
      body: "El plor del primer dia ho capgira tot: nits curtes, mirades noves i la responsabilitat d'acompanyar algú a créixer.",
      opts: [
        { k: "A", t: "Acollir la criança amb calma, roba heretada i fons indexat infantil", s: "Fill/a + Fons 0a · Desp. +290€/m · Goig +18", fn: function (st, rng, api) { var nm = api.addKid(); st.flags.kidFund = true; api.cash(-1200); api.exp(290); api.stats(2, 18, 2); return "Neix " + nm + "! Eviteu compres supèrflues de nadó i li obriu una cartera indexada des del bressol."; } },
        { k: "B", t: "Reduir una mica el ritme laboral per no perdre-us els primers passos", s: "Fill/a · Sou -10% · Desp. +240€/m · Goig +22 · Salut +5", fn: function (st, rng, api) { var nm = api.addKid(); api.salPct(-10); api.exp(240); api.stats(5, 22, 1); return "Neix " + nm + "! Les tardes al parc sense pressa són el millor ús de la vostra seguretat financera."; } },
        { k: "C", t: "Mantenir ambdues carreres al màxim amb escola bressol i cangur", s: "Fill/a · Desp. +520€/m · Sou +5% · Salut -5 · Goig +11", fn: function (st, rng, api) { var nm = api.addKid(); api.salPct(5); api.exp(520); api.stats(-5, 11, 2); return "Neix " + nm + "! Els ingressos no es ressenten, tot i la logística maratoniana."; } }
      ]
    },
    {
      id: "ch_fam_solo_parent", minAge: 31, maxAge: 44, noFlag: "hadFirstKid", tag: "PROJECTE FAMILIAR",
      title: "Maternitat/paternitat en solitari o adopció meditada",
      body: "Sents amb claredat el desig de formar família i transmetre valors i llegat, tinguis o no parella tradicional.",
      opts: [
        { k: "A", t: "Tirar endavant el projecte familiar amb xarxa d'amics i avis", s: "Fill/a · -3.200 € · Desp. +340€/m · Goig +20", fn: function (st, rng, api) { var nm = api.addKid(); st.flags.kidFund = true; api.cash(-3200); api.exp(340); api.stats(-2, 20, 2); return "Arriba " + nm + " a la teva vida! Una decisió valenta que omple la llar de llum i futur."; } },
        { k: "B", t: "Esdevenir mecenes educatiu de nebots i continuar lliure de càrregues", s: "-2.000 € · Goig +10 · Salut +3", fn: function (st, rng, api) { api.cash(-2000); api.stats(3, 10, 1); return "Gaudeixes d'acompanyar els joves de la família conservant la teva autonomia."; } },
        { k: "C", t: "Posposar la decisió i centrar-te en els teus objectius vitals", s: "Sense canvis · Skills +3", fn: function (st, rng, api) { api.stats(1, 2, 3); return "Respectes el teu propi ritme sense forçar etapes."; } }
      ]
    },
    {
      id: "ch_fam_second_kid", minAge: 29, maxAge: 45, reqFlag: "hadFirstKid", noFlag: "secondKidAsked", tag: "FAMÍLIA",
      title: "Un germà o germana per compartir jocs?",
      body: "Amb una criatura a casa us plantegeu si ampliar la família amb un segon fill o quedar-vos com esteu.",
      opts: [
        { k: "A", t: "Donar la benvinguda a una segona criatura aprofitant cotxet i bressol", s: "2n fill/a · Desp. +250€/m · Goig +16 · Salut -3", fn: function (st, rng, api) { st.flags.secondKidAsked = true; var nm = api.addKid(); api.exp(250); api.stats(-3, 16, 1); return "Arriba " + nm + "! El soroll al menjador es duplica, i la complicitat entre germans també."; } },
        { k: "B", t: "Quedar-vos amb un sol fill/a per dedicar-li temps i recursos al 100%", s: "Equilibri familiar · Goig +8 · Salut +4", fn: function (st, rng, api) { st.flags.secondKidAsked = true; api.stats(4, 8, 1); return "Trobeu l'equilibri perfecte entre criança dedicada, parella i estalvi."; } },
        { k: "C", t: "Adoptar un gos tranquil i fer més escapades a la muntanya", s: "Desp. +55€/m · Salut +7 · Goig +9", fn: function (st, rng, api) { st.flags.secondKidAsked = true; api.exp(55); api.stats(7, 9, 0); return "Les caminades en família amb el nou company pelut us regalen salut cada dia."; } }
      ]
    },
    {
      id: "ch_fam_4_school", minAge: 32, maxAge: 52, reqFlag: "hadFirstKid", minKidAge: 6, noFlag: "kidSchoolDone", tag: "EDUCACIÓ [4/8]",
      title: "Primària als 6 anys: model d'escola i tardes",
      body: "Comença l'etapa escolar. Veus famílies obsessionades amb omplir fins a les vuit del vespre d'acadèmies caríssimes.",
      opts: [
        { k: "A", t: "Escola pública de proximitat + música o esport i lectura a casa", s: "Despesa +65€/m · Goig +12 · Salut +4", fn: function (st, rng, api) { st.flags.kidSchoolDone = true; api.exp(65); api.stats(4, 12, 2); return "Amics al mateix carrer, tardes amb temps per avorrir-se i crear, i estalvi familiar sa."; } },
        { k: "B", t: "Escola trilingüe concertada/privada amb projecte científic", s: "Despesa +340€/m · Goig +8 · Educació +", fn: function (st, rng, api) { st.flags.kidSchoolDone = true; st.flags.kidEliteEdu = true; api.exp(340); api.stats(0, 8, 2); return "Inverteixes fort en idiomes i entorn acadèmic exigent des de la infància."; } },
        { k: "C", t: "Escola activa al bosc / cooperativa pedagògica", s: "Despesa +175€/m · Goig +14 · Salut +5", fn: function (st, rng, api) { st.flags.kidSchoolDone = true; api.exp(175); api.stats(5, 14, 1); return "Creixen envoltats de natura, curiositat pràctica i comunitat implicada."; } }
      ]
    },
    {
      id: "ch_fam_5_teen", minAge: 40, maxAge: 60, reqFlag: "kidSchoolDone", minKidAge: 14, noFlag: "kidTeenDone", tag: "ADOLESCÈNCIA [5/8]",
      title: "14 anys a casa: pantalles, paga mensual i valors",
      body: "L'adolescència truca a la porta amb portes tancades, primers mòbils i peticions de vambes de marca.",
      opts: [
        { k: "A", t: "Assignar pressupost mensual autogestionat i ensenyar-los interès compost", s: "-600 € · Goig +10 · Bonus Dinastia!", fn: function (st, rng, api) { st.flags.kidTeenDone = true; st.flags.kidFinLit = true; api.cash(-600); api.stats(2, 10, 3); return "Quan gestionen el seu propi pressupost i veuen créixer una petita cartera, entenen el valor real de l'esforç!"; } },
        { k: "B", t: "Enviar-los un trimestre d'immersió lingüística a Irlanda", s: "-4.800 € · Goig +9 · Educació +", fn: function (st, rng, api) { st.flags.kidTeenDone = true; st.flags.kidFinLit = true; api.cash(-4800); api.stats(1, 9, 2); return "Tornen molt més madurs, autònoms i parlant anglès amb fluïdesa total."; } },
        { k: "C", t: "Cedir a tots els capritxos per evitar discussions a taula", s: "-2.200 € · Desp. +110€/m · Goig -3", fn: function (st, rng, api) { st.flags.kidTeenDone = true; api.cash(-2200); api.exp(110); api.stats(-2, -3, 0); return "Compres pau momentània, però costa més transmetre el valor dels diners."; } }
      ]
    },
    {
      id: "ch_fam_6_uni", minAge: 44, maxAge: 65, reqFlag: "kidTeenDone", minKidAge: 18, noFlag: "kidUniDone", tag: "UNIVERSITAT / FP [6/8]",
      title: "18 anys: la tria formativa de la nova generació",
      body: "Arriba la majoria d'edat a casa. Toca finançar universitat, grau superior dual o estudis fora.",
      opts: [
        { k: "A", t: "Universitat pública / FP Dual + feina d'estiu (i usar el fons infantil si n'hi ha)", s: "Cost molt optimitzat · Orgull familiar", fn: function (st, rng, api) { st.flags.kidUniDone = true; if (st.flags.kidFund) { api.stats(3, 15, 2); return "El fons indexat que vas obrir als 0 anys ja supera els 24.000 € i cobreix tota l'etapa sense tocar la teva caixa!"; } api.cash(-3800); api.stats(2, 11, 1); return "Combina beques, matrícula pública i estius treballats amb una maduresa admirable."; } },
        { k: "B", t: "Pagar grau i màster internacional de primer nivell", s: "-18.000 € · Gran impuls per a la Dinastia", fn: function (st, rng, api) { st.flags.kidUniDone = true; st.flags.kidEliteEdu = true; api.cash(st.flags.kidFund ? -6000 : -18000); api.stats(0, 13, 2); return "Una inversió potent en capital humà que donarà fruits quan prenguin el relleu."; } },
        { k: "C", t: "Ajudar-los a muntar el seu primer petit taller o ofici tècnic", s: "-7.500 € · Goig +12", fn: function (st, rng, api) { st.flags.kidUniDone = true; st.flags.kidFinLit = true; api.cash(-7500); api.stats(2, 12, 2); return "S'inicien en un ofici real amb eines pagades al comptat i zero deutes."; } }
      ]
    },
    {
      id: "ch_fam_7_emancipate", minAge: 49, maxAge: 70, reqFlag: "kidUniDone", minKidAge: 23, noFlag: "kidEmancipated", tag: "EMANCIPACIÓ [7/8]",
      title: "Caixes al passadís: els fills volen sols",
      body: "El pis queda de sobte silenciós i endreçat. Acaba l'etapa de manteniment familiar directe i comença una relació d'adults.",
      opts: [
        { k: "A", t: "Celebrar la seva autonomia i redirigir l'estalvi alliberat a la teva llibertat", s: "Despesa -380€/m · Goig +10 · Salut +4", fn: function (st, rng, api) { st.flags.kidEmancipated = true; api.exp(-380); api.stats(4, 10, 0); return "Veure'ls independents i solvents és una satisfacció serena; la teva taxa d'estalvi fa un salt."; } },
        { k: "B", t: "Aportar-los 15.000 € per a l'entrada del seu primer pis ben comprat", s: "-15.000 € · Desp. -380€/m · Goig +18", fn: function (st, rng, api) { st.flags.kidEmancipated = true; api.cash(-15000); api.exp(-380); api.stats(3, 18, 0); return "Ajudar en vida quan més ho necessiten als 25 anys té deu vegades més impacte que als 60."; } },
        { k: "C", t: "Transformar l'habitació lliure en estudi de lectura, pintura o música", s: "-1.800 € · Desp. -340€/m · Goig +14 · Salut +5", fn: function (st, rng, api) { st.flags.kidEmancipated = true; api.cash(-1800); api.exp(-340); api.stats(5, 14, 2); return "Recuperes un espai lluminós per als teus projectes personals."; } }
      ]
    },
    {
      id: "ch_fam_8_grandkids", minAge: 58, maxAge: 84, reqFlag: "kidEmancipated", minKidAge: 30, noFlag: "grandkidsArrived", tag: "NÉTS & NISSAGA [8/8]",
      title: "Rialles menudes al menjador: arriben els néts",
      body: "La tercera generació ja corre per casa! Ara pots gaudir de la tendresa sense l'estrès laboral que tenies als trenta.",
      opts: [
        { k: "A", t: "Reservar un dia fix a la setmana per recollir-los, anar a l'hort i explicar històries", s: "Salut +9 · Goig +20", fn: function (st, rng, api) { st.flags.grandkidsArrived = true; api.stats(9, 20, 0); return "Caminar amb els néts i ensenyar-los paciència et manté jove de cap i de cor."; } },
        { k: "B", t: "Obrir una cartera dinàstica d'acumulació per als seus estudis futurs", s: "-9.000 € · Goig +16 · Llegat reforçat", fn: function (st, rng, api) { st.flags.grandkidsArrived = true; st.flags.kidFinLit = true; api.cash(-9000); api.stats(5, 16, 2); return "Plantes roures dels quals gaudiran d'ombra quan tu ja siguis memòria viva."; } },
        { k: "C", t: "Convidar tota la família una setmana cada estiu a una masia", s: "-3.600 € · Goig +18 · Salut +5", fn: function (st, rng, api) { st.flags.grandkidsArrived = true; api.cash(-3600); api.stats(5, 18, 0); return "Les sobretaules d'agost sota la parra uneixen totes les branques de la família."; } }
      ]
    },

    // --- CADENA 2: PROJECTE LATERAL -> ESCALAT -> OFERTA DE COMPRA (3 baules) ---
    {
      id: "ch_biz_1_spark", minAge: 23, maxAge: 52, noFlag: "hasSideBiz", tag: "EMPRENEDORIA [1/3]",
      title: "Una solució casolana que tres empreses volen pagar",
      body: "Vas automatitzar una plantilla i eina per estalviar-te feina repetitiva, i pel boca-orella et demanen llicenciar-la.",
      opts: [
        { k: "A", t: "Dedicar-hi vuit hores cada cap de setmana per convertir-ho en subscripció", s: "-900 € · Renda +280€/m · Skills +8", fn: function (st, rng, api) { st.flags.hasSideBiz = true; api.cash(-900); api.side(280); api.stats(-4, 8, 8); return "Neix un petit negoci recurrent amb marges del 85% sense deixar la teva feina!"; } },
        { k: "B", t: "Vendre'ls la plantilla tancada per 3.800 € sense suport continu", s: "+3.800 € · Zero càrrega mental", fn: function (st, rng, api) { api.cash(3800); api.stats(1, 5, 3); return "Cobres un bon pessic puntual i protegeixes el teu descans setmanal."; } },
        { k: "C", t: "Publicar-ho com a codi obert / portafoli per prestigiar el teu currículum", s: "Sou base +9% · Skills +6 · Goig +5", fn: function (st, rng, api) { api.salPct(9); api.stats(1, 5, 6); return "La comunitat aplaudeix la teva aportació i t'arriben millors propostes laborals."; } }
      ]
    },
    {
      id: "ch_biz_2_scale", minAge: 25, maxAge: 58, reqFlag: "hasSideBiz", noFlag: "sideScaled", tag: "EMPRENEDORIA [2/3]",
      title: "El projecte lateral arriba a 60 clients mensuals",
      body: "Els correus de suport comencen a ocupar-te els vespres. Estàs al punt d'inflexió entre autoocupació o sistema.",
      opts: [
        { k: "A", t: "Documentar processos i subcontractar suport 10h/setmana", s: "-2.400 € · Renda neta +340€/m extra · Salut +3", fn: function (st, rng, api) { st.flags.sideScaled = true; api.cash(-2400); api.side(340); api.stats(3, 9, 7); return "Delegues el dia a dia operatiu i el projecte creix tot sol fins a una renda formidable!"; } },
        { k: "B", t: "Apujar preus un 40% per quedar-te només amb els millors clients", s: "Renda +210€/m · Salut +5 · Goig +6", fn: function (st, rng, api) { st.flags.sideScaled = true; api.side(210); api.stats(5, 6, 4); return "Menys clients, menys incidències i més facturació: la màgia del posicionament."; } },
        { k: "C", t: "Fer-ho tot tu sol dormint sis hores per no pagar col·laboradors", s: "Renda +390€/m · Salut -11 · Goig -6", fn: function (st, rng, api) { st.flags.sideScaled = true; api.side(390); api.stats(-11, -6, 3); return "Retens cada euro del marge, però acabes els divendres amb la vista borrosa."; } }
      ]
    },
    {
      id: "ch_biz_3_buyout", minAge: 28, maxAge: 65, reqFlag: "sideScaled", noFlag: "sideExitOffer", tag: "EMPRENEDORIA [3/3]",
      title: "Un fons especialitzat vol comprar el teu negoci lateral",
      body: "T'ofereixen un múltiple de 4 vegades el benefici anual al comptat (78.000 € nets després d'impostos) per absorbir la cartera.",
      opts: [
        { k: "A", t: "Vendre el 100%, ingressar +78.000 € a cartera i alliberar l'agenda!", s: "+78.000 € nets · Renda lateral -450€/m · Goig +15", fn: function (st, rng, api) { st.flags.sideExitOffer = true; api.cash(78000); api.side(-450); api.stats(6, 15, 4); return "Signes davant notari! Converteixes anys de constància nocturna en un salt patrimonial gegant."; } },
        { k: "B", t: "Vendre'n només el 50% (+39.000 €) i seguir com a soci assessor", s: "+39.000 € · Conserves meitat de renda · Goig +11", fn: function (st, rng, api) { st.flags.sideExitOffer = true; api.cash(39000); api.side(-180); api.stats(4, 11, 5); return "Assegures caixa rellevant i mantens un peu en el creixement futur amb un soci fort."; } },
        { k: "C", t: "Rebutjar l'oferta i conservar la teva petita màquina d'efectiu mensual", s: "Renda +120€/m extra · Independència total", fn: function (st, rng, api) { st.flags.sideExitOffer = true; api.side(120); api.stats(0, 7, 3); return "Prefereixes el flux mensual predictible sota el teu control exclusiu."; } }
      ]
    },

    // --- CADENA 3: IMMOBLES -> INCIDÈNCIA -> REFORMA VERDA -> BOOM DE BARRI (3 baules) ---
    {
      id: "ch_prop_1_tenant", minAge: 23, maxAge: 70, reqFlag: "hasProperty", noFlag: "propTenantIssue", tag: "IMMOBILIARI [1/3]",
      title: "Fuita d'aigua i retard del llogater el mateix mes",
      body: "La realitat dels maons no és tan passiva com als vídeos: es trenca un baixant i l'inquilí demana fraccionar el mes per un sotrac laboral.",
      opts: [
        { k: "A", t: "Reparar ràpid i pactar calendari humà de pagament amb un bon inquilí", s: "-1.350 € · Inquilí fidelitzat · Goig +5", fn: function (st, rng, api) { st.flags.propTenantIssue = true; api.cash(-1350); api.stats(0, 5, 3); return "Tractar bé un bon llogater en un mes difícil t'estalvia mesos de pis buit i rotació."; } },
        { k: "B", t: "Contractar gestoria integral i assegurança d'impagament permanent", s: "-950 € · Desp. +45€/m · Salut +6", fn: function (st, rng, api) { st.flags.propTenantIssue = true; api.cash(-950); api.exp(45); api.stats(6, 4, 1); return "Cedeixes un petit percentatge del marge per no tornar a rebre trucades un diumenge."; } },
        { k: "C", t: "Fer un apedaçat barat i pressionar amb burofax", s: "-350 € · Risc d'avaria major i pis buit", fn: function (st, rng, api) { st.flags.propTenantIssue = true; api.cash(-2600); api.stats(-5, -6, 0); return "L'inquilí marxa, la humitat empitjora i acabes perdent dos mesos de renda (-2.600 €)."; } }
      ]
    },
    {
      id: "ch_prop_2_green", minAge: 26, maxAge: 74, reqFlag: "propTenantIssue", noFlag: "propRenovated", tag: "IMMOBILIARI [2/3]",
      title: "Subvenció per a finestres tèrmiques i aerotèrmia",
      body: "Surt una convocatòria europea que cobreix el 40% del cost de rehabilitar energèticament els teus immobles.",
      opts: [
        { k: "A", t: "Executar la millora d'aïllament i pujar certificat energètic a A/B", s: "-4.800 € nets · Renda/valor immobiliari + · Fiscalitat +", fn: function (st, rng, api) { st.flags.propRenovated = true; var cost = st.flags.rehabSkill ? -3400 : -4800; api.cash(cost); api.side(130); api.stats(1, 7, 4); return "Pisos més confortables a l'hivern i a l'estiu, deducció a l'IRPF i major valor patrimonial!"; } },
        { k: "B", t: "Fer només tancaments bàsics sense paperassa de subvenció", s: "-2.100 € · Millora moderada (+55€/m)", fn: function (st, rng, api) { st.flags.propRenovated = true; api.cash(-2100); api.side(55); api.stats(2, 3, 1); return "Millores el confort acústic i tèrmic sense barallar-te amb expedients."; } },
        { k: "C", t: "Deixar l'immoble tal com està mentre es vagi llogant", s: "0 € ara · Desgast progressiu", fn: function (st, rng, api) { st.flags.propRenovated = true; api.stats(0, 0, 0); return "Conserves la liquiditat, tot i que l'edifici queda un esglaó per darrere dels reformats."; } }
      ]
    },
    {
      id: "ch_prop_3_boom", minAge: 30, maxAge: 78, reqFlag: "propRenovated", noFlag: "propBoom", tag: "IMMOBILIARI [3/3]",
      title: "Vianantització i nova estació al costat de la finca!",
      body: "L'ajuntament transforma l'antiga avinguda sorollosa en un eix verd amb parada de tren a tres minuts.",
      opts: [
        { k: "A", t: "Mantenir el patrimoni revaloritzat i actualitzar rendes amb prudència", s: "+18.000 € valor líquid/refin. · Renda +160€/m", fn: function (st, rng, api) { st.flags.propBoom = true; st.rePriceIndex = Math.round((st.rePriceIndex * 1.08) * 1000) / 1000; api.side(160); api.stats(2, 11, 2); return "La paciència immobiliària de llarg termini recull el premi d'haver comprat i cuidat bé l'actiu!"; } },
        { k: "B", t: "Segregar un traster/estudi annex i treure'n un ingrés addicional", s: "-6.500 € obra · Renda +230€/m", fn: function (st, rng, api) { st.flags.propBoom = true; api.cash(-6500); api.side(230); api.stats(-2, 9, 4); return "Optimitzes metres quadrats infrautilitzats al nou eix de moda."; } },
        { k: "C", t: "Aprofitar l'eufòria per recollir una prima d'exclusivitat comercial", s: "+14.500 € nets immediats", fn: function (st, rng, api) { st.flags.propBoom = true; api.cash(14500); api.stats(2, 8, 1); return "Monetitzes part del nou atractiu de la zona sense vendre l'edifici."; } }
      ]
    },

    // --- CADENA 4: CREMADA LABORAL -> ANY SABÀTIC -> REINVENCIÓ (3 baules) ---
    {
      id: "ch_burn_1_signal", minAge: 29, maxAge: 55, noFlag: "burnWarning", tag: "SALUT & FEINA [1/3]",
      title: "Brunzit a l'ull esquerre i diumenges grisos",
      body: "Portes mesos encadenant entregues urgents. T'adormes pensant en correus i t'has saltat tres trobades amb amics.",
      opts: [
        { k: "A", t: "Marcar frontera estricta a les 18h i bloquejar caminades a l'agenda", s: "Salut +11 · Goig +8", fn: function (st, rng, api) { st.flags.burnWarning = true; api.stats(11, 8, 2); return "Descobreixes que el món no s'ensorra quan tanques l'ordinador a l'hora en punt."; } },
        { k: "B", t: "Demanar canvi de departament menys tòxic encara que congeli el bonus", s: "Salut +8 · Goig +7 · Skills +3", fn: function (st, rng, api) { st.flags.burnWarning = true; api.stats(8, 7, 3); return "Un cap raonable val més per a la teva esperança de vida que un 8% extra brut."; } },
        { k: "C", t: "Prémer les dents pel gran bonus de tancament d'any", s: "+4.200 € · Salut -14 · Goig -11", fn: function (st, rng, api) { st.flags.burnWarning = true; api.cash(4200); api.stats(-14, -11, 1); return "Ingressaràs el bonus, però el teu sistema nerviós queda en números vermells."; } }
      ]
    },
    {
      id: "ch_burn_2_pause", minAge: 32, maxAge: 60, reqFlag: "burnWarning", noFlag: "burnSabbatical", tag: "SALUT & FEINA [2/3]",
      title: "La temptació d'una pausa conscient a meitat de vida",
      body: "T'adones que tens estalvis suficients per comprar uns mesos de llibertat abans d'esperar als 67 anys.",
      opts: [
        { k: "A", t: "Agafar 4 mesos d'excedència: Pirineus, lectura lenta i cuina", s: "-4.600 € · Salut +20 · Goig +19 · Skills +4", fn: function (st, rng, api) { st.flags.burnSabbatical = true; api.cash(-4600); api.stats(20, 19, 4); return "Per primera vegada en deu anys sents el silenci d'un dimarts al matí al bosc. Renaixement total!"; } },
        { k: "B", t: "Pactar jornada reduïda d'estiu i estudiar un camp que t'apassiona", s: "-1.900 € · Salut +12 · Goig +12 · Skills +7", fn: function (st, rng, api) { st.flags.burnSabbatical = true; api.cash(-1900); api.stats(12, 12, 7); return "Recuperes l'alè i sembres les bases d'una nova etapa professional."; } },
        { k: "C", t: "No aturar-te per por de perdre el tren corporatiu", s: "+2.500 € · Salut -8 · Goig -5", fn: function (st, rng, api) { st.flags.burnSabbatical = true; api.cash(2500); api.stats(-8, -5, 1); return "Segueixes a la roda acumulant euros, però amb fatiga acumulada."; } }
      ]
    },
    {
      id: "ch_burn_3_reinvent", minAge: 35, maxAge: 64, reqFlag: "burnSabbatical", noFlag: "burnReinvented", tag: "SALUT & FEINA [3/3]",
      title: "Reinvenció amb les teves pròpies regles",
      body: "Amb el cap clar després de reflexionar, veus una manera d'aportar molt valor treballant menys hores i sense política d'oficina.",
      opts: [
        { k: "A", t: "Passar a assessor/especialista d'alt valor amb horari matinal", s: "Sou base +18% · Salut +8 · Goig +14", fn: function (st, rng, api) { st.flags.burnReinvented = true; api.salPct(18); api.stats(8, 14, 6); return "Et paguen pel teu criteri acumulat en 20 anys, no per escalfar la cadira fins a les vuit!"; } },
        { k: "B", t: "Combinar docència pràctica amb cartera d'inversió serena", s: "Renda +220€/m · Salut +10 · Goig +15", fn: function (st, rng, api) { st.flags.burnReinvented = true; api.side(220); api.stats(10, 15, 5); return "Ensenyar a joves professionals t'omple d'energia i propòsit."; } },
        { k: "C", t: "Tornar a una direcció executiva ben remunerada posant límits", s: "Sou base +26% · Salut -3 · Goig +4", fn: function (st, rng, api) { st.flags.burnReinvented = true; api.salPct(26); api.stats(-3, 4, 5); return "Aquest cop entres al despatx sabent que pots marxar quan vulguis."; } }
      ]
    },

    // --- CADENA 5: RETIR, RISC DE SEQÜÈNCIA, LONGEVITAT I PACTE SUCCESSORI (3 baules) ---
    {
      id: "ch_ret_1_bondtent", minAge: 56, maxAge: 70, noFlag: "seqRiskTested", tag: "ESTRATÈGIA DE RETIR [1/3]",
      title: "El risc de seqüència dels primers cinc anys de jubilació",
      body: "Un crac sever just quan comences a retirar capital pot danyar una cartera per sempre si no tens amortidor defensiu.",
      opts: [
        { k: "A", t: "Construir una «tenda de bons i liquiditat» (3 anys de despeses segures)", s: "Reequilibri prudent · Salut +6 · Goig +8", fn: function (st, rng, api) { st.flags.seqRiskTested = true; st.alloc = { cash: 20, bonds: 20, index: 40, dividend: 20, reits: 0, venture: 0 }; api.stats(6, 8, 4); return "Blinda't contra tempesta: si la borsa cau un 30%, viuràs de liquiditat i dividends sense vendre accions barates!"; } },
        { k: "B", t: "Pactar regla de retirada flexible (ajustar viatges en anys baixistes)", s: "Despesa -90€/m · +3.200 € · Goig +5", fn: function (st, rng, api) { st.flags.seqRiskTested = true; api.exp(-90); api.cash(3200); api.stats(3, 5, 3); return "La flexibilitat en la despesa dispara la taxa d'èxit històrica de la cartera prop del 99%."; } },
        { k: "C", t: "Mantenir-ho tot agressiu buscant el màxim creixement", s: "Més rendiment potencial o ensurt", fn: function (st, rng, api) { st.flags.seqRiskTested = true; if (rng() < 0.55) { api.cash(12000); return "Els mercats acompanyen i sumes +12.000 € extres!"; } api.cash(-9500); api.stats(-4, -5, 0); return "Un sotrac t'agafa carregat de risc (-9.500 €) i et fa suar fred."; } }
      ]
    },
    {
      id: "ch_ret_2_passion", minAge: 65, maxAge: 81, reqFlag: "seqRiskTested", noFlag: "longevityPassion", tag: "LONGEVITAT ACTIVA [2/3]",
      title: "De què s'omplen els matins quan ja no hi ha rellotge?",
      body: "Molta gent prepara l'Excel per jubilar-se però oblida preparar un motiu il·lusionant per llevar-se cada matí.",
      opts: [
        { k: "A", t: "Taller d'artesania/hort mediterrani, club de caminades i lectura", s: "-1.400 € · Salut +14 · Goig +18", fn: function (st, rng, api) { st.flags.longevityPassion = true; api.cash(-1400); api.stats(14, 18, 3); return "Mans actives, sol del matí, amics de tertúlia i curiositat viva: la recepta de les Zones Blaves!"; } },
        { k: "B", t: "Mentoria voluntària a joves emprenedors i associació cultural", s: "Salut +9 · Goig +17 · Skills +4", fn: function (st, rng, api) { st.flags.longevityPassion = true; api.stats(9, 17, 4); return "Sentir-te útil compartint mig segle d'aprenentatges rejoveneix el cervell."; } },
        { k: "C", t: "Viatjar dos mesos cada tardor fora de temporada alta en tren", s: "-4.500 € · Salut +8 · Goig +19", fn: function (st, rng, api) { st.flags.longevityPassion = true; api.cash(-4500); api.stats(8, 19, 1); return "Octubre a la Toscana o al nord al teu ritme, pagant la meitat i sense aglomeracions."; } }
      ]
    },
    {
      id: "ch_ret_3_legacy_pact", minAge: 71, maxAge: 84, noFlag: "legacyPactDone", tag: "LLEGAT & DINASTIA [3/3]",
      title: "Notaria, voluntats vitals i pacte successori català",
      body: "En el dret civil català existeixen figures com el pacte successori i donacions ordenades que eviten conflictes i optimitzen impostos.",
      opts: [
        { k: "A", t: "Signar pacte successori i estructura familiar ordenada (Herència al 92%!)", s: "-5.500 € notaria · Dinastia reté el 92% · Goig +14", fn: function (st, rng, api) { st.flags.legacyPactDone = true; st.flags.trustPlan = true; api.cash(-5500); api.stats(4, 14, 4); return "Deixes tots els papers cristal·lins i redueixes dràsticament l'impacte fiscal per a la següent generació!"; } },
        { k: "B", t: "Fer testament clàssic clar + document de voluntats anticipades", s: "-450 € · Pau mental · Goig +10", fn: function (st, rng, api) { st.flags.legacyPactDone = true; api.cash(-450); api.stats(5, 10, 1); return "Un acte d'estimació i ordre que estalvia dubtes i maldecaps als teus."; } },
        { k: "C", t: "Ajudar ara mateix amb una donació en vida i gaudir de veure'n el fruit", s: "-16.000 € · Goig +20 · Salut +4", fn: function (st, rng, api) { st.flags.legacyPactDone = true; api.cash(-16000); api.stats(4, 20, 0); return "Veure el somriure d'agraïment amb els teus propis ulls val molt més que qualsevol xifra pòstuma."; } }
      ]
    }
  ];

  // ==================== EXPANSIÓ DE DÈCADES INTERMÈDIES (25–54 ANYS) ====================
  var MORE_EVENTS_MID = [
    // --- DÈCADA 25-32: CARRERA, CRACS, CASAMENTS I HABITATGE (15 esdeveniments) ---
    {
      id: "ev_25_headhunter_raise", minAge: 25, maxAge: 34, tag: "SALT PROFESSIONAL",
      title: "Trucada d'una tecnològica amb exigent cultura d'objectius",
      body: "Et proposen pujar el sou un +30%, però saps que s'hi fan jornades intenses i viatges trimestrals.",
      opts: [
        { k: "A", t: "Acceptar i enviar el 100% de l'augment directament a inversió", s: "Sou +30% · Salut -7 · Goig -4 · Skills +5", fn: function (st, rng, api) { api.salPct(30); api.stats(-7, -4, 5); return "Evites la inflació d'estil de vida i dispares la teva taxa d'estalvi mensual."; } },
        { k: "B", t: "Usar l'oferta per negociar +15% i teletreball a la teva empresa", s: "Sou +15% · Goig +6 · Salut +2", fn: function (st, rng, api) { api.salPct(15); api.stats(2, 6, 3); return "Aconsegueixes una pujada notable sense perdre les tardes tranquil·les."; } },
        { k: "C", t: "Rebutjar-la i dedicar les tardes a un projecte propi", s: "Renda +120€/m · Skills +6 · Goig +4", fn: function (st, rng, api) { api.side(120); api.stats(1, 4, 6); return "Protegeixes la teva energia per construir ingressos que depenen només de tu."; } }
      ]
    },
    {
      id: "ev_26_car_dilemma", minAge: 25, maxAge: 38, tag: "ESTIL DE VIDA",
      title: "El cotxe antic demana junta de culata",
      body: "Al concessionari t'ofereixen un SUV híbrid d'estrena per 370 €/mes. El teu mecànic de confiança ven un japonès impecable per 4.600 €.",
      opts: [
        { k: "A", t: "Comprar l'utilitari japonès al comptat i zero quotes", s: "-4.600 € · Fiabilitat total · Goig +3", fn: function (st, rng, api) { api.cash(-4600); api.stats(1, 3, 2); return "Cap lletra bancària cada mes: en deu anys aquest gest t'haurà fet 40.000 € més ric."; } },
        { k: "B", t: "Finançar el SUV nou d'aparador", s: "-3.200 € · Desp. +310€/m · Goig +7", fn: function (st, rng, api) { api.cash(-3200); api.exp(310); api.stats(0, 7, 0); return "Fa olor de nou el primer mes, però la quota fixa frena l'interès compost anys i panys."; } },
        { k: "C", t: "Passar-te a tren + cotxe compartit només caps de setmana puntuals", s: "+900 € desballestament · Desp. -115€/m · Salut +7", fn: function (st, rng, api) { api.cash(900); api.exp(-115); api.stats(7, 4, 1); return "Camines més, llegeixes al vagó i t'oblides d'ITV, pneumàtics i impostos."; } }
      ]
    },
    {
      id: "ev_26_weddings_season", minAge: 25, maxAge: 34, tag: "PRESSIÓ SOCIAL",
      title: "L'any dels cinc casaments i comiats de solter",
      body: "S'ajunten cinc bodes d'amics amb vols, vestits i regals de 200 € per cap. El pressupost anual tremola.",
      opts: [
        { k: "A", t: "Anar als casaments més íntims i declinar amb afecte els comiats llunyans", s: "-1.100 € · Goig +10 · Salut +2", fn: function (st, rng, api) { api.cash(-1100); api.stats(2, 10, 1); return "Celebres l'amor dels amics de debò sense hipotecar mig any d'estalvi."; } },
        { k: "B", t: "Dir que sí a absolutament tot el calendari festiu", s: "-3.400 € · Goig +14 · Salut -4", fn: function (st, rng, api) { api.cash(-3400); api.stats(-4, 14, 0); return "Balles fins a l'alba a cinc comarques, però el compte queda ben escurat."; } },
        { k: "C", t: "Regalar fotografia/disseny o detalls artesans fets per tu amb cor", s: "-650 € · Goig +11 · Skills +3", fn: function (st, rng, api) { api.cash(-650); api.stats(1, 11, 3); return "Els nuvis s'emocionen molt més amb el teu detall personal que amb una transferència freda."; } }
      ]
    },
    {
      id: "ev_27_cousin_padel", minAge: 25, maxAge: 52, tag: "TRAMPA O GANGA?",
      title: "El cunyat i el club de pàdel amb «25% garantit»",
      body: "En plena sobretaula et proposa posar 12.000 € com a soci capitalista en unes pistes amb terrassa de gintònics.",
      opts: [
        { k: "A", t: "Declinar amb somriure diplomàtic: mai barregis família i promeses garantides", s: "0 € perduts · Pau familiar · Goig +3", fn: function (st, rng, api) { api.stats(1, 3, 2); return "Quan algú promet un 25% sense risc és perquè encara no ha calculat el risc."; } },
        { k: "B", t: "Entrar-hi amb els 12.000 € per provar sort", s: "Aposta binària (28% d'èxit)", fn: function (st, rng, api) { if (rng() < 0.28) { api.cash(21000); api.stats(0, 9, 2); return "Sorpresa majúscula! El club fa ple cada vespre i cobres +21.000 € en dividends!"; } api.cash(-12000); api.stats(-3, -9, 2); return "Sobrecostos de llicència i baralles de socis: s'evaporen els 12.000 €."; } },
        { k: "C", t: "Deixar-li només 1.500 € documentats sense interessos", s: "-400 € nets · Vincle salvat", fn: function (st, rng, api) { api.cash(-400); api.stats(0, 2, 1); return "Recuperes quasi tot tard i a terminis (-400 €), però evites un daltabaix gran."; } }
      ]
    },
    {
      id: "ev_28_geo_town", minAge: 26, maxAge: 50, noFlag: "movedTown", tag: "GEO-ARBITRATGE",
      title: "Teletreball des d'una vila amb fibra i serra a tocar",
      body: "Descobreixes un poble viu a 40 minuts en tren on la vida costa una tercera part menys i l'aire és net.",
      opts: [
        { k: "A", t: "Mudar-t'hi conservant el sou digital: estalvi radical i natura", s: "Despesa -290€/m · Salut +10 · Goig +9", fn: function (st, rng, api) { st.flags.movedTown = true; api.exp(-290); api.stats(10, 9, 1); return "Estalvies 3.500 € l'any de cop i surts a córrer per corriols entre pins a les sis!"; } },
        { k: "B", t: "Quedar-te a la ciutat per aprofitar esdeveniments i contactes", s: "Sou base +8% · Desp. +75€/m · Skills +4", fn: function (st, rng, api) { api.salPct(8); api.exp(75); api.stats(0, 4, 4); return "Les trobades presencials et connecten amb projectes més ben pagats."; } },
        { k: "C", t: "Fer estada de prova d'un mes a la tardor abans de decidir", s: "-950 € · Salut +5 · Goig +7", fn: function (st, rng, api) { api.cash(-950); api.stats(5, 7, 1); return "Tastes la tranquil·litat rural sense desmuntar encara la teva base urbana."; } }
      ]
    },
    {
      id: "ev_28_crypto_fomo", minAge: 23, maxAge: 55, tag: "BOMBOLLA & FOMO",
      title: "Febre col·lectiva per un nou token d'IA descentralitzada",
      body: "Al xat d'amics tothom ensenya captures d'un +280% en sis setmanes. Et crema la liquiditat a les mans.",
      opts: [
        { k: "A", t: "Destinar-hi només 1.200 € d'especulació sabent que pot anar a zero", s: "Risc acotat i asimètric", fn: function (st, rng, api) { if (rng() < 0.34) { api.cash(4800); return "Retires guanys amb sang freda (+4.800 €) setmanes abans de la patacada!"; } api.cash(-1200); return "Cau un 90%, però com que vas acotar la mida, el teu pla ni s'immuta."; } },
        { k: "B", t: "Apostar-hi 18.000 € de cop perquè «aquest cop és diferent»", s: "Volatilitat extrema", fn: function (st, rng, api) { if (rng() < 0.22) { api.cash(44000); api.stats(-2, 12, 0); return "Cop de sort històric (+44.000 €)! Vens a temps contra tot pronòstic."; } api.cash(-15500); api.stats(-6, -12, 2); return "Entres just al cim d'eufòria i perds 15.500 € en quinze dies."; } },
        { k: "C", t: "Silenciar el grup i fer una aportació extra a l'MSCI World", s: "+600 € · Calma +7 · Salut +3", fn: function (st, rng, api) { api.cash(600); api.stats(3, 7, 2); return "Mig any després ningú parla del token; els teus indexats segueixen treballant en silenci."; } }
      ]
    },
    {
      id: "ev_29_remote_global", minAge: 26, maxAge: 46, reqFlag: "hasEnglishC1", noFlag: "gotGlobalJob", tag: "TALENT GLOBAL",
      title: "Contracte remot per a un equip de Zuric / Londres",
      body: "Gràcies al teu anglès C1 superes les entrevistes d'una empresa europea que paga salaris del nord vivint aquí!",
      opts: [
        { k: "A", t: "Signar el contracte remot internacional (+38% salarial!)", s: "Sou base +38% · Skills +8 · Salut -3", fn: function (st, rng, api) { st.flags.gotGlobalJob = true; api.salPct(38); api.stats(-3, 12, 8); return "Arbitratge salarial pur: cobres sou europeu pagant el cafè amb llet al preu del teu barri!"; } },
        { k: "B", t: "Col·laborar-hi com a consultor extern 15 hores setmanals", s: "Renda lateral +520€/m · Goig +9", fn: function (st, rng, api) { st.flags.gotGlobalJob = true; api.side(520); api.stats(-1, 9, 6); return "Diversifiques fonts d'ingressos en divisa forta sense canviar de feina principal."; } },
        { k: "C", t: "Presentar la contraoferta a casa per pujar rang sense canviar d'equip", s: "Sou base +22% · Goig +6", fn: function (st, rng, api) { st.flags.gotGlobalJob = true; api.salPct(22); api.stats(2, 6, 3); return "T'igualen bona part de la pujada conservant la teva antiguitat i companys."; } }
      ]
    },
    {
      id: "ev_29_ergonomic_desk", minAge: 25, maxAge: 48, tag: "SALUT LABORAL",
      title: "Hores de pantalla, cadira vella i vista cansada",
      body: "Acabes les jornades amb mal de cap i espatlles encorbades. Et planteges renovar el lloc de treball.",
      opts: [
        { k: "A", t: "Cadira ergonòmica bona, taula elevable i monitor 4K descansat", s: "-1.100 € · Salut +11 · Skills +3", fn: function (st, rng, api) { api.cash(-1100); api.stats(11, 6, 3); return "Treballar dret a estones i amb bona postura elimina el dolor cervical d'arrel."; } },
        { k: "B", t: "Ulleres de filtre + pauses de 5 minuts d'estiraments cada hora", s: "-180 € · Salut +7 · Goig +3", fn: function (st, rng, api) { api.cash(-180); api.stats(7, 3, 1); return "La disciplina de moure't cada cinquanta minuts fa miracles per gairebé res."; } },
        { k: "C", t: "Seguir treballant encorbat des de la taula del menjador", s: "Salut -7 · Goig -3", fn: function (st, rng, api) { api.stats(-7, -3, 0); return "Estalvies mil euros avui que després deixaràs multiplicats al fisioterapeuta."; } }
      ]
    },
    {
      id: "ev_30_panic_crash", minAge: 24, maxAge: 68, tag: "PSICOLOGIA BORSÀRIA",
      title: "Portades alarmistes: «S'esfumen bilions a les borses mundials»",
      body: "Una crisi geopolítica i financera tenyeix tots els índexs de vermell intens. Els tertulians prediuen deu anys perduts.",
      opts: [
        { k: "A", t: "Mantenir l'aportació periòdica automàtica sense obrir l'app del bròker", s: "Sang freda · Prima de recuperació +3.800 €", fn: function (st, rng, api) { api.cash(3800); api.stats(2, 5, 4); return "Compres participacions amb rebaixes del 25% mentre la multitud ven presa del pànic!"; } },
        { k: "B", t: "Reequilibrar passant liquiditat/bons cap a renda variable deprimida", s: "Moviment contrarian (+11% sobre liquiditat)", fn: function (st, rng, api) { var bonus = Math.max(1800, Math.round(st.liquidAssets * 0.09)); api.cash(bonus); api.stats(-1, 8, 5); return "Executes el manual amb precisió quirúrgica i captures +" + api.fmt(bonus) + " en el rebot!"; } },
        { k: "C", t: "Vendre en pànic a compte corrent fins que «passi la tempesta»", s: "Cristal·litzes pèrdues (-12% líquid)", fn: function (st, rng, api) { var loss = Math.max(1200, Math.round(st.liquidAssets * 0.12)); api.cash(-loss); st.alloc = { cash: 80, bonds: 20, index: 0, dividend: 0, reits: 0, venture: 0 }; api.stats(-2, -6, 1); return "Vens prop del mínim (-" + api.fmt(loss) + ") i quan torna la calma la borsa ja s'ha escapat un +25%."; } }
      ]
    },
    {
      id: "ev_30_decade_turning", minAge: 30, maxAge: 32, tag: "BALANÇ DELS 30",
      title: "Trenta espelmes i una pregunta honesta",
      body: "Fas 30 anys. Alguns coneguts aparenten riquesa a crèdit; d'altres viuen obsessionats estalviant fins l'últim cèntim sense viure.",
      opts: [
        { k: "A", t: "Definir la teva filosofia: frugal en el que t'és igual, generós en el que estimes", s: "Despesa -70€/m · Goig +11 · Salut +4", fn: function (st, rng, api) { api.exp(-70); api.stats(4, 11, 3); return "Retalles aparences buides i dediques recursos als teus pilars vitals autèntics."; } },
        { k: "B", t: "Marcar un pla d'acceleració de 5 anys cap al Coast FIRE", s: "+2.200 € · Skills +6 · Goig +5", fn: function (st, rng, api) { api.cash(2200); api.stats(1, 5, 6); return "Entres a la trentena amb un full de ruta nítid i motivador."; } },
        { k: "C", t: "Celebrar els 30 amb un viatge transoceànic de tres setmanes", s: "-3.100 € · Goig +16 · Salut +5", fn: function (st, rng, api) { api.cash(-3100); api.stats(5, 16, 1); return "Tornes del Japó amb la mirada renovada i gratitud profunda."; } }
      ]
    },
    {
      id: "ev_31_public_exam", minAge: 24, maxAge: 38, noFlag: "oposTried", tag: "ESTABILITAT",
      title: "Convocatòria oberta de places tècniques ben dotades",
      body: "Surt una oposició d'escala tècnica amb temari exigent però horari de 8h a 15h de per vida un cop superada.",
      opts: [
        { k: "A", t: "Tancar-te nou mesos a estudiar amb mètode d'opositor", s: "-1.200 € temari · 65% d'èxit (Sou +14% i calma)", fn: function (st, rng, api) { st.flags.oposTried = true; api.cash(-1200); if (rng() < 0.65 || st.skills >= 45) { api.salPct(14); api.stats(4, 12, 6); return "Plaça en propietat aconseguida! Seguretat fèrria i totes les tardes lliures!"; } api.stats(-5, -3, 5); return "Quedes a portes per dècimes, però el coneixement adquirit et serveix al sector privat."; } },
        { k: "B", t: "Descartar-ho: prefereixes el sostre obert de l'empresa i els negocis", s: "Skills +5 · Sou base +7%", fn: function (st, rng, api) { st.flags.oposTried = true; api.salPct(7); api.stats(1, 4, 5); return "Concentres la mateixa energia a escalar sense límits tabulats."; } },
        { k: "C", t: "Presentar-t'hi a la borsa d'interins per tenir un pla B", s: "-250 € · Goig +4 · Skills +3", fn: function (st, rng, api) { st.flags.oposTried = true; api.cash(-250); api.stats(1, 4, 3); return "Entres a llista de reserva com a xarxa de seguretat tranquil·litzadora."; } }
      ]
    },
    {
      id: "ev_31_solar_balcony", minAge: 26, maxAge: 62, tag: "ENERGIA & LLAR",
      title: "Pujada del rebut elèctric i autoconsum domèstic",
      body: "La factura energètica s'ha disparat. Pots instal·lar plaques/kit solar i bomba de calor eficient.",
      opts: [
        { k: "A", t: "Instal·lar autoconsum + domòtica d'hores vall amb bonificació d'IBI", s: "-2.900 € · Desp. -80€/m · Goig +6", fn: function (st, rng, api) { api.cash(-2900); api.exp(-80); api.stats(2, 6, 2); return "Amortitzes la inversió en tres anys i el sol del migdia et paga l'aire i l'aigua calenta!"; } },
        { k: "B", t: "Canviar al mercat regulat/tarifa òptima i posar regletes amb interruptor", s: "0 € · Desp. -35€/m", fn: function (st, rng, api) { api.exp(-35); api.stats(0, 3, 1); return "Sense gastar un euro retalles el consum fantasma un 20%."; } },
        { k: "C", t: "No tocar res i pagar els rebuts tal com arriben", s: "Despesa +30€/m", fn: function (st, rng, api) { api.exp(30); return "Assumir tarifes desactualitzades encareix l'hivern."; } }
      ]
    },
    {
      id: "ev_32_conference_speaker", minAge: 27, maxAge: 54, tag: "REPUTACIÓ",
      title: "Invitació a fer una ponència al congrés del teu sector",
      body: "Et fa respecte parlar davant 250 professionals, però és una vitrina immillorable per al teu nom.",
      opts: [
        { k: "A", t: "Assajar a fons i presentar un cas pràctic brillant amb dades reals", s: "Sou base +11% · Renda +95€/m · Skills +7", fn: function (st, rng, api) { api.salPct(11); api.side(95); api.stats(-1, 10, 7); return "Ovació a la sala! Surten dos clients d'assessoria i el teu prestigi fa un salt."; } },
        { k: "B", t: "Participar en una taula rodona coral més relaxada", s: "Skills +4 · Goig +6", fn: function (st, rng, api) { api.stats(1, 6, 4); return "Fas bons contactes al cafè sense els nervis del discurs solitari."; } },
        { k: "C", t: "Excusar-te per falta de temps", s: "Salut +2", fn: function (st, rng, api) { api.stats(2, 0, 0); return "T'estalvies els nervis, tot i deixar passar un bon altaveu."; } }
      ]
    },
    {
      id: "ev_32_therapy_clarity", minAge: 24, maxAge: 58, tag: "BENESTAR MENTAL",
      title: "Autoexigència excessiva i síndrome de l'impostor",
      body: "Tot i anar avançant bé, sents una pressió interna constant com si mai n'hi hagués prou.",
      opts: [
        { k: "A", t: "Fer un procés breu de psicologia rigorosa i diari de gratitud", s: "-840 € · Goig +15 · Salut +10 · Skills +3", fn: function (st, rng, api) { api.cash(-840); api.stats(10, 15, 3); return "Desmuntes pors heretades i aprens a gaudir del camí mentre el recorres."; } },
        { k: "B", t: "Instaurar desconnexió digital total de dissabte migdia a diumenge nit", s: "0 € · Goig +9 · Salut +7", fn: function (st, rng, api) { api.stats(7, 9, 1); return "Trenta-sis hores sense pantalles cada setmana et retornen la serenor."; } },
        { k: "C", t: "Tapar la inquietud comprant gadgets i treballant més hores", s: "-1.300 € · Salut -6 · Goig -4", fn: function (st, rng, api) { api.cash(-1300); api.stats(-6, -4, 1); return "Els paquets nous només calmen la inquietud durant vint minuts."; } }
      ]
    },
    {
      id: "ev_32_friend_loan", minAge: 26, maxAge: 56, tag: "RELACIONS & DINERS",
      title: "Un amic de tota la vida et demana 5.000 € per tapar un forat",
      body: "Porta anys desordenat amb les seves despeses però té bon fons i passa un mal tràngol puntual.",
      opts: [
        { k: "A", t: "Deixar-li 2.000 € que puguis donar per perduts + seure amb ell a fer un pla", s: "-1.000 € nets · Amistat salvada · Goig +8", fn: function (st, rng, api) { api.cash(-1000); api.stats(1, 8, 2); return "Et retorna la meitat i sobretot l'ajudes a posar ordre real a la seva economia."; } },
        { k: "B", t: "Prestar-li els 5.000 € esperant cobrar-los aviat", s: "Risc alt de perdre diners i amic", fn: function (st, rng, api) { if (rng() < 0.35) { api.stats(0, 6, 0); return "Compleix religiosament i et torna fins l'últim euro!"; } api.cash(-5000); api.stats(-2, -7, 1); return "Evita mirar-te als ulls als sopars i no en veus ni cinc (-5.000 €)."; } },
        { k: "C", t: "No barrejar diners amb amics però ajudar-lo a trobar encàrrecs pagats", s: "0 € · Goig +5 · Skills +2", fn: function (st, rng, api) { api.stats(1, 5, 2); return "Li aconsegueixes dos clients que li resolen el sotrac amb dignitat."; } }
      ]
    },

    // --- DÈCADA 33-42: CONSOLIDACIÓ, 100K, SALUT I LIDERATGE (14 esdeveniments) ---
    {
      id: "ev_34_first_100k", minAge: 25, maxAge: 62, needWorth: 100000, noFlag: "hit100kEvent", tag: "★ FITA 100.000 €",
      title: "Has travessat la frontera dels 100.000 € de patrimoni net!",
      body: "Charlie Munger repetia que els primers 100k costen suor i constància, però a partir d'aquí la bola de neu agafa inèrcia pròpia.",
      opts: [
        { k: "A", t: "Celebrar-ho amb un sopar memorable (220 €) i no tocar l'estil de vida", s: "-220 € · Goig +11 · Inèrcia total", fn: function (st, rng, api) { st.flags.hit100kEvent = true; api.cash(-220); api.stats(2, 11, 2); return "Un rendiment del 8% anual ja genera 8.000 € tot sol sense que moguis un dit!"; } },
        { k: "B", t: "Regalar-te una experiència vital llargament somiada (4.500 €)", s: "-4.500 € · Goig +18 · Salut +6", fn: function (st, rng, api) { st.flags.hit100kEvent = true; api.cash(-4500); api.stats(6, 18, 0); return "Transformes una petita fracció de l'èxit en records inesborrables."; } },
        { k: "C", t: "Consolidar una assignació tot-terreny ben diversificada", s: "+1.200 € optimització · Salut +4", fn: function (st, rng, api) { st.flags.hit100kEvent = true; api.cash(1200); api.stats(4, 6, 3); return "Revises costos i deixes la cartera llesta per créixer la propera dècada."; } }
      ]
    },
    {
      id: "ev_35_lifestyle_creep", minAge: 32, maxAge: 46, tag: "INFLACIÓ VITAL",
      title: "El parany del barri d'alt standing i el club exclusiu",
      body: "Els teus nous companys de feina gasten 4.000 €/mes en escoles d'elit, rellotges i segones residències hipotecades al límit.",
      opts: [
        { k: "A", t: "Practicar la «riquesa invisible»: vida còmoda però senzilla i cartera plena", s: "+3.400 € · Desp. -80€/m · Goig +8", fn: function (st, rng, api) { api.cash(3400); api.exp(-80); api.stats(3, 8, 2); return "Com diu Morgan Housel: la riquesa és allò que NO veus perquè no s'ha gastat."; } },
        { k: "B", t: "Mimetitzar el seu tren de vida per encaixar al cercle", s: "-6.000 € · Desp. +380€/m · Goig +4 · Salut -4", fn: function (st, rng, api) { api.cash(-6000); api.exp(380); api.stats(-4, 4, 1); return "Entres a la roda daurada: cobres molt però tornes a dependre de la nòmina del mes vinent."; } },
        { k: "C", t: "Gastar només en qualitat real (bon menjar i salut) ignorant símbols d'estatus", s: "Despesa +45€/m · Salut +8 · Goig +9", fn: function (st, rng, api) { api.exp(45); api.stats(8, 9, 1); return "Inverteixes en el que et nodreix per dins i passes de logotips per fora."; } }
      ]
    },
    {
      id: "ev_36_company_equity", minAge: 30, maxAge: 48, tag: "COMPENSACIÓ",
      title: "Paquet d'accions restringides (RSUs) o sou fix superior",
      body: "En una promoció interna et deixen triar entre cobrar més fix garantit o rebre opcions sobre accions de l'empresa.",
      opts: [
        { k: "A", t: "Agafar meitat pujada fixa (+10%) i meitat accions venent per diversificar", s: "Sou +10% · +6.500 € · Risc equilibrat", fn: function (st, rng, api) { api.salPct(10); api.cash(6500); api.stats(0, 7, 4); return "No concentres sou i patrimoni en una sola cistella i consolides un bon pessic."; } },
        { k: "B", t: "Apostar el 100% al paquet d'accions de l'empresa", s: "Pot donar +26.000 € o quedar en poc", fn: function (st, rng, api) { if (rng() < 0.5) { api.cash(26000); api.stats(0, 12, 3); return "L'acció es duplica en dos anys i fas caixa amb +26.000 €!"; } api.cash(2000); api.stats(-2, -3, 2); return "El sector es refreda i el paquet val tot just 2.000 €."; } },
        { k: "C", t: "Prioritzar 100% sou fix (+17%) que consolida base de cotització", s: "Sou base +17% · Tranquil·litat", fn: function (st, rng, api) { api.salPct(17); api.stats(2, 6, 2); return "Ingressos certíssims cada dia 28 sense mirar la cotització de la pròpia feina."; } }
      ]
    },
    {
      id: "ev_36_back_strength", minAge: 33, maxAge: 52, tag: "FORÇA & SALUT",
      title: "Contractura lumbar aguda recollint una caixa",
      body: "Una estrebada t'immobilitza tres dies. El traumatòleg és clar: o guanyes massa muscular al tronc ara, o patiràs dècades.",
      opts: [
        { k: "A", t: "Fisioteràpia + rutina sagrada d'entrenament de força 2 cops/setmana", s: "-480 € · Salut +16 · Goig +8", fn: function (st, rng, api) { api.cash(-480); api.stats(16, 8, 1); return "En sis mesos tens l'esquena més forta que als vint anys. Zero dolor!"; } },
        { k: "B", t: "Piscina municipal i estiraments matinals a la catifa", s: "Despesa +28€/m · Salut +11 · Goig +6", fn: function (st, rng, api) { api.exp(28); api.stats(11, 6, 0); return "Nedar d'esquena i estirar cada matí t'allibera la columna."; } },
        { k: "C", t: "Prendre antiinflamatoris i tornar a la cadira igual que abans", s: "Salut -11 · Goig -6", fn: function (st, rng, api) { api.stats(-11, -6, 0); return "El dolor es cronifica cada cop que canvia el temps."; } }
      ]
    },
    {
      id: "ev_37_tax_funds_transfer", minAge: 30, maxAge: 66, tag: "FISCALITAT INTEL·LIGENT",
      title: "ETFs amb peatge fiscal contra Fons Indexats traspasables",
      body: "Toca reequilibrar la cartera acumulada. Si vens amb plusvàlues pagues entre el 19% i el 26% a Hisenda; amb traspàs entre fons, 0 €.",
      opts: [
        { k: "A", t: "Estructurar el nucli en fons d'acumulació amb traspàs exempt", s: "+3.600 € efecte fiscal compost · Skills +5", fn: function (st, rng, api) { api.cash(3600); api.stats(1, 5, 5); return "Deixes treballant per a tu els impostos diferits durant vint o trenta anys més!"; } },
        { k: "B", t: "Compensar pèrdues latents amb guanys (Tax-Loss Harvesting legal)", s: "+2.100 € estalvi IRPF · Skills +4", fn: function (st, rng, api) { api.cash(2100); api.stats(0, 4, 4); return "Neteges posicions vermelles per reduir la factura fiscal d'enguany amb tota la llei."; } },
        { k: "C", t: "Provar una societat pantalla opaca recomanada en un fòrum", s: "Alt risc d'inspecció severa", fn: function (st, rng, api) { if (rng() < 0.32) { api.cash(8500); return "De moment passa desapercebuda (+8.500 €)."; } api.cash(-14000); api.stats(-5, -10, 2); return "Requeriment d'Hisenda amb recàrrec i sanció (-14.000 €). Lliçó apresa."; } }
      ]
    },
    {
      id: "ev_38_book_patent", minAge: 32, maxAge: 62, tag: "ACTIU INTANGIBLE",
      title: "Sistematitzar el teu mètode en una guia / curs tècnic",
      body: "Portes més d'una dècada resolent problemes reals. Pots compilar-ho en un manual o curs enregistrat.",
      opts: [
        { k: "A", t: "Escriure i gravar l'edició definitiva durant tres mesos als matins", s: "-600 € · Renda de drets +190€/m · Skills +7", fn: function (st, rng, api) { api.cash(-600); api.side(190); api.stats(-2, 10, 7); return "Es converteix en referència del nínxol i et genera drets d'autor cada mes mentre dorms!"; } },
        { k: "B", t: "Fer tallers intensius en directe per a empreses dos cops l'any", s: "+4.400 € nets · Skills +5 · Goig +6", fn: function (st, rng, api) { api.cash(4400); api.stats(-1, 6, 5); return "Factures molt bé dues setmanes l'any sense mantenir plataforma pròpia."; } },
        { k: "C", t: "Compartir quatre articles breus oberts i guardar-te el temps", s: "Goig +5 · Skills +2", fn: function (st, rng, api) { api.stats(2, 5, 2); return "Aportes a la professió sense embarcar-te en mesos d'edició."; } }
      ]
    },
    {
      id: "ev_38_olive_land", minAge: 33, maxAge: 68, tag: "TERRA & ARRELS",
      title: "Un tros d'oliveres centenàries i ametllers d'un familiar",
      body: "Surt a la venda per pocs diners una finca rústica amb caseta d'eines legalitzada a la comarca.",
      opts: [
        { k: "A", t: "Comprar-la al comptat: oli propi per a tot l'any i caps de setmana a l'aire lliure", s: "-9.500 € · Desp. -35€/m · Salut +10 · Goig +14", fn: function (st, rng, api) { api.cash(-9500); api.exp(-35); api.stats(10, 14, 2); return "Podar a l'hivern i premsar el teu propi oli verge extra et connecta amb la terra."; } },
        { k: "B", t: "Comprar-la i cedir l'explotació a un pagès jove a canvi de neteja i collita", s: "-9.500 € · Renda/espècie +45€/m · Goig +9", fn: function (st, rng, api) { api.cash(-9500); api.side(45); api.stats(4, 9, 1); return "Mantens el paisatge viu sense esclavitzar-te cada cap de setmana."; } },
        { k: "C", t: "Deixar-la passar per no dispersar atenció", s: "Capital intacte", fn: function (st, rng, api) { api.stats(1, 1, 0); return "Evites afegir manteniment rústic a la teva llista."; } }
      ]
    },
    {
      id: "ev_39_layoff_reorg", minAge: 31, maxAge: 56, tag: "REESTRUCTURACIÓ",
      title: "Fusió corporativa i pla de sortides indemnitzades",
      body: "Un grup estranger compra l'empresa i ofereix 33 dies per any treballat a qui s'aculli a la sortida voluntària.",
      opts: [
        { k: "A", t: "Acollir-te a la indemnització (+24.000 €) tenint ja converses avançades fora", s: "+24.000 € nets · Sou base +6% · Goig +10", fn: function (st, rng, api) { api.cash(24000); api.salPct(6); api.stats(3, 10, 4); return "Jugada mestra: cobres la motxilla sencera al comptat i t'incorpores un mes després millorant sou!"; } },
        { k: "B", t: "Quedar-te liderant la integració dels equips", s: "Sou base +19% · Salut -6 · Skills +6", fn: function (st, rng, api) { api.salPct(19); api.stats(-6, 2, 6); return "Assumeixes un lloc clau al nou organigrama amb fort augment retributiu."; } },
        { k: "C", t: "Agafar la indemnització (+24.000 €) i regalar-te mig any de reciclatge tranquil", s: "+16.500 € nets · Salut +12 · Goig +14 · Skills +7", fn: function (st, rng, api) { api.cash(16500); api.stats(12, 14, 7); return "Descanses, t'actualitzes sense pressa i encara sumes capital net!"; } }
      ]
    },
    {
      id: "ev_40_inheritance_merce", minAge: 36, maxAge: 62, noFlag: "gotAuntInher", tag: "LLEGAT INESPERAT",
      title: "La llibreta d'estalvis de la tieta Mercè",
      body: "Una tieta sòbria i molt estimada et deixa en testament 29.000 € nets després d'impostos i la seva taula de noguera.",
      opts: [
        { k: "A", t: "Aportar-los escalonadament (DCA) a la cartera global d'actius", s: "+29.000 € al motor compost · Goig +5", fn: function (st, rng, api) { st.flags.gotAuntInher = true; api.cash(29000); api.stats(1, 5, 2); return "Honores tota una vida de formigueta convertint-la en llibertat intergeneracional."; } },
        { k: "B", t: "Invertir 21.000 € i dedicar 8.000 € a un record familiar perdurable", s: "+21.000 € · Goig +16 · Salut +5", fn: function (st, rng, api) { st.flags.gotAuntInher = true; api.cash(21000); api.stats(5, 16, 1); return "Restaures la taula, reuneixes la família i fas créixer la resta amb seny."; } },
        { k: "C", t: "Eixugar costos fixos a casa (aïllament/equipament) i guardar 22.000 €", s: "+22.000 € · Desp. -95€/m · Goig +9", fn: function (st, rng, api) { st.flags.gotAuntInher = true; api.cash(22000); api.exp(-95); api.stats(3, 9, 1); return "Redueixes factures mensuals per sempre i engreixes les reserves."; } }
      ]
    },
    {
      id: "ev_40_fire_milestone", minAge: 32, maxAge: 66, needFire: true, noFlag: "retiredEarlyChoice", tag: "★ 100% FIRE ASSOLIT!",
      title: "El teu patrimoni ja pot pagar tota la teva vida!",
      body: "Segons la teva taxa de retirada segura i les teves rendes, ja no necessites intercanviar hores per sou obligatòriament.",
      opts: [
        { k: "A", t: "Declarar el FIRE! Passar a mode Jubilat/Lliure i viure de passions", s: "Mode FIRE actiu · Salut +20 · Goig +24", fn: function (st, rng, api) { st.flags.retiredEarlyChoice = true; st.flags.fireAge = st.age; st.workMode = "retired"; api.stats(20, 24, 2); return "Llibertat conquerida als " + st.age + " anys! El dilluns al matí ara és tan teu com el diumenge."; } },
        { k: "B", t: "Passar a setmana de 4 dies només en el que et diverteix", s: "Mode 4 Dies · Salut +14 · Goig +18", fn: function (st, rng, api) { st.flags.retiredEarlyChoice = true; st.flags.fireAge = st.age; st.workMode = "fourday"; api.stats(14, 18, 3); return "Treballar sense cap por d'acomiadament transforma completament l'experiència."; } },
        { k: "C", t: "Fer un any extra («One More Year») per construir un marge Dinàstic", s: "+6.000 € impuls · Goig +8", fn: function (st, rng, api) { st.flags.retiredEarlyChoice = true; st.flags.fireAge = st.age; api.cash(6000); api.stats(3, 8, 2); return "Blindes un matalàs addicional amb la serenor de saber que ja has guanyat la partida."; } }
      ]
    },
    {
      id: "ev_41_local_coop", minAge: 34, maxAge: 64, tag: "ECONOMIA REAL",
      title: "Obrador / cooperativa alimentària i energètica del poble",
      body: "Veïns solvents impulsen una cooperativa de consum i sostre fotovoltaic compartit amb retorn del 5% en factura.",
      opts: [
        { k: "A", t: "Aportar 1.800 € de capital social retornable i comprar de km 0", s: "-1.800 € · Desp. -60€/m · Salut +7 · Goig +9", fn: function (st, rng, api) { api.cash(-1800); api.exp(-60); api.stats(7, 9, 2); return "Producte fresc sense intermediaris, energia barata i teixit veïnal viu."; } },
        { k: "B", t: "Fer-te soci només consumidor amb quota mínima", s: "-120 € · Salut +4 · Goig +4", fn: function (st, rng, api) { api.cash(-120); api.stats(4, 4, 0); return "Millores el cistell setmanal amb compromís lleuger."; } },
        { k: "C", t: "Continuar comprant a gran superfície per rapidesa", s: "Sense canvis", fn: function (st, rng, api) { return "Prioritzes fer tota la compra en mitja hora amb el carretó."; } }
      ]
    },
    {
      id: "ev_41_cyber_fraud", minAge: 25, maxAge: 78, tag: "SEGURETAT PATRIMONIAL",
      title: "Intent sofisticat de suplantació bancària per veu i SMS",
      body: "Reps una trucada idèntica a la del teu banc alertant d'un moviment estrany i demanant un codi de verificació urgent.",
      opts: [
        { k: "A", t: "Penjar a l'instant, trucar tu al número oficial i activar claus físiques 2FA", s: "-90 € claus · Patrimoni 100% blindat · Skills +4", fn: function (st, rng, api) { api.cash(-90); api.stats(1, 5, 4); return "Sang freda exemplar: avortes l'estafa i blindes tots els comptes amb doble factor físic!"; } },
        { k: "B", t: "Dubtar uns segons però bloquejar targetes a temps", s: "Ensurt sense pèrdua · Salut -2", fn: function (st, rng, api) { api.stats(-2, 0, 2); return "T'adones de l'engany just abans de dictar l'últim dígit."; } },
        { k: "C", t: "Confiar amb pressa perquè estaves en plena reunió", s: "-4.800 € estafats · Goig -10", fn: function (st, rng, api) { api.cash(-4800); api.stats(-4, -10, 2); return "Tràngol amarg i denúncia als Mossos: costa mesos recuperar-ne només una part (-4.800 €)."; } }
      ]
    },
    {
      id: "ev_42_dental_orthodon", minAge: 34, maxAge: 58, tag: "SALUT",
      title: "Bruxisme nocturn i desgast d'esmalt per tensió",
      body: "L'odontòleg detecta que apretes les dents dormint. Una fèrula de descàrrega a mida evita fractures de queixals.",
      opts: [
        { k: "A", t: "Fèrula rígida a mida + revisió d'hàbits nocturns", s: "-390 € · Salut +9 · Goig +5", fn: function (st, rng, api) { api.cash(-390); api.stats(9, 5, 0); return "S'acaben les migranyes matinals i protegeixes les peces dentals per a la vellesa."; } },
        { k: "B", t: "Tractament complet d'alineació d'oclusió i fèrula", s: "-2.600 € · Salut +12 · Goig +9", fn: function (st, rng, api) { api.cash(-2600); api.stats(12, 9, 0); return "Mossegada equilibrada i somriure sa per a les pròximes quatre dècades."; } },
        { k: "C", t: "Deixar-ho per a l'any que ve", s: "Salut -6 · Risc d'implant car", fn: function (st, rng, api) { api.cash(-1100); api.stats(-6, -4, 0); return "Es clivella un premolar mastegant ametlles i toca posar corona (-1.100 €)."; } }
      ]
    },
    {
      id: "ev_42_angel_syndicate", minAge: 34, maxAge: 62, needWorth: 80000, tag: "INVERSIÓ PRIVADA",
      title: "Club d'inversors industrials en pimes rendibles",
      body: "Un grup seriós d'enginyers i financers inverteix tiquets de 10.000 € en tallers i empreses B2B sense relleu generacional.",
      opts: [
        { k: "A", t: "Entrar-hi amb 10.000 € diversificats en tres pimes amb flux de caixa real", s: "-10.000 € líquids · Renda dividend +145€/m", fn: function (st, rng, api) { api.cash(-10000); api.side(145); api.stats(0, 6, 5); return "Economia productiva tangible: cobres un ~17% anual en dividends industrials!"; } },
        { k: "B", t: "Participar només com a conseller tècnic cobrant dieta per reunió", s: "+2.400 € · Skills +6 · Zero capital en risc", fn: function (st, rng, api) { api.cash(2400); api.stats(1, 5, 6); return "Aportes criteri als consells sense immobilitzar capital."; } },
        { k: "C", t: "Mantenir el 100% en mercats cotitzats amb liquiditat diària", s: "Simplicitat màxima · Goig +2", fn: function (st, rng, api) { api.stats(1, 2, 1); return "Valors poder vendre qualsevol posició en tres segons si mai ho necessites."; } }
      ]
    },

    // --- DÈCADA 43-54: CRUÏLLA DELS 45, PARES GRANS, SALUT HORMONAL I MADURESA (14 esdeveniments) ---
    {
      id: "ev_44_midlife_crossroad", minAge: 42, maxAge: 52, noFlag: "midlifeDone", tag: "CRUÏLLA DELS 45",
      title: "La meitat conscient de la vida adulta",
      body: "Ja no et mou demostrar res als desconeguts. Saps quines tasques t'encenen i quines reunions et roben l'ànima.",
      opts: [
        { k: "A", t: "Pactar rol d'expert sènior amb divendres lliures (4 dies)", s: "Mode 4 Dies · Salut +14 · Goig +16", fn: function (st, rng, api) { st.flags.midlifeDone = true; st.workMode = "fourday"; api.stats(14, 16, 3); return "Cinquanta-dos caps de setmana de tres dies cada any: riquesa temporal majúscula!"; } },
        { k: "B", t: "Acceptar una direcció d'àrea durant uns anys forts per blindar el retir", s: "Sou base +32% · Salut -9 · Goig -3 · Skills +6", fn: function (st, rng, api) { st.flags.midlifeDone = true; api.salPct(32); api.stats(-9, -3, 6); return "Empentes l'accelerador patrimonial amb data de caducitat ben pensada."; } },
        { k: "C", t: "Desenvolupar una línia d'ofici o consultoria d'autor al teu ritme", s: "Sou -12% · Renda +290€/m · Goig +17 · Salut +6", fn: function (st, rng, api) { st.flags.midlifeDone = true; api.salPct(-12); api.side(290); api.stats(6, 17, 5); return "Cada matí treballes en encàrrecs escollits amb un somriure serè."; } }
      ]
    },
    {
      id: "ev_45_aging_parents", minAge: 43, maxAge: 62, noFlag: "parentsCare", tag: "GENERACIÓ SANDVITX",
      title: "Els pares comencen a necessitar suport a casa",
      body: "Una caiguda lleu a les escales t'avisa que els teus pares ja no tenen l'agilitat d'abans i cal adaptar el seu dia a dia.",
      opts: [
        { k: "A", t: "Adaptar el seu bany (plat de dutxa) i organitzar suport domiciliari amb germans", s: "-3.400 € · Desp. +90€/m · Salut +4 · Goig +11", fn: function (st, rng, api) { st.flags.parentsCare = true; api.cash(-3400); api.exp(90); api.stats(4, 11, 2); return "Poden continuar vivint a casa seva amb seguretat, dignitat i la teva visita tranquil·la."; } },
        { k: "B", t: "Assumir tu gairebé totes les gestions i cures després de la feina", s: "-800 € · Salut -11 · Goig +4", fn: function (st, rng, api) { st.flags.parentsCare = true; api.cash(-800); api.stats(-11, 4, 1); return "Ho fas amb tot l'amor del món, però el cansament físic i mental pesa força."; } },
        { k: "C", t: "Tramitar ajuts de dependència aviat i contractar centre de dia proper", s: "-1.600 € · Desp. +130€/m · Salut +5 · Goig +9", fn: function (st, rng, api) { st.flags.parentsCare = true; api.cash(-1600); api.exp(130); api.stats(5, 9, 3); return "Estan actius, acompanyats d'iguals i tota la família respira més serena."; } }
      ]
    },
    {
      id: "ev_46_cardio_vo2max", minAge: 43, maxAge: 58, tag: "MEDICINA PREVENTIVA",
      title: "Prova d'esforç, VO2 màx i analítica completa als 45+",
      body: "La medicina de la longevitat demostra que la capacitat cardiorespiratòria i la força als 50 prediuen com viuràs als 80.",
      opts: [
        { k: "A", t: "Revisió esportiva completa + protocol de zona 2 i peses constants", s: "-420 € · Salut +17 · Goig +10", fn: function (st, rng, api) { api.cash(-420); api.stats(17, 10, 2); return "Les teves artèries i músculs rejoveneixen una dècada sencera!"; } },
        { k: "B", t: "Suprimir alcohol entre setmana, menjar mediterrani i caminar 10.000 passos", s: "Despesa -75€/m · Salut +13 · Goig +7", fn: function (st, rng, api) { api.exp(-75); api.stats(13, 7, 1); return "Dorms més profund, perds inflamació i a sobre estalvies diners."; } },
        { k: "C", t: "Deixar les revisions per quan notis algun símptoma", s: "Salut -9", fn: function (st, rng, api) { api.stats(-9, -2, 0); return "La tensió arterial puja en silenci sense que li posis fre."; } }
      ]
    },
    {
      id: "ev_47_ai_disruption", minAge: 38, maxAge: 58, tag: "TRANSFORMACIÓ TÈCNICA",
      title: "Noves eines d'IA automatitzen la meitat del teu sector",
      body: "Els perfils que repeteixen tasques mecàniques perden pes, mentre que qui sap dirigir sistemes i validar criteri dispara la seva cotització.",
      opts: [
        { k: "A", t: "Aprendre a fons les noves eines i redissenyar el flux del teu equip", s: "-700 € · Sou base +18% · Skills +10", fn: function (st, rng, api) { api.cash(-700); api.salPct(18); api.stats(1, 8, 10); return "Combines l'experiència veterana amb velocitat punta: et tornes imprescindible!"; } },
        { k: "B", t: "Pivotar cap al tracte humà directe, negociació i confiança presencial", s: "Sou base +8% · Goig +8 · Skills +5", fn: function (st, rng, api) { api.salPct(8); api.stats(3, 8, 5); return "Com més digital és tot, més es paga una encaixada de mans honesta i experta."; } },
        { k: "C", t: "Resistir-te al canvi pensant que és una moda passatgera", s: "Sou base -9% · Goig -5", fn: function (st, rng, api) { api.salPct(-9); api.stats(-2, -5, 0); return "Veus com projectes interessants passen de llarg cap a equips més àgils."; } }
      ]
    },
    {
      id: "ev_48_second_home_trap", minAge: 42, maxAge: 62, needWorth: 140000, tag: "DILEMA PATRIMONIAL",
      title: "La febre de comprar un segon apartament només per a l'agost",
      body: "Uns amics s'han comprat un apartament a la costa per anar-hi 25 dies l'any i et tempten de comprar el del costat.",
      opts: [
        { k: "A", t: "Fer números freds: llogar un lloc diferent cada estiu i mantenir el capital rendint", s: "-2.200 € vacances top · +7.500 € rendiment estalviat · Goig +12", fn: function (st, rng, api) { api.cash(5300); api.stats(4, 12, 3); return "Zero derrames de façana ni IBI d'11 mesos buits, i cada any descobreixes una costa nova!"; } },
        { k: "B", t: "Si compres maó, fer-ho a la pestanya Actius com a inversió que es llogui 11 mesos", s: "Criteri inversor · Skills +4 · Goig +6", fn: function (st, rng, api) { api.stats(2, 6, 4); return "Distingeixes clarament entre un passiu d'oci i un actiu generador de rendes."; } },
        { k: "C", t: "Comprar capritx d'estiu buit assumint totes les despeses fixes", s: "-38.000 € · Desp. +260€/m · Goig +10", fn: function (st, rng, api) { api.cash(-38000); api.exp(260); api.stats(2, 10, 0); return "Gaudeixes del teu racó fix al mar, tot i el pes constant de comunitat i impostos."; } }
      ]
    },
    {
      id: "ev_49_camino_walk", minAge: 40, maxAge: 68, tag: "SIMPLICITAT",
      title: "Quinze dies caminant amb una motxilla de sis quilos",
      body: "Et planteges travessar el Pirineu o fer un tram tranquil a peu per comprovar quantes poques coses necessites de debò.",
      opts: [
        { k: "A", t: "Caminar 25 km al dia de refugi en refugi sense pressa", s: "-620 € · Salut +14 · Goig +16", fn: function (st, rng, api) { api.cash(-620); api.stats(14, 16, 2); return "Tornes amb les cames fortes, el cap net i adonant-te que la felicitat cap en 6 kg."; } },
        { k: "B", t: "Fer ruta cicloturista d'alforges per vies verdes", s: "-540 € · Salut +13 · Goig +14", fn: function (st, rng, api) { api.cash(-540); api.stats(13, 14, 1); return "El vent a la cara i pobles silenciosos et renoven de dalt a baix."; } },
        { k: "C", t: "Quedar-te a casa posant al dia reparacions pendents", s: "-200 € · Desp. -30€/m · Goig +4", fn: function (st, rng, api) { api.cash(-200); api.exp(-30); api.stats(2, 4, 2); return "Deixes la llar impecable i resols quatre petits desperfectes."; } }
      ]
    },
    {
      id: "ev_50_half_century", minAge: 50, maxAge: 52, tag: "50 ANYS",
      title: "Mig segle viscut: saviesa, amics i patrimoni",
      body: "Arribes als 50 anys! Tens prou perspectiva per saber qui hi és quan les coses van mal dades i què val el teu temps.",
      opts: [
        { k: "A", t: "Organitzar un dinar llarg a l'aire lliure amb les 20 persones essencials", s: "-1.250 € · Goig +19 · Salut +5", fn: function (st, rng, api) { api.cash(-1250); api.stats(5, 19, 1); return "Brindis, abraçades sinceres i converses fins al capvespre: el veritable dividend humà."; } },
        { k: "B", t: "Revisar tota l'arquitectura patrimonial per a l'etapa 50→70", s: "+4.200 € optimització de comissions i impostos · Skills +5", fn: function (st, rng, api) { api.cash(4200); api.stats(2, 8, 5); return "Podes costos financers residuals i deixes la cartera afinada com un violí."; } },
        { k: "C", t: "Aprendre des de zero un instrument musical o la fusteria", s: "-750 € · Goig +14 · Salut +4 · Skills +4", fn: function (st, rng, api) { api.cash(-750); api.stats(4, 14, 4); return "Tornar a ser principiant als cinquanta manté la neuroplasticitat ben desperta!"; } }
      ]
    },
    {
      id: "ev_51_board_advisor", minAge: 46, maxAge: 66, needSkills: 55, tag: "CONSELL ASSESSOR",
      title: "Proposta per entrar al consell assessor d'una empresa mitjana",
      body: "Pel teu historial sòlid et conviden a assistir a una reunió mensual d'estratègia per orientar la direcció jove.",
      opts: [
        { k: "A", t: "Acceptar la vocalia assessora cobrant retribució mensual fixa", s: "Renda lateral +350€/m · Goig +9 · Skills +5", fn: function (st, rng, api) { api.side(350); api.stats(0, 9, 5); return "Un matí al mes aportant visió de llarg termini per 4.200 € anuals nets!"; } },
        { k: "B", t: "Cobrar meitat en efectiu i meitat en participació de beneficis", s: "+5.500 € · Renda +160€/m · Goig +8", fn: function (st, rng, api) { api.cash(5500); api.side(160); api.stats(0, 8, 5); return "T'alinees amb els resultats i reben amb entusiasme les teves millores."; } },
        { k: "C", t: "Declinar per mantenir el calendari totalment buit d'obligacions", s: "Salut +5 · Goig +5", fn: function (st, rng, api) { api.stats(5, 5, 0); return "Protegeixes la teva agenda lliure com el tresor més preuat."; } }
      ]
    },
    {
      id: "ev_52_home_insulation", minAge: 44, maxAge: 68, tag: "CONFORT & ESTALVI",
      title: "Reforma intel·ligent de cuina i confort tèrmic a casa",
      body: "Després de tants anys d'ús, renovar aïllament i electrodomèstics A+++ pot fer la llar molt més agradable i econòmica.",
      opts: [
        { k: "A", t: "Reforma funcional pensada per durar 30 anys i gastar poca energia", s: "-8.200 € · Desp. -105€/m · Goig +13 · Salut +5", fn: function (st, rng, api) { var c = st.flags.rehabSkill ? -6200 : -8200; api.cash(c); api.exp(-105); api.stats(5, 13, 2); return "Silenci acústic, temperatura estable tot l'any i estalvi mensual permanent."; } },
        { k: "B", t: "Renovar només els electrodomèstics clau i pintar amb llum clara", s: "-2.100 € · Desp. -35€/m · Goig +7", fn: function (st, rng, api) { api.cash(-2100); api.exp(-35); api.stats(2, 7, 1); return "Rentat de cara molt efectiu amb inversió continguda."; } },
        { k: "C", t: "Embarcar-te en una reforma de revista de luxe que es dispara", s: "-24.000 € · Goig +9 · Salut -4", fn: function (st, rng, api) { api.cash(-24000); api.stats(-4, 9, 0); return "Marbre italià espectacular, però quatre mesos de retards i pressupost doblat."; } }
      ]
    },
    {
      id: "ev_52_sleep_apnea_check", minAge: 45, maxAge: 68, tag: "SALUT DEL SON",
      title: "Roncs nocturns i somnolència després de dinar",
      body: "Notes que tot i dormir set o vuit hores no t'aixeques del tot fresc. El metge suggereix revisar la qualitat respiratòria nocturna.",
      opts: [
        { k: "A", t: "Estudi del son, baixar 4 kg de greix visceral i sopar lleuger a les 20h", s: "-280 € · Salut +15 · Goig +10", fn: function (st, rng, api) { api.cash(-280); api.stats(15, 10, 0); return "Sopar d'hora i perdre volum abdominal transforma radicalment l'oxigenació nocturna!"; } },
        { k: "B", t: "Seguir el tractament pautat amb disciplina", s: "-450 € · Salut +12 · Goig +7", fn: function (st, rng, api) { api.cash(-450); api.stats(12, 7, 0); return "Tornes a tenir tardes lúcides i protegeixes el cor a llarg termini."; } },
        { k: "C", t: "Treure-hi importància tirant d'espressos dobles", s: "Salut -10 · Goig -4", fn: function (st, rng, api) { api.stats(-10, -4, 0); return "El descans fragmentat desgasta el sistema cardiovascular any rere any."; } }
      ]
    },
    {
      id: "ev_53_philanthropy_scholarship", minAge: 46, maxAge: 78, needWorth: 220000, tag: "IMPACTE LOCAL",
      title: "Beca d'oficis i ciència a l'institut públic on vas estudiar",
      body: "La direcció del centre busca exalumnes per dotar dos premis anuals de material i matrícula per a joves brillants sense recursos.",
      opts: [
        { k: "A", t: "Dotar la beca amb deducció de mecenatge (cost net 2.800 €) i fer-los una xerrada", s: "-2.800 € · Goig +19 · Salut +4", fn: function (st, rng, api) { api.cash(-2800); api.stats(4, 19, 2); return "Veure com dos joves talentosos poden estudiar gràcies a tu t'emociona profundament."; } },
        { k: "B", t: "Donar ordinadors renovats i dedicar dues tardes de mentoria gratuïta", s: "-900 € · Goig +13 · Skills +2", fn: function (st, rng, api) { api.cash(-900); api.stats(2, 13, 2); return "Ajuda directa, tangible i molt agraïda pels estudiants."; } },
        { k: "C", t: "Posposar-ho per a més endavant", s: "Sense canvis", fn: function (st, rng, api) { return "Mantens les reserves concentrades en el pla familiar."; } }
      ]
    },
    {
      id: "ev_54_interest_rate_shift", minAge: 36, maxAge: 68, tag: "CICLE MONETARI",
      title: "El Banc Central apuja tipus i les Lletres i Bons tornen a pagar un 4%",
      body: "Després d'anys de tipus zero, la renda fixa de qualitat torna a oferir rendiment real positiu per a la part conservadora.",
      opts: [
        { k: "A", t: "Moure la liquiditat morta cap a fons monetaris i bons curts de qualitat", s: "+2.900 € rendiment extra · Skills +3", fn: function (st, rng, api) { api.cash(2900); api.stats(1, 5, 3); return "Fins i tot el teu coixí de seguretat ara treballa i bat els comptes corrents a zero!"; } },
        { k: "B", t: "Aprofitar la caiguda temporal d'immobles i accions de dividend per comprar", s: "+4.600 € revaloració · Renda +65€/m", fn: function (st, rng, api) { api.cash(4600); api.side(65); api.stats(0, 6, 4); return "Quan el crèdit s'encareix, qui té caixa compra amb descompte als qui han de vendre!"; } },
        { k: "C", t: "Deixar els estalvis al compte corrent del banc de sempre al 0,05%", s: "Cost d'oportunitat · Goig -1", fn: function (st, rng, api) { api.stats(0, -1, 0); return "Regales marge financer al banc per pura inèrcia."; } }
      ]
    },
    {
      id: "ev_54_couple_renewal", minAge: 42, maxAge: 68, reqFlag: "hasPartner", tag: "PARELLA & TEMPS",
      title: "Evitar la rutina després d'anys de responsabilitats",
      body: "Entre feina, casa i obligacions és fàcil funcionar com a socis logístics i oblidar per què us vau enamorar.",
      opts: [
        { k: "A", t: "Instaurar el «dimecres de cita» caminant i sopant tranquil·lament + escapada anual", s: "-1.100 € · Goig +17 · Salut +6", fn: function (st, rng, api) { api.cash(-1100); api.stats(6, 17, 0); return "Cuidar el vincle cada setmana és la millor inversió patrimonial i emocional que existeix."; } },
        { k: "B", t: "Aprendre junts ball, vela lleugera o ceràmica un vespre per setmana", s: "Despesa +60€/m · Goig +14 · Salut +7", fn: function (st, rng, api) { api.exp(60); api.stats(7, 14, 2); return "Riure junts aprenent alguna cosa nova revifa tota la complicitat."; } },
        { k: "C", t: "Deixar que el calendari segueixi en pilot automàtic", s: "Goig -6 · Salut -2", fn: function (st, rng, api) { api.stats(-2, -6, 0); return "Els silencis al sofà es fan una mica més llargs."; } }
      ]
    },
    {
      id: "ev_54_career_legacy_mentor", minAge: 45, maxAge: 65, tag: "MESTRATGE",
      title: "Formar la pedrera jove de l'ofici o guardar-te els trucs",
      body: "Entren joves amb empenta a l'equip. Alguns veterans amaguen informació per por de ser substituïts.",
      opts: [
        { k: "A", t: "Ser el mentor generós que tothom recorda: documentar i elevar l'equip", s: "Sou base +11% · Goig +13 · Salut +4 · Skills +4", fn: function (st, rng, api) { api.salPct(11); api.stats(4, 13, 4); return "Et guanyes el respecte unànime, et descarreguen de feina pesada i et promouen com a referent!"; } },
        { k: "B", t: "Pactar bonus d'objectius d'equip compartit", s: "+3.900 € · Goig +8 · Skills +3", fn: function (st, rng, api) { api.cash(3900); api.stats(1, 8, 3); return "L'equip supera totes les previsions i cobreu la prima sencera."; } },
        { k: "C", t: "Treballar com una illa tancada fent només el teu tros", s: "Goig -3", fn: function (st, rng, api) { api.stats(0, -3, 0); return "Conservador però solitari; perds l'energia dels equips cohesionats."; } }
      ]
    }
  ];

  EVENTS = EVENTS.concat(MORE_EVENTS_MID);

  // ==================== EXPANSIÓ DE MADURESA I LONGEVITAT (55–85 ANYS) ====================
  var MORE_EVENTS_LATE = [
    // --- DÈCADA 55-68: PRE-JUBILACIÓ, PENSIÓ, RENDES I TRANSICIÓ SERENA (16 esdeveniments) ---
    {
      id: "ev_56_pension_max_base", minAge: 54, maxAge: 66, tag: "COTITZACIÓ & RETIR",
      title: "Càlcul dels últims anys per a la pensió pública",
      body: "Revises l'informe de vida laboral. Ajustar com cotitzes en aquesta recta final pot marcar centenars d'euros mensuals als 67.",
      opts: [
        { k: "A", t: "Optimitzar bases de cotització legalment i mantenir ritme sostenible", s: "Futura pensió reforçada · Skills +4 · Goig +6", fn: function (st, rng, api) { st.yearsWorked += 2; api.stats(2, 6, 4); return "Deixes lligat un terra d'ingressos vitalici que sumarà a la teva pròpia cartera!"; } },
        { k: "B", t: "No comptar gens amb l'Estat i reforçar cartera privada en 5.000 €", s: "+5.000 € estalvi extra · Autonomia pura", fn: function (st, rng, api) { api.cash(5000); api.stats(-2, 4, 3); return "El que vingui de pensió serà un regal extra; la teva llibertat ja depèn només de tu."; } },
        { k: "C", t: "Signar conveni especial mentre redueixes hores", s: "-1.800 € · Salut +9 · Goig +10", fn: function (st, rng, api) { st.yearsWorked += 1; api.cash(-1800); api.stats(9, 10, 2); return "Guanyes temps lliure avui sense perdre drets de cotització demà."; } }
      ]
    },
    {
      id: "ev_57_downsize_flat", minAge: 55, maxAge: 74, needWorth: 120000, noFlag: "downsizedHome", tag: "SIMPLIFICACIÓ",
      title: "Pis gran amb habitacions buides o planta amb ascensor i sol?",
      body: "Mantenir metres quadrats que ja no uses costa calefacció, neteja i escales. Pots canviar a un espai lluminós a peu pla.",
      opts: [
        { k: "A", t: "Permutar/mudar a un pis assolellat més manejable alliberant capital", s: "+42.000 € nets · Desp. -130€/m · Goig +11", fn: function (st, rng, api) { st.flags.downsizedHome = true; api.cash(42000); api.exp(-130); api.stats(5, 11, 2); return "Zero barreres arquitectòniques, menys feina domèstica i +42.000 € treballant a cartera!"; } },
        { k: "B", t: "Conservar la casa familiar com a punt de trobada per Nadal i estius", s: "Goig +12 · Desp. +40€/m", fn: function (st, rng, api) { st.flags.downsizedHome = true; api.exp(40); api.stats(1, 12, 0); return "Les parets plenes de fotos i sobretaules familiars tenen un valor emocional incalculable."; } },
        { k: "C", t: "Llogar la plaça gran o estudi independent annex", s: "Renda +175€/m · Goig +5", fn: function (st, rng, api) { st.flags.downsizedHome = true; api.side(175); api.stats(1, 5, 2); return "Treus rendiment de l'espai sobrant sense mudar-te del teu barri."; } }
      ]
    },
    {
      id: "ev_58_joints_mobility", minAge: 55, maxAge: 76, tag: "MOBILITAT ARTICULAR",
      title: "Genolls i malucs demanen moviment intel·ligent",
      body: "Notes rigidesa al matí quan fa humitat. Els músculs forts són el millor amortidor per a les articulacions.",
      opts: [
        { k: "A", t: "Ioga suau, bicicleta sense impacte i peses guiades", s: "-360 € · Salut +16 · Goig +10", fn: function (st, rng, api) { api.cash(-360); api.stats(16, 10, 1); return "Puges escales de dos en dos amb una agilitat que envegen els de quaranta!"; } },
        { k: "B", t: "Banys de mar/piscina tot l'any i passeig diari d'una hora", s: "Salut +12 · Goig +9", fn: function (st, rng, api) { api.stats(12, 9, 0); return "L'aigua i el sol matinal fan desaparèixer la rigidesa sense gastar res."; } },
        { k: "C", t: "Moure't cada cop menys per por de fer-te mal", s: "Salut -12 · Goig -6", fn: function (st, rng, api) { api.stats(-12, -6, 0); return "El repòs excessiu accelera la pèrdua de força i equilibri."; } }
      ]
    },
    {
      id: "ev_59_dividend_shift", minAge: 56, maxAge: 74, needWorth: 150000, tag: "RENDES PERIÒDIQUES",
      title: "Dormir tranquil cobrant cupons i dividends trimestrals",
      body: "A mesura que t'acostes a l'etapa de collita, cobrar rendes regulars psicològicament resulta molt més plaent que vendre participacions.",
      opts: [
        { k: "A", t: "Ponderar un 20–40% en Aristòcrates del Dividend i Renda Fixa sòlida", s: "+3.400 € rendes · Salut +5 · Goig +8", fn: function (st, rng, api) { api.cash(3400); api.stats(5, 8, 3); return "Cada trimestre t'entra un ingrés net com un rellotge sense importar les notícies."; } },
        { k: "B", t: "Mantenir indexació d'acumulació venent l'equivalent al 3,5% anual", s: "+4.100 € eficiència fiscal · Skills +4", fn: function (st, rng, api) { api.cash(4100); api.stats(2, 6, 4); return "Matemàticament impecable: només tributes per la part de plusvàlua del que retires!"; } },
        { k: "C", t: "Contractar una renda vitalícia bancària amb comissions altes", s: "-4.500 € comissió implícita · Salut +2", fn: function (st, rng, api) { api.cash(-4500); api.stats(2, -1, 0); return "Tens un pagament fix, però la lletra petita retalla bona part del teu capital."; } }
      ]
    },
    {
      id: "ev_60_sixty_celebration", minAge: 60, maxAge: 62, tag: "60 ANYS",
      title: "Seixanta anys amb el timó a les mans",
      body: "Entres a la dècada dels 60: tens memòria històrica de quatre cicles econòmics i saps distingir el soroll del que és essencial.",
      opts: [
        { k: "A", t: "Fer el gran viatge cultural en tren per Europa amb qui més estimes", s: "-3.800 € · Goig +20 · Salut +7", fn: function (st, rng, api) { api.cash(-3800); api.stats(7, 20, 1); return "Museus buits un dimecres al matí, concerts a Viena i converses serenes."; } },
        { k: "B", t: "Iniciar l'arxiu digital i memòries de la família per als fills i néts", s: "-250 € · Goig +15 · Bonus Dinastia", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.cash(-250); api.stats(3, 15, 3); return "Reculls fotografies, receptes i lliçons vitals en un llibre que la nissaga guardarà segles."; } },
        { k: "C", t: "Fer revisió mèdica integral preventiva de cap a peus", s: "-650 € · Salut +16 · Goig +7", fn: function (st, rng, api) { api.cash(-650); api.stats(16, 7, 0); return "Detectar i ajustar qualsevol indicador a temps et regala vint anys de vitalitat."; } }
      ]
    },
    {
      id: "ev_61_early_retire_offer", minAge: 59, maxAge: 66, tag: "PRE-JUBILACIÓ",
      title: "Pacte de relleu o jubilació parcial al 75%",
      body: "L'empresa proposa un contracte de relleu: treballar només un dia i mig a la setmana formant un jove mentre cobres gairebé tot.",
      opts: [
        { k: "A", t: "Signar el contracte de relleu: transició dolça i cotització al 100%!", s: "Mode 4 Dies/Suau · +3.500 € · Salut +13 · Goig +16", fn: function (st, rng, api) { st.workMode = "fourday"; st.yearsWorked += 2; api.cash(3500); api.stats(13, 16, 2); return "El pont perfecte cap al retir definitiu: comparteixes ofici i tens cinc dies lliures!"; } },
        { k: "B", t: "Retirar-te ja al 100% i tancar l'etapa laboral amb un sopar d'agraïment", s: "Mode Jubilat · Salut +15 · Goig +18", fn: function (st, rng, api) { st.workMode = "retired"; api.cash(-400); api.stats(15, 18, 0); return "Entregues les claus amb un somriure ple de pau: totes les hores del rellotge són teves."; } },
        { k: "C", t: "Continuar al 100% un parell d'anys més perquè t'agrada el teu equip", s: "+6.200 € estalvi extra · Goig +6", fn: function (st, rng, api) { st.yearsWorked += 2; api.cash(6200); api.stats(0, 6, 2); return "Gaudeixes de sentir-te al peu del canó per decisió pròpia."; } }
      ]
    },
    {
      id: "ev_62_hearing_vision", minAge: 60, maxAge: 80, tag: "SENTITS ACTIUS",
      title: "Vista de prop i nitidesa auditiva en converses amb soroll",
      body: "Els estudis neurològics mostren que cuidar oïda i vista a partir dels 60 és el protector número u de l'agilitat cognitiva.",
      opts: [
        { k: "A", t: "Ulleres progressives d'alta precisió i revisió audiomètrica", s: "-890 € · Salut +13 · Goig +10", fn: function (st, rng, api) { api.cash(-890); api.stats(13, 10, 1); return "Llegir sense cansar la vista i seguir qualsevol conversa a taula et manté connectat al món."; } },
        { k: "B", t: "Cirurgia refractiva/cataracta incipient amb lent ben escollida", s: "-2.400 € · Salut +16 · Goig +13", fn: function (st, rng, api) { api.cash(-2400); api.stats(16, 13, 0); return "Tornes a veure els colors i les lletres petites amb una claredat sorprenent!"; } },
        { k: "C", t: "Apujar el volum de la tele i forçar els ulls amb llum pobra", s: "Salut -8 · Goig -6", fn: function (st, rng, api) { api.stats(-8, -6, 0); return "T'aïlles una mica a les sobretaules sense adonar-te'n."; } }
      ]
    },
    {
      id: "ev_63_garden_orchard", minAge: 56, maxAge: 82, tag: "VIDA MEDITERRÀNIA",
      title: "Un hort urbà o parcel·la de tomàquets, figuera i herbes",
      body: "S'allibera una parcel·la assolellada amb reg per degoteig a deu minuts a peu de casa.",
      opts: [
        { k: "A", t: "Cultivar tomàquets de penjar, albergínies i farigola amb reg automàtic", s: "-280 € · Desp. -40€/m · Salut +12 · Goig +15", fn: function (st, rng, api) { api.cash(-280); api.exp(-40); api.stats(12, 15, 2); return "Regar al capvespre i regalar cistells de verdura amb gust de veritat és felicitat pura."; } },
        { k: "B", t: "Omplir balcó i finestres de testos aromàtics i llimoner", s: "-95 € · Salut +5 · Goig +9", fn: function (st, rng, api) { api.cash(-95); api.stats(5, 9, 0); return "Olor d'alfàbrega i romaní cada cop que obres la finestra."; } },
        { k: "C", t: "Preferir comprar-ho fet al mercat dels dissabtes", s: "Goig +4", fn: function (st, rng, api) { api.stats(1, 4, 0); return "Xarres amb les pageses de la plaça sense ajupir-te a birbar herbes."; } }
      ]
    },
    {
      id: "ev_64_scam_luxury_resort", minAge: 58, maxAge: 82, tag: "ALERTA FINANCERA",
      title: "Dinar «gratuït» per vendre't multiproprietat o producte estructurat",
      body: "Et conviden a un hotel amb obsequi segur per presentar-te un bo estructurat complex amb lletra minúscula.",
      opts: [
        { k: "A", t: "Regla d'or de Buffett: no invertir mai en res que no s'expliqui en 3 línies", s: "0 € perduts · Goig +5 · Skills +2", fn: function (st, rng, api) { api.stats(1, 5, 2); return "Declines amb elegància productes opacs carregats de comissions ocultes del 6%."; } },
        { k: "B", t: "Anar a escoltar per curiositat i marxar sense signar absolutament res", s: "Goig +2", fn: function (st, rng, api) { api.stats(0, 2, 1); return "Detectes de seguida les clàusules de bloqueig de deu anys i surts a passejar."; } },
        { k: "C", t: "Signar 15.000 € convençut pel comercial simpàtic", s: "-4.200 € penalització de sortida · Goig -9", fn: function (st, rng, api) { api.cash(-4200); api.stats(-2, -9, 1); return "Quan llegeixes el contracte a casa descobreixes comissions abusives i rescatar-ho et costa 4.200 €."; } }
      ]
    },
    {
      id: "ev_65_university_senior", minAge: 58, maxAge: 84, tag: "CURIOSITAT ETERNA",
      title: "Aules d'Extensió Universitària: història, filosofia i astronomia",
      body: "La universitat ofereix seminaris apassionants sense pressió d'exàmens, envoltats de gent desperta i inquieta.",
      opts: [
        { k: "A", t: "Matricular-t'hi tot el curs i fer tertúlia de cafè amb els companys", s: "-320 € · Goig +16 · Salut +8 · Skills +5", fn: function (st, rng, api) { api.cash(-320); api.stats(8, 16, 5); return "Mantenir el cervell aprenent i fent nous amics afegeix vida als anys!"; } },
        { k: "B", t: "Seguir cicles de conferències obertes a l'Ateneu i museus", s: "-60 € · Goig +10 · Salut +4 · Skills +3", fn: function (st, rng, api) { api.cash(-60); api.stats(4, 10, 3); return "Dues tardes culturals per setmana que alimenten l'esperit."; } },
        { k: "C", t: "Llegir pel teu compte a la butaca de casa", s: "Goig +6 · Skills +2", fn: function (st, rng, api) { api.stats(1, 6, 2); return "Gaudeixes de grans clàssics al teu propi ritme."; } }
      ]
    },
    {
      id: "ev_66_property_simplify", minAge: 62, maxAge: 83, reqFlag: "hasProperty", tag: "GESTIÓ MADURA",
      title: "Delegar la gestió dels immobles a mesura que passen els anys",
      body: "Tens patrimoni immobiliari directe. A certa edat val la pena decidir si vols continuar gestionant inquilins personalment.",
      opts: [
        { k: "A", t: "Deixar un administrador de finques de confiança i implicar els fills en l'aprenentatge", s: "Despesa +45€/m · Salut +7 · Goig +9 · Bonus Dinastia", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.exp(45); api.stats(7, 9, 2); return "Tu només reps la liquidació neta mensual i la següent generació n'aprèn l'ofici!"; } },
        { k: "B", t: "Renovar contractes a llarg termini amb inquilins impecables un 5% sota mercat", s: "Zero rotació · Goig +8 · Salut +5", fn: function (st, rng, api) { api.stats(5, 8, 2); return "Cedeixes uns euros teòrics a canvi d'inquilins que cuiden el pis com si fos seu durant deu anys."; } },
        { k: "C", t: "Continuar fent tu totes les visites, rebuts i petites reparacions", s: "+900 € estalviats · Salut -4", fn: function (st, rng, api) { api.cash(900); api.stats(-4, 2, 1); return "T'estalvies l'administrador, tot i que alguna escala ja cansa una mica."; } }
      ]
    },
    {
      id: "ev_67_official_retirement", minAge: 67, maxAge: 68, noFlag: "reached67", tag: "★ 67 ANYS · PENSIÓ PÚBLICA",
      title: "Arriba l'edat legal dels 67 anys i l'alta de la pensió!",
      body: "Després de tota una trajectòria vital, s'activa el dret a cobrar la pensió pública corresponent als teus anys cotitzats.",
      opts: [
        { k: "A", t: "Passar a Jubilació plena: sumar pensió + cartera i celebrar-ho en gran!", s: "Mode Jubilat · Pensió activa · Salut +12 · Goig +18", fn: function (st, rng, api) { st.flags.reached67 = true; st.workMode = "retired"; api.cash(-500); api.stats(12, 18, 0); return "Et retires oficialment amb doble motor: pensió pública mensual més tot el teu patrimoni acumulat!"; } },
        { k: "B", t: "Jubilació activa parcial (+4% de bonificació futura) en projectes suaus", s: "+4.200 € · Goig +11 · Salut +5", fn: function (st, rng, api) { st.flags.reached67 = true; st.yearsWorked += 2; api.cash(4200); api.stats(5, 11, 2); return "Mantens una petita activitat vocacional sumant bonificació de demora."; } },
        { k: "C", t: "Jubilar-te i destinar el primer mes de pensió a un regal per als teus", s: "Mode Jubilat · -1.500 € · Goig +21", fn: function (st, rng, api) { st.flags.reached67 = true; st.workMode = "retired"; api.cash(-1500); api.stats(9, 21, 0); return "Un gest preciós d'inauguració d'etapa envoltat de tota la família."; } }
      ]
    },
    {
      id: "ev_68_inflation_retired", minAge: 64, maxAge: 84, tag: "PODER ADQUISITIU",
      title: "Una onada inflacionària encarint cistella, salut i serveis",
      body: "Quan ja vius de rendes i pensions, la inflació és l'enemic silenciós que pot erosionar els estalvis si tot està en efectiu.",
      opts: [
        { k: "A", t: "Reequilibrar mantenint sempre un bloc d'actius reals (Indexats, SOCIMIs i Maó)", s: "+3.900 € protecció real · Goig +6", fn: function (st, rng, api) { api.cash(3900); api.stats(2, 6, 3); return "Les empreses i els lloguers actualitzen preus amb la inflació i protegeixen el teu nivell de vida!"; } },
        { k: "B", t: "Ajustar consum estacional de mercat i tarifes sense perdre qualitat", s: "Despesa -75€/m · Salut +4 · Goig +4", fn: function (st, rng, api) { api.exp(-75); api.stats(4, 4, 1); return "Compres amb intel·ligència veterana esquivant sobrepreus."; } },
        { k: "C", t: "Refugiar el 100% en compte corrent per por de volatilitat", s: "Pèrdua real d'inflació (-2.800 €)", fn: function (st, rng, api) { api.cash(-2800); api.stats(0, -3, 0); return "L'efectiu quiet perd poder de compra davant la pujada de preus."; } }
      ]
    },
    {
      id: "ev_68_choir_music", minAge: 58, maxAge: 85, tag: "COMUNITAT",
      title: "La coral, el club de petanca/escacs o l'associació d'excursionistes",
      body: "La solitud no volguda envelleix tant com fumar; la pertinença a un grup setmanal multiplica la longevitat feliç.",
      opts: [
        { k: "A", t: "Apuntar-t'hi fix dos dies per setmana i participar en les sortides", s: "-140 € · Salut +12 · Goig +16", fn: function (st, rng, api) { api.cash(-140); api.stats(12, 16, 1); return "Cantar, riure i caminar en colla es converteix en el millor medicament de la setmana."; } },
        { k: "B", t: "Organitzar partida i esmorzar de forquilla quinzenal amb vells amics", s: "-360 € · Salut +6 · Goig +14", fn: function (st, rng, api) { api.cash(-360); api.stats(6, 14, 0); return "Mantenir viva la colla amb data fixa al calendari és or pur."; } },
        { k: "C", t: "Quedar-te a casa per mandra de sortir als vespres", s: "Salut -5 · Goig -6", fn: function (st, rng, api) { api.stats(-5, -6, 0); return "Els dies es tornen massa semblants entre quatre parets."; } }
      ]
    },
    {
      id: "ev_68_mediterranean_winter", minAge: 62, maxAge: 82, tag: "CLIMA & SALUT",
      title: "Passar els mesos més freds d'hivern prop del sol suau",
      body: "Al gener i febrer la humitat freda castiga els ossos. Tens llibertat horària per buscar llum i 18 graus al migdia.",
      opts: [
        { k: "A", t: "Llogar cinc setmanes d'hivern en temporada baixíssima prop del mar", s: "-1.550 € · Salut +14 · Goig +15", fn: function (st, rng, api) { api.cash(-1550); api.stats(14, 15, 0); return "Passejar arran de mar al febrer per quatre duros et carrega de vitamina D i alegria."; } },
        { k: "B", t: "Fer intercanvi de casa amb un matrimoni europeu jubilat", s: "-220 € · Salut +10 · Goig +14", fn: function (st, rng, api) { api.cash(-220); api.stats(10, 14, 2); return "Descobreixes una altra regió assolellada gairebé de franc i feu nous amics!"; } },
        { k: "C", t: "Passar l'hivern a casa amb bona manta, brou calent i llar confortable", s: "Salut +4 · Goig +6", fn: function (st, rng, api) { api.stats(4, 6, 0); return "Gaudeixes de la calma casolana dels mesos tranquils."; } }
      ]
    },
    {
      id: "ev_68_craft_restoration", minAge: 56, maxAge: 83, tag: "OFICI MANUAL",
      title: "Restaurar mobles antics, rellotges o bicicletes clàssiques",
      body: "Treballar amb les mans amb paciència i detall produeix un estat de concentració serena incomparable.",
      opts: [
        { k: "A", t: "Muntar un petit banc d'eines ordenat i restaurar peces per gust (i alguna venda)", s: "-550 € eines · Renda +55€/m · Goig +15 · Salut +5", fn: function (st, rng, api) { api.cash(-550); api.side(55); api.stats(5, 15, 3); return "L'olor de fusta i cera d'abella omple els matins, i les peces restaurades es paguen soles!"; } },
        { k: "B", t: "Ajudar el taller comunitari de reparació del barri (Repair Café)", s: "Goig +13 · Salut +5 · Skills +2", fn: function (st, rng, api) { api.stats(5, 13, 2); return "Ensenyes als joves que les coses es poden reparar en lloc de llençar-les."; } },
        { k: "C", t: "Dedicar el temps a passejar i llegir sense embrutar-te les mans", s: "Goig +5 · Salut +3", fn: function (st, rng, api) { api.stats(3, 5, 0); return "Màxima lleugeresa i zero trastos al traster."; } }
      ]
    },

    // --- DÈCADA 69-85: ALTA LONGEVITAT, SAVIESA, DONACIONS I DINASTIA (16 esdeveniments) ---
    {
      id: "ev_70_seventy_wisdom", minAge: 70, maxAge: 72, tag: "70 ANYS",
      title: "Setanta anys: la serenor de qui ha vist ploure i sortir el sol",
      body: "Arribes als 70 anys! Si tens fills, d'aquí ben poc (als 72a) fins i tot podràs passar-los el testimoni quan tu triïs, o viure fins als 85.",
      opts: [
        { k: "A", t: "Simplificar la cartera en pocs actius ultraclars i fàcils de gestionar", s: "+2.800 € menys comissions · Salut +6 · Goig +11", fn: function (st, rng, api) { api.cash(2800); api.stats(6, 11, 2); return "Deixes un quadre financer tan net que qualsevol de casa l'entén en cinc minuts."; } },
        { k: "B", t: "Organitzar un viatge intergeneracional inoblidable amb els teus", s: "-4.900 € · Goig +22 · Salut +6", fn: function (st, rng, api) { api.cash(-4900); api.stats(6, 22, 0); return "Veure riure juntes totes les generacions de casa val cada euro estalviat de jove."; } },
        { k: "C", t: "Mantenir rutina diària de força suau, lectura i mercat fresc", s: "Salut +13 · Goig +10", fn: function (st, rng, api) { api.stats(13, 10, 0); return "Arribes a la setantena amb l'esquena dreta i el cap claríssim."; } }
      ]
    },
    {
      id: "ev_72_dynasty_ready_notice", minAge: 72, maxAge: 76, reqFlag: "hadFirstKid", noFlag: "dynastyNotified", tag: "★ RELLEU GENERACIONAL OBERT",
      title: "Els teus fills ja estan preparats per liderar la Dinastia",
      body: "A partir d'ara (72+ anys) pots continuar assaborint la teva vida fins als 85 anys o cedir el timó a la Següent Generació des del Menú quan vulguis!",
      opts: [
        { k: "A", t: "Compartir amb els fills els principis d'inversió de la casa i seguir gaudint", s: "Bonus d'educació financera · Goig +14 · Salut +6", fn: function (st, rng, api) { st.flags.dynastyNotified = true; st.flags.kidFinLit = true; api.stats(6, 14, 3); return "Transmets la filosofia de prudència i llarg termini: la nissaga té fonaments de roca!"; } },
        { k: "B", t: "Fer una donació ordenada en vida per impulsar els seus projectes", s: "-14.000 € · Goig +19 · Salut +5", fn: function (st, rng, api) { st.flags.dynastyNotified = true; api.cash(-14000); api.stats(5, 19, 1); return "Els dónes empenta en vida conservant de sobres la teva independència."; } },
        { k: "C", t: "Formalitzar protocol familiar de conservació d'immobles i capital (92%!)", s: "-4.800 € · Activa Trust 92% · Goig +12", fn: function (st, rng, api) { st.flags.dynastyNotified = true; st.flags.trustPlan = true; api.cash(-4800); api.stats(4, 12, 3); return "Protocol signat: quan arribi el relleu, la següent generació conservarà el 92% del patrimoni!"; } }
      ]
    },
    {
      id: "ev_73_home_accessibility", minAge: 71, maxAge: 84, tag: "LLAR SEGURA",
      title: "Il·luminació nocturna, bany arran de terra i baranes discretes",
      body: "El 80% de contratemps de salut passats els 75 anys vénen d'una ensopegada absurda a casa. Prevenir-ho és senzillíssim.",
      opts: [
        { k: "A", t: "Eliminar catifes relliscoses, posar dutxa plana antilliscant i llums de pas", s: "-2.300 € · Salut +16 · Goig +8", fn: function (st, rng, api) { api.cash(-2300); api.stats(16, 8, 0); return "Converteixes casa teva en un espai còmode, lluminós i 100% segur."; } },
        { k: "B", t: "Retirar obstacles, millorar calçat i entrenar equilibri sobre un peu cada matí", s: "-120 € · Salut +12 · Goig +6", fn: function (st, rng, api) { api.cash(-120); api.stats(12, 6, 1); return "Raspallar-te les dents fent equilibri enforteix turmells i reflexos de meravella!"; } },
        { k: "C", t: "Deixar la banyera alta antiga de tota la vida", s: "Risc de relliscada (-10 Salut)", fn: function (st, rng, api) { if (rng() < 0.55) { api.stats(-11, -6, 0); return "Una relliscada tonta et deixa el maluc adolorit un mes sencer."; } api.stats(-2, 0, 0); return "De moment te'n surts amb compte, però la banyera alta imposa respecte."; } }
      ]
    },
    {
      id: "ev_74_hip_knee_care", minAge: 70, maxAge: 84, tag: "VITALITAT FÍSICA",
      title: "Desgast de cartílag al genoll o maluc",
      body: "Caminar per pendent comença a fer punxada. La rehabilitació dirigida o una intervenció a temps et poden tornar els passeigs llargs.",
      opts: [
        { k: "A", t: "Fisioteràpia específica + infiltració/intervenció amb rehabilitació exemplar", s: "-2.900 € · Salut +18 · Goig +13", fn: function (st, rng, api) { api.cash(-2900); api.stats(18, 13, 0); return "Tornes a caminar cinc quilòmetres sense gens de mal: quina llibertat!"; } },
        { k: "B", t: "Aquagym tèrmic tres cops per setmana i bastons nòrdics lleugers", s: "-280 € · Salut +12 · Goig +9", fn: function (st, rng, api) { api.cash(-280); api.stats(12, 9, 0); return "Els bastons de marxa nòrdica descarreguen un 30% el pes dels genolls!"; } },
        { k: "C", t: "Resignar-te a sortir només fins a la cantonada", s: "Salut -12 · Goig -9", fn: function (st, rng, api) { api.stats(-12, -9, 0); return "Reduir el radi de passeig encongeix també l'ànim i la musculatura."; } }
      ]
    },
    {
      id: "ev_75_diamond_jubilee", minAge: 75, maxAge: 77, tag: "75 PRIMAVERES",
      title: "Setanta-cinc anys i el valor d'un dia tranquil",
      body: "Despertes, entra el sol per la persiana i tens salut, sostre pagat i independència. Poca gent s'atura a celebrar la normalitat feliç.",
      opts: [
        { k: "A", t: "Convidar amics i família a una arrossada memorable vora el mar", s: "-1.600 € · Goig +20 · Salut +6", fn: function (st, rng, api) { api.cash(-1600); api.stats(6, 20, 0); return "Un dia lluminós de sobretaula llarga que tothom recordarà amb un somriure."; } },
        { k: "B", t: "Patrocinar la restauració d'un espai públic o font del teu poble/barri", s: "-3.500 € · Goig +18 · Salut +4", fn: function (st, rng, api) { api.cash(-3500); api.stats(4, 18, 0); return "Deixes una empremta cívica discreta i bonica al lloc on has viscut."; } },
        { k: "C", t: "Escriure cartes personals a mà per a cada persona important de la teva vida", s: "0 € · Goig +19 · Salut +5", fn: function (st, rng, api) { api.stats(5, 19, 1); return "Dir el que sents en vida i sobre bon paper emociona fins a les llàgrimes."; } }
      ]
    },
    {
      id: "ev_76_domestic_help", minAge: 73, maxAge: 85, tag: "QUALITAT DE VIDA",
      title: "Delegar la neteja pesada i les compres de volum",
      body: "Pujar garrafes, netejar vidres alts o carregar bosses ja no aporta res més que risc de lumbàlgia.",
      opts: [
        { k: "A", t: "Contractar ajuda domèstica dignament assegurada 6 hores/setmana + compra a domicili", s: "Despesa +240€/m · Salut +14 · Goig +13", fn: function (st, rng, api) { api.exp(240); api.stats(14, 13, 0); return "Per a això exactament serveix el patrimoni acumulat: comprar benestar, ordre i seguretat!"; } },
        { k: "B", t: "Robot aspirador + comanda setmanal del mercat portada a porta", s: "-420 € · Desp. +35€/m · Salut +8 · Goig +7", fn: function (st, rng, api) { api.cash(-420); api.exp(35); api.stats(8, 7, 0); return "Elimines el 80% de l'esforç físic feixuc per molt pocs diners."; } },
        { k: "C", t: "Entossudir-te a enfilar-te al tamboret per netejar altells", s: "Risc de caiguda (-12 Salut)", fn: function (st, rng, api) { api.stats(-12, -5, 0); return "Un esglai dalt de la cadira et fa prometre que no ho tornaràs a fer."; } }
      ]
    },
    {
      id: "ev_77_cognitive_chess_lang", minAge: 70, maxAge: 85, tag: "MENT DESPERTA",
      title: "Gimnàstica mental: escacs, idiomes, música o mots encreuats",
      body: "La reserva cognitiva es construeix reptant el cervell amb problemes nous i conversa viva cada dia.",
      opts: [
        { k: "A", t: "Jugar partides d'escacs/bridge al club + llegir assaig i practicar italià", s: "-150 € · Salut +11 · Goig +14 · Skills +4", fn: function (st, rng, api) { api.cash(-150); api.stats(11, 14, 4); return "Agilitat mental envejable: recordes noms, dates i jugades millor que molts joves!"; } },
        { k: "B", t: "Cuidar la comptabilitat patrimonial amb fulls clars i lectura diària en tinta electrònica", s: "Salut +7 · Goig +10 · Skills +3", fn: function (st, rng, api) { api.stats(7, 10, 3); return "La lectura calmada sense llum blava i el càlcul serè mantenen el cap finíssim."; } },
        { k: "C", t: "Passar cinc hores diàries davant tertúlies crispades de televisió", s: "Salut -5 · Goig -8", fn: function (st, rng, api) { api.stats(-5, -8, 0); return "El soroll televisiu t'irrita de franc sense aportar-te res de bo."; } }
      ]
    },
    {
      id: "ev_78_die_with_zero_gift", minAge: 72, maxAge: 85, needWorth: 180000, tag: "GENEROSITAT EN VIDA",
      title: "La reflexió de «Die With Zero»: donar quan més serveix",
      body: "Tens el teu propi futur sobradament cobert fins als 100 anys i veus projectes familiars o culturals que ara mateix floririen amb una empenta.",
      opts: [
        { k: "A", t: "Repartir 25.000 € ara en vida per a projectes sòlids dels joves o entitat científica", s: "-25.000 € · Goig +24 · Salut +6", fn: function (st, rng, api) { api.cash(-25000); api.stats(6, 24, 0); return "Presencies en directe com el teu esforç passat canvia vides avui mateix!"; } },
        { k: "B", t: "Crear un petit fons familiar d'emergència i beques dotat amb 10.000 €", s: "-10.000 € · Goig +16 · Bonus Dinastia", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.cash(-10000); api.stats(4, 16, 2); return "Un paraigua institucional familiar amb regles clares d'ús educatiu."; } },
        { k: "C", t: "Mantenir l'escut patrimonial intacte per a qualsevol contingència de salut", s: "+2.200 € rendes conservades · Salut +3", fn: function (st, rng, api) { api.cash(2200); api.stats(3, 3, 0); return "Prioritzes l'autonomia absoluta davant qualsevol escenari mèdic futur."; } }
      ]
    },
    {
      id: "ev_79_old_friend_reunion", minAge: 71, maxAge: 85, tag: "AMISTAT DE LLARG RECORREGUT",
      title: "Retrobament amb l'amic de quan teníeu vint anys",
      body: "Truca un amic de joventut amb qui feia anys que només us felicitaveu festes. Proposa passar tres dies tranquils recordant batalles.",
      opts: [
        { k: "A", t: "Acollir-lo o anar-lo a veure sense mirar rellotge ni despesa", s: "-480 € · Goig +19 · Salut +7", fn: function (st, rng, api) { api.cash(-480); api.stats(7, 19, 0); return "Rieu com si tornéssiu a tenir vint-i-dos anys: l'amistat vella és medicina per al cor."; } },
        { k: "B", t: "Quedar a mig camí per fer un gran dinar de migdia en tren", s: "-140 € · Goig +13 · Salut +4", fn: function (st, rng, api) { api.cash(-140); api.stats(4, 13, 0); return "Quatre hores d'abraçades i memòria viva que us deixen l'ànima plena."; } },
        { k: "C", t: "Deixar-ho en una trucada llarga de telèfon des de la butaca", s: "Goig +6", fn: function (st, rng, api) { api.stats(1, 6, 0); return "Una conversa càlida i pausada mentre mireu per la finestra."; } }
      ]
    },
    {
      id: "ev_80_eighty_oak", minAge: 80, maxAge: 81, tag: "★ 80 ANYS",
      title: "Vuitanta anys: com una alzina d'arrels profundes",
      body: "Assolir els vuitanta anys amb lucidesa i autonomia financera és una victòria silenciosa construïda decisió a decisió.",
      opts: [
        { k: "A", t: "Celebrar les 8 dècades amb música en viu íntima i tota la teva gent", s: "-1.800 € · Goig +22 · Salut +8", fn: function (st, rng, api) { api.cash(-1800); api.stats(8, 22, 0); return "Tothom aixeca la copa per la teva serenor, generositat i exemple vital!"; } },
        { k: "B", t: "Plantar tres arbres autòctons amb els més joves i deixar una càpsula del temps", s: "-250 € · Goig +18 · Salut +7", fn: function (st, rng, api) { api.cash(-250); api.stats(7, 18, 0); return "Un símbol viu de continuïtat entre el que vas rebre i el que deixes."; } },
        { k: "C", t: "Revisar amb calma tota l'estructura de successió perquè sigui impecable", s: "+1.500 € ordre fiscal · Goig +12 · Salut +5", fn: function (st, rng, api) { api.cash(1500); api.stats(5, 12, 2); return "Tot està endreçat al mil·límetre, sense cap carpeta pendent."; } }
      ]
    },
    {
      id: "ev_81_dental_nutrition_80", minAge: 76, maxAge: 85, tag: "NUTRICIÓ & LONGEVITAT",
      title: "Proteïna de qualitat, oli verge extra i hidratació als 80",
      body: "Els geriatres insisteixen: a partir dels 75 cal evitar la sarcopènia menjant prou proteïna bona i mantenint passeig diari.",
      opts: [
        { k: "A", t: "Peix blau fresc, ous ecològics, llegums tendres i passeig al sol del matí", s: "Despesa +65€/m · Salut +15 · Goig +10", fn: function (st, rng, api) { api.exp(65); api.stats(15, 10, 0); return "Conserva la força a les cames i una analítica que admira el teu metge de capçalera!"; } },
        { k: "B", t: "Menú casolà variat compartit amb veïns o família", s: "Salut +10 · Goig +12", fn: function (st, rng, api) { api.stats(10, 12, 0); return "Menjar acompanyat fa que cada àpat nodreixi el doble."; } },
        { k: "C", t: "Sopar només un got de llet i galetes per mandra de cuinar", s: "Despesa -35€/m · Salut -10", fn: function (st, rng, api) { api.exp(-35); api.stats(-10, -4, 0); return "La falta de proteïna debilita la musculatura ràpidament."; } }
      ]
    },
    {
      id: "ev_82_market_calm_veteran", minAge: 74, maxAge: 85, tag: "PERSPECTIVA D'OR",
      title: "Els joves s'espanten per una correcció del 15% i et demanen consell",
      body: "Tu ja has viscut mitja dotzena de «fins del món» borsàries i saps com acaben sempre per a qui no s'endeuta amb bogeries.",
      opts: [
        { k: "A", t: "Ensenyar-los el teu gràfic vital de 60 anys i convidar-los a un cafè", s: "+2.400 € dividend calmat · Goig +16 · Bonus Dinastia", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.cash(2400); api.stats(4, 16, 2); return "Veure la teva corba real des dels 18 anys els cura el pànic per a tota la vida!"; } },
        { k: "B", t: "Comprar unes quantes participacions de qualitat amb descompte per al llegat", s: "+4.800 € plusvàlua latent · Goig +10", fn: function (st, rng, api) { api.cash(4800); api.stats(2, 10, 2); return "Fins i tot passats els setanta-cinc mantens l'instint serè del bon inversor."; } },
        { k: "C", t: "Somriure i sortir a mirar el mar sense mirar cotitzacions", s: "Salut +6 · Goig +11", fn: function (st, rng, api) { api.stats(6, 11, 0); return "La veritable riquesa és no necessitar tenir raó als mercats."; } }
      ]
    },
    {
      id: "ev_83_local_archive_donation", minAge: 76, maxAge: 85, tag: "MEMÒRIA VIVA",
      title: "L'arxiu comarcal s'interessa pels teus quaderns i eines d'ofici",
      body: "Historiadors locals recullen testimonis de com s'ha transformat el treball, l'estalvi i la vida quotidiana en set dècades.",
      opts: [
        { k: "A", t: "Cedir còpies digitalitzades i gravar una entrevista serena plena d'anècdotes", s: "Goig +17 · Salut +5", fn: function (st, rng, api) { api.stats(5, 17, 1); return "La teva veu i experiència queden guardades com a patrimoni col·lectiu del país."; } },
        { k: "B", t: "Editar una petita tirada enquadernada en tela per a amics i descendents", s: "-680 € · Goig +19 · Bonus Dinastia", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.cash(-680); api.stats(4, 19, 1); return "Un llibre artesà preciós que passarà de tauleta en tauleta durant generacions."; } },
        { k: "C", t: "Mantenir els records en la intimitat estricta de casa", s: "Goig +6", fn: function (st, rng, api) { api.stats(2, 6, 0); return "Prefereixes la discreció silenciosa de sempre."; } }
      ]
    },
    {
      id: "ev_84_final_harmony", minAge: 82, maxAge: 85, tag: "PLENITUD DEL CAPVESPRE",
      title: "Llum daurada de tarda i balanç d'una vida ben viscuda",
      body: "Mires per la finestra a l'últim tram abans dels 85 anys. Els números quadren, però sobretot quadra la consciència.",
      opts: [
        { k: "A", t: "Reunir tota la família i explicar-los el sentit profund del llegat que els deixes", s: "Bonus Dinastia màxim · Goig +22 · Salut +8", fn: function (st, rng, api) { st.flags.kidFinLit = true; api.stats(8, 22, 2); return "Els recordes que el capital mai ha estat una gàbia d'or, sinó llibertat per estimar i escollir."; } },
        { k: "B", t: "Deixar signada una última optimització successòria si encara faltava (92%!)", s: "-3.900 € · Activa Trust 92% · Goig +15", fn: function (st, rng, api) { st.flags.trustPlan = true; api.cash(-3900); api.stats(4, 15, 2); return "Blindes fiscalment el relleu a l'últim minut amb una lucidesa admirable!"; } },
        { k: "C", t: "Gaudir d'un passeig lent, un bon llibre i un sopar suau en pau total", s: "Salut +10 · Goig +18", fn: function (st, rng, api) { api.stats(10, 18, 0); return "Assaboreixes la bellesa senzilla d'haver viscut fidel als teus valors."; } }
      ]
    },
    {
      id: "ev_any_debt_escape_offer", minAge: 18, maxAge: 50, noFlag: "debtRefiDone", tag: "REESTRUCTURACIÓ DE DEUTE",
      title: "Unificar crèdits cars o atacar-los amb el mètode allau",
      body: "Revises el cost financer dels interessos i comissions bancàries per decidir una estratègia d'estalvi net.",
      opts: [
        { k: "A", t: "Aplicar mes d'austeritat espartana i amortitzar/estalviar 1.900 € nets", s: "+1.900 € al balanç · Goig -1 · Skills +4", fn: function (st, rng, api) { st.flags.debtRefiDone = true; api.cash(1900); api.stats(1, -1, 4); return " Trenta dies sense cap despesa supèrflua netegen el balanç i et donen impuls moral!"; } },
        { k: "B", t: "Fer hores extres puntuals durant un trimestre per generar un coixí", s: "+2.700 € · Salut -4 · Skills +3", fn: function (st, rng, api) { st.flags.debtRefiDone = true; api.cash(2700); api.stats(-4, 2, 3); return "Un esprint puntual de noranta dies t'aporta gairebé tres mil euros líquids."; } },
        { k: "C", t: "Pactar rebaixa estructural de rebuts fixos amb proveïdors", s: "Despesa -75€/m · Goig +4", fn: function (st, rng, api) { st.flags.debtRefiDone = true; api.exp(-75); api.stats(1, 4, 2); return "Afluixes la pressió mensual fixa de manera permanent."; } }
      ]
    },
    {
      id: "ev_any_Mediterranean_sabbatical_week", minAge: 28, maxAge: 78, tag: "RESPIR SERÈ",
      title: "Una setmana sense rellotge en una cala o vall silenciosa",
      body: "Sents la necessitat d'apagar notificacions set dies per pensar amb perspectiva de deu anys vista.",
      opts: [
        { k: "A", t: "Refugi auster de muntanya/costa fora de temporada amb llibreta en blanc", s: "-490 € · Salut +11 · Goig +13 · Skills +3", fn: function (st, rng, api) { api.cash(-490); api.stats(11, 13, 3); return "D'aquella llibreta en surten les dues millors decisions de la teva dècada."; } },
        { k: "B", t: "Quedar-te a casa fent «vacances al propi barri» i museus gratuïts", s: "-80 € · Salut +7 · Goig +9", fn: function (st, rng, api) { api.cash(-80); api.stats(7, 9, 1); return "Descobreixes racons preciosos a vint minuts de casa sense fer maletes."; } },
        { k: "C", t: "Aprofitar la setmana per fer un projecte intensiu remunerat", s: "+1.750 € · Salut -3", fn: function (st, rng, api) { api.cash(1750); api.stats(-3, 2, 3); return "Factures molt bé aquella setmana a canvi d'ajornar el descans."; } }
      ]
    }
  ];

  EVENTS = EVENTS.concat(MORE_EVENTS_LATE);

  // ==================== MOTOR COMBINATORI (12 DOMINIS × 8 CONTEXTOS × 3 OPCIONS) ====================
  var DOMAINS = [
    {
      id: "salut", tag: "SALUT & ENERGIA",
      head: "Hàbits de vitalitat i prevenció física",
      prompt: "Revises el teu descans, força muscular i alimentació d'enguany.",
      optA: "Invertir en prevenció activa, força i menjar fresc",
      optB: "Rutina gratuïta de caminades llargues i son disciplinat",
      optC: "Prioritzar la feina i els ingressos deixant l'esport en segon pla",
      kind: "health"
    },
    {
      id: "carrera", tag: "OFICI & TALENT",
      head: "Posicionament professional i negociació",
      prompt: "S'obre una finestra per redefinir el valor que aportes i com es remunera.",
      optA: "Assumir un repte d'alt impacte i negociar millora d'ingressos",
      optB: "Consolidar mètode i protegir les tardes lliures",
      optC: "Explorar encàrrecs paral·lels per diversificar pagadors",
      kind: "career"
    },
    {
      id: "llar", tag: "HABITATGE & EFICIÈNCIA",
      head: "Gestió de costos fixos i confort domèstic",
      prompt: "Analitzes els subministraments, el manteniment i l'estructura de despesa de la llar.",
      optA: "Invertir ara per reduir factures mensuals de manera permanent",
      optB: "Poda quirúrgica de subscripcions i contractes prescindibles",
      optC: "Millorar l'equipament i confort assumint una mica més de cost",
      kind: "home"
    },
    {
      id: "cartera", tag: "ASSIGNACIÓ TÀCTICA",
      head: "Reequilibri disciplinat del patrimoni",
      prompt: "Les oscil·lacions dels últims mesos han mogut els pesos de les teves posicions.",
      optA: "Executar reequilibri sistemàtic comprant el que ha quedat barat",
      optB: "Reforçar el coixí de liquiditat i rendes previsibles",
      optC: "Destinar una petita fracció tàctica a oportunitats asimètriques",
      kind: "portfolio"
    },
    {
      id: "fiscal", tag: "OPTIMITZACIÓ FISCAL",
      head: "Planificació abans del tancament de l'exercici",
      prompt: "Queden setmanes per tancar l'any fiscal i pots ordenar rendiments i deduccions.",
      optA: "Aplicar diferiment i compensació legal de rendiments d'estalvi",
      optB: "Aprofitar deduccions per formació, eficiència o mecenatge",
      optC: "Presentar l'esborrany estàndard sense complicar-te l'agenda",
      kind: "tax"
    },
    {
      id: "vincle", tag: "COMUNITAT & AMISTAT",
      head: "Cura dels vincles personals i xarxa de confiança",
      prompt: "El capital social i afectiu demana presència real, escolta i temps compartit.",
      optA: "Organitzar trobades senzilles a casa i cuidar les grans amistats",
      optB: "Participar activament en una entitat professional o cultural local",
      optC: "Reservar enguany l'energia per al recolliment i l'estalvi intensiu",
      kind: "social"
    },
    {
      id: "mobilitat", tag: "MOBILITAT & CONSUM",
      head: "Desplaçaments diaris i compres duradores",
      prompt: "Toca decidir com et mous i quins béns materials mereixen entrar a casa.",
      optA: "Aplicar la regla de «comprar poc, bo i al comptat» + transport actiu",
      optB: "Reparar i allargar la vida útil del que ja tens en bon estat",
      optC: "Renovar equipament per comoditat immediata",
      kind: "consumption"
    },
    {
      id: "creacio", tag: "PROJECTES PROPIS",
      head: "Iniciativa lateral i propietat intel·lectual",
      prompt: "Una idea pràctica ronda la teva llibreta i podria generar valor fora de l'horari habitual.",
      optA: "Llançar una versió mínima viable cobrant des del primer client",
      optB: "Aprendre l'habilitat tècnica base amb calma sense pressa comercial",
      optC: "Descartar l'experiment per protegir el descans",
      kind: "side"
    },
    {
      id: "nissaga", tag: "FAMÍLIA & TRANSMISSIÓ",
      head: "Coesió familiar i visió intergeneracional",
      prompt: "Les converses a taula giren al voltant del futur, la prudència i el suport mutu.",
      optA: "Compartir cultura financera pràctica i crear tradicions senzilles",
      optB: "Oferir suport econòmic acotat i ben orientat als propers",
      optC: "Enfortir les reserves patrimonials de la casa per a imprevistos",
      kind: "family"
    },
    {
      id: "psicologia", tag: "SERENOR & SOROLL",
      head: "Higiene informativa davant titulars extrems",
      prompt: "Les xarxes i tertúlies alternen promeses de riquesa ràpida amb profecies de col·lapse.",
      optA: "Dieta d'informació lenta: llibres clàssics i aportació automàtica",
      optB: "Analitzar dades primàries per caçar alguna ineficiència puntual",
      optC: "Reduir risc temporalment per dormir amb zero neguit",
      kind: "mind"
    },
    {
      id: "natura", tag: "TEMPS LLIURE & NATURA",
      head: "Ritme vital, aire lliure i vacances conscients",
      prompt: "Planifiques com recuperar forces durant les setmanes de pausa d'aquest any.",
      optA: "Muntanya, mar fora de temporada i cuina de mercat reposada",
      optB: "Viatge cultural enriquidor planificat amb mesos d'antelació",
      optC: "Setmanes tranquil·les a prop dedicant temps a lectura i ordre",
      kind: "leisure"
    },
    {
      id: "risc", tag: "BLINDATGE PATRIMONIAL",
      head: "Gestió d'assegurances, liquiditat i imprevistos",
      prompt: "Revises on podria haver-hi punts fràgils en la teva arquitectura financera.",
      optA: "Cobrir només els grans riscos catastròfics i autosegurar els petits",
      optB: "Amortitzar càrregues o eixugar despeses rígides del balanç",
      optC: "Mantenir l'estructura actual i acumular interessos en caixa",
      kind: "shield"
    }
  ];

  var ECON_CONTEXTS = [
    { id: "c1", label: "amb tipus d'interès exigents i crèdit selectiu", cashMod: 1.15, msg: "En un entorn de crèdit car, no dependre dels bancs et dóna un avantatge enorme." },
    { id: "c2", label: "en ple encariment de la cistella bàsica i serveis", cashMod: 0.95, msg: "Controlar costos fixos i mantenir actius reals neutralitza la pujada de preus." },
    { id: "c3", label: "mentre el mercat viu una onada d'optimisme tecnològic", cashMod: 1.2, msg: "Aprofites el vent de cua mantenint els peus a terra." },
    { id: "c4", label: "durant un refredament industrial que premia la prudència", cashMod: 0.9, msg: "La solidesa del teu balanç converteix la desacceleració en calma." },
    { id: "c5", label: "en un any d'estabilitat monetària i creixement suau", cashMod: 1.0, msg: "Els anys aparentment avorrits són els que construeixen les grans fortunes silencioses." },
    { id: "c6", label: "amb forta transformació digital als oficis i empreses", cashMod: 1.1, msg: "Adaptar el teu criteri a les noves eines multiplica la teva productivitat." },
    { id: "c7", label: "amb tensió de lloguers urbans i dinamisme a comarques", cashMod: 1.05, msg: "Entendre la geografia dels costos et permet viure millor amb menys pressió." },
    { id: "c8", label: "després d'una correcció borsària que deixa bons múltiples", cashMod: 1.25, msg: "Sembrar amb paciència quan els preus es desinflen dona fruits extraordinaris." }
  ];

  function generateDynamicYearEvent(st, rng) {
    var dIdx = Math.floor(rng() * DOMAINS.length) % DOMAINS.length;
    var cIdx = Math.floor(rng() * ECON_CONTEXTS.length) % ECON_CONTEXTS.length;
    var dom = DOMAINS[dIdx];
    var ctx = ECON_CONTEXTS[cIdx];

    var scale = Math.max(1, Math.min(4, 1 + (st.age - 18) / 28));
    var baseAmt = Math.round((900 + Math.floor(rng() * 1400)) * scale * ctx.cashMod / 50) * 50;
    var expDelta = 40 + Math.floor(rng() * 6) * 10;
    var sideDelta = 50 + Math.floor(rng() * 6) * 15;
    var isRetired = st.workMode === "retired" || st.age >= 67;

    var opt1, opt2, opt3;

    if (dom.kind === "health" || dom.kind === "leisure" || dom.kind === "mind") {
      var costA = Math.round(baseAmt * 0.45 / 50) * 50;
      opt1 = {
        k: "A",
        t: dom.optA,
        s: "-" + costA + " € · Salut +12 · Goig +11",
        fn: function (s, r, api) { api.cash(-costA); api.stats(12, 11, 2); return "Cuidar el cos i la serenor als " + s.age + " anys et retorna energia multiplicada. " + ctx.msg; }
      };
      opt2 = {
        k: "B",
        t: dom.optB,
        s: "Despesa -" + Math.round(expDelta * 0.6) + "€/m · Salut +8 · Goig +8",
        fn: function (s, r, api) { api.exp(-Math.round(expDelta * 0.6)); api.stats(8, 8, 2); return "Hàbits sobris i constants que sumen salut i alliberen marge mensual. " + ctx.msg; }
      };
      opt3 = {
        k: "C",
        t: dom.optC,
        s: "+" + baseAmt + " € · Salut -5 · Goig -3",
        fn: function (s, r, api) { api.cash(baseAmt); api.stats(-5, -3, 2); return "Prioritzes fer caixa enguany, tot i notar una mica més de cansament acumulat."; }
      };
    } else if (dom.kind === "career" || dom.kind === "side") {
      if (isRetired) {
        opt1 = {
          k: "A",
          t: "Col·laboració puntual de mentoria / drets sense estrès",
          s: "+" + baseAmt + " € · Goig +9 · Skills +3",
          fn: function (s, r, api) { api.cash(baseAmt); api.stats(2, 9, 3); return "Aportes la teva veterania un parell de matins i sumes un bon ingrés net. " + ctx.msg; }
        };
      } else {
        opt1 = {
          k: "A",
          t: dom.optA,
          s: "Sou base +8% · Skills +5 · Salut -3",
          fn: function (s, r, api) { api.salPct(8); api.stats(-3, 5, 5); return "Fas un pas endavant als " + s.age + " anys i consolides un esglaó retributiu superior. " + ctx.msg; }
        };
      }
      opt2 = {
        k: "B",
        t: dom.optB,
        s: "Salut +6 · Goig +8 · Skills +4",
        fn: function (s, r, api) { api.stats(6, 8, 4); return "Aprens amb calma protegint el teu temps personal. " + ctx.msg; }
      };
      opt3 = {
        k: "C",
        t: dom.optC,
        s: "Renda lateral +" + sideDelta + "€/m · Salut -2",
        fn: function (s, r, api) { api.side(sideDelta); api.stats(-2, 5, 4); return "Obres una petita font d'ingressos pròpia que suma cada mes. " + ctx.msg; }
      };
    } else if (dom.kind === "home" || dom.kind === "consumption" || dom.kind === "shield") {
      var invCost = Math.round(baseAmt * 0.8 / 50) * 50;
      opt1 = {
        k: "A",
        t: dom.optA,
        s: "-" + invCost + " € · Despesa -" + expDelta + "€/m · Goig +6",
        fn: function (s, r, api) { api.cash(-invCost); api.exp(-expDelta); api.stats(3, 6, 2); return "Inverteixes amb cap per rebaixar costos estructurals de forma duradora. " + ctx.msg; }
      };
      opt2 = {
        k: "B",
        t: dom.optB,
        s: "Despesa -" + Math.round(expDelta * 0.7) + "€/m · +" + Math.round(baseAmt * 0.4) + " €",
        fn: function (s, r, api) { api.exp(-Math.round(expDelta * 0.7)); api.cash(Math.round(baseAmt * 0.4)); api.stats(2, 5, 2); return "Elimines friccions i despeses silencioses sense perdre qualitat de vida. " + ctx.msg; }
      };
      opt3 = {
        k: "C",
        t: dom.optC,
        s: "-" + Math.round(baseAmt * 0.5) + " € · Goig +9 · Salut +4",
        fn: function (s, r, api) { api.cash(-Math.round(baseAmt * 0.5)); api.stats(4, 9, 0); return "Prioritzes comoditat quotidiana i benestar immediat a casa."; }
      };
    } else {
      // portfolio, tax, social, family
      opt1 = {
        k: "A",
        t: dom.optA,
        s: "+" + baseAmt + " € eficiència · Skills +4 · Goig +6",
        fn: function (s, r, api) { if (dom.kind === "family") s.flags.kidFinLit = true; api.cash(baseAmt); api.stats(2, 6, 4); return "Gestió serena i metòdica que enforteix el patrimoni i la calma. " + ctx.msg; }
      };
      opt2 = {
        k: "B",
        t: dom.optB,
        s: "-" + Math.round(baseAmt * 0.35) + " € · Goig +12 · Salut +5",
        fn: function (s, r, api) { api.cash(-Math.round(baseAmt * 0.35)); api.stats(5, 12, 2); return "Destines una part raonable a cuidar relacions, propòsit i entorn. " + ctx.msg; }
      };
      opt3 = {
        k: "C",
        t: dom.optC,
        s: "+" + Math.round(baseAmt * 0.65) + " € reserva · Salut +3",
        fn: function (s, r, api) { api.cash(Math.round(baseAmt * 0.65)); api.stats(3, 4, 1); return "Reforces les reserves líquides i deixes que el temps faci la seva feina."; }
      };
    }

    return {
      id: "dyn_" + st.generation + "_" + st.age + "_" + dom.id + "_" + ctx.id,
      tag: dom.tag + " · GEN " + st.generation,
      title: dom.head + " (" + st.age + " anys)",
      body: "Als " + st.age + " anys, " + ctx.label + ". " + dom.prompt,
      opts: [opt1, opt2, opt3]
    };
  }

  window.CalmData.vides = {
    DYNASTY_NAMES: DYNASTY_NAMES,
    KID_NAMES: KID_NAMES,
    ORIGINS: ORIGINS,
    REGIMES: REGIMES,
    BUCKETS: BUCKETS,
    CAREER_RANKS: CAREER_RANKS,
    WORK_MODES: WORK_MODES,
    COURSES: COURSES,
    PROPERTIES: PROPERTIES,
    ACHIEVEMENTS: ACHIEVEMENTS,
    EVENTS: EVENTS,
    generateDynamicYearEvent: generateDynamicYearEvent
  };
})();
