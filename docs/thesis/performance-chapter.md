# Performance & Bundle Size — Thesis Chapter Draft

> This is a draft for direct use or adaptation in the thesis. Tables are complete and based on measured data. Sections marked <!-- TODO --> require environment details to be filled in before submission.

---

## 5.1 Performance & Bundle Size

Performance is the highest-weighted criterion in this evaluation (30%), reflecting the operational requirements of a SaaS dashboard application. A dashboard that handles real-time data, interactive tables with hundreds of rows, drag-and-drop interfaces, and multiple charts must remain responsive under sustained use. Two dimensions of performance are measured separately: **bundle size**, which determines how fast the application can begin rendering on first load, and **runtime performance**, which determines how efficiently the library handles user interactions and complex component trees after load.

### 5.1.1 Measurement Approach

Performance was measured using two complementary tools: **Lighthouse CI** (`@lhci/cli` v0.15.1) for runtime metrics, and **rollup-plugin-visualizer** v7.0.0 for bundle composition analysis.

**Lighthouse CI** is the automated auditing tool developed and maintained by Google as part of the Chrome DevTools ecosystem. It was run against production builds of all three applications served locally via `vite preview`.

**rollup-plugin-visualizer** instruments the Rollup/Vite build pipeline and generates a per-module size report from the final production bundle, enabling precise attribution of bundle bytes to individual packages.

Each application was built using `vite build` and served on a dedicated port:

| Application | Library | Port |
|---|---|---|
| dashboard-antd | Ant Design v5 | 3001 |
| dashboard-chakra | Chakra UI v3 | 3002 |
| dashboard-mui | MUI v7 | 3003 |

Three routes were audited per application — homepage (`/`), dashboard (`/dashboard`), and kanban (`/kanban`) — covering the full surface area of the implemented features. Each URL was audited three times per run, and the **median value** across three runs is reported for all metrics. Using the median rather than the mean reduces the impact of outlier runs caused by background system activity.

The following Lighthouse metrics were collected:

| Metric | Abbreviation | Unit | Description |
|---|---|---|---|
| First Contentful Paint | FCP | ms | Time until the first text or image is painted |
| Largest Contentful Paint | LCP | ms | Time until the largest visible element is painted |
| Total Blocking Time | TBT | ms | Total time the main thread was blocked during load |
| Cumulative Layout Shift | CLS | unitless | Visual stability — unexpected layout movement |
| Lighthouse Performance Score | Perf | 0–100 | Weighted composite of the above metrics |

**Note on INP (Interaction to Next Paint):** INP is the newest Core Web Vital and measures responsiveness to user gestures. Lighthouse CI cannot measure INP reliably as it requires real user input during the audit; TBT serves as its proxy in automated Lighthouse runs. A separate React Profiler benchmark measuring actual interaction render time is planned as a complementary measurement.

### 5.1.2 Test Environment

Full hardware and software specifications are documented in `docs/test-environment.md`. Summary relevant to this chapter:

| Variable | Value |
|---|---|
| Machine | MacBook Pro, Apple M1 Pro, 8 cores, 16 GB RAM |
| OS | macOS 26.0.1 |
| Node.js | 22.1.0 |
| Chrome | 145.0.7632.117 |
| `@lhci/cli` | 0.15.1 |
| `rollup-plugin-visualizer` | 7.0.0 |
| Vite (build tool) | 7.0.6 (MUI, Chakra) / 7.2.2 (AntD) |

All three applications were running simultaneously during collection. No other browser tabs were open. Chrome was run in headless mode by Lighthouse CI, in a clean profile with no extensions.

### 5.1.3 Throttling Rationale

Two Lighthouse collection runs were performed with different CPU throttling settings:

**Run 1 — No throttle (baseline).** The Lighthouse `desktop` preset was used with no CPU or network throttling. This reflects the performance characteristics of the applications on the developer's machine, and serves as a baseline to confirm that differences observed under throttling are genuine and not artefacts of the throttling simulation.

**Run 2 — CPU throttle 4× (primary measurement).** A CPU slowdown multiplier of 4 was applied with no network throttling. The 4× CPU multiplier is the same factor used by Lighthouse's own `mobile` preset simulation and is a well-established reference point in the web performance literature. Network throttling was deliberately excluded: all three applications load data from a shared in-memory fixture with no network requests, so network throttling would introduce variance without adding signal.

