import React from 'react';
import { PartyPromise } from '../types';

interface DashboardStatsProps {
  promises: PartyPromise[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ promises }) => {
  const total = promises.length;
  const completed = promises.filter((p) => p.status === 'Completed').length;
  const inProgress = promises.filter((p) => p.status === 'In Progress').length;
  const delayed = promises.filter((p) => p.status === 'Delayed').length;

  const stats = [
    {
      label: 'Total Zotime',
      value: total,
      valueColor: 'text-[#122a47]',
      iconWrap: 'bg-[#e8ecf3] text-[#122a47]',
      panel: 'from-[#fcfbf8] to-[#f2eee5]',
      border: 'border-[#d8cfbe]',
      icon: 'fa-list-check',
    },
    {
      label: 'T\u00eb P\u00ebrfunduara',
      value: completed,
      valueColor: 'text-emerald-700',
      iconWrap: 'bg-emerald-100 text-emerald-700',
      panel: 'from-[#f4fbf7] to-[#eaf6f0]',
      border: 'border-[#cfe3d8]',
      icon: 'fa-circle-check',
    },
    {
      label: 'N\u00eb Proces',
      value: inProgress,
      valueColor: 'text-[#255fb8]',
      iconWrap: 'bg-[#dbe6f8] text-[#2e67c6]',
      panel: 'from-[#f5f8fd] to-[#ecf1f9]',
      border: 'border-[#d3dced]',
      icon: 'fa-spinner',
    },
    {
      label: 'T\u00eb Vonuara',
      value: delayed,
      valueColor: 'text-[#b06a0e]',
      iconWrap: 'bg-[#f3e6ce] text-[#c27b16]',
      panel: 'from-[#fdfaf2] to-[#f5efdf]',
      border: 'border-[#e6d7b6]',
      icon: 'fa-triangle-exclamation',
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <article
          key={index}
          className={`relative overflow-hidden rounded-3xl border ${stat.border} bg-gradient-to-b ${stat.panel} px-6 py-7 shadow-[0_18px_45px_-34px_rgba(15,35,64,0.65)]`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#b8995e]/40 via-[#d8c8a3]/60 to-[#b8995e]/40" />
          <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full ${stat.iconWrap}`}>
            <i className={`fa-solid ${stat.icon} text-lg`} />
          </div>
          <p className={`text-5xl leading-none font-black ${stat.valueColor}`}>{stat.value}</p>
          <p className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7b879a]">{stat.label}</p>
        </article>
      ))}
    </section>
  );
};

export default DashboardStats;