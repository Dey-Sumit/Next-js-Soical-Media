import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import User from "models/User";
import mongoose from "mongoose";

// TODO test endpoints
const handler = nextConnect();
handler.use(all);

// @ follow request PUT
// @ api/users/:id/follow
// @ private

handler.put(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { id }: { id?: string } = req.query;
  //! 1. add the user to my following list
  //! 2. add me to the person's followers list
  try {
    //TODO check auth
    if (!(await User.findById(id)))
      return res.status(404).json({ msg: "requested user not found" });
    // check if the user want's to follow himself
    if (req.user._id.toString() === id) {
      return res.status(400).json({ msg: "Ouu! You cant follow yourself :(" });
    }

    //TODO use mongoose to do it
    if (req.user.following.includes(mongoose.Types.ObjectId(id))) {
      return res.status(400).json({ msg: "Already Following" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          following: mongoose.Types.ObjectId(id),
        },
      },
      { new: true }
    );

    await User.findByIdAndUpdate(
      id,
      {
        $push: {
          followers: req.user._id,
        },
      },
      { new: true }
    );

    //   if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    console.log(error.message);

    if (error.kind === "ObjectId")
      return res.status(404).json({ msg: "User not found" });
    res.status(500).json({ msg: "server error" });
  }
});
export default handler;
