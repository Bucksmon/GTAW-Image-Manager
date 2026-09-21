export const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]);

export function validateImage({ mimeType, size }) {
  if (!SUPPORTED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Unsupported image type");
  }

  // Keep the initial API conservative. This can be configured later.
  const maxBytes = 15 * 1024 * 1024;

  if (size > maxBytes) {
    throw new Error("Image exceeds the 15 MB upload limit");
  }
}
