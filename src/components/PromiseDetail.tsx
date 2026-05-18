import React from 'react';
import { Link } from 'wouter';
import { CATEGORIES } from '@country/promises';
import { compareDatedEntriesNewestFirst } from '@core/promiseDates';
import { useT } from '@core/i18n';
import { PartyPromise, PromiseDeputySignal, PromiseStatus } from '@core/types';
import config from '@country/config.json';

interface PromiseDetailProps {
  promise: PartyPromise;
  topDeputies: PromiseDeputySignal[];
}

const statusBadgeClasses: Record<PromiseStatus, string> = {
  Completed: 'bg-emerald-700 text-white border-emerald-800',
  'In Progress': 'bg-[#102949] text-[#f4ddab] border-[#0b1d35]',
  Delayed: 'bg-[#8a4f1a] text-[#fff4dc] border-[#84521b]',
  Pending: 'bg-slate-600 text-white border-slate-700',
};

const statusDotClasses: Record<PromiseStatus, string> = {
  Completed: 'bg-emerald-600',
  'In Progress': 'bg-[#102949]',
  Delayed: 'bg-[#8a4f1a]',
  Pending: 'bg-slate-600',
};

const statusTextClasses: Record<PromiseStatus, string> = {
  Completed: 'text-emerald-700',
  'In Progress': 'text-[#102949]',
  Delayed: 'text-[#8a571f]',
  Pending: 'text-slate-700',
};

const statusBarClasses: Record<PromiseStatus, string> = {
  Completed: 'from-emerald-500 to-emerald-700',
  'In Progress': 'from-[#1e4b82] to-[#102949]',
  Delayed: 'from-[#d39a45] to-[#996022]',
  Pending: 'from-slate-500 to-slate-700',
};

const isValidSourceUrl = (value?: string): value is string => {
  if (!value || value.trim() === '#') return false;

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_error) {
    return false;
  }
};

