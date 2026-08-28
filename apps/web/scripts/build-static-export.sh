#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

PROXY_PATH="src/proxy.ts"
PROXY_BACKUP="src/proxy.ts.build-static-backup"

restore_proxy() {
  if [[ -f "$PROXY_BACKUP" ]]; then
    mv "$PROXY_BACKUP" "$PROXY_PATH"
  fi
}

if [[ -f "$PROXY_PATH" ]]; then
  mv "$PROXY_PATH" "$PROXY_BACKUP"
  trap restore_proxy EXIT
fi

NEXT_STATIC_EXPORT=true pnpm build
