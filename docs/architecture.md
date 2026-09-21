# Aurora — Technical Architecture Specification

---

## 1. Architecture Overview

Aurora is designed as a **Modular Monolith with an Offline-First Local State Engine and an Online AI Enhancement Gateway**.

The primary architectural goal is absolute operational resilience: the command platform must remain authoritative, functional, and fully capable of constraint evaluation, dependency tracking, and emergency decision-making even when completely disconnected from the Internet, cloud servers, or AI LLM services.

### System Architecture Diagrams

#### 1. Core Operational & Offline Flow
```text
┌────────────────────────────────────────────────────────────────────────┐
│                   React + Vite Responsive Frontend                     │
│               (Laptop / Tablet / Mobile Web Application)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / WebSockets
┌───────────────────────────────────▼────────────────────────────────────┐
│                       FastAPI Backend Service                          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                  Deterministic Operational Engine                  │ │
│ │  - State Mutation Manager    - Dependency Graph Solver (NetworkX)  │ │
│ │  - Constraint Evaluator      - Baseline Emergency Triage Engine    │ │
│ └──────────────────────────────────┬─────────────────────────────────┘ │
│                                    │                                   │
│ ┌──────────────────────────────────▼─────────────────────────────────┐ │
│ │               Local Persistence Layer (SQLite + SQLModel)          │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### 2. Online Agentic & AI Enhancement Flow (When Connected)
```text
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend Service                         │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                    AI Orchestration Subsystem                      │ │
│ │                                                                    │ │
│ │  ┌──────────────────────────────────────────────────────────────┐  │ │
│ │  │             LangGraph Agent Orchestrator                     │  │ │
│ │  │  - Mission Rescheduling Agent  - Emergency Resource Agent    │  │ │
│ │  └──────────────┬───────────────────────────────┬───────────────┘  │ │
│ │                 │                               │                  │ │
│ │                 ▼                               ▼                  │ │
│ │  ┌─────────────────────────────┐ ┌──────────────────────────────┐  │ │
│ │  │  RAG Subsystem (ChromaDB)   │ │  MCP Gateway / Tool Server   │  │ │
│ │  │  - Expedition SOPs/Manuals  │ │  - Read-only State Inspectors │  │ │
│ │  └──────────────┬──────────────┘ └──────────────┬───────────────┘  │ │
│ └─────────────────┼───────────────────────────────┼──────────────────┘ │
└───────────────────┼───────────────────────────────┼────────────────────┘
                    │                               │
                    ▼                               ▼
       ┌────────────────────────┐      ┌────────────────────────┐
       │   Groq API (Cloud)     │      │   Commander Approval   │
       │ (llama-3.3-70b-versatile) │   │     (HITL Gate)        │
       └────────────────────────┘      └───────────┬────────────┘
                                                   │ Approved Action
                                                   ▼
                                       ┌────────────────────────┐
                                       │ Authoritative Database │
                                       └────────────────────────┘
```

#### 3. Multi-Device Peer-to-Peer & BLE Sync Topology
```text
┌─────────────────────────┐                 ┌─────────────────────────┐
│     Field Device A      │                 │     Field Device B      │
│  (React PWA / Mobile)   │                 │  (Tablet / Commander)   │
└────────────┬────────────┘                 └────────────▲────────────┘
             │                                           │
             │ BLE Sync Packet / Store-and-Forward Payload│
             ▼                                           │
┌────────────────────────────────────────────────────────┴────────────┐
│                      BLE Gateway / Relay Node                       │
│     (Web Bluetooth API / Node-Python Device Companion Bridge)       │
└────────────────────────────┬────────────────────────────────────────┘
                             │ Local Sync Protocol / HTTP Replay
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 Central Base Station FastAPI Backend                │
│             (Merged Operational State & Audit Engine)               │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Principles

1. **State Ownership Principle:** Authoritative state lives strictly in the SQLite relational database. Conversation histories, LLM context windows, and vector indexes are non-authoritative caches or reasoning inputs.
2. **AI Independence Principle:** The deterministic core (state updates, graph traversal, constraint validation) must execute cleanly without network connectivity, Groq API, LangGraph, RAG, or MCP.
3. **Advisory AI Boundary:** AI outputs are proposals (`Recommendation` objects). They cannot mutate database entities directly. State changes require explicit human commander authorization (`ApprovedAction`).
4. **Tool Permission Boundary:** MCP tools are read-only by default. Any state-mutating tool invocation generates a pending approval request rather than executing directly.
5. **Grounding & Citation Rule:** RAG searches must query real indexed documents in ChromaDB and return traceable source metadata (document, title, section). Fabricated citations are forbidden.
6. **Structured Output Enforcement:** All LLM responses must be parsed and validated against strict Pydantic schemas before being processed by the application or displayed in the UI.
7. **Explicit Fallbacks:** When online services (Groq, RAG) are unreachable, the system must explicitly surface a degraded/fallback status in the UI while continuing core operations.

---

## 3. Technology Stack

