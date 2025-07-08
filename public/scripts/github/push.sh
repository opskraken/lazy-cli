#!/bin/bash

echo "📦 Staging changes..."
if ! git add .; then
  echo "❌ Failed to stage changes. Are you in a git repo?"
  exit 1
fi

read -p "🔤 Enter commit message: " msg
if [[ -z "$msg" ]]; then
  echo "⚠️ Commit message cannot be empty."
  exit 1
fi

echo "📝 Committing changes..."
if ! git commit -m "$msg"; then
  echo "❌ Commit failed. Nothing to commit or error occurred."
  exit 1
fi

# Detect current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

if [[ -z "$BRANCH" ]]; then
  echo "❌ Could not detect branch. Is this a git repository?"
  exit 1
fi

echo "🚀 Pushing to origin/$BRANCH..."
if ! git push origin "$BRANCH"; then
  echo "❌ Push failed. Please check your network or branch."
  exit 1
fi

echo "✅ All done! 🎉 Changes pushed to origin/$BRANCH"
