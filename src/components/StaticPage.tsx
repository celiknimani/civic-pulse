import React from 'react';
import { useT } from '@core/i18n';

type StaticSection = {
  title: string;
  paragraphs: string[];
};

interface StaticPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  sections: StaticSection[];
  note?: string;
}

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

const StaticPage: React.FC<StaticPageProps> = ({ eyebrow, title, intro, sections, note }) => {
  const t = useT();
  return (
    <main className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <header className="pb-12 border-b border-[#d8cdb8]">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.9] tracking-tight text-[#102949] sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl leading-relaxed font-medium text-[#465772]">{intro}</p>
      </header>

      {sections.map((section, index) => (
        <section key={section.title} className={index === 0 ? 'pt-14' : 'pt-16'}>
          <h2 className="text-2xl md:text-3xl font-black text-[#1c314d]">{section.title}</h2>
          <div className="mt-4 max-w-4xl space-y-4">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base md:text-lg leading-relaxed text-[#4f5f77]">
                {renderParagraph(paragraph)}
              </p>
            ))}
          </div>
        </section>
      ))}

      {note ? (
        <section className="pt-16 pb-2">
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#6f5828]">{t('staticPage.importantNote')}</h2>
          <p className="mt-4 max-w-4xl text-base md:text-lg leading-relaxed text-[#4f5f77]">{note}</p>
        </section>
      ) : null}
    </main>
  );
};

export default StaticPage;
