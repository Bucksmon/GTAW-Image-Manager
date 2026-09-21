import crypto from "node:crypto";
import { env } from "../config.js";
import type { ImageHost, UploadResult } from "./types.js";

function sign(params: Record<string, string>, secret: string) {
  const serialized = Object.keys(params).sort().map((key) => key + "=" + params[key]).join("&");
  return crypto.createHash("sha1").update(serialized + secret).digest("hex");
}

export const cloudinaryProvider: ImageHost = {
  name: "cloudinary",
  async upload(buffer, filename, mimeType): Promise<UploadResult> {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "gtaw-image-manager";
    const signature = sign({ folder, timestamp: String(timestamp) }, env.CLOUDINARY_API_SECRET);

    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
    form.append("api_key", env.CLOUDINARY_API_KEY);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: form
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.secure_url) {
      throw new Error(data.error?.message || "Cloudinary upload failed.");
    }

    return {
      provider: "cloudinary",
      url: data.secure_url,
      providerId: data.public_id || data.asset_id || null
    };
  }
};
