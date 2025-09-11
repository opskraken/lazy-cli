#!/bin/bash

VERSION="1.0.4"

show_help() {
  cat << EOF
LazyCLI – Automate your dev flow like a lazy pro 💤

Usage:
  lazy [command] [subcommand]

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

  lazy github pull <base-branch> "<pr-title>"
      Create a simple pull request from current branch to the specified base branch.

  lazy node-js init
      Initialize a Node.js project with init -y and optional boilerplate package installation.

  lazy next-js create
      Scaffold a new Next.js application with recommended defaults and optional packages.

  lazy vite-js create
      Create a new Vite project, select framework, and optionally install common packages.

  lazy react-native create
      Scaffold a new React Native application with Expo or React Native CLI setup.
      
  lazy django init <project_name>
      Create a new Django project with static, templates, and media directories setup.

  lazy --version | -v
      Show current LazyCLI version.

  lazy --help | help
      Show this help message.

Available Commands:

  github        Manage GitHub repositories:
                - init       Initialize a new Git repo
                - clone      Clone a repo and optionally setup project
                - push       Commit and push changes with message
                - pull       Create a simple pull request from current branch
                - pr         Pull latest, build, commit, push, and create pull request

  node-js       Setup Node.js projects:
                - init       Initialize Node.js project with optional boilerplate

  next-js       Next.js project scaffolding:
                - create     Create Next.js app with TypeScript, Tailwind, ESLint defaults

  vite-js       Vite project scaffolding:
                - create     Create a Vite project with framework selection and optional packages

  react-native  Mobile app development with React Native:
                - create     Create React Native app with Expo or CLI, navigation, and essential packages
                
  django        Django project setup:
                - init <project_name>  Create Django project with static, templates, and media setup

For more details on each command, run:
  lazy [command] --help

EOF
}

# Helper function to detect package manager
detect_package_manager() {
  if command -v bun &> /dev/null; then
    PKG_MANAGER="bun"
  elif command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
  elif command -v yarn &> /dev/null; then
    PKG_MANAGER="yarn"
  else
    PKG_MANAGER="npm"
  fi
}

