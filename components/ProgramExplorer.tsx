import React, { useState, useEffect } from 'react';
import { PartyID, PartyInfo, ComparisonPoint } from '../types';
import { PARTIES } from '../constants';
import ComparisonTable from './ComparisonTable';

interface PromiseItem {
  category: string;
  partyId: PartyID;
  text: string;
  details?: string;
  impact?: 'high' | 'medium' | 'low';
}

const PROGRAM_DATA: PromiseItem[] = [
  // LVV
  { partyId: PartyID.LVV, category: 'security', text: 'Anëtarësimi në NATO', details: 'Aplikimi për Partneritet për Paqe dhe anëtarësim të plotë në aleancën veri-atlantike.' },
  { partyId: PartyID.LVV, category: 'security', text: 'Dronë "Made in Kosova"', details: 'Zhvillimi i industrisë ushtarake vendore për prodhimin e dronëve.' },
  { partyId: PartyID.LVV, category: 'security', text: '1 Miliard Euro investime në ushtri', details: 'Blerje e armatimit modern, ndërtimi i fabrikave të municionit dhe dronëve.' },
  { partyId: PartyID.LVV, category: 'economy', text: '500,000 të punësuar deri në fund të mandatit', details: 'Fokus në punësimin e rinisë dhe grave përmes masave mbështetëse.' },
  { partyId: PartyID.LVV, category: 'social', text: 'Shtesat për fëmijë deri në 90€', details: 'Dyfishimi i shtesave aktuale nga 45€ në 90€ për muaj.' },
  { partyId: PartyID.LVV, category: 'energy', text: '170MW Bateri Akumuluese', details: 'Investim në sistemin e baterive për stabilizimin e rrjetit (MCC).' },
  { partyId: PartyID.LVV, category: 'edu', text: 'Bursa për 5,000 studentë në STEM', details: 'Fokus në shkencë, teknologji, inxhinieri dhe matematikë.' },
  { partyId: PartyID.LVV, category: 'justice', text: 'Vetingu në Drejtësi', details: 'Procesi i vetingu për gjyqtarë dhe prokurorë për pastrimin e sistemit.' },
  { partyId: PartyID.LVV, category: 'health', text: 'Sistemi Informativ Shëndetësor (SISH)', details: 'Digjitalizimi i plotë i kartelave dhe shërbimeve shëndetësore.' },
  { partyId: PartyID.LVV, category: 'agri', text: 'Banka Zhvillimore për Bujqësi', details: 'Kredi me interes të ulët dhe mbështetje për prodhuesit vendorë.' },
  { partyId: PartyID.LVV, category: 'env', text: 'Hekurudha Prishtinë-Durrës', details: 'Projekti strategjik për lidhjen hekurudhore me Shqipërinë.' },
  { partyId: PartyID.LVV, category: 'diaspora', text: 'Zotimi për Mërgatën', details: 'Lehtësimi i votimit dhe dritarja për investime nga diaspora.' },
  { partyId: PartyID.LVV, category: 'economy', text: 'Porti i Thatë në Prishtinë', details: 'Transformimi i Kosovës në një qendër logjistike rajonale.' },
  { partyId: PartyID.LVV, category: 'economy', text: 'Fondi Sovran', details: 'Transformimi i AKP në Fond Sovran për investime strategjike në ndërmarrje publike.' },
  { partyId: PartyID.LVV, category: 'health', text: 'Spitalet Rajonale', details: 'Investim në infrastrukturë dhe pajisje për të decentralizuar shërbimet nga QKUK.' },

  // PDK
  { partyId: PartyID.PDK, category: 'economy', text: 'Rritje 50% e pagave në sektorin publik', details: 'Përfshin mësuesit, mjekët, policët dhe administratën.' },
  { partyId: PartyID.PDK, category: 'economy', text: 'Lirimi nga tatimi deri në 400€', details: '0% tatim për rrogat deri në 400€, 8% për 400-800€.' },
  { partyId: PartyID.PDK, category: 'social', text: '50€ Shtesa për çdo fëmijë', details: 'Mbështetje universale mujore për çdo fëmijë deri në 16 vjeç.' },
  { partyId: PartyID.PDK, category: 'social', text: 'Pensioni minimal 250€', details: 'Pensione dhe ndihma sociale rriten për 50%.' },
  { partyId: PartyID.PDK, category: 'energy', text: 'Termocentrali "Kosova e Re" (500MW)', details: 'Ndërtimi i kapaciteteve të reja bazuar në qymyr modern.' },
  { partyId: PartyID.PDK, category: 'energy', text: '0% TVSH për Energji Elektrike', details: 'Heqja e TVSH-së në faturat e dritave për të gjitha familjet.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Sigurime shëndetësore brenda 24 muajve', details: 'Zbatimi i plotë i sistemit të sigurimeve shëndetësore.' },
  { partyId: PartyID.PDK, category: 'edu', text: '30M Euro Buxhet për Bursa', details: 'Fondi vjetor për studentët ekselentë në Kosovë dhe jashtë.' },
  { partyId: PartyID.PDK, category: 'edu', text: 'Psikolog në çdo shkollë', details: 'Punësimi i psikologëve dhe zyrtarëve të sigurisë në çdo objekt shkollor.' },
  { partyId: PartyID.PDK, category: 'agri', text: '0% Akcizë në Naftë për Bujqësi', details: 'Heqja e barrenës financiare për makineritë bujqësore.' },
  { partyId: PartyID.PDK, category: 'justice', text: 'Gjykata e Punës', details: 'Themelimi i gjykatës së specializuar për kontestet e punës.' },
  { partyId: PartyID.PDK, category: 'env', text: 'Stadiumi Olimpik Kombëtar', details: 'Ndërtimi i stadiumit modern si projekt strategjik kombëtar.' },
  { partyId: PartyID.PDK, category: 'security', text: 'Njësia e Helikopterëve', details: 'Krijimi i njësisë për emergjenca, shpëtim dhe mbështetje policore.' },
  { partyId: PartyID.PDK, category: 'security', text: 'Garda Kombëtare e Kosovës', details: 'Strukturë e re reaguese për situata emergjente dhe kriza.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Barna Falas për Kronikët', details: 'Garancia që asnjë pacient kronik mos të blejë barna esenciale nga xhepi.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Qendra Kombëtare e Urgjencës (QKUM)', details: 'Sistem unik kombëtar i dispeçerimit dhe koordinimit të shërbimeve emergjente.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Spitali Rajonal i Prishtinës', details: 'Ndërtimi i spitalit të ri për t\'u shërbyer banorëve të kryeqytetit.' },
  { partyId: PartyID.PDK, category: 'economy', text: 'Bursa e Kosovës', details: 'Themelimi i bursës për tregtim të letrave me vlerë dhe kapital.' },
  { partyId: PartyID.PDK, category: 'social', text: 'Fondi i Papunësisë', details: 'Pagesa tranzitore dhe rikualifikim për personat që humbin punën.' },
  { partyId: PartyID.PDK, category: 'economy', text: '0% TVSH produkte bazë', details: 'Heqja e TVSH-së për shportën esenciale të konsumit.' },

  // LDK
  { partyId: PartyID.LDK, category: 'economy', text: 'Buxhet 4.5 Miliardë Euro', details: 'Arritja e këtij buxheti përmes rritjes ekonomike prej 5%.' },
  { partyId: PartyID.LDK, category: 'economy', text: 'Koeficienti i pagave 125-135', details: 'Rritje e menjëhershme e rrogave në vitin e parë të mandatit.' },
  { partyId: PartyID.LDK, category: 'energy', text: 'Termocentral me Gaz 500MW', details: 'Ndërtimi i rrjetit të gazit dhe centralit të parë me gaz në Kosovë.' },
  { partyId: PartyID.LDK, category: 'social', text: '5000€ për fëmijën e tretë', details: 'Mbështetje e fuqishme për rritjen e natalitetit.' },
  { partyId: PartyID.LDK, category: 'edu', text: 'Kodinimi si lëndë obligative', details: 'Futja e kodimit në shkolla fillore për zhvillim teknologjik.' },
  { partyId: PartyID.LDK, category: 'env', text: 'Unaza e Jashtme e Prishtinës', details: 'Projekti 250M Euro për zgjidhjen e trafikut në kryeqytet.' },
  { partyId: PartyID.LDK, category: 'security', text: 'Buxheti i Mbrojtjes 2% e BPV', details: 'Arritja e standardit të NATO-s për shpenzime ushtarake.' },
  { partyId: PartyID.LDK, category: 'health', text: 'Fondi i Sigurimeve Shëndetësore', details: 'Autonomia financiare e spitaleve përmes fondit të pavarur.' },
  { partyId: PartyID.LDK, category: 'agri', text: 'Sistemi Modern i Ujitjes', details: 'Mbulimi i tokave pjellore me rrjet modern të ujitjes.' },
  { partyId: PartyID.LDK, category: 'diaspora', text: 'Ministria e Diasporës', details: 'Rikthimi i ministrisë për fuqizimin e lidhjes me mërgatën.' },
  { partyId: PartyID.LDK, category: 'economy', text: 'Aviokompani Kombëtare', details: 'Themelimi i kompanisë ajrore me flotë prej 4-8 avionësh.' },
  { partyId: PartyID.LDK, category: 'edu', text: 'Trajnimi i 40,000 të rinjve në TIK', details: 'Investim 80M Euro për aftësimin e rinisë në teknologji.' },
  { partyId: PartyID.LDK, category: 'economy', text: 'Tech Fondi 120 Milion Euro', details: 'Mbështetje kapitale për startup-et dhe SME-të teknologjike.' },
  { partyId: PartyID.LDK, category: 'energy', text: 'Gazifikimi i 7 Qendrave', details: 'Shtrirja e rrjetit të gazit nga Hani i Elezit deri në Mitrovicë.' },
  { partyId: PartyID.LDK, category: 'health', text: 'Qendra e Re Spitalore (250M€)', details: 'Ndërtimi i objektit të ri spitalor modern brenda 4 viteve në Prishtinë.' },
  { partyId: PartyID.LDK, category: 'health', text: 'Heqja e Listave të Pritjes', details: 'Reduktimi i pritjes nga 12 muaj në më pak se 1 javë përmes sektorit privat.' },
  { partyId: PartyID.LDK, category: 'social', text: 'Banim për Familjet e Reja (15M€)', details: 'Subvencione dhe kredi të buta për të siguruar shtëpinë/banesën e parë.' },
  { partyId: PartyID.LDK, category: 'env', text: '200 Vendndalesa Rajonale', details: 'Ndërtimi i stacioneve për autobusë dhe vetura (10M€) përgjatë rrugëve rajonale.' },

  // AAK
  { partyId: PartyID.AAK, category: 'economy', text: 'Paga Minimale 500€', details: 'Nuk do të ketë pagë nën 500 euro në asnjë sektor.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Paga Mesatare 1,000€', details: 'Synimi për nivelin e pagës mesatare brenda mandatit.' },
  { partyId: PartyID.AAK, category: 'social', text: 'Pensionet baraz me Pagën Minimale', details: 'Asnjë pensionist nuk do të ketë më pak se 500€.' },
  { partyId: PartyID.AAK, category: 'social', text: '300€ për familjet pa të punësuar', details: 'Asnjë familje nuk do të mbetet pa të ardhura bazë.' },
  { partyId: PartyID.AAK, category: 'security', text: 'Anëtarësim direkt në NATO', details: 'Plani i dakorduar me SHBA për anëtarësim të shpejtë.' },
  { partyId: PartyID.AAK, category: 'health', text: 'Rritje 50% e pagave për Mjekë', details: 'Rritje e menjëhershme për të ndalur ikjen e stafit mjekësor.' },
  { partyId: PartyID.AAK, category: 'energy', text: '6% TVSH për Energji Elektrike', details: 'Ulje e TVSH-së në faturat e dritave për familjet.' },
  { partyId: PartyID.AAK, category: 'agri', text: '100 Milion Euro për Ujitje', details: 'Ndërtimi i 5 digave të reja për ujitjen e tokave bujqësore.' },
  { partyId: PartyID.AAK, category: 'youth', text: '20 Fshatra Turistike', details: 'Investime në infrastrukturën e fshatrave me potencial turistik.' },
  { partyId: PartyID.AAK, category: 'security', text: 'Fabrika e Municionit', details: 'Zhvillimi i industrisë vendore të mbrojtjes dhe sigurisë.' },
  { partyId: PartyID.AAK, category: 'env', text: 'Hekurudha Kosovë-Shqipëri', details: 'Lidhja strategjike hekurudhore për qasje në portet shqiptare.' },
  { partyId: PartyID.AAK, category: 'agri', text: 'Diga e Lepencit (Firajë)', details: 'Zgjidhje për ujë për 150,000 banorë në Jug (Gjilan, Ferizaj, Viti).' },
  { partyId: PartyID.AAK, category: 'health', text: 'Mjeku i Familjes për çdo shtëpi', details: 'Reforma që garanton kujdes parësor për secilën familje.' },
  { partyId: PartyID.AAK, category: 'edu', text: 'Kampusi Madhështor për IT', details: 'Qendra më e madhe në Ballkan me zyra falas për startup-et.' },
  { partyId: PartyID.AAK, category: 'culture', text: 'Turizmi Kulturor', details: 'Program nacional për promovimin e trashëgimisë dhe monumenteve historike.' },
  { partyId: PartyID.AAK, category: 'culture', text: 'Qendra e Skijimit Brezovicë', details: 'Investim strategjik për turizmin dimëror dhe malor.' },

  // Culture Specifics
  { partyId: PartyID.PDK, category: 'culture', text: 'Diplomacia Kulturore', details: 'Përdorimi i artit dhe kulturës për afirmimin ndërkombëtar të shtetit.' },
  { partyId: PartyID.PDK, category: 'culture', text: 'Mbështetje për Artistët', details: 'Financim transparent dhe konkurrues për projekte artistike.' },
  
  { partyId: PartyID.LDK, category: 'culture', text: 'Teatri i Operës (25M€)', details: 'Ndërtimi i Teatrit të Operës dhe Baletit "Dr. Ibrahim Rugova".' },
  { partyId: PartyID.LDK, category: 'culture', text: 'Qendra e Artit Bashkëkohor', details: 'Hapësirë e re për artistët vizualë dhe ekspozita ndërkombëtare.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Investime 1.5 Miliardë', details: 'Rritja e investimeve publike vjetore deri në fund të mandatit.' },
  { partyId: PartyID.AAK, category: 'env', text: 'Domeni .kos', details: 'Pavarsimi i identitetit digjital përmes domenit kombëtar.' },
  { partyId: PartyID.AAK, category: 'env', text: 'Autostrada e Dukagjinit', details: 'Përfundimi i autostradës strategjike Pejë-Gjakovë-Prizren.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Zhdoganim i Veturave 15 vjet', details: 'Lejimi i importit të veturave deri në 15 vjet vjetërsi.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'TVSH e Ulët në Turizëm', details: 'Stimulim për sektorin e hotelerisë dhe operatorët turistikë.' },
  { partyId: PartyID.AAK, category: 'env', text: 'Hekurudha e Aeroportit', details: 'Lidhja hekurudhore Prishtinë - Aeroporti Adem Jashari.' },
];

const CATEGORIES = [
  { id: 'all', label: 'Të gjitha', icon: 'fa-list' },
  { id: 'economy', label: 'Ekonomia', icon: 'fa-chart-line' },
  { id: 'security', label: 'Siguria & NATO', icon: 'fa-shield-halved' },
  { id: 'energy', label: 'Energjia', icon: 'fa-bolt' },
  { id: 'social', label: 'Sociale', icon: 'fa-users' },
  { id: 'health', label: 'Shëndetësia', icon: 'fa-heart-pulse' },
  { id: 'edu', label: 'Arsimi & Inovacioni', icon: 'fa-graduation-cap' },
  { id: 'env', label: 'Infrastruktura', icon: 'fa-road' },
  { id: 'justice', label: 'Drejtësia', icon: 'fa-scale-unbalanced' },
  { id: 'agri', label: 'Bujqësia', icon: 'fa-wheat-awn' },
  { id: 'youth', label: 'Rinia & Sporti', icon: 'fa-volleyball' },
  { id: 'diaspora', label: 'Diaspora', icon: 'fa-earth-europe' },
  { id: 'culture', label: 'Kultura', icon: 'fa-masks-theater' },
];

const ProgramExplorer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeParty, setActiveParty] = useState<PartyID | 'all'>('all');
  const [selectedPromise, setSelectedPromise] = useState<PromiseItem | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get('category');
    if (initialCat && CATEGORIES.find(c => c.id === initialCat)) {
       setActiveCategory(initialCat);
    }
  }, []);

  const filteredPromises = PROGRAM_DATA.filter(p => {
    const catMatch = activeCategory === 'all' || p.category === activeCategory;
    const partyMatch = activeParty === 'all' || p.partyId === activeParty;
    return catMatch && partyMatch;
  });

  const generateComparison = (basePromise: PromiseItem): ComparisonPoint[] => {
    // Generate comparison points for this category
    // For each party, find the most relevant promise in this category
    const parties = [PartyID.LVV, PartyID.PDK, PartyID.LDK, PartyID.AAK];
    const categoryPromises = PROGRAM_DATA.filter(p => p.category === basePromise.category);
    
    // Create a simplified comparison point
    const values: Record<string, string> = {};
    parties.forEach(pid => {
       const partyPromises = categoryPromises.filter(p => p.partyId === pid);
       if (partyPromises.length > 0) {
          // If we have detail view, we likely want to see the most relevant one. 
          // For now, take the first one or join them if multiple.
          // Let's create a list if multiple, but ComparisonTable expects text.
          // We will just take the first one for simplicity or join with ' | ' which might be long.
          // Let's take the first one.
          values[pid] = partyPromises[0].text;
       } else {
          values[pid] = '-';
       }
    });

    return [{
       category: CATEGORIES.find(c => c.id === basePromise.category)?.label || basePromise.category,
       values
    }];
  };

  if (selectedPromise) {
    const party = PARTIES[selectedPromise.partyId];
    return (
       <div className="flex-1 bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-500">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
             <button 
               onClick={() => setSelectedPromise(null)}
               className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 text-[10px] font-black uppercase tracking-widest"
             >
               <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
               <span>Kthehu tek lista</span>
             </button>

             {/* Hero Card for Promise */}
             <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden mb-12">
                <div 
                   className="absolute top-0 right-0 w-64 h-64 opacity-[0.05] pointer-events-none"
                   style={{ color: party.color }}
                >
                   <i className={`fa-solid ${CATEGORIES.find(c => c.id === selectedPromise.category)?.icon} text-9xl translate-x-12 -translate-y-8`}></i>
                </div>

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                   <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-slate-50 rounded-3xl p-4 md:p-5 flex items-center justify-center border border-slate-100 shadow-inner">
                      <img src={party.logo} alt={party.name} className="w-full h-full object-contain" />
                   </div>
                   <div className="flex-1 space-y-6">
                      <div>
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 block">{party.name}</span>
                         <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-4">
                            "{selectedPromise.text}"
                         </h1>
                         <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-3xl">
                            {selectedPromise.details}
                         </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                         <span 
                           className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border"
                           style={{ borderColor: `${party.color}30`, color: party.color, backgroundColor: `${party.color}05` }}
                         >
                            {CATEGORIES.find(c => c.id === selectedPromise.category)?.label}
                         </span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <i className="fa-solid fa-check-circle mr-2 text-green-500"></i>
                            Zotim Zyrtar 2025
                         </span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Comparison Section */}
             <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700 delay-150">
                <div className="flex items-center space-x-6">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">KRAHASIMI ME PARTITË TJERA</h3>
                   <div className="h-px w-full bg-slate-200"></div>
                </div>
                
                <ComparisonTable 
                  points={generateComparison(selectedPromise)} 
                  activePartyIds={[PartyID.LVV, PartyID.PDK, PartyID.LDK, PartyID.AAK]} 
                />
                
                <p className="text-center text-slate-400 text-xs font-medium mt-6">
                   * Ky tabelë tregon zotime të ngjashme nga kategoria "{CATEGORIES.find(c => c.id === selectedPromise.category)?.label}".
                </p>

                <div className="mt-8 flex justify-center opacity-60 hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                        <i className="fa-solid fa-wand-magic-sparkles text-purple-500 text-xs"></i>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Platformë e ndërtuar dhe indeksuar me AI
                        </span>
                    </div>
                </div>
             </div>
          </div>
       </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={onBack}
              className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors mb-4 text-[10px] font-black uppercase tracking-widest"
            >
              <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
              <span>Kthehu mbrapa</span>
            </button>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
              Eksploruesi i <span className="text-blue-600">Zotimeve</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 max-w-xl">
              Shfletoni të gjitha premtimet zyrtare të harmonizuara nga programet politike të vitit 2025.
            </p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveParty('all')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeParty === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              TË GJITHA
            </button>
            {[PartyID.LVV, PartyID.PDK, PartyID.LDK, PartyID.AAK].map(pid => (
              <button 
                key={pid}
                onClick={() => setActiveParty(pid)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${activeParty === pid ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-slate-100 opacity-40 hover:opacity-100 hover:border-slate-300'}`}
              >
                <img src={PARTIES[pid].logo} alt={pid} className="w-6 h-6 object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mb-10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all border font-black uppercase tracking-widest text-[10px] ${
                activeCategory === cat.id 
                  ? 'bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-500/5 ring-1 ring-blue-600' 
                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
              }`}
            >
              <i className={`fa-solid ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPromises.map((promise, idx) => {
            const party = PARTIES[promise.partyId];
            return (
              <button 
                key={idx}
                onClick={() => setSelectedPromise(promise)}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col relative overflow-hidden text-left"
              >
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] group-hover:scale-125 transition-transform duration-700 pointer-events-none"
                  style={{ color: party.color }}
                >
                  <i className={`fa-solid ${CATEGORIES.find(c => c.id === promise.category)?.icon} text-8xl translate-x-12 -translate-y-8`}></i>
                </div>

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
                      <img src={party.logo} alt={party.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{party.id}</span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{party.leader}</p>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border"
                    style={{ borderColor: `${party.color}20`, color: party.color, backgroundColor: `${party.color}05` }}
                  >
                    {CATEGORIES.find(c => c.id === promise.category)?.label}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                  "{promise.text}"
                </h3>
                
                {promise.details && (
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                    {promise.details}
                  </p>
                )}

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Burimi: Programi Zyrtar</span>
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0"
                    style={{ backgroundColor: party.color }}
                  >
                    <i className="fa-solid fa-arrow-right text-[10px]"></i>
                  </div>
                </div>
              </button>
            );
          })}
          
          {filteredPromises.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 text-3xl mx-auto mb-6">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
              <h3 className="text-xl font-black text-slate-900">Nuk u gjet asnjë zotim</h3>
              <p className="text-slate-400 font-medium">Provoni të ndryshoni filtrat për të parë rezultate të tjera.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramExplorer;
