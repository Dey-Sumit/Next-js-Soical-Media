import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { all } from "../../../../middlewares";

const handler = nc();

handler.use(all);

handler.get((req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!req.user) return res.json({ user: null });
  //   const {password,...r} = req.user
  console.log(req.user);

  return res.json({user:req.user});
});

export default handler;
