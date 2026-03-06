# Accessibility — Thesis Chapter Draft

> Draft for direct use or adaptation in the thesis. All findings are based on measured data from axe-core automated scans, WCAG 2.1 AA manual evaluation, and VoiceOver screen reader testing. Tables are numbered continuing from Chapter 5.1 (last table: 5.9).

---

## 5.2 Accessibility

Accessibility is the second-highest-weighted criterion in this evaluation (25%), reflecting both legal obligations and the practical reality that a SaaS dashboard with inaccessible interactive controls excludes a meaningful segment of users. A dashboard application — with its interactive tables, drag-and-drop interfaces, modal dialogs, and dynamic data updates — exercises a broad range of WCAG requirements beyond what a static content site would. The three measurement layers are: automated scanning with axe-core, a manual WCAG 2.1 AA checklist covering ten criteria, and a VoiceOver screen reader spot-check.

### 5.2.1 Measurement Approach

Three complementary methods were used, each capturing a different class of accessibility failure:

**Automated scanning (axe-core)** detects violations that can be reliably determined from the DOM structure and computed styles alone — missing labels, contrast ratio failures, invalid ARIA patterns. It cannot detect behavioural failures such as focus management or the absence of announcements during dynamic updates.

**WCAG 2.1 AA manual checklist** covers ten criteria across all three routes per application (homepage `/`, dashboard `/dashboard`, kanban `/kanban`). Each item is evaluated as pass (P), fail (F), or not applicable (N/A). The checklist specifically targets behaviours that automated tools cannot assess: keyboard operability of every interactive element, visible focus indicators, modal focus management, live region announcements, and touch target sizing.

**VoiceOver screen reader spot-check** validates the actual user experience under assistive technology — whether column headers are announced during table navigation, whether modal field labels are read on focus, whether KPI card values are accessible to non-sighted users, and whether sort state is communicated.

All three methods were applied to production builds of all three applications served locally via `vite preview`.

### 5.2.2 Test Environment

| Variable | Value |
|---|---|
| Automated tool | axe-core 4.11.1 via `@axe-core/cli` |
| Browser (automated) | HeadlessChrome 145 |
| Screen reader | VoiceOver (macOS, Cmd+F5) |
| Browser (VoiceOver) | Safari (default VoiceOver pairing) |
| OS | macOS 26.0.1 |
| Routes tested | `/`, `/dashboard`, `/kanban` — all three apps |
| Build type | Production (`vite build` + `vite preview`) |

### 5.2.3 Shared Implementation Gaps — Excluded from Library Scoring

Three failures appear identically across all three applications and originate from shared implementation decisions rather than from any individual library. These are documented for completeness but excluded from per-library scoring.

**Nested-interactive elements (Kanban, all apps — 15 nodes each).** The `@dnd-kit` draggable wrapper receives `role="button"` and `aria-roledescription="draggable"`, and the edit button inside it is also a focusable interactive element. This creates a WCAG 4.1.2 / 1.3.1 nested-interactive violation. The axe rule fires on all three kanban pages with an identical node count (15 — one per card), confirming that the violation is a property of the shared dnd-kit integration pattern, not of any library.

**Table sort headers not keyboard-operable (Dashboard, all apps).** TanStack Table column headers in all three implementations lack `tabIndex` and keyboard event handlers, making them unreachable by Tab and inoperable without a pointing device. This is a shared TanStack Table integration gap.

**Primary brand color contrast (all apps).** `tokens.json` defines the primary brand color as `#1677ff`. Against a white background this produces a contrast ratio of 4.1:1, just below the WCAG 1.4.3 threshold of 4.5:1. This single token drives the majority of contrast violations across all three applications. The fix is library-independent — updating the token value would resolve the violation in all three apps simultaneously. It is therefore not counted as a library-specific failure.

---

### 5.2.4 Automated Results — axe-core

**Table 5.10 — axe-core violation counts by application and route (production builds)**

| Application | Route | Critical | Serious | Moderate |
|---|---|---|---|---|
| MUI | `/` | 0 | 1 | 1 |
| MUI | `/dashboard` | 0 | 2 | 1 |
| MUI | `/kanban` | 0 | 2* | 1 |
| Ant Design | `/` | 0 | 1 | 2 |
| Ant Design | `/dashboard` | 1 | 1 | 2 |
| Ant Design | `/kanban` | 0 | 2* | 1 |
| Chakra UI | `/` | 0 | 1 | 0 |
| Chakra UI | `/dashboard` | 1 | 1 | 0 |
| Chakra UI | `/kanban` | 0 | 2* | 0 |

