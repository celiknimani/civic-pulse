
import React from 'react';
import { PartyPromise } from '../types';

interface DashboardStatsProps {
  promises: PartyPromise[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ promises }) => {
  const total = promises.length;
  const completed = promises.filter(p => p.status === 'Completed').length;
  const inProgress = promises.filter(p => p.status === 'In Progress').length;
  const delayed = promises.filter(p => p.status === 'Delayed').length; // Includes 'Delayed'
  
  const stats = [
    { label: 'Total Zotime', value: total, color: 'text-slate-900', bg: 'bg-white', icon: 'fa-list-check' },
    { label: 'Të Përfunduara', value: completed, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: 'fa-check-circle' },
    { label: 'Në Proces', value: inProgress, color: 'text-blue-500', bg: 'bg-blue-50', icon: 'fa-spinner' },
    { label: 'Të Vonuara', value: delayed, color: 'text-amber-500', bg: 'bg-amber-50', icon: 'fa-triangle-exclamation' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bg} p-6 rounded-2xl border border-slate-100/50 shadow-sm flex flex-col items-center justify-center text-center space-y-2`}>
           <div className={`w-10 h-10 rounded-full ${stat.bg} brightness-95 flex items-center justify-center mb-1`}>
                <i className={`fa-solid ${stat.icon} ${stat.color} text-xl`}></i>
           </div>
           <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
           <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
