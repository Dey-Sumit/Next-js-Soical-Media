import { NextApiHandler, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import formidable from "formidable";

import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import User from "../../../../../models/User";
// TODO test endpoints
const handler = nextConnect();
handler.use(all);

// cloudinary configuration
cloudinary.config({
  cloud_name: "dgmvj256k",
  api_key: "714775562774485",
  api_secret: "6tnhU93ot2BK7nmuMmYk3yIoIwA",
});
const upload = multer({ dest: "/tmp" });

// @ route GET api/posts/:id
// @ desc get  post by id
// @ access private
handler.use(upload.single("profilePicture")); //? REVIEW
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
        res.json({ user });
      } catch (error) {
        console.log(error.message);

        if (error.kind === "ObjectId")
          return res.status(404).json({ msg: "User not found" });
        res.status(500).send("server error");
      }
    }
  )
  .post(
    async (
      req: ExtendedNextApiRequest,
      res: NextApiResponse,
      next: NextApiHandler
    ) => {
      try {
        const { id } = req.query;

        // check auth & if it's his/her own profile
        if (!req.user || req.user._id.toHexString() !== id) {
          return res.status(401).json({ msg: "unauthorized" });
        }
        let profilePicture: string;
        const { name, username } = req.body;

        if (req.file) {
          console.log(req.file);

          const image = await cloudinary.uploader.upload(req.file.path, {
            width: 512,
            height: 512,
            crop: "fill",
          });
          profilePicture = image.secure_url;
          console.log(profilePicture);
        }
        // console.log(__dirname);

        // const form = new formidable.IncomingForm({
        //   uploadDir: "./images",
        //   keepExtensions: true,
        // });
        // form.parse(req, (err, fields, files) => {
        //   // console.log(err, fields, files);
        //   if (err) {
        //     throw new Error(err);
        //   }
        //   console.log({ fields });
        //   console.log({ files });
        // });
        // // console.log(req.user);
        console.log(id);

        const oldUser = await User.findById(id);
        // console.log(name, username, profilePicture);
        oldUser.name = name ? name : oldUser.name;
        oldUser.username = username ? username : oldUser.username;
        oldUser.profilePicture = profilePicture
          ? profilePicture
          : oldUser.profilePicture;
        // const user = await User.findByIdAndUpdate(id, {
        //   name: name ? name : oldUser.name,
        //   username: username ? username : oldUser.username,
        //   profilePicture: profilePicture
        //     ? profilePicture
        //     : oldUser.profilePicture,
        // });
        const user = await oldUser.save();
        res.status(200).json({ user });

        // return res.status(200).json({ h: "h" });
      } catch (error) {
        console.log(error.message);

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

export const config = {
  api: {
    bodyParser: false,
  },
};
