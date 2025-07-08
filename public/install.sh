#!/bin/bash

echo "🛠️ Installing LazyCLI..."

mkdir -p ~/.lazycli
curl -s https://lazycli.vercel.app/scripts/lazy.sh -o ~/.lazycli/lazy
chmod +x ~/.lazycli/lazy

# Add to PATH if not already added
if ! grep -qx 'export PATH="$HOME/.lazycli:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.lazycli:$PATH"' >> ~/.bashrc
fi

# Apply to current session if possible
if [ -n "$BASH_VERSION" ]; then
  source ~/.bashrc 2>/dev/null
else
  echo "⚠️ Please restart your terminal or run: source ~/.bashrc"
fi

echo "✅ LazyCLI installed! Run 'lazy --help' to begin. 😎"
