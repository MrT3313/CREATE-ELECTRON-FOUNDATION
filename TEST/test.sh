#!/bin/bash
set -e  # Exit on any error

# Get the current directory and set examples directory path
CURRENT_DIR=$(pwd)
EXAMPLES_DIRECTORY="$CURRENT_DIR/../DOCS/examples"

# Navigate to examples directory and clean up existing directories
cd "$EXAMPLES_DIRECTORY"
rm -rf tanstack-router tanstack-router-tailwind tanstack-router-tailwind-sqlite-drizzle tanstack-router-sqlite-drizzle react-router react-router-tailwind react-router-tailwind-sqlite-drizzle react-router-sqlite-drizzle

# Create new examples with different configurations
echo "Creating TanStack Router examples..."
create-electron-foundation tanstack-router                            --router=tanstack-router  --styles=false      --database=false      --orm=false      --install_packages=false   --git=false    --ide=false
create-electron-foundation tanstack-router-tailwind                   --router=tanstack-router  --styles=tailwind   --database=false      --orm=false      --install_packages=false   --git=false    --ide=false

create-electron-foundation react-router                               --router=react-router     --styles=false      --database=false      --orm=false      --install_packages=false   --git=false    --ide=false
create-electron-foundation react-router-tailwind                      --router=react-router     --styles=tailwind   --database=false      --orm=false      --install_packages=false   --git=false    --ide=false

create-electron-foundation tanstack-router-tailwind-sqlite-drizzle    --router=tanstack-router  --styles=tailwind   --database=sqlite     --orm=drizzle    --install_packages=false   --git=false    --ide=false
create-electron-foundation react-router-tailwind-sqlite-drizzle       --router=react-router     --styles=tailwind   --database=sqlite     --orm=drizzle    --install_packages=false   --git=false    --ide=false

create-electron-foundation tanstack-router-sqlite-drizzle             --router=tanstack-router  --styles=false      --database=sqlite     --orm=drizzle    --install_packages=false   --git=false    --ide=false
create-electron-foundation react-router-sqlite-drizzle                --router=react-router     --styles=false      --database=sqlite     --orm=drizzle    --install_packages=false   --git=false    --ide=false

echo "All examples created successfully!"
cd "$CURRENT_DIR"
