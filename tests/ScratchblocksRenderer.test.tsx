import { render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ScratchblocksRenderer from '../src/ScratchblocksRenderer';

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

describe('ScratchblocksRenderer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    parseMock = vi.fn();
    renderMock = vi.fn();
  });

  it('renders an SVG when parse/render succeed', async () => {
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    parseMock?.mockReturnValue({ blocks: true });
    renderMock?.mockReturnValue(mockSvg);

    vi.spyOn(console, 'log').mockImplementation(() => {});

    const { container } = render(
      <ScratchblocksRenderer code="when flag clicked" />
    );

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeTruthy();
    });

  });

  it('falls back to <pre> when parse fails', async () => {
    parseMock?.mockImplementation(() => {
      throw new Error('bad parse');
    });

    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { container } = render(
      <ScratchblocksRenderer code="move (10) steps" />
    );

    await waitFor(() => {
      const pre = container.querySelector('pre.blocks');
      expect(pre).toBeTruthy();
      expect(pre?.textContent).toBe('move (10) steps');
    });

  });

  it('passes style to scratchblocks render', async () => {
    const blocks = { blocks: true };
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    parseMock?.mockReturnValue(blocks);
    renderMock?.mockReturnValue(mockSvg);

    const { container } = render(
      <ScratchblocksRenderer code="turn cw (15) degrees" style="scratch2" />
    );

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeTruthy();
    });

    expect(renderMock).toHaveBeenCalledWith(blocks, { style: 'scratch2' });
  });

  it('passes languages to scratchblocks parse/render', async () => {
    const blocks = { blocks: true };
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    parseMock?.mockReturnValue(blocks);
    renderMock?.mockReturnValue(mockSvg);

    const { container } = render(
      <ScratchblocksRenderer code="move (10) steps" languages={['en', 'ja']} />
    );

    await waitFor(() => {
      expect(container.querySelector('svg')).toBeTruthy();
    });

    expect(parseMock).toHaveBeenCalledWith('move (10) steps', {
      style: 'scratch3',
      languages: ['en', 'ja'],
    });
    expect(renderMock).toHaveBeenCalledWith(blocks, {
      style: 'scratch3',
      languages: ['en', 'ja'],
    });
  });

  it('passes through HTML attributes to the root div', async () => {
    const blocks = { blocks: true };
    const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

    parseMock?.mockReturnValue(blocks);
    renderMock?.mockReturnValue(mockSvg);

    const { container } = render(
      <ScratchblocksRenderer code="move (10) steps" className="my-class" data-testid="sb" />
    );

    const root = container.firstElementChild;
    expect(root?.className).toBe('my-class');
    expect(root?.getAttribute('data-testid')).toBe('sb');
  });

  it('falls back to <pre> when parse/render are missing', async () => {
    parseMock = undefined;
    renderMock = undefined;

    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { container } = render(
      <ScratchblocksRenderer code="say [hello!]" />
    );

    await waitFor(() => {
      const pre = container.querySelector('pre.blocks');
      expect(pre).toBeTruthy();
      expect(pre?.textContent).toBe('say [hello!]');
    });

  });
});
