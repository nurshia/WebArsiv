/* I. Dünya Savaşı — devletler, 1914 sahiplik tablosu ve aşamalar.
   Koordinatlar [boylam, enlem]. Taraf kodları:
   C  İttifak Devletleri      E  İtilaf Devletleri      N  tarafsız
   X  savaştan çekilen        L  yenilen (savaş sonu)   W  galip (savaş sonu)
   Y  yeni kurulan devlet     M  manda yönetimi                                  */
"use strict";
var D = window.D = {};

/* ------------------------------------------------------------------ devletler */
D.S = {
  DEU:{n:"Almanya", f:"Alman İmparatorluğu", cap:"Berlin"},
  AUH:{n:"Avusturya-Macaristan", f:"Avusturya-Macaristan İmparatorluğu", cap:"Viyana"},
  OSM:{n:"Osmanlı Devleti", f:"Osmanlı Devleti", cap:"İstanbul"},
  BGR:{n:"Bulgaristan", f:"Bulgaristan Çarlığı", cap:"Sofya"},
  GBR:{n:"İngiltere", f:"Birleşik Krallık (Büyük Britanya)", cap:"Londra"},
  FRA:{n:"Fransa", f:"Fransa Cumhuriyeti", cap:"Paris"},
  RUS:{n:"Rusya", f:"Rus Çarlığı", cap:"Petrograd"},
  SOV:{n:"Sovyet Rusya", f:"Sovyet Rusya (1922’den sonra SSCB)", cap:"Moskova"},
  ITA:{n:"İtalya", f:"İtalya Krallığı", cap:"Roma"},
  SRB:{n:"Sırbistan", f:"Sırbistan Krallığı", cap:"Belgrad"},
  MNE:{n:"Karadağ", f:"Karadağ Krallığı", cap:"Çetine"},
  BEL:{n:"Belçika", f:"Belçika Krallığı", cap:"Brüksel"},
  ROU:{n:"Romanya", f:"Romanya Krallığı", cap:"Bükreş"},
  GRC:{n:"Yunanistan", f:"Yunanistan Krallığı", cap:"Atina"},
  PRT:{n:"Portekiz", f:"Portekiz Cumhuriyeti", cap:"Lizbon"},
  ALB:{n:"Arnavutluk", f:"Arnavutluk Prensliği", cap:"Tiran"},
  NLD:{n:"Hollanda"}, LUX:{n:"Lüksemburg"}, CHE:{n:"İsviçre"}, ESP:{n:"İspanya"},
  DNK:{n:"Danimarka"}, NOR:{n:"Norveç"}, SWE:{n:"İsveç"}, IRN:{n:"İran"},
  AFG:{n:"Afganistan"}, ETH:{n:"Habeşistan"}, OMN:{n:"Umman"}, OTH:{n:"—"},
  NEJ:{n:"Necid", f:"Necid Emirliği (Suudîler)"},
  SHM:{n:"Cebel-i Şammar", f:"Cebel-i Şammar Emirliği (Reşidîler)"},
  HJZ:{n:"Hicaz", f:"Hicaz Krallığı (Şerif Hüseyin)"},
  YEM:{n:"Yemen", f:"Yemen İmamlığı"},
  /* savaş sonrası */
  AUT:{n:"Avusturya", f:"Avusturya Cumhuriyeti", cap:"Viyana"},
  HUN:{n:"Macaristan", f:"Macaristan Krallığı", cap:"Budapeşte"},
  CZS:{n:"Çekoslovakya", f:"Çekoslovakya Cumhuriyeti", cap:"Prag"},
  POL:{n:"Polonya", f:"Polonya Cumhuriyeti", cap:"Varşova"},
  SCS:{n:"Sırp-Hırvat-Sloven Krallığı", f:"Sırp-Hırvat-Sloven Krallığı (1929’dan sonra Yugoslavya)", cap:"Belgrad"},
  FIN:{n:"Finlandiya"}, EST:{n:"Estonya"}, LVA:{n:"Letonya"}, LTU:{n:"Litvanya"},
  UKR:{n:"Ukrayna"}, GEO:{n:"Gürcistan"}, ARM:{n:"Ermenistan"}, AZE:{n:"Azerbaycan"},
  TUR:{n:"Türkiye", f:"Türkiye (1920–1923 Ankara Hükûmeti, 29 Ekim 1923’ten sonra Türkiye Cumhuriyeti)", cap:"Ankara"},
  DNZ:{n:"Danzig", f:"Danzig Serbest Şehri (Milletler Cemiyeti koruması)"},
  SAAR:{n:"Saar", f:"Saar Havzası (Milletler Cemiyeti yönetimi, 1920–1935)"},
  IRL:{n:"İrlanda", f:"İrlanda Serbest Devleti (1922)"},
  EGY:{n:"Mısır", f:"Mısır Krallığı (1922, İngiliz etkisinde)"},
  FRM:{n:"Fransız mandası", f:"Fransız manda yönetimi"},
  GBM:{n:"İngiliz mandası", f:"İngiliz manda yönetimi"},
  MEM:{n:"Memel", f:"Memel Bölgesi (İtilaf yönetimi, 1923’te Litvanya)"},
  OCC:{n:"Alman denetiminde", f:"Brest-Litovsk ile Rusya’dan ayrılan, Alman denetimindeki topraklar (Polonya, Baltık, Belarus, Ukrayna)"}
};

