"use client";

import {
  memo,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import {
  AngleArc,
  Arrow,
  C,
  DRAWING_FONT_FAMILY,
  PANEL_CLASS,
  STAGE_BG,
  STAGE_CLASS,
  TexChip,
  svgPoint,
} from "@/components/interactives/svg";
import {
  LabShell,
  RangeControl,
  decimal,
  graphGrid,
  svgNumber,
} from "@/components/problem-sets/LabShell";

/**
 * Сцени и интерактивни проверки към контролното по електростатика.
 *
 * Композиционното правило в целия файл: надписите стоят в легендата над
 * графиката, по осите или в readout лентата. Вътре в полето на графиката няма
 * плаващ текст, затова кривите не могат да се застъпят с етикет.
 */

const CAP_LABEL = {
  fill: C.mut,
  fontFamily: DRAWING_FONT_FAMILY,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 1.4,
} as const;

/** Общ панел за статична сцена: заглавие, сцена и пояснение под нея. */
export function FigurePanel({
  eyebrow = "Схема към условието",
  title,
  caption,
  children,
}: {
  eyebrow?: string;
  title: string;
  caption: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className={PANEL_CLASS}>
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">{eyebrow}</p>
        <h3 className="mt-1 font-serif text-[22px] font-bold">{title}</h3>
      </div>
      {children}
      <figcaption className="mt-3 text-[13.5px] leading-relaxed text-muted">{caption}</figcaption>
    </figure>
  );
}

/* ────────────────────────────  Задача 1  ──────────────────────────── */

/** Сфера с линейно растяща плътност и зарядът на един тънък слой. */
export function SphereDensityFigure() {
  const cx = 170;
  const cy = 138;
  const R = 94;
  const shell = 0.67 * R;

  const barLeft = 400;
  const barTop = 62;
  const barWidth = 270;
  const barHeight = 132;
  const bars = Array.from({ length: 9 }, (_, index) => {
    const t = (index + 0.5) / 9;
    return { x: barLeft + index * 30 + 2, h: svgNumber(barHeight * t * t * t) };
  });

  return (
    <svg
      viewBox="0 0 720 250"
      className={STAGE_CLASS}
      aria-label="Сфера с растяща обемна плътност и зарядът на един тънък сферичен слой"
    >
      <defs>
        <radialGradient id="rho-growing" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.plus} stopOpacity={0.06} />
          <stop offset="55%" stopColor={C.plus} stopOpacity={0.3} />
          <stop offset="100%" stopColor={C.plus} stopOpacity={0.72} />
        </radialGradient>
      </defs>
      <rect width={720} height={250} fill={STAGE_BG} />

      <text x={cx} y={22} textAnchor="middle" {...CAP_LABEL}>
        РАСТЯЩА ПЛЪТНОСТ
      </text>
      <circle cx={cx} cy={cy} r={R} fill="url(#rho-growing)" stroke={C.wire} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={shell} fill="none" stroke={C.warn} strokeWidth={9} opacity={0.5} />
      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + R * Math.cos(-0.61))}
        y2={svgNumber(cy + R * Math.sin(-0.61))}
        stroke={C.wire}
        strokeWidth={2}
      />
      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + shell * Math.cos(2.62))}
        y2={svgNumber(cy + shell * Math.sin(2.62))}
        stroke={C.warn}
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={3.5} fill={C.wire} />
      <TexChip x={214} y={100} tex="R" color={C.wire} width={13} />
      <TexChip x={120} y={162} tex="r" color={C.warn} width={10} />
      <line x1={cx} y1={cy + shell + 6} x2={cx} y2={cy + shell + 18} stroke={C.warn} strokeWidth={1.5} />
      <TexChip x={cx} y={226} tex={String.raw`dr`} color={C.warn} width={20} anchor="middle" />

      <text x={535} y={22} textAnchor="middle" {...CAP_LABEL}>
        ЗАРЯД НА СЛОЯ
      </text>
      {bars.map((bar) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={svgNumber(barTop + barHeight - bar.h)}
          width={26}
          height={bar.h}
          fill={C.plus}
          opacity={0.32}
          stroke={C.plus}
          strokeWidth={1.5}
        />
      ))}
      <line
        x1={barLeft}
        y1={barTop + barHeight}
        x2={barLeft + barWidth}
        y2={barTop + barHeight}
        stroke={C.wire}
        strokeWidth={2}
      />
      <line x1={barLeft} y1={barTop} x2={barLeft} y2={barTop + barHeight} stroke={C.wire} strokeWidth={2} />
      <SvgTex x={barLeft} y={48} tex={String.raw`dq\propto r^3\,dr`} color={C.plus} width={130} />
      <SvgTex x={barLeft + barWidth} y={barTop + barHeight + 26} tex="r" color={C.wire} width={13} anchor="end" />
    </svg>
  );
}

function sphereValues(t: number) {
  return {
    field: t <= 1 ? t * t : 1 / (t * t),
    potential: t <= 1 ? (4 - t * t * t) / 3 : 1 / t,
    enclosed: t <= 1 ? t * t * t * t : 1,
  };
}

export function ChargedSphereLab() {
  const [t, setT] = useState(0.7);
  const left = 84;
  const top = 44;
  const width = 560;
  const height = 206;
  const tMax = 3;
  const yMax = 1.4;
  const sx = (value: number) => svgNumber(left + (value / tMax) * width);
  const sy = (value: number) => svgNumber(top + ((yMax - value) / yMax) * height);
  const samples = Array.from({ length: 181 }, (_, index) => (index / 180) * tMax);
  const path = (pick: (value: ReturnType<typeof sphereValues>) => number) =>
    samples.map((value) => `${sx(value)},${sy(pick(sphereValues(value)))}`).join(" ");
  const now = sphereValues(t);

  return (
    <LabShell
      title="Полето расте навътре и спада навън"
      description="Вътре в сферата обхванатият заряд расте като четвърта степен на радиуса, затова полето расте вместо да спада. Вън от сферата всичко изглежда като точков заряд."
      controls={
        <RangeControl
          label="Радиус на гаусовата сфера"
          value={t}
          min={0}
          max={3}
          step={0.01}
          valueLabel={<RichText text={`$r/R=${decimal(t, 2)}$`} />}
          onChange={setT}
        />
      }
      readouts={[
        { label: "Радиус", tex: `r/R=${decimal(t, 2)}` },
        { label: "Обхванат заряд", tex: `Q_{\\text{вътр}}/Q=${decimal(now.enclosed, 3)}`, tone: "text-plus" },
        { label: "Поле", tex: `E/E(R)=${decimal(now.field, 3)}`, tone: "text-ok" },
        { label: "Потенциал", tex: `V/V(R)=${decimal(now.potential, 3)}`, tone: "text-minus" },
      ]}
      readoutColumns="sm:grid-cols-4"
    >
      <svg
        viewBox="0 0 720 326"
        className={STAGE_CLASS}
        aria-label="Поле, потенциал и обхванат заряд на сфера с растяща плътност"
      >
        <rect width={720} height={326} fill={STAGE_BG} />
        <SvgTex x={84} y={22} tex={String.raw`E/E(R)`} color={C.ok} width={92} />
        <SvgTex x={210} y={22} tex={String.raw`V/V(R)`} color={C.minus} width={92} />
        <SvgTex x={336} y={22} tex={String.raw`Q_{\text{вътр}}/Q`} color={C.plus} width={128} />
        {graphGrid({ left, top, width, height })}
        <line
          x1={sx(1)}
          y1={top}
          x2={sx(1)}
          y2={top + height}
          stroke={C.wire}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          opacity={0.5}
        />
        <polyline points={path((v) => v.enclosed)} fill="none" stroke={C.plus} strokeWidth={2} strokeDasharray="7 5" />
        <polyline points={path((v) => v.potential)} fill="none" stroke={C.minus} strokeWidth={2.5} />
        <polyline points={path((v) => v.field)} fill="none" stroke={C.ok} strokeWidth={3} />
        <line x1={sx(t)} y1={top} x2={sx(t)} y2={top + height} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={sx(t)} cy={sy(now.enclosed)} r={5} fill={C.plus} />
        <circle cx={sx(t)} cy={sy(now.potential)} r={5.5} fill={C.minus} />
        <circle cx={sx(t)} cy={sy(now.field)} r={5.5} fill={C.ok} />
        {[1, 2, 3].map((tick) => (
          <SvgTex
            key={tick}
            x={sx(tick)}
            y={top + height + 26}
            tex={`${tick}`}
            color={C.mut}
            width={14}
            anchor="middle"
          />
        ))}
        <SvgTex x={left - 12} y={sy(1)} tex="1" color={C.mut} width={13} anchor="end" />
        <SvgTex x={left + width} y={top + height + 58} tex="r/R" color={C.wire} width={44} anchor="end" />
      </svg>
    </LabShell>
  );
}

