
import React from 'react';
import { ComparisonPoint, PartyID } from '../types';
import { PARTIES } from '../constants';

interface ComparisonTableProps {
  points: ComparisonPoint[];
  activePartyIds: PartyID[];
  onImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>, pid: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ points, activePartyIds, onImageError }) => {
  if (points.length === 0) return null;

  const defaultImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, pid: string) => {
    if (onImageError) {
      onImageError(e, pid);
    } else {
      const party = PARTIES[pid as PartyID];
      const partyName = party?.name || pid;
      const cleanColor = (party?.color || '#3b82f6').replace('#', '');
      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partyName)}&background=${cleanColor}&color=fff&bold=true&size=128&font-size=0.4`;
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 md:p-8 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center">
          <i className="fa-solid fa-list-check mr-3 text-blue-600 bg-blue-50 p-2 rounded-lg"></i>
          Krahasimi i Zotimeve
        </h3>
        <span className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 md:px-3 py-1 rounded-full">Të Dhëna Zyrtare</span>
      </div>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 md:p-6 text-[9px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 min-w-[140px]">Indikatori</th>
              {activePartyIds.map(pid => {
                const party = PARTIES[pid];
                return (
                  <th key={pid} className="p-4 md:p-6 text-center border-b border-slate-100 min-w-[120px] md:min-w-[160px] relative">
                    <div 
                      className="absolute top-0 left-0 right-0 h-0.5 md:h-1" 
                      style={{ backgroundColor: party?.color || '#cbd5e1' }}
                    />
                    <div className="flex flex-col items-center mt-1 md:mt-2">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl overflow-hidden shadow-sm mb-2 bg-white p-1 border border-slate-100 flex items-center justify-center">
                        <img 
                          src={party?.logo} 
                          alt={party?.name} 
                          className="w-full h-full object-contain transition-transform hover:scale-110" 
                          onError={(e) => defaultImageError(e, pid)}
                        />
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest leading-tight text-center">
                        {party?.id}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {points.map((point, idx) => (
              <tr key={idx} className="group hover:bg-blue-50/20 transition-colors">
                <td className="p-4 md:p-6 text-xs md:text-sm font-bold text-slate-700 border-b border-slate-50 group-hover:text-blue-700 transition-colors">
                  {point.category}
                </td>
                {activePartyIds.map(pid => (
                  <td key={pid} className="p-4 md:p-6 text-center border-b border-slate-50">
                    <span className="inline-block px-2 py-1 md:px-3 md:py-1.5 bg-slate-50 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold text-slate-900 border border-slate-100 group-hover:border-blue-100 group-hover:bg-white transition-all shadow-sm">
                      {point.values[pid] || '—'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden p-3 bg-slate-50 text-[9px] text-center text-slate-400 font-bold uppercase tracking-wider">
        <i className="fa-solid fa-arrows-left-right mr-1"></i> Rrëshqitni për të parë më shumë
      </div>
    </div>
  );
};

export default ComparisonTable;
