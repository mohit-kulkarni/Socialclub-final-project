export interface Post {
  id?: number;
  likes_count?: number;
  username?: string;
  image_or_video?: string;
  caption?: string;
  location?: string;
  created_at?: Date;
}
