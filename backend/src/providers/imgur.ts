export type UploadResult = {
  provider: "imgur";
  url: string;
  providerId: string;
};

export async function uploadToImgur(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  clientId: string
): Promise<UploadResult> {
  const form = new FormData();
  form.append("image", new Blob([new Uint8Array(buffer)], { type: mimeType }), filename);
  form.append("type", "file");

  const response = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    headers: { Authorization: "Client-ID " + clientId },
    body: form
  });

  const payload = (await response.json()) as {
    success?: boolean;
    data?: { id?: string; link?: string };
  };

  if (!response.ok || !payload.success || !payload.data?.id || !payload.data.link) {
    throw new Error("Imgur upload failed.");
  }

  return {
    provider: "imgur",
    providerId: payload.data.id,
    url: payload.data.link
  };
}
