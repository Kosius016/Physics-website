"use client";

import { useId, useState, type ReactNode } from "react";
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

/**
 * Схема към условието на Задача 4: постановката без отговора.
 *
 * Индуцираният заряд нарочно липсва, защото точно той е търсеното. Тук стоят
 * само външното поле, сферата и означенията, с които е написан потенциалът.
 */
export function SphereInFieldFigure() {
  const cx = 360;
  const cy = 140;
  const R = 84;
  const theta = (42 * Math.PI) / 180;

  return (
    <svg
      viewBox="0 0 720 246"
      className={STAGE_CLASS}
      aria-label="Незаредена проводяща сфера, поставена в първоначално еднородно поле"
    >
      <rect width={720} height={246} fill={STAGE_BG} />
      <text x={cx} y={22} textAnchor="middle" {...CAP_LABEL}>
        СФЕРА В ЕДНОРОДНО ПОЛЕ
      </text>

      {[64, 102, 140, 178, 216].map((y) => (
        <g key={y}>
          <Arrow x1={30} y1={y} x2={150} y2={y} color={C.warn} width={2} />
          <Arrow x1={570} y1={y} x2={690} y2={y} color={C.warn} width={2} />
        </g>
      ))}
      <SvgTex x={30} y={38} tex={String.raw`\vec E_0`} color={C.warn} width={40} />

      <circle cx={cx} cy={cy} r={R} fill={C.wire} opacity={0.1} stroke={C.wire} strokeWidth={2} />
      <line x1={cx} y1={cy} x2={536} y2={cy} stroke={C.faint} strokeWidth={1.5} strokeDasharray="6 6" />
      <SvgTex x={548} y={cy} tex="z" color={C.mut} width={13} />

      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + R * Math.cos(theta))}
        y2={svgNumber(cy - R * Math.sin(theta))}
        stroke={C.ok}
        strokeWidth={2}
      />
      <circle
        cx={svgNumber(cx + R * Math.cos(theta))}
        cy={svgNumber(cy - R * Math.sin(theta))}
        r={5}
        fill={C.ok}
      />
      <AngleArc cx={cx} cy={cy} a1={0} a2={-theta} r={44} color={C.ok} texLabel={String.raw`\theta`} />

      <line
        x1={cx}
        y1={cy}
        x2={svgNumber(cx + R * Math.cos(3.578))}
        y2={svgNumber(cy - R * Math.sin(3.578))}
        stroke={C.wire}
        strokeWidth={2}
      />
      <TexChip x={318} y={166} tex="R" color={C.wire} width={13} />
      <circle cx={cx} cy={cy} r={3.5} fill={C.wire} />
    </svg>
  );
}

export function SphereInFieldLab() {
  const [degrees, setDegrees] = useState(35);
  const theta = (degrees * Math.PI) / 180;
  const cx = 360;
  const cy = 140;
  const R = 84;

  const ticks = Array.from({ length: 25 }, (_, index) => (index / 24) * 2 * Math.PI);
  const cosine = Math.cos(theta);
  const markerLength = 52 * Math.abs(cosine);
  const outward = cosine >= 0 ? 1 : -1;
  const mx = svgNumber(cx + R * cosine);
  const my = svgNumber(cy - R * Math.sin(theta));

  const left = 84;
  const top = 44;
  const width = 560;
  const height = 200;
  const sx = (value: number) => svgNumber(left + (value / Math.PI) * width);
  const sy = (value: number) => svgNumber(top + ((1.05 - value) / 2.1) * height);
  const samples = Array.from({ length: 181 }, (_, index) => (index / 180) * Math.PI);

  return (
    <LabShell
      title="Къде се събира индуцираният заряд"
      description="Външното поле разделя зарядите на проводника. Плътността следва косинус, затова полюсите носят най-плътен заряд и най-силно поле, а по екватора повърхността остава незаредена."
      controls={
        <RangeControl
          label="Ъгъл от оста на външното поле"
          value={degrees}
          min={0}
          max={180}
          step={1}
          valueLabel={<RichText text={`$\\theta=${degrees}^\\circ$`} />}
          onChange={setDegrees}
        />
      }
      readouts={[
        { label: "Ъгъл", tex: `\\theta=${degrees}^\\circ` },
        { label: "Плътност", tex: `\\sigma/\\varepsilon_0E_0=${decimal(3 * cosine, 2)}`, tone: "text-plus" },
        { label: "Поле", tex: `|E|/E_0=${decimal(3 * Math.abs(cosine), 2)}`, tone: "text-ok" },
        { label: "Пълен индуциран заряд", tex: `Q_{\\text{инд}}=0`, tone: "text-minus" },
      ]}
      readoutColumns="sm:grid-cols-4"
    >
      <div className="space-y-3">
        <svg
          viewBox="0 0 720 246"
          className={STAGE_CLASS}
          aria-label="Незаредена проводяща сфера във външно еднородно поле с индуциран повърхностен заряд"
        >
          <rect width={720} height={246} fill={STAGE_BG} />
          <text x={cx} y={22} textAnchor="middle" {...CAP_LABEL}>
            ИНДУЦИРАН ПОВЪРХНОСТЕН ЗАРЯД
          </text>

          {[64, 102, 140, 178, 216].map((y) => (
            <g key={y}>
              <Arrow x1={30} y1={y} x2={150} y2={y} color={C.warn} width={2} />
              <Arrow x1={570} y1={y} x2={690} y2={y} color={C.warn} width={2} />
            </g>
          ))}
          <SvgTex x={30} y={38} tex={String.raw`\vec E_0`} color={C.warn} width={40} />

          <circle cx={cx} cy={cy} r={R} fill={C.wire} opacity={0.1} stroke={C.wire} strokeWidth={2} />
          {ticks.map((angle) => {
            const value = Math.cos(angle);
            const length = 46 * Math.abs(value);
            if (length < 1.5) return null;
            const sign = value > 0 ? 1 : -1;
            return (
              <line
                key={angle}
                x1={svgNumber(cx + R * Math.cos(angle))}
                y1={svgNumber(cy - R * Math.sin(angle))}
                x2={svgNumber(cx + (R + sign * length) * Math.cos(angle))}
                y2={svgNumber(cy - (R + sign * length) * Math.sin(angle))}
                stroke={value > 0 ? C.plus : C.minus}
                strokeWidth={3}
                opacity={0.5}
                strokeLinecap="round"
              />
            );
          })}

          <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke={C.faint} strokeWidth={1.5} />
          <line x1={cx} y1={cy} x2={mx} y2={my} stroke={C.ok} strokeWidth={2} strokeDasharray="5 4" />
          {markerLength > 2.5 ? (
            <Arrow
              x1={mx}
              y1={my}
              x2={svgNumber(cx + (R + outward * markerLength) * cosine)}
              y2={svgNumber(cy - (R + outward * markerLength) * Math.sin(theta))}
              color={C.ok}
              width={3.5}
            />
          ) : (
            <circle cx={mx} cy={my} r={5} fill={C.ok} />
          )}
          <AngleArc cx={cx} cy={cy} a1={0} a2={-theta} r={42} color={C.ok} texLabel={String.raw`\theta`} />
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
