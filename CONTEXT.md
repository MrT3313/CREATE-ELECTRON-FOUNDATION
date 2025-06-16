# Repository Overview: `create-electron-foundation`

This repository contains a Command-Line Interface (CLI) tool, `create-electron-foundation`, used to bootstrap modern, type-safe, and scalable Electron applications. It is **not** an Electron application itself, but a tool for creating them.

## The CLI Tool (`./cli`)

The core of this repository is the scaffolding tool located in the `cli/` directory.

- **Interactive Scaffolding:** It runs a series of prompts to configure the new project.
- **Template-Based:** It uses a modular template system (`cli/template`) to construct the project based on user input.
- **Features:** It handles project creation, dependency installation, and Git initialization.

## The Generated Application (The Template)

The CLI generates a complete Electron application with the following stack and structure. This is the context for the code that gets created in a new project directory.

### Core Architecture

- **Framework:** Electron
- **Process Structure:** Standard Main, Renderer, and Preload process separation.
  - **Main Process:** `electron/main/index.ts` is the entry point. It manages the application lifecycle, creates `BrowserWindow` instances, and handles native OS interactions.
  - **Renderer Process:** `src/main.tsx` is the entry point for the React-based UI. It runs in a sandboxed web page environment.
  - **Preload Scripts:** `electron/preload/index.ts` bridges the gap between the main and renderer processes, securely exposing Node.js APIs to the renderer via the `contextBridge`.

### Tech Stack

- **Bundler:** Vite (`vite.config.ts`) configures the build process for all three processes (main, renderer, and preload).
- **Builder:** `electron-vite` is used for building, packaging, and distributing the application, not Electron Forge.
- **Database ORM & Migrations:** Drizzle (`drizzle.config.ts`) is used for database access and schema migrations.
- **Database:** SQLite is the default database, managed via Drizzle.
- **Testing:** The testing stack includes Vitest for unit/integration tests and Playwright for end-to-end testing. Configuration files for these are generated on demand.
- **Logging:** `electron-log` provides a robust logging solution. Logs from the renderer are proxied to the main process for centralized storage and management in `logs/main.log`.
