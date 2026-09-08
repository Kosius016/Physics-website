import SvgTex from "@/components/interactives/SvgTex";
import {
  C,
  DRAWING_FONT_FAMILY,
  STAGE_BG,
  STAGE_CLASS,
  TexChip,
} from "@/components/interactives/svg";

export type DcDiagramKind =
  | "divider"
  | "kvl"
  | "rc"
  | "diode"
  | "led"
  | "loading";

const PIN_Y: Record<string, number> = {
  D8: 76,
  D9: 76,
  A0: 146,
  A1: 204,
  A2: 262,
  V5: 76,
  GND: 320,
};

function Wire({
  x1,
  y1,
  x2,
  y2,
  color = C.wire,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeLinecap="round" />;
}

function Node({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} fill={C.warn} />;
}

function ResistorV({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <Wire x1={x} y1={y - 46} x2={x} y2={y - 25} />
      <rect x={x - 13} y={y - 25} width={26} height={50} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
      <Wire x1={x} y1={y + 25} x2={x} y2={y + 46} />
      <SvgTex x={x + 24} y={y} tex={label} color={C.warn} width={44} />
    </g>
  );
}

function ResistorH({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <Wire x1={x - 58} y1={y} x2={x - 28} y2={y} />
      <rect x={x - 28} y={y - 13} width={56} height={26} fill={STAGE_BG} stroke={C.wire} strokeWidth={2.5} />
      <Wire x1={x + 28} y1={y} x2={x + 58} y2={y} />
      <SvgTex x={x} y={y - 27} tex={label} color={C.warn} width={46} anchor="middle" />
    </g>
  );
}

function CapacitorV({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <Wire x1={x} y1={y - 48} x2={x} y2={y - 9} />
      <line x1={x - 24} y1={y - 9} x2={x + 24} y2={y - 9} stroke={C.wire} strokeWidth={3} />
      <line x1={x - 24} y1={y + 9} x2={x + 24} y2={y + 9} stroke={C.wire} strokeWidth={3} />
      <Wire x1={x} y1={y + 9} x2={x} y2={y + 48} />
      <SvgTex x={x + 33} y={y} tex={label} color={C.warn} width={42} />
      <SvgTex x={x + 4} y={y - 23} tex="+" color={C.plus} width={18} />
    </g>
  );
}

function DiodeV({ x, y, label, led = false }: { x: number; y: number; label: string; led?: boolean }) {
  return (
    <g>
      <Wire x1={x} y1={y - 48} x2={x} y2={y - 22} />
      <path d={`M ${x - 22} ${y - 22} L ${x + 22} ${y - 22} L ${x} ${y + 12} Z`} fill="none" stroke={C.wire} strokeWidth={2.5} />
      <line x1={x - 23} y1={y + 16} x2={x + 23} y2={y + 16} stroke={C.wire} strokeWidth={3} />
      <Wire x1={x} y1={y + 16} x2={x} y2={y + 48} />
      <SvgTex x={x + 31} y={y} tex={label} color={C.warn} width={54} />
      {led ? (
        <g stroke={C.plus} strokeWidth={2.2} strokeLinecap="round">
          <line x1={x + 18} y1={y - 19} x2={x + 40} y2={y - 37} />
          <line x1={x + 28} y1={y - 8} x2={x + 50} y2={y - 26} />
          <path d={`M ${x + 34} ${y - 36} l 7 -1 l -1 7`} fill="none" />
          <path d={`M ${x + 44} ${y - 25} l 7 -1 l -1 7`} fill="none" />
        </g>
      ) : null}
    </g>
  );
}

function Ground({ x, y }: { x: number; y: number }) {
  return (
    <g stroke={C.wire} strokeWidth={2.2} strokeLinecap="round">
      <line x1={x} y1={y - 15} x2={x} y2={y} />
      <line x1={x - 18} y1={y} x2={x + 18} y2={y} />
      <line x1={x - 12} y1={y + 7} x2={x + 12} y2={y + 7} />
      <line x1={x - 6} y1={y + 14} x2={x + 6} y2={y + 14} />
    </g>
  );
}

function ArduinoBoard({ pins }: { pins: readonly string[] }) {
  return (
    <g>
      <rect x={514} y={34} width={164} height={318} rx={16} fill={C.wire} fillOpacity={0.08} stroke={C.wire} strokeWidth={2} />
      <text x={596} y={56} textAnchor="middle" fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={13} fontWeight={600} letterSpacing={1.1}>
        ARDUINO UNO
      </text>
      {pins.map((pin) => (
        <g key={pin}>
          <circle cx={514} cy={PIN_Y[pin]} r={6} fill={pin === "GND" ? C.minus : pin.startsWith("A") ? C.ok : C.plus} />
          <SvgTex
            x={532}
            y={PIN_Y[pin]}
            tex={pin === "V5" ? String.raw`5\,\mathrm{V}` : pin === "GND" ? String.raw`\mathrm{GND}` : `${pin[0]}_${pin.slice(1)}`}
            color={pin === "GND" ? C.minus : pin.startsWith("A") ? C.ok : C.plus}
            width={70}
          />
        </g>
      ))}
    </g>
  );
}

function ToPin({ fromX, fromY, pin, color = C.ok }: { fromX: number; fromY: number; pin: string; color?: string }) {
  const targetY = PIN_Y[pin];
  return (
    <path
      d={`M ${fromX} ${fromY} C ${fromX + 74} ${fromY}, 454 ${targetY}, 514 ${targetY}`}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
    />
  );
}

function DividerDiagram({ loading = false }: { loading?: boolean }) {
  const x = 222;
  const sourceY = 74;
  const nodeY = 196;
  const groundY = 330;
  return (
    <>
      <ArduinoBoard pins={loading ? ["V5", "A0", "A1", "GND"] : ["D8", "A0", "A1", "GND"]} />
      <Wire x1={x} y1={sourceY} x2={x} y2={92} color={C.plus} />
      <ResistorV x={x} y={138} label="R_1" />
      <Wire x1={x} y1={184} x2={x} y2={nodeY} />
      <Node x={x} y={nodeY} />
      <Wire x1={x} y1={nodeY} x2={x} y2={214} />
      <ResistorV x={x} y={260} label="R_2" />
      <Wire x1={x} y1={306} x2={x} y2={groundY - 15} />
      <Ground x={x} y={groundY} />
      <ToPin fromX={x} fromY={sourceY} pin={loading ? "V5" : "D8"} color={C.plus} />
      <ToPin fromX={x + 2} fromY={sourceY + 13} pin="A1" />
      <ToPin fromX={x} fromY={nodeY} pin="A0" />
      <ToPin fromX={x + 4} fromY={groundY - 7} pin="GND" color={C.minus} />
      <TexChip x={x - 20} y={sourceY} tex={String.raw`V_{\mathrm{in}}`} color={C.plus} width={58} anchor="end" />
      <TexChip x={x - 20} y={nodeY} tex={String.raw`V_{\mathrm{out}}`} color={C.ok} width={66} anchor="end" />
      {loading ? (
        <g>
          <Wire x1={x} y1={nodeY} x2={356} y2={nodeY} />
          <ResistorV x={356} y={260} label="R_L" />
          <Wire x1={356} y1={214} x2={356} y2={nodeY} />
          <Wire x1={356} y1={306} x2={356} y2={groundY} />
          <Wire x1={x} y1={groundY} x2={356} y2={groundY} />
        </g>
      ) : null}
    </>
  );
}

function KvlDiagram() {
  const x = 214;
  const sourceY = 48;
  const node1Y = 145;
  const node2Y = 242;
  const groundY = 346;
  return (
    <>
      <ArduinoBoard pins={["D8", "A0", "A1", "A2", "GND"]} />
      <ToPin fromX={x} fromY={sourceY} pin="D8" color={C.plus} />
      <ToPin fromX={x + 2} fromY={sourceY + 8} pin="A0" />
      <ResistorV x={x} y={99} label="R_1" />
      <Node x={x} y={node1Y} />
      <ToPin fromX={x} fromY={node1Y} pin="A1" />
      <ResistorV x={x} y={196} label="R_2" />
      <Node x={x} y={node2Y} />
      <ToPin fromX={x} fromY={node2Y} pin="A2" />
      <ResistorV x={x} y={293} label="R_3" />
      <Wire x1={x} y1={339} x2={x} y2={groundY - 15} />
      <Ground x={x} y={groundY} />
      <ToPin fromX={x + 4} fromY={groundY - 7} pin="GND" color={C.minus} />
      <TexChip x={x - 22} y={sourceY} tex="V_0" color={C.ok} width={38} anchor="end" />
      <TexChip x={x - 22} y={node1Y} tex="V_1" color={C.ok} width={38} anchor="end" />
      <TexChip x={x - 22} y={node2Y} tex="V_2" color={C.ok} width={38} anchor="end" />
    </>
  );
}

function RcDiagram() {
  const source = { x: 112, y: 154 };
  const node = { x: 348, y: 154 };
  const groundY = 320;
  return (
    <>
      <ArduinoBoard pins={["D8", "A0", "A1", "GND"]} />
      <Wire x1={source.x} y1={source.y} x2={158} y2={source.y} color={C.plus} />
      <ResistorH x={216} y={source.y} label="R" />
      <Wire x1={274} y1={source.y} x2={node.x} y2={node.y} />
      <Node x={node.x} y={node.y} />
      <CapacitorV x={node.x} y={245} label="C" />
      <Ground x={node.x} y={groundY} />
      <ToPin fromX={source.x} fromY={source.y} pin="D8" color={C.plus} />
      <ToPin fromX={source.x + 6} fromY={source.y + 12} pin="A1" />
      <ToPin fromX={node.x} fromY={node.y} pin="A0" />
      <ToPin fromX={node.x + 2} fromY={groundY - 7} pin="GND" color={C.minus} />
      <TexChip x={node.x - 14} y={node.y - 27} tex="V_C" color={C.ok} width={42} anchor="middle" />
    </>
  );
}

function IvDiagram({ led }: { led: boolean }) {
  const sweep = { x: 294, y: 150 };
  const diodeNode = { x: 420, y: 150 };
  const groundY = 330;
  return (
    <>
      <ArduinoBoard pins={["D9", "A0", "A1", "GND"]} />
      <Wire x1={82} y1={150} x2={116} y2={150} color={C.plus} />
      <ResistorH x={174} y={150} label="R_f" />
      <Wire x1={232} y1={150} x2={sweep.x} y2={150} />
      <Node x={sweep.x} y={150} />
      <CapacitorV x={sweep.x} y={248} label="C_f" />
      <Wire x1={sweep.x} y1={150} x2={316} y2={150} />
      <ResistorH x={362} y={150} label="R_s" />
      <Node x={diodeNode.x} y={150} />
      <DiodeV x={diodeNode.x} y={246} label={led ? "LED" : "D"} led={led} />
      <Wire x1={sweep.x} y1={296} x2={sweep.x} y2={groundY} />
      <Wire x1={diodeNode.x} y1={294} x2={diodeNode.x} y2={groundY} />
      <Wire x1={sweep.x} y1={groundY} x2={diodeNode.x} y2={groundY} />
      <Ground x={diodeNode.x} y={groundY} />
      <ToPin fromX={82} fromY={150} pin="D9" color={C.plus} />
      <ToPin fromX={sweep.x} fromY={150} pin="A0" />
      <ToPin fromX={diodeNode.x} fromY={150} pin="A1" />
      <ToPin fromX={diodeNode.x + 2} fromY={groundY - 7} pin="GND" color={C.minus} />
      <TexChip x={sweep.x} y={116} tex="V_s" color={C.ok} width={38} anchor="middle" />
      <TexChip x={diodeNode.x} y={116} tex={led ? "V_{LED}" : "V_D"} color={C.ok} width={58} anchor="middle" />
    </>
  );
}

export default function DcLabDiagram({ kind }: { kind: DcDiagramKind }) {
  return (
    <svg viewBox="0 0 720 380" className={STAGE_CLASS} aria-label={`Схема за лабораторния опит: ${kind}`}>
      <rect width={720} height={380} fill={STAGE_BG} />
      {kind === "divider" ? <DividerDiagram /> : null}
      {kind === "kvl" ? <KvlDiagram /> : null}
      {kind === "rc" ? <RcDiagram /> : null}
      {kind === "diode" ? <IvDiagram led={false} /> : null}
      {kind === "led" ? <IvDiagram led /> : null}
      {kind === "loading" ? <DividerDiagram loading /> : null}
    </svg>
  );
}
