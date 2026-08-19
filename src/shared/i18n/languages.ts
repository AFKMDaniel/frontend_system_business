export const SUPPORTED_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['value']
