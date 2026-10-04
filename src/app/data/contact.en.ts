import { Contact } from '../models/contact';

/**
 * Contact data (English). Source: live site contact section
 * (julenz485@gmail.com, LinkedIn, GitHub). No public phone number exists —
 * `phone` stays absent until the owner provides one. No form in v1.
 */
export const contactEn: Contact = {
  email: 'julenz485@gmail.com',
  socials: [
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/julen-zulaika-kerexeta/',
    },
    { kind: 'github', label: 'GitHub', href: 'https://github.com/JulenZZZ' },
    { kind: 'mail', label: 'Email', href: 'mailto:julenz485@gmail.com' },
  ],
  availability: {
    pl: 'Mieszkam w Krakowie i jestem otwarty na nowe możliwości. Najszybciej skontaktujesz się ze mną mailowo.',
    en: 'Currently based in Kraków and open to new opportunities. The fastest way to reach me is by email.',
  },
  cvUrl: 'https://drive.google.com/file/d/1NzZdmY3Qb04ugsztyNyXGi2XkiHPax7l/view?usp=sharing',
};
