# Aurora — Implementation Plan

---

## 1. Executive Summary & Guiding Principle

This implementation plan provides an ordered, dependency-aware roadmap for building the **Aurora Polar Expedition Command Platform**.

> **PRIMARY IMPLEMENTATION PRINCIPLE:**
> **BUILD THE SMALLEST REAL IMPLEMENTATION THAT DEMONSTRATES THE CORE AURORA SYSTEM END-TO-END.**

Aurora is a Smart India Hackathon (SIH) prototype target representing approximately **75% of the intended core application**. It is built as a genuine working system rather than a collection of fake UI screens, disconnected buttons, or hardcoded AI responses.

### Canonical Vertical Slice Flow
The highest-priority objective is completing the canonical end-to-end operational flow as early as possible:

```text
Create/Modify Mission
  → Add Cargo + Dependencies
  → Simulate Disruption (Cargo Delay)
  → Deterministic DAG Dependency/Impact Analysis
  → AI Mission Rescheduling / Resource Recommendation
  → RAG SOP Citation & Context Retrieval
  → Commander Reviews Proposal
  → Commander Approves Action
  → Authoritative Operational State Updates
  → UI & Synchronized Devices Reflect New Valid State
```

---

## 2. Priority System & Critical Path

### Priority Classifications
- **P0 (Critical Path / Demo Essential):** Mandatory capabilities required for the canonical vertical slice and core offline state engine.
- **P1 (Core MVP Scope):** High-priority features that round out the 75% SIH operational platform.
- **P2 (Stretch / Secondary Polish):** Enhancements executed only after all P0 and P1 capabilities are fully verified.

> **BLE Transport Priority Rule:**
> **BLE is a P1 transport capability and must not block the P0 canonical operational demo. The application synchronization protocol must work through the primary local HTTP/network transport before BLE is added as an additional transport adapter.**

### Critical Path Sequence
```text
Phase 0: Repository Foundation (P0)
  ↓
Phase 1: Domain Model + Authoritative State (P0)
  ↓
Phase 2: Deterministic State Engine [DAG & Impact] (P0)
  ↓
Phase 3: FastAPI Application / API Layer (P0)
  ↓
Phase 4: First Working Frontend [React Dashboard] (P0)
  ↓
Phase 5: Client-Side Offline Replica [IndexedDB] (P0)
  ↓
Phase 6: Application Synchronization Engine [Local Transport] (P0)
  ↓
Phase 8: RAG Pipeline [ChromaDB + SOPs] (P0)
  ↓
Phase 9: MCP Tool Gateway (P0)
  ↓
Phase 10: LangGraph + Groq Agents (P0)
  ↓
Phase 11: Human Approval Gate + Action Application (P0)
  ↓
Phase 7: Local Transports + BLE Adapter (P1 - Non-blocking transport adapter)
  ↓
Phase 12: Resource Forecasting + Emergency Mode (P1)
  ↓
Phase 13: End-to-End Integration & Failure Modes (P0)
  ↓
Phase 14: SIH Demo Hardening (P0)
```

---

## 3. Dependency Graph

```text
               ┌────────────────────────┐
               │ Phase 0: Foundation    │
               └───────────┬────────────┘
                           │
               ┌───────────▼────────────┐
               │ Phase 1: Domain & DB   │
               └───────────┬────────────┘
                           │
               ┌───────────▼────────────┐
               │ Phase 2: State Engine  │
               └───────────┬────────────┘
                           │
               ┌───────────▼────────────┐
               │ Phase 3: FastAPI API   │
               └───────────┬────────────┘
                           │
               ┌───────────▼────────────┐
               │ Phase 4: First React UI│
               └───────────┬────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌────────────────────────┐          ┌────────────────────────┐
│ Phase 5: IndexedDB     │          │ Phase 8: RAG Pipeline  │
└───────────┬────────────┘          └───────────┬────────────┘
            │                                   │
┌───────────▼────────────┐          ┌───────────▼────────────┐
│ Phase 6: Sync Protocol │          │ Phase 9: FastMCP Tool  │
└───────────┬────────────┘          └───────────┬────────────┘
            │                                   │
            ├───────────────────────────────────┤
            │                                   │
┌───────────▼────────────┐          ┌───────────▼────────────┐
│ Phase 7: BLE Adapter   │          │ Phase 10: Agents (Groq)│
│ (P1 Transport Adapter) │          │ (P0 Core Demo Path)    │
└───────────┬────────────┘          └───────────┬────────────┘
            │                                   │
            └──────────────────┬────────────────┘
                               │
                   ┌───────────▼────────────┐
                   │ Phase 11: HITL Gate    │
                   └───────────┬────────────┘
                               │
                   ┌───────────▼────────────┐
                   │ Phase 12: Forecast/Emer│
                   └───────────┬────────────┘
                               │
                   ┌───────────▼────────────┐
                   │ Phase 13: Integration  │
                   └───────────┬────────────┘
                               │
                   ┌───────────▼────────────┐
                   │ Phase 14: Hardening    │
                   └────────────────────────┘
```

