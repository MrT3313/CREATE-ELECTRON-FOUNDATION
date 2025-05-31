# Electron Scaffolding NPM Package: `create-electron-foundation`

# Tech Stack

- Terminal Logging (improved console logging in the terminal while the scaffolding process is running) : chalk
- Terminal Prompts (query the user through the terminal regarding how they want the scaffold configured) : @clack/prompts
- Terminal Spinner : ora
- File System Management : fs-extra
- Command Line Arguments : yargs

# Process

1. user enters `npx create-electron-foundation`

> locally we would use the symlink created in the [makefile](./makefile)

2. upon entering the @clack/prompts (the actual CLI interaction with the user) runs and queries the user for configuration information

3. execute a series of functions / terminal scripts to actually implement the scaffolding.