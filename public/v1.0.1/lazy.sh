#!/bin/bash

# LazyCLI - A command-line tool to automate development workflows
# Version information
VERSION="1.0.1"

# Display help information with usage examples and available commands
show_help() {
  cat << EOF
LazyCLI – Automate your dev flow like a lazy pro 💤

Usage:
  lazy [command] [subcommand] [options]

Examples:
  lazy github init
      Initialize a new Git repository in the current directory.

  lazy github clone <repo-url>
      Clone a GitHub repository and auto-detect the tech stack for setup.

  lazy github push "<commit-message>"
      Stage all changes, commit with the given message, and push to the current branch.

  lazy github pr <base-branch> "<commit-message>"
      Pull latest changes from the base branch, install dependencies, commit local changes,
      push to current branch, and create a GitHub pull request.

  lazy node-js init
      Initialize a Node.js project with basic setup.

  lazy next-js create
      Scaffold a new Next.js application with recommended defaults.

  lazy vite-js create
      Create a new Vite project with framework selection.

  lazy --version | -v
      Show current LazyCLI version.

  lazy --help | help
      Show this help message.

Available Commands:

  github        Manage GitHub repositories:
                - init       Initialize a new Git repo
                - clone      Clone a repo and optionally setup project
                - push       Commit and push changes with message
                - pr         Pull latest, build, commit, push, and create pull request

  node-js       Setup Node.js projects:
                - init       Initialize Node.js project with basic setup

  next-js       Next.js project scaffolding:
                - create     Create Next.js app with TypeScript, Tailwind, ESLint defaults

  vite-js       Vite project scaffolding:
                - create     Create a Vite project with framework selection

For more details on each command, run:
  lazy [command] --help

EOF
}

# Detect which package manager is available on the system
# Priority order: bun > pnpm > yarn > npm
# Sets the global PKG_MANAGER variable for use throughout the script
detect_package_manager() {
  if command -v bun >/dev/null 2>&1; then
    PKG_MANAGER="bun"
  elif command -v pnpm >/dev/null 2>&1; then
    PKG_MANAGER="pnpm"
  elif command -v yarn >/dev/null 2>&1; then
    PKG_MANAGER="yarn"
  elif command -v npm >/dev/null 2>&1; then
    PKG_MANAGER="npm"
  else
    echo "❌ No supported package manager found (bun, pnpm, yarn, npm). Please install one."
    exit 1
  fi

  echo "📦 Using package manager: $PKG_MANAGER"
}

# Initialize a new Git repository in the current directory
# Checks if .git directory already exists to avoid conflicts
github_init() {
  echo "🛠️ Initializing new Git repository..."

  if [ -d ".git" ]; then
    echo "⚠️ Git repository already initialized in this directory."
    return 1
  fi

  git init && echo "✅ Git repository initialized successfully!" || {
    echo "❌ Git initialization failed."
    return 1
  }
}

# Clone a GitHub repository and automatically set up the project
# Detects project type, installs dependencies, and optionally opens in VS Code
# Args: $1 = repository URL, $2 = tech stack (optional)
github_clone() {
  local repo="$1"
  local tech="$2"

  if [[ -z "$repo" ]]; then
    echo "❌ Repo URL is required."
    echo "👉 Usage: lazy github clone <repo-url> [tech]"
    return 1
  fi

  echo "🔗 Cloning $repo ..."
  git clone "$repo" || {
    echo "❌ Clone failed."
    return 1
  }

  local dir_name
  dir_name=$(basename "$repo" .git)
  cd "$dir_name" || {
    echo "❌ Failed to enter directory $dir_name"
    return 1
  }

  echo "📁 Entered directory: $dir_name"

  if [[ -f package.json ]]; then
    echo "📦 Installing dependencies..."

    detect_package_manager

    if [[ -z "$PKG_MANAGER" ]]; then
      echo "⚠️ No supported package manager found. Please install dependencies manually."
    else
      echo "🔧 Using $PKG_MANAGER..."
      $PKG_MANAGER install || {
        echo "❌ Dependency installation failed."
        return 1
      }
    fi

    # Check for build script
    if grep -q '"build"' package.json; then
      echo "🏗️ Build script found. Building the project..."
      $PKG_MANAGER run build || {
        echo "❌ Build failed."
        return 1
      }
    else
      echo "ℹ️ No build script found; skipping build."
    fi
  else
    echo "⚠️ No package.json found; skipping dependency install & build."
  fi

  if command -v code &> /dev/null; then
    echo "🚀 Opening project in VS Code..."
    code .
  else
    echo "💡 VS Code not found. You can manually open the project folder."
  fi

  echo "✅ Clone setup complete! Don't forget to commit and push your changes."
}

# Stage all changes, commit with provided message, and push to current branch
# Args: $1 = commit message
github_push() {
  echo "📦 Staging changes..."
  git add .

  local msg="$1"
  if [[ -z "$msg" ]]; then
    echo "⚠️ Commit message is required. Example:"
    echo "   lazy github push \"Your message here\""
    return 1
  fi

  echo "📝 Committing changes..."
  if ! git commit -m "$msg"; then
    echo "❌ Commit failed. Nothing to commit or an error occurred."
    return 1
  fi

  local BRANCH
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  if [[ -z "$BRANCH" ]]; then
    echo "❌ Could not detect current branch. Are you inside a git repository?"
    return 1
  fi

  echo "🚀 Pushing to origin/$BRANCH..."
  if ! git push origin "$BRANCH"; then
    echo "❌ Push failed. Please check your network or branch settings."
    return 1
  fi

  echo "✅ Changes pushed to origin/$BRANCH 🎉"
}

