# TODO: Refactor Yargs CLI Argument Handling

1.  **Update Argument Casing and Definitions in `cli/src/index.ts`:**

    - Rename options from camelCase to snake_case:
      - `projectName` -> `project_name`
      - `initializeGit` -> `initialize_git`
      - `installDependencies` -> `install_dependencies`
      - `runMigrations` -> `run_migrations`
      - `router` (no change in name, but ensure consistency)
      - `styles` (no change in name, but ensure consistency)
      - `database` (no change in name, but ensure consistency)
      - `orm` (no change in name, but ensure consistency)
    - Update the `CLIArgs` type to reflect these snake_case names.

2.  **Set Default Values for Arguments:**

    - `project_name`: Keep as is (positional or optional flag, no default value for the name itself).
    - `initialize_git`: `true`
    - `install_dependencies`: `true`
    - `run_migrations`: `true`
    - `router`: `'tanstack-router'`
    - `styles`: `'tailwind'`
    - `database`: `null` (ensure string 'null' from CLI becomes actual null)
    - `orm`: `null` (ensure string 'null' from CLI becomes actual null)

3.  **Implement Conditional Logic for `orm` and `database`:**

    - Use `yargs.check()` or a similar mechanism to enforce the rule: if `database` is not `null` (e.g., 'sqlite'), then `orm` must not be `null` (i.e., must be 'drizzle'). If `database` is specified and `orm` is `null` (either by default or explicitly passed as 'null'), an error should be raised.
    - Consider if `orm` should automatically default to `drizzle` if `database` is `sqlite` and `orm` is not provided. The current requirement is a validation check.

4.  **Introduce a CI Flag:**

    - Add a new boolean option `--ci` (default: `false`).
    - Add `ci` to the `CLIArgs` type.
    - This flag can be used later to alter behavior for CI environments (e.g., skipping IDE opening).

5.  **Update Code to Use New Argument Names and Defaults:**

    - Throughout `cli/src/index.ts`, change all references from the old camelCase argument names in `cliArgs` to the new snake_case names (e.g., `cliArgs.projectName` to `cliArgs.project_name`).
    - Ensure `process.env.APP_NAME` is set using `cliArgs.project_name`.
    - Verify that the `skipPrompts` (`-y`/`--yes`) option correctly interacts with the new defaults (i.e., defaults are used, and no prompts appear).

6.  **Testing:**

    - Manually test various CLI combinations:
      - No arguments (to check defaults and `project_name` handling).
      - Only `project_name`.
      - Overriding some defaults.
      - Using the `--ci` flag.
      - Testing the `database`/`orm` validation:
        - `--database=sqlite` (should error if orm is not specified or is null)
        - `--database=sqlite --orm=drizzle` (should pass)
        - `--database=null --orm=drizzle` (should error or orm should be ignored/set to null) - clarify this behavior. If database is null, orm should ideally also be null or ignored.
        - `--database=sqlite --orm=null` (should error)
    - Ensure help message (`--help`) reflects new names, defaults, and the `--ci` flag.

7.  **Review `yargs` Configuration for Positional `project_name`:**

    - Confirm that `project_name` can still be provided as a positional argument (`argv._[0]`) and also as an option (`--project_name`). Ensure the logic for `cliArgs.project_name = (argv.project_name as string) || (argv._[0] as string)` remains correct.

8.  **Cleanup and Final Review:**
    - Remove any commented-out or dead code related to old argument parsing.
    - Ensure consistency in option descriptions.
    - Verify all user rules (simplicity, readability) are followed.
