
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ScoreData, ComparisonPoint, PartyID } from './types';
import { INITIAL_PROMPT, PARTIES } from './constants';
import { analyzeElectionQuery } from './services/searchService';
import AnalysisPanel from './components/AnalysisPanel';
import ComparisonGrid from './components/ComparisonGrid';
import ComparisonTable from './components/ComparisonTable';
import Methodology from './components/Methodology';
import ScoreVisualizer from './components/ScoreVisualizer';
import ProgramExplorer from './components/ProgramExplorer';
import { Route, Switch, useLocation, Link } from 'wouter';

const CATEGORIES = [
  { id: 'economy', label: 'Ekonomia & Pagat', icon: 'fa-brain-circuit', desc: 'Rritja ekonomike, paga minimale dhe koeficientet e sektorit publik.', query: 'Krahaso rritjen ekonomike, pagën minimale dhe koeficientet e pagave' },
  { id: 'security', label: 'Mbrojtja & NATO', icon: 'fa-shield-halved', desc: 'Anëtarësimi në NATO dhe rritja e buxhetit për ushtrinë (FSK).', query: 'Krahaso strategjinë për NATO dhe buxhetin e ushtrisë' },
  { id: 'energy', label: 'Energjia & Gazi', icon: 'fa-bolt-lightning', desc: 'Projektet e reja energjetike, gazifikimi dhe stabiliteti i rrymës.', query: 'Krahaso projektet për energji, gazsjellësin dhe bateritë' },
  { id: 'social', label: 'Mbështetja Sociale', icon: 'fa-hands-holding-child', desc: 'Shtesat për fëmijë, lehonat dhe skemat për familjet në nevojë.', query: 'Krahaso shtesat për fëmijë dhe mbështetjen për lehonat' },
  { id: 'justice', label: 'Reforma në Drejtësi', icon: 'fa-scale-unbalanced', desc: 'Procesi i vetingut dhe lufta kundër krimit e korrupsionit.', query: 'Krahaso reformat në drejtësi dhe procesin e vetingut' },
  { id: 'edu', label: 'Arsimi & Inovacioni', icon: 'fa-microchip', desc: 'Digjitalizimi i shkollave, fondet e inovacionit dhe AI.', query: 'Krahaso programet për arsimin dhe teknologjinë' },
  { id: 'health', label: 'Shëndetësia', icon: 'fa-heart-pulse', desc: 'Sigurimet shëndetësore, barnat esenciale dhe mjekësia primare.', query: 'Krahaso planet për sigurime shëndetësore dhe shëndetësinë' },
  { id: 'agri', label: 'Bujqësia & Fshati', icon: 'fa-wheat-awn', desc: 'Grantet për fermerët, sistemet e ujitjes dhe prodhimi vendor.', query: 'Krahaso subvencionet në bujqësi dhe sistemet e ujitjes' },
  { id: 'youth', label: 'Rinia & Sporti', icon: 'fa-volleyball', desc: 'Infrastruktura sportive dhe përkrahja e talenteve të rinj.', query: 'Krahaso investimet në stadiume dhe mbështetjen për rininë' },
  { id: 'diaspora', label: 'Diaspora & Mërgata', icon: 'fa-earth-europe', desc: 'Investimet e huaja, votimi i mërgatës dhe lidhja me atdheun.', query: 'Krahaso zotimet për diasporën dhe lehtësimet për investime' },
  { id: 'env', label: 'Infrastruktura', icon: 'fa-leaf', desc: 'Trajtimi i mbeturinave, ajri i pastër dhe e ardhmja e gjelbër.', query: 'Krahaso politikat mjedisore dhe mbrojtjen e ambientit' },
  { id: 'culture', label: 'Kultura & Turizmi', icon: 'fa-masks-theater', desc: 'Trashëgimia kulturore dhe promovimi i turizmit në botë.', query: 'Krahaso planet për kulturën dhe turizmin' },
];