/* ────────────────────────────  Задача 2  ──────────────────────────── */

/** Дискът като сбор от концентрични пръстени и точка върху оста. */
export function DiskRingFigure() {
  const cx = 160;
  const cy = 122;
  const rx = 24;
  const ry = 88;
  const ringK = 0.625;
  const px = 516;
  const axisEnd = 636;

  return (
    <svg
      viewBox="0 0 720 260"
      className={STAGE_CLASS}
      aria-label="Зареден диск, разложен на концентрични пръстени, и точка върху оста му"
    >
      <rect width={720} height={260} fill={STAGE_BG} />

      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.plus} opacity={0.16} stroke={C.plus} strokeWidth={2} />
      {[0.28, 0.45, 0.79].map((k) => (
        <ellipse
          key={k}
          cx={cx}
          cy={cy}
          rx={rx * k}
          ry={ry * k}
          fill="none"
          stroke={C.plus}
          strokeWidth={1.2}
          opacity={0.38}
        />
      ))}
      <ellipse cx={cx} cy={cy} rx={rx * ringK} ry={ry * ringK} fill="none" stroke={C.warn} strokeWidth={3} />

      <line x1={cx} y1={cy} x2={axisEnd} y2={cy} stroke={C.faint} strokeWidth={1.5} strokeDasharray="6 6" />
      <circle cx={px} cy={cy} r={6} fill={C.minus} />
      <SvgTex x={px} y={cy - 28} tex="P" color={C.minus} width={16} anchor="middle" />

      <line
        x1={cx}
        y1={svgNumber(cy - ry * ringK)}
        x2={px}
        y2={cy}
        stroke={C.minus}
        strokeWidth={1.8}
        strokeDasharray="7 5"
      />
      <SvgTex x={352} y={66} tex={String.raw`s=\sqrt{r^2+z^2}`} color={C.minus} width={140} anchor="middle" />

      <Arrow x1={cx} y1={cy} x2={cx} y2={svgNumber(cy - ry * ringK)} color={C.warn} width={2} />
      <TexChip x={cx + 13} y={cy - 28} tex="r" color={C.warn} width={10} />
      <Arrow x1={112} y1={cy} x2={112} y2={svgNumber(cy - ry)} color={C.wire} width={2} />
      <SvgTex x={102} y={cy - 48} tex="R" color={C.wire} width={16} anchor="end" />

      <line x1={cx} y1={170} x2={px} y2={170} stroke={C.wire} strokeWidth={1.5} />
      <line x1={cx} y1={162} x2={cx} y2={178} stroke={C.wire} strokeWidth={1.5} />
      <line x1={px} y1={162} x2={px} y2={178} stroke={C.wire} strokeWidth={1.5} />
      <SvgTex x={338} y={188} tex="z" color={C.wire} width={13} anchor="middle" />

      <text x={cx} y={240} textAnchor="middle" {...CAP_LABEL}>
        ЗАРЕДЕНА МЕМБРАНА
      </text>
      <SvgTex x={axisEnd} y={44} tex={String.raw`dq=\sigma\,2\pi r\,dr`} color={C.plus} width={140} anchor="end" />
    </svg>
  );
}

function diskValues(t: number) {
  return {
    exact: 1 - t / Math.sqrt(1 + t * t),
    point: 1 / (2 * t * t),
    potential: Math.sqrt(1 + t * t) - t,
  };
}

export function ChargedDiskLab() {
  const [t, setT] = useState(0.58);
  const left = 84;
  const top = 44;
  const width = 560;
  const height = 206;
  const tMax = 4;
  const sx = (value: number) => svgNumber(left + (value / tMax) * width);
  const sy = (value: number) => svgNumber(top + ((1.05 - value) / 1.05) * height);
  const samples = Array.from({ length: 241 }, (_, index) => (index / 240) * tMax);
  const now = diskValues(t);
  const half = 1 / Math.sqrt(3);

  return (
    <LabShell
      title="От безкрайна равнина до точков заряд"
      description="Плъзгачът мести точката по оста. Близо до диска полето е това на безкрайна равнина, а далеч съвпада с полето на точков заряд със същия пълен заряд."
      controls={
        <RangeControl
          label="Разстояние по оста"
          value={t}
          min={0.02}
          max={4}
          step={0.01}
          valueLabel={<RichText text={`$z/R=${decimal(t, 2)}$`} />}
          onChange={setT}
        />
      }
      readouts={[
        { label: "Разстояние", tex: `z/R=${decimal(t, 2)}` },
        { label: "Поле", tex: `E_z/E_z(0)=${decimal(now.exact, 3)}`, tone: "text-ok" },
        {
          label: "Точков заряд",
          tex:
            now.point > 99
              ? `E_{\\text{точк}}/E_z(0)>99`
              : `E_{\\text{точк}}/E_z(0)=${decimal(now.point, 3)}`,
          tone: "text-plus",
        },
        { label: "Потенциал", tex: `V/V(0)=${decimal(now.potential, 3)}`, tone: "text-minus" },
      ]}
      readoutColumns="sm:grid-cols-4"
    >
      <svg
        viewBox="0 0 720 326"
        className={STAGE_CLASS}
        aria-label="Поле върху оста на зареден диск и сравнение с точков заряд"
      >
        <rect width={720} height={326} fill={STAGE_BG} />
        <SvgTex x={84} y={22} tex={String.raw`E_z/E_z(0)`} color={C.ok} width={104} />
        <SvgTex x={220} y={22} tex={String.raw`Q/4\pi\varepsilon_0z^2`} color={C.plus} width={132} />
        <SvgTex x={392} y={22} tex={String.raw`V/V(0)`} color={C.minus} width={88} />
        {graphGrid({ left, top, width, height })}
        <line
          x1={left}
          y1={sy(0.5)}
          x2={sx(half)}
          y2={sy(0.5)}
          stroke={C.wire}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          opacity={0.5}
        />
        <line
          x1={sx(half)}
          y1={sy(0.5)}
          x2={sx(half)}
          y2={top + height}
          stroke={C.wire}
          strokeWidth={1.5}
          strokeDasharray="5 5"
          opacity={0.5}
        />
        <circle cx={sx(half)} cy={sy(0.5)} r={5} fill={C.wire} />
        <polyline
          points={samples
            .filter((value) => value > 0 && diskValues(value).point <= 1.05)
            .map((value) => `${sx(value)},${sy(diskValues(value).point)}`)
            .join(" ")}
          fill="none"
          stroke={C.plus}
          strokeWidth={2}
          strokeDasharray="7 5"
        />
        <polyline
          points={samples.map((value) => `${sx(value)},${sy(diskValues(value).potential)}`).join(" ")}
          fill="none"
          stroke={C.minus}
          strokeWidth={2}
          opacity={0.7}
        />
        <polyline
          points={samples.map((value) => `${sx(value)},${sy(diskValues(value).exact)}`).join(" ")}
          fill="none"
          stroke={C.ok}
          strokeWidth={3}
        />
        <line x1={sx(t)} y1={top} x2={sx(t)} y2={top + height} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
        <circle cx={sx(t)} cy={sy(now.exact)} r={5.5} fill={C.ok} />
        {[1, 2, 3].map((tick) => (
          <SvgTex
            key={tick}
            x={sx(tick)}
            y={top + height + 26}
            tex={`${tick}`}
            color={C.mut}
            width={14}
            anchor="middle"
          />
        ))}
        <SvgTex x={left - 12} y={sy(1)} tex="1" color={C.mut} width={13} anchor="end" />
        <SvgTex x={left - 12} y={sy(0.5)} tex={String.raw`\tfrac12`} color={C.mut} width={18} anchor="end" />
        <SvgTex x={left + width} y={top + height + 58} tex="z/R" color={C.wire} width={44} anchor="end" />
      </svg>
    </LabShell>
  );
}

