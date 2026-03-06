# Theming & Customization — Thesis Chapter Draft

> Draft for direct use or adaptation in the thesis. All findings are based on theme adapter source code, tokens.json coverage analysis, and library architecture documentation. Tables are numbered continuing from Chapter 5.3 (last table: 5.19).

---

## 5.4 Theming & Customization

Theming is the fourth criterion at 12% weight. For a SaaS product team, the ability to adapt a UI library to a brand identity — without fighting the library's defaults or maintaining a parallel CSS override system — is a practical architectural concern. A library that requires significant customization effort imposes ongoing maintenance cost whenever brand guidelines change. Conversely, a library with a deep, composable token system can become an accelerant: a single token change propagates through the entire application automatically.

Four sub-dimensions are assessed: the depth and ergonomics of the token system, how completely the application can be rebranded through the theme API alone, whether the library provides a first-class component variant system at the theme level, and how the library approaches dark mode.

### 5.4.1 Measurement Approach

All three applications share a single `packages/shared/src/theme/tokens.json` file as the design token source of truth. Each application implements a thin adapter that maps these tokens to its library's theming API:

- `apps/dashboard-mui/src/theme/muiTheme.ts` — maps to `createTheme()`
- `apps/dashboard-antd/src/theme/antdTheme.ts` — maps to the `ConfigProvider` config object
- `apps/dashboard-chakra/src/theme/chakraTheme.ts` — maps to `createSystem(defaultConfig, {...})`

The assessment evaluates each library's theming API against two questions: how much of the token surface can be mapped without friction, and how comprehensively does that mapping propagate through the component set.

**Dark mode** was not implemented in any of the three applications. Dark mode scores are architectural assessments based on each library's documented API and estimated lines of code to enable the feature — not runtime measurements.

---

### 5.4.2 Token System

**Table 5.20 — tokens.json coverage per theme adapter**

| Token category | tokens.json defines | MUI mapped | AntD mapped | Chakra mapped |
|---|---|---|---|---|
| Primary color | `colors.primary` | Yes | Yes | Yes (brand.500) |
| Hover / active states | `colors.primaryHover/Active` | Auto-derived | Auto-derived | Yes (brand.600) |
| Semantic colors (success, warning, error) | Yes | Yes | Yes | No |
| Gray scale (gray50–gray900) | Yes | No | No | No |
| Border radius | `borderRadius.md` | Yes | Yes | Yes |
| Base font size | `fontSize.base` | Yes | Yes | Yes |
| Spacing scale | `spacing.*` | No | No | No |
| Font weight | `fontWeight.*` | No | No | No |
| Line height | `lineHeight.*` | No | No | No |
| Shadows | `shadow.*` | No | No | No |

All three adapters map the same minimal subset — primary color, border radius, and font size — with MUI and AntD additionally mapping semantic colors (success, warning, error). Spacing, typography scale, and shadows are unmapped in all three; components fall back to each library's defaults for these values. This baseline equivalence is intentional for the comparison: all three adapters exercise the same token coverage, ensuring that differences in theming scores reflect the library's API quality rather than effort invested in the adapter.

#### MUI

`createTheme` exposes a structured token hierarchy with named namespaces: `palette` for color, `typography` for type scale, `shape` for border radii, `spacing` for the spacing function, `shadows` for elevation, and `breakpoints` for responsive design. The API is fully typed — IDE autocomplete shows every valid token name and its expected type, and TypeScript errors fire on invalid values.

The most significant feature is automatic palette derivation. Setting `palette.primary.main` to a single hex value causes `createTheme` to compute the full range of tonal variants — `light`, `dark`, and all derived state colors (hover, active, focus, disabled) — using a luminance algorithm. A developer does not need to define or maintain separate hover-state colors; the library calculates them. This cascade is comprehensive: every MUI component that uses the primary color — Button backgrounds, TextField focus outlines, Checkbox checked states, Link colors, active Tab indicators — updates automatically from the single `palette.primary.main` change.

The token system can be extended via TypeScript module augmentation. Adding a custom token to `palette` (e.g., `palette.brand.accent`) causes it to appear in autocomplete and type-checks across the codebase, making the system extensible without losing the typed contract.

#### Ant Design

AntD v5 introduced a formal three-tier token architecture as its central v5 design change. The three tiers are:

- **Seed tokens** — global primitives: `colorPrimary`, `colorSuccess`, `borderRadius`, `fontSize`. Setting these establishes the foundation.
- **Map tokens** — derived values computed from seed tokens: `colorPrimaryHover`, `colorPrimaryActive`, `colorPrimaryBg`, and dozens of other contextual derivations. These are calculated automatically and can be overridden explicitly when needed.
- **Alias tokens** — component-specific values: `Button.colorPrimary`, `Input.activeBorderColor`. These override the map token for a single component type only.

