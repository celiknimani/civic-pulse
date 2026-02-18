import React, { useMemo } from 'react';
import { Link } from 'wouter';
import RadarSpiderChart from './RadarSpiderChart';
import { DeputyProfile as DeputyProfileModel } from '../types';

interface DeputyProfileProps {
  deputy: DeputyProfileModel;
  rank: number;
  totalDeputies: number;
  datasetSource: 'seed' | 'transcripts';
  generatedAt: string;
}

const formatNumber = (value: number): string => new Intl.NumberFormat('sq-AL').format(value);
const DEFAULT_OFFICIAL_SOURCE = {
  id: '2026-02-12-seanca-plenare',
  title: 'Seance Plenare - 12 Shkurt 2026',
  url: 'https://www.kuvendikosoves.org/Uploads/Data/SessionFiles/2026_02_12_ts_Seanca_kumVGhWGm5.pdf',
  date: '2026-02-12',
  note: 'Deputeti eshte identifikuar/permendur ne kete transkript.',
};

const DeputyProfile: React.FC<DeputyProfileProps> = ({ deputy, rank, totalDeputies, datasetSource, generatedAt }) => {
  const sortedTopics = useMemo(() => [...deputy.topics].sort((a, b) => b.score - a.score), [deputy.topics]);
  const sources = useMemo(
    () => (deputy.sources && deputy.sources.length > 0 ? deputy.sources : [DEFAULT_OFFICIAL_SOURCE]),
    [deputy.sources]
  );
  const hasInterventions = deputy.activity.speechCount > 0;

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
      <div className="mb-6">
        <Link
          href="/deputetet"
          className="inline-flex items-center gap-2 rounded-full border border-[#cfbea0] bg-[#f7ebd2] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#735a2e] transition-colors hover:bg-[#f2e0bc]"
        >
          <i className="fa-solid fa-arrow-left-long" />
          Kthehu te Deputetet
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
              Renditja #{rank} / {totalDeputies}
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
              {datasetSource === 'transcripts' ? 'Burim Zyrtar' : 'Burim Seed'}
            </span>
          </div>

          <h1 className="text-4xl font-black text-[#122f50] sm:text-5xl md:text-6xl" style={{ fontFamily: '"Bodoni Moda", serif' }}>
            {deputy.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base font-semibold leading-relaxed text-[#4a5f79] md:text-lg">
            Profil i deputetit me shperndarjen tematike te diskutimeve parlamentare.
          </p>

          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#826a40]">
            Perditesuar me: {generatedAt ? new Date(generatedAt).toLocaleString('sq-AL') : '-'}
          </p>
        </div>
      </section>

      {!hasInterventions && (
        <section className="mb-9 rounded-2xl border border-dashed border-[#d5c7ad] bg-[#fbf6ec] px-5 py-4 text-sm font-semibold text-[#5c6f88]">
          Ne kete dataset fillestar deputeti ende nuk ka intervenim te regjistruar ne transkriptet e procesuara.
        </section>
      )}

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-2xl font-black text-[#163654]">Spiderweb i Temave Kryesore</h2>
          <RadarSpiderChart topics={deputy.topics} />
        </div>

        <div className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
          <h3 className="text-xl font-black text-[#153451]">Temat me te diskutuara</h3>
          <p className="mt-2 text-sm font-semibold text-[#5e6f86]">
            Perqindja paraqet peshen relative tematike te diskutimeve te deputetit.
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
                <p className="mt-1 text-[11px] font-bold text-[#6d7c92]">{formatNumber(topic.mentions)} permendje</p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#decfb2] pt-5">
            <h4 className="text-xs font-black uppercase tracking-[0.16em] text-[#6e5a34]">Burimi Zyrtar i te dhenave</h4>
            {sources.length > 0 ? (
              <div className="mt-3 space-y-3">
                {sources.map((source) => (
                  <article key={source.id} className="rounded-xl border border-[#dacdaf] bg-[#fcf8ef] p-3">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-extrabold text-[#18385a] underline decoration-[#b0843c] decoration-2 underline-offset-2"
                    >
                      {source.title}
                    </a>
                    {source.date ? <p className="mt-1 text-[11px] font-semibold text-[#607186]">Data: {source.date}</p> : null}
                    {source.note ? <p className="mt-1 text-[11px] font-semibold text-[#607186]">{source.note}</p> : null}
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-[#607186]">Burimi nuk eshte i disponueshem ende.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeputyProfile;
