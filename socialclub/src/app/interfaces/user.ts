export interface User {
  id?: number;
  user?: number; // Assuming it's an ID to another user resource
  username?: string;
  fname?: string;
  // bio?: string | null; // Optional and potentially null
  // profile_pic: string | '../../assets/img/no_user.jpg'; // URL of the profile picture
  profile_pic?: string; // URL of the profile picture
  dob?: Date | null; // Optional and potentially null
  isFriend?: boolean;
}
