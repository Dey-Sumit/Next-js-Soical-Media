import { NextApiResponse } from "next";
import nc from "next-connect";
import { loginSchema } from "../../../../lib/schemaValidation";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { all, passport, schemaValidate } from "../../../../middlewares";

const handler = nc();

handler.use(all);
handler.use(schemaValidate(loginSchema));
handler.post(
  passport.authenticate("local"),
  (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    console.log(req.session);

    res.json({ user: req.user });
  }
);

export default handler;
