# Accessibility Checklist

Manual WCAG 2.1 AA evaluation and screen reader spot-check for all three apps.

Fill this in during Phase 3 measurement. Each item is pass (P), fail (F), or not applicable (N/A).
For failures, add a brief note describing the specific issue observed.

---

## Part 1 — WCAG 2.1 AA Manual Checklist

Evaluated on all three routes per app: `/` (Homepage), `/dashboard` (Dashboard), `/kanban` (Kanban).

### 1.1 Keyboard Navigation (WCAG 2.1.1)

All interactive elements reachable and operable by keyboard alone (Tab, Shift+Tab, Enter, Space, arrow keys where applicable).

| Element / Route | MUI | AntD | Chakra |
|---|---|---|---|
| Nav links — `/` | P | P* | P |
| Nav links — `/dashboard` | P | P* | P |
| Nav links — `/kanban` | P | P* | P |
| Table sort headers — `/dashboard` | F | F | F |
| Table search input — `/dashboard` | P | P | P |
| Table pagination controls — `/dashboard` | P | P | P |
| KPI cards (if interactive) — `/dashboard` | N/A | N/A | N/A |
| Kanban card drag (keyboard DnD) — `/kanban` | P | P | P |
| Kanban card edit button — `/kanban` | F | F | F |
| Edit modal fields — `/kanban` | N/A | N/A | N/A |
| Edit modal save / cancel — `/kanban` | N/A | N/A | N/A |

Notes:
- AntD nav (*): Tab focuses the menu as a whole; arrow keys navigate individual items — correct WAI-ARIA menubar pattern, but less intuitive than Tab-based nav in MUI/Chakra. Pass with note.
- Table sort headers (all apps): TanStack Table column headers lack tabIndex and keyboard handlers — shared implementation gap, not library-specific.
- Kanban edit button (all apps): @dnd-kit draggable wrapper absorbs focus (role="button"), making the inner edit button unreachable by Tab — same nested-interactive issue flagged by axe. Shared implementation gap.

### 1.2 Visible Focus Indicators (WCAG 2.4.7)

All focusable elements display a clearly visible focus ring when navigating by keyboard.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav links | P | P | P |
| Buttons | P | P | P |
| Table sort headers | P | P | P |
| Table search input | P | P | P |
| Pagination controls | P | P | P |
| Modal form fields | N/A | N/A | N/A |
| Modal action buttons | N/A | N/A | N/A |

Notes:
- All three apps display clearly visible focus rings on all reachable interactive elements.
- Modal fields not testable via keyboard (edit button unreachable — see 1.1).

### 1.3 Color Contrast (WCAG 1.4.3)

Normal text ≥ 4.5:1, large text (≥ 18pt or ≥ 14pt bold) ≥ 3:1. Checked with browser DevTools color picker.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Body / paragraph text | P | P | P |
| Nav link text | P | P | P |
| Table cell text | P | P | P |
| Table header text | P | P | P |
| KPI card value | P | P | P |
| KPI card label | P | P | P |
| Badge / status chip text | F | F | F |
| Kanban card title | P | P | P |
| Button label text | F | F | F |
| Input placeholder text (≥ 3:1 acceptable) | P | P | P |

Notes:
- Data sourced from axe-core scan (see Part 2). Body/table/heading text passes in all three apps.
- Button label (all apps): primary `#1677ff` on white = 4.1:1 — fails 4.5:1 threshold. Root cause: shared `tokens.json` brand color.
- Badge/chip: trend green (`#52c41a` AntD/MUI, `#22c55e` Chakra) on white ≈ 2.26–2.27:1 — significant failure. Error/priority red chips also fail in AntD and Chakra kanban.
- Secondary/muted text: `#8c8c8c` (AntD) = 3.29:1 fail; `#a1a1aa` (Chakra) = 2.56:1 fail; MUI muted text passes.

### 1.4 Form Input Labels (WCAG 1.3.1)

Every form input has a programmatically associated label (via `<label for>`, `aria-label`, or `aria-labelledby`).

| Input | MUI | AntD | Chakra |
|---|---|---|---|
| Table search field | F | F | F |
| Modal: Title input | N/A | N/A | N/A |
| Modal: Description textarea | N/A | N/A | N/A |
| Modal: Priority select | N/A | N/A | N/A |
| Modal: Assignee input | N/A | N/A | N/A |

