// Joc 3: Fundador des de Zero (Simulador de Crear, Escalar o Vendre una Empresa)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "fundador_state_v1";
  var BEST_KEY = "fundador_best_v1";

  var VENTURES = [
    {
      id: "saas",
      name: "SaaS B2B de Gestió",
      sub: "Caixa 18k€ · MRR 1,2k€ · Cost 2,3k€/m · 100% teu",
      mult: 4.5, // valuation multiple on annual revenue
      cash: 18000, rev: 1200, cost: 2300, growth: 0.19
    },
    {
      id: "cafe",
      name: "Obrador & Cafè d'Especialitat",
      sub: "Caixa 22k€ · Vendes 6,8k€ · Cost 5,9k€/m · 100% teu",
      mult: 2.2,
      cash: 22000, rev: 6800, cost: 5900, growth: 0.09
    },
    {
      id: "ecom",
      name: "Marca Pròpia E-commerce",
      sub: "Caixa 15k€ · Vendes 3,6k€ · Cost 3,4k€/m · 100% teu",
      mult: 2.8,
      cash: 15000, rev: 3600, cost: 3400, growth: 0.14
    },
    {
      id: "ia",
      name: "Estudi Boutique d'IA & Automatització",
      sub: "Caixa 7k€ · Facturació 4,4k€ · Cost 1,7k€/m · 100% teu",
      mult: 3.1,
      cash: 7000, rev: 4400, cost: 1700, growth: 0.12
    }
  ];

  var DILEMMAS = [
    {
      id: "cofounder", minQ: 1, maxQ: 5, noFlag: "hasCof",
      tag: "SOCI CLAU",
      title: "Un perfil brillant vol entrar com a cofundador",
      body: "Complementa exactament el teu punt feble i pot accelerar el negoci, però demana el 22% de les participacions (amb consolidació a 4 anys).",
      opts: [
        { k: "A", t: "Signar pacte de socis amb 20% d'equity i objectius clars", s: "Equity -20% · Creixement fort · Energia +10", fn: function (st) { st.flags.hasCof = true; st.equity = Math.round(st.equity * 0.8); st.rev = Math.round(st.rev * 1.28); st.energy += 10; return "El 80% d'un pastís gran val molt més que el 100% d'una engruna: avanceu al doble de ritme."; } },
        { k: "B", t: "Contractar només un freelance puntual i retenir el 100%", s: "Caixa -3.500 € · 100% teu", fn: function (st) { st.cash -= 3500; st.rev = Math.round(st.rev * 1.09); return "Conserves tot el control pagant ajuda externa per hores."; } },
        { k: "C", t: "Fer-ho tot tu sol treballant nits i diumenges", s: "Cost 0 € · Facturació +14% · Energia -16", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.energy -= 16; return "Estalvies diners i accions, però acumules un cansament considerable."; } }
      ]
    },
    {
      id: "whale_client", minQ: 1, maxQ: 12,
      tag: "CLIENT GEGANT",
      title: "Un gran grup t'ofereix un contracte sucós amb condicions",
      body: "Volen pagar-te 18.000 € d'entrada, però exigeixen desenvolupaments a mida que desviaran el teu producte principal durant mesos.",
      opts: [
        { k: "A", t: "Rebutjar el a-mida i oferir-los la versió estàndard amb descompte", s: "MRR +850 €/m net i escalable", fn: function (st) { st.rev += 850; st.energy += 3; return "Sorpresa: respecten el teu criteri i accepten el producte estàndard sense hipotecar el teu full de ruta!"; } },
        { k: "B", t: "Acceptar els 18.000 € i fer tot el que demanin", s: "Caixa +18.000 € · Cost +600 €/m · Energia -12", fn: function (st) { st.cash += 18000; st.cost += 600; st.energy -= 12; return "Oxigen immediat a la caixa, tot i acabar fent gairebé de consultoria per a un sol client."; } },
        { k: "C", t: "Cobrar-los el doble (32.000 €) si volen exclusivitat", s: "50% d'èxit d'un gran cop de caixa", fn: function (st, rng) { if (rng() < 0.45) { st.cash += 32000; st.energy -= 8; return "Accepten el pressupost alt! Injectes 32.000 € de cop a tresoreria."; } return "Els sembla car i marxen, però mantens el focus intacte."; } }
      ]
    },
    {
      id: "vc_seed", minQ: 3, maxQ: 10, noFlag: "raisedSeed",
      tag: "RONDA D'INVERSIÓ",
      title: "Un fons llavor posa un Term Sheet sobre la taula",
      body: "T'ofereixen injectar 120.000 € a la caixa pel 18% de l'empresa, amb la condició de doblar l'equip i créixer ràpid.",
      opts: [
        { k: "A", t: "Seguir en mode Bootstrapping (créixer amb els diners dels clients)", s: "Zero dilució · Llibertat total de decisions", fn: function (st) { st.energy += 5; st.rev = Math.round(st.rev * 1.11); return "Cap consell d'administració et mana: creixes al ritme sa de la teva pròpia facturació."; } },
        { k: "B", t: "Tancar la ronda: +120.000 € a caixa a canvi del 18%", s: "Caixa +120k€ · Equity -18% · Cost +2.800€/m · MRR +42%", fn: function (st) { st.flags.raisedSeed = true; st.cash += 120000; st.equity = Math.round(st.equity * 0.82); st.cost += 2800; st.rev = Math.round(st.rev * 1.42); st.energy -= 6; return "Benzina de coet a la caixa! Contractes talent clau i les vendes s'acceleren amb força."; } },
        { k: "C", t: "Acceptar només 35.000 € d'un Business Angel tranquil pel 6%", s: "Caixa +35k€ · Equity -6% · MRR +18%", fn: function (st) { st.flags.raisedSeed = true; st.cash += 35000; st.equity = Math.round(st.equity * 0.94); st.cost += 650; st.rev = Math.round(st.rev * 1.18); return "Coixí de seguretat i bons contactes amb una dilució mínima."; } }
      ]
    },
    {
      id: "pricing_power", minQ: 2, maxQ: 14, noFlag: "pricedUp",
      tag: "ESTRATÈGIA DE PREUS",
      title: "Sospites que estàs cobrant massa barat",
      body: "Els clients diuen que sí massa ràpid i els marges van justos. Plantejar una pujada de tarifes del 25% et fa vertigen.",
      opts: [
        { k: "A", t: "Apujar preus un +25% als nous clients i mantenir-lo als fidels", s: "Facturació +19% · Zero baixes · Marge alt", fn: function (st) { st.flags.pricedUp = true; st.rev = Math.round(st.rev * 1.19); st.energy += 4; return "Els clients nous paguen encantats i els antics agraeixen el detall i et recomanen!"; } },
        { k: "B", t: "Apujar un +30% a tota la cartera actual demà mateix", s: "Facturació neta +22% tot i perdre algun client petit", fn: function (st) { st.flags.pricedUp = true; st.rev = Math.round(st.rev * 1.22); st.cost = Math.max(900, st.cost - 250); return "Marxen els clients més exigents i menys rendibles, i guanyes més treballant menys!"; } },
        { k: "C", t: "Baixar preus un 15% per captar volum massiu", s: "Més feina i suport · Cost +700 €/m · Energia -10", fn: function (st) { st.rev = Math.round(st.rev * 1.05); st.cost += 700; st.energy -= 10; return "S'omple de clients que es queixen per tot i els marges s'estrenyen perillosament."; } }
      ]
    },
    {
      id: "viral_spike", minQ: 2, maxQ: 15,
      tag: "ALLAU DE DEMANDA",
      title: "Una recomanació inesperada dispara les visites x5",
      body: "Tens comandes i consultes acumulant-se per totes bandes. Si no respons ràpid la qualitat pot caure en picat.",
      opts: [
        { k: "A", t: "Activar llista d'espera selectiva per protegir la qualitat", s: "MRR +20% · Reputació impecable · Energia intacta", fn: function (st) { st.rev = Math.round(st.rev * 1.20); st.mult += 0.3; return "L'escassetat ben gestionada multiplica el desig i protegeix l'equip!"; } },
        { k: "B", t: "Reinvertir 8.000 € de cop en capacitat per absorbir-ho tot", s: "Caixa -8.000 € · MRR +36% · Cost +900 €/m", fn: function (st) { st.cash -= 8000; st.rev = Math.round(st.rev * 1.36); st.cost += 900; st.energy -= 7; return "Setmanes frenètiques, però consolides un salt d'escala gegant."; } },
        { k: "C", t: "Intentar atendre-ho tot sense gastar ni un euro més", s: "MRR +12% · Energia -18 per caos operatiu", fn: function (st) { st.rev = Math.round(st.rev * 1.12); st.energy -= 18; return "Retards i nits sense dormir: salves part de l'onada a costa de cremar-te."; } }
      ]
    },
    {
      id: "copycat", minQ: 4, maxQ: 15,
      tag: "COMPETÈNCIA",
      title: "Un competidor amb molt pressupost copia la teva proposta",
      body: "Llancen anuncis agressius amb preus rebentats per robar-te quota de mercat.",
      opts: [
        { k: "A", t: "Redoblar atenció propera, comunitat i detalls que un gegant no pot copiar", s: "Fidelitat alta · MRR +14% · Múltiple +0,4x", fn: function (st) { st.rev = Math.round(st.rev * 1.14); st.mult += 0.4; return "Els teus clients es queden pel tracte i l'excel·lència que els clons no tenen."; } },
        { k: "B", t: "Entrar en guerra publicitària gastant 10.000 € en anuncis", s: "Caixa -10.000 € · Resultat incert", fn: function (st, rng) { st.cash -= 10000; if (rng() < 0.45) { st.rev = Math.round(st.rev * 1.24); return "La campanya funciona i defenses el lideratge amb autoritat!"; } return "Cremes 10.000 € inflant el preu dels clics sense guanyar marge."; } },
        { k: "C", t: "Pivotar cap al segment prèmium d'alt tiquet", s: "MRR +18% · Cost -300 €/m", fn: function (st) { st.rev = Math.round(st.rev * 1.18); st.cost = Math.max(900, st.cost - 300); return "Els deixes barallar-se pel baix cost mentre tu captures la franja més rendible."; } }
      ]
    },
    {
      id: "hire_ops", minQ: 5, maxQ: 15, noFlag: "hasOps",
      tag: "DELEGACIÓ",
      title: "Ets el coll d'ampolla de totes les decisions diàries",
      body: "No pots desconnectar ni un cap de setmana sense que soni el telèfon. Pots fitxar una persona responsable d'operacions.",
      opts: [
        { k: "A", t: "Contractar perfil sènior d'operacions i documentar processos", s: "Cost +2.400 €/m · MRR +22% · Energia +20!", fn: function (st) { st.flags.hasOps = true; st.cost += 2400; st.rev = Math.round(st.rev * 1.22); st.energy += 20; st.mult += 0.5; return "La millor decisió de la teva vida: l'empresa per fi funciona sense dependre de tu cada hora!"; } },
        { k: "B", t: "Automatitzar amb programari i plantilles el 60% de tasques", s: "Caixa -2.200 € · Cost -250 €/m · Energia +10", fn: function (st) { st.cash -= 2200; st.cost = Math.max(800, st.cost - 250); st.energy += 10; return "Elimines feina repetitiva amb sistemes intel·ligents i respires molt millor."; } },
        { k: "C", t: "Ningú ho fa com jo: seguir controlant-ho personalment", s: "Cost 0 € · Energia -14", fn: function (st) { st.energy -= 14; return "Estalvies un sou, però et converteixes en presoner del teu propi negoci."; } }
      ]
    },
    {
      id: "early_exit_offer", minQ: 8, maxQ: 14, noFlag: "declinedExit",
      tag: "★ OFERTA DE COMPRA (M&A)",
      title: "Un grup industrial vol comprar la teva empresa avui!",
      body: "Després d'analitzar les teves xifres, posen sobre la taula una oferta ferma al comptat valorant tot el negoci amb prima.",
      opts: [
        { k: "A", t: "VENDRE L'EMPRESA ARA i ingressar el teu xec net al banc!", s: "Tanques l'etapa amb un Exit garantit avui mateix", fn: function (st) {
          var offerVal = Math.round(companyValuation(st) * 1.18);
          var myTake = Math.round(offerVal * (st.equity / 100) + Math.max(0, st.cash) * (st.equity / 100));
          st.flags.soldExit = true;
          st.exitPayout = myTake;
          st.status = "ended";
          return "Signes davant notari per una valoració de " + window.CalmUI.fmtEur(offerVal) + "!";
        } },
        { k: "B", t: "Rebutjar l'oferta: confies a duplicar el valor d'aquí a l'Any 4", s: "Moral d'equip als núvols · Múltiple +0,5x", fn: function (st) { st.flags.declinedExit = true; st.mult += 0.5; st.energy += 8; st.rev = Math.round(st.rev * 1.15); return "Dius «encara no» als compradors i redobles l'aposta per arribar molt més amunt!"; } },
        { k: "C", t: "Vendre només un 25% secundari per assegurar patrimoni personal", s: "Retires liquiditat personal i segueixes al timó", fn: function (st) {
          var cashOut = Math.round(companyValuation(st) * 0.25 * (st.equity / 100));
          st.personalBank = (st.personalBank || 0) + cashOut;
          st.equity = Math.round(st.equity * 0.75);
          st.flags.declinedExit = true;
          st.energy += 15;
          return "T'embutxaques " + window.CalmUI.fmtEur(cashOut) + " al teu compte personal i ara jugues sense por!";
        } }
      ]
    },
    {
      id: "bad_quarter_macro", minQ: 3, maxQ: 15,
      tag: "VENT EN CONTRA",
      title: "Frenada del consum i factures impagades",
      body: "Dos clients retarden pagaments i les noves altes s'alenteixen aquest trimestre.",
      opts: [
        { k: "A", t: "Oferir descompte del 10% per pagament anual avançat", s: "Injecció immediata de caixa (+2,5x MRR)", fn: function (st) { var boost = Math.round(st.rev * 2.4); st.cash += boost; return "Gran maniobra financera: cobres per avançat +" + window.CalmUI.fmtEur(boost) + " i blindes la caixa!"; } },
        { k: "B", t: "Retallar despeses supèrflues de programari i oficines (-18%)", s: "Cost mensual -18% · Negoci més àgil", fn: function (st) { st.cost = Math.max(800, Math.round(st.cost * 0.82)); return "Aprimes l'estructura sense acomiadar ningú i recuperes rendibilitat."; } },
        { k: "C", t: "Demanar pòlissa de crèdit per no tocar res", s: "Caixa +12k€ · Cost financer +380 €/m", fn: function (st) { st.cash += 12000; st.cost += 380; return "Guanyes temps amb crèdit bancari assumint interessos mensuals."; } }
      ]
    }
  ];

  function companyValuation(st) {
    var annualRev = st.rev * 12;
    var annualProfit = Math.max(0, (st.rev - st.cost) * 12);
    return Math.round(annualRev * st.mult + annualProfit * 2.5);
  }

  function founderNetValue(st) {
    if (st.flags && st.flags.soldExit) return (st.exitPayout || 0) + (st.personalBank || 0);
    var val = companyValuation(st) + Math.max(0, st.cash);
    return Math.round(val * (st.equity / 100)) + (st.personalBank || 0);
  }

  function createPicker() {
    return { choosingVenture: true };
  }

  function createVentureRun(vid) {
    var v = VENTURES[0];
    for (var i = 0; i < VENTURES.length; i++) {
      if (VENTURES[i].id === vid) v = VENTURES[i];
    }
    var st = {
      choosingVenture: false,
      seed: Math.floor(Math.random() * 899999) + 100000,
      q: 1, // Quarter 1..16
      ventureName: v.name,
      cash: v.cash,
      rev: v.rev,
      cost: v.cost,
      baseGrowth: v.growth,
      mult: v.mult,
      equity: 100,
      energy: 85,
      personalBank: 0,
      focus: "product", // product | sales | margin | rest
      tab: "accio", // accio | palanques | grafic
      flags: {},
      seen: {},
      curDilemmaId: null,
      lastOut: null,
      status: "playing",
      histVal: [Math.round((v.rev * 12 * v.mult + v.cash))],
      histCash: [v.cash],
      log: ["T1 · Arrenques «" + v.name + "» amb " + window.CalmUI.fmtEur(v.cash) + " a caixa."]
    };
    pickDilemma(st);
    return st;
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && (saved.choosingVenture || typeof saved.q === "number")) return saved;
    return createPicker();
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function pickDilemma(st) {
    var rng = window.CalmUI.seededRng(st.seed + st.q * 131);
    var cands = [];
    for (var i = 0; i < DILEMMAS.length; i++) {
      var d = DILEMMAS[i];
      if (st.seen[d.id]) continue;
      if (st.q < d.minQ || st.q > d.maxQ) continue;
      if (d.noFlag && st.flags[d.noFlag]) continue;
      if (d.id === "early_exit_offer" && st.rev > 6000) {
        cands.push(d); cands.push(d);
      } else {
        cands.push(d);
      }
    }
    if (cands.length === 0) {
      st.curDilemmaId = "proc_" + st.q;
      return;
    }
    st.curDilemmaId = cands[Math.floor(rng() * cands.length)].id;
  }

  function getDilemma(st) {
    for (var i = 0; i < DILEMMAS.length; i++) {
      if (DILEMMAS[i].id === st.curDilemmaId) return DILEMMAS[i];
    }
    return {
      id: st.curDilemmaId,
      tag: "EXECUCIÓ TRIMESTRAL",
      title: "Prioritat d'execució del Trimestre " + st.q,
      body: "L'equip espera direcció clara per als pròxims tres mesos. On concentres els recursos?",
      opts: [
        { k: "A", t: "Llançar millora clau demanada pels millors clients", s: "MRR +14% · Energia -4", fn: function (s) { s.rev = Math.round(s.rev * 1.14); s.energy -= 4; return "La retenció i el boca-orella impulsen la facturació un +14%."; } },
        { k: "B", t: "Optimitzar marges i repartir un petit dividend si hi ha excés", s: "Cost -8% · +Caixa", fn: function (s) { s.cost = Math.max(800, Math.round(s.cost * 0.92)); return "Millores la rendibilitat neta de cada euro venut."; } },
        { k: "C", t: "Setmana calmada de reflexió estratègica i descans d'equip", s: "Energia +15 · MRR +5%", fn: function (s) { s.energy += 15; s.rev = Math.round(s.rev * 1.05); return "Recarregueu piles i torneu amb idees molt més clares."; } }
      ]
    };
  }

  function stepQuarter(st, optIdx) {
    var rng = window.CalmUI.seededRng(st.seed + st.q * 409 + optIdx * 29);
    var dil = getDilemma(st);
    var opt = dil.opts[optIdx] || dil.opts[0];
    st.seen[dil.id] = true;

    var prevCash = st.cash;
    var prevRev = st.rev;

    // Apply strategic focus lever
    var qGrowth = st.baseGrowth * 0.45 + (rng() - 0.35) * 0.06;
    if (st.focus === "sales") {
      qGrowth += 0.08;
      st.cost = Math.round(st.cost * 1.04);
      st.energy -= 3;
    } else if (st.focus === "product") {
      qGrowth += 0.05;
      st.mult += 0.05;
    } else if (st.focus === "margin") {
      st.cost = Math.max(800, Math.round(st.cost * 0.94));
    } else if (st.focus === "rest") {
      qGrowth -= 0.02;
      st.energy += 10;
    }

    st.rev = Math.max(300, Math.round(st.rev * (1 + qGrowth)));

    // 3 months of operating cashflow
    var narrative = opt.fn(st, rng);
    if (st.status !== "ended") {
      st.cash += (st.rev - st.cost) * 3;
      st.q += 1;
    }

    st.energy = window.CalmUI.clamp(st.energy, 0, 100);
    st.histVal.push(founderNetValue(st));
    st.histCash.push(st.cash);

    st.log.unshift("T" + st.q + " · MRR " + window.CalmUI.fmtEur(st.rev) + " · Caixa " + window.CalmUI.fmtEur(st.cash));
    if (st.log.length > 6) st.log.pop();

    if (st.cash < 0 || st.energy <= 0 || st.q > 16 || st.status === "ended") {
      st.status = "ended";
      var myTotal = founderNetValue(st);
      var best = window.CalmStorage.get(BEST_KEY, { maxVal: 0 });
      if (myTotal > (best.maxVal || 0) && st.cash >= 0 && st.energy > 0) {
        best.maxVal = myTotal;
        window.CalmStorage.set(BEST_KEY, best);
      }
      st.lastOut = null;
      return;
    }

    st.lastOut = {
      title: dil.title,
      narrative: narrative,
      dCash: st.cash - prevCash,
      dRev: st.rev - prevRev
    };
    pickDilemma(st);
  }

  function buildFounderEnd(st) {
    if (st.cash < 0) {
      return {
        title: "Concurs de Creditors: t'has quedat sense Caixa",
        body: "Facturaves " + window.CalmUI.fmtEur(st.rev) + "/mes, però la tresoreria ha caigut sota zero (" + window.CalmUI.fmtEur(st.cash) + "). A les empreses no les mata la falta d'idees, sinó quedar-se sense efectiu." + (st.personalBank > 0 ? " Sort que vas retirar " + window.CalmUI.fmtEur(st.personalBank) + " a temps!" : "")
      };
    }
    if (st.energy <= 0) {
      return {
        title: "Burnout Sever del Fundador",
        body: "L'esgotament extrem t'ha obligat a malvendre i tancar portes. Cap negoci sostenible es construeix cremant la salut del qui porta el timó."
      };
    }
    var net = founderNetValue(st);
    if (st.flags.soldExit) {
      return {
        title: "★ Exit Triomfal Signat: +" + window.CalmUI.fmtEur(net) + " per a tu!",
        body: "Has sabut construir valor real i vendre en el moment oportú conservant el " + st.equity + "% de l'empresa. Hora de passar aquest capital als fons indexats i descansar!"
      };
    }
    var monthlyProfit = st.rev - st.cost;
    if (monthlyProfit >= 4000) {
      return {
        title: "★ Imperi Cash-Cow Rendible (" + window.CalmUI.fmtEur(net) + " de valor teu)",
        body: "Completes els 4 anys amb el " + st.equity + "% d'una màquina que genera +" + window.CalmUI.fmtEur(monthlyProfit) + "/mes de benefici net i " + window.CalmUI.fmtEur(st.cash) + " en caixa!"
      };
    }
    return {
      title: "Negoci Consolidat (" + window.CalmUI.fmtEur(net) + " de participació)",
      body: "Has sobreviscut als primers 4 anys —on cauen el 80% de projectes— amb caixa positiva (" + window.CalmUI.fmtEur(st.cash) + ") i facturant " + window.CalmUI.fmtEur(st.rev) + "/mes."
    };
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      if (st.choosingVenture) {
        var intro = document.createElement("div");
        intro.className = "scenario-card";
        intro.innerHTML =
          '<div class="scenario-kicker"><span>FUNDADOR DES DE ZERO</span><span>16 TRIMESTRES (4 ANYS)</span></div>' +
          '<h3 class="scenario-title">Quina empresa vols arrencar avui?</h3>' +
          '<p class="scenario-body">Gestiona caixa, marges, socis, inversors i la teva pròpia energia. Pots buscar un Exit milionari o crear una màquina de dividends sense diluir-te.</p>';
        wrap.appendChild(intro);

        var stck = document.createElement("div");
        stck.className = "choice-stack";
        VENTURES.forEach(function (v, idx) {
          var b = document.createElement("button");
          b.className = "choice-btn";
          b.innerHTML =
            '<span class="choice-key">' + (idx + 1) + "</span>" +
            '<div class="choice-content"><div class="choice-main">' + v.name + '</div><div class="choice-sub">' + v.sub + "</div></div>";
          b.onclick = function () {
            st = createVentureRun(v.id);
            saveState(st);
            redraw();
          };
          stck.appendChild(b);
        });
        wrap.appendChild(stck);
        container.appendChild(wrap);
        return;
      }

      var netBurn = st.rev - st.cost;
      var runwayTxt = netBurn >= 0 ? "Rendible ∞" : Math.max(0, Math.floor(st.cash / Math.abs(netBurn))) + " mesos";

      // 1. HUD
      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">TRIMESTRE</div>' +
          '<div class="hud-val">T' + Math.min(16, st.q) + '/16</div>' +
          '<div class="hud-label">' + runwayTxt + "</div>" +
        "</div>" +
        '<div class="hud-cell invert">' +
          '<div class="hud-label">CAIXA EMPRESA</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.cash) + "</div>" +
          '<div class="hud-label">Net ' + (netBurn >= 0 ? "+" : "") + window.CalmUI.fmtEur(netBurn) + "/m</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">FACTURACIÓ</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.rev) + '/m</div>' +
          '<div class="hud-label">Val: ' + window.CalmUI.fmtEur(companyValuation(st)) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">EQUITY · ENERGIA</div>' +
          '<div class="hud-val">' + st.equity + '% · ◈' + st.energy + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.energy + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // 2. Tabs
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "accio", label: "Decisió" },
        { id: "palanques", label: "Focus (" + st.focus.slice(0, 4).toUpperCase() + ")" },
        { id: "grafic", label: "Valoració" }
      ].forEach(function (tb) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.tab === tb.id ? " active" : "");
        b.textContent = tb.label;
        b.onclick = function () { st.tab = tb.id; saveState(st); redraw(); };
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      var btnNew = document.createElement("button");
      btnNew.className = "btn-sm";
      btnNew.textContent = "↻ Nova empresa";
      btnNew.onclick = function () {
        st = createPicker();
        saveState(st);
        redraw();
      };
      bar.appendChild(btnNew);
      wrap.appendChild(bar);

      // 3A. End Screen
      if (st.status === "ended" && st.tab === "accio") {
        var endInfo = buildFounderEnd(st);
        var ep = document.createElement("div");
        ep.className = "outcome-panel";
        ep.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>BALANÇ DE FUNDADOR · ' + st.ventureName.toUpperCase() + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + endInfo.title + "</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + endInfo.body + "</p>" +
          "</div>" +
          '<div class="chart-box">' +
            window.CalmUI.buildDualChartSVG(st.histVal, st.histCash, {
              height: 145,
              xStartLabel: "T1",
              xEndLabel: "Final (Sòlida: El teu valor · Punt.: Caixa)"
            }) +
          "</div>";

        var bAgn = document.createElement("button");
        bAgn.className = "btn-lg active";
        bAgn.style.width = "100%";
        bAgn.textContent = "Fundar un nou projecte des de zero →";
        bAgn.onclick = function () { st = createPicker(); saveState(st); redraw(); };
        ep.appendChild(bAgn);
        wrap.appendChild(ep);
        container.appendChild(wrap);
        return;
      }

      // 3B. TAB: PALANQUES
      if (st.tab === "palanques") {
        var fCard = document.createElement("div");
        fCard.className = "scenario-card";
        fCard.innerHTML =
          '<div class="scenario-kicker"><span>FOCUS OPERATIU TRIMESTRAL</span><span>EL TEU VALOR: ' + window.CalmUI.fmtEur(founderNetValue(st)) + "</span></div>" +
          '<p class="scenario-body">Tria on poses el pes operatiu de l\'empresa cada trimestre abans de resoldre els dilemes.</p>';
        wrap.appendChild(fCard);

        var flist = document.createElement("div");
        flist.className = "choice-stack";
        [
          { id: "product", k: "P", t: "Producte & Fidelització", s: "+5% creixement orgànic i millora el múltiple de valoració" },
          { id: "sales", k: "V", t: "Màrqueting & Vendes Agressives", s: "+8% vendes extra, però Cost +4% i Energia -3" },
          { id: "margin", k: "M", t: "Eficiència & Control de Costos", s: "Redueix costos mensuals un -6% per allargar el Runway" },
          { id: "rest", k: "C", t: "Cultura Calma & Recuperació", s: "Recupera +10 d'Energia per evitar el Burnout" }
        ].forEach(function (fc) {
          var b = document.createElement("button");
          b.className = "choice-btn" + (st.focus === fc.id ? " active" : "");
          b.innerHTML =
            '<span class="choice-key">' + fc.k + "</span>" +
            '<div class="choice-content"><div class="choice-main">' + fc.t + '</div><div class="choice-sub">' + fc.s + "</div></div>";
          b.onclick = function () {
            st.focus = fc.id;
            st.tab = "accio";
            saveState(st);
            redraw();
          };
          flist.appendChild(b);
        });
        wrap.appendChild(flist);
        container.appendChild(wrap);
        return;
      }

      // 3C. TAB: GRÀFIC
      if (st.tab === "grafic") {
        var cb = document.createElement("div");
        cb.className = "chart-box";
        cb.innerHTML =
          '<div class="scenario-kicker" style="margin-bottom:4px;"><span>EL TEU PATRIMONI EN ACCIONS (SÒLIDA) VS CAIXA (PUNT.)</span></div>' +
          window.CalmUI.buildDualChartSVG(st.histVal, st.histCash, {
            height: 165,
            xStartLabel: "T1",
            xEndLabel: "T" + st.q
          });
        wrap.appendChild(cb);

        var lb = document.createElement("div");
        lb.className = "log-list";
        st.log.forEach(function (it) {
          var d = document.createElement("div");
          d.className = "log-item";
          d.textContent = it;
          lb.appendChild(d);
        });
        wrap.appendChild(lb);
        container.appendChild(wrap);
        return;
      }

      // 3D. Active Dilemma or Quarter Outcome
      if (st.lastOut) {
        var o = st.lastOut;
        var op = document.createElement("div");
        op.className = "outcome-panel";
        op.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>TANCAMENT TRIMESTRAL</span><span>EL TEU VALOR: ' + window.CalmUI.fmtEur(founderNetValue(st)) + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + o.title + "</h3>" +
            '<p class="scenario-body" style="margin-top:6px;">' + o.narrative + "</p>" +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">Caixa ' + (o.dCash >= 0 ? "+" : "") + window.CalmUI.fmtEur(o.dCash) + "</span>" +
            '<span class="delta-pill">Facturació ' + (o.dRev >= 0 ? "+" : "") + window.CalmUI.fmtEur(o.dRev) + "/m</span>" +
            '<span class="delta-pill">Energia ⚡' + st.energy + "</span>" +
          "</div>";

        var bCont = document.createElement("button");
        bCont.className = "btn-lg active";
        bCont.style.width = "100%";
        bCont.textContent = "Entrar al Trimestre " + st.q + " →";
        bCont.onclick = function () { st.lastOut = null; saveState(st); redraw(); };
        op.appendChild(bCont);
        wrap.appendChild(op);
        container.appendChild(wrap);
        return;
      }

      var dil = getDilemma(st);
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>' + dil.tag + " · " + st.ventureName.toUpperCase() + '</span><span>COSTOS: ' + window.CalmUI.fmtEur(st.cost) + "/m</span></div>" +
        '<h3 class="scenario-title">' + dil.title + "</h3>" +
        '<p class="scenario-body">' + dil.body + "</p>";
      wrap.appendChild(card);

      var ch = document.createElement("div");
      ch.className = "choice-stack";
      dil.opts.forEach(function (opItem, idx) {
        var b = document.createElement("button");
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + opItem.k + "</span>" +
          '<div class="choice-content"><div class="choice-main">' + opItem.t + '</div><div class="choice-sub">' + opItem.s + "</div></div>";
        b.onclick = function () {
          stepQuarter(st, idx);
          saveState(st);
          redraw();
        };
        ch.appendChild(b);
      });
      wrap.appendChild(ch);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    if (!st.choosingVenture && st.status === "playing") {
      return "T" + st.q + " · MRR " + window.CalmUI.fmtEur(st.rev);
    }
    var best = window.CalmStorage.get(BEST_KEY, null);
    if (best && best.maxVal > 0) return "Exit " + window.CalmUI.fmtEur(best.maxVal);
    return "Startup · Exit";
  }

  window.CalmGames.fundador = {
    id: "fundador",
    title: "Fundador des de Zero",
    desc: "Crea, escala o ven una empresa gestionant caixa, socis, rondes i energia.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Fundador des de Zero · Guia E-Ink</h2>" +
      "<ul>" +
      "<li> esculls un model de negoci i el gestiones durant <b>16 trimestres (4 anys)</b>.</li>" +
      "<li><b>Regla número 1:</b> que la <b>Caixa</b> no caigui mai sota 0 € i que l'<b>Energia (⚡)</b> no arribi a 0!</li>" +
      "<li>A la pestanya <b>Focus</b> pots alternar entre Producte, Vendes, Eficiència o Recuperació segons el que necessiti el negoci.</li>" +
      "</ul>"
  };
})();
