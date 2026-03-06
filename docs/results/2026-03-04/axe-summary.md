# axe-core Scan Results — Summary

**Date:** 2026-03-04
**Tool:** axe-core 4.11.1 via `@axe-core/cli`
**Scope:** 3 apps × 3 routes = 9 scans
**Chrome:** HeadlessChrome 145 (production builds via `vite preview`)

---

## Violation counts by app and route

| App | Route | Critical | Serious | Moderate | Incomplete |
|---|---|---|---|---|---|
| Ant Design | `/` | 0 | 1 | 2 | 1 |
| Ant Design | `/dashboard` | 1 | 1 | 2 | 2 |
| Ant Design | `/kanban` | 0 | 2 | 1 | 2 |
| Chakra UI | `/` | 0 | 1 | 0 | 0 |
| Chakra UI | `/dashboard` | 1 | 1 | 0 | 1 |
| Chakra UI | `/kanban` | 0 | 2 | 0 | 1 |
| MUI | `/` | 0 | 1 | 1 | 0 |
| MUI | `/dashboard` | 0 | 2 | 1 | 1 |
| MUI | `/kanban` | 0 | 2 | 1 | 0 |

> **Note on `nested-interactive` (kanban, all apps):** All three apps have 15 `nested-interactive` violations on the kanban page. These are a direct consequence of placing a focusable edit button inside a `@dnd-kit` draggable `role="button"` wrapper. This is a shared architecture decision, not a library-specific failure. It is counted in the table above but excluded from library scoring.

---

## Violation detail by library

### Ant Design

| Violation | Impact | Pages | Affected nodes | Notes |
|---|---|---|---|---|
| `color-contrast` | serious | `/`, `/dashboard`, `/kanban` | 82 total (17+19+46) | Primary brand color `#1677ff` on white = 4.1:1 (needs 4.5:1); secondary text `#8c8c8c` on white = 3.29:1; error red on light red = 2.98:1; trend green on white = 2.26:1 |
| `nested-interactive` | serious | `/kanban` | 15 | Shared dnd-kit issue — excluded from scoring |
| `label` | **critical** | `/dashboard` | 1 | `#rc_select_0` (table filter select) has no label, no aria-label, no aria-labelledby |
| `heading-order` | moderate | `/`, `/dashboard` | 2 | `h4` elements appear before `h1`/`h2` in card components |
| `page-has-heading-one` | moderate | `/`, `/dashboard`, `/kanban` | 3 | No `<h1>` on any page — AntD layout does not produce one by default |

### Chakra UI

| Violation | Impact | Pages | Affected nodes | Notes |
|---|---|---|---|---|
| `color-contrast` | serious | `/`, `/dashboard`, `/kanban` | 58 total (14+14+30) | Secondary text `#a1a1aa` on white = 2.56:1; trend green `#22c55e` on white = 2.27:1; trend red `#ef4444` on white = 3.76:1; priority badge red on light red = 2.77:1 |
| `nested-interactive` | serious | `/kanban` | 15 | Shared dnd-kit issue — excluded from scoring |
| `select-name` | **critical** | `/dashboard` | 1 | Native `<select>` (rows-per-page control) has no accessible name |
| `heading-order` | — | — | 0 | No violations |
| `page-has-heading-one` | — | — | 0 | No violations |

### MUI

| Violation | Impact | Pages | Affected nodes | Notes |
|---|---|---|---|---|
| `color-contrast` | serious | `/`, `/dashboard`, `/kanban` | 22 total (7+5+10) | Primary button `#1677ff` on white = 4.1:1; trend green `#52c41a` on white = 2.26:1; error chip label on red background = 3.26:1 |
| `nested-interactive` | serious | `/kanban` | 15 | Shared dnd-kit issue — excluded from scoring |
| `aria-input-field-name` | serious | `/dashboard` | 1 | `MuiSelect` (table filter) has no aria-label or associated label element |
| `heading-order` | moderate | `/`, `/dashboard`, `/kanban` | 4 | Heading hierarchy broken by MUI typography variants (`subtitle1`, `subtitle2`, `h6`) being used outside a semantic heading flow |

