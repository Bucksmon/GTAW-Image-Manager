import { Schema, model } from "mongoose";

const collectionSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", maxlength: 240 }
  },
  { timestamps: true }
);

collectionSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Collection = model("Collection", collectionSchema);
