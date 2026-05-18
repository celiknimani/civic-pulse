import React from 'react';
import { Link } from 'wouter';
import { getLatestPromiseUpdate } from '@core/promiseDates';
import { useT } from '@core/i18n';
import { PartyPromise, PromiseStatus } from '@core/types';
import config from '@country/config.json';

interface PromiseCardProps {
  promise: PartyPromise;
  onClick?: () => void;
}

const statusBadgeClasses: Record<PromiseStatus, string> = {
  Completed: 'bg-emerald-700 text-white border-emerald-800',
  'In Progress': 'bg-[#102949] text-[#f4ddab] border-[#0b1d35]',
  Delayed: 'bg-[#8a4f1a] text-[#fff4dc] border-[#84521b]',
  Pending: 'bg-slate-600 text-white border-slate-700',
};

const statusBarClasses: Record<PromiseStatus, string> = {
  Completed: 'from-emerald-500 to-emerald-700',
  'In Progress': 'from-[#1e4b82] to-[#102949]',
  Delayed: 'from-[#d39a45] to-[#996022]',
  Pending: 'from-slate-500 to-slate-700',
};

const PromiseCard: React.FC<PromiseCardProps> = ({ promise, onClick }) => {
  const t = useT();
  const dateLocale = config.dateLocale || config.locale || 'en-US';

  const statusLabels: Record<PromiseStatus, string> = {
    Completed: t('status.completed'),
    'In Progress': t('status.inProgress'),
    Delayed: t('status.delayed'),
    Pending: t('status.pending'),
  };

  const formatShortDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat(dateLocale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  };

  const lastUpdate = getLatestPromiseUpdate(promise);
  const lastUpdatePreview =
    lastUpdate?.description && lastUpdate.description.length > 100
      ? `${lastUpdate.description.slice(0, 100).trim()}...`
      : lastUpdate?.description;

  const promiseTermSingular = config.uiTerms?.promiseLabel || t('promiseCard.viewDetails').split(' ').pop() || 'Promise';

  return (
    <Link href={`/promise/${promise.id}`}>
      <a className="group block h-full cursor-pointer" onClick={onClick}>
        <article className="relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#d7ccba] bg-[#fffaf1] shadow-[0_18px_38px_-30px_rgba(16,41,73,0.8)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#b99a62] hover:shadow-[0_30px_62px_-34px_rgba(16,41,73,0.92)]">
          <div className="relative border-b border-[#e4dac8] bg-gradient-to-r from-[#fbf5e8] to-[#fffaf2] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{promiseTermSingular} #{promise.id}</span>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] ${statusBadgeClasses[promise.status]}`}
              >
                {statusLabels[promise.status]}
              </span>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-[#dbcdb5] bg-[#f7f2e7] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5d4e2c]">
              {promise.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#ddd2bf] bg-white/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#68758a]">
              <i className="fa-regular fa-calendar text-[9px]" />
              {formatShortDate(promise.dueDate)}
            </span>
          </div>

          <h3 className="pr-1 text-xl font-black leading-tight text-[#122d4d] transition-colors duration-300 group-hover:text-[#8d672c]">
            {promise.title}
          </h3>

          <p className="mt-4 line-clamp-3 text-sm font-medium leading-relaxed text-[#5a6677]">{promise.description}</p>

          <div className="mt-6 rounded-[1rem] border border-[#ddd2bf] bg-[#fbf7ef] p-4">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-[#4d586c]">
              <span>{t('promiseCard.progressLabel')}</span>
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
              <div className="mb-2 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#5d4e2c]">
                <span>{t('promiseCard.lastUpdate')}</span>
                <span>{lastUpdate.date}</span>
              </div>
              <p className="line-clamp-2 rounded-xl border border-[#dcd1be] bg-white/85 px-3 py-2 text-xs italic leading-relaxed text-[#4f5c70]">
                {lastUpdatePreview}
              </p>
            </div>
          )}

          <div className="mt-auto pt-5">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#8b6730] transition-colors group-hover:text-[#102949]">
              {t('promiseCard.viewDetails')}
              <i className="fa-solid fa-arrow-right-long transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
          </div>
        </article>
      </a>
    </Link>
  );
};

export default PromiseCard;
