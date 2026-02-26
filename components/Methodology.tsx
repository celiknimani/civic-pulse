import React, { useEffect, useMemo, useState } from 'react';

const COPY = {
  back: 'Kthehu mbrapa',
  title: 'Metodologjia ',
  intro:
    'Platforma monitoron premtimet dhe aktivitetin e deputeteve me logjike te dokumentuar, burime zyrtare dhe metrika te riprodhueshme.',
  sectionMethod: 'Si funksionon sistemi',
  sectionMetrics: 'Si matet performanca e deputetit',
  sectionAi: 'Roli i GPT-Codex-5.3',
  sectionDocs: 'Dokumentet Zyrtare',
  sectionNote: 'V\u00ebrejtje e R\u00ebnd\u00ebsishme',
  sourceLine:
    'Premtimet merren nga dokumente zyrtare politike/qeveritare, ndersa aktiviteti i deputeteve merret nga transkriptet zyrtare te Kuvendit (PDF).',
  progressLine:
    'Transkriptet strukturohen ne format te lexueshem nga sistemi (speaker, text, sessionId, date, source) dhe lidhen me listen e deputeteve permes emrit te normalizuar.',
  evaluationLine:
    'Per secilin deputet llogariten automatikisht: fjalime, fjale, seanca dhe permendje tematike (taxonomy me 8 tema). Spider map paraqet peshen relative te temave.',
  neutralityLine:
    'Cdo premtim lidhet me nje teme kryesore. Ne detail view shfaqen Top 3 deputetet per ate teme sipas: mentions > score > speechCount > wordCount.',
  gptLine:
    'GPT-Codex-5.3 perdoret si shtrese inxhinierike per ndertimin/rifreskimin e pipeline-it, rregullave dhe validimeve. Nuk perdoret per te shpikur fakte apo per te zevendesuar burimin zyrtar.',
  gptLine2:
    'Rezultatet numerike dalin nga skriptet deterministe mbi transkriptet dhe dataset-et lokale; cdo profil deputeti ruan edhe burimin zyrtar te transkriptit.',
  note:
    'ZOTIMI \u00ebsht\u00eb mjet i pavarur monitorimi. T\u00eb dh\u00ebnat rifreskohen sipas evidenc\u00ebs s\u00eb re zyrtare p\u00ebr sakt\u00ebsi dhe transparenc\u00eb maksimale.',
};

type MethodologySource = {
  name: string;
  url: string;
  type: string;
};

const isMethodologySource = (value: unknown): value is MethodologySource => {
  if (!value || typeof value !== 'object') return false;
  const source = value as Partial<MethodologySource>;
  return !!(source.name && source.url && source.type);
};

const FALLBACK_TRANSCRIPT_SOURCES: MethodologySource[] = [
  {
    name: 'Transkripti zyrtar i seances plenare (12 Shkurt 2026)',
    url: 'https://www.kuvendikosoves.org/Uploads/Data/SessionFiles/2026_02_12_ts_Seanca_kumVGhWGm5.pdf',
    type: 'Kuvendi i Kosoves - PDF zyrtar',
  },
];

const POLICY_SOURCES: MethodologySource[] = [
  {
    name: 'L\u00ebvizja VET\u00cbVENDOSJE!',
    url: 'https://www.vetevendosje.org/zotimet-siguri-dhe-begati.pdf',
    type: 'Dokument zyrtar - PDF',
  },
];

const STEPS = [
  {
    index: '01',
    title: 'Burimi i t\u00eb Dh\u00ebnave',
    text: COPY.sourceLine,
  },
  {
    index: '02',
    title: 'Monitorimi i Progresit',
    text: COPY.progressLine,
  },
  {
    index: '03',
    title: 'Metodologjia e Vler\u00ebsimit',
    text: COPY.evaluationLine,
  },
  {
    index: '04',
    title: 'Lidhja me premtimet dhe renditja Top 3',
    text: COPY.neutralityLine,
  },
];

