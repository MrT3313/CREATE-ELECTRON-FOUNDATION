import fs from 'fs-extra'
import path from 'path'
import { FileSystemError } from './errors.js'

export const safeCopy = (src: string, dest: string): void => {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(dest)
    fs.ensureDirSync(destDir)

    // Check if source exists
    if (!fs.existsSync(src)) {
      throw new FileSystemError(
        `Source file/directory does not exist: ${src}`,
        src
      )
    }

    // Copy the file/directory
    fs.copySync(src, dest, { overwrite: true })
  } catch (error) {
    if (error instanceof FileSystemError) {
      throw error
    }

    throw new FileSystemError(
      `Failed to copy ${src} to ${dest}`,
      src,
      error as Error
    )
  }
}
