#!/usr/bin/env python3
"""Merge mail + Turnstile into coformia/.env (never prints secrets)."""
import json
import os
import urllib.request
from pathlib import Path

ROOT = Path("/opt/docker/coformia")
ENV = ROOT / ".env"
EXAMPLE = ROOT / ".env.example"
MAIL_TRIAGE = Path("/opt/docker/mail-triage/mail-triage.env")
SITEKEY = "0x4AAAAAAFFvq98oyGzG7UCt"
ACCOUNT_ID = "c9b3025345ef1b86b3662d4c80b1a27e"


def load_kv(path: Path) -> dict[str, str]:
    out: dict[str, str] = {}
    if not path.is_file():
        return out
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        out[k.strip()] = v.strip().strip('"')
    return out


def load_deploy_env() -> None:
    deploy = Path("/opt/docker/hmanager/deploy/.env")
    if not deploy.is_file():
        return
    for line in deploy.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        os.environ.setdefault(k.strip(), v.strip().strip('"'))


def fetch_turnstile_secret() -> str:
    load_deploy_env()
    email = os.environ.get("CLOUDFLARE_EMAIL")
    key = os.environ.get("CLOUDFLARE_API_KEY")
    if not email or not key:
        return ""
    url = f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/challenges/widgets/{SITEKEY}"
    req = urllib.request.Request(
        url,
        headers={"X-Auth-Email": email, "X-Auth-Key": key},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode())
    if not data.get("success"):
        return ""
    return str((data.get("result") or {}).get("secret") or "")


def main() -> None:
    base = load_kv(EXAMPLE)
    if ENV.is_file():
        base.update(load_kv(ENV))
    mt = load_kv(MAIL_TRIAGE)
    if not base.get("SMTP_PASS") and mt.get("GMAIL_2_APP_PASSWORD"):
        base["SMTP_HOST"] = "smtp.gmail.com"
        base["SMTP_PORT"] = "587"
        base["SMTP_SECURE"] = "false"
        base["SMTP_USER"] = mt.get("GMAIL_2_USER", "hoseinkhodabakhsh@gmail.com")
        base["SMTP_PASS"] = mt["GMAIL_2_APP_PASSWORD"]
        base.setdefault("MAIL_FROM", "Coformia website <info@coformia.com>")
    if not base.get("TURNSTILE_SECRET"):
        secret = fetch_turnstile_secret()
        if secret:
            base["TURNSTILE_SECRET"] = secret
    base.setdefault("MAIL_TO", "info@coformia.com")
    order = [
        "TURNSTILE_SECRET",
        "MAIL_TO",
        "MAIL_FROM",
        "RESEND_API_KEY",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_SECURE",
        "SMTP_USER",
        "SMTP_PASS",
    ]
    lines = []
    seen = set()
    for k in order:
        if k in base:
            lines.append(f"{k}={base[k]}")
            seen.add(k)
    for k, v in base.items():
        if k not in seen and v:
            lines.append(f"{k}={v}")
    ENV.write_text("\n".join(lines) + "\n", encoding="utf-8")
    has_mail = bool(base.get("RESEND_API_KEY") or base.get("SMTP_PASS"))
    has_ts = bool(base.get("TURNSTILE_SECRET"))
    print(f"wrote {ENV} mail={'ok' if has_mail else 'missing'} turnstile={'ok' if has_ts else 'missing'}")


if __name__ == "__main__":
    main()
