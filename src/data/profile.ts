import legacyProfile from './legacy-profile.json';
import legacySite from './legacy-site.json';
export const profile = {
  name: 'Harrison',
  // Recovered old-blog avatar; the newer monogram asset is also retained.
  avatar: legacySite.avatar,
  introduction: 'Welcome! I’m Harrison. This is where I share what I’m learning, collect my projects, and make room for the things I want to do next.',
};
export interface Book { title: string; author: string; finished?: string; note?: string; url?: string; }
// Completed books explicitly named in the old About page.
export const books: Book[] = [...legacyProfile.books];
export interface BucketItem { text: string; completed: boolean; }
export const bucketList: BucketItem[] = [
  ...legacyProfile.bucketList,
  { text: 'Build a personal home on the internet', completed: false },
];
