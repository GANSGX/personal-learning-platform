#!/usr/bin/env bash
# Apply branch protection on main (issue #2).
# Requires repo admin: the Cursor agent token cannot do this (403).
# Run as the repo owner: ./scripts/protect-main.sh
set -euo pipefail

REPO="${REPO:-GANSGX/personal-learning-platform}"
BRANCH="${BRANCH:-main}"

# Job `name:` values from .github/workflows/ci.yml — required status check contexts.
REQUIRED_CHECKS='["Quality","Unit tests","Build","E2E and a11y"]'

echo "Protecting ${REPO}@${BRANCH} ..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO}/branches/${BRANCH}/protection" \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ${REQUIRED_CHECKS}
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": false,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 0
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF

echo
echo "OK. Verifying ..."
gh api \
  -H "Accept: application/vnd.github+json" \
  "/repos/${REPO}/branches/${BRANCH}/protection" \
  --jq '{
    enforce_admins: .enforce_admins.enabled,
    allow_force_pushes: .allow_force_pushes.enabled,
    allow_deletions: .allow_deletions.enabled,
    required_reviews: .required_pull_request_reviews.required_approving_review_count,
    contexts: .required_status_checks.contexts
  }'

echo
echo "Acceptance:"
echo "  - git push origin ${BRANCH} should be rejected"
echo "  - PR merge blocked until Quality, Unit tests, Build, E2E and a11y are green"
echo "  - required reviews stay at 0 (solo repo)"
