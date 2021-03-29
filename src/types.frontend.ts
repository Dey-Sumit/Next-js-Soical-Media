export interface Post {
  _id?: string;
  user: User;
  content: string;
  parentPost?: Post;
  likes?: [
    {
      user: string;
    }
  ];
  comments: Comment[];
  updatedAt: Date;
  createdAt: Date;
}
export interface Comment {
  user: User;
  content: string;
  date?: Date;
  _id: string;
}
export interface User {
  _id: string;
  firstName: string; //TODO fix this
  lastName?: string;
  name: string;
  username: string;
  profilePicture: string;
  isAdmin?: boolean;
  followers: string[];
  following: string[];
  // company: Types.ObjectId | Record<string, unknown>;
}
