#!/usr/bin/env python3
"""Strip Worker custom-domain routes so tunnel DNS can attach (wrangler deploy)."""
import subprocess
import sys

TOML = "/opt/docker/coformia/wrangler.toml"
MARKER = "# Production traffic: cloudflared-coformia tunnel → Docker :8102\n# (custom_domain routes removed — do not re-add without removing tunnel DNS.)\n"


def main() -> None:
    text = open(TOML).read()
    if MARKER in text:
        print("wrangler.toml already stripped")
    else:
        head, _, tail = text.partition("[[routes]]")
        if not head:
            print("no routes in wrangler.toml", file=sys.stderr)
            sys.exit(1)
        open(TOML, "w").write(head.rstrip() + "\n\n" + MARKER)
        print("removed [[routes]] blocks from wrangler.toml")

    cmd = [
        "docker",
        "run",
        "--rm",
        "-v",
        "/opt/docker/coformia:/w",
        "-w",
        "/w",
        "--env-file",
        "/opt/docker/hmanager/deploy/.env",
        "node:22-alpine",
        "sh",
        "-c",
        "npm exec wrangler deploy 2>&1",
    ]
    out = subprocess.check_output(cmd, text=True)
    print(out[-4000:] if len(out) > 4000 else out)


if __name__ == "__main__":
    main()
