import React from 'react';
import { Link } from 'wouter';
import { PartyPromise, PromiseStatus } from '../types';

interface PromiseCardProps {
  promise: PartyPromise;
}

const statusBadgeClasses: Record<PromiseStatus, string> = {
  Completed: 'bg-emerald-600 text-white border-emerald-700',
  'In Progress': 'bg-[#102949] text-[#f4ddab] border-[#0b1d35]',
  Delayed: 'bg-[#a86b26] text-[#fff4dc] border-[#84521b]',
  Pending: 'bg-slate-600 text-white border-slate-700',
};

const statusBarClasses: Record<PromiseStatus, string> = {
  Completed: 'from-emerald-500 to-emerald-700',
  'In Progress': 'from-[#1e4b82] to-[#102949]',
  Delayed: 'from-[#d39a45] to-[#996022]',
  Pending: 'from-slate-500 to-slate-700',
};

const statusLabels: Record<PromiseStatus, string> = {
  Completed: 'E Perfunduar',
  'In Progress': 'Ne Proces',
  Delayed: 'E Vonuar',
  Pending: 'Ne Pritje',
};

const PromiseCard: React.FC<PromiseCardProps> = ({ promise }) => {
  const lastUpdate = [...(promise.updates || [])]
    .sort((a, b) => b.date.localeCompare(a.date))
    .at(0);

  return (
    <Link href={`/promise/${promise.id}`}>
      <a className="group block h-full cursor-pointer">
        <article className="relative h-full overflow-hidden rounded-[1.6rem] border border-[#d7ccba] bg-gradient-to-b from-[#fffcf4] to-[#f5efe3] p-6 shadow-[0_18px_38px_-28px_rgba(16,41,73,0.75)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-30px_rgba(16,41,73,0.85)]">
          <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-[#c59d57]/20 blur-2xl" />

          <div className="mb-5 flex items-start justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-[#dbcdb5] bg-[#f7f2e7] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7f6e4a]">
              {promise.category}
            </span>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] ${statusBadgeClasses[promise.status]}`}
            >
              {statusLabels[promise.status]}
            </span>
          </div>

          <h3 className="pr-1 text-xl font-black leading-tight text-[#122d4d] transition-colors duration-300 group-hover:text-[#8d672c]">
            {promise.title}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-[#5a6677]">{promise.description}</p>

          <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#fbf7ef] p-4">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-[#6d7890]">
              <span>Progresi</span>
              <span>{promise.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e8dfcf]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${statusBarClasses[promise.status]} transition-all duration-1000`}
                style={{ width: `${promise.progress}%` }}
              />
            </div>
          </div>

          {lastUpdate && (
            <div className="mt-5 border-t border-[#e4dbc9] pt-4">
              <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a7561]">
                <span>Perditesimi i fundit</span>
                <span>{lastUpdate.date}</span>
              </div>
              <p className="line-clamp-2 rounded-xl border border-[#dcd1be] bg-white/85 px-3 py-2 text-xs italic leading-relaxed text-[#4f5c70]">
                "{lastUpdate.description}"
              </p>
            </div>
          )}
        </article>
      </a>
    </Link>
  );
};

export default PromiseCard;
