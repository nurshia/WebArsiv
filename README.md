# Web Siteleri

**Canlı:** https://nurshia.github.io/WebArsiv/

| Site | Demo |
|---|---|
| SwenzyBots | https://nurshia.github.io/WebArsiv/swenzy.com.tr/ |

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
    ├── style.css
    ├── script.js
    ├── navbar.js
    ├── protect.js
    └── legal/
        ├── legal.css
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

- Sayfaların tamamı canlı siteden (`swenzy.com.tr`) alındı; içerik birebir aynı.
- `swenzy.com.tr/protect.js` içindeki **domain kilidi**, **Cloudflare Turnstile**
  doğrulaması ve devtools/sağ tık korumaları `github.io`, `localhost` ve iframe
  ortamlarında otomatik devre dışı kalır. Gerçek domainde hepsi eskisi gibi çalışır.
- `contact.html` formu Formspree'ye (`formspree.io/f/moeqwpyk`) gidiyor — demo
  üzerinden gönderilen mesajlar da gerçek gelen kutusuna düşer.
