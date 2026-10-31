// Joc 6: Dossier Forense (Casos detectivescos amb graella lògica croada estil Murdle)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_ACTIVE = "dossier_active";
  var STORAGE_CASE_PREFIX = "dossier_case_";
  var STORAGE_SOLVED = "dossier_solved";

  function getCasesByTier(tier) {
    var all = window.KINDLE_DATA.dossier || [];
    var out = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].tier === tier) out.push(all[i]);
    }
    return out;
  }

  function findCaseById(id) {
    var all = window.KINDLE_DATA.dossier || [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) return all[i];
    }
    return all[0];
  }

  function createCaseState(c) {
    return {
      caseId: c.id,
      tab: "brief", // brief | grid | accuse
      marks: {}, // key "SL_r_c" | "SI_r_c" | "IL_r_c" -> 0 (empty), 1 (manual X), 2 (confirmed ✓)
      checkedClues: {},
      cluePage: 0,
      autoCross: true,
      history: [],
      accuseSuspect: 0,
      accuseLoc: 0,
      accuseItem: 0,
      solved: false,
      message: c.title + " · Llegeix l'expedient i passa a la graella."
    };
  }

  function loadCaseState(caseId) {
    var c = findCaseById(caseId);
    var saved = window.CalmStorage.get(STORAGE_CASE_PREFIX + c.id, null);
    if (saved && saved.caseId === c.id && saved.marks) {
      return saved;
    }
    return createCaseState(c);
  }

  function saveCaseState(st) {
    window.CalmStorage.set(STORAGE_CASE_PREFIX + st.caseId, st);
    window.CalmStorage.set(STORAGE_ACTIVE, st.caseId);
  }

  function cloneObj(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function isAutoCrossed(marks, block, r, col, n) {
    var k;
    for (k = 0; k < n; k++) {
      if (k !== col && marks[block + "_" + r + "_" + k] === 2) return true;
      if (k !== r && marks[block + "_" + k + "_" + col] === 2) return true;
    }
    return false;
  }

  function truthForBlock(c, block, r, col) {
    var sol = c.solution;
    if (block === "SL") {
      return sol.permLoc[r] === col;
    } else if (block === "SI") {
      return sol.permItem[r] === col;
    } else {
      // IL: row = item idx `r`, col = loc idx `col`
      for (var s = 0; s < c.n; s++) {
        if (sol.permItem[s] === r && sol.permLoc[s] === col) return true;
      }
      return false;
    }
  }

  function labelForCell(c, block, r, col) {
    if (block === "SL") {
      return c.suspects[r].name + " ↔ " + c.locations[col].name;
    } else if (block === "SI") {
      return c.suspects[r].name + " ↔ " + c.items[col].name;
    } else {
      return c.items[r].name + " ↔ " + c.locations[col].name;
    }
  }

  function findForensicHint(c, st) {
    var blocks = ["SL", "SI", "IL"];
    var b, r, col, key, mark, isTrue;

    // 1. Detect any user mistake on the grid first
    for (b = 0; b < blocks.length; b++) {
      var blk = blocks[b];
      for (r = 0; r < c.n; r++) {
        for (col = 0; col < c.n; col++) {
          key = blk + "_" + r + "_" + col;
          mark = st.marks[key] || 0;
          isTrue = truthForBlock(c, blk, r, col);
          if (mark === 2 && !isTrue) {
            return "Revisió: la confirmació (✓) a «" + labelForCell(c, blk, r, col) + "» és incorrecta.";
          }
          if (mark === 1 && isTrue) {
            return "Revisió: has descartat (×) per error «" + labelForCell(c, blk, r, col) + "»!";
          }
        }
      }
    }

    // 2. Otherwise reveal one unconfirmed true link in SL or SI
    for (r = 0; r < c.n; r++) {
      var trueL = c.solution.permLoc[r];
      if ((st.marks["SL_" + r + "_" + trueL] || 0) !== 2) {
        return "Pista d'arxiu: fixa't en el vincle entre " + c.suspects[r].short + " i " + c.locations[trueL].short + ".";
      }
      var trueI = c.solution.permItem[r];
      if ((st.marks["SI_" + r + "_" + trueI] || 0) !== 2) {
        return "Pista d'arxiu: fixa't en el vincle entre " + c.suspects[r].short + " i " + c.items[trueI].short + ".";
      }
    }

    return "La graella ja és completa! Ves a la pestanya «Acusar» per resoldre el cas.";
  }

  function render(container) {
    var activeId = window.CalmStorage.get(STORAGE_ACTIVE, 1);
    var st = loadCaseState(activeId);
    var solvedMap = window.CalmStorage.get(STORAGE_SOLVED, {});

    function switchCase(newCaseId) {
      st = loadCaseState(newCaseId);
      saveCaseState(st);
      redraw();
    }

    function redraw() {
      container.innerHTML = "";
      var c = findCaseById(st.caseId);
      var n = c.n;
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status banner
      var status = document.createElement("div");
      status.className = "status-bar" + (st.solved ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top row: Tier selector + Case stepper
      var barTier = document.createElement("div");
      barTier.className = "toolbar-row";

      var segTier = document.createElement("div");
      segTier.className = "segmented";
      var tiers = [
        { id: "iniciacio", label: "3×3" },
        { id: "inspector", label: "4×4" },
        { id: "comissari", label: "Mentider" }
      ];
      tiers.forEach(function (tObj) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (c.tier === tObj.id ? " active" : "");
        b.textContent = tObj.label;
        b.onclick = function () {
          if (c.tier !== tObj.id) {
            var list = getCasesByTier(tObj.id);
            if (list.length > 0) switchCase(list[0].id);
          }
        };
        segTier.appendChild(b);
      });
      barTier.appendChild(segTier);

      // Tab switcher (Expedient | Graella | Acusar)
      var segTabs = document.createElement("div");
      segTabs.className = "segmented";
      var tabs = [
        { id: "brief", label: "Cas" },
        { id: "grid", label: "Graella" },
        { id: "accuse", label: st.solved ? "Resolt ✓" : "Acusar" }
      ];
      tabs.forEach(function (tb) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.tab === tb.id ? " active" : "");
        b.textContent = tb.label;
        b.onclick = function () {
          st.tab = tb.id;
          saveCaseState(st);
          redraw();
        };
        segTabs.appendChild(b);
      });
      barTier.appendChild(segTabs);

      var btnNextCase = document.createElement("button");
      btnNextCase.className = "btn-sm";
      btnNextCase.textContent = "#" + c.id + " →";
      btnNextCase.onclick = function () {
        var all = window.KINDLE_DATA.dossier;
        var nextId = (c.id % all.length) + 1;
        switchCase(nextId);
      };
      barTier.appendChild(btnNextCase);
      wrap.appendChild(barTier);

      // ==================== TAB 1: EXPEDIENT (BRIEFING) ====================
      if (st.tab === "brief") {
        var introBox = document.createElement("div");
        introBox.className = "dossier-intro";
        var htmlIntro = "<b>" + c.title + "</b> (" + c.tierLabel + ")<br>" + c.intro;
        if (c.isLiarMode) {
          htmlIntro += "<div class='dossier-liar-rule'>⚖ REGLA D'INTERROGATORI: Tots els innocents diuen la veritat. L'únic culpable MENTEIX!</div>";
        }
        introBox.innerHTML = htmlIntro;
        wrap.appendChild(introBox);

        var cols = document.createElement("div");
        cols.className = "dossier-cols";

        function makeCol(heading, arr, showBio) {
          var box = document.createElement("div");
          box.className = "dossier-col-box";
          var h3 = document.createElement("h3");
          h3.textContent = heading;
          box.appendChild(h3);

          arr.forEach(function (ent) {
            var item = document.createElement("div");
            item.className = "dossier-entity";
            item.innerHTML =
              "<b>" + ent.short + "</b>: " + ent.name +
              "<br><span class='dossier-entity-trait'>[" + ent.trait + "]</span>" +
              (showBio && ent.bio ? " · " + ent.bio : "");
            box.appendChild(item);
          });
          return box;
        }

        cols.appendChild(makeCol("Sospitosos", c.suspects, n === 3));
        cols.appendChild(makeCol("Escenaris", c.locations, false));
        cols.appendChild(makeCol("Proves", c.items, false));
        wrap.appendChild(cols);

        var footBrief = document.createElement("div");
        footBrief.className = "toolbar-row";
        var btnToGrid = document.createElement("button");
        btnToGrid.className = "btn-lg active";
        btnToGrid.style.width = "100%";
        btnToGrid.textContent = "Obre la Graella i les Pistes →";
        btnToGrid.onclick = function () {
          st.tab = "grid";
          saveCaseState(st);
          redraw();
        };
        footBrief.appendChild(btnToGrid);
        wrap.appendChild(footBrief);

      // ==================== TAB 2: GRAELLA + PISTES ====================
      } else if (st.tab === "grid") {
        var tbl = document.createElement("table");
        tbl.className = "murdle-table m-size-" + n;

        // Top Column Headers: [corner] + Locations (0..n-1) + Items (0..n-1)
        var trHdr = document.createElement("tr");
        var thCorner = document.createElement("th");
        thCorner.className = "m-void";
        trHdr.appendChild(thCorner);

        var colIdx;
        for (colIdx = 0; colIdx < n; colIdx++) {
          (function (lIdx) {
            var th = document.createElement("th");
            var cls = ["m-col-hdr"];
            if (lIdx === 0) cls.push("m-thick-l");
            if (lIdx === n - 1) cls.push("m-thick-r");
            th.className = cls.join(" ");
            th.textContent = c.locations[lIdx].short.slice(0, 5);
            th.onclick = function () {
              st.message = "Escenari: " + c.locations[lIdx].name + " (" + c.locations[lIdx].trait + ").";
              redraw();
            };
            trHdr.appendChild(th);
          })(colIdx);
        }
        for (colIdx = 0; colIdx < n; colIdx++) {
          (function (iIdx) {
            var th = document.createElement("th");
            var cls = ["m-col-hdr"];
            if (iIdx === n - 1) cls.push("m-thick-r");
            th.className = cls.join(" ");
            th.textContent = c.items[iIdx].short.slice(0, 5);
            th.onclick = function () {
              st.message = "Prova: " + c.items[iIdx].name + " (" + c.items[iIdx].trait + ").";
              redraw();
            };
            trHdr.appendChild(th);
          })(colIdx);
        }
        tbl.appendChild(trHdr);

        function buildCell(block, r, col, extraClasses) {
          var td = document.createElement("td");
          var key = block + "_" + r + "_" + col;
          var val = st.marks[key] || 0;
          var autoX = val === 0 && st.autoCross && isAutoCrossed(st.marks, block, r, col, n);

          var cls = ["m-cell"].concat(extraClasses);
          if (val === 2) {
            cls.push("m-yes");
            td.textContent = "✓";
          } else if (val === 1) {
            td.textContent = "×";
          } else if (autoX) {
            cls.push("m-auto");
            td.textContent = "·";
          } else {
            td.textContent = "";
          }
          td.className = cls.join(" ");

          td.onclick = function () {
            if (st.solved) return;
            st.history.push(cloneObj(st.marks));
            if (st.history.length > 35) st.history.shift();

            var nextVal = val === 0 ? 1 : (val === 1 ? 2 : 0);
            if (nextVal === 0) delete st.marks[key];
            else st.marks[key] = nextVal;

            var stateWord = nextVal === 1 ? "Descartat (×)" : (nextVal === 2 ? "Confirmat (✓)" : "Netejat");
            st.message = labelForCell(c, block, r, col) + " → " + stateWord;
            saveCaseState(st);
            redraw();
          };
          return td;
        }

        // Top Rows: Suspects (0..n-1) across Locations (SL) and Items (SI)
        var rIdx;
        for (rIdx = 0; rIdx < n; rIdx++) {
          (function (sIdx) {
            var tr = document.createElement("tr");
            var rTh = document.createElement("th");
            var rThCls = ["m-row-hdr"];
            if (sIdx === 0) rThCls.push("m-thick-t");
            if (sIdx === n - 1) rThCls.push("m-thick-b");
            rTh.className = rThCls.join(" ");
            rTh.textContent = c.suspects[sIdx].short;
            rTh.onclick = function () {
              st.message = c.suspects[sIdx].name + " (" + c.suspects[sIdx].trait + " · " + c.suspects[sIdx].bio + ").";
              redraw();
            };
            tr.appendChild(rTh);

            var k;
            for (k = 0; k < n; k++) {
              var exSL = [];
              if (sIdx === 0) exSL.push("m-thick-t");
              if (sIdx === n - 1) exSL.push("m-thick-b");
              if (k === 0) exSL.push("m-thick-l");
              if (k === n - 1) exSL.push("m-thick-r");
              tr.appendChild(buildCell("SL", sIdx, k, exSL));
            }
            for (k = 0; k < n; k++) {
              var exSI = [];
              if (sIdx === 0) exSI.push("m-thick-t");
              if (sIdx === n - 1) exSI.push("m-thick-b");
              if (k === n - 1) exSI.push("m-thick-r");
              tr.appendChild(buildCell("SI", sIdx, k, exSI));
            }
            tbl.appendChild(tr);
          })(rIdx);
        }

        // Bottom Rows: Items (0..n-1) across Locations (IL) + empty bottom-right quadrant
        for (rIdx = 0; rIdx < n; rIdx++) {
          (function (iIdx) {
            var tr = document.createElement("tr");
            var rTh = document.createElement("th");
            var rThCls = ["m-row-hdr"];
            if (iIdx === n - 1) rThCls.push("m-thick-b");
            rTh.className = rThCls.join(" ");
            rTh.textContent = c.items[iIdx].short;
            rTh.onclick = function () {
              st.message = "Prova: " + c.items[iIdx].name + " (" + c.items[iIdx].trait + ").";
              redraw();
            };
            tr.appendChild(rTh);

            var k;
            for (k = 0; k < n; k++) {
              var exIL = [];
              if (iIdx === n - 1) exIL.push("m-thick-b");
              if (k === 0) exIL.push("m-thick-l");
              if (k === n - 1) exIL.push("m-thick-r");
              tr.appendChild(buildCell("IL", iIdx, k, exIL));
            }
            for (k = 0; k < n; k++) {
              var voidTd = document.createElement("td");
              voidTd.className = "m-void";
              tr.appendChild(voidTd);
            }
            tbl.appendChild(tr);
          })(rIdx);
        }
        wrap.appendChild(tbl);

        // Clues Box (Paginated only if > 7 clues so zero vertical overflow ever occurs!)
        var perPage = n === 4 ? 6 : 7;
        var totalPages = Math.max(1, Math.ceil(c.clues.length / perPage));
        if (st.cluePage >= totalPages) st.cluePage = 0;

        var clueBox = document.createElement("div");
        clueBox.className = "clue-box";
        var startC = st.cluePage * perPage;
        var visibleClues = c.clues.slice(startC, startC + perPage);

        visibleClues.forEach(function (clText, localIdx) {
          var realIdx = startC + localIdx;
          var item = document.createElement("div");
          var done = !!st.checkedClues[realIdx];
          item.className = "clue-item" + (done ? " clue-done" : "");
          item.textContent = (realIdx + 1) + ". " + clText;
          item.onclick = function () {
            st.checkedClues[realIdx] = !st.checkedClues[realIdx];
            saveCaseState(st);
            redraw();
          };
          clueBox.appendChild(item);
        });
        wrap.appendChild(clueBox);

        // Bottom Controls
        var botBar = document.createElement("div");
        botBar.className = "toolbar-row";

        var leftTools = document.createElement("div");
        leftTools.style.display = "flex";
        leftTools.style.gap = "4px";

        var btnAuto = document.createElement("button");
        btnAuto.className = "btn-sm" + (st.autoCross ? " active" : "");
        btnAuto.textContent = "Auto-·";
        btnAuto.onclick = function () {
          st.autoCross = !st.autoCross;
          saveCaseState(st);
          redraw();
        };
        leftTools.appendChild(btnAuto);

        var btnUndo = document.createElement("button");
        btnUndo.className = "btn-sm";
        btnUndo.textContent = "↶";
        btnUndo.disabled = st.history.length === 0 || st.solved;
        btnUndo.onclick = function () {
          if (st.history.length === 0) return;
          st.marks = st.history.pop();
          st.message = "Marca desfeta.";
          saveCaseState(st);
          redraw();
        };
        leftTools.appendChild(btnUndo);

        var btnHint = document.createElement("button");
        btnHint.className = "btn-sm";
        btnHint.textContent = "Pista";
        btnHint.onclick = function () {
          st.message = findForensicHint(c, st);
          redraw();
        };
        leftTools.appendChild(btnHint);

        if (totalPages > 1) {
          var btnMoreClues = document.createElement("button");
          btnMoreClues.className = "btn-sm";
          btnMoreClues.textContent = "Pistes " + (st.cluePage + 1) + "/" + totalPages + " ↻";
          btnMoreClues.onclick = function () {
            st.cluePage = (st.cluePage + 1) % totalPages;
            saveCaseState(st);
            redraw();
          };
          leftTools.appendChild(btnMoreClues);
        }

        botBar.appendChild(leftTools);

        var btnGoAccuse = document.createElement("button");
        btnGoAccuse.className = "btn-sm active";
        btnGoAccuse.textContent = "Acusar →";
        btnGoAccuse.onclick = function () {
          st.tab = "accuse";
          saveCaseState(st);
          redraw();
        };
        botBar.appendChild(btnGoAccuse);
        wrap.appendChild(botBar);

      // ==================== TAB 3: ACUSAR / VEREDICTE ====================
      } else {
        var accWrap = document.createElement("div");
        accWrap.className = "accuse-wrap";

        if (st.solved) {
          var epBox = document.createElement("div");
          epBox.className = "accuse-epilogue";
          var sol = c.solution;
          epBox.innerHTML =
            "<b>★ VEREDICTE CONFIRMAT · " + c.title.toUpperCase() + "</b><br><br>" +
            "• <b>Culpable:</b> " + c.suspects[sol.culprit].name + "<br>" +
            "• <b>Escenari:</b> " + c.locations[sol.loc].name + "<br>" +
            "• <b>Prova del crim:</b> " + c.items[sol.item].name + "<br><br>" +
            c.epilogue;
          accWrap.appendChild(epBox);

          var btnNextSolved = document.createElement("button");
          btnNextSolved.className = "btn-lg active";
          btnNextSolved.style.width = "100%";
          btnNextSolved.textContent = "Obre el Següent Cas →";
          btnNextSolved.onclick = function () {
            var all = window.KINDLE_DATA.dossier;
            switchCase((c.id % all.length) + 1);
          };
          accWrap.appendChild(btnNextSolved);
        } else {
          function makeSelectorGroup(label, list, selectedIdx, onSelect) {
            var grp = document.createElement("div");
            grp.className = "accuse-group";
            var lbl = document.createElement("div");
            lbl.className = "accuse-group-label";
            lbl.textContent = label;
            grp.appendChild(lbl);

            var opts = document.createElement("div");
            opts.className = "accuse-options";
            list.forEach(function (itemObj, idx) {
              var b = document.createElement("button");
              b.className = "btn-sm" + (selectedIdx === idx ? " active" : "");
              b.textContent = itemObj.name;
              b.onclick = function () {
                onSelect(idx);
                saveCaseState(st);
                redraw();
              };
              opts.appendChild(b);
            });
            grp.appendChild(opts);
            return grp;
          }

          accWrap.appendChild(
            makeSelectorGroup("1. Qui ha comès el crim?", c.suspects, st.accuseSuspect, function (i) { st.accuseSuspect = i; })
          );
          accWrap.appendChild(
            makeSelectorGroup("2. A quin escenari?", c.locations, st.accuseLoc, function (i) { st.accuseLoc = i; })
          );
          accWrap.appendChild(
            makeSelectorGroup("3. Amb quina prova o objecte?", c.items, st.accuseItem, function (i) { st.accuseItem = i; })
          );

          var submitBtn = document.createElement("button");
          submitBtn.className = "btn-lg active";
          submitBtn.style.width = "100%";
          submitBtn.textContent = "★ Emetre Acusació Oficial";
          submitBtn.onclick = function () {
            var sol = c.solution;
            var hits = 0;
            if (st.accuseSuspect === sol.culprit) hits++;
            if (st.accuseLoc === sol.loc) hits++;
            if (st.accuseItem === sol.item) hits++;

            if (hits === 3) {
              st.solved = true;
              solvedMap[c.id] = true;
              window.CalmStorage.set(STORAGE_SOLVED, solvedMap);
              st.message = "Cas resolt magistralment!";
            } else {
              st.message = "L'acusació encara no quadra: has encertat " + hits + " de 3 elements. Revisa la graella!";
            }
            saveCaseState(st);
            redraw();
          };
          accWrap.appendChild(submitBtn);
        }

        wrap.appendChild(accWrap);
      }

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var solvedMap = window.CalmStorage.get(STORAGE_SOLVED, {});
    var count = Object.keys(solvedMap).length;
    return count + "/24 casos";
  }

  window.CalmGames.dossier = {
    id: "dossier",
    title: "Dossier Forense",
    desc: "Misteris detectivescos estil Murdle amb graella lògica i interrogatoris.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Dossier Forense · Guia d'Investigació</h2>" +
      "<ul>" +
      "<li>Cada sospitós es trobava en un sol escenari i duia un únic objecte.</li>" +
      "<li>A la <b>Graella</b>: un toc posa <b>×</b> (descartat), dos tocs posa <b>✓</b> (confirmat) i un tercer toc l'esborra.</li>" +
      "<li>Toca qualsevol nom de capçalera per veure'n els trets (<i>esquerrà/dretà, interior/exterior, pesat/lleuger</i>) i toca les pistes de sota per anar-les ratllant!</li>" +
      "<li>Als casos <b>Mentider</b>, tots els innocents diuen la veritat i l'únic culpable diu una mentida.</li>" +
      "</ul>"
  };
})();
