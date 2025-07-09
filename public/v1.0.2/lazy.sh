#!/bin/bash

# LazyCLI - Production Ready Version
# Automate your dev flow like a lazy pro 💤

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Constants
readonly VERSION="1.0.3"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly CONFIG_DIR="$HOME/.lazycli"
readonly LOG_FILE="$CONFIG_DIR/lazy.log"
readonly CONFIG_FILE="$CONFIG_DIR/config"
readonly LOCK_FILE="$CONFIG_DIR/lazy.lock"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly NC='\033[0m' # No Color

# Default configuration
declare -A CONFIG=(
    ["default_branch"]="main"
    ["auto_open_editor"]="true"
    ["preferred_package_manager"]="auto"
    ["log_level"]="info"
)

# Initialize directories and config
init_environment() {
    mkdir -p "$CONFIG_DIR"
    
    # Create log file if it doesn't exist
    [[ ! -f "$LOG_FILE" ]] && touch "$LOG_FILE"
    
    # Load configuration
    load_config
}

# Logging functions
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    # Log to file
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
    
    # Log to console based on level
    case "$level" in
        "ERROR")
            echo -e "${RED}❌ $message${NC}" >&2
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $message${NC}" >&2
            ;;
        "INFO")
            echo -e "${GREEN}ℹ️  $message${NC}"
            ;;
        "DEBUG")
            [[ "${CONFIG[log_level]}" == "debug" ]] && echo -e "${BLUE}🔍 $message${NC}"
            ;;
    esac
}

# Configuration management
load_config() {
    if [[ -f "$CONFIG_FILE" ]]; then
        while IFS='=' read -r key value; do
            [[ -n "$key" && ! "$key" =~ ^[[:space:]]*# ]] && CONFIG["$key"]="$value"
        done < "$CONFIG_FILE"
    fi
}

save_config() {
    {
        echo "# LazyCLI Configuration"
        echo "# Generated on $(date)"
        for key in "${!CONFIG[@]}"; do
            echo "$key=${CONFIG[$key]}"
        done
    } > "$CONFIG_FILE"
}

# Lock mechanism to prevent concurrent runs
acquire_lock() {
    if [[ -f "$LOCK_FILE" ]]; then
        local pid=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
        if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
            log "ERROR" "Another instance of LazyCLI is already running (PID: $pid)"
            exit 1
        fi
    fi
    echo $$ > "$LOCK_FILE"
}

release_lock() {
    rm -f "$LOCK_FILE"
}

# Cleanup function
cleanup() {
    release_lock
    log "DEBUG" "Cleanup completed"
}

# Set up trap for cleanup
trap cleanup EXIT

# Validation functions
validate_git_repo() {
    if [[ ! -d ".git" ]]; then
        log "ERROR" "Not a git repository. Please run 'lazy github init' first."
        exit 1
    fi
}

validate_url() {
    local url="$1"
    if [[ ! "$url" =~ ^https?:// ]]; then
        log "ERROR" "Invalid URL format: $url"
        exit 1
    fi
}

validate_branch_name() {
    local branch="$1"
    if [[ ! "$branch" =~ ^[a-zA-Z0-9/_-]+$ ]]; then
        log "ERROR" "Invalid branch name: $branch"
        exit 1
    fi
}

# Package manager detection and operations
detect_package_manager() {
    local preferred="${CONFIG[preferred_package_manager]}"
    
    if [[ "$preferred" != "auto" ]] && command -v "$preferred" &> /dev/null; then
        echo "$preferred"
        return
    fi
    
    # Auto-detect based on lock files
    if [[ -f "bun.lockb" ]]; then
        echo "bun"
    elif [[ -f "pnpm-lock.yaml" ]]; then
        echo "pnpm"
    elif [[ -f "yarn.lock" ]]; then
        echo "yarn"
    elif [[ -f "package-lock.json" ]]; then
        echo "npm"
    elif command -v bun &> /dev/null; then
        echo "bun"
    elif command -v pnpm &> /dev/null; then
        echo "pnpm"
    elif command -v yarn &> /dev/null; then
        echo "yarn"
    elif command -v npm &> /dev/null; then
        echo "npm"
    else
        log "ERROR" "No supported package manager found"
        exit 1
    fi
}

run_package_manager() {
    local action="$1"
    local pm=$(detect_package_manager)
    
    log "INFO" "Using package manager: $pm"
    
    case "$pm" in
        "npm")
            case "$action" in
                "install") npm install ;;
                "build") npm run build ;;
                *) npm "$action" ;;
            esac
            ;;
        "yarn")
            case "$action" in
                "install") yarn ;;
                "build") yarn build ;;
                *) yarn "$action" ;;
            esac
            ;;
        "pnpm")
            case "$action" in
                "install") pnpm install ;;
                "build") pnpm run build ;;
                *) pnpm "$action" ;;
            esac
            ;;
        "bun")
            case "$action" in
                "install") bun install ;;
                "build") bun run build ;;
                *) bun "$action" ;;
            esac
            ;;
    esac
}