| Layer | Selected Technology | Role | Reason for Choice | Architectural Trade-off |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | SPA User Interface | Fast HMR, lightweight bundle size, universal browser support on desktop/mobile. | Requires client-side state handling for offline caching. |
| **Styling/UI** | Tailwind CSS + Lucide React | UI Styling & Icons | Rapid UI creation with responsive grid layouts and operational status badges. | Custom CSS utilities needed for complex graph diagrams. |
| **Backend Framework**| FastAPI (Python 3.11) | REST & WebSocket API | High performance, native async support, automatic OpenAPI schemas, seamless Pydantic integration. | Python async requires care to prevent blocking event loop during graph algorithms. |
| **Database / ORM** | SQLite + SQLModel | Local Relational Persistence | Zero-configuration, file-based, embeddable, full ACID compliance, native Python object mapping. | Single-writer limit; handled via WAL mode for SIH concurrency needs. |
| **Dependency Solver**| NetworkX (Python) | Graph Traversal & Impact Solver | In-memory graph algorithms, cycle detection, topological sorting, transitive dependency propagation. | Entire graph loaded into memory; negligible overhead for expedition datasets (<10,000 nodes). |
| **Agent Framework** | LangGraph (Python) | State-machine Agent Orchestration | Deterministic cyclic state-machine flows, explicit node gates, structured state transitions. | Learning curve over raw LangChain, but provides strict agent execution control. |
| **LLM Provider** | Groq API (`llama-3.3-70b`) | Online Reasoning & Rescheduling | Industry-leading inference speed (~300 tokens/sec), low latency for real-time decision-support. | Requires internet connectivity; core system must handle API offline state gracefully. |
| **RAG / Vector Store**| ChromaDB (Local Persistent) | SOP Vector Search & Context Retrieval | Lightweight, embedded vector store running in Python process without external Docker daemon. | SQLite-backed vector storage is ideal for SIH demo, less scalable for multi-terabyte datasets. |
| **Embeddings** | SentenceTransformers (`all-MiniLM-L6-v2`) | Text Embeddings for SOP Chunks | Runs CPU-locally inside backend process; no external API calls required for embedding generation. | ~80MB model download on initial setup; fast execution once cached. |
| **Tool Gateway** | FastMCP (Python) | Model Context Protocol Tools | Lightweight implementation of MCP protocol over stdio/HTTP. | Keeps tool schema explicitly separated from LLM prompts. |
| **BLE Transport** | Web Bluetooth API + Companion Bridge | Device-to-Device Peer Sync | Browser-native BLE access combined with a lightweight Node/Python companion script for background relay. | Browsers restrict background BLE scanning; companion bridge solves relay requirement. |

---

## 4. System Components

The system is decomposed into 17 modular components:

1. **Frontend UI Application (`frontend/`):** React SPA providing situational dashboards, mission controls, cargo views, impact graphs, and approval modals. *Must not depend on backend availability to render cached state.*
2. **FastAPI API Layer (`backend/api/`):** Exposes REST endpoints and WebSockets for real-time UI updates. *Must not contain domain business logic.*
3. **Operational State Engine (`backend/core/state.py`):** Handles CRUD and domain validation for missions, cargo, assets, personnel, and conditions. *Must not depend on AI or network.*
4. **Deterministic Graph Solver (`backend/core/graph.py`):** Builds in-memory NetworkX dependency graphs and computes direct and transitive impact sets. *Must produce 100% reproducible results.*
5. **Constraint & Resource Evaluator (`backend/core/constraints.py`):** Verifies capacity, temporal windows, and resource supply/demand balances. *Must operate deterministically.*
6. **Local Operational Store (`backend/persistence/`):** Manages SQLite tables via SQLModel. *Sole source of truth for application state.*
7. **Sync Queue & Store-and-Forward Engine (`backend/sync/queue.py`):** Tracks uncommitted local state operations and formats sync packets. *Guarantees message idempotency via unique GUIDs.*
8. **BLE & Connectivity Adapter (`backend/sync/ble_adapter.py`):** Interfaces with Web Bluetooth and local bridge script to send/receive binary sync packets. *Abstracts transport protocol from sync engine.*
9. **RAG Ingestion & Query Pipeline (`backend/rag/`):** Parses Markdown/PDF SOPs, generates embeddings via `all-MiniLM-L6-v2`, and queries ChromaDB. *Must return source citations.*
10. **Vector Store (`ChromaDB local`):** Persists embedded document chunks. *Must operate locally on base station server.*
11. **Mission Rescheduling Agent (`backend/ai/rescheduling_agent.py`):** LangGraph agent that computes alternative schedule windows for impacted missions. *Produces non-binding proposals.*
12. **Emergency Resource Agent (`backend/ai/emergency_agent.py`):** LangGraph agent that matches emergency requirements to nearby available assets/personnel. *Produces non-binding proposals.*
13. **AI Orchestrator (`backend/ai/orchestrator.py`):** Routes requests to LangGraph workflows or offline fallback rule engines based on connectivity.
14. **MCP Tool Gateway (`backend/mcp/gateway.py`):** FastMCP server exposing read-only state inspectors and proposal generators to AI agents.
15. **Human Approval Gate (`backend/core/approval.py`):** Validates, records, and applies Commander decisions (`Approve`, `Modify`, `Reject`). *Sole entry point for applying AI recommendations to state.*
16. **Demo Seed Data Manager (`backend/persistence/seed.py`):** Populates synthetic expedition datasets for repeatable demonstration scenarios.
17. **Local Device Bridge (`scripts/device_bridge.py`):** Lightweight Python script providing background BLE GATT server/client capabilities for multi-device relay.

---

## 5. Backend Internal Architecture

The backend follows a **Clean Architecture / Layered Monolith** pattern:

