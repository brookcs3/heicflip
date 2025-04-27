


if [ "$#" -lt 4 ]; then
  echo "Usage: $0 <project-directory> <site-name> <primary-color> <conversion-mode>"
  echo "Example: $0 webpflip \"WebPFlip\" \"#9333ea\" \"webpToJpg\""
  exit 1
fi

PROJECT_DIR="$1"
SITE_NAME="$2"
PRIMARY_COLOR="$3"
CONVERSION_MODE="$4"

INPUT_FORMAT=$(echo "$CONVERSION_MODE" | sed -E 's/([a-z]+)To([A-Z][a-z]+)/\1/g')
OUTPUT_FORMAT=$(echo "$CONVERSION_MODE" | sed -E 's/([a-z]+)To([A-Z][a-z]+)/\2/g')
REPO_NAME="${INPUT_FORMAT^}to${OUTPUT_FORMAT^}"

echo "Creating project with the following settings:"
echo "- Project Directory: $PROJECT_DIR"
echo "- Site Name: $SITE_NAME"
echo "- Primary Color: $PRIMARY_COLOR"
echo "- Conversion Mode: $CONVERSION_MODE"
echo "- Repository Name: $REPO_NAME"

mkdir -p "$PROJECT_DIR"

echo "Copying template files to $PROJECT_DIR..."
cp -r ./client "$PROJECT_DIR/"
cp -r ./server "$PROJECT_DIR/"
cp -r ./shared "$PROJECT_DIR/" 2>/dev/null || :
cp ./package.json "$PROJECT_DIR/"
cp ./package-lock.json "$PROJECT_DIR/" 2>/dev/null || :
cp ./tsconfig.json "$PROJECT_DIR/"
cp ./vite.config.ts "$PROJECT_DIR/"
cp ./tailwind.config.ts "$PROJECT_DIR/"
cp ./postcss.config.js "$PROJECT_DIR/"
cp ./drizzle.config.ts "$PROJECT_DIR/" 2>/dev/null || :
cp ./components.json "$PROJECT_DIR/" 2>/dev/null || :
cp ./.replit "$PROJECT_DIR/" 2>/dev/null || :
cp ./replit.nix "$PROJECT_DIR/" 2>/dev/null || :
cp ./README.md "$PROJECT_DIR/"

if [[ "$PRIMARY_COLOR" == "#10b981" ]]; then
  SECONDARY_COLOR="#059669"
  ACCENT_COLOR="#34d399"
elif [[ "$PRIMARY_COLOR" == "#3b82f6" ]]; then
  SECONDARY_COLOR="#2563eb"
  ACCENT_COLOR="#60a5fa"
elif [[ "$PRIMARY_COLOR" == "#dc2626" ]]; then
  SECONDARY_COLOR="#b91c1c"
  ACCENT_COLOR="#f87171"
elif [[ "$PRIMARY_COLOR" == "#9333ea" ]]; then
  SECONDARY_COLOR="#7e22ce"
  ACCENT_COLOR="#a855f7"
elif [[ "$PRIMARY_COLOR" == "#f97316" ]]; then
  SECONDARY_COLOR="#ea580c"
  ACCENT_COLOR="#fb923c"
elif [[ "$PRIMARY_COLOR" == "#DD7230" ]]; then
  SECONDARY_COLOR="#B85A25"
  ACCENT_COLOR="#F39C6B"
else
  SECONDARY_COLOR=$(echo "$PRIMARY_COLOR" | sed -E 's/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/\1 \2 \3/g' | awk '{
    r = sprintf("%02x", int(int("0x"$1) * 0.8));
    g = sprintf("%02x", int(int("0x"$2) * 0.8));
    b = sprintf("%02x", int(int("0x"$3) * 0.8));
    print "#"r""g""b;
  }')
  
  ACCENT_COLOR=$(echo "$PRIMARY_COLOR" | sed -E 's/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/\1 \2 \3/g' | awk '{
    r_val = int("0x"$1) * 1.2;
    g_val = int("0x"$2) * 1.2;
    b_val = int("0x"$3) * 1.2;
    
    r = sprintf("%02x", r_val > 255 ? 255 : int(r_val));
    g = sprintf("%02x", g_val > 255 ? 255 : int(g_val));
    b = sprintf("%02x", b_val > 255 ? 255 : int(b_val));
    
    print "#"r""g""b;
  }')
fi

cd "$PROJECT_DIR" || exit

rm -f create-project-from-template.sh
rm -f template-tracker-update.sh
rm -f TEMPLATE-USAGE.md

sed -i "s/\"name\": \".*\"/\"name\": \"${SITE_NAME,,}\"/g" package.json

CONFIG_DIR="client/src/config"
mkdir -p "$CONFIG_DIR"

cat > "$CONFIG_DIR/site-config.ts" << EOF
/**
 * Site Configuration
 * This file contains site-specific settings for ${SITE_NAME}
 */

