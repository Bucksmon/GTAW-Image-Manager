export type UploadResult = {
  provider: string;
  url: string;
  providerId: string | null;
  deleteUrl?: string | null;
};

export interface ImageHost {
  readonly name: string;
  upload(buffer: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
}
