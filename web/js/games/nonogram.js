// Joc 4: Nonogrames (Picross E-Ink amb 24 figures píxel-art en 5x5, 8x8 i 10x10)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "nonogram_state";
  var STORAGE_SOLVED = "nonogram_solved";

  function getPuzzlesBySize(size) {
    var all = window.KINDLE_DATA.nonograms;
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].size === size) out.push(all[i]);
    }
    return out;
  }

  function createState(size, localIdx) {
    var sz = (size === 5 || size === 8 || size === 10) ? size : 5;
    var list = getPuzzlesBySize(sz);
    var idx = ((localIdx || 0) % list.length + list.length) % list.length;
    var p = list[idx];
    var cells = [];
    for (var i = 0; i < sz * sz; i++) cells.push(0); // 0=empty, 1=filled, 2=crossed

    return {
      size: sz,
      localIdx: idx,
      puzzleId: p.id,
      cells: cells,
      tool: 1, // 1=paint (■), 2=cross (×)
      history: [],
      completed: false,
      message: "Pinta les caselles segons els números de cada fila i columna."
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && saved.cells && (saved.size === 5 || saved.size === 8 || saved.size === 10)) {
      return saved;
    }
    return createState(5, 0);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function computeLineRuns(arr) {
    var runs = [];
    var cur = 0;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === 1) {
        cur++;
      } else if (cur > 0) {
        runs.push(cur);
        cur = 0;
      }
    }
    if (cur > 0) runs.push(cur);
    return runs.length > 0 ? runs : [0];
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function checkSolved(st, puzzle) {
    var sz = st.size;
    var r, c;
    for (r = 0; r < sz; r++) {
      var rowArr = [];
      for (c = 0; c < sz; c++) rowArr.push(st.cells[r * sz + c]);
      if (!arraysEqual(computeLineRuns(rowArr), puzzle.rowClues[r])) return false;
    }
    for (c = 0; c < sz; c++) {
      var colArr = [];
      for (r = 0; r < sz; r++) colArr.push(st.cells[r * sz + c]);
      if (!arraysEqual(computeLineRuns(colArr), puzzle.colClues[c])) return false;
    }
    return true;
  }

  function render(container) {
    var st = loadState();
    var solvedMap = window.CalmStorage.get(STORAGE_SOLVED, {});

    function getCurrentPuzzle() {
      var list = getPuzzlesBySize(st.size);
      return list[st.localIdx % list.length];
    }

    function redraw() {
      container.innerHTML = "";
      var p = getCurrentPuzzle();
      var sz = st.size;
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status banner
      var status = document.createElement("div");
      status.className = "status-bar" + (st.completed ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top toolbar: Size selector + Next puzzle
      var barTop = document.createElement("div");
      barTop.className = "toolbar-row";

      var segSize = document.createElement("div");
      segSize.className = "segmented";
      [5, 8, 10].forEach(function (sVal) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.size === sVal ? " active" : "");
        b.textContent = sVal + "×" + sVal;
        b.onclick = function () {
          if (st.size !== sVal) {
            st = createState(sVal, 0);
            saveState(st);
            redraw();
          }
        };
        segSize.appendChild(b);
      });
      barTop.appendChild(segSize);

      var rightNav = document.createElement("div");
      rightNav.style.display = "flex";
      rightNav.style.alignItems = "center";
      rightNav.style.gap = "5px";

      var isKnown = st.completed || solvedMap[p.id];
      var lblTitle = document.createElement("span");
      lblTitle.style.fontSize = "0.82rem";
      lblTitle.style.fontWeight = "bold";
      lblTitle.textContent = "#" + (st.localIdx + 1) + "/8" + (isKnown ? " · " + p.title : "");
      rightNav.appendChild(lblTitle);

      var btnNext = document.createElement("button");
      btnNext.className = "btn-sm";
      btnNext.textContent = "→";
      btnNext.onclick = function () {
        st = createState(st.size, st.localIdx + 1);
        saveState(st);
        redraw();
      };
      rightNav.appendChild(btnNext);
      barTop.appendChild(rightNav);
      wrap.appendChild(barTop);

      // Nonogram Table
      var tbl = document.createElement("table");
      tbl.className = "nono-table nono-size-" + sz;

      // Header row with Column Clues
      var theadTr = document.createElement("tr");
      var corner = document.createElement("th");
      corner.className = "nono-corner";
      theadTr.appendChild(corner);

      for (var c = 0; c < sz; c++) {
        var th = document.createElement("th");
        var colArr = [];
        for (var rr = 0; rr < sz; rr++) colArr.push(st.cells[rr * sz + c]);
        var colDone = arraysEqual(computeLineRuns(colArr), p.colClues[c]);
        th.className = "nono-col-clue" + (colDone ? " nono-clue-done" : "");
        th.innerHTML = p.colClues[c].join("<br>");
        theadTr.appendChild(th);
      }
      tbl.appendChild(theadTr);

      // Grid rows
      for (var r = 0; r < sz; r++) {
        var tr = document.createElement("tr");

        var rowArr = [];
        for (var cc = 0; cc < sz; cc++) rowArr.push(st.cells[r * sz + cc]);
        var rowDone = arraysEqual(computeLineRuns(rowArr), p.rowClues[r]);

        var rTh = document.createElement("th");
        rTh.className = "nono-row-clue" + (rowDone ? " nono-clue-done" : "");
        rTh.textContent = p.rowClues[r].join(" ");
        tr.appendChild(rTh);

        for (var col = 0; col < sz; col++) {
          (function (rowIdx, colIdx) {
            var idx = rowIdx * sz + colIdx;
            var td = document.createElement("td");
            var val = st.cells[idx];
            var cls = ["nono-cell"];
            if (val === 1) cls.push("filled");
            else if (val === 2) cls.push("crossed");

            if (colIdx === 0) cls.push("thick-l");
            if (rowIdx === 0) cls.push("thick-t");
            if (colIdx === sz - 1 || (sz === 10 && colIdx === 4)) cls.push("thick-r");
            if (rowIdx === sz - 1 || (sz === 10 && rowIdx === 4)) cls.push("thick-b");

            td.className = cls.join(" ");
            td.onclick = function () {
              if (st.completed) return;
              st.history.push(st.cells.slice());
              if (st.history.length > 35) st.history.shift();

              if (st.cells[idx] === st.tool) {
                st.cells[idx] = 0;
              } else {
                st.cells[idx] = st.tool;
              }

              if (checkSolved(st, p)) {
                st.completed = true;
                solvedMap[p.id] = true;
                window.CalmStorage.set(STORAGE_SOLVED, solvedMap);
                st.message = "Figura revelada: «" + p.title + "»!";
              } else {
                st.message = "Fila " + (rowIdx + 1) + ", col. " + (colIdx + 1) + ".";
              }
              saveState(st);
              redraw();
            };
            tr.appendChild(td);
          })(r, col);
        }
        tbl.appendChild(tr);
      }
      wrap.appendChild(tbl);

      // Bottom Controls: Tool Switch (Paint vs Cross), Undo, Check
      var barBot = document.createElement("div");
      barBot.className = "toolbar-row";

      var segTool = document.createElement("div");
      segTool.className = "segmented";

      var bPaint = document.createElement("button");
      bPaint.className = "btn-lg" + (st.tool === 1 ? " active" : "");
      bPaint.textContent = "■ Pintar";
      bPaint.onclick = function () {
        st.tool = 1;
        saveState(st);
        redraw();
      };

      var bCross = document.createElement("button");
      bCross.className = "btn-lg" + (st.tool === 2 ? " active" : "");
      bCross.textContent = "× Descartar";
      bCross.onclick = function () {
        st.tool = 2;
        saveState(st);
        redraw();
      };

      segTool.appendChild(bPaint);
      segTool.appendChild(bCross);
      barBot.appendChild(segTool);

      var rightActions = document.createElement("div");
      rightActions.style.display = "flex";
      rightActions.style.gap = "5px";

      var bUndo = document.createElement("button");
      bUndo.className = "btn-sm";
      bUndo.textContent = "↶";
      bUndo.disabled = st.history.length === 0 || st.completed;
      bUndo.onclick = function () {
        if (st.history.length === 0) return;
        st.cells = st.history.pop();
        st.message = "Pas desfet.";
        saveState(st);
        redraw();
      };

      var bCheck = document.createElement("button");
      bCheck.className = "btn-sm";
      bCheck.textContent = "Comprova";
      bCheck.disabled = st.completed;
      bCheck.onclick = function () {
        var errors = 0;
        for (var i = 0; i < sz * sz; i++) {
          if (st.cells[i] === 1 && p.grid.charAt(i) !== "1") errors++;
        }
        if (errors === 0) {
          st.message = "Vas per bon camí: cap casella pintada per error!";
        } else {
          st.message = "Atenció: hi ha " + errors + (errors === 1 ? " casella pintada" : " caselles pintades") + " on no toca.";
        }
        redraw();
      };

      rightActions.appendChild(bUndo);
      rightActions.appendChild(bCheck);
      barBot.appendChild(rightActions);
      wrap.appendChild(barBot);

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var solvedMap = window.CalmStorage.get(STORAGE_SOLVED, {});
    var count = Object.keys(solvedMap).length;
    return count + "/24 figures";
  }

  window.CalmGames.nonogram = {
    id: "nonogram",
    title: "Nonogrames (Picross)",
    desc: "Descobreix dibuixos ocults deduint blocs per files i columnes.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Nonogrames · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Els números indiquen quants quadres negres consecutius hi ha en aquella fila o columna, en aquell mateix ordre.</li>" +
      "<li>Entre dos blocs negres sempre hi ha d'haver <b>com a mínim una casella buida</b>.</li>" +
      "<li>Utilitza <b>× Descartar</b> per marcar les caselles que saps del cert que van en blanc.</li>" +
      "</ul>"
  };
})();
