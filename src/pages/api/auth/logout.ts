import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { all, passport } from "../../../../middlewares";

const handler = nc();

handler.use(all);

handler.post((req: ExtendedNextApiRequest, res: NextApiResponse) => {
  req.logOut();
  res.status(204).end();
});

export default handler;
