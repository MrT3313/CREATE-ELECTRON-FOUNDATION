#!/bin/bash
set -e  # Exit on any error

NAME=z-tsr-tailwind-sqlite-drizzle

cd examples && \
rm -rf $NAME && \
create-electron-foundation $NAME --router=tanstack-router --styles=tailwind  --database=sqlite --orm=drizzle
