import React, { useEffect, useMemo, useState } from 'react';
import { useT } from '@core/i18n';
import methodologyData from '@country/pages/methodology.json' with { type: 'json' };

interface MethodologySource {
  name: string;
  url: string;
  type: string;
}

interface NarrativeSection {
  paragraphs: string[];
}

interface MethodologyContent {
  back: string;
  title: string;
  intro: string;
  sections: {
    mission?: string;
    editorial?: string;
    method: string;
    metrics: string;
    ai: string;
    docs: string;
    note: string;
    builtBy?: string;
  };
  mission?: NarrativeSection;
  editorial?: NarrativeSection;
  builtBy?: NarrativeSection;
  steps: Array<{ index: string; title: string; text: string }>;
  metrics: Array<{ title: string; text: string }>;
  ai: string[];
  noteBody: string;
  policySources: MethodologySource[];
  fallbackTranscriptSources: MethodologySource[];
}

const content = methodologyData as MethodologyContent;

const LINK_PATTERN = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w.-]+\.\w{2,})/g;
const TRAILING_PUNCT = /[.,;:!?]+$/;
const LINK_CLASS = 'font-semibold text-[#15345b] underline underline-offset-2 hover:text-[#b88835]';

const renderParagraph = (paragraph: string): React.ReactNode => {
  const parts = paragraph.split(LINK_PATTERN);
  return parts.map((part, index) => {
    if (/^https?:\/\//.test(part)) {
      const trailing = part.match(TRAILING_PUNCT)?.[0] ?? '';
      const url = trailing ? part.slice(0, -trailing.length) : part;
      return (
        <React.Fragment key={`${url}-${index}`}>
          <a href={url} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {url.replace(/^https?:\/\//, '')}
          </a>
          {trailing}
        </React.Fragment>
      );
    }
    if (/^[\w.+-]+@[\w.-]+\.\w{2,}$/.test(part)) {
      return (
        <a key={`${part}-${index}`} href={`mailto:${part}`} className={LINK_CLASS}>
          {part}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

const isMethodologySource = (value: unknown): value is MethodologySource => {
  if (!value || typeof value !== 'object') return false;
  const source = value as Partial<MethodologySource>;
  return !!(source.name && source.url && source.type);
};

const Methodology: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const t = useT();
  const [transcriptSources, setTranscriptSources] = useState<MethodologySource[]>(
    content.fallbackTranscriptSources,
  );

  useEffect(() => {
    let active = true;

    const loadTranscriptSources = async () => {
      try {
        const response = await fetch('/data/transcript-sources.json', { cache: 'no-store' });
        if (!response.ok) return;

        const payload = await response.json();
        const sources = Array.isArray(payload?.sources) ? payload.sources : [];
        const normalizedSources = sources
          .map((source: { name?: string; url?: string; type?: string }) => ({
            name: String(source.name || '').trim(),
            url: String(source.url || '').trim(),
            type: String(source.type || '').trim(),
          }))
          .filter(isMethodologySource);

        if (!normalizedSources.length || !active) return;
        setTranscriptSources(normalizedSources);
      } catch {
        // Keep fallback transcript sources if generated manifest is missing.
      }
    };

    loadTranscriptSources();

    return () => {
      active = false;
    };
  }, []);

  const sources = useMemo(
    () => [...transcriptSources, ...content.policySources],
    [transcriptSources],
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <button
        onClick={onBack}
        className="mb-10 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#6f5f3f]"
      >
        <i className="fa-solid fa-arrow-left" />
        {content.back}
      </button>

      <header className="pb-12 border-b border-[#d8cdb8]">
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[#102949] sm:text-6xl md:text-7xl">
          {content.title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed font-medium text-[#465772]">{content.intro}</p>
      </header>

      {content.mission && content.sections.mission ? (
        <section className="pt-14">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.mission}</h2>
          <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-6 space-y-4">
            {content.mission.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg leading-relaxed text-[#4f5f77]">
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      {content.editorial && content.sections.editorial ? (
        <section className="pt-16">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.editorial}</h2>
          <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-6 space-y-4">
            {content.editorial.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg leading-relaxed text-[#4f5f77]">
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <section className={content.mission || content.editorial ? 'pt-16' : 'pt-14'}>
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.method}</h2>

        <div className="mt-8 space-y-10">
          {content.steps.map((step) => (
            <article key={step.index} className="grid grid-cols-[auto_1fr] gap-6 border-t border-[#e1d7c4] pt-8 first:border-t-0 first:pt-0">
              <span className="text-3xl md:text-4xl font-black tracking-tight text-[#b0822e]">
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
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.metrics}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {content.metrics.map((metric) => (
            <article key={metric.title} className="rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-5">
              <h3 className="text-lg font-black text-[#1c314d]">{metric.title}</h3>
              <p className="mt-2 text-sm md:text-base leading-relaxed text-[#5b6b82]">{metric.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.ai}</h2>
        <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-6 space-y-4">
          {content.ai.map((paragraph, index) => (
            <p key={index} className={index === 0 ? 'text-base md:text-lg leading-relaxed text-[#4f5f77]' : 'text-sm md:text-base leading-relaxed text-[#5b6b82]'}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.docs}</h2>
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
                <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5d4513]">
                  {t('methodology.viewDocument')}
                  <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-16">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.note}</h2>
        <p className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-[#4f5f77]">{content.noteBody}</p>
      </section>

      {content.builtBy && content.sections.builtBy ? (
        <section className="pt-16 pb-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{content.sections.builtBy}</h2>
          <div className="mt-6 rounded-2xl border border-[#ddd2bf] bg-[#faf6ee] p-6 space-y-4">
            {content.builtBy.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg leading-relaxed text-[#4f5f77]">
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Methodology;