*Serious count on `/kanban` includes 15-node `nested-interactive` violation, shared across all three apps — excluded from library scoring (see §5.2.3).

**Table 5.11 — Library-specific axe violations (shared nested-interactive excluded)**

| Violation | Impact | MUI | Ant Design | Chakra UI |
|---|---|---|---|---|
| `color-contrast` | Serious | 22 nodes (3 routes) | 82 nodes (3 routes) | 58 nodes (3 routes) |
| Unlabelled select (rows-per-page) | Critical / Serious | Serious — `aria-input-field-name` | Critical — `label` (rc-select DOM id) | Critical — `select-name` |
| `heading-order` | Moderate | 4 nodes (all 3 routes) | 2 nodes (home + dashboard) | 0 |
| `page-has-heading-one` | Moderate | 0 | 3 nodes (all 3 routes) | 0 |

#### Color contrast

The contrast violation node counts differ markedly between libraries despite sharing the same primary brand token. MUI's 22 affected nodes are almost entirely explained by the shared `#1677ff` primary color and the trend indicator green (`#52c41a` on white = 2.26:1). Ant Design accumulates 82 nodes because its default secondary text color (`#8c8c8c` on white = 3.29:1) and its built-in status palette — error red on a light red background (2.98:1), success green (2.26:1) — each independently fail, multiplying across every component instance in the application. Chakra UI's 58 nodes are driven by its zinc/slate secondary text default (`#a1a1aa` on white = 2.56:1), which is the worst secondary text contrast of the three at more than a full point below the WCAG threshold, combined with status colors in the kanban badge palette.

#### Unlabelled select control

All three applications fail to provide an accessible name for the table filter select control on the dashboard route, but each library's DOM representation triggers a different axe rule. Ant Design's `rc-select` component generates an internal DOM id (`#rc_select_0`) with no label, no `aria-label`, and no `aria-labelledby` — axe classifies this as critical under the `label` rule. Chakra UI uses a native `<select>` element with no accessible name — critical under `select-name`. MUI uses a custom `MuiSelect` with no associated aria attribute — serious under `aria-input-field-name`. Critically, MUI's violation is classified as serious rather than critical because `MuiSelect` does carry implicit role and state information; the other two provide no accessible name at all. The root cause in all three cases is an identical implementation gap in the project code, not a library default.

#### Heading structure

Chakra UI produces zero heading violations across all three routes. Its `Heading` component renders the semantically correct HTML heading element by default, and the application's heading hierarchy is logically structured throughout. MUI produces `heading-order` violations on all three pages (4 nodes total), caused by MUI typography variants (`subtitle1`, `subtitle2`, `h6`) being used as decorative headings outside a logical heading flow — a pattern that MUI's typography API makes easy to fall into because the variant and semantic role are decoupled. Ant Design produces the worst heading profile: `heading-order` violations on the homepage and dashboard, combined with `page-has-heading-one` failures on all three routes. Ant Design's layout pattern does not emit an `<h1>` by default, requiring explicit placement by the developer; this was not done in the implementation, leaving all three pages without a top-level heading.

**Table 5.12 — axe severity-weighted penalty scores (nested-interactive excluded)**

Penalty formula: critical violation = 3 pts, serious = 2 pts, moderate = 1 pt. Lower penalty = fewer library-attributable violations.

| Library | Critical (×3) | Serious (×2) | Moderate (×1) | Total penalty |
|---|---|---|---|---|
| MUI | 0 | 4 (contrast ×3, aria-input ×1) | 4 (heading-order ×4) | **12** |
| Chakra UI | 1 (select-name) | 3 (contrast ×3) | 0 | **9** |
| Ant Design | 1 (label) | 3 (contrast ×3) | 5 (heading-order ×2, page-h1 ×3) | **14** |

Chakra UI achieves the lowest penalty despite having a critical violation, because MUI accumulates additional moderate violations from heading-order failures across all three pages. Ant Design's penalty is the highest at 14: equal on critical and serious violations to Chakra, but with five additional moderate points from pervasive heading structure failures.

