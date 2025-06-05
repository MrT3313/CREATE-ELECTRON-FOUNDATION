# AI-Actionable Plan for Publishing 'create-electron-foundation' to NPM Registry

This plan details the precise steps for an AI assistant to help prepare and publish the `create-electron-foundation` CLI tool to the official NPM registry (npmjs.org).

## Phase 1: `package.json` Preparation

**Objective**: Ensure `package.json` is complete, accurate, and ready for NPM publishing.

**Current `package.json` structure (for AI reference during modifications):**

```json
{
  "name": "create-electron-foundation",
  "type": "module",
  "version": "0.0.0.4",
  "description": "A CLI tool to scaffold Electron projects",
  "main": "cli/dist/index.js",
  "bin": {
    "create-electron-foundation": "cli/dist/index.js"
  },
  "scripts": {
    "build": "npm run build -w @create-electron-foundation/cli",
    "start": "node cli/dist/index.js"
  },
  "devDependencies": {
    "@types/node": "^22.15.27",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.3"
  },
  "dependencies": {
    "@create-electron-foundation/cli": "workspace:*"
  },
  "workspaces": ["cli"]
}
```

**Step 1.1: Determine and Set NPM Package Name**

- **AI Action 1.1.1 (Research Name Availability)**:

  - **Tool**: `web_search`
  - **Search Term**: "npm package create-electron-foundation"
  - **Purpose**: To check if "create-electron-foundation" is likely available on npmjs.com.
  - **AI Internal State**: Store search results.

- **AI Action 1.1.2 (Interact with User for Name Decision)**:

  - Present findings from web search to User.
  - **Ask User**: "Based on the search, it appears the name 'create-electron-foundation' [AI to fill in: is/may be/is not] available. Do you want to proceed with this name? If it's taken, or if you prefer to use a scoped name (e.g., @username/create-electron-foundation), please provide your NPM username or organization name to use as the scope. Otherwise, confirm you want to use 'create-electron-foundation'."
  - **AI Internal State**: Record the chosen package name. If scoped, store the scope (e.g., `@username`) and note that `--access public` will be needed for publishing.

