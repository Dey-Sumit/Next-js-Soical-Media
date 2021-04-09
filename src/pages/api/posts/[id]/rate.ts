import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import Post from "models/Post";
import { Types } from "mongoose";

const handler = nextConnect();
handler.use(all);

// @ route GET api/posts/:id/rate
// @ desc rate post by id
// @ access private

handler.put(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const authUserId = req.user._id as Types.ObjectId;
  try {
    const post = await Post.findById(req.query.id);

    const { rate }: { rate: Number } = req.body;

    if (rate !== 1 && rate !== 0) {
      return res.status(400).json({ msg: "Invalid rating" });
    }

    if (rate === 1) {
      // check if the post has already been liked
      if (
        post.likes.filter(
          (like) => like.user.toHexString() === authUserId.toHexString()
        ).length > 0
      )
        return res.status(400).json({ msg: "Post already liked by the user" });

      post.likes.unshift({ user: authUserId });
    } else {
      if (
        post.likes.filter(
          (like) => like.user.toHexString() === authUserId.toHexString()
        ).length === 0
      ) {
        return res
          .status(400)
          .json({ msg: "Post is not yet liked by the user" });
      } else {
        // get remove index
        const removeIndex = post.likes
          .map((like) => like.user)
          .indexOf(authUserId);

        post.likes.splice(removeIndex, 1);
      }
    }
    await post.save();
    res.status(200).json({ post });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server error");
  }
});

export default handler;
