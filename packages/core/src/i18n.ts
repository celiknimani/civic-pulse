import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react';

export type Messages = Record<string, string>;

export interface Translator {
  (key: string, vars?: Record<string, string | number>): string;
  has: (key: string) => boolean;
  locale: string;
}

const interpolate = (template: string, vars?: Record<string, string | number>): string => {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : `{${name}}`,
  );
};

export const createTranslator = (
  locale: string,
  messages: Messages,
  fallback: Messages = {},
): Translator => {
  const t = ((key: string, vars?: Record<string, string | number>) => {
    const value = messages[key] ?? fallback[key] ?? key;
    return interpolate(value, vars);
  }) as Translator;
  t.has = (key: string) => Object.prototype.hasOwnProperty.call(messages, key) || Object.prototype.hasOwnProperty.call(fallback, key);
  t.locale = locale;
  return t;
};

const I18nContext = createContext<Translator>(createTranslator('en', {}));

export interface I18nProviderProps {
  translator: Translator;
  children: ReactNode;
}

export const I18nProvider = ({ translator, children }: I18nProviderProps) =>
  createElement(I18nContext.Provider, { value: translator }, children);

export const useT = (): Translator => useContext(I18nContext);

export const useMonthNames = (): readonly string[] => {
  const t = useT();
  return useMemo(
    () => [
      t('months.january'),
      t('months.february'),
      t('months.march'),
      t('months.april'),
      t('months.may'),
      t('months.june'),
      t('months.july'),
      t('months.august'),
      t('months.september'),
      t('months.october'),
      t('months.november'),
      t('months.december'),
    ],
    [t],
  );
};
