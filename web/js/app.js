// Kindle Calm Hub - Main Application Shell & Navigation (v5: Cache-Proof + Larger Touch Help Button)
(function () {
  var APP_VERSION = "v5";
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

  // Proactively purge any stale v1..v4 Cache Storage from older sessions
  if (window.caches && window.caches.keys) {
    window.caches.keys().then(function (keys) {
      keys.forEach(function (k) {
        if (k !== "kindle-calm-hub-v5") {
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
    var g = window.CalmGames[gid];
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
      "<p class='home-subtitle'>" + formatCatalanDate() + " · Edició " + APP_VERSION + "</p>";
    appEl.appendChild(header);

    var sections = document.createElement("div");
    sections.className = "home-sections";

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

    var sec2 = document.createElement("div");
    sec2.innerHTML = '<div class="section-heading"><span>ESPAI CRIANÇA, IOGA & SERENOR</span><span>FAMÍLIA</span></div>';
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
        "<h2>Com treure'n el màxim profit al Kindle (" + APP_VERSION + ")</h2>" +
        "<ul>" +
        "<li><b>Mida de lletra:</b> toca el botó <b>Aa+</b> en qualsevol moment per activar la lletra Extra Gran (XL).</li>" +
        "<li><b>Llum frontal baixa (0–4):</b> amb llum càlida d'ambient, la tinta electrònica descansa la vista com el paper.</li>" +
        "<li><b>Desat automàtic:</b> totes les partides es desen soles encara que tanquis la funda del Kindle.</li>" +
        "</ul>"
      );
    });

    footer.appendChild(btnTheme);
    footer.appendChild(btnFont);
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
      navigator.serviceWorker.register("./sw.js?v=5").then(function (reg) {
        if (reg && reg.update) reg.update();
      }).catch(function () {});
    });
  }

  navigateTo(currentView);
})();
