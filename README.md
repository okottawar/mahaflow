# MahaFlow

**Adaptive Mobility Intelligence System for Large Religious Gatherings**

MahaFlow is a real-time transportation intelligence platform designed for managing crowd mobility at scale. It uses a configurable fuzzy logic reasoning engine to assess congestion risk, recommend optimal routes, and surface explainable operational decisions — all without relying on LLMs or external APIs.

Built as a frontend-only application running entirely on simulated data.

---

## Features

- **Mobility Overview Dashboard** — Real-time metrics for total pilgrims, congestion index, critical zones, parking utilization, and system health
- **Network Visualization** — Stylized SVG transportation graph with 15 nodes and 22 routes, color-coded by risk level with interactive inspection
- **Route Advisor** — Transport-aware pathfinding (Walking, Shuttle, Bus, Private, Emergency) using Dijkstra's algorithm with mode-specific weights
- **Authority Control Room** — Critical route monitoring, parking saturation tracking, zone health overview, and operational recommendations
- **Fuzzy Logic Engine** — 16 configurable rules with trapezoidal membership functions, AND-semantics activation, and weighted defuzzification
- **Explainable Decisions** — Every risk score shows triggered rules, input conditions, activation strengths, and natural-language recommendations
- **Live Simulation** — Time-of-day crowd profiles, sinusoidal event surges, and parking saturation curves updating every 5 seconds
- **Multilingual** — Full interface support for English, Hindi (हिंदी), and Marathi (मराठी)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Vanilla CSS (editorial design system) |
| Animation | Framer Motion |
| Typography | DM Serif Display · DM Sans · DM Mono |
| Intelligence | Custom fuzzy logic engine (no ML/LLM dependencies) |
| Data | Local simulated data (no backend or database) |

---

## Architecture

```
src/
├── app/                    # Next.js pages
│   ├── page.tsx            # Overview Dashboard
│   ├── map/page.tsx        # Network Map
│   ├── advisor/page.tsx    # Route Advisor
│   └── control/page.tsx    # Control Room
├── components/             # React components
│   ├── Layout.tsx          # App shell with sidebar
│   ├── NetworkGraph.tsx    # SVG network visualization
│   ├── ExplainPanel.tsx    # Fuzzy reasoning display
│   ├── StatCard.tsx        # Metric cards
│   ├── RiskBadge.tsx       # Risk level indicators
│   └── LanguageSwitcher.tsx
├── context/
│   └── SimulationContext.tsx  # Global state provider
└── lib/
    ├── data/               # Static data definitions
    │   ├── nodes.ts        # 15 network nodes
    │   ├── routes.ts       # 22 transport routes
    │   ├── fuzzyRules.ts   # 16 configurable rules
    │   └── translations.ts # EN/HI/MR dictionaries
    └── engine/             # Core intelligence
        ├── fuzzyEngine.ts          # Fuzzification → Rules → Defuzzification
        ├── simulationEngine.ts     # Time-based crowd simulation
        └── recommendationEngine.ts # Dijkstra pathfinding
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build

```bash
npm run build
```

---

## Design Principles

- **Not an LLM wrapper** — Intelligence comes from a configurable fuzzy logic engine
- **Explainability first** — Every decision is traceable to specific rules and input conditions
- **Editorial aesthetic** — Calm, authoritative design inspired by transportation operations centers
- **Zero external dependencies** — No APIs, databases, or authentication required
- **Fully client-side** — Runs entirely in the browser from simulated data

---

## License

MIT
