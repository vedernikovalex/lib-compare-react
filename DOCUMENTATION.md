# DOCUMENTATION.md

Technical reference for the `lib-compare-react` monorepo. This is the single source of truth for architecture, patterns, and conventions.

---

## 1. Project Overview

A bachelor's thesis comparing three React UI libraries — MUI v7, Ant Design v5, Chakra UI v3 — by building the same dashboard application three times, measured identically.

**Evaluation criteria and weights:**

| Criterion | Weight |
|---|---|
| Performance & Bundle Size (Core Web Vitals, Lighthouse CI, source-map-explorer) | 30% |
| Accessibility (WCAG 2.1 AA, axe-core, NVDA, keyboard navigation) | 25% |
| Developer Experience (TypeScript quality, API consistency, documentation) | 22% |
| Theming & Customization (token depth, overrides, dark mode, slot APIs) | 12% |
| Ecosystem & Community (component count, npm downloads, GitHub activity) | 8% |
| Internationalization (RTL support, locale formatting, translation integration) | 3% |

Scoring: 1–10 per criterion × weight → overall score per library.

See `docs/metrics/metrics_first_iteration.md` for full rationale and change history.

---

## 2. Monorepo Structure

```
lib-compare-react/
├── apps/
│   ├── dashboard-antd/      # Ant Design v5 app (port 3001)
│   ├── dashboard-chakra/    # Chakra UI v3 app (port 3002)
│   └── dashboard-mui/       # MUI v7 app (port 3003)
├── packages/
│   └── shared/              # Shared data, hooks, types, translations
├── docs/                    # Measurement artifacts and results
├── package.json             # Root — yarn workspaces, shared devDeps
├── tsconfig.json            # Root TypeScript config (extended by apps)
├── DOCUMENTATION.md         # This file
└── PROJECT.md               # Rules, roadmap, AI guidance
```

**Package manager:** yarn (yarn workspaces).

Root `package.json` workspace definition:
```json
"workspaces": ["apps/*", "packages/*"]
```

---

## 3. Tech Stack (pinned versions)

| Package | Version |
|---|---|
| react / react-dom | 19.1.0 |
| typescript | 5.9.3 |
| vite | 7.x (7.0.6 in mui/chakra, 7.2.2 in antd) |
| @mui/material | 7.2.0 |
| antd | 5.26.6 |
| @chakra-ui/react | 3.23.0 |
| vitest | 3.2.4 |
| eslint | 9.x |

Planned shared utility libraries (not yet installed):
- `@tanstack/react-table` — sortable/filterable table
- `@dnd-kit/core` — kanban drag and drop
- `recharts` — line and bar charts

---

## 4. Shared Package (`packages/shared`)

**Package name:** `shared` (private, not published to npm).

**Entry point:** `dist/index.js` / `dist/index.d.ts` — built output (not yet built; apps currently import via path alias pointing at `src/` directly).

**Current source structure:**

```
packages/shared/src/
├── data/
│   ├── homepage.data.ts      # highlightKeys array
│   ├── dashboard.data.ts     # 210 table rows, 4 KPI items, 60-day time series, category revenue
│   └── kanban.data.ts        # 15 initial cards, 3 column definitions
├── hooks/
│   └── useTranslations.ts    # Type-safe translation hook
├── lang/
│   ├── global.json           # Global-scope translations
│   ├── homepage.json         # Homepage-scope translations
│   ├── nav.json              # Navigation labels (home, dashboard, kanban)
│   ├── dashboard.json        # Dashboard page translations (KPI labels, table columns, chart titles)
│   ├── kanban.json           # Kanban page translations (columns, priority, modal fields)
│   └── index.ts              # Flattening, type derivation, exports
├── theme/
│   └── tokens.json           # Design tokens: colors, spacing, borderRadius, fontSize, shadow
└── types/
    ├── dashboard.types.ts    # DashboardRow, KpiData, TimeSeriesPoint, CategoryRevenue, enums
    ├── kanban.types.ts       # KanbanCard, KanbanColumnDef, KanbanColumnId, KanbanPriority
    └── index.ts              # Re-exports all types
```

**How apps import from shared:**

Apps use the `@shared` path alias (not the package name `shared`). The alias resolves to the package root:

```ts
import { highlightKeys } from "@shared/src/data/homepage.data";
import { useTranslations } from "@shared/src/hooks/useTranslations";
```

---

## 5. Translation System

### Architecture

`packages/shared/src/lang/index.ts` merges all JSON files into a flat key map at build time using recursive TypeScript type inference. No runtime i18n library is used.

```
global.json     →  { "global": { "appTitle": "..." } }
homepage.json   →  { "homepage": { "intro": { "description": "..." } } }

Merged flat map →  { "global.appTitle": "...", "homepage.intro.description": "..." }
```

