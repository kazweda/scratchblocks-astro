# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.4.0] - 2026-09-24

### Changed

- **Breaking:** `ScratchblocksRenderer` is now an Astro component instead of a React component. React, `react-dom` and `@astrojs/react` are no longer needed. ([#18](https://github.com/kazweda/scratchblocks-astro/issues/18))
- **Breaking:** Pass `class` instead of `className`.
- `peerDependencies` is now `astro` (`^5 || ^6 || ^7`) instead of `react` / `react-dom`.

### Removed

- The `vite.optimizeDeps.include` and `vite.ssr.noExternal` entries for this package in `astro.config.mjs` are no longer needed.

### Migrating from 0.3.x

1. Remove `client:load` (or `client:idle`) from `<ScratchblocksRenderer>`. Astro logs a warning for each use left in.
2. Rename `className` to `class`.
3. Remove this package from `vite.optimizeDeps.include` and `vite.ssr.noExternal` in `astro.config.mjs`.
4. If nothing else on your site uses React, remove `@astrojs/react`, `react` and `react-dom`.

## [0.3.1] - 2026-08-28

### Changed

- Patch release to check publishing to npm. No changes to the component. ([#16](https://github.com/kazweda/scratchblocks-astro/issues/16))

## [0.3.0] - 2026-08-28

### Added

- `languages` prop, passed through to `scratchblocks.parse` / `render`. ([#9](https://github.com/kazweda/scratchblocks-astro/issues/9))
- HTML attributes such as `className` are passed through to the root `<div>` (except `style`, which selects the block style). ([#9](https://github.com/kazweda/scratchblocks-astro/issues/9))

### Changed

- Published to npm as `@kazweda/scratchblocks-astro`. Earlier versions were installed from GitHub tags. ([#11](https://github.com/kazweda/scratchblocks-astro/issues/11))

## [0.2.0] - 2026-06-26

### Changed

- Updated development dependencies. No changes to the component.

## [0.1.0] - 2026-02-10

### Added

- `ScratchblocksRenderer` React component with `code` and `style` props.

[Unreleased]: https://github.com/kazweda/scratchblocks-astro/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/kazweda/scratchblocks-astro/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/kazweda/scratchblocks-astro/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/kazweda/scratchblocks-astro/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kazweda/scratchblocks-astro/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kazweda/scratchblocks-astro/releases/tag/v0.1.0
