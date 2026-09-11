"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Legend, PlotFrame, RangeControl, Readouts, Stage, StageScroll, Toggle, dec, scaler } from "./acPlot";
import { C, DRAWING_FONT_FAMILY, PANEL_CLASS, STAGE_BG, STAGE_CLASS, TexChip } from "./svg";

/**
 * Интерактиви към §2-§5 на урока за диодите.
 *
 * Осите навсякъде са фиксирани в реални единици, а не изведени от текущата
 * стойност на плъзгача: иначе кривата се пренормира заедно с параметъра и
 * изглежда неподвижна, макар числата да се менят.
 */

const W = 640;
// височината се задава за всяка сцена поотделно
const MINW = 540;

/* ============================================ §2 волт-амперна характеристика */

const VT = 0.02585; // волта: топлинното напрежение kT/q при 300 K
const N_ID = 1; // коефициент на идеалност
const IS_MA = 7e-11; // милиампера, подбрано така, че коляното да падне на 0,7 V
const I_FWD = 60; // милиампера: обхват на десния панел
const I_REV = 60; // микроампера: обхват на левия панел
const V_FWD = 0.8; // волта
const V_REV = -6; // волта
const V_ZENER = 5.1; // волта

/** Права посока: експонента по Шокли, ограничена отгоре от обхвата. */
function forwardMa(v: number) {
  if (v <= 0) return 0;
  return Math.min(I_FWD * 1.05, IS_MA * (Math.exp(v / (N_ID * VT)) - 1));
}

/**
 * Обратна посока в микроампери. В реален изправителен диод този ток не е
 * идеалният ток на насищане, а ток на генерация в самия слой: той е с порядъци
 * по-голям и леко расте с напрежението.
 */
function reverseUa(v: number, zener: boolean) {
  if (v >= 0) return 0;
  if (zener && v < -V_ZENER) {
    return -Math.min(I_REV * 1.06, 1.5 + (-v - V_ZENER) * 900);
  }
  return -(1.5 + 0.35 * -v);
}

/** Символ на диод: триъгълникът сочи към чертата, тоест към катода. */
function DiodeSymbol({ x, y, color, glow = false }: { x: number; y: number; color: string; glow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {glow && <circle cx={0} cy={0} r={22} fill={color} opacity={0.16} />}
      <polygon points="-10,-9 -10,9 6,0" fill={color} />
      <line x1={6} y1={-10.5} x2={6} y2={10.5} stroke={color} strokeWidth={2.8} />
    </g>
  );
}

