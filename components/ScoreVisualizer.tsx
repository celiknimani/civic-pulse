
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import { ScoreData, PartyID } from '../types';
import { PARTIES } from '../constants';

interface ScoreVisualizerProps {
  scores: ScoreData[];
}

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({ scores }) => {
  const data = scores.map(s => ({
    name: s.partyId,
    RRITJA: s.growthAndWages,
    ENERGJIA: s.infrastructureAndEnergy,
    SOCIALE: s.socialAndFamily,
    SIGURIA: s.securityAndNATO,
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }}
          />
          <YAxis 
            domain={[0, 10]} 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 9, fontWeight: 900, fill: '#cbd5e1' }}
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              padding: '10px'
            }}
            itemStyle={{ fontWeight: 800, fontSize: '9px', textTransform: 'uppercase' }}
          />
          <Bar dataKey="RRITJA" name="EKONOMIA" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          <Bar dataKey="ENERGJIA" name="ENERGJIA" fill="#10b981" radius={[2, 2, 0, 0]} />
          <Bar dataKey="SOCIALE" name="SOCIALE" fill="#ec4899" radius={[2, 2, 0, 0]} />
          <Bar dataKey="SIGURIA" name="SIGURIA" fill="#6366f1" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreVisualizer;
