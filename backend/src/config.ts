import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  FRONTEND_URL: z.string().url(),
  API_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_CLIENT_SECRET: z.string().min(1),
  DISCORD_REDIRECT_URI: z.string().url(),
  DISCORD_ALLOWED_USER_IDS: z.string().default(""),
  SESSION_SECRET: z.string().min(32),
  IMGUR_CLIENT_ID: z.string().min(1),
  MAX_UPLOAD_MB: z.coerce.number().positive().max(25).default(8)
});

export const env = envSchema.parse(process.env);

export const allowedDiscordUserIds = new Set(
  env.DISCORD_ALLOWED_USER_IDS.split(",").map((id) => id.trim()).filter(Boolean)
);
