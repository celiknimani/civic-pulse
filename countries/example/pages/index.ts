import contact from './contact.json' with { type: 'json' };
import privacy from './privacy.json' with { type: 'json' };

export interface StaticPageContent {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; paragraphs: string[] }>;
  note?: string;
}

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  contact: contact as StaticPageContent,
  privacy: privacy as StaticPageContent,
};
