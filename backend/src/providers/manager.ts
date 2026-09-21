import { cloudinaryProvider } from "./cloudinary.js";
import { imgbbProvider } from "./imgbb.js";
import type { ImageHost, UploadResult } from "./types.js";

const providers: ImageHost[] = [cloudinaryProvider, imgbbProvider];

export async function uploadToProviders(buffer: Buffer, filename: string, mimeType: string) {
  const settled = await Promise.allSettled(
    providers.map((provider) => provider.upload(buffer, filename, mimeType))
  );

  const hosts: Array<UploadResult & { status: "active" | "failed"; error?: string }> = [];
  const errors: string[] = [];

  settled.forEach((result, index) => {
    const provider = providers[index];
    if (!provider) {
      errors.push("unknown provider: upload result index " + index);
      return;
    }
    if (result.status === "fulfilled") {
      hosts.push({ ...result.value, status: "active" });
    } else {
      const message = result.reason instanceof Error ? result.reason.message : "Unknown provider error.";
      hosts.push({ provider: provider.name, url: "", providerId: null, status: "failed", error: message });
      errors.push(provider.name + ": " + message);
    }
  });

  if (!hosts.some((host) => host.status === "active")) {
    throw new Error("All image hosts failed. " + errors.join(" | "));
  }

  return { hosts, errors };
}
