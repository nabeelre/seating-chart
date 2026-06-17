(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  var TABLE_RADIUS = 7;

  var data = null;
  var guestsByTable = {};

  // Elements
  var searchView = document.getElementById("search-view");
  var resultView = document.getElementById("result-view");
  var form = document.getElementById("search-form");
  var input = document.getElementById("search-input");
  var resultsEl = document.getElementById("results");
  var emptyMsg = document.getElementById("empty-msg");
  var loadError = document.getElementById("load-error");
  var backBtn = document.getElementById("back-btn");
  var resultName = document.getElementById("result-name");
  var tableNumberEl = document.getElementById("table-number");
  var dietNote = document.getElementById("diet-note");
  var dietLabel = document.getElementById("diet-label");
  var dietDesc = document.getElementById("diet-desc");
  var floorplan = document.getElementById("floorplan");

  // --- Data loading ---
  // Loaded from data.js as a global (works over file:// and GitHub Pages).
  if (window.SEATING_DATA) {
    data = window.SEATING_DATA;
    indexGuests();
  } else {
    loadError.hidden = false;
  }

  function indexGuests() {
    (data.guests || []).forEach(function (g) {
      if (!guestsByTable[g.table]) guestsByTable[g.table] = [];
      guestsByTable[g.table].push(g.name);
    });
  }

  // --- Search ---
  // Normalize: lowercase, strip accents, collapse whitespace.
  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function search(query) {
    var tokens = normalize(query).split(" ").filter(Boolean);
    if (tokens.length === 0) return [];

    var matches = (data.guests || []).filter(function (g) {
      var name = normalize(g.name);
      // Every token must appear somewhere in the name (any order, partial ok).
      return tokens.every(function (t) {
        return name.indexOf(t) !== -1;
      });
    });

    matches.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    return matches;
  }

  function renderResults(matches) {
    resultsEl.innerHTML = "";
    if (matches.length === 0) {
      emptyMsg.hidden = false;
      return;
    }
    emptyMsg.hidden = true;

    matches.forEach(function (g) {
      var li = document.createElement("li");

      var nameSpan = document.createElement("span");
      nameSpan.className = "r-name";
      nameSpan.textContent = g.name;

      var tableSpan = document.createElement("span");
      tableSpan.className = "r-table";
      tableSpan.textContent = "Table " + g.table;

      li.appendChild(nameSpan);
      li.appendChild(tableSpan);
      li.addEventListener("click", function () {
        showResult(g);
      });
      resultsEl.appendChild(li);
    });
  }

  function onSearchInput() {
    if (!data) return;
    var q = input.value;
    if (normalize(q).length === 0) {
      resultsEl.innerHTML = "";
      emptyMsg.hidden = true;
      return;
    }
    renderResults(search(q));
  }

  input.addEventListener("input", onSearchInput);
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    input.blur();
  });

  // --- Result / floorplan ---
  function showResult(guest) {
    resultName.textContent = guest.name;
    tableNumberEl.textContent = guest.table;

    var diet = guest.diet && data.diets ? data.diets[guest.diet] : null;
    if (diet) {
      dietLabel.textContent = diet.label;
      dietDesc.textContent = diet.note || "";
      dietDesc.hidden = !diet.note;
      dietNote.hidden = false;
    } else {
      dietNote.hidden = true;
    }

    drawFloorplan(guest.table);

    searchView.hidden = true;
    resultView.hidden = false;
    window.scrollTo(0, 0);
  }

  backBtn.addEventListener("click", function () {
    resultView.hidden = true;
    searchView.hidden = false;
    input.focus();
  });

  function svgEl(name, attrs) {
    var el = document.createElementNS(SVG_NS, name);
    Object.keys(attrs).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    return el;
  }

  function drawFloorplan(highlightTable) {
    var venue = data.venue || { width: 100, height: 140, features: [] };
    floorplan.innerHTML = "";
    floorplan.setAttribute("viewBox", "0 0 " + venue.width + " " + venue.height);

    // Venue features (rects + labels) drawn underneath tables.
    (venue.features || []).forEach(function (f) {
      if (f.type === "rect") {
        floorplan.appendChild(
          svgEl("rect", {
            x: f.x, y: f.y, width: f.w, height: f.h,
            rx: 2, class: "fp-feature"
          })
        );
      } else if (f.type === "label") {
        var t = svgEl("text", { x: f.x, y: f.y, class: "fp-feature-label" });
        t.textContent = f.text;
        floorplan.appendChild(t);
      }
    });

    // Tables
    (data.tables || []).forEach(function (tbl) {
      var isHi = tbl.number === highlightTable;
      var circle = svgEl("circle", {
        cx: tbl.x, cy: tbl.y, r: TABLE_RADIUS,
        class: "fp-table" + (isHi ? " is-highlight" + " fp-pulse" : "")
      });
      var num = svgEl("text", {
        x: tbl.x, y: tbl.y,
        class: "fp-table-num" + (isHi ? " is-highlight" : "")
      });
      num.textContent = tbl.number;
      floorplan.appendChild(circle);
      floorplan.appendChild(num);
    });
  }
})();
