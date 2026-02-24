Project Overview & Reconstruction

1. Project Overview
   This is a comparative thesis monorepo that implements the same reference web application three times using Material UI (MUI), Ant Design (antd), and Chakra UI. The goal is to evaluate and benchmark these three popular React UI libraries side-by-side under identical conditions—same features, same data, same UX flow—to measure differences in performance, accessibility, bundle size, and developer experience. By housing all three implementations in a single workspace with shared data/translations/types, you can objectively compare library trade-offs and document best practices for teams deciding which library to adopt. The monorepo enables rapid iteration: when you update shared fixtures or add a new screen, all three implementations inherit the change, forcing true feature parity and making benchmarking reproducible.

2. What This Repo Likely Contains
   Monorepo workspace using pnpm with separate apps for each UI library (evidence: pnpm-workspace.yaml, root package.json)
   Three standalone dashboard apps: dashboard-mui, dashboard-antd, dashboard-chakra (each a separate Vite + React + TS build)
   Shared packages:
   shared — common data fixtures, TypeScript types, translations (i18n), theme tokens (evidence: rules.md mentions shared-data, shared-theme)
   packages/benchmark-runner (assumption) — measurement utilities or scripts for Lighthouse CI, bundle analysis, a11y tests
   Common tooling: ESLint, Prettier, TypeScript config, GitHub Actions workflows for CI/build/test
   Documentation:
   docs — measurement protocol, raw results (CSV/JSON from Lighthouse, bundle reports)
   rules.md — contribution guidelines, feature parity rules, accessibility checklist
   Component parity: Each app implements the same screens (e.g., Homepage, Dashboard, Mini-Kanban) using library-specific APIs but identical UX
   i18n + theming: Centralized translation files (JSON) and design tokens; each library has an adapter to map tokens to its theme engine (evidence: Homepage using useTranslations("homepage"), MUI/AntD/Chakra pages pulling from shared lang files)
3. Reconstructed "Original Instructions" (Reusable Prompt)
   Prompt: React UI Library Benchmark Monorepo (Chakra / Antd / MUI)
   Goal:
   Create a monorepo thesis project that implements one identical reference application three times—once in Material UI (MUI), once in Ant Design (antd), and once in Chakra UI. The monorepo must enforce strict feature parity across all three implementations so that performance, accessibility, and bundle-size measurements are fair and reproducible.

Success Criteria:

All three apps render the same screens with identical UX and data.
Shared data (fixtures, types, translations, design tokens) live in packages and are imported by all apps.
Each app builds independently with its own Vite config.
Lighthouse CI, bundle-size analysis, and a11y tests (axe + Playwright) run consistently across all three.
Code is English-only; no library-specific workarounds that break parity.
Monorepo Structure:

Tech Stack (All Apps):

Build: Vite 5+, React 19+, TypeScript 5.6+
Package Manager: pnpm 9+
Linting: ESLint 9+ (shared config in root)
Formatting: Prettier 3+
Type Safety: TypeScript with strict mode
i18n: Flat JSON translation files in lang, loaded via useTranslations() hook
Theming: Design tokens (JSON) in packages/shared/src/theme/tokens.json; each app provides an adapter (e.g., muiTheme.ts, antdTheme.ts, chakraTheme.ts)
Shared Utilities: Table (@tanstack/react-table), DnD (@dnd-kit/core), Charts (recharts via wrapper)
Testing: Vitest (unit), Playwright (e2e + a11y)
Measurement: Lighthouse CI, source-map-explorer (bundle), @axe-core/playwright (a11y)
UI Library Scope (Chakra / Antd / MUI):

Each app must implement the following identically (same props, behavior, UX flow):

Core Components: Button, Input, Select, Modal, Tabs, Drawer, Card, Breadcrumbs
Data Components: Table (sortable/filterable), Pagination, Toast/Alert
Forms: Input fields, Select, validation feedback, required indicators
Layout: Container, Grid, Stack/Flex, Divider
Kanban (if applicable): Draggable cards, columns, edit modal (using shared @dnd-kit/core)
Shared Components & Design Tokens Requirements:

packages/shared/src/data/: Mock fixtures (e.g., 200+ table rows, 60-day time-series for charts)
packages/shared/src/lang/: JSON translation files (namespace-based, type-safe via TranslationKey type)
packages/shared/src/theme/tokens.json: Color, spacing, radius, typography tokens (dark theme assumed)
Adapters in each app:
apps/dashboard-mui/src/theme/muiTheme.ts → converts tokens to MUI Theme object
apps/dashboard-antd/src/theme/antdTheme.ts → converts to AntD ConfigProvider config
apps/dashboard-chakra/src/theme/chakraTheme.ts → converts to Chakra theme object
Theming Requirements:

Single source of truth: packages/shared/src/theme/tokens.json
Each app theme adapter must map all tokens (colors, radius, spacing, fonts) to its library's API.
No hardcoded colors or values in component files; always pull from tokens or library theme.
Dark theme default (assumption: CSS prefers-color-scheme: dark or explicit theme toggle if mentioned).
Routing & Page Requirements:

Minimum pages (same routes in all three apps):

/ (Home) — intro, highlights, CTA buttons
(Assumption) /dashboard — KPI cards, filterable table, charts
(Assumption) /kanban — draggable board with 3 columns
Route names must match across all three apps (same path strings, same component structure).

State/Data Layer Requirements:

No server/API: Use mock data from data.
State management: (Assumption) React Context + hooks or local state; no Redux/Zustand unless specified.
Shared types: packages/shared/src/types/ contains TypeScript interfaces for Dashboard data, Kanban items, etc.
Accessibility & i18n Requirements:

Accessibility (WCAG 2.1 AA):

Keyboard navigation (focus visible, no traps).
Semantic HTML (landmarks, roles, names).
Form labels linked, errors announced.
Color contrast ≥ 4.5:1 body, ≥ 3:1 large text.
Tests: Playwright + @axe-core/playwright for automated checks; manual WCAG+NVDA checklist in docs/a11y-checklist.md.
i18n:

All UI copy in English (assumption: thesis scope is English-only; add other languages if needed).
Type-safe translations via useTranslations("namespace") hook.
Keys stored as flat strings in JSON (e.g., "homepage.intro.description").
Testing Requirements:

Unit tests (Vitest): Critical business logic, utility functions.
e2e / a11y (Playwright + axe-core): Smoke tests for each screen; a11y automated audit on Home page.
Manual: WCAG checklist per app (keyboard, screen reader, color contrast).
Run tests in CI on every push.
Linting/Formatting/TypeScript Requirements:

ESLint: Recommended config (React, @typescript-eslint); warn on any, enforce React best practices.
Prettier: Consistent formatting across all apps (shared config).
TypeScript: Strict mode, no implicit any, noEmit: true for build safety.
Commit: English-only messages; use PR template if available.
Build/CI Requirements:

Each app builds independently: pnpm --filter dashboard-mui build
CI pipeline (GitHub Actions):
Install deps (pnpm)
Lint + type-check all apps
Build all apps
Run Lighthouse CI (3 runs per app, median reported)
Collect bundle sizes (source-map-explorer or equivalent)
Run a11y tests (Playwright + axe)
Upload results as artifacts
Documentation Requirements:

README (root): Quick-start, apps overview, measurement protocol summary.
rules.md: Contribution guidelines, feature parity rules, accessibility checklist, translation conventions.
docs/measurement-protocol.md: Step-by-step for reproducible measurements.
docs/versions.md: Pin exact library versions (date as of X).
docs/a11y-checklist.md: Manual WCAG/NVDA checks per app.
docs/results/: Raw Lighthouse JSON, bundle reports, a11y results (organized by date).
Constraints & Assumptions:

All code comments in English.
No library-specific "magic" or workarounds; if one library lacks a feature, document it in rules.md.
Deterministic: Fixed Node version (≥20), locked dependency versions, reproducible builds.
Parity over polish: Correctness and fairness matter more than visual perfection.
No breaking changes to data/types without updating all three apps.

Measurement & Metrics (Iteration 1)
Status: Unfinished; deferred to later iterations. This section outlines the measurement framework for future implementation.

Measurement Priorities
Based on thesis evaluation criteria (evidence: pre-defense-presentation.md), measurements are weighted as follows:

Metric Category Weight Rationale
Performance 43% Core Web Vitals critical for SaaS dashboard responsiveness
Accessibility 28% WCAG 2.1 AA compliance + legislative requirements
Developer Experience 16% Code complexity, time-to-implement, maintainability
Ecosystem 8% Component availability, community support
Theming/i18n 5% Customization effort, localization support
