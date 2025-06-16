#!/bin/bash
set -e  # Exit on any error

# Get the current directory and set examples directory path
CURRENT_DIR=$(pwd)
EXAMPLES_DIRECTORY="$CURRENT_DIR/../DOCS/examples"

# Navigate to examples directory and clean up existing directories
cd "$EXAMPLES_DIRECTORY"
rm -rf z-tsr z-tsr-tailwind z-tsr-tailwind-sqlite-drizzle z-tsr-sqlite-drizzle z-rr z-rr-tailwind z-rr-tailwind-sqlite-drizzle z-rr-sqlite-drizzle

# Create new examples with different configurations
echo "Creating TanStack Router examples..."
create-electron-foundation z-tsr                          --router=tanstack-router  --styles=false      --database=false    --orm=false     --ide=cursor  --install_packages  --git  
create-electron-foundation z-tsr-tailwind                 --router=tanstack-router  --styles=tailwind   --database=false    --orm=false     --ide=vscode  --install_packages  --git  

create-electron-foundation z-rr                           --router=react-router     --styles=false      --database=false    --orm=false     --ide=cursor  --install_packages  --git  
create-electron-foundation z-rr-tailwind                  --router=react-router     --styles=tailwind   --database=false    --orm=false     --ide=cursor  --install_packages  --git  

create-electron-foundation z-tsr-tailwind-sqlite-drizzle  --router=tanstack-router  --styles=tailwind   --database=sqlite   --orm=drizzle   --ide=cursor  --install_packages  --git  
create-electron-foundation z-rr-tailwind-sqlite-drizzle   --router=react-router     --styles=tailwind   --database=sqlite   --orm=drizzle   --ide=vscode  --install_packages  --git  

create-electron-foundation z-tsr-sqlite-drizzle           --router=tanstack-router  --styles=false      --database=sqlite   --orm=drizzle   --ide=cursor  --install_packages  --git  
create-electron-foundation z-rr-sqlite-drizzle            --router=react-router     --styles=false      --database=sqlite   --orm=drizzle   --ide=cursor  --install_packages  --git  

echo "All examples created successfully!"
cd "$CURRENT_DIR"
