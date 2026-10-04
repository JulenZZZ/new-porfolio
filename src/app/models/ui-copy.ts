/** Page-chrome copy in both languages (plan §9, §14). Authorial UI copy lives
 *  in `data/ui-copy.*.ts` as typed `LocalText`-style tables — never as
 *  literals inside components — so the future CMS can serve the same shapes.
 */

export interface HomeCopy {
  eyebrow: string;
  heroLead: string;
  viewWork: string;
  getInTouch: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutLead: string;
  aboutMore: string;
  skillsEyebrow: string;
  skillsTitle: string;
  viewAll: string;
  featuredEyebrow: string;
  featuredTitle: string;
  contactTitle: string;
  contactBody: string;
  categoryNames: Record<string, string>;
}

export interface AboutCopy {
  eyebrow: string;
  title: string;
  para1: string;
  para2: string;
  educationEyebrow: string;
  educationTitle: string;
  diploma1Title: string;
  diploma1Meta: string;
  diploma1Body: string;
  diploma2Title: string;
  diploma2Meta: string;
  diploma2Body: string;
  krakowEyebrow: string;
  krakowTitle: string;
  krakowBody: string;
  cvLabel: string;
  ctaTitle: string;
  ctaBody: string;
  ctaSecondary: string;
}

export interface PortfolioCopy {
  eyebrow: string;
  title: string;
  lead: string;
  all: string;
  emptyTitle: string;
  reset: string;
  results: (n: number) => string;
}

export interface ProjectCopy {
  back: string;
  techTitle: string;
  galleryTitle: string;
  galleryHint: string;
  prevImage: string;
  nextImage: string;
  prevProject: string;
  nextProject: string;
  contactTitle: string;
  contactBody: string;
  contactCta: string;
  notFoundEyebrow: string;
  notFoundTitle: string;
  notFoundBody: string;
}

export interface ContactCopy {
  eyebrow: string;
  title: string;
  lead: string;
  writeToMe: string;
  copyEmail: string;
  copied: string;
  availabilityLabel: string;
  cvLabel: string;
  connectTitle: string;
  mailSubject: string;
}

export interface NotFoundCopy {
  eyebrow: string;
  title: string;
  body: string;
  home: string;
  portfolio: string;
}

/** All page-chrome copy for one language. */
export interface UiCopy {
  home: HomeCopy;
  about: AboutCopy;
  portfolio: PortfolioCopy;
  project: ProjectCopy;
  contact: ContactCopy;
  notFound: NotFoundCopy;
}
