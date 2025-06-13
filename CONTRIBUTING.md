# Contributing to Create Electron Foundation

First off, thank you for considering contributing to `create-electron-foundation`! Your help is greatly appreciated. Whether it's reporting a bug, proposing a new feature, or submitting a pull request, every contribution is valuable.

## How Can I Contribute?

There are many ways to contribute to the project. Here are a few ideas to get you started:

- **Reporting Bugs:** If you find a bug, please open an issue and provide as much detail as possible. Include the steps to reproduce the bug, your operating system, Node.js version, and any relevant error messages.
- **Suggesting Enhancements:** Have an idea for a new feature or an improvement to an existing one? Open an issue to start a discussion. We'd love to hear your thoughts.
- **Pull Requests:** If you're ready to contribute code, we welcome pull requests. Please follow the guidelines below to ensure a smooth process.
- **Improving Documentation:** Clear documentation is crucial. If you find any part of the documentation confusing or incomplete, please let us know or submit a pull request to improve it.

## Getting Started with Development

To get started with development, you'll need to clone the repository and install the dependencies.

```bash
git clone https://github.com/your-username/create-electron-foundation.git
cd create-electron-foundation
npm install
```

To test your changes locally create a symlink:

```bash
make link
```

This will create a global symlink for `create-electron-foundation` so you can run it from any directory. You can verify it's working with `make check-link`.

## Testing

Before submitting a pull request, please ensure your changes are well-tested.

### Automated Tests

To run the automated test suite, use the following command:

```bash
make batch-test
```

### Manual Testing

For manual testing, you should build the project and then run the CLI to ensure it behaves as expected.

```bash
make build
# Now run your create-electron-foundation commands
```

## Pull Request Process

1.  **Fork the repository** and create your branch from `main`.
2.  If you've added code that should be tested, **add tests**.
3.  Ensure your code **lints and formats** correctly. Run `make laf` to automatically format and lint your code.
4.  Make sure your **commit messages are clear and descriptive**.
5.  **Open a pull request** to the `main` branch.

When you submit a pull request, please provide a clear description of the changes you've made and why you've made them. The pull request template will guide you.

## Code of Conduct

This project and everyone participating in it is governed by the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

We look forward to your contributions!
