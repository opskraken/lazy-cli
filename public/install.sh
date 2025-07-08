#!/bin/bash

echo "🛠️ Installing LazyCLI..."

INSTALL_DIR="$HOME/.lazycli"
LAZY_SCRIPT="$INSTALL_DIR/lazy"
SHELL_CONFIG="$HOME/.bashrc"

# Detect shell config (zsh or bash)
if [[ "$SHELL" == *"zsh" ]]; then
  SHELL_CONFIG="$HOME/.zshrc"
elif [[ "$SHELL" == *"bash" ]]; then
  SHELL_CONFIG="$HOME/.bashrc"
elif [[ -f "$HOME/.profile" ]]; then
  SHELL_CONFIG="$HOME/.profile"
fi

# Ensure install directory exists
mkdir -p "$INSTALL_DIR" || {
  echo "❌ Failed to create install directory: $INSTALL_DIR"
  echo "👉 Try running with sudo or check permissions."
  exit 1
}

# Remove previous version if it exists
rm -f "$LAZY_SCRIPT"

# Download latest lazy.sh
if curl -s https://lazycli.vercel.app/scripts/lazy.sh -o "$LAZY_SCRIPT"; then
  chmod +x "$LAZY_SCRIPT"
else
  echo "❌ Failed to download LazyCLI."
  exit 1
fi

# Add to PATH only if not already present
if ! grep -qx 'export PATH="$HOME/.lazycli:$PATH"' "$SHELL_CONFIG"; then
  echo 'export PATH="$HOME/.lazycli:$PATH"' >> "$SHELL_CONFIG"
  echo "📌 Added LazyCLI to your PATH in $SHELL_CONFIG"
fi

# Try to apply path immediately
export PATH="$HOME/.lazycli:$PATH"

# Confirm installation
if command -v lazy &> /dev/null; then
  echo "✅ LazyCLI installed! Run 'lazy --help' to begin. 😎"
else
  echo "⚠️ Installed, but not yet available in this shell."
  echo "👉 Please run: source $SHELL_CONFIG"
fi
