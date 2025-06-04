# Project Flow - create-electron-foundation

## Main Function Flow

```mermaid
flowchart TD
    A[Start main] --> B[Set IDE environment variable]
    B --> C[Parse command line arguments with yargs]
    C --> D[Create CLIArgs object]
    D --> E[Inject environment variables]
    E --> F[Render title]
    F --> G[Run user prompt CLI]
    G --> H[Configure packages]
    H --> I[Scaffold base project]
    I --> J[Install packages]
    J --> K[Select boilerplate]
    K --> L[Update package.json]
    L --> M{Install dependencies?}
    M -->|Yes| N[Install dependencies]
    M -->|No| O{Check migrations}
    N --> P{Database and ORM check}
    P -->|sqlite + drizzle| Q{Run migrations?}
    P -->|No| R{Initialize Git?}
    Q -->|Yes| S[Execute npm run db:setup]
    Q -->|No| T[Execute db:generate and rebuild:all]
    S --> U[Migrations completed]
    T --> U
    U --> R
    O --> R
    R -->|Yes| V[Initialize Git repository]
    R -->|No| W{IDE specified?}
    V --> X[Git initialized]
    X --> W
    W -->|Yes| Y[Open project in IDE]
    W -->|No| Z[Log success message]
    Y --> Z
    Z --> AA[End]

    style A fill:#e1f5fe
    style AA fill:#c8e6c9
    style M fill:#fff3e0
    style P fill:#fff3e0
    style Q fill:#fff3e0
    style R fill:#fff3e0
    style W fill:#fff3e0
```

## Key Components

- **CLI Parsing**: Uses yargs to handle command line arguments
- **User Interaction**: Interactive prompts for configuration
- **Package Management**: Dynamic package installation based on selections
- **Project Scaffolding**: Creates project structure and files
- **Conditional Operations**:
  - Dependency installation
  - Database migrations (SQLite + Drizzle)
  - Git initialization
  - IDE opening
- **Error Handling**: Try-catch blocks for external commands
