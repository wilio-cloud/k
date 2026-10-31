// Joc 5: Buscamines Tàctil E-Ink v6 (Mode Expedició de 30 Nivells + Partida Lliure 3 Mides + Rècords)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "mines_state_v6";
  var STATS_KEY = "mines_stats_v6";

  var PRESETS = {
    compact: { id: "compact", label: "8×8", cols: 8, rows: 8, mines: 10, cls: "" },
    tall:    { id: "tall",    label: "9×10", cols: 9, rows: 10, mines: 15, cls: "large" },
    expert:  { id: "expert",  label: "10×11", cols: 10, rows: 11, mines: 21, cls: "expert" }
  };

  // 30 progressive Expedition levels for multi-day play
  var EXPEDITION = [
    { lvl: 1,  name: "Clariana del Bosc",    cols: 7,  rows: 7,  mines: 6,  cls: "" },
    { lvl: 2,  name: "Camí de Pedra",        cols: 7,  rows: 8,  mines: 7,  cls: "" },
    { lvl: 3,  name: " Riera Serena",        cols: 8,  rows: 8,  mines: 9,  cls: "" },
    { lvl: 4,  name: "Prat d'Alçada",        cols: 8,  rows: 8,  mines: 10, cls: "" },
    { lvl: 5,  name: "Coll de Boira",        cols: 8,  rows: 8,  mines: 11, cls: "" },
    { lvl: 6,  name: "Feixa Antiga",         cols: 8,  rows: 9,  mines: 12, cls: "large" },
    { lvl: 7,  name: "Mirador de Ponent",    cols: 8,  rows: 9,  mines: 13, cls: "large" },
    { lvl: 8,  name: "Bosc de Fageda",       cols: 9,  rows: 9,  mines: 13, cls: "large" },
    { lvl: 9,  name: "Pas del Contrabandista", cols: 9, rows: 9, mines: 14, cls: "large" },
    { lvl: 10, name: "Refugi de Muntanya",   cols: 9,  rows: 10, mines: 15, cls: "large" },
    { lvl: 11, name: "Vall Silenciosa",      cols: 9,  rows: 10, mines: 16, cls: "large" },
    { lvl: 12, name: "Carena del Vent",      cols: 9,  rows: 10, mines: 17, cls: "large" },
    { lvl: 13, name: "Tartera Gran",         cols: 9,  rows: 10, mines: 17, cls: "large" },
    { lvl: 14, name: "Estany Glaçat",        cols: 9,  rows: 10, mines: 18, cls: "large" },
    { lvl: 15, name: "Portella Alta",        cols: 10, rows: 10, mines: 18, cls: "expert" },
    { lvl: 16, name: "Cresta de Granit",     cols: 10, rows: 10, mines: 19, cls: "expert" },
    { lvl: 17, name: "Barranc Fosc",         cols: 10, rows: 10, mines: 20, cls: "expert" },
    { lvl: 18, name: "Torre de Guaita",      cols: 10, rows: 10, mines: 20, cls: "expert" },
    { lvl: 19, name: "Laberint de Roca",     cols: 10, rows: 11, mines: 20, cls: "expert" },
    { lvl: 20, name: "Cim dels Isards",      cols: 10, rows: 11, mines: 21, cls: "expert" },
    { lvl: 21, name: "Glacera Nord",         cols: 10, rows: 11, mines: 21, cls: "expert" },
    { lvl: 22, name: "Agulla Vertical",      cols: 10, rows: 11, mines: 22, cls: "expert" },
    { lvl: 23, name: "Pas de l'Àliga",       cols: 10, rows: 11, mines: 22, cls: "expert" },
    { lvl: 24, name: "Congost Estret",       cols: 10, rows: 11, mines: 23, cls: "expert" },
    { lvl: 25, name: "Altiplà Solitari",     cols: 10, rows: 11, mines: 23, cls: "expert" },
    { lvl: 26, name: "Aresta de Neu",        cols: 10, rows: 11, mines: 24, cls: "expert" },
    { lvl: 27, name: "Paret dels Titans",    cols: 10, rows: 11, mines: 24, cls: "expert" },
    { lvl: 28, name: "Collada Tempesta",     cols: 10, rows: 11, mines: 25, cls: "expert" },
    { lvl: 29, name: "Avantcim de Cristall", cols: 10, rows: 11, mines: 25, cls: "expert" },
    { lvl: 30, name: "★ Cim Mestre E-Ink",   cols: 10, rows: 11, mines: 26, cls: "expert" }
  ];

  function loadStats() {
    var s = window.CalmStorage.get(STATS_KEY, null);
    if (s && typeof s.wins === "number") return s;
    return {
      wins: 0,
      played: 0,
      streak: 0,
      bestStreak: 0,
      maxExpUnlocked: 1,
      expCleared: {}
    };
  }

  function saveStats(s) {
    window.CalmStorage.set(STATS_KEY, s);
  }

  function createBoardState(mode, keyOrLvl) {
    var cols, rows, mineTotal, cls, titleLabel, expLvl = 1, presetId = "compact";
    if (mode === "expedition") {
      expLvl = window.CalmUI.clamp(keyOrLvl || 1, 1, EXPEDITION.length);
      var ex = EXPEDITION[expLvl - 1];
      cols = ex.cols;
      rows = ex.rows;
      mineTotal = ex.mines;
      cls = ex.cls;
      titleLabel = "Etapa " + ex.lvl + "/30 · " + ex.name.trim();
    } else {
      var pr = PRESETS[keyOrLvl] || PRESETS.compact;
      presetId = pr.id;
      cols = pr.cols;
      rows = pr.rows;
      mineTotal = pr.mines;
      cls = pr.cls;
      titleLabel = "Lliure " + pr.label + " (" + pr.mines + " mines)";
    }

    var total = cols * rows;
    var mines = [];
    var state = [];
    var counts = [];
    for (var i = 0; i < total; i++) {
      mines.push(false);
      state.push(0);
      counts.push(0);
    }

    return {
      mode: mode, // "expedition" | "free"
      tab: "tauler", // "tauler" | "expedicio" | "records"
      expPage: Math.floor((expLvl - 1) / 4),
      expLvl: expLvl,
      preset: presetId,
      boardCls: cls,
      titleLabel: titleLabel,
      cols: cols,
      rows: rows,
      mineTotal: mineTotal,
      generated: false,
      mines: mines,
      state: state,
      counts: counts,
      flagMode: false,
      status: "playing",
      explodedIdx: -1,
      moves: 0,
      message: mode === "expedition"
        ? titleLabel + " · 1a casella segura."
        : "Toca qualsevol casella (la 1a sempre obre clariana)."
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.state && saved.cols && saved.rows && saved.tab) return saved;
    var stats = loadStats();
    return createBoardState("expedition", stats.maxExpUnlocked || 1);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function neighbors(st, idx) {
    var r = Math.floor(idx / st.cols);
    var c = idx % st.cols;
    var out = [];
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = r + dr;
        var nc = c + dc;
        if (nr >= 0 && nr < st.rows && nc >= 0 && nc < st.cols) {
          out.push(nr * st.cols + nc);
        }
      }
    }
    return out;
  }

  function placeMinesAfterFirstTap(st, safeIdx) {
    var forbidden = {};
    forbidden[safeIdx] = true;
    var nbs = neighbors(st, safeIdx);
    for (var i = 0; i < nbs.length; i++) forbidden[nbs[i]] = true;

    var total = st.cols * st.rows;
    var pool = [];
    for (var k = 0; k < total; k++) {
      if (!forbidden[k]) pool.push(k);
    }
    for (var m = 0; m < st.mineTotal && pool.length > 0; m++) {
      var pick = Math.floor(Math.random() * pool.length);
      var mIdx = pool.splice(pick, 1)[0];
      st.mines[mIdx] = true;
    }
    for (var idx = 0; idx < total; idx++) {
      if (st.mines[idx]) continue;
      var adj = neighbors(st, idx);
      var cnt = 0;
      for (var j = 0; j < adj.length; j++) {
        if (st.mines[adj[j]]) cnt++;
      }
      st.counts[idx] = cnt;
    }
    st.generated = true;
  }

  function floodOpen(st, startIdx) {
    var queue = [startIdx];
    while (queue.length > 0) {
      var cur = queue.shift();
      if (st.state[cur] !== 0) continue;
      st.state[cur] = 1;
      if (st.counts[cur] === 0 && !st.mines[cur]) {
        var adj = neighbors(st, cur);
        for (var i = 0; i < adj.length; i++) {
          if (st.state[adj[i]] === 0) queue.push(adj[i]);
        }
      }
    }
  }

  function checkWin(st) {
    var total = st.cols * st.rows;
    for (var i = 0; i < total; i++) {
      if (!st.mines[i] && st.state[i] !== 1) return false;
    }
    return true;
  }

  function registerOutcome(st, won) {
    var stats = loadStats();
    stats.played = (stats.played || 0) + 1;
    if (won) {
      stats.wins = (stats.wins || 0) + 1;
      stats.streak = (stats.streak || 0) + 1;
      if (stats.streak > (stats.bestStreak || 0)) stats.bestStreak = stats.streak;
      if (st.mode === "expedition") {
        stats.expCleared[st.expLvl] = true;
        if (st.expLvl >= (stats.maxExpUnlocked || 1) && st.expLvl < EXPEDITION.length) {
          stats.maxExpUnlocked = st.expLvl + 1;
        }
      }
    } else {
      stats.streak = 0;
    }
    saveStats(stats);
  }

  function handleWin(st) {
    st.status = "won";
    // Auto-flag remaining mines cleanly
    for (var i = 0; i < st.mines.length; i++) {
      if (st.mines[i]) st.state[i] = 2;
    }
    registerOutcome(st, true);
    if (st.mode === "expedition") {
      if (st.expLvl < EXPEDITION.length) {
        st.message = "★ Etapa " + st.expLvl + " superada! Desbloquejada l'Etapa " + (st.expLvl + 1) + ".";
      } else {
        st.message = "★★ LLEGENDARI! Has completat les 30 etapes de l'Expedició!";
      }
    } else {
      st.message = "★ Camp desactivat amb èxit! (" + st.moves + " tocs).";
    }
  }

  function handleLoss(st, boomIdx, msg) {
    st.state[boomIdx] = 1;
    st.status = "lost";
    st.explodedIdx = boomIdx;
    st.message = msg;
    registerOutcome(st, false);
  }

  function triggerCell(st, idx) {
    if (st.status !== "playing") return;

    if (st.state[idx] === 1 && st.counts[idx] > 0) {
      var adj = neighbors(st, idx);
      var flagCnt = 0;
      var k;
      for (k = 0; k < adj.length; k++) {
        if (st.state[adj[k]] === 2) flagCnt++;
      }
      if (flagCnt === st.counts[idx]) {
        st.moves += 1;
        for (k = 0; k < adj.length; k++) {
          var nb = adj[k];
          if (st.state[nb] === 0) {
            if (st.mines[nb]) {
              handleLoss(st, nb, "Una bandera era errònia i ha detonat una mina!");
              return;
            }
            floodOpen(st, nb);
          }
        }
        if (checkWin(st)) handleWin(st);
        else st.message = "Veïnes obertes en bloc.";
      }
      return;
    }

    if (st.flagMode) {
      if (st.state[idx] === 0) {
        st.state[idx] = 2;
        st.message = "Bandera posada (⚑).";
      } else if (st.state[idx] === 2) {
        st.state[idx] = 0;
        st.message = "Bandera retirada.";
      }
      return;
    }

    if (st.state[idx] === 2) {
      st.message = "Casella amb bandera. Activa ⚑ si la vols treure.";
      return;
    }

    if (!st.generated) {
      placeMinesAfterFirstTap(st, idx);
    }

    st.moves += 1;
    if (st.mines[idx]) {
      handleLoss(st, idx, "Bum! Has tocat una mina. Pots reintentar l'etapa.");
      return;
    }

    floodOpen(st, idx);
    if (checkWin(st)) {
      handleWin(st);
    } else {
      st.message = st.titleLabel + " · Deducció en curs.";
    }
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";
      var stats = loadStats();

      // Top Navigation Bar
      var navBar = document.createElement("div");
      navBar.className = "toolbar-row";

      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "tauler", label: "Tauler" },
        { id: "expedicio", label: "Expedició (" + Object.keys(stats.expCleared).length + "/30)" },
        { id: "records", label: "Lliure & Rècords" }
      ].forEach(function (t) {
        var b = window.CalmUI.mkBtn("btn-sm" + (st.tab === t.id ? " active" : ""), t.label, function () {
          st.tab = t.id;
          saveState(st);
          redraw();
        });
        tabs.appendChild(b);
      });
      navBar.appendChild(tabs);

      var btnQuickNew = window.CalmUI.mkBtn("btn-sm", "↻ Nou", function () {
        if (st.mode === "expedition") {
          st = createBoardState("expedition", st.expLvl);
        } else {
          st = createBoardState("free", st.preset);
        }
        saveState(st);
        redraw();
      });
      navBar.appendChild(btnQuickNew);
      wrap.appendChild(navBar);

      // TAB 2: EXPEDITION 30 LEVELS
      if (st.tab === "expedicio") {
        var head = document.createElement("div");
        head.className = "scenario-card";
        head.innerHTML =
          '<div class="scenario-kicker"><span>CAMÍ DELS 30 CIMS</span><span>SUPERADES: ' + Object.keys(stats.expCleared).length + '/30 · RATXA: ' + stats.streak + '</span></div>' +
          '<p class="scenario-body">Supera cada tauler per desbloquejar el següent cim. La densitat de mines i la mida creixen gradualment fins al nivell 30.</p>';
        wrap.appendChild(head);

        var pg = window.CalmUI.slicePage(EXPEDITION, st.expPage || 0, 4);
        st.expPage = pg.page;

        var list = document.createElement("div");
        list.className = "item-list";
        pg.items.forEach(function (ex) {
          var unlocked = ex.lvl <= (stats.maxExpUnlocked || 1);
          var cleared = !!stats.expCleared[ex.lvl];
          var row = document.createElement("div");
          row.className = "item-row" + (cleared ? " owned" : "");
          row.innerHTML =
            '<div class="item-row-main">' +
              '<div class="item-row-title">' + (cleared ? "★ " : unlocked ? "→ " : "◇ ") + "Etapa " + ex.lvl + ": " + ex.name.trim() + "</div>" +
              '<div class="item-row-sub">Tauler ' + ex.cols + "×" + ex.rows + " · " + ex.mines + " mines</div>" +
            "</div>";

          var act = document.createElement("div");
          act.className = "item-row-actions";
          var bPlay = window.CalmUI.mkBtn(
            "btn-sm" + (st.mode === "expedition" && st.expLvl === ex.lvl ? " active" : ""),
            unlocked ? (cleared ? "Rejugar" : "Jugar") : "Tancat",
            function () {
              if (!unlocked) return;
              st = createBoardState("expedition", ex.lvl);
              saveState(st);
              redraw();
            }
          );
          if (!unlocked) bPlay.disabled = true;
          act.appendChild(bPlay);
          row.appendChild(act);
          list.appendChild(row);
        });
        wrap.appendChild(list);

        wrap.appendChild(window.CalmUI.renderPager(pg, function (newP) {
          st.expPage = newP;
          saveState(st);
          redraw();
        }));
        container.appendChild(wrap);
        return;
      }

      // TAB 3: FREE PLAY PRESETS & STATS
      if (st.tab === "records") {
        var winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
        var sHud = document.createElement("div");
        sHud.className = "hud-grid";
        sHud.innerHTML =
          '<div class="hud-cell invert"><div class="hud-label">VICTÒRIES</div><div class="hud-val">' + stats.wins + '</div><div class="hud-label">' + winRate + '% èxit</div></div>' +
          '<div class="hud-cell"><div class="hud-label">PARTIDES</div><div class="hud-val">' + stats.played + '</div><div class="hud-label">Totals</div></div>' +
          '<div class="hud-cell"><div class="hud-label">RATXA ACTUAL</div><div class="hud-val">' + stats.streak + '</div><div class="hud-label">Rècord: ' + stats.bestStreak + '</div></div>' +
          '<div class="hud-cell"><div class="hud-label">EXPEDICIÓ</div><div class="hud-val">' + Object.keys(stats.expCleared).length + '/30</div><div class="hud-label">Max #' + stats.maxExpUnlocked + '</div></div>';
        wrap.appendChild(sHud);

        var freeCard = document.createElement("div");
        freeCard.className = "scenario-card";
        freeCard.innerHTML =
          '<div class="scenario-kicker"><span>PARTIDA LLIURE IMMEDIATA</span><span>TRIA MIDA</span></div>' +
          '<p class="scenario-body">Vols jugar un tauler solt sense seguir l\'expedició? Escull una de les tres mides calibrades per al Kindle:</p>';
        wrap.appendChild(freeCard);

        var fStack = document.createElement("div");
        fStack.className = "choice-stack";
        [
          { id: "compact", k: "1", t: " Compacte 8×8 (10 mines)", s: "Caselles grans · Ideal per relaxar la vista en 3 minuts" },
          { id: "tall",    k: "2", t: "Clàssic 9×10 (15 mines)", s: "Equilibri tàctic · Deducció encadenada mitjana" },
          { id: "expert",  k: "3", t: "Expert 10×11 (21 mines)", s: "Alta densitat · Exigeix comptatge fi de banderes" }
        ].forEach(function (pr) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "choice-btn" + (st.mode === "free" && st.preset === pr.id ? " active" : "");
          b.innerHTML =
            '<span class="choice-key">' + pr.k + '</span>' +
            '<div class="choice-content"><div class="choice-main">' + pr.t + '</div><div class="choice-sub">' + pr.s + '</div></div>';
          b.addEventListener("click", function () {
            st = createBoardState("free", pr.id);
            saveState(st);
            redraw();
          });
          fStack.appendChild(b);
        });
        wrap.appendChild(fStack);
        container.appendChild(wrap);
        return;
      }

      // TAB 1: ACTIVE BOARD
      var flagsUsed = 0;
      for (var i = 0; i < st.state.length; i++) {
        if (st.state[i] === 2) flagsUsed++;
      }

      var status = document.createElement("div");
      status.className = "status-bar" + (st.status !== "playing" ? " solid" : "");
      status.textContent = st.message + (st.status === "playing" ? "  [⚑ " + (st.mineTotal - flagsUsed) + "]" : "");
      wrap.appendChild(status);

      var board = document.createElement("div");
      board.className = "mines-board" + (st.boardCls ? " " + st.boardCls : "");
      board.style.gridTemplateColumns = "repeat(" + st.cols + ", 1fr)";

      var total = st.cols * st.rows;
      for (var k = 0; k < total; k++) {
        (function (cellIdx) {
          var cell = document.createElement("button");
          cell.type = "button";
          var s = st.state[cellIdx];
          var isMine = st.mines[cellIdx];
          var cls = ["mine-cell"];

          if (st.status === "lost" && isMine) {
            cls.push(cellIdx === st.explodedIdx ? "exploded" : "opened");
            cell.textContent = "✹";
          } else if (s === 0) {
            cls.push("unopened");
            cell.textContent = "";
          } else if (s === 2) {
            cls.push("flagged");
            cell.textContent = "⚑";
          } else {
            cls.push("opened");
            var cnt = st.counts[cellIdx];
            cell.textContent = cnt > 0 ? String(cnt) : "";
          }

          cell.className = cls.join(" ");
          cell.addEventListener("click", function () {
            triggerCell(st, cellIdx);
            saveState(st);
            redraw();
          });
          board.appendChild(cell);
        })(k);
      }
      wrap.appendChild(board);

      // Bottom Controls: Next Expedition Stage when won, or Dig/Flag toggles when playing
      var barBot = document.createElement("div");
      barBot.className = "toolbar-row";

      if (st.status === "won" && st.mode === "expedition" && st.expLvl < EXPEDITION.length) {
        var btnNextLvl = window.CalmUI.mkBtn("btn-lg active", "Passar a l'Etapa " + (st.expLvl + 1) + " →", function () {
          st = createBoardState("expedition", st.expLvl + 1);
          saveState(st);
          redraw();
        });
        btnNextLvl.style.width = "100%";
        barBot.appendChild(btnNextLvl);
      } else if (st.status !== "playing") {
        var btnRetry = window.CalmUI.mkBtn("btn-lg active", "↻ Tornar a jugar aquest tauler", function () {
          st = st.mode === "expedition" ? createBoardState("expedition", st.expLvl) : createBoardState("free", st.preset);
          saveState(st);
          redraw();
        });
        btnRetry.style.width = "100%";
        barBot.appendChild(btnRetry);
      } else {
        var btnDig = window.CalmUI.mkBtn("btn-lg" + (!st.flagMode ? " active" : ""), "□ Obrir casella", function () {
          st.flagMode = false;
          saveState(st);
          redraw();
        });
        btnDig.style.flex = "1";

        var btnFlag = window.CalmUI.mkBtn("btn-lg" + (st.flagMode ? " active" : ""), "⚑ Bandera (" + (st.mineTotal - flagsUsed) + ")", function () {
          st.flagMode = true;
          saveState(st);
          redraw();
        });
        btnFlag.style.flex = "1";

        barBot.appendChild(btnDig);
        barBot.appendChild(btnFlag);
      }

      wrap.appendChild(barBot);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var stats = loadStats();
    var cleared = Object.keys(stats.expCleared).length;
    if (cleared > 0) return "Cims " + cleared + "/30";
    var st = loadState();
    return "Etapa " + (st.expLvl || 1) + "/30";
  }

  window.CalmGames.minesweeper = {
    id: "minesweeper",
    title: "Buscamines Tàctil",
    desc: "Expedició de 30 cims progressius i taulers lliures (8×8, 9×10 i 10×11 Expert).",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Buscamines Tàctil v6 · Expedició dels 30 Cims</h2>" +
      "<ul>" +
      "<li><b>Mode Expedició (30 nivells):</b> comences en una clariana suau 7×7 i vas desbloquejant 30 etapes fins al Cim Mestre 10×11 amb 26 mines!</li>" +
      "<li><b>Partida Lliure i Rècords:</b> juga quan vulguis en mides 8×8, 9×10 o 10×11 seguint el teu percentatge d'èxit i millor ratxa.</li>" +
      "<li><b>Drecera ràpida:</b> tocar un número ja obert que té totes les banderes al voltant obre de cop les caselles veïnes segures.</li>" +
      "</ul>"
  };
})();
