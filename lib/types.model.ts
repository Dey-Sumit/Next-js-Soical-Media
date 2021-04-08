import mongoose from "mongoose";

export interface User {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  username: string;
  password: string;
  profilePicture: string;
  bio: string;
  following: (mongoose.Types.ObjectId | string)[];
  followers: (mongoose.Types.ObjectId | string)[];
  // virtual fields
  noOfFollowers: number;
  noOfFollowing: number;
}
// frontend backend different interface
export interface Post {
  _id?: mongoose.Types.ObjectId | string;
  user: mongoose.Types.ObjectId | string;
  content: string;
  parentPost?: Post;
  attachmentURL?: string;
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
  tags?: [
    {
      tag: mongoose.Types.ObjectId;
    }
  ];
}

export interface Tag {
  _id?: mongoose.Types.ObjectId;
  name: string;
  posts: [Post];
}
