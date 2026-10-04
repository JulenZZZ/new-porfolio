import { Lang } from '../app/models/lang';

/**
 * Production environment. `apiBaseUrl` stays empty in v1 so no code can
 * accidentally call a backend that does not exist yet.
 */
export const environment = {
  production: true,
  siteUrl: 'https://www.jzulaika.com',
  defaultLang: 'pl' as Lang,
  apiBaseUrl: '',
};
