import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderScratchblocks } from '../src/render';

let parseMock: ReturnType<typeof vi.fn> | undefined;
let renderMock: ReturnType<typeof vi.fn> | undefined;

vi.mock('scratchblocks', () => {
  return {
    get parse() {
      return parseMock;
    },
    get render() {
      return renderMock;
    },
    default: {
      get parse() {
        return parseMock;
      },
      get render() {
        return renderMock;
      },
    },
  };
});

function mount(attrs: Record<string, string>) {
  const div = document.createElement('div');
  div.setAttribute('data-scratchblocks', '');
  for (const [name, value] of Object.entries(attrs)) {
    div.setAttribute(name, value);
  }
  document.body.appendChild(div);
  return div;
}

function mockSvg() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

describe('renderScratchblocks', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  beforeEach(() => {
    parseMock = vi.fn();
    renderMock = vi.fn();
  });

  it('renders an SVG when parse/render succeed', async () => {
    parseMock?.mockReturnValue({ blocks: true });
    renderMock?.mockReturnValue(mockSvg());

    const el = mount({ 'data-code': 'when flag clicked', 'data-style': 'scratch3' });
    await renderScratchblocks();

    expect(el.querySelector('svg')).toBeTruthy();
    expect(parseMock).toHaveBeenCalledWith('when flag clicked', { style: 'scratch3' });
  });

  it('falls back to <pre> when parse fails', async () => {
    parseMock?.mockImplementation(() => {
      throw new Error('bad parse');
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const el = mount({ 'data-code': 'move (10) steps' });
    await renderScratchblocks();

    const pre = el.querySelector('pre.blocks');
    expect(pre).toBeTruthy();
    expect(pre?.textContent).toBe('move (10) steps');
  });

  it('passes style to scratchblocks render', async () => {
    const blocks = { blocks: true };
    parseMock?.mockReturnValue(blocks);
    renderMock?.mockReturnValue(mockSvg());

    mount({ 'data-code': 'turn cw (15) degrees', 'data-style': 'scratch2' });
    await renderScratchblocks();

    expect(renderMock).toHaveBeenCalledWith(blocks, { style: 'scratch2' });
  });

  it('passes languages to scratchblocks parse/render', async () => {
    const blocks = { blocks: true };
    parseMock?.mockReturnValue(blocks);
    renderMock?.mockReturnValue(mockSvg());

    mount({
      'data-code': 'move (10) steps',
      'data-style': 'scratch3',
      'data-languages': '["en","ja"]',
    });
    await renderScratchblocks();

    const options = { style: 'scratch3', languages: ['en', 'ja'] };
    expect(parseMock).toHaveBeenCalledWith('move (10) steps', options);
    expect(renderMock).toHaveBeenCalledWith(blocks, options);
  });

  it('renders every block on the page and each only once', async () => {
    parseMock?.mockReturnValue({ blocks: true });
    renderMock?.mockImplementation(() => mockSvg());

    const first = mount({ 'data-code': 'when flag clicked' });
    const second = mount({ 'data-code': 'move (10) steps' });
    await Promise.all([renderScratchblocks(), renderScratchblocks()]);

    expect(first.querySelectorAll('svg')).toHaveLength(1);
    expect(second.querySelectorAll('svg')).toHaveLength(1);
    expect(parseMock).toHaveBeenCalledTimes(2);
  });

  it('renders blocks added after a page navigation', async () => {
    parseMock?.mockReturnValue({ blocks: true });
    renderMock?.mockImplementation(() => mockSvg());

    mount({ 'data-code': 'when flag clicked' });
    await renderScratchblocks();

    const added = mount({ 'data-code': 'move (10) steps' });
    await renderScratchblocks();

    expect(added.querySelector('svg')).toBeTruthy();
    expect(parseMock).toHaveBeenCalledTimes(2);
  });

  it('falls back to <pre> when parse/render are missing', async () => {
    parseMock = undefined;
    renderMock = undefined;
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const el = mount({ 'data-code': 'say [hello!]' });
    await renderScratchblocks();

    const pre = el.querySelector('pre.blocks');
    expect(pre).toBeTruthy();
    expect(pre?.textContent).toBe('say [hello!]');
  });
});