# Help function
show_help() {
    cat << EOF
${PURPLE}LazyCLI${NC} – Automate your dev flow like a lazy pro 💤

${BLUE}Usage:${NC}
  lazy [command] [subcommand] [options]

${BLUE}Examples:${NC}
  lazy github init                              Initialize a new Git repository
  lazy github push "Fix: Login API bug"        Push your code with a commit message
  lazy github clone https://github.com/user/repo.git
                                                Clone a GitHub repo and auto-setup project
  lazy github pull development "Add: dark mode"
                                                Pull from base branch, build, commit & create PR
  lazy node-js init                             Initialize a Node.js project
  lazy config set default_branch main          Set configuration
  lazy config get default_branch               Get configuration value
  lazy upgrade                                  Upgrade LazyCLI to the latest version
  lazy --version                                Show version
  lazy --help                                   Show this help

${BLUE}Available Commands:${NC}
  github        Git operations (init, push, clone, pull)
  node-js       Node.js project setup
  next-js       Next.js project creation
  vite-js       Vite project generation
  config        Configuration management
  upgrade       Upgrade LazyCLI to the latest version
  logs          View logs

${BLUE}Configuration:${NC}
  Config file: $CONFIG_FILE
  Log file: $LOG_FILE
  
${BLUE}Environment:${NC}
  Version: $VERSION
  Shell: $SHELL
  OS: $(uname -s)

EOF
}

# Git operations
github_init() {
    log "INFO" "Initializing new Git repository..."

    if [[ -d ".git" ]]; then
        log "WARN" "Git repository already initialized in this directory"
        return 0
    fi

    if ! git init; then
        log "ERROR" "Failed to initialize git repository"
        exit 1
    fi

    # Create initial commit structure
    if [[ ! -f ".gitignore" ]]; then
        cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
build/
dist/
*.tgz

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF
        git add .gitignore
        git commit -m "Initial commit: Add .gitignore"
    fi

    log "INFO" "Git repository initialized successfully!"
}

github_clone() {
    local repo="$1"
    local target_dir="$2"

    if [[ -z "$repo" ]]; then
        log "ERROR" "Repository URL is required"
        echo "Usage: lazy github clone <repo-url> [target-directory]"
        exit 1
    fi

    validate_url "$repo"

    local dir_name="${target_dir:-$(basename "$repo" .git)}"
    
    log "INFO" "Cloning $repo into $dir_name..."
    
    if ! git clone "$repo" "$dir_name"; then
        log "ERROR" "Failed to clone repository"
        exit 1
    fi

    cd "$dir_name" || exit 1
    log "INFO" "Entered directory: $dir_name"

    # Setup project if package.json exists
    if [[ -f "package.json" ]]; then
        log "INFO" "Installing dependencies..."
        if ! run_package_manager "install"; then
            log "WARN" "Failed to install dependencies"
        fi

        # Build if build script exists
        if grep -q '"build"' package.json; then
            log "INFO" "Building project..."
            if ! run_package_manager "build"; then
                log "WARN" "Build failed"
            fi
        fi
    fi

    # Open in editor if configured
    if [[ "${CONFIG[auto_open_editor]}" == "true" ]]; then
        if command -v code &> /dev/null; then
            log "INFO" "Opening project in VS Code..."
            code .
        elif command -v vim &> /dev/null; then
            log "INFO" "Opening project in Vim..."
            vim .
        fi
    fi

    log "INFO" "Clone setup completed successfully!"
}

