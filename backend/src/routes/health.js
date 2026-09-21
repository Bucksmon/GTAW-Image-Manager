import { Router } from "express";
import mongoose from "mongoose";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "gtaw-image-manager-api",
    database: mongoose.connection.readyState === 1 ? "connected" : "not-configured"
  });
});
