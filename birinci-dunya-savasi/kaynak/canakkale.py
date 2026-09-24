#!/usr/bin/env python3
"""Çanakkale ayrıntı haritası — fiziki taban.

Girdi : Tilezen/Mapzen 'terrarium' yükseklik karoları, z12 (~30 m; SRTM)
Çıktı : canakkale-geo.js  (window.GEOC = {...}) — ana haritayla AYNI LCC izdüşümünde,
        km cinsinden; yollar 10 m'lik tamsayı birimlerle ve göreli komutlarla yazılır
        (kıyı, göller, kıyıya koşut su çizgileri, Boğaz'daki mayın hatları).
        canakkale-g.webp / canakkale-n.webp — gündüz / gece teması için pişmiş renkli
        kabartma (yükseltiye göre renk × tepe gölgesi + kıyıda sığ deniz tonu).

Kullanım: python3 canakkale.py --out cikti --res 0.032 --q 60
"""
import argparse, json, math, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import shapely
from shapely.geometry import Polygon, MultiPolygon, LineString, MultiLineString, box
from shapely.ops import unary_union
from skimage import measure
from skimage.filters import gaussian
from scipy import ndimage
from shapely.ops import substring
from build_geo import proj_xy, X0, Y1
from relief import inv_lcc, merc_px, bilinear, hillshade

Z = 12
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".onbellek", "z12")
LL = (25.70, 39.925, 26.85, 40.525)   # lon0, lat0, lon1, lat1 (kapsanan alan)
U = 0.01                               # yol birimi: 10 m


def fetch(xs, ys):
    os.makedirs(CACHE, exist_ok=True)
    procs = []
    for x in xs:
        for y in ys:
            p = os.path.join(CACHE, f"{Z}_{x}_{y}.png")
            if os.path.exists(p) and os.path.getsize(p) > 100:
                continue
            procs.append(subprocess.Popen(["curl", "-sS", "-o", p, URL.format(z=Z, x=x, y=y)]))
            if len(procs) >= 12:
                for q in procs: q.wait()
                procs = []
    for q in procs: q.wait()


def mosaic(xs, ys):
    out = np.zeros((len(ys)*256, len(xs)*256), np.float32)
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            im = np.asarray(Image.open(os.path.join(CACHE, f"{Z}_{x}_{y}.png")).convert("RGB"), np.float32)
            out[i*256:(i+1)*256, j*256:(j+1)*256] = im[:, :, 0]*256 + im[:, :, 1] + im[:, :, 2]/256 - 32768
    return out


def to_map_xy(lon, lat):
    x, y = proj_xy(lon, lat)
    return x - X0, Y1 - y


class Enc:
    """Tamsayı (10 m) göreli SVG yol yazıcı; orijin ayrıntı kutusunun sol üst köşesi."""
    def __init__(self, ox, oy):
        self.ox, self.oy = ox, oy

    def ring(self, coords, closed=True):
        pts = [(int(round((x - self.ox)/U)), int(round((y - self.oy)/U))) for x, y in coords]
        # ardışık aynı noktaları at
        q = [pts[0]]
        for p in pts[1:]:
            if p != q[-1]: q.append(p)
        if closed and len(q) > 1 and q[-1] == q[0]: q.pop()
        if len(q) < (3 if closed else 2): return ""
        s = f"M{q[0][0]} {q[0][1]}l"
        px, py = q[0]
        k = 0
        for x, y in q[1:]:
            for v in (x - px, y - py):
                if k and v >= 0: s += " "
                s += str(v); k += 1
            px, py = x, y
        return s + ("z" if closed else "")

    def poly(self, g, min_area=0.0):
        out = []
        for p in getattr(g, "geoms", [g]):
            if p.is_empty or p.geom_type != "Polygon" or p.area < min_area: continue
            out.append(self.ring(list(p.exterior.coords)))
            for r in p.interiors:
                if Polygon(r).area >= min_area:
                    out.append(self.ring(list(r.coords)))
        return "".join(out)

    def lines(self, g, min_len=0.0):
        out = []
        for l in getattr(g, "geoms", [g]):
            if l.is_empty: continue
            if l.geom_type == "LinearRing": l = LineString(l.coords)
            if l.geom_type != "LineString" or l.length < min_len: continue
            out.append(self.ring(list(l.coords), closed=False))
        return "".join(out)


