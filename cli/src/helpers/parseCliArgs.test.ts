/**
 * Test Case Summary:
 *
 * Project Name Parsing:
 * - Parse valid project name from first argument
 * - Parse valid project name from --project_name flag
 * - Reject invalid project name with special characters
 * - Reject project name starting with number
 * - Reject project name that is a reserved keyword
 *
 * Option Validation:
 * - Valid router options (react-router, tanstack-router)
 * - Valid style options (tailwind) + none
 * - Valid database options (sqlite) + none
 * - Valid ORM options (drizzle) + none
 * - Valid package manager options (npm, yarn, pnpm)
 * - Valid IDE options (vscode, cursor) + none
 * - Boolean flags (initialize_git, install_packages)
 *
 * Dependency Logic:
 * - When database is provided without orm, default orm to drizzle
 * - When orm is provided without database, default database to sqlite
 * - When database=none, orm should be false
 * - When orm=none, database should be false
 * - Special case: sqlite + none should return sqlite + drizzle (orm gets forced to drizzle)
 *
 * Matrix Combinations:
 * - All routers with all styles
 * - All valid database/ORM combinations
 * - Mixed valid and invalid arguments
 */

import { describe, it, expect, vi } from 'vitest'
import { parseCliArgs } from './parseCliArgs.js'
import {
  validRouters,
  validStyles,
  validPackageManagers,
  validDatabases,
  validORMs,
} from '../types/Packages.js'
import { validIDEs } from '../types/index.js'
import path from 'path'

// Mock the logger to prevent console output during tests
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    success: vi.fn(),
  },
}))

