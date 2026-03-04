# Lighthouse Run 02 — CPU Throttle 4x

**Date:** 2026-03-02

## Run configuration

```json
{
  "numberOfRuns": 3,
  "settings": {
    "preset": "desktop",
    "onlyCategories": ["performance", "accessibility"],
    "skipAudits": ["uses-http2"],
    "throttlingMethod": "simulate",
    "throttling": {
      "cpuSlowdownMultiplier": 4,
      "requestLatencyMs": 0,
      "downloadThroughputKbps": 0,
      "uploadThroughputKbps": 0
    }
  }
}
```

CPU slowdown 4x. No network throttling — data is local mock, network variance would only add noise.

---

## Median results

| App | Route | Perf | A11y | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|
| AntD | `/` | 96 | 94 | 605 | 605 | 166 | 0.0000 |
| AntD | `/dashboard` | 92 | 91 | 605 | 752 | 223 | 0.0000 |
| AntD | `/kanban` | 94 | 96 | 605 | 605 | 196 | 0.0000 |
| Chakra | `/` | 95 | 94 | 484 | 484 | 190 | 0.0000 |
| Chakra | `/dashboard` | 88 | 93 | 482 | 541 | 289 | 0.0000 |
| Chakra | `/kanban` | 94 | 96 | 484 | 484 | 200 | 0.0000 |
| MUI | `/` | 100 | 92 | 446 | 483 | 11 | 0.0000 |
| MUI | `/dashboard` | 98 | 91 | 444 | 587 | 134 | 0.0000 |
| MUI | `/kanban` | 100 | 94 | 443 | 483 | 27 | 0.0000 |

---

## Comparison with Run 01 (no throttle)

### Performance score

| App | Route | Run 01 | Run 02 | Delta |
|---|---|---|---|---|
| AntD | `/` | 100 | 96 | -4 |
| AntD | `/dashboard` | 100 | 92 | **-8** |
| AntD | `/kanban` | 100 | 94 | -6 |
| Chakra | `/` | 100 | 95 | -5 |
| Chakra | `/dashboard` | 100 | 88 | **-12** |
| Chakra | `/kanban` | 100 | 94 | -6 |
| MUI | `/` | 100 | 100 | 0 |
| MUI | `/dashboard` | 100 | 98 | -2 |
| MUI | `/kanban` | 100 | 100 | 0 |

### TBT (ms) — the key differentiator

| App | Route | Run 01 | Run 02 | Multiplier |
|---|---|---|---|---|
| AntD | `/` | 4 | 166 | 42× |
| AntD | `/dashboard` | 24 | 223 | 9× |
| AntD | `/kanban` | 11 | 196 | 18× |
| Chakra | `/` | 0 | 190 | — |
| Chakra | `/dashboard` | 0 | 289 | — |
| Chakra | `/kanban` | 0 | 200 | — |
| MUI | `/` | 0 | 11 | — |
| MUI | `/dashboard` | 1 | 134 | 134× |
| MUI | `/kanban` | 0 | 27 | — |

### FCP (ms) — unchanged by CPU throttle (expected)

FCP is dominated by bundle download time, not JS execution. CPU throttling does not affect it.

| App | Run 01 avg | Run 02 avg | Delta |
|---|---|---|---|
| AntD | 605 | 605 | 0 |
| Chakra | 484 | 483 | -1 |
| MUI | 444 | 444 | 0 |

---

## Key findings

### 1. MUI is the clear performance winner

MUI scores 100/98/100 even under 4x CPU pressure. Its TBT on the dashboard (134ms) is the lowest of the three. On homepage and kanban it is essentially inert (11ms, 27ms TBT).

### 2. Chakra has the worst TBT despite the smallest bundle

Without throttling, Chakra showed 0ms TBT — appearing perfectly fast. Under 4x CPU load it reveals 190–289ms TBT across all routes. The dashboard is the worst at 289ms, the highest of any app on any route.

**Root cause:** Chakra v3 uses runtime CSS-in-JS (Emotion + its own `createSystem`). Every component computes and injects its styles at render time. On a fast CPU this is invisible; under CPU pressure it dominates the main thread. The dashboard page has many components (KPI cards, table rows, chart elements) making the cost additive.

### 3. AntD has high FCP but moderate TBT

AntD's bundle is the largest (~160ms slower FCP than MUI), but its runtime TBT (166–223ms) is lower than Chakra's. AntD v5 migrated from CSS-in-JS to CSS variables — styles are static at build time, so rendering cost does not scale with component count. The TBT comes from AntD's component initialisation logic, not style computation.

### 4. Dashboard is the most demanding route for all apps

Dashboard LCP is significantly higher than other routes for all three apps: AntD 752ms, Chakra 541ms, MUI 587ms. The table (210 rows), charts, and KPI cards create a larger paint workload. MUI's dashboard LCP (587ms) is actually higher than Chakra's (541ms) despite lower TBT — likely because MUI renders more DOM nodes for the same visual output.

### 5. CLS is perfect across the board

All apps score 0.0000 CLS on all routes. No layout instability regardless of throttling.

---

## Raw files

27 Lighthouse report files (3 runs × 9 URLs): `lhr-*.json` and `lhr-*.html`.
