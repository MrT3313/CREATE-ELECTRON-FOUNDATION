```mermaid
sequenceDiagram
    participant User
    participant main as "main (cli/src/index.ts)"
    participant runUserPromptCli as "runUserPromptCli (cli/src/cli.ts)"
    participant createProject as "createProject (cli/src/helpers/createProject.ts)"
    participant scaffoldProject as "scaffoldProject (cli/src/helpers/scaffoldProject.ts)"

    User->>main: Executes CLI

    main->>runUserPromptCli: Get project configuration choices
    note right of runUserPromptCli: User provides input for project setup
    runUserPromptCli-->>main: Return UserChoices (type: ScaffoldConfig)

    main->>createProject: Create project using UserChoices
    createProject->>scaffoldProject: Scaffold project files and structure using UserChoices
    scaffoldProject-->>createProject: Return ScaffoldingResult (e.g., success/failure, output path)
    createProject-->>main: Return ProjectCreationResult (e.g., success/failure, project summary)

    main->>User: Notify "Project created successfully"