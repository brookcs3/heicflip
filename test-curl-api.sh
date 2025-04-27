#!/bin/bash

# Test script to simulate GitHub API calls for repository creation
echo "Testing curl-based GitHub API repository creation..."

# Simulate successful repository creation
echo "Simulating successful repository creation with curl..."
REPO_NAME="TestRepo"
GITHUB_USERNAME="test-user"

# Create a mock response that looks like a successful GitHub API response
MOCK_RESPONSE="{
  \"name\": \"$REPO_NAME\",
  \"full_name\": \"$GITHUB_USERNAME/$REPO_NAME\",
  \"html_url\": \"https://github.com/$GITHUB_USERNAME/$REPO_NAME\",
  \"private\": false,
  \"description\": \"Test repository created with curl\"
}"

echo "Mock API Response:"
echo "$MOCK_RESPONSE"

# Test parsing the response - fix the pattern to match the JSON format
if echo "$MOCK_RESPONSE" | grep -q "\"name\": \"$REPO_NAME\""; then
  echo "✅ Successfully parsed repository name from response"
else
  echo "❌ Failed to parse repository name from response"
fi

# Test error handling
echo ""
echo "Simulating error response..."
ERROR_RESPONSE="{
  \"message\": \"Repository creation failed: name already exists on this account\",
  \"documentation_url\": \"https://docs.github.com/rest/reference/repos#create-a-repository-for-the-authenticated-user\"
}"

echo "Mock Error Response:"
echo "$ERROR_RESPONSE"

# Test parsing error message - fix the pattern extraction
ERROR_MESSAGE=$(echo "$ERROR_RESPONSE" | grep -o '\"message\": \"[^\"]*\"' | sed 's/\"message\": \"//')
echo "Parsed error message: $ERROR_MESSAGE"

if [[ "$ERROR_MESSAGE" == *"already exists"* ]]; then
  echo "✅ Successfully detected 'already exists' error"
else
  echo "❌ Failed to detect 'already exists' error"
fi

echo ""
echo "Testing the exact pattern used in our script..."
if echo "$MOCK_RESPONSE" | grep -q "\"name\":\"$REPO_NAME\""; then
  echo "✅ Script pattern works with no spaces"
else
  echo "❌ Script pattern fails with no spaces"
fi

echo ""
echo "Recommendation: Update script to handle both JSON formats (with/without spaces)"
echo "Pattern should be: grep -q '\"name\"[[:space:]]*:[[:space:]]*\"$REPO_NAME\"'"

echo ""
echo "All tests completed."
