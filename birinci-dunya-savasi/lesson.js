/* Cepheler, kişiler, ders notu ve sınıf soruları. */
"use strict";

/* ------------------------------------------------------------------ cepheler
   g: taarruz · savunma · yardim · avrupa     st: haritada açılacak aşama
   view: [boylam0, enlem0, boylam1, enlem1]   ev: ilgili olaylar                    */
D.F = [
{ id:"kafkas", g:"taarruz", n:"Kafkas Cephesi", d:"Kasım 1914 – Ekim 1918", st:2,
  view:[37.5,37.3,50.5,42.8], ev:["sarikamis","erzurum16","trabzon16","musbitlis","erzincan17","kars18","baku"],
  amac:`1878’de kaybedilen Kars, Ardahan ve Batum’u geri almak; Kafkasya ve Orta Asya’daki
        Türklerle bağlantı kurmak ve Bakü petrollerine ulaşmak. Almanya da Rus ordusunun bir
        bölümünün burada tutulmasını istiyordu.`,
  kom:"Enver Paşa (Sarıkamış) · Mustafa Kemal (16. Kolordu, 1916) · Vehip Paşa · Nuri Paşa (1918)",
  tx:[`Enver Paşa’nın Aralık 1914’teki <b>Sarıkamış</b> kuşatma harekâtı ağır kış koşullarında
       felaketle sonuçlandı. 1916’da Ruslar Erzurum, Trabzon, Erzincan, Muş ve Bitlis’i aldı;
       Mustafa Kemal Ağustos’ta Muş ve Bitlis’i geri aldı.`,
      `1917 devrimlerinden sonra Rus ordusu dağıldı ve <b>Erzincan Ateşkesi</b> imzalandı.
       1918’de Osmanlı ordusu kaybedilen yerleri, Brest-Litovsk ile de Kars, Ardahan ve Batum’u
       geri aldı; Kafkas İslam Ordusu Bakü’ye ulaştı.`,
      `<b>Tehcir (1915):</b> Rus ordusundaki gönüllü Ermeni birlikleri ve cephe gerisindeki
       ayaklanmalar gerekçe gösterilerek 27 Mayıs 1915’te Sevk ve İskân Kanunu çıkarıldı; savaş
       bölgesindeki Ermeniler Suriye ve Irak’a gönderildi. Yollarda salgın, açlık ve
       saldırılar yüzünden yüz binlerce kişi hayatını kaybetti. Olayların nasıl
       nitelendirileceği bugün de tarihçiler ve devletler arasında tartışmalıdır: birçok ülke ve
       tarihçi soykırım olarak tanımlarken Türkiye bu nitelendirmeyi reddeder.`],
  sonuc:`Rusya’nın savaştan çekilmesiyle cephe Osmanlı lehine kapandı, ancak Mondros’tan sonra
         Kafkasya’dan çekilmek zorunda kalındı.` },
{ id:"kanal", g:"taarruz", n:"Kanal (Süveyş) Cephesi", d:"Şubat 1915 · Ağustos 1916", st:3,
  view:[29.8,28.6,36.6,32.6], ev:["misir","kanal1","kanal2"],
  amac:`İngiltere’nin Hindistan ve Uzak Doğu sömürgeleriyle bağlantısını sağlayan Süveyş
        Kanalı’nı ele geçirmek ya da kapatmak; Mısır’ı geri almak ve Mısır halkını İngilizlere
        karşı ayaklandırmak.`,
  kom:"Cemal Paşa (4. Ordu) · Kress von Kressenstein",
  tx:[`Sina Çölü’nü suyun ve yolun yetersizliğine rağmen geçen birlikler Şubat 1915’te
       İsmailiye yakınlarında kanala ulaştı; saldırı başarısız oldu. Ağustos 1916’daki ikinci
       harekât da Romani’de püskürtüldü.`,
      `Beklenen Mısır ayaklanması gerçekleşmedi. İngilizler bundan sonra savunmadan taarruza
       geçip Sina’yı aştı ve Filistin’e yöneldi.`],
  sonuc:`İki harekât da başarısız oldu, ancak İngiltere büyük bir kuvveti Mısır’da tutmak
         zorunda kaldı.` },
{ id:"canakkale", g:"savunma", n:"Çanakkale Cephesi", d:"19 Şubat 1915 – 9 Ocak 1916", st:3,
  view:[23.6,38.6,29.6,41.9], ev:["goben","m18","canakkale"], detail:true,
  amac:`<b>İtilaf Devletleri’nin amacı:</b> İstanbul’u alıp Osmanlı’yı savaş dışı bırakmak,
        Boğazlardan Rusya’ya silah ve cephane ulaştırmak, Rus buğdayını dış pazara çıkarmak,
        tarafsız Balkan devletlerini kendi yanlarına çekmek ve Süveyş’i güvenceye almak.`,
  kom:"Cevat Paşa (Müstahkem Mevki) · Liman von Sanders (5. Ordu) · Esat Paşa · Vehip Paşa · Mustafa Kemal (19. Tümen, Anafartalar Grubu)",
  tx:[`Deniz harekâtı 19 Şubat’ta dış tabyaların bombardımanıyla başladı. <b>18 Mart</b>’ta
       İtilaf donanması boğazı geçmeyi denedi; Nusret’in mayınları ve kıyı topçusu karşısında
       büyük bir yenilgiye uğradı.`,
      `<b>25 Nisan</b>’da Arıburnu ve Seddülbahir’e çıkarma yapıldı. Mustafa Kemal
       Conkbayırı’nda 57. Alay’a “Ben size taarruzu emretmiyorum, ölmeyi emrediyorum”
       diyerek ilerleyişi durdurdu. Ağustos’taki Anafartalar çıkarması da püskürtüldü.`,
      `Siper savaşına dönen cephede sıcak, salgın ve ağır kayıplar iki tarafı da yıprattı.
       İtilaf kuvvetleri Aralık 1915 – Ocak 1916’da yarımadayı boşalttı.`],
  sonuc:`İstanbul ve Boğazlar kurtuldu; Rusya’ya yardım ulaşamadı ve bu durum 1917 Devrimi’ni
         hızlandırdı. Bulgaristan İttifak Devletleri’ne katıldı, savaş en az iki yıl uzadı.
         Mustafa Kemal’in adı duyuldu; Anzak kimliği Avustralya ve Yeni Zelanda’da ulusal
         bilincin parçası oldu.` },
{ id:"irak", g:"savunma", n:"Irak Cephesi", d:"Kasım 1914 – Kasım 1918", st:4,
  view:[40.8,28.8,50.2,37.8], ev:["fav","selmanpak","kut","bagdat17","musul18"],
  amac:`<b>İngiltere’nin amacı:</b> Basra Körfezi’ndeki petrol bölgelerini ve Abadan
        rafinerisini korumak, Hindistan yolunu güvenceye almak ve İran üzerinden Rusya ile
        bağlantı kurmak.`,
  kom:"Nurettin Bey · Mareşal von der Goltz · Halil (Kut) Paşa · Ali İhsan Paşa",
  tx:[`İngilizler Kasım 1914’te Basra’yı aldı ve Dicle boyunca kuzeye ilerledi. Kasım
       1915’te <b>Selman-ı Pak</b>’ta durduruldular ve Kut’ül-Amare’de kuşatıldılar.`,
      `29 Nisan 1916’da <b>Kut’ül-Amare</b>’de General Townshend ve yaklaşık 13.000 askeri
       teslim oldu. Takviye alan İngilizler Mart 1917’de <b>Bağdat</b>’ı aldı.`],
  sonuc:`Cephe savaşın sonuna kadar sürdü. İngilizler Mondros’tan sonra Musul’u da işgal etti;
         Musul sorunu Lozan’da çözülemedi, 1926’da Irak’a bırakıldı.` },
{ id:"filistin", g:"savunma", n:"Suriye-Filistin Cephesi", d:"1917 – Ekim 1918", st:5,
  view:[32.6,29.4,39.8,37.2], ev:["gazze","kudus","nablus","sam","halep"],
  amac:`Kanal harekâtlarından sonra İngilizlerin Sina’yı geçerek Filistin ve Suriye’ye
        ilerlemesiyle açıldı. Osmanlı için Anadolu’nun güney kapısını savunmak demekti.`,
  kom:"Cemal Paşa · Kress von Kressenstein · Falkenhayn ve Liman von Sanders (Yıldırım Orduları Grubu) · Mustafa Kemal (7. Ordu)",
  tx:[`1917 baharında iki Gazze muharebesi Osmanlı zaferiyle bitti. Ekim sonunda General
       Allenby Birüssebi’yi alarak hattı dolaştı; 9 Aralık’ta <b>Kudüs</b> kaybedildi.`,
      `Eylül 1918’de <b>Nablus (Megiddo)</b>’da cephe çöktü. Şam, Beyrut ve Halep düştü.
       Mustafa Kemal Halep’in kuzeyinde kurduğu hatla ilerleyişi durdurdu.`],
  sonuc:`Suriye, Filistin ve Lübnan Osmanlı’dan koptu. Mustafa Kemal’in savunduğu hat
         Misak-ı Millî’de güney sınırı olarak kabul edildi.` },
{ id:"hicaz", g:"savunma", n:"Hicaz-Yemen Cephesi", d:"1916 – Ocak 1919", st:4,
  view:[33.0,11.5,48.0,31.5], ev:["arap","medine","akabe","lahic","medine19"],
  amac:`Kutsal şehirleri ve Hicaz Demiryolu’nu korumak. İngilizler Osmanlı’nın halifelik
        gücünü zayıflatmak için Arapları ayaklandırdı.`,
  kom:"Fahrettin Paşa (Medine) · Ali Said Paşa (Lahiç)",
  tx:[`<b>Şerif Hüseyin</b> Haziran 1916’da İngilizlerin desteği ve bağımsızlık vaadiyle isyan
       etti. Mekke, Cidde ve Taif düştü; 1917’de Akabe alındı, demiryolu sürekli saldırıya
       uğradı.`,
      `<b>Fahrettin Paşa</b> Medine’yi Ocak 1919’a kadar savundu. Yemen’deki birlikler
       Lahiç’te Aden’i tehdit etmeyi savaş sonuna kadar sürdürdü.`],
  sonuc:`Arap isyanı Osmanlı’nın güney cephelerini zayıflattı. Savaştan sonra Araplara
         vaat edilen bağımsız devlet kurulmadı; bölge İngiliz ve Fransız mandasına girdi.` },
{ id:"galicya", g:"yardim", n:"Galiçya Cephesi", d:"Temmuz 1916 – 1917", st:4,
  view:[19.5,46.8,28.5,52.2], ev:["galicya16","brusilov"],
  amac:`Brusilov taarruzuyla zor duruma düşen Avusturya-Macaristan’a yardım etmek.`,
  kom:"Yakup Şevki Paşa (15. Kolordu)",
  tx:[`Osmanlı Devleti Galiçya’ya iki tümenden oluşan 15. Kolordu’yu gönderdi. Kolordu Zlota
       Lipa ırmağı boyunca Ruslara karşı ağır kayıplarla savaştı ve 1917’de geri çağrıldı.`],
  sonuc:`Müttefike yardım edildi ama Osmanlı’nın kendi cepheleri asker bakımından
         zayıfladı.` },
{ id:"makedonya", g:"yardim", n:"Makedonya Cephesi", d:"1916 – 1917", st:4,
  view:[18.8,39.3,26.0,43.3], ev:["selanik15","dobropole"],
  amac:`Selanik’e çıkan İtilaf kuvvetlerine karşı Bulgaristan’a yardım etmek.`,
  kom:"Abdülkerim Paşa (20. Kolordu)",
  tx:[`20. Kolordu ve 177. Piyade Alayı Makedonya’da Bulgar ve Alman birlikleriyle birlikte
       Selanik cephesinde savaştı.`,
      `Cephe Eylül 1918’de <b>Dobro Pole</b>’de yarıldı; Bulgaristan’ın ateşkes imzalaması
       Osmanlı’nın Almanya ile kara bağlantısını kopardı.`],
  sonuc:`Osmanlı birlikleri 1917’de geri çağrıldı.` },
{ id:"romanya", g:"yardim", n:"Romanya (Dobruca) Cephesi", d:"1916 – 1917", st:4,
  view:[21.5,42.6,30.5,47.6], ev:["romanya16","bukres18"],
  amac:`Ağustos 1916’da İtilaf’ın yanında savaşa giren Romanya’ya karşı müttefiklere
        yardım etmek.`,
  kom:"Mustafa Hilmi Paşa (6. Kolordu) · Mackensen",
  tx:[`Osmanlı 6. Kolordusu, Mackensen’in ordusuyla Dobruca’da ve Tuna boyunca savaştı;
       Bükreş Aralık 1916’da alındı.`],
  sonuc:`Romanya büyük ölçüde işgal edildi ve Mayıs 1918’de barış imzaladı.` },
/* Avrupa cepheleri — genel bakış */
{ id:"bati", g:"avrupa", n:"Batı Cephesi", d:"Ağustos 1914 – Kasım 1918", st:4,
  view:[-1.5,47.0,8.5,52.0], ev:["liege","marne","ypres14","ypres15","verdun","somme","passchendaele","bahar","compiegne"],
  amac:`Almanya ile Fransa, İngiltere ve 1917’den sonra ABD arasındaki ana cephe.`,
  kom:"Moltke · Falkenhayn · Hindenburg ve Ludendorff — Joffre · Pétain · Haig · Foch · Pershing",
  tx:[`Marne’dan sonra İsviçre’den Kuzey Denizi’ne uzanan siper hattı dört yıl boyunca birkaç
       kilometreden fazla oynamadı. Makineli tüfek, dikenli tel ve topçu, taarruz edeni
       her seferinde ağır kayıplara uğrattı.`,
      `1918 baharındaki son Alman taarruzundan sonra İtilaf Devletleri Amerikan askerlerinin
       desteğiyle ilerledi; Almanya Kasım’da ateşkes istedi.`],
  sonuc:`Savaşın kaderini belirleyen cephe oldu.` },
{ id:"dogu", g:"avrupa", n:"Doğu Cephesi", d:"Ağustos 1914 – Mart 1918", st:3,
  view:[17.5,45.5,32.5,58.5], ev:["tannenberg","lemberg","gorlice","varsova","brusilov","brest"],
  amac:`Almanya ve Avusturya-Macaristan ile Rusya arasındaki uzun ve hareketli cephe.`,
  kom:"Hindenburg · Ludendorff · Mackensen — Brusilov",
  tx:[`Batıdan farklı olarak cephe yüzlerce kilometre ileri geri hareket etti. 1915’te Ruslar
       Polonya’yı kaybetti; 1916’da Brusilov taarruzu Avusturya’yı sarstı. Devrimden sonra Rusya
       Brest-Litovsk’la savaştan çekildi.`],
  sonuc:`Rusya’nın çekilmesi Almanya’ya 1918 baharında batıda son bir şans verdi.` },
{ id:"italya", g:"avrupa", n:"İtalya Cephesi", d:"Mayıs 1915 – Kasım 1918", st:5,
  view:[9.0,44.4,15.5,47.2], ev:["italya15","isonzo","caporetto","vittorio","villagiusti"],
  amac:`İtalya ile Avusturya-Macaristan arasında, Alpler’de ve Isonzo ırmağı boyunca.`,
  kom:"Cadorna · Diaz — Conrad · Boroević",
  tx:[`İtalyanlar Isonzo’da on bir taarruz yaptı. 1917’de Kobarid’de cephe yarıldı, Piave’ye
       çekilindi. Ekim 1918’de Vittorio Veneto’da Avusturya-Macaristan ordusu çöktü.`],
  sonuc:`İtalya Trentino, Güney Tirol ve Trieste’yi aldı ama beklediği diğer toprakları
         alamayınca “sakatlanmış zafer” söylemi doğdu.` },
{ id:"balkan", g:"avrupa", n:"Sırbistan ve Balkanlar", d:"1914 – 1918", st:3,
  view:[16.5,39.0,27.0,46.5], ev:["saraybosna","cer","sirbistan15","selanik15","dobropole"],
  amac:`Savaşın başladığı cephe: Avusturya-Macaristan ile Sırbistan ve Karadağ.`,
  kom:"Potiorek · Mackensen — Putnik · Franchet d’Espèrey",
  tx:[`Sırbistan 1914’te iki Avusturya saldırısını püskürttü, 1915’te Bulgaristan’ın da
       katılmasıyla işgal edildi. İtilaf kuvvetleri Selanik’ten 1918’de Balkanlar’ı geri aldı.`],
  sonuc:`Savaştan sonra Sırbistan, Sırp-Hırvat-Sloven Krallığı’nın çekirdeği oldu.` }
];
D.FG = {taarruz:"Taarruz cepheleri", savunma:"Savunma cepheleri", yardim:"Yardım cepheleri", avrupa:"Avrupa’daki ana cepheler"};

