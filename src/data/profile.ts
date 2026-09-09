export const profile = {
  name: 'Harrison',
  // Replace this local monogram with your own photo in public/images/.
  avatar: '/images/avatar.svg',
  introduction: 'Welcome! I’m Harrison. This is where I share what I’m learning, collect my projects, and make room for the things I want to do next.',
};
export interface Book { title: string; author: string; finished?: string; note?: string; url?: string; }
// Add your own completed books; no reading history is assumed.
export const books: Book[] = [];
export interface BucketItem { text: string; completed: boolean; }
export const bucketList: BucketItem[] = [
  { text: 'Build a personal home on the internet', completed: false },
];
