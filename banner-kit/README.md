# Repo banner kit

Seven 1280 × 320 line-pattern banners for personal GitHub repos (Fog palette). Animated SVG with fonts embedded (Instrument Serif, Geist, Geist Mono), so they render the same everywhere, including GitHub READMEs.

## Styles
| id | --style | |
|---|---|---|
| 1a | `diagonal-drift` | Diagonal drift |
| 1c | `flow-field` | Flow field |
| 1e | `radial-burst` | Radial burst |
| 1f | `data-streams` | Data streams |
| 1h | `orbit-arcs` | Orbit arcs |
| 1i | `signal-waves` | Signal waves |
| 1j | `circuit-traces` | Circuit traces |

## Files
- `make-banner.mjs` — generator (Node 18+, no dependencies)
- `fonts.css` — fonts as base64, embedded into every SVG the generator writes

## Generate
```bash
# one style
node make-banner.mjs --style orbit-arcs --repo "my-project" --tagline "What it does, in one line." --out banner.svg

# every style at once → ./out/banner-<style>.svg
node make-banner.mjs --all --repo "my-project" --tagline "What it does, in one line."

# list styles
node make-banner.mjs --list
```
- `--seed <n>` reshuffles the line pattern (same seed = same pattern)
- `--handle` defaults to `@aaitor`
- `--animate false` for a static version
- Colors live in `STYLES[...].colors` inside `make-banner.mjs`

After generating, you can open any `.svg` in a text editor and change the three `<text>` lines at the bottom.

## Use in a README
```markdown
<p align="center"><img src="./.github/banner.svg" alt="my-project" width="100%"></p>
```

Keep the tagline under ~60 characters; SVG text doesn't wrap.
