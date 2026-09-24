#!/usr/bin/env python3
"""Kabartma katmanı: Tilezen/Mapzen 'terrarium' yükseklik karolarından (SRTM, GMTED2010,
ETOPO1 …) haritanın LCC ızgarasına yeniden örneklenmiş tepe gölgesi + deniz derinliği.

Çıktı: RGBA WebP. Karada: gölge = siyah (alfa), ışık = beyaz (alfa). Denizde: derinlik
arttıkça hafif koyulaşma, kıta sahanlığında hafif aydınlanma. Renkli dolguların ÜSTÜNE
serilir; böylece dönem renkleri değişse de kabartma aynı kalır.

Kullanım: python3 relief.py --land cikti/land.wkb --out cikti/relief.webp --res 3.2 --q 50 --aq 35 --cut 0.06 --lv 20
"""
import argparse, math, os, sys, subprocess, io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import shapely
from build_geo import R, _n, _F, _rho0, LON0, X0, X1, Y0, Y1, W, H, d2r

CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".onbellek", "z6")
URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"

def inv_lcc(x, y):
    """harita km (orijin sol üst, y aşağı) → lon, lat (derece)"""
    X = x + X0
    Y = Y1 - y
    dy = _rho0 - Y
    rho = np.sign(_n) * np.sqrt(X*X + dy*dy)
    th = np.arctan2(X, dy)
    lat = 2*np.arctan((R*_F/rho)**(1/_n)) - np.pi/2
    lon = LON0 + th/_n/d2r
    return lon, lat/d2r

def merc_px(lon, lat, z):
    n = 2**z * 256
    x = (lon + 180) / 360 * n
    la = np.clip(lat, -85, 85) * d2r
    y = (1 - np.log(np.tan(la) + 1/np.cos(la)) / np.pi) / 2 * n
    return x, y

def fetch(z, xs, ys):
    os.makedirs(CACHE, exist_ok=True)
    todo = []
    for x in xs:
        for y in ys:
            p = os.path.join(CACHE, f"{z}_{x}_{y}.png")
            if not os.path.exists(p) or os.path.getsize(p) < 100:
                todo.append((x, y, p))
    print(f"  {len(todo)} karo indirilecek", file=sys.stderr)
    # paralel indirme
    procs = []
    for (x, y, p) in todo:
        procs.append(subprocess.Popen(["curl", "-sS", "-o", p, URL.format(z=z, x=x, y=y)]))
        if len(procs) >= 12:
            for q in procs: q.wait()
            procs = []
    for q in procs: q.wait()

def mosaic(z, xs, ys):
    tw, th = len(xs)*256, len(ys)*256
    out = np.zeros((th, tw), np.float32)
    for i, y in enumerate(ys):
        for j, x in enumerate(xs):
            p = os.path.join(CACHE, f"{z}_{x}_{y}.png")
            im = np.asarray(Image.open(p).convert("RGB"), np.float32)
            e = im[:,:,0]*256 + im[:,:,1] + im[:,:,2]/256 - 32768
            out[i*256:(i+1)*256, j*256:(j+1)*256] = e
    return out

def bilinear(img, fx, fy):
    h, w = img.shape
    fx = np.clip(fx, 0, w-1.001); fy = np.clip(fy, 0, h-1.001)
    x0 = np.floor(fx).astype(int); y0 = np.floor(fy).astype(int)
    ax = fx - x0; ay = fy - y0
    a = img[y0, x0]; b = img[y0, x0+1]; c = img[y0+1, x0]; d = img[y0+1, x0+1]
    return (a*(1-ax)+b*ax)*(1-ay) + (c*(1-ax)+d*ax)*ay

