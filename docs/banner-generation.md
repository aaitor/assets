# Generate repository banners

Use the Claude Design banner kit in [banner-kit/](../banner-kit/) for new repository banners. **The default style is 1a: `diagonal-drift`.** All styles produce a self-contained 1280 × 320 SVG with embedded Instrument Serif, Geist, and Geist Mono fonts. The generator needs **Node.js 18+**, no npm packages, and no network access.

The committed [default banner](../banners/default.svg) uses `Shared Assets`, `@aaitor`, seed `7`, and the tagline `Reusable components for open-source projects.` The [static variant](../banners/default-static.svg) uses the same inputs without animation. The assets README displays the default banner. Existing older navy-and-mint banners and their Python generator remain available at their published paths.

## Choose a style

From the repository root:

```bash
node banner-kit/make-banner.mjs --list
```

| Kit ID | CLI style | Description |
| --- | --- | --- |
| 1a | `diagonal-drift` | Default; diagonal line segments |
| 1c | `flow-field` | Flowing line paths |
| 1e | `radial-burst` | Radiating lines |
| 1f | `data-streams` | Horizontal streams |
| 1h | `orbit-arcs` | Orbital arcs |
| 1i | `signal-waves` | Repeating waves |
| 1j | `circuit-traces` | Circuit paths on a light background |

Pass the style slug, such as `diagonal-drift`, rather than the design ID `1a`. Omitting `--style` also selects `diagonal-drift`.

## Generate one project banner

```bash
node banner-kit/make-banner.mjs \
  --style diagonal-drift \
  --repo "my-tool" \
  --tagline "Make everyday work a little easier." \
  --handle "@aaitor" \
  --seed 7 \
  --out banners/my-tool.svg
```

Output paths are relative to the current working directory. For a nested output path, create the parent directory first. Existing output files are overwritten. With no `--out`, a single SVG is written to stdout.

## Reproduce the default

```bash
node banner-kit/make-banner.mjs \
  --style diagonal-drift --repo "Shared Assets" \
  --tagline "Reusable components for open-source projects." \
  --handle "@aaitor" --seed 7 --out banners/default.svg
```

For static output, use the same command with `--animate false` and `--out banners/default-static.svg`. Animation is on by default. The animated SVG includes a reduced-motion media query; the static variant contains no keyframes or animation styles.

## Compare all seven

```bash
node banner-kit/make-banner.mjs --all \
  --repo "my-tool" --tagline "Make everyday work a little easier." \
  --handle "@aaitor" --seed 7 --out /tmp/my-tool-banners
```

This writes `banner-<style>.svg` for each style. Without `--out`, `--all` creates `./out/` relative to the current working directory. That default comparison directory is ignored by Git. You can add `--animate false` to generate seven static variants.

## Options

| Flag | Default | Use |
| --- | --- | --- |
| `--style` | `diagonal-drift` | Choose one style slug |
| `--repo` | `my-project` | Visible repository title, not a filesystem path |
| `--tagline` | Built-in example description | Short useful outcome |
| `--handle` | `@aaitor` | Visible author handle |
| `--seed` | `7` | Integer seed; same inputs and generator revision give the same SVG |
| `--animate false` | Animation enabled | Produce static SVG |
| `--out` | stdout, or `./out/` with `--all` | Output file, or comparison directory |
| `--list` | — | Print IDs and style slugs |
| `--all` | — | Generate all seven styles |

Keep the tagline around 60 characters or fewer. Text does not wrap or auto-fit, so preview long titles and non-Latin text. Colors live in each `STYLES[slug].colors` object in `banner-kit/make-banner.mjs`; update the generator and regenerate assets together.

## Call it from JavaScript

The module exports `makeBanner` and `STYLES`. Unlike the CLI, the API does not load the fonts automatically: pass the bundled CSS, including its font notices. From the repository root:

```bash
node --input-type=module <<'JS'
import { readFileSync, writeFileSync } from 'node:fs';
import { makeBanner, STYLES } from './banner-kit/make-banner.mjs';

const fontCss = readFileSync('./banner-kit/fonts.css', 'utf8');
const svg = makeBanner({
  style: 'diagonal-drift',
  repo: 'my-tool',
  tagline: 'Make everyday work a little easier.',
  handle: '@aaitor',
  seed: 7,
  animate: false,
  fontCss,
});
writeFileSync('/tmp/my-tool.svg', svg);
console.log(Object.keys(STYLES));
JS
```

Use a boolean `false` for `animate` in JavaScript; use the string flag `--animate false` in the CLI. For automation in another language, call Node with a subprocess argument list rather than building a shell command from project text.

## Preview and publish

1. Open the generated SVG in a modern browser. Check text clipping and contrast; XML validity alone does not prove it looks correct.
2. For a quick static preview, generate `--animate false` and open it in the browser. Some SVG viewers do not support embedded webfonts or CSS animation; use a browser or export PNG if needed.
3. Put the banner in this repository's `banners/` directory or copy it into the target repository. Keep project names, style, seed, and tagline in your generation command for repeatability.
4. Commit the reviewed asset. Consumers should use a raw URL pinned to the commit that contains it; see the main [README](../README.md#share-a-banner-across-repositories).
5. Use an image with meaningful alt text at the top of the target README. A banner SVG does not configure the separate GitHub social preview.

The default `diagonal-drift` and an `orbit-arcs` example were visually checked in Chromium during integration. CI exercises all styles in animated/static forms, fixed-seed reproducibility, text escaping, CLI output, and SVG parsing. See [font and provenance notices](../banner-kit/NOTICE.md).

## Reproduce the personal profile banner

The profile at [github.com/aaitor](https://github.com/aaitor) uses `banners/aaitor.svg`, generated with:

```bash
node banner-kit/make-banner.mjs --style diagonal-drift \
  --repo "Aitor Argomaniz" \
  --tagline "CTO & founder. Building software with AI agents." \
  --handle "@aaitor" --seed 7 --out banners/aaitor.svg
```

The profile README references the banner through a commit-pinned raw URL. After publishing a revised banner, update that URL to its new commit to display the revision.

## Reproduce the LinkedIn skill banner

```bash
node banner-kit/make-banner.mjs --style diagonal-drift \
  --repo "Publish to LinkedIn" \
  --tagline "Draft, preview, and publish with your AI agent." \
  --handle "@aaitor" --seed 7 --out banners/skill-publish-to-linkedin.svg
```

Its 1280 × 640 social card centers the same 1280 × 320 SVG on the style's background. The skill repository documents that wrapping/export step and records the source revision.
