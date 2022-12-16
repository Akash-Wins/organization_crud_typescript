import mongoose from "mongoose";
import { Schema } from "mongoose";
import { nanoid } from "nanoid";
import IUser from "../interfaces/Iuser"
import bcrypt from "bcrypt";
const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    userName: {
      type: String,
      required: false,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  try {
    const savedPassword = await bcrypt.hash(this.password, 10);
    this.password = savedPassword;
    next();
  } catch(error) {
    next(error);
  }
});

// userSchema.pre("findOneAndUpdate", async function (next) {
//   try {
//     if (this.update.password) {
//       const passwordhash = await bcrypt.hash(this.update.password, 10);
//       this.update.password = passwordhash;
//     }
//     next();
//   } catch(error){
//     return next(error);
//   }
// });

let user = mongoose.model<IUser>("user", userSchema);
export default user;
