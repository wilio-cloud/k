// Joc 1: Sudoku E-Ink (3 nivells, mode Notes 3x3, Desfer i Pista raonada)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "sudoku_state";

  function createInitialState(level, index) {
    var packs = window.KINDLE_DATA.sudoku;
    var lvl = packs[level] ? level : "facil";
    var list = packs[lvl];
    var idx = (index || 0) % list.length;
    var item = list[idx];

    var notes = [];
    for (var i = 0; i < 81; i++) notes.push([]);

    return {
      level: lvl,
      index: idx,
      given: item.p,
      solution: item.s,
      board: item.p.split(""),
      notes: notes,
      selected: 40,
      noteMode: false,
      history: [],
      completed: false,
      message: "Toca una casella i tria un número. Sense rellotge ni pressa."
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.board && saved.board.length === 81 && saved.given) {
      return saved;
    }
    return createInitialState("facil", 0);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function hasConflict(board, idx) {
    var val = board[idx];
    if (val === "0") return false;
    var r = Math.floor(idx / 9);
    var c = idx % 9;
    var j, i, otherIdx;
    for (j = 0; j < 9; j++) {
      otherIdx = r * 9 + j;
      if (otherIdx !== idx && board[otherIdx] === val) return true;
    }
    for (i = 0; i < 9; i++) {
      otherIdx = i * 9 + c;
      if (otherIdx !== idx && board[otherIdx] === val) return true;
    }
    var br = Math.floor(r / 3) * 3;
    var bc = Math.floor(c / 3) * 3;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        otherIdx = (br + i) * 9 + (bc + j);
        if (otherIdx !== idx && board[otherIdx] === val) return true;
      }
    }
    return false;
  }

  function checkVictory(st) {
    for (var i = 0; i < 81; i++) {
      if (st.board[i] === "0" || hasConflict(st.board, i)) return false;
    }
    return true;
  }

  function clearPeerNotes(notes, idx, numStr) {
    var r = Math.floor(idx / 9);
    var c = idx % 9;
    var br = Math.floor(r / 3) * 3;
    var bc = Math.floor(c / 3) * 3;
    var i, j, p;

    function strip(cellIdx) {
      var arr = notes[cellIdx];
      var pos = arr.indexOf(numStr);
      if (pos !== -1) arr.splice(pos, 1);
    }

    for (j = 0; j < 9; j++) strip(r * 9 + j);
    for (i = 0; i < 9; i++) strip(i * 9 + c);
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        p = (br + i) * 9 + (bc + j);
        strip(p);
      }
    }
  }

  function pushSnapshot(st) {
    var notesCopy = [];
    for (var i = 0; i < 81; i++) notesCopy.push(st.notes[i].slice());
    st.history.push({
      board: st.board.slice(),
      notes: notesCopy
    });
    if (st.history.length > 35) st.history.shift();
  }

  function findLogicalHint(st) {
    // 1. Check if user placed a wrong digit compared to unique solution
    var i, r, c;
    for (i = 0; i < 81; i++) {
      if (st.given.charAt(i) === "0" && st.board[i] !== "0" && st.board[i] !== st.solution.charAt(i)) {
        r = Math.floor(i / 9) + 1;
        c = (i % 9) + 1;
        return {
          idx: i,
          msg: "Revisa la fila " + r + ", col. " + c + ": el " + st.board[i] + " no encaixa amb la solució."
        };
      }
    }
    // 2. Look for a Naked Single (cell with 8 peers already present)
    var bestIdx = -1;
    var bestCount = -1;
    for (i = 0; i < 81; i++) {
      if (st.board[i] === "0") {
        var seen = {};
        r = Math.floor(i / 9);
        c = i % 9;
        var br = Math.floor(r / 3) * 3;
        var bc = Math.floor(c / 3) * 3;
        var k, m, v;
        for (k = 0; k < 9; k++) {
          v = st.board[r * 9 + k]; if (v !== "0") seen[v] = true;
          v = st.board[k * 9 + c]; if (v !== "0") seen[v] = true;
        }
        for (k = 0; k < 3; k++) {
          for (m = 0; m < 3; m++) {
            v = st.board[(br + k) * 9 + (bc + m)];
            if (v !== "0") seen[v] = true;
          }
        }
        var cnt = Object.keys(seen).length;
        if (cnt > bestCount) {
          bestCount = cnt;
          bestIdx = i;
        }
      }
    }
    if (bestIdx !== -1) {
      r = Math.floor(bestIdx / 9) + 1;
      c = (bestIdx % 9) + 1;
      if (bestCount === 8) {
        return {
          idx: bestIdx,
          msg: "Pista: mira la fila " + r + ", col. " + c + ". Només hi cap un sol número!"
        };
      }
      return {
        idx: bestIdx,
        msg: "Pista: a la fila " + r + ", col. " + c + " hi va el número " + st.solution.charAt(bestIdx) + "."
      };
    }
    return null;
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status banner
      var status = document.createElement("div");
      status.className = "status-bar" + (st.completed ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top toolbar: Difficulty & puzzle selector
      var barTop = document.createElement("div");
      barTop.className = "toolbar-row";

      var segLvl = document.createElement("div");
      segLvl.className = "segmented";
      var levels = [
        { id: "facil", label: "Suau" },
        { id: "mitja", label: "Mitjà" },
        { id: "dificil", label: "Repte" }
      ];
      levels.forEach(function (lv) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.level === lv.id ? " active" : "");
        b.textContent = lv.label;
        b.onclick = function () {
          if (st.level !== lv.id) {
            st = createInitialState(lv.id, 0);
            saveState(st);
            redraw();
          }
        };
        segLvl.appendChild(b);
      });
      barTop.appendChild(segLvl);

      var navRight = document.createElement("div");
      navRight.style.display = "flex";
      navRight.style.gap = "4px";
      navRight.style.alignItems = "center";

      var lblNum = document.createElement("span");
      lblNum.style.fontSize = "0.82rem";
      lblNum.style.fontWeight = "bold";
      lblNum.textContent = "#" + (st.index + 1) + "/15";
      navRight.appendChild(lblNum);

      var btnNext = document.createElement("button");
      btnNext.className = "btn-sm";
      btnNext.textContent = "Següent →";
      btnNext.onclick = function () {
        st = createInitialState(st.level, st.index + 1);
        saveState(st);
        redraw();
      };
      navRight.appendChild(btnNext);

      barTop.appendChild(navRight);
      wrap.appendChild(barTop);

      // Sudoku 9x9 Grid
      var boardEl = document.createElement("div");
      boardEl.className = "sudoku-board";
      var selectedVal = st.selected >= 0 ? st.board[st.selected] : "0";

      for (var i = 0; i < 81; i++) {
        (function (cellIdx) {
          var cell = document.createElement("div");
          var r = Math.floor(cellIdx / 9);
          var c = cellIdx % 9;
          var cls = ["sudoku-cell"];
          if (c === 2 || c === 5) cls.push("box-right");
          if (r === 2 || r === 5) cls.push("box-bottom");
          if (c === 8) cls.push("col-last");
          if (r === 8) cls.push("row-last");

          var isGiven = st.given.charAt(cellIdx) !== "0";
          var val = st.board[cellIdx];
          if (isGiven) cls.push("given");
          else if (val !== "0") cls.push("user-val");

          if (st.selected === cellIdx) cls.push("selected");
          if (selectedVal !== "0" && val === selectedVal) cls.push("same-num");
          if (val !== "0" && hasConflict(st.board, cellIdx)) cls.push("conflict");

          cell.className = cls.join(" ");

          if (val !== "0") {
            cell.textContent = val;
          } else if (st.notes[cellIdx] && st.notes[cellIdx].length > 0) {
            var notesGrid = document.createElement("div");
            notesGrid.className = "sudoku-notes";
            for (var n = 1; n <= 9; n++) {
              var sp = document.createElement("span");
              var nStr = String(n);
              sp.textContent = st.notes[cellIdx].indexOf(nStr) !== -1 ? nStr : "";
              notesGrid.appendChild(sp);
            }
            cell.appendChild(notesGrid);
          }

          cell.onclick = function () {
            st.selected = cellIdx;
            saveState(st);
            redraw();
          };
          boardEl.appendChild(cell);
        })(i);
      }
      wrap.appendChild(boardEl);

      // Action bar: Mode switch (Number vs Notes), Erase, Undo, Hint
      var barActions = document.createElement("div");
      barActions.className = "toolbar-row";

      var segMode = document.createElement("div");
      segMode.className = "segmented";

      var btnNumMode = document.createElement("button");
      btnNumMode.className = "btn-sm" + (!st.noteMode ? " active" : "");
      btnNumMode.textContent = "✎ Número";
      btnNumMode.onclick = function () {
        st.noteMode = false;
        saveState(st);
        redraw();
      };

      var btnNoteMode = document.createElement("button");
      btnNoteMode.className = "btn-sm" + (st.noteMode ? " active" : "");
      btnNoteMode.textContent = "☷ Notes";
      btnNoteMode.onclick = function () {
        st.noteMode = true;
        saveState(st);
        redraw();
      };

      segMode.appendChild(btnNumMode);
      segMode.appendChild(btnNoteMode);
      barActions.appendChild(segMode);

      var toolsRight = document.createElement("div");
      toolsRight.style.display = "flex";
      toolsRight.style.gap = "4px";

      var btnErase = document.createElement("button");
      btnErase.className = "btn-sm";
      btnErase.textContent = "⌫";
      btnErase.title = "Esborra casella";
      btnErase.onclick = function () {
        var idx = st.selected;
        if (idx < 0 || st.given.charAt(idx) !== "0" || st.completed) return;
        if (st.board[idx] !== "0" || st.notes[idx].length > 0) {
          pushSnapshot(st);
          st.board[idx] = "0";
          st.notes[idx] = [];
          st.message = "Casella esborrada.";
          saveState(st);
          redraw();
        }
      };

      var btnUndo = document.createElement("button");
      btnUndo.className = "btn-sm";
      btnUndo.textContent = "↶";
      btnUndo.disabled = st.history.length === 0 || st.completed;
      btnUndo.onclick = function () {
        if (st.history.length === 0) return;
        var prev = st.history.pop();
        st.board = prev.board;
        st.notes = prev.notes;
        st.message = "Moviment desfet.";
        saveState(st);
        redraw();
      };

      var btnHint = document.createElement("button");
      btnHint.className = "btn-sm";
      btnHint.textContent = "Pista";
      btnHint.disabled = st.completed;
      btnHint.onclick = function () {
        var h = findLogicalHint(st);
        if (h) {
          st.selected = h.idx;
          st.message = h.msg;
          saveState(st);
          redraw();
        }
      };

      toolsRight.appendChild(btnErase);
      toolsRight.appendChild(btnUndo);
      toolsRight.appendChild(btnHint);
      barActions.appendChild(toolsRight);
      wrap.appendChild(barActions);

      // 1..9 Number pad
      var numpad = document.createElement("div");
      numpad.className = "numpad-row";
      for (var d = 1; d <= 9; d++) {
        (function (digitStr) {
          var b = document.createElement("button");
          // Count how many of this digit are placed
          var count = 0;
          for (var k = 0; k < 81; k++) {
            if (st.board[k] === digitStr) count++;
          }
          b.textContent = digitStr;
          if (count >= 9 && !st.noteMode) {
            b.style.borderStyle = "dotted";
          }
          b.onclick = function () {
            var idx = st.selected;
            if (idx < 0 || st.completed) return;
            if (st.given.charAt(idx) !== "0") {
              st.message = "Aquesta casella és fixa del puzle inicial.";
              redraw();
              return;
            }
            pushSnapshot(st);
            if (st.noteMode) {
              st.board[idx] = "0";
              var arr = st.notes[idx];
              var pos = arr.indexOf(digitStr);
              if (pos === -1) arr.push(digitStr);
              else arr.splice(pos, 1);
              st.message = "Nota " + digitStr + " actualitzada.";
            } else {
              if (st.board[idx] === digitStr) {
                st.board[idx] = "0";
              } else {
                st.board[idx] = digitStr;
                st.notes[idx] = [];
                clearPeerNotes(st.notes, idx, digitStr);
              }
              if (hasConflict(st.board, idx)) {
                st.message = "Atenció: el " + digitStr + " ja es repeteix a la fila, columna o quadrant.";
              } else if (checkVictory(st)) {
                st.completed = true;
                st.message = "Enhorabona! Has completat el Sudoku amb calma i precisió.";
              } else {
                st.message = "Casella actualitzada (" + digitStr + ").";
              }
            }
            saveState(st);
            redraw();
          };
          numpad.appendChild(b);
        })(String(d));
      }
      wrap.appendChild(numpad);

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    var filled = 0;
    for (var i = 0; i < 81; i++) if (st.board[i] !== "0") filled++;
    if (st.completed) return "Completat ✓";
    var mapLvl = { facil: "Suau", mitja: "Mitjà", dificil: "Repte" };
    return (mapLvl[st.level] || "Suau") + " · " + filled + "/81";
  }

  window.CalmGames.sudoku = {
    id: "sudoku",
    title: "Sudoku Calmat",
    desc: "Lògica pura 9×9 amb mode d'anotacions i pistes raonades.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Sudoku Calmat · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Omple la graella de manera que cada fila, columna i quadrant 3×3 contingui els números de l'1 al 9 sense repetir.</li>" +
      "<li>Les xifres fixes inicials tenen una petita <b>ratlla inferior</b>.</li>" +
      "<li>Activa <b>☷ Notes</b> per apuntar candidats petits dins d'una casella.</li>" +
      "<li>El botó <b>Pista</b> t'assenyala quina casella pots deduir lògicament sense desvelar tota la graella.</li>" +
      "</ul>"
  };
})();
