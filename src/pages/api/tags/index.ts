import { NextApiResponse } from "next";
import nc from "next-connect";
import { loginSchema } from "../../../../lib/schemaValidation";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { all, passport, schemaValidate } from "../../../../middlewares";

const handler = nc();

handler.use(all);

handler.get(
  (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const {} = req.query
    res.json({ user: req.user });
  }
);

export default handler;
