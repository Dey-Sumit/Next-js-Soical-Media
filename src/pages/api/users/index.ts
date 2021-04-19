import { NextApiResponse } from "next";
import nc from "next-connect";
import { ExtendedNextApiRequest } from "lib/types.api";
import { all } from "middlewares";
import User from "models/User";

const handler = nc();

handler.use(all);

// returns top 5 tags sorted by number of posts
handler.get(async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    const users = await User.aggregate([
      {
        $project: {
          length: { $size: "$followers" },
          // posts: 1,
          name: 1,
        },
      },
      { $sort: { length: -1 } },
      { $limit: 5 },
    ]);
    // const tags = await Tag.find({}).sort({ totalPosts: -1 }).limit(5);

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
});
//TODO https://stackoverflow.com/questions/32063941/how-to-sort-documents-based-on-length-of-an-array-field
export default handler;