The rationale for throttling is methodological: on a modern developer machine, all three applications load in under 650 ms and receive a Lighthouse Performance score of 100/100. While the raw FCP and TBT values differ, a score of 100/100 across the board cannot be used for comparison. CPU throttling simulates the experience on a mid-range device, amplifies genuine differences in JS parsing and runtime execution cost, and produces differentiated scores that can be meaningfully compared.

---

### 5.1.4 Results — Run 1: No Throttle (Baseline)

**Table 5.1 — Lighthouse medians, no CPU throttle (desktop preset, 3 runs per URL)**

| App | Route | Perf | A11y | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|
| Ant Design | `/` | 100 | 94 | 606 | 606 | 4 | 0.0000 |
| Ant Design | `/dashboard` | 100 | 91 | 604 | 644 | 24 | 0.0000 |
| Ant Design | `/kanban` | 100 | 96 | 604 | 604 | 11 | 0.0000 |
| Chakra UI | `/` | 100 | 94 | 484 | 484 | 0 | 0.0000 |
| Chakra UI | `/dashboard` | 100 | 93 | 484 | 498 | 0 | 0.0000 |
| Chakra UI | `/kanban` | 100 | 96 | 483 | 483 | 0 | 0.0000 |
| MUI | `/` | 100 | 92 | 445 | 445 | 0 | 0.0000 |
| MUI | `/dashboard` | 100 | 91 | 444 | 473 | 1 | 0.0000 |
| MUI | `/kanban` | 100 | 94 | 443 | 483 | 0 | 0.0000 |

The Performance score is 100/100 for every application on every route, making the composite score useless as a comparative metric at this throttle level. However, the raw metrics already reveal consistent patterns.

**FCP** shows a clear and stable ranking across all three routes: MUI (~444 ms) is the fastest, Chakra UI (~484 ms) is in the middle, and Ant Design (~605 ms) is the slowest — approximately 160 ms slower than MUI. Because FCP precedes any JavaScript execution, it is a direct proxy for bundle download and parse cost: Ant Design ships a heavier bundle which the browser must parse before the first paint can occur.

**TBT** in this run is near-zero for Chakra UI and MUI (0–1 ms). Ant Design is the only library with measurable TBT: 4 ms on the homepage, 24 ms on the dashboard, and 11 ms on the kanban page. While these values are small in absolute terms, the pattern suggests Ant Design performs synchronous initialisation work that blocks the main thread, particularly on the more complex dashboard route.

**CLS** is 0.0000 for all three applications on all routes, indicating perfect layout stability with no unexpected shifts.

---

### 5.1.5 Results — Run 2: CPU Throttle 4× (Primary Measurement)

**Table 5.2 — Lighthouse medians, 4× CPU throttle, no network throttle (3 runs per URL)**

| App | Route | Perf | A11y | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|
| Ant Design | `/` | 96 | 94 | 605 | 605 | 166 | 0.0000 |
| Ant Design | `/dashboard` | 92 | 91 | 605 | 752 | 223 | 0.0000 |
| Ant Design | `/kanban` | 94 | 96 | 605 | 605 | 196 | 0.0000 |
| Chakra UI | `/` | 95 | 94 | 484 | 484 | 190 | 0.0000 |
| Chakra UI | `/dashboard` | 88 | 93 | 482 | 541 | 289 | 0.0000 |
| Chakra UI | `/kanban` | 94 | 96 | 484 | 484 | 200 | 0.0000 |
| MUI | `/` | 100 | 92 | 446 | 483 | 11 | 0.0000 |
| MUI | `/dashboard` | 98 | 91 | 444 | 587 | 134 | 0.0000 |
| MUI | `/kanban` | 100 | 94 | 443 | 483 | 27 | 0.0000 |

---

### 5.1.6 Analysis

#### Bundle Size — Composition Analysis

Bundle composition was analysed using `rollup-plugin-visualizer` v7.0.0, which instruments the Vite/Rollup build pipeline and produces a per-module size report from the final production bundle. Two size measurements are reported: **parsed** (pre-minification module sizes from the visualizer, used for composition analysis) and **gzip** (post-minification sizes from build output, representing actual download cost).

**Table 5.3 — Production bundle sizes**

