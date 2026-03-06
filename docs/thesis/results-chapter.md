# Final Scores — Measurement Synthesis

Date: 2026-03-06
Measurement period: 2026-03-04 to 2026-03-06
All raw evidence in `docs/results/2026-03-04/` and `docs/thesis/performance-chapter.md`.

---

## 1. Per-criterion scores (1–10)

| Criterion | Weight | MUI v7 | Ant Design v5 | Chakra UI v3 | Evidence |
|---|---|---|---|---|---|
| Performance & Bundle Size | 30% | **8** | **6** | **5** | `performance-chapter.md` §5.1.8 |
| Accessibility | 25% | **7** | **5** | **6** | `a11y-checklist.md` + `axe-summary.md` |
| Developer Experience | 22% | **7.8** | **7.0** | **4.8** | `dx-evidence.md` |
| Theming & Customization | 12% | **9.0** | **7.0** | **7.8** | `theming-evidence.md` |
| Ecosystem & Community | 8% | **8.5** | **8.5** | **5.5** | `ecosystem-evidence.md` |
| Internationalization | 3% | **6.75** | **9.0** | **4.5** | `i18n-evidence.md` |

---

## 2. Weighted totals

### MUI v7

| Criterion | Score | Weight | Points |
|---|---|---|---|
| Performance & Bundle Size | 8 | 0.30 | 2.400 |
| Accessibility | 7 | 0.25 | 1.750 |
| Developer Experience | 7.8 | 0.22 | 1.716 |
| Theming & Customization | 9.0 | 0.12 | 1.080 |
| Ecosystem & Community | 8.5 | 0.08 | 0.680 |
| Internationalization | 6.75 | 0.03 | 0.203 |
| **Total** | | | **7.83** |

### Ant Design v5

| Criterion | Score | Weight | Points |
|---|---|---|---|
| Performance & Bundle Size | 6 | 0.30 | 1.800 |
| Accessibility | 5 | 0.25 | 1.250 |
| Developer Experience | 7.0 | 0.22 | 1.540 |
| Theming & Customization | 7.0 | 0.12 | 0.840 |
| Ecosystem & Community | 8.5 | 0.08 | 0.680 |
| Internationalization | 9.0 | 0.03 | 0.270 |
| **Total** | | | **6.38** |

### Chakra UI v3

| Criterion | Score | Weight | Points |
|---|---|---|---|
| Performance & Bundle Size | 5 | 0.30 | 1.500 |
| Accessibility | 6 | 0.25 | 1.500 |
| Developer Experience | 4.8 | 0.22 | 1.056 |
| Theming & Customization | 7.8 | 0.12 | 0.936 |
| Ecosystem & Community | 5.5 | 0.08 | 0.440 |
| Internationalization | 4.5 | 0.03 | 0.135 |
| **Total** | | | **5.57** |

---

## 3. Final ranking

| Rank | Library | Weighted Score |
|---|---|---|
| 1 | MUI v7 | **7.83** |
| 2 | Ant Design v5 | **6.38** |
| 3 | Chakra UI v3 | **5.57** |

---

## 4. Per-criterion score rationale

### 4.1 Performance & Bundle Size (MUI 8 / AntD 6 / Chakra 5)

Measured via Lighthouse CI (3 runs per URL, median reported) on production builds served via `vite preview`, and bundle composition via `rollup-plugin-visualizer`. Primary measurement: Run 2 (4× CPU throttle).

| Metric | MUI | AntD | Chakra |
|---|---|---|---|
| Gzip bundle size | 289 kB | 409 kB (+42%) | 318 kB (+10%) |
| UI ecosystem size (unminified) | ~489 kB | ~1,277 kB | ~727 kB |
| FCP average (all routes) | 444 ms | 605 ms | 484 ms |
| TBT on `/dashboard` (4× CPU) | 134 ms | 223 ms | 289 ms |
| Lighthouse score average (4× CPU) | 99.3 | 94.0 | 92.3 |

