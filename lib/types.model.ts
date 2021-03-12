import mongoose, { Document } from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
  isAdmin?: boolean;
  // company: Types.ObjectId | Record<string, unknown>;
}

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
      text: string;
      date?: Date;
    }
  ];
}