- **AI Action 1.1.3 (`package.json` Modification - Conditional)**:
  - **Condition**: Only if the chosen package name is different from the current one in `package.json`.
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will update the `name` field in `package.json` to the chosen package name: [AI inserts chosen name here]."
  - **`code_edit` Details**:
    ```
    {
      "name": "CHOSEN_PACKAGE_NAME_HERE",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI will locate the existing `name` key and replace its value.)

**Step 1.2: Set Initial Package Version**

- **AI Action 1.2.1 (Confirm Version with User)**:

  - **Ask User**: "The current version in `package.json` is `0.0.0.4`. The recommended initial public release version is `0.1.0`. Do you want to update to `0.1.0`, or specify a different version?"
  - **AI Internal State**: Store the confirmed version (e.g., "0.1.0").

- **AI Action 1.2.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will change the `version` field to the confirmed version: [AI inserts confirmed version]."
  - **`code_edit` Details**:
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "CONFIRMED_VERSION_HERE",
      "description": "A CLI tool to scaffold Electron projects",
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI will locate the existing `version` key and replace its value.)

**Step 1.3: Add Author Information**

- **AI Action 1.3.1 (Request Author Info from User)**:

  - **Ask User**: "Please provide the author's information for `package.json`. The typical format is 'Your Name <your.email@example.com> (https://yourwebsite.com)'. The website in parentheses is optional."
  - **AI Internal State**: Store the User-provided author string.

- **AI Action 1.3.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add the `author` field with the provided information to `package.json`, placing it after the `description` field."
  - **`code_edit` Details**:
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "USER_PROVIDED_AUTHOR_STRING_HERE",
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI must ensure correct comma placement for JSON validity when inserting the new line.)

**Step 1.4: Add Repository Information**

- **AI Action 1.4.1 (Request Repository Info from User)**:

  - **Ask User**: "Please provide your GitHub username and the repository name for this project (e.g., `my-username/my-repo-name`)."
  - **AI Internal State**: Store GitHub username (USERNAME) and repository name (REPOSITORY_NAME).

- **AI Action 1.4.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add the `repository` field to `package.json`, placing it after the `author` field (or `description` if `author` is not added)."
  - **`code_edit` Details (Example insertion after `author`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/USERNAME_HERE/REPOSITORY_NAME_HERE.git"
      },
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace USERNAME_HERE and REPOSITORY_NAME_HERE with stored values. Ensure correct comma placement.)

**Step 1.5: Specify License**

- **AI Action 1.5.1 (Check for `LICENSE` file - Optional but Recommended)**:

  - **Tool**: `list_dir` (to check for `LICENSE` or `LICENSE.md` in root)
  - **If `LICENSE` file exists, AI Action 1.5.1.1 (Read License File - Optional)**:
    - **Tool**: `read_file`
    - **Target File**: `LICENSE` (or `LICENSE.md`)
    - **Purpose**: To help infer the license type (e.g., MIT, Apache-2.0).
  - **AI Internal State**: Note if `LICENSE` file exists and any inferred type.

- **AI Action 1.5.2 (Confirm License with User)**:

  - **Ask User**: "The recommended license is 'MIT'. [AI to add if `LICENSE` file was found: A `LICENSE` file was found which seems to be [inferred type/unclear].] Do you want to use 'MIT', or another SPDX license identifier (e.g., 'Apache-2.0') for `package.json`?"
  - **AI Internal State**: Store the confirmed SPDX license identifier.

- **AI Action 1.5.3 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add/update the `license` field in `package.json` to '[AI inserts confirmed license]', placing it after the `repository` field (or adjust as needed)."
  - **`code_edit` Details (Example insertion after `repository`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "CONFIRMED_LICENSE_HERE",
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace CONFIRMED_LICENSE_HERE. Ensure correct comma placement.)

**Step 1.6: Add Keywords for Discoverability**

- **AI Action 1.6.1 (Propose Keywords and Get User Input)**:

  - **Suggested Keywords**: `["electron", "cli", "scaffolding", "boilerplate", "electronjs", "desktop app"]`
  - **Ask User**: "Here are some suggested keywords for `package.json`: `["electron", "cli", "scaffolding", "boilerplate", "electronjs", "desktop app"]`. Do you want to use these, or provide a different list of keywords (as a comma-separated string or JSON array string)?"
  - **AI Internal State**: Store the final list of keywords.

- **AI Action 1.6.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add the `keywords` field to `package.json` with the chosen keywords, placing it after the `license` field (or adjust as needed)."
  - **`code_edit` Details (Example insertion after `license`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": CHOSEN_KEYWORDS_ARRAY_HERE,
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace CHOSEN_KEYWORDS_ARRAY_HERE with the JSON array of keywords. Ensure correct comma placement.)

**Step 1.7: Add Issue Tracker Information**

- **AI Action 1.7.1 (Confirm Repository Info - may use stored info from Step 1.4)**:

  - **If GitHub USERNAME and REPOSITORY_NAME are already known**: "I'll use the previously provided GitHub username '[USERNAME]' and repository '[REPOSITORY_NAME]' for the issue tracker URL."
  - **Else, Ask User**: "Please provide your GitHub username and the repository name for the issue tracker URL (e.g., `my-username/my-repo-name`)."
  - **AI Internal State**: Ensure GitHub USERNAME and REPOSITORY_NAME are stored.

- **AI Action 1.7.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add the `bugs` field to `package.json`, placing it after the `keywords` field (or adjust as needed)."
  - **`code_edit` Details (Example insertion after `keywords`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": ["electron", "cli"],
      "bugs": {
        "url": "https://github.com/USERNAME_HERE/REPOSITORY_NAME_HERE/issues"
      },
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace USERNAME_HERE and REPOSITORY_NAME_HERE. Ensure correct comma placement.)

**Step 1.8: Add Homepage Information**

- **AI Action 1.8.1 (Confirm Repository Info - may use stored info from Step 1.4 or 1.7)**:

  - **If GitHub USERNAME and REPOSITORY_NAME are already known**: "I'll use the previously provided GitHub username '[USERNAME]' and repository '[REPOSITORY_NAME]' for the homepage URL."
  - **Else, Ask User**: "Please provide your GitHub username and the repository name for the homepage URL (e.g., `my-username/my-repo-name`)."
  - **AI Internal State**: Ensure GitHub USERNAME and REPOSITORY_NAME are stored.

- **AI Action 1.8.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add the `homepage` field to `package.json`, placing it after the `bugs` field (or adjust as needed)."
  - **`code_edit` Details (Example insertion after `bugs`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": ["electron", "cli"],
      "bugs": {
        "url": "https://github.com/user/repo/issues"
      },
      "homepage": "https://github.com/user/repo#readme",
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace USERNAME and REPOSITORY_NAME with stored values. Ensure correct comma placement.)

**Step 1.9: Define Files for Publication**

- **AI Action 1.9.1 (Propose Files Array and Get User Input)**:

  - **Suggested `files` array**: `["cli/dist", "README.md", "LICENSE", "CHANGELOG.md"]` (AI should check if `LICENSE` and `CHANGELOG.md` actually exist using `list_dir` and adjust suggestions).
  - **Ask User**: "I suggest the following `files` for publishing: `[AI lists suggested files based on existence]`. These typically include the build output (`cli/dist`) and documentation files like `README.md`, `LICENSE`, `CHANGELOG.md`. Do you want to use this list, or provide a different list (as a JSON array string)?"
  - **AI Internal State**: Store the final `files` array.

- **AI Action 1.9.2 (`package.json` Modification)**:
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will add/update the `files` field in `package.json`, placing it after the `homepage` field (or adjust as needed)."
  - **`code_edit` Details (Example insertion after `homepage`):**
    ```
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": ["electron", "cli"],
      "bugs": {
        "url": "https://github.com/user/repo/issues"
      },
      "homepage": "https://github.com/user/repo#readme",
      "files": FINAL_FILES_ARRAY_HERE,
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "@create-electron-foundation/cli": "workspace:*"
      },
      "workspaces": ["cli"]
    }
    ```
    (AI to replace FINAL_FILES_ARRAY_HERE with the JSON array of files. Ensure correct comma placement.)

**Step 1.10: Review Workspaces and Dependencies (Critical for CLI packaging)**

- **Context**: The package uses `main: "cli/dist/index.js"` and `bin: {"create-electron-foundation": "cli/dist/index.js"}`. The `dependencies` field includes `"@create-electron-foundation/cli": "workspace:*"`.
- **Goal**: Ensure the CLI is correctly packaged. If `cli/dist` contains the fully bundled/compiled CLI code, the self-referential workspace dependency in `dependencies` is likely not needed for the _published package_ and might even cause issues. It's crucial for the `build` script to correctly populate `cli/dist`.

- **AI Action 1.10.1 (Analyze `dependencies` and `devDependencies`)**:

  - **Tool**: `read_file` (target `package.json`)
  - **Purpose**: To get the current content of `dependencies` and `devDependencies`.
  - **AI Internal State**: Store current `dependencies` and `devDependencies`.

- **AI Action 1.10.2 (Interact with User for Confirmation)**:

  - **Present Findings**: "Currently, `package.json` has `"@create-electron-foundation/cli": "workspace:*"` in `dependencies`. Since `main` and `bin` point to `cli/dist/...`, this self-reference is usually for local development and might not be needed or desired in the published package if `cli/dist` is self-contained. We need to ensure the build process correctly bundles everything into `cli/dist`. Should this workspace dependency be removed from the `dependencies` block for publishing? If there are other runtime dependencies, they will be kept."
  - **Ask User**: "Do you want to remove the `"@create-electron-foundation/cli": "workspace:*"` dependency from the `dependencies` section for the published package? (Yes/No)"
  - **AI Internal State**: Record user's decision.

- **AI Action 1.10.3 (`package.json` Modification - Conditional)**:

  - **Condition**: If the user confirms removal.
  - **Tool**: `edit_file`
  - **Target File**: `package.json`
  - **Instruction for `edit_file`**: "I will remove the `"@create-electron-foundation/cli": "workspace:*"` entry from the `dependencies` field. If it's the only dependency, I will remove the `dependencies` block entirely."
  - **`code_edit` Details**:
    (This requires careful logic:

    1. If `dependencies` has only the workspace link, remove the entire `dependencies` block.
    2. If `dependencies` has other links, remove only the workspace link line, being mindful of commas.)

    ```
    // Example 1: Removing the only dependency
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": ["electron", "cli"],
      "bugs": {
        "url": "https://github.com/user/repo/issues"
      },
      "homepage": "https://github.com/user/repo#readme",
      "files": ["cli/dist", "README.md", "LICENSE", "CHANGELOG.md"],
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "workspaces": ["cli"]
    }

    // Example 2: Removing one of multiple dependencies
    {
      "name": "create-electron-foundation",
      "type": "module",
      "version": "0.0.0.4",
      "description": "A CLI tool to scaffold Electron projects",
      "author": "User Name <user@example.com> (https://example.com)",
      "repository": {
        "type": "git",
        "url": "git+https://github.com/user/repo.git"
      },
      "license": "MIT",
      "keywords": ["electron", "cli"],
      "bugs": {
        "url": "https://github.com/user/repo/issues"
      },
      "homepage": "https://github.com/user/repo#readme",
      "files": ["cli/dist", "README.md", "LICENSE", "CHANGELOG.md"],
      "main": "cli/dist/index.js",
      "bin": {
        "create-electron-foundation": "cli/dist/index.js"
      },
      "scripts": {
        "build": "npm run build -w @create-electron-foundation/cli",
        "start": "node cli/dist/index.js"
      },
      "devDependencies": {
        "@types/node": "^22.15.27",
        "ts-node": "^10.9.2",
        "typescript": "^5.8.3"
      },
      "dependencies": {
        "another-dependency": "^1.0.0" // Ensure comma is correct if item was last
      },
      "workspaces": ["cli"]
    }
    ```

- **Verification**: The `files` array (Step 1.9) _must_ include `cli/dist`. The `main` and `bin` fields must correctly point to the entry files within `cli/dist`. This step primarily ensures `dependencies` are correct for publishing.

## Phase 2: Pre-Publish Preparations & Local Testing

**Objective**: Ensure the package is built, clean, and thoroughly tested locally before any attempt to publish.

**Step 2.1: Ensure Build is Up-to-Date**

- **Action**: Execute the build script.
- **Command**: `npm run build`
- **Verification**: Check that `cli/dist/index.js` and all related assets are current and present.

**Step 2.2: Clean Git Working Directory**

- **Action**: Request User to commit or stash any uncommitted changes.
- **Reason**: `npm version` command (used later) prefers a clean Git working directory.

**Step 2.3: Update `README.md`**

- **Action**: Instruct User to review and update `README.md`.
- **Content Checks**: Verify presence of clear installation instructions (e.g., `npm install -g create-electron-foundation`), usage examples, and API details.

**Step 2.4: Update `CHANGELOG.md`**

- **Action**: Instruct User to review and update `CHANGELOG.md` with changes for the upcoming version.

**Step 2.5: Perform Local Packaging Test (`npm pack`)**

- **Action**: Create a local tarball of the package.
- **Command**: `npm pack`
- **Output**: A `.tgz` file (e.g., `create-electron-foundation-0.1.0.tgz`).

**Step 2.6: Inspect Tarball Contents**

- **Action**: List the contents of the generated `.tgz` file.
- **Command**: `tar -tvf [name-of-generated-tgz-file].tgz` (replace with actual filename from Step 2.5).
- **Verification**: Confirm that only files listed in `package.json`'s `files` array (plus `package.json` itself, and potentially `LICENSE`, `README.md`, `CHANGELOG.md` if not explicitly in `files` but are default) are included. Specifically ensure `cli/dist` is present and source files (e.g., `.ts` files) are excluded.

**Step 2.7: Perform Local Installation Test**

- **Action**: Install the package from the local tarball in a new, temporary directory.
- **Instruction to User**: Create a new empty directory outside the project for testing.
- **Command (run from within the new temporary directory)**: `npm install /path/to/your/[name-of-generated-tgz-file].tgz` (replace with full path to tarball from Step 2.5).

**Step 2.8: Test Locally Installed CLI**

- **Action**: Execute the CLI tool installed in Step 2.7.
- **Commands (examples)**:
  - `npx create-electron-foundation --version` (if installed locally in the test dir's node_modules)
  - Or, if installed globally from tarball for testing: `create-electron-foundation --version`
  - `npx create-electron-foundation --help`
- **Verification**: Confirm the CLI runs and basic commands work as expected.

## Phase 3: Versioning with NPM

**Objective**: Officially set the package version using `npm version`, which also creates a Git commit and tag.

**Step 3.1: Execute `npm version`**

- **Prerequisite**: Ensure `package.json`'s `version` is correctly set (e.g., `0.1.0` from Step 1.2). The Git working directory must be clean (Step 2.2).
- **Action**: Use `npm version` to update `package-lock.json` and create a Git commit/tag.
- **Command (using version from `package.json`)**: `npm version $(node -p "require('./package.json').version") -m "chore: release %s" --allow-same-version`
  - _Note_: If the version was manually set in `package.json` and committed, the `npm version <version>` command is cleaner. If starting from scratch or ensuring automation:
  - An alternative for an explicit new version if not already set in `package.json`: `npm version 0.1.0 -m "chore: initial release %s"`
- **Verification**: Check `git status` (should be clean), `git log` (new commit), and `git tag` (new tag).

## Phase 4: NPM Publishing

**Objective**: Publish the prepared package to the NPM registry.

**Step 4.1: Login to NPM (if not already done)**

- **Action**: Initiate NPM login.
- **Command**: `npm login`
- **Interaction**: User will be prompted for username, password, email, and OTP (if 2FA enabled).
- **Verification**: Successful login message. Token is stored in `~/.npmrc`.

**Step 4.2: Perform NPM Publish Dry Run**

- **Action**: Simulate publishing without actually sending to the registry.
- **Command**: `npm publish --dry-run`
- **Verification**: Review the output. It lists files to be published and other details. Ensure it matches expectations from `npm pack` inspection.

**Step 4.3: Publish to NPM Registry**

- **Action**: Publish the package.
- **Command (for unscoped or public scoped packages)**:
  - If unscoped: `npm publish`
  - If scoped and public: `npm publish --access public` (Requires confirmation if a scoped name was chosen in Step 1.1).
- **Verification**: Successful publish message from NPM.

## Phase 5: Post-Publishing Verification

**Objective**: Verify the package is correctly listed and installable from the NPM registry.

**Step 5.1: Check Package on npmjs.com**

- **Action**: Instruct User to navigate to the package URL on npmjs.com.
- **URL format**:
  - Unscoped: `https://www.npmjs.com/package/create-electron-foundation`
  - Scoped: `https://www.npmjs.com/package/@USERNAME/create-electron-foundation` (replace USERNAME)
