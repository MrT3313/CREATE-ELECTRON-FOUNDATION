#!/bin/bash
set -e  # Exit on any error

# Get the current directory and set examples directory path
CURRENT_DIR=$(pwd)
EXAMPLES_DIRECTORY="$CURRENT_DIR/../DOCS/examples/tmp"

# Navigate to examples directory and clean up existing directories
cd "$EXAMPLES_DIRECTORY"
rm -rf tsr tsr-tailwind tsr-tailwind-sqlite-drizzle tsr-sqlite-drizzle rr rr-tailwind rr-tailwind-sqlite-drizzle rr-sqlite-drizzle

# Create new examples with different configurations
echo "Creating TanStack Router examples..."
create-electron-foundation tsr                            --router=tanstack-router  --styles=none       --database=none      --install_packages=false   --git=true    --ide=cursor
create-electron-foundation tsr-tailwind                   --router=tanstack-router  --styles=tailwind   --database=none      --install_packages=false   --git=true    --ide=cursor

create-electron-foundation rr                             --router=react-router     --styles=none       --database=none      --install_packages=false   --git=true    --ide=cursor
create-electron-foundation rr-tailwind                    --router=react-router     --styles=tailwind   --database=none      --install_packages=false   --git=true    --ide=cursor

create-electron-foundation tsr-tailwind-sqlite-drizzle    --router=tanstack-router  --styles=tailwind   --database=sqlite    --install_packages=false   --git=true    --ide=cursor
create-electron-foundation rr-tailwind-sqlite-drizzle     --router=react-router     --styles=tailwind   --database=sqlite    --install_packages=false   --git=true    --ide=cursor

create-electron-foundation tsr-sqlite-drizzle             --router=tanstack-router  --styles=none       --database=sqlite    --install_packages=false   --git=true    --ide=cursor
create-electron-foundation rr-sqlite-drizzle              --router=react-router     --styles=none       --database=sqlite    --install_packages=false   --git=true    --ide=cursor

echo "All examples created successfully!"
cd "$CURRENT_DIR"
