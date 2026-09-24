/*
 * Hollow Purple — Gojo Satoru teknik simülatörü.
 * 蒼 Mavi çeker · 赫 Kırmızı iter · 茈 Mor (ikisinin birleşimi) değdiği her şeyi siler.
 * Canvas 2D + Pointer Events + Web Audio. Kütüphane yok.
 */
(() => {
  'use strict';

  /* ═════════ yardımcılar ═════════ */
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const randi = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[(Math.random() * arr.length) | 0];
  const dist2 = (ax, ay, bx, by) => { const dx = ax - bx, dy = ay - by; return dx * dx + dy * dy; };
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOutBack = (t) => 1 + 2.9 * Math.pow(t - 1, 3) + 1.9 * Math.pow(t - 1, 2);
  const nowS = () => performance.now() / 1000;
  const $ = (id) => document.getElementById(id);
  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // titreşim yalnızca oyuncu Başla'ya dokunduktan sonra (tarayıcılar önceki çağrıları engeller)
  function buzz(pattern) { try { if (started && navigator.vibrate) navigator.vibrate(pattern); } catch (e) { /* titreşim yok */ } }

  /* ═════════ tuval ve ölçüler ═════════ */
  const canvas = $('stage');
  const ctx = canvas.getContext('2d', { alpha: false });
  let W = 0, H = 0, DPR = 1, U = 1, G = 1400, groundY = 0;
  let dprCap = Math.min(window.devicePixelRatio || 1, 2);
  let quality = 1;
  let time = 0;
  let started = false;
  let mode = 'blue';

  function measure() {
    W = Math.max(300, Math.round(window.innerWidth));
    H = Math.max(300, Math.round(window.innerHeight));
    U = Math.min(W, H) / 100; // her şey ekranın kısa kenarına göre ölçeklenir
    G = 185 * U;
    groundY = Math.round(H - Math.max(64, H * 0.1));
  }
  function applyCanvasSize() {
    DPR = dprCap;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
  }
  const flickMin = () => Math.max(420, 55 * U);
  const fuseDist = () => Math.max(95, 13 * U);

  /* ═════════ ışıma sprite'ları ═════════ */
  function sprite(stops, size) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const h = size / 2;
    const grd = g.createRadialGradient(h, h, 0, h, h, h);
    for (const s of stops) grd.addColorStop(s[0], s[1]);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }
  const rgba = (c, a) => `rgba(${c},${a})`;
  const glow = (c) => sprite([[0, rgba(c, 1)], [0.18, rgba(c, 0.62)], [0.45, rgba(c, 0.2)], [0.75, rgba(c, 0.05)], [1, rgba(c, 0)]], 128);
  const core = (c) => sprite([[0, 'rgba(255,255,255,1)'], [0.2, 'rgba(255,255,255,0.95)'], [0.36, rgba(c, 0.85)], [0.62, rgba(c, 0.25)], [1, rgba(c, 0)]], 128);
  const SPR = {
    white: glow('255,255,255'), blue: glow('40,120,255'), cyan: glow('110,210,255'),
    red: glow('255,34,44'), orange: glow('255,128,40'),
    purple: glow('150,50,255'), magenta: glow('235,60,215'), violet: glow('190,140,255'),
    green: glow('90,255,180'), sick: glow('120,255,140'),
    blueCore: core('80,170,255'), redCore: core('255,60,50'),
    smoke: sprite([[0, 'rgba(150,146,172,0.5)'], [0.5, 'rgba(110,106,132,0.22)'], [1, 'rgba(90,86,110,0)']], 64),
    miasma: sprite([[0, 'rgba(46,12,64,0.85)'], [0.5, 'rgba(32,6,46,0.4)'], [1, 'rgba(20,0,30,0)']], 64),
  };
  const ERASE_SPR = [SPR.violet, SPR.purple, SPR.magenta, SPR.white];
  function drawGlow(spr, x, y, r, a) {
    if (a <= 0.004 || r <= 0.3) return;
    ctx.globalAlpha = a > 1 ? 1 : a;
    ctx.drawImage(spr, x - r, y - r, r * 2, r * 2);
  }
  // zikzak şimşek yolu; çağıran stroke eder
  function bolt(x1, y1, x2, y2, segs, jag) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < segs; i++) {
      const t = i / segs, off = (Math.random() * 2 - 1) * jag * Math.sin(Math.PI * t);
      ctx.lineTo(x1 + dx * t + nx * off, y1 + dy * t + ny * off);
    }
    ctx.lineTo(x2, y2);
  }

  /* ═════════ arka plan: gökyüzü, ay, uzak siluet, yol ═════════ */
  const bg = document.createElement('canvas');
  const vig = document.createElement('canvas');
  let twinkles = [];
  let hazeGrad = null;

  function skyline(g, col, maxFrac, winCol, winChance) {
    const s = Math.max(1.5, U * 0.42);
    let x = -rand(0, 30);
    while (x < W) {
      const w = rand(3, 9) * U, h = rand(0.08, maxFrac) * groundY;
      g.fillStyle = col;
      g.fillRect(x, groundY - h, w, h);
      if (Math.random() < 0.3) g.fillRect(x + w * 0.45, groundY - h - U * 2.5, Math.max(1, U * 0.25), U * 2.5);
      g.fillStyle = winCol;
      for (let yy = groundY - h + s * 2; yy < groundY - s * 2; yy += s * 2.4) {
        for (let xx = x + s; xx < x + w - s; xx += s * 2.2) if (Math.random() < winChance) g.fillRect(xx, yy, s, s);
      }
      x += w + rand(0, 1.4) * U;
    }
  }

  function buildBackground() {
    bg.width = canvas.width;
    bg.height = canvas.height;
    const g = bg.getContext('2d');
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    const sky = g.createLinearGradient(0, 0, 0, groundY);
    sky.addColorStop(0, '#020208');
    sky.addColorStop(0.45, '#070919');
    sky.addColorStop(0.8, '#141030');
    sky.addColorStop(1, '#261947');
    g.fillStyle = sky;
    g.fillRect(0, 0, W, groundY);

    const n = Math.round((W * groundY) / 4200);
    for (let i = 0; i < n; i++) {
      const x = Math.random() * W, y = Math.random() * groundY * 0.78;
      const s = Math.random() < 0.07 ? 1.6 : Math.random() < 0.5 ? 1 : 0.7;
      g.globalAlpha = rand(0.2, 0.85) * (1 - y / groundY);
      g.fillStyle = Math.random() < 0.2 ? '#b9d2ff' : '#ffffff';
      g.fillRect(x, y, s, s);
    }
    g.globalAlpha = 1;
    twinkles = [];
    for (let i = 0; i < 40; i++) twinkles.push({ x: Math.random() * W, y: Math.random() * groundY * 0.55, s: rand(1.2, 2.2), p: rand(0, TAU), f: rand(0.7, 2.4) });

    const mx = W * 0.82, my = Math.max(96, groundY * 0.2), mr = U * 4.4;
    const halo = g.createRadialGradient(mx, my, mr * 0.9, mx, my, mr * 7);
    halo.addColorStop(0, 'rgba(176,160,255,0.22)');
    halo.addColorStop(1, 'rgba(176,160,255,0)');
    g.fillStyle = halo;
    g.fillRect(mx - mr * 7, my - mr * 7, mr * 14, mr * 14);
    const moon = g.createRadialGradient(mx - mr * 0.35, my - mr * 0.35, mr * 0.1, mx, my, mr);
    moon.addColorStop(0, '#f6f3ff');
    moon.addColorStop(1, '#c5bfe8');
    g.fillStyle = moon;
    g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
    g.fillStyle = 'rgba(110,100,160,0.22)';
    for (const [ox, oy, rr] of [[-0.3, -0.1, 0.22], [0.25, 0.3, 0.16], [0.1, -0.4, 0.12], [-0.15, 0.42, 0.1]]) {
      g.beginPath(); g.arc(mx + ox * mr, my + oy * mr, rr * mr, 0, TAU); g.fill();
    }

    const hz = g.createLinearGradient(0, groundY - H * 0.4, 0, groundY);
    hz.addColorStop(0, 'rgba(100,50,180,0)');
    hz.addColorStop(1, 'rgba(120,60,200,0.3)');
    g.fillStyle = hz;
    g.fillRect(0, groundY - H * 0.4, W, H * 0.4);

    skyline(g, '#110f28', 0.46, 'rgba(160,170,255,0.10)', 0.18);
    skyline(g, '#0a0a1b', 0.32, 'rgba(255,205,140,0.13)', 0.26);

    g.fillStyle = '#06060b';
    g.fillRect(0, groundY, W, H - groundY);
    g.fillStyle = '#20203a';
    g.fillRect(0, groundY, W, 2);
    g.fillStyle = '#0e0e18';
    g.fillRect(0, groundY + 2, W, Math.max(4, U * 0.9));
    const laneY = groundY + (H - groundY) * 0.52;
    g.fillStyle = '#24243a';
    for (let x = rand(0, 20); x < W; x += U * 8) g.fillRect(x, laneY, U * 3.6, Math.max(2, U * 0.35));

    hazeGrad = ctx.createLinearGradient(0, groundY - H * 0.3, 0, groundY);
    hazeGrad.addColorStop(0, 'rgba(40,24,80,0)');
    hazeGrad.addColorStop(1, 'rgba(50,30,96,0.3)');

    vig.width = 256;
    vig.height = Math.max(64, Math.round((256 * H) / W));
    const v = vig.getContext('2d');
    const vg = v.createRadialGradient(vig.width / 2, vig.height * 0.45, Math.min(vig.width, vig.height) * 0.32, vig.width / 2, vig.height / 2, Math.max(vig.width, vig.height) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    v.fillStyle = vg;
    v.fillRect(0, 0, vig.width, vig.height);
  }

  /* ═════════ yıkılabilir şehir (blok ızgarası) ═════════ */
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = Math.round(lerp(pa >> 16, pb >> 16, t));
    const g = Math.round(lerp((pa >> 8) & 255, (pb >> 8) & 255, t));
    const bl = Math.round(lerp(pa & 255, pb & 255, t));
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  }
  const PAL = ['#000000',
    '#1a2034', '#20283e', '#161b2c', '#262d47', '#1c2639', '#2a2642', // 1-6 duvar
    '#ffcf70', '#ffe7a8', '#8fd4ff', '#ffb35c', // 7-10 yanan pencere
    '#0b0e1b', // 11 sönük pencere
    '#3b4266', // 12 çatı kenarı / anten
    '#ff4d4d', // 13 uyarı lambası
  ];
  // enkaz gece göğünde kaybolmasın diye duvar renkleri biraz açılır
  const DEB = PAL.map((c, i) => ((i >= 1 && i <= 6) || i === 11 || i === 12 ? mix(c, '#9aa3d6', 0.24) : c));
  const WALLS = [1, 2, 3, 4, 5, 6];
  const DARKW = 11, TRIM = 12, BEACON = 13;
  const isWin = (v) => v >= 7 && v <= 11;

  let bs = 12, cols = 0, rows = 0, originY = 0;
  let cells = new Uint8Array(0), walls = new Uint8Array(0);
  let origCells = new Uint8Array(0), origWalls = new Uint8Array(0);
  let totalCells = 1, liveCells = 0;
  const city = document.createElement('canvas');
  const cityx = city.getContext('2d');
  let dX0 = 1e9, dY0 = 1e9, dX1 = -1, dY1 = -1;
  let supportDirty = false;
  let beacons = [];

  function buildCity() {
    bs = clamp(Math.round(U * 1.55), 7, 18);
    cols = Math.ceil(W / bs);
    rows = Math.floor(groundY / bs);
    originY = groundY - rows * bs;
    cells = new Uint8Array(cols * rows);
    walls = new Uint8Array(cols * rows);
    beacons = [];
    const maxH = Math.floor(rows * 0.6), minH = Math.max(6, Math.floor(rows * 0.18));
    let cx = randi(0, 2);
    while (cx < cols) {
      const w = randi(4, 9) + (Math.random() < 0.25 ? randi(2, 5) : 0);
      let h = randi(minH, maxH);
      if (Math.random() < 0.16) h = Math.min(rows - 5, Math.round(h * 1.3));
      const wall = pick(WALLS), pattern = randi(0, 2), lit = rand(0.22, 0.6), warm = Math.random() < 0.72;
      const x1 = Math.min(cols, cx + w);
      for (let x = cx; x < x1; x++) {
        for (let y = rows - h; y < rows; y++) {
          const lx = x - cx, ly = y - (rows - h);
          let v = wall;
          if (ly === 0) v = TRIM;
          else if (lx > 0 && lx < w - 1 && ly > 1 && y < rows - 1) {
            let win = false;
            if (pattern === 0) win = lx % 2 === 1 && ly % 2 === 0;
            else if (pattern === 1) win = ly % 3 === 2;
            else win = lx % 3 !== 0 && ly % 2 === 0;
            if (win) v = Math.random() < lit ? (warm ? pick([7, 8, 10]) : 9) : DARKW;
          }
          const i = y * cols + x;
          cells[i] = v;
          walls[i] = wall;
        }
      }
      if (h > rows * 0.42 && w >= 3 && Math.random() < 0.65) {
        const ax = cx + (w >> 1), ah = randi(2, 5);
        for (let k = 1; k <= ah && ax < cols; k++) {
          const y = rows - h - k;
          if (y < 1) break;
          const i = y * cols + ax;
          cells[i] = k === ah ? BEACON : TRIM;
          walls[i] = TRIM;
          if (k === ah) beacons.push(i);
        }
      }
      cx += w + randi(0, 3);
    }
    origCells = cells.slice();
    origWalls = walls.slice();
    let n = 0;
    for (let i = 0; i < cells.length; i++) if (cells[i]) n++;
    totalCells = Math.max(1, n);
    liveCells = n;
    renderCityFull();
  }

  // Hücreleri cihaz pikseline hizalı dikdörtgenler olarak çizer (komşular arasında dikiş kalmaz).
  function paintCells(g, arr, wal, stride, lx0, ly0, lx1, ly1, gcx0, gcy0, tx, ty) {
    const base = [], win = [];
    let edge = null;
    const ins = Math.max(1, Math.round(bs * DPR * 0.2));
    const eh = Math.max(1, Math.round(DPR));
    for (let ly = ly0; ly <= ly1; ly++) {
      const gy = gcy0 + ly;
      const y0 = Math.round((originY + gy * bs) * DPR) - ty;
      const hh = Math.round((originY + (gy + 1) * bs) * DPR) - ty - y0;
      for (let lx = lx0; lx <= lx1; lx++) {
        const i = ly * stride + lx;
        const v = arr[i];
        if (!v) continue;
        const gx = gcx0 + lx;
        const x0 = Math.round(gx * bs * DPR) - tx;
        const ww = Math.round((gx + 1) * bs * DPR) - tx - x0;
        const w8 = isWin(v);
        const b = w8 ? wal[i] : v;
        (base[b] || (base[b] = new Path2D())).rect(x0, y0, ww, hh);
        if (w8 && ww > ins * 2 && hh > ins * 2) (win[v] || (win[v] = new Path2D())).rect(x0 + ins, y0 + ins, ww - ins * 2, hh - ins * 2);
        if (ly === 0 || !arr[i - stride]) (edge || (edge = new Path2D())).rect(x0, y0, ww, eh);
      }
    }
    for (let c = 1; c < PAL.length; c++) if (base[c]) { g.fillStyle = PAL[c]; g.fill(base[c]); }
    for (let c = 1; c < PAL.length; c++) if (win[c]) { g.fillStyle = PAL[c]; g.fill(win[c]); }
    if (edge) { g.fillStyle = 'rgba(170,176,235,0.22)'; g.fill(edge); }
  }

  function markDirty(cx, cy) {
    if (cx < dX0) dX0 = cx;
    if (cx > dX1) dX1 = cx;
    if (cy < dY0) dY0 = cy;
    if (cy > dY1) dY1 = cy;
  }
  // Sadece değişen bölgeyi yeniden çizer.
  function flushCity() {
    if (dX1 < 0) return;
    const x0 = Math.max(0, dX0 - 1), x1 = Math.min(cols - 1, dX1 + 1);
    const y0 = Math.max(0, dY0 - 1), y1 = Math.min(rows - 1, dY1 + 1);
    dX0 = dY0 = 1e9;
    dX1 = dY1 = -1;
    const px0 = Math.round(x0 * bs * DPR), px1 = Math.round((x1 + 1) * bs * DPR);
    const py0 = Math.round((originY + y0 * bs) * DPR), py1 = Math.round((originY + (y1 + 1) * bs) * DPR);
    cityx.setTransform(1, 0, 0, 1, 0, 0);
    cityx.clearRect(px0, py0, px1 - px0, py1 - py0);
    paintCells(cityx, cells, walls, cols, x0, y0, x1, y1, 0, 0, 0, 0);
  }
  function renderCityFull() {
    city.width = canvas.width;
    city.height = canvas.height;
    dX0 = 0; dY0 = 0; dX1 = cols - 1; dY1 = rows - 1;
    flushCity();
  }

  const cellX = (i) => ((i % cols) + 0.5) * bs;
  const cellY = (i) => originY + (((i / cols) | 0) + 0.5) * bs;
  function cellIndexAt(x, y) {
    const cx = Math.floor(x / bs), cy = Math.floor((y - originY) / bs);
    if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) return -1;
    return cy * cols + cx;
  }
  function forCellsInCircle(x, y, r, fn) {
    const cx0 = Math.max(0, Math.floor((x - r) / bs)), cx1 = Math.min(cols - 1, Math.floor((x + r) / bs));
    const cy0 = Math.max(0, Math.floor((y - r - originY) / bs)), cy1 = Math.min(rows - 1, Math.floor((y + r - originY) / bs));
    const r2 = r * r;
    for (let cy = cy0; cy <= cy1; cy++) {
      const py = originY + (cy + 0.5) * bs, dy = py - y;
      for (let cx = cx0; cx <= cx1; cx++) {
        const i = cy * cols + cx;
        if (!cells[i]) continue;
        const px = (cx + 0.5) * bs, dx = px - x, d2 = dx * dx + dy * dy;
        if (d2 <= r2) fn(i, px, py, d2);
      }
    }
  }
  function removeCell(i) {
    const v = cells[i];
    if (!v) return 0;
    cells[i] = 0;
    liveCells--;
    markDirty(i % cols, (i / cols) | 0);
    supportDirty = true;
    return v;
  }
  function cellToDebris(i, vx, vy) {
    const v = cells[i];
    if (!v) return;
    const x = cellX(i), y = cellY(i);
    removeCell(i);
    addDebris(x, y, vx, vy, v);
  }

  /* ═════════ taşıma kontrolü: yere bağlı olmayan parçalar blok halinde düşer ═════════ */
  let visit = null, stack = null;
  function checkSupport() {
    supportDirty = false;
    const n = cols * rows;
    if (!n) return;
    if (!visit || visit.length !== n) { visit = new Uint8Array(n); stack = new Int32Array(n); }
    visit.fill(0);
    let sp = 0;
    const base = (rows - 1) * cols;
    for (let x = 0; x < cols; x++) {
      const i = base + x;
      if (cells[i]) { visit[i] = 1; stack[sp++] = i; }
    }
    while (sp > 0) {
      const i = stack[--sp], x = i % cols;
      let j;
      if (x > 0 && cells[j = i - 1] && !visit[j]) { visit[j] = 1; stack[sp++] = j; }
      if (x < cols - 1 && cells[j = i + 1] && !visit[j]) { visit[j] = 1; stack[sp++] = j; }
      if (i >= cols && cells[j = i - cols] && !visit[j]) { visit[j] = 1; stack[sp++] = j; }
      if ((j = i + cols) < n && cells[j] && !visit[j]) { visit[j] = 1; stack[sp++] = j; }
    }
    for (let i = 0; i < n; i++) if (cells[i] && !visit[i]) detachComponent(i);
  }

  const chunks = [];
  function detachComponent(seed) {
    const n = cols * rows, comp = [];
    let sp = 0, cx0 = 1e9, cx1 = -1, cy0 = 1e9, cy1 = -1;
    stack[sp++] = seed;
    visit[seed] = 2;
    while (sp > 0) {
      const i = stack[--sp], x = i % cols, y = (i / cols) | 0;
      comp.push(i);
      if (x < cx0) cx0 = x;
      if (x > cx1) cx1 = x;
      if (y < cy0) cy0 = y;
      if (y > cy1) cy1 = y;
      let j;
      if (x > 0 && cells[j = i - 1] && !visit[j]) { visit[j] = 2; stack[sp++] = j; }
      if (x < cols - 1 && cells[j = i + 1] && !visit[j]) { visit[j] = 2; stack[sp++] = j; }
      if (i >= cols && cells[j = i - cols] && !visit[j]) { visit[j] = 2; stack[sp++] = j; }
      if ((j = i + cols) < n && cells[j] && !visit[j]) { visit[j] = 2; stack[sp++] = j; }
    }
    if (comp.length < 6) {
      for (const i of comp) cellToDebris(i, rand(-1, 1) * 4 * U, 0);
      return;
    }
    const w = cx1 - cx0 + 1, h = cy1 - cy0 + 1;
    const ch = {
      cx0, cy0, w, h, y: 0, vy: 0, faces: [], count: comp.length, dirty: true, tx: 0, ty: 0,
      cells: new Uint8Array(w * h), walls: new Uint8Array(w * h), canvas: document.createElement('canvas'),
    };
    for (const i of comp) {
      const x = (i % cols) - cx0, y = ((i / cols) | 0) - cy0, k = y * w + x;
      ch.cells[k] = cells[i];
      ch.walls[k] = walls[i];
      cells[i] = 0;
      liveCells--;
      markDirty(x + cx0, y + cy0);
    }
    prepChunk(ch);
    chunks.push(ch);
  }

  function prepChunk(ch) {
    ch.faces.length = 0;
    let count = 0;
    for (let y = 0; y < ch.h; y++) {
      for (let x = 0; x < ch.w; x++) {
        const k = y * ch.w + x;
        if (!ch.cells[k]) continue;
        count++;
        if (y === ch.h - 1 || !ch.cells[k + ch.w]) ch.faces.push(k);
      }
    }
    ch.count = count;
    ch.dirty = false;
    if (!count) return;
    const tx = Math.round(ch.cx0 * bs * DPR), ty = Math.round((originY + ch.cy0 * bs) * DPR);
    const pw = Math.max(1, Math.round((ch.cx0 + ch.w) * bs * DPR) - tx);
    const ph = Math.max(1, Math.round((originY + (ch.cy0 + ch.h) * bs) * DPR) - ty);
    ch.tx = tx;
    ch.ty = ty;
    ch.canvas.width = pw; // genişlik ataması tuvali de temizler
    ch.canvas.height = ph;
    paintCells(ch.canvas.getContext('2d'), ch.cells, ch.walls, ch.w, 0, 0, ch.w - 1, ch.h - 1, ch.cx0, ch.cy0, tx, ty);
  }

  function chunkHits(ch) {
    for (const k of ch.faces) {
      const lx = k % ch.w, ly = (k / ch.w) | 0, gx = ch.cx0 + lx;
      const bottom = originY + (ch.cy0 + ly + 1) * bs + ch.y;
      if (bottom >= groundY - 0.25) return true;
      const gy = Math.floor((bottom + 0.5 - originY) / bs);
      if (gy >= 0 && gy < rows && cells[gy * cols + gx]) return true;
    }
    return false;
  }

  function updateChunks(dt) {
    for (let k = chunks.length - 1; k >= 0; k--) {
      const ch = chunks[k];
      if (ch.dirty) prepChunk(ch);
      if (ch.count <= 0) { chunks.splice(k, 1); continue; }
      ch.vy = Math.min(ch.vy + G * dt, 260 * U);
      let move = ch.vy * dt, landed = false;
      const step = bs * 0.45;
      while (move > 0) {
        const s = Math.min(step, move);
        ch.y += s;
        move -= s;
        if (chunkHits(ch)) { landed = true; break; }
      }
      if (landed) { landChunk(ch); chunks.splice(k, 1); }
    }
  }

  // Düşen blok bir şeye çarpınca ızgaraya geri oturur; hızlı çarpmada alt sıraları ezilir.
  function landChunk(ch) {
    const off = Math.round(ch.y / bs);
    const impact = ch.vy;
    const crush = impact > 95 * U ? 2 : impact > 55 * U ? 1 : 0;
    const crushed = new Uint8Array(ch.w * ch.h);
    if (crush) {
      for (let x = 0; x < ch.w; x++) {
        let c = crush;
        for (let y = ch.h - 1; y >= 0 && c > 0; y--) {
          const k = y * ch.w + x;
          if (ch.cells[k]) { crushed[k] = 1; c--; }
        }
      }
    }
    let nDeb = 0, minX = 1e9, maxX = -1, maxY = 0;
    for (let y = 0; y < ch.h; y++) {
      for (let x = 0; x < ch.w; x++) {
        const k = y * ch.w + x, v = ch.cells[k];
        if (!v) continue;
        const gx = ch.cx0 + x, gy = ch.cy0 + y + off;
        const px = (gx + 0.5) * bs, py = originY + (gy + 0.5) * bs;
        if (crushed[k] || gy >= rows || gy < 0 || cells[gy * cols + gx]) {
          if (nDeb++ < 160) addDebris(px, py, rand(-1, 1) * 28 * U, -rand(4, 30) * U, v);
          if (px < minX) minX = px;
          if (px > maxX) maxX = px;
          if (py > maxY) maxY = py;
          continue;
        }
        const j = gy * cols + gx;
        cells[j] = v;
        walls[j] = ch.walls[k];
        liveCells++;
        markDirty(gx, gy);
      }
    }
    supportDirty = true;
    const big = Math.min(1, ch.count / 400);
    if (maxX >= 0) {
      const puffs = Math.round((6 + 18 * big) * quality);
      for (let i = 0; i < puffs; i++) {
        addSmoke(rand(minX, maxX), maxY + rand(-1, 1) * bs, rand(-1, 1) * 16 * U, -rand(2, 10) * U, rand(0.9, 1.8), bs * rand(1.2, 2.4), bs * 2.5, SPR.smoke);
      }
    }
    shake(Math.min(16, 2 + ch.count / 40));
    if (impact > 30 * U) { sfx.rumble(big); buzz(Math.round(15 + 40 * big)); }
  }

  // Düşen bloklardaki hücrelere de çarpma/silme uygular; fn true dönerse hücre silinir.
  function chunkCellsInCircle(x, y, r, fn) {
    let n = 0;
    const r2 = r * r;
    for (const ch of chunks) {
      const left = ch.cx0 * bs, top = originY + ch.cy0 * bs + ch.y;
      if (x + r < left || x - r > left + ch.w * bs || y + r < top || y - r > top + ch.h * bs) continue;
      const lx0 = Math.max(0, Math.floor((x - r - left) / bs)), lx1 = Math.min(ch.w - 1, Math.floor((x + r - left) / bs));
      const ly0 = Math.max(0, Math.floor((y - r - top) / bs)), ly1 = Math.min(ch.h - 1, Math.floor((y + r - top) / bs));
      for (let ly = ly0; ly <= ly1; ly++) {
        const py = top + (ly + 0.5) * bs;
        for (let lx = lx0; lx <= lx1; lx++) {
          const k = ly * ch.w + lx;
          if (!ch.cells[k]) continue;
          const px = left + (lx + 0.5) * bs, d2 = (px - x) * (px - x) + (py - y) * (py - y);
          if (d2 > r2) continue;
          if (fn(ch, k, px, py, d2)) { ch.cells[k] = 0; ch.count--; ch.dirty = true; n++; }
        }
      }
    }
    return n;
  }
  function chunkAt(x, y) {
    for (const ch of chunks) {
      const lx = Math.floor((x - ch.cx0 * bs) / bs), ly = Math.floor((y - originY - ch.cy0 * bs - ch.y) / bs);
      if (lx >= 0 && lx < ch.w && ly >= 0 && ly < ch.h && ch.cells[ly * ch.w + lx]) return ch;
    }
    return null;
  }
  function drawChunks() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    for (const ch of chunks) {
      if (!ch.count) continue;
      const dy = Math.round(ch.y * DPR) / DPR;
      ctx.drawImage(ch.canvas, ch.tx / DPR, ch.ty / DPR + dy, ch.canvas.width / DPR, ch.canvas.height / DPR);
    }
  }

  function drawBeacons() {
    ctx.globalCompositeOperation = 'lighter';
    for (const i of beacons) {
      if (cells[i] !== BEACON) continue;
      const a = 0.5 + 0.5 * Math.sin(time * 3.2 + i);
      if (a > 0.35) drawGlow(SPR.red, cellX(i), cellY(i), U * 2.2, a * 0.75);
    }
  }

  /* ═════════ enkaz ═════════ */
  const debris = [];
  const DEBRIS_MAX = 1200;
  let recycleCursor = 0;
  function removeDebrisAt(k) {
    debris[k] = debris[debris.length - 1];
    debris.pop();
  }
  function addDebris(x, y, vx, vy, c) {
    const cap = Math.round(DEBRIS_MAX * (0.55 + 0.45 * quality));
    if (debris.length >= cap) {
      let idx = -1;
      const n = debris.length;
      for (let k = 0; k < 80 && k < n; k++) {
        const j = (recycleCursor + k) % n;
        if (debris[j].sleep && !debris[j].cap) { idx = j; break; }
      }
      recycleCursor = (recycleCursor + 80) % n;
      if (idx < 0) {
        if (Math.random() < 0.7) return;
        idx = (Math.random() * n) | 0;
        if (debris[idx].cap) return;
      }
      removeDebrisAt(idx);
    }
    debris.push({ x, y, vx, vy, a: Math.random() * TAU, va: rand(-9, 9), s: bs * rand(0.5, 0.92), c, sleep: false, t: 0, cap: null, oa: 0, or: 0, tr: 0, os: 0 });
  }
  function radialImpulse(x, y, R, str, up) {
    const R2 = R * R, lift = up === undefined ? 0.2 : up;
    for (const d of debris) {
      if (d.cap) continue;
      const dx = d.x - x, dy = d.y - y, d2 = dx * dx + dy * dy;
      if (d2 > R2) continue;
      const dd = Math.sqrt(d2) + 0.01, f = 1 - dd / R, s = str * f;
      d.vx += (dx / dd) * s;
      d.vy += (dy / dd) * s - str * lift * f;
      d.va += rand(-12, 12) * f;
      d.sleep = false;
    }
  }

  // Her kare kürelerden toplanan kuvvet alanları: 0 çekim (Mavi), 1 itme (Kırmızı), 2 silme (Mor)
  const fields = [];
  function collectFields() {
    fields.length = 0;
    for (const o of orbs) {
      if (o.dead) continue;
      if (o.type === 'blue' && o.grow > 0.2) fields.push({ o, kind: 0, x: o.x, y: o.y, R: o.pullR, cap: o.capR, str: (330 + 260 * o.power) * U, spin: o.spin, r: 0 });
      else if (o.type === 'red' && o.state === 'charging' && !o.bound) fields.push({ o, kind: 1, x: o.x, y: o.y, R: o.r * 5, cap: 0, str: 260 * U * o.charge, spin: 0, r: 0 });
      else if (o.type === 'purple') fields.push({ o, kind: 2, x: o.x, y: o.y, R: o.r * 2.1, cap: 0, str: 520 * U, spin: 0, r: o.state === 'flying' ? o.r : o.r * 0.8 });
    }
  }

  function updateDebris(dt) {
    const gdt = G * dt, drag = Math.exp(-0.25 * dt);
    for (let k = debris.length - 1; k >= 0; k--) {
      const d = debris[k];
      if (d.cap) {
        const o = d.cap;
        if (!o.dead) {
          d.oa += d.os * dt;
          d.or += (d.tr - d.or) * Math.min(1, dt * 3);
          d.x = o.x + Math.cos(d.oa) * d.or;
          d.y = o.y + Math.sin(d.oa) * d.or;
          d.a += d.va * dt;
          continue;
        }
        d.cap = null;
        if (o.fused || Math.random() < 0.3) {
          addFx(d.x, d.y, 0, 0, 0.3, bs * 1.4, o.fused ? SPR.violet : SPR.cyan, 0.8, 0, 0, 0, null);
          removeDebrisAt(k);
          continue;
        }
        const tang = d.os * d.or;
        d.vx = -Math.sin(d.oa) * tang + Math.cos(d.oa) * rand(10, 40) * U + o.vx * 0.4;
        d.vy = Math.cos(d.oa) * tang + Math.sin(d.oa) * rand(10, 40) * U + o.vy * 0.4;
        d.sleep = false;
      }
      let woke = false, gone = false;
      for (let f = 0; f < fields.length; f++) {
        const F = fields[f];
        const dx = F.x - d.x, dy = F.y - d.y, d2 = dx * dx + dy * dy;
        if (d2 > F.R * F.R) continue;
        const dd = Math.sqrt(d2) + 0.001, nx = dx / dd, ny = dy / dd, fall = 1 - dd / F.R;
        if (F.kind === 0) {
          if (dd < F.cap) {
            const o = F.o;
            if (o.captured >= o.capMax) {
              addFx(d.x, d.y, 0, 0, 0.25, bs * 1.2, SPR.cyan, 0.9, 0, 0, 0, null);
              gone = true;
            } else {
              d.cap = o;
              o.captured++;
              d.oa = Math.atan2(d.y - o.y, d.x - o.x);
              d.or = dd;
              d.tr = o.coreR * rand(0.7, 1.7);
              d.os = o.spin * rand(5, 10);
            }
            break;
          }
          const acc = F.str * (0.2 + fall * fall * 1.6);
          d.vx += (nx - ny * 0.6 * F.spin) * acc * dt;
          d.vy += (ny + nx * 0.6 * F.spin) * acc * dt - gdt * fall;
          const damp = Math.exp(-2.4 * fall * dt);
          d.vx *= damp;
          d.vy *= damp;
        } else if (F.kind === 1) {
          const acc = F.str * fall;
          d.vx -= nx * acc * dt;
          d.vy -= ny * acc * dt;
        } else {
          if (dd < F.r) {
            if (Math.random() < 0.5) addFx(d.x, d.y, 0, 0, rand(0.3, 0.6), bs * rand(1, 1.8), pick(ERASE_SPR), 0.9, 0, 0, 0, null);
            gone = true;
            break;
          }
          const acc = F.str * (0.3 + fall);
          d.vx += nx * acc * dt;
          d.vy += ny * acc * dt - gdt * 0.5;
        }
        woke = true;
      }
      if (gone) { removeDebrisAt(k); continue; }
      if (d.cap) continue;
      if (d.sleep) {
        if (!woke) {
          d.t += dt;
          if (d.t > 6) {
            d.s -= dt * bs * 0.8;
            if (d.s < 0.6) removeDebrisAt(k);
          }
          continue;
        }
        d.sleep = false;
      }
      d.vy += gdt;
      d.vx *= drag;
      d.vy *= drag;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.a += d.va * dt;
      const floor = groundY - d.s * 0.5;
      if (d.y > floor) {
        d.y = floor;
        if (d.vy > 0) d.vy *= -0.3;
        d.vx *= 0.7;
        d.va *= 0.55;
        if (d.vy > -40 && Math.abs(d.vx) < 22) { d.sleep = true; d.t = 0; d.vx = d.vy = d.va = 0; }
      }
      if (d.x < -250 || d.x > W + 250 || d.y < -H * 2) removeDebrisAt(k);
    }
  }

  // Aynı renkteki parçalar tek path'te toplanıp tek seferde doldurulur.
  function drawDebris() {
    if (!debris.length) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    for (let c = 1; c < DEB.length; c++) {
      let any = false;
      ctx.beginPath();
      for (let k = 0; k < debris.length; k++) {
        const d = debris[k];
        if (d.c !== c) continue;
        const h = d.s * 0.5, ca = Math.cos(d.a) * h, sa = Math.sin(d.a) * h;
        ctx.moveTo(d.x + ca - sa, d.y + sa + ca);
        ctx.lineTo(d.x - ca - sa, d.y - sa + ca);
        ctx.lineTo(d.x - ca + sa, d.y - sa - ca);
        ctx.lineTo(d.x + ca + sa, d.y + sa - ca);
        ctx.closePath();
        any = true;
      }
      if (any) { ctx.fillStyle = DEB[c]; ctx.fill(); }
    }
  }

  /* ═════════ parçacıklar, halkalar, yazılar ═════════ */
  const fx = [], smoke = [], rings = [], texts = [];
  const FX_MAX = 1800;
  function addFx(x, y, vx, vy, life, size, spr, alpha, drag, grav, grow, tgt) {
    if (fx.length >= FX_MAX * quality) return;
    fx.push({ x, y, vx, vy, life, max: life, size, spr, alpha, drag, grav, grow, tgt });
  }
  function addSmoke(x, y, vx, vy, life, size, grow, spr) {
    if (smoke.length >= 320) return;
    smoke.push({ x, y, vx, vy, life, max: life, size, grow, spr });
  }
  function addRing(x, y, r0, r1, dur, rgb, w) { rings.push({ x, y, r0, r1, t: 0, dur, rgb, w }); }
  function addText(x, y, s, rgb, size) { texts.push({ x, y, s, rgb, size, t: 0, dur: 1.2 }); }
  function spray(x, y, n, s0, s1, life0, life1, size0, size1, sprs, drag, grav) {
    const count = Math.round(n * quality);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, s = rand(s0, s1);
      addFx(x, y, Math.cos(a) * s, Math.sin(a) * s, rand(life0, life1), rand(size0, size1), pick(sprs), 1, drag, grav, 0, null);
    }
  }

  function updateParticles(dt) {
    for (let k = fx.length - 1; k >= 0; k--) {
      const p = fx[k];
      p.life -= dt;
      if (p.life <= 0 || p.size <= 0.2) { fx[k] = fx[fx.length - 1]; fx.pop(); continue; }
      if (p.tgt) {
        const o = p.tgt;
        if (o.dead) p.tgt = null;
        else {
          const dx = o.x - p.x, dy = o.y - p.y, dd = Math.hypot(dx, dy) + 0.01;
          const a = (900 * U * dt) / Math.max(0.35, dd / (12 * U));
          p.vx += (dx / dd - (dy / dd) * 0.7 * o.spin) * a;
          p.vy += (dy / dd + (dx / dd) * 0.7 * o.spin) * a;
          if (dd < o.coreR * 0.7) p.life = Math.min(p.life, 0.06);
        }
      }
      const dr = Math.exp(-p.drag * dt);
      p.vx *= dr;
      p.vy = p.vy * dr + p.grav * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += p.grow * dt;
    }
    for (let k = smoke.length - 1; k >= 0; k--) {
      const p = smoke[k];
      p.life -= dt;
      if (p.life <= 0) { smoke[k] = smoke[smoke.length - 1]; smoke.pop(); continue; }
      const dr = Math.exp(-1.6 * dt);
      p.vx *= dr;
      p.vy = p.vy * dr - 4 * U * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.size += p.grow * dt;
    }
    for (let k = rings.length - 1; k >= 0; k--) {
      rings[k].t += dt;
      if (rings[k].t >= rings[k].dur) rings.splice(k, 1);
    }
    for (let k = texts.length - 1; k >= 0; k--) {
      texts[k].t += dt;
      if (texts[k].t >= texts[k].dur) texts.splice(k, 1);
    }
  }
  function drawFx() {
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < fx.length; k++) {
      const p = fx[k], a = p.alpha * (p.life / p.max);
      if (a < 0.01) continue;
      const r = p.size;
      ctx.globalAlpha = a > 1 ? 1 : a;
      ctx.drawImage(p.spr, p.x - r, p.y - r, r * 2, r * 2);
    }
  }
  function drawSmoke() {
    ctx.globalCompositeOperation = 'source-over';
    for (let k = 0; k < smoke.length; k++) {
      const p = smoke[k], t = p.life / p.max;
      const a = 0.8 * t * Math.min(1, (1 - t) * 6);
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(p.spr, p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
    }
  }
  function drawRings() {
    ctx.globalCompositeOperation = 'lighter';
    for (const g of rings) {
      const k = g.t / g.dur, r = lerp(g.r0, g.r1, easeOutCubic(k));
      ctx.globalAlpha = (1 - k) * 0.9;
      ctx.strokeStyle = `rgb(${g.rgb})`;
      ctx.lineWidth = Math.max(0.6, g.w * (1 - k));
      ctx.beginPath();
      ctx.arc(g.x, g.y, r, 0, TAU);
      ctx.stroke();
    }
  }
  function drawTexts() {
    if (!texts.length) return;
    ctx.globalCompositeOperation = 'source-over';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const t of texts) {
      const k = t.t / t.dur;
      ctx.globalAlpha = 1 - k * k;
      ctx.font = `900 ${Math.round(t.size * (1 + 0.2 * (1 - k)))}px "Noto Serif JP", "Hiragino Mincho ProN", "Yu Mincho", serif`;
      ctx.shadowColor = `rgb(${t.rgb})`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(t.s, t.x, t.y - k * 5 * U);
    }
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  /* ═════════ ekran efektleri ═════════ */
  let shakeMag = 0, flashA = 0, flashCol = '255,255,255', slowT = 0, slowScale = 1;
  function shake(m) {
    if (reduceMotion) m *= 0.3;
    shakeMag = Math.min(34, Math.max(shakeMag, m));
  }
  function flash(a, col) {
    if (reduceMotion) a *= 0.35;
    if (a > flashA) { flashA = Math.min(0.9, a); flashCol = col; }
  }
  function hitStop(dur, scale) {
    if (reduceMotion) return;
    slowT = Math.max(slowT, dur);
    slowScale = scale;
  }

  /* ═════════ büyü sözleri, teknik adları, ipuçları ═════════ */
  const CHANTS = {
    blue: { words: [['位相', 'Faz'], ['黄昏', 'Alacakaranlık'], ['智慧の瞳', 'Bilgelik Gözü']], name: '術式順転「蒼」', sub: 'Tam büyü · Mavi' },
    red: { words: [['位相', 'Faz'], ['波羅蜜', 'Paramita'], ['光の柱', 'Işık Sütunu']], name: '術式反転「赫」', sub: 'Tam büyü · Kırmızı' },
    purple: { words: [['九綱', 'Dokuz İp'], ['偏光', 'Polarize Işık'], ['烏と声明', 'Karga ve Beyan'], ['表裏の間', 'Ön ile Arka Arası']], name: '虚式「茈」', sub: 'Tam büyü · %200' },
  };
  const chantEl = $('chant'), chantWords = chantEl.querySelector('.words'), chantTr = chantEl.querySelector('.tr');
  const chant = { owner: null, kind: '', step: 0, done: false, tr: [] };
  function chantProgress(o, kind, k) {
    if (o.noChant || !started) return;
    if (chant.owner !== o) {
      if (chant.owner && !chant.owner.dead) return;
      if (k > 0.3) return; // yarısını geçmiş bir küreyi sahiplenme
      chant.owner = o;
      chant.kind = kind;
      chant.step = 0;
      chant.done = false;
      chant.tr = [];
      chantWords.textContent = '';
      chantTr.textContent = '';
      chantEl.className = 'show ' + kind;
    }
    const C = CHANTS[kind], n = C.words.length;
    while (chant.step < n && k >= (chant.step + 1) / (n + 1)) {
      const [jp, tr] = C.words[chant.step];
      const span = document.createElement('span');
      span.textContent = jp;
      chantWords.appendChild(span);
      chant.tr.push(tr);
      chantTr.textContent = chant.tr.join(' · ');
      chant.step++;
      sfx.chant(chant.step);
    }
    if (!chant.done && k >= 0.999) {
      chant.done = true;
      callout(C.name, C.sub, kind);
      sfx.chantDone();
      buzz(30);
    }
  }
  function endChant(o) {
    if (chant.owner === o) { chant.owner = null; chantEl.classList.remove('show'); }
  }

  const calloutEl = $('callout'), calloutK = calloutEl.querySelector('.kanji'), calloutS = calloutEl.querySelector('.sub');
  let lastCalloutAt = -1e9;
  function callout(k, s, kind) {
    if (!started) return;
    lastCalloutAt = performance.now();
    calloutK.textContent = k;
    calloutS.textContent = s;
    calloutEl.className = kind;
    void calloutEl.offsetWidth; // animasyonu baştan başlat
    calloutEl.classList.add('show');
  }
  const lastCall = {};
  function calloutOnce(kind) {
    const t = performance.now();
    if (t - (lastCall[kind] || -1e9) < 5000 || t - lastCalloutAt < 1500) return; // başka bir başlık hâlâ ekrandaysa üstüne yazma
    lastCall[kind] = t;
    if (kind === 'blue') callout('術式順転「蒼」', 'Mavi · Çekim', 'blue');
    else callout('術式反転「赫」', 'Kırmızı · İtme', 'red');
  }

  const hintEl = $('hint');
  const HINTS = {
    blue: 'Basılı tut: Mavi her şeyi çeker · Sürükle · Kaydırıp bırak: fırlat',
    red: 'Dokun: patlat · Basılı tut: güç topla · Kaydırıp bırak: fırlat',
    purple: 'Tek parmakla basılı tut ya da iki parmakla Mavi ile Kırmızı\'yı birleştir',
  };
  let hintBase = '', hintTimer = 0;
  function setHintText(t) { if (hintEl.textContent !== t) hintEl.textContent = t; }
  function baseHint(t) { hintBase = t; if (hintTimer <= 0) setHintText(t); }
  function flashHint(t, dur) {
    if (!started) return;
    hintTimer = dur || 2.6;
    setHintText(t);
    hintEl.classList.remove('pulse');
    void hintEl.offsetWidth;
    hintEl.classList.add('pulse');
  }
  function updateHint(dt) {
    if (hintTimer > 0) {
      hintTimer -= dt;
      if (hintTimer <= 0) setHintText(hintBase);
    }
  }

  /* ═════════ küreler ═════════ */
  const orbs = [];
  function follow(o, tx, ty, dt, rate) {
    const a = 1 - Math.exp(-rate * dt);
    const nx = o.x + (tx - o.x) * a, ny = o.y + (ty - o.y) * a;
    if (dt > 0) {
      o.vx = lerp(o.vx, (nx - o.x) / dt, 0.3);
      o.vy = lerp(o.vy, (ny - o.y) / dt, 0.3);
    }
    o.x = nx;
    o.y = ny;
  }

  // 蒼 Mavi: sonsuzluğu hızlandırır, her şeyi merkezine çeker.
  class Blue {
    constructor(x, y, ptr) {
      this.type = 'blue';
      this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.t = 0;
      this.ptr = ptr || null;
      this.state = ptr ? 'held' : 'free';
      this.life = 1.4; this.dead = false; this.fused = false; this.bound = false; this.noChant = false;
      this.power = 0; this.grow = 0; this.captured = 0; this.capMax = 110;
      this.spin = Math.random() < 0.5 ? 1 : -1;
      this.acc = 0;
    }
    get coreR() { return U * (2.3 + 1.3 * this.power) * (0.4 + 0.6 * this.grow); }
    get pullR() { return U * (24 + 18 * this.power) * this.grow; }
    get ripR() { return U * (6.5 + 6.5 * this.power) * this.grow; }
    get capR() { return U * (2.8 + 1.2 * this.power); }
    update(dt) {
      this.t += dt;
      this.grow = Math.min(1, this.grow + dt * 3.5);
      if (this.state === 'held') {
        if (!this.bound && this.ptr) follow(this, this.ptr.x, this.ptr.y, dt, 32);
        if (!this.noChant) {
          this.power = Math.min(1, this.power + dt / 2.4);
          chantProgress(this, 'blue', this.power);
        }
      } else {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        const dr = Math.exp(-1.0 * dt);
        this.vx *= dr;
        this.vy *= dr;
        this.life -= dt;
        if (this.life <= 0) { this.collapse(); return; }
      }
      this.rip(dt);
      this.acc += dt * 75 * quality;
      while (this.acc >= 1) {
        this.acc--;
        const a = Math.random() * TAU, rr = this.pullR * rand(0.22, 0.5);
        const spr = Math.random() < 0.3 ? SPR.white : Math.random() < 0.5 ? SPR.cyan : SPR.blue;
        addFx(this.x + Math.cos(a) * rr, this.y + Math.sin(a) * rr, -Math.sin(a) * this.spin * 14 * U, Math.cos(a) * this.spin * 14 * U, rand(0.5, 1.1), U * rand(0.5, 1.2), spr, 0.9, 0.6, 0, 0, this);
      }
    }
    // çekim yarıçapındaki blokları binalardan söker
    rip(dt) {
      const R = this.ripR;
      if (R < bs) return;
      let budget = Math.ceil(16 * quality);
      forCellsInCircle(this.x, this.y, R, (i, px, py, d2) => {
        if (budget <= 0) return;
        const dd = Math.sqrt(d2);
        if (Math.random() > (1 - dd / R) * dt * 16) return;
        budget--;
        const nx = (this.x - px) / (dd + 0.01), ny = (this.y - py) / (dd + 0.01);
        cellToDebris(i, nx * 14 * U, ny * 14 * U);
      });
      chunkCellsInCircle(this.x, this.y, R * 0.8, (ch, k, px, py) => {
        if (Math.random() > dt * 8) return false;
        addDebris(px, py, 0, 0, ch.cells[k]);
        return true;
      });
    }
    release(vx, vy, flick) {
      this.ptr = null;
      this.state = 'free';
      endChant(this);
      if (flick) {
        const s = Math.hypot(vx, vy), k = Math.min(1, (150 * U) / s);
        this.vx = vx * k;
        this.vy = vy * k;
        this.life = 1.9 + this.power * 0.9;
      } else {
        this.vx *= 0.15;
        this.vy *= 0.15;
        this.life = 1.3 + this.power * 1.2;
      }
    }
    collapse() {
      this.dead = true;
      endChant(this);
      const r = this.coreR;
      addFx(this.x, this.y, 0, 0, 0.3, r * 7, SPR.cyan, 0.8, 0, 0, -r * 18, null);
      addFx(this.x, this.y, 0, 0, 0.18, r * 4, SPR.white, 0.9, 0, 0, -r * 10, null);
      addRing(this.x, this.y, r * 1.5, r * 9, 0.4, '120,200,255', 3);
      radialImpulse(this.x, this.y, this.pullR * 0.5, 90 * U);
      sfx.blueOff();
    }
    fizzle() {
      this.dead = true;
      endChant(this);
      addFx(this.x, this.y, 0, 0, 0.25, this.coreR * 4, SPR.blue, 0.6, 0, 0, -this.coreR * 10, null);
    }
    draw() {
      const g = this.grow;
      if (g <= 0) return;
      const x = this.x, y = this.y, r = this.coreR, t = this.t;
      const pulse = 1 + Math.sin(t * 9) * 0.05;
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(SPR.blue, x, y, this.pullR * 0.55 * pulse, 0.28 * g);
      drawGlow(SPR.cyan, x, y, r * 4.4 * pulse, 0.5 * g);
      ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(1, r * 0.12);
      ctx.strokeStyle = '#6fc3ff';
      ctx.globalAlpha = 0.35 * g;
      for (let arm = 0; arm < 3; arm++) {
        ctx.beginPath();
        for (let i = 0; i <= 14; i++) {
          const k = i / 14;
          const ang = t * 5 * this.spin + (arm * TAU) / 3 + k * 2.6 * this.spin;
          const rr = r * (1.1 + (1 - k) * 4.2);
          const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
          if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        }
        ctx.stroke();
      }
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.strokeStyle = '#9fdcff';
      for (let k = 0; k < 3; k++) {
        const ph = (t * 1.25 + k / 3) % 1;
        ctx.globalAlpha = ph * 0.45 * g;
        ctx.beginPath();
        ctx.arc(x, y, r * (1.3 + (1 - ph) * 6), 0, TAU);
        ctx.stroke();
      }
      drawGlow(SPR.blueCore, x, y, r * 2.4, g);
      drawGlow(SPR.white, x, y, r * (0.9 + Math.sin(t * 23) * 0.06), 0.95 * g);
    }
  }

  // 赫 Kırmızı: sonsuzluğu tersine çevirir, her şeyi iter ve patlar.
  class Red {
    constructor(x, y, ptr) {
      this.type = 'red';
      this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.t = 0;
      this.ptr = ptr || null;
      this.state = 'charging';
      this.charge = 0.12;
      this.dead = false; this.bound = false; this.noChant = false;
      this.trail = []; this.flight = 0; this.acc = 0;
      this.spin = Math.random() < 0.5 ? 1 : -1;
    }
    get r() { return U * (1.9 + 2.6 * this.charge); }
    update(dt) {
      this.t += dt;
      if (this.state === 'charging') {
        this.charge = Math.min(1, this.charge + dt / 1.45);
        if (!this.bound && this.ptr) follow(this, this.ptr.x, this.ptr.y, dt, 32);
        if (!this.bound) chantProgress(this, 'red', (this.charge - 0.12) / 0.88);
        this.acc += dt * (20 + 50 * this.charge) * quality;
        while (this.acc >= 1) {
          this.acc--;
          const a = Math.random() * TAU, s = rand(20, 60) * U * (0.5 + this.charge);
          addFx(this.x + Math.cos(a) * this.r * 0.6, this.y + Math.sin(a) * this.r * 0.6, Math.cos(a) * s, Math.sin(a) * s, rand(0.15, 0.4), U * rand(0.4, 0.9), Math.random() < 0.3 ? SPR.orange : SPR.red, 1, 3, 0, 0, null);
        }
        return;
      }
      // uçuş: yakındaki Mavi alanlar mermiyi kendine doğru büker
      this.flight += dt;
      for (const o of orbs) {
        if (o.type !== 'blue' || o.dead) continue;
        const dx = o.x - this.x, dy = o.y - this.y, d = Math.hypot(dx, dy) + 0.01;
        if (d < o.pullR) {
          const a = 420 * U * (1 - d / o.pullR);
          this.vx += (dx / d) * a * dt;
          this.vy += (dy / d) * a * dt;
        }
      }
      const sp = Math.hypot(this.vx, this.vy);
      const n = Math.max(1, Math.ceil((sp * dt) / (bs * 0.5)));
      for (let s = 0; s < n; s++) {
        this.x += (this.vx * dt) / n;
        this.y += (this.vy * dt) / n;
        if (this.hitTest()) { this.explode(); return; }
      }
      this.trail.push(this.x, this.y);
      if (this.trail.length > 24) this.trail.splice(0, 2);
      this.acc += dt * 90 * quality;
      while (this.acc >= 1) {
        this.acc--;
        addFx(this.x, this.y, rand(-1, 1) * 12 * U - this.vx * 0.05, rand(-1, 1) * 12 * U - this.vy * 0.05, rand(0.15, 0.35), U * rand(0.4, 1), Math.random() < 0.4 ? SPR.orange : SPR.red, 0.9, 3, 0, 0, null);
      }
      if (this.flight > 2.2 || this.x < -120 || this.x > W + 120 || this.y < -240 || this.y > H + 120) this.dead = true;
    }
    hitTest() {
      if (this.y >= groundY - 2) { this.y = groundY - 2; return true; }
      const i = cellIndexAt(this.x, this.y);
      if (i >= 0 && cells[i]) return true;
      if (chunks.length && chunkAt(this.x, this.y)) return true;
      for (const c of curses) {
        if (!c.dead && c.alpha > 0.5 && dist2(this.x, this.y, c.x, c.y) < (c.r + this.r * 0.5) ** 2) return true;
      }
      return false;
    }
    release(vx, vy, flick) {
      this.ptr = null;
      endChant(this);
      if (flick) {
        const s = Math.hypot(vx, vy) || 1, sp = clamp(s * 1.3, 170 * U, 320 * U);
        this.vx = (vx / s) * sp;
        this.vy = (vy / s) * sp;
        this.state = 'flying';
        this.flight = 0;
        sfx.redFire();
        addRing(this.x, this.y, this.r, this.r * 4, 0.25, '255,90,80', 3);
        if (!this.noChant) calloutOnce('red');
      } else {
        this.explode();
      }
    }
    explode() {
      this.dead = true;
      endChant(this);
      redExplosion(this.x, this.y, this.charge, !this.noChant);
    }
    fizzle() {
      this.dead = true;
      endChant(this);
      addFx(this.x, this.y, 0, 0, 0.25, this.r * 4, SPR.red, 0.6, 0, 0, -this.r * 10, null);
    }
    draw() {
      const x = this.x, y = this.y, r = this.r, t = this.t;
      ctx.globalCompositeOperation = 'lighter';
      if (this.state === 'flying') {
        const tr = this.trail, n = tr.length / 2;
        for (let i = 0; i < n; i++) {
          const k = (i + 1) / n;
          drawGlow(SPR.red, tr[i * 2], tr[i * 2 + 1], r * (0.6 + 1.2 * k), 0.35 * k);
        }
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.atan2(this.vy, this.vx));
        ctx.scale(2.6, 1);
        drawGlow(SPR.red, 0, 0, r * 1.8, 0.8);
        ctx.restore();
        drawGlow(SPR.redCore, x, y, r * 2, 1);
        drawGlow(SPR.white, x, y, r * 0.7, 1);
        return;
      }
      const pulse = 1 + Math.sin(t * 11) * 0.06;
      drawGlow(SPR.red, x, y, r * 5.2 * pulse, 0.7);
      drawGlow(SPR.orange, x, y, r * 2.4, 0.45);
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ff6a50';
      ctx.lineWidth = Math.max(1.2, r * 0.1);
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      const N = 12;
      for (let k = 0; k < N; k++) {
        const a = t * 1.4 * this.spin + (k * TAU) / N + Math.sin(t * 6 + k) * 0.08;
        const len = r * (1.5 + 1.6 * (0.5 + 0.5 * Math.sin(t * 13 + k * 2.3))) * (0.6 + 0.6 * this.charge);
        ctx.moveTo(x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9);
        ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      }
      ctx.stroke();
      ctx.lineWidth = Math.max(1, r * 0.08);
      ctx.strokeStyle = '#ff7a64';
      for (let k = 0; k < 2; k++) {
        const ph = (t * 1.7 + k / 2) % 1;
        ctx.globalAlpha = (1 - ph) * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, r * (1.1 + ph * 3.8), 0, TAU);
        ctx.stroke();
      }
      drawGlow(SPR.redCore, x, y, r * 2.3, 1);
      drawGlow(SPR.white, x, y, r * (0.75 + Math.sin(t * 29) * 0.05), 1);
    }
  }

  function redExplosion(x, y, p, loud) {
    const R = U * (9 + 13 * p), vap2 = (R * 0.45) * (R * 0.45);
    let n = 0;
    forCellsInCircle(x, y, R, (i, px, py, d2) => {
      if (d2 < vap2) {
        removeCell(i);
        if ((n++ & 3) === 0) addFx(px, py, rand(-1, 1) * 30 * U, rand(-1, 1) * 30 * U, rand(0.25, 0.6), bs * rand(1, 2.2), Math.random() < 0.5 ? SPR.orange : SPR.red, 0.9, 3, 0, 0, null);
        return;
      }
      const d = Math.sqrt(d2), sp = (45 + 170 * (1 - d / R)) * U * rand(0.6, 1.25);
      cellToDebris(i, ((px - x) / d) * sp, ((py - y) / d) * sp - 25 * U);
    });
    chunkCellsInCircle(x, y, R, (ch, k, px, py, d2) => {
      const d = Math.sqrt(d2) + 0.01;
      if (d < R * 0.45) return true;
      const sp = (45 + 170 * (1 - d / R)) * U;
      addDebris(px, py, ((px - x) / d) * sp, ((py - y) / d) * sp - 25 * U, ch.cells[k]);
      return true;
    });
    radialImpulse(x, y, R * 1.9, 230 * U);
    for (const c of curses) if (!c.dead && dist2(x, y, c.x, c.y) < (R * 1.1 + c.r) ** 2) exorcise(c, 'red');
    addFx(x, y, 0, 0, 0.28, R * 1.3, SPR.white, 1, 0, 0, R * 1.5, null);
    addFx(x, y, 0, 0, 0.55, R * 2.2, SPR.red, 0.85, 0, 0, R * 1.2, null);
    addFx(x, y, 0, 0, 0.8, R * 1.4, SPR.orange, 0.5, 0, 0, R * 1.4, null);
    spray(x, y, 40 + 90 * p, 60 * U * (0.5 + p * 0.6), 300 * U * (0.5 + p * 0.6), 0.25, 0.7, U * 0.35, U * 0.9, [SPR.red, SPR.orange, SPR.white, SPR.orange], 3.5, 60 * U);
    const puffs = Math.round(8 + 12 * p);
    for (let i = 0; i < puffs; i++) {
      const a = Math.random() * TAU, s = rand(8, 40) * U;
      addSmoke(x + Math.cos(a) * R * 0.3, y + Math.sin(a) * R * 0.3, Math.cos(a) * s, Math.sin(a) * s - 10 * U, rand(0.8, 1.6), R * rand(0.25, 0.45), R * 0.5, SPR.smoke);
    }
    addRing(x, y, R * 0.25, R * 2.1, 0.45, '255,110,90', 7);
    addRing(x, y, R * 0.15, R * 1.3, 0.3, '255,235,215', 3);
    flash(0.18 + 0.3 * p, '255,80,50');
    shake(5 + 14 * p);
    sfx.boom(p);
    buzz(20 + Math.round(50 * p));
    if (loud) calloutOnce('red');
  }

  // 茈 Mor: Mavi ile Kırmızı'nın çarpışmasından doğan sanal kütle; değdiğini siler.
  class Purple {
    constructor(x, y) {
      this.type = 'purple';
      this.x = x; this.y = y; this.vx = 0; this.vy = 0; this.t = 0;
      this.state = 'forming'; this.form = 0;
      this.charge = 0.35; this.ptrs = []; this.dead = false;
      this.speed = 0; this.maxSpeed = 100 * U; this.dx = 1; this.dy = 0;
      this.launch = null; this.acc = 0; this.hx = x; this.hy = y;
      this.noChant = false;
    }
    get r() {
      const base = U * (7 + 15 * this.charge);
      return this.state === 'forming' ? base * Math.max(0.05, easeOutBack(Math.min(1, this.form / 0.32))) : base;
    }
    followPtrs(dt) {
      if (!this.ptrs.length) return;
      let sx = 0, sy = 0;
      for (const p of this.ptrs) { sx += p.x; sy += p.y; }
      follow(this, sx / this.ptrs.length, sy / this.ptrs.length, dt, 20);
    }
    update(dt) {
      this.t += dt;
      if (this.state === 'forming') {
        this.form += dt;
        this.followPtrs(dt);
        if (this.form >= 0.32) {
          if (this.launch) this.fire(this.launch.x, this.launch.y);
          else if (this.ptrs.length) { this.state = 'held'; flashHint('Kaydırıp bırak: 茈 fırlasın! · Beklersen büyür', 3); }
          else this.toHover();
        }
      } else if (this.state === 'held' || this.state === 'hover') {
        if (this.state === 'held') this.followPtrs(dt);
        else { this.x = this.hx; this.y = this.hy + Math.sin(this.t * 2.2) * U * 0.6; }
        this.charge = Math.min(1, this.charge + dt / 2.6);
        chantProgress(this, 'purple', (this.charge - 0.35) / 0.65);
        this.erase(this.r * 0.8);
      } else if (this.state === 'flying') {
        this.speed = Math.min(this.maxSpeed, this.speed + this.maxSpeed * 2.2 * dt);
        const r = this.r, step = this.speed * dt, n = Math.max(1, Math.ceil(step / (r * 0.25)));
        for (let s = 0; s < n; s++) {
          this.x += (this.dx * step) / n;
          this.y += (this.dy * step) / n;
          this.erase(r);
        }
        this.vx = this.dx * this.speed;
        this.vy = this.dy * this.speed;
        this.acc += dt * 45 * quality;
        while (this.acc >= 1) {
          this.acc--;
          addFx(this.x + rand(-0.3, 0.3) * r, this.y + rand(-0.3, 0.3) * r, -this.dx * rand(5, 20) * U, -this.dy * rand(5, 20) * U, rand(0.35, 0.65), r * rand(0.4, 0.7), pick([SPR.purple, SPR.violet, SPR.magenta]), 0.45, 1.5, 0, -r * 0.5, null);
        }
        const m = r * 1.3;
        if (this.x < -m || this.x > W + m || this.y < -m || this.y > H + m) { this.dead = true; endChant(this); }
      }
    }
    toHover() {
      this.state = 'hover';
      this.hx = this.x;
      this.hy = this.y;
      flashHint('Bir hedefe dokun ya da kaydır: 茈 fırlasın!', 4);
    }
    releasePointer(p, vx, vy, flick) {
      const i = this.ptrs.indexOf(p);
      if (i >= 0) this.ptrs.splice(i, 1);
      if (this.state === 'flying' || this.dead) return;
      if (flick) { this.fire(vx, vy); return; }
      if (!this.ptrs.length && this.state === 'held') this.toHover();
    }
    fire(dx, dy) {
      const l = Math.hypot(dx, dy) || 1;
      this.dx = dx / l;
      this.dy = dy / l;
      for (const p of this.ptrs) if (p.orb === this) p.orb = null;
      this.ptrs.length = 0;
      this.state = 'flying';
      this.speed = 25 * U;
      this.maxSpeed = (90 + 40 * this.charge) * U;
      endChant(this);
      flash(0.85, '235,210,255');
      shake(22 + 10 * this.charge);
      hitStop(0.12, 0.25);
      addRing(this.x, this.y, this.r, this.r * 3.2, 0.5, '200,140,255', 10);
      addRing(this.x, this.y, this.r * 0.5, this.r * 2, 0.3, '255,255,255', 4);
      sfx.launch(this.charge);
      buzz([40, 30, 90]);
      if (started) flashHint(this.charge > 0.99 ? 'Tam güç! Şehirde tünel açıldı.' : 'Uzun tutarsan Mor büyür ve sözlerini okur.', 2.4);
    }
    erase(r) {
      const x = this.x, y = this.y;
      let n = 0;
      forCellsInCircle(x, y, r, (i, px, py) => {
        removeCell(i);
        n++;
        if ((n & 3) === 0) addFx(px, py, rand(-1, 1) * 12 * U + this.vx * 0.15, rand(-1, 1) * 12 * U + this.vy * 0.15, rand(0.35, 0.8), bs * rand(0.7, 1.5), pick(ERASE_SPR), 0.9, 2.5, 0, 0, null);
      });
      if (chunks.length) {
        n += chunkCellsInCircle(x, y, r, (ch, k, px, py) => {
          if (Math.random() < 0.25) addFx(px, py, 0, 0, rand(0.35, 0.7), bs * rand(0.8, 1.5), pick(ERASE_SPR), 0.9, 2, 0, 0, null);
          return true;
        });
      }
      for (const c of curses) if (!c.dead && dist2(x, y, c.x, c.y) < (r + c.r * 0.6) ** 2) exorcise(c, 'purple');
      for (const o of orbs) {
        if (o === this || o.dead || o.type === 'purple' || o.bound || o.ptr) continue;
        if (dist2(x, y, o.x, o.y) < r * r) o.fizzle();
      }
      if (n) sfx.crackle(n);
    }
    draw() {
      const r = this.r, x = this.x, y = this.y, t = this.t;
      if (r < 1) return;
      const pulse = 1 + Math.sin(t * 7) * 0.04;
      ctx.globalCompositeOperation = 'lighter';
      // büyük ışımalar pahalı (ekran boyu dolgu); sprite'ın görünmeyen dış halkası kırpılacak kadar küçük tutulur
      drawGlow(SPR.purple, x, y, r * 3 * pulse, 0.6);
      drawGlow(SPR.magenta, x, y, r * 1.9, 0.32);
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createRadialGradient(x - r * 0.15, y - r * 0.15, r * 0.05, x, y, r);
      g.addColorStop(0, 'rgba(255,245,255,1)');
      g.addColorStop(0.28, 'rgba(214,160,255,0.95)');
      g.addColorStop(0.7, 'rgba(120,50,230,0.92)');
      g.addColorStop(1, 'rgba(70,15,160,0.9)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      const a = t * 6.5;
      drawGlow(SPR.blue, x + Math.cos(a) * r * 0.42, y + Math.sin(a) * r * 0.42, r * 1.05, 0.55);
      drawGlow(SPR.red, x - Math.cos(a) * r * 0.42, y - Math.sin(a) * r * 0.42, r * 1.05, 0.55);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = '#e6c8ff';
      ctx.lineWidth = Math.max(1.5, r * 0.035);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = '#b070ff';
      ctx.lineWidth = Math.max(3, r * 0.1);
      ctx.beginPath();
      ctx.arc(x, y, r * 1.06, 0, TAU);
      ctx.stroke();
      const arcCols = ['#7fc4ff', '#ff7a9a', '#f0d8ff'];
      ctx.lineWidth = Math.max(1, r * 0.03);
      for (let k = 0; k < 3; k++) {
        const s = t * (3 + k) * (k % 2 ? -1 : 1) + k * 2;
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = arcCols[k];
        ctx.beginPath();
        ctx.arc(x, y, r * (1.12 + k * 0.07), s, s + 1.3 + k * 0.4);
        ctx.stroke();
      }
      ctx.lineCap = 'round';
      const nb = this.state === 'flying' ? 4 : 3;
      for (let b = 0; b < nb; b++) {
        const ang = Math.random() * TAU, len = r * rand(0.35, 0.9), ang2 = ang + rand(-0.5, 0.5);
        const x1 = x + Math.cos(ang) * r * 0.95, y1 = y + Math.sin(ang) * r * 0.95;
        bolt(x1, y1, x1 + Math.cos(ang2) * len, y1 + Math.sin(ang2) * len, 6, len * 0.25);
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#b77cff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      drawGlow(SPR.white, x, y, r * 0.75 * pulse, 0.7);
      if (this.state === 'hover') {
        const pl = 0.5 + 0.5 * Math.sin(t * 5);
        ctx.globalAlpha = 0.35 + 0.35 * pl;
        ctx.strokeStyle = '#d9b8ff';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 10]);
        ctx.lineDashOffset = -t * 30;
        ctx.beginPath();
        ctx.arc(x, y, r * (1.35 + 0.08 * pl), 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  // Tek parmakla basılı tutunca Mavi ile Kırmızı parmağın etrafında dönerek birleşir.
  const rituals = [];
  class Ritual {
    constructor(ptr, blue, launchDir) {
      this.ptr = ptr;
      this.blue = blue;
      this.launchDir = launchDir || null;
      this.t = 0;
      this.T = 0.95;
      this.a0 = Math.random() * TAU;
      this.R0 = Math.max(70, 13 * U);
      this.dead = false;
      blue.bound = true;
      this.red = new Red(ptr.x, ptr.y, null);
      this.red.bound = true;
      this.red.noChant = true;
      orbs.push(this.red);
      sfx.ritual();
    }
    update(dt) {
      if (this.dead) return;
      if (this.blue.dead || this.red.dead) { this.cancel(); return; }
      this.t += dt;
      const k = Math.min(1, this.t / this.T);
      const R = this.R0 * Math.min(1, k * 5) * (1 - k * k * 0.95);
      const ang = this.a0 + this.t * 4 + k * k * 9;
      const cx = this.ptr.x, cy = this.ptr.y;
      this.blue.x = cx + Math.cos(ang) * R;
      this.blue.y = cy + Math.sin(ang) * R;
      this.red.x = cx - Math.cos(ang) * R;
      this.red.y = cy - Math.sin(ang) * R;
      if (k >= 1) {
        this.dead = true;
        if (this.ptr.ritual === this) this.ptr.ritual = null;
        fuse(this.blue, this.red, cx, cy, [this.ptr], this.launchDir);
      }
    }
    cancel() {
      if (this.dead) return;
      this.dead = true;
      if (this.ptr.ritual === this) this.ptr.ritual = null;
      if (!this.blue.dead) this.blue.fizzle();
      if (!this.red.dead) this.red.fizzle();
    }
  }

  function fuse(blue, red, x, y, ptrs, dir) {
    blue.dead = true;
    blue.fused = true;
    red.dead = true;
    endChant(blue);
    endChant(red);
    const P = new Purple(x, y);
    orbs.push(P);
    const list = [];
    for (const p of ptrs) {
      if (!p || !pointers.has(p.id) || list.includes(p)) continue;
      p.orb = P;
      p.partner = null;
      list.push(p);
    }
    if (dir) {
      P.launch = dir;
      for (const p of list) p.orb = null;
    } else {
      P.ptrs = list;
    }
    const big = Math.max(W, H);
    flash(0.7, '215,170,255');
    shake(14);
    hitStop(0.22, 0.12);
    addRing(x, y, 10, big * 0.35, 0.7, '190,120,255', 6);
    addRing(x, y, 5, big * 0.2, 0.45, '255,255,255', 3);
    spray(x, y, 60, 40 * U, 220 * U, 0.3, 0.8, U * 0.5, U * 1.4, [SPR.blue, SPR.red, SPR.violet, SPR.white], 3.2, 0);
    addFx(x, y, 0, 0, 0.5, U * 30, SPR.violet, 0.9, 0, 0, -U * 40, null);
    callout('虚式「茈」', 'Mor · Hollow Purple', 'purple');
    sfx.fusion();
    buzz([25, 30, 60]);
    return P;
  }

  // Mavi ile Kırmızı birbirine yeterince yaklaşırsa (iki parmak, ya da Maviye fırlatılan Kırmızı) Mor doğar.
  function checkFusions() {
    const fd = fuseDist();
    for (const b of orbs) {
      if (b.dead || b.type !== 'blue' || b.bound || b.grow < 0.25) continue;
      for (const r of orbs) {
        if (r.dead || r.type !== 'red' || r.bound) continue;
        const lim = r.state === 'flying' ? Math.max(fd * 0.8, b.coreR + r.r + 3 * U) : fd;
        if (dist2(b.x, b.y, r.x, r.y) >= lim * lim) continue;
        const ptrs = [];
        if (b.ptr) ptrs.push(b.ptr);
        if (r.ptr) ptrs.push(r.ptr);
        const dir = r.state === 'flying' ? { x: r.vx, y: r.vy } : null;
        if (dir) flashHint('Kombo! Kırmızı + Mavi = 茈', 2.6);
        fuse(b, r, (b.x + r.x) / 2, (b.y + r.y) / 2, ptrs, dir);
        break;
      }
    }
  }

  /* ═════════ lanetler ═════════ */
  const curses = [];
  const SKINS = [
    { body: '#2d1e45', edge: '#130a22', hi: '#5a4284', rim: 'rgba(200,160,255,0.45)', eye: '#f3eee0', pupil: '#d4213a', glow: SPR.violet },
    { body: '#1f3528', edge: '#0b1810', hi: '#4a7a5d', rim: 'rgba(150,255,170,0.4)', eye: '#eef39a', pupil: '#16110a', glow: SPR.sick },
    { body: '#3b1c22', edge: '#170a0d', hi: '#7d3c48', rim: 'rgba(255,150,150,0.4)', eye: '#f5efe6', pupil: '#2a0a36', glow: SPR.red },
  ];
  class Curse {
    constructor() {
      this.r = U * rand(3.2, 5.8);
      this.x = rand(0.1, 0.9) * W;
      this.y = rand(Math.max(0.1 * H + 50, this.r + 60), Math.max(0.1 * H + 60, groundY * 0.5));
      this.vx = 0; this.vy = 0; this.t = rand(0, 10);
      this.skin = pick(SKINS);
      this.alpha = 0; this.dead = false; this.stun = false;
      this.tx = this.x; this.ty = this.y; this.retarget = 0;
      this.lx = 0; this.ly = 1; this.wob = rand(2, 4);
      const n = randi(1, 3);
      this.eyes = [];
      for (let i = 0; i < n; i++) {
        const spread = n === 1 ? 0 : (i / (n - 1) - 0.5) * 0.9;
        this.eyes.push({ ox: spread + rand(-0.06, 0.06), oy: -0.18 + rand(-0.12, 0.08) - Math.abs(spread) * 0.1, s: rand(0.18, 0.27) * (n === 1 ? 1.5 : 1) });
      }
      for (let i = 0; i < 8; i++) addSmoke(this.x + rand(-1, 1) * this.r, this.y + rand(-1, 1) * this.r, rand(-1, 1) * 8 * U, rand(-1, 1) * 8 * U, rand(0.6, 1.1), this.r * rand(0.5, 0.9), this.r * 0.6, SPR.miasma);
    }
    update(dt) {
      this.t += dt;
      this.alpha = Math.min(1, this.alpha + dt * 1.5);
      if (this.stun) {
        this.vx *= 0.9;
        this.vy *= 0.9;
        return;
      }
      this.retarget -= dt;
      if (this.retarget <= 0 || dist2(this.x, this.y, this.tx, this.ty) < (6 * U) ** 2) {
        this.tx = rand(0.08, 0.92) * W;
        this.ty = rand(0.12, 0.52) * groundY;
        this.retarget = rand(2.5, 5);
      }
      const dx = this.tx - this.x, dy = this.ty - this.y, d = Math.hypot(dx, dy) + 1;
      this.vx += (dx / d) * 16 * U * dt;
      this.vy += (dy / d) * 16 * U * dt;
      let lookX = 0, lookY = 1, best = 1e18;
      for (const o of orbs) {
        if (o.dead) continue;
        const ox = o.x - this.x, oy = o.y - this.y, od2 = ox * ox + oy * oy;
        if (od2 < best) { best = od2; lookX = ox; lookY = oy; }
        if (o.type === 'blue' && o.grow > 0.3) {
          const od = Math.sqrt(od2) + 0.01;
          if (od < o.coreR + this.r * 0.5) { exorcise(this, 'blue'); return; }
          if (od < o.pullR) {
            const a = (120 + 380 * (1 - od / o.pullR)) * U;
            this.vx += (ox / od) * a * dt;
            this.vy += (oy / od) * a * dt;
          }
        } else if (o.type === 'red' && o.state === 'charging' && !o.bound) {
          const od = Math.sqrt(od2) + 0.01, R = o.r * 6;
          if (od < R) {
            const a = 200 * U * o.charge * (1 - od / R);
            this.vx -= (ox / od) * a * dt;
            this.vy -= (oy / od) * a * dt;
          }
        }
      }
      const ll = Math.hypot(lookX, lookY) || 1;
      this.lx = lerp(this.lx, lookX / ll, Math.min(1, dt * 6));
      this.ly = lerp(this.ly, lookY / ll, Math.min(1, dt * 6));
      const damp = Math.exp(-1.4 * dt);
      this.vx *= damp;
      this.vy *= damp;
      this.x = clamp(this.x + this.vx * dt, this.r, W - this.r);
      this.y = clamp(this.y + this.vy * dt, this.r + 50, groundY - this.r);
    }
    draw() {
      const r = this.r * (0.6 + 0.4 * this.alpha), t = this.t, S = this.skin;
      const x = this.x + (this.stun ? (Math.random() - 0.5) * U * 0.5 : 0);
      const y = this.y + Math.sin(t * 1.8) * U * 0.6;
      ctx.globalCompositeOperation = 'lighter';
      drawGlow(S.glow, x, y, r * 2.4, 0.2 * this.alpha);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = this.alpha;
      ctx.lineCap = 'round';
      ctx.strokeStyle = S.edge;
      ctx.lineWidth = r * 0.2;
      for (let k = 0; k < 4; k++) {
        const bx = x + (k - 1.5) * r * 0.42;
        ctx.beginPath();
        ctx.moveTo(bx, y + r * 0.5);
        ctx.quadraticCurveTo(bx + Math.sin(t * 3 + k) * r * 0.35, y + r * 1.05, bx + Math.sin(t * 2.4 + k * 1.7) * r * 0.25, y + r * 1.45);
        ctx.stroke();
      }
      ctx.beginPath();
      const N = 18;
      for (let i = 0; i <= N; i++) {
        const a = (i / N) * TAU;
        const rr = r * (1 + 0.09 * Math.sin(a * 3 + t * this.wob) + 0.05 * Math.sin(a * 5 - t * 3.1));
        const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.92;
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.closePath();
      const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r * 1.1);
      g.addColorStop(0, S.hi);
      g.addColorStop(0.55, S.body);
      g.addColorStop(1, S.edge);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = S.rim;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      for (const e of this.eyes) {
        const ex = x + e.ox * r, ey = y + e.oy * r, es = e.s * r;
        ctx.fillStyle = S.eye;
        ctx.beginPath();
        ctx.ellipse(ex, ey, es, es * 0.8, 0, 0, TAU);
        ctx.fill();
        if (this.stun) {
          ctx.strokeStyle = S.pupil;
          ctx.lineWidth = Math.max(1, es * 0.14);
          ctx.beginPath();
          for (let i = 0; i < 18; i++) {
            const a = i * 0.7 + t * 9, rr = es * 0.05 * i;
            if (i) ctx.lineTo(ex + Math.cos(a) * rr, ey + Math.sin(a) * rr * 0.8); else ctx.moveTo(ex, ey);
          }
          ctx.stroke();
        } else {
          const px = ex + this.lx * es * 0.35, py = ey + this.ly * es * 0.3;
          ctx.fillStyle = S.pupil;
          ctx.beginPath();
          ctx.arc(px, py, es * 0.42, 0, TAU);
          ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.8)';
          ctx.fillRect(px - es * 0.2, py - es * 0.22, es * 0.14, es * 0.14);
        }
      }
      const my = y + r * 0.4, mw = r * 0.46, mh = r * (0.14 + 0.05 * Math.sin(t * 5));
      ctx.fillStyle = '#07030a';
      ctx.beginPath();
      ctx.ellipse(x, my, mw, mh, 0, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#e9e1cf';
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const tx = x - mw * 0.8 + i * mw * 0.4;
        ctx.moveTo(tx - mw * 0.12, my - mh * 0.7);
        ctx.lineTo(tx + mw * 0.12, my - mh * 0.7);
        ctx.lineTo(tx, my + mh * 0.2);
      }
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  let exorcised = 0;
  const CAUSE = {
    blue: { spr: SPR.cyan, rgb: '120,200,255' },
    red: { spr: SPR.orange, rgb: '255,120,95' },
    purple: { spr: SPR.violet, rgb: '205,150,255' },
    domain: { spr: SPR.white, rgb: '215,235,255' },
  };
  function exorcise(c, cause) {
    if (c.dead) return;
    c.dead = true;
    exorcised++;
    const C = CAUSE[cause] || CAUSE.purple;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * TAU, s = rand(10, 60) * U;
      addSmoke(c.x, c.y, Math.cos(a) * s, Math.sin(a) * s, rand(0.5, 1.1), c.r * rand(0.4, 0.8), c.r * 0.8, SPR.miasma);
    }
    spray(c.x, c.y, 22, 30 * U, 140 * U, 0.3, 0.7, U * 0.5, U * 1.1, [C.spr, SPR.white], 3, 0);
    addRing(c.x, c.y, c.r * 0.5, c.r * 3, 0.35, '255,255,255', 2);
    addText(c.x, c.y - c.r, '祓', C.rgb, Math.max(18, Math.round(c.r * 1.2)));
    sfx.curse();
  }
  let curseTimer = 1.2;
  function updateCurses(dt) {
    curseTimer -= dt;
    const max = W * H > 900000 ? 6 : 4;
    if (curseTimer <= 0) {
      curseTimer = rand(2.2, 4.5);
      if (curses.length < max && domain.state === 'off') curses.push(new Curse());
    }
    for (let k = curses.length - 1; k >= 0; k--) {
      const c = curses[k];
      if (!c.dead) c.update(dt);
      if (c.dead) curses.splice(k, 1);
    }
  }
  function drawCurses() {
    for (const c of curses) if (!c.dead) c.draw();
  }

  /* ═════════ 領域展開「無量空処」 Alan Açılımı: Sonsuz Boşluk ═════════ */
  const DOMAIN_CD = 12;
  const domain = { state: 'off', t: 0, cd: 0, R: 0, streaks: [], stars: [], pops: [] };
  function newStreak(s, initial) {
    s.a = Math.random() * TAU;
    s.d = initial ? Math.random() : rand(0, 0.05);
    s.sp = rand(0.12, 0.5);
    s.w = rand(0.6, 2);
    s.c = Math.random() < 0.6 ? 0 : Math.random() < 0.5 ? 1 : 2;
    return s;
  }
  function startDomain() {
    if (!started) return;
    if (domain.state !== 'off') return;
    if (domain.cd > 0) { flashHint('Alan Açılımı hazırlanıyor…', 1.6); return; }
    domain.state = 'open';
    domain.t = 0;
    domain.streaks = [];
    const ns = Math.round(170 * quality) + 60;
    for (let i = 0; i < ns; i++) domain.streaks.push(newStreak({}, true));
    domain.stars = [];
    for (let i = 0; i < 260; i++) {
      domain.stars.push({ arm: i % 3, d: Math.pow(Math.random(), 0.6), off: rand(-0.35, 0.35), s: rand(0.6, 1.8), c: pick(['#ffffff', '#bfe3ff', '#d7b8ff', '#8fc7ff']) });
    }
    domain.pops = [];
    for (const c of curses) c.stun = true;
    callout('領域展開', 'Alan Açılımı', 'domain');
    sfx.domainOpen();
    buzz([20, 40, 20]);
    flash(0.5, '230,240,255');
  }
  function updateDomain(dt) {
    if (domain.state === 'off') {
      if (domain.cd > 0) domain.cd = Math.max(0, domain.cd - dt);
      return;
    }
    domain.t += dt;
    const maxR = Math.hypot(W, H) * 0.55;
    if (domain.state === 'open') {
      domain.R = maxR * easeInOut(Math.min(1, domain.t / 0.9));
      if (domain.t >= 0.9) {
        domain.state = 'active';
        domain.t = 0;
        callout('無量空処', 'Sonsuz Boşluk', 'domain');
      }
    } else if (domain.state === 'active') {
      domain.R = maxR;
      if (domain.t >= 4.2) {
        domain.state = 'close';
        domain.t = 0;
        domain.pops = curses.filter((c) => !c.dead).map((c, i) => ({ c, at: 0.05 + i * 0.09 }));
        sfx.domainClose();
        flash(0.45, '220,235,255');
      }
    } else if (domain.state === 'close') {
      domain.R = maxR * (1 - easeInOut(Math.min(1, domain.t / 0.8)));
      for (const p of domain.pops) if (!p.done && domain.t >= p.at) { p.done = true; exorcise(p.c, 'domain'); }
      if (domain.t >= 0.8) {
        for (const p of domain.pops) if (!p.done) exorcise(p.c, 'domain');
        domain.state = 'off';
        domain.R = 0;
        domain.cd = DOMAIN_CD;
        for (const c of curses) c.stun = false;
      }
    }
    if (domain.state !== 'off') {
      for (const c of curses) c.stun = true;
      for (const s of domain.streaks) {
        s.d += s.sp * dt * (0.3 + s.d * 2.2);
        if (s.d > 1.05) newStreak(s, false);
      }
    }
  }
  const STREAK_COLS = ['#ffffff', '#9fd8ff', '#d4a8ff'];
  function drawDomain() {
    if (domain.state === 'off' || domain.R < 1) return;
    const cx = W / 2, cy = H * 0.46, R = domain.R, maxR = Math.hypot(W, H) * 0.55, t = time;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.clip();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.93;
    ctx.fillStyle = '#02020a';
    ctx.fillRect(-60, -60, W + 120, H + 120);
    ctx.globalCompositeOperation = 'lighter';
    drawGlow(SPR.violet, cx + Math.cos(t * 0.3) * maxR * 0.25, cy + Math.sin(t * 0.3) * maxR * 0.18, maxR * 0.55, 0.22);
    drawGlow(SPR.blue, cx - Math.cos(t * 0.25) * maxR * 0.3, cy - Math.sin(t * 0.25) * maxR * 0.15, maxR * 0.5, 0.2);
    drawGlow(SPR.magenta, cx, cy, maxR * 0.3, 0.12);
    const rot = t * 0.35;
    for (const s of domain.stars) {
      const rr = s.d * maxR * 0.7, a = rot + (s.arm * TAU) / 3 + s.d * 4.2 + s.off;
      ctx.globalAlpha = 0.35 + 0.5 * (1 - s.d);
      ctx.fillStyle = s.c;
      ctx.fillRect(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.62, s.s, s.s);
    }
    for (let c = 0; c < 3; c++) {
      ctx.strokeStyle = STREAK_COLS[c];
      for (const s of domain.streaks) {
        if (s.c !== c) continue;
        const d = s.d * maxR, len = 3 + d * 0.16, ca = Math.cos(s.a), sa = Math.sin(s.a);
        ctx.globalAlpha = Math.min(1, s.d * 2.5) * 0.85;
        ctx.lineWidth = s.w * (0.4 + s.d);
        ctx.beginPath();
        ctx.moveTo(cx + ca * d, cy + sa * d);
        ctx.lineTo(cx + ca * (d + len), cy + sa * (d + len));
        ctx.stroke();
      }
    }
    drawGlow(SPR.white, cx, cy, U * (6 + Math.sin(t * 3) * 0.6), 0.9);
    drawGlow(SPR.cyan, cx, cy, U * 16, 0.35);
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = '#cfe8ff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, U * 9, 0, TAU);
    ctx.stroke();
    ctx.restore();
    if (R < maxR * 0.999) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = '#e8f4ff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#8fc4ff';
      ctx.stroke();
    }
  }

  /* ═════════ 反転術式 onarım ═════════ */
  const repair = { on: false, t: 0, row: 0 };
  function startRepair() {
    if (!started || repair.on) return;
    repair.on = true;
    repair.t = 0;
    repair.row = rows;
    for (const ch of chunks) {
      const cx = (ch.cx0 + ch.w / 2) * bs, cy = originY + (ch.cy0 + ch.h / 2) * bs + ch.y;
      spray(cx, cy, 10, 10 * U, 60 * U, 0.4, 0.9, U * 0.6, U * 1.3, [SPR.green, SPR.white], 2, 0);
    }
    chunks.length = 0;
    for (const d of debris) {
      if (Math.random() < 0.25) addFx(d.x, d.y, 0, -rand(10, 40) * U, rand(0.4, 0.9), U * rand(0.5, 1.1), SPR.green, 0.8, 2, 0, 0, null);
    }
    debris.length = 0;
    callout('反転術式', 'Ters Lanetli Teknik · Onarım', 'repair');
    sfx.repair();
  }
  function updateRepair(dt) {
    if (!repair.on) return;
    repair.t += dt;
    const k = Math.min(1, repair.t / 1.1);
    const target = Math.floor(rows * (1 - easeInOut(k)));
    while (repair.row > target) {
      repair.row--;
      const y = repair.row;
      let changed = false, sparks = 0;
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        if (cells[i] === origCells[i] && walls[i] === origWalls[i]) continue;
        if (!cells[i] && origCells[i] && sparks < 3 && Math.random() < 0.08) {
          sparks++;
          addFx(cellX(i), cellY(i), 0, -rand(10, 30) * U, rand(0.4, 0.8), bs * rand(1, 2), SPR.green, 0.8, 2, 0, 0, null);
        }
        cells[i] = origCells[i];
        walls[i] = origWalls[i];
        changed = true;
      }
      if (changed) { markDirty(0, y); markDirty(cols - 1, y); }
    }
    if (k >= 1) {
      repair.on = false;
      let n = 0;
      for (let i = 0; i < cells.length; i++) if (cells[i]) n++;
      liveCells = n;
      supportDirty = true;
    }
  }

  /* ═════════ ses: tamamen sentezlenmiş (dosya yok) ═════════ */
  const sfx = (() => {
    let ac = null, out = null, noiseBuf = null, dr = null, muted = false;
    let lastBoom = 0, lastCrackle = 0, lastCurse = 0;
    const lastSet = new Map();
    function init() {
      if (ac) { resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { ac = new AC({ latencyHint: 'interactive' }); } catch (e) { try { ac = new AC(); } catch (e2) { return; } }
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) { /* iOS sessiz tuşu */ }
      const comp = ac.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.knee.value = 10;
      comp.ratio.value = 6;
      comp.attack.value = 0.003;
      comp.release.value = 0.2;
      out = ac.createGain();
      out.gain.value = muted ? 0 : 0.85;
      out.connect(comp);
      comp.connect(ac.destination);
      const len = ac.sampleRate * 2;
      noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      const ch = noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
      dr = drones();
      resume();
    }
    function resume() {
      if (ac && ac.state !== 'running') { const p = ac.resume(); if (p && p.catch) p.catch(() => {}); }
    }
    function suspend() {
      if (ac && ac.state === 'running') { const p = ac.suspend(); if (p && p.catch) p.catch(() => {}); }
    }
    function osc(type, f) { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(); return o; }
    function noiseSrc() { const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(0, Math.random()); return s; }
    function gain(v, dest) { const g = ac.createGain(); g.gain.value = v; if (dest) g.connect(dest); return g; }
    function filt(type, f, q, dest) { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; if (dest) b.connect(dest); return b; }
    // sürekli çalan, sesi kürelere göre açılıp kısılan uğultular
    function drones() {
      const blue = gain(0, out);
      const bl = filt('lowpass', 520, 0.7, blue);
      osc('sine', 58).connect(bl);
      osc('triangle', 116.5).connect(gain(0.5, bl));
      const bn = filt('bandpass', 700, 1.4, gain(0.9, blue));
      noiseSrc().connect(bn);
      osc('sine', 0.55).connect(gain(380, bn.frequency));
      const red = gain(0, out);
      const rf = filt('lowpass', 900, 7, red);
      const ro = osc('sawtooth', 110);
      ro.connect(rf);
      const ro2 = osc('square', 55);
      ro2.connect(gain(0.3, rf));
      const purp = gain(0, out);
      const pf = filt('lowpass', 420, 1.2, purp);
      osc('sawtooth', 55).connect(pf);
      osc('sawtooth', 55.6).connect(pf);
      osc('sine', 27.5).connect(gain(1.2, purp));
      const roar = gain(0, out);
      const rn = filt('lowpass', 700, 0.8, roar);
      noiseSrc().connect(rn);
      return { blue, red, ro, ro2, rf, purp, pf, roar, rn };
    }
    function set(key, param, v, tc) {
      const prev = lastSet.get(key);
      if (prev !== undefined && Math.abs(prev - v) < 0.004 * (Math.abs(v) + 1)) return;
      lastSet.set(key, v);
      param.setTargetAtTime(v, ac.currentTime, tc || 0.06);
    }
    function tone(type, f0, f1, dur, vol, delay, attack) {
      if (!ac) return;
      const t = ac.currentTime + (delay || 0);
      const o = ac.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.01));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g);
      g.connect(out);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    function hiss(type, f0, f1, dur, vol, q, delay, attack) {
      if (!ac) return;
      const t = ac.currentTime + (delay || 0);
      const s = ac.createBufferSource();
      s.buffer = noiseBuf;
      s.loop = true;
      const f = ac.createBiquadFilter();
      f.type = type;
      f.Q.value = q || 1;
      f.frequency.setValueAtTime(f0, t);
      f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + (attack || 0.005));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      s.connect(f);
      f.connect(g);
      g.connect(out);
      s.start(t, Math.random() * 1.5);
      s.stop(t + dur + 0.05);
    }
    function pad(freqs, dur, vol) {
      if (!ac) return;
      const t = ac.currentTime;
      for (const f of freqs) {
        const o = ac.createOscillator();
        o.type = 'sine';
        o.frequency.value = f;
        o.detune.value = rand(-6, 6);
        const g = ac.createGain();
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(vol, t + 1.2);
        g.gain.setValueAtTime(vol, t + dur - 1.2);
        g.gain.linearRampToValueAtTime(0, t + dur);
        o.connect(g);
        g.connect(out);
        o.start(t);
        o.stop(t + dur + 0.1);
      }
    }
    return {
      init, resume, suspend,
      get muted() { return muted; },
      setMuted(m) {
        muted = m;
        if (out) out.gain.setTargetAtTime(m ? 0 : 0.85, ac.currentTime, 0.03);
      },
      update(L) {
        if (!ac || !dr) return;
        set('b', dr.blue.gain, L.blue * 0.32);
        set('r', dr.red.gain, L.red * 0.1);
        set('ro', dr.ro.frequency, 80 + 300 * L.redC);
        set('ro2', dr.ro2.frequency, 40 + 150 * L.redC);
        set('rf', dr.rf.frequency, 300 + 2600 * L.redC);
        set('p', dr.purp.gain, L.purple * 0.24);
        set('pf', dr.pf.frequency, 260 + 500 * L.purpleC);
        set('ro3', dr.roar.gain, L.roar * 0.55);
        set('rn', dr.rn.frequency, 400 + 900 * L.roar);
      },
      blueOn() { hiss('bandpass', 2600, 240, 0.55, 0.22, 2); tone('sine', 340, 52, 0.5, 0.3); },
      blueOff() { tone('sine', 48, 240, 0.22, 0.22); hiss('highpass', 300, 4200, 0.26, 0.14, 0.7); },
      redFire() { tone('sawtooth', 1500, 150, 0.2, 0.16); hiss('highpass', 1800, 6500, 0.14, 0.24, 0.8); },
      boom(p) {
        const n = performance.now();
        if (n - lastBoom < 70) return;
        lastBoom = n;
        hiss('lowpass', 3800, 110, 0.5 + 0.9 * p, 0.55 + 0.35 * p, 0.8);
        tone('sine', 150, 30, 0.45 + 0.6 * p, 0.75);
        tone('triangle', 85, 26, 0.6 + 0.5 * p, 0.35);
      },
      rumble(p) {
        const n = performance.now();
        if (n - lastBoom < 90) return;
        lastBoom = n;
        hiss('lowpass', 900, 60, 0.7 + 0.6 * p, 0.3 + 0.35 * p, 0.7);
        tone('sine', 70, 28, 0.6 + 0.4 * p, 0.15 + 0.35 * p);
      },
      fusion() {
        [880, 1318.5, 1760, 2637].forEach((f, i) => tone('sine', f, f * 0.996, 1.8, 0.08, i * 0.012));
        hiss('bandpass', 500, 7000, 0.4, 0.3, 1.2, 0, 0.3);
        tone('sine', 190, 26, 1.5, 0.8, 0.04);
      },
      launch(p) {
        hiss('lowpass', 2800, 140, 1.8, 0.75, 0.7);
        tone('sawtooth', 120, 30, 1.5, 0.22 + 0.1 * p);
        tone('sine', 64, 22, 1.9, 0.8);
      },
      crackle(n) {
        const t = performance.now();
        if (t - lastCrackle < 45) return;
        lastCrackle = t;
        hiss('bandpass', rand(1800, 4200), 900, 0.06, Math.min(0.2, 0.04 + n * 0.004), 3);
      },
      curse() {
        const t = performance.now();
        if (t - lastCurse < 60) return;
        lastCurse = t;
        tone('square', 520, 70, 0.32, 0.08);
        tone('sine', 900, 160, 0.22, 0.1, 0.03);
        hiss('bandpass', 900, 200, 0.3, 0.15, 2);
      },
      chant(i) {
        const m = 1 + i * 0.125;
        tone('sine', 660 * m, 655 * m, 0.9, 0.07);
        tone('sine', 1320 * m, 1310 * m, 0.6, 0.035);
      },
      chantDone() {
        [523.25, 783.99, 1046.5].forEach((f, i) => tone('sine', f, f, 1.6, 0.07, i * 0.04));
        tone('sine', 110, 40, 0.9, 0.5);
      },
      ritual() { tone('sine', 220, 440, 1.0, 0.08, 0, 0.4); hiss('bandpass', 300, 3000, 1.0, 0.12, 1.5, 0, 0.8); },
      domainOpen() {
        tone('sine', 32, 110, 1.3, 0.7, 0, 0.2);
        hiss('bandpass', 180, 5200, 1.5, 0.35, 0.9, 0, 0.9);
        pad([110, 164.81, 220, 277.18, 329.63, 440, 659.25], 5.6, 0.045);
      },
      domainClose() { hiss('lowpass', 5000, 200, 1.0, 0.4, 0.7); tone('sine', 140, 30, 0.9, 0.6); },
      repair() {
        [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone('triangle', f, f, 0.5, 0.06, i * 0.07));
        hiss('highpass', 2000, 9000, 1.1, 0.08, 0.7, 0, 0.3);
      },
      ui() { tone('sine', 900, 700, 0.07, 0.05); },
    };
  })();

  const lv = { blue: 0, red: 0, redC: 0, purple: 0, purpleC: 0, roar: 0 };
  function audioLevels() {
    lv.blue = lv.red = lv.redC = lv.purple = lv.purpleC = lv.roar = 0;
    for (const o of orbs) {
      if (o.dead) continue;
      if (o.type === 'blue') lv.blue = Math.min(1, lv.blue + 0.75 * o.grow);
      else if (o.type === 'red') {
        if (o.state === 'charging') { lv.red = 1; lv.redC = Math.max(lv.redC, o.charge); }
      } else {
        lv.purple = 1;
        lv.purpleC = Math.max(lv.purpleC, o.charge);
        if (o.state === 'flying') lv.roar = 1;
      }
    }
    sfx.update(lv);
  }

  /* ═════════ dokunma (Pointer Events, çoklu dokunma) ═════════ */
  const pointers = new Map();
  // Olayın kendi zaman damgası: tarayıcı hareketleri toplu teslim etse de hız doğru ölçülür.
  function evTime(e) {
    const t = e && e.timeStamp, now = performance.now();
    return t > 0 && t <= now + 50 ? t : now; // eski tarayıcılarda epoch gelebilir
  }
  function track(p, x, y, t) {
    if (Math.abs(x - p.x) <= 0.5 && Math.abs(y - p.y) <= 0.5) return;
    p.moveT = t;
    p.x = x;
    p.y = y;
    p.hist.push({ x, y, t });
    if (p.hist.length > 16) p.hist.shift();
  }
  // Hız yalnızca son ~80 ms'lik örneklerden ölçülür; basılı tutup bekledikten sonraki
  // kaydırma, bekleme süresiyle ortalanıp yavaş görünmesin.
  function velocityOf(p, upT) {
    const h = p.hist, n = h.length;
    if (n < 2 || upT - p.moveT > 90) return { x: 0, y: 0 }; // bırakmadan önce durduysa fırlatma yok
    const last = h[n - 1];
    let j = n - 1;
    while (j > 0 && last.t - h[j - 1].t <= 80) j--;
    if (j === n - 1) j = n - 2;
    const a = h[j], dt = (last.t - a.t) / 1000;
    if (dt <= 0.002) return { x: 0, y: 0 };
    return { x: (last.x - a.x) / dt, y: (last.y - a.y) / dt };
  }
  function findPartner(p) {
    for (const q of pointers.values()) {
      if (q === p || q.partner || !q.purple) continue;
      const o = q.orb;
      if (o && !o.dead && o.type === 'blue' && o.state === 'held') return q;
    }
    return null;
  }

  function onDown(e) {
    if (!started) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    sfx.resume();
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* dokunmada zaten örtük */ }
    const x = e.clientX, y = e.clientY, t = evTime(e);
    const p = { id: e.pointerId, x, y, sx: x, sy: y, t0: nowS(), moveT: t, hist: [{ x, y, t }], orb: null, ritual: null, partner: null, aim: null, purple: false };
    pointers.set(e.pointerId, p);
    const hovering = orbs.filter((o) => o.type === 'purple' && !o.dead && o.state === 'hover');
    if (hovering.length) { p.aim = hovering; return; } // bekleyen Mor varsa bu dokunuş nişan alır
    if (mode === 'blue') {
      const o = new Blue(x, y, p);
      orbs.push(o);
      p.orb = o;
      sfx.blueOn();
      calloutOnce('blue');
    } else if (mode === 'red') {
      const o = new Red(x, y, p);
      orbs.push(o);
      p.orb = o;
    } else {
      p.purple = true;
      const q = findPartner(p);
      if (q) {
        p.partner = q;
        q.partner = p;
        if (q.ritual) {
          // tek parmak ritüeli sürerken ikinci parmak gelirse Kırmızı o parmağa geçer
          const rit = q.ritual;
          rit.dead = true;
          q.ritual = null;
          rit.red.bound = false;
          rit.red.ptr = p;
          rit.blue.bound = false;
          p.orb = rit.red;
        } else {
          const o = new Red(x, y, p);
          o.noChant = true;
          orbs.push(o);
          p.orb = o;
        }
        flashHint('Parmaklarını birbirine yaklaştır!', 3);
      } else {
        const o = new Blue(x, y, p);
        o.noChant = true;
        orbs.push(o);
        p.orb = o;
        sfx.blueOn();
        flashHint('Basılı tut… ya da ikinci parmağını koy', 2);
      }
    }
  }
  function onMove(e) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    e.preventDefault();
    const list = e.getCoalescedEvents ? e.getCoalescedEvents() : null;
    if (list && list.length) for (const c of list) track(p, c.clientX, c.clientY, evTime(c));
    else track(p, e.clientX, e.clientY, evTime(e));
  }
  function endPointer(e, cancelled) {
    const p = pointers.get(e.pointerId);
    if (!p) return;
    const upT = evTime(e);
    if (!cancelled) track(p, e.clientX, e.clientY, upT);
    pointers.delete(e.pointerId);
    const v = cancelled ? { x: 0, y: 0 } : velocityOf(p, upT);
    const flick = Math.hypot(v.x, v.y) > flickMin();
    if (p.partner) { p.partner.partner = null; p.partner = null; }
    if (p.aim) { aimFire(p); return; }
    if (p.ritual) {
      p.ritual.cancel();
      p.ritual = null;
      flashHint('Mor için parmağını biraz daha basılı tut', 2.4);
      return;
    }
    const o = p.orb;
    p.orb = null;
    if (!o || o.dead) return;
    if (o.type === 'purple') o.releasePointer(p, v.x, v.y, flick);
    else if (o.ptr === p) {
      o.release(v.x, v.y, flick);
      if (p.purple && o.type === 'blue') flashHint('Mor için basılı tut ya da iki parmak kullan', 2.6);
    }
  }
  function aimFire(p) {
    const dx = p.x - p.sx, dy = p.y - p.sy, swipe = Math.hypot(dx, dy) > 28;
    for (const o of p.aim) {
      if (o.dead || o.state !== 'hover') continue;
      let ax = swipe ? dx : p.x - o.x, ay = swipe ? dy : p.y - o.y;
      if (Math.hypot(ax, ay) < 2) { ax = 1; ay = -0.2; }
      o.fire(ax, ay);
    }
  }
  function releaseAllPointers() {
    for (const p of Array.from(pointers.values())) endPointer({ pointerId: p.id, clientX: p.x, clientY: p.y }, true);
  }
  function startRituals() {
    const t = nowS();
    for (const p of pointers.values()) {
      if (!p.purple || p.partner || p.ritual) continue;
      const o = p.orb;
      if (!o || o.dead || o.type !== 'blue' || o.state !== 'held' || t - p.t0 < 0.3) continue;
      p.ritual = new Ritual(p, o, null);
      rituals.push(p.ritual);
      flashHint('Mavi ile Kırmızı birleşiyor… bırakma!', 1.6);
    }
  }

  function drawLink(a, b, k) {
    const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    g.addColorStop(0, '#66b8ff');
    g.addColorStop(0.5, '#d08cff');
    g.addColorStop(1, '#ff5a5a');
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = g;
    ctx.lineCap = 'round';
    const d = Math.hypot(a.x - b.x, a.y - b.y), n = 1 + Math.round(k * 2);
    for (let i = 0; i < n; i++) {
      ctx.globalAlpha = 0.25 + 0.55 * k;
      ctx.lineWidth = 1 + 2.5 * k;
      bolt(a.x, a.y, b.x, b.y, 10, d * (0.1 + 0.08 * (1 - k)));
      ctx.stroke();
    }
    drawGlow(SPR.violet, (a.x + b.x) / 2, (a.y + b.y) / 2, U * (4 + 10 * k), 0.25 + 0.5 * k);
  }
  function drawLinks() {
    const fd = fuseDist(), span = Math.max(W, H) * 0.6;
    for (const p of pointers.values()) {
      if (!p.partner) continue;
      const a = p.orb, b = p.partner.orb;
      if (!a || !b || a.dead || b.dead || a.type !== 'blue' || b.type !== 'red') continue;
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      drawLink(a, b, clamp(1 - (d - fd) / span, 0, 1));
    }
    for (const r of rituals) if (!r.dead) drawLink(r.blue, r.red, clamp(r.t / r.T, 0, 1));
  }
  function drawAims() {
    for (const p of pointers.values()) {
      if (!p.aim) continue;
      const dx = p.x - p.sx, dy = p.y - p.sy, swipe = Math.hypot(dx, dy) > 28;
      for (const o of p.aim) {
        if (o.dead || o.state !== 'hover') continue;
        let ax = swipe ? dx : p.x - o.x, ay = swipe ? dy : p.y - o.y;
        const l = Math.hypot(ax, ay) || 1;
        ax /= l;
        ay /= l;
        const len = Math.max(W, H);
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = '#c99bff';
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.6;
        ctx.setLineDash([10, 12]);
        ctx.lineDashOffset = -time * 60;
        ctx.beginPath();
        ctx.moveTo(o.x + ax * o.r * 1.1, o.y + ay * o.r * 1.1);
        ctx.lineTo(o.x + ax * len, o.y + ay * len);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', (e) => endPointer(e, false));
  canvas.addEventListener('pointercancel', (e) => endPointer(e, true));
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  for (const type of ['touchstart', 'touchmove', 'touchend']) canvas.addEventListener(type, (e) => e.preventDefault(), { passive: false });
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  window.addEventListener('blur', releaseAllPointers);

  /* ═════════ giriş ekranı gösterisi ═════════ */
  let attractT = 1.0;
  function updateAttract(dt) {
    attractT -= dt;
    if (attractT > 0) return;
    if (orbs.some((o) => o.type === 'purple' && !o.dead) || rituals.length) { attractT = 0.5; return; }
    attractT = 5.2;
    const left = Math.random() < 0.5;
    const sx = W * (left ? rand(0.12, 0.3) : rand(0.7, 0.88)), sy = groundY * rand(0.18, 0.34);
    const tx = W * (left ? rand(0.55, 0.95) : rand(0.05, 0.45)), ty = groundY * rand(0.6, 0.95);
    const fake = { id: -1, x: sx, y: sy, ritual: null };
    const b = new Blue(sx, sy, fake);
    b.noChant = true;
    orbs.push(b);
    rituals.push(new Ritual(fake, b, { x: tx - sx, y: ty - sy }));
  }

  /* ═════════ arayüz ═════════ */
  const techBtns = Array.from(document.querySelectorAll('.tech[data-mode]'));
  function setMode(m, silent) {
    if (!HINTS[m]) return;
    const changed = m !== mode;
    mode = m;
    document.body.dataset.mode = m;
    for (const b of techBtns) {
      const on = b.dataset.mode === m;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    hintTimer = 0;
    baseHint(HINTS[m]);
    if (changed && !silent) sfx.ui();
  }
  for (const b of techBtns) {
    b.addEventListener('pointerdown', (e) => { e.preventDefault(); setMode(b.dataset.mode); });
    b.addEventListener('click', () => setMode(b.dataset.mode));
  }
  $('btn-domain').addEventListener('click', startDomain);
  $('btn-repair').addEventListener('click', startRepair);

  const btnSound = $('btn-sound');
  btnSound.addEventListener('click', () => {
    sfx.init();
    const m = !sfx.muted;
    sfx.setMuted(m);
    btnSound.setAttribute('aria-pressed', m ? 'true' : 'false');
    btnSound.setAttribute('aria-label', m ? 'Sesi aç' : 'Sesi kapat');
  });

  const help = $('help');
  function openHelp() { releaseAllPointers(); help.hidden = false; sfx.ui(); $('btn-help-close').focus(); }
  function closeHelp() { help.hidden = true; }
  $('btn-help').addEventListener('click', openHelp);
  $('btn-help-close').addEventListener('click', closeHelp);
  help.addEventListener('click', (e) => { if (e.target === help) closeHelp(); });

  const root = document.documentElement;
  const btnFull = $('btn-full');
  const canFull = !!(document.fullscreenEnabled || document.webkitFullscreenEnabled) && !!(root.requestFullscreen || root.webkitRequestFullscreen);
  btnFull.hidden = !canFull;
  btnFull.addEventListener('click', () => {
    const d = document;
    try {
      if (d.fullscreenElement || d.webkitFullscreenElement) {
        const ex = d.exitFullscreen || d.webkitExitFullscreen;
        const r = ex && ex.call(d);
        if (r && r.catch) r.catch(() => {});
      } else {
        const req = root.requestFullscreen || root.webkitRequestFullscreen;
        const r = req.call(root, { navigationUI: 'hide' });
        if (r && r.catch) r.catch(() => {});
      }
    } catch (err) { /* tam ekran desteklenmiyor */ }
  });

  let framed = false;
  try { framed = window.self !== window.top; } catch (err) { framed = true; }
  if (framed) $('btn-back').hidden = true;

  let wakeLock = null;
  async function keepAwake() {
    try {
      if (!started || wakeLock || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } catch (err) {
      wakeLock = null;
    }
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (started) { sfx.resume(); keepAwake(); }
    } else {
      sfx.suspend();
      releaseAllPointers();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (!started) {
      if (k === 'enter' || k === ' ') { e.preventDefault(); startGame(); }
      return;
    }
    if (!help.hidden) { if (k === 'escape') closeHelp(); return; }
    if (k === '1') setMode('blue');
    else if (k === '2') setMode('red');
    else if (k === '3') setMode('purple');
    else if (k === 'd') startDomain();
    else if (k === 'r') startRepair();
    else if (k === 'm') btnSound.click();
    else if (k === 'h' || k === '?') openHelp();
  });

  const stDestroy = $('st-destroy'), stCurse = $('st-curse'), btnDomain = $('btn-domain');
  let hudT = 0, lastPct = -1, lastEx = -1, lastCd = -1;
  function updateHUD(dt) {
    hudT -= dt;
    if (hudT > 0) return;
    hudT = 0.2;
    let inChunks = 0;
    for (const ch of chunks) inChunks += ch.count;
    const pct = clamp(Math.round((1 - (liveCells + inChunks) / totalCells) * 100), 0, 100);
    if (pct !== lastPct) { stDestroy.textContent = String(pct); lastPct = pct; }
    if (exorcised !== lastEx) { stCurse.textContent = String(exorcised); lastEx = exorcised; }
    const cd = domain.state !== 'off' ? 1 : domain.cd / DOMAIN_CD;
    if (Math.abs(cd - lastCd) > 0.01 || (cd === 0 && lastCd !== 0)) {
      btnDomain.style.setProperty('--cd', cd.toFixed(3));
      btnDomain.classList.toggle('cooling', cd > 0);
      lastCd = cd;
    }
  }

  function resetScene() {
    orbs.length = 0;
    rituals.length = 0;
    debris.length = 0;
    fx.length = 0;
    smoke.length = 0;
    rings.length = 0;
    texts.length = 0;
    chunks.length = 0;
    cells.set(origCells);
    walls.set(origWalls);
    liveCells = totalCells;
    supportDirty = false;
    repair.on = false;
    renderCityFull();
    chant.owner = null;
    chantEl.classList.remove('show');
    flashA = 0;
    shakeMag = 0;
    slowT = 0;
  }

  function startGame() {
    if (started) return;
    sfx.init();
    started = true;
    resetScene();
    const intro = $('intro');
    intro.classList.add('out');
    setTimeout(() => { intro.hidden = true; }, 480);
    setMode(mode, true);
    keepAwake();
    if (document.fonts && document.fonts.load) document.fonts.load('900 24px "Noto Serif JP"', '祓').catch(() => {});
  }
  $('btn-start').addEventListener('click', startGame);

  /* ═════════ boyut değişimi ═════════ */
  function fullReset() {
    measure();
    applyCanvasSize();
    buildBackground();
    orbs.length = 0;
    rituals.length = 0;
    debris.length = 0;
    fx.length = 0;
    smoke.length = 0;
    rings.length = 0;
    texts.length = 0;
    chunks.length = 0;
    curses.length = 0;
    for (const p of pointers.values()) { p.orb = null; p.ritual = null; p.partner = null; p.aim = null; }
    buildCity();
    domain.state = 'off';
    domain.R = 0;
    repair.on = false;
    chant.owner = null;
    chantEl.classList.remove('show');
  }
  // performans düşerse çözünürlüğü azaltırken şehri korur
  function rescale() {
    applyCanvasSize();
    buildBackground();
    renderCityFull();
    for (const ch of chunks) ch.dirty = true;
  }
  let resizeTimer = 0, lastW = 0, lastH = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = Math.round(window.innerWidth), h = Math.round(window.innerHeight);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      fullReset();
    }, 160);
  });

  /* ═════════ döngü ═════════ */
  function update(dt, rdt) {
    time += dt;
    updateHint(rdt);
    if (!started) updateAttract(dt);
    startRituals();
    for (let i = rituals.length - 1; i >= 0; i--) {
      rituals[i].update(dt);
      if (rituals[i].dead) rituals.splice(i, 1);
    }
    for (let i = 0; i < orbs.length; i++) if (!orbs[i].dead) orbs[i].update(dt);
    checkFusions();
    for (let i = orbs.length - 1; i >= 0; i--) if (orbs[i].dead) orbs.splice(i, 1);
    collectFields();
    updateDebris(dt);
    updateChunks(dt);
    if (supportDirty && !repair.on) checkSupport();
    updateRepair(dt);
    updateCurses(dt);
    updateDomain(dt);
    updateParticles(dt);
    shakeMag *= Math.exp(-dt * 7);
    if (shakeMag < 0.15) shakeMag = 0;
    flashA *= Math.exp(-rdt * 6);
    if (flashA < 0.005) flashA = 0;
    flushCity();
    audioLevels();
    updateHUD(rdt);
  }

  function render() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = '#ffffff';
    for (const s of twinkles) {
      ctx.globalAlpha = 0.25 + 0.75 * Math.abs(Math.sin(time * s.f + s.p));
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }
    const sx = shakeMag ? Math.round((Math.random() * 2 - 1) * shakeMag * DPR) : 0;
    const sy = shakeMag ? Math.round((Math.random() * 2 - 1) * shakeMag * DPR) : 0;
    ctx.setTransform(DPR, 0, 0, DPR, sx, sy);
    ctx.globalAlpha = 1;
    ctx.drawImage(city, 0, 0, W, H);
    drawBeacons();
    drawChunks();
    drawDebris();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = hazeGrad;
    ctx.fillRect(0, groundY - H * 0.3, W, H * 0.3);
    drawSmoke();
    if (domain.state === 'off') drawCurses();
    else { drawDomain(); drawCurses(); }
    drawLinks();
    for (const o of orbs) if (!o.dead) o.draw();
    drawFx();
    drawRings();
    drawAims();
    drawTexts();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.drawImage(vig, 0, 0, canvas.width, canvas.height);
    if (flashA > 0) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${flashCol},${flashA.toFixed(3)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  let last = performance.now(), perfAcc = 0, perfN = 0, perfT = 0, goodT = 0;
  // Kare süresi uzun kalırsa parçacık yoğunluğu, çok uzun kalırsa çözünürlük düşer (asıl maliyet dolgu).
  function monitor(raw) {
    if (raw >= 0.1) return;
    perfAcc += raw;
    perfN++;
    perfT += raw;
    if (perfT < 1) return;
    const avg = perfAcc / perfN;
    perfAcc = perfN = perfT = 0;
    if (avg > 0.028 && dprCap > 1) {
      goodT = 0;
      dprCap = Math.max(1, dprCap - 0.5);
      quality = Math.max(0.6, quality - 0.1);
      rescale();
    } else if (avg > 0.021) {
      goodT = 0;
      if (quality > 0.5) quality = Math.max(0.5, quality - 0.15);
      else if (dprCap > 1) { dprCap = Math.max(1, dprCap - 0.5); rescale(); }
    } else if (avg < 0.018) {
      goodT += 1;
      if (goodT > 6 && quality < 1) { quality = Math.min(1, quality + 0.1); goodT = 0; }
    }
  }
  function frame(ts) {
    let raw = (ts - last) / 1000;
    last = ts;
    if (!(raw > 0)) raw = 1 / 60;
    if (raw > 0.1) raw = 0.1;
    monitor(raw);
    const rdt = Math.min(raw, 0.05);
    let dt = rdt;
    if (slowT > 0) { slowT -= rdt; dt *= slowScale; }
    update(dt, rdt);
    render();
    requestAnimationFrame(frame);
  }

  measure();
  lastW = Math.round(window.innerWidth);
  lastH = Math.round(window.innerHeight);
  applyCanvasSize();
  buildBackground();
  buildCity();
  setMode('blue', true);
  for (let i = 0; i < 2; i++) curses.push(new Curse());
  requestAnimationFrame((ts) => { last = ts; frame(ts); });
})();
