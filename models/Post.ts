import mongoose, { Document } from "mongoose";
import { Post } from "../lib/types.model";

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // change this to text
    content: {
      type: String,
      required: true,
    },
    attachementURL: {
      type: String,
    },
    parentPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      default: null, // null means no parent post
    },
    // array of user objects which only holds userid
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        // likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        _id: false, //else mongoose will automatically add id; which is unnecessary
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

type PostDocument = Post & Document;

export default (mongoose.models.Post as mongoose.Model<PostDocument>) ||
  mongoose.model<PostDocument>("Post", PostSchema);
