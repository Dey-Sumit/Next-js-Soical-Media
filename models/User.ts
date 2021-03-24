import mongoose, { Model, Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

import { User } from "../lib/types.model";

const UserSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },

  username: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  profilePicture: {
    type: String,
    default:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  //? people follows me
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  //? people follows me

  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// Virtuals
UserSchema.virtual("fullName").get(function (this: UserDocument) {
  return this.firstName + this.lastName;
});

// methods
UserSchema.methods.matchPassword = async function (
  this: UserDocument,
  enteredPassword: string
) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// middleware before saving the data
// hash the password during registration
UserSchema.pre("save", async function (this: UserDocument, next: Function) {
  // run oly if the password field is modified (ex: during update profile)
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

type UserDocument = User & Document;

//  interface UserModel extends Model<UserDocument> {
//     build(attrs: User): UserDocument
//     //add
//  }

//? Fix this type
export default (mongoose.models.User as mongoose.Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", UserSchema);
