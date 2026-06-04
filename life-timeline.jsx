import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

const HISTORY_EVENTS = [
  { id:"h1",  year:1866, title:"Austria keeps South Tyrol",   loc:"regional", color:"#3D9BE0", desc:"After the Austro-Prussian War, Veneto goes to Italy but South Tyrol remains firmly Habsburg — Austrian in language, culture, and administration." },
  { id:"h2",  year:1914, title:"World War I",                  loc:"regional", color:"#E15554", desc:"Austria-Hungary enters WWI. South Tyroleans fight for Austria. Italy joins the Allies in 1915 — neighbours become enemies. The front runs through the Dolomites." },
  { id:"h3",  year:1919, title:"Annexation to Italy",          loc:"regional", color:"#E15554", desc:"Treaty of Saint-Germain: South Tyrol annexed to Italy against the will of its ~250,000 German- and Ladin-speaking inhabitants. No plebiscite offered." },
  { id:"h4",  year:1923, title:"Italianisation begins",        loc:"regional", color:"#D98032", desc:"Mussolini bans German from schools, public life, courts, and official use. German and Ladin place names replaced by Italian. German surnames forcibly Italianised by decree. Teaching children German becomes illegal." },
  { id:"h5",  year:1939, title:"The Options (Optionen)",       loc:"regional", color:"#D98032", desc:"Hitler-Mussolini pact forces South Tyroleans to choose: emigrate to the German Reich, or stay and be fully assimilated. ~86% opt to leave. WWII disrupts the transfers; most stay. 'Dableiber' and 'Optanten' communities end up bitterly divided." },
  { id:"h6",  year:1943, title:"Nazi occupation",              loc:"regional", color:"#7B4FB0", desc:"After Italy's armistice, German forces occupy South Tyrol as the 'Operationszone Alpenvorland.' German is briefly restored. Jewish South Tyroleans are deported." },
  { id:"h7",  year:1945, title:"Post-war: Italy keeps South Tyrol", loc:"regional", color:"#5F5E5A", desc:"Allied powers confirm South Tyrol within Italy. Autonomy demands restart immediately." },
  { id:"h8",  year:1946, title:"De Gasperi–Gruber Pact",      loc:"regional", color:"#1D9E75", desc:"Paris Peace Treaty: Italy formally promises South Tyrol 'local authorities with legislative and executive regional power' — the legal foundation for all future autonomy demands." },
  { id:"h9",  year:1961, title:"Feuernacht / Night of Fire",   loc:"regional", color:"#E15554", desc:"12 June 1961: South Tyrolean Liberation Committee bombs 37 electrical pylons. International pressure forces Italy to negotiate seriously." },
  { id:"h10", year:1969, title:"Autonomy Package agreed",      loc:"regional", color:"#1D9E75", desc:"Italy and Austria agree a 'Package' of 137 measures granting real autonomy to South Tyrol. Implementation takes 23 years." },
  { id:"h11", year:1972, title:"Second Statute of Autonomy",   loc:"regional", color:"#1D9E75", desc:"New statute gives the Province of Bolzano/Bozen genuine legislative and financial autonomy, separate from majority-Italian Trentino. German and Ladin become official languages." },
  { id:"h12", year:1992, title:"Dispute resolved",             loc:"regional", color:"#1D9E75", desc:"Austria and Italy notify the UN: settled. South Tyrol becomes one of Europe's most prosperous and autonomous regions. Bilingualism is protected." },
];

// ── Local history: Pustertal, Innichen (San Candido), Bruneck (Brunico) ──
const PUSTERTAL_EVENTS = [
  { id:"p1",  year:769,  title:"Stift Innichen founded",       color:"#7B4FB0", desc:"Duke Tassilo III of Bavaria founds the collegiate church at Innichen — one of the oldest Carolingian foundations in the Alps. For over a thousand years it anchors the spiritual and cultural life of the upper Pustertal." },
  { id:"p2",  year:1282, title:"Bruneck founded",              color:"#3D9BE0", desc:"Prince-Bishop Bruno von Kirchberg of Brixen establishes Bruneck (Brunico) as a fortified market town on the Rienz river. It becomes the economic and administrative centre of the Pustertal for centuries." },
  { id:"p3",  year:1420, title:"Pustertal fully Habsburg",     color:"#3D9BE0", desc:"After the last Görz count dies, the entire Pustertal passes to the Habsburg County of Tyrol. Five hundred years of Austrian rule begin. Families here live under Habsburg law, language, and culture through to 1919." },
  { id:"p4",  year:1809, title:"Andreas Hofer uprising",       color:"#E15554", desc:"The Tyrolean uprising against Napoleonic-Bavarian occupation mobilises men from Innichen and Bruneck. Hofer is captured and executed in 1810 — he remains the defining folk hero of South Tyrol, whose memory every Pustertal family carries." },
  { id:"p5",  year:1871, title:"Pustertalbahn opens",          color:"#1D9E75", desc:"The railway through the Pustertal (Lienz–Innichen–Bruneck–Franzensfeste) opens. It transforms the economy overnight: goods move, people travel, tourism becomes conceivable. Families who had farmed in relative isolation are now connected to the wider world." },
  { id:"p6",  year:1882, title:"Great Rienz flood",            color:"#3D9BE0", desc:"Catastrophic flooding of the Rienz / Rienza devastates the Pustertal. Bridges, mills, farmland, and houses swept away in one of the worst flood events in the valley's recorded history. A traumatic collective memory passed down in Pustertal families." },
  { id:"p7",  year:1915, title:"Dolomite Front",               color:"#E15554", desc:"Italy enters WWI and the front runs through the Sextner Dolomites, kilometres from Innichen. The Drei Zinnen / Tre Cime di Lavaredo and Monte Paterno become sites of brutal mountain warfare. Innichen serves as an Austrian military base. Virtually every family in the Pustertal loses men." },
  { id:"p8",  year:1923, title:"Place names erased",           color:"#D98032", desc:"Mussolini's Italianisation renames every settlement: Innichen → San Candido, Bruneck → Brunico, Toblach → Dobbiaco, Rienz → Rienza. Family surnames Italianised by decree. For people whose ancestors had used these names for a thousand years, it was an erasure of the landscape itself." },
  { id:"p9",  year:1966, title:"Rienz floods again",           color:"#3D9BE0", desc:"Major autumn flooding damages infrastructure throughout the Pustertal, echoing the 1882 disaster. Part of the catastrophic 1966 flooding across Northern Italy. Older people still remembered 1882 when the waters rose again." },
  { id:"p10", year:1973, title:"Kronplatz ski area opens",      color:"#1D9E75", desc:"The ski area above Bruneck opens and rapidly becomes one of South Tyrol's most important winter tourism destinations. The Pustertal economy shifts decisively toward hospitality; the valley's character changes within a generation." },
  { id:"p11", year:1985, title:"Bruneck city status",          color:"#1D9E75", desc:"Bruneck officially receives Stadt / Città designation, recognising its growth as the economic and cultural centre of the Pustertal." },
  { id:"p12", year:1992, title:"Bilingual names restored",     color:"#1D9E75", desc:"Road signs now show both Innichen and San Candido, both Bruneck and Brunico. After 70 years, erased names return to official documents — though for older families, they had never stopped using them privately." },
  { id:"p13", year:2012, title:"Severe Pustertal flooding",    color:"#3D9BE0", desc:"September 2012: major flash floods and debris flows. Roads cut off, farmland destroyed, infrastructure damaged. The same Rienz valley dynamic that shaped 1882 and 1966, intensified by climate change." },
];

