import { Skill } from '../models/skill';
import { skillsEn } from './skills.en';

/**
 * Skills (Polish). Technology names are language-neutral, identical to EN.
 * FLAGGED FOR OWNER REVIEW (no Polish source exists).
 */
export const skillsPl: Skill[] = skillsEn.map((skill) => ({ ...skill }));
