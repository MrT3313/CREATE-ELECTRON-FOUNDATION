#!/bin/bash

set -e  # Exit on any error

log_and_run() {
    local project_name="$1"
    local router="$2"
    local styles="$3"
    
    echo "🚀 Creating project: $project_name"
    
    if create-electron-foundation "$project_name" --router "$router" --styles "$styles" --git --install; then
        echo "✅ Successfully created: $project_name"
    else
        echo "❌ Failed to create: $project_name"
        exit 1
    fi
}

echo "🧪 Starting test suite for create-electron-foundation..."

log_and_run "ts-router-with-tailwind" "tanstack-router" "tailwind"
log_and_run "ts-router-no-tailwind" "tanstack-router" "css"
log_and_run "react-router-with-tailwind" "react-router" "tailwind"
log_and_run "react-router-no-tailwind" "react-router" "css"

echo "🎉 All test projects created successfully!"