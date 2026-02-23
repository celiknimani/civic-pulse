
import { CATEGORIES_WITH_ALL } from './categories';
import { PartyPromise } from './types';

export const LVV_PROMISES: PartyPromise[] = [
  {
    id: '1',
    category: 'Drejtësia',
    title: 'Vetingu në Sistemin e Drejtësisë',
    description: 'Procesi i vetingut për gjyqtarë dhe prokurorë për të garantuar integritetin dhe profesionalizmin në sistemin e drejtësisë.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2025-12-31',
    updates: [
      { date: '2021-06-01', status: 'In Progress', description: 'Fillimi i hartimit të koncept-dokumentit për Vetingun.', source: 'Koha.net', sourceUrl: '#' },
      { date: '2022-09-05', status: 'In Progress', description: 'Dërgimi i amendamenteve kushtetuese në Gjykatën Kushtetuese.', source: 'Betimi për Drejtësi', sourceUrl: '#' },
      { date: '2023-01-20', status: 'Delayed', description: 'Vonesa në miratimin e opinionit nga Komisioni i Venecias.', source: 'Radio Evropa e Lirë', sourceUrl: '#' }
    ]
  },
  {
    id: '2',
    category: 'Siguria',
    title: 'Ushtria e Kosovës',
    description: 'Rritja e buxhetit për FSK-në në mbi 100 milionë euro dhe blerja e armatimit modern.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2024-12-31',
    updates: [
      { date: '2022-01-01', status: 'In Progress', description: 'Buxheti i FSK-së rritet në 102 milionë euro.', source: 'Ministria e Mbrojtjes', sourceUrl: '#' },
      { date: '2023-05-15', status: 'Completed', description: 'Blerja e dronëve Bayraktar TB2 dhe sistemeve të tjera të mbrojtjes.', source: 'Kryeministri i Kosovës', sourceUrl: '#' }
    ]
  },
  {
    id: '3',
    category: 'Mirëqenia',
    title: 'Shtesat për Fëmijë',
    description: 'Implementimi i skemës për shtesat e fëmijëve dhe lehonave për të gjitha familjet në Kosovë.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2021-12-31',
    updates: [
      { date: '2021-07-01', status: 'In Progress', description: 'Fillimi i aplikimit për fëmijët e lindur në vitin 2021.', source: 'MFPT', sourceUrl: '#' },
      { date: '2021-11-01', status: 'Completed', description: 'Zgjerimi i skemës për fëmijët e moshave të tjera.', source: 'Kallxo.com', sourceUrl: '#' }
    ]
  },
  {
    id: '4',
    category: 'Ekonomia',
    title: 'Banka Zhvillimore',
    description: 'Themelimi i Bankës Zhvillimore për të mbështetur bizneset dhe projektet strategjike.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2025-02-01',
    updates: [
        { date: '2022-03-10', status: 'Pending', description: 'Diskutimet fillestare me partnerët ndërkombëtarë.' },
        { date: '2024-01-15', status: 'Delayed', description: 'Mungesa e kornizës ligjore të nevojshme.' }
    ]
  },
    {
    id: '5',
    category: 'Arsimi',
    title: 'Digjitalizimi i Shkollave',
    description: 'Pajisja e shkollave me teknologji moderne dhe internet të shpejtë.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-09-01',
    dueDate: '2025-06-01',
    updates: [
        { date: '2022-09-01', status: 'In Progress', description: 'Pilot projekti në 50 shkolla.' },
    ]
  },
  {
    id: '6',
    category: 'Shëndetësia',
    title: 'Sigurimet Shëndetësore',
    description: 'Funksionalizimi i plotë i Fondit të Sigurimeve Shëndetësore.',
    status: 'In Progress',
    progress: 25,
    startDate: '2021-03-22',
    dueDate: '2024-12-31',
    updates: [
        { date: '2023-01-01', status: 'Delayed', description: 'Rishikimi i sistemit të informimit shëndetësor.' },
        { date: '2026-02-12', status: 'In Progress', description: 'Qeveria miratoi projektligjin për ratifikimin e marrëveshjes së kredisë për projektin KOMPAS për forcimin e sistemit të shëndetësisë (18.6 milionë euro).', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '7',
    category: 'Ekonomia',
    title: 'Fond Sovran',
    description: 'Krijimi i Fondit Sovran për menaxhimin e aseteve strategjike të Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-06-01',
    dueDate: '2025-01-01',
    updates: [
        { date: '2023-05-10', status: 'In Progress', description: 'Miratimi i Ligjit për Fondin Sovran në Kuvend.' },
        { date: '2023-12-05', status: 'Delayed', description: 'Bllokimi nga Gjykata Kushtetuese pas ankesës së opozitës.' }
    ]
  },

  {
    id: '8',
    category: 'Siguria',
    title: '1 Miliard Euro në armatim',
    description: 'Investimi prej 1 miliard euro në armatim dhe pajisje moderne ushtarake për Forcën e Sigurisë së Kosovës.',
    status: 'In Progress',
    progress: 45,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: [
        { date: '2025-01-15', status: 'In Progress', description: 'Prezantimi i planit strategjik të mbrojtjes 2025-2029.', source: 'Ministria e Mbrojtjes', sourceUrl: '#' },
        { date: '2026-02-17', status: 'In Progress', description: 'Në ceremoninë e parakalimit për 18-vjetorin e Pavarësisë, Kryeministri deklaroi se investimi në pajisje ushtarake ka kaluar 450 milionë euro.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/fjala-e-plote-e-kryeministri-kurti-ne-ceremonine-e-parakalimit-te-trupave-te-forces-se-sigurise-se-kosoves-dhe-njesive-te-policise-se-kosoves-per-nder-te-18-vjetorit-te-pavaresise/' }
    ]
  },
  {
    id: '9',
    category: 'Siguria',
    title: 'Fabrika e Municionit dhe Dronëve',
    description: 'Ndërtimi i fabrikës së parë shtetërore për prodhimin e municionit dhe dronëve ushtarakë.',
    status: 'In Progress',
    progress: 20,
    startDate: '2025-03-01',
    dueDate: '2027-06-01',
    updates: [
        { date: '2025-11-03', status: 'In Progress', description: 'Ministria e Mbrojtjes e ka konfirmuar se kompania gjigante turke e prodhimit të municionit “MKE”, pritet që gjatë vitit 2026 ta funksionalizojë fabrikën për prodhimin e plumbave “Made in Kosova” në territorin e Kosovës. Kapaciteti i saj pritet të jetë rreth 20 milionë fishekë në vit, dhe do të prodhojë plumba të kalibrit 5.56 mm e 7.62 mm, një herë për nevoja të brendshme e pastaj edhe për shitje dhe eksport.', source: 'Dukagjini', sourceUrl: 'https://www.dukagjini.com/me-2026-pritet-ndertimi-i-fabrikes-turke-te-municionit-rreth-20-milione-fisheke-ne-vit/' },
        { date: '2026-02-17', status: 'In Progress', description: 'Në fjalën zyrtare për 18-vjetorin e Pavarësisë u konfirmua se ka nisur zhvillimi i industrisë së mbrojtjes me fabrikën e municioneve.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/fjala-e-plote-e-kryeministri-kurti-ne-ceremonine-e-parakalimit-te-trupave-te-forces-se-sigurise-se-kosoves-dhe-njesive-te-policise-se-kosoves-per-nder-te-18-vjetorit-te-pavaresise/' }
    ]
  },
  {
    id: '10',
    category: 'Siguria',
    title: 'Programi i Rezervës Vullnetare',
    description: 'Krijimi dhe funksionalizimi i plotë i Programit të Rezervës Vullnetare për ushtrinë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2026-01-01',
    updates: [
        { date: '2024-11-05', status: 'In Progress', description: 'Hapja e konkursit për rekrutët e parë vullnetarë.', source: 'Ministria e Mbrojtjes', sourceUrl: '#' }
    ]
  },
  {
    id: '11',
    category: 'Infrastruktura',
    title: '400 Milion Euro për pesë diga të reja',
    description: 'Ndërtimi i pesë digave të reja në Firajë, Dragaqinë, Pollatë, Desivojcë dhe Kuqicë.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2029-12-31',
    updates: []
  },
  {
    id: '12',
    category: 'Ekonomia',
    title: '1 Miliard Euro në Prodhim dhe Industri',
    description: 'Investime direkte dhe mbështetje financiare prej 1 miliard euro për sektorin e prodhimit dhe industrisë për të rritur eksportet dhe punësimin.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '13',
    category: 'Ekonomia',
    title: 'Amortizimi i Përshpejtuar',
    description: 'Aplikimi i amortizimit të përshpejtuar për investimet e reja për të nxitur modernizimin e teknologjisë dhe zgjerimin e kapaciteteve prodhuese.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '14',
    category: 'Ekonomia',
    title: 'Arkat Fiskale Digjitale',
    description: 'Kalimi në sistemin e arkave fiskale digjitale (software-based) për raportim në kohë reale dhe ulje të kostos për biznese.',
    status: 'Delayed',
    progress: 10,
    startDate: '2023-01-01',
    dueDate: '2025-12-31',
    updates: [
      { date: '2025-07-14', status: 'In Progress', description: 'Publikohet Udhëzuesi Nr. 01/2025 për procedurat dhe formën e fiskalizimit të bllokave tatimorë.', source: 'Administrata Tatimore e Kosovës', sourceUrl: 'https://www.atk-ks.org/portfolio/legjislacioni-perkates/' },
      { date: '2026-02-12', status: 'In Progress', description: 'Qeveria miratoi projektligjin për ratifikimin e marrëveshjes së financimit me fokus në efektivitetin fiskal, konkurrueshmëri dhe rritje të gjelbër (program me Bankën Botërore).', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '15',
    category: 'Ekonomia',
    title: 'Fatura Elektronike Biznes-Biznes',
    description: 'Implementimi i sistemit të faturimit elektronik (e-Fatura) për transaksionet B2B për të luftuar informalitetin.',
    status: 'In Progress',
    progress: 15,
    startDate: '2025-06-01',
    dueDate: '2027-01-01',
    updates: [
      { date: '2026-02-12', status: 'In Progress', description: 'Qeveria miratoi marrëveshje financimi për politikat zhvillimore me komponentë të efektivitetit fiskal dhe formalizimit ekonomik, relevante për avancimin e e-Faturës B2B.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '16',
    category: 'Ekonomia',
    title: 'Mbledhja e TVSH-së në Brendësi',
    description: 'Ndryshimi i mbledhjes së TVSH-së nga kufiri në brendësi dhe pagesa e TVSH-së në muajin pasues për të ndihmuar likuiditetin e bizneseve.',
    status: 'In Progress',
    progress: 15,
    startDate: '2022-01-01',
    dueDate: '2025-01-01',
    updates: [
      { date: '2026-02-12', status: 'In Progress', description: 'Miratimi i programit të financimit për efektivitet fiskal sinjalizon hapa drejt reformave të administrimit tatimor, përfshirë masat që lidhen me mbledhjen e TVSH-së në brendësi.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '17',
    category: 'Ekonomia',
    title: 'Heqja e Taksës Doganore për Vetura (BE)',
    description: 'Heqja e taksës doganore prej 10% për të gjitha veturat e importuara nga vendet e Bashkimit Evropian.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-01-01',
    dueDate: '2022-06-01',
    updates: []
  },
  {
    id: '18',
    category: 'Ekonomia',
    title: 'Çmimet Tavan',
    description: 'Vendosja e çmimeve tavan për produktet esenciale dhe naftën gjatë periudhave të krizave inflacioniste.',
    status: 'In Progress',
    progress: 20,
    startDate: '2022-03-01',
    dueDate: '2023-03-01',
    updates: [
      {
        date: '2026-02-20',
        status: 'In Progress',
        description:
          'Në mbledhjen e dytë të Qeverisë u miratua Programi i Projektligjeve 2026-2028, ku përfshihet Projektligji i ri për Çmimet Tavan si zotim i planifikuar për procedim.',
        source: 'Prime Minister - Albin Kurti on Facebook',
        sourceUrl:
          'https://www.facebook.com/albini2017/posts/pfbid0mmY2U5aGz12SrCkyawdispZrfnACtPuw3KqyQtrdJhekFisftLzvhYs8oyEYUba6l'
      }
    ]
  },
  {
    id: '19',
    category: 'Inovacioni',
    title: 'Valuta Digjitale e Kosovës',
    description: 'Hulumtimi dhe zhvillimi i mundësisë për krijimin e valutës digjitale kombëtare për të lehtësuar pagesat elektronike.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '20',
    category: 'Inovacioni',
    title: 'ICT Tower',
    description: 'Ndërtimi i kullës së teknologjisë (ICT Tower) si qendër e ekselencës për kompanitë e teknologjisë dhe startup-et.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-09-01',
    dueDate: '2027-12-31',
    updates: []
  },
  {
    id: '21',
    category: 'Inovacioni',
    title: 'Mbështetje për industrinë e IT-së',
    description: 'Grante dhe lehtësira fiskale për kompanitë e IT-së për të rritur eksportin e shërbimeve digjitale.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '22',
    category: 'Inovacioni',
    title: 'Fondi i Inovacionit dhe Rinia',
    description: 'Krijimi i Fondit të Inovacionit me vlerë 10 milionë euro për të mbështetur idetë inovative të të rinjve.',
    status: 'In Progress',
    progress: 15,
    startDate: '2022-06-01',
    dueDate: '2023-06-01',
    updates: [
      {
        date: '2026-02-23',
        status: 'In Progress',
        description: 'Ministrja e Tregtisë dhe Industrisë njoftoi nënshkrimin e kërkesës për përshpejtimin e miratimit të Projektligjit për Inovacion dhe Ndërmarrësi, duke e lidhur atë me krijimin e Fondit për Inovacion.',
        source: 'Ministrja e Tregtisë dhe Industrisë - Mimoza Kusari-Lila (Facebook)',
        sourceUrl: 'https://www.facebook.com/mimozakusari/posts/pfbid027Sg4ZvzriSrwT3cKH8pQ1ww3ZmNwhb7UFgqHxDisSJ9Tchk6kzyHmGE5zCNUPwxsl'
      }
    ]
  },
  {
    id: '23',
    category: 'Inovacioni',
    title: 'Parqet e Inovacionit',
    description: 'Themelimi i parqeve të inovacionit dhe teknologjisë në 7 qendrat kryesore të Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '24',
    category: 'Mirëqenia',
    title: 'Biletë 10 Euro / muaj',
    description: 'Biletë mujore e integruar prej 10 Euro për transport publik në tërë territorin e Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-05-01',
    dueDate: '2026-05-01',
    updates: []
  },
  {
    id: '25',
    category: 'Turizmi',
    title: '500 Milion për Brezovicën',
    description: 'Investim madhor prej 500 milionë euro për transformimin e Brezovicës në qendër turistike ndërkombëtare.',
    status: 'Pending',
    progress: 0,
    startDate: '2026-01-01',
    dueDate: '2030-01-01',
    updates: []
  },
  {
    id: '26',
    category: 'Turizmi',
    title: 'Qendra Turistike Dukagjini',
    description: 'Zhvillimi i Qendrës Turistike "Dukagjini" për të promovuar turizmin malor dhe kulturor në rajon.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-08-01',
    dueDate: '2028-08-01',
    updates: []
  },
  {
    id: '27',
    category: 'Diaspora',
    title: 'Dritarja për Investime të Diasporës',
    description: 'Mekanizëm mbështetës që ofron deri në 100 milionë euro për investime nga diaspora që realizohen në Kosovë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2028-12-31',
    updates: []
  },
  {
    id: '28',
    category: 'Ekonomia',
    title: 'Anëtarësimi në SEPA',
    description: 'Anëtarësimi në Zonën e Teke të Pagesave në Euro (SEPA) për të ulur kostot e remitencave dhe transaksioneve.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2025-12-31',
    updates: []
  },
  {
    id: '29',
    category: 'Diaspora',
    title: 'Gjuha Shqipe për fëmijët e mërgatës',
    description: 'Program i veçantë për mësimin e gjuhës shqipe dhe kulturës kombëtare për fëmijët e diasporës.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-09-01',
    dueDate: '2023-09-01',
    updates: []
  },
  {
    id: '30',
    category: 'Diaspora',
    title: 'Digjitalizimi i Shërbimeve Konsullore',
    description: 'Ofrimi i plotë digjital i shërbimeve konsullore për të hequr nevojën e prezencës fizike në ambasada.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-01-01',
    dueDate: '2025-06-01',
    updates: []
  },
  {
    id: '31',
    category: 'Diaspora',
    title: 'Kthimi i shtetësisë së humbur',
    description: 'Lehtësimi i procedurave dhe heqja e barrierave burokratike për rikthimin e shtetësisë për pjesëtarët e diasporës.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-06-01',
    dueDate: '2022-06-01',
    updates: []
  },
  {
    id: '32',
    category: 'Mirëqenia',
    title: 'Mbështetje për Gjyshërit Pensionistë',
    description: 'Nëse dy prindërit janë pa punë, gjyshërit pensionistë do të marrin 100 euro shtesë në muaj mbi pensionin.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-09-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '33',
    category: 'Mirëqenia',
    title: 'Mbështetje për Nënat e Reja',
    description: '500 euro në muaj për 6 muaj (gjithsej 3000 euro) për çdo nënë lehonë të papunë, përveç shtesave mujore për fëmijët.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '34',
    category: 'Mirëqenia',
    title: 'Rritja e Shtesave për Fëmijë',
    description: 'Rritja e shtesave për fëmijë nga 30 në 60 euro, dhe nga 45 në 90 euro për çdo fëmijë.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-04-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '35',
    category: 'Ekonomia',
    title: 'Superpuna për Gratë',
    description: 'Subvencionim i pagës minimale prej 500 euro për 6 muaj për gratë e punësuara përmes platformës Superpuna.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '36',
    category: 'Ekonomia',
    title: 'Paga Minimale 500 Euro',
    description: 'Rritja e pagës minimale në 500 euro për të siguruar një standard më të lartë jetese për punëtorët.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '37',
    category: 'Ekonomia',
    title: '6000 Euro Fitim të Liruara',
    description: 'Lirimi nga tatimi për 6000 eurot e para të fitimit vjetor për bizneset e vogla.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '38',
    category: 'Ekonomia',
    title: 'Paga Mesatare Sektori Publik 1000 Euro',
    description: 'Rritja e pagës mesatare në sektorin publik në 1000 euro.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '39',
    category: 'Ekonomia',
    title: 'Fondi i Sigurimeve Shoqërore',
    description: 'Themelimi dhe funksionalizimi i Fondit të Sigurimeve Shoqërore për të garantuar mbrojtje sociale për të gjithë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '40',
    category: 'Ekonomia',
    title: '200 Inspektorë të Punës',
    description: 'Rritja e numrit të inspektorëve të punës në 200 për të mbrojtur të drejtat e punëtorëve dhe sigurinë në punë.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2025-12-31',
    updates: []
  },
  {
    id: '41',
    category: 'Arsimi',
    title: 'Bursa për studentët në STEM',
    description: 'Ndarja e bursave për të gjithë studentët e fushave STEM, përfshirë ata në universitete private, për të nxitur shkencën dhe teknologjinë.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-10-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '42',
    category: 'Arsimi',
    title: 'Rishikimi i Teksteve Shkollore',
    description: 'Proces gjithëpërfshirës për rishikimin dhe përmirësimin e teksteve shkollore për të eliminuar gabimet dhe modernizuar përmbajtjen.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2026-09-01',
    updates: []
  },
  {
    id: '43',
    category: 'Arsimi',
    title: 'Bonuse për Mësimdhënie në Distancë',
    description: 'Bonuse financiare të veçanta për mësimdhënësit që punojnë në komuna të largëta dhe zona të thella malore.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-09-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '44',
    category: 'Arsimi',
    title: 'Licencim i Avancuar dhe Rritje Page',
    description: 'Sistem i ri i licencimit të avancuar për mësimdhënës, i lidhur drejtpërdrejt me rritje të konsiderueshme të pagës bazuar në performancë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '45',
    category: 'Arsimi',
    title: 'Bono për Kopshte (Publike/Jopublike)',
    description: 'Implementimi i sistemit të bonove (vouchers) për prindërit për të subvencionuar kostot e kopshteve, të vlefshme në sektorin publik dhe atë privat.',
    status: 'In Progress',
    progress: 30,
    startDate: '2026-01-01',
    dueDate: '2028-01-01',
    updates: [
      { date: '2026-02-12', status: 'In Progress', description: 'Qeveria miratoi projektligjin për ratifikimin e marrëveshjes së kredisë për projektin “Edukimi në Fëmijërinë e Hershme dhe Kujdesi për Kapitalin Njerëzor të Kosovës”, që mbështet qasjen në shërbimet e hershme edukative.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '46',
    category: 'Arsimi',
    title: 'Mësim Plotësues',
    description: 'Organizimi i mësimit plotësues për të gjitha shkollat për të kompensuar ngecjet në nxënie dhe për të përkrahur nxënësit me vështirësi.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-09-01',
    dueDate: '2025-06-01',
    updates: []
  },
  {
    id: '47',
    category: 'Arsimi',
    title: '5 Gjimnaze të Specializuara',
    description: 'Ndërtimi dhe funksionalizimi i 5 gjimnazeve të specializuara (Matematikë, Gjuhë, Arte, Sport, IT) në qendrat kryesore.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2028-09-01',
    updates: []
  },
  {
    id: '48',
    category: 'Arsimi',
    title: 'Mësimi Gjithëditor',
    description: 'Pilotoimi dhe zgjerimi i mësimit gjithëditor me fokus në aktivitete sportive, artistike dhe digjitale.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-09-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '49',
    category: 'Arsimi',
    title: 'Program për fëmijët me nevoja të veçanta',
    description: 'Zgjerimi i programit mbështetës me asistentë dhe materiale didaktike për fëmijët me nevoja të veçanta në shkolla të rregullta.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-09-01',
    dueDate: '2025-06-01',
    updates: []
  },
  {
    id: '50',
    category: 'Arsimi',
    title: 'Arsimi Profesional Dual',
    description: 'Zgjerimi i sistemit dual të arsimit dhe aftësimit profesional në bashkëpunim me sektorin privat për punësim të garantuar.',
    status: 'In Progress',
    progress: 15,
    startDate: '2022-09-01',
    dueDate: '2026-09-01',
    updates: [
      {
        date: '2026-01-27',
        status: 'In Progress',
        description: 'MASHTI zhvilloi trajnimin e trajnuesve per instruktoret e mesimit dual, si hap per zbatimin praktik te arsimit profesional dual.',
        source: 'MASHTI',
        sourceUrl: 'https://masht.rks-gov.net/en/trajnimi-i-trajnuesve-per-instruktoret-e-mesimit-dual'
      }
    ]
  },
  {
    id: '51',
    category: 'Arsimi',
    title: 'Digjitalizimi i Materialeve Shkollore',
    description: 'Digjitalizimi i plotë i certifikatave, diplomave dhe materialeve mësimore për të lehtësuar qasjen dhe administrimin.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '52',
    category: 'Arsimi',
    title: 'Mbështetje për Kërkim Shkencor',
    description: 'Rritja e fondeve për kërkim shkencor në Universitetin e Prishtinës dhe universitetet tjera publike.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '53',
    category: 'Arsimi',
    title: 'Konvikt i Ri në Qendrën e Studentëve',
    description: 'Ndërtimi i një konvikti të ri modern në Qendrën e Studentëve për të rritur kapacitetet akomoduese.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2027-09-01',
    updates: []
  },
  {
    id: '54',
    category: 'Shëndetësia',
    title: 'Check-up për çdo qytetar',
    description: 'Ofrimi i kontrollave mjekësore periodike falas (Check-up) për të gjithë qytetarët për parandalimin e hershëm të sëmundjeve.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-01-01',
    updates: []
  },
  {
    id: '55',
    category: 'Shëndetësia',
    title: 'Shërbime Mjekësore Specialistike',
    description: 'Zgjerimi i gamës së shërbimeve specialistike në qendrat e mjekësisë familjare dhe spitalet rajonale.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '56',
    category: 'Shëndetësia',
    title: 'Spital i ri në Mitrovicë dhe Ferizaj',
    description: 'Ndërtimi i spitaleve të reja moderne në Mitrovicë dhe Ferizaj për të përmirësuar infrastrukturën spitalore.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2028-12-31',
    updates: []
  },
  {
    id: '57',
    category: 'Shëndetësia',
    title: 'Poliklinika Specialistike',
    description: 'Ndërtimi i poliklinikave specialistike në Drenas, Sharr, Podujevë, Viti, Rahovec dhe Leposaviq.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-09-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '58',
    category: 'Shëndetësia',
    title: 'Poliklinika Stomatologjike',
    description: 'Funksionalizimi i poliklinikave stomatologjike në Prishtinë, Pejë, Gjakovë, Prizren, Gjilan, Mitrovicë, Ferizaj dhe Podujevë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '59',
    category: 'Shëndetësia',
    title: 'Ndërtimi i Laboratorëve Publikë',
    description: 'Ndërtimi dhe pajisja e laboratorëve të rinj publikë për të rritur kapacitetet diagnostikuese në sistemin shëndetësor.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-04-01',
    dueDate: '2027-04-01',
    updates: []
  },
  {
    id: '60',
    category: 'Shëndetësia',
    title: 'Lista e Barnave të Rimbursueshme',
    description: 'Përditësimi dhe zgjerimi i listës së barnave të rimbursueshme për të mbuluar më shumë terapi kronike dhe esenciale.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2025-12-31',
    updates: []
  },
  {
    id: '67',
    category: 'Infrastruktura',
    title: 'Ndërtimi i Rezervuarëve të Ujit',
    description: 'Ndërtimi i rezervuarëve të ujit në Firajë, Pollatë, Kuqicë, Dragtaqinë dhe Desivojcë për të siguruar furnizim të qëndrueshëm.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '68',
    category: 'Infrastruktura',
    title: 'Kanalizim Modern në Fshatra',
    description: 'Ndërtimi i impianteve biologjike dhe sistemeve moderne të kanalizimit në zonat rurale.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-12-31',
    updates: []
  },
  {
    id: '69',
    category: 'Infrastruktura',
    title: 'Mbrojtja e Lumenjve',
    description: 'Investime në rregullimin e shtretërve të lumenjve dhe masa mbrojtëse kundër vërshimeve dhe ndotjes.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '76',
    category: 'Infrastruktura',
    title: 'Hekurudha Gjakovë - Shkodër',
    description: 'Nisja e projektit të hekurudhës që lidh Gjakovën me Shkodrën dhe modernizimi i linjave Prizren-Ferizaj dhe Gjilan-Bujanoc.',
    status: 'Pending',
    progress: 0,
    startDate: '2026-01-01',
    dueDate: '2030-01-01',
    updates: []
  },
  {
    id: '77',
    category: 'Infrastruktura',
    title: 'Autostrada Prishtinë - Gjilan - Dheu i Bardhë',
    description: 'Përfundimi i plotë i autostradës nga Prishtina në Gjilan dhe lidhja deri te Dheu i Bardhë.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-01-01',
    dueDate: '2025-12-31',
    updates: []
  },
  {
    id: '78',
    category: 'Infrastruktura',
    title: 'Rruga Prizren - Tetovë',
    description: 'Përfundimi i projektit të rrugës që lidh Prizrenin me Tetovën, duke shkurtuar distancën me Maqedoninë e Veriut.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '79',
    category: 'Infrastruktura',
    title: 'Rruga e Dukagjinit',
    description: 'Ndërtimi i Rrugës së Dukagjinit që lidh Prizrenin, Rahovecin, Gjakovën dhe Deçanin me Pejën e Istogun.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2029-06-01',
    updates: []
  },
  {
    id: '80',
    category: 'Infrastruktura',
    title: 'Rruga Dollc - Gjakovë e Kijevë - Zahaq',
    description: 'Përfundimi i projekteve rrugore Dollc-Gjakovë dhe Kijevë-Zahaq për të përmirësuar lidhjen rajonale.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '81',
    category: 'Infrastruktura',
    title: 'Përmirësimi i Rrugëve Ndërkufitare',
    description: 'Modernizimi dhe zgjerimi i rrugëve lidhëse në pikat kufitare për të lehtësuar qarkullimin.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '82',
    category: 'Infrastruktura',
    title: 'Infrastruktura në Qendra Historike',
    description: 'Revitalizimi i infrastrukturës në qendrat historike të qyteteve për të ruajtur trashëgiminë dhe nxitur turizmin.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-06-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '83',
    category: 'Infrastruktura',
    title: 'Ndriçimi i Autostradave',
    description: 'Instalimi i sistemit modern dhe efikas të ndriçimit në të gjitha autostradat e Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '84',
    category: 'Infrastruktura',
    title: 'Porti i Thatë',
    description: 'Ndërtimi dhe funksionalizimi i Portit të Thatë për të lehtësuar tregtinë dhe transportin e mallrave.',
    status: 'Pending',
    progress: 0,
    startDate: '2026-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '85',
    category: 'Ekonomia',
    title: 'Projekte Kapitale - 1 Miliard Euro',
    description: 'Investim masiv prej 1 miliard euro në projekte kapitale strategjike për zhvillim ekonomik dhe infrastrukturor.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '61',
    category: 'Ekonomia',
    title: 'Certifikimi - Treg i Garantuar',
    description: 'Krijimi i sistemit të certifikimit për produktet bujqësore dhe sigurimi i tregut të garantuar për fermerët e certifikuar.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2027-06-01',
    updates: []
  },
  {
    id: '62',
    category: 'Ekonomia',
    title: 'Aplikime për Grante Gjatë Tërë Vitit',
    description: 'Reformimi i sistemit të granteve për të mundësuar aplikimin e vazhdueshëm gjatë gjithë vitit, duke hequr afatet e ngushta.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '63',
    category: 'Ekonomia',
    title: 'Grante për Fermerët e Papërkrahur',
    description: 'Skemë e veçantë e granteve për fermerët e vegjël dhe ata që nuk kanë përfituar më parë nga mbështetja shtetërore.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '64',
    category: 'Ekonomia',
    title: 'Aplikim Online për Subvencione',
    description: 'Digjitalizimi i plotë i procesit të aplikimit për subvencione në bujqësi për të eliminuar burokracinë.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2025-06-01',
    updates: []
  },
  {
    id: '65',
    category: 'Ekonomia',
    title: 'Karta e-Fermeri',
    description: 'Pajisja e fermerëve me Kartën e-Fermeri për qasje të lehtë në shërbime, subvencione dhe zbritje në derivate.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '66',
    category: 'Ekonomia',
    title: 'Rrjeti i Ujitjes',
    description: 'Zgjerimi dhe modernizimi i rrjetit të ujitjes për tokat bujqësore në të gjithë territorin e Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '70',
    category: 'Energjia',
    title: 'Ngrohja Qendrore në të Gjitha Rajonet',
    description: 'Zgjerimi i sistemit të ngrohjes qendrore në të gjitha qendrat kryesore rajonale për efiçiencë energjetike dhe mbrojtje të mjedisit.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2029-12-31',
    updates: []
  },
  {
    id: '71',
    category: 'Energjia',
    title: '150 Milion Euro për Izolim',
    description: 'Fond prej 150 milionë euro për mbështetjen e familjeve në nevojë për izolimin e shtëpive dhe rritjen e efiçiencës energjetike.',
    status: 'In Progress',
    progress: 20,
    startDate: '2025-01-01',
    dueDate: '2028-01-01',
    updates: [
      {
        date: '2025-12-16',
        status: 'In Progress',
        description: 'Nis perzgjedhja e perfituesve finale per skemen e mbeshtetjes per eficience te energjise per shtepi familjare.',
        source: 'Ministria e Ekonomise',
        sourceUrl: 'https://me.rks-gov.net/lajmet/dec16-selection-of-final-beneficiaries-of-the-energy-efficiency-support-scheme-for-family-houses-begins/'
      },
      {
        date: '2026-01-31',
        status: 'In Progress',
        description: 'Ministria e Ekonomise hapi thirrjen publike per skemen mbeshtetese per pajisje me eficience te energjise ne kuader te Kosovo Compact.',
        source: 'Ministria e Ekonomise',
        sourceUrl: 'https://me.rks-gov.net/lajmet/jan31-public-call-for-the-energy-efficient-appliances-support-scheme-through-the-kosovo-compact/'
      }
    ]
  },
  {
    id: '72',
    category: 'Energjia',
    title: 'Renovimi i 400 Ndërtesave Publike',
    description: 'Renovimi i 400 ndërtesave të administratës qendrore dhe komunale për të rritur efiçiencën energjetike.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '73',
    category: 'Energjia',
    title: 'Rinovimi i Banesave Shumëkatëshe',
    description: 'Projekt për rinovimin e banesave shumëkatëshe me masa të efiçiencës energjetike (fasada, dritare, kulme).',
    status: 'In Progress',
    progress: 10,
    startDate: '2024-06-01',
    dueDate: '2027-06-01',
    updates: [
      {
        date: '2026-01-24',
        status: 'In Progress',
        description: 'U mbajt sesioni final informues per skemen e granteve per energji te paster ne Prishtine.',
        source: 'Ministria e Ekonomise',
        sourceUrl: 'https://me.rks-gov.net/en/blog/first-final-information-session-on-clean-energy-grant-scheme-held-in-prishtina/'
      }
    ]
  },
  {
    id: '74',
    category: 'Energjia',
    title: '50 Milion Euro për Burime Natyrore',
    description: 'Investim prej 50 milionë euro për skanimin dhe identifikimin e burimeve të reja natyrore dhe energjetike.',
    status: 'In Progress',
    progress: 10,
    startDate: '2025-09-01',
    dueDate: '2027-09-01',
    updates: [
      {
        date: '2025-12-16',
        status: 'In Progress',
        description: 'U lansua kerkesa per propozime per ankandin e pare te energjise se eres ne Kosove deri ne 100 MW.',
        source: 'Ministria e Ekonomise',
        sourceUrl: 'https://me.rks-gov.net/en/blog/request-for-proposals-launched-for-kosovos-first-wind-energy-auction-up-to-100-mw/'
      }
    ]
  },
  {
    id: '75',
    category: 'Energjia',
    title: 'Bashkëinvestitor i Ri në Trepçë',
    description: 'Bërja e Trepçës me bashkëinvestitor të ri strategjik për të rritur prodhimin dhe përpunimin e mineraleve.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-04-01',
    dueDate: '2028-04-01',
    updates: []
  },
  {
    id: '86',
    category: 'Sporti',
    title: 'Renovimi i Pallatit të Rinisë',
    description: 'Renovimi i tërësishëm i Pallatit të Rinisë dhe Sporteve për ta rikthyer në funksion të plotë për sportistët dhe rininë.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2027-09-01',
    updates: []
  },
  {
    id: '87',
    category: 'Sporti',
    title: 'Qendra Akuatike Olimpike',
    description: 'Ndërtimi i Qendrës Akuatike dhe pishinës gjysmë-olimpike për zhvillimin e sporteve të ujit.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '88',
    category: 'Sporti',
    title: '250 Milion Euro për Stadiume',
    description: 'Investim madhor prej 250 milionë euro për ndërtimin dhe renovimin e stadiumeve, përfshirë ndërtimin e Stadiumit Kombëtar.',
    status: 'In Progress',
    progress: 12,
    startDate: '2025-01-01',
    dueDate: '2029-01-01',
    updates: [
      {
        date: '2026-02-23',
        status: 'In Progress',
        description:
          'Sipas postimit të Kryetarit të Drenasit, në projekt-buxhetin e Ministrisë së Sportit është planifikuar projekti “Stadiumi Nacional i Futbollit” (4M€ në 2026, 5M€ në 2027, 6M€ në 2028), ndërsa është ngritur shqetësimi për paqartësi rreth lokacionit të zbatimit.',
        source: 'Ramiz Lladrovci on Facebook',
        sourceUrl:
          'https://www.facebook.com/story.php?story_fbid=10237740082955337&id=1653723698&mibextid=wwXIfr&rdid=tPW0XVqlHificCcv#'
      }
    ]
  },
  {
    id: '89',
    category: 'Sporti',
    title: 'Mbështetje për Klubet e Vajzave',
    description: 'Buxhet i dedikuar dhe mbështetje financiare për klubet sportive të vajzave për të nxitur barazinë gjinore në sport.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2028-12-31',
    updates: []
  },
  {
    id: '90',
    category: 'Sporti',
    title: 'Licencimi dhe Mbështetja e Trajnerëve',
    description: 'Krijimi i sistemit të licencimit dhe mbështetje financiare për trajnerët për të ngritur cilësinë e stërvitjes sportive.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '91',
    category: 'Arti',
    title: '200 Milion Euro për Sektorin Kreativ',
    description: 'Investim prej 200 milionë euro për të bërë Kosovën qendër rajonale të festivaleve, marketingut, arkitekturës, librit, artit, dizajnit dhe ICT-së.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2029-06-01',
    updates: []
  },
  {
    id: '92',
    category: 'Arti',
    title: 'Pronësia Intelektuale',
    description: 'Forcimi i kornizës ligjore dhe mekanizmave për mbrojtjen e pronësisë intelektuale dhe të drejtave të autorit.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-01-01',
    updates: []
  },
  {
    id: '93',
    category: 'Arti',
    title: 'Kosova Krijon',
    description: 'Program kombëtar për mbështetjen e artistëve të rinj dhe promovimin e artit kosovar në skenën ndërkombëtare.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2027-12-31',
    updates: []
  },
  {
    id: '94',
    category: 'Arti',
    title: 'Teatri i Operës dhe Baletit',
    description: 'Ndërtimi i objektit të Teatrit të Operës dhe Baletit për të ofruar kushte dinjitoze për artistët dhe artdashësit.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2028-09-01',
    updates: []
  },
  {
    id: '95',
    category: 'Arti',
    title: 'Muzeu i Artit Bashkëkohor',
    description: 'Themelimi dhe ndërtimi i Muzeut të Artit Bashkëkohor për ruajtjen dhe ekspozimin e veprave të artistëve vendorë dhe ndërkombëtarë.',
    status: 'Pending',
    progress: 0,
    startDate: '2026-01-01',
    dueDate: '2029-01-01',
    updates: []
  },
  {
    id: '96',
    category: 'Arti',
    title: 'Arkeologjia',
    description: 'Rritja e investimeve në gërmime arkeologjike, konservim dhe promovim të siteve arkeologjike të Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '97',
    category: 'Arti',
    title: 'Konservimi i Memorialit "Adem Jashari"',
    description: 'Projekt madhor për konservimin dhe restaurimin e Kompleksit Memorial "Adem Jashari" në Prekaz.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-01-01',
  },
  {
    id: '98',
    category: 'Drejtësia',
    title: 'Gjykata për Çështje Familjare',
    description: 'Themelimi i Gjykatës së specializuar për trajtimin e çështjeve familjare për të ofruar zgjidhje më të shpejtë dhe profesionale.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-09-01',
    dueDate: '2027-09-01',
    updates: []
  },
  {
    id: '99',
    category: 'Drejtësia',
    title: 'Digjitalizimi - Padia dhe Gjykimi Online',
    description: 'Digjitalizimi i plotë i sistemit të drejtësisë, përfshirë ngritjen e padive dhe zhvillimin e seancave gjyqësore online.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '100',
    category: 'Drejtësia',
    title: 'Prokuroria Kundër Krimit dhe Korrupsionit',
    description: 'Krijimi i Prokurorisë së re të Specializuar me kompetenca të zgjeruara për luftimin e krimit të organizuar dhe korrupsionit.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-01-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '101',
    category: 'Drejtësia',
    title: 'Zyra Hetimore Disiplinore',
    description: 'Themelimi i Zyrës Hetimore Disiplinore për të mbikëqyrur dhe sanksionuar shkeljet e zyrtarëve në sistemin e drejtësisë.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-06-01',
    dueDate: '2026-06-01',
  },
  {
    id: '102',
    category: 'Siguria',
    title: 'Pensionimi i Parakohshëm (55 Vjeç)',
    description: 'Ulja e moshës së pensionimit të parakohshëm për zyrtarët policorë nga 63 në 55 vjeç për të rinovuar personelin.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '103',
    category: 'Siguria',
    title: 'Përditësimi i Sistemit të Gradave',
    description: 'Reformimi dhe përditësimi i sistemit të gradave në polici dhe ushtri për të siguruar avancim meritokratik.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2025-12-31',
    updates: []
  },
  {
    id: '104',
    category: 'Siguria',
    title: 'Njësia e Dronëve dhe Antidronëve',
    description: 'Themelimi dhe pajisja e njësisë speciale të dronëve dhe sistemeve antidron për mbrojtjen e hapësirës ajrore.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-06-01',
    dueDate: '2026-06-01',
    updates: []
  },
  {
    id: '105',
    category: 'Siguria',
    title: 'Mbrojtja e Kufirit',
    description: 'Investime në teknologji të avancuar dhe infrastrukturë për forcimin e kontrollit dhe mbrojtjes së kufirit shtetëror.',
    status: 'Pending',
    progress: 0,
    startDate: '2022-01-01',
    dueDate: '2026-01-01',
  },
  {
    id: '107',
    category: 'Siguria',
    title: 'Kosova në NATO',
    description: 'Përmbushja e kritereve teknike dhe politike për anëtarësimin e Kosovës në Programin e Partneritetit për Paqe dhe NATO.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2028-12-31',
    updates: []
  },
  {
    id: '108',
    category: 'Siguria',
    title: 'Dronët Made in Kosova',
    description: 'Zhvillimi dhe prodhimi i dronëve të parë ushtarakë në Kosovë në bashkëpunim me partnerë strategjikë.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-06-01',
    dueDate: '2028-06-01',
    updates: []
  },
  {
    id: '109',
    category: 'Siguria',
    title: 'Rezervistët Vullnetar - Mbrojtja Gjithëpërfshirëse',
    description: 'Rekrutimi aktiv i rezervistëve vullnetarë si pjesë e konceptit të mbrojtjes gjithëpërfshirëse.',
    status: 'Pending',
    progress: 0,
    startDate: '2024-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '110',
    category: 'Siguria',
    title: 'Ushtarakët nga Mërgata',
    description: 'Program i veçantë për përfshirjen e ekspertëve ushtarakë dhe të rinjve nga mërgata në Forcën e Sigurisë së Kosovës.',
    status: 'Pending',
    progress: 0,
    startDate: '2025-03-01',
    dueDate: '2028-03-01',
    updates: []
  },
  {
    id: '111',
    category: 'Siguria',
    title: 'Programet me Shqipërinë',
    description: 'Unifikimi i programeve stërvitore dhe operacionale me Forcat e Armatosura të Republikës së Shqipërisë.',
    status: 'In Progress',
    progress: 20,
    startDate: '2022-01-01',
    dueDate: '2026-01-01',
    updates: [
      { date: '2026-02-16', status: 'In Progress', description: 'Në takimin bilateral Kurti-Rama u ritheksuan marrëveshjet ndërqeveritare dhe bashkëpunimi në siguri, infrastrukturë, energji dhe transport.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/kryeministri-kurti-mirepriti-kryeministrin-e-shqiperise-edi-rama/' }
    ]
  },
  {
    id: '112',
    category: 'Politika e Jashtme',
    title: 'Statusi Vend Kandidat i BE-së',
    description: 'Angazhim diplomatik për marrjen e statusit të vendit kandidat për anëtarësim në Bashkimin Evropian.',
    status: 'In Progress',
    progress: 40,
    startDate: '2023-01-01',
    dueDate: '2026-12-31',
    updates: [
      { date: '2026-02-12', status: 'In Progress', description: 'Qeveria miratoi projektligjin për ratifikimin e marrëveshjes me BE-në për zbatimin e përkrahjes në kuadër të Instrumentit për Reforma dhe Rritje (882.6 milionë euro), si dhe marrëveshje kredie të ndërlidhur për afrimin me legjislacionin e BE-së.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' },
      { date: '2026-02-20', status: 'In Progress', description: 'Pas miratimit të marrëveshjeve në Kuvend për Planin e Rritjes, Komisioni Evropian konfirmoi se Kosova ka të drejtë në parafinancim deri në 7% të instrumentit (mbi 60 milionë euro), me lirimin e fondeve pas shpalljes/komunikimit zyrtar dhe përmbushjes së kushteve të përgjithshme.', source: 'Telegrafi / RTK', sourceUrl: 'https://telegrafi.com/kosova-fiton-te-drejten-per-parafinancim-mbi-60-ml-eur-nga-plani-i-rritjes/' },
      {
        date: '2026-02-20',
        status: 'In Progress',
        description:
          'Qeveria miratoi pakon e 19-të të sanksioneve të BE-së ndaj Federatës Ruse dhe Bjellorusisë, si hap i përafrimit me politikën e jashtme dhe të sigurisë të Bashkimit Evropian.',
        source: 'Prime Minister - Albin Kurti on Facebook',
        sourceUrl:
          'https://www.facebook.com/albini2017/posts/pfbid0mmY2U5aGz12SrCkyawdispZrfnACtPuw3KqyQtrdJhekFisftLzvhYs8oyEYUba6l'
      }
    ]
  },
  {
    id: '113',
    category: 'Politika e Jashtme',
    title: 'Aplikimi për Anëtarësim në BE',
    description: 'Dorëzimi zyrtar i aplikimit për anëtarësi në Bashkimin Evropian, duke shënuar hapin e parë drejt integrimit.',
    status: 'Completed',
    progress: 100,
    startDate: '2022-01-01',
    dueDate: '2022-12-15',
    updates: [
        { date: '2022-12-15', status: 'Completed', description: 'Dorëzimi i aplikacionit në Pragë.' },
        { date: '2026-02-12', status: 'Completed', description: 'Qeveria miratoi marrëveshje të reja financimi dhe kredie me BE-në në kuadër të Instrumentit për Reforma dhe Rritje, si vazhdim i procesit të integrimit pas dorëzimit të aplikimit.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/mbledhja-peruruese-e-qeverise-se-re-te-kosoves/' }
    ]
  },
  {
    id: '114',
    category: 'Politika e Jashtme',
    title: 'Marrëveshjet SOFA',
    description: 'Nënshkrimi dhe ratifikimi i marrëveshjeve për Statusin e Forcave (SOFA) me shtete partnere strategjike.',
    status: 'In Progress',
    progress: 10,
    startDate: '2021-03-22',
    dueDate: '2025-12-31',
    updates: [
      { date: '2026-02-20', status: 'In Progress', description: 'Në adresimin e Kryeministrit në mbledhjen e 2-të të Qeverisë u paraqit si procedim një nismë e kornizës së bashkëpunimit në mbrojtje me SHBA-në, si sinjal paraprak drejt marrëveshjeve të tipit SOFA.', source: 'Qeveria e Kosovës', sourceUrl: 'https://kryeministri.rks-gov.net/news/adresimi-i-kryeministrit-kurti-ne-mbledhjen-e-2-te-te-qeverise/' }
    ]
  },
  {
    id: '115',
    category: 'Politika e Jashtme',
    title: 'Marrëdhënie me Shtetet Mos-njohëse',
    description: 'Intensifikimi i dialogut dhe bashkëpunimit me shtetet e BE-së dhe NATO-s që ende nuk e kanë njohur Kosovën.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-03-22',
    dueDate: '2026-12-31',
    updates: []
  },
  {
    id: '116',
    category: 'Politika e Jashtme',
    title: 'Drejtues të Nismave Rajonale',
    description: 'Marrja e kryesimit dhe rolit udhëheqës në nisma të rëndësishme rajonale për të forcuar pozicionin e Kosovës.',
    status: 'In Progress',
    progress: 10,
    startDate: '2022-01-01',
    dueDate: '2026-01-01',
    updates: [
      {
        date: '2026-02-20',
        status: 'In Progress',
        description:
          'U miratua Projektligji për Ratifikimin e Marrëveshjes për Qasje në Arsimin e Lartë dhe Pranim për Studime në Ballkanin Perëndimor, në kuadër të Procesit të Berlinit.',
        source: 'Prime Minister - Albin Kurti on Facebook',
        sourceUrl:
          'https://www.facebook.com/albini2017/posts/pfbid0mmY2U5aGz12SrCkyawdispZrfnACtPuw3KqyQtrdJhekFisftLzvhYs8oyEYUba6l'
      }
    ]
  },
  {
    id: '117',
    category: 'Politika e Jashtme',
    title: 'Shërbimi Diplomatik dhe Mërgata',
    description: 'Reformimi i shërbimit diplomatik për të qenë më afër mërgatës dhe për të ofruar shërbime më cilësore konsullore.',
    status: 'Pending',
    progress: 0,
    startDate: '2021-06-01',
    dueDate: '2025-06-01',
    updates: []
  },
  {
    id: '118',
    category: 'Politika e Jashtme',
    title: 'Forcimi i Rrjetit të Atasheve',
    description: 'Zgjerimi i rrjetit të atasheve ushtarakë, tregtarë dhe kulturorë në ambasada kyçe.',
    status: 'Pending',
    progress: 0,
    startDate: '2023-01-01',
    dueDate: '2027-01-01',
    updates: []
  },
  {
    id: '119',
    category: 'Energjia',
    title: '170 MW Bateri Akumuluese',
    description: 'Ndërtimi i sistemeve të ruajtjes së energjisë me kapacitet prej 170 MW (dy lote: 45 MW dhe 125 MW) për stabilizimin e rrjetit, në bashkëpunim me MCC.',
    status: 'In Progress',
    progress: 25,
    startDate: '2024-01-01',
    dueDate: '2028-12-31',
    updates: [
      {
        date: '2026-01-20',
        status: 'In Progress',
        description: 'KOSTT nënshkroi marrëveshje me Ministrinë e Ekonomisë dhe Komunën e Ferizajt për marrjen e 2.3 hektarëve tokë për sistemin baterik 45 MW, hap konkret drejt zbatimit të projektit 170 MW BESS.',
        source: 'Balkan Green Energy News',
        sourceUrl: 'https://balkangreenenergynews.com/kostt-takes-over-land-in-kosovo-for-battery-system-in-us-funded-project/'
      },
      { date: '2024-12-10', status: 'In Progress', description: 'Hapet thirrja për parakualifikim për ndërtimin e sistemeve të baterive 170 MW (BESS). Afati deri më 14 Shkurt 2025.' }
    ]
  }
];

export const CATEGORIES = CATEGORIES_WITH_ALL;