| Library | Parsed (kB) | Gzip (kB) | vs MUI |
|---|---|---|---|
| MUI | 942 | 289 | baseline |
| Chakra UI | 1,065 | 318 | +10% (+29 kB gzip) |
| Ant Design | 1,312 | 409 | **+42% (+120 kB gzip)** |

Gzip size is the actual payload delivered to users. MUI is the lightest at 289 kB, Chakra UI adds 10% overhead (+29 kB), and Ant Design is 42% heavier than MUI — a 120 kB gzip penalty that translates directly into a longer FCP.

All three bundles share an identical baseline of non-UI dependencies: `recharts` (603.8 kB unminified), `react-dom` (527.1 kB), `@tanstack/react-table` (117.0 kB), `@dnd-kit/core` (87.6 kB), `react-router` (77.6 kB), and several recharts internals including a D3 subset and — unexpectedly — `@reduxjs/toolkit` and `immer`, which recharts v3 bundles internally. This shared baseline totals approximately 1,707 kB unminified and is not a differentiating factor between the three libraries. The sole differentiating variable is the UI library ecosystem cost.

**Table 5.4 — UI library ecosystem breakdown (pre-minification)**

| Library | Ecosystem size (kB) | % of total bundle |
|---|---|---|
| MUI | ~489 | ~21% |
| Chakra UI | ~727 | ~28% |
| Ant Design | ~1,277 | ~40% |

**MUI's ecosystem (~489 kB unminified)** is the most efficient of the three. Its primary components — `@mui/material` (321.9 kB), `@mui/system` (105.0 kB), and `@mui/utils` (28.8 kB) — are fully encapsulated with no internal layer exposed separately. The Emotion CSS-in-JS runtime (`@emotion/react` + `@emotion/styled` + supporting packages) contributes approximately 33 kB, countering the common perception that Emotion is a significant bundle cost.

**Chakra UI's ecosystem (~727 kB unminified)** is 49% larger than MUI's. The primary source of overhead is `@zag-js`, the state machine library that Chakra v3 uses internally to implement interactive component behaviour. It ships as 15+ separate packages (`@zag-js/combobox`, `@zag-js/menu`, `@zag-js/select`, and others) totalling approximately 295 kB unminified — nearly as large as `@chakra-ui/react` itself (311 kB). Notably, `@zag-js` is present in the bundle even for components not used by the application, indicating that tree-shaking at the `@zag-js` level is incomplete. This dependency is not prominently documented in Chakra v3's official documentation; teams evaluating the library's bundle cost would not typically account for it.

**Ant Design's ecosystem (~1,277 kB unminified)** is the heaviest by a substantial margin, accounting for 40% of the total bundle. The principal cost is Ant Design's two-layer internal architecture: the `antd` package of user-facing components (632.3 kB) is built on top of a separate layer of headless `rc-*` primitive packages (486.8 kB combined: rc-table, rc-select, rc-input, rc-menu, and others). Both layers are fully present in the end user's bundle, for a combined `antd` + `rc-*` cost of approximately 1,119 kB unminified. MUI and Chakra UI do not expose this internal layering — their primitive implementations are encapsulated. An additional 52 kB comes from `@ant-design/cssinjs`, the CSS-in-JS runtime engine retained from Ant Design v5's styling architecture despite its overall move toward CSS variables.

#### FCP — Bundle Size Signal

**Table 5.5 — Average FCP across routes (ms), both runs**

| Library | Run 1 (no throttle) | Run 2 (4× CPU) | Change |
|---|---|---|---|
| MUI | 444 | 444 | 0 |
| Chakra UI | 484 | 483 | -1 |
| Ant Design | 605 | 605 | 0 |

FCP is entirely unaffected by CPU throttling. This is expected: FCP measures the time until the browser paints the first content, which is governed by network transfer time and initial HTML/CSS parsing — both of which are unrelated to JavaScript execution speed. The consistent FCP values across both runs confirm that the observed differences between libraries are a stable property of their bundle sizes, not measurement noise.

The correlation between gzip bundle size and FCP is linear and consistent across all three libraries: approximately **1.3–1.4 ms of FCP cost per additional kB of gzipped JavaScript**. Chakra UI's 29 kB gzip premium over MUI corresponds to a 40 ms FCP difference; Ant Design's 120 kB premium corresponds to a 161 ms difference. This relationship allows bundle size differences to be translated directly into expected load time penalties.

