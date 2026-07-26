"use client";

import { useMemo, useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { texNumber } from "./mathTex";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

type V3 = [number, number, number];

const presets: { label: string; a: V3; b: V3 }[] = [
  { label: "Общ пример", a: [2, -1, 3], b: [1, 4, -2] },
  { label: "Базис $\\hat{\\imath}\\times\\hat{\\jmath}$", a: [1, 0, 0], b: [0, 1, 0] },
  { label: "Успоредни", a: [1, 2, 3], b: [2, 4, 6] },
  { label: "Нормала на равнина", a: [1, 2, 0], b: [-1, 1, 3] },
];

const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (v: V3) => Math.hypot(...v);

function scaled(v: V3, maxLength = 3.1): V3 {
  const n = norm(v);
  if (n === 0) return [0, 0, 0];
  const k = Math.min(1, maxLength / n);
  return [v[0] * k, v[1] * k, v[2] * k];
}

function project(v: V3): [number, number] {
  const [x, y, z] = v;
  return [300 + 58 * (x - 0.58 * y), 208 + 58 * (0.34 * x + 0.34 * y - z)];
}

export default function CrossProductComponents() {
  const [a, setA] = useState<V3>(presets[0].a);
  const [b, setB] = useState<V3>(presets[0].b);
  const n = useMemo(() => cross(a, b), [a, b]);
  const pa = project(scaled(a));
  const pb = project(scaled(b));
  const pn = project(scaled(n));
  const origin = project([0, 0, 0]);

  const update = (which: "a" | "b", index: number, value: number) => {
    const setter = which === "a" ? setA : setB;
    setter((old) => old.map((x, i) => (i === index ? value : x)) as V3);
  };

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button key={preset.label} className={BTN_SEC} onClick={() => { setA(preset.a); setB(preset.b); }}>
            <RichText text={preset.label} />
          </button>
        ))}
      </div>

      <svg viewBox="0 0 600 360" className={STAGE_CLASS} role="img" aria-label="Три вектора в пространството: a, b и тяхното векторно произведение">
        <rect width="600" height="360" fill={STAGE_BG} />
        <defs>
          <pattern id="components-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(242,239,245,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="600" height="360" fill="url(#components-grid)" />

        {([
          [[-3.4, 0, 0], [3.4, 0, 0], "x"],
          [[0, -3.4, 0], [0, 3.4, 0], "y"],
          [[0, 0, -2.3], [0, 0, 2.7], "z"],
        ] as [V3, V3, string][]).map(([from, to, label]) => {
          const p1 = project(from);
          const p2 = project(to);
          return (
            <g key={label}>
              <line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke={C.faint} strokeWidth="1.2" />
              <SvgTex x={p2[0] + 6} y={p2[1] - 4} tex={label} color={C.mut} fontSize={12} width={24} />
            </g>
          );
        })}

        <Arrow x1={origin[0]} y1={origin[1]} x2={pa[0]} y2={pa[1]} color={C.plus} width={3.2} />
        <Arrow x1={origin[0]} y1={origin[1]} x2={pb[0]} y2={pb[1]} color={C.minus} width={3.2} />
        {norm(n) > 0.0001 && <Arrow x1={origin[0]} y1={origin[1]} x2={pn[0]} y2={pn[1]} color={C.ok} width={3.4} />}
        <SvgTex x={pa[0] + 12} y={pa[1] - 8} tex={String.raw`\vec a`} color={C.plus} fontSize={15} width={50} />
        <SvgTex x={pb[0] + 12} y={pb[1] - 8} tex={String.raw`\vec b`} color={C.minus} fontSize={15} width={50} />
        {norm(n) > 0.0001 ? (
          <SvgTex x={pn[0] + 12} y={pn[1] - 8} tex={String.raw`\vec a\times\vec b`} color={C.ok} fontSize={14} width={126} />
        ) : (
          <SvgTex x={300} y={78} tex={String.raw`\vec a\times\vec b=\vec 0`} color={C.ok} fontSize={16} width={170} anchor="middle" />
        )}
      </svg>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Посоките в сцената са точни; много дългите стрелки са скалирани, за да се съберат в кадъра.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {(["a", "b"] as const).map((which) => {
          const vector = which === "a" ? a : b;
          return (
            <fieldset key={which} className="rounded-[10px] border-[1.5px] border-rule bg-hl p-3">
              <legend className="px-1 font-serif text-[18px] font-bold text-ink">
                <RichText text={`Вектор $\\vec ${which}$`} />
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {vector.map((value, i) => (
                  <label key={i} className="text-[11px] font-bold uppercase tracking-wide text-muted">
                    <RichText text={`$${which}_${i + 1}$`} />
                    <input
                      type="number"
                      min="-9"
                      max="9"
                      step="1"
                      value={value}
                      onChange={(e) => update(which, i, Number(e.target.value))}
                      className="mt-1 w-full rounded-md border-[1.5px] border-ink bg-surface px-2 py-1.5 text-[15px] font-semibold text-ink outline-none focus:ring-2 focus:ring-minus/40"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>

      <div className="mt-4">
        <Formula
          latex={String.raw`\vec a\times\vec b=\bigl(${a[1]}\cdot${b[2]}-${a[2]}\cdot${b[1]},\;${a[2]}\cdot${b[0]}-${a[0]}\cdot${b[2]},\;${a[0]}\cdot${b[1]}-${a[1]}\cdot${b[0]}\bigr)=\boxed{\left(${n.join(String.raw`,\,`)}\right)}`}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          {
            label: String.raw`$\vec a\cdot(\vec a\times\vec b)$`,
            value: `$${texNumber(dot(a, n), 2, true)}$`,
          },
          {
            label: String.raw`$\vec b\cdot(\vec a\times\vec b)$`,
            value: `$${texNumber(dot(b, n), 2, true)}$`,
          },
          {
            label: String.raw`$|\vec a\times\vec b|$`,
            value: `$${texNumber(norm(n), 3)}$`,
          },
          { label: "Тип", value: norm(n) < 1e-9 ? "успоредни" : "нормала" },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">
              <RichText text={item.label} />
            </dt>
            <dd className="mt-0.5 text-[14.5px] font-bold tabular-nums text-ok">
              <RichText text={item.value} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
