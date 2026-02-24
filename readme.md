# lib-compare-react

Bachelor's thesis project comparing three React UI libraries — **MUI v7**, **Ant Design v5**, and **Chakra UI v3** — by building the same dashboard application three times and measuring each against identical criteria.

| Criterion                                 | Weight |
| ----------------------------------------- | ------ |
| Performance (Core Web Vitals, Lighthouse) | 43%    |
| Accessibility (WCAG 2.1 AA, axe, NVDA)    | 28%    |
| Developer Experience                      | 16%    |
| Ecosystem                                 | 8%     |
| Theming & i18n                            | 5%     |

---

## Apps

| App                     | Library       | Port |
| ----------------------- | ------------- | ---- |
| `apps/dashboard-antd`   | Ant Design v5 | 3001 |
| `apps/dashboard-chakra` | Chakra UI v3  | 3002 |
| `apps/dashboard-mui`    | MUI v7        | 3003 |

---

## Current state

Phase 2 complete. All three apps have:

- Routing with shared `AppLayout` and navigation
- **Homepage** — thesis intro, library comparison cards, evaluation criteria
- **Dashboard** — KPI cards, filterable/sortable table, line + bar charts
- **Kanban** — DnD columns (Todo / In Progress / Done), card edit modal
- Theme adapters mapping `packages/shared/src/theme/tokens.json` to each library's API
- Shared types, data fixtures, and translations in `packages/shared`

---

## Dev commands

```bash
# Run all three apps simultaneously
yarn dev:all

# Run individually
yarn workspace dashboard-antd dev    # port 3001
yarn workspace dashboard-chakra dev  # port 3002
yarn workspace dashboard-mui dev     # port 3003

# Other
yarn build   # all apps (parallel)
yarn lint    # all apps (parallel)
yarn test    # all apps (parallel)
```

---

## Monorepo structure

```
lib-compare-react/
├── apps/
│   ├── dashboard-antd/
│   ├── dashboard-chakra/
│   └── dashboard-mui/
├── packages/
│   └── shared/          # types, data fixtures, translations, theme tokens, hooks
├── docs/                # measurement artifacts and results
├── DOCUMENTATION.md     # architecture, patterns, conventions
└── CLAUDE.md            # project rules, roadmap, AI guidance
```

See `DOCUMENTATION.md` for full architecture reference.

---

## Tips

Update the same package across all three apps at once:

```bash
yarn workspaces foreach --all -v up typescript@latest
```
