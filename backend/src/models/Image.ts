import { Schema, model } from "mongoose";

const hostSchema = new Schema(
  {
    provider: { type: String, required: true },
    url: { type: String, required: true },
    providerId: { type: String, default: null },
    status: { type: String, enum: ["active", "failed"], default: "active" }
  },
  { _id: false }
);

const imageSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    filename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    mimeType: { type: String, required: true },
    originalSize: { type: Number, required: true },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    hosts: { type: [hostSchema], default: [] },
    tags: { type: [String], default: [], index: true },
    collectionId: { type: Schema.Types.ObjectId, ref: "Collection", default: null, index: true }
  },
  { timestamps: true }
);

imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ userId: 1, tags: 1 });

export const Image = model("Image", imageSchema);
