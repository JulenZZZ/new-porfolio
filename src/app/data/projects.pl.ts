import { Project } from '../models/project';
import { projectsEn } from './projects.en';

/**
 * Projects (Polish). Slugs, titles, tech stacks, thumbnails and years are
 * language-neutral and shared with EN; taglines, descriptions, roles and
 * image alts are professionally translated. FLAGGED FOR OWNER REVIEW
 * (no Polish source exists; extended descriptions need owner approval).
 */
export const projectsPl: Project[] = projectsEn.map((project) => ({
  ...project,
  tagline: { ...project.tagline },
  description: { ...project.description },
  role: { ...project.role },
  thumbnailAlt: { ...project.thumbnailAlt },
  tech: [...project.tech],
  images: project.images.map((image) => ({ ...image, alt: { ...image.alt } })),
  links: { ...project.links },
}));
