import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { imagesRouter } from "./routes/images.js";
import { createUploadsRouter } from "./routes/uploads.js";
import { createAuthRouter } from "./routes/auth.js";

export function createApp({ frontendUrl, uploadManager, discordAuth }) {
  const app = express();

  app.disable("x-powered-by");

  app.use(cors({
    origin: frontendUrl,
    credentials: true
  }));

  app.use(express.json({ limit: "1mb" }));

  app.use("/api/health", healthRouter);
  app.use("/api/auth", createAuthRouter({ discordAuth, frontendUrl }));
  app.use("/api/images", imagesRouter);
  app.use("/api/uploads", createUploadsRouter({ uploadManager }));

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
      details: error.details
    });
  });

  return app;
}
