# Ecosystem & Community — Thesis Chapter Draft

> Draft for direct use or adaptation in the thesis. All findings are based on npm registry data, GitHub API data, library release history, and corporate profiles — all sourced as of 2026-03-05. Tables are numbered continuing from Chapter 5.4 (last table: 5.22).

---

## 5.5 Ecosystem & Community

Ecosystem and community carry 8% of the total weight — the lowest of the five measured criteria, but not negligible. Choosing a UI library is a long-term commitment: the library will be present in the codebase for years, across multiple developers and product iterations. The health of the library's ecosystem — how many users are encountering the same problems, how complete its component set is, who maintains it, and how disruptive its upgrade path has been — determines whether that commitment represents a manageable or elevated adoption risk.

Four sub-dimensions are assessed: npm weekly downloads as a proxy for adoption depth, component breadth within the library's documented scope, corporate backing and longevity signals, and breaking change history as a measure of upgrade stability.

### 5.5.1 Measurement Approach

**npm downloads** were retrieved from the npm registry API for the week of 2026-02-26 to 2026-03-04. The packages measured are the primary install target for each library: `@mui/material`, `antd`, and `@chakra-ui/react`.

**Component count** was derived from source directory inspection on each library's GitHub repository, as the official documentation sites are JavaScript-rendered and cannot be scraped reliably. Directories were counted in the primary component source path for each library, with internal utilities, configuration files, and sub-components of a single user-facing component filtered out. Counts are approximate and represent user-facing components.

**Corporate backing and longevity** were assessed from publicly available corporate profiles, funding announcements, and maintainer communications.

**Breaking change history** was assessed from the official release notes and migration guides for each major version.

---

### 5.5.2 npm Downloads — Adoption Depth

**Table 5.23 — npm weekly downloads (week of 2026-02-26 to 2026-03-04)**

| Library | Package | Weekly Downloads | Relative to MUI |
|---|---|---|---|
| MUI | `@mui/material` | 7,828,330 | baseline |
| Ant Design | `antd` | 2,886,476 | 0.37× |
| Chakra UI | `@chakra-ui/react` | 1,099,911 | 0.14× |

MUI leads by a substantial margin — approximately 2.7× the weekly downloads of Ant Design and 7.1× those of Chakra UI. These figures reflect install activity across new projects, CI pipelines, and existing projects being rebuilt; they are a reasonable proxy for the active developer population using each library.

Download volume has direct implications for DX in practice. A larger user base means more issues filed and resolved on GitHub, more questions answered on Stack Overflow, more tutorials and blog posts available, and more LLM training data — making AI-assisted development (GitHub Copilot, Claude Code, Cursor) more reliable for MUI than for the others. When a developer encounters an edge case, the probability of finding a prior answer correlates with the community size. At 7.8 million weekly downloads, MUI's English-language community is substantially larger than the other two combined.

It should be noted that download counts do not directly measure quality or suitability for a specific use case. Ant Design dominates the Chinese-market React ecosystem in ways that npm downloads from Western registries do not fully capture. Its actual global usage — particularly in enterprise applications developed in China and Southeast Asia — is significantly higher than the download figures suggest.

---

### 5.5.3 Component Breadth

**Table 5.24 — Estimated user-facing component counts**

| Library | Estimated components | Notable inclusions | Notable gaps |
|---|---|---|---|
| MUI (core) | ~55–60 | Full form set, layout, data display, navigation, feedback | No DatePicker, DataGrid, or Charts in core |
| MUI X (commercial) | +20 advanced | DataGrid (MIT), DatePicker, Charts, TreeView | Commercial license for advanced tiers |
| Ant Design | ~60–65 | TreeSelect, Cascader, Transfer, ColorPicker, Tour, QRCode | All in core package, no commercial tier |
| Chakra UI | ~50–55 | Core layout, forms, overlays, composable primitives | No DatePicker, DataGrid, TreeSelect, Cascader |

Ant Design has the widest single-package component set of the three. Components that address enterprise dashboard requirements — `TreeSelect` for hierarchical data, `Cascader` for nested category selection, `Transfer` for moving items between lists, `TimePicker` for time input — are all included in the main `antd` package at no additional cost. Ant Design v5 also added `ColorPicker`, `Tour`, and `QRCode` components, reflecting continued investment in covering real-world enterprise UI patterns.

MUI's component breadth is competitive in the core package, but its most significant components for data-heavy applications — `DataGrid`, `DatePicker`, `Charts`, and `TreeView` — are part of MUI X, a separately licensed product. The `DataGrid` basic tier is MIT-licensed; the premium tier (row grouping, Excel export, pivoting) requires a commercial license. Teams evaluating MUI for a dashboard application must budget for this separately and account for a distinct dependency and update cycle.

