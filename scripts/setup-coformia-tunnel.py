#!/usr/bin/env python3
"""Point coformia.com (+ keshvarco) at Docker :8102 via Cloudflare Tunnel; drop Worker custom domains."""
from __future__ import annotations

import base64
import json
import os
import subprocess
import sys

ACCT = "c9b3025345ef1b86b3662d4c80b1a27e"
ZONE_COFORMIA = "a7800345a29a29e47021f2ae1a384c2d"
ZONE_KESHVARCO = "7ef6e3d549bc0997792f237d504c9b4f"
TUNNEL_NAME = "coformia"
ORIGIN = "http://127.0.0.1:8102"
HOSTS = (
    "coformia.com",
    "www.coformia.com",
    "keshvarco.com",
    "www.keshvarco.com",
)
WORKER_DOMAIN_IDS = (
    "f6fa680c124038e35c32318d2a520e9ed20cc98b",
    "200031f01fd31ca15ebce859e6421e146a67beba",
    "944b6c0929e820c086955ab72585928977860bb6",
    "607fc47ff27e1e4a57b4bec708213225fbc0a920",
)
ENV_OUT = "/opt/docker/cloudflared-coformia/.env"
CF_ENV = "/opt/docker/hmanager/deploy/.env"


def load_cf_creds() -> tuple[str, str]:
    env: dict[str, str] = {}
    with open(CF_ENV) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k] = v.strip().strip('"')
    return env["CLOUDFLARE_EMAIL"], env["CLOUDFLARE_API_KEY"]


def curl(email: str, key: str, url: str, method: str = "GET", data: dict | None = None) -> dict:
    cmd = [
        "curl",
        "-sS",
        "-X",
        method,
        "-H",
        f"X-Auth-Email: {email}",
        "-H",
        f"X-Auth-Key: {key}",
        url,
    ]
    if data is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(data)]
    out = subprocess.check_output(cmd, text=True)
    return json.loads(out)


def ensure_tunnel(email: str, key: str) -> str:
    listed = curl(email, key, f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/cfd_tunnel")
    for t in listed.get("result") or []:
        if t.get("name") == TUNNEL_NAME and not t.get("deleted_at"):
            print("tunnel exists", t["id"])
            return t["id"]
    secret = base64.b64encode(os.urandom(32)).decode()
    created = curl(
        email,
        key,
        f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/cfd_tunnel",
        "POST",
        {"name": TUNNEL_NAME, "tunnel_secret": secret},
    )
    if not created.get("success"):
        print("create tunnel failed", created.get("errors"), file=sys.stderr)
        sys.exit(1)
    tid = created["result"]["id"]
    print("created tunnel", tid)
    return tid


def put_ingress(email: str, key: str, tunnel_id: str) -> None:
    ingress = [{"hostname": h, "service": ORIGIN, "originRequest": {}} for h in HOSTS]
    ingress.append({"service": "http_status:404"})
    put = curl(
        email,
        key,
        f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/cfd_tunnel/{tunnel_id}/configurations",
        "PUT",
        {"config": {"ingress": ingress, "warp-routing": {"enabled": False}}},
    )
    if not put.get("success"):
        print("ingress update failed", put.get("errors"), file=sys.stderr)
        sys.exit(1)
    print("ingress updated for", ", ".join(HOSTS))


def tunnel_token(email: str, key: str, tunnel_id: str) -> str:
    tok = curl(
        email,
        key,
        f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/cfd_tunnel/{tunnel_id}/token",
    )
    if not tok.get("success"):
        print("token failed", tok.get("errors"), file=sys.stderr)
        sys.exit(1)
    return tok["result"]


def upsert_cname(email: str, key: str, zone_id: str, name: str, tunnel_id: str) -> None:
    target = f"{tunnel_id}.cfargotunnel.com"
    q = curl(
        email,
        key,
        f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records?name={name}",
    )
    for rec in q.get("result") or []:
        if rec["type"] in ("AAAA", "A", "CNAME") and rec["name"] == name:
            if rec["type"] == "CNAME" and rec["content"] == target and rec.get("proxied"):
                print("dns ok", name)
                return
            curl(
                email,
                key,
                f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{rec['id']}",
                "DELETE",
            )
            print("deleted old dns", name, rec["type"])
    create = curl(
        email,
        key,
        f"https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records",
        "POST",
        {"type": "CNAME", "name": name, "content": target, "proxied": True, "ttl": 1},
    )
    if not create.get("success"):
        print("dns create failed", name, create.get("errors"), file=sys.stderr)
        sys.exit(1)
    print("dns CNAME", name, "->", target)


def delete_worker_domains(email: str, key: str) -> None:
    """Best-effort; detach via wrangler deploy (no [[routes]]) is the reliable path."""
    for did in WORKER_DOMAIN_IDS:
        resp = curl(
            email,
            key,
            f"https://api.cloudflare.com/client/v4/accounts/{ACCT}/workers/domains/{did}",
            "DELETE",
        )
        if resp.get("success"):
            print("removed worker domain", did)


def write_env(token: str) -> None:
    os.makedirs(os.path.dirname(ENV_OUT), exist_ok=True)
    with open(ENV_OUT, "w") as f:
        f.write(f"TUNNEL_TOKEN={token}\n")
    os.chmod(ENV_OUT, 0o600)
    print("wrote", ENV_OUT)


def main() -> None:
    email, key = load_cf_creds()
    tunnel_id = ensure_tunnel(email, key)
    put_ingress(email, key, tunnel_id)
    delete_worker_domains(email, key)
    upsert_cname(email, key, ZONE_COFORMIA, "coformia.com", tunnel_id)
    upsert_cname(email, key, ZONE_COFORMIA, "www.coformia.com", tunnel_id)
    upsert_cname(email, key, ZONE_KESHVARCO, "keshvarco.com", tunnel_id)
    upsert_cname(email, key, ZONE_KESHVARCO, "www.keshvarco.com", tunnel_id)
    write_env(tunnel_token(email, key, tunnel_id))


if __name__ == "__main__":
    main()
