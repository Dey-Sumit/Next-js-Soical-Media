import { ExtendedNextApiRequest } from "lib/types.api";
import { NextApiResponse } from "next";
import { NextHandler } from "next-connect";

export default async function (
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) {
  if (!req.user) {
    return res.status(301).json({ msg: "Unauthenticated" });
  }

  next();
}