/* dolgu rengi rolleri: "TARAF-DEVLET" tanımlıysa o, değilse "TARAF" (CSS: --f-XXX) */
D.FILL = ["C-DEU","C-AUH","C-OSM","C-BGR","C-ITA","C-OCC","C","T",
          "E-GBR","E-FRA","E-RUS","E-ITA","E-SRB","E-MNE","E-BEL","E-ROU","E-GRC","E-PRT","E-HJZ","E",
          "N-OSM","N","X",
          "L-DEU","L-AUT","L-HUN","L-BGR","L-OSM","L-TUR","L",
          "W-GBR","W-FRA","W-ITA","W-SCS","W-ROU","W-GRC","W-BEL","W",
          "Y-POL","Y-CZS","Y-FIN","Y-EST","Y-LVA","Y-LTU","Y-GEO","Y-ARM","Y-AZE","Y-HJZ","Y",
          "M-FRM","M-GBM","X-SOV"];

/* ------------------------------------------------------------------ Haziran 1914 sahiplik */
D.OWN0 = {
  deu:"DEU", saar:"DEU", als:"DEU", corr:"DEU", danz:"DEU", usil:"DEU", memel:"DEU", nsch:"DEU",
  aut:"AUH", cze:"AUH", svk:"AUH", hun:"AUH", trs:"AUH", buk:"AUH", gal:"AUH", zak:"AUH",
  svn:"AUH", jul:"AUH", trn:"AUH", hrv:"AUH", bih:"AUH", vjv:"AUH", boka:"AUH",
  rus:"RUS", fin:"RUS", est:"RUS", lva:"RUS", ltu:"RUS", viln:"RUS", cpol:"RUS", wblr:"RUS",
  blr:"RUS", vol:"RUS", ukr:"RUS", bes:"RUS", kars:"RUS", batum:"RUS", geo:"RUS", arm:"RUS", aze:"RUS",
  tur:"OSM", syr:"OSM", lbn:"OSM", pal:"OSM", jor:"OSM", bsr:"OSM", bgd:"OSM", msl:"OSM",
  hjz:"OSM", asr:"OSM", yem:"OSM", qat:"OSM",
  gbr:"GBR", irl:"GBR", egy:"GBR", sdn:"GBR", cyp:"GBR", mlt:"GBR", aden:"GBR", soml:"GBR",
  kwt:"GBR", bhr:"GBR", are:"GBR",
  fra:"FRA", dza:"FRA", tun:"FRA", mar:"FRA", frwa:"FRA", dji:"FRA",
  ita:"ITA", lby:"ITA", eri:"ITA", soms:"ITA", dod:"ITA",
  esp:"ESP", smar:"ESP", prt:"PRT", bel:"BEL", nld:"NLD", lux:"LUX", che:"CHE",
  dnk:"DNK", nor:"NOR", swe:"SWE",
  srb:"SRB", mne:"MNE", alb:"ALB", grc:"GRC", bgr:"BGR", wthr:"BGR", strm:"BGR",
  rou:"ROU", sdob:"ROU",
  irn:"IRN", afg:"AFG", nej:"NEJ", shm:"SHM", omn:"OMN", eth:"ETH", oth:"OTH"
};

/* ------------------------------------------------------------------ aşamalar */
var WAR = {DEU:"C", AUH:"C", GBR:"E", FRA:"E", RUS:"E", SRB:"E", MNE:"E", BEL:"E"};
function sides(extra){ var o = {}, k; for (k in WAR) o[k] = WAR[k]; for (k in extra) o[k] = extra[k]; return o; }

