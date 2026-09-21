# Aurora — Project Specification

---

## 1. Specification Identity

- **Specification ID:** SPEC-AURORA-001
- **Version:** 1.0.0
- **Status:** APPROVED / DRAFT FOR IMPLEMENTATION
- **Purpose:** Define the functional, behavioral, and operational requirements for the Aurora Polar Expedition Command Platform.
- **Intended Implementation Target:** Smart India Hackathon (SIH) prototype demonstration representing approximately 75% of the core operational system functionality.

> **PRIMARY DIRECTIVE:**
> **BUILD THE SMALLEST REAL IMPLEMENTATION THAT DEMONSTRATES THE CORE AURORA SYSTEM END-TO-END.**

---

## 2. System Purpose

### Problem Statement
Polar expeditions operate in high-risk, extreme, and severe low-bandwidth or completely offline environments. Operations involve multi-layered dependencies across supply cargo, transport assets, personnel schedules, extreme weather conditions, and survival-critical equipment. A disruption in a single supply line or asset can cascade into severe mission failures or safety risks.

### Aurora Overview
Aurora is an **offline-first polar expedition command platform**. It provides a unified operational picture across:
- **Missions** (exploration, science, maintenance, supply runs)
- **Cargo & Inventory** (medical, fuel, equipment, rations)
- **Personnel** (specialties, station assignments, team readiness)
- **Assets** (snowcats, generators, comms gear, habitats)
- **Field Conditions** (blizzards, route closures, extreme cold alerts)
- **Dependencies & Constraints** (prerequisite tasks, payload limits, environmental thresholds)

Aurora serves primarily as an **authoritative operational state engine** and **decision-support platform**.

### What Aurora Is NOT
To prevent agent and project scope drift, Aurora is explicitly **NOT**:
- A generic conversational chatbot or wrapper
- An LLM-first application where state lives in conversation context
- A generic visual-only analytics dashboard
- A collection of disconnected CRUD pages with mocked buttons
- An autonomous operational executor that modifies real-world state without oversight

---

## 3. Core System Principle

> **THE DETERMINISTIC OPERATIONAL CORE MUST FUNCTION WITHOUT INTERNET ACCESS, AN LLM, RAG, AUTONOMOUS AGENTS, OR EXTERNAL AI APIs.**

The application state is authoritative. AI is strictly an enhancement layer, never the source of truth or a mandatory runtime dependency for core operations.

### Conceptual Operational Flow

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

#### Flow Explanation:
1. **Operational Event:** An incident occurs (e.g., cargo delay, vehicle failure, severe weather alert).
2. **Unified Operational State:** The system receives the event and evaluates it against the current authoritative state.
3. **Dependency & Impact Analysis:** The deterministic graph engine traverses resource and mission links to identify directly and transitively affected entities.
4. **Offline Deterministic Core:** The offline core validates constraints and generates baseline impact reports locally.
5. **Online Agentic Enhancement:** When connectivity is present, AI agents analyze the disruption, retrieve relevant SOP documentation via RAG, and formulate reschedule/reallocation options.
6. **Proposed Action:** The system packages the recommendation as a structured, non-binding proposal.
7. **Human Commander Approval:** The human commander reviews, modifies, or rejects the proposal.
8. **Operational State Updated:** Only upon explicit approval does the authoritative state mutate and trigger downstream updates.

---

## 4. Non-Negotiable System Rules