---

## 4. Phase-by-Phase Implementation Roadmap

### PHASE 0 — REPOSITORY FOUNDATION
- **Goal:** Initialize Python backend and React/Vite frontend environments, dependencies, linting, and healthcheck scaffolding.
- **Why this phase exists:** Establish clean, reproducible development and execution baselines before writing domain code.
- **Prerequisites:** Python 3.11, Node.js 18+, Git repository.
- **Tasks:**
  1. Create `backend/` structure: `venv`, `requirements.txt` (FastAPI, uvicorn, sqlmodel, networkx, pydantic).
  2. Create `frontend/` structure: Vite + React 18 SPA template, Tailwind CSS, Lucide icons, Dexie.js.
  3. Configure `.env.example` with `GROQ_API_KEY`, `DATABASE_URL`, `LOG_LEVEL`.
  4. Implement `GET /health` endpoint in `backend/main.py`.
  5. Create `scripts/dev_run.sh` to start backend (`port 8000`) and frontend (`port 5173`) concurrently.
- **Expected Files:** `backend/main.py`, `backend/requirements.txt`, `frontend/package.json`, `frontend/vite.config.js`, `scripts/dev_run.sh`, `.env.example`.
- **Acceptance Criteria:** Backend and frontend start without errors via `dev_run.sh`; frontend successfully fetches `/health` from backend.
- **Verification:** Run `pytest` skeleton in `backend/` and `npm run build` in `frontend/`.
- **Demo Value:** Verifies dev setup and local network connectivity.
- **Priority:** P0
- **Definition of Done:** Foundation scripts run cleanly, returning HTTP 200 health status.

---

### PHASE 1 — DOMAIN MODEL + AUTHORITATIVE STATE
- **Goal:** Implement SQLModel entity definitions and central SQLite database persistence for core operational domain objects.
- **Why this phase exists:** Establish the single global authoritative source of truth for all operational state.
- **Prerequisites:** Phase 0.
- **Tasks:**
  1. Implement SQLModel classes in `backend/core/models.py`: `Station`, `Mission`, `Cargo`, `Asset`, `Personnel`, `Dependency`, `Disruption`, `Recommendation`, `ApprovalAudit`.
  2. Configure central SQLite connection in `backend/persistence/database.py` with WAL mode enabled.
  3. Implement synthetic seed dataset generator in `backend/persistence/seed.py` matching spec data requirements (3 stations, 5 missions, 10 cargo, 4 assets, 8 personnel).
- **Expected Files:** `backend/core/models.py`, `backend/persistence/database.py`, `backend/persistence/seed.py`.
- **Acceptance Criteria:** SQLite database initializes cleanly; seed script populates all entities with deterministic GUIDs.
- **Verification:** Unit test `tests/test_persistence.py` verifies SQLite CRUD operations and entity relationships.
- **Demo Value:** Authoritative database holds full synthetic expedition state.
- **Priority:** P0
- **Definition of Done:** Database seeds reproducibly and passes all relational persistence tests.

---

### PHASE 2 — DETERMINISTIC STATE ENGINE
- **Goal:** Build the NetworkX DAG dependency solver, cycle detector, and disruption impact engine.
- **Why this phase exists:** The core value proposition of Aurora is deterministic impact propagation that runs fully offline without AI, internet, or external network dependencies.
- **Prerequisites:** Phase 1.
- **Tasks:**
  1. Implement `backend/core/graph_solver.py`: Convert database dependencies into NetworkX Directed Acyclic Graph (DAG).
  2. Implement cycle prevention: Execute `nx.simple_cycles` when adding dependencies and reject cycles with `CyclicDependencyError`.
  3. Implement impact traversal: Given a `Cargo` delay disruption event, traverse outbound DAG edges to identify directly and transitively affected `Missions` and `Assets`.
  4. Implement `backend/core/constraints.py`: Evaluate fuel, power, and temporal overlaps.
