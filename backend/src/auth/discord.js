const DISCORD_API = "https://discord.com/api/v10";

export function createDiscordAuth({ clientId, clientSecret, redirectUri }) {
  function getAuthorizationUrl(state) {
    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "identify"
    });

    if (state) params.set("state", state);

    return `https://discord.com/oauth2/authorize?${params.toString()}`;
  }

  async function exchangeCode(code) {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    });

    const tokenResponse = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });

    const token = await tokenResponse.json();

    if (!tokenResponse.ok || !token.access_token) {
      throw new Error("Discord OAuth token exchange failed");
    }

    const userResponse = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });

    const user = await userResponse.json();

    if (!userResponse.ok || !user.id) {
      throw new Error("Discord user lookup failed");
    }

    return user;
  }

  return { getAuthorizationUrl, exchangeCode };
}
