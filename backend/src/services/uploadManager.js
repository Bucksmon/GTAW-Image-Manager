import { ImgurProvider } from "./providers/ImgurProvider.js";

export function createUploadManager({ imgurClientId }) {
  const providers = [
    new ImgurProvider({ clientId: imgurClientId })
  ];

  return {
    async upload(buffer, { filename, mimeType }) {
      const errors = [];

      for (const provider of providers) {
        try {
          const result = await provider.upload(buffer, filename, mimeType);
          return { ...result, errors };
        } catch (error) {
          errors.push({
            provider: provider.name,
            message: error instanceof Error ? error.message : "Unknown provider error"
          });
        }
      }

      const error = new Error("All image hosts failed");
      error.details = errors;
      throw error;
    }
  };
}
