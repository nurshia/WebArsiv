#!/usr/bin/env python3
"""I. Dünya Savaşı haritası — coğrafi taban üretici.

Girdi : Natural Earth 10m (kamu malı) shapefile'ları  (--ne klasörü)
Çıktı : geo.js  (window.GEO = {...})  — SVG yol verisi, km cinsinden LCC izdüşümü

Kullanım: python3 build_geo.py --ne ne --out cikti/geo.js   (ayrıntılar: README.md)
"""
import argparse, json, math, sys, os
import shapefile
import numpy as np
import shapely
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, MultiLineString, box, Point
from shapely.ops import unary_union, polygonize
from atoms import RULES, WHOLE, POLY

# ------------------------------------------------------------------ izdüşüm (küresel LCC)
R = 6371.0
LAT1, LAT2, LAT0, LON0 = 32.0, 56.0, 40.0, 24.0
d2r = math.pi / 180
_n = math.log(math.cos(LAT1*d2r)/math.cos(LAT2*d2r)) / \
     math.log(math.tan(math.pi/4+LAT2*d2r/2)/math.tan(math.pi/4+LAT1*d2r/2))
_F = math.cos(LAT1*d2r) * math.tan(math.pi/4+LAT1*d2r/2)**_n / _n
_rho0 = R*_F / math.tan(math.pi/4+LAT0*d2r/2)**_n

def proj_xy(lon, lat):
    lon = np.asarray(lon, float); lat = np.asarray(lat, float)
    rho = R*_F / np.tan(np.pi/4 + lat*d2r/2)**_n
    th = _n*(lon-LON0)*d2r
    return rho*np.sin(th), _rho0 - rho*np.cos(th)

# harita dikdörtgeni (km, izdüşüm düzleminde)
X0, X1, Y0, Y1 = -2950.0, 3350.0, -2980.0, 2480.0
W, H = X1-X0, Y1-Y0

def to_map(geom):
    """lon/lat geometriyi harita koordinatına (sol üst köşe orijinli, y aşağı) çevir."""
    def f(c):
        x, y = proj_xy(c[:,0], c[:,1])
        return np.column_stack([x-X0, Y1-y])
    return shapely.transform(geom, f)

def densify_ll(coords, step=0.25):
    out = []
    for (a, b) in zip(coords, coords[1:]+coords[:1]):
        n = max(1, int(max(abs(b[0]-a[0]), abs(b[1]-a[1]))/step))
        for i in range(n):
            t = i/n
            out.append((a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t))
    return out

# ------------------------------------------------------------------ Natural Earth okuma
def read_shp(path, keyf=None, bbox=None):
    r = shapefile.Reader(path, encoding="utf-8")
    out = []
    for sr in r.iterShapeRecords():
        try:
            g = shape(sr.shape.__geo_interface__)
        except Exception:
            continue
        if g.is_empty: continue
        if bbox is not None and not g.intersects(bbox): continue
        if not g.is_valid: g = g.buffer(0)
        if bbox is not None: g = g.intersection(bbox)
        if g.is_empty: continue
        out.append((sr.record.as_dict(), g))
    return out

EXT_LL = box(-32, 3, 82, 72)   # okuma için geniş sınır kutusu (lon/lat)
EPS = 0.02                      # idari birim seçimlerini kıyıya taşırmak için tampon (derece)

