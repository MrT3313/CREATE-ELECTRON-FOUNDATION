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
  - **Main Process:** `electron/main/`
  - **Renderer Process:** `src/` (using React/JSX)
  - **Preload Scripts:** `electron/preload/`

### Tech Stack

- **Bundler:** Vite
- **Builder:** Electron Forge
- **Database ORM & Migrations:** Drizzle
- **Database:** SQLite
- **Testing:** Jest (Unit/Integration) & Playwright (E2E)
- **Logging:** `electron-log` for centralized logging. Logs from the renderer process are proxied to the main process.
