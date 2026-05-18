import React, { useMemo } from 'react';
import { Link } from 'wouter';
import RadarSpiderChart from './RadarSpiderChart';
import { alignDeputyTopicsToPlatformCategories } from '@country/deputies';
import { useT } from '@core/i18n';
import { DeputyProfile as DeputyProfileModel } from '@core/types';
import config from '@country/config.json';

interface DeputyProfileProps {
  deputy: DeputyProfileModel;
  rank: number;
  totalDeputies: number;
  datasetSource: 'seed' | 'transcripts';
  generatedAt: string;
}

const DeputyProfile: React.FC<DeputyProfileProps> = ({ deputy, rank, totalDeputies, datasetSource, generatedAt }) => {
  const t = useT();
  const dateLocale = config.dateLocale || config.locale || 'en-US';
  const formatNumber = useMemo(() => {
    const formatter = new Intl.NumberFormat(dateLocale);
    return (value: number) => formatter.format(value);
  }, [dateLocale]);

  const alignedTopics = useMemo(() => alignDeputyTopicsToPlatformCategories(deputy.topics), [deputy.topics]);
  const sortedTopics = useMemo(() => [...alignedTopics].sort((a, b) => b.score - a.score), [alignedTopics]);
  const activityHistory = useMemo(
    () =>
      [...deputy.activityHistory].sort((a, b) => {
        const timestampA = Date.parse(a.date || '');
        const timestampB = Date.parse(b.date || '');
        const safeA = Number.isNaN(timestampA) ? -1 : timestampA;
        const safeB = Number.isNaN(timestampB) ? -1 : timestampB;
        if (safeB !== safeA) return safeB - safeA;
        return a.reference.localeCompare(b.reference);
      }),
    [deputy.activityHistory]
  );

  const updatedLabel = useMemo(() => {
    const d = new Date(generatedAt);
    if (Number.isNaN(d.getTime())) return generatedAt;
    return d.toLocaleString(dateLocale);
  }, [generatedAt, dateLocale]);

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
      <div className="mb-6">
        <Link
          href="/deputetet"
          className="inline-flex items-center gap-2 rounded-full border border-[#cfbea0] bg-[#f7ebd2] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#735a2e] transition-colors hover:bg-[#f2e0bc]"
        >
          <i className="fa-solid fa-arrow-left-long" />
          {t('deputyProfile.backToDirectory')}
        </Link>
      </div>

      <section className="relative mb-8 overflow-hidden rounded-[2.2rem] border border-[#d8cab0] bg-gradient-to-br from-[#f7f1e4] via-[#f1e9d8] to-[#ebe0cb] p-7 md:p-9">
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#143a63]/14 blur-3xl" />
          <div className="absolute -bottom-10 right-8 h-52 w-52 rounded-full bg-[#b58539]/16 blur-3xl" />
        </div>

        <div className="relative">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#ccb991] bg-[#f6ebd2] px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#765d30]">
              {t('deputyProfile.rankBadge', { rank, total: totalDeputies })}
            </span>
            <span className="rounded-full border border-[#cfbea0] bg-[#f8efdb] px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#765d30]">
              {deputy.party}
            </span>
            <span
              className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] ${
                datasetSource === 'transcripts'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              {datasetSource === 'transcripts' ? t('deputyProfile.sourceOfficial') : t('deputyProfile.sourceSeed')}
            </span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[#102949] sm:text-6xl md:text-7xl">
            {deputy.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#4a5f79] md:text-lg">
            {t('deputyProfile.subheading')}
          </p>

          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#826a40]">
            {t('deputyProfile.updatedAt', { date: updatedLabel })}
          </p>
        </div>
      </section>

      <section className="mb-9 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('deputyProfile.statSpeeches')}</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.speechCount)}</p>
        </div>
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('deputyProfile.statWords')}</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.wordCount)}</p>
        </div>
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">{t('deputyProfile.statSessions')}</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.sessionCount)}</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-2xl font-black text-[#163654]">{t('deputyProfile.spiderHeading')}</h2>
          <RadarSpiderChart topics={alignedTopics} />
        </div>

        <div className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
          <h3 className="text-xl font-black text-[#153451]">{t('deputyProfile.topicsHeading')}</h3>
          <p className="mt-2 text-sm font-semibold text-[#5e6f86]">
            {t('deputyProfile.topicsSubheading')}
          </p>

          <div className="mt-6 space-y-4">
            {sortedTopics.map((topic) => (
              <div key={topic.topicId}>
                <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.14em] text-[#3b526c]">
                  <span>{topic.label}</span>
                  <span>{topic.score.toFixed(1)}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[#e8ddc8]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#173b66] to-[#a67a34]"
                    style={{ width: `${Math.max(3, topic.score)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] font-bold text-[#6d7c92]">{t('deputies.mentions', { count: formatNumber(topic.mentions) })}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
        <h3 className="text-xl font-black text-[#153451]">{t('deputyProfile.historyHeading')}</h3>
        <p className="mt-2 text-sm font-semibold text-[#5e6f86]">
          {t('deputyProfile.historySubheading')}
        </p>

        {activityHistory.length > 0 ? (
          <div className="mt-6 space-y-4">
            {activityHistory.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-[#d8cab2] bg-[#fcf8ef] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.16em] text-[#5d4513]">
                    {entry.date && !Number.isNaN(Date.parse(entry.date))
                      ? new Date(entry.date).toLocaleDateString(dateLocale)
                      : t('deputyProfile.noDate')}
                  </span>
                  <span className="rounded-full border border-[#d3c3a6] bg-[#f6ebd6] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#6f5528]">
                    {entry.sessionId || t('deputyProfile.sessionFallback')}
                  </span>
                </div>

                <p className="mt-2 text-sm font-semibold leading-relaxed text-[#4f6077]">{entry.excerpt}</p>

                {entry.sourceUrl && (
                  <div className="mt-3 text-[11px] font-semibold text-[#6d7b8f]">
                    <a
                      href={entry.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1c3f6a] underline decoration-dotted underline-offset-2 hover:text-[#a27734]"
                    >
                      {t('deputyProfile.openTranscript')}
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-[#d0c0a1] bg-[#fcf7ec] p-6 text-sm font-semibold text-[#6a7382]">
            {t('deputyProfile.noHistory')}
          </div>
        )}
      </section>
    </main>
  );
};

export default DeputyProfile;
