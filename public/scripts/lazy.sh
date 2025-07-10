#!/bin/bash

# LazyCLI - A command-line tool to automate development workflows
# Version information
VERSION="1.0.2"

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
      Initialize a Node.js project with init -y and optional boilerplate package installation.

  lazy next-js create
      Scaffold a new Next.js application with recommended defaults and optional packages.

  lazy vite-js create
      Create a new Vite project, select framework, and optionally install common packages.

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
                - init       Initialize Node.js project with optional boilerplate

  next-js       Next.js project scaffolding:
                - create     Create Next.js app with TypeScript, Tailwind, ESLint defaults

  vite-js       Vite project scaffolding:
                - create     Create a Vite project with framework selection and optional packages

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
# Automatically detects project type and runs appropriate build/install commands
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

  # Detect project type by checking for specific configuration files
  # Supports: Node.js, Python, Go, Java (Maven/Gradle)
  local PROJECT_TYPE="unknown"
  if [[ -f "package.json" ]]; then
    PROJECT_TYPE="node"
  elif [[ -f "pyproject.toml" || -f "requirements.txt" ]]; then
    PROJECT_TYPE="python"
  elif [[ -f "go.mod" ]]; then
    PROJECT_TYPE="go"
  elif [[ -f "pom.xml" || -f "build.gradle" || -f "build.gradle.kts" ]]; then
    PROJECT_TYPE="java"
  fi

  echo "🔍 Detected project type: $PROJECT_TYPE"

  # Execute project-specific dependency installation and build commands
  case "$PROJECT_TYPE" in
    node) # Node.js projects - install deps and run build
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
      ;;
    python) # Python projects - handle pip, poetry, or pipenv
      echo "📦 Installing Python dependencies..."
      if command -v pip &> /dev/null; then
        if [[ -f "requirements.txt" ]]; then
          pip install -r requirements.txt || echo "⚠️ pip install failed."
        elif [[ -f "pyproject.toml" ]]; then
          if command -v poetry &> /dev/null; then
            poetry install || echo "⚠️ poetry install failed."
          elif command -v pipenv &> /dev/null; then
            pipenv install || echo "⚠️ pipenv install failed."
          else
            echo "⚠️ No recognized Python package manager (poetry/pipenv) found."
          fi
        else
          echo "⚠️ No known Python dependency files found."
        fi
      else
        echo "⚠️ pip not installed."
      fi
      ;;
    go) # Go projects - tidy modules
      echo "📦 Tidying Go modules..."
      if command -v go &> /dev/null; then
        go mod tidy || echo "⚠️ go mod tidy failed."
      else
        echo "⚠️ Go not installed."
      fi
      ;;
    java) # Java projects - Maven or Gradle builds
      echo "📦 Building Java project..."
      if [[ -f "pom.xml" ]]; then
        if command -v mvn &> /dev/null; then
          mvn clean install || echo "⚠️ Maven build failed."
        else
          echo "⚠️ Maven not installed."
        fi
      elif [[ -f "build.gradle" || -f "build.gradle.kts" ]]; then
        if command -v gradle &> /dev/null; then
          gradle build || echo "⚠️ Gradle build failed."
        else
          echo "⚠️ Gradle not installed."
        fi
      else
        echo "⚠️ No recognized Java build files found."
      fi
      ;;
    *) # Handle unknown commands
      echo "⚠️ Dependency install & build not implemented for project type: $PROJECT_TYPE"
      ;;
  esac

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

  # Attempt to create pull request using GitHub CLI if installed
  if command -v gh &> /dev/null; then
    echo "🔁 Creating pull request: $CURRENT_BRANCH → $BASE_BRANCH"
    if ! gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$COMMIT_MSG" --body "$COMMIT_MSG"; then
      echo "❌ Pull request creation failed."
      return 1
    fi
  else
    echo "⚠️ GitHub CLI (gh) not installed. Skipping PR creation."
    echo "👉 Install it from https://cli.github.com/"
  fi

  echo "✅ Pull request workflow completed successfully."
}

