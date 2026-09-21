import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    providerId: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "failed", "deleted"],
      default: "active"
    },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    originalSize: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    providers: { type: [providerSchema], default: [] },
    tags: { type: [String], default: [] },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

imageSchema.index({ ownerId: 1, createdAt: -1 });

export const Image = mongoose.model("Image", imageSchema);