---

## Cross-app patterns

### 1. `color-contrast` — shared token root cause

All three apps share `tokens.json` which defines the primary brand color as `#1677ff`. Against a white background this yields a contrast ratio of **4.1:1**, just below the WCAG 2 AA threshold of 4.5:1. This single token is responsible for the majority of contrast violations across all three libraries. The fix is library-independent (update the token).

However, the scale of contrast violations differs significantly (AntD: 82 nodes, Chakra: 58, MUI: 22) because each library applies secondary and status colors differently. AntD's secondary text (`#8c8c8c`) and Ant Design status palette (error red, success green) each individually fail. Chakra's zinc/slate secondary (`#a1a1aa`) also fails. MUI's violations are primarily limited to the shared brand color token.

### 2. `nested-interactive` — shared dnd-kit architecture

All three kanban pages have exactly 15 `nested-interactive` violations (one per Kanban card). The pattern is identical: a `@dnd-kit` draggable wrapper receives `role="button"` and `aria-roledescription="draggable"`, and the edit button inside it is also focusable. This is a WCAG 1.3.1 / 4.1.2 violation. Since the dnd-kit integration is identical across all three apps, it is excluded from per-library scoring.

### 3. Unlabelled select control — all three apps, different rules

All three apps fail to associate a label with the dashboard table's filter control, but each triggers a different axe rule:
- AntD: `label` (critical) — `rc-select` internal DOM id with no label
- Chakra: `select-name` (critical) — native `<select>` with no accessible name
- MUI: `aria-input-field-name` (serious) — `MuiSelect` with no aria attribute

This is the same implementation gap (missing `<label>` or `aria-label` on the filter Select) expressed through three different library DOM patterns.

### 4. Heading structure — Chakra best, AntD worst

Chakra UI has zero heading-order and page-has-heading-one violations. Its typography system generates correct semantic heading flow without intervention. MUI has moderate `heading-order` violations across all three pages (4 total), driven by MUI typography variants being used as decorative headings rather than semantic ones. AntD has both `heading-order` and `page-has-heading-one` violations across all pages — its layout does not emit a top-level `<h1>` by default.

---

## Severity-weighted scores (excluding shared nested-interactive)

Penalty formula: critical = 3 pts, serious = 2 pts, moderate = 1 pt

| App | Critical | Serious | Moderate | Penalty | Score (10 − penalty) |
|---|---|---|---|---|---|
| MUI | 0 | 4 (color-contrast×3 + aria-input×1) | 4 (heading-order×4) | 12 | **above** |
| Chakra UI | 1 | 3 (color-contrast×3) | 0 | 9 | **middle** |
| Ant Design | 1 | 3 (color-contrast×3) | 5 (heading-order×2 + page-h1×3) | 14 | **below** |

Raw ranking: **Chakra UI (9 pts penalty) < MUI (12) < AntD (14)**

Note: Chakra edges MUI despite both having a critical violation because MUI accumulates more heading-order moderate violations across all three pages. MUI's critical count is 0 but its serious non-contrast violation count is higher.

---

## Notes for manual checklist (2b) and screen reader (2c)

Items to pay specific attention to during manual review given axe results:
- **All apps:** Verify the table filter Select has an accessible label — axe flagged it as critical/serious but with different rule IDs
- **AntD:** Check that all pages have a logical `<h1>` — currently absent
- **AntD kanban:** Error tag red and secondary text contrast — many nodes failing
- **Chakra:** Zinc secondary text (#a1a1aa) — very low contrast ratio (2.56:1)
- **All apps:** Kanban DnD — screen reader spot-check should explicitly test whether drag state is announced despite the nested-interactive issue
