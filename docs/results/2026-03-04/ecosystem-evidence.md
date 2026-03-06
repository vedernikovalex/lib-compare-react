# Ecosystem & Community — Evidence & Scoring Notes

Date: 2026-03-04
Sources: npm registry API, GitHub API, library release blogs, corporate profiles.

---

## Sub-dimension 1 — npm Downloads

Weekly download figures (week of 2026-02-26 to 2026-03-04, npm registry):

| Library | Package | Weekly Downloads |
|---|---|---|
| MUI | `@mui/material` | 7,828,330 |
| Ant Design | `antd` | 2,886,476 |
| Chakra UI | `@chakra-ui/react` | 1,099,911 |

MUI leads by ~2.7× over Ant Design and ~7× over Chakra UI.
Adoption at this scale is a strong signal of community-tested stability — more users means more issues filed, more workarounds documented, more Stack Overflow coverage.

---

## Sub-dimension 2 — Component Count

Approximate user-facing component counts derived from each library's source directories (JS-rendered docs not scrapable):

| Library | Source dirs | Estimated user-facing components |
|---|---|---|
| MUI | ~136 total (many are sub-components of one user-facing component) | ~55–60 |
| Ant Design | ~79 dirs (after removing internal dirs) | ~60–65 |
| Chakra UI | ~114 dirs (includes many primitives: Box, Flex, Em, Mark, Strong…) | ~50–55 |

Ant Design has the broadest documented single-package component set for enterprise use cases (TreeSelect, Cascader, Transfer, TimePicker, etc.).
MUI offers comparable breadth and adds MUI X for advanced components (DataGrid, DatePicker, Charts) under a commercial license.
Chakra UI's scope is smaller — it covers core UI needs well but lacks specialized components (no DataTable, no DatePicker in core, no advanced form controls).

---

## Sub-dimension 3 — GitHub Stars and Open Issues

Data as of 2026-03-05:

| Library | Repository | Stars | Open Issues |
|---|---|---|---|
| MUI | mui/material-ui | 98,003 | 1,723 |
| Ant Design | ant-design/ant-design | 97,671 | 1,381 |
| Chakra UI | chakra-ui/chakra-ui | 40,346 | 22 |

MUI and AntD both approach 100k stars — comparable community recognition.
Chakra UI's low open issue count (22) reflects aggressive issue triage and a smaller surface area after the v3 "snippets" architectural shift, not necessarily faster resolution.

---

## Sub-dimension 4 — Corporate Backing and Longevity

### MUI
- Entity: MUI SAS (French commercial open-source company)
- Revenue model: MIT core (Material UI, Joy UI, Base UI) + commercial MUI X tier (DataGrid, Charts, Date Pickers)
- Self-sustaining: no disclosed VC funding; MUI X revenue funds core development
- Team: 11–50 employees; active full-time maintainers
- Longevity signal: 8+ years of continuous development, 7 major versions; largest English-language community of the three

### Ant Design
- Entity: Maintained by Ant Group (Alibaba affiliate), one of China's largest fintech companies
- Model: Fully MIT — the library is a public good and Ant Group's internal design system; no commercial tier
- Backing: Ant Group's 2024 R&D spend was RMB 23.45 billion; AntD is a small slice of a very large engineering organization
- Longevity signal: 11 years (2015–present), 6 major versions, used internally across all Ant Group products — the library is unlikely to be abandoned
- Limitation: Chinese-first origin means English documentation and community support are thinner

### Chakra UI
- Entity: Created and led by Segun Adebayo; raised $1.5M seed round
- Revenue model: Open-source core + Chakra UI Pro (premium templates/blocks) + Patreon
- Team: Small core team; community contributions
- Longevity risk: Single-leader-dependent project with a small team; v3 was a full rewrite that broke v2 compatibility entirely — demonstrates willingness to accept large migrations
- Longevity signal: 5 years (2020–present), 3 major versions; ~40k GitHub stars shows real adoption

---

## Sub-dimension 5 — Breaking Change History

| Library | Major releases | Biggest breaking change | Pace |
|---|---|---|---|
| MUI | 7 (v1–v7, 2018–2025) | v4→v5 (2021): replaced JSS with Emotion, full theming rewrite — 2+ years of migration pain | ~1 major/year recently; v6 and v7 within 7 months, deliberately smaller scope after v5 feedback |
| Ant Design | 6 (v1–v6, 2015–2025) | v4→v5 (2022): CSS-in-JS rewrite, replaced Less, dropped IE 11 | ~1 major/2–3 years; each major has 1-year maintenance window for prior version |
| Chakra UI | 3 (v1–v3, 2020–2024) | v2→v3 (2024): full styling engine rewrite, new headless primitive layer (Ark UI), Framer Motion removed, all component APIs changed | Fewest total majors but largest per-release scope; v2→v3 the most disruptive migration of the three |

---

## Proposed scores

| Sub-dimension | MUI | AntD | Chakra | Notes |
|---|---|---|---|---|
| npm downloads / adoption | 10 | 7 | 5 | 7.8M vs 2.9M vs 1.1M — MUI clear leader |
| Component breadth | 8 | 9 | 6 | AntD widest single-package set; MUI strong with MUI X; Chakra limited on advanced components |
| Corporate backing / longevity | 9 | 10 | 6 | AntD: major corporation; MUI: self-sustaining business; Chakra: seed-funded small team |
| Breaking change stability | 7 | 8 | 5 | AntD fewest disruptions per year; MUI improved post-v5; Chakra v2→v3 was most disruptive |
| **Average (Ecosystem score)** | **8.5** | **8.5** | **5.5** | |
