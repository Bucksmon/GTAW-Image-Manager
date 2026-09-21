# GTAW Image Manager

Open-source Discord-based image management for GTAW players.

**Discord upload → secure API → image hosting → organized library → forum-ready links**

## Goals

- Upload screenshots directly through Discord.
- Store image metadata without storing image binaries in MongoDB.
- Support multiple image-hosting providers through an adapter layer.
- Generate BBCode, Markdown, HTML and direct links.
- Give each player a private, organized screenshot library.
- Keep production secrets out of the public repository.
- Make the project easy for the GTAW community to contribute to.

## Architecture

| Component | Technology | Intended deployment |
| --- | --- | --- |
| Frontend | React + Vite | GitHub Pages |
| API | Node.js + Express | Vercel |
| Bot | Discord.js | Persistent bot host |
| Database | MongoDB Atlas | Managed database |
| Image hosting | Provider adapters | Imgur + backups |

## Security

Never commit Discord bot tokens, OAuth secrets, MongoDB credentials, image-hosting secrets, or production environment files.

Use `.env.example` as the configuration template. Production credentials belong in the deployment environment, not Git.

## Local development

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env
```

Run the API, frontend, or bot:

```bash
npm run dev:backend
npm run dev:frontend
npm run dev:bot
```

## Roadmap

1. Project foundation
2. MongoDB user and image models
3. Discord image intake
4. Imgur upload provider
5. Provider failover system
6. Forum-code generator
7. Discord OAuth dashboard
8. Collections, tags and search
9. GitHub Pages + Vercel deployment
10. Community contribution workflow

## Contributing

Pull requests and issue reports are welcome. Keep secrets out of commits and use the environment template for local configuration.

## License

MIT — see [LICENSE](LICENSE).