# Initialize a Node.js project with interactive package selection
# Detects available package manager and prompts for common dependencies
# Supports: express, dotenv, nodemon, cors, zod
node_js_init() {
  detect_package_manager
  local pkg_manager="$PKG_MANAGER"

  if [ -z "$pkg_manager" ]; then
    echo "❌ No supported package manager found. Please install bun, pnpm, yarn, or npm."
    return 1
  fi

  echo "🛠️ Initializing Node.js project using $pkg_manager..."
  $pkg_manager init -y 2>/dev/null || echo "🔧 Skipping init, not supported by $pkg_manager"

  echo ""
  echo "🧠 LazyCLI Smart Stack Setup: Answer once and make yourself gloriously lazy"

  prompt_or_exit() {
    local prompt_text=$1
    local answer
    while true; do
      read -p "$prompt_text (1/0/-1): " answer
      case "$answer" in
        1|0|-1) echo "$answer"; return ;;
        *) echo "Please enter 1, 0, or -1." ;;
      esac
    done
  }

  ans_express=$(prompt_or_exit "➕ Install express?")
  [[ "$ans_express" == "-1" ]] && echo "⏹️ Setup exited." && return

  ans_dotenv=$(prompt_or_exit "🔐 Install dotenv?")
  [[ "$ans_dotenv" == "-1" ]] && echo "⏹️ Setup exited." && return

  ans_nodemon=$(prompt_or_exit "🌀 Install nodemon (dev)?")
  [[ "$ans_nodemon" == "-1" ]] && echo "⏹️ Setup exited." && return

  ans_cors=$(prompt_or_exit "🌐 Install cors?")
  [[ "$ans_cors" == "-1" ]] && echo "⏹️ Setup exited." && return

  ans_zod=$(prompt_or_exit "🧪 Install zod?")
  [[ "$ans_zod" == "-1" ]] && echo "⏹️ Setup exited." && return

  deps=""
  dev_deps=""

  [[ "$ans_express" == "1" ]] && deps="$deps express"
  [[ "$ans_dotenv" == "1" ]] && deps="$deps dotenv"
  [[ "$ans_cors" == "1" ]] && deps="$deps cors"
  [[ "$ans_zod" == "1" ]] && deps="$deps zod"
  [[ "$ans_nodemon" == "1" ]] && dev_deps="$dev_deps nodemon"

  if [[ -n "$deps" ]]; then
    echo "📦 Installing dependencies: $deps"
    if [[ "$pkg_manager" == "npm" ]]; then
      npm install $deps
    else
      $pkg_manager add $deps
    fi
  fi

  if [[ -n "$dev_deps" ]]; then
    echo "📦 Installing devDependencies: $dev_deps"
    if [[ "$pkg_manager" == "npm" ]]; then
      npm install -D $dev_deps
    else
      $pkg_manager add -D $dev_deps
    fi
  fi

  # Create a basic index.js if not exists
  if [[ ! -f index.js ]]; then
    echo "📝 Creating basic index.js file..."
    cat > index.js <<EOF
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

console.log("🚀 Welcome to your LazyCLI-powered Node.js server! 💤");

app.get('/', (req, res) => {
  res.send('Hello from LazyCLI Node.js server!');
});

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
EOF
  else
    echo "⚠️ index.js already exists, skipping creation."
  fi

  # Add nodemon dev script if nodemon installed
  if [[ "$ans_nodemon" == "1" ]]; then
    echo "🛠️ Adding 'dev' script to package.json for nodemon..."

    # Use jq if available to safely modify package.json, fallback to sed
    if command -v jq &>/dev/null; then
      jq '.scripts.dev="nodemon index.js"' package.json > package.tmp.json && mv package.tmp.json package.json
    else
      # crude sed based script add/update for 'dev'
      if grep -q "\"dev\"" package.json; then
        # Replace existing dev script
        sed -i.bak 's/"dev": *"[^"]*"/"dev": "nodemon index.js"/' package.json
        rm package.json.bak
      else
        # Add dev script inside scripts object
        sed -i.bak '/"scripts": *{/a\    "dev": "nodemon index.js",' package.json
        rm package.json.bak
      fi
    fi

    echo "✅ 'dev' script added. You can now run 'npm run dev' to start the server."
  fi

  echo "✅ Node.js project initialized successfully!"
}