/* ------------------------------------------------------------------ kişiler */
D.P = [
{g:"osm", n:"Enver Paşa", y:"1881 – 1922", r:"Harbiye Nazırı, Başkomutan Vekili", ev:["sarikamis","ittifak"],
 tx:`İttihat ve Terakki’nin en güçlü isimlerinden. Almanya ile ittifakın başlıca savunucusuydu;
     Sarıkamış harekâtını bizzat yönetti. Mondros’tan sonra yurt dışına kaçtı, 1922’de Orta
     Asya’da Bolşeviklere karşı savaşırken öldü.`},
{g:"osm", n:"Talat Paşa", y:"1874 – 1921", r:"Dahiliye Nazırı · 1917’den Sadrazam", ev:[],
 tx:`İttihat ve Terakki’nin önde gelen lideri. 1917’de sadrazam oldu. Kasım 1918’de Enver ve
     Cemal paşalarla birlikte bir Alman gemisiyle ülkeden ayrıldı; 1921’de Berlin’de öldürüldü.`},
{g:"osm", n:"Cemal Paşa", y:"1872 – 1922", r:"Bahriye Nazırı · 4. Ordu Komutanı", ev:["kanal1","kanal2"],
 tx:`Kanal harekâtlarını yönetti ve 1917’ye kadar Suriye’de geniş yetkilerle bulundu. Savaştan
     sonra yurt dışına gitti; 1922’de Tiflis’te öldürüldü.`},
{g:"osm", n:"Mustafa Kemal", y:"1881 – 1938", r:"19. Tümen · Anafartalar Grubu · 7. Ordu Komutanı",
 ev:["canakkale","musbitlis","halep","samsun"],
 tx:`Çanakkale’de Arıburnu ve Conkbayırı’nda, Ağustos’ta Anafartalar’da ilerleyişi durdurdu.
     1916’da Muş ve Bitlis’i geri aldı. 1918’de Halep’in kuzeyinde son savunma hattını kurdu.
     19 Mayıs 1919’da Samsun’a çıkarak Millî Mücadele’yi başlattı.`},
{g:"osm", n:"Cevat Paşa (Çobanlı)", y:"1870 – 1938", r:"Çanakkale Müstahkem Mevki Komutanı", ev:["m18"],
 tx:`18 Mart 1915 deniz zaferini kazanan boğaz savunmasının komutanı. Mayın hatlarının ve
     kıyı bataryalarının düzenini kurdu.`},
{g:"osm", n:"Seyit Onbaşı", y:"1889 – 1939", r:"Rumeli Mecidiye Tabyası topçusu", ev:["m18"],
 tx:`18 Mart’ta tabyadaki topun mermi kaldıran vinci bozulunca ağır mermiyi sırtında taşıyarak
     topa sürdüğü anlatılır. Çanakkale kahramanlığının simgesi hâline geldi.`},
{g:"osm", n:"Halil (Kut) Paşa", y:"1882 – 1957", r:"6. Ordu Komutanı", ev:["kut"],
 tx:`Kut’ül-Amare’de İngiliz ordusunu teslim alan komutan. Soyadı Kanunu’yla “Kut” soyadını
     aldı. Enver Paşa’nın amcasıdır.`},
{g:"osm", n:"Fahrettin Paşa (Türkkan)", y:"1868 – 1948", r:"Medine Muhafızı", ev:["medine","medine19"],
 tx:`Medine’yi iki buçuk yıl kuşatma altında savundu; Mondros’tan sonra da teslim olmadı.
     İngilizler ona “Çöl Kaplanı” dedi.`},
{g:"osm", n:"Nuri Paşa (Killigil)", y:"1889 – 1949", r:"Kafkas İslam Ordusu Komutanı", ev:["baku"],
 tx:`Enver Paşa’nın kardeşi. 1918’de Azerbaycan’a yardıma giden Kafkas İslam Ordusu’yla Bakü’yü
     aldı.`},
{g:"osm", n:"Rauf Bey (Orbay)", y:"1881 – 1964", r:"Bahriye Nazırı", ev:["mondros"],
 tx:`Mondros Ateşkes Antlaşması’nı Osmanlı adına imzaladı. Balkan Savaşı’nda Hamidiye
     kruvazörünün komutanı olarak tanınmıştı; sonra Millî Mücadele’ye katıldı.`},
{g:"osm", n:"Liman von Sanders", y:"1855 – 1929", r:"Alman askerî heyeti başkanı · 5. Ordu", ev:["canakkale"],
 tx:`1913’te Osmanlı ordusunu yenilemek için gelen Alman heyetinin başkanı. Çanakkale’de 5. Ordu’yu,
     1918’de Yıldırım Orduları Grubu’nu yönetti.`},
{g:"dunya", n:"Franz Ferdinand", y:"1863 – 1914", r:"Avusturya-Macaristan veliahdı", ev:["saraybosna"],
 tx:`İmparator Franz Joseph’in yeğeni ve tahtın varisi. 28 Haziran 1914’te Saraybosna’da eşiyle
     birlikte öldürüldü.`},
{g:"dunya", n:"Gavrilo Princip", y:"1894 – 1918", r:"Suikastçı", ev:["saraybosna"],
 tx:`“Genç Bosna” örgütüne üye, 19 yaşında bir Sırp milliyetçisi. Yaşı küçük olduğu için idam
     edilmedi; 1918’de hapiste veremden öldü.`},
{g:"dunya", n:"II. Wilhelm", y:"1859 – 1941", r:"Alman İmparatoru (Kayzer)", ev:["kaiser"],
 tx:`Almanya’yı dünya siyasetine (Weltpolitik) ve deniz silahlanmasına yöneltti. Kasım 1918’de
     tahttan çekilip Hollanda’ya sığındı.`},
{g:"dunya", n:"II. Nikola", y:"1868 – 1918", r:"Rus Çarı", ev:["devrim"],
 tx:`Son Rus çarı. Mart 1917’de tahttan indirildi; 1918’de ailesiyle birlikte Bolşeviklerce
     öldürüldü.`},
{g:"dunya", n:"Vladimir Lenin", y:"1870 – 1924", r:"Bolşevik lider", ev:["devrim","brest"],
 tx:`Ekim (Kasım) 1917 devrimini yönetti, Brest-Litovsk’la savaştan çekildi ve çarlık
     döneminin gizli antlaşmalarını yayımladı.`},
{g:"dunya", n:"Woodrow Wilson", y:"1856 – 1924", r:"ABD Başkanı", ev:["abd","wilson","mc"],
 tx:`ABD’yi 1917’de savaşa soktu. 14 ilkesiyle ulusların kendi kaderini tayin hakkını savundu;
     Milletler Cemiyeti’nin kurulmasına öncülük etti.`},
{g:"dunya", n:"Georges Clemenceau", y:"1841 – 1929", r:"Fransa Başbakanı", ev:["versay","paris"],
 tx:`“Kaplan” lakaplı başbakan. Paris Konferansı’nda Almanya’ya ağır şartlar uygulanmasını
     savundu.`},
{g:"dunya", n:"David Lloyd George", y:"1863 – 1945", r:"İngiltere Başbakanı", ev:["paris","sevr"],
 tx:`1916’dan itibaren İngiltere’yi yönetti. Paris’te Osmanlı topraklarının paylaşılmasını ve
     Yunanistan’ın Anadolu’ya çıkmasını destekledi.`},
{g:"dunya", n:"Winston Churchill", y:"1874 – 1965", r:"İngiliz Bahriye Bakanı", ev:["m18","canakkale"],
 tx:`Çanakkale harekâtının başlıca savunucusuydu. Yenilginin ardından görevinden ayrılmak
     zorunda kaldı.`},
{g:"dunya", n:"Şerif Hüseyin", y:"1854 – 1931", r:"Mekke Emiri · Hicaz Kralı", ev:["arap"],
 tx:`İngilizlerle yazışarak bir Arap krallığı vaadi aldı ve 1916’da Osmanlı’ya karşı ayaklandı.
     Savaştan sonra beklediği büyük Arap devleti kurulmadı.`},
{g:"dunya", n:"T. E. Lawrence", y:"1888 – 1935", r:"İngiliz subayı", ev:["akabe"],
 tx:`Arap isyanında Faysal’ın danışmanı olarak çalıştı; Akabe baskınına ve demiryolu
     saldırılarına katıldı. “Arabistanlı Lawrence” olarak tanındı.`}
];

