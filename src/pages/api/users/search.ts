import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import User from "models/User";

// TODO test endpoints

const handler = nextConnect();
handler.use(all);

// @ route GET api/posts/:id
// @ desc get  post by id
// @ access private

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const q = req.query?.q?.toString();

  try {
    if (!q) {
      res.status(404).json({ msg: "please pass the keyword" });
    }

    //! needs upgrade to sort relevent results, use elastic search
    const users = await User.find({
      username: {
        $regex: q,
        $options: "i",
      },
    });
    // if (!user) return res.status(404).json({ msg: "User not found" });
    res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

export default handler;
