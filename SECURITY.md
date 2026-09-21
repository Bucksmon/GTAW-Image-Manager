# Security Policy

## Reporting a vulnerability

Please do not publish credentials, tokens, database connection strings, or proof-of-concept exploitation details in a public issue.

For suspected security vulnerabilities, contact the repository maintainer privately through GitHub.

## Secret handling

Never commit Discord bot tokens, OAuth client secrets, MongoDB credentials, image-hosting secrets, or production environment files.

If a secret has been committed, treat it as compromised and rotate it immediately. Removing it from the latest commit is not sufficient because Git history may retain it.