def hillshade(z, res_m, az, alt, exag):
    gy, gx = np.gradient(z * exag, res_m)
    slope = np.arctan(np.hypot(gx, gy))
    aspect = np.arctan2(-gx, gy)
    azr = (360 - az + 90) * d2r
    altr = alt * d2r
    hs = np.sin(altr)*np.cos(slope) + np.cos(altr)*np.sin(slope)*np.cos(azr - aspect)
    return hs

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--land", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--res", type=float, default=2.6, help="km/piksel")
    ap.add_argument("--z", type=int, default=6)
    ap.add_argument("--q", type=int, default=62)
    ap.add_argument("--aq", type=int, default=60)
    ap.add_argument("--cut", type=float, default=0.05)
    ap.add_argument("--lv", type=int, default=32)
    a = ap.parse_args()

    ow, oh = int(round(W / a.res)), int(round(H / a.res))
    print(f"çıktı {ow}×{oh}", file=sys.stderr)
    # çıktı ızgarasının lon/lat'ı
    jj, ii = np.meshgrid(np.arange(ow), np.arange(oh))
    mx = (jj + 0.5) * (W / ow)
    my = (ii + 0.5) * (H / oh)
    lon, lat = inv_lcc(mx, my)
    px, py = merc_px(lon, lat, a.z)
    tx0, tx1 = int(np.floor(px.min()/256)), int(np.floor(px.max()/256))
    ty0, ty1 = int(np.floor(py.min()/256)), int(np.floor(py.max()/256))
    xs, ys = list(range(tx0, tx1+1)), list(range(ty0, ty1+1))
    print(f"karo x {tx0}-{tx1}, y {ty0}-{ty1}", file=sys.stderr)
    fetch(a.z, xs, ys)
    dem = mosaic(a.z, xs, ys)
    elev = bilinear(dem, px - tx0*256, py - ty0*256).astype(np.float32)

    # kara maskesi (vektör kıyıdan)
    land = shapely.from_wkb(open(a.land, "rb").read())
    SS = 2  # kenar yumuşatma için 2× çiz
    mimg = Image.new("L", (ow*SS, oh*SS), 0)
    dr = ImageDraw.Draw(mimg)
    sx, sy = ow*SS / W, oh*SS / H
    polys = list(getattr(land, "geoms", [land]))
    for p in polys:
        dr.polygon([(x*sx, y*sy) for x, y in p.exterior.coords], fill=255)
        for r in p.interiors:
            dr.polygon([(x*sx, y*sy) for x, y in r.coords], fill=0)
    mask = np.asarray(mimg.resize((ow, oh), Image.LANCZOS), np.float32) / 255

    res_m = a.res * 1000
    zl = np.maximum(elev, 0)
    # çok yönlü tepe gölgesi (KB ağırlıklı)
    hs = (hillshade(zl, res_m, 315, 42, 11) * 0.55 +
          hillshade(zl, res_m, 270, 50, 11) * 0.25 +
          hillshade(zl, res_m, 360, 50, 11) * 0.20)
    flat = math.sin(46 * d2r)
    v = hs - flat
    # yükseklikle artan kontrast
    hi = np.clip(zl / 2500, 0, 1)
    shadow = np.clip(-v * (0.95 + 0.6*hi), 0, 0.62)
    light = np.clip(v * (0.55 + 0.3*hi), 0, 0.30)
    # yüksek dağlara hafif açık ton (kar/kaya hissi)
    peak = np.clip((zl - 1800) / 2600, 0, 1) * 0.16
    light = np.clip(light + peak, 0, 0.40)

    # ---- deniz derinliği: vektör katmanlar (200 m sahanlık kenarı, 1000 m, 3000 m)
    from skimage import measure
    from shapely.geometry import Polygon as P2
    from shapely.ops import unary_union
    depth = np.clip(-elev, 0, None).astype(np.float32)
    from skimage.filters import gaussian
    dsm = gaussian(depth, sigma=1.6, preserve_range=True).astype(np.float32)
    kx, ky = W / ow, H / oh
    bathy = {}
    sea = shapely.box(0, 0, W, H).difference(land)
    for lvl in (200, 1000, 3000):
        cs = measure.find_contours(np.pad(dsm, 1, constant_values=0), lvl)
        polys = []
        for c in cs:
            if len(c) < 8: continue
            pts = [((x-1+0.5)*kx, (y-1+0.5)*ky) for y, x in c]
            pg = P2(pts)
            if not pg.is_valid: pg = pg.buffer(0)
            if pg.area < 400: continue
            polys.append(pg)
        # iç içe halkaları tek yönlü birleştir (xor ile delikleri doğru kur)
        g = P2()
        for pg in sorted(polys, key=lambda q: -q.area):
            g = g.symmetric_difference(pg)
        g = g.intersection(sea).simplify(3.0).buffer(0)
        from build_geo import poly_path
        bathy[str(lvl)] = poly_path(shapely.set_precision(g, 0.5), 150)
        print(f"  derinlik {lvl} m: {len(bathy[str(lvl)])/1024:.0f} KB", file=sys.stderr)
    import json
    json.dump(bathy, open(os.path.join(os.path.dirname(a.out), "bathy.json"), "w"))

    # ---- yalnız kara: alfa kademelendir (sıkıştırma için), hafif yumuşat
    a_black = shadow * mask
    a_white = light * mask
    alpha = np.clip(a_black + a_white, 0, 0.8)
    alpha = np.asarray(Image.fromarray((alpha*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)), np.float32)/255
    alpha = np.where(alpha < a.cut, 0, alpha)
    alpha = np.round(alpha * a.lv) / a.lv
    wfrac = np.where(alpha > 1e-3, a_white / np.maximum(a_black + a_white, 1e-4), 0)
    wfrac = np.round(wfrac * 12) / 12
    rgb = (wfrac * 255).astype(np.uint8)
    out = np.dstack([rgb, rgb, rgb, (alpha * 255).astype(np.uint8)])
    im = Image.fromarray(out, "RGBA")
    im.save(a.out, "WEBP", quality=a.q, method=6, alpha_quality=a.aq)
    print(f"{a.out}: {os.path.getsize(a.out)/1024:.0f} KB", file=sys.stderr)
    base = Image.new("RGBA", (ow, oh), (200, 214, 218, 255))
    landc = Image.new("RGBA", (ow, oh), (232, 224, 205, 255))
    base = Image.composite(landc, base, Image.fromarray((mask*255).astype(np.uint8)))
    base.alpha_composite(im)
    base.convert("RGB").save(os.path.splitext(a.out)[0] + "_preview.jpg", quality=85)

if __name__ == "__main__":
    main()
