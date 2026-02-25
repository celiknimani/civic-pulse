import React, { useMemo } from 'react';
import { Link } from 'wouter';
import { PartyPromise } from '../types';
import { buildAllMinistryAnalytics, buildPrimeMinisterScore, PRIME_MINISTER, scoreTone } from './qeveriaData';

interface QeveriaOrgChartProps {
  promises: PartyPromise[];
}

const formatNumber = (value: number): string => new Intl.NumberFormat('sq-AL').format(value);
const getPerformanceLabel = (score: number): string => {
  if (score >= 70) return 'Performancë e lartë';
  if (score >= 45) return 'Performancë solide';
  if (score >= 25) return 'Në ndjekje';
  return 'Kërkon përmirësim';
};

const QeveriaOrgChart: React.FC<QeveriaOrgChartProps> = ({ promises }) => {
  const ministryScores = useMemo(() => buildAllMinistryAnalytics(promises), [promises]);
  const rankedMinistryScores = useMemo(
    () =>
      [...ministryScores].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.avgProgress !== a.avgProgress) return b.avgProgress - a.avgProgress;
        if (b.activeCount !== a.activeCount) return b.activeCount - a.activeCount;
        return a.config.minister.localeCompare(b.config.minister, 'sq');
      }),
    [ministryScores]
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
            Qeveria e Kosovës
          </span>
          <h1 className="mt-5 text-4xl font-black leading-[0.92] text-[#122d4b] sm:text-5xl md:text-6xl" style={{ fontFamily: '"Bodoni Moda", serif' }}>
            Organogrami dhe Performanca e Ministrive
          </h1>
          <p className="mt-5 max-w-4xl text-base font-semibold leading-relaxed text-[#4b5d74] md:text-lg">
            Çdo ministër lidhet me kartat përkatëse të zotimeve për politikën që mbulon. Kliko secilin ministër për
            detajet, kartat e lidhura dhe shpërndarjen e pikëve.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Ministri të listuara</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">{formatNumber(ministryScores.length)}</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Rezultati i Qeverisë</p>
              <p className={`mt-2 text-2xl font-black ${scoreTone(primeMinisterScore)}`}>{primeMinisterScore}/100</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Kartat aktive</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">
                {formatNumber(activePromisesTotal)} / {formatNumber(promises.length)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2 rounded-2xl border border-[#d9ccb5] bg-[#faf4e8] px-5 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a7550]">Analizë Krahasuese</p>
          <h2 className="mt-1 text-2xl font-black text-[#173453]">Renditja e Performancës së Ministrive</h2>
        </div>

        <article className="relative overflow-hidden rounded-3xl border border-[#cdbb96] bg-[#fbf5e8] p-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#1f6f54]/10 blur-3xl" />
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#7f6a3d]">
            <i className="fa-solid fa-trophy mr-2 text-[#a57a2f]" />
            Më performuesit
          </p>
          <h3 className="mt-2 text-xl font-black text-[#193656]">Top 3 ministrat sipas score-it</h3>
          <div className="mt-4 space-y-3">
            {topPerformers.map((entry, index) => (
              <Link
                key={`top-${entry.config.id}`}
                href={`/qeveria/${entry.config.id}`}
                className="block rounded-2xl border border-[#dacdb6] bg-[#fffaf1] p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-26px_rgba(15,41,72,1)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7348]">#{index + 1} {entry.config.portfolio}</p>
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
            Nën performancë
          </p>
          <h3 className="mt-2 text-xl font-black text-[#193656]">3 ministritë që kërkojnë ritëm më të lartë</h3>
          <div className="mt-4 space-y-3">
            {lowestPerformers.map((entry) => (
              <Link
                key={`low-${entry.config.id}`}
                href={`/qeveria/${entry.config.id}`}
                className="block rounded-2xl border border-[#dacdb6] bg-[#fffaf1] p-3 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-26px_rgba(15,41,72,1)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7348]">{entry.config.portfolio}</p>
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
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a6f3e]">{PRIME_MINISTER.role}</p>
            <h2 className="mt-2 text-3xl font-black text-[#1a3556]">{PRIME_MINISTER.name}</h2>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f7f93]">Rezultati i Agreguar i Zotimeve</p>
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
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#8d7040]">Renditja #{index + 1}</p>
              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#8d7040]">{entry.config.portfolio}</p>
              <h3 className="mt-1 text-xl font-black leading-tight text-[#1a3556]">{entry.config.minister}</h3>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#87724d]">Score</p>
                  <p className={`text-3xl font-black ${scoreTone(entry.score)}`}>{entry.score}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#87724d]">Mes. progres</p>
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

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-[#64778f]">
                <span>{entry.linkedPromises.length} karta të lidhura</span>
                <span className="inline-flex items-center text-[#17385f]">
                  Shiko detajet
                  <i className="fa-solid fa-arrow-right ml-2 text-[10px] transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {topMinistry && (
        <section className="mt-8 rounded-[1.8rem] border border-[#d7cab2] bg-[#f8f3e8] p-5 md:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Shënim analitik</p>
          <p className="mt-2 text-lg font-black text-[#163654]">
            Ministria me rezultatin më të lartë aktual: {topMinistry.config.portfolio} ({topMinistry.config.minister}) me score {topMinistry.score}/100.
          </p>
          {lowestMinistry && (
            <p className="mt-2 text-base font-bold text-[#3e4f62]">
              Ministria me rezultatin më të ulët aktual: {lowestMinistry.config.portfolio} ({lowestMinistry.config.minister}) me score {lowestMinistry.score}/100.
            </p>
          )}
        </section>
      )}
    </main>
  );
};

export default QeveriaOrgChart;
