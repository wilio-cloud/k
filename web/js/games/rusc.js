// Joc 3: El Rusc (estil Paraulògic en català per a Kindle E-Ink)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "rusc_state";

  function createState(puzzleIndex) {
    var list = window.KINDLE_DATA.ruscos;
    var idx = ((puzzleIndex || 0) % list.length + list.length) % list.length;
    var p = list[idx];
    return {
      index: idx,
      outer: p.outer.slice(),
      found: [], // array of normalized keys
      current: "",
      score: 0,
      tab: "play", // play | words | hints
      page: 0,
      message: "Forma paraules de 3 o més lletres incloent sempre la central (" + p.center + ")."
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    var list = window.KINDLE_DATA.ruscos;
    if (saved && typeof saved.index === "number" && saved.index >= 0 && saved.index < list.length) {
      return saved;
    }
    return createState(0);
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function getRankName(score, maxScore) {
    if (maxScore <= 0) return "Iniciat";
    var ratio = score / maxScore;
    if (ratio >= 0.75) return "Mestre del Rusc";
    if (ratio >= 0.50) return "Expert";
    if (ratio >= 0.30) return "Notable";
    if (ratio >= 0.15) return "Aplicat";
    if (ratio >= 0.05) return " Desvetllat";
    return "Iniciat";
  }

  function wordPoints(normWord) {
    var len = normWord.length;
    var pts = len === 3 ? 1 : (len === 4 ? 2 : len);
    var uniq = {};
    for (var i = 0; i < len; i++) uniq[normWord.charAt(i)] = true;
    if (Object.keys(uniq).length === 7) pts += 10;
    return pts;
  }

  function isTuti(normWord) {
    var uniq = {};
    for (var i = 0; i < normWord.length; i++) uniq[normWord.charAt(i)] = true;
    return Object.keys(uniq).length === 7;
  }

  function shuffleArray(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function render(container) {
    var st = loadState();

    function getPuzzle() {
      return window.KINDLE_DATA.ruscos[st.index];
    }

    function submitWord() {
      var p = getPuzzle();
      var raw = st.current.toLowerCase();
      st.current = "";

      if (raw.length < 3) {
        st.message = "Massa curta: calen almenys 3 lletres.";
        redraw();
        return;
      }
      if (raw.indexOf(p.center.toLowerCase()) === -1) {
        st.message = "Falta la lletra central obligatòria («" + p.center + "»).";
        redraw();
        return;
      }
      if (!p.words.hasOwnProperty(raw)) {
        st.message = "«" + raw.toUpperCase() + "» no és una paraula admesa en aquest rusc.";
        redraw();
        return;
      }
      if (st.found.indexOf(raw) !== -1) {
        st.message = "Ja havies trobat «" + p.words[raw] + "».";
        redraw();
        return;
      }

      var pts = wordPoints(raw);
      st.found.unshift(raw);
      st.score += pts;
      var disp = p.words[raw];
      if (isTuti(raw)) {
        st.message = "★ TUTI! «" + disp.toUpperCase() + "» (+" + pts + " punts)!";
      } else {
        st.message = "Molt bé: «" + disp + "» (+" + pts + " p.)";
      }
      saveState(st);
      redraw();
    }

    function redraw() {
      container.innerHTML = "";
      var p = getPuzzle();
      var totalWords = Object.keys(p.words).length;
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status banner
      var status = document.createElement("div");
      var lastIsTuti = st.message.indexOf("★ TUTI") === 0;
      status.className = "status-bar" + (lastIsTuti ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top navigation: Rusc selector + View Tabs
      var barTop = document.createElement("div");
      barTop.className = "toolbar-row";

      var segTabs = document.createElement("div");
      segTabs.className = "segmented";
      var tabs = [
        { id: "play", label: "Rusc" },
        { id: "words", label: "Mots (" + st.found.length + "/" + totalWords + ")" },
        { id: "hints", label: "Pistes" }
      ];
      tabs.forEach(function (tb) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.tab === tb.id ? " active" : "");
        b.textContent = tb.label;
        b.onclick = function () {
          st.tab = tb.id;
          st.page = 0;
          saveState(st);
          redraw();
        };
        segTabs.appendChild(b);
      });
      barTop.appendChild(segTabs);

      var btnChange = document.createElement("button");
      btnChange.className = "btn-sm";
      btnChange.textContent = "#" + (st.index + 1) + " →";
      btnChange.onclick = function () {
        st = createState(st.index + 1);
        saveState(st);
        redraw();
      };
      barTop.appendChild(btnChange);
      wrap.appendChild(barTop);

      // Rank & Score strip
      var prog = document.createElement("div");
      prog.className = "rusc-progress";
      var foundTutis = 0;
      for (var i = 0; i < st.found.length; i++) {
        if (isTuti(st.found[i])) foundTutis++;
      }
      prog.innerHTML =
        "<span><b>" + getRankName(st.score, p.maxScore).trim() + "</b> · " + st.score + " p.</span>" +
        "<span>Tutis: <b>" + foundTutis + "/" + p.tutis.length + "</b></span>";
      wrap.appendChild(prog);

      if (st.tab === "play") {
        // Recent words preview strip
        var rec = document.createElement("div");
        rec.className = "rusc-recent";
        if (st.found.length === 0) {
          rec.textContent = "Encara no has anotat cap paraula en aquest rusc.";
        } else {
          var dispArr = [];
          for (var k = 0; k < Math.min(st.found.length, 7); k++) {
            var wKey = st.found[k];
            var wDisp = p.words[wKey];
            dispArr.push(isTuti(wKey) ? "★" + wDisp : wDisp);
          }
          rec.textContent = dispArr.join(" · ") + (st.found.length > 7 ? " …" : "");
        }
        wrap.appendChild(rec);

        // Current typed word box
        var inputBox = document.createElement("div");
        inputBox.className = "rusc-input-box";
        inputBox.textContent = st.current || "·";
        wrap.appendChild(inputBox);

        // 7-Button Honeycomb (2 - 3 - 2)
        var hive = document.createElement("div");
        hive.className = "hive-container";

        function makeHexBtn(letter, isCenter) {
          var b = document.createElement("button");
          b.className = "hive-btn" + (isCenter ? " center-hex" : "");
          b.textContent = letter;
          b.onclick = function () {
            if (st.current.length < 16) {
              st.current += letter;
              saveState(st);
              redraw();
            }
          };
          return b;
        }

        var row1 = document.createElement("div");
        row1.className = "hive-row";
        row1.appendChild(makeHexBtn(st.outer[0], false));
        row1.appendChild(makeHexBtn(st.outer[1], false));

        var row2 = document.createElement("div");
        row2.className = "hive-row";
        row2.appendChild(makeHexBtn(st.outer[2], false));
        row2.appendChild(makeHexBtn(p.center, true));
        row2.appendChild(makeHexBtn(st.outer[3], false));

        var row3 = document.createElement("div");
        row3.className = "hive-row";
        row3.appendChild(makeHexBtn(st.outer[4], false));
        row3.appendChild(makeHexBtn(st.outer[5], false));

        hive.appendChild(row1);
        hive.appendChild(row2);
        hive.appendChild(row3);
        wrap.appendChild(hive);

        // Bottom Controls
        var actions = document.createElement("div");
        actions.className = "toolbar-row";

        var btnDel = document.createElement("button");
        btnDel.className = "btn-lg";
        btnDel.style.flex = "1";
        btnDel.textContent = "⌫ Esborra";
        btnDel.onclick = function () {
          if (st.current.length > 0) {
            st.current = st.current.slice(0, -1);
            saveState(st);
            redraw();
          }
        };

        var btnShuf = document.createElement("button");
        btnShuf.className = "btn-lg";
        btnShuf.textContent = "↻";
        btnShuf.title = "Barreja lletres exteriors";
        btnShuf.onclick = function () {
          st.outer = shuffleArray(st.outer);
          saveState(st);
          redraw();
        };

        var btnEnter = document.createElement("button");
        btnEnter.className = "btn-lg active";
        btnEnter.style.flex = "1.2";
        btnEnter.textContent = "✓ Prova";
        btnEnter.onclick = submitWord;

        actions.appendChild(btnDel);
        actions.appendChild(btnShuf);
        actions.appendChild(btnEnter);
        wrap.appendChild(actions);

      } else if (st.tab === "words") {
        // Paginated list of found words (zero scroll!)
        var sortedFound = st.found.slice().sort();
        var perPage = 24;
        var totalPages = Math.max(1, Math.ceil(sortedFound.length / perPage));
        if (st.page >= totalPages) st.page = totalPages - 1;

        var listBox = document.createElement("div");
        listBox.className = "words-list-grid";

        if (sortedFound.length === 0) {
          listBox.innerHTML = "<div style='grid-column: 1 / -1;'>Encara no has descobert cap paraula.</div>";
        } else {
          var start = st.page * perPage;
          var slice = sortedFound.slice(start, start + perPage);
          slice.forEach(function (k) {
            var item = document.createElement("div");
            var tutiFlag = isTuti(k);
            item.className = "word-item" + (tutiFlag ? " is-tuti" : "");
            item.textContent = (tutiFlag ? "★ " : "") + p.words[k];
            listBox.appendChild(item);
          });
        }
        wrap.appendChild(listBox);

        var pager = document.createElement("div");
        pager.className = "toolbar-row";
        var bPrev = document.createElement("button");
        bPrev.className = "btn-sm";
        bPrev.textContent = "← Anterior";
        bPrev.disabled = st.page <= 0;
        bPrev.onclick = function () { st.page--; redraw(); };

        var pInfo = document.createElement("span");
        pInfo.style.fontSize = "0.85rem";
        pInfo.textContent = "Pàgina " + (st.page + 1) + " / " + totalPages;

        var bNext = document.createElement("button");
        bNext.className = "btn-sm";
        bNext.textContent = "Següent →";
        bNext.disabled = st.page >= totalPages - 1;
        bNext.onclick = function () { st.page++; redraw(); };

        pager.appendChild(bPrev);
        pager.appendChild(pInfo);
        pager.appendChild(bNext);
        wrap.appendChild(pager);

      } else {
        // Hints view: Breakdown by starting 2-letter prefixes & remaining counts
        var hintBox = document.createElement("div");
        hintBox.className = "words-list-grid";
        hintBox.style.gridTemplateColumns = "repeat(3, 1fr)";

        var byPrefix = {};
        var allKeys = Object.keys(p.words);
        allKeys.forEach(function (w) {
          var pref = w.slice(0, 2).toUpperCase();
          if (!byPrefix[pref]) byPrefix[pref] = { total: 0, done: 0 };
          byPrefix[pref].total++;
        });
        st.found.forEach(function (w) {
          var pref = w.slice(0, 2).toUpperCase();
          if (byPrefix[pref]) byPrefix[pref].done++;
        });

        Object.keys(byPrefix).sort().slice(0, 27).forEach(function (pref) {
          var d = byPrefix[pref];
          var el = document.createElement("div");
          var doneAll = d.done === d.total;
          if (doneAll) el.style.textDecoration = "line-through";
          el.innerHTML = "<b>" + pref + "</b>: " + d.done + "/" + d.total;
          hintBox.appendChild(el);
        });
        wrap.appendChild(hintBox);

        var footHint = document.createElement("div");
        footHint.className = "toolbar-row";
        var btnBackPlay = document.createElement("button");
        btnBackPlay.className = "btn-sm active";
        btnBackPlay.style.width = "100%";
        btnBackPlay.textContent = "← Torna al Rusc";
        btnBackPlay.onclick = function () { st.tab = "play"; redraw(); };
        footHint.appendChild(btnBackPlay);
        wrap.appendChild(footHint);
      }

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    var p = window.KINDLE_DATA.ruscos[st.index];
    var tot = Object.keys(p.words).length;
    return "Rusc #" + (st.index + 1) + " · " + st.found.length + "/" + tot;
  }

  window.CalmGames.rusc = {
    id: "rusc",
    title: "El Rusc de Mots",
    desc: "Estil Paraulògic: combina 7 lletres per trobar mots i tutis.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>El Rusc de Mots · Guia E-Ink</h2>" +
      "<ul>" +
      "<li>Forma paraules catalanes d'almenys <b>3 lletres</b> utilitzant només les 7 lletres del rusc (es poden repetir tantes vegades com calgui).</li>" +
      "<li>La <b>lletra central (en negre)</b> és obligatòria a totes les paraules.</li>" +
      "<li>La tecla <b>C</b> serveix també per a <b>Ç</b> (ex. <i>cançó, plaça</i>) i la <b>L</b> per a <b>L·L</b>. Els accents es posen sols en validar!</li>" +
      "<li>Un <b>Tuti (★)</b> és una paraula que fa servir totes 7 lletres (+10 punts extra).</li>" +
      "</ul>"
  };
})();
