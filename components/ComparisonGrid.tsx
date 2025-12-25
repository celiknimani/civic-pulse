
import React from 'react';
import { ScoreData, PartyID } from '../types';
import { PARTIES } from '../constants';

interface ComparisonGridProps {
  scores: ScoreData[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ scores }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, partyName: string) => {
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partyName)}&background=f1f5f9&color=3b82f6&bold=true&size=128&font-size=0.4`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {scores.map((score) => {
        const party = PARTIES[score.partyId as PartyID];
        if (!party) return null;

        return (
          <div 
            key={score.partyId} 
            className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col"
          >
            <div 
              className="h-2 w-full shrink-0" 
              style={{ backgroundColor: party.color }}
            />
            <div className="p-6 md:p-8 space-y-6 md:space-y-7 flex-1">
              <div className="flex items-center space-x-4 md:space-x-5">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-slate-50 p-2 flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform shrink-0">
                  <img 
                    src={party.logo} 
                    alt={party.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => handleImageError(e, party.name)}
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-slate-900 leading-none text-base md:text-lg uppercase tracking-tight truncate">
                    {party.name.split(' ').slice(-1)}
                  </h4>
                  <p className="text-[9px] md:text-[10px] text-slate-400 font-black mt-1.5 uppercase tracking-widest truncate">{party.leader}</p>
                </div>
              </div>
              
              <div className="bg-slate-50/50 rounded-2xl p-4 md:p-5 border border-slate-50 flex-1">
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium italic">
                  "{score.summary}"
                </p>
              </div>

              <div className="space-y-4 md:space-y-5 pt-2">
                <MetricBar label="Rritja & Pagat" value={score.growthAndWages} color={party.color} />
                <MetricBar label="Energjia & Infra" value={score.infrastructureAndEnergy} color={party.color} />
                <MetricBar label="Sociale & Familja" value={score.socialAndFamily} color={party.color} />
                <MetricBar label="Siguria & NATO" value={score.securityAndNATO} color={party.color} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
      <span>{label}</span>
      <span className="text-slate-900 font-black">{value}/10</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-1000 ease-out" 
        style={{ 
          width: `${(value / 10) * 100}%`,
          backgroundColor: color 
        }}
      />
    </div>
  </div>
);

export default ComparisonGrid;
