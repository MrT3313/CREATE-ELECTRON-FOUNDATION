# Create Electron Foundation

> [!IMPORTANT]
>
> this project is best managed through its [makefile](./makefile)

## Local Development

1. `make setup`
2. `make dev`

## Native Module Integration

> [!INFORMATION]
>
> Electron applications bundle their own Node.js runtime and often differs from the local machine Node.js installation.

> [!IMPORTANT]
>
> Native modules (like better-sqlite3) must be compiled against Electon's specific Application Binary Interface (ABI) - NOT your local Node.js version

> [!WARNING]
>
> `NODE_MODULE_VERSION` differs between Electron and standard Node.js (even for the same semantic version)

### Version Identification

- `process.versions.electron`
- `process.versions.node`

### Local Setup

configure `nvm (or other node version manager)` to use the `.nvmrc` version
