# Measurement Protocol

How each evaluation criterion is measured. This document is the authoritative reference for Phase 3.

All measurements apply equally to all three apps. Results are stored in `docs/results/<YYYY-MM-DD>/`.

---

## 1. Performance & Bundle Size — 30%

### 1a. Bundle Size (static analysis)

**Tool:** `source-map-explorer`

**Steps:**
1. Build each app in production mode: `yarn workspace dashboard-<name> build`
2. Run `npx source-map-explorer dist/assets/*.js --html docs/bundles/<name>.html`
3. Record: total parsed size (bytes), gzip size (bytes), library code vs. app code vs. shared breakdown

**Score input:** Smaller bundle = higher score. Score relative to the range across all three libraries.

### 1b. Core Web Vitals (cold load)

**Tool:** Lighthouse CI (`lighthouserc.json`)

**Steps:**
1. Serve each production build locally via `vite preview` on its standard port (3001/3002/3003)
2. Run Lighthouse CI 3 times per app, take the median
3. Collect all three routes: `/`, `/dashboard`, `/kanban`
4. Record: FCP (ms), LCP (ms), CLS (unitless), TBT (ms), Lighthouse Performance score (0–100)
5. Store raw JSON reports in `docs/results/<date>/<app-name>/lighthouse/`

**Note on INP:** Lighthouse CI cannot reliably measure INP because it requires real user gestures. TBT is the Lighthouse proxy for INP and is used here. Actual interaction responsiveness is captured separately in 1c below.

**Note on TTI:** TTI was removed from the Lighthouse performance score in Lighthouse 10 and is deprecated. Do not include it.

**Environment controls:**
- Same machine, no other browser tabs open
- Lighthouse Desktop profile (no network throttling — all data is local mock)
- Chrome: latest stable, incognito mode

### 1c. Interaction Performance (React Profiler benchmark)

**Tool:** React `<Profiler>` component (production profiling build) or React DevTools Profiler

**Rationale:** Cold-load metrics will be near-identical across all three apps because data is local mock. Interaction performance — how fast the app responds to user actions — is what actually differentiates mature UI libraries in practice.

**Benchmark interactions (same two interactions in all three apps):**

1. **Table filter:** Type a filter string into the dashboard table search input. Measure total render time and commit count from keypress to stable paint.
2. **Kanban DnD move:** Drag a card from one column to another and drop it. Measure total render time and commit count from drag-start to drop-complete.

**Steps:**
1. Wrap the Dashboard page and Kanban page in a `<Profiler id="..." onRender={...}>` with logging to console
2. Build with `--mode profiling` (Vite) to enable the production profiler
3. Perform each benchmark interaction 3 times, record the median `actualDuration` (ms) and commit count
4. Record results in `docs/results/<date>/profiler-benchmark.md`

**Score input:** Lower total render time and fewer commits = higher score.

---

## 2. Accessibility — 25%

### 2a. Automated axe-core scan

**Tool:** `@axe-core/playwright` via Playwright test

**Steps:**
1. Write a Playwright test that navigates to each route (`/`, `/dashboard`, `/kanban`) in each app
2. On each page run `checkA11y()` and capture: violations (critical/serious/moderate/minor), incomplete items
3. Store full JSON reports in `docs/results/<date>/<app-name>/axe/`
4. Record summary: total violations by severity

**Score input:** Fewer violations = higher score. Critical/serious violations penalize more than moderate/minor.

### 2b. WCAG 2.1 AA manual checklist

**Tool:** Manual review against `docs/a11y-checklist.md`

**Checklist items:**
- All interactive elements reachable and operable by keyboard alone
- Visible focus indicators on all focusable elements
- Color contrast ≥ 4.5:1 for normal text, ≥ 3:1 for large text (verify with browser DevTools color picker)
- Form inputs have associated labels
- Images have alt text (or are decorative with `aria-hidden`)
- Modals trap focus and return focus on close
- Live regions announced correctly for dynamic updates (table filters, DnD status)
- Headings follow logical hierarchy (h1 → h2 → h3)
- **`prefers-reduced-motion` compliance:** enable reduced motion at the OS level; navigate the dashboard and kanban pages; verify entrance animations, DnD drag animations, and modal transitions stop or reduce. Pass/fail per app.
- **Touch target size:** verify that Kanban card action buttons and table sort arrows meet the 44×44px minimum (WCAG 2.5.5). Check in browser DevTools computed size. Pass/fail per app.

