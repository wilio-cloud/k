// Kindle Calm Hub - Shared E-Ink Formatting, Pagination & Crisp Vector SVG Charting (v6)
(function () {
  function fmtEur(n) {
    if (typeof n !== "number" || isNaN(n)) n = 0;
    var sign = n < 0 ? "-" : "";
    var abs = Math.abs(Math.round(n));
    if (abs >= 1000000000) {
      var b = (abs / 1000000000).toFixed(2).replace(".", ",");
      return sign + b + "MM €";
    }
    if (abs >= 1000000) {
      var m = (abs / 1000000).toFixed(abs >= 10000000 ? 1 : 2).replace(".", ",");
      return sign + m + "M €";
    }
    if (abs >= 10000) {
      var k = (abs / 1000).toFixed(abs >= 100000 ? 0 : 1).replace(".", ",");
      return sign + k + "k €";
    }
    return sign + String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";
  }

  function fmtPct(n) {
    if (typeof n !== "number" || isNaN(n)) n = 0;
    var r = Math.round(n);
    return (r >= 0 ? "+" : "") + r + "%";
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function seededRng(seed) {
    var s = Math.abs(Math.floor(seed || 1)) % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

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

  function slicePage(items, page, perPage) {
    var total = items.length;
    var totalPages = Math.max(1, Math.ceil(total / perPage));
    var p = clamp(page || 0, 0, totalPages - 1);
    return {
      page: p,
      totalPages: totalPages,
      total: total,
      items: items.slice(p * perPage, (p + 1) * perPage)
    };
  }

  function renderPager(pageInfo, onPage) {
    var row = document.createElement("div");
    row.className = "pager-row";

    var btnPrev = mkBtn("btn-sm", "◀ Anterior", function () {
      if (pageInfo.page > 0) onPage(pageInfo.page - 1);
    });
    if (pageInfo.page <= 0) btnPrev.disabled = true;

    var info = document.createElement("span");
    info.textContent = "Pàg. " + (pageInfo.page + 1) + "/" + pageInfo.totalPages + " (" + pageInfo.total + ")";

    var btnNext = mkBtn("btn-sm", "Següent ▶", function () {
      if (pageInfo.page + 1 < pageInfo.totalPages) onPage(pageInfo.page + 1);
    });
    if (pageInfo.page + 1 >= pageInfo.totalPages) btnNext.disabled = true;

    row.appendChild(btnPrev);
    row.appendChild(info);
    row.appendChild(btnNext);
    return row;
  }

  // Crisp Monochrome SVG Dual-Line Chart for 300ppi E-Ink
  function buildDualChartSVG(primary, secondary, opts) {
    opts = opts || {};
    var w = opts.width || 480;
    var h = opts.height || 165;
    var padL = 60;
    var padR = 14;
    var padT = 16;
    var padB = 24;
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;

    var allVals = [];
    var i;
    for (i = 0; i < primary.length; i++) {
      if (typeof primary[i] === "number" && !isNaN(primary[i])) allVals.push(primary[i]);
    }
    if (secondary && secondary.length) {
      for (i = 0; i < secondary.length; i++) {
        if (typeof secondary[i] === "number" && !isNaN(secondary[i])) allVals.push(secondary[i]);
      }
    }
    if (allVals.length === 0) allVals = [0, 100];

    var minV = Math.min.apply(null, allVals);
    var maxV = Math.max.apply(null, allVals);
    if (minV > 0) minV = 0;
    if (maxV <= minV) maxV = minV + 1000;

    function xAt(idx, len) {
      if (len <= 1) return padL;
      return padL + (idx / (len - 1)) * plotW;
    }

    function yAt(val) {
      var ratio = (val - minV) / (maxV - minV);
      return padT + plotH - ratio * plotH;
    }

    function poly(arr) {
      var pts = [];
      for (var k = 0; k < arr.length; k++) {
        pts.push(xAt(k, arr.length).toFixed(1) + "," + yAt(arr[k]).toFixed(1));
      }
      return pts.join(" ");
    }

    var midV = (minV + maxV) / 2;
    var yZero = yAt(0);
    var svg = [];
    svg.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + " " + h + '" width="100%" height="' + h + '">');
    svg.push("<style>text{font-family:ui-monospace,Menlo,monospace;font-size:10px;fill:currentColor;}</style>");

    svg.push('<line x1="' + padL + '" y1="' + padT + '" x2="' + (w - padR) + '" y2="' + padT + '" stroke="currentColor" stroke-width="1" stroke-dasharray="2,3"/>');
    svg.push('<line x1="' + padL + '" y1="' + yAt(midV).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yAt(midV).toFixed(1) + '" stroke="currentColor" stroke-width="1" stroke-dasharray="2,4"/>');
    svg.push('<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (w - padR) + '" y2="' + (padT + plotH) + '" stroke="currentColor" stroke-width="1.5"/>');
    svg.push('<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="currentColor" stroke-width="1.5"/>');

    if (minV < 0 && maxV > 0) {
      svg.push('<line x1="' + padL + '" y1="' + yZero.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yZero.toFixed(1) + '" stroke="currentColor" stroke-width="1"/>');
    }

    var fmt = opts.formatter || fmtEur;
    svg.push('<text x="' + (padL - 5) + '" y="' + (padT + 4) + '" text-anchor="end">' + fmt(maxV) + "</text>");
    svg.push('<text x="' + (padL - 5) + '" y="' + (yAt(midV) + 3).toFixed(1) + '" text-anchor="end">' + fmt(midV) + "</text>");
    svg.push('<text x="' + (padL - 5) + '" y="' + (padT + plotH + 3) + '" text-anchor="end">' + fmt(minV) + "</text>");

    if (opts.xStartLabel) {
      svg.push('<text x="' + padL + '" y="' + (h - 6) + '" text-anchor="start">' + opts.xStartLabel + "</text>");
    }
    if (opts.xEndLabel) {
      svg.push('<text x="' + (w - padR) + '" y="' + (h - 6) + '" text-anchor="end">' + opts.xEndLabel + "</text>");
    }

    if (secondary && secondary.length > 1) {
      svg.push('<polyline fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5,4" points="' + poly(secondary) + '"/>');
    }

    if (primary.length > 1) {
      svg.push('<polyline fill="none" stroke="currentColor" stroke-width="2.6" points="' + poly(primary) + '"/>');
    }
    if (primary.length > 0) {
      var lastIdx = primary.length - 1;
      svg.push('<circle cx="' + xAt(lastIdx, primary.length).toFixed(1) + '" cy="' + yAt(primary[lastIdx]).toFixed(1) + '" r="3.6" fill="currentColor"/>');
    }

    svg.push("</svg>");
    return svg.join("");
  }

  window.CalmUI = {
    fmtEur: fmtEur,
    fmtPct: fmtPct,
    clamp: clamp,
    seededRng: seededRng,
    mkBtn: mkBtn,
    slicePage: slicePage,
    renderPager: renderPager,
    buildDualChartSVG: buildDualChartSVG
  };
})();
