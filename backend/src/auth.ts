import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { env, allowedDiscordUserIds } from "./config.js";
import { User } from "./models/User.js";

const SESSION_COOKIE = "gtaw_session";

export type SessionPayload = {
  sub: string;
  discordId: string;
  username: string;
  type: "session";
};

function signState(nonce: string) {
  return jwt.sign({ nonce, type: "oauth_state" }, env.SESSION_SECRET, { expiresIn: "10m" });
}

function verifyState(state: string) {
  const decoded = jwt.verify(state, env.SESSION_SECRET) as { nonce: string; type: string };
  if (decoded.type !== "oauth_state") throw new Error("Invalid OAuth state");
}

function signSession(user: SessionPayload) {
  return jwt.sign(user, env.SESSION_SECRET, { expiresIn: "7d" });
}

function verifySession(token: string) {
  const decoded = jwt.verify(token, env.SESSION_SECRET) as SessionPayload;
  if (decoded.type !== "session") throw new Error("Invalid session");
  return decoded;
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/"
  };
}

export function createOAuthState() {
  const nonce = crypto.randomBytes(32).toString("hex");
  return { state: signState(nonce) };
}

export function getDiscordAuthorizeUrl(state: string) {
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.DISCORD_REDIRECT_URI,
    scope: "identify",
    state
  });
  return "https://discord.com/oauth2/authorize?" + params.toString();
}

export async function handleDiscordCallback(code: string, state: string) {
  verifyState(state);
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: env.DISCORD_REDIRECT_URI
  });
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!tokenResponse.ok) throw new Error("Discord token exchange failed");

  const token = (await tokenResponse.json()) as { access_token: string };
  const userResponse = await fetch("https://discord.com/api/v10/users/@me", {
    headers: { Authorization: "Bearer " + token.access_token }
  });
  if (!userResponse.ok) throw new Error("Discord user lookup failed");

  const discordUser = (await userResponse.json()) as {
    id: string; username: string; global_name?: string | null; avatar?: string | null;
  };

  if (allowedDiscordUserIds.size > 0 && !allowedDiscordUserIds.has(discordUser.id)) {
    throw new Error("Your Discord account is not authorized for this private application.");
  }

  const avatar = discordUser.avatar
    ? "https://cdn.discordapp.com/avatars/" + discordUser.id + "/" + discordUser.avatar + ".png?size=128"
    : null;

  const user = await User.findOneAndUpdate(
    { discordId: discordUser.id },
    { discordId: discordUser.id, username: discordUser.username, globalName: discordUser.global_name ?? null, avatar, lastLoginAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  return {
    token: signSession({ sub: String(user._id), discordId: discordUser.id, username: discordUser.username, type: "session" })
  };
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, cookieOptions());
}

export function clearSessionCookie(res: Response) {
  res.clearCookie(SESSION_COOKIE, cookieOptions());
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];
    if (!token) return res.status(401).json({ error: "Authentication required." });
    req.auth = verifySession(token);
    next();
  } catch {
    res.status(401).json({ error: "Session expired. Please sign in again." });
  }
}
export function requireBotAuth(req: Request, res: Response, next: NextFunction) {
  const authorization = req.header("authorization");
  if (!env.BOT_API_KEY) return res.status(503).json({ error: "Bot uploads are not configured." });

  const expected = "Bearer " + env.BOT_API_KEY;

  if (!authorization || authorization.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(authorization), Buffer.from(expected))) {
    return res.status(401).json({ error: "Invalid bot credentials." });
  }

  next();
}
