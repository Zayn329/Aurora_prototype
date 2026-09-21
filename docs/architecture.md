# Aurora — Technical Architecture Specification

---

## 1. Architecture Overview

Aurora is designed as a **Modular Monolith with an Offline-First Local State Engine, Client-Side Browser Replicas, and an Online AI Enhancement Gateway**.

The primary architectural goal is absolute operational resilience: the command platform must remain authoritative, functional, and fully capable of constraint evaluation, dependency tracking, and emergency decision-making even when completely disconnected from the Internet, cloud servers, or AI LLM services.

### System Architecture Diagrams

#### 1. Core Operational & Offline Flow
```text
┌────────────────────────────────────────────────────────────────────────┐
│                   React + Vite Responsive Frontend                     │
│               (Laptop / Tablet / Mobile Web Application)                │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  IndexedDB Browser Replica (Dexie.js) + Local Mutation Queue       │ │
│ └──────────────────────────────────┬─────────────────────────────────┘ │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │ HTTP / REST / WebSockets / Offline Replay
┌───────────────────────────────────▼────────────────────────────────────┐
│                       FastAPI Backend Service                          │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │                  Deterministic Operational Engine                  │ │
│ │  - State Mutation Manager    - DAG Dependency Solver (NetworkX)    │ │
│ │  - Constraint Evaluator      - Baseline Emergency Triage Engine    │ │
│ └──────────────────────────────────┬─────────────────────────────────┘ │
│                                    │                                   │
│ ┌──────────────────────────────────▼─────────────────────────────────┐ │
│ │     Central Operational Persistence (SQLite + SQLModel)            │ │
│ │              (Global Authoritative State Store)                    │ │
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

#### 3. Multi-Device Peer-to-Peer & Sync Transport Topology
```text
┌────────────────────────────────────────────────────────────────────────┐
│                  Application Sync Protocol Engine                      │
│        (ChangeRecords, Device Sequence Numbers, Field Revisions)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    │                                                               │
    ▼                                                               ▼
┌───────────────────────────────────────┐       ┌───────────────────────────────────────┐
│ BLE Transport Adapter                 │       ┌ Local Wi-Fi / HTTP Transport Adapter  │
│ (GATT Service, 512B Chunks, TTL Relay)│       │ (REST Replay, WebSocket Sync Engine)  │
└──────────────────┬────────────────────┘       └──────────────────┬────────────────────┘
                   │                                               │
                   ▼                                               ▼
┌───────────────────────────────────────────────────────────────────────┐
│                  Base Station Central Backend                         │
│   (Deterministically Reconciles Operations -> Authoritative DB)       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Principles

1. **State Ownership Principle:** Global authoritative operational truth belongs strictly to the Central Backend SQLite relational database. Field devices maintain read-only or staged local replicas in IndexedDB or local SQLite stores. Conversation histories, LLM context windows, and vector indexes are non-authoritative caches or reasoning inputs.
2. **AI Independence Principle:** The deterministic core (state updates, DAG graph traversal, constraint validation) must execute cleanly without network connectivity, Groq API, LangGraph, RAG, or MCP.
3. **Advisory AI Boundary:** AI outputs are proposals (`Recommendation` objects). They cannot mutate database entities directly. State changes require explicit human commander authorization (`ApprovedAction`).
4. **Tool Permission Boundary:** MCP tools are read-only by default. Any state-mutating tool invocation generates a pending approval request rather than executing directly.
5. **Grounding & Citation Rule:** RAG searches must query real indexed documents in ChromaDB and return traceable source metadata (document, title, section). Fabricated citations are forbidden.
6. **Structured Output Enforcement:** All LLM responses must be parsed and validated against strict Pydantic schemas before being processed by the application or displayed in the UI.
7. **Explicit Fallbacks:** When online services (Groq, RAG) are unreachable, the system must explicitly surface a degraded/fallback status in the UI while keeping the deterministic core fully operational.

---

## 3. Technology Stack