/* ────────────────────────────  Задача 3  ──────────────────────────── */

/**
 * Геометрията на частично запълнения кондензатор.
 *
 * Едно и също чертане обслужва схемата към условието и интерактива в
 * решението: `showForce` е единствената разлика, защото силата е търсеното,
 * а не част от условието.
 */
function SlabScene({ x, showForce = false }: { x: number; showForce?: boolean }) {
  const hatchId = useId();
  const plateLeft = 54;
  const plateRight = 614;
  const span = plateRight - plateLeft;
  const slabEnd = svgNumber(plateLeft + span * x);
  const arrowEnd = svgNumber(Math.min(slabEnd + 76, plateRight - 10));

  return (
    <svg
      viewBox="0 0 720 236"
      className={STAGE_CLASS}
      aria-label={
        showForce
          ? "Диелектрична пластина в плосък кондензатор с посоката на силата върху нея"
          : "Диелектрична пластина, вкарана на дълбочина в плосък кондензатор"
      }
    >
      <defs>
        <pattern id={hatchId} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={C.minus} strokeWidth="1.6" opacity="0.5" />
        </pattern>
      </defs>
      <rect width={720} height={236} fill={STAGE_BG} />

      <rect x={plateLeft} y={64} width={span} height={8} fill={C.wire} />
      <rect x={plateLeft} y={158} width={span} height={8} fill={C.wire} />
      <rect x={plateLeft} y={72} width={svgNumber(slabEnd - plateLeft)} height={86} fill={C.minus} opacity={0.13} />
      <rect x={plateLeft} y={72} width={svgNumber(slabEnd - plateLeft)} height={86} fill={`url(#${hatchId})`} />
      <line x1={slabEnd} y1={72} x2={slabEnd} y2={158} stroke={C.minus} strokeWidth={2.5} />

      {showForce ? (
        <>
          <Arrow x1={svgNumber(slabEnd + 10)} y1={102} x2={arrowEnd} y2={102} color={C.ok} width={3} />
          <SvgTex
            x={svgNumber((slabEnd + arrowEnd) / 2)}
            y={86}
            tex={String.raw`\vec F`}
            color={C.ok}
            width={24}
            anchor="middle"
          />
        </>
      ) : null}
      <TexChip
        x={svgNumber((plateLeft + slabEnd) / 2)}
        y={128}
        tex={String.raw`\varepsilon_r`}
        color={C.minus}
        width={15}
        anchor="middle"
      />
      <text x={svgNumber((slabEnd + plateRight) / 2)} y={150} textAnchor="middle" {...CAP_LABEL}>
        ВАКУУМ
      </text>

      <line x1={plateLeft} y1={40} x2={slabEnd} y2={40} stroke={C.warn} strokeWidth={1.5} />
      <line x1={plateLeft} y1={32} x2={plateLeft} y2={48} stroke={C.warn} strokeWidth={1.5} />
      <line x1={slabEnd} y1={32} x2={slabEnd} y2={48} stroke={C.warn} strokeWidth={1.5} />
      <SvgTex x={svgNumber((plateLeft + slabEnd) / 2)} y={18} tex="x" color={C.warn} width={13} anchor="middle" />

      <line x1={640} y1={72} x2={640} y2={158} stroke={C.wire} strokeWidth={1.5} />
      <line x1={632} y1={72} x2={648} y2={72} stroke={C.wire} strokeWidth={1.5} />
      <line x1={632} y1={158} x2={648} y2={158} stroke={C.wire} strokeWidth={1.5} />
      <SvgTex x={656} y={115} tex="d" color={C.wire} width={13} />

      <line x1={plateLeft} y1={198} x2={plateRight} y2={198} stroke={C.wire} strokeWidth={1.5} />
      <line x1={plateLeft} y1={190} x2={plateLeft} y2={206} stroke={C.wire} strokeWidth={1.5} />
      <line x1={plateRight} y1={190} x2={plateRight} y2={206} stroke={C.wire} strokeWidth={1.5} />
      <SvgTex
        x={svgNumber((plateLeft + plateRight) / 2)}
        y={218}
        tex="L"
        color={C.wire}
        width={13}
        anchor="middle"
      />
    </svg>
  );
}

/** Схема към условието на Задача 3: геометрията без търсената сила. */
export function DielectricSlabFigure() {
  return <SlabScene x={0.42} />;
}