**Steps:**
1. Work through checklist for each app on each route
2. Record pass/fail per item in `docs/a11y-checklist.md`
3. Tally pass rate per app

**Score input:** Pass rate (%) on the checklist.

### 2c. Screen reader spot-check

**Tool:** VoiceOver (macOS) or NVDA (Windows) — use whichever matches the test machine OS; be consistent across all three apps

**Scope:** Dashboard page only (most complex interaction surface)

**Spot-check tasks:**
1. Navigate to table via keyboard — does the screen reader announce column headers?
2. Sort a table column — is the sorted state (ascending/descending) announced?
3. Open and close a Kanban card edit modal — is focus managed correctly?
4. Read a KPI card — are the value and label both announced?

**Score input:** Pass/fail per task, recorded as notes in `docs/a11y-checklist.md`. Failures subtract from the manual checklist pass rate.

---

## 3. Developer Experience — 22%

DX is scored via a structured rubric. Each sub-dimension is scored 1–10, then averaged. Scores must trace back to documented evidence from Phase 2 implementation.

### Sub-dimensions (4)

| Sub-dimension | Description |
|---|---|
| TypeScript type quality | Discriminated props, generic APIs, IDE autocomplete reliability. Does hovering a component show useful props? Does the IDE suggest valid values for union types? |
| API consistency | Are similar components (Button, Select, Input, Modal) structured consistently within the library? Are patterns transferable across the component set? |
| Documentation quality | Is official documentation complete, accurate, and searchable? Are code examples runnable? This is the primary proxy for onboarding speed — a new developer's ramp-up time is largely determined by documentation. |
| Component API design & error feedback | Are props intuitive? When a component is misused (wrong prop type, missing required prop), how specific and helpful is the TypeScript error or runtime warning? Score both the API design and the feedback quality together. |

**Note on learning curve:** "Onboarding & learning curve" was removed as a standalone sub-dimension. After implementing all three libraries, it cannot be fairly assessed as a first-time-user experience. Documentation quality captures the same signal more reproducibly.

### Evidence sources

- Implementation notes from Phase 2 (see below)
- Deliberately misuse one component in each library; capture the TypeScript error message and runtime console warning; score specificity and helpfulness
- Direct comparison of TypeScript type definitions for equivalent components (Button, Modal, Select)

### Phase 2 implementation observations (pre-scored evidence)

**Chakra v3:**
- `FieldLabelProps` and `DialogContentProps` have type incompatibilities with TypeScript 5.9 — `children` prop not directly usable. TypeScript error messages in these cases are generic type cascade errors, not actionable guidance. Workarounds required: plain `<label>` elements, Box overlays.
- Button's `as` prop for polymorphic rendering does not work in v3; no clear runtime warning.
- `NativeSelect` composable API works correctly.

**Ant Design v5:**
- DnD drag-handle pattern required API research beyond the official docs.
- `ConfigProvider` theme token API is consistent and well-typed.

**MUI v7:**
- `slotProps` and `sx` prop system well-supported by IDE autocomplete.
- TypeScript errors on misuse are specific and point directly to the offending prop.

---

## 4. Theming & Customization — 12%

### Sub-dimensions (4)

| Sub-dimension | Description |
|---|---|
| Token system | Does the library have a first-class design token system (colors, spacing, typography, radius)? Are tokens typed and accessible in the IDE? |
| Customization depth | Merged from "override granularity" and "brand adaptation": can the entire dashboard be rebranded — colors, typography, component internals — purely through the theme API, with zero per-component style overrides? Test by applying `tokens.json` values via each theme adapter and checking whether any component requires a direct CSS override to match. |
| Component variant system | Does the library have a first-class API for defining reusable component variants at the theme level? MUI: `variants` inside `createTheme` component overrides. Chakra: recipes in `createSystem`. AntD: no dedicated variant system — overrides via token or CSS only. This is a key differentiator for teams building a design system on top of the library. |
| Dark mode | Is dark mode built-in and token-driven? Count lines of code required to toggle dark mode. Assess whether it is a first-class feature or a workaround. |

