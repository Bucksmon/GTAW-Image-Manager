import "dotenv/config";

const required = [];

export function getEnv() {
  const env = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    mongodbUri: process.env.MONGODB_URI || "",
    discordBotToken: process.env.DISCORD_BOT_TOKEN || "",
    imgurClientId: process.env.IMGUR_CLIENT_ID || "",
    imgurClientSecret: process.env.IMGUR_CLIENT_SECRET || ""
  };

  if (env.nodeEnv === "production") {
    for (const key of required) {
      if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return env;
}
