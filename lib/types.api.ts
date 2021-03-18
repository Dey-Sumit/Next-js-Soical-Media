import mongoose from "mongoose";
import { NextApiRequest } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: {};
  user: {
    _id: mongoose.Types.ObjectId;
    following: [mongoose.Types.ObjectId];
    follwoers: [mongoose.Types.ObjectId];
  };
  logOut: Function;
}