D.ST = [
/* ---------------------------------------------------------------- 0 */
{ id:"s0", yr:"1914 öncesi", nm:"İki blok",
  date:"1871 – Haziran 1914",
  t:"Silahlı barış: Avrupa iki kampa bölünüyor",
  view:[-9, 34, 48, 61],
  side:{DEU:"C", AUH:"C", ITA:"C", GBR:"E", FRA:"E", RUS:"E", OSM:"N-OSM"},
  own:{},
  zones:[], lines:["rail_bb","rail_hjz"], arrows:[],
  ev:["alsas","bosna","balkan","bagdat","denizyarisi","fas"],
  lede:`Yirminci yüzyılın başında Avrupa’nın büyük devletleri iki bloğa ayrılmıştı. Hepsi
        silahlanıyor, hepsi bir savaşın kısa süreceğine inanıyordu.`,
  body:[
   `<b>Üçlü İttifak</b> (1882): Almanya, Avusturya-Macaristan ve İtalya. <b>Üçlü İtilaf</b>
    (1907): İngiltere, Fransa ve Rusya. İki blok arasındaki anlaşmazlıklar tek bir yerde
    değil, dünyanın dört bir yanındaydı.`,
   `Sanayileşen devletler hammadde ve pazar arıyordu. Geç birleşen Almanya (1871) sömürge
    yarışında pay istiyor, İngiltere’nin deniz üstünlüğüne meydan okuyordu. Fransa 1871’de
    kaybettiği <b>Alsas-Loren</b>’i geri almak istiyordu.`,
   `Balkanlar ise Avrupa’nın “barut fıçısı”ydı: Rusya’nın desteklediği <b>Panslavizm</b>
    ile Almanya ve Avusturya-Macaristan’ın <b>Pangermenizm</b>’i burada çatışıyordu.
    Avusturya-Macaristan’ın 1908’de Bosna-Hersek’i ilhakı Sırbistan’ı öfkelendirmişti.`],
  facts:[["Üçlü İttifak","Almanya · Avusturya-Macaristan · İtalya (1882)"],
         ["Üçlü İtilaf","İngiltere · Fransa · Rusya (1907)"],
         ["Silahlanma","Dreadnought yarışı, zorunlu askerlik, seferberlik planları"],
         ["Bu döneme verilen ad","Silahlı Barış Dönemi"]],
  osm:`Osmanlı Devleti bloklardan birine katılamamıştı. Trablusgarp (1911–12) ve Balkan
       Savaşları (1912–13) ile toprak kaybetmiş, yalnız kalmıştı. Almanya ile yakınlaşma ise
       sürüyordu: <b>Bağdat Demiryolu</b> Alman sermayesiyle yapılıyordu.`
},
/* ---------------------------------------------------------------- 1 */
{ id:"s1", yr:"Haz–Eyl 1914", nm:"Savaş başlıyor",
  date:"28 Haziran – Eylül 1914",
  t:"Saraybosna’dan Marne’a: kısa sürmeyecek bir savaş",
  view:[-4, 40, 32, 57],
  side:sides({ITA:"N", OSM:"N-OSM"}),
  own:{},
  zones:[["W14","C"],["E14R","E"]],
  lines:["wf14"], arrows:["a_sch1","a_sch2","a_plan17","a_rus_pr1","a_rus_pr2","a_aut_srb","a_rus_gal"],
  ev:["saraybosna","belgrad14","liege","marne","tannenberg","lemberg","cer"],
  lede:`28 Haziran 1914’te Avusturya-Macaristan veliahdı <b>Franz Ferdinand</b> Saraybosna’da
        öldürüldü. Bir ay içinde ittifaklar zincirleme işledi ve Avrupa savaşa girdi.`,
  body:[
   `Avusturya-Macaristan <b>28 Temmuz</b>’da Sırbistan’a savaş açtı. Rusya Sırbistan için
    seferberlik ilan edince Almanya <b>1 Ağustos</b>’ta Rusya’ya, <b>3 Ağustos</b>’ta
    Fransa’ya savaş ilan etti.`,
   `Almanya’nın <b>Schlieffen Planı</b> Fransa’yı altı haftada yenmeyi, sonra Rusya’ya
    dönmeyi öngörüyordu. Ordular tarafsız Belçika’dan geçince İngiltere de <b>4 Ağustos</b>’ta
    savaşa girdi.`,
   `Alman ilerleyişi Paris önlerinde, <b>Marne</b>’da durduruldu. Doğuda Almanlar
    Tannenberg’de Rus ordusunu yendi, Ruslar ise Galiçya’da Avusturya’yı geri püskürttü.
    “Noel’e kadar biter” denen savaş cephelerde kilitlendi.`],
  facts:[["Kıvılcım","Saraybosna suikastı · 28 Haziran 1914"],
         ["Suikastçı","Gavrilo Princip (Sırp milliyetçisi)"],
         ["İtalya","Tarafsızlığını ilan etti (2 Ağustos)"],
         ["Plan","Schlieffen: önce Fransa, sonra Rusya"]],
  osm:`Osmanlı Devleti 2 Ağustos 1914’te Almanya ile <b>gizli bir ittifak</b> imzaladı ama
       “silahlı tarafsızlık” ilan edip seferberliğe başladı. Ordunun hazırlanması için zaman
       kazanılmak isteniyordu.`
},
/* ---------------------------------------------------------------- 2 */
{ id:"s2", yr:"Ağu–Ara 1914", nm:"Osmanlı savaşta",
  date:"Ağustos – Aralık 1914",
  t:"Osmanlı Devleti İttifak Devletleri’nin yanında savaşa giriyor",
  view:[14, 27, 54, 50],
  side:sides({ITA:"N", OSM:"C-OSM"}),
  own:{},
  zones:[["W14","C"],["E14C","C"],["E14R","E"],["IRQ14","E"]],
  lines:["wf14","ef14","cf14"], arrows:["a_goben","a_kd1","a_kd2","a_kd3","a_fav","a_sar1","a_sar2"],
  ev:["ittifak","goben","karadeniz","fav","sarikamis","kibris","misir","ypres14"],
  lede:`İngiliz ve Fransız donanmasından kaçan iki Alman gemisi, <b>Goeben</b> ve
        <b>Breslau</b>, Çanakkale’ye sığındı. Birkaç ay sonra bu gemiler Osmanlı’yı savaşın
        içine çekecekti.`,
  body:[
   `Gemiler göstermelik olarak satın alındı ve <b>Yavuz</b> ile <b>Midilli</b> adını aldı;
    Alman mürettebatı gemilerde kaldı. İngiltere’nin parası ödenmiş iki Osmanlı zırhlısına el
    koyması, kamuoyunda Almanya’ya duyulan yakınlığı artırdı.`,
   `<b>29 Ekim 1914</b>’te Amiral Souchon komutasındaki Osmanlı donanması Karadeniz’de
    Rus limanlarını bombaladı. Rusya, İngiltere ve Fransa savaş ilan etti; Osmanlı
    Devleti <b>11 Kasım</b>’da resmen savaşa girdi, <b>14 Kasım</b>’da cihad ilan edildi.`,
   `İngilizler hemen Basra Körfezi’ne asker çıkardı. Enver Paşa ise kışın ortasında
    Kafkasya’da büyük bir kuşatma harekâtına girişti: <b>Sarıkamış</b>.`],
  facts:[["Gizli ittifak","2 Ağustos 1914 · İstanbul"],
         ["Yavuz ve Midilli","10 Ağustos’ta Çanakkale’ye girdi"],
         ["Karadeniz baskını","29 Ekim 1914"],
         ["Kapitülasyonlar","9 Eylül’de tek taraflı kaldırıldı (1 Ekim’den geçerli)"]],
  osm:`<b>Osmanlı neden savaşa girdi?</b> Yalnızlıktan kurtulmak, kaybedilen toprakları geri
       almak, kapitülasyonlardan kurtulmak ve Almanya’nın kazanacağına inanılması. Almanya
       ise Boğazların kapanmasıyla Rusya’nın yardım almasını engellemek, yeni cepheler
       açtırmak ve halifeliğin etkisinden yararlanmak istiyordu.`
},
/* ---------------------------------------------------------------- 3 */
{ id:"s3", yr:"1915", nm:"Çanakkale",
  date:"1915",
  t:"Çanakkale geçilmiyor, İtalya ve Bulgaristan savaşa katılıyor",
  view:[12, 28, 50, 55],
  side:sides({ITA:"E-ITA", OSM:"C-OSM", BGR:"C-BGR"}),
  own:{},
  zones:[["W14","C"],["E15","C"],["SRB15","C"],["SAL","E"],["IRQ15","E"],["SIN15","C"],["ADEN15","C"]],
  lines:["wf14","ef15","if15","cf14"],
  arrows:["a_kanal1","a_dard","a_gorlice","a_retreat","a_mack","a_bgr15","a_srbret","a_ctes"],
  ev:["kanal1","m18","canakkale","gorlice","varsova","italya15","isonzo","bulgar15","sirbistan15",
      "selanik15","selmanpak","lahic","lusitania","ypres15"],
  lede:`İtilaf Devletleri Rusya’ya yardım ulaştırmak ve İstanbul’u alıp Osmanlı’yı savaş dışı
        bırakmak için Çanakkale’ye yüklendi. Önce donanma, sonra ordu geçmeyi denedi.`,
  body:[
   `<b>18 Mart 1915</b>’te İtilaf donanması boğazı zorladı. Nusret mayın gemisinin döktüğü
    mayınlar ve kıyı topçusu üç zırhlıyı batırdı, üçünü savaş dışı bıraktı. Deniz yolu
    kapandı.`,
   `<b>25 Nisan</b>’da Gelibolu Yarımadası’na kara çıkarması yapıldı. Aylar süren siper
    savaşlarında, özellikle <b>Anafartalar</b> ve <b>Conkbayırı</b>’nda Mustafa Kemal’in
    yönettiği birlikler ilerleyişi durdurdu. İtilaf kuvvetleri Ocak 1916’da çekildi.`,
   `Aynı yıl İtalya taraf değiştirip İtilaf’a katıldı (Mayıs), Bulgaristan İttifak
    Devletleri’nin yanında savaşa girdi (Ekim). Sırbistan işgal edildi ve Berlin ile
    İstanbul arasında kara bağlantısı kuruldu. Doğuda Almanlar Rus ordusunu Polonya’dan
    çıkardı.`],
  facts:[["18 Mart","Deniz zaferi — 3 zırhlı battı"],
         ["25 Nisan","Arıburnu ve Seddülbahir çıkarmaları"],
         ["Kayıp","İki tarafta da 250.000’i aşkın (ölü, yaralı, hasta)"],
         ["Taraf değiştiren","İtalya (Londra Antlaşması, 26 Nisan)"]],
  osm:`Çanakkale zaferiyle İstanbul kurtuldu, Rusya’ya yardım yolu kapalı kaldı; bu durum
       Rusya’da 1917 Devrimi’ne giden süreci hızlandırdı. Bulgaristan zaferden etkilenerek
       İttifak’a katıldı, savaş uzadı. Mustafa Kemal bu cephede tanındı.`
},
/* ---------------------------------------------------------------- 4 */
{ id:"s4", yr:"1916", nm:"Yıpratma",
  date:"1916",
  t:"Verdun, Somme, Kut: bütün cephelerde yıpratma savaşı",
  view:[0, 18, 52, 56],
  side:sides({ITA:"E-ITA", OSM:"C-OSM", BGR:"C-BGR", ROU:"E-ROU", PRT:"E-PRT", HJZ:"E-HJZ"}),
  own:{hjz:"HJZ", qat:"GBR"},
  zones:[["W14","C"],["E16","C"],["SRB16","C"],["ALBS","E"],["SAL","E"],["KAV","C"],
         ["ROU16","C"],["CAU16","E"],["IRQ16","E"],["HJZ16","E"],["ADEN15","C"]],
  lines:["wf14","ef16","if15","sf16","cf16"],
  arrows:["a_verdun","a_somme","a_brus1","a_brus2","a_rou_in","a_rou_c1","a_rou_c2","a_erz16",
          "a_trb16","a_mk16","a_kanal2","a_arap16","a_sinai16"],
  ev:["verdun","somme","jutland","brusilov","kut","erzurum16","trabzon16","musbitlis","arap",
      "medine","kanal2","romanya16","galicya16","sykes"],
  lede:`1916 büyük taarruzların ve korkunç kayıpların yılıydı. Cepheler neredeyse hiç
        kıpırdamadı; savaş bir “yıpratma” savaşına dönüştü.`,
  body:[
   `Batıda <b>Verdun</b> (Şubat–Aralık) ve <b>Somme</b> (Temmuz–Kasım) muharebelerinde bir
    milyonu aşkın asker öldü ya da yaralandı. Somme’da tank ilk kez kullanıldı. Doğuda Rus
    <b>Brusilov</b> taarruzu Avusturya-Macaristan’ı sarstı; Ağustos’ta savaşa giren Romanya
    ise birkaç ayda yenildi.`,
   `Osmanlı Devleti Irak’ta <b>Kut’ül-Amare</b>’de büyük bir zafer kazandı (29 Nisan). Doğuda
    Ruslar Erzurum, Trabzon ve Erzincan’ı aldı. Hicaz’da <b>Şerif Hüseyin</b> İngilizlerin
    desteğiyle isyan etti.`,
   `Osmanlı, müttefiklerine yardım için Galiçya, Makedonya ve Romanya cephelerine asker
    gönderdi. İtilaf Devletleri ise gizlice Osmanlı topraklarının paylaşımını planlıyordu:
    <b>Sykes-Picot</b> (Mayıs 1916).`],
  facts:[["Verdun","21 Şubat – 18 Aralık 1916"],
         ["Somme","İlk gün 57.000’i aşkın İngiliz kaybı"],
         ["Kut’ül-Amare","29 Nisan 1916 · yaklaşık 13.000 esir"],
         ["Jutland","Tek büyük deniz muharebesi (31 Mayıs)"]],
  osm:`Kut zaferi İngiltere’nin Doğu’daki prestijini sarstı. Buna karşılık Kafkas cephesinde
       Doğu Anadolu’nun bir bölümü Rus işgaline girdi. Mustafa Kemal Ağustos’ta Muş ve
       Bitlis’i geri aldı.`
},
/* ---------------------------------------------------------------- 5 */
{ id:"s5", yr:"1917", nm:"Rusya çekiliyor",
  date:"1917",
  t:"ABD savaşa giriyor, Rusya devrimle savaştan çekiliyor",
  view:[0, 26, 52, 58],
  side:sides({ITA:"E-ITA", OSM:"C-OSM", BGR:"C-BGR", ROU:"E-ROU", PRT:"E-PRT", HJZ:"E-HJZ", GRC:"E-GRC"}),
  own:{},
  zones:[["W14","C"],["E17","C"],["SRB16","C"],["ALBS","E"],["KAV","C"],["ROU16","C"],
         ["ITA17","C"],["CAU16","E"],["IRQ17","E"],["PAL17","E"],["HJZ17","E"],["ADEN15","C"]],
  lines:["wf14","ef17","if17","sf16","cf16","pf17"],
  arrows:["a_bagdat","a_filistin","a_akabe","a_caporetto","a_riga","a_abd"],
  ev:["abd","devrim","bagdat17","gazze","kudus","akabe","caporetto","balfour","erzincan17",
      "yunan17","stjean","passchendaele"],
  lede:`1917 savaşın dengesini değiştirdi: Denizaltı savaşına kızan <b>ABD</b> Nisan’da savaşa
        girdi, <b>Rusya</b> ise iki devrim yaşayıp savaştan çekildi.`,
  body:[
   `Rusya’da Şubat (Mart) Devrimi’yle Çar II. Nikola tahttan indirildi. Ekim (Kasım)
    Devrimi’yle iktidara gelen <b>Bolşevikler</b> barış istedi, çarlık dönemi gizli
    antlaşmalarını açıkladı. Aralık’ta cephelerde ateşkes imzalandı.`,
   `Orta Doğu’da İngilizler <b>Bağdat</b>’ı (11 Mart) ve <b>Kudüs</b>’ü (9 Aralık) aldı.
    Gazze’deki iki Osmanlı zaferi ilerleyişi yalnızca geciktirebildi. İtalya cephesinde ise
    İttifak kuvvetleri <b>Kobarid</b> (Caporetto)’de büyük bir zafer kazandı.`,
   `Yunanistan Haziran’da İtilaf Devletleri’nin yanında savaşa girdi. İngiltere Kasım’da
    <b>Balfour Deklarasyonu</b> ile Filistin’de bir “Yahudi yurdu” kurulmasını desteklediğini
    açıkladı.`],
  facts:[["ABD savaşa giriyor","6 Nisan 1917"],
         ["Bolşevik Devrimi","7 Kasım 1917 (eski takvimle 25 Ekim)"],
         ["Erzincan Ateşkesi","18 Aralık 1917 (Osmanlı–Rus)"],
         ["Kudüs","9 Aralık 1917’de kaybedildi"]],
  osm:`Rusya’nın çekilmesi Kafkas cephesindeki baskıyı kaldırdı. Buna karşılık güneyde Irak ve
       Filistin cepheleri çözülmeye başladı; Yıldırım Orduları Grubu kuruldu.`
},
/* ---------------------------------------------------------------- 6 */
{ id:"s6", yr:"Mar–Tem 1918", nm:"Son taarruzlar",
  date:"Mart – Temmuz 1918",
  t:"Brest-Litovsk: doğuda barış, batıda son büyük taarruz",
  view:[-2, 34, 52, 60],
  side:sides({ITA:"E-ITA", OSM:"C-OSM", BGR:"C-BGR", ROU:"X", PRT:"E-PRT", HJZ:"E-HJZ",
              GRC:"E-GRC", RUS:"X", SOV:"X-SOV", OCC:"C-OCC", FIN:"N", GEO:"N", ARM:"N", AZE:"N"}),
  own:{rus:"SOV", fin:"FIN", est:"OCC", lva:"OCC", ltu:"OCC", viln:"OCC", cpol:"OCC",
       wblr:"OCC", blr:"OCC", vol:"OCC", ukr:"OCC", kars:"OSM", batum:"OSM",
       geo:"GEO", arm:"ARM", aze:"AZE", bes:"ROU", sdob:"BGR"},
  zones:[["W18S","C"],["E18","C"],["SRB16","C"],["ALBS","E"],["KAV","C"],["ROU16","C"],
         ["ITA17","C"],["CAU18","C"],["IRQ17","E"],["PAL17","E"],["HJZ17","E"],["ADEN15","C"]],
  lines:["wf18s","if17","sf16","pf17"],
  arrows:["a_michael","a_blucher","a_fausts","a_osm18a","a_osm18b","a_baku"],
  ev:["wilson","brest","bukres18","kars18","baku","bahar","abdasker"],
  lede:`Bolşevik Rusya, <b>3 Mart 1918</b>’de Brest-Litovsk Antlaşması’nı imzalayarak savaştan
        resmen çekildi. Almanya doğudaki askerlerini batıya kaydırıp son bir kez kazanmayı
        denedi.`,
  body:[
   `Antlaşmayla Rusya Polonya’yı, Baltık bölgesini, Finlandiya’yı ve Ukrayna’yı bıraktı;
    buralar Alman denetimine girdi. <b>Kars, Ardahan ve Batum</b> Osmanlı Devleti’ne geri
    verildi.`,
   `Batıda Mart’ta başlayan <b>Alman bahar taarruzu</b> Paris’e 60 kilometre yaklaştı ama
    tükendi. Her ay on binlerce Amerikan askeri Fransa’ya ulaşıyordu; denge İtilaf
    Devletleri’nden yana döndü.`,
   `ABD Başkanı <b>Wilson</b>, Ocak’ta barışın temel ilkelerini açıklamıştı: gizli
    diplomasiye son, ulusların kendi kaderini tayini, Milletler Cemiyeti.`],
  facts:[["Brest-Litovsk","3 Mart 1918"],
         ["Wilson İlkeleri","8 Ocak 1918 · 14 madde"],
         ["Batum Antlaşması","4 Haziran 1918"],
         ["Bakü","15 Eylül 1918’de Kafkas İslam Ordusu’nca alındı"]],
  osm:`Osmanlı ordusu Erzurum’u (12 Mart), Kars’ı ve Batum’u geri aldı; Nuri Paşa komutasındaki
       <b>Kafkas İslam Ordusu</b> Azerbaycan’a yardıma gitti. Ancak bu ilerleyiş, çöken güney
       cephelerinden asker çekilmesini de engelledi.`
},
/* ---------------------------------------------------------------- 7 */
{ id:"s7", yr:"Eyl–Kas 1918", nm:"Ateşkesler",
  date:"Eylül – 11 Kasım 1918",
  t:"Çöküş: İttifak Devletleri birer birer ateşkes imzalıyor",
  view:[-2, 24, 52, 56],
  side:sides({ITA:"E-ITA", OSM:"C-OSM", BGR:"C-BGR", ROU:"E-ROU", PRT:"E-PRT", HJZ:"E-HJZ",
              GRC:"E-GRC", SOV:"X-SOV", OCC:"C-OCC", FIN:"N", GEO:"N", ARM:"N", AZE:"N"}),
  own:{},
  zones:[["W18","C"],["E18","C"],["CAU18","C"],["IRQ18","E"],["PAL18","E"],["HJZ17","E"],["ADEN15","C"]],
  lines:["wf18"],
  arrows:["a_megiddo","a_dobro","a_vv","a_100g","a_sharqat"],
  ev:["nablus","sam","halep","dobropole","vittorio","mondros","villagiusti","compiegne","kaiser"],
  lede:`Eylül 1918’de Filistin’de ve Makedonya’da cepheler çöktü. Altı hafta içinde
        İttifak Devletleri’nin tamamı ateşkes istedi.`,
  body:[
   `<b>Bulgaristan</b> 29 Eylül’de ateşkes imzaladı; Osmanlı’nın Almanya ile kara bağlantısı
    koptu. <b>Osmanlı Devleti</b> 30 Ekim’de <b>Mondros Ateşkes Antlaşması</b>’nı imzaladı.`,
   `<b>Avusturya-Macaristan</b> 3 Kasım’da Villa Giusti’de teslim oldu; imparatorluk ulusal
    devletlere dağıldı. Almanya’da devrim çıktı, Kayzer ülkeden kaçtı. <b>11 Kasım 1918</b>’de
    Compiègne ormanındaki bir vagonda imzalanan ateşkesle savaş sona erdi.`],
  facts:[["Bulgaristan","29 Eylül · Selanik Ateşkesi"],
         ["Osmanlı","30 Ekim · Mondros Ateşkesi"],
         ["Avusturya-Macaristan","3 Kasım · Villa Giusti"],
         ["Almanya","11 Kasım · Compiègne (Rethondes)"]],
  osm:`Nablus’ta (Megiddo) çöken cephenin ardından Mustafa Kemal, Halep’in kuzeyinde yeni bir
       savunma hattı kurdu; bu hat bugünkü güney sınırımıza yakındır. Mondros’la Osmanlı
       ordusu terhis edildi, Boğazlar İtilaf’a açıldı.`
},
/* ---------------------------------------------------------------- 8 */
{ id:"s8", yr:"1918–1920", nm:"Mondros ve işgal",
  date:"Kasım 1918 – 1920",
  t:"Mondros’tan sonra: Osmanlı toprakları işgal ediliyor",
  view:[20, 30, 48, 44],
  side:{GBR:"W-GBR", FRA:"W-FRA", ITA:"W-ITA", GRC:"W-GRC", ROU:"W-ROU", BEL:"W-BEL",
        SCS:"W-SCS", PRT:"W", HJZ:"Y-HJZ",
        DEU:"L-DEU", AUT:"L-AUT", HUN:"L-HUN", BGR:"L-BGR", OSM:"L-OSM",
        POL:"Y-POL", CZS:"Y-CZS", FIN:"Y-FIN", EST:"Y-EST", LVA:"Y-LVA", LTU:"Y-LTU",
        GEO:"Y-GEO", ARM:"Y-ARM", AZE:"Y-AZE", SOV:"X-SOV", MEM:"W", DNZ:"N"},
  own:{aut:"AUT", cze:"CZS", svk:"CZS", zak:"CZS", hun:"HUN", trs:"ROU", buk:"ROU",
       gal:"POL", cpol:"POL", svn:"SCS", hrv:"SCS", bih:"SCS", vjv:"SCS", boka:"SCS",
       srb:"SCS", mne:"SCS", strm:"SCS", jul:"ITA", trn:"ITA", als:"FRA",
       est:"EST", lva:"LVA", ltu:"LTU", viln:"LTU", kars:"ARM", batum:"GEO",
       ukr:"SOV", blr:"SOV", wblr:"SOV", vol:"SOV", sdob:"ROU"},
  zones:[["RHN","W"]],
  pz:[["mon_itilaf","W"],["mon_ing","W-GBR"],["mon_ingfra","W-FRA"],["mon_fra","W-FRA"],
      ["mon_ita","W-ITA"],["mon_yun","W-GRC"]],
  z2:[["MSL18","W-GBR"],["IRQ18","W-GBR"],["PAL18","W"]],
  lines:[], arrows:["a_ist","a_izmir","a_antalya","a_adana","a_musul","a_samsun"],
  ev:["istanbul","musul18","iskenderun","izmir","antalya","adana","medine19","paris","samsun"],
  lede:`Mondros Ateşkesi’nin maddeleri çok genişti. İtilaf Devletleri kısa sürede Osmanlı
        topraklarının stratejik noktalarını işgal etmeye başladı.`,
  body:[
   `Ateşkesin <b>7. maddesi</b> İtilaf Devletleri’ne “güvenliklerini tehdit eden bir durumda”
    herhangi bir stratejik noktayı işgal hakkı veriyordu. <b>24. madde</b> ise altı doğu
    vilayetinde (Vilâyât-ı Sitte) karışıklık çıkarsa buraların işgalini mümkün kılıyordu.`,
   `İngilizler ateşkesten sonra <b>Musul</b>’u aldı. İtilaf donanması <b>13 Kasım 1918</b>’de
    İstanbul’a demirledi. Fransızlar Çukurova’ya, İtalyanlar Antalya ve Konya’ya girdi.
    <b>15 Mayıs 1919</b>’da Yunan ordusu İzmir’e çıktı.`,
   `Avrupa’da ise Avusturya-Macaristan dağılmış; Çekoslovakya, Polonya ve Sırp-Hırvat-Sloven
    Krallığı kurulmuştu. Rusya iç savaştaydı.`],
  facts:[["Mondros","30 Ekim 1918 · 25 madde"],
         ["İstanbul","13 Kasım 1918’de donanma; 16 Mart 1920’de resmen işgal"],
         ["İzmir","15 Mayıs 1919 · Yunan işgali"],
         ["Samsun","19 Mayıs 1919 · Mustafa Kemal"]],
  osm:`Kurtuluşun ilk adımı Mustafa Kemal’in <b>19 Mayıs 1919</b>’da Samsun’a çıkmasıyla
       atıldı. İşgallere karşı yurdun dört bir yanında Kuvâ-yı Millîye birlikleri doğdu.`
},
/* ---------------------------------------------------------------- 9 */
{ id:"s9", yr:"1919–1923", nm:"Yeni harita",
  date:"1919 – 1923",
  t:"Barış antlaşmaları ve savaştan sonraki dünya",
  view:[-9, 22, 52, 60],
  side:{GBR:"W-GBR", FRA:"W-FRA", ITA:"W-ITA", GRC:"W-GRC", ROU:"W-ROU", BEL:"W-BEL",
        SCS:"W-SCS", PRT:"W",
        DEU:"L-DEU", AUT:"L-AUT", HUN:"L-HUN", BGR:"L-BGR", TUR:"T",
        POL:"Y-POL", CZS:"Y-CZS", FIN:"Y-FIN", EST:"Y-EST", LVA:"Y-LVA", LTU:"Y-LTU",
        IRL:"Y", HJZ:"Y-HJZ", EGY:"N", SOV:"X-SOV", FRM:"M-FRM", GBM:"M-GBM",
        DNZ:"N", SAAR:"N"},
  own:{tur:"TUR", kars:"TUR", batum:"SOV", geo:"SOV", arm:"SOV", aze:"SOV", est:"EST",
       ukr:"SOV", blr:"SOV", wblr:"POL", vol:"POL", viln:"POL", corr:"POL", usil:"POL",
       danz:"DNZ", saar:"SAAR", nsch:"DNK", memel:"LTU", bes:"ROU", sdob:"ROU", wthr:"GRC",
       syr:"FRM", lbn:"FRM", pal:"GBM", jor:"GBM", bsr:"GBM", bgd:"GBM", msl:"GBM",
       irl:"IRL", egy:"EGY", yem:"YEM", shm:"NEJ", asr:"NEJ", dod:"ITA"},
  zones:[], pz:[], lines:[], arrows:[],
  ev:["versay","stgermain","neuilly","trianon","sevr","mc","lozan"],
  opt:{sevr:true},
  lede:`Paris Barış Konferansı’nda (1919–1920) galip devletler yenilenlere ağır şartlar
        dikte etti. Dört imparatorluk yıkıldı, Avrupa ve Orta Doğu’nun haritası yeniden
        çizildi.`,
  body:[
   `Almanya <b>Versay</b>’da (1919) Alsas-Loren’i Fransa’ya, Batı Prusya ve Poznan’ı
    Polonya’ya bıraktı; ordusu 100.000 kişiyle sınırlandı, ağır savaş tazminatına bağlandı.
    Avusturya (Saint-Germain), Bulgaristan (Neuilly) ve Macaristan (Trianon) büyük toprak
    kayıplarına uğradı.`,
   `Osmanlı Devleti’ne dayatılan <b>Sevr</b> (10 Ağustos 1920) Anadolu’yu paylaşıyordu ama
    hiç uygulanamadı. Millî Mücadele’nin zaferinden sonra <b>Lozan</b> (24 Temmuz 1923) ile
    Türkiye’nin bağımsızlığı tanındı.`,
   `Arap toprakları <b>manda</b> adı altında İngiltere ve Fransa arasında paylaşıldı. Barışı
    korumak için <b>Milletler Cemiyeti</b> kuruldu; ancak ağır barış şartları yeni bir
    savaşın tohumlarını ekti.`],
  facts:[["Yıkılan imparatorluklar","Alman · Avusturya-Macaristan · Rus · Osmanlı"],
         ["Yeni devletler","Polonya, Çekoslovakya, Finlandiya, Baltık devletleri, SHS Krallığı"],
         ["Manda","Suriye-Lübnan: Fransa · Irak, Filistin, Ürdün: İngiltere"],
         ["Kayıp","9–10 milyon asker; milyonlarca sivil"]],
  osm:`Sevr kâğıt üzerinde kaldı; Türk milleti Kurtuluş Savaşı ile Mondros’un ve Sevr’in
       şartlarını yırttı. Haritadaki <b>Sevr</b> düğmesi, antlaşmanın Anadolu için öngördüğü
       paylaşımı gösterir.`
}
];

