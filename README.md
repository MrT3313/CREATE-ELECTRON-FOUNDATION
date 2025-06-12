<h1 align="center">
  🚧 UNDER CONSTRUCTION : ALPHA 🚧
</h1>

<h1 align="center">
  Create Electron Foundation
</h1>

<p align="center">
  Interactive CLI (inspired by <a href="https://github.com/t3-oss/create-t3-app">create-t3-app</a>) to scaffold an Electron application.
</p>

<div align="center">
  <h3 align="center">
    Get started by running:
  </h3>

```bash
npx create-electron-foundation@alpha
```

</div>

<h2 align="center">
  Configuration Options
</h2>

### Defaults

```bash
npx create-electron-foundation@alpha -y
```

- ✅ Framework: Electron (main + render processes)
- ✅ Router: Tanstack Router
- ✅ Styling: Tailwind
- ✅ Database: SQLite
- ✅ ORM: Drizzle

### Available Configurations

| is default | router              | styling      | database   | orm         |
| ---------- | ------------------- | ------------ | ---------- | ----------- |
| ✅         | **Tanstack Router** | **Tailwind** | **SQLite** | **Drizzle** |
|            | React Router        | Tailwind     | SQLite     | Drizzle     |
|            | Tanstack Router     | Tailwind     |            |             |
|            | React Router        | Tailwind     |            |             |
|            | Tanstack Router     |              | SQLite     | Drizzle     |
|            | React Router        |              | SQLite     | Drizzle     |
|            | Tanstack Router     |              |            |             |
|            | React Router        |              |            |             |

### Command Line Arguments

| Argument           | Alias    | Description                      | Options                               | Default                                      |
| ------------------ | -------- | -------------------------------- | ------------------------------------- | -------------------------------------------- |
| `[project_name]`   |          | Name of the project (positional) | string                                | -                                            |
| `--project_name`   |          | Name of the project (option)     | string                                | `[project_name]` \|\| `process.env.APP_NAME` |
| `--router`         |          | Router to use                    | `'tanstack-router'`, `'react-router'` | -                                            |
| `--styles`         |          | Styles to use                    | `'tailwind'`, `'false'`               | -                                            |
| `--database`       |          | Database to use                  | `'sqlite'`, `'false'`                 | -                                            |
| `--orm`            |          | ORM to use                       | `'drizzle'`, `'false'`                | -                                            |
| `--ci`             |          | Run in CI mode                   | boolean                               | `false`                                      |
| `-y`               | `--yes`  | Skip prompts and use defaults    | boolean                               | `false`                                      |
| `--pkg_manager`    |          | Package manager to use           | `'npm'`                               | `'npm'`                                      |
| `--initialize_git` | `--git`  | Initialize Git repository        | boolean                               | `true`                                       |
| `-h`               | `--help` | Show help                        | -                                     | -                                            |

</div>
