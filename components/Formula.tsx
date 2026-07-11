import katex from "katex";

/** Display-режим KaTeX формула в отделен блок. */
export default function Formula({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, {
    throwOnError: false,
    displayMode: true,
  });
  return (
    <div
      className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
