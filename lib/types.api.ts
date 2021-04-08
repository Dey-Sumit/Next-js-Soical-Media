import mongoose from "mongoose";
import { NextApiRequest } from "next";
import { User } from "./types.model";

export interface ExtendedNextApiRequest extends NextApiRequest {
  session: {};
  user: User;
  file: {
    //TODO add full typescript on multer and other packages
    filename: string;
    path: string;
  };
  logOut: Function;
  login: Function;
}
