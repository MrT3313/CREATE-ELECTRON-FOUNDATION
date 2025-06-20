import path from 'path'
import os from 'os'

export const getElectronUserDataPath = (appName: string): string => {
  const platform = os.platform()
  const homeDir = os.homedir()

  switch (platform) {
    case 'darwin': // macOS
      return path.join(homeDir, 'Library', 'Application Support', appName)
    case 'win32': // Windows
      return path.join(homeDir, 'AppData', 'Roaming', appName)
    case 'linux':
    default:
      return path.join(homeDir, '.config', appName)
  }
}