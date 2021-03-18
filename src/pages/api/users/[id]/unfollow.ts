import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import User from "../../../../../models/User";
import mongoose from "mongoose";

// TODO test endpoints
const handler = nextConnect();
handler.use(all);

// @ follow request PUT
// @ api/users/:id/follow
// @ private

handler.put(
  async (
    req: ExtendedNextApiRequest,
    res: NextApiResponse,
    next: NextApiHandler
  ) => {
    const { id }: { id?: string } = req.query;
    //! 1. add the user to my following list
    //! 2. add me to the person's followers list
    try {
      //TODO check auth
      //   const user = await User.findById(req.user._id);

      console.log("REQUEST before", req.user);

      // check if the user want's to follow himself
      if (req.user._id === mongoose.Types.ObjectId(id)) {
        return res
          .status(400)
          .json({ msg: "Ouu! You cant unfollow yourself :(" });
      }

      //TODO use mongoose to do it
      if (!req.user.following.includes(mongoose.Types.ObjectId(id))) {
        // console.log("already following");
        return res.status(400).json({ msg: "You are not following yet" });
      }

      // 1. remove the id from my followings
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            following: mongoose.Types.ObjectId(id),
          },
        },
        { new: true }
      );
      // 1. remove the id from the person's followers

      await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            followers: req.user._id,
          },
        },
        { new: true }
      );
      console.log("REQUEST after", req.user);

      //   if (!user) return res.status(404).json({ msg: "User not found" });
      res.json({ user });
    } catch (error) {
      console.log(error.message);

      if (error.kind === "ObjectId")
        return res.status(404).json({ msg: "User not found" });
      res.status(500).json({ msg: "server error" });
    }
  }
);
export default handler;
