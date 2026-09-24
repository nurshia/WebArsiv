/* I. Dünya Savaşı — etkileşimli harita (uygulama)
   Akıllı tahta için: dokunmatik hareketler CSS dönüşümüyle çizilir (her karede SVG yeniden
   çizilmez), hareket bitince tek seferde işlenir. Firefox ESR 91+ ile uyumludur. */
(function () {
"use strict";
var G = window.GEO, D = window.D;
var NS = "http://www.w3.org/2000/svg";
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

function el(tag, attrs, parent) {
  var e = document.createElementNS(NS, tag);
  if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
var store = {
  get: function (k, d) { try { var v = localStorage.getItem("ww1." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem("ww1." + k, JSON.stringify(v)); } catch (e) {} }
};
var reduceMotion = false;
function motionOK() { return !reduceMotion && !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches); }

/* ================================================================ izdüşüm */
var P = G.proj, D2R = Math.PI / 180;
function proj(lon, lat) {
  var rho = P.R * P.F / Math.pow(Math.tan(Math.PI / 4 + lat * D2R / 2), P.n);
  var th = P.n * (lon - P.lon0) * D2R;
  return [rho * Math.sin(th) - P.x0, P.y1 - (P.rho0 - rho * Math.cos(th))];
}
function projAll(pts) { return pts.map(function (p) { return proj(p[0], p[1]); }); }
/* haritanın boyutu (km) */
var MW = G.w, MH = G.h;
/* sahne: "main" genel harita, "dt" Çanakkale ayrıntısı (aynı izdüşüm, farklı sınır ve aşamalar) */
var SC = "main", ST = D.ST;
var BND = {x0: 0, y0: 0, x1: MW, y1: MH};

/* ================================================================ aşama verisini hazırla */
var FILL = {}; D.FILL.forEach(function (f) { FILL[f] = 1; });
var OWN = [], SIDE = [];
(function () {
  var cur = {}, k;
  for (k in D.OWN0) cur[k] = D.OWN0[k];
  D.ST.forEach(function (st, i) {
    for (var a in st.own) cur[a] = st.own[a];
    var o = {}; for (k in cur) o[k] = cur[k];
    OWN[i] = o;
    SIDE[i] = st.side || {};
  });
})();
function sideOf(state, i) { return (SIDE[i] && SIDE[i][state]) || "N"; }
function roleOf(state, i) {
  var s = sideOf(state, i);
  if (s.indexOf("-") > 0) return s;
  if (FILL[s + "-" + state]) return s + "-" + state;
  return FILL[s] ? s : "N";
}
function sideLetter(state, i) { return sideOf(state, i).charAt(0); }
function inRange(spec, i) {
  if (spec == null || spec === "*") return true;
  var parts = String(spec).split(",");
  for (var j = 0; j < parts.length; j++) {
    var p = parts[j].split("-");
    var a = +p[0], b = p.length > 1 ? +p[1] : a;
    if (i >= a && i <= b) return true;
  }
  return false;
}

/* ================================================================ durum */
var S = {
  st: 0, mode: "anlatim", tab: "anlatim", ev: null, unit: null, front: null,
  layers: store.get("layers", {events:1, cities:1, fronts:1, arrows:1, zones:1, relief:1, rails:1, rivers:1, grat:1, labels:1}),
  sevr: false, quiz: null, pen: null
};
var stage = $("#stage"), cam = $("#cam");
var svB = $("#svBase"), svO = $("#svOver"), svI = $("#svInk");
var view = {k: 1, tx: 0, ty: 0};
var SW = 800, SH = 600, OS = 160, RF = 1;       /* sahne boyutu, taşma payı, yazı ölçeği */
var insetT = 0;   /* üstte kart varken haritanın üst kenarı kartın altına kadar inebilir */

/* ================================================================ taban haritayı kur */
var defs = el("defs", null, svB);
var HATCH = ["C", "E", "W", "W-GBR", "W-FRA", "W-ITA", "W-GRC"];
var patterns = HATCH.map(function (h) {
  var p = el("pattern", {id: "h-" + h, patternUnits: "userSpaceOnUse", width: 10, height: 10}, defs);
  el("rect", {x: 0, y: 0, width: 2.6, height: 10, style: "fill:var(--h-" + h + ")"}, p);
  return p;
});
var mdot = el("pattern", {id: "h-M", patternUnits: "userSpaceOnUse", width: 9, height: 9}, defs);
el("circle", {cx: 4.5, cy: 4.5, r: 1.2, style: "fill:var(--ink-3)"}, mdot);
patterns.push(mdot);

var bz = el("g", {id: "bz"}, svB);
el("rect", {x: 0, y: 0, width: MW, height: MH, "class": "sea"}, bz);
if (G.bathy) {
  el("path", {d: G.bathy["200"], "class": "bth1"}, bz);
  el("path", {d: G.bathy["1000"], "class": "bth2"}, bz);
  el("path", {d: G.bathy["3000"], "class": "bth3"}, bz);
}
var gWave = el("g", {id: "gWave"}, bz);
el("path", {d: G.waves[0], "class": "wv"}, gWave);
if (G.waves[1]) el("path", {d: G.waves[1], "class": "wv wv2"}, gWave);
var gGrat = el("g", {id: "gGrat"}, bz);
el("path", {d: G.grat.min, "class": "gr"}, gGrat);
el("path", {d: G.grat.maj, "class": "gr maj"}, gGrat);
var gU = el("g", {id: "gU"}, bz), UP = {};
Object.keys(G.units).forEach(function (id) {
  UP[id] = el("path", {d: G.units[id], "class": "u", "data-u": id}, gU);
});
var relief = el("image", {"class": "relief", x: 0, y: 0, width: MW, height: MH, preserveAspectRatio: "none"}, bz);
relief.setAttribute("href", "relief.webp");
var gZ = el("g", {id: "gZ"}, bz);
var gEd = el("g", {id: "gEd"}, bz), EDGES = [];
Object.keys(G.edges).forEach(function (key) {
  var ab = key.split("|");
  EDGES.push({a: ab[0], b: ab[1], el: el("path", {d: G.edges[key], "class": "ed"}, gEd)});
});
el("path", {d: G.coast, "class": "coast"}, bz);
var gRiv = el("g", {id: "gRiv"}, bz);
el("path", {d: G.lakes, "class": "lake"}, gRiv);
if (G.rivers.r1) el("path", {d: G.rivers.r1, "class": "rv rv1"}, gRiv);
if (G.rivers.r2) el("path", {d: G.rivers.r2, "class": "rv rv2"}, gRiv);
var gRail = el("g", {id: "gRail"}, bz);
var gHLb = el("g", {id: "gHLb"}, bz);

/* ================================================================ üst katman */
var oz = el("g", {id: "oz"}, svO);
var gFront = el("g", {id: "gFront"}, oz);
var gArrow = el("g", {id: "gArrow"}, oz);
var gQz = el("g", {id: "gQz"}, oz);
var gLbl = el("g", {id: "gLbl", "class": "lb"}, oz);
var gCity = el("g", {id: "gCity", "class": "ct"}, oz);
var gDL = el("g", {id: "gDL", "class": "lb ct", style: "display:none"}, oz);   /* Çanakkale ayrıntısının adları */
var gMk = el("g", {id: "gMk"}, oz);
var dz = null, gDZ = null, gDM = null, dRel = null, nusretEl = null, DLBL = [];                /* ayrıntı tabanı (ilk açılışta kurulur) */
var iz = el("g", {id: "iz"}, svI);

/* sayaç ölçekli öğeler: yakınlaştırmada ekrandaki boyutu sabit kalır */
var CS = [];   /* {el, x, y, r, pri, bb, kind} */
function cs(g, x, y, rot, pri, kind) {
  var o = {el: g, x: x, y: y, r: rot || 0, pri: pri || 0, bb: null, kind: kind || "", scene: SC};
  CS.push(o); g._cs = o; return o;
}
function placeCS(o, s) {
  o.el.setAttribute("transform", "translate(" + o.x.toFixed(1) + " " + o.y.toFixed(1) + ") scale(" + s.toFixed(5) + ")" +
    (o.r ? " rotate(" + o.r + ")" : ""));
}

/* --- etiketler --- */
function mkLabel(L, parent) {   /* [ad, boylam, enlem, sınıf, aşamalar, ayrıntı düzeyi, dönüş] */
  var xy = proj(L[1], L[2]);
  var cls = L[3], lod = L[5] || 0;
  var g = el("g", {"class": "lbl" + (lod ? " lod" + lod : "")}, parent);
  var t = el("text", {"class": "t-" + cls, "text-anchor": "middle"}, g);
  var lines = L[0].split("|");
  var lh = cls === "s1" ? 24 : cls === "s2" ? 19 : cls === "sea" ? 19 : 16;
  lines.forEach(function (ln, i) {
    var sp = el("tspan", {x: 0, dy: i ? lh : (-(lines.length - 1) * lh / 2 + lh * .34)}, t);
    sp.textContent = (cls === "col" || cls === "rv") ? ln : ln;
  });
  var pri = {s1: 90, s2: 80, sea: 75, s3: 60, rg: 45, mt: 30, ds: 28, col: 35, sea2: 40, rv: 20}[cls] || 10;
  var o = cs(g, xy[0], xy[1], L[6] || 0, pri, "lb");
  o.st = L[4]; o.lod = lod;
  return o;
}
var LBL = D.LB.map(function (L) { return mkLabel(L, gLbl); });
/* --- şehirler --- */
function mkCity(C, parent) {   /* [ad, boylam, enlem, ayrıntı, başkent, aşamalar] */
  var xy = proj(C[1], C[2]);
  var cap = C[4], lod = C[3];
  var g = el("g", {"class": "city" + (lod ? " lod" + lod : "")}, parent);
  if (cap) el("rect", {x: -4, y: -4, width: 8, height: 8, transform: "rotate(45)"}, g);
  else el("circle", {r: 3}, g);
  var t = el("text", {"class": "t-ct" + (cap ? " cap" : ""), x: 7, y: -6}, g);
  t.textContent = C[0];
  var o = cs(g, xy[0], xy[1], 0, cap ? 70 : 50 - lod * 5, "ct");
  o.st = C[5]; o.lod = lod;
  return o;
}
var CITY = D.CT.map(function (C) { return mkCity(C, gCity); });

/* ================================================================ çizgi geometrisi */
function catmull(pts, seg) {
  if (pts.length < 3) return pts.slice();
  var out = [pts[0]];
  for (var i = 0; i < pts.length - 1; i++) {
    var p0 = pts[i ? i - 1 : 0], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    for (var j = 1; j <= seg; j++) {
      var t = j / seg, t2 = t * t, t3 = t2 * t;
      out.push([
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
      ]);
    }
  }
  return out;
}
function dPath(pts) {
  var s = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (var i = 1; i < pts.length; i++) s += "L" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
  return s;
}
function partsOf(L) { return L.parts ? L.parts : [L.p]; }
/* sivrilen ok: kuyruk ince, baş geniş (w: tasarım pikseli, s: harita birimi/piksel) */
function arrowPath(ptsLL, s, wmul) {
  var pts = catmull(projAll(ptsLL), 10);
  var n = pts.length, cum = [0];
  for (var i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  var L = cum[n - 1];
  if (L <= 0) return "";
  var w = (wmul || 1) * s, headL = Math.min(L * .45, 24 * w);
  var f = Math.max(.5, headL / (24 * w)), headW = 15 * w * f, body0 = 3 * w * f, body1 = 6.4 * w * f;
  var stop = L - headL, left = [], right = [], neck = null, nd = null;
  for (i = 0; i < n; i++) {
    var d = cum[i];
    if (d > stop) break;
    var a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    var dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    var nx = -dy / m, ny = dx / m, t = d / Math.max(stop, 1e-6), hw = body0 + (body1 - body0) * Math.pow(t, .8);
    left.push([pts[i][0] + nx * hw, pts[i][1] + ny * hw]);
    right.push([pts[i][0] - nx * hw, pts[i][1] - ny * hw]);
    neck = pts[i]; nd = [dx / m, dy / m];
  }
  if (!neck) { neck = pts[0]; nd = [1, 0]; }
  var tip = pts[n - 1];
  var ux = tip[0] - neck[0], uy = tip[1] - neck[1], um = Math.hypot(ux, uy) || 1;
  ux /= um; uy /= um;
  var px = -uy, py = ux;
  var poly = left.concat([[neck[0] + px * headW, neck[1] + py * headW], tip, [neck[0] - px * headW, neck[1] - py * headW]])
    .concat(right.reverse());
  return dPath(poly) + "Z";
}
function headPath(ptsLL, s) {   /* deniz yolu ucu */
  var pts = catmull(projAll(ptsLL), 8), n = pts.length;
  var tip = pts[n - 1], prev = pts[Math.max(0, n - 3)];
  var ux = tip[0] - prev[0], uy = tip[1] - prev[1], m = Math.hypot(ux, uy) || 1;
  ux /= m; uy /= m;
  var L = 16 * s, W = 8 * s, bx = tip[0] - ux * L, by = tip[1] - uy * L;
  return dPath([[bx - uy * W, by + ux * W], tip, [bx + uy * W, by - ux * W]]) + "Z";
}

/* ================================================================ kamera */
function stageSize() {
  var r = stage.getBoundingClientRect();
  SW = Math.max(1, r.width); SH = Math.max(1, r.height);
}
function kMin() { return Math.max(SW / (BND.x1 - BND.x0), SH / (BND.y1 - BND.y0)); }
function kMax() { return kMin() * (SC === "dt" ? 8 : 15); }
function clampView(v) {
  /* ölçek sınıra takılırsa sahnenin ortasındaki nokta yerinde kalsın */
  var k = clamp(v.k, kMin(), kMax()), tx = v.tx, ty = v.ty;
  if (k !== v.k) {
    var cx = (SW / 2 - v.tx) / v.k, cy = (SH / 2 - v.ty) / v.k;
    tx = SW / 2 - k * cx; ty = SH / 2 - k * cy;
  }
  tx = clamp(tx, SW - BND.x1 * k, -BND.x0 * k); ty = clamp(ty, SH - BND.y1 * k, -BND.y0 * k + insetT);
  return {k: k, tx: tx, ty: ty};
}
function layoutSV() {
  stageSize();
  RF = parseFloat(getComputedStyle(document.documentElement).fontSize) / 20 || 1;
  OS = Math.round(Math.min(200, Math.max(80, Math.max(SW, SH) * .1)));   /* taşma payı: kaydırırken kenar boş kalmasın, ama her çizimde fazla piksel de olmasın */
  [svB, svO, svI].forEach(function (sv) {
    sv.setAttribute("width", Math.ceil(SW + 2 * OS));
    sv.setAttribute("height", Math.ceil(SH + 2 * OS));
    sv.style.left = -OS + "px"; sv.style.top = -OS + "px";
  });
}
var lastK = -1;
function commit(v) {
  view = clampView(v);
  cam.style.transition = "";
  cam.style.transform = "";
  cam.style.opacity = "";
  var T = "translate(" + (view.tx + OS).toFixed(2) + " " + (view.ty + OS).toFixed(2) + ") scale(" + view.k.toFixed(6) + ")";
  bz.setAttribute("transform", T); oz.setAttribute("transform", T); iz.setAttribute("transform", T);
  if (dz) dz.setAttribute("transform", T);
  if (Math.abs(view.k - lastK) > 1e-9) {
    lastK = view.k;
    var s = RF / view.k;
    for (var i = 0; i < CS.length; i++) placeCS(CS[i], s);
    patterns.forEach(function (p) { p.setAttribute("patternTransform", "rotate(45) scale(" + s.toFixed(4) + ")"); });
    var rel = view.k / kMin();
    svO.setAttribute("class", "sv over " + (rel < 1.55 ? "z0" : rel < 2.9 ? "z1" : "z2"));
    svB.setAttribute("class", SC === "main" && rel >= 5 ? "sv z3" : "sv");
    drawArrows();
    drawPen(true);
    scaleBar();
    if (nusretEl) nusretEl.style.strokeDasharray = "0 " + (nusretEl._len * view.k / 25).toFixed(2) + "px";
    cluster();
  }
  collide();
}
function relTransform(v2) {   /* işlenmiş görünümden v2'ye CSS dönüşümü */
  var s = v2.k / view.k;
  return "translate(" + (v2.tx - s * view.tx).toFixed(2) + "px," + (v2.ty - s * view.ty).toFixed(2) + "px) scale(" + s.toFixed(5) + ")";
}
var flyTimer = 0, flyEnd = null;
function finishFly() { if (flyEnd) { var f = flyEnd; flyEnd = null; clearTimeout(flyTimer); f(); } }
function flyTo(v2, ms) {
  v2 = clampView(v2);
  finishFly();
  if (ms === 0 || !motionOK()) { commit(v2); return; }
  ms = ms || 700;
  var s = v2.k / view.k, dx = v2.tx - s * view.tx, dy = v2.ty - s * view.ty;
  /* hedef görünüm eski çizimin (sahne + taşma payı) içinde mi? */
  var x0 = -dx / s, y0 = -dy / s, x1 = (SW - dx) / s, y1 = (SH - dy) / s;
  var inside = x0 >= -OS && y0 >= -OS && x1 <= SW + OS && y1 <= SH + OS;
  if (s < 0.98 || !inside) {
    /* uzaklaşma ya da uzak hedef: yeni görünümü çiz, eskisinin yerinden oraya kay */
    var old = view;
    commit(v2);
    var inv = old.k / view.k;
    cam.style.transition = "none";
    cam.style.transform = "translate(" + (old.tx - inv * view.tx).toFixed(2) + "px," + (old.ty - inv * view.ty).toFixed(2) + "px) scale(" + inv.toFixed(5) + ")";
    if (!inside && s >= 0.98) cam.style.opacity = ".3";
    cam.getBoundingClientRect();
    cam.style.transition = "transform " + ms + "ms cubic-bezier(.3,.1,.15,1), opacity " + Math.round(ms * .6) + "ms ease";
    cam.style.transform = "none";
    cam.style.opacity = "1";
    flyEnd = function () { cam.style.transition = ""; cam.style.transform = ""; cam.style.opacity = ""; };
    flyTimer = setTimeout(finishFly, ms + 60);
  } else {
    /* yakınlaşma: eski çizimi büyüt, bitince net çiz */
    cam.style.transition = "transform " + ms + "ms cubic-bezier(.3,.1,.15,1)";
    cam.style.transform = relTransform(v2);
    flyEnd = function () { commit(v2); };
    flyTimer = setTimeout(finishFly, ms + 30);
  }
}
function llBox(b) {   /* [lon0,lat0,lon1,lat1] → harita kutusu [x0,y0,x1,y1] */
  var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, i, j;
  for (i = 0; i <= 4; i++) for (j = 0; j <= 4; j++) {
    var p = proj(b[0] + (b[2] - b[0]) * i / 4, b[1] + (b[3] - b[1]) * j / 4);
    x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]);
  }
  return [x0, y0, x1, y1];
}
function fitLL(b, pad) {   /* [lon0,lat0,lon1,lat1] → bütün sahneyi dolduran görünüm */
  var B = llBox(b), padL = pad == null ? 0.04 : pad;
  var w = B[2] - B[0], h = B[3] - B[1];
  var k = Math.min(SW / (w * (1 + padL * 2)), SH / (h * (1 + padL * 2)));
  return {k: k, tx: SW / 2 - k * (B[0] + B[2]) / 2, ty: SH / 2 - k * (B[1] + B[3]) / 2};
}
function fitBoxIn(B, r, kmax) {   /* harita kutusunu sahnenin r dikdörtgenine sığdır */
  var w = Math.max(B[2] - B[0], 1), h = Math.max(B[3] - B[1], 1);
  var k = clamp(Math.min((r.x1 - r.x0) / w, (r.y1 - r.y0) / h), kMin(), Math.min(kmax || Infinity, kMax()));
  return {k: k, tx: (r.x0 + r.x1) / 2 - k * (B[0] + B[2]) / 2, ty: (r.y0 + r.y1) / 2 - k * (B[1] + B[3]) / 2};
}
function stageView(v) {   /* aşama görünümü; ayrıntı haritasında açık lejantın kapatmadığı alana sığdırılır */
  if (SC !== "dt") return fitLL(v, .02);
  var r = freeRect(), lg = $("#legend");
  if (!lg.classList.contains("shut")) {
    var sr = stage.getBoundingClientRect(), lr = lg.getBoundingClientRect();
    if (lr.width && lr.right - sr.left < SW * .45) r.x0 = Math.max(r.x0, lr.right - sr.left + 10 * RF);
  }
  return fitBoxIn(llBox(v), r);
}
function freeRect() {   /* sahnede kartların ve düğmelerin kapatmadığı alan */
  var sr = stage.getBoundingClientRect(), m = 14 * RF, r = {x0: m, y0: m, x1: SW - m, y1: SH - m};
  if (!quizBox.hidden) { var q = quizBox.getBoundingClientRect(); if (q.height) r.y0 = Math.max(r.y0, q.bottom - sr.top + m); }
  var z = $(".zoom").getBoundingClientRect();
  if (z.width && z.left - sr.left > SW * .6) r.x1 = Math.min(r.x1, z.left - sr.left - m);
  return r;
}
function zoomAt(f, cx, cy, animate) {
  var r = stage.getBoundingClientRect(), x = cx - r.left, y = cy - r.top;
  var k = clamp(view.k * f, kMin(), kMax()), s = k / view.k;
  var v2 = {k: k, tx: x - s * (x - view.tx), ty: y - s * (y - view.ty)};
  if (animate) flyTo(v2, 380); else commit(v2);
}
function scaleBar() {
  /* haritanın ortasında 1 km ≈ yerel ölçek (LCC konformal: sapma %5'ten az) */
  var targetPx = 110 * RF, km = targetPx / view.k;
  var steps = [.1, .25, .5, 1, 2, 5, 10, 25, 50, 100, 200, 250, 500, 1000, 2000], pick = steps[0];
  steps.forEach(function (s) { if (s <= km) pick = s; });
  $("#scaleBar").style.width = (pick * view.k).toFixed(0) + "px";
  $("#scaleTxt").textContent = pick >= 1000 ? (pick / 1000) + " bin km" : pick < 1 ? Math.round(pick * 1000) + " m" : pick + " km";
}

/* ================================================================ etiket çakışması */
/* Kutular tasarım pikselinde bir kez ölçülür (yazı tipi değişince yeniden). Gizli öğeler
   0 ölçüleceği için ölçüm sırasında hepsi geçici olarak görünür yapılır. */
var fsVer = 0;   /* yazı boyu ya da yazı tipi değişince artar: kutular yeniden ölçülür */
function measureLabels() {
  var ovc = svO.getAttribute("class");
  svO.setAttribute("class", "sv over z2");
  var hid = $$(".hid", svO);
  hid.forEach(function (x) { x.classList.remove("hid"); });
  var list = CS.filter(function (o) { return o.scene === SC; });
  var off = list.filter(function (o) { return o.el.style.display === "none"; });
  off.forEach(function (o) { o.el.style.display = ""; });
  var grps = (SC === "dt" ? [gDL] : [gLbl, gCity]).filter(function (g) { return g && g.style.display === "none"; });
  grps.forEach(function (g) { g.style.display = ""; });
  list.forEach(function (o) {
    o.mv = fsVer;
    try {
      var t = o.kind === "ct" ? o.el : o.el.querySelector("text");
      var b = t.getBBox();
      o.bb = b.width > 0 ? {x: b.x, y: b.y, w: b.width, h: b.height} : null;
      if (o.kind === "mk") { var tb = o.el.querySelector("text").getBBox(); o.bb = {x: tb.x, y: tb.y, w: tb.width, h: tb.height}; }
    } catch (e) { o.bb = null; }
  });
  off.forEach(function (o) { o.el.style.display = "none"; });
  grps.forEach(function (g) { g.style.display = "none"; });
  svO.setAttribute("class", ovc);
}
function boxesOf(o, cx, cy, s) {
  var b = o.bb;
  if (!o.r) return [[cx + b.x * s, cy + b.y * s, b.w * s, b.h * s]];
  /* döndürülmüş etiket: ekseni boyunca küçük kareler */
  var w = b.w * s, h = b.h * s, n = Math.max(1, Math.ceil(w / h)), a = o.r * D2R;
  var ca = Math.cos(a), sa = Math.sin(a), mx = cx + (b.x + b.w / 2) * s, my = cy + (b.y + b.h / 2) * s;
  var out = [];
  for (var i = 0; i < n; i++) {
    var t = -w / 2 + (i + .5) * w / n, px = mx + ca * t, py = my + sa * t, q = Math.max(h, w / n) / 2;
    out.push([px - q, py - q * .8, 2 * q, 1.6 * q]);
  }
  return out;
}
function collide() {
  var s = RF, placed = [], pad = 2.5 * RF;
  /* olay işaretlerinin daireleri her zaman engeldir */
  MK.forEach(function (o) {
    if (o.el.style.display === "none") return;
    var cx = o.x * view.k + view.tx, cy = o.y * view.k + view.ty, r = 13 * RF;
    placed.push([cx - r, cy - r, 2 * r, 2 * r, o]);
  });
  /* tepe, tabya, batık simgeleri de engeldir (adları çakışırsa yalnız ad gizlenir) */
  CS.forEach(function (o) {
    if (o.kind !== "pt" || o.scene !== SC || !o.vis || o.el.style.display === "none" || !lodOK(o.lod || 0)) return;
    var cx = o.x * view.k + view.tx, cy = o.y * view.k + view.ty, r = 7 * RF;
    placed.push([cx - r, cy - r, 2 * r, 2 * r, o]);
  });
  var m = 4 * RF, sr = stage.getBoundingClientRect();
  ["#legend", "#stamp", ".zoom", "#scale", "#quiz", "#penbar", "#caption"].forEach(function (q) {
    var e = $(q);
    if (!e || e.hidden || e.offsetParent === null) return;
    var r = e.getBoundingClientRect();
    if (r.width) placed.push([r.left - sr.left, r.top - sr.top, r.width, r.height]);
  });
  var items = CS.filter(function (o) { return o.scene === SC && o.vis && o.bb && o.el.style.display !== "none" && lodOK(o.lod || 0); });
  items.sort(function (a, b) { return b.pri - a.pri; });
  items.forEach(function (o) {
    var cx = o.x * view.k + view.tx, cy = o.y * view.k + view.ty;
    var bs = boxesOf(o, cx, cy, s), hit = false;
    for (var j = 0; j < bs.length && !hit; j++) {
      var B = bs[j];
      /* sahnenin dışına taşan (kesik görünecek) etiketi gösterme */
      if (B[0] < m || B[1] < m || B[0] + B[2] > SW - m || B[1] + B[3] > SH - m) { hit = true; break; }
      for (var i = 0; i < placed.length; i++) {
        var q = placed[i];
        if (q[4] === o) continue;
        if (B[0] < q[0] + q[2] + pad && B[0] + B[2] + pad > q[0] && B[1] < q[1] + q[3] + pad && B[1] + B[3] + pad > q[1]) { hit = true; break; }
      }
    }
    var tgt = o.kind === "ct" ? o.el : o.el.querySelector("text");
    var keep = !hit || o.kind === "mk" && o.pri >= 99;
    if (tgt) tgt.classList.toggle("hid", !keep);
    if (keep) for (j = 0; j < bs.length; j++) placed.push(bs[j]);
  });
}
function lodOK(lod) {
  var rel = view.k / kMin();
  return lod === 0 || (lod === 1 && rel >= 1.55) || (lod === 2 && rel >= 2.9);
}
/* olay işaretlerini kümele: ekranda birbirine çok yakın olanlar tek işarette birleşir */
var OSMF = {kafkas:1, kanal:1, canakkale:1, irak:1, filistin:1, hicaz:1, galicya:1, makedonya:1, romanya:1, isgal:1};
function evPri(id) {
  var e = D.E[id] || {};
  return (e.w ? 2 : 0) + (e.k === "mh" || e.k === "den" || e.k === "ant" || e.k === "kus" ? 1 : 0) + (OSMF[e.f] ? 1.5 : 0);
}
function cluster() {
  var R = 30 * RF, reps = [];
  var list = MK.slice().sort(function (a, b) {
    return (b.id === S.ev ? 99 : b.ep) - (a.id === S.ev ? 99 : a.ep);
  });
  list.forEach(function (o) {
    var sx = o.x * view.k, sy = o.y * view.k;
    for (var i = 0; i < reps.length; i++) {
      var r = reps[i];
      if (Math.hypot(r.x * view.k - sx, r.y * view.k - sy) < R) { r.members.push(o); o.rep = r; return; }
    }
    o.members = [o]; o.rep = o; reps.push(o);
  });
  MK.forEach(function (o) {
    var isRep = o.rep === o;
    o.el.style.display = isRep ? "" : "none";
    var badge = o.el.querySelector(".mk-n");
    var n = isRep ? o.members.length : 1;
    if (n > 1) {
      if (!badge) {
        badge = el("g", {"class": "mk-n"}, o.el);
        el("circle", {cx: 12, cy: -12, r: 9.5}, badge);
        el("text", {x: 12, y: -8, "text-anchor": "middle"}, badge);
      }
      badge.querySelector("text").textContent = "+" + (n - 1);
      o.el.setAttribute("data-cl", o.members.map(function (m) { return m.id; }).join(","));
    } else {
      if (badge) badge.parentNode.removeChild(badge);
      o.el.removeAttribute("data-cl");
    }
  });
}

/* ================================================================ aşamayı çiz */
function drawStage(i) {
  if (SC === "dt") return drawDetail(i);
  var st = D.ST[i], own = OWN[i];
  /* dolgular */
  for (var a in UP) {
    var o = own[a] || "OTH";
    UP[a].style.fill = "var(--f-" + roleOf(o, i) + ")";
  }
  /* sınırlar */
  EDGES.forEach(function (e) {
    var b = (own[e.a] || "OTH") !== (own[e.b] || "OTH");
    e.el.setAttribute("class", b ? "ed b" : "ed");
  });
  drawZones(i);
  drawFronts(i);
  drawRails(i);
  /* etiketler ve şehirler */
  LBL.forEach(function (o) { o.vis = inRange(o.st, i); o.el.style.display = o.vis && S.layers.labels ? "" : "none"; });
  CITY.forEach(function (o) { o.vis = inRange(o.st, i) && !!S.layers.cities; o.el.style.display = o.vis ? "" : "none"; });
  drawMarkers(i);
  drawArrows();
  selUnit(null, true);
}
function zoneList(i) {
  var st = D.ST[i], out = [];
  (st.zones || []).forEach(function (z) { if (G.zones[z[0]]) out.push({d: G.zones[z[0]], h: z[1], id: z[0]}); });
  (st.z2 || []).forEach(function (z) { if (G.zones[z[0]]) out.push({d: G.zones[z[0]], h: z[1], id: z[0]}); });
  (st.pz || []).forEach(function (z) { if (G.pzones[z[0]]) out.push({d: G.pzones[z[0]], h: z[1], id: z[0]}); });
  if (i === 9 && S.sevr) {
    [["sevr_bog", "W"], ["sevr_yun", "W-GRC"], ["sevr_ita", "W-ITA"], ["sevr_fra", "W-FRA"], ["sevr_erm", "W-GBR"], ["sevr_kurd", "M"]]
      .forEach(function (z) { out.push({d: G.pzones[z[0]], h: z[1], id: z[0]}); });
  }
  return out;
}
function drawZones(i) {
  gZ.textContent = "";
  if (!S.layers.zones) return;
  zoneList(i).forEach(function (z) {
    var h = HATCH.indexOf(z.h) >= 0 || z.h === "M" ? z.h : z.h.charAt(0);
    el("path", {d: z.d, "class": "zn", "data-z": z.id, style: "fill:url(#h-" + h + ");stroke:var(--h-" + (h === "M" ? "W" : h) + ")"}, gZ);
  });
}
function drawFronts(i) {
  gFront.textContent = "";
  if (!S.layers.fronts) return;
  (ST[i].lines || []).forEach(function (id) {
    var L = D.L[id];
    if (!L || L.k !== "front") return;
    partsOf(L).forEach(function (p) {
      var d = dPath(catmull(projAll(p), 6));
      el("path", {d: d, "class": "fr-c"}, gFront);
      el("path", {d: d, "class": "fr-t"}, gFront);
      el("path", {d: d, "class": "fr-l"}, gFront);
    });
  });
}
function drawRails(i) {
  gRail.textContent = "";
  if (!S.layers.rails) return;
  var ids = (D.ST[i].lines || []).filter(function (id) { return D.L[id] && D.L[id].k === "rail"; });
  if (!ids.length && (i === 3 || i === 4 || i === 5)) ids = ["rail_hjz"];
  ids.forEach(function (id) {
    var L = D.L[id];
    partsOf(L).forEach(function (p) {
      var d = dPath(projAll(p));
      el("path", {d: d, "class": "rail-c"}, gRail);
      el("path", {d: d, "class": "rail-d"}, gRail);
    });
    (L.gap || []).forEach(function (p) { el("path", {d: dPath(catmull(projAll(p), 6)), "class": "rail-g"}, gRail); });
  });
}
function drawArrows() {
  gArrow.textContent = "";
  if (!S.layers.arrows) return;
  var st = ST[S.st], s = RF / view.k;
  (st.arrows || []).forEach(function (id) {
    var L = D.L[id];
    if (!L) return;
    var g = el("g", {"class": "arw", "data-l": id}, gArrow);
    partsOf(L).forEach(function (p) {
      if (L.k === "C" || L.k === "E" || L.k === "O") {
        el("path", {d: arrowPath(p, s, L.w), "class": "ar ar-" + L.k}, g);
      } else {
        var kk = L.k === "nC" ? "C" : L.k === "nE" ? "E" : L.k;
        var d = dPath(catmull(projAll(p), 8));
        el("path", {d: d, "class": "nv-case"}, g);
        el("path", {d: d, "class": "nv nv-" + kk}, g);
        el("path", {d: headPath(p, s), "class": "nvh-" + kk}, g);
      }
    });
  });
}

/* --- olay işaretleri --- */
var MK = [];
function evVisible(id) { var e = D.E[id]; return e && e.p; }
function drawMarkers(i) {
  CS = CS.filter(function (o) { return o.kind !== "mk"; });
  gMk.textContent = ""; MK = [];
  if (!S.layers.events) return;
  var ids = stageEvents(i);
  var groups = {};
  ids.forEach(function (id) {
    var e = D.E[id];
    if (!e || !e.p) return;
    if (e.g) { if (groups[e.g]) { groups[e.g].ids.push(id); return; } groups[e.g] = {ids: [id]}; }
    var xy = proj(e.p[0], e.p[1]);
    var w = e.w || "N";
    var g = el("g", {"class": "mk mk-" + w, "data-e": e.g ? "g:" + e.g : id, role: "button", tabindex: "-1",
      "aria-label": e.g ? "Paris Barış Konferansı antlaşmaları" : e.n + ", " + e.d}, gMk);
    el("circle", {r: 24, "class": "mk-hit"}, g);
    el("circle", {r: 13, "class": "mk-bg"}, g);
    el("use", {href: "#m-" + e.k, x: -8.5, y: -8.5, width: 17, height: 17, "class": "mk-ic"}, g);
    var lp = e.lp || "e";
    var off = {n: [0, -22, "middle"], s: [0, 30, "middle"], e: [19, 5, "start"], w: [-19, 5, "end"],
      ne: [15, -14, "start"], nw: [-15, -14, "end"], se: [15, 22, "start"], sw: [-15, 22, "end"]}[lp] || [19, 5, "start"];
    var t = el("text", {x: off[0], y: off[1], "text-anchor": off[2]}, g);
    t.textContent = e.g ? "Paris Barış Konferansı" : e.n;
    var o = cs(g, xy[0], xy[1], 0, 95, "mk");
    o.vis = true; o.id = e.g ? "g:" + e.g : id; o.ep = e.g ? 3 : evPri(id);
    if (e.g) groups[e.g].o = o;
    MK.push(o);
  });
  var s = RF / view.k;
  MK.forEach(function (o) {
    placeCS(o, s);
    try { var b = o.el.querySelector("text").getBBox(); o.bb = {x: b.x, y: b.y, w: b.width, h: b.height}; } catch (e) { o.bb = null; }
  });
  cluster();
  markSel();
}
function stageEvents(i) { return ST[i].ev || []; }
function markSel() {
  MK.forEach(function (o) {
    var on = S.ev && (o.id === S.ev || (o.id.indexOf("g:") === 0 && D.E[S.ev] && D.E[S.ev].g === o.id.slice(2)));
    o.el.classList.toggle("on", !!on);
    var r = o.el.querySelector(".mk-sel");
    if (on && !r) el("circle", {r: 18.5, "class": "mk-sel"}, o.el);
    if (!on && r) r.parentNode.removeChild(r);
  });
}

/* --- seçili toprak --- */
function selUnit(a, silent) {
  gHLb.textContent = "";
  S.unit = a;
  if (!a) return;
  var own = OWN[S.st], state = own[a];
  Object.keys(own).forEach(function (u) {
    if (own[u] === state && G.units[u]) el("path", {d: G.units[u], "class": "hl-f"}, gHLb);
  });
  el("path", {d: G.units[a], "class": "hl"}, gHLb);
}

/* ================================================================ Çanakkale ayrıntı haritası */
/* Aynı izdüşümde, sınırları dar ikinci bir sahne: ~30 m çözünürlüklü kıyı ve kabartma, kendi
   aşamaları, olayları ve çizgileri. Fiziki taban (canakkale-geo.js) ilk açılışta yüklenir. */
function themeDark() {
  var t = document.documentElement.getAttribute("data-theme");
  if (t) return t === "dark";
  return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
}
function setDRelief() { if (dRel) dRel.setAttribute("href", themeDark() ? "canakkale-n.webp" : "canakkale-g.webp"); }
(function () {
  if (!window.matchMedia) return;
  var mq = matchMedia("(prefers-color-scheme: dark)");
  if (mq.addEventListener) mq.addEventListener("change", setDRelief); else if (mq.addListener) mq.addListener(setDRelief);
})();
var GLYPH = {pk: "M0-5.5 5.2 3.6H-5.2Z", ft: "M0-8.6 2.6-2.6 8.6 0 2.6 2.6 0 8.6-2.6 2.6-8.6 0-2.6-2.6Z",
  sh: "M-7.5-1.2h15l-2.8 4H-4.7Z M-1.1-7h2v5.8h-2Z"};
function mkPoint(P2, kind) {   /* tepe, tabya, batık: simge + ad (ad sığmazsa yalnız ad gizlenir) */
  var xy = proj(P2[1], P2[2]), lod = P2[3] || 0;
  var g = el("g", {"class": "pt pt-" + kind + (lod ? " lod" + lod : "")}, gDL);
  el("path", {d: GLYPH[kind], "class": "gl"}, g);
  if (kind === "sh") el("path", {d: "M-8 5.6q2-1.8 4 0t4 0 4 0 4 0", "class": "wv-sh"}, g);
  var t = el("text", {"class": "t-" + kind, x: kind === "ft" ? 11 : 9, y: 4.5}, g);
  t.textContent = P2[0];
  var o = cs(g, xy[0], xy[1], 0, kind === "ft" ? 55 : kind === "pk" ? 48 : 52, "pt");
  o.lod = lod;
  return o;
}
function buildDetail() {
  var C = window.GEOC, b = C.bnd;
  var TR = "translate(" + b[0] + " " + b[1] + ") scale(" + C.u + ")";
  dz = el("g", {id: "dz", style: "display:none"});
  svB.insertBefore(dz, bz.nextSibling);
  el("path", {d: C.land, transform: TR}, el("clipPath", {id: "dClip"}, defs));
  el("rect", {x: b[0] - 40, y: b[1] - 40, width: b[2] - b[0] + 80, height: b[3] - b[1] + 80, "class": "sea"}, dz);
  var g0 = el("g", {transform: TR}, dz);
  el("path", {d: C.land, "class": "d-land"}, g0);
  dRel = el("image", {"class": "relief d-rel", x: C.img[0], y: C.img[1], width: C.img[2], height: C.img[3], preserveAspectRatio: "none"}, dz);
  setDRelief();
  var g1 = el("g", {transform: TR}, dz);
  C.wl.forEach(function (d, i) { if (d) el("path", {d: d, "class": "d-wl d-wl" + i}, g1); });
  el("path", {d: C.land, "class": "d-coast"}, g1);
  gDZ = el("g", {id: "gDZ"}, dz);
  gDM = el("g", {id: "gDM"}, dz);
  el("path", {d: C.mines, transform: TR, "class": "mine"}, gDM);
  var a = proj(D.C.NUSRET[0][0], D.C.NUSRET[0][1]), z = proj(D.C.NUSRET[1][0], D.C.NUSRET[1][1]);
  nusretEl = el("path", {d: dPath([a, z]), "class": "nusret"}, gDM);   /* Nusret'in 26 mayını */
  nusretEl._len = Math.hypot(z[0] - a[0], z[1] - a[1]);
  /* adlar, kasabalar, tepeler, tabyalar, batıklar: ayrıntı sahnesinin sayaç ölçekli öğeleri */
  var prev = SC; SC = "dt";
  DLBL = [];
  D.C.LB.forEach(function (L) { DLBL.push(mkLabel(L, gDL)); });
  D.C.CT.forEach(function (T) { var o = mkCity(T, gDL); o.city = 1; DLBL.push(o); });
  D.C.PK.forEach(function (P2) { DLBL.push(mkPoint(P2, "pk")); });
  D.C.FT.forEach(function (P2) { var o = mkPoint(P2, "ft"); o.need = "forts"; DLBL.push(o); });
  D.C.SHIPS.forEach(function (P2) { var o = mkPoint([P2[0], P2[1], P2[2], 1], "sh"); o.need = "ships"; DLBL.push(o); });
  SC = prev;
}
function drawDetail(i) {
  var st = ST[i];
  gZ.textContent = ""; gRail.textContent = "";
  gDZ.textContent = "";
  if (S.layers.zones) (st.zones || []).forEach(function (id) {
    var z = D.C.Z[id];
    if (z) el("path", {d: dPath(projAll(z)) + "Z", "class": "d-zn", "clip-path": "url(#dClip)", style: "fill:url(#h-E)"}, gDZ);
  });
  drawFronts(i);
  gDM.style.display = st.mines && S.layers.fronts ? "" : "none";
  DLBL.forEach(function (o) {
    o.vis = inRange(o.st, i) && (!o.need || !!st[o.need]) && (!o.city || !!S.layers.cities);
    o.el.style.display = o.vis ? "" : "none";
  });
  drawMarkers(i);
  drawArrows();
  selUnit(null, true);
}
function setScene(sc) {
  SC = sc;
  ST = sc === "dt" ? D.C.ST : D.ST;
  if (sc === "dt") { var b = GEOC.bnd; BND = {x0: b[0], y0: b[1], x1: b[2], y1: b[3]}; }
  else BND = {x0: 0, y0: 0, x1: MW, y1: MH};
  document.body.classList.toggle("dt", sc === "dt");
  bz.style.display = sc === "dt" ? "none" : "";
  if (dz) dz.style.display = sc === "dt" ? "" : "none";
  gCity.style.display = sc === "dt" ? "none" : "";
  S.ev = null; S.unit = null; S.clList = null; S.tapZone = null;
  gHLb.textContent = ""; gQz.textContent = "";
  $("#stampK").textContent = sc === "dt" ? "Çanakkale Savaşları" : "";
  applyLayers(false);
  buildTimeline();
  if (CS.some(function (o) { return o.scene === SC && o.mv !== fsVer; })) measureLabels();
}
function sceneAnim(dir) {   /* sahne değişimi: yakınlaşarak (1) ya da uzaklaşarak (-1) belirir */
  if (!motionOK()) return;
  var s = dir > 0 ? .8 : 1.25, cx = SW / 2, cy = SH / 2;
  cam.style.transition = "none";
  cam.style.transform = "translate(" + (cx * (1 - s)).toFixed(1) + "px," + (cy * (1 - s)).toFixed(1) + "px) scale(" + s + ")";
  cam.style.opacity = "0";
  cam.getBoundingClientRect();
  cam.style.transition = "transform 560ms cubic-bezier(.2,.7,.2,1), opacity 380ms ease";
  cam.style.transform = "none";
  cam.style.opacity = "1";
  flyEnd = function () { cam.style.transition = ""; cam.style.transform = ""; cam.style.opacity = ""; };
  flyTimer = setTimeout(finishFly, 620);
}
var dtLoading = false;
function openDetail(ph, evId) {
  if (!window.GEOC) {
    if (dtLoading) return;
    dtLoading = true;
    toast("Çanakkale haritası açılıyor…");
    var sc = document.createElement("script");
    sc.src = "canakkale-geo.js";
    sc.onload = function () { dtLoading = false; if (window.GEOC) openDetail(ph, evId); };
    sc.onerror = function () { dtLoading = false; toast("Ayrıntılı harita yüklenemedi"); };
    document.body.appendChild(sc);
    return;
  }
  if (!dz) buildDetail();
  if (S.quiz) quizClose();
  closePop();
  finishFly();
  if (SC !== "dt") {
    S.back = {st: S.st, mode: S.mode, front: S.front, view: view};
    setScene("dt");
    if (S.mode === "cephe") setMode("anlatim", true);
  }
  S.front = null; S.tab = "anlatim";
  S.st = -1; lastK = -1;
  go(ph || 0, {noFly: true, force: true});
  commit(stageView(ST[S.st].view));
  sceneAnim(1);
  if (evId) openEvent(evId, true);
}
function exitDT(toMode) {
  if (SC !== "dt") return;
  finishFly();
  var b = S.back || {st: 3, mode: "anlatim"};
  setScene("main");
  var m = toMode || b.mode || "anlatim";
  if (m !== S.mode) setMode(m, true);
  S.front = m === "cephe" && !toMode ? b.front : null;
  S.tab = m === "cephe" ? "cephe" : "anlatim";
  S.st = -1; lastK = -1;
  go(b.st, {noFly: true, force: true});
  commit(!toMode && b.view ? b.view : fitLL(D.ST[b.st].view, .02));
  renderPanel();
  sceneAnim(-1);
}
function dtBtn(ph, label) {
  return '<button class="detail-btn dt-btn" data-dt="' + ph + '"><svg class="ic"><use href="#i-zoom"/></svg><span><b>' +
    esc(label) + "</b><small>Arıburnu, Seddülbahir, Anafartalar ve Boğaz · yakın harita</small></span></button>";
}
function renderLegendDT() {
  var st = ST[S.st], h = "", ar = (st.arrows || []).map(function (id) { return D.L[id] ? D.L[id].k : ""; });
  function row(a, b) { return '<div class="lg-row">' + a + "<span>" + b + "</span></div>"; }
  function sv(inner) { return '<svg class="sw-line" viewBox="0 0 27 18">' + inner + "</svg>"; }
  var osm = "";
  if (st.forts) osm += row(sv('<path transform="translate(13.5 9) scale(.9)" d="' + GLYPH.ft + '" style="fill:var(--a-O);stroke:var(--halo);stroke-width:1.2"/>'), "Tabya");
  if (st.mines) osm += row(sv('<path d="M3 9h22" style="stroke:var(--mk-N);stroke-width:3.2;stroke-linecap:round;stroke-dasharray:0 5.5"/>'), "Mayın hattı") +
    row(sv('<path d="M3 9h22" style="stroke:var(--a-O);stroke-width:4.4;stroke-linecap:round;stroke-dasharray:0 6.5"/>'), "Nusret’in mayınları");
  if (ar.indexOf("C") >= 0) osm += row(sv('<path d="M1 7.5h15V3l10 6-10 6v-4.5H1z" style="fill:var(--a-C)"/>'), "Osmanlı karşı taarruzu");
  if (osm) h += '<div class="lg-sec">Osmanlı</div>' + osm;
  var itl = "";
  if (ar.indexOf("E") >= 0) itl += row(sv('<path d="M1 7.5h15V3l10 6-10 6v-4.5H1z" style="fill:var(--a-E)"/>'), "Çıkarma ve taarruz");
  if (ar.indexOf("nE") >= 0) itl += row(sv('<path d="M1 9h16" style="stroke:var(--a-E);stroke-width:2.4;stroke-dasharray:4.5 3"/><path d="M17 4.5 26 9l-9 4.5z" style="fill:var(--a-E)"/>'),
    (st.ev || []).indexOf("c_tahliye1") >= 0 ? "Tahliye" : "Donanmanın yolu");
  if ((st.zones || []).length) itl += row(swH("E"), "İtilaf kuvvetlerinin elindeki alan");
  if (st.ships) itl += row(sv('<path transform="translate(13.5 8)" d="' + GLYPH.sh + '" style="fill:var(--a-E)"/>'), "Batan zırhlı");
  if (itl) h += '<div class="lg-sec">İtilaf</div>' + itl;
  if ((st.lines || []).length) h += '<div class="lg-sec">Çizgiler</div>' + row(sv('<path d="M1 9h25" style="stroke:var(--front-case)" stroke-width="7"/><path d="M1 9h25" style="stroke:var(--front)" stroke-width="3"/>'), "Cephe hattı");
  h += '<div class="lg-sec">Yer</div>' + row(sv('<path transform="translate(13.5 10)" d="' + GLYPH.pk + '" style="fill:var(--mt-lbl)"/>'), "Tepe") +
    row(sv('<circle cx="13.5" cy="9" r="3.2" style="fill:var(--lbl);stroke:var(--halo);stroke-width:1.4"/>'), "Köy, kasaba");
  h += '<div class="lg-sec">Olaylar</div>' + row('<i class="sw" style="background:var(--mk-C);border-radius:50%;width:.95rem;height:.95rem"></i>', "Osmanlı başarısı") +
    row('<i class="sw" style="background:var(--mk-E);border-radius:50%;width:.95rem;height:.95rem"></i>', "İtilaf başarısı") +
    row('<i class="sw" style="background:var(--mk-N);border-radius:50%;width:.95rem;height:.95rem"></i>', "Çıkarma, tahliye");
  h += '<p class="lg-note">Hatlar ve konumlar yaklaşıktır.</p>';
  lgBody.innerHTML = h;
}

/* ================================================================ zaman çizelgesi */
var tSteps = $("#tSteps");
function buildTimeline() {
  tSteps.textContent = "";
  ST.forEach(function (st, i) {
    var li = document.createElement("li");
    li.innerHTML = '<button class="ts" data-i="' + i + '"><span class="no">' + (i + 1 < 10 ? "0" : "") + (i + 1) +
      '</span><span class="yr">' + esc(st.yr) + '</span><span class="nm">' + esc(st.nm) + "</span></button>";
    tSteps.appendChild(li);
  });
  $("#tBack").hidden = SC !== "dt";
}
buildTimeline();
function markTimeline() {
  $$(".ts", tSteps).forEach(function (b, i) {
    if (i === S.st) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    b.classList.toggle("done", i < S.st);
  });
  $("#tPrev").disabled = S.st === 0;
  $("#tNext").disabled = S.st === ST.length - 1;
}
tSteps.addEventListener("click", function (e) {
  var b = e.target.closest(".ts");
  if (b) go(+b.getAttribute("data-i"));
});
$("#tPrev").addEventListener("click", function () { go(S.st - 1); });
$("#tNext").addEventListener("click", function () { go(S.st + 1); });
$("#tBack").addEventListener("click", function () { exitDT(); });

/* ================================================================ aşamaya git */
function go(i, opt) {
  opt = opt || {};
  S.clList = null;
  i = clamp(i, 0, ST.length - 1);
  var changed = i !== S.st || opt.force;
  S.st = i;
  if (!opt.keepEv) S.ev = null;
  if (changed) drawStage(i);
  markTimeline();
  var st = ST[i];
  $("#stampYr").textContent = st.yr;
  $("#stampNm").textContent = st.nm;
  if (S.mode === "anlatim" && !opt.keepPanel) { S.tab = S.tab === "olaylar" ? "olaylar" : "anlatim"; renderPanel(); }
  else if (S.mode === "cephe" && !opt.keepPanel) renderPanel();
  renderLegend();
  renderCaption();
  if (!opt.noFly) flyTo(opt.view ? fitLL(opt.view, .02) : stageView(st.view));
  else commit(view);
  if (SC === "main") store.set("st", i);
}

/* ================================================================ panel */
var pBody = $("#pBody"), pTabs = $("#pTabs");
function tabs(list) {
  pTabs.innerHTML = list.map(function (t) {
    return '<button class="p-tab" role="tab" data-tab="' + t[0] + '" aria-selected="' + (S.tab === t[0]) + '">' +
      esc(t[1]) + (t[2] != null ? ' <span class="n">' + t[2] + "</span>" : "") + "</button>";
  }).join("");
}
pTabs.addEventListener("click", function (e) {
  var b = e.target.closest(".p-tab");
  if (!b) return;
  S.tab = b.getAttribute("data-tab");
  S.ev = null; markSel(); selUnit(null);
  renderPanel();
});
function evIcon(e) {
  return '<span class="ico ico-' + (e.w || "N") + '"><svg><use href="#m-' + e.k + '"/></svg></span>';
}
var KIND = {mh: "Muharebe", den: "Deniz", cik: "Çıkarma", kus: "Kuşatma", ant: "Antlaşma", sia: "Siyasi gelişme",
  sui: "Suikast", isg: "İşgal", dy: "Demiryolu", tah: "Tahliye"};
var FNAME = {bati: "Batı Cephesi", dogu: "Doğu Cephesi", italya: "İtalya Cephesi", balkan: "Balkanlar",
  kafkas: "Kafkas Cephesi", kanal: "Kanal Cephesi", canakkale: "Çanakkale Cephesi", irak: "Irak Cephesi",
  filistin: "Suriye-Filistin Cephesi", hicaz: "Hicaz-Yemen Cephesi", galicya: "Galiçya Cephesi",
  makedonya: "Makedonya Cephesi", romanya: "Romanya Cephesi", deniz: "Denizlerde", siyasi: "Siyaset ve diplomasi",
  isgal: "Mondros sonrası işgaller", baris: "Barış antlaşmaları"};
function evButton(id) {
  var e = D.E[id];
  if (!e) return "";
  return '<li><button class="evb' + (S.ev === id ? " on" : "") + '" data-ev="' + id + '">' + evIcon(e) +
    '<span class="t"><b>' + esc(e.n) + "</b><small>" + esc(e.d) + "</small></span></button></li>";
}
function renderPanel() {
  if (S.clList && !S.ev) {
    tabs([["anlatim", "Anlatım"], ["olaylar", "Olaylar", stageEvents(S.st).length]]);
    return setBody(backBtn() + "<h2>Bu noktadaki olaylar</h2>" + '<p class="p-date">Aynı yerde birden çok olay var. Birini seçin.</p><ol class="evl">' +
      S.clList.map(function (id) { return id.indexOf("g:") === 0 ? "" : evButton(id); }).join("") + "</ol>");
  }
  if (S.ev) return renderEvent(S.ev);
  if (S.unit && S.tab === "toprak") return renderUnit(S.unit);
  if (S.mode === "cephe") return renderFronts();
  var st = ST[S.st], evs = stageEvents(S.st);
  tabs([["anlatim", "Anlatım"], ["olaylar", "Olaylar", evs.length]]);
  var h = "";
  if (S.tab === "olaylar") {
    h += '<div class="kick"><span>' + esc(st.yr) + '</span><span class="sep"></span><span>' + esc(st.nm) + "</span></div>";
    h += "<h2>Bu aşamanın olayları</h2>";
    h += '<p class="p-date">Bir olaya dokunun; harita oraya gider ve olayın kartı açılır.</p>';
    h += '<ol class="evl">' + evs.map(evButton).join("") + "</ol>";
  } else {
    if (SC === "dt") h += '<button class="back" data-exitdt="1"><svg class="ic"><use href="#i-back"/></svg>Genel harita</button>';
    h += '<div class="kick"><span>Aşama ' + (S.st + 1) + " / " + ST.length + '</span><span class="sep"></span><span>' + esc(st.yr) + "</span></div>";
    h += "<h2>" + esc(st.t) + "</h2>";
    h += '<p class="p-date">' + esc(st.date) + "</p>";
    h += '<p class="lede">' + st.lede + "</p>";
    if (SC === "main" && D.C && D.C.link.st[S.st] != null) h += dtBtn(D.C.link.st[S.st], "Çanakkale Savaşları ayrıntılı haritası");
    h += '<div class="body">' + st.body.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>";
    if (st.osm) h += '<aside class="osm"><h4>' + esc(st.osmH || "Osmanlı Devleti açısından") + "</h4>" + st.osm + "</aside>";
    if (SC === "main" && S.st === 9) h += '<button class="detail-btn" id="bSevr"><svg class="ic"><use href="#i-eye"/></svg>' +
      (S.sevr ? "Sevr paylaşımını gizle" : "Sevr’e göre Anadolu’yu göster (1920)") + "</button>";
    h += '<dl class="facts">' + st.facts.map(function (f) { return '<div class="fact"><dt>' + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") + "</dl>";
    h += '<h3 class="p-h3">Olaylar</h3><ol class="evl">' + evs.slice(0, 5).map(evButton).join("") + "</ol>";
    if (evs.length > 5) h += '<button class="detail-btn" data-tab="olaylar">Bütün olaylar (' + evs.length + ")</button>";
  }
  setBody(h);
}
function setBody(h, keepScroll) {
  var y = pBody.scrollTop;
  pBody.innerHTML = h;
  pBody.scrollTop = keepScroll ? y : 0;
  updPanelNav();
}
function renderEvent(id) {
  var gi = id.indexOf("g:") === 0 ? id.slice(2) : null;
  if (gi) {   /* antlaşma grubu */
    var list = Object.keys(D.E).filter(function (k) { return D.E[k].g === gi; });
    tabs([["anlatim", "Anlatım"], ["olaylar", "Olaylar", stageEvents(S.st).length]]);
    var h = backBtn() + '<div class="kick"><span>Paris ve çevresi</span></div><h2>Paris Barış Konferansı antlaşmaları</h2>' +
      '<p class="p-date">1919 – 1920 · Hepsi Paris’in çevresindeki saraylarda imzalandı</p><ol class="evl">' + list.map(evButton).join("") + "</ol>";
    return setBody(h);
  }
  var e = D.E[id];
  if (!e) return;
  tabs([["anlatim", "Anlatım"], ["olaylar", "Olaylar", stageEvents(S.st).length]]);
  var evs = stageEvents(S.st), idx = evs.indexOf(id);
  var dtEv = id.indexOf("c_") === 0;
  var win = e.w === "C" ? (dtEv ? "Osmanlı başarısı" : "İttifak Devletleri kazandı") : e.w === "E" ? (dtEv ? "İtilaf başarısı" : "İtilaf Devletleri kazandı") : null;
  var h = backBtn();
  h += '<div class="kick"><span>' + esc(KIND[e.k] || "") + '</span><span class="sep"></span><span>' + esc(FNAME[e.f] || "") + "</span></div>";
  h += "<h2>" + esc(e.n) + "</h2>";
  h += '<p class="p-date">' + esc(e.d) + "</p>";
  if (win) h += '<div class="card-meta"><span class="tag ' + e.w + '">' + win + "</span></div>";
  h += '<div class="card-tx"><p>' + e.tx + "</p></div>";
  var fr = D.F.filter(function (f) { return f.ev.indexOf(id) >= 0; })[0];
  if (SC === "main" && D.C && D.C.link.ev[id] != null) h += dtBtn(D.C.link.ev[id], "Ayrıntılı haritada göster");
  if (fr && SC === "main") h += '<button class="detail-btn" data-front="' + fr.id + '"><svg class="ic"><use href="#i-front"/></svg>' + esc(fr.n) + "</button>";
  if (idx >= 0) {
    var pv = evs[idx - 1], nx = evs[idx + 1];
    h += '<div class="pager"><button data-ev="' + (pv || "") + '"' + (pv ? "" : " disabled") + '><svg class="ic"><use href="#i-prev"/></svg>' +
      (pv ? esc(D.E[pv].n) : "") + '</button><button data-ev="' + (nx || "") + '"' + (nx ? "" : " disabled") + ">" +
      (nx ? esc(D.E[nx].n) : "") + '<svg class="ic"><use href="#i-next"/></svg></button></div>';
  }
  setBody(h);
}
function backBtn() {
  var st = ST[S.st];
  var lbl = S.mode === "cephe" && S.front ? (D.F.filter(function (f) { return f.id === S.front; })[0] || {}).n : st.yr + " · " + st.nm;
  return '<button class="back" data-back="1"><svg class="ic"><use href="#i-back"/></svg>' + esc(lbl) + "</button>";
}
function renderUnit(a) {
  var i = S.st, own = OWN[i], state = own[a] || "OTH", SS = D.S[state] || {n: "—"};
  tabs([["anlatim", "Anlatım"], ["olaylar", "Olaylar", stageEvents(i).length]]);
  var side = sideOf(state, i), sl = side.charAt(0);
  var h = backBtn();
  h += '<div class="kick"><span>' + esc(D.AN[a] || "") + "</span></div>";
  h += "<h2>" + esc(SS.f || SS.n) + "</h2>";
  h += '<p class="p-date">' + esc(D.ST[i].yr) + (SS.cap ? " · Başkent: " + esc(SS.cap) : "") + "</p>";
  h += '<div class="card-meta"><span class="tag ' + (sl === "C" || sl === "L" ? "C" : sl === "E" || sl === "W" ? "E" : "") + '">' +
    esc(side === "N-OSM" ? "Tarafsız" : D.SIDE[sl] || "") + "</span></div>";
  /* bu noktada işgal var mı? */
  if (S.tapZone) h += '<aside class="osm"><h4>Bu aşamada</h4>' + esc(S.tapZone) + "</aside>";
  /* sahiplik geçmişi */
  var rows = [], prev = null;
  D.ST.forEach(function (st, j) {
    var o = OWN[j][a] || "OTH";
    if (o !== prev) rows.push({j: j, o: o});
    prev = o;
  });
  h += '<h3 class="p-h3">Bu toprakların kaderi</h3><ul class="hist">' + rows.map(function (r) {
    var now = r.j <= i && (rows.filter(function (q) { return q.j <= i; }).slice(-1)[0] === r);
    return '<li class="' + (now ? "now" : "") + '"><b>' + esc(D.ST[r.j].yr) + "</b> — " + esc((D.S[r.o] || {n: "—"}).n) + "</li>";
  }).join("") + "</ul>";
  setBody(h);
}
function renderFronts() {
  tabs([["cephe", "Cepheler"]]);
  if (S.front) {
    var f = D.F.filter(function (x) { return x.id === S.front; })[0];
    var h = '<button class="back" data-fback="1"><svg class="ic"><use href="#i-back"/></svg>Bütün cepheler</button>';
    h += '<div class="kick"><span>' + esc(D.FG[f.g]) + "</span></div>";
    h += "<h2>" + esc(f.n) + "</h2>";
    h += '<p class="p-date">' + esc(f.d) + "</p>";
    if (D.C && D.C.link.front[f.id] != null) h += dtBtn(D.C.link.front[f.id], "Çanakkale Savaşları ayrıntılı haritası");
    h += '<aside class="osm"><h4>Amaç</h4>' + f.amac + "</aside>";
    h += '<div class="body">' + f.tx.map(function (p) { return "<p>" + p + "</p>"; }).join("") + "</div>";
    h += '<dl class="facts"><div class="fact"><dt>Komutanlar</dt><dd>' + esc(f.kom) + '</dd></div><div class="fact"><dt>Sonuç</dt><dd>' + f.sonuc + "</dd></div></dl>";
    h += '<h3 class="p-h3">Bu cephenin olayları</h3><ol class="evl">' + f.ev.map(evButton).join("") + "</ol>";
    return setBody(h);
  }
  var h2 = '<h2>Cepheler</h2><p class="p-date">Osmanlı Devleti dört yılda dokuz cephede savaştı. Bir cepheye dokunun.</p>';
  ["taarruz", "savunma", "yardim", "avrupa"].forEach(function (g) {
    h2 += '<section class="fg fg-' + g + '"><h3><i></i>' + esc(D.FG[g]) + "</h3>";
    D.F.filter(function (f) { return f.g === g; }).forEach(function (f) {
      h2 += '<button class="fb" data-front="' + f.id + '"><b>' + esc(f.n) + "</b><small>" + esc(f.d) + "</small></button>";
    });
    h2 += "</section>";
  });
  setBody(h2);
}
function openFront(id) {
  var f = D.F.filter(function (x) { return x.id === id; })[0];
  if (!f) return;
  if (SC === "dt") exitDT("cephe");
  setMode("cephe", true);
  S.front = id; S.ev = null;
  go(f.st, {keepPanel: true, view: f.view, force: S.st !== f.st});
  renderPanel();
}
function openEvent(id, fly) {
  var gi = id.indexOf("g:") === 0 ? id.slice(2) : null;
  var e = gi ? null : D.E[id];
  if (!gi && !e) return;
  /* olay öteki sahnedeyse önce o sahneye geç */
  var inDT = !gi && id.indexOf("c_") === 0;
  if (inDT && SC !== "dt") {
    var ph = D.C.ST.findIndex(function (st) { return (st.ev || []).indexOf(id) >= 0; });
    return openDetail(ph < 0 ? 0 : ph, id);
  }
  if (!inDT && SC === "dt") exitDT();
  /* olay bu aşamada yoksa, olayın geçtiği ilk aşamaya git */
  if (e && stageEvents(S.st).indexOf(id) < 0) {
    var j = ST.findIndex(function (st) { return (st.ev || []).indexOf(id) >= 0; });
    if (j >= 0) go(j, {keepPanel: true, noFly: true});
  }
  S.ev = id; S.unit = null; selUnit(null);
  markSel();
  renderPanel();
  if (fly !== false && e && e.p) {
    var xy = proj(e.p[0], e.p[1]);
    var k = Math.max(view.k, kMin() * 2.4);
    /* panel görünürken olayı sahnenin ortasına al */
    flyTo({k: k, tx: SW * .5 - k * xy[0], ty: SH * .5 - k * xy[1]}, 650);
  }
}
pBody.addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-ev")) { var id = b.getAttribute("data-ev"); if (id) openEvent(id); return; }
  if (b.hasAttribute("data-back")) { S.clList = null; S.ev = null; S.unit = null; S.tapZone = null; markSel(); selUnit(null); if (S.tab === "toprak") S.tab = "anlatim"; renderPanel(); return; }
  if (b.hasAttribute("data-dt")) { openDetail(+b.getAttribute("data-dt")); return; }
  if (b.hasAttribute("data-exitdt")) { exitDT(); return; }
  if (b.hasAttribute("data-front")) { openFront(b.getAttribute("data-front")); return; }
  if (b.hasAttribute("data-fback")) { S.front = null; renderPanel(); flyTo(fitLL(D.ST[S.st].view, .02)); return; }
  if (b.hasAttribute("data-tab")) { S.tab = b.getAttribute("data-tab"); renderPanel(); return; }
  if (b.id === "bSevr") { S.sevr = !S.sevr; drawZones(S.st); renderPanel(); renderLegend(); if (S.sevr) flyTo(fitLL([25, 35.5, 45.5, 42.5], .03)); return; }
});
/* panel kaydırma düğmeleri (dokunmatik sürükleme çalışmasa bile) */
function updPanelNav() {
  var over = pBody.scrollHeight > pBody.clientHeight + 4;
  $("#pUp").disabled = !over || pBody.scrollTop < 4;
  $("#pDown").disabled = !over || pBody.scrollTop + pBody.clientHeight >= pBody.scrollHeight - 4;
  var nx = $("#pNext"), h;
  if (S.mode === "cephe") {
    var fi = D.F.map(function (f) { return f.id; }).indexOf(S.front), f2 = D.F[(fi + 1) % D.F.length];
    h = "<span><small>" + (S.front ? "Sonraki cephe" : "İlk cephe") + "</small><b>" + esc(f2.n) + "</b></span>";
    nx.setAttribute("data-act", "front:" + f2.id);
  } else if (S.st < ST.length - 1) {
    var st = ST[S.st + 1];
    h = "<span><small>Sonraki aşama</small><b>" + esc(st.yr) + " · " + esc(st.nm) + "</b></span>";
    nx.setAttribute("data-act", "next");
  } else if (SC === "dt") {
    h = "<span><small>Çanakkale Savaşları bitti</small><b>Genel haritaya dön</b></span>";
    nx.setAttribute("data-act", "exitdt");
  } else {
    h = "<span><small>Son aşama</small><b>Başa dön</b></span>";
    nx.setAttribute("data-act", "first");
  }
  nx.innerHTML = h + '<svg><use href="#i-next"/></svg>';
}
$("#pNext").addEventListener("click", function () {
  var a = this.getAttribute("data-act");
  if (a === "next") go(S.st + 1);
  else if (a === "first") go(0);
  else if (a === "exitdt") exitDT();
  else if (a && a.indexOf("front:") === 0) openFront(a.slice(6));
});
pBody.addEventListener("scroll", updPanelNav, {passive: true});
$("#pUp").addEventListener("click", function () { pBody.scrollBy({top: -pBody.clientHeight * .7, behavior: motionOK() ? "smooth" : "auto"}); });
$("#pDown").addEventListener("click", function () { pBody.scrollBy({top: pBody.clientHeight * .7, behavior: motionOK() ? "smooth" : "auto"}); });
dragScroll(pBody);
dragScroll($("#lgBody"));
dragScroll($("#pop"));

/* Firefox'ta XInput2 kapalıysa dokunuşlar fare olarak gelir ve kaydırmaz; fareyle sürüklemeyi kaydırmaya çevir */
function dragScroll(box) {
  var d = null;
  box.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    d = {y: e.clientY, x: e.clientX, top: box.scrollTop, left: box.scrollLeft, moved: false, id: e.pointerId};
  });
  box.addEventListener("pointermove", function (e) {
    if (!d || e.pointerId !== d.id) return;
    var dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dy) > 7) { d.moved = true; try { box.setPointerCapture(e.pointerId); } catch (x) {} }
    if (d.moved) { box.scrollTop = d.top - dy; e.preventDefault(); }
  });
  function end(e) {
    if (d && d.moved) { box._justDragged = Date.now(); }
    d = null;
  }
  box.addEventListener("pointerup", end);
  box.addEventListener("pointercancel", end);
  box.addEventListener("click", function (e) {
    if (box._justDragged && Date.now() - box._justDragged < 250) { e.stopPropagation(); e.preventDefault(); }
  }, true);
}

