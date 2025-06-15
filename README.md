<h1 align="center">Create Electron Foundation</h1>

<p align="center">
  An interactive CLI to bootstrap a modern, type-safe, and scalable Electron application.
</p>

<p align="center">
  Interactive CLI (inspired by <a href="https://github.com/t3-oss/create-t3-app">create-t3-app</a>) to scaffold an Electron application.
</p>

<!-- Optional: Add badges here later -->
<!-- <p align="center">
  <a href="..."><img alt="NPM Version" src="..."></a>
  <a href="..."><img alt="Build Status" src="..."></a>
  <a href="..."><img alt="License" src="..."></a>
</p> -->

## 🚧 Project Status: Beta 🚧

> [!WARNING]
> This project is in its early stages. While it's ready for you to try out, expect breaking changes and incomplete features.
>
> **Platform Support:** Currently, `create-electron-foundation` is developed and tested primarily on **macOS**.
>
> **Windows** _(and **Linux** if I can get pewdiepie on the line...)_ support is planned for the future, but full functionality is not yet **guaranteed** on those platforms.

## 🚧 Prerequisites 🚧

- make
  this project uses makefiles to build & manage the project.

- nvm
  To ensure compatibility and smooth development, it's generally recommended to use a Node.js version manager. These help you easily switch between Node.js versions as needed for different projects.

  This project makefile management is strongly integrated with [**nvm**](https://github.com/nvm-sh/nvm) and it is recommended that you have it installed on your machine when interacting create-electron-foundation or its scaffolded assets.

---

## What's Included?

`create-electron-foundation` scaffolds a project with a sensible default stack, but gives you the flexibility to opt out of what you don't need.

- **Framework:** [`Electron`](https://www.electronjs.org/) (with a modern main/renderer process setup)
- **Frontend:** [`React`](https://react.dev/) w/[`TypeScript`](https://www.typescriptlang.org/) (via [`Vite`](https://vitejs.dev/))

You can also choose to include:

- **Routing:** [`TanStack Router`](https://tanstack.com/router) or [`React Router`](https://reactrouter.com/)
- **Styling:** [`Tailwind`](https://tailwindcss.com/) or `Vanilla CSS`
- **Database:** [`SQLite`](https://www.sqlite.org/index.html)
- **ORM:** [`Drizzle ORM`](https://orm.drizzle.team/) (when SQLite is selected)

## Getting Started

To create a new Electron application, run the following command in your terminal:

```bash
npx create-electron-foundation@latest
npx create-electron-foundation # will call @latest
npx create-electron-foundation@beta
npx create-electron-foundation@alpha
```

The CLI will guide you through a few interactive prompts to configure your project.

### Quick Start (Default Configuration)

To skip the prompts and scaffold a project with the default options, use the `-y` flag:

```bash
npx create-electron-foundation@beta -y
```

**Default Stack:**

- Router: **Tanstack Router**
- Styling: **Tailwind CSS**

## Command-Line Arguments

You can also customize your project setup directly via command-line arguments.

| Argument           | Alias   | Description                      | Options                               | Default                                      |
| ------------------ | ------- | -------------------------------- | ------------------------------------- | -------------------------------------------- |
| `[project_name]`   |         | Name of the project (positional) | string                                | -                                            |
| `--project_name`   |         | Name of the project (option)     | string                                | `[project_name]` \|\| `process.env.APP_NAME` |
| `--router`         |         | Router to use                    | `'tanstack-router'`, `'react-router'` | Interactive prompt                           |
| `--styles`         |         | Styles to use                    | `'tailwind'`, `'false'`               | Interactive prompt                           |
| `--database`       |         | Database to use                  | `'sqlite'`, `'false'`                 | Interactive prompt                           |
| `--orm`            |         | ORM to use                       | `'drizzle'`, `'false'`                | Interactive prompt                           |
| `--ci`             |         | Run in CI mode (non-interactive) | boolean                               | `false`                                      |
| `-y`, `--yes`      |         | Skip prompts and use defaults    | boolean                               | `false`                                      |
| `--pkg_manager`    |         | Package manager to use           | `'npm'`                               | `'npm'`                                      |
| `--initialize_git` | `--git` | Initialize Git repository        | boolean                               | `true`                                       |
| `-h`, `--help`     |         | Show help                        | -                                     | -                                            |

## Contributing

This project was built to accelerate my own learning and hopefully help others. Contributions, feedback, and suggestions are highly encouraged!

Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

If you have an idea for an improvement or find a bug, please **open an issue** or **submit a pull request**. Your interaction is greatly appreciated.

## License

This project is licensed under the MIT License.