MUI leads on every metric. AntD's penalty is structural: the exposed `rc-*` internal layer (~487 kB unminified) cannot be tree-shaken and adds 120 kB gzip and ~160 ms FCP on every page load for every user. Chakra's competitive bundle size conceals a hidden `@zag-js` overhead (295 kB unminified, 15+ packages not prominently documented); its CSS-in-JS runtime produces the highest TBT on the dashboard (289 ms), causing the only sub-90 Lighthouse score (88) across the entire measurement. Chakra UI's dashboard falling into "needs improvement" by Google's scoring model under a standard 4× throttle is a practically significant finding for data-heavy applications.

### 4.2 Accessibility (MUI 7 / Chakra 6 / AntD 5)

Measured via axe-core 4.11.1 (automated, 9 URLs), WCAG 2.1 AA manual checklist (sections 1.1–1.10), and VoiceOver screen reader spot-check. Shared implementation issues (dnd-kit nested-interactive, TanStack Table sort keyboard gap, primary brand color contrast via shared `tokens.json`) are excluded from library scoring.

Library-attributable differentiators:

| Differentiator | MUI | AntD | Chakra |
|---|---|---|---|
| Modal focus management (WCAG 2.4.3 AA) | 4/4 — perfect | 1/4 — focus never enters | 2/4 — no trap, no return |
| Heading structure (all routes) | F — order broken by typography API | F — no h1 on any page | P — all routes correct |
| axe severity penalty (excl. shared issues) | 12 pts | 14 pts | 9 pts |
| Contrast-affected nodes (library defaults) | 22 | 82 | 58 |
| VoiceOver: modal field labels announced | P (text fields) | F (all fields) | P (all fields) |
| Decorative sort/trend icons | aria-hidden SVGs — P | aria-hidden SVGs — P | Unicode characters — F |

MUI earns 7 for perfect modal focus management (the most critical behavioral WCAG requirement tested), zero critical violations, and fewest contrast-affected nodes from library-default colors. Its heading failures are real but less severe than AntD's complete modal inaccessibility. Chakra earns 6 for the best heading structure and fewest axe penalty points, but loses ground on the broken focus trap and poor secondary color contrast (#a1a1aa = 2.56:1). AntD earns 5: modal focus never entering is a Level AA keyboard accessibility failure that makes the edit flow inaccessible without a pointing device; no h1 on any page; the most contrast-affected nodes; and VoiceOver announces no field labels in the modal because `Form.Item label` without `name` prop creates no programmatic label association.

### 4.3 Developer Experience (MUI 7.8 / AntD 7.0 / Chakra 4.8)

Measured via deliberate TypeScript misuse tests, Phase 2 implementation observations, and web research on community experience (2024–2026).

| Sub-dimension | MUI | AntD | Chakra |
|---|---|---|---|
| TypeScript type quality | 7 | 8 | 4 |
| API consistency | 9 | 7 | 6 |
| Documentation quality | 8 | 6 | 4 |
| Component API design & error feedback | 7 | 7 | 5 |

AntD produces the cleanest TypeScript error messages (single-line, no overload noise). MUI is the most API-consistent (`sx` and `slotProps` available uniformly; `variant`/`color`/`size` identical across components). Chakra v3 scored lowest: `colorPalette` accepts `string` with no type narrowing (a major visual prop with zero type safety), `DialogContentProps`/`FieldLabelProps` produce non-actionable cascade errors in TypeScript 5.9, and the `as` prop for polymorphic rendering silently does nothing in v3 with no TypeScript error and no runtime warning. Chakra's documentation launched incomplete for v3 and the migration guide from v2 was widely rated as inadequate for the scope of change.

### 4.4 Theming & Customization (MUI 9.0 / Chakra 7.8 / AntD 7.0)

Assessed from theme adapter source code, tokens.json coverage, and library architecture documentation.

| Sub-dimension | MUI | AntD | Chakra |
|---|---|---|---|
| Token system | 9 | 8 | 7 |
| Customization depth | 9 | 7 | 7 |
| Component variant system | 9 | 4 | 9 |
| Dark mode | 9 | 9 | 8 |