- **Expected Files:** `backend/core/graph_solver.py`, `backend/core/constraints.py`, `tests/test_deterministic_core.py`.
- **Acceptance Criteria:** Cargo delay correctly marks dependent missions as `IMPACTED`; cycle attempts are rejected; results are reproducible for identical operational state and disruption inputs.
- **Verification:** Run `pytest tests/test_deterministic_core.py` verifying direct and transitive impact propagation offline.
- **Demo Value:** Demonstrates real deterministic disruption analysis without AI.
- **Priority:** P0
- **Definition of Done:** Deterministic core processes disruption events offline and passes all DAG cycle and impact tests.

---

### PHASE 3 — FASTAPI APPLICATION / API LAYER
- **Goal:** Expose RESTful API routes over the deterministic operational core.
- **Why this phase exists:** Connect frontend and external clients to backend state and domain engines.
- **Prerequisites:** Phase 2.
- **Tasks:**
  1. Implement `backend/api/routes_missions.py`: GET/POST/PUT mission endpoints.
  2. Implement `backend/api/routes_cargo.py`: Cargo status updates and list endpoints.
  3. Implement `backend/api/routes_disruptions.py`: POST disruption event endpoint (triggers DAG impact analysis).
  4. Implement Pydantic request/response schemas in `backend/api/schemas.py`.
- **Expected Files:** `backend/api/routes_missions.py`, `backend/api/routes_cargo.py`, `backend/api/routes_disruptions.py`, `backend/api/schemas.py`.
- **Acceptance Criteria:** Ingesting a cargo delay via REST API returns a structured JSON `ImpactSet` payload.
- **Verification:** Run FastAPI `TestClient` API tests in `tests/test_api_routes.py`.
- **Demo Value:** API provides structured access to operational state and impact calculations.
- **Priority:** P0
- **Definition of Done:** API endpoints handle CRUD and disruption requests with full input validation.

---

### PHASE 4 — FIRST WORKING FRONTEND
- **Goal:** Build a responsive React SPA providing dashboard views, cargo tracking, disruption injection, and visual dependency graphs.
- **Why this phase exists:** Allow human commanders to inspect state and simulate disruptions visually.
- **Prerequisites:** Phase 3.
- **Tasks:**
  1. Build `OperationalOverview.jsx`: Display active stations, missions, and system status indicators.
  2. Build `CargoTracker.jsx`: Display cargo inventory, arrival status, and delay badges.
  3. Build `DisruptionSimulator.jsx`: Form to inject cargo delay events.
  4. Build `DependencyGraph.jsx`: Render interactive/visual mission-cargo dependency links.
  5. Build `ConnectionPill.jsx`: Display Online/Offline connectivity status indicator.
- **Expected Files:** `frontend/src/components/Dashboard/`, `frontend/src/components/Cargo/`, `frontend/src/services/api.js`.
- **Acceptance Criteria:** User can inject a cargo delay in the UI, causing affected missions to highlight in red with exact delay reasons.
- **Verification:** Manual UI walkthrough executing the deterministic portion of the canonical vertical slice.
- **Demo Value:** Real-time visual representation of operational impact.
- **Priority:** P0
- **Definition of Done:** Deterministic workflow executes end-to-end through the web interface.

---

### PHASE 5 — CLIENT-SIDE OFFLINE REPLICA
- **Goal:** Implement client-side IndexedDB database (Dexie.js) and local `mutation_queue` for PWA browser offline operation.
- **Why this phase exists:** Enable field laptops and tablets to view client state replicas and record offline mutations when backend connectivity is severed.
- **Prerequisites:** Phase 4.
- **Tasks:**
  1. Implement `frontend/src/services/indexedDBStore.js`: Define Dexie.js schema for local state replicas of missions, cargo, assets, and `mutation_queue`.
  2. Implement hydration & optimistic update logic in `OperationalStateContext.jsx`.
  3. Implement offline mutation queuing: When offline, state edits write to IndexedDB `mutation_queue` with `synced = false`.