| Layer | Selected Technology | Role | Reason for Choice | Architectural Trade-off |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | SPA User Interface | Fast HMR, lightweight bundle size, universal browser support on desktop/mobile. | Requires client-side state handling for offline caching. |
| **Client Storage** | IndexedDB (Dexie.js) | Client Browser Replica & Queue | Persists local operational state replica and offline mutation queue directly in browser storage. | Requires periodic sync reconciliation with the backend. |
| **Styling/UI** | Tailwind CSS + Lucide React | UI Styling & Icons | Rapid UI creation with responsive grid layouts and operational status badges. | Custom CSS utilities needed for complex graph diagrams. |
| **Backend Framework**| FastAPI (Python 3.11) | REST & WebSocket API | High performance, native async support, automatic OpenAPI schemas, seamless Pydantic integration. | Python async requires care to prevent blocking event loop during graph algorithms. |
| **Authoritative DB** | SQLite + SQLModel | Central Authoritative Store | Zero-configuration, file-based, embeddable, full ACID compliance, native Python object mapping. | Single-writer limit; handled via WAL mode for SIH concurrency needs. |
| **Dependency Solver**| NetworkX (Python) | DAG Traversal & Cycle Detector | In-memory graph algorithms, DAG cycle enforcement, topological sorting, transitive dependency propagation. | Entire graph loaded into memory; negligible overhead for expedition datasets (<10,000 nodes). |
| **Agent Framework** | LangGraph (Python) | State-machine Agent Orchestration | Deterministic cyclic state-machine flows, explicit node gates, structured state transitions. | Learning curve over raw LangChain, but provides strict agent execution control. |
| **LLM Provider** | Groq API (`llama-3.3-70b`) | Online Reasoning & Rescheduling | Industry-leading inference speed (~300 tokens/sec), low latency for real-time decision-support. | Requires internet connectivity; core system must handle API offline state gracefully. |
| **RAG / Vector Store**| ChromaDB (Local Persistent) | SOP Vector Search & Context Retrieval | Lightweight, embedded vector store running in Python process without external Docker daemon. | SQLite-backed vector storage is ideal for SIH demo, less scalable for multi-terabyte datasets. |
| **Embeddings** | SentenceTransformers (`all-MiniLM-L6-v2`) | Text Embeddings for SOP Chunks | Runs CPU-locally inside backend process; no external API calls required for embedding generation. | ~80MB model download on initial setup; fast execution once cached. |
| **Tool Gateway** | FastMCP (Python) | Model Context Protocol Tools | Lightweight implementation of MCP protocol over stdio/HTTP. | Keeps tool schema explicitly separated from LLM prompts. |
| **BLE Transport** | Web Bluetooth API + Companion Bridge | Physical GATT Link Layer | Browser-native BLE access combined with a lightweight Node/Python companion script for background relay. | Browsers restrict background BLE scanning; companion bridge solves relay requirement. |

---

## 4. System Components

The system is decomposed into 17 modular components:

