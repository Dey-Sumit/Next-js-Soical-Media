import mongoose, { Document } from "mongoose";
import { Tag } from "../lib/types.model";

const Schema = mongoose.Schema;

const TagSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

type TagDocument = Tag & Document;

export default (mongoose.models.Tag as mongoose.Model<TagDocument>) ||
  mongoose.model<TagDocument>("Tag", TagSchema);
