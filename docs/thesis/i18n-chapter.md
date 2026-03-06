# Internationalization — Thesis Chapter Draft

> Draft for direct use or adaptation in the thesis. All findings are based on library documentation and API inspection as of 2026-03-05. This criterion measures library capability — i18n was not implemented in the test applications. Tables are numbered continuing from Chapter 5.5 (last table: 5.28).

---

## 5.6 Internationalization

Internationalization carries 3% of the total weight — the smallest criterion in the framework. The low weight is a deliberate choice: the test application is a single-locale English dashboard, and none of the three apps implement locale switching or RTL layout. The criterion is included because enterprise dashboard applications routinely ship to international users, and the cost of adding i18n support varies significantly between libraries.

Four sub-dimensions are assessed: RTL layout support, built-in locale string coverage, locale-aware components, and compatibility with application-level i18n frameworks.

### 5.6.1 Measurement Approach

i18n was assessed from library documentation and API inspection. The test application was not modified. Each sub-dimension reflects the capability of the library as shipped — what a team would need to do to add i18n support to a production project built with each library.

---

### 5.6.2 RTL Layout Support

**Table 5.29 — RTL layout support**

| Library | RTL API | Extra packages required | Coverage |
|---|---|---|---|
| MUI | `<body dir="rtl">` + Emotion cache + `stylis-plugin-rtl` | `stylis-plugin-rtl` | Comprehensive once configured; v6+ CSS Variables theme uses logical properties natively |
| Ant Design | `<ConfigProvider direction="rtl">` | None | Comprehensive; all core components designed for RTL; Arabic/Hebrew locales tested |
| Chakra UI | `dir="rtl"` on HTML root or container | None | Partial; CSS logical properties in most components, but coverage incomplete after v3 rewrite |

#### MUI

MUI supports RTL but does not expose it as a single-prop toggle. Enabling RTL requires two extra packages — `@emotion/cache` (already a transitive dependency in most MUI projects) and `stylis-plugin-rtl` — and a provider-level setup:

```ts
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [rtlPlugin] });

<CacheProvider value={cacheRtl}>
  <ThemeProvider theme={muiTheme}>
    <App />
  </ThemeProvider>
</CacheProvider>
```

The plugin mirrors all physical CSS properties (`margin-left`, `padding-right`, `float`, `text-align`, `transform`) automatically. v6 and above introduced a CSS Variables theme mode that uses CSS logical properties (`margin-inline-start`, `padding-inline-end`) natively, which handles RTL without the plugin — a meaningful improvement for projects on v6+. Teams on the CSS Variables theme have a simpler RTL path; teams on the Emotion-based theme still need the plugin.

A known gap: custom `sx` prop styles written with physical shorthand (`pl`, `pr`) require manual replacement with logical equivalents (`ps`, `pe`) when enabling RTL. The plugin cannot detect inline styles applied via the `sx` prop.

#### Ant Design

RTL is a first-class API in Ant Design. A single prop on the existing provider toggles it application-wide:

```tsx
import arEG from 'antd/locale/ar_EG';
<ConfigProvider locale={arEG} direction="rtl">
```

No extra packages are required. All core components — buttons, inputs, tables, cards, forms, modals, dropdowns, date pickers — are designed with RTL in mind: icons flip, padding reverses, dropdowns open to the left, table column order reverses. Built-in locales for Arabic (`arEG`, `arEW`) and Hebrew (`heIL`) are included. A few community-reported edge cases exist in complex components (Cascader, Transfer) in older minor versions, but the core component set flips cleanly and is production-tested in Arabic and Hebrew markets.

#### Chakra UI

Chakra v3 uses CSS custom properties extensively, and many components use CSS logical properties (`padding-inline-start`, `margin-inline-end`) which respond to `dir="rtl"` on a parent element automatically. There is no provider-level `direction` prop.

Coverage is incomplete. The v3 rewrite replaced several components with Ark UI headless primitives, and RTL support quality depends on each Ark UI primitive's implementation. Not all components were audited against RTL after the v3 rewrite. There is no dedicated RTL documentation page in the v3 documentation. The practical implication is that RTL support is available for teams willing to test each component individually, but it cannot be relied on without auditing.

---

### 5.6.3 Built-in Locale String Coverage

Internal library strings are text owned by the library itself: pagination labels ("Previous", "Next"), table empty state ("No data"), DatePicker month and weekday names, form validation messages ("This field is required"), and modal button labels ("OK", "Cancel"). These strings appear in the UI without any action by the application developer, and they must be translated when deploying to non-English markets.

