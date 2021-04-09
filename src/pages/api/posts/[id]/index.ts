import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import Post from "models/Post";

const handler = nextConnect();
handler.use(all);

// @ route GET api/posts/:id
// @ desc get  post by id
// @ access private

handler
  // returnds post by id
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
      const post = await Post.findById(id)
        .populate("user")
        .populate("likes.user")
        .populate("comments.user")
        .populate("tags", "name");

      if (!post) return res.status(404).json({ msg: "Post not found" });
      res.json({ post });
    } catch (error) {
      console.log(error.message);

      if (error.kind === "ObjectId")
        return res.status(404).json({ msg: "Post not found" });
      res.status(500).json({ msg: "server error" });
    }
  })
  // update a post,although you can't update a post
  .put(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      // check auth
      if (!req.user) {
        return res.status(401).send("unauthorized");
      }
      if (!req.body.content)
        return res.status(400).json({ msg: "content is required" });

      const { id } = req.query;

      // insert post
      // const post: IPost = {
      //   userId: req.user.id,
      //   content: req.body.content,
      // };
      // await Post.create(post);
      // const post = await Post.findById(id);
      return res.status(200).json({ msg: "Update post is not implemented" });
    } catch (error) {
      return res.status(500).send("server error :(");
    }
  })
  // delete a post
  .delete(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const post = await Post.findById(req.query.id);

      if (!post) return res.status(404).json({ msg: "Post not found" });
      console.log(
        post.user === req.user._id,
        post.user,
        req.user._id,
        typeof post.user,
        typeof req.user._id
      );

      if (post.user.toString() !== req.user._id.toString()) {
        return res
          .status(401)
          .json({ msg: " user not authorized; seems like it's not your post" });
      }
      await post.remove();
      res.status(200).json({ msg: "Post removed" });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send("server error :(");
    }
  });

export default handler;
