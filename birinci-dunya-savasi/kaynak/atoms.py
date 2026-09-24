"""1914 dönem birimleri ("atom") — Natural Earth idari birimlerinden türetilir.

Her atom, 1914 ile 1923 arasında sahibi değişmeyen en küçük toprak parçasıdır.
Modern il/eyalet sınırı tarihî sınıra uymadığında elle çizilmiş (boylam, enlem)
çokgenleriyle kesilir. Sınırlar ders anlatımı için şematiktir (±10–20 km).
"""

# ---------------------------------------------------------------- yardımcı çizgiler
# Almanya–Rusya sınırı 1815–1914 (güneyden kuzeye): Üç İmparator Köşesi → Prosna →
# Gopło → Drwęca → Doğu Prusya'nın güney sınırı → bugünkü PL–LT–RU üçlü noktası
GR_LINE = [(19.17,50.23),(19.12,50.26),(19.05,50.31),(19.02,50.37),(19.00,50.45),
    (19.03,50.55),(18.98,50.64),(18.90,50.72),(18.82,50.80),(18.72,50.90),(18.60,50.97),
    (18.47,51.04),(18.30,51.12),(18.18,51.22),(18.15,51.30),(18.10,51.45),(18.12,51.55),
    (18.08,51.68),(18.03,51.78),(17.95,51.90),(17.85,52.02),(17.72,52.12),(17.67,52.18),
    (17.80,52.27),(17.85,52.31),(18.00,52.42),(18.15,52.48),(18.30,52.52),(18.34,52.62),
    (18.37,52.71),(18.55,52.79),(18.70,52.88),(18.74,52.94),(18.72,53.02),(18.90,53.07),
    (19.05,53.10),(19.25,53.18),(19.42,53.22),(19.70,53.19),(19.95,53.15),(20.20,53.15),
    (20.45,53.22),(20.68,53.29),(20.90,53.32),(21.15,53.39),(21.40,53.43),(21.65,53.46),
    (21.90,53.49),(22.15,53.57),(22.44,53.67),(22.60,53.80),(22.62,53.98),(22.58,54.15),
    (22.70,54.30),(22.79,54.36)]

# Avusturya–Rusya sınırı (batıdan doğuya): Kraków'un kuzeyi → Vistül → San ağzı →
# Galiçya'nın kuzey sınırı → Brody → Zbruç ırmağı → Dinyester
AR_LINE = [(19.17,50.23),(19.35,50.27),(19.52,50.22),(19.70,50.20),(19.90,50.18),
    (20.05,50.12),(20.20,50.07),(20.38,50.11),(20.55,50.18),(20.72,50.24),(21.00,50.33),
    (21.28,50.43),(21.55,50.55),(21.75,50.66),(21.85,50.73),(21.95,50.68),(22.05,50.62),
    (22.30,50.58),(22.55,50.42),(22.80,50.30),(23.10,50.36),(23.40,50.41),(23.70,50.42),
    (24.00,50.50),(24.25,50.56),(24.55,50.45),(24.85,50.28),(25.15,50.10),(25.45,50.02),
    (25.75,49.85),(25.95,49.70),(26.12,49.55),(26.18,49.30),(26.20,49.07),(26.30,48.85),
    (26.47,48.60)]

