"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import { Arrow, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";
import {
  Axes3D,
  Parallelogram,
  TipLabel,
  cross,
  makeProjector,
  norm,
  type V3,
} from "./vector3d";

/**
 * Тренажор за правилото на дясната ръка върху базисните вектори.
 *
 * Редът е задължителен: ученикът първо избира двойката, после ПРЕДСКАЗВА
 * посоката и чак тогава сцената дорисува резултата. Така антикомутативността
 * се усеща като избор на ориентация, а не като знак във формула.
 */

const BASIS: { key: "i" | "j" | "k"; v: V3; tex: string }[] = [
  { key: "i", v: [1, 0, 0], tex: String.raw`\hat i` },
  { key: "j", v: [0, 1, 0], tex: String.raw`\hat j` },
  { key: "k", v: [0, 0, 1], tex: String.raw`\hat k` },
];

const ANSWERS = [
  { key: "+i", tex: String.raw`+\hat i`, v: [1, 0, 0] as V3 },
  { key: "-i", tex: String.raw`-\hat i`, v: [-1, 0, 0] as V3 },
  { key: "+j", tex: String.raw`+\hat j`, v: [0, 1, 0] as V3 },
  { key: "-j", tex: String.raw`-\hat j`, v: [0, -1, 0] as V3 },
  { key: "+k", tex: String.raw`+\hat k`, v: [0, 0, 1] as V3 },
  { key: "-k", tex: String.raw`-\hat k`, v: [0, 0, -1] as V3 },
  { key: "0", tex: String.raw`\vec 0`, v: [0, 0, 0] as V3 },
];

/** Ключът на верния отговор, сметнат от самото векторно произведение. */
function correctKey(a: V3, b: V3): string {
  const n = cross(a, b);
  if (norm(n) < 1e-9) return "0";
  const axis = n[0] !== 0 ? "i" : n[1] !== 0 ? "j" : "k";
  const value = n[0] !== 0 ? n[0] : n[1] !== 0 ? n[1] : n[2];
  return (value > 0 ? "+" : "-") + axis;
}

const CYCLE = ["i", "j", "k"];

function explain(aKey: string, bKey: string): string {
  if (aKey === bKey) {
    return String.raw`Двата множителя съвпадат, значи $\theta=0$ и $\sin\theta=0$: успоредникът е смачкан и произведението е нулевият вектор.`;
  }
  const forward = CYCLE[(CYCLE.indexOf(aKey) + 1) % 3] === bKey;
  const third = CYCLE.find((c) => c !== aKey && c !== bKey);
  return forward
    ? String.raw`Двойката $\hat ${aKey}\to\hat ${bKey}$ върви напред по цикъла $\hat i\to\hat j\to\hat k\to\hat i$, затова знакът е плюс: резултатът е $+\hat ${third}$.`
    : String.raw`Двойката $\hat ${aKey}\to\hat ${bKey}$ върви назад по цикъла $\hat i\to\hat j\to\hat k\to\hat i$. Размяната на реда обръща знака, затова резултатът е $-\hat ${third}$.`;
}

