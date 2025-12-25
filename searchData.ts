
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
    text: 'Buxhet shtetëror 5 miliardë euro',
    detail: 'Rritja e buxhetit të shtetit në 5 miliardë euro brenda mandatit.',
    keywords: ['buxhet', 'miliard', 'euro', 'financat'],
    scoreContribution: { growthAndWages: 7 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Pagat',
    text: 'Koeficienti i pagave 150',
    detail: 'Ngritja e menjëhershme e vlerës së koeficientit në 150 euro.',
    keywords: ['paga', 'koeficienti', 'sektori publik', 'rroga'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Energjia',
    text: 'Termocentrali me Gaz 500MW',
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

  // LVV
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
    text: 'Dyfishimi i shtesave për fëmijë',
    detail: 'Rritja e shtesave nga 45 në 90 euro në muaj.',
    keywords: ['fëmijë', 'shtesa', 'sociale', 'familja'],
    scoreContribution: { socialAndFamily: 10 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Siguria',
    text: 'Fabrikë për dronë dhe municion',
    detail: 'Ndërtimi i industrisë vendore të mbrojtjes.',
    keywords: ['dronë', 'municion', 'fabrika', 'industria', 'mbrojtja'],
    scoreContribution: { securityAndNATO: 9 }
  },

  // PDK
  {
    partyId: PartyID.PDK,
    category: 'Pagat',
    text: 'Rritje 50% e pagave në sektorin publik',
    detail: 'Rritje lineare për mësuesit, mjekët, policët dhe administratën.',
    keywords: ['paga', 'rritje', 'rroga', 'sektori publik', 'mësuesit', 'mjekët'],
    scoreContribution: { growthAndWages: 10 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Ekonomia',
    text: '4 miliardë euro fond investiv',
    detail: 'Krijimi i një fondi për projekte strategjike kombëtare.',
    keywords: ['fond', 'investime', 'miliard', 'strategjike'],
    scoreContribution: { growthAndWages: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Shëndetësia',
    text: 'Sigurime shëndetësore brenda 24 muajve',
    detail: 'Zbatimi i plotë i ligjit për sigurime shëndetësore.',
    keywords: ['shëndetësia', 'sigurime', 'spitali', 'mjekësia'],
    scoreContribution: { socialAndFamily: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Energjia',
    text: 'Termocentrali "Kosova e Re" 500MW',
    detail: 'Ndërtimi i kapaciteteve të reja bazuar në linjit modern.',
    keywords: ['rryma', 'energjia', 'termocentral', 'linjiti', 'qymyri'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },

  // AAK
  {
    partyId: PartyID.AAK,
    category: 'Siguria',
    text: 'Anëtarësim direkt në NATO',
    detail: 'Prioriteti i parë strategjik i koalicionit. Dialog i dizajnuar me NATO-n.',
    keywords: ['nato', 'anëtarësim', 'siguria', 'shba', 'aleanca'],
    scoreContribution: { securityAndNATO: 10 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Pagat',
    text: 'Paga mesatare 1000 euro',
    detail: 'Arritja e nivelit të pagës mesatare prej 1000 euro brenda mandatit.',
    keywords: ['paga', 'mesatare', 'euro', '1000', 'rroga'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.AAK,
    category: 'Uji & Mjedisi',
    text: '5 diga të reja për ujitje',
    detail: 'Investim 100M EUR. Diga në Firajë, Pollatë, Kuqicë, Dragaçinë, Desivojcë.',
    keywords: ['diga', 'uji', 'ujitja', 'bujqësia', 'infrastruktura', 'firajë'],
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
  
  // ZGJERIMI NGA PROGRAM_EXPLORER & KNOWLEDGE BASE
  // LVV SHTESË
  {
    partyId: PartyID.LVV,
    category: 'Arsimi',
    text: 'Bursa shtesë për mobilitet',
    detail: 'Përkrahje për studentët që studiojnë jashtë vendit dhe shkëmbime.',
    keywords: ['arsimi', 'bursa', 'student', 'shkolla', 'universiteti'],
    scoreContribution: { socialAndFamily: 7 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Energjia',
    text: 'Bateri akumuluese 170MW/340MWh',
    detail: 'Rezerva energjetike përmes sitemit të baterive amerikane.',
    keywords: ['bateri', 'energjia', 'rryma', 'akumulues', 'mcc'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  },
  {
    partyId: PartyID.LVV,
    category: 'Infrastruktura',
    text: 'Autostrada Prishtinë-Gjilan-Prizren',
    detail: 'Përfundimi i lidhjeve kryesore rrugore.',
    keywords: ['rruga', 'autostrada', 'asfalti', 'gjilan', 'prizren'],
    scoreContribution: { infrastructureAndEnergy: 7 }
  },

  // PDK SHTESË
  {
    partyId: PartyID.PDK,
    category: 'Arsimi',
    text: 'Psikolog dhe siguri në çdo shkollë',
    detail: 'Mbrojtja e shëndetit mendor dhe fizik të nxënësve.',
    keywords: ['shkolla', 'siguria', 'psikolog', 'arsimi', 'nxënësit'],
    scoreContribution: { socialAndFamily: 8 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Infrastruktura',
    text: 'Hekurudha Prishtinë-Durrës',
    detail: 'Lidhja strategjike hekurudhore me portin e Durrësit.',
    keywords: ['hekurudha', 'treni', 'durrës', 'porti', 'deti'],
    scoreContribution: { infrastructureAndEnergy: 9 }
  },
  {
    partyId: PartyID.PDK,
    category: 'Sociale',
    text: '50 EUR shtesa për secilin fëmijë',
    detail: 'Shtesa mujore universale për fëmijët.',
    keywords: ['fëmijë', 'shtesa', 'sociale', 'familja'],
    scoreContribution: { socialAndFamily: 8 }
  },

  // LDK SHTESË
  {
    partyId: PartyID.LDK,
    category: 'Teknologjia',
    text: 'Ministri e Teknologjisë dhe Inovacionit',
    detail: 'Krijimi i dikasterit të veçantë dhe fond 120M EUR.',
    keywords: ['teknologjia', 'ai', 'inovacioni', 'it', 'ministria'],
    scoreContribution: { growthAndWages: 9 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Infrastruktura',
    text: 'Unaza e Jashtme e Prishtinës',
    detail: 'Investim 250M EUR për shkarkimin e trafikut në kryeqytet.',
    keywords: ['rruga', 'unaza', 'prishtina', 'trafiku', 'infrastruktura'],
    scoreContribution: { infrastructureAndEnergy: 8 }
  },
  {
    partyId: PartyID.LDK,
    category: 'Shëndetësia',
    text: 'Spital i ri në Prishtinë',
    detail: 'Ndërtimi i spitalit të qytetit për kryeqytetin.',
    keywords: ['spitali', 'mjekësia', 'shëndetësia', 'prishtina'],
    scoreContribution: { socialAndFamily: 9 }
  }
];
