// Joc 2: El Joc dels Decennis v6 (8 Campanyes de 40 Anys, 6 Actius, Poder Real i Psicologia Financera)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "decennis_state_v6";
  var META_KEY = "decennis_meta_v6";
  var TOTAL_TURNS = 20; // 20 biennis = 40 anys

  function getData() {
    return (window.CalmData && window.CalmData.decennis) || {
      ASSETS: [],
      PRESETS: [],
      CAMPAIGNS: [],
      BADGES: [],
      BULLETINS: []
    };
  }

  function cloneAlloc(src) {
    return {
      eqGlobal: src.eqGlobal || 0,
      eqGrowth: src.eqGrowth || 0,
      bondShort: src.bondShort || 0,
      bondLong: src.bondLong || 0,
      realAssets: src.realAssets || 0,
      gold: src.gold || 0
    };
  }

  function loadMeta() {
    var m = window.CalmStorage.get(META_KEY, null);
    if (!m || typeof m !== "object") {
      m = { medals: {}, badges: {}, bestCap: 0, bestAlpha: 0, totalRuns: 0 };
    }
    m.medals = m.medals || {};
    m.badges = m.badges || {};
    m.bestCap = m.bestCap || 0;
    m.bestAlpha = m.bestAlpha || 0;
    m.totalRuns = m.totalRuns || 0;
    return m;
  }

  function saveMeta(m) {
    window.CalmStorage.set(META_KEY, m);
  }

  function getCampaignById(campId) {
    var camps = getData().CAMPAIGNS;
    for (var i = 0; i < camps.length; i++) {
      if (camps[i].id === campId) return camps[i];
    }
    return camps[0];
  }

  function getBulletinById(id) {
    var list = getData().BULLETINS;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return list[0];
  }

  // Build a coherent 20-biennium (40-year) sequence without repeating bulletins
  function generateCampaignSequence(seed, camp) {
    var D = getData();
    var rng = window.CalmUI.seededRng(seed);
    var byPhase = {};
    var i;
    for (i = 0; i < D.BULLETINS.length; i++) {
      var b = D.BULLETINS[i];
      if (!byPhase[b.phase]) byPhase[b.phase] = [];
      byPhase[b.phase].push(b.id);
    }
    // Deterministic shuffle inside each phase bucket
    var phases = Object.keys(byPhase);
    for (var p = 0; p < phases.length; p++) {
      var arr = byPhase[phases[p]];
      for (i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
    }

    var used = {};
    var seq = [];
    var prevPhase = "mid";
    var baseWeights = camp.weights || { mid: 3, boom: 2, crash: 2, recovery: 2 };

    for (var t = 0; t < TOTAL_TURNS; t++) {
      // Dynamic cycle transitions layered on campaign weights
      var wMap = {};
      var phList = Object.keys(baseWeights);
      for (i = 0; i < phList.length; i++) {
        var ph = phList[i];
        var w = baseWeights[ph];
        if (t === 0 && camp.id === "hivern_deflacio" && ph === "mania") w += 6;
        if (t === 0 && camp.id === "estagflacio" && ph === "stagflation") w += 5;
        if (prevPhase === "mania" && (ph === "crash" || ph === "rate_peak")) w *= 2.4;
        if (prevPhase === "crash" && (ph === "recovery" || ph === "zirp")) w *= 2.5;
        if (prevPhase === "stagflation" && ph === "rate_peak") w *= 2.2;
        if (prevPhase === "rate_peak" && ph === "recovery") w *= 2.2;
        if (ph === prevPhase && ph === "crash") w *= 0.45; // avoid 4 crashes in a row
        // Check remaining unused bulletins in this phase
        var availCount = 0;
        var bucket = byPhase[ph] || [];
        for (var k = 0; k < bucket.length; k++) {
          if (!used[bucket[k]]) availCount++;
        }
        wMap[ph] = availCount > 0 ? w : 0;
      }

      var totalW = 0;
      for (i = 0; i < phList.length; i++) totalW += wMap[phList[i]] || 0;

      var chosenPhase = null;
      if (totalW > 0) {
        var roll = rng() * totalW;
        var acc = 0;
        for (i = 0; i < phList.length; i++) {
          acc += wMap[phList[i]] || 0;
          if (roll <= acc) {
            chosenPhase = phList[i];
            break;
          }
        }
      }

      var pickedId = null;
      if (chosenPhase && byPhase[chosenPhase]) {
        for (i = 0; i < byPhase[chosenPhase].length; i++) {
          var cand = byPhase[chosenPhase][i];
          if (!used[cand]) {
            pickedId = cand;
            break;
          }
        }
      }
      // Fallback to any unused bulletin
      if (!pickedId) {
        for (i = 0; i < D.BULLETINS.length; i++) {
          if (!used[D.BULLETINS[i].id]) {
            pickedId = D.BULLETINS[i].id;
            chosenPhase = D.BULLETINS[i].phase;
            break;
          }
        }
      }
      if (!pickedId) pickedId = D.BULLETINS[t % D.BULLETINS.length].id;

      used[pickedId] = true;
      prevPhase = chosenPhase || "mid";
      seq.push(pickedId);
    }

    return seq;
  }

  function createNewGame(campId) {
    var D = getData();
    var camp = getCampaignById(campId || "cicle_complet");
    var seed = Math.floor(Math.random() * 899999) + 100000;
    var seqIds = generateCampaignSequence(seed, camp);
    var defaultAlloc = D.PRESETS && D.PRESETS[2]
      ? cloneAlloc(D.PRESETS[2].alloc)
      : { eqGlobal: 30, eqGrowth: 10, bondShort: 10, bondLong: 20, realAssets: 15, gold: 15 };

    return {
      v: 6,
      seed: seed,
      campaignId: camp.id,
      turn: 0, // 0..19 (each turn = 2 years -> 40 years)
      capital: camp.startCap,
      bench: camp.startCap,
      realCap: camp.startCap,
      cpiIndex: 1.0,
      totalContrib: camp.startCap,
      totalWithdrawn: 0,
      prevCape: camp.startMacro ? camp.startMacro.cape : 18,
      alloc: defaultAlloc,
      tab: "mercat",       // mercat | cartera | corba | campanyes
      allocPage: 0,
      corbaMode: "nom",    // nom | real
      campSub: "camps",    // camps | badges
      campPage: 0,
      badgePage: 0,
      seqIds: seqIds,
      biases: { cool: 0, fomo: 0, panic: 0 },
      goodPicks: 0,
      lastReport: null,
      newBadges: [],
      status: "playing",   // playing | ended | ruined
      histCap: [camp.startCap],
      histBench: [camp.startCap],
      histReal: [camp.startCap],
      log: [
        "Any 0 · «" + camp.name + "» iniciada amb " + window.CalmUI.fmtEur(camp.startCap) + "."
      ]
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.v === 6 && saved.seqIds && saved.alloc && typeof saved.capital === "number") {
      return saved;
    }
    return createNewGame("cicle_complet");
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function adjustAlloc(st, key, delta) {
    var cur = st.alloc[key] || 0;
    var next = window.CalmUI.clamp(cur + delta, 0, 100);
    var diff = next - cur;
    if (diff === 0) return;

    var order = ["bondShort", "bondLong", "eqGlobal", "realAssets", "gold", "eqGrowth"];
    for (var i = 0; i < order.length && diff !== 0; i++) {
      var ok = order[i];
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

  function allocSummaryShort(a) {
    var eq = (a.eqGlobal || 0) + (a.eqGrowth || 0);
    var fi = (a.bondShort || 0) + (a.bondLong || 0);
    var rl = (a.realAssets || 0) + (a.gold || 0);
    return eq + "% RV · " + fi + "% RF · " + rl + "% Reals";
  }

  // Deterministic shuffle so 'good' is not always Option B
  function getTurnChoices(st, sc, camp) {
    var swap = ((st.seed + st.turn * 37) % 2) === 1;
    var opt1 = swap ? sc.trap : sc.good;
    var opt2 = swap ? sc.good : sc.trap;
    var kind1 = swap ? "trap" : "good";
    var kind2 = swap ? "good" : "trap";
    var blind = !!camp.blindHints;

    return [
      {
        key: "A",
        kind: "hold",
        label: "Executar el meu pla (" + allocSummaryShort(st.alloc) + ") i reequilibrar sense soroll",
        sub: blind
          ? "Opció sistemàtica · Sense pistes en Mode Mestre"
          : "Disciplina sistemàtica · Pots ajustar els 6 actius a «Cartera»"
      },
      {
        key: "B",
        kind: kind1,
        data: opt1,
        label: opt1.label,
        sub: blind
          ? "Maniobra tàctica · Avalua CAPE, tipus i inflació pel teu compte"
          : (kind1 === "good" ? "Maniobra basada en valoracions i balanços" : "Reacció guiada pel titular i el consens calent")
      },
      {
        key: "C",
        kind: kind2,
        data: opt2,
        label: opt2.label,
        sub: blind
          ? "Maniobra tàctica · Avalua CAPE, tipus i inflació pel teu compte"
          : (kind2 === "good" ? "Maniobra basada en valoracions i balanços" : "Reacció guiada pel titular i el consens calent")
      }
    ];
  }

  function evaluateEndBadges(st, camp, meta) {
    var newly = [];
    function grant(id) {
      if (!meta.badges[id]) {
        meta.badges[id] = true;
        newly.push(id);
      }
    }

    var alpha = st.capital - st.bench;
    if (st.status === "ended") {
      grant("first_40y");
      if (alpha > 0) grant("beat_bench");
      if (alpha >= 250000) grant("alpha_250k");
      if (st.biases.fomo === 0) grant("zero_fomo");
      if (st.biases.panic === 0) grant("zero_panic");
      if (st.biases.fomo === 0 && st.biases.panic === 0 && alpha > 0) grant("perfect_mind");
      if (st.capital >= 1000000) grant("millionaire");
      if (st.capital >= 2000000) grant("two_million");
      if (st.realCap >= camp.startCap * 3 && camp.biContrib === 0) grant("real_double");

      if (camp.id === "estagflacio" && alpha > 0 && st.realCap > camp.startCap) grant("stag_winner");
      if (camp.id === "bombolles_tech" && alpha > 0) grant("bubble_surfer");
      if (camp.id === "jubilat_swr" && st.capital >= 600000) grant("retiree_safe");
      if (camp.id === "acumulador_dca" && st.capital >= 1000000) grant("dca_million");
      if (camp.id === "hivern_deflacio" && st.capital >= camp.startCap * 3) grant("tokyo_survivor");
      if (camp.id === "mestre_cec" && alpha > 0) grant("blind_master");

      var prevMedal = meta.medals[camp.id] || 0;
      var newMedal = (alpha >= 0 && st.capital > 0) ? 2 : 1;
      if (newMedal > prevMedal) meta.medals[camp.id] = newMedal;

      var allCamps = getData().CAMPAIGNS;
      var completedCount = 0;
      for (var i = 0; i < allCamps.length; i++) {
        if ((meta.medals[allCamps[i].id] || 0) >= 1) completedCount++;
      }
      if (completedCount >= 8) grant("all_8_camps");
    }

    meta.totalRuns = (meta.totalRuns || 0) + 1;
    if (st.capital > (meta.bestCap || 0)) meta.bestCap = st.capital;
    if (alpha > (meta.bestAlpha || 0)) meta.bestAlpha = alpha;
    saveMeta(meta);
    return newly;
  }

  function executeBiennium(st, choiceObj) {
    if (st.status !== "playing") return;
    var camp = getCampaignById(st.campaignId);
    var sc = getBulletinById(st.seqIds[st.turn]);

    // Mean-reverting valuation modifier from previous CAPE
    var valAdjGlobal = 0;
    var valAdjGrowth = 0;
    if (st.prevCape <= 13) {
      valAdjGlobal = 0.025;
      valAdjGrowth = 0.03;
    } else if (st.prevCape >= 34) {
      valAdjGlobal = -0.015;
      valAdjGrowth = -0.035;
    }

    var rGlob = sc.ret.eqGlobal + valAdjGlobal;
    var rGrow = sc.ret.eqGrowth + valAdjGrowth;
    var rBSh  = sc.ret.bondShort;
    var rBLg  = sc.ret.bondLong;
    var rReal = sc.ret.realAssets;
    var rGold = sc.ret.gold;

    var a = st.alloc;
    var baseRet =
      (a.eqGlobal / 100) * rGlob +
      (a.eqGrowth / 100) * rGrow +
      (a.bondShort / 100) * rBSh +
      (a.bondLong / 100) * rBLg +
      (a.realAssets / 100) * rReal +
      (a.gold / 100) * rGold;

    // Benchmark 60/40 Global (40% eqGlobal, 20% eqGrowth, 20% bondShort, 20% bondLong)
    var benchRet = 0.40 * rGlob + 0.20 * rGrow + 0.20 * rBSh + 0.20 * rBLg;

    var bonus = 0;
    var note = "Executes el teu pla i reequilibres els 6 actius sense deixar-te arrossegar pel soroll.";
    if (choiceObj.kind === "good" || choiceObj.kind === "trap") {
      bonus = choiceObj.data.bonus;
      var biasKey = choiceObj.data.bias || "cool";
      st.biases[biasKey] = (st.biases[biasKey] || 0) + 1;
      if (choiceObj.kind === "good") st.goodPicks = (st.goodPicks || 0) + 1;
      note = choiceObj.data.note;
    } else {
      st.biases.cool = (st.biases.cool || 0) + 1;
    }

    var totalRet = window.CalmUI.clamp(baseRet + bonus, -0.70, 1.25);

    // Biennial inflation compounding
    var annInf = sc.inf / 100;
    var biInfFactor = Math.max(0.96, (1 + annInf) * (1 + annInf));
    st.cpiIndex = st.cpiIndex * biInfFactor;

    var prevCap = st.capital;
    var grownCap = Math.round(st.capital * (1 + totalRet));
    var grownBench = Math.round(st.bench * (1 + benchRet));

    var cashflowText = "";
    if (camp.biContrib > 0) {
      var addAmt = Math.round(camp.biContrib * Math.min(2.5, Math.sqrt(st.cpiIndex)));
      grownCap += addAmt;
      grownBench += addAmt;
      st.totalContrib += addAmt;
      cashflowText = "Aportació DCA biennal: +" + window.CalmUI.fmtEur(addAmt);
    } else if (camp.biWithdraw > 0) {
      var wAmt = Math.round(camp.biWithdraw * st.cpiIndex);
      grownCap -= wAmt;
      grownBench = Math.max(0, grownBench - wAmt);
      st.totalWithdrawn += wAmt;
      cashflowText = "Retirada de jubilació (+IPC): -" + window.CalmUI.fmtEur(wAmt);
    }

    st.capital = Math.max(0, grownCap);
    st.bench = Math.max(0, grownBench);
    st.realCap = Math.round(st.capital / st.cpiIndex);
    st.prevCape = sc.cape;
    st.turn += 1;

    st.histCap.push(st.capital);
    st.histBench.push(st.bench);
    st.histReal.push(st.realCap);

    var yrs = st.turn * 2;
    st.log.unshift(
      "Any " + yrs + " · " + window.CalmUI.fmtPct(totalRet * 100) +
      " → " + window.CalmUI.fmtEur(st.capital) +
      " (Real " + window.CalmUI.fmtEur(st.realCap) + " · Índex " + window.CalmUI.fmtEur(st.bench) + ")"
    );
    if (st.log.length > 7) st.log.pop();

    // Check retiree ruin before 40 years
    if (camp.biWithdraw > 0 && st.capital <= 0 && st.turn < TOTAL_TURNS) {
      st.status = "ruined";
      var metaR = loadMeta();
      st.newBadges = evaluateEndBadges(st, camp, metaR);
      st.lastReport = null;
      return;
    }

    if (st.turn >= TOTAL_TURNS) {
      st.status = "ended";
      var metaE = loadMeta();
      st.newBadges = evaluateEndBadges(st, camp, metaE);
      st.lastReport = null;
      return;
    }

    st.lastReport = {
      yrsFrom: yrs - 2,
      yrsTo: yrs,
      userPct: Math.round(totalRet * 100),
      benchPct: Math.round(benchRet * 100),
      infBiennialPct: Math.round((biInfFactor - 1) * 100),
      deltaEur: st.capital - prevCap,
      cashflowText: cashflowText,
      note: note,
      lesson: sc.lesson,
      rGlob: Math.round(rGlob * 100),
      rGrow: Math.round(rGrow * 100),
      rBond: Math.round((0.5 * rBSh + 0.5 * rBLg) * 100),
      rGold: Math.round(rGold * 100)
    };
  }

  function investorDiagnosis(st, camp) {
    if (st.status === "ruined") {
      return {
        title: "✕ Cartera Esgotada a l'Any " + (st.turn * 2) + " (Risc de Seqüència)",
        desc: "Les caigudes combinades amb les retirades ajustades a la inflació han buidat el capital abans dels 40 anys. Mantenir lletres curtes i or per no malvendre accions en ple crac és vital al jubilar-se!"
      };
    }
    var alpha = st.capital - st.bench;
    if (alpha >= 150000 && st.biases.fomo === 0 && st.biases.panic === 0) {
      return {
        title: "★★ Ment Contrària Magistral (Alfa +" + window.CalmUI.fmtEur(alpha) + ")",
        desc: "40 anys impecables amb 0 errors de FOMO i 0 pànic. Has comprat sang freda i has podat bombolles. Poder real final: " + window.CalmUI.fmtEur(st.realCap) + "."
      };
    }
    if (alpha >= 0) {
      return {
        title: "★★ Estrateg dels Cicles (Alfa +" + window.CalmUI.fmtEur(alpha) + ")",
        desc: "Has superat l'Índex Passiu 60/40 al llarg de quatre dècades completes. Capital real descomptada la inflació: " + window.CalmUI.fmtEur(st.realCap) + "."
      };
    }
    if (st.biases.fomo >= st.biases.panic && st.biases.fomo >= 2) {
      return {
        title: "★ Víctima dels Cants de Sirena (" + window.CalmUI.fmtEur(alpha) + " vs 60/40)",
        desc: "Has acabat els 40 anys, però perseguir titulars calents (" + st.biases.fomo + " cops de FOMO) t'ha restat rendibilitat davant l'índex passiu."
      };
    }
    if (st.biases.panic >= 2) {
      return {
        title: "★ Refugiat del Pànic (" + window.CalmUI.fmtEur(alpha) + " vs 60/40)",
        desc: "Vendre o amagar-te quan els titulars feien por (" + st.biases.panic + " cops) t'ha fet perdre els millors rebots del cicle de 40 anys."
      };
    }
    return {
      title: "★ Supervivent de 40 Anys (" + window.CalmUI.fmtEur(alpha) + " vs 60/40)",
      desc: "Has tancat «" + camp.name + "» amb " + window.CalmUI.fmtEur(st.capital) + " nominals (" + window.CalmUI.fmtEur(st.realCap) + " reals), molt a prop de l'índex automàtic."
    };
  }

  function render(container) {
    var st = loadState();
    var D = getData();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      var camp = getCampaignById(st.campaignId);
      var yrs = st.turn * 2;
      var alpha = st.capital - st.bench;
      var meta = loadMeta();

      // 1. HUD (4 cells)
      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">CAMPANYA #' + camp.num + "</div>" +
          '<div class="hud-val">Any ' + yrs + "/40</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + Math.round((yrs / 40) * 100) + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell invert">' +
          '<div class="hud-label">CAPITAL NOMINAL</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.capital) + "</div>" +
          '<div class="hud-label">Real: ' + window.CalmUI.fmtEur(st.realCap) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">ÍNDEX 60/40</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.bench) + "</div>" +
          '<div class="hud-label">IPC acum: ×' + st.cpiIndex.toFixed(2).replace(".", ",") + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">ALFA GENERAT</div>' +
          '<div class="hud-val">' + (alpha >= 0 ? "+" : "") + window.CalmUI.fmtEur(alpha) + "</div>" +
          '<div class="hud-label">Fredor: ' + st.biases.cool + "</div>" +
        "</div>";
      wrap.appendChild(hud);

      // 2. Top Toolbar (4 concise tabs + restart)
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "mercat", label: "Butlletí" },
        { id: "cartera", label: "Cartera" },
        { id: "corba", label: "Corba" },
        { id: "campanyes", label: "Campanyes" }
      ].forEach(function (tb) {
        var b = window.CalmUI.mkBtn("btn-sm" + (st.tab === tb.id ? " active" : ""), tb.label, function () {
          st.tab = tb.id;
          saveState(st);
          redraw();
        });
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      var btnReset = window.CalmUI.mkBtn("btn-sm", "↻", function () {
        st = createNewGame(st.campaignId);
        saveState(st);
        redraw();
      });
      btnReset.title = "Reiniciar campanya actual";
      bar.appendChild(btnReset);
      wrap.appendChild(bar);

      // =====================================================
      // TAB 4: CAMPANYES & INSÍGNIES
      // =====================================================
      if (st.tab === "campanyes") {
        var doneCount = 0;
        for (var cIdx = 0; cIdx < D.CAMPAIGNS.length; cIdx++) {
          if ((meta.medals[D.CAMPAIGNS[cIdx].id] || 0) >= 1) doneCount++;
        }
        var unlockedBadges = Object.keys(meta.badges).length;

        var subRow = document.createElement("div");
        subRow.className = "subtabs-row";
        subRow.appendChild(window.CalmUI.mkBtn(
          "pill-btn" + (st.campSub === "camps" ? " active" : ""),
          "8 Campanyes (" + doneCount + "/8)",
          function () { st.campSub = "camps"; saveState(st); redraw(); }
        ));
        subRow.appendChild(window.CalmUI.mkBtn(
          "pill-btn" + (st.campSub === "badges" ? " active" : ""),
          "16 Insígnies (" + unlockedBadges + "/16)",
          function () { st.campSub = "badges"; saveState(st); redraw(); }
        ));
        wrap.appendChild(subRow);

        if (st.campSub === "badges") {
          var bpInfo = window.CalmUI.slicePage(D.BADGES, st.badgePage, 6);
          st.badgePage = bpInfo.page;
          var bGrid = document.createElement("div");
          bGrid.className = "badge-grid";
          bpInfo.items.forEach(function (bg) {
            var has = !!meta.badges[bg.id];
            var bc = document.createElement("div");
            bc.className = "badge-card" + (has ? " unlocked" : "");
            bc.innerHTML =
              '<div class="badge-card-title">' + (has ? "★ " : "☆ ") + bg.title + "</div>" +
              '<div class="badge-card-desc">' + bg.desc + "</div>";
            bGrid.appendChild(bc);
          });
          wrap.appendChild(bGrid);
          wrap.appendChild(window.CalmUI.renderPager(bpInfo, function (np) {
            st.badgePage = np;
            saveState(st);
            redraw();
          }));
          container.appendChild(wrap);
          return;
        }

        var cpInfo = window.CalmUI.slicePage(D.CAMPAIGNS, st.campPage, 3);
        st.campPage = cpInfo.page;
        var cList = document.createElement("div");
        cList.className = "item-list";
        cpInfo.items.forEach(function (cp) {
          var medal = meta.medals[cp.id] || 0;
          var medalStr = medal === 2 ? "★★" : (medal === 1 ? "★☆" : "☆☆");
          var isCur = cp.id === st.campaignId;
          var row = document.createElement("div");
          row.className = "item-row" + (isCur ? " owned" : "");
          var main = document.createElement("div");
          main.className = "item-row-main";
          main.innerHTML =
            '<div class="item-row-title">' + medalStr + " #" + cp.num + " · " + cp.name + "</div>" +
            '<div class="item-row-sub">' + cp.sub + "</div>" +
            '<div class="item-row-sub">' + cp.desc + "</div>";
          row.appendChild(main);

          var acts = document.createElement("div");
          acts.className = "item-row-actions";
          var bPlay = window.CalmUI.mkBtn("btn-sm" + (isCur ? " active" : ""), isCur ? "En curs" : "Jugar", function () {
            st = createNewGame(cp.id);
            saveState(st);
            redraw();
          });
          acts.appendChild(bPlay);
          row.appendChild(acts);
          cList.appendChild(row);
        });
        wrap.appendChild(cList);
        wrap.appendChild(window.CalmUI.renderPager(cpInfo, function (np) {
          st.campPage = np;
          saveState(st);
          redraw();
        }));
        container.appendChild(wrap);
        return;
      }

      // =====================================================
      // TAB 2: CARTERA (4 Presets + 6 Assets Paginated 3/page)
      // =====================================================
      if (st.tab === "cartera") {
        var pRow = document.createElement("div");
        pRow.className = "subtabs-row";
        D.PRESETS.forEach(function (pr) {
          pRow.appendChild(window.CalmUI.mkBtn("pill-btn", pr.label, function () {
            st.alloc = cloneAlloc(pr.alloc);
            saveState(st);
            redraw();
          }));
        });
        wrap.appendChild(pRow);

        var sumBanner = document.createElement("div");
        sumBanner.className = "context-banner";
        sumBanner.innerHTML =
          "<span><b>" + allocSummaryShort(st.alloc) + "</b></span>" +
          "<span>G:" + st.alloc.eqGlobal + " T:" + st.alloc.eqGrowth +
          " C:" + st.alloc.bondShort + " L:" + st.alloc.bondLong +
          " I:" + st.alloc.realAssets + " O:" + st.alloc.gold + "</span>";
        wrap.appendChild(sumBanner);

        var apInfo = window.CalmUI.slicePage(D.ASSETS, st.allocPage, 3);
        st.allocPage = apInfo.page;
        var aList = document.createElement("div");
        aList.className = "alloc-list";
        apInfo.items.forEach(function (as) {
          var row = document.createElement("div");
          row.className = "alloc-row";
          row.innerHTML =
            '<div class="alloc-info"><div class="alloc-name">' + as.name + '</div><div class="alloc-meta">' + as.meta + "</div></div>";
          var ctrls = document.createElement("div");
          ctrls.className = "alloc-controls";

          ctrls.appendChild(window.CalmUI.mkBtn("btn-sm", "−10%", function () {
            adjustAlloc(st, as.k, -10);
            saveState(st);
            redraw();
          }));
          var sp = document.createElement("span");
          sp.className = "alloc-pct";
          sp.textContent = (st.alloc[as.k] || 0) + "%";
          ctrls.appendChild(sp);
          ctrls.appendChild(window.CalmUI.mkBtn("btn-sm", "+10%", function () {
            adjustAlloc(st, as.k, 10);
            saveState(st);
            redraw();
          }));

          row.appendChild(ctrls);
          aList.appendChild(row);
        });
        wrap.appendChild(aList);

        wrap.appendChild(window.CalmUI.renderPager(apInfo, function (np) {
          st.allocPage = np;
          saveState(st);
          redraw();
        }));

        var btnBack = window.CalmUI.mkBtn("btn-lg active", "Desar pesos i tornar al Butlletí →", function () {
          st.tab = "mercat";
          saveState(st);
          redraw();
        });
        btnBack.style.width = "100%";
        wrap.appendChild(btnBack);
        container.appendChild(wrap);
        return;
      }

      // =====================================================
      // TAB 3: CORBA 40 ANYS (Nominal vs 60/40 OR Poder Real)
      // =====================================================
      if (st.tab === "corba") {
        var mRow = document.createElement("div");
        mRow.className = "subtabs-row";
        mRow.appendChild(window.CalmUI.mkBtn(
          "pill-btn" + (st.corbaMode === "nom" ? " active" : ""),
          "Nominal vs Índex 60/40",
          function () { st.corbaMode = "nom"; saveState(st); redraw(); }
        ));
        mRow.appendChild(window.CalmUI.mkBtn(
          "pill-btn" + (st.corbaMode === "real" ? " active" : ""),
          "Poder Real (€ Any 0)",
          function () { st.corbaMode = "real"; saveState(st); redraw(); }
        ));
        wrap.appendChild(mRow);

        var cbox = document.createElement("div");
        cbox.className = "chart-box";
        if (st.corbaMode === "real") {
          cbox.innerHTML =
            '<div class="scenario-kicker" style="margin-bottom:4px;"><span>PODER REAL DESCOMPTADA LA INFLACIÓ (SÒLIDA) VS NOMINAL (PUNT.)</span></div>' +
            window.CalmUI.buildDualChartSVG(st.histReal, st.histCap, {
              height: 155,
              xStartLabel: "Any 0",
              xEndLabel: "Any " + yrs
            });
        } else {
          cbox.innerHTML =
            '<div class="scenario-kicker" style="margin-bottom:4px;"><span>EL TEU CAPITAL (SÒLIDA) VS ÍNDEX 60/40 (PUNT.)</span></div>' +
            window.CalmUI.buildDualChartSVG(st.histCap, st.histBench, {
              height: 155,
              xStartLabel: "Any 0",
              xEndLabel: "Any " + yrs
            });
        }
        wrap.appendChild(cbox);

        var lbox = document.createElement("div");
        lbox.className = "log-list";
        st.log.slice(0, 5).forEach(function (l) {
          var item = document.createElement("div");
          item.className = "log-item";
          item.textContent = l;
          lbox.appendChild(item);
        });
        wrap.appendChild(lbox);
        container.appendChild(wrap);
        return;
      }

      // =====================================================
      // TAB 1: BUTLLETÍ (End Screen, Biennial Report, or Active Turn)
      // =====================================================
      if (st.status === "ended" || st.status === "ruined") {
        var diag = investorDiagnosis(st, camp);
        var endPanel = document.createElement("div");
        endPanel.className = "outcome-panel";

        var badgeNote = "";
        if (st.newBadges && st.newBadges.length > 0) {
          badgeNote = '<div class="delta-pills"><span class="delta-pill strong">+' + st.newBadges.length + " Insígnia desbloquejada!</span>" +
            '<span class="delta-pill">FOMO: ' + st.biases.fomo + " · Pànic: " + st.biases.panic + "</span></div>";
        } else {
          badgeNote = '<div class="delta-pills"><span class="delta-pill">FOMO: ' + st.biases.fomo + "</span>" +
            '<span class="delta-pill">Pànic: ' + st.biases.panic + "</span>" +
            '<span class="delta-pill">Encerts tàctics: ' + (st.goodPicks || 0) + "</span></div>";
        }

        endPanel.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>BALANÇ DE 40 ANYS · #' + camp.num + "</span><span>IPC ×" + st.cpiIndex.toFixed(2).replace(".", ",") + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:5px;">' + diag.title + "</h3>" +
            '<p class="scenario-body" style="margin-top:4px;">' + diag.desc + "</p>" +
          "</div>" +
          badgeNote +
          '<div class="chart-box">' +
            window.CalmUI.buildDualChartSVG(st.histCap, st.histBench, {
              height: 138,
              xStartLabel: "Any 0 (" + window.CalmUI.fmtEur(camp.startCap) + ")",
              xEndLabel: "Any " + yrs + " (Punt.: 60/40)"
            }) +
          "</div>";

        var endBtns = document.createElement("div");
        endBtns.className = "subtabs-row";
        var bNextCamp = window.CalmUI.mkBtn("btn-lg active", "Triar una altra Campanya (8) →", function () {
          st.tab = "campanyes";
          st.campSub = "camps";
          saveState(st);
          redraw();
        });
        bNextCamp.style.flex = "1";
        endBtns.appendChild(bNextCamp);

        var bReplay = window.CalmUI.mkBtn("btn-lg", "↻ Repetir", function () {
          st = createNewGame(st.campaignId);
          saveState(st);
          redraw();
        });
        endBtns.appendChild(bReplay);

        endPanel.appendChild(endBtns);
        wrap.appendChild(endPanel);
        container.appendChild(wrap);
        return;
      }

      if (st.lastReport) {
        var rep = st.lastReport;
        var out = document.createElement("div");
        out.className = "outcome-panel";
        out.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>TANCAMENT BIENNI · ANY ' + rep.yrsFrom + " → " + rep.yrsTo + "</span><span>IPC bienni: " + window.CalmUI.fmtPct(rep.infBiennialPct) + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:5px;">Cartera: ' + window.CalmUI.fmtPct(rep.userPct) + " (" + (rep.deltaEur >= 0 ? "+" : "") + window.CalmUI.fmtEur(rep.deltaEur) + ")</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + rep.note + "</p>" +
            (rep.cashflowText ? '<p class="scenario-body" style="margin-top:4px;"><b>' + rep.cashflowText + "</b></p>" : "") +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">60/40: ' + window.CalmUI.fmtPct(rep.benchPct) + "</span>" +
            '<span class="delta-pill">Global: ' + window.CalmUI.fmtPct(rep.rGlob) + "</span>" +
            '<span class="delta-pill">Tech: ' + window.CalmUI.fmtPct(rep.rGrow) + "</span>" +
            '<span class="delta-pill">Bons: ' + window.CalmUI.fmtPct(rep.rBond) + "</span>" +
            '<span class="delta-pill">Or: ' + window.CalmUI.fmtPct(rep.rGold) + "</span>" +
          "</div>" +
          '<div class="insight-box"><b>Principi dels cicles:</b> ' + rep.lesson + "</div>";

        var bNext = window.CalmUI.mkBtn("btn-lg active", "Obrir Butlletí Any " + rep.yrsTo + " (Bienni " + (st.turn + 1) + "/20) →", function () {
          st.lastReport = null;
          saveState(st);
          redraw();
        });
        bNext.style.width = "100%";
        out.appendChild(bNext);
        wrap.appendChild(out);
        container.appendChild(wrap);
        return;
      }

      // Active Biennium Bulletin
      var sc = getBulletinById(st.seqIds[st.turn]);
      var banner = document.createElement("div");
      banner.className = "context-banner";
      banner.innerHTML =
        "<span><b>CAPE " + sc.cape + "x</b> · Tipus " + sc.rate.toFixed(1).replace(".", ",") + "% · IPC " + sc.inf.toFixed(1).replace(".", ",") + "%</span>" +
        "<span>" + allocSummaryShort(st.alloc) + "</span>";
      wrap.appendChild(banner);

      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>BIENNI ' + (st.turn + 1) + "/20 · #" + camp.num + " " + camp.name.toUpperCase() + "</span></div>" +
        '<div class="scenario-quote">' + sc.headline + "</div>" +
        '<p class="scenario-body">' + sc.context + "</p>";
      wrap.appendChild(card);

      var choices = getTurnChoices(st, sc, camp);
      var stack = document.createElement("div");
      stack.className = "choice-stack";
      choices.forEach(function (op) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + op.key + "</span>" +
          '<div class="choice-content"><div class="choice-main">' + op.label + '</div><div class="choice-sub">' + op.sub + "</div></div>";
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          executeBiennium(st, op);
          saveState(st);
          redraw();
        });
        stack.appendChild(b);
      });
      wrap.appendChild(stack);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    var meta = loadMeta();
    var D = getData();
    var medals = 0;
    for (var i = 0; i < D.CAMPAIGNS.length; i++) {
      if ((meta.medals[D.CAMPAIGNS[i].id] || 0) >= 1) medals++;
    }
    if (st.status === "playing" && st.turn > 0) {
      return "Any " + (st.turn * 2) + "/40 · " + window.CalmUI.fmtEur(st.capital);
    }
    if (medals > 0) {
      return "★ " + medals + "/8 Campanyes";
    }
    return "8 Campanyes · 40a";
  }

  window.CalmGames.decennis = {
    id: "decennis",
    title: "El Joc dels Decennis",
    desc: "8 campanyes de 40 anys, 6 actius, inflació real i titulars trampa contra l'índex 60/40.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>El Joc dels Decennis v6 · Guia E-Ink</h2>" +
      "<ul>" +
      "<li><b>8 Campanyes de 40 anys (20 biennis):</b> Des del Gran Cicle i la Tempesta d'Estagflació fins al <i>Repte del Jubilat</i> (retirades amb risc de seqüència), el <i>Constructor DCA</i> i el <i>Mode Mestre Sense Pistes</i>.</li>" +
      "<li><b>6 Classes d'Actius i 4 Plantilles:</b> A <b>Cartera</b> pots configurar Accions Globals, Tech/Creixement, Lletres Curtes, Bons 20a, SOCIMIs i Or, o aplicar carteres clàssiques d'un sol toc.</li>" +
      "<li><b>Poder Adquisitiu Real:</b> Vigila el <b>CAPE</b>, els <b>tipus</b> i l'<b>IPC</b>: el joc descompta la inflació acumulada perquè comprovis el teu capital real en euros de l'Any 0!</li>" +
      "<li><b>Posicions aleatòries:</b> Les opcions tàctiques <b>B</b> i <b>C</b> es barregen a cada bienni perquè hagis de llegir i raonar amb criteri propi.</li>" +
      "</ul>"
  };
})();