### Measurement steps

1. Implement the same custom theme on all three apps: colors from `tokens.json`, custom `border-radius`, custom font
2. For customization depth: attempt to restyle KPI card, table header, and modal purely via theme API — note any components that require a direct CSS override
3. For component variants: implement a "danger" Button variant and a "muted" Card variant using each library's theme-level variant API; note whether the API exists and how ergonomic it is
4. For dark mode: count lines required to toggle; test token propagation into all components
5. Score each sub-dimension 1–10; record evidence and LOC counts

---

## 5. Ecosystem & Community — 8%

### Sub-dimensions

| Sub-dimension | Weight within criterion | Source |
|---|---|---|
| Component breadth | 50% | Count of production-ready components in official component list (as of tested version) |
| npm weekly downloads | 25% | npmjs.com, recorded at time of testing |
| Maintainer responsiveness | 15% | Average days to close the last 10 GitHub issues labelled "bug" |
| Corporate backing | 10% | Sustained maintainer or company; breaking change philosophy and release cadence |

**Note on GitHub stars:** Removed. Stars reflect historical hype, not current health or adoption trajectory. Maintainer responsiveness (days to close bug issues) is a more meaningful signal for adoption risk assessment.

### Measurement steps

1. Count components in each library's official docs component list (note the version and date)
2. Record npm weekly downloads for the primary package (`@mui/material`, `antd`, `@chakra-ui/react`)
3. On each library's GitHub, filter closed issues labelled "bug", take the last 10, calculate average open→close time in days
4. Note corporate backing: MUI (MUI company), AntD (Ant Group / Alibaba), Chakra (Segun Adebayo / community-led)
5. Score each sub-dimension; combine to a single 1–10 score

---

## 6. Internationalization — 3%

### Sub-dimensions

| Sub-dimension | Description |
|---|---|
| RTL layout support | Does the library flip layout direction with a single config change (`dir="rtl"` or equivalent)? Are RTL styles included in the library, or does the developer need to write them manually? |
| Locale-aware component props | Do components that present locale-sensitive data (dates, numbers) accept a locale prop? Assessed via documentation check — the test app does not include date pickers, so this is a docs-level check. |
| Internal label overrides | Does the library expose a locale config to override its internal component labels (e.g., "Close", "Open", "Clear", "No data")? |

### Measurement steps

1. Apply `dir="rtl"` at the Provider level on each app; visually inspect the dashboard page for correct mirroring of layout (sidebar position, table column order, icon alignment)
2. Check each library's i18n/locale documentation for locale-aware component props
3. Check each library's locale/i18n documentation for how to override internal strings; attempt to override at least one label per app
4. Score 1–10 based on pass/fail across the three sub-dimensions; document any gaps

---

## Scoring Summary Template

| Criterion | Weight | MUI | AntD | Chakra |
|---|---|---|---|---|
| Performance & Bundle Size | 30% | — | — | — |
| Accessibility | 25% | — | — | — |
| Developer Experience | 22% | — | — | — |
| Theming & Customization | 12% | — | — | — |
| Ecosystem & Community | 8% | — | — | — |
| Internationalization | 3% | — | — | — |
| **Weighted total** | 100% | **—** | **—** | **—** |

Scores are 1–10 per criterion. Weighted total = sum(score × weight).

---

## Output Artifacts

| Artifact | Location |
|---|---|
| Lighthouse CI JSON reports | `docs/results/<date>/<app-name>/lighthouse/` |
| React Profiler benchmark results | `docs/results/<date>/profiler-benchmark.md` |
| source-map-explorer HTML reports | `docs/bundles/` |
| axe-core JSON reports | `docs/results/<date>/<app-name>/axe/` |
| WCAG / screen reader checklist | `docs/a11y-checklist.md` |
| Scoring worksheet | `docs/results/<date>/scoring.md` |
| Library versions used | `docs/versions.md` |
