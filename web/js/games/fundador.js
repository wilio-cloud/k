// Joc 3: Fundador des de Zero: De Garatge a Holding (v6 Deep Multi-Day Edition · Kindle E-Ink)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "fundador_state_v6";
  var HOLDING_KEY = "fundador_holding_v6";

  function data() {
    return (window.CalmData && window.CalmData.fundador) || {
      STAGES: [],
      VENTURES: [],
      DEPARTMENTS: [],
      PRICING_TIERS: [],
      DIVIDEND_POLICIES: [],
      FOCUS_MODES: [],
      HOLDING_ASSETS: [],
      MILESTONES: [],
      DILEMMAS: [],
      generateDynamicQuarterDilemma: null
    };
  }

  function ui() {
    return window.CalmUI;
  }

  function escHtml(str) {
    return String(str === undefined || str === null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findById(arr, id, fallbackIdx) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) return arr[i];
    }
    return arr[fallbackIdx || 0] || null;
  }

  // ==================== HOLDING PERSONAL PERSISTENT ====================
  function defaultHolding() {
    return {
      cash: 0,
      assets: {},
      exits: [],
      milestones: {},
      companiesFounded: 0,
      totalDividends: 0,
      bestExit: 0
    };
  }

  function loadHolding() {
    var saved = window.CalmStorage.get(HOLDING_KEY, null);
    if (!saved || typeof saved !== "object") return defaultHolding();
    saved.cash = typeof saved.cash === "number" && !isNaN(saved.cash) ? Math.round(saved.cash) : 0;
    saved.assets = saved.assets && typeof saved.assets === "object" ? saved.assets : {};
    saved.exits = Array.isArray(saved.exits) ? saved.exits : [];
    saved.milestones = saved.milestones && typeof saved.milestones === "object" ? saved.milestones : {};
    saved.companiesFounded = typeof saved.companiesFounded === "number" ? saved.companiesFounded : 0;
    saved.totalDividends = typeof saved.totalDividends === "number" ? saved.totalDividends : 0;
    saved.bestExit = typeof saved.bestExit === "number" ? saved.bestExit : 0;
    return saved;
  }

  function saveHolding(hl) {
    window.CalmStorage.set(HOLDING_KEY, hl);
  }

  function holdingPassiveMonthly(hl) {
    var assets = data().HOLDING_ASSETS;
    var sum = 0;
    for (var i = 0; i < assets.length; i++) {
      var cnt = hl.assets[assets[i].id] || 0;
      if (cnt > 0) sum += assets[i].monthlyYield * cnt;
    }
    return Math.round(sum);
  }

  function holdingPortfolioValue(hl) {
    var assets = data().HOLDING_ASSETS;
    var sum = 0;
    for (var i = 0; i < assets.length; i++) {
      var cnt = hl.assets[assets[i].id] || 0;
      if (cnt > 0) sum += assets[i].cost * cnt;
    }
    return Math.round(sum);
  }

  // ==================== ETAPES I UNIT ECONOMICS DE L'EMPRESA ====================
  function getStage(rev) {
    var stages = data().STAGES;
    var r = typeof rev === "number" && !isNaN(rev) ? rev : 0;
    for (var i = stages.length - 1; i >= 0; i--) {
      if (r >= stages[i].minRev) return stages[i];
    }
    return stages[0] || { id: 1, short: "Fase 1 · Garatge", name: "Fase 1 · Garatge (< 4k€/m MRR)", desc: "" };
  }

  function getPricing(st) {
    return findById(data().PRICING_TIERS, st.pricing, 1) || {
      id: "std", name: "Estàndard", short: "Estàndard", qGrowthMod: 0, mChurnMod: 0, varCostMod: 0, multMod: 0
    };
  }

  function getDivPolicy(st) {
    return findById(data().DIVIDEND_POLICIES, st.divPolicy, 0) || {
      id: "reinvest", name: "Reinvertir 100%", short: "0% Div.", rate: 0, qGrowthMod: 0.02
    };
  }

  function getFocusMode(st) {
    return findById(data().FOCUS_MODES, st.focus, 0) || {
      id: "product", k: "P", name: "Producte & Retenció", short: "PROD"
    };
  }

  function sumDeptLevels(st) {
    var d = st.depts || {};
    return (d.eng || 0) + (d.sales || 0) + (d.ops || 0) + (d.brand || 0);
  }

  function computeUnitEconomics(st) {
    var depts = data().DEPARTMENTS;
    var pr = getPricing(st);
    var dv = getDivPolicy(st);
    var stg = getStage(st.rev);

    var deptCost = 0;
    var deptQGrowth = 0;
    var deptChurnDrop = 0;
    var deptMult = 0;
    var deptEnergySave = 0;

    for (var i = 0; i < depts.length; i++) {
      var dep = depts[i];
      var lvl = ui().clamp((st.depts && st.depts[dep.id]) || 0, 0, 5);
      deptCost += dep.monthlyCosts[lvl] || 0;
      deptQGrowth += dep.qGrowthBonus[lvl] || 0;
      deptChurnDrop += dep.mChurnDrop[lvl] || 0;
      deptMult += dep.multBonus[lvl] || 0;
      deptEnergySave += dep.energySave[lvl] || 0;
    }

    var varRatio = ui().clamp((st.varCostRatio || 0.25) + pr.varCostMod, 0.08, 0.60);
    var varCost = Math.round((st.rev || 0) * varRatio);
    var totalCost = Math.round((st.fixedCost || 1000) + deptCost + varCost);
    var monthlyMargin = Math.round((st.rev || 0) - totalCost);

    var focusChurnDrop = st.focus === "product" ? 0.003 : 0;
    var mChurn = ui().clamp(
      (st.baseChurn || 0.03) + pr.mChurnMod + (st.churnMod || 0) - deptChurnDrop - focusChurnDrop,
      0.004,
      0.095
    );

    var mult = ui().clamp(
      (st.baseMult || 3.5) + (st.multMod || 0) + pr.multMod + deptMult,
      1.5,
      15.0
    );

    // Stage-scaled organic momentum (Law of Large Numbers requires departments to scale!)
    var stageInertias = [0, 0.045, 0.022, 0.000, -0.028, -0.055];
    var baseQ = (st.ventureGrowth || 0.15) * 0.22 + (stageInertias[stg.id] || 0);

    // Team adequacy factor for higher stages
    var totalLvls = sumDeptLevels(st);
    var expectedLvls = (stg.id - 1) * 3;
    var teamScale = totalLvls >= expectedLvls ? 1.0 : Math.max(0.50, 1.0 - (expectedLvls - totalLvls) * 0.06);

    var focusGrowth = st.focus === "sales" ? 0.045 : st.focus === "product" ? 0.025 : st.focus === "rest" ? -0.015 : 0;
    var estNetQGrowth = baseQ + (deptQGrowth * 0.45) * teamScale + pr.qGrowthMod + dv.qGrowthMod + focusGrowth - mChurn * 3;

    var runwayTxt = monthlyMargin >= 0
      ? "Rendible ∞"
      : Math.max(0, Math.floor(Math.max(0, st.cash || 0) / Math.max(1, Math.abs(monthlyMargin)))) + " mesos";

    return {
      stage: stg,
      deptCost: deptCost,
      varCost: varCost,
      totalCost: totalCost,
      monthlyMargin: monthlyMargin,
      mChurn: mChurn,
      mult: Math.round(mult * 100) / 100,
      deptEnergySave: deptEnergySave,
      estNetQGrowth: estNetQGrowth,
      runwayTxt: runwayTxt
    };
  }

  function syncDerivedMetrics(st) {
    if (!st || st.choosingVenture) return;
    var econ = computeUnitEconomics(st);
    st.cost = econ.totalCost;
    st.mult = econ.mult;
    st.churnPct = Math.round(econ.mChurn * 1000) / 10;
  }

  function companyValuation(st) {
    if (!st || st.choosingVenture) return 0;
    var econ = computeUnitEconomics(st);
    var annualRev = (st.rev || 0) * 12;
    var annualProfit = Math.max(0, econ.monthlyMargin * 12);
    return Math.max(10000, Math.round(annualRev * econ.mult + annualProfit * 2.5));
  }

  function founderCurrentStake(st) {
    if (!st || st.choosingVenture) return 0;
    if (st.status === "ended") {
      if (st.flags && st.flags.soldExit) return st.exitPayout || 0;
      if (st.cash < 0) return 0;
    }
    var grossVal = companyValuation(st) + Math.max(0, st.cash || 0);
    var afterPref = Math.max(0, grossVal - (st.liqPref || 0));
    return Math.round(afterPref * ((st.equity || 0) / 100));
  }

  function holdingTotalNetWorth(hl, st) {
    var activeStake = st && !st.choosingVenture && st.status === "playing" ? founderCurrentStake(st) : 0;
    return Math.round((hl.cash || 0) + holdingPortfolioValue(hl) + activeStake);
  }

  // ==================== FITES / MILESTONES (16) ====================
  function checkMilestones(st, hl) {
    var m = hl.milestones;
    if (st && !st.choosingVenture) {
      if (st.rev >= 4000) m.m_pmf = true;
      if (st.rev >= 18000) m.m_scale = true;
      if (st.rev >= 75000) m.m_leader = true;
      if (st.rev >= 300000) m.m_empire = true;
      if (st.rev >= 18000 && st.equity >= 100) m.m_boot = true;
      if (st.selfFundedAmt && st.selfFundedAmt > 0) m.m_self = true;
      var lvls = sumDeptLevels(st);
      if (lvls >= 12) m.m_team = true;
      if (lvls >= 20) m.m_orgmax = true;
      if (st.q >= 32 && st.status === "playing") m.m_longev = true;
    }
    if (hl.totalDividends > 0) m.m_div1 = true;
    if (hl.exits.length >= 1) m.m_exit1 = true;
    if (hl.companiesFounded >= 2) m.m_serial = true;
    var passM = holdingPassiveMonthly(hl);
    if (passM >= 5000) m.m_pass5k = true;
    if (passM >= 25000) m.m_pass25k = true;
    var nw = holdingTotalNetWorth(hl, st);
    if (nw >= 1000000) m.m_net1m = true;
    if (nw >= 10000000) m.m_net10m = true;
  }

  function countUnlockedMilestones(hl) {
    var list = data().MILESTONES;
    var c = 0;
    for (var i = 0; i < list.length; i++) {
      if (hl.milestones[list[i].id]) c++;
    }
    return c;
  }

  // ==================== ESTAT DE PARTIDA I CREACIÓ D'EMPRESA ====================
  function createPicker(prevPage) {
    return {
      choosingVenture: true,
      pickerPage: prevPage || 0,
      injectTier: 0 // 0 | 50000 | 250000
    };
  }

  function createVentureRun(vid, injectAmt, hl) {
    var ventures = data().VENTURES;
    var v = findById(ventures, vid, 0);
    var actualInject = 0;
    if (injectAmt > 0 && hl && hl.cash >= injectAmt) {
      actualInject = injectAmt;
      hl.cash -= actualInject;
    }
    if (hl) {
      hl.companiesFounded = (hl.companiesFounded || 0) + 1;
    }

    var initVarCost = Math.round(v.rev * v.varCostRatio);
    var fixedCost = Math.max(500, v.baseCost - initVarCost);
    var startCash = v.cash + actualInject;

    var st = {
      choosingVenture: false,
      seed: Math.floor(Math.random() * 899999) + 100000,
      q: 1,
      ventureId: v.id,
      ventureName: v.name,
      cash: startCash,
      rev: v.rev,
      fixedCost: fixedCost,
      varCostRatio: v.varCostRatio,
      ventureGrowth: v.growth,
      baseChurn: v.baseChurn,
      churnMod: 0,
      baseMult: v.mult,
      multMod: 0,
      cost: v.baseCost,
      mult: v.mult,
      churnPct: Math.round(v.baseChurn * 1000) / 10,
      equity: 100,
      liqPref: 0,
      energy: 88,
      selfFundedAmt: actualInject,
      depts: { eng: 0, sales: 0, ops: 0, brand: 0 },
      pricing: "std",
      divPolicy: "reinvest",
      focus: "product",
      tab: "decisio", // decisio | empresa | holding | grafic
      empSub: "equip", // equip | focus
      holdSub: "pe", // pe | exits | titols
      chartMode: "val", // val | mrr
      deptPage: 0,
      holdPage: 0,
      exitPage: 0,
      milePage: 0,
      confirmReset: false,
      flags: {},
      seen: {},
      curDilemmaId: null,
      lastOut: null,
      status: "playing",
      histVal: [],
      histCash: [],
      histRev: [],
      histCost: [],
      log: []
    };

    syncDerivedMetrics(st);
    st.histVal.push(founderCurrentStake(st));
    st.histCash.push(st.cash);
    st.histRev.push(st.rev);
    st.histCost.push(st.cost);
    st.log.push(
      "T1 · Fundes «" + v.name + "» amb " + ui().fmtEur(st.cash) +
      (actualInject > 0 ? " (+" + ui().fmtEur(actualInject) + " del teu Holding)" : "") + "."
    );

    if (hl) {
      checkMilestones(st, hl);
      saveHolding(hl);
    }
    pickDilemma(st);
    return st;
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && typeof saved === "object") {
      if (saved.choosingVenture) {
        saved.pickerPage = saved.pickerPage || 0;
        saved.injectTier = saved.injectTier || 0;
        return saved;
      }
      if (typeof saved.q === "number" && typeof saved.rev === "number") {
        saved.depts = saved.depts || { eng: 0, sales: 0, ops: 0, brand: 0 };
        saved.pricing = saved.pricing || "std";
        saved.divPolicy = saved.divPolicy || "reinvest";
        saved.focus = saved.focus || "product";
        saved.tab = saved.tab || "decisio";
        saved.empSub = saved.empSub || "equip";
        saved.holdSub = saved.holdSub || "pe";
        saved.chartMode = saved.chartMode || "val";
        saved.flags = saved.flags || {};
        saved.seen = saved.seen || {};
        saved.histVal = Array.isArray(saved.histVal) ? saved.histVal : [0];
        saved.histCash = Array.isArray(saved.histCash) ? saved.histCash : [saved.cash || 0];
        saved.histRev = Array.isArray(saved.histRev) ? saved.histRev : [saved.rev || 0];
        saved.histCost = Array.isArray(saved.histCost) ? saved.histCost : [saved.cost || 0];
        saved.log = Array.isArray(saved.log) ? saved.log : [];
        syncDerivedMetrics(saved);
        return saved;
      }
    }
    return createPicker(0);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  // ==================== SELECCIÓ I SHUFFLE DETERMINISTA DE DILEMES ====================
  function pickDilemma(st) {
    var rng = ui().seededRng(st.seed + st.q * 173 + getStage(st.rev).id * 31);
    var list = data().DILEMMAS;
    var stageId = getStage(st.rev).id;
    var strictCands = [];
    var broadCands = [];

    for (var i = 0; i < list.length; i++) {
      var d = list[i];
      if (st.seen[d.id]) continue;
      if (d.minQ && st.q < d.minQ) continue;
      if (d.maxQ && st.q > d.maxQ) continue;
      if (d.noFlag && st.flags[d.noFlag]) continue;
      if (d.reqFlag && !st.flags[d.reqFlag]) continue;
      if (d.ventures && d.ventures.indexOf(st.ventureId) === -1) continue;

      if (stageId >= d.minStage && stageId <= d.maxStage) {
        strictCands.push(d);
      } else if (Math.abs(stageId - d.minStage) <= 1 || Math.abs(stageId - d.maxStage) <= 1) {
        broadCands.push(d);
      }
    }

    var pool = strictCands.length > 0 ? strictCands : broadCands;
    if (pool.length === 0) {
      st.curDilemmaId = "dyn_q" + st.q;
      return;
    }
    var chosen = pool[Math.floor(rng() * pool.length) % pool.length];
    st.curDilemmaId = chosen.id;
  }

  function getActiveDilemmaWithShuffledOpts(st) {
    var list = data().DILEMMAS;
    var raw = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === st.curDilemmaId) {
        raw = list[i];
        break;
      }
    }
    if (!raw) {
      var genRng = ui().seededRng(st.seed + st.q * 613);
      if (data().generateDynamicQuarterDilemma) {
        raw = data().generateDynamicQuarterDilemma(st, genRng);
      }
    }
    if (!raw) {
      raw = {
        id: "fallback_" + st.q,
        tag: "EXECUCIÓ TRIMESTRAL",
        title: "Prioritat d'execució del Trimestre " + st.q,
        body: "On concentres els recursos de l'organització aquest trimestre?",
        opts: [
          { t: "Impulsar millores clau per als clients actuals", s: "MRR +14% · Energia -4", fn: function (s) { s.rev = Math.round(s.rev * 1.14); s.energy -= 4; return "La retenció i les recomanacions fan créixer els ingressos."; } },
          { t: "Optimitzar costos i processos interns", s: "Cost fix -7% · Energia +6", fn: function (s) { s.fixedCost = Math.max(600, Math.round(s.fixedCost * 0.93)); s.energy += 6; return "Eixamples el marge operatiu amb una estructura més ordenada."; } }
        ]
      };
    }

    // Deterministic option order shuffle so "pick A" is never a blind pattern
    var shufRng = ui().seededRng(st.seed + st.q * 997 + raw.id.length * 37);
    var indices = [];
    for (var j = 0; j < raw.opts.length; j++) indices.push(j);
    for (var k = indices.length - 1; k > 0; k--) {
      var swapIdx = Math.floor(shufRng() * (k + 1));
      var tmp = indices[k];
      indices[k] = indices[swapIdx];
      indices[swapIdx] = tmp;
    }

    var letters = ["A", "B", "C", "D"];
    var mappedOpts = [];
    for (var m = 0; m < indices.length; m++) {
      var orig = raw.opts[indices[m]];
      mappedOpts.push({
        k: letters[m] || String(m + 1),
        origIdx: indices[m],
        t: orig.t,
        s: orig.s,
        fn: orig.fn
      });
    }

    return {
      id: raw.id,
      tag: raw.tag,
      title: raw.title,
      body: raw.body,
      opts: mappedOpts
    };
  }

  // ==================== EXECUCIÓ D'EXIT M&A / IPO ====================
  function executeExit(st, hl, multFactor, label) {
    syncDerivedMetrics(st);
    var baseVal = companyValuation(st);
    var dealVal = Math.round(baseVal * (multFactor || 1.0) + Math.max(0, st.cash || 0));
    var netAfterPref = Math.max(0, dealVal - (st.liqPref || 0));
    var myPayout = Math.round(netAfterPref * ((st.equity || 0) / 100));

    hl.cash = Math.round((hl.cash || 0) + myPayout);
    if (myPayout > (hl.bestExit || 0)) hl.bestExit = myPayout;

    hl.exits.unshift({
      ventureName: st.ventureName,
      q: st.q,
      rev: st.rev,
      stageId: getStage(st.rev).id,
      equity: st.equity,
      dealVal: dealVal,
      netPayout: myPayout,
      label: label || "Venda M&A"
    });
    if (hl.exits.length > 24) hl.exits.pop();

    st.flags.soldExit = true;
    st.exitDealVal = dealVal;
    st.exitPayout = myPayout;
    st.exitLabel = label || "Venda M&A";
    st.status = "ended";
    st.lastOut = null;

    st.histVal.push(myPayout);
    st.histCash.push(st.cash);
    st.histRev.push(st.rev);
    st.histCost.push(st.cost);
    st.log.unshift("T" + st.q + " · ★ EXIT (" + ui().fmtEur(myPayout) + " nets al Holding)");
    if (st.log.length > 8) st.log.pop();

    checkMilestones(st, hl);
    saveHolding(hl);
    saveState(st);
    return myPayout;
  }

  // ==================== AVANÇ D'UN TRIMESTRE ====================
  function stepQuarter(st, shownOptIdx, hl) {
    if (!st || st.choosingVenture || st.status !== "playing") return;

    var dil = getActiveDilemmaWithShuffledOpts(st);
    var opt = dil.opts[shownOptIdx] || dil.opts[0];
    st.seen[dil.id] = true;

    var rng = ui().seededRng(st.seed + st.q * 409 + (shownOptIdx + 1) * 53);
    var prevCash = st.cash;
    var prevRev = st.rev;
    var prevStageId = getStage(st.rev).id;

    st.holdingCashTransfer = 0;
    st.triggerExit = null;

    // 1. Organic & Strategic Focus levers before dilemma
    var econBefore = computeUnitEconomics(st);
    var noise = (rng() - 0.42) * 0.045;
    var maxOrgQ = st.rev >= 1200000 ? 0.07 : st.rev >= 300000 ? 0.11 : 0.45;
    var netQGrowth = ui().clamp(econBefore.estNetQGrowth + noise, -0.22, maxOrgQ);

    if (st.focus === "sales") {
      st.fixedCost = Math.round(st.fixedCost * 1.025);
      st.energy -= 4;
    } else if (st.focus === "product") {
      st.multMod = Math.round(((st.multMod || 0) + 0.05) * 100) / 100;
      st.energy -= 2;
    } else if (st.focus === "margin") {
      st.fixedCost = Math.max(500, Math.round(st.fixedCost * 0.95));
      st.energy -= 2;
    } else if (st.focus === "rest") {
      st.energy += 11;
    }

    // Department delegation cushions founder baseline energy drain
    var baseQuarterDrain = Math.max(0, 5 - Math.floor(econBefore.deptEnergySave / 3));
    st.energy -= baseQuarterDrain;

    st.rev = Math.max(400, Math.round(st.rev * (1 + netQGrowth)));
    var revBeforeDil = st.rev;

    // 2. Apply Dilemma Decision (with realistic scale damping in mature stages)
    var narrative = opt.fn(st, rng);
    if (st.rev > revBeforeDil) {
      var stgDamp = [1, 1.0, 0.90, 0.78, 0.62, 0.35][econBefore.stage.id] || 0.35;
      if (st.rev >= 1200000) stgDamp = 0.22;
      st.rev = Math.round(revBeforeDil + (st.rev - revBeforeDil) * stgDamp);
    }
    st.rev = Math.max(400, Math.round(st.rev));
    st.fixedCost = Math.max(500, Math.round(st.fixedCost));
    st.equity = ui().clamp(Math.round(st.equity), 1, 100);

    // 3. Holding passive yield for the 3-month quarter
    var passiveQ = holdingPassiveMonthly(hl) * 3;
    if (passiveQ > 0) {
      hl.cash = Math.round((hl.cash || 0) + passiveQ);
    }

    // Direct transfers from secondary share sales or extraordinary dividends
    var extraTransfer = Math.round(st.holdingCashTransfer || 0);
    if (extraTransfer > 0) {
      hl.cash = Math.round((hl.cash || 0) + extraTransfer);
      hl.totalDividends = Math.round((hl.totalDividends || 0) + extraTransfer);
    }

    // Check if dilemma triggered immediate Exit / IPO
    if (st.triggerExit) {
      st.energy = ui().clamp(Math.round(st.energy), 1, 100);
      executeExit(st, hl, st.triggerExit.multFactor, st.triggerExit.label);
      return;
    }

    // 4. Operating 3-month cashflow & Dividend policy
    syncDerivedMetrics(st);
    var opQuarterCash = (st.rev - st.cost) * 3;
    st.cash = Math.round(st.cash + opQuarterCash);

    var divPaidToHolding = 0;
    var divPol = getDivPolicy(st);
    if (divPol.rate > 0 && opQuarterCash > 0 && st.cash > st.cost * 1.2) {
      var totalDivPool = Math.round(opQuarterCash * divPol.rate);
      if (st.cash - totalDivPool >= Math.round(st.cost * 0.8)) {
        st.cash -= totalDivPool;
        divPaidToHolding = Math.round(totalDivPool * (st.equity / 100));
        hl.cash = Math.round((hl.cash || 0) + divPaidToHolding);
        hl.totalDividends = Math.round((hl.totalDividends || 0) + divPaidToHolding);
      }
    }

    st.q += 1;
    st.energy = ui().clamp(Math.round(st.energy), 0, 100);
    syncDerivedMetrics(st);

    var curStake = founderCurrentStake(st);
    st.histVal.push(curStake);
    st.histCash.push(st.cash);
    st.histRev.push(st.rev);
    st.histCost.push(st.cost);
    if (st.histVal.length > 90) {
      st.histVal.shift();
      st.histCash.shift();
      st.histRev.shift();
      st.histCost.shift();
    }

    var newStage = getStage(st.rev);
    st.log.unshift(
      "T" + st.q + " · F" + newStage.id + " · MRR " + ui().fmtEur(st.rev) +
      " · Caixa " + ui().fmtEur(st.cash) +
      (divPaidToHolding > 0 ? " · Div +" + ui().fmtEur(divPaidToHolding) : "")
    );
    if (st.log.length > 7) st.log.pop();

    // Bankruptcy or Severe Burnout check (NO artificial quarter limit!)
    if (st.cash < 0 || st.energy <= 0) {
      st.status = "ended";
      st.lastOut = null;
      checkMilestones(st, hl);
      saveHolding(hl);
      saveState(st);
      return;
    }

    checkMilestones(st, hl);
    saveHolding(hl);

    st.lastOut = {
      title: dil.title,
      narrative: narrative,
      dCash: st.cash - prevCash,
      dRev: st.rev - prevRev,
      divPaid: divPaidToHolding + extraTransfer,
      passiveQ: passiveQ,
      stageUp: newStage.id > prevStageId ? newStage.name : null
    };

    pickDilemma(st);
    saveState(st);
  }

  // ==================== AZIONS DE DEPARTAMENTS I HOLDING ====================
  function upgradeDept(st, deptId) {
    if (!st || st.choosingVenture || st.status !== "playing") return false;
    var dep = findById(data().DEPARTMENTS, deptId, -1);
    if (!dep) return false;
    var cur = (st.depts && st.depts[deptId]) || 0;
    if (cur >= 5) return false;
    var nextLvl = cur + 1;
    var fee = dep.hireFees[nextLvl] || 0;
    if (st.cash < fee) return false;

    st.cash -= fee;
    st.depts[deptId] = nextLvl;
    syncDerivedMetrics(st);
    var hl = loadHolding();
    checkMilestones(st, hl);
    saveHolding(hl);
    saveState(st);
    return true;
  }

  function downgradeDept(st, deptId) {
    if (!st || st.choosingVenture || st.status !== "playing") return false;
    var dep = findById(data().DEPARTMENTS, deptId, -1);
    if (!dep) return false;
    var cur = (st.depts && st.depts[deptId]) || 0;
    if (cur <= 0) return false;
    // Severance cost = 1 month of current salary difference
    var sev = Math.round(((dep.monthlyCosts[cur] || 0) - (dep.monthlyCosts[cur - 1] || 0)) * 0.8);
    if (st.cash < sev) return false;

    st.cash -= sev;
    st.depts[deptId] = cur - 1;
    st.energy = ui().clamp(st.energy - 3, 1, 100);
    syncDerivedMetrics(st);
    saveState(st);
    return true;
  }

  function buyHoldingAsset(hl, assetId, st) {
    var asset = findById(data().HOLDING_ASSETS, assetId, -1);
    if (!asset) return false;
    if ((hl.cash || 0) < asset.cost) return false;
    hl.cash = Math.round(hl.cash - asset.cost);
    hl.assets[asset.id] = (hl.assets[asset.id] || 0) + 1;
    checkMilestones(st, hl);
    saveHolding(hl);
    return true;
  }

  function buildEndSummary(st, hl) {
    var nw = holdingTotalNetWorth(hl, null);
    if (st.flags && st.flags.soldExit) {
      return {
        kicker: "OPERACIÓ CORPORATIVA TANCADA · T" + st.q,
        title: "★ " + (st.exitLabel || "Exit M&A") + ": +" + ui().fmtEur(st.exitPayout || 0) + " al Holding!",
        body:
          "Has tancat la venda de «" + st.ventureName + "» valorada en " + ui().fmtEur(st.exitDealVal || 0) +
          " conservant el " + st.equity + "% del capital. El teu Holding Personal acumula ara un patrimoni de " +
          ui().fmtEur(nw) + " i rendes passives de +" + ui().fmtEur(holdingPassiveMonthly(hl)) + "/mes."
      };
    }
    if (st.cash < 0) {
      return {
        kicker: "INSOLVÈNCIA DE TRESORERIA · T" + st.q,
        title: "Concurs de Creditors: l'empresa s'ha quedat sense caixa",
        body:
          "Facturaves " + ui().fmtEur(st.rev) + "/mes, però la caixa ha caigut a " + ui().fmtEur(st.cash) +
          ". Gràcies a la separació societària, el teu Holding Personal queda protegit amb " +
          ui().fmtEur(nw) + " intactes per tornar-ho a intentar més savi."
      };
    }
    return {
      kicker: "ESGOTAMENT DIRECTIU · T" + st.q,
      title: "Burnout Sever del Fundador",
      body:
        "L'energia ha arribat a zero després de " + st.q + " trimestres intensos i has hagut de tancar ordenadament l'etapa. " +
        "Delegar en Operacions i cuidar el descans és clau. El teu Holding conserva " + ui().fmtEur(nw) + "."
    };
  }

  // ==================== RENDERITZACIÓ E-INK (540×700) ====================
  function render(container) {
    var st = loadState();
    var hl = loadHolding();

    function redraw() {
      hl = loadHolding();
      syncDerivedMetrics(st);
      checkMilestones(st, hl);
      saveHolding(hl);

      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // ---------------- 1. PANTALLA DE FUNDACIÓ D'EMPRESA ----------------
      if (st.choosingVenture) {
        var nw = holdingTotalNetWorth(hl, null);
        var passM = holdingPassiveMonthly(hl);

        var intro = document.createElement("div");
        intro.className = "scenario-card";
        intro.innerHTML =
          '<div class="scenario-kicker">' +
            "<span>EMPRESA #" + ((hl.companiesFounded || 0) + 1) + " · DE GARATGE A HOLDING</span>" +
            "<span>HOLDING: " + escHtml(ui().fmtEur(nw)) + "</span>" +
          "</div>" +
          '<h3 class="scenario-title">Quina nova empresa vols fundar avui?</h3>' +
          '<p class="scenario-body">' +
            (hl.cash > 0 || hl.exits.length > 0
              ? "Caixa líquida del Holding: <b>" + escHtml(ui().fmtEur(hl.cash)) + "</b> (Rendes: +" + escHtml(ui().fmtEur(passM)) + "/m). Pots injectar capital propi amb 0% de dilució!"
              : "Escala per 5 fases sense límit de trimestres: contracta departaments, cobra dividends al teu Holding o negocia un gran Exit M&A / IPO.") +
          "</p>";
        wrap.appendChild(intro);

        // Self-Funding Selector from Personal Holding
        var injRow = document.createElement("div");
        injRow.className = "subtabs-row";
        [
          { amt: 0, lbl: "Capital base (0 €)" },
          { amt: 50000, lbl: "+50k € del Holding" },
          { amt: 250000, lbl: "+250k € del Holding" }
        ].forEach(function (tier) {
          var canAfford = tier.amt === 0 || hl.cash >= tier.amt;
          if (st.injectTier === tier.amt && !canAfford) st.injectTier = 0;
          var pb = ui().mkBtn(
            "pill-btn" + (st.injectTier === tier.amt ? " active" : ""),
            tier.lbl,
            function () {
              st.injectTier = tier.amt;
              saveState(st);
              redraw();
            }
          );
          if (!canAfford) pb.disabled = true;
          injRow.appendChild(pb);
        });
        wrap.appendChild(injRow);

        // Paginated 6 Ventures (3 per page)
        var vPage = ui().slicePage(data().VENTURES, st.pickerPage || 0, 3);
        st.pickerPage = vPage.page;

        var vList = document.createElement("div");
        vList.className = "choice-stack";
        vPage.items.forEach(function (v, idx) {
          var num = vPage.page * 3 + idx + 1;
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choice-btn";
          var totalStartCash = v.cash + (st.injectTier || 0);
          btn.innerHTML =
            '<span class="choice-key">' + num + "</span>" +
            '<div class="choice-content">' +
              '<div class="choice-main">' + escHtml(v.name) + "</div>" +
              '<div class="choice-sub">Caixa ' + escHtml(ui().fmtEur(totalStartCash)) +
                " · MRR " + escHtml(ui().fmtEur(v.rev)) + "/m · Múlt. " + String(v.mult).replace(".", ",") + "x · 100% teu</div>" +
            "</div>";
          btn.addEventListener("click", function (ev) {
            ev.preventDefault();
            st = createVentureRun(v.id, st.injectTier || 0, hl);
            saveState(st);
            redraw();
          });
          vList.appendChild(btn);
        });
        wrap.appendChild(vList);

        wrap.appendChild(ui().renderPager(vPage, function (newP) {
          st.pickerPage = newP;
          saveState(st);
          redraw();
        }));

        container.appendChild(wrap);
        return;
      }

      // ---------------- 2. HUD SUPERIOR DE 4 COLUMNES ----------------
      var econ = computeUnitEconomics(st);
      var val = companyValuation(st);
      var marginSign = econ.monthlyMargin >= 0 ? "+" : "";

      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">FASE · TRIM.</div>' +
          '<div class="hud-val">F' + econ.stage.id + " · T" + st.q + "</div>" +
          '<div class="hud-label">' + escHtml(econ.runwayTxt) + "</div>" +
        "</div>" +
        '<div class="hud-cell invert">' +
          '<div class="hud-label">CAIXA EMPRESA</div>' +
          '<div class="hud-val">' + escHtml(ui().fmtEur(st.cash)) + "</div>" +
          '<div class="hud-label">Marge ' + marginSign + escHtml(ui().fmtEur(econ.monthlyMargin)) + "/m</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">MRR MENSUAL</div>' +
          '<div class="hud-val">' + escHtml(ui().fmtEur(st.rev)) + "/m</div>" +
          '<div class="hud-label">Val ' + escHtml(ui().fmtEur(val)) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">EQUITY · ENERGIA</div>' +
          '<div class="hud-val">' + st.equity + "% · ⚡" + st.energy + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.energy + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // ---------------- 3. BARRA DE 4 PESTANYES + BOTÓ DRETA ----------------
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var tabs = document.createElement("div");
      tabs.className = "segmented";

      [
        { id: "decisio", label: "Decisió" },
        { id: "empresa", label: "Empresa" },
        { id: "holding", label: "Holding" },
        { id: "grafic", label: "Gràfic" }
      ].forEach(function (tb) {
        var b = ui().mkBtn(
          "btn-sm" + (st.tab === tb.id ? " active" : ""),
          tb.label,
          function () {
            st.tab = tb.id;
            st.confirmReset = false;
            saveState(st);
            redraw();
          }
        );
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      var btnReset = ui().mkBtn("btn-sm", "↻", function () {
        if (st.status === "ended") {
          st = createPicker(0);
          saveState(st);
          redraw();
          return;
        }
        st.confirmReset = !st.confirmReset;
        saveState(st);
        redraw();
      });
      btnReset.title = "Nova empresa";
      bar.appendChild(btnReset);
      wrap.appendChild(bar);

      // In-flow confirmation to start a new company while preserving Personal Holding
      if (st.confirmReset) {
        var cPanel = document.createElement("div");
        cPanel.className = "outcome-panel";
        cPanel.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>GESTIÓ DE SOCIETATS</span><span>HOLDING PROTEGIT</span></div>' +
            '<h3 class="scenario-title" style="margin-top:6px;">Vols tancar aquesta etapa i fundar una nova empresa?</h3>' +
            '<p class="scenario-body" style="margin-top:6px;">El teu <b>Holding Personal</b> (caixa de ' +
              escHtml(ui().fmtEur(hl.cash)) + ", actius comprats, títols i historial d'Exits) es conserva íntegre. " +
              (st.rev >= 15000 && st.q >= 8
                ? "Consell: ja compleixes requisits per vendre l'empresa amb guany des de la pestanya <b>Holding</b>!"
                : "Si abandones abans de poder vendre-la, no cobraràs traspàs per les accions actuals.") +
            "</p>" +
          "</div>";

        var cBtns = document.createElement("div");
        cBtns.className = "toolbar-row";
        cBtns.appendChild(ui().mkBtn("btn-sm", "Cancel·lar i continuar", function () {
          st.confirmReset = false;
          saveState(st);
          redraw();
        }));
        cBtns.appendChild(ui().mkBtn("btn-sm active", "Anar al selector d'empreses →", function () {
          st = createPicker(0);
          saveState(st);
          redraw();
        }));
        cPanel.appendChild(cBtns);
        wrap.appendChild(cPanel);
        container.appendChild(wrap);
        return;
      }

      // ---------------- 4A. PESTANYA: EMPRESA ----------------
      if (st.tab === "empresa") {
        var churnStr = String(st.churnPct.toFixed(1)).replace(".", ",") + "%/m";
        var multStr = String(econ.mult.toFixed(1)).replace(".", ",") + "x";

        var ueBanner = document.createElement("div");
        ueBanner.className = "context-banner";
        ueBanner.innerHTML =
          "<span>Marge: <b>" + marginSign + escHtml(ui().fmtEur(econ.monthlyMargin)) + "/m</b> · Churn: <b>" + churnStr + "</b></span>" +
          "<span>Runway: <b>" + escHtml(econ.runwayTxt) + "</b> · Múlt: <b>" + multStr + "</b></span>";
        wrap.appendChild(ueBanner);

        var subRow = document.createElement("div");
        subRow.className = "subtabs-row";
        [
          { id: "equip", label: "Equip & Preus (" + sumDeptLevels(st) + "/20)" },
          { id: "focus", label: "Focus & Dividends (" + getDivPolicy(st).short + ")" }
        ].forEach(function (sb) {
          subRow.appendChild(ui().mkBtn(
            "pill-btn" + (st.empSub === sb.id ? " active" : ""),
            sb.label,
            function () {
              st.empSub = sb.id;
              saveState(st);
              redraw();
            }
          ));
        });
        wrap.appendChild(subRow);

        if (st.empSub === "equip") {
          // Pricing Tier Row
          var prBox = document.createElement("div");
          prBox.className = "subtabs-row";
          data().PRICING_TIERS.forEach(function (pt) {
            var b = ui().mkBtn(
              "pill-btn" + (st.pricing === pt.id ? " active" : ""),
              "Tarifa: " + pt.short,
              function () {
                if (st.status !== "playing") return;
                st.pricing = pt.id;
                syncDerivedMetrics(st);
                saveState(st);
                redraw();
              }
            );
            if (st.status !== "playing") b.disabled = true;
            prBox.appendChild(b);
          });
          wrap.appendChild(prBox);

          // Paginated Departments (3 per page)
          var dPage = ui().slicePage(data().DEPARTMENTS, st.deptPage || 0, 3);
          st.deptPage = dPage.page;

          var dList = document.createElement("div");
          dList.className = "item-list";
          dPage.items.forEach(function (dep) {
            var lvl = (st.depts && st.depts[dep.id]) || 0;
            var row = document.createElement("div");
            row.className = "item-row" + (lvl > 0 ? " owned" : "");

            var curSal = dep.monthlyCosts[lvl] || 0;
            var nextFee = lvl < 5 ? dep.hireFees[lvl + 1] : 0;
            var nextSal = lvl < 5 ? dep.monthlyCosts[lvl + 1] : curSal;

            var main = document.createElement("div");
            main.className = "item-row-main";
            main.innerHTML =
              '<div class="item-row-title">' + escHtml(dep.name) + " · Nv. " + lvl + "/5</div>" +
              '<div class="item-row-sub">' + escHtml(dep.desc) + "</div>" +
              '<div class="item-row-sub">Cost actual: ' + escHtml(ui().fmtEur(curSal)) + "/m" +
                (lvl < 5 ? " → Nv." + (lvl + 1) + ": " + escHtml(ui().fmtEur(nextSal)) + "/m" : " · Nivell màxim") +
              "</div>";
            row.appendChild(main);

            var acts = document.createElement("div");
            acts.className = "item-row-actions";

            if (lvl > 0) {
              var bDown = ui().mkBtn("btn-sm", "−", function () {
                downgradeDept(st, dep.id);
                redraw();
              });
              if (st.status !== "playing") bDown.disabled = true;
              acts.appendChild(bDown);
            }

            var hireLbl = lvl >= 5 ? "Màx" : "+ Fitxar (" + ui().fmtEur(nextFee) + ")";
            var bUp = ui().mkBtn("btn-sm" + (lvl < 5 && st.cash >= nextFee ? " active" : ""), hireLbl, function () {
              upgradeDept(st, dep.id);
              redraw();
            });
            if (lvl >= 5 || st.cash < nextFee || st.status !== "playing") bUp.disabled = true;
            acts.appendChild(bUp);

            row.appendChild(acts);
            dList.appendChild(row);
          });
          wrap.appendChild(dList);

          wrap.appendChild(ui().renderPager(dPage, function (np) {
            st.deptPage = np;
            saveState(st);
            redraw();
          }));
        } else {
          // Dividend Policy Row
          var divRow = document.createElement("div");
          divRow.className = "subtabs-row";
          data().DIVIDEND_POLICIES.forEach(function (dp) {
            var b = ui().mkBtn(
              "pill-btn" + (st.divPolicy === dp.id ? " active" : ""),
              dp.name,
              function () {
                if (st.status !== "playing") return;
                st.divPolicy = dp.id;
                syncDerivedMetrics(st);
                saveState(st);
                redraw();
              }
            );
            if (st.status !== "playing") b.disabled = true;
            divRow.appendChild(b);
          });
          wrap.appendChild(divRow);

          var divInfo = document.createElement("div");
          divInfo.className = "context-banner";
          divInfo.textContent = getDivPolicy(st).desc;
          wrap.appendChild(divInfo);

          // 4 Focus Modes (paginated 3 per page with slicePage to keep zero-scroll comfort)
          var fPage = ui().slicePage(data().FOCUS_MODES, st.focusPage || 0, 3);
          st.focusPage = fPage.page;

          var fList = document.createElement("div");
          fList.className = "item-list";
          fPage.items.forEach(function (fc) {
            var isAct = st.focus === fc.id;
            var row = document.createElement("div");
            row.className = "item-row" + (isAct ? " owned" : "");
            var main = document.createElement("div");
            main.className = "item-row-main";
            main.innerHTML =
              '<div class="item-row-title">[' + escHtml(fc.k) + "] " + escHtml(fc.name) + "</div>" +
              '<div class="item-row-sub">' + escHtml(fc.desc) + "</div>";
            row.appendChild(main);

            var bSel = ui().mkBtn("btn-sm" + (isAct ? " active" : ""), isAct ? "Actiu" : "Activar", function () {
              st.focus = fc.id;
              syncDerivedMetrics(st);
              saveState(st);
              redraw();
            });
            if (st.status !== "playing") bSel.disabled = true;
            row.appendChild(bSel);
            fList.appendChild(row);
          });
          wrap.appendChild(fList);

          wrap.appendChild(ui().renderPager(fPage, function (np) {
            st.focusPage = np;
            saveState(st);
            redraw();
          }));
        }

        container.appendChild(wrap);
        return;
      }

      // ---------------- 4B. PESTANYA: HOLDING PERSONAL ----------------
      if (st.tab === "holding") {
        var totalNW = holdingTotalNetWorth(hl, st);
        var passMonth = holdingPassiveMonthly(hl);
        var unlockedCount = countUnlockedMilestones(hl);

        var hHud = document.createElement("div");
        hHud.className = "hud-grid cols-3";
        hHud.innerHTML =
          '<div class="hud-cell invert">' +
            '<div class="hud-label">PATRIMONI HOLDING</div>' +
            '<div class="hud-val">' + escHtml(ui().fmtEur(totalNW)) + "</div>" +
          "</div>" +
          '<div class="hud-cell">' +
            '<div class="hud-label">CAIXA HOLDING</div>' +
            '<div class="hud-val">' + escHtml(ui().fmtEur(hl.cash)) + "</div>" +
          "</div>" +
          '<div class="hud-cell">' +
            '<div class="hud-label">RENDES PASSIVES</div>' +
            '<div class="hud-val">+' + escHtml(ui().fmtEur(passMonth)) + "/m</div>" +
          "</div>";
        wrap.appendChild(hHud);

        var hSub = document.createElement("div");
        hSub.className = "subtabs-row";
        [
          { id: "pe", label: "Actius Micro-PE (8)" },
          { id: "exits", label: "Venda M&A & Exits (" + hl.exits.length + ")" },
          { id: "titols", label: "Títols (" + unlockedCount + "/16)" }
        ].forEach(function (hs) {
          hSub.appendChild(ui().mkBtn(
            "pill-btn" + (st.holdSub === hs.id ? " active" : ""),
            hs.label,
            function () {
              st.holdSub = hs.id;
              saveState(st);
              redraw();
            }
          ));
        });
        wrap.appendChild(hSub);

        if (st.holdSub === "pe") {
          var aPage = ui().slicePage(data().HOLDING_ASSETS, st.holdPage || 0, 3);
          st.holdPage = aPage.page;

          var aList = document.createElement("div");
          aList.className = "item-list";
          aPage.items.forEach(function (ast) {
            var owned = hl.assets[ast.id] || 0;
            var row = document.createElement("div");
            row.className = "item-row" + (owned > 0 ? " owned" : "");

            var main = document.createElement("div");
            main.className = "item-row-main";
            main.innerHTML =
              '<div class="item-row-title">' + escHtml(ast.name) + (owned > 0 ? " (x" + owned + ")" : "") + "</div>" +
              '<div class="item-row-sub">' + escHtml(ast.desc) + "</div>" +
              '<div class="item-row-sub">Inversió: ' + escHtml(ui().fmtEur(ast.cost)) +
                " · Renda neta: +" + escHtml(ui().fmtEur(ast.monthlyYield)) + "/m</div>";
            row.appendChild(main);

            var acts = document.createElement("div");
            acts.className = "item-row-actions";
            var canBuy = hl.cash >= ast.cost;
            var bBuy = ui().mkBtn("btn-sm" + (canBuy ? " active" : ""), "Comprar", function () {
              buyHoldingAsset(hl, ast.id, st);
              redraw();
            });
            if (!canBuy) bBuy.disabled = true;
            acts.appendChild(bBuy);
            row.appendChild(acts);
            aList.appendChild(row);
          });
          wrap.appendChild(aList);

          wrap.appendChild(ui().renderPager(aPage, function (np) {
            st.holdPage = np;
            saveState(st);
            redraw();
          }));
        } else if (st.holdSub === "exits") {
          // Voluntary M&A / IPO Box
          var canSellNow = st.status === "playing" && st.rev >= 15000 && st.q >= 8;
          var isIPO = econ.stage.id >= 5;
          var multFactor = isIPO ? 1.15 : 1.02;
          var estDeal = Math.round(val * multFactor + Math.max(0, st.cash));
          var estNet = Math.round(Math.max(0, estDeal - (st.liqPref || 0)) * (st.equity / 100));

          var sellCard = document.createElement("div");
          sellCard.className = "scenario-card";
          sellCard.innerHTML =
            '<div class="scenario-kicker">' +
              "<span>MANDAT DE VENDA M&A / IPO</span>" +
              "<span>EQUITY TEU: " + st.equity + "%" + (st.liqPref > 0 ? " · LIQPREF " + escHtml(ui().fmtEur(st.liqPref)) : "") + "</span>" +
            "</div>" +
            '<div class="item-row-title">' +
              (isIPO ? "Sortida a Borsa / Gran Venda Corporativa" : "Posar l'empresa actual a la venda (Cercar Comprador M&A)") +
            "</div>" +
            '<div class="item-row-sub">' +
              (canSellNow
                ? "Oferta estimada: " + escHtml(ui().fmtEur(estDeal)) + " → Xec net al teu Holding: " + escHtml(ui().fmtEur(estNet))
                : "Requisit per obrir procés M&A: MRR >= 15.000 €/m i Trimestre >= T8 (ara: " + escHtml(ui().fmtEur(st.rev)) + "/m · T" + st.q + ").") +
            "</div>";

          var sellBtn = ui().mkBtn(
            "btn-sm" + (canSellNow ? " active" : ""),
            canSellNow
              ? (isIPO ? "Executar Sortida / Gran Exit (+" + ui().fmtEur(estNet) + ") →" : "Vendre empresa i cobrar +" + ui().fmtEur(estNet) + " al Holding →")
              : "Procés M&A encara bloquejat",
            function () {
              if (!canSellNow) return;
              executeExit(
                st,
                hl,
                multFactor,
                isIPO ? "Sortida a Borsa / Gran Operació Consolidada" : "Venda M&A Cercada des del Holding"
              );
              st.tab = "decisio";
              saveState(st);
              redraw();
            }
          );
          if (!canSellNow) sellBtn.disabled = true;
          sellCard.appendChild(sellBtn);
          wrap.appendChild(sellCard);

          // Exits History Paginated (3 per page)
          if (hl.exits.length === 0) {
            var emptyEx = document.createElement("div");
            emptyEx.className = "context-banner";
            emptyEx.textContent = "Encara no has tancat cap Exit M&A. Escala una empresa a Fase 3+ o rep una oferta!";
            wrap.appendChild(emptyEx);
          } else {
            var exPage = ui().slicePage(hl.exits, st.exitPage || 0, 3);
            st.exitPage = exPage.page;
            var exList = document.createElement("div");
            exList.className = "item-list";
            exPage.items.forEach(function (ex) {
              var r = document.createElement("div");
              r.className = "item-row owned";
              r.innerHTML =
                '<div class="item-row-main">' +
                  '<div class="item-row-title">★ ' + escHtml(ex.ventureName) + " · +" + escHtml(ui().fmtEur(ex.netPayout)) + " nets</div>" +
                  '<div class="item-row-sub">' + escHtml(ex.label) + " · T" + ex.q + " (F" + ex.stageId + ") · MRR " +
                    escHtml(ui().fmtEur(ex.rev)) + "/m · Equity " + ex.equity + "%</div>" +
                "</div>";
              exList.appendChild(r);
            });
            wrap.appendChild(exList);
            wrap.appendChild(ui().renderPager(exPage, function (np) {
              st.exitPage = np;
              saveState(st);
              redraw();
            }));
          }
        } else {
          // 16 Founder Milestones Paginated (4 per page in 2x2 grid)
          var mPage = ui().slicePage(data().MILESTONES, st.milePage || 0, 4);
          st.milePage = mPage.page;

          var bGrid = document.createElement("div");
          bGrid.className = "badge-grid";
          mPage.items.forEach(function (ml) {
            var unl = !!hl.milestones[ml.id];
            var bc = document.createElement("div");
            bc.className = "badge-card" + (unl ? " unlocked" : "");
            bc.innerHTML =
              '<div class="badge-card-title">' + (unl ? "★ " : "○ ") + escHtml(ml.title) + "</div>" +
              '<div class="badge-card-desc">' + escHtml(ml.desc) + "</div>";
            bGrid.appendChild(bc);
          });
          wrap.appendChild(bGrid);

          wrap.appendChild(ui().renderPager(mPage, function (np) {
            st.milePage = np;
            saveState(st);
            redraw();
          }));
        }

        container.appendChild(wrap);
        return;
      }

      // ---------------- 4C. PESTANYA: GRÀFIC ----------------
      if (st.tab === "grafic") {
        var cSwitch = document.createElement("div");
        cSwitch.className = "subtabs-row";
        [
          { id: "val", label: "Participació vs Caixa" },
          { id: "mrr", label: "MRR Mensual vs Costos" }
        ].forEach(function (cm) {
          cSwitch.appendChild(ui().mkBtn(
            "pill-btn" + (st.chartMode === cm.id ? " active" : ""),
            cm.label,
            function () {
              st.chartMode = cm.id;
              saveState(st);
              redraw();
            }
          ));
        });
        wrap.appendChild(cSwitch);

        var cb = document.createElement("div");
        cb.className = "chart-box";
        var prim = st.chartMode === "mrr" ? st.histRev : st.histVal;
        var sec = st.chartMode === "mrr" ? st.histCost : st.histCash;
        var chartTitle = st.chartMode === "mrr"
          ? "MRR MENSUAL (SÒLIDA) VS COSTOS MENSUALS (PUNT.)"
          : "VALOR PARTICIPACIÓ (SÒLIDA) VS CAIXA EMPRESA (PUNT.)";

        var startT = Math.max(1, st.q - prim.length + 1);
        cb.innerHTML =
          '<div class="scenario-kicker" style="margin-bottom:4px;"><span>' + chartTitle + "</span></div>" +
          ui().buildDualChartSVG(prim, sec, {
            height: 155,
            xStartLabel: "T" + startT,
            xEndLabel: "T" + st.q
          });
        wrap.appendChild(cb);

        var lb = document.createElement("div");
        lb.className = "log-list";
        st.log.slice(0, 5).forEach(function (entry) {
          var item = document.createElement("div");
          item.className = "log-item";
          item.textContent = entry;
          lb.appendChild(item);
        });
        wrap.appendChild(lb);

        container.appendChild(wrap);
        return;
      }

      // ---------------- 4D. PESTANYA: DECISIÓ (EPÍLEG / OUTCOME / DILEMA) ----------------
      if (st.status === "ended") {
        var endInfo = buildEndSummary(st, hl);
        var ep = document.createElement("div");
        ep.className = "outcome-panel";
        ep.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>' + escHtml(endInfo.kicker) + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + escHtml(endInfo.title) + "</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + escHtml(endInfo.body) + "</p>" +
          "</div>" +
          '<div class="chart-box">' +
            ui().buildDualChartSVG(st.histVal, st.histCash, {
              height: 138,
              xStartLabel: "T1",
              xEndLabel: "T" + st.q + " (Sòlida: Participació · Punt.: Caixa)"
            }) +
          "</div>";

        var bNextVenture = ui().mkBtn("btn-lg active", "Fundar següent empresa des del Holding →", function () {
          st = createPicker(0);
          saveState(st);
          redraw();
        });
        bNextVenture.style.width = "100%";
        ep.appendChild(bNextVenture);
        wrap.appendChild(ep);
        container.appendChild(wrap);
        return;
      }

      // Stage & Holding Banner
      var ctxBanner = document.createElement("div");
      ctxBanner.className = "context-banner";
      ctxBanner.innerHTML =
        "<span><b>" + escHtml(econ.stage.short) + "</b> · Focus " + escHtml(getFocusMode(st).short) + "</span>" +
        "<span>Holding: <b>" + escHtml(ui().fmtEur(holdingTotalNetWorth(hl, st))) + "</b></span>";
      wrap.appendChild(ctxBanner);

      if (st.lastOut) {
        var o = st.lastOut;
        var op = document.createElement("div");
        op.className = "outcome-panel";

        var pillsHtml =
          '<span class="delta-pill strong">Caixa ' + (o.dCash >= 0 ? "+" : "") + escHtml(ui().fmtEur(o.dCash)) + "</span>" +
          '<span class="delta-pill">MRR ' + (o.dRev >= 0 ? "+" : "") + escHtml(ui().fmtEur(o.dRev)) + "/m</span>";
        if (o.divPaid && o.divPaid > 0) {
          pillsHtml += '<span class="delta-pill strong">Holding +' + escHtml(ui().fmtEur(o.divPaid)) + "</span>";
        }
        if (o.passiveQ && o.passiveQ > 0) {
          pillsHtml += '<span class="delta-pill">Rendes PE +' + escHtml(ui().fmtEur(o.passiveQ)) + "</span>";
        }
        pillsHtml += '<span class="delta-pill">⚡' + st.energy + "</span>";

        op.innerHTML =
          "<div>" +
            '<div class="scenario-kicker">' +
              "<span>TANCAMENT TRIMESTRAL</span>" +
              "<span>PARTICIPACIÓ: " + escHtml(ui().fmtEur(founderCurrentStake(st))) + "</span>" +
            "</div>" +
            '<h3 class="scenario-title" style="margin-top:5px;">' + escHtml(o.title) + "</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + escHtml(o.narrative) + "</p>" +
            (o.stageUp
              ? '<div class="insight-box"><b>★ Nova etapa assolida:</b> ' + escHtml(o.stageUp) + "!</div>"
              : "") +
          "</div>" +
          '<div class="delta-pills">' + pillsHtml + "</div>";

        var bCont = ui().mkBtn("btn-lg active", "Entrar al Trimestre T" + st.q + " →", function () {
          st.lastOut = null;
          saveState(st);
          redraw();
        });
        bCont.style.width = "100%";
        op.appendChild(bCont);
        wrap.appendChild(op);
        container.appendChild(wrap);
        return;
      }

      // Active Dilemma Card & Shuffled Choices
      var dil = getActiveDilemmaWithShuffledOpts(st);
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker">' +
          "<span>" + escHtml(dil.tag) + " · " + escHtml(st.ventureName.toUpperCase()) + "</span>" +
          "<span>COST: " + escHtml(ui().fmtEur(st.cost)) + "/m</span>" +
        "</div>" +
        '<h3 class="scenario-title">' + escHtml(dil.title) + "</h3>" +
        '<p class="scenario-body">' + escHtml(dil.body) + "</p>";
      wrap.appendChild(card);

      var ch = document.createElement("div");
      ch.className = "choice-stack";
      dil.opts.forEach(function (opItem, idx) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + escHtml(opItem.k) + "</span>" +
          '<div class="choice-content">' +
            '<div class="choice-main">' + escHtml(opItem.t) + "</div>" +
            '<div class="choice-sub">' + escHtml(opItem.s) + "</div>" +
          "</div>";
        b.addEventListener("click", function (ev) {
          ev.preventDefault();
          stepQuarter(st, idx, hl);
          redraw();
        });
        ch.appendChild(b);
      });
      wrap.appendChild(ch);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    var hl = loadHolding();
    if (!st.choosingVenture && st.status === "playing") {
      return "F" + getStage(st.rev).id + "·T" + st.q + " · " + ui().fmtEur(st.rev) + "/m";
    }
    var nw = holdingTotalNetWorth(hl, null);
    if (nw > 0) return "Holding " + ui().fmtEur(nw);
    return "Garatge → Holding";
  }

  window.CalmGames.fundador = {
    id: "fundador",
    title: "Fundador des de Zero",
    desc: "De Garatge a Holding: escala 5 fases sense límit de trimestres, cobra dividends, fes Exits M&A i inverteix en Micro-PE.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Fundador des de Zero: De Garatge a Holding (v6)</h2>" +
      "<ul>" +
      "<li><b>5 Fases sense límit de temps:</b> comences al Garatge (&lt;4k €/m) i pots escalar fins a Imperi Consolidat (&gt;300k €/m) durant desenes de trimestres, cobrar dividends o vendre (M&amp;A / IPO).</li>" +
      "<li><b>Pestanya Empresa:</b> contracta fins a nivell 5 en 4 departaments (Producte, Vendes, Operacions, Marca), ajusta Tarifes, Política de Dividends i Focus trimestral vigent.</li>" +
      "<li><b>Pestanya Holding (Persistent):</b> tots els dividends, vendes secundàries i Exits s'acumulen al teu Holding per comprar 8 actius Micro-PE de renda passiva i autofinançar noves empreses amb +50k € o +250k € sense diluir-te!</li>" +
      "<li><b>Supervivència:</b> evita que la Caixa caigui sota 0 € o que l'Energia (⚡) arribi a 0.</li>" +
      "</ul>"
  };
})();
