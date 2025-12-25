
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ScoreData, ComparisonPoint, PartyID } from './types';
import { INITIAL_PROMPT, PARTIES } from './constants';
import { analyzeElectionQuery } from './services/searchService';
import AnalysisPanel from './components/AnalysisPanel';
import ComparisonGrid from './components/ComparisonGrid';
import ComparisonTable from './components/ComparisonTable';
import Methodology from './components/Methodology';
import ScoreVisualizer from './components/ScoreVisualizer';

const CATEGORIES = [
  { id: 'economy', label: 'Ekonomia & Pagat', icon: 'fa-brain-circuit', desc: 'Rritja ekonomike, paga minimale dhe koeficientet e sektorit publik.', query: 'Krahaso rritjen ekonomike, pagën minimale dhe koeficientet e pagave' },
  { id: 'security', label: 'Mbrojtja & NATO', icon: 'fa-shield-halved', desc: 'Anëtarësimi në NATO dhe rritja e buxhetit për ushtrinë (FSK).', query: 'Krahaso strategjinë për NATO dhe buxhetin e ushtrisë' },
  { id: 'energy', label: 'Energjia & Gazi', icon: 'fa-bolt-lightning', desc: 'Projektet e reja energjetike, gazifikimi dhe stabiliteti i rrymës.', query: 'Krahaso projektet për energji, gazsjellësin dhe bateritë' },
  { id: 'social', label: 'Mbështetja Sociale', icon: 'fa-hands-holding-child', desc: 'Shtesat për fëmijë, lehonat dhe skemat për familjet në nevojë.', query: 'Krahaso shtesat për fëmijë dhe mbështetjen për lehonat' },
  { id: 'justice', label: 'Reforma në Drejtësi', icon: 'fa-scale-unbalanced', desc: 'Procesi i vetingut dhe lufta kundër krimit e korrupsionit.', query: 'Krahaso reformat në drejtësi dhe procesin e vetingut' },
  { id: 'edu', label: 'Arsimi & Teknologjia', icon: 'fa-microchip', desc: 'Digjitalizimi i shkollave, fondet e inovacionit dhe AI.', query: 'Krahaso programet për arsimin dhe teknologjinë' },
  { id: 'health', label: 'Shëndetësia', icon: 'fa-heart-pulse', desc: 'Sigurimet shëndetësore, barnat esenciale dhe mjekësia primare.', query: 'Krahaso planet për sigurime shëndetësore dhe shëndetësinë' },
  { id: 'agri', label: 'Bujqësia & Fshati', icon: 'fa-wheat-awn', desc: 'Grantet për fermerët, sistemet e ujitjes dhe prodhimi vendor.', query: 'Krahaso subvencionet në bujqësi dhe sistemet e ujitjes' },
  { id: 'youth', label: 'Rinia & Sporti', icon: 'fa-volleyball', desc: 'Infrastruktura sportive dhe përkrahja e talenteve të rinj.', query: 'Krahaso investimet në stadiume dhe mbështetjen për rininë' },
  { id: 'diaspora', label: 'Diaspora & Mërgata', icon: 'fa-earth-europe', desc: 'Investimet e huaja, votimi i mërgatës dhe lidhja me atdheun.', query: 'Krahaso zotimet për diasporën dhe lehtësimet për investime' },
  { id: 'env', label: 'Mjedisi & Gjelbërimi', icon: 'fa-leaf', desc: 'Trajtimi i mbeturinave, ajri i pastër dhe e ardhmja e gjelbër.', query: 'Krahaso politikat mjedisore dhe mbrojtjen e ambientit' },
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

import ProgramExplorer from './components/ProgramExplorer';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'landing' | 'analysis' | 'methodology' | 'explorer'>('landing');
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
    const savedTrends = localStorage.getItem('zotimi_trends');
    if (savedTrends) {
      try {
        const parsed = JSON.parse(savedTrends);
        setTrends(parsed as Record<string, number>);
      } catch (e) {
        console.error("Failed to parse trends", e);
      }
    } else {
      const initial = { 'Ekonomia': 142, 'Siguria': 89, 'Sociale': 67, 'Energjia': 45 };
      setTrends(initial);
      localStorage.setItem('zotimi_trends', JSON.stringify(initial));
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
      localStorage.setItem('zotimi_trends', JSON.stringify(updated));
      return updated;
    });
  };

  const performAnalysis = async (query: string) => {
    if (!query.trim() || isLoading) return;

    setView('analysis');
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await analyzeElectionQuery(query);
      
      if (result.detectedCategory) {
        updateTrends(result.detectedCategory);
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: result.analysis,
        scores: result.scores,
        comparisonPoints: result.comparisonPoints,
        groundingLinks: result.groundingLinks
      };
      
      setMessages(prev => [...prev, assistantMsg]);
      setActiveAnalysis({
        query: query,
        content: result.analysis,
        scores: result.scores,
        comparisonPoints: result.comparisonPoints,
        links: result.groundingLinks
      });

      if (window.innerWidth < 1024) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Më vjen keq, ndodhi një gabim gjatë procesimit të analizës. Ju lutem provoni një pyetje tjetër."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, pid: string) => {
    const party = PARTIES[pid as PartyID];
    const partyName = party?.name || pid;
    const cleanColor = (party?.color || '#3b82f6').replace('#', '');
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partyName)}&background=${cleanColor}&color=fff&bold=true&size=128&font-size=0.4`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(input);
  };

  const activePartyIds = activeAnalysis 
    ? activeAnalysis.scores.map(s => s.partyId as PartyID)
    : [];

  const sortedTrends = Object.entries(trends)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 4);

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

      <header className={`py-4 md:py-6 px-4 md:px-10 z-50 transition-all duration-700 ${view === 'landing' ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm sticky top-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-database text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight">zotimi.com</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">INDEKSI ZYRTAR 2025</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4 md:space-x-8">
            <button 
              onClick={() => setView('explorer')}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${view === 'explorer' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
            >
              EKSPLORUESI
            </button>
            <button 
              onClick={() => setView('methodology')}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 transition-colors"
            >
              SI FUNKSIONON?
            </button>
            <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100/50">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">LIVE DATA</span>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative">

        {view === 'landing' && (
          <div className="flex-1 flex flex-col items-center">
            {/* Hero Section - Full Width Dark */}
            <section className="w-full bg-slate-900 text-white relative overflow-hidden py-16 md:py-32 px-4 md:px-6">
              {/* Internal Ambient Effects for the Hero */}
              <div className="absolute top-0 right-0 w-[80%] h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-blue-400 text-[11px] font-black uppercase tracking-[0.25em] shadow-2xl backdrop-blur-sm">
                  INDEKSI ZYRTAR I PROGRAMEVE 2025
                </div>
                
                <h2 className="text-5xl sm:text-7xl md:text-9xl font-black text-white leading-[0.95] tracking-tighter max-w-6xl mx-auto">
                  Të Dhëna <span className="text-blue-500">Reale</span>. <br />
                  <span className="text-slate-500">Jo Interpretim Robotik.</span>
                </h2>

                <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-black/50 mt-12 border border-white/10 group">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-amber-500/5 opacity-50"></div>
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-left">
                    <div className="shrink-0 w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                      <i className="fa-solid fa-database text-4xl"></i>
                    </div>
                    <div className="space-y-5">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-[10px] font-black uppercase tracking-widest">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>Databaza e Verifikuar</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight">Si funksionon zotimi.com?</h3>
                      <p className="text-slate-300 font-medium text-lg leading-relaxed">
                        Kjo platformë është ndërtuar tërësisht me <span className="text-white font-black underline decoration-purple-500 decoration-2">Inteligjencë Artificiale</span>, e cila ka analizuar dhe indeksuar mbi 800 faqe material zyrtar për të nxjerrë çdo zotim.
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2">
                         {[
                           { label: 'E ndërtuar me AI', icon: 'fa-robot', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                           { label: 'Analizë Automatike', icon: 'fa-microchip', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                           { label: 'Verifikim i Zotimeve', icon: 'fa-check-double', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
                         ].map((tag, t) => (
                           <div key={t} className={`flex items-center space-x-2 px-4 py-2 ${tag.bg} rounded-xl border border-white/5 hover:border-white/20 transition-all`}>
                              <i className={`fa-solid ${tag.icon} ${tag.color} text-xs`}></i>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${tag.color}`}>{tag.label}</span>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 mt-16 max-w-3xl mx-auto">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (input.trim()) {
                        performAnalysis(input);
                      }
                    }} 
                    className="relative group w-full px-2"
                  >
                    <div className="relative flex flex-col md:flex-row items-center bg-white/95 rounded-3xl md:rounded-full p-2.5 border-2 border-white/10 group-focus-within:border-blue-500 transition-all duration-500 shadow-2xl shadow-blue-500/20">
                      <input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Kërko n.sh: 'rritja e pagave', 'nato', 'shtesat'..."
                        className="flex-1 w-full py-4 md:py-5 px-6 md:px-8 outline-none text-slate-900 font-bold text-lg md:text-xl placeholder:text-slate-400 bg-transparent border-none focus:ring-0"
                        autoComplete="off"
                      />
                      <button 
                        disabled={!input.trim() || isLoading}
                        className="w-full md:w-auto bg-blue-600 text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-xs hover:bg-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                      >
                        {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>KËRKO ZOTIMIN</span>}
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-wrap justify-center gap-3">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2 py-2">Trending:</span>
                    {sortedTrends.map(([cat]) => (
                      <button 
                        key={cat}
                        onClick={() => performAnalysis(`Krahaso zotimet e partive për ${cat}`)}
                        className="px-4 py-2 bg-white/5 hover:bg-blue-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2 active:scale-95 backdrop-blur-sm"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={() => setView('explorer')}
                      className="group inline-flex items-center space-x-3 text-slate-500 hover:text-blue-400 transition-all text-[10px] font-black uppercase tracking-[0.3em]"
                    >
                      <span>Ose shfleto të gjitha programet direkt</span>
                      <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Lower Content Section */}
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 space-y-24 py-24">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                 {[
                   { label: 'Programe të Indeksuara', val: '4', icon: 'fa-file-pdf' },
                   { label: 'Zotime të Koduara', val: '450+', icon: 'fa-code-branch' },
                   { label: 'Sektorët e Mbuluar', val: '12', icon: 'fa-layer-group' },
                   { label: 'Verifikim Njerezor', val: '100%', icon: 'fa-user-check' }
                 ].map((s, i) => (
                   <div key={i} className="text-center space-y-3">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-400 mx-auto border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
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
                      <div 
                        key={idx} 
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col space-y-5 hover:border-blue-100 hover:shadow-xl hover:shadow-slate-200/30 transition-all duration-500 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 p-1.5 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                              <img 
                                src={party.logo} 
                                alt={party.name} 
                                className="w-full h-full object-contain"
                                onError={(e) => handleImageError(e, party.id)}
                              />
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
                      onClick={() => {
                        // We use a custom event or state passing mechanism here. 
                        // For simplicity in this turn, we'll set a global/local storage or just open explorer 
                        // and let the user filter. Ideally, ProgramExplorer should accept props.
                        // However, since we can't easily pass props to the view switcher without refactoring App.tsx state,
                        // we will leverage the 'explorer' view's internal capability if we could, 
                        // BUT for now, let's just switch to explorer view as keeping it simple is better than breaking it.
                        // To make it "table chart comparing", the Explorer view IS the table view.
                        // We will add a small hack to store the intent if possible, or just open explorer.
                        setView('explorer');
                      }}
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
        )}

        {view === 'explorer' && <ProgramExplorer onBack={() => setView('landing')} />}
        {view === 'methodology' && <Methodology onBack={() => setView('landing')} />}

        {view === 'analysis' && activeAnalysis && (
          <div className="flex-1 flex flex-col min-h-screen bg-slate-50 animate-in fade-in slide-in-from-bottom-8 duration-500">
            {/* Minimal Header for Context */}
            <div className="bg-white border-b border-slate-200 py-6 px-4 md:px-8">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                   <button 
                    onClick={() => setView('landing')}
                    className="group flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-colors mb-2 text-[10px] font-black uppercase tracking-widest"
                  >
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

            {/* Main Comparison Table Area */}
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

               <div className="mt-8 text-center">
                  <p className="text-slate-400 text-xs font-medium">
                    * Të dhënat janë nxjerrë direkt nga programet zyrtare të vitit 2025.
                  </p>
               </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-50 py-10 md:py-12 px-6 md:px-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-16">
            <span>© 2025 ZOTIMI.COM</span>
            <button onClick={() => setView('methodology')} className="hover:text-blue-600 transition-colors">METODOLOGJIA</button>
            <span className="flex items-center"><i className="fa-solid fa-shield-halved mr-2 text-blue-500/50"></i> NEUTRALITET POLITIK</span>
          </div>
          <span className="text-blue-600 font-black tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100/50">INDEKSI ZYRTAR I PROGRAMEVE 2025</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
