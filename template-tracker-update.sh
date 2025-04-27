


if [ "$#" -lt 4 ]; then
  echo "Usage: $0 <site-name> <conversion-mode> <primary-color> <project-dir> [repo-url]"
  exit 1
fi

SITE_NAME="$1"
CONVERSION_MODE="$2"
PRIMARY_COLOR="$3"
PROJECT_DIR="$4"
REPO_URL="${5:-}"

TRACKER_DIR="$HOME/template-tracker"
mkdir -p "$TRACKER_DIR"

if [ ! -d "$TRACKER_DIR/.git" ]; then
  echo "Initializing template tracker repository..."
  cd "$TRACKER_DIR" || exit
  git init
  echo "# Template Tracker" > README.md
  echo "A central repository to track all projects created from the HEICFlip template." >> README.md
  echo "" >> README.md
  echo "## Projects" >> README.md
  git add README.md
  git commit -m "Initial commit"
  
  echo "[]" > conversions.json
  git add conversions.json
  git commit -m "Add conversions.json"
fi

cd "$TRACKER_DIR" || exit

CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

CONVERSIONS=$(cat conversions.json)

NEW_ENTRY="{
  \"siteName\": \"$SITE_NAME\",
  \"conversionMode\": \"$CONVERSION_MODE\",
  \"primaryColor\": \"$PRIMARY_COLOR\",
  \"projectDir\": \"$PROJECT_DIR\",
  \"createdAt\": \"$CURRENT_DATE\",
  \"repoUrl\": \"$REPO_URL\"
}"

if [ "$CONVERSIONS" = "[]" ]; then
  echo "[$NEW_ENTRY]" > conversions.json
else
  echo "$CONVERSIONS" | sed -e "s/\]/$NEW_ENTRY,\]/" > conversions.json
fi

README=$(cat README.md)

if [[ -n "$REPO_URL" ]]; then
  NEW_PROJECT="| $SITE_NAME | $CONVERSION_MODE | $PRIMARY_COLOR | $CURRENT_DATE | [$REPO_URL]($REPO_URL) |"
else
  NEW_PROJECT="| $SITE_NAME | $CONVERSION_MODE | $PRIMARY_COLOR | $CURRENT_DATE | - |"
fi

if ! grep -q "| Site Name | Conversion Mode | Primary Color | Created At | Repository |" README.md; then
  echo "" >> README.md
  echo "| Site Name | Conversion Mode | Primary Color | Created At | Repository |" >> README.md
  echo "| --- | --- | --- | --- | --- |" >> README.md
fi

sed -i "/| --- | --- | --- | --- | --- |/a $NEW_PROJECT" README.md

git add conversions.json README.md
git commit -m "Add $SITE_NAME project"

echo "Template tracker updated successfully."
