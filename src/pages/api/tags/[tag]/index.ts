import { NextApiResponse } from "next";
import nc from "next-connect";
// use vs code tricks for path
import { ExtendedNextApiRequest } from "../lib/types.api";
import { all } from "../middlewares";
import Tag from "../models/Tag";

const handler = nc();

handler.use(all);
// get all posts under a tag // might need to change the api endpoint and put it under posts
handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { tag }: { tag?: string } = req.query;
  try {
    const posts = await Tag.find({ name: tag }).populate({
      path: "posts",
      populate: [{ path: "tags", select: "name" }, { path: "user" }],
    });

    if (posts.length == 0)
      return res.status(404).json({ message: "Tag does not exist" });
    return res.status(200).json({ posts: posts[0] });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default handler;
