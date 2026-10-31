// Joc 2: El Joc dels Decennis (Mercats, Titulars Trampa i Psicologia Financera)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "decennis_state_v1";
  var BEST_KEY = "decennis_best_v1";

  // 14 distinct macro-market regimes; each run chains 10 triennia (30 years) with realistic transitions
  var SCENARIOS = [
    {
      id: "fair_growth", phase: "mid",
      kicker: "PER 16x · TIPUS 2,8% · INFLACIÓ 2,1%",
      headline: "«L'economia avança sense fer soroll: els experts s'avorreixen i busquen la pròxima moda»",
      context: "Valoracions raonables i beneficis empresarials creixent al 7% anual. Cap núvol extrem a l'horitzó.",
      ret: { eq: 0.29, bond: 0.09, real: 0.14, cash: 0.07 }, // 3-year cumulative base return
      tacticB: { label: "Sobreponderar empreses de qualitat amb retorn alt sobre capital", bonus: 0.05, bias: "cool", note: "Les empreses amb avantatges competitius componen en silenci (+5% extra al trienni)." },
      tacticC: { label: "Rotar ràpidament entre sectors cada mes buscant batre el mercat", bonus: -0.06, bias: "fomo", note: "Les comissions i el mal timing et resten un -6% respecte a estar quiet." }
    },
    {
      id: "ai_mania", phase: "boom",
      kicker: "PER 34x · TIPUS 3,5% · INFLACIÓ 2,9%",
      headline: "«PORTADA: L'antiga economia ha mort! Qui no tingui el 100% en el nou paradigma es quedarà enrere»",
      context: "Els múltiples borsaris dupliquen la mitjana històrica. Taxis, sopars i xarxes només parlen d'accions que es doblen en mesos.",
      ret: { eq: -0.22, bond: 0.11, real: 0.16, cash: 0.10 },
      tacticB: { label: "Recollir beneficis dels actius cars i reequilibrar cap a valor i bons", bonus: 0.11, bias: "cool", note: "Vens quan tothom vol comprar: esquives l'esclat de la bombolla (+11% d'alfa)!" },
      tacticC: { label: "Entrar amb tot al sector calent per por de quedar-ne fora (FOMO)", bonus: -0.18, bias: "fomo", note: "Compres exactament al pic d'eufòria abans d'una correcció severa (-18% addicional)." }
    },
    {
      id: "blood_streets", phase: "bust",
      kicker: "PER 10,5x · TIPUS 1,5% · INFLACIÓ 0,9%",
      headline: "«CAPITULACIÓ TOTAL: La borsa cau un 40% i les tertúlies recomanen amagar els estalvis sota el llit»",
      context: " Empreses líders mundials cotitzen a meitat de preu. El sentiment del consumidor marca mínims de 20 anys.",
      ret: { eq: 0.56, bond: 0.07, real: 0.21, cash: 0.03 },
      tacticB: { label: "Comprar accions amb sang freda mentre tothom ven atemorit", bonus: 0.14, bias: "cool", note: "Compres gangues històriques a PER 10x i captures un rebot llegendari (+14% extra)!" },
      tacticC: { label: "Refugiar-ho tot en efectiu fins que «torni la confiança»", bonus: -0.24, bias: "panic", note: "Quan torna la confiança a la premsa, la borsa ja ha pujat un 50% sense tu." }
    },
    {
      id: "stagflation", phase: "shock",
      kicker: "PER 18x · TIPUS 5,2% · INFLACIÓ 8,4%",
      headline: "«Xoc energètic i cistella de la compra disparada: els bancs centrals apugen tipus amb duresa»",
      context: "La inflació corroeix l'efectiu i les pujades de tipus castiguen tant els bons antics com les empreses endeutades.",
      ret: { eq: -0.07, bond: -0.11, real: 0.34, cash: 0.12 },
      tacticB: { label: "Protegir-se amb actius reals, energia i empreses amb poder de fixació de preus", bonus: 0.09, bias: "cool", note: "Els actius tangibles i les marques fortes traslladen la inflació i et protegeixen (+9%)." },
      tacticC: { label: "Comprar bons a 30 anys pensant que la inflació durarà dues setmanes", bonus: -0.12, bias: "fomo", note: "La durada llarga pateix una caiguda històrica amb les pujades de tipus (-12%)." }
    },
    {
      id: "zirp_party", phase: "mid",
      kicker: "PER 22x · TIPUS 0,0% · INFLACIÓ 1,2%",
      headline: "«Diners gratis: els dipòsits paguen el 0% i el crèdit barat inunda tots els mercats»",
      context: "Els bancs centrals mantenen tipus zero. Mantenir massa liquiditat no rendeix res, però el deute barat infla valoracions.",
      ret: { eq: 0.36, bond: 0.02, real: 0.28, cash: 0.00 },
      tacticB: { label: "Mantenir renda variable i actius reals sense endeutar-se en excés", bonus: 0.04, bias: "cool", note: "Aprofites el vent de cua monetari sense assumir deute tòxic (+4%)." },
      tacticC: { label: "Apalancar la cartera amb préstecs variables perquè «els tipus mai pujaran»", bonus: -0.09, bias: "fomo", note: "Un sotrac de volatilitat força una crida de marge (margin call) al pitjor moment (-9%)." }
    },
    {
      id: "rate_peak", phase: "mid",
      kicker: "PER 14x · TIPUS 5,5% · INFLACIÓ 3,1% (BAIXANT)",
      headline: "«Per què arriscar res si les Lletres del Tresor paguen un 5% sense moure un dit?»",
      context: "La inflació ja remet, però tothom fa cua per comprar lletres a 6 mesos oblidant que aviat baixaran els tipus.",
      ret: { eq: 0.34, bond: 0.24, real: 0.15, cash: 0.09 },
      tacticB: { label: "Fixar cupons alts en bons a mitjà termini i acumular borsa a PER 14x", bonus: 0.08, bias: "cool", note: "Quan els tipus baixen, tant els teus bons com les accions es revaloritzen fort (+8%)!" },
      tacticC: { label: "Passar el 100% a dipòsits a 6 mesos i desmuntar la cartera", bonus: -0.13, bias: "panic", note: "Al cap d'un any els dipòsits tornen a pagar l'1,5% i t'has perdut tota la pujada (-13%)." }
    },
    {
      id: "boring_sideways", phase: "mid",
      kicker: "PER 15x · TIPUS 3,0% · INFLACIÓ 2,4%",
      headline: "«Tres anys sense grans titulars: els especuladors abandonen la borsa per avorriment»",
      context: "Índexs laterals en preu, però les empreses reparteixen bons dividends i recompren accions pròpies.",
      ret: { eq: 0.19, bond: 0.10, real: 0.13, cash: 0.08 },
      tacticB: { label: "Reinvertir automàticament tots els dividends sense tocar res", bonus: 0.05, bias: "cool", note: "L'interès compost dels dividends reinvertits suma silenci i rendibilitat (+5%)." },
      tacticC: { label: "Comprar opcions binàries setmanals per «donar emoció» al compte", bonus: -0.15, bias: "fomo", note: "Cercar adrenalina al mercat sempre surt car (-15%)." }
    },
    {
      id: "real_estate_fever", phase: "boom",
      kicker: "PER 21x · TIPUS 2,5% · IMMOBLES EN MÀXIMS",
      headline: "«El totxo mai baixa: es venen pisos sobre plànol en 24 hores amb hipoteques al 105%»",
      context: "Eufòria creditícia al sector immobiliari i bancari mentre la indústria no-financera cotitza a preus normals.",
      ret: { eq: 0.08, bond: 0.13, real: -0.19, cash: 0.08 },
      tacticB: { label: "Reduir exposició immobiliària cara i diversificar internacionalment", bonus: 0.09, bias: "cool", note: "Evites l'esclat del crèdit promotor local gràcies a la diversificació global (+9%)." },
      tacticC: { label: "Concentrar-ho tot en promotores i SOCIMIs apalancades", bonus: -0.17, bias: "fomo", note: "La sequera de crèdit colpeja de ple els actius immobiliaris apalancats (-17%)." }
    },
    {
      id: "geopolitical_scare", phase: "bust",
      kicker: "PER 13x · TIPUS 3,2% · VOLATILITAT ALTA",
      headline: "«Tensió comercial aranzelària: les cadenes de subministrament trontollen»",
      context: "Correcció ràpida del 20% per por d'aranzels globals. Molts fons venen indiscriminadament.",
      ret: { eq: 0.31, bond: 0.11, real: 0.22, cash: 0.09 },
      tacticB: { label: "Mantenir el pla i reequilibrar comprant el que ha caigut", bonus: 0.07, bias: "cool", note: "Les empreses s'adapten als aranzels molt més ràpid que els tertulians (+7%)." },
      tacticC: { label: "Vendre en obertura un dilluns negre per «evitar mals majors»", bonus: -0.14, bias: "panic", note: "Vens exactament al mínim intradia del pànic (-14%)." }
    },
    {
      id: "productivity_wave", phase: "mid",
      kicker: "PER 17x · TIPUS 2,6% · INFLACIÓ 1,7%",
      headline: "«L'automatització dispara els marges reals de la indústria, la salut i la logística»",
      context: "Sense fer soroll mediàtic, la productivitat real redueix costos i impulsa un cicle sa de creixement sense inflació.",
      ret: { eq: 0.41, bond: 0.12, real: 0.18, cash: 0.07 },
      tacticB: { label: "Deixar córrer els guanys sense tallar les flors abans d'hora", bonus: 0.06, bias: "cool", note: "No interrompre la composició en un cicle sa multiplica el patrimoni (+6%)." },
      tacticC: { label: "Posar-se curt (apostar contra la borsa) pensant que «ja ha pujat prou»", bonus: -0.19, bias: "panic", note: "El mercat pot mantenir-se alcista per fonamentals molt més temps que la teva aposta (-19%)." }
    }
  ];

  function generateRunSequence(seed) {
    var rng = window.CalmUI.seededRng(seed);
    var pool = SCENARIOS.slice();
    // Shuffle deterministically
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }
    return pool.slice(0, 10); // 10 triennia = 30 years
  }

  function createNewGame() {
    var seed = Math.floor(Math.random() * 899999) + 100000;
    var seq = generateRunSequence(seed);
    return {
      seed: seed,
      turn: 0, // 0..9 (each is 3 years -> 0 to 30 years)
      capital: 100000,
      bench: 100000,
      alloc: { eq: 50, bond: 25, real: 25, cash: 0 },
      tab: "mercat", // mercat | cartera | corba
      seqIds: seq.map(function (s) { return s.id; }),
      biases: { cool: 0, fomo: 0, panic: 0 },
      lastReport: null,
      status: "playing", // playing | ended
      histCap: [100000],
      histBench: [100000],
      log: ["Any 0 · Capital inicial 100.000 € vs Índex Passiu 60/40."]
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.seqIds && typeof saved.capital === "number") return saved;
    return createNewGame();
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function getScenarioById(id) {
    for (var i = 0; i < SCENARIOS.length; i++) {
      if (SCENARIOS[i].id === id) return SCENARIOS[i];
    }
    return SCENARIOS[0];
  }

  function adjustAlloc(st, key, delta) {
    var cur = st.alloc[key];
    var next = window.CalmUI.clamp(cur + delta, 0, 100);
    var diff = next - cur;
    if (diff === 0) return;
    var others = ["cash", "bond", "real", "eq"];
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

  function executeTriennium(st, mode) {
    var sc = getScenarioById(st.seqIds[st.turn]);
    var wEq = st.alloc.eq / 100;
    var wBond = st.alloc.bond / 100;
    var wReal = st.alloc.real / 100;
    var wCash = st.alloc.cash / 100;

    var baseRet = wEq * sc.ret.eq + wBond * sc.ret.bond + wReal * sc.ret.real + wCash * sc.ret.cash;
    var benchRet = 0.60 * sc.ret.eq + 0.40 * sc.ret.bond;

    var bonus = 0;
    var note = "Executes la teva assignació d'actius sense deixar-te portar pels titulars.";
    if (mode === "B") {
      bonus = sc.tacticB.bonus;
      st.biases[sc.tacticB.bias] = (st.biases[sc.tacticB.bias] || 0) + 1;
      note = sc.tacticB.note;
    } else if (mode === "C") {
      bonus = sc.tacticC.bonus;
      st.biases[sc.tacticC.bias] = (st.biases[sc.tacticC.bias] || 0) + 1;
      note = sc.tacticC.note;
    } else {
      st.biases.cool += 1;
    }

    var totalRet = Math.max(-0.65, baseRet + bonus);
    var prevCap = st.capital;
    st.capital = Math.round(st.capital * (1 + totalRet));
    st.bench = Math.round(st.bench * (1 + benchRet));
    st.turn += 1;

    st.histCap.push(st.capital);
    st.histBench.push(st.bench);

    var yrs = st.turn * 3;
    st.log.unshift(
      "Any " + yrs + " · Tu " + (totalRet >= 0 ? "+" : "") + Math.round(totalRet * 100) + "% (" + window.CalmUI.fmtEur(st.capital) + ") vs Índex " + window.CalmUI.fmtEur(st.bench)
    );
    if (st.log.length > 6) st.log.pop();

    if (st.turn >= 10) {
      st.status = "ended";
      var best = window.CalmStorage.get(BEST_KEY, { maxCap: 0 });
      if (st.capital > (best.maxCap || 0)) {
        best.maxCap = st.capital;
        window.CalmStorage.set(BEST_KEY, best);
      }
      st.lastReport = null;
      return;
    }

    st.lastReport = {
      yrsFrom: yrs - 3,
      yrsTo: yrs,
      userPct: Math.round(totalRet * 100),
      benchPct: Math.round(benchRet * 100),
      deltaEur: st.capital - prevCap,
      note: note,
      eqPct: Math.round(sc.ret.eq * 100),
      bondPct: Math.round(sc.ret.bond * 100),
      realPct: Math.round(sc.ret.real * 100)
    };
  }

  function investorDiagnosis(st) {
    var alpha = st.capital - st.bench;
    if (alpha >= 80000 && st.biases.fomo === 0 && st.biases.panic === 0) {
      return {
        title: "★ Ment Contrària Magistral (Alfa +" + window.CalmUI.fmtEur(alpha) + ")",
        desc: "Has batut l'índex amb escreix sense caure ni un sol cop en l'eufòria ni en el pànic. Sang de gel digna de Howard Marks."
      };
    }
    if (alpha >= 0) {
      return {
        title: "Estrateg Disciplinat (Alfa +" + window.CalmUI.fmtEur(alpha) + ")",
        desc: "Has superat la cartera passiva 60/40 mantenint el cap fred quan els titulars feien més soroll."
      };
    }
    if (st.biases.fomo >= st.biases.panic && st.biases.fomo >= 2) {
      return {
        title: "Víctima de l'Eufòria (FOMO · " + window.CalmUI.fmtEur(alpha) + " vs Índex)",
        desc: "Perseguir el que estava de moda a les portades t'ha fet comprar car. Una simple cartera passiva hauria rendit més amb zero estrès!"
      };
    }
    if (st.biases.panic >= 2) {
      return {
        title: "Refugiat del Pànic (" + window.CalmUI.fmtEur(alpha) + " vs Índex)",
        desc: "Fugir quan hi ha sang als titulars t'ha fet perdre els grans rebots de la història. En borsa, la volatilitat és el peatge de la rendibilitat."
      };
    }
    return {
      title: "Aprenent dels Cicles (" + window.CalmUI.fmtEur(alpha) + " vs Índex)",
      desc: "Has multiplicat el capital fins a " + window.CalmUI.fmtEur(st.capital) + ", però l'índex automàtic 60/40 t'ha superat per poc (" + window.CalmUI.fmtEur(st.bench) + ")."
    };
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      var yrs = st.turn * 3;
      var alpha = st.capital - st.bench;

      // 1. HUD
      var hud = document.createElement("div");
      hud.className = "hud-grid";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">HORITZÓ</div>' +
          '<div class="hud-val">Any ' + yrs + '/30</div>' +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + Math.round((yrs / 30) * 100) + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell invert">' +
          '<div class="hud-label">EL TEU CAPITAL</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.capital) + "</div>" +
          '<div class="hud-label">Inici: 100k €</div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">ÍNDEX 60/40</div>' +
          '<div class="hud-val">' + window.CalmUI.fmtEur(st.bench) + "</div>" +
          '<div class="hud-label">Rival passiu</div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">ALFA GENERAT</div>' +
          '<div class="hud-val">' + (alpha >= 0 ? "+" : "") + window.CalmUI.fmtEur(alpha) + "</div>" +
          '<div class="hud-label">Fredor: ' + st.biases.cool + "</div>" +
        "</div>";
      wrap.appendChild(hud);

      // 2. Tabs
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "mercat", label: "Butlletí" },
        { id: "cartera", label: "Pesos (" + st.alloc.eq + "/" + st.alloc.bond + "/" + st.alloc.real + ")" },
        { id: "corba", label: "Corba 30a" }
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

      var btnReset = document.createElement("button");
      btnReset.className = "btn-sm";
      btnReset.textContent = "↻ Nou cicle";
      btnReset.onclick = function () {
        st = createNewGame();
        saveState(st);
        redraw();
      };
      bar.appendChild(btnReset);
      wrap.appendChild(bar);

      // 3A. End of 30 Years
      if (st.status === "ended" && st.tab === "mercat") {
        var diag = investorDiagnosis(st);
        var endPanel = document.createElement("div");
        endPanel.className = "outcome-panel";
        endPanel.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>RESULTAT FINAL · 30 ANYS D\'INVERSIÓ</span><span>FOMO: ' + st.biases.fomo + ' · PÀNIC: ' + st.biases.panic + "</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + diag.title + "</h3>" +
            '<p class="scenario-body" style="margin-top:5px;">' + diag.desc + "</p>" +
          "</div>" +
          '<div class="chart-box">' +
            window.CalmUI.buildDualChartSVG(st.histCap, st.histBench, {
              height: 150,
              xStartLabel: "Any 0 (100k€)",
              xEndLabel: "Any 30 (Punt.: Índex 60/40)"
            }) +
          "</div>";

        var btnAgain = document.createElement("button");
        btnAgain.className = "btn-lg active";
        btnAgain.style.width = "100%";
        btnAgain.textContent = "Jugar uns altres 30 anys amb nous cicles →";
        btnAgain.onclick = function () {
          st = createNewGame();
          saveState(st);
          redraw();
        };
        endPanel.appendChild(btnAgain);
        wrap.appendChild(endPanel);
        container.appendChild(wrap);
        return;
      }

      // 3B. TAB: CARTERA
      if (st.tab === "cartera") {
        var info = document.createElement("div");
        info.className = "scenario-card";
        info.innerHTML =
          '<div class="scenario-kicker"><span>DISTRIBUCIÓ DEL TEU CAPITAL</span><span>TOTAL = 100%</span></div>' +
          '<p class="scenario-body">Llegeix les valoracions reals (PER, tipus i inflació), ignora l\'esquer dels titulars i ajusta els pesos abans de tancar el trienni.</p>';
        wrap.appendChild(info);

        var list = document.createElement("div");
        list.className = "alloc-list";
        [
          { k: "eq", name: "Accions Globals (Renda Variable)", meta: "Brilla amb PER baix (<15x) · Pateix en bombolles (>30x)" },
          { k: "bond", name: "Bons Sobirans (Renda Fixa)", meta: "Atractius amb tipus alts (>4%) · Pateixen xocs d'inflació" },
          { k: "real", name: "Or, Energia & Actius Reals", meta: "Escut clau contra estagflació i xocs geopolítics" },
          { k: "cash", name: "Liquiditat Tàctica", meta: "Protegeix en eufòries extremes per comprar després" }
        ].forEach(function (bk) {
          var row = document.createElement("div");
          row.className = "alloc-row";
          row.innerHTML =
            '<div class="alloc-info"><div class="alloc-name">' + bk.name + '</div><div class="alloc-meta">' + bk.meta + "</div></div>";
          var ctrls = document.createElement("div");
          ctrls.className = "alloc-controls";

          var bm = document.createElement("button");
          bm.className = "btn-sm";
          bm.textContent = "−25%";
          bm.onclick = function () { adjustAlloc(st, bk.k, -25); saveState(st); redraw(); };

          var sp = document.createElement("span");
          sp.className = "alloc-pct";
          sp.textContent = st.alloc[bk.k] + "%";

          var bp = document.createElement("button");
          bp.className = "btn-sm";
          bp.textContent = "+25%";
          bp.onclick = function () { adjustAlloc(st, bk.k, 25); saveState(st); redraw(); };

          ctrls.appendChild(bm);
          ctrls.appendChild(sp);
          ctrls.appendChild(bp);
          row.appendChild(ctrls);
          list.appendChild(row);
        });
        wrap.appendChild(list);

        var btnDone = document.createElement("button");
        btnDone.className = "btn-lg active";
        btnDone.textContent = "Desar pesos i tornar al Butlletí →";
        btnDone.onclick = function () { st.tab = "mercat"; saveState(st); redraw(); };
        wrap.appendChild(btnDone);
        container.appendChild(wrap);
        return;
      }

      // 3C. TAB: CORBA
      if (st.tab === "corba") {
        var cbox = document.createElement("div");
        cbox.className = "chart-box";
        cbox.innerHTML =
          '<div class="scenario-kicker" style="margin-bottom:4px;"><span>EL TEU CAPITAL (SÒLIDA) VS ÍNDEX 60/40 (PUNT.)</span></div>' +
          window.CalmUI.buildDualChartSVG(st.histCap, st.histBench, {
            height: 165,
            xStartLabel: "Any 0",
            xEndLabel: "Any " + yrs
          });
        wrap.appendChild(cbox);

        var lbox = document.createElement("div");
        lbox.className = "log-list";
        st.log.forEach(function (l) {
          var item = document.createElement("div");
          item.className = "log-item";
          item.textContent = l;
          lbox.appendChild(item);
        });
        wrap.appendChild(lbox);
        container.appendChild(wrap);
        return;
      }

      // 3D. TAB: MERCAT (Triennium Report or Active Scenario)
      if (st.lastReport) {
        var rep = st.lastReport;
        var out = document.createElement("div");
        out.className = "outcome-panel";
        out.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>TANCAMENT DEL TRIENNI (ANY ' + rep.yrsFrom + " → " + rep.yrsTo + ")</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">La teva cartera: ' + (rep.userPct >= 0 ? "+" : "") + rep.userPct + "% (" + (rep.deltaEur >= 0 ? "+" : "") + window.CalmUI.fmtEur(rep.deltaEur) + ")</h3>" +
            '<p class="scenario-body" style="margin-top:6px;">' + rep.note + "</p>" +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">Índex 60/40: ' + (rep.benchPct >= 0 ? "+" : "") + rep.benchPct + "%</span>" +
            '<span class="delta-pill">Accions: ' + (rep.eqPct >= 0 ? "+" : "") + rep.eqPct + "%</span>" +
            '<span class="delta-pill">Bons: ' + (rep.bondPct >= 0 ? "+" : "") + rep.bondPct + "%</span>" +
            '<span class="delta-pill">Reals: ' + (rep.realPct >= 0 ? "+" : "") + rep.realPct + "%</span>" +
          "</div>";

        var bNext = document.createElement("button");
        bNext.className = "btn-lg active";
        bNext.style.width = "100%";
        bNext.textContent = "Llegir el següent Butlletí (Any " + rep.yrsTo + ") →";
        bNext.onclick = function () {
          st.lastReport = null;
          saveState(st);
          redraw();
        };
        out.appendChild(bNext);
        wrap.appendChild(out);
        container.appendChild(wrap);
        return;
      }

      var sc = getScenarioById(st.seqIds[st.turn]);
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>TRIENNI ' + (st.turn + 1) + "/10</span><span>" + sc.kicker + "</span></div>" +
        '<div class="scenario-quote">' + sc.headline + "</div>" +
        '<p class="scenario-body">' + sc.context + "</p>";
      wrap.appendChild(card);

      var stack = document.createElement("div");
      stack.className = "choice-stack";
      [
        { k: "A", t: "Mantenir i executar la meva cartera (" + st.alloc.eq + "% Acc / " + st.alloc.bond + "% Bons / " + st.alloc.real + "% Reals)", s: "Disciplina sistemàtica · Pots canviar pesos a la pestanya «Pesos»", m: "A" },
        { k: "B", t: sc.tacticB.label, s: "Tàctica contrària / fonamental sobre la teva cartera", m: "B" },
        { k: "C", t: sc.tacticC.label, s: "Seguir el titular i el sentiment dominant de la massa", m: "C" }
      ].forEach(function (op) {
        var b = document.createElement("button");
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + op.k + "</span>" +
          '<div class="choice-content"><div class="choice-main">' + op.t + '</div><div class="choice-sub">' + op.s + "</div></div>";
        b.onclick = function () {
          executeTriennium(st, op.m);
          saveState(st);
          redraw();
        };
        stack.appendChild(b);
      });
      wrap.appendChild(stack);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    if (st.status === "playing" && st.turn > 0) {
      return "Any " + (st.turn * 3) + " · " + window.CalmUI.fmtEur(st.capital);
    }
    var best = window.CalmStorage.get(BEST_KEY, null);
    if (best && best.maxCap > 0) return "Rècord " + window.CalmUI.fmtEur(best.maxCap);
    return "30 anys · Alfa";
  }

  window.CalmGames.decennis = {
    id: "decennis",
    title: "El Joc dels Decennis",
    desc: "30 anys de mercats, titulars trampa i psicologia financera contra l'índex 60/40.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>El Joc dels Decennis · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Comences amb <b>100.000 €</b> i jugues <b>10 triennis (30 anys)</b> competint contra un inversor passiu automàtic <b>60/40</b>.</li>" +
      "<li>Fixa't en les dades objectives (<b>PER borsari, tipus d'interès i inflació</b>) i desconfia dels titulars eufòrics o apocalíptics!</li>" +
      "<li>A la pestanya <b>Pesos</b> pots reequilibrar entre Accions, Bons, Actius Reals i Liquiditat en qualsevol moment.</li>" +
      "</ul>"
  };
})();
