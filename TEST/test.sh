#!/bin/bash
set -e  # Exit on any error

# Get the current directory and set examples directory path
CURRENT_DIR=$(pwd)
EXAMPLES_DIRECTORY="$CURRENT_DIR/../DOCS/examples/tmp"

# Navigate to examples directory and clean up existing directories
cd "$EXAMPLES_DIRECTORY"
rm -rf tanstack-router tanstack-router-tailwind tanstack-router-tailwind-sqlite-drizzle tanstack-router-sqlite-drizzle react-router react-router-tailwind react-router-tailwind-sqlite-drizzle react-router-sqlite-drizzle

# Create new examples with different configurations
echo "Creating TanStack Router examples..."
create-electron-foundation tanstack-router                            --router=tanstack-router  --styles=none      --database=none       --install_packages=false   --git=true    --ide=cursor
create-electron-foundation tanstack-router-tailwind                   --router=tanstack-router  --styles=tailwind   --database=none       --install_packages=false   --git=true    --ide=cursor

create-electron-foundation react-router                               --router=react-router     --styles=none      --database=none       --install_packages=false   --git=true    --ide=cursor
create-electron-foundation react-router-tailwind                      --router=react-router     --styles=tailwind   --database=none       --install_packages=false   --git=true    --ide=cursor

create-electron-foundation tanstack-router-tailwind-sqlite-drizzle    --router=tanstack-router  --styles=tailwind   --database=sqlite    --install_packages=false   --git=true    --ide=cursor
create-electron-foundation react-router-tailwind-sqlite-drizzle       --router=react-router     --styles=tailwind   --database=sqlite    --install_packages=false   --git=true    --ide=cursor

create-electron-foundation tanstack-router-sqlite-drizzle             --router=tanstack-router  --styles=none      --database=sqlite    --install_packages=false   --git=true    --ide=cursor
create-electron-foundation react-router-sqlite-drizzle                --router=react-router     --styles=none      --database=sqlite    --install_packages=false   --git=true    --ide=cursor

echo "All examples created successfully!"
cd "$CURRENT_DIR"
