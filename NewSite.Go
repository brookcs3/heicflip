#!/bin/bash

# NewSite.Go - Interactive script for creating new converter projects
# Usage: ./NewSite.Go

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# Use the folder name directly for the project name and repository name
PROJECT_NAME="$FOLDER"

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

# Run the template creation script using the script's directory
echo ""
echo "Creating project..."

# Check if the create-project-from-template.sh script exists in the current directory
if [ -f "$SCRIPT_DIR/create-project-from-template.sh" ]; then
  # Make sure the script is executable
  chmod +x "$SCRIPT_DIR/create-project-from-template.sh"
  
  # Run the script with the provided parameters
  "$SCRIPT_DIR/create-project-from-template.sh" "$FOLDER" "$PROJECT_NAME" "$COLOR" "$FORMAT"
else
  echo "Error: create-project-from-template.sh not found in $SCRIPT_DIR"
  exit 1
fi

echo ""
echo "✅ Project creation complete!"
