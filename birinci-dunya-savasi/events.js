/* Olaylar. p: [boylam, enlem] (null → yalnız listede), k: tür, w: kazanan taraf,
   lp: etiket yönü (n ne e se s sw w nw), f: cephe.
   Türler: mh muharebe · den deniz · cik çıkarma · kus kuşatma · ant antlaşma/ateşkes
           sia siyasi · sui suikast · isg işgal · dy demiryolu                                 */
"use strict";
D.E = {
/* ---------------------------------------------------------------- 1914 öncesi */
alsas:{p:[7.0,48.6], k:"sia", n:"Alsas-Loren", d:"1871", lp:"e", f:"bati",
  tx:`Fransa, 1870–71 savaşında yenilince bu iki eyaleti Almanya’ya bırakmıştı. Kayıp
      toprakları geri alma isteği (rövanş) Fransız siyasetinin kırk yıl boyunca değişmeyen
      hedefiydi.`},
bosna:{p:[17.9,44.1], k:"sia", n:"Bosna-Hersek’in ilhakı", d:"1908", lp:"w", f:"balkan",
  tx:`Avusturya-Macaristan 1878’den beri yönettiği Bosna-Hersek’i 1908’de ilhak etti.
      Bölgede büyük bir Sırp nüfus yaşıyordu; ilhak Sırbistan’ı ve onu koruyan Rusya’yı
      öfkelendirdi.`},
balkan:{p:[22.3,41.9], k:"sia", n:"Balkan Savaşları", d:"1912 – 1913", lp:"se", f:"balkan",
  tx:`Balkan devletleri önce Osmanlı’yı Rumeli’nin büyük bölümünden çıkardı, sonra
      ganimeti paylaşamayıp birbirleriyle savaştı. Sırbistan büyüdü ve güçlendi; bu durum
      Avusturya-Macaristan’ı tedirgin etti.`},
bagdat:{p:[34.9,37.35], k:"dy", n:"Bağdat Demiryolu", d:"1903 – 1940", lp:"s", f:"siyasi",
  tx:`Alman şirketlerinin yaptığı hat Almanya’yı İstanbul üzerinden Bağdat’a ve Basra
      Körfezi’ne bağlayacaktı. İngiltere bunu Hindistan yoluna yönelik bir tehdit olarak
      gördü. Savaş sırasında Toros ve Amanos tünelleri bitmediği için asker ve cephane
      aktarmalarla taşındı.`},
denizyarisi:{p:[8.2,54.8], k:"den", n:"Deniz silahlanma yarışı", d:"1898 – 1914", lp:"e", f:"deniz",
  tx:`Almanya büyük bir savaş filosu kurmaya başlayınca İngiltere 1906’da yeni tip zırhlı
      “Dreadnought”u denize indirdi. İki ülke birbirini geçmek için her yıl daha fazla
      zırhlı yaptı.`},
fas:{p:[-5.0,34.0], k:"sia", n:"Fas bunalımları", d:"1905 · 1911", lp:"e", f:"siyasi",
  tx:`Almanya iki kez Fransa’nın Fas’taki nüfuzuna itiraz etti. İki bunalım da İngiltere ile
      Fransa’yı birbirine daha çok yaklaştırdı; Fas 1912’de Fransız himayesine girdi.`},

/* ---------------------------------------------------------------- 1914 */
saraybosna:{p:[18.41,43.86], k:"sui", n:"Saraybosna suikastı", d:"28 Haziran 1914", lp:"sw", f:"balkan",
  tx:`Avusturya-Macaristan veliahdı Arşidük <b>Franz Ferdinand</b> ve eşi Sophie, Sırp
      milliyetçisi <b>Gavrilo Princip</b> tarafından vuruldu. Avusturya-Macaristan Sırbistan’a
      ağır bir ültimatom verdi (23 Temmuz); ittifak zinciri harekete geçti.`},
belgrad14:{p:[20.46,44.82], k:"sia", n:"Sırbistan’a savaş ilanı", d:"28 Temmuz 1914", lp:"ne", f:"balkan",
  tx:`Avusturya-Macaristan ültimatomun bir maddesinin reddedilmesini gerekçe gösterip
      Sırbistan’a savaş açtı; ertesi gün Belgrad topa tutuldu. Birkaç gün içinde Rusya,
      Almanya, Fransa ve İngiltere de savaşa girdi.`},
liege:{p:[5.57,50.63], k:"kus", n:"Belçika’nın işgali · Liège", d:"4 – 16 Ağustos 1914", lp:"e", w:"C", f:"bati",
  tx:`Alman ordusu Fransa’ya kuzeyden dolanmak için tarafsız Belçika’ya girdi. Liège
      kaleleri dev kuşatma toplarıyla düşürüldü. Belçika’nın tarafsızlığının çiğnenmesi
      İngiltere’nin savaşa girmesinin gerekçesi oldu.`},
marne:{p:[3.35,48.95], k:"mh", n:"Marne Muharebesi", d:"5 – 12 Eylül 1914", lp:"s", w:"E", f:"bati",
  tx:`Paris’e 50 kilometre kadar yaklaşan Alman orduları Fransız ve İngiliz karşı taarruzuyla
      durduruldu ve Aisne’ye çekildi. Schlieffen Planı çöktü; iki taraf da kazmaya başladı
      ve <b>siper savaşı</b> dönemi açıldı.`},
tannenberg:{p:[20.13,53.50], k:"mh", n:"Tannenberg", d:"26 – 30 Ağustos 1914", lp:"sw", w:"C", f:"dogu",
  tx:`Doğu Prusya’ya giren iki Rus ordusundan biri Hindenburg ve Ludendorff yönetimindeki
      Alman ordusunca kuşatılıp yok edildi. Yaklaşık 90.000 Rus askeri esir alındı.`},
lemberg:{p:[24.03,49.84], k:"mh", n:"Galiçya Muharebesi", d:"Ağustos – Eylül 1914", lp:"se", w:"E", f:"dogu",
  tx:`Ruslar Avusturya-Macaristan ordusunu ağır bir yenilgiye uğratıp Lemberg’i (Lviv) aldı
      ve Karpatlar’a kadar ilerledi. Przemyśl kalesi kuşatıldı.`},
cer:{p:[19.45,44.62], k:"mh", n:"Cer Muharebesi", d:"15 – 24 Ağustos 1914", lp:"w", w:"E", f:"balkan",
  tx:`Sırbistan’a giren Avusturya-Macaristan ordusu Cer Dağı’nda yenildi. Savaşın İtilaf
      Devletleri adına ilk zaferiydi; Aralık’taki ikinci saldırı da püskürtüldü.`},
ypres14:{p:[2.88,50.85], k:"mh", n:"I. Ypres · denize koşu", d:"Ekim – Kasım 1914", lp:"w", f:"bati",
  tx:`Marne’dan sonra iki taraf birbirini kuzeyden kuşatmaya çalıştı; yarış Kuzey Denizi
      kıyısında bitti. İsviçre sınırından denize uzanan 700 kilometrelik siper hattı
      1918’e kadar pek değişmedi.`},

/* ---------------------------------------------------------------- Osmanlı savaşa giriyor */
ittifak:{p:[28.98,41.01], k:"ant", n:"Osmanlı–Alman ittifakı", d:"2 Ağustos 1914", lp:"ne", f:"siyasi",
  tx:`Sadrazam Said Halim Paşa’nın yalısında gizlice imzalandı. Osmanlı Devleti ertesi gün
      seferberlik ilan etti ama tarafsız olduğunu açıkladı. İttifaktan kabinenin bazı
      üyelerinin bile haberi yoktu.`},
goben:{p:[26.19,40.02], k:"den", n:"Yavuz ve Midilli", d:"10 Ağustos 1914", lp:"sw", f:"deniz",
  tx:`Akdeniz’de İngiliz donanmasından kaçan Alman gemileri Goeben ve Breslau Çanakkale’ye
      sığındı. Osmanlı hükûmeti gemileri satın aldığını açıkladı; adları <b>Yavuz Sultan
      Selim</b> ve <b>Midilli</b> oldu, Alman mürettebat Osmanlı fesi giydi.`},
karadeniz:{p:[33.52,44.62], k:"den", n:"Karadeniz baskını", d:"29 Ekim 1914", lp:"e", w:"C", f:"deniz",
  tx:`Amiral Souchon komutasındaki Yavuz, Midilli ve Osmanlı gemileri Odesa, Sivastopol,
      Feodosiya ve Novorossiysk limanlarını bombaladı. Rusya 2 Kasım’da savaş ilan etti;
      Osmanlı Devleti fiilen savaşa girmiş oldu.`},
fav:{p:[48.47,29.98], k:"cik", n:"Fav çıkarması · Basra", d:"6 – 22 Kasım 1914", lp:"e", w:"E", f:"irak",
  tx:`Savaş ilanından birkaç gün sonra Hindistan’dan gelen İngiliz birlikleri Fav’a çıktı ve
      22 Kasım’da Basra’yı aldı. Amaç Abadan petrol rafinerisini ve Hindistan yolunu
      korumaktı. <b>Irak Cephesi</b> böyle açıldı.`},
sarikamis:{p:[42.59,40.33], k:"mh", n:"Sarıkamış Harekâtı", d:"22 Aralık 1914 – 17 Ocak 1915", lp:"se", w:"E", f:"kafkas",
  tx:`Enver Paşa, Rus ordusunu Sarıkamış’ta kuşatmak için 3. Ordu’yu karla kaplı Allahuekber
      Dağları’ndan geçirdi. Plan tuttuysa da kış hazırlıksız yakalanan orduyu çökertti.
      On binlerce asker, büyük kısmı soğuk ve salgın yüzünden şehit oldu (tahminler 60–90 bin).`},
kibris:{p:[33.36,35.17], k:"isg", n:"Kıbrıs’ın ilhakı", d:"5 Kasım 1914", lp:"se", f:"siyasi",
  tx:`1878’den beri İngiltere’nin yönettiği Kıbrıs, Osmanlı ile savaşa girilince İngiltere
      tarafından tek taraflı ilhak edildi.`},
misir:{p:[31.24,30.04], k:"isg", n:"Mısır’da İngiliz himayesi", d:"18 Aralık 1914", lp:"w", f:"kanal",
  tx:`1882’den beri İngiliz işgalindeki Mısır’ın Osmanlı’ya hukuki bağı kaldırıldı; ülke
      İngiliz himayesine alındı. Süveyş Kanalı İngiltere için hayati önemdeydi.`},

/* ---------------------------------------------------------------- 1915 */
kanal1:{p:[32.30,30.60], k:"mh", n:"I. Kanal Harekâtı", d:"3 Şubat 1915", lp:"w", w:"E", f:"kanal",
  tx:`Cemal Paşa komutasındaki 4. Ordu, Sina Çölü’nü geçip İsmailiye yakınında Süveyş
      Kanalı’na ulaştı. Birkaç sal karşı kıyıya geçebildi ama saldırı başarısız oldu.
      Amaç İngiltere’nin Hindistan yolunu kesmek ve Mısır’ı geri almaktı.`},
m18:{p:[26.37,40.09], k:"den", n:"18 Mart Deniz Zaferi", d:"18 Mart 1915", lp:"e", w:"C", f:"canakkale",
  tx:`İngiliz-Fransız donanması boğazı zorladı. <b>Nusret</b> mayın gemisinin 8 Mart gecesi
      Erenköy Koyu’na döktüğü 26 mayın ve kıyı bataryaları Bouvet, Irresistible ve Ocean
      zırhlılarını batırdı; üç zırhlı da ağır hasar aldı. Donanma bir daha boğaza girmeyi
      denemedi.`},
canakkale:{p:[26.30,40.23], k:"mh", n:"Gelibolu kara savaşları", d:"25 Nisan 1915 – 9 Ocak 1916", lp:"w", w:"C", f:"canakkale",
  tx:`25 Nisan’da İngiliz, Fransız, Avustralya ve Yeni Zelanda (ANZAK) birlikleri Arıburnu ve
      Seddülbahir’e çıktı. Mustafa Kemal 19. Tümen ile Conkbayırı’nda ilerleyişi durdurdu.
      Ağustos’ta Anafartalar Grubu Komutanı olarak yeni çıkarmayı da püskürttü. İtilaf
      kuvvetleri Aralık-Ocak’ta yarımadayı boşalttı.`},
gorlice:{p:[21.16,49.66], k:"mh", n:"Gorlice–Tarnów", d:"2 Mayıs 1915", lp:"s", w:"C", f:"dogu",
  tx:`Alman ve Avusturya-Macaristan ordularının ortak taarruzu Rus cephesini yardı. Ruslar
      yaz boyunca Galiçya’dan ve Polonya’dan çekilmek zorunda kaldı (“Büyük Geri Çekiliş”).`},
varsova:{p:[21.01,52.23], k:"isg", n:"Varşova’nın düşüşü", d:"5 Ağustos 1915", lp:"e", w:"C", f:"dogu",
  tx:`Rusya Polonya’yı, Litvanya’yı ve Kurland’ı kaybetti. Cephe Riga–Dvinsk–Pinsk hattına
      çekildi. Yıl sonunda Rus ordusunun kaybı milyonları bulmuştu.`},
italya15:{p:[12.50,41.90], k:"sia", n:"İtalya taraf değiştiriyor", d:"23 Mayıs 1915", lp:"s", f:"italya",
  tx:`Savaşın başında tarafsız kalan İtalya, gizli <b>Londra Antlaşması</b>’yla (26 Nisan
      1915) kendisine Trentino, Trieste, Dalmaçya’nın bir kısmı ve Antalya çevresi vaat
      edilince İtilaf Devletleri’nin yanında savaşa girdi.`},
isonzo:{p:[13.62,45.95], k:"mh", n:"Isonzo muharebeleri", d:"1915 – 1917", lp:"e", f:"italya",
  tx:`İtalyan ordusu Isonzo ırmağı boyunca iki yılda on bir büyük taarruz yaptı. Kazanılan
      toprak birkaç kilometreyi geçmedi, kayıplar yüz binleri buldu.`},
bulgar15:{p:[23.32,42.70], k:"sia", n:"Bulgaristan savaşa giriyor", d:"14 Ekim 1915", lp:"n", f:"balkan",
  tx:`Balkan Savaşı’nda kaybettiği Makedonya’yı geri almak isteyen Bulgaristan, İttifak
      Devletleri’nin yanında Sırbistan’a saldırdı. Osmanlı, Bulgaristan’ı ikna etmek için
      Meriç’in batısındaki bir şeridi ona bıraktı.`},
sirbistan15:{p:[21.90,43.32], k:"isg", n:"Sırbistan’ın işgali", d:"Ekim – Kasım 1915", lp:"e", w:"C", f:"balkan",
  tx:`Kuzeyden Alman ve Avusturya-Macaristan, doğudan Bulgar orduları Sırbistan’ı işgal etti.
      Sırp ordusu kışın Arnavutluk dağlarını aşarak Korfu adasına çekildi. Berlin–İstanbul
      demiryolu açıldı: Almanya’dan silah ve cephane artık doğrudan gelebiliyordu.`},
selanik15:{p:[22.94,40.64], k:"cik", n:"İtilaf Selanik’te", d:"5 Ekim 1915", lp:"s", f:"makedonya",
  tx:`İngiliz ve Fransız birlikleri Sırbistan’a yardım için tarafsız Yunanistan’ın
      Selanik limanına çıktı. Yardım yetişmedi ama burada kurulan <b>Makedonya (Selanik)
      Cephesi</b> savaşın sonuna kadar sürdü.`},
selmanpak:{p:[44.58,33.09], k:"mh", n:"Selman-ı Pak", d:"22 – 25 Kasım 1915", lp:"n", w:"C", f:"irak",
  tx:`Bağdat’a yürüyen General Townshend’in ordusu Bağdat’ın 35 km güneyinde, Nurettin Bey
      komutasındaki Osmanlı kuvvetlerince durduruldu. İngilizler Kut’ül-Amare’ye çekildi ve
      orada kuşatıldı.`},
lahic:{p:[44.88,13.06], k:"isg", n:"Lahiç’in alınması", d:"Temmuz 1915", lp:"w", w:"C", f:"hicaz",
  tx:`Yemen’deki Osmanlı birlikleri Aden’in hemen kuzeyindeki Lahiç’i aldı ve savaşın
      sonuna kadar İngilizlerin Aden’deki üssünü tehdit etti.`},
lusitania:{p:[-8.53,51.42], k:"den", n:"Lusitania batırılıyor", d:"7 Mayıs 1915", lp:"e", f:"deniz",
  tx:`Bir Alman denizaltısı İngiliz yolcu gemisi Lusitania’yı İrlanda açıklarında batırdı;
      aralarında 128 Amerikalının da bulunduğu 1.198 kişi öldü. ABD’de Almanya’ya karşı
      öfke büyüdü.`},
ypres15:{p:[2.95,50.90], k:"mh", n:"II. Ypres · zehirli gaz", d:"22 Nisan 1915", lp:"n", f:"bati",
  tx:`Almanlar Ypres’te büyük ölçekte ilk kez klor gazı kullandı. Kısa sürede iki taraf da
      gaz maskesi ve kimyasal silah üretmeye başladı.`},

/* ---------------------------------------------------------------- 1916 */
verdun:{p:[5.38,49.16], k:"mh", n:"Verdun", d:"21 Şubat – 18 Aralık 1916", lp:"e", w:"E", f:"bati",
  tx:`Almanya, Fransız ordusunu “kan kaybından bitirmek” için Verdun kalelerine saldırdı.
      On ay süren muharebede iki tarafın toplam kaybı 700.000’i aştı; cephe neredeyse
      yerinden oynamadı. “Geçemeyecekler” sözü buradan kalmıştır.`},
somme:{p:[2.75,49.98], k:"mh", n:"Somme · ilk tanklar", d:"1 Temmuz – 18 Kasım 1916", lp:"w", f:"bati",
  tx:`Verdun’daki baskıyı hafifletmek için İngiliz ve Fransız orduları taarruza geçti.
      İlk gün İngiliz ordusu 57.000’i aşkın kayıp verdi. 15 Eylül’de tanklar ilk kez
      savaş alanına çıktı. Toplam kayıp bir milyonu geçti.`},
jutland:{p:[6.1,56.7], k:"den", n:"Jutland Deniz Muharebesi", d:"31 Mayıs – 1 Haziran 1916", lp:"e", f:"deniz",
  tx:`Savaşın tek büyük filo çarpışması. İngiltere daha çok gemi kaybetti ama Alman
      donanması bir daha açık denize çıkmaya cesaret edemedi; İngiliz ablukası sürdü.
      Almanya bunun üzerine denizaltı savaşına ağırlık verdi.`},
brusilov:{p:[25.33,50.75], k:"mh", n:"Brusilov taarruzu", d:"Haziran – Eylül 1916", lp:"n", w:"E", f:"dogu",
  tx:`General Brusilov’un geniş bir cephede aynı anda başlattığı taarruz Avusturya-Macaristan
      ordusunu çökme noktasına getirdi. Osmanlı Devleti müttefikine yardım için Galiçya’ya
      bir kolordu gönderdi.`},
kut:{p:[45.82,32.51], k:"kus", n:"Kut’ül-Amare Zaferi", d:"29 Nisan 1916", lp:"e", w:"C", f:"irak",
  tx:`Beş ay süren kuşatmanın ardından General Townshend ve yaklaşık 13.000 İngiliz ve Hint
      askeri <b>Halil Paşa</b>’ya teslim oldu. Kuşatmayı yürüten Mareşal von der Goltz
      zaferden birkaç gün önce salgın hastalıktan ölmüştü.`},
erzurum16:{p:[41.27,39.90], k:"isg", n:"Erzurum’un düşüşü", d:"16 Şubat 1916", lp:"s", w:"E", f:"kafkas",
  tx:`Ruslar kış ortasında Erzurum kalelerini ele geçirdi. Ardından Muş ve Bitlis’e, bahar ve
      yaz aylarında Trabzon’a ve Erzincan’a ilerlediler.`},
trabzon16:{p:[39.72,41.00], k:"isg", n:"Trabzon’un düşüşü", d:"18 Nisan 1916", lp:"n", w:"E", f:"kafkas",
  tx:`Rus kuvvetleri denizden de desteklenerek Karadeniz kıyısı boyunca ilerledi ve
      Trabzon’u aldı. Temmuz’da Erzincan da düştü.`},
musbitlis:{p:[41.80,38.57], k:"mh", n:"Muş ve Bitlis geri alınıyor", d:"7 – 8 Ağustos 1916", lp:"s", w:"C", f:"kafkas",
  tx:`Nisan 1916’da mirliva (tuğgeneral) olan 16. Kolordu Komutanı <b>Mustafa Kemal</b>, Muş ve
      Bitlis’i Ruslardan geri aldı. Kafkas cephesinde 1916’nın en önemli başarısıydı. Muş
      kısa süre sonra yeniden kaybedildi, Bitlis elde tutuldu.`},
arap:{p:[39.83,21.42], k:"sia", n:"Şerif Hüseyin isyanı", d:"10 Haziran 1916", lp:"e", f:"hicaz",
  tx:`Mekke Emiri Şerif Hüseyin, İngilizlerin bağımsız bir Arap devleti vaadine
      (McMahon yazışmaları) güvenerek Osmanlı’ya karşı ayaklandı. Mekke, Cidde ve Taif
      kısa sürede el değiştirdi.`},
medine:{p:[39.61,24.47], k:"kus", n:"Medine savunması", d:"1916 – Ocak 1919", lp:"e", w:"C", f:"hicaz",
  tx:`<b>Fahrettin Paşa</b> Hicaz Demiryolu’nun son durağı Medine’yi iki buçuk yıl boyunca
      savundu. Mondros’tan sonra bile teslim olmayı reddetti; şehri ancak Ocak 1919’da
      bırakabildi. İngilizler ona “Çöl Kaplanı” adını verdi.`},
kanal2:{p:[32.65,31.0], k:"mh", n:"II. Kanal Harekâtı · Romani", d:"4 Ağustos 1916", lp:"s", w:"E", f:"kanal",
  tx:`Osmanlı ve Alman birliklerinin Kanal’a ikinci saldırısı Romani’de püskürtüldü.
      Bundan sonra İngilizler Sina’yı geçerek Filistin’e ilerledi.`},
romanya16:{p:[26.10,44.43], k:"isg", n:"Romanya savaşta · Bükreş düşüyor", d:"27 Ağustos – 6 Aralık 1916", lp:"s", w:"C", f:"romanya",
  tx:`Brusilov taarruzunun başarısına güvenen Romanya İtilaf Devletleri’nin yanında savaşa
      girdi ve Transilvanya’ya saldırdı. Alman, Avusturya, Bulgar ve Osmanlı kuvvetlerinin
      karşı taarruzuyla Bükreş dört ayda düştü.`},
galicya16:{p:[24.80,49.40], k:"mh", n:"Galiçya’da 15. Kolordu", d:"Temmuz 1916 – 1917", lp:"w", f:"galicya",
  tx:`Osmanlı Devleti, Brusilov taarruzuna karşı müttefiki Avusturya-Macaristan’a yardım için
      Galiçya’ya 15. Kolordu’yu gönderdi. Kolordu Zlota Lipa ırmağı boyunca ağır kayıplar
      verdi. <b>Yardım cephelerinden</b> biridir.`},
sykes:{p:[-0.13,51.51], k:"ant", n:"Sykes-Picot Antlaşması (gizli)", d:"Mayıs 1916", lp:"n", f:"siyasi",
  tx:`İngiltere ve Fransa, Rusya’nın onayıyla Osmanlı’nın Arap topraklarını gizlice paylaştı:
      Irak İngiltere’ye; Suriye, Lübnan ve Adana çevresi Fransa’ya; Doğu Anadolu Rusya’ya
      bırakılacak, Filistin uluslararası yönetime girecekti.`},

/* ---------------------------------------------------------------- 1917 */
abd:{p:[-2.21,47.27], k:"sia", n:"ABD savaşa giriyor", d:"6 Nisan 1917", lp:"s", f:"siyasi",
  tx:`Almanya’nın sınırsız denizaltı savaşına dönmesi ve Meksika’yı ABD’ye karşı savaşa
      kışkırtan <b>Zimmermann telgrafı</b>nın ortaya çıkması üzerine ABD Almanya’ya savaş açtı.
      İlk Amerikan birlikleri Haziran’da Saint-Nazaire’e çıktı. (ABD Osmanlı’ya savaş ilan
      etmedi.)`},
devrim:{p:[30.32,59.94], k:"sia", n:"Rusya’da devrim", d:"Mart ve Kasım 1917", lp:"se", f:"siyasi",
  tx:`Açlık ve yenilgiler Petrograd’da ayaklanmaya yol açtı; Çar II. Nikola tahttan indirildi.
      Kasım’da Lenin önderliğindeki Bolşevikler iktidarı aldı, “barış, toprak, ekmek” sözü
      verdi ve Aralık’ta ateşkes imzaladı.`},
bagdat17:{p:[44.37,33.31], k:"isg", n:"Bağdat’ın düşüşü", d:"11 Mart 1917", lp:"w", w:"E", f:"irak",
  tx:`Kut yenilgisinden sonra takviye alan İngiliz ordusu General Maude komutasında Dicle
      boyunca ilerleyip Bağdat’ı aldı. Yıl sonunda Samarra ve Tikrit’e ulaştılar.`},
gazze:{p:[34.46,31.50], k:"mh", n:"Gazze muharebeleri", d:"Mart – Kasım 1917", lp:"w", f:"filistin",
  tx:`Osmanlı kuvvetleri Mart ve Nisan’daki iki İngiliz saldırısını Gazze önlerinde püskürttü.
      General Allenby Ekim sonunda Birüssebi’yi alıp hattı yandan dolaşınca Gazze de düştü.`},
kudus:{p:[35.21,31.77], k:"isg", n:"Kudüs’ün kaybı", d:"9 Aralık 1917", lp:"e", w:"E", f:"filistin",
  tx:`Kutsal şehirlere zarar gelmesin diye Osmanlı birlikleri çatışmadan çekildi; Kudüs
      yaklaşık 400 yıllık Osmanlı yönetiminden çıktı.`},
akabe:{p:[35.0,29.53], k:"isg", n:"Akabe’nin düşüşü", d:"6 Temmuz 1917", lp:"w", w:"E", f:"hicaz",
  tx:`Şerif Hüseyin’in oğlu Faysal’ın aşiret kuvvetleri, İngiliz subayı T. E. Lawrence’ın da
      katıldığı bir baskınla Akabe’yi karadan aldı. Arap kuvvetleri bundan sonra Hicaz
      Demiryolu’na saldırılar düzenledi.`},
caporetto:{p:[13.58,46.25], k:"mh", n:"Kobarid (Caporetto)", d:"24 Ekim – 19 Kasım 1917", lp:"n", w:"C", f:"italya",
  tx:`Alman ve Avusturya-Macaristan orduları İtalyan cephesini yardı. İtalyanlar 100
      kilometreden fazla geri çekilip Piave ırmağında tutunabildi; 250.000’den fazla asker
      esir düştü.`},
balfour:{p:[-0.4,51.3], k:"ant", n:"Balfour Deklarasyonu", d:"2 Kasım 1917", lp:"s", f:"siyasi",
  tx:`İngiltere Dışişleri Bakanı Balfour, Filistin’de bir “Yahudi ulusal yurdu” kurulmasını
      desteklediklerini açıkladı. Bu söz, Araplara verilen vaatlerle çelişiyordu.`},
erzincan17:{p:[39.49,39.75], k:"ant", n:"Erzincan Ateşkesi", d:"18 Aralık 1917", lp:"w", f:"kafkas",
  tx:`Osmanlı ile Rus Kafkas ordusu arasında imzalandı. Dağılan Rus ordusunun yerini tutmaya
      çalışan silahlı gruplar bölgede kaldı; Osmanlı ordusu Şubat 1918’de ilerlemeye başladı.`},
yunan17:{p:[23.73,37.98], k:"sia", n:"Yunanistan savaşa giriyor", d:"Haziran 1917", lp:"e", f:"makedonya",
  tx:`Tarafsızlıktan yana olan Kral Konstantin İtilaf baskısıyla tahttan çekildi. Başbakan
      Venizelos Yunanistan’ı İtilaf Devletleri’nin yanında savaşa soktu.`},
stjean:{p:[6.35,45.28], k:"ant", n:"St. Jean de Maurienne (gizli)", d:"Nisan 1917", lp:"n", f:"siyasi",
  tx:`İngiltere, Fransa ve İtalya arasındaki bu gizli anlaşmayla İzmir ve çevresi İtalya’ya
      vaat edildi. Rusya’nın onayı alınamadığı için sonradan geçersiz sayıldı.`},
passchendaele:{p:[3.02,50.90], k:"mh", n:"III. Ypres · Passchendaele", d:"Temmuz – Kasım 1917", lp:"e", f:"bati",
  tx:`Yağmurla bataklığa dönen arazide yapılan İngiliz taarruzu birkaç kilometre ilerleme
      için yüz binlerce askere mal oldu.`},

/* ---------------------------------------------------------------- 1918 */
wilson:{p:null, k:"sia", n:"Wilson İlkeleri", d:"8 Ocak 1918", f:"siyasi",
  tx:`ABD Başkanı Woodrow Wilson barış için 14 ilke açıkladı: gizli antlaşmalara son,
      denizlerde serbestlik, silahsızlanma, ulusların kendi kaderini tayin hakkı ve bir
      Milletler Cemiyeti. <b>12. madde</b> Osmanlı’nın Türk bölgelerine egemenlik, diğer
      uluslara özerklik ve Boğazların herkese açık olmasını öngörüyordu.`},
brest:{p:[23.69,52.10], k:"ant", n:"Brest-Litovsk Antlaşması", d:"3 Mart 1918", lp:"s", f:"dogu",
  tx:`Sovyet Rusya ile İttifak Devletleri arasında imzalandı. Rusya Polonya, Baltık bölgesi,
      Finlandiya ve Ukrayna üzerindeki haklarından vazgeçti. <b>Kars, Ardahan ve Batum</b>
      (Elviye-i Selâse) Osmanlı’ya bırakıldı.`},
bukres18:{p:[26.10,44.43], k:"ant", n:"Bükreş Antlaşması", d:"7 Mayıs 1918", lp:"s", f:"romanya",
  tx:`Yalnız kalan Romanya ağır şartlarla barış imzaladı. Dobruca’nın güneyi Bulgaristan’a
      bırakıldı. Romanya ise Rusya’nın dağılmasından yararlanıp Besarabya’yı almıştı.`},
kars18:{p:[43.10,40.60], k:"isg", n:"Kars geri alınıyor", d:"25 Nisan 1918", lp:"ne", w:"C", f:"kafkas",
  tx:`Osmanlı ordusu 12 Mart’ta Erzurum’u, 14 Nisan’da Batum’u, 25 Nisan’da Kars’ı geri aldı.
      Temmuz’da yapılan halk oylamasıyla Kars, Ardahan ve Batum’un Osmanlı’ya katıldığı
      ilan edildi.`},
baku:{p:[49.87,40.41], k:"mh", n:"Bakü", d:"15 Eylül 1918", lp:"s", w:"C", f:"kafkas",
  tx:`Enver Paşa’nın kardeşi <b>Nuri Paşa</b> komutasındaki Kafkas İslam Ordusu, Azerbaycan
      kuvvetleriyle birlikte Bakü’yü aldı. Mondros’tan sonra Osmanlı birlikleri bölgeden
      çekildi.`},
bahar:{p:[3.0,49.80], k:"mh", n:"Alman bahar taarruzu", d:"21 Mart – Temmuz 1918", lp:"n", w:"E", f:"bati",
  tx:`Doğu cephesinden gelen tümenlerle Almanya dört büyük taarruz yaptı; bazı yerlerde 60
      kilometre ilerleyip Marne’a yeniden ulaştı. Ancak yıpranan ordu ikmal sorunu yaşadı,
      Temmuz’da inisiyatif İtilaf’a geçti.`},
abdasker:{p:[-4.49,48.39], k:"sia", n:"Amerikan askerleri Fransa’da", d:"1918", lp:"e", f:"bati",
  tx:`1918 yazında her ay 250.000’e yakın Amerikan askeri Fransa’ya ulaşıyordu. Yıl sonunda
      sayıları iki milyonu geçti.`},
nablus:{p:[35.26,32.22], k:"mh", n:"Nablus (Megiddo) yenilgisi", d:"19 – 25 Eylül 1918", lp:"e", w:"E", f:"filistin",
  tx:`Allenby’nin taarruzu Filistin cephesini tek günde yardı. Yıldırım Orduları Grubu’nun
      7. ve 8. orduları dağıldı; Mustafa Kemal 7. Ordu’nun kalan birliklerini Şeria
      ırmağının ötesine çekmeyi başardı.`},
sam:{p:[36.29,33.51], k:"isg", n:"Şam’ın kaybı", d:"1 Ekim 1918", lp:"e", w:"E", f:"filistin",
  tx:`İngiliz ve Arap kuvvetleri Şam’a girdi. Ardından Beyrut, Humus ve Halep düştü.`},
halep:{p:[37.12,36.42], k:"mh", n:"Halep’in kuzeyinde son hat", d:"26 Ekim 1918", lp:"n", w:"C", f:"filistin",
  tx:`Mustafa Kemal Halep’i boşalttıktan sonra şehrin kuzeyinde (Katma–Deir Cemal) bir
      savunma hattı kurdu ve İngiliz ilerleyişini durdurdu. Ateşkes imzalandığında cephe
      bu hattaydı; Misak-ı Millî’nin güney sınırı bu çizgiye dayanır.`},
dobropole:{p:[21.95,41.15], k:"mh", n:"Dobro Pole yarması", d:"15 Eylül 1918", lp:"w", w:"E", f:"makedonya",
  tx:`Makedonya cephesindeki İtilaf taarruzu Bulgar ordusunu çökertti. Bulgaristan 29 Eylül’de
      Selanik’te ateşkes imzaladı; Osmanlı’nın Almanya ile kara bağlantısı koptu.`},
vittorio:{p:[12.30,45.99], k:"mh", n:"Vittorio Veneto", d:"24 Ekim – 3 Kasım 1918", lp:"e", w:"E", f:"italya",
  tx:`İtalyan taarruzu dağılmakta olan Avusturya-Macaristan ordusunu çökertti. İmparatorluğun
      halkları birer birer bağımsızlıklarını ilan ediyordu.`},
mondros:{p:[25.27,39.87], k:"ant", n:"Mondros Ateşkes Antlaşması", d:"30 Ekim 1918", lp:"w", f:"siyasi",
  tx:`Limni adasındaki Mondros limanında, Agamemnon zırhlısında imzalandı. Osmanlı adına
      Bahriye Nazırı <b>Rauf Bey</b>, İngiltere adına Amiral Calthorpe imzaladı. 25 maddelik
      antlaşmayla Osmanlı Devleti fiilen teslim oldu: ordu terhis edilecek, Boğazlar
      açılacak, İtilaf Devletleri stratejik noktaları işgal edebilecekti.`},
villagiusti:{p:[11.88,45.40], k:"ant", n:"Villa Giusti Ateşkesi", d:"3 Kasım 1918", lp:"s", f:"italya",
  tx:`Avusturya-Macaristan Padova yakınlarında ateşkes imzaladı. İmparatorluk artık fiilen
      dağılmıştı.`},
compiegne:{p:[2.91,49.43], k:"ant", n:"Compiègne Ateşkesi", d:"11 Kasım 1918", lp:"n", f:"bati",
  tx:`Mareşal Foch’un vagonunda imzalandı; silahlar sabah 11.00’de sustu. Almanya Alsas-
      Loren’i boşaltacak, Ren’in batısı işgal edilecek, donanması teslim edilecekti.`},
kaiser:{p:[13.40,52.52], k:"sia", n:"Almanya’da devrim", d:"9 Kasım 1918", lp:"n", f:"siyasi",
  tx:`Kiel’deki denizci isyanıyla başlayan ayaklanmalar Berlin’e ulaştı. Kayzer II. Wilhelm
      tahttan çekilip Hollanda’ya kaçtı; Almanya’da cumhuriyet ilan edildi.`},

/* ---------------------------------------------------------------- Mondros sonrası */
istanbul:{p:[28.98,41.01], k:"isg", n:"İstanbul’un işgali", d:"13 Kasım 1918 · 16 Mart 1920", lp:"e", f:"isgal",
  tx:`İtilaf donanması 13 Kasım 1918’de İstanbul önlerine demirledi. Mustafa Kemal o gün
      şehre geldiğinde “Geldikleri gibi giderler” dedi. Şehir 16 Mart 1920’de resmen işgal
      edildi; Meclis-i Mebusan basıldı, bazı milletvekilleri Malta’ya sürüldü.`},
musul18:{p:[43.13,36.34], k:"isg", n:"Musul’un işgali", d:"Kasım 1918", lp:"e", f:"isgal",
  tx:`İngilizler ateşkes imzalandıktan sonra, 7. maddeye dayanarak Musul’u işgal etti.
      Musul sorunu 1926’ya kadar Türkiye ile İngiltere arasında çözülemedi.`},
iskenderun:{p:[36.17,36.58], k:"isg", n:"İskenderun’un işgali", d:"Kasım 1918", lp:"w", f:"isgal",
  tx:`İngilizler İskenderun’u aldı; ardından Antep, Maraş ve Urfa’yı işgal edip 1919 sonunda
      bu bölgeleri Fransızlara bıraktılar.`},
izmir:{p:[27.14,38.42], k:"isg", n:"İzmir’in işgali", d:"15 Mayıs 1919", lp:"w", f:"isgal",
  tx:`İtilaf Devletleri’nin onayıyla Yunan ordusu İzmir’e çıktı. İlk kurşunu gazeteci
      <b>Hasan Tahsin</b> attı. İşgal Anadolu’da büyük bir tepkiye yol açtı; Kuvâ-yı Millîye
      birlikleri Batı Anadolu’da örgütlenmeye başladı.`},
antalya:{p:[30.70,36.89], k:"isg", n:"Antalya’ya İtalyan çıkarması", d:"28 Mart 1919", lp:"s", f:"isgal",
  tx:`İtalya, gizli antlaşmalarla vaat edilen Antalya’ya asker çıkardı; daha sonra Konya,
      Burdur, Fethiye ve Kuşadası’na da birlik gönderdi.`},
adana:{p:[35.32,37.00], k:"isg", n:"Çukurova’nın işgali", d:"Aralık 1918", lp:"e", f:"isgal",
  tx:`Fransızlar Mersin’e çıkıp Adana’ya girdi. Birliklerinde Ermeni gönüllüler de vardı.
      Güney cephesinde direniş ilk olarak burada örgütlendi.`},
medine19:{p:[39.61,24.47], k:"isg", n:"Medine’nin teslimi", d:"10 Ocak 1919", lp:"e", f:"hicaz",
  tx:`Fahrettin Paşa, Mondros’tan sonra da teslim emrine uymadı. Ancak açlık ve hastalıkla
      zayıflayan birliklerinin baskısıyla şehri bıraktı ve esir alındı.`},
paris:{p:[2.35,48.86], k:"sia", n:"Paris Barış Konferansı", d:"18 Ocak 1919", lp:"n", f:"siyasi",
  tx:`32 devletin temsilcileri toplandı ama kararları “Dörtler” verdi: Wilson (ABD), Lloyd
      George (İngiltere), Clemenceau (Fransa) ve Orlando (İtalya). Yenilen devletler
      görüşmelere çağrılmadı; antlaşmalar onlara dikte edildi.`},
samsun:{p:[36.33,41.29], k:"cik", n:"Mustafa Kemal Samsun’da", d:"19 Mayıs 1919", lp:"e", f:"isgal",
  tx:`9. Ordu Müfettişi olarak Bandırma vapuruyla İstanbul’dan ayrılan Mustafa Kemal Samsun’a
      çıktı. Millî Mücadele’nin başlangıcı kabul edilir.`},

/* ---------------------------------------------------------------- barış */
versay:{p:[2.13,48.80], g:"paris", k:"ant", n:"Versay (Almanya)", d:"28 Haziran 1919", f:"baris",
  tx:`Almanya Alsas-Loren’i Fransa’ya, Poznan ve Batı Prusya’yı (“Koridor”) Polonya’ya
      bıraktı; bütün sömürgelerini kaybetti. Ordusu 100.000 kişiyle sınırlandı, ağır savaş
      tazminatı ödemeye mahkûm edildi, savaşın tek sorumlusu sayıldı.`},
stgermain:{p:[2.09,48.90], g:"paris", k:"ant", n:"Saint-Germain (Avusturya)", d:"10 Eylül 1919", f:"baris",
  tx:`Avusturya küçük bir cumhuriyete dönüştü. Çekoslovakya, Polonya ve Sırp-Hırvat-Sloven
      Krallığı’nın bağımsızlığını tanıdı; Güney Tirol ve Trieste İtalya’ya geçti. Almanya ile
      birleşmesi yasaklandı.`},
neuilly:{p:[2.27,48.88], g:"paris", k:"ant", n:"Neuilly (Bulgaristan)", d:"27 Kasım 1919", f:"baris",
  tx:`Bulgaristan Batı Trakya’yı kaybetti ve Ege’ye çıkışı kapandı. Batı Trakya önce
      İtilaf yönetimine, sonra Yunanistan’a verildi.`},
trianon:{p:[2.11,48.81], g:"paris", k:"ant", n:"Trianon (Macaristan)", d:"4 Haziran 1920", f:"baris",
  tx:`Macaristan topraklarının üçte ikisini kaybetti: Transilvanya Romanya’ya, Slovakya
      Çekoslovakya’ya, Hırvatistan ve Voyvodina SHS Krallığı’na geçti.`},
sevr:{p:[2.21,48.82], g:"paris", k:"ant", n:"Sevr (Osmanlı Devleti)", d:"10 Ağustos 1920", f:"baris",
  tx:`Osmanlı Devleti’ni fiilen ortadan kaldıran antlaşma: Doğu Trakya ve İzmir Yunanistan’a,
      Doğu Anadolu’da bir Ermeni devleti, güneydoğuda özerk bir Kürt bölgesi, Boğazlar
      uluslararası yönetime; Arap toprakları manda yönetimine. Osmanlı Meclisi’nce
      onaylanmadı, TBMM tanımadı ve hiç yürürlüğe girmedi. Haritada <b>Sevr</b> düğmesiyle
      gösterilir.`},
mc:{p:[6.14,46.20], k:"sia", n:"Milletler Cemiyeti", d:"10 Ocak 1920", lp:"e", f:"baris",
  tx:`Wilson’ın önerisiyle kurulan, merkezi Cenevre’deki uluslararası örgüt. Ancak ABD Senatosu
      onaylamadığı için ABD hiç üye olmadı; örgüt II. Dünya Savaşı’nı önleyemedi.`},
lozan:{p:[6.63,46.52], k:"ant", n:"Lozan Barış Antlaşması", d:"24 Temmuz 1923", lp:"s", f:"baris",
  tx:`Kurtuluş Savaşı’nın zaferinden sonra imzalandı. Sevr’in yerini aldı; Türkiye’nin
      bağımsızlığı ve bugünkü sınırlarının büyük kısmı uluslararası alanda tanındı,
      kapitülasyonlar kaldırıldı.`}
};
