# scratchblocks-astro

Unofficial Scratchblocks renderer React component for Astro.

## Install (GitHub direct)

```bash
npm install github:kazweda/scratchblocks-astro
```

```bash
pnpm add kazweda/scratchblocks-astro
```

```bash
yarn add kazweda/scratchblocks-astro
```

## Usage (Astro MDX)

```mdx
import { ScratchblocksRenderer } from 'scratchblocks-astro';

<ScratchblocksRenderer
  client:load
  code={`when flag clicked
move (10) steps`}
/>
```

## Notes

- This component must run on the client. Use `client:load` or `client:idle`.
- If your build fails to resolve TS/JSX from this package, add it to `vite.ssr.noExternal` and `vite.optimizeDeps.include` in `astro.config.mjs`.

```js
// astro.config.mjs
export default {
  vite: {
    optimizeDeps: {
      include: ['scratchblocks-astro'],
    },
    ssr: {
      noExternal: ['scratchblocks-astro'],
    },
  },
};
```

## Tagging Releases (GitHub Direct)

```bash
git tag v0.1.0
git push origin v0.1.0
```

## License

MIT. This package depends on scratchblocks, which is also MIT licensed.
Not affiliated with or endorsed by the scratchblocks project.
