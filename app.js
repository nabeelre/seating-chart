(function () {
  "use strict";

  // ---- Config (see design handoff: theme cellar|grove, motion refined|delight) ----
  var THEME = "grove";    // 'grove' (airy cream) or 'cellar' (deep teal)
  var MOTION = "delight"; // 'refined' or 'delight'

  var SVG_NS = "http://www.w3.org/2000/svg";

  // ---- Venue geometry, traced to a 792x436 plan (from handoff) ----
  var ROUND_GEO = [
    { n: 16, cx: 138, cy: 80 }, { n: 12, cx: 246, cy: 78 },
    { n: 10, cx: 461, cy: 139 }, { n: 7, cx: 566, cy: 137 }, { n: 4, cx: 666, cy: 140 },
    { n: 8, cx: 508, cy: 206 }, { n: 5, cx: 606, cy: 205 }, { n: 3, cx: 708, cy: 212 },
    { n: 9, cx: 459, cy: 267 }, { n: 6, cx: 558, cy: 274 }, { n: 2, cx: 663, cy: 270 }
  ];
  var RECT_GEO = [
    { n: 15, x: 60, y: 150, w: 30, h: 152 },
    { n: 14, x: 142, y: 150, w: 30, h: 152 },
    { n: 11, x: 248, y: 150, w: 30, h: 152 },
    { n: 13, x: 58, y: 336, w: 110, h: 30 },
    { n: 1, x: 552, y: 336, w: 110, h: 30 }
  ];

  // ---- State ----
  var data = null;
  var guests = [];

  // ---- Elements ----
  var app = document.getElementById("app");
  var landingView = document.getElementById("landing-view");
  var resultView = document.getElementById("result-view");
  var input = document.getElementById("search-input");
  var suggestBox = document.getElementById("suggest-box");
  var firstNameEl = document.getElementById("first-name");
  var tableNumberEl = document.getElementById("table-number");
  var mealNameEl = document.getElementById("meal-name");
  var dietaryPill = document.getElementById("dietary-pill");
  var floorplan = document.getElementById("floorplan");
  var backBtn = document.getElementById("back-btn");
  var loadError = document.getElementById("load-error");

  // Apply theme + motion from config.
  app.className = "app theme-" + THEME;
  app.setAttribute("data-motion", MOTION);

  // ---- Data ----
  if (window.SEATING_DATA && Array.isArray(window.SEATING_DATA.guests)) {
    data = window.SEATING_DATA;
    guests = data.guests;
  } else {
    loadError.hidden = false;
  }

  // ---- Animation re-trigger ----
  function playScreen(el) {
    el.classList.remove("play");
    void el.offsetWidth; // force reflow so animations restart
    el.classList.add("play");
  }

  // ---- Search ----
  function getSuggestions(rawQuery) {
    var q = (rawQuery || "").trim().toLowerCase();
    if (q.length < 1) return [];
    var scored = [];
    for (var i = 0; i < guests.length; i++) {
      var g = guests[i];
      var f = g.first.toLowerCase();
      var l = g.last.toLowerCase();
      var rank = -1;
      if (f.indexOf(q) === 0 || l.indexOf(q) === 0) rank = 0;
      else if (f.indexOf(q) !== -1 || l.indexOf(q) !== -1) rank = 1;
      if (rank >= 0) scored.push({ g: g, rank: rank });
    }
    scored.sort(function (a, b) {
      return a.rank - b.rank || a.g.name.localeCompare(b.g.name);
    });
    return scored.slice(0, 6).map(function (s) { return s.g; });
  }

  function renderSuggestions() {
    var q = input.value;
    var trimmed = q.trim();
    var matches = getSuggestions(q);

    if (trimmed.length >= 1 && matches.length > 0) {
      suggestBox.innerHTML = "";
      matches.forEach(function (g) {
        var row = document.createElement("div");
        row.className = "suggest-row";

        var name = document.createElement("span");
        name.className = "suggest-name";
        name.textContent = g.name;

        var tbl = document.createElement("span");
        tbl.className = "suggest-table";
        tbl.textContent = "Table " + g.table;

        row.appendChild(name);
        row.appendChild(tbl);
        row.addEventListener("click", function () { selectGuest(g); });
        suggestBox.appendChild(row);
      });
      suggestBox.hidden = false;
    } else if (trimmed.length >= 2 && matches.length === 0) {
      suggestBox.innerHTML =
        '<div class="suggest-empty">No match yet — try your last name.</div>';
      suggestBox.hidden = false;
    } else {
      suggestBox.hidden = true;
      suggestBox.innerHTML = "";
    }
  }

  input.addEventListener("input", renderSuggestions);

  // ---- Floorplan SVG ----
  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) {
      if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
    }
    return node;
  }

  function staticStructure(svg) {
    // Outer wall
    svg.appendChild(el("rect", { x: 12, y: 28, width: 768, height: 392, rx: 14, class: "pl-wall" }));

    // Compass
    var north = el("text", { x: 410, y: 46, "text-anchor": "middle", "font-size": 11, "letter-spacing": 5, class: "pl-label", opacity: ".5" });
    north.textContent = "N O R T H";
    svg.appendChild(north);

    // Veranda boundary
    svg.appendChild(el("line", { x1: 300, y1: 40, x2: 300, y2: 322, class: "pl-dash" }));
    svg.appendChild(el("line", { x1: 300, y1: 118, x2: 772, y2: 118, class: "pl-dash" }));
    var ver = el("text", { x: 545, y: 86, "text-anchor": "middle", "font-size": 11, "letter-spacing": 3, class: "pl-label", opacity: ".55" });
    ver.textContent = "VERANDA · OUTDOORS";
    svg.appendChild(ver);
    [[332, 64], [382, 64], [432, 64], [560, 62], [610, 62], [660, 62], [710, 62]].forEach(function (p) {
      svg.appendChild(el("circle", { cx: p[0], cy: p[1], r: 13, class: "pl-veranda" }));
    });

    // Bar
    svg.appendChild(el("rect", { x: 312, y: 150, width: 84, height: 152, rx: 8, class: "pl-soft" }));
    svg.appendChild(el("rect", { x: 323, y: 162, width: 62, height: 98, rx: 4, class: "pl-outline" }));
    var bar = el("text", { x: 354, y: 290, "text-anchor": "middle", "font-size": 12, "letter-spacing": 3, class: "pl-label", opacity: ".6" });
    bar.textContent = "BAR";
    svg.appendChild(bar);

    // Stairs
    var stairs = el("text", { x: 398, y: 330, "text-anchor": "middle", "font-size": 10, "letter-spacing": 2, class: "pl-label", opacity: ".5" });
    stairs.textContent = "STAIRS TO MAIN DINING";
    svg.appendChild(stairs);
    svg.appendChild(el("rect", { x: 300, y: 342, width: 198, height: 46, rx: 4, class: "pl-soft-nostroke" }));
    for (var sx = 318; sx <= 478; sx += 20) {
      svg.appendChild(el("line", { x1: sx, y1: 344, x2: sx, y2: 386, class: "pl-step" }));
    }

    // Estate room
    var estate = el("text", { x: 712, y: 404, "text-anchor": "middle", "font-size": 10, "letter-spacing": 2, class: "pl-label", opacity: ".45" });
    estate.textContent = "ESTATE ROOM";
    svg.appendChild(estate);
  }

  function roundTable(g, active) {
    var grp = el("g", {});
    grp.appendChild(el("circle", { cx: g.cx, cy: g.cy, r: 46, class: "t-spot", opacity: active ? 0.16 : 0 }));
    grp.appendChild(el("circle", {
      cx: g.cx, cy: g.cy, r: 31,
      class: "t-ring" + (active ? " sc-ringPulse" : ""), opacity: active ? 1 : 0
    }));
    grp.appendChild(el("circle", {
      cx: g.cx, cy: g.cy, r: active ? 24 : 19,
      class: "t-shape" + (active ? " is-active sc-activeDot" : "")
    }));
    var num = el("text", {
      x: g.cx, y: g.cy + (active ? 8.5 : 6),
      "font-size": active ? 24 : 17,
      class: "t-num" + (active ? " is-active" : "")
    });
    num.textContent = g.n;
    grp.appendChild(num);
    return grp;
  }

  function rectTable(g, active) {
    var cx = g.x + g.w / 2;
    var cy = g.y + g.h / 2;
    var grp = el("g", {});
    grp.appendChild(el("ellipse", {
      cx: cx, cy: cy, rx: g.w / 2 + 26, ry: g.h / 2 + 22,
      class: "t-spot", opacity: active ? 0.16 : 0
    }));
    grp.appendChild(el("ellipse", {
      cx: cx, cy: cy, rx: g.w / 2 + 10, ry: g.h / 2 + 10,
      class: "t-ring" + (active ? " sc-ringPulse" : ""), opacity: active ? 1 : 0
    }));
    grp.appendChild(el("rect", {
      x: g.x, y: g.y, width: g.w, height: g.h, rx: 7,
      class: "t-shape" + (active ? " is-active sc-activeDot" : "")
    }));
    var num = el("text", {
      x: cx, y: cy + (active ? 8 : 5.5),
      "font-size": active ? 22 : 16,
      class: "t-num" + (active ? " is-active" : "")
    });
    num.textContent = g.n;
    grp.appendChild(num);
    return grp;
  }

  function drawFloorplan(activeTable) {
    var svg = el("svg", { viewBox: "0 0 792 436", width: "100%" });
    staticStructure(svg);
    RECT_GEO.forEach(function (g) { svg.appendChild(rectTable(g, g.n === activeTable)); });
    ROUND_GEO.forEach(function (g) { svg.appendChild(roundTable(g, g.n === activeTable)); });
    floorplan.innerHTML = "";
    floorplan.appendChild(svg);
  }

  // ---- Navigation ----
  function selectGuest(g) {
    firstNameEl.textContent = g.first;
    tableNumberEl.textContent = g.table;
    mealNameEl.textContent = g.meal || "";
    if (g.dietary) {
      dietaryPill.textContent = g.dietary;
      dietaryPill.hidden = false;
    } else {
      dietaryPill.hidden = true;
    }
    drawFloorplan(g.table);

    input.value = "";
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";

    landingView.hidden = true;
    resultView.hidden = false;
    window.scrollTo(0, 0);
    playScreen(resultView);
  }

  function goBack() {
    resultView.hidden = true;
    landingView.hidden = false;
    input.value = "";
    suggestBox.hidden = true;
    suggestBox.innerHTML = "";
    playScreen(landingView);
  }

  backBtn.addEventListener("click", goBack);

  // ---- Init ----
  playScreen(landingView);
})();
