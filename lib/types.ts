import mongoose from "mongoose";

type mongoose_id = string | mongoose.Types.ObjectId;
export interface User {
  _id: mongoose_id;
  name: string;
  username: string;
  password: string;
  profilePicture: string;
  bio: string;
  following: mongoose_id[];
  followers: mongoose_id[];
  // virtual fields
  noOfFollowers: number;
  noOfFollowing: number;
}

export interface FUser extends Omit<User, "_id"> {
  _id: string;
}
export interface FPost extends Omit<Post, "_id"> {
  _id: string;
}
// frontend backend different interface
export interface Post {
  _id?: mongoose_id;
  user: mongoose_id;
  content: string;
  parentPost?: Post;
  attachmentURL?: string;
  likes?: [
    {
      user: mongoose.Types.ObjectId | string;
    }
  ];
  comments?: Comment[];
  tags?: [
    {
      tag: mongoose.Types.ObjectId;
    }
  ];
}
export interface Comment {
  user: mongoose.Types.ObjectId;
  content: string;
  date?: Date;
  _id: string;
}

export interface Tag {
  _id?: mongoose.Types.ObjectId;
  name: string;
  posts: [Post];
}
