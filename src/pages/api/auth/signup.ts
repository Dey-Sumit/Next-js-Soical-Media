import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import isEmail from "validator/lib/isEmail";

import { all } from "../../../../middlewares";
import User from "../../../../models/User";
// import dbConnect from "../../../../util/dbConnect";

const handler = nextConnect();

handler.use(all);
// interface ExtendedNextApiRequest extends NextApiRequest{
//      user:{}
//      login:()=>{}
// }
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, username, email, password } = req.body;

  // data validation
  // send resposne if not valid
  //   console.log(isEmail(email));
  try {
    if (!isEmail(email)) {
      res.status(400).send("The email is not valid");
      return;
    }
    if (!name || !password) {
      res.status(400).send("Missing Field(s)");
      return;
    }

    // check if the email is already used or not
    // if exist, send message | 403
    const emailExists = await User.findOne({ email });
    console.log(emailExists);

    const usernameExists = await User.findOne({ username });
    if (emailExists) {
      res.status(403).json({ message: "email already exists" });
      return;
    }
    if (usernameExists) {
      res.status(403).json({ message: "username already exists" });
      return;
    }
    // console.log(userExists); -> Null

    // if not, hash the password
    // insert the user in db

    const user = await User.create({ name, username, email, password });

    // send user as the response | 201
    //  http://www.passportjs.org/docs/login/
    req.login(user, (err) => {
      if (err) throw err;
      //TODO extract password
      res.status(201).json({
        user: req.user,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Broken :(" });
  }
});

export default handler;