Notes:
- Table search field (all apps): visible placeholder "Search products..." exists but placeholder is not a programmatic label substitute. Axe flags this as serious/critical per library.
- "Rows per page" text is visually present in all apps but not associated with the select via label/aria-labelledby — axe confirmed: critical (AntD, Chakra) / serious (MUI).
- Modal fields not testable via keyboard (edit button unreachable — see 1.1).

### 1.5 Decorative Images (WCAG 1.1.1)

Icons and decorative images are marked with `aria-hidden="true"` or have empty `alt=""`.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav icons (if any) | N/A | N/A | N/A |
| KPI trend arrows / icons | P | P | F |
| Kanban priority icons | P | P | P |
| Sort direction icons | P | P | F |

Notes:
- No sidebar/nav icons present in any app.
- MUI and AntD: trend arrows and sort icons use SVG with `aria-hidden="true"` — correctly hidden from screen readers.
- Chakra: trend arrows and sort indicators rendered as Unicode characters (`↑`, `↓`) with no `aria-hidden` — screen readers will announce "upwards arrow" / "downwards arrow", adding noise to every KPI card and table header.
- Kanban priority badges contain visible text labels — correctly accessible.

### 1.6 Modal Focus Management (WCAG 2.4.3)

When a modal opens: focus moves inside it. When it closes: focus returns to the trigger element. Tab key cycles within the modal only (focus trap).

| Behaviour | MUI | AntD | Chakra |
|---|---|---|---|
| Focus moves into modal on open | P | F | P |
| Focus trapped inside modal (Tab cycles) | P | F | F |
| Escape key closes modal | P | P | P |
| Focus returns to trigger on close | P | F | F |

Notes:
- AntD: focus is not placed inside the modal on open — user must manually Tab to reach modal content. All subsequent focus behaviours are N/A as a result.
- Chakra: focus moves inside on open, but Tab escapes to browser chrome and Shift+Tab reaches elements behind the modal (no focus trap). Focus is not returned to the trigger on close.
- MUI: all four behaviours correct.

### 1.7 Live Regions / Dynamic Updates (WCAG 4.1.3)

Assistive technology is notified of dynamic content changes without a page reload.

| Interaction | MUI | AntD | Chakra |
|---|---|---|---|
| Table filter results update announced | F | F | F |
| Table sort change announced (`aria-sort`) | P | P | P |
| Kanban card move announced | — | — | — |
| Pagination change announced | — | — | — |

Notes:
- `aria-sort` present and correct on all sortable column headers in all three apps.
- No `aria-live` region near the table search input in any app — filter result changes are not announced to screen readers.
- Kanban card move and pagination announcements marked pending — requires VoiceOver (see Part 3, deferred).

### 1.8 Heading Hierarchy (WCAG 1.3.1)

Headings follow a logical order (h1 → h2 → h3). No skipped levels. One h1 per page.

| Page | MUI | AntD | Chakra |
|---|---|---|---|
| Homepage `/` | F | F | P |
| Dashboard `/dashboard` | F | F | P |
| Kanban `/kanban` | F | F | P |

Notes:
- Data sourced from axe-core scan.
- AntD: `heading-order` violations on home+dashboard; no `<h1>` on any page (`page-has-heading-one` fail across all routes).
- MUI: `heading-order` violations on all three pages — typography variants (`subtitle1`, `subtitle2`, `h6`) used outside semantic heading flow.
- Chakra: zero heading violations — correct semantic heading hierarchy on all routes.

### 1.9 Reduced Motion (WCAG 2.3.3 — best practice at AA)

With OS reduced motion enabled, animations stop or are minimised. Tested by enabling "Reduce motion" in OS accessibility settings.

| Animation | MUI | AntD | Chakra |
|---|---|---|---|
| Modal open/close animation | N/A | F | N/A |
| DnD drag animation | F | F | F |
| Component entrance animations | N/A | N/A | N/A |
| Chart render animation | — | — | — |

