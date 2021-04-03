import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import mongoose from "mongoose";

import { v2 as cloudinary } from "cloudinary";

import { ExtendedNextApiRequest } from "../../../../lib/types.api";
import { Post as IPost, Tag as ITag } from "../../../../lib/types.model";
import { all } from "../../../../middlewares";
import Post from "../../../../models/Post";
import Tag from "../../../../models/Tag";

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
            .populate("tags", "name")
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
        .populate("tags", "name")
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
        console.log("-------------------------");
        console.log("-------------------------");

        const { content, tags }: { content: string; tags?: string } = req.body;
        console.log(tags);

        const tagsArray = tags.split(",");
        console.log({ tagsArray });

        if (!req.user) return res.status(401).json({ message: "unauthorized" });

        if (!content)
          return res.status(400).json({ message: "content is required" });

        // insert post
        let attachmentURL: string;

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
        console.log({ post });
        console.log("----------------------------");

        let updated;
        // add tag to post
        //Promise.all = stackoverflow.com/questions/40140149/use-async-await-with-array-map

        https: await Promise.all(
          tagsArray.map(async (tag) => {
            console.log({ tag });

            try {
              const t = await Tag.findOne({
                name: tag,
              });
              // console.log("p", { t });
              //stackoverflow.com/questions/11963684/how-to-push-an-array-of-objects-into-an-array-in-mongoose-with-one-call
              if (t) {
                console.log("got the tag", t);

                updated = await Post.findByIdAndUpdate(
                  post._id,
                  {
                    $push: {
                      tags: t._id,
                    },
                  },
                  {
                    new: true,
                  }
                ).populate("tags");
                updated = await Post.findById(post._id).populate(
                  "tags", // field name
                  "name"
                );
                await Tag.findByIdAndUpdate(
                  t._id,
                  {
                    $push: {
                      posts: post._id, //TODO FIX THIS
                    },
                  },
                  {
                    new: true,
                  }
                );

                // await addPostToTag(t._id, post);
              } else {
                console.log("have not got the tag");

                const t = await Tag.create({ name: tag });
                console.log({ t });

                updated = await addTagToPost(post._id, t);
                console.log({ updated });

                await addPostToTag(t._id, post);
              }

              return res.status(200).json({ post: updated });
            } catch (error) {
              console.log(error);
            }
          })
        );
        console.log("UP", { updated });
        console.log("reached");

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

const addTagToPost = async (postId: mongoose.Types.ObjectId, tag: ITag) => {
  console.log("addTagToPost");
  return await Post.findByIdAndUpdate(
    postId,
    {
      $push: {
        tags: tag._id,
      },
    },
    {
      new: true,
    }
  );
};

const addPostToTag = async (tagId: mongoose.Types.ObjectId, post: IPost) => {
  console.log("addPostToTag");

  return await Tag.findByIdAndUpdate(
    tagId,
    {
      $push: {
        posts: post._id, //TODO FIX THIS
      },
    },
    {
      new: true,
    }
  );
};
