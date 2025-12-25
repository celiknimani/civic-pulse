
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ScoreData, ComparisonPoint, PartyID } from './types';
import { INITIAL_PROMPT, PARTIES } from './constants';
import { analyzeElectionQuery } from './services/geminiService';
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
  { partyId: PartyID.LDK, category: 'Energji', text: 'Ndërtimi i Termocentralit me Gaz 500MW dhe Gazifikimi i plotë i Kosovës.', icon: 'fa-bolt' },
  { partyId: PartyID.LVV, category: 'Sociale', text: 'Dyfishimi i shtesave për fëmijë (deri në 90€) dhe mbështetje për lehonat.', icon: 'fa-child' },
  { partyId: PartyID.AAK, category: 'Siguri', text: 'Buxhet prej 1 miliard euro për ushtrinë dhe anëtarësim direkt në NATO.', icon: 'fa-shield-check' },
  { partyId: PartyID.LDK, category: 'Ekonomi', text: 'Rritja e koeficientit të pagave në 150 dhe buxhet shtetëror 5 miliardë €.', icon: 'fa-chart-line' },
  { partyId: PartyID.LVV, category: 'Sport', text: 'Ndërtimi i 20 stadiumeve të futbollit dhe investime masive në infrastrukturë.', icon: 'fa-futbol' },
  { partyId: PartyID.AAK, category: 'Bujqësi', text: 'Investim 100M € në ujitje dhe ndërtimi i 5 pendëve të reja ujëmbledhëse.', icon: 'fa-droplet' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'landing' | 'analysis' | 'methodology'>('landing');
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
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 overflow-x-hidden selection:bg-blue-100">
      <div className="bg-slate-900 text-white py-2 px-4 text-center">
        <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
          Dita e Zgjedhjeve: <span className="text-blue-400">28 Dhjetor 2024</span> • Analizë Neutrale përmes AI
        </p>
      </div>

      <header className={`py-4 md:py-6 px-4 md:px-10 z-50 transition-all duration-700 ${view === 'landing' ? 'bg-transparent' : 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm sticky top-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight">zotimi.com</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-1">PROGRAMI ZYRTAR 2025</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-4 md:space-x-8">
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
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-10 md:py-20 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center mb-16 space-y-8 md:space-y-12">
              <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-blue-100 bg-white text-blue-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                ANALIZË E PROGRAMEVE PËR ZGJEDHJET E 28 DHJETORIT
              </div>
              
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] md:leading-[1] tracking-tight max-w-5xl mx-auto">
                Pyet Inteligjencën <br />
                <span className="text-blue-600">Artificiale</span>, <br />
                Mbi Zotimet 2025.
              </h2>
              
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4">
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 py-2">Trending:</span>
                {sortedTrends.map(([cat]) => (
                  <button 
                    key={cat}
                    onClick={() => performAnalysis(`Krahaso zotimet e partive për ${cat}`)}
                    className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-transparent transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="relative group w-full max-w-3xl mx-auto mt-8 md:mt-12 px-2">
                <div className="relative flex flex-col md:flex-row items-center bg-slate-100/50 backdrop-blur-sm rounded-3xl md:rounded-full p-2 border-2 border-slate-100/50 group-focus-within:border-blue-500/20 group-focus-within:bg-white transition-all duration-500 shadow-inner">
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pyet n.sh: Kush premton rritjen më të madhe të pagave?"
                    className="flex-1 w-full py-4 md:py-5 px-6 md:px-8 outline-none text-slate-800 font-bold text-lg md:text-xl placeholder:text-slate-300 bg-transparent border-none focus:ring-0"
                    autoComplete="off"
                  />
                  <button 
                    disabled={!input.trim() || isLoading}
                    className="w-full md:w-auto bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-blue-500/20"
                  >
                    {isLoading ? <i className="fa-solid fa-spinner animate-spin"></i> : <span>PYET AI</span>}
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full space-y-24 mt-12 pb-24">
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
                      onClick={() => performAnalysis(cat.query)}
                      className="group flex flex-col items-start text-left p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-600/20 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 relative overflow-hidden"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <i className={`fa-solid ${cat.icon} text-slate-400 text-xl group-hover:text-white transition-colors`}></i>
                      </div>
                      <h4 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">{cat.label}</h4>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">{cat.desc}</p>
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">KRAHASO TANI <i className="fa-solid fa-arrow-right ml-1"></i></span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'methodology' && <Methodology onBack={() => setView('landing')} />}

        {view === 'analysis' && (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-116px)] overflow-hidden bg-slate-50">
            {/* Left: Chat & Knowledge Sidebar */}
            <aside className="w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-white border-r border-slate-200 shadow-xl z-20 transition-all">
              <div className="p-5 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ASISTENTI I ANALIZËS</span>
                  <button onClick={() => setView('landing')} className="text-[10px] font-black text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors">FILLIMI</button>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                    Hulumto zotimet specifike duke bërë pyetje pasuese për çdo temë.
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[12px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white font-bold' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200 font-medium'
                    }`}>
                      {msg.content.length > 200 && msg.role === 'assistant' ? `${msg.content.substring(0, 200)}...` : msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl px-4 py-3 flex space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-4" />
              </div>

              <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pyet prapë..."
                    className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all text-sm font-medium"
                  />
                  <button 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-transform disabled:opacity-50"
                  >
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
                </form>
              </div>
            </aside>

            {/* Right: Insights & Visualization Hub */}
            <section ref={resultsRef} className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8FAFC]">
              {activeAnalysis ? (
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10">
                  {/* Analysis Summary Header */}
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                      <div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100 mb-3 inline-block">Analiza Aktive</span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          {activeAnalysis.query}
                        </h2>
                      </div>
                      <div className="flex items-center space-x-3 shrink-0">
                         <div className="flex -space-x-2">
                            {activePartyIds.map(pid => (
                              <div key={pid} className="w-8 h-8 rounded-full border-2 border-white bg-white p-1 shadow-sm overflow-hidden">
                                <img src={PARTIES[pid]?.logo} alt={pid} className="w-full h-full object-contain" onError={(e) => handleImageError(e, pid)} />
                              </div>
                            ))}
                         </div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activePartyIds.length} PARTI NË KRAHASIM</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Primary Text Analysis */}
                      <div className="xl:col-span-2">
                        <AnalysisPanel content={activeAnalysis.content} links={activeAnalysis.links} />
                      </div>
                      
                      {/* Mini Visualizer / Side KPIs */}
                      <div className="space-y-8">
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">PIKËZIMI VIZUAL</h4>
                           <div className="h-[300px]">
                              <ScoreVisualizer scores={activeAnalysis.scores} />
                           </div>
                        </div>
                        <div className="bg-blue-600 p-6 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                           <i className="fa-solid fa-circle-info text-2xl mb-4 opacity-50"></i>
                           <h4 className="font-black text-sm uppercase tracking-tight mb-2">Përditësimi i fundit</h4>
                           <p className="text-xs text-blue-100 font-medium leading-relaxed">
                              Të dhënat janë sinkronizuar me programet zyrtare të dorëzuara deri më 20 Dhjetor 2024.
                           </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Dive Sections */}
                  <div className="space-y-16 py-12 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    <div className="space-y-8">
                      <div className="flex items-center space-x-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">METRIKAT E DETAJUARA</h3>
                        <div className="h-px w-full bg-slate-200"></div>
                      </div>
                      <ComparisonGrid scores={activeAnalysis.scores} />
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center space-x-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">TABELA E ZOTIMEVE TEKNIKE</h3>
                        <div className="h-px w-full bg-slate-200"></div>
                      </div>
                      <ComparisonTable points={activeAnalysis.comparisonPoints} activePartyIds={activePartyIds} onImageError={handleImageError} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8 text-center">
                  <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 text-3xl mx-auto border border-blue-100">
                      <i className="fa-solid fa-chart-line animate-pulse"></i>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Gati për analizë</h3>
                    <p className="text-sm text-slate-400 font-medium">Bëni një pyetje në anën e majtë për të gjeneruar të dhënat dhe krahasimet e planprogrameve.</p>
                  </div>
                </div>
              )}
            </section>
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
          <span className="text-blue-600 font-black tracking-widest bg-blue-50 px-4 py-2 rounded-full border border-blue-100/50">POWERED BY GEMINI 3</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
