# AGENTS.md - Aurora Project Guidelines

Welcome to **Aurora**, an AI-Powered Polar Expedition Command Platform created as a Smart India Hackathon (SIH) prototype.

This document establishes stable operational rules, architectural boundaries, and guidelines for coding agents working on the Aurora repository.

---

## 1. Repository Inspection & Current State

A thorough inspection of the repository was conducted:

- **Repository Structure:** Empty root directory containing only Git configuration (`.git/`). No pre-existing source code, frontend, or backend files exist yet.
- **Frontend Framework:** None currently initialized.
- **Backend Framework:** None currently initialized.
- **Database/Storage Technology:** None currently initialized.
- **AI/ML Components & APIs:** None currently initialized.
- **Configuration & Dependency Files:** None present (e.g., no `package.json`, `requirements.txt`, `Cargo.toml`, `.env`).
- **Tests & Documentation:** No tests, `README.md`, `CONTRIBUTING.md`, or specification files exist yet.

### Standardized Directory Structure for Future Implementation
When implementation begins, future agents must organize the codebase according to this layout and keep `AGENTS.md` / `README.md` updated as components are added:

```text
/ (repository root)
├── AGENTS.md              # Stable coding agent guidelines (this file)
├── README.md              # Setup, execution, and demonstration instructions
├── docs/                  # Project specifications, architecture, and ADRs
│   ├── spec.md            # Aurora operational & demo requirements
│   ├── architecture.md    # System component & data flow diagrams
│   ├── implementation-plan.md
│   └── adr/               # Architectural Decision Records
├── frontend/              # Web application UI (e.g., React / Vite / Next.js)
├── backend/               # Core deterministic operational service & API
│   ├── core/              # Deterministic state engine & dependency solver
│   ├── api/               # REST / WebSocket / MCP endpoints
│   └── ai/                # RAG pipeline, LLM agent interfaces, tool integrations
└── tests/                 # Unit, integration, and offline workflow tests
```

---

## 2. Project Concept & Objective

### What is Aurora?
Aurora is an **offline-first polar expedition command platform**. It provides unified situational awareness, dependency tracking, mission impact analysis, and grounded AI decision-support for polar operations.

### Current Development Objective
The objective is to build a genuinely working demonstration of the Aurora concept (approximately **75% of the intended core application**) suitable for SIH presentation and evaluation.

> **Guiding Principle:**
> **BUILD THE SMALLEST REAL IMPLEMENTATION THAT DEMONSTRATES THE CORE AURORA SYSTEM END-TO-END.**

### Central Conceptual Architecture
```text
Operational Event
  → Unified Operational State
  → Dependency & Impact Analysis
  → Offline Deterministic Core
  → Online Agentic Enhancement (when connected)
  → Proposed Action
  → Human Commander Approval
  → Operational State Updated
```

Aurora is **NOT** a generic chatbot, generic AI dashboard, or LLM-first application.

---

## 3. Primary Architectural Principle

> **THE DETERMINISTIC OPERATIONAL CORE MUST NOT DEPEND ON THE LLM, RAG SYSTEM, AGENTS, OR INTERNET CONNECTIVITY FOR CORE OPERATION.**

### Unified Operational State & Deterministic Layer
Aurora maintains an authoritative operational state covering:
- **Missions** (schedules, objectives, priority, status)
- **Cargo & Inventory** (supplies, equipment, medical, fuel)
- **Personnel** (roles, station assignments, availability)
- **Assets** (vehicles, habitats, generators, comms)
- **Field Conditions** (weather alerts, route status, temperature)
- **Dependencies & Constraints** (prerequisites, power requirements, payload limits)

The **Deterministic Core** handles:
- State updates and validation
- Dependency checking and graph traversal
- Resource constraint calculations
- Disruption impact propagation (e.g., cargo delay → affected dependent missions)
- Emergency baseline workflows

### Online AI Enhancement Layer
When online connectivity is available, the AI layer enhances (but never replaces) the core:
- Retrieval-Augmented Generation (RAG) over expedition SOPs, manuals, and safety guidelines
- Mission rescheduling assistance
- Emergency resource recommendations
- Natural-language querying over current operational state
- Agentic tool-driven recommendations

---

## 4. Human-In-The-Loop Rule

Agents must preserve this architectural boundary:

### AI MAY:
- Analyze operational state and disruptions
- Retrieve relevant documentation and SOPs
- Calculate potential impacts and resource gaps
- Generate actionable recommendations and alternatives
- Explain the rationale behind recommendations

### AI MUST NOT SILENTLY:
- Approve critical mission decisions
- Autonomously execute consequential operational state modifications
- Bypass human approval workflows where required by specification

```text
AI Recommendation → Human Commander → Approve / Modify / Reject → Operational State Updated
```

---

## 5. Offline-First Rule

"Offline-first" means the operational system remains fully functional without Internet connectivity.

- **When Offline:**
  - Local operational state remains readable and mutable.
  - Core dependency/constraint evaluation continues deterministically.
  - State changes are logged and queued for synchronization.
- **When Online:**
  - State synchronizes with remote endpoints.
  - RAG vector retrieval and online LLM agents become available.
  - External weather/data services refresh where connected.

Online AI must **never** be a hidden dependency for basic core features.

---

## 6. Demo Scope & Vertical Slice Focus

