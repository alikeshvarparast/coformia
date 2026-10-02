#!/usr/bin/env bash
# Register GitHub push webhook for Coformia (requires gh with admin:repo_hook).
set -euo pipefail

REPO="${COFORMIA_GITHUB_REPO:-alikeshvarparast/coformia}"
HOOK_URL="${COFORMIA_WEBHOOK_URL:-https://coformia.com/hooks/github}"
ENV_FILE="${COFORMIA_WEBHOOK_ENV:-/opt/docker/countin/.env.webhook}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "missing $ENV_FILE" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${COFORMIA_WEBHOOK_SECRET:-}" ]]; then
  echo "COFORMIA_WEBHOOK_SECRET not set in $ENV_FILE" >&2
  exit 1
fi

payload="$(jq -n \
  --arg url "$HOOK_URL" \
  --arg secret "$COFORMIA_WEBHOOK_SECRET" \
  '{name: "web", active: true, events: ["push"], config: {url: $url, content_type: "json", insecure_ssl: "0", secret: $secret}}')"

if ! gh api "repos/${REPO}" --jq .id >/dev/null 2>&1; then
  echo "gh cannot access repos/${REPO}; run: gh auth refresh -h github.com -s admin:repo_hook" >&2
  exit 1
fi

existing="$(gh api "repos/${REPO}/hooks" --jq '.[] | select(.config.url == "'"$HOOK_URL"'") | .id' 2>/dev/null || true)"
if [[ -n "$existing" && "$existing" != *"Not Found"* ]]; then
  echo "updating hook id=$existing for $REPO → $HOOK_URL"
  gh api -X PATCH "repos/${REPO}/hooks/${existing}" --input - <<<"$payload"
else
  echo "creating hook for $REPO → $HOOK_URL"
  gh api -X POST "repos/${REPO}/hooks" --input - <<<"$payload"
fi

echo "done"