The ~160 ms gap between MUI (289 kB gzip) and Ant Design (409 kB gzip) represents a fixed cost paid by every user on every page load, regardless of device capability or network speed. Module-level analysis attributes this primarily to Ant Design's exposed `rc-*` internal layer (486.8 kB unminified), a structural cost that cannot be tree-shaken away.

#### TBT — Runtime Blocking Cost

**Table 5.6 — TBT on `/dashboard` route (ms), both runs**

| Library | Run 1 (no throttle) | Run 2 (4× CPU) | Amplification |
|---|---|---|---|
| MUI | 1 | 134 | 134× |
| Ant Design | 24 | 223 | 9× |
| Chakra UI | 0 | 289 | — |

TBT is the metric most sensitive to CPU throttling and reveals the most substantive difference between the three libraries.

The most notable finding is **Chakra UI's dashboard TBT of 289 ms** — the highest of any application on any route, and significantly higher than both MUI (134 ms) and Ant Design (223 ms). This is counterintuitive because Chakra UI showed 0 ms TBT in Run 1, suggesting it was the best performer at full CPU speed. The reversal under throttling has a clear architectural explanation: Chakra UI v3 uses runtime CSS-in-JS (built on Emotion) combined with its own `createSystem` style engine. Every component computes and injects its CSS into the document at render time. On the dashboard page — which renders a KPI card grid, a 210-row paginated table, two charts, and a navigation bar — this per-component style computation becomes additive. Under CPU pressure, the cost of this style computation dominates the main thread.

**Ant Design v5** shows consistently elevated TBT across all routes (166–223 ms) compared to MUI, but lower than Chakra UI. Ant Design v5 completed a significant architectural migration: it replaced its previous CSS-in-JS approach with CSS variables, meaning component styles are generated at build time rather than computed at runtime. The remaining TBT in Ant Design likely originates from its component initialisation logic and the larger total JS to be parsed, not from runtime style computation.

**MUI** delivers the lowest TBT at 4× throttle (11–134 ms). MUI also uses Emotion for styling, which raises the question of why it outperforms Chakra UI so substantially. The likely explanation is component complexity: MUI's component internals tend to produce fewer style injections per component than Chakra UI's composable primitive system, which wraps even simple elements in multiple styled layers.

#### Performance Score — Composite

**Table 5.7 — Lighthouse Performance Score, Run 2 (4× CPU throttle)**

| Library | `/` | `/dashboard` | `/kanban` | Average |
|---|---|---|---|---|
| MUI | 100 | 98 | 100 | **99.3** |
| Ant Design | 96 | 92 | 94 | **94.0** |
| Chakra UI | 95 | 88 | 94 | **92.3** |

The composite Lighthouse Performance Score, which weights FCP, LCP, TBT, and CLS, produces a clear and consistent ranking: MUI leads, followed by Ant Design, with Chakra UI in third place. The dashboard route — the most complex page with the heaviest component tree — produces the largest spread (98 vs 92 vs 88), confirming that performance differences scale with application complexity.

The 10-point gap between Chakra UI and MUI on the dashboard route (88 vs 98) is a practically significant finding. In Google's performance scoring model, a score below 90 is categorised as "needs improvement", while 90–100 is "good". Under the 4× CPU throttle simulation, Chakra UI's dashboard falls into the "needs improvement" category while MUI remains "good".

#### Accessibility Score — Lighthouse Supplementary Data

**Table 5.8 — Lighthouse Accessibility Score (all runs consistent)**

| Library | `/` | `/dashboard` | `/kanban` |
|---|---|---|---|
| MUI | 92 | 91 | 94 |
| Ant Design | 94 | 91 | 96 |
| Chakra UI | 94 | 93 | 96 |

Lighthouse accessibility scores are consistent across Run 1 and Run 2, as expected — accessibility is not affected by CPU throttling. These scores are supplementary data; the primary accessibility evaluation uses axe-core and a manual WCAG 2.1 AA checklist (see Chapter 5.2).

MUI scores slightly lower on the homepage (92 vs 94) and kanban (94 vs 96) compared to Ant Design and Chakra UI. All three score identically on the dashboard (91). These differences are small; the detailed accessibility chapter provides a more granular breakdown.

#### Layout Stability