import { ConversionMode } from './conversion-config';

// Define site configuration types
export interface SiteConfig {
  siteName: string;
  defaultConversionMode: ConversionMode;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoText: string;
  domain: string;
  description?: string;
  keywords?: string[];
  showAdvancedOptions?: boolean;
}

// Configuration for ${SITE_NAME}
const siteConfig: SiteConfig = {
  siteName: '${SITE_NAME}',
  defaultConversionMode: '${CONVERSION_MODE}',
  primaryColor: '${PRIMARY_COLOR}',
  secondaryColor: '${SECONDARY_COLOR}',
  accentColor: '${ACCENT_COLOR}',
  logoText: '${SITE_NAME}',
  domain: '${SITE_NAME,,}.com',
  description: 'Convert ${CONVERSION_MODE} in your browser',
  keywords: ['${CONVERSION_MODE}', 'conversion', 'browser-based'],
  showAdvancedOptions: false
};

// Export the site configuration
export { siteConfig };
EOF

cat > "$CONFIG_DIR/index.ts" << EOF
/**
 * Configuration Module
 * Exports all configuration-related functionality
 */

// Export conversion configuration
export * from './conversion-config';

// Export site configuration
export * from './site-config';
EOF

cp "../client/src/config/conversion-config.ts" "$CONFIG_DIR/"

cat > "README.md" << EOF

A high-performance browser-based file conversion platform.


- Fast client-side file conversion
- Web Worker-based parallel processing
- Drag-and-drop interface
- Automatic download handling
- Responsive design
- FFmpeg.wasm-powered conversion


\`\`\`bash
npm install

npm run dev

npm run build
\`\`\`


This project is configured for deployment on Cloudflare Pages.

Build command: \`npm run build\`
Build output directory: \`dist/public\`
EOF

git init
git add .
git commit -m "Initial commit for ${SITE_NAME}"

echo "Creating GitHub repository for ${REPO_NAME}..."
GITHUB_USERNAME=$(gh api user | jq -r '.login' 2>/dev/null)

if [ -z "$GITHUB_USERNAME" ]; then
  GITHUB_USERNAME="YOUR_USERNAME"
fi

if gh repo create "${REPO_NAME}" --public --description "Browser-based ${INPUT_FORMAT} to ${OUTPUT_FORMAT} converter" --source=. --remote=origin --push; then
  FULL_REPO_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
  echo "Repository created successfully: $FULL_REPO_URL"
else
  echo "Repository creation via API failed. This is likely due to API limitations."
  echo ""
  echo "To complete the repository creation:"
  echo "----------------------------------------"
  echo "1. Go to https://github.com/new"
  echo "2. Name the repository: ${REPO_NAME}"
  echo "3. Make it public"
  echo "4. Add the description: Browser-based ${INPUT_FORMAT} to ${OUTPUT_FORMAT} converter"
  echo "5. Create repository"
  echo "6. Then run these commands in your project directory:"
  echo "   cd ${PROJECT_DIR}"
  echo "   git remote add origin https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
  echo "   git push -u origin master"
  echo "----------------------------------------"
  
  read -p "Would you like to try setting up the remote and pushing now? (y/n): " SETUP_REMOTE
  if [[ "$SETUP_REMOTE" == "y" || "$SETUP_REMOTE" == "Y" ]]; then
    echo "Enter your GitHub username:"
    read -p "GitHub username: " GITHUB_USER
    
    if [ -n "$GITHUB_USER" ]; then
      echo "Setting up remote and pushing to GitHub..."
      git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
      if git push -u origin master; then
        FULL_REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}"
        echo "Successfully pushed to $FULL_REPO_URL"
      else
        echo "Push failed. You may need to create the repository first."
        FULL_REPO_URL="(manual creation required)"
      fi
    else
      FULL_REPO_URL="(manual creation required)"
    fi
  else
    FULL_REPO_URL="(manual creation required)"
  fi
fi

cd ..
./template-tracker-update.sh "$SITE_NAME" "$CONVERSION_MODE" "$PRIMARY_COLOR" "$PROJECT_DIR" "$FULL_REPO_URL"

echo "Project created successfully!"
echo "GitHub repository: $FULL_REPO_URL"
echo ""
echo "The code has been pushed to GitHub. You can clone it with:"
echo "git clone $FULL_REPO_URL"
echo ""
echo "To run the project locally:"
echo "1. cd $REPO_NAME"
echo "2. npm install"
echo "3. npm run dev"

read -p "Do you want to remove the local working copy? (y/n): " REMOVE_LOCAL
if [[ "$REMOVE_LOCAL" == "y" || "$REMOVE_LOCAL" == "Y" ]]; then
  echo "Removing local working copy..."
  rm -rf "$PROJECT_DIR"
  echo "Local working copy removed."
fi
