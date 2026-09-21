import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    discordId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true },
    globalName: { type: String, default: null },
    avatar: { type: String, default: null },
    lastLoginAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
