
import React from 'react';

const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="group mb-12 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
      >
        <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
        Kthehu mbrapa
      </button>

      <div className="space-y-16">
        <header className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">
            Transparenca & Teknologjia
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Si funksionon <span className="text-blue-600">zotimi.com</span>?
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Platforma jonë është ndërtuar për të ofruar një pasqyrë të paanshme, teknike dhe të shpejtë të premtimeve elektorale, duke përdorur teknologjinë më të fundit të inteligjencës artificiale.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">
              <i className="fa-solid fa-file-shield"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Burimi i të Dhënave</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Ne nuk përdorim lajme, opinione apo statuse në rrjete sociale. Sistemi ynë bazohet ekskluzivisht në <strong>planprogramet politike zyrtare</strong> të partive politike për vitin 2025 (LDK, LVV, PDK, AAK-Nisma).
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
              <i className="fa-solid fa-brain-circuit"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Analiza përmes AI</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Përdorim modelin <strong>Google Gemini 3 Flash</strong>. Kur bëni një pyetje, AI skanon të gjithë tekstin e programeve (RAG - Retrieval Augmented Generation) për të gjetur pikat ku partitë përputhen ose dallojnë.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Sistemi i Pikëzimit</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Notat 0-10 nuk janë subjektive. AI vlerëson <strong>specifitetin</strong> e premtimeve. Një parti që premton "rritje të pagave" pa shifra merr notë më të ulët se një parti që premton "koeficient 150" me plan buxhetor.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 text-xl">
              <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Neutraliteti Gjenetik</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Instruksionet e sistemit tonë (System Instructions) e detyrojnë AI-n të jetë "non-partisan". Ajo nuk lejohet të favorizojë asnjë ideologji, por vetëm të nxjerrë fakte dhe shifra krahasuese.
            </p>
          </div>
        </div>

        <section className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white space-y-6 shadow-2xl shadow-blue-500/20">
          <h3 className="text-2xl font-black uppercase tracking-tight">Vërejtje e rëndësishme</h3>
          <p className="text-blue-100 font-medium leading-relaxed opacity-90">
            zotimi.com është një mjet informues dhe jo këshillues. Edhe pse AI bën punë të shkëlqyer në analizë, ne ju inkurajojmë të klikoni mbi "Burimet e Verifikuara" në çdo analizë për të lexuar tekstin origjinal të planprogrameve politike.
          </p>
          <button 
            onClick={onBack}
            className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
          >
            Filloni Krahasimin
          </button>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
