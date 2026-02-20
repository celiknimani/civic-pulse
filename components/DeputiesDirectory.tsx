import React, { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { PLATFORM_CATEGORIES } from '../categories';
import { getDeputyPrimaryTopic, rankDeputiesByActivity } from '../deputiesData';
import { DeputyDataset } from '../types';

interface DeputiesDirectoryProps {
  dataset: DeputyDataset;
}

const formatNumber = (value: number): string => new Intl.NumberFormat('sq-AL').format(value);

const DeputiesDirectory: React.FC<DeputiesDirectoryProps> = ({ dataset }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partyFilter, setPartyFilter] = useState('Të gjitha');
  const [categoryFilter, setCategoryFilter] = useState('Të gjitha');

  const rankedDeputies = useMemo(() => rankDeputiesByActivity(dataset.deputies), [dataset.deputies]);
  const activeRankedDeputies = useMemo(
    () => rankedDeputies.filter((deputy) => deputy.activity.speechCount > 0),
    [rankedDeputies]
  );
  const topTenDeputies = useMemo(() => activeRankedDeputies.slice(0, 10), [activeRankedDeputies]);
  const primaryTopicByDeputyId = useMemo(
    () => new Map(rankedDeputies.map((deputy) => [deputy.id, getDeputyPrimaryTopic(deputy.topics)])),
    [rankedDeputies]
  );

  const parties = useMemo(() => {
    const values = Array.from(new Set<string>(rankedDeputies.map((deputy) => deputy.party))).sort((a, b) =>
      a.localeCompare(b)
    );
    return ['Të gjitha', ...values];
  }, [rankedDeputies]);

  const filteredDeputies = useMemo(
    () =>
      rankedDeputies.filter((deputy) => {
        const primaryTopic = primaryTopicByDeputyId.get(deputy.id);
        const matchesSearch = deputy.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesParty = partyFilter === 'Të gjitha' || deputy.party === partyFilter;
        const matchesCategory = categoryFilter === 'Të gjitha' || primaryTopic?.label === categoryFilter;
        return matchesSearch && matchesParty && matchesCategory;
      }),
    [rankedDeputies, primaryTopicByDeputyId, searchTerm, partyFilter, categoryFilter]
  );

  const totalWords = useMemo(
    () => rankedDeputies.reduce((sum, deputy) => sum + deputy.activity.wordCount, 0),
    [rankedDeputies]
  );
  const totalSpeeches = useMemo(
    () => rankedDeputies.reduce((sum, deputy) => sum + deputy.activity.speechCount, 0),
    [rankedDeputies]
  );
  const topThreeTopics = useMemo(() => {
    const topicTotals = new Map<string, { label: string; mentions: number }>();
    let totalMentions = 0;

    activeRankedDeputies.forEach((deputy) => {
      deputy.topics.forEach((topic) => {
        if (topic.mentions <= 0) return;
        totalMentions += topic.mentions;
        const current = topicTotals.get(topic.topicId);
        if (current) {
          current.mentions += topic.mentions;
          return;
        }
        topicTotals.set(topic.topicId, { label: topic.label, mentions: topic.mentions });
      });
    });

    return Array.from(topicTotals.entries())
      .map(([topicId, topic]) => ({
        topicId,
        label: topic.label,
        mentions: topic.mentions,
        share: totalMentions > 0 ? (topic.mentions / totalMentions) * 100 : 0,
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 3);
  }, [activeRankedDeputies]);

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-16">
      <section className="relative mb-10 overflow-hidden rounded-[2.2rem] border border-[#d8cdb8] bg-gradient-to-br from-[#f7f2e8] via-[#f2ecdd] to-[#ece3d2] px-6 py-8 md:px-10 md:py-12">
        <div className="pointer-events-none absolute inset-0 opacity-45">
          <div className="absolute -left-16 -top-14 h-56 w-56 rounded-full bg-[#15345b]/15 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-[#b88835]/20 blur-3xl" />
        </div>

        <div className="relative space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full border border-[#c9b896] bg-[#f7ecd6] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#70552a]">
              <i className="fa-solid fa-users-line mr-2" />
              120 Deputete
            </span>
            <span
              className={`inline-flex items-center rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] ${
                dataset.source === 'transcripts'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
              }`}
            >
              {dataset.source === 'transcripts' ? 'Burimi: Transkripte Zyrtare' : 'Burimi: Dataset Seed'}
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[0.92] text-[#122d4b] sm:text-5xl md:text-6xl" style={{ fontFamily: '"Bodoni Moda", serif' }}>
            Harta e Aktivitetit të Deputetëve
          </h1>
          <p className="max-w-3xl text-base font-semibold leading-relaxed text-[#4b5d74] md:text-lg">
            Katalog i plotë i 120 deputetëve, me profil individual, temat që i trajtojnë më së shumti dhe një renditje të deputetëve më aktivë.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Totali i fjalimeve</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">{formatNumber(totalSpeeches)}</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Totali i fjalëve</p>
              <p className="mt-2 text-2xl font-black text-[#183556]">{formatNumber(totalWords)}</p>
            </div>
            <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Përditësuar</p>
              <p className="mt-2 text-sm font-black text-[#183556]">{new Date(dataset.generatedAt).toLocaleString('sq-AL')}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d7cab2] bg-[#faf6ee] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8a7550]">Top 3 temat kryesore</p>
              <span className="rounded-full border border-[#d0c0a3] bg-[#f5ecd8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#6d5427]">
                Nga deputetët aktivë
              </span>
            </div>

            {topThreeTopics.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {topThreeTopics.map((topic, index) => (
                  <article key={topic.topicId} className="rounded-xl border border-[#d9ccb5] bg-[#fdf9f1] p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8b7040]">#{index + 1}</p>
                    <p className="mt-1 text-sm font-black leading-tight text-[#1a3556]">{topic.label}</p>
                    <p className="mt-2 text-[11px] font-bold text-[#5f7088]">
                      {formatNumber(topic.mentions)} përmendje • {topic.share.toFixed(1)}%
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-[#5d6f86]">Nuk ka ende përmendje tematike në dataset-in aktual.</p>
            )}
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-[2rem] border border-[#d7c7a8] bg-gradient-to-b from-[#f8f2e5] to-[#f0e6d2] p-5 shadow-[0_28px_58px_-44px_rgba(16,36,64,0.95)] md:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8f7340]">Renditja</p>
            <h2 className="text-2xl font-black text-[#112f50]">Deputetët Më Aktivë</h2>
          </div>
          <span className="rounded-full border border-[#c9b795] bg-[#f8ecd4] px-4 py-2 text-[10px] font-black uppercase tracking-[0.17em] text-[#7b602f]">
            Aktivë: {topTenDeputies.length}
          </span>
        </div>

        {topTenDeputies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {topTenDeputies.map((deputy, index) => {
              const primaryTopic = primaryTopicByDeputyId.get(deputy.id);

              return (
                <Link
                  key={deputy.id}
                  href={`/deputet/${deputy.id}`}
                  className="group block h-full rounded-2xl border border-[#d9ccb5] bg-[#fbf7ef] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#b49560] hover:shadow-[0_18px_36px_-26px_rgba(17,44,76,0.95)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#102949] text-xs font-black text-[#f5dfb1]">
                      #{index + 1}
                    </span>
                    <span className="rounded-full border border-[#d0c1a1] bg-[#f5ebd7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#6f5528]">
                      {deputy.party}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#8d7040]">
                    {primaryTopic?.label || 'Pa përmendje tematike'}
                  </p>
                  <p className="text-lg font-black text-[#1a3556]">{deputy.name}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-[#f4eee1] p-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8d7651]">Fjalime</p>
                      <p className="mt-1 text-sm font-black text-[#1a3556]">{formatNumber(deputy.activity.speechCount)}</p>
                    </div>
                    <div className="rounded-xl bg-[#f4eee1] p-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8d7651]">Fjalë</p>
                      <p className="mt-1 text-sm font-black text-[#1a3556]">{formatNumber(deputy.activity.wordCount)}</p>
                    </div>
                    <div className="rounded-xl bg-[#f4eee1] p-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#8d7651]">Seanca</p>
                      <p className="mt-1 text-sm font-black text-[#1a3556]">{formatNumber(deputy.activity.sessionCount)}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d0bf9f] bg-[#fbf6ea] py-10 text-center">
            <p className="text-sm font-semibold text-[#627289]">Nuk ka ende deputetë aktivë në dataset-in aktual.</p>
          </div>
        )}
      </section>

      <section className="mb-6 rounded-[2rem] border border-[#d5c8b2] bg-[#f8f3ea] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div className="relative">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#8f95a0]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Kërko deputetin sipas emrit..."
              className="h-14 w-full rounded-2xl border border-[#d7cab5] bg-[#fefcf8] pl-11 pr-4 text-sm font-semibold text-[#2f3f55] outline-none transition-colors focus:border-[#9b7537]"
            />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4c6ad] bg-[#f4ecdf] p-1.5 pr-3">
            <span className="pl-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#886f46]">Kategoria</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#25384f] outline-none"
            >
              <option value="Të gjitha">Të gjitha</option>
              {PLATFORM_CATEGORIES.map((category) => (
                <option key={category.id} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-[#d4c6ad] bg-[#f4ecdf] p-1.5 pr-3">
            <span className="pl-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#886f46]">Partia</span>
            <select
              value={partyFilter}
              onChange={(event) => setPartyFilter(event.target.value)}
              className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-[#25384f] outline-none"
            >
              {parties.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {filteredDeputies.length > 0 ? (
        <section className="grid gap-4 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeputies.map((deputy, index) => {
            const primaryTopic = primaryTopicByDeputyId.get(deputy.id);

            return (
              <Link
                key={deputy.id}
                href={`/deputet/${deputy.id}`}
                className="group block h-full rounded-[1.6rem] border border-[#d8ccb6] bg-[#fbf7ef] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#b59562] hover:shadow-[0_20px_36px_-28px_rgba(15,41,72,0.95)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#8a6f3e]">#{index + 1}</span>
                  <span className="rounded-full border border-[#d1c4ac] bg-[#f5eeda] px-3 py-1 text-[10px] font-black uppercase tracking-[0.13em] text-[#6d5427]">
                    {deputy.party}
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#8d7040]">
                  {primaryTopic?.label || 'Pa përmendje tematike'}
                </p>
                <h3 className="text-lg font-black text-[#193454]">{deputy.name}</h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.13em] text-[#738196]">
                  {formatNumber(deputy.activity.speechCount)} fjalime • {formatNumber(deputy.activity.wordCount)} fjalë
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-black uppercase tracking-[0.13em] text-[#8e7446]">
                  <span>Shiko profilin</span>
                  <i className="fa-solid fa-arrow-right-long transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#d0bf9f] bg-[#fbf6ea] py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e3c8] text-[#9d8357]">
            <i className="fa-solid fa-filter-circle-xmark text-xl" />
          </div>
          <h3 className="text-lg font-black text-[#203652]">Nuk ka deputetë me këto filtra</h3>
          <p className="mt-2 text-sm font-semibold text-[#627289]">Ndrysho kriteret e kërkimit për ta parë listën e plotë.</p>
        </div>
      )}
    </main>
  );
};

export default DeputiesDirectory;
