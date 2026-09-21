import mongoose from "mongoose";

let connectionPromise;

export async function connectDatabase(uri) {
  if (!uri) {
    console.warn("MONGODB_URI is not configured; starting without a database.");
    return null;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
  }

  await connectionPromise;
  return mongoose.connection;
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  connectionPromise = undefined;
}
