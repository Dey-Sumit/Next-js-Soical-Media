import { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { v2 as cloudinary } from "cloudinary";

import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import User from "models/User";

import uploadMulter from "middlewares/fileUpload";

const handler = nextConnect();
handler.use(all);
handler.use(uploadMulter().single("profilePicture"));
handler
  // returns user by id
  .get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ msg: "User not found" });

      return res.json(user);
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

      res.status(200).json(user);
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
