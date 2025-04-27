#!/bin/bash

# NewSite.Go - Interactive script for creating new converter projects
# Usage: ./NewSite.Go

echo "🚀 Welcome to the Converter Project Creator 🚀"
echo "---------------------------------------------"
echo ""

# Get primary color
read -p "Enter primary color (hex, example #cc7aaa): " COLOR

# Validate hex color format
if [[ ! $COLOR =~ ^#[0-9A-Fa-f]{6}$ ]]; then
  echo "Error: Invalid hex color format. Please use format #RRGGBB (e.g., #cc7aaa)"
  exit 1
fi

# Get conversion format
read -p "Enter formatToFormat (example: webpToJpg): " FORMAT

# Validate format pattern
if [[ ! $FORMAT =~ ^[a-z]+To[A-Z][a-z]+$ ]]; then
  echo "Error: Invalid format. Please use camelCase format like 'webpToJpg'"
  exit 1
fi

# Get project folder name
read -p "Enter new project folder name: " FOLDER

# Validate folder name
if [[ -z "$FOLDER" ]]; then
  echo "Error: Folder name cannot be empty"
  exit 1
fi

# Generate project name with first letter capitalized
PROJECT_NAME="${FOLDER^}"

echo ""
echo "Creating project with the following settings:"
echo "- Project Directory: $FOLDER"
echo "- Site Name: $PROJECT_NAME"
echo "- Primary Color: $COLOR"
echo "- Conversion Mode: $FORMAT"
echo ""

# Confirm with user
read -p "Proceed with these settings? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo "Operation cancelled by user"
  exit 0
fi

# Run the template creation script
echo ""
echo "Creating project..."
./create-project-from-template.sh "$FOLDER" "$PROJECT_NAME" "$COLOR" "$FORMAT"

echo ""
echo "✅ Project creation complete!"