Notes:
- Reduce motion enabled via System Preferences → Accessibility → Display → Reduce motion. No observable change in any app.
- AntD modal: visible open/close animation still plays with reduce motion enabled — `prefers-reduced-motion` not respected. MUI and Chakra have no modal animation to suppress.
- DnD column card-count animation still plays with reduce motion on in all three apps — none implement `prefers-reduced-motion` on this element.
- Chart render animation (recharts): not conclusively verified — deferred.
- Component entrance animations not observed in any app.

### 1.10 Touch Target Size (WCAG 2.5.5)

Interactive targets ≥ 44×44px (CSS pixels). Checked via browser DevTools computed size.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav links | — | — | — |
| Table sort header buttons | — | — | — |
| Pagination prev/next buttons | — | — | — |
| Kanban card edit button | F (24px) | F (24px) | F (32px) |
| Modal save / cancel buttons | — | — | — |

Notes:
- Kanban edit button measured via DevTools computed size: MUI 23.98px, AntD 23.99px, Chakra 32px — all below the WCAG 2.5.5 minimum of 44×44px.
- Other elements not measured — deferred. Kanban edit button is the most critical case given it is the smallest interactive control in the app.

---

## Part 2 — Automated axe-core Results

Run via `@axe-core/cli` v4.11.1, HeadlessChrome 145, production builds via `vite preview`. Date: 2026-03-04.
Full detail: `docs/results/2026-03-04/axe-summary.md`.

> **Note:** `nested-interactive` (15 nodes, kanban only) is identical across all three apps and originates from the shared `@dnd-kit` draggable wrapper architecture. It is listed for completeness but excluded from library scoring.

### dashboard-mui

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | 0 | 1 (`color-contrast`, 7 nodes) | 1 (`heading-order`, 2 nodes) | 0 |
| `/dashboard` | 0 | 2 (`color-contrast` 5 nodes, `aria-input-field-name` 1 node) | 1 (`heading-order`, 1 node) | 0 |
| `/kanban` | 0 | 2 (`color-contrast` 10 nodes, `nested-interactive`* 15 nodes) | 1 (`heading-order`, 1 node) | 0 |

Notable violations:
- `color-contrast` (serious): primary button `#1677ff` on white = 4.1:1 (threshold 4.5:1); trend green `#52c41a` on white = 2.26:1
- `aria-input-field-name` (serious, dashboard): `MuiSelect` table filter has no aria-label or associated label
- `heading-order` (moderate): MUI typography variants (`subtitle1`, `subtitle2`, `h6`) used outside a logical heading flow on all three pages

### dashboard-antd

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | 0 | 1 (`color-contrast`, 17 nodes) | 2 (`heading-order` 1 node, `page-has-heading-one` 1 node) | 0 |
| `/dashboard` | 1 (`label`, 1 node) | 1 (`color-contrast`, 19 nodes) | 2 (`heading-order` 1 node, `page-has-heading-one` 1 node) | 0 |
| `/kanban` | 0 | 2 (`color-contrast` 46 nodes, `nested-interactive`* 15 nodes) | 1 (`page-has-heading-one`, 1 node) | 0 |

Notable violations:
- `color-contrast` (serious): most affected nodes across all three apps — `#1677ff` button, `#8c8c8c` secondary text = 3.29:1, success green `#52c41a` = 2.26:1, error red `#ff4d4f` on light red = 2.98:1, Kanban tag and badge palette
- `label` (critical, dashboard): `#rc_select_0` (rows-per-page select, AntD internal DOM id) has no associated label element
- `page-has-heading-one` (moderate): no `<h1>` on any page — AntD layout does not produce one by default

### dashboard-chakra

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | 0 | 1 (`color-contrast`, 14 nodes) | 0 | 0 |
| `/dashboard` | 1 (`select-name`, 1 node) | 1 (`color-contrast`, 14 nodes) | 0 | 0 |
| `/kanban` | 0 | 2 (`color-contrast` 30 nodes, `nested-interactive`* 15 nodes) | 0 | 0 |

Notable violations:
- `color-contrast` (serious): zinc secondary text `#a1a1aa` on white = 2.56:1 (very low); trend green `#22c55e` = 2.27:1; trend red `#ef4444` = 3.76:1; priority badge red on light red = 2.77:1
- `select-name` (critical, dashboard): native `<select>` (rows-per-page control) has no accessible name
- Zero `heading-order` and `page-has-heading-one` violations — best heading structure of the three

