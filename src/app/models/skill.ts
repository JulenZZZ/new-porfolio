/**
 * Skill category. Matches the grouping labels used on the live site
 * (Frontend / Framework / Backend / Styling / SCM Tool / Database),
 * normalised to stable identifiers.
 */
export type SkillCategory =
  'frontend' | 'framework' | 'backend' | 'styling' | 'tooling' | 'database';

/** A single skill, tool or technology. Names are language-neutral. */
export interface Skill {
  /** Stable identifier, e.g. "angular-material". Unique per language set. */
  id: string;
  /** Display name, e.g. "Angular Material". */
  name: string;
  category: SkillCategory;
  /** Optional proficiency 1..3. Absent when the owner did not grade it. */
  level?: 1 | 2 | 3;
}

/** Skills of one category, for grouped rendering (Skills strip). */
export interface SkillGroup {
  category: SkillCategory;
  items: Skill[];
}

/** Category order used by `PortfolioService.skillsGrouped`. */
export const SKILL_CATEGORY_ORDER: readonly SkillCategory[] = [
  'frontend',
  'framework',
  'backend',
  'styling',
  'tooling',
  'database',
];
