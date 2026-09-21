import { ImageHost } from "../imageHost.js";

const IMGUR_UPLOAD_URL = "https://api.imgur.com/3/image";

export class ImgurProvider extends ImageHost {
  constructor({ clientId }) {
    super("imgur");
    this.clientId = clientId;
  }

  async upload(buffer, filename) {
    if (!this.clientId) {
      throw new Error("IMGUR_CLIENT_ID is not configured");
    }

    const body = new FormData();
    body.append(
      "image",
      new Blob([buffer], { type: "application/octet-stream" }),
      filename
    );
    body.append("type", "file");

    const response = await fetch(IMGUR_UPLOAD_URL, {
      method: "POST",
      headers: { Authorization: `Client-ID ${this.clientId}` },
      body
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload?.success || !payload?.data?.link) {
      throw new Error(payload?.data?.error || "Imgur upload failed");
    }

    return {
      provider: this.name,
      url: payload.data.link,
      providerId: payload.data.id,
      deleteHash: payload.data.deletehash ?? null
    };
  }

  async healthCheck() {
    return Boolean(this.clientId);
  }
}
