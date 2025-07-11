#!/bin/bash

VERSION="1.0.1"

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
    
    ans_express=$(prompt_or_exit "🌐 Install express?")
    [[ "$ans_express" == "-1" ]] && echo "🚫 Setup skipped." && return
    
    ans_cors=$(prompt_or_exit "🔗 Install cors?")
    [[ "$ans_cors" == "-1" ]] && echo "🚫 Setup skipped." && return
    
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
    
    [[ "$ans_express" == "1" ]] && packages+=("express") && dev_packages+=("@types/express")
    [[ "$ans_cors" == "1" ]] && packages+=("cors") && dev_packages+=("@types/cors")
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
      if [[ "$ans_express" == "1" ]]; then
        # Express server template
        cat > src/index.ts <<'EOF'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 LazyCLI Express Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('💤 Built with LazyCLI – stay lazy, code smart!');
});
EOF
      else
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
      fi
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
                        ⚡ Tech Stack & Features
                      </h2>
                      <p className="text-slate-400 mb-8">
                        Built with modern technologies for optimal performance
                      </p>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl hover:bg-blue-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">⚛️</div>
                        <div className="text-sm font-medium text-blue-400">
                          React
                        </div>
                        <div className="text-xs text-slate-400">UI Library</div>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-xl hover:bg-purple-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">⚡</div>
                        <div className="text-sm font-medium text-purple-400">
                          Vite
                        </div>
                        <div className="text-xs text-slate-400">Build Tool</div>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 p-6 rounded-xl hover:bg-cyan-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">🌊</div>
                        <div className="text-sm font-medium text-cyan-400">
                          Tailwind
                        </div>
                        <div className="text-xs text-slate-400">
                          CSS Framework
                        </div>
                      </div>
                      <div className="bg-yellow-900/20 border border-yellow-500/20 p-6 rounded-xl hover:bg-yellow-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">💤</div>
                        <div className="text-sm font-medium text-yellow-400">
                          LazyCLI
                        </div>
                        <div className="text-xs text-slate-400">Automation</div>
                      </div>
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

vite_js_create() {
  echo "🛠️ Creating Vite app for you..."

  read -p "📦 Enter project name (no spaces): " project_name
  if [ -z "$project_name" ]; then
    echo "❌ Project name cannot be empty."
    return
  fi

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
  echo "   1 = Yes, 0 = No, -1 = Skip all remaining prompts"

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

  SKIP_ALL=false
  [[ "$SKIP_ALL" == false ]] && ask_package "axios" INSTALL_AXIOS
  [[ "$SKIP_ALL" == false ]] && ask_package "clsx" INSTALL_CLSX
  [[ "$SKIP_ALL" == false ]] && ask_package "zod" INSTALL_ZOD
  [[ "$SKIP_ALL" == false ]] && ask_package "react-hot-toast" INSTALL_TOAST
  if [[ "$framework" == "react" && "$SKIP_ALL" == false ]]; then
    [[ "$SKIP_ALL" == false ]] && ask_package "lucide-react" INSTALL_LUCIDE
  fi
  [[ "$SKIP_ALL" == false ]] && ask_package "Tailwind CSS" INSTALL_TAILWIND
  if [[ "$INSTALL_TAILWIND" == "1" && "$SKIP_ALL" == false ]]; then
    ask_package "DaisyUI (Tailwind plugin)" INSTALL_DAISY
  fi

  # Create the Vite project using npx (more stable in Git Bash / Windows)
  echo "🚀 Scaffolding Vite + $framework..."
  npx create-vite "$project_name" --template "$framework"

  cd "$project_name" || return

  echo "📦 Installing base dependencies..."
  if [[ "$PKG_MANAGER" == "npm" ]]; then
    npm install
  else
    $PKG_MANAGER install
  fi

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

  if [[ "$INSTALL_TAILWIND" == "1" ]]; then
    echo "🌬️ Setting up Tailwind CSS with modern Vite plugin..."
    
    # Install modern Tailwind CSS packages
    if [[ "$INSTALL_DAISY" == "1" ]]; then
      echo "📦 Installing Tailwind CSS with DaisyUI..."
      if [[ "$PKG_MANAGER" == "npm" ]]; then
        npm install tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
      else
        $PKG_MANAGER add tailwindcss@latest @tailwindcss/vite@latest daisyui@latest
      fi
    else
      echo "📦 Installing Tailwind CSS..."
      if [[ "$PKG_MANAGER" == "npm" ]]; then
        npm install tailwindcss@latest @tailwindcss/vite@latest
      else
        $PKG_MANAGER add tailwindcss@latest @tailwindcss/vite@latest
      fi
    fi

    # Update vite.config.js with Tailwind plugin
    echo "⚙️ Configuring vite.config.js..."
    if [[ "$framework" == "react" ]]; then
      cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
EOF
    elif [[ "$framework" == "vue" ]]; then
      cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
});
EOF
    elif [[ "$framework" == "svelte" ]]; then
      cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
});
EOF
    else
      # Vanilla JS
      cat > vite.config.js << 'EOF'
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
});
EOF
    fi

    # Update CSS file with modern Tailwind imports
    echo "🎨 Configuring CSS imports..."
    if [[ -f "src/index.css" ]]; then
      if [[ "$INSTALL_DAISY" == "1" ]]; then
        cat > src/index.css << 'EOF'
