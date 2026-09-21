import { Router } from "express";
import multer from "multer";
import { validateImage } from "../services/imageProcessor.js";
import { User } from "../models/User.js";
import { Image } from "../models/Image.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

export function createUploadsRouter({ uploadManager }) {
  const router = Router();

  router.post("/", upload.single("image"), async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "image is required" });
      }

      const discordId = req.header("x-development-discord-id");

      if (!discordId) {
        return res.status(401).json({
          error: "Authentication is not configured for this endpoint yet"
        });
      }

      validateImage({
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      const username = req.header("x-development-username") || "Development User";

      const user = await User.findOneAndUpdate(
        { discordId },
        {
          $set: {
            discordId,
            username
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      const hosted = await uploadManager.upload(req.file.buffer, {
        filename: req.file.originalname,
        mimeType: req.file.mimetype
      });

      const image = await Image.create({
        ownerId: user._id,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        originalSize: req.file.size,
        providers: [{
          name: hosted.provider,
          url: hosted.url,
          providerId: hosted.providerId,
          status: "active"
        }]
      });

      res.status(201).json({
        image: {
          id: image._id,
          filename: image.filename,
          url: hosted.url,
          bbcode: `[img]${hosted.url}[/img]`,
          markdown: `![${image.filename}](${hosted.url})`
        },
        providerErrors: hosted.errors
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
