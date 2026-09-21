import mongoose from "mongoose";
import { env } from "./config.js";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 5
    });
  }
  try {
    await connectionPromise;
    return mongoose;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}
