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
> Electron applications bundle their own Node.js runtime (based on the version of Electron) which often differs from the local machine Node.js installation.

`NODE_MODULE_VERSION` differs between Electron and standard Node.js (even for the same semantic version)

> [!IMPORTANT]
>
> ⚠️⚠️ Native modules _(like better-sqlite3)_ **must be compiled against Electon's specific Application Binary Interface (ABI) - NOT your local Node.js version**

### Version Identification

```js
console.log('Electron version:', process.versions.electron)
console.log('Node version:', process.versions.node)
console.log('V8 version:', process.versions.v8)
```

### Tools to mitigate

- electron-rebuild

  - recompiles native modules against **your Electron version's runtime**

  ```json
  {
    "build": {
      "nodeGypRebuild": true,
      "buildDependenciesFromSource": true
    }
  }
  ```

### Local Setup

configure `nvm (or other node version manager)` to use the `.nvmrc` version

### Project Specific Integration Issues

- SQLite (better-sqlite3)
- Drizzle

#### Steps where I need to figure out correct, automatic, recompiling

1. Project Initialization
2. Run Migrations
3. Update / Add package to package.json
4. Add new table
5. Update Migrations
6. Run Migrations
