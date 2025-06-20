# Create Electron Foundation

> [!IMPORTANT]
> This project is best managed through its [makefile](./makefile), which automates many of the complex steps described below

This template provides a robust foundation for Electron applications that require native Node.js modules, featuring `better-sqlite3` for database operations and `Drizzle ORM` for type-safe queries.

## Core Concept: The Native Module Challenge

Electron uses its own internal build of Node.js, which is often different from the Node.js version you use in your terminal. This leads to a critical issue:

- **ABI Mismatch**: Native modules (like `better-sqlite3`) are C++ addons compiled into `.node` files. These files are highly specific to the Node.js version they were built against, defined by an Application Binary Interface (ABI). If a module's ABI doesn't match Electron's ABI, your app will crash.

> [!WARNING]
>
> ⚠️ **You must recompile native modules against Electron's specific ABI**, not your system's Node.js version.