1. **RULE-AURORA-01:** The authoritative operational state belongs to the application database/system state, never to an LLM conversation history.
2. **RULE-AURORA-02:** Core operational functionality (state inspection, creation, dependency tracking, impact propagation) must remain usable offline.
3. **RULE-AURORA-03:** Dependency and impact analysis must be deterministic and reproducible for identical input state and disruption events.
4. **RULE-AURORA-04:** AI recommendations must never silently mutate consequential operational state.
5. **RULE-AURORA-05:** Consequential operational decisions require explicit human commander approval before applying state changes.
6. **RULE-AURORA-06:** AI recommendations must be clearly distinguishable in the UI/API from authoritative operational state.
7. **RULE-AURORA-07:** RAG operations must retrieve actual project-provided documents and data rather than returning hardcoded or fabricated text.
8. **RULE-AURORA-08:** Agents must be narrow, single-purpose components (e.g., Mission Rescheduling Agent) rather than a monolithic autonomous loop.
9. **RULE-AURORA-09:** MCP is a tool/interface gateway boundary and must not act as the authoritative state or make autonomous decisions.
10. **RULE-AURORA-10:** AI agent tools must be read-only by default; state-modifying actions require explicit authorization and human approval workflows.
11. **RULE-AURORA-11:** Synthetic demo data must be clearly labeled and distinguished from live operational data.
12. **RULE-AURORA-12:** No fake UI buttons, hardcoded success responses, or hidden mocks presented as functional real-time AI/state behavior.
13. **RULE-AURORA-13:** Fallbacks and development mocks must be explicitly identifiable in code and UI logs.
14. **RULE-AURORA-14:** The implementation must prioritize deep, end-to-end integration of a high-priority vertical slice over superficial coverage of many features.

---

## 5. Authoritative Operational State

Aurora defines a unified domain state model representing all active polar expedition entities:

1. **Mission Domain**
   - Identity, title, objective, priority level
   - Planned/actual start and end timestamps, current status (e.g., Draft, Scheduled, In Progress, Delayed, Completed, Aborted)
   - Required resources, prerequisite mission dependencies, associated personnel and assets
2. **Cargo Domain**
   - Cargo ID, item description, category (Fuel, Rations, Medical, Technical, Survival)
   - Quantity, unit of measure, priority class, current location/stage
   - Estimated arrival timestamp, delay status, linked missions requiring this cargo
3. **Inventory / Resource Domain**
   - Resource type, capacity, current available quantity, allocated quantity, reserve thresholds
   - Location/station assignment, consumption rate
4. **Personnel Domain**
   - Personnel ID, name, role/specialty (Doctor, Engineer, Scout, Commander)
   - Station assignment, medical status, current mission assignments, availability schedule
5. **Asset Domain**
   - Asset ID, name, category (Vehicle, Generator, Habitat, Comms Antenna)
   - Operational status (Operational, Maintenance Required, Offline, Damaged)
   - Location, power/fuel consumption rate, current mission assignment
6. **Field Conditions Domain**
   - Environmental alerts, temperature readings, wind speed, visibility level
   - Route statuses (Passable, Impassable, Caution), active weather advisories
7. **Dependencies & Constraints Domain**
   - Explicit prerequisite relationships (Mission B requires Mission A completion; Mission C requires Cargo X arrival)
   - Capacity constraints (Vehicle payload limit, station power capacity)
   - Temporal constraints (Weather window, mandatory rest hours)

---

## 6. State and Event Model

### Entity Classifications
- **Operational State:** Current authoritative snapshot of all entities and relationships.
- **Event / Disruption:** An external or internal occurrence that modifies or invalidates current state assumptions (e.g., "Cargo X delayed by 48h", "Vehicle Snowcat-1 breakdown").
- **Analysis Result:** Deterministic impact set produced by graph traversal following an event.
- **Recommendation:** Non-authoritative proposal generated by an AI agent or rule engine.
- **Approved Action:** Validated transaction confirmed by a human commander that mutates operational state.

### Event Processing Pipeline

```text
Event Trigger
  → State Evaluation
  → Dependency Traversal
  → Impact Set Calculation
  → Recommendation Generation
  → Commander Review
  → State Mutation
```

*Note:* State evaluation and impact analysis are read-only operations and MUST NOT mutate authoritative state until the Commander explicitly approves an action.

---

## 7. Dependency and Impact Analysis

Aurora's core deterministic value is calculating downstream effects when an entity's status changes.

