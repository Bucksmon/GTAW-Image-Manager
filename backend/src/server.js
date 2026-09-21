import { getEnv } from "./config/env.js";
import { connectDatabase } from "./db/mongoose.js";
import { createApp } from "./app.js";

const env = getEnv();

await connectDatabase(env.mongodbUri);

const app = createApp({ frontendUrl: env.frontendUrl });

app.listen(env.port, () => {
  console.log(`GTAW Image Manager API listening on port ${env.port}`);
});
