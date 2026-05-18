import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { PartyPromise, PromiseStatus } from '@core/types';
import { buildAllMinistryAnalytics, scoreTone } from '@country/government';
import { useT, type Translator } from '@core/i18n';
import config from '@country/config.json';

interface QeveriaMinisterDetailProps {
  ministryId: string;
  promises: PartyPromise[];
}

const buildStatusLabels = (t: Translator): Record<PromiseStatus, string> => ({
  Completed: t('statusLabel.completed'),
  'In Progress': t('statusLabel.inProgress'),
  Delayed: t('statusLabel.delayed'),
  Pending: t('statusLabel.pending'),
});

const statusClass: Record<PromiseStatus, string> = {
  Completed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'In Progress': 'text-[#1b4679] bg-[#edf3fc] border-[#d2deef]',
  Delayed: 'text-[#8a571f] bg-[#f9efe1] border-[#ecd8b7]',
  Pending: 'text-slate-700 bg-slate-100 border-slate-200',
};

const getInitials = (value: string): string =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

const getDomainLabel = (value: string): string => {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return value;
  }
};

const QeveriaMinisterDetail: React.FC<QeveriaMinisterDetailProps> = ({ ministryId, promises }) => {
  const t = useT();
  const dateLocale = config.dateLocale || config.locale || 'en-US';
  const statusLabel = useMemo(() => buildStatusLabels(t), [t]);

  const formatDate = (value?: string): string => {
    if (!value) return t('minister.noDate');
    const timestamp = Date.parse(value);
    if (Number.isNaN(timestamp)) return value;
    return new Date(timestamp).toLocaleDateString(dateLocale);
  };

  const ministry = useMemo(() => buildAllMinistryAnalytics(promises).find((entry) => entry.config.id === ministryId), [promises, ministryId]);

  if (!ministry) {
    return (
      <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-dashed border-[#d0bf9f] bg-[#fbf6ea] py-16 text-center">
          <h2 className="text-2xl font-black text-[#1f3148]">{t('minister.notFound')}</h2>
          <Link
            href="/qeveria"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#cfbea0] bg-[#f7ebd2] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#735a2e]"
          >
            <i className="fa-solid fa-arrow-left-long" />
            {t('minister.backToGovernment')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
      <div className="mb-6">
        <Link
          href="/qeveria"
          className="inline-flex items-center gap-2 rounded-full border border-[#cfbea0] bg-[#f7ebd2] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#735a2e] transition-colors hover:bg-[#f2e0bc]"
        >
          <i className="fa-solid fa-arrow-left-long" />
          {t('minister.backToGovernment')}
        </Link>
      </div>

      <section className="relative mb-8 overflow-hidden rounded-[2.2rem] border border-[#d8cab0] bg-gradient-to-br from-[#f7f1e4] via-[#f1e9d8] to-[#ebe0cb] p-7 md:p-9">
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full blur-3xl" style={{ background: `${ministry.config.accent}24` }} />
          <div className="absolute -bottom-10 right-8 h-52 w-52 rounded-full bg-[#b58539]/16 blur-3xl" />
        </div>

        <div className="relative">
          <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#765d30]">{ministry.config.portfolio}</p>
          <h1 className="mt-2 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[#102949] sm:text-6xl md:text-7xl">
            {ministry.config.minister}
          </h1>
          <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#6b7b92]">
            {t('minister.inOfficeSince', { date: formatDate(ministry.config.tookOfficeDate) })}
          </p>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#4a5f79] md:text-lg">
            {t('minister.subheading')}
          </p>

          <div className="mt-6 grid gap-4 rounded-2xl border border-[#d6c9af] bg-[#faf6ed] p-4 md:grid-cols-[132px_1fr]">
            <div className="h-32 w-32 overflow-hidden rounded-2xl border border-[#d6c9af] bg-[#f2e9d8] shadow-[0_12px_24px_-20px_rgba(18,42,72,0.95)]">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#2f4d70] to-[#6c8aa8] text-3xl font-black text-white">
                {getInitials(ministry.config.minister)}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3">
              <p className="text-sm font-semibold text-[#4a5f79]">
                {t('minister.photoNotice')}
              </p>

              <div className="flex flex-wrap gap-2">
                {ministry.config.officialWebsiteUrl && (
                  <a
                    href={ministry.config.officialWebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#c9b896] bg-[#f7ecd6] px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#70552a] transition-colors hover:bg-[#f0dfbd]"
                  >
                    <i className="fa-solid fa-globe" />
                    <span className="normal-case tracking-normal text-[#7d6843]">{getDomainLabel(ministry.config.officialWebsiteUrl)}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-[#d6c9af] bg-[#faf6ed] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('government.scoreLabel')}</p>
              <p className={`mt-2 text-3xl font-black ${scoreTone(ministry.score)}`}>{ministry.score}/100</p>
            </div>
            <div className="rounded-2xl border border-[#d6c9af] bg-[#faf6ed] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('government.avgProgress')}</p>
              <p className="mt-2 text-3xl font-black text-[#163755]">{ministry.avgProgress}%</p>
            </div>
            <div className="rounded-2xl border border-[#d6c9af] bg-[#faf6ed] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('minister.statActiveCards')}</p>
              <p className="mt-2 text-3xl font-black text-[#163755]">{ministry.activeCount}</p>
            </div>
            <div className="rounded-2xl border border-[#d6c9af] bg-[#faf6ed] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('minister.statLinkedCards')}</p>
              <p className="mt-2 text-3xl font-black text-[#163755]">{ministry.linkedPromises.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
          <h2 className="text-2xl font-black text-[#163654]">{t('minister.linkedCardsHeading')}</h2>
          <p className="mt-2 text-sm font-semibold text-[#5e6f86]">
            {t('minister.linkedCardsSubheading')}
          </p>

          <div className="mt-6 space-y-4">
            {ministry.promiseScores.map((entry) => (
              <article key={entry.promise.id} className="rounded-2xl border border-[#d8cab2] bg-[#fcf8ef] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5d4513]">{entry.promise.category}</p>
                    <h3 className="mt-1 text-lg font-black text-[#183556]">{entry.promise.title}</h3>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] ${statusClass[entry.promise.status]}`}>
                    {statusLabel[entry.promise.status]}
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <p className="text-sm font-bold text-[#5f7088]">{t('minister.progressLabel', { value: entry.promise.progress })}</p>
                  <p className={`text-lg font-black ${scoreTone(entry.score)}`}>{t('minister.pointsLabel', { value: entry.score })}</p>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e8ddc8]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(4, entry.score)}%`,
                      background: `linear-gradient(90deg, ${ministry.config.accent}, #b58b43)`,
                    }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#627289]">
                  <span>{t('minister.lastUpdateLabel', { date: formatDate(entry.lastUpdateDate) })}</span>
                  <Link href={`/promise/${entry.promise.id}`} className="text-[#1d3f6a] underline decoration-dotted underline-offset-2">
                    {t('minister.openCard')}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
            <h3 className="text-xl font-black text-[#153451]">{t('minister.statusBreakdownHeading')}</h3>
            <div className="mt-4 space-y-3">
              {(Object.keys(ministry.statusBreakdown) as PromiseStatus[]).map((status) => (
                <div key={status} className="flex items-center justify-between rounded-xl border border-[#d8cab2] bg-[#fcf8ef] px-3 py-2">
                  <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-[0.13em] ${statusClass[status]}`}>
                    {statusLabel[status]}
                  </span>
                  <span className="text-sm font-black text-[#1a3556]">{ministry.statusBreakdown[status]}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
            <h3 className="text-xl font-black text-[#153451]">{t('minister.primaryAreasHeading')}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {ministry.topCategories.map((entry) => (
                <span
                  key={`${ministry.config.id}-${entry.category}`}
                  className="rounded-full border border-[#d0c1a1] bg-[#f5ebd7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#6f5528]"
                >
                  {entry.category} ({entry.count})
                </span>
              ))}
            </div>

            <h4 className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-[#5d4513]">{t('minister.mappingHeading')}</h4>
            <p className="mt-2 text-sm font-semibold text-[#60718a]">{t('minister.mappingLine', { ids: ministry.config.promiseIds.join(', ') })}</p>
          </section>

          <section className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
            <h3 className="text-xl font-black text-[#153451]">{t('minister.recentUpdatesHeading')}</h3>
            {ministry.recentUpdates.length > 0 ? (
              <div className="mt-4 space-y-3">
                {ministry.recentUpdates.slice(0, 6).map((update, index) => (
                  <article key={`${update.promiseId}-${update.date}-${index}`} className="rounded-xl border border-[#d8cab2] bg-[#fcf8ef] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5d4513]">
                      {t('minister.updateMeta', { date: formatDate(update.date), id: update.promiseId })}
                    </p>
                    <p className="mt-1 text-sm font-black text-[#1a3556]">{update.promiseTitle}</p>
                    <p className="mt-1 text-sm font-semibold text-[#5f7088]">{update.description}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-[#60718a]">{t('minister.noUpdates')}</p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default QeveriaMinisterDetail;