Chakra UI's component set covers core application UI needs — form controls, modals, drawers, toasts, tabs, accordions — but lacks the specialised enterprise components found in AntD and MUI X. There is no built-in DatePicker, DataGrid, or TreeSelect. Teams building data-intensive dashboards on Chakra will require additional third-party libraries for these components, adding integration and maintenance overhead.

---

### 5.5.4 Corporate Backing and Longevity

**Table 5.25 — Corporate backing and sustainability**

| Library | Maintainer | Model | Team size | Years active | Major versions |
|---|---|---|---|---|---|
| MUI | MUI SAS (France) | Open-source core + commercial MUI X | 11–50 employees | 8+ years | 7 |
| Ant Design | Ant Group (Alibaba affiliate) | Fully MIT, internal design system | Large corporate engineering org | 11 years | 6 |
| Chakra UI | Segun Adebayo + community | Open-source core + Chakra UI Pro + Patreon | Small core team | 5 years | 3 |

#### MUI

MUI is maintained by MUI SAS, a French company with 11–50 full-time employees. No venture capital funding has been disclosed; the business is self-sustaining through revenue from MUI X, the commercial component tier (advanced DataGrid, DatePicker, Charts). This model creates a sustainable incentive structure: the core Material UI library remains MIT-licensed and receives continued investment because it serves as the user acquisition channel for MUI X. The library has been under active development for over eight years, through seven major versions, with the most recent (v6 and v7) released within seven months of each other. The consistent release cadence and commercial sustainability are strong longevity signals.

#### Ant Design

Ant Design is maintained by Ant Group, an affiliate of Alibaba Group and one of China's largest financial technology companies. The library is fully MIT-licensed with no commercial component tier — it functions as both Ant Group's internal design system and a public open-source contribution. Ant Group's 2024 R&D expenditure was reported at RMB 23.45 billion; Ant Design represents a fraction of that investment but benefits from the staffing and infrastructure of a major technology organization.

The longevity signal for Ant Design is the strongest of the three: 11 years of continuous development, 6 major versions, and deep internal usage across all Ant Group products. The library cannot be abandoned without Ant Group simultaneously abandoning its own internal product suite — a practical constraint that provides a level of maintenance continuity that neither of the other two libraries can match. Ant Design v6 was released in November 2025, confirming ongoing investment.

#### Chakra UI

Chakra UI was created and is led by Segun Adebayo. The project raised a $1.5M seed round to support sustainable open-source development. Revenue comes from Chakra UI Pro (premium component templates and blocks) and community Patreon support. The core team is small, and the project is meaningfully dependent on Adebayo's continued involvement.

The longevity risk for Chakra UI is higher than for the other two. Key-person dependency in open-source projects is a known adoption risk — maintainer burnout, a change of employer, or a shift in priorities can materially slow or halt development. The v2-to-v3 migration (October 2024) demonstrated a willingness to accept full API rewrites, which — while architecturally motivated — further concentrates migration risk in teams with large existing v2 codebases. Chakra UI's 40,000 GitHub stars and active community indicate genuine adoption, but the sustainability model is less robust than either of the other two.

---

### 5.5.5 Breaking Change History and Upgrade Stability

**Table 5.26 — Major version history and breaking change scope**

| Library | Major releases | Period | Most disruptive migration | Maintenance window per major |
|---|---|---|---|---|
| MUI | 7 (v1–v7) | 2018–2025 | v4→v5 (2021): JSS → Emotion, full theme rewrite | ~12 months |
| Ant Design | 6 (v1–v6) | 2015–2025 | v4→v5 (2022): Less → CSS-in-JS, token system rewrite | ~12 months (stated policy) |
| Chakra UI | 3 (v1–v3) | 2020–2024 | v2→v3 (2024): new styling engine, Ark UI primitives, Framer Motion removed, full API change | Not formally defined |

#### MUI

MUI has released seven major versions over eight years, a pace of roughly one major per year in recent releases. The most disruptive migration was v4 to v5 (September 2021), which replaced the JSS styling engine with Emotion and introduced a comprehensive theming rewrite. The migration was widely described by the community as painful — codemods were provided but could not automate all cases, and teams reported multi-month migration efforts for large codebases.

In response to this feedback, MUI deliberately reduced the scope of subsequent major releases. v6 (August 2024) and v7 (March 2025) were released within seven months of each other, each carrying a narrower set of breaking changes. The team has publicly stated a goal of smaller, more frequent majors rather than large accumulated rewrites. For teams on MUI v5, the upgrade path to v7 is significantly less disruptive than the v4→v5 migration was.

#### Ant Design

