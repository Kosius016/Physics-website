"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

const MOLECULES = [
  { x: 128, y: 92, angle: -1.1 },
  { x: 225, y: 82, angle: 0.8 },
  { x: 322, y: 96, angle: 2.4 },
  { x: 419, y: 80, angle: -2.2 },
  { x: 516, y: 98, angle: 1.55 },
  { x: 146, y: 176, angle: 2.7 },
  { x: 243, y: 184, angle: -0.45 },
  { x: 340, y: 168, angle: 1.9 },
  { x: 437, y: 186, angle: -2.8 },
  { x: 498, y: 178, angle: 0.3 },
] as const;

function q(value: number) {
  return Math.round(value * 1000) / 1000;
}

function Sign({ x, y, positive }: { x: number; y: number; positive: boolean }) {
  return (
    <g stroke={positive ? C.plus : C.minus} strokeWidth={2.2} strokeLinecap="round">
      <line x1={x - 4.5} y1={y} x2={x + 4.5} y2={y} />
      {positive && <line x1={x} y1={y - 4.5} x2={x} y2={y + 4.5} />}
    </g>
  );
}

function Dipole({
  x,
  y,
  angle,
  separation,
}: {
  x: number;
  y: number;
  angle: number;
  separation: number;
}) {
  const dx = q(Math.cos(angle) * separation);
  const dy = q(Math.sin(angle) * separation);
  return (
    <g>
      <line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={C.faint} strokeWidth={1.5} />
      <Sign x={q(x - dx)} y={q(y - dy)} positive={false} />
      <Sign x={q(x + dx)} y={q(y + dy)} positive />
    </g>
  );
}

function decimal(value: number, digits = 2) {
  return value.toFixed(digits).replace(".", "{,}");
}

export default function DielectricPolarization() {
  const [kind, setKind] = useState<"polar" | "nonpolar">("polar");
  const [field, setField] = useState(0.55);
  const polar = kind === "polar";
  const alignment = polar ? field : 0;
  const inducedSeparation = 2 + 12 * field;
  const normalizedPolarization = field;

  return (
    <div className={PANEL_CLASS}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-minus">
            Микроскопична картина
          </p>
          <h3 className="mt-1 font-serif text-[22px] font-bold">Как се ражда поляризацията</h3>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={polar ? BTN_PRI : BTN_SEC}
            onClick={() => setKind("polar")}
            aria-pressed={polar}
          >
            Полярни
          </button>
          <button
            type="button"
            className={!polar ? BTN_PRI : BTN_SEC}
            onClick={() => setKind("nonpolar")}
            aria-pressed={!polar}
          >
            Неполярни
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-[10px]">
        <div className="min-w-[520px]">
          <svg
            viewBox="0 0 620 300"
            className={STAGE_CLASS}
            role="img"
            aria-label={`${polar ? "Полярни" : "Неполярни"} молекули във външно електрично поле със сила ${Math.round(field * 100)} процента`}
          >
            <rect width={620} height={300} fill={STAGE_BG} />
            <rect x={70} y={55} width={480} height={180} rx={8} fill={C.wire} fillOpacity={0.08} stroke={C.faint} />
            {[92, 150, 208].map((y) => (
              <Arrow
                key={y}
                x1={22}
                y1={y}
                x2={52}
                y2={y}
                color={C.minus}
                width={1.8 + field}
              />
            ))}
            <SvgTex x={20} y={48} tex={String.raw`\vec E_0`} color={C.minus} width={40} />
            {MOLECULES.map((molecule, index) => {
              const angle = polar ? molecule.angle * (1 - alignment) : 0;
              const separation = polar ? 13 : inducedSeparation;
              return (
                <Dipole
                  key={index}
                  x={molecule.x}
                  y={molecule.y}
                  angle={angle}
                  separation={separation}
                />
              );
            })}
            {field > 0.04 && (
              <g opacity={field}>
                {[85, 115, 145, 175, 205].map((y) => (
                  <Sign key={`left-${y}`} x={77} y={y} positive={false} />
                ))}
                {[85, 115, 145, 175, 205].map((y) => (
                  <Sign key={`right-${y}`} x={543} y={y} positive />
                ))}
                <SvgTex
                  x={310}
                  y={266}
                  tex={String.raw`\vec E_{\text{свързани}}\ \text{сочи срещу}\ \vec E_0`}
                  color={C.ok}
                  width={270}
                  anchor="middle"
                />
              </g>
            )}
          </svg>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 flex items-center justify-between gap-3 text-[13px] font-semibold">
          <span>Външно поле</span>
          <span className="tabular-nums text-minus">{Math.round(field * 100)} %</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={field}
          onChange={(event) => setField(Number(event.target.value))}
          className="w-full accent-minus"
        />
      </label>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-3">
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Механизъм</dt>
          <dd className="mt-0.5 text-[14px] font-bold">
            {polar ? "Ориентация" : "Индуциране"}
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">Поляризация</dt>
          <dd className="mt-0.5 text-[14px] font-bold text-ok">
            <RichText text={`$P/P_{\\max}=${decimal(normalizedPolarization)}$`} />
          </dd>
        </div>
        <div className="min-w-0 bg-surface px-3 py-2.5 sm:col-auto col-span-2">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
            Свързан обемен заряд
          </dt>
          <dd className="mt-0.5 text-[14px] font-bold text-ink">
            <RichText text={String.raw`$\rho_b=0$`} />
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        {polar
          ? "Полярните молекули имат постоянен диполен момент. Полето не ги създава, а подрежда предпочитаната им посока срещу топлинното движение."
          : "При неполярните молекули центровете на положителния и отрицателния заряд съвпадат без поле. Външното поле ги измества леко и създава индуциран дипол."}
      </p>
    </div>
  );
}
