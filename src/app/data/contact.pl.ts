import { Contact } from '../models/contact';
import { contactEn } from './contact.en';

/**
 * Contact data (Polish). Email, socials and CV link are language-neutral
 * and shared with EN; availability note is translated.
 * FLAGGED FOR OWNER REVIEW.
 */
export const contactPl: Contact = {
  ...contactEn,
  socials: contactEn.socials.map((social) => ({ ...social })),
  availability: { ...contactEn.availability },
};