- **Expected Files:** `frontend/src/services/indexedDBStore.js`, `frontend/src/context/OperationalStateContext.jsx`.
- **Acceptance Criteria:** App remains fully readable and supports local form submissions when network is disconnected.
- **Verification:** Disconnect network in browser DevTools; verify local edits persist in IndexedDB and queue for sync.
- **Demo Value:** Demonstrates true offline PWA responsiveness.
- **Priority:** P0
- **Definition of Done:** Client app operates offline seamlessly using local IndexedDB state replicas.

---

### PHASE 6 — SYNCHRONIZATION ENGINE
- **Goal:** Implement the transport-agnostic Application Sync Protocol engine with field-level Last-Write-Wins (LWW) conflict resolution over local HTTP transport.
- **Why this phase exists:** Enable peer-to-peer state reconciliation across field devices and the central base station backend over primary local network routes.
- **Prerequisites:** Phase 5.
- **Tasks:**
  1. Implement `backend/sync/protocol.py`: Format `ChangeRecord` payloads with `device_id`, `device_seq_num`, `timestamp_utc`, and `field_revisions`.
  2. Implement `SyncMerger` reconciliation logic: Deduplicate by `op_id`; resolve conflicts via field-level LWW.
  3. Implement REST sync routes: `POST /api/v1/sync/push` and `GET /api/v1/sync/pull`.
  4. Implement client queue flusher in `frontend/src/context/SyncContext.jsx`.
- **Expected Files:** `backend/sync/protocol.py`, `backend/api/routes_sync.py`, `frontend/src/context/SyncContext.jsx`, `tests/test_sync_engine.py`.
- **Acceptance Criteria:** Two isolated database instances reconcile queued offline changes deterministically upon connection.
- **Verification:** Run `pytest tests/test_sync_engine.py` simulating multi-device operation merging and deduplication.
- **Demo Value:** Multi-device synchronization operating deterministically over local transport.
- **Priority:** P0
- **Definition of Done:** Offline mutations replay, resolve conflicts via LWW, and reconcile with authoritative central state.

---

### PHASE 7 — LOCAL TRANSPORTS + BLE ADAPTER
- **Goal:** Implement physical transport adapters, isolating BLE GATT communication into a dedicated physical transport layer.
- **Why this phase exists:** Allow field devices to exchange sync records over local BLE transport as an additional local transport adapter without touching domain logic.
- **Prerequisites:** Phase 6.
- **Tasks:**
  1. Implement `backend/sync/ble_adapter.py`: Implement BLE GATT transport with packet chunking, integrity validation, and hop/TTL handling according to `docs/architecture.md`.
  2. Implement `scripts/device_bridge.py`: Python daemon using `bleak` for background BLE scanning and store-and-forward relay.
  3. Implement Web Bluetooth integration in `frontend/src/services/bleService.js`.
- **Expected Files:** `backend/sync/ble_adapter.py`, `scripts/device_bridge.py`, `frontend/src/services/bleService.js`.
- **Acceptance Criteria:** Compressed sync payload chunks travel over BLE transport adapter and rebuild cleanly into application `ChangeRecord` objects.
- **Verification:** Test script executing packet chunking, transmission, assembly, and CRC verification.
- **Demo Value:** Peer-to-peer BLE sync capability in disconnected environments.
- **Priority:** P1 (Non-blocking transport capability)
- **Definition of Done:** Sync payloads transfer successfully over BLE transport adapter and process through the Sync Protocol.

---

### PHASE 8 — RAG PIPELINE
- **Goal:** Build the ChromaDB vector retrieval pipeline using real expedition SOP Markdown files and SentenceTransformers embeddings.
- **Why this phase exists:** Provide grounded, citation-backed safety and procedural context for AI decision support.
- **Prerequisites:** Phase 3.
- **Tasks:**
  1. Populate `data/sops/`: Add `Polar_Safety_SOP_v2.md` and `Fuel_and_Power_Contingency.md`.
  2. Implement `backend/rag/ingestion.py`: Parse Markdown into 500-character chunks with 50-character overlaps; generate embeddings via `all-MiniLM-L6-v2`.
  3. Implement `backend/rag/retriever.py`: Search local ChromaDB index and format context payloads with document titles and section metadata.