1. **Frontend UI Application (`frontend/`):** React SPA providing situational dashboards, mission controls, cargo views, impact graphs, and approval modals. *Interacts directly with local IndexedDB when offline.*
2. **Client Browser Replica (`frontend/src/context/IndexedDBStore.js`):** Local browser database storing entity replicas and a `mutation_queue` for offline PWA operations.
3. **FastAPI API Layer (`backend/api/`):** Exposes REST endpoints and WebSockets for real-time UI updates. *Must not contain domain business logic.*
4. **Operational State Engine (`backend/core/state.py`):** Handles CRUD and domain validation for missions, cargo, assets, personnel, and conditions. *Must not depend on AI or network.*
5. **Deterministic DAG Solver (`backend/core/graph.py`):** Builds in-memory NetworkX directed acyclic graphs, enforces cycle prevention, and computes direct and transitive impact sets. *Must produce 100% reproducible results.*
6. **Constraint & Resource Evaluator (`backend/core/constraints.py`):** Verifies capacity, temporal windows, and resource supply/demand balances. *Must operate deterministically.*
7. **Global Authoritative Store (`backend/persistence/`):** Manages central SQLite tables via SQLModel. *Sole global source of truth for application state.*
8. **Application Sync Protocol Engine (`backend/sync/protocol.py`):** Transport-agnostic engine that sequences operations, handles deduplication, and performs field-level Last-Write-Wins (LWW) state merging.
9. **BLE Transport Adapter (`backend/sync/ble_adapter.py`):** Physical/link layer gateway that handles GATT characteristic connections, 512-byte payload chunking, TTL hop counts, and store-and-forward buffer management.
10. **RAG Ingestion & Query Pipeline (`backend/rag/`):** Parses Markdown/PDF SOPs, generates embeddings via `all-MiniLM-L6-v2`, and queries ChromaDB. *Must return source citations.*
11. **Vector Store (`ChromaDB local`):** Persists embedded document chunks. *Must operate locally on base station server.*
12. **Mission Rescheduling Agent (`backend/ai/rescheduling_agent.py`):** LangGraph agent that computes alternative schedule windows for impacted missions. *Produces non-binding proposals.*
13. **Emergency Resource Agent (`backend/ai/emergency_agent.py`):** LangGraph agent that matches emergency requirements to nearby available assets/personnel. *Produces non-binding proposals.*
14. **AI Orchestrator (`backend/ai/orchestrator.py`):** Routes requests to LangGraph workflows or offline fallback rule engines based on connectivity.
15. **MCP Tool Gateway (`backend/mcp/gateway.py`):** FastMCP server exposing read-only state inspectors and proposal generators to AI agents.
16. **Human Approval Gate (`backend/core/approval.py`):** Validates, records, and applies Commander decisions (`Approve`, `Modify`, `Reject`). *Sole entry point for applying AI recommendations to state.*
17. **Demo Seed Data Manager (`backend/persistence/seed.py`):** Populates synthetic expedition datasets for repeatable demonstration scenarios.

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
│   ├── graph_solver.py         # NetworkX DAG traversal, cycle detection & impact solver
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
│   ├── protocol.py             # Transport-agnostic application sync protocol & LWW merger
│   ├── ble_adapter.py          # Physical BLE GATT transport layer adapter
│   └── http_adapter.py         # REST/WebSocket transport layer adapter
└── persistence/                # Database & Storage Layer
    ├── database.py             # SQLite connection pooling & WAL initialization
    └── seed.py                 # Synthetic polar expedition dataset populator
```

---

## 6. Authoritative State vs. Local Device Replica Semantics

To eliminate state ambiguity in an offline-first multi-device deployment, Aurora explicitly separates global authoritative state from local device replicas:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Global Authoritative Operational State               │
│                  (Base Station Central SQLite Database)                │
│  - Sole global source of truth                                         │
│  - Holds master entity revisions, global audit log, and approved state  │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │
                                    │ Sync Protocol (LWW Merge)
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                      Local Device Replica                              │
│       (Field Laptop / Tablet Browser IndexedDB or Local SQLite)        │
│  - Staged read-only / mutable local copy of operational state          │
│  - Supports optimistic UI updates and local impact simulation offline  │
│  - Queues uncommitted mutations in local `mutation_queue`              │
└────────────────────────────────────────────────────────────────────────┘
```

### Semantics
1. **Reads:** The local React UI reads immediately from its IndexedDB client replica or local SQLite instance.
2. **Local Mutations:** Actions taken on a field device update the local replica immediately (optimistic update) and append an immutable `ChangeRecord` to `mutation_queue`.
3. **Reconciliation:** When connectivity to the base station returns, queued operations are transmitted via the Sync Protocol. The central backend validates constraints against Global Authoritative State and applies updates. Upon confirmation, field device replicas refresh their state to match the master database.

---

## 7. Deterministic Core & Mandatory DAG Rules

The deterministic core (`backend/core/`) is 100% independent of AI and external networks.

