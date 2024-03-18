import { User } from './user';
export interface Story {
  caption: string;
  image?: string; // URL of the image or video
  video?: string; // URL of the image or video
  created_at?: string; // Date string, you can convert it to Date object if needed
  user?: User;
}