The `ConfigProvider token` API covers all three tiers and is typed via `ThemeConfig` — all ~100+ token names are accessible with autocomplete. Passing `colorPrimary` to the seed tier cascades through every component in the application automatically, making the system as ergonomic as MUI's for the common case.

The limitation is cognitive: understanding which tier to target for a given customization requires reading documentation. A developer who wants to change the hover color of a Button only can target the alias tier (`components.Button.token.colorPrimaryHover`) — but discovering this requires understanding the relationship between all three tiers. For standard customisation, the seed tier is sufficient and the system is straightforward. For precise per-component overrides, the three-tier hierarchy is powerful but non-obvious.

#### Chakra UI

Chakra UI v3's `createSystem` API is architecturally the most flexible of the three. Tokens defined via `createSystem` become CSS custom properties at runtime, meaning they are accessible from any CSS context and update reactively when the system changes. The semantic token model supports color scales (50–950) and aliases — `colors.brand.solid` can be defined to alias `colors.brand.500`, and `colors.brand.subtle` can alias `colors.brand.100`. The `colorPalette` prop consumes these scales uniformly: setting `colorPalette="brand"` on any component tells it to use the `brand.*` scale for all color decisions.

The practical limitation is the setup cost. This architecture reaches its potential only when the complete scale is defined. In the project's adapter, only `brand.500` and `brand.600` are mapped — two data points on a 10-point scale. The remaining scale values (`brand.50` through `brand.900`) are absent, which means subtle backgrounds, hover states, and dark mode variants all fall back to defaults rather than deriving from the brand color. Semantic status colors (success, warning, error) are not mapped at all.

Compared to MUI's `palette.primary.main` — a single value that automatically produces all scale variants — Chakra's approach offers more architectural control at the cost of more upfront definition. It is the right architecture for a team building a complete design system; it is the harder path for a team that wants to apply a brand color quickly.

---

### 5.4.3 Customization Depth

The core question for this sub-dimension: can the entire dashboard be rebranded — primary color, border radii, typography scale, component-level overrides — through the theme API alone, with zero per-component CSS overrides?

#### MUI

MUI achieves a full rebrand via the theme API without any per-component CSS. The propagation is comprehensive:

- `palette.primary.main` updates every Button, Link, focused Input, active Tab, checked Checkbox, and selected ListItem in the application — all automatically.
- `shape.borderRadius` updates every Card, Dialog, Chip, TextField, and Button border radius simultaneously.
- `typography.fontSize` propagates the base font size through all typography variants.
- `theme.components.MuiButton.styleOverrides.root` allows any Button property to be overridden globally — background, padding, border, box-shadow — at the theme level without touching a single component's JSX.
- `slotProps` combined with `styleOverrides` can target internal component slots (the input element inside a TextField, the label element, the adornment) at theme level.

In Phase 2, all styling was done through `muiTheme.ts` and the `sx` prop. No `className` attributes, no global CSS files, and no inline `style` props were required. A rebrand would consist entirely of updating `muiTheme.ts`.

#### Ant Design

AntD v5's CSS variable architecture makes token changes predictable — there is no re-render required for a token update; the CSS variable value changes and all consumers update immediately. Passing `colorPrimary`, `borderRadius`, and `fontSize` through the `ConfigProvider token` covers the most commonly rebranded properties, and the cascade is comprehensive across all AntD components.

The limitation is spacing and layout. Some spacing properties — table row padding, Form.Item vertical gap, Select dropdown padding — are defined at the component level and do not respond to global token changes. Overriding these requires either per-instance `style` props or global CSS rules that target AntD class names. This is a small surface area for a typical rebrand, but it means that a complete rebrand without any CSS cannot be achieved — there is a residual layer of per-instance or global CSS required for layout-level precision.

#### Chakra UI

Chakra's recipe system and semantic token architecture are, architecturally, the most capable of the three for a full design-system-scale rebrand. Defining a component recipe at the system level redefines that component everywhere in the application — base styles, variants, sizes, and compound variants are all expressible in a single `defineRecipe()` call, and they apply to every instance without prop changes.

In practice, the incomplete semantic token mapping in the project's adapter limited the observable rebrand depth. Status colors (success tags, error badges, warning notifications) use Chakra's built-in defaults rather than values derived from `tokens.json`. A complete rebrand would require defining the full `brand.*` color scale, mapping semantic status tokens, and — for dark mode — defining light and dark aliases for each semantic token. This is the correct way to use the system, but it represents significantly more setup than MUI's `palette.primary.main` or AntD's `colorPrimary`.

---

### 5.4.4 Component Variant System

