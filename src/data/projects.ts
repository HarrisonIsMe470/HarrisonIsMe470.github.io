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
export const projects: Project[] = [];
