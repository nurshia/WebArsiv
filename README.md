# Web Siteleri

**Canlı:** https://nurshia.github.io/WebArsiv/

| Site | Demo |
|---|---|
| SwenzyBots | https://nurshia.github.io/WebArsiv/swenzy.com.tr/ |
| Trablusgarp 1911 | https://nurshia.github.io/WebArsiv/trablusgarp/ |

Yaptığım web sitelerinin tek repoda toplanmış hâli. Her site kendi klasöründe duruyor ve
GitHub Pages üzerinden kendi alt yolundan canlı olarak yayınlanıyor.

## Yapı

```
.
├── index.html          # demo listesi (kök sayfa)
├── .nojekyll           # Jekyll işlemesini kapatır
├── trablusgarp/        # Trablusgarp 1911 — interaktif ders haritası
│   └── index.html      # tek dosya, bağımlılıksız
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

## Trablusgarp 1911

`trablusgarp/index.html` derste kullanılmak üzere hazırlanmış interaktif bir dönem haritası.
**Tek dosya, bağımlılığı yok** — indirip çift tıklayarak da açılır, internet gerekmez
(yalnızca yazı tipleri çevrimdışıyken sistem yazı tiplerine düşer).

- 1911 Akdeniz'i: Osmanlı Devleti, Trablusgarp'ın üç sancağı (Trablus · Bingazi · Fizan)
  ve çevredeki devletler
- Altı aşamalı kronoloji rayı: savaş öncesinden 1915 sonrasına kadar harita değişiyor
- Tıklanabilir ülkeler, olay işaretleri, subayların gizli geçiş yolu, donanma harekâtı
- Katmanlar: İtalyan denetimi, direniş bölgeleri, bugünkü ülke adları, koordinat ağı
- Sunum modu (paneli gizler), aydınlık/karanlık tema, klavye kısayolları
- Kişiler ve ders notu (nedenler, sonuçlar, kavramlar, tartışma soruları) örtü sayfaları

Klavye: `←` `→` dönem, `1`–`6` doğrudan dönem, `+` `−` `0` yakınlaştırma,
`S` sunum, `K` kişiler, `N` ders notu, `L` katmanlar.

Coğrafi taban [Natural Earth](https://www.naturalearthdata.com/) (kamu malı) 1:50m
verisinden üretildi; dönem sınırları modern ülke sınırlarına yaklaştırıldı, Mercator
izdüşümü kullanıldı. Sınırlar ders anlatımı için şematiktir.

## Notlar

- Sayfaların tamamı canlı siteden (`swenzy.com.tr`) alındı; içerik birebir aynı.
- `swenzy.com.tr/protect.js` içindeki **domain kilidi**, **Cloudflare Turnstile**
  doğrulaması ve devtools/sağ tık korumaları `github.io`, `localhost` ve iframe
  ortamlarında otomatik devre dışı kalır. Gerçek domainde hepsi eskisi gibi çalışır.
- `contact.html` formu Formspree'ye (`formspree.io/f/moeqwpyk`) gidiyor — demo
  üzerinden gönderilen mesajlar da gerçek gelen kutusuna düşer.