// ── Family tree — dynamic node model ──
// gen: higher = further back. 4=Phil, 3=parents, 2=grandparents, 1=great-grandparents, 0=great-great-grandparents.
// Phil's siblings/cousins also carry gen=4; aunts/uncles gen=3, etc.
// parentId1, parentId2: IDs of the two parents in the tree.
// partnerId: ID of spouse/partner for the couple-line visual.
// seq: ordering within the generation row (lower = further left).
const FAMILY_DEFAULT = [

  // ── gen 0: Great-great-grandparents ─────────────────────────────────
  // Maternal (Hitthaler) line — great-great-grandparents of Greti / Margareth
  { id:"ggg1", gen:0, seq:0, name:"Josef Hitthaler",     birthYear:null, deathYear:null, notes:"Purchased the Kachlerhof in St. Georgen; Greti's great-great-grandfather",              role:"Ururopa (Hitthaler)", side:"maternal", parentId1:null,  parentId2:null,  partnerId:"ggg2" },
  { id:"ggg2", gen:0, seq:1, name:"(Ahrntal family)",    birthYear:null, deathYear:null, notes:"From the Ahrntal; inherited the Zieglerhof; Greti's great-great-grandmother",            role:"Ururomi (Hitthaler)", side:"maternal", parentId1:null,  parentId2:null,  partnerId:"ggg1" },

  // ── gen 1: Great-grandparents ────────────────────────────────────────
  // Paternal — parents of Ernst Mitterhofer
  { id:"gg1",  gen:1, seq:0, name:"Franz Mitterhofer Sr.", birthYear:null, deathYear:1966, notes:"Phil's paternal great-grandfather; died 1966",                                          role:"Uropa (Mitterhofer)", side:"paternal", parentId1:null,  parentId2:null,  partnerId:"gg2" },
  { id:"gg2",  gen:1, seq:1, name:"",                    birthYear:null, deathYear:null, notes:"Ernst Mitterhofer's mother — name not recorded in family sources",                       role:"Uromi (Mitterhofer)", side:"paternal", parentId1:null,  parentId2:null,  partnerId:"gg1" },
  // Paternal — parents of Marianna Arnoldo (Ernst's wife)
  { id:"gg3",  gen:1, seq:2, name:"Richard Arnoldo",     birthYear:1886, deathYear:1967, notes:"Born 5 February 1886; died 1967. Marianna's father; Phil's paternal great-grandfather", role:"Uropa (Arnoldo)",    side:"paternal", parentId1:null,  parentId2:null,  partnerId:"gg4" },
  { id:"gg4",  gen:1, seq:3, name:"Maria Trojanek",      birthYear:1890, deathYear:1972, notes:"Born 14 September 1890; died 1972. Also spelled Trojaneck; Marianna's mother",          role:"Uromi (Arnoldo)",    side:"paternal", parentId1:null,  parentId2:null,  partnerId:"gg3" },
  // Maternal — parents of Felix Hitthaler (Greti's father)
  { id:"gg5",  gen:1, seq:4, name:"Josef Hitthaler",     birthYear:null, deathYear:null, notes:"Felix's father; Phil's maternal great-grandfather (son of Josef Sr. & the Ahrntal family)", role:"Uropa (Hitthaler)", side:"maternal", parentId1:"ggg1", parentId2:"ggg2", partnerId:"gg6" },
  { id:"gg6",  gen:1, seq:5, name:"Anna Hitthaler",      birthYear:null, deathYear:null, notes:"Felix's mother; Phil's maternal great-grandmother",                                       role:"Uromi (Hitthaler)",  side:"maternal", parentId1:"ggg1", parentId2:"ggg2", partnerId:"gg5" },
  // Maternal — parents of Greti's mother (unknown names)
  { id:"gg7",  gen:1, seq:6, name:"",                    birthYear:null, deathYear:null, notes:"Greti's maternal grandfather — name not recorded",                                        role:"Uropa (maternal)",   side:"maternal", parentId1:null,  parentId2:null,  partnerId:"gg8" },
  { id:"gg8",  gen:1, seq:7, name:"",                    birthYear:null, deathYear:null, notes:"Greti's maternal grandmother — name not recorded",                                        role:"Uromi (maternal)",   side:"maternal", parentId1:null,  parentId2:null,  partnerId:"gg7" },

  // ── gen 2: Grandparents & their siblings ─────────────────────────────
  // Paternal grandparents — Ernst & Marianna
  { id:"gp1",  gen:2, seq:0, name:"Ernst Mitterhofer",   birthYear:1924, deathYear:1989, notes:"Born 20 October 1924; died 9 June 1989. Manfred's father.",                              role:"Opa (paternal)",     side:"paternal", parentId1:"gg1",  parentId2:"gg2",  partnerId:"gp2" },
  { id:"gp2",  gen:2, seq:1, name:"Marianna Arnoldo",    birthYear:1926, deathYear:1993, notes:"Born 2 May 1926; died 14 January 1993. Manfred's mother; maiden name Arnoldo.",          role:"Oma (paternal)",     side:"paternal", parentId1:"gg3",  parentId2:"gg4",  partnerId:"gp1" },
  // Ernst's siblings (Phil's great-aunts/uncles on paternal side)
  { id:"fri1", gen:2, seq:2, name:"Frieda Mitterhofer",  birthYear:null, deathYear:null, notes:"Ernst's sister; Manfred's paternal aunt",                                                role:"Großtante",          side:"paternal", parentId1:"gg1",  parentId2:"gg2",  partnerId:null  },
  { id:"fra1", gen:2, seq:3, name:"Franz Mitterhofer Jr.",birthYear:null, deathYear:null, notes:"Ernst's brother; Manfred's uncle",                                                       role:"Großonkel",          side:"paternal", parentId1:"gg1",  parentId2:"gg2",  partnerId:null  },
  { id:"her1", gen:2, seq:4, name:"Herbert Mitterhofer", birthYear:null, deathYear:null, notes:"Ernst's brother; Manfred's uncle",                                                       role:"Großonkel",          side:"paternal", parentId1:"gg1",  parentId2:"gg2",  partnerId:null  },
  // Marianna's siblings
  { id:"ric2", gen:2, seq:5, name:"Richard Arnoldo Jr.", birthYear:null, deathYear:null, notes:"Marianna's brother; died during World War II",                                           role:"Großonkel (Arnoldo)",side:"paternal", parentId1:"gg3",  parentId2:"gg4",  partnerId:null  },
  // Maternal grandparents — Felix & unnamed
  { id:"gp3",  gen:2, seq:6, name:"Felix Hitthaler",     birthYear:null, deathYear:null, notes:"Greti's father; Phil's maternal grandfather",                                            role:"Opa (maternal)",     side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:"gp4" },
  { id:"gp4",  gen:2, seq:7, name:"(Hitthaler, Mutter)", birthYear:null, deathYear:null, notes:"Greti's mother; name not recorded in family sources",                                    role:"Oma (maternal)",     side:"maternal", parentId1:"gg7",  parentId2:"gg8",  partnerId:"gp3" },
  // Felix's siblings (Phil's great-aunts/uncles on maternal side)
  { id:"ma1",  gen:2, seq:8,  name:"Marie",              birthYear:null, deathYear:null, notes:"Felix's sister; later in Innsbruck/Hall; mother of Gabi (Phil's cousin)",               role:"Großtante",          side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"an1",  gen:2, seq:9,  name:"Anna",               birthYear:null, deathYear:null, notes:"Felix's sister; later in Innsbruck/Hall",                                               role:"Großtante",          side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"ro1",  gen:2, seq:10, name:"Rosl",               birthYear:null, deathYear:null, notes:"Felix's sister; lived in Brixen",                                                        role:"Großtante",          side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"bu1",  gen:2, seq:11, name:"Burgl",              birthYear:null, deathYear:null, notes:"Felix's sister; lived in Brixen",                                                        role:"Großtante",          side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"ch1",  gen:2, seq:12, name:"Christa",            birthYear:null, deathYear:null, notes:"Felix's sister; moved to Thuringia / East Germany",                                     role:"Großtante",          side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"vi1",  gen:2, seq:13, name:"Vinzenz Hitthaler",  birthYear:null, deathYear:null, notes:"Felix's brother; killed in World War II",                                               role:"Großonkel (†WWII)",  side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },
  { id:"jo2",  gen:2, seq:14, name:"Josef Hitthaler",    birthYear:null, deathYear:null, notes:"Felix's brother; killed in World War II",                                               role:"Großonkel (†WWII)",  side:"maternal", parentId1:"gg5",  parentId2:"gg6",  partnerId:null  },

  // ── gen 3: Parents, aunts & uncles, cousins ──────────────────────────
  { id:"pa1",  gen:3, seq:0, name:"Manfred Mitterhofer", birthYear:1957, deathYear:null, notes:"Born September 1957. Phil's father.",                                                   role:"Vater",              side:"paternal", parentId1:"gp1",  parentId2:"gp2",  partnerId:"pa2" },
  { id:"pa2",  gen:3, seq:1, name:"Greti Hitthaler",     birthYear:null, deathYear:null, notes:"Margareth Hitthaler; maiden name Hitthaler. Phil's mother.",                            role:"Mutter",             side:"maternal", parentId1:"gp3",  parentId2:"gp4",  partnerId:"pa1" },
  // Manfred's siblings
  { id:"ha1",  gen:3, seq:2, name:"Hans Mitterhofer",    birthYear:1963, deathYear:null, notes:"Hans Peter Mitterhofer; Manfred's younger brother; born 1963. Phil's uncle.",          role:"Onkel (paternal)",   side:"paternal", parentId1:"gp1",  parentId2:"gp2",  partnerId:"gr1" },
  { id:"gr1",  gen:3, seq:3, name:"Greti (Hans's wife)", birthYear:null, deathYear:null, notes:"Hans Mitterhofer's wife",                                                               role:"Tante (paternal)",   side:"paternal", parentId1:null,   parentId2:null,   partnerId:"ha1" },
  // Cousin from maternal side
  { id:"ga1",  gen:3, seq:4, name:"Gabi",                birthYear:null, deathYear:2025, notes:"Daughter of Marie (Felix's sister); Margareth's godmother; died 2025",                 role:"Cousine (maternal)", side:"maternal", parentId1:"ma1",  parentId2:null,   partnerId:"he1" },
  { id:"he1",  gen:3, seq:5, name:"Heinz",               birthYear:null, deathYear:null, notes:"Gabi's husband",                                                                        role:"Heinz (Gabi's Ehemann)", side:null,   parentId1:null,   parentId2:null,   partnerId:"ga1" },

  // ── gen 4: Phil's generation ──────────────────────────────────────────
  { id:"jo1",  gen:4, seq:0, name:"Johanna Mitterhofer", birthYear:1986, deathYear:null, notes:"Phil's older sister; born 1986",                                                        role:"Schwester",          side:"paternal", parentId1:"pa1",  parentId2:"pa2",  partnerId:"li1" },
  { id:"self", gen:4, seq:1, name:"Phil",                birthYear:1990, deathYear:null, notes:"Born 25 May 1990, Innichen / San Candido, South Tyrol",                                role:"You",                side:null,       parentId1:"pa1",  parentId2:"pa2",  partnerId:null  },
  { id:"li1",  gen:4, seq:2, name:"Liise",               birthYear:null, deathYear:null, notes:"Johanna's spouse",                                                                      role:"Liise (Johanna's spouse)", side:null,  parentId1:null,   parentId2:null,   partnerId:"jo1" },

  // ── gen 5: Next generation ────────────────────────────────────────────
  { id:"rub1", gen:5, seq:0, name:"Ruben",               birthYear:2018, deathYear:null, notes:"Johanna & Liise's son; born 29 October 2018; Phil's nephew",                           role:"Neffe (nephew)",     side:"paternal", parentId1:"jo1",  parentId2:"li1",  partnerId:null  },
];

// ── Tracks ───────────────────────────────────────────────────────────────────
const TRACK_DEFS = [
  { id:"self",       label:"Self / inner",           color:"#C9A227" },
  { id:"family",     label:"Family",                  color:"#E15554" },
  { id:"familyline", label:"Family: births & deaths", color:"#7B6545", derived:true },
  { id:"places",     label:"Places lived",            color:"#4A9E8A" },
  { id:"school",     label:"School",                  color:"#D98032" },
  { id:"vocation",   label:"Vocation",                color:"#1D9E75" },
  { id:"friends",    label:"Friends",                 color:"#3D9BE0" },
  { id:"love",       label:"Love",                    color:"#D4537E" },
  { id:"body",       label:"Body / practice",         color:"#7B4FB0" },
];