```text
backend/
├── main.py                     # FastAPI application entrypoint & startup lifecycle
├── api/                        # Interface Layer (HTTP / WebSockets)
│   ├── routes_missions.py
│   ├── routes_cargo.py
│   ├── routes_disruptions.py
│   ├── routes_approvals.py
│   ├── routes_sync.py
│   └── routes_rag.py
├── core/                       # Deterministic Domain Layer (Pure Python, No AI Dependencies)
│   ├── models.py               # Domain entities & SQLModel definitions
│   ├── state_engine.py         # Authoritative state transitions & validation
│   ├── graph_solver.py         # NetworkX dependency traversal & impact solver
│   ├── constraint_engine.py   # Capacity, fuel, power, and temporal solvers
│   └── approval_engine.py      # HITL validation and approved transaction applier
├── ai/                         # Online AI Enhancement Layer (LangGraph & Groq)
│   ├── orchestrator.py         # AI service router & connectivity inspector
│   ├── rescheduling_agent.py   # LangGraph mission rescheduling workflow
│   ├── emergency_agent.py      # LangGraph emergency resource allocation workflow
│   └── prompts.py              # System prompts and structured JSON templates
├── rag/                        # Knowledge Retrieval Subsystem
│   ├── ingestion.py            # Document chunker and vector embedding generator
│   └── retriever.py            # ChromaDB query engine with citation metadata
├── mcp/                        # Model Context Protocol Gateway
│   ├── server.py               # FastMCP tool server instantiation
│   └── tools.py                # Read-only state inspection & tool wrappers
├── sync/                       # Offline Peer-to-Peer & Synchronization Engine
│   ├── queue.py                # Change-record operation queue
│   ├── merger.py               # Deterministic CRDT/LWW state reconciliation engine
│   └── ble_adapter.py          # Device transport interface
└── persistence/                # Database & Storage Layer
    ├── database.py             # SQLite connection pooling & WAL initialization
    └── seed.py                 # Synthetic polar expedition dataset populator
```

### Layer Boundary Rules
- `api/` calls `core/`, `ai/`, `rag/`, or `sync/`. It contains ZERO business logic.
- `core/` has ZERO imports from `ai/`, `rag/`, `mcp/`, or `langgraph`.
- `ai/` reads state via `core/` or `mcp/` tools and returns Pydantic proposals.
- `persistence/` handles database session lifecycles.

---

## 6. Unified Operational State

The authoritative operational state is stored in SQLite and modeled via SQLModel (Pydantic + SQLAlchemy).

### Core Entities & Relationships

```text
  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │   Station    │1     N │   Personnel  │1     N │    Asset     │
  │  (Outpost)   ├─────────►  (People)    ├─────────►  (Vehicle/   │
  └──────┬───────┘         └──────────────┘         │  Generator)  │
         │1                                         └──────┬───────┘
         │N                                                │1
  ┌──────▼───────┐         ┌──────────────┐                │N
  │   Mission    │1     N │ Cargo Item   │                │
  │ (Operation)  ├─────────► (Fuel/Rations├────────────────┘
  └──────┬───────┘         └──────────────┘
         │1
         │N
  ┌──────▼───────┐
  │ Dependency   │ (Prerequisite links: Mission->Mission, Mission->Cargo, Mission->Asset)
  └──────────────┘
```

### Revision & Versioning Scheme
Every entity includes:
- `id`: UUIDv4 string
- `revision`: Incrementing integer (monotonically increasing)
- `updated_at`: UTC ISO-8601 timestamp
- `updated_by_device`: String identifier of device initiating mutation

Mutations increment `revision` and update `updated_at`. When synchronizing, the higher revision or later UTC timestamp wins for conflicting fields (Last-Write-Wins with deterministic tie-breaking).

---

## 7. Deterministic Core

The deterministic core (`backend/core/`) is 100% independent of AI and external networks.

### Core Calculations & Algorithms
1. **Dependency Graph Traversal:** Converts database entities and dependency constraints into a directed acyclic graph (DAG) using NetworkX.
2. **Impact Analysis Algorithm:**
   - Input: Disruption Event (e.g., `Cargo-Fuel-01` delayed by 24h).
   - Step 1: Mark target entity as `IMPACTED`.
   - Step 2: Traverse outbound dependency edges in the DAG to locate dependent missions/assets.
   - Step 3: Check temporal overlaps (Does delayed arrival exceed mission `planned_start_time`?).
   - Step 4: Aggregate all direct and transitive affected entities into a structured `ImpactSet`.
3. **Resource Deficit Engine:** Calculates total required fuel/power/rations for active missions against station inventory. If `demand > available_capacity`, flags a `ResourceDeficit` alert.
4. **Emergency Baseline Solver:** Filters nearby operational assets with `status == OPERATIONAL` and `fuel_range >= distance_to_emergency` to propose immediate, rule-based emergency dispatch options offline.

---

## 8. Dependency Graph and Impact Analysis

### Canonical Example Graph
- **Nodes:**
  - `Cargo: Cargo-Fuel-01` (Status: Delayed 24h)
  - `Mission: Mission-Alpha` (Requires `Cargo-Fuel-01` & `Asset: Snowcat-A`)
  - `Mission: Mission-Beta` (Prerequisite: `Mission-Alpha` completion)
  - `Asset: Snowcat-A` (Assigned to `Mission-Alpha`)

### Execution Trace:
```text
[Disruption Event Received]
  Cargo-Fuel-01 -> Status: DELAYED (New ETA: T+24h)

[Graph Traversal Step 1: Direct Impact]
  Edge: Cargo-Fuel-01 ---> Mission-Alpha (Type: REQUIRED_CARGO)
  Check: Mission-Alpha Start Time (T+12h) < Cargo-Fuel-01 ETA (T+24h)
  Result: Mission-Alpha -> DIRECTLY_IMPACTED (Broken Prerequisite: Fuel deficit)

[Graph Traversal Step 2: Transitive Impact]
  Edge: Mission-Alpha ---> Mission-Beta (Type: PREREQUISITE_MISSION)
  Result: Mission-Beta -> TRANSITIVELY_IMPACTED (Prerequisite Mission-Alpha delayed)

[Graph Traversal Step 3: Asset Impact]
  Edge: Mission-Alpha ---> Snowcat-A (Type: ASSIGNED_ASSET)
  Result: Snowcat-A schedule locked in delayed window.

[Output ImpactSet Payload]
  - Direct Impacts: [Mission-Alpha]
  - Transitive Impacts: [Mission-Beta]
  - Affected Assets: [Snowcat-A]
  - Severity: CRITICAL
  - Reason: "Cargo-Fuel-01 ETA exceeds Mission-Alpha start time by 12 hours."
```

