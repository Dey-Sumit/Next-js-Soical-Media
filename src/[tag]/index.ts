// import { NextApiHandler, NextApiResponse } from "next";
// import nextConnect from "next-connect";
// import { ExtendedNextApiRequest } from "../../../../../lib/types.api";
// import { all } from "../../../../../middlewares";
// import Post from "../../../../../models/Post";

// const handler = nextConnect();
// handler.use(all);

// // @ route GET api/posts/:id
// // @ desc get  post by id
// // @ access private

// handler.get(
//   async (
//     req: ExtendedNextApiRequest,
//     res: NextApiResponse,
//     next: NextApiHandler
//   ) => {
//     const { tag }:{tag?:string} = req.query;
//     try {

//       const post = await Tag.findById(id)
//         .populate("user")
//         .populate("likes.user")
//         .populate("comments.user")
//         .populate("tags", "name");

//       // console.log(post.populated("user")); // check if the model is populated

//       if (!post) return res.status(404).json({ msg: "Post not found" });
//       res.send(post);
//     } catch (error) {
//       console.log(error.message);

//       if (error.kind === "ObjectId")
//         return res.status(404).json({ msg: "Post not found" });
//       res.status(500).send("server error");
//     }
//   }
// );