All three applications achieve CLS = 0.0000 on every route in both runs. No library introduces layout instability. This is attributed to the use of fixed-size containers for the KPI card grid and chart components, and to the fact that no external fonts or images are loaded asynchronously.

---

### 5.1.7 Discussion

The results reveal two distinct performance failure modes, each attributable to a specific architectural decision:

**Ant Design's weakness is bundle size.** The ~160 ms FCP penalty (289 kB vs 409 kB gzip) persists regardless of throttling, meaning it is a fixed cost paid by every user on every page load. Module-level analysis identifies the source as Ant Design's two-layer architecture: the `rc-*` internal primitive layer (486.8 kB unminified) is exposed to the end-user bundle alongside the `antd` component layer itself (632 kB), for a combined ~1,119 kB before any other dependencies. This is a structural property of Ant Design's architecture rather than a tree-shaking deficiency. However, Ant Design's runtime TBT under throttling is lower than Chakra UI's, indicating that its v5 migration to CSS variables was architecturally sound for runtime efficiency.

**Chakra UI's weakness is runtime style computation.** Its fast FCP (484 ms, 29 kB gzip over MUI) suggests a reasonably compact bundle, but the CSS-in-JS runtime cost becomes a liability under CPU pressure. A dashboard's performance is not only about initial load — it is about sustained responsiveness as the user interacts with filters, sorts columns, and drags Kanban cards. Runtime style recalculation triggered by re-renders adds latency to every interaction, and this cost compounds with component tree depth. Chakra UI's dashboard scoring 88/100 under a standard 4× throttle is a meaningful finding for teams considering it for data-heavy applications. Additionally, the hidden `@zag-js` overhead (~295 kB unminified, 15+ packages) means Chakra's true ecosystem cost is 49% larger than MUI's — a cost that is not visible from the library's documentation or top-level package size alone.

**MUI's performance profile is the most balanced.** Its bundle size is the smallest (289 kB gzip, ~489 kB unminified ecosystem), and its runtime TBT is the lowest despite also using Emotion for styling. The Emotion CSS-in-JS runtime itself contributes only ~33 kB — a negligible fraction that does not support the claim that CSS-in-JS is inherently a bundle-size liability. MUI's architectural advantage appears to stem from fewer, more targeted style injections per component rather than from a fundamentally different styling approach.

---

### 5.1.8 Summary

**Table 5.9 — Performance & Bundle Size criterion summary**

| Metric | Winner | Runner-up | Third |
|---|---|---|---|
| Gzip bundle size | MUI (289 kB) | Chakra UI (318 kB, +10%) | Ant Design (409 kB, +42%) |
| UI library ecosystem | MUI (~489 kB unminified) | Chakra UI (~727 kB) | Ant Design (~1,277 kB) |
| FCP (bundle size signal) | MUI (444 ms) | Chakra UI (484 ms) | Ant Design (605 ms) |
| TBT on dashboard | MUI (134 ms) | Ant Design (223 ms) | Chakra UI (289 ms) |
| Performance score avg | MUI (99.3) | Ant Design (94.0) | Chakra UI (92.3) |
| CLS | All equal (0.0000) | — | — |

**Proposed criterion score (Performance & Bundle Size, weight 30%):**

| Library | Score (1–10) | Rationale |
|---|---|---|
| MUI | **8** | Smallest bundle (289 kB gzip), fastest FCP (444 ms), lowest TBT (134 ms dashboard), 99.3 average performance score under 4× throttle; leanest UI ecosystem (~489 kB unminified) |
| Ant Design | **6** | Largest bundle (409 kB gzip, +42% vs MUI) due to exposed rc-* internal layer; consistent FCP penalty; moderate TBT (223 ms); runtime rendering efficient thanks to CSS variable architecture |
| Chakra UI | **5** | Competitive bundle size (318 kB gzip) but significant hidden ecosystem cost (@zag-js ~295 kB, total ~727 kB); CSS-in-JS runtime produces the highest TBT (289 ms dashboard) and lowest performance score (88) under throttling |

---

*Raw Lighthouse reports (JSON + HTML) stored in `docs/lighthouse/run-01-no-throttle/` and `docs/lighthouse/run-02-cpu-throttle-4x/`. Bundle composition reports stored in `docs/bundles/`. Lighthouse CI configuration committed at `lighthouserc.json`; bundle analysis scripts at `scripts/analyze-bundles.mjs`.*