# ---------------------------------------------------------------- elle çizilen çokgenler
POLY = {
  # Rus Lehistanı (Kongre Polonyası + Białystok): GR_LINE'ın doğusu, AR_LINE'ın kuzeyi
  "RUS_POL": GR_LINE + [(24.6,54.6),(24.6,50.3)] + [p for p in reversed(AR_LINE) if p[0] <= 24.3],
  # Galiçya + Bukovina + Avusturya Silezyası (Leh ve Ukrayna topraklarında)
  "AUS_EAST": [(17.5,49.90),(18.20,49.90),(18.30,49.93),(18.77,49.92),(19.15,50.03)]
      + AR_LINE + [(26.35,48.52),(26.22,48.42),(26.20,48.30),(26.30,48.22),(26.62,48.15),
      (26.62,47.0),(17.5,47.0)],
  # Kuzey Şlezvig (1864–1920 Alman, 1920 plebisitiyle Danimarka)
  "NSCH": [(8.0,55.44),(8.9,55.43),(9.3,55.43),(9.5,55.48),(10.1,55.48),(10.1,54.5),(8.0,54.5)],
  # Memel (Klaipėda) bölgesi
  "MEMEL": [(20.9,55.97),(21.10,55.90),(21.30,55.86),(21.40,55.72),(21.60,55.55),
      (21.95,55.35),(22.30,55.20),(22.62,55.08),(22.62,54.90),(20.9,54.90)],
  # Batı Trakya (Karasu/Nestos'un doğusu; 1913–1919 Bulgar)
  "WTHR": [(24.72,40.70),(24.78,41.08),(24.52,41.25),(24.25,41.45),(24.25,41.9),
      (26.8,41.9),(26.8,40.5)],
  # Onikiada (1912'den beri İtalyan)
  "DOD": [(26.25,35.3),(26.25,37.05),(26.45,37.4),(26.95,37.45),(27.35,37.1),(28.5,36.8),
      (29.8,36.25),(29.8,35.3)],
  # Julien Marşı — 1920 Rapallo ile İtalya'ya geçen Avusturya toprakları (Slovenya/Hırvatistan kısmı)
  "JUL": [(13.40,46.60),(13.72,46.53),(13.66,46.44),(13.84,46.38),(13.98,46.18),
      (14.15,45.93),(14.30,45.75),(14.45,45.58),(14.40,45.37),(14.50,45.25),(14.60,44.90),
      (14.60,44.45),(13.40,44.45)],
  # Budjak (Güney Besarabya — bugün Odesa bölgesinin batısı)
  "BUDJAK": [(28.15,45.1),(28.15,46.85),(29.30,46.80),(29.70,46.65),(30.10,46.48),
      (30.25,46.38),(30.30,46.20),(30.40,46.00),(30.30,45.75),(29.9,45.1)],
  # İspanyol Fası
  "SMAR": [(-6.5,34.95),(-5.6,34.85),(-4.6,34.80),(-3.6,34.75),(-2.35,35.05),(-2.0,35.35),
      (-2.0,36.2),(-6.5,36.2)],
  # Danzig Serbest Şehri (1920)
  "DANZ": [(18.50,54.47),(18.50,54.30),(18.60,54.18),(18.75,54.12),(18.90,54.10),
      (19.05,54.05),(19.15,54.12),(19.25,54.25),(19.28,54.40),(19.20,54.55),(18.60,54.55)],
  # "Koridor" + Poznan: 1920'de Polonya'ya geçen Alman toprakları (Pomeranya/Büyük Polonya)
  "CORR": [(17.95,55.0),(17.95,54.55),(17.75,54.30),(17.60,54.00),(17.45,53.72),
      (17.30,53.45),(17.10,53.25),(16.85,53.10),(16.55,52.95),(16.20,52.88),(16.00,52.78),
      (15.85,52.60),(15.87,52.40),(15.87,52.22),(16.05,52.05),(16.30,51.90),(16.45,51.80),
      (16.70,51.65),(16.90,51.55),(17.25,51.62),(17.55,51.50),(17.75,51.37),(17.95,51.22),
      (18.20,51.10),(19.5,51.1),(19.5,53.4),(18.80,53.55),(18.78,53.70),(18.84,53.85),
      (18.84,54.05),(18.90,54.40),(18.90,55.0)],
  # Doğu Yukarı Silezya (1922'de Polonya'ya)
  "EUSIL": [(18.72,50.90),(18.60,50.80),(18.55,50.62),(18.72,50.50),(18.82,50.40),
      (18.83,50.30),(18.75,50.20),(18.55,50.14),(18.40,50.07),(18.28,49.97),(18.30,49.93),
      (18.77,49.92),(19.15,50.03),(19.17,50.23),(19.12,50.26),(19.05,50.31),(19.02,50.37),
      (19.00,50.45),(19.03,50.55),(18.98,50.64),(18.90,50.72),(18.82,50.80)],
  # 1921 Riga sınırının batısı (Batı Belarus + Volhinya → Polonya)
  "POLEAST": [(22.0,56.2),(27.0,56.2),(27.9,55.85),(28.15,55.6),(27.95,55.25),
      (27.85,54.95),(27.55,54.6),(27.35,54.25),(27.15,53.95),(26.95,53.65),(26.95,53.35),
      (27.05,53.05),(27.35,52.75),(27.55,52.35),(27.65,52.0),(27.55,51.65),(27.40,51.35),
      (27.35,50.90),(27.25,50.62),(26.95,50.40),(26.65,50.20),(26.35,49.95),(26.15,49.72),
      (26.0,49.0),(22.0,49.0)],
  # Vilnius bölgesi (1920'de Polonya işgali, 1922 ilhak)
  "VILN": [(26.63,55.68),(26.0,55.50),(25.40,55.25),(24.90,55.00),(24.55,54.82),
      (24.25,54.50),(24.00,54.20),(23.50,54.00),(23.50,53.5),(28,53.5),(28,56)],
  # Dinyester'in sol yakası (Moldova içinde; Rus Podolyası/Herson — Besarabya değil)
  "TRANSN": [(27.5,48.55),(28.2,48.25),(28.6,48.08),(28.95,47.78),(29.12,47.45),
      (29.20,47.15),(29.45,46.90),(29.60,46.75),(29.95,46.55),(30.2,46.4),(31.0,46.4),(31.0,48.6)],
}

