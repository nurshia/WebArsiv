/* Çanakkale Savaşları — ayrıntılı harita içeriği.
   Koordinatlar [boylam, enlem]. Cephe hatları, çıkarma okları ve batık yerleri ders için
   yaklaşık çizilmiştir. Fiziki taban (kıyı, kabartma) canakkale-geo.js'tedir. */
(function () {
"use strict";
var D = window.D;

D.C = {
  /* kapsanan alan ve genel görünüm */
  view: [26.08, 39.975, 26.72, 40.44],

  /* ---------------------------------------------------------------- aşamalar */
  ST: [
{ yr:"Şub–Mar 1915", nm:"Boğaz savunması", date:"19 Şubat – 17 Mart 1915",
  t:"İtilaf donanması Boğaz’a yükleniyor",
  view:[26.07, 39.965, 26.47, 40.205],
  lede:`İngiliz ve Fransız donanması, Çanakkale Boğazı’nı yalnız savaş gemileriyle geçip
        İstanbul’a ulaşmayı planladı. İlk hedef, Boğaz’ın girişindeki dış tabyalardı.`,
  body:[`<b>19 Şubat 1915</b>’te Seddülbahir, Ertuğrul, Kumkale ve Orhaniye tabyaları bombalandı.
         25 Şubat’taki yoğun ateşten sonra dış tabyalar susturuldu; küçük birlikler Seddülbahir’e ve
         Kumkale’ye çıkıp topları tahrip etmeye çalıştı.`,
        `Boğaz’ın asıl savunması içerideydi. Kilitbahir ile Çanakkale arasındaki <b>en dar yer</b>
         (yaklaşık 1,3 km) güçlü kıyı tabyalarıyla, Kepez’den bu dar yere kadar olan sular ise
         sıra sıra <b>mayın hatlarıyla</b> korunuyordu. Seyyar obüs bataryaları, mayınları temizlemeye
         çalışan tarama gemilerini sürekli ateş altında tuttu.`,
        `<b>8 Mart gecesi</b> Nusret mayın gemisi, İtilaf gemilerinin dönüş manevrası yaptığı
         <b>Erenköy Koyu</b>’na, kıyıya koşut <b>26 mayın</b> döktü. Bu hat fark edilmedi.`],
  facts:[["Dış tabyalar","Seddülbahir, Ertuğrul, Kumkale, Orhaniye"],
         ["Boğaz’ın en dar yeri","Kilitbahir – Çanakkale, yaklaşık 1,3 km"],
         ["Mayınlar","Kepez ile dar geçit arasında sıra sıra mayın hatları"]],
  ev:["c_dis","c_nusret"], arrows:["c_n_dis1","c_n_dis2"], forts:1, mines:1 },

{ yr:"18 Mart 1915", nm:"Deniz zaferi", date:"18 Mart 1915",
  t:"18 Mart: Boğaz geçilemez",
  view:[26.15, 39.99, 26.45, 40.175],
  lede:`İtilaf donanması Boğaz’ı büyük bir filoyla zorladı. Kıyı tabyalarının ateşi ve
        Nusret’in mayınları karşısında ağır kayıplar verip geri çekildi.`,
  body:[`Sabah İngiliz zırhlıları Erenköy Koyu’na girip Boğaz’ın dar yerindeki tabyaları dövdü;
         öğleden sonra Fransız gemileri daha da içeri sokuldu. Rumeli Mecidiye, Hamidiye ve
         Namazgah tabyaları karşılık verdi.`,
        `Geri dönmek için Erenköy Koyu’nda manevra yapan Fransız zırhlısı <b>Bouvet</b> Nusret’in
         mayınına çarpıp dakikalar içinde battı. Ardından İngiliz zırhlıları <b>Irresistible</b> ve
         <b>Ocean</b> da mayınlara çarparak battı; <b>Inflexible</b>, <b>Suffren</b> ve <b>Gaulois</b> ağır hasar aldı.`,
        `Donanma bir daha Boğaz’ı geçmeyi denemedi. İtilaf Devletleri, tabyaları karadan
         susturmak için <b>Gelibolu Yarımadası’na asker çıkarmaya</b> karar verdi.`],
  osmH:"Seyit Onbaşı",
  osm:`Rumeli Mecidiye Tabyası’nda vinci bozulan topun ağır mermisini sırtında taşıyarak atışın
       sürmesini sağlayan <b>Seyit Onbaşı</b>, 18 Mart’ın simgesi oldu.`,
  facts:[["Batan gemiler","Bouvet, Irresistible, Ocean"],
         ["Ağır hasar","Inflexible, Suffren, Gaulois"],
         ["Sonuç","Donanma çekildi, kara savaşlarına geçildi"]],
  ev:["c_18m","c_batan","c_seyit","c_nusret"], arrows:["c_n_filo"], forts:1, mines:1, ships:1 },

{ yr:"25 Nisan 1915", nm:"Çıkarmalar", date:"25 – 26 Nisan 1915",
  t:"25 Nisan: Gelibolu’ya çıkarma",
  view:[26.06, 39.975, 26.43, 40.285],
  lede:`İtilaf kuvvetleri şafak vakti yarımadanın güney ucuna ve Arıburnu’na çıktı. Amaç,
        yarımadayı ele geçirip Boğaz tabyalarını karadan susturmaktı.`,
  body:[`İngiliz 29. Tümeni <b>Seddülbahir</b> çevresindeki kumsallara (Morto Koyu, Ertuğrul Koyu,
         Tekke Koyu, İkiz Koyu ve Zığındere ağzı) çıktı. <b>Ertuğrul Koyu</b>’nda River Clyde gemisinden
         inen askerler, Binbaşı Mahmut Sabri Bey’in taburunun ateşiyle ağır kayıp verdi.`,
        `Avustralya ve Yeni Zelanda Kolordusu (<b>Anzak</b>), Kabatepe’nin kuzeyinde dik yamaçlı
         <b>Arıburnu</b>’na çıktı. Fransızlar Anadolu yakasında <b>Kumkale</b>’ye oyalama çıkarması yaptı.`,
        `19. Tümen Komutanı Yarbay <b>Mustafa Kemal</b>, Bigalı’dan 57. Alay’la <b>Conkbayırı</b>’na
         yetişti ve sırtlara tırmanan Anzak birliklerini durdurdu. “Ben size taarruzu emretmiyorum,
         ölmeyi emrediyorum!” sözü bu gün söylendi.`],
  facts:[["Osmanlı kuvvetleri","5. Ordu (Liman von Sanders); 9. ve 19. Tümenler"],
         ["Çıkarma yerleri","Seddülbahir kumsalları, Arıburnu, Kumkale"],
         ["Sonuç","Çıkan kuvvetler kıyıdaki dar alanlara sıkıştı"]],
  ev:["c_seddulbahir","c_anzak","c_57","c_kumkale"],
  arrows:["c_l_y","c_l_x","c_l_w","c_l_v","c_l_s","c_l_anzak","c_l_kum","c_c_mk"],
  lines:["c_f_anzak","c_f_helles_a"], zones:["z_anzak","z_helles_a","z_kumkale"] },

{ yr:"May–Tem 1915", nm:"Siper savaşları", date:"28 Nisan – Temmuz 1915",
  t:"Kirte, Kerevizdere, Zığındere",
  view:[26.15, 40.035, 26.33, 40.26],
  lede:`Kıyıya tutunan İtilaf kuvvetleri yarımadanın içlerine ilerleyemedi. Cephe, yer yer
        birkaç metre arayla karşılıklı kazılmış siper hatlarına dönüştü.`,
  body:[`Seddülbahir cephesinde İtilaf kuvvetleri <b>Kirte</b> köyünü ve <b>Alçıtepe</b>’yi almak için
         üç büyük saldırı yaptı (28 Nisan, 6–8 Mayıs, 4 Haziran). Hiçbiri hedefine ulaşamadı.
         Fransızlar <b>Kerevizdere</b>’de, İngilizler <b>Zığındere</b>’de (28 Haziran – 5 Temmuz) çok kanlı
         çarpışmalara girdi.`,
        `Arıburnu’nda Anzak mevzileri birkaç kilometrelik bir alana sıkıştı. Osmanlı ordusunun
         <b>19 Mayıs</b> gece taarruzu ağır kayıpla durdu; ölülerin gömülmesi için 24 Mayıs’ta kısa bir
         ateşkes yapıldı.`,
        `Yaz boyunca sıcak, susuzluk, sinekler ve dizanteri iki tarafa da muharebeler kadar
         kayıp verdirdi.`],
  facts:[["Seddülbahir","I., II. ve III. Kirte; Kerevizdere; Zığındere"],
         ["Arıburnu","19 Mayıs taarruzu, 24 Mayıs ateşkesi"],
         ["Durum","Siper savaşı: iki taraf da ilerleyemiyor"]],
  ev:["c_kirte","c_kereviz","c_zigindere","c_19mayis"],
  arrows:["c_a_kirte","c_a_alci"],
  lines:["c_f_anzak","c_f_helles"], zones:["z_anzak","z_helles"] },

{ yr:"Ağustos 1915", nm:"Anafartalar", date:"6 – 21 Ağustos 1915",
  t:"Anafartalar ve Conkbayırı",
  view:[26.195, 40.2, 26.375, 40.36],
  lede:`Tıkanan cepheyi aşmak isteyen İtilaf kuvvetleri Anafartalar (Suvla) Koyu’na yeni bir
        çıkarma yaptı ve Conkbayırı – Kocaçimen sırtlarını ele geçirmeye çalıştı.`,
  body:[`6 Ağustos akşamı Anzaklar <b>Kanlısırt</b>’a saldırırken İngiliz birlikleri gece boyunca
         <b>Anafartalar Koyu</b>’na çıktı. Bölgedeki az sayıdaki Osmanlı birliği, takviye gelene kadar
         ilerlemeyi yavaşlattı.`,
        `Anafartalar Grubu Komutanlığına getirilen Albay <b>Mustafa Kemal</b>, 9–10 Ağustos’ta
         <b>I. Anafartalar</b>’da düşmanı durdurdu. <b>10 Ağustos</b> şafağında yönettiği süngü hücumuyla
         <b>Conkbayırı</b>’nı geri aldı; göğsüne isabet eden şarapnel parçasını cebindeki saat durdurdu.`,
        `<b>Kireçtepe</b> ve <b>II. Anafartalar</b> (21 Ağustos) muharebeleriyle İtilaf taarruzu tümüyle
         durduruldu. Cephe, tahliyeye kadar değişmedi.`],
  osmH:"Mustafa Kemal",
  osm:`Anafartalar ve Conkbayırı zaferleri Mustafa Kemal’i ordu içinde ve halk arasında
       tanınan bir komutan yaptı.`,
  facts:[["Yeni çıkarma","Anafartalar (Suvla) Koyu, 6–7 Ağustos"],
         ["Muharebeler","Kanlısırt, Conkbayırı, I. ve II. Anafartalar, Kireçtepe"],
         ["Komutan","Anafartalar Grubu: Albay Mustafa Kemal"]],
  ev:["c_suvla","c_kanlisirt","c_conk","c_anafarta1","c_kirec","c_anafarta2"],
  arrows:["c_l_suvla","c_l_suvla2","c_a_conk","c_c_conk","c_c_anaf"],
  lines:["c_f_aug"], zones:["z_aug"] },

{ yr:"Ara 1915–Oca 1916", nm:"Tahliye", date:"19 Aralık 1915 – 9 Ocak 1916",
  t:"Tahliye ve savaşın sonuçları",
  view:[26.05, 39.99, 26.43, 40.36],
  lede:`Boğaz’ı açamayacaklarını anlayan İtilaf Devletleri yarımadadaki askerlerini geri
        çekti. Çanakkale Savaşları Osmanlı Devleti’nin zaferiyle sona erdi.`,
  body:[`Anafartalar ve Arıburnu <b>19–20 Aralık 1915</b>, Seddülbahir <b>8–9 Ocak 1916</b> gecesi gizlice
         boşaltıldı. Tahliye sırasında İtilaf kuvvetleri pek kayıp vermedi.`,
        `Sekiz buçuk ay süren savaşlarda iki taraf da yaklaşık <b>250’şer bin</b> kayıp verdi (ölü,
         yaralı, hasta, esir). Şehitler arasında okullarından cepheye koşan pek çok genç de vardı.`,
        `<b>Sonuçlar:</b> Boğazlar geçilemedi, İstanbul kurtuldu. Rusya’ya yardım ulaştırılamadı; bu
         durum Rusya’daki çöküşü hızlandırdı. Savaş uzadı, Bulgaristan İttifak Devletleri’nin yanında
         savaşa girdi. Türk milletinin kendine güveni arttı ve Mustafa Kemal tanındı.`],
  facts:[["Tahliye","Arıburnu–Anafartalar 19–20 Aralık 1915; Seddülbahir 8–9 Ocak 1916"],
         ["Kayıplar","İki tarafta da yaklaşık 250’şer bin"],
         ["Sonuç","Osmanlı zaferi: Boğazlar geçilemedi"]],
  ev:["c_tahliye1","c_tahliye2"],
  arrows:["c_t_suvla","c_t_anzak","c_t_helles"],
  lines:["c_f_aug","c_f_helles"], zones:["z_aug","z_helles"] }
  ],

  /* ---------------------------------------------------------------- yer adları
     [ad, boylam, enlem, sınıf, aşamalar, ayrıntı düzeyi, dönüş] */
  LB: [
    ["EGE DENİZİ", 26.105, 40.165, "sea", "*", 0],
    ["SAROS KÖRFEZİ", 26.34, 40.455, "sea", "*", 0],
    ["ÇANAKKALE BOĞAZI", 26.535, 40.292, "sea", "*", 0, -45],
    ["GELİBOLU|YARIMADASI", 26.465, 40.37, "s2", "*", 0, -38],
    ["ANADOLU YAKASI", 26.6, 40.09, "s2", "*", 0],
    ["GÖKÇEADA|(İmroz)", 25.86, 40.165, "s3", "*", 0],
    ["Kilitbahir|Platosu", 26.318, 40.158, "rg", "*", 1],
    ["Erenköy Koyu", 26.285, 40.027, "sea2", "*", 1],
    ["Anafartalar|Koyu", 26.226, 40.307, "sea2", "*", 1],
    ["Morto Koyu", 26.213, 40.043, "sea2", "*", 2],
    ["Kilye Koyu", 26.36, 40.199, "sea2", "*", 2],
    ["Anzak Koyu", 26.266, 40.238, "sea2", "2-5", 2],
    ["Tuz Gölü", 26.262, 40.3, "col", "*", 2],
    ["Arıburnu", 26.2815, 40.2445, "col", "*", 1],
    ["Kabatepe", 26.2683, 40.2051, "col", "*", 1],
    ["Kepez Burnu", 26.3682, 40.102, "col", "*", 2],
    ["Nara Burnu", 26.4032, 40.1959, "col", "*", 2],
    ["Tekke Burnu", 26.1663, 40.0539, "col", "*", 2],
    ["Zığındere", 26.2, 40.085, "rv", "*", 2],
    ["Kerevizdere", 26.2515, 40.075, "rv", "*", 2]
  ],
  /* kasabalar: [ad, boylam, enlem, ayrıntı, büyük] */
  CT: [
    ["Çanakkale", 26.4086, 40.1467, 0, 1],
    ["Kilitbahir", 26.3765, 40.148, 0],
    ["Eceabat (Maydos)", 26.3572, 40.1839, 0],
    ["Gelibolu", 26.6703, 40.4097, 0, 1],
    ["Seddülbahir", 26.1869, 40.0472, 0],
    ["Kumkale", 26.205, 40.004, 1],
    ["Kirte", 26.2242, 40.0833, 1],
    ["Kepez", 26.395, 40.1017, 1],
    ["Erenköy", 26.3336, 40.0217, 1],
    ["Bigalı", 26.37, 40.2272, 1],
    ["Büyükanafarta", 26.3486, 40.2733, 1],
    ["Küçükanafarta", 26.3197, 40.2894, 1]
  ],
  /* tepeler: [ad, boylam, enlem, ayrıntı] */
  PK: [
    ["Conkbayırı", 26.3085, 40.2523, 0],
    ["Kocaçimen T.", 26.3191, 40.2594, 2],
    ["Alçıtepe", 26.2549, 40.098, 0],
    ["Tekketepe", 26.327, 40.3217, 1],
    ["Kireçtepe", 26.3092, 40.3473, 1],
    ["Kanlısırt", 26.2846, 40.2306, 1],
    ["Yusufçuk T.", 26.2886, 40.2958, 2]
  ],
  /* tabyalar: [ad, boylam, enlem, ayrıntı] — 1. ve 2. aşamada */
  FT: [
    ["Ertuğrul", 26.1775, 40.045, 1],
    ["Seddülbahir", 26.187, 40.0455, 1],
    ["Kumkale", 26.205, 40.0065, 1],
    ["Orhaniye", 26.1945, 39.996, 2],
    ["Dardanos", 26.3625, 40.077, 1],
    ["Rumeli Mecidiye", 26.3639, 40.1394, 1],
    ["Namazgah", 26.3775, 40.1445, 2],
    ["Kilitbahir", 26.378, 40.149, 2],
    ["Anadolu Hamidiye", 26.4035, 40.1345, 1],
    ["Çimenlik", 26.4, 40.147, 2],
    ["Nara", 26.4035, 40.1935, 2]
  ],
  /* Nusret’in mayın hattı (8 Mart) ve batık yerleri (yaklaşık) */
  NUSRET: [[26.312, 40.042], [26.339, 40.073]],
  SHIPS: [["Bouvet", 26.306, 40.05], ["Irresistible", 26.316, 40.063], ["Ocean", 26.323, 40.072]],
  /* İtilaf kuvvetlerinin tuttuğu alanlar: kara ile kesişimi çizilir */
  Z: {
    z_anzak: [[26.2812,40.2505],[26.285,40.2482],[26.2885,40.2478],[26.2902,40.2455],[26.2908,40.243],[26.29,40.24],
      [26.2885,40.2365],[26.287,40.233],[26.285,40.23],[26.281,40.227],[26.2772,40.2255],[26.265,40.2255],[26.265,40.2505]],
    z_helles_a: [[26.178,40.07],[26.19,40.064],[26.202,40.059],[26.213,40.056],[26.22,40.0525],[26.226,40.047],
      [26.18,40.033],[26.15,40.05],[26.165,40.072]],
    z_helles: [[26.197,40.093],[26.205,40.087],[26.212,40.081],[26.22,40.076],[26.229,40.071],[26.238,40.067],
      [26.246,40.066],[26.256,40.058],[26.23,40.04],[26.18,40.03],[26.145,40.05],[26.18,40.096]],
    z_kumkale: [[26.19,40.012],[26.215,40.01],[26.222,40.0],[26.205,39.992],[26.188,39.998]],
    z_aug: [[26.2905,40.348],[26.288,40.338],[26.283,40.326],[26.28,40.315],[26.279,40.304],[26.282,40.294],
      [26.287,40.284],[26.293,40.276],[26.299,40.269],[26.301,40.262],[26.303,40.2555],[26.296,40.253],[26.289,40.25],
      [26.2885,40.2478],[26.2902,40.2455],[26.2908,40.243],[26.29,40.24],[26.2885,40.2365],[26.287,40.233],
      [26.285,40.23],[26.281,40.227],[26.2772,40.2255],[26.26,40.2255],[26.2,40.29],[26.2,40.33],[26.29,40.36]]
  }
};

/* ---------------------------------------------------------------- çizgiler (D.L'ye eklenir) */
function L(k, p, w) { var o = {k: k, p: p}; if (w) o.w = w; return o; }
var anzak = D.C.Z.z_anzak.slice(0, 11), aug = D.C.Z.z_aug.slice(0, 22);
var ADD = {
  c_f_anzak: L("front", anzak),
  c_f_helles_a: L("front", D.C.Z.z_helles_a.slice(0, 5)),
  c_f_helles: L("front", D.C.Z.z_helles.slice(0, 7)),
  c_f_aug: L("front", aug),
  /* donanma */
  c_n_dis1: L("nE", [[26.06,39.99],[26.11,40.005],[26.163,40.029]]),
  c_n_dis2: L("nE", [[26.1,39.955],[26.145,39.975],[26.184,39.996]]),
  c_n_filo: L("nE", [[26.17,40.005],[26.215,40.028],[26.27,40.05],[26.318,40.081]]),
  /* 25 Nisan çıkarmaları */
  c_l_y: L("E", [[26.168,40.094],[26.181,40.0905],[26.1925,40.0875]], .7),
  c_l_x: L("E", [[26.148,40.069],[26.161,40.066],[26.1735,40.0635]], .7),
  c_l_w: L("E", [[26.138,40.043],[26.154,40.045],[26.1693,40.0478]], .7),
  c_l_v: L("E", [[26.169,40.02],[26.176,40.031],[26.1821,40.0433]], .7),
  c_l_s: L("E", [[26.243,40.034],[26.232,40.042],[26.2207,40.049]], .7),
  c_l_anzak: L("E", [[26.232,40.227],[26.254,40.233],[26.2774,40.2392]], .8),
  c_l_kum: L("E", [[26.168,39.984],[26.184,39.995],[26.1985,40.0045]], .7),
  c_c_mk: L("C", [[26.372,40.2265],[26.352,40.24],[26.33,40.249],[26.2935,40.2497]], .8),
  /* Mayıs – Temmuz */
  c_a_kirte: L("E", [[26.203,40.066],[26.211,40.074],[26.2185,40.0795]], .7),
  c_a_alci: L("E", [[26.224,40.06],[26.231,40.067],[26.2375,40.0735]], .7),
  /* Ağustos */
  c_l_suvla: L("E", [[26.198,40.301],[26.221,40.2995],[26.2418,40.2982]], .8),
  c_l_suvla2: L("E", [[26.212,40.274],[26.23,40.28],[26.2445,40.2855]], .7),
  c_a_conk: L("E", [[26.2835,40.2595],[26.2955,40.2585],[26.3055,40.2528]], .7),
  c_c_conk: L("C", [[26.323,40.2615],[26.3155,40.2575],[26.3075,40.2535]], .7),
  c_c_anaf: L("C", [[26.337,40.306],[26.316,40.3005],[26.2945,40.2965]], .8),
  /* tahliye */
  c_t_suvla: L("nE", [[26.2425,40.2975],[26.218,40.2995],[26.188,40.304]]),
  c_t_anzak: L("nE", [[26.2772,40.2385],[26.255,40.2355],[26.224,40.232]]),
  c_t_helles: L("nE", [[26.181,40.0445],[26.166,40.034],[26.14,40.024]])
};
for (var k in ADD) D.L[k] = ADD[k];

/* ---------------------------------------------------------------- olaylar (D.E'ye eklenir) */
var E = {
c_dis:{p:[26.196,40.024], k:"den", n:"Dış tabyaların bombardımanı", d:"19 – 25 Şubat 1915", lp:"e", w:"E", f:"canakkale",
  tx:`İtilaf donanması Boğaz’ın girişindeki Seddülbahir, Ertuğrul, Kumkale ve Orhaniye tabyalarını uzaktan
      bombaladı. Eski ve menzili kısa toplarla donatılmış tabyalar 25 Şubat’ta susturuldu; ardından karaya
      çıkan küçük birlikler topları tahrip etmeye çalıştı, 4 Mart’taki çıkarma geri püskürtüldü. Ancak asıl savunma Boğaz’ın içindeydi.`},
c_nusret:{p:[26.3255,40.0575], k:"den", n:"Nusret’in mayınları", d:"7–8 Mart 1915 gecesi", lp:"e", w:"C", f:"canakkale",
  tx:`Nusret mayın gemisi, İtilaf gemilerinin geri dönmek için manevra yaptığı Erenköy Koyu’na, kıyıya
      koşut 26 mayın döktü. Karanlıkta ve gizlice döşenen mayınlar, keşif uçaklarının ve mayın tarama
      gemilerinin gözünden kaçtı. 18 Mart’ta sonucu bu hat belirledi.`},
c_18m:{p:[26.389,40.139], k:"den", n:"18 Mart Deniz Zaferi", d:"18 Mart 1915", lp:"e", w:"C", f:"canakkale",
  tx:`İngiliz ve Fransız zırhlılarından oluşan büyük İtilaf filosu Boğaz’ın dar yerini geçmeye çalıştı. Kilitbahir
      ve Çanakkale kıyılarındaki tabyalar gün boyu karşılık verdi. Üç zırhlının batması ve üçünün ağır hasar
      görmesiyle filo akşamüstü geri çekildi. “Çanakkale geçilmez” sözü bu zaferle doğdu.`},
c_batan:{p:[26.296,40.061], k:"den", n:"Üç zırhlı batıyor", d:"18 Mart 1915, öğleden sonra", lp:"w", w:"C", f:"canakkale",
  tx:`Fransız zırhlısı Bouvet, Erenköy Koyu’nda dönerken Nusret’in mayınına çarptı ve dakikalar içinde
      battı; mürettebatının çoğu kurtulamadı. Ardından İngiliz zırhlıları Irresistible ve Ocean aynı
      bölgede mayınlara çarptı ve battı. Inflexible, Suffren ve Gaulois ağır yaralandı. (Haritada gemilerin
      mayına çarptığı yerler yaklaşık gösterilmiştir.)`},
c_seyit:{p:[26.3639,40.1394], k:"kus", n:"Seyit Onbaşı", d:"18 Mart 1915 · Rumeli Mecidiye Tabyası", lp:"w", w:"C", f:"canakkale",
  tx:`Rumeli Mecidiye Tabyası’nda topun mermi kaldıran vinci vurulunca Seyit Onbaşı’nın ağır mermiyi
      sırtında taşıyarak topa sürdüğü anlatılır. Havranlı Seyit Onbaşı (Seyit Ali Çabuk), Çanakkale’deki
      Mehmetçik’in simgelerinden biri oldu.`},
c_seddulbahir:{p:[26.1822,40.0443], k:"cik", n:"Seddülbahir çıkarmaları", d:"25 Nisan 1915", lp:"s", w:"N", f:"canakkale",
  tx:`İngiliz 29. Tümeni yarımadanın ucundaki beş kumsala çıktı. Ertuğrul Koyu’nda (V kumsalı) River Clyde
      adlı kömür gemisi kasten karaya oturtuldu; gemiden inen askerler, sayıca çok az olan savunucuların
      ateşiyle kıyıda kaldı. Tekke Koyu’nda da (W kumsalı) ağır kayıp verildi. Seddülbahir’i savunan tabur,
      büyük üstünlüğe karşı bir gün boyunca direndi.`},
c_anzak:{p:[26.2776,40.2394], k:"cik", n:"Arıburnu çıkarması", d:"25 Nisan 1915, şafak", lp:"w", w:"N", f:"canakkale",
  tx:`Anzak birlikleri planlanan yerin biraz kuzeyine, Arıburnu’nun dik yamaçlarının dibine çıktı. Kabatepe
      çevresindeki 27. Alay’ın birlikleri ilk saatlerde ilerlemeyi yavaşlattı. Akşama kadar kıyıdan yalnızca
      bir iki kilometre içeri girilebildi; bu dar alan, sekiz ay boyunca “Anzak” mevzisi olarak kaldı.`},
c_kumkale:{p:[26.2045,40.0035], k:"cik", n:"Kumkale çıkarması", d:"25 – 26 Nisan 1915", lp:"e", w:"N", f:"canakkale",
  tx:`Fransız birlikleri, Anadolu yakasındaki topların Seddülbahir’e ateş etmesini önlemek için Kumkale’ye
      çıktı. Çetin çarpışmalardan sonra 26 Nisan’da geri çekilip Seddülbahir cephesine aktarıldılar.`},
c_57:{p:[26.3085,40.2523], k:"mh", n:"57. Alay ve Mustafa Kemal", d:"25 Nisan 1915 · Conkbayırı", lp:"e", w:"C", f:"canakkale",
  tx:`Çıkarma haberini alan 19. Tümen Komutanı Yarbay Mustafa Kemal, 57. Alay’la Bigalı’dan Conkbayırı’na
      yürüdü. Cephanesi biten ve geri çekilen askerlere süngü taktırıp yere yatırdı; kazanılan dakikalarda
      yetişen 57. Alay Anzak ilerleyişini durdurdu. “Ben size taarruzu emretmiyorum, ölmeyi emrediyorum.
      Biz ölünceye kadar geçecek zaman zarfında yerimize başka kuvvetler ve başka kumandanlar kaim olabilir.”`},
c_kirte:{p:[26.2242,40.0833], k:"mh", n:"Kirte muharebeleri", d:"28 Nisan – 4 Haziran 1915", lp:"e", w:"C", f:"canakkale",
  tx:`İtilaf kuvvetleri Kirte köyünü ve Alçıtepe’yi almak için üç büyük taarruz yaptı: I. Kirte (28 Nisan),
      II. Kirte (6–8 Mayıs) ve III. Kirte (4 Haziran). Her seferinde birkaç yüz metre ilerlenebildi, hedeflere
      hiç ulaşılamadı. Alçıtepe savaş boyunca Osmanlı’nın elinde kaldı.`},
c_kereviz:{p:[26.2468,40.0672], k:"mh", n:"Kerevizdere", d:"Mayıs – Temmuz 1915", lp:"e", w:"C", f:"canakkale",
  tx:`Seddülbahir cephesinin Boğaz’a bakan ucunda Fransız birlikleri Kerevizdere mevzilerine defalarca
      saldırdı. Küçük kazanımlar dışında Osmanlı hatları geçilemedi; iki taraf da çok ağır kayıp verdi.`},
c_zigindere:{p:[26.196,40.0835], k:"mh", n:"Zığındere", d:"28 Haziran – 5 Temmuz 1915", lp:"w", w:"N", f:"canakkale",
  tx:`İngilizler Ege kıyısındaki Zığındere boyunca saldırıp bir kilometre kadar ilerledi. Osmanlı birliklerinin
      mevzileri geri almak için yaptığı karşı taarruzlar çok kanlı oldu. Cephe yeniden kilitlendi.`},
c_19mayis:{p:[26.2905,40.2418], k:"mh", n:"19 Mayıs taarruzu", d:"19 Mayıs 1915 · Arıburnu", lp:"e", w:"E", f:"canakkale",
  tx:`Osmanlı ordusu Anzakları denize dökmek için büyük bir gece taarruzu yaptı. Makineli tüfek ateşi
      altında binlerce asker şehit düştü ve taarruz durdu. Cephe hattı arasında kalan şehitlerin ve ölülerin
      gömülmesi için 24 Mayıs’ta dokuz saatlik bir ateşkes yapıldı.`},
c_suvla:{p:[26.2422,40.2979], k:"cik", n:"Anafartalar (Suvla) çıkarması", d:"6 – 7 Ağustos 1915", lp:"w", w:"N", f:"canakkale",
  tx:`İngiliz 9. Kolordusu gece Anafartalar Koyu’na ve güneyindeki kumsallara çıktı. Karşısında yalnız birkaç
      tabur vardı, ama çıkan birlikler ilk gün yavaş davrandı. Bu zaman kaybı, Osmanlı takviyelerinin
      Tekketepe ve Anafartalar sırtlarına yetişmesine fırsat verdi.`},
c_kanlisirt:{p:[26.2846,40.2306], k:"mh", n:"Kanlısırt", d:"6 – 9 Ağustos 1915", lp:"w", w:"E", f:"canakkale",
  tx:`Anzaklar, asıl saldırıdan dikkati dağıtmak için Kanlısırt’taki Osmanlı siperlerine saldırdı. Üstü
      kütüklerle örtülü siperlerde göğüs göğüse çarpışıldı; siperler el değiştirdi, iki taraf da çok ağır
      kayıp verdi.`},
c_conk:{p:[26.3085,40.2523], k:"mh", n:"Conkbayırı", d:"8 – 10 Ağustos 1915", lp:"e", w:"C", f:"canakkale",
  tx:`Yeni Zelandalı birlikler 8 Ağustos’ta Conkbayırı’nın tepesine ulaştı. 10 Ağustos şafağında Mustafa
      Kemal’in işaretiyle başlayan süngü hücumu tepeyi geri aldı. Hücum sırasında göğsüne isabet eden
      şarapnel parçasını cebindeki saat durdurdu.`},
c_anafarta1:{p:[26.3045,40.2855], k:"mh", n:"I. Anafartalar", d:"9 – 10 Ağustos 1915", lp:"e", w:"C", f:"canakkale",
  tx:`8 Ağustos gecesi Anafartalar Grubu Komutanlığına getirilen Mustafa Kemal, Tekketepe’den ovaya karşı
      taarruz ettirdi. İngilizlerin sırtlara çıkması önlendi ve Anafartalar ovası çevresinde durduruldular.`},
c_kirec:{p:[26.2855,40.3385], k:"mh", n:"Kireçtepe", d:"7 – 16 Ağustos 1915", lp:"e", w:"C", f:"canakkale",
  tx:`Anafartalar Koyu’nun kuzeyindeki Kireçtepe sırtında ilerlemek isteyen İngiliz birlikleri, Gelibolu ve
      Bursa jandarma taburları ile yetişen takviyelerce durduruldu.`},
c_anafarta2:{p:[26.2886,40.2958], k:"mh", n:"II. Anafartalar", d:"21 Ağustos 1915", lp:"w", w:"C", f:"canakkale",
  tx:`İngilizlerin Yusufçuk Tepe ve Bomba Sırtı yönündeki son büyük saldırısı da püskürtüldü. Bu muharebeyle
      Ağustos taarruzları sona erdi; İtilaf kuvvetleri kazandıkları dar kıyı şeridinde kaldı.`},
c_tahliye1:{p:[26.2615,40.272], k:"tah", n:"Anafartalar ve Arıburnu tahliyesi", d:"19 – 20 Aralık 1915", lp:"e", w:"N", f:"canakkale",
  tx:`İtilaf kuvvetleri geceleri, sessizce ve kendiliğinden ateş eden tüfeklerle mevzileri dolu gösterip
      askerlerini gemilere taşıdı. Son birlikler 20 Aralık sabahı ayrıldı.`},
c_tahliye2:{p:[26.1852,40.0485], k:"tah", n:"Seddülbahir tahliyesi", d:"8 – 9 Ocak 1916", lp:"e", w:"N", f:"canakkale",
  tx:`Son İtilaf askerleri 9 Ocak 1916 sabahı Seddülbahir’den ayrıldı. Böylece sekiz buçuk ay süren Çanakkale
      Savaşları sona erdi.`}
};
for (k in E) D.E[k] = E[k];

/* ana haritadaki Çanakkale öğelerinden ayrıntıya geçiş: {olay/aşama: ayrıntı aşaması} */
D.C.link = {ev: {m18: 1, canakkale: 2}, front: {canakkale: 0}, st: {3: 0}};
})();
