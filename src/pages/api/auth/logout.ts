import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";

const handler = nc();

handler.use(all);

//? /api/auth/logout
//? logs out the user

handler.post((req: ExtendedNextApiRequest, res: NextApiResponse) => {
  req.logOut();
  res.status(204).end();
});

export default handler;