A theme-level variant system allows developers to define named, reusable component styles — a `danger` button, a `subtle` badge, a `compact` table row — that apply through props rather than through per-instance CSS. This is a design system capability: the variant is defined once, typed, and consistent everywhere.

#### MUI

MUI provides a first-class, typed variant system via `createTheme`:

```ts
theme.components.MuiButton.variants = [
  {
    props: { variant: 'danger' },
    style: { backgroundColor: tokens.colors.error, color: '#fff' }
  }
]
```

Custom variants integrate with the TypeScript module augmentation system — augmenting `ButtonPropsVariantOverrides` causes `<Button variant="danger">` to have IDE autocomplete and type-checking. The pattern applies to any MUI component via `theme.components.<ComponentName>.variants`, giving the system coverage across the entire component library. A design system built on MUI can expose its full variant vocabulary through the theme without any JSX-level workarounds.

#### Ant Design

Ant Design has no theme-level variant system. `ConfigProvider.components.Button.style` overrides the style of all Buttons globally — it applies to every instance, not to a named variant. AntD does provide a `danger` prop as a built-in special case on Button and a handful of other components, but this is a hardcoded feature rather than a user-extensible pattern. A team that needs a `success` button, a `warning` badge, or a `compact` table variant must create wrapper components:

```tsx
const DangerButton = (props) => (
  <Button {...props} style={{ backgroundColor: tokens.colors.error, ...props.style }} />
);
```

Wrapper components are a workable approach but they distribute variant logic across the codebase rather than centralising it in the theme. They are also untyped at the prop level — `<DangerButton>` accepts any `Button` prop but the `danger` variant does not appear in autocomplete or type documentation.

#### Chakra UI

Chakra UI v3's recipe system is the most capable variant implementation of the three:

```ts
const buttonRecipe = defineRecipe({
  base: { fontWeight: 'semibold' },
  variants: {
    visual: {
      danger: { bg: 'red.500', color: 'white', _hover: { bg: 'red.600' } },
      success: { bg: 'green.500', color: 'white' }
    },
    size: {
      compact: { px: 2, py: 1, fontSize: 'sm' }
    }
  }
})
```

Recipes have full access to the semantic token system — variant styles can reference design tokens by name, and those references update reactively if the token values change. Multi-property variants (background, text color, hover state, focus ring, disabled state) are expressible in a single recipe entry. Recipes defined in `createSystem` apply automatically to every component instance without props changes at the call site. For a team building a design system on top of Chakra, the recipe system is the correct architectural primitive — it centralises variant logic, keeps it token-aware, and makes it globally consistent.

---

### 5.4.5 Dark Mode

Dark mode was not implemented in any of the three applications. The following assessments are based on each library's documented API and estimated lines of code required to add a functional dark mode toggle to the existing applications.

#### MUI — ~11 lines, 0 CSS

```ts
// muiTheme.ts — convert to factory function (~3 lines added)
export const createMuiTheme = (mode: 'light' | 'dark') =>
  createTheme({ palette: { mode, primary: { main: tokens.colors.primary } } });

// App.tsx — add state and memoised theme (~5 lines added)
const [mode, setMode] = useState<'light' | 'dark'>('light');
const theme = useMemo(() => createMuiTheme(mode), [mode]);

// Toggle button (~3 lines added)
<Button onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')}>Toggle</Button>
```

Setting `palette.mode: 'dark'` causes `createTheme` to flip all palette-derived colors to dark equivalents — backgrounds, surfaces, text colors, dividers, and all state colors. Every MUI component responds to the mode change without any per-component changes. MUI v6+ additionally supports the `colorSchemes` configuration, which enables system-preference dark mode (`prefers-color-scheme`) with a single config option.

#### Ant Design — ~9 lines, 0 CSS

```ts
// antdTheme.ts — accept isDark flag (~2 lines change)
export const getAntdTheme = (isDark: boolean): ThemeConfig => ({
  algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: { colorPrimary: tokens.colors.primary, ... }
});

// App.tsx — state + pass to ConfigProvider (~4 lines added)
const [isDark, setIsDark] = useState(false);
<ConfigProvider theme={getAntdTheme(isDark)}>

// Toggle (~3 lines added)
<Button onClick={() => setIsDark(d => !d)}>Toggle</Button>
```

Ant Design's dark mode is enabled by a single `algorithm` prop on `ConfigProvider`. The `darkAlgorithm` recalculates all derived token values for a dark background automatically. Every AntD component responds without further changes. This is the simplest implementation of the three — the single-prop change is the entire mechanism.

#### Chakra UI — ~10 lines, 0 CSS (with complete token setup)

