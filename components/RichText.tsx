import katex from "katex";
import { Fragment } from "react";
import type { RichTextString } from "@/lib/types";

/**
 * Рендва RichTextString: обикновен текст с $inline KaTeX$ и **удебеляване**.
 * Работи и в сървърни, и в клиентски компоненти.
 */
export default function RichText({ text }: { text: RichTextString }) {
  const parts = text.split(/(\$[^$]+\$|\*\*[^*]+?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          const html = katex.renderToString(part.slice(1, -1), {
            throwOnError: false,
            displayMode: false,
          });
          return <span key={i} dangerouslySetInnerHTML={{ __html: html }} />;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
