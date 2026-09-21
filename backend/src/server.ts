import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import multer from "multer";
import { z } from "zod";
import { env } from "./config.js";
import { connectDatabase } from "./db.js";
import { createOAuthState, getDiscordAuthorizeUrl, handleDiscordCallback, setSessionCookie, clearSessionCookie, requireAuth } from "./auth.js";
import { User } from "./models/User.js";
import { Image } from "./models/Image.js";
import { Collection } from "./models/Collection.js";
import { uploadToProviders } from "./providers/manager.js";

const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.FRONTEND_URL, credentials: true, methods: ["GET","POST","PATCH","DELETE","OPTIONS"], allowedHeaders: ["Content-Type"] }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-8", legacyHeaders: false }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, new Set(["image/png","image/jpeg","image/webp","image/gif"]).has(file.mimetype))
});

app.get("/api/health", async (_req, res) => {
  try { await connectDatabase(); res.json({ ok: true, service: "gtaw-image-manager-api", database: "connected" }); }
  catch { res.status(503).json({ ok: false, service: "gtaw-image-manager-api", database: "unavailable" }); }
});
app.get("/api/auth/login", (_req, res) => res.redirect(getDiscordAuthorizeUrl(createOAuthState().state)));
app.get("/api/auth/callback", async (req, res) => {
  try {
    const query = z.object({ code: z.string().min(1), state: z.string().min(1) }).parse(req.query);
    await connectDatabase();
    const result = await handleDiscordCallback(query.code, query.state);
    setSessionCookie(res, result.token);
    res.redirect(env.FRONTEND_URL);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    const url = new URL(env.FRONTEND_URL); url.searchParams.set("auth_error", message); res.redirect(url.toString());
  }
});
app.post("/api/auth/logout", (_req, res) => { clearSessionCookie(res); res.status(204).end(); });

app.get("/api/me", requireAuth, async (req, res) => {
  await connectDatabase();
  const user = await User.findOne({ discordId: req.auth!.discordId }).lean();
  if (!user) return res.status(401).json({ error: "Account no longer exists." });
  res.json({ id: String(user._id), discordId: user.discordId, username: user.username, globalName: user.globalName, avatar: user.avatar });
});

app.get("/api/images", requireAuth, async (req, res) => {
  await connectDatabase();
  const query = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(40), search: z.string().trim().max(100).optional(), collectionId: z.string().trim().optional(), tag: z.string().trim().max(50).optional(), sort: z.enum(["newest","oldest"]).default("newest") }).parse(req.query);
  const filter: Record<string, unknown> = { userId: req.auth!.discordId };
  if (query.collectionId) filter.collectionId = query.collectionId;
  if (query.tag) filter.tags = query.tag.toLowerCase();
  if (query.search) {
    const escaped = query.search.replaceAll("\\", "\\\\").replaceAll(".", "\\.").replaceAll("*", "\\*");
    filter.$or = [{ filename: { $regex: escaped, $options: "i" } }, { originalFilename: { $regex: escaped, $options: "i" } }, { tags: { $regex: escaped, $options: "i" } }];
  }
  const skip = (query.page - 1) * query.limit; const sort = query.sort === "oldest" ? 1 : -1;
  const [items, total] = await Promise.all([Image.find(filter).sort({ createdAt: sort }).skip(skip).limit(query.limit).lean(), Image.countDocuments(filter)]);
  res.json({ items, pagination: { page: query.page, limit: query.limit, total, pages: Math.ceil(total / query.limit) } });
});

app.post("/api/images/upload", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Upload a PNG, JPEG, WebP, or GIF image." });
  try {
    await connectDatabase();
    const tags = typeof req.body.tags === "string" ? req.body.tags.split(",").map((tag: string) => tag.trim().toLowerCase()).filter(Boolean).slice(0,20) : [];
    const collectionId = typeof req.body.collectionId === "string" && req.body.collectionId ? req.body.collectionId : null;
    if (collectionId) { const collection = await Collection.findOne({ _id: collectionId, userId: req.auth!.discordId }).lean(); if (!collection) return res.status(400).json({ error: "Collection not found." }); }
    const uploaded = await uploadToProviders(req.file.buffer, req.file.originalname, req.file.mimetype);
    const image = await Image.create({ userId: req.auth!.discordId, filename: req.file.originalname, originalFilename: req.file.originalname, mimeType: req.file.mimetype, originalSize: req.file.size, hosts: uploaded.hosts, tags, collectionId });
    res.status(201).json({ item: image, providerWarnings: uploaded.errors });
  } catch (error) { console.error(error); res.status(502).json({ error: error instanceof Error ? error.message : "Upload failed." }); }
});

app.patch("/api/images/:id", requireAuth, async (req, res) => {
  await connectDatabase();
  const body = z.object({ tags: z.array(z.string().trim().min(1).max(50)).max(20).optional(), collectionId: z.string().nullable().optional(), filename: z.string().trim().min(1).max(160).optional() }).parse(req.body);
  if (body.collectionId) { const collection = await Collection.findOne({ _id: body.collectionId, userId: req.auth!.discordId }).lean(); if (!collection) return res.status(400).json({ error: "Collection not found." }); }
  const update: Record<string, unknown> = {}; if (body.tags) update.tags = body.tags.map((tag) => tag.toLowerCase()); if (body.collectionId !== undefined) update.collectionId = body.collectionId; if (body.filename) update.filename = body.filename;
  const item = await Image.findOneAndUpdate({ _id: req.params.id, userId: req.auth!.discordId }, update, { new: true }).lean();
  if (!item) return res.status(404).json({ error: "Image not found." }); res.json({ item });
});
app.delete("/api/images/:id", requireAuth, async (req, res) => { await connectDatabase(); const item = await Image.findOneAndDelete({ _id: req.params.id, userId: req.auth!.discordId }); if (!item) return res.status(404).json({ error: "Image not found." }); res.status(204).end(); });
app.get("/api/collections", requireAuth, async (req, res) => { await connectDatabase(); const items = await Collection.find({ userId: req.auth!.discordId }).sort({ name: 1 }).lean(); res.json({ items }); });
app.post("/api/collections", requireAuth, async (req, res) => { const body = z.object({ name: z.string().trim().min(1).max(80), description: z.string().trim().max(240).default("") }).parse(req.body); await connectDatabase(); try { const item = await Collection.create({ userId: req.auth!.discordId, name: body.name, description: body.description }); res.status(201).json({ item }); } catch (error) { if (error && typeof error === "object" && "code" in error && (error as { code?: number }).code === 11000) return res.status(409).json({ error: "A collection with that name already exists." }); throw error; } });
app.delete("/api/collections/:id", requireAuth, async (req, res) => { await connectDatabase(); const collection = await Collection.findOneAndDelete({ _id: req.params.id, userId: req.auth!.discordId }); if (!collection) return res.status(404).json({ error: "Collection not found." }); await Image.updateMany({ userId: req.auth!.discordId, collectionId: collection._id }, { $set: { collectionId: null } }); res.status(204).end(); });

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  if (error instanceof multer.MulterError) return res.status(error.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Image exceeds the upload limit." : "Invalid upload." });
  if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid request.", details: error.issues });
  res.status(500).json({ error: "Internal server error." });
});

export default app;
if (process.env.VERCEL !== "1") app.listen(env.PORT, () => console.log("GTAW Image Manager API listening on port " + env.PORT));