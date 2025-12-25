
import { PartyID } from './types';

export interface Zotim {
  partyId: PartyID;
  category: string;
  subCategory?: string;
  text: string;
  detail: string;
  keywords: string[];
  scoreContribution: {
    growthAndWages?: number;
    infrastructureAndEnergy?: number;
    socialAndFamily?: number;
    securityAndNATO?: number;
  };
}

export const ZOTIMET: Zotim[] = [
    // LDK
  {
    partyId: PartyID.LDK,
    category: 'Ekonomia',
    text: '5% rritje reale vjetore e BPV-së',
    detail: 'Synohet një rritje e qëndrueshme ekonomike prej 5% çdo vit.',
    keywords: ['rritje', 'ekonomia', 'bpv', 'gdp', 'zhvillim'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Ekonomia',
    text: 'Buxhet shtetëror 4.5 miliardë euro',
    detail: 'Arritja e këtij buxheti përmes rritjes ekonomike dhe formalizimit.',
    keywords: ['buxhet', 'miliard', 'euro', 'financat'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Ekonomia',
    text: 'Koeficienti i pagave 125-135',
    detail: 'Ngritja e menjëhershme e vlerës së koeficientit në vitin e parë.',
    keywords: ['paga', 'koeficienti', 'sektori publik', 'rroga', 'ekonomia'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Energjia',
    text: 'Termocentral me Gaz 500MW',
    detail: 'Ndërtimi i një termocentrali modern me gaz për stabilitet energjetik.',
    keywords: ['gaz', 'energjia', 'rryma', 'termocentral'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Sociale',
    text: '5000 EUR për fëmijën e tretë',
    detail: 'Mbështetje direkte financiare për familjet që zgjerohen.',
    keywords: ['fëmijë', 'bebe', 'sociale', 'familja', 'popullsia'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Arsimi',
    text: 'Kodinimi si lëndë obligative',
    detail: 'Futja e kodimit në shkolla fillore për zhvillim teknologjik.',
    keywords: ['kodimi', 'arsimi', 'shkolla', 'teknologjia'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Siguria',
    text: 'Buxheti i Mbrojtjes 2% e BPV',
    detail: 'Arritja e standardit të NATO-s për shpenzime ushtarake.',
    keywords: ['nato', 'mbrojtja', 'buxheti', 'ushtria'],
    scoreContribution: { securityAndNATO: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Arsimi',
    subCategory: 'Teknologjia',
    text: 'Trajnimi i 40,000 të rinjve në TIK',
    detail: 'Investim 80M Euro për aftësimin e rinisë në teknologji informative.',
    keywords: ['tik', 'it', 'teknologjia', 'trajnimi', 'rinia', 'kodimi'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Ekonomia',
    subCategory: 'Biznesi',
    text: 'Tech Fondi 120 Milion Euro',
    detail: 'Mbështetje kapitale për startup-et dhe SME-të teknologjike.',
    keywords: ['startup', 'fondi', 'biznesi', 'digjitalizimi', 'grant'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Infrastruktura',
    text: 'Aviokompani Kombëtare',
    detail: 'Themelimi i kompanisë ajrore kombëtare me flotë prej 4-8 avionësh.',
    keywords: ['aeroplani', 'fluturimi', 'aeroporti', 'diaspora', 'transporti', 'infrastruktura'],
    scoreContribution: { infrastructureAndEnergy: 7 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Ekonomia',
    text: '2% rimbursim i TVSH-së (QR Code)',
    detail: 'Kthimi i 2% të TVSH-së qytetarëve për çdo blerje përmes kodit QR.',
    keywords: ['tvsh', 'rimbursimi', 'qr', 'paraja', 'fiskal'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Shëndetësia',
    text: 'Qendra e Re Spitalore (250M€)',
    detail: 'Ndërtimi i spitalit modern në Prishtinë për të zëvendësuar objektet e vjetra brenda 4 viteve.',
    keywords: ['spitali', 'qkuk', 'mjekësia', 'investimi', 'shëndeti', 'ndërtimi'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Shëndetësia',
    text: 'Heqja e Listave të Pritjes',
    detail: 'Ofrimi i shërbimeve mjekësore brenda 1 jave përmes kontratave me sektorin privat.',
    keywords: ['operacioni', 'kontrolli', 'privat', 'shërbimi', 'shpejtë', 'mjeku'],
    scoreContribution: { socialAndFamily: 8 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Sociale',
    text: 'Banim për Familjet e Reja',
    detail: 'Subvencione prej 15M Euro për të ndihmuar familjet e reja të blejnë shtëpinë apo banesën e parë.',
    keywords: ['banesa', 'shtëpi', 'kredit', 'interesi', 'familjet', 'rinia'],
    scoreContribution: { socialAndFamily: 8 }
  },

  // LVV
  {
    partyId: PartyID.LVV,
    category: 'Siguria',
    text: 'Anëtarësimi në NATO',
    detail: 'Aplikimi për Partneritet për Paqe dhe anëtarësim të plotë në aleancën veri-atlantike.',
    keywords: ['nato', 'anëtarësim', 'siguria', 'ushtria', 'aleanca'],
    scoreContribution: { securityAndNATO: 10 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Siguria',
    text: 'Dronë "Made in Kosova"',
    detail: 'Zhvillimi i industrisë ushtarake vendore për prodhimin e dronëve.',
    keywords: ['drone', 'fabrika', 'prodhimi', 'ushtria', 'armatim', 'industria'],
    scoreContribution: { securityAndNATO: 9 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Siguria',
    text: '1 miliard euro për armatim modern',
    detail: 'Fuqizimi i FSK-së me teknologjinë më të fundit luftarake.',
    keywords: ['ushtria', 'armatim', 'fsk', 'siguria', 'nato', 'mbrojtja'],
    scoreContribution: { securityAndNATO: 10 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Ekonomia',
    text: '500,000 të punësuar',
    detail: 'Targetimi i gjysmë milioni njerëzve të punësuar deri në fund të mandatit.',
    keywords: ['punësimi', 'punë', 'vende pune', 'ekonomia'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Sociale',
    text: 'Shtesat për fëmijë deri në 90€',
    detail: 'Dyfishimi i shtesave aktuale nga 45 në 90 euro në muaj.',
    keywords: ['fëmijë', 'shtesa', 'sociale', 'familja'],
    scoreContribution: { socialAndFamily: 10 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Energjia',
    text: '170MW Bateri Akumuluese',
    detail: 'Rezerva energjetike përmes sistemit të baterive amerikane (MCC).',
    keywords: ['bateri', 'energjia', 'rryma', 'akumulues', 'mcc'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Arsimi',
    text: 'Bursa për 5,000 studentë në STEM',
    detail: 'Fokus në shkencë, teknologji, inxhinieri dhe matematikë.',
    keywords: ['arsimi', 'bursa', 'student', 'stem', 'shkolla'],
    scoreContribution: { socialAndFamily: 7 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Drejtësia',
    text: 'Vetingu në Drejtësi',
    detail: 'Pastrimi i sistemit të drejtësisë përmes procesit të vetingut.',
    keywords: ['vetingu', 'drejtësia', 'gjykatat', 'prokuroria'],
    scoreContribution: { securityAndNATO: 8 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Ekonomia',
    text: 'Fondi Sovran',
    detail: 'Kthimi i ndërmarrjeve publike në asete ekonomike përmes Fondit Sovran të investimeve.',
    keywords: ['akp', 'ndërmarrjet', 'investimi', 'sovran', 'trepça', 'kek'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Shëndetësia',
    text: 'Decentralizimi i Spitaleve',
    detail: 'Fuqizimi i spitaleve rajonale për të ofruar shërbime që aktualisht kryhen vetëm në QKUK.',
    keywords: ['rajonal', 'spitali', 'mjekësia', 'decentralizimi', 'shërbimi'],
    scoreContribution: { socialAndFamily: 7 }
  },

  // PDK
  {
    partyId: PartyID.PDK,
    category: 'Ekonomia',
    text: 'Rritje 50% e pagave në sektorin publik',
    detail: 'Rritje për mësuesit, mjekët, policët dhe administratën.',
    keywords: ['paga', 'rritje', 'rroga', 'sektori publik', 'mësuesit', 'mjekët', 'ekonomia'],
    scoreContribution: { growthAndWages: 10 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Ekonomia',
    text: 'Lirimi nga tatimi deri në 400€',
    detail: '0% tatim për rrogat deri në 400€, mbrojtje për shtresat me të ardhurat të ulëta.',
    keywords: ['tatimi', 'ekonomia', 'paga', '400', 'lirimi'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Sociale',
    text: '50 EUR shtesa për secilin fëmijë',
    detail: 'Shtesa mujore universale për të gjithë fëmijët deri në 16 vjeç.',
    keywords: ['fëmijë', 'shtesa', 'sociale', 'familja'],
    scoreContribution: { socialAndFamily: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Energjia',
    text: '0% TVSH për Energji Elektrike',
    detail: 'Heqja e plotë e TVSH-së në faturat e energjisë për familjet.',
    keywords: ['tvsh', 'energjia', 'rryma', 'fatura'],
    scoreContribution: { infrastructureAndEnergy: 7 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Energjia',
    text: 'Termocentrali "Kosova e Re" 500MW',
    detail: 'Ndërtimi i kapaciteteve të reja bazuar në linjit modern.',
    keywords: ['rryma', 'energjia', 'termocentral', 'linjiti', 'qymyri'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Shëndetësia',
    text: 'Sigurime shëndetësore brenda 24 muajve',
    detail: 'Zbatimi i plotë i ligjit për sigurime shëndetësore brenda dy viteve.',
    keywords: ['shëndetësia', 'sigurime', 'spitali', 'mjekësia'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Arsimi',
    text: 'Psikolog në çdo shkollë',
    detail: 'Punësimi i psikologëve dhe zyrtarëve të sigurisë në çdo shkollë.',
    keywords: ['shkolla', 'siguria', 'psikolog', 'arsimi', 'nxënësit'],
    scoreContribution: { socialAndFamily: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Infrastruktura',
    text: 'Stadiumi Olimpik Kombëtar',
    detail: 'Ndërtimi i stadiumit modern si projekt strategjik kombëtar.',
    keywords: ['stadiumi', 'sporti', 'futbolli', 'olmpik', 'investimi'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Siguria',
    text: 'Njësia e Helikopterëve',
    detail: 'Krijimi i njësisë për emergjenca, shpëtim dhe mbështetje policore.',
    keywords: ['helikopteri', 'emergjenca', 'policia', 'shpëtimi', 'siguria'],
    scoreContribution: { securityAndNATO: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Siguria',
    text: 'Garda Kombëtare e Kosovës',
    detail: 'Strukturë e re reaguese për situata emergjente dhe kriza.',
    keywords: ['garda', 'ushtria', 'kriza', 'emergjenca', 'mbrojtja'],
    scoreContribution: { securityAndNATO: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Shëndetësia',
    text: 'Barnat Falas për Kronikët',
    detail: 'Mbulimi i plotë i kostos së barnave esenciale për të gjithë qytetarët me sëmundje kronike.',
    keywords: ['barnat', 'ilaçet', 'farmacia', 'recepti', 'falas', 'shëndeti', 'kronike'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Shëndetësia',
    text: 'Qendra Kombëtare e Urgjencës',
    detail: 'Sistemi unik i koordinimit (QKUM) për përgjigje të shpejtë mjekësore në gjithë vendin.',
    keywords: ['urgjenca', 'ndihma e shpejtë', 'ambulanca', 'shëndetësia', 'qkum'],
    scoreContribution: { socialAndFamily: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Ekonomia',
    text: 'Bursa e Kosovës',
    detail: 'Themelimi i bursës për të rritur transparencën dhe për të siguruar kapital për bizneset.',
    keywords: ['bursa', 'financat', 'kapitali', 'ekonomia', 'biznesi'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Sociale',
    text: 'Fondi i Papunësisë',
    detail: 'Mbështetje financiare e përkohshme dhe programe rikualifikimi për qytetarët që mbesin pa punë.',
    keywords: ['papunësia', 'fondi', 'sociale', 'puna', 'siguria'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Ekonomia',
    text: '0% TVSH për Produktet Esenciale',
    detail: 'Heqja e TVSH-së për produktet bazë të shportës së konsumatorit.',
    keywords: ['tvsh', 'shporta', 'ushqimi', 'ekonomia', 'çmimet'],
    scoreContribution: { socialAndFamily: 8 }
  },

  // AAK
  {
    partyId: PartyID.AAK,
    category: 'Siguria',
    text: 'Anëtarësim direkt në NATO',
    detail: 'Prioriteti i parë strategjik i koalicionit me plan të dakorduar me SHBA.',
    keywords: ['nato', 'anëtarësim', 'siguria', 'shba', 'aleanca'],
    scoreContribution: { securityAndNATO: 10 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Ekonomia',
    text: 'Paga Minimale 500€',
    detail: 'Caktimi i pagës minimale në nivelin 500€ në të gjithë sektorët.',
    keywords: ['paga', 'minimale', '500', 'rroga', 'ekonomia'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Ekonomia',
    text: 'Paga mesatare 1000 euro',
    detail: 'Arritja e nivelit të pagës mesatare prej 1000 euro brenda mandatit.',
    keywords: ['paga', 'mesatare', 'euro', '1000', 'rroga', 'ekonomia'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Sociale',
    text: 'Pensionet baraz me Pagën Minimale',
    detail: 'Rritja e pensioneve në nivelin e pagës minimale prej 500€.',
    keywords: ['pensionet', 'paga', 'sociale', '500'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Bujqësia',
    text: '100M EUR për sisteme të ujitjes',
    detail: 'Ndërtimi i 5 digave të reja për ujitjen e tokave bujqësore.',
    keywords: ['diga', 'uji', 'ujitja', 'bujqësia', 'infrastruktura'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Sociale',
    text: '300 EUR për familjet pa të punësuar',
    detail: 'Mbështetje direkte mujore për familjet pa asnjë anëtar në punë.',
    keywords: ['sociale', 'papunësi', 'familja', 'ndihmë'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Infrastruktura',
    text: 'Hekurudha Kosovë-Shqipëri',
    detail: 'Lidhja strategjike hekurudhore për qasje në portet shqiptare.',
    keywords: ['trena', 'hekurudha', 'shqipëria', 'durrësi', 'transporti'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Bujqësia',
    text: 'Diga e Lepencit (Firajë)',
    detail: 'Zgjidhje afatgjatë për ujë për 150,000 banorë në Jug.',
    keywords: ['diga', 'uji', 'lepenci', 'viti', 'shtërpcë', 'ferizaj'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Shëndetësia',
    text: 'Mjeku i Familjes për çdo shtëpi',
    detail: 'Reforma që garanton kujdes parësor për secilën familje.',
    keywords: ['mjeku', 'familja', 'shëndeti', 'spitali', 'vizita'],
    scoreContribution: { socialAndFamily: 10 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Arsimi',
    text: 'Kampusi Madhështor për IT',
    detail: 'Qendra më e madhe në Ballkan për inovacion dhe edukim TIK.',
    keywords: ['tik', 'it', 'studentët', 'kampusi', 'teknologjia'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Infrastruktura',
    text: 'Policia Mjedisore',
    detail: 'Krijimi i një departamenti të specializuar policor për mbrojtjen e lumenjve dhe pyjeve.',
    keywords: ['pyjet', 'lumenjtë', 'ambienti', 'policia', 'mbrojtja', 'inspektimi'],
    scoreContribution: { infrastructureAndEnergy: 7 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Ekonomia',
    text: 'Investime 1.5 Miliardë Euro',
    detail: 'Rritja e investimeve publike deri në 1.5 miliardë euro në vit deri në fund të mandatit.',
    keywords: ['buxheti', 'investimi', 'kapitale', 'miliard', 'ekonomia'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Infrastruktura',
    text: 'Autostrada e Dukagjinit',
    detail: 'Përfundimi i autostradës që lidh Pejën, Gjakovën dhe Prizrenin.',
    keywords: ['autostrada', 'dukagjini', 'peja', 'gjakova', 'prizreni', 'rruga'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Ekonomia',
    text: 'Zhdoganim i Veturave 15 vjet',
    detail: 'Zgjatja e afatit për importin e veturave nga 10 në 15 vjet.',
    keywords: ['vetura', 'dogana', 'importi', 'makina', 'vjetërsia'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Ekonomia',
    text: 'TVSH e Ulët në Turizëm',
    detail: 'Reduktimi i TVSH-së për operatorët turistikë për të nxitur vizitorët.',
    keywords: ['turizmi', 'tvsh', 'hotelet', 'vizitorë', 'operatorë'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Infrastruktura',
    text: 'Hekurudha e Aeroportit',
    detail: 'Lidhja e re hekurudhore Prishtinë - Aeroporti Adem Jashari.',
    keywords: ['aeroporti', 'trena', 'hekurudha', 'prishtina', 'transporti'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  }
];
