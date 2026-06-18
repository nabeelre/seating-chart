(function () {
  "use strict";

  // ---- Config (see design handoff: theme cellar|grove, motion refined|delight) ----
  var THEME = "grove";    // 'grove' (airy cream) or 'cellar' (deep teal)
  var MOTION = "delight"; // 'refined' or 'delight'

  var SVG_NS = "http://www.w3.org/2000/svg";

  // ---- Venue geometry, traced to a 792x436 plan (from handoff) ----
  var ROUND_GEO = [
  {
    "n": 16,
    "cx": 133,
    "cy": 76,
    "r": 29
  },
  {
    "n": 12,
    "cx": 246,
    "cy": 76,
    "r": 29
  },
  {
    "n": 10,
    "cx": 471,
    "cy": 140,
    "r": 29
  },
  {
    "n": 7,
    "cx": 569,
    "cy": 140,
    "r": 29
  },
  {
    "n": 4,
    "cx": 666,
    "cy": 140,
    "r": 29
  },
  {
    "n": 8,
    "cx": 523,
    "cy": 206,
    "r": 29
  },
  {
    "n": 5,
    "cx": 615,
    "cy": 206,
    "r": 29
  },
  {
    "n": 3,
    "cx": 708,
    "cy": 206,
    "r": 29
  },
  {
    "n": 9,
    "cx": 471,
    "cy": 269,
    "r": 29
  },
  {
    "n": 6,
    "cx": 571,
    "cy": 269,
    "r": 29
  },
  {
    "n": 2,
    "cx": 663,
    "cy": 269,
    "r": 29
  },
  {
    "n": 17,
    "cx": 420,
    "cy": 205,
    "r": 19
  }
];

var RECT_GEO = [
  {
    "n": 15,
    "x": 41,
    "y": 124,
    "w": 52,
    "h": 197
  },
  {
    "n": 14,
    "x": 135,
    "y": 148,
    "w": 52,
    "h": 147
  },
  {
    "n": 11,
    "x": 225,
    "y": 126,
    "w": 52,
    "h": 189
  },
  {
    "n": 13,
    "x": 64,
    "y": 346,
    "w": 139,
    "h": 44
  },
  {
    "n": 1,
    "x": 547,
    "y": 320,
    "w": 138,
    "h": 44
  }
];

var STATIC_GEO = [
  {
    "id": "wall",
    "t": "rect",
    "x": 12,
    "y": 28,
    "w": 768,
    "h": 392,
    "rx": 14,
    "cls": "pl-wall"
  },
  {
    "id": "veranda-div-v",
    "t": "line",
    "x1": 300,
    "y1": 40,
    "x2": 300,
    "y2": 322,
    "cls": "pl-dash"
  },
  {
    "id": "veranda-div-h",
    "t": "line",
    "x1": 300,
    "y1": 99,
    "x2": 772,
    "y2": 99,
    "cls": "pl-dash"
  },
  {
    "id": "veranda-label",
    "t": "text",
    "x": 497,
    "y": 48,
    "size": 20,
    "ls": 3,
    "op": 0.85,
    "cls": "pl-label",
    "txt": "VERANDA"
  },
  {
    "id": "v1",
    "t": "circle",
    "cx": 332,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v2",
    "t": "circle",
    "cx": 382,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v3",
    "t": "circle",
    "cx": 432,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v4",
    "t": "circle",
    "cx": 560,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v5",
    "t": "circle",
    "cx": 610,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v6",
    "t": "circle",
    "cx": 660,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "v7",
    "t": "circle",
    "cx": 712,
    "cy": 70,
    "r": 13,
    "cls": "pl-veranda"
  },
  {
    "id": "bar-inner",
    "t": "rect",
    "x": 320,
    "y": 156,
    "w": 63,
    "h": 116,
    "rx": 4,
    "cls": "pl-outline"
  },
  {
    "id": "bar-label",
    "t": "text",
    "x": 353,
    "y": 224,
    "size": 21,
    "ls": 3,
    "op": 0.9,
    "cls": "pl-label",
    "txt": "BAR"
  },
  {
    "id": "stairs-label",
    "t": "text",
    "x": 389,
    "y": 362,
    "size": 18,
    "ls": 2,
    "op": 0.85,
    "cls": "pl-label",
    "txt": "Stairs from ground floor"
  },
  {
    "id": "stairs",
    "t": "rect",
    "x": 291,
    "y": 369,
    "w": 198,
    "h": 46,
    "rx": 4,
    "cls": "pl-soft-nostroke",
    "steps": true
  },
  {
    "id": "estate-label",
    "t": "text",
    "x": 712,
    "y": 386,
    "size": 18,
    "ls": 2,
    "op": 0.85,
    "cls": "pl-label",
    "txt": "→\nRestrooms"
  }
];


  // Pristine copies so the editor's "Reset" can restore the committed layout.
  var DEFAULT_GEO = JSON.parse(JSON.stringify({ round: ROUND_GEO, rect: RECT_GEO, stat: STATIC_GEO }));

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
        bindRowSelect(row, g);
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

  // Select a suggestion. On iOS, tapping a row collapses the keyboard and
  // reflows the page, which moves the row out from under the finger and makes
  // Safari cancel the synthesized "click" — so handle "touchend" directly and
  // suppress the duplicate click, while keeping "click" for desktop/mouse.
  function bindRowSelect(row, g) {
    var moved = false;
    row.addEventListener("touchstart", function () { moved = false; }, { passive: true });
    row.addEventListener("touchmove", function () { moved = true; }, { passive: true });
    row.addEventListener("touchend", function (e) {
      if (moved) return;          // a scroll, not a tap
      e.preventDefault();         // stop the synthesized click that follows
      selectGuest(g);
    });
    row.addEventListener("click", function () { selectGuest(g); });
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

  // Build the SVG node(s) for one STATIC_GEO item.
  function renderStaticItem(item) {
    if (item.t === "rect") {
      return el("rect", { x: item.x, y: item.y, width: item.w, height: item.h, rx: item.rx || 0, class: item.cls });
    }
    if (item.t === "line") {
      return el("line", { x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2, class: item.cls });
    }
    if (item.t === "circle") {
      return el("circle", { cx: item.cx, cy: item.cy, r: item.r, class: item.cls });
    }
    if (item.t === "text") {
      var t = el("text", {
        x: item.x, y: item.y, "text-anchor": "middle",
        "font-size": item.size, "letter-spacing": item.ls,
        class: item.cls, opacity: String(item.op)
      });
      var lines = String(item.txt).split("\n");
      if (lines.length > 1) {
        lines.forEach(function (line, i) {
          var ts = el("tspan", { x: item.x, dy: i === 0 ? 0 : item.size * 1.15 });
          ts.textContent = line;
          t.appendChild(ts);
        });
      } else {
        t.textContent = item.txt;
      }
      return t;
    }
    return null;
  }

  // Stair treads, derived from the parent rect so they follow move/resize.
  function stairTreads(item) {
    var g = el("g", {});
    for (var sx = item.x + 18; sx <= item.x + item.w - 20; sx += 20) {
      g.appendChild(el("line", { x1: sx, y1: item.y + 2, x2: sx, y2: item.y + item.h - 2, class: "pl-step" }));
    }
    return g;
  }

  function staticStructure(svg) {
    STATIC_GEO.forEach(function (item) {
      var node = renderStaticItem(item);
      if (node) svg.appendChild(node);
      if (item.steps) svg.appendChild(stairTreads(item));
    });
  }

  function roundTable(g, active) {
    var r = g.r || 19;            // table radius (editable); ring/spot derive from it
    var grp = el("g", {});
    grp.appendChild(el("circle", { cx: g.cx, cy: g.cy, r: r + 27, class: "t-spot", opacity: active ? 0.16 : 0 }));
    grp.appendChild(el("circle", {
      cx: g.cx, cy: g.cy, r: r + 12,
      class: "t-ring" + (active ? " sc-ringPulse" : ""), opacity: active ? 1 : 0
    }));
    grp.appendChild(el("circle", {
      cx: g.cx, cy: g.cy, r: active ? r + 5 : r,
      class: "t-shape" + (active ? " is-active sc-activeDot" : "")
    }));
    // Bigger numbers on the larger tables; small tables (e.g. table 17, r≈19)
    // keep their original size so the number still fits.
    var big = r >= 24;
    var num = el("text", {
      x: g.cx, y: g.cy + (active ? 8.5 : 6),
      "font-size": big ? (active ? 40 : 30) : (active ? 32 : 23),
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
      x: cx, y: cy + (active ? 9 : 6.5),
      "font-size": active ? 38 : 28,
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

  // =====================================================================
  // EDIT MODE  (open the page with ?edit)
  // Drag to move, drag the gold handle(s) to resize, Delete to remove,
  // double-click a table/label to rename. "Copy code" emits the three GEO
  // arrays to paste back into this file. Drafts autosave to localStorage.
  // =====================================================================
  function initEditor() {
    var LS_KEY = "seatingFloorplanDraft";
    var GRID_W = 792, GRID_H = 436;
    var selected = null;     // the selected geometry object (by reference)
    var selNode = null;      // its rendered svg node (for bbox)
    var selKind = null;      // 'rtable' | 'ttable' | 'static'
    var drag = null;
    var stage, infoEl;

    var round = Math.round;
    function replaceArr(arr, items) { arr.length = 0; items.forEach(function (x) { arr.push(x); }); }
    function persist() {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ round: ROUND_GEO, rect: RECT_GEO, stat: STATIC_GEO }));
      } catch (e) {}
    }
    function loadDraft() {
      try {
        var raw = localStorage.getItem(LS_KEY);
        if (!raw) return;
        var d = JSON.parse(raw);
        if (d.round) replaceArr(ROUND_GEO, d.round);
        if (d.rect) replaceArr(RECT_GEO, d.rect);
        if (d.stat) replaceArr(STATIC_GEO, d.stat);
      } catch (e) {}
    }
    function nextNum() {
      var m = 0;
      ROUND_GEO.concat(RECT_GEO).forEach(function (g) { if (typeof g.n === "number" && g.n > m) m = g.n; });
      return m + 1;
    }
    function removeObj(o) {
      [ROUND_GEO, RECT_GEO, STATIC_GEO].forEach(function (arr) {
        var i = arr.indexOf(o);
        if (i >= 0) arr.splice(i, 1);
      });
    }

    function getSvg() { return stage.querySelector("svg"); }
    function toSvg(evt) {
      var svg = getSvg();
      var pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      var p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: p.x, y: p.y };
    }

    // ---- render ----
    function redraw() {
      var svg = el("svg", { viewBox: "0 0 " + GRID_W + " " + GRID_H, class: "ed-svg" });
      svg.appendChild(el("rect", { x: 0, y: 0, width: GRID_W, height: GRID_H, class: "ed-bg" }));
      selNode = null;

      STATIC_GEO.forEach(function (item, i) {
        var node = renderStaticItem(item);
        if (!node) return;
        if (node.tagName === "line") {
          svg.appendChild(node);
          var hit = el("line", { x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2, class: "ed-hit" });
          hit.setAttribute("data-eid", "static#" + i);
          svg.appendChild(hit);
        } else {
          node.setAttribute("data-eid", "static#" + i);
          node.classList.add("ed-target");
          svg.appendChild(node);
        }
        if (item.steps) { var t = stairTreads(item); t.setAttribute("class", "ed-nohit"); svg.appendChild(t); }
        if (item === selected) { selNode = node; selKind = "static"; }
      });

      RECT_GEO.forEach(function (item, i) {
        var g = el("g", { class: "ed-target ed-table" });
        g.setAttribute("data-eid", "rect#" + i);
        g.appendChild(el("rect", { x: item.x, y: item.y, width: item.w, height: item.h, rx: 7, class: "t-shape" }));
        var num = el("text", { x: item.x + item.w / 2, y: item.y + item.h / 2 + 6, "font-size": 22, "text-anchor": "middle", class: "t-num" });
        num.textContent = item.n;
        g.appendChild(num);
        svg.appendChild(g);
        if (item === selected) { selNode = g; selKind = "ttable"; }
      });

      ROUND_GEO.forEach(function (item, i) {
        var r = item.r || 19;
        var g = el("g", { class: "ed-target ed-table" });
        g.setAttribute("data-eid", "round#" + i);
        g.appendChild(el("circle", { cx: item.cx, cy: item.cy, r: r, class: "t-shape" }));
        var num = el("text", { x: item.cx, y: item.cy + 6, "font-size": 23, "text-anchor": "middle", class: "t-num" });
        num.textContent = item.n;
        g.appendChild(num);
        svg.appendChild(g);
        if (item === selected) { selNode = g; selKind = "rtable"; }
      });

      stage.innerHTML = "";
      stage.appendChild(svg);
      if (selected && selNode) drawHandles(svg);
      updateInfo();
    }

    function drawHandles(svg) {
      var bb;
      try { bb = selNode.getBBox(); } catch (e) { return; }
      var pad = 5;
      svg.appendChild(el("rect", {
        x: bb.x - pad, y: bb.y - pad, width: bb.width + pad * 2, height: bb.height + pad * 2,
        class: "ed-bbox"
      }));
      handlePoints().forEach(function (hp) {
        var s = 11;
        var sq = el("rect", { x: hp.x - s / 2, y: hp.y - s / 2, width: s, height: s, class: "ed-handle" });
        sq.setAttribute("data-handle", hp.h);
        svg.appendChild(sq);
      });
    }

    function handlePoints() {
      var o = selected;
      if (selKind === "rtable" || (selKind === "static" && o.t === "circle")) {
        return [{ h: "r", x: o.cx + (o.r || 19), y: o.cy }];
      }
      if (selKind === "ttable" || (selKind === "static" && o.t === "rect")) {
        return [{ h: "se", x: o.x + o.w, y: o.y + o.h }];
      }
      if (selKind === "static" && o.t === "line") {
        return [{ h: "p1", x: o.x1, y: o.y1 }, { h: "p2", x: o.x2, y: o.y2 }];
      }
      return []; // text: move only
    }

    // ---- interactions ----
    function selectByNode(node) {
      var eid = node.getAttribute("data-eid");
      var parts = eid.split("#");
      var arr = parts[0] === "round" ? ROUND_GEO : parts[0] === "rect" ? RECT_GEO : STATIC_GEO;
      selected = arr[+parts[1]];
    }

    function applyMove(snap, dx, dy) {
      var o = selected, k = selKind;
      if (k === "rtable" || (k === "static" && o.t === "circle")) { o.cx = round(snap.cx + dx); o.cy = round(snap.cy + dy); }
      else if (k === "ttable" || (k === "static" && o.t === "rect")) { o.x = round(snap.x + dx); o.y = round(snap.y + dy); }
      else if (k === "static" && o.t === "line") { o.x1 = round(snap.x1 + dx); o.y1 = round(snap.y1 + dy); o.x2 = round(snap.x2 + dx); o.y2 = round(snap.y2 + dy); }
      else if (k === "static" && o.t === "text") { o.x = round(snap.x + dx); o.y = round(snap.y + dy); }
    }

    function applyResize(handle, p) {
      var o = selected;
      if (handle === "r") { o.r = Math.max(5, round(Math.hypot(p.x - o.cx, p.y - o.cy))); }
      else if (handle === "se") { o.w = Math.max(8, round(p.x - o.x)); o.h = Math.max(8, round(p.y - o.y)); }
      else if (handle === "p1") { o.x1 = round(p.x); o.y1 = round(p.y); }
      else if (handle === "p2") { o.x2 = round(p.x); o.y2 = round(p.y); }
    }

    function onPointerDown(evt) {
      var handle = evt.target.getAttribute && evt.target.getAttribute("data-handle");
      if (handle) {
        evt.preventDefault();
        drag = { mode: "resize", handle: handle };
        return;
      }
      var t = evt.target.closest ? evt.target.closest("[data-eid]") : null;
      if (t) {
        selectByNode(t);
        redraw();
        var p = toSvg(evt);
        drag = { mode: "move", startX: p.x, startY: p.y, snap: JSON.parse(JSON.stringify(selected)) };
        evt.preventDefault();
      } else {
        selected = null;
        redraw();
      }
    }
    function onPointerMove(evt) {
      if (!drag) return;
      var p = toSvg(evt);
      if (drag.mode === "move") applyMove(drag.snap, p.x - drag.startX, p.y - drag.startY);
      else applyResize(drag.handle, p);
      redraw();
    }
    function onPointerUp() {
      if (drag) { drag = null; persist(); }
    }

    function onDblClick(evt) {
      var t = evt.target.closest ? evt.target.closest("[data-eid]") : null;
      if (!t) return;
      selectByNode(t);
      if (selKind === "rtable" || selKind === "ttable" || (selected.t === undefined && selected.n !== undefined)) {
        var nv = prompt("Table number:", selected.n);
        if (nv !== null && nv.trim() !== "") selected.n = isNaN(+nv) ? nv.trim() : +nv;
      } else if (selected.t === "text") {
        var tv = prompt("Label text:", selected.txt);
        if (tv !== null) selected.txt = tv;
      }
      persist();
      redraw();
    }

    function onKeyDown(evt) {
      if (!selected) return;
      if (evt.key === "Delete" || evt.key === "Backspace") {
        evt.preventDefault();
        removeObj(selected); selected = null; persist(); redraw();
      } else if (evt.key.indexOf("Arrow") === 0) {
        evt.preventDefault();
        var step = evt.shiftKey ? 10 : 1;
        var snap = JSON.parse(JSON.stringify(selected));
        var dx = evt.key === "ArrowLeft" ? -step : evt.key === "ArrowRight" ? step : 0;
        var dy = evt.key === "ArrowUp" ? -step : evt.key === "ArrowDown" ? step : 0;
        applyMove(snap, dx, dy); persist(); redraw();
      }
    }

    // ---- toolbar actions ----
    function addRound() { var o = { n: nextNum(), cx: 396, cy: 218, r: 19 }; ROUND_GEO.push(o); selected = o; persist(); redraw(); }
    function addRect() { var o = { n: nextNum(), x: 366, y: 198, w: 70, h: 40 }; RECT_GEO.push(o); selected = o; persist(); redraw(); }
    function addLabel() {
      var txt = prompt("Label text:", "LABEL");
      if (txt === null) return;
      var o = { id: "label-" + Date.now(), t: "text", x: 396, y: 218, size: 14, ls: 2, op: 0.6, cls: "pl-label", txt: txt };
      STATIC_GEO.push(o); selected = o; persist(); redraw();
    }
    function resetAll() {
      if (!confirm("Discard all edits and restore the committed layout?")) return;
      replaceArr(ROUND_GEO, JSON.parse(JSON.stringify(DEFAULT_GEO.round)));
      replaceArr(RECT_GEO, JSON.parse(JSON.stringify(DEFAULT_GEO.rect)));
      replaceArr(STATIC_GEO, JSON.parse(JSON.stringify(DEFAULT_GEO.stat)));
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      selected = null; redraw();
    }
    function copyCode() {
      var code =
        "var ROUND_GEO = " + JSON.stringify(ROUND_GEO, null, 2) + ";\n\n" +
        "var RECT_GEO = " + JSON.stringify(RECT_GEO, null, 2) + ";\n\n" +
        "var STATIC_GEO = " + JSON.stringify(STATIC_GEO, null, 2) + ";\n";
      showCode(code);
      if (navigator.clipboard) navigator.clipboard.writeText(code).catch(function () {});
    }
    function showCode(code) {
      var modal = document.createElement("div");
      modal.className = "ed-modal";
      modal.innerHTML =
        '<div class="ed-modal-box">' +
        '<p>Paste these three arrays into <code>app.js</code> (replacing the existing definitions):</p>' +
        '<textarea spellcheck="false"></textarea>' +
        '<div class="ed-modal-actions"><button class="ed-btn" data-close>Close</button></div>' +
        '</div>';
      modal.querySelector("textarea").value = code;
      modal.querySelector("[data-close]").addEventListener("click", function () { modal.remove(); });
      modal.addEventListener("click", function (e) { if (e.target === modal) modal.remove(); });
      document.body.appendChild(modal);
      var ta = modal.querySelector("textarea");
      ta.focus(); ta.select();
    }

    function updateInfo() {
      if (!infoEl) return;
      if (!selected) { infoEl.textContent = "Nothing selected"; return; }
      var o = selected;
      if (selKind === "rtable") infoEl.textContent = "Round table " + o.n + " — cx " + o.cx + ", cy " + o.cy + ", r " + (o.r || 19);
      else if (selKind === "ttable") infoEl.textContent = "Rect table " + o.n + " — x " + o.x + ", y " + o.y + ", w " + o.w + ", h " + o.h;
      else if (o.t === "text") infoEl.textContent = '"' + o.txt + '" — x ' + o.x + ", y " + o.y + ", size " + o.size;
      else if (o.t === "line") infoEl.textContent = "Line — (" + o.x1 + "," + o.y1 + ") → (" + o.x2 + "," + o.y2 + ")";
      else if (o.t === "rect") infoEl.textContent = (o.id || "Rect") + " — x " + o.x + ", y " + o.y + ", w " + o.w + ", h " + o.h;
      else if (o.t === "circle") infoEl.textContent = (o.id || "Circle") + " — cx " + o.cx + ", cy " + o.cy + ", r " + o.r;
    }

    // ---- build chrome ----
    function build() {
      var view = document.createElement("div");
      view.className = "editor-view theme-grove"; // brings in --plan-* / --t-* tokens

      var bar = document.createElement("div");
      bar.className = "editor-bar";
      bar.innerHTML =
        '<strong class="ed-title">Floorplan editor</strong>' +
        '<button class="ed-btn" id="ed-add-round">+ Round</button>' +
        '<button class="ed-btn" id="ed-add-rect">+ Rect</button>' +
        '<button class="ed-btn" id="ed-add-label">+ Label</button>' +
        '<button class="ed-btn" id="ed-del">Delete</button>' +
        '<button class="ed-btn ed-btn-primary" id="ed-copy">Copy code</button>' +
        '<button class="ed-btn" id="ed-reset">Reset</button>' +
        '<span class="ed-info" id="ed-info">Nothing selected</span>';
      view.appendChild(bar);

      stage = document.createElement("div");
      stage.className = "editor-stage";
      view.appendChild(stage);

      var hint = document.createElement("div");
      hint.className = "editor-hint";
      hint.textContent = "Drag to move · gold handle to resize · double-click to rename · Delete to remove · arrows to nudge";
      view.appendChild(hint);

      document.body.appendChild(view);
      infoEl = bar.querySelector("#ed-info");

      bar.querySelector("#ed-add-round").addEventListener("click", addRound);
      bar.querySelector("#ed-add-rect").addEventListener("click", addRect);
      bar.querySelector("#ed-add-label").addEventListener("click", addLabel);
      bar.querySelector("#ed-del").addEventListener("click", function () { if (selected) { removeObj(selected); selected = null; persist(); redraw(); } });
      bar.querySelector("#ed-copy").addEventListener("click", copyCode);
      bar.querySelector("#ed-reset").addEventListener("click", resetAll);

      stage.addEventListener("pointerdown", onPointerDown);
      stage.addEventListener("dblclick", onDblClick);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("keydown", onKeyDown);
    }

    document.getElementById("app").style.display = "none";
    loadDraft();
    build();
    redraw();
  }

  // ---- Init ----
  if (/[?&]edit\b/.test(location.search)) {
    initEditor();
  } else {
    playScreen(landingView);
  }
})();
