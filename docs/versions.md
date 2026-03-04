# Library Versions

Exact versions used at time of measurement. All values resolved from `yarn.lock`.

Measurement date: <!-- fill in when Phase 3 runs are executed -->

---

## UI Libraries (primary subjects)

| Library | Package | Version | App |
|---|---|---|---|
| MUI | `@mui/material` | 7.2.0 | dashboard-mui |
| MUI Icons | `@mui/icons-material` | 7.2.0 | dashboard-mui |
| Ant Design | `antd` | 5.26.6 | dashboard-antd |
| Chakra UI | `@chakra-ui/react` | 3.23.0 | dashboard-chakra |
| Chakra Icons | `@chakra-ui/icons` | 2.2.4 | dashboard-chakra |

---

## Shared Runtime Dependencies (identical across all 3 apps)

| Package | Version | Purpose |
|---|---|---|
| `react` | 19.1.0 | Core framework |
| `react-dom` | 19.1.0 | DOM renderer |
| `react-router-dom` | 7.13.1 | Client-side routing |
| `@tanstack/react-table` | 8.21.3 | Table logic (sorting, filtering, pagination) |
| `@dnd-kit/core` | 6.3.1 | Drag-and-drop (Kanban) |
| `@dnd-kit/utilities` | 3.2.2 | DnD CSS transform utilities |
| `recharts` | 3.7.0 | Charts (line, bar) |

---

## Library-specific Runtime Dependencies

| Package | Version | App | Purpose |
|---|---|---|---|
| `@emotion/react` | 11.14.0 | dashboard-mui, dashboard-chakra | CSS-in-JS runtime |
| `@emotion/styled` | 11.14.1 | dashboard-mui, dashboard-chakra | Styled components |
| `framer-motion` | 12.23.9 | dashboard-chakra | Animation (Chakra v3 peer dependency) |

---

## Measurement Tooling

| Package | Version | Purpose |
|---|---|---|
| `@lhci/cli` | 0.15.1 | Lighthouse CI — collect and store Lighthouse reports |
| `rollup-plugin-visualizer` | 7.0.0 | Bundle composition analysis — treemap of parsed/gzip sizes per module |

---

## Build & Dev Tooling

| Package | Version | Apps | Notes |
|---|---|---|---|
| `typescript` | 5.9.3 | all | Identical |
| `vite` | 7.0.6 | dashboard-mui, dashboard-chakra | |
| `vite` | 7.2.2 | dashboard-antd | **Version mismatch** — see note below |
| `vitest` | 3.2.4 | all | Identical |
| `eslint` | 9.31.x | all apps | Resolves to the same version as root `^9.32.0` |

**Vite version mismatch note:** `dashboard-antd` was initialised at a later date when Vite 7.2.2 was already released; the other two apps were pinned to 7.0.6. Both are within the Vite 7 major. Vite is a build tool only and does not affect runtime performance, bundle output format, or accessibility measurements. The discrepancy has no impact on measurement validity.

---

## Measurement Environment

| Variable | Value |
|---|---|
| Node.js | <!-- run `node --version` at measurement time --> |
| Chrome (Lighthouse) | <!-- record version from Chrome → Help → About Google Chrome --> |
| OS | <!-- e.g. macOS 15.x / Windows 11 --> |
| Machine | <!-- e.g. MacBook Pro M3, 16 GB RAM --> |
| Measurement date | <!-- fill in --> |
