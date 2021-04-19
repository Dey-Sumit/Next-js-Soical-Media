import { Post as IPost } from "lib/types";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all, auth } from "middlewares";
import { Post, User } from "models";
import { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();
handler.use(all);
handler.use(auth);

handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { page } = req.query;
  console.log("here----");

  // get the posts posted by my followings

  // check if the req.user is updated with the new followings :)
  // TODO 👆

  const pageSize = 4;
  const pageNumber = Number(page) || 0;

  let posts: IPost[], allPosts: IPost[];
  try {
    const user = await User.findById(req.user._id);
    allPosts = await Post.find({
      $or: [{ user: { $in: user.following } }, { user: req.user._id }],
    });

    const count = allPosts.length;
    posts = await Post.find({
      $or: [{ user: { $in: user.following } }, { user: req.user._id }],
    })
      .limit(pageSize)
      .skip(pageSize * pageNumber)
      // .populate("user", "username") // ERROR in selecting specific fields
      .populate("tags", "name")
      .populate("user")
      .sort("-createdAt");
    return res.json({
      posts,
      page: pageNumber,
      pages: Math.ceil(count / pageSize) - 1,
    });
  } catch (error) {
    console.log(error);
    return res.json({});
  }
  // res.status(200).json(posts);
});

export default handler;
// this is the query to get the posts of your followers 👇
// const posts = await Post.find({ user: { $in: user.following } })
//   .populate({ path: "user", select: "name username" })
//   .sort("-createdAt");
