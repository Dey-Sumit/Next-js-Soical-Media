import { ExtendedNextApiRequest } from "lib/types.api";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export default async function (
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  console.log("USER", req.user);

  if (!req.user) {
    return res.status(401).json({ messsage: "Unauthenticated" });
  }

  next();
}