MUI and Chakra tie on the variant system (both provide first-class, theme-level variant APIs). AntD scores 4 on variants: there is no theme-level variant system — custom variants require wrapper components. AntD's three-tier token system (seed → map → alias) is architecturally comprehensive but requires understanding all three tiers to customise confidently. MUI's `createTheme` auto-derives all palette shades from a single `primary.main` value; full rebrand is achievable via the theme API alone. Chakra's recipe system is the most powerful for design-system-scale work but requires the most setup to unlock.

### 4.5 Ecosystem & Community (MUI 8.5 / AntD 8.5 / Chakra 5.5)

Sourced from npm registry API, GitHub API, library release blogs, and corporate profiles (data as of 2026-03-05).

| Sub-dimension | MUI | AntD | Chakra |
|---|---|---|---|
| npm weekly downloads | 7,828,330 | 2,886,476 | 1,099,911 |
| GitHub stars | 98,003 | 97,671 | 40,346 |
| User-facing components (approx.) | ~55–60 | ~60–65 | ~50–55 |
| Corporate backing | MUI SAS (self-sustaining) | Ant Group (Alibaba) | Seed-funded, small team |
| Breaking change stability | v6+v7 in 7 months — smaller scope | ~1 major/2–3 years | v2→v3 most disruptive of three |

