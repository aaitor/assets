<p align="center"><img src="banners/default.svg" alt="Shared Assets — a consistent identity for the things we build" width="100%"></p>

# Shared Assets

Reusable visual components for [Aitor Argomaniz's open-source projects](https://github.com/aaitor): project banners, social cards, README components, and a terminal recording theme. Original assets and helper code are MIT licensed; embedded fonts keep their [OFL notices](banner-kit/NOTICE.md).

## Browse the library

| Directory | Contents |
| --- | --- |
| [banners/](banners/) | Default 1280 × 320 banner (1a) and previously published project headers |
| [banner-kit/](banner-kit/) | Seven-style Node.js banner generator and embedded fonts |
| [social/](social/) | 1280 × 640 social-card sources and PNG exports |
| [brand/tokens.json](brand/tokens.json) | Shared palette and font choices |
| [components/](components/) | Copyable README header and author footer |
| [terminal/theme.tape](terminal/theme.tape) | Navy-and-mint VHS terminal style |
| [scripts/](scripts/) | Standard-library SVG generator and source validation |

## Generate a banner for a project

Use Node.js 18+ with the supplied kit. **Style 1a is `diagonal-drift`**, our default:

```bash
node banner-kit/make-banner.mjs --style diagonal-drift \
  --repo "my-tool" --tagline "Make everyday work a little easier." \
  --handle "@aaitor" --seed 7 --out banners/my-tool.svg
```

Run `node banner-kit/make-banner.mjs --list` to list all seven styles. Use `--all` to compare them, or `--animate false` for a static banner. No npm packages or network access are required.

Read the **[banner generation guide](docs/banner-generation.md)** for all options, the JavaScript API, fixed-seed generation, the exact default command, and preview/publishing instructions. The [default banner](banners/default.svg) and [static alternative](banners/default-static.svg) are ready to reuse.

The older `python3 scripts/banner.py` generator remains available for the original 1280 × 420 navy-and-mint headers and 1280 × 640 social cards. Existing asset URLs remain stable. Social-preview PNGs still need to be uploaded in each repository's GitHub Settings.

## Share a banner across repositories

Use the raw asset URL in a README image. Replace `COMMIT_SHA` with the full commit SHA that contains the asset:

```html
<img src="https://raw.githubusercontent.com/aaitor/assets/COMMIT_SHA/banners/oss-repo-template.svg"
     alt="Open Source Toolkit" width="100%">
```

Prefer a commit SHA for predictable rendering. Using `main` opts into future edits for every consumer and may still be cached by GitHub. Published paths should stay stable. For offline documentation or independent projects, copy the file locally and record its source revision. Preserve the MIT notice when redistributing substantial portions.

## Use the terminal theme

Copy `terminal/theme.tape` into your project, record the source commit, and import the local file from a VHS tape:

```text
Source examples/terminal-demo/theme.tape
```

See the [template's recording tutorial](https://github.com/aaitor/oss-repo-template/blob/main/docs/terminal-demo.md) for a runnable example and complete recording instructions. Store project-specific demonstrations in the project repository; this library holds the reusable visual components.

## Contributing and license

See [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md). Original artwork, documentation, and code use [MIT](LICENSE). You can adapt the branding; do not imply endorsement. Third-party fonts retain their own licenses; this kit embeds Instrument Serif, Geist, and Geist Mono under [SIL OFL 1.1](banner-kit/NOTICE.md).
