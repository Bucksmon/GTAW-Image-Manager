import { env } from "../config.js";
import type { ImageHost, UploadResult } from "./types.js";

export const imgbbProvider: ImageHost = {
  name: "imgbb",
  async upload(buffer, filename, mimeType): Promise<UploadResult> {
    const form = new FormData();
    form.append("image", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
    form.append("name", filename.replace(/\.[^.]+$/, ""));

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(env.IMGBB_API_KEY)}`, {
      method: "POST",
      body: form
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success || !data.data?.url) {
      throw new Error(data.error?.message || "ImgBB upload failed.");
    }

    return {
      provider: "imgbb",
      url: data.data.url,
      providerId: data.data.id || null,
      deleteUrl: data.data.delete_url || null
    };
  }
};
