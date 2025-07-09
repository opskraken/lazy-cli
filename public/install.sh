#!/bin/bash

# LazyCLI Cross-Platform Installer
# Works on Linux, macOS, and Windows (Git Bash/WSL)

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

print_status() { echo -e "${BLUE}🛠️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

detect_os() {
    case "$OSTYPE" in
        linux*) echo "linux" ;;
        darwin*) echo "macos" ;;
        msys*|cygwin*) echo "windows" ;;
        *) echo "unknown" ;;
    esac
}

get_shell_config() {
    if [[ -n "${ZSH_VERSION:-}" ]]; then
        echo "$HOME/.zshrc"
    elif [[ -n "${BASH_VERSION:-}" ]]; then
        [[ "$(detect_os)" == "macos" && -f "$HOME/.bash_profile" ]] && echo "$HOME/.bash_profile" || echo "$HOME/.bashrc"
    else
        echo "$HOME/.bashrc"
    fi
}

check_requirements() {
    local missing=()
    command -v git >/dev/null || missing+=("git")
    command -v curl >/dev/null || command -v wget >/dev/null || missing+=("curl or wget")
    (( ${#missing[@]} )) && {
        print_error "Missing: ${missing[*]}"
        print_status "Please install them first."
        exit 1
    }
}

install_lazycli() {
    local version="${1:-latest}"
    print_status "Installing LazyCLI (${version})..."
    check_requirements

    local os=$(detect_os)
    local install_dir="$HOME/.lazycli"
    local binary_path="$install_dir/lazy"

    [[ -f "$binary_path" ]] && { print_status "Removing old version..."; rm -f "$binary_path"; }
    mkdir -p "$install_dir" || { print_error "Permission denied to create $install_dir"; exit 1; }

    local url=""
if [[ "$version" == "latest" ]]; then
    url="https://lazycli.xyz/scripts/lazy.sh"
else
    url="https://lazycli.xyz/versions/$version/lazy.sh"
fi

    print_status "Downloading from: $url"
    if command -v curl >/dev/null; then
        curl -fsSL "$url" -o "$binary_path" || { print_error "Download failed."; exit 1; }
    else
        wget -q "$url" -O "$binary_path" || { print_error "Download failed."; exit 1; }
    fi

    chmod +x "$binary_path"

    local shell_config=$(get_shell_config)
    local path_export='export PATH="$HOME/.lazycli:$PATH"'

    if [[ -f "$shell_config" ]]; then
        grep -qF "$path_export" "$shell_config" || {
            echo "" >> "$shell_config"
            echo "# LazyCLI" >> "$shell_config"
            echo "$path_export" >> "$shell_config"
            print_success "Added LazyCLI to PATH in $shell_config"
        }
    else
        echo "$path_export" > "$shell_config"
        print_success "Created $shell_config and added PATH"
    fi

    [[ ":$PATH:" != *":$HOME/.lazycli:"* ]] && export PATH="$HOME/.lazycli:$PATH"
    print_success "LazyCLI $version installed!"

    echo
    print_status "Next steps:"
    echo "1. Restart terminal or run: source $shell_config"
    echo "2. Then run: lazy --help"
}

uninstall_lazycli() {
    print_status "Uninstalling LazyCLI..."
    local install_dir="$HOME/.lazycli"
    local shell_config=$(get_shell_config)

    [[ -f "$install_dir/lazy" ]] && { rm -f "$install_dir/lazy"; print_success "Removed binary"; }
    [[ -d "$install_dir" && -z "$(ls -A "$install_dir")" ]] && rmdir "$install_dir" && print_success "Removed directory"

    if [[ -f "$shell_config" ]]; then
        cp "$shell_config" "$shell_config.backup"
        sed -i '/# LazyCLI/,+1d' "$shell_config" 2>/dev/null || {
            sed '/# LazyCLI/,+1d' "$shell_config" > "$shell_config.tmp" && mv "$shell_config.tmp" "$shell_config"
        }
        print_success "Removed PATH from $shell_config"
    fi

    print_success "Uninstalled LazyCLI!"
    print_status "Run: source $shell_config or restart terminal"
}

main() {
    case "${1:-install}" in
        install)
            install_lazycli "${2:-latest}"
            ;;
        uninstall)
            uninstall_lazycli
            ;;
        --help | help)
            echo "LazyCLI Installer"
            echo "Usage:"
            echo "  $0 [install] [version]   Install LazyCLI (default: latest)"
            echo "  $0 uninstall             Uninstall LazyCLI"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use --help for usage"
            exit 1
            ;;
    esac
}

main "$@"