- **Expected Files:** `data/sops/*.md`, `backend/rag/ingestion.py`, `backend/rag/retriever.py`, `tests/test_rag.py`.
- **Acceptance Criteria:** Vector queries for fuel delays return top-3 relevant SOP chunks with valid metadata citations; no fabricated sources.
- **Verification:** Run `pytest tests/test_rag.py` asserting similarity score thresholds and citation metadata accuracy.
- **Demo Value:** AI reasoning backed by real expedition SOP documentation.
- **Priority:** P0
- **Definition of Done:** ChromaDB vector index embeds real SOPs and returns verifiable source citations.

---

### PHASE 9 — MCP TOOL GATEWAY
- **Goal:** Implement the FastMCP tool server providing controlled, read-only state inspection capabilities for AI agents.
- **Why this phase exists:** Expose authoritative operational state to LLM agents through a secure, structured tool boundary.
- **Prerequisites:** Phase 3.
- **Tasks:**
  1. Implement `backend/mcp/server.py`: Initialize FastMCP server instance.
  2. Implement read-only tools in `backend/mcp/tools.py`: `get_operational_state()`, `analyze_disruption_impact()`, `check_cargo_dependencies()`, `search_expedition_sops()`.
  3. Enforce state-modifying tool boundary: Mutation tools return pending proposal objects rather than writing to database.
- **Expected Files:** `backend/mcp/server.py`, `backend/mcp/tools.py`, `tests/test_mcp_tools.py`.
- **Acceptance Criteria:** MCP tools execute query operations and return valid JSON state schemas; mutation tools cannot bypass approval gates.
- **Verification:** Run `pytest tests/test_mcp_tools.py` testing tool inputs, outputs, and authorization constraints.
- **Demo Value:** Structured, secure tool interface for AI agents.
- **Priority:** P0
- **Definition of Done:** FastMCP server exposes read-only tools and validates input/output schemas cleanly.

---

### PHASE 10 — LANGGRAPH + GROQ AGENTS
- **Goal:** Implement Mission Rescheduling Agent and Emergency Resource Agent using LangGraph state machines and Groq LLM inference.
- **Why this phase exists:** Provide grounded, intelligent decision support for complex rescheduling and resource trade-offs.
- **Prerequisites:** Phase 8, Phase 9.
- **Tasks:**
  1. Implement `backend/ai/rescheduling_agent.py`: LangGraph state machine (Inspect Impact → Query RAG SOP → Call Groq API → Validate Pydantic Proposal).
  2. Implement `backend/ai/emergency_agent.py`: LangGraph state machine for emergency asset allocation.
  3. Implement `backend/ai/orchestrator.py`: Route requests to LangGraph workflows; fallback to rule engine if Groq is offline/timed out.
- **Expected Files:** `backend/ai/rescheduling_agent.py`, `backend/ai/emergency_agent.py`, `backend/ai/orchestrator.py`, `tests/test_agent_workflows.py`.
- **Acceptance Criteria:** Rescheduling Agent generates structured proposal shifting impacted mission and citing RAG SOP; output is Pydantic validated.
- **Verification:** Run `pytest tests/test_agent_workflows.py` testing agent outputs and offline rule fallbacks.
- **Demo Value:** Intelligent, grounded decision-support assistance.
- **Priority:** P0
- **Definition of Done:** Agents produce structured proposal payloads grounded in state and RAG SOPs.

---

### PHASE 11 — HUMAN APPROVAL + ACTION APPLICATION
- **Goal:** Implement the Human-in-the-Loop (HITL) approval gate and state mutation applier.
- **Why this phase exists:** Ensure AI recommendations never mutate database entities silently without explicit Commander confirmation.
- **Prerequisites:** Phase 10.
- **Tasks:**
  1. Implement `backend/core/approval_engine.py`: Handle `Approve`, `Modify`, and `Reject` actions. Apply approved updates to central SQLite database.
  2. Implement `backend/api/routes_approvals.py`: REST routes for pending proposals and approval submissions.
  3. Implement `ApprovalModal.jsx` in frontend: UI modal displaying current state, impact set, AI proposal, RAG citations, and `Approve`/`Reject` controls.
  4. Implement immutable audit logging: Record `ApprovalAudit` entries upon decision submission.
