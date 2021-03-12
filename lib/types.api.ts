import mongoose from "mongoose";
import { NextApiRequest } from "next";

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: {};
  user: {
    _id: mongoose.Types.ObjectId;
  };
}