const BIRTH_YEAR = 1990;
const SEED_EVENTS = [

  // ─── SELF ─────────────────────────────────────────────────────────────
  { id:"s1",  year:1990, month:5, day:25,           track:"self",     title:"Born in Innichen",            note:"25 May 1990, Innichen / San Candido, South Tyrol" },
  { id:"s2",  year:2016,              track:"self",     title:"First acid trip",             note:"Bolsjefabrikken — first psychedelic experience" },
  { id:"s3",  year:2017,              track:"self",     title:"No stability / shame",        note:"Anxiety, no direction, drinking as coping" },
  { id:"s4",  year:2018,              track:"self",     title:"Mushroom ceremony",           note:"Femø — meeting Magnus, opening up" },
  { id:"s5",  year:2018,              track:"self",     title:"First gay sex",               note:"With Francisco — identity expanding" },
  { id:"s6",  year:2019,              track:"self",     title:"THE SEED",                    note:"Rooting begins — Borderland, community, kink practice" },
  { id:"s7",  year:2020,              track:"self",     title:"First tattoo",                note:"January 2020" },
  { id:"s8",  year:2021,              track:"self",     title:"Bornholm crisis",             note:"Suicidal / breaking point on trip with Skavankenborg" },
  { id:"s9",  year:2022,              track:"self",     title:"Super depressed",             note:"Post-Kim breakup — Portugal, then back to Italy" },
  { id:"s10", year:2025,              track:"self",     title:"Ayahuasca Skovsbo",           note:"February 2025 — deep ceremony" },
  { id:"s11", year:2026,              track:"self",     title:"Heldenreise",                 note:"March 2026 — hero's journey work" },

  // ─── FAMILY ────────────────────────────────────────────────────────────
  { id:"fm1", year:2018, month:10, day:29,            track:"family",   title:"Ruben born",                  note:"29 Oktober 2018" },
  { id:"fm2", year:2021,              track:"family",   title:"Trip to Teide",               note:"With parents — Tenerife" },
  { id:"fm3", year:2023,              track:"family",   title:"Mum breaks hip",              note:"Had to come back from Sweden" },
  { id:"fm4", year:2025,              track:"family",   title:"Parents visit CPH",           note:"June — trip to Møn, stay in Copenhagen" },
  { id:"fm5", year:2025,              track:"family",   title:"Palermo with Dad",            note:"October 2025" },
  { id:"fm6", year:2025,              track:"family",   title:"Cousin Lena, Venice",         note:"February 2025 — visiting cousin Lena" },

  // ─── PLACES ───────────────────────────────────────────────────────────
  { id:"pl1", year:1990, endYear:2009, track:"places",  title:"South Tyrol",                 note:"Born in Innichen, grew up in Terlan/Terlano area" },
  { id:"pl2", year:2009, endYear:2013, track:"places",  title:"Graz",                        note:"Geographie & Umweltsystemwissenschaften" },
  { id:"pl3", year:2013, endYear:2014, track:"places",  title:"Back to Terlan",              note:"Nach Terlan gezogen after bachelor" },
  { id:"pl4", year:2014, endYear:2015, track:"places",  title:"CPH — with Rolf",             note:"August 2014 — moving in with Rolf" },
  { id:"pl5", year:2015, endYear:2020, track:"places",  title:"CPH — Frederikssundsvej",     note:"Jan 2015 — Frederikssundsvej 94a, O'malley the cat" },
  { id:"pl6", year:2020, endYear:2021, track:"places",  title:"Femø",                        note:"January 2020 — first stint on Femø" },
  { id:"pl7", year:2021, endYear:2021, track:"places",  title:"Skavankenborg",               note:"February 2021 — communal living" },
  { id:"pl8", year:2021, endYear:2022, track:"places",  title:"Femø (Magnus)",               note:"July 2021 — back to Femø, living with Magnus" },
  { id:"pl9", year:2022, endYear:2022, track:"places",  title:"Eduardo's place",             note:"March 2022 — Copenhagen" },
  { id:"pl10",year:2022, endYear:2023, track:"places",  title:"Italy — family",              note:"October 2022 — moving back to Italy to recover" },
  { id:"pl11",year:2024, endYear:2024, track:"places",  title:"Saló, Lake Garda",            note:"April–August 2024" },
  { id:"pl12",year:2024, endYear:2024, track:"places",  title:"3-Zinnen hut",                note:"August 2024 — working at mountain hut" },
  { id:"pl13",year:2024, endYear:2025, track:"places",  title:"Vienna",                      note:"October 2024 — workshops, dating Alina & Miriam" },
  { id:"pl14",year:2024,              track:"places",  title:"Skovsbo / Denmark",            note:"December 2024 — moving back to Denmark" },
  { id:"pl15",year:2026,              track:"places",  title:"Copenhagen",                   note:"April 2026 — move to Copenhagen proper" },

  // ─── SCHOOL ───────────────────────────────────────────────────────────
  { id:"e2",  year:1993, endYear:1995, track:"school",  title:"Kindergarten",                note:"1993–1995, Innichen" },
  { id:"e3",  year:1996, endYear:2001, track:"school",  title:"Grundschule",                 note:"Sept 1996 – June 2001" },
  { id:"e4",  year:2001, endYear:2004, track:"school",  title:"Mittelschule",                note:"Sept 2001 – June 2004. Mobbing, loneliness" },
  { id:"e5",  year:2004, endYear:2009, track:"school",  title:"Oberschule",                  note:"Wissenschaftliches Lyzeum — Sept 2004 – June 2009" },
  { id:"e8",  year:2009, endYear:2012, track:"school",  title:"Uni Graz",                    note:"Geographie & Umweltsystemwissenschaften, Oct 2009–July 2012" },
  { id:"sc1", year:2013,              track:"school",  title:"Bachelorarbeit",               note:"Bachelor thesis submitted" },
  { id:"e11", year:2014, endYear:2016, track:"school",  title:"Uni CPH",                     note:"Master's degree Copenhagen, Aug 2014–2016" },
  { id:"e12", year:2016,              track:"school",  title:"Graduation",                   note:"Master's, Copenhagen" },

  // ─── VOCATION ─────────────────────────────────────────────────────────
  { id:"v1",  year:2013,              track:"vocation", title:"Caorle Caritas",              note:"Kinderbetreuung — Caritas children's work" },
  { id:"v2",  year:2014,              track:"vocation", title:"EURAC Internship",            note:"Research internship, Bolzano" },
  { id:"v3",  year:2015,              track:"vocation", title:"EuroEnviro Gothenburg",       note:"May 2015 — conference" },
  { id:"v4",  year:2016,              track:"vocation", title:"Fieldwork Cambodia",          note:"March 2016 — academic fieldwork" },
  { id:"v5",  year:2017,              track:"vocation", title:"Internship Creature",         note:"February 2017" },
  { id:"v6",  year:2017,              track:"vocation", title:"Internship Incita",           note:"April 2017" },
  { id:"v7",  year:2017,              track:"vocation", title:"Dare to Eat",                 note:"May 2017 — internship + Heartland festival" },
  { id:"v8",  year:2017, endYear:2019, track:"vocation", title:"Villa Kultur / Foodsharing", note:"Nov 2017 — working Villa Kultur, Foodsharing CPH" },
  { id:"v9",  year:2019,              track:"vocation", title:"Ca'cucina",                   note:"May 2019 — working at restaurant" },
  { id:"v10", year:2022, endYear:2022, track:"vocation", title:"Radio Depot",                note:"March–May 2022 — stopped, extremely anxious" },
  { id:"v11", year:2024,              track:"vocation", title:"Conscious Bondage",           note:"March 2024 — hosted for first time with Lea" },
  { id:"v12", year:2025,              track:"vocation", title:"Softer Dating launch",        note:"April 2025 — first event at Lighthouse (Penelope)" },
  { id:"v13", year:2025,              track:"vocation", title:"Conscious Bondage Bruneck",   note:"October 2025 — Bliss festival workshops" },
  { id:"v14", year:2026,              track:"vocation", title:"Soft Kink rope WS",           note:"February 2026 — first at Gefions Hjerte" },
  { id:"v15", year:2026,              track:"vocation", title:"Meeting Karen",               note:"April 2026 — Softer Dating collaborator" },

  // ─── FRIENDS ─────────────────────────────────────────────────────────
  { id:"f1",  year:2012,              track:"friends",  title:"Boston trip w/ Nadia",        note:"2012 — trip together" },
  { id:"f2",  year:2015,              track:"friends",  title:"People's Kitchen",            note:"June 2015 — Shan, Elias, Thomas, Celine" },
  { id:"f3",  year:2015,              track:"friends",  title:"Ant moves in",                note:"October 2015" },
  { id:"f4",  year:2017,              track:"friends",  title:"Portugal with Ant",           note:"January 2017" },
  { id:"f5",  year:2017,              track:"friends",  title:"Meeting Ewa",                 note:"November 2017 — later married Magnus" },
  { id:"f6",  year:2017,              track:"friends",  title:"Electric Castle Romania",     note:"July 2017 — festival" },
  { id:"f7",  year:2018,              track:"friends",  title:"Wedding Magnus & Ewa",        note:"June 2018" },
  { id:"f8",  year:2018,              track:"friends",  title:"First Borderland",            note:"July 2018 — transformative. Meeting Magnus, Synamon" },
  { id:"f9",  year:2019,              track:"friends",  title:"2nd Borderland",              note:"July 2019 — re-connect" },
  { id:"f10", year:2019,              track:"friends",  title:"Burning Boat",                note:"October 2019 — meeting Denis and Livia" },
  { id:"f11", year:2020,              track:"friends",  title:"Moomin Island",               note:"July 2020 — first Moomin Island" },
  { id:"f12", year:2021,              track:"friends",  title:"First Angsbacka",             note:"June 2021 — short summer" },
  { id:"f13", year:2022,              track:"friends",  title:"Angsbacka full summer",       note:"June 2022 — meeting Nova, Lilja, Cecilie" },
  { id:"f14", year:2022,              track:"friends",  title:"Visiting Zizi, Portugal",     note:"October 2022 — 2 months, very tough" },
  { id:"f15", year:2023,              track:"friends",  title:"Meeting Sofia",               note:"June 2023 — Angsbacka" },
  { id:"f16", year:2023,              track:"friends",  title:"Best hike with Ida",          note:"August 2023 — Sweden" },
  { id:"f17", year:2023,              track:"friends",  title:"Meeting Denis in Italy",      note:"January 2023 — bondage workshop, meeting Lea" },
  { id:"f18", year:2024,              track:"friends",  title:"Borderland / Moomins",        note:"July 2024" },
  { id:"f19", year:2025,              track:"friends",  title:"Borderland Secret Garden",    note:"July 2025 — Kir, Thuy" },
  { id:"f20", year:2025,              track:"friends",  title:"Wedding Rune & Maria",        note:"August 2025" },
  { id:"f21", year:2025,              track:"friends",  title:"Mayburn",                     note:"May 2025" },
  { id:"f22", year:2025,              track:"friends",  title:"Summer party Vindhøj",        note:"June 2025" },

  // ─── LOVE ─────────────────────────────────────────────────────────────
  { id:"l1",  year:2007, endYear:2015, track:"love",    title:"Nadia",                       note:"Met 2007 — 8 years together. Breakup 30 Sept 2015" },
  { id:"l2",  year:2015, month:9, day:30,            track:"love",    title:"Breakup Nadia",                note:"30 September 2015 — 8 years ending" },
  { id:"l3",  year:2015, endYear:2016, track:"love",    title:"Maddie",                      note:"December 2015 – June 2016" },
  { id:"l4",  year:2016, endYear:2016, track:"love",    title:"My",                          note:"June – November 2016" },
  { id:"l5",  year:2017,              track:"love",    title:"Linh Lee",                     note:"April 2017" },
  { id:"l6",  year:2017, endYear:2018, track:"love",    title:"Titt",                        note:"October 2017 – July 2018" },
  { id:"l7",  year:2018, endYear:2019, track:"love",    title:"Synamon",                     note:"October 2018 – July 2019" },
  { id:"l8",  year:2019, endYear:2020, track:"love",    title:"Livia",                       note:"October 2019 – January 2020" },
  { id:"l9",  year:2020, endYear:2021, track:"love",    title:"Louise",                      note:"January 2020 – April 2021" },
  { id:"l10", year:2021,              track:"love",    title:"Breakup Louise",               note:"April 2021" },
  { id:"l11", year:2021, endYear:2022, track:"love",    title:"Kim",                         note:"September 2021 – September 2022" },
  { id:"l12", year:2022,              track:"love",    title:"Breakup Kim",                  note:"September 2022 — EXTREMELY DIFFICULT" },
  { id:"l13", year:2023, endYear:2025, track:"love",    title:"Lea",                         note:"January 2023 – December 2025 — Conscious Bondage partner" },
  { id:"l14", year:2023, endYear:2024, track:"love",    title:"Ida",                         note:"March 2023 – March 2024" },
  { id:"l15", year:2024,              track:"love",    title:"Breakup Ida",                  note:"March 2024" },
  { id:"l16", year:2024, endYear:2025, track:"love",    title:"Miriam",                      note:"October 2024 – early 2025" },
  { id:"l17", year:2025,              track:"love",    title:"Meeting Sarha",                note:"April 2025 — completely and utterly falling in love" },
  { id:"l18", year:2025,              track:"love",    title:"Kir",                          note:"July 2025 — Borderland Secret Garden" },
  { id:"l19", year:2025,              track:"love",    title:"Emma (lover)",                 note:"September 2025" },
  { id:"l20", year:2025,              track:"love",    title:"Kat",                          note:"November 2025 — Skovsbo Aya retreat" },
  { id:"l21", year:2025,              track:"love",    title:"Breakup Lea",                  note:"December 2025 — end of long partnership" },
  { id:"l22", year:2026,              track:"love",    title:"Ása",                          note:"May 2026" },

  // ─── BODY / PRACTICE ──────────────────────────────────────────────────
  { id:"b1",  year:2004,              track:"body",    title:"Drinking begins",              note:"Alcohol through Oberschule and Uni years — numbing" },
  { id:"b2",  year:2017,              track:"body",    title:"First Shibari",               note:"October 2017 — ropes, classes, kink practice begins" },
  { id:"b3",  year:2020,              track:"body",    title:"Fire staff",                   note:"December 2020 — starting fire practice" },
  { id:"b4",  year:2021,              track:"body",    title:"First Sacred Kink",            note:"September 2021 — embodied kink practice deepens" },
  { id:"b5",  year:2026,              track:"body",    title:"Started climbing",             note:"April 2026 — Copenhagen Boulders" },
  { id:"b6",  year:2026,              track:"body",    title:"Own guitar",                   note:"April 2026 — getting own guitar, somatic approach" },
];


const uid = () => Math.random().toString(36).slice(2, 9);

// ── Simple storage (localStorage only — clean, no backend needed for personal use) ──
const store = {
  load: key => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
  save: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};
// Claude artifact fallback (when running inside Claude.ai)
const claudeStore = typeof window !== "undefined" && window.storage ? window.storage : null;

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Convert event date fields → fractional year for precise x-axis positioning
// e.g. 25 May 1990 → 1990.392
const dateToFY = (year, month, day) => {
  let fy = year || 0;
  if (month) fy += (month - 1) / 12;
  if (day)   fy += (day - 1) / 365.25;
  return fy;
};

// Format a date as "25 May 1990", "May 1990", or "1990"
const formatDate = (year, month, day) => {
  if (!year) return "";
  if (day && month)  return `${day} ${MONTHS_SHORT[month-1]} ${year}`;
  if (month)         return `${MONTHS_SHORT[month-1]} ${year}`;
  return `${year}`;
};

// Exact age at an event (accounts for May 25 birthday)
const ageAt = (year, month, day, birthYear=BIRTH_YEAR) => {
  let age = year - birthYear;
  if (month) {
    if (month < 5) age--;
    else if (month === 5 && day && day < 25) age--;
  }
  return Math.max(0, age);
};

// Parse typed date string → {year, month, day} | null (empty) | false (invalid)
// Accepts: "YYYY", "MM/YYYY", "DD/MM/YYYY"
// Also accepts - and . as separators, and missing leading zeros
const parseDate = (str) => {
  const s = (str || "").trim();
  if (!s) return null;                          // empty → no date, fine

  // DD/MM/YYYY (or DD-MM-YYYY, DD.MM.YYYY)
  const dmy = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (dmy) {
    const d = +dmy[1], mo = +dmy[2], y = +dmy[3];
    return (mo >= 1 && mo <= 12 && d >= 1 && d <= 31 && y >= 1800 && y <= 2100)
      ? { day: d, month: mo, year: y } : false;
  }
  // MM/YYYY (or MM-YYYY)
  const my = s.match(/^(\d{1,2})[\/\-\.](\d{4})$/);
  if (my) {
    const mo = +my[1], y = +my[2];
    return (mo >= 1 && mo <= 12 && y >= 1800 && y <= 2100)
      ? { day: null, month: mo, year: y } : false;
  }
  // YYYY
  const yr = s.match(/^(\d{4})$/);
  if (yr) {
    const y = +yr[1];
    return (y >= 1800 && y <= 2100) ? { day: null, month: null, year: y } : false;
  }

  return false; // unrecognized format
};

// Convert {year, month, day} → the input string format (for modal initialisation)
const formatDateInput = (year, month, day) => {
  if (!year) return "";
  if (day && month)
    return `${String(day).padStart(2,"0")}/${String(month).padStart(2,"0")}/${year}`;
  if (month)
    return `${String(month).padStart(2,"0")}/${year}`;
  return `${year}`;
};

// ── Tree layout: pure functions ──
function computeLayout(people, svgW = 920) {
  const MARGIN = 72, available = svgW - MARGIN - 12;
  const genMap = {};
  people.forEach(p => { if (!genMap[p.gen]) genMap[p.gen] = []; genMap[p.gen].push(p); });
  Object.values(genMap).forEach(g => g.sort((a, b) => {
    if (a.side !== b.side) { if (a.side === "paternal") return -1; if (b.side === "paternal") return 1; }
    return (a.seq || 0) - (b.seq || 0);
  }));
  const pos = {};
  Object.entries(genMap).forEach(([, group]) => {
    const n = group.length;
    const nw = Math.max(64, Math.min(96, available / n - 8));
    group.forEach((p, i) => {
      const x = n === 1 ? svgW / 2 : MARGIN + (i / (n - 1)) * (available - nw) + nw / 2;
      pos[p.id] = { x, nw };
    });
  });
  return pos;
}
function computeGenY(people, nodeH = 56, gap = 130) {
  const gens = [...new Set(people.map(p => p.gen))].sort((a, b) => a - b); // ascending: gen 0 (oldest) at top
  const genY = {};
  gens.forEach((g, i) => { genY[g] = 80 + i * (nodeH + gap); });
  return genY;
}

// ════════════════════════════════════════════════════════════════
// APP