/* ================================================================ lejant */
var lgBody = $("#lgBody");
function sw(role) { return '<i class="sw" style="background:var(--f-' + role + ')"></i>'; }
function swH(h) { return '<svg class="sw-line" viewBox="0 0 27 18"><rect x="0.5" y="0.5" width="26" height="17" rx="2" style="fill:var(--panel-2);stroke:var(--h-' + h + ')" stroke-dasharray="3 2"/><path d="M0 18 18 0M9 18 27 0M-9 18 9 0M18 18 36 0" style="stroke:var(--h-' + h + ')" stroke-width="2.6"/></svg>'; }
function renderLegend() {
  if (SC === "dt") return renderLegendDT();
  var i = S.st, st = D.ST[i], rows = [];
  var sides = {}, own = OWN[i];
  Object.keys(own).forEach(function (a) { var s = own[a]; sides[roleOf(s, i)] = sides[roleOf(s, i)] || s; });
  function has(r) { return !!sides[r]; }
  var h = '<div class="lg-sec">Devletler</div>';
  if (i === 0) {
    h += row(sw("C-DEU") + sw("C-AUH") + sw("C-ITA"), "Üçlü İttifak (1882)") + row(sw("E-GBR") + sw("E-FRA") + sw("E-RUS"), "Üçlü İtilaf (1907)") +
      row(sw("N-OSM"), "Osmanlı Devleti (tarafsız)") + row(sw("N"), "Diğer devletler");
  } else if (i <= 7) {
    h += row(sw("C-DEU") + sw("C-AUH"), "İttifak Devletleri") + row(sw("C-OSM"), i === 1 ? "Osmanlı Devleti (gizli ittifak, tarafsız)" : "Osmanlı Devleti");
    if (i === 1) h = h.replace('var(--f-C-OSM)', 'var(--f-N-OSM)');
    h += row(sw("E-GBR") + sw("E-FRA") + sw("E-RUS"), "İtilaf Devletleri");
    if (has("X-SOV")) h += row(sw("X-SOV"), "Sovyet Rusya (savaştan çekildi)");
    if (has("C-OCC")) h += row(sw("C-OCC"), "Rusya’dan ayrılan, Alman denetimindeki topraklar");
    if (has("X") && i === 6) h += row(sw("X"), "Romanya (barış imzaladı)");
    h += row(sw("N"), "Tarafsız");
  } else {
    h += row(sw("W-GBR") + sw("W-FRA"), "Galip devletler") + row(sw("L-DEU") + sw("L-AUT"), "Yenilen devletler");
    h += row(sw(i === 9 ? "T" : "L-OSM"), i === 9 ? "Türkiye (Lozan, 1923)" : "Osmanlı Devleti");
    h += row(sw("Y-POL") + sw("Y-CZS"), "Yeni kurulan devletler");
    if (i === 9) h += row(sw("M-FRM") + sw("M-GBM"), "Manda (Fransız · İngiliz)");
    h += row(sw("X-SOV"), "Sovyet Rusya") + row(sw("N"), "Tarafsız");
  }
  var zs = zoneList(i), zk = {};
  zs.forEach(function (z) { zk[z.h] = 1; });
  if (zs.length) {
    h += '<div class="lg-sec">' + (i >= 8 ? (i === 9 ? "Sevr’e göre (1920)" : "İşgaller") : "İşgal altında") + "</div>";
    var ZN = i === 9 ? {"W": "Boğazlar (uluslararası)", "W-GRC": "Yunanistan", "W-ITA": "İtalyan nüfuz bölgesi", "W-FRA": "Fransız nüfuz bölgesi", "W-GBR": "Ermenistan", "M": "Kürdistan (özerk)"}
      : i === 8 ? {"W": "İtilaf (ortak)", "W-GBR": "İngiliz", "W-FRA": "Fransız", "W-ITA": "İtalyan", "W-GRC": "Yunan"}
      : {"C": "İttifak Devletleri’nce", "E": "İtilaf Devletleri’nce"};
    Object.keys(zk).forEach(function (k) { h += row(swH(k === "M" ? "W" : k), ZN[k] || k); });
  }
  var ln = (st.lines || []).filter(function (id) { return D.L[id] && D.L[id].k === "front"; }).length;
  var ar = (st.arrows || []).length;
  if (ln || ar || (st.lines || []).indexOf("rail_bb") >= 0) {
    h += '<div class="lg-sec">Çizgiler</div>';
    if (ln) h += row('<svg class="sw-line" viewBox="0 0 27 18"><path d="M1 9h25" style="stroke:var(--front-case)" stroke-width="7"/><path d="M1 9h25" style="stroke:var(--front)" stroke-width="3"/></svg>', "Cephe hattı");
    if (ar) h += row('<svg class="sw-line" viewBox="0 0 27 18"><path d="M1 7.5h15V3l10 6-10 6v-4.5H1z" style="fill:var(--a-C)"/></svg>', "İttifak ilerleyişi") +
      row('<svg class="sw-line" viewBox="0 0 27 18"><path d="M1 7.5h15V3l10 6-10 6v-4.5H1z" style="fill:var(--a-E)"/></svg>', "İtilaf ilerleyişi");
    if ((st.lines || []).indexOf("rail_bb") >= 0) h += row('<svg class="sw-line" viewBox="0 0 27 18"><path d="M1 9h25" style="stroke:var(--border)" stroke-width="4"/><path d="M1 9h25" style="stroke:var(--halo)" stroke-width="1.8" stroke-dasharray="4 4"/></svg>', "Demiryolu");
  }
  h += '<div class="lg-sec">Olaylar</div>' + row('<i class="sw" style="background:var(--mk-C);border-radius:50%;width:.95rem;height:.95rem"></i>', "İttifak başarısı") +
    row('<i class="sw" style="background:var(--mk-E);border-radius:50%;width:.95rem;height:.95rem"></i>', "İtilaf başarısı") +
    row('<i class="sw" style="background:var(--mk-N);border-radius:50%;width:.95rem;height:.95rem"></i>', "Diğer olaylar");
  lgBody.innerHTML = h;
  function row(a, b) { return '<div class="lg-row">' + a + "<span>" + b + "</span></div>"; }
}
$("#lgHd").addEventListener("click", function () {
  var lg = $("#legend"), shut = !lg.classList.contains("shut");
  lg.classList.toggle("shut", shut);
  this.setAttribute("aria-expanded", String(!shut));
  store.set("legendShut", shut);
  collide();
});
if (store.get("legendShut", window.innerHeight < 820)) { $("#legend").classList.add("shut"); $("#lgHd").setAttribute("aria-expanded", "false"); }

