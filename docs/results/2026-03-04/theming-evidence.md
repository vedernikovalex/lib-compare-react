# Theming & Customization — Evidence & Scoring Notes

Date: 2026-03-04
Assessed from: theme adapter source code, tokens.json, library architecture documentation.

---

## Theme adapters implemented (Phase 2)

All three adapters read from `packages/shared/src/theme/tokens.json`.

### tokens.json coverage per adapter

| Token category | tokens.json defines | MUI mapped | AntD mapped | Chakra mapped |
|---|---|---|---|---|
| Primary color | `colors.primary` | ✓ | ✓ | ✓ (brand.500) |
| Hover/active states | `colors.primaryHover/Active` | Auto-derived | Auto-derived | ✓ (brand.600) |
| Semantic colors | success, warning, error | ✓ | ✓ | ✗ |
| Gray scale | gray50–gray900 | ✗ | ✗ | ✗ |
| Border radius | `borderRadius.md` | ✓ | ✓ | ✓ |
| Base font size | `fontSize.base` | ✓ | ✓ | ✓ |
| Spacing scale | `spacing.*` | ✗ | ✗ | ✗ |
| Font weight | `fontWeight.*` | ✗ | ✗ | ✗ |
| Line height | `lineHeight.*` | ✗ | ✗ | ✗ |
| Shadows | `shadow.*` | ✗ | ✗ | ✗ |

All three adapters map the same minimal subset: primary color + semantic colors + borderRadius + fontSize. Spacing, typography scale, and shadows are not wired in any app — these use each library's own defaults.

---

## Sub-dimension 1 — Token System

### MUI
- `createTheme` provides a structured token hierarchy: `palette`, `typography`, `shape`, `spacing`, `shadows`, `breakpoints`
- Setting `palette.primary.main` automatically derives all shades (`light`, `dark`), plus hover, active, focus, disabled states — no manual variant calculation needed
- Fully typed: IDE autocomplete shows every valid token name and type
- Token cascade is comprehensive — all components respond to palette/typography/shape changes without touching JSX
- Can be extended via TypeScript module augmentation to add custom tokens that appear in autocomplete
- Limitation: spacing and shadows not mapped from tokens.json in our adapter — uses MUI defaults

### Ant Design
- v5 introduced a formal three-tier token system: seed tokens (global) → map tokens (derived) → alias tokens (component-specific)
- `ConfigProvider token` API is typed via `ThemeConfig` — all ~100+ token names accessible with autocomplete
- Setting `colorPrimary` cascades through every component automatically — one of the most comprehensive token systems of the three
- Component-level token overrides available via `components.Button.token`, etc. — granularity goes down to individual component
- Limitation: the three-tier hierarchy is powerful but the relationship between tiers requires documentation to understand; customising without knowing which tier to target is non-obvious

### Chakra UI
- v3's `createSystem` with semantic tokens is architecturally the most flexible — tokens become CSS custom properties at runtime
- Supports color scales (50–950) and semantic token aliases (e.g., `colors.brand.solid` maps to a specific scale value)
- The `colorPalette` prop consumes these scales to recolor any component with one prop
- Limitation: our adapter only mapped `brand.500/600` — the full semantic token setup requires defining the complete scale, which is significantly more setup than MUI's `palette.primary.main`
- Limitation: semantic colors (success/warning/error) not mapped — Chakra uses its own defaults for status colors

---

## Sub-dimension 2 — Customization Depth

Can the entire dashboard be rebranded purely through the theme API with zero per-component CSS overrides?

### MUI
- `palette.primary.main` → all Buttons, links, focused inputs, active states update automatically ✓
- `shape.borderRadius` → all Cards, Dialogs, Chips, Buttons update ✓
- `typography.fontSize` → base size propagates ✓
- `theme.components.MuiButton.styleOverrides.root` → override any button property at theme level without touching JSX ✓
- `slotProps` + `styleOverrides` allow targeting internal component slots (input, label, adornment) at theme level
- In Phase 2: all styling done through `muiTheme.ts` and `sx` prop — no direct className or CSS required
- **Verdict: full rebrand achievable via theme API alone**

### Ant Design
- `token.colorPrimary` → comprehensive cascade through all components ✓
- `token.borderRadius` and `token.fontSize` → global propagation ✓
- Component-level overrides via `ConfigProvider.components.Button.style` — works at provider level
- v5 CSS variables mean token changes are predictable and immediate
- Some layout overrides (table row padding, form item gap) require per-instance `style` prop or global CSS targeting AntD class names
- **Verdict: rebrand mostly achievable via theme API; a small number of spacing/layout overrides require className targeting**