---

## 9. Offline-First Architecture

### Feature Availability Matrix

| System Capability | Offline Mode (Local Base / Field Device) | Online Mode (Cloud / Satellite Active) |
| :--- | :--- | :--- |
| **Inspect Operational State** | Full Access (Local SQLite) | Full Access (Synced State) |
| **Create/Modify Missions & Cargo**| Full Access (Queued for Sync) | Full Access (Immediate Sync) |
| **Dependency & Impact Traversal** | Full Access (Deterministic NetworkX) | Full Access (Deterministic NetworkX) |
| **Emergency Resource Triage** | Full Access (Rule-Based Solver) | Enriched with AI SOP Guidelines |
| **Mission Rescheduling** | Baseline Rule Engine (Shift Windows) | LangGraph + Groq Agent Suggestions |
| **SOP Document Querying** | Local Text Search (Cached Docs) | ChromaDB Vector RAG Search & Citations |
| **Multi-Device Sync** | Local BLE / Peer Store-and-Forward | Real-Time REST / WebSocket Refresh |

The UI displays a prominent status pill: **OFFLINE MODE (BASELINE CORE ACTIVE)** or **ONLINE (AI ENHANCED)**.

---

## 10. Multi-Device Synchronization

### Operational Log Sync Engine
Multi-device sync relies on a deterministic **Operation Log Replication** pattern:

1. When a user creates/updates an entity on Device A while offline, a JSON `ChangeRecord` is generated:
```json
{
  "op_id": "op_987654321_device_A",
  "device_id": "device_A",
  "timestamp_utc": "2026-09-21T01:45:00Z",
  "entity_type": "cargo",
  "entity_id": "cargo_fuel_01",
  "action": "UPDATE",
  "payload": {"status": "DELAYED", "delay_hours": 24},
  "revision": 3
}
```
2. The record is appended to Device A's local SQLite `sync_queue` table with `synced = False`.
3. When Device A connects to Device B (via BLE or Local Network), Device A transmits un-synced `ChangeRecord` items.
4. Device B processes incoming records through `SyncMerger`:
   - Checks `op_id` in local `processed_ops` table. If present, ignores (Deduplication / Idempotency).
   - If `op_id` is new, compares entity `revision` and `timestamp_utc` against local database state.
   - Applies state update if incoming `revision > local_revision`.
   - Marks `op_id` as processed and forwards payload to central backend when network returns.

---

## 11. BLE / Mesh / Store-and-Forward Architecture

### Browser BLE Limitation & Companion Bridge Solution
Standard web browsers running React SPAs restrict raw background Bluetooth mesh networking. Aurora solves this via a **Dual-Layer BLE Architecture**:

1. **Browser Layer (Web Bluetooth API):** Used in the React UI for explicit point-to-point scanning and connecting to nearby polar field beacons or companion bridges.
2. **Device Companion Bridge (`scripts/device_bridge.py`):** A lightweight background Python daemon (using `bleak`) running on field laptops/Raspberry Pi relay nodes. It advertises an **Aurora GATT Sync Service** (`UUID: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E`).

### BLE Packet Protocol Specification
Sync payloads are chunked into 512-byte GATT Characteristic packets:

```text
┌─────────────────┬──────────────────┬─────────────────┬─────────────────────────────┐
│ Header (4 bytes)│ Op ID (16 bytes) │ Chunk Index/Total│ Compressed JSON Payload     │
│ [AUR1]          │ [op_guid_prefix] │ [01/04]         │ [Gzip binary chunk data...] │
└─────────────────┴──────────────────┴─────────────────┴─────────────────────────────┘
```

- **Hop Count / TTL:** Packets include `ttl = 3`. Decremented at each relay hop to prevent infinite mesh flooding.
- **Store-and-Forward:** If a relay node receives a packet but cannot reach the base station, it stores the packet in local disk queue until base station GATT service is detected.

---

## 12. Synchronization and Backend Consistency

Central backend reconciliation follows deterministic rules:

1. **Transaction Ordering:** Sync operations are sorted chronologically by `timestamp_utc`.
2. **Conflict Resolution Strategy (Last-Write-Wins with Deterministic Tie-Breaker):**
   - Higher `revision` number always wins.
   - If revisions are equal, later `timestamp_utc` wins.
   - If timestamps are identical, lexicographically smaller `device_id` string wins.
3. **Rejection & Validation:** Incoming changes that violate domain constraints (e.g., negative cargo quantity) are rejected and logged in `sync_failures` with error details for Commander inspection.
4. **No AI Conflict Resolution:** LLMs are NEVER used to resolve database merge conflicts.

---

## 13. RAG Architecture

### Pipeline Components

```text
┌────────────────────────┐
│  Markdown Expedition   │
│  SOPs & Safety Manuals │
└───────────┬────────────┘
            │ 1. Document Ingestion & Chunking (500 chars, 50 overlap)
            ▼
┌────────────────────────┐
│ SentenceTransformers   │
│ (all-MiniLM-L6-v2)     │
└───────────┬────────────┘
            │ 2. Embeddings (384-dimensional vectors)
            ▼
┌────────────────────────┐
│ ChromaDB Vector Store  │
│ (Local Directory)      │
└───────────┬────────────┘
            │ 3. Similarity Query (Top-K = 3)
            ▼
┌────────────────────────┐
│ Context Construction   │ --> Appends [Document Title, Section, Text]
└───────────┬────────────┘     to LLM Prompt Context
            │
            ▼
┌────────────────────────┐
│  Groq LLM Response     │ --> Returns answer with explicit metadata citations
└────────────────────────┘
```