- **Expected Files:** `backend/core/approval_engine.py`, `backend/api/routes_approvals.py`, `frontend/src/components/Common/ApprovalModal.jsx`, `tests/test_approval_gate.py`.
- **Acceptance Criteria:** Clicking `Approve` in UI mutates SQLite database state and clears impact warning; unapproved recommendations cannot alter state.
- **Verification:** Run `pytest tests/test_approval_gate.py` asserting state remains unchanged until explicit approval API call.
- **Demo Value:** Completes the canonical vertical slice from disruption to approved state update.
- **Priority:** P0
- **Definition of Done:** The complete canonical vertical slice operates end-to-end through UI and API with mandatory human approval.

---

### PHASE 12 — RESOURCE FORECASTING + EMERGENCY MODE
- **Goal:** Build supply-demand forecasting and offline emergency resource triage workflows.
- **Why this phase exists:** Round out key operational capabilities required by spec.md.
- **Prerequisites:** Phase 11.
- **Tasks:**
  1. Implement 7-day rolling supply/demand resource calculator in `backend/core/constraints.py`.
  2. Implement emergency triage engine: Filter nearby operational assets and personnel specialties during emergency triggers (<50ms execution).
  3. Build `ResourceForecast.jsx` and `EmergencyPanel.jsx` UI views.
- **Expected Files:** `backend/core/constraints.py`, `frontend/src/components/Dashboard/ResourceForecast.jsx`, `frontend/src/components/Dashboard/EmergencyPanel.jsx`.
- **Acceptance Criteria:** System detects resource deficits when mission demand exceeds supply; emergency mode outputs feasible asset options offline within 50ms.
- **Verification:** Run unit tests for resource forecasting and emergency triage filters.
- **Demo Value:** Demonstrates resource visibility and rapid emergency response capability.
- **Priority:** P1
- **Definition of Done:** Resource forecasting and emergency triage engines operate deterministically offline.

---

### PHASE 13 — END-TO-END INTEGRATION + FAILURE MODES
- **Goal:** Execute comprehensive system integration and verify graceful degradation across all 5 spec failure scenarios.
- **Why this phase exists:** Ensure absolute resilience when online AI, vector DB, or transport links fail.
- **Prerequisites:** Phase 12.
- **Tasks:**
  1. Verify Scenario 1: Cargo Delay (Canonical Vertical Slice).
  2. Verify Scenario 2: Vehicle Asset Failure.
  3. Verify Scenario 3: Emergency Heating Shortage.
  4. Verify Scenario 4: Offline Field Mode (Simulate total network disconnect).
  5. Verify Scenario 5: AI Provider Timeout (Simulate Groq API 5-second timeout and verify fallback to rule engine).
- **Expected Files:** `tests/test_integration_scenarios.py`.
- **Acceptance Criteria:** System handles all failure scenarios gracefully without crashing; offline deterministic core remains fully functional in all cases.
- **Verification:** Run `pytest tests/test_integration_scenarios.py` verifying system behavior under network, API, and storage failures.
- **Demo Value:** Proves platform resilience under realistic polar failure conditions.
- **Priority:** P0
- **Definition of Done:** All 5 demo scenarios pass automated and manual integration verification.

---

### PHASE 14 — SIH DEMO HARDENING
- **Goal:** UI polish, loading/error state handling, seed reset workflow, and SIH demonstration preparation.
- **Why this phase exists:** Ensure a seamless, repeatable, and bulletproof presentation for SIH evaluators.
- **Prerequisites:** Phase 13.
- **Tasks:**
  1. Add UI state indicators for Loading, Empty, Offline, AI Degraded, and Pending Approval.
  2. Implement `POST /api/v1/system/reset` endpoint to reset central SQLite database to initial seed state instantly between evaluator demos.
  3. Perform responsive layout checks on mobile (375px), tablet (768px), and desktop (1920px) viewports.
  4. Verify zero credentials exposed in client bundles or log outputs.
  5. Finalize `README.md` with one-command execution instructions (`./scripts/dev_run.sh`).