---

### 5.2.5 WCAG 2.1 AA Manual Checklist

Ten criteria were evaluated across all three routes per application. The results below summarise key findings per criterion; shared failures (see §5.2.3) are noted but do not influence library scoring.

**1.1 Keyboard Navigation (WCAG 2.1.1).** Navigation links are reachable and operable by Tab in all three applications. Ant Design's navigation uses the WAI-ARIA menubar pattern (Tab focuses the menu as a whole; arrow keys move between items) — this is a correct ARIA implementation, though less intuitive than the Tab-based navigation used in MUI and Chakra. Table sort headers (shared TanStack gap) and the Kanban edit button (shared dnd-kit gap) fail in all three applications.

**1.2 Visible Focus Indicators (WCAG 2.4.7).** All three applications display clearly visible focus rings on every reachable interactive element. This criterion passes universally.

**1.3 Color Contrast (WCAG 1.4.3).** Body text, navigation links, table content, and KPI card values pass in all three applications. The shared primary token failure (#1677ff = 4.1:1) causes button label and trend indicator failures across all apps. Additionally: Ant Design's secondary text (#8c8c8c = 3.29:1) and Chakra UI's secondary text (#a1a1aa = 2.56:1) each fail independently of the shared token. MUI's muted text passes.

**1.4 Form Input Labels (WCAG 1.3.1).** The dashboard table search field uses a visible placeholder ("Search products...") without a programmatically associated `<label>` — this fails in all three applications. The rows-per-page select has a visible label but no `htmlFor`/`aria-labelledby` association — also fails in all three.

**1.5 Decorative Images (WCAG 1.1.1).** MUI and Ant Design render trend arrows and sort direction indicators as SVG elements with `aria-hidden="true"` — correctly hidden from screen readers. Chakra UI renders these as Unicode characters (`↑`, `↓`) without `aria-hidden`, meaning screen readers announce "upwards arrow" and "downwards arrow" for every KPI card value and every table column header.

**1.6 Modal Focus Management (WCAG 2.4.3).** This criterion produces the sharpest differentiation between the three libraries.

**Table 5.13 — Modal focus management (WCAG 2.4.3) — Kanban edit modal**

| Behaviour | MUI | Ant Design | Chakra UI |
|---|---|---|---|
| Focus moves into modal on open | Pass | **Fail** | Pass |
| Focus trapped inside modal (Tab cycles within) | Pass | **Fail** | **Fail** |
| Escape key closes modal | Pass | Pass | Pass |
| Focus returns to trigger element on close | Pass | **Fail** | **Fail** |
| **Score** | **4 / 4** | **1 / 4** | **2 / 4** |

MUI's `Dialog` component implements all four focus management behaviours correctly by default — focus placement on open, Tab cycling within the modal, and focus return to the trigger on close. This is library-provided behaviour that required no additional code.

Ant Design's `Modal` component does not place focus inside the modal on open. The user must manually Tab from the browser's default focus position to reach modal content. All subsequent focus management is therefore not applicable. Only the Escape key close behaviour passes.

Chakra UI's modal is implemented as a positioned `Box` overlay — a workaround necessitated by `DialogContentProps` TypeScript incompatibility with TypeScript 5.9 (see §5.4, DX chapter). Focus is placed inside the overlay on open, but Tab key presses escape to browser chrome and `Shift+Tab` reaches elements behind the overlay. There is no focus trap and focus is not returned to the trigger on close.

**1.7 Live Regions / Dynamic Updates (WCAG 4.1.3).** `aria-sort` attributes are present and correctly updated on all sortable column headers in all three applications — screen readers receive correct ascending/descending state. However, no `aria-live` region is present near the table search field in any application, meaning changes to the filtered row count are not announced when a user types in the search box.

**1.8 Heading Hierarchy (WCAG 1.3.1).** Chakra UI passes on all three routes with zero heading violations. MUI fails on all three routes due to `heading-order` violations caused by typography variants used decoratively. Ant Design fails on all three routes for two distinct reasons: `heading-order` violations on homepage and dashboard, and the absence of any `<h1>` element on any page.

**1.9 Reduced Motion (WCAG 2.3.3).** With `prefers-reduced-motion: reduce` enabled via macOS System Preferences, no application suppressed animations. Ant Design's modal open/close animation continued to play — a library-specific failure, as MUI and Chakra have no modal animation to suppress. The dnd-kit drag card-count animation persisted in all three applications — a shared implementation issue.

**1.10 Touch Target Size (WCAG 2.5.5).** The Kanban card edit button — the smallest interactive control in any of the three applications — measured 23.98 px in MUI, 23.99 px in Ant Design, and 32 px in Chakra UI. All fall below the WCAG 2.5.5 minimum of 44×44 px. This is a shared implementation gap; none of the three libraries impose a minimum touch target size by default.

---

### 5.2.6 Screen Reader Spot-Check — VoiceOver

**Table 5.14 — VoiceOver spot-check results (macOS VoiceOver, production builds)**

| Task | MUI | Ant Design | Chakra UI |
|---|---|---|---|
| Table column headers announced | Pass | **Fail** * | Pass |
| Sort state announced after column sort | **Fail** † | **Fail** † | **Fail** † |
| KPI card value and label announced | Pass ‡ | Pass ‡ | Pass ‡ |
| Kanban modal: text field label announced on focus | Pass (+ "required") | **Fail** | Pass |
| Kanban modal: select label announced on focus | **Fail** | **Fail** | Pass |

\* Ant Design: the table is not reachable by Tab navigation (see §5.2.5, 1.1). Column headers cannot be reached via keyboard.
† All apps: TanStack Table sort direction indicators are not `aria-hidden` and are announced as "angle quotation mark" by VoiceOver. Sort state change is not announced. Shared implementation gap.
‡ KPI cards are non-interactive elements not reachable by Tab — correct behaviour. Reachable via VoiceOver browse mode (VO+Arrow); value and label both announced correctly in all three apps.

#### KPI cards

KPI cards pass across all three applications. As non-interactive elements, they are not part of the Tab order — this is correct. VoiceOver's browse mode (VO+Arrow) reaches them and announces both the metric value and label without intervention. No library-specific issue was found.

#### Kanban modal field label announcement

The modal field label results reveal a meaningful library-level difference in how each component API handles label association by default.

MUI's `TextField` component automatically generates a `<label>` element with a `htmlFor` attribute that matches the input's generated `id`. When VoiceOver focuses the Title input, it announces: "Title, text field, required" — the label, the role, and the required state, all provided by the library with zero additional code. The Priority `Select` field does not announce its label because `FormControl > InputLabel > Select` requires an explicit `labelId` prop on `<Select>` to wire the association — this prop was not provided, revealing that MUI's two-component form pattern is less automatic than `TextField`.

Ant Design's `Form.Item label="Title"` renders a visual `<label>` element, but the association between the label and the input depends on the `name` prop being set on `Form.Item` and a matching `id` on the `Input` — neither was set in the implementation. As a result, VoiceOver announces only the current field value ("Untitled" or "Medium") with no field name. This is a library DX issue: MUI's `TextField` encapsulates label association automatically; AntD's `Form.Item + Input` pattern externalises the responsibility to the developer.

Chakra UI's modal uses plain HTML `<label htmlFor="edit-title">` elements with matching `id` attributes on each input — a workaround necessitated by `Field.Label`'s TypeScript 5.9 incompatibility. VoiceOver announces the label for every field including the `NativeSelect` priority control, which received the correct `htmlFor` association. All five fields pass. The correct result here is a consequence of our implementation using standard HTML semantics, not a native library capability — Chakra's composable `Field.Label` was not usable due to the type system regression.

---

### 5.2.7 Analysis

The accessibility measurement reveals two distinct failure modes attributable to individual libraries, alongside a shared baseline of implementation gaps common to all three applications.

**The shared baseline.** The dnd-kit nested-interactive violation, TanStack Table keyboard gap, primary color contrast failure, unlabelled form selects, missing `aria-live` regions, and below-minimum touch targets affect all three applications identically. These failures reflect implementation choices made at the project level — not structural properties of the UI libraries — and are therefore treated as a fixed floor that all three libraries share. The differentiated scores reflect only what lies above this floor.

**MUI's defining strength: modal focus management.** WCAG 2.4.3 (Focus Order, Level AA) is a behavioral criterion that tests whether a library's modal implementation is accessible by keyboard without developer intervention. MUI's `Dialog` achieves a perfect 4/4 score: focus placement on open, Tab containment within the dialog, Escape to close, and focus return to the trigger. These behaviors are built into the component. The heading-order failures across all three pages are MUI's main library-specific debit — the typography system's decoupling of visual variant from semantic role (e.g., `variant="h6"` and `component="h2"` are independent props) creates a pattern where developers commonly render decorative headings without the correct semantic element, breaking the heading hierarchy.

**Chakra UI: best document structure, weakest modal.** Chakra UI's heading system is the most structurally sound of the three — zero violations across all nine audited pages. Its composable `Heading` component defaults to semantically correct elements, producing a document outline that a screen reader user can navigate efficiently. However, the modal focus trap failure is a significant gap: a user navigating by keyboard inside the modal can Tab out to the browser chrome, and keyboard focus is not returned to the trigger element on close. These failures are partly attributable to the implementation workaround (Box overlay) that was necessitated by Chakra v3's TypeScript 5.9 incompatibility with `DialogContentProps` — a library regression that forced the project away from the standard modal component. The secondary text default (`#a1a1aa` = 2.56:1) and Unicode sort/trend indicators announced by VoiceOver are library-specific defaults that add unnecessary noise.

**Ant Design: the most barriers.** Ant Design accumulates the most library-attributable accessibility failures. The modal focus management failure is the most consequential: focus never moves inside the modal on open, effectively making the edit workflow inaccessible to keyboard-only users without any workaround from the developer's side. The absence of a top-level `<h1>` on all three routes is a default property of Ant Design's layout — the library does not produce one automatically, and the developer must know to add it explicitly. The contrast failure affecting 82 nodes — compared to 22 for MUI — reflects Ant Design's default secondary text and status palette colors, both of which independently fail WCAG 1.4.3.

---

### 5.2.8 Summary

**Table 5.15 — Accessibility criterion summary**

| Differentiator | MUI | Ant Design | Chakra UI |
|---|---|---|---|
| axe penalty score (library-specific, nested-interactive excl.) | 12 pts | 14 pts | 9 pts |
| Modal focus management (WCAG 2.4.3) | 4 / 4 | 1 / 4 | 2 / 4 |
| Heading structure (WCAG 1.3.1) | Fails — all routes | Fails — all routes + no h1 | Passes — all routes |
| Secondary text contrast | Passes | Fails (3.29:1) | Fails (2.56:1) |
| Decorative icons | aria-hidden SVGs | aria-hidden SVGs | Unicode — announced by SR |
| VoiceOver: modal field labels | Pass (text fields) | Fail (all fields) | Pass (all fields) |
| Critical violations | 0 | 1 | 1 |

**Proposed criterion score (Accessibility, weight 25%):**

| Library | Score (1–10) | Rationale |
|---|---|---|
| MUI | **7** | Perfect modal focus management (WCAG 2.4.3 — the most critical behavioral requirement tested); zero critical violations; fewest contrast-affected nodes (22); TextField auto-associates labels, providing correct VoiceOver announcements without extra code. Primary debit: heading-order failures across all three routes caused by the typography API decoupling variant from semantic element. |
| Chakra UI | **6** | Best document structure of the three — zero heading violations across all routes; fewest axe penalty points (9); correct VoiceOver field label announcements via HTML label association. Debits: modal focus trap absent and focus not returned on close (partly caused by v3 TypeScript regression forcing a Box overlay workaround); Unicode sort/trend indicators announced by VoiceOver; secondary text default (#a1a1aa) = 2.56:1 — the worst secondary contrast of the three. |
| Ant Design | **5** | Most library-attributable failures. Modal focus never enters on open — a Level AA keyboard accessibility failure (WCAG 2.4.3) that renders the edit workflow inaccessible to keyboard-only users. No `<h1>` on any page by default. Worst axe penalty (14 pts). VoiceOver announces no field labels in the modal because `Form.Item label` without `name` prop produces no programmatic label association. Most contrast-affected nodes (82) due to library-default secondary text and status color palette failures. |

---

*Raw axe-core JSON outputs stored in `docs/results/2026-03-04/`. Full WCAG checklist and VoiceOver results in `docs/a11y-checklist.md`. axe scan script at `scripts/axe-scan.mjs`.*