github_push() {
    local msg="$1"
    
    validate_git_repo
    
    if [[ -z "$msg" ]]; then
        log "ERROR" "Commit message is required"
        echo "Usage: lazy github push \"Your commit message\""
        exit 1
    fi

    # Check for staged changes
    if git diff --cached --quiet; then
        log "INFO" "Staging all changes..."
        git add .
        
        # Check again after staging
        if git diff --cached --quiet; then
            log "WARN" "No changes to commit"
            return 0
        fi
    fi

    log "INFO" "Committing changes..."
    if ! git commit -m "$msg"; then
        log "ERROR" "Commit failed"
        exit 1
    fi

    local branch
    branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ -z "$branch" ]]; then
        log "ERROR" "Could not detect current branch"
        exit 1
    fi

    log "INFO" "Pushing to origin/$branch..."
    
    # Try to push with upstream setting if it fails
    if ! git push origin "$branch" 2>/dev/null; then
        log "INFO" "Setting upstream and pushing..."
        if ! git push --set-upstream origin "$branch"; then
            log "ERROR" "Push failed"
            exit 1
        fi
    fi

    log "INFO" "Changes pushed to origin/$branch successfully! 🎉"
}

github_pull_request() {
    local base_branch="$1"
    local commit_msg="$2"

    validate_git_repo
    
    if [[ -z "$base_branch" || -z "$commit_msg" ]]; then
        log "ERROR" "Base branch and commit message are required"
        echo "Usage: lazy github pull <base-branch> \"<commit-message>\""
        exit 1
    fi

    validate_branch_name "$base_branch"

    local current_branch
    current_branch=$(git rev-parse --abbrev-ref HEAD)
    
    if [[ -z "$current_branch" ]]; then
        log "ERROR" "Could not detect current branch"
        exit 1
    fi

    log "INFO" "Pulling latest changes from $base_branch..."
    if ! git pull origin "$base_branch"; then
        log "ERROR" "Failed to pull from $base_branch"
        exit 1
    fi

    # Install dependencies if package.json exists
    if [[ -f "package.json" ]]; then
        log "INFO" "Installing dependencies..."
        run_package_manager "install"
    fi

    # Stage and commit changes
    git add .
    
    if ! git diff --cached --quiet; then
        log "INFO" "Committing changes: $commit_msg"
        git commit -m "$commit_msg"
    else
        log "INFO" "No changes to commit"
    fi

    log "INFO" "Pushing to origin/$current_branch..."
    git push origin "$current_branch"

    # Create PR with GitHub CLI if available
    if command -v gh &> /dev/null; then
        log "INFO" "Creating pull request: $current_branch → $base_branch"
        if gh pr create --base "$base_branch" --head "$current_branch" --title "$commit_msg" --body "$commit_msg"; then
            log "INFO" "Pull request created successfully!"
        else
            log "WARN" "Failed to create pull request via GitHub CLI"
        fi
    else
        log "WARN" "GitHub CLI not installed. Install from: https://cli.github.com/"
    fi

    log "INFO" "Pull request workflow completed!"
}

# Project initialization functions
node_js_init() {
    log "INFO" "Initializing Node.js project..."
    
    if [[ -f "package.json" ]]; then
        log "WARN" "package.json already exists"
        return 0
    fi
    
    if ! npm init -y; then
        log "ERROR" "Failed to initialize Node.js project"
        exit 1
    fi
    
    log "INFO" "Node.js project initialized successfully!"
}

next_js_create() {
    log "INFO" "Creating Next.js application..."
    
    if ! npx create-next-app@latest; then
        log "ERROR" "Failed to create Next.js application"
        exit 1
    fi
    
    log "INFO" "Next.js application created successfully!"
}

vite_js_create() {
    log "INFO" "Creating Vite application..."
    
    if ! npm create vite@latest; then
        log "ERROR" "Failed to create Vite application"
        exit 1
    fi
    
    log "INFO" "Vite application created successfully!"
}

