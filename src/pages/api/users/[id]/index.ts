import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import User from "../../../../../models/User";
// TODO test endpoints
const handler = nextConnect();
handler.use(all);

// @ route GET api/posts/:id
// @ desc get  post by id
// @ access private

handler
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      const { id } = req.query;
      try {
        // const post = await Post.findById(id).populate("user", [
        //   "username",
        //   "email",
        // ]);

        const user = await User.findById(id);
        // .populate("user")
        // .populate("likes.user");

        // console.log(post.populated("user")); // check if the model is populated

        if (!user) return res.status(404).json({ msg: "User not found" });
        res.send(user);
      } catch (error) {
        console.log(error.message);

        if (error.kind === "ObjectId")
          return res.status(404).json({ msg: "User not found" });
        res.status(500).send("server error");
      }
    }
  )
  .put(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        // console.log(req.user);
        const { id } = req.query;

        // check auth & if it's his/her own profile
        if (!req.user || req.user._id.toHexString() !== id) {
          return res.status(401).send("unauthorized");
        }
        // if (!req.body.content)
        //   return res.status(400).send("content is required");
        // console.log(req.user);

        // insert post
        // const post: IPost = {
        //   userId: req.user.id,
        //   content: req.body.content,
        // };
        // await Post.create(post);
        // const post = await Post.findById(id);
        return res.status(200).json({ h: "h" });
      } catch (error) {
        return res.status(500).send("server error :(");
      }
    }
  )
  .delete(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        const user = await User.findById(req.query.id);

        if (!user) return res.status(404).json({ msg: "Post not found" });

        // check user
        // console.log(post.user);
        // console.log(req.user._id);

        // TODO test endpoint(s)
        if (req.query.id !== req.user._id.toHexString()) {
          return res
            .status(401)
            .send(" user not authorized; seems like it's not your profile :(");
        }
        await user.remove();
        res.status(200).json({ msg: "User deleted" });
      } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
      }
    }
  );

export default handler;
