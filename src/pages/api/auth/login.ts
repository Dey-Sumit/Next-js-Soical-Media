import { NextApiResponse } from "next";
import nc from "next-connect";
import extractUser from "../../../../lib/extractUser";
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

    res.json({ user: extractUser(req.user) });
  }
);

export default handler;
