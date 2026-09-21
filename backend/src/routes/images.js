import { Router } from "express";
import { Image } from "../models/Image.js";

export const imagesRouter = Router();

// Temporary development endpoint.
// Authentication will be required before production use.
imagesRouter.get("/", async (req, res, next) => {
  try {
    const ownerId = req.query.ownerId;

    if (!ownerId) {
      return res.status(400).json({ error: "ownerId is required during development" });
    }

    const images = await Image.find({ ownerId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ images });
  } catch (error) {
    next(error);
  }
});
