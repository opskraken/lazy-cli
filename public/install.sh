#!/bin/bash

echo "🛠️ Installing LazyCLI..."

mkdir -p ~/.lazycli
curl -s https://your-domain.com/scripts/lazy.sh -o ~/.lazycli/lazy
chmod +x ~/.lazycli/lazy

echo 'export PATH="$HOME/.lazycli:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo "✅ Installed! Run 'lazy --help'"
