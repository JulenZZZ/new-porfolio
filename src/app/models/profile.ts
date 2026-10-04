import { LocalText } from './lang';
import { SocialLink } from './contact';

/**
 * Public profile of the site owner.
 * Single instance per language, served by `DataProvider.getProfile`.
 */
export interface Profile {
  /** Full name, e.g. "Julen Zulaika". Language-neutral. */
  name: string;
  /** Professional role line, e.g. "Full Stack Developer". */
  role: LocalText;
  /** Place of work, e.g. "Kraków, Poland". */
  location: string;
  /** Full bio (About page). May contain `\n\n`-separated paragraphs. */
  bio: LocalText;
  /** Portrait image path, e.g. "assets/img/portrait.jpg". */
  portrait: string;
  /** Translated alt text for the portrait (a11y, per-lang SEO). */
  portraitAlt: LocalText;
  /** CV download URL (Google Drive link). */
  cvUrl: string;
  /** Contact email address (without `mailto:` prefix). */
  email: string;
  /** External social profiles (LinkedIn, GitHub). */
  socials: SocialLink[];
}
