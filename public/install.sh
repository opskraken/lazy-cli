#!/bin/bash

echo "🛠️ Installing LazyCLI..."

mkdir -p ~/.lazycli
curl -s https://lazycli.vercel.app/scripts/lazy.sh -o ~/.lazycli/lazy
chmod +x ~/.lazycli/lazy

# Add to PATH if not already added
if ! grep -q 'export PATH="$HOME/.lazycli:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.lazycli:$PATH"' >> ~/.bashrc
fi

# Source to update current shell environment, if possible
source ~/.bashrc 2>/dev/null || echo "⚠️ Please restart your terminal or run 'source ~/.bashrc'"

echo "✅ Installed! Run 'lazy --help'"