### Citation Enforcer Schema
Every RAG response must include structured citation references:
```json
{
  "recommendation": "Shift mission by 24h and maintain secondary fuel reserve.",
  "citations": [
    {
      "document": "Polar_Safety_SOP_v2.md",
      "section": "Section 4.2 - Low Temperature Fuel Protocols",
      "relevance_score": 0.89
    }
  ]
}
```

---

## 14. LangGraph Agent Architecture

LangGraph orchestrates online decision-support agents using explicit state machines.

### 1. Mission Rescheduling Agent State Graph

```text
[START]
   │
   ▼
(Inspect Disruption & State) ──► Reads ImpactSet & Available Resource Windows
   │
   ▼
(Query RAG SOP Context)     ──► Fetches relevant delay protocols from ChromaDB
   │
   ▼
(Generate Schedule Options) ──► Groq API produces structured rescheduling candidate
   │
   ▼
(Validate Proposal Schema)  ──► Pydantic checks format & constraint bounds
   │
   ▼
[END / Return Proposal to Pending Approval Queue]
```

### 2. Emergency Resource Agent State Graph
- **Nodes:** `ReceiveEmergencyAlert` → `IdentifyGeographicProximity` → `CheckAssetStatus` → `QueryEmergencySOP` → `FormatEmergencyProposal`.
- **Constraint:** Agent outputs are strictly packaged into `Recommendation` objects with `status = PENDING_HUMAN_APPROVAL`.

---

## 15. MCP Architecture

FastMCP acts as a security and tool gateway between LangGraph agents and system functions.

### Tool Catalog & Permissions

```text
                           ┌────────────────────────┐
                           │ LangGraph AI Agent     │
                           └───────────┬────────────┘
                                       │ Tool Invocation
                                       ▼
                           ┌────────────────────────┐
                           │ FastMCP Tool Server    │
                           └───────────┬────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
┌───────────────────────────────┐     ┌─────────────────────────────────────────┐
│ READ-ONLY TOOLS (Auto-Exec)   │     │ STATE-MUTATING TOOLS (Requires Approval)│
├───────────────────────────────┤     ├─────────────────────────────────────────┤
│ - get_operational_state()     │     │ - propose_mission_reschedule()          │
│ - analyze_disruption_impact() │     │ - propose_resource_allocation()         │
│ - check_cargo_dependencies()  │     │ (Generates Pending Proposal Object;     │
│ - search_expedition_sops()    │     │  DOES NOT mutate database)              │
└───────────────────────────────┘     └─────────────────────────────────────────┘
```

Agents cannot call raw SQL, execute terminal commands, or bypass the application core.

---

## 16. Human-in-the-Loop Architecture

### Approval State Machine Pipeline

```text
┌────────────────────────┐
│  Disruption Event      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Deterministic Impact   │
│ Engine (NetworkX)      │
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ AI Rescheduling Agent  │
│ (LangGraph / Groq)     │
└───────────┬────────────┘
            │ Generates
            ▼
┌────────────────────────────────────────────────────────┐
│ Recommendation Object (Status: PENDING_APPROVAL)      │
│ - Proposed New Start Time: 2026-09-22T08:00:00Z       │
│ - Reallocated Fuel: 200L from Depot B                  │
│ - RAG SOP Citation: Section 4.2 Fuel Protocol          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│           Human Commander Approval UI Modal            │
│           [ APPROVE ]  [ MODIFY ]  [ REJECT ]          │
└───────────────────────────┬────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │ Action:       │ Action:       │ Action:
            │ APPROVE       │ MODIFY        │ REJECT
            ▼               ▼               ▼
┌───────────────────────┐ ┌───────────────┐ ┌───────────────────────┐
│ Apply State Mutation  │ │ Edit Params & │ │ Mark Recommendation   │
│ In SQLite Database    │ │ Apply State   │ │ REJECTED & Archived   │
└───────────────────────┘ └───────────────┘ └───────────────────────┘
```

Every approval action logs a immutable audit record: `ApprovalAudit(id, recommendation_id, commander_id, action, timestamp)`.

---

## 17. Resource Forecasting / Allocation

1. **Deterministic Supply-Demand Calculation:**
   - Sums total inventory across active stations (`Supply`).
   - Sums required resources across all scheduled missions over a 7-day rolling window (`Demand`).
   - Surfaces `ResourceDeficit` if `Supply - ReserveThreshold < Demand`.
2. **AI Allocation Trade-off Enhancement:**
   - When a deficit occurs, the AI analyzes lower-priority missions (e.g., Routine Science vs. Survival Supply Run) and suggests pausing lower-priority missions to free up resources.

---

## 18. Emergency Mode

1. **Trigger:** Commander clicks "Emergency Alert" or system ingests critical asset failure.
2. **Offline Baseline Triage:**
   - Scans SQLite for assets with `status = OPERATIONAL` within immediate distance radius.
   - Filters personnel with specialty `Medical` or `Search & Rescue`.
   - Displays baseline dispatch list within <50ms.
3. **Online AI Enrichment:**
   - If connected, Emergency Agent pulls medical/rescue SOPs and attaches step-by-step triage procedures to the dispatch plan.

---

## 19. API Architecture

FastAPI exposes RESTful routes under `/api/v1`:

### Endpoint Group Summary
- **Missions:**
  - `GET /api/v1/missions` — List all missions and dependency statuses
  - `POST /api/v1/missions` — Create new mission entity
  - `PUT /api/v1/missions/{id}` — Update mission parameters
- **Cargo & Inventory:**
  - `GET /api/v1/cargo` — List cargo items, arrival ETAs, and delay flags
  - `POST /api/v1/disruptions` — Record disruption event (e.g., cargo delay)
- **Impact Analysis:**
  - `POST /api/v1/analysis/impact` — Run deterministic graph traversal for hypothetical event
- **AI & Recommendations:**
  - `POST /api/v1/recommendations/reschedule` — Trigger Mission Rescheduling Agent
  - `POST /api/v1/recommendations/emergency` — Trigger Emergency Resource Agent
