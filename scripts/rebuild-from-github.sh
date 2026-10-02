#!/usr/bin/env bash
# Pull latest main from GitHub and rebuild Coformia if SHA changed.
set -euo pipefail

REPO_DIR="/opt/docker/coformia"
BRANCH="${COFORMIA_BRANCH:-main}"
LOCK="/var/lock/coformia-rebuild.lock"
DEPLOYED_SHA_FILE="${REPO_DIR}/.deployed-sha"
LOG_TAG="coformia-rebuild"

log() { echo "[${LOG_TAG}] $*" >&2; }

exec 9>"$LOCK"
if ! flock -n 9; then
  log "another rebuild in progress; skip"
  exit 0
fi

cd "$REPO_DIR"

git fetch --quiet origin "$BRANCH"
remote_sha="$(git rev-parse "origin/${BRANCH}")"
head_sha="$(git rev-parse HEAD)"

if [[ "$head_sha" != "$remote_sha" ]]; then
  log "syncing ${head_sha:0:12} → ${remote_sha:0:12} (origin/${BRANCH})"
  git checkout --quiet "$BRANCH"
  git reset --hard "origin/${BRANCH}"
  head_sha="$remote_sha"
fi
deployed_sha=""
if [[ -f "$DEPLOYED_SHA_FILE" ]]; then
  deployed_sha="$(tr -d '[:space:]' < "$DEPLOYED_SHA_FILE")"
fi

if [[ "${FORCE_REBUILD:-0}" != "1" && "$deployed_sha" == "$head_sha" ]]; then
  log "already deployed ${head_sha:0:12}; nothing to do"
  exit 0
fi

if [[ -n "$deployed_sha" && "$deployed_sha" != "$head_sha" ]]; then
  log "deploying ${deployed_sha:0:12} → ${head_sha:0:12}"
elif [[ "${FORCE_REBUILD:-0}" == "1" ]]; then
  log "forcing rebuild at ${head_sha:0:12}"
else
  log "first deploy at ${head_sha:0:12}"
fi

log "building api image (static site is bind-mounted)"
docker compose build api

log "recreating containers"
docker compose up -d --force-recreate

printf '%s\n' "$head_sha" > "$DEPLOYED_SHA_FILE"
log "done at $(git rev-parse --short HEAD)"
