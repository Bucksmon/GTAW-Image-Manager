# GTAW Image Manager — Web

Public landing page for GTAW Image Manager.

The product workflow is Discord-first:

1. Send a screenshot to the Discord bot in a DM, or use `/upload` in a configured server channel.
2. The bot sends the image to the private backend.
3. The backend uploads it to the configured image-hosting providers.
4. Discord receives direct URLs, BBCode and Markdown.

The public website does **not** contain the backend, bot, database configuration or provider credentials.

## Deploy

This repo is built with Vite and deployed to GitHub Pages using GitHub Actions.

Project Pages URL:

`https://bucksmon.github.io/GTAW-Image-Manager-Web/`

## Development

Requirements: Node.js 24+.

```bash
npm --prefix frontend install
npm --prefix frontend run dev
npm --prefix frontend run build
```

## Configuration

The only public build variable is:

`VITE_DISCORD_CLIENT_ID`

The Discord application ID is not a secret. Bot tokens, API keys, MongoDB credentials and image-provider credentials belong in the private backend/bot deployment.
