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

  msg="$1"
  if [[ -z "$msg" ]]; then
    echo "⚠️ Commit message is required. Example:"
    echo "   lazy github push \"Your message here\""
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

github_clone() {
  repo="$1"
  tech="$2"

  if [[ -z "$repo" ]]; then
    echo "❌ Repo URL is required."
    echo "👉 Usage: lazy github clone <repo-url> [tech]"
    exit 1
  fi

  echo "🔗 Cloning $repo ..."
  git clone "$repo" || { echo "❌ Clone failed."; exit 1; }

  dir_name=$(basename "$repo" .git)
  cd "$dir_name" || exit 1

  echo "📁 Entered directory: $dir_name"

  if [[ -f package.json ]]; then
    echo "📦 Installing dependencies..."

    if command -v npm &> /dev/null; then
      echo "🔧 Using npm..."
      npm install
    elif command -v yarn &> /dev/null; then
      echo "🔧 Using yarn..."
      yarn
    elif command -v pnpm &> /dev/null; then
      echo "🔧 Using pnpm..."
      pnpm install
    elif command -v bun &> /dev/null; then
      echo "🔧 Using bun..."
      bun install
    else
      echo "⚠️ No supported package manager found. Please install manually."
    fi

    # Start the project only if a start script exists
    if grep -q '"start"' package.json; then
      echo "▶️ Starting the project..."
      npm start
    fi
  else
    echo "⚠️ No package.json found; skipping dependency installation."
  fi

  if command -v code &> /dev/null; then
    echo "🚀 Opening project in VS Code..."
    code .
  else
    echo "💡 VS Code not found. You can manually open the project folder."
  fi

  echo "✅ Clone setup complete!"
}

github_pull_request() {
  BASE_BRANCH="$1"
  COMMIT_MSG="$2"
  TECH="$3"

  if [[ -z "$BASE_BRANCH" || -z "$COMMIT_MSG" ]]; then
    echo "❌ Usage: lazy github pull <base-branch> \"<commit-message>\" [tech]"
    exit 1
  fi

  # Detect current branch
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [[ -z "$CURRENT_BRANCH" ]]; then
    echo "❌ Not in a git repo."
    exit 1
  fi

  echo "📥 Pulling latest from $BASE_BRANCH..."
  git pull origin "$BASE_BRANCH" || { echo "❌ Pull failed"; exit 1; }

  # Install dependencies based on package manager
  if [[ -f package.json ]]; then
    echo "📦 Installing dependencies..."
    if command -v npm &> /dev/null; then
      echo "🔧 Using npm..."
      npm install
    elif command -v yarn &> /dev/null; then
      echo "🔧 Using yarn..."
      yarn
    elif command -v pnpm &> /dev/null; then
      echo "🔧 Using pnpm..."
      pnpm install
    elif command -v bun &> /dev/null; then
      echo "🔧 Using bun..."
      bun install
    else
      echo "⚠️ No supported package manager found."
    fi
  else
    echo "⚠️ No package.json found. Skipping install step."
  fi

  # Stage and commit
  echo "📦 Staging changes..."
  git add .

  echo "📝 Committing with message: $COMMIT_MSG"
  git commit -m "$COMMIT_MSG" || echo "⚠️ Nothing to commit"

  echo "🚀 Pushing to origin/$CURRENT_BRANCH"
  git push origin "$CURRENT_BRANCH" || { echo "❌ Push failed"; exit 1; }

  # Create PR with GitHub CLI
  if command -v gh &> /dev/null; then
    echo "🔁 Creating pull request from $CURRENT_BRANCH → $BASE_BRANCH"
    gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$COMMIT_MSG" --body "$COMMIT_MSG"
  else
    echo "⚠️ GitHub CLI (gh) not installed. Skipping PR creation."
    echo "👉 Install: https://cli.github.com/"
  fi

  echo "✅ Pull request flow completed."
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
  echo "🛠️ Creating Vite app for you..."
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
       github_push "$3"
        ;;
      clone)
        github_clone "$3" "$4"
        ;;
      pull)
        github_pull_request "$3" "$4" "$5"
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
