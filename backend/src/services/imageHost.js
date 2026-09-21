/**
 * Common contract for image-hosting providers.
 *
 * A provider receives image bytes and returns normalized metadata.
 */
export class ImageHost {
  constructor(name) {
    this.name = name;
  }

  async upload(_buffer, _filename, _mimeType) {
    throw new Error("upload() must be implemented by a provider");
  }

  async healthCheck() {
    return true;
  }
}
