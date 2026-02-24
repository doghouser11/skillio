#!/bin/bash

# GitHub Setup Script for Skillio Platform
# Replace YOUR_GITHUB_USERNAME with your actual username

echo "🚀 Setting up GitHub remote for Skillio Platform..."

# Set your GitHub username here
GITHUB_USERNAME="YOUR_GITHUB_USERNAME"

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/skillio-platform.git

# Rename branch to main (GitHub standard)
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Your repository is now available at:"
echo "🔗 https://github.com/$GITHUB_USERNAME/skillio-platform"
echo ""
echo "🎯 Next steps:"
echo "1. Open your GitHub repo"
echo "2. Copy the HTTPS URL"
echo "3. Use it in Coolify for deployment"