# PROJECT.md

Operating manual for the `lib-compare-react` thesis project. Rules, roadmap, parity requirements, and AI guidance.

---

## 1. Thesis Goal

Build the same dashboard application three times — once with MUI v7, once with Ant Design v5, once with Chakra UI v3 — using identical UX, data, and routing. Measure each implementation against a fixed set of criteria (performance, accessibility, developer experience, ecosystem, theming/i18n) and produce a scored comparison for a bachelor's thesis. Timeline: one focused week.

---

## 2. The Golden Rule

> Every feature must exist in all three apps with identical UX, props, and behavior. There are no exceptions.

---

## 3. Evaluation Weights

| Criterion | Weight |
|---|---|
| Performance & Bundle Size (Core Web Vitals, Lighthouse CI, source-map-explorer) | 30% |
| Accessibility (WCAG 2.1 AA, axe-core, NVDA, keyboard navigation) | 25% |
| Developer Experience (TypeScript quality, API consistency, documentation) | 22% |
| Theming & Customization (token depth, overrides, dark mode, slot APIs) | 12% |
| Ecosystem & Community (component count, npm downloads, GitHub activity) | 8% |
| Internationalization (RTL support, locale formatting, translation integration) | 3% |

Scoring: 1–10 per criterion × weight → overall score per library.

See `docs/metrics/metrics_first_iteration.md` for full rationale.

---

## 4. Development Roadmap

### Phase 1 — Foundation (COMPLETE)
- [x] Monorepo setup, yarn workspaces
- [x] `packages/shared` with translations + data hooks
- [x] Homepage in all 3 apps with parity
- [x] Type-safe translation system (`useTranslations`)

### Phase 2 — Feature Build (COMPLETE)
- [x] `tokens.json` + theme adapters (all 3 apps)
- [x] Routing setup (`react-router-dom` in all 3 apps)
- [x] Shared types for Dashboard data and Kanban items (`packages/shared/src/types/`)
- [x] Shared data fixtures (200+ table rows, 60-day time series) in `packages/shared/src/data/`
- [x] Install shared utility deps in all 3 apps: `@tanstack/react-table`, `@dnd-kit/core`, `recharts`
- [x] Dashboard page: KPI cards, filterable/sortable table, line + bar charts
- [x] Kanban page: DnD columns (Todo / In Progress / Done), card edit modal

### Phase 3 — Measurement (COMPLETE)
- [x] `docs/versions.md` — pin exact library versions at time of measurement
- [x] `docs/measurement-protocol.md` — sub-criteria definitions and measurement steps
- [x] `docs/a11y-checklist.md` — WCAG 2.1 AA + screen reader checklist (all parts filled)
- [x] Lighthouse CI configuration (`lighthouserc.json`) + `@lhci/cli` installed; 2 runs completed
- [x] Bundle analysis (`rollup-plugin-visualizer`) — results in `docs/bundles/summary.md`
- [x] axe-core automated scans (`@axe-core/cli`, 9 URLs) → `docs/results/2026-03-04/axe-summary.md`
- [x] WCAG 2.1 AA manual checklist — all 10 sections completed across all 3 apps
- [x] VoiceOver screen reader spot-check — Part 3 of `docs/a11y-checklist.md` filled
- [x] DX measurement (TypeScript misuse tests, API consistency, docs research) → `docs/results/2026-03-04/dx-evidence.md`
- [x] Theming & Customization measurement → `docs/results/2026-03-04/theming-evidence.md`
- [x] Ecosystem & Community measurement → `docs/results/2026-03-04/ecosystem-evidence.md`
- [x] Internationalization measurement → `docs/results/2026-03-04/i18n-evidence.md`
- [ ] React Profiler interaction benchmark scripts (deferred — TBT used as proxy)

### Phase 4 — Results & Documentation (current focus)
- [x] Run all measurements, store artifacts in `docs/results/2026-03-04/`
- [x] Synthesize comparison table → `docs/thesis/results-chapter.md`
- [ ] Write remaining thesis chapters (a11y, DX, theming, ecosystem, i18n)
- [ ] Final README update