### Mandatory Directed Acyclic Graph (DAG) Rule
- **Graph Constraint:** The dependency graph MUST be a Directed Acyclic Graph (DAG).
- **Cycle Prevention:** Cyclic dependencies (e.g., Mission A requires Cargo X → Cargo X requires Mission B → Mission B requires Mission A) represent invalid operational deadlocks.
- **Enforcement Engine:** When any dependency link is added or modified, `backend/core/graph_solver.py` executes NetworkX cycle detection (`nx.simple_cycles(G)`).
- **Behavior on Cycle:** If a cycle is detected, the transaction is rejected immediately with `400 Bad Request: CyclicDependencyError`, preventing invalid state persistence.

### Core Calculations & Algorithms
1. **DAG Traversal:** Converts database entities and dependency constraints into a NetworkX DAG.
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

### Canonical Example Graph (DAG)
- **Nodes:**
  - `Cargo: Cargo-Fuel-01` (Status: Delayed 24h)
  - `Mission: Mission-Alpha` (Requires `Cargo-Fuel-01` & `Asset: Snowcat-A`)
  - `Mission: Mission-Beta` (Prerequisite: `Mission-Alpha` completion)
  - `Asset: Snowcat-A` (Assigned to `Mission-Alpha`)

### Execution Trace:
```text
[Disruption Event Received]
  Cargo-Fuel-01 -> Status: DELAYED (New ETA: T+24h)

[DAG Traversal Step 1: Direct Impact]
  Edge: Cargo-Fuel-01 ---> Mission-Alpha (Type: REQUIRED_CARGO)
  Check: Mission-Alpha Start Time (T+12h) < Cargo-Fuel-01 ETA (T+24h)
  Result: Mission-Alpha -> DIRECTLY_IMPACTED (Broken Prerequisite: Fuel deficit)

[DAG Traversal Step 2: Transitive Impact]
  Edge: Mission-Alpha ---> Mission-Beta (Type: PREREQUISITE_MISSION)
  Result: Mission-Beta -> TRANSITIVELY_IMPACTED (Prerequisite Mission-Alpha delayed)

[DAG Traversal Step 3: Asset Impact]
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
| **Inspect Operational State** | Deterministic Core Fully Operational (IndexedDB / Local SQLite) | Deterministic Core Fully Operational (Synced Master) |
| **Create/Modify Missions & Cargo**| Deterministic Core Fully Operational (Queued in Mutation Store) | Deterministic Core Fully Operational (Immediate Sync) |
| **Dependency & Impact Traversal** | Deterministic Core Fully Operational (NetworkX DAG Engine) | Deterministic Core Fully Operational (NetworkX DAG Engine) |
| **Emergency Resource Triage** | Deterministic Core Fully Operational (Rule-Based Solver) | Enriched with AI SOP Guidelines |
| **Mission Rescheduling** | Baseline Rule Engine (Shift Windows) | LangGraph + Groq Agent Suggestions |
| **SOP Document Querying** | Local Text Search (Cached Docs) | ChromaDB Vector RAG Search & Citations |
| **Multi-Device Sync** | Local BLE / Peer Store-and-Forward | Real-Time REST / WebSocket Refresh |

The UI displays a prominent status pill: **OFFLINE MODE (DETERMINISTIC CORE FULLY OPERATIONAL)** or **ONLINE (AI ENHANCED)**.

---

## 10. Multi-Device Synchronization & Conflict Resolution Model

### Application Sync Protocol Engine (`backend/sync/protocol.py`)
Multi-device sync relies on a transport-agnostic, **Deterministic Sequence & Field-Revision Last-Write-Wins (LWW) Conflict Model**:

```json
{
  "op_id": "op_987654321_device_A",
  "device_id": "device_A",
  "device_seq_num": 104,
  "timestamp_utc": "2026-09-21T01:45:00Z",
  "entity_type": "cargo",
  "entity_id": "cargo_fuel_01",
  "action": "UPDATE",
  "payload": {"status": "DELAYED", "delay_hours": 24},
  "field_revisions": {"status": 3, "delay_hours": 3}
}
```

### Deterministic Conflict Resolution Rules
When the `SyncMerger` processes an incoming operation against existing state:
1. **Deduplication Check:** Checks `op_id` against `processed_ops` table. If present, drops payload immediately (Idempotent replay protection).
2. **Field Revision Comparison:** For each field in `payload`:
   - If incoming `field_revision > local_field_revision` → Accept field update.
   - If `field_revision == local_field_revision`:
     - Compare `timestamp_utc`: Later timestamp wins.
     - If timestamps are identical: Lexicographically smaller `device_id` string wins.
3. **Deterministic Convergence:** These rules guarantee that all nodes processing the same set of operations converge to the exact same state, regardless of arrival order, without requiring complex distributed consensus or CRDT engines.

---

## 11. Separation of Sync Protocol from BLE Transport Adapter

To ensure transport independence, the architecture strictly separates the **Application Sync Protocol Layer** from the **Physical Transport Adapter Layer**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   Application Sync Protocol Layer                      │
│                   (`backend/sync/protocol.py`)                         │
│  - Formats ChangeRecord batches and handles sequence numbers           │
│  - Enforces field-level LWW conflict resolution and deduplication      │
│  - Agnostic of hardware transport (HTTP, BLE, Serial, File export)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Standard Payload Interface
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│                     Physical Transport Adapter                         │
│                  (`backend/sync/ble_adapter.py`)                       │
│  - Encapsulates Web Bluetooth / GATT Characteristic communication      │
│  - Manages 512-byte MTU packet chunking, headers, and CRC checksums   │
│  - Implements store-and-forward buffer queues and TTL hop decrements   │
└────────────────────────────────────────────────────────────────────────┘
```