/* ------------------------------------------------------------------ ders notu */
D.N = [
{ id:"neden", h:"Savaşın nedenleri", html:`
<div class="cols">
<div><h4>Uzun vadeli nedenler</h4><ul>
<li><b>Sanayi İnkılabı</b> — hammadde ve pazar arayışı, sömürge rekabeti</li>
<li><b>Milliyetçilik</b> — Fransız İhtilali’nin yaydığı fikirler; çok uluslu imparatorluklarda bağımsızlık istekleri</li>
<li><b>Alsas-Loren</b> — Fransa’nın 1871’de kaybettiği toprakları geri alma isteği</li>
<li><b>Almanya’nın dünya siyaseti</b> — sömürge ve donanma yarışı, İngiltere ile rekabet</li>
<li><b>Balkanlar</b> — Panslavizm ile Pangermenizm çatışması; Bosna-Hersek’in ilhakı (1908)</li>
<li><b>Bağdat Demiryolu</b> — İngiltere’nin Hindistan yolu kaygısı</li>
<li><b>Bloklaşma ve silahlanma</b> — “Silahlı Barış Dönemi”</li>
</ul></div>
<div><h4>Kıvılcım (görünür neden)</h4>
<p class="big">28 Haziran 1914 — Saraybosna suikastı</p>
<p>Avusturya-Macaristan veliahdı Franz Ferdinand’ın bir Sırp milliyetçisince öldürülmesi.
Ültimatom, seferberlikler ve savaş ilanları bir ay içinde bütün Avrupa’yı savaşa soktu.</p>
<h4>Bloklar</h4>
<table class="t"><tr><th>Üçlü İttifak (1882)</th><th>Üçlü İtilaf (1907)</th></tr>
<tr><td>Almanya</td><td>İngiltere</td></tr><tr><td>Avusturya-Macaristan</td><td>Fransa</td></tr>
<tr><td>İtalya <small>(1915’te taraf değiştirdi)</small></td><td>Rusya</td></tr></table>
</div></div>`},
{ id:"taraflar", h:"Kim, ne zaman katıldı?", html:`
<table class="t wide"><tr><th>İttifak Devletleri</th><th>İtilaf Devletleri</th></tr>
<tr><td>Almanya, Avusturya-Macaristan — 1914</td><td>Sırbistan, Rusya, Fransa, Belçika, İngiltere, Karadağ, Japonya — 1914</td></tr>
<tr><td><b>Osmanlı Devleti — Kasım 1914</b></td><td>İtalya — Mayıs 1915</td></tr>
<tr><td>Bulgaristan — Ekim 1915</td><td>Portekiz, Romanya — 1916</td></tr>
<tr><td></td><td>ABD, Yunanistan — 1917 · Rusya savaştan çekildi (1917–1918)</td></tr></table>`},
{ id:"osmanli", h:"Osmanlı Devleti neden savaşa girdi?", html:`
<div class="cols">
<div><h4>Osmanlı’nın beklentileri</h4><ul>
<li>Siyasi yalnızlıktan kurtulmak</li>
<li>Kaybedilen toprakları (Balkanlar, Ege adaları, Kafkasya, Mısır) geri almak</li>
<li>Kapitülasyonlardan ve dış borç baskısından kurtulmak</li>
<li>İttihat ve Terakki yöneticilerinin Almanya’nın savaşı kazanacağına inanması</li>
<li>Turancılık ve İslamcılık hedefleri</li></ul></div>
<div><h4>Almanya Osmanlı’yı neden istedi?</h4><ul>
<li>Boğazları kapatarak Rusya’ya yardım yolunu kesmek</li>
<li>Yeni cepheler açtırıp İngiltere ve Rusya’nın gücünü bölmek</li>
<li>Halifeliği kullanarak sömürgelerdeki Müslümanları ayaklandırmak</li>
<li>Osmanlı’nın insan gücünden, hammaddesinden ve coğrafi konumundan yararlanmak</li>
<li>Süveyş Kanalı’nı ve Hindistan yolunu tehdit etmek</li></ul></div></div>
<p class="note">Fiilî giriş: Yavuz ve Midilli’nin <b>29 Ekim 1914</b>’te Rus limanlarını bombalaması.</p>`},
{ id:"cepheler", h:"Osmanlı’nın cepheleri", html:`
<table class="t wide"><tr><th>Taarruz</th><th>Savunma</th><th>Yardım</th></tr>
<tr><td>Kafkas<br>Kanal (Süveyş)</td><td>Çanakkale<br>Irak<br>Suriye-Filistin<br>Hicaz-Yemen</td><td>Galiçya<br>Makedonya<br>Romanya (Dobruca)</td></tr></table>
<p>Osmanlı Devleti dört yıl boyunca üç kıtada, aynı anda yediye kadar cephede savaştı. Yaklaşık
2,8 milyon kişi silah altına alındı; hastalıklar muharebelerden daha çok can aldı.</p>
<p class="note">Çanakkale dışındaki savunma cephelerinin hepsinde toprak kaybedildi. Yardım cepheleri
müttefiklere destek içindi ama kendi cephelerimizi zayıflattı.</p>`},
{ id:"gizli", h:"Gizli antlaşmalar", html:`
<table class="t wide"><tr><th>Antlaşma</th><th class="nw">Tarih</th><th>Osmanlı toprakları için öngörülen</th></tr>
<tr><td>İstanbul (Boğazlar) Antlaşması</td><td class="nw">1915</td><td>İstanbul ve Boğazlar Rusya’ya</td></tr>
<tr><td>Londra Antlaşması</td><td class="nw">1915</td><td>Oniki Ada ve Antalya çevresi İtalya’ya</td></tr>
<tr><td>Sykes-Picot</td><td class="nw">1916</td><td>Irak İngiltere’ye; Suriye, Lübnan, Adana Fransa’ya; Doğu Anadolu Rusya’ya; Filistin uluslararası</td></tr>
<tr><td>St. Jean de Maurienne</td><td class="nw">1917</td><td>İzmir ve çevresi İtalya’ya</td></tr>
<tr><td>McMahon–Hüseyin yazışmaları</td><td class="nw">1915–16</td><td>Araplara bağımsız devlet vaadi</td></tr>
<tr><td>Balfour Deklarasyonu</td><td class="nw">1917</td><td>Filistin’de Yahudi yurdu</td></tr></table>
<p class="note">Bolşevikler iktidara gelince (1917) bu antlaşmaları yayımladı ve Rusya’nın payından
vazgeçti. Gizli paylaşım planları, Mondros sonrası işgallerin ve Sevr’in zeminini oluşturdu.</p>`},
{ id:"donum", h:"Savaşın gidişini değiştirenler", html:`
<div class="cols">
<div><h4>Rusya’nın çekilmesi</h4><p>1917 devrimleri, ağır kayıplar ve açlık Rusya’yı savaş dışına
itti. <b>Brest-Litovsk</b> (3 Mart 1918) ile İttifak Devletleri doğuda rahatladı; Osmanlı Kars,
Ardahan ve Batum’u geri aldı.</p></div>
<div><h4>ABD’nin katılması</h4><p>Alman denizaltılarının ticaret gemilerini batırması ve
<b>Zimmermann telgrafı</b> üzerine ABD Nisan 1917’de savaşa girdi. Taze asker ve ekonomik güç
dengeyi İtilaf Devletleri’nden yana çevirdi.</p></div></div>
<h4>Wilson İlkeleri (8 Ocak 1918)</h4><ul class="inline">
<li>Gizli antlaşmalara son</li><li>Denizlerde serbestlik</li><li>Silahsızlanma</li>
<li>Ulusların kendi kaderini tayini</li><li>Milletler Cemiyeti</li>
<li><b>12. madde:</b> Osmanlı’nın Türk bölgelerine egemenlik, diğer uluslara özerklik, Boğazlar herkese açık</li></ul>`},
{ id:"baris", h:"Ateşkesler ve barış antlaşmaları", html:`
<table class="t wide"><tr><th>Devlet</th><th>Ateşkes</th><th>Barış antlaşması</th></tr>
<tr><td>Bulgaristan</td><td>Selanik · 29 Eylül 1918</td><td>Neuilly · 1919</td></tr>
<tr><td><b>Osmanlı Devleti</b></td><td><b>Mondros · 30 Ekim 1918</b></td><td><b>Sevr · 1920</b> (uygulanmadı)</td></tr>
<tr><td>Avusturya-Macaristan</td><td>Villa Giusti · 3 Kasım 1918</td><td>Saint-Germain (Avusturya) · 1919<br>Trianon (Macaristan) · 1920</td></tr>
<tr><td>Almanya</td><td>Compiègne · 11 Kasım 1918</td><td>Versay · 28 Haziran 1919</td></tr></table>
<h4>Mondros Ateşkesi’nin önemli maddeleri</h4><ul>
<li>Boğazlar açılacak, Boğaz tabyaları İtilaf Devletleri’nce işgal edilecek</li>
<li>Osmanlı ordusu terhis edilecek, savaş gemileri teslim edilecek</li>
<li><b>7. madde:</b> İtilaf Devletleri güvenliklerini tehdit eden bir durumda herhangi bir stratejik noktayı işgal edebilecek</li>
<li><b>24. madde:</b> Altı vilayette (Vilâyât-ı Sitte) karışıklık çıkarsa buralar işgal edilebilecek</li>
<li>Haberleşme ağı ve demiryolları, Toros tünelleri İtilaf denetimine girecek</li>
<li>Hicaz, Yemen, Suriye ve Irak’taki Osmanlı birlikleri teslim olacak</li></ul>`},
{ id:"sonuc", h:"Sonuçlar", html:`
<div class="cols">
<div><h4>Dünya için</h4><ul>
<li>Alman, Avusturya-Macaristan, Rus ve Osmanlı imparatorlukları yıkıldı</li>
<li>Polonya, Çekoslovakya, Finlandiya, Baltık devletleri, SHS Krallığı kuruldu</li>
<li>Milletler Cemiyeti kuruldu; <b>manda</b> sistemi ortaya çıktı</li>
<li>Rusya’da dünyanın ilk sosyalist devleti kuruldu</li>
<li>ABD dünya siyasetinde öne çıktı</li>
<li>Yaklaşık 9–10 milyon asker öldü; milyonlarca sivil hayatını kaybetti</li>
<li>Ağır barış şartları, özellikle Versay, II. Dünya Savaşı’nın zeminini hazırladı</li></ul></div>
<div><h4>Osmanlı Devleti için</h4><ul>
<li>Mondros ile ordu terhis edildi, ülke savunmasız kaldı</li>
<li>İtilaf Devletleri Anadolu’yu işgale başladı</li>
<li>Arap toprakları kaybedildi</li>
<li>İttihat ve Terakki liderleri yurt dışına kaçtı</li>
<li>İşgallere karşı <b>Kuvâ-yı Millîye</b> ve <b>Millî Mücadele</b> başladı</li>
<li>Sevr kâğıt üzerinde kaldı; Lozan (1923) ile yeni Türkiye tanındı</li></ul></div></div>
<h4>Savaşın niteliği</h4><p>Cephe ile cephe gerisinin ayrılmadığı ilk <b>topyekûn savaş</b>tı: kadınlar
fabrikalarda çalıştı, sivil halk bombalandı, ekonomi savaşa göre düzenlendi. <b>Tank, uçak,
denizaltı ve zehirli gaz</b> ilk kez yaygın biçimde kullanıldı.</p>`},
{ id:"kavram", h:"Kavramlar", html:`
<dl class="gl">
<dt>İttifak Devletleri</dt><dd>Almanya, Avusturya-Macaristan, Osmanlı ve Bulgaristan</dd>
<dt>İtilaf Devletleri</dt><dd>İngiltere, Fransa, Rusya ve müttefikleri</dd>
<dt>Silahlı barış</dt><dd>Savaş öncesinde devletlerin hem barışı korumaya hem de hızla silahlanmaya çalıştığı dönem</dd>
<dt>Siper savaşı</dt><dd>Karşılıklı kazılmış hendeklerde, cephe hattının aylarca değişmediği savaş biçimi</dd>
<dt>Cephe</dt><dd>Karşı orduların çarpıştığı bölge ya da hat</dd>
<dt>Ateşkes (mütareke)</dt><dd>Barış imzalanana kadar çatışmaların durdurulması</dd>
<dt>Manda</dt><dd>Kendini yönetemeyeceği ileri sürülen bir ülkenin, Milletler Cemiyeti adına büyük bir devletin yönetimine bırakılması</dd>
<dt>Self-determinasyon</dt><dd>Ulusların kendi kaderini kendilerinin belirlemesi hakkı</dd>
<dt>Kapitülasyon</dt><dd>Yabancılara tanınan ekonomik ve hukuki ayrıcalıklar</dd>
<dt>Cihad-ı ekber</dt><dd>Padişahın halife sıfatıyla bütün Müslümanları savaşa çağırması (14 Kasım 1914)</dd>
<dt>Panslavizm</dt><dd>Bütün Slavları Rusya önderliğinde birleştirme düşüncesi</dd>
<dt>Pangermenizm</dt><dd>Bütün Almanları tek devlet altında toplama düşüncesi</dd>
<dt>Topyekûn savaş</dt><dd>Bir ülkenin bütün insan, ekonomi ve üretim gücünü savaşa yönelttiği savaş</dd>
</dl>`},
{ id:"soru", h:"Tartışma soruları", html:`
<ol class="q">
<li>Almanya’nın Osmanlı Devleti’ni kendi yanında savaşa sokmak istemesinin Boğazlarla ilgisi nedir?</li>
<li>Çanakkale’de kazanılan zafer Rusya’daki devrimi nasıl etkilemiş olabilir?</li>
<li>Osmanlı Devleti taarruz cephelerini hangi amaçlarla açtı? Bu amaçlar gerçekçi miydi?</li>
<li>Wilson İlkeleri ile gizli antlaşmalar arasında nasıl bir çelişki vardır?</li>
<li>Mondros’un 7. maddesi neden “sınırsız bir işgal yetkisi” olarak yorumlanır?</li>
<li>Sevr neden uygulanamadı? Lozan ile karşılaştırın.</li>
<li>Savaşın sonunda kurulan Milletler Cemiyeti barışı neden koruyamadı?</li>
</ol>`}
];

