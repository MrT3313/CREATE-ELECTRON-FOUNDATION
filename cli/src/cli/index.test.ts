/**
 * Test Case Summary:
 *
 * Matrix-based Testing Approach:
 * - Tests all combinations of router, styles, database, orm options
 * - Tests git initialization and package installation options
 * - Tests IDE selection options
 *
 * Primary Matrix Tests:
 * - All router options with all style options, database options, and orm options
 * - Skip invalid combinations (database=false requires orm=false)
 * - Tests special case: orm without database should set database to sqlite
 *
 * Secondary Matrix Tests:
 * - Test initialization options (git, package installation)
 * - Test IDE options (vscode, cursor, none)
 *
 * Prompt Behavior:
 * - Test prompting when ci and y flags are false
 *
 * Edge Cases:
 * - orm=drizzle without database should set database=sqlite
 * - database=false with orm=undefined should set orm=false
 * - All configuration options undefined should use defaults
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as p from '@clack/prompts'
import type { Yargs } from '../types/CLI.js'

// Mock the @clack/prompts module
vi.mock('@clack/prompts', () => ({
  intro: vi.fn(),
  note: vi.fn(),
  group: vi.fn(),
  select: vi.fn(),
  confirm: vi.fn(),
  text: vi.fn(),
  spinner: () => ({
    start: vi.fn(),
    stop: vi.fn(),
  }),
  isCancel: vi.fn().mockReturnValue(false),
  cancel: vi.fn(),
}))

// Mock timers to avoid real setTimeout
vi.mock('node:timers/promises', () => ({
  setTimeout: vi.fn().mockResolvedValue(undefined),
}))

// Mock the logger to prevent console output during tests
vi.mock('../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    success: vi.fn(),
    debug: vi.fn(),
  },
}))

import { runUserPromptCli } from './index.js'

describe('runUserPromptCli', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Matrix-based test approach - define test dimensions
  const routers = ['react-router', 'tanstack-router', undefined]
  const styles = ['tailwind', false, undefined]
  const databases = ['sqlite', false, undefined]
  const orms = ['drizzle', false, undefined]
  const gitOptions = [true, false, undefined]
  const pkgOptions = [true, false, undefined]
  const ideOptions = ['vscode', 'cursor', false, undefined]

  // Primary matrix test - test all router and style combinations
  describe('Matrix tests - router × styles × database × orm', () => {
    routers.forEach((router) => {
      styles.forEach((style) => {
        databases.forEach((database) => {
          // Only test valid orm configurations
          const validOrms = database === false ? [false] : orms
          validOrms.forEach((orm) => {
            // Skip invalid combinations
            if (database === false && orm !== false) return

            const testName =
              `router=${router || 'undefined'}, ` +
              `styles=${style === false ? 'false' : style || 'undefined'}, ` +
              `database=${database === false ? 'false' : database || 'undefined'}, ` +
              `orm=${orm === false ? 'false' : orm || 'undefined'}`

            it(testName, async () => {
              const cliArgs = {
                ci: true,
                y: true,
                project_name: `test-matrix-${Math.floor(Math.random() * 1000)}`,
                project_dir: './test-dir',
                router,
                styles: style,
                database,
                orm,
                pkg_manager: 'npm',
                initialize_git: true,
                install_packages: true,
                ide: 'vscode',
              }

              // Handle the case where orm is specified without database
              if (orm && typeof orm === 'string' && database === undefined) {
                // Should set database to default
                const result = await runUserPromptCli(cliArgs as Yargs)
                expect(result.packages.database).toBe('sqlite')
                expect(result.packages.orm).toBe(orm)
                return
              }

              const result = await runUserPromptCli(cliArgs as Yargs)

              // Validate router
              if (router) {
                expect(result.packages.router).toBe(router)
              } else {
                expect(result.packages.router).toBeDefined()
              }

              // Validate styles
              expect(result.packages.styles).toBe(
                style !== undefined ? style : result.packages.styles
              )

              // Validate database
              if (database !== undefined) {
                expect(result.packages.database).toBe(database)
              }

              // Validate ORM
              if (orm !== undefined) {
                expect(result.packages.orm).toBe(orm)
              } else if (database === 'sqlite') {
                expect(result.packages.orm).toBe('drizzle') // Should default to drizzle
              }

              // Ensure no prompts were shown since we're using ci:true and y:true
              expect(p.group).not.toHaveBeenCalled()
              expect(p.select).not.toHaveBeenCalled()
            })
          })
        })
      })
    })
  })

  // Secondary matrix tests for other options - we don't need to test every combination with these
  describe('Matrix tests - initialization options', () => {
    // Test matrix of git and package installation options
    gitOptions.forEach((git) => {
      pkgOptions.forEach((pkg) => {
        it(`initialize_git=${git === undefined ? 'undefined' : git}, install_packages=${pkg === undefined ? 'undefined' : pkg}`, async () => {
          const cliArgs = {
            ci: true,
            y: true,
            project_name: `test-matrix-init-${Math.floor(Math.random() * 1000)}`,
            project_dir: './test-dir',
            router: 'react-router',
            styles: 'tailwind',
            database: 'sqlite',
            orm: 'drizzle',
            pkg_manager: 'npm',
            initialize_git: git,
            install_packages: pkg,
            ide: 'vscode',
          }

          const result = await runUserPromptCli(cliArgs as Yargs)

          if (git !== undefined) {
            expect(result.initialize_git).toBe(git)
          } else {
            expect(result.initialize_git).toBe(true) // Default value
          }

          if (pkg !== undefined) {
            expect(result.install_packages).toBe(pkg)
          } else {
            expect(result.install_packages).toBe(true) // Default value
          }

          expect(p.group).not.toHaveBeenCalled()
          expect(p.select).not.toHaveBeenCalled()
        })
      })
    })

    // IDE options test matrix
    ideOptions.forEach((ide) => {
      it(`ide=${ide === undefined ? 'undefined' : ide === false ? 'false' : ide}`, async () => {
        const cliArgs = {
          ci: true,
          y: true,
          project_name: `test-matrix-ide-${Math.floor(Math.random() * 1000)}`,
          project_dir: './test-dir',
          router: 'react-router',
          styles: 'tailwind',
          database: 'sqlite',
          orm: 'drizzle',
          pkg_manager: 'npm',
          initialize_git: true,
          install_packages: true,
          ide,
        }

        const result = await runUserPromptCli(cliArgs as Yargs)

        if (ide !== undefined) {
          expect(result.ide).toBe(ide)
        }

        expect(p.group).not.toHaveBeenCalled()
        expect(p.select).not.toHaveBeenCalled()
      })
    })
  })

  // Test for prompt behavior when ci and y flags are false
  it('should prompt for values when ci and y flags are false', async () => {
    // Make mock group return the database and orm directly
    vi.mocked(p.group).mockResolvedValue({
      project_name: 'prompted-name',
      router: 'react-router',
      styles: 'tailwind',
      database: 'sqlite',
      orm: 'drizzle',
      initialize_git: true,
      install_packages: true,
      ide: 'vscode',
    })

    const cliArgs = {
      ci: false,
      y: false,
      project_name: undefined,
      project_dir: undefined,
      router: undefined,
      styles: undefined,
      database: undefined,
      orm: undefined,
      pkg_manager: undefined,
      initialize_git: undefined,
      install_packages: undefined,
      ide: undefined,
    }

    const result = await runUserPromptCli(cliArgs as Yargs)

    expect(p.group).toHaveBeenCalled()
    expect(result.project_name).toBe('prompted-name')
    expect(result.packages.router).toBe('react-router')
    expect(result.packages.styles).toBe('tailwind')
    expect(result.packages.database).toBe('sqlite')
    expect(result.packages.orm).toBe('drizzle')
    expect(result.initialize_git).toBe(true)
    expect(result.install_packages).toBe(true)
    expect(result.ide).toBe('vscode')
  })

  // Test specific edge cases
  describe('Edge cases', () => {
    it('should handle orm=drizzle without database by setting database=sqlite', async () => {
      const cliArgs = {
        ci: true,
        y: true,
        project_name: 'test-orm-without-db',
        orm: 'drizzle',
        database: undefined,
      } as Yargs

      const result = await runUserPromptCli(cliArgs)
      expect(result.packages.database).toBe('sqlite')
      expect(result.packages.orm).toBe('drizzle')
    })

    it('should handle database=false and orm=undefined by setting orm=false', async () => {
      const cliArgs = {
        ci: true,
        y: true,
        project_name: 'test-db-false',
        database: false,
        orm: undefined,
      } as Yargs

      const result = await runUserPromptCli(cliArgs)
      expect(result.packages.database).toBe(false)
      expect(result.packages.orm).toBe(false)
    })

    it('should handle all configuration options undefined by using defaults', async () => {
      const cliArgs = {
        ci: true,
        y: true,
        project_name: 'test-defaults',
      } as Yargs

      const result = await runUserPromptCli(cliArgs)
      expect(result.packages.router).toBeDefined()
      expect(result.packages.styles).toBeDefined()
      expect(result.initialize_git).toBeDefined()
      expect(result.install_packages).toBeDefined()
      expect(result.ide).toBeDefined()
    })
  })
})