### Analysis Requirements
- **Inputs:** Current Operational State + Disruption Event
- **Output:** Structured Impact Set containing:
  - Directly affected entity IDs and types
  - Transitively (downstream) affected mission/resource IDs
  - Broken prerequisites and scheduling conflicts
  - Resource deficit estimations
  - Deterministic severity/impact classification (Critical, Warning, Informational)
  - Clear human-readable reason for each affected relationship chain

### Determinism Rule
Running the dependency analysis tool on the exact same Operational State with the exact same Disruption Event MUST yield identical results every time.

---

## 8. Cargo and Dependency Tracking

### MVP Functional Scope
- Creating and updating cargo items and tracking status through operational stages (e.g., Transit, Staged, Delayed, Delivered).
- Linking cargo items to specific mission prerequisites.
- Highlighting delayed or missing cargo and immediately surfacing all missions dependent on that cargo.
- Graphically or tabularly displaying dependency links between missions, assets, and cargo.

### Explicitly Out of Scope for MVP
- Integration with external international shipping/customs APIs
- Full enterprise multi-warehouse ERP integration
- Hardware RFID / satellite telemetry hardware integration

---

## 9. First Vertical Slice: Canonical Demo Journey

The primary acceptance target for the initial Aurora implementation is a single, deeply integrated vertical slice executing this exact sequence:

1. **Create/Modify Mission:** Commander registers "Mission Arctic Outpost Alpha" with specific start times.
2. **Add Cargo & Resource Dependencies:** Mission is linked to "Cargo-Fuel-01" and "Vehicle Snowcat-A".
3. **Simulate Disruption:** User records a disruption event: "Cargo-Fuel-01 delayed by 24 hours due to blizzard".
4. **Propagate Dependency Impact:** Deterministic engine traverses state and marks "Mission Arctic Outpost Alpha" as **IMPACTED / UNVIABLE** due to fuel delivery delay.
5. **Surface Impact Set:** UI displays direct impact on fuel cargo and downstream impact on outpost mission and dependent personnel schedules.
6. **Generate Reschedule Proposal:** Rescheduling Agent (or offline fallback rule) analyzes available windows and proposes shifting Mission Alpha by 30 hours and reallocating reserve fuel from Depot B.
7. **RAG Context Enrichment (If Online):** System retrieves SOP snippet: *"Section 4.2 - Low Temperature Fuel Contingency Protocol"*.
8. **Commander Approval Interface:** UI presents current state vs. proposed reschedule. Commander reviews reasoning and clicks **Approve**.
9. **State Mutation:** Authoritative operational state updates. Mission Alpha schedule is adjusted, reserve fuel is allocated.
10. **UI Update:** Operational view refreshes displaying updated valid schedules and cleared impact warnings.

---

## 10. Offline-First Behavior

### When Offline
- Local operational state is fully readable and mutable.
- Core dependency traversal and impact calculations operate deterministically.
- New missions, cargo updates, and manual approvals can be recorded locally.
- Unsynchronized changes are queued with local event sequence timestamps.
- AI/RAG features show explicit "AI Offline - Baseline Engine Active" indicator.

### When Online
- Queued operational state changes synchronize with remote services.
- Vector database RAG search becomes available for SOP query enrichment.
- LLM decision-support agents become active.
- External weather feeds refresh.

### Local Transport & Synchronization Specification
- Offline synchronization may use supported local transports, including BLE-based peer/bridge transport where available. The synchronization mechanism must remain transport-agnostic at the application-protocol level.
- BLE is strictly a physical transport mechanism, not a business capability or standalone MVP feature.
- BLE is not required for the deterministic operational core to function offline.
- Loss or unavailability of BLE transport must not prevent local deterministic state inspection, mission updates, or impact analysis.
- The detailed application synchronization protocol and transport adapter implementation remain defined by `docs/architecture.md`. No specialized or custom BLE hardware is required by the Aurora core specification.