**Table 5.30 — Built-in locale string coverage**

| Library | Locale API | Locale count | Components affected |
|---|---|---|---|
| MUI | Second argument to `createTheme(base, locale)` | ~40 | MUI X components primarily (DataGrid pagination, DatePicker); few internal strings in core Material UI |
| Ant Design | `<ConfigProvider locale={...}>` | 70+ | DatePicker, TimePicker, Calendar, Table pagination, Form validation messages, Modal buttons, Upload text, Transfer labels |
| Chakra UI | None | — | N/A — Chakra owns no user-visible strings |

#### MUI

Locale configuration is passed as a second argument to `createTheme`:

```ts
import { frFR } from '@mui/material/locale';
const theme = createTheme(baseTheme, frFR);
```

Approximately 40 locales are included. The impact is most significant for MUI X users: the DataGrid pagination controls, DatePicker month and day names, and time picker labels all update with the locale. Core Material UI components own few internal strings — most text in the core library is passed as props by the application developer — so the locale system has limited impact for teams using only `@mui/material`.

#### Ant Design

Locale configuration is co-located with RTL and direction settings on `ConfigProvider`:

```tsx
import jaJP from 'antd/locale/ja_JP';
<ConfigProvider locale={jaJP}>
```

Over 70 locales are built in — the widest coverage of the three libraries. Because Ant Design's core package includes DatePicker, TimePicker, Calendar, Table pagination, Form validation, and modal buttons, the locale system has broad impact even without any additional packages. A team switching a production AntD application to Arabic or Japanese can achieve complete locale coverage for all internal strings by changing one import and one prop.

#### Chakra UI

Chakra UI has no locale configuration API in v3. This is architecturally consistent: Chakra is a styling and composition library that owns almost no user-visible strings. The only internal text in Chakra components is accessibility labels on close and dismiss buttons, which are hardcoded in English. Because Chakra provides no DatePicker, no paginated Table, and no Form validation messages, there are no internal strings to localize. Application developers provide all content as props or children.

The absence of a locale API is not a gap in Chakra's design — it is a consequence of its scope. It does, however, mean that any locale-aware content must be sourced entirely from the application layer.

---

### 5.6.4 Locale-Aware Components

Locale-aware components go beyond translating labels: they format dates, times, numbers, and currencies according to locale conventions (calendar system, first day of week, 12h/24h time, decimal separator, currency symbol position).

**Table 5.31 — Locale-aware component availability**

| Component type | MUI | Ant Design | Chakra UI |
|---|---|---|---|
| DatePicker with locale formatting | MUI X (extra package, MIT) | Core package | Not available |
| TimePicker with locale formatting | MUI X | Core package | Not available |
| Calendar / date range | MUI X | Core package | Not available |
| Number / currency input | External library required | `InputNumber` with `formatter` prop | External library required |
| Pagination with locale labels | MUI X DataGrid | Core Table + Pagination | Not available |

#### MUI

The core `@mui/material` package contains no locale-aware components. Date and time formatting is provided by MUI X — a separately installed package:

```tsx
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ar';

<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ar">
  <DatePicker />
</LocalizationProvider>
```

MUI X's date components support four adapters (Day.js, date-fns, Luxon, Moment.js), each with their own locale bundle. Calendar, first-day-of-week, and time format (12h/24h) all update with locale. The basic DatePicker and DateTimePicker are MIT-licensed and available to all teams; the DateRangePicker requires a commercial license.

Number formatting and currency input are not part of MUI at any tier. Teams building financial dashboards need an external library (e.g., `react-number-format`) for these components.

#### Ant Design

All locale-aware components are in the core `antd` package. The DatePicker, TimePicker, Calendar, and RangePicker respond to the `ConfigProvider locale` — month names, weekday abbreviations, and first-day-of-week all update without additional configuration. The `InputNumber` component provides a `formatter` prop for custom number display but does not use `Intl.NumberFormat` internally. Select, Cascader, and TreeSelect update their search and pagination strings with locale.

For a team building an enterprise dashboard targeting Arabic or East Asian markets, Ant Design requires the fewest additional packages of the three: RTL, locale strings, and locale-aware date components are all available in the base installation.

#### Chakra UI