### BLE GATT Packet Protocol
The `ble_adapter` chunks sync payloads into 512-byte packets:
```text
┌─────────────────┬──────────────────┬─────────────────┬─────────────────────────────┐
│ Header (4 bytes)│ Op ID (16 bytes) │ Chunk Index/Total│ Compressed Binary Chunk     │
│ [AUR1]          │ [op_guid_prefix] │ [01/04]         │ [Gzip JSON payload chunk...]│
└─────────────────┴──────────────────┴─────────────────┴─────────────────────────────┘
```
- **Store-and-Forward Relay:** Companion bridge scripts (`scripts/device_bridge.py`) store chunks on local disk with `ttl = 3`. Decremented per hop. Automatically forwarded when the Central Base Station BLE GATT service comes into range.

---

## 12. Synchronization and Backend Consistency

1. **Authoritative Master Validation:** Incoming peer operations applied at the central backend are re-validated against domain constraints (e.g., verifying mission schedule bounds).
2. **Rejected Changes:** Operations violating core rules are marked `REJECTED` in `sync_failures` log with detailed reasons for Commander audit.
3. **Re-synchronization:** When a field device connects, it receives an authoritative state snapshot to overwrite any locally rejected mutations.

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
   - Scans SQLite/IndexedDB for assets with `status = OPERATIONAL` within immediate distance radius.
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

The React 18 application is structured into clear view modules with IndexedDB client-side replica support:

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
│   ├── OperationalStateContext.jsx # IndexedDB Replica & Offline State Provider
│   └── SyncContext.jsx            # Transport Sync & Mutation Queue State
└── services/
    ├── indexedDBStore.js          # Dexie.js Client Database & Mutation Queue
    ├── api.js                      # Axios HTTP Client with Offline Queue Fallback
    └── bleService.js               # Web Bluetooth API Interface
