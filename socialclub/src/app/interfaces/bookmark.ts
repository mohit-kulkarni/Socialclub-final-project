// bookmark.interface.ts
import { Post } from '../interfaces/post';

export interface Bookmark {
  id: number;
  post: Post;
  created_at: Date;
}