Chakra UI provides no locale-aware components. There is no DatePicker, no Calendar, no paginated data table, and no number input with Intl formatting in the v3 core package. All date, time, and number formatting must be handled with external libraries. This is consistent with Chakra's design philosophy — it is a primitive and styling layer, not a full component suite — but it is a functional gap for teams building internationalized dashboards.

---

### 5.6.5 i18n Framework Integration

All three libraries integrate cleanly with application-level translation frameworks (i18next, react-intl, FormatJS). The libraries do not interfere with these frameworks because they maintain a clear separation between library-internal strings (handled by the library's locale system) and application content (handled by the application's i18n layer).

**Table 5.32 — i18n framework integration**

| Library | Official i18next adapter | Conflict with app i18n | Notes |
|---|---|---|---|
| MUI | No | None | `createTheme` locale handles internal strings; app i18n handles content — layers are independent |
| Ant Design | No | None | `ConfigProvider locale` handles internal strings; app i18n handles content — broader internal coverage means less manual override work |
| Chakra UI | No | None | No locale layer to conflict with; all string ownership is with the application |

No library provides an official i18next or react-intl adapter. All three follow the same integration pattern: their internal locale system handles library-owned strings, while the application's translation layer handles application content. There is no interference between the two layers in any of the three libraries.

The practical difference is scope: Ant Design's `ConfigProvider locale` handles the widest range of internal strings (70+ locales, affecting DatePicker, Table, Form, Modal, Upload, Transfer), which means fewer custom overrides are needed when integrating with an app-level translation system. MUI's locale system handles fewer internal strings in the core package, so more string management falls to the application layer. Chakra leaves all string management to the application.

---

### 5.6.6 Analysis

Ant Design's lead on internationalization is decisive and structurally motivated. RTL is a single prop on an existing provider. The built-in locale set covers 70+ languages. All locale-aware date and time components are in the core package. No additional installs are required to ship a fully internationalized application in Arabic, Japanese, or Hebrew. This reflects Ant Group's origin as a global financial technology platform serving Chinese and international markets — i18n was a design requirement from the beginning, not a later addition.

MUI provides complete i18n capability, but the implementation cost is higher. RTL requires an additional package and provider setup. The locale-aware DatePicker is in MUI X, not in the core. Teams using only `@mui/material` will find the locale system has limited impact because the core library owns few internal strings. For a SaaS dashboard with date input and RTL requirements, MUI is capable but requires more assembly.

Chakra UI's position requires interpretive care. The score of 4.5 reflects a genuine lack of i18n tooling — no RTL API, no locale system, no locale-aware components. But this is a consequence of Chakra's architecture, not a defect. A team that brings its own DatePicker and does not need library-level locale support may find Chakra's i18n story adequate. The score reflects the comparison context: a dashboard application where date inputs, pagination, and form validation are common requirements.

---

### 5.6.7 Summary

**Table 5.33 — Internationalization sub-dimension scores**

| Sub-dimension | MUI | Ant Design | Chakra UI | Key differentiator |
|---|---|---|---|---|
| RTL support | 6 | 9 | 5 | AntD: single prop, zero extra packages; MUI: plugin required; Chakra: CSS logical props, incomplete coverage |
| Built-in locale strings | 7 | 10 | 3 | AntD 70+ locales, broad component coverage; MUI ~40 (most impactful via MUI X); Chakra owns no strings |
| Locale-aware components | 6 | 9 | 2 | AntD: DatePicker/Calendar in core; MUI: DatePicker in MUI X (extra package); Chakra: none |
| i18n framework integration | 8 | 8 | 8 | All integrate cleanly — no conflicts with app-level translation systems |

**Table 5.34 — Internationalization criterion summary**

| Library | Score (1–10) | Rationale |
|---|---|---|
| MUI | **6.75** | Capable but requires assembly: RTL needs `stylis-plugin-rtl`, locale-aware DatePicker is in MUI X. Core Material UI owns few internal strings, so the locale system's impact is limited without MUI X. |
| Ant Design | **9.0** | Best i18n story of the three: RTL as a single `ConfigProvider` prop, 70+ locales, DatePicker and Calendar in core. No extra packages required to ship a fully internationalized application. |
| Chakra UI | **4.5** | No RTL API, no locale system, no locale-aware components. Structurally consistent with Chakra's positioning as a styling primitive layer, but a real capability gap for teams building internationalized data dashboards. |

---

*Evidence: `docs/results/2026-03-04/i18n-evidence.md`. Assessment based on library documentation and API inspection as of 2026-03-05. i18n was not implemented in the test applications.*
