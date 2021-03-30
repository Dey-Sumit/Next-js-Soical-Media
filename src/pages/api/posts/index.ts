import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";

const handler = nextConnect();
handler.use(all);

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: "/tmp" });

//? /api/posts/
handler.use(upload.single("attachment")); //? REVIEW

handler
  .get(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      _next: NextApiHandler
    ) => {
      //? /api/posts?uid=<> => returns posts by user id
      //? /api/posts  => returns all posts
      const uid = req.query?.uid?.toString(); // toString for the typescript

      const pageSize = 10;
      const page = Number(req.query?.page?.toString()) || 1;

      let posts: IPost[];

      // check if the uid is passed then return posts of that user
      let allPosts: IPost[], count: number;

      if (uid) {
        try {
          allPosts = await Post.find({ user: uid });
          count = allPosts.length;

          posts = await Post.find({ user: uid })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate("user") // check password field
            .sort("-createdAt");
          return res.json({
            posts,
            page,
            pages: Math.ceil(count / pageSize),
          });
        } catch (error) {
          if (error.kind === "ObjectId")
            return res.status(404).json({ message: "User not found" });

          return res.status(500).json({ message: "Server crashed" });
        }
      }
      // posts = await Post.find({}).populate("user").sort("-createdAt");
      count = await Post.estimatedDocumentCount();
      posts = await Post.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .populate("user") // check password field
        .sort("-createdAt");
      return res.json({
        posts,
        page,
        pages: Math.ceil(count / pageSize),
      });
    }
  )
  .post(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      _next: NextApiHandler
    ) => {
      try {
        const { content } = req.body;
        if (!req.user) return res.status(401).json({ message: "unauthorized" });

        if (!content)
          return res.status(400).json({ message: "content is required" });

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
          attachmentURL: attachmentURL,
        };
        const post = await Post.create(postDoc);
        return res.status(200).json({ post });
        // return res.status(200).json({ msg: attachmentURL });
      } catch (error) {
        console.log(error);

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