export function DielectricSlabLab() {
  const [x, setX] = useState(0.4);
  const [epsilon, setEpsilon] = useState(4);

  const left = 84;
  const top = 44;
  const width = 560;
  const height = 196;
  const sx = (value: number) => svgNumber(left + value * width);
  const sy = (value: number) => svgNumber(top + ((1.08 - value) / 1.08) * height);
  const chargeForce = (value: number) => 1 / Math.pow(1 + (epsilon - 1) * value, 2);
  const samples = Array.from({ length: 121 }, (_, index) => index / 120);

  return (
    <LabShell
      title="Една геометрия, два различни отговора"
      description="При постоянно напрежение силата не зависи от дълбочината, защото производната на капацитета е постоянна. При изолиран кондензатор същата геометрия дава сила, която бързо отслабва."
      controls={
        <>
          <RangeControl
            label="Дълбочина на пластината"
            value={x}
            min={0.1}
            max={0.9}
            step={0.01}
            valueLabel={<RichText text={`$x/L=${decimal(x, 2)}$`} />}
            onChange={setX}
          />
          <RangeControl
            label="Диелектрична проницаемост"
            value={epsilon}
            min={1.5}
            max={9}
            step={0.1}
            valueLabel={<RichText text={`$\\varepsilon_r=${decimal(epsilon, 1)}$`} />}
            onChange={setEpsilon}
          />
        </>
      }
      readouts={[
        { label: "Дълбочина", tex: `x/L=${decimal(x, 2)}` },
        { label: "Капацитет", tex: `C/C_0=${decimal(1 + (epsilon - 1) * x, 2)}`, tone: "text-ok" },
        { label: "Сила при постоянно $\\Delta V_0$", tex: `F/F(0)=1{,}00`, tone: "text-minus" },
        { label: "Сила при постоянен $Q_0$", tex: `F/F(0)=${decimal(chargeForce(x), 3)}`, tone: "text-plus" },
      ]}
      readoutColumns="sm:grid-cols-4"
    >
      <div className="space-y-3">
        <SlabScene x={x} showForce />

        <svg
          viewBox="0 0 720 316"
          className={STAGE_CLASS}
          aria-label="Сравнение на силата при постоянно напрежение и при постоянен заряд"
        >
          <rect width={720} height={316} fill={STAGE_BG} />
          <SvgTex
            x={84}
            y={22}
            tex={String.raw`\Delta V_0=\mathrm{const}`}
            color={C.minus}
            width={130}
          />
          <SvgTex x={248} y={22} tex={String.raw`Q_0=\mathrm{const}`} color={C.plus} width={116} />
          <SvgTex x={400} y={22} tex={String.raw`F/F(0)`} color={C.wire} width={88} />
          {graphGrid({ left, top, width, height })}
          <line x1={left} y1={sy(1)} x2={left + width} y2={sy(1)} stroke={C.minus} strokeWidth={3} />
          <polyline
            points={samples.map((value) => `${sx(value)},${sy(chargeForce(value))}`).join(" ")}
            fill="none"
            stroke={C.plus}
            strokeWidth={3}
          />
          <line x1={sx(x)} y1={top} x2={sx(x)} y2={top + height} stroke={C.warn} strokeWidth={2} strokeDasharray="6 5" />
          <circle cx={sx(x)} cy={sy(1)} r={5.5} fill={C.minus} />
          <circle cx={sx(x)} cy={sy(chargeForce(x))} r={5.5} fill={C.plus} />
          <SvgTex x={left - 12} y={sy(1)} tex="1" color={C.mut} width={13} anchor="end" />
          <SvgTex x={left - 12} y={sy(0.5)} tex={String.raw`\tfrac12`} color={C.mut} width={18} anchor="end" />
          {[0.5, 1].map((tick) => (
            <SvgTex
              key={tick}
              x={sx(tick)}
              y={top + height + 26}
              tex={tick === 1 ? "1" : String.raw`\tfrac12`}
              color={C.mut}
              width={20}
              anchor="middle"
            />
          ))}
          <SvgTex x={left + width} y={top + height + 58} tex="x/L" color={C.wire} width={44} anchor="end" />
        </svg>
      </div>
    </LabShell>
  );
}

/* ────────────────────────────  Задача 4  ──────────────────────────── */

type StreamPoint = { x: number; y: number };

/**
 * Обръща $r^2/2+R^3/r=K$ (в единици $R=1$) за $r\ge 1$.
 *
 * Лявата страна расте монотонно там, затова половинното деление е достатъчно.
 * Стойности под $3/2$ нямат корен извън сферата: това е линията, която е
 * попаднала върху повърхността.
 */
function streamRadius(level: number) {
  if (level <= 1.5) return null;
  let lo = 1;
  let hi = 2;
  while (hi * hi * 0.5 + 1 / hi < level) hi *= 2;
  for (let index = 0; index < 40; index += 1) {
    const mid = (lo + hi) * 0.5;
    if (mid * mid * 0.5 + 1 / mid < level) lo = mid;
    else hi = mid;
  }
  return (lo + hi) * 0.5;
}

/**
 * Една силова линия, зададена с отстоянието `b` от оста далеч от сферата.
 *
 * Полето извън сферата е сбор от еднородното поле и поле на дипол в центъра.
 * За такова осесиметрично поле линиите са нивата на функцията на тока
 * `psi = (r^2/2 + R^3/r) sin^2(theta)`, а `psi = b^2/2` фиксира линията.
 * Същият похват описва и обтичането на сфера от флуид; там диполният член
 * влиза с обратен знак и затова линиите се изтласкват навън, вместо навътре.
 *
 * Линиите с `b < sqrt(3)` завършват върху сферата, останалите я подминават.
 * Затова резултатът е списък от участъци, а не една полилиния.
 */
function streamlineBranches(
  b: number,
  mirror: 1 | -1,
  cx: number,
  cy: number,
  scale: number,
  bounds: { x0: number; x1: number; y0: number; y1: number },
) {
  const branches: StreamPoint[][] = [];
  let run: StreamPoint[] = [];
  const steps = 360;

  for (let index = 0; index <= steps; index += 1) {
    const theta = 0.006 + (index / steps) * (Math.PI - 0.012);
    const sine = Math.sin(theta);
    const radius = streamRadius((b * b) / (2 * sine * sine));
    const x = radius === null ? 0 : cx + radius * Math.cos(theta) * scale;
    const y = radius === null ? 0 : cy - mirror * radius * sine * scale;
    const inside =
      radius !== null && x >= bounds.x0 && x <= bounds.x1 && y >= bounds.y0 && y <= bounds.y1;

    if (!inside) {
      if (run.length > 1) branches.push(run);
      run = [];
      continue;
    }
    run.push({ x: svgNumber(x), y: svgNumber(y) });
  }
  if (run.length > 1) branches.push(run);

  // Линия, попаднала върху сферата, спира част от пиксела преди нея, защото
  // стъпката по theta е крайна. Долепяме такъв край точно до повърхността.
  const snap = (point: StreamPoint) => {
    const dx = point.x - cx;
    const dy = point.y - cy;
    const distance = Math.hypot(dx, dy);
    if (distance > scale * 1.25 || distance === 0) return point;
    const factor = scale / distance;
    return { x: svgNumber(cx + dx * factor), y: svgNumber(cy + dy * factor) };
  };

  return branches.map((branch) => {
    const snapped = [...branch];
    snapped[0] = snap(snapped[0]);
    snapped[snapped.length - 1] = snap(snapped[snapped.length - 1]);
    return snapped;
  });
}

/** Обръща $r-R^3/r^2=A$ (в единици $R=1$) за $r\ge 1$; лявата страна расте монотонно. */
function equipotentialRadius(level: number) {
  if (level < 0) return null;
  let lo = 1;
  let hi = 2;
  while (hi - 1 / (hi * hi) < level) hi *= 2;
  for (let index = 0; index < 40; index += 1) {
    const mid = (lo + hi) * 0.5;
    if (mid - 1 / (mid * mid) < level) lo = mid;
    else hi = mid;
  }
  return (lo + hi) * 0.5;
}

/**
 * Еквипотенциала $V=\mp L E_0R$, взета отдясно (`side = 1`) или отляво.
 *
 * От $V=-E_0(r-R^3/r^2)\cos\theta$ следва $r-R^3/r^2=L/\cos\theta$. Далеч от
 * сферата кривата клони към равнина, перпендикулярна на полето, а близо до
 * полюса се отдалечава от повърхността. Точно това се вижда и на контурната
 * карта на потенциала.
 */
function equipotentialBranches(
  level: number,
  side: 1 | -1,
  cx: number,
  cy: number,
  scale: number,
  bounds: { x0: number; x1: number; y0: number; y1: number },
) {
  const branches: StreamPoint[][] = [];
  let run: StreamPoint[] = [];
  const steps = 240;
  const span = Math.PI - 0.06;

  for (let index = 0; index <= steps; index += 1) {
    const theta = -span / 2 + (index / steps) * span;
    const radius = equipotentialRadius(level / Math.cos(theta));
    const x = radius === null ? 0 : cx + side * radius * Math.cos(theta) * scale;
    const y = radius === null ? 0 : cy - radius * Math.sin(theta) * scale;
    const inside =
      radius !== null && x >= bounds.x0 && x <= bounds.x1 && y >= bounds.y0 && y <= bounds.y1;

    if (!inside) {
      if (run.length > 1) branches.push(run);
      run = [];
      continue;
    }
    run.push({ x: svgNumber(x), y: svgNumber(y) });
  }
  if (run.length > 1) branches.push(run);
  return branches;
}

