import React from 'react';

const COPY = {
  back: 'Kthehu mbrapa',
  eyebrow: 'Transparenc\u00eb dhe llogaridh\u00ebnie',
  title: 'Si Funksionon Metodologjia ZOTIMI',
  intro:
    'Platforma ofron monitorim t\u00eb paansh\u00ebm t\u00eb premtimeve qeveritare, me kritere t\u00eb qarta dhe burime t\u00eb verifikueshme.',
  sectionMethod: 'Metodologjia',
  sectionDocs: 'Dokumentet Zyrtare',
  sectionNote: 'V\u00ebrejtje e R\u00ebnd\u00ebsishme',
  sourceLine:
    'Ne bazohemi ekskluzivisht n\u00eb Programin Qeveris\u00ebs 2021-2025 dhe planin p\u00ebr 2026-2030, pa lajme t\u00eb paverifikuara dhe pa opinione.',
  progressLine:
    '\u00c7do zotim monitorohet periodikisht dhe statusi p\u00ebrdit\u00ebsohet vet\u00ebm mbi baz\u00eb raportesh zyrtare dhe zhvillimesh t\u00eb dokumentuara.',
  evaluationLine:
    'Nj\u00eb zotim konsiderohet i p\u00ebrfunduar vet\u00ebm me realizim t\u00eb plot\u00eb. Deri at\u00ebher\u00eb vler\u00ebsohet sipas hapave konkrete t\u00eb implementimit.',
  neutralityLine:
    'Platforma mbetet neutrale dhe paraqet faktet ashtu si jan\u00eb, pa interpretim subjektiv.',
  note:
    'ZOTIMI \u00ebsht\u00eb mjet i pavarur monitorimi. T\u00eb dh\u00ebnat rifreskohen sipas evidenc\u00ebs s\u00eb re zyrtare p\u00ebr sakt\u00ebsi dhe transparenc\u00eb maksimale.',
  backToMonitoring: 'Kthehu te monitorimi',
};

const SOURCES = [
  {
    name: 'Programi Qeveris\u00ebs 2021-2025',
    url: 'https://kryeministri.rks-gov.net/wp-content/uploads/2021/05/Programi-i-Qeverise-se-Republikes-se-Kosoves-2021-2025.pdf',
    type: 'Dokument zyrtar - PDF',
  },
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
    title: 'Neutraliteti dhe Transparenca',
    text: COPY.neutralityLine,
  },
];

const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.eyebrow}</p>
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
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8a7345]">{COPY.sectionDocs}</h2>
        <ul className="mt-6 divide-y divide-[#e1d7c4] border-y border-[#e1d7c4]">
          {SOURCES.map((source) => (
            <li key={source.name} className="py-5">
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
        <button
          onClick={onBack}
          className="mt-8 inline-flex rounded-full border border-[#cdbd9a] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#735f38]"
        >
          {COPY.backToMonitoring}
        </button>
      </section>
    </div>
  );
};

export default Methodology;