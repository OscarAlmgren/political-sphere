// Identifiers that tie the data to the linked-open-data world. Data only; lod.js turns them into JSON-LD.
//
//   wd    Wikidata item (https://www.wikidata.org/entity/Q…). owl:sameAs-style link for parties, countries, chambers, elections.
//   pf    Party Facts id (https://partyfacts.herokuapp.com/), the political-science hub that cross-links ParlGov, CHES and the
//         Manifesto Project. Party Facts has no entry for newer parties, lists and coalitions.
//   null  means "looked for, none exists" (or none that fits the entity as modelled here), never "not checked".
//
// Gathered 2026-11 by matching names against Wikidata and the Party Facts core-parties list, then reading every
// uncertain match by hand. Every chosen QID was checked to be a political party or alliance in the right country.
// Keys are the party ids from countries.js ('<country>:<abbr>'). Coalitions modelled as one entity (SPOLU, PP-DB, GroenLinks-PvdA, ...)
// point at the coalition's own item. To correct an entry, link the Wikidata item in the pull request.

export const COUNTRY_IDS = {
  SE: { wd: 'Q34', iso3: 'SWE', chamber: 'Q272930', election: 'Q113639313' }, // Sweden
  NO: { wd: 'Q20', iso3: 'NOR', chamber: 'Q109016', election: 'Q97203837' }, // Norway
  DK: { wd: 'Q35', iso3: 'DNK', chamber: 'Q209151', election: 'Q138781931' }, // Denmark
  FI: { wd: 'Q33', iso3: 'FIN', chamber: 'Q643412', election: 'Q63301809' }, // Finland
  IS: { wd: 'Q189', iso3: 'ISL', chamber: 'Q131279', election: 'Q109385503' }, // Iceland
  AT: { wd: 'Q40', iso3: 'AUT', chamber: 'Q871363', election: 'Q71784130' }, // Austria
  BE: { wd: 'Q31', iso3: 'BEL', chamber: 'Q1347545', election: 'Q84081335' }, // Belgium
  BG: { wd: 'Q219', iso3: 'BGR', chamber: 'Q639704', election: 'Q131442954' }, // Bulgaria
  HR: { wd: 'Q224', iso3: 'HRV', chamber: 'Q371576', election: 'Q100717789' }, // Croatia
  CY: { wd: 'Q229', iso3: 'CYP', chamber: 'Q1112381', election: 'Q124415774' }, // Cyprus
  CZ: { wd: 'Q213', iso3: 'CZE', chamber: 'Q320265', election: 'Q108882455' }, // Czechia
  EE: { wd: 'Q191', iso3: 'EST', chamber: 'Q217799', election: 'Q62116538' }, // Estonia
  FR: { wd: 'Q142', iso3: 'FRA', chamber: 'Q193582', election: 'Q126469235' }, // France
  DE: { wd: 'Q183', iso3: 'DEU', chamber: 'Q154797', election: 'Q108761711' }, // Germany
  GR: { wd: 'Q41', iso3: 'GRC', chamber: 'Q477089', election: 'Q118616507' }, // Greece
  HU: { wd: 'Q28', iso3: 'HUN', chamber: 'Q648716', election: 'Q125627220' }, // Hungary
  IE: { wd: 'Q27', iso3: 'IRL', chamber: 'Q651981', election: 'Q86345233' }, // Ireland
  IT: { wd: 'Q38', iso3: 'ITA', chamber: 'Q841424', election: 'Q50379923' }, // Italy
  LV: { wd: 'Q211', iso3: 'LVA', chamber: 'Q822919', election: 'Q115620205' }, // Latvia
  LT: { wd: 'Q37', iso3: 'LTU', chamber: 'Q374152', election: 'Q104902465' }, // Lithuania
  LU: { wd: 'Q32', iso3: 'LUX', chamber: 'Q517449', election: 'Q84081640' }, // Luxembourg
  MT: { wd: 'Q233', iso3: 'MLT', chamber: 'Q1817866', election: 'Q115821127' }, // Malta
  NL: { wd: 'Q55', iso3: 'NLD', chamber: 'Q233262', election: 'Q123684991' }, // Netherlands
  PL: { wd: 'Q36', iso3: 'POL', chamber: 'Q98964', election: 'Q84081860' }, // Poland
  PT: { wd: 'Q45', iso3: 'PRT', chamber: 'Q740564', election: 'Q125201429' }, // Portugal
  RO: { wd: 'Q218', iso3: 'ROU', chamber: 'Q320306', election: 'Q104033187' }, // Romania
  SK: { wd: 'Q214', iso3: 'SVK', chamber: 'Q1139204', election: 'Q105043728' }, // Slovakia
  SI: { wd: 'Q215', iso3: 'SVN', chamber: 'Q1568676', election: 'Q112339523' }, // Slovenia
  ES: { wd: 'Q29', iso3: 'ESP', chamber: 'Q539149', election: 'Q84082018' }, // Spain
  GB: { wd: 'Q145', iso3: 'GBR', chamber: 'Q11005', election: 'Q78851988' }, // United Kingdom
  AR: { wd: 'Q414', iso3: 'ARG', chamber: 'Q629133', election: 'Q131007945' }, // Argentina
  JP: { wd: 'Q17', iso3: 'JPN', chamber: 'Q659587', election: 'Q131309666' }, // Japan
  US: { wd: 'Q30', iso3: 'USA', chamber: 'Q11701', election: 'Q132767622' }, // United States
  CA: { wd: 'Q16', iso3: 'CAN', chamber: 'Q383590', election: 'Q108803782' }, // Canada
  IN: { wd: 'Q668', iso3: 'IND', chamber: 'Q230003', election: 'Q65042773' }, // India
};