- **Expected Files:** `README.md`, `backend/api/routes_system.py`, `frontend/src/App.jsx`.
- **Acceptance Criteria:** Evaluator can reset system state with one click and execute the complete demonstration repeatedly without bugs.
- **Verification:** Full end-to-end dry-run demonstration execution.
- **Demo Value:** Professional, robust, and repeatable SIH project presentation.
- **Priority:** P0
- **Definition of Done:** System seeds, runs, resets, and demonstrates smoothly across viewports and failure modes.

---

## 5. Demo Checkpoints

| Checkpoint | Target Phase | Demonstrable Capability |
| :--- | :--- | :--- |
| **Checkpoint A** | Phase 2 | Backend deterministic core processes cargo delay disruption and computes DAG impact offline. |
| **Checkpoint B** | Phase 4 | React UI renders operational dashboard, cargo tracker, and highlights impacted missions visually. |
| **Checkpoint C** | Phase 5 | PWA operates offline using IndexedDB client replica; queues mutations when network is disconnected. |
| **Checkpoint D** | Phase 6 | Multi-device synchronization reconciles offline change records deterministically over local transport. |
| **Checkpoint E** | Phase 9 | FastMCP tool gateway exposes read-only state inspectors with Pydantic validation. |
| **Checkpoint F** | Phase 10 | LangGraph agents generate structured rescheduling proposals backed by ChromaDB RAG SOP citations. |
| **Checkpoint G** | Phase 11 | Commander reviews AI proposal in UI modal, clicks `Approve`, and authoritative state mutates cleanly. |
| **Checkpoint H** | Phase 14 | Complete SIH demonstration runs smoothly across all 5 demo scenarios and offline failure modes. |

---

