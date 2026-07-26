"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { texNumber } from "./mathTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Геометрично извеждане на $ad-bc$ с плъзгач върху самото срязване.
 *
 * Ученикът вижда как успоредникът се изправя непрекъснато, а числото за площта
 * не помръдва. Това е механизмът на извеждането: срязването е допустимо точно
 * защото пази площта, а изправеният успоредник вече се мери като основа по
 * височина. Конкретните числа са $u=(3,1)$ и $v=(1,2)$.
 */

const A = 3;
const C1 = 1; // втора координата на u
const B = 1;
const D = 2;

const OX = 120;
const OY = 286;
const S = 58;

const px = (x: number, y: number): [number, number] => [OX + x * S, OY - y * S];

export default function DeterminantDerivation() {
  const [t, setT] = useState(0);

  /* Срязването $(x,y)\mapsto(x,\;y-t\cdot\frac{c}{a}x)$ изправя първата колона при t = 1. */
  const k = (t * C1) / A;
  const u: [number, number] = [A, C1 - k * A];
  const v: [number, number] = [B, D - k * B];

  const area = u[0] * v[1] - v[0] * u[1]; // остава 5 за всяко t
  const straight = t > 0.985;

  const o = px(0, 0);
  const pu = px(...u);
  const pv = px(...v);
  const puv = px(u[0] + v[0], u[1] + v[1]);

  return (
    <div className={PANEL_CLASS}>
      <svg
        viewBox="0 0 640 340"
        className={STAGE_CLASS}
        role="img"
        aria-label={`Успоредник върху u и v при срязване ${Math.round(t * 100)} процента; площта остава 5`}
      >
        <rect width={640} height={340} fill={STAGE_BG} />

        <g stroke="rgba(89,173,255,0.14)" strokeWidth={1}>
          {Array.from({ length: 10 }, (_, i) => i - 1).map((n) => (
            <line key={`v${n}`} x1={px(n, -1)[0]} y1={px(n, -1)[1]} x2={px(n, 4)[0]} y2={px(n, 4)[1]} />
          ))}
          {Array.from({ length: 6 }, (_, i) => i - 1).map((n) => (
            <line key={`h${n}`} x1={px(-1, n)[0]} y1={px(-1, n)[1]} x2={px(8, n)[0]} y2={px(8, n)[1]} />
          ))}
        </g>
        <g stroke="rgba(89,173,255,0.5)" strokeWidth={1.5}>
          <line x1={px(-1, 0)[0]} y1={px(-1, 0)[1]} x2={px(8, 0)[0]} y2={px(8, 0)[1]} />
          <line x1={px(0, -1)[0]} y1={px(0, -1)[1]} x2={px(0, 4)[0]} y2={px(0, 4)[1]} />
        </g>

        <polygon
          points={[o, pu, puv, pv].map((p) => p.join(",")).join(" ")}
          fill={C.warn}
          fillOpacity={0.18}
          stroke={C.warn}
          strokeWidth={2.2}
        />

        {/* Височината и основата стават измерими чак когато u легне хоризонтално */}
        {straight && (
          <g className="animate-rise">
            <line x1={pv[0]} y1={pv[1]} x2={pv[0]} y2={o[1]} stroke={C.faint} strokeWidth={1.6} strokeDasharray="5 4" />
            <SvgTex x={pv[0] + 10} y={(pv[1] + o[1]) / 2} tex="h" color={C.mut} fontSize={14} width={26} />
            <line x1={o[0]} y1={o[1] + 22} x2={pu[0]} y2={o[1] + 22} stroke={C.faint} strokeWidth={1.6} />
            <text x={(o[0] + pu[0]) / 2} y={o[1] + 40} fill={C.mut} fontSize={12} textAnchor="middle">
              ОСНОВА
            </text>
          </g>
        )}

        <Arrow x1={o[0]} y1={o[1]} x2={pu[0]} y2={pu[1]} color={C.plus} width={3.2} texLabel={String.raw`\vec u`} texLabelDy={-6} texLabelWidth={40} />
        <Arrow x1={o[0]} y1={o[1]} x2={pv[0]} y2={pv[1]} color={C.ok} width={3.2} texLabel={String.raw`\vec v`} texLabelDx={-6} texLabelWidth={40} />

        <text x={26} y={34} fill={C.mut} fontSize={11.5} fontWeight={800} letterSpacing="0.12em">
          {straight ? "ИЗПРАВЕН: ОСНОВА ПО ВИСОЧИНА" : "СРЯЗВАНЕТО ПАЗИ ПЛОЩТА"}
        </text>
      </svg>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          {
            label: "Вектор $\\vec u$",
            value: String.raw`$\left(${texNumber(u[0])},${texNumber(u[1])}\right)$`,
            tone: "minus",
          },
          {
            label: "Вектор $\\vec v$",
            value: String.raw`$\left(${texNumber(v[0])},${texNumber(v[1])}\right)$`,
            tone: "minus",
          },
          { label: "Срязване", value: `$${Math.round(t * 100)}\\,\\%$`, tone: "minus" },
          { label: "Знакова площ", value: `$A=${texNumber(area)}$`, tone: "ok" },
        ].map((r) => (
          <div key={r.label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
              <RichText text={r.label} />
            </dt>
            <dd className={`mt-0.5 text-[15px] font-bold tabular-nums ${r.tone === "ok" ? "text-ok" : "text-minus"}`}>
              <RichText text={r.value} />
            </dd>
          </div>
        ))}
      </dl>

      <label className="mt-4 block text-[13px] font-semibold text-ink">
        Колко от срязването е приложено
        <input
          className="mt-2 w-full accent-(--color-minus)"
          type="range"
          min="0"
          max="1"
          step="0.02"
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          aria-label="Дял от срязването, което изправя първата колона"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setT(1)}>
          Изправи докрай
        </button>
        <button type="button" className={BTN_SEC} onClick={() => setT(0)}>
          Върни в начало
        </button>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
        Числото за площта не помръдва, докато фигурата се изправя: точно това прави срязването
        допустим ход в извеждането. При <RichText text="$t=1$" /> първата колона ляга по оста, и
        площта вече се чете като основа по височина:{" "}
        <RichText text="$3\cdot\frac53=5$" />, което съвпада с{" "}
        <RichText text="$ad-bc=3\cdot2-1\cdot1=5$" />.
      </p>
    </div>
  );
}
