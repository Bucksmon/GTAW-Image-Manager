# GTAW Image Manager — Web

Public landing page for GTAW Image Manager.

The product workflow is Discord-first:

1. Add the bot to a Discord server and run `/setup`.
2. Select exactly one screenshot approval channel and exactly one server role allowed to approve screenshots.
3. Users post screenshots in that channel.
4. An approver reacts with ✅.
5. The bot uploads the approved images to the private backend and posts the resulting URLs, BBCode and Markdown in the uploader's private Discord thread.

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
