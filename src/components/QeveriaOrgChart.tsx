import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { PartyPromise } from '@core/types';
import { buildAllMinistryAnalytics, buildPrimeMinisterScore, PRIME_MINISTER, scoreTone } from '@country/government';
import { useT } from '@core/i18n';
import config from '@country/config.json';

interface QeveriaOrgChartProps {
  promises: PartyPromise[];
}

const QeveriaOrgChart: React.FC<QeveriaOrgChartProps> = ({ promises }) => {
  const t = useT();
  const dateLocale = config.dateLocale || config.locale || 'en-US';
  const formatNumber = useMemo(() => {
    const formatter = new Intl.NumberFormat(dateLocale);
    return (value: number) => formatter.format(value);
  }, [dateLocale]);

  const getPerformanceLabel = (score: number): string => {
    if (score >= 70) return t('government.perfHigh');
    if (score >= 45) return t('government.perfSolid');
    if (score >= 25) return t('government.perfTracking');
    return t('government.perfNeedsImprovement');
  };

  const ministryScores = useMemo(() => buildAllMinistryAnalytics(promises), [promises]);
  const rankedMinistryScores = useMemo(
    () =>
      [...ministryScores].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.avgProgress !== a.avgProgress) return b.avgProgress - a.avgProgress;
        if (b.activeCount !== a.activeCount) return b.activeCount - a.activeCount;
        return a.config.minister.localeCompare(b.config.minister, dateLocale);
      }),
    [ministryScores, dateLocale]
  );
  const primeMinisterScore = useMemo(() => buildPrimeMinisterScore(promises), [promises]);
  const activePromisesTotal = useMemo(
    () => promises.filter((promise) => promise.status === 'In Progress' || promise.progress > 0).length,
    [promises]
  );

  const topMinistry = useMemo(() => {
    if (!rankedMinistryScores.length) return null;
    return rankedMinistryScores[0];
  }, [rankedMinistryScores]);

  const lowestMinistry = useMemo(() => {
    if (!rankedMinistryScores.length) return null;
    return rankedMinistryScores[rankedMinistryScores.length - 1];
  }, [rankedMinistryScores]);

  const topPerformers = useMemo(() => rankedMinistryScores.slice(0, 3), [rankedMinistryScores]);
  const lowestPerformers = useMemo(() => rankedMinistryScores.slice(-3).reverse(), [rankedMinistryScores]);

  const countryName = config.nativeName || config.name || '';

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-16">
      <section className="relative overflow-hidden rounded-[2.2rem] border border-[#d8ccb5] bg-gradient-to-br from-[#f7f2e8] via-[#f2ebdb] to-[#ebe1cf] px-6 py-8 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <div className="absolute -left-14 top-0 h-56 w-56 rounded-full bg-[#15345b]/15 blur-3xl" />
          <div className="absolute bottom-0 right-6 h-56 w-56 rounded-full bg-[#b88835]/20 blur-3xl" />
        </div>

        <div className="relative">
          <span className="inline-flex items-center rounded-full border border-[#c9b896] bg-[#f7ecd6] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#70552a]">
            <i className="fa-solid fa-sitemap mr-2" />
            {t('government.chip', { country: countryName })}
          </span>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[#102949] sm:text-6xl md:text-7xl">
            {t('government.heading')}
          </h1>
          <p className="mt-5 max-w-4xl text-base font-semibold leading-relaxed text-[#4b5d74] md:text-lg">
            {t('government.subheading')}
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{t('government.statMinistries')}</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">{formatNumber(ministryScores.length)}</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{t('government.statGovernmentScore')}</p>
              <p className={`mt-2 text-2xl font-black ${scoreTone(primeMinisterScore)}`}>{primeMinisterScore}/100</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{t('government.statActiveCards')}</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">
                {formatNumber(activePromisesTotal)} / {formatNumber(promises.length)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2 rounded-2xl border border-[#d9ccb5] bg-[#faf4e8] px-5 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6f5828]">{t('government.comparativeEyebrow')}</p>
          <h2 className="mt-1 text-2xl font-black text-[#173453]">{t('government.rankingHeading')}</h2>
        </div>

        <article className="relative overflow-hidden rounded-3xl border border-[#cdbb96] bg-[#fbf5e8] p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#1f6f54]/10 blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7f6a3d]">
            <i className="fa-solid fa-trophy mr-2 text-[#a57a2f]" />
            {t('government.topPerformersLabel')}
          </p>
          <h3 className="mt-2 text-xl font-black text-[#193656]">{t('government.topPerformersTitle')}</h3>
          <div className="mt-4 space-y-3">
            {topPerformers.map((entry, index) => (
              <Link
                key={`top-${entry.config.id}`}
                href={`/qeveria/${entry.config.id}`}
                className="block rounded-2xl border border-[#dacdb6] bg-[#fffaf1] p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-26px_rgba(15,41,72,1)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6f5828]">#{index + 1} {entry.config.portfolio}</p>
                    <p className="truncate text-sm font-black text-[#153351]">{entry.config.minister}</p>
                  </div>
                  <p className={`text-2xl font-black ${scoreTone(entry.score)}`}>{entry.score}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e7ddcb]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(4, entry.score)}%`, background: `linear-gradient(90deg, ${entry.config.accent}, #2d8a63)` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-3xl border border-[#cfbea2] bg-[#faf2e6] p-5">
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-[#b9853a]/12 blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7f6a3d]">
            <i className="fa-solid fa-triangle-exclamation mr-2 text-[#9c6f2b]" />
            {t('government.lowPerformersLabel')}
          </p>
          <h3 className="mt-2 text-xl font-black text-[#193656]">{t('government.lowPerformersTitle')}</h3>
          <div className="mt-4 space-y-3">
            {lowestPerformers.map((entry) => (
              <Link
                key={`low-${entry.config.id}`}
                href={`/qeveria/${entry.config.id}`}
                className="block rounded-2xl border border-[#dacdb6] bg-[#fffaf1] p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-26px_rgba(15,41,72,1)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#6f5828]">{entry.config.portfolio}</p>
                    <p className="truncate text-sm font-black text-[#153351]">{entry.config.minister}</p>
                  </div>
                  <p className={`text-2xl font-black ${scoreTone(entry.score)}`}>{entry.score}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfce]">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.max(4, entry.score)}%`, background: `linear-gradient(90deg, #b78136, ${entry.config.accent})` }}
                  />
                </div>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7a6b54]">{getPerformanceLabel(entry.score)}</p>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="relative mt-10 rounded-[2rem] border border-[#d7c7a8] bg-gradient-to-b from-[#f8f2e5] to-[#f0e6d2] p-5 shadow-[0_28px_58px_-44px_rgba(16,36,64,0.95)] md:p-7">
        <div className="mx-auto max-w-xl">
          <article className="rounded-3xl border border-[#cdb790] bg-[#fcf6e9] p-6 text-center shadow-[0_20px_40px_-28px_rgba(15,41,72,0.95)]">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#5d4513]">{PRIME_MINISTER.role}</p>
            <h2 className="mt-2 text-3xl font-black text-[#1a3556]">{PRIME_MINISTER.name}</h2>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f7f93]">{t('government.pmAggregateLabel')}</p>
            <p className={`mt-1 text-4xl font-black ${scoreTone(primeMinisterScore)}`}>{primeMinisterScore}</p>
          </article>
        </div>

        <div className="mx-auto hidden h-8 w-px bg-[#ccb98f] md:block" />

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rankedMinistryScores.map((entry, index) => (
            <Link
              key={entry.config.id}
              href={`/qeveria/${entry.config.id}`}
              className="group relative block rounded-2xl border border-[#d9ccb5] bg-[#fbf7ef] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-26px_rgba(17,44,76,0.95)]"
            >
              <div className="absolute left-0 top-0 h-1.5 w-full rounded-t-2xl" style={{ background: entry.config.accent }} />
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#6f5828]">{t('government.ministryRank', { index: index + 1 })}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#6f5828]">{entry.config.portfolio}</p>
              <h3 className="mt-1 text-xl font-black leading-tight text-[#1a3556]">{entry.config.minister}</h3>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5d4f2c]">{t('government.scoreLabel')}</p>
                  <p className={`text-3xl font-black ${scoreTone(entry.score)}`}>{entry.score}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#5d4f2c]">{t('government.avgProgress')}</p>
                  <p className="text-xl font-black text-[#1a3556]">{entry.avgProgress}%</p>
                </div>
              </div>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#e9dfcc]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(4, entry.score)}%`,
                    background: `linear-gradient(90deg, ${entry.config.accent}, #b58b43)`,
                  }}
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#3f4a60]">
                <span>{t('government.linkedCards', { count: entry.linkedPromises.length })}</span>
                <span className="inline-flex items-center text-[#17385f]">
                  {t('government.viewDetails')}
                  <i className="fa-solid fa-arrow-right ml-2 text-[10px] transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {topMinistry && (
        <section className="mt-8 rounded-[1.8rem] border border-[#d7cab2] bg-[#f8f3e8] p-5 md:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{t('government.analyticalNoteLabel')}</p>
          <p className="mt-2 text-lg font-black text-[#163654]">
            {t('government.topMinistryNote', {
              portfolio: topMinistry.config.portfolio,
              minister: topMinistry.config.minister,
              score: topMinistry.score,
            })}
          </p>
          {lowestMinistry && (
            <p className="mt-2 text-base font-bold text-[#3e4f62]">
              {t('government.lowMinistryNote', {
                portfolio: lowestMinistry.config.portfolio,
                minister: lowestMinistry.config.minister,
                score: lowestMinistry.score,
              })}
            </p>
          )}
        </section>
      )}
    </main>
  );
};

export default QeveriaOrgChart;
