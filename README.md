# scratchblocks-astro

Unofficial Scratchblocks renderer Astro component.

No UI framework is required: the component is a plain `.astro` file, so you do not need `@astrojs/react` or React.

## Install

```bash
npm install @kazweda/scratchblocks-astro
```

```bash
pnpm add @kazweda/scratchblocks-astro
```

```bash
yarn add @kazweda/scratchblocks-astro
```

## Usage (Astro MDX)

```mdx
import { ScratchblocksRenderer } from '@kazweda/scratchblocks-astro';

<ScratchblocksRenderer
  code={`when flag clicked
move (10) steps`}
/>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | (required) | Scratchblocks syntax to render. |
| `style` | `'scratch2' \| 'scratch3'` | `'scratch3'` | Block visual style. |
| `languages` | `string[]` | `undefined` | Language codes passed through to `scratchblocks.parse`/`render` (e.g. `['en']`). Load extra languages with `scratchblocks.loadLanguages` beforehand. |
| `class`, other HTML attributes | — | — | Passed through to the root `<div>`. Note: the `style` HTML attribute is not passed through, since `style` is reserved for the block style option above. |

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md).

## How it works

The component renders an empty `<div>` with the props stored in `data-*` attributes, plus a small script that loads scratchblocks in the browser and replaces each `<div>` with the rendered SVG. If parsing fails, the code is shown as-is in a `<pre class="blocks">`.

It works with several blocks on one page and with View Transitions (`<ClientRouter />`), where it renders again on `astro:page-load`.

## Migrating from 0.3.x

0.4.0 replaces the React component with an Astro component. To upgrade:

1. Remove `client:load` (or `client:idle`) from `<ScratchblocksRenderer>`. Astro components do not take `client:*` directives; if left in, Astro logs a warning for each use.
2. Rename `className` to `class`.
3. The `vite.optimizeDeps.include` and `vite.ssr.noExternal` entries for this package in `astro.config.mjs` are no longer needed.
4. If nothing else on your site uses React, you can remove `@astrojs/react`, `react` and `react-dom`.

## License

MIT. This package depends on scratchblocks, which is also MIT licensed.
Not affiliated with or endorsed by the scratchblocks project.
