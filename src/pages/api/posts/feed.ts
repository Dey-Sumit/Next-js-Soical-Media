import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";
import User from "../../../../models/User";

const handler = nextConnect();
handler.use(all);

handler.get(
  async (
    req: ExtendedNextApiRequest,
    res: NextApiResponse,
    next: NextApiHandler
  ) => {
    if (!req.user) {
      res.status(301).json({ msg: "not authenticated" });
    }
    // get the posts posted by my followings
    console.log(req.user);
    // check if the req.user is updated with the newes followings :)
    // TODO 👆
    const user = await User.findById(req.user._id);
    console.log(user);

    const posts = await Post.find({
      $or: [{ user: { $in: user.following } }, { user: req.user._id }],
    })
      .populate({ path: "user", select: "name username" })
      .sort("-createdAt");
    // const posts = await Post.find({ user: { $in: user.following } })
    //   .populate({ path: "user", select: "name username" })
    //   .sort("-createdAt");

    res.send(posts);
  }
);

export default handler;
