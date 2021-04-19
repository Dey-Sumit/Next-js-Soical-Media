import { NextApiResponse } from "next";
import nextConnect from "next-connect";

import { v2 as cloudinary } from "cloudinary";

import { Post as IPost, Tag as ITag } from "lib/types";

import { Post, Tag, User } from "models";
import { uploadMulter, all } from "middlewares";
import { ExtendedNextApiRequest } from "lib/types.api";

const handler = nextConnect();

handler.use(all);

handler.use(uploadMulter().single("attachment"));

handler
  //? /api/posts?uid=<> => returns posts by user id
  //? /api/posts  => returns all posts
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { uid, page } = req.query;

    const pageSize = 4;
    const pageNumber = Number(page) || 0;

    let posts: IPost[];

    // check if the uid is passed then return posts of that user
    let allPosts: IPost[], count: number;

    if (uid) {
      try {
        //! FIX the DUPLICATION
        allPosts = await Post.find({ user: uid.toString() });
        count = allPosts.length;

        posts = await Post.find({ user: uid.toString() })
          .limit(pageSize)
          .skip(pageSize * pageNumber)
          .populate("user")
          .populate("tags")
          .sort("-createdAt");
        return res.json({
          posts,
          page: pageNumber,
          pages: Math.ceil(count / pageSize) - 1,
        });
        // return res.json(posts);
      } catch (error) {
        if (error.kind === "ObjectId")
          return res.status(404).json({ msg: "User not found" });

        return res.status(500).json({ msg: "Server crashed" });
      }
    }

    // if not user, then return all the posts with pagination
    count = await Post.estimatedDocumentCount();

    posts = await Post.find({})
      .limit(pageSize)
      .skip(pageSize * pageNumber)
      .populate("tags", "name")
      .populate("user")
      .sort("-createdAt");
    return res.json({
      posts,
      page: pageNumber,
      pages: Math.ceil(count / pageSize) - 1,
    });
    // return res.json(posts);
  })
  // create a post
  .post(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const { content, tags }: { content: string; tags?: string } = req.body;

      const tagsArray = tags && [...new Set(tags.split(","))]; // convert to an array and remove duplicates if the tags are present

      if (!req.user) return res.status(401).json({ msg: "unauthorized" });

      if (!content) return res.status(400).json({ msg: "content is required" });

      // insert post
      let attachmentURL: string;

      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          width: 250,
          height: 250,
          crop: "fill",
        });
        attachmentURL = image.secure_url;
      }

      const postDoc: IPost = {
        user: req.user._id,
        content: req.body.content,
        attachmentURL,
      };

      let post = await Post.create(postDoc);
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            posts: post._id,
          },
        },
        {
          new: true,
        }
      );
      // add tag to post
      //Promise.all = stackoverflow.com/questions/40140149/use-async-await-with-array-map

      // tag0 (O), tag2(N)
      if (tags) {
        await Promise.all(
          tagsArray.map(async (tagName) => {
            try {
              // check if the tag is already created
              const tag = await Tag.findOne({
                name: tagName,
              });

              //stackoverflow.com/questions/11963684/how-to-push-an-array-of-objects-into-an-array-in-mongoose-with-one-call
              // if created ->find the post and add the tag
              if (tag) {
                post = await addTagToPost(post, tag);

                // add the post under the tag
                await addPostToTag(tag, post);
              } else {
                //  if the tag is new then create a new tag
                const newTag = await Tag.create({ name: tagName });

                // add the tag to the post
                post = await addTagToPost(post, newTag);

                // add the post under the tag
                await addPostToTag(newTag, post);
              }
            } catch (error) {
              console.log(error.message);
            }
          })
        );
      }
      return res.status(200).json(post);
    } catch (error) {
      console.log(error);

      return res.status(500).send("server error :(");
    }
  });

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};

const addTagToPost = async (post: IPost, tag: ITag) => {
  return await Post.findByIdAndUpdate(
    post._id,
    {
      $push: {
        //@ts-ignore
        tags: tag._id,
      },
    },
    {
      new: true,
    }
  ).populate("tags", "name");
};

const addPostToTag = async (tag: ITag, post: IPost) => {
  return await Tag.findByIdAndUpdate(
    tag._id,
    {
      $push: {
        //@ts-ignore
        posts: post._id,
        $inc: { totalPosts: 1 }, // TODO dec totalPosts when the post is deleted
      },
    },
    {
      new: true,
    }
  );
};
