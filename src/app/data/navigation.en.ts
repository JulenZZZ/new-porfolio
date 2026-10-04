import { Navigation } from '../models/navigation';

/**
 * Site navigation (English). Mirrors the live-site links (Home, About,
 * Skills, Portfolio, Contact); Skills targets the Home skills section since
 * v1 has no dedicated Skills page. Paths follow the `/pl` + `/en` strategy.
 */
export const navigationEn: Navigation = {
  items: [
    { key: 'home', label: { pl: 'Strona główna', en: 'Home' }, path: { pl: '/pl', en: '/en' } },
    {
      key: 'about',
      label: { pl: 'O mnie', en: 'About' },
      path: { pl: '/pl/o-mnie', en: '/en/about' },
    },
    {
      key: 'skills',
      label: { pl: 'Umiejętności', en: 'Skills' },
      path: { pl: '/pl', en: '/en' },
      fragment: 'skills',
    },
    {
      key: 'portfolio',
      label: { pl: 'Portfolio', en: 'Portfolio' },
      path: { pl: '/pl/portfolio', en: '/en/portfolio' },
    },
    {
      key: 'contact',
      label: { pl: 'Kontakt', en: 'Contact' },
      path: { pl: '/pl/kontakt', en: '/en/contact' },
    },
  ],
};
