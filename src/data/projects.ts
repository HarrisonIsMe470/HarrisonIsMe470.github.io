export interface Project {
  name: string;
  description: string;
  technologies: string[];
  image?: string;
  imageAlt?: string;
  github?: string;
  demo?: string;
  status?: 'In progress' | 'Complete' | 'Archived';
  date?: string;
}
export const projects: Project[] = [{
  name: 'Harrison’s Journal',
  description: 'A personal blog and a growing collection of projects, reading notes, and ideas.',
  technologies: ['Astro', 'TypeScript', 'Markdown', 'GitHub Pages'],
  github: 'https://github.com/HarrisonIsMe470/HarrisonIsMe470.github.io',
  demo: 'https://chino520.xyz',
  status: 'In progress',
}];
