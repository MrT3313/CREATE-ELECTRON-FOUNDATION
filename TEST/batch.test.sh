#!/bin/bash
set -e  # Exit on any error

log_and_run() {
    local project_name=""
    local router=""
    local styles=""
    local database=""
    local orm=""
    
    # Parse named arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --project-name=*|--name=*)
                project_name="${1#*=}"
                shift
                ;;
            --router=*)
                router="${1#*=}"
                shift
                ;;
            --styles=*)
                styles="${1#*=}"
                shift
                ;;
            --database=*)
                database="${1#*=}"
                shift
                ;;
            --orm=*)
                orm="${1#*=}"
                shift
                ;;
            *)
                echo "Unknown option $1"
                exit 1
                ;;
        esac
    done
    
    # Validate required parameters
    if [ -z "$project_name" ] || [ -z "$router" ]; then
        echo "❌ Error: --project-name and --router are required"
        exit 1
    fi
    
    echo "🚀 Creating project: $project_name"
    
    # Build command with required args
    local command="create-electron-foundation \"$project_name\" --router=\"$router\""
    
    # Add optional args only if they're not empty
    if [ -n "$styles" ]; then
        command+=" --styles=\"$styles\""
    fi
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

## TANSTACK ROUTER
log_and_run --name="z-ts-router"                                --router="tanstack-router"
log_and_run --name="z-ts-router-with-tailwind-no-db-no-orm"     --router="tanstack-router" --styles="tailwind"  --database="false"  --orm="false"
log_and_run --name="z-ts-router-with-tailwind-sqlite-drizzle"   --router="tanstack-router" --styles="tailwind"  --database="sqlite" --orm="drizzle"
log_and_run --name="z-ts-router-no-styles-no-db-no-orm"         --router="tanstack-router" --styles="false"     --database="false"  --orm="false"
log_and_run --name="z-ts-router-no-styles-with-sqlite-drizzle"  --router="tanstack-router" --styles="false"     --database="sqlite" --orm="drizzle"

## REACT ROUTER
# log_and_run --name="z-rr-router" --router="react-router"
# log_and_run --name="z-rr-router-with-tailwind" --router="react-router" --styles="tailwind"
# log_and_run --name="z-rr-router-no-styles-no-db-no-orm" --router="react-router"
# log_and_run --name="z-rr-router-with-tailwind-sqlite-drizzle" --router="react-router" --styles="tailwind" --database="sqlite" --orm="drizzle"
# log_and_run --name="z-rr-router-no-styles-with-sqlite-drizzle" --router="react-router" --database="sqlite" --orm="drizzle"

echo "🎉 All test projects created successfully!"