def build_atoms(ne):
    adm0 = {}
    for rec, g in read_shp(os.path.join(ne, "ne_10m_admin_0_countries"), bbox=EXT_LL):
        a3 = rec["ADM0_A3"]
        adm0[a3] = unary_union([adm0[a3], g]) if a3 in adm0 else g
    adm1 = {}
    for rec, g in read_shp(os.path.join(ne, "ne_10m_admin_1_states_provinces"), bbox=EXT_LL):
        d = adm1.setdefault(rec["adm0_a3"], {})
        nm = rec["name"]
        d[nm] = unary_union([d[nm], g]) if nm in d else g
    polys = {k: Polygon(densify_ll(v)) for k, v in POLY.items()}

    def sel(a3, s):
        kind = s[0]
        if kind == "a1":
            gs = []
            for nm in s[1]:
                if nm not in adm1.get(a3, {}):
                    print(f"  ! {a3}: idari birim yok: {nm}", file=sys.stderr); continue
                gs.append(adm1[a3][nm])
            return unary_union(gs).buffer(EPS) if gs else Polygon()
        if kind == "poly":
            return polys[s[1]]
        if kind == "and":
            return sel(a3, s[1]).intersection(sel(a3, s[2]))
        if kind == "centroid_in":
            P = polys[s[1]]
            gs = [g for nm, g in adm1.get(a3, {}).items() if P.contains(g.representative_point())]
            return unary_union(gs).buffer(EPS) if gs else Polygon()
        raise ValueError(kind)

    parts = {}
    for a3, g0 in sorted(adm0.items()):
        if a3 in RULES:
            rem = g0
            for atom, s in RULES[a3]:
                if rem.is_empty: break
                if s is None:
                    part, rem = rem, Polygon()
                else:
                    S = sel(a3, s)
                    part = rem.intersection(S)
                    rem = rem.difference(S)
                if not part.is_empty:
                    parts.setdefault(atom, []).append(part)
            if not rem.is_empty and rem.area > 1e-4:
                print(f"  ! {a3}: atanmamış kalan alan {rem.area:.4f}", file=sys.stderr)
        elif a3 in WHOLE:
            parts.setdefault(WHOLE[a3], []).append(g0)
        else:
            print(f"  · {a3} tanımsız → 'oth'", file=sys.stderr)
            parts.setdefault("oth", []).append(g0)
    atoms = {}
    for k, gs in parts.items():
        g = unary_union(gs)
        g = shapely.make_valid(g)
        g = unary_union([p for p in getattr(g, "geoms", [g]) if p.geom_type in ("Polygon","MultiPolygon")])
        atoms[k] = g
    return atoms

def only_polys(g):
    if g.is_empty: return []
    if g.geom_type == "Polygon": return [g]
    if g.geom_type == "MultiPolygon": return list(g.geoms)
    if g.geom_type == "GeometryCollection":
        out = []
        for x in g.geoms: out += only_polys(x)
        return out
    return []

def node_coverage(atoms):
    """Kaplamayı yeniden düğümle: tüm sınırları kes, çokgenleştir, yüzleri atomlara ata.
    Böylece komşular aynı köşe noktalarını paylaşır (T-kavşağı kalmaz)."""
    keys = list(atoms)
    geoms = [atoms[k] for k in keys]
    lines = unary_union([g.boundary for g in geoms])
    faces = list(polygonize(lines))
    tree = shapely.STRtree(geoms)
    out = {k: [] for k in keys}
    for f in faces:
        p = f.representative_point()
        idx = tree.query(p, predicate="within")
        if len(idx) == 0:
            # delikler (Hazar vb.) veya kayma boşlukları
            if f.area < 50:  # küçük boşluk: en uzun ortak sınırlı komşuya ver
                best, bl = None, 0
                for i in tree.query(f):
                    l = f.boundary.intersection(geoms[i].boundary).length
                    if l > bl: best, bl = i, l
                if best is not None: out[keys[best]].append(f)
            continue
        out[keys[idx[0]]].append(f)
    return {k: unary_union(v) for k, v in out.items() if v}

# ------------------------------------------------------------------ SVG yol yazımı
def ring_path(coords, closed=True):
    pts = []
    for x, y in coords:
        q = (int(round(x)), int(round(y)))
        if not pts or q != pts[-1]: pts.append(q)
    if closed and len(pts) > 1 and pts[0] == pts[-1]: pts.pop()
    if len(pts) < (3 if closed else 2): return ""
    s = f"M{pts[0][0]} {pts[0][1]}"
    px, py = pts[0]
    seg = []
    for x, y in pts[1:]:
        seg.append(f"{x-px} {y-py}")
        px, py = x, y
    s += "l" + " ".join(seg)
    if closed: s += "z"
    # "-" öncesi boşluk gereksiz
    return s.replace(" -", "-")

