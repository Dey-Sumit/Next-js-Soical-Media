import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
import { all } from "../../../../../middlewares";
import Tag from "../../../../../models/Tag";

const handler = nc();

handler.use(all);
// get all posts under a tag // might need to change the api endpoint and put it under posts
handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  const { tag }: { tag?: string } = req.query;
  const posts = await Tag.find({ name: tag }).populate({
    path: "posts",
    populate: { path: "tags", select: "name" },
  });
  res.status(200).json({ posts });
});

export default handler;
