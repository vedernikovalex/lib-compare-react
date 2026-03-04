# Evaluation Criteria — Second Iteration

Refined from the first iteration. Changes documented in the final section.

AHP re-run required with a 6×6 matrix to validate CR on the new weights. Expected CR < 0.10 given the coherent rationale.

---

## Criteria, weights, and sub-dimensions

### 1. Performance & Bundle Size — 30%

| Metric | Tool | Type |
|---|---|---|
| JS bundle size — parsed bytes | source-map-explorer | Objective |
| JS bundle size — gzip bytes | source-map-explorer | Objective |
| FCP — First Contentful Paint | Lighthouse CI (3 runs, median) | Objective |
| LCP — Largest Contentful Paint | Lighthouse CI (3 runs, median) | Objective |
| CLS — Cumulative Layout Shift | Lighthouse CI (3 runs, median) | Objective |
| TBT — Total Blocking Time (INP proxy) | Lighthouse CI (3 runs, median) | Objective |
| Lighthouse Performance score | Lighthouse CI (3 runs, median) | Objective |
| React Profiler — table filter: actualDuration (ms) | React `<Profiler>` / DevTools | Objective |
| React Profiler — table filter: commit count | React `<Profiler>` / DevTools | Objective |
| React Profiler — kanban DnD move: actualDuration (ms) | React `<Profiler>` / DevTools | Objective |
| React Profiler — kanban DnD move: commit count | React `<Profiler>` / DevTools | Objective |

**Dropped:** TTI (deprecated since Lighthouse 10), INP as standalone Lighthouse metric (not reliably measurable in CI without user gestures — TBT is the proxy).

---

### 2. Accessibility — 25%

**2a. Automated (axe-core via Playwright)**

| Metric | Tool | Type |
|---|---|---|
| Critical violations count | @axe-core/playwright | Objective |
| Serious violations count | @axe-core/playwright | Objective |
| Moderate violations count | @axe-core/playwright | Objective |
| Minor violations count | @axe-core/playwright | Objective |

Collected on all 3 routes (`/`, `/dashboard`, `/kanban`).

**2b. WCAG 2.1 AA manual checklist (pass/fail per item)**

| Item | Standard |
|---|---|
| All interactive elements keyboard-operable | WCAG 2.1.1 |
| Visible focus indicators on all focusable elements | WCAG 2.4.7 |
| Color contrast ≥ 4.5:1 normal text, ≥ 3:1 large text | WCAG 1.4.3 |
| Form inputs have associated labels | WCAG 1.3.1 |
| Decorative images marked `aria-hidden` | WCAG 1.1.1 |
| Modals trap focus and return focus on close | WCAG 2.4.3 |
| Live regions announced for dynamic updates | WCAG 4.1.3 |
| Heading hierarchy is logical (h1 → h2 → h3) | WCAG 1.3.1 |
| Animations stop/reduce under `prefers-reduced-motion` | WCAG 2.3.3 (best practice at AA) |
| Touch targets ≥ 44×44px (Kanban buttons, table sort arrows) | WCAG 2.5.5 |

**2c. Screen reader spot-check (VoiceOver / NVDA — consistent OS)**

| Task | Pass/fail |
|---|---|
| Table column headers announced during keyboard navigation | — |
| Sort state (asc/desc) announced after column sort | — |
| Modal: focus trapped on open, returned to trigger on close | — |
| KPI card: value and label both announced | — |

---

### 3. Developer Experience — 22%

Scored via structured rubric: 4 sub-dimensions, each 1–10, averaged.

| Sub-dimension | What is assessed |
|---|---|
| TypeScript type quality | Discriminated props, generic APIs, IDE autocomplete reliability, quality of type errors on misuse |
| API consistency | Component structure consistency across Button / Select / Input / Modal within the library |
| Documentation quality | Completeness, accuracy, searchability, runnable examples — primary proxy for onboarding speed |
| Component API design & error feedback | Prop intuitiveness + quality of TypeScript errors and runtime warnings when a component is misused |