- **Human Approval Gate:**
  - `GET /api/v1/approvals/pending` — List pending AI recommendations
  - `POST /api/v1/approvals/{id}/action` — Submit Commander Decision (`Approve`/`Modify`/`Reject`)
- **Peer Synchronization:**
  - `POST /api/v1/sync/push` — Ingest `ChangeRecord` batch from peer device
  - `GET /api/v1/sync/pull` — Retrieve un-synced local changes for relay

---

## 20. Frontend Architecture

The React 18 application is structured into clear view modules:

```text
frontend/src/
├── components/
│   ├── Common/
│   │   ├── StatusBadge.jsx         # Online/Offline & Severity Indicators
│   │   ├── ConnectionPill.jsx      # BLE / Network Connectivity Indicator
│   │   └── ApprovalModal.jsx       # Commander HITL Review & Approval Dialog
│   ├── Dashboard/
│   │   ├── OperationalOverview.jsx  # Primary Situation Awareness Board
│   │   ├── DependencyGraph.jsx     # Visual Mission-Cargo Dependency Graph
│   │   └── ActiveAlerts.jsx        # Impact Set & Resource Deficit Notices
│   ├── Missions/
│   │   ├── MissionList.jsx         # Filterable Mission Data Table
│   │   └── MissionForm.jsx         # Mission Creator with Cargo Dependency Selector
│   ├── Cargo/
│   │   ├── CargoTracker.jsx        # Cargo Stage & Delay Simulation Panel
│   │   └── DisruptionSimulator.jsx# Disruption Injection Form
│   └── Recommendations/
│       ├── ProposalCard.jsx        # AI Proposal Display with RAG Citations
│       └── DecisionHistory.jsx     # Audit Trail of Approved/Rejected Actions
├── context/
│   ├── OperationalStateContext.jsx # Local State Cache & Offline Persistence Provider
│   └── SyncContext.jsx            # BLE & Network Queue Sync State
└── services/
    ├── api.js                      # Axios HTTP Client with Offline Queue Fallback
    └── bleService.js               # Web Bluetooth API Interface
```

---

## 21. Mobile / Responsive Architecture

- **Viewport Fluidity:** Responsive layout using Tailwind CSS flex/grid system, scaling seamlessly from mobile screens (375px) to tablet (768px) and dual-monitor command desks (1920px).
- **Progressive Web App (PWA):** Service worker caches static assets and frontend bundles locally. Application opens and renders cached operational state even in airplane mode.
- **Mobile Touch Targets:** Action buttons (e.g., `Approve`, `Simulate Disruption`) use minimum 48px touch padding for field operations wearing thermal gloves.

---

## 22. Security Boundaries

1. **Credential Hygiene:** `GROQ_API_KEY` and backend secrets are stored exclusively in root `.env` files and loaded via Pydantic `BaseSettings`. ZERO secrets exposed to React frontend.
2. **Schema Input Validation:** All API inputs and AI outputs are validated using strict Pydantic schemas. Invalid types or unexpected payload parameters trigger immediate `422 Unprocessable Entity` errors.
3. **Approval Authorization:** State-modifying operations require a valid `commander_token` header. Simulated role-based access control (RBAC) distinguishes `Field Operator` (Read / Record Disruption) from `Commander` (Approve State Mutation).

---

## 23. Failure and Degraded Modes

| Failure Scenario | System Behavior & Fallback | UI Representation |
| :--- | :--- | :--- |
| **Internet Lost** | Groq API & online RAG disabled. Core NetworkX impact analysis continues working 100% locally. | Banner: `OFFLINE MODE (BASELINE CORE ACTIVE)` |
| **Groq API Timeout / Error** | LangGraph agent catches exception and invokes deterministic rule fallback (shifts mission start date by disruption duration). | Notice: `AI Assistant Unavailable. Baseline Reschedule Fallback Provided.` |
| **ChromaDB Vector Error** | Agent proceeds with rescheduling using operational state only, omitting RAG manual citations. | Notice: `SOP Manual Search Offline. Recommendation Based on Core State.` |
| **BLE Connection Drop** | Sync Engine queues un-transmitted `ChangeRecord` items in SQLite; retries automatically upon reconnection. | Sync Pill: `Sync Queue: 3 Pending Items (Reconnecting...)` |
| **Invalid State Transition** | State Engine rejects mutation and rolls back SQLite transaction. | Toast: `Invalid Mutation: Dependency Prerequisite Violation.` |

---

## 24. Data Persistence Architecture

### SQLite Relational Database Layout
- SQLite database file located at `backend/aurora_operational.db`.
- WAL (Write-Ahead Logging) enabled on connection initialization for concurrent read/write support.

### Table Schema Summary
- `stations`: Base station profiles and capacity caps.
- `missions`: Mission schedules, priorities, statuses, and assigned stations.
- `cargo`: Cargo items, categories, current locations, and delay statuses.
- `assets`: Vehicles, generators, and equipment operational statuses.
- `personnel`: Crew profiles, specialties, and assignments.
- `dependencies`: Directed dependency links (`source_id`, `target_id`, `dependency_type`).
- `disruptions`: Logged operational incidents and delay parameters.
- `recommendations`: Generated AI proposals, status (`PENDING`, `APPROVED`, `REJECTED`), and citations.
- `approval_audits`: Immutable record of Commander approval decisions.
- `sync_queue`: Un-synced local change operations queued for peer relay.
- `processed_ops`: Deduplication registry of ingested peer operation GUIDs.

---

## 25. Demo Dataset Architecture

The system includes a pre-packaged synthetic seed module (`backend/persistence/seed.py`) generating a realistic polar scenario:

- **3 Stations:** Outpost Alpha (Main Base), Station Beta (Research Outpost), Depot Gamma (Supply Hub).
- **5 Missions:** Operation Deep Freeze (Priority 1), Glacial Survey Beta (Priority 2), Generator Maintenance (Priority 1), Outpost Resupply (Priority 2), Seismic Array Deployment (Priority 3).
- **10 Cargo Items:** Medical Kit Alpha, Survival Rations Batch 1, Diesel Fuel Crate 01-04, Spare Turbine Parts, Comms Array B.
- **4 Assets:** Snowcat-01, Snowcat-02, Generator-Alpha, Generator-Beta.
- **8 Personnel:** Commander Sarah Vance, Dr. Alexei Romanov (Medical), Elena Rostova (Engineer), Marcus Vance (Scout), + 4 Expedition Specialists.
- **Preconfigured Canonical Disruption:** `Cargo-Fuel-01` delayed by 24 hours due to coastal blizzard.

---

## 26. Canonical End-to-End Demo Flow

The end-to-end demonstration follows this exact reproducible journey:

```text
[Step 1: Inspect Initial State]
  Commander views Dashboard. All 5 missions scheduled cleanly.
  Mission "Operation Deep Freeze" depends on "Cargo-Fuel-01" and "Snowcat-01".

[Step 2: Inject Disruption]
  Commander opens Cargo Tracker -> Clicks "Simulate Disruption" on "Cargo-Fuel-01".
  Parameters: Status = DELAYED, Delay = 24 Hours. Click "Record Incident".

[Step 3: Deterministic Impact Evaluation]
  FastAPI receives event -> NetworkX solver computes graph traversal.
  Result: "Operation Deep Freeze" marked IMPACTED (Fuel ETA exceeds Start Time).
  Downstream "Glacial Survey Beta" marked TRANSITIVELY IMPACTED.
  UI immediately highlights impacted missions in RED with exact delay reasons.

[Step 4: AI Rescheduling & RAG Enrichment (Online)]
  Commander clicks "Request Reschedule Proposal".
  LangGraph Agent queries ChromaDB -> Retrieves SOP Section 4.2 (Fuel Contingencies).
  Groq API computes revised schedule: Shift "Operation Deep Freeze" by 30h & allocate 100L reserve fuel from Depot Gamma.

[Step 5: Commander Review & Approval]
  UI presents "Pending AI Proposal Card" alongside RAG SOP citation.
  Commander reviews proposal, verifies reserve fuel availability, and clicks "APPROVE".

[Step 6: Authoritative State Mutation & Verification]
  State Engine applies update to SQLite database -> Mission start times updated.
  Impact warning clears. Operational Overview UI updates displaying valid green schedule.
  Audit log records Commander approval event.
```

---

## 27. Testing Architecture

### Test Suite Structure (`tests/`)

1. **Deterministic Unit Tests (`tests/test_deterministic_core.py`):**
   - Tests NetworkX dependency traversal algorithms.
   - Verifies direct and transitive impact set output for cargo delays.
   - Asserts that graph traversal output is 100% reproducible over 100 iterations.
2. **Constraint Solver Tests (`tests/test_constraints.py`):**
   - Validates resource capacity deficit calculations and temporal window overlaps.
3. **Offline Sync & Reconciliation Tests (`tests/test_sync_engine.py`):**
   - Simulates two isolated SQLite databases generating conflicting operations.
   - Verifies Last-Write-Wins and operation deduplication rules.
4. **LangGraph & AI Output Validation Tests (`tests/test_agent_schemas.py`):**
   - Mocks Groq API responses and verifies Pydantic schema validation.
   - Tests graceful exception handling during API timeouts.
5. **Human Approval Gate Tests (`tests/test_approval_gate.py`):**
   - Verifies that AI recommendations cannot mutate database tables without explicit approval API call.

---

## 28. Project Directory Structure

```text
/
├── AGENTS.md                   # Stable coding agent guidelines
├── README.md                   # Setup, execution, and demonstration instructions
├── docs/                       # Project specifications and architecture
│   ├── spec.md                 # System requirements and acceptance criteria
│   └── architecture.md         # Technical architecture specification (this file)
├── frontend/                   # React 18 + Vite Web Application
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── components/
│       ├── context/
│       └── services/
├── backend/                    # Python FastAPI Modular Monolith Service
│   ├── main.py
│   ├── requirements.txt
│   ├── api/                    # REST endpoints & WebSockets
│   ├── core/                   # Deterministic state engine & graph solver
│   ├── ai/                     # LangGraph agents & Groq orchestration
│   ├── rag/                    # ChromaDB vector store & SOP retriever
│   ├── mcp/                    # FastMCP tool server
│   ├── sync/                   # Sync queue & peer merger
│   └── persistence/            # SQLite database & seed dataset
├── data/                       # Expedition SOP Markdown files for RAG ingestion
│   └── sops/
│       ├── Polar_Safety_SOP_v2.md
│       └── Fuel_and_Power_Contingency.md
├── scripts/                    # Helper scripts & device bridge
│   ├── dev_run.sh              # Single-command local dev startup
│   └── device_bridge.py        # Background BLE relay companion
└── tests/                      # Unit, integration, and offline workflow tests
    ├── test_deterministic_core.py
    ├── test_constraints.py
    ├── test_sync_engine.py
    └── test_approval_gate.py
```

---

## 29. Local Development / Run Architecture

### Developer Execution Workflow
Running the complete Aurora platform locally requires two lightweight processes:

1. **Backend Service (Terminal 1):**
   ```bash
   cd backend
   python -m venv venv && source venv/bin/activate
   pip install -r requirements.txt
   python -m persistence.seed    # Populates local SQLite database and ChromaDB SOP index
   uvicorn main:app --reload --port 8000
   ```
2. **Frontend UI Application (Terminal 2):**
   ```bash
   cd frontend
   npm install
   npm run dev                   # Starts Vite dev server on http://localhost:5173
   ```
