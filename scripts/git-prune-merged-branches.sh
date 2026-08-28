#!/usr/bin/env bash
set -euo pipefail

# Delete merged local task branches for this repository only.
# Safe defaults: `git branch -d` (never force), skip protected branches,
# only branches matching cursor/* that are merged into main.

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${repo_root}" ]]; then
  exit 0
fi

cd "${repo_root}"

origin_url="$(git remote get-url origin 2>/dev/null || true)"
if [[ "${origin_url}" != *"personal-learning-platform"* ]]; then
  exit 0
fi

if ! git show-ref --verify --quiet refs/heads/main; then
  exit 0
fi

git fetch origin main --prune >/dev/null 2>&1 || true

current_branch="$(git branch --show-current)"
protected_pattern='^(main|master|develop)$'

while IFS= read -r branch; do
  [[ -z "${branch}" ]] && continue
  [[ "${branch}" == "${current_branch}" ]] && continue
  [[ "${branch}" =~ ${protected_pattern} ]] && continue
  [[ "${branch}" != cursor/* ]] && continue

  if git branch --merged main | sed 's/^[* ] //' | grep -Fxq "${branch}"; then
    git branch -d "${branch}" >/dev/null 2>&1 || true
  fi
done < <(git for-each-ref --format='%(refname:short)' refs/heads/)
