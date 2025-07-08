#!/bin/bash

echo "🛠️ Installing LazyCLI..."

# Check if curl is installed
if ! command -v curl &> /dev/null
then
  echo "❌ curl is not installed. Please install curl first."
  echo "Visit https://curl.se/download.html for installation instructions."
  exit 1
fi

# Check if bash or WSL is available (simple heuristic)
if [ -z "$BASH_VERSION" ]; then
  if grep -qi microsoft /proc/version 2>/dev/null; then
    echo "✔️ Running under WSL (Windows Subsystem for Linux)."
  else
    echo "❌ Bash shell not detected."
    echo "Please run this script inside a bash shell or WSL environment."
    exit 1
  fi
fi

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