export const PromiseDetail: React.FC<PromiseDetailProps> = ({ promise, topDeputies }) => {
  const t = useT();
  const dateLocale = config.dateLocale || config.locale || 'en-US';

  const statusLabels: Record<PromiseStatus, string> = {
    Completed: t('status.completed'),
    'In Progress': t('status.inProgress'),
    Delayed: t('status.delayed'),
    Pending: t('status.pending'),
  };

  const formatLongDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || t('promiseDetail.noDate');
    return new Intl.DateTimeFormat(dateLocale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  };

  const categoryInfo = CATEGORIES.find((c) => c.id === promise.category);
  const startDateLabel = formatLongDate(promise.startDate);
  const dueDateLabel = formatLongDate(promise.dueDate);
  const visibleUpdates = [...(promise.updates || [])].sort(compareDatedEntriesNewestFirst);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <Link href="/">
        <a className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d8cdb9] bg-[#f8f2e6] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#6d5c3a] transition-all hover:-translate-y-0.5 hover:bg-[#f2e7d2]">
          <i className="fa-solid fa-arrow-left" />
          {t('promiseDetail.backToList')}
        </a>
      </Link>

      <article className="overflow-hidden rounded-[2.2rem] border border-[#d8ccba] bg-gradient-to-b from-[#fffcf5] via-[#f8f3e8] to-[#f4ecdf] shadow-[0_28px_70px_-44px_rgba(12,30,54,0.8)]">
        <div className="relative border-b border-[#dfd3bf] px-7 py-8 md:px-10 md:py-10">
          <div className="pointer-events-none absolute inset-0 opacity-55">
            <div className="absolute -top-16 right-8 h-44 w-44 rounded-full bg-[#b99247]/20 blur-3xl" />
            <div className="absolute -bottom-14 left-16 h-36 w-36 rounded-full bg-[#15355a]/15 blur-3xl" />
          </div>

          <div className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className={`inline-flex rounded-full border px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.16em] ${statusBadgeClasses[promise.status]}`}>
                {statusLabels[promise.status]}
              </span>
              <span className="inline-flex items-center rounded-full border border-[#ddcfb6] bg-[#f7f1e4] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#6f7a8f]">
                <i className={`fa-solid ${categoryInfo?.icon || 'fa-folder'} mr-2`} />
                {categoryInfo?.label || promise.category}
              </span>
            </div>

            <h1 className="max-w-4xl text-3xl font-black leading-tight text-[#112c4c] md:text-5xl">{promise.title}</h1>
            <p className="mt-5 max-w-3xl text-base font-medium leading-relaxed text-[#4d5e75] md:text-lg">{promise.description}</p>
          </div>
        </div>

        <div className="px-7 py-8 md:px-10">
          <section className="rounded-3xl border border-[#ddd2bf] bg-white/80 p-6 shadow-[0_18px_40px_-30px_rgba(16,41,73,0.65)]">
            <div className="mb-3 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.16em] text-[#6b7890]">
              <span>{t('promiseDetail.realizationProgress')}</span>
              <span>{promise.progress}%</span>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-[#ebe1d0]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${statusBarClasses[promise.status]} transition-all duration-1000`}
                style={{ width: `${promise.progress}%` }}
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 text-[11px] font-bold text-[#6f7d93] sm:flex-row sm:items-center sm:justify-between">
              <span>{t('promiseDetail.monitoringStart', { date: startDateLabel })}</span>
              <span>{t('promiseDetail.dueDateLabel', { date: dueDateLabel })}</span>
            </div>
          </section>

          <section className="mt-10">
            <h3 className="mb-4 flex items-center text-xl font-black text-[#1d314a] md:text-2xl">
              <i className="fa-solid fa-users mr-3 text-[#9b7538]" />
              {t('promiseDetail.topVoicesHeading')}
            </h3>

            {topDeputies.length > 0 ? (
              <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {topDeputies.map((deputy, index) => (
                  <Link
                    key={deputy.deputyId}
                    href={`/deputet/${deputy.deputyId}`}
                    className="block rounded-2xl border border-[#ddd2bf] bg-white/85 p-4 shadow-[0_12px_30px_-28px_rgba(16,41,73,0.9)] transition-all hover:-translate-y-0.5 hover:border-[#b89a66]"
                  >
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8a7653]">#{index + 1}</p>
                    <p className="mt-1 text-sm font-black text-[#193454]">{deputy.deputyName}</p>
                    <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[#6f7a8f]">{deputy.party}</p>
                    <p className="mt-2 text-[11px] font-semibold text-[#516278]">
                      {t('promiseDetail.deputyStat', { mentions: deputy.topicMentions, speeches: deputy.speechCount })}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mb-10 rounded-2xl border border-dashed border-[#d2c4ab] bg-[#f8f1e3] px-5 py-6 text-sm italic text-[#6e7888]">
                {t('promiseDetail.noActivity')}
              </p>
            )}

            <h3 className="mb-6 flex items-center text-xl font-black text-[#1d314a] md:text-2xl">
              <i className="fa-solid fa-timeline mr-3 text-[#9b7538]" />
              {t('promiseDetail.timelineHeading')}
            </h3>

            {visibleUpdates.length > 0 ? (
              <div className="relative ml-2 space-y-6 border-l-2 border-[#d8ccb7] pl-6 py-1">
                {visibleUpdates.map((update, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-[#f6efe3] ${statusDotClasses[update.status]}`} />

                    <div className="rounded-2xl border border-[#ddd2bf] bg-white/85 p-4 shadow-[0_12px_30px_-28px_rgba(16,41,73,0.9)]">
                      <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#7b889a]">
                        {update.date} - <span className={statusTextClasses[update.status]}>{statusLabels[update.status]}</span>
                      </p>
                      <p className="text-sm font-medium leading-relaxed text-[#3f4f64]">{update.description}</p>

                      {update.source && isValidSourceUrl(update.sourceUrl) && (
                        <div className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8c7242] transition-colors hover:text-[#102949]">
                          <a href={update.sourceUrl} target="_blank" rel="noopener noreferrer">
                            <i className="fa-solid fa-link mr-1" />
                            {t('promiseDetail.sourceLabel', { source: update.source })}
                          </a>
                        </div>
                      )}

                      {update.source && !isValidSourceUrl(update.sourceUrl) && (
                        <div className="mt-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#8c7242]">
                          <i className="fa-solid fa-link mr-1" />
                          Burimi: {update.source}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[#d2c4ab] bg-[#f8f1e3] px-5 py-6 text-sm italic text-[#6e7888]">
                {t('promiseDetail.noUpdates')}
              </p>
            )}
          </section>
        </div>
      </article>
    </div>
  );
};
