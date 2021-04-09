import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import extractUser from "lib/extractUser";

const handler = nc();

handler.use(all);

//? /api/auth/me
//? returns the logged in user or null

handler.get((req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!req.user) return res.status(401).json({ user: null });
  return res.json({ user: extractUser(req.user) });
});

export default handler;
