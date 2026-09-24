# Harita verisini yeniden üretme

Uygulama bu klasörü kullanmaz; buradaki betikler üst klasördeki `geo.js`, `relief.webp`,
`canakkale-geo.js`, `canakkale-g.webp` ve `canakkale-n.webp` dosyalarını üretir.
İçerik (aşamalar, olaylar, çizgiler, sorular) elle yazılmıştır ve `data.js`, `events.js`,
`lines.js`, `lesson.js`, `canakkale.js` dosyalarındadır; onları değiştirmek için bu
betiklere gerek yoktur.

## Gerekenler

```bash
pip install pyshp numpy "shapely>=2.1" pillow scikit-image scipy
```

`shapely` 2.1 ve üstü (GEOS 3.12+) gerekir: ülke sınırları `coverage_simplify` ile, komşu
sınırlar kaymadan sadeleştirilir.

[Natural Earth](https://www.naturalearthdata.com/) 1:10m verisinden şu shapefile'ları
`ne/` klasörüne açın:

- `ne_10m_admin_0_countries`
- `ne_10m_admin_1_states_provinces`
- `ne_10m_lakes`
- `ne_10m_rivers_lake_centerlines`
- `ne_10m_geography_regions_polys`

Kabartma için yükseklik karoları (Tilezen/Mapzen "terrarium", SRTM · GMTED2010 · ETOPO1)
betik çalışırken indirilir ve `.onbellek/` klasöründe saklanır.

## Adımlar

```bash
mkdir -p cikti
python3 build_geo.py --ne ne --out cikti/geo.js          # ülkeler, sınırlar, kıyı; cikti/land.wkb
python3 relief.py --land cikti/land.wkb --out cikti/relief.webp \
        --res 3.2 --q 50 --aq 35 --cut 0.06 --lv 20       # genel harita kabartması + cikti/bathy.json
python3 build_geo.py --ne ne --out cikti/geo.js          # derinlik eğrilerini geo.js'e katmak için yeniden
python3 canakkale.py --out cikti                         # Çanakkale ayrıntısı (~30 m çözünürlük)
cp cikti/geo.js cikti/relief.webp cikti/canakkale-geo.js cikti/canakkale-*.webp ..
```

## Dosyalar

| Dosya | İşi |
|---|---|
| `atoms.py` | 1914–1923 arasında sahibi değişmeyen en küçük toprak parçaları ("atom"): modern idari birimlerden türetilir, tarihî sınırlar elle çizilmiş çizgilerle kesilir |
| `build_geo.py` | Atomları, komşu sınırlarını, kıyıyı, ırmakları, gölleri, koordinat ağını ve işgal bölgelerini Lambert konformal konik izdüşümünde (km) SVG yoluna çevirir |
| `zones.json`, `prov_zones.json` | İşgal bölgeleri ve Mondros / Sevr il grupları |
| `relief.py` | Genel harita için tepe gölgesi (yalnız karada, saydam WebP) ve deniz derinliği eğrileri |
| `canakkale.py` | Çanakkale ayrıntısı: yükseklik verisinin 0,5 m eğrisinden kıyı, kıyıya koşut su çizgileri, Boğaz'daki mayın hatları ve iki tema için renkli kabartma |

Dönem sınırları, cephe hatları ve konumlar ders anlatımı için şematiktir.
