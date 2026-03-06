# Developer Experience — Evidence & Scoring Notes

Date: 2026-03-04
Phase 2 implementation observations + structured test results.

---

## Sub-dimension 1 — TypeScript Type Quality

### Deliberate misuse test (Button component, Homepage.tsx in each app)

Three props tested per app: invalid enum value, non-existent prop, invalid variant.

#### MUI

| Test | Result |
|---|---|
| `color="banana"` | Error — valid values listed but buried in 3-overload cascade: `Type '"banana"' is not assignable to type 'OverridableStringUnion<"inherit" \| "primary" \| "secondary" \| "error" \| "info" \| "success" \| "warning", ButtonPropsColorOverrides>'` |
| `banana={true}` (non-existent prop) | **Silent — no error.** `OverridableComponent` polymorphic pattern passes unknown props through to the DOM element. |
| `variant2="wrong"` (non-existent prop variant) | Silent. |

Verdict: errors are raised but the overload resolution machinery adds significant noise. Valid values are present but take effort to find. Non-existent props are silently accepted — a risk for typo bugs.

#### Ant Design

| Test | Result |
|---|---|
| `type="banana"` | Error — clean single line: `Type '"banana"' is not assignable to type '"link" \| "text" \| "default" \| "dashed" \| "primary" \| undefined'` |
| `size="wrong"` | Error — clean: `Type '"wrong"' is not assignable to type 'SizeType'` |
| `banana={true}` (non-existent prop) | **Silent — no error.** AntD spreads unknown props to the underlying DOM element. |

Verdict: best error quality of the three for invalid enum values — direct, single-line, no overload noise. Valid values fully listed. Non-existent prop still silent (same root cause as MUI).

#### Chakra UI

