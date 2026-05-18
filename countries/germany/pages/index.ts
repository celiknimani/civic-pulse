import about from './about.json' with { type: 'json' };
import contact from './contact.json' with { type: 'json' };
import privacy from './privacy.json' with { type: 'json' };
import type { StaticPageContent } from '../../example/pages';

export const STATIC_PAGES: Record<string, StaticPageContent> = {
  about: about as StaticPageContent,
  contact: contact as StaticPageContent,
  privacy: privacy as StaticPageContent,
};
