import { NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all, passport } from "../../../../../middlewares";

const handler = nc();

handler.use(all);

//? GET
handler.get(
  (_req: ExtendedNextApiRequest, _res: NextApiResponse, next: NextHandler) => {
    console.log(_req);
    console.log("HERE REDIRECT");

    next();
  }
);

export default handler;