# Create a new Next.js application with TypeScript, Tailwind, and optional packages
# Uses create-next-app with predefined settings and interactive package selection
# Supports: zod, bcrypt, js-cookie, swr, lucide-react, react-hot-toast, shadcn-ui
next_js_create() {
  echo "🛠️ Creating Next.js app..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

  echo "⚙️ Next.js will use default options:"
  echo "- TypeScript: Yes"
  echo "- ESLint: Yes"
  echo "- Tailwind CSS: Yes"
  echo "- App Router: Yes"
  echo "- src/: No"
  echo "- Import alias: @/*"
  read -p "✅ Continue with these settings? (y/n): " confirm_next
  [[ "$confirm_next" != "y" ]] && echo "❌ Cancelled." && return

  # Ask about using src directory (1 = yes, 0 = no)
  while true; do
    read -p "📂 Use 'src/' directory? (1/0): " use_src
    if [[ "$use_src" == "1" || "$use_src" == "0" ]]; then
      break
    else
      echo "Please enter 1 or 0."
    fi
  done

  # Prepare src dir flag for create-next-app
  if [[ "$use_src" == "1" ]]; then
    src_flag="--src-dir"
  else
    src_flag="--no-src-dir"
  fi

  npx create-next-app@latest "$project_name" \
    --typescript \
    --eslint \
    --tailwind \
    --app \
    $src_flag \
    --import-alias "@/*" \
    --no-interactive

  cd "$project_name" || return

  echo "🧠 LazyCLI Smart Stack Setup: Answer once and make yourself gloriously lazy"

  prompt_or_exit() {
    local prompt_text=$1
    local answer
    while true; do
      read -p "$prompt_text (1/0/-1): " answer
      case "$answer" in
        1|0|-1) echo "$answer"; return ;;
        *) echo "Please enter 1, 0, or -1." ;;
      esac
    done
  }

  ans_zod=$(prompt_or_exit "➕ Install zod?")
  [[ "$ans_zod" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_bcrypt=$(prompt_or_exit "🔐 Install bcrypt?")
  [[ "$ans_bcrypt" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_cookie=$(prompt_or_exit "🍪 Install js-cookie?")
  [[ "$ans_cookie" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_swr=$(prompt_or_exit "🔁 Install swr?")
  [[ "$ans_swr" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_lucide=$(prompt_or_exit "✨ Install lucide-react icons?")
  [[ "$ans_lucide" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_toast=$(prompt_or_exit "🔥 Install react-hot-toast?")
  [[ "$ans_toast" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_shadcn=$(prompt_or_exit "🎨 Setup shadcn-ui?")
  [[ "$ans_shadcn" == "-1" ]] && echo "🚫 Setup skipped." && return

  detect_package_manager

  packages=""
  [[ "$ans_zod" == "1" ]] && packages="$packages zod"
  [[ "$ans_bcrypt" == "1" ]] && packages="$packages bcrypt"
  [[ "$ans_cookie" == "1" ]] && packages="$packages js-cookie"
  [[ "$ans_swr" == "1" ]] && packages="$packages swr"
  [[ "$ans_lucide" == "1" ]] && packages="$packages lucide-react"
  [[ "$ans_toast" == "1" ]] && packages="$packages react-hot-toast"

  if [[ -n "$packages" ]]; then
    echo "📦 Installing: $packages"
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npm install $packages
    else
      $PKG_MANAGER add $packages
    fi
  fi

  if [[ "$ans_shadcn" == "1" ]]; then
    echo "🎨 Initializing shadcn-ui..."
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npx shadcn-ui@latest init
    else
      $PKG_MANAGER dlx shadcn-ui@latest init
    fi
  fi

  echo "🚀 Your Next.js app is ready!"
}


# Create a new Vite application with framework selection and optional packages
# Supports multiple frameworks: Vanilla, React, Vue, Svelte
# Includes optional packages: axios, clsx, zod, react-hot-toast, react-router-dom, lucide-react, Tailwind CSS, DaisyUI
vite_js_create() {
  echo "🛠️ Creating Vite app for you..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

  # Framework selection for Vite project
  echo "✨ Choose a framework:"
  echo "1) Vanilla"
  echo "2) React"
  echo "3) Vue"
  echo "4) Svelte"
  read -p "🔧 Enter choice [1-4]: " choice

  case $choice in
    1) framework="vanilla" ;;
    2) framework="react" ;;
    3) framework="vue" ;;
    4) framework="svelte" ;;
    *) echo "❌ Invalid choice."; return ;;
  esac

  detect_package_manager

  echo "🧠 LazyCLI Smart Stack Setup: Answer once and make yourself gloriously lazy"
  # Interactive package selection with exit option
  echo "   1 = Yes, 0 = No, -1 = Skip all remaining prompts"

  # Helper function to prompt for package installation with exit option
  ask_package() {
    local label="$1"
    local var_name="$2"
    local input
    while true; do
      read -p "➕ Install $label? (1/0/-1): " input
      case $input in
        1|0)
          eval "$var_name=$input"
          return 0
          ;;
        -1)
          echo "🚫 Skipping all further package prompts."
          SKIP_ALL=true
          return 1
          ;;
        *) echo "Please enter 1, 0 or -1." ;;
      esac
    done
  }

  # Collect user preferences for common packages
  SKIP_ALL=false
  [[ "$SKIP_ALL" == false ]] && ask_package "axios" INSTALL_AXIOS
  [[ "$SKIP_ALL" == false ]] && ask_package "clsx" INSTALL_CLSX
  [[ "$SKIP_ALL" == false ]] && ask_package "zod" INSTALL_ZOD
  [[ "$SKIP_ALL" == false ]] && ask_package "react-hot-toast" INSTALL_TOAST
  if [[ "$framework" == "react" && "$SKIP_ALL" == false ]]; then
    ask_package "react-router-dom" INSTALL_ROUTER
    [[ "$SKIP_ALL" == false ]] && ask_package "lucide-react" INSTALL_LUCIDE
  fi
  [[ "$SKIP_ALL" == false ]] && ask_package "Tailwind CSS" INSTALL_TAILWIND
  if [[ "$INSTALL_TAILWIND" == "1" && "$SKIP_ALL" == false ]]; then
    ask_package "DaisyUI (Tailwind plugin)" INSTALL_DAISY
  fi

  # Create the Vite project with selected framework
  echo "🚀 Scaffolding Vite + $framework..."
  if [[ "$PKG_MANAGER" == "npm" ]]; then
    npm create vite@latest "$project_name" -- --template "$framework" --no-interactive
  else
    $PKG_MANAGER create vite@latest "$project_name" -- --template "$framework" --no-interactive
  fi

  cd "$project_name" || return

  echo "📦 Installing base dependencies..."
  if [[ "$PKG_MANAGER" == "npm" ]]; then
    npm install
  else
    $PKG_MANAGER install
  fi

  # Install selected packages based on user choices
  packages=()

  [[ "$INSTALL_AXIOS" == "1" ]] && packages+=("axios")
  [[ "$INSTALL_CLSX" == "1" ]] && packages+=("clsx")
  [[ "$INSTALL_ZOD" == "1" ]] && packages+=("zod")
  [[ "$INSTALL_TOAST" == "1" ]] && packages+=("react-hot-toast")
  [[ "$INSTALL_ROUTER" == "1" ]] && packages+=("react-router-dom")
  [[ "$INSTALL_LUCIDE" == "1" ]] && packages+=("lucide-react")

  if [[ "${#packages[@]}" -gt 0 ]]; then
    echo "📦 Installing selected packages: ${packages[*]}"
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npm install "${packages[@]}"
    else
      $PKG_MANAGER add "${packages[@]}"
    fi
  fi

  # Setup Tailwind CSS and optionally DaisyUI
  if [[ "$INSTALL_TAILWIND" == "1" ]]; then
    echo "🌬️ Setting up Tailwind CSS..."
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npm install -D tailwindcss postcss autoprefixer
    else
      $PKG_MANAGER add -D tailwindcss postcss autoprefixer
    fi
    npx tailwindcss init -p

    sed -i.bak 's/content: \[\]/content: ["\.\/index\.html", "\.\/src\/\*\*\/\*\.{js,ts,jsx,tsx}"]/' tailwind.config.js
    rm tailwind.config.js.bak

    if [[ "$INSTALL_DAISY" == "1" ]]; then
      echo "🎀 Installing DaisyUI..."
      if [[ "$PKG_MANAGER" == "npm" ]]; then
        npm install -D daisyui
      else
        $PKG_MANAGER add -D daisyui
      fi

      # Inject DaisyUI plugin
      if ! grep -q "daisyui" tailwind.config.js; then
        sed -i.bak '/plugins: \[/ s/\[/\[require("daisyui"), /' tailwind.config.js
        rm tailwind.config.js.bak
      fi
      echo "✅ DaisyUI configured in tailwind.config.js"
    fi

    echo "✅ Tailwind CSS setup complete."
  fi

  echo "✅ Vite project setup complete!"
}

# Main command-line interface router
# Handles all primary commands and subcommands
# Routes to appropriate functions based on user input
case "$1" in
  --help | help ) # Display help information
    show_help
    ;;
  --version | -v ) # Show version number
    echo "LazyCLI v$VERSION"
    ;;
  upgrade ) # Upgrade LazyCLI to latest version
    echo "🔄 Upgrading LazyCLI..."

    # Remove old version
    rm -f "$HOME/.lazycli/lazy"

    # Download new version
    curl -s https://lazycli.xyz/scripts/lazy.sh -o "$HOME/.lazycli/lazy"
    chmod +x "$HOME/.lazycli/lazy"

    echo "✅ LazyCLI upgraded to latest version!"
    exit 0
    ;;
  github ) # GitHub-related commands
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
  node-js ) # Node.js project commands
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
  next-js ) # Next.js project commands
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
  vite-js ) # Vite.js project commands
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
  *) # Handle unknown commands - show error and help
    echo "❌ Unknown command: $1"
    show_help
    exit 1
    ;;
esac
