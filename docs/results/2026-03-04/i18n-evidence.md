# Internationalization — Evidence & Scoring Notes

Date: 2026-03-04
Assessment: architectural analysis from library documentation + API inspection.
Note: i18n is not implemented in any of the three apps. This criterion measures library capability, not our usage.

---

## Sub-dimension 1 — RTL Layout Support

### MUI
- RTL is supported but not a single-prop toggle.
- Requires two extra packages: `@emotion/cache` (already a transitive dep) + `stylis-plugin-rtl`.
- Setup pattern:
  ```ts
  import rtlPlugin from 'stylis-plugin-rtl';
  import createCache from '@emotion/cache';
  import { CacheProvider } from '@emotion/react';

  const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });

  // Wrap app:
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={muiTheme}>
      <App />
    </ThemeProvider>
  </CacheProvider>
  ```
- Also requires `<body dir="rtl">` or equivalent on the HTML root.
- The plugin mirrors all CSS properties (margin, padding, border, float, text-align, transform) automatically.
- v6+ CSS Variables theme uses CSS logical properties (`margin-inline-start` etc.) which handle RTL without the plugin — a meaningful improvement for projects on v6+.
- Known gaps: some custom `sx` prop styles written with physical properties (e.g. `pl`, `pr`) require manual review; logical equivalents (`ps`, `pe`) should be used instead.
- **Verdict: RTL works, but requires manual setup and extra package. Not a single-prop API.**

### Ant Design
- RTL is a first-class API: `<ConfigProvider direction="rtl">`.
- No extra packages required. Single prop on the provider that the entire app reads.
- All core components are designed with RTL in mind: icons flip, padding reverses, dropdowns open to the left, table columns reverse.
- Built-in support for Arabic (`arEG`, `arEW`) and Hebrew (`heIL`) locales.
- A few community-reported edge cases in complex components (Cascader, Transfer) in older minor versions, but the core set (Button, Input, Table, Card, Form, Modal) flips cleanly.
- **Verdict: best RTL support of the three — single prop, comprehensive coverage, battle-tested for Arabic/Hebrew markets.**

### Chakra UI
- v3 uses CSS custom properties extensively, and some components use CSS logical properties (`padding-inline-start`, `margin-inline-end`) which respond to `dir="rtl"` automatically.
- No provider-level `direction` prop in v3 — RTL is activated by setting `dir="rtl"` on the HTML root element or a parent container.
- Coverage is incomplete: composable components using the Recipe system do respect logical properties in most cases, but not all components were audited against RTL after the v3 rewrite.
- The v3 rewrite removed Framer Motion and replaced several components with Ark UI primitives — RTL support quality depends on Ark UI's RTL handling per component.
- No dedicated RTL documentation page in v3 docs (as of 2026-03).
- **Verdict: partial RTL via CSS logical properties; less predictable than AntD; no dedicated RTL API or documentation.**

---

## Sub-dimension 2 — Built-in Locale String Coverage

Internal library strings are UI text owned by the library itself: pagination labels ("Previous", "Next"), table empty state ("No data"), DatePicker month/day names, form validation messages, modal "OK"/"Cancel" buttons.

### MUI
- Locale config via second argument to `createTheme`:
  ```ts
  import { frFR } from '@mui/material/locale';
  const theme = createTheme(baseTheme, frFR);
  ```
- ~40 locales built-in covering Western European, East Asian, Arabic, Hebrew, and more.
- Affects: DataGrid (MUI X) pagination, DatePicker labels, component aria-labels.
- Core Material UI components have few internal strings (most text is passed as props) so the locale system is most impactful for MUI X users.
- **Verdict: solid locale API, ~40 languages, most impactful for MUI X components.**

### Ant Design
- Locale config via ConfigProvider:
  ```tsx
  import arEG from 'antd/locale/ar_EG';
  <ConfigProvider locale={arEG} direction="rtl">
  ```