### Chakra UI
- `createSystem` semantic tokens propagate through all components via CSS variables ✓
- Recipe system allows full component style redefinition at theme level
- Limitation: our adapter's incomplete semantic color mapping means status colors (error, success tags) use defaults that don't come from tokens.json
- The composable `Root/Field/Indicator` pattern gives theme-level control of each sub-element
- **Verdict: architecturally the most powerful for full rebrand, but requires the most setup to achieve it**

---

## Sub-dimension 3 — Component Variant System

Does the library provide a first-class API for defining reusable component variants at the theme level?

### MUI
- `theme.components.MuiButton.variants` array in `createTheme`:
  ```ts
  variants: [
    { props: { variant: 'danger' }, style: { backgroundColor: tokens.colors.error } }
  ]
  ```
- TypeScript: custom variants can be augmented into the type system so `<Button variant="danger">` has autocomplete
- Works for any MUI component via `theme.components.<ComponentName>.variants`
- **Verdict: first-class, typed, works across the component set**

### Ant Design
- No dedicated variant system at the theme level
- Component styles can be overridden globally via `ConfigProvider.components.Button.style`, but this applies to all buttons, not a named variant
- Custom variants require creating wrapper components (e.g., `<DangerButton>` wrapping `<Button>` with `danger` prop or custom style)
- AntD's `danger` prop is a built-in special case, not a user-extensible pattern
- **Verdict: no theme-level variant system — custom variants require wrapper components**

### Chakra UI
- Recipe system via `createSystem`:
  ```ts
  recipes: {
    button: defineRecipe({
      variants: { visual: { danger: { bg: 'red.500', color: 'white' } } }
    })
  }
  ```
- Most powerful of the three — full token access inside recipe definitions, can define multi-property variants
- Applies to all component instances automatically once defined in the system
- **Verdict: most capable variant system — first-class, token-aware, scales to design system use**

---

## Sub-dimension 4 — Dark Mode

Dark mode not implemented in any of the three apps. Assessment is architectural + LOC estimate based on each library's documented approach.

### MUI
- Built-in: `palette.mode: 'dark'` in `createTheme` flips all palette colors to dark equivalents
- Estimated implementation:
  ```ts
  // muiTheme.ts: make function, ~3 lines change
  // App.tsx: useState + useMemo for theme, ~5 lines
  // Toggle button: ~3 lines
  // Total: ~11 lines, 0 CSS
  ```
- Token propagation: comprehensive — all MUI components respond to palette mode
- CSS Variables theme (v6+) supports system preference via `colorSchemes` config
- **Verdict: first-class, ~11 LOC, complete propagation**

### Ant Design
- Built-in: `algorithm: theme.darkAlgorithm` in `ConfigProvider`
- Estimated implementation:
  ```ts
  // antdTheme.ts: make function accepting isDark, ~2 lines change
  // App.tsx: useState + pass to ConfigProvider, ~4 lines
  // Toggle: ~3 lines
  // Total: ~9 lines, 0 CSS
  ```
- Token propagation: comprehensive — all AntD components respond to algorithm change
- Cleanest implementation of the three — single prop change on `ConfigProvider`
- **Verdict: first-class, ~9 LOC (fewest of the three), complete propagation**

### Chakra UI
- Built-in: `ColorModeProvider` + `useColorMode` hook
- Estimated implementation:
  ```ts
  // chakraTheme.ts: add colorMode config, ~3 lines
  // App.tsx: wrap with ColorModeProvider, ~3 lines
  // Toggle: useColorMode().toggleColorMode, ~4 lines
  // Total: ~10 lines, 0 CSS
  ```
- Token propagation: comprehensive when semantic tokens are properly mapped to light/dark values
- Limitation: requires the full semantic token scale to be defined for proper dark mode — our minimal adapter would not produce a complete dark mode
- **Verdict: first-class, ~10 LOC, but requires complete semantic token setup to work correctly**

---

## Proposed scores

| Sub-dimension | MUI | AntD | Chakra | Notes |
|---|---|---|---|---|
| Token system | 9 | 8 | 7 | MUI: typed, auto-derived shades. AntD: 3-tier system powerful but complex. Chakra: most flexible but most setup required |
| Customization depth | 9 | 7 | 7 | MUI: full rebrand via theme API alone. AntD: mostly theme-driven, minor className fallbacks. Chakra: powerful but incomplete in our implementation |
| Component variant system | 9 | 4 | 9 | AntD has no theme-level variant system — wrapper components required |
| Dark mode | 9 | 9 | 8 | All first-class; AntD is single-prop simplest; Chakra requires full token setup for complete dark mode |
| **Average (Theming score)** | **9.0** | **7.0** | **7.8** | |