/* ================================================================ sunum modu altyazısı */
function renderCaption() {
  var c = $("#caption");
  if (!document.body.classList.contains("present") || S.quiz) { c.hidden = true; return; }
  var st = ST[S.st];
  c.innerHTML = "<h3>" + esc(st.t) + "</h3><p>" + st.lede + "</p>";
  c.hidden = false;
}
$("#bPanel").addEventListener("click", function () { togglePresent(); });
var lgPresent = null;
function togglePresent(force) {
  var on = force != null ? force : !document.body.classList.contains("present");
  if (on === document.body.classList.contains("present")) return;
  document.body.classList.toggle("present", on);
  /* sunumda altyazıya yer açmak için lejant kapanır; sunumdan çıkınca eski hâline döner */
  var lg = $("#legend");
  if (on) { lgPresent = lg.classList.contains("shut"); lg.classList.add("shut"); }
  else if (lgPresent === false) lg.classList.remove("shut");
  $("#lgHd").setAttribute("aria-expanded", String(!lg.classList.contains("shut")));
  $("#bPanel").setAttribute("aria-pressed", String(on));
  $("#bPanel span").textContent = on ? "Panel" : "Sunum";
  requestAnimationFrame(function () { onResize(true); renderCaption(); });
}

/* ================================================================ hareketler */
var ptrs = {}, gst = null, lastTap = null, wheelT = 0, wheelV = null;
function curRect() { return stage.getBoundingClientRect(); }
function composeView(base, s, dx, dy) { return {k: base.k * s, tx: s * base.tx + dx, ty: s * base.ty + dy}; }
function showGesture(v) {   /* önerilen görünümü sınırlara oturt, CSS ile göster */
  var c = clampView(v);
  cam.style.transition = "none";
  cam.style.transform = relTransform(c);
  gst.v = c;
}
stage.addEventListener("pointerdown", function (e) {
  if (e.target.closest(".zoom,.legend,.quiz,.penbar,.caption,.stamp")) return;
  if (e.pointerType === "mouse" && e.button !== 0) return;
  e.preventDefault();
  finishFly();
  try { stage.setPointerCapture(e.pointerId); } catch (x) {}
  var r = curRect();
  ptrs[e.pointerId] = {x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now()};
  var ids = Object.keys(ptrs);
  if (S.pen && ids.length === 1) { penStart(e); gst = {type: "draw"}; return; }
  if (gst && gst.type === "draw") penCancel();
  rebase();
});
function rebase() {
  var ids = Object.keys(ptrs);
  var base = gst && gst.v ? gst.v : view;
  if (ids.length === 0) { gst = null; return; }
  if (ids.length === 1) {
    var p = ptrs[ids[0]];
    gst = {type: "pan", base: base, x0: p.x, y0: p.y, moved: gst ? gst.moved || gst.type !== "tap" : false, v: base, t0: performance.now(), hist: [[p.x, p.y, performance.now()]]};
    if (!gst.moved) gst.type = "tap";
  } else {
    var a = ptrs[ids[0]], b = ptrs[ids[1]];
    gst = {type: "pinch", base: base, a0: [a.x, a.y], b0: [b.x, b.y], d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, moved: true, v: base};
  }
}
stage.addEventListener("pointermove", function (e) {
  var p = ptrs[e.pointerId];
  if (!p) { if (!gst && e.pointerType === "mouse") stage.classList.add("grab"); return; }
  var r = curRect();
  p.x = e.clientX - r.left; p.y = e.clientY - r.top;
  if (!gst) return;
  if (gst.type === "draw") { penMove(e); return; }
  if (gst.type === "tap" || gst.type === "pan") {
    var dx = p.x - gst.x0, dy = p.y - gst.y0;
    if (gst.type === "tap" && Math.hypot(dx, dy) < 9 * RF) return;
    if (gst.type === "tap") { gst.type = "pan"; gst.moved = true; stage.classList.add("drag"); }
    gst.hist.push([p.x, p.y, performance.now()]);
    if (gst.hist.length > 6) gst.hist.shift();
    showGesture(composeView(gst.base, 1, dx, dy));
  } else if (gst.type === "pinch") {
    var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]];
    var s = (Math.hypot(a.x - b.x, a.y - b.y) || 1) / gst.d0;
    var c0x = (gst.a0[0] + gst.b0[0]) / 2, c0y = (gst.a0[1] + gst.b0[1]) / 2;
    var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    s = clamp(gst.base.k * s, kMin(), kMax()) / gst.base.k;
    showGesture(composeView(gst.base, s, cx - s * c0x, cy - s * c0y));
  }
});
function endPtr(e, cancel) {
  var p = ptrs[e.pointerId];
  if (!p) return;
  delete ptrs[e.pointerId];
  stage.classList.remove("drag");
  if (!gst) return;
  if (gst.type === "draw") { penEnd(); gst = null; return; }
  var ids = Object.keys(ptrs);
  if (ids.length) { rebase(); return; }
  if (gst.type === "tap" && !cancel) {
    var now = performance.now();
    var r = curRect(), cx = p.x + r.left, cy = p.y + r.top;
    if (lastTap && now - lastTap.t < 330 && Math.hypot(lastTap.x - cx, lastTap.y - cy) < 45 * RF && !S.quiz) {
      lastTap = null;
      zoomAt(2, cx, cy, true);
    } else {
      lastTap = {t: now, x: cx, y: cy};
      onTap(cx, cy);
    }
    gst = null;
    return;
  }
  if (gst.type === "pan" && gst.hist.length > 2 && motionOK()) {
    var h0 = gst.hist[0], h1 = gst.hist[gst.hist.length - 1], dt = h1[2] - h0[2];
    var vx = (h1[0] - h0[0]) / Math.max(dt, 1), vy = (h1[1] - h0[1]) / Math.max(dt, 1);
    if (dt < 140 && Math.hypot(vx, vy) > 0.45) {   /* savurma: kısa bir kayma */
      var v = gst.v, T = 260;
      var tgt = clampView({k: v.k, tx: v.tx + vx * T * .9, ty: v.ty + vy * T * .9});
      gst = null;
      finishFly();
      cam.style.transition = "transform " + (T + 120) + "ms cubic-bezier(.15,.7,.25,1)";
      cam.style.transform = relTransform(tgt);
      flyEnd = function () { commit(tgt); };
      flyTimer = setTimeout(finishFly, T + 140);
      return;
    }
  }
  var v2 = gst.v || view;
  gst = null;
  commit(v2);
}
stage.addEventListener("pointerup", function (e) { endPtr(e, false); });
stage.addEventListener("pointercancel", function (e) { endPtr(e, true); });
stage.addEventListener("lostpointercapture", function (e) { if (ptrs[e.pointerId]) endPtr(e, true); });
stage.addEventListener("pointerleave", function () { stage.classList.remove("grab"); });
/* akıllı tahtada uzun basış sağ tık menüsü açmasın */
document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
stage.addEventListener("dragstart", function (e) { e.preventDefault(); });
/* tekerlek / dokunmatik yüzey: CSS ile anında ölçekle, durunca işle */
stage.addEventListener("wheel", function (e) {
  e.preventDefault();
  if (S.pen && gst) return;
  if (flyEnd) finishFly();
  var dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * 400 : e.deltaY;
  var f = Math.exp(-dy * (e.ctrlKey ? 0.01 : 0.0022));
  var base = wheelV || view;
  var r = curRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  var k = clamp(base.k * f, kMin(), kMax()), s = k / base.k;
  wheelV = clampView({k: k, tx: x - s * (x - base.tx), ty: y - s * (y - base.ty)});
  cam.style.transition = "none";
  cam.style.transform = relTransform(wheelV);
  clearTimeout(wheelT);
  wheelT = setTimeout(function () { var v = wheelV; wheelV = null; commit(v); }, 170);
}, {passive: false});

