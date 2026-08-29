#!/bin/bash
set -e

echo "🤖 PR Agent: Starting workflow..."

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "📦 Stashing uncommitted changes..."
  git stash push -m "pr-agent-stash"
  STASHED=true
else
  STASHED=false
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "🔄 Updating main branch..."
git checkout main
git pull origin main

if [ "$CURRENT_BRANCH" = "main" ]; then
  if [ "$STASHED" = true ]; then
    echo "🌿 Please enter a branch name for your changes (e.g., feature/add-login):"
    read -r NEW_BRANCH
    git checkout -b "$NEW_BRANCH"
    echo "📦 Popping stashed changes..."
    git stash pop
    echo "💾 Please commit your changes, then run this script again."
    exit 0
  else
    echo "✅ No changes to create a PR for."
    exit 0
  fi
else
  git checkout "$CURRENT_BRANCH"
fi

# Check branch naming convention
if [[ ! "$CURRENT_BRANCH" =~ ^(feature|bugfix|fix|architecture|tech-debt|chore|docs)/ ]]; then
  echo "⚠️ Branch name '$CURRENT_BRANCH' does not follow conventions."
  echo "Please enter a new branch name (starting with feature/, bugfix/, etc.):"
  read -r NEW_BRANCH
  git branch -m "$NEW_BRANCH"
  CURRENT_BRANCH=$NEW_BRANCH
  echo "✅ Branch renamed to $CURRENT_BRANCH"
fi

echo "🔀 Rebasing on latest main..."
git rebase main

echo "🚀 Pushing branch to remote..."
git push -u origin HEAD

echo "📬 Attempting to create PR..."
if command -v gh &> /dev/null; then
  gh pr create --fill || echo "⚠️ Could not automatically create PR with gh cli. Please use the link above."
else
  echo "⚠️ 'gh' CLI not found. Please click the link in the git push output to create your PR."
fi

echo "✅ PR Agent workflow complete!"
