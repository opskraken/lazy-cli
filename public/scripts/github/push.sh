#!/bin/bash

echo "📦 Adding changes..."
git add .

read -p "🔤 Enter commit message: " msg
git commit -m "$msg"

echo "🚀 Pushing to origin/main..."
git push origin main
