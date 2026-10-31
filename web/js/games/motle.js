// Joc 2: Motle Català (Wordle de 5 lletres adaptat a E-Ink monocrom sense colors)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_DAILY = "motle_daily";
  var STORAGE_FREE = "motle_free";
  var STORAGE_MODE = "motle_mode";

  var validSet = null;
  function ensureValidSet() {
    if (validSet) return validSet;
    validSet = {};
    var words = window.KINDLE_DATA.motleValid.split(" ");
    for (var i = 0; i < words.length; i++) {
      validSet[words[i]] = true;
    }
    var sols = window.KINDLE_DATA.motleSolutions;
    for (var j = 0; j < sols.length; j++) {
      validSet[sols[j][0]] = true;
    }
    return validSet;
  }

  function getTodaySeed() {
    var d = new Date();
    var y = d.getFullYear();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return y * 10000 + m * 100 + day;
  }

  function createDailyState() {
    var sols = window.KINDLE_DATA.motleSolutions;
    var seed = getTodaySeed();
    var idx = seed % sols.length;
    return {
      seed: seed,
      targetNorm: sols[idx][0],
      targetDisp: sols[idx][1],
      guesses: [],
      current: "",
      status: "playing", // playing | won | lost
      message: "Endevina el mot català de 5 lletres (sense accents al teclat)."
    };
  }

  function createFreeState(prevIdx) {
    var sols = window.KINDLE_DATA.motleSolutions;
    var idx = typeof prevIdx === "number" ? (prevIdx + 7) % sols.length : Math.floor(Math.random() * sols.length);
    return {
      idx: idx,
      targetNorm: sols[idx][0],
      targetDisp: sols[idx][1],
      guesses: [],
      current: "",
      status: "playing",
      message: "Partida lliure: escriu un mot de 5 lletres i prem ENVIAR."
    };
  }

  function evaluateGuess(guess, target) {
    // 2 = exact (black fill), 1 = present elsewhere (dashed circle), 0 = absent (dotted)
    var res = [0, 0, 0, 0, 0];
    var rem = {};
    var i, ch;
    for (i = 0; i < 5; i++) {
      if (guess.charAt(i) === target.charAt(i)) {
        res[i] = 2;
      } else {
        ch = target.charAt(i);
        rem[ch] = (rem[ch] || 0) + 1;
      }
    }
    for (i = 0; i < 5; i++) {
      if (res[i] === 0) {
        ch = guess.charAt(i);
        if (rem[ch] && rem[ch] > 0) {
          res[i] = 1;
          rem[ch]--;
        }
      }
    }
    return res;
  }

  function getActiveState(mode) {
    if (mode === "daily") {
      var saved = window.CalmStorage.get(STORAGE_DAILY, null);
      if (saved && saved.seed === getTodaySeed() && saved.targetNorm) {
        return saved;
      }
      var fresh = createDailyState();
      window.CalmStorage.set(STORAGE_DAILY, fresh);
      return fresh;
    } else {
      var savedFree = window.CalmStorage.get(STORAGE_FREE, null);
      if (savedFree && savedFree.targetNorm) return savedFree;
      var freshFree = createFreeState();
      window.CalmStorage.set(STORAGE_FREE, freshFree);
      return freshFree;
    }
  }

  function saveActiveState(mode, st) {
    window.CalmStorage.set(mode === "daily" ? STORAGE_DAILY : STORAGE_FREE, st);
  }

  function render(container) {
    ensureValidSet();
    var mode = window.CalmStorage.get(STORAGE_MODE, "daily");
    var st = getActiveState(mode);

    function handleKey(key) {
      if (st.status !== "playing") return;

      if (key === "BACK") {
        if (st.current.length > 0) {
          st.current = st.current.slice(0, -1);
          saveActiveState(mode, st);
          redraw();
        }
        return;
      }

      if (key === "ENTER") {
        if (st.current.length < 5) {
          st.message = "Falten lletres: el mot ha de tenir 5 caselles.";
          redraw();
          return;
        }
        if (!validSet[st.current]) {
          st.message = "«" + st.current + "» no consta al diccionari català.";
          redraw();
          return;
        }
        var pattern = evaluateGuess(st.current, st.targetNorm);
        st.guesses.push({ word: st.current, pattern: pattern });
        var won = st.current === st.targetNorm;
        st.current = "";

        if (won) {
          st.status = "won";
          st.message = "Excel·lent! El mot era «" + st.targetDisp.toUpperCase() + "» (" + st.guesses.length + "/6).";
        } else if (st.guesses.length >= 6) {
          st.status = "lost";
          st.message = "Fi dels intents. El mot era «" + st.targetDisp.toUpperCase() + "».";
        } else {
          st.message = "Intent " + st.guesses.length + "/6 registrat.";
        }
        saveActiveState(mode, st);
        redraw();
        return;
      }

      if (st.current.length < 5) {
        st.current += key;
        saveActiveState(mode, st);
        redraw();
      }
    }

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // Status banner
      var status = document.createElement("div");
      status.className = "status-bar" + (st.status !== "playing" ? " solid" : "");
      status.textContent = st.message;
      wrap.appendChild(status);

      // Top mode switch + New Free Game
      var barTop = document.createElement("div");
      barTop.className = "toolbar-row";

      var seg = document.createElement("div");
      seg.className = "segmented";

      var btnDaily = document.createElement("button");
      btnDaily.className = "btn-sm" + (mode === "daily" ? " active" : "");
      btnDaily.textContent = "Mot del dia";
      btnDaily.onclick = function () {
        mode = "daily";
        window.CalmStorage.set(STORAGE_MODE, mode);
        st = getActiveState(mode);
        redraw();
      };

      var btnFree = document.createElement("button");
      btnFree.className = "btn-sm" + (mode === "free" ? " active" : "");
      btnFree.textContent = "Lliure";
      btnFree.onclick = function () {
        mode = "free";
        window.CalmStorage.set(STORAGE_MODE, mode);
        st = getActiveState(mode);
        redraw();
      };

      seg.appendChild(btnDaily);
      seg.appendChild(btnFree);
      barTop.appendChild(seg);

      if (mode === "free") {
        var btnNew = document.createElement("button");
        btnNew.className = "btn-sm";
        btnNew.textContent = "↻ Nou mot";
        btnNew.onclick = function () {
          st = createFreeState(st.idx);
          saveActiveState("free", st);
          redraw();
        };
        barTop.appendChild(btnNew);
      } else {
        var spanInfo = document.createElement("span");
        spanInfo.style.fontSize = "0.78rem";
        spanInfo.textContent = "L·L = LL";
        barTop.appendChild(spanInfo);
      }
      wrap.appendChild(barTop);

      // 6x5 Grid
      var grid = document.createElement("div");
      grid.className = "motle-grid";
      var keyStatus = {}; // track best status per letter

      for (var r = 0; r < 6; r++) {
        var rowEl = document.createElement("div");
        rowEl.className = "motle-row";
        var gObj = r < st.guesses.length ? st.guesses[r] : null;
        var isCurrentRow = r === st.guesses.length && st.status === "playing";

        for (var c = 0; c < 5; c++) {
          var tile = document.createElement("div");
          var cls = ["motle-tile"];
          var ch = "";

          if (gObj) {
            ch = gObj.word.charAt(c);
            var stCode = gObj.pattern[c];
            if (stCode === 2) cls.push("state-exact");
            else if (stCode === 1) cls.push("state-present");
            else cls.push("state-absent");

            if (keyStatus[ch] === undefined || stCode > keyStatus[ch]) {
              keyStatus[ch] = stCode;
            }
          } else if (isCurrentRow && c < st.current.length) {
            ch = st.current.charAt(c);
          } else {
            cls.push("empty");
          }

          tile.className = cls.join(" ");
          tile.textContent = ch;
          rowEl.appendChild(tile);
        }
        grid.appendChild(rowEl);
      }
      wrap.appendChild(grid);

      // Monochrome legend
      var legend = document.createElement("div");
      legend.className = "motle-legend";
      legend.innerHTML =
        "<span><b>■</b> Lloc exacte</span>" +
        "<span><b>◌◦</b> Altre lloc</span>" +
        "<span><s>A</s> No hi és</span>";
      wrap.appendChild(legend);

      // Catalan Touch Keyboard
      var kbWrap = document.createElement("div");
      kbWrap.className = "kb-wrap";
      var rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ç"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"]
      ];

      rows.forEach(function (rKeys) {
        var rEl = document.createElement("div");
        rEl.className = "kb-row";
        rKeys.forEach(function (k) {
          var btn = document.createElement("button");
          var kCls = ["kb-key"];
          if (k === "ENTER" || k === "BACK") kCls.push("kb-wide");
          if (keyStatus[k] === 2) kCls.push("k-exact");
          else if (keyStatus[k] === 1) kCls.push("k-present");
          else if (keyStatus[k] === 0) kCls.push("k-absent");

          btn.className = kCls.join(" ");
          btn.textContent = k === "ENTER" ? "ENVIAR" : (k === "BACK" ? "⌫" : k);
          btn.onclick = function () {
            handleKey(k);
          };
          rEl.appendChild(btn);
        });
        kbWrap.appendChild(rEl);
      });
      wrap.appendChild(kbWrap);

      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = getActiveState("daily");
    if (st.status === "won") return "Avui ✓ (" + st.guesses.length + "/6)";
    if (st.status === "lost") return "Avui completat";
    return "Avui · " + st.guesses.length + "/6";
  }

  window.CalmGames.motle = {
    id: "motle",
    title: "Motle Català",
    desc: "Endevina el mot de 5 lletres amb codificació geomètrica E-Ink.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Motle Català · Guia E-Ink</h2>" +
      "<p> tens 6 intents per descobrir un mot català normatiu de 5 lletres.</p>" +
      "<ul>" +
      "<li><b>Casella negra sòlida (■):</b> la lletra és al lloc exacte.</li>" +
      "<li><b>Cercle discontinu amb ◦:</b> la lletra és al mot però en una altra posició.</li>" +
      "<li><b>Lletra ratllada i vora puntejada:</b> la lletra no apareix al mot.</li>" +
      "<li>No cal posar accents ni dièresis. La <b>Ç</b> té tecla pròpia i la <b>L·L</b> s'escriu amb dues <b>L</b> (ex. CEL·LA → CELLA).</li>" +
      "</ul>"
  };
})();
