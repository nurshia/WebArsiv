# Web Siteleri

**Canlı:** https://nurshia.github.io/WebArsiv/

| Site | Demo |
|---|---|
| SwenzyBots | https://nurshia.github.io/WebArsiv/swenzy.com.tr/ |
| I. Dünya Savaşı | https://nurshia.github.io/WebArsiv/birinci-dunya-savasi/ |

Yaptığım web sitelerinin tek repoda toplanmış hâli. Her site kendi klasöründe duruyor ve
GitHub Pages üzerinden kendi alt yolundan canlı olarak yayınlanıyor.

## Yapı

```
.
├── index.html          # demo listesi (kök sayfa)
├── .nojekyll           # Jekyll işlemesini kapatır
├── birinci-dunya-savasi/  # I. Dünya Savaşı — akıllı tahta için ders haritası
│   ├── index.html · style.css · app.js
│   ├── data.js · events.js · lines.js · lesson.js · canakkale.js   # ders içeriği
│   ├── geo.js · relief.webp · canakkale-*   # harita verisi (kaynak/ ile üretildi)
│   ├── sw.js           # çevrimdışı önbellek
│   ├── fonts/          # gömülü yazı tipleri (SIL OFL)
│   └── kaynak/         # harita verisini yeniden üreten Python betikleri
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

## I. Dünya Savaşı

`birinci-dunya-savasi/` sınıftaki akıllı tahtada kullanılmak üzere hazırlanmış bir ders
haritası. Dokunmatik kullanım ve Pardus'taki Firefox ESR (115 / 128) için ayarlandı;
Chromium tabanlı tarayıcılarda da çalışır.

- **On aşama:** 1914 öncesi bloklardan Lozan'a (1923). Her aşamada sınırlar, işgal
  bölgeleri, cephe hatları, taarruz okları ve olaylar değişir; panelde anlatım, özet
  bilgiler ve olay listesi var.
- **Cepheler:** Osmanlı Devleti'nin taarruz, savunma ve yardım cepheleri; her cephenin
  amacı, komutanları, sonucu ve olayları.
- **Çanakkale ayrıntılı haritası:** ~30 m çözünürlüklü kıyı ve kabartma üstünde altı
  aşama — dış tabyaların bombardımanı, mayın hatları ve Nusret, 18 Mart, 25 Nisan
  çıkarmaları, siper savaşları, Anafartalar ve Conkbayırı, tahliye.
- **Sınıf soruları:** harita soruları "dilsiz harita" olarak sorulur (yer adları gizlenir);
  tek grup ya da iki takımla puanlı oynanır.
- **Kişiler** ve **ders notu** sayfaları (nedenler, taraflar, gizli antlaşmalar, ateşkesler
  ve barış antlaşmaları, kavramlar, tartışma soruları), haritaya çizim yapılan **kalem**,
  paneli gizleyen **sunum** modu, gündüz / gece teması, yazı boyutu ayarı.
- Parmakla kaydırma, iki parmakla yakınlaştırma, çift dokunuşla yakınlaştırma; hareket
  sırasında yalnız CSS dönüşümü uygulanır, harita hareket bitince bir kez yeniden çizilir.
- Bir kez açıldıktan sonra internet olmadan da çalışır. Klasör indirilip `index.html`
  çift tıklanarak da açılabilir (Firefox).

Klavye ve sunum kumandası: `←` `→` aşama, `+` `−` `0` yakınlaştırma, `P` sunum,
`F` tam ekran, `C` cepheler, `K` kişiler, `N` ders notu, `S` soru, `D` kalem,
`L` katmanlar, `Esc` kapat / geri.

> Pardus'ta (X11) Firefox iki parmakla yakınlaştırmayı algılamıyorsa Firefox'u
> `MOZ_USE_XINPUT2=1` ortam değişkeniyle başlatın. Haritadaki `+` `−` düğmeleri her
> durumda çalışır.

Coğrafi taban [Natural Earth](https://www.naturalearthdata.com/) (kamu malı) 1:10m
verisinden, kabartma ve Çanakkale ayrıntısı Tilezen/Mapzen arazi verisinden (SRTM,
GMTED2010, ETOPO1) üretildi; Lambert konformal konik izdüşümü kullanıldı. Yeniden üretmek
için `birinci-dunya-savasi/kaynak/README.md`. Dönem sınırları, cephe hatları ve konumlar
ders anlatımı için şematiktir.

## Notlar

- Sayfaların tamamı canlı siteden (`swenzy.com.tr`) alındı; içerik birebir aynı.
- `swenzy.com.tr/protect.js` içindeki **domain kilidi**, **Cloudflare Turnstile**
  doğrulaması ve devtools/sağ tık korumaları `github.io`, `localhost` ve iframe
  ortamlarında otomatik devre dışı kalır. Gerçek domainde hepsi eskisi gibi çalışır.
- `contact.html` formu Formspree'ye (`formspree.io/f/moeqwpyk`) gidiyor — demo
  üzerinden gönderilen mesajlar da gerçek gelen kutusuna düşer.
