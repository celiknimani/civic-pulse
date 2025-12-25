
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { ScoreData, PartyID } from '../types';
import { PARTIES } from '../constants';

interface ScoreVisualizerProps {
  scores: ScoreData[];
}

const CustomTick = (props: any) => {
  const { x, y, payload } = props;
  const partyId = Object.keys(PARTIES).find(
    key => PARTIES[key as PartyID].name === payload.value
  ) as PartyID;
  const party = PARTIES[partyId];

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-15" y="8" width="30" height="30">
        <div className="flex flex-col items-center">
          <img 
            src={party?.logo} 
            alt={payload.value} 
            className="w-6 h-6 rounded-md shadow-sm border border-slate-100 bg-white object-contain p-0.5" 
          />
        </div>
      </foreignObject>
    </g>
  );
};

const ScoreVisualizer: React.FC<ScoreVisualizerProps> = ({ scores }) => {
  // Fix: Map ScoreData properties to displayable keys that match the Bar dataKey
  const data = scores.map(s => ({
    name: PARTIES[s.partyId as PartyID]?.name || s.partyId,
    RRITJA: s.growthAndWages,
    ENERGJIA: s.infrastructureAndEnergy,
    SOCIALE: s.socialAndFamily,
    SIGURIA: s.securityAndNATO,
  }));

  return (
    <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-200 p-4 md:p-8 lg:p-10 h-[350px] md:h-[500px] flex flex-col">
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              tick={<CustomTick />}
              axisLine={false} 
              tickLine={false}
            />
            <YAxis hide domain={[0, 10]} />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid #f1f5f9', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px'
              }}
              itemStyle={{ fontWeight: 700, fontSize: '11px', textTransform: 'uppercase' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              iconSize={8}
              wrapperStyle={{ 
                paddingBottom: '20px', 
                fontSize: '9px', 
                fontWeight: 900, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }} 
            />
            <Bar dataKey="RRITJA" name="RRITJA & PAGAT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="ENERGJIA" name="ENERGJIA & INFRA" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SOCIALE" name="SOCIALE & FAMILJA" fill="#ec4899" radius={[4, 4, 0, 0]} />
            <Bar dataKey="SIGURIA" name="SIGURIA & NATO" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScoreVisualizer;
