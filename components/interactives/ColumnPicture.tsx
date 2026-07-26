"use client";

import { useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { texNumber } from "./mathTex";
import { Arrow, BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Колонната картина на $M\vec x=\vec b$.
 *
 * Системата се вижда като въпрос за смесване: колко части от първата колона и
 * колко от втората трябва да се съберат, за да се стигне точно до $\vec b$.
 * Така решаването на система остава в същия геометричен език, с който главата
 * въведе матрицата, вместо да се превърне в отделна алгебрична процедура.
 */

/* Матрицата и десницата от примера в §4 на урока. */
const COL1: [number, number] = [2, 1];
const COL2: [number, number] = [1, 1];
const TARGET: [number, number] = [5, 3];
const SOLUTION = { x: 2, y: 1 };

const OX = 110;
const OY = 290;
const S = 30;

const px = (x: number, y: number): [number, number] => [OX + x * S, OY - y * S];

export default function ColumnPicture() {
  const [x, setX] = useState(0.5);
  const [y, setY] = useState(2.5);

  const rx = x * COL1[0] + y * COL2[0];
  const ry = x * COL1[1] + y * COL2[1];
  const miss = Math.hypot(rx - TARGET[0], ry - TARGET[1]);
  const solved = miss < 0.13;

  const origin = px(0, 0);
  const afterFirst = px(x * COL1[0], x * COL1[1]);
  const tip = px(rx, ry);
  const target = px(TARGET[0], TARGET[1]);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Колонната картина</p>
        <p className="mt-1 text-[14.5px] text-ink/85">
          Колко части от всяка колона трябва да се съберат, за да се стигне до кръгчето?
        </p>
      </div>

      <svg
        viewBox="0 0 620 360"
        className={STAGE_CLASS}
        role="img"
        aria-label={`Комбинация ${x.toFixed(2)} пъти първата колона плюс ${y.toFixed(2)} пъти втората дава точка (${rx.toFixed(2)}, ${ry.toFixed(2)}); целта е (5, 3)`}
      >
        <rect width={620} height={360} fill={STAGE_BG} />

        {/* Решетка и оси */}
        <g stroke="rgba(89,173,255,0.16)" strokeWidth={1}>
          {Array.from({ length: 14 }, (_, i) => i - 2).map((k) => (
            <line key={`v${k}`} x1={px(k, -2)[0]} y1={px(k, -2)[1]} x2={px(k, 8)[0]} y2={px(k, 8)[1]} />
          ))}
          {Array.from({ length: 11 }, (_, i) => i - 2).map((k) => (
            <line key={`h${k}`} x1={px(-2, k)[0]} y1={px(-2, k)[1]} x2={px(11, k)[0]} y2={px(11, k)[1]} />
          ))}
        </g>
        <g stroke="rgba(89,173,255,0.55)" strokeWidth={1.6}>
          <line x1={px(-2, 0)[0]} y1={px(-2, 0)[1]} x2={px(11, 0)[0]} y2={px(11, 0)[1]} />
          <line x1={px(0, -2)[0]} y1={px(0, -2)[1]} x2={px(0, 8)[0]} y2={px(0, 8)[1]} />
        </g>

        {/* Самите колони като еталон, приглушени */}
        <g opacity={0.4}>
          <Arrow x1={origin[0]} y1={origin[1]} x2={px(...COL1)[0]} y2={px(...COL1)[1]} color={C.plus} width={2} dashed />
          <Arrow x1={origin[0]} y1={origin[1]} x2={px(...COL2)[0]} y2={px(...COL2)[1]} color={C.ok} width={2} dashed />
        </g>

        {/* Целта b */}
        <circle cx={target[0]} cy={target[1]} r={13} fill="none" stroke={C.warn} strokeWidth={2.5} />
        <circle cx={target[0]} cy={target[1]} r={3.5} fill={C.warn} />
        <SvgTex x={target[0] + 18} y={target[1] - 14} tex={String.raw`\vec b=(5,3)`} color={C.warn} fontSize={14} width={110} />

        {/* Комбинацията: глава до опашка */}
        {Math.abs(x) > 0.01 && (
          <Arrow x1={origin[0]} y1={origin[1]} x2={afterFirst[0]} y2={afterFirst[1]} color={C.plus} width={3.4} />
        )}
        {Math.abs(y) > 0.01 && (
          <Arrow x1={afterFirst[0]} y1={afterFirst[1]} x2={tip[0]} y2={tip[1]} color={C.ok} width={3.4} />
        )}
        <circle cx={tip[0]} cy={tip[1]} r={5.5} fill={solved ? C.warn : C.wire} stroke={STAGE_BG} strokeWidth={2} />

        <SvgTex
          x={24}
          y={36}
          tex={String.raw`x\begin{pmatrix}2\\1\end{pmatrix}+y\begin{pmatrix}1\\1\end{pmatrix}=\begin{pmatrix}5\\3\end{pmatrix}`}
          color={C.mut}
          fontSize={15}
          width={260}
        />

        {solved && (
          <text x={596} y={340} fill={C.warn} fontSize={13} fontWeight={800} textAnchor="end" className="animate-rise">
            ТОЧНО ПОПАДЕНИЕ
          </text>
        )}
      </svg>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
        {[
          { label: "$x$ (части от 1-вата колона)", value: `$${texNumber(x)}$`, tone: "minus" },
          { label: "$y$ (части от 2-рата колона)", value: `$${texNumber(y)}$`, tone: "minus" },
          {
            label: "Стигнахме до",
            value: String.raw`$\left(${texNumber(rx)},${texNumber(ry)}\right)$`,
            tone: solved ? "ok" : "minus",
          },
          {
            label: "Разстояние до $\\vec b$",
            value: `$${texNumber(miss)}$`,
            tone: solved ? "ok" : "plus",
          },
        ].map((r) => (
          <div key={r.label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">
              <RichText text={r.label} />
            </dt>
            <dd
              className={`mt-0.5 text-[15px] font-bold tabular-nums ${
                r.tone === "ok" ? "text-ok" : r.tone === "plus" ? "text-plus" : "text-minus"
              }`}
            >
              <RichText text={r.value} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-semibold text-ink">
          <RichText text="$x$: части от първата колона" />
          <input
            className="mt-2 w-full accent-(--color-plus)"
            type="range"
            min="-0.5"
            max="3"
            step="0.25"
            value={x}
            onChange={(e) => setX(Number(e.target.value))}
          />
        </label>
        <label className="text-[13px] font-semibold text-ink">
          <RichText text="$y$: части от втората колона" />
          <input
            className="mt-2 w-full accent-(--color-ok)"
            type="range"
            min="-0.5"
            max="3"
            step="0.25"
            value={y}
            onChange={(e) => setY(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          className={BTN_PRI}
          onClick={() => {
            setX(SOLUTION.x);
            setY(SOLUTION.y);
          }}
        >
          Намести на решението
        </button>
        <button
          type="button"
          className={BTN_SEC}
          onClick={() => {
            setX(0.5);
            setY(2.5);
          }}
        >
          Нулирай
        </button>
      </div>

      <p className="mt-4 rounded-r-lg border-l-4 border-minus bg-hl px-4 py-3 text-[15px] leading-relaxed text-ink/90">
        <RichText
          text={String.raw`Решаването на системата е търсене на **рецептата за смесване**: колко от всяка колона. Тъй като двете колони сочат в различни посоки, всяка точка на равнината се получава от точно една двойка $(x,y)$ и затова решението е единствено. Ако колоните бяха успоредни, всички комбинации щяха да лежат на една права и повечето цели биха били недостижими: точно случаят, който следващият урок ще нарече $\det M=0$.`}
        />
      </p>
    </div>
  );
}
