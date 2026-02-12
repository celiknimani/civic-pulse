
import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { LVV_PROMISES, CATEGORIES } from './data';
import PromiseCard from './components/PromiseCard';
import DashboardStats from './components/DashboardStats';
import { PromiseDetail } from './components/PromiseDetail';
import Methodology from './components/Methodology';
import { PromiseStatus } from './types';

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PromiseStatus | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredPromises = LVV_PROMISES.filter(promise => {
    const matchesCategory = selectedCategory === 'all' || promise.category === selectedCategory;
    const matchesSearch = promise.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          promise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || promise.status === statusFilter;
    
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const displayedPromises = filteredPromises.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(15);
  }, [selectedCategory, searchTerm, statusFilter]);

  return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Përditësimi i fundit: Janar 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              Transparencë për <br/> <span className="text-blue-700">Programin Qeverisës</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Një pasqyrë e detajuar e zotimeve të Lëvizjes Vetëvendosje. Çfarë u premtua, çfarë u realizua dhe çfarë mbeti në gjysmë.
            </p>
          </div>

          <DashboardStats promises={LVV_PROMISES} />

          <div className="mb-12 flex flex-col items-center space-y-6">
            <div className="flex flex-wrap justify-center gap-2 max-w-5xl mx-auto">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedCategory === cat.id 
                      ? 'bg-blue-700 text-white border-blue-700 shadow-lg shadow-blue-600/20 transform scale-105' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <i className={`fa-solid ${cat.icon} mr-2`}></i>
                    {cat.label}
                  </button>
                ))}
            </div>

            <div className="w-full max-w-2xl">
              <div className="relative">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kërko sipas titullit ose përshkrimit..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-10 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs transition-colors"
                    aria-label="Pastro kërkimin"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full border border-slate-200 shadow-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Statusi:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as PromiseStatus | 'All')}
                  className="bg-transparent border-none outline-none font-bold text-xs text-slate-700 uppercase tracking-wide cursor-pointer py-1"
                >
                  <option value="All">Të gjitha</option>
                  <option value="Completed">Të Përfunduara</option>
                  <option value="In Progress">Në Proces</option>
                  <option value="Delayed">Të Vonuara</option>
                </select>
            </div>
          </div>

          {filteredPromises.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPromises.map(promise => (
                    <PromiseCard key={promise.id} promise={promise} />
                  ))}
                </div>

                {visibleCount < filteredPromises.length && (
                    <div className="mt-16 text-center">
                        <button 
                            onClick={() => setVisibleCount(prev => prev + 15)}
                            className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                        >
                            <i className="fa-solid fa-plus mr-3 text-amber-500"></i>
                            Shiko më shumë
                        </button>
                    </div>
                )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <i className="fa-solid fa-search text-2xl"></i>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nuk u gjetën zotime</h3>
              <p className="text-slate-500">Provoni të ndryshoni kriteret e kërkimit.</p>
            </div>
          )}

        </main>
  );
};

const App: React.FC = () => {
  const [location, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-amber-100">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-gradient-to-b from-blue-500/5 to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-gradient-to-t from-amber-500/5 to-transparent rounded-full blur-[100px]"></div>
      </div>

      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setLocation('/')}>
             <div className="w-10 h-10 bg-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <i className="fa-solid fa-flag text-white text-lg"></i>
             </div>
             <div>
               <h1 className="text-xl font-black tracking-tight text-slate-900">ZOTIMI</h1>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Monitorimi i progresit të zotimeve 2026 - 2030</p>
             </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-[11px] font-black uppercase tracking-widest text-slate-500">
             <a href="#" className="hover:text-blue-700 transition-colors" onClick={(e) => { e.preventDefault(); setLocation('/'); }}>Kreu</a>
             <a href="/methodology" className="hover:text-blue-700 transition-colors" onClick={(e) => { e.preventDefault(); setLocation('/methodology'); }}>Si funksionon?</a>
             <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-full border border-amber-100">
                Mandati 2026-2030
             </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/methodology">
            <Methodology onBack={() => setLocation('/')} />
          </Route>
          <Route path="/promise/:id">
            {(params) => {
               const promise = LVV_PROMISES.find(p => p.id === params.id);
               if (!promise) return <div className="text-center py-20">Premtimi nuk u gjet!</div>;
               return <PromiseDetail promise={promise} />;
            }}
          </Route>
          <Route>
            <div className="text-center py-20 font-bold text-slate-500">404 - Faqja nuk u gjet</div>
          </Route>
        </Switch>
      </div>

      <footer className="bg-white border-t border-slate-200 py-12 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
             Ndërtuar për transparencë radikale
           </p>
             <i className="fa-solid fa-envelope hover:text-amber-500 transition-colors cursor-pointer"></i>
           <p className="mt-8 text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
             Kjo platformë është e pavarur dhe ka për qëllim vizualizimin e progresit qeveritar bazuar në programin zyrtar të Lëvizjes Vetëvendosje dhe raporteve publike.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