const FEATURED_PROMISES = [
  { partyId: PartyID.LVV, category: 'Siguria', text: '1 Miliard Euro për ushtrinë dhe ndërtimi i fabrikës së parë të dronëve në Kosovë.', icon: 'fa-shield-halved' },
  { partyId: PartyID.LDK, category: 'Energjia', text: 'Gazifikimi i plotë i Kosovës dhe ndërtimi i termocentralit 500MW me gaz.', icon: 'fa-bolt' },
  { partyId: PartyID.PDK, category: 'Ekonomi', text: 'Rritje e menjëhershme 50% e pagave për mësues, mjekë dhe policë.', icon: 'fa-money-bill-trend-up' },
  { partyId: PartyID.AAK, category: 'Siguria', text: 'Anëtarësimi direkt në NATO përmes planit të ri të harmonizuar me SHBA-të.', icon: 'fa-globe' },
  { partyId: PartyID.LVV, category: 'Sociale', text: 'Dyfishimi i shtesave për fëmijë (45€ deri në 90€) dhe 3000€ për lehonat e papuna.', icon: 'fa-baby' },
  { partyId: PartyID.LDK, category: 'Ekonomi', text: 'Investime kapitale prej 5 miliardë eurosh dhe rritje e BPV-së prej 5% çdo vit.', icon: 'fa-chart-line' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useLocation();
  const [shuffledCategories, setShuffledCategories] = useState(CATEGORIES);
  const [activeAnalysis, setActiveAnalysis] = useState<{
    query: string;
    content: string;
    scores: ScoreData[];
    comparisonPoints: ComparisonPoint[];
    links?: Array<{ title: string; uri: string }>;
  } | null>(null);

  const [trends, setTrends] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShuffledCategories([...CATEGORIES].sort(() => Math.random() - 0.5));
    const savedTrends = localStorage.getItem('zotimi_trends_v2');
    if (savedTrends) {
      try {
        const parsed = JSON.parse(savedTrends);
        setTrends(parsed as Record<string, number>);
      } catch (e) {
        console.error("Failed to parse trends", e);
      }
    } else {
      const initial = { 
        'Siguria': 510, 
        'Ekonomia': 413, 
        'Energjia': 202, 
        'Arsimi': 177, 
        'Bujqësia': 153
      };
      setTrends(initial);
      localStorage.setItem('zotimi_trends_v2', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const updateTrends = (category: string) => {
    setTrends(prev => {
      const currentCount = Number(prev[category] || 0);
      const updated = { ...prev, [category]: currentCount + 1 };
      localStorage.setItem('zotimi_trends_v2', JSON.stringify(updated));
      return updated;
    });
  };

  const performAnalysis = async (query: string) => {
    if (!query.trim() || isLoading) return;
    setLocation('/analysis?q=' + encodeURIComponent(query));
  };

  // Effect to handle direct analysis from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get('q');
    if (location === '/analysis' && q && (!activeAnalysis || activeAnalysis.query !== q)) {
      const run = async () => {
        setIsLoading(true);
        try {
          const result = await analyzeElectionQuery(q);
          if (result.detectedCategory) updateTrends(result.detectedCategory);
          setActiveAnalysis({
            query: q,
            content: result.analysis,
            scores: result.scores,
            comparisonPoints: result.comparisonPoints,
            links: result.groundingLinks
          });
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      run();
    }
  }, [location, activeAnalysis]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, pid: string) => {
    const party = PARTIES[pid as PartyID];
    const partyName = party?.name || pid;
    const cleanColor = (party?.color || '#3b82f6').replace('#', '');
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partyName)}&background=${cleanColor}&color=fff&bold=true&size=128&font-size=0.4`;
  };

  const activePartyIds = activeAnalysis 
    ? activeAnalysis.scores.map(s => s.partyId as PartyID)
    : [];

  const sortedTrends = Object.entries(trends)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-slate-900 overflow-x-hidden selection:bg-blue-100 relative">
      <div className="bg-ambient-kosovo">
        <div className="grid-pattern"></div>
        <div className="blob-blue"></div>
        <div className="blob-gold"></div>
      </div>
      
      <div className="bg-slate-900 text-white py-2 px-4 text-center">
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
          Dita e Zgjedhjeve: <span className="text-blue-400">28 Dhjetor 2025</span> • Kërkim i Harmonizuar Sektorial
        </p>
      </div>

      <header className={`py-4 md:py-6 px-4 md:px-10 z-50 transition-all duration-700 ${location === '/' ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm sticky top-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-database text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight">zotimi.com</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">INDEKSI ZYRTAR 2025</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-4 md:space-x-8">
            <Link 
              href="/explorer"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location.startsWith('/explorer') ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              EKSPLORUESI
            </Link>
            <Link 
              href="/methodology"
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${location === '/methodology' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              SI FUNKSIONON?
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">
        <Switch>
          <Route path="/">
            <div className="flex-1 flex flex-col items-center">
              <section className="w-full bg-slate-900 text-white relative overflow-hidden py-16 md:py-32 px-4 md:px-6">
                <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full text-left">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
                      <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-blue-400 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl backdrop-blur-sm">
                        INDEKSI ZYRTAR I PROGRAMEVE 2025
                      </div>
                      
                      <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter">
                        Zotimet e <span className="text-blue-500">Partive</span>. <br />
                        <span className="text-slate-500">Pa Filtër, Pa Interpretim.</span>
                      </h2>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex -space-x-3">
                          {Object.values(PARTIES)
                            .filter(p => p.id !== PartyID.LISTA_GUXO && p.id !== PartyID.NISMA)
                            .map((p, i) => (
                              <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-white p-1.5 shadow-xl">
                                <img src={p.logo} alt={p.name} className="w-full h-full object-contain" />
                              </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Analizë e sinkronizuar për <br /> të gjitha subjektet kryesore
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl rounded-[3.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group animate-in fade-in slide-in-from-right-8 duration-1000">
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-amber-500/5 opacity-50"></div>
                      <div className="relative z-10 space-y-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                          <i className="fa-solid fa-database text-2xl"></i>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-2xl font-black tracking-tight">Si funksionon zotimi.com?</h3>
                          <p className="text-slate-300 font-medium text-base leading-relaxed">
                            Platforma është ndërtuar me <span className="text-white font-black">AI Moderne</span>, duke analizuar mbi 800 faqe material zyrtar për të nxjerrë çdo zotim pa asnjë ndryshim manual.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {[
                             { label: 'Analizë AI', icon: 'fa-robot', color: 'text-purple-400' },
                             { label: 'Verifikim i Zotimeve', icon: 'fa-check-double', color: 'text-emerald-400' }
                           ].map((tag, t) => (
                             <div key={t} className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
                                <i className={`fa-solid ${tag.icon} ${tag.color} text-[10px]`}></i>
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">{tag.label}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 mt-24 w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (input.trim()) performAnalysis(input);
                      }} 
                      className="relative group w-full max-w-5xl px-2"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] blur opacity-25 group-focus-within:opacity-75 transition duration-1000"></div>
                      <div className="relative flex flex-col md:flex-row items-center bg-white rounded-[3rem] p-3 shadow-2xl">
                        <div className="flex-1 flex items-center w-full px-6">
                          <i className="fa-solid fa-magnifying-glass text-slate-300 text-xl md:text-2xl"></i>
                          <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Kërko zotimin n.sh: 'rritja e pagave', 'anëtarësimi në NATO'..."
                            className="flex-1 py-5 md:py-6 px-4 md:px-6 outline-none text-slate-900 font-bold text-xl md:text-3xl placeholder:text-slate-300 bg-transparent"
                            autoComplete="off"
                          />
                        </div>
                        <button 
                          disabled={!input.trim() || isLoading}
                          className="w-full md:w-auto bg-blue-600 text-white px-10 md:px-16 py-5 md:py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-sm hover:bg-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>KËRKO TANI</span>}
                        </button>
                      </div>
                    </form>

                    <div className="flex flex-wrap justify-center gap-3">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2 py-3">MË TË PËRMENDURAT NË PROGRAME:</span>
                      {sortedTrends.map(([cat, count]) => (
                        <button 
                          key={cat}
                          onClick={() => performAnalysis(`Krahaso zotimet e partive për ${cat}`)}
                          className="px-5 py-3 bg-white/5 hover:bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-3 active:scale-95 backdrop-blur-sm group/tag"
                        >
                          <span>{cat}</span>
                          <span className="bg-white/10 px-2 py-0.5 rounded text-[9px] text-slate-400 group-hover/tag:text-white group-hover/tag:bg-white/20 transition-all">{count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-24 py-24">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                   {[
                     { label: 'Programe të Indeksuara', val: '4', icon: 'fa-file-pdf' },
                     { label: 'Zotime të Koduara', val: '450+', icon: 'fa-code-branch' },
                     { label: 'Sektorët e Mbuluar', val: '12', icon: 'fa-layer-group' },
                     { label: 'Verifikim Njerezor', val: '100%', icon: 'fa-user-check' }
                   ].map((s, i) => (
                     <div key={i} className="text-center space-y-3">
                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-100 shadow-sm transition-transform">
                          <i className={`fa-solid ${s.icon} text-xl`}></i>
                       </div>
                       <div className="text-3xl font-black text-slate-900">{s.val}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{s.label}</div>
                     </div>
                   ))}
                </div>

                <div className="space-y-12">
                  <div className="flex items-center space-x-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">ZOTIMET E VEÇUARA NGA PROGRAMET</h3>
                    <div className="h-px w-full bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_PROMISES.map((promise, idx) => {
                      const party = PARTIES[promise.partyId];
                      return (
                        <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col space-y-5 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-500 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 p-1.5 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                <img src={party.logo} alt={party.name} className="w-full h-full object-contain" onError={(e) => handleImageError(e, party.id)} />
                              </div>
                              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{party.id}</span>
                            </div>
                            <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100/30">
                              {promise.category}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 font-bold leading-relaxed">
                            "{promise.text}"
                          </p>
                          <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Burimi: Programi Zyrtar</span>
                            <i className={`fa-solid ${promise.icon} text-slate-100 text-2xl group-hover:text-blue-500/10 transition-colors`}></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="flex items-center space-x-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">HULUMTO SIPAS KATEGORIVE</h3>
                    <div className="h-px w-full bg-slate-100"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {shuffledCategories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => setLocation('/explorer?category=' + cat.id)}
                        className="group flex flex-col items-start text-left p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-600/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <i className={`fa-solid ${cat.icon} text-slate-400 text-xl group-hover:text-white transition-colors`}></i>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{cat.label}</h4>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{cat.desc}</p>
                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">SHFLETO ZOTIMET <i className="fa-solid fa-arrow-right ml-1"></i></span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Route>

          <Route path="/explorer">
            <ProgramExplorer onBack={() => setLocation('/')} />
          </Route>

          <Route path="/methodology">
            <Methodology onBack={() => setLocation('/')} />
          </Route>

          <Route path="/analysis">
            {activeAnalysis ? (
              <div className="flex-1 flex flex-col min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
                  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <button onClick={() => setLocation('/')} className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors mb-2 text-[10px] font-black uppercase tracking-widest">
                        <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                        <span>Kthehu tek kërkimi</span>
                      </button>
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Rezultatet e krahasimit për: <span className="text-blue-600">"{activeAnalysis.query}"</span>
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {activePartyIds.map(pid => (
                          <div key={pid} className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shadow-sm" title={PARTIES[pid].name}>
                            <img src={PARTIES[pid].logo} alt={pid} className="w-full h-full object-contain" onError={(e) => handleImageError(e, pid)} />
                          </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
                  <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <ComparisonTable points={activeAnalysis.comparisonPoints} activePartyIds={activePartyIds} onImageError={handleImageError} />
                    {activeAnalysis.comparisonPoints.length === 0 && (
                      <div className="text-center py-20">
                          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <i className="fa-solid fa-table-cells-large text-3xl"></i>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Nuk u gjetën të dhëna krahasuese</h3>
                          <p className="text-slate-500 mt-2">Provoni një kërkim tjetër ose shfletoni kategoritë.</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-8 text-center text-slate-400 text-xs font-medium">
                      * Të dhënat janë nxjerrë direkt nga programet zyrtare të vitit 2025.
                  </div>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Duke procesuar analizën...</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-screen text-center">
                <div className="space-y-6">
                   <h3 className="text-xl font-bold">Asnjë analizë aktive</h3>
                   <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold inline-block">Kthehu mbrapa</Link>
                </div>
              </div>
            )}
          </Route>
        </Switch>
      </main>

      <footer className="bg-white border-t border-slate-50 py-10 md:py-12 px-6 md:px-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-16">
            <span>© 2025 ZOTIMI.COM</span>
            <Link href="/methodology" className="hover:text-blue-600 transition-colors">METODOLOGJIA</Link>
            <span className="flex items-center"><i className="fa-solid fa-shield-halved mr-2 text-blue-500/50"></i> NEUTRALITET POLITIK</span>
          </div>
          <span className="text-blue-600 font-black tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100/50">INDEKSI I PROGRAMEVE 2025</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
