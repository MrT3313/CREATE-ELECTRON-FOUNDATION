#!/bin/bash
set -e  # Exit on any error

log_and_run() {
    local project_name="$1" # required
    local router="$2" # required
    local styles="$3" # required
    local database="$4" # optional
    local orm="$5" # optional
    
    echo "🚀 Creating project: $project_name"
    
    # Build command with required args
    local command="create-electron-foundation \"$project_name\" --router=\"$router\" --styles=\"$styles\""
    
    # Add optional args only if they're not empty
    if [ -n "$database" ]; then
        command+=" --database=\"$database\""
    fi
    if [ -n "$orm" ]; then
        command+=" --orm=\"$orm\""
    fi
    
    # Add default flags
    command+=" --git --install"
    
    # Execute the command
    if eval "$command"; then
        echo "✅ Successfully created: $project_name"
    else
        echo "❌ Failed to create: $project_name"
        exit 1
    fi
}

echo "🧪 Starting test suite for create-electron-foundation..."
log_and_run "z-ts-router-with-tailwind" "tanstack-router" "tailwind" 
log_and_run "z-ts-router-with-tailwind-false-false" "tanstack-router" "tailwind" "false" "false"
log_and_run "z-ts-router-with-tailwind-sqlite-drizzle" "tanstack-router" "tailwind" "sqlite" "drizzle"
# log_and_run "z-rr-router-with-tailwind" "react-router" "tailwind" 
# log_and_run "z-rr-router-with-tailwind" "react-router" "tailwind" "false" "false"

echo "🎉 All test projects created successfully!"