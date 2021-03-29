import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import isEmail from "validator/lib/isEmail";

//TODO uninstall validator lib
import { registrationSchema } from "../../../../lib/schemaValidation";
import { ExtendedNextApiRequest } from "../../../../lib/types.api";

import { all, schemaValidate } from "../../../../middlewares";
import User from "../../../../models/User";

//? Ref : https://www.youtube.com/watch?v=ZG7sLbI8kL8&t=1163s | Bruno A.

const handler = nextConnect();

handler.use(all);

handler.use(schemaValidate(registrationSchema));

handler.post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { name, username, email, password } = req.body;

  try {
    // const validatedData = await registrationSchema.validate(req.body);

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(403).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(403).json({ message: "Username already exists" });
    }

    // if not, hash the password
    // insert the user in db

    const user = await User.create({ name, username, email, password });

    // send user as the response | 201    //?  http://www.passportjs.org/docs/login/

    req.login(user, (err) => {
      if (err) throw err;
      //TODO extract password
      res.status(201).json({
        user: req.user,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Server Broken :(" });
  }
});

export default handler;