$("#zIn").addEventListener("click", function () { var r = curRect(); zoomAt(1.6, r.left + SW / 2, r.top + SH / 2, true); });
$("#zOut").addEventListener("click", function () { var r = curRect(); zoomAt(1 / 1.6, r.left + SW / 2, r.top + SH / 2, true); });
$("#zHome").addEventListener("click", function () {
  var f = S.mode === "cephe" && S.front ? D.F.filter(function (x) { return x.id === S.front; })[0] : null;
  flyTo(f ? fitLL(f.view, .02) : stageView(ST[S.st].view));
});

/* --- dokunma: işaret, toprak ya da boşluk --- */
function mapXY(cx, cy) {
  var r = curRect();
  return [(cx - r.left - view.tx) / view.k, (cy - r.top - view.ty) / view.k];
}
function zoneAt(cx, cy) {
  var m = mapXY(cx, cy), found = null;
  $$("#gZ path").forEach(function (p) {
    if (found) return;
    try {
      var pt = svB.createSVGPoint(); pt.x = m[0]; pt.y = m[1];
      if (p.isPointInFill(pt)) found = p.getAttribute("data-z");
    } catch (e) {}
  });
  return found;
}
var ZDESC = {W14: "Alman işgali altında", W18S: "Alman işgali altında", W18: "Ateşkes anında Alman ordusunun elinde",
  E14C: "Alman işgali altında", E14R: "Rus işgali altında", E15: "Alman ve Avusturya-Macaristan işgali altında",
  E16: "Alman ve Avusturya-Macaristan işgali altında", E17: "Alman ve Avusturya-Macaristan işgali altında",
  E18: "Brest-Litovsk’tan sonra Alman denetiminde", SRB15: "İttifak Devletleri’nin işgali altında",
  SRB16: "İttifak Devletleri’nin işgali altında", ALBS: "İtalyan ve Fransız birliklerinin elinde",
  SAL: "İtilaf ordularının (Selanik cephesi) elinde", KAV: "Bulgar işgali altında",
  ROU16: "İttifak Devletleri’nin işgali altında", ITA17: "Alman ve Avusturya-Macaristan işgali altında",
  CAU16: "Rus işgali altında", CAU18: "Osmanlı ordusunun ilerlediği bölge", IRQ14: "İngiliz işgali altında",
  IRQ15: "İngiliz işgali altında", IRQ16: "İngiliz işgali altında", IRQ17: "İngiliz işgali altında",
  IRQ18: "İngiliz işgali altında", MSL18: "Mondros’tan sonra İngiliz işgali altında",
  PAL17: "İngiliz işgali altında", PAL18: "İngiliz ve Arap kuvvetlerinin elinde", HJZ16: "Şerif Hüseyin kuvvetlerinin elinde",
  HJZ17: "Şerif Hüseyin kuvvetlerinin elinde", ADEN15: "Osmanlı birliklerinin elinde (Lahiç)",
  SIN15: "Osmanlı birliklerinin denetiminde", RHN: "İtilaf işgali altında (Ren bölgesi)",
  mon_itilaf: "İtilaf Devletleri’nin işgali altında", mon_ing: "İngiliz işgali altında",
  mon_ingfra: "Önce İngiliz, 1919 sonundan itibaren Fransız işgali altında", mon_fra: "Fransız işgali altında",
  mon_ita: "İtalyan işgali altında", mon_yun: "Yunan işgali altında",
  sevr_bog: "Sevr’e göre: Boğazlar Komisyonu yönetimi", sevr_yun: "Sevr’e göre: Yunanistan’a",
  sevr_ita: "Sevr’e göre: İtalyan nüfuz bölgesi", sevr_fra: "Sevr’e göre: Fransız nüfuz bölgesi",
  sevr_erm: "Sevr’e göre: Ermeni devletine", sevr_kurd: "Sevr’e göre: özerk Kürt bölgesi"};
