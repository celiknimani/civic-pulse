import React from 'react';
import { PartyPromise } from '@core/types';
import { useT } from '@core/i18n';

interface DashboardStatsProps {
  promises: PartyPromise[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ promises }) => {
  const t = useT();
  const total = promises.length;
  const completed = promises.filter((p) => p.status === 'Completed').length;
  const inProgress = promises.filter((p) => p.status === 'In Progress').length;
  const delayed = promises.filter((p) => p.status === 'Delayed').length;
  const averageProgress = total
    ? Math.round(promises.reduce((sum, promise) => sum + promise.progress, 0) / total)
    : 0;

  const stats = [
    {
      label: t('stats.totalPromises'),
      value: total,
      valueColor: 'text-[#122a47]',
      iconWrap: 'bg-[#e8ecf3] text-[#122a47]',
      panel: 'from-[#fcfbf8] to-[#f2eee5]',
      border: 'border-[#d8cfbe]',
      icon: 'fa-list-check',
    },
    {
      label: t('filter.statusOption.completed'),
      value: completed,
      valueColor: 'text-emerald-700',
      iconWrap: 'bg-emerald-100 text-emerald-700',
      panel: 'from-[#f4fbf7] to-[#eaf6f0]',
      border: 'border-[#cfe3d8]',
      icon: 'fa-circle-check',
    },
    {
      label: t('filter.statusOption.inProgress'),
      value: inProgress,
      valueColor: 'text-[#255fb8]',
      iconWrap: 'bg-[#dbe6f8] text-[#2e67c6]',
      panel: 'from-[#f5f8fd] to-[#ecf1f9]',
      border: 'border-[#d3dced]',
      icon: 'fa-spinner',
    },
    {
      label: t('filter.statusOption.delayed'),
      value: delayed,
      valueColor: 'text-[#b06a0e]',
      iconWrap: 'bg-[#f3e6ce] text-[#c27b16]',
      panel: 'from-[#fdfaf2] to-[#f5efdf]',
      border: 'border-[#e6d7b6]',
      icon: 'fa-triangle-exclamation',
    },
    {
      label: t('stats.avgProgress'),
      value: `${averageProgress}%`,
      valueColor: 'text-[#8b6730]',
      iconWrap: 'bg-[#f3e4c2] text-[#8b6730]',
      panel: 'from-[#fffaf0] to-[#f2e8d3]',
      border: 'border-[#dfc99e]',
      icon: 'fa-chart-simple',
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat, index) => (
        <article
          key={index}
          className={`group relative overflow-hidden rounded-[1.35rem] border ${stat.border} bg-gradient-to-b ${stat.panel} px-5 py-6 transition-all duration-300 hover:-translate-y-1`}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#b8995e]/40 via-[#d8c8a3]/60 to-[#b8995e]/40" />
          <div className={`relative mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconWrap}`}>
            <i className={`fa-solid ${stat.icon} text-lg`} />
          </div>
          <p className={`relative text-4xl leading-none font-black ${stat.valueColor}`}>{stat.value}</p>
          <p className="relative mt-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7b879a]">{stat.label}</p>
        </article>
      ))}
    </section>
  );
};

export default DashboardStats;
