# Web Siteleri

**Canlı:** https://nurshia.github.io/WebArsiv/

| Site | Demo |
|---|---|
| SwenzyBots | https://nurshia.github.io/WebArsiv/swenzy.com.tr/ |
| Hollow Purple | https://nurshia.github.io/WebArsiv/hollow-purple/ |

Yaptığım web sitelerinin tek repoda toplanmış hâli. Her site kendi klasöründe duruyor ve
GitHub Pages üzerinden kendi alt yolundan canlı olarak yayınlanıyor.

## Yapı

```
.
├── index.html          # demo listesi (kök sayfa)
├── .nojekyll           # Jekyll işlemesini kapatır
├── swenzy.com.tr/      # SwenzyBots — Discord bot hizmetleri sitesi
│   ├── index.html
│   ├── features.html
│   ├── pricing.html
│   ├── contact.html
│   ├── status.html
│   ├── style.css
│   ├── script.js
│   ├── navbar.js
│   ├── protect.js
│   └── legal/
│       ├── legal.css
│       ├── privacy.html
│       ├── terms.html
│       ├── kvkk.html
│       └── distance.html
└── hollow-purple/      # Gojo'nun Mavi/Kırmızı/Mor teknikleri — dokunmatik simülatör
    ├── index.html
    ├── style.css
    └── game.js
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
- `hollow-purple/` kütüphanesiz çalışır (Canvas 2D + Pointer Events + Web Audio); sesler
  dosya değil, tarayıcıda sentezlenir. Tablette çoklu dokunma için yapıldı:
  - **蒼 Mavi:** basılı tut → çeker, sürükle → süpürür, kaydırıp bırak → fırlar.
  - **赫 Kırmızı:** dokun → patlar, basılı tut → güç toplar, kaydırıp bırak → mermi.
  - **茈 Mor:** tek parmakla basılı tut (Mavi ile Kırmızı dönerek birleşir) ya da iki
    parmağı birbirine yaklaştır; sonra kaydırıp fırlat. Kaydırmadan bırakırsan havada
    bekler, hedefe dokununca fırlar. Maviye Kırmızı fırlatmak da Mor yapar.
  - **領域 Alan Açılımı** lanetleri dondurup yok eder, **反転 Onar** şehri geri kurar.
  - Mor'un Japonca yazı tipi, Google Fonts'tan yalnızca kullanılan karakterlerle
    (`text=` alt kümesi) yüklenir; `index.html` ya da `game.js`'e yeni kanji eklenirse
    o bağlantıdaki listeye de eklenmeli.