Loss of connectivity MUST degrade ONLY the AI enhancement layer, never the operational core.

---

## 11. AI / RAG Specification

### RAG Operational Flow
```text
Event / State Context → Context Retriever → Vector Index (Project SOPs/Manuals) → Grounded Context → Agent Reasoning → Recommendation
```

### RAG Requirements
- RAG MUST retrieve from actual indexed expedition manuals, SOPs, and emergency guidelines provided in the repository.
- System MUST preserve and display document titles / section citations where practical.
- FABRICATED document names, citations, or hardcoded fake paragraphs presented as "retrieved knowledge" are strictly forbidden.
- RAG output supplements operational reasoning; it never overrides deterministic state constraints.

---

## 12. Agent Specification

Agents are specialized, narrow decision-support modules.

### A. Mission Rescheduling Agent
- **Inputs:** Disruption event, affected missions, state graph, resource availability, constraints, retrieved SOP context.
- **Outputs:** Structured proposal containing revised mission schedule alternatives, resource tradeoffs, human-readable rationale, and confidence assessment.

### B. Emergency Resource Agent
- **Inputs:** Emergency alert (e.g., heating breakdown at Station 3), location, available assets/personnel, environmental readings, safety procedures.
- **Outputs:** Recommended emergency resource allocation options, affected existing missions, step-by-step response steps, and safety warnings.

*Rule:* Agents recommend options. They DO NOT possess authority to execute state changes silently.

---

## 13. Model Context Protocol (MCP) Specification

MCP functions strictly as a tool and interface gateway connecting decision-support agents to application capabilities.

### Pattern
```text
Agent → MCP Gateway → Approved Tool → Authoritative State / Analysis Service
```

### Requirements
- Tools MUST be explicitly defined with structured inputs and outputs.
- Tools MUST be read-only by default (e.g., `get_mission_state`, `analyze_impact`).
- State-modifying tools MUST require explicit authorization parameters and route through the Commander approval workflow.
- MCP gateway MUST NOT bypass core system validation or domain rules.

---

## 14. Human-in-the-Loop Workflow

### System Boundaries
- **AI MAY:** Analyze state, traverse dependencies, retrieve SOPs, calculate impact, generate reschedule options, explain rationale.
- **AI MUST NOT:** Auto-approve plans, modify production state silently, cancel missions, or bypass approval gates.

### Canonical Review Interface Requirements
The UI MUST clearly delineate four distinct concepts:
1. **Current Authoritative State** (What is currently happening)
2. **Detected Impact** (What is broken/delayed due to disruption)
3. **AI Proposed Recommendation** (What the AI suggests doing)
4. **Pending Action / Approval Gate** (Approve / Modify / Reject controls)

---

## 15. Resource Forecasting & Allocation

- Provides basic capacity vs. demand tracking for key resources (Fuel, Power, Food Rations, Oxygen/Medical, Vehicles).
- Surfeits and deficits are surfaced when scheduled missions exceed available allocations.
- AI provides allocation trade-off recommendations during resource conflicts.

---

## 16. Emergency Baseline Workflow

When an emergency event occurs (e.g., power failure, severe injury):
1. User or alert triggers Emergency Event.
2. System immediately filters available local personnel and operational assets in geographic proximity.
3. Offline deterministic core evaluates basic constraints (e.g., operational status, fuel range).
4. System presents feasible emergency response options immediately.
5. If online, Emergency Resource Agent enriches options with safety SOP guidelines.
6. Commander selects and approves emergency action.

---

## 17. UI / UX Behavioral Requirements

The user interface MUST support:
- Clear visual distinction between Authoritative State, Impact Set, and AI Recommendations.
- Explicit indicator of connectivity state (**Online** vs. **Offline Mode**).
- Clear indicator when AI service is unavailable or running fallback rules.
- Interactive controls to trigger disruptions, view dependency chains, and review/approve proposals.
- **UI State Handling:** Every view must handle `Loading`, `Success`, `Empty`, `Error`, `Offline/Degraded`, and `Pending Approval` states gracefully.

