import { getEnv } from "./config/env.js";
import { connectDatabase } from "./db/mongoose.js";
import { createUploadManager } from "./services/uploadManager.js";
import { createApp } from "./app.js";

const env = getEnv();

await connectDatabase(env.mongodbUri);

const uploadManager = createUploadManager({
  imgurClientId: env.imgurClientId
});

const app = createApp({
  frontendUrl: env.frontendUrl,
  uploadManager
});

app.listen(env.port, () => {
  console.log(`GTAW Image Manager API listening on port ${env.port}`);
});