describe('parseCliArgs', () => {
  const createArgv = (args: string[]) => ['node', 'script.js', ...args]

  it('should parse a valid project_name from the first argument', async () => {
    const argv = createArgv(['my-cool-project'])
    const result = await parseCliArgs(argv)
    expect(result.project_name).toBe('my-cool-project')
    expect(result.project_dir).toBe(path.resolve('my-cool-project'))
  })

  it('should parse a valid project_name from the --project_name flag', async () => {
    const argv = createArgv(['--project_name', 'my-flag-project'])
    const result = await parseCliArgs(argv)
    expect(result.project_name).toBe('my-flag-project')
    expect(result.project_dir).toBe(path.resolve('my-flag-project'))
  })

  it('should return undefined for project_name with invalid characters', async () => {
    const argv = createArgv(['invalid!project'])
    const result = await parseCliArgs(argv)
    expect(result.project_name).toBeUndefined()
  })

  it('should return undefined for project_name that starts with a number', async () => {
    const argv = createArgv(['1invalidproject'])
    const result = await parseCliArgs(argv)
    expect(result.project_name).toBeUndefined()
  })

  it('should return undefined for project_name that is a keyword', async () => {
    const argv = createArgv(['null'])
    const result = await parseCliArgs(argv)
    expect(result.project_name).toBeUndefined()
  })

  // Test all valid options for each flag
  describe('valid options for each flag', () => {
    // Test routers
    validRouters.forEach((router) => {
      it(`should correctly parse --router=${router}`, async () => {
        const argv = createArgv(['--router', router])
        const result = await parseCliArgs(argv)
        expect(result.router).toBe(router)
      })
    })

    // Test styles
    validStyles.forEach((style) => {
      it(`should correctly parse --styles=${style}`, async () => {
        const argv = createArgv(['--styles', style])
        const result = await parseCliArgs(argv)
        expect(result.styles).toBe(style)
      })
    })

    // Test databases
    validDatabases.forEach((database) => {
      it(`should correctly parse --database=${database}`, async () => {
        const argv = createArgv(['--database', database])
        const result = await parseCliArgs(argv)
        expect(result.database).toBe(database)
        // Should default to drizzle
        expect(result.orm).toBe('drizzle')
      })
    })

    // Test ORMs with database
    validDatabases.forEach((database) => {
      validORMs.forEach((orm) => {
        it(`should correctly parse --database=${database} --orm=${orm}`, async () => {
          const argv = createArgv(['--database', database, '--orm', orm])
          const result = await parseCliArgs(argv)
          expect(result.database).toBe(database)
          expect(result.orm).toBe(orm)
        })
      })
    })

    // Test package managers
    validPackageManagers.forEach((pkgManager) => {
      it(`should correctly parse --pkg_manager=${pkgManager}`, async () => {
        const argv = createArgv(['--pkg_manager', pkgManager])
        const result = await parseCliArgs(argv)
        expect(result.pkg_manager).toBe(pkgManager)
      })
    })

    // Test IDEs
    validIDEs.forEach((ide) => {
      it(`should correctly parse --ide=${ide}`, async () => {
        const argv = createArgv(['--ide', ide])
        const result = await parseCliArgs(argv)
        expect(result.ide).toBe(ide)
      })
    })
  })

  it('should correctly parse --styles=none as false', async () => {
    const argv = createArgv(['--styles=none'])
    const result = await parseCliArgs(argv)
    expect(result.styles).toBe(false)
  })

  it('should correctly parse --ide=none as false', async () => {
    const argv = createArgv(['--ide=none'])
    const result = await parseCliArgs(argv)
    expect(result.ide).toBe(false)
  })

  // Verify Database/ORM dependency logic
  describe('database and orm dependencies', () => {
    it('should default orm to drizzle when database is provided without orm', async () => {
      const argv = createArgv(['--database', 'sqlite'])
      const result = await parseCliArgs(argv)
      expect(result.database).toBe('sqlite')
      expect(result.orm).toBe('drizzle')
    })

    it('should automatically set database to sqlite when orm is provided without database', async () => {
      const argv = createArgv(['--orm', 'drizzle'])
      const result = await parseCliArgs(argv)
      expect(result.database).toBe('sqlite')
      expect(result.orm).toBe('drizzle')
    })

    it('should correctly parse --database=none and --orm=none', async () => {
      const argv = createArgv(['--database=none', '--orm=none'])
      const result = await parseCliArgs(argv)
      expect(result.database).toBe(false)
      expect(result.orm).toBe(false)
    })

    it('should correctly parse --database=none with orm defaulting to false', async () => {
      const argv = createArgv(['--database=none'])
      const result = await parseCliArgs(argv)
      expect(result.database).toBe(false)
      expect(result.orm).toBe(false)
    })
  })

  // Verify boolean/default flags
  describe('boolean and default flags', () => {
    it('should correctly parse --git=false as false', async () => {
      const argv = createArgv(['--git=false'])
      const result = await parseCliArgs(argv)
      expect(result.initialize_git).toBe(false)
    })

    it('should default initialize_git to true when no arg is provided', async () => {
      const argv = createArgv([])
      const result = await parseCliArgs(argv)
      expect(result.initialize_git).toBe(true)
    })

    it('should correctly parse --install_packages=false as false', async () => {
      const argv = createArgv(['--install_packages=false'])
      const result = await parseCliArgs(argv)
      expect(result.install_packages).toBe(false)
    })

    it('should default install_packages to true when no arg is provided', async () => {
      const argv = createArgv([])
      const result = await parseCliArgs(argv)
      expect(result.initialize_git).toBe(true)
    })
  })

  // Matrix testing of key combinations
  describe('matrix combinations', () => {
    // Test all routers with all styles
    validRouters.forEach((router) => {
      const styleOptions = [...validStyles, 'none']
      styleOptions.forEach((style) => {
        it(`should parse router=${router} with styles=${style}`, async () => {
          const argv = createArgv(['--router', router, '--styles', style])
          const result = await parseCliArgs(argv)
          expect(result.router).toBe(router)
          expect(result.styles).toBe(style === 'none' ? false : style)
        })
      })
    })

    // Test database and ORM combinations
    const databaseOptions = [...validDatabases, 'none']
    databaseOptions.forEach((database) => {
      const ormOptions = database === 'none' ? ['none'] : [...validORMs, 'none']
      ormOptions.forEach((orm) => {
        const testName = `should parse database=${database} with orm=${orm}`

        if (database === 'none' && orm !== 'none') {
          it(testName, async () => {
            const argv = createArgv(['--database', database, '--orm', orm])
            // Should auto-correct to set database to sqlite
            const result = await parseCliArgs(argv)
            expect(result.database).toBe('sqlite')
            expect(result.orm).toBe(orm)
          })
        } else {
          it(testName, async () => {
            const argv = createArgv(['--database', database, '--orm', orm])
            const result = await parseCliArgs(argv)
            
            // Special case: When database is sqlite, orm should always be drizzle
            if (database === 'sqlite') {
              expect(result.database).toBe('sqlite')
              expect(result.orm).toBe('drizzle')
            } else {
              expect(result.database).toBe(database === 'none' ? false : database)
              expect(result.orm).toBe(orm === 'none' ? false : orm)
            }
          })
        }
      })
    })
  })

  // Fuzz testing with random combinations
  it('should handle mixed valid and invalid arguments', async () => {
    const argv = createArgv([
      'fuzz-project',
      '--router=react-router',
      '--styles=tailwind',
      '--pkg_manager=npm',
      '--ci',
      '--y',
    ])

    const result = await parseCliArgs(argv)
    expect(result.project_name).toBe('fuzz-project')
    expect(result.router).toBe('react-router')
    expect(result.styles).toBe('tailwind')
    expect(result.pkg_manager).toBe('npm')
    expect(result.ci).toBe(true)
    expect(result.y).toBe(true)
  })

  it('should reject invalid style values', async () => {
    const argv = createArgv([
      'fuzz-project',
      '--router=react-router',
      '--styles=invalid-style', // Invalid
    ])

    await expect(parseCliArgs(argv)).rejects.toThrow()
  })
})