/**
 * Връх на стрелка върху силова линия.
 *
 * Посоката на полето върви към по-малък индекс: масивът се обхожда от
 * $\theta\to0$ (дясната страна) към $\theta\to\pi$ (лявата).
 */
function StreamHead({ points, at, color }: { points: StreamPoint[]; at: number; color: string }) {
  const last = points.length - 1;
  const center = Math.min(last, Math.max(0, Math.round(at * last)));
  const ahead = points[Math.max(0, center - 4)];
  const behind = points[Math.min(last, center + 4)];
  const dx = ahead.x - behind.x;
  const dy = ahead.y - behind.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const size = 7;
  const tip = points[center];
  const baseX = tip.x - ux * size;
  const baseY = tip.y - uy * size;
  const nx = -uy * size * 0.5;
  const ny = ux * size * 0.5;

  return (
    <polygon
      points={`${tip.x},${tip.y} ${svgNumber(baseX + nx)},${svgNumber(baseY + ny)} ${svgNumber(
        baseX - nx,
      )},${svgNumber(baseY - ny)}`}
      fill={color}
    />
  );
}

/**
 * Схема към условието на Задача 4: постановката без отговора.
 *
 * Индуцираният заряд нарочно липсва, защото точно той е търсеното. Показани
 * са външното поле, обтичането около сферата и означенията, с които е написан
 * потенциалът.
 */
/** Потенциал и поле извън сферата, в единици $R=1$, $E_0=1$. */
function spherePotential(r: number, theta: number) {
  if (r <= 1) return 0;
  return -(r - 1 / (r * r)) * Math.cos(theta);
}

function sphereField(r: number, theta: number) {
  const cube = 1 / (r * r * r);
  const radial = (1 + 2 * cube) * Math.cos(theta);
  const tangential = -(1 - cube) * Math.sin(theta);
  return { radial, tangential, magnitude: Math.hypot(radial, tangential) };
}

/**
 * Затворена област „отвъд еквипотенциалата $V=\mp L$“, готова за запълване.
 *
 * Наслагването на много такива области с ниска прозрачност дава плавен преход
 * от стойността на потенциала, без нито един градиент: всяка следваща покрива
 * по-малка площ, затова наситеността расте към ръба.
 */
function potentialBand(
  level: number,
  side: 1 | -1,
  cx: number,
  cy: number,
  scale: number,
  reachX: number,
  reachY: number,
) {
  const points: string[] = [];
  let firstY = 0;
  let lastY = 0;
  const steps = 200;
  const span = Math.PI - 0.02;

  for (let index = 0; index <= steps; index += 1) {
    const theta = -span / 2 + (index / steps) * span;
    const radius = equipotentialRadius(level / Math.cos(theta));
    if (radius === null) continue;
    const y = cy - radius * Math.sin(theta) * scale;
    if (Math.abs(y - cy) > reachY) continue;
    const x = cx + side * radius * Math.cos(theta) * scale;
    if (points.length === 0) firstY = svgNumber(y);
    lastY = svgNumber(y);
    points.push(`${points.length === 0 ? "M" : "L"}${svgNumber(x)} ${svgNumber(y)}`);
  }
  if (points.length < 3) return null;

  const far = svgNumber(cx + side * reachX);
  return `${points.join(" ")} L${far} ${lastY} L${far} ${firstY} Z`;
}

interface SphereGeometryProps {
  cx: number;
  cy: number;
  radius: number;
  bounds: { x0: number; x1: number; y0: number; y1: number };
  offsets: number[];
  levels: number[];
  gradientId: string;
  showField: boolean;
  showEquipotential: boolean;
  showCharge: boolean;
  fieldColor?: string;
  equipotentialColor?: string;
  equipotentialOpacity?: number;
  fieldWidth?: number;
  /** Цветна карта на потенциала под всичко останало. */
  showPotential?: boolean;
  potentialAlpha?: number;
  potentialReach?: { x: number; y: number };
  sphereStroke?: string;
  sphereInner?: string;
  sphereOuter?: string;
  sphereInnerOpacity?: number;
  sphereOuterOpacity?: number;
}

/**
 * Общото рисуване на сцената: еквипотенциали, силови линии, сфера и
 * повърхностен заряд. Изнесено, за да служи и на схемата към условието, и на
 * интерактива, и `memo`-нато, защото при движение на пробата се променя само
 * маркерът, а тези десетки полилинии остават същите.
 */
