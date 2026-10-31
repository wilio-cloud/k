// Kindle Calm Hub - Shared E-Ink Formatting & Crisp Vector SVG Charting
(function () {
  function fmtEur(n) {
    var sign = n < 0 ? "-" : "";
    var abs = Math.abs(Math.round(n));
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

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function seededRng(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // Crisp Monochrome SVG Dual-Line Chart for 300ppi E-Ink
  function buildDualChartSVG(primary, secondary, opts) {
    opts = opts || {};
    var w = opts.width || 480;
    var h = opts.height || 165;
    var padL = 56;
    var padR = 14;
    var padT = 16;
    var padB = 24;
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;

    var allVals = [];
    var i;
    for (i = 0; i < primary.length; i++) allVals.push(primary[i]);
    if (secondary && secondary.length) {
      for (i = 0; i < secondary.length; i++) allVals.push(secondary[i]);
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
    svg.push('<style>text{font-family:ui-monospace,Menlo,monospace;font-size:10px;fill:currentColor;}</style>');

    // Horizontal reference lines
    svg.push('<line x1="' + padL + '" y1="' + padT + '" x2="' + (w - padR) + '" y2="' + padT + '" stroke="currentColor" stroke-width="1" stroke-dasharray="2,3"/>');
    svg.push('<line x1="' + padL + '" y1="' + yAt(midV).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yAt(midV).toFixed(1) + '" stroke="currentColor" stroke-width="1" stroke-dasharray="2,4"/>');
    svg.push('<line x1="' + padL + '" y1="' + (padT + plotH) + '" x2="' + (w - padR) + '" y2="' + (padT + plotH) + '" stroke="currentColor" stroke-width="1.5"/>');
    svg.push('<line x1="' + padL + '" y1="' + padT + '" x2="' + padL + '" y2="' + (padT + plotH) + '" stroke="currentColor" stroke-width="1.5"/>');

    if (minV < 0 && maxV > 0) {
      svg.push('<line x1="' + padL + '" y1="' + yZero.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yZero.toFixed(1) + '" stroke="currentColor" stroke-width="1"/>');
    }

    // Y labels
    var fmt = opts.formatter || fmtEur;
    svg.push('<text x="' + (padL - 5) + '" y="' + (padT + 4) + '" text-anchor="end">' + fmt(maxV) + "</text>");
    svg.push('<text x="' + (padL - 5) + '" y="' + (yAt(midV) + 3).toFixed(1) + '" text-anchor="end">' + fmt(midV) + "</text>");
    svg.push('<text x="' + (padL - 5) + '" y="' + (padT + plotH + 3) + '" text-anchor="end">' + fmt(minV) + "</text>");

    // X labels
    if (opts.xStartLabel) {
      svg.push('<text x="' + padL + '" y="' + (h - 6) + '" text-anchor="start">' + opts.xStartLabel + "</text>");
    }
    if (opts.xEndLabel) {
      svg.push('<text x="' + (w - padR) + '" y="' + (h - 6) + '" text-anchor="end">' + opts.xEndLabel + "</text>");
    }

    // Secondary line (dashed)
    if (secondary && secondary.length > 1) {
      svg.push('<polyline fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="5,4" points="' + poly(secondary) + '"/>');
    }

    // Primary line (bold solid + endpoint dot)
    if (primary.length > 1) {
      svg.push('<polyline fill="none" stroke="currentColor" stroke-width="2.8" points="' + poly(primary) + '"/>');
    }
    var lastIdx = primary.length - 1;
    svg.push('<circle cx="' + xAt(lastIdx, primary.length).toFixed(1) + '" cy="' + yAt(primary[lastIdx]).toFixed(1) + '" r="3.8" fill="currentColor"/>');

    svg.push("</svg>");
    return svg.join("");
  }

  window.CalmUI = {
    fmtEur: fmtEur,
    clamp: clamp,
    seededRng: seededRng,
    buildDualChartSVG: buildDualChartSVG
  };
})();
