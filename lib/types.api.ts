import mongoose from "mongoose";
import { NextApiRequest } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: {};
  user: {
    _id: mongoose.Types.ObjectId;
    following: [mongoose.Types.ObjectId];
    followers: [mongoose.Types.ObjectId];
  };
  file: {
    //TODO add full typescript on multer and other packages
    filename: string;
    path: string;
  };
  logOut: Function;
  login: Function;
}
