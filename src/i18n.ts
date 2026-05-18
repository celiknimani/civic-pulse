import config from '@country/config.json';
import { createTranslator, type Messages, type Translator } from '@core/i18n';

const localeModules = import.meta.glob<{ default: Messages }>('../locales/*.json', { eager: true });

const loadMessages = (locale: string): Messages => {
  const key = `../locales/${locale}.json`;
  return localeModules[key]?.default ?? {};
};

const requestedLocale = (config.locale || 'en').toLowerCase();
const fallbackMessages = loadMessages('en');
const activeMessages = loadMessages(requestedLocale);

export const translator: Translator = createTranslator(requestedLocale, activeMessages, fallbackMessages);
export const activeLocale = requestedLocale;
