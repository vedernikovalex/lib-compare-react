# Evaluation Criteria — Revised Framework

## AHP derivation

The original 5-criterion framework was derived via AHP (Analytic Hierarchy Process) with CR = 0.02 (threshold 0.10 — consistent). The revised 6-criterion framework splits the former "Theming & i18n" category and redistributes weight from Performance to Developer Experience and Theming based on the rationale below.

New weights must be validated by re-running AHP with a 6×6 pairwise comparison matrix. Given the coherent reasoning, CR is expected to remain below 0.10.

---

## Criteria and weights

| Criterion | Weight | Key metrics |
|---|---|---|
| Performance & Bundle Size | 30% | Core Web Vitals (Lighthouse CI, 3 runs, median), JS bundle size (source-map-explorer), FCP, INP, CLS, TTI |
| Accessibility | 25% | axe-core automated score, WCAG 2.1 AA manual checklist, NVDA spot-check, keyboard navigation |
| Developer Experience | 22% | TypeScript type quality, API consistency, documentation score, learning curve, component API design |
| Theming & Customization | 12% | Token system depth, override granularity, dark mode, brand adaptation, slot/style APIs |
| Ecosystem & Community | 8% | Component count, npm weekly downloads, GitHub stars/issue response time, corporate backing |
| Internationalization | 3% | RTL layout support, built-in locale formatting, translation integration |

Scoring rule: score each criterion 1–10, multiply by weight, sum to get the overall score per library.

---

## Rationale for each criterion and its weight

### Performance & Bundle Size — 30% (down from 43%)

Performance is still the top criterion. It is the primary operational cost for a SaaS dashboard serving tables, charts, and DnD interactions in the browser.

Reduction from 43% to 30% is academically defensible for this specific experimental setup: three Vite SPAs loading identical mock data from a shared package, running on the same machine with no network variance. Bundle size and runtime performance between three production-grade, mature libraries will differ measurably — but likely narrowly. Assigning 43% to a criterion with expected low variance would allow noise-level differences to swing the overall winner, which is a validity threat a thesis examiner might flag.

The 13 percentage points are redistributed to Developer Experience and Theming, which are structurally more discriminating in this comparison.

"Bundle size" and "runtime performance" are distinct sub-dimensions measured with different tools and serve different decision factors. The measurement protocol treats them separately.

### Accessibility — 25% (down from 28%)

Still the second most important criterion. The minor reduction from 28% to 25% is purely for rebalancing; the rationale for its prominence is unchanged: accessibility is a legal/regulatory requirement in many markets, a genuine usability concern, and an academically credible differentiator largely ignored by existing library comparisons.

### Developer Experience — 22% (up from 16%)

Real engineering teams spend months or years inside these APIs daily. DX multiplies productivity long after the initial adoption decision. The 6-point increase is supported by direct empirical evidence from Phase 2 implementation:

- Chakra v3's `FieldLabelProps`/`DialogContentProps` had TypeScript 5.9 compatibility issues requiring workarounds.
- Ant Design's drag-handle patterns required API research not well-documented in official docs.
- MUI's component slot API and discriminated prop types were consistently better supported by IDE autocomplete.

At 16%, DX was barely differentiated from Ecosystem (8%) and could not meaningfully influence the outcome. At 22% it is competitive with Accessibility, which more accurately reflects how adoption decisions are made in practice.

### Theming & Customization — 12% (up from 5%, split from "Theming & i18n")

Theming and visual customization depth are primary reasons developers choose between these three libraries:

- MUI v7: `sx` prop + `createTheme`, deep slot-level overrides, comprehensive design token system.
- Ant Design v5: token-based theming was a major architectural rewrite vs. v4; component-level `styles` API.
- Chakra v3: `createSystem` with semantic tokens and recipe system — architecturally the most composable.

At 5%, a library scoring 10/10 on theming vs. 1/10 would shift the total score by only 0.45 points — making theming effectively irrelevant to the outcome, which contradicts how product teams actually evaluate libraries. At 12%, the criterion has meaningful influence.

"Internationalization" is separated into its own criterion because the two dimensions are orthogonal: a library can be excellent at theming while providing no RTL support.

### Ecosystem & Community — 8% (unchanged)

Two sub-dimensions, measured and recorded separately before being combined into a single score:
1. **Component breadth**: DatePicker, DataGrid, TreeSelect, ColorPicker, etc. — feature completeness for complex dashboard builds.
2. **Community & longevity**: npm weekly downloads, GitHub activity, corporate backing, breaking change philosophy — long-term adoption risk.

AntD leads on component breadth; MUI leads on npm downloads. Both facts are useful but answer different questions for the adopting team.

### Internationalization — 3% (new, split from "Theming & i18n")

Separated from Theming because i18n and theming measure orthogonal concerns. The 3% weight is intentionally small and honest: the test application does not deeply exercise RTL or locale-aware formatting. However, these are real enterprise dashboard requirements and deserve an explicit place in the framework so a library's i18n posture is on record, even if it cannot swing the overall result.

---

## Changes from original framework

| Criterion | Original weight | Revised weight | Change |
|---|---|---|---|
| Performance | 43% | 30% | -13% |
| Accessibility | 28% | 25% | -3% |
| Developer Experience | 16% | 22% | +6% |
| Theming & i18n (combined) | 5% | — | split |
| Theming & Customization | — | 12% | new |
| Ecosystem | 8% | 8% | unchanged |
| Internationalization | — | 3% | new |

Total redistribution: -16% from Performance + Accessibility → +6% DX, +7% Theming, +3% i18n.
