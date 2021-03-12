import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { all, passport } from "../../../../middlewares";

const handler = nc();

handler.use(all);

handler.post(
  passport.authenticate("local"),
  (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    console.log(req.session);
    console.log(req.body);

    res.json({ user: req.user });
  }
);

export default handler;
