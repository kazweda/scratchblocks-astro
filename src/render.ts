type BlockStyle = 'scratch2' | 'scratch3';

interface RenderOptions {
  style: BlockStyle;
  languages?: string[];
}

const SELECTOR = '[data-scratchblocks]:not([data-scratchblocks-rendered])';

function showFallback(container: HTMLElement, code: string) {
  const pre = document.createElement('pre');
  pre.className = 'blocks';
  pre.textContent = code;
  container.replaceChildren(pre);
}

function readOptions(container: HTMLElement): RenderOptions {
  const style: BlockStyle =
    container.dataset.style === 'scratch2' ? 'scratch2' : 'scratch3';
  const options: RenderOptions = { style };
  if (container.dataset.languages !== undefined) {
    options.languages = JSON.parse(container.dataset.languages);
  }
  return options;
}

export async function renderScratchblocks(root: ParentNode = document) {
  const containers = Array.from(root.querySelectorAll<HTMLElement>(SELECTOR));
  if (containers.length === 0) return;

  // Mark before the async import so a second call (e.g. astro:page-load
  // right after the initial run) does not render the same element twice.
  for (const container of containers) {
    container.setAttribute('data-scratchblocks-rendered', '');
  }

  let parse: ((code: string, options: RenderOptions) => unknown) | undefined;
  let render: ((blocks: unknown, options: RenderOptions) => Element) | undefined;

  try {
    const scratchblocks = await import('scratchblocks');
    parse = scratchblocks.parse || scratchblocks.default?.parse;
    render = scratchblocks.render || scratchblocks.default?.render;
    if (!parse || !render) console.warn('parse or render function not found');
  } catch (error) {
    console.error('Error loading scratchblocks:', error);
  }

  if (!parse || !render) {
    for (const container of containers) {
      showFallback(container, container.dataset.code ?? '');
    }
    return;
  }

  for (const container of containers) {
    const code = container.dataset.code ?? '';
    try {
      const options = readOptions(container);
      const blocks = parse(code, options);
      const svg = render(blocks, options);
      container.replaceChildren(svg);
    } catch (parseError) {
      console.error('Parse/render error:', parseError);
      showFallback(container, code);
    }
  }
}