github_init() {
  echo "🛠️ Initializing new Git repository..."

  if [ -d ".git" ]; then
    echo "⚠️ Git repository already initialized in this directory."
    exit 1
  fi

  git init

  echo "✅ Git repository initialized successfully!"
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
    
    # Use the detect_package_manager function
    detect_package_manager
    
    echo "🔧 Using $PKG_MANAGER..."
    if [[ "$PKG_MANAGER" == "bun" ]]; then
      bun install
    elif [[ "$PKG_MANAGER" == "pnpm" ]]; then
      pnpm install
    elif [[ "$PKG_MANAGER" == "yarn" ]]; then
      yarn
    else
      npm install
    fi

    # Check if build script exists
    if grep -q '"build"' package.json; then
      echo "🏗️ Build script found. Building the project..."
      if [[ "$PKG_MANAGER" == "bun" ]]; then
        bun run build
      elif [[ "$PKG_MANAGER" == "pnpm" ]]; then
        pnpm run build
      elif [[ "$PKG_MANAGER" == "yarn" ]]; then
        yarn build
      else
        npm run build
      fi
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

# Create a simple pull request from current branch to target branch
# Args: $1 = base branch, $2 = pull request title
github_create_pull() {
  local BASE_BRANCH="$1"
  local PR_TITLE="$2"

  if [[ -z "$BASE_BRANCH" || -z "$PR_TITLE" ]]; then
    echo "❌ Usage: lazy github pull <base-branch> \"<pr-title>\""
    return 1
  fi

  # Detect current branch
  local CURRENT_BRANCH
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  if [[ -z "$CURRENT_BRANCH" ]]; then
    echo "❌ Not inside a git repository."
    return 1
  fi

  if [[ "$CURRENT_BRANCH" == "$BASE_BRANCH" ]]; then
    echo "❌ Cannot create PR from $BASE_BRANCH to itself. Please switch to a feature branch."
    return 1
  fi

  echo "🔁 Creating pull request: $CURRENT_BRANCH → $BASE_BRANCH"
  echo "📝 Title: $PR_TITLE"

  if ! gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$PR_TITLE" --body "$PR_TITLE"; then
    echo "❌ Pull request creation failed."
    echo "⚠️ GitHub CLI (gh) is not installed or not found in PATH."
    echo "👉 To enable automatic pull request creation:"
    echo "   1. Download and install GitHub CLI: https://cli.github.com/"
    echo "   2. If already installed, add it to your PATH to your gitbash:"
    echo "      export PATH=\"/c/Program Files/GitHub CLI:\$PATH\""
    return 1
  fi

  echo "✅ Pull request created successfully! 🎉"
}

# Create a pull request workflow: pull latest changes, install dependencies, commit, push, and create PR
# Automatically detects project type and runs appropriate build/install commands
# Args: $1 = base branch, $2 = commit message
github_create_pr() {
  local BASE_BRANCH="$1"
  local COMMIT_MSG="$2"

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
      npm run build
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

  # Create pull request
  echo "🔁 Creating pull request: $CURRENT_BRANCH → $BASE_BRANCH"
  if ! gh pr create --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" --title "$COMMIT_MSG" --body "$COMMIT_MSG"; then
    echo "❌ Pull request creation failed."
    echo "⚠️ GitHub CLI (gh) is not installed or not found in PATH."
    echo "👉 To enable automatic pull request creation:"
    echo "   1. Download and install GitHub CLI: https://cli.github.com/"
    echo "   2. If already installed, add it to your PATH to your gitbash:"
    echo "      export PATH=\"/c/Program Files/GitHub CLI:\$PATH\""
    return 1
  fi

  echo "✅ PR created successfully! 🎉"
}

node_js_init() {
  echo "🛠️ Initializing Node.js project..."
  
  # Ask user preference
  read -p "🤔 Use simple setup (1) or TypeScript setup (2)? [1/2]: " setup_type
  
  if [[ "$setup_type" == "1" ]]; then
    # Simple setup
    npm init -y
    echo "📦 Suggested packages:"
    echo "   npm install express nodemon"
    echo "   npm install -D @types/node"
  else
    # TypeScript setup (enhanced version)
    echo "🛠️ Setting up TypeScript Node.js project..."
    
    # Detect package manager
    detect_package_manager
    pkg_manager="$PKG_MANAGER"
    
    echo "🧠 LazyCLI Smart Stack Setup: Answer once and make yourself gloriously lazy"
    echo "   1 = Yes, 0 = No, -1 = Skip all remaining prompts"
    
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
    
    ans_nodemon=$(prompt_or_exit "➕ Install nodemon for development?")
    [[ "$ans_nodemon" == "-1" ]] && echo "🚫 Setup skipped." && return
    
    ans_dotenv=$(prompt_or_exit "🔐 Install dotenv?")
    [[ "$ans_dotenv" == "-1" ]] && echo "🚫 Setup skipped." && return
    
    # Initialize npm project
    npm init -y
    
    # Install TypeScript and related packages
    echo "📦 Installing TypeScript and development dependencies..."
    if [[ "$pkg_manager" == "npm" ]]; then
      npm install -D typescript @types/node ts-node
    else
      $pkg_manager add -D typescript @types/node ts-node
    fi
    
    # Install optional packages
    packages=()
    dev_packages=()
    
    [[ "$ans_dotenv" == "1" ]] && packages+=("dotenv")
    [[ "$ans_nodemon" == "1" ]] && dev_packages+=("nodemon")
    
    if [[ ${#packages[@]} -gt 0 ]]; then
      echo "📦 Installing packages: ${packages[*]}"
      if [[ "$pkg_manager" == "npm" ]]; then
        npm install "${packages[@]}"
      else
        $pkg_manager add "${packages[@]}"
      fi
    fi
    
    if [[ ${#dev_packages[@]} -gt 0 ]]; then
      echo "📦 Installing dev packages: ${dev_packages[*]}"
      if [[ "$pkg_manager" == "npm" ]]; then
        npm install -D "${dev_packages[@]}"
      else
        $pkg_manager add -D "${dev_packages[@]}"
      fi
    fi
    
    # Create TypeScript config
    echo "⚙️ Creating tsconfig.json..."
    cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
    
    # Create src directory and index.ts
    mkdir -p src
    
    if [[ ! -f "src/index.ts" ]]; then
      echo "📝 Creating src/index.ts..."
      # Simple Node.js template
      cat > src/index.ts <<'EOF'
console.log('🚀 Hello from TypeScript Node.js!');
console.log('💤 Built with LazyCLI – stay lazy, code smart!');

// Example function
function greet(name: string): string {
  return `Hello, ${name}! Welcome to your TypeScript project.`;
}

console.log(greet('Developer'));
EOF
    else
      echo "ℹ️ src/index.ts already exists. Appending LazyCLI branding..."
      echo 'console.log("🚀 Booted with LazyCLI – stay lazy, code smart 😴");' >> src/index.ts
    fi
    
    # Create environment file if dotenv is installed
    if [[ "$ans_dotenv" == "1" && ! -f ".env" ]]; then
      echo "🔐 Creating .env file..."
      cat > .env <<'EOF'
# Environment variables
NODE_ENV=development
PORT=5000

# Add your environment variables here
# DATABASE_URL=
# JWT_SECRET=
EOF
      
      # Add .env to .gitignore if it exists
      if [[ -f ".gitignore" ]]; then
        echo ".env" >> .gitignore
      else
        echo ".env" > .gitignore
      fi
    fi
    
    # Create a clean package.json with proper structure
    echo "🛠️ Creating package.json with LazyCLI template..."
    
    # Remove existing package.json to avoid conflicts
    rm -f package.json
    
    # Create new package.json with proper structure
    if [[ "$pkg_manager" == "bun" ]]; then
      if [[ "$ans_nodemon" == "1" ]]; then
        cat > package.json <<'EOF'
{
  "name": "node-typescript-project",
  "version": "1.0.0",
  "description": "TypeScript Node.js project created with LazyCLI",
  "main": "dist/index.js",
  "module": "src/index.ts",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist",
    "test": "bun test"
  },
  "keywords": ["typescript", "node", "lazycli"],
  "author": "",
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
EOF
      else
        cat > package.json <<'EOF'
{
  "name": "node-typescript-project",
  "version": "1.0.0",
  "description": "TypeScript Node.js project created with LazyCLI",
  "main": "dist/index.js",
  "module": "src/index.ts",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist",
    "test": "bun test"
  },
  "keywords": ["typescript", "node", "lazycli"],
  "author": "",
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
EOF
      fi
    else
      if [[ "$ans_nodemon" == "1" ]]; then
        cat > package.json <<'EOF'
{
  "name": "node-typescript-project",
  "version": "1.0.0",
  "description": "TypeScript Node.js project created with LazyCLI",
  "main": "dist/index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["typescript", "node", "lazycli"],
  "author": "",
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
EOF
      else
        cat > package.json <<'EOF'
{
  "name": "node-typescript-project",
  "version": "1.0.0",
  "description": "TypeScript Node.js project created with LazyCLI",
  "main": "dist/index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "clean": "rm -rf dist",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["typescript", "node", "lazycli"],
  "author": "",
  "license": "MIT",
  "devDependencies": {},
  "dependencies": {}
}
EOF
      fi
    fi
    
    echo "📁 Project structure created:"
    echo "   src/index.ts - Main TypeScript file"
    echo "   tsconfig.json - TypeScript configuration"
    [[ "$ans_dotenv" == "1" ]] && echo "   .env - Environment variables"
    echo ""
    
    if [[ "$ans_nodemon" == "1" ]]; then
      echo "✅ Run with: $pkg_manager run dev (development with auto-reload)"
    else
      echo "✅ Run with: $pkg_manager run dev (development)"
    fi
    echo "✅ Build with: $pkg_manager run build"
    echo "✅ Run production: $pkg_manager run start"
    
    echo "✅ Node.js + TypeScript project is ready!"
  fi
}

# Setup virtual environment for Django
setup_virtualenv() {
	# Check if virtual environment already exists
	if [ -d "venv" ]; then
		echo "Virtual environment 'venv' already exists. Activating..."
		return 0
	fi
	
	echo "Virtual environment not found. Creating new one..."
	
	if command -v virtualenv >/dev/null 2>&1; then
		virtualenv venv
		echo "Virtualenv created using 'virtualenv' package."
	else
		echo "The 'virtualenv' package is not installed."
		read -p "Would you like to install 'virtualenv'? (y/n, default: use python -m venv): " choice
		if [ "$choice" = "y" ]; then
			if ! pip install virtualenv; then
				echo "pip install failed. Trying apt install python3-virtualenv..."
				sudo apt update && sudo apt install -y python3-virtualenv
			fi
			virtualenv venv
			echo "Virtualenv installed and created."
			
		else
			python3 -m venv venv
			echo "Virtualenv created using default 'venv' module."
		fi
	fi
}

# Create a new Django project with static, templates, and media setup
djangoInit() {
	if ! command -v python3 >/dev/null 2>&1; then
		echo "Python3 is not installed or not found in PATH."
		return 1
	fi
	
	if [ -z "$1" ]; then
		echo "Usage: lazy django init <project_name>"
		return 1
	fi
    
	PROJECT_NAME=$1
	mkdir -p $PROJECT_NAME
	cd $PROJECT_NAME || exit 1

	setup_virtualenv
	source venv/bin/activate
	echo "Virtualenv activated."

	
	if ! command -v django-admin >/dev/null 2>&1; then
		echo "'django-admin' not found. Installing Django via pip..."
		pip install django || { echo "Failed to install Django."; return 1; }
	fi
	django-admin startproject $PROJECT_NAME .

	# Create directories
	mkdir -p static
	mkdir -p templates
	mkdir -p media

	# Update settings.py
	SETTINGS_FILE="$PROJECT_NAME/settings.py"
	if ! grep -q "'django.contrib.staticfiles'" "$SETTINGS_FILE"; then
		sed -i "/^INSTALLED_APPS = \[/a    'django.contrib.staticfiles'," "$SETTINGS_FILE"
	fi
	echo -e "\nSTATICFILES_DIRS = [BASE_DIR / 'static']\nTEMPLATES[0]['DIRS'] = [BASE_DIR / 'templates']\nMEDIA_URL = '/media/'\nMEDIA_ROOT = BASE_DIR / 'media'" >> $SETTINGS_FILE

	echo "Django project '$PROJECT_NAME' created with static, templates, and media directories."
}

next_js_create() {
  echo "🛠️ Creating Next.js app..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

  echo "⚙️ Next.js will use default options:"
  echo "- TypeScript: 1"
  echo "- ESLint: 1"
  echo "- Tailwind CSS: 1"
  echo "- App Router: 1"
  echo "- src/: 0"
  echo "- Import alias: 1"
  echo "- Turbopack: 1"
  read -p "✅ Continue with these settings? (1/0): " confirm_next

  if [[ "$confirm_next" != "1" ]]; then
    echo "❌ Cancelled default setup. Let's go one-by-one instead."

    read -p "📂 Use src/ directory? (1/0): " use_src
    read -p "✨ Use Tailwind CSS? (1/0): " use_tailwind
    read -p "🧹 Use ESLint? (1/0): " use_eslint
    read -p "⚙️ Use TypeScript? (1/0): " use_ts
    read -p "🧪 Use App Router? (1/0): " use_app
    read -p "📌 Use import alias '@/*'? (1/0): " use_alias
    read -p "🚀 Use Turbopack for dev? (1/0): " use_turbo
  else
    use_src=0
    use_tailwind=1
    use_eslint=1
    use_ts=1
    use_app=1
    use_alias=1
    use_turbo=1
  fi

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

  ans_zod=$(prompt_or_exit "➕ Install zod?")
  [[ "$ans_zod" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_bcrypt=$(prompt_or_exit "🔒 Install bcrypt?")
  [[ "$ans_bcrypt" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_cookie=$(prompt_or_exit "🍪 Install js-cookie?")
  [[ "$ans_cookie" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_swr=$(prompt_or_exit "🔄 Install swr?")
  [[ "$ans_swr" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_lucide=$(prompt_or_exit "✨ Install lucide-react icons?")
  [[ "$ans_lucide" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_toast=$(prompt_or_exit "🔥 Install react-hot-toast?")
  [[ "$ans_toast" == "-1" ]] && echo "🚫 Setup skipped." && return

  ans_shadcn=$(prompt_or_exit "🎨 Setup shadcn-ui?")
  [[ "$ans_shadcn" == "-1" ]] && echo "🚫 Setup skipped." && return

  # Construct Next.js CLI command
  echo "🚀 Creating Next.js project..."

  cmd="npx create-next-app@latest \"$project_name\""
  [[ "$use_ts" == "1" ]] && cmd+=" --typescript" || cmd+=" --no-typescript"
  [[ "$use_eslint" == "1" ]] && cmd+=" --eslint" || cmd+=" --no-eslint"
  [[ "$use_tailwind" == "1" ]] && cmd+=" --tailwind" || cmd+=" --no-tailwind"
  [[ "$use_app" == "1" ]] && cmd+=" --app" || cmd+=" --no-app"
  [[ "$use_src" == "1" ]] && cmd+=" --src-dir" || cmd+=" --no-src-dir"
  [[ "$use_alias" == "1" ]] && cmd+=' --import-alias "@/*"' || cmd+=" --no-import-alias"
  [[ "$use_turbo" == "1" ]] && cmd+=" --turbo" || cmd+=" --no-turbo"
  cmd+=" --yes"

  eval "$cmd"

  cd "$project_name" || return

  detect_package_manager

  # Prepare packages list
  packages=()
  [[ "$ans_zod" == "1" ]] && packages+=("zod")
  [[ "$ans_bcrypt" == "1" ]] && packages+=("bcrypt")
  [[ "$ans_cookie" == "1" ]] && packages+=("js-cookie")
  [[ "$ans_swr" == "1" ]] && packages+=("swr")
  [[ "$ans_lucide" == "1" ]] && packages+=("lucide-react")
  [[ "$ans_toast" == "1" ]] && packages+=("react-hot-toast")

  if [[ ${#packages[@]} -gt 0 ]]; then
    echo "📦 Installing: ${packages[*]}"
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npm install "${packages[@]}"
    else
      $PKG_MANAGER add "${packages[@]}"
    fi
  fi

  # Setup shadcn-ui
  if [[ "$ans_shadcn" == "1" ]]; then
    echo "🎨 Initializing shadcn-ui..."
    if [[ "$PKG_MANAGER" == "npm" ]]; then
      npx shadcn-ui@latest init
    elif command -v bun &>/dev/null; then
      bun x shadcn-ui@latest init
    else
      $PKG_MANAGER dlx shadcn-ui@latest init || echo "❌ shadcn-ui failed to init."
    fi
  fi

  # Create custom page.tsx for Next.js App Router
  if [[ "$use_app" == "1" ]]; then
    echo "🎨 Creating custom LazyCLI page.tsx..."
    
    # Remove default page.tsx if it exists
    [[ -f "app/page.tsx" ]] && rm app/page.tsx
    [[ -f "src/app/page.tsx" ]] && rm src/app/page.tsx
    
    # Determine the correct path based on src directory usage
    if [[ "$use_src" == "1" ]]; then
      page_path="src/app/page.tsx"
    else
      page_path="app/page.tsx"
    fi
    
    # Create custom page.tsx with LazyCLI branding
    cat > "$page_path" << 'EOF'
"use client";
import { useState, useEffect } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("demo");
  const [terminalText, setTerminalText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const commands = [
    "$ lazy github init",
    "$ lazy node-js init",
    "$ lazy next-js create",
    "$ lazy vite-js create",
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (activeTab === "terminal") {
      typeCommand();
    }
  }, [activeTab]);

  const typeCommand = () => {
    setIsTyping(true);
    const command = commands[Math.floor(Math.random() * commands.length)];
    let i = 0;
    setTerminalText("");

    const interval = setInterval(() => {
      if (i < command.length) {
        setTerminalText(command.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 100);
  };

  const handleCounterChange = (operation) => {
    if (operation === "increment") {
      setCount(count + 1);
    } else if (operation === "decrement") {
      setCount(count - 1);
    } else {
      setCount(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div
        className={`relative z-10 min-h-screen transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-transparent rounded-full mb-6 shadow-xl border-2 border-blue-400 transform hover:scale-110 transition-transform duration-300 hover:shadow-blue-400/50 p-2 animate-fadeIn">
              <img
                src="https://i.ibb.co/1tTxMkrp/terminal.png"
                alt="LazyCLI Logo"
                className="w-full h-full object-contain animate-pulse duration-200 hover:animate-none"
              />
            </div>

            <h1 className="text-5xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              LazyCLI
            </h1>

            <p className="text-xl text-slate-200 max-w-2xl mx-auto">
              Automate your development workflow like a lazy pro
            </p>
          </div>

          {/* Main Content Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-700/50">
                <button
                  onClick={() => setActiveTab("demo")}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === "demo"
                      ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                  }`}
                >
                  🎮 Interactive Demo
                </button>
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === "terminal"
                      ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                  }`}
                >
                  🖥️ Terminal Preview
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === "features"
                      ? "bg-blue-600/20 text-blue-400 border-b-2 border-blue-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                  }`}
                >
                  ⚡ Features
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "demo" && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-200 mb-4">
                        🎉 Interactive Counter Demo
                      </h2>
                      <p className="text-slate-400 mb-8">
                        Experience the power of modern React with this
                        interactive demo
                      </p>
                    </div>

                    {/* Counter Demo */}
                    <div className="bg-slate-900/50 rounded-xl p-8 border border-slate-700/30">
                      <div className="flex items-center justify-center space-x-6 mb-6">
                        <button
                          onClick={() => handleCounterChange("decrement")}
                          className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-red-500/25"
                        >
                          -
                        </button>
                        <div className="text-6xl font-bold text-slate-200 min-w-[8rem] text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {count}
                        </div>
                        <button
                          onClick={() => handleCounterChange("increment")}
                          className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg hover:shadow-green-500/25"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-center">
                        <button
                          onClick={() => handleCounterChange("reset")}
                          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "terminal" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-200 mb-4">
                        🖥️ Terminal Preview
                      </h2>
                      <p className="text-slate-400 mb-8">
                        See LazyCLI commands in action
                      </p>
                    </div>

                    {/* Terminal Window */}
                    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl">
                      <div className="bg-slate-800 px-4 py-2 flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="ml-4 text-slate-400 text-sm">
                          Terminal
                        </div>
                      </div>
                      <div className="p-6 font-mono">
                        <div className="flex items-center space-x-2 mb-4">
                          <span className="text-blue-400">➜</span>
                          <span className="text-green-400">~</span>
                          <span className="text-slate-300">{terminalText}</span>
                          {isTyping && <span className="animate-pulse">|</span>}
                        </div>
                        <div className="text-slate-400 text-sm mb-4">
                          ✨ Initializing project with modern tooling...
                        </div>
                        <button
                          onClick={typeCommand}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
                        >
                          Run New Command
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-200 mb-4">
                        ⚡ Features
                      </h2>
                      <p className="text-slate-400 mb-8">
                        Built with modern technologies for optimal performance
                      </p>
                    </div>

                    {/* Features List */}
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">
                          🚀 GitHub Automation
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Streamline your GitHub workflow with automated
                          repository management
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">
                          📦 Project Scaffolding
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Bootstrap projects with modern tooling and best
                          practices
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">
                          ⚡ Lightning Fast
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Optimized performance with modern build tools
                        </p>
                      </div>
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/30">
                        <h3 className="text-lg font-semibold text-slate-200 mb-3">
                          🎨 Beautiful UI
                        </h3>
                        <p className="text-slate-400 text-sm">
                          Modern design with smooth animations and interactions
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a
                href="https://lazycli.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
              >
                🌐 Visit LazyCLI Website
              </a>
              <a
                href="https://github.com/iammhador/LazyCLI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                ⭐ Star on GitHub
              </a>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 text-slate-400 text-sm">
              <p>
                Built with ❤️ using LazyCLI • Start editing{" "}
                <code className="bg-slate-800 px-2 py-1 rounded text-slate-300">
                  src/App.jsx
                </code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
EOF
    
    echo "✅ Custom LazyCLI page.tsx created successfully!"
  fi

  echo "✅ Your Next.js app is ready!"
}

# Vite project creation function
vite_js_create() {
  echo "🚀 Creating Vite.js project with LazyCLI..."
  
  # Get project name
  read -p "📝 Enter project name: " project_name
  
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty"
    exit 1
  fi
  
  # Choose framework
  echo "🎯 Choose your framework:"
  echo "1. React (TypeScript)"
  echo "2. React (JavaScript)"
  echo "3. Vue (TypeScript)"
  echo "4. Vue (JavaScript)"
  echo "5. Vanilla (TypeScript)"
  echo "6. Vanilla (JavaScript)"
  
  read -p "🤔 Select framework (1-6): " framework_choice
  
  case "$framework_choice" in
    1) template="react-ts" ;;
    2) template="react" ;;
    3) template="vue-ts" ;;
    4) template="vue" ;;
    5) template="vanilla-ts" ;;
    6) template="vanilla" ;;
    *) 
      echo "❌ Invalid selection. Using React TypeScript."
      template="react-ts"
      ;;
  esac
  
  # Detect package manager
  detect_package_manager
  pkg_manager="$PKG_MANAGER"
  
  echo "📦 Using package manager: $pkg_manager"
  
  # Ask about additional packages
  read -p "📦 Install additional packages? (axios, clsx, zod, etc.) [y/N]: " install_packages
  
  # Create Vite project
  echo "🏗️ Creating Vite project..."
  npm create vite@latest "$project_name" -- --template "$template"
  cd "$project_name"
  
  # Install dependencies
  echo "📦 Installing dependencies..."
  $pkg_manager install
  
  # Install additional packages if requested
  if [[ "$install_packages" =~ ^[Yy]$ ]]; then
    echo "📦 Installing additional packages..."
    $pkg_manager add axios clsx zod
    $pkg_manager add -D @types/node
  fi
  
  # Ask about Tailwind CSS
  read -p "🎨 Install Tailwind CSS? [y/N]: " install_tailwind
  
  if [[ "$install_tailwind" =~ ^[Yy]$ ]]; then
    echo "🎨 Installing Tailwind CSS..."
    $pkg_manager add -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    
    # Ask about DaisyUI
    read -p "🌼 Install DaisyUI (Tailwind component library)? [y/N]: " install_daisyui
    
    if [[ "$install_daisyui" =~ ^[Yy]$ ]]; then
      echo "🌼 Installing DaisyUI..."
      $pkg_manager add -D daisyui
      
      # Update tailwind.config.js with DaisyUI
      cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
  },
}
EOF
    else
      # Update tailwind.config.js without DaisyUI
      cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
    fi
    
    # Update CSS file
    cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
    
    echo "✅ Tailwind CSS configured successfully!"
  fi
  
  # Update vite.config with path alias
  if [[ "$template" == *"ts"* ]]; then
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF
  else
    cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF
  fi
  
  echo "✅ Vite.js project created successfully!"
  echo "🚀 Run: cd $project_name && $pkg_manager run dev"
}

# React Native project creation function
react_native_create() {
  echo "📱 Creating React Native project with LazyCLI..."
  
  read -p "📝 Enter project name (default: MyReactNativeApp): " project_name
  project_name=${project_name:-MyReactNativeApp}
  
  echo "🎯 Select React Native setup:"
  echo "   1) Expo (Recommended for beginners)"
  echo "   2) React Native CLI (More control)"
  
  read -p "Choose setup (1-2, default: 1): " setup_choice
  setup_choice=${setup_choice:-1}
  
  if [[ "$setup_choice" == "1" ]]; then
    echo "🛠️ Creating Expo project..."
    npx create-expo-app "$project_name"
  else
    echo "🛠️ Creating React Native CLI project..."
    npx react-native init "$project_name"
  fi
  
  if [[ $? -eq 0 ]]; then
    cd "$project_name" || exit 1
    echo "📁 Entered directory: $project_name"
    
    if command -v code &> /dev/null; then
      echo "🚀 Opening project in VS Code..."
      code .
    fi
    
    echo "✅ React Native project created successfully!"
    if [[ "$setup_choice" == "1" ]]; then
      echo "💡 Run 'cd $project_name && npx expo start' to start development server"
    else
      echo "💡 Run 'cd $project_name && npx react-native run-android' or 'npx react-native run-ios'"
    fi
  else
    echo "❌ Failed to create React Native project"
    exit 1
  fi
}

# Main CLI router
case "$1" in
  "github")
    case "$2" in
      "init") github_init ;;
      "clone") shift 2; github_clone "$@" ;;
      "push") shift 2; github_push "$@" ;;
      "pull") shift 2; github_create_pull "$@" ;;
      "pr") shift 2; github_create_pr "$@" ;;
      *) echo "❌ Unknown github subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "node-js")
    case "$2" in
      "init") node_js_init ;;
      *) echo "❌ Unknown node-js subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "next-js")
    case "$2" in
      "create") next_js_create ;;
      *) echo "❌ Unknown next-js subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "vite-js")
    case "$2" in
      "create") vite_js_create ;;
      *) echo "❌ Unknown vite-js subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "react-native")
    case "$2" in
      "create") react_native_create ;;
      *) echo "❌ Unknown react-native subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "djangoinit")
    shift
    djangoInit "$@"
    ;;
  "django")
    case "$2" in
      "init") shift 2; djangoInit "$@" ;;
      *) echo "❌ Unknown django subcommand: $2"; show_help; exit 1 ;;
    esac
    ;;
  "--version"|"version"|"-v")
    echo "LazyCLI version $VERSION"
    ;;
  "--help"|"help")
    show_help
    ;;
  *)
    echo "❌ Unknown command: $1"
    show_help
    exit 1
    ;;
esac