function onTap(cx, cy) {
  if (S.quiz) { quizTap(cx, cy); return; }
  var t = document.elementFromPoint(cx, cy);
  if (!t) return;
  var mk = t.closest ? t.closest(".mk") : null;
  if (mk) {
    var cl = mk.getAttribute("data-cl");
    if (cl && view.k < kMax() * .98) {   /* küme: yaklaş ve ayrıştır */
      var ids = cl.split(","), xs = 0, ys = 0;
      ids.forEach(function (id) { var o = MK.filter(function (m) { return m.id === id; })[0]; xs += o.x; ys += o.y; });
      xs /= ids.length; ys /= ids.length;
      var k2 = Math.min(kMax(), view.k * 2.4);
      flyTo({k: k2, tx: SW / 2 - k2 * xs, ty: SH / 2 - k2 * ys}, 600);
      return;
    }
    if (cl) { S.clList = cl.split(","); S.ev = null; S.unit = null; renderPanel(); return; }
    openEvent(mk.getAttribute("data-e"), false); return;
  }
  var u = t.getAttribute && t.getAttribute("data-u");
  if (!u && t.closest) { var up = t.closest("[data-u]"); if (up) u = up.getAttribute("data-u"); }
  if (u && u !== "oth") {
    S.ev = null; markSel();
    var z = zoneAt(cx, cy);
    S.tapZone = z ? ZDESC[z] || null : null;
    S.tab = "toprak";
    if (document.body.classList.contains("present")) toast((D.S[OWN[S.st][u]] || {n: ""}).n + " · " + (D.AN[u] || ""));
    selUnit(u);
    renderPanel();
    return;
  }
  if (S.unit || S.ev) { S.ev = null; S.tapZone = null; markSel(); selUnit(null); if (S.tab === "toprak") S.tab = "anlatim"; renderPanel(); }
}

