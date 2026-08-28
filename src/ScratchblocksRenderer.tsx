import { useEffect, useRef } from 'react';
import type { HTMLAttributes } from 'react';

interface ScratchblocksRendererProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  code: string;
  style?: 'scratch2' | 'scratch3';
  languages?: string[];
}

export default function ScratchblocksRenderer({
  code,
  style = 'scratch3',
  languages,
  ...rest
}: ScratchblocksRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;

    const renderBlock = async () => {
      try {
        const scratchblocks = await import('scratchblocks');

        if (!isCurrent || !containerRef.current) return;

        const parse = scratchblocks.parse || scratchblocks.default?.parse;
        const render = scratchblocks.render || scratchblocks.default?.render;

        if (parse && render) {
          try {
            const options: { style: 'scratch2' | 'scratch3'; languages?: string[] } = {
              style,
            };
            if (languages !== undefined) options.languages = languages;

            const blocks = parse(code, options);
            const svg = render(blocks, options);

            if (!isCurrent || !containerRef.current) return;

            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(svg);

            if (import.meta.env.DEV) {
              console.log('Scratchblocks rendered successfully');
            }
          } catch (parseError) {
            console.error('Parse/render error:', parseError);
            if (!isCurrent || !containerRef.current) return;
            const pre = document.createElement('pre');
            pre.className = 'blocks';
            pre.textContent = code;
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(pre);
          }
        } else {
          console.warn('parse or render function not found');
          if (!isCurrent || !containerRef.current) return;
          const pre = document.createElement('pre');
          pre.className = 'blocks';
          pre.textContent = code;
          containerRef.current.appendChild(pre);
        }
      } catch (error) {
        console.error('Error loading scratchblocks:', error);
        if (!isCurrent || !containerRef.current) return;
        const pre = document.createElement('pre');
        pre.className = 'blocks';
        pre.textContent = code;
        containerRef.current.appendChild(pre);
      }
    };

    renderBlock();

    return () => {
      isCurrent = false;
    };
  }, [code, style, languages]);

  return <div ref={containerRef} style={{ marginBottom: '1rem' }} {...rest} />;
}