Ant Design's major releases are the least frequent of the three — roughly one every two to three years. Each major carries a formal one-year maintenance window for the prior version, giving teams predictable time to migrate. The most disruptive migration was v4 to v5 (November 2022), which replaced the Less-based styling system with CSS-in-JS (via `@ant-design/cssinjs`) and introduced the design token architecture. The migration guide was criticised as insufficient for the scope of the change, and the runtime performance implications of the CSS-in-JS engine were underdocumented. Ant Design v6 (November 2025) dropped support for React versions prior to 18 and removed all APIs that had been deprecated in v4, but was described by the maintainers as a comparatively smaller migration than v4→v5.

The lower major version pace means AntD teams face fewer forced migrations over time, and the formal maintenance window provides planning predictability that the other two libraries do not formally offer.

#### Chakra UI

Chakra UI has released only three major versions in five years, but the v2-to-v3 migration (October 2024) was the most disruptive of any library migration in this comparison. The scope of changes exceeded both MUI's v4→v5 and AntD's v4→v5:

- The styling engine was replaced entirely (Emotion-based → custom CSS variable system)
- Framer Motion was removed as a dependency (animations rewritten)
- The component composition model changed (standard components → Ark UI headless primitives)
- The theming API was replaced (`extendTheme` → `createSystem`)
- The recipe system replaced all variant APIs
- Gradual migration (running v2 and v3 side-by-side in the same application) is not supported

A `@chakra-ui/codemod` was published to automate some migration steps, but community feedback indicated it covered a fraction of real-world migration cases. Teams with large v2 codebases faced a complete rewrite of their component layer. No formal maintenance window for v2 was published.

The low total major version count (3) is not a signal of stability in this case — it reflects a project that accepts large architectural rewrites when they are deemed necessary, rather than one that manages change through frequent, smaller increments.

---

### 5.5.6 Analysis

MUI and Ant Design tie on the final criterion score (8.5) via complementary strengths. MUI has the largest download base, the most English-language community coverage, and a sustainable commercial business model. Ant Design has the strongest corporate backing, the widest in-package component set, the most predictable upgrade cadence, and the longest track record. Neither has a decisive overall advantage; the tie is an accurate reflection of two mature, well-resourced options at different points on the adoption curve.

Chakra UI's score of 5.5 reflects a genuine ecosystem gap relative to the other two — not a judgment on the library's technical quality. A small core team, a seed-round funding model, a component set that lacks enterprise specialised components, and the v2→v3 migration scope all represent higher adoption risk than either MUI or AntD. A team choosing Chakra for a multi-year product must accept that the migration risk profile is higher and that the community support network for edge cases is thinner.

The one area where Chakra's ecosystem position is stronger than the raw score suggests is the design system community. Chakra's recipe system and semantic token architecture have attracted a following among teams building custom design systems on top of a component primitive layer. For that specific use case, the ecosystem is richer than component counts or download volumes indicate.

---

### 5.5.7 Summary

**Table 5.27 — Ecosystem & Community sub-dimension scores**

| Sub-dimension | MUI | Ant Design | Chakra UI | Key differentiator |
|---|---|---|---|---|
| npm downloads / adoption | 10 | 7 | 5 | MUI 7.8M/week vs AntD 2.9M vs Chakra 1.1M |
| Component breadth | 8 | 9 | 6 | AntD: widest single-package; MUI: breadth via commercial MUI X; Chakra: no DatePicker or DataGrid |
| Corporate backing / longevity | 9 | 10 | 6 | AntD: Ant Group (Alibaba); MUI: self-sustaining commercial; Chakra: seed-funded, key-person risk |
| Breaking change stability | 7 | 8 | 5 | AntD slowest pace, formal maintenance window; MUI improved post-v5; Chakra v2→v3 most disruptive |

**Table 5.28 — Ecosystem & Community criterion summary**

| Library | Score (1–10) | Rationale |
|---|---|---|
| MUI | **8.5** | Largest English-language community (7.8M weekly downloads, ~3× AntD); self-sustaining commercial model via MUI X; 8+ years of continuous development. Debit: MUI X creates a two-tier component model where the most valuable data-grid and date-picker components sit behind a separate license. |
| Ant Design | **8.5** | Strongest corporate backing (Ant Group, fully MIT); widest in-package component set (~60–65); most predictable upgrade cadence (~1 major/2–3 years with formal maintenance window); 11 years of continuous development. Debit: Chinese-first origin limits English community support depth for edge cases. |
| Chakra UI | **5.5** | Real adoption (40k GitHub stars, 1.1M weekly downloads) but materially higher risk than the other two: small team, seed-funded, single-leader dependency, v2→v3 was the most disruptive migration in this comparison. Component set lacks enterprise specialised components. Not a poor library — a higher-risk adoption profile. |

---

*Evidence: `docs/results/2026-03-04/ecosystem-evidence.md`. Data sourced from npm registry API, GitHub API, and public corporate profiles as of 2026-03-05.*
