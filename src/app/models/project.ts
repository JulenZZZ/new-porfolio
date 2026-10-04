import { LocalText } from './lang';

/** One gallery image of a project, with translated alt text. */
export interface ProjectImage {
  src: string;
  alt: LocalText;
  width?: number;
  height?: number;
}

/** Optional outbound links of a project. Both absent when unknown. */
export interface ProjectLinks {
  live?: string;
  repo?: string;
}

/**
 * Portfolio project. `slug` is language-neutral (one URL per project,
 * no duplicate-content split between `/pl` and `/en`).
 */
export interface Project {
  /** URL identifier, e.g. "todo-list-app". Unique across the data set. */
  slug: string;
  /** Display title, e.g. "To-Do List App". Language-neutral. */
  title: string;
  /** One-liner used on cards and teasers. */
  tagline: LocalText;
  /** Detail-page body (2-4 paragraphs, `\n\n`-separated). */
  description: LocalText;
  /** Technology tags, e.g. ["Angular", "ASP.NET"]. Drive filter chips. */
  tech: string[];
  /** Year of completion/publication. */
  year: number;
  /** Author's role on the project, e.g. "Full-stack developer". */
  role: LocalText;
  /** Card/og thumbnail path. */
  thumbnail: string;
  /** Translated alt text for the thumbnail. */
  thumbnailAlt: LocalText;
  /** Detail-page gallery (at minimum the thumbnail itself). */
  images: ProjectImage[];
  links: ProjectLinks;
  /** Shown on Home ("Featured projects", exactly 3 in v1). */
  featured: boolean;
}
