- Electron (main, renderer, utility, preload processes)
- ORM & Migrations: Drizzle
- Database: SQLite
- Testing: Jest & Playwright
- Logging: electron-log (centralized logging: renderer or electron-log/renderer sends logs to electron-log/main through the log.initialize() in the main process)
- Bundler: Vite
- Builder: Electron Forge