# Lighthouse Run 01 — No Throttle

**Date:** 2026-03-02

## Run configuration

```json
{
  "numberOfRuns": 3,
  "settings": {
    "preset": "desktop",
    "onlyCategories": ["performance", "accessibility"],
    "skipAudits": ["uses-http2"],
    "throttlingMethod": "simulate (desktop preset default)",
    "cpuSlowdownMultiplier": 1,
    "requestLatencyMs": 0,
    "downloadThroughputKbps": 0,
    "uploadThroughputKbps": 0
  }
}
```

`preset: "desktop"` applies no CPU or network throttling. `cpuSlowdownMultiplier` defaults to 1 (no slowdown). `uses-http2` skipped — always fails on local servers, not relevant.

---

## Median results

| App | Route | Perf | A11y | FCP (ms) | LCP (ms) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|---|
| AntD | `/` | 100 | 94 | 606 | 606 | 4 | 0.0000 |
| AntD | `/dashboard` | 100 | 91 | 604 | 644 | 24 | 0.0000 |
| AntD | `/kanban` | 100 | 96 | 604 | 604 | 11 | 0.0000 |
| Chakra | `/` | 100 | 94 | 484 | 484 | 0 | 0.0000 |
| Chakra | `/dashboard` | 100 | 93 | 484 | 498 | 0 | 0.0000 |
| Chakra | `/kanban` | 100 | 96 | 483 | 483 | 0 | 0.0000 |
| MUI | `/` | 100 | 92 | 445 | 445 | 0 | 0.0000 |
| MUI | `/dashboard` | 100 | 91 | 444 | 473 | 1 | 0.0000 |
| MUI | `/kanban` | 100 | 94 | 443 | 483 | 0 | 0.0000 |

---

## Key observations

- **Performance score:** 100/100 for all apps on all routes. No differentiation — expected on a fast local machine with no throttling.
- **FCP ranking:** MUI (444ms) < Chakra (484ms) < AntD (605ms). Consistent across all three routes. ~160ms gap between MUI and AntD. Reflects bundle size differences.
- **LCP:** Mirrors FCP pattern. Dashboard LCP is higher than homepage for all apps (more content to paint: KPI cards, table, charts).
- **TBT:** AntD is the only library with non-zero TBT — 24ms on dashboard, 11ms on kanban, 4ms on homepage. Chakra and MUI are 0ms. Indicates AntD performs synchronous JS work during load that blocks the main thread.
- **CLS:** Perfect 0.0000 across all apps and routes.
- **Accessibility:** MUI scores slightly lower on homepage (92 vs 94). Dashboard scores lowest for all apps (91–93). Kanban scores highest (94–96).

## Limitations of this run

All performance scores are 100/100, making this run unsuitable for the performance criterion score. The raw FCP/LCP/TBT values are valid data points but the Lighthouse performance score cannot discriminate between the three libraries without throttling.

**Next run:** same config with `cpuSlowdownMultiplier: 4` to amplify signal — see `run-02-cpu-throttle-4x/`.

---

## Raw files

27 Lighthouse report files (3 runs × 9 URLs): `lhr-*.json` (machine-readable) and `lhr-*.html` (browser-viewable).
