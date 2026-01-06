
import React from 'react';
import { PartyPromise, PromiseStatus } from '../types';
import { Link } from 'wouter';

interface PromiseCardProps {
  promise: PartyPromise;
}

const statusColors: Record<PromiseStatus, string> = {
  'Completed': 'bg-emerald-500 text-white',
  'In Progress': 'bg-blue-500 text-white',
  'Delayed': 'bg-amber-500 text-white',
  'Pending': 'bg-slate-500 text-white',
};

const statusLabels: Record<PromiseStatus, string> = {
  'Completed': 'E Përfunduar',
  'In Progress': 'Në Proces',
  'Delayed': 'E Vonuar',
  'Pending': 'Në Pritje',
};

const PromiseCard: React.FC<PromiseCardProps> = ({ promise }) => {
  return (
    <Link href={`/promise/${promise.id}`}>
      <a className="block h-full cursor-pointer">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden h-full flex flex-col">
          <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${statusColors[promise.status]}`}>
            {statusLabels[promise.status]}
          </div>
          
          <div className="mb-4 pr-20">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{promise.category}</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight group-hover:text-blue-700 transition-colors">
              {promise.title}
            </h3>
          </div>
          
          <p className="text-sm text-slate-500 mb-6 leading-relaxed line-clamp-3 flex-1">
            {promise.description}
          </p>

          <div className="space-y-2 mt-auto">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Progresi</span>
                <span>{promise.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${promise.status === 'Completed' ? 'bg-emerald-500' : promise.status === 'Delayed' ? 'bg-amber-500' : 'bg-blue-500'}`} 
                    style={{ width: `${promise.progress}%` }}
                ></div>
            </div>
          </div>

          {promise.updates && promise.updates.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase tracking-widest flex justify-between">
                  <span>Përditësimi i fundit</span>
                  <span>{promise.updates[promise.updates.length - 1].date}</span>
                </p>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic line-clamp-2">
                    "{promise.updates[promise.updates.length - 1].description}"
                </p>
              </div>
          )}
        </div>
      </a>
    </Link>
  );
};

export default PromiseCard;