## 6. Testing Strategy

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      End-to-End Integration Tests                      │
│             (Canonical Vertical Slice & 5 Spec Scenarios)              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                  API & Approval Gate Integration Tests                 │
│         (FastAPI TestClient, Schema Validation, HITL Enforcement)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                  Deterministic Domain & Core Unit Tests                │
│         (NetworkX DAG Traversal, Cycle Prevention, Sync LWW Merger)    │
└────────────────────────────────────────────────────────────────────────┘
```

The Aurora testing suite is organized into four explicit, mandatory categories:

### 1. UNIT TESTING
Tests isolated functions, classes, and domain modules:
- Deterministic DAG graph traversal and impact propagation
- Cycle prevention checks (`CyclicDependencyError`)
- Capacity, power, and fuel constraint calculations
- Sync protocol conflict resolution (field-level LWW merger)
- `ChangeRecord` payload serialization and validation
- RAG document chunking and embedding generation
- MCP tool input/output schema validation
- Approval engine transaction validation

### 2. INTEGRATION TESTING
Verifies interactions and data flows across system layer boundaries:
- Frontend → FastAPI REST endpoints
- FastAPI → Deterministic Core Engine
- Deterministic Core → SQLite Authoritative Database
- IndexedDB Client Replica → Synchronization Engine
- Sync Protocol → Transport Adapters (Local HTTP & BLE)
- MCP Gateway → Operational State Inspection Services
- LangGraph Agents → MCP Tools / ChromaDB RAG Context
- Approval Engine → Authoritative SQLite Database Mutations

### 3. REGRESSION TESTING
Guarantees previously validated P0 capabilities remain operational as implementation progresses. All P0 capabilities must have repeatable regression tests executed during every phase validation:
- Canonical cargo-delay disruption scenario
- Deterministic DAG impact propagation and reproducible impact outputs
- Offline state inspection and PWA responsiveness
- Multi-device synchronization convergence
- Human-in-the-Loop approval gate enforcement
- AI service failure fallback to deterministic rule engine
- RAG SOP citation accuracy and source metadata preservation

*Rule:* Regression tests must NEVER be weakened or deleted merely to make a new feature pass.

### 4. BACKWARD COMPATIBILITY TESTING
Verifies compatibility with intentionally retained system contracts:
- Established FastAPI REST API schemas and JSON response shapes
- Persisted synthetic seed dataset structure and deterministic GUIDs
- `ChangeRecord` serialization formats and sync protocol payloads
- React state context interfaces and IndexedDB store schemas
- Canonical end-to-end demonstration workflow steps

---

## 7. Agent Coding Workflow & Stop Conditions

### Agent Execution Loop
For every implementation task, coding agents MUST follow this loop:

```text
PLAN → IMPLEMENT → VERIFY → REVIEW → REPORT
```

1. **PLAN:** Inspect existing code, read `AGENTS.md`, `docs/spec.md`, and `docs/architecture.md`. Define exact scope.
2. **IMPLEMENT:** Make minimal, clean, coherent changes following established conventions.
3. **VERIFY:** Execute relevant unit and integration tests (`pytest`, `npm test`). Verify actual behavior.
4. **REVIEW:** Check `git diff` for stray code, unintended refactoring, or exposed credentials.
5. **REPORT:** Provide a clear summary of changes, tests executed, explicit fallbacks, and known limitations.

### Mandatory Stop Conditions
A coding agent MUST stop and request human guidance if an implementation choice would materially change:
- Authoritative state semantics or database ownership
- Deterministic core boundaries (introducing AI dependencies into core)
- Offline-first execution capabilities
- Application Sync Protocol semantics or LWW conflict resolution rules
- Human-in-the-Loop approval gate semantics
- Public REST API contracts or core domain entity models

---

## 8. Avoid Overengineering (Non-Goals)

Coding agents are strictly prohibited from wasting implementation effort on:
- Production Kubernetes clusters or multi-region infrastructure
- Microservice decomposition (must remain a Modular Monolith)
- Real-time satellite modem / iridium hardware integrations
- Custom BLE hardware development
- Full enterprise ERP / accounting modules
- Autonomous execution agents that bypass human approval
- Complex 3D / GIS digital twin rendering engines

---

## 9. Traceability Matrix

| Spec Acceptance Criteria | Implementation Phase | Primary Module | Verification Method |
| :--- | :--- | :--- | :--- |
| **AC-01 (Unified State Model)** | Phase 1 | `backend/core/models.py` | `tests/test_persistence.py` |
| **AC-03 (Offline Disruption Analysis)**| Phase 2 | `backend/core/graph_solver.py` | `tests/test_deterministic_core.py` |
| **AC-05 (Reproducible Results)** | Phase 2 | `backend/core/graph_solver.py` | `tests/test_deterministic_core.py` |
| **AC-06 (Offline Core Execution)** | Phase 5 | `frontend/src/services/indexedDBStore.js` | DevTools offline PWA simulation |
| **AC-08 (Real RAG Citations)** | Phase 8 | `backend/rag/retriever.py` | `tests/test_rag.py` |
| **AC-10 (Human Approval Gate)** | Phase 11 | `backend/core/approval_engine.py` | `tests/test_approval_gate.py` |
| **AC-13 (Canonical Vertical Slice)** | Phase 11 & 13 | Full System Integration | `tests/test_integration_scenarios.py` |

---

## 10. Definition of Implementation Done

The Aurora implementation is considered complete for the SIH project target when:

1. **Deterministic Core Works Offline:** Missions, cargo, assets, and dependency constraints persist in SQLite (authoritative) / IndexedDB (client replica) and process disruption events deterministically via NetworkX DAG traversal without AI or network connectivity.
2. **Authoritative State vs. Client Replica Semantics Preserved:** Authoritative operational state persists in central SQLite, while supported client state is replicated in IndexedDB for offline operation.
3. **Canonical Vertical Slice Operates End-to-End:** Ingesting a cargo delay calculates impact, triggers LangGraph/Groq AI rescheduling with ChromaDB RAG SOP citations, presents a proposal in the UI, and mutates authoritative state ONLY upon explicit Commander approval.
4. **Offline Client & Sync Function:** React UI renders cached state offline via IndexedDB; changes queue in `mutation_queue` and reconcile deterministically across devices via field-level LWW sync protocol.
5. **AI/Transport Fallbacks Work Gracefully:** Loss of Groq API, ChromaDB, or BLE degrades only the enhancement layer, falling back to rule engines while keeping the deterministic core fully operational.
6. **Evaluator Reset Path Exists:** Evaluators can trigger `POST /api/v1/system/reset` to restore the pre-packaged seed dataset instantly for repeatable demonstration walkthroughs.
7. **No Fake Functionality:** Zero fake UI buttons, mock AI responses presented as live reasoning, or hardcoded success states exist. All displayed data reflects real system state.

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