```

---

## 21. Mobile / Responsive Architecture

- **Viewport Fluidity:** Responsive layout using Tailwind CSS flex/grid system, scaling seamlessly from mobile screens (375px) to tablet (768px) and dual-monitor command desks (1920px).
- **Progressive Web App (PWA) & IndexedDB:** Service worker caches static assets. Dexie.js/IndexedDB stores local entity replicas. The app renders operational state fully offline even in airplane mode.
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
| **Internet Lost** | Groq API & online RAG disabled. Deterministic core fully operational 100% locally. | Banner: `OFFLINE MODE (DETERMINISTIC CORE FULLY OPERATIONAL)` |
| **Groq API Timeout / Error** | LangGraph agent catches exception and invokes deterministic rule fallback (shifts mission start date by disruption duration). | Notice: `AI Assistant Unavailable. Baseline Reschedule Fallback Provided.` |
| **ChromaDB Vector Error** | Agent proceeds with rescheduling using operational state only, omitting RAG manual citations. | Notice: `SOP Manual Search Offline. Recommendation Based on Core State.` |
| **BLE Connection Drop** | Sync Engine queues un-transmitted `ChangeRecord` items in SQLite/IndexedDB; retries automatically upon reconnection. | Sync Pill: `Sync Queue: 3 Pending Items (Reconnecting...)` |
| **Invalid State Transition / Cycle** | State Engine / DAG Solver rejects mutation and rolls back transaction. | Toast: `Invalid Mutation: Cyclic Dependency or Prerequisite Violation.` |

---

## 24. Data Persistence Architecture

### Central SQLite Relational Database Layout
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
  FastAPI receives event -> NetworkX DAG solver computes graph traversal.
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
   - Tests NetworkX DAG dependency traversal and cycle detection algorithms.
   - Verifies direct and transitive impact set output for cargo delays.
   - Asserts that graph traversal output is 100% reproducible over 100 iterations.
2. **Constraint Solver Tests (`tests/test_constraints.py`):**
   - Validates resource capacity deficit calculations and temporal window overlaps.
3. **Offline Sync & Reconciliation Tests (`tests/test_sync_engine.py`):**
   - Simulates two isolated databases generating conflicting operations.
   - Verifies field-level LWW conflict resolution and operation deduplication rules.
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
│   ├── sync/                   # Sync protocol & transport adapters
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

If Internet is severed during the SIH presentation, the platform's **deterministic core remains fully operational** without throwing unhandled exceptions.

---

## 31. Production vs. SIH Boundary

- **IMPLEMENT NOW (SIH Demo Scope):**
  - Single-process FastAPI backend with embedded SQLite central database and IndexedDB client browser replica.
  - Local NetworkX DAG graph solver with cycle detection and rule-based constraint engine.
  - Local ChromaDB vector index loaded with real polar SOP Markdown files.
  - Single Groq LLM API provider integration with Pydantic output validation.
  - Application Sync Protocol with field-level LWW conflict resolution and Web Bluetooth / GATT bridge adapter.
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
| **AC-03 (Offline Cargo Disruption)** | `backend/core/graph_solver.py` | NetworkX DAG graph traversal computes impact set offline without LLM. |
| **AC-05 (Reproducible Results)** | `backend/core/graph_solver.py` | Pure deterministic Python algorithms ensure identical output per state. |
| **AC-06 (Offline Core Execution)** | `backend/core/state_engine.py` | Full SQLite CRUD and constraint engine runs in local Python process. |
| **AC-08 (Real RAG Citations)** | `backend/rag/retriever.py` | ChromaDB vector query fetches actual repository SOP chunks with metadata. |
| **AC-10 (Human Approval Gate)** | `backend/core/approval_engine.py` | AI proposals stored as `PENDING_APPROVAL`; database mutation requires approval API call. |
| **AC-13 (Canonical Vertical Slice)** | End-to-End System Integration | Fully mapped 6-step flow in Section 26. |

---

## 35. Definition of Architectural Done

This architecture document (`docs/architecture.md`) is complete because:
- Every major technical component (Frontend, IndexedDB Replica, Backend, Database, AI, RAG, MCP, Sync Protocol, BLE Transport) has a concrete, non-ambiguous technology choice.
- The deterministic operational core is strictly isolated from AI dependencies and enforces DAG cycle prevention.
- Multi-device peer synchronization clearly separates the Application Sync Protocol (LWW merge model) from physical transport adapters.
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
