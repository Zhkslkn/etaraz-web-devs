export const LANGUAGES = ['ru', 'kk'] as const;

export type Language = typeof LANGUAGES[number];

export type LanguageMap = {
  [language in Language]: string;
};

export type TranslationMap = {
  [language in Language]: string;
};

export interface TranslationWrapper {
  [key: string]: string | TranslationWrapper;
}

export interface TranslationPair {
  key: string;
  value: string;
}

export function castToLanguage(value: string): Language {
  const language: Language = value as Language;
  return LANGUAGES.includes(language) ? language : LANGUAGES[0];
}

export function castWrapperValueToString(wrapper: TranslationWrapper, key: string): string {
  const value: string | TranslationWrapper = wrapper[key];
  return typeof value === 'string' ? value : '';
}
