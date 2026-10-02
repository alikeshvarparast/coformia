#!/usr/bin/env python3
"""Remove coformia.sspi.trade hostnames from countin tunnel ingress."""
import json
import subprocess
import sys

env = {}
with open("/opt/docker/hmanager/deploy/.env") as f:
    for line in f:
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, v = line.split("=", 1)
        env[k] = v.strip().strip('"')

email = env["CLOUDFLARE_EMAIL"]
key = env["CLOUDFLARE_API_KEY"]
acct = "e81d626d6adc8a294f5c1212c4ed3640"
tunnel = "52caf738-0cd0-466f-94b2-79046410d1ca"
drop = {"coformia.sspi.trade", "preview-coformia.sspi.trade"}
headers = ["-H", f"X-Auth-Email: {email}", "-H", f"X-Auth-Key: {key}"]


def curl(url, method="GET", data=None):
    cmd = ["curl", "-sS", *headers, "-X", method, url]
    if data is not None:
        cmd += ["-H", "Content-Type: application/json", "--data", json.dumps(data)]
    return json.loads(subprocess.check_output(cmd, text=True))


cfg = curl(f"https://api.cloudflare.com/client/v4/accounts/{acct}/cfd_tunnel/{tunnel}/configurations")
ingress = cfg["result"]["config"]["ingress"]
new_ingress = [r for r in ingress if r.get("hostname") not in drop]
if len(new_ingress) == len(ingress):
    print("no coformia sspi hostnames in ingress")
    sys.exit(0)
if new_ingress[-1].get("service") != "http_status:404":
    catch = new_ingress.pop()
    new_ingress.append(catch)
put = curl(
    f"https://api.cloudflare.com/client/v4/accounts/{acct}/cfd_tunnel/{tunnel}/configurations",
    "PUT",
    {
        "config": {
            "ingress": new_ingress,
            "warp-routing": cfg["result"]["config"].get("warp-routing", {"enabled": False}),
        }
    },
)
if not put.get("success"):
    print("tunnel update failed", put.get("errors"), file=sys.stderr)
    sys.exit(1)
print("removed from countin tunnel:", ", ".join(sorted(drop)))
