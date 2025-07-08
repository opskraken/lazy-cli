#!/bin/bash

echo "🛠️ Installing LazyCLI..."

# Remove old version if exists
rm -f ~/.lazycli/lazy

# Create directory (if not already exists)
mkdir -p ~/.lazycli

# Download latest lazy.sh
curl -s https://lazycli.vercel.app/scripts/lazy.sh -o ~/.lazycli/lazy
chmod +x ~/.lazycli/lazy

# Add to PATH only if not already added
if ! grep -qx 'export PATH="$HOME/.lazycli:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.lazycli:$PATH"' >> ~/.bashrc
fi

# Source updated path if interactive shell
if [ -n "$BASH_VERSION" ]; then
  source ~/.bashrc 2>/dev/null
else
  echo "⚠️ Please restart your terminal or run: source ~/.bashrc"
fi

echo "✅ LazyCLI installed! Run 'lazy --help' to begin. 😎"
