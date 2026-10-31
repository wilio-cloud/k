// Joc 4: Créixer amb Calma v6 (Criança 0-12a, Estudi de Ioga Restauratiu, Jocs i Frases Pont)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "crianca_state_v6";

  function getData() {
    return (window.CalmData && window.CalmData.crianca) ? window.CalmData.crianca : {
      STAGES: [],
      SCENES: [],
      YOGA_MOODS: [],
      YOGA_LENGTHS: [],
      ASANAS: [],
      YOGA_SEQUENCES: {},
      PLAY_CATS: [],
      PLAY_IDEAS: [],
      PHRASE_CATS: [],
      CHEATSHEET: [],
      BADGES: []
    };
  }

  function createInitialState() {
    return {
      vincle: 78,
      reg: 74,
      calma: 76,
      tab: "crianca", // crianca | ioga | jocs | frases | progres
      stageFilter: "all", // all | 0-1 | 1-3 | 4-6 | 7-9 | 10-12
      currentSceneId: null,
      stageCursor: {},
      seenScenes: {},
      lastFeedback: null,
      completedCount: 0,
      yogaMood: "esquena",
      yogaLength: 5,
      yogaActive: false,
      yogaList: [],
      yogaStep: 0,
      yogaSessionsDone: 0,
      yogaNotice: "",
      playCat: "all",
      playPage: 0,
      triedGames: {},
      phraseCat: "all",
      phrasePage: 0,
      favPhrases: {},
      confirmResetSeen: false
    };
  }

  function normalizeState(raw) {
    var base = createInitialState();
    if (!raw || typeof raw !== "object") return base;
    for (var k in base) {
      if (base.hasOwnProperty(k) && raw[k] !== undefined && raw[k] !== null) {
        base[k] = raw[k];
      }
    }
    if (typeof base.seenScenes !== "object") base.seenScenes = {};
    if (typeof base.stageCursor !== "object") base.stageCursor = {};
    if (typeof base.triedGames !== "object") base.triedGames = {};
    if (typeof base.favPhrases !== "object") base.favPhrases = {};
    if (!Array.isArray(base.yogaList)) base.yogaList = [];
    return base;
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    return normalizeState(saved);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function countKeys(obj) {
    if (!obj || typeof obj !== "object") return 0;
    var n = 0;
    for (var k in obj) {
      if (obj.hasOwnProperty(k) && obj[k]) n++;
    }
    return n;
  }

  function getScenesForStage(stageId) {
    var data = getData();
    var all = data.SCENES || [];
    if (!stageId || stageId === "all") return all;
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].stage === stageId) out.push(all[i]);
    }
    return out.length ? out : all;
  }

  function countSeenInList(list, seenMap) {
    var c = 0;
    for (var i = 0; i < list.length; i++) {
      if (seenMap && seenMap[list[i].id]) c++;
    }
    return c;
  }

  function resolveCurrentScene(st) {
    var list = getScenesForStage(st.stageFilter);
    if (!list.length) return null;

    var i;
    if (st.currentSceneId) {
      for (i = 0; i < list.length; i++) {
        if (list[i].id === st.currentSceneId) return list[i];
      }
    }

    // Prioritize unseen scenes in the selected stage
    for (i = 0; i < list.length; i++) {
      if (!st.seenScenes[list[i].id]) {
        st.currentSceneId = list[i].id;
        return list[i];
      }
    }

    // All seen in this stage: cycle smoothly with cursor
    var key = st.stageFilter || "all";
    var idx = (st.stageCursor[key] || 0) % list.length;
    st.currentSceneId = list[idx].id;
    return list[idx];
  }

  function advanceToNextScene(st) {
    var list = getScenesForStage(st.stageFilter);
    if (!list.length) return;
    var curId = st.currentSceneId;
    var curPos = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].id === curId) {
        curPos = i;
        break;
      }
    }

    // Look forward from curPos for the next unseen scene
    for (i = 1; i <= list.length; i++) {
      var cand = list[(curPos + i) % list.length];
      if (!st.seenScenes[cand.id]) {
        st.currentSceneId = cand.id;
        return;
      }
    }

    // If all seen in this stage, advance cursor by 1
    var key = st.stageFilter || "all";
    var nextIdx = (curPos + 1) % list.length;
    st.stageCursor[key] = nextIdx;
    st.currentSceneId = list[nextIdx].id;
  }

  function findAsanaById(id) {
    var asanas = getData().ASANAS || [];
    for (var i = 0; i < asanas.length; i++) {
      if (asanas[i].id === id) return asanas[i];
    }
    return asanas[0] || null;
  }

  function buildYogaSessionList(moodId, lengthNum) {
    var data = getData();
    var seqs = data.YOGA_SEQUENCES || {};
    var moodMap = seqs[moodId] || seqs.esquena || {};
    var chosen = moodMap[lengthNum];
    if (chosen && chosen.length) return chosen.slice();

    // Fallback if needed
    var out = [];
    var asanas = data.ASANAS || [];
    for (var i = 0; i < asanas.length && out.length < lengthNum; i++) {
      out.push(asanas[i].id);
    }
    return out;
  }

  function getYogaBonus(lengthNum) {
    var lens = getData().YOGA_LENGTHS || [];
    for (var i = 0; i < lens.length; i++) {
      if (lens[i].id === lengthNum) return lens[i].calmaBonus;
    }
    return 18;
  }

  function getYogaMoodLabel(moodId) {
    var moods = getData().YOGA_MOODS || [];
    for (var i = 0; i < moods.length; i++) {
      if (moods[i].id === moodId) return moods[i].label;
    }
    return " Calma";
  }

  function isBadgeUnlocked(badgeId, st) {
    var seenTotal = countKeys(st.seenScenes);
    if (badgeId === "port_segur") return seenTotal >= 10;
    if (badgeId === "mestre_calma") return seenTotal >= 40;
    if (badgeId === "estudi_calma") return (st.yogaSessionsDone || 0) >= 3;
    if (badgeId === "joc_viu") return countKeys(st.triedGames) >= 5;
    if (badgeId === "paraula_pont") return countKeys(st.favPhrases) >= 5;
    if (badgeId === "cami_complet") {
      var stages = ["0-1", "1-3", "4-6", "7-9", "10-12"];
      for (var i = 0; i < stages.length; i++) {
        var sList = getScenesForStage(stages[i]);
        if (countSeenInList(sList, st.seenScenes) < 3) return false;
      }
      return true;
    }
    return false;
  }

  function render(container) {
    var st = loadState();
    var data = getData();
    var mkBtn = window.CalmUI.mkBtn;

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // 1. 3-Column Warm HUD
      var hud = document.createElement("div");
      hud.className = "hud-grid cols-3";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">♥ VINCLE & SEGURETAT</div>' +
          '<div class="hud-val">' + st.vincle + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.vincle + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">✦ REGULACIÓ INFANTIL</div>' +
          '<div class="hud-val">' + st.reg + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.reg + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell' + (st.calma < 45 ? " invert" : "") + '">' +
          '<div class="hud-label">◯ LA TEVA CALMA</div>' +
          '<div class="hud-val">' + st.calma + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.calma + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // 2. Top Navigation Bar: 4 Segmented Tabs + 1 Right Button (Progrés)
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var seg = document.createElement("div");
      seg.className = "segmented";

      var mainTabs = [
        { id: "crianca", label: "Criança" },
        { id: "ioga", label: "Ioga" },
        { id: "jocs", label: "Jocs" },
        { id: "frases", label: "Frases" }
      ];

      for (var t = 0; t < mainTabs.length; t++) {
        (function (tb) {
          var b = mkBtn("btn-sm" + (st.tab === tb.id ? " active" : ""), tb.label, function () {
            st.tab = tb.id;
            st.yogaNotice = "";
            st.confirmResetSeen = false;
            saveState(st);
            redraw();
          });
          seg.appendChild(b);
        })(mainTabs[t]);
      }
      bar.appendChild(seg);

      var seenTotal = countKeys(st.seenScenes);
      var totalScenes = (data.SCENES || []).length;
      var btnRight = mkBtn(
        "btn-sm" + (st.tab === "progres" ? " active" : ""),
        st.tab === "progres" ? "← Tornar" : "✓ " + seenTotal + "/" + totalScenes,
        function () {
          st.tab = st.tab === "progres" ? "crianca" : "progres";
          st.confirmResetSeen = false;
          saveState(st);
          redraw();
        }
      );
      bar.appendChild(btnRight);
      wrap.appendChild(bar);

      // ==================== VIEW 5: PROGRÉS I FITES ====================
      if (st.tab === "progres") {
        renderProgres(wrap);
        container.appendChild(wrap);
        return;
      }

      // ==================== TAB 2: ESTUDI DE IOGA RESTAURATIU ====================
      if (st.tab === "ioga") {
        renderIoga(wrap);
        container.appendChild(wrap);
        return;
      }

      // ==================== TAB 3: JOCS SENSE PANTALLES ====================
      if (st.tab === "jocs") {
        renderJocs(wrap);
        container.appendChild(wrap);
        return;
      }

      // ==================== TAB 4: FRASES PONT ====================
      if (st.tab === "frases") {
        renderFrases(wrap);
        container.appendChild(wrap);
        return;
      }

      // ==================== TAB 1: CRIANÇA 0-12 ANYS ====================
      renderCrianca(wrap);
      container.appendChild(wrap);
    }

    function renderCrianca(wrap) {
      // Stage pill selector
      var stageRow = document.createElement("div");
      stageRow.className = "subtabs-row";
      var stages = data.STAGES || [];
      for (var i = 0; i < stages.length; i++) {
        (function (sg) {
          var listSg = getScenesForStage(sg.id);
          var seenSg = countSeenInList(listSg, st.seenScenes);
          var lbl = sg.id === "all" ? ("Totes " + seenSg + "/" + listSg.length) : (sg.label + " " + seenSg + "/" + listSg.length);
          var pBtn = mkBtn("pill-btn" + (st.stageFilter === sg.id ? " active" : ""), lbl, function () {
            st.stageFilter = sg.id;
            st.currentSceneId = null;
            st.lastFeedback = null;
            resolveCurrentScene(st);
            saveState(st);
            redraw();
          });
          stageRow.appendChild(pBtn);
        })(stages[i]);
      }
      wrap.appendChild(stageRow);

      var list = getScenesForStage(st.stageFilter);
      var sc = resolveCurrentScene(st);
      if (!sc) return;

      var seenInStage = countSeenInList(list, st.seenScenes);

      if (st.lastFeedback) {
        var fb = st.lastFeedback;
        var out = document.createElement("div");
        out.className = "outcome-panel";
        out.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>' + sc.stageLabel + '</span><span>✓ ' + countKeys(st.seenScenes) + "/" + data.SCENES.length + " COMPLETADES</span></div>" +
            '<p class="scenario-body" style="margin-top:5px;"><b>Reacció:</b> ' + fb.react + "</p>" +
            '<div class="insight-box" style="margin-top:6px;"><b>Sota l\'iceberg:</b> ' + fb.neuro + "</div>" +
            '<div class="scenario-quote" style="margin-top:7px;">' + fb.phrase + "</div>" +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">♥ Vincle ' + (fb.dv >= 0 ? "+" : "") + fb.dv + "</span>" +
            '<span class="delta-pill">✦ Regulació ' + (fb.dr >= 0 ? "+" : "") + fb.dr + "</span>" +
            '<span class="delta-pill">◯ Calma ' + (fb.dc >= 0 ? "+" : "") + fb.dc + "</span>" +
          "</div>";

        var bRow = document.createElement("div");
        bRow.className = "toolbar-row";

        var bRetry = mkBtn("btn-lg", "↺ Altra resposta", function () {
          st.lastFeedback = null;
          saveState(st);
          redraw();
        });

        var bNext = mkBtn("btn-lg active", "Següent situació →", function () {
          st.lastFeedback = null;
          advanceToNextScene(st);
          saveState(st);
          redraw();
        });
        bNext.style.flex = "1";

        bRow.appendChild(bRetry);
        bRow.appendChild(bNext);
        out.appendChild(bRow);
        wrap.appendChild(out);
        return;
      }

      var isSeen = !!st.seenScenes[sc.id];
      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker">' +
          "<span>" + sc.stageLabel + (isSeen ? " · ✓ VISTA" : " · NOVA") + "</span>" +
          "<span>ETAPA " + seenInStage + "/" + list.length + "</span>" +
        "</div>" +
        '<h3 class="scenario-title">' + sc.title + "</h3>" +
        '<p class="scenario-body">' + sc.body + "</p>";
      wrap.appendChild(card);

      var stack = document.createElement("div");
      stack.className = "choice-stack";
      for (var j = 0; j < sc.opts.length; j++) {
        (function (op) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "choice-btn";
          b.innerHTML =
            '<span class="choice-key">' + op.k + "</span>" +
            '<div class="choice-content">' +
              '<div class="choice-main">' + op.t + "</div>" +
              '<div class="choice-sub">' + op.s + "</div>" +
            "</div>";
          b.addEventListener("click", function (ev) {
            ev.preventDefault();
            st.vincle = window.CalmUI.clamp(st.vincle + op.vincle, 10, 100);
            st.reg = window.CalmUI.clamp(st.reg + op.reg, 10, 100);
            st.calma = window.CalmUI.clamp(st.calma + op.calma, 5, 100);
            st.seenScenes[sc.id] = true;
            st.completedCount = (st.completedCount || 0) + 1;
            st.lastFeedback = {
              react: op.react,
              neuro: op.neuro,
              phrase: op.phrase,
              dv: op.vincle,
              dr: op.reg,
              dc: op.calma
            };
            saveState(st);
            redraw();
          });
          stack.appendChild(b);
        })(sc.opts[j]);
      }
      wrap.appendChild(stack);
    }

    function renderIoga(wrap) {
      // Guided Session Player Mode
      if (st.yogaActive && st.yogaList && st.yogaList.length > 0) {
        var totalSteps = st.yogaList.length;
        var stepIdx = window.CalmUI.clamp(st.yogaStep || 0, 0, totalSteps - 1);
        var asana = findAsanaById(st.yogaList[stepIdx]);
        if (!asana) {
          st.yogaActive = false;
          saveState(st);
          redraw();
          return;
        }

        var panel = document.createElement("div");
        panel.className = "outcome-panel";

        var topInfo = document.createElement("div");
        var stepsHtml = "";
        for (var s = 0; s < asana.steps.length; s++) {
          stepsHtml += '<p class="scenario-body" style="margin:3px 0; font-size:0.9rem;">' + asana.steps[s] + "</p>";
        }

        topInfo.innerHTML =
          '<div class="scenario-kicker">' +
            "<span>PAS " + (stepIdx + 1) + " DE " + totalSteps + " · " + getYogaMoodLabel(st.yogaMood).toUpperCase() + "</span>" +
            "<span>" + asana.sanskrit + "</span>" +
          "</div>" +
          '<h3 class="scenario-title" style="margin:4px 0 2px;">' + asana.name + "</h3>" +
          '<div class="asana-svg-box">' + asana.svg + "</div>" +
          '<div class="context-banner" style="margin:4px 0;">' +
            "<span>◯ " + asana.breaths + "</span>" +
            "<span>Sense rellotge</span>" +
          "</div>" +
          stepsHtml +
          '<div class="insight-box" style="margin-top:4px; font-size:0.83rem;">' + asana.comfort + "</div>";

        panel.appendChild(topInfo);

        var navRow = document.createElement("div");
        navRow.className = "toolbar-row";

        var btnExit = mkBtn("btn-sm", "✕ Menú", function () {
          st.yogaActive = false;
          saveState(st);
          redraw();
        });

        var btnPrev = mkBtn("btn-sm", "◀ Anterior", function () {
          if (stepIdx > 0) {
            st.yogaStep = stepIdx - 1;
            saveState(st);
            redraw();
          }
        });
        if (stepIdx <= 0) btnPrev.disabled = true;

        var isLast = stepIdx + 1 >= totalSteps;
        var bonus = getYogaBonus(totalSteps);
        var btnNext = mkBtn(
          "btn-sm active",
          isLast ? ("Finalitzar (+" + bonus + " Calma)") : "Següent ▶",
          function () {
            if (!isLast) {
              st.yogaStep = stepIdx + 1;
              saveState(st);
              redraw();
            } else {
              st.calma = window.CalmUI.clamp(st.calma + bonus, 0, 100);
              st.yogaSessionsDone = (st.yogaSessionsDone || 0) + 1;
              st.yogaActive = false;
              st.yogaNotice = "Sessió completada! +" + bonus + " de Calma interior (Total sessions: " + st.yogaSessionsDone + ").";
              saveState(st);
              redraw();
            }
          }
        );
        btnNext.style.flex = "1";

        navRow.appendChild(btnExit);
        navRow.appendChild(btnPrev);
        navRow.appendChild(btnNext);
        panel.appendChild(navRow);
        wrap.appendChild(panel);
        return;
      }

      // Session Builder Mode
      var banner = document.createElement("div");
      banner.className = st.yogaNotice ? "status-bar solid" : "context-banner";
      if (st.yogaNotice) {
        banner.textContent = st.yogaNotice;
      } else {
        banner.innerHTML =
          "<span>ESTUDI DE IOGA RESTAURATIU & PRANAYAMA</span>" +
          "<span>Sessions: " + (st.yogaSessionsDone || 0) + " · 18 postures</span>";
      }
      wrap.appendChild(banner);

      var builderCard = document.createElement("div");
      builderCard.className = "scenario-card";
      builderCard.innerHTML =
        '<div class="scenario-kicker"><span>1. COM ET SENTS AVUI?</span><span>SENSE RELLOTGES</span></div>';

      var moodGrid = document.createElement("div");
      moodGrid.className = "badge-grid";
      var moods = data.YOGA_MOODS || [];
      for (var m = 0; m < moods.length; m++) {
        (function (md) {
          var mb = document.createElement("button");
          mb.type = "button";
          mb.className = "badge-card unlocked" + (st.yogaMood === md.id ? " active" : "");
          mb.style.textAlign = "left";
          mb.style.alignItems = "flex-start";
          mb.innerHTML =
            '<div class="badge-card-title">' + md.label + "</div>" +
            '<div class="badge-card-desc">' + md.sub + "</div>";
          mb.addEventListener("click", function (ev) {
            ev.preventDefault();
            st.yogaMood = md.id;
            st.yogaNotice = "";
            saveState(st);
            redraw();
          });
          moodGrid.appendChild(mb);
        })(moods[m]);
      }
      builderCard.appendChild(moodGrid);
      wrap.appendChild(builderCard);

      var lenCard = document.createElement("div");
      lenCard.className = "scenario-card";
      lenCard.innerHTML =
        '<div class="scenario-kicker"><span>2. DURADA DE LA PRÀCTICA</span><span>SEQÜÈNCIA HARMÒNICA</span></div>';

      var lenRow = document.createElement("div");
      lenRow.className = "subtabs-row";
      var lengths = data.YOGA_LENGTHS || [];
      for (var l = 0; l < lengths.length; l++) {
        (function (ln) {
          var lb = mkBtn(
            "pill-btn" + (st.yogaLength === ln.id ? " active" : ""),
            ln.label + " (+" + ln.calmaBonus + ")",
            function () {
              st.yogaLength = ln.id;
              st.yogaNotice = "";
              saveState(st);
              redraw();
            }
          );
          lb.style.flex = "1";
          lenRow.appendChild(lb);
        })(lengths[l]);
      }
      lenCard.appendChild(lenRow);
      wrap.appendChild(lenCard);

      var btnStart = mkBtn("btn-lg active", "Començar sessió a mida →", function () {
        st.yogaList = buildYogaSessionList(st.yogaMood, st.yogaLength);
        st.yogaStep = 0;
        st.yogaActive = true;
        st.yogaNotice = "";
        saveState(st);
        redraw();
      });
      btnStart.style.width = "100%";
      wrap.appendChild(btnStart);
    }

    function renderJocs(wrap) {
      var catRow = document.createElement("div");
      catRow.className = "subtabs-row";
      var cats = data.PLAY_CATS || [];
      for (var c = 0; c < cats.length; c++) {
        (function (ct) {
          var b = mkBtn("pill-btn" + (st.playCat === ct.id ? " active" : ""), ct.label, function () {
            st.playCat = ct.id;
            st.playPage = 0;
            saveState(st);
            redraw();
          });
          catRow.appendChild(b);
        })(cats[c]);
      }
      wrap.appendChild(catRow);

      var allIdeas = data.PLAY_IDEAS || [];
      var filtered = [];
      for (var i = 0; i < allIdeas.length; i++) {
        if (st.playCat === "all" || allIdeas[i].cat === st.playCat) {
          filtered.push(allIdeas[i]);
        }
      }

      var pageInfo = window.CalmUI.slicePage(filtered, st.playPage, 3);
      st.playPage = pageInfo.page;

      var listEl = document.createElement("div");
      listEl.className = "item-list";

      var catNames = {
        sofa: "Sofà · Energia Mínima",
        casa: "Tarda a Casa",
        riure: "10 Min de Riure",
        vespre: "Calma de Vespre"
      };

      for (var j = 0; j < pageInfo.items.length; j++) {
        (function (item) {
          var done = !!st.triedGames[item.id];
          var row = document.createElement("div");
          row.className = "item-row" + (done ? " owned" : "");

          var main = document.createElement("div");
          main.className = "item-row-main";
          main.innerHTML =
            '<div class="item-row-title">' + item.title + "</div>" +
            '<div class="item-row-sub">' + item.age + " · " + (catNames[item.cat] || item.cat) + "</div>" +
            '<p class="scenario-body" style="font-size:0.88rem; margin-top:2px;">' + item.desc + "</p>";

          var actions = document.createElement("div");
          actions.className = "item-row-actions";
          var btnTry = mkBtn("btn-sm" + (done ? " active" : ""), done ? "★ Jugat" : "☆ Jugar", function () {
            if (!st.triedGames[item.id]) {
              st.triedGames[item.id] = true;
              st.vincle = window.CalmUI.clamp(st.vincle + 2, 10, 100);
            } else {
              delete st.triedGames[item.id];
            }
            saveState(st);
            redraw();
          });
          actions.appendChild(btnTry);

          row.appendChild(main);
          row.appendChild(actions);
          listEl.appendChild(row);
        })(pageInfo.items[j]);
      }

      wrap.appendChild(listEl);
      wrap.appendChild(window.CalmUI.renderPager(pageInfo, function (newPage) {
        st.playPage = newPage;
        saveState(st);
        redraw();
      }));
    }

    function renderFrases(wrap) {
      var catRow = document.createElement("div");
      catRow.className = "subtabs-row";
      var cats = data.PHRASE_CATS || [];
      for (var c = 0; c < cats.length; c++) {
        (function (ct) {
          var b = mkBtn("pill-btn" + (st.phraseCat === ct.id ? " active" : ""), ct.label, function () {
            st.phraseCat = ct.id;
            st.phrasePage = 0;
            saveState(st);
            redraw();
          });
          catRow.appendChild(b);
        })(cats[c]);
      }

      var favCount = countKeys(st.favPhrases);
      if (favCount > 0 || st.phraseCat === "favs") {
        var bFavFilter = mkBtn(
          "pill-btn" + (st.phraseCat === "favs" ? " active" : ""),
          "♥ Desades (" + favCount + ")",
          function () {
            st.phraseCat = "favs";
            st.phrasePage = 0;
            saveState(st);
            redraw();
          }
        );
        catRow.appendChild(bFavFilter);
      }
      wrap.appendChild(catRow);

      var allPhrases = data.CHEATSHEET || [];
      var filtered = [];
      for (var i = 0; i < allPhrases.length; i++) {
        var ph = allPhrases[i];
        if (st.phraseCat === "all") {
          filtered.push(ph);
        } else if (st.phraseCat === "favs") {
          if (st.favPhrases[ph.id]) filtered.push(ph);
        } else if (ph.cat === st.phraseCat) {
          filtered.push(ph);
        }
      }

      if (filtered.length === 0) {
        var emptyCard = document.createElement("div");
        emptyCard.className = "scenario-card";
        emptyCard.innerHTML = '<p class="scenario-body">Encara no has desat cap frase preferida. Prem ♡ en qualsevol frase per tenir-la sempre a mà.</p>';
        wrap.appendChild(emptyCard);
        return;
      }

      var pageInfo = window.CalmUI.slicePage(filtered, st.phrasePage, 3);
      st.phrasePage = pageInfo.page;

      var listEl = document.createElement("div");
      listEl.className = "item-list";

      for (var j = 0; j < pageInfo.items.length; j++) {
        (function (item) {
          var isFav = !!st.favPhrases[item.id];
          var row = document.createElement("div");
          row.className = "item-row" + (isFav ? " owned" : "");

          var main = document.createElement("div");
          main.className = "item-row-main";
          main.innerHTML =
            '<div class="item-row-sub">' + item.sit.toUpperCase() + "</div>" +
            '<p class="scenario-body" style="font-size:0.9rem; margin-top:2px;">' + item.say + "</p>";

          var actions = document.createElement("div");
          actions.className = "item-row-actions";
          var btnFav = mkBtn("btn-sm" + (isFav ? " active" : ""), isFav ? "♥" : "♡", function () {
            if (st.favPhrases[item.id]) {
              delete st.favPhrases[item.id];
            } else {
              st.favPhrases[item.id] = true;
            }
            saveState(st);
            redraw();
          });
          actions.appendChild(btnFav);

          row.appendChild(main);
          row.appendChild(actions);
          listEl.appendChild(row);
        })(pageInfo.items[j]);
      }

      wrap.appendChild(listEl);
      wrap.appendChild(window.CalmUI.renderPager(pageInfo, function (newPage) {
        st.phrasePage = newPage;
        saveState(st);
        redraw();
      }));
    }

    function renderProgres(wrap) {
      var seenTotal = countKeys(st.seenScenes);
      var totalScenes = (data.SCENES || []).length;

      var summary = document.createElement("div");
      summary.className = "context-banner";
      summary.innerHTML =
        "<span>ESCENES: " + seenTotal + "/" + totalScenes + " · IOGA: " + (st.yogaSessionsDone || 0) + "</span>" +
        "<span>JOCS: " + countKeys(st.triedGames) + " · FRASES ♥: " + countKeys(st.favPhrases) + "</span>";
      wrap.appendChild(summary);

      // Stage breakdown buttons
      var stCard = document.createElement("div");
      stCard.className = "scenario-card";
      stCard.innerHTML = '<div class="scenario-kicker"><span>CAMÍ EVOLUTIU PER ETAPES</span><span>TOCA PER OBRIR</span></div>';
      var stPills = document.createElement("div");
      stPills.className = "subtabs-row";
      var stages = data.STAGES || [];
      for (var i = 0; i < stages.length; i++) {
        if (stages[i].id === "all") continue;
        (function (sg) {
          var sList = getScenesForStage(sg.id);
          var sDone = countSeenInList(sList, st.seenScenes);
          var b = mkBtn("pill-btn" + (sDone >= sList.length ? " active" : ""), sg.label + ": " + sDone + "/" + sList.length, function () {
            st.stageFilter = sg.id;
            st.currentSceneId = null;
            st.lastFeedback = null;
            st.tab = "crianca";
            resolveCurrentScene(st);
            saveState(st);
            redraw();
          });
          stPills.appendChild(b);
        })(stages[i]);
      }
      stCard.appendChild(stPills);
      wrap.appendChild(stCard);

      // Badges 2x3
      var bGrid = document.createElement("div");
      bGrid.className = "badge-grid";
      var badges = data.BADGES || [];
      for (var k = 0; k < badges.length; k++) {
        var bg = badges[k];
        var ok = isBadgeUnlocked(bg.id, st);
        var bCard = document.createElement("div");
        bCard.className = "badge-card" + (ok ? " unlocked" : "");
        bCard.innerHTML =
          '<div class="badge-card-title">' + (ok ? "✓ " : "○ ") + bg.title + "</div>" +
          '<div class="badge-card-desc">' + bg.desc + "</div>";
        bGrid.appendChild(bCard);
      }
      wrap.appendChild(bGrid);

      // Gentle reset option without browser popups
      var foot = document.createElement("div");
      foot.className = "toolbar-row";
      var btnReset = mkBtn(
        "btn-sm" + (st.confirmResetSeen ? " active" : ""),
        st.confirmResetSeen ? " Segur? Toca per reiniciar lectures" : "↺ Reiniciar comptador d'escenes",
        function () {
          if (!st.confirmResetSeen) {
            st.confirmResetSeen = true;
          } else {
            st.seenScenes = {};
            st.currentSceneId = null;
            st.confirmResetSeen = false;
          }
          saveState(st);
          redraw();
        }
      );
      var btnBack = mkBtn("btn-sm", "Continuar Criança →", function () {
        st.tab = "crianca";
        st.confirmResetSeen = false;
        saveState(st);
        redraw();
      });
      foot.appendChild(btnReset);
      foot.appendChild(btnBack);
      wrap.appendChild(foot);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    var seen = countKeys(st.seenScenes);
    return "♥ " + st.vincle + " · ✓ " + seen + "/85 · ◯ " + st.calma;
  }

  window.CalmGames.crianca = {
    id: "crianca",
    title: "Créixer amb Calma",
    desc: "Criança respectuosa de 0 a 12 anys (85 situacions), estudi de ioga restauratiu a mida amb 18 postures SVG, jocs al sofà i frases pont.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Créixer amb Calma · Criança 0–12a & Estudi de Ioga</h2>" +
      "<ul>" +
      "<li><b>Criança (0–12 anys):</b> 85 situacions reals repartides en 5 etapes evolutives amb psicologia i neurociència pràctica (Siegel, Dweck, Tronick, Satter, Juul).</li>" +
      "<li><b>Estudi de Ioga:</b> Tria com et sents avui i la durada (3, 5 o 8 postures) per seguir una pràctica guiada sense rellotges amb 18 postures i respiracions il·lustrades.</li>" +
      "<li><b>Jocs i Frases:</b> 34 jocs sense pantalles (inclosos jocs d'energia mínima estirada al sofà!) i 38 frases pont per als moments intensos.</li>" +
      "</ul>"
  };
})();
