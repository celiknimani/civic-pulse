
import React from 'react';

const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="group mb-12 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-700 transition-colors"
      >
        <i className="fa-solid fa-arrow-left mr-2 group-hover:-translate-x-1 transition-transform"></i>
        Kthehu mbrapa
      </button>

      <div className="space-y-16">
        <header className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
            Transparenca & Llogaridhënia
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Si funksionon <span className="text-blue-700">ZOTIMI</span>?
          </h2>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Platforma jonë ofron një pasqyrë të paanshme të progresit të qeverisë, duke monitoruar në kohë reale përmbushjen e zotimeve zyrtare elektorale dhe qeveritare.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">
              <i className="fa-solid fa-file-shield"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Burimi i të Dhënave</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Ne bazohemi ekskluzivisht në <strong>Programin Qeverisës 2021-2025</strong> dhe <strong>Planin për 2026-2030</strong>. Nuk përdorim lajme të paverifikuara apo opinione, por vetëm dokumente zyrtare dhe vendime qeveritare.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-xl">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Monitorimi i Progresit</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Çdo zotim monitorohet periodikisht. Statusi (E Përfunduar, Në Proces, E Vonuar, etj.) përditësohet manualisht bazuar në raporte të audituara, ligje të miratuara në Kuvend dhe projekte infrastrukturore të përfunduara.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl">
              <i className="fa-solid fa-list-check"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Metodologjia e Vlerësimit</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Një zotim quhet <strong>"I Përfunduar"</strong> vetëm kur është realizuar 100%. Zotimet <strong>"Në Proces"</strong> vlerësohen në bazë të hapave konkretë (p.sh., ndarja e buxhetit, fillimi i punimeve).
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 text-xl">
               <i className="fa-solid fa-scale-balanced"></i>
            </div>
            <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Neutraliteti & Transparenca</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Platforma është plotësisht e pavarur. Ne vizualizojmë të dhënat ashtu siç janë, pa shtuar komente subjektive. Qëllimi është transparenca radikale për qytetarët.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center space-x-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">DOKUMENTET ZYRTARE</h3>
            <div className="h-px w-full bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {[
              { name: 'Programi Qeverisës 2021-2025', url: 'https://kryeministri.rks-gov.net/wp-content/uploads/2021/05/Programi-i-Qeverise-se-Republikes-se-Kosoves-2021-2025.pdf', color: 'border-blue-100', text: 'Dokument Zyrtar - PDF' },
                { name: 'Lëvizja VETËVENDOSJE!', url: 'https://www.vetevendosje.org/', color: 'border-blue-100', text: 'Faqja Zyrtare' },
            ].map(source => (
              <a 
                key={source.name}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-600/20 hover:shadow-xl transition-all duration-500 text-center space-y-3"
              >
                <div className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors uppercase tracking-widest">{source.name}</div>
                <div className="text-[9px] font-medium text-slate-400">{source.text}</div>
                <div className="pt-2 flex items-center justify-center text-amber-500">
                  <span className="text-[9px] font-black uppercase tracking-widest">Shiko Dokumentin</span>
                  <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-[8px]"></i>
                </div>
              </a>
            ))}
          </div>
        </div>

        <section className="bg-blue-700 rounded-[2.5rem] p-8 md:p-12 text-white space-y-6 shadow-2xl shadow-blue-500/20">
          <h3 className="text-2xl font-black uppercase tracking-tight">Vërejtje e rëndësishme</h3>
          <p className="text-blue-100 font-medium leading-relaxed opacity-90">
            ZOTIMI është një mjet i pavarur monitorimi. Të dhënat përditësohen vazhdimisht bazuar në zhvillimet e reja. Ju inkurajojmë të konsultoni burimet zyrtare qeveritare për detaje teknike të plota.
          </p>
          <button 
            onClick={onBack}
            className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-50 transition-all active:scale-95 shadow-lg"
          >
            Kthehu te Monitorimi
          </button>
        </section>
      </div>
    </div>
  );
};

export default Methodology;
