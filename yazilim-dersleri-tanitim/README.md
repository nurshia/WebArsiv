# Yazılım Dersleri — Instagram Tanıtım Videosu

HTML + JavaScript ile yapılmış, kare kare MP4'e çevrilen 24 saniyelik reklam videosu.
Müzik ve ses efektleri de tarayıcıda kodla sentezleniyor. Yani telif derdi yok.

| Dosya | Ne için |
|---|---|
| `cikti/yazilim-dersleri-reels.mp4` | **9:16 (1080×1920)**: Reels, Hikâye ve Reels reklamı |
| `cikti/yazilim-dersleri-4x5.mp4` | **4:5 (1080×1350)**: akış (feed) gönderisi ve feed reklamı (`node render.mjs --format feed` ile üretilir) |
| `cikti/kapak-reels.jpg` | Reels kapak görseli / küçük resim |

Önizleme (sesli, oynatıcılı): `index.html` dosyasını tarayıcıda aç, ya da
GitHub Pages'te: https://nurshia.github.io/WebArsiv/yazilim-dersleri-tanitim/

## Akış (120 BPM, sahneler müziğin vuruşlarına oturuyor)

| Saniye | Sahne |
|---|---|
| 0–3 | **Kanca**: "Kod yazmayı öğrenmek ister misin?" daktiloyla yazılır |
| 3–6 | **Sorun**: "Ama nereden başlayacağını bilmiyor musun?" ve etrafta uçuşan hata kartları |
| 6 | **Drop**: flaş, şok dalgası, müzik tam girer |
| 6–10 | **YAZILIM DERSLERİ** başlığı, kod editöründe `gelecek.py` yazılır |
| 10–14.5 | **Konular**: Python, JavaScript, HTML & CSS, React, SQL, Git… |
| 14.5–19 | **Avantajlar**: 4 madde, tik animasyonlarıyla |
| 19–24 | **Çağrı**: "Geleceğini kodlamaya hazır mısın?", **Hemen DM at** butonu ve DM balonu |

## Yazıları değiştirmek

`index.html` içindeki `CONFIG` bloğunda videodaki tüm metinler var: marka adı, konular,
avantajlar, buton yazısı, kullanıcı adı (`kullaniciAdi: '@hesabin'`), DM balonu ve kod parçası.
Değiştirip kaydet, tarayıcıda önizle, sonra videoyu yeniden üret.

> Avantaj maddeleri ("Birebir ilgi ve destek", "Sana uygun ders saatleri" gibi) örnek olarak
> yazıldı. Reklamda sadece gerçekten sunduğun şeyler kalsın.

## Videoyu yeniden üretmek

Gerekenler: [Node.js](https://nodejs.org) 18+

```bash
cd yazilim-dersleri-tanitim
npm install                       # playwright + ffmpeg (otomatik iner)
npx playwright install chromium   # ilk seferde bir kez
node render.mjs                   # 9:16 + 4:5 videoları ve kapakları cikti/ klasörüne yazar
```

Seçenekler:

```bash
node render.mjs --format reels    # sadece 9:16
node render.mjs --format feed     # sadece 4:5
node render.mjs --sessiz          # ek olarak müziksiz kopya (Instagram'dan müzik eklemek için)
node render.mjs --kare 3,8.2,21   # video yerine o saniyelerden PNG kareler (hızlı kontrol)
node render.mjs --kapak 8.2       # kapak görselinin alınacağı saniye
```

## Instagram'a yüklerken

- **Reels:** `yazilim-dersleri-reels.mp4` dosyasını yükle, kapak olarak `kapak-reels.jpg` seç.
  Trend bir şarkı kullanmak istersen `--sessiz` ile müziksiz kopyayı üret, müziği Instagram'da ekle.
- **Reklam (Meta Ads Manager):** Reels/Hikâye yerleşimi için 9:16, akış için 4:5 dosyayı ver.
  Önemli yazılar üstteki 250 px ve alttaki ~400 px'lik alana girmeyecek şekilde yerleştirildi
  (Instagram arayüzü bu alanları kapatıyor). Önizlemedeki **Güvenli alan** kutusuyla kontrol edebilirsin.
- **Açıklama önerisi:** "Yazılım öğrenmek istiyor ama nereden başlayacağını bilmiyor musun?
  Sıfırdan, adım adım, gerçek projelerle 💻 Detaylar için DM at! #yazılım #python #javascript #kodlama"

## Teknik not

`render.mjs` sayfayı Playwright ile başsız Chromium'da açar. Her kare için `renderFrame(t)` çağırır,
ekran görüntüsünü ffmpeg'e (H.264, yuv420p, 30 fps) aktarır. Müzik aynı sayfada `OfflineAudioContext`
ile üretilip AAC olarak eklenir. Animasyon zamana bağlı hesaplandığı için her üretim birebir aynı çıkar.

Fontlar: Plus Jakarta Sans ve JetBrains Mono (SIL Open Font License, `fonts/` klasöründe).
