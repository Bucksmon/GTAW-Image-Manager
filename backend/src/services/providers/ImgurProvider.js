import { ImageHost } from "../imageHost.js";

export class ImgurProvider extends ImageHost {
  constructor({ clientId }) {
    super("imgur");
    this.clientId = clientId;
  }

  async upload() {
    if (!this.clientId) {
      throw new Error("IMGUR_CLIENT_ID is not configured");
    }

    throw new Error("Imgur upload implementation is the next pipeline step");
  }
}