Never include decorative buttons that trigger hardcoded fake actions without underlying logic.

---

## 18. Data & Demo Dataset Requirements

The repository will include a synthetic demonstration dataset containing:
- At least 3 active polar stations/outposts
- At least 5 scheduled missions with inter-dependencies
- At least 10 cargo items linked to missions
- At least 4 vehicles/assets and 8 personnel profiles
- Pre-configured disruption scenarios (e.g., Blizzard Alert, Fuel Cargo Delay)

Demo data must be explicitly labeled as synthetic in development logs and UI headers.

---

## 19. Error and Failure Behavior

- **AI API Failure / Timeout:** System displays "AI Assistant Unavailable" notice; core deterministic impact analysis continues working normally.
- **Invalid State Mutation:** State engine rejects invalid transitions and returns clear validation errors.
- **RAG Index Unreachable:** System proceeds with deterministic analysis without document citations, notifying the user.
- **Sync Conflict:** Local change queue is preserved; conflicts are surfaced for human resolution.

Failure of an AI or network component MUST NEVER crash or corrupt the deterministic operational core.

---

## 20. Security & Secret Management

- Secrets (API keys, credentials, tokens) MUST NEVER be hardcoded or committed. All credentials must be loaded via environment variables.
- AI outputs must be treated as untrusted and validated against schema before rendering or processing.
- Authorization boundaries must ensure read-only tool access by default.

---

## 21. MVP Scope (Priority Capabilities)

1. **Unified Expedition Operational State**
2. **Cargo & Dependency Tracking**
3. **Deterministic Dependency / Impact Analysis Engine**
4. **Dynamic Mission Rescheduling Assistance (AI + Offline Fallback)**
5. **Emergency Resource Recommendation Engine**
6. **RAG over Expedition SOPs & Safety Guidelines**
7. **Resource Allocation & Forecasting Interface**

---

## 22. Non-Goals / Explicit Out of Scope

To prevent scope creep, the following are explicitly OUT OF SCOPE for the SIH MVP:
- Full enterprise ERP / accounting / procurement platform
- Production microservices, Kubernetes clusters, or multi-region failover
- Autonomous robotic / drone execution systems
- Real-time satellite telemetry hardware integrations
- Real-world polar expedition operational deployment
- Digital twin 3D engine or complex GIS rendering engine

---

## 23. Acceptance Criteria

- **AC-01:** Aurora represents operational state (missions, cargo, inventory, personnel, assets, conditions, dependencies) in a structured model.
- **AC-02:** User can create/modify missions and attach cargo and asset dependencies.
- **AC-03:** User can record a cargo disruption offline, and the deterministic engine correctly identifies affected downstream missions.
- **AC-04:** Impact analysis distinguishes direct impacts from transitive downstream dependencies.
- **AC-05:** Dependency traversal produces identical, reproducible results for identical input states and events.
- **AC-06:** System operates core state updates and impact checks fully offline without network or LLM access.
- **AC-07:** When online AI is active, Rescheduling Agent generates structured rescheduling options grounded in current state.
- **AC-08:** RAG queries retrieve actual content from repository SOP documents, displaying valid source references.
- **AC-09:** AI recommendations are visually separated from authoritative operational state in the UI.
- **AC-10:** Consequential operational changes occur ONLY after explicit human commander approval in the UI/API workflow.
- **AC-11:** Disabling network/AI access degrades only the enhancement layer; deterministic workflows remain functional.
- **AC-12:** Emergency scenarios generate a baseline feasible resource view offline.
- **AC-13:** The canonical end-to-end vertical slice (Disruption → Impact Propagation → AI Proposal → Approval → State Update) executes successfully.
- **AC-14:** Fallback and mock behaviors are explicitly logged and identified.

---

## 24. Demo Scenarios

