// Kindle Calm Hub - Main Application Shell & Navigation
(function () {
  var appEl = document.getElementById("app");
  var currentView = window.CalmStorage.get("active_view", "home");
  var inverted = window.CalmStorage.get("inverted_theme", false);

  if (inverted) {
    document.body.classList.add("inverted");
  }

  var GAME_ORDER = ["dossier", "sudoku", "motle", "rusc", "nonogram", "minesweeper"];

  function formatCatalanDate() {
    var days = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];
    var months = [
      "de gener", "de febrer", "de març", "d'abril", "de maig", "de juny",
      "de juliol", "d'agost", "de setembre", "d'octubre", "de novembre", "de desembre"
    ];
    var now = new Date();
    return days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()];
  }

  function showModal(htmlContent) {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    var content = document.createElement("div");
    content.className = "modal-content";
    content.innerHTML = htmlContent;

    var closeBtn = document.createElement("button");
    closeBtn.className = "btn-lg active";
    closeBtn.style.width = "100%";
    closeBtn.textContent = "Entesos · Tanca";
    closeBtn.onclick = function () {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };

    overlay.appendChild(content);
    overlay.appendChild(closeBtn);
    document.body.appendChild(overlay);
  }

  function renderHome() {
    appEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "home-header";
    header.innerHTML =
      "<h1>Racó Calmat · E-Ink</h1>" +
      "<p class='home-subtitle'>" + formatCatalanDate() + " · Oci i enginy sense pantalles brillants</p>";
    appEl.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "game-grid";

    GAME_ORDER.forEach(function (gid) {
      var g = window.CalmGames[gid];
      if (!g) return;
      var card = document.createElement("button");
      card.className = "game-card";

      var left = document.createElement("div");
      left.className = "game-card-left";

      var title = document.createElement("div");
      title.className = "game-card-title";
      title.textContent = g.title;

      var desc = document.createElement("div");
      desc.className = "game-card-desc";
      desc.textContent = g.desc;

      left.appendChild(title);
      left.appendChild(desc);

      var badge = document.createElement("div");
      badge.className = "game-card-badge";
      badge.textContent = g.getBadge();

      card.appendChild(left);
      card.appendChild(badge);

      card.onclick = function () {
        navigateTo(gid);
      };
      grid.appendChild(card);
    });
    appEl.appendChild(grid);

    var footer = document.createElement("div");
    footer.className = "home-footer";

    var btnTheme = document.createElement("button");
    btnTheme.className = "btn-sm";
    btnTheme.textContent = inverted ? "◐ Fons clar" : "◐ Fons fosc";
    btnTheme.onclick = function () {
      inverted = !inverted;
      window.CalmStorage.set("inverted_theme", inverted);
      if (inverted) document.body.classList.add("inverted");
      else document.body.classList.remove("inverted");
      renderHome();
    };

    var btnTips = document.createElement("button");
    btnTips.className = "btn-sm";
    btnTips.textContent = "? Descans visual al Kindle";
    btnTips.onclick = function () {
      showModal(
        "<h2>Com descansar els ulls al Kindle</h2>" +
        "<ul>" +
        "<li><b>Llum frontal al mínim o a 0:</b> amb una làmpada càlida d'ambient, baixa la brillantor del Kindle a 0–4 perquè funcioni 100% com el paper imprès.</li>" +
        "<li><b>Desa aquesta pàgina als marcadors:</b> toca els tres punts (⋮) del navegador del Kindle i tria <i>Afegeix aquesta pàgina a les adreces d'interès</i>.</li>" +
        "<li><b>Funciona sense pressa:</b> totes les partides es desen automàticament al dispositiu encara que tanquis la funda del Kindle.</li>" +
        "<li><b>Mode Avió total:</b> per jugar sense obrir el navegador, obre el <i>Quadern d'Enginy</i> des de la teva biblioteca normal de llibres!</li>" +
        "</ul>"
      );
    };

    footer.appendChild(btnTheme);
    footer.appendChild(btnTips);
    appEl.appendChild(footer);
  }

  function renderGame(gameId) {
    var g = window.CalmGames[gameId];
    if (!g) {
      navigateTo("home");
      return;
    }

    appEl.innerHTML = "";

    var topbar = document.createElement("div");
    topbar.className = "topbar";

    var btnHome = document.createElement("button");
    btnHome.className = "btn-sm";
    btnHome.textContent = "← Inici";
    btnHome.onclick = function () {
      navigateTo("home");
    };

    var title = document.createElement("div");
    title.className = "topbar-title";
    title.textContent = g.title;

    var actions = document.createElement("div");
    actions.className = "topbar-actions";

    var btnHelp = document.createElement("button");
    btnHelp.className = "btn-sm";
    btnHelp.textContent = "?";
    btnHelp.title = "Ajuda del joc";
    btnHelp.onclick = function () {
      showModal(g.helpHtml);
    };

    actions.appendChild(btnHelp);
    topbar.appendChild(btnHome);
    topbar.appendChild(title);
    topbar.appendChild(actions);
    appEl.appendChild(topbar);

    var mount = document.createElement("div");
    mount.style.flex = "1";
    mount.style.display = "flex";
    mount.style.flexDirection = "column";
    mount.style.overflow = "hidden";
    appEl.appendChild(mount);

    g.render(mount);
  }

  function navigateTo(view) {
    currentView = view;
    window.CalmStorage.set("active_view", view);
    if (view === "home") renderHome();
    else renderGame(view);
  }

  // Register Service Worker for offline caching on Kindle Chromium (5.16.4+)
  if ("serviceWorker" in navigator && window.location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }

  navigateTo(currentView);
})();
