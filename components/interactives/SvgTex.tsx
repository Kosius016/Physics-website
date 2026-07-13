"use client";

import katex from "katex";

type SvgTexAnchor = "start" | "middle" | "end";

/**
 * Кратък KaTeX етикет вътре в SVG сцена.
 *
 * Числените резултати остават в readout лентите под сцената; този компонент
 * е само за символи като I_1, d\vec B и B_x.
 */
export default function SvgTex({
  x,
  y,
  tex,
  color,
  fontSize = 14,
  width = 96,
  height = 30,
  anchor = "start",
  className,
}: {
  x: number;
  y: number;
  tex: string;
  color: string;
  fontSize?: number;
  width?: number;
  height?: number;
  anchor?: SvgTexAnchor;
  className?: string;
}) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: false,
  });
  const offsetX = anchor === "middle" ? -width / 2 : anchor === "end" ? -width : 0;
  const justifyContent = anchor === "middle" ? "center" : anchor === "end" ? "flex-end" : "flex-start";

  return (
    <foreignObject
      x={x + offsetX}
      y={y - height / 2}
      width={width}
      height={height}
      className={className}
      style={{ overflow: "visible", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <span
        style={{
          alignItems: "center",
          color,
          display: "flex",
          fontSize,
          height: "100%",
          justifyContent,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </foreignObject>
  );
}