/* ------------------------------------------------------------------ sınıf soruları
   k:"map" — haritada doğru yere dokunma. a: {u:[atom]} · {s:[devlet]} · {c:[[boylam,enlem,km],…]}
   k:"mc"  — çoktan seçmeli. o: seçenekler, a: doğru seçeneğin sırası
   st: soruda açılacak aşama   x: açıklama                                           */
D.Q = [
{k:"map", st:0, q:"Üçlü İtilaf’ın üyelerinden birine dokunun.", a:{u:["gbr","irl","fra","rus","ukr","blr","cpol","fin","est","lva","ltu","viln","wblr","vol","bes","geo","arm","aze","kars","batum"]},
 x:"Üçlü İtilaf: İngiltere, Fransa ve Rusya (1907)."},
{k:"map", st:0, q:"Fransa’nın 1871’de Almanya’ya kaptırdığı bölgeyi gösterin.", a:{u:["als"]},
 x:"Alsas-Loren. Fransa’nın bu toprakları geri alma isteği savaşın nedenlerinden biridir."},
{k:"map", st:1, q:"Savaşı başlatan suikastın yapıldığı şehri gösterin.", a:{c:[[18.41,43.86,170]]},
 x:"Saraybosna, 28 Haziran 1914. Franz Ferdinand, Gavrilo Princip tarafından öldürüldü."},
{k:"map", st:1, q:"Almanya’nın Fransa’ya ulaşmak için işgal ettiği tarafsız ülkeyi gösterin.", a:{u:["bel"]},
 x:"Belçika. Tarafsızlığının çiğnenmesi İngiltere’nin savaşa girmesine yol açtı."},
{k:"map", st:2, q:"Osmanlı donanmasının 29 Ekim 1914’te bombaladığı limanlardan birini gösterin.",
 a:{c:[[30.73,46.48,150],[33.52,44.62,150],[37.77,44.72,150],[35.38,45.03,120]]},
 x:"Odesa, Sivastopol, Novorossiysk ve Feodosiya. Bu baskınla Osmanlı fiilen savaşa girdi."},
{k:"map", st:2, q:"Sarıkamış Harekâtı’nın yapıldığı cepheyi gösterin.", a:{c:[[42.3,40.2,330]]},
 x:"Kafkas Cephesi. Kış şartları yüzünden on binlerce asker şehit oldu."},
{k:"map", st:3, q:"Çanakkale Boğazı’nı gösterin.", a:{c:[[26.4,40.2,110]]},
 x:"İtilaf donanması 18 Mart 1915’te boğazı geçemedi; kara savaşları Ocak 1916’ya kadar sürdü."},
{k:"map", st:3, q:"1915’te İttifak Devletleri’ne katılan Balkan devletini gösterin.", a:{u:["bgr","wthr","strm"]},
 x:"Bulgaristan (Ekim 1915). Osmanlı ile Almanya arasında kara bağlantısı kuruldu."},
{k:"map", st:3, q:"Üçlü İttifak üyesiyken 1915’te İtilaf’a geçen devleti gösterin.", a:{u:["ita"]},
 x:"İtalya. Londra Antlaşması’yla kendisine toprak vaat edilince taraf değiştirdi."},
{k:"map", st:3, q:"Kanal Harekâtı’nın hedefi olan su yolunu gösterin.", a:{c:[[32.35,30.6,170]]},
 x:"Süveyş Kanalı: İngiltere’nin Hindistan yolu."},
{k:"map", st:4, q:"Kut’ül-Amare zaferinin kazanıldığı cepheyi gösterin.", a:{u:["bsr","bgd","msl"]},
 x:"Irak Cephesi, 29 Nisan 1916."},
{k:"map", st:4, q:"Osmanlı’nın yardım cephelerinden birini gösterin.", a:{c:[[24.8,49.4,260],[22.0,41.2,200],[28.0,44.3,220]]},
 x:"Galiçya, Makedonya ve Romanya (Dobruca) yardım cepheleridir."},
{k:"map", st:4, q:"Şerif Hüseyin’in isyanının başladığı bölgeyi gösterin.", a:{u:["hjz"]},
 x:"Hicaz, Haziran 1916. Medine’yi Fahrettin Paşa Ocak 1919’a kadar savundu."},
{k:"map", st:6, q:"Brest-Litovsk ile Osmanlı’ya geri bırakılan bölgeyi gösterin.", a:{u:["kars","batum"]},
 x:"Kars, Ardahan ve Batum — Elviye-i Selâse."},
{k:"map", st:7, q:"Mondros Ateşkesi’nin imzalandığı adayı gösterin.", a:{c:[[25.27,39.87,90]]},
 x:"Limni adası, Mondros limanı, 30 Ekim 1918."},
{k:"map", st:8, q:"15 Mayıs 1919’da Yunanistan’ın işgal ettiği şehri gösterin.", a:{c:[[27.14,38.42,120]]},
 x:"İzmir. İşgal, Millî Mücadele’nin başlamasını hızlandırdı."},
{k:"map", st:9, q:"Savaştan sonra kurulan yeni devletlerden birini gösterin.", a:{s:["POL","CZS","FIN","EST","LVA","LTU"]},
 x:"Polonya, Çekoslovakya, Finlandiya, Estonya, Letonya, Litvanya… Avusturya ve Macaristan da ayrı devletler oldu."},
{k:"mc", q:"Hangisi Osmanlı’nın taarruz cephelerinden biridir?", o:["Çanakkale","Kafkas","Irak","Galiçya"], a:1,
 x:"Taarruz cepheleri: Kafkas ve Kanal."},
{k:"mc", q:"Hangisi Çanakkale Savaşı’nın sonuçlarından biri değildir?", o:["Rusya’ya yardım ulaştırılamadı","Bulgaristan İttifak’a katıldı","Savaş kısaldı","Mustafa Kemal tanındı"], a:2,
 x:"Çanakkale savaşı kısaltmadı, tersine uzattı."},
{k:"mc", q:"ABD’nin savaşa girmesinde hangisi etkili oldu?", o:["Zimmermann telgrafı ve denizaltı savaşı","Saraybosna suikastı","Brest-Litovsk","Balfour Deklarasyonu"], a:0,
 x:"Almanya’nın sınırsız denizaltı savaşı ve Meksika’yı kışkırtan telgraf."},
{k:"mc", q:"Rusya’nın savaştan çekildiği antlaşma hangisidir?", o:["Versay","Brest-Litovsk","Mondros","Neuilly"], a:1,
 x:"3 Mart 1918. Kars, Ardahan ve Batum Osmanlı’ya bırakıldı."},
{k:"mc", q:"Mondros’un hangi maddesi İtilaf’a istediği stratejik noktayı işgal hakkı veriyordu?", o:["5. madde","7. madde","16. madde","24. madde"], a:1,
 x:"7. madde. 24. madde ise altı doğu vilayetiyle ilgilidir."},
{k:"mc", q:"Hangisi savaş sonunda yıkılan imparatorluklardan değildir?", o:["Alman","Rus","İngiliz","Avusturya-Macaristan"], a:2,
 x:"Yıkılanlar: Alman, Avusturya-Macaristan, Rus ve Osmanlı."},
{k:"mc", q:"İzmir’in İtalya’ya bırakılmasını öngören gizli antlaşma hangisidir?", o:["Londra","Sykes-Picot","St. Jean de Maurienne","İstanbul"], a:2,
 x:"St. Jean de Maurienne (1917). Londra Antlaşması ise Antalya’yı vaat etmişti."},
{k:"mc", q:"Bulgaristan’ın İttifak’a katılmasının Osmanlı’ya en önemli etkisi neydi?", o:["Almanya ile kara bağlantısı kuruldu","Çanakkale kazanıldı","Kafkasya geri alındı","Kapitülasyonlar kaldırıldı"], a:0,
 x:"Sırbistan’ın işgaliyle Berlin–İstanbul demiryolu açıldı."},
{k:"mc", q:"Osmanlı Devleti’nin savaşa fiilen girmesine yol açan olay hangisidir?", o:["Karadeniz baskını","Sarıkamış Harekâtı","Kut’ül-Amare","I. Kanal Harekâtı"], a:0,
 x:"Yavuz ve Midilli’nin 29 Ekim 1914’te Rus limanlarını bombalaması."},
{k:"mc", q:"Sevr Antlaşması için hangisi doğrudur?", o:["Uygulandı ve 1923’e kadar yürürlükte kaldı","Hiç yürürlüğe girmedi","Almanya ile imzalandı","Lozan’dan sonra imzalandı"], a:1,
 x:"Sevr (1920) onaylanmadı ve uygulanamadı; yerini Lozan (1923) aldı."},
{k:"mc", q:"Wilson İlkeleri’nin temel düşüncesi hangisidir?", o:["Gizli diplomasi","Ulusların kendi kaderini tayini","Sömürgeciliğin sürmesi","Silahlanma"], a:1,
 x:"Self-determinasyon ve açık diplomasi."}
];