@import "tailwindcss";
@plugin "daisyui";
EOF
      else
        cat > src/index.css << 'EOF'
@import "tailwindcss";
EOF
      fi
    elif [[ -f "src/style.css" ]]; then
      if [[ "$INSTALL_DAISY" == "1" ]]; then
        cat > src/style.css << 'EOF'
@import "tailwindcss";
@plugin "daisyui";
EOF
      else
        cat > src/style.css << 'EOF'
@import "tailwindcss";
EOF
      fi
    else
      # Create index.css if neither exists
      if [[ "$INSTALL_DAISY" == "1" ]]; then
        cat > src/index.css << 'EOF'
@import "tailwindcss";
@plugin "daisyui";
EOF
      else
        cat > src/index.css << 'EOF'
@import "tailwindcss";
EOF
      fi
      # Import it in main file if it's React
      if [[ "$framework" == "react" && -f "src/main.jsx" ]]; then
        sed -i.bak "1i import './index.css'" src/main.jsx && rm src/main.jsx.bak
      elif [[ "$framework" == "react" && -f "src/main.tsx" ]]; then
        sed -i.bak "1i import './index.css'" src/main.tsx && rm src/main.tsx.bak
      fi
    fi

    if [[ "$INSTALL_DAISY" == "1" ]]; then
      echo "✅ Tailwind CSS with DaisyUI configured using modern Vite plugin"
    else
      echo "✅ Tailwind CSS configured using modern Vite plugin"
    fi
  else
    # When Tailwind is not installed, create custom index.css
    echo "🎨 Creating custom index.css..."
    
    # Remove existing index.css if it exists
    [[ -f "src/index.css" ]] && rm src/index.css
    [[ -f "src/style.css" ]] && rm src/style.css
    
    # Create new index.css with custom styles
    cat > src/index.css << 'EOF'
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  display: block;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}
EOF
    
    # Import it in main file if it's React
    if [[ "$framework" == "react" && -f "src/main.jsx" ]]; then
      sed -i.bak "1i import './index.css'" src/main.jsx && rm src/main.jsx.bak
    elif [[ "$framework" == "react" && -f "src/main.tsx" ]]; then
      sed -i.bak "1i import './index.css'" src/main.tsx && rm src/main.tsx.bak
    fi
    
    echo "✅ Custom index.css created and configured"
  fi

  # Create custom App.jsx for React projects
  if [[ "$framework" == "react" ]]; then
    echo "🎨 Creating custom LazyCLI App.jsx..."
    
    # Remove default App.jsx if it exists
    [[ -f "src/App.jsx" ]] && rm src/App.jsx
    [[ -f "src/App.tsx" ]] && rm src/App.tsx
    
    if [[ "$INSTALL_TAILWIND" == "1" ]]; then
      # Create Tailwind-based App.jsx
      cat > src/App.jsx << 'EOF'
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
                        ⚡ Tech Stack & Features
                      </h2>
                      <p className="text-slate-400 mb-8">
                        Built with modern technologies for optimal performance
                      </p>
                    </div>

                    {/* Tech Stack Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl hover:bg-blue-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">⚛️</div>
                        <div className="text-sm font-medium text-blue-400">
                          React
                        </div>
                        <div className="text-xs text-slate-400">UI Library</div>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/20 p-6 rounded-xl hover:bg-purple-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">⚡</div>
                        <div className="text-sm font-medium text-purple-400">
                          Vite
                        </div>
                        <div className="text-xs text-slate-400">Build Tool</div>
                      </div>
                      <div className="bg-cyan-900/20 border border-cyan-500/20 p-6 rounded-xl hover:bg-cyan-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">🌊</div>
                        <div className="text-sm font-medium text-cyan-400">
                          Tailwind
                        </div>
                        <div className="text-xs text-slate-400">
                          CSS Framework
                        </div>
                      </div>
                      <div className="bg-yellow-900/20 border border-yellow-500/20 p-6 rounded-xl hover:bg-yellow-900/30 transition-all duration-200 hover:scale-105">
                        <div className="text-3xl mb-3">💤</div>
                        <div className="text-sm font-medium text-yellow-400">
                          LazyCLI
                        </div>
                        <div className="text-xs text-slate-400">Automation</div>
                      </div>
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
    else
      # Create CSS-based App.jsx (no Tailwind)
      cat > src/App.jsx << 'EOF'

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
      setTimeout(typeCommand, 500);
    }
  }, [activeTab]);

  const typeCommand = () => {
    if (isTyping) return;

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

  const styles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background:
        "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      color: "white",
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
    },
    bgElements: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: 1,
    },
    bgOrb1: {
      position: "absolute",
      top: "-10rem",
      right: "-10rem",
      width: "20rem",
      height: "20rem",
      background:
        "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      animation: "pulse 4s ease-in-out infinite",
    },
    bgOrb2: {
      position: "absolute",
      bottom: "-10rem",
      left: "-10rem",
      width: "20rem",
      height: "20rem",
      background:
        "radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, transparent 70%)",
      borderRadius: "50%",
      animation: "pulse 4s ease-in-out infinite",
      animationDelay: "2s",
    },
    mainContainer: {
      position: "relative",
      zIndex: 10,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(2rem)",
      transition: "all 1s ease-out",
    },
    header: {
      textAlign: "center",
      marginBottom: "3rem",
    },
    logoContainer: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "5rem",
      height: "5rem",
      background: "transparent",
      borderRadius: "50%",
      border: "2px solid #60a5fa", // border-blue-400
      marginBottom: "1.5rem",
      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      padding: "0.5rem",
      cursor: "pointer",
    },
    logo: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      transition: "transform 0.3s ease",
    },
    mainTitle: {
      fontSize: "3rem",
      fontWeight: "700",
      background: "linear-gradient(to right, #22d3ee, #3b82f6)", // cyan-400 to blue-400
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      marginBottom: "1rem",
      letterSpacing: "0.03em",
    },
    subtitle: {
      fontSize: "1.25rem",
      color: "#cbd5e1", // slate-300
      maxWidth: "32rem",
      margin: "0 auto",
    },
    mainCard: {
      background: "rgba(30, 41, 59, 0.5)",
      backdropFilter: "blur(16px)",
      borderRadius: "1rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      border: "1px solid rgba(71, 85, 105, 0.5)",
      overflow: "hidden",
    },
    tabNav: {
      display: "flex",
      borderBottom: "1px solid rgba(71, 85, 105, 0.5)",
    },
    tabBtn: {
      flex: 1,
      padding: "1rem 1.5rem",
      fontSize: "0.875rem",
      fontWeight: "500",
      background: "none",
      border: "none",
      color: "#94a3b8",
      cursor: "pointer",
      transition: "all 0.2s ease",
      borderBottom: "2px solid transparent",
    },
    tabBtnActive: {
      background: "rgba(59, 130, 246, 0.2)",
      color: "#60a5fa",
      borderBottomColor: "#60a5fa",
    },
    tabBtnHover: {
      color: "#e2e8f0",
      background: "rgba(71, 85, 105, 0.3)",
    },
    tabContent: {
      padding: "2rem",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#e2e8f0",
      marginBottom: "1rem",
      textAlign: "center",
    },
    sectionSubtitle: {
      color: "#94a3b8",
      marginBottom: "2rem",
      textAlign: "center",
    },
    counterDemo: {
      background: "rgba(15, 23, 42, 0.5)",
      borderRadius: "0.75rem",
      padding: "2rem",
      border: "1px solid rgba(71, 85, 105, 0.3)",
      marginBottom: "2rem",
    },
    counterControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      marginBottom: "1.5rem",
    },
    counterBtn: {
      width: "3rem",
      height: "3rem",
      borderRadius: "50%",
      border: "none",
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    },
    counterBtnDecrement: {
      background: "#ef4444",
    },
    counterBtnIncrement: {
      background: "#22c55e",
    },
    counterDisplay: {
      fontSize: "3.75rem",
      fontWeight: "700",
      minWidth: "8rem",
      textAlign: "center",
      background: "linear-gradient(45deg, #60a5fa, #a78bfa)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    resetBtn: {
      padding: "0.5rem 1.5rem",
      background: "#475569",
      color: "#e2e8f0",
      border: "none",
      borderRadius: "0.5rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "block",
      margin: "0 auto",
    },
    terminalWindow: {
      background: "#0f172a",
      borderRadius: "0.75rem",
      overflow: "hidden",
      border: "1px solid rgba(71, 85, 105, 0.5)",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
      marginBottom: "1.5rem",
    },
    terminalHeader: {
      background: "#1e293b",
      padding: "0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    terminalDot: {
      width: "0.75rem",
      height: "0.75rem",
      borderRadius: "50%",
    },
    terminalTitle: {
      marginLeft: "1rem",
      color: "#94a3b8",
      fontSize: "0.875rem",
    },
    terminalContent: {
      padding: "1.5rem",
      fontFamily: '"Courier New", monospace',
    },
    terminalLine: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      marginBottom: "1rem",
    },
    terminalOutput: {
      color: "#94a3b8",
      fontSize: "0.875rem",
      marginBottom: "1rem",
    },
    terminalImgContainer: {
      background: "rgba(15, 23, 42, 0.5)",
      borderRadius: "0.75rem",
      padding: "1rem",
      border: "1px solid rgba(71, 85, 105, 0.3)",
    },
    terminalImg: {
      width: "100%",
      height: "auto",
      borderRadius: "0.5rem",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    },
    techGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    techCard: {
      padding: "1.5rem",
      borderRadius: "0.75rem",
      transition: "all 0.2s ease",
      border: "1px solid",
      cursor: "pointer",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginTop: "2rem",
    },
    featureCard: {
      background: "rgba(15, 23, 42, 0.5)",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      border: "1px solid rgba(71, 85, 105, 0.3)",
    },
    featureTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#e2e8f0",
      marginBottom: "0.75rem",
    },
    featureDesc: {
      color: "#94a3b8",
      fontSize: "0.875rem",
    },
    actionButtons: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "2rem",
    },
    btn: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.75rem 2rem",
      borderRadius: "0.5rem",
      fontWeight: "500",
      textDecoration: "none",
      transition: "all 0.2s ease",
      border: "none",
      cursor: "pointer",
    },
    btnPrimary: {
      background: "linear-gradient(45deg, #3b82f6, #9333ea)",
      color: "white",
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.25)",
    },
    btnSecondary: {
      background: "#475569",
      color: "white",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
    },
    footer: {
      textAlign: "center",
      marginTop: "3rem",
      color: "#94a3b8",
      fontSize: "0.875rem",
    },
    footerCode: {
      background: "#1e293b",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.25rem",
      color: "#cbd5e1",
    },
    runCommandBtn: {
      padding: "0.5rem 1rem",
      background: "#3b82f6",
      color: "white",
      border: "none",
      borderRadius: "0.25rem",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
  };

  const keyframes = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.bgElements}>
          <div style={styles.bgOrb1}></div>
          <div style={styles.bgOrb2}></div>
        </div>

        <div style={styles.mainContainer}>
          <div style={styles.header}>
            <div
              style={styles.logoContainer}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow =
                  "0 25px 50px -12px rgba(59, 130, 246, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 25px 50px -12px rgba(59, 130, 246, 0.25)";
              }}
            >
              <img
                src="https://i.ibb.co/1tTxMkrp/terminal.png"
                alt="LazyCLI Logo"
                style={styles.logo}
              />
            </div>

            <h1 style={styles.mainTitle}>LazyCLI</h1>

            <p style={styles.subtitle}>
              Automate your development workflow like a lazy pro
            </p>
          </div>

          <div style={styles.mainCard}>
            <div style={styles.tabNav}>
              {["demo", "terminal", "features"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    ...styles.tabBtn,
                    ...(activeTab === tab ? styles.tabBtnActive : {}),
                  }}
                  onClick={() => setActiveTab(tab)}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) {
                      Object.assign(e.target.style, styles.tabBtnHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) {
                      e.target.style.color = "#94a3b8";
                      e.target.style.background = "none";
                    }
                  }}
                >
                  {tab === "demo" && "🎮 Interactive Demo"}
                  {tab === "terminal" && "🖥️ Terminal Preview"}
                  {tab === "features" && "⚡ Features"}
                </button>
              ))}
            </div>

            <div style={styles.tabContent}>
              {activeTab === "demo" && (
                <div>
                  <h2 style={styles.sectionTitle}>
                    🎉 Interactive Counter Demo
                  </h2>
                  <p style={styles.sectionSubtitle}>
                    Experience the power of modern React with this interactive
                    demo
                  </p>

                  <div style={styles.counterDemo}>
                    <div style={styles.counterControls}>
                      <button
                        style={{
                          ...styles.counterBtn,
                          ...styles.counterBtnDecrement,
                        }}
                        onClick={() => handleCounterChange("decrement")}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "#dc2626";
                          e.target.style.boxShadow =
                            "0 10px 25px -5px rgba(239, 68, 68, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "#ef4444";
                          e.target.style.boxShadow =
                            "0 10px 25px -5px rgba(0, 0, 0, 0.3)";
                        }}
                      >
                        -
                      </button>
                      <div style={styles.counterDisplay}>{count}</div>
                      <button
                        style={{
                          ...styles.counterBtn,
                          ...styles.counterBtnIncrement,
                        }}
                        onClick={() => handleCounterChange("increment")}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.1)";
                          e.target.style.background = "#16a34a";
                          e.target.style.boxShadow =
                            "0 10px 25px -5px rgba(34, 197, 94, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = "#22c55e";
                          e.target.style.boxShadow =
                            "0 10px 25px -5px rgba(0, 0, 0, 0.3)";
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      style={styles.resetBtn}
                      onClick={() => handleCounterChange("reset")}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#64748b";
                        e.target.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#475569";
                        e.target.style.transform = "scale(1)";
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "terminal" && (
                <div>
                  <h2 style={styles.sectionTitle}>🖥️ Terminal Preview</h2>
                  <p style={styles.sectionSubtitle}>
                    See LazyCLI commands in action
                  </p>

                  <div style={styles.terminalWindow}>
                    <div style={styles.terminalHeader}>
                      <div
                        style={{ ...styles.terminalDot, background: "#ef4444" }}
                      ></div>
                      <div
                        style={{ ...styles.terminalDot, background: "#eab308" }}
                      ></div>
                      <div
                        style={{ ...styles.terminalDot, background: "#22c55e" }}
                      ></div>
                      <div style={styles.terminalTitle}>Terminal</div>
                    </div>
                    <div style={styles.terminalContent}>
                      <div style={styles.terminalLine}>
                        <span style={{ color: "#60a5fa" }}>➜</span>
                        <span style={{ color: "#22c55e" }}>~</span>
                        <span style={{ color: "#e2e8f0" }}>{terminalText}</span>
                        {isTyping && (
                          <span style={{ animation: "blink 1s infinite" }}>
                            |
                          </span>
                        )}
                      </div>
                      <div style={styles.terminalOutput}>
                        ✨ Initializing project with modern tooling...
                      </div>
                      <button
                        style={styles.runCommandBtn}
                        onClick={typeCommand}
                        onMouseEnter={(e) =>
                          (e.target.style.background = "#2563eb")
                        }
                        onMouseLeave={(e) =>
                          (e.target.style.background = "#3b82f6")
                        }
                      >
                        Run New Command
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "features" && (
                <div>
                  <h2 style={styles.sectionTitle}>⚡ Tech Stack & Features</h2>
                  <p style={styles.sectionSubtitle}>
                    Built with modern technologies for optimal performance
                  </p>

                  <div style={styles.techGrid}>
                    {[
                      {
                        name: "React",
                        icon: "⚛️",
                        desc: "UI Library",
                        color: "#60a5fa",
                        bg: "rgba(59, 130, 246, 0.1)",
                        border: "rgba(59, 130, 246, 0.2)",
                      },
                      {
                        name: "Vite",
                        icon: "⚡",
                        desc: "Build Tool",
                        color: "#a78bfa",
                        bg: "rgba(147, 51, 234, 0.1)",
                        border: "rgba(147, 51, 234, 0.2)",
                      },
                      {
                        name: "CSS",
                        icon: "🌊",
                        desc: "Styling",
                        color: "#22d3ee",
                        bg: "rgba(6, 182, 212, 0.1)",
                        border: "rgba(6, 182, 212, 0.2)",
                      },
                      {
                        name: "LazyCLI",
                        icon: "💤",
                        desc: "Automation",
                        color: "#facc15",
                        bg: "rgba(234, 179, 8, 0.1)",
                        border: "rgba(234, 179, 8, 0.2)",
                      },
                    ].map((tech) => (
                      <div
                        key={tech.name}
                        style={{
                          ...styles.techCard,
                          background: tech.bg,
                          borderColor: tech.border,
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.background = tech.bg.replace(
                            "0.1",
                            "0.2"
                          );
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.background = tech.bg;
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1.875rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {tech.icon}
                        </div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            marginBottom: "0.25rem",
                            color: tech.color,
                          }}
                        >
                          {tech.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {tech.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.featuresGrid}>
                    {[
                      {
                        title: "🚀 GitHub Automation",
                        desc: "Streamline your GitHub workflow with automated repository management",
                      },
                      {
                        title: "📦 Project Scaffolding",
                        desc: "Bootstrap projects with modern tooling and best practices",
                      },
                      {
                        title: "⚡ Lightning Fast",
                        desc: "Optimized performance with modern build tools",
                      },
                      {
                        title: "🎨 Beautiful UI",
                        desc: "Modern design with smooth animations and interactions",
                      },
                    ].map((feature) => (
                      <div key={feature.title} style={styles.featureCard}>
                        <h3 style={styles.featureTitle}>{feature.title}</h3>
                        <p style={styles.featureDesc}>{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              ...styles.actionButtons,
              "@media (min-width: 640px)": { flexDirection: "row" },
            }}
          >
            <a
              href="https://lazycli.xyz"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.background =
                  "linear-gradient(45deg, #2563eb, #7c3aed)";
                e.target.style.boxShadow =
                  "0 10px 25px -5px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.background =
                  "linear-gradient(45deg, #3b82f6, #9333ea)";
                e.target.style.boxShadow =
                  "0 10px 25px -5px rgba(59, 130, 246, 0.25)";
              }}
            >
              🌐 Visit LazyCLI Website
            </a>
            <a
              href="https://github.com/iammhador/LazyCLI"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.btn, ...styles.btnSecondary }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.background = "#64748b";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.background = "#475569";
              }}
            >
              ⭐ Star on GitHub
            </a>
          </div>

          <div style={styles.footer}>
            <p>
              Built with ❤️ using LazyCLI • Start editing{" "}
              <code style={styles.footerCode}>src/App.jsx</code>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
EOF

      # Create custom CSS for non-Tailwind version
      cat > src/App.css << 'EOF'
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.container {
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.header {
  margin-bottom: 2rem;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  margin-bottom: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.logo-icon {
  font-size: 2rem;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.main-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.welcome-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.welcome-text {
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.counter-demo {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.counter-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.counter-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.counter-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.counter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.counter-btn-minus {
  background: #ef4444;
}

.counter-btn-minus:hover {
  background: #dc2626;
}

.counter-btn-plus {
  background: #10b981;
}

.counter-btn-plus:hover {
  background: #059669;
}

.counter-value {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  min-width: 3rem;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.tech-item {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.tech-item:hover {
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.tech-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 640px) {
  .links {
    flex-direction: row;
    justify-content: center;
  }
}

.link {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.link-primary {
  background: #3b82f6;
  color: white;
}

.link-primary:hover {
  background: #2563eb;
}

.link-secondary {
  background: #1f2937;
  color: white;
}

.link-secondary:hover {
  background: #111827;
}

.footer {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.footer code {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
}
EOF
    fi
    
    echo "✅ Custom LazyCLI App.jsx created successfully!"
  fi

  echo "✅ Vite project setup complete!"
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
      pull)
        github_create_pull "$3" "$4"
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