# Create a pull request workflow: pull latest changes, install dependencies, commit, push, and create PR
# Simplified version for v1.0.1 - basic functionality without advanced project detection
# Args: $1 = base branch, $2 = commit message
github_create_pr() {
  local BASE_BRANCH="$1"
  local COMMIT_MSG="$2"

  if [[ -z "$BASE_BRANCH" || -z "$COMMIT_MSG" ]]; then
    echo "❌ Usage: lazy github pr <base-branch> \"<commit-message>\""
    return 1
  fi

  # Detect current branch
  local CURRENT_BRANCH
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [[ -z "$CURRENT_BRANCH" ]]; then
    echo "❌ Not inside a git repository."
    return 1
  fi

  echo "📥 Pulling latest changes from $BASE_BRANCH..."
  if ! git pull origin "$BASE_BRANCH"; then
    echo "❌ Pull failed."
    return 1
  fi

  # Basic Node.js project handling
  if [[ -f "package.json" ]]; then
    echo "📦 Installing Node.js dependencies..."
    detect_package_manager
    if [[ -z "$PKG_MANAGER" ]]; then
      echo "⚠️ No supported package manager found."
    else
      echo "🔧 Using $PKG_MANAGER..."
      $PKG_MANAGER install
      if ! $PKG_MANAGER run build; then
        echo "⚠️ Build script failed or not found."
      fi
    fi
  fi

  echo "📦 Staging changes..."
  git add .

  echo "📝 Committing with message: $COMMIT_MSG"
  if ! git commit -m "$COMMIT_MSG"; then
    echo "⚠️ Nothing to commit."
  fi

  echo "🚀 Pushing changes to origin/$CURRENT_BRANCH..."
  if ! git push origin "$CURRENT_BRANCH"; then
    echo "❌ Push failed."
    return 1
  fi

  echo "✅ Pull request workflow completed successfully."
}

# Initialize a Node.js project with basic setup
# Simplified version for v1.0.1 - basic package manager detection and init
node_js_init() {
  detect_package_manager
  local pkg_manager="$PKG_MANAGER"

  if [ -z "$pkg_manager" ]; then
    echo "❌ No supported package manager found. Please install bun, pnpm, yarn, or npm."
    return 1
  fi

  echo "🛠️ Initializing Node.js project using $pkg_manager..."
  $pkg_manager init -y 2>/dev/null || echo "🔧 Skipping init, not supported by $pkg_manager"

  echo "✅ Node.js project initialized successfully!"
}

# Create a new Next.js application with basic setup
# Simplified version for v1.0.1 - uses create-next-app with minimal configuration
next_js_create() {
  echo "🛠️ Creating Next.js app..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

  echo "🚀 Creating Next.js project with TypeScript, Tailwind, and ESLint..."
  npx create-next-app@latest "$project_name" --typescript --tailwind --eslint --app --yes

  if [ $? -eq 0 ]; then
    echo "✅ Next.js project '$project_name' created successfully!"
    echo "📁 Navigate to your project: cd $project_name"
    echo "🚀 Start development: npm run dev"
  else
    echo "❌ Failed to create Next.js project."
  fi
}

# Create a new Vite project with framework selection
# Simplified version for v1.0.1 - uses create-vite with basic setup
vite_js_create() {
  echo "🛠️ Creating Vite project..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

  echo "🎯 Available frameworks:"
  echo "1) React"
  echo "2) Vue"
  echo "3) Svelte"
  echo "4) Vanilla JS"
  read -p "Choose framework (1-4): " framework_choice

  case "$framework_choice" in
    1) template="react-ts" ;;
    2) template="vue-ts" ;;
    3) template="svelte-ts" ;;
    4) template="vanilla-ts" ;;
    *) echo "❌ Invalid choice. Using React as default."; template="react-ts" ;;
  esac

  echo "🚀 Creating Vite project with $template..."
  npm create vite@latest "$project_name" -- --template "$template"

  if [ $? -eq 0 ]; then
    echo "✅ Vite project '$project_name' created successfully!"
    echo "📁 Navigate to your project: cd $project_name"
    echo "📦 Install dependencies: npm install"
    echo "🚀 Start development: npm run dev"
  else
    echo "❌ Failed to create Vite project."
  fi
}

# Main CLI router
case "$1" in
  --help | help )
    show_help
    ;;
  --version | -v )
    echo "LazyCLI v$VERSION"
    ;;
  upgrade )
    echo "🔄 Upgrading LazyCLI..."

    # Remove old version
    rm -f "$HOME/.lazycli/lazy"

    # Download new version
    curl -s https://lazycli.vercel.app/scripts/lazy.sh -o "$HOME/.lazycli/lazy"
    chmod +x "$HOME/.lazycli/lazy"

    echo "✅ LazyCLI upgraded to latest version!"
    exit 0
    ;;
  github )
    case "$2" in
      init)
        github_init
        ;;
      clone)
        github_clone "$3" "$4"
        ;;
      push)
        github_push "$3"
        ;;
      pr)
        github_create_pr "$3" "$4"
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