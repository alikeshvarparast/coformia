# Coformia (Docker)

Static site + contact API on loopback **8102**. Public via CountIn tunnel (`coformia.sspi.trade`) or point **coformia.com** origin to this host.

## Run

```bash
cd /opt/docker/coformia
cp .env.example .env   # fill TURNSTILE_SECRET + Resend or SMTP
docker compose up -d --build
curl -sS http://127.0.0.1:8102/api/health
```

## Email

Set **one** of:

- `RESEND_API_KEY` — Resend, domain `coformia.com` verified
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — e.g. Gmail app password

`MAIL_TO=info@coformia.com` (Cloudflare Email Routing → Gmail inbox).

## Turnstile

Site key is in HTML (`0x4AAAAAAFFvq98oyGzG7UCt`). Copy matching **secret** from Cloudflare Turnstile dashboard into `TURNSTILE_SECRET` (same value as Worker secret if still deployed).

## Leave Cloudflare Workers

In Cloudflare: remove or disable **keshvarco** Worker routes for `coformia.com` / aliases, then point DNS to this server (tunnel or A record). Until then, production HTML may still come from Workers.

## Auto-deploy (GitHub push)

Push to `main` on `alikeshvarparast/coformia` triggers a rebuild on this host via the shared CountIn webhook receiver.

1. Secrets live in `/opt/docker/countin/.env.webhook` (`COFORMIA_WEBHOOK_SECRET`, etc.).
2. Public URL: `https://coformia.com/hooks/github` (nginx on `:8102` → webhook `:8096`).
3. Register or refresh the hook (needs `gh auth refresh -h github.com -s admin:repo_hook` once):

```bash
/opt/docker/coformia/scripts/register-github-webhook.sh
```

Manual rebuild: `/opt/docker/coformia/scripts/rebuild-from-github.sh`

## Preview stack

`preview/docker-compose.yml` is superseded by root `docker-compose.yml` (same port 8102).
