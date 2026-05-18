import React from 'react';
import StaticPage from './StaticPage';
import { STATIC_PAGES } from '@country/pages';

interface StaticContentPageProps {
  slug: string;
}

const StaticContentPage: React.FC<StaticContentPageProps> = ({ slug }) => {
  const content = STATIC_PAGES[slug];

  if (!content) {
    return (
      <main className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-sm font-bold text-[#7e8795]">No content registered for `{slug}`.</p>
      </main>
    );
  }

  return (
    <StaticPage
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      sections={content.sections}
      note={content.note}
    />
  );
};

export default StaticContentPage;
