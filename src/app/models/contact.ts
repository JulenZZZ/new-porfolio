import { LocalText } from './lang';

/** Supported external contact channels. */
export type SocialKind = 'linkedin' | 'github' | 'mail';

/** One external contact/social link. Labels are language-neutral. */
export interface SocialLink {
  kind: SocialKind;
  /** Display label, e.g. "LinkedIn". */
  label: string;
  /** Absolute URL (`https://…`) or `mailto:` address. */
  href: string;
}

/**
 * Contact data. v1 is `mailto:` + social links only — no form submission.
 * `phone` stays absent until the owner provides a public number.
 */
export interface Contact {
  /** Contact email address (without `mailto:` prefix). */
  email: string;
  phone?: string;
  socials: SocialLink[];
  /** Availability note shown on the Contact page. */
  availability: LocalText;
  /** CV download URL (Google Drive link). */
  cvUrl: string;
}
