
import React, { useState } from 'react';

interface AnalysisPanelProps {
  content: string;
  links?: Array<{ title: string; uri: string }>;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ content, links }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareText = `Analiza e planprogrameve politike 2025 nga zotimet.com:\n\n${content.substring(0, 200)}...`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'zotimet.com - Analiza AI 2025',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Gabim gjatë shpërndarjes:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nLexo më shumë në: ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Dështoi kopjimi:', err);
      }
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group transition-all">
      {/* Header section matching screenshot layout */}
      <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl border border-blue-100/50">
            <i className="fa-solid fa-file-invoice"></i>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Analiza e Programeve
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleShare}
            className="flex items-center space-x-2 px-5 py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 rounded-2xl border border-slate-100 transition-all active:scale-95 group/share relative"
          >
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-share-nodes'} text-sm transition-transform group-hover/share:rotate-12`}></i>
            <span className="text-[10px] font-black uppercase tracking-widest">{copied ? 'U KOPJUA' : 'SHPËRNDAJE'}</span>
            
            {copied && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold py-1.5 px-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                Kopjuar në clipboard!
              </div>
            )}
          </button>
          <div className="hidden sm:block">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100/50 uppercase tracking-widest">
              Zgjidhjet 2025
            </span>
          </div>
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-8 md:p-12 lg:p-16 space-y-12">
        <div className="prose prose-slate max-w-none text-slate-600 leading-[2] text-[15px] md:text-base whitespace-pre-wrap font-medium">
          {content}
        </div>
        
        {/* Verification sources footer inside card as seen in screenshot */}
        {links && links.length > 0 && (
          <div className="pt-10 border-t border-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center">
                BURIMET E VERIFIKUARA
              </h4>
              <div className="flex items-center space-x-2 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                <i className="fa-solid fa-shield-check text-blue-500/50"></i>
                <span>Të dhëna zyrtare partiake</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3.5 bg-blue-50/50 text-blue-700 border border-blue-100/40 rounded-2xl text-[11px] font-black hover:bg-blue-100/70 hover:scale-[1.02] active:scale-95 transition-all shadow-sm group"
                >
                  <i className="fa-solid fa-link mr-3 text-blue-400 group-hover:rotate-12 transition-transform"></i>
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;
