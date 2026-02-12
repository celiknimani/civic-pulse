
import React from 'react';
import { PartyPromise, PromiseStatus } from '../types';
import { Link } from 'wouter';
import { CATEGORIES } from '../data';

interface PromiseDetailProps {
  promise: PartyPromise;
}

const statusColors: Record<PromiseStatus, string> = {
  'Completed': 'bg-emerald-500',
  'In Progress': 'bg-blue-500',
  'Delayed': 'bg-amber-500',
  'Pending': 'bg-slate-500',
};

const statusLabels: Record<PromiseStatus, string> = {
  'Completed': 'E Përfunduar',
  'In Progress': 'Në Proces',
  'Delayed': 'E Vonuar',
  'Pending': 'Në Pritje',
};

export const PromiseDetail: React.FC<PromiseDetailProps> = ({ promise }) => {
  const categoryInfo = CATEGORIES.find(c => c.id === promise.category);
  
  return (
    <div className="">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/">
           <a className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors mb-6 text-xs font-black uppercase tracking-widest cursor-pointer">
             <i className="fa-solid fa-arrow-left mr-2"></i>
             Kthehu tek Lista
           </a>
        </Link>
        
        <div className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200">
           <div className="flex items-center gap-4 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest ${statusColors[promise.status]}`}>
                 {statusLabels[promise.status]}
              </span>
              <span className="text-slate-400 text-xs font-black uppercase tracking-widest flex items-center">
                 <i className={`fa-solid ${categoryInfo?.icon || 'fa-folder'} mr-2`}></i>
                 {promise.category}
              </span>
           </div>
           
           <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
             {promise.title}
           </h1>
           
           <p className="text-lg text-slate-600 leading-relaxed mb-10">
             {promise.description}
           </p>

           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-12">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                 <span>Progresi i Realizimit</span>
                 <span>{promise.progress}%</span>
              </div>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                    className={`h-full rounded-full transition-all duration-1000 ${statusColors[promise.status]}`}
                    style={{ width: `${promise.progress}%` }}
                 ></div>
              </div>
              <div className="mt-4 flex justify-between text-[11px] text-slate-400 font-bold">
                 <span>Fillimi: {promise.startDate}</span>
                 <span>Afati: {promise.dueDate}</span>
              </div>
           </div>

           <div className="space-y-8">
             <h3 className="text-xl font-black text-slate-900 flex items-center">
                <i className="fa-solid fa-timeline mr-3 text-amber-500"></i>
                Historiku i Zhvillimeve
             </h3>
             <div className="relative border-l-2 border-slate-200 ml-3 space-y-10 pl-8 py-2">
                {[...(promise.updates || [])].reverse().map((update, idx) => (
                   <div key={idx} className="relative group">
                      <div className={`absolute -left-[39px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${statusColors[update.status]}`}></div>
                      <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                         {update.date} • <span className={`${statusColors[update.status].replace('bg-', 'text-')}`}>{statusLabels[update.status]}</span>
                      </div>
                      <p className="text-slate-700 font-medium bg-white p-4 rounded-xl border border-slate-200 shadow-sm inline-block">
                         {update.description}
                      </p>
                      {update.source && (
                        <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors">
                           <a href={update.sourceUrl || '#'} target="_blank" rel="noopener noreferrer">
                              <i className="fa-solid fa-link mr-1"></i>
                              Burimi: {update.source}
                           </a>
                        </div>
                      )}
                   </div>
                ))}
                {(!promise.updates || promise.updates.length === 0) && (
                   <p className="text-slate-400 italic">Nuk ka përditësime të regjistruara.</p>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
