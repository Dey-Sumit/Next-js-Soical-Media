import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { v2 as cloudinary } from "cloudinary";

import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import User from "../../../../../models/User";
import fileUpload from "@/middlewares/fileUpload";
// @ route GET api/posts/:id
// @ desc get  post by id
// @ access private

import path from "path";
import multer from "multer";
import uploadMulter from "@/middlewares/fileUpload";
// import { v2 as cloudinary } from "cloudinary";

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "/tmp");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.filename}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// validation
const checkFileType = (
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const fileTypes = /jpg|jpeg|png/;

  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid File,accepts only images"));
  }
};

const handler = nextConnect();
handler.use(all);
// handler.use(upload.single("profilePicture"));
handler.use(uploadMulter().single("profilePicture"));
handler
  // returns user by id
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      return res.json({ user });
    } catch (error) {
      if (error.kind === "ObjectId")
        return res.status(404).json({ msg: "User not found" });
      return res.status(500).send("server error");
    }
  })
  // update user by id
  .put(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const { id } = req.query;

      // check auth & if it's his/her own profile
      if (!req.user || req.user._id.toString() !== id) {
        return res
          .status(401)
          .json({ msg: "unauthorized to update this profile" });
      }

      const { name, username, bio } = req.body;

      let profilePicture: string;

      if (req.file) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          width: 512,
          height: 512,
          crop: "fill",
        });
        profilePicture = image.secure_url;
      }

      const oldUser = await User.findById(id);
      // update the user
      oldUser.name = name ? name : oldUser.name;
      oldUser.username = username ? username : oldUser.username;
      oldUser.bio = bio ? bio : oldUser.bio;
      oldUser.profilePicture = profilePicture
        ? profilePicture
        : oldUser.profilePicture;

      const user = await oldUser.save(); // TODO pass options if needed for updated doc

      res.status(200).json({ user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ msg: "server error :(" });
    }
  })
  .delete(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    try {
      const user = await User.findById(req.query.id);

      if (!user) return res.status(404).json({ msg: "User not found" });

      if (req.query.id !== req.user._id.toString()) {
        return res.status(401).json({ msg: " It's not your profile :(" });
      }
      await user.remove();

      res.status(200).json({ msg: "User deleted" });
    } catch (error) {
      return res.status(500).json({ msg: "server error :(" });
    }
  });

export default handler;

//! Important for file handling ;because of form data; no idea what does it mean :(
export const config = {
  api: {
    bodyParser: false,
  },
};
