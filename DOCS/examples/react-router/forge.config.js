// Import the version from package.json to use in the output directory path
// This ensures the build output is versioned and organized
const { name, version } = require('./package.json')

// Export the Electron Forge configuration object
// This configuration defines how Electron Forge will package and build your application
module.exports = {
  // Output directory for the built application
  // Uses template literal to include version number in the path (e.g., "release/1.0.0")
  // This helps organize builds by version and prevents conflicts between different builds
  outDir: `release/${version}`,

  // Configuration for the Electron Packager
  // These settings control how your Electron app is packaged into a distributable format
  packagerConfig: {
    // The display name of your application (shown in title bars, menus, etc.)
    name: name,

    // The name of the executable file that will be created
    // On Windows this becomes "CreateElectronFoundationApp.exe"
    // On macOS this is the name inside the .app bundle
    executableName: name,

    // Unique identifier for your application
    // Used by the operating system to identify your app
    // Should follow reverse domain notation (com.company.appname)
    appId: `com.${name.toLowerCase().replace(/ /g, '-')}.app`,

    // ASAR (Electron Archive) configuration
    // ASAR packages your app's source code into a single archive file for better performance
    asar: {
      // Directories/files to exclude from ASAR packaging
      // These will remain as regular files/folders in the final build
      // better-sqlite3: Native module that needs to be unpacked to function properly
      // db/migrations: Database migration files that may need to be accessed directly
      unpackDir: '{**/node_modules/better-sqlite3/**,**/db/migrations}',
    },

    // Additional resources to include in the packaged application
    // These files will be copied to the app's resources directory
    extraResource: [
      './dist', // Built/compiled application files
      './.env.production', // Production environment variables file
    ],
  },

  // Array of "makers" - tools that create platform-specific installers/packages
  // Each maker handles a different output format (DMG, MSI, DEB, etc.)
  makers: [
    {
      // DMG maker for macOS
      // Creates a .dmg disk image file for macOS distribution
      // DMG files are the standard way to distribute macOS applications
      name: '@electron-forge/maker-dmg',
      // Note: No additional config provided, will use default DMG settings
    },
    // Additional makers can be added here for other platforms:
    // - @electron-forge/maker-squirrel (Windows installer)
    // - @electron-forge/maker-deb (Linux Debian package)
    // - @electron-forge/maker-rpm (Linux RPM package)
    // - @electron-forge/maker-zip (Cross-platform ZIP archive)
  ],

  // Array of publishers for automatic distribution
  // Publishers can upload your built app to various platforms/services
  // Currently empty - no automatic publishing configured
  // Common publishers include:
  // - @electron-forge/publisher-github (GitHub Releases)
  // - @electron-forge/publisher-s3 (Amazon S3)
  // - @electron-forge/publisher-snapcraft (Ubuntu Snap Store)
  publishers: [],
}
