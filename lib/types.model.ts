import mongoose, { Document } from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  name: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  following: [mongoose.Types.ObjectId];
  follwoers: [mongoose.Types.ObjectId];
  profilePicture: string;
  //TODO fix the type
  // followers: string[];
  // company: Types.ObjectId | Record<string, unknown>;
}
// frontend backend different interface
export interface Post {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  content: string;
  parentPost?: Post;
  likes?: [
    {
      user: mongoose.Types.ObjectId;
    }
  ];
  comments?: [
    {
      user: mongoose.Types.ObjectId;
      content: string;
      date?: Date;
    }
  ];
}