/* ================================================================ kalem */
var PEN = {color: "#d1301c", w: 5, strokes: [], cur: null};
var PCOL = [["#d1301c", "Kırmızı"], ["#1f5fa8", "Mavi"], ["#1b1b1b", "Siyah"], ["#f2b705", "Sarı"]];
function penUI(on) {
  var bar = $("#penbar");
  document.body.classList.toggle("pen", on);
  S.pen = on ? PEN : null;
  $("[data-tool=kalem]").setAttribute("aria-pressed", String(on));
  if (!on) { bar.hidden = true; return; }
  bar.innerHTML = PCOL.map(function (c) {
    return '<button class="pb" data-col="' + c[0] + '" aria-label="' + c[1] + '" aria-pressed="' + (PEN.color === c[0]) + '"><span class="dot" style="background:' + c[0] + '"></span></button>';
  }).join("") + '<div class="pb-sep"></div>' +
    '<button class="pb" data-w="3" aria-label="İnce" aria-pressed="' + (PEN.w === 3) + '"><span class="thin"></span></button>' +
    '<button class="pb" data-w="7" aria-label="Kalın" aria-pressed="' + (PEN.w === 7) + '"><span class="thick"></span></button>' +
    '<div class="pb-sep"></div><button class="pb" data-act="undo" aria-label="Geri al"><svg><use href="#i-undo"/></svg></button>' +
    '<button class="pb" data-act="clear" aria-label="Hepsini sil"><svg><use href="#i-trash"/></svg></button>' +
    '<button class="pb" data-act="close" aria-label="Kalemi kapat"><svg><use href="#i-close"/></svg></button>';
  bar.hidden = false;
  /* ortada; yıl damgasının üstüne binerse sağa, sığmazsa damganın altına */
  bar.style.left = ""; bar.style.top = "";
  var sr = stage.getBoundingClientRect(), br = bar.getBoundingClientRect(), sp = $("#stamp").getBoundingClientRect();
  var gap = 12 * RF, need = sp.right - sr.left + gap;
  if (br.left - sr.left < need) {
    if (need + br.width <= SW - gap) bar.style.left = (need + br.width / 2) + "px";
    else bar.style.top = (sp.bottom - sr.top + gap) + "px";
  }
}
$("#penbar").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-col")) PEN.color = b.getAttribute("data-col");
  else if (b.hasAttribute("data-w")) PEN.w = +b.getAttribute("data-w");
  else if (b.getAttribute("data-act") === "undo") { var s = PEN.strokes.pop(); if (s) s.el.parentNode.removeChild(s.el); }
  else if (b.getAttribute("data-act") === "clear") { PEN.strokes.forEach(function (s) { s.el.parentNode.removeChild(s.el); }); PEN.strokes = []; }
  else if (b.getAttribute("data-act") === "close") { penUI(false); return; }
  penUI(true);
});
var penRaf = 0;
function penStart(e) {
  var m = mapXY(e.clientX, e.clientY);
  var p = el("path", {style: "stroke:" + PEN.color + ";stroke-width:" + (PEN.w * RF / view.k).toFixed(3)}, iz);
  PEN.cur = {el: p, pts: [m], w: PEN.w, color: PEN.color};
}
function penMove(e) {
  if (!PEN.cur) return;
  var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  if (!list.length) list = [e];
  list.forEach(function (ev) { PEN.cur.pts.push(mapXY(ev.clientX, ev.clientY)); });
  if (!penRaf) penRaf = requestAnimationFrame(function () { penRaf = 0; if (PEN.cur) PEN.cur.el.setAttribute("d", penD(PEN.cur.pts)); });
}
function penD(pts) {
  if (pts.length === 1) return "M" + pts[0][0].toFixed(2) + " " + pts[0][1].toFixed(2) + "l0.01 0";
  var s = "M" + pts[0][0].toFixed(2) + " " + pts[0][1].toFixed(2);
  for (var i = 1; i < pts.length - 1; i++) {
    var mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    s += "Q" + pts[i][0].toFixed(2) + " " + pts[i][1].toFixed(2) + " " + mx.toFixed(2) + " " + my.toFixed(2);
  }
  var l = pts[pts.length - 1];
  return s + "L" + l[0].toFixed(2) + " " + l[1].toFixed(2);
}
function penEnd() {
  if (!PEN.cur) return;
  PEN.cur.el.setAttribute("d", penD(PEN.cur.pts));
  PEN.cur.k = view.k;
  PEN.strokes.push(PEN.cur); PEN.cur = null;
}
function penCancel() { if (PEN.cur) { PEN.cur.el.parentNode.removeChild(PEN.cur.el); PEN.cur = null; } }
function drawPen() {   /* çizgi kalınlığı ekranda sabit kalsın */
  PEN.strokes.forEach(function (s) { s.el.style.strokeWidth = (s.w * RF / view.k).toFixed(3); });
}

