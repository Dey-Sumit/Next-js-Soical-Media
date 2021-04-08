import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import dbConnect from "../util/dbConnect";

export default async function (
  _req: NextApiRequest,
  _res: NextApiResponse,
  next: NextHandler
) {
  try {
    await dbConnect();
  } catch (error) {
    console.log("Database Error", error.message);
  }
  next();
}
