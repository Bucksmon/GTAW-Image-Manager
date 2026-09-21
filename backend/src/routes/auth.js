import { Router } from "express";
import crypto from "node:crypto";

export function createAuthRouter({ discordAuth, frontendUrl }) {
  const router = Router();

  router.get("/discord", (_req, res) => {
    const state = crypto.randomBytes(24).toString("hex");
    const authorizationUrl = discordAuth.getAuthorizationUrl(state);

    // Session storage will replace this temporary state handling.
    res.redirect(authorizationUrl);
  });

  router.get("/discord/callback", async (req, res, next) => {
    try {
      if (!req.query.code) {
        return res.status(400).json({ error: "Discord authorization code is missing" });
      }

      const user = await discordAuth.exchangeCode(req.query.code);

      // Persistent sessions will be added next.
      res.redirect(
        `${frontendUrl}?discord_connected=1&discord_id=${encodeURIComponent(user.id)}`
      );
    } catch (error) {
      next(error);
    }
  });

  return router;
}
