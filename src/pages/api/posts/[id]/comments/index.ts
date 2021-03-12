import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../../lib/types.api";
import { all } from "../../../../../../middlewares";
import Post from "../../../../../../models/Post";
import User from "../../../../../../models/User";

const handler = nextConnect();
handler.use(all);

handler
  .post(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        //   const user = await User.findById(req.user._id).select("-password");
        const post = await Post.findById(req.query.id);

        const newComment = {
          text: req.body.text,
          user: req.user._id,
          // avatar: user.avatar,
        };
        post.comments.unshift(newComment);
        await post.save();
        const comments = post.populate("comments.user", "username");
        res.status(200).json(comments);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
      }
    }
  )
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        //   const user = await User.findById(req.user._id).select("-password");
        const post = await Post.findById(req.query.id).populate(
          "comments.user",
          "username"
        );
        res.status(200).json(post.comments);
      } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
      }
    }
  );
export default handler;