| Test | Result |
|---|---|
| `colorPalette="banana"` | **Silent — no error.** `colorPalette` accepts `string` (not a union) to support custom design token palettes. TypeScript cannot catch invalid palette names. |
| `variant="wrong"` | Error — but with wrapper noise: `Type '"wrong"' is not assignable to type 'ConditionalValue<"outline" \| "solid" \| "ghost" \| "subtle" \| "surface" \| "plain" \| undefined>'`. The `ConditionalValue<>` wrapper (Chakra's responsive value type) adds a layer to parse. |
| `banana={true}` (non-existent prop) | **Silent — no error.** Same pattern as MUI/AntD. |

Verdict: weakest type coverage of the three. `colorPalette` being `string` means a major visual prop has no type safety. The `ConditionalValue<>` wrapper adds noise to errors that do fire. Phase 2 additionally revealed that `DialogContentProps` and `FieldLabelProps` produce generic cascade errors in TypeScript 5.9 (children prop incompatibility), requiring workarounds.

### Phase 2 implementation observations

| Observation | Library |
|---|---|
| `slotProps` and `sx` prop autocomplete strong in IDE | MUI |
| TypeScript errors on misuse point directly to the offending prop | MUI |
| `ConfigProvider` theme token API well-typed and consistent | AntD |
| DnD drag-handle pattern required API research beyond official docs | AntD |
| `FieldLabelProps` / `DialogContentProps` incompatible with TypeScript 5.9 — cascade errors, not actionable | Chakra |
| `Button as` prop (polymorphic rendering) silently broken in v3 — no type error, no runtime warning | Chakra |
| `NativeSelect` composable API correctly typed | Chakra |

---

## Sub-dimension 2 — API Consistency

### MUI
- `sx` prop available on every component — single consistent styling primitive
- `variant`, `color`, `size` props appear with identical naming across Button, Chip, TextField, Typography, Badge
- `slotProps` is the uniform API for reaching component internals (input slot, label slot, adornment slot) across all components
- `onChange` always receives a React synthetic event — no surprises
- Style overrides: `sx` inline or `styleOverrides` in `createTheme` — one clear answer for every scenario
- Verdict: strongest API consistency of the three

### Ant Design
- `size` (small/middle/large) and `disabled` are consistent across components
- Inconsistency: `type` on Button ("primary", "default", "dashed") uses different naming convention to `variant` used elsewhere
- `onChange` callback signature varies by component — some pass `(value)` directly, others pass `(event)` — requires checking docs per component
- `Form.Item` wrapper is required for form components, adding a layer absent in other component categories
- DnD drag-handle pattern had no obvious analogue in the rest of the API — required documentation research beyond standard component usage
- Verdict: mostly consistent, with notable rough edges in form/interaction APIs

### Chakra UI
- `Root/Label/Field/Indicator` composition pattern applied uniformly across composable components
- `colorPalette` prop available everywhere — consistent theming primitive
- `as` prop for polymorphic rendering (standard in v2 and widely expected) silently broken in v3 — no TypeScript error, no runtime warning
- `DialogContentProps` and `FieldLabelProps` TypeScript issues with `children` in TS 5.9 — v3 rewrite introduced type-level inconsistencies not fully resolved
- The composable API is verbose relative to MUI — e.g. `NativeSelect.Root > NativeSelect.Field + NativeSelect.Indicator` vs MUI's single `<Select>`
- Verdict: internally consistent composable pattern, but v3 rewrite broke cross-version and cross-library expectations with no guidance

---

## Sub-dimension 3 — Documentation Quality

Sources: community research via GitHub issues, Hacker News, DEV Community, independent reviews (2024–2026).

### MUI
- Most complete docs of the three — breadth covers nearly every API surface
- Live code examples via CodeSandbox/StackBlitz embeds on most component pages
- Largest English-language community → most Stack Overflow answers, tutorials, blog posts
- Core complaint: four overlapping styling APIs (`sx`, `styled`, `theme.components`, `slotProps`) with no clear guidance on which to use in a given scenario
- CSS Variables theme + `sx` specificity edge cases underdocumented (GitHub #42893)
- Pigment CSS + Next.js integration docs contradict each other (GitHub #43548)
- Migration guides adequate for API changes, weaker on theming edge cases

### Ant Design
- Clean docs site structure, comprehensive for standard component usage
- Chinese-first origin creates persistent English gaps — community discussions, GitHub issues, and some supplementary pages remain in Chinese
- No component-level do/don't guidance — harder to identify optimal usage patterns
- LESS → CSS-in-JS (v4→v5) migration guide widely criticised as insufficient for the scope of change
- CSS-in-JS runtime performance implications underdocumented — developers discovered ~1s/1000-component regressions only after migration (GitHub #51409)
- Customisation for non-obvious cases opaque — token system requires deep knowledge to override specific styles

### Chakra UI
- v3 launched with incomplete documentation — maintainer acknowledged the gap publicly on the official feedback thread (GitHub #8518)
- Migration guide (v2→v3) rated as weakest of the three — scope of change (new theme API, new composition model, removal of Framer Motion, new recipe system) vastly exceeded guide depth
- TypeScript errors on Dialog, Avatar, Checkbox and other child components undocumented and widespread at launch
- v2 and v3 doc sites hosted separately — web searches frequently surface outdated v2 results for v3 queries
- `as` prop removal not prominently surfaced despite being a common failure point
- Gradual migration effectively unsupported — running v2 and v3 side-by-side does not work
- Positive: improving steadily post-launch; LLM-specific docs added (llms.txt)

---

## Sub-dimension 4 — Component API Design & Error Feedback

Combines API intuitiveness with quality of TypeScript error messages and runtime warnings on misuse.

### MUI
- `slotProps` pattern is ergonomic for reaching component internals
- TypeScript errors name the offending prop and list valid values, but overload resolution adds 3× repetition noise
- Non-existent props silently accepted (polymorphic `OverridableComponent` passes unknown props to DOM) — typo bugs won't surface at compile time
- Multiple overlapping styling APIs create decision fatigue — the API is expressive but not self-evidently learnable
- No runtime warning when a non-existent prop is passed

### Ant Design
- Cleanest TypeScript error messages of the three — single-line, prop named, valid values listed, no overload noise
- `size`, `disabled`, `loading`, `onClick` props behave predictably across components
- `Form.Item` wrapping requirement is a non-obvious architectural constraint that new users discover through errors, not documentation
- Non-existent props silently accepted — same DOM spread behaviour as MUI
- No runtime warning for unknown props

### Chakra UI
- `colorPalette` accepts `string` with no type narrowing — no error on `colorPalette="banana"`. A primary visual prop has zero type safety.
- `variant` errors fire but wrapped in `ConditionalValue<>` — valid values present but require parsing the wrapper type
- `as` prop silently does nothing in v3 — no TypeScript error, no runtime warning, no console message
- `DialogContentProps`/`FieldLabelProps` produce generic `children` cascade errors in TypeScript 5.9 — not actionable without reading the source
- Composable `Root/Field/Label` pattern is intentional and good for accessibility but more verbose than alternatives

---

## Proposed scores

| Sub-dimension | MUI | AntD | Chakra | Notes |
|---|---|---|---|---|
| TypeScript type quality | 7 | 8 | 4 | AntD cleanest errors; Chakra `colorPalette` untyped + v3 cascade errors |
| API consistency | 9 | 7 | 6 | MUI `sx`+`slotProps` uniform; AntD `type`/`onChange` rough edges; Chakra v3 regression on `as` prop |
| Documentation quality | 8 | 6 | 4 | MUI largest community; AntD English gaps; Chakra v3 launched incomplete |
| Component API design & error feedback | 7 | 7 | 5 | MUI/AntD comparable; Chakra `colorPalette` untyped + silent failures |
| **Average (DX score)** | **7.8** | **7.0** | **4.8** | |
