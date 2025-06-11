#!/bin/bash
set -e  # Exit on any error

cd examples && \
rm -rf z-tsr z-tsr-tailwind z-tsr-tailwind-sqlite-drizzle && \
create-electron-foundation z-tsr                          --router=tanstack-router --styles=false     --database=false  --orm=false && \
create-electron-foundation z-tsr-tailwind                 --router=tanstack-router --styles=tailwind  --database=false  --orm=false && \
create-electron-foundation z-tsr-tailwind-sqlite-drizzle  --router=tanstack-router --styles=tailwind  --database=sqlite --orm=drizzle
