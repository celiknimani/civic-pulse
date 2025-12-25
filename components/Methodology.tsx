
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
            Platforma jonë është ndërtuar për të ofruar një pasqyrë të paanshme, teknike dhe të shpejtë të premtimeve elektorale, duke përdorur indeksimin e detajuar të dokumenteve zyrtare.
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
              <i className="fa-solid fa-list-check"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Indeksimi Sektorial</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Çdo zotim është nxjerrë manualisht nga dokumentet PDF dhe është etiketuar me fjalë kyçe. Kur bëni një kërkim, sistemi gjen përputhshmërinë më të lartë mes kërkesës suaj dhe zotimeve zyrtare të partive.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl">
              <i className="fa-solid fa-chart-simple"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Sistemi i Pikëzimit</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Pikët (0-10) llogariten në bazë të <strong>përmbushjes së kritereve</strong> teknike dhe sasisë së zotimeve specifike. Sa më shumë detaje dhe shifra të ofrojë një parti në një kategori, aq më i lartë është pikëzimi në atë sektor.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 text-xl">
               <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Neutraliteti i Procesimit</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Algoritmi ynë i kërkimit është 100% neutral. Ai vetëm nxjerr të dhënat që ekzistojnë në dokumentet zyrtare pa shtuar asnjë interpretim apo koment subjektiv mbi vlerën e premtimeve.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">BURIMET ZYRTARE TË PROGRAMEVE</h3>
            <div className="h-px w-full bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'PDK', url: 'https://pdk.info/', color: 'border-blue-100', text: 'Partia Demokratike' },
              { name: 'LDK', url: 'https://lidhjademokratike.org/', color: 'border-blue-100', text: 'Lidhja Demokratike' },
              { name: 'Vetëvendosje!', url: 'https://www.vetevendosje.org/', color: 'border-red-100', text: 'Lëvizja Vetëvendosje' },
              { name: 'AAK', url: 'https://www.aak-ks.com/', color: 'border-slate-800', text: 'Aleanca për Ardhmërinë' }
            ].map(party => (
              <a 
                key={party.name}
                href={party.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-600/20 hover:shadow-xl transition-all duration-500 text-center space-y-3"
              >
                <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{party.name}</div>
                <div className="text-[9px] font-medium text-slate-400">{party.text}</div>
                <div className="pt-2 flex items-center justify-center text-blue-500">
                  <span className="text-[9px] font-black uppercase tracking-widest">Vizito Faqen</span>
                  <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[8px]"></i>
                </div>
              </a>
            ))}
          </div>
        </div>

        <section className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white space-y-6 shadow-2xl shadow-blue-500/20">
          <h3 className="text-2xl font-black uppercase tracking-tight">Vërejtje e rëndësishme</h3>
          <p className="text-blue-100 font-medium leading-relaxed opacity-90">
            zotimi.com është një mjet informues dhe jo këshillues. Sistemi ynë bën vetëm krahasimin teknik të të dhënave të indeksuara. Ju inkurajojmë të lexoni tekstin origjinal të planprogrameve politike për detaje shtesë.
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
