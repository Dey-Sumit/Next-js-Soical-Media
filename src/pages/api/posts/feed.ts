import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import { Post, User } from "models";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(all);

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!req.user) {
    res.status(301).json({ msg: "not authenticated" });
  }
  // get the posts posted by my followings

  // check if the req.user is updated with the new followings :)
  // TODO 👆

  const user = await User.findById(req.user._id);

  const posts = await Post.find({
    $or: [{ user: { $in: user.following } }, { user: req.user._id }],
  })
    .populate({ path: "user", select: "name username" })
    .populate("tags", "name")
    .sort("-createdAt");
  // this is the query to get the posts of your followers 👇
  // const posts = await Post.find({ user: { $in: user.following } })
  //   .populate({ path: "user", select: "name username" })
  //   .sort("-createdAt");

  res.status(200).json({ posts });
});

export default handler;