def poly_path(g, min_area=0.0):
    out = []
    for p in only_polys(g):
        if p.area < min_area: continue
        out.append(ring_path(p.exterior.coords))
        for r in p.interiors:
            if Polygon(r).area >= min_area: out.append(ring_path(r.coords))
    return "".join(x for x in out if x)

def line_path(g):
    if g.is_empty: return ""
    ls = [g] if g.geom_type == "LineString" else list(getattr(g, "geoms", []))
    return "".join(ring_path(l.coords, closed=False) for l in ls if l.geom_type == "LineString")

# ------------------------------------------------------------------ ana akış
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ne", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--tol", type=float, default=2.2)
    ap.add_argument("--preview", default=None)
    a = ap.parse_args()

    print("atomlar kuruluyor…", file=sys.stderr)
    atoms_ll = build_atoms(a.ne)
    rect = box(0, 0, W, H)
    atoms = {}
    for k, g in atoms_ll.items():
        g = g.intersection(EXT_LL)
        if g.is_empty: continue
        gm = shapely.make_valid(to_map(g)).intersection(rect)
        gm = shapely.set_precision(gm, 0.001)
        if not gm.is_empty: atoms[k] = gm
    print(f"  {len(atoms)} atom", file=sys.stderr)

    print("düğümleme…", file=sys.stderr)
    atoms = node_coverage(atoms)
    keys = list(atoms)
    arr = np.array([atoms[k] for k in keys], dtype=object)
    ok = shapely.coverage_is_valid(arr)
    print(f"  kaplama geçerli: {ok}", file=sys.stderr)
    print("sadeleştirme…", file=sys.stderr)
    simp = shapely.coverage_simplify(arr, a.tol)
    atoms_s = {k: shapely.make_valid(g) for k, g in zip(keys, simp)}

    # --------------- sınır kenarları (komşu atom çiftleri) ve kıyı çizgisi
    from shapely.ops import linemerge
    tree = shapely.STRtree([atoms_s[k] for k in keys])
    edges = {}
    for i, ka in enumerate(keys):
        ga = atoms_s[ka]
        for j in tree.query(ga):
            if j <= i: continue
            kb = keys[j]
            sh = ga.boundary.intersection(atoms_s[kb].boundary)
            ls = [g for g in getattr(sh, "geoms", [sh])
                  if g.geom_type in ("LineString", "MultiLineString") and not g.is_empty]
            if not ls: continue
            u = unary_union(ls)
            if u.is_empty: continue
            m = linemerge(u) if u.geom_type == "MultiLineString" else u
            if m.length < 1: continue
            edges["|".join(sorted([ka, kb]))] = line_path(m)
    print(f"  {len(edges)} sınır kenarı", file=sys.stderr)

    # --------------- kara birleşimi, kıyı dalga çizgileri
    land = unary_union(list(atoms_s.values()))
    coast = land.boundary.difference(box(0, 0, W, H).exterior.buffer(0.05))
    coast = shapely.set_precision(coast, 0.001)
    with open(os.path.join(os.path.dirname(a.out), "land.wkb"), "wb") as f:
        f.write(shapely.to_wkb(land))
    land_raw = unary_union([atoms[k] for k in keys])
    waves = []
    for d, tol in ((9, 2.5), (20, 3.5)):
        b = land_raw.buffer(d, quad_segs=4).simplify(tol)
        lines = b.boundary.intersection(box(-5, -5, W+5, H+5))
        waves.append(line_path(shapely.set_precision(lines, 0.5)))

    # --------------- nehirler
    RIV = {"Danube":"tuna","Rhine":"ren","Vistula":"vistul","Wisla":"vistul","Dnieper":"dinyeper",
           "Dniester":"dinyester","Don":"don","Volga":"volga","Nile":"nil","Tigris":"dicle",
           "Euphrates":"firat","Marne":"marne","Somme":"somme","Meuse":"meuse","Seine":"sen",
           "Loire":"loire","Rhône":"ron","Po":"po","Isonzo":"isonzo","Soča":"isonzo","Piave":"piave",
           "Sava":"sava","Drava":"drava","Morava":"morava","Vardar":"vardar","Struma":"struma",
           "Maritsa":"meric","Evros":"meric","Kızılırmak":"kizilirmak","Sakarya":"sakarya",
           "Aras":"aras","Kura":"kura","Jordan":"seria","Prut":"prut","Elbe":"elbe","Oder":"oder",
           "Odra":"oder","Neman":"neman","Nemunas":"neman","Daugava":"dvina","Western Dvina":"dvina",
           "Bug":"bug","Western Bug":"bug","San":"san","Dunajec":"dunajec","Tisza":"tisza",
           "Mures":"mures","Olt":"olt","Siret":"siret","Aisne":"aisne","Oise":"oise","Yser":"yser",
           "Moselle":"mozel","Main":"main","Tagus":"tejo","Ebro":"ebro","Karun":"karun",
           "Orontes":"asi","Seyhan":"seyhan","Ceyhan":"ceyhan","Büyük Menderes":"menderes",
           "Gediz":"gediz","Dicle":"dicle","Firat":"firat","Kuban":"kuban","Terek":"terek",
           "Neretva":"neretva","Drina":"drina","Shkumbin":"shkumbin","Vjosë":"vjose","Tagliamento":"tagliamento",
           "Adige":"adige","Arno":"arno","Tiber":"tiber","Garonne":"garonne","Scheldt":"escaut","Escaut":"escaut",
           "Pripyat":"pripyat","Desna":"desna","Southern Bug":"gbug","Narew":"narew","Warta":"warta",
           "Neva":"neva","Velikaya":"velikaya","Berezina":"berezina"}
    rivers = {}
    for rec, g in read_shp(os.path.join(a.ne, "ne_10m_rivers_lake_centerlines"), bbox=EXT_LL):
        nm = rec.get("name") or ""
        sr = rec.get("scalerank", 9)
        key = RIV.get(nm)
        if not key and sr > 3: continue
        if rec.get("featurecla","").startswith("Lake Centerline"): continue
        gm = to_map(g).intersection(rect)
        if gm.is_empty: continue
        gm = gm.simplify(1.5)
        cls = "r1" if (sr <= 2 or key in ("tuna","nil","dicle","firat","ren","vistul","dinyeper","volga")) else "r2"
        rivers.setdefault(cls, []).append(gm)
    rivers_out = {k: line_path(shapely.set_precision(unary_union(v), 0.5)) for k, v in rivers.items()}

    # --------------- göller
    lakes = []
    for rec, g in read_shp(os.path.join(a.ne, "ne_10m_lakes"), bbox=EXT_LL):
        nm = (rec.get("name") or "")
        if "Caspian" in nm: continue
        if rec.get("scalerank", 9) > 5: continue
        gm = to_map(g).intersection(rect)
        if gm.is_empty or gm.area < 60: continue
        lakes.append(gm.simplify(1.2))
    lakes_path = poly_path(shapely.set_precision(unary_union(lakes), 0.5), 20)

    # --------------- dağlar ve çöller
    MTN = {"ALPS":"ALPLER","APPENNINI":"APENİNLER","CARPATHIAN MOUNTAINS":"KARPATLAR",
           "CAUCASUS MTS.":"KAFKAS DAĞLARI","Lesser Caucasus":"","Taurus Mts.":"TOROSLAR",
           "PONTIC MOUNTAINS":"","ZAGROS MOUNTAINS":"ZAGROS DAĞLARI","PYRENEES":"PİRENELER",
           "Dinaric Alps":"DİNAR ALPLERİ","Balkan Mts.":"BALKAN DAĞLARI","Transylvanian Alps":"",
           "Vosges":"","Ardennes":"","Pindus Mts.":"","Lebanon Mts.":"","HEJAZ MTS.":"",
           "ASIR MTS.":"","ELBURZ MTS.":"","Tatra Mts.":"","Sudetes Mts.":"","Jura":"",
           "Erzgebirge":"","Böhmerwald":"","ATLAS MOUNTAINS":"","HAUT ATLAS":"","Atlas Tellien":"",
           "KJØLEN MOUNTAINS":""}
    DES = {"SYRIAN DESERT":"SURİYE ÇÖLÜ","An Nafud Desert":"NEFUD","RUB’ AL KHALI":"RUBÜLHALİ",
           "LIBYAN DESERT":"","WESTERN DESERT":"","Negev Desert":"","Eastern Desert":"",
           "NUBIAN DESERT":"","SAHARA":"","Kavir Desert":""}
    mtn, des = [], []
    for rec, g in read_shp(os.path.join(a.ne, "ne_10m_geography_regions_polys"), bbox=EXT_LL):
        nm = rec["NAME"]
        if nm in MTN:
            gm = to_map(g).intersection(rect)
            if not gm.is_empty: mtn.append(gm.buffer(4).simplify(4))
        elif nm in DES:
            gm = to_map(g).intersection(rect)
            if not gm.is_empty: des.append(gm.simplify(6))
    mtn_path = poly_path(shapely.set_precision(unary_union(mtn).intersection(land), 1), 50)
    des_path = poly_path(shapely.set_precision(unary_union(des).intersection(land), 1), 50)

    # --------------- koordinat ağı
    grat_major, grat_minor, ticks = [], [], []
    frame = box(0, 0, W, H)
    for lon in range(-40, 95, 5):
        lats = np.arange(-5, 80.01, 0.5)
        x, y = proj_xy(np.full_like(lats, lon), lats)
        l = LineString(np.column_stack([x-X0, Y1-y])).intersection(frame)
        (grat_major if lon % 10 == 0 else grat_minor).append(l)
        if lon % 10 == 0 and not l.is_empty:
            ends = [c for part in getattr(l, "geoms", [l]) for c in (part.coords[0], part.coords[-1])]
            for cx, cy in ends:
                if cy <= 0.5: ticks.append({"t": f"{abs(lon)}°{'D' if lon >= 0 else 'B'}", "x": round(cx,1), "e": "n"})
                elif cy >= H-0.5: ticks.append({"t": f"{abs(lon)}°{'D' if lon >= 0 else 'B'}", "x": round(cx,1), "e": "s"})
    for lat in range(0, 80, 5):
        lons = np.arange(-60, 120.01, 0.5)
        x, y = proj_xy(lons, np.full_like(lons, lat))
        l = LineString(np.column_stack([x-X0, Y1-y])).intersection(frame)
        (grat_major if lat % 10 == 0 else grat_minor).append(l)
        if lat % 10 == 0 and not l.is_empty:
            ends = [c for part in getattr(l, "geoms", [l]) for c in (part.coords[0], part.coords[-1])]
            for cx, cy in ends:
                if cx <= 0.5: ticks.append({"t": f"{lat}°K", "y": round(cy,1), "e": "w"})
                elif cx >= W-0.5: ticks.append({"t": f"{lat}°K", "y": round(cy,1), "e": "e"})

    def lp(ls):
        return line_path(shapely.set_precision(unary_union([g.simplify(0.8) for g in ls if not g.is_empty]), 0.5))

    out = {
        "w": round(W), "h": round(H),
        "proj": {"R": R, "n": _n, "F": _F, "rho0": _rho0, "lon0": LON0, "x0": X0, "y1": Y1},
        "units": {k: poly_path(g, 4.0) for k, g in sorted(atoms_s.items())},
        "edges": edges,
        "coast": line_path(coast),
        "waves": waves,
        "rivers": rivers_out,
        "lakes": lakes_path,
        "mtn": mtn_path,
        "des": des_path,
        "grat": {"maj": lp(grat_major), "min": lp(grat_minor), "ticks": ticks},
    }
    # --------------- bölge çokgenleri (işgal vb.) — ayrı dosyadan
    zfile = os.path.join(os.path.dirname(os.path.abspath(__file__)), "zones.json")
    if os.path.exists(zfile):
        Z = json.load(open(zfile, encoding="utf-8"))
        zones = {}
        for zid, zd in Z.items():
            base = land if not zd.get("atoms") else unary_union([atoms_s[k] for k in zd["atoms"] if k in atoms_s])
            if "poly" in zd:
                pll = Polygon(densify_ll([tuple(p) for p in zd["poly"]], 0.2))
                zg = to_map(pll).intersection(base)
            else:
                zg = base
            zones[zid] = poly_path(shapely.set_precision(zg, 0.5), 2.0)
        out["zones"] = zones
    # --------------- Türkiye illeri (Sevr / Mondros bölgeleri için)
    pfile = os.path.join(os.path.dirname(os.path.abspath(__file__)), "prov_zones.json")
    if os.path.exists(pfile):
        P = json.load(open(pfile, encoding="utf-8"))
        adm1 = {}
        for rec, g in read_shp(os.path.join(a.ne, "ne_10m_admin_1_states_provinces"), bbox=box(24,34,46,43)):
            if rec["adm0_a3"] == "TUR": adm1[rec["name"]] = g
        tur = unary_union([atoms_s[k] for k in ("tur","kars") if k in atoms_s])
        pz = {}
        for zid, names in P.items():
            gs = [adm1[n].buffer(EPS) for n in names if n in adm1]
            miss = [n for n in names if n not in adm1]
            if miss: print("  ! il yok:", miss, file=sys.stderr)
            zg = to_map(unary_union(gs)).intersection(tur)
            pz[zid] = poly_path(shapely.set_precision(zg, 0.5), 2.0)
        out["pzones"] = pz

    bfile = os.path.join(os.path.dirname(a.out), "bathy.json")
    if os.path.exists(bfile):
        out["bathy"] = json.load(open(bfile))
    js = "window.GEO=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
    with open(a.out, "w", encoding="utf-8") as f:
        f.write("/* Coğrafi taban: Natural Earth 1:10m (kamu malı). Dönem sınırları şematiktir. */\n")
        f.write(js)
    sz = {k: len(v) for k, v in out["units"].items()}
    tot = sum(sz.values())
    print(f"geo.js {len(js)/1024:.0f} KB  (birimler {tot/1024:.0f} KB; dalga {sum(map(len,waves))/1024:.0f} KB; "
          f"nehir {sum(map(len,rivers_out.values()))/1024:.0f} KB; ağ {len(out['grat']['maj'])/1024+len(out['grat']['min'])/1024:.0f} KB)",
          file=sys.stderr)
    for k, v in sorted(sz.items(), key=lambda x: -x[1])[:12]:
        print(f"   {k:6s} {v/1024:6.1f} KB", file=sys.stderr)

    if a.preview:
        import random
        random.seed(3)
        parts = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" width="{W/2:.0f}" height="{H/2:.0f}">',
                 f'<rect width="{W:.0f}" height="{H:.0f}" fill="#bcd"/>']
        for w in waves:
            parts.append(f'<path d="{w}" fill="none" stroke="#9ab" stroke-width="1"/>')
        for k, d in out["units"].items():
            c = "#%02x%02x%02x" % (random.randint(150,240), random.randint(150,240), random.randint(150,240))
            parts.append(f'<path d="{d}" fill="{c}" stroke="#333" stroke-width="0.8"><title>{k}</title></path>')
        parts.append(f'<path d="{mtn_path}" fill="#000" opacity=".12"/>')
        parts.append(f'<path d="{lakes_path}" fill="#bcd" stroke="#678" stroke-width=".6"/>')
        for k, d in rivers_out.items():
            parts.append(f'<path d="{d}" fill="none" stroke="#468" stroke-width="{1.4 if k=="r1" else .8}"/>')
        parts.append(f'<path d="{out["grat"]["maj"]}" fill="none" stroke="#567" stroke-width=".6" opacity=".6"/>')
        for k, d in out.get("zones", {}).items():
            parts.append(f'<path d="{d}" fill="red" opacity=".35"><title>{k}</title></path>')
        # atom etiketleri
        for k, g in atoms_s.items():
            p = g.representative_point() if not g.is_empty else None
            if p is None: continue
            parts.append(f'<text x="{p.x:.0f}" y="{p.y:.0f}" font-size="22" text-anchor="middle" font-family="sans-serif">{k}</text>')
        parts.append("</svg>")
        open(a.preview, "w").write("\n".join(parts))

if __name__ == "__main__":
    main()