- 70+ locales built-in — the widest coverage of the three.
- Covers: DatePicker month/weekday names, Table pagination, Form validation messages (required field, invalid format), Modal OK/Cancel, TimePicker labels, Upload drag-and-drop text, Transfer component labels.
- Because AntD owns many form and data components, the locale system has broader impact than MUI's core locale.
- **Verdict: best locale coverage of the three — 70+ languages, affects the widest set of component-internal strings.**

### Chakra UI
- No locale configuration API in v3.
- Chakra is architecturally a styling and composition library — it owns almost no user-visible strings. The only internal text is aria-labels on close/dismiss buttons, which are hardcoded in English.
- No DatePicker, no Pagination with text, no Form validation messages — the components that typically need locale strings don't exist in Chakra's core.
- Developers provide all content as props/children, so there is nothing to localize at the library level.
- **Verdict: no locale API needed because Chakra owns no user-visible strings. Clean for content authors, but no built-in locale coverage.**

---

## Sub-dimension 3 — Locale-Aware Components

Components that format dates, times, numbers, or currency according to locale (beyond just translating button labels).

### MUI
- **Core package**: no locale-aware components.
- **MUI X** (separate package, MIT tier for basic; commercial for advanced):
  - `DatePicker`, `DateTimePicker`, `TimePicker`, `DateRangePicker`: full locale formatting via adapter (`dayjs`, `date-fns`, `luxon`, `moment`).
  - `LocalizationProvider` wraps the app with adapter + locale:
    ```tsx
    import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
    ```
  - Date components format according to locale calendar, first-day-of-week, time format (12h/24h).
  - NumberFormat, currency input: not part of MUI; external libraries needed (e.g., `react-number-format`).
- **Verdict: locale-aware DatePicker via MUI X, none in core. Requires extra package.**

### Ant Design
- DatePicker, TimePicker, Calendar, RangePicker: respond to `ConfigProvider locale` — month names, weekday abbreviations, first-day-of-week all update.
- Input[type=number]: no built-in Intl formatting, but `InputNumber` has a `formatter` prop for custom formatting.
- Select, Cascader, TreeSelect: pagination/search strings update with locale.
- All locale-aware components are in the core `antd` package — no extra install required.
- **Verdict: widest in-package locale-aware component set of the three.**

### Chakra UI
- No DatePicker, no NumberInput with Intl formatting, no Calendar component.
- No locale-sensitive components exist in the core v3 package.
- Date/number inputs require external libraries (react-datepicker, react-number-format, etc.).
- **Verdict: no locale-aware components.**

---

## Sub-dimension 4 — i18n Framework Integration

Integration with app-level translation systems (i18next, react-intl, etc.).

### MUI
- No official i18next or react-intl adapter.
- Library strings are handled via `createTheme` locale; app strings are independent.
- Clean separation: your `useTranslation()` calls handle content; MUI's locale handles internal labels.
- No conflict or interference between the two layers.
- **Verdict: clean integration by design — no coupling.**

### Ant Design
- No official i18next adapter.
- Same clean separation: `ConfigProvider locale` handles internal strings; app i18n handles content.
- The breadth of AntD's `ConfigProvider locale` means fewer custom overrides needed for internal strings.
- **Verdict: clean integration; ConfigProvider handles more internal strings so less manual work.**

### Chakra UI
- No locale API means there is nothing to integrate — all string ownership is with the application.
- Works transparently with i18next/react-intl since Chakra never owns content.
- **Verdict: trivially compatible because library owns no strings.**

---

## Proposed scores

| Sub-dimension | MUI | AntD | Chakra | Notes |
|---|---|---|---|---|
| RTL support | 6 | 9 | 5 | AntD: single prop; MUI: extra packages; Chakra: partial via CSS logical props |
| Built-in locale strings | 7 | 10 | 3 | AntD 70+ locales, broad component coverage; MUI ~40, mostly MUI X; Chakra owns no strings |
| Locale-aware components | 6 | 9 | 2 | AntD: DatePicker/Calendar in core; MUI: MUI X (extra package); Chakra: none |
| i18n framework integration | 8 | 8 | 8 | All integrate cleanly with i18next — no conflicts |
| **Average (i18n score)** | **6.75** | **9.0** | **4.5** | |