# ---------------------------------------------------------------- ülke → atom kuralları
# Her ülke sırayla işlenir: (atom, seçici). Seçici None ise ülkenin kalan kısmı.
# Seçiciler:
#   ("a1", [ad, ...])           → o ülkenin adı verilen idari birimleri
#   ("poly", "AD")               → elle çizilen çokgen
#   ("and", seçici, seçici)      → kesişim
#   ("centroid_in", "AD", [..])  → merkezi çokgenin içinde kalan idari birimler
RULES = {
 "DEU": [("saar", ("a1",["Saarland"])), ("deu", None)],
 "FRA": [("als", ("a1",["Bas-Rhin","Haute-Rhin","Moselle"])), ("fra", None)],
 "DNK": [("nsch", ("and", ("a1",["Syddanmark"]), ("poly","NSCH"))), ("dnk", None)],
 "ITA": [("trn", ("a1",["Trento","Bozen"])), ("jul", ("a1",["Gorizia","Trieste"])), ("ita", None)],
 "SMR": [("ita", None)], "VAT": [("ita", None)],
 "SVN": [("jul", ("poly","JUL")), ("svn", None)],
 "HRV": [("jul", ("poly","JUL")), ("hrv", None)],
 "SRB": [("vjv", ("a1",["Severno-Backi","Zapadno-Backi","Južno-Backi","Severno-Banatski",
                        "Srednje-Banatski","Južno-Banatski","Sremski"])), ("srb", None)],
 "KOS": [("mne", ("a1",["Peć","Dečani","Istok","Klina","Đakovica"])), ("srb", None)],
 "MKD": [("strm", ("a1",["Strumitsa","Novo Selo","Bosilovo","Vasilevo"])), ("srb", None)],
 "MNE": [("boka", ("a1",["Herceg Novi","Kotor","Tivat","Budva"])), ("mne", None)],
 "GRC": [("wthr", ("and", ("a1",["Anatoliki Makedonia kai Thraki"]), ("poly","WTHR"))),
         ("dod", ("and", ("a1",["Notio Aigaio"]), ("poly","DOD"))), ("grc", None)],
 "BGR": [("sdob", ("a1",["Dobrich","Silistra"])), ("bgr", None)],
 "ROU": [("trs", ("a1",["Satu Mare","Arad","Bihor","Timis","Caras-Severin","Maramures","Cluj",
                        "Bistrita-Nasaud","Salaj","Hunedoara","Covasna","Brasov","Sibiu",
                        "Mures","Harghita","Alba"])),
         ("buk", ("a1",["Suceava"])), ("rou", None)],
 "MDA": [("ukr", ("centroid_in","TRANSN",None)), ("bes", None)],
 "UKR": [("zak", ("a1",["Transcarpathia"])),
         ("buk", ("and", ("a1",["Chernivtsi"]), ("poly","AUS_EAST"))),
         ("gal", ("poly","AUS_EAST")),
         ("bes", ("a1",["Chernivtsi"])),
         ("bes", ("and", ("a1",["Odessa"]), ("poly","BUDJAK"))),
         ("vol", ("poly","POLEAST")),
         ("ukr", None)],
 "POL": [("deu", ("a1",["West Pomeranian","Lubusz","Lower Silesian","Opole","Warmian-Masurian"])),
         ("cpol", ("a1",["Masovian","Podlachian","Łódź","Świętokrzyskie","Lublin"])),
         ("gal", ("a1",["Subcarpathian"])),
         ("cpol", ("poly","RUS_POL")),
         ("gal", ("poly","AUS_EAST")),
         ("danz", ("and", ("a1",["Pomeranian"]), ("poly","DANZ"))),
         ("corr", ("and", ("a1",["Pomeranian","Kuyavian-Pomeranian","Greater Poland"]), ("poly","CORR"))),
         ("corr", ("a1",["Kuyavian-Pomeranian"])),
         ("usil", ("and", ("a1",["Silesian"]), ("poly","EUSIL"))),
         ("deu", None)],
 "LTU": [("memel", ("poly","MEMEL")), ("viln", ("poly","VILN")), ("ltu", None)],
 "RUS": [("deu", ("a1",["Kaliningrad"])), ("rus", None)],
 "BLR": [("wblr", ("poly","POLEAST")), ("blr", None)],
 "TUR": [("kars", ("a1",["Kars","Ardahan","Artvin","Iğdir"])), ("tur", None)],
 "GEO": [("batum", ("a1",["Ajaria"])), ("geo", None)],
 "IRQ": [("bsr", ("a1",["Al-Basrah","Dhi-Qar","Maysan","Al-Muthannia"])),
         ("msl", ("a1",["Ninawa","Dihok","Arbil","As-Sulaymaniyah","At-Ta'mim"])),
         ("bgd", None)],
 "SAU": [("hjz", ("a1",["Makkah","Al Madinah","Tabuk","Al Bahah"])),
         ("asr", ("a1",["`Asir","Jizan"])),
         ("shm", ("a1",["Ha'il","Al Jawf","Al Hudud ash Shamaliyah"])),
         ("nej", None)],
 "YEM": [("aden", ("a1",["`Adan","Lahij","Abyan","Shabwah","Hadramawt","Al Mahrah","Al Dali'"])),
         ("yem", None)],
 "MAR": [("smar", ("poly","SMAR")), ("mar", None)],
}