// ════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════
export default function App() {
  const [events,       setEvents]       = useState(SEED_EVENTS);
  const [familyData,   setFamilyData]   = useState(FAMILY_DEFAULT);
  const [activeTracks, setActiveTracks] = useState(TRACK_DEFS.map(t => t.id));
  const [view,         setView]         = useState("timeline");
  const [search,       setSearch]       = useState("");
  const [editing,      setEditing]      = useState(null);
  const [adding,       setAdding]       = useState(false);
  const [hoverEvent,   setHoverEvent]   = useState(null);
  const [zoom,         setZoom]         = useState(1);
  const [scrollLeft,   setScrollLeft]   = useState(0);
  const [loaded,       setLoaded]       = useState(false);
  const [famLoaded,    setFamLoaded]    = useState(false);
  const chartContainerRef = useRef(null);

  const currentYear = 2026, minYear = BIRTH_YEAR, maxYear = currentYear + 2;

  // ── Load ──
  useEffect(() => {
    (async () => {
      try {
        if (claudeStore) { try { const r = await claudeStore.get("tl-v6"); if (r?.value) { const p=JSON.parse(r.value); if(Array.isArray(p)&&p.length){setEvents(p);setLoaded(true);return;} } } catch {} }
        const p = store.load("tl-v6"); if (Array.isArray(p) && p.length) setEvents(p);
      } catch {} finally { setLoaded(true); }
    })();
  }, []);
  useEffect(() => {
    if (!loaded) return;
    store.save("tl-v6", events);
    if (claudeStore) try { claudeStore.set("tl-v6", JSON.stringify(events)); } catch {}
  }, [events, loaded]);

  useEffect(() => {
    (async () => {
      try {
        if (claudeStore) { try { const r = await claudeStore.get("fam-v3"); if (r?.value) { const p=JSON.parse(r.value); if(Array.isArray(p)&&p.length){setFamilyData(p);setFamLoaded(true);return;} } } catch {} }
        const p = store.load("fam-v3"); if (Array.isArray(p) && p.length) setFamilyData(p);
      } catch {} finally { setFamLoaded(true); }
    })();
  }, []);
  useEffect(() => {
    if (!famLoaded) return;
    store.save("fam-v3", familyData);
    if (claudeStore) try { claudeStore.set("fam-v3", JSON.stringify(familyData)); } catch {}
  }, [familyData, famLoaded]);

  // ── Family births & deaths track (auto-derived from familyData) ──
  const familyLineEvents = useMemo(() => {
    const out = [];
    familyData.forEach(p => {
      if (!p.name) return;
      if (p.birthYear) out.push({ id:`fb_${p.id}`, year:p.birthYear, track:"familyline", title:p.name, note:`${p.role} — born ${p.birthYear}`, _type:"birth" });
      if (p.deathYear) out.push({ id:`fd_${p.id}`, year:p.deathYear, track:"familyline", title:p.name, note:`${p.role} — died ${p.deathYear}`, _type:"death" });
    });
    return out.sort((a,b) => a.year - b.year);
  }, [familyData]);

  // ── Zoom ──
  const BASE_W = 920, MIN_ZOOM = 1, MAX_ZOOM = 20;
  const totalW = Math.round(BASE_W * zoom);
  const yearToX = (yr, w) => ((yr - minYear) / (maxYear - minYear)) * (w - 120) + 80;
  const pxPerYear = (totalW - 120) / (maxYear - minYear);
  const tickStep = pxPerYear > 60 ? 1 : pxPerYear > 25 ? 2 : pxPerYear > 12 ? 5 : 10;
  const maxChars = Math.max(13, Math.min(50, Math.floor(pxPerYear / 5.5)));
  const MIN_GAP  = 100;

  const handleZoom = useCallback((nz) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nz));
    const c = chartContainerRef.current;
    if (c) {
      const frac = (c.scrollLeft + c.clientWidth / 2) / (BASE_W * zoom);
      setZoom(clamped);
      requestAnimationFrame(() => { if (chartContainerRef.current) chartContainerRef.current.scrollLeft = frac * BASE_W * clamped - c.clientWidth / 2; });
    } else setZoom(clamped);
  }, [zoom]);
  const handleWheel = useCallback((e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); handleZoom(zoom + (e.deltaY > 0 ? -0.5 : 0.5)); } }, [zoom, handleZoom]);
  const handleScroll = useCallback((e) => setScrollLeft(e.target.scrollLeft), []);

  const visibleTracks = TRACK_DEFS.filter(t => activeTracks.includes(t.id));
  const trackRowH = zoom < 2 ? 44 : 112;
  const chartW = totalW, chartH = 80 + visibleTracks.length * trackRowH + 48;
  const sortedEvents = useMemo(() => [...events].sort((a,b) => a.year - b.year), [events]);

  const toggleTrack = id => setActiveTracks(p => p.includes(id) ? p.filter(t=>t!==id) : [...p,id]);
  const saveEvent = ev => {
    if (ev.id && events.some(e=>e.id===ev.id)) setEvents(p=>p.map(e=>e.id===ev.id?ev:e));
    else setEvents(p=>[...p,{...ev,id:uid()}]);
    setEditing(null); setAdding(false);
  };
  const deleteEvent = id => { setEvents(p=>p.filter(e=>e.id!==id)); setEditing(null); };

  // ── Search filter ──
  const searchQ = search.trim().toLowerCase();
  const matches = useCallback(e => {
    if (!searchQ) return true;
    return (e.title||"").toLowerCase().includes(searchQ) || (e.note||"").toLowerCase().includes(searchQ);
  }, [searchQ]);

  return (
    <div style={S.page}>
      <style>{CSS}</style>
      <header style={S.header}>
        <h1 style={S.h1}>Timeline</h1>
        <span style={{ fontSize:11, color:"#c4c0b6", marginLeft:8, alignSelf:"flex-end", paddingBottom:4 }}>v4 · Jun 2026</span>
        <div style={S.tabs}>
          {[["timeline","Timeline"],["family","Family"]].map(([id,label])=>(
            <button key={id} onClick={()=>setView(id)} style={{...S.tab,...(view===id?S.tabActive:{})}}>{label}</button>
          ))}
        </div>
      </header>

      {view === "family" && (
        <FamilyPage familyData={familyData} setFamilyData={setFamilyData}
          onReset={()=>{ if(window.confirm("Reset family tree?")) setFamilyData(FAMILY_DEFAULT); }} />
      )}

      {view === "timeline" && (
        <div className="fade-in">
          {/* ── Search ── */}
          <div style={S.searchBar}>
            <span style={{fontSize:16}}>🔍</span>
            <input style={S.searchInput} value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search events by title or note…" />
            {search && <button style={S.searchClear} onClick={()=>setSearch("")}>×</button>}
            {searchQ && <span style={{fontSize:12,color:"#a39f95"}}>
              {[...sortedEvents,...familyLineEvents].filter(matches).length} results
            </span>}
          </div>

          {/* ── Tracks ── */}
          <div style={S.trackToggles}>
            {TRACK_DEFS.map(t=>{ const on=activeTracks.includes(t.id); return (
              <button key={t.id} onClick={()=>toggleTrack(t.id)}
                style={{...S.trackToggle,borderColor:t.color,background:on?t.color:"transparent",color:on?"#fff":"#6b6a64",opacity:on?1:0.5}}>
                <span style={{...S.trackDot,background:on?"#fff":t.color}}/>{t.label}
              </button>
            );})}
            <button onClick={()=>setAdding(true)} style={S.addBtn}>+ Add event</button>
            <button onClick={()=>{ if(window.confirm("Reset events?")) setEvents(SEED_EVENTS); }} style={S.resetBtn}>Reset</button>
          </div>

          {/* ── Zoom ── */}
          <div style={S.zoomBar}>
            <span style={S.zoomLabel}>Zoom</span>
            <button style={S.zoomBtn} onClick={()=>handleZoom(zoom-0.5)} disabled={zoom<=MIN_ZOOM}>−</button>
            {[1,2,3,5,8,12,20].map(z=>(
              <button key={z} onClick={()=>handleZoom(z)} style={{...S.zoomPreset,...(Math.abs(zoom-z)<0.3?S.zoomPresetActive:{})}}>{z}×</button>
            ))}
            <button style={S.zoomBtn} onClick={()=>handleZoom(zoom+0.5)} disabled={zoom>=MAX_ZOOM}>+</button>
            <input type="range" min={MIN_ZOOM} max={MAX_ZOOM} step="0.5" value={zoom}
              onChange={e=>handleZoom(parseFloat(e.target.value))}
              style={{flex:1,minWidth:60,maxWidth:160,accentColor:"#C9A227",cursor:"pointer"}}/>
            <span style={{fontSize:12,color:"#a39f95",minWidth:36}}>{zoom.toFixed(zoom%1===0?0:1)}×</span>
          </div>
          {zoom < 2 && (
            <div style={{fontSize:12,color:"#a39f95",textAlign:"right",marginBottom:4}}>
              Overview at 1×. Zoom to{" "}
              <button onClick={()=>handleZoom(2)} style={{background:"none",border:"none",color:"#C9A227",cursor:"pointer",fontSize:12,fontWeight:700,padding:"0 2px",textDecoration:"underline"}}>2×</button>
              {" "}to read labels.
            </div>
          )}

          {/* ── Chart ── */}
          <section style={S.chartWrap}>
            <div ref={chartContainerRef} onScroll={handleScroll} onWheel={handleWheel}
              style={{overflowX:"auto",overflowY:"hidden"}}>
              <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{width:chartW,height:chartH,display:"block"}}>

                {/* year grid */}
                {Array.from({length:Math.floor((maxYear-minYear)/tickStep)+2},(_,i)=>{
                  const yr=minYear+i*tickStep; if(yr>maxYear) return null;
                  return <line key={"g"+yr} x1={yearToX(yr,chartW)} y1={20} x2={yearToX(yr,chartW)} y2={chartH-32} stroke="#2b2b28" strokeWidth="0.8" opacity="0.06"/>;
                })}

                {/* stage bands */}
                {[{age:"0–1½",name:"Infancy",c:"#C9A227"},{age:"1½–3",name:"Early childhood",c:"#D98032"},{age:"3–6",name:"Play age",c:"#E15554"},{age:"6–12",name:"School age",c:"#7B4FB0"},{age:"12–18",name:"Adolescence",c:"#3D9BE0"},{age:"18–35",name:"Young adulthood",c:"#1D9E75"},{age:"35–65",name:"Adulthood",c:"#D4537E"}].map(st=>{
                  const [lo,hi]=st.age.replace("+","-90").split("–").map(s=>parseFloat(s));
                  const y0=BIRTH_YEAR+lo, y1=BIRTH_YEAR+(isNaN(hi)?90:hi);
                  if(y0>maxYear) return null;
                  const x0=yearToX(Math.max(y0,minYear),chartW), x1v=yearToX(Math.min(y1,maxYear),chartW);
                  return (
                    <g key={st.name}>
                      <rect x={x0} y={20} width={Math.max(0,x1v-x0)} height={chartH-52} fill={st.c} opacity="0.05"/>
                      <rect x={x0} y={20} width={1.5} height={chartH-52} fill={st.c} opacity="0.35"/>
                      {(x1v-x0)>80 && <text x={Math.max(x0,scrollLeft)+6} y={34} style={{fontSize:10,fill:st.c,fontWeight:600}}>{st.name}</text>}
                    </g>
                  );
                })}

                {/* year axis */}
                {Array.from({length:Math.floor((maxYear-minYear)/tickStep)+2},(_,i)=>{
                  const yr=minYear+i*tickStep; if(yr>maxYear) return null;
                  return (
                    <g key={"ax"+yr}>
                      <text x={yearToX(yr,chartW)} y={chartH-14} style={{fontSize:9.5,fill:"#999",textAnchor:"middle"}}>{yr}</text>
                      {tickStep<=5 && <text x={yearToX(yr,chartW)} y={chartH-3} style={{fontSize:7,fill:"#c4c0b6",textAnchor:"middle"}}>({yr-BIRTH_YEAR})</text>}
                    </g>
                  );
                })}

                {/* now line */}
                <line x1={yearToX(currentYear,chartW)} y1={20} x2={yearToX(currentYear,chartW)} y2={chartH-32} stroke="#2b2b28" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
                <text x={yearToX(currentYear,chartW)+5} y={34} style={{fontSize:10,fill:"#2b2b28",fontWeight:700}}>now</text>

                {/* track lanes */}
                {visibleTracks.map((track,i)=>{
                  const y = 80 + i*trackRowH + trackRowH/2;
                  const isDerived = track.derived;
                  const te = isDerived
                    ? familyLineEvents
                    : sortedEvents.filter(e=>e.track===track.id);

                  // stagger for non-derived tracks
                  const bars = te.filter(e=>e.endYear&&e.endYear>e.year);
                  const placed = [];
                  bars.forEach(e=>{
                    const bx1=yearToX(dateToFY(e.year,e.month,e.day),chartW), bx2=yearToX(dateToFY(e.endYear,e.endMonth,e.endDay),chartW);
                    for(let bx=bx1;bx<=bx2;bx+=MIN_GAP/2) placed.push({x:bx,side:"below"});
                  });
                  const slots = te.map(e=>{
                    if(e.endYear&&e.endYear>e.year) return {side:"above",level:0,isRange:true};
                    const x=yearToX(dateToFY(e.year,e.month||undefined,e.day||undefined),chartW);
                    const col=side=>placed.some(p=>p.side===side&&Math.abs(p.x-x)<MIN_GAP);
                    let side,level;
                    if(!col("above")){side="above";level=0;}
                    else if(!col("below")){side="below";level=0;}
                    else{const a=placed.filter(p=>p.side==="above"&&Math.abs(p.x-x)<MIN_GAP).length,bv=placed.filter(p=>p.side==="below"&&Math.abs(p.x-x)<MIN_GAP).length;side=a<=bv?"above":"below";level=1;}
                    placed.push({x,side});
                    return {side,level,isRange:false};
                  });

                  const BAR_H=18, labelX=scrollLeft+8;
                  return (
                    <g key={track.id}>
                      <line x1={70} y1={y} x2={chartW-30} y2={y} stroke={track.color} strokeWidth="2" opacity="0.2"/>
                      {te.filter(e=>!e.endYear||e.endYear<=e.year).length>1 && (
                        <path d={te.filter(e=>!e.endYear||e.endYear<=e.year).map((e,idx)=>`${idx===0?"M":"L"} ${yearToX(dateToFY(e.year,e.month||undefined,e.day||undefined),chartW)} ${y}`).join(" ")}
                          fill="none" stroke={track.color} strokeWidth="1.5" opacity="0.25"/>
                      )}
                      <rect x={labelX} y={y-9} width={isDerived?152:96} height={18} rx={4} fill="#faf8f3" opacity="0.92"/>
                      <text x={labelX+4} y={y+4} style={{fontSize:11,fill:track.color,fontWeight:700}}>{track.label}</text>

                      {te.map((e,idx)=>{
                        const isHov=hoverEvent===e.id;
                        const dim = searchQ && !matches(e);
                        const {side,level,isRange}=slots[idx];

                        // ── Family line dots (birth/death special rendering) ──
                        if(isDerived){
                          const ex=yearToX(dateToFY(e.year),chartW);
                          const isDeath=e._type==="death";
                          const dotColor=isDeath?"#7B7268":track.color;
                          const titleY=isDeath?y+22:y-12;
                          const shortName=e.title.split(" ")[0]; // first name only
                          return (
                            <g key={e.id} style={{cursor:"default"}} opacity={dim?0.1:1}
                              onMouseEnter={()=>setHoverEvent(e.id)} onMouseLeave={()=>setHoverEvent(null)}>
                              {isDeath
                                ? <text x={ex} y={y+1} style={{fontSize:11,fill:dotColor,textAnchor:"middle",dominantBaseline:"central"}}>†</text>
                                : <circle cx={ex} cy={y} r={isHov?6:4} fill={dotColor} stroke="#fff" strokeWidth="1.5"/>
                              }
                              {zoom>=2 && <text x={ex} y={titleY} style={{fontSize:8.5,fill:dotColor,textAnchor:"middle",fontWeight:600}}>{shortName} {e.year}</text>}
                              {isHov && (
                                <g>
                                  <rect x={ex-95} y={y+(isDeath?28:-52)} width={190} height={28} rx={5} fill="#1a1814" opacity="0.96"/>
                                  <text x={ex} y={y+(isDeath?42:-38)} style={{fontSize:9.5,fill:"#C9A227",textAnchor:"middle",fontWeight:700}}>{e.note}</text>
                                </g>
                              )}
                            </g>
                          );
                        }

                        // ── Range bar ──
                        if(isRange){
                          const x1=yearToX(dateToFY(e.year,e.month,e.day),chartW), x2=yearToX(dateToFY(e.endYear,e.endMonth,e.endDay),chartW);
                          const barW=Math.max(x2-x1,10), cx=(x1+x2)/2, dur=e.endYear-e.year;
                          const wide=barW>55;
                          const tstr=e.title.length>maxChars?e.title.slice(0,maxChars-1)+"…":e.title;
                          return (
                            <g key={e.id} style={{cursor:"pointer"}} opacity={dim?0.1:1}
                              onClick={()=>setEditing(e)} onMouseEnter={()=>setHoverEvent(e.id)} onMouseLeave={()=>setHoverEvent(null)}>
                              <rect x={x1} y={y-BAR_H/2} width={barW} height={BAR_H} rx={5} fill={track.color} opacity={isHov?0.55:0.28} stroke={track.color} strokeWidth={isHov?2:1}/>
                              <line x1={x1} y1={y-BAR_H/2+2} x2={x1} y2={y+BAR_H/2-2} stroke={track.color} strokeWidth="2.5" strokeLinecap="round"/>
                              {e.endYear<maxYear && <line x1={x2} y1={y-BAR_H/2+2} x2={x2} y2={y+BAR_H/2-2} stroke={track.color} strokeWidth="2.5" strokeLinecap="round"/>}
                              {wide?<text x={cx} y={y+1} style={{fontSize:9.5,fill:track.color,textAnchor:"middle",dominantBaseline:"central",fontWeight:700}}>{tstr}</text>
                                   :zoom>=2&&<text x={cx} y={y-BAR_H/2-5} style={{fontSize:9,fill:"#2b2b28",textAnchor:"middle",fontWeight:500}}>{tstr}</text>}
                              {zoom>=2&&<text x={cx} y={y+BAR_H/2+11} style={{fontSize:7.5,fill:"#a39f95",textAnchor:"middle"}}>
                                {formatDate(e.year,e.month,e.day)}–{formatDate(e.endYear,e.endMonth,e.endDay)} · {dur}yr · age {ageAt(e.year,e.month,e.day)}–{ageAt(e.endYear,e.endMonth,e.endDay)}
                              </text>}
                              {isHov&&(<g>
                                <rect x={cx-110} y={y+BAR_H/2+15} width={220} height={30} rx={6} fill="#1a1814" opacity="0.97"/>
                                <text x={cx} y={y+BAR_H/2+25} style={{fontSize:10,fill:"#C9A227",textAnchor:"middle",fontWeight:700}}>{e.title}</text>
                                {e.note&&<text x={cx} y={y+BAR_H/2+39} style={{fontSize:8.5,fill:"#ccc",textAnchor:"middle"}}>{e.note.length>50?e.note.slice(0,48)+"…":e.note}</text>}
                              </g>)}
                            </g>
                          );
                        }

                        // ── Point dot ──
                        const x=yearToX(dateToFY(e.year,e.month||undefined,e.day||undefined),chartW);
                        const dir=side==="above"?-1:1, base=dir*(16+level*26);
                        const titleY=y+base+(side==="above"?-10:16), dateY=titleY+(side==="above"?-12:13);
                        const tit=e.title.length>maxChars?e.title.slice(0,maxChars-1)+"…":e.title;
                        return (
                          <g key={e.id} style={{cursor:"pointer"}} opacity={dim?0.1:1}
                            onClick={()=>setEditing(e)} onMouseEnter={()=>setHoverEvent(e.id)} onMouseLeave={()=>setHoverEvent(null)}>
                            {level>0&&<line x1={x} y1={y} x2={x} y2={y+base} stroke={track.color} strokeWidth="0.75" opacity="0.4"/>}
                            <circle cx={x} cy={y} r={isHov?8:5.5} fill={track.color} stroke="#fff" strokeWidth="2"/>
                            {zoom>=2&&<>
                              <text x={x} y={titleY} style={{fontSize:10.5,fill:"#2b2b28",textAnchor:"middle",fontWeight:isHov?700:500}}>{tit}</text>
                              <text x={x} y={dateY} style={{fontSize:8.5,fill:"#a39f95",textAnchor:"middle"}}>({formatDate(e.year,e.month,e.day)} · age {ageAt(e.year,e.month,e.day)})</text>
                            </>}
                            {isHov&&(<g>
                              <rect x={x-110} y={dateY+(side==="above"?-36:5)} width={220} height={30} rx={6} fill="#1a1814" opacity="0.97"/>
                              <text x={x} y={dateY+(side==="above"?-22:18)} style={{fontSize:10,fill:"#C9A227",textAnchor:"middle",fontWeight:700}}>{e.title}</text>
                              {e.note&&<text x={x} y={dateY+(side==="above"?-10:30)} style={{fontSize:8.5,fill:"#ccc",textAnchor:"middle"}}>{e.note.length>50?e.note.slice(0,48)+"…":e.note}</text>}
                            </g>)}
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>
          <p style={S.footnote}>Hover any event for details. Zoom 2× or higher to read labels. Ctrl+scroll to zoom.</p>
        </div>
      )}

      {(editing||adding)&&(
        <EventModal event={editing} tracks={TRACK_DEFS.filter(t=>!t.derived)} minYear={minYear} maxYear={maxYear} birthYear={BIRTH_YEAR}
          onSave={saveEvent} onDelete={editing?deleteEvent:null}
          onClose={()=>{setEditing(null);setAdding(false);}}/>
      )}
    </div>
  );
}

function FamilyPage({ familyData, setFamilyData, onReset }) {
  const [openEvent,    setOpenEvent]    = useState(null);
  const [editPerson,   setEditPerson]   = useState(null);
  const [addingPerson, setAddingPerson] = useState(false);
  const [addingConnection, setAddingConnection] = useState(null); // { person, relType }
  const [hoverP,       setHoverP]       = useState(null);
  const [hoverH,       setHoverH]       = useState(null);
  const [histMode,     setHistMode]     = useState("regional"); // "regional" | "pustertal"

  const SVG_W = 920;
  const allHistEvents = histMode === "pustertal"
    ? [...HISTORY_EVENTS, ...PUSTERTAL_EVENTS].sort((a,b) => a.year - b.year)
    : HISTORY_EVENTS;

  // history strip year range
  const H_Y1 = histMode === "pustertal" ? 700 : 1860;
  const H_Y2 = 2015;
  const hx = yr => 42 + (yr - H_Y1) / (H_Y2 - H_Y1) * (SVG_W - 84);

  // 4-tier label placement with showLabel flag for dense events
  const histSlots = useMemo(() => {
    const MIN = histMode === "pustertal" ? 54 : 70;
    // first pass: assign tiers greedily
    const TIERS = [0, 2, 1, 3];
    const placed = [];
    const slots = allHistEvents.map(ev => {
      const x = hx(ev.year);
      const col = tier => placed.some(p => p.tier === tier && Math.abs(p.x - x) < MIN);
      const tier = TIERS.find(t => !col(t)) ?? 99; // 99 = no slot available
      placed.push({ x, tier });
      return { x, tier, id: ev.id, showLabel: tier < 4 };
    });
    return slots;
  }, [allHistEvents, histMode]);

  // tree layout
  const NODE_H = 56;
  const { positions, genY, svgH } = useMemo(() => {
    const positions = computeLayout(familyData, SVG_W);
    const genY = computeGenY(familyData, NODE_H, 130);
    const gens = [...new Set(familyData.map(p => p.gen))].sort((a,b) => a-b);
    const svgH = 80 + gens.length * (NODE_H + 130) + 60;
    return { positions, genY, svgH };
  }, [familyData]);

  const sideCol = side => side === "paternal" ? "#D98032" : side === "maternal" ? "#3D9BE0" : "#C9A227";
  const genLabel = gen => {
    const labels = {
      0:"Great-great-grandparents",
      1:"Great-grandparents",
      2:"Grandparents & their siblings",
      3:"Parents, aunts & uncles",
      4:"You / siblings",
      5:"Children & nephews",
    };
    return labels[gen] || `Generation ${gen > 5 ? "+" + (gen-4) : gen}`;
  };

  // connectors
  const connectors = useMemo(() => {
    const out = [];
    familyData.forEach(person => {
      const p1 = familyData.find(p => p.id === person.parentId1);
      const p2 = familyData.find(p => p.id === person.parentId2);
      if (!p1 && !p2) return;
      const cp = positions[person.id];
      if (!cp) return;
      const parentGen = (p1 || p2).gen;
      if (genY[parentGen] === undefined || genY[person.gen] === undefined) return;
      const parentBot = genY[parentGen] + NODE_H;
      const childTop  = genY[person.gen];
      const midY = (parentBot + childTop) / 2;
      const col = sideCol(person.side);
      if (p1 && p2) {
        const pp1 = positions[p1.id], pp2 = positions[p2.id];
        if (!pp1 || !pp2) return;
        const lx = Math.min(pp1.x, pp2.x), rx = Math.max(pp1.x, pp2.x);
        const branchX = (pp1.x + pp2.x) / 2;
        const midY2 = midY + (childTop - midY) / 2;
        out.push(
          <g key={`conn-${person.id}`} opacity="0.42">
            <line x1={pp1.x} y1={parentBot} x2={pp1.x} y2={midY} stroke={col} strokeWidth="1.5" />
            <line x1={pp2.x} y1={parentBot} x2={pp2.x} y2={midY} stroke={col} strokeWidth="1.5" />
            <line x1={lx}    y1={midY}      x2={rx}    y2={midY}  stroke={col} strokeWidth="1.5" />
            <line x1={branchX} y1={midY}   x2={branchX} y2={midY2} stroke={col} strokeWidth="1.5" />
            <line x1={branchX} y1={midY2}  x2={cp.x}    y2={midY2} stroke={col} strokeWidth="1.5" />
            <line x1={cp.x}   y1={midY2}   x2={cp.x}    y2={childTop} stroke={col} strokeWidth="1.5" />
          </g>
        );
      } else {
        const px = positions[(p1||p2).id]?.x;
        if (px === undefined) return;
        out.push(<line key={`conn-${person.id}`} x1={px} y1={parentBot} x2={cp.x} y2={childTop} stroke={col} strokeWidth="1.5" opacity="0.42" />);
      }
    });
    return out;
  }, [familyData, positions, genY]);

  // partner lines
  const partnerLines = useMemo(() => {
    const drawn = new Set();
    const out = [];
    familyData.forEach(person => {
      if (!person.partnerId || drawn.has(person.id)) return;
      const partner = familyData.find(p => p.id === person.partnerId);
      if (!partner) return;
      const pp = positions[person.id], qp = positions[partner.id];
      if (!pp || !qp) return;
      const x1 = Math.min(pp.x, qp.x) + pp.nw/2, x2 = Math.max(pp.x, qp.x) - pp.nw/2;
      if (x2 > x1) {
        const y = (genY[person.gen] || 0) + NODE_H / 2;
        out.push(<line key={`partner-${person.id}`} x1={x1} y1={y} x2={x2} y2={y} stroke="#ddd8cd" strokeWidth="1.5" strokeDasharray="3 2" />);
      }
      drawn.add(person.id); drawn.add(person.partnerId);
    });
    return out;
  }, [familyData, positions, genY]);

  const savePerson = updated => {
    setFamilyData(p => p.map(x => x.id === updated.id ? updated : x));
    setEditPerson(null);
  };
  const deletePerson = id => {
    if (id === "self") return;
    setFamilyData(prev => prev.filter(p => p.id !== id).map(p => ({
      ...p,
      parentId1: p.parentId1 === id ? null : p.parentId1,
      parentId2: p.parentId2 === id ? null : p.parentId2,
      partnerId: p.partnerId === id ? null : p.partnerId,
    })));
    setEditPerson(null);
  };
  const addPerson = (data, relType, refId) => {
    const ref = familyData.find(p => p.id === refId);
    if (!ref) return;
    const genMap = { parent:ref.gen-1, sibling:ref.gen, partner:ref.gen, grandparent:ref.gen-2, greatgrandparent:ref.gen-3, greatgreatgrandparent:ref.gen-4, auntuncle:ref.gen-1, cousin:ref.gen, child:ref.gen+1 };
    const gen = genMap[relType] ?? ref.gen;
    let side = ref.side;
    if (relType === "partner") side = ref.side === "paternal" ? "maternal" : ref.side === "maternal" ? "paternal" : null;
    let parentId1 = null, parentId2 = null, partnerId = null;
    if (relType === "sibling")  { parentId1 = ref.parentId1; parentId2 = ref.parentId2; }
    if (relType === "partner")  { partnerId = refId; }
    if (relType === "child")    { parentId1 = refId; }
    const genPeople = familyData.filter(p => p.gen === gen);
    const seq = genPeople.length > 0 ? Math.max(...genPeople.map(p => p.seq||0)) + 1 : 0;
    const newP = { ...data, id: uid(), gen, side, parentId1, parentId2, partnerId, seq };
    let updated = [...familyData, newP];
    if (relType === "parent") updated = updated.map(p => p.id===refId ? (!p.parentId1?{...p,parentId1:newP.id}:!p.parentId2?{...p,parentId2:newP.id}:p) : p);
    if (relType === "partner") updated = updated.map(p => p.id===refId && !p.partnerId ? {...p,partnerId:newP.id} : p);
    setFamilyData(updated);
    setAddingPerson(false);
  };

  const gens = useMemo(() => [...new Set(familyData.map(p => p.gen))].sort((a,b) => a-b), [familyData]);

  return (
    <div className="fade-in">
      {/* ── History strip ── */}
      <section style={{ marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:10 }}>
          <div style={S.sectionLabel}>Historical context — South Tyrol</div>
          <div style={{ display:"flex", gap:6, marginLeft:"auto" }}>
            {[["regional","South Tyrol overview"],["pustertal","+ Innichen / Bruneck detail"]].map(([mode,label]) => (
              <button key={mode} onClick={() => setHistMode(mode)}
                style={{ ...S.histTab, ...(histMode===mode ? S.histTabActive : {}) }}>{label}</button>
            ))}
          </div>
        </div>
        <p style={S.schoolIntro}>
          {histMode === "pustertal"
            ? "Pustertal / Innichen (San Candido) / Bruneck (Brunico) focus — local history back to 769. Click any event to read it."
            : "The political and cultural history your family lived through. Switch to Pustertal focus for local Innichen / Bruneck detail."}
        </p>
        <div style={{ background:"#fff", border:"1px solid #ece8df", borderRadius:12, overflow:"hidden" }}>
          <svg viewBox={`0 0 ${SVG_W} 160`} style={{ width:"100%", height:"auto" }}>
            {/* year grid */}
            {[...Array(Math.floor((H_Y2-H_Y1)/50)+1)].map((_,i) => {
              const yr = H_Y1 + i*50;
              return <g key={yr}>
                <line x1={hx(yr)} y1={10} x2={hx(yr)} y2={130} stroke="#2b2b28" strokeWidth="0.5" opacity="0.07" />
                <text x={hx(yr)} y={143} style={{ fontSize:8, fill:"#c4c0b6", textAnchor:"middle" }}>{yr}</text>
              </g>;
            })}

            {/* generation birth-era bands at the bottom */}
            {[
              { label:"Great-grandparents born", y1:1895, y2:1912, color:"#D98032" },
              { label:"Grandparents born",       y1:1928, y2:1938, color:"#7B4FB0" },
              { label:"Parents born",            y1:1957, y2:1967, color:"#1D9E75" },
            ].filter(b => hx(b.y2) > 42 && hx(b.y1) < SVG_W-38).map(b => {
              const bx = hx(b.y1), bw = Math.max(hx(b.y2)-hx(b.y1), 2);
              return (
                <g key={b.label}>
                  <rect x={bx} y={148} width={bw} height={10} fill={b.color} opacity="0.4" rx="2" />
                </g>
              );
            })}
            {/* gen band labels — only if wide enough */}
            {[
              { label:"Great-gp.", y1:1895, y2:1912, color:"#D98032" },
              { label:"Gp.",       y1:1928, y2:1938, color:"#7B4FB0" },
              { label:"Parents",  y1:1957, y2:1967, color:"#1D9E75" },
            ].filter(b => { const bw = hx(b.y2)-hx(b.y1); return bw > 30 && hx(b.y2) > 42 && hx(b.y1) < SVG_W-38; }).map(b => (
              <text key={b.label+"lbl"} x={(hx(b.y1)+hx(b.y2))/2} y={156}
                style={{ fontSize:6.5, fill:b.color, textAnchor:"middle", fontWeight:700 }}>{b.label}</text>
            ))}

            {/* axis */}
            <line x1={38} y1={80} x2={SVG_W-38} y2={80} stroke="#e8e3d8" strokeWidth="1.5" />

            {/* event dots — always visible, labeled only if not dense */}
            {allHistEvents.map((ev, i) => {
              const x = hx(ev.year);
              if (x < 38 || x > SVG_W-38) return null;
              const slot = histSlots[i];
              const isOpen = openEvent === ev.id, isHov = hoverH === ev.id;
              const showLabel = slot?.showLabel ?? true;
              const above = slot?.tier < 2;
              // label positions
              const titleY = above ? (slot.tier===0 ? 62 : 44) : (slot.tier===2 ? 98 : 116);
              const yearY  = above ? (slot.tier===0 ? 53 : 35) : (slot.tier===2 ? 107 : 125);
              return (
                <g key={ev.id} style={{ cursor:"pointer" }}
                  onClick={() => setOpenEvent(isOpen ? null : ev.id)}
                  onMouseEnter={() => setHoverH(ev.id)} onMouseLeave={() => setHoverH(null)}>
                  {(showLabel || isHov || isOpen) && <>
                    <line x1={x} y1={80} x2={x} y2={above?68:92} stroke={ev.color} strokeWidth="0.75" opacity="0.5" />
                    <text x={x} y={titleY} style={{ fontSize:8.5, fill:"#3a3a36", textAnchor:"middle", fontWeight:isHov||isOpen?700:400 }}>
                      {ev.title.length>13?ev.title.slice(0,12)+"…":ev.title}
                    </text>
                    <text x={x} y={yearY} style={{ fontSize:7.5, fill:ev.color, textAnchor:"middle", fontWeight:700 }}>{ev.year}</text>
                  </>}
                  <circle cx={x} cy={80} r={isHov||isOpen ? 7 : 5}
                    fill={ev.color} stroke="#fff" strokeWidth={isHov||isOpen?2:1.5} />
                  {/* dot marker for unlabeled dense events */}
                  {!showLabel && !isHov && !isOpen && (
                    <text x={x} y={94} style={{ fontSize:7, fill:ev.color, textAnchor:"middle", fontWeight:600 }}>{ev.year}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* scrollable event index for dense sections */}
        <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:6 }}>
          {allHistEvents.map(ev => {
            const isOpen = openEvent === ev.id;
            return (
              <button key={ev.id}
                onClick={() => setOpenEvent(isOpen ? null : ev.id)}
                style={{
                  border:`1.5px solid ${isOpen ? ev.color : "#e8e3d8"}`,
                  borderRadius:20, padding:"3px 10px", cursor:"pointer",
                  fontFamily:"inherit", fontSize:11, fontWeight:isOpen?700:400,
                  background: isOpen ? ev.color+"18" : "transparent",
                  color: isOpen ? ev.color : "#6b6a64",
                  whiteSpace:"nowrap",
                }}>
                <span style={{ fontWeight:700, marginRight:4 }}>{ev.year}</span>{ev.title}
              </button>
            );
          })}
        </div>
        {openEvent && (() => {
          const ev = [...HISTORY_EVENTS,...PUSTERTAL_EVENTS].find(e => e.id===openEvent);
          return ev ? (
            <div style={{ ...S.stageDetail, borderColor:ev.color, marginTop:10 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ ...S.stageDot, background:ev.color }} />
                <strong style={{ ...S.stageTitle, fontSize:16 }}>{ev.year} — {ev.title}</strong>
              </div>
              <p style={{ fontSize:13.5, color:"#3a3a36", margin:0, lineHeight:1.65 }}>{ev.desc}</p>
            </div>
          ) : null;
        })()}
      </section>

      {/* ── Family tree ── */}
      <section>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:10, flexWrap:"wrap", gap:8 }}>
          <div style={S.sectionLabel}>Family tree</div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={() => setAddingPerson(true)} style={S.addBtn}>+ Add person</button>
            <button onClick={onReset} style={S.resetBtn}>Reset</button>
          </div>
        </div>
        <p style={S.schoolIntro}>
          Click any node to edit. Use "+ Add person" to extend the tree.
        </p>
        <div style={{ background:"#fff", border:"1px solid #ece8df", borderRadius:14, overflow:"hidden" }}>
          <svg viewBox={`0 0 ${SVG_W} ${svgH}`} style={{ width:"100%", height:"auto" }}>
            {/* generation labels + horizontal divider at gen4 */}
            {gens.map(gen => {
              const y = genY[gen];
              if (y === undefined) return null;
              return (
                <g key={gen}>
                  <text x={8} y={y + NODE_H/2 + 4} style={{ fontSize:9.5, fill:"#b0ab9f", fontWeight:700 }}
                    transform={`rotate(-90,8,${y+NODE_H/2+4})`}>{genLabel(gen)}</text>
                  <line x1={60} y1={y-8} x2={SVG_W-10} y2={y-8} stroke="#f0ede6" strokeWidth="1" />
                </g>
              );
            })}
            {/* paternal / maternal column divider */}
            <line x1={SVG_W/2} y1={30} x2={SVG_W/2} y2={svgH-20} stroke="#ece8df" strokeWidth="1" strokeDasharray="4 4" />
            <text x={SVG_W/4} y={22} style={{ fontSize:10, fill:"#D98032", textAnchor:"middle", fontWeight:700, opacity:0.65 }}>← Paternal (Vater)</text>
            <text x={3*SVG_W/4} y={22} style={{ fontSize:10, fill:"#3D9BE0", textAnchor:"middle", fontWeight:700, opacity:0.65 }}>Maternal (Mutter) →</text>
            {/* connectors */}
            {connectors}
            {/* partner lines */}
            {partnerLines}
            {/* nodes */}
            {familyData.map(person => {
              const cp = positions[person.id];
              if (!cp || genY[person.gen] === undefined) return null;
              const { x, nw } = cp;
              const y = genY[person.gen];
              const col = sideCol(person.side);
              const empty = !person.name;
              const isSelf = person.id === "self";
              const isHov = hoverP === person.id;
              // scale font/truncation to available node width
              const nameChars = Math.max(7, Math.floor(nw / 7));
              const nameFontSz = Math.max(8, Math.min(11, nw / 8.5));
              const roleChars  = Math.max(6, Math.floor(nw / 6.5));
              const roleFontSz = Math.max(7, Math.min(9, nw / 9));
              return (
                <g key={person.id} style={{ cursor:"pointer" }}
                  onClick={() => setEditPerson(person)}
                  onMouseEnter={() => setHoverP(person.id)}
                  onMouseLeave={() => setHoverP(null)}>
                  <rect x={x-nw/2} y={y} width={nw} height={NODE_H} rx={7}
                    fill={empty?"#faf8f3":isSelf?"#fdf6e3":col+"1a"}
                    stroke={isHov?col:empty?"#ddd8cd":col}
                    strokeWidth={isHov?2:isSelf?2:1}
                    strokeDasharray={empty?"4 2":"none"} />
                  {empty
                    ? <text x={x} y={y+NODE_H/2+1}
                        style={{ fontSize:Math.max(7,Math.min(9.5,nw/9)), fill:"#c4c0b6", textAnchor:"middle", dominantBaseline:"central" }}>
                        {person.role.length>roleChars?person.role.slice(0,roleChars-1)+"…":person.role}
                      </text>
                    : <>
                        <text x={x} y={y+16} style={{ fontSize:nameFontSz, fill:isSelf?"#C9A227":col, textAnchor:"middle", fontWeight:700 }}>
                          {person.name.length>nameChars?person.name.slice(0,nameChars-1)+"…":person.name}
                        </text>
                        <text x={x} y={y+29} style={{ fontSize:Math.max(7,roleFontSz-0.5), fill:"#6b6a64", textAnchor:"middle" }}>
                          {person.birthYear||""}{person.deathYear?` – ${person.deathYear}`:person.birthYear?" –":""}
                        </text>
                        <text x={x} y={y+42} style={{ fontSize:roleFontSz, fill:"#a39f95", textAnchor:"middle" }}>
                          {person.role.length>roleChars?person.role.slice(0,roleChars-1)+"…":person.role}
                        </text>
                      </>
                  }
                  {/* hover tooltip with full details */}
                  {isHov && (
                    <g>
                      <rect x={x-110} y={y+NODE_H+4} width={220} height={person.notes?52:36} rx={6} fill="#1a1814" opacity="0.97" />
                      <text x={x} y={y+NODE_H+16} style={{ fontSize:10, fill:"#C9A227", textAnchor:"middle", fontWeight:700 }}>
                        {person.name || person.role}
                      </text>
                      {person.birthYear && <text x={x} y={y+NODE_H+27} style={{ fontSize:8.5, fill:"#aaa", textAnchor:"middle" }}>
                        {person.birthYear}{person.deathYear?` – ${person.deathYear}`:" –"}
                      </text>}
                      {person.notes && <text x={x} y={y+NODE_H+40} style={{ fontSize:7.5, fill:"#888", textAnchor:"middle" }}>
                        {person.notes.length>50?person.notes.slice(0,48)+"…":person.notes}
                      </text>}
                      <text x={x} y={y+NODE_H+(person.notes?50:36)} style={{ fontSize:7.5, fill:"#555", textAnchor:"middle", fontStyle:"italic" }}>
                        click to edit
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <p style={S.footnote}>
          Paternal side left (amber), maternal side right (blue). Dashed lines = couples.
          Bracket connectors show parent→child. Click any node to edit; use + Add person to extend.
          All saves automatically.
        </p>
      </section>

      {editPerson && (
        <PersonModal person={editPerson} people={familyData} onSave={savePerson}
          onDelete={editPerson.id!=="self" ? deletePerson : null}
          onClose={() => setEditPerson(null)}
          onAddConnection={relType => {
            const ref = editPerson;
            setEditPerson(null);
            setAddingConnection({ person: ref, relType });
          }}
        />
      )}
      {(addingPerson || addingConnection) && (
        <AddPersonModal
          people={familyData}
          prefilledRelType={addingConnection?.relType}
          prefilledRef={addingConnection?.person}
          onAdd={addPerson}
          onClose={() => { setAddingPerson(false); setAddingConnection(null); }}
        />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PERSON MODAL (edit / delete)
// ════════════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════════════
// DATA EDITOR — raw JSON view and edit of all app data
// ════════════════════════════════════════════════════════════════

function PersonModal({ person, people, onSave, onDelete, onClose, onAddConnection }) {
  const [name,      setName]      = useState(person.name       ?? "");
  const [birthYear, setBirthYear] = useState(person.birthYear  ?? "");
  const [deathYear, setDeathYear] = useState(person.deathYear  ?? "");
  const [notes,     setNotes]     = useState(person.notes      ?? "");
  const [role,      setRole]      = useState(person.role       ?? "");
  const [gen,       setGen]       = useState(person.gen        ?? 4);
  const [parentId1, setParentId1] = useState(person.parentId1  ?? "");
  const [parentId2, setParentId2] = useState(person.parentId2  ?? "");
  const GEN_LABELS = {
    0: "Gen 0 — Great-great-grandparents",
    1: "Gen 1 — Great-grandparents",
    2: "Gen 2 — Grandparents & siblings",
    3: "Gen 3 — Parents, aunts & uncles",
    4: "Gen 4 — Your generation",
    5: "Gen 5 — Children & nephews",
  };
  // People who could plausibly be a parent (in a row above this person)
  const parentOptions = people
    ? people.filter(p => p.id !== person.id && p.gen < gen && p.name).sort((a,b) => b.gen - a.gen)
    : [];
  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <h3 style={S.modalTitle}>{person.name || person.role || "Person"}</h3>
        <label style={S.field}><span style={S.fieldLabel}>Name</span>
          <input style={S.input} value={name} onChange={e => setName(e.target.value)} autoFocus /></label>
        <div style={S.row}>
          <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>Born</span>
            <input style={S.input} type="number" min={1800} max={2024} value={birthYear} placeholder="e.g. 1932"
              onChange={e => setBirthYear(e.target.value ? parseInt(e.target.value) : "")} /></label>
          <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>Died (if applicable)</span>
            <input style={S.input} type="number" min={1800} max={2026} value={deathYear} placeholder="optional"
              onChange={e => setDeathYear(e.target.value ? parseInt(e.target.value) : "")} /></label>
        </div>
        <label style={S.field}><span style={S.fieldLabel}>Role / description</span>
          <input style={S.input} value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Farmer, Terlan" /></label>
        <label style={S.field}><span style={S.fieldLabel}>Generation row (move if placed incorrectly)</span>
          <select style={S.input} value={gen} onChange={e => setGen(parseInt(e.target.value))}>
            {Object.entries(GEN_LABELS).map(([g, label]) => (
              <option key={g} value={g}>{label}</option>
            ))}
          </select>
        </label>
        {parentOptions.length > 0 && (
          <div style={S.row}>
            <label style={{ ...S.field, flex:1 }}>
              <span style={S.fieldLabel}>Parent 1</span>
              <select style={S.input} value={parentId1||""} onChange={e => setParentId1(e.target.value||null)}>
                <option value="">— none —</option>
                {parentOptions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
              </select>
            </label>
            <label style={{ ...S.field, flex:1 }}>
              <span style={S.fieldLabel}>Parent 2</span>
              <select style={S.input} value={parentId2||""} onChange={e => setParentId2(e.target.value||null)}>
                <option value="">— none —</option>
                {parentOptions.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
              </select>
            </label>
          </div>
        )}
        <label style={S.field}><span style={S.fieldLabel}>Notes — occupation, hometown, anything known</span>
          <textarea style={{ ...S.input, minHeight:70, resize:"vertical" }} value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g. Never spoke Italian at home. Survived the Options by staying." /></label>
        <div style={S.modalActions}>
          {onDelete && <button style={S.deleteBtn} onClick={() => { if (window.confirm("Remove this person from the tree?")) onDelete(person.id); }}>Remove</button>}
          <div style={{ flex:1 }} />
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn} onClick={() => onSave({ ...person, name:name.trim(), birthYear:birthYear||null, deathYear:deathYear||null, notes:notes.trim(), role:role.trim()||person.role, gen, parentId1:parentId1||null, parentId2:parentId2||null })}>Save</button>
        </div>

        {/* ── Add a connection ── */}
        <div style={{ borderTop:"1.5px solid #ece8df", marginTop:20, paddingTop:16 }}>
          <div style={{ fontSize:11, fontWeight:700, color:"#a39f95", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:10 }}>
            Add a family connection to {name||person.role}
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {[
              ["child",               "＋ Child"],
              ["parent",              "＋ Parent"],
              ["sibling",             "＋ Sibling"],
              ["partner",             "＋ Partner"],
              ["grandparent",         "＋ Grandparent"],
              ["auntuncle",           "＋ Aunt / Uncle"],
              ["cousin",              "＋ Cousin"],
              ["greatgrandparent",    "＋ Great-grandparent"],
            ].map(([type, label]) => (
              <button key={type} onClick={() => onAddConnection(type)}
                style={S.connectBtn}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ADD PERSON MODAL
// ════════════════════════════════════════════════════════════════
function AddPersonModal({ people, prefilledRelType, prefilledRef, onAdd, onClose }) {
  const [relType,   setRelType]   = useState(prefilledRelType || "parent");
  const [refId,     setRefId]     = useState(prefilledRef?.id || people[0]?.id || "");
  const [name,      setName]      = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [notes,     setNotes]     = useState("");
  const [role,      setRole]      = useState("");

  const ref = prefilledRef || people.find(p => p.id === refId);
  const isPrefilled = !!(prefilledRelType && prefilledRef);
  const genMap = { parent:-1, sibling:0, partner:0, grandparent:-2, greatgrandparent:-3, greatgreatgrandparent:-4, auntuncle:-1, cousin:0, child:1 };
  const genOffset = genMap[relType] ?? 0;
  const computedGen = ref ? ref.gen + genOffset : 4;
  const genLabel = { 0:"Great-great-grandparents", 1:"Great-grandparents", 2:"Grandparents", 3:"Parents", 4:"You / siblings", 5:"Children / nephews" };
  const roleDefault = { parent:"Parent", sibling:"Sibling", partner:"Partner", grandparent:"Grandparent", greatgrandparent:"Great-grandparent", greatgreatgrandparent:"Great-great-grandparent", auntuncle:"Aunt / Uncle", cousin:"Cousin", child:"Child" };
  const relLabel = { parent:"parent", sibling:"sibling", partner:"partner", grandparent:"grandparent", greatgrandparent:"great-grandparent", greatgreatgrandparent:"great-great-grandparent", auntuncle:"aunt/uncle", cousin:"cousin", child:"child" };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth:480 }} onClick={e => e.stopPropagation()}>
        <h3 style={S.modalTitle}>
          {isPrefilled
            ? `Add ${relLabel[relType]} of ${prefilledRef.name || prefilledRef.role}`
            : "Add a family member"}
        </h3>

        {/* Only show relationship / reference dropdowns when not called from a person card */}
        {!isPrefilled && (
          <div style={S.row}>
            <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>Relationship</span>
              <select style={S.input} value={relType} onChange={e => setRelType(e.target.value)}>
                <option value="parent">Parent of…</option>
                <option value="sibling">Sibling of…</option>
                <option value="partner">Partner of…</option>
                <option value="grandparent">Grandparent of…</option>
                <option value="greatgrandparent">Great-grandparent of…</option>
                <option value="greatgreatgrandparent">Great-great-grandparent of…</option>
                <option value="auntuncle">Aunt / Uncle of…</option>
                <option value="cousin">Cousin of…</option>
                <option value="child">Child of…</option>
              </select>
            </label>
            <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>…this person</span>
              <select style={S.input} value={refId} onChange={e => setRefId(e.target.value)}>
                {people.map(p => <option key={p.id} value={p.id}>{p.name || `[${p.role}]`}</option>)}
              </select>
            </label>
          </div>
        )}

        {ref && (
          <div style={S.durationPill}>
            <span style={{ color:"#1D9E75", fontWeight:700 }}>{genLabel[computedGen] || `Generation ${computedGen}`}</span>
            <span style={{ color:"#a39f95" }}> · {relLabel[relType]} of {ref.name || ref.role}</span>
          </div>
        )}
        <label style={S.field}><span style={S.fieldLabel}>Name</span>
          <input style={S.input} value={name} onChange={e => setName(e.target.value)} placeholder="First and/or family name" autoFocus /></label>
        <div style={S.row}>
          <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>Born</span>
            <input style={S.input} type="number" min={1800} max={2024} value={birthYear} placeholder="e.g. 1932"
              onChange={e => setBirthYear(e.target.value ? parseInt(e.target.value) : "")} /></label>
          <label style={{ ...S.field, flex:1 }}><span style={S.fieldLabel}>Died</span>
            <input style={S.input} type="number" min={1800} max={2026} value={deathYear} placeholder="optional"
              onChange={e => setDeathYear(e.target.value ? parseInt(e.target.value) : "")} /></label>
        </div>
        <label style={S.field}><span style={S.fieldLabel}>Role / description</span>
          <input style={S.input} value={role} onChange={e => setRole(e.target.value)} placeholder={roleDefault[relType]} /></label>
        <label style={S.field}><span style={S.fieldLabel}>Notes</span>
          <textarea style={{ ...S.input, minHeight:60, resize:"vertical" }} value={notes}
            onChange={e => setNotes(e.target.value)} placeholder="Occupation, hometown, anything known…" /></label>
        <div style={S.modalActions}>
          <div style={{ flex:1 }} />
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn}
            onClick={() => onAdd({ name:name.trim(), birthYear:birthYear||null, deathYear:deathYear||null, notes:notes.trim(), role:role.trim()||roleDefault[relType] }, relType, refId)}>
            Add to tree
          </button>
        </div>
      </div>
    </div>
  );
}


function EventModal({ event, tracks, minYear, maxYear, birthYear, onSave, onDelete, onClose }) {
  const [startStr, setStartStr] = useState(() => formatDateInput(event?.year, event?.month, event?.day));
  const [endStr,   setEndStr]   = useState(() => formatDateInput(event?.endYear, event?.endMonth, event?.endDay));
  const [track,    setTrack]    = useState(event?.track ?? "self");
  const [title,    setTitle]    = useState(event?.title ?? "");
  const [note,     setNote]     = useState(event?.note  ?? "");

  const sp = parseDate(startStr);   // null (empty) | false (invalid) | {year,month,day}
  const ep = parseDate(endStr);

  const startOk  = sp !== false;
  const endOk    = ep !== false;
  const hasStart = sp && sp !== false;

  const isRange = hasStart && ep && ep !== false &&
    dateToFY(ep.year, ep.month, ep.day) > dateToFY(sp.year, sp.month, sp.day);

  const startAge = hasStart ? ageAt(sp.year, sp.month, sp.day, birthYear) : null;
  const endAge   = (isRange && ep) ? ageAt(ep.year, ep.month, ep.day, birthYear) : null;
  const durYrs   = isRange
    ? (dateToFY(ep.year,ep.month,ep.day) - dateToFY(sp.year,sp.month,sp.day)).toFixed(1)
    : null;

  const preview = (parsed) => parsed && parsed !== false
    ? `${formatDate(parsed.year, parsed.month, parsed.day)} · age ${ageAt(parsed.year, parsed.month, parsed.day, birthYear)}`
    : null;

  const fieldBorder = (str, ok) =>
    str && !ok ? "#E15554" : str && ok ? "#1D9E75" : undefined;

  const canSave = title.trim() && hasStart && startOk && endOk;

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <h3 style={S.modalTitle}>{event ? "Edit moment" : "Add a moment"}</h3>

        <label style={S.field}>
          <span style={S.fieldLabel}>Title</span>
          <input style={S.input} value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Born in Innichen" autoFocus />
        </label>

        {/* Start date */}
        <label style={S.field}>
          <span style={S.fieldLabel}>
            Start date{preview(sp) ? <span style={{ color:"#1D9E75", fontWeight:600 }}> — {preview(sp)}</span> : null}
          </span>
          <input style={{ ...S.input, borderColor: fieldBorder(startStr, startOk) }}
            value={startStr} onChange={e => setStartStr(e.target.value)}
            placeholder="YYYY  ·  MM/YYYY  ·  DD/MM/YYYY" />
          {startStr && !startOk && <div style={S.dateError}>Try: 1990 · 05/1990 · 25/05/1990</div>}
        </label>

        {/* End date */}
        <label style={S.field}>
          <span style={S.fieldLabel}>
            End date
            {preview(ep)
              ? <span style={{ color:"#1D9E75", fontWeight:600 }}> — {preview(ep)}</span>
              : <span style={{ color:"#b0ab9f" }}> (optional — leave blank for a point event)</span>}
          </span>
          <input style={{ ...S.input, borderColor: fieldBorder(endStr, endOk) }}
            value={endStr} onChange={e => setEndStr(e.target.value)}
            placeholder="YYYY  ·  MM/YYYY  ·  DD/MM/YYYY" />
          {endStr && !endOk && <div style={S.dateError}>Try: 2015 · 09/2015 · 30/09/2015</div>}
        </label>

        {isRange && (
          <div style={S.durationPill}>
            <span style={{ color:"#1D9E75", fontWeight:700 }}>{durYrs} yrs</span>
            <span style={{ color:"#a39f95" }}> · ages {startAge}–{endAge} · shows as bar on timeline</span>
          </div>
        )}

        <label style={S.field}>
          <span style={S.fieldLabel}>Track</span>
          <select style={S.input} value={track} onChange={e => setTrack(e.target.value)}>
            {tracks.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </label>

        <label style={S.field}>
          <span style={S.fieldLabel}>Note (optional)</span>
          <textarea style={{ ...S.input, minHeight:60, resize:"vertical" }} value={note}
            onChange={e => setNote(e.target.value)} placeholder="What this meant, how it felt…" />
        </label>

        <div style={S.modalActions}>
          {onDelete && <button style={S.deleteBtn} onClick={() => onDelete(event.id)}>Delete</button>}
          <div style={{ flex:1 }} />
          <button style={S.cancelBtn} onClick={onClose}>Cancel</button>
          <button style={S.saveBtn} disabled={!canSave}
            onClick={() => onSave({
              ...(event||{}),
              year: sp.year,  month: sp.month  || null, day: sp.day  || null,
              endYear:  isRange ? ep.year        : null,
              endMonth: isRange ? ep.month||null : null,
              endDay:   isRange ? ep.day  ||null : null,
              track, title: title.trim(), note: note.trim(),
            })}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}



const FONT = `"Georgia","Iowan Old Style",serif`;
const SANS = `"Helvetica Neue","Segoe UI",system-ui,sans-serif`;
const CSS = `
  * { box-sizing:border-box; }
  .stage-chip { transition:transform .15s,background .2s; }
  .stage-chip:hover { transform:translateY(-1px); }
  .tab:hover { color:#2b2b28; }
  .fade-in { animation:fadeIn .3s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  input:focus,select:focus,textarea:focus { outline:2px solid #C9A227;outline-offset:1px; }
`;
const S = {
  page:          { fontFamily:SANS, color:"#2b2b28", background:"#faf8f3", padding:"28px 22px 48px", maxWidth:980, margin:"0 auto", lineHeight:1.5 },
  header:        { marginBottom:24 },
  h1:            { fontFamily:FONT, fontSize:30, fontWeight:600, margin:"0 0 8px", letterSpacing:"-0.01em" },
  sub:           { fontSize:14, color:"#6b6a64", maxWidth:640, margin:0 },
  tabs:          { display:"flex", gap:4, marginTop:18, borderBottom:"1.5px solid #ece8df" },
  searchBar:     { display:"flex", alignItems:"center", gap:8, background:"#fff", border:"1px solid #ece8df", borderRadius:10, padding:"6px 12px", marginBottom:12 },
  searchInput:   { flex:1, border:"none", background:"transparent", fontSize:14, fontFamily:"inherit", outline:"none", color:"#2b2b28" },
  searchClear:   { border:"none", background:"transparent", cursor:"pointer", fontSize:18, color:"#b0ab9f", lineHeight:1 },
  tab:           { border:"none", background:"transparent", fontFamily:SANS, fontSize:15, fontWeight:600, color:"#a39f95", padding:"8px 16px", cursor:"pointer", borderBottom:"2.5px solid transparent", marginBottom:-1.5, transition:"color .2s" },
  tabActive:     { color:"#2b2b28", borderBottom:"2.5px solid #C9A227" },
  histTab:       { border:"1.5px solid #ddd8cd", background:"transparent", borderRadius:20, padding:"4px 12px", cursor:"pointer", fontFamily:SANS, fontSize:12, fontWeight:600, color:"#a39f95" },
  histTabActive: { background:"#2b2b28", color:"#fff", borderColor:"#2b2b28" },
  sectionLabel:  { fontSize:11, textTransform:"uppercase", letterSpacing:"0.08em", color:"#a39f95", marginBottom:10, fontWeight:600 },
  schoolIntro:   { fontSize:14, color:"#6b6a64", maxWidth:720, margin:"0 0 14px" },
  stagesWrap:    { marginBottom:26 },
  stagesStrip:   { display:"flex", flexWrap:"wrap", gap:8 },
  stageChip:     { display:"flex", flexDirection:"column", alignItems:"flex-start", border:"1.5px solid", borderRadius:8, padding:"7px 12px", cursor:"pointer", fontFamily:SANS, minWidth:92 },
  stageAge:      { fontSize:10, opacity:0.7, fontWeight:600 },
  stageName:     { fontSize:13, fontWeight:600 },
  stageDetail:   { marginTop:14, border:"1.5px solid", borderRadius:12, padding:"16px 18px", background:"#fff" },
  stageDetailHead:{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:12 },
  stageDot:      { width:12, height:12, borderRadius:"50%", flexShrink:0 },
  stageTitle:    { fontFamily:FONT, fontSize:18 },
  stageCrisis:   { fontSize:13, color:"#6b6a64", fontStyle:"italic" },
  virtue:        { fontSize:13, fontWeight:700 },
  stageGrid:     { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16 },
  stageLabel:    { fontSize:11, textTransform:"uppercase", letterSpacing:"0.06em", color:"#a39f95", marginBottom:4, fontWeight:700 },
  stageText:     { fontSize:13, margin:0, color:"#3a3a36" },
  schoolWrap:    { marginBottom:26 },
  topicList:     { display:"flex", flexDirection:"column", gap:8 },
  topicCard:     { border:"1.5px solid", borderRadius:12, overflow:"hidden", background:"#fff" },
  topicHead:     { width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 18px", background:"transparent", border:"none", cursor:"pointer", fontFamily:SANS, textAlign:"left" },
  topicTitle:    { fontFamily:FONT, fontSize:16, color:"#2b2b28" },
  topicChevron:  { fontSize:22, transition:"transform .2s", lineHeight:1 },
  topicBody:     { padding:"0 18px 18px" },
  topicSummary:  { fontSize:13.5, color:"#3a3a36", margin:"0 0 12px", lineHeight:1.6 },
  topicPoints:   { margin:0, paddingLeft:18 },
  topicPoint:    { fontSize:13, color:"#4a4a45", marginBottom:8, lineHeight:1.55 },
  controls:      { marginBottom:18 },
  zoomBar:       { display:"flex", alignItems:"center", gap:6, marginBottom:10, flexWrap:"wrap", padding:"8px 12px", background:"#fff", border:"1px solid #ece8df", borderRadius:10 },
  zoomLabel:     { fontSize:11, fontWeight:700, color:"#a39f95", textTransform:"uppercase", letterSpacing:"0.07em", marginRight:4 },
  zoomBtn:       { width:28, height:28, border:"1.5px solid #ddd8cd", background:"transparent", borderRadius:6, cursor:"pointer", fontSize:16, fontWeight:700, fontFamily:"inherit", color:"#2b2b28", display:"flex", alignItems:"center", justifyContent:"center" },
  zoomPreset:    { border:"1.5px solid #ddd8cd", background:"transparent", borderRadius:6, padding:"3px 8px", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", color:"#6b6a64" },
  zoomPresetActive:{ background:"#C9A227", borderColor:"#C9A227", color:"#fff" },
  trackToggles:  { display:"flex", flexWrap:"wrap", gap:8, alignItems:"center" },
  trackToggle:   { display:"flex", alignItems:"center", gap:7, border:"1.5px solid", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontFamily:SANS, fontSize:13, fontWeight:600 },
  trackDot:      { width:8, height:8, borderRadius:"50%" },
  addBtn:        { border:"1.5px dashed #2b2b28", background:"transparent", borderRadius:20, padding:"6px 14px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:SANS },
  connectBtn:    { border:"1.5px solid #ddd8cd", background:"#faf8f3", borderRadius:20, padding:"5px 14px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:SANS, color:"#2b2b28" },
  resetBtn:      { border:"none", background:"transparent", color:"#a39f95", cursor:"pointer", fontSize:12, textDecoration:"underline", fontFamily:SANS },
  chartWrap:     { background:"#fff", borderRadius:14, padding:"12px 8px", border:"1px solid #ece8df", overflow:"hidden" },
  footnote:      { fontSize:12, color:"#a39f95", marginTop:16, fontStyle:"italic", maxWidth:720 },
  overlay:       { position:"fixed", inset:0, background:"rgba(20,18,14,0.4)", display:"flex", alignItems:"center", justifyContent:"center", padding:20, zIndex:1000 },
  modal:         { background:"#fff", borderRadius:16, padding:"24px 26px", width:"100%", maxWidth:460, boxShadow:"0 20px 60px rgba(0,0,0,0.25)", maxHeight:"90vh", overflowY:"auto" },
  modalTitle:    { fontFamily:FONT, fontSize:20, margin:"0 0 16px" },
  field:         { display:"block", marginBottom:14 },
  fieldLabel:    { display:"block", fontSize:12, color:"#6b6a64", marginBottom:5, fontWeight:600 },
  input:         { width:"100%", border:"1.5px solid #ddd8cd", borderRadius:8, padding:"9px 11px", fontSize:14, fontFamily:SANS, background:"#fdfcf9" },
  row:           { display:"flex", gap:12 },
  modalActions:  { display:"flex", alignItems:"center", gap:8, marginTop:8 },
  durationPill:  { display:"flex", alignItems:"center", gap:4, background:"#f0faf6", border:"1px solid #9FE1CB", borderRadius:8, padding:"7px 12px", fontSize:12, marginBottom:14, flexWrap:"wrap" },
  dateError:     { fontSize:11, color:"#E15554", marginTop:4 },
  deleteBtn:     { border:"1.5px solid #E15554", color:"#E15554", background:"transparent", borderRadius:8, padding:"8px 14px", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:SANS },
  cancelBtn:     { border:"1.5px solid #ddd8cd", background:"transparent", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontSize:13, fontFamily:SANS },
  saveBtn:       { border:"none", background:"#C9A227", color:"#fff", borderRadius:8, padding:"8px 20px", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:SANS },
};