# Configuration management
config_set() {
    local key="$1"
    local value="$2"
    
    if [[ -z "$key" || -z "$value" ]]; then
        log "ERROR" "Key and value are required"
        echo "Usage: lazy config set <key> <value>"
        exit 1
    fi
    
    CONFIG["$key"]="$value"
    save_config
    log "INFO" "Configuration set: $key=$value"
}

config_get() {
    local key="$1"
    
    if [[ -z "$key" ]]; then
        log "ERROR" "Key is required"
        echo "Usage: lazy config get <key>"
        exit 1
    fi
    
    if [[ -n "${CONFIG[$key]:-}" ]]; then
        echo "${CONFIG[$key]}"
    else
        log "ERROR" "Configuration key not found: $key"
        exit 1
    fi
}

config_list() {
    echo "Current configuration:"
    for key in "${!CONFIG[@]}"; do
        echo "  $key=${CONFIG[$key]}"
    done
}

# Upgrade function
upgrade_lazycli() {
    log "INFO" "Upgrading LazyCLI..."
    
    local temp_file="/tmp/lazy_new"
    
    if ! curl -fsSL https://lazycli.vercel.app/scripts/lazy.sh -o "$temp_file"; then
        log "ERROR" "Failed to download latest version"
        exit 1
    fi
    
    # Validate downloaded file
    if [[ ! -s "$temp_file" ]]; then
        log "ERROR" "Downloaded file is empty"
        exit 1
    fi
    
    # Backup current version
    cp "$0" "$CONFIG_DIR/lazy.backup"
    
    # Install new version
    chmod +x "$temp_file"
    mv "$temp_file" "$0"
    
    log "INFO" "LazyCLI upgraded successfully!"
}

# Log viewing
show_logs() {
    local lines="${1:-50}"
    
    if [[ -f "$LOG_FILE" ]]; then
        tail -n "$lines" "$LOG_FILE"
    else
        log "INFO" "No logs found"
    fi
}

# Main CLI router
main() {
    acquire_lock
    
    case "${1:-}" in
        --help | help | "")
            show_help
            ;;
        --version | -v)
            echo "LazyCLI v$VERSION"
            ;;
        upgrade)
            upgrade_lazycli
            ;;
        logs)
            show_logs "${2:-50}"
            ;;
        config)
            case "${2:-}" in
                set)
                    config_set "$3" "$4"
                    ;;
                get)
                    config_get "$3"
                    ;;
                list)
                    config_list
                    ;;
                *)
                    log "ERROR" "Unknown config subcommand: ${2:-}"
                    echo "Usage: lazy config [set|get|list]"
                    exit 1
                    ;;
            esac
            ;;
        github)
            case "${2:-}" in
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
                    github_pull_request "$3" "$4"
                    ;;
                *)
                    log "ERROR" "Unknown github subcommand: ${2:-}"
                    echo "Usage: lazy github [init|clone|push|pull]"
                    exit 1
                    ;;
            esac
            ;;
        node-js)
            case "${2:-}" in
                init)
                    node_js_init
                    ;;
                *)
                    log "ERROR" "Unknown node-js subcommand: ${2:-}"
                    echo "Usage: lazy node-js [init]"
                    exit 1
                    ;;
            esac
            ;;
        next-js)
            case "${2:-}" in
                create)
                    next_js_create
                    ;;
                *)
                    log "ERROR" "Unknown next-js subcommand: ${2:-}"
                    echo "Usage: lazy next-js [create]"
                    exit 1
                    ;;
            esac
            ;;
        vite-js)
            case "${2:-}" in
                create)
                    vite_js_create
                    ;;
                *)
                    log "ERROR" "Unknown vite-js subcommand: ${2:-}"
                    echo "Usage: lazy vite-js [create]"
                    exit 1
                    ;;
            esac
            ;;
        *)
            log "ERROR" "Unknown command: ${1:-}"
            show_help
            exit 1
            ;;
    esac
}

# Initialize environment and run main function
init_environment
main "$@"