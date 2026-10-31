// Kindle Calm Hub - Main Application Shell & Navigation (v3)
(function () {
  var appEl = document.getElementById("app");
  var currentView = window.CalmStorage.get("active_view", "home");
  var inverted = window.CalmStorage.get("inverted_theme", false);

  if (inverted) {
    document.body.classList.add("inverted");
  }

  var MAIN_GRID_GAMES = ["vides", "decennis", "fundador", "minesweeper"];
  var FEATURED_CALM_GAME = "crianca";

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

  function makeCard(gid, extraClass) {
    var g = window.CalmGames[gid];
    if (!g) return null;
    var card = document.createElement("button");
    card.className = "game-card" + (extraClass ? " " + extraClass : "");

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
    return card;
  }

  function renderHome() {
    appEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "home-header";
    header.innerHTML =
      "<h1>Racó Calmat · Kindle E-Ink</h1>" +
      "<p class='home-subtitle'>" + formatCatalanDate() + " · Decisions, inversions i criança sense pantalles brillants</p>";
    appEl.appendChild(header);

    var sections = document.createElement("div");
    sections.className = "home-sections";

    // Block 1: Capital, Empresa & Enginy (2x2)
    var sec1 = document.createElement("div");
    sec1.innerHTML = '<div class="section-heading"><span>CAPITAL, EMPRESA & ENGINY</span><span>SIMULADORS</span></div>';
    var grid = document.createElement("div");
    grid.className = "game-grid-2x2";
    MAIN_GRID_GAMES.forEach(function (gid) {
      var c = makeCard(gid, "");
      if (c) grid.appendChild(c);
    });
    sec1.appendChild(grid);
    sections.appendChild(sec1);

    // Block 2: Espai Criança & Calma (Wide card)
    var sec2 = document.createElement("div");
    sec2.innerHTML = '<div class="section-heading"><span>ESPAI CRIANÇA, IOGA & SERENOR</span><span>FAMÍLIA</span></div>';
    var calmCard = makeCard(FEATURED_CALM_GAME, "wide-card");
    if (calmCard) sec2.appendChild(calmCard);
    sections.appendChild(sec2);

    appEl.appendChild(sections);

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
    btnTips.textContent = "? Ús i descans visual";
    btnTips.onclick = function () {
      showModal(
        "<h2>Com treure'n el màxim profit al Kindle</h2>" +
        "<ul>" +
        "<li><b>Llum frontal baixa (0–4):</b> amb llum càlida d'ambient, la tinta electrònica descansa la vista exactament com un llibre de paper.</li>" +
        "<li><b>Desat automàtic:</b> tant la teva partida d'inversions com el progrés de <i>Créixer amb Calma</i> es desen sols encara que tanquis la funda.</li>" +
        "<li><b>Adreces d'interès:</b> prem (⋮) al navegador del Kindle per desar <b>wilio-cloud.github.io/k</b> a un sol toc.</li>" +
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
    btnHelp.title = "Guia";
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
    if (view !== "home" && (!window.CalmGames || !window.CalmGames[view])) {
      view = "home";
    }
    currentView = view;
    window.CalmStorage.set("active_view", view);
    if (view === "home") renderHome();
    else renderGame(view);
  }

  if ("serviceWorker" in navigator && window.location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    });
  }

  navigateTo(currentView);
})();
