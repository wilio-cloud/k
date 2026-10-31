// Kindle Calm Hub - Main Application Shell & Navigation (v6: Deep Multi-Day Edition)
(function () {
  var APP_VERSION = "v6";
  var appEl = document.getElementById("app");
  var currentView = window.CalmStorage.get("active_view", "home");
  var inverted = window.CalmStorage.get("inverted_theme", false);
  var fontXL = window.CalmStorage.get("font_xl", false);
  var activeHelpHtml = null;

  if (inverted) {
    document.body.classList.add("inverted");
  }
  if (fontXL) {
    document.documentElement.classList.add("font-xl");
  }

  // Proactively purge any stale v1..v5 Cache Storage from older sessions
  if (window.caches && window.caches.keys) {
    window.caches.keys().then(function (keys) {
      keys.forEach(function (k) {
        if (k !== "kindle-calm-hub-v6") {
          window.caches.delete(k);
        }
      });
    }).catch(function () {});
  }

  var MAIN_GRID_GAMES = ["vides", "decennis", "fundador", "minesweeper"];
  var FEATURED_CALM_GAME = "crianca";

  function mkBtn(cls, label, onTap) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = label;
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      onTap();
    });
    return b;
  }

  function formatCatalanDate() {
    var days = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];
    var months = [
      "de gener", "de febrer", "de març", "d'abril", "de maig", "de juny",
      "de juliol", "d'agost", "de setembre", "d'octubre", "de novembre", "de desembre"
    ];
    var now = new Date();
    return days[now.getDay()] + ", " + now.getDate() + " " + months[now.getMonth()];
  }

  function toggleFontXL() {
    fontXL = !fontXL;
    window.CalmStorage.set("font_xl", fontXL);
    if (fontXL) document.documentElement.classList.add("font-xl");
    else document.documentElement.classList.remove("font-xl");
    rerender();
  }

  function openHelp(htmlContent) {
    activeHelpHtml = htmlContent;
    appEl.scrollTop = 0;
    rerender();
  }

  function closeHelp() {
    activeHelpHtml = null;
    appEl.scrollTop = 0;
    rerender();
  }

  function renderHelpSheet() {
    appEl.innerHTML = "";

    var topbar = document.createElement("div");
    topbar.className = "topbar";

    var btnBack = mkBtn("btn-sm", "← Tornar", closeHelp);

    var title = document.createElement("div");
    title.className = "topbar-title";
    title.textContent = "Guia i Ajuda";

    var btnFont = mkBtn("btn-sm" + (fontXL ? " active" : ""), fontXL ? "Aa XL" : "Aa+", toggleFontXL);

    topbar.appendChild(btnBack);
    topbar.appendChild(title);
    topbar.appendChild(btnFont);
    appEl.appendChild(topbar);

    var sheet = document.createElement("div");
    sheet.className = "help-sheet";

    var body = document.createElement("div");
    body.className = "help-sheet-body";
    body.innerHTML = activeHelpHtml;

    var closeBtn = mkBtn("btn-lg active", "Entesos · Tornar al joc", closeHelp);
    closeBtn.style.width = "100%";

    sheet.appendChild(body);
    sheet.appendChild(closeBtn);
    appEl.appendChild(sheet);
  }

  function makeCard(gid, extraClass) {
    var g = window.CalmGames && window.CalmGames[gid];
    if (!g) return null;
    var card = document.createElement("button");
    card.type = "button";
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

    card.addEventListener("click", function () {
      navigateTo(gid);
    });
    return card;
  }

  function renderHome() {
    appEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "home-header";
    header.innerHTML =
      "<h1>Racó Calmat · Kindle E-Ink</h1>" +
      "<p class='home-subtitle'>" + formatCatalanDate() + " · Edició Integral " + APP_VERSION + "</p>";
    appEl.appendChild(header);

    var sections = document.createElement("div");
    sections.className = "home-sections";

    var sec1 = document.createElement("div");
    sec1.innerHTML = '<div class="section-heading"><span>DINASTIA, MERCATS, HOLDING & ENGINY</span><span>LLARG RECORREGUT</span></div>';
    var grid = document.createElement("div");
    grid.className = "game-grid-2x2";
    MAIN_GRID_GAMES.forEach(function (gid) {
      var c = makeCard(gid, "");
      if (c) grid.appendChild(c);
    });
    sec1.appendChild(grid);
    sections.appendChild(sec1);

    var sec2 = document.createElement("div");
    sec2.innerHTML = '<div class="section-heading"><span>CRIANÇA 0–12A, ESTUDI DE IOGA & JOCS</span><span>FAMÍLIA & CALMA</span></div>';
    var calmCard = makeCard(FEATURED_CALM_GAME, "wide-card");
    if (calmCard) sec2.appendChild(calmCard);
    sections.appendChild(sec2);

    appEl.appendChild(sections);

    var footer = document.createElement("div");
    footer.className = "home-footer";

    var btnTheme = mkBtn("btn-sm", inverted ? "◐ Clar" : "◐ Fosc", function () {
      inverted = !inverted;
      window.CalmStorage.set("inverted_theme", inverted);
      if (inverted) document.body.classList.add("inverted");
      else document.body.classList.remove("inverted");
      renderHome();
    });

    var btnFont = mkBtn("btn-sm" + (fontXL ? " active" : ""), fontXL ? "Aa: Extra gran" : "Aa: Més lletra", toggleFontXL);

    var btnTips = mkBtn("btn-sm", "? Guia", function () {
      openHelp(
        "<h2>Edició Integral " + APP_VERSION + " · Pensada per Durar Dies</h2>" +
        "<ul>" +
        "<li><b>Vides & Capital (Dinastia):</b> juga any a any dels 18 als 85 anys comprant immobles concrets, pujant de carrera i continuant com els teus fills a la següent generació.</li>" +
        "<li><b>El Joc dels Decennis (8 Campanyes):</b> supera 8 campanyes de 40 anys (Estagflació, Repte del Jubilat, Aportacions DCA, Hivern Japonès i Mode Mestre sense pistes).</li>" +
        "<li><b>Fundador & Holding:</b> escala sense límit de 16 trimestres i guarda els milions dels teus Exits al teu Holding Personal per fundar o comprar més empreses.</li>" +
        "<li><b>Créixer amb Calma:</b> més de 80 situacions evolutives de 0 a 12 anys, Estudi de Ioga Restauratiu a mida il·lustrat i 32 jocs familiars sense pantalles.</li>" +
        "<li><b>Desat automàtic:</b> tanca la funda del Kindle quan vulguis; tota la teva partida t'espera al mateix punt.</li>" +
        "</ul>"
      );
    });

    footer.appendChild(btnTheme);
    footer.appendChild(btnFont);
    footer.appendChild(btnTips);
    appEl.appendChild(footer);
  }

  function renderGame(gameId) {
    var g = window.CalmGames && window.CalmGames[gameId];
    if (!g) {
      navigateTo("home");
      return;
    }

    appEl.innerHTML = "";

    var topbar = document.createElement("div");
    topbar.className = "topbar";

    var btnHome = mkBtn("btn-sm", "← Inici", function () {
      navigateTo("home");
    });

    var title = document.createElement("div");
    title.className = "topbar-title";
    title.textContent = g.title;

    var actions = document.createElement("div");
    actions.className = "topbar-actions";

    var btnFont = mkBtn("btn-sm" + (fontXL ? " active" : ""), fontXL ? "Aa XL" : "Aa+", toggleFontXL);

    var btnHelp = mkBtn("btn-sm", "? Ajuda", function () {
      openHelp(g.helpHtml || "<p>Sense guia addicional.</p>");
    });

    actions.appendChild(btnFont);
    actions.appendChild(btnHelp);
    topbar.appendChild(btnHome);
    topbar.appendChild(title);
    topbar.appendChild(actions);
    appEl.appendChild(topbar);

    var mount = document.createElement("div");
    mount.style.flex = "1";
    mount.style.display = "flex";
    mount.style.flexDirection = "column";
    appEl.appendChild(mount);

    g.render(mount);
  }

  function rerender() {
    if (activeHelpHtml) {
      renderHelpSheet();
      return;
    }
    if (currentView === "home") renderHome();
    else renderGame(currentView);
  }

  function navigateTo(view) {
    activeHelpHtml = null;
    if (view !== "home" && (!window.CalmGames || !window.CalmGames[view])) {
      view = "home";
    }
    currentView = view;
    window.CalmStorage.set("active_view", view);
    rerender();
  }

  if ("serviceWorker" in navigator && window.location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("./sw.js?v=6").then(function (reg) {
        if (reg && reg.update) reg.update();
      }).catch(function () {});
    });
  }

  navigateTo(currentView);
})();