/* ================================================================ sınıf soruları */
var quizBox = $("#quiz");
var lgWasShut = false;
function quizOpen() {
  if (SC === "dt") exitDT();
  closePop();
  if (S.pen) penUI(false);
  S.quiz = {phase: "setup", teams: 2, n: 12, kind: "hepsi"};
  $("[data-tool=sinav]").setAttribute("aria-pressed", "true");
  document.body.classList.add("quizon");
  /* lejant cevabı ele vermesin: soru boyunca kapalı (öğretmen açabilir) */
  var lg = $("#legend");
  lgWasShut = lg.classList.contains("shut");
  lg.classList.add("shut"); $("#lgHd").setAttribute("aria-expanded", "false");
  renderCaption();
  quizRender();
}
function quizClose() {
  S.quiz = null; gQz.textContent = "";
  quizBox.hidden = true;
  document.body.classList.remove("dilsiz", "quizon");
  insetT = 0;
  flyTo(view, 400);
  $("[data-tool=sinav]").setAttribute("aria-pressed", "false");
  if (!lgWasShut) { $("#legend").classList.remove("shut"); $("#lgHd").setAttribute("aria-expanded", "true"); }
  renderCaption();
  collide();
}
function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function quizStart() {
  var Q = S.quiz, pool = D.Q.filter(function (q) { return Q.kind === "hepsi" || (Q.kind === "harita" ? q.k === "map" : q.k === "mc"); });
  Q.list = shuffle(pool.slice()).slice(0, Math.min(Q.n, pool.length));
  Q.i = 0; Q.score = [0, 0]; Q.turn = 0; Q.phase = "q"; Q.tries = 0;
  quizShow();
}
function quizShow() {
  var Q = S.quiz, q = Q.list[Q.i];
  Q.phase = "q"; Q.tries = 0; Q.res = null; Q.how = null; Q.pick = null; gQz.textContent = "";
  if (q.k === "map" && q.st !== S.st) go(q.st, {noFly: true});
  quizRender();
  /* harita sorusunda aşamanın görünümü kartın altında kalan alana sığsın */
  if (q.k === "map") flyTo(fitBoxIn(llBox(D.ST[q.st].view), freeRect()), 600);
  collide();
}
function teamsHTML() {
  var Q = S.quiz, end = Q.phase === "end";
  if (Q.teams === 1) return '<span class="team on">Puan <b>' + Q.score[0] + "</b></span>";
  /* soru sırasında sıradaki takım, sonuçta önde olan takım vurgulanır */
  var a = end ? Q.score[0] >= Q.score[1] : Q.turn === 0, b = end ? Q.score[1] >= Q.score[0] : Q.turn === 1;
  return '<span class="team' + (a ? " on" : "") + '">A takımı <b>' + Q.score[0] + '</b></span><span class="team' + (b ? " on" : "") + '">B takımı <b>' + Q.score[1] + "</b></span>";
}
function quizRender() {
  var Q = S.quiz, h = "";
  if (!Q) return;
  if (Q.phase === "setup") {
    h = '<div class="qz-top"><span class="cnt">SINIF SORULARI</span><button class="qz-x" data-q="close" aria-label="Kapat"><svg><use href="#i-close"/></svg></button></div>' +
      '<div class="qz-body qz-setup"><h3>Haritada ve seçeneklerle soru-cevap</h3><p>Harita sorularında öğrenciler doğru yere dokunur. İki takımla oynanırsa sıra her soruda değişir.</p>' +
      '<div class="seg" data-g="teams"><button data-v="1" aria-pressed="' + (Q.teams === 1) + '">Tek grup</button><button data-v="2" aria-pressed="' + (Q.teams === 2) + '">İki takım</button></div>' +
      '<div class="seg" data-g="kind"><button data-v="hepsi" aria-pressed="' + (Q.kind === "hepsi") + '">Karışık</button><button data-v="harita" aria-pressed="' + (Q.kind === "harita") + '">Yalnız harita</button><button data-v="mc" aria-pressed="' + (Q.kind === "mc") + '">Yalnız seçmeli</button></div>' +
      '<div class="seg" data-g="n"><button data-v="8" aria-pressed="' + (Q.n === 8) + '">8 soru</button><button data-v="12" aria-pressed="' + (Q.n === 12) + '">12 soru</button><button data-v="99" aria-pressed="' + (Q.n === 99) + '">Hepsi</button></div>' +
      '<div class="qz-act"><button class="btn pri" data-q="start">Başla</button></div></div>';
  } else if (Q.phase === "end") {
    var win = Q.teams === 2 ? (Q.score[0] === Q.score[1] ? "Berabere!" : (Q.score[0] > Q.score[1] ? "A takımı kazandı!" : "B takımı kazandı!")) : "Tebrikler!";
    h = '<div class="qz-top"><span class="cnt">SONUÇ</span>' + teamsHTML() + '<button class="qz-x" data-q="close" aria-label="Kapat"><svg><use href="#i-close"/></svg></button></div>' +
      '<div class="qz-body qz-end"><div class="big">' + (Q.teams === 2 ? Q.score[0] + " – " + Q.score[1] : Q.score[0] + " / " + Q.list.length) + '</div><p class="qz-q" style="margin-top:.6rem">' + win + '</p>' +
      '<div class="qz-act" style="justify-content:center"><button class="btn" data-q="close">Kapat</button><button class="btn pri" data-q="again">Yeniden oyna</button></div></div>';
  } else {
    var q = Q.list[Q.i];
    h = '<div class="qz-top"><span class="cnt">SORU ' + (Q.i + 1) + " / " + Q.list.length + "</span>" + teamsHTML() +
      '<button class="qz-x" data-q="close" aria-label="Kapat"><svg><use href="#i-close"/></svg></button></div><div class="qz-body">';
    h += '<p class="qz-q">' + esc(q.q) + "</p>";
    if (q.k === "mc") {
      h += '<div class="qz-opts">' + q.o.map(function (o, j) {
        var c = "";
        if (Q.phase === "a") c = j === q.a ? " ok" : (Q.pick === j ? " no" : "");
        return '<button class="qo' + c + '" data-o="' + j + '"' + (Q.phase === "a" ? " disabled" : "") + "><i>" + "ABCD".charAt(j) + "</i>" + esc(o) + "</button>";
      }).join("") + "</div>";
    }
    h += '<div class="qz-foot">';
    if (Q.phase === "a") {
      var cls = Q.res ? "ok" : Q.how === "wrong" ? "no" : "info";
      var head = Q.res ? "Doğru!" : (Q.how === "wrong" ? "Olmadı. " : Q.how === "skip" ? "Pas. " : "") +
        (q.k === "map" ? "Doğru yer haritada yeşille gösterildi." : "Doğru cevap: " + "ABCD".charAt(q.a) + ".");
      h += '<div class="qz-res ' + cls + '"><svg class="ic"><use href="#i-' + (Q.res ? "check" : Q.how === "wrong" ? "close" : "eye") + '"/></svg><div><b>' +
        head + "</b> " + esc(q.x) + "</div></div>";
      h += '<div class="qz-act"><button class="btn pri" data-q="next">' + (Q.i + 1 < Q.list.length ? "Sonraki soru" : "Sonucu gör") + '<svg class="ic"><use href="#i-next"/></svg></button></div>';
    } else {
      h += q.k === "map" ? '<p class="qz-hint"><svg class="ic"><use href="#i-pin"/></svg><span>' + (Q.teams === 2 ? "<b>" + (Q.turn ? "B" : "A") + " takımı:</b> " : "") +
        "haritada doğru yere dokunun." + (Q.tries ? " <b>Bir hakkınız daha var.</b>" : " <small>Yer adları gizlendi.</small>") + "</span></p>" :
        '<p class="qz-hint">' + (Q.teams === 2 ? "<b>" + (Q.turn ? "B" : "A") + " takımı</b> cevaplıyor." : "Bir seçeneğe dokunun.") + "</p>";
      h += '<div class="qz-act"><button class="btn" data-q="show"><svg class="ic"><use href="#i-eye"/></svg>Cevabı göster</button><button class="btn" data-q="skip"><svg class="ic"><use href="#i-skip"/></svg>Pas</button></div>';
    }
    h += "</div></div>";
  }
  quizBox.innerHTML = h;
  quizBox.hidden = false;
  /* harita sorusu sorulurken dilsiz harita: yer adları ve olay işaretleri gizli */
  document.body.classList.toggle("dilsiz", Q.phase === "q" && Q.list[Q.i].k === "map");
  insetT = Math.max(0, quizBox.getBoundingClientRect().bottom - stage.getBoundingClientRect().top + 8 * RF);
}
quizBox.addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b || !S.quiz) return;
  var Q = S.quiz, a = b.getAttribute("data-q");
  var seg = b.parentNode.getAttribute && b.parentNode.getAttribute("data-g");
  if (seg) { var v = b.getAttribute("data-v"); Q[seg] = seg === "kind" ? v : +v; quizRender(); return; }
  if (a === "close") return quizClose();
  if (a === "start" || a === "again") { Q.phase = "setup"; return quizStart(); }
  if (a === "next") { Q.i++; if (Q.teams === 2) Q.turn = 1 - Q.turn; if (Q.i >= Q.list.length) { Q.phase = "end"; gQz.textContent = ""; return quizRender(); } return quizShow(); }
  if (a === "show" || a === "skip") { quizAnswer(false, null, a); return; }
  if (b.hasAttribute("data-o")) {
    var j = +b.getAttribute("data-o"), q = Q.list[Q.i];
    Q.pick = j;
    quizAnswer(j === q.a, null, "wrong");
  }
});
function quizAnswer(ok, tap, how) {
  var Q = S.quiz, q = Q.list[Q.i];
  if (ok) Q.score[Q.teams === 2 ? Q.turn : 0]++;
  Q.res = ok; Q.phase = "a"; Q.how = ok ? "ok" : how;
  if (q.k === "map") showAnswer(q, tap, ok);
  quizRender();
  if (q.k === "map") revealAnswer(q, ok ? null : tap);
  collide();
}
function isAnswer(q, u) { return q.a.u ? q.a.u.indexOf(u) >= 0 : q.a.s ? q.a.s.indexOf(OWN[S.st][u]) >= 0 : false; }
function showAnswer(q, tap, ok) {
  gQz.textContent = "";
  var s = RF / view.k;
  Object.keys(UP).forEach(function (u) { if (isAnswer(q, u)) el("path", {d: G.units[u], "class": "qz-ok"}, gQz); });
  if (q.a.c) q.a.c.forEach(function (c) {
    var xy = proj(c[0], c[1]);
    el("circle", {cx: xy[0], cy: xy[1], r: c[2], "class": "qz-ok"}, gQz);
  });
  if (tap && !ok) el("circle", {cx: tap[0], cy: tap[1], r: 16 * s, "class": "qz-no"}, gQz);
}
/* cevap (ve yanlış dokunuş) kartın altında görünmüyorsa oraya kay */
function revealAnswer(q, tap) {
  var B = [Infinity, Infinity, -Infinity, -Infinity];
  function add(x0, y0, x1, y1) { B[0] = Math.min(B[0], x0); B[1] = Math.min(B[1], y0); B[2] = Math.max(B[2], x1); B[3] = Math.max(B[3], y1); }
  Object.keys(UP).forEach(function (u) {
    if (!isAnswer(q, u)) return;
    try { var b = UP[u].getBBox(); add(b.x, b.y, b.x + b.width, b.y + b.height); } catch (e) {}
  });
  if (q.a.c) q.a.c.forEach(function (c) { var xy = proj(c[0], c[1]); add(xy[0] - c[2], xy[1] - c[2], xy[0] + c[2], xy[1] + c[2]); });
  if (tap) add(tap[0], tap[1], tap[0], tap[1]);
  if (!isFinite(B[0])) return;
  var r = freeRect(), m = 30 * RF;
  var sx0 = B[0] * view.k + view.tx, sy0 = B[1] * view.k + view.ty, sx1 = B[2] * view.k + view.tx, sy1 = B[3] * view.k + view.ty;
  if (sx0 >= r.x0 && sy0 >= r.y0 && sx1 <= r.x1 && sy1 <= r.y1) return;
  var pw = (B[2] - B[0]) * .12 + 40, ph = (B[3] - B[1]) * .12 + 40;
  flyTo(fitBoxIn([B[0] - pw, B[1] - ph, B[2] + pw, B[3] + ph], {x0: r.x0 + m, y0: r.y0 + m, x1: r.x1 - m, y1: r.y1 - m}, kMin() * 6), 650);
}
function quizTap(cx, cy) {
  var Q = S.quiz;
  if (!Q || Q.phase !== "q") return;
  var q = Q.list[Q.i];
  if (q.k !== "map") return;
  var m = mapXY(cx, cy), ok = false;
  if (q.a.c) q.a.c.forEach(function (c) { var xy = proj(c[0], c[1]); if (Math.hypot(m[0] - xy[0], m[1] - xy[1]) <= c[2]) ok = true; });
  if (!ok && (q.a.u || q.a.s)) {
    var t = document.elementFromPoint(cx, cy), u = t && t.getAttribute ? t.getAttribute("data-u") : null;
    if (u) ok = isAnswer(q, u);
  }
  if (ok) { quizAnswer(true, m); return; }
  Q.tries++;
  var s = RF / view.k;
  el("circle", {cx: m[0], cy: m[1], r: 16 * s, "class": "qz-no"}, gQz);
  if (Q.tries >= 2) quizAnswer(false, m, "wrong");
  else { quizRender(); toast("Olmadı — bir kez daha deneyin"); }
}

