import { Profile } from '../models/profile';
import { profileEn } from './profile.en';

/**
 * Owner profile (Polish). Professional translation of the English source;
 * no Polish original exists on the live site. FLAGGED FOR OWNER REVIEW.
 */
export const profilePl: Profile = {
  ...profileEn,
  role: {
    pl: 'Programista full-stack',
    en: 'Full Stack Developer',
  },
  location: 'Kraków, Polska',
  bio: {
    pl: 'Urodziłem się i wychowałem w Hiszpanii, gdzie zdecydowałem się studiować programowanie. Ukończyłem dwa oficjalne dyplomy technika: tworzenie aplikacji internetowych oraz tworzenie aplikacji wieloplatformowych. Już w trakcie nauki pracowałem jako programista webowy w niepełnym wymiarze godzin.\n\nOd zawsze pasjonuję się technologią i nieustannie szukam nowych wyzwań oraz możliwości nauki i rozwoju. Po stażu przeniosłem się do Krakowa, gdzie pracowałem jako programista. Obecnie na stałe mieszkam w Polsce i szukam nowych możliwości rozwoju umiejętności programistycznych. Zapraszam do zapoznania się z moim portfolio oraz do kontaktu w razie pytań lub propozycji współpracy.',
    en: 'Born and raised in Spain, I chose to study software development and graduated with two official diplomas: Superior Technician in Web Application Development and Superior Technician in Multiplatform Application Development. While studying, I worked as a part-time web developer.\n\nI have always been passionate about technology and I am always looking for new challenges and opportunities to learn and grow. After an internship I moved to Krakow, Poland, where I worked as a developer. Now fully established in Poland, I am looking for new opportunities to grow and develop my skills as a developer. Take a look at my portfolio and feel free to contact me if you have any questions or opportunities for me.',
  },
  portraitAlt: {
    pl: 'Portret Julena Zulaiki',
    en: 'Portrait of Julen Zulaika',
  },
};
