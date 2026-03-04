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
| Nav links — `/` | | | |
| Nav links — `/dashboard` | | | |
| Nav links — `/kanban` | | | |
| Table sort headers — `/dashboard` | | | |
| Table search input — `/dashboard` | | | |
| Table pagination controls — `/dashboard` | | | |
| KPI cards (if interactive) — `/dashboard` | | | |
| Kanban card drag (keyboard DnD) — `/kanban` | | | |
| Kanban card edit button — `/kanban` | | | |
| Edit modal fields — `/kanban` | | | |
| Edit modal save / cancel — `/kanban` | | | |

Notes:

### 1.2 Visible Focus Indicators (WCAG 2.4.7)

All focusable elements display a clearly visible focus ring when navigating by keyboard.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav links | | | |
| Buttons | | | |
| Table sort headers | | | |
| Table search input | | | |
| Pagination controls | | | |
| Modal form fields | | | |
| Modal action buttons | | | |

Notes:

### 1.3 Color Contrast (WCAG 1.4.3)

Normal text ≥ 4.5:1, large text (≥ 18pt or ≥ 14pt bold) ≥ 3:1. Checked with browser DevTools color picker.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Body / paragraph text | | | |
| Nav link text | | | |
| Table cell text | | | |
| Table header text | | | |
| KPI card value | | | |
| KPI card label | | | |
| Badge / status chip text | | | |
| Kanban card title | | | |
| Button label text | | | |
| Input placeholder text (≥ 3:1 acceptable) | | | |

Notes:

### 1.4 Form Input Labels (WCAG 1.3.1)

Every form input has a programmatically associated label (via `<label for>`, `aria-label`, or `aria-labelledby`).

| Input | MUI | AntD | Chakra |
|---|---|---|---|
| Table search field | | | |
| Modal: Title input | | | |
| Modal: Description textarea | | | |
| Modal: Priority select | | | |
| Modal: Assignee input | | | |

Notes:

### 1.5 Decorative Images (WCAG 1.1.1)

Icons and decorative images are marked with `aria-hidden="true"` or have empty `alt=""`.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav icons (if any) | | | |
| KPI trend arrows / icons | | | |
| Kanban priority icons | | | |
| Sort direction icons | | | |

Notes:

### 1.6 Modal Focus Management (WCAG 2.4.3)

When a modal opens: focus moves inside it. When it closes: focus returns to the trigger element. Tab key cycles within the modal only (focus trap).

| Behaviour | MUI | AntD | Chakra |
|---|---|---|---|
| Focus moves into modal on open | | | |
| Focus trapped inside modal (Tab cycles) | | | |
| Escape key closes modal | | | |
| Focus returns to trigger on close | | | |

Notes:

### 1.7 Live Regions / Dynamic Updates (WCAG 4.1.3)

Assistive technology is notified of dynamic content changes without a page reload.

| Interaction | MUI | AntD | Chakra |
|---|---|---|---|
| Table filter results update announced | | | |
| Table sort change announced (`aria-sort`) | | | |
| Kanban card move announced | | | |
| Pagination change announced | | | |

Notes:

### 1.8 Heading Hierarchy (WCAG 1.3.1)

Headings follow a logical order (h1 → h2 → h3). No skipped levels. One h1 per page.

| Page | MUI | AntD | Chakra |
|---|---|---|---|
| Homepage `/` | | | |
| Dashboard `/dashboard` | | | |
| Kanban `/kanban` | | | |

Notes:

### 1.9 Reduced Motion (WCAG 2.3.3 — best practice at AA)

With OS reduced motion enabled, animations stop or are minimised. Tested by enabling "Reduce motion" in OS accessibility settings.

| Animation | MUI | AntD | Chakra |
|---|---|---|---|
| Modal open/close animation | | | |
| DnD drag animation | | | |
| Component entrance animations | | | |
| Chart render animation | | | |

Notes:

### 1.10 Touch Target Size (WCAG 2.5.5)

Interactive targets ≥ 44×44px (CSS pixels). Checked via browser DevTools computed size.

| Element | MUI | AntD | Chakra |
|---|---|---|---|
| Nav links | | | |
| Table sort header buttons | | | |
| Pagination prev/next buttons | | | |
| Kanban card edit button | | | |
| Modal save / cancel buttons | | | |

Notes:

---

## Part 2 — Automated axe-core Results

Run via `@axe-core/playwright`. Fill in after running the Playwright a11y tests.

### dashboard-mui

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | | | | |
| `/dashboard` | | | | |
| `/kanban` | | | | |

Notable violations:

### dashboard-antd

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | | | | |
| `/dashboard` | | | | |
| `/kanban` | | | | |

Notable violations:

### dashboard-chakra

| Route | Critical | Serious | Moderate | Minor |
|---|---|---|---|---|
| `/` | | | | |
| `/dashboard` | | | | |
| `/kanban` | | | | |

Notable violations:

---

## Part 3 — Screen Reader Spot-Check

Tool: <!-- VoiceOver (macOS) / NVDA (Windows) — fill in which was used -->
Scope: `/dashboard` route only (most complex interaction surface).

| Task | MUI | AntD | Chakra |
|---|---|---|---|
| Navigate to table via keyboard — column headers announced | | | |
| Sort a column — sort state (asc/desc) announced | | | |
| Open Kanban edit modal — focus moves inside, context announced | | | |
| Close Kanban edit modal — focus returns to trigger | | | |
| Read a KPI card — value and label both announced | | | |

Notes:

---

## Summary

| Criterion | MUI | AntD | Chakra |
|---|---|---|---|
| WCAG checklist pass rate (Parts 1.1–1.10) | — / 45 | — / 45 | — / 45 |
| axe-core: critical + serious violations (all routes) | | | |
| Screen reader: tasks passed (Part 3) | — / 5 | — / 5 | — / 5 |

Overall accessibility score (1–10): <!-- calculated after all parts are filled in; see measurement-protocol.md for scoring method -->
