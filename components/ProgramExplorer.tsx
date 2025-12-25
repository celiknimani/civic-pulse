import React, { useState } from 'react';
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
  { partyId: PartyID.LVV, category: 'security', text: '1 Miliard Euro investime në ushtri', details: 'Blerje e armatimit modern, ndërtimi i fabrikave të municionit dhe dronëve.' },
  { partyId: PartyID.LVV, category: 'economy', text: '500,000 të punësuar deri në fund të mandatit', details: 'Fokus në punësimin e rinisë dhe grave përmes masave mbështetëse.' },
  { partyId: PartyID.LVV, category: 'social', text: 'Dyfishimi i shtesave për fëmijë', details: 'Shtesat rriten nga 45€ në 90€ për muaj.' },
  { partyId: PartyID.LVV, category: 'energy', text: 'Modernizimi i Kosovës B me filtra të rinj', details: 'Reduktimi i ndotjes dhe rritja e efikasitetit.' },
  { partyId: PartyID.LVV, category: 'edu', text: 'Bursa shtesë për mobilitet', details: 'Përkrahje për studentët që studiojnë jashtë vendit.' },
  
  // PDK
  { partyId: PartyID.PDK, category: 'economy', text: 'Rritje 50% e pagave në sektorin publik', details: 'Përfshin mësuesit, mjekët dhe policët.' },
  { partyId: PartyID.PDK, category: 'economy', text: 'Pagat deri në 400€ lirohen nga tatimi', details: 'Mbrojtje për shtresat me të ardhura të ulëta.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Sigurime shëndetësore brenda 24 muajve', details: 'Zbatimi i plotë i sistemit të sigurimeve.' },
  { partyId: PartyID.PDK, category: 'energy', text: 'Ndërtimi i termocentralit "Kosova e Re" (500MW)', details: 'Stabilitet energjetik afatgjatë.' },
  { partyId: PartyID.PDK, category: 'edu', text: 'Psikolog dhe zyrtar sigurie në çdo shkollë', details: 'Mbrojtja e shëndetit mendor dhe sigurisë.' },

  // LDK
  { partyId: PartyID.LDK, category: 'economy', text: 'Buxhet shtetëror 5 miliardë euro', details: 'Rritje e hyrjeve buxhetore përmes zhvillimit.' },
  { partyId: PartyID.LDK, category: 'economy', text: 'Koeficienti i pagave në 150', details: 'Rritje e menjëhershme e pagave në sektorin publik.' },
  { partyId: PartyID.LDK, category: 'energy', text: 'Termocentrali me Gaz 500MW', details: 'Gazifikimi i plotë i Kosovës via Maqedonia e Veriut.' },
  { partyId: PartyID.LDK, category: 'edu', text: 'Programi Nacional për AI (15M Euro)', details: 'Kosova si qendër rajonale e teknologjisë.' },
  { partyId: PartyID.LDK, category: 'social', text: '5000 EUR për fëmijën e tretë', details: 'Stimulim i natalitetit përmes mbështetjes direkte.' },

  // AAK
  { partyId: PartyID.AAK, category: 'security', text: 'Anëtarësim direkt në NATO', details: 'Dialog i dizajnuar me NATO-n për anëtarësim pa vonesa.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Paga minimale 500€, Mesatare 1000€', details: 'Rritje e fuqisë blerëse për qytetarët.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Pagat e 13-ta për sektorin publik', details: 'Bonus vjetor për shërbimin ndaj qytetarëve.' },
  { partyId: PartyID.AAK, category: 'env', text: '5 diga të reja për ujitje', details: 'Sigurimi i ujit për bujqësinë dhe industrinë.' },
  { partyId: PartyID.AAK, category: 'social', text: '300€ për familjet pa të punësuar', details: 'Mbështetje direkte për mirëqenien sociale.' },

  // SHTIME TË REJA - PER T'U PËRPUTHUR ME QASJEN 'PDF'
  // LVV
  { partyId: PartyID.LVV, category: 'energy', text: 'Bateri akumuluese 170MW MCC', details: 'Rezerva strategjike energjetike (Compact Program).' },
  { partyId: PartyID.LVV, category: 'env', text: 'Autostrada Prishtinë-Gjilan-Prizren', details: 'Përfundimi i lidhjeve kryesore infrastrukturore.' },
  { partyId: PartyID.LVV, category: 'health', text: 'Spitali i Prishtinës', details: 'Fillimi i procedurave dhe ndërtimit.' },

  // PDK
  { partyId: PartyID.PDK, category: 'economy', text: '4 Miliardë Euro Fondi Investiv', details: 'Për projekte madhore strategjike zhvillimore.' },
  { partyId: PartyID.PDK, category: 'social', text: '50€ Shtesa për çdo fëmijë', details: 'Skemë universale për mbështetjen e fëmijëve.' },
  { partyId: PartyID.PDK, category: 'env', text: 'Hekurudha Prishtinë-Durrës', details: 'Lidhja strategjike me portin e Durrësit.' },

  // LDK
  { partyId: PartyID.LDK, category: 'edu', text: 'Ministri e Teknologjisë dhe Inovacionit', details: 'Fond 120M EUR për startup-e dhe inovacion.' },
  { partyId: PartyID.LDK, category: 'env', text: 'Unaza e Jashtme e Prishtinës', details: 'Investim 250M EUR për trafikun në kryeqytet.' },
  { partyId: PartyID.LDK, category: 'health', text: 'Spital i Ri i Qytetit', details: 'Zgjidhja përfundimtare për shëndetësinë në kryeqytet.' },

  // SHTIME TË TJERA NGA PDF (VOL 2)
  // AAK
  { partyId: PartyID.AAK, category: 'security', text: 'Industria e Mbrojtjes', details: 'Prodhimi i municionit dhe pajisjeve ushtarake në Kosovë.' },
  { partyId: PartyID.AAK, category: 'social', text: 'Veteranët në punë', details: 'E drejta për punë pa humbur pensionin e veteranit.' },
  { partyId: PartyID.AAK, category: 'economy', text: 'Brendimi i Shtetit', details: 'Strategji nacionale për imazhin e Kosovës në 6 muajt e parë.' },

  // LDK
  { partyId: PartyID.LDK, category: 'energy', text: 'TVSH 0% për Energji', details: 'Heqja e TVSH-së në faturat e energjisë për qytetarët.' },
  { partyId: PartyID.LDK, category: 'env', text: 'Hekurudha Xërxe-Prizren', details: 'Lidhja hekurudhore për zonën e Dukagjinit.' },
  { partyId: PartyID.LDK, category: 'social', text: 'Vetting në Drejtësi', details: 'Pastrimi i sistemit gjyqësor dhe prokurorial.' },

  // LVV
  { partyId: PartyID.LVV, category: 'economy', text: 'Banka Zhvillimore', details: 'Krijimi i bankës shtetërore për projekte strategjike.' },
  { partyId: PartyID.LVV, category: 'social', text: '10€ Bileta Mujore', details: 'Transport publik i integruar me kosto minimale.' },
  { partyId: PartyID.LVV, category: 'env', text: '20 Stadiume Futbolli', details: 'Investim masiv në infrastrukturën sportive.' },

  // PDK
  { partyId: PartyID.PDK, category: 'social', text: 'Pensione +50%', details: 'Rritje e menjëhershme për të gjitha kategoritë pensionale.' },
  { partyId: PartyID.PDK, category: 'energy', text: 'Ngrohje Qendrore në 5 Qytete', details: 'Zgjerimi i rrjetit të ngrohjes në qendrat kryesore.' },
  { partyId: PartyID.PDK, category: 'economy', text: 'TVSH 0% Produkte Bazë', details: 'Heqja e taksave për shportën e konsumatorit.' },

  // SHTIME FINALE (VOL 3) - PLOTËSIMI I KAPITUJVE
  // LDK
  { partyId: PartyID.LDK, category: 'edu', text: 'Digjitalizim i Shërbimeve', details: 'Transformimi i plotë digjital i administratës publike.' },
  { partyId: PartyID.LDK, category: 'energy', text: '500MW Energji Solare+Erë', details: 'Investime ne energji te ripertritshme.' },
  { partyId: PartyID.LDK, category: 'security', text: 'Qendra Speciale Hetimore', details: 'Themelimi i njësisë elitare kundër korrupsionit.' },

  // AAK
  { partyId: PartyID.AAK, category: 'energy', text: 'Gazsjellësi Amerikan', details: 'Lidhja strategjike me infrastrukturën e gazit.' },
  { partyId: PartyID.AAK, category: 'edu', text: 'Arsim Profesional Dual', details: 'Lidhja direkte e shkollave me tregun e punës.' },
  { partyId: PartyID.AAK, category: 'health', text: 'Fond për Sëmundje të Rënda', details: 'Mbulim 100% për trajtimet jashtë vendit.' },

  // LVV
  { partyId: PartyID.LVV, category: 'security', text: 'Shërbimi Ushtarak Rezervë', details: 'Krijimi i forcës rezervë për FSK-në.' },
  { partyId: PartyID.LVV, category: 'env', text: 'Kompleksi "Brezovica"', details: 'Investim 500M EUR në turizmin malor.' },
  { partyId: PartyID.LVV, category: 'health', text: 'Sistemi Informativ Shëndetësor', details: 'Funksionalizimi i plotë i SISH.' },

  // PDK
  { partyId: PartyID.PDK, category: 'edu', text: '30M EUR Buxhet për Bursa', details: 'Fondi vjetor për studentët ekselentë.' },
  { partyId: PartyID.PDK, category: 'energy', text: 'Minierë e Re e Linjitit', details: 'Hapja e minierës për furnizim të qëndrueshëm.' },
  { partyId: PartyID.PDK, category: 'health', text: 'Qendra Klinike Urgjente', details: 'Ndërtimi i qendrës nacionale të traumës.' },

  // SHTIME PËRFUNDIMTARE (EXTRA)
  { partyId: PartyID.LDK, category: 'economy', text: 'Ligji për Engjëjt Investitorë', details: 'Korniza ligjore për tërheqjen e investimeve në startup.' },
  { partyId: PartyID.LVV, category: 'economy', text: 'BPV 12 Miliardë Euro', details: 'Targeti për Bruto Produktin Vendor në fund të mandatit.' },
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
];

const ProgramExplorer: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeParty, setActiveParty] = useState<PartyID | 'all'>('all');
  const [selectedPromise, setSelectedPromise] = useState<PromiseItem | null>(null);

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
