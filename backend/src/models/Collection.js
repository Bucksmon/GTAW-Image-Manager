import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, default: "", maxlength: 500 }
  },
  { timestamps: true }
);

collectionSchema.index({ ownerId: 1, name: 1 }, { unique: true });

export const Collection = mongoose.model("Collection", collectionSchema);
