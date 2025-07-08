#!/bin/bash

VERSION="1.0.1"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
  github        Git operations (init, push, pull, clone)
  node-js       Node.js project setup
  next-js       Next.js project creation
  vite-js       Vite project generation

EOF
}

# Core CLI router
case "$1" in
  --help | help )
    show_help
    exit 0
    ;;
  --version | -v )
    echo "LazyCLI v$VERSION"
    exit 0
    ;;
  github )
    SUBCOMMAND="$2"

    case "$SUBCOMMAND" in
      push | clone )
        SCRIPT_PATH="$BASE_DIR/scripts/github/$SUBCOMMAND.sh"
        if [ -f "$SCRIPT_PATH" ]; then
          bash "$SCRIPT_PATH"
        else
          echo "❌ Subcommand script not found: $SUBCOMMAND for github"
          echo "👉 Use: lazy github --help"
          exit 1
        fi
        ;;
      * )
        echo "❌ Unknown github subcommand: $SUBCOMMAND"
        echo "👉 Use: lazy github --help"
        exit 1
        ;;
    esac
    ;;
  node-js | next-js | vite-js )
    COMMAND="$1"
    SUBCOMMAND="$2"

    SCRIPT_PATH="$BASE_DIR/scripts/$COMMAND/$SUBCOMMAND.sh"

    if [ -f "$SCRIPT_PATH" ]; then
      bash "$SCRIPT_PATH"
    else
      echo "❌ Unknown subcommand: $SUBCOMMAND for $COMMAND"
      echo "👉 Use: lazy $COMMAND --help"
      exit 1
    fi
    ;;
  * )
    echo "❌ Unknown command: $1"
    echo "👉 Use: lazy --help"
    exit 1
    ;;
esac
