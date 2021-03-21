import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";

const handler = nextConnect();
handler.use(all);

// GET: /posts/?uid=12
handler
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      console.log(req.query);
      const uid = req.query.uid?.toString(); // toString for the typescript
      // const username = req.query.username?.toString(); // toString for the typescript
      let posts: IPost[];
      // GET: /posts/?uid=12
      if (uid) {
        posts = await Post.find({ user: uid })
          .populate("user")
          .sort("-createdAt");
        res.json({ posts });
        return;
      }

      // // GET: /posts/?username=x5
      // if (username) {
      //   posts = await Post.find({ "user.username": username })
      //     .populate("user")
      //     .sort("-createdAt");
      //   res.json({ posts });
      //   return;
      // }
      posts = await Post.find({}).populate("user").sort("-createdAt");
      res.status(200).json({ posts });
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
        console.log(req.user);

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
