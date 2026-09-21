import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    discordId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: null },
    settings: {
      defaultProvider: { type: String, default: "imgur" }
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