```ts
// chakraTheme.ts — add colorMode config (~3 lines)
export const chakraSystem = createSystem(defaultConfig, {
  theme: { ... },
  globalCss: { body: { colorScheme: 'light dark' } }
});

// App.tsx — wrap with ColorModeProvider (~3 lines)
<ColorModeProvider><App /></ColorModeProvider>

// Toggle — useColorMode hook (~4 lines)
const { toggleColorMode } = useColorMode();
<Button onClick={toggleColorMode}>Toggle</Button>
```

Chakra UI's `ColorModeProvider` and `useColorMode` hook make the toggle mechanism straightforward. The architectural dependency is the semantic token system — dark mode works correctly only when tokens define both light and dark aliases:

```ts
colors: {
  bg: { value: { base: 'white', _dark: 'gray.900' } }
}
```

With the project's minimal adapter (only `brand.500` and `brand.600` defined), enabling `ColorModeProvider` would produce a toggle that works for explicitly-aliased tokens and falls back to defaults for everything else — resulting in an incomplete dark mode where some colors respond and others do not. A complete dark mode requires a fully-specified semantic token scale, which represents materially more setup than MUI's `palette.mode` or AntD's `darkAlgorithm`.

---

### 5.4.6 Analysis

The theming assessment reveals a clear division between two architectural philosophies and one practical gap.

**MUI and Chakra both earn a 9 on the variant system** — the only sub-dimension where they tie — for opposite architectural reasons. MUI's variant system is additive: it extends the existing props API through the theme, keeping the JSX call site clean and the typing automatic. Chakra's recipe system is compositional: it redefines the component's entire style contract from the ground up, giving designers more control at the cost of more initial definition. Both are first-class, token-aware, and centralised. AntD's absence of a theme-level variant system is the starkest single finding in this criterion — it scores 4, and the gap between AntD and the other two (4 vs. 9) is the largest score gap of any sub-dimension across all six criteria.

**MUI leads on token system ergonomics** because of automatic palette derivation. The gap between defining one hex value and having a complete, consistent palette across every component state is the kind of abstraction that saves hours of work and eliminates an entire class of consistency errors. AntD's three-tier system achieves the same result with more ceremony; Chakra's semantic token model is the most architecturally sound but requires the most upfront commitment to be useful.

**Customization depth separates MUI from the others** on a practical test: whether a complete rebrand is achievable via the theme API with zero per-component CSS. MUI passes this test completely; AntD falls slightly short due to spacing/layout properties at the component level; Chakra's architecture supports it fully but our minimal adapter demonstrates that the potential is only reachable after significant token definition work. The scores reflect what the libraries can do, not just what the project's adapters achieved — but the gap between potential and practical path-of-least-resistance is noted.

---

### 5.4.7 Summary

**Table 5.21 — Theming sub-dimension scores**

| Sub-dimension | MUI | Ant Design | Chakra UI | Key differentiator |
|---|---|---|---|---|
| Token system | 9 | 8 | 7 | MUI auto-derives palette shades from one value; AntD three-tier system comprehensive but complex; Chakra most flexible but highest setup cost |
| Customization depth | 9 | 7 | 7 | MUI: full rebrand via theme API alone; AntD: minor CSS fallback for spacing/layout; Chakra: architecture supports it, adapter incomplete |
| Component variant system | 9 | 4 | 9 | AntD has no theme-level variant API — wrapper components required; MUI and Chakra both first-class |
| Dark mode | 9 | 9 | 8 | All first-class; AntD single-prop simplest (~9 LOC); Chakra requires full semantic token scale for complete dark mode |

**Table 5.22 — Theming & Customization criterion summary**

| Library | Score (1–10) | Rationale |
|---|---|---|
| MUI | **9.0** | Most complete token-to-component propagation path: single `palette.primary.main` value auto-derives all state colors; full rebrand achievable through `muiTheme.ts` alone with zero per-component CSS; first-class typed variant system via `theme.components`; dark mode in ~11 LOC. The highest criterion score MUI receives across all six criteria. |
| Chakra UI | **7.8** | Architecturally the most capable theming system — semantic tokens as CSS custom properties, first-class recipe system for variants, most powerful for full design-system use. Debits: highest setup cost to unlock the architecture (full scale definition required); incomplete semantic color mapping in our adapter; dark mode requires the complete token scale to produce correct results. |
| Ant Design | **7.0** | Three-tier token system (seed → map → alias) is comprehensive and the cascade from `colorPrimary` is thorough. Dark mode is the simplest implementation of the three (single `algorithm` prop, ~9 LOC). Critical gap: no theme-level variant system — custom variants require wrapper components, distributing style logic across the codebase rather than centralising it in the theme. |

---

*Evidence and adapter source code: `docs/results/2026-03-04/theming-evidence.md`, `apps/*/src/theme/`.*