export default function RightHandCross() {
  const [aKey, setAKey] = useState<"i" | "j" | "k">("i");
  const [bKey, setBKey] = useState<"i" | "j" | "k">("j");
  const [picked, setPicked] = useState<string | null>(null);

  const a = BASIS.find((x) => x.key === aKey)!;
  const b = BASIS.find((x) => x.key === bKey)!;
  const answer = correctKey(a.v, b.v);
  const locked = picked !== null;
  const revealed = ANSWERS.find((x) => x.key === answer)!;
  const degenerate = answer === "0";

  const choose = (which: "a" | "b", key: "i" | "j" | "k") => {
    setPicked(null);
    if (which === "a") setAKey(key);
    else setBKey(key);
  };

  const swap = () => {
    setPicked(null);
    setAKey(bKey);
    setBKey(aKey);
  };

  const P = makeProjector([[1.15, 0, 0]], 250, 168, 96);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-3">
        {(["a", "b"] as const).map((which) => (
          <div key={which}>
            <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
              {which === "a" ? "Първи множител" : "Втори множител"}
            </p>
            <div className="flex gap-2">
              {BASIS.map((item) => {
                const active = (which === "a" ? aKey : bKey) === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => choose(which, item.key)}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-lg border-[1.5px] border-ink px-4 py-2 text-[15px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus ${
                      active ? "bg-ink text-white" : "bg-surface text-ink hover:bg-hl"
                    }`}
                  >
                    <RichText text={`$\\vec ${item.key}$`} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <button type="button" onClick={swap} className={BTN_SEC}>
          Разменѝ реда ↔
        </button>
      </div>

      <svg
        viewBox="0 0 620 330"
        className={STAGE_CLASS}
        role="img"
        aria-label={`Векторно произведение на базисните вектори ${aKey} и ${bKey}${
          locked ? `, резултат ${answer}` : ", резултатът още не е показан"
        }`}
      >
        <rect width={620} height={330} fill={STAGE_BG} />
        <Axes3D P={P} />

        {locked && !degenerate && <Parallelogram P={P} a={a.v} b={b.v} />}

        {(() => {
          const o = P([0, 0, 0]);
          const pa = P(a.v);
          const pb = P(b.v);
          return (
            <>
              <Arrow x1={o[0]} y1={o[1]} x2={pa[0]} y2={pa[1]} color={C.plus} width={3.4} />
              <Arrow x1={o[0]} y1={o[1]} x2={pb[0]} y2={pb[1]} color={C.minus} width={3.4} />
            </>
          );
        })()}
        <TipLabel P={P} v={a.v} tex={a.tex} color={C.plus} />
        <TipLabel P={P} v={b.v} tex={b.tex} color={C.minus} />

        {locked && !degenerate && (
          <g className="animate-rise">
            {(() => {
              const o = P([0, 0, 0]);
              const pn = P(revealed.v);
              return <Arrow x1={o[0]} y1={o[1]} x2={pn[0]} y2={pn[1]} color={C.ok} width={3.6} />;
            })()}
            <TipLabel P={P} v={revealed.v} tex={revealed.tex} color={C.ok} width={54} />
          </g>
        )}
        {locked && degenerate && (
          <text x={310} y={300} fill={C.ok} fontSize={14} fontWeight={700} textAnchor="middle" className="animate-rise">
            НУЛЕВ ВЕКТОР
          </text>
        )}

        <text x={24} y={30} fill={C.mut} fontSize={11.5} fontWeight={800} letterSpacing="0.12em">
          {locked ? "РЕЗУЛТАТ" : "ПРЕДСКАЖЕТЕ ПОСОКАТА"}
        </text>
      </svg>

      <p className="mt-4 mb-2 font-semibold text-ink">
        <RichText text={`Накъде сочи $\\vec ${aKey}\\times\\vec ${bKey}$?`} />
      </p>
      <div className="flex flex-wrap gap-2">
        {ANSWERS.map((opt) => {
          let cls =
            "rounded-[10px] border-[1.5px] px-4 py-2 text-[15px] transition-all min-w-[62px] text-center ";
          if (!locked) {
            cls +=
              "cursor-pointer border-rule bg-surface text-ink shadow-hard-sm hover:border-ink active:translate-x-px active:translate-y-px active:shadow-none";
          } else if (opt.key === answer) {
            cls += "border-ok bg-ok/10 font-semibold text-ink";
          } else if (picked === opt.key) {
            cls += "border-plus bg-plus/10 text-ink";
          } else {
            cls += "border-rule bg-surface text-muted";
          }
          return (
            <button key={opt.key} type="button" disabled={locked} onClick={() => setPicked(opt.key)} className={cls}>
              <RichText text={`$${opt.tex}$`} />
            </button>
          );
        })}
      </div>

      {locked && (
        <div className="mt-3 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-2.5 text-[15px] leading-relaxed animate-rise">
          <strong className="text-ink">Защо: </strong>
          <RichText text={explain(aKey, bKey)} />
        </div>
      )}

      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Проверете и с ръка: пръстите на дясната ръка се свиват от първия към втория вектор, палецът
        сочи резултата. Натиснете „Разменѝ реда“ върху същата двойка и вижте, че палецът се обръща.
      </p>
    </div>
  );
}