export function DiodeIVLab() {
  const [volt, setVolt] = useState(0.6);
  const [zener, setZener] = useState(false);

  const fwd = scaler({ x: 366, y: 96, w: 214, h: 168 }, V_FWD, I_FWD, 0);
  const rev = scaler({ x: 96, y: 96, w: 214, h: 168 }, -V_REV, 0, -I_REV);
  /** Левият панел върви от -6 V наляво надясно към нулата. */
  const rx = (v: number) => rev.sx(v - V_REV);

  const ma = forwardMa(volt);
  const ua = reverseUa(volt, zener);
  const conducting = ma > 1;
  const breakingDown = zener && volt < -V_ZENER;
  const state = breakingDown ? "ПРОБИВ" : conducting ? "ПРОВЕЖДА" : "ЗАТВОРЕН";

  const fwdPath = Array.from({ length: 241 }, (_, k) => {
    const v = (V_FWD * k) / 240;
    return `${k === 0 ? "M" : "L"}${fwd.sx(v).toFixed(2)},${fwd.sy(Math.min(I_FWD, forwardMa(v))).toFixed(2)}`;
  }).join(" ");
  const revPath = Array.from({ length: 241 }, (_, k) => {
    const v = V_REV + ((-V_REV) * k) / 240;
    return `${k === 0 ? "M" : "L"}${rx(v).toFixed(2)},${rev.sy(Math.max(-I_REV, reverseUa(v, zener))).toFixed(2)}`;
  }).join(" ");

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Toggle on={zener} onChange={setZener}>
          Ценеров диод (пробив при 5,1 V)
        </Toggle>
        <span
          className={`text-[12.5px] font-bold ${
            breakingDown ? "text-plus" : conducting ? "text-ok" : "text-muted"
          }`}
        >
          {state}
        </span>
      </div>

      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} 300`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Волт-амперна характеристика на диод в два мащаба: обратна посока в микроампери и права посока в милиампери"
        >
          <Stage w={W} h={300} title="ДВА ПАНЕЛА, ДВА МАЩАБА: ОБРАТНИЯТ ТОК Е МИКРОАМПЕРИ" />

          {/* ляв панел: обратна посока */}
          <text x={96} y={62} fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={12.5} fontWeight={600} letterSpacing="0.07em">
            ОБРАТНА ПОСОКА
          </text>
          <g stroke={C.mut} strokeWidth={1.5}>
            <line x1={rev.box.x} y1={rev.box.y} x2={rev.box.x} y2={rev.box.y + rev.box.h} />
            <line x1={rev.box.x} y1={rev.box.y} x2={rev.box.x + rev.box.w} y2={rev.box.y} />
          </g>
          <SvgTex x={rev.box.x - 8} y={rev.box.y - 14} tex="I\ (\mu\mathrm{A})" color={C.minus} fontSize={12.5} width={66} anchor="end" />
          <SvgTex
            x={rev.box.x + rev.box.w + 6}
            y={rev.box.y + rev.box.h + 17}
            tex="V\ (\mathrm{V})"
            color={C.mut}
            fontSize={12.5}
            width={56}
          />
          {[-6, -4, -2].map((v) => (
            <g key={v}>
              <line
                x1={rx(v)}
                y1={rev.box.y}
                x2={rx(v)}
                y2={rev.box.y + rev.box.h}
                stroke={C.faint}
                strokeWidth={1}
                strokeDasharray="4 5"
              />
              <SvgTex
                x={rx(v)}
                y={rev.box.y + rev.box.h + 17}
                tex={dec(v, 0)}
                color={C.mut}
                fontSize={11.5}
                width={34}
                anchor="middle"
              />
            </g>
          ))}
          {[-20, -40].map((i) => (
            <g key={i}>
              <line x1={rev.box.x - 5} y1={rev.sy(i)} x2={rev.box.x} y2={rev.sy(i)} stroke={C.mut} strokeWidth={1.3} />
              <SvgTex x={rev.box.x - 9} y={rev.sy(i)} tex={dec(i, 0)} color={C.mut} fontSize={11.5} width={34} anchor="end" />
            </g>
          ))}
          <path d={revPath} fill="none" stroke={C.minus} strokeWidth={3} strokeLinecap="round" />

          {/* десен панел: права посока */}
          <text x={366} y={62} fill={C.mut} fontFamily={DRAWING_FONT_FAMILY} fontSize={12.5} fontWeight={600} letterSpacing="0.07em">
            ПРАВА ПОСОКА
          </text>
          <g stroke={C.mut} strokeWidth={1.5}>
            <line x1={fwd.box.x} y1={fwd.box.y} x2={fwd.box.x} y2={fwd.box.y + fwd.box.h} />
            <line x1={fwd.box.x} y1={fwd.box.y + fwd.box.h} x2={fwd.box.x + fwd.box.w} y2={fwd.box.y + fwd.box.h} />
          </g>
          <SvgTex x={fwd.box.x - 8} y={fwd.box.y - 14} tex="I\ (\mathrm{mA})" color={C.ok} fontSize={12.5} width={66} anchor="end" />
          <SvgTex x={fwd.box.x + fwd.box.w + 6} y={fwd.box.y + fwd.box.h - 12} tex="V\ (\mathrm{V})" color={C.mut} fontSize={12.5} width={56} />
          {[0.2, 0.4, 0.6, 0.8].map((v) => (
            <g key={v}>
              <line x1={fwd.sx(v)} y1={fwd.box.y + fwd.box.h} x2={fwd.sx(v)} y2={fwd.box.y + fwd.box.h + 5} stroke={C.mut} strokeWidth={1.3} />
              <SvgTex x={fwd.sx(v)} y={fwd.box.y + fwd.box.h + 17} tex={dec(v, 1)} color={C.mut} fontSize={11.5} width={40} anchor="middle" />
            </g>
          ))}
          {[20, 40].map((i) => (
            <g key={i}>
              <line x1={fwd.box.x - 5} y1={fwd.sy(i)} x2={fwd.box.x} y2={fwd.sy(i)} stroke={C.mut} strokeWidth={1.3} />
              <SvgTex x={fwd.box.x - 9} y={fwd.sy(i)} tex={dec(i, 0)} color={C.mut} fontSize={11.5} width={34} anchor="end" />
            </g>
          ))}
          <path d={fwdPath} fill="none" stroke={C.ok} strokeWidth={3} strokeLinecap="round" />

          {/* работната точка стои в панела, на който принадлежи текущото напрежение */}
          {volt >= 0 ? (
            <>
              <line x1={fwd.sx(volt)} y1={fwd.box.y} x2={fwd.sx(volt)} y2={fwd.box.y + fwd.box.h} stroke={C.warn} strokeWidth={1.5} strokeDasharray="5 4" />
              <circle cx={fwd.sx(volt)} cy={fwd.sy(Math.min(I_FWD, ma))} r={6} fill={C.warn} stroke={STAGE_BG} strokeWidth={2} />
            </>
          ) : (
            <>
              <line x1={rx(Math.max(V_REV, volt))} y1={rev.box.y} x2={rx(Math.max(V_REV, volt))} y2={rev.box.y + rev.box.h} stroke={C.warn} strokeWidth={1.5} strokeDasharray="5 4" />
              <circle cx={rx(Math.max(V_REV, volt))} cy={rev.sy(Math.max(-I_REV, ua))} r={6} fill={C.warn} stroke={STAGE_BG} strokeWidth={2} />
            </>
          )}

          <DiodeSymbol x={330} y={180} color={conducting ? C.ok : breakingDown ? C.plus : C.mut} glow={conducting || breakingDown} />
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.minus, tex: "обратен ток в $\\mu\\mathrm{A}$" },
          { color: C.ok, tex: "прав ток в $\\mathrm{mA}$" },
          { color: C.warn, tex: "работната точка" },
        ]}
      />

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Напрежение върху диода $V$" />}
          value={volt}
          min={-6}
          max={0.8}
          step={0.02}
          valueTex={`${dec(volt, 2)}\\,\\mathrm{V}`}
          onChange={setVolt}
        />
      </div>

      <Readouts
        cols={4}
        cells={[
          {
            label: "Ток",
            tex: volt >= 0 ? `I=${dec(ma, 2)}\\,\\mathrm{mA}` : `I=${dec(ua, 1)}\\,\\mu\\mathrm{A}`,
            color: breakingDown ? "var(--color-plus)" : volt >= 0 ? "var(--color-ok)" : "var(--color-minus)",
          },
          { label: "Състояние", tex: `\\text{${state.toLowerCase()}}`, color: "var(--color-ink)" },
          {
            label: "Десет пъти повече ток иска",
            tex: `\\Delta V=${dec(N_ID * VT * Math.LN10 * 1000, 0)}\\,\\mathrm{mV}`,
            color: "var(--color-muted)",
          },
          {
            label: "Отношение прав към обратен",
            tex: volt >= 0.4 ? `${dec(Math.round((ma * 1000) / 3), 0)}\\times` : `\\text{нужно е } V>0{,}4\\,\\mathrm{V}`,
            color: "var(--color-muted)",
          },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Двата панела нарочно са в различни мащаби: вдясно милиампери, вляво микроампери. В един общ мащаб обратният клон би лежал върху оста и щеше да изглежда като точна нула, а той не е. Вдясно се вижда и че коляното не е чупка: $I=I_S\left(e^{V/V_T}-1\right)$ е гладка експонента, само че десетократно увеличение на тока иска едва $60\,\mathrm{mV}$. Затова „праг $0{,}7\,\mathrm{V}$“ е удобен модел, а не закон." />
      </p>
    </div>
  );
}

/* ============================================== §3 преходът и обедненият слой */

const V_BI = 0.7; // волта: контактната потенциална разлика

export function PNJunctionLab() {
  const [bias, setBias] = useState(0);

  /** Широчината на обеднения слой расте като корен от общата бариера. */
  const barrier = Math.max(0.02, V_BI - bias);
  const width = 46 * Math.sqrt(barrier / V_BI);
  const forward = bias > 0.55;
  const cx = 320;
  const top = 92;
  const height = 118;
  const left = 96;
  const right = 544;

  const carriers = (x0: number, x1: number, sign: 1 | -1, color: string, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const col = i % Math.ceil(n / 3);
      const row = Math.floor(i / Math.ceil(n / 3));
      const x = x0 + 16 + col * ((x1 - x0 - 32) / Math.max(1, Math.ceil(n / 3) - 1));
      const y = top + 26 + row * ((height - 52) / 2);
      if (x > cx - width && x < cx + width) return null;
      return (
        <g key={`${sign}${i}`}>
          <circle cx={x} cy={y} r={7} fill={color} opacity={0.9} />
          <line x1={x - 3.4} y1={y} x2={x + 3.4} y2={y} stroke={STAGE_BG} strokeWidth={1.8} />
          {sign === 1 && <line x1={x} y1={y - 3.4} x2={x} y2={y + 3.4} stroke={STAGE_BG} strokeWidth={1.8} />}
        </g>
      );
    });

  return (
    <div className={PANEL_CLASS}>
      <StageScroll minWidth={MINW}>
        <svg
          viewBox={`0 0 ${W} 296`}
          className={`${STAGE_CLASS} select-none`}
          role="img"
          aria-label="Слой без свободни носители между областите p и n и как външното напрежение мени широчината му"
        >
          <Stage w={W} h={296} title="ЕДИН СЛОЙ БЕЗ СВОБОДНИ НОСИТЕЛИ РЕШАВА ВСИЧКО" />

          <rect x={left} y={top} width={cx - left} height={height} fill={C.plus} opacity={0.14} />
          <rect x={cx} y={top} width={right - cx} height={height} fill={C.minus} opacity={0.14} />
          <rect
            x={cx - width}
            y={top}
            width={2 * width}
            height={height}
            fill={C.wire}
            opacity={0.1}
            stroke={C.faint}
            strokeDasharray="5 4"
          />
          <rect x={left} y={top} width={right - left} height={height} fill="none" stroke={C.mut} strokeWidth={1.6} />

          {carriers(left, cx, 1, C.plus, 9)}
          {carriers(cx, right, -1, C.minus, 9)}

          {/* оголените неподвижни йони в самия слой */}
          {width > 22 &&
            [0, 1, 2].map((row) => (
              <g key={row}>
                <text
                  x={cx - width / 2}
                  y={top + 34 + row * ((height - 52) / 2)}
                  textAnchor="middle"
                  fill={C.mut}
                  fontFamily={DRAWING_FONT_FAMILY}
                  fontSize={15}
                  fontWeight={600}
                >
                  −
                </text>
                <text
                  x={cx + width / 2}
                  y={top + 34 + row * ((height - 52) / 2)}
                  textAnchor="middle"
                  fill={C.mut}
                  fontFamily={DRAWING_FONT_FAMILY}
                  fontSize={15}
                  fontWeight={600}
                >
                  +
                </text>
              </g>
            ))}

          <text x={left + 14} y={top - 12} fill={C.plus} fontFamily={DRAWING_FONT_FAMILY} fontSize={13} fontWeight={600} letterSpacing="0.08em">
            ОБЛАСТ p · ДУПКИ
          </text>
          <text x={right - 14} y={top - 12} textAnchor="end" fill={C.minus} fontFamily={DRAWING_FONT_FAMILY} fontSize={13} fontWeight={600} letterSpacing="0.08em">
            ОБЛАСТ n · ЕЛЕКТРОНИ
          </text>

          <line x1={cx - width} y1={top + height + 10} x2={cx + width} y2={top + height + 10} stroke={C.warn} strokeWidth={2.2} />
          <line x1={cx - width} y1={top + height + 5} x2={cx - width} y2={top + height + 15} stroke={C.warn} strokeWidth={2.2} />
          <line x1={cx + width} y1={top + height + 5} x2={cx + width} y2={top + height + 15} stroke={C.warn} strokeWidth={2.2} />
          <SvgTex x={cx} y={top + height + 34} tex="w" color={C.warn} fontSize={13} width={24} anchor="middle" />

          {/* токът тече само когато слоят е практически затворен */}
          {forward &&
            [0, 1, 2].map((row) => (
              <g key={`flow${row}`}>
                <path
                  d={`M ${left + 30} ${top + 26 + row * ((height - 52) / 2)} H ${right - 30}`}
                  stroke={C.ok}
                  strokeWidth={2.4}
                  strokeDasharray="10 8"
                  opacity={0.85}
                >
                  <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.6s" repeatCount="indefinite" />
                </path>
              </g>
            ))}

          <text
            x={cx}
            y={top + height + 62}
            textAnchor="middle"
            fill={forward ? C.ok : C.mut}
            fontFamily={DRAWING_FONT_FAMILY}
            fontSize={13}
            fontWeight={600}
            letterSpacing="0.08em"
          >
            {forward ? "СЛОЯТ Е СВИТ · ТОКЪТ МИНАВА" : bias < 0 ? "СЛОЯТ Е РАЗШИРЕН · ТОК НЯМА" : "РАВНОВЕСИЕ · ТОК НЯМА"}
          </text>
        </svg>
      </StageScroll>

      <Legend
        items={[
          { color: C.plus, tex: "дупки в областта $p$" },
          { color: C.minus, tex: "електрони в областта $n$" },
          { color: C.warn, tex: "широчина на обеднения слой $w$" },
        ]}
      />

      <div className="mt-4">
        <RangeControl
          label={<RichText text="Външно напрежение върху прехода" />}
          value={bias}
          min={-5}
          max={0.7}
          step={0.05}
          valueTex={`${dec(bias, 2)}\\,\\mathrm{V}`}
          onChange={setBias}
        />
      </div>

      <Readouts
        cols={3}
        cells={[
          { label: "Обща бариера", tex: `V_{\\text{бар}}=${dec(barrier, 2)}\\,\\mathrm{V}`, color: "var(--color-warn)" },
          {
            label: "Широчина спрямо равновесната",
            tex: `w/w_0=${dec(Math.sqrt(barrier / V_BI), 2)}`,
            color: "var(--color-ink)",
          },
          {
            label: "Посока",
            tex: `\\text{${bias > 0.02 ? "права" : bias < -0.02 ? "обратна" : "без напрежение"}}`,
            color: "var(--color-muted)",
          },
        ]}
      />

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        <RichText text="Обедненият слой не е преграда, която някой е сложил: той се получава сам. Дупките и електроните при границата се срещат и се унищожават взаимно, а остават неподвижните йони на примесите, чието поле спира по-нататъшното преминаване. Обратното напрежение дърпа носителите навън и слоят се разширява, затова ток няма. Правото напрежение го свива и щом почти изчезне, токът тръгва." />
      </p>
    </div>
  );
}
