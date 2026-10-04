import { Skill } from '../models/skill';

/**
 * The 12 skills from the live site. Skill names are language-neutral;
 * categories follow the site's own grouping labels, normalised to
 * `SkillCategory` (note: the live site lists TypeScript under "Backend" and
 * Angular Material under "Frontend" — normalised here to frontend/framework).
 */
export const skillsEn: Skill[] = [
  { id: 'html5', name: 'HTML5', category: 'frontend' },
  { id: 'css3', name: 'CSS3', category: 'frontend' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend' },
  { id: 'angular', name: 'Angular', category: 'framework' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend' },
  { id: 'angular-material', name: 'Angular Material', category: 'framework' },
  { id: 'php', name: 'PHP', category: 'backend' },
  { id: 'python', name: 'Python', category: 'backend' },
  { id: 'tailwind-css', name: 'Tailwind CSS', category: 'styling' },
  { id: 'sass', name: 'Sass', category: 'styling' },
  { id: 'git', name: 'Git', category: 'tooling' },
  { id: 'sql', name: 'SQL', category: 'database' },
];
