# DESIGN: Pixel Game VSA Refactoring

## 1. Alternative Matrix: Layered vs. Vertical Slice (VSA)

| Metric | Option A: Horizontal Layered (Current) | Option B: Vertical Slice Architecture (Chosen) |
| :--- | :--- | :--- |
| **Scalability** | 2/5 (Fragile context) | 5/5 (Feature isolation) |
| **Maintainability** | 2/5 (High coupling) | 5/5 (Low coupling) |
| **Implementation Speed**| 4/5 (Familiarity) | 3/5 (Initial setup overhead) |
| **Complexity** | 3/5 (Implicit) | 4/5 (Explicit boundaries) |

**Justification**: VSA allows the Agent to focus on a single feature context, reducing architectural regression and making feature-based commits atomic and clean.

## 2. C4 Model Diagrams

### L1: System Context
```mermaid
graph TD
    User((Player))
    System[Pixel Quiz Game]
    Jira(Jira API)
    GAS(Google Apps Script)

    User -- "Plays Game" --> System
    System -- "Fetches Tickets as Questions" --> Jira
    System -- "Submits Scores" --> GAS
```

### L2: Container Diagram
```mermaid
graph TD
    subgraph Browser
        UI[React Redux/FSM Shell]
    end
    
    subgraph External
        API[Jira/GAS Proxy]
        DB[(Cloud Storage)]
    end

    UI -- "HTTPS/JSON" --> API
    API -- "CRUD" --> DB
```

### L3: Component Diagram (VSA Focus)
```mermaid
graph LR
    subgraph Core
        FSM[App State Machine]
    end

    subgraph Feature_Auth
        Login[LoginView] -- "ID Trace" --> FSM
    end

    subgraph Feature_Quiz
        Engine[Quiz Domain Logic]
        Game[GameView] -- "Score" --> Engine
        Engine -- "State" --> FSM
    end

    subgraph Feature_Audio
        Mixer[Audio Controller]
        FSM -- "Trigger" --> Mixer
    end
```

## 3. Key Sequence Diagrams

### Global View State Machine (FSM)
```mermaid
sequenceDiagram
    participant U as User
    participant A as App Shell (FSM)
    participant Auth as Auth Slice
    participant Quiz as Quiz Slice

    U->>A: Open App
    Note over A: State: IDLE
    A->>Auth: Render Login
    U->>Auth: Enter ID
    Auth->>A: AUTH_SUCCESS(id)
    Note over A: State: LOADING
    A->>Quiz: Start Loading Questions
    Quiz-->>A: QUESTIONS_READY
    Note over A: State: PLAYING
    A->>Quiz: Render Game
    Note over A: State: RESULT
    A->>Quiz: Show Final Score
```

## 4. Bounded Context Definitions & Guardrails
- **Feature Isolation**: Files in `features/auth` MUST NOT import from `features/quiz`.
- **Domain Purity**: `src/domain/` logic MUST NOT import from `react` or `howler`.
- **FSM Guardrail**: Any view transition NOT defined in the `AppReducer` state machine is a bug.
