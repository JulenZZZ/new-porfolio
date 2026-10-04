import { Lang } from '../app/models/lang';

/**
 * Development environment. Mirrors production shape; `apiBaseUrl` stays
 * empty until a backend exists (plan §20).
 */
export const environment = {
  production: false,
  siteUrl: 'https://www.jzulaika.com',
  defaultLang: 'pl' as Lang,
  apiBaseUrl: '',
};
