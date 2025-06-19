<h1 align="center">Create Electron Foundation</h1>

<p align="center">
  An interactive CLI to bootstrap an Electron application.
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

## 🚧 Project Status: BETA 🚧

> [!WARNING]
>
> This project is in its early stages.  
> While it's ready for you to try out, expect breaking changes and incomplete features.  
> The best way to get these features implemented or improved is to participate 🙂

> [!NOTE]
>
> [Known Issues](https://github.com/MrT3313/CREATE-ELECTRON-FOUNDATION/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen+%28label%3Abug+OR+type%3ABug%29)

**Platform Support:**

- `create-electron-foundation` was developed and tested on **macOS**.
- **I have not done nearly enough testing on the final Electron production assets as I have been building towards local scaffolding first.**
- Windows _(and Linux if I can get pewdiepie on the line...)_ support is planned for the future, but full functionality is not **guaranteed** on those platforms.

## 👀 Prerequisites 👀

- `nvm`  
   To ensure compatibility and smooth development, it's generally recommended to use a Node.js version manager. These help you easily switch between Node.js versions as needed for different projects.

  This project management is strongly integrated with [**nvm**](https://github.com/nvm-sh/nvm) and it is recommended that you have it installed on your machine when using create-electron-foundation or its scaffolded assets.

- `make`  
   This project uses a [makefile](https://opensource.com/article/18/8/what-how-makefile) to build & manage the project. There can be issues with Node.JS installs vs NVM depending on when each were installed.

  > [!IMPORTANT]
  >
  > Please investigate your own system to confirm you have the ability to run a makefile command.  
  > If you are unsure please do not attempt to automatically install packages after scaffolding.

## What's Included?

`create-electron-foundation` scaffolds a project with a sensible default stack, but gives you the flexibility to opt out of what you don't need.

- **Framework:** [`Electron`](https://www.electronjs.org/) (with a modern main/renderer process setup)
- **Frontend:** [`React`](https://react.dev/) w/[`TypeScript`](https://www.typescriptlang.org/) (via [`Vite`](https://vitejs.dev/))

You can choose to include:

- **Routing:** [`TanStack Router`](https://tanstack.com/router) or [`React Router`](https://reactrouter.com/)
- **Styling:** [`Tailwind`](https://tailwindcss.com/) or `Vanilla CSS`
- **Database:** [`SQLite*`](https://www.sqlite.org/index.html)
- **ORM:** [`Drizzle ORM**`](https://orm.drizzle.team/) (when SQLite is selected)

_\*optional_  
_\*\*optional : required if Database selected_

## Getting Started

To create a new Electron application, run the following command in your terminal:

```bash
npx create-electron-foundation@latest
npx create-electron-foundation # will call @latest

# to access other builds
npx create-electron-foundation@beta
npx create-electron-foundation@alpha
```

The CLI will guide you through a few interactive prompts to configure your project.

### Quick Start (Default Configuration)

To skip the prompts and scaffold a project with the default options, use the `-y` flag:

```bash
npx create-electron-foundation -y
```

## Command-Line Arguments

You can also customize your project setup directly via command-line arguments.

| Argument             | Alias   | Description                        | Options                               | Default   |
| -------------------- | ------- | ---------------------------------- | ------------------------------------- | --------- |
| `[project_name]`     |         | Name of the project (positional)   | string                                | -         |
| `--project_name`     |         | Name of the project (option)       | string                                | -         |
| `--router`           |         | Router to use                      | `'tanstack-router'`, `'react-router'` | -         |
| `--styles`           |         | Styles to use                      | `'tailwind'`, `'none'`                | -         |
| `--database`         |         | Database to use                    | `'sqlite'`, `'none'`                  | -         |
| `--orm`              |         | ORM to use                         | `'drizzle'`, `'none'`                 | -         |
| `--ide`              |         | IDE to use                         | `'cursor'`, `'vscode'`, `'none'`      | -         |
| `--pkg_manager`      |         | Package manager to use             | `'npm'`                               | `'npm'`   |
| `--initialize_git`   | `--git` | Initialize Git repository          | `'true'`, `'false'`                   | `'true'`  |
| `--install_packages` |         | Install packages after scaffolding | `'true'`, `'false'`                   | `'false'` |
| `--ci`               |         | Run in CI mode (non-interactive)   | boolean                               | `false`   |
| `-y`, `--yes`        |         | Skip prompts and use defaults      | boolean                               | `false`   |
| `-h`, `--help`       |         | Show help                          | -                                     | -         |

## Examples

## Contributing

This project was built to accelerate my own learning and hopefully help others. Contributions, feedback, and suggestions are highly encouraged!

Please see our [Contributing Guide](CONTRIBUTING.md) for more details on how to get started.

If you have an idea for an improvement or find a bug, please **open an issue** or **submit a pull request**. Your interaction is greatly appreciated.

## License

This project is licensed under the MIT License.
