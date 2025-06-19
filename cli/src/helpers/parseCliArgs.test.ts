import { describe, it, expect, vi } from 'vitest'
import { parseCliArgs } from './parseCliArgs.js'
import {
  validRouters,
  validStyles,
  validPackageManagers,
} from '../types/Packages.js'
import { validIDEs } from '../types/index.js'
import path from 'path'

// Mock the logger to prevent console output during tests
vi.mock('@/utils/logger.js', () => ({
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

  // Test all valid options
  const testCases = {
    router: validRouters,
    styles: validStyles,
    // database and orm are tested separately due to their dependency
    pkg_manager: validPackageManagers,
    ide: validIDEs,
  }

  for (const [option, validValues] of Object.entries(testCases)) {
    for (const value of validValues) {
      it(`should correctly parse --${option} with valid value: ${value}`, async () => {
        const argv = createArgv([`--${option}`, value])
        const result = await parseCliArgs(argv)
        expect(result[option as keyof typeof result]).toBe(value)
      })
    }
  }

  it('should correctly parse --database and --orm with valid values', async () => {
    const argv = createArgv(['--database', 'sqlite', '--orm', 'drizzle'])
    const result = await parseCliArgs(argv)
    expect(result.database).toBe('sqlite')
    expect(result.orm).toBe('drizzle')
  })

  // Test invalid and junk options
  const junkValues = ['junk', '123', '!@#$', 'another-invalid-value']
  for (const option of Object.keys(testCases)) {
    for (const value of junkValues) {
      it(`should return undefined for --${option} with invalid value: ${value}`, async () => {
        const argv = createArgv([`--${option}`, value])
        const result = await parseCliArgs(argv)
        expect(result[option as keyof typeof result]).toBeUndefined()
      })
    }
  }

  // Test 'none' conversions for style, database, orm, ide
  const noneOptions = ['styles', 'ide']
  for (const option of noneOptions) {
    it(`should correctly parse --${option} none as false`, async () => {
      const argv = createArgv([`--${option}`, 'none'])
      const result = await parseCliArgs(argv)
      expect(result[option as keyof typeof result]).toBe(false)
    })

    it(`should return undefined for --${option} when not specified`, async () => {
      const argv = createArgv([])
      const result = await parseCliArgs(argv)
      expect(result[option as keyof typeof result]).toBeUndefined()
    })
  }

  it('should correctly parse --database none and --orm none as false', async () => {
    const argv = createArgv(['--database', 'none', '--orm', 'none'])
    const result = await parseCliArgs(argv)
    expect(result.database).toBe(false)
    expect(result.orm).toBe(false)
  })

  it('should correctly parse --git=false as false', async () => {
    const argv = createArgv(['--git=false'])
    const result = await parseCliArgs(argv)
    expect(result.initialize_git).toBe(false)
  })

  it('should correctly parse --git=true as true', async () => {
    const argv = createArgv(['--git=true'])
    const result = await parseCliArgs(argv)
    expect(result.initialize_git).toBe(true)
  })

  it('should correctly parse --install_packages=false as false', async () => {
    const argv = createArgv(['--install_packages=false'])
    const result = await parseCliArgs(argv)
    expect(result.install_packages).toBe(false)
  })

  it('should correctly parse --install_packages=true as true', async () => {
    const argv = createArgv(['--install_packages=true'])
    const result = await parseCliArgs(argv)
    expect(result.install_packages).toBe(true)
  })

  it('should handle dependent database and orm options correctly', async () => {
    // Case 1: Only database is provided
    let argv = createArgv(['--database', 'sqlite'])
    let result = await parseCliArgs(argv)
    expect(result.database).toBeUndefined()
    expect(result.orm).toBeUndefined()

    // Case 2: Only orm is provided
    argv = createArgv(['--orm', 'drizzle'])
    result = await parseCliArgs(argv)
    expect(result.database).toBeUndefined()
    expect(result.orm).toBeUndefined()

    // Case 3: Both are provided and valid
    argv = createArgv(['--database', 'sqlite', '--orm', 'drizzle'])
    result = await parseCliArgs(argv)
    expect(result.database).toBe('sqlite')
    expect(result.orm).toBe('drizzle')

    // Case 4: Both are set to none
    argv = createArgv(['--database', 'none', '--orm', 'none'])
    result = await parseCliArgs(argv)
    expect(result.database).toBe(false)
    expect(result.orm).toBe(false)
  })

  // Fuzz testing with random combinations
  it('should not fail with a mix of valid, invalid, and junk arguments', async () => {
    const argv = createArgv([
      'fuzz-project',
      '--router=react-router',
      '--styles=invalid-style',
      '--database=postgres',
      '--orm=junk-orm',
      '--pkg_manager=npm',
      '--ide=vscode',
      '--ci',
      '--y',
      '--git=true',
      '--install_packages=true',
      '--some-other-random-flag=true',
    ])

    await expect(parseCliArgs(argv)).resolves.not.toThrow()

    const result = await parseCliArgs(argv)
    expect(result.project_name).toBe('fuzz-project')
    expect(result.router).toBe('react-router')
    expect(result.styles).toBeUndefined()
    expect(result.database).toBeUndefined() // Undefined because orm is invalid
    expect(result.orm).toBeUndefined()
    expect(result.pkg_manager).toBe('npm')
    expect(result.ide).toBe('vscode')
    expect(result.ci).toBe(true)
    expect(result.y).toBe(true)
    expect(result.initialize_git).toBe(true)
    expect(result.install_packages).toBe(true)
  })
})
