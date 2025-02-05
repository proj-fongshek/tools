
#set -e  # Exit immediately if a command fails

# Add all changes
git add --all

# Commit with a better message (modify as needed)
git commit -m "Auto commit: $(date +"%Y-%m-%d %H:%M:%S")"

# Push changes to the current branch
git push origin $(git rev-parse --abbrev-ref HEAD)

# Push tags separately if needed
git push --tags

# Show commit summary
git show --summary