# ülkenin tamamı tek atoma gidiyorsa
WHOLE = {
 "BEL":"bel","NLD":"nld","LUX":"lux","CHE":"che","LIE":"che","AUT":"aut","CZE":"cze","SVK":"svk",
 "HUN":"hun","ESP":"esp","AND":"esp","GIB":"esp","PRT":"prt","GBR":"gbr","IMN":"gbr","GGY":"gbr",
 "JEY":"gbr","IRL":"irl","NOR":"nor","SWE":"swe","FIN":"fin","ALD":"fin","EST":"est","LVA":"lva",
 "MCO":"fra","BIH":"bih","ALB":"alb","ARM":"arm","AZE":"aze","SYR":"syr","LBN":"lbn","ISR":"pal",
 "PSX":"pal","JOR":"jor","KWT":"kwt","QAT":"qat","BHR":"bhr","ARE":"are","OMN":"omn","IRN":"irn",
 "EGY":"egy","SDN":"sdn","SDS":"sdn","BRT":"sdn","LBY":"lby","TUN":"tun","DZA":"dza","SAH":"sah",
 "ERI":"eri","ETH":"eth","DJI":"dji","SOL":"soml","SOM":"soms","CYP":"cyp","CYN":"cyp","CNM":"cyp",
 "ESB":"cyp","WSB":"cyp","MLT":"mlt","KAZ":"rus","TKM":"rus","UZB":"rus","KAB":"rus","KGZ":"rus",
 "TJK":"rus","AFG":"afg","PAK":"brind","IND":"brind","MRT":"frwa","MLI":"frwa","NER":"frwa",
 "TCD":"frwa","ISL":"isl","FRO":"dnk","CHN":"chn",
}