/* ================================================================ örtü sayfalar */
var sheet = $("#sheet"), shBody = $("#shBody"), lastFocus = null;
function openSheet(kind) {
  closePop();
  lastFocus = document.activeElement;
  if (kind === "kisiler") {
    $("#shTitle").textContent = "Kişiler";
    var h = '<div class="sh-scroll" id="shScroll">';
    [["osm", "Osmanlı Devleti"], ["dunya", "Dünya"]].forEach(function (g) {
      h += '<h3 class="pg-sec">' + g[1] + '</h3><div class="pgrid">';
      D.P.forEach(function (p, i) {
        if (p.g !== g[0]) return;
        h += '<button class="pc g-' + g[0] + '" data-pi="' + i + '" aria-pressed="false"><span class="mono">' + esc(initials(p.n)) + '</span><span><b>' + esc(p.n) + "</b><small>" + esc(p.y) + '</small><span class="role">' + esc(p.r) + "</span></span></button>";
      });
      h += "</div>";
    });
    shBody.innerHTML = h + '</div><aside class="pdet" id="pDet" aria-live="polite"></aside>';
    showPerson(0);
  } else if (kind === "notlar") {
    $("#shTitle").textContent = "Ders notu";
    var nav = D.N.map(function (n, i) { return '<button role="tab" data-n="' + i + '" aria-selected="' + (i === 0) + '">' + esc(n.h) + "</button>"; }).join("");
    shBody.innerHTML = '<nav class="sh-nav" role="tablist">' + nav + '</nav><div class="sh-scroll note" id="shScroll"></div>';
    showNote(0);
  }
  sheet.hidden = false;
  $$("#shScroll, #pDet, .sh-nav", shBody).forEach(dragScroll);
  $("#shX").focus();
}
function initials(n) {
  return n.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(function (w) { return /^[A-ZÇĞİÖŞÜ]/.test(w); })
    .slice(0, 2).map(function (w) { return w.charAt(0); }).join("");
}
function showPerson(i) {   /* kişi ayrıntısı sağdaki bölmede */
  var p = D.P[i], d = $("#pDet");
  if (!p || !d) return;
  $$(".pc", shBody).forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-pi") === i)); });
  d.innerHTML = '<div class="pd-hd"><span class="mono g-' + p.g + '">' + esc(initials(p.n)) + '</span><div><h3>' + esc(p.n) + "</h3><small>" + esc(p.y) + "</small></div></div>" +
    '<p class="role">' + esc(p.r) + '</p><div class="pd-tx">' + p.tx + "</div>" +
    (p.ev.length ? '<h4 class="p-h3">Haritada göster</h4><div class="links">' + p.ev.map(function (id) {
      return D.E[id] ? '<button class="chip" data-go="' + id + '"><svg><use href="#i-pin"/></svg>' + esc(D.E[id].n) + "</button>" : "";
    }).join("") + "</div>" : "");
  d.scrollTop = 0;
}
function showNote(i) {
  var n = D.N[i];
  $$(".sh-nav button", shBody).forEach(function (b, j) { b.setAttribute("aria-selected", String(j === i)); });
  var sc = $("#shScroll");
  sc.innerHTML = "<h3>" + esc(n.h) + "</h3>" + n.html;
  sc.scrollTop = 0;
}
function closeSheet() { sheet.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
$("#shX").addEventListener("click", closeSheet);
sheet.addEventListener("click", function (e) {
  if (e.target === sheet) return closeSheet();
  var nb = e.target.closest(".sh-nav button");
  if (nb) return showNote(+nb.getAttribute("data-n"));
  var go2 = e.target.closest("[data-go]");
  if (go2) { closeSheet(); setMode("anlatim"); openEvent(go2.getAttribute("data-go")); return; }
  var pc = e.target.closest(".pc");
  if (pc) showPerson(+pc.getAttribute("data-pi"));
});

/* ================================================================ açılır menüler */
var pop = $("#pop"), popFor = null;
var LAYERS = [["events", "Olay işaretleri"], ["fronts", "Cephe hatları"], ["arrows", "Hareket okları"],
  ["zones", "İşgal bölgeleri"], ["cities", "Şehirler"], ["labels", "Yer adları"], ["relief", "Arazi kabartması"],
  ["rails", "Demiryolları"], ["rivers", "Irmaklar ve göller"], ["grat", "Koordinat ağı"]];
function openPop(kind, btn) {
  if (popFor === kind) return closePop();
  popFor = kind;
  var h = "";
  if (kind === "katman") {
    h = "<h3>Katmanlar</h3>" + LAYERS.map(function (l) {
      return '<button class="sw-row" role="switch" data-l="' + l[0] + '" aria-checked="' + !!S.layers[l[0]] + '"><span>' + l[1] + '</span><i class="tog"></i></button>';
    }).join("");
  } else {
    var th = document.documentElement.getAttribute("data-theme") || "auto";
    var fs = +store.get("fs", 1);
    h = '<h3>Tema</h3><div class="seg" data-g="theme"><button data-v="auto" aria-pressed="' + (th === "auto") + '">Otomatik</button><button data-v="light" aria-pressed="' + (th === "light") + '">Gündüz</button><button data-v="dark" aria-pressed="' + (th === "dark") + '">Gece</button></div>' +
      '<h3>Yazı boyutu</h3><div class="seg" data-g="fs"><button data-v="0.85" aria-pressed="' + (fs === 0.85) + '">Küçük</button><button data-v="1" aria-pressed="' + (fs === 1) + '">Normal</button><button data-v="1.18" aria-pressed="' + (fs === 1.18) + '">Büyük</button><button data-v="1.36" aria-pressed="' + (fs === 1.36) + '">Çok büyük</button></div>' +
      '<button class="sw-row" role="switch" data-m="motion" aria-checked="' + !reduceMotion + '"><span>Geçiş animasyonları</span><i class="tog"></i></button>' +
      '<h3 style="margin-top:.9rem">Klavye ve kumanda</h3><div class="kbd"><kbd>← →</kbd><span>Önceki / sonraki aşama (sunum kumandası da çalışır)</span><kbd>+ −</kbd><span>Yakınlaştır / uzaklaştır</span><kbd>0</kbd><span>Aşamanın görünümü</span><kbd>P</kbd><span>Sunum (paneli gizle)</span><kbd>F</kbd><span>Tam ekran</span><kbd>C K N S D</kbd><span>Cepheler · Kişiler · Ders notu · Soru · Kalem</span><kbd>Esc</kbd><span>Kapat / geri</span></div>' +
      '<p class="hint">Coğrafi taban: Natural Earth (kamu malı). Kabartma ve Çanakkale ayrıntısı: Tilezen/Mapzen arazi verisi (SRTM, GMTED2010, ETOPO1). Yazı tipleri: Atkinson Hyperlegible Next, Source Serif 4, Barlow Condensed (SIL OFL). Dönem sınırları, cephe hatları ve konumlar ders anlatımı için şematiktir.</p>';
  }
  pop.innerHTML = h;
  pop.hidden = false;
  var r = btn.getBoundingClientRect(), tr = $("#tl").getBoundingClientRect(), lim = window.innerHeight - 8;
  if (tr.top > r.top) lim = Math.min(lim, tr.top - 8);
  pop.style.maxHeight = Math.max(200, lim - 8) + "px";
  pop.style.top = clamp(r.top, 8, lim - pop.offsetHeight) + "px";
  $$("[data-pop]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
}
function closePop() { pop.hidden = true; popFor = null; $$("[data-pop]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); }); }
pop.addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-l")) {
    var k = b.getAttribute("data-l");
    S.layers[k] = S.layers[k] ? 0 : 1;
    store.set("layers", S.layers);
    b.setAttribute("aria-checked", String(!!S.layers[k]));
    applyLayers(true);
    return;
  }
  if (b.getAttribute("data-m") === "motion") {
    reduceMotion = !reduceMotion; store.set("reduceMotion", reduceMotion);
    b.setAttribute("aria-checked", String(!reduceMotion)); return;
  }
  var g = b.parentNode.getAttribute("data-g");
  if (g === "theme") {
    var v = b.getAttribute("data-v");
    if (v === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", v);
    store.set("theme", v);
    setDRelief();
    $$("button", b.parentNode).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
  } else if (g === "fs") {
    var f = +b.getAttribute("data-v");
    document.documentElement.style.setProperty("--fs", f);
    store.set("fs", f);
    $$("button", b.parentNode).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    requestAnimationFrame(function () { onResize(true); fsVer++; measureLabels(); lastK = -1; commit(view); });
  }
});
document.addEventListener("pointerdown", function (e) {
  if (!pop.hidden && !e.target.closest("#pop") && !e.target.closest("[data-pop]")) closePop();
}, true);
function applyLayers(redraw) {
  relief.style.display = S.layers.relief ? "" : "none";
  if (dRel) dRel.style.display = S.layers.relief ? "" : "none";
  gRiv.style.display = S.layers.rivers ? "" : "none";
  gGrat.style.display = S.layers.grat ? "" : "none";
  gLbl.style.display = S.layers.labels && SC === "main" ? "" : "none";
  gDL.style.display = S.layers.labels && SC === "dt" ? "" : "none";
  if (redraw) { drawStage(S.st); lastK = -1; commit(view); }
}

/* ================================================================ modlar ve araç çubuğu */
function setMode(m, quiet) {
  S.mode = m;
  $$("[data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
  if (m === "cephe") { S.tab = "cephe"; } else { S.front = null; if (S.tab === "cephe") S.tab = "anlatim"; }
  if (document.body.classList.contains("present")) togglePresent(false);
  if (!quiet) { S.ev = null; markSel(); renderPanel(); }
}
$("#rail").addEventListener("click", function (e) {
  var b = e.target.closest("button");
  if (!b) return;
  if (b.hasAttribute("data-mode")) {
    var m = b.getAttribute("data-mode");
    if (SC === "dt") { exitDT(m === "cephe" ? "cephe" : null); return; }
    setMode(m); if (m === "anlatim") flyTo(fitLL(D.ST[S.st].view, .02));
    return;
  }
  if (b.hasAttribute("data-sheet")) return openSheet(b.getAttribute("data-sheet"));
  if (b.hasAttribute("data-pop")) return openPop(b.getAttribute("data-pop"), b);
  var tool = b.getAttribute("data-tool");
  if (tool === "sinav") return S.quiz ? quizClose() : quizOpen();
  if (tool === "kalem") { if (S.quiz) quizClose(); penUI(!S.pen); return; }
  if (b.id === "bFull") toggleFull();
});
function toggleFull() {
  var d = document, de = d.documentElement;
  var fs = d.fullscreenElement || d.mozFullScreenElement;
  if (fs) (d.exitFullscreen || d.mozCancelFullScreen).call(d);
  else { var rq = de.requestFullscreen || de.mozRequestFullScreen; if (rq) { var pr = rq.call(de); if (pr && pr.catch) pr.catch(function () {}); } }
}
function onFull() {
  var on = !!(document.fullscreenElement || document.mozFullScreenElement);
  var b = $("#bFull");
  b.querySelector("use").setAttribute("href", on ? "#i-unfull" : "#i-full");
  b.querySelector("span").textContent = on ? "Çık" : "Tam ekran";
}
document.addEventListener("fullscreenchange", onFull);
document.addEventListener("mozfullscreenchange", onFull);

/* ================================================================ bildirim */
var toastT = 0;
function toast(msg) {
  var t = $("#toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT);
  toastT = setTimeout(function () { t.classList.remove("on"); }, 1800);
}

/* ================================================================ klavye */
document.addEventListener("keydown", function (e) {
  if (e.altKey || e.metaKey || (e.ctrlKey && e.key !== "0")) return;
  var k = e.key;
  if (k === "Escape") {
    if (!pop.hidden) return closePop();
    if (!sheet.hidden) return closeSheet();
    if (S.quiz) return quizClose();
    if (S.pen) return penUI(false);
    if (S.ev || S.unit) { S.ev = null; S.unit = null; S.tapZone = null; markSel(); selUnit(null); if (S.tab === "toprak") S.tab = "anlatim"; return renderPanel(); }
    if (SC === "dt") return exitDT();
    if (document.body.classList.contains("present")) return togglePresent(false);
    return;
  }
  if (!sheet.hidden) return;
  var r = curRect();
  if (k === "ArrowRight" || k === "PageDown" || k === " ") { e.preventDefault(); go(S.st + 1); }
  else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); go(S.st - 1); }
  else if (k === "Home") go(0);
  else if (k === "End") go(ST.length - 1);
  else if (k === "+" || k === "=") zoomAt(1.6, r.left + SW / 2, r.top + SH / 2, true);
  else if (k === "-" || k === "_") zoomAt(1 / 1.6, r.left + SW / 2, r.top + SH / 2, true);
  else if (k === "0") flyTo(stageView(ST[S.st].view));
  else if (k === "p" || k === "P") togglePresent();
  else if (k === "f" || k === "F") toggleFull();
  else if (k === "c" || k === "C") { if (SC === "dt") exitDT("cephe"); else setMode("cephe"); }
  else if (k === "a" || k === "A") { if (SC === "dt") exitDT(); else setMode("anlatim"); }
  else if (k === "k" || k === "K") openSheet("kisiler");
  else if (k === "n" || k === "N") openSheet("notlar");
  else if (k === "s" || k === "S") S.quiz ? quizClose() : quizOpen();
  else if (k === "d" || k === "D") penUI(!S.pen);
  else if (k === "l" || k === "L") openPop("katman", $("[data-pop=katman]"));
});

/* ================================================================ yeniden boyutlandırma */
var rzT = 0;
function onResize(now) {
  clearTimeout(rzT);
  var run = function () {
    var cx = (SW / 2 - view.tx) / view.k, cy = (SH / 2 - view.ty) / view.k, rel = view.k / kMin();
    layoutSV();
    var k = rel * kMin();
    lastK = -1;
    commit({k: k, tx: SW / 2 - k * cx, ty: SH / 2 - k * cy});
    updPanelNav();
  };
  if (now === true) run(); else rzT = setTimeout(run, 120);
}
window.addEventListener("resize", onResize);

/* ================================================================ başlat */
(function init() {
  var th = store.get("theme", "auto");
  if (th === "light" || th === "dark") document.documentElement.setAttribute("data-theme", th);
  var fs = +store.get("fs", 1);
  if (fs !== 1) document.documentElement.style.setProperty("--fs", fs);
  reduceMotion = !!store.get("reduceMotion", false);
  layoutSV();
  applyLayers(false);
  S.st = -1;
  view = {k: kMin(), tx: 0, ty: 0};
  go(0, {noFly: true, force: true});
  commit(fitLL(D.ST[0].view, .02));
  markTimeline();
  measureLabels(); commit(view);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { fsVer++; measureLabels(); lastK = -1; commit(view); });
  /* çevrimdışı kullanım: bir kez açıldıktan sonra internet olmadan da çalışır */
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
  window.WW1 = {go: go, view: function () { return view; }, S: S, openEvent: openEvent, openFront: openFront, flyTo: flyTo, fitLL: fitLL,
    quizShow: quizShow, openDetail: openDetail, exitDT: exitDT, scene: function () { return SC; }};
})();
})();
