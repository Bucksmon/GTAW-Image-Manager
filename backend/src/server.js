import { getEnv } from "./config/env.js";
import { connectDatabase } from "./db/mongoose.js";
import { createUploadManager } from "./services/uploadManager.js";
import { createDiscordAuth } from "./auth/discord.js";
import { createApp } from "./app.js";

const env = getEnv();

await connectDatabase(env.mongodbUri);

const uploadManager = createUploadManager({
  imgurClientId: env.imgurClientId
});

const discordAuth = createDiscordAuth({
  clientId: env.discordClientId,
  clientSecret: env.discordClientSecret,
  redirectUri: env.discordRedirectUri
});

const app = createApp({
  frontendUrl: env.frontendUrl,
  uploadManager,
  discordAuth
});

app.listen(env.port, () => {
  console.log(`GTAW Image Manager API listening on port ${env.port}`);
});