const SphereGeometry = memo(function SphereGeometry({
  cx,
  cy,
  radius,
  bounds,
  offsets,
  levels,
  gradientId,
  showField,
  showEquipotential,
  showCharge,
  fieldColor = C.warn,
  equipotentialColor = C.mut,
  equipotentialOpacity = 0.5,
  fieldWidth = 1.8,
  showPotential = false,
  potentialAlpha = 0.075,
  potentialReach = { x: 300, y: 420 },
  sphereStroke = C.wire,
  sphereInner = C.wire,
  sphereOuter = C.wire,
  sphereInnerOpacity = 0.2,
  sphereOuterOpacity = 0.06,
}: SphereGeometryProps) {
  const lines = useMemo(
    () =>
      offsets.flatMap((b) =>
        ([1, -1] as const).flatMap((mirror) =>
          streamlineBranches(b, mirror, cx, cy, radius, bounds).map((points, index) => ({
            key: `e-${b}-${mirror}-${index}`,
            points,
            passing: points[0].x > cx && points[points.length - 1].x < cx,
          })),
        ),
      ),
    [offsets, cx, cy, radius, bounds],
  );

  const equipotentials = useMemo(
    () =>
      levels.flatMap((level) =>
        ([1, -1] as const).flatMap((side) =>
          equipotentialBranches(level, side, cx, cy, radius, bounds).map((points, index) => ({
            key: `v-${level}-${side}-${index}`,
            points,
          })),
        ),
      ),
    [levels, cx, cy, radius, bounds],
  );

  const charges = useMemo(() => {
    const ticks = [];
    for (let degrees = 4; degrees < 360; degrees += 8) {
      const angle = (degrees * Math.PI) / 180;
      const cosine = Math.cos(angle);
      const length = radius * (0.3 * Math.abs(cosine) + 0.012);
      ticks.push({
        key: degrees,
        x1: svgNumber(cx + radius * Math.cos(angle)),
        y1: svgNumber(cy - radius * Math.sin(angle)),
        x2: svgNumber(cx + (radius + length) * Math.cos(angle)),
        y2: svgNumber(cy - (radius + length) * Math.sin(angle)),
        color: cosine > 0 ? C.plus : C.minus,
      });
    }
    return ticks;
  }, [cx, cy, radius]);

  const bands = useMemo(() => {
    if (!showPotential) return [];
    const out: { key: string; d: string; color: string }[] = [];
    for (const side of [1, -1] as const) {
      for (let level = 0.2; level <= 2.85; level += 0.2) {
        const d = potentialBand(level, side, cx, cy, radius, potentialReach.x, potentialReach.y);
        if (d) out.push({ key: `p-${side}-${Math.round(level * 10)}`, d, color: side > 0 ? C.plus : C.minus });
      }
    }
    return out;
  }, [showPotential, cx, cy, radius, potentialReach]);

  return (
    <g>
      <defs>
        <radialGradient id={gradientId} cx="38%" cy="32%" r="78%">
          <stop offset="0%" stopColor={sphereInner} stopOpacity={sphereInnerOpacity} />
          <stop offset="100%" stopColor={sphereOuter} stopOpacity={sphereOuterOpacity} />
        </radialGradient>
        {/* Картата се спира до ивицата с линиите, за да остане тъмно поле за
            легендата и етикетите горе и долу. */}
        <clipPath id={`${gradientId}-clip`}>
          <rect
            x={bounds.x0}
            y={bounds.y0}
            width={bounds.x1 - bounds.x0}
            height={bounds.y1 - bounds.y0}
          />
        </clipPath>
      </defs>

      {bands.length ? (
        <g clipPath={`url(#${gradientId}-clip)`}>
          {bands.map((band) => (
            <path key={band.key} d={band.d} fill={band.color} opacity={potentialAlpha} />
          ))}
        </g>
      ) : null}

      {showEquipotential ? (
        <g>
          {equipotentials.map((curve) => (
            <polyline
              key={curve.key}
              points={curve.points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke={equipotentialColor}
              strokeWidth={1.4}
              strokeDasharray="6 5"
              opacity={equipotentialOpacity}
            />
          ))}
          <line
            x1={cx}
            y1={bounds.y0}
            x2={cx}
            y2={svgNumber(cy - radius)}
            stroke={equipotentialColor}
            strokeWidth={1.4}
            strokeDasharray="6 5"
            opacity={equipotentialOpacity}
          />
          <line
            x1={cx}
            y1={svgNumber(cy + radius)}
            x2={cx}
            y2={bounds.y1}
            stroke={equipotentialColor}
            strokeWidth={1.4}
            strokeDasharray="6 5"
            opacity={equipotentialOpacity}
          />
        </g>
      ) : null}

      {/* Плътна основа: скрива цветната карта, за да чете проводникът като тяло. */}
      <circle cx={cx} cy={cy} r={radius} fill={STAGE_BG} />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={`url(#${gradientId})`}
        stroke={sphereStroke}
        strokeWidth={2}
      />

      {showCharge ? (
        <g>
          {charges.map((tick) => (
            <line
              key={tick.key}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.color}
              strokeWidth={3.2}
              strokeLinecap="round"
              opacity={0.8}
            />
          ))}
        </g>
      ) : null}

      {showField ? (
        <g>
          {lines.map((line) => (
            <g key={line.key}>
              <polyline
                points={line.points.map((point) => `${point.x},${point.y}`).join(" ")}
                fill="none"
                stroke={fieldColor}
                strokeWidth={fieldWidth}
                opacity={0.9}
              />
              <StreamHead points={line.points} at={0.3} color={fieldColor} />
              {line.passing ? <StreamHead points={line.points} at={0.74} color={fieldColor} /> : null}
            </g>
          ))}
          <Arrow
            x1={bounds.x0}
            y1={cy}
            x2={svgNumber(cx - radius)}
            y2={cy}
            color={fieldColor}
            width={fieldWidth}
          />
          <Arrow
            x1={svgNumber(cx + radius)}
            y1={cy}
            x2={bounds.x1}
            y2={cy}
            color={fieldColor}
            width={fieldWidth}
          />
        </g>
      ) : null}
    </g>
  );
});

/**
 * Схема към условието на Задача 4: постановката без отговора.
 *
 * Индуцираният заряд нарочно липсва, защото точно той е търсеното. Показани
 * са външното поле, обтичането около сферата и означенията, с които е написан
 * потенциалът.
 */
export function SphereInFieldFigure() {
  const gradientId = useId();
  const W = 720;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2;
  const R = 88;

  /**
   * `SphereGeometry` рисува с оста $z$ водоравно. Завъртането на цялата група
   * на $-90°$ я изправя вертикално, както е в условието. Затова границите тук
   * са в незавъртяната рамка: `x` ограничава по височина, `y` по ширина.
   *
   * Цветната карта е изрязана до същите граници, така че горната и долната
   * ивица остават тъмни и легендата се чете без подложка под нея.
   */
  const bounds = useMemo(() => ({ x0: 166, x1: 554, y0: -90, y1: 590 }), []);
  const offsets = useMemo(() => [0.6, 1, 1.4, 1.75, 2.15, 2.6, 3.1, 3.6], []);
  const levels = useMemo(() => [0.4, 0.8, 1.2, 1.6, 2], []);
  const reach = useMemo(() => ({ x: 300, y: 420 }), []);
  const theta = (40 * Math.PI) / 180;
  const top = cy - (bounds.x1 - cx);
  const bottom = cy + (cx - bounds.x0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full rounded-[10px] border-[1.5px] border-rule bg-surface"
      aria-label="Потенциалът като цветна карта, силовите линии и еквипотенциалите около незаредена проводяща сфера в еднородно поле"
    >
      <rect width={W} height={H} fill="var(--color-surface)" />

      <g transform={`rotate(-90 ${cx} ${cy})`}>
        <SphereGeometry
          cx={cx}
          cy={cy}
          radius={R}
          bounds={bounds}
          offsets={offsets}
          levels={levels}
          gradientId={gradientId}
          showField
          showEquipotential
          showCharge={false}
          showPotential
          potentialAlpha={0.075}
          potentialReach={reach}
          fieldColor="var(--color-warn)"
          equipotentialColor="var(--color-plus)"
          equipotentialOpacity={0.8}
          fieldWidth={1.8}
          sphereStroke={C.mut}
          sphereInner={C.wire}
          sphereOuter={C.wire}
          sphereInnerOpacity={0.34}
          sphereOuterOpacity={0.14}
        />
      </g>

      {/* Оста минава и през проводника; прекъсва се само там, където под нея
          вече върви осевата силова линия. */}
      <g stroke="var(--color-muted)" strokeWidth={1.4} strokeDasharray="6 5">
        <line x1={cx} y1={svgNumber(top - 2)} x2={cx} y2={30} />
        <line x1={cx} y1={svgNumber(cy - R)} x2={cx} y2={svgNumber(cy + R)} />
        <line x1={cx} y1={H - 22} x2={cx} y2={svgNumber(bottom + 2)} />
      </g>
      <polygon points={`${cx},22 ${cx - 5},34 ${cx + 5},34`} fill="var(--color-muted)" />

      <g>
        <line x1={20} y1={30} x2={44} y2={30} stroke="var(--color-warn)" strokeWidth={2.2} />
        <SvgTex
          x={50}
          y={30}
          tex={String.raw`\vec E`}
          color="var(--color-warn)"
          width={24}
          fontSize={12.5}
        />
        <line
          x1={86}
          y1={30}
          x2={110}
          y2={30}
          stroke="var(--color-plus)"
          strokeWidth={1.8}
          strokeDasharray="5 4"
        />
        <SvgTex
          x={116}
          y={30}
          tex={String.raw`V=\mathrm{const}`}
          color="var(--color-plus)"
          width={84}
          fontSize={12.5}
        />
      </g>
      <SvgTex x={374} y={30} tex="z" color="var(--color-muted)" width={13} fontSize={12.5} />
      <SvgTex
        x={700}
        y={30}
        tex={String.raw`\vec E_0=E_0\hat z`}
        color="var(--color-muted)"
        width={94}
        anchor="end"
        fontSize={12.5}
      />

      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + R * Math.sin(theta))}
        y2={svgNumber(cy - R * Math.cos(theta))}
        stroke={C.mut}
        strokeWidth={1.4}
        strokeDasharray="4 4"
      />
      <AngleArc
        cx={cx}
        cy={cy}
        a1={-Math.PI / 2}
        a2={-Math.PI / 2 + theta}
        r={34}
        color={C.wire}
        texLabel={String.raw`\theta`}
      />

      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + R * 0.707)}
        y2={svgNumber(cy + R * 0.707)}
        stroke={C.mut}
        strokeWidth={1.2}
        strokeDasharray="3 3"
      />
      <circle cx={cx} cy={cy} r={3} fill={C.wire} />

      {/* Надписите стоят вляво от центъра, за да могат помощните линии за
          theta и за R да стигат до самия център, без да минават през тях. */}
      <SvgTex x={cx - 8} y={cy - 18} tex="E=0" color={C.wire} width={54} anchor="end" />
      <SvgTex
        x={cx - 8}
        y={cy + 14}
        tex={String.raw`V=\mathrm{const}`}
        color={C.wire}
        width={92}
        anchor="end"
        fontSize={13}
      />

      <SvgTex
        x={svgNumber(cx + 40)}
        y={svgNumber(cy + 62)}
        tex="R"
        color={C.wire}
        width={16}
        anchor="middle"
        fontSize={12.5}
      />
    </svg>
  );
}

