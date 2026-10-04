import { Navigation } from '../models/navigation';
import { navigationEn } from './navigation.en';

/**
 * Navigation (Polish). Keys and paths are language-neutral and shared with
 * EN; labels are translated. FLAGGED FOR OWNER REVIEW.
 */
export const navigationPl: Navigation = {
  items: navigationEn.items.map((item) => ({
    ...item,
    label: { ...item.label },
    path: { ...item.path },
  })),
};
