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

const DeputyProfile: React.FC<DeputyProfileProps> = ({ deputy, rank, totalDeputies, datasetSource, generatedAt }) => {
  const sortedTopics = useMemo(() => [...deputy.topics].sort((a, b) => b.score - a.score), [deputy.topics]);

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
            Profil i deputetit me shpërndarjen tematike të fjalimeve parlamentare dhe indikatorët kryesorë të aktivitetit.
          </p>

          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-[#826a40]">
            Përditësuar më: {new Date(generatedAt).toLocaleString('sq-AL')}
          </p>
        </div>
      </section>

      <section className="mb-9 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">Fjalime</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.speechCount)}</p>
        </div>
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">Fjalë të folura</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.wordCount)}</p>
        </div>
        <div className="rounded-3xl border border-[#d6c9af] bg-[#faf6ed] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#876e46]">Seanca aktive</p>
          <p className="mt-2 text-3xl font-black text-[#163755]">{formatNumber(deputy.activity.sessionCount)}</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="mb-4 text-2xl font-black text-[#163654]">Spiderweb i Temave Kryesore</h2>
          <RadarSpiderChart topics={deputy.topics} />
        </div>

        <div className="rounded-[2rem] border border-[#d7cab2] bg-[#f8f3e8] p-6">
          <h3 className="text-xl font-black text-[#153451]">Temat më të diskutuara</h3>
          <p className="mt-2 text-sm font-semibold text-[#5e6f86]">
            Përqindja paraqet peshën tematike relative të fjalimeve të deputetit.
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
                <p className="mt-1 text-[11px] font-bold text-[#6d7c92]">{formatNumber(topic.mentions)} përmendje</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DeputyProfile;