- **Verification**: Confirm version, description, README, repository links, etc., are displayed correctly.

**Step 5.2: Test Global Installation from NPM**

- **Action**: Install the package globally from NPM in a clean environment.
- **Instruction to User**: Uninstall any local/global dev versions first (`npm uninstall -g create-electron-foundation`).
- **Command**: `npm install -g create-electron-foundation` (or the scoped name if used).

**Step 5.3: Test Globally Installed CLI**

- **Action**: Execute the globally installed CLI tool.
- **Commands (examples)**:
  - `create-electron-foundation --version`
  - `create-electron-foundation --help`
  - Test a basic project scaffolding command.
- **Verification**: Confirm CLI runs as expected.

**Step 5.4: Push Git Commit and Tags**

- **Prerequisite**: `npm version` (Step 3.1) created a commit and tag.
- **Action**: Push these to the remote Git repository.
- **Commands**:
  - `git push`
  - `git push --tags`
- **Verification**: Check the remote repository (e.g., GitHub) for the new commit and tag.

## Phase 6: Future Maintenance (Informational)

- Keep dependencies updated (`npm outdated`, `npm update`).
- Regularly run `npm audit` for vulnerabilities.
- Manage subsequent releases using `npm version <patch|minor|major>` followed by the publishing steps.
- Deprecate old versions if necessary: `npm deprecate <package-name>@<version> "<deprecation_message>"`.
