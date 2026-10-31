// Joc 5: Buscamines Tàctil E-Ink (Primera obertura segura + selector Obrir/Bandera)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "mines_state";

  var PRESETS = {
    compact: { id: "compact", label: "8×8 (10 mines)", cols: 8, rows: 8, mines: 10 },
    tall:    { id: "tall",    label: "9×10 (15 mines)", cols: 9, rows: 10, mines: 15 }
  };

  function createState(presetId) {
    var pr = PRESETS[presetId] || PRESETS.compact;
    var total = pr.cols * pr.rows;
    var mines = [];
    var state = []; // 0=unopened, 1=opened, 2=flagged
    var counts = [];
    for (var i = 0; i < total; i++) {
      mines.push(false);
      state.push(0);
      counts.push(0);
    }
    return {
      preset: pr.id,
      cols: pr.cols,
      rows: pr.rows,
      mineTotal: pr.mines,
      generated: false,
      mines: mines,
      state: state,
      counts: counts,
      flagMode: false,
      status: "playing", // playing | won | lost
      explodedIdx: -1,
      message: "Toca qualsevol casella per començar (la primera sempre és segura)."
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.state && saved.cols && saved.rows) return saved;
    return createState("compact");
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

  function triggerCell(st, idx) {
    if (st.status !== "playing") return;

    // Smart chord: tapping an already opened number when adjacent flags == number opens remaining neighbors
    if (st.state[idx] === 1 && st.counts[idx] > 0) {
      var adj = neighbors(st, idx);
      var flagCnt = 0;
      var k;
      for (k = 0; k < adj.length; k++) {
        if (st.state[adj[k]] === 2) flagCnt++;
      }
      if (flagCnt === st.counts[idx]) {
        for (k = 0; k < adj.length; k++) {
          var nb = adj[k];
          if (st.state[nb] === 0) {
            if (st.mines[nb]) {
              st.state[nb] = 1;
              st.status = "lost";
              st.explodedIdx = nb;
              st.message = "Una bandera era incorrecta i ha detonat una mina!";
              return;
            }
            floodOpen(st, nb);
          }
        }
        if (checkWin(st)) {
          st.status = "won";
          st.message = " Magnífic! Has netejat tot el camp de mines.";
        } else {
          st.message = "Veïnes obertes automàticament.";
        }
      }
      return;
    }

    if (st.flagMode) {
      if (st.state[idx] === 0) {
        st.state[idx] = 2;
        st.message = "Bandera col·locada (⚑).";
      } else if (st.state[idx] === 2) {
        st.state[idx] = 0;
        st.message = "Bandera retirada.";
      }
      return;
    }

    if (st.state[idx] === 2) {
      st.message = "Casella protegida amb bandera. Passa al mode ⚑ si la vols treure.";
      return;
    }

    if (!st.generated) {
      placeMinesAfterFirstTap(st, idx);
    }

    if (st.mines[idx]) {
      st.state[idx] = 1;
      st.status = "lost";
      st.explodedIdx = idx;
      st.message = "Bum! Has tocat una mina. Pots iniciar un tauler nou.";
      return;
    }

    floodOpen(st, idx);
    if (checkWin(st)) {
      st.status = "won";
      st.message = "Enhorabona! Camp completament desactivat sense cap error.";
    } else {
      st.message = "Continua deduint amb calma.";
    }
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status
      var status = document.createElement("div");
      status.className = "status-bar" + (st.status !== "playing" ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top bar: Preset + Remaining mines + New board
      var barTop = document.createElement("div");
      barTop.className = "toolbar-row";

      var segPreset = document.createElement("div");
      segPreset.className = "segmented";
      ["compact", "tall"].forEach(function (pid) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.preset === pid ? " active" : "");
        b.textContent = pid === "compact" ? "8×8" : "9×10";
        b.onclick = function () {
          st = createState(pid);
          saveState(st);
          redraw();
        };
        segPreset.appendChild(b);
      });
      barTop.appendChild(segPreset);

      var flagsUsed = 0;
      for (var i = 0; i < st.state.length; i++) {
        if (st.state[i] === 2) flagsUsed++;
      }

      var infoMid = document.createElement("span");
      infoMid.style.fontWeight = "bold";
      infoMid.style.fontSize = "0.9rem";
      infoMid.textContent = "⚑ " + (st.mineTotal - flagsUsed);
      barTop.appendChild(infoMid);

      var btnReset = document.createElement("button");
      btnReset.className = "btn-sm";
      btnReset.textContent = "↻ Nou tauler";
      btnReset.onclick = function () {
        st = createState(st.preset);
        saveState(st);
        redraw();
      };
      barTop.appendChild(btnReset);
      wrap.appendChild(barTop);

      // Board Grid
      var board = document.createElement("div");
      board.className = "mines-board" + (st.preset === "tall" ? " large" : "");
      board.style.gridTemplateColumns = "repeat(" + st.cols + ", 1fr)";

      var total = st.cols * st.rows;
      for (var k = 0; k < total; k++) {
        (function (cellIdx) {
          var cell = document.createElement("button");
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
          cell.onclick = function () {
            triggerCell(st, cellIdx);
            saveState(st);
            redraw();
          };
          board.appendChild(cell);
        })(k);
      }
      wrap.appendChild(board);

      // Large Touch Mode Switcher (Crucial for Kindle E-Ink without right-click!)
      var barBot = document.createElement("div");
      barBot.className = "toolbar-row";

      var btnDig = document.createElement("button");
      btnDig.className = "btn-lg" + (!st.flagMode ? " active" : "");
      btnDig.style.flex = "1";
      btnDig.textContent = "□ Obrir casella";
      btnDig.onclick = function () {
        st.flagMode = false;
        saveState(st);
        redraw();
      };

      var btnFlag = document.createElement("button");
      btnFlag.className = "btn-lg" + (st.flagMode ? " active" : "");
      btnFlag.style.flex = "1";
      btnFlag.textContent = "⚑ Posar bandera";
      btnFlag.onclick = function () {
        st.flagMode = true;
        saveState(st);
        redraw();
      };

      barBot.appendChild(btnDig);
      barBot.appendChild(btnFlag);
      wrap.appendChild(barBot);

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    if (st.status === "won") return "Guanyat ✓";
    return st.cols + "×" + st.rows + " · " + st.mineTotal + " mines";
  }

  window.CalmGames.minesweeper = {
    id: "minesweeper",
    title: "Buscamines Tàctil",
    desc: "Deducció clàssica adaptada a un sol toc amb selector de bandera.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Buscamines Tàctil · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Cada número indica quantes mines hi ha a les 8 caselles que l'envolten.</li>" +
      "<li>La <b>primera casella</b> que obris sempre obrirà una clariana segura.</li>" +
      "<li>Canvia entre <b>□ Obrir</b> i <b>⚑ Bandera</b> amb els dos botons grans inferiors (així no cal mantenir premut el dit al Kindle).</li>" +
      "<li><b>Drecera ràpida:</b> si toques un número ja obert que ja té totes les seves banderes posades al voltant, s'obriran de cop les caselles veïnes lliures!</li>" +
      "</ul>"
  };
})();