function LayerToggle({
  label,
  color,
  dashed = false,
  gradient = false,
  pressed,
  onToggle,
}: {
  label: string;
  color: string;
  dashed?: boolean;
  gradient?: boolean;
  pressed: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-[1.5px] px-3 py-1.5 text-[13px] font-semibold shadow-hard-sm transition-colors active:translate-x-px active:translate-y-px active:shadow-none ${
        pressed ? "border-ink bg-hl text-ink" : "border-rule bg-surface text-muted"
      }`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-3 w-5 shrink-0 rounded-[2px]"
        style={
          gradient
            ? { background: `linear-gradient(90deg, ${C.minus}, ${C.plus})`, opacity: pressed ? 1 : 0.45 }
            : {
                height: 0,
                borderTopWidth: 2.5,
                borderTopStyle: dashed ? "dashed" : "solid",
                borderTopColor: color,
                opacity: pressed ? 1 : 0.45,
              }
        }
      />
      {label}
    </button>
  );
}

/**
 * Интерактивът към подточка в): пробата се води с мишката или с двата
 * плъзгача, а стойностите излизат в readout лентата под сцената.
 */
export function SphereFieldExplorer() {
  const gradientId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const W = 720;
  const H = 440;
  const cx = 360;
  const cy = 220;
  const R = 84;
  const bounds = useMemo(() => ({ x0: 16, x1: 704, y0: 16, y1: 424 }), []);
  const offsets = useMemo(() => [0.35, 0.7, 1.05, 1.4, 1.75, 2.1], []);
  const levels = useMemo(() => [0.6, 1.2, 1.8, 2.4, 3], []);

  const [showField, setShowField] = useState(true);
  const [showEquipotential, setShowEquipotential] = useState(true);
  const [showCharge, setShowCharge] = useState(false);
  const [probe, setProbe] = useState({ r: 1.6, degrees: 40, side: 1 });

  const theta = (probe.degrees * Math.PI) / 180;
  // Половин процент допуск: посочване точно по повърхността иначе попада на
  // $r=0{,}9999$ заради закръгляне и се брои за вътрешна точка.
  const inside = probe.r < 0.995;
  const potential = spherePotential(probe.r, theta);
  const field = sphereField(Math.max(probe.r, 1), theta);

  const probeX = svgNumber(cx + probe.r * Math.cos(theta) * R);
  const probeY = svgNumber(cy - probe.side * probe.r * Math.sin(theta) * R);
  const alongZ = field.radial * Math.cos(theta) - field.tangential * Math.sin(theta);
  const alongPerp = field.radial * Math.sin(theta) + field.tangential * Math.cos(theta);
  const norm = Math.hypot(alongZ, alongPerp) || 1;
  const tipX = svgNumber(probeX + (alongZ / norm) * 46);
  const tipY = svgNumber(probeY - ((probe.side * alongPerp) / norm) * 46);

  const handlePointer = useCallback(
    (event: ReactPointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const [x, y] = svgPoint(svg, event.clientX, event.clientY, W, H);
      const z = (x - cx) / R;
      const perp = (cy - y) / R;
      const r = Math.hypot(z, perp);
      if (r < 0.02) return;
      setProbe({
        r: Math.min(3, r),
        degrees: Math.round((Math.acos(Math.max(-1, Math.min(1, z / r))) * 180) / Math.PI),
        side: perp >= 0 ? 1 : -1,
      });
    },
    [cx, cy, R],
  );

  const left = 84;
  const top = 44;
  const width = 560;
  const height = 200;
  const sx = (value: number) => svgNumber(left + (value / Math.PI) * width);
  const sy = (value: number) => svgNumber(top + ((1.05 - value) / 2.1) * height);
  const samples = useMemo(
    () => Array.from({ length: 181 }, (_, index) => (index / 180) * Math.PI),
    [],
  );

  return (
    <LabShell
      title="Разходка около сферата"
      description="Водете пробата с мишката или с плъзгачите. Силовите линии влизат перпендикулярно в проводника, еквипотенциалите ги пресичат под прав ъгъл, а слоят със заряда показва откъде идва всичко това."
      controls={
        <>
          <RangeControl
            label="Разстояние от центъра"
            value={probe.r}
            min={0}
            max={3}
            step={0.02}
            valueLabel={<RichText text={`$r/R=${decimal(probe.r, 2)}$`} />}
            onChange={(value) => setProbe((state) => ({ ...state, r: value }))}
          />
          <RangeControl
            label="Ъгъл от оста на полето"
            value={probe.degrees}
            min={0}
            max={180}
            step={1}
            valueLabel={<RichText text={`$\\theta=${probe.degrees}^\\circ$`} />}
            onChange={(value) => setProbe((state) => ({ ...state, degrees: value }))}
          />
        </>
      }
      readouts={[
        { label: "Разстояние", tex: `r/R=${decimal(probe.r, 2)}` },
        { label: "Ъгъл", tex: `\\theta=${probe.degrees}^\\circ` },
        {
          label: "Потенциал",
          tex: `V/E_0R=${decimal(potential, 3)}`,
          tone: "text-minus",
        },
        {
          label: "Поле",
          tex: `|E|/E_0=${inside ? "0{,}000" : decimal(field.magnitude, 3)}`,
          tone: "text-ok",
        },
      ]}
      readoutColumns="sm:grid-cols-4"
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <LayerToggle
            label="Силови линии"
            color={C.warn}
            pressed={showField}
            onToggle={() => setShowField((value) => !value)}
          />
          <LayerToggle
            label="Еквипотенциали"
            color={C.wire}
            dashed
            pressed={showEquipotential}
            onToggle={() => setShowEquipotential((value) => !value)}
          />
          <LayerToggle
            label="Повърхностен заряд"
            color={C.plus}
            gradient
            pressed={showCharge}
            onToggle={() => setShowCharge((value) => !value)}
          />
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className={`${STAGE_CLASS} cursor-crosshair touch-none`}
          aria-label="Силови линии, еквипотенциали и индуциран заряд около проводяща сфера във външно поле"
          onPointerMove={handlePointer}
          onPointerDown={handlePointer}
        >
          <rect width={W} height={H} fill={STAGE_BG} />

          <SphereGeometry
            cx={cx}
            cy={cy}
            radius={R}
            bounds={bounds}
            offsets={offsets}
            levels={levels}
            gradientId={gradientId}
            showField={showField}
            showEquipotential={showEquipotential}
            showCharge={showCharge}
            fieldColor={C.warn}
            equipotentialColor={C.wire}
            sphereStroke={C.mut}
            equipotentialOpacity={0.6}
          />

          <SvgTex x={20} y={24} tex={String.raw`\vec E_0`} color={C.warn} width={40} />
          <SvgTex x={700} y={24} tex="z" color={C.mut} width={13} anchor="end" />

          {inside ? null : (
            <>
              <line x1={probeX} y1={probeY} x2={tipX} y2={tipY} stroke={C.ok} strokeWidth={2.5} />
              <polygon
                points="0,0 -9,4 -9,-4"
                fill={C.ok}
                transform={`translate(${tipX},${tipY}) rotate(${svgNumber(
                  (Math.atan2(tipY - probeY, tipX - probeX) * 180) / Math.PI,
                )})`}
              />
            </>
          )}
          <circle cx={probeX} cy={probeY} r={5.5} fill="none" stroke={C.ok} strokeWidth={2.5} />
          <circle cx={probeX} cy={probeY} r={1.8} fill={C.ok} />

          <text x={cx} y={H - 12} textAnchor="middle" {...CAP_LABEL}>
            {inside ? "ВЪТРЕ ПОЛЕТО Е НУЛА" : "ПРОВОДЯЩА СФЕРА В ЕДНОРОДНО ПОЛЕ"}
          </text>
        </svg>

        <svg
          viewBox="0 0 720 320"
          className={STAGE_CLASS}
          aria-label="Повърхностна плътност и заряд на тънък пръстен в зависимост от ъгъла"
        >
          <rect width={720} height={320} fill={STAGE_BG} />
          <SvgTex x={84} y={22} tex={String.raw`\sigma(\theta)/3\varepsilon_0E_0=\cos\theta`} color={C.plus} width={190} />
          <SvgTex x={310} y={22} tex={String.raw`dq/d\theta\propto\sin2\theta`} color={C.warn} width={160} />
          {graphGrid({ left, top, width, height })}
          <line x1={left} y1={sy(0)} x2={left + width} y2={sy(0)} stroke={C.wire} strokeWidth={2} />
          <polyline
            points={samples.map((value) => `${sx(value)},${sy(Math.sin(2 * value))}`).join(" ")}
            fill="none"
            stroke={C.warn}
            strokeWidth={2}
            strokeDasharray="7 5"
          />
          <polyline
            points={samples.map((value) => `${sx(value)},${sy(Math.cos(value))}`).join(" ")}
            fill="none"
            stroke={C.plus}
            strokeWidth={3}
          />
          <line x1={sx(theta)} y1={top} x2={sx(theta)} y2={top + height} stroke={C.ok} strokeWidth={2} strokeDasharray="6 5" />
          <circle cx={sx(theta)} cy={sy(Math.cos(theta))} r={5.5} fill={C.plus} />
          <SvgTex x={left - 12} y={sy(1)} tex="1" color={C.mut} width={13} anchor="end" />
          <SvgTex x={left - 12} y={sy(-1)} tex="-1" color={C.mut} width={20} anchor="end" />
          <SvgTex
            x={sx(Math.PI / 2)}
            y={top + height + 26}
            tex={String.raw`\pi/2`}
            color={C.mut}
            width={34}
            anchor="middle"
          />
          <SvgTex x={sx(Math.PI)} y={top + height + 26} tex={String.raw`\pi`} color={C.mut} width={14} anchor="middle" />
          <SvgTex x={left + width} y={top + height + 58} tex={String.raw`\theta`} color={C.wire} width={20} anchor="end" />
        </svg>
      </div>
    </LabShell>
  );
}

/* ────────────────────────────  Теория T7  ──────────────────────────── */

/** Защо в празна област потенциалът е седло, а не яма. */
export function EarnshawSaddleFigure() {
  const leftCx = 200;
  const leftCy = 140;
  const rightCx = 545;
  const rightCy = 140;

  /** Сечение на потенциала по една ос: нагоре при положителна втора производна. */
  const section = (sign: number) =>
    Array.from({ length: 41 }, (_, index) => {
      const u = -100 + (index / 40) * 200;
      return `${svgNumber(leftCx + u)},${svgNumber(leftCy - sign * (u / 100) ** 2 * 70)}`;
    }).join(" ");

  return (
    <svg
      viewBox="0 0 720 268"
      className={STAGE_CLASS}
      aria-label="Двете втори производни през една точка и седловидната форма на потенциала в празна област"
    >
      <rect width={720} height={268} fill={STAGE_BG} />

      <text x={leftCx} y={22} textAnchor="middle" {...CAP_LABEL}>
        ДВЕ ПОСОКИ ПРЕЗ ТОЧКАТА
      </text>
      <line x1={leftCx - 110} y1={leftCy} x2={leftCx + 110} y2={leftCy} stroke={C.faint} strokeWidth={1.5} />
      <polyline points={section(1)} fill="none" stroke={C.plus} strokeWidth={2.5} />
      <polyline points={section(-1)} fill="none" stroke={C.minus} strokeWidth={2.5} />
      <circle cx={leftCx} cy={leftCy} r={5.5} fill={C.ok} />
      <SvgTex
        x={leftCx}
        y={54}
        tex={String.raw`\partial^2V/\partial x^2>0`}
        color={C.plus}
        width={150}
        anchor="middle"
      />
      <SvgTex
        x={leftCx}
        y={236}
        tex={String.raw`\partial^2V/\partial y^2<0`}
        color={C.minus}
        width={150}
        anchor="middle"
      />

      <text x={rightCx} y={22} textAnchor="middle" {...CAP_LABEL}>
        СЕДЛО, НЕ ЯМА
      </text>
      {[0.34, 0.62, 0.92].map((k) => {
        const points = Array.from({ length: 41 }, (_, index) => {
          const u = -1 + (index / 40) * 2;
          return { u, v: k / Math.cosh(u * 1.7) };
        });
        return (
          <g key={k}>
            <polyline
              points={points.map((p) => `${svgNumber(rightCx + p.u * 96)},${svgNumber(rightCy - p.v * 86)}`).join(" ")}
              fill="none"
              stroke={C.plus}
              strokeWidth={2}
              opacity={0.7}
            />
            <polyline
              points={points.map((p) => `${svgNumber(rightCx + p.u * 96)},${svgNumber(rightCy + p.v * 86)}`).join(" ")}
              fill="none"
              stroke={C.minus}
              strokeWidth={2}
              opacity={0.7}
            />
          </g>
        );
      })}
      <Arrow x1={rightCx} y1={rightCy} x2={rightCx} y2={rightCy - 96} color={C.plus} width={2.5} />
      <Arrow x1={rightCx} y1={rightCy} x2={rightCx} y2={rightCy + 96} color={C.minus} width={2.5} />
      <circle cx={rightCx} cy={rightCy} r={5.5} fill={C.ok} />
      <SvgTex x={rightCx + 16} y={rightCy - 82} tex={String.raw`V\uparrow`} color={C.plus} width={34} />
      <SvgTex x={rightCx + 16} y={rightCy + 82} tex={String.raw`V\downarrow`} color={C.minus} width={34} />
      <SvgTex x={rightCx} y={240} tex={String.raw`\nabla^2V=0`} color={C.ok} width={90} anchor="middle" />
    </svg>
  );
}
