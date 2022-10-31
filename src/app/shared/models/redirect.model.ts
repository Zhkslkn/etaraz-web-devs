const WindowFeatures = [
  'noopener', 'noreferrer'
] as const;

export const UNSAFE_URL_PREFIX = 'unsafe:';

export type WindowFeature = string | typeof WindowFeatures[number];

export type WindowTarget = '_self' | '_blank' | '_parent' | '_top';
