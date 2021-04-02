import next, { NextApiResponse } from "next";
import nc, { NextHandler } from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all, passport } from "../../../../../middlewares";

const handler = nc();

handler.use(all);
handler.use((req, res, next) => {
  console.log("req");

  //   req.headers["Access-Control-Allow-Origin"] = "*";
  next();
});
//? GET
handler.get(
  passport.authenticate("google", {
    scope: ["profile"],
  }),
  (req: ExtendedNextApiRequest, res: NextApiResponse, next: NextHandler) => {
    console.log("req 2");  
    next();
  }
  
);

export default handler;
