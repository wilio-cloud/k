// Joc 3: Fundador des de Zero — Dades v6 (De Garatge a Holding, 5 Fases, 90 Dilemes & Generador)
(function () {
  window.CalmData = window.CalmData || {};

  function fmt(n) {
    if (window.CalmUI && window.CalmUI.fmtEur) return window.CalmUI.fmtEur(n);
    return Math.round(n) + " €";
  }

  function scaleAmt(st, factor, minAmt) {
    var v = Math.round((st.rev || 1500) * factor);
    return v > minAmt ? v : minAmt;
  }

  function estVal(st) {
    var annualRev = (st.rev || 0) * 12;
    var netM = (st.rev || 0) - (st.cost || 0);
    var annualProf = netM > 0 ? netM * 12 : 0;
    return Math.max(15000, Math.round(annualRev * (st.mult || 3) + annualProf * 2.5));
  }

  var STAGES = [
    {
      id: 1,
      minRev: 0,
      maxRev: 4000,
      short: "Fase 1 · Garatge",
      name: "Fase 1 · Garatge (< 4k€/m MRR)",
      desc: "Validació i supervivència."
    },
    {
      id: 2,
      minRev: 4000,
      maxRev: 18000,
      short: "Fase 2 · Tracció & PMF",
      name: "Fase 2 · Tracció & PMF (4k – 18k€/m)",
      desc: "Primers processos i preus."
    },
    {
      id: 3,
      minRev: 18000,
      maxRev: 75000,
      short: "Fase 3 · Escalat",
      name: "Fase 3 · Escalat (18k – 75k€/m)",
      desc: "Equip, departaments i competència."
    },
    {
      id: 4,
      minRev: 75000,
      maxRev: 300000,
      short: "Fase 4 · Líder Categoria",
      name: "Fase 4 · Líder de Categoria (75k – 300k€/m)",
      desc: "Expansió internacional, M&A, Sèrie A/B o Bootstrapping d'alta rendibilitat."
    },
    {
      id: 5,
      minRev: 300000,
      maxRev: 9999999999,
      short: "Fase 5 · Imperi Consolidat",
      name: "Fase 5 · Imperi Consolidat (> 300k€/m)",
      desc: "Dividends massius, compra de competidors, Sortida a Borsa (IPO) o Gran Exit Industrial."
    }
  ];

  var VENTURES = [
    {
      id: "saas",
      name: "SaaS B2B Vertical",
      sub: "Caixa 18k€ · MRR 1,5k€ · Cost 2,1k€/m · Múlt. 5,2x",
      desc: "Programari de gestió essencial per a pimes industrials amb ingressos recurrents d'alt marge.",
      cash: 18000,
      rev: 1500,
      baseCost: 2100,
      varCostRatio: 0.16,
      growth: 0.18,
      baseChurn: 0.030,
      mult: 5.2
    },
    {
      id: "obrador",
      name: "Cadena d'Obradors & Cafè d'Especialitat",
      sub: "Caixa 26k€ · MRR 3,2k€ · Cost 2,9k€/m · Múlt. 2,6x",
      desc: "Pa de massa mare i cafè torrat propi amb clientela fidel de barri i potencial de múltiples locals.",
      cash: 26000,
      rev: 3200,
      baseCost: 2900,
      varCostRatio: 0.36,
      growth: 0.13,
      baseChurn: 0.020,
      mult: 2.6
    },
    {
      id: "ecom",
      name: "Marca D2C Sostenible",
      sub: "Caixa 20k€ · MRR 2,4k€ · Cost 2,3k€/m · Múlt. 3,1x",
      desc: "Producte físic propi amb subscripció recurrent, disseny curat i venda directa sense intermediaris.",
      cash: 20000,
      rev: 2400,
      baseCost: 2300,
      varCostRatio: 0.32,
      growth: 0.16,
      baseChurn: 0.042,
      mult: 3.1
    },
    {
      id: "ia",
      name: "Agència/Producte d'Automatització IA",
      sub: "Caixa 12k€ · MRR 2,7k€ · Cost 1,8k€/m · Múlt. 4,6x",
      desc: "Agents i fluxos autònoms per a operacions corporatives: comences amb serveis i escales a llicències.",
      cash: 12000,
      rev: 2700,
      baseCost: 1800,
      varCostRatio: 0.22,
      growth: 0.19,
      baseChurn: 0.036,
      mult: 4.6
    },
    {
      id: "salud",
      name: "Clínica / Healthtech de Benestar",
      sub: "Caixa 28k€ · MRR 2,9k€ · Cost 2,7k€/m · Múlt. 3,9x",
      desc: "Salut preventiva, fisioteràpia avançada i seguiment digital per quotes mensuals d'alta retenció.",
      cash: 28000,
      rev: 2900,
      baseCost: 2700,
      varCostRatio: 0.28,
      growth: 0.14,
      baseChurn: 0.018,
      mult: 3.9
    },
    {
      id: "indus",
      name: "Micro-Indústria de Components Tècnics",
      sub: "Caixa 34k€ · MRR 3,4k€ · Cost 3,2k€/m · Múlt. 3,5x",
      desc: "Fabricació de precisió en sèries curtes per a robòtica i maquinària europea amb altes barreres d'entrada.",
      cash: 34000,
      rev: 3400,
      baseCost: 3200,
      varCostRatio: 0.34,
      growth: 0.13,
      baseChurn: 0.014,
      mult: 3.5
    }
  ];

  var DEPARTMENTS = [
    {
      id: "eng",
      name: "Producte / Enginyeria",
      short: "Producte",
      desc: "Qualitat, innovació, menys baixes i millor múltiple.",
      monthlyCosts: [0, 1500, 3800, 8800, 19000, 42000],
      hireFees: [0, 2400, 6000, 14000, 30000, 65000],
      qGrowthBonus: [0, 0.025, 0.050, 0.075, 0.100, 0.125],
      mChurnDrop: [0, 0.003, 0.006, 0.009, 0.012, 0.015],
      multBonus: [0, 0.25, 0.55, 0.90, 1.30, 1.75],
      energySave: [0, 1, 2, 3, 4, 5]
    },
    {
      id: "sales",
      name: "Vendes / Captació",
      short: "Vendes",
      desc: "Motor comercial d'entrada i tancament de grans comptes.",
      monthlyCosts: [0, 1400, 3600, 8400, 18500, 40000],
      hireFees: [0, 2000, 5200, 12500, 27000, 58000],
      qGrowthBonus: [0, 0.042, 0.082, 0.122, 0.160, 0.200],
      mChurnDrop: [0, 0.000, 0.001, 0.002, 0.003, 0.004],
      multBonus: [0, 0.10, 0.25, 0.45, 0.65, 0.90],
      energySave: [0, 1, 2, 3, 4, 5]
    },
    {
      id: "ops",
      name: "Operacions / Suport",
      short: "Operacions",
      desc: "Fidelitza clients, allibera el fundador i blinda el marge.",
      monthlyCosts: [0, 1200, 3000, 7000, 15500, 34000],
      hireFees: [0, 1800, 4500, 10500, 23000, 50000],
      qGrowthBonus: [0, 0.012, 0.025, 0.040, 0.055, 0.070],
      mChurnDrop: [0, 0.005, 0.010, 0.015, 0.020, 0.025],
      multBonus: [0, 0.15, 0.35, 0.60, 0.85, 1.15],
      energySave: [0, 3, 6, 9, 12, 15]
    },
    {
      id: "brand",
      name: "Marca / Comunitat",
      short: "Marca",
      desc: "Autoritat orgànica, boca-orella i prima en la valoració M&A.",
      monthlyCosts: [0, 1100, 2800, 6600, 14500, 32000],
      hireFees: [0, 1600, 4200, 9800, 21000, 46000],
      qGrowthBonus: [0, 0.022, 0.046, 0.072, 0.098, 0.125],
      mChurnDrop: [0, 0.002, 0.005, 0.008, 0.011, 0.014],
      multBonus: [0, 0.30, 0.65, 1.05, 1.50, 2.05],
      energySave: [0, 1, 1, 2, 3, 4]
    }
  ];

  var PRICING_TIERS = [
    {
      id: "eco",
      name: "Econòmic",
      short: "Econòmic",
      desc: "Captació ràpida (+3,5% trim.), marge més estret i +0,5% churn/m.",
      qGrowthMod: 0.035,
      mChurnMod: 0.005,
      varCostMod: 0.06,
      multMod: -0.25
    },
    {
      id: "std",
      name: "Estàndard",
      short: "Estàndard",
      desc: "Equilibri saludable entre conversió, retenció i marge operatiu.",
      qGrowthMod: 0.0,
      mChurnMod: 0.0,
      varCostMod: 0.0,
      multMod: 0.0
    },
    {
      id: "prem",
      name: "Prèmium / Enterprise",
      short: "Prèmium",
      desc: "Alt marge (-6% cost var.), -0,4% churn/m i +0,6x múltiple; captació selectiva.",
      qGrowthMod: -0.015,
      mChurnMod: -0.004,
      varCostMod: -0.06,
      multMod: 0.60
    }
  ];

  var DIVIDEND_POLICIES = [
    {
      id: "reinvest",
      name: "Reinvertir 100%",
      short: "0% Div.",
      rate: 0,
      qGrowthMod: 0.02,
      desc: "Tot el benefici es queda a l'empresa i accelera el creixement compost (+2%/trim)."
    },
    {
      id: "div25",
      name: "25% Dividend al Holding",
      short: "25% Div.",
      rate: 0.25,
      qGrowthMod: 0.0,
      desc: "Si hi ha benefici trimestral, en reparteixes un 25% proporcional al teu Holding."
    },
    {
      id: "div50",
      name: "50% Dividend Cash-Cow",
      short: "50% Div.",
      rate: 0.50,
      qGrowthMod: -0.015,
      desc: "Màquina d'efectiu cap al Holding (50% del benefici net), amb creixement més moderat."
    }
  ];

  var FOCUS_MODES = [
    {
      id: "product",
      k: "P",
      name: "Producte & Retenció",
      short: "PROD",
      desc: "+3,5% creixement, menys baixes i +0,05x múltiple trimestral."
    },
    {
      id: "sales",
      k: "V",
      name: "Captació Comercial",
      short: "VEND",
      desc: "+6,5% vendes trimestrals, però +3% despesa comercial i Energia -4."
    },
    {
      id: "margin",
      k: "M",
      name: "Eficiència & Marges",
      short: "MARG",
      desc: "Poda costos superflus (-5% estructura) i blinda la tresoreria."
    },
    {
      id: "rest",
      k: "C",
      name: "Cultura Calma & Delegació",
      short: "CALM",
      desc: "Recupera +11 d'Energia del fundador amb ritme sostenible."
    }
  ];

  var HOLDING_ASSETS = [
    {
      id: "index_inst",
      name: "Fons Indexat Institucional del Holding",
      cost: 15000,
      monthlyYield: 95,
      desc: "Cartera global d'accions de baixes comissions; reserva líquida rendible."
    },
    {
      id: "angel_log",
      name: "Participació Àngel en Startup Logística",
      cost: 28000,
      monthlyYield: 230,
      desc: "Tiquet minoritari en un equip tècnic brillant de repartiment d'última milla."
    },
    {
      id: "editorial",
      name: "Editorial & Newsletter Especialitzada",
      cost: 48000,
      monthlyYield: 520,
      desc: "Mitjà digital B2B amb patrocinadors fixos i subscriptors anuals fidels."
    },
    {
      id: "micro_saas",
      name: "Comprar SaaS Abandonat amb Clients (Micro-Acquire)",
      cost: 85000,
      monthlyYield: 1050,
      desc: "Eina de facturació rendible amb baixes mínimes gestionada a temps parcial."
    },
    {
      id: "franquicia",
      name: "Franquícia Rendible amb Encarregat",
      cost: 145000,
      monthlyYield: 1700,
      desc: "Local cantoner consolidat que genera caixa constant sense la teva presència."
    },
    {
      id: "nau_ind",
      name: "Nau Industrial Llogada (Triple-Net)",
      cost: 260000,
      monthlyYield: 2450,
      desc: "Actiu logístic amb llogater solvent a 10 anys que paga totes les despeses."
    },
    {
      id: "clinica_pe",
      name: "Participació Majoritària en Clínica",
      cost: 540000,
      monthlyYield: 5700,
      desc: "Centre mèdic privat amb flux de caixa anticíclic i direcció mèdica pròpia."
    },
    {
      id: "buyout_ind",
      name: "Buyout Industrial de Precisió (Micro-PE)",
      cost: 1200000,
      monthlyYield: 13800,
      desc: "Adquisició completa d'un fabricant familiar rendible sense relleu generacional."
    }
  ];

  var MILESTONES = [
    { id: "m_pmf", title: "Encaix de Mercat", desc: "Superar 4.000 €/m (Fase 2)" },
    { id: "m_scale", title: "Motor d'Escalat", desc: "Superar 18.000 €/m (Fase 3)" },
    { id: "m_leader", title: "Líder de Categoria", desc: "Superar 75.000 €/m (Fase 4)" },
    { id: "m_empire", title: "Tità Consolidat", desc: "Superar 300.000 €/m (Fase 5)" },
    { id: "m_div1", title: "Primer Dividend", desc: "Cobrar dividends cap al Holding" },
    { id: "m_exit1", title: "Primer Exit M&A", desc: "Vendre una empresa amb èxit" },
    { id: "m_boot", title: "100% Propietari", desc: "Arribar a Fase 3 amb 100% equity" },
    { id: "m_serial", title: "Emprenedor en Sèrie", desc: "Fundar 2 o més empreses" },
    { id: "m_self", title: "Autofinançat", desc: "Injectar capital propi del Holding" },
    { id: "m_team", title: "Cúpula Directiva", desc: "Sumar 12+ nivells de departament" },
    { id: "m_orgmax", title: "Organització Total", desc: "Els 4 departaments al nivell 5" },
    { id: "m_pass5k", title: "Llibertat Passiva", desc: "Rendes del Holding >= 5.000 €/m" },
    { id: "m_pass25k", title: "Baró del Cash-Flow", desc: "Rendes del Holding >= 25.000 €/m" },
    { id: "m_net1m", title: "Holding Milionari", desc: "Patrimoni Holding >= 1,0M €" },
    { id: "m_net10m", title: "Family Office", desc: "Patrimoni Holding >= 10M €" },
    { id: "m_longev", title: "Llarg Termini", desc: "Dirigir 32+ trimestres una empresa" }
  ];

  var DILEMMAS = [
    // ==================== FASE 1 · GARATGE (Dilemes 1–22) ====================
    {
      id: "d01_cofounder_split", minStage: 1, maxStage: 2, maxQ: 8, noFlag: "hasCof",
      tag: "PACTE DE SOCIS",
      title: "Un perfil complementari vol entrar com a cofundador",
      body: "Domina just l'àrea on tu flaqueges, però demana el 30% a parts iguals des del dia u sense període de consolidació.",
      opts: [
        { t: "Proposar 20% amb consolidació a 4 anys i un any de prova", s: "Equity -20% · MRR +26% · Energia +10", fn: function (st) { st.flags.hasCof = true; st.equity = Math.round(st.equity * 0.80); st.rev = Math.round(st.rev * 1.26); st.energy += 10; return "Accepta el «vesting» amb esportivitat: guanyes un soci compromès a llarg termini i avances el doble de ràpid."; } },
        { t: "Cedir el 30% immediat sense clàusules per no refredar la relació", s: "Equity -30% · MRR +22% · Risc futur", fn: function (st) { st.flags.hasCof = true; st.flags.looseVesting = true; st.equity = Math.round(st.equity * 0.70); st.rev = Math.round(st.rev * 1.22); st.energy += 6; return "Arrenqueu amb entusiasme, però sense xarxa jurídica si algun dia un dels dos afluixa."; } },
        { t: "Continuar en solitari i subcontractar tasques puntuals", s: "Caixa -2.800 € · Conserves el 100%", fn: function (st) { st.cash -= 2800; st.rev = Math.round(st.rev * 1.09); st.energy -= 5; return "Mantens el 100% de la propietat pagant ajuda externa només quan cal."; } }
      ]
    },
    {
      id: "d02_customer_discovery", minStage: 1, maxStage: 1,
      tag: "VALIDACIÓ DE MERCAT",
      title: "Cinquanta converses abans de polir el producte",
      body: "Tens la temptació de tancar-te tres mesos a perfeccionar cada detall abans d'ensenyar res al carrer.",
      opts: [
        { t: "Sortir a vendre una versió mínima cobrant des del primer dia", s: "MRR +24% · Churn inicial lleu · Energia -4", fn: function (st) { st.rev = Math.round(st.rev * 1.24); st.churnMod = (st.churnMod || 0) + 0.002; st.energy -= 4; return "Els clients paguen i et diuen exactament què sobra i què falta: estalvies mesos de conjectures."; } },
        { t: "Fer 40 entrevistes profundes i llançar un pilot tancat de pagament", s: "MRR +18% · Churn -0,3%/m · Múltiple +0,2x", fn: function (st) { st.rev = Math.round(st.rev * 1.18); st.churnMod = (st.churnMod || 0) - 0.003; st.multMod = (st.multMod || 0) + 0.2; return "Descobreixes el dolor real del client i afines la proposta amb una retenció excel·lent."; } },
        { t: "Tancar-te al garatge fins que el producte sigui impecable", s: "Caixa -2.500 € · Múltiple +0,15x · Energia -8", fn: function (st) { st.cash -= 2500; st.rev = Math.round(st.rev * 1.04); st.multMod = (st.multMod || 0) + 0.15; st.energy -= 8; return "L'acabat és molt fi, però has consumit tres mesos de caixa gairebé sense noves altes."; } }
      ]
    },
    {
      id: "d03_cold_outreach", minStage: 1, maxStage: 2,
      tag: "PRIMERES VENDES",
      title: "El silenci incòmode de la prospecció en fred",
      body: "El boca-orella inicial s'atura. Cal sortir a buscar clients que encara no et coneixen de res.",
      opts: [
        { t: "Trucar i visitar personalment 15 negocis cada setmana", s: "MRR +22% · Cost 0 € · Energia -9", fn: function (st) { st.rev = Math.round(st.rev * 1.22); st.energy -= 9; return "Rebre «no» curteix la pell, però tanques una dotzena de comptes que paguen puntualment."; } },
        { t: "Publicar casos pràctics reals amb xifres transparents", s: "MRR +15% · Múltiple +0,2x · Energia -3", fn: function (st) { st.rev = Math.round(st.rev * 1.15); st.multMod = (st.multMod || 0) + 0.2; st.energy -= 3; return "La transparència genera confiança i comencen a arribar consultes qualificades cada setmana."; } },
        { t: "Gastar 3.500 € en anuncis digitals sense tenir l'embut provat", s: "Caixa -3.500 € · Resultat incert", fn: function (st, rng) { st.cash -= 3500; if (rng() < 0.4) { st.rev = Math.round(st.rev * 1.20); return "Encertes una creativitat que converteix prou bé i sumes nous clients."; } st.rev = Math.round(st.rev * 1.05); return "Els clics surten cars i pocs visitants acaben comprant en fred."; } }
      ]
    },
    {
      id: "d04_friend_discount", minStage: 1, maxStage: 2,
      tag: "MARGES I LÍMITS",
      title: "Un conegut influent et demana el servei gairebé regalat",
      body: "Promet «donar-te molta visibilitat» entre els seus contactes si li fas un 70% de descompte permanent.",
      opts: [
        { t: "Mantenir la tarifa íntegra i oferir-li un mes de garantia", s: "MRR +12% · Múltiple +0,15x · Respecte intacte", fn: function (st) { st.rev = Math.round(st.rev * 1.12); st.multMod = (st.multMod || 0) + 0.15; st.energy += 3; return "Valora la teva fermesa, paga el preu complet i a sobre et recomana de debò."; } },
        { t: "Acceptar un 20% puntual a canvi d'un cas d'èxit signat per escrit", s: "MRR +15% · Cas comercial útil", fn: function (st) { st.rev = Math.round(st.rev * 1.15); return "El testimoni documentat t'ajuda a tancar tres clients nous a preu complet."; } },
        { t: "Fer-li el 70% de descompte per por de perdre l'oportunitat", s: "Estructura +350 €/m · Energia -8", fn: function (st) { st.rev += 180; st.fixedCost += 350; st.energy -= 8; return "Acaba sent el client que més truca i menys paga, i la visibilitat promesa no arriba mai."; } }
      ]
    },
    {
      id: "d05_public_grant", minStage: 1, maxStage: 2, noFlag: "askedGrant",
      tag: "FINANÇAMENT PÚBLIC",
      title: "Convocatòria d'ajuts a la innovació amb molta paperassa",
      body: "Hi ha una subvenció a fons perdut de 28.000 €, però preparar la memòria tècnica absorbirà setmanes senceres.",
      opts: [
        { t: "Ignorar la subvenció i dedicar aquestes hores a tancar clients", s: "MRR +19% · Zero burocràcia", fn: function (st) { st.flags.askedGrant = true; st.rev = Math.round(st.rev * 1.19); return "Els euros dels clients arriben aquest mateix mes sense justificacions ni auditories."; } },
        { t: "Contractar una gestoria a èxit (15% si s'aprova) i no distreure't", s: "65% d'opcions de +23.800 € nets", fn: function (st, rng) { st.flags.askedGrant = true; st.cash -= 600; if (rng() < 0.65) { st.cash += 23800; return "Subvenció concedida! Rebs 23.800 € nets sense haver perdut el focus comercial."; } return "La convocatòria s'esgota per punts; només hi perds la taxa inicial de tramitació."; } },
        { t: "Redactar tota la memòria tu mateix a les nits", s: "Energia -14 · 55% d'opcions de +28.000 €", fn: function (st, rng) { st.flags.askedGrant = true; st.energy -= 14; if (rng() < 0.55) { st.cash += 28000; return "Després de nits en blanc amb formularis infinits, t'ingressen els 28.000 € íntegres."; } return "Denegada per un detall formal; t'emportes una lliçó dura sobre el cost d'oportunitat."; } }
      ]
    },
    {
      id: "d06_workspace_garage", minStage: 1, maxStage: 2,
      tag: "ESTRUCTURA FIXA",
      title: "Treballar des de casa o llogar un primer espai propi",
      body: "La taula del menjador es queda petita, però un lloguer fix cada mes retalla el marge de maniobra.",
      opts: [
        { t: "Mantenir estructura ultralleugera en remot i trobades setmanals", s: "Cost fix -250 €/m · Energia +4", fn: function (st) { st.fixedCost = Math.max(500, st.fixedCost - 250); st.energy += 4; return "Cada euro estalviat en lloguer es converteix en mesos addicionals de supervivència."; } },
        { t: "Agafar dues taules flexibles en un espai compartit del sector", s: "Cost fix +320 €/m · MRR +13% per sinergies", fn: function (st) { st.fixedCost += 320; st.rev = Math.round(st.rev * 1.13); st.energy += 5; return "Separes vida i feina i fas aliances comercials amb veïns d'espai."; } },
        { t: "Llogar un local vistós a peu de carrer amb aval de 6 mesos", s: "Caixa -5.500 € · Cost fix +950 €/m · Marca +", fn: function (st) { st.cash -= 5500; st.fixedCost += 950; st.rev = Math.round(st.rev * 1.16); st.multMod = (st.multMod || 0) + 0.15; return "Dóna presència física des del minut u, però t'obliga a facturar sense badar."; } }
      ]
    },
    {
      id: "d07_annual_prepay", minStage: 1, maxStage: 3,
      tag: "ENGINYERIA DE CAIXA",
      title: "Cobrar per avançat per finançar el creixement",
      body: "Necessites liquiditat per invertir sense diluir el teu percentatge de l'empresa.",
      opts: [
        { t: "Llançar plans anuals amb 2 mesos gratuïts si paguen avui", s: "Caixa immediata +2,2x MRR · Fidelitat 12m", fn: function (st) { var b = scaleAmt(st, 2.2, 3200); st.cash += b; st.churnMod = (st.churnMod || 0) - 0.003; return "Maniobra brillant: ingressen " + fmt(b) + " al comptat i assegures la retenció tot l'any."; } },
        { t: "Cobrar una quota d'alta i configuració inicial als nous clients", s: "Caixa +1,2x MRR · MRR +8%", fn: function (st) { var b = scaleAmt(st, 1.2, 1800); st.cash += b; st.rev = Math.round(st.rev * 1.08); return "La quota d'alta filtra curiosos i cobreix de sobres el cost de captació (" + fmt(b) + ")."; } },
        { t: "Mantenir només quota mensual sense compromís de permanència", s: "MRR +14% · Sense injecció extra de caixa", fn: function (st) { st.rev = Math.round(st.rev * 1.14); return "Redueixes la fricció d'entrada al mínim i sumes noves altes mensuals."; } }
      ]
    },
    {
      id: "d08_early_bug_crisis", minStage: 1, maxStage: 2,
      tag: "INCIDÈNCIA GREU",
      title: "Un error de cap de setmana afecta els primers clients",
      body: "Una actualització divendres al vespre deixa serveis a mitges i tens mitja dotzena de missatges urgents.",
      opts: [
        { t: "Trucar un per un, arreglar-ho dissabte i abonar-los el mes", s: "Caixa -0,4x MRR · Churn -0,4%/m · Energia -7", fn: function (st) { var c = scaleAmt(st, 0.4, 900); st.cash -= c; st.churnMod = (st.churnMod || 0) - 0.004; st.energy -= 7; return "La resposta honesta i ràpida converteix clients enfadats en defensors incondicionals."; } },
        { t: "Publicar una nota d'estat i desplegar el pedaç dilluns al matí", s: "Energia intacta · Es perden alguns clients", fn: function (st) { st.rev = Math.max(500, Math.round(st.rev * 0.94)); st.energy += 2; return "Protegeixes el descans, tot i que un parell de comptes impacients es donen de baixa."; } },
        { t: "Contractar una auditoria externa de qualitat i proves automàtiques", s: "Caixa -3.600 € · Múltiple +0,25x", fn: function (st) { st.cash -= 3600; st.multMod = (st.multMod || 0) + 0.25; st.churnMod = (st.churnMod || 0) - 0.003; return "Poses fonaments sòlids perquè cap divendres torni a espatllar el cap de setmana."; } }
      ]
    },
    {
      id: "d09_niche_focus", minStage: 1, maxStage: 2,
      tag: "POSICIONAMENT",
      title: "Servir a tothom o dominar un nínxol molt concret",
      body: "T'arriben peticions de sectors molt dispersos, però un sol gremi concentra els clients que millor paguen.",
      opts: [
        { t: "Especialitzar missatge i producte al 100% en aquest gremi", s: "MRR +23% · Múltiple +0,3x · Menys dispersió", fn: function (st) { st.rev = Math.round(st.rev * 1.23); st.multMod = (st.multMod || 0) + 0.3; st.energy += 4; return "En parlar exactament el seu llenguatge, et converteixes en la referència indiscutible del sector."; } },
        { t: "Mantenir el producte genèric amb pàgines adaptades per sector", s: "MRR +14% · Risc diversificat", fn: function (st) { st.rev = Math.round(st.rev * 1.14); return "Captes clients de diversos rams sense tancar cap porta prematurament."; } },
        { t: "Acceptar encàrrecs a mida de qualsevol sector que pagui avui", s: "Caixa +3.800 € · Cost fix +400 €/m · Energia -9", fn: function (st) { st.cash += 3800; st.fixedCost += 400; st.energy -= 9; return "Factures a curt termini, però el catàleg sembla un bazar difícil d'escalar."; } }
      ]
    },
    {
      id: "d10_first_intern_or_pro", minStage: 1, maxStage: 2,
      tag: "PRIMER REFORÇ",
      title: "Ja no arribes a tot: perfil júnior o professional autònom",
      body: "Les tasques operatives et roben les hores de vendre i pensar amb claredat.",
      opts: [
        { t: "Fitxar un especialista sènior a mitja jornada molt resolutiu", s: "Cost fix +1.100 €/m · MRR +19% · Energia +9", fn: function (st) { st.fixedCost += 1100; st.rev = Math.round(st.rev * 1.19); st.energy += 9; return "Des del segon dia resol problemes sol i et deixa temps lliure per captar comptes nous."; } },
        { t: "Incorporar un perfil júnior amb ganes i formar-lo personalment", s: "Cost fix +750 €/m · Energia -6 ara, +creixement", fn: function (st) { st.fixedCost += 750; st.rev = Math.round(st.rev * 1.12); st.energy -= 6; return "Els primers mesos et demana molta dedicació, però creix amb la cultura de la casa."; } },
        { t: "Eliminar el 30% de tasques menys rendibles abans de contractar", s: "Cost fix -200 €/m · Energia +7 · MRR +6%", fn: function (st) { st.fixedCost = Math.max(500, st.fixedCost - 200); st.energy += 7; st.rev = Math.round(st.rev * 1.06); return "Simplifiques el negoci abans d'afegir estructura innecessària."; } }
      ]
    },
    {
      id: "d11_founder_salary", minStage: 1, maxStage: 2,
      tag: "ECONOMIA PERSONAL",
      title: "Fixar-te un sou digne o viure d'estalvis personals",
      body: "Portes trimestres cobrant el mínim indispensable per deixar cada cèntim dins la caixa de l'empresa.",
      opts: [
        { t: "Assignar-te una nòmina sòbria però tranquil·la de mercat", s: "Cost fix +900 €/m · Energia +14 · Ment serena", fn: function (st) { st.fixedCost += 900; st.energy += 14; return "Pagar les factures de casa sense angoixa et permet prendre decisions empresarials molt més lúcides."; } },
        { t: "Mantenir el sou simbòlic dos trimestres més per accelerar caixa", s: "Caixa protegida · MRR +10% · Energia -8", fn: function (st) { st.rev = Math.round(st.rev * 1.10); st.energy -= 8; return "La tresoreria de l'empresa s'enforteix, tot i notar la pressió domèstica."; } },
        { t: "Vincular un plus variable només als mesos amb benefici net", s: "Caixa equilibrada · Energia +7 · MRR +12%", fn: function (st) { st.rev = Math.round(st.rev * 1.12); st.energy += 7; return "Alinees la teva tranquil·litat personal amb la salut real del marge mensual."; } }
      ]
    },
    {
      id: "d12_brand_naming", minStage: 1, maxStage: 2, noFlag: "namedBrand",
      tag: "IDENTITAT I PROPIETAT",
      title: "Conflicte registral amb el nom comercial",
      body: "Una empresa europea d'un sector proper t'envia un requeriment amistós perquè el teu nom s'assembla al seu.",
      opts: [
        { t: "Rebatejar ara amb marca pròpia registrada i domini net", s: "Caixa -2.400 € · Múltiple +0,25x · Zero litigi", fn: function (st) { st.flags.namedBrand = true; st.cash -= 2400; st.multMod = (st.multMod || 0) + 0.25; return "Aprofites el canvi per blindar la marca a tota la Unió Europea abans de ser gran."; } },
        { t: "Negociar un acord de coexistència delimitant sectors", s: "Caixa -1.200 € d'advocats · Mantens el nom", fn: function (st) { st.flags.namedBrand = true; st.cash -= 1200; return "Signeu un pacte pacífic que et permet conservar els clients i la cartelleria actual."; } },
        { t: "Ignorar la carta pensant que encara ets massa petit", s: "Cost 0 € avui · Risc latent d'imatge", fn: function (st, rng) { st.flags.namedBrand = true; if (rng() < 0.45) { st.cash -= 4800; st.energy -= 9; return "Presenten oposició formal i t'obliguen a canviar-ho de pressa i pagant costes."; } return "De moment no insisteixen i t'estalvies la despesa jurídica."; } }
      ]
    },
    {
      id: "d13_supplier_terms", minStage: 1, maxStage: 3,
      tag: "PROVEÏDORS I TRESORERIA",
      title: "Negociació de terminis amb el proveïdor principal",
      body: "Pagues les compres i servidors al comptat mentre alguns clients tarden 30 dies a abonar les factures.",
      opts: [
        { t: "Pactar pagament a 60 dies a canvi de volum compromès", s: "Caixa +1,1x MRR d'oxigen · Cost estable", fn: function (st) { var w = scaleAmt(st, 1.1, 2400); st.cash += w; return "Finances el cicle d'explotació amb el crèdit comercial del proveïdor (+" + fmt(w) + " en caixa)."; } },
        { t: "Pagar al comptat exigint un 12% de descompte per ràpel", s: "Caixa -0,5x MRR · Cost fix -8% estructural", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 1200); st.fixedCost = Math.max(500, Math.round(st.fixedCost * 0.92)); return "Sacrifiques una mica d'efectiu avui per eixamplar el marge net de cada mes."; } },
        { t: "Homologar un segon proveïdor alternatiu per no dependre d'un", s: "Caixa -1.500 € · Múltiple +0,15x · Seguretat", fn: function (st) { st.cash -= 1500; st.multMod = (st.multMod || 0) + 0.15; return "Elimines un punt únic de fallada a la teva cadena de subministrament."; } }
      ]
    },
    {
      id: "d14_referral_loop", minStage: 1, maxStage: 3,
      tag: "CREIXEMENT ORGÀNIC",
      title: "Els clients actuals estan encantats però recomanen poc",
      body: "La satisfacció és altíssima, però gairebé ningú pensa espontàniament a portar-te col·legues del seu gremi.",
      opts: [
        { t: "Crear un programa doble: un mes gratuït per a qui convida i per al convidat", s: "MRR +19% · Cost de captació mínim", fn: function (st) { st.rev = Math.round(st.rev * 1.19); st.churnMod = (st.churnMod || 0) - 0.002; return "Les recomanacions es multipliquen entre professionals que ja confien els uns en els altres."; } },
        { t: "Organitzar sopars trimestrals en petit comitè amb clients i convidats", s: "Caixa -1.800 € · MRR +16% · Energia +4", fn: function (st) { st.cash -= 1800; st.rev = Math.round(st.rev * 1.16); st.energy += 4; return "Les relacions humanes cara a cara tanquen contractes d'alt valor amb una naturalitat sorprenent."; } },
        { t: "Oferir comissió en metàl·lic del 15% a prescriptors i consultors", s: "MRR +22% · Cost fix +450 €/m", fn: function (st) { st.rev = Math.round(st.rev * 1.22); st.fixedCost += 450; return "Diversos assessors externs comencen a prescriure la teva solució als seus propis clients."; } }
      ]
    },
    {
      id: "d15_accelerator_offer", minStage: 1, maxStage: 2, noFlag: "joinedAccel",
      tag: "ACCELERADORA",
      title: "Plaça en una acceleradora de prestigi a canvi del 7% d'accions",
      body: "Inverteixen 35.000 € i prometen mentors i Demo Day davant d'inversors d'aquí a quatre mesos.",
      opts: [
        { t: "Entrar-hi per la xarxa de contactes i l'impuls comercial", s: "Caixa +35.000 € · Equity -7% · MRR +24%", fn: function (st) { st.flags.joinedAccel = true; st.cash += 35000; st.equity = Math.round(st.equity * 0.93); st.rev = Math.round(st.rev * 1.24); st.energy -= 5; return "Aprofites cada mentoria per obrir portes corporatives que en fred haurien costat anys."; } },
        { t: "Declinar educadament: el 7% de la teva empresa valdrà massa car", s: "100% d'independència · MRR +11% · Energia +4", fn: function (st) { st.flags.joinedAccel = true; st.rev = Math.round(st.rev * 1.11); st.energy += 4; return "Evites reunions teòriques i dediques el trimestre sencer a facturar sense cedir capital."; } },
        { t: "Negociar entrar només al programa formatiu sense inversió ni dilució", s: "Caixa -2.000 € matrícula · MRR +15%", fn: function (st) { st.flags.joinedAccel = true; st.cash -= 2000; st.rev = Math.round(st.rev * 1.15); return "Accedeixes als tallers clau conservant intacta tota la taula de capitalització."; } }
      ]
    },
    {
      id: "d16_bad_fit_customers", minStage: 1, maxStage: 2,
      tag: "QUALITAT DE CARTERA",
      title: "Un 15% dels clients generen el 80% de les queixes",
      body: "Són comptes petits que demanen excepcions diàries i esgoten la paciència i el suport.",
      opts: [
        { t: "Acomiadar educadament els comptes tòxics i apujar el mínim d'entrada", s: "MRR -4% avui · Cost -12% · Energia +14!", fn: function (st) { st.rev = Math.round(st.rev * 0.96); st.fixedCost = Math.max(500, Math.round(st.fixedCost * 0.88)); st.energy += 14; st.churnMod = (st.churnMod || 0) - 0.003; return "Quina pau! Recuperes hores i energia per servir de meravella els clients que sí que són rendibles."; } },
        { t: "Moure'ls a una tarifa d'autoservei sense suport telefònic", s: "MRR +6% · Energia +8", fn: function (st) { st.rev = Math.round(st.rev * 1.06); st.energy += 8; return "La meitat accepta l'autoservei i l'altra meitat puja a la tarifa superior per mantenir l'atenció."; } },
        { t: "Aguantar-los a tots per no perdre ni un euro de facturació", s: "MRR +3% · Energia -12 · Churn +0,3%/m", fn: function (st) { st.rev = Math.round(st.rev * 1.03); st.energy -= 12; st.churnMod = (st.churnMod || 0) + 0.003; return "L'equip acaba saturat apagant focs menors i desatenent els comptes amb més recorregut."; } }
      ]
    },
    {
      id: "d17_channel_partner", minStage: 1, maxStage: 3,
      tag: "CANAL INDIRECTE",
      title: "Una distribuïdora consolidada vol revendre el teu producte",
      body: "Tenen 2.000 clients en cartera, però demanen un 35% de marge comercial i marca blanca parcial.",
      opts: [
        { t: "Signar acord no exclusiu mantenint sempre la teva marca visible", s: "MRR +25% · Múltiple +0,2x", fn: function (st) { st.rev = Math.round(st.rev * 1.25); st.multMod = (st.multMod || 0) + 0.2; return "El canal et porta volum constant sense inflar la teva pròpia nòmina comercial."; } },
        { t: "Acceptar marca blanca amb un mínim garantit per contracte", s: "Caixa +2,0x MRR · Múltiple -0,15x", fn: function (st) { var g = scaleAmt(st, 2.0, 5000); st.cash += g; st.rev = Math.round(st.rev * 1.18); st.multMod = (st.multMod || 0) - 0.15; return "Cobres un mínim garantit de " + fmt(g) + ", tot i que l'usuari final no veu el teu logotip."; } },
        { t: "Rebutjar intermediaris per controlar el 100% de la relació i el marge", s: "MRR +9% · Múltiple +0,15x", fn: function (st) { st.rev = Math.round(st.rev * 1.09); st.multMod = (st.multMod || 0) + 0.15; return "Creixes més a poc a poc, però ningú et pot desconnectar la cartera de clients d'un dia per l'altre."; } }
      ]
    },
    {
      id: "d18_weekend_tradefair", minStage: 1, maxStage: 3,
      tag: "FIRA SECTORIAL",
      title: "La fira anual de referència obre inscripcions d'estands",
      body: "Un estand propi val un bon pessic; també hi pots anar com a visitant amb l'agenda plena de reunions.",
      opts: [
        { t: "Anar-hi sense estand amb 30 reunions tancades prèviament al cafè", s: "Caixa -650 € · MRR +17% · Alta eficiència", fn: function (st) { st.cash -= 650; st.rev = Math.round(st.rev * 1.17); st.energy -= 4; return "Tàctica de guerrilla impecable: tanques acords clau gastant una desena part que els expositors."; } },
        { t: "Muntar un estand impecable amb demostracions en viu", s: "Caixa -1,4x MRR · MRR +28% · Marca +0,2x", fn: function (st) { var c = scaleAmt(st, 1.4, 4500); st.cash -= c; st.rev = Math.round(st.rev * 1.28); st.multMod = (st.multMod || 0) + 0.2; st.energy -= 8; return "L'estand s'omple de gom a gom i en surts amb comandes fermes que amorteixen la inversió (" + fmt(c) + ")."; } },
        { t: "Quedar-se a casa avançant feina pendent", s: "Energia +6 · MRR +4%", fn: function (st) { st.energy += 6; st.rev = Math.round(st.rev * 1.04); return "Setmana tranquil·la i ordenada, tot i deixar escapar el pols directe del sector."; } }
      ]
    },
    {
      id: "d19_copywriting_rework", minStage: 1, maxStage: 2,
      tag: "CONVERSIÓ COMERCIAL",
      title: "Moltes visites però pocs compren a la primera",
      body: "Explicaves la part tècnica amb pèls i senyals, però al comprador li costa entendre quin estalvi real obté.",
      opts: [
        { t: "Reescriure tota la proposta amb una calculadora clara de retorn (ROI)", s: "MRR +21% · Conversió disparada", fn: function (st) { st.rev = Math.round(st.rev * 1.21); return "Quan el client veu en segons quants diners i hores estalvia, la venda es tanca gairebé sola."; } },
        { t: "Afegir demostració personalitzada de 15 minuts abans del pressupost", s: "MRR +18% · Energia -5", fn: function (st) { st.rev = Math.round(st.rev * 1.18); st.energy -= 5; return "El tracte proper resol objeccions al moment i eleva el tiquet mitjà."; } },
        { t: "Oferir prova gratuïta oberta de 30 dies sense targeta", s: "Altes altes però Cost +400 €/m · MRR +10%", fn: function (st) { st.fixedCost += 400; st.rev = Math.round(st.rev * 1.10); return "Entren molts curiosos que consumeixen suport i només una petita fracció passa a pagament."; } }
      ]
    },
    {
      id: "d20_accounting_mess", minStage: 1, maxStage: 2,
      tag: "RIGOR FINANCER",
      title: "Tancament d'IVA i conciliació de factures a última hora",
      body: "Portaves els comptes en un full de càlcul improvisat i el trimestre fiscal t'enxampa amb factures barrejades.",
      opts: [
        { t: "Implantar programari comptable integrat i assessoria rigorosa", s: "Caixa -1.400 € · Cost fix +180 €/m · Visibilitat total", fn: function (st) { st.cash -= 1400; st.fixedCost += 180; st.multMod = (st.multMod || 0) + 0.15; st.energy += 6; return "Ara saps el marge exacte de cada línia en temps real i dorms tranquil amb Hisenda."; } },
        { t: "Passar el cap de setmana quadrant tiquets manualment", s: "Cost 0 € · Energia -11", fn: function (st) { st.energy -= 11; return "Presentes els models a temps per pèls, però amb els ulls quadrats de tants rebuts."; } },
        { t: "Ajornar el pagament d'impostos amb recàrrec per guardar liquiditat", s: "Caixa +2.500 € avui · Cost financer +260 €/m", fn: function (st) { st.cash += 2500; st.fixedCost += 260; return "Guanyes aire temporal a caixa pagant interessos d'ajornament."; } }
      ]
    },
    {
      id: "d21_micro_influencer", minStage: 1, maxStage: 3,
      tag: "PRESCRIPCIÓ",
      title: "Un divulgador molt respectat prova el teu producte pel seu compte",
      body: "T'escriu en privat dient que li ha agradat molt i pregunta si tens capacitat si ho esmenta dijous.",
      opts: [
        { t: "Reforçar estoc i servidors i preparar una pàgina especial de benvinguda", s: "Caixa -0,6x MRR · MRR +29%!", fn: function (st) { st.cash -= scaleAmt(st, 0.6, 1500); st.rev = Math.round(st.rev * 1.29); return "L'allau d'altes entra com la seda sense ni un minut de caiguda i fidelitzes la nova onada!"; } },
        { t: "Activar llista d'accés per torns per no saturar l'operativa", s: "Cost 0 € · MRR +18% · Múltiple +0,2x", fn: function (st) { st.rev = Math.round(st.rev * 1.18); st.multMod = (st.multMod || 0) + 0.2; return "Absorbeixes la demanda de manera ordenada mantenint una atenció impecable."; } },
        { t: "No tocar res i confiar que l'estructura actual aguantarà", s: "50% èxit net / 50% col·lapse temporal", fn: function (st, rng) { if (rng() < 0.5) { st.rev = Math.round(st.rev * 1.22); return "Tot resisteix al límit i sumes un gran trimestre gairebé de franc!"; } st.rev = Math.round(st.rev * 1.07); st.energy -= 10; return "L'embut es col·lapsa el cap de setmana i perds bona part de l'impuls."; } }
      ]
    },
    {
      id: "d22_cofounder_fatigue", minStage: 1, maxStage: 3, reqFlag: "hasCof", noFlag: "resolvedCofSplit",
      tag: "TENSIÓ SOCIETÀRIA",
      title: "Desgast i visió divergent amb el teu cofundador",
      body: "Un vol arriscar fort per créixer de pressa i l'altre prefereix assegurar rendibilitat i horaris humans.",
      opts: [
        { t: "Comprar-li la meitat de la seva part amb caixa i redefinir rols clars", s: "Caixa -1,8x MRR · Recuperes +8% Equity · Energia +9", fn: function (st) { st.flags.resolvedCofSplit = true; var p = scaleAmt(st, 1.8, 4500); st.cash -= p; st.equity = Math.min(100, st.equity + 8); st.energy += 9; return "Acord elegant per " + fmt(p) + ": recuperes accions, comandament clar i bona sintonia personal."; } },
        { t: "Fer dues jornades de mediació externa i fixar objectius trimestrals", s: "Caixa -1.600 € · MRR +15% · Equip alineat", fn: function (st) { st.flags.resolvedCofSplit = true; st.cash -= 1600; st.rev = Math.round(st.rev * 1.15); st.energy += 6; return "Poseu les cartes sobre la taula a temps i en sortiu amb un rumb compartit molt més sòlid."; } },
        { t: "Deixar passar el conflicte en silenci per evitar una conversa incòmoda", s: "Energia -14 · MRR estancat", fn: function (st) { st.energy -= 14; st.rev = Math.round(st.rev * 1.02); return "La tensió soterrada frena les decisions clau durant tot el trimestre."; } }
      ]
    },
    // ==================== FASE 2 · TRACCIÓ & PMF (Dilemes 23–48) ====================
    {
      id: "d23_churn_crisis", minStage: 2, maxStage: 3,
      tag: "CRISI DE RETENCIÓ",
      title: "Alarma vermella: les baixes mensuals es disparen",
      body: "Entren clients nous per la porta principal, però un degoteig silenciós de cancel·lacions et buida la galleda pel darrere.",
      opts: [
        { t: "Aturar noves funcionalitats 6 setmanes per blindar l'acompanyament inicial", s: "Churn -0,8%/m permanent · Múltiple +0,35x", fn: function (st) { st.churnMod = (st.churnMod || 0) - 0.008; st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.11); return "Descobreixes que el 70% marxava perquè no configurava bé el primer pas: les baixes cauen en picat!"; } },
        { t: "Trucar personalment als últims 30 clients que han marxat i fer oferta de retorn", s: "MRR +14% · Churn -0,4%/m · Energia -7", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.churnMod = (st.churnMod || 0) - 0.004; st.energy -= 7; return "Recuperes un terç dels comptes perduts i obtens informació d'or per corregir punts cecs."; } },
        { t: "Doblar la inversió comercial per tapar les baixes amb més altes", s: "Caixa -1,2x MRR · MRR +16% · Churn segueix alt", fn: function (st) { st.cash -= scaleAmt(st, 1.2, 6000); st.rev = Math.round(st.rev * 1.16); st.churnMod = (st.churnMod || 0) + 0.002; return "Maquilles la xifra de facturació aquest trimestre, però la galleda continua tenint fuites."; } }
      ]
    },
    {
      id: "d24_enterprise_whale", minStage: 2, maxStage: 4,
      tag: "CONTRACTE BALENA",
      title: "Una gran corporació vol contractar-te amb exigències a mida",
      body: "Posarien un contracte equivalent a tres mesos de la teva facturació, però demanen canvis exclusius que desviaran l'equip.",
      opts: [
        { t: "Oferir només el producte estàndard amb suport prioritari inclòs", s: "MRR +19% net i escalable · Múltiple +0,2x", fn: function (st) { st.rev = Math.round(st.rev * 1.19); st.multMod = (st.multMod || 0) + 0.2; st.energy += 3; return "Respecten el teu criteri de producte i signen igualment sense hipotecar el teu full de ruta!"; } },
        { t: "Acceptar el desenvolupament cobrant el 100% per avançat i sense exclusivitat", s: "Caixa +2,8x MRR · Cost fix +8% · Energia -9", fn: function (st) { var up = scaleAmt(st, 2.8, 16000); st.cash += up; st.fixedCost = Math.round(st.fixedCost * 1.08); st.rev = Math.round(st.rev * 1.14); st.energy -= 9; return "Cobres " + fmt(up) + " d'entrada i reutilitzes els mòduls nous per a altres comptes grans."; } },
        { t: "Fer tot el que demanen a preu rebaixat per posar el seu logotip a la web", s: "MRR +12% · Cost fix +18% · Energia -15", fn: function (st) { st.rev = Math.round(st.rev * 1.12); st.fixedCost = Math.round(st.fixedCost * 1.18); st.energy -= 15; return "Tens un logotip famós a la portada, però l'equip viu segrestat per les seves urgències diàries."; } }
      ]
    },
    {
      id: "d25_pricing_experiment", minStage: 2, maxStage: 3, noFlag: "didPriceExp",
      tag: "EXPERIMENT DE PREUS",
      title: "Els clients diuen «sí» sense ni parpellejar davant del pressupost",
      body: "Senyal inequívoc que regales marge. Et planteges reestructurar tarifes per capturar el valor real que aportes.",
      opts: [
        { t: "Apujar un +28% als nous clients i respectar el preu antic als fidels", s: "MRR +20% · Zero baixes · Fidelitat alta", fn: function (st) { st.flags.didPriceExp = true; st.rev = Math.round(st.rev * 1.20); st.churnMod = (st.churnMod || 0) - 0.002; st.energy += 4; return "Els nous comptes accepten la nova tarifa amb tota normalitat i els veterans t'ho agraeixen!"; } },
        { t: "Crear tres trams amb un pla Enterprise d'alt valor al capdamunt", s: "MRR +25% · Múltiple +0,35x", fn: function (st) { st.flags.didPriceExp = true; st.rev = Math.round(st.rev * 1.25); st.multMod = (st.multMod || 0) + 0.35; return "Un 20% de la cartera es passa voluntàriament al tram superior i dispara el marge mitjà."; } },
        { t: "Aplicar una pujada brusca del +35% a tota la base demà mateix", s: "MRR net +17% · Alguns clients marxen molestos", fn: function (st) { st.flags.didPriceExp = true; st.rev = Math.round(st.rev * 1.17); st.churnMod = (st.churnMod || 0) + 0.003; st.fixedCost = Math.max(600, Math.round(st.fixedCost * 0.94)); return "Factures més amb menys volum operatiu, tot i entomar un mes de trucades tenses."; } }
      ]
    },
    {
      id: "d26_vc_seed_round", minStage: 2, maxStage: 3, noFlag: "raisedSeed",
      tag: "RONDA LLAVOR (SEED)",
      title: "Un fons de capital risc t'ofereix 220.000 € pel 18% d'accions",
      body: "El Term Sheet inclou consell d'administració trimestral i una preferència de liquidació d'1x sobre el capital invertit.",
      opts: [
        { t: "Rebutjar el VC i créixer amb el flux de caixa dels propis clients", s: "Zero dilució · Llibertat total · MRR +13%", fn: function (st) { st.rev = Math.round(st.rev * 1.13); st.energy += 5; return "Cap inversor extern marca el teu rellotge: cada euro guanyat i cada acció continuen sent teus."; } },
        { t: "Signar la ronda llavor de 220.000 € per accelerar contractacions", s: "Caixa +220k€ · Equity -18% · LiqPref 220k€ · MRR +38%", fn: function (st) { st.flags.raisedSeed = true; st.cash += 220000; st.equity = Math.max(10, Math.round(st.equity * 0.82)); st.liqPref = (st.liqPref || 0) + 220000; st.fixedCost += 3400; st.rev = Math.round(st.rev * 1.38); st.energy -= 5; return "Injectes 220.000 € al motor! Fitxes perfils clau i la corba d'ingressos fa un salt d'escala."; } },
        { t: "Tancar només 65.000 € amb inversors privats tranquils pel 6%", s: "Caixa +65k€ · Equity -6% · Sense clàusules dures · MRR +20%", fn: function (st) { st.flags.raisedSeed = true; st.cash += 65000; st.equity = Math.max(10, Math.round(st.equity * 0.94)); st.fixedCost += 800; st.rev = Math.round(st.rev * 1.20); return "Obtens un coixí magnífic i mentors operatius sense cedir drets polítics ni preferències."; } }
      ]
    },
    {
      id: "d27_supply_server_outage", minStage: 2, maxStage: 4,
      tag: "XOC OPERATIU",
      title: "Caiguda crítica del proveïdor d'infraestructura i logística",
      body: "Una avaria externa paralitza les entregues i operacions en ple pic d'activitat de començament de mes.",
      opts: [
        { t: "Activar pla de contingència redundant pagant sobrecost d'urgència", s: "Caixa -0,9x MRR · Reputació blindada · Múltiple +0,3x", fn: function (st) { var c = scaleAmt(st, 0.9, 5500); st.cash -= c; st.multMod = (st.multMod || 0) + 0.3; st.rev = Math.round(st.rev * 1.12); return "Mentre els teus competidors estan caiguts tres dies, tu segueixes operant i captures clients seus!"; } },
        { t: "Comunicar amb transparència horària i compensar els afectats", s: "Caixa -0,4x MRR · Fidelitat conservada · Energia -8", fn: function (st) { st.cash -= scaleAmt(st, 0.4, 2400); st.energy -= 8; st.rev = Math.round(st.rev * 1.06); return "Donar la cara des del minut u evita baixes tot i l'ensurt operatiu."; } },
        { t: "Culpar públicament el proveïdor i esperar que ho resolguin ells", s: "Cost 0 € · Churn +0,5%/m · Múltiple -0,2x", fn: function (st) { st.churnMod = (st.churnMod || 0) + 0.005; st.multMod = (st.multMod || 0) - 0.2; return "Als clients no els importen les excuses tècniques: la confiança en la teva fiabilitat se'n ressent."; } }
      ]
    },
    {
      id: "d28_viral_press_wave", minStage: 2, maxStage: 4,
      tag: "EXPLOSIÓ DE DEMANDA",
      title: "Aparició destacada en premsa econòmica i allau de sol·licituds",
      body: "Les peticions es multipliquen per cinc en 48 hores. L'equip actual no dona l'abast.",
      opts: [
        { t: "Obrir accés per lots setmanals per mantenir una qualitat d'or", s: "MRR +22% · Múltiple +0,3x · Energia estable", fn: function (st) { st.rev = Math.round(st.rev * 1.22); st.multMod = (st.multMod || 0) + 0.3; return "La llista d'espera ordenada eleva el desig de marca i evita cremar l'equip."; } },
        { t: "Invertir fort en capacitat extra per absorbir tota l'onada avui", s: "Caixa -1,1x MRR · MRR +35% · Cost fix +12%", fn: function (st) { st.cash -= scaleAmt(st, 1.1, 7500); st.rev = Math.round(st.rev * 1.35); st.fixedCost = Math.round(st.fixedCost * 1.12); st.energy -= 7; return "Setmanes elèctriques, però consolides un nou graó de facturació permanent!"; } },
        { t: "Atendre-ho tot sense reforços a base d'hores extres", s: "MRR +16% · Energia -17 · Churn +0,3%/m", fn: function (st) { st.rev = Math.round(st.rev * 1.16); st.energy -= 17; st.churnMod = (st.churnMod || 0) + 0.003; return "Factures més, però l'esgotament provoca errors d'entrega i cansament acumulat."; } }
      ]
    },
    {
      id: "d29_document_sops", minStage: 2, maxStage: 3, noFlag: "builtSOPs",
      tag: "SISTEMES INTERNS",
      title: "Tot el coneixement crític viu només dins del teu cap",
      body: "Cada dubte de l'equip passa per la teva taula. No pots agafar ni quatre dies seguits de festa.",
      opts: [
        { t: "Dedicar tres setmanes a crear manuals operatius clars i vídeos curts", s: "Energia +15 permanent · Churn -0,3%/m · Múltiple +0,35x", fn: function (st) { st.flags.builtSOPs = true; st.energy += 15; st.churnMod = (st.churnMod || 0) - 0.003; st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.09); return "Punt d'inflexió vital: l'equip resol el 90% de situacions sense interrompre't i l'empresa val molt més."; } },
        { t: "Promocionar la persona més veterana com a coordinadora diària", s: "Cost fix +1.300 €/m · MRR +15% · Energia +12", fn: function (st) { st.flags.builtSOPs = true; st.fixedCost += 1300; st.rev = Math.round(st.rev * 1.15); st.energy += 12; return "Assumeix la coordinació amb orgull i t'allibera mitja jornada cada dia."; } },
        { t: "Seguir decidint-ho tot tu perquè és més ràpid al curt termini", s: "Cost 0 € · MRR +7% · Energia -13", fn: function (st) { st.rev = Math.round(st.rev * 1.07); st.energy -= 13; return "Ets l'empleat més ocupat de la teva pròpia empresa i el coll d'ampolla del seu sostre."; } }
      ]
    },
    {
      id: "d30_tech_ops_debt", minStage: 2, maxStage: 4,
      tag: "DEUTE ESTRUCTURAL",
      title: "Els pedaços dels inicis comencen a cruixir sota el nou volum",
      body: "Cada canvi petit costa el triple d'hores que abans perquè la base es va construir amb presses.",
      opts: [
        { t: "Renovar l'arquitectura per fases sense aturar les vendes", s: "Caixa -1,0x MRR · Múltiple +0,4x · Churn -0,4%/m", fn: function (st) { st.cash -= scaleAmt(st, 1.0, 6500); st.multMod = (st.multMod || 0) + 0.4; st.churnMod = (st.churnMod || 0) - 0.004; st.rev = Math.round(st.rev * 1.12); return "Sanejar els fonaments en marxa accelera totes les entregues dels trimestres següents."; } },
        { t: "Congelar tota novetat un trimestre per refer la base de dalt a baix", s: "MRR +2% avui · Cost fix -10% · Múltiple +0,5x", fn: function (st) { st.rev = Math.round(st.rev * 1.02); st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.90)); st.multMod = (st.multMod || 0) + 0.5; st.energy += 5; return "Trimestre pla en vendes, però ara tens una plataforma neta, barata de mantenir i preparadíssima."; } },
        { t: "Posar un altre pedaç ràpid i prioritzar només facturar avui", s: "MRR +17% · Risc de baixes +0,4%/m", fn: function (st) { st.rev = Math.round(st.rev * 1.17); st.churnMod = (st.churnMod || 0) + 0.004; st.energy -= 6; return "Guanyes velocitat comercial immediata empenyent la bola de neu tècnica cap endavant."; } }
      ]
    },
    {
      id: "d31_customer_conference", minStage: 2, maxStage: 4,
      tag: "COMUNITAT PRÒPIA",
      title: "Organitzar la teva primera jornada anual amb clients i potencials",
      body: "Reunir 150 decisors del sector en una matinal pot posicionar-te com el referent de la categoria.",
      opts: [
        { t: "Muntar un acte sòlid cobrant entrada i buscant dos patrocinadors", s: "Cost net 0 € · MRR +21% · Múltiple +0,3x", fn: function (st) { st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.3; st.energy -= 6; return "Les entrades i patrocinis cobreixen el 100% de la sala i el càtering, i tanques una dotzena de contractes!"; } },
        { t: "Fer-lo gratuït i per invitació selectiva assumint el cost", s: "Caixa -0,8x MRR · MRR +24% · Marca forta", fn: function (st) { st.cash -= scaleAmt(st, 0.8, 5000); st.rev = Math.round(st.rev * 1.24); st.multMod = (st.multMod || 0) + 0.25; return "La sala s'omple de perfils d'alt nivell i l'efecte prescripció dura mesos."; } },
        { t: "Substituir l'acte físic per tres seminaris pràctics en línia", s: "Caixa -600 € · MRR +12% · Energia intacta", fn: function (st) { st.cash -= 600; st.rev = Math.round(st.rev * 1.12); st.energy += 2; return "Format lleuger i rendible amb bona captació sense maldecaps logístics."; } }
      ]
    },
    {
      id: "d32_overdue_receivables", minStage: 2, maxStage: 4,
      tag: "MOROSITAT I COBRAMENTS",
      title: "Tres clients mitjans acumulen 90 dies de factures vençudes",
      body: "Sobre el paper tens beneficis, però els diners tarden a entrar al compte bancari.",
      opts: [
        { t: "Implantar domiciliació automàtica SEPA / targeta obligatòria", s: "Caixa +1,5x MRR recuperat · Churn puntual lleu", fn: function (st) { var r = scaleAmt(st, 1.5, 8000); st.cash += r; st.rev = Math.round(st.rev * 1.07); return "S'ha acabat perseguir rebuts: cobres el dia 1 de cada mes com un rellotge i recuperes " + fmt(r) + "."; } },
        { t: "Negociar un calendari amistós amb els morosos i tallar l'accés als reincidents", s: "Caixa +0,9x MRR · Cost fix -4%", fn: function (st) { st.cash += scaleAmt(st, 0.9, 4800); st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.96)); return "Cobres bona part del deute i deixes de regalar servei a qui no pensa pagar."; } },
        { t: "Contractar una línia de descompte de pagarés al banc", s: "Caixa +1,3x MRR · Cost financer +5%", fn: function (st) { st.cash += scaleAmt(st, 1.3, 7000); st.fixedCost = Math.round(st.fixedCost * 1.05); return "Avances la liquiditat cedint un pessic del marge al banc cada trimestre."; } }
      ]
    },
    {
      id: "d33_key_sales_rep", minStage: 2, maxStage: 3,
      tag: "EQUIP COMERCIAL",
      title: "Fitxar un comercial estrella amb cartera pròpia",
      body: "Demana un fix exigent més comissions generoses, però promet duplicar les entrades trimestrals.",
      opts: [
        { t: "Fix moderat i comissió forta lligada a clients que es quedin >6 mesos", s: "Cost fix +1.600 €/m · MRR +24% · Baixes controlades", fn: function (st) { st.fixedCost += 1600; st.rev = Math.round(st.rev * 1.24); st.churnMod = (st.churnMod || 0) - 0.002; return "El sistema d'incentius evita vendes amb fum i porta comptes sòlids i duradors."; } },
        { t: "Pagar-li el fix alt que demana per tancar-lo avui mateix", s: "Cost fix +3.100 €/m · 60% gran èxit / 40% decepció", fn: function (st, rng) { st.fixedCost += 3100; if (rng() < 0.6) { st.rev = Math.round(st.rev * 1.31); return "Compleix la paraula i obre comptes grans des del primer mes!"; } st.rev = Math.round(st.rev * 1.08); st.energy -= 8; return "Molta retòrica i pocs contractes signats per al sou que pesa a la nòmina."; } },
        { t: "Seguir liderant les vendes tu amb un suport júnior de prequalificació", s: "Cost fix +850 €/m · MRR +15% · Energia -5", fn: function (st) { st.fixedCost += 850; st.rev = Math.round(st.rev * 1.15); st.energy -= 5; return "Només entres a les reunions ja filtrades i mantens una ràtio de tancament altíssima."; } }
      ]
    },
    {
      id: "d34_copycat_vc_rival", minStage: 2, maxStage: 4,
      tag: "GUERRA COMPETITIVA",
      title: "Un clon ben finançat llança preus sota cost al teu mercat",
      body: "Han aixecat una ronda milionària i regalen sis mesos gratuïts per arrencar-te els clients actuals.",
      opts: [
        { t: "Blindar la integració profunda, el servei humà i el canvi a contractes anuals", s: "Churn -0,5%/m · MRR +15% · Múltiple +0,35x", fn: function (st) { st.churnMod = (st.churnMod || 0) - 0.005; st.rev = Math.round(st.rev * 1.15); st.multMod = (st.multMod || 0) + 0.35; return "Els teus clients valoren la solvència i el tracte proper; el clon es dessagna cremant caixa amb caçadors de gangues."; } },
        { t: "Pujar cap al segment superior on el clon encara és massa verd", s: "MRR +21% · Múltiple +0,3x", fn: function (st) { st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.3; return "Deixes que es barallin pels tiquets petits mentre tu domines els comptes més rendibles."; } },
        { t: "Igualar la seva guerra de descomptes i gastar caixa en anuncis", s: "Caixa -1,5x MRR · MRR +12% · Marges tensos", fn: function (st) { st.cash -= scaleAmt(st, 1.5, 9000); st.rev = Math.round(st.rev * 1.12); st.energy -= 9; return "Jugues al seu propi joc de cremar bitllets i la tresoreria pateix l'envit."; } }
      ]
    },
    {
      id: "d35_addon_upsell", minStage: 2, maxStage: 4,
      tag: "EXPANSIÓ DE COMPTE",
      title: "Crear un mòdul complementari per als clients que ja tens",
      body: "Vendre més a qui ja et confia sol ser cinc vegades més rendible que captar un desconegut des de zero.",
      opts: [
        { t: "Co-dissenyar el complement amb 10 clients pagant-lo en prevenda", s: "Caixa +0,9x MRR · MRR +22% · Retenció forta", fn: function (st) { st.cash += scaleAmt(st, 0.9, 5000); st.rev = Math.round(st.rev * 1.22); st.churnMod = (st.churnMod || 0) - 0.003; return "Finances el desenvolupament amb prevendes i l'expansió neta d'ingressos es dispara!"; } },
        { t: "Incloure'l de franc al pla superior per incentivar pujades de tarifa", s: "MRR +17% · Múltiple +0,25x", fn: function (st) { st.rev = Math.round(st.rev * 1.17); st.multMod = (st.multMod || 0) + 0.25; return "Una quarta part dels clients puja de tram sense cap fricció comercial."; } },
        { t: "Descartar-ho ara per mantenir una sola línia ultra-simple", s: "Cost fix -5% · Energia +6 · MRR +8%", fn: function (st) { st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.95)); st.energy += 6; st.rev = Math.round(st.rev * 1.08); return "Protegeixes la simplicitat operativa i evites dispersar el manteniment."; } }
      ]
    },
    {
      id: "d36_bad_hire_mismatch", minStage: 2, maxStage: 4,
      tag: "GESTIÓ DE PERSONES",
      title: "Un fitxatge recent és brillant tècnicament però deteriora l'ambient",
      body: "Compleix els seus objectius individuals, però menysté els companys i genera tensió diària.",
      opts: [
        { t: "Tallar d'arrel avui mateix indemnitzant i protegint la cultura sana", s: "Caixa -0,7x MRR · Energia +12 · MRR +14% d'equip unit", fn: function (st) { st.cash -= scaleAmt(st, 0.7, 4500); st.energy += 12; st.rev = Math.round(st.rev * 1.14); return "L'equip respira alleujat l'endemà mateix i el rendiment col·lectiu puja de seguida."; } },
        { t: "Donar-li un ultimàtum clar de 30 dies amb objectius de col·laboració", s: "50% es reconstrueix / 50% marxa un altre membre", fn: function (st, rng) { if (rng() < 0.5) { st.rev = Math.round(st.rev * 1.16); st.energy += 4; return "Reacciona amb maduresa al toc d'atenció i corregeix el tracte amb l'equip."; } st.energy -= 11; st.fixedCost += 600; return "L'ambient segueix enrarit i un bon perfil discret presenta la baixa voluntària."; } },
        { t: "Aïllar-lo en tasques solitàries per no perdre la seva producció", s: "MRR +11% · Energia -9", fn: function (st) { st.rev = Math.round(st.rev * 1.11); st.energy -= 9; return "Salves les entregues a curt termini creant un precedent incòmode de privilegis."; } }
      ]
    },
    {
      id: "d37_venture_debt", minStage: 2, maxStage: 4,
      tag: "FINANÇAMENT NO DILUTIU",
      title: "Un banc especialitzat t'ofereix una línia de finançament sense cedir accions",
      body: "Et presten l'equivalent a cinc mesos de facturació a un interès raonable i zero dilució d'equity.",
      opts: [
        { t: "Acceptar només un tram prudent (2,5x MRR) per finançar campanyes amb ROI clar", s: "Caixa +2,5x MRR · Cost fix +6% · MRR +21% · 0% dilució", fn: function (st) { var d = scaleAmt(st, 2.5, 15000); st.cash += d; st.fixedCost = Math.round(st.fixedCost * 1.06); st.rev = Math.round(st.rev * 1.21); return "Aprofites el palanquejament prudent (+" + fmt(d) + ") per créixer ràpid sense regalar ni una acció."; } },
        { t: "Disposar del màxim (5x MRR) per doblar l'aposta comercial", s: "Caixa +5,0x MRR · Cost financer +15% · MRR +30%", fn: function (st) { var d = scaleAmt(st, 5.0, 30000); st.cash += d; st.fixedCost = Math.round(st.fixedCost * 1.15); st.rev = Math.round(st.rev * 1.30); st.energy -= 7; return "Tresoreria plena a vessar (" + fmt(d) + ") i fort acceleró, assumint quotes mensuals exigents."; } },
        { t: "Declinar qualsevol deute: cap quota bancària sobre l'esquena", s: "Deute 0 € · Energia +7 · MRR +10%", fn: function (st) { st.energy += 7; st.rev = Math.round(st.rev * 1.10); return "Dorms amb la tranquil·litat absoluta de no deure res a cap entitat financera."; } }
      ]
    },
    {
      id: "d38_support_automation", minStage: 2, maxStage: 4,
      tag: "ATENCIÓ AL CLIENT",
      title: "El volum de tiquets de suport creix al mateix ritme que les vendes",
      body: "El 65% de les consultes són sempre les mateixes deu preguntes repetides.",
      opts: [
        { t: "Construir base de coneixement guiada + assistent per a dubtes simples i humà per als complexos", s: "Caixa -0,5x MRR · Cost fix -9% · Churn -0,3%/m", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 3200); st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.91)); st.churnMod = (st.churnMod || 0) - 0.003; st.energy += 7; return "Respostes instantànies per al que és senzill i empatia humana sense cues per al que és important."; } },
        { t: "Posar un robot automàtic com a barrera i amagar el telèfon", s: "Cost fix -16% · Churn +0,6%/m", fn: function (st) { st.fixedCost = Math.max(600, Math.round(st.fixedCost * 0.84)); st.churnMod = (st.churnMod || 0) + 0.006; return "Estalvies sous de cop, però els clients frustrats pels menús infinits comencen a marxar."; } },
        { t: "Ampliar l'equip d'atenció personalitzada en directe en menys de 5 minuts", s: "Cost fix +10% · Churn -0,6%/m · Múltiple +0,3x", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.10); st.churnMod = (st.churnMod || 0) - 0.006; st.multMod = (st.multMod || 0) + 0.3; st.rev = Math.round(st.rev * 1.13); return "L'atenció humana exquisida es converteix en el teu gran avantatge competitiu."; } }
      ]
    },
    {
      id: "d39_first_iberian_expansion", minStage: 2, maxStage: 4,
      tag: "MERCAT VEÍ",
      title: "Primers clients de Portugal i el sud de França truquen a la porta",
      body: "Pots atendre'ls de manera oportunista o preparar una entrada ordenada amb suport local.",
      opts: [
        { t: "Localitzar el producte i fitxar un representant nadiu a comissió", s: "Caixa -0,7x MRR · MRR +23% · Diversificació", fn: function (st) { st.cash -= scaleAmt(st, 0.7, 4500); st.rev = Math.round(st.rev * 1.23); st.multMod = (st.multMod || 0) + 0.25; return "La presència en l'idioma local obre un mercat nou molt receptiu i de bon marge."; } },
        { t: "Vendre-hi en anglès des de la seu actual sense estructura nova", s: "Cost 0 € · MRR +12%", fn: function (st) { st.rev = Math.round(st.rev * 1.12); return "Validació internacional a cost zero amb clients que ja estaven convençuts."; } },
        { t: "Obrir delegació física pròpia a Lisboa i Tolosa alhora", s: "Caixa -2,0x MRR · Cost fix +16% · MRR +27%", fn: function (st) { st.cash -= scaleAmt(st, 2.0, 14000); st.fixedCost = Math.round(st.fixedCost * 1.16); st.rev = Math.round(st.rev * 1.27); st.energy -= 9; return "Creixes amb força als dos mercats, assumint despeses fixes i viatges constants."; } }
      ]
    },
    {
      id: "d40_founder_sabbatical_week", minStage: 2, maxStage: 5,
      tag: "SALUT DEL FUNDADOR",
      title: "Senyals d'esgotament mental després de trimestres sense pausa",
      body: "Dormir poc comença a ennuvolar el teu criteri estratègic i la paciència a les reunions.",
      opts: [
        { t: "Desconnectar 12 dies reals sense mòbil deixant l'equip al comandament", s: "Energia +24! · Prova de foc d'autonomia · MRR +9%", fn: function (st) { st.energy += 24; st.rev = Math.round(st.rev * 1.09); st.multMod = (st.multMod || 0) + 0.15; return "Tornes amb el cap clar i descobreixes amb orgull que l'equip ha crescut davant la responsabilitat!"; } },
        { t: "Instaurar setmana sense reunions els divendres i esport fix al matí", s: "Energia +15 · MRR +12%", fn: function (st) { st.energy += 15; st.rev = Math.round(st.rev * 1.12); return "El nou ritme setmanal et retorna la lucidesa i millora l'execució de tota la plantilla."; } },
        { t: "Prendre un altre cafè i empènyer fins a tancar l'any", s: "MRR +14% avui · Energia -16", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.energy -= 16; return "Rasques xifres a curt termini acostant-te perillosament a la línia vermella del desgast."; } }
      ]
    },
    {
      id: "d41_seo_content_moat", minStage: 2, maxStage: 4,
      tag: "ACTIU CAPTACIÓ",
      title: "Construir un motor orgànic d'eines gratuïtes i guies de referència",
      body: "Els anuncis pagats pugen de preu cada any; un canal propi triga mesos però després porta clients sol.",
      opts: [
        { t: "Publicar calculadores i plantilles útils obertes del teu sector", s: "Caixa -0,6x MRR · MRR +21% · Múltiple +0,35x", fn: function (st) { st.cash -= scaleAmt(st, 0.6, 3800); st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.35; return "Milers de professionals fan servir les teves eines gratuïtes cada mes i entren sols a comprar!"; } },
        { t: "Comprar un bloc o directori antic del sector que ja té trànsit", s: "Caixa -1,3x MRR · MRR +25%", fn: function (st) { st.cash -= scaleAmt(st, 1.3, 8500); st.rev = Math.round(st.rev * 1.25); return "Adquireixes una audiència qualificada d'un dia per l'altre i redirigeixes la demanda cap a casa."; } },
        { t: "Concentrar-ho tot en venda directa sortint sense crear contingut", s: "MRR +14% · Sense inversió prèvia", fn: function (st) { st.rev = Math.round(st.rev * 1.14); return "Resultats immediats i previsibles cada setmana sense esperar els cercadors."; } }
      ]
    },
    {
      id: "d42_raw_costs_inflation", minStage: 2, maxStage: 5,
      tag: "INFLACIÓ DE COSTOS",
      title: "Pujada general del 18% en llicències, energia i subministraments",
      body: "Els teus proveïdors actualitzen tarifes de cop i el marge operatiu s'estreny quatre punts.",
      opts: [
        { t: "Aplicar clàusula d'actualització d'IPC (+9%) i renegociar llicències duplicades", s: "MRR +9% · Cost fix contingut · Marge salvat", fn: function (st) { st.rev = Math.round(st.rev * 1.09); st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.97)); return "Trasllades amb naturalitat la inflació i neteges subscripcions mortes que ningú feia servir."; } },
        { t: "Absorbir tot l'encariment per guanyar quota als rivals que sí que apugen preus", s: "Cost fix +11% · MRR +19% · Churn -0,3%/m", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.11); st.rev = Math.round(st.rev * 1.19); st.churnMod = (st.churnMod || 0) - 0.003; return "Sacrifiques marge unitari temporalment però captures un munt de clients descontents amb la competència."; } },
        { t: "Canviar a proveïdors de baix cost assumint pitjor qualitat", s: "Cost fix -8% · Churn +0,5%/m", fn: function (st) { st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.92)); st.churnMod = (st.churnMod || 0) + 0.005; return "Salves la factura del mes però alguns clients noten la baixada de prestacions."; } }
      ]
    },
    {
      id: "d43_strategic_partnership_api", minStage: 2, maxStage: 4,
      tag: "ECOSISTEMA",
      title: "Integració nativa amb la plataforma líder que fan servir els teus clients",
      body: "Entrar al seu mercat d'aplicacions oficial demana homologació tècnica rigorosa.",
      opts: [
        { t: "Prioritzar l'homologació oficial i aparèixer com a soci destacat", s: "Caixa -0,7x MRR · MRR +24% · Churn -0,4%/m · Múltiple +0,4x", fn: function (st) { st.cash -= scaleAmt(st, 0.7, 4500); st.rev = Math.round(st.rev * 1.24); st.churnMod = (st.churnMod || 0) - 0.004; st.multMod = (st.multMod || 0) + 0.4; return "Estar connectat al cor del seu dia a dia fa que canviar-te per un altre sigui gairebé impensable!"; } },
        { t: "Fer un connector senzill no oficial per sortir del pas ràpid", s: "Cost mínim · MRR +11%", fn: function (st) { st.rev = Math.round(st.rev * 1.11); return "Resol la necessitat bàsica sense consumir gaire pressupost."; } },
        { t: "Mantenir el teu sistema tancat i independent", s: "Energia +4 · MRR +6%", fn: function (st) { st.energy += 4; st.rev = Math.round(st.rev * 1.06); return "Evites dependre de canvis de tercers mantenint un ritme propi tranquil."; } }
      ]
    },
    {
      id: "d44_quarterly_profit_sharing", minStage: 2, maxStage: 5,
      tag: "ALINEACIÓ D'EQUIP",
      title: "L'equip demana participar de la bona marxa de l'empresa",
      body: "Vols retenir la gent clau sense diluir necessàriament la propietat societària.",
      opts: [
        { t: "Instaurar una paga trimestral del 10% del benefici net repartida de forma transparent", s: "Zero dilució · Churn -0,3%/m · MRR +18% · Energia +6", fn: function (st) { st.churnMod = (st.churnMod || 0) - 0.003; st.rev = Math.round(st.rev * 1.18); st.energy += 6; return "Tothom mira els costos i la satisfacció del client com si l'empresa fos seva, sense tocar l'equity!"; } },
        { t: "Crear una borsa del 6% en drets econòmics (Phantom Shares) lligada a un Exit", s: "Equity efectiu -6% · Múltiple +0,35x · Retenció total de talent", fn: function (st) { st.equity = Math.max(10, Math.round(st.equity * 0.94)); st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.16); return "Blindes els perfils clau a 4 anys vista alineant-los amb el valor a llarg termini."; } },
        { t: "Apujar sous fixos un +10% lineal independentment del resultat", s: "Cost fix +10% · Energia +4 · MRR +9%", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.10); st.energy += 4; st.rev = Math.round(st.rev * 1.09); return "Agraeixen la pujada immediata, tot i que eleva el punt mort fix mensual."; } }
      ]
    },
    {
      id: "d45_key_client_concentration", minStage: 2, maxStage: 4,
      tag: "RISC DE CONCENTRACIÓ",
      title: "Els teus dos clients més grans ja pesen el 32% de la facturació",
      body: "Un d'ells insinua que revisarà proveïdors al tancament anual si no li congeles condicions.",
      opts: [
        { t: "Signar renovació bianual amb millora de servei i llançar campanya per diluir el seu pes", s: "MRR +19% · Múltiple +0,3x · Risc reduït", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 3500); st.rev = Math.round(st.rev * 1.19); st.multMod = (st.multMod || 0) + 0.3; return "Assegures el gran compte dos anys més i redueixes el seu pes relatiu sumant desenes de pimes."; } },
        { t: "Cedir un 15% de rebaixa perquè no marxi sota cap concepte", s: "MRR -4% net · Energia -5", fn: function (st) { st.rev = Math.round(st.rev * 0.96); st.energy -= 5; return "Retens el contracte, però oloraran que poden collar-te a cada renovació."; } },
        { t: "Negar qualsevol cessió assumint el risc que no renovi", s: "55% renova a preu ple / 45% marxa", fn: function (st, rng) { if (rng() < 0.55) { st.rev = Math.round(st.rev * 1.14); st.multMod = (st.multMod || 0) + 0.2; return "Era un farol de compres! Renoven a tarifa completa respectant el teu valor."; } st.rev = Math.max(800, Math.round(st.rev * 0.84)); return "No renoven; encaixes la sotragada però et lliures d'una dependència perillosa."; } }
      ]
    },
    {
      id: "d46_product_simplification", minStage: 2, maxStage: 4,
      tag: "PODA ESTRATÈGICA",
      title: "El 80% del valor prové del 20% del teu catàleg",
      body: "Mantens opcions secundàries que gairebé ningú compra però que compliquen la formació i la logística.",
      opts: [
        { t: "Retirar les línies menors i redoblar recursos en el producte estrella", s: "Cost fix -11% · MRR +16% · Múltiple +0,25x", fn: function (st) { st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.89)); st.rev = Math.round(st.rev * 1.16); st.multMod = (st.multMod || 0) + 0.25; st.energy += 6; return "Menys és més: el missatge comercial guanya una força cristal·lina i els marges s'eixamplen!"; } },
        { t: "Empaquetar els extres en un sol paquet «Tot Inclòs» més car", s: "MRR +19% · Cost estable", fn: function (st) { st.rev = Math.round(st.rev * 1.19); return "Simplifiques la decisió de compra del client elevant la factura mitjana."; } },
        { t: "Mantenir tot el catàleg intacte per no contrariar cap client antic", s: "MRR +6% · Cost fix +4%", fn: function (st) { st.rev = Math.round(st.rev * 1.06); st.fixedCost = Math.round(st.fixedCost * 1.04); return "Cap client antic es queixa, però la complexitat interna continua creixent."; } }
      ]
    },
    {
      id: "d47_b2b_outbound_playbook", minStage: 2, maxStage: 4,
      tag: "MÀQUINA DE VENDES",
      title: "Sistematitzar la captació perquè no depengui de la inspiració",
      body: "Alguns mesos entren molts comptes i d'altres s'alenteixen sense saber ben bé per què.",
      opts: [
        { t: "Documentar el guió comercial, mètriques setmanals i CRM estricte", s: "Caixa -0,4x MRR · MRR +21% · Previsibilitat alta", fn: function (st) { st.cash -= scaleAmt(st, 0.4, 2800); st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.3; return "Converteixes les vendes en un procés mesurable i repetible que qualsevol bon comercial pot executar."; } },
        { t: "Subcontractar una agència externa de concertació de reunions", s: "Cost fix +1.500 €/m · MRR +15%", fn: function (st) { st.fixedCost += 1500; st.rev = Math.round(st.rev * 1.15); return "T'omplen el calendari de reunions de qualitat desigual, però en tanques un bon grapat."; } },
        { t: "Confiar únicament en el boca-orella natural", s: "Cost 0 € · MRR +8% · Energia +4", fn: function (st) { st.rev = Math.round(st.rev * 1.08); st.energy += 4; return "Creixement sa i sense estrès comercial, tot i ser menys ràpid."; } }
      ]
    },
    {
      id: "d48_office_vs_remote_culture", minStage: 2, maxStage: 4,
      tag: "CULTURA DE TREBALL",
      title: "Debat intens a la plantilla: 100% remot, híbrid o oficina diària",
      body: "A mesura que sumeu mans, costa més mantenir la cohesió informal i alhora atraure talent fora de la capital.",
      opts: [
        { t: "Remot primer amb Processos Escrits + trobada trimestral de 3 dies tota pagada", s: "Cost fix -8% · Talent d'arreu · Energia +9 · MRR +17%", fn: function (st) { st.fixedCost = Math.max(700, Math.round(st.fixedCost * 0.92)); st.energy += 9; st.rev = Math.round(st.rev * 1.17); return "Fitxes perfils boníssims fora de les capitals cares i les trobades trimestrals creen pinya real!"; } },
        { t: "Model híbrid amb oficina cèntrica 3 dies per setmana", s: "Cost fix +7% · MRR +19% · Bona velocitat d'equip", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.07); st.rev = Math.round(st.rev * 1.19); return "La pissarra presencial desencalla projectes ràpidament combinada amb dos dies de concentració a casa."; } },
        { t: "Exigir presencialitat de dilluns a divendres sense excepcions", s: "Cost fix +12% · Alguns perfils clau marxen · Energia -8", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.12); st.rev = Math.round(st.rev * 1.07); st.energy -= 8; return "Perds dos especialistes excel·lents que vivien lluny i t'obligues a competir pels sous més cars de la ciutat."; } }
      ]
    },
    // ==================== FASE 3 · ESCALAT (Dilemes 49–72) ====================
    {
      id: "d49_key_employee_poaching", minStage: 3, maxStage: 5,
      tag: "FUGA DE TALENT CLAU",
      title: "Una multinacional ofereix un +45% de sou a la teva mà dreta",
      body: "Coneix els comptes crítics i lidera l'execució diària. T'ho comunica amb lleialtat abans de signar res.",
      opts: [
        { t: "Millorar-li fix (+18%), donar-li títol de Direcció i paquet d'incentius a 3 anys", s: "Cost fix +2.400 €/m · Retens el líder · Múltiple +0,35x", fn: function (st) { st.fixedCost += 2400; st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.16); st.energy += 7; return "Valora l'impacte real i l'autonomia a casa teva per damunt de ser una peça més d'una multinacional!"; } },
        { t: "Desitjar-li sort, pactar un traspàs modèlic de 6 setmanes i promocionar talent intern", s: "Cost contingent · Energia -6 ara · Equip més resilient", fn: function (st) { st.energy -= 6; st.rev = Math.round(st.rev * 1.09); return "El relleu intern fa un pas endavant sorprenent i demostres que ningú és imprescindible."; } },
        { t: "Igualar el +45% de sou en secret creant agravis amb la resta", s: "Cost fix +4.500 €/m · Tensió salarial interna", fn: function (st) { st.fixedCost += 4500; st.rev = Math.round(st.rev * 1.11); st.energy -= 8; return "Es queda, però al cap de dos mesos el rumor s'escampa i tres persones més demanen revisió."; } }
      ]
    },
    {
      id: "d50_series_a_termsheet", minStage: 3, maxStage: 4, noFlag: "raisedSeriesA",
      tag: "RONDA SÈRIE A",
      title: "Dos fons internacionals competeixen per liderar la teva Sèrie A",
      body: "Un fons agressiu ofereix valorar-te molt alt però exigeix Preferència de Liquidació 2x; un altre ofereix menys xifra però neta (1x).",
      opts: [
        { t: "Rebutjar la Sèrie A: escalar amb el marge propi sense consell d'inversors", s: "0% dilució · Control absolut · MRR +15%", fn: function (st) { st.rev = Math.round(st.rev * 1.15); st.energy += 6; st.multMod = (st.multMod || 0) + 0.25; return "Ets una rara avis admirada al mercat: creixes amb beneficis sense donar explicacions a cap fons!"; } },
        { t: "Signar el Term Sheet net d'1,2M € pel 16% d'equity (LiqPref 1x)", s: "Caixa +1,2M € · Equity -16% · MRR +36% · Soci sa", fn: function (st) { st.flags.raisedSeriesA = true; st.cash += 1200000; st.equity = Math.max(8, Math.round(st.equity * 0.84)); st.liqPref = (st.liqPref || 0) + 1200000; st.fixedCost += 14000; st.rev = Math.round(st.rev * 1.36); return "1,2 milions nets a tresoreria amb clàusules justes per assaltar el lideratge del mercat!"; } },
        { t: "Agafar el xec gegant de 2,2M € pel 20% acceptant LiqPref 2x (4,4M € preferents)", s: "Caixa +2,2M € · Equity -20% · LiqPref +4,4M €! · MRR +45%", fn: function (st) { st.flags.raisedSeriesA = true; st.cash += 2200000; st.equity = Math.max(8, Math.round(st.equity * 0.80)); st.liqPref = (st.liqPref || 0) + 4400000; st.fixedCost += 24000; st.rev = Math.round(st.rev * 1.45); st.energy -= 8; return "Potència de foc descomunal, però recorda: en un Exit, els inversors cobraran els primers 4,4M € abans que tu vegis un euro!"; } }
      ]
    },
    {
      id: "d51_gdpr_tax_audit", minStage: 3, maxStage: 5,
      tag: "INSPECCIÓ I COMPLIMENT",
      title: "Requeriment simultani d'auditoria fiscal i protecció de dades (RGPD)",
      body: "Quan superes certa mida, deixes de ser invisible per als reguladors. Tens 20 dies hàbils per aportar tots els registres.",
      opts: [
        { t: "Contractar despatx especialitzat, certificar ISO/RGPD i deixar-ho impol·lut", s: "Caixa -0,7x MRR · Múltiple +0,45x · Zero sanció", fn: function (st) { st.cash -= scaleAmt(st, 0.7, 16000); st.multMod = (st.multMod || 0) + 0.45; st.energy += 3; return "Superes l'auditoria amb nota i la nova certificació t'obre les portes de grans clients regulats!"; } },
        { t: "Preparar tota la documentació amb l'equip intern i l'assessor habitual", s: "Caixa -0,2x MRR · Energia -11 · Tancament correcte", fn: function (st) { st.cash -= scaleAmt(st, 0.2, 4500); st.energy -= 11; return "Setmanes intenses recopilant contractes i factures, però tanques l'expedient amb una acta mínima."; } },
        { t: "Presentar al·legacions dilatòries i sortir del pas amb el mínim", s: "50% multa severa / 50% arxiu temporal", fn: function (st, rng) { if (rng() < 0.55) { var m = scaleAmt(st, 1.4, 32000); st.cash -= m; st.energy -= 12; return "L'inspector no s'ho empassa: acta amb sanció i recàrrec de " + fmt(m) + "."; } return "Guanyes uns mesos de marge administratiu sense cost immediat."; } }
      ]
    },
    {
      id: "d52_secondary_liquidity", minStage: 3, maxStage: 5, noFlag: "didSecondary1",
      tag: "LIQUIDITAT SECUNDÀRIA",
      title: "Un fons d'inversió t'ofereix comprar-te un 12% de les teves accions personals",
      body: "Els diners no van a l'empresa, sinó nets i directes a la caixa del teu Holding Personal perquè diversifiquis.",
      opts: [
        { t: "Vendre un 10% secundari al comptat i assegurar el teu patrimoni familiar", s: "Equity -10% relatiu · Xec directe al teu Holding · Energia +18!", fn: function (st) {
          st.flags.didSecondary1 = true;
          var soldPct = Math.max(2, Math.round(st.equity * 0.12));
          var val = estVal(st);
          var payout = Math.round(val * (soldPct / 100) * 0.90);
          st.equity = Math.max(5, st.equity - soldPct);
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + payout;
          st.energy += 18;
          return "Ingresses " + fmt(payout) + " nets al teu Holding Personal! Ara dirigeixes amb l'esquena coberta i cap fred.";
        } },
        { t: "Rebutjar vendre ni una sola acció: confies a multiplicar el valor per tres", s: "Conserves tot l'Equity · Múltiple +0,3x · Moral alta", fn: function (st) { st.flags.didSecondary1 = true; st.multMod = (st.multMod || 0) + 0.3; st.rev = Math.round(st.rev * 1.14); return "Envies un missatge de convicció total a l'equip i al mercat: vas a totes!"; } },
        { t: "Vendre només un 5% simbòlic per cobrir una inversió puntual del Holding", s: "Dilució mínima · Liquiditat personal al Holding · Energia +9", fn: function (st) {
          st.flags.didSecondary1 = true;
          var soldPct = Math.max(1, Math.round(st.equity * 0.05));
          var payout = Math.round(estVal(st) * (soldPct / 100) * 0.92);
          st.equity = Math.max(5, st.equity - soldPct);
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + payout;
          st.energy += 9;
          return "Traspasses " + fmt(payout) + " cap al teu Holding gairebé sense reduir la teva participació.";
        } }
      ]
    },
    {
      id: "d53_acquire_small_competitor", minStage: 3, maxStage: 5,
      tag: "COMPRA D'UN RIVAL (M&A)",
      title: "Un competidor més petit amb bona cartera s'està quedant sense caixa",
      body: "Els seus fundadors estan esgotats i acceptarien vendre't la cartera de clients i l'equip tècnic amb descompte.",
      opts: [
        { t: "Comprar només la seva cartera de clients i marca pagant amb la teva caixa", s: "Caixa -2,2x MRR · MRR +28% d'un cop · Múltiple +0,3x", fn: function (st) { var price = scaleAmt(st, 2.2, 48000); st.cash -= price; st.rev = Math.round(st.rev * 1.28); st.multMod = (st.multMod || 0) + 0.3; return "Operació quirúrgica per " + fmt(price) + ": migres els seus clients en 30 dies sense carregar amb el seu passiu!"; } },
        { t: "Absorbir l'empresa sencera pagant meitat en caixa i meitat en accions (4%)", s: "Caixa -1,1x MRR · Equity -4% · MRR +33% · Cost fix +12%", fn: function (st) { st.cash -= scaleAmt(st, 1.1, 25000); st.equity = Math.max(5, Math.round(st.equity * 0.96)); st.rev = Math.round(st.rev * 1.33); st.fixedCost = Math.round(st.fixedCost * 1.12); st.energy -= 6; return "Sumes quota de mercat i bons especialistes tot integrant dues cultures."; } },
        { t: "No comprar-los i esperar a captar els seus clients quan tanquin", s: "Cost 0 € · MRR +12% orgànic", fn: function (st) { st.rev = Math.round(st.rev * 1.12); return "Captes de franc una part dels seus clients orfes sense assumir cap risc d'integració."; } }
      ]
    },
    {
      id: "d54_middle_management_layer", minStage: 3, maxStage: 5, noFlag: "builtExecTeam",
      tag: "ESTRUCTURA DIRECTIVA",
      title: "Amb més de 25 persones ja no pots supervisar tothom directament",
      body: "Les reunions es multipliquen i les decisions tarden massa a baixar als equips.",
      opts: [
        { t: "Crear un Comitè de Direcció de 4 responsables amb objectius trimestrals clars (OKR)", s: "Cost fix +5.500 €/m · Energia +16! · MRR +21% · Múltiple +0,45x", fn: function (st) { st.flags.builtExecTeam = true; st.fixedCost += 5500; st.energy += 16; st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.45; return "Deixes d'apagar focs operatius i passes a dirigir l'estratègia i l'assignació de capital!"; } },
        { t: "Mantenir organització plana amb equips autònoms petits sense caps intermedis", s: "Cost contingut · MRR +15% · Energia -4", fn: function (st) { st.flags.builtExecTeam = true; st.rev = Math.round(st.rev * 1.15); st.energy -= 4; return "Conserves l'agilitat d'empresa jove sense burocràcia, tot i haver d'arbitrar empats."; } },
        { t: "Fitxar executius cars de multinacional per a cada àrea", s: "Cost fix +14.000 €/m · Excés de reunions i PowerPoints", fn: function (st) { st.flags.builtExecTeam = true; st.fixedCost += 14000; st.rev = Math.round(st.rev * 1.10); st.energy -= 7; return "Porten molta litúrgia corporativa però alenteixen la velocitat d'execució que us feia únics."; } }
      ]
    },
    {
      id: "d55_cybersecurity_scare", minStage: 3, maxStage: 5,
      tag: "SEGURETAT I RISCOS",
      title: "Intent d'intrusió bloquejat als vostres sistemes centrals de matinada",
      body: "No s'ha filtrat res pels pèls, però l'avís deixa clar que ara sou un objectiu llaminer.",
      opts: [
        { t: "Auditoria de penetració externa, claus físiques per a l'equip i assegurança ciber", s: "Caixa -0,6x MRR · Cost fix +900 €/m · Múltiple +0,4x", fn: function (st) { st.cash -= scaleAmt(st, 0.6, 14000); st.fixedCost += 900; st.multMod = (st.multMod || 0) + 0.4; st.energy += 5; return "Blindes l'empresa amb estàndards bancaris i superes sense despentinar-te els qüestionaris dels grans clients."; } },
        { t: "Aplicar actualitzacions urgents internes i doble factor obligatori", s: "Caixa -3.000 € · Risc reduït · Energia -5", fn: function (st) { st.cash -= 3000; st.energy -= 5; st.rev = Math.round(st.rev * 1.08); return "Tanques la porta principal amb una despesa molt continguda."; } },
        { t: "Donar l'incident per tancat sense desviar recursos comercials", s: "MRR +12% avui · 40% risc de bretxa costosa", fn: function (st, rng) { st.rev = Math.round(st.rev * 1.12); if (rng() < 0.40) { var loss = scaleAmt(st, 1.8, 38000); st.cash -= loss; st.churnMod = (st.churnMod || 0) + 0.006; st.energy -= 14; return "Al cap d'un mes teniu un bloqueig real que costa " + fmt(loss) + " i danya la confiança."; } return "Aquest cop la sort t'acompanya, tot i jugar amb foc."; } }
      ]
    },
    {
      id: "d56_strategic_ma_offer_stage3", minStage: 3, maxStage: 4, minQ: 8, noFlag: "declinedStage3Exit",
      tag: "★ OFERTA FERMA DE COMPRA (M&A)",
      title: "Un grup europeu posa sobre la taula una oferta al comptat per tota l'empresa",
      body: "Volen entrar al teu mercat per la porta gran i t'ofereixen una prima del +20% sobre la valoració actual.",
      opts: [
        { t: "ACCEPTAR I VENDRE L'EMPRESA AVUI: signar davant notari i cobrar al Holding!", s: "Exit amb prima +20% · El teu xec passa íntegre al Holding Personal", fn: function (st) {
          st.triggerExit = { multFactor: 1.20, label: "Venda Estratègica a Grup Europeu" };
          return "Signes la venda amb prima del +20% i transfereixes tota la teva participació neta al teu Holding!";
        } },
        { t: "Rebutjar l'oferta: això tot just s'escalfa i apuntem a ser líders de categoria", s: "Múltiple +0,55x · MRR +17% · Moral pels núvols", fn: function (st) { st.flags.declinedStage3Exit = true; st.multMod = (st.multMod || 0) + 0.55; st.rev = Math.round(st.rev * 1.17); st.energy += 8; return "Dius «no està en venda» amb elegància; el mercat pren nota de la teva ambició i solidesa!"; } },
        { t: "Rebutjar la venda total però tancar amb ells un acord comercial preferent", s: "MRR +24% · Conservació del 100% d'independència", fn: function (st) { st.flags.declinedStage3Exit = true; st.rev = Math.round(st.rev * 1.24); return "No et compren l'empresa, però es converteixen en el teu client i distribuïdor més potent!"; } }
      ]
    },
    {
      id: "d57_second_product_line", minStage: 3, maxStage: 5,
      tag: "MULTI-PRODUCTE",
      title: "Llançar una segona línia de negoci aprofitant la mateixa clientela",
      body: "Ja tens la confiança i les dades de centenars d'empreses; pots multiplicar la despesa mitjana per client.",
      opts: [
        { t: "Crear un equip petit autònom («comandament intern») amb pressupost acotat", s: "Caixa -1,1x MRR · MRR +27% · Múltiple +0,4x", fn: function (st) { st.cash -= scaleAmt(st, 1.1, 24000); st.rev = Math.round(st.rev * 1.27); st.multMod = (st.multMod || 0) + 0.4; return "La nova línia tracciona a tota velocitat venent-se sola sobre la base de clients existents!"; } },
        { t: "Associar-te al 50% dels ingressos amb un especialista que ja tingui el producte fet", s: "Cost d'inversió 0 € · MRR +17% · Risc zero", fn: function (st) { st.rev = Math.round(st.rev * 1.17); st.energy += 3; return "Valides la demanda creuada sense arriscar caixa ni desviar enginyeria."; } },
        { t: "Mantenir tota l'artilleria centrada en un únic producte imbatible", s: "MRR +14% · Churn -0,3%/m · Cost contingut", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.churnMod = (st.churnMod || 0) - 0.003; return "L'excel·lència monoproducte et manté àgil i amb marges envejables."; } }
      ]
    },
    {
      id: "d58_macro_recession_shock", minStage: 3, maxStage: 5,
      tag: "TEMPESTA MACROECONÒMICA",
      title: "Pujada brusca de tipus d'interès i retallada de pressupostos als clients",
      body: "El crèdit es congela al mercat i moltes empreses revisen cada línia de despesa.",
      opts: [
        { t: "Reposicionar l'oferta com a eina d'estalvi directe i podar un 12% de despesa supèrflua", s: "Cost fix -12% · MRR +14% anticíclic · Caixa forta", fn: function (st) { st.fixedCost = Math.max(1000, Math.round(st.fixedCost * 0.88)); st.rev = Math.round(st.rev * 1.14); st.multMod = (st.multMod || 0) + 0.25; return "En temps de vaques magres, qui ajuda a estalviar diners ven més que mai!"; } },
        { t: "Aprofitar que els rivals es repleguen per fitxar el seu millor talent disponible", s: "Caixa -1,3x MRR · Cost fix +9% · MRR +26%", fn: function (st) { st.cash -= scaleAmt(st, 1.3, 28000); st.fixedCost = Math.round(st.fixedCost * 1.09); st.rev = Math.round(st.rev * 1.26); return "Jugada contracíclica magistral: fitxes estrelles que fa sis mesos eren inabastables!"; } },
        { t: "Congelar contractacions i oferir flexibilitat temporal als clients fidels en dificultats", s: "Churn -0,5%/m · MRR +5% · Llaços indestructibles", fn: function (st) { st.churnMod = (st.churnMod || 0) - 0.005; st.rev = Math.round(st.rev * 1.05); st.energy += 5; return "Els clients que ajudes durant la sotragada es queden amb tu tota la dècada."; } }
      ]
    },
    {
      id: "d59_toxic_top_performer", minStage: 3, maxStage: 5,
      tag: "LIDERATGE I VALORS",
      title: "El director comercial trenca rècords però falseja promeses als clients",
      body: "Tanca contractes enormes prometent terminis i funcions impossibles que després fan esclatar Operacions.",
      opts: [
        { t: "Cessar-lo immediatament i lligar les comissions comercials a la satisfacció als 6 mesos", s: "MRR -3% avui · Churn -0,6%/m · Energia +11 · Cultura sana", fn: function (st) { st.rev = Math.round(st.rev * 0.97); st.churnMod = (st.churnMod || 0) - 0.006; st.energy += 11; st.multMod = (st.multMod || 0) + 0.3; return "S'acaba el foc amic entre Vendes i Operacions: cada contracte nou entra ara amb bases reals."; } },
        { t: "Exigir la signatura tècnica d'Operacions abans de validar qualsevol contracte gran", s: "MRR +13% · Churn -0,3%/m · Tensió controlada", fn: function (st) { st.rev = Math.round(st.rev * 1.13); st.churnMod = (st.churnMod || 0) - 0.003; return "El doble filtre frena els excessos i encanala la seva empenta comercial."; } },
        { t: "Mirar cap a una altra banda mentre segueixi portant xifres rècord", s: "MRR +22% avui · Churn +0,8%/m · Energia -12", fn: function (st) { st.rev = Math.round(st.rev * 1.22); st.churnMod = (st.churnMod || 0) + 0.008; st.energy -= 12; return "Pa per avui i fam per demà: al cap d'uns mesos plouen reclamacions i baixes en cadena."; } }
      ]
    },
    {
      id: "d60_internal_ai_transformation", minStage: 3, maxStage: 5,
      tag: "PRODUCTIVITAT OPERATIVA",
      title: "Redissenyar processos interns amb automatització intel·ligent",
      body: "Podeu multiplicar el volum gestionat per cada persona de l'equip sense inflar l'estructura fixa.",
      opts: [
        { t: "Formar tota la plantilla i automatitzar facturació, triatge i anàlisi de dades", s: "Caixa -0,6x MRR · Cost fix -13% · MRR +18% · Múltiple +0,4x", fn: function (st) { st.cash -= scaleAmt(st, 0.6, 15000); st.fixedCost = Math.max(1000, Math.round(st.fixedCost * 0.87)); st.rev = Math.round(st.rev * 1.18); st.multMod = (st.multMod || 0) + 0.4; return "Cada equip produeix un 35% més sense fer ni un minut d'hores extres!"; } },
        { t: "Aplicar-ho només a l'àrea d'administració i control intern", s: "Caixa -0,2x MRR · Cost fix -6% · Energia +5", fn: function (st) { st.cash -= scaleAmt(st, 0.2, 5000); st.fixedCost = Math.max(1000, Math.round(st.fixedCost * 0.94)); st.energy += 5; return "Millora neta i sense friccions en totes les tasques administratives."; } },
        { t: "Posposar-ho per no interrompre el trimestre comercial més fort", s: "MRR +14% · Estructura sense canvis", fn: function (st) { st.rev = Math.round(st.rev * 1.14); return "Compleixes el trimestre comercial deixant la millora d'eficiència al calaix."; } }
      ]
    },
    {
      id: "d61_enterprise_sla_tier", minStage: 3, maxStage: 5,
      tag: "SEGMENT CORPORATIU",
      title: "Grans comptes demanen garantia de servei 99,9% i gestor dedicat",
      body: "Estan disposats a pagar el triple que un client mitjà si els garanteixes resposta en menys de 30 minuts.",
      opts: [
        { t: "Llançar divisió Corporativa amb tiquet mínim de 3.500 €/m i torns coberts", s: "Cost fix +4.200 €/m · MRR +26% · Múltiple +0,5x", fn: function (st) { st.fixedCost += 4200; st.rev = Math.round(st.rev * 1.26); st.multMod = (st.multMod || 0) + 0.5; return "Deu comptes corporatius signen el nou tram i disparen el marge i el prestigi del negoci!"; } },
        { t: "Oferir-ho només en horari laboral ampliat (8h–20h) sense guàrdies nocturnes", s: "Cost fix +1.400 €/m · MRR +17% · Energia protegida", fn: function (st) { st.fixedCost += 1400; st.rev = Math.round(st.rev * 1.17); st.energy += 3; return "La majoria d'empreses n'hi tenen prou amb l'horari estès i evites torns de matinada."; } },
        { t: "Descartar-ho per mantenir el mateix servei estandarditzat per a tothom", s: "MRR +10% · Simplicitat màxima", fn: function (st) { st.rev = Math.round(st.rev * 1.10); return "Renuncies a contractes gegants però conserves una operativa lleugera com una ploma."; } }
      ]
    },
    {
      id: "d62_pr_reputation_attack", minStage: 3, maxStage: 5,
      tag: "CRISI REPUTACIONAL",
      title: "Un exclient descontent publica un fil viral amb mitges veritats",
      body: "La publicació corre com la pólvora per les xarxes professionals del sector i diversos potencials et demanen explicacions.",
      opts: [
        { t: "Respondre una sola vegada amb dades objectives, serenitat i elegància impecable", s: "Respecte del sector · Múltiple +0,25x · MRR +12%", fn: function (st) { st.multMod = (st.multMod || 0) + 0.25; st.rev = Math.round(st.rev * 1.12); st.energy += 2; return "La teva resposta calmada i rigorosa gira la truita: desenes de clients actuals surten públicament a defensar-vos!"; } },
        { t: "Trucar-li en privat per resoldre el malentès i pactar una rectificació amistosa", s: "Caixa -2.500 € d'abonament · Calma immediata · MRR +9%", fn: function (st) { st.cash -= 2500; st.rev = Math.round(st.rev * 1.09); return "Apagues l'incendi en tres hores i el fil desapareix sense més soroll."; } },
        { t: "Enviar un burofax amenaçant amb demanda judicial immediata", s: "Efecte Streisand · Churn +0,4%/m · Energia -10", fn: function (st) { st.churnMod = (st.churnMod || 0) + 0.004; st.energy -= 10; return "Publica la captura del burofax i allarga la polèmica dues setmanes més."; } }
      ]
    },
    {
      id: "d63_cfo_financial_discipline", minStage: 3, maxStage: 5, noFlag: "hiredCFO",
      tag: "DIRECCIÓ FINANCERA",
      title: "Incorporar una Direcció Financera (CFO) per optimitzar fiscalitat i tresoreria",
      body: "Amb el volum actual, una bona gestió del circulant, deduccions d'R+D i tresoreria es paga sola.",
      opts: [
        { t: "Fitxar un CFO amb experiència en operacions M&A i control de marges", s: "Cost fix +4.800 €/m · Deduccions +1,2x MRR · Múltiple +0,5x", fn: function (st) { st.flags.hiredCFO = true; st.fixedCost += 4800; var tax = scaleAmt(st, 1.2, 26000); st.cash += tax; st.multMod = (st.multMod || 0) + 0.5; st.energy += 8; return "En el primer trimestre recupera " + fmt(tax) + " en bonificacions d'R+D i deixa els llibres a punt per a qualsevol Due Diligence!"; } },
        { t: "Contractar un CFO extern dos dies per setmana (Fractional CFO)", s: "Cost fix +1.900 €/m · Caixa +0,6x MRR · Múltiple +0,25x", fn: function (st) { st.flags.hiredCFO = true; st.fixedCost += 1900; st.cash += scaleAmt(st, 0.6, 12000); st.multMod = (st.multMod || 0) + 0.25; return "Obtens rigor d'alt nivell i quadres de comandament clars per una fracció d'un sou executiu."; } },
        { t: "Continuar amb la gestoria bàsica de sempre per estalviar estructura", s: "Cost 0 € · Perds optimitzacions fiscals", fn: function (st) { st.rev = Math.round(st.rev * 1.08); return "Estalvies la nòmina financera deixant bonificacions legals sense aprofitar."; } }
      ]
    },
    {
      id: "d64_exclusive_supplier_lock", minStage: 3, maxStage: 5,
      tag: "INTEGRACIÓ VERTICAL",
      title: "Assegurar en exclusiva un recurs o tecnologia clau davant dels rivals",
      body: "Un proveïdor estratègic t'ofereix exclusivitat al teu mercat si compromets un volum anual mínim.",
      opts: [
        { t: "Signar l'exclusivitat avançant part del compromís anual", s: "Caixa -1,4x MRR · Múltiple +0,45x · MRR +22%", fn: function (st) { st.cash -= scaleAmt(st, 1.4, 30000); st.multMod = (st.multMod || 0) + 0.45; st.rev = Math.round(st.rev * 1.22); return "Aixeques un fossat competitiu formidable: la competència es queda sense accés al millor component!"; } },
        { t: "Pactar descompte per volum sense clàusula d'exclusivitat ni avançament", s: "Cost fix -6% · MRR +12%", fn: function (st) { st.fixedCost = Math.max(1000, Math.round(st.fixedCost * 0.94)); st.rev = Math.round(st.rev * 1.12); return "Millores marges mantenint tota la liquiditat disponible a caixa."; } },
        { t: "Desenvolupar internament la peça crítica per no dependre de ningú", s: "Caixa -1,8x MRR · Múltiple +0,6x · Energia -7", fn: function (st) { st.cash -= scaleAmt(st, 1.8, 38000); st.multMod = (st.multMod || 0) + 0.6; st.rev = Math.round(st.rev * 1.16); st.energy -= 7; return "Esforç intens d'enginyeria que converteix una despesa externa en propietat intel·lectual pròpia!"; } }
      ]
    },
    {
      id: "d65_board_tension_vc", minStage: 3, maxStage: 5, reqFlag: "raisedSeriesA",
      tag: "CONSELL D'ADMINISTRACIÓ",
      title: "Els inversors del consell et pressionen per cremar caixa i créixer el doble",
      body: "Volen que tripliquis despesa comercial encara que entris en pèrdues fortes, buscant una Sèrie B ràpida.",
      opts: [
        { t: "Plantar-te amb dades: créixer de manera eficient mantenint unit economics positius", s: "MRR +19% sa · Múltiple +0,35x · Respecte guanyat", fn: function (st) { st.rev = Math.round(st.rev * 1.19); st.multMod = (st.multMod || 0) + 0.35; st.energy += 4; return "Defenses el timó amb xifres irrefutables i al cap de dos mesos el propi fons et posa d'exemple d'eficiència."; } },
        { t: "Accelerar tal com demanen invertint agressivament la caixa de la ronda", s: "Caixa -2,2x MRR · Cost fix +22% · MRR +37% · Energia -9", fn: function (st) { st.cash -= scaleAmt(st, 2.2, 95000); st.fixedCost = Math.round(st.fixedCost * 1.22); st.rev = Math.round(st.rev * 1.37); st.energy -= 9; return "Velocitat vertiginosa d'ingressos a canvi d'elevar fortament el consum mensual d'efectiu."; } },
        { t: "Pactar un terme mitjà amb experiments comercials limitats per retorn", s: "Caixa -0,9x MRR · MRR +24%", fn: function (st) { st.cash -= scaleAmt(st, 0.9, 40000); st.rev = Math.round(st.rev * 1.24); return "Consens al consell: escales els canals rendibles i tanques ràpid els que no retornen."; } }
      ]
    },
    {
      id: "d66_annual_customer_summit", minStage: 3, maxStage: 5,
      tag: "POSICIONAMENT LÍDER",
      title: "Convertir el vostre informe anual de tendències en l'estàndard del sector",
      body: "Teniu dades agregades i anònimes que tota la indústria i la premsa econòmica voldrien citar.",
      opts: [
        { t: "Publicar l'Observatori Anual del Sector i presentar-lo a mitjans i associacions", s: "Caixa -0,4x MRR · MRR +21% · Múltiple +0,4x", fn: function (st) { st.cash -= scaleAmt(st, 0.4, 10000); st.rev = Math.round(st.rev * 1.21); st.multMod = (st.multMod || 0) + 0.4; return "Tota la premsa especialitzada et cita com la font d'autoritat i les consultes entrants es disparen!"; } },
        { t: "Oferir l'informe comparatiu personalitzat només als clients del pla superior", s: "MRR +17% · Churn -0,4%/m", fn: function (st) { st.rev = Math.round(st.rev * 1.17); st.churnMod = (st.churnMod || 0) - 0.004; return "Els clients paguen encantats per saber com rendeixen respecte a la mitjana del seu gremi."; } },
        { t: "No dedicar-hi temps i centrar l'equip en tancar les comandes del mes", s: "MRR +11% · Energia +3", fn: function (st) { st.rev = Math.round(st.rev * 1.11); st.energy += 3; return "Execució directa i sense distraccions editorials."; } }
      ]
    },
    {
      id: "d67_pricing_indexation_enterprise", minStage: 3, maxStage: 5,
      tag: "ARQUITECTURA D'INGRESSOS",
      title: "Passar de quota plana a tarificació híbrida per ús i volum",
      body: "Els teus clients més grans creixen moltíssim amb la teva eina, però et segueixen pagant gairebé el mateix.",
      opts: [
        { t: "Introduir quota base + tram progressiu per volum que creix quan ells creixen", s: "MRR +26% · Retenció neta >115% · Múltiple +0,5x", fn: function (st) { st.rev = Math.round(st.rev * 1.26); st.multMod = (st.multMod || 0) + 0.5; return "Alineació mestra: ara factures més automàticament a mesura que els teus clients prosperen!"; } },
        { t: "Mantenir quota fixa previsible apujant un +15% els trams corporatius", s: "MRR +16% · Simplicitat de facturació", fn: function (st) { st.rev = Math.round(st.rev * 1.16); return "Als departaments financers els encanta saber l'import exacte a començament d'any."; } },
        { t: "Passar-ho 100% a variable pur sense quota mínima mensual", s: "Volatilitat alta · MRR +8% · Múltiple -0,25x", fn: function (st) { st.rev = Math.round(st.rev * 1.08); st.multMod = (st.multMod || 0) - 0.25; return "Els mesos fluixos d'estiu la facturació oscil·la massa i perds previsibilitat."; } }
      ]
    },
    {
      id: "d68_real_estate_hq_lease", minStage: 3, maxStage: 5,
      tag: "SEU CORPORATIVA",
      title: "Oportunitat d'establir una seu representativa per rebre grans comptes",
      body: "Un espai diàfan ben comunicat pot reforçar la marca ocupadora i comercial, però lliga caixa en reformes.",
      opts: [
        { t: "Llogar un espai ja condicionat amb contracte flexible i zero inversió d'obra", s: "Cost fix +2.800 €/m · MRR +16% · Energia +6", fn: function (st) { st.fixedCost += 2800; st.rev = Math.round(st.rev * 1.16); st.energy += 6; return "Entres amb les maletes fetes sense immobilitzar capital en totxos i tanques grans visites."; } },
        { t: "Mantenir seu fiscal sòbria i invertir aquest pressupost en retribució i producte", s: "Cost 0 € · Churn -0,3%/m · MRR +14%", fn: function (st) { st.churnMod = (st.churnMod || 0) - 0.003; st.rev = Math.round(st.rev * 1.14); return "Cultura austera: els clients compren per la qualitat del producte, no pel marbre de la recepció."; } },
        { t: "Reformar una nau d'autor a tot luxe com a seu emblemàtica", s: "Caixa -2,0x MRR · Cost fix +6.500 €/m · Marca +0,35x", fn: function (st) { st.cash -= scaleAmt(st, 2.0, 55000); st.fixedCost += 6500; st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.18); return "La seu impressiona tothom qui hi entra, a canvi d'una mossegada important a la caixa."; } }
      ]
    },
    {
      id: "d69_university_talent_pipeline", minStage: 3, maxStage: 5,
      tag: "CANTERA DE TALENT",
      title: "Guerra ferotge de sous al mercat per captar perfils tècnics i operatius",
      body: "Les grans tecnològiques inflen ofertes i cada procés de selecció extern s'allarga quatre mesos.",
      opts: [
        { t: "Crear la vostra pròpia Acadèmia interna becada amb les millors escoles tècniques", s: "Caixa -0,5x MRR · Cost salarial contingut · Fidelitat alta · MRR +17%", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 12000); st.rev = Math.round(st.rev * 1.17); st.fixedCost = Math.max(1000, Math.round(st.fixedCost * 0.96)); st.energy += 5; return "Descobreixes diamants en brut amb una lleialtat extraordinària i redueixes la rotació a mínims!"; } },
        { t: "Contractar sèniors en ciutats mitjanes amb teletreball i conciliació real", s: "MRR +19% · Energia +7 · Cost raonable", fn: function (st) { st.rev = Math.round(st.rev * 1.19); st.energy += 7; return "Atreus professionals sèniors brillants que fugen dels embussos i busquen projectes seriosos."; } },
        { t: "Pagar comissions del 20% a caçatalents per omplir vacants d'urgència", s: "Caixa -1,2x MRR · MRR +18%", fn: function (st) { st.cash -= scaleAmt(st, 1.2, 28000); st.rev = Math.round(st.rev * 1.18); return "Cobreixes les vacants de pressa pagant una factura salada d'intermediació."; } }
      ]
    },
    {
      id: "d70_public_tender_contract", minStage: 3, maxStage: 5,
      tag: "LICITACIÓ INSTITUCIONAL",
      title: "Concurs d'una entitat pública amb pressupost gran però cobrament lent",
      body: "El contracte és per dos anys garantits, però paguen a 90-120 dies i exigeixen aval bancari.",
      opts: [
        { t: "Presentar-s'hi en UTE amb una consultora veterana que gestioni la burocràcia", s: "MRR +20% estable · Risc operatiu compartit", fn: function (st) { st.rev = Math.round(st.rev * 1.20); st.churnMod = (st.churnMod || 0) - 0.003; return "Guanyeu el lot plegats: ells s'encarreguen dels plecs i tu poses la solució d'alt marge!"; } },
        { t: "Descartar sector públic i dedicar l'equip comercial a empresa privada àgil", s: "MRR +16% cobrat al dia 1 · Energia +5", fn: function (st) { st.rev = Math.round(st.rev * 1.16); st.energy += 5; return "Zero plecs ni avals immobilitzats: cada venda privada entra neta a caixa aquest mateix mes."; } },
        { t: "Anar-hi tot sol dipositant l'aval i finançant la demora de cobrament", s: "Caixa -1,5x MRR bloquejada · 65% guanyes MRR +29%", fn: function (st, rng) { st.cash -= scaleAmt(st, 1.5, 34000); if (rng() < 0.65) { st.rev = Math.round(st.rev * 1.29); st.energy -= 6; return "T'adjudiquen el contracte! Tens ingressos blindats dos anys tot i l'aval retingut."; } st.energy -= 8; return "Quedes segon per dues dècimes tècniques després de setmanes de paperassa."; } }
      ]
    },
    {
      id: "d71_customer_advisory_board", minStage: 3, maxStage: 5,
      tag: "CO-CREACIÓ D'ELIT",
      title: "Constituir un Consell Assessor amb els 12 clients més influents",
      body: "Si els fas partícips del full de ruta anual, blindes la seva renovació i encertes de ple les prioritats.",
      opts: [
        { t: "Reunir-los dos cops l'any a porta tancada i donar-los accés anticipat", s: "Caixa -0,3x MRR · Churn -0,5%/m · MRR +19% · Múltiple +0,35x", fn: function (st) { st.cash -= scaleAmt(st, 0.3, 7500); st.churnMod = (st.churnMod || 0) - 0.005; st.rev = Math.round(st.rev * 1.19); st.multMod = (st.multMod || 0) + 0.35; return "Els teus millors clients se senten copropietaris morals del rumb i et porten nous comptes del seu nivell!"; } },
        { t: "Fer enquestes trimestrals digitals a tota la base per igual", s: "Cost mínim · MRR +11%", fn: function (st) { st.rev = Math.round(st.rev * 1.11); return "Reculls estadístiques útils per prioritzar millores sense reunions presencials."; } },
        { t: "Guiar el producte només per la teva intuïció de fundador", s: "Energia +3 · 50% encert brillant / 50% tèbia acollida", fn: function (st, rng) { st.energy += 3; if (rng() < 0.5) { st.rev = Math.round(st.rev * 1.23); return "El teu olfacte l'encerta de ple amb una novetat que sorprèn el mercat!"; } st.rev = Math.round(st.rev * 1.05); return "Llances una funció enginyosa que pocs clients acaben fent servir."; } }
      ]
    },
    {
      id: "d72_four_day_or_intense_pace", minStage: 3, maxStage: 5,
      tag: "RITME ORGANITZATIU",
      title: "Redissenyar la setmana laboral: intensitat sostinguda o divendres compactes",
      body: "Amb els processos ja rodats, l'equip proposa jornada intensiva els divendres si es compleixen tots els indicadors.",
      opts: [
        { t: "Aprovar divendres de tarda lliure condicional a complir objectius i 100% de suport cobert", s: "Energia +15! · Fidelitat total d'equip · MRR +16%", fn: function (st) { st.energy += 15; st.rev = Math.round(st.rev * 1.16); st.churnMod = (st.churnMod || 0) - 0.003; return "L'equip elimina reunions inútils de dilluns a dijous per guanyar-se el divendres i la productivitat puja!"; } },
        { t: "Mantenir jornada clàssica afegint una setmana extra de vacances a l'agost o Nadal", s: "Energia +10 · MRR +14%", fn: function (st) { st.energy += 10; st.rev = Math.round(st.rev * 1.14); return "Mesura molt ben rebuda que no altera gens la coordinació amb els clients."; } },
        { t: "Exigir màxima tensió competitiva amb bons en metàl·lic per sobrecompliment", s: "Cost fix +7% · MRR +23% · Energia -9", fn: function (st) { st.fixedCost = Math.round(st.fixedCost * 1.07); st.rev = Math.round(st.rev * 1.23); st.energy -= 9; return "Bateu rècords comercials amb un ritme elèctric i exigent."; } }
      ]
    },
    // ==================== FASE 4 & 5 · LÍDER DE CATEGORIA & IMPERI CONSOLIDAT (Dilemes 73–90) ====================
    {
      id: "d73_dach_france_expansion", minStage: 4, maxStage: 5, noFlag: "expandedEU",
      tag: "EXPANSIÓ EUROPEA",
      title: "Assalt als mercats de França, Alemanya i el Benelux",
      body: "Al mercat domèstic ja sou líders clars. Europa central multiplica per cinc el mercat potencial, però exigeix credibilitat local.",
      opts: [
        { t: "Adquirir un jugador local petit a Munic o Lió com a cap de pont", s: "Caixa -2,4x MRR · MRR +32% · Múltiple +0,55x", fn: function (st) { st.flags.expandedEU = true; var c = scaleAmt(st, 2.4, 210000); st.cash -= c; st.rev = Math.round(st.rev * 1.32); st.multMod = (st.multMod || 0) + 0.55; return "Compres d'un sol cop llicències, equip nadiu i 90 clients alemanys i francesos per " + fmt(c) + "!"; } },
        { t: "Obrir filial pròpia fitxant un Country Manager amb 10 anys al sector", s: "Caixa -1,2x MRR · Cost fix +11.000 €/m · MRR +24%", fn: function (st) { st.flags.expandedEU = true; st.cash -= scaleAmt(st, 1.2, 105000); st.fixedCost += 11000; st.rev = Math.round(st.rev * 1.24); return "Desplegament orgànic impecable amb facturació en euros i tiquets mitjans un 40% superiors."; } },
        { t: "Entrar-hi a través de grans distribuïdors locals sense estructura fixa", s: "Cost fix 0 € · MRR +15% · Risc controlat", fn: function (st) { st.flags.expandedEU = true; st.rev = Math.round(st.rev * 1.15); st.energy += 3; return "Captures quota europea sense obrir oficines ni assumir riscos laborals estrangers."; } }
      ]
    },
    {
      id: "d74_us_market_entry", minStage: 4, maxStage: 5, noFlag: "expandedUS",
      tag: "DESEMBARCAMENT ALS EUA",
      title: "El gran salt atlàntic: entrar al mercat nord-americà",
      body: "Els clients dels Estats Units paguen el doble i decideixen més ràpid, però els sous i litigis allà no perdonen errors.",
      opts: [
        { t: "Obrir filial a la Costa Est (fus horari proper) amb equip mixt traslladat", s: "Caixa -2,0x MRR · Cost fix +18.000 €/m · MRR +34% · Múltiple +0,7x", fn: function (st) { st.flags.expandedUS = true; st.cash -= scaleAmt(st, 2.0, 180000); st.fixedCost += 18000; st.rev = Math.round(st.rev * 1.34); st.multMod = (st.multMod || 0) + 0.7; st.energy -= 6; return "Boston/Nova York et permet solapar mitja jornada amb casa i els contractes en dòlars disparen el múltiple!"; } },
        { t: "Vendre en remot des d'aquí en horari de tarda abans de llogar res allà", s: "Caixa -0,5x MRR · MRR +19% · Alta rendibilitat", fn: function (st) { st.flags.expandedUS = true; st.cash -= scaleAmt(st, 0.5, 45000); st.rev = Math.round(st.rev * 1.19); return "Valides desenes de comptes nord-americans amb sous europeus i un marge extraordinari!"; } },
        { t: "Descartar els EUA i consolidar el domini absolut a Europa i Llatinoamèrica", s: "MRR +15% · Energia +6 · Menys risc legal", fn: function (st) { st.flags.expandedUS = true; st.rev = Math.round(st.rev * 1.15); st.energy += 6; return "Evites cremar milions en una guerra transatlàntica i regnes amb comoditat als teus mercats naturals."; } }
      ]
    },
    {
      id: "d75_series_b_or_profit_engine", minStage: 4, maxStage: 5, noFlag: "decidedSeriesB",
      tag: "RONDA SÈRIE B VS AUTOFINANÇAMENT",
      title: "Fons de Growth Equity ofereixen 6,5M € per accelerar adquisicions",
      body: "A aquesta escala ja generes prou caixa pròpia, però un xec de 6,5M € et permetria comprar tres competidors seguits.",
      opts: [
        { t: "Mantenir l'autofinançament rendible i repartir beneficis sense nous socis", s: "Zero dilució · Múltiple +0,4x · Energia +7 · MRR +16%", fn: function (st) { st.flags.decidedSeriesB = true; st.multMod = (st.multMod || 0) + 0.4; st.energy += 7; st.rev = Math.round(st.rev * 1.16); return "Demostres que no necessites capital extern per dominar el mercat: tot el flux lliure és per als socis actuals!"; } },
        { t: "Tancar la Sèrie B de 6,5M € cedint un 14% amb condicions netes (1x)", s: "Caixa +6,5M € · Equity -14% · LiqPref +6,5M € · MRR +38%", fn: function (st) { st.flags.decidedSeriesB = true; st.cash += 6500000; st.equity = Math.max(5, Math.round(st.equity * 0.86)); st.liqPref = (st.liqPref || 0) + 6500000; st.fixedCost += 38000; st.rev = Math.round(st.rev * 1.38); return "Amb 6,5M € a la tresoreria consolides el sector i deixes els perseguidors a anys llum!"; } },
        { t: "Combinar 2,5M € de finançament bancari corporatiu barat sense cedir accions", s: "Caixa +2,5M € · 0% dilució · Cost financer +11.000 €/m · MRR +25%", fn: function (st) { st.flags.decidedSeriesB = true; st.cash += 2500000; st.fixedCost += 11000; st.rev = Math.round(st.rev * 1.25); return "Aprofites la teva solvència per obtenir crèdit corporatiu a baix interès conservant fins a l'última acció."; } }
      ]
    },
    {
      id: "d76_acquire_number_three", minStage: 4, maxStage: 5,
      tag: "CONSOLIDACIÓ M&A",
      title: "El tercer actor del mercat es posa en venda en un procés restringit",
      body: "Si el compres tu, sumes el seu equip i tanques el pas a un gegant estranger que també puja per quedar-se'l.",
      opts: [
        { t: "Presentar oferta guanyadora al comptat amb retenció de 2 anys pels seus tècnics", s: "Caixa -3,0x MRR · MRR +30% · Múltiple +0,5x", fn: function (st) { var p = scaleAmt(st, 3.0, 280000); st.cash -= p; st.rev = Math.round(st.rev * 1.30); st.multMod = (st.multMod || 0) + 0.5; st.fixedCost = Math.round(st.fixedCost * 1.10); return "Adquisició tancada per " + fmt(p) + "! Elimines un rival directe i captures sinergies immediates."; } },
        { t: "Oferir bescanvi parcial d'accions (6%) + caixa moderada", s: "Caixa -1,2x MRR · Equity -6% · MRR +28%", fn: function (st) { st.cash -= scaleAmt(st, 1.2, 110000); st.equity = Math.max(5, Math.round(st.equity * 0.94)); st.rev = Math.round(st.rev * 1.28); return "Els seus fundadors s'integren com a socis alineats i protegeixes el coixí de tresoreria."; } },
        { t: "Retirar-te de la subhasta per no sobrepagar i captar els seus clients indecisos", s: "Caixa intacta · MRR +13% · Disciplina de capital", fn: function (st) { st.rev = Math.round(st.rev * 1.13); st.energy += 4; return "El gegant estranger sobrepaga i s'encalla en la integració, regalant-te desenes de clients pel camí!"; } }
      ]
    },
    {
      id: "d77_erp_bureaucracy_trap", minStage: 4, maxStage: 5,
      tag: "AGILITAT VS BUROCRÀCIA",
      title: "Risc d'esclerosi corporativa: massa comitès i aprovacions internes",
      body: "Amb centenars de clients i desenes de treballadors, aprovar una campanya o una compra petita ara triga dues setmanes.",
      opts: [
        { t: "Eliminar el 50% de reunions fixes i donar pressupost autònom a cada unitat", s: "Cost fix -8% · MRR +20% · Energia +10", fn: function (st) { st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.92)); st.rev = Math.round(st.rev * 1.20); st.energy += 10; return "Recuperes el nervi i la rapidesa d'una startup amb el múscul financer d'una gran empresa!"; } },
        { t: "Implantar un ERP modern lleuger amb regles automàtiques sense paperassa", s: "Caixa -0,9x MRR · Cost fix -6% · Múltiple +0,35x", fn: function (st) { st.cash -= scaleAmt(st, 0.9, 85000); st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.94)); st.multMod = (st.multMod || 0) + 0.35; st.rev = Math.round(st.rev * 1.14); return "Control financer mil·limètric sense frenar la feina diària dels equips."; } },
        { t: "Afegir més controls d'auditoria interna a cada departament", s: "Risc mínim · MRR +6% · Energia -7", fn: function (st) { st.rev = Math.round(st.rev * 1.06); st.energy -= 7; return "Zero errors formals, però la innovació interna s'alenteix notablement."; } }
      ]
    },
    {
      id: "d78_ceo_succession_chairman", minStage: 4, maxStage: 5, noFlag: "hiredCEO",
      tag: "RELLEU EXECUTIU",
      title: "Passar a la Presidència Executiva i fitxar o promocionar un CEO diari",
      body: "Pots continuar portant el dia a dia personalment o elevar-te a l'estratègia, M&A i gestió del teu Holding.",
      opts: [
        { t: "Promocionar la persona més solvent de la casa a Direcció General (COO/CEO)", s: "Cost fix +6.500 €/m · Energia +26! · MRR +18% · Múltiple +0,6x", fn: function (st) { st.flags.hiredCEO = true; st.fixedCost += 6500; st.energy += 26; st.rev = Math.round(st.rev * 1.18); st.multMod = (st.multMod || 0) + 0.6; return "Transició exemplar! Coneix cada racó de la cultura, l'equip l'estima i tu recuperes llibertat total d'agenda!"; } },
        { t: "Seguir sent el CEO executiu al peu del canó amb un bon cap de gabinet", s: "Cost fix +3.200 €/m · Energia +10 · MRR +21%", fn: function (st) { st.fixedCost += 3200; st.energy += 10; st.rev = Math.round(st.rev * 1.21); return "Mantens el pols directe del negoci delegant tota la logística d'agenda i seguiment."; } },
        { t: "Fitxar un CEO estrella extern amb blindatge milionari", s: "Cost fix +19.000 €/m · 55% gran salt / 45% xoc cultural", fn: function (st, rng) { st.flags.hiredCEO = true; st.fixedCost += 19000; if (rng() < 0.55) { st.rev = Math.round(st.rev * 1.29); st.multMod = (st.multMod || 0) + 0.5; st.energy += 18; return "Professionalitza l'escala internacional amb mestria i dispara la valoració!"; } st.rev = Math.round(st.rev * 1.06); st.energy -= 8; return "Xoca amb els veterans de la casa i et toca intervenir per reconduir el rumb."; } }
      ]
    },
    {
      id: "d79_share_buyback", minStage: 4, maxStage: 5,
      tag: "RECOMPRA D'ACCIONS",
      title: "Excés de caixa a l'empresa: recomprar participacions a socis minoritaris",
      body: "Alguns inversors o socis antics volen fer caixa. Pots utilitzar la tresoreria de l'empresa per amortitzar accions i pujar el teu %!",
      opts: [
        { t: "Executar recompra i amortització: puja el teu % d'Equity sense posar diners personals", s: "Caixa -2,6x MRR · Recuperes +7% d'Equity! · LiqPref redueix", fn: function (st) {
          var cost = scaleAmt(st, 2.6, 240000);
          st.cash -= cost;
          st.equity = Math.min(100, st.equity + 7);
          st.liqPref = Math.max(0, (st.liqPref || 0) - Math.round(cost * 0.8));
          return "Jugada mestra d'assignació de capital a l'estil dels grans compostos: ara posseeixes el " + st.equity + "% de l'imperi!";
        } },
        { t: "Repartir un dividend extraordinari a tots els socis (el teu % va al Holding)", s: "Caixa empresa -2,2x MRR · Xec net directe al teu Holding!", fn: function (st) {
          var dist = scaleAmt(st, 2.2, 200000);
          st.cash -= dist;
          var myCut = Math.round(dist * (st.equity / 100));
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + myCut;
          return "Dividend extraordinari aprovat: el teu Holding ingressa " + fmt(myCut) + " nets d'una tacada!";
        } },
        { t: "Mantenir tota la reserva de guerra a l'empresa per a futures oportunitats", s: "Caixa intacta · Solvència fèrria · MRR +12%", fn: function (st) { st.rev = Math.round(st.rev * 1.12); st.energy += 4; return "Amb una fortalesa de tresoreria invulnerable, cap tempesta ni competidor et pot fer trontollar."; } }
      ]
    },
    {
      id: "d80_vertical_supplier_acquisition", minStage: 4, maxStage: 5,
      tag: "INTEGRACIÓ VERTICAL",
      title: "Comprar el teu principal proveïdor industrial o tecnològic",
      body: "El propietari es jubila sense successió familiar i et dona dret preferent abans d'ensenyar l'empresa a tercers.",
      opts: [
        { t: "Comprar el proveïdor per capturar tot el seu marge i blindar l'aprovisionament", s: "Caixa -2,8x MRR · Cost fix -16% permanent! · Múltiple +0,55x", fn: function (st) { var p = scaleAmt(st, 2.8, 260000); st.cash -= p; st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.84)); st.multMod = (st.multMod || 0) + 0.55; st.rev = Math.round(st.rev * 1.15); return "Integració vertical rodona per " + fmt(p) + ": el teu marge brut fa un salt històric!"; } },
        { t: "Signar un contracte de subministrament preferent a 5 anys amb els nous compradors", s: "Cost estable · Caixa protegida · MRR +12%", fn: function (st) { st.rev = Math.round(st.rev * 1.12); return "Assegures preus i entregues durant cinc anys sense complicar l'estructura del grup."; } },
        { t: "Comprar-lo a mitges (50/50) amb un soci industrial de confiança", s: "Caixa -1,4x MRR · Cost fix -9% · Múltiple +0,3x", fn: function (st) { st.cash -= scaleAmt(st, 1.4, 130000); st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.91)); st.multMod = (st.multMod || 0) + 0.3; return "Comparteixes la inversió i la gestió tot capturant la meitat de la millora de marge."; } }
      ]
    },
    {
      id: "d81_rd_skunkworks_lab", minStage: 4, maxStage: 5,
      tag: "INNOVACIÓ DISRUPTIVA",
      title: "La propera onada tecnològica pot deixar obsolet el teu producte actual en 5 anys",
      body: "Com a líder, tens el dilema clàssic de l'innovador: protegir la vaca lletera d'avui o canibalitzar-te tu mateix abans que ho faci un altre.",
      opts: [
        { t: "Crear un laboratori separat de 6 cracs amb llibertat per reinventar el sector", s: "Caixa -1,6x MRR · MRR +27% · Múltiple +0,75x!", fn: function (st) { st.cash -= scaleAmt(st, 1.6, 160000); st.rev = Math.round(st.rev * 1.27); st.multMod = (st.multMod || 0) + 0.75; return "Presentes la nova generació abans que ningú i el mercat et valora com una plataforma de futur imparable!"; } },
        { t: "Invertir petites participacions en 3 startups emergents amb opció de compra", s: "Caixa -1,0x MRR · Múltiple +0,4x · Radar tecnològic actiu", fn: function (st) { st.cash -= scaleAmt(st, 1.0, 95000); st.multMod = (st.multMod || 0) + 0.4; st.rev = Math.round(st.rev * 1.15); return "Tens ulls i dret de tanteig a primera línia d'innovació sense arriscar el negoci central."; } },
        { t: "Esprem al màxim la tecnologia actual optimitzant marges i dividends", s: "Cost fix -8% · MRR +11% · Múltiple -0,15x", fn: function (st) { st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.92)); st.rev = Math.round(st.rev * 1.11); st.multMod = (st.multMod || 0) - 0.15; return "Maximitza la generació d'efectiu present assumint una mica menys de prima de creixement futur."; } }
      ]
    },
    {
      id: "d82_pe_majority_buyout_offer", minStage: 4, maxStage: 5, minQ: 12,
      tag: "★ PRIVATE EQUITY BUYOUT",
      title: "Un gran fons de Private Equity europeu proposa comprar el 80% o el 100%",
      body: "Valoren la teva recurrència i marges: ofereixen compra total amb prima o bé liquidar el 75% del teu capital i deixar-te un 25% per al segon passe («second bite of the apple»).",
      opts: [
        { t: "Vendre el 75% de la teva part al Holding i conservar un quart per al proper salt!", s: "Xec milionari directe al Holding · Conserves 25% del teu Equity · MRR +24%", fn: function (st) {
          var soldEq = Math.max(5, Math.round(st.equity * 0.75));
          var val = Math.round(estVal(st) * 1.15);
          var netAfterPref = Math.max(0, val - (st.liqPref || 0));
          var payout = Math.round(netAfterPref * (soldEq / 100));
          st.equity = Math.max(4, st.equity - soldEq);
          st.liqPref = 0;
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + payout;
          st.rev = Math.round(st.rev * 1.24);
          st.energy += 16;
          return "Operació rodona! Ingresses " + fmt(payout) + " nets al teu Holding i segueixes participant del futur amb el " + st.equity + "%!";
        } },
        { t: "VENDRE EL 100% DE L'EMPRESA amb prima del +25% i tancar l'etapa!", s: "Exit complet amb prima +25% cap al teu Holding Personal", fn: function (st) {
          st.triggerExit = { multFactor: 1.25, label: "Buyout de Private Equity Europeu" };
          return "Tanques un Buyout històric amb prima del +25% i tot el capital passa al teu Holding!";
        } },
        { t: "Rebutjar el fons: preferim seguir independents i cobrar els nostres propis dividends", s: "Mantens tot l'Equity · Múltiple +0,4x · MRR +15%", fn: function (st) { st.multMod = (st.multMod || 0) + 0.4; st.rev = Math.round(st.rev * 1.15); st.energy += 6; return "Per què vendre la gallina dels ous d'or si et pot donar dividends durant dècades?"; } }
      ]
    },
    {
      id: "d83_global_supply_currency_hedge", minStage: 4, maxStage: 5,
      tag: "RISC DE DIVISA I LOGÍSTICA",
      title: "Oscil·lació forta del dòlar i colls d'ampolla en rutes internacionals",
      body: "Amb operacions en diversos països, el canvi de divisa i les duanes mosseguen un 6% del marge trimestral.",
      opts: [
        { t: "Contractar cobertures de divisa anuals i aprovisionament regional de proximitat", s: "Caixa -0,5x MRR · Cost fix -7% · Múltiple +0,3x", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 55000); st.fixedCost = Math.max(2000, Math.round(st.fixedCost * 0.93)); st.multMod = (st.multMod || 0) + 0.3; return "Estabilitzes marges en qualsevol escenari cambista i escurces terminis d'entrega a la meitat!"; } },
        { t: "Facturar tots els contractes internacionals exclusivament en euros", s: "Zero risc cambista · MRR +12%", fn: function (st) { st.rev = Math.round(st.rev * 1.12); return "Trasllades el tipus de canvi al comprador i blindes la comptabilitat en euros."; } },
        { t: "Assumir la fluctuació sense cobertures per estalviar comissions bancàries", s: "50% guany cambista / 50% mossegada de caixa", fn: function (st, rng) { if (rng() < 0.5) { var g = scaleAmt(st, 0.8, 70000); st.cash += g; return "El canvi gira a favor teu aquest trimestre i sumes +" + fmt(g) + " extraordinaris!"; } var l = scaleAmt(st, 0.9, 80000); st.cash -= l; return "El dòlar es mou en contra i et resta " + fmt(l) + " en tancar el trimestre."; } }
      ]
    },
    {
      id: "d84_antitrust_industry_standard", minStage: 5, maxStage: 5,
      tag: "REGULACIÓ I LIDERATGE",
      title: "Brussel·les i les associacions patronals revisen els estàndards del teu sector",
      body: "Com a un dels grans líders, la nova normativa europea pot jugar molt a favor teu si eleves el llistó de qualitat.",
      opts: [
        { t: "Liderar el codi de bones pràctiques europeu d'interoperabilitat i transparència", s: "Caixa -0,6x MRR · Múltiple +0,65x · Churn -0,4%/m · MRR +18%", fn: function (st) { st.cash -= scaleAmt(st, 0.6, 190000); st.multMod = (st.multMod || 0) + 0.65; st.churnMod = (st.churnMod || 0) - 0.004; st.rev = Math.round(st.rev * 1.18); return "Et converteixes en l'estàndard institucional de confiança per a governs i grans corporacions!"; } },
        { t: "Adaptar-se discretament als requisits tècnics sense exposició pública", s: "Caixa -0,2x MRR · MRR +12% · Energia +4", fn: function (st) { st.cash -= scaleAmt(st, 0.2, 65000); st.rev = Math.round(st.rev * 1.12); st.energy += 4; return "Compliment impecable sense soroll polític ni distraccions mediàtiques."; } },
        { t: "Pressionar per retardar la norma mantenint barreres tancades", s: "MRR +14% avui · Risc reputacional i múltiple -0,25x", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.multMod = (st.multMod || 0) - 0.25; return "Retens alguns clients captius a curt termini perdent simpatia institucional."; } }
      ]
    },
    {
      id: "d85_roll_up_three_boutiques", minStage: 5, maxStage: 5,
      tag: "PLATAFORMA ROLL-UP",
      title: "Executar una compra simultània de tres empreses regionals rendibles",
      body: "Al teu nivell de valoració, cada euro de benefici d'una pime comprada a 4x val el doble un cop integrat dins del teu grup.",
      opts: [
        { t: "Executar el Roll-Up pagant amb la caixa generada pel propi grup", s: "Caixa -3,2x MRR · MRR +34%! · Arbitratge de múltiple +0,6x", fn: function (st) { var p = scaleAmt(st, 3.2, 950000); st.cash -= p; st.rev = Math.round(st.rev * 1.34); st.multMod = (st.multMod || 0) + 0.6; st.fixedCost = Math.round(st.fixedCost * 1.14); return "Arbitratge magistral de múltiples per " + fmt(p) + ": sumes tres joies regionals que disparen el valor consolidat!"; } },
        { t: "Comprar només la més rendible de les tres per assegurar una integració perfecta", s: "Caixa -1,1x MRR · MRR +16% · Energia intacta", fn: function (st) { st.cash -= scaleAmt(st, 1.1, 330000); st.rev = Math.round(st.rev * 1.16); st.multMod = (st.multMod || 0) + 0.25; return "Integració neta en 60 dies sense cap fricció operativa."; } },
        { t: "Destinar aquest mateix capital a un súper-dividend directe al teu Holding", s: "Caixa empresa -2,0x MRR · Injecció massiva al Holding Personal", fn: function (st) {
          var dist = scaleAmt(st, 2.0, 600000);
          st.cash -= dist;
          var myCut = Math.round(dist * (st.equity / 100));
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + myCut;
          return "Prefereixes diversificar fora de l'empresa: +" + fmt(myCut) + " nets a la caixa del teu Holding!";
        } }
      ]
    },
    {
      id: "d86_hostile_takeover_or_merger", minStage: 5, maxStage: 5,
      tag: "ALTA ESTRATÈGIA CORPORATIVA",
      title: "Un conglomerat global llança una oferta agressiva per absorbir-vos",
      body: "Amenacen de competir amb pressupost il·limitat al teu mercat si no acceptes ser la seva divisió estrella.",
      opts: [
        { t: "Negociar amb sang freda fins a arrencar una prima històrica del +35% i VENDRE!", s: "GRAN EXIT INDUSTRIAL (+35% prima) directe al teu Holding!", fn: function (st) {
          st.triggerExit = { multFactor: 1.35, label: "Gran Exit Industrial amb Prima del 35%" };
          return "Negociació llegendària! Els obligues a pagar una prima del +35% al comptat i corones el teu Holding!";
        } },
        { t: "Rebutjar l'ultimàtum i signar aliança amb els seus principals clients globals", s: "MRR +23% · Múltiple +0,5x · Independència invicta", fn: function (st) { st.rev = Math.round(st.rev * 1.23); st.multMod = (st.multMod || 0) + 0.5; st.energy += 6; return "El gegant és massa lent per copiar la teva agilitat i surts del pols més fort que mai!"; } },
        { t: "Tancar un acord de llicència tecnològica global cobrant un cànon milionari", s: "Caixa +2,5x MRR · MRR +18% · Zero cessió d'accions", fn: function (st) { var r = scaleAmt(st, 2.5, 750000); st.cash += r; st.rev = Math.round(st.rev * 1.18); return "En lloc de comprar-te, t'acaben pagant " + fmt(r) + " d'entrada per llicenciar el teu motor!"; } }
      ]
    },
    {
      id: "d87_ipo_roadshow_milestone", minStage: 5, maxStage: 5, minQ: 14,
      tag: "★ SORTIDA A BORSA (IPO)",
      title: "Els bancs d'inversió confirmen finestra oberta per sortir a cotitzar a Borsa!",
      body: "Les teves xifres d'imperi consolidat compleixen tots els requisits per a un toc de campana històric al parquet europeu.",
      opts: [
        { t: "TOCAR LA CAMPANA (IPO): sortir a Borsa amb prima +40% i fer líquid el teu patrimoni!", s: "SORTIDA A BORSA HISTÒRICA (+40% prima de mercat) al teu Holding!", fn: function (st) {
          st.triggerExit = { multFactor: 1.40, label: "Sortida a Borsa (IPO) Triomfal" };
          return "Toques la campana a Borsa amb sobredemanda institucional (+40% prima) i consolides una fortuna generacional al Holding!";
        } },
        { t: "Mantenir l'empresa 100% privada fora dels focus trimestrals de la Borsa", s: "Zero costos de cotitzada · MRR +17% · Energia +10 · Llibertat total", fn: function (st) { st.rev = Math.round(st.rev * 1.17); st.energy += 10; st.multMod = (st.multMod || 0) + 0.35; return "Com les grans nissagues industrials europees: imperi privat, discret i altament rendible!"; } },
        { t: "Col·locar només un 20% privat a fons institucionals de llarg termini", s: "Xec massiu al teu Holding · Continues al comandament privat", fn: function (st) {
          var soldEq = Math.max(3, Math.round(st.equity * 0.20));
          var val = Math.round(estVal(st) * 1.20);
          var netAfterPref = Math.max(0, val - (st.liqPref || 0));
          var payout = Math.round(netAfterPref * (soldEq / 100));
          st.equity = Math.max(5, st.equity - soldEq);
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + payout;
          st.energy += 12;
          return "Col·locació privada impecable: portes " + fmt(payout) + " nets al Holding sense patir la tirania borsària!";
        } }
      ]
    },
    {
      id: "d88_corporate_foundation_legacy", minStage: 5, maxStage: 5,
      tag: "LLEGAT I PRESTIGI",
      title: "Crear una Fundació Tecnològica i d'Oficis finançada amb l'1% dels beneficis",
      body: "El grup és un referent econòmic i podeu formar centenars de joves professionals mentre reforceu la reputació institucional.",
      opts: [
        { t: "Dotar la Fundació i vincular-la a beques d'excel·lència i recerca aplicada", s: "Caixa -0,5x MRR · Múltiple +0,5x · Energia +14 · Cantera inesgotable", fn: function (st) { st.cash -= scaleAmt(st, 0.5, 150000); st.multMod = (st.multMod || 0) + 0.5; st.energy += 14; st.rev = Math.round(st.rev * 1.14); return "Impacte social tangible, prestigi immens i els millors graduats somiant treballar a casa vostra!"; } },
        { t: "Patrocinar càtedres existents sense crear estructura fundacional pròpia", s: "Caixa -0,2x MRR · Energia +6 · MRR +10%", fn: function (st) { st.cash -= scaleAmt(st, 0.2, 60000); st.energy += 6; st.rev = Math.round(st.rev * 1.10); return "Col·laboració àgil i ben valorada sense afegir gestió administrativa."; } },
        { t: "Canalitzar tota la filantropia a títol personal des del teu propi Holding", s: "Cost empresa 0 € · MRR +11% · Discreció absoluta", fn: function (st) { st.rev = Math.round(st.rev * 1.11); st.energy += 5; return "Separes amb nitidesa l'activitat mercantil del mecenatge personal."; } }
      ]
    },
    {
      id: "d89_decentralized_berkshire_structure", minStage: 5, maxStage: 5,
      tag: "ARQUITECTURA D'IMPERI",
      title: "Dividir el grup en 5 unitats de negoci autònomes amb compte de resultats propi",
      body: "Quan una organització supera centenars de persones, la centralització dilueix la responsabilitat sobre el marge.",
      opts: [
        { t: "Descentralitzar en 5 divisions autònomes amb directors socis del seu propi marge", s: "Cost fix -9% · MRR +24% · Energia +16! · Múltiple +0,65x", fn: function (st) { st.fixedCost = Math.max(3000, Math.round(st.fixedCost * 0.91)); st.rev = Math.round(st.rev * 1.24); st.energy += 16; st.multMod = (st.multMod || 0) + 0.65; return "Model descentralitzat d'alta confiança: cada director gestiona la seva unitat com un autèntic fundador!"; } },
        { t: "Mantenir direcció centralitzada per aprofitar compres i serveis compartits", s: "Cost fix -5% · MRR +13%", fn: function (st) { st.fixedCost = Math.max(3000, Math.round(st.fixedCost * 0.95)); st.rev = Math.round(st.rev * 1.13); return "Economies d'escala en compres i tecnologia sota un comandament únic."; } },
        { t: "Segregar i vendre una divisió secundària per injectar liquiditat extra", s: "MRR -8% · Caixa +3,5x MRR d'ingrés extraordinari!", fn: function (st) { var sale = scaleAmt(st, 3.5, 1050000); st.rev = Math.round(st.rev * 0.92); st.cash += sale; return "Vens una branca no essencial per " + fmt(sale) + " i deixes el grup més rendible i enfocat que mai!"; } }
      ]
    },
    {
      id: "d90_sovereign_wealth_cornerstone", minStage: 5, maxStage: 5,
      tag: "CAPITAL PERMANENT",
      title: "Un Family Office industrial centenari vol ser soci estable a 20 anys vista",
      body: "No tenen pressa per vendre mai: ofereixen comprar participació o finançar noves adquisicions globals al teu costat.",
      opts: [
        { t: "Crear una societat conjunta (Joint Venture) per comprar actius internacionals al 50%", s: "Caixa intacta · MRR +26% · Múltiple +0,55x", fn: function (st) { st.rev = Math.round(st.rev * 1.26); st.multMod = (st.multMod || 0) + 0.55; st.energy += 7; return "Multipliques l'abast internacional amb el capital pacient d'un aliat centenari sense diluir la matriu!"; } },
        { t: "Vendre'ls un 15% secundari amb pacte de dividends estables a llarg termini", s: "Xec patrimonial al Holding · Soci tranquil i lleial", fn: function (st) {
          var soldEq = Math.max(2, Math.round(st.equity * 0.15));
          var val = Math.round(estVal(st) * 1.22);
          var netAfterPref = Math.max(0, val - (st.liqPref || 0));
          var payout = Math.round(netAfterPref * (soldEq / 100));
          st.equity = Math.max(5, st.equity - soldEq);
          st.holdingCashTransfer = (st.holdingCashTransfer || 0) + payout;
          st.energy += 12;
          return "Incorporació impecable al capital i +" + fmt(payout) + " nets directes al teu Holding Personal!";
        } },
        { t: "Agrair l'interès i preservar el 100% de la sobirania actual", s: "MRR +14% · Orgull d'independència · Energia +5", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.energy += 5; return "La teva taula d'accionistes continua tancada amb pany i forrellat."; } }
      ]
    }
  ];

  // ==================== GENERADOR COMBINATORI CONTEXTUAL (T60+, 5 FASES) ====================
  function generateDynamicQuarterDilemma(st, rng) {
    var r1 = rng();
    var r2 = rng();
    var rev = st.rev || 2000;
    var stage = rev < 4000 ? 1 : rev < 18000 ? 2 : rev < 75000 ? 3 : rev < 300000 ? 4 : 5;

    var contexts = [
      {
        tag: "EXPANSIÓ DE COMPTES · T" + st.q,
        titles: [
          "Renovació de grans contractes i revisió anual de tarifes",
          "Oportunitat d'entrar en un nou vertical d'alt marge",
          "Demanda latent d'un pla superior amb servei garantit"
        ],
        bodies: [
          "El tancament del trimestre T" + st.q + " obre una finestra clara per elevar el tiquet mitjà sobre la base instal·lada actual (" + fmt(rev) + "/m).",
          "Diversos clients de referència demanen ampliar l'abast del servei si garanteixes dedicació i temps de resposta."
        ],
        buildOpts: function () {
          var inv = scaleAmt(st, 0.75, 2500);
          return [
            {
              t: "Desplegar paquet d'expansió prèmium per als millors comptes actuals",
              s: "Caixa -" + fmt(inv) + " · MRR +17% · Churn -0,2%/m",
              fn: function (s) {
                s.cash -= inv;
                s.rev = Math.round(s.rev * 1.17);
                s.churnMod = (s.churnMod || 0) - 0.002;
                return "Els clients fidels amplien contracte i consolides un creixement molt rendible.";
              }
            },
            {
              t: "Llançar campanya anual prepagada amb incentiu de fidelitat",
              s: "Caixa +" + fmt(Math.round(rev * 1.6)) + " · MRR +8%",
              fn: function (s) {
                var up = Math.round((s.rev || rev) * 1.6);
                s.cash += up;
                s.rev = Math.round(s.rev * 1.08);
                return "Excel·lent entrada d'efectiu per avançat (+" + fmt(up) + ") sense cedir marge estructural.";
              }
            },
            {
              t: "Prioritzar consolidació operativa, descans d'equip i zero fricció",
              s: "Energia +12 · Cost fix -5% · MRR +6%",
              fn: function (s) {
                s.energy += 12;
                s.fixedCost = Math.max(600, Math.round(s.fixedCost * 0.95));
                s.rev = Math.round(s.rev * 1.06);
                return "Trimestre serè que eixampla marges i recarrega l'energia directiva.";
              }
            }
          ];
        }
      },
      {
        tag: "ASSIGNACIÓ DE CAPITAL · T" + st.q,
        titles: [
          "Excés de flux operatiu o reinversió tàctica del trimestre",
          "Revisió trimestral d'estructura, marges i retribució al soci",
          "Balanç entre creixement orgànic, caixa i qualitat de servei"
        ],
        bodies: [
          "En la Fase " + stage + ", cada euro generat pot anar a accelerar quota de mercat, podar ineficiències o remunerar el Holding.",
          "El comitè analitza on obtindrà millor retorn compost el capital disponible d'aquest trimestre."
        ],
        buildOpts: function () {
          var boltOn = scaleAmt(st, 1.3, 4000);
          var divPool = Math.max(0, Math.round((st.cash || 0) * 0.16));
          var canDiv = divPool >= 3000 && st.cash > rev * 2;
          return [
            {
              t: "Adquirir una petita cartera complementària o canal captiu",
              s: "Caixa -" + fmt(boltOn) + " · MRR +21% · Múltiple +0,2x",
              fn: function (s) {
                s.cash -= boltOn;
                s.rev = Math.round(s.rev * 1.21);
                s.multMod = (s.multMod || 0) + 0.2;
                return "Operació tàctica amortitzable en pocs mesos que impulsa la facturació recurrent.";
              }
            },
            canDiv ? {
              t: "Aprovar dividend tàctic extraordinari cap al Holding Personal",
              s: "Caixa empresa -" + fmt(divPool) + " · Xec directe al teu Holding",
              fn: function (s) {
                s.cash -= divPool;
                var myShare = Math.round(divPool * (s.equity / 100));
                s.holdingCashTransfer = (s.holdingCashTransfer || 0) + myShare;
                s.energy += 6;
                return "Retires +" + fmt(myShare) + " nets cap al teu Holding mantenint l'empresa ben capitalitzada.";
              }
            } : {
              t: "Renegociar contractes de proveïdors i automatitzar processos repetitius",
              s: "Cost fix -9% · Energia +8 · MRR +9%",
              fn: function (s) {
                s.fixedCost = Math.max(600, Math.round(s.fixedCost * 0.91));
                s.energy += 8;
                s.rev = Math.round(s.rev * 1.09);
                return "Podes greix acumulat i eleves el benefici net mensual de manera permanent.";
              }
            },
            {
              t: "Invertir en excel·lència de producte i fidelització de clients actuals",
              s: "Churn -0,3%/m · Múltiple +0,25x · MRR +12%",
              fn: function (s) {
                s.churnMod = (s.churnMod || 0) - 0.003;
                s.multMod = (s.multMod || 0) + 0.25;
                s.rev = Math.round(s.rev * 1.12);
                return "La qualitat sostinguda blinda la cartera i eleva la valoració del grup.";
              }
            }
          ];
        }
      },
      {
        tag: "COMPETÈNCIA I TALENT · T" + st.q,
        titles: [
          "Moviment agressiu d'un rival al teu segment més rendible",
          "Oportunitat d'incorporar un equip especialista ja conjuntat",
          "Tensió competitiva en preus i retenció d'especialistes"
        ],
        bodies: [
          "El mercat no s'atura al Trimestre " + st.q + ": un moviment ràpid pot consolidar el teu fossat defensiu.",
          "Tens l'opció de jugar a l'atac guanyant quota o blindar marges i cultura interna."
        ],
        buildOpts: function () {
          var teamCost = scaleAmt(st, 0.9, 3500);
          return [
            {
              t: "Fitxar el bloc especialista i llançar contraofensiva de qualitat",
              s: "Caixa -" + fmt(teamCost) + " · Cost fix +6% · MRR +22%",
              fn: function (s) {
                s.cash -= teamCost;
                s.fixedCost = Math.round(s.fixedCost * 1.06);
                s.rev = Math.round(s.rev * 1.22);
                return "L'equip nou rendeix des de la primera setmana i guanyes quota als competidors.";
              }
            },
            {
              t: "Blindar la cartera amb acords plurianuals i millores de servei",
              s: "Churn -0,4%/m · MRR +13% · Múltiple +0,2x",
              fn: function (s) {
                s.churnMod = (s.churnMod || 0) - 0.004;
                s.rev = Math.round(s.rev * 1.13);
                s.multMod = (s.multMod || 0) + 0.2;
                return "Cap client clau es mou: reforces el fossat competitiu sense entrar en guerres de preus.";
              }
            },
            {
              t: "Protegir el descans, delegar en els comandaments i podar projectes menors",
              s: "Energia +14 · Cost fix -4% · MRR +7%",
              fn: function (s) {
                s.energy += 14;
                s.fixedCost = Math.max(600, Math.round(s.fixedCost * 0.96));
                s.rev = Math.round(s.rev * 1.07);
                return "Evites desgastar l'organització i tanques un trimestre sòlid i previsible.";
              }
            }
          ];
        }
      },
      {
        tag: "OPORTUNITAT D'IMPERI · T" + st.q,
        titles: [
          "Sondeig confidencial d'inversors i compradors estratègics",
          "Aliança internacional per distribuir la teva solució a gran escala",
          "Reestructuració d'actius per maximitzar el valor per acció"
        ],
        bodies: [
          "Amb una facturació de " + fmt(rev) + "/mes (Fase " + stage + "), les decisions de direcció general marquen una gran diferència patrimonial.",
          "Diversos interlocutors del sector s'acosten amb propostes d'aliança o liquiditat."
        ],
        buildOpts: function () {
          var canExitOffer = stage >= 3 && st.q >= 10;
          return [
            {
              t: "Signar l'aliança comercial internacional mantenint el 100% del control",
              s: "MRR +19% · Múltiple +0,3x · Risc acotat",
              fn: function (s) {
                s.rev = Math.round(s.rev * 1.19);
                s.multMod = (s.multMod || 0) + 0.3;
                return "L'acord obre nous mercats d'alt valor sense comprometre caixa ni accions.";
              }
            },
            canExitOffer ? {
              t: "Acceptar oferta ferma d'Exit M&A amb prima del +22% cap al Holding!",
              s: "VENDA TOTAL amb prima +22% · Xec net al Holding Personal",
              fn: function (s) {
                s.triggerExit = { multFactor: 1.22, label: "Adquisició Estratègica Internacional (T" + s.q + ")" };
                return "Culmines l'etapa amb una venda excel·lent amb prima del +22% cap al teu Holding!";
              }
            } : {
              t: "Optimitzar capital circulant cobrant avançaments de nous contractes",
              s: "Caixa +" + fmt(scaleAmt(st, 1.4, 3000)) + " · MRR +11%",
              fn: function (s) {
                var adv = scaleAmt(s, 1.4, 3000);
                s.cash += adv;
                s.rev = Math.round(s.rev * 1.11);
                return "Reforces la tresoreria amb +" + fmt(adv) + " de flux operatiu immediat.";
              }
            },
            {
              t: "Setmana d'estratègia fora de l'oficina i simplificació d'operacions",
              s: "Energia +13 · Cost fix -6% · MRR +8%",
              fn: function (s) {
                s.energy += 13;
                s.fixedCost = Math.max(600, Math.round(s.fixedCost * 0.94));
                s.rev = Math.round(s.rev * 1.08);
                return "Tornes amb tres prioritats cristal·lines i una estructura més lleugera.";
              }
            }
          ];
        }
      }
    ];

    var fam = contexts[Math.floor(r1 * contexts.length) % contexts.length];
    var tIdx = Math.floor(r2 * fam.titles.length) % fam.titles.length;
    var bIdx = Math.floor((r1 + r2) * 7) % fam.bodies.length;

    return {
      id: "dyn_q" + st.q,
      tag: fam.tag,
      title: fam.titles[tIdx],
      body: fam.bodies[bIdx],
      opts: fam.buildOpts()
    };
  }

  window.CalmData.fundador = {
    STAGES: STAGES,
    VENTURES: VENTURES,
    DEPARTMENTS: DEPARTMENTS,
    PRICING_TIERS: PRICING_TIERS,
    DIVIDEND_POLICIES: DIVIDEND_POLICIES,
    FOCUS_MODES: FOCUS_MODES,
    HOLDING_ASSETS: HOLDING_ASSETS,
    MILESTONES: MILESTONES,
    DILEMMAS: DILEMMAS,
    generateDynamicQuarterDilemma: generateDynamicQuarterDilemma
  };
})();
