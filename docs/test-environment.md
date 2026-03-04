# Test Environment

Single reference for all measurement chapters. All Lighthouse, axe-core, bundle analysis, and React Profiler runs were performed on this machine under these conditions.

---

## Hardware

| Property | Value |
|---|---|
| Model | MacBook Pro |
| Identifier | MacBookPro18,3 |
| Chip | Apple M1 Pro |
| CPU cores | 8 (6 performance + 2 efficiency) |
| RAM | 16 GB |

---

## Software

| Property | Value |
|---|---|
| OS | macOS 26.0.1 |
| Node.js | 22.1.0 |
| Chrome | 145.0.7632.117 |
| Yarn | 4.10.2 |

---

## Measurement Conditions

| Condition | Value |
|---|---|
| Applications running simultaneously | Yes — all 3 preview servers active during Lighthouse collection |
| Other browser tabs during Lighthouse | None |
| Chrome mode | Headless (managed by Lighthouse CI) |
| Chrome profile | Clean — no extensions, no cached data from previous runs |
| Network | Local only — no external requests; all data served from shared in-memory fixture |
| Display | <!-- connected / lid closed / external monitor --> |

---

## Lighthouse CI Configuration

| Setting | Run 01 | Run 02 |
|---|---|---|
| Preset | desktop | desktop |
| CPU slowdown multiplier | 1 (no throttle) | **4×** |
| Network throttling | none | none |
| Runs per URL | 3 | 3 |
| URLs audited | 9 (3 apps × 3 routes) | 9 (3 apps × 3 routes) |
| Categories | performance, accessibility | performance, accessibility |
| Reported value | median of 3 runs | median of 3 runs |

Full config committed at `lighthouserc.json` in the repository root.

---

## Application Ports

| Application | Library | Port |
|---|---|---|
| dashboard-antd | Ant Design v5.26.6 | 3001 |
| dashboard-chakra | Chakra UI v3.23.0 | 3002 |
| dashboard-mui | MUI v7.2.0 | 3003 |

---

## Notes

- All three apps load data exclusively from `packages/shared/src/data/` — no network requests are made at runtime. This eliminates network variance as a confounding factor in performance measurements.
- CPU throttling was applied via Lighthouse's `simulate` throttling method, which models CPU slowdown without actually limiting the process. This is the same method used by Lighthouse's own `mobile` preset.
- Measurements were not repeated across multiple days. For a production measurement study, running across multiple sessions would reduce the influence of OS-level background processes. For this thesis, 3-run medians per URL are considered sufficient.
