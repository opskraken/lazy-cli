#!/bin/bash

echo "🛠️ Installing LazyCLI..."

# Create install directory
mkdir -p ~/.lazycli

# Download lazy.sh from your actual domain
curl -s https://lazycli.vercel.app/scripts/lazy.sh -o ~/.lazycli/lazy

# Make it executable
chmod +x ~/.lazycli/lazy

# Add to PATH in shell config only if not already added
if ! grep -q 'export PATH="$HOME/.lazycli:$PATH"' ~/.bashrc; then
  echo 'export PATH="$HOME/.lazycli:$PATH"' >> ~/.bashrc
fi

# Source the bashrc to update current shell (works only in interactive shells)
source ~/.bashrc 2>/dev/null || echo "⚠️ Please restart your terminal or run 'source ~/.bashrc' to update PATH"

echo "✅ LazyCLI installed! Now you can be productively lazy. Run 'lazy --help' to get started. 😎"

