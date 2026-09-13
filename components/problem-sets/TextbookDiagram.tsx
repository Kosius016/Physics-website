import SvgTex from "@/components/interactives/SvgTex";
import { Arrow, C, STAGE_CLASS, STAGE_BG, TexChip } from "@/components/interactives/svg";
import type { TextbookDiagram as DiagramData, XY } from "@/lib/textbook11";

/** Equal scales on both axes keep angles and vector lengths geometrically faithful. */
export default function TextbookDiagram({ data }: { data: DiagramData }) {
  const [xmin, xmax, ymin, ymax] = data.bounds;
  const scale = Math.min(400 / (xmax - xmin), 250 / (ymax - ymin));
  const width = Math.max(260, Math.ceil((xmax - xmin) * scale + 64));
  const height = Math.max(170, Math.ceil((ymax - ymin) * scale + 64));
  const project = ([x, y]: XY): XY => [width / 2 + (x - (xmin + xmax) / 2) * scale, height / 2 - (y - (ymin + ymax) / 2) * scale];
  const [ox, oy] = project([0, 0]);
  return (
    <div className="my-4 w-full overflow-x-auto rounded-[10px]">
      <svg viewBox={`0 0 ${width} ${height}`} className={STAGE_CLASS + " min-w-[260px] max-h-[360px]"} style={{ backgroundColor: STAGE_BG }} role="img" aria-label={data.caption.replace(/\$/g, "")}>
        <rect width={width} height={height} fill={STAGE_BG} />
        {data.axes && <g>
          <Arrow x1={16} y1={oy} x2={width - 30} y2={oy} color={C.faint} width={1.2} />
          <Arrow x1={ox} y1={height - 20} x2={ox} y2={24} color={C.faint} width={1.2} />
          <SvgTex x={width - 22} y={oy + 16} tex="x" color={C.mut} width={20} anchor="middle" />
          <SvgTex x={ox + 16} y={23} tex="y" color={C.mut} width={20} anchor="middle" />
          <SvgTex x={ox - 14} y={oy + 17} tex="O" color={C.mut} width={20} anchor="middle" />
        </g>}
        {data.paths?.map((path, i) => <polyline key={i} points={path.points.map(p => project(p).join(",")).join(" ")} fill="none" stroke={C[path.color]} strokeWidth={path.color === "warn" ? 3 : 1.4} strokeDasharray={path.color === "faint" ? "5 4" : undefined} />)}
        {data.arrows.map((arrow, i) => {
          const [x1, y1] = project(arrow.from), [x2, y2] = project(arrow.to);
          if (Math.hypot(x2 - x1, y2 - y1) < 0.01) return <circle key={i} cx={x1} cy={y1} r={4} fill={C[arrow.color]} />;
          return <Arrow key={i} x1={x1} y1={y1} x2={x2} y2={y2} color={C[arrow.color]} width={2.6} />;
        })}
        {data.arrows.map((arrow, i) => {
          if (!arrow.label || !arrow.labelAt) return null;
          const [x, y] = project(arrow.labelAt);
          return <TexChip key={i} x={x} y={y} tex={arrow.label} color={C[arrow.color]} width={30} fontSize={14} anchor="middle" padX={3} padY={2} />;
        })}
        {data.labels?.filter(label => label.text).map((label, i) => {
          const [x, y] = project(label.at);
          return <SvgTex key={i} x={x} y={y} tex={label.text} color={C.wire} width={24} anchor="middle" />;
        })}
      </svg>
    </div>
  );
}
