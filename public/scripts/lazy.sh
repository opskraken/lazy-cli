#!/bin/bash

VERSION="1.0.1"

show_help() {
  cat << EOF
LazyCLI – Automate your dev flow like a lazy pro 💤

Usage:
  lazy [command] [subcommand]

Examples:
  lazy github push         Push your code to GitHub
  lazy github clone        Clone a GitHub repo and setup project
  lazy node-js init        Init a Node.js project
  lazy --version           Show version
  lazy --help              Show help

Available Commands:
  github        Git operations (push, clone)
  node-js       Node.js project setup
  next-js       Next.js project creation
  vite-js       Vite project generation

EOF
}

github_push() {
  echo "📦 Staging changes..."
  git add .

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

  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  if [[ -z "$BRANCH" ]]; then
    echo "❌ Could not detect branch. Are you in a git repo?"
    exit 1
  fi

  echo "🚀 Pushing to origin/$BRANCH..."
  if ! git push origin "$BRANCH"; then
    echo "❌ Push failed. Please check your network or branch."
    exit 1
  fi

  echo "✅ Changes pushed to origin/$BRANCH 🎉"
}

github_clone() {
  read -p "🔗 Enter GitHub repo URL to clone: " repo
  if [[ -z "$repo" ]]; then
    echo "❌ Repo URL cannot be empty."
    exit 1
  fi

  git clone "$repo" || { echo "❌ Clone failed."; exit 1; }
  dir_name=$(basename "$repo" .git)
  cd "$dir_name" || exit 1

  # Auto detect package manager and install
  if [[ -f package.json ]]; then
    if command -v npm &> /dev/null; then
      echo "📦 Installing npm packages..."
      npm install
    elif command -v yarn &> /dev/null; then
      echo "📦 Installing yarn packages..."
      yarn
    else
      echo "⚠️ Neither npm nor yarn found. Please install dependencies manually."
    fi

    # Try to start project if scripts.start exists
    if grep -q '"start"' package.json; then
      echo "▶️ Starting project..."
      npm start
    fi
  else
    echo "⚠️ No package.json found; skipping install/start steps."
  fi
}

node_js_init() {
  echo "🛠️ Initializing Node.js project..."
  npm init -y
}

next_js_create() {
  echo "🛠️ Creating Next.js app..."
  npx create-next-app@latest
}

vite_js_create() {
  echo "🛠️ Creating Vite app..."
  npm create vite@latest
}

# Main CLI router
case "$1" in
  --help | help )
    show_help
    ;;
  --version | -v )
    echo "LazyCLI v$VERSION"
    ;;
  github )
    case "$2" in
      push)
        github_push
        ;;
      clone)
        github_clone
        ;;
      *)
        echo "❌ Unknown github subcommand: $2"
        show_help
        exit 1
        ;;
    esac
    ;;
  node-js )
    case "$2" in
      init)
        node_js_init
        ;;
      *)
        echo "❌ Unknown node-js subcommand: $2"
        show_help
        exit 1
        ;;
    esac
    ;;
  next-js )
    case "$2" in
      create)
        next_js_create
        ;;
      *)
        echo "❌ Unknown next-js subcommand: $2"
        show_help
        exit 1
        ;;
    esac
    ;;
  vite-js )
    case "$2" in
      create)
        vite_js_create
        ;;
      *)
        echo "❌ Unknown vite-js subcommand: $2"
        show_help
        exit 1
        ;;
    esac
    ;;
  *)
    echo "❌ Unknown command: $1"
    show_help
    exit 1
    ;;
esac
