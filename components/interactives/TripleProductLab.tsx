"use client";

import { useState } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { texNumber } from "./mathTex";
import { Arrow, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

type V3 = [number, number, number];
const add = (u: V3, v: V3): V3 => [u[0] + v[0], u[1] + v[1], u[2] + v[2]];

function project([x, y, z]: V3): [number, number] {
  return [105 + 61 * x + 27 * y, 285 - 22 * y - 52 * z];
}

const polygon = (points: V3[]) => points.map((p) => project(p).join(",")).join(" ");

export default function TripleProductLab() {
  const [slide, setSlide] = useState(0.8);
  const [height, setHeight] = useState(2.1);
  const a: V3 = [3, 0, 0];
  const b: V3 = [1, 2, 0];
  const c: V3 = [slide, 0.7, height];
  const O: V3 = [0, 0, 0];
  const ab = add(a, b);
  const oc = c;
  const ac = add(a, c);
  const bc = add(b, c);
  const abc = add(ab, c);
  const baseArea = 6;
  const volume = baseArea * Math.abs(height);
  const o2 = project(O);
  const c2 = project(c);

  return (
    <div className={PANEL_CLASS}>
      <svg viewBox="0 0 620 390" className={STAGE_CLASS} role="img" aria-label="Паралелепипед и смесено произведение">
        <rect width="620" height="390" fill={STAGE_BG} />
        <polygon points={polygon([O, a, ab, b])} fill={C.minus} fillOpacity={0.22} stroke={C.minus} strokeWidth="2" />
        <polygon points={polygon([c, ac, abc, bc])} fill={C.ok} fillOpacity={0.18} stroke={C.ok} strokeWidth="2" />
        <polygon points={polygon([O, a, ac, c])} fill={C.plus} fillOpacity={0.12} stroke="none" />
        <polygon points={polygon([a, ab, abc, ac])} fill={C.warn} fillOpacity={0.1} stroke="none" />

        {([[O, c], [a, ac], [b, bc], [ab, abc]] as [V3, V3][]).map(([p, q], i) => {
          const p2 = project(p);
          const q2 = project(q);
          return <line key={i} x1={p2[0]} y1={p2[1]} x2={q2[0]} y2={q2[1]} stroke={i === 0 ? C.plus : C.mut} strokeWidth={i === 0 ? 3 : 1.8} strokeDasharray={i > 0 ? "6 5" : undefined} />;
        })}

        <Arrow x1={o2[0]} y1={o2[1]} x2={c2[0]} y2={c2[1]} color={C.plus} width={3} />
        <SvgTex x={c2[0] + 10} y={c2[1] - 7} tex={String.raw`\vec c`} color={C.plus} fontSize={15} width={46} />
        <SvgTex x={220} y={306} tex={String.raw`\vec a`} color={C.minus} fontSize={14} width={44} />
        <SvgTex x={130} y={244} tex={String.raw`\vec b`} color={C.minus} fontSize={14} width={44} />

        <line x1={c2[0]} y1={c2[1]} x2={c2[0]} y2={project([slide, 0.7, 0])[1]} stroke={C.warn} strokeWidth="1.6" strokeDasharray="5 5" />
        <SvgTex x={c2[0] + 10} y={(c2[1] + project([slide, 0.7, 0])[1]) / 2} tex="h" color={C.warn} fontSize={14} width={28} />
        <SvgTex x={430} y={72} tex={String.raw`V=S_{\text{основа}}h`} color={C.ok} fontSize={16} width={160} />
      </svg>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        Накланянето на <RichText text={String.raw`$\vec c$`} /> мести горната основа настрани, но не
        променя нито височината, нито обема.
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          {
            label: String.raw`$S_{\text{основа}}=|\vec a\times\vec b|$`,
            value: `$${texNumber(baseArea, 1)}$`,
          },
          { label: "Височина $h$", value: `$${texNumber(height, 1)}$` },
          { label: "Странично отместване", value: `$${texNumber(slide, 1)}$` },
          { label: "Обем $V$", value: `$${texNumber(volume, 1)}$` },
        ].map((item) => (
          <div key={item.label} className="bg-surface px-3 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-wide text-muted">
              <RichText text={item.label} />
            </dt>
            <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-minus">
              <RichText text={item.value} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-ink">
          <RichText text={String.raw`Странично накланяне на $\vec c$`} />
          <input className="mt-2 w-full accent-(--color-minus)" type="range" min="-0.5" max="2" step="0.1" value={slide} onChange={(e) => setSlide(Number(e.target.value))} />
        </label>
        <label className="text-[13px] font-semibold text-ink">
          <RichText text="Перпендикулярна височина $h$" />
          <input className="mt-2 w-full accent-(--color-plus)" type="range" min="0" max="3" step="0.1" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </label>
      </div>

      <div className="mt-4">
        <Formula
          latex={String.raw`V=\left|\vec c\cdot(\vec a\times\vec b)\right|=\left|\det\begin{pmatrix}3&1&${texNumber(slide, 1)}\\0&2&0{,}7\\0&0&${texNumber(height, 1)}\end{pmatrix}\right|=6\cdot${texNumber(height, 1)}=\boxed{${texNumber(volume, 1)}}`}
        />
      </div>
    </div>
  );
}
