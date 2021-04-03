import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import Post from "../../../../../models/Post";

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

        const post = await Post.findById(id)
          .populate("user")
          .populate("likes.user")
          .populate("comments.user")
          .populate("tags", "name");

        // console.log(post.populated("user")); // check if the model is populated

        if (!post) return res.status(404).json({ msg: "Post not found" });
        res.send(post);
      } catch (error) {
        console.log(error.message);

        if (error.kind === "ObjectId")
          return res.status(404).json({ msg: "Post not found" });
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
        console.log(req.user);

        // check auth
        if (!req.user) {
          return res.status(401).send("unauthorized");
        }
        if (!req.body.content)
          return res.status(400).send("content is required");
        const { id } = req.query;
        console.log(req.user);

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
        const post = await Post.findById(req.query.id);

        if (!post) return res.status(404).json({ msg: "Post not found" });

        // check user
        console.log(post.user);
        console.log(req.user._id);

        if (post.user.toHexString() !== req.user._id.toHexString()) {
          return res
            .status(401)
            .send(" user not authorized; seems like it's not your post");
        }
        await post.remove();
        res.status(200).json({ msg: "Post removed" });
      } catch (error) {
        console.log(error.message);
        res.status(500).send("server error");
      }
    }
  );

export default handler;
