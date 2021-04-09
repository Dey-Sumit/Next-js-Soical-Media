import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import Post from "models/Post";
import { Types } from "mongoose";

// api/posts/:id/comments

const handler = nextConnect();
handler.use(all);

handler
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      //   const user = await User.findById(req.user._id).select("-password");

      // TODO FIX THIS , length of undefined in populateing fields ; working fine for the post request
      const post = await Post.findById(req.query.id).populate(
        "comments.user",
        "name"
      );

      res.status(200).json(post.comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  })
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const authUserId = req.user._id as Types.ObjectId;
    try {
      //   const user = await User.findById(req.user._id).select("-password");
      const content = req.body.content;
      const post = await Post.findById(req.query.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      if (!content) return res.status(401).json({ msg: "Content is required" });

      const newComment = {
        content: req.body.content,
        user: authUserId,
      };

      post.comments.unshift(newComment);
      await post.save();
      const comments = post.populate("comments.user", "username");
      return res.status(200).json(comments);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server error");
    }
  });

export default handler;
