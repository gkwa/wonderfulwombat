#!/bin/bash
set -e

echo "=== Setting up WonderfulWombat ==="

# Install Node dependencies
echo "Installing Node dependencies..."
pnpm install

# Build Go decompressor
echo "Building Go decompressor..."
go build -o wonderfulwombat-go

# Make Node script executable
echo "Making Node script executable..."
chmod +x src/index.js

# Create test directory
mkdir -p test

echo "Setup complete!"
