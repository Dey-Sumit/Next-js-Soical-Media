import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const handler = nextConnect();
handler.use(all);
// cloudinary configuration //TODO refactor WET to DRY th
cloudinary.config({
  cloud_name: "dgmvj256k",
  api_key: "714775562774485",
  api_secret: "6tnhU93ot2BK7nmuMmYk3yIoIwA",
});
const upload = multer({ dest: "/tmp" });
// GET: /posts/?uid=12
handler.use(upload.single("attachment")); //? REVIEW

handler
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      const uid = req.query?.uid?.toString(); // toString for the typescript
      console.log(req.query);

      // const username = req.query.username?.toString(); // toString for the typescript

      const pageSize = 2;
      const page = Number(req.query?.page?.toString()) || 1;

      let posts: IPost[];
      // GET: /posts/?uid=12

      if (uid) {
        // the query can be better
        const allPosts = await Post.find({ user: uid });
        const count = allPosts.length;

        posts = await Post.find({ user: uid })
          .limit(pageSize)
          .skip(pageSize * (page - 1))
          .populate("user")
          .sort("-createdAt");
        return res.json({
          posts,
          page,
          pages: Math.ceil(count / pageSize),
        });
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

        console.log(req.body.content);
        const { content } = req.body;
        if (!req.user) {
          return res.status(401).send("unauthorized");
        }
        if (!req.body.content)
          return res.status(400).send("content is required");

        // insert post
        let attachmentURL: string;
        console.log(req.file);

        if (req.file) {
          const image = await cloudinary.uploader.upload(req.file.path, {
            width: 250,
            height: 250,
            crop: "fill",
          });
          attachmentURL = image.secure_url;
          console.log(attachmentURL);
        }
        const postDoc: IPost = {
          user: req.user._id,
          content: req.body.content,
          attachementURL: attachmentURL,
        };
        const post = await Post.create(postDoc);
        return res.status(200).json({ post });
        // return res.status(200).json({ msg: attachmentURL });
      } catch (error) {
        return res.status(500).send("server error :(");
      }
    }
  );

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
