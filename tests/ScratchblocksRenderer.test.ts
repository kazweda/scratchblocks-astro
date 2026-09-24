// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import ScratchblocksRenderer from '../src/ScratchblocksRenderer.astro';

async function renderToString(props: Record<string, unknown>) {
  const container = await AstroContainer.create();
  return container.renderToString(ScratchblocksRenderer, { props });
}

describe('ScratchblocksRenderer.astro', () => {
  it('writes code and default style to data attributes', async () => {
    const html = await renderToString({ code: 'when flag clicked\nmove (10) steps' });

    expect(html).toContain('data-scratchblocks');
    expect(html).toContain('data-code="when flag clicked\nmove (10) steps"');
    expect(html).toContain('data-style="scratch3"');
    expect(html).not.toContain('data-languages');
  });

  it('escapes code so it cannot break out of the attribute', async () => {
    const html = await renderToString({ code: 'say ["<b>hi</b>"]' });

    expect(html).toContain('data-code="say [&quot;<b>hi</b>&quot;]"');
  });

  it('writes style and languages', async () => {
    const html = await renderToString({
      code: 'move (10) steps',
      style: 'scratch2',
      languages: ['en', 'ja'],
    });

    expect(html).toContain('data-style="scratch2"');
    expect(html).toContain('data-languages="[&quot;en&quot;,&quot;ja&quot;]"');
  });

  it('passes through HTML attributes to the root div', async () => {
    const html = await renderToString({
      code: 'move (10) steps',
      class: 'my-class',
      'data-testid': 'sb',
    });

    expect(html).toContain('class="my-class"');
    expect(html).toContain('data-testid="sb"');
    expect(html).toContain('style="margin-bottom: 1rem"');
  });
});
