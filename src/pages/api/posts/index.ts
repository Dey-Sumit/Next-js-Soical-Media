import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";

const handler = nextConnect();
handler.use(all);

handler
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      const posts = await Post.find({});
      res.send(posts);
    }
  )
  .post(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        // check auth
        if (!req.user) {
          return res.status(401).send("unauthorized");
        }
        if (!req.body.content)
          return res.status(400).send("content is required");

        // insert post
        const postDoc: IPost = {
          user: req.user._id,
          content: req.body.content,
        };
        const post = await Post.create(postDoc);
        return res.status(200).json({ post });
      } catch (error) {
        return res.status(500).send("server error :(");
      }
    }
  );

export default handler;
