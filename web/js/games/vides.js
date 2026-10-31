// Joc 1: Vides & Capital: Dinastia (v6 Deep Multi-Day Edition per a Kindle Paperwhite E-Ink)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "vides_state_v6";
  var META_KEY = "vides_meta_v6";

  function getData() {
    return (window.CalmData && window.CalmData.vides) ? window.CalmData.vides : {
      DYNASTY_NAMES: ["Rovira"],
      KID_NAMES: ["Júlia", "Martí"],
      ORIGINS: [],
      REGIMES: [{ id: "calm", label: "Expansió Suau", rCash: 0.025, rBonds: 0.035, rIdx: 0.09, rDiv: 0.075, rReits: 0.07, rVen: 0.14, reApprec: 0.03, inf: 0.02 }],
      BUCKETS: [],
      CAREER_RANKS: [{ level: 0, title: "Júnior", minSkills: 0 }],
      WORK_MODES: [{ id: "full", label: "100% Jornada", shortLabel: "100%", salMult: 1, dHealth: 0, dJoy: 0, countsWork: true }],
      COURSES: [],
      PROPERTIES: [],
      ACHIEVEMENTS: [],
      EVENTS: [],
      generateDynamicYearEvent: null
    };
  }

  function safeNum(v, def) {
    return (typeof v === "number" && !isNaN(v) && isFinite(v)) ? v : def;
  }

  // ==================== META & PERSISTENT ACHIEVEMENTS ====================
  function loadMeta() {
    var m = window.CalmStorage.get(META_KEY, null);
    if (!m || typeof m !== "object") {
      m = {
        unlocked: {},
        totalRuns: 0,
        maxGeneration: 1,
        bestNetWorth: 0,
        bestRank: "",
        hallOfFame: []
      };
    }
    if (!m.unlocked) m.unlocked = {};
    if (!m.hallOfFame) m.hallOfFame = [];
    m.totalRuns = safeNum(m.totalRuns, 0);
    m.maxGeneration = safeNum(m.maxGeneration, 1);
    m.bestNetWorth = safeNum(m.bestNetWorth, 0);
    return m;
  }

  function saveMeta(m) {
    window.CalmStorage.set(META_KEY, m);
  }

  // ==================== FINANCIAL & REAL ESTATE ENGINE ====================
  function findById(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return list[i];
    }
    return null;
  }

  function calcMortgagePayment(principal, annualRate, months) {
    principal = safeNum(principal, 0);
    if (principal <= 0 || months <= 0) return 0;
    var r = annualRate / 12;
    if (r <= 0) return Math.round(principal / months);
    var pow = Math.pow(1 + r, months);
    return Math.round((principal * r * pow) / (pow - 1));
  }

  function getPropDef(propId) {
    return findById(getData().PROPERTIES, propId);
  }

  function getOwnedProp(st, propId) {
    if (!st.properties) return null;
    for (var i = 0; i < st.properties.length; i++) {
      if (st.properties[i].id === propId) return st.properties[i];
    }
    return null;
  }

  function propMarketValue(st, propDef) {
    if (!propDef) return 0;
    return Math.max(1000, Math.round(propDef.basePrice * safeNum(st.rePriceIndex, 1)));
  }

  function propBuyPrice(st, propDef) {
    var mv = propMarketValue(st, propDef);
    var hasDiscount = (st.flags && st.flags.rehabSkill) || st.originId === "ofici";
    return hasDiscount ? Math.round(mv * 0.92) : mv;
  }

  function propGrossRent(st, propDef) {
    if (!propDef) return 0;
    return Math.round(propDef.baseRent * safeNum(st.rentIndex, 1));
  }

  function propMonthlyExp(st, propDef) {
    if (!propDef) return 0;
    return Math.round(propDef.baseExp * safeNum(st.rentIndex, 1));
  }

  function propNetMonthly(st, owned, propDef) {
    var gross = propGrossRent(st, propDef);
    var exp = propMonthlyExp(st, propDef);
    var mort = (owned && safeNum(owned.mortgageRemaining, 0) > 0) ? safeNum(owned.monthlyMortgage, 0) : 0;
    return gross - exp - mort;
  }

  function totalRealEstateEquity(st) {
    if (!st.properties || !st.properties.length) return 0;
    var eq = 0;
    for (var i = 0; i < st.properties.length; i++) {
      var ow = st.properties[i];
      var def = getPropDef(ow.id);
      if (def) {
        eq += propMarketValue(st, def) - Math.round(safeNum(ow.mortgageRemaining, 0));
      }
    }
    return eq;
  }

  function totalRealEstateCashflow(st) {
    if (!st.properties || !st.properties.length) return 0;
    var cf = 0;
    for (var i = 0; i < st.properties.length; i++) {
      var ow = st.properties[i];
      var def = getPropDef(ow.id);
      if (def) {
        cf += propNetMonthly(st, ow, def);
      }
    }
    return cf;
  }

  function recalcNetWorth(st) {
    st.liquidAssets = Math.max(0, Math.round(safeNum(st.liquidAssets, 0)));
    st.personalDebt = Math.max(0, Math.round(safeNum(st.personalDebt, 0)));
    if (st.liquidAssets > 100000000000) st.liquidAssets = 100000000000;
    var liquidPortfolio = st.liquidAssets - st.personalDebt;
    st.netWorth = liquidPortfolio + totalRealEstateEquity(st);
    st.passiveIncome = Math.round(safeNum(st.sideIncome, 0)) + totalRealEstateCashflow(st);
    return st.netWorth;
  }

  function addLiquid(st, delta) {
    delta = Math.round(safeNum(delta, 0));
    if (delta >= 0) {
      if (st.personalDebt > 0) {
        var pay = Math.min(st.personalDebt, delta);
        st.personalDebt -= pay;
        st.liquidAssets += (delta - pay);
      } else {
        st.liquidAssets += delta;
      }
    } else {
      var need = -delta;
      if (st.liquidAssets >= need) {
        st.liquidAssets -= need;
      } else {
        var rem = need - st.liquidAssets;
        st.liquidAssets = 0;
        st.personalDebt += rem;
      }
    }
    recalcNetWorth(st);
  }

  function getPensionMonthly(st) {
    if (st.age < 67 || safeNum(st.yearsWorked, 0) < 10) return 0;
    var yrs = Math.min(40, st.yearsWorked);
    var base = 780 + yrs * 38;
    return Math.round(Math.min(3100, base) * safeNum(st.rentIndex, 1));
  }

  function syncCareerAndSalary(st) {
    var ranks = getData().CAREER_RANKS;
    var bestRank = st.careerRank || 0;
    for (var i = 0; i < ranks.length; i++) {
      if (st.skills >= ranks[i].minSkills && ranks[i].level > bestRank) {
        bestRank = ranks[i].level;
      }
    }
    if (bestRank > (st.careerRank || 0)) {
      var diff = bestRank - (st.careerRank || 0);
      st.careerRank = bestRank;
      st.baseSalary = Math.round(st.baseSalary * (1 + 0.06 * diff));
    }

    var wm = findById(getData().WORK_MODES, st.workMode) || getData().WORK_MODES[0];
    if (st.workMode === "retired") {
      st.salary = getPensionMonthly(st);
    } else {
      st.salary = Math.round(safeNum(st.baseSalary, 0) * wm.salMult);
    }
    recalcNetWorth(st);
  }

  function getEffectiveExpenses(st) {
    var minFloor = Math.round(700 * safeNum(st.rentIndex, 1));
    var base = Math.max(minFloor, safeNum(st.expenses, 1000));
    if (st.lifestyle === "frugal") return Math.round(base * 0.86);
    if (st.lifestyle === "hedonist") return Math.round(base * 1.22);
    return Math.round(base);
  }

  function getMonthlyCashflow(st) {
    var inc = safeNum(st.salary, 0) + safeNum(st.sideIncome, 0) + totalRealEstateCashflow(st);
    if (st.workMode !== "retired" && st.age >= 67) {
      inc += Math.round(getPensionMonthly(st) * 0.5);
    }
    var debtInterestMonthly = st.personalDebt > 0 ? Math.round((st.personalDebt * 0.09) / 12) : 0;
    return inc - getEffectiveExpenses(st) - debtInterestMonthly;
  }

  function fireTarget(st) {
    var effExp = getEffectiveExpenses(st);
    var covered = safeNum(st.sideIncome, 0) + (st.age >= 67 ? getPensionMonthly(st) : 0);
    var monthlyNeed = Math.max(0, effExp - covered);
    var swr = safeNum(st.swr, 4);
    if (swr <= 0) swr = 4;
    return Math.round(monthlyNeed * 12 * (100 / swr));
  }

  function firePct(st) {
    var effExp = getEffectiveExpenses(st);
    var totalPassive = safeNum(st.sideIncome, 0) + Math.max(0, totalRealEstateCashflow(st)) + (st.age >= 67 ? getPensionMonthly(st) : 0);
    if (totalPassive >= effExp && st.netWorth > 0) {
      var tgtMin = Math.max(1, fireTarget(st));
      return Math.max(100, Math.min(999, Math.round((st.netWorth / tgtMin) * 100)));
    }
    var tgt = fireTarget(st);
    if (tgt <= 0) return st.netWorth >= 0 ? 100 : 0;
    if (st.netWorth <= 0) return 0;
    return Math.min(999, Math.round((st.netWorth / tgt) * 100));
  }

  // ==================== ACHIEVEMENTS EVALUATION ====================
  function checkAchievements(st) {
    var meta = loadMeta();
    var newlyUnlocked = [];

    function unlock(id) {
      if (!meta.unlocked[id]) {
        meta.unlocked[id] = true;
        var def = findById(getData().ACHIEVEMENTS, id);
        if (def) newlyUnlocked.push(def.title);
      }
    }

    var nw = st.netWorth;
    var fPct = firePct(st);
    var propsCount = st.properties ? st.properties.length : 0;
    var mortgageFreeCount = 0;
    if (st.properties) {
      for (var i = 0; i < st.properties.length; i++) {
        if (safeNum(st.properties[i].mortgageRemaining, 0) <= 0) mortgageFreeCount++;
      }
    }
    var coursesCount = 0;
    if (st.coursesOwned) {
      for (var k in st.coursesOwned) {
        if (Object.prototype.hasOwnProperty.call(st.coursesOwned, k) && st.coursesOwned[k]) coursesCount++;
      }
    }

    if (nw >= 10000) unlock("first_10k");
    if (nw >= 100000) unlock("club_100k");
    if (nw >= 500000) unlock("half_mil");
    if (nw >= 1000000) unlock("millionaire");
    if (nw >= 1500000 && fPct >= 100) unlock("fat_fire");
    if (st.age < 40 && fPct >= 50) unlock("coast_fire");
    if (st.age < 40 && fPct >= 100) unlock("lean_fire_40");
    if (st.originId === "deute" && nw >= 100000) unlock("debt_slayer");
    if (propsCount >= 1) unlock("first_brick");
    if (propsCount >= 3) unlock("rent_lord_3");
    if (mortgageFreeCount >= 2) unlock("mortgage_free");
    if (propsCount >= 5) unlock("real_tycoon");
    if (coursesCount >= 5) unlock("polymath");
    if (safeNum(st.sideIncome, 0) >= 600) unlock("side_hustler");
    if (safeNum(st.crashesSurvived, 0) >= 4 && nw >= 300000) unlock("crisis_master");
    if (st.age >= 80 && st.health >= 80 && st.joy >= 80) unlock("iron_health_80");
    if (st.age >= 85 && st.health > 0) unlock("full_life_85");
    if (st.generation >= 2) unlock("dynasty_gen2");
    if (st.generation >= 3) unlock("dynasty_gen3");
    if (nw >= 5000000 && st.generation >= 2) unlock("dynasty_empire");

    if (st.generation > meta.maxGeneration) meta.maxGeneration = st.generation;
    if (nw > meta.bestNetWorth) meta.bestNetWorth = nw;

    saveMeta(meta);
    return newlyUnlocked;
  }

  // ==================== STATE CREATION & DYNASTY SUCCESSION ====================
  function createOriginPickerState() {
    return { choosingOrigin: true, originPage: 0 };
  }

  function normalizeAlloc(alloc) {
    var keys = ["cash", "bonds", "index", "dividend", "reits", "venture"];
    var out = {};
    var sum = 0;
    var i;
    for (i = 0; i < keys.length; i++) {
      var v = Math.max(0, Math.round(safeNum(alloc && alloc[keys[i]], 0)));
      out[keys[i]] = v;
      sum += v;
    }
    if (sum <= 0) {
      return { cash: 20, bonds: 20, index: 40, dividend: 0, reits: 20, venture: 0 };
    }
    if (sum !== 100) {
      out.cash = Math.max(0, out.cash + (100 - sum));
    }
    return out;
  }

  function createNewRun(originId, dynastyOpts) {
    var DATA = getData();
    var orig = DATA.ORIGINS[0];
    for (var i = 0; i < DATA.ORIGINS.length; i++) {
      if (DATA.ORIGINS[i].id === originId) orig = DATA.ORIGINS[i];
    }

    var seed = Math.floor(Math.random() * 900000) + 100000;
    var rng = window.CalmUI.seededRng(seed);
    var gen = (dynastyOpts && dynastyOpts.generation) ? dynastyOpts.generation : 1;
    var dynName = (dynastyOpts && dynastyOpts.dynastyName)
      ? dynastyOpts.dynastyName
      : "Casa " + DATA.DYNASTY_NAMES[Math.floor(rng() * DATA.DYNASTY_NAMES.length)];

    var startLiquid = orig.liquidAssets;
    var startDebt = orig.personalDebt;
    var startProps = [];
    var eduSkillBonus = 0;
    var salMult = 1;
    var dynYieldBonus = 0;

    if (dynastyOpts && gen > 1) {
      startLiquid = Math.max(0, Math.round(safeNum(dynastyOpts.inheritedLiquid, 0)));
      startDebt = 0;
      startProps = dynastyOpts.inheritedProps || [];
      eduSkillBonus = safeNum(dynastyOpts.eduSkillBonus, 12);
      salMult = safeNum(dynastyOpts.salMult, 1.1);
      dynYieldBonus = safeNum(dynastyOpts.dynYieldBonus, 0.003);
    }

    var baseSal = Math.round(orig.baseSalary * salMult);
    var st = {
      version: 6,
      choosingOrigin: false,
      seed: seed,
      generation: gen,
      dynastyName: dynName,
      heirName: (dynastyOpts && dynastyOpts.heirName) ? dynastyOpts.heirName : null,
      dynYieldBonus: dynYieldBonus,
      step: 0,
      age: 18,
      originId: orig.id,
      originName: orig.name,
      baseSalary: baseSal,
      salary: baseSal,
      careerRank: 0,
      skills: window.CalmUI.clamp(orig.skills + eduSkillBonus, 0, 120),
      yearsWorked: 0,
      workMode: "full",
      coursesOwned: {},
      sideIncome: 0,
      passiveIncome: 0,
      expenses: orig.expenses,
      lifestyle: "balanced",
      swr: 4,
      liquidAssets: startLiquid,
      personalDebt: startDebt,
      properties: startProps,
      rePriceIndex: 1,
      rentIndex: 1,
      netWorth: 0,
      health: orig.health,
      joy: orig.joy,
      alloc: normalizeAlloc(orig.alloc),
      regimeIdx: 0,
      crashesSurvived: 0,
      kids: [],
      tab: "vida",
      subActius: "alloc",
      subLlegat: "chart",
      uiAllocPage: 0,
      uiPropPage: 0,
      uiCoursePage: 0,
      uiAchPage: 0,
      uiMenuOpen: false,
      flags: startProps.length > 0 ? { hasProperty: true } : {},
      seenEvents: {},
      currentEventId: null,
      dynamicEvent: null,
      lastYearReport: null,
      status: "playing",
      endSummary: null,
      historyWorth: [],
      historyFire: [],
      log: []
    };

    syncCareerAndSalary(st);
    recalcNetWorth(st);
    st.historyWorth.push(st.netWorth);
    st.historyFire.push(fireTarget(st));

    var startMsg = "18a · Gen " + gen + " (" + dynName + ") · Inici «" + orig.name + "» (" + window.CalmUI.fmtEur(st.netWorth) + ").";
    st.log.push(startMsg);

    checkAchievements(st);
    pickNextEvent(st);
    return st;
  }

  function continueDynasty(prevSt) {
    var DATA = getData();
    var rate = (prevSt.flags && prevSt.flags.trustPlan) ? 0.92 : 0.80;
    var prevNet = Math.max(0, safeNum(prevSt.netWorth, 0));
    var targetInheritedNet = Math.round(prevNet * rate);

    // Transfer family real estate rebased to clean generation baseline (rePriceIndex = 1)
    var inheritedProps = [];
    var propsBaseValueSum = 0;
    if (prevSt.properties && prevSt.properties.length > 0) {
      for (var i = 0; i < prevSt.properties.length; i++) {
        var oldP = prevSt.properties[i];
        var def = getPropDef(oldP.id);
        if (def) {
          var prevMv = propMarketValue(prevSt, def);
          var debtRatio = prevMv > 0 ? window.CalmUI.clamp(safeNum(oldP.mortgageRemaining, 0) / prevMv, 0, 0.85) : 0;
          var newMort = Math.round(def.basePrice * debtRatio);
          inheritedProps.push({
            id: def.id,
            boughtAge: 18,
            mortgageRemaining: newMort,
            monthlyMortgage: newMort > 0 ? calcMortgagePayment(newMort, 0.032, 240) : 0,
            yearsLeft: newMort > 0 ? 20 : 0
          });
          propsBaseValueSum += (def.basePrice - newMort);
        }
      }
    }

    var inheritedLiquid = 0;
    if (targetInheritedNet >= propsBaseValueSum) {
      inheritedLiquid = targetInheritedNet - propsBaseValueSum;
    } else if (inheritedProps.length > 0) {
      // Apply succession mortgage across inherited properties so total net matches exact inheritance rate
      var taxGap = propsBaseValueSum - targetInheritedNet;
      var share = Math.ceil(taxGap / inheritedProps.length);
      var newEqSum = 0;
      for (var j = 0; j < inheritedProps.length; j++) {
        var ip = inheritedProps[j];
        var pDef = getPropDef(ip.id);
        var maxM = Math.round(pDef.basePrice * 0.9);
        ip.mortgageRemaining = Math.min(maxM, ip.mortgageRemaining + share);
        ip.monthlyMortgage = calcMortgagePayment(ip.mortgageRemaining, 0.032, 300);
        ip.yearsLeft = 25;
        newEqSum += (pDef.basePrice - ip.mortgageRemaining);
      }
      inheritedLiquid = Math.max(0, targetInheritedNet - newEqSum);
    }

    // Pick child vocation (exclude debt challenge origin for heir)
    var rng = window.CalmUI.seededRng(prevSt.seed + prevSt.generation * 777);
    var heirOrigins = ["eng", "salut", "ofici", "crea", "opos"];
    var nextOriginId = heirOrigins[(prevSt.generation + Math.floor(rng() * heirOrigins.length)) % heirOrigins.length];
    var heirKid = (prevSt.kids && prevSt.kids.length > 0) ? prevSt.kids[0] : { name: DATA.KID_NAMES[0] };

    var eduBonus = 10;
    if (prevSt.flags && prevSt.flags.kidFinLit) eduBonus += 6;
    if (prevSt.flags && prevSt.flags.kidEliteEdu) eduBonus += 5;
    if (prevSt.flags && prevSt.flags.kidFund) eduBonus += 4;

    var nextSt = createNewRun(nextOriginId, {
      generation: (prevSt.generation || 1) + 1,
      dynastyName: prevSt.dynastyName || "Casa Rovira",
      heirName: heirKid.name,
      inheritedLiquid: inheritedLiquid,
      inheritedProps: inheritedProps,
      eduSkillBonus: eduBonus,
      salMult: (prevSt.flags && prevSt.flags.kidEliteEdu) ? 1.18 : 1.10,
      dynYieldBonus: Math.min(0.012, (prevSt.generation || 1) * 0.003)
    });

    nextSt.lastYearReport = {
      ageFrom: prevSt.age,
      ageTo: 18,
      narrative: heirKid.name + " assumeix el relleu de " + nextSt.dynastyName + " (Gen " + nextSt.generation + ") retenint el " + Math.round(rate * 100) + "% del llegat!",
      dWorth: nextSt.netWorth,
      dHealth: 0,
      dJoy: 0,
      newAch: []
    };
    return nextSt;
  }

  function sanitizeState(st) {
    if (!st || typeof st !== "object") return createOriginPickerState();
    if (st.choosingOrigin) {
      st.originPage = safeNum(st.originPage, 0);
      return st;
    }
    st.generation = safeNum(st.generation, 1);
    st.dynastyName = st.dynastyName || "Casa Rovira";
    st.age = safeNum(st.age, 18);
    st.step = safeNum(st.step, 0);
    st.baseSalary = safeNum(st.baseSalary, 1600);
    st.skills = safeNum(st.skills, 20);
    st.careerRank = safeNum(st.careerRank, 0);
    st.yearsWorked = safeNum(st.yearsWorked, 0);
    st.workMode = st.workMode || "full";
    st.coursesOwned = st.coursesOwned || {};
    st.sideIncome = safeNum(st.sideIncome, 0);
    st.expenses = safeNum(st.expenses, 1000);
    st.lifestyle = st.lifestyle || "balanced";
    st.swr = safeNum(st.swr, 4);
    st.liquidAssets = safeNum(st.liquidAssets, 0);
    st.personalDebt = safeNum(st.personalDebt, 0);
    st.properties = st.properties || [];
    st.rePriceIndex = safeNum(st.rePriceIndex, 1);
    st.rentIndex = safeNum(st.rentIndex, 1);
    st.health = window.CalmUI.clamp(safeNum(st.health, 80), 0, 100);
    st.joy = window.CalmUI.clamp(safeNum(st.joy, 75), 0, 100);
    st.alloc = normalizeAlloc(st.alloc);
    st.regimeIdx = safeNum(st.regimeIdx, 0) % getData().REGIMES.length;
    st.crashesSurvived = safeNum(st.crashesSurvived, 0);
    st.kids = st.kids || [];
    st.flags = st.flags || {};
    st.seenEvents = st.seenEvents || {};
    st.historyWorth = st.historyWorth || [];
    st.historyFire = st.historyFire || [];
    st.log = st.log || [];
    st.tab = st.tab || "vida";
    st.subActius = st.subActius || "alloc";
    st.subLlegat = st.subLlegat || "chart";
    syncCareerAndSalary(st);
    recalcNetWorth(st);
    return st;
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved) return sanitizeState(saved);
    return createOriginPickerState();
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  // ==================== EVENT SELECTION & COMBINATORIAL ENGINE ====================
  function getMaxKidAge(st) {
    if (!st.kids || !st.kids.length) return -1;
    var maxA = 0;
    for (var i = 0; i < st.kids.length; i++) {
      var ka = st.age - safeNum(st.kids[i].birthAge, st.age);
      if (ka > maxA) maxA = ka;
    }
    return maxA;
  }

  function pickNextEvent(st) {
    var DATA = getData();
    var rng = window.CalmUI.seededRng(st.seed + st.age * 131 + st.step * 37 + st.generation * 911);
    var isFire = firePct(st) >= 100;
    var maxKidAge = getMaxKidAge(st);
    var candidates = [];

    // In later generations, mix 18% combinatorial turns for infinite freshness across 300+ years
    var forceDynamic = (st.generation > 1 && rng() < 0.18 && !isFire);

    if (!forceDynamic) {
      for (var i = 0; i < DATA.EVENTS.length; i++) {
        var ev = DATA.EVENTS[i];
        if (st.seenEvents[ev.id]) continue;
        if (st.age < ev.minAge || st.age > ev.maxAge) continue;
        if (ev.needWorth && st.netWorth < ev.needWorth) continue;
        if (ev.needSkills && st.skills < ev.needSkills) continue;
        if (ev.needFire && !isFire) continue;
        if (ev.reqFlag && !st.flags[ev.reqFlag]) continue;
        if (ev.noFlag && st.flags[ev.noFlag]) continue;
        if (typeof ev.minKidAge === "number" && maxKidAge < ev.minKidAge) continue;

        // Higher weight for story chains and major milestones
        var weight = 1;
        if (ev.needFire || ev.id.indexOf("ch_") === 0 || ev.id === "ev_34_first_100k" || ev.id === "ev_67_official_retirement" || ev.id === "ev_72_dynasty_ready_notice") {
          weight = 4;
        }
        for (var w = 0; w < weight; w++) {
          candidates.push(ev);
        }
      }
    }

    if (candidates.length > 0) {
      var pick = candidates[Math.floor(rng() * candidates.length)];
      st.currentEventId = pick.id;
      st.dynamicEvent = null;
      return;
    }

    // Combinatorial generator (12 domains x 8 economic contexts x 3 tactical options)
    if (DATA.generateDynamicYearEvent) {
      var dyn = DATA.generateDynamicYearEvent(st, rng);
      st.currentEventId = dyn.id;
      st.dynamicEvent = {
        id: dyn.id,
        tag: dyn.tag,
        title: dyn.title,
        body: dyn.body
      };
    } else {
      st.currentEventId = "dyn_fallback_" + st.age;
      st.dynamicEvent = null;
    }
  }

  function getEventObject(st) {
    var DATA = getData();
    for (var i = 0; i < DATA.EVENTS.length; i++) {
      if (DATA.EVENTS[i].id === st.currentEventId) return DATA.EVENTS[i];
    }
    var rng = window.CalmUI.seededRng(st.seed + st.age * 131 + st.step * 37 + st.generation * 911);
    if (DATA.generateDynamicYearEvent) {
      return DATA.generateDynamicYearEvent(st, rng);
    }
    return {
      id: "fallback_" + st.age,
      tag: "DECISIÓ ANUAL",
      title: "Equilibri vital (" + st.age + " anys)",
      body: "Un nou any per cuidar salut, ofici i patrimoni.",
      opts: [
        { k: "A", t: "Reforçar estalvi", s: "+1.500 €", fn: function (s, r, api) { api.cash(1500); return "Sumes reserves."; } },
        { k: "B", t: "Reduir despeses", s: "-50 €/m", fn: function (s, r, api) { api.exp(-50); return "Ajustes costos."; } },
        { k: "C", t: "Cuidar la salut", s: "Salut +8 · Goig +8", fn: function (s, r, api) { api.stats(8, 8, 1); return "Bona energia."; } }
      ]
    };
  }

  function makeEventApi(st, rng) {
    var DATA = getData();
    return {
      cash: function (delta) { addLiquid(st, delta); },
      salPct: function (pct) {
        var realCap = 5200 * safeNum(st.rentIndex, 1);
        var effPct = pct;
        if (pct > 0 && st.baseSalary > realCap) {
          effPct = pct * 0.42; // Marginal IRPF bracket progression
        }
        if (pct > 0 && st.baseSalary > realCap * 1.65) {
          effPct = pct * 0.2;
        }
        st.baseSalary = Math.max(950, Math.round(st.baseSalary * (1 + effPct / 100)));
        syncCareerAndSalary(st);
      },
      exp: function (delta) {
        var minFloor = Math.round(700 * safeNum(st.rentIndex, 1));
        st.expenses = Math.max(minFloor, Math.round(st.expenses + delta));
      },
      side: function (delta) {
        st.sideIncome = Math.max(0, Math.round(st.sideIncome + delta));
        recalcNetWorth(st);
      },
      stats: function (dHealth, dJoy, dSkills) {
        st.health = window.CalmUI.clamp(st.health + safeNum(dHealth, 0), 0, 100);
        st.joy = window.CalmUI.clamp(st.joy + safeNum(dJoy, 0), 0, 100);
        st.skills = window.CalmUI.clamp(st.skills + safeNum(dSkills, 0), 0, 120);
        syncCareerAndSalary(st);
      },
      addKid: function () {
        var used = {};
        for (var i = 0; i < st.kids.length; i++) used[st.kids[i].name] = true;
        var pool = [];
        for (var j = 0; j < DATA.KID_NAMES.length; j++) {
          if (!used[DATA.KID_NAMES[j]]) pool.push(DATA.KID_NAMES[j]);
        }
        if (!pool.length) pool = DATA.KID_NAMES;
        var nm = pool[Math.floor(rng() * pool.length)];
        st.kids.push({ name: nm, birthAge: st.age });
        st.flags.hadFirstKid = true;
        return nm;
      },
      fmt: function (n) { return window.CalmUI.fmtEur(n); }
    };
  }

  // ==================== 1-YEAR SIMULATION STEP (18 -> 85) ====================
  function stepSimulation(st, optIdx) {
    var DATA = getData();
    var rng = window.CalmUI.seededRng(st.seed + st.age * 409 + optIdx * 29 + st.generation * 53);
    var ev = getEventObject(st);
    var opt = ev.opts[optIdx] || ev.opts[0];
    st.seenEvents[ev.id] = true;

    var prevAge = st.age;
    var prevWorth = st.netWorth;
    var prevHealth = st.health;
    var prevJoy = st.joy;

    // 1. Macro regime return on 6-bucket liquid portfolio
    var reg = DATA.REGIMES[st.regimeIdx] || DATA.REGIMES[0];
    if (reg.id === "crash") st.crashesSurvived = safeNum(st.crashesSurvived, 0) + 1;

    var noise = (rng() - 0.5) * 0.03;
    var quantBonus = (st.flags && st.flags.quantMaster) ? 0.006 : 0;
    var skillYield = Math.min(0.004, Math.floor(st.skills / 30) * 0.001);
    var extraYield = quantBonus + skillYield + safeNum(st.dynYieldBonus, 0);

    var annualPortRet =
      (st.alloc.cash / 100) * reg.rCash +
      (st.alloc.bonds / 100) * reg.rBonds +
      (st.alloc.index / 100) * (reg.rIdx + noise) +
      (st.alloc.dividend / 100) * (reg.rDiv + noise * 0.6) +
      (st.alloc.reits / 100) * reg.rReits +
      (st.alloc.venture / 100) * (reg.rVen + noise * 2.1) +
      extraYield;

    if (st.liquidAssets > 0) {
      var netPortRet = annualPortRet > 0 ? annualPortRet * 0.86 : annualPortRet;
      st.liquidAssets = Math.max(0, Math.round(st.liquidAssets * (1 + netPortRet)));
      // Progressive wealth & solidarity tax above 700k € (Catalonia scale, mitigated by Holding/Trust)
      var taxShield = (st.flags && st.flags.trustPlan) ? 0.65 : 1.0;
      if (st.liquidAssets > 700000) {
        var tier1 = Math.min(st.liquidAssets - 700000, 1800000) * 0.013 * taxShield;
        var tier2 = Math.min(Math.max(0, st.liquidAssets - 2500000), 7500000) * 0.025 * taxShield;
        var tier3 = Math.max(0, st.liquidAssets - 10000000) * 0.036 * taxShield;
        st.liquidAssets = Math.max(0, Math.round(st.liquidAssets - tier1 - tier2 - tier3));
      }
    }
    if (st.personalDebt > 0) {
      st.personalDebt = Math.round(st.personalDebt * 1.09); // 9% TAE debt spiral
    }

    // 2. Real estate market valuation, rent index & 12-month fixed 3.2% mortgage amortization
    st.rePriceIndex = Math.max(0.5, Math.round(st.rePriceIndex * (1 + reg.reApprec) * 10000) / 10000);
    st.rentIndex = Math.max(0.7, Math.round(st.rentIndex * (1 + reg.inf * 0.75) * 10000) / 10000);

    var reNetYear = 0;
    if (st.properties && st.properties.length > 0) {
      for (var p = 0; p < st.properties.length; p++) {
        var ow = st.properties[p];
        var pDef = getPropDef(ow.id);
        if (!pDef) continue;
        var mGross = propGrossRent(st, pDef);
        var mExp = propMonthlyExp(st, pDef);
        for (var m = 0; m < 12; m++) {
          var mPay = 0;
          if (ow.mortgageRemaining > 0 && ow.monthlyMortgage > 0) {
            var interest = ow.mortgageRemaining * (0.032 / 12);
            mPay = Math.min(ow.monthlyMortgage, Math.ceil(ow.mortgageRemaining + interest));
            var principalPaid = Math.max(0, mPay - interest);
            ow.mortgageRemaining = Math.max(0, ow.mortgageRemaining - principalPaid);
            if (ow.mortgageRemaining < 5) {
              ow.mortgageRemaining = 0;
              ow.monthlyMortgage = 0;
              ow.yearsLeft = 0;
            }
          }
          reNetYear += (mGross - mExp - mPay);
        }
        if (ow.mortgageRemaining > 0 && ow.yearsLeft > 0) {
          ow.yearsLeft = Math.max(1, ow.yearsLeft - 1);
        }
      }
    }

    // 3. Work mode, salary, career experience & annual cashflow
    var wm = findById(DATA.WORK_MODES, st.workMode) || DATA.WORK_MODES[0];
    if (wm.countsWork && st.age < 70) {
      st.yearsWorked += 1;
      if (st.step % 2 === 0) st.skills = window.CalmUI.clamp(st.skills + 1, 0, 120);
    }
    syncCareerAndSalary(st);

    var activeAndSideYear = (safeNum(st.salary, 0) + safeNum(st.sideIncome, 0)) * 12;
    if (st.workMode !== "retired" && st.age >= 67) {
      activeAndSideYear += Math.round(getPensionMonthly(st) * 0.5) * 12;
    }
    var annualExpenses = getEffectiveExpenses(st) * 12;
    addLiquid(st, activeAndSideYear + Math.round(reNetYear) - annualExpenses);

    // Inflation drift & natural career progression
    var salGrowth = reg.inf * 0.68 + (wm.countsWork && st.age < 42 ? 0.005 : 0);
    st.baseSalary = Math.round(st.baseSalary * (1 + salGrowth));
    st.expenses = Math.round(st.expenses * (1 + reg.inf * 0.72));
    if (st.sideIncome > 0) st.sideIncome = Math.round(st.sideIncome * (1 + reg.inf * 0.5));

    // Lifestyle & work mode wellbeing impact
    st.health += wm.dHealth;
    st.joy += wm.dJoy;
    if (st.lifestyle === "frugal") {
      st.joy -= 1;
    } else if (st.lifestyle === "hedonist") {
      st.joy += 2;
    } else {
      st.health += 1;
      st.joy += 1;
    }

    // Natural aging curve (gentle early, steeper in 70s-80s unless cared for)
    var ageWear = st.age < 50 ? 1 : (st.age < 70 ? 2 : 3);
    st.health -= ageWear;

    // 4. Execute player's tactical/narrative choice
    var api = makeEventApi(st, rng);
    var narrative = opt.fn(st, rng, api) || "";

    // Liquidity crunch check if 0% cash+bonds in crash
    var extraNote = "";
    if (reg.id === "crash" && (st.alloc.cash + st.alloc.bonds === 0) && st.liquidAssets > 20000) {
      var pen = Math.round(st.liquidAssets * 0.04);
      addLiquid(st, -pen);
      extraNote = " (0% reserva defensiva en ple crac: -" + window.CalmUI.fmtEur(pen) + ").";
    }

    // 5. Advance 1 year
    st.age += 1;
    st.step += 1;
    st.health = window.CalmUI.clamp(Math.round(st.health), 0, 100);
    st.joy = window.CalmUI.clamp(Math.round(st.joy), 0, 100);
    syncCareerAndSalary(st);
    recalcNetWorth(st);

    st.historyWorth.push(st.netWorth);
    st.historyFire.push(fireTarget(st));

    var dWorth = st.netWorth - prevWorth;
    var dHealth = st.health - prevHealth;
    var dJoy = st.joy - prevJoy;

    var logEntry = st.age + "a · " + ev.title.slice(0, 30) + " (" + (dWorth >= 0 ? "+" : "") + window.CalmUI.fmtEur(dWorth) + ")";
    st.log.unshift(logEntry);
    if (st.log.length > 8) st.log.pop();

    // Advance macro regime stochastically with realistic persistence
    var rRoll = rng();
    if (rRoll < 0.36) {
      // keep current regime 36% of years
    } else if (rRoll < 0.58) st.regimeIdx = 0;
    else if (rRoll < 0.72) st.regimeIdx = 1;
    else if (rRoll < 0.82) st.regimeIdx = 2;
    else if (rRoll < 0.90) st.regimeIdx = 3;
    else if (rRoll < 0.96) st.regimeIdx = 4;
    else st.regimeIdx = 5;

    var newAch = checkAchievements(st);

    // 6. Check End of Generation (Age 85 or Health == 0)
    if (st.health <= 0 || st.age >= 85) {
      st.status = "ended";
      st.endSummary = computeEndArchetype(st);
      recordHallOfFame(st);
      st.lastYearReport = null;
      return;
    }

    st.lastYearReport = {
      ageFrom: prevAge,
      ageTo: st.age,
      narrative: narrative + extraNote,
      dWorth: dWorth,
      dHealth: dHealth,
      dJoy: dJoy,
      portRetPct: Math.round(annualPortRet * 100),
      newAch: newAch
    };

    pickNextEvent(st);
  }

  function computeEndArchetype(st) {
    var nwFmt = window.CalmUI.fmtEur(st.netWorth);
    if (st.health <= 0) {
      return {
        rank: "Col·lapse Vital als " + st.age + " anys",
        quote: "Patrimoni de " + nwFmt + ", però la salut va arribar al límit als " + st.age + " anys. Cap interès compost compensa descuidar el cos."
      };
    }
    if (st.generation >= 2 && st.netWorth >= 2500000 && st.joy >= 70) {
      return {
        rank: "★ Patriarca / Matriarca Il·lustre (" + st.dynastyName + " · Gen " + st.generation + ")",
        quote: "Culmines els 85 anys amb " + nwFmt + ", " + st.properties.length + " immobles i plenitud (" + st.joy + "/100). Has multiplicat el llegat amb saviesa exemplar."
      };
    }
    if (st.flags.fireAge && st.flags.fireAge <= 45 && st.joy >= 75 && st.health >= 65) {
      return {
        rank: "★ Mestre/a del Temps Lliure (FIRE als " + st.flags.fireAge + "a)",
        quote: "Arribes als 85 anys amb " + nwFmt + ", salut (" + st.health + ") i goig (" + st.joy + "). Vas comprar dècades senceres de llibertat autèntica."
      };
    }
    if (st.netWorth >= 1500000 && st.joy < 50) {
      return {
        rank: "Magnat d'Excel Solitari",
        quote: "Tanques els 85 anys amb " + nwFmt + ", però amb felicitat baixa (" + st.joy + "). Vas acumular xifres oblidant regalar-te vida pel camí."
      };
    }
    if (st.netWorth >= 1000000 && st.joy >= 70) {
      return {
        rank: "Arquitecte/a d'Abundància Serena",
        quote: "Patrimoni final de " + nwFmt + " als 85 anys, envoltat de calma, salut cuidada i propòsit compartit."
      };
    }
    if (st.netWorth >= 350000) {
      return {
        rank: "Longevitat Sòlida i Lliure",
        quote: "Arribes als 85 anys amb " + nwFmt + ", independència completa i una vellesa digna i tranquil·la."
      };
    }
    if (st.joy >= 78) {
      return {
        rank: "Savi Mediterrani del Bon Viure",
        quote: "Patrimoni modest (" + nwFmt + "), però amb una alegria vital envejable (" + st.joy + "/100) fins als 85 anys."
      };
    }
    return {
      rank: "Supervivent de Set Dècades",
      quote: "Completes el viatge als 85 anys amb " + nwFmt + " després de sortejar crisis, girs i aprenentatges intensos."
    };
  }

  function recordHallOfFame(st) {
    var meta = loadMeta();
    meta.totalRuns = (meta.totalRuns || 0) + 1;
    if (st.netWorth >= meta.bestNetWorth) {
      meta.bestNetWorth = st.netWorth;
      meta.bestRank = st.endSummary ? st.endSummary.rank : "";
    }
    meta.hallOfFame.unshift({
      gen: st.generation,
      dynasty: st.dynastyName,
      age: st.age,
      worth: st.netWorth,
      rank: st.endSummary ? st.endSummary.rank : ""
    });
    if (meta.hallOfFame.length > 8) meta.hallOfFame.length = 8;
    saveMeta(meta);
  }

  // ==================== PORTFOLIO, REAL ESTATE & CAREER ACTIONS ====================
  function adjustAlloc(st, key, delta) {
    var cur = safeNum(st.alloc[key], 0);
    var next = window.CalmUI.clamp(cur + delta, 0, 100);
    var diff = next - cur;
    if (diff === 0) return;

    var order = ["cash", "bonds", "index", "dividend", "reits", "venture"];
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

  function buyProperty(st, propId, useMortgage) {
    if (getOwnedProp(st, propId)) return false;
    var def = getPropDef(propId);
    if (!def) return false;
    var price = propBuyPrice(st, def);

    if (!useMortgage) {
      if (st.liquidAssets < price) return false;
      st.liquidAssets -= price;
      st.properties.push({
        id: propId,
        boughtAge: st.age,
        mortgageRemaining: 0,
        monthlyMortgage: 0,
        yearsLeft: 0
      });
    } else {
      if (st.age > 68) return false;
      var down = Math.round(price * 0.25);
      if (st.liquidAssets < down) return false;
      var loan = price - down;
      st.liquidAssets -= down;
      st.properties.push({
        id: propId,
        boughtAge: st.age,
        mortgageRemaining: loan,
        monthlyMortgage: calcMortgagePayment(loan, 0.032, 300),
        yearsLeft: 25
      });
    }

    st.flags.hasProperty = true;
    recalcNetWorth(st);
    st.log.unshift(st.age + "a · Compra «" + def.name + "» (" + (useMortgage ? "Hipo 25%" : "Comptat") + ").");
    if (st.log.length > 8) st.log.pop();
    checkAchievements(st);
    return true;
  }

  function payDownPropertyMortgage(st, propId) {
    var ow = getOwnedProp(st, propId);
    if (!ow || ow.mortgageRemaining <= 0 || st.liquidAssets < 1000) return false;
    var chunk = Math.min(10000, Math.round(ow.mortgageRemaining), Math.floor(st.liquidAssets));
    if (chunk <= 0) return false;
    st.liquidAssets -= chunk;
    ow.mortgageRemaining = Math.max(0, Math.round(ow.mortgageRemaining - chunk));
    if (ow.mortgageRemaining <= 10) {
      ow.mortgageRemaining = 0;
      ow.monthlyMortgage = 0;
      ow.yearsLeft = 0;
    } else {
      var monthsLeft = Math.max(12, (ow.yearsLeft || 15) * 12);
      ow.monthlyMortgage = calcMortgagePayment(ow.mortgageRemaining, 0.032, monthsLeft);
    }
    recalcNetWorth(st);
    checkAchievements(st);
    return true;
  }

  function sellProperty(st, propId) {
    var def = getPropDef(propId);
    var idx = -1;
    for (var i = 0; i < st.properties.length; i++) {
      if (st.properties[i].id === propId) { idx = i; break; }
    }
    if (idx < 0 || !def) return false;
    var ow = st.properties[idx];
    var mv = propMarketValue(st, def);
    var netProceeds = Math.round(mv * 0.98) - Math.round(safeNum(ow.mortgageRemaining, 0));
    st.properties.splice(idx, 1);
    addLiquid(st, netProceeds);
    st.log.unshift(st.age + "a · Venda «" + def.name + "» (net " + window.CalmUI.fmtEur(netProceeds) + ").");
    if (st.log.length > 8) st.log.pop();
    checkAchievements(st);
    return true;
  }

  function buyCourse(st, courseId) {
    if (st.coursesOwned[courseId]) return false;
    var crs = findById(getData().COURSES, courseId);
    if (!crs || st.liquidAssets < crs.cost) return false;

    st.liquidAssets -= crs.cost;
    st.coursesOwned[courseId] = true;
    st.skills = window.CalmUI.clamp(st.skills + crs.skillsBonus, 0, 120);
    if (crs.salPctBonus > 0) {
      st.baseSalary = Math.round(st.baseSalary * (1 + crs.salPctBonus / 100));
    }
    if (crs.sideBonus > 0) {
      st.sideIncome += crs.sideBonus;
    }
    if (crs.flag) {
      st.flags[crs.flag] = true;
    }
    if (crs.rankUp > 0) {
      st.careerRank = Math.min(getData().CAREER_RANKS.length - 1, (st.careerRank || 0) + crs.rankUp);
    }
    syncCareerAndSalary(st);
    recalcNetWorth(st);
    st.log.unshift(st.age + "a · Formació «" + crs.name + "» completada.");
    if (st.log.length > 8) st.log.pop();
    checkAchievements(st);
    return true;
  }

  // ==================== E-INK UI RENDERING (540x700 VIEWPORT) ====================
  function render(container) {
    var st = loadState();
    var DATA = getData();
    var UI = window.CalmUI;

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // 0. ORIGIN PICKER (6 Origins Paginated 3 per Page)
      if (st.choosingOrigin) {
        var meta0 = loadMeta();
        var unlockedCnt0 = Object.keys(meta0.unlocked).length;
        var intro = document.createElement("div");
        intro.className = "scenario-card";
        intro.innerHTML =
          '<div class="scenario-kicker"><span>NOVA DINASTIA · 18 → 85 ANYS</span><span>FITES: ' + unlockedCnt0 + '/20</span></div>' +
          '<h3 class="scenario-title">Amb quin origen inicies la Generació 1?</h3>' +
          '<p class="scenario-body">Avança any a any dels 18 als 85 anys gestionant carrera, 6 actius líquids, immobles amb hipoteca i família per fundar una nissaga.</p>';
        wrap.appendChild(intro);

        var origPageInfo = UI.slicePage(DATA.ORIGINS, st.originPage || 0, 3);
        st.originPage = origPageInfo.page;

        var stack = document.createElement("div");
        stack.className = "choice-stack";
        origPageInfo.items.forEach(function (orig, idx) {
          var num = origPageInfo.page * 3 + idx + 1;
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "choice-btn";
          btn.innerHTML =
            '<span class="choice-key">' + num + "</span>" +
            '<div class="choice-content">' +
              '<div class="choice-main">' + orig.name + "</div>" +
              '<div class="choice-sub">' + orig.sub + "</div>" +
            "</div>";
          btn.onclick = function () {
            st = createNewRun(orig.id, null);
            saveState(st);
            redraw();
          };
          stack.appendChild(btn);
        });
        wrap.appendChild(stack);

        wrap.appendChild(UI.renderPager(origPageInfo, function (newP) {
          st.originPage = newP;
          saveState(st);
          redraw();
        }));

        container.appendChild(wrap);
        return;
      }

      // 1. TOP 4-COLUMN E-INK HUD
      var fPct = firePct(st);
      var mFlow = getMonthlyCashflow(st);
      var reFlow = totalRealEstateCashflow(st) + safeNum(st.sideIncome, 0);
      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell' + (fPct >= 100 ? " invert" : "") + '">' +
          '<div class="hud-label">G' + st.generation + ' · EDAT · FIRE</div>' +
          '<div class="hud-val">' + st.age + "a · " + (fPct >= 100 ? "★" + fPct + "%" : fPct + "%") + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + Math.min(100, fPct) + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">PATRIMONI NET</div>' +
          '<div class="hud-val">' + UI.fmtEur(st.netWorth) + "</div>" +
          '<div class="hud-label">Obj: ' + UI.fmtEur(fireTarget(st)) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">FLUX / MES</div>' +
          '<div class="hud-val">' + (mFlow >= 0 ? "+" : "") + UI.fmtEur(mFlow) + "</div>" +
          '<div class="hud-label">Passiu: ' + (reFlow >= 0 ? "+" : "") + UI.fmtEur(reFlow) + "</div>" +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">SALUT · GOIG</div>' +
          '<div class="hud-val">♥' + st.health + " · ☺" + st.joy + "</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.health + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // 2. TOP SEGMENTED TABS (Vida | Actius | Carrera | Llegat) + Menú
      var bar = document.createElement("div");
      bar.className = "toolbar-row";

      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "vida", label: "Vida" },
        { id: "actius", label: "Actius" },
        { id: "carrera", label: "Carrera" },
        { id: "llegat", label: "Llegat" }
      ].forEach(function (tb) {
        var b = UI.mkBtn("btn-sm" + (!st.uiMenuOpen && st.tab === tb.id ? " active" : ""), tb.label, function () {
          st.uiMenuOpen = false;
          st.tab = tb.id;
          saveState(st);
          redraw();
        });
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      var canHandOffNow = st.status === "playing" && st.age >= 72 && st.kids && st.kids.length > 0;
      var btnMenu = UI.mkBtn("btn-sm" + (st.uiMenuOpen ? " active" : ""), canHandOffNow ? "Menú ★" : "Menú", function () {
        st.uiMenuOpen = !st.uiMenuOpen;
        saveState(st);
        redraw();
      });
      bar.appendChild(btnMenu);
      wrap.appendChild(bar);

      // 2B. IN-FLOW DYNASTY & RUN MENU
      if (st.uiMenuOpen) {
        var metaM = loadMeta();
        var achTotal = Object.keys(metaM.unlocked).length;
        var menuPanel = document.createElement("div");
        menuPanel.className = "outcome-panel";

        var kidsLabel = (st.kids && st.kids.length > 0)
          ? st.kids.map(function (k) { return k.name + " (" + (st.age - k.birthAge) + "a)"; }).join(", ")
          : "Sense descendència encara";
        var inhPct = (st.flags && st.flags.trustPlan) ? "92% (Pacte/Holding actiu)" : "80% (Estàndard post-impost)";

        var hofHtml = "";
        if (metaM.hallOfFame.length > 0) {
          var rows = metaM.hallOfFame.slice(0, 3).map(function (h) {
            return '<div class="log-item">' + h.dynasty + " (G" + h.gen + " · " + h.age + "a) → <b>" + UI.fmtEur(h.worth) + "</b></div>";
          }).join("");
          hofHtml = '<div class="log-list" style="flex:0;">' + rows + "</div>";
        }

        menuPanel.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>' + st.dynastyName.toUpperCase() + " · GEN " + st.generation + '</span><span>RÈCORD: ' + UI.fmtEur(metaM.bestNetWorth) + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:5px;">Gestió de Dinastia i Partida</h3>' +
            '<p class="scenario-body" style="margin-top:4px;">' +
              "<b>Descendència:</b> " + kidsLabel + "<br>" +
              "<b>Retenció successòria:</b> " + inhPct + "<br>" +
              "<b>Fites desbloquejades:</b> " + achTotal + " / " + DATA.ACHIEVEMENTS.length + " · <b>Màx. Gen:</b> " + metaM.maxGeneration +
            "</p>" +
          "</div>" +
          hofHtml;

        var mActions = document.createElement("div");
        mActions.className = "choice-stack";
        mActions.style.flex = "0";

        if (canHandOffNow) {
          var bDyn = UI.mkBtn("btn-lg active", "★ Continuar la Dinastia amb " + st.kids[0].name + " (Gen " + (st.generation + 1) + ") →", function () {
            recordHallOfFame(st);
            st = continueDynasty(st);
            saveState(st);
            redraw();
          });
          bDyn.style.width = "100%";
          mActions.appendChild(bDyn);
        }

        var bReset = UI.mkBtn("btn-sm", "↻ Començar nova Dinastia des de zero (Generació 1)", function () {
          st = createOriginPickerState();
          saveState(st);
          redraw();
        });
        bReset.style.width = "100%";
        mActions.appendChild(bReset);

        var bClose = UI.mkBtn("btn-lg", "← Tornar a la partida (" + st.age + " anys)", function () {
          st.uiMenuOpen = false;
          saveState(st);
          redraw();
        });
        bClose.style.width = "100%";
        mActions.appendChild(bClose);

        menuPanel.appendChild(mActions);
        wrap.appendChild(menuPanel);
        container.appendChild(wrap);
        return;
      }

      // 3A. TAB: ACTIUS (6-Bucket Allocation + 8 Direct Properties)
      if (st.tab === "actius") {
        var subRowA = document.createElement("div");
        subRowA.className = "subtabs-row";
        subRowA.appendChild(UI.mkBtn("pill-btn" + (st.subActius === "alloc" ? " active" : ""), "Assignació % (6 Actius)", function () {
          st.subActius = "alloc";
          saveState(st);
          redraw();
        }));
        subRowA.appendChild(UI.mkBtn("pill-btn" + (st.subActius === "props" ? " active" : ""), "Immobles Directes (" + st.properties.length + "/8)", function () {
          st.subActius = "props";
          saveState(st);
          redraw();
        }));
        wrap.appendChild(subRowA);

        if (st.subActius === "alloc") {
          var sumBar = document.createElement("div");
          sumBar.className = "context-banner";
          sumBar.innerHTML =
            "<span>LÍQUID: <b>" + UI.fmtEur(st.liquidAssets) + "</b></span>" +
            "<span>DEUTE 9%: <b>" + UI.fmtEur(st.personalDebt) + "</b></span>";
          wrap.appendChild(sumBar);

          var bPage = UI.slicePage(DATA.BUCKETS, st.uiAllocPage || 0, 3);
          st.uiAllocPage = bPage.page;

          var aList = document.createElement("div");
          aList.className = "alloc-list";
          bPage.items.forEach(function (bk) {
            var row = document.createElement("div");
            row.className = "alloc-row";
            row.innerHTML =
              '<div class="alloc-info">' +
                '<div class="alloc-name">' + bk.name + "</div>" +
                '<div class="alloc-meta">' + bk.meta + "</div>" +
              "</div>";

            var ctrls = document.createElement("div");
            ctrls.className = "alloc-controls";
            ctrls.appendChild(UI.mkBtn("btn-sm", "−20%", function () {
              adjustAlloc(st, bk.k, -20);
              saveState(st);
              redraw();
            }));
            var pctSpan = document.createElement("span");
            pctSpan.className = "alloc-pct";
            pctSpan.textContent = st.alloc[bk.k] + "%";
            ctrls.appendChild(pctSpan);
            ctrls.appendChild(UI.mkBtn("btn-sm", "+20%", function () {
              adjustAlloc(st, bk.k, 20);
              saveState(st);
              redraw();
            }));
            row.appendChild(ctrls);
            aList.appendChild(row);
          });
          wrap.appendChild(aList);

          wrap.appendChild(UI.renderPager(bPage, function (np) {
            st.uiAllocPage = np;
            saveState(st);
            redraw();
          }));

          // Lifestyle selector
          var lifeSeg = document.createElement("div");
          lifeSeg.className = "segmented";
          lifeSeg.style.width = "100%";
          [
            { id: "frugal", label: "Frugal (-14%)" },
            { id: "balanced", label: "Equilibrat" },
            { id: "hedonist", label: "Hedonista (+22%)" }
          ].forEach(function (lf) {
            var lb = UI.mkBtn("btn-sm" + (st.lifestyle === lf.id ? " active" : ""), lf.label, function () {
              st.lifestyle = lf.id;
              saveState(st);
              redraw();
            });
            lb.style.flex = "1";
            lifeSeg.appendChild(lb);
          });
          wrap.appendChild(lifeSeg);

          // SWR + Personal Debt extra repayment controls
          var botBar = document.createElement("div");
          botBar.className = "toolbar-row";
          var swrStr = String(st.swr).replace(".", ",");
          botBar.appendChild(UI.mkBtn("btn-sm", "Retir SWR: " + swrStr + "%", function () {
            if (st.swr === 4) st.swr = 3.5;
            else if (st.swr === 3.5) st.swr = 4.5;
            else st.swr = 4;
            saveState(st);
            redraw();
          }));

          var bPayDebt = UI.mkBtn("btn-sm" + (st.personalDebt > 0 && st.liquidAssets > 0 ? " active" : ""),
            st.personalDebt > 0 ? "Amortitzar Deute (" + UI.fmtEur(st.personalDebt) + ")" : "Sense Deute 9% ✓",
            function () {
              if (st.personalDebt > 0 && st.liquidAssets > 0) {
                var pay = Math.min(st.personalDebt, st.liquidAssets);
                st.liquidAssets -= pay;
                st.personalDebt -= pay;
                recalcNetWorth(st);
                checkAchievements(st);
                saveState(st);
                redraw();
              }
            }
          );
          if (st.personalDebt <= 0 || st.liquidAssets <= 0) bPayDebt.disabled = true;
          botBar.appendChild(bPayDebt);
          wrap.appendChild(botBar);

          container.appendChild(wrap);
          return;
        }

        // Sub-view: Immobles Directes (8 properties paginated 3 per page)
        var reBanner = document.createElement("div");
        reBanner.className = "context-banner";
        reBanner.innerHTML =
          "<span>CAIXA: <b>" + UI.fmtEur(st.liquidAssets) + "</b></span>" +
          "<span>MAÓ NET: <b>" + UI.fmtEur(totalRealEstateEquity(st)) + "</b> (" + (totalRealEstateCashflow(st) >= 0 ? "+" : "") + UI.fmtEur(totalRealEstateCashflow(st)) + "/m)</span>";
        wrap.appendChild(reBanner);

        var pPage = UI.slicePage(DATA.PROPERTIES, st.uiPropPage || 0, 3);
        st.uiPropPage = pPage.page;

        var pList = document.createElement("div");
        pList.className = "item-list";
        pPage.items.forEach(function (propDef) {
          var ow = getOwnedProp(st, propDef.id);
          var row = document.createElement("div");
          row.className = "item-row" + (ow ? " owned" : "");

          var mv = propMarketValue(st, propDef);
          var buyP = propBuyPrice(st, propDef);
          var gross = propGrossRent(st, propDef);
          var exp = propMonthlyExp(st, propDef);
          var main = document.createElement("div");
          main.className = "item-row-main";
          var acts = document.createElement("div");
          acts.className = "item-row-actions";

          if (ow) {
            var netM = propNetMonthly(st, ow, propDef);
            var debtTxt = ow.mortgageRemaining > 0 ? ("Hipo: " + UI.fmtEur(ow.mortgageRemaining)) : "Pagat 100%";
            main.innerHTML =
              '<div class="item-row-title">★ ' + propDef.name + "</div>" +
              '<div class="item-row-sub">Valor ' + UI.fmtEur(mv) + " · " + debtTxt + " · Net " + (netM >= 0 ? "+" : "") + UI.fmtEur(netM) + "/m</div>";

            if (ow.mortgageRemaining > 0) {
              var bAmort = UI.mkBtn("btn-sm", "Amort.", function () {
                if (payDownPropertyMortgage(st, propDef.id)) {
                  saveState(st);
                  redraw();
                }
              });
              if (st.liquidAssets < 1000) bAmort.disabled = true;
              acts.appendChild(bAmort);
            }

            acts.appendChild(UI.mkBtn("btn-sm", "Vendre", function () {
              if (sellProperty(st, propDef.id)) {
                saveState(st);
                redraw();
              }
            }));
          } else {
            var down = Math.round(buyP * 0.25);
            var estMort = calcMortgagePayment(buyP - down, 0.032, 300);
            var netCashBuy = gross - exp;
            var netHipoBuy = gross - exp - estMort;
            main.innerHTML =
              '<div class="item-row-title">' + propDef.name + " (" + UI.fmtEur(buyP) + ")</div>" +
              '<div class="item-row-sub">Comptat +' + netCashBuy + "€/m · Hipo (entr. " + UI.fmtEur(down) + ") " + (netHipoBuy >= 0 ? "+" : "") + netHipoBuy + "€/m</div>";

            var bCash = UI.mkBtn("btn-sm", "Comptat", function () {
              if (buyProperty(st, propDef.id, false)) {
                saveState(st);
                redraw();
              }
            });
            if (st.liquidAssets < buyP) bCash.disabled = true;

            var bHipo = UI.mkBtn("btn-sm", "Hipo 25%", function () {
              if (buyProperty(st, propDef.id, true)) {
                saveState(st);
                redraw();
              }
            });
            if (st.liquidAssets < down || st.age > 68) bHipo.disabled = true;

            acts.appendChild(bCash);
            acts.appendChild(bHipo);
          }

          row.appendChild(main);
          row.appendChild(acts);
          pList.appendChild(row);
        });
        wrap.appendChild(pList);

        wrap.appendChild(UI.renderPager(pPage, function (np) {
          st.uiPropPage = np;
          saveState(st);
          redraw();
        }));

        container.appendChild(wrap);
        return;
      }

      // 3B. TAB: CARRERA (Rank, Skills, Work Mode & 8 Courses Paginated 3 per Page)
      if (st.tab === "carrera") {
        var rnkObj = DATA.CAREER_RANKS[st.careerRank || 0] || DATA.CAREER_RANKS[0];
        var cBanner = document.createElement("div");
        cBanner.className = "context-banner";
        cBanner.innerHTML =
          "<span><b>" + rnkObj.title.toUpperCase() + "</b> · SKILLS " + st.skills + "</span>" +
          "<span>SOU: <b>" + UI.fmtEur(st.salary) + "</b> · LAT: +" + UI.fmtEur(st.sideIncome) + "</span>";
        wrap.appendChild(cBanner);

        var wmRow = document.createElement("div");
        wmRow.className = "subtabs-row";
        DATA.WORK_MODES.forEach(function (wm) {
          var wb = UI.mkBtn("pill-btn" + (st.workMode === wm.id ? " active" : ""), wm.shortLabel, function () {
            st.workMode = wm.id;
            syncCareerAndSalary(st);
            saveState(st);
            redraw();
          });
          wmRow.appendChild(wb);
        });
        wrap.appendChild(wmRow);

        var cPage = UI.slicePage(DATA.COURSES, st.uiCoursePage || 0, 3);
        st.uiCoursePage = cPage.page;

        var cList = document.createElement("div");
        cList.className = "item-list";
        cPage.items.forEach(function (crs) {
          var owned = !!st.coursesOwned[crs.id];
          var row = document.createElement("div");
          row.className = "item-row" + (owned ? " owned" : "");

          var main = document.createElement("div");
          main.className = "item-row-main";
          main.innerHTML =
            '<div class="item-row-title">' + (owned ? "✓ " : "") + crs.name + "</div>" +
            '<div class="item-row-sub">' + crs.sub + "</div>";

          var acts = document.createElement("div");
          acts.className = "item-row-actions";
          var bBuy = UI.mkBtn("btn-sm" + (!owned && st.liquidAssets >= crs.cost ? " active" : ""),
            owned ? "Fet" : UI.fmtEur(crs.cost),
            function () {
              if (buyCourse(st, crs.id)) {
                saveState(st);
                redraw();
              }
            }
          );
          if (owned || st.liquidAssets < crs.cost) bBuy.disabled = true;
          acts.appendChild(bBuy);

          row.appendChild(main);
          row.appendChild(acts);
          cList.appendChild(row);
        });
        wrap.appendChild(cList);

        wrap.appendChild(UI.renderPager(cPage, function (np) {
          st.uiCoursePage = np;
          saveState(st);
          redraw();
        }));

        container.appendChild(wrap);
        return;
      }

      // 3C. TAB: LLEGAT (Dual SVG Chart + Chronicle + 20 Persistent Achievements)
      if (st.tab === "llegat") {
        var metaL = loadMeta();
        var achCount = Object.keys(metaL.unlocked).length;

        var subRowL = document.createElement("div");
        subRowL.className = "subtabs-row";
        subRowL.appendChild(UI.mkBtn("pill-btn" + (st.subLlegat === "chart" ? " active" : ""), "Corba & Crònica (" + st.dynastyName + ")", function () {
          st.subLlegat = "chart";
          saveState(st);
          redraw();
        }));
        subRowL.appendChild(UI.mkBtn("pill-btn" + (st.subLlegat === "ach" ? " active" : ""), "20 Fites (" + achCount + "/20)", function () {
          st.subLlegat = "ach";
          saveState(st);
          redraw();
        }));
        wrap.appendChild(subRowL);

        if (st.subLlegat === "ach") {
          var aPageInfo = UI.slicePage(DATA.ACHIEVEMENTS, st.uiAchPage || 0, 4);
          st.uiAchPage = aPageInfo.page;

          var grid = document.createElement("div");
          grid.className = "badge-grid";
          aPageInfo.items.forEach(function (ach) {
            var isUn = !!metaL.unlocked[ach.id];
            var card = document.createElement("div");
            card.className = "badge-card" + (isUn ? " unlocked" : "");
            card.innerHTML =
              '<div class="badge-card-title">' + (isUn ? "★ " : "○ ") + ach.title + "</div>" +
              '<div class="badge-card-desc">' + ach.desc + "</div>";
            grid.appendChild(card);
          });
          wrap.appendChild(grid);

          wrap.appendChild(UI.renderPager(aPageInfo, function (np) {
            st.uiAchPage = np;
            saveState(st);
            redraw();
          }));

          container.appendChild(wrap);
          return;
        }

        var chartWrap = document.createElement("div");
        chartWrap.className = "chart-box";
        chartWrap.innerHTML =
          '<div class="scenario-kicker" style="margin-bottom:3px;"><span>PATRIMONI NET (SÒLIDA) VS OBJECTIU FIRE (PUNT.)</span><span>GEN ' + st.generation + "</span></div>" +
          UI.buildDualChartSVG(st.historyWorth, st.historyFire, {
            height: 150,
            xStartLabel: "18a",
            xEndLabel: st.age + "a"
          });
        wrap.appendChild(chartWrap);

        var logBox = document.createElement("div");
        logBox.className = "log-list";
        st.log.slice(0, 5).forEach(function (entry) {
          var d = document.createElement("div");
          d.className = "log-item";
          d.textContent = entry;
          logBox.appendChild(d);
        });
        wrap.appendChild(logBox);

        container.appendChild(wrap);
        return;
      }

      // 3D. TAB: VIDA — Ended Summary + Dynasty Transition
      if (st.status === "ended") {
        var endCard = document.createElement("div");
        endCard.className = "outcome-panel";
        var hasKids = st.kids && st.kids.length > 0;
        var inhPctEnd = (st.flags && st.flags.trustPlan) ? 92 : 80;

        endCard.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>BALANÇ FINAL · ' + st.age + " ANYS · " + st.dynastyName.toUpperCase() + " (GEN " + st.generation + ')</span></div>' +
            '<h3 class="scenario-title" style="margin-top:5px;">' + st.endSummary.rank + "</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + st.endSummary.quote + "</p>" +
          "</div>" +
          '<div class="chart-box">' +
            UI.buildDualChartSVG(st.historyWorth, st.historyFire, {
              height: 135,
              xStartLabel: "18a",
              xEndLabel: st.age + "a (Punt.: FIRE)"
            }) +
          "</div>";

        var endBtns = document.createElement("div");
        endBtns.className = "choice-stack";
        endBtns.style.flex = "0";

        if (hasKids) {
          var heirNm = st.kids[0].name;
          var estInh = UI.fmtEur(Math.round(Math.max(0, st.netWorth) * (inhPctEnd / 100)));
          var bNextGen = UI.mkBtn("btn-lg active", "★ Continuar Dinastia: " + heirNm + " (Gen " + (st.generation + 1) + " · Hereta " + estInh + ") →", function () {
            st = continueDynasty(st);
            saveState(st);
            redraw();
          });
          bNextGen.style.width = "100%";
          endBtns.appendChild(bNextGen);
        }

        var bFresh = UI.mkBtn(hasKids ? "btn-sm" : "btn-lg active", "Començar una nova Dinastia des de zero (Gen 1) →", function () {
          st = createOriginPickerState();
          saveState(st);
          redraw();
        });
        bFresh.style.width = "100%";
        endBtns.appendChild(bFresh);

        endCard.appendChild(endBtns);
        wrap.appendChild(endCard);
        container.appendChild(wrap);
        return;
      }

      // 3E. TAB: VIDA — Active Yearly Turn (18 -> 85)
      var regNow = DATA.REGIMES[st.regimeIdx] || DATA.REGIMES[0];
      var banner = document.createElement("div");
      banner.className = "context-banner";
      banner.innerHTML =
        "<span>" + regNow.label + "</span>" +
        "<span>" + st.dynastyName + " · Sou " + UI.fmtEur(st.salary) + "</span>";
      wrap.appendChild(banner);

      // Compact single-screen feedback from previous year (zero extra E-Ink page flash!)
      if (st.lastYearReport) {
        var rep = st.lastYearReport;
        var achTxt = (rep.newAch && rep.newAch.length > 0) ? " · ★ " + rep.newAch[0] : "";
        var repBar = document.createElement("div");
        repBar.className = "status-bar";
        repBar.style.flexDirection = "column";
        repBar.style.gap = "2px";
        repBar.innerHTML =
          "<div><b>" + rep.ageFrom + "→" + rep.ageTo + "a:</b> " +
            (rep.dWorth >= 0 ? "+" : "") + UI.fmtEur(rep.dWorth) +
            " · ♥" + (rep.dHealth >= 0 ? "+" : "") + rep.dHealth +
            " · ☺" + (rep.dJoy >= 0 ? "+" : "") + rep.dJoy + achTxt +
          "</div>" +
          '<div style="font-size:0.82rem;">' + rep.narrative + "</div>";
        wrap.appendChild(repBar);
      }

      var ev = getEventObject(st);
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>' + ev.tag + '</span><span>EDAT: ' + st.age + " / 85 ANYS</span></div>" +
        '<h3 class="scenario-title">' + ev.title + "</h3>" +
        '<p class="scenario-body">' + ev.body + "</p>";
      wrap.appendChild(card);

      var choices = document.createElement("div");
      choices.className = "choice-stack";
      ev.opts.forEach(function (op, idx) {
        var b = document.createElement("button");
        b.type = "button";
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
      return "G" + (st.generation || 1) + " · " + st.age + "a · " + window.CalmUI.fmtEur(st.netWorth);
    }
    var meta = loadMeta();
    if (meta && meta.totalRuns > 0) {
      return "G" + meta.maxGeneration + " · " + window.CalmUI.fmtEur(meta.bestNetWorth);
    }
    return "18→85a · Dinastia";
  }

  window.CalmGames.vides = {
    id: "vides",
    title: "Vides & Capital",
    desc: "Dinastia 18→85a: carrera, 6 actius líquids, immobles amb hipoteca i llegat intergeneracional.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Vides & Capital: Dinastia · Guia v6</h2>" +
      "<ul>" +
      "<li><b>Any a any (18 → 85a):</b> avances d'1 en 1 any (67 torns per vida) equilibrant Patrimoni, Salut (♥), Goig (☺) i Llibertat Financera (FIRE).</li>" +
      "<li><b>Pestanya Actius:</b> reparteix la liquiditat en <b>6 categories</b> (Liquiditat, Bons, Indexats, Dividends, SOCIMIs/Or i Alt Risc) i compra fins a <b>8 immobles directes</b> al comptat o amb hipoteca fixa al 3,2%.</li>" +
      "<li><b>Pestanya Carrera:</b> canvia la jornada (100%, Intensiva, 4 Dies, Sabàtic o FIRE) i inverteix en <b>8 formacions i projectes laterals</b>.</li>" +
      "<li><b>Mode Dinastia:</b> si tens descendència, a partir dels <b>72 anys</b> (des de <i>Menú</i>) o als <b>85 anys</b> pots iniciar la <b>Següent Generació</b> heretant el 80% del patrimoni (o el 92% amb Pacte Successori) i tots els immobles!</li>" +
      "</ul>"
  };
})();