All keys and their string values are fully typed via `TranslationKey`.

### Hook: `useTranslations(namespace?)`

```ts
const { t } = useTranslations("homepage");
t("intro.description")        // resolves "homepage.intro.description"
t("global.appTitle")          // resolves full key directly (no namespace prefix added)

const { t: tGlobal } = useTranslations("global");
tGlobal("appTitle")           // resolves "global.appTitle"
tGlobal("cta.viewMeasurementProtocol")  // resolves "global.cta.viewMeasurementProtocol"
```

Lookup order: full key first → namespace-prefixed key → returns raw key as fallback.

`TranslationNamespace` is a derived type (not hardcoded): any top-level key prefix that appears in a dotted key is a valid namespace.

### Adding translations

1. Add the key/value to the relevant JSON file (`global.json` or `homepage.json`).
2. Type inference is automatic — no regeneration step needed.
3. TypeScript will error on any `t()` call with a non-existent key.

---

## 6. App Structure Pattern

Consistent across all three apps:

```
apps/dashboard-xxx/
├── src/
│   ├── main.tsx         # Provider setup + ReactDOM.render
│   ├── App.tsx          # Router + layout shell
│   ├── pages/           # Route-level components
│   ├── components/      # App-specific UI components
│   └── theme/           # Theme adapter (maps tokens.json to library API)
├── vite.config.ts       # @shared alias + port
├── tsconfig.json        # Extends root, sets @shared paths
└── package.json         # App-specific deps
```

---

## 7. Component Convention

```ts
// Imports grouped: React → UI library → @shared → local
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "@shared/src/hooks/useTranslations";
import MyLocalComponent from "./MyLocalComponent";

interface Props {
  title: string;
  onClose: () => void;
}

/**
 * JSDoc on exported components and functions.
 */
const MyComponent = ({ title, onClose }: Props) => {
  // ...
};

export default MyComponent;
```

- Arrow function assigned to `const`, default export at file bottom.
- `interface Props` — not `MyComponentProps`; not exported unless a parent needs it.
- All return statements use curly brackets on separate lines (no single-line guards).
- No `any` types.

---

## 8. Pages & Routes

Same paths in all three apps:

| Route | Status | Description |
|---|---|---|
| `/` | DONE | Homepage — app intro, highlights, CTAs |
| `/dashboard` | DONE | KPI cards, filterable/sortable table, line + bar charts |
| `/kanban` | DONE | DnD board (Todo / In Progress / Done), card edit modal |

---

## 9. Theme System

Single source of truth: `packages/shared/src/theme/tokens.json` (colors, spacing, radius, typography scale, shadow).

Each app has an adapter that maps tokens to its library's theming API:

| App | Adapter file | API |
|---|---|---|
| dashboard-mui | `src/theme/muiTheme.ts` | `createTheme()` |
| dashboard-antd | `src/theme/antdTheme.ts` | `ConfigProvider` config object |
| dashboard-chakra | `src/theme/chakraTheme.ts` | `createSystem(defaultConfig, {...})` — Chakra v3 API (not `extendTheme`) |

No hardcoded color/spacing/font values in component files — all values come through the theme adapter.

---

## 10. Dev Commands

```bash
# Individual apps
yarn workspace dashboard-antd dev        # port 3001
yarn workspace dashboard-chakra dev      # port 3002
yarn workspace dashboard-mui dev         # port 3003

# All at once
yarn dev:all

# Other workspaces commands
yarn build    # all apps (parallel)
yarn lint     # all apps (parallel)
yarn test     # all apps (parallel)
```

---

## 11. Path Aliases

`@shared` is a Vite alias and TypeScript `paths` entry in each app — it resolves to the shared package root.

**vite.config.ts** (all three apps):
```ts
resolve: {
  alias: {
    "@shared": resolve(__dirname, "../../packages/shared"),
  },
},
```

**tsconfig.json** (all three apps):
```json
"paths": {
  "@shared/*": ["../../packages/shared/*"]
}
```

Usage in code uses the `src/` subdirectory explicitly:
```ts
import { useTranslations } from "@shared/src/hooks/useTranslations";
import { highlightKeys } from "@shared/src/data/homepage.data";
```

---

## 12. Measurement Infrastructure (planned)

| Tool | Purpose | Output location |
|---|---|---|
| Lighthouse CI (3 runs, median) | Core Web Vitals, performance score | `docs/results/<date>/` |
| source-map-explorer | JS bundle composition | `docs/bundles/` |
| Playwright + @axe-core/playwright | Automated a11y per app | `docs/a11y-checklist.md` |
| Manual NVDA + WCAG 2.1 AA checklist | Assistive technology testing | `docs/a11y-checklist.md` |