---

## Part 3 — Screen Reader Spot-Check

Tool: VoiceOver (macOS, Cmd+F5)
Date: 2026-03-06
Scope: all three routes per app; kanban modal tested on `/kanban`.

| Task | MUI | AntD | Chakra |
|---|---|---|---|
| Navigate to table — column headers announced | P | F* | P |
| Sort indicator — state announced | F† | F† | F† |
| KPI card — value and label both announced | P‡ | P‡ | P‡ |
| Kanban edit modal — field label announced on focus | P (+ "required") | F | P |
| Kanban modal — priority select label announced | F | F | P |

Notes:
- AntD table (*): cannot Tab into the table at all — table is not keyboard-reachable. Column headers cannot be navigated to via Tab. Already captured in 1.1.
- Sort indicators (†): Sort direction characters in TanStack Table column headers read as "angle quotation mark" on all three apps — shared implementation issue, not library-specific. The sort indicator elements are not aria-hidden and VoiceOver reads them literally. All fail for the same reason.
- KPI cards (‡): not reachable by Tab (correct — they are non-interactive). Reachable via VO+Arrow keys; value and label read correctly in all three apps. Pass.
- MUI modal — Title/Description/Assignee: TextField's `label` prop auto-generates a `<label>` with `htmlFor` wired to input `id`. VoiceOver announces "Title, text field, required" — correct. Library handles this automatically.
- MUI modal — Priority Select: `FormControl > InputLabel > Select` without `labelId` on Select means label is not programmatically associated. VoiceOver reads "Combo box" without "Priority". Implementation gap (missing `labelId` prop) but reveals a non-obvious API requirement vs. TextField.
- AntD modal: `Form.Item label="..."` renders a visual label but without `name` prop on Form.Item and matching `id` on Input, there is no `htmlFor` association. VoiceOver reads only the current field value, not the label. Library DX issue — MUI's TextField handles association automatically; AntD requires explicit `name`/`id` wiring.
- Chakra modal: uses plain HTML `<label htmlFor="edit-title">` with matching Input `id` — correct association, VoiceOver announces label. This is our implementation using standard HTML (workaround for Field.Label TypeScript 5.9 incompatibility). NativeSelect also has correct `htmlFor` association. All fields pass.
- Kanban cards (all apps): dnd-kit draggable wrapper is `role="button"`, so VoiceOver reads the entire card text as a single string — title, description, assignee, priority concatenated with no structure. Shared implementation issue, not library-specific.
- Charts (all apps): recharts SVG containers announced as "application" by VoiceOver. Moving into graph reads data correctly. Shared recharts behavior.

---

## Summary

| Criterion | MUI | AntD | Chakra |
|---|---|---|---|
| axe-core: severity-weighted penalty (excl. shared nested-interactive) | 12 pts | 14 pts | 9 pts |
| Modal focus management (WCAG 2.4.3) | 4/4 | 1/4 | 2/4 |
| Heading hierarchy (all routes) | F (all) | F (all + no h1) | P (all) |
| VoiceOver modal field labels | P (text fields) / F (select) | F (all fields) | P (all fields) |
| VoiceOver sort state | F | F | F |

Overall accessibility score (1–10): MUI **7** / AntD **5** / Chakra **6**

Rationale:
- MUI 7: Best modal focus (4/4 WCAG 2.4.3), zero critical violations, fewest contrast-affected nodes (22), field labels auto-associated by library. Demerits: heading-order broken by typography API across all pages, select label not announced.
- Chakra 6: Best heading structure (all routes, zero violations), fewest axe penalty points (9), VoiceOver field labels correct (plain HTML workaround). Demerits: modal focus trap absent, focus not returned on close, Unicode sort/trend arrows announced by SR, secondary text color #a1a1aa = 2.56:1.
- AntD 5: Modal focus never enters (WCAG 2.4.3 Level AA failure — modal keyboard-inaccessible), no h1 on any page, worst axe penalty (14 pts), VoiceOver reads no field labels in modal (Form.Item label not associated without name prop — library DX issue).
