#!/bin/bash

set -e  # Exit on any error

run () {
  local project_name="$1"
  local router="$2"
  local styles="$3"
  local database="$4"
  local orm="$5"

  echo "🚀 Creating project: $project_name"

  if create-electron-foundation "$project_name" --router "$router" --styles "$styles" --database "$database" --orm "$orm" --git --install; then
    echo "✅ Successfully created: $project_name"
  else
    echo "❌ Failed to create: $project_name"
    exit 1
  fi
}

run "tsr-tailwind" "tanstack-router" "tailwind"