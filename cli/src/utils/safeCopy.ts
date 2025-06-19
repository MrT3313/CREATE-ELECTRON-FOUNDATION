import fs from 'fs-extra'
import { FileSystemError } from './errors'

export const safeCopy = (sourcePath: string, destPath: string) => {
  try {
    fs.copySync(sourcePath, destPath)
  } catch (err) {
    throw new FileSystemError('Failed to copy boilerplate files', {
      originalError: err,
      source: sourcePath,
      destination: destPath,
    })
  }
}