MUI and AntD tie at 8.5 via different strengths: MUI dominates on downloads (2.7× AntD) and English-language community coverage; AntD leads on component breadth and corporate backing depth (Ant Group's full engineering organization). Chakra scores 5.5 — 40k stars shows real adoption, but a seed-funded single-leader project with a $1.5M raise and a v2→v3 migration that broke all APIs represents materially higher long-term risk compared to the other two.

### 4.6 Internationalization (AntD 9.0 / MUI 6.75 / Chakra 4.5)

Architectural assessment from library documentation and API analysis. Not implemented in any of the three apps.

| Sub-dimension | MUI | AntD | Chakra |
|---|---|---|---|
| RTL support | 6 — two extra packages required | 9 — `direction="rtl"` single prop | 5 — partial via CSS logical properties |
| Built-in locale strings | 7 — ~40 locales via `createTheme` | 10 — 70+ locales, broadest coverage | 3 — no locale API; owns no strings |
| Locale-aware components | 6 — MUI X only (extra package) | 9 — DatePicker/Calendar in core | 2 — none |
| i18n framework integration | 8 — clean separation | 8 — clean separation | 8 — clean separation |

AntD was built for Arabic and Hebrew markets from early versions and is the only library where RTL is a single provider prop, locale strings cover 70+ languages, and DatePicker/Calendar locale formatting is included in the core package. MUI covers the basics but relies on MUI X (separate install) for DatePicker locale support. Chakra owns almost no user-visible strings (it is a styling library), so there is effectively nothing to localize at the library level.

---

## 5. Weight sensitivity analysis

MUI leads under every tested weight distribution. The gap narrows when performance weight is reduced but never closes, because Chakra's DX score (4.8) is also well below the others and DX is the natural beneficiary of any performance de-weighting.

| Weight scenario | MUI | AntD | Chakra | MUI − AntD gap |
|---|---|---|---|---|
| **Actual** (Perf 30%, A11y 25%, DX 22%) | **7.83** | **6.38** | **5.57** | **1.45** |
| Perf 20%, DX 32% (DX-heavy) | 7.69 | 6.52 | 5.24 | 1.17 |
| Perf 20%, A11y 35% (A11y-heavy) | 7.63 | 6.23 | 5.77 | 1.40 |
| All criteria equal (16.7% each) | 7.51 | 6.92 | 5.68 | 0.59 |
| Perf 43%, A11y 28% (original weights) | 7.88 | 6.17 | 5.30 | 1.71 |

The only scenario that narrows the MUI–AntD gap below 0.6 points is equal weighting across all six criteria — a distribution that disregards the stated priority of the dashboard use case. Under the project's defined weights (CR = 0.02 from AHP), MUI leads by 1.45 points.

AntD's i18n strength (9.0, the highest single criterion score in the dataset) is neutralized by the 3% weight, contributing only 0.27 weighted points — the lowest single contribution of any score in the table.

---

## 6. Library profiles

### MUI v7 — 7.83

MUI is the most balanced library for a production SaaS dashboard. It leads on the two highest-weighted criteria (performance and accessibility) and delivers the strongest DX score. Its bundle is the lightest (289 kB gzip), FCP the fastest (444 ms), and runtime TBT the lowest (134 ms on dashboard). The theming system is mature: `createTheme` auto-derives all palette shades from one token, every component responds to token changes without JSX modifications, and custom variants are first-class TypeScript citizens. API consistency is the strongest of the three — `sx`, `slotProps`, `variant`, `color`, and `size` appear uniformly across the component set with identical naming. The main friction points are the four overlapping styling APIs that create decision fatigue, and the typography system that encourages breaking heading hierarchy.

**Best fit:** Teams that need proven production reliability, strong accessibility defaults, and broad English-language community support. The safest default choice for a SaaS dashboard product.

### Ant Design v5 — 6.38

AntD is the enterprise component library with the deepest locale and i18n story, the widest component set, and the strongest corporate backing. Its three-tier design token system is architecturally the most comprehensive, and its TypeScript error messages are the cleanest of the three. The performance penalty is structural and unavoidable: the exposed `rc-*` internal layer adds 120 kB gzip and 160 ms FCP on every page load. The most serious accessibility gap — keyboard focus never entering the modal — is a WCAG 2.4.3 Level AA failure that renders the edit flow inaccessible without a pointing device. AntD is the strongest choice for i18n-first products targeting Arabic, Hebrew, or CJK markets, where its `ConfigProvider` locale and `direction` APIs are the most capable of the three.

**Best fit:** Enterprise products with strong i18n requirements, teams primarily serving Chinese-market or global multilingual audiences, products where component breadth matters more than bundle size.

### Chakra UI v3 — 5.57

Chakra UI v3 has the strongest theming architecture on paper: semantic tokens as CSS custom properties, a first-class recipe system for component variants, and the best heading structure defaults of the three. However, the v3 rewrite introduced regressions that affect day-to-day development: TypeScript 5.9 incompatibilities with `DialogContentProps` and `FieldLabelProps` forced implementation workarounds; the `as` prop for polymorphic rendering was silently removed with no deprecation warning; and the hidden `@zag-js` runtime (295 kB unminified, not prominently documented) inflated the effective ecosystem cost to 49% larger than MUI's. The CSS-in-JS runtime produces the highest TBT on the dashboard (289 ms) and the only sub-90 Lighthouse score in the dataset. Chakra v3 is best suited to teams investing in a full design system who can commit to the semantic token setup upfront — it is not the path of least resistance for shipping a dashboard product quickly.

**Best fit:** Teams building a custom design system from the ground up who can invest in complete token definition and accept the current v3 rough edges. Not recommended for teams prioritising DX, performance under load, or minimal ramp-up time.

---

## 7. Measurement caveats

| Caveat | Impact |
|---|---|
| Single tester, single machine (MacBook Pro M1 Pro) | Performance figures may differ on other hardware; relative ranking expected to be stable |
| React Profiler interaction benchmarks not run | TBT is a proxy for INP; actual filter/sort/DnD interaction latency not directly measured |
| Shared implementation failures excluded from library scoring | dnd-kit nested-interactive, TanStack Table sort keyboard gap, primary token contrast (#1677ff) — attributed to project, not libraries |
| VoiceOver only (macOS); NVDA (Windows) not tested | Some ARIA behaviour may differ across screen reader / browser combinations |
| Dark mode not implemented in any app | Dark mode scores (theming sub-dimension 4) are architectural estimates, not runtime measurements |
| i18n not implemented in any app | i18n scores are documentation and API analysis only — no RTL runtime test performed |
