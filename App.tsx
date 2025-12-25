
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ScoreData, ComparisonPoint, PartyID } from './types';
import { INITIAL_PROMPT, PARTIES } from './constants';
import { analyzeElectionQuery } from './services/geminiService';
import AnalysisPanel from './components/AnalysisPanel';
import ComparisonGrid from './components/ComparisonGrid';
import ComparisonTable from './components/ComparisonTable';
import Methodology from './components/Methodology';

const CATEGORIES = [
  { id: 'economy', label: 'Ekonomia & Pagat', icon: 'fa-brain-circuit', color: 'emerald', query: 'Krahaso rritjen ekonomike, pagën minimale dhe premtimet për rrogën e 13-të' },
  { id: 'security', label: 'Mbrojtja & NATO', icon: 'fa-shield-halved', color: 'indigo', query: 'Krahaso rritjen e buxhetit ushtarak dhe strategjinë për anëtarësim në NATO' },
  { id: 'energy', label: 'Energjia & Gazi', icon: 'fa-bolt-lightning', color: 'amber', query: 'Krahaso projektet energjetike si gazsjellësi 500MW dhe bateritë e rrymës' },
  { id: 'social', label: 'Mbështetja Sociale', icon: 'fa-hands-holding-child', color: 'pink', query: 'Krahaso shtesat për fëmijë dhe mbështetjen për lehonat e papunë' },
  { id: 'justice', label: 'Reforma në Drejtësi', icon: 'fa-scale-unbalanced', color: 'slate', query: 'Krahaso procesin e vetingut dhe qendrat e specializuara të hetimit' },
  { id: 'edu', label: 'Arsimi & Teknologjia', icon: 'fa-microchip', color: 'blue', query: 'Krahaso programet kombëtare për Inteligjencën Artificiale dhe fondet e teknologjisë' },
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<'landing' | 'analysis' | 'methodology'>('landing');
  const [shuffledCategories, setShuffledCategories] = useState(CATEGORIES);
  const [activeAnalysis, setActiveAnalysis] = useState<{
    content: string;
    scores: ScoreData[];
    comparisonPoints: ComparisonPoint[];
    links?: Array<{ title: string; uri: string }>;
  } | null>(null);

  const [trends, setTrends] = useState<Record<string, number>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShuffledCategories([...CATEGORIES].sort(() => Math.random() - 0.5));
    const savedTrends = localStorage.getItem('zotimet_trends');
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
      localStorage.setItem('zotimet_trends', JSON.stringify(initial));
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
      localStorage.setItem('zotimet_trends', JSON.stringify(updated));
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
        content: result.analysis,
        scores: result.scores,
        comparisonPoints: result.comparisonPoints,
        links: result.groundingLinks
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performAnalysis(input);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, pid: string) => {
    const partyName = PARTIES[pid as PartyID]?.name || pid;
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partyName)}&background=f1f5f9&color=3b82f6&bold=true&size=128&font-size=0.4`;
  };

  const activePartyIds = activeAnalysis 
    ? activeAnalysis.scores.map(s => s.partyId as PartyID)
    : [];

  const sortedTrends = Object.entries(trends)
    .sort((a, b) => Number(b[1]) - Number(a[1]))
    .slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFF] text-slate-900 overflow-x-hidden selection:bg-blue-100">
      {/* Top Banner - Fixed Date Info */}
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
            <div className="hidden sm:block">
              <h1 className="text-xl font-black leading-none tracking-tight">zotimet.com</h1>
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

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
              {shuffledCategories.slice(0, 3).map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => performAnalysis(cat.query)}
                  className="group flex flex-col items-center text-center p-8 md:p-10 bg-white border border-slate-100 rounded-[2.5rem] md:rounded-[3rem] hover:border-blue-500/20 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
                >
                  <div className="w-14 md:w-16 h-14 md:h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                    <i className={`fa-solid ${cat.icon} text-slate-400 text-2xl md:text-3xl`}></i>
                  </div>
                  <h4 className="text-lg md:text-xl font-black text-slate-900 mb-3 md:mb-4 uppercase tracking-tight">{cat.label}</h4>
                  <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">Krahaso objektivat dhe zotimet specifike të partive në këtë fushë.</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {view === 'methodology' && <Methodology onBack={() => setView('landing')} />}

        {view === 'analysis' && (
          <div className="flex-1 flex flex-col lg:flex-row h-auto lg:h-[calc(100vh_-_116px)] overflow-hidden">
            {/* Chat Sidebar */}
            <div className="w-full lg:w-[400px] xl:w-[440px] flex flex-col bg-[#FDFDFF] lg:border-r border-slate-100 z-10 shrink-0 h-[500px] lg:h-full">
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar bg-slate-50/20">
                <div className="bg-slate-100/50 p-5 rounded-2xl border border-slate-200/50">
                   <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">STATUSI I ANALIZËS</p>
                   <p className="text-[10px] md:text-[11px] text-slate-500 font-bold leading-relaxed">Duke procesuar planprogramet për 28 Dhjetor...</p>
                </div>

                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4`}>
                    <div className={`max-w-[90%] rounded-2xl md:rounded-[1.5rem] px-5 py-4 md:px-6 md:py-5 text-[12px] md:text-[13px] leading-relaxed shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white font-black' 
                        : 'bg-white text-slate-600 border border-slate-100 font-bold'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 flex space-x-2 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-300"></div>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} className="h-4" />
              </div>

              <div className="p-4 md:p-6 border-t border-slate-100 bg-white">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pyet asistentin AI..."
                    className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white transition-all text-xs md:text-sm font-bold shadow-inner"
                  />
                  <button 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
                  >
                    <i className="fa-solid fa-paper-plane text-[10px] md:text-xs"></i>
                  </button>
                </form>
              </div>
            </div>

            {/* Content Display */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12 space-y-12 bg-[#F8FAFC]">
              {activeAnalysis && (
                <div className="max-w-5xl mx-auto space-y-12 md:space-y-20 pb-24">
                  <AnalysisPanel content={activeAnalysis.content} links={activeAnalysis.links} />
                  
                  <div className="space-y-8 md:space-y-12">
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="h-px w-full bg-slate-200"></div>
                      <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">METRIKAT E KRAHASUARA</h3>
                      <div className="h-px w-full bg-slate-200"></div>
                    </div>
                    <ComparisonGrid scores={activeAnalysis.scores} />
                  </div>

                  <div className="space-y-8 md:space-y-12">
                    <div className="flex items-center space-x-4 md:space-x-6">
                      <div className="h-px w-full bg-slate-200"></div>
                      <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">TABELA E ZOTIMEVE TEKNIKE</h3>
                      <div className="h-px w-full bg-slate-200"></div>
                    </div>
                    <ComparisonTable points={activeAnalysis.comparisonPoints} activePartyIds={activePartyIds} onImageError={handleImageError} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-50 py-10 md:py-12 px-6 md:px-10 text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-16">
            <span>© 2025 ZOTIMET.COM</span>
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