const METRICS = [
  {
    title: 'Fjalime',
    text: 'Numeri i nderhyrjeve ku deputeti shfaqet si speaker ne transkript.',
  },
  {
    title: 'Fjale te folura',
    text: 'Shuma e fjaleve ne te gjitha nderhyrjet e deputetit (pas normalizimit te tekstit).',
  },
  {
    title: 'Seanca',
    text: 'Numri i seancave unike ku deputeti ka te pakten nje nderhyrje.',
  },
  {
    title: 'Tema me te diskutuara (Spider Map)',
    text: 'Per cdo teme numrohen permendjet nga fjalet kyce; score (%) = permendjet e temes / permendjet totale * 100.',
  },
];

const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [transcriptSources, setTranscriptSources] = useState<MethodologySource[]>(FALLBACK_TRANSCRIPT_SOURCES);

  useEffect(() => {
    let active = true;

    const loadTranscriptSources = async () => {
      try {
        const response = await fetch('/data/transcript-sources.json', { cache: 'no-store' });
        if (!response.ok) return;

        const payload = await response.json();
        const sources = Array.isArray(payload?.sources) ? payload.sources : [];
        const normalizedSources = sources
          .map((source) => ({
            name: String(source.name || '').trim(),
            url: String(source.url || '').trim(),
            type: String(source.type || '').trim(),
          }))
          .filter(isMethodologySource);

        if (!normalizedSources.length || !active) return;
        setTranscriptSources(normalizedSources);
      } catch {
        // Keep fallback transcript source if generated manifest is missing.
      }
    };

    loadTranscriptSources();

    return () => {
      active = false;
    };
  }, []);

  const sources = useMemo(() => [...transcriptSources, ...POLICY_SOURCES], [transcriptSources]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <button
        onClick={onBack}
        className="mb-10 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6f5f3f]"
      >
        <i className="fa-solid fa-arrow-left" />
        {COPY.back}
      </button>

      <header className="pb-12 border-b border-[#d8cdb8]">
        <h1
          className="mt-4 text-5xl sm:text-6xl md:text-7xl font-black leading-[0.92] text-[#102949]"
          style={{ fontFamily: '"Bodoni Moda", serif' }}
        >
          {COPY.title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed font-medium text-[#465772]">{COPY.intro}</p>
      </header>

      <section className="pt-14">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionMethod}</h2>

        <div className="mt-8 space-y-10">
          {STEPS.map((step) => (
            <article key={step.index} className="grid grid-cols-[auto_1fr] gap-6 border-t border-[#e1d7c4] pt-8 first:border-t-0 first:pt-0">
              <span className="text-3xl md:text-4xl font-black text-[#b0822e]" style={{ fontFamily: '"Bodoni Moda", serif' }}>
                {step.index}
              </span>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#1c314d]">{step.title}</h3>
                <p className="mt-3 text-base md:text-lg leading-relaxed text-[#5b6b82]">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionMetrics}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {METRICS.map((metric) => (
            <article key={metric.title} className="rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-5">
              <h3 className="text-lg font-black text-[#1c314d]">{metric.title}</h3>
              <p className="mt-2 text-sm md:text-base leading-relaxed text-[#5b6b82]">{metric.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionAi}</h2>
        <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-6">
          <p className="text-base md:text-lg leading-relaxed text-[#4f5f77]">{COPY.gptLine}</p>
          <p className="mt-4 text-sm md:text-base leading-relaxed text-[#5b6b82]">{COPY.gptLine2}</p>
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionDocs}</h2>
        <ul className="mt-6 divide-y divide-[#e1d7c4] border-y border-[#e1d7c4]">
          {sources.map((source) => (
            <li key={source.url} className="py-5">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-6"
              >
                <span>
                  <span className="block text-lg md:text-xl font-black text-[#1f3148]">{source.name}</span>
                  <span className="block mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7b8798]">{source.type}</span>
                </span>
                <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#8b6b34]">
                  Shiko dokumentin
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-16 pb-2">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionNote}</h2>
        <p className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-[#4f5f77]">{COPY.note}</p>
      </section>
    </div>
  );
};

export default Methodology;