/* ------------------------------------------------------------------ toprak parçalarının adları */
D.AN = {
  deu:"Almanya", saar:"Saar Havzası", als:"Alsas-Loren", corr:"Poznan ve Batı Prusya",
  danz:"Danzig (Gdańsk)", usil:"Doğu Yukarı Silezya", memel:"Memel (Klaipėda)", nsch:"Kuzey Şlezvig",
  aut:"Avusturya", cze:"Bohemya ve Moravya", svk:"Slovakya", hun:"Macaristan",
  trs:"Transilvanya ve Banat", buk:"Bukovina", gal:"Galiçya", zak:"Karpat Rutenyası",
  svn:"Slovenya", jul:"Trieste, Gorizia ve İstirya", trn:"Trentino ve Güney Tirol",
  hrv:"Hırvatistan ve Dalmaçya", bih:"Bosna-Hersek", vjv:"Voyvodina", boka:"Kotor Körfezi",
  rus:"Rusya", fin:"Finlandiya", est:"Estonya", lva:"Letonya (Kurland ve Livonya)", ltu:"Litvanya",
  viln:"Vilnius bölgesi", cpol:"Polonya (Rus bölümü)", wblr:"Batı Belarus", blr:"Belarus",
  vol:"Volhinya", ukr:"Ukrayna", bes:"Besarabya", kars:"Kars, Ardahan, Artvin ve Iğdır",
  batum:"Batum (Acara)", geo:"Gürcistan", arm:"Ermenistan", aze:"Azerbaycan",
  tur:"Anadolu ve Doğu Trakya", syr:"Suriye", lbn:"Lübnan", pal:"Filistin", jor:"Ürdün ve Maan",
  bsr:"Basra", bgd:"Bağdat", msl:"Musul", hjz:"Hicaz", asr:"Asir", yem:"Yemen", qat:"Katar",
  gbr:"Büyük Britanya", irl:"İrlanda", egy:"Mısır", sdn:"Sudan", cyp:"Kıbrıs", mlt:"Malta",
  aden:"Aden ve Hadramut", soml:"İngiliz Somalisi", kwt:"Kuveyt", bhr:"Bahreyn",
  are:"Sahil Emirlikleri", fra:"Fransa", dza:"Cezayir", tun:"Tunus", mar:"Fas",
  frwa:"Fransız Batı Afrikası", dji:"Fransız Somalisi (Cibuti)", ita:"İtalya",
  lby:"Libya (Trablusgarp ve Bingazi)", eri:"Eritre", soms:"İtalyan Somalisi", dod:"Onikiada",
  esp:"İspanya", smar:"İspanyol Fası", prt:"Portekiz", bel:"Belçika", nld:"Hollanda",
  lux:"Lüksemburg", che:"İsviçre", dnk:"Danimarka", nor:"Norveç", swe:"İsveç",
  srb:"Sırbistan, Kosova ve Vardar Makedonyası", mne:"Karadağ", alb:"Arnavutluk", grc:"Yunanistan",
  bgr:"Bulgaristan", wthr:"Batı Trakya", strm:"Ustrumca", rou:"Romanya", sdob:"Güney Dobruca",
  irn:"İran", afg:"Afganistan", nej:"Necid", shm:"Cebel-i Şammar", omn:"Umman", eth:"Habeşistan",
  oth:"Afrika"
};
/* taraf adları (lejant, kart) */
D.SIDE = {C:"İttifak Devletleri", E:"İtilaf Devletleri", N:"Tarafsız", X:"Savaştan çekildi",
  L:"Yenilen devletler", W:"Galip devletler", Y:"Yeni kurulan devletler", M:"Manda yönetimi",
  T:"Türkiye (Millî Mücadele)"};
