# Web Siteleri

**Canlı:** https://nurshia.github.io/

| Site | Demo |
|---|---|
| SwenzyBots | https://nurshia.github.io/swenzy.com.tr/ |

Yaptığım web sitelerinin tek repoda toplanmış hâli. Her site kendi klasöründe duruyor ve
GitHub Pages üzerinden kendi alt yolundan canlı olarak yayınlanıyor.

## Yapı

```
.
├── index.html          # demo listesi (kök sayfa)
├── .nojekyll           # Jekyll işlemesini kapatır
└── swenzy.com.tr/      # SwenzyBots — Discord bot hizmetleri sitesi
    ├── index.html
    ├── features.html
    ├── pricing.html
    ├── contact.html
    ├── status.html
    └── legal/
        ├── privacy.html
        ├── terms.html
        ├── kvkk.html
        └── distance.html
```

## Yeni site ekleme

1. Site klasörünü repo köküne kopyala.
2. Kök `index.html` içindeki yorum satırındaki kart şablonunu kopyalayıp doldur.
3. Commit + push. Pages birkaç dakika içinde yayına alır.

Tek kural: **tüm yollar göreli olmalı.** `/style.css` gibi mutlak bir yol alt klasörde
kırılır, `style.css` veya `./style.css` çalışır.

## Yerelde çalıştırma

```bash
python3 -m http.server 4321
```

Sonra tarayıcıdan `http://localhost:4321` adresini aç.

## Notlar

- `swenzy.com.tr/script.js` içindeki devtools/sağ tık koruması `github.io`, `localhost`
  ve iframe ortamlarında otomatik olarak devre dışı kalır. Gerçek domainde çalışmaya
  devam eder.
- `legal/` altındaki dökümanlarda sarı ile işaretli `[köşeli parantez]` alanlar
  doldurulmayı bekliyor (şirket ünvanı, adres, e-posta, yetkili şehir).