export const PARTY_IDS = {
  // Sweden
  'SE:V': { wd: 'Q110837', pf: 830 }, // Vänsterpartiet
  'SE:S': { wd: 'Q105112', pf: 487 }, // Socialdemokraterna
  'SE:MP': { wd: 'Q213451', pf: 456 }, // Miljöpartiet
  'SE:C': { wd: 'Q110832', pf: 199 }, // Centerpartiet
  'SE:L': { wd: 'Q110857', pf: 1274 }, // Liberalerna
  'SE:KD': { wd: 'Q213654', pf: 651 }, // Kristdemokraterna
  'SE:M': { wd: 'Q110843', pf: 690 }, // Moderaterna
  'SE:SD': { wd: 'Q504069', pf: 409 }, // Sverigedemokraterna
  // Norway
  'NO:R': { wd: 'Q1512994', pf: 3698 }, // Rødt
  'NO:SV': { wd: 'Q488418', pf: 719 }, // Sosialistisk Venstreparti
  'NO:Ap': { wd: 'Q190219', pf: 448 }, // Arbeiderpartiet
  'NO:MDG': { wd: 'Q1518568', pf: 1963 }, // Miljøpartiet De Grønne
  'NO:Sp': { wd: 'Q493685', pf: 1072 }, // Senterpartiet
  'NO:V': { wd: 'Q500190', pf: 1173 }, // Venstre
  'NO:KrF': { wd: 'Q1166025', pf: 705 }, // Kristelig Folkeparti
  'NO:H': { wd: 'Q586364', pf: 503 }, // Høyre
  'NO:FrP': { wd: 'Q485665', pf: 101 }, // Fremskrittspartiet
  // Denmark
  'DK:Ø': { wd: 'Q25785', pf: 1527 }, // Enhedslisten
  'DK:F': { wd: 'Q615603', pf: 329 }, // Socialistisk Folkeparti
  'DK:Å': { wd: 'Q18042964', pf: 4070 }, // Alternativet
  'DK:A': { wd: 'Q212101', pf: 379 }, // Socialdemokratiet
  'DK:B': { wd: 'Q916161', pf: 1507 }, // Radikale Venstre
  'DK:M': { wd: 'Q107110050', pf: 9063 }, // Moderaterne
  'DK:V': { wd: 'Q217321', pf: 1204 }, // Venstre
  'DK:C': { wd: 'Q902619', pf: 536 }, // Det Konservative Folkeparti
  'DK:I': { wd: 'Q478180', pf: 212 }, // Liberal Alliance
  'DK:O': { wd: 'Q507170', pf: 1022 }, // Dansk Folkeparti
  'DK:DD': { wd: 'Q112677506', pf: 9062 }, // Danmarksdemokraterne
  'DK:BP': { wd: 'Q131933143', pf: null }, // Borgernes Parti
  // Finland
  'FI:VAS': { wd: 'Q385927', pf: 1044 }, // Vasemmistoliitto
  'FI:SDP': { wd: 'Q499029', pf: 1303 }, // Suomen Sosialidemokraattinen Puolue
  'FI:VIHR': { wd: 'Q196695', pf: 479 }, // Vihreä liitto
  'FI:KESK': { wd: 'Q506591', pf: 901 }, // Suomen Keskusta
  'FI:RKP': { wd: 'Q845537', pf: 1229 }, // Svenska folkpartiet
  'FI:KD': { wd: 'Q1138982', pf: 703 }, // Kristillisdemokraatit
  'FI:KOK': { wd: 'Q304191', pf: 495 }, // Kansallinen Kokoomus
  'FI:PS': { wd: 'Q634277', pf: 1689 }, // Perussuomalaiset
  // Iceland
  'IS:VG': { wd: 'Q1130754', pf: 457 }, // Vinstrihreyfingin – grænt framboð
  'IS:S': { wd: 'Q1141127', pf: 1396 }, // Samfylkingin
  'IS:P': { wd: 'Q198403', pf: 2048 }, // Píratar
  'IS:FF': { wd: 'Q27273216', pf: 5852 }, // Flokkur fólksins
  'IS:B': { wd: 'Q1046777', pf: 964 }, // Framsóknarflokkurinn
  'IS:C': { wd: 'Q23789296', pf: 5454 }, // Viðreisn
  'IS:M': { wd: 'Q41280154', pf: 7565 }, // Miðflokkurinn
  'IS:D': { wd: 'Q218303', pf: 363 }, // Sjálfstæðisflokkurinn
  // Austria
  'AT:GRÜNE': { wd: 'Q193178', pf: 1659 }, // Die Grünen
  'AT:SPÖ': { wd: 'Q179111', pf: 1384 }, // Sozialdemokratische Partei Österreichs
  'AT:NEOS': { wd: 'Q13564543', pf: 1970 }, // NEOS
  'AT:ÖVP': { wd: 'Q186867', pf: 1329 }, // Österreichische Volkspartei
  'AT:FPÖ': { wd: 'Q131692', pf: 463 }, // Freiheitliche Partei Österreichs
  // Belgium
  'BE:PVDA': { wd: 'Q925616', pf: 1753 }, // PVDA-PTB
  'BE:PS': { wd: 'Q645787', pf: 500 }, // Parti Socialiste
  'BE:Vooruit': { wd: 'Q939354', pf: 1680 }, // Vooruit
  'BE:Groen': { wd: 'Q513521', pf: 528 }, // Groen
  'BE:cd&v': { wd: 'Q750673', pf: 604 }, // Christen-Democratisch en Vlaams
  'BE:Engagés': { wd: 'Q840814', pf: null }, // Les Engagés
  'BE:Open VLD': { wd: 'Q1160192', pf: 49 }, // Open Vlaamse Liberalen en Democraten
  'BE:MR': { wd: 'Q533384', pf: 789 }, // Mouvement Réformateur
  'BE:N-VA': { wd: 'Q28982', pf: 36 }, // Nieuw-Vlaamse Alliantie
  'BE:VB': { wd: 'Q682990', pf: 1968 }, // Vlaams Belang
  // Bulgaria
  'BG:BSP': { wd: 'Q752259', pf: 757 }, // Bulgarian Socialist Party
  'BG:PP-DB': { wd: 'Q116769868', pf: null }, // We Continue the Change – Democratic Bulgaria
  'BG:GERB': { wd: 'Q133968', pf: 760 }, // GERB
  'BG:DPS': { wd: 'Q164242', pf: 982 }, // Movement for Rights and Freedoms
  'BG:ITN': { wd: 'Q98098908', pf: 8992 }, // There Is Such a People
  'BG:VAZ': { wd: 'Q28943121', pf: 5862 }, // Vazrazhdane
  'BG:PB': { wd: 'Q138546752', pf: null }, // Progressive Bulgaria
  // Croatia
  'HR:Možemo': { wd: 'Q96099072', pf: 8980 }, // Možemo!
  'HR:SDP': { wd: 'Q830323', pf: 1475 }, // Social Democratic Party
  'HR:HDZ': { wd: 'Q738439', pf: 1431 }, // Croatian Democratic Union
  'HR:Most': { wd: 'Q16116415', pf: 4865 }, // Most
  'HR:DP': { wd: 'Q86756923', pf: 8981 }, // Homeland Movement
  // Cyprus
  'CY:AKEL': { wd: 'Q212158', pf: 1076 }, // Progressive Party of Working People
  'CY:EDEK': { wd: 'Q259800', pf: 1028 }, // Movement for Social Democracy
  'CY:DIPA': { wd: 'Q60785287', pf: 9074 }, // Democratic Party
  'CY:DIKO': { wd: 'Q816863', pf: 635 }, // Democratic Party (DIKO)
  'CY:DISY': { wd: 'Q644973', pf: 563 }, // Democratic Rally
  'CY:ELAM': { wd: 'Q2748384', pf: 1013 }, // National Popular Front
  'CY:ALMA': { wd: 'Q139552238', pf: null }, // ALMA
  'CY:DD': { wd: 'Q138026801', pf: null }, // Direct Democracy
  // Czechia
  'CZ:Piráti': { wd: 'Q341085', pf: 2047 }, // Czech Pirate Party
  'CZ:STAN': { wd: 'Q1586610', pf: 1707 }, // Mayors and Independents
  'CZ:SPOLU': { wd: 'Q104527897', pf: null }, // SPOLU (ODS, KDU-ČSL, TOP 09)
  'CZ:ANO': { wd: 'Q10728124', pf: 2141 }, // ANO 2011
  'CZ:AUTO': { wd: 'Q29789623', pf: null }, // Motorists for Themselves
  'CZ:SPD': { wd: 'Q20058756', pf: 6125 }, // Freedom and Direct Democracy
  // Estonia
  'EE:SDE': { wd: 'Q913551', pf: 1150 }, // Social Democratic Party
  'EE:E200': { wd: 'Q56249403', pf: 7340 }, // Eesti 200
  'EE:KE': { wd: 'Q928652', pf: 533 }, // Centre Party
  'EE:RE': { wd: 'Q738947', pf: 821 }, // Reform Party
  'EE:I': { wd: 'Q163347', pf: 685 }, // Isamaa
  'EE:EKRE': { wd: 'Q794028', pf: 4094 }, // Conservative People's Party
  // France
  'FR:PCF': { wd: 'Q192821', pf: 1251 }, // Parti communiste français
  'FR:LFI': { wd: 'Q27978402', pf: 5858 }, // La France insoumise
  'FR:EELV': { wd: 'Q613786', pf: 5650 }, // Les Écologistes
  'FR:PS': { wd: 'Q170972', pf: 1478 }, // Parti socialiste
  'FR:REN': { wd: 'Q23731823', pf: 5857 }, // Renaissance
  'FR:MoDem': { wd: 'Q587370', pf: 496 }, // Mouvement démocrate
  'FR:HOR': { wd: 'Q108846587', pf: 9134 }, // Horizons
  'FR:LR': { wd: 'Q20012759', pf: 8168 }, // Les Républicains
  'FR:RN': { wd: 'Q205150', pf: 433 }, // Rassemblement national
  'FR:REC': { wd: 'Q109932430', pf: 9064 }, // Reconquête
  // Germany
  'DE:Linke': { wd: 'Q49764', pf: 1545 }, // Die Linke
  'DE:BSW': { wd: 'Q123121346', pf: 9646 }, // Bündnis Sahra Wagenknecht
  'DE:SPD': { wd: 'Q49768', pf: 383 }, // Sozialdemokratische Partei Deutschlands
  'DE:Grüne': { wd: 'Q49766', pf: 1816 }, // Bündnis 90/Die Grünen
  'DE:FDP': { wd: 'Q13124', pf: 573 }, // Freie Demokratische Partei
  'DE:CDU/CSU': { wd: 'Q708725', pf: 211 }, // CDU/CSU
  'DE:AfD': { wd: 'Q6721203', pf: 1976 }, // Alternative für Deutschland
  // Greece
  'GR:KKE': { wd: 'Q192406', pf: 48 }, // Communist Party of Greece
  'GR:PE': { wd: 'Q24204945', pf: 9088 }, // Course of Freedom
  'GR:SYRIZA': { wd: 'Q222897', pf: 301 }, // Coalition of the Radical Left
  'GR:PASOK': { wd: 'Q203934', pf: 1468 }, // Panhellenic Socialist Movement
  'GR:ND': { wd: 'Q223153', pf: 794 }, // New Democracy
  'GR:EL': { wd: 'Q50736163', pf: 7347 }, // Greek Solution
  'GR:NIKI': { wd: 'Q118559247', pf: 9126 }, // Niki
  // Hungary
  'HU:DK': { wd: 'Q847504', pf: 469 }, // Democratic Coalition
  'HU:Mom': { wd: 'Q28563736', pf: 8249 }, // Momentum Movement
  'HU:Tisza': { wd: 'Q125418097', pf: null }, // Tisza Party
  'HU:Fidesz': { wd: 'Q387006', pf: 1691 }, // Fidesz–KDNP
  'HU:MH': { wd: 'Q55443054', pf: 7349 }, // Our Homeland Movement
  // Ireland
  'IE:PBP': { wd: 'Q3545406', pf: 242 }, // People Before Profit–Solidarity
  'IE:SD': { wd: 'Q20682633', pf: 4870 }, // Social Democrats
  'IE:SF': { wd: 'Q76382', pf: 4 }, // Sinn Féin
  'IE:Lab': { wd: 'Q503614', pf: 562 }, // Labour Party
  'IE:GP': { wd: 'Q831015', pf: 1775 }, // Green Party
  'IE:FF': { wd: 'Q216517', pf: 1055 }, // Fianna Fáil
  'IE:FG': { wd: 'Q247135', pf: 1288 }, // Fine Gael
  'IE:Aontú': { wd: 'Q61090509', pf: 8642 }, // Aontú
  'IE:II': { wd: 'Q124516371', pf: null }, // Independent Ireland
  // Italy
  'IT:AVS': { wd: 'Q113168799', pf: null }, // Greens and Left Alliance
  'IT:PD': { wd: 'Q47729', pf: 802 }, // Democratic Party
  'IT:M5S': { wd: 'Q47817', pf: 2046 }, // Five Star Movement
  'IT:Azione': { wd: 'Q63926676', pf: 9082 }, // Azione
  'IT:IV': { wd: 'Q67785862', pf: 8641 }, // Italia Viva
  'IT:FI': { wd: 'Q14924303', pf: 8058 }, // Forza Italia
  'IT:Lega': { wd: 'Q85776185', pf: 1221 }, // Lega
  'IT:FdI': { wd: 'Q1757843', pf: 2280 }, // Brothers of Italy
  // Latvia
  'LV:PRO': { wd: 'Q28966907', pf: 6357 }, // Progressives
  'LV:S!': { wd: 'Q112227296', pf: 9080 }, // Stability!
  'LV:JV': { wd: 'Q98104169', pf: 9089 }, // New Unity
  'LV:ZZS': { wd: 'Q167928', pf: 701 }, // Union of Greens and Farmers
  'LV:NA': { wd: 'Q1576026', pf: 7619 }, // National Alliance
  'LV:LPV': { wd: 'Q108096403', pf: 9078 }, // Latvia First
  'LV:AS': { wd: 'Q113163582', pf: null }, // United List
  'LV:SV/AJ': { wd: 'Q113588197', pf: 9138 }, // Sovereign Power / Young Latvians
  // Lithuania
  'LT:LSDP': { wd: 'Q4362', pf: 64 }, // Social Democratic Party
  'LT:NA': { wd: 'Q124472979', pf: null }, // Dawn of Nemunas
  'LT:DSVL': { wd: 'Q110966457', pf: 9073 }, // Democrats "For Lithuania"
  'LT:LVŽS': { wd: 'Q285817', pf: 1490 }, // Farmers and Greens Union
  'LT:LRLS': { wd: 'Q1466907', pf: 1744 }, // Liberal Movement
  'LT:LP': { wd: 'Q64252730', pf: 8982 }, // Freedom Party
  'LT:TS-LKD': { wd: 'Q81556', pf: 193 }, // Homeland Union – Lithuanian Christian Democrats
  // Luxembourg
  'LU:Lénk': { wd: 'Q1270494', pf: 271 }, // Déi Lénk
  'LU:LSAP': { wd: 'Q1070311', pf: 186 }, // Luxembourg Socialist Workers' Party
  'LU:Gréng': { wd: 'Q767761', pf: 1138 }, // Déi Gréng
  'LU:Piraten': { wd: 'Q3079953', pf: 2065 }, // Pirate Party
  'LU:DP': { wd: 'Q1029792', pf: 300 }, // Democratic Party
  'LU:CSV': { wd: 'Q1344670', pf: 539 }, // Christian Social People's Party
  'LU:ADR': { wd: 'Q339280', pf: 1114 }, // Alternative Democratic Reform Party
  // Malta
  'MT:ADPD': { wd: 'Q104001229', pf: 9066 }, // Democratic Alternative
  'MT:PL': { wd: 'Q684886', pf: 808 }, // Labour Party
  'MT:PN': { wd: 'Q594056', pf: 699 }, // Nationalist Party
  // Netherlands
  'NL:SP': { wd: 'Q849580', pf: 1363 }, // Socialist Party
  'NL:GL-PvdA': { wd: 'Q110853869', pf: null }, // GroenLinks–PvdA
  'NL:D66': { wd: 'Q747910', pf: 45 }, // Democrats 66
  'NL:CDA': { wd: 'Q273749', pf: 1157 }, // Christian Democratic Appeal
  'NL:NSC': { wd: 'Q121705847', pf: 9348 }, // New Social Contract
  'NL:VVD': { wd: 'Q239333', pf: 828 }, // People's Party for Freedom and Democracy
  'NL:BBB': { wd: 'Q101083924', pf: 9010 }, // Farmer–Citizen Movement
  'NL:JA21': { wd: 'Q104244010', pf: 9011 }, // JA21
  'NL:PVV': { wd: 'Q332739', pf: 298 }, // Party for Freedom
  'NL:FvD': { wd: 'Q28163962', pf: 5855 }, // Forum for Democracy
  // Poland
  'PL:Razem': { wd: 'Q21006495', pf: 4871 }, // Razem
  'PL:Lewica': { wd: 'Q66807204', pf: null }, // The Left
  'PL:KO': { wd: 'Q136735839', pf: null }, // Civic Coalition
  'PL:PL2050': { wd: 'Q100979832', pf: 9027 }, // Poland 2050
  'PL:PSL': { wd: 'Q218477', pf: 602 }, // Polish People's Party
  'PL:PiS': { wd: 'Q156874', pf: 1565 }, // Law and Justice
  'PL:Konf.': { wd: 'Q61568052', pf: 9026 }, // Confederation
  'PL:KKP': { wd: 'Q80578532', pf: null }, // Confederation of the Polish Crown
  // Portugal
  'PT:PCP': { wd: 'Q769829', pf: 310 }, // Portuguese Communist Party
  'PT:BE': { wd: 'Q884840', pf: 1310 }, // Left Bloc
  'PT:Livre': { wd: 'Q16947563', pf: 3225 }, // Livre
  'PT:PAN': { wd: 'Q2054840', pf: 97 }, // People–Animals–Nature
  'PT:PS': { wd: 'Q847263', pf: 655 }, // Socialist Party
  'PT:PSD': { wd: 'Q595575', pf: 1359 }, // Social Democratic Party
  'PT:CDS-PP': { wd: 'Q1054298', pf: 1308 }, // CDS – People's Party
  'PT:IL': { wd: 'Q46122950', pf: 8640 }, // Liberal Initiative
  'PT:Chega': { wd: 'Q63645885', pf: 8182 }, // Chega
  // Romania
  'RO:PSD': { wd: 'Q752435', pf: 120 }, // Social Democratic Party
  'RO:PNL': { wd: 'Q686228', pf: 481 }, // National Liberal Party
  'RO:USR': { wd: 'Q27108508', pf: 5969 }, // Save Romania Union
  'RO:UDMR': { wd: 'Q266582', pf: 1105 }, // Democratic Alliance of Hungarians
  'RO:AUR': { wd: 'Q97193048', pf: 8983 }, // Alliance for the Union of Romanians
  'RO:SOS': { wd: 'Q113470144', pf: null }, // SOS Romania
  'RO:POT': { wd: 'Q130612277', pf: null }, // Party of Young People
  // Slovakia
  'SK:PS': { wd: 'Q48844389', pf: 7361 }, // Progressive Slovakia
  'SK:SaS': { wd: 'Q220847', pf: 1386 }, // Freedom and Solidarity
  'SK:Hlas': { wd: 'Q96754424', pf: 9071 }, // Hlas – Social Democracy
  'SK:Smer': { wd: 'Q821929', pf: 311 }, // Direction – Social Democracy
  'SK:OĽaNO': { wd: 'Q372043', pf: 2130 }, // Ordinary People
  'SK:KDH': { wd: 'Q904070', pf: 63 }, // Christian Democratic Movement
  'SK:SNS': { wd: 'Q221480', pf: 730 }, // Slovak National Party
  'SK:Rep.': { wd: 'Q1519778', pf: 9072 }, // Republika
  // Slovenia
  'SI:Levica': { wd: 'Q30668436', pf: 6131 }, // The Left
  'SI:SD': { wd: 'Q917211', pf: 1403 }, // Social Democrats
  'SI:GS': { wd: 'Q106704283', pf: 9067 }, // Freedom Movement
  'SI:RES': { wd: 'Q108870451', pf: 9069 }, // Resni.ca
  'SI:NSi': { wd: 'Q1258564', pf: 1618 }, // New Slovenia
  'SI:DEM': { wd: 'Q131279103', pf: null }, // Democrats
  'SI:SDS': { wd: 'Q526294', pf: 472 }, // Slovenian Democratic Party
  // Spain
  'ES:Podemos': { wd: 'Q16059622', pf: 3203 }, // Podemos
  'ES:Bildu': { wd: 'Q1029761', pf: 5668 }, // EH Bildu
  'ES:Sumar': { wd: 'Q112098527', pf: null }, // Sumar
  'ES:ERC': { wd: 'Q150068', pf: 848 }, // Republican Left of Catalonia
  'ES:PSOE': { wd: 'Q138198', pf: 1338 }, // Spanish Socialist Workers' Party
  'ES:PNV': { wd: 'Q43093', pf: 1637 }, // Basque Nationalist Party
  'ES:Junts': { wd: 'Q97155800', pf: 7421 }, // Together for Catalonia
  'ES:PP': { wd: 'Q185088', pf: 441 }, // People's Party
  'ES:Vox': { wd: 'Q15630787', pf: 3218 }, // Vox
  // United Kingdom
  'GB:Green': { wd: 'Q9669', pf: 1794 }, // Green Party
  'GB:SNP': { wd: 'Q10658', pf: 986 }, // Scottish National Party
  'GB:PC': { wd: 'Q10691', pf: 1002 }, // Plaid Cymru
  'GB:SF': { wd: 'Q76382', pf: 4 }, // Sinn Féin
  'GB:Lab': { wd: 'Q9630', pf: 1516 }, // Labour
  'GB:LD': { wd: 'Q9624', pf: 1388 }, // Liberal Democrats
  'GB:Con': { wd: 'Q9626', pf: 1567 }, // Conservatives
  'GB:DUP': { wd: 'Q215519', pf: 335 }, // Democratic Unionist Party
  'GB:Reform': { wd: 'Q104721252', pf: 7364 }, // Reform UK
  // Argentina
  'AR:FIT-U': { wd: 'Q598744', pf: 6649 }, // Left Front – Workers' Unity
  'AR:PJ': { wd: 'Q1053668', pf: 623 }, // Justicialist Party (Peronism)
  'AR:CC-ARI': { wd: 'Q1104292', pf: 1215 }, // Civic Coalition ARI
  'AR:PU': { wd: 'Q136756659', pf: null }, // Provincias Unidas
  'AR:UCR': { wd: 'Q123585', pf: 1724 }, // Radical Civic Union
  'AR:PRO': { wd: 'Q1507720', pf: 1790 }, // Republican Proposal
  'AR:LLA': { wd: 'Q129572375', pf: null }, // La Libertad Avanza
  // Japan
  'JP:JCP': { wd: 'Q641600', pf: 736 }, // Japanese Communist Party
  'JP:Reiwa': { wd: 'Q64405573', pf: 9009 }, // Reiwa Shinsengumi
  'JP:CRA': { wd: 'Q137787102', pf: null }, // Centrist Reform Alliance (CDP + Komeito)
  'JP:DPP': { wd: 'Q99527550', pf: 9006 }, // Democratic Party for the People
  'JP:LDP': { wd: 'Q232595', pf: 1746 }, // Liberal Democratic Party
  'JP:Ishin': { wd: 'Q21499745', pf: 9008 }, // Japan Innovation Party
  'JP:Sansei': { wd: 'Q113009668', pf: null }, // Sanseito
  'JP:Mirai': { wd: 'Q134414127', pf: null }, // Team Mirai
  // United States
  'US:GP': { wd: 'Q849158', pf: null }, // Green Party
  'US:Dem': { wd: 'Q29552', pf: 432 }, // Democratic Party
  'US:Rep': { wd: 'Q29468', pf: 809 }, // Republican Party
  'US:LP': { wd: 'Q558334', pf: 2291 }, // Libertarian Party
  // Canada
  'CA:NDP': { wd: 'Q130765', pf: 152 }, // New Democratic Party
  'CA:Green': { wd: 'Q691730', pf: 931 }, // Green Party
  'CA:BQ': { wd: 'Q735105', pf: 1428 }, // Bloc Québécois
  'CA:Lib': { wd: 'Q138345', pf: 1739 }, // Liberal Party
  'CA:Con': { wd: 'Q488523', pf: 1004 }, // Conservative Party
  'CA:PPC': { wd: 'Q56612740', pf: 8636 }, // People's Party
  // India
  'IN:CPI(M)': { wd: 'Q234277', pf: 893 }, // Communist Party of India (Marxist)
  'IN:AAP': { wd: 'Q129844', pf: 5180 }, // Aam Aadmi Party
  'IN:DMK': { wd: 'Q1255973', pf: 17 }, // Dravida Munnetra Kazhagam
  'IN:TMC': { wd: 'Q912899', pf: 2494 }, // All India Trinamool Congress
  'IN:SP': { wd: 'Q1546941', pf: 2491 }, // Samajwadi Party
  'IN:INC': { wd: 'Q10225', pf: 1297 }, // Indian National Congress
  'IN:BJP': { wd: 'Q10230', pf: 422 }, // Bharatiya Janata Party
};
