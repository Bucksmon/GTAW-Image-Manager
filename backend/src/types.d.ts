import type { SessionPayload } from "./auth.js";

declare global {
  namespace Express {
    interface Request {
      auth?: SessionPayload;
    }
  }
}

export {};