def contour_polys(arr, level, kx, ky, ox, oy, min_area):
    """arr ızgarasında level eşik çizgisinden çokgenler (xor ile delikler doğru kurulur)."""
    cs = measure.find_contours(np.pad(arr, 1, constant_values=-9999), level)
    polys = []
    for c in cs:
        if len(c) < 6: continue
        pts = [(ox + (x - 1 + .5)*kx, oy + (y - 1 + .5)*ky) for y, x in c]
        pg = Polygon(pts)
        if not pg.is_valid: pg = pg.buffer(0)
        if pg.is_empty or pg.area < min_area: continue
        polys.append(pg)
    g = Polygon()
    for pg in sorted(polys, key=lambda q: -q.area):
        g = g.symmetric_difference(pg)
    return g.buffer(0)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--res", type=float, default=0.032, help="kabartma km/piksel")
    ap.add_argument("--q", type=int, default=60, help="WebP kalitesi")
    a = ap.parse_args()

    # ---- ayrıntı kutusu (harita km): lon/lat kutusunun LCC'deki iç dikdörtgeni
    lo = np.linspace(LL[0], LL[2], 60); la = np.linspace(LL[1], LL[3], 60)
    bx = [to_map_xy(lo, np.full_like(lo, LL[1])), to_map_xy(lo, np.full_like(lo, LL[3])),
          to_map_xy(np.full_like(la, LL[0]), la), to_map_xy(np.full_like(la, LL[2]), la)]
    x0 = float(np.max(bx[2][0])); x1 = float(np.min(bx[3][0]))     # batı / doğu kenarın içi
    y0 = float(np.max(bx[1][1])); y1 = float(np.min(bx[0][1]))     # kuzey / güney kenarın içi
    x0, y0 = math.ceil(x0), math.ceil(y0); x1, y1 = math.floor(x1), math.floor(y1)
    W, H = x1 - x0, y1 - y0
    print(f"kutu x {x0}..{x1} ({W} km), y {y0}..{y1} ({H} km)", file=sys.stderr)

    # ---- DEM'i LCC ızgarasına örnekle (vektörler için 2× ince ızgara)
    rv = a.res / 2
    ow, oh = int(round(W/rv)), int(round(H/rv))
    jj, ii = np.meshgrid(np.arange(ow), np.arange(oh))
    mx = x0 + (jj + .5)*(W/ow); my = y0 + (ii + .5)*(H/oh)
    lon, lat = inv_lcc(mx, my)
    px, py = merc_px(lon, lat, Z)
    tx0, tx1 = int(px.min()//256), int(px.max()//256)
    ty0, ty1 = int(py.min()//256), int(py.max()//256)
    xs, ys = list(range(tx0, tx1+1)), list(range(ty0, ty1+1))
    fetch(xs, ys)
    dem = mosaic(xs, ys)
    elev = bilinear(dem, px - tx0*256, py - ty0*256).astype(np.float32)
    kx, ky = W/ow, H/oh
    print(f"ızgara {ow}×{oh}, yükseklik {elev.min():.0f}..{elev.max():.0f} m", file=sys.stderr)

    # ---- kıyı: 0,5 m eşiği (deniz bu veride 0)
    esm = gaussian(elev, sigma=0.8, preserve_range=True).astype(np.float32)
    land = contour_polys(esm, 0.5, kx, ky, x0, y0, 0.004)
    land = land.simplify(0.012).buffer(0)
    frame = box(x0, y0, x1, y1)
    land = land.intersection(frame)
    # iç sular (denize bağlı olmayan boşluklar): göl
    lakes = []
    polys = list(getattr(land, "geoms", [land]))
    for p in polys:
        for r in p.interiors:
            q = Polygon(r)
            if q.area > 0.02: lakes.append(q)
    lakes = unary_union(lakes) if lakes else Polygon()
    print(f"kara {land.area:.0f} km², göl {lakes.area:.2f} km²", file=sys.stderr)

    # ---- kıyıya koşut su çizgileri (eski harita üslubu)
    seaf = frame.difference(land)
    wl = []
    for d in (0.16, 0.38, 0.7):
        b = land.buffer(d, resolution=6).simplify(0.02)
        bd = b.boundary.intersection(seaf.buffer(-0.02))
        wl.append(bd)

    enc = Enc(x0, y0)
    out = {
        "bnd": [x0, y0, x1, y1],
        "u": U,
        "land": enc.poly(land, 0.004),
        "lake": enc.poly(lakes, 0.02),
        "wl": [enc.lines(g, 0.4) for g in wl],
    }

    # ---- Boğaz'daki mayın hatları (şematik): Kepez ile dar geçit arasında kıyıdan kıyıya
    mines = []
    for i in range(10):
        lat = 40.1065 + i*0.0036
        lo = np.linspace(26.28, 26.43, 200)
        xs_, ys_ = to_map_xy(lo, np.full_like(lo, lat))
        ln = LineString(list(zip(xs_, ys_))).intersection(seaf)
        xm, _ = to_map_xy(26.372, lat)
        best = None
        for piece in getattr(ln, "geoms", [ln]):
            if piece.geom_type != "LineString": continue
            bx0, _, bx1, _ = piece.bounds
            if bx0 - 1 <= xm <= bx1 + 1 and (best is None or piece.length > best.length): best = piece
        if best is None or best.length < .5: continue
        mines.append(substring(best, .15, best.length - .15))
    out["mines"] = enc.lines(MultiLineString(mines) if mines else LineString(), 0.2)
    print(f"  mayın hatları: {len(mines)}", file=sys.stderr)

    # ---- pişmiş renkli kabartma (gündüz / gece): hipsometrik renk × tepe gölgesi + sığ deniz
    fw, fh = int(round(W/a.res)), int(round(H/a.res))
    elev_c = np.asarray(Image.fromarray(elev).resize((fw, fh), Image.BILINEAR), np.float32)
    res_m = a.res*1000
    zl = np.maximum(gaussian(elev_c, sigma=.6, preserve_range=True), 0)
    hs = (hillshade(zl, res_m, 315, 45, 1.5)*.6 + hillshade(zl, res_m, 270, 55, 1.5)*.2 +
          hillshade(zl, res_m, 360, 55, 1.5)*.2)
    v = hs - math.sin(47*math.pi/180)
    shadow = np.clip(-v*1.1, 0, .6)
    light = np.clip(v*.8, 0, .32)
    mimg = Image.new("L", (fw*2, fh*2), 0)
    dr = ImageDraw.Draw(mimg)
    sx, sy = fw*2/W, fh*2/H
    for p in getattr(land, "geoms", [land]):
        dr.polygon([((x-x0)*sx, (y-y0)*sy) for x, y in p.exterior.coords], fill=255)
        for r in p.interiors:
            dr.polygon([((x-x0)*sx, (y-y0)*sy) for x, y in r.coords], fill=0)
    mask = np.asarray(mimg.resize((fw, fh), Image.LANCZOS), np.float32)/255
    dist = ndimage.distance_transform_edt(mask < .5) * a.res      # denizde kıyıya uzaklık (km)
    near = np.clip(1 - dist/1.6, 0, 1)**1.6

    def ramp(stops, x):
        xs = np.array([s[0] for s in stops], np.float32)
        out = np.zeros(x.shape + (3,), np.float32)
        for c in range(3):
            out[..., c] = np.interp(x, xs, np.array([s[1][c] for s in stops], np.float32))
        return out
    def hexc(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
    PAL = {
        "g": {"land": [(0, "#efeadc"), (60, "#e9e3cf"), (150, "#e1d7bc"), (300, "#d6c8a6"), (500, "#c9b791"), (800, "#b8a27c")],
              "sea": ("#bfd1d5", "#d4e2e3"), "sh": (58, 52, 44), "hi": (255, 253, 246), "ks": .62, "kh": .55},
        "n": {"land": [(0, "#383630"), (60, "#3c3a33"), (150, "#423f37"), (300, "#4a463c"), (500, "#534d42"), (800, "#5d5649")],
              "sea": ("#1a272d", "#22343b"), "sh": (10, 10, 9), "hi": (150, 146, 134), "ks": .7, "kh": .4},
    }
    for key, P in PAL.items():
        lc = ramp([(e, hexc(c)) for e, c in P["land"]], zl)
        sh = shadow[..., None] * P["ks"]; hi = light[..., None] * P["kh"]
        lc = lc*(1 - sh) + np.array(P["sh"], np.float32)*sh
        lc = lc*(1 - hi) + np.array(P["hi"], np.float32)*hi
        s0, s1 = np.array(hexc(P["sea"][0]), np.float32), np.array(hexc(P["sea"][1]), np.float32)
        sc = s0 + (s1 - s0)*near[..., None]
        img = sc*(1 - mask[..., None]) + lc*mask[..., None]
        im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8), "RGB")
        wp = os.path.join(a.out, f"canakkale-{key}.webp")
        im.save(wp, "WEBP", quality=a.q, method=6)
        print(f"{wp}: {os.path.getsize(wp)/1024:.0f} KB ({fw}×{fh})", file=sys.stderr)
        if key == "g": im.save(os.path.join(a.out, "canakkale_preview.jpg"), quality=88)
    out["img"] = [x0, y0, W, H]

    js = "/* Çanakkale ayrıntı haritası: fiziki taban (canakkale.py ile üretildi; SRTM/Tilezen) */\nwindow.GEOC=" + \
        json.dumps(out, separators=(",", ":"), ensure_ascii=False) + ";\n"
    jp = os.path.join(a.out, "canakkale-geo.js")
    open(jp, "w").write(js)
    print(f"{jp}: {len(js)/1024:.0f} KB  (land {len(out['land'])/1024:.0f}, " +
          f"wl {sum(len(w) for w in out['wl'])/1024:.0f}, mines {len(out['mines'])/1024:.1f})", file=sys.stderr)



if __name__ == "__main__":
    main()