---

## 5. Parity Rules

These block any work that violates them:

- Never implement a feature in 1 or 2 apps — always all 3 in the same session.
- Same route paths across all apps.
- Same component prop interfaces (library-neutral, defined in `packages/shared/src/types/` or per-page).
- Same non-UI dependencies across all apps (`@dnd-kit`, `recharts`, `@tanstack/react-table`).
- Never add a dependency to one app without adding it to all three.
- No library-specific UX choices or workarounds that change the user-facing behavior.
- If one library lacks a feature, document it below under **Known Parity Gaps**.

---

## 6. Shared Package Rules

**What goes in `packages/shared/src/`:**

| Directory | Contents |
|---|---|
| `data/` | All mock fixtures and data arrays |
| `lang/` | All translation JSON files + type exports |
| `hooks/` | Shared hooks (`useTranslations`, and any cross-app hooks) |
| `types/` | TypeScript interfaces for data models (`DashboardRow`, `KanbanCard`, etc.) |
| `theme/tokens.json` | Design tokens only — no library-specific code |

**What stays per-app:**

- Theme adapters (`src/theme/`)
- Library-specific component wrappers
- Page layout using library components

---

## 7. Coding Standards

- TypeScript strict mode everywhere; no `any` types.
- Arrow function components: `const Foo = () => { ... }; export default Foo;`
- Props interface named `interface Props` — not exported unless a parent component explicitly requires it.
- All return statements use curly brackets on separate lines — no single-line guard returns.
- No hardcoded colors, spacing, or font values — use tokens and theme adapters.
- Imports grouped: React → UI library → `@shared` → local relative.
- Use `@shared` alias in all import paths; never use relative `../../packages/shared` paths from inside apps.

---

## 8. Claude (AI) Rules for This Project

### At the start of each session

1. Read `DOCUMENTATION.md` — understand current architecture and patterns.
2. Read `PROJECT.md` roadmap — identify the next unchecked item in Phase 2.
3. Check `packages/shared` for any data or type definitions needed before implementing.

### When implementing any feature

1. Implement in **all 3 apps in the same session** — one `PLAN.md` covers all three.
2. Add data/types to `packages/shared` first, then implement in apps.
3. Keep component prop interfaces identical across all 3 apps (library-neutral).
4. Never add a dependency to one app without adding it to all three.
5. Use `@shared/src/...` imports, not relative paths.

### Prompting pattern for parity work

> "Implement [feature] for dashboard-antd that matches the props and behavior of the MUI version at `apps/dashboard-mui/src/[path]`. Use AntD tokens from the theme adapter and keep identical DOM roles and aria attributes."

### When guiding the user through measurement tasks

- **Never let required steps be skipped.** If a checklist item requires data the user hasn't provided, stop and explicitly ask for it before moving on.
- If the user gives an incomplete answer (e.g. checks one app but not all three, skips a route, avoids a tool), call it out directly and ask for the missing information.
- If the user asks "do I have to do this?" about a required measurement step — the answer is always yes. Explain why and guide them through it.
- Do not fill in checklist items with assumptions or axe-derived data when the item explicitly requires manual observation.

---

## 9. Definition of Done (per feature)

- [ ] Feature exists in all 3 apps
- [ ] Props interface is identical (library-neutral)
- [ ] All strings use `useTranslations()` — no hardcoded copy
- [ ] Data comes from `packages/shared/src/data/`
- [ ] No hardcoded colors or spacing values
- [ ] `yarn lint` passes with zero errors
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Feature is manually navigable by keyboard
- [ ] Translation keys added to the relevant JSON files in `packages/shared/src/lang/`

---

## 10. Known Parity Gaps

_(Document unavoidable library differences here as they are discovered.)_

---

## 11. Out of Scope

- No SSR, server code, or API integration
- No library-specific premium or add-on components
- No Redux / Zustand — use local state + shared fixtures
- No custom design system beyond tokens and adapters
- No ad-hoc polyfills unless applied to all three apps