**Evidence requirement:** Every sub-dimension score must trace back to a documented Phase 2 observation or a reproducible test (e.g., deliberately misusing a component and recording the error message).

**Dropped:** "Onboarding & learning curve" as a standalone sub-dimension — not reproducibly assessable after the implementation is complete; covered by Documentation quality.

---

### 4. Theming & Customization — 12%

Scored via structured rubric: 4 sub-dimensions, each 1–10, averaged.

| Sub-dimension | What is assessed |
|---|---|
| Token system | First-class design token support; tokens typed and IDE-accessible |
| Customization depth | Can the full dashboard be rebranded via the theme API alone, with zero per-component CSS overrides? |
| Component variant system | Does the library have a theme-level variant API? (MUI: `variants` in `createTheme`; Chakra: recipes; AntD: none) |
| Dark mode | Built-in, token-driven; LOC count to enable; first-class vs workaround |

**Merged:** "Brand adaptation" and "Override granularity" collapsed into "Customization depth" — they answer the same question from two angles.

---

### 5. Ecosystem & Community — 8%

| Sub-dimension | Weight within criterion | Source |
|---|---|---|
| Component breadth | 50% | Official docs component count (version-pinned, date-stamped) |
| npm weekly downloads | 25% | npmjs.com at time of measurement |
| Maintainer responsiveness | 15% | Average days to close last 10 GitHub "bug" issues |
| Corporate backing | 10% | Maintainer identity, release cadence, breaking change philosophy |

**Dropped:** GitHub stars — vanity metric, does not reflect current health.
**Added:** Maintainer responsiveness (avg days to close bug issues) — direct signal for adoption risk.

---

### 6. Internationalization — 3%

| Sub-dimension | What is assessed | Method |
|---|---|---|
| RTL layout support | `dir="rtl"` at Provider level — layout mirrors correctly | Visual test |
| Locale-aware component props | Components accept a locale prop for date/number formatting | Docs check |
| Internal label overrides | Library exposes locale config to override internal labels ("Close", "No data", etc.) | Docs check + test |

---

## Changes from first iteration

| Area | Change | Reason |
|---|---|---|
| Performance | Added React Profiler benchmark (interaction render time + commit count) | Cold-load metrics near-identical with local mock data; interactions are the real differentiator |
| Performance | Removed TTI | Deprecated from Lighthouse 10 performance score |
| Performance | Removed INP as standalone Lighthouse metric | Not reliably measurable in CI; TBT is the correct proxy |
| Accessibility | Added `prefers-reduced-motion` compliance check | WCAG 2.3.3 best practice; libraries differ in handling; fast to test |
| Accessibility | Added touch target size check (≥ 44×44px) | WCAG 2.5.5; relevant for Kanban card action buttons |
| Accessibility | Clarified screen reader tool | "NVDA" replaced with "VoiceOver / NVDA — match test machine OS" |
| DX | Added "error feedback quality" to Component API design sub-dimension | Reproducible and directly observed in Phase 2; Chakra v3 errors were particularly unhelpful |
| DX | Removed "Onboarding & learning curve" as standalone | Cannot be fairly assessed post-implementation; Documentation quality covers it |
| DX | Reduced sub-dimensions from 5 to 4 | Cleaner; no loss of coverage |
| Theming | Merged "Brand adaptation" + "Override granularity" → "Customization depth" | Same question, two angles; single sub-dimension is cleaner |
| Theming | Added "Component variant system" | Key differentiator for design system adoption; MUI/Chakra/AntD differ significantly |
| Theming | Reduced sub-dimensions from 5 to 4 | Cleaner; no loss of coverage |
| Ecosystem | Removed GitHub stars | Vanity metric; does not reflect current health |
| Ecosystem | Added maintainer responsiveness (avg days to close bug issues) | Direct signal for adoption risk; observable and objective |
