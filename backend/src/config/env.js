import "dotenv/config";

export function getEnv() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT || 3000),
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    discordRedirectUri: process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/discord/callback",
    mongodbUri: process.env.MONGODB_URI || "",
    discordBotToken: process.env.DISCORD_BOT_TOKEN || "",
    discordClientId: process.env.DISCORD_CLIENT_ID || "",
    discordClientSecret: process.env.DISCORD_CLIENT_SECRET || "",
    imgurClientId: process.env.IMGUR_CLIENT_ID || "",
    imgurClientSecret: process.env.IMGUR_CLIENT_SECRET || ""
  };
}