### Scope & Priority Capabilities
Focus on 5–7 deeply connected vertical capabilities rather than superficial coverage:
1. **Unified Expedition Operational State**
2. **Cargo & Dependency Tracking**
3. **Dependency / Impact Analysis**
4. **Dynamic Mission Rescheduling Assistance**
5. **Emergency Resource Recommendation**
6. **RAG over Expedition SOPs & Manuals**
7. **Resource Forecasting / Allocation Assistance**

### First Vertical Slice Target
When implementation begins, agents should build an end-to-end vertical slice:
```text
Create/Modify Mission
  → Add Cargo & Dependency Constraints
  → Simulate Disruption (e.g., Cargo Delay / Vehicle Breakdown)
  → Traversal identifies affected dependencies & missions
  → AI proposes rescheduling / alternative resource allocation
  → Commander approves proposed action in UI
  → Operational State updates cleanly
```

---

## 7. AI, RAG, Agents, and MCP Rules

### Grounding & Source of Truth
- The database/application state is the **sole source of truth**, NOT conversation history or LLM memory.
- Do not fabricate AI responses or hardcode static text to make a UI look functional.
- Clearly distinguish AI recommendations from authoritative application state in UI and logs.

### RAG Workflow
- Pattern: `User / Event → Relevant Operational State → Retrieve Relevant SOP / Manual Context → Grounded Reasoning → Recommendation / Explanation`.
- Do not pass static hardcoded strings to an LLM and label it "RAG".
- Do not fabricate citations or SOP documents.

### Agents
- Agents are specific, single-purpose decision-support components (e.g., *Mission Rescheduling Agent*, *Emergency Resource Agent*).
- Agents receive inputs, inspect state, execute approved tools, and produce structured recommendations for human review.

### Model Context Protocol (MCP)
- MCP serves as a tool/interface gateway between agents and application capabilities (`Agent → MCP Gateway → Approved App Capability`).
- Use MCP for clear tool boundaries, not as a gimmick or USP by itself.
- Tools must be read-only by default; state-modifying tools require explicit authorization and commander approval workflows.

---

## 8. Mandatory Development Workflow

Follow this cycle for all implementation tasks:

```text
PLAN → IMPLEMENT → VERIFY → REVIEW → REPORT
```

1. **PLAN:** Inspect repository context, trace dependencies, define scope and acceptance criteria.
2. **IMPLEMENT:** Make minimal, clean, coherent changes following established conventions.
3. **VERIFY:** Run builds, linters, unit/integration tests, API tests, and test negative/offline edge cases.
4. **REVIEW:** Inspect `git diff` for stray code, unintended refactoring, or exposed secrets.
5. **REPORT:** Provide a clear summary of changes, tests executed, explicit fallbacks, and known limitations.

---

## 9. Verification and Quality Rules

### Verification Requirements
Do not equate "it compiles" with "it works." Verify:
- Build & type/lint checks
- Unit and integration tests
- API and database state behavior
- Deterministic logic propagation (happy path, failure path, edge cases)
- Offline fallback behavior
- AI structured output validation and API failure/timeout handling

### Fallbacks & Mocks
- Explicit demo fallbacks (e.g., local mock weather API, dev LLM provider) are acceptable for the SIH demo.
- **Rule:** Fallbacks MUST be explicitly documented in code comments and completion reports. Never hide mocks or claim mock responses are live integrations.

---

## 10. Production vs. Demo Boundary

- **DO NOT** waste time on premature production infrastructure (e.g., multi-region deployment, enterprise k8s, complex microservice splitting, extreme caching).
- **DO NOT** create fake core logic, hardcoded success responses, hidden fake UI buttons, or unhandled errors.

> **Prefer:** REAL CORE LOGIC + SIMPLE IMPLEMENTATION + CLEAR LIMITATIONS
> **Over:** COMPLEX ARCHITECTURE + SUPERFICIAL FUNCTIONALITY

---

## 11. Secrets, Data & Scope Boundaries

- **Secrets:** Never commit API keys, tokens, or credentials. Use environment variables.
- **Data:** Use synthetic demo expedition datasets. Clearly distinguish demo data from live retrieved information.
- **Scope Control:** Do not add unrequested features (e.g., digital twins, autonomous drones, satellite visualizers) unless explicitly specified.

---

## 12. Decision Authority & Stop Conditions

Agents should act autonomously for routine tasks, but **MUST STOP AND ASK THE HUMAN** when:
- Proposed changes alter system architecture or core data models.
- Public API contracts or auth/permission boundaries need material changes.
- Offline-first behavior or human-in-the-loop approval semantics would be compromised.
- Major dependencies need replacement or technical specifications are conflicting.

---

## 13. Completion Report Template

When completing a task, summarize as follows:
1. **What was implemented:** Concise description of the completed capability.
2. **Files changed:** List of created or modified files.
3. **Tests/checks run:** Command line tests and manual verification steps executed.
4. **Tests/checks not run and why:** Any omitted tests with rationale.
5. **Fallbacks/mocks used:** Explicit list of any mocks or dev fallbacks utilized.
6. **Known limitations:** Any edge cases or features left out.
7. **Architectural decisions:** Any ADRs or structural decisions made.
8. **Next steps:** Remaining work for the slice.

---

## Core Aurora Principle

> **Build the smallest real Aurora implementation that demonstrates the operational concept end-to-end.**
>
> **Keep the deterministic operational core authoritative and functional offline.**
>
> **Use RAG and agents as grounded online enhancements rather than dependencies for core operation.**
>
> **Keep consequential decisions under human control.**
>
> **Prefer real behavior over simulated behavior, simple architecture over unnecessary infrastructure, and explicit limitations over misleading claims.**