3. **Optional Single Script Startup:** Running `./scripts/dev_run.sh` boots both services concurrently.

---

## 30. Deployment Architecture

### SIH Demonstration Topology

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Demonstration Base Station Laptop                 │
│                                                                        │
│  ┌───────────────────────────┐        ┌─────────────────────────────┐  │
│  │   Vite Frontend Server    │        │    FastAPI Backend Server   │  │
│  │   (http://localhost:5173) │        │    (http://localhost:8000)  │  │
│  └─────────────┬─────────────┘        └──────────────┬──────────────┘  │
│                │                                     │                 │
│                │                                     │                 │
│  ┌─────────────▼─────────────┐        ┌──────────────▼──────────────┐  │
│  │ Local SQLite Persistence  │        │  ChromaDB SOP Vector Store  │  │
│  └───────────────────────────┘        └─────────────────────────────┘  │
└──────────────────┬───────────────────────────────────┬─────────────────┘
                   │ Local Wi-Fi / Hotspot             │ Groq API (Cloud)
                   ▼                                   ▼
┌───────────────────────────────────────┐   ┌────────────────────────────┐
│ Peer Demonstration Devices            │   │  Groq Cloud Inference API  │
│ (Tablets / Mobile Phones via Hotspot) │   │  (Online Mode Only)        │
└───────────────────────────────────────┘   └────────────────────────────┘
```

If Internet is severed during the SIH presentation, the platform remains 100% operational in **Offline Baseline Mode** without throwing unhandled exceptions.

---

## 31. Production vs. SIH Boundary

- **IMPLEMENT NOW (SIH Demo Scope):**
  - Single-process FastAPI backend with embedded SQLite database.
  - Local NetworkX graph solver and rule-based constraint engine.
  - Local ChromaDB vector index loaded with real polar SOP Markdown files.
  - Single Groq LLM API provider integration with Pydantic output validation.
  - Local operational sync queue and Web Bluetooth / GATT bridge payload format.
  - React + Vite responsive UI with explicit Human-in-the-Loop approval modals.
- **FUTURE ROADMAP (Post-SIH Enterprise Expansion):**
  - Distributed multi-master database cluster (PostgreSQL + Bucardo).
  - Production Kubernetes orchestration and microservice separation.
  - Hardware satellite modem / iridium burst transceiver integrations.
  - Hardware RFID / active GPS beacon telemetry ingestion.

---

## 32. Architecture Trade-offs

1. **Modular Monolith vs. Microservices:**
   - *Decision:* Modular Monolith.
   - *Reason:* Eliminates inter-service network overhead and deployment complexity. Ideal for fast, highly reliable SIH hackathon development.
2. **SQLite vs. PostgreSQL:**
   - *Decision:* SQLite with Write-Ahead Logging (WAL).
   - *Reason:* Embeddable file database requires zero setup on evaluator laptops and supports offline local-first state persistence seamlessly.
3. **ChromaDB Local vs. Cloud Vector DB (Pinecone/Weaviate):**
   - *Decision:* ChromaDB Local Directory.
   - *Reason:* Operates in-process without requiring cloud API keys or external docker containers during offline demonstration.

---

## 33. Risks and Architectural Constraints

1. **Risk: Browser Background BLE Restrictions**
   - *Mitigation:* Architecture introduces a dual-layer strategy using `scripts/device_bridge.py` as a background companion daemon for store-and-forward relay when browsers restrict GATT scanning.
2. **Risk: LLM API Latency / Rate Limits during Demo**
   - *Mitigation:* Groq API provides ultra-fast inference (~300 tokens/sec). System enforces a 5-second timeout; if exceeded, automatically falls back to baseline deterministic rescheduling logic.
3. **Risk: Hallucination of Operational State or Citations**
   - *Mitigation:* Agents use read-only MCP tools to pull exact state JSON. Pydantic validation rejects unstructured text, and ChromaDB metadata enforcers verify document sources before rendering citations.

---

## 34. Architecture-to-Spec Traceability

| Spec Acceptance Criteria | Architecture Component / Module | Design Mechanism |
| :--- | :--- | :--- |
| **AC-01 (Unified State Model)** | `backend/core/models.py` | SQLModel entity definitions for Missions, Cargo, Assets, Personnel. |
| **AC-03 (Offline Cargo Disruption)** | `backend/core/graph_solver.py` | NetworkX graph traversal computes impact set offline without LLM. |
| **AC-05 (Reproducible Results)** | `backend/core/graph_solver.py` | Pure deterministic Python algorithms ensure identical output per state. |
| **AC-06 (Offline Core Execution)** | `backend/core/state_engine.py` | Full SQLite CRUD and constraint engine runs in local Python process. |
| **AC-08 (Real RAG Citations)** | `backend/rag/retriever.py` | ChromaDB vector query fetches actual repository SOP chunks with metadata. |
| **AC-10 (Human Approval Gate)** | `backend/core/approval_engine.py` | AI proposals stored as `PENDING_APPROVAL`; database mutation requires approval API call. |
| **AC-13 (Canonical Vertical Slice)** | End-to-End System Integration | Fully mapped 6-step flow in Section 26. |

---

## 35. Definition of Architectural Done

This architecture document (`docs/architecture.md`) is complete because:
- Every major technical component (Frontend, Backend, Database, AI, RAG, MCP, Sync, BLE) has a concrete, non-ambiguous technology choice.
- The deterministic operational core is strictly isolated from AI dependencies.
- Multi-device peer synchronization and BLE GATT transport protocols are explicitly defined.
- Human-in-the-Loop approval gates are enforced at both the API and database levels.
- Full directory structure, API routes, and developer startup workflows are fully detailed.
- No contradictions exist with `AGENTS.md` or `docs/spec.md`.

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
