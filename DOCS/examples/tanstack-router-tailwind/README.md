# Create Electron Foundation

> [!IMPORTANT]
> This project is best managed through its [makefile](./makefile), which automates many of the complex steps described below.

This template provides a robust foundation for Electron applications that require native Node.js modules, featuring `better-sqlite3` for database operations and `Drizzle ORM` for type-safe queries.

## Core Concept: The Native Module Challenge

Electron uses its own internal build of Node.js, which is often different from the Node.js version you use in your terminal. This leads to a critical issue:

- **ABI Mismatch**: Native modules (like `better-sqlite3`) are C++ addons compiled into `.node` files. These files are highly specific to the Node.js version they were built against, defined by an Application Binary Interface (ABI). If a module's ABI doesn't match Electron's ABI, your app will crash.

> [!WARNING]
>
> ⚠️ **You must recompile native modules against Electron's specific ABI**, not your system's Node.js version.

We use `@electron/rebuild` to automate this recompilation process.

## 1. Prerequisites

Before you begin, ensure your system has the necessary build tools for compiling native modules. `node-gyp`, the tool used for compilation, requires:

- **Node.js**: Use the version specified in the `.nvmrc` file (`nvm use`).
- **Python**: Version 3.x.
- **C++ Compiler**:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`).
  - **Windows**: Visual Studio with "Desktop development with C++" workload.
  - **Linux**: `make`, `g++` or `clang`.

## 2. Local Development Setup

The development workflow is designed to handle the complexities of native module recompilation automatically.

### Step 1: Initial Setup

This command installs all dependencies and prepares the environment.

```bash
make setup
```

Behind the scenes, this runs `npm install`, which also installs `@electron/rebuild` as a dev dependency.

### Step 2: Recompile Native Modules

After any `npm install` (or when dependencies that have native modules change), you must recompile them for Electron. The `makefile` might automate this, but the manual command is:

```bash
# Force a rebuild of better-sqlite3 against Electron's headers
npx electron-rebuild -f -w better-sqlite3
```

### Step 3: Run the Application

This command starts the Electron application in development mode.

```bash
make dev
```

### Step 4: Verify the Setup

To confirm that `better-sqlite3` is correctly compiled and loaded:

1.  Launch the application using `make dev`.
2.  Check the terminal output for a "Successfully connected to better-sqlite3 database" message from the main process.
3.  If you see an "ABI mismatch" or "Module not found" error, your recompilation step failed.

## 3. Database Workflow (Drizzle + better-sqlite3)

This project uses Drizzle ORM for type-safe database access on top of `better-sqlite3`.

### Schema and Migrations

1.  **Define Schema**: Your database tables are defined in `./src/db/schema.ts`.
2.  **Sync Schema**: For rapid development, you can "push" your schema directly to the development database.
    ```bash
    # This command is likely wrapped in a make target, e.g., make db-push
    npx drizzle-kit push
    ```
3.  **Generate Migrations**: For production or more controlled updates, generate SQL migration files.
    ```bash
    # This command is likely wrapped in a make target, e.g., make db-generate
    npx drizzle-kit generate
    ```
    These generated SQL files should be committed to version control.

## 4. Build and Packaging

When you package the application for distribution, the native `.node` files must be handled correctly.

> [!IMPORTANT]
>
> Electron applications are often packaged into an `asar` archive. Native `.node` files **cannot** be loaded from inside an `asar` archive and must be left "unpacked".

Your packager (`Electron Forge` or `Electron Builder`) must be configured to handle this.

### Example: Electron Forge (`forge.config.js`)

```javascript
// forge.config.js
module.exports = {
  // ... other config
  packagerConfig: {
    asar: {
      // Unpack the native module so it remains a standalone file
      unpack: '**/node_modules/better-sqlite3/**',
    },
  },
}
```

## 5. Production Considerations

### Database Location

- **Development**: The database is a local file (e.g., `local_dev.db`) for easy access.
- **Production**: The database **must** be stored in a user-writable location. The standard is `app.getPath('userData')`. Your application code should handle this path switch based on `app.isPackaged`.

### Applying Migrations

In a packaged app, you must programmatically run the SQL migrations you generated during development. This logic should execute on application startup:

1.  Connect to the production database.
2.  Read the SQL migration files from the app's resources.
3.  Track which migrations have been applied in a dedicated table.
4.  Execute any pending migrations.

## 6. Common Troubleshooting

| Error                                                                      | Cause                                                                                  | Solution                                                                                        |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `Error: The module... was compiled against a different Node.js version...` | **ABI Mismatch.** The `.node` file is not compatible with Electron's runtime.          | Run `npx electron-rebuild -f -w better-sqlite3`.                                                |
| `Error: Cannot find module 'better-sqlite3'` (in packaged app)             | The `better_sqlite3.node` file is either missing or trapped inside the `asar` archive. | Ensure your packager is configured to `unpack` the `better-sqlite3` module.                     |
| Build failures during `npm install` or `electron-rebuild`                  | Missing system dependencies (Python, C++ compiler).                                    | Install the prerequisites listed in **Section 1**. Check the `node-gyp` error logs for details. |