### Scenario 1: Cargo Delay
- **Action:** Mark "Medical Supply Crate 4" delayed by 48 hours.
- **Expected Outcome:** Deterministic impact engine identifies "Mission Medical Outreach B" as unviable; AI proposes shifting start date; Commander approves; schedule updates.

### Scenario 2: Vehicle Asset Failure
- **Action:** Set "Snowcat Vehicle 1" status to "Engine Failure".
- **Expected Outcome:** Immediate impact surfaced on "Traverse Mission Alpha"; available alternative "Snowcat Vehicle 2" identified for reallocation.

### Scenario 3: Emergency Heating Shortage
- **Action:** Trigger emergency alert "Station Gamma Generator Offline".
- **Expected Outcome:** System identifies nearest available generator asset and fuel reserve; displays emergency response protocol; Commander approves emergency dispatch.

### Scenario 4: Offline Field Mode
- **Action:** Disconnect network connectivity.
- **Expected Outcome:** UI shows "Offline Mode"; state updates, cargo tracking, and deterministic dependency checks remain fully operational; AI controls indicate offline status.

### Scenario 5: AI Provider Timeout
- **Action:** Simulate LLM API failure during reschedule request.
- **Expected Outcome:** Error handled gracefully; user notified AI is unavailable; local deterministic impact analysis remains displayed and functional.

---

## 25. Traceability Matrix

| Requirement Domain | AGENTS.md Principle | Architectural Component (Future) | Test Category (Future) |
| :--- | :--- | :--- | :--- |
| Operational State Engine | Section 2 (Deterministic Core) | Backend State Module | Unit & State Tests |
| Dependency / Impact Analysis | Section 2 & Rule 3 | Deterministic Graph Solver | Graph & Propagation Tests |
| Offline-First Execution | Section 4 (Offline Rule) | Local Persistence & Queue | Offline Workflow Tests |
| Mission Rescheduling AI | Section 3 & Section 6 | AI Rescheduling Agent | Agent Output Validation Tests |
| SOP RAG Retrieval | Section 6 (RAG Rules) | RAG Pipeline & Vector Index | Retrieval Accuracy Tests |
| Commander Approval Gate | Section 3 (Human-in-Loop) | Approval Workflow API / UI | Approval State Tests |
| Vertical Slice Scenario | Section 5 (Demo Scope) | End-to-End System Integration | System Integration Tests |

---

## 26. Implementation Boundaries

This specification deliberately **DOES NOT** prescribe:
- Programming language, web framework, or UI component library
- Database, ORM, or vector storage library
- Specific LLM provider, SDK, or embedding model
- Specific MCP server SDK
- Synchronization protocols or exact REST/GraphQL/gRPC routes

All technology stack selections, module definitions, schema designs, and class/file structures are deferred to `docs/architecture.md` and subsequent implementation decisions.

---

## 27. Demo vs. Production Boundary

- **Permitted Demo Simplifications:** Local in-memory or SQLite database, local vector store or lightweight search, simulated weather data feeds, development LLM API fallback options.
- **Prohibited Shortcuts:** Fake core dependency logic, static hardcoded fake AI responses presented as live reasoning, fake UI buttons, hidden unhandled exceptions, misleading claims about non-existent real-time integrations.

---

## 28. Specification Definition of Done

This specification (`docs/spec.md`) is complete because:
- System purpose and non-goals are strictly defined.
- Unified state model and offline deterministic core are fully established.
- AI/RAG/MCP boundaries and human-in-the-loop gates are explicitly mandated.
- First vertical slice and 5 concrete demo scenarios are defined.
- Acceptance criteria are concrete and testable.
- Technology stack decisions are properly deferred to `docs/architecture.md`.
- No contradictions exist with `AGENTS.md`.

---

## 29. Limitations

- This is a hackathon/demo specification representing ~75% of full product vision.
- Field pilot measurements, multi-region database sync protocols, and hardware sensor integrations are deferred to future post-SIH project phases.

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
