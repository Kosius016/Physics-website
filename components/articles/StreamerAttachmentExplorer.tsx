"use client";

import { useState } from "react";
import { C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";

const PHASES = [
  {
    short: "Лидер надолу",
    title: "1. Стъпаловидният лидер слиза от облака",
    body: "Отрицателният лидер удължава проводящия канал на къси стъпки. Върхът му създава силно поле и сноп от стримери, от които се оформя следващата стъпка.",
    direction: "Посока на растежа: надолу",
  },
  {
    short: "Стримери нагоре",
    title: "2. Земята отговаря с къси стримери",
    body: "Когато лидерът се приближи, полето около дървета, покриви и други високи обекти става много силно. От няколко места тръгват положителни стримери нагоре.",
    direction: "Посока на стримерите: нагоре",
  },
  {
    short: "Свързване",
    title: "3. Само един стример прави връзката",
    body: "Един възходящ стример достига клон на лидера. Така за пръв път се появява непрекъснат проводящ канал между облака и земята.",
    direction: "Каналът вече е непрекъснат",
  },
  {
    short: "Удар нагоре",
    title: "4. Ярката вълна се разпространява нагоре",
    body: "Възвратният удар осветява вече построения канал от мястото на свързване към облака. Това е вълна по канала, а не ново опипване на пътя.",
    direction: "Посока на яркия фронт: нагоре",
  },
] as const;

const LEADER_TOP = "M340 126 L326 158 L344 187 L327 219 L347 249 L334 280";
const LEADER_LOW = `${LEADER_TOP} L354 310 L343 339`;
const CHANNEL = `${LEADER_LOW} L357 363 L365 405`;

function Cloud() {
  return (
    <g fill="rgba(242,239,245,0.10)" stroke={C.faint} strokeWidth="1.3">
      <ellipse cx="250" cy="83" rx="108" ry="49" />
      <ellipse cx="355" cy="65" rx="120" ry="55" />
      <ellipse cx="470" cy="88" rx="105" ry="47" />
      <rect x="145" y="84" width="420" height="58" rx="29" />
    </g>
  );
}

function ChargeMarks() {
  return (
    <g stroke={C.minus} strokeWidth="3" strokeLinecap="round">
      {[250, 305, 360, 415, 470].map((x) => (
        <line key={x} x1={x - 7} y1="112" x2={x + 7} y2="112" />
      ))}
    </g>
  );
}

function GroundObjects() {
  return (
    <g>
      <path d="M0 405 H720 V448 H0 Z" fill="rgba(242,239,245,0.07)" />
      <line x1="0" y1="405" x2="720" y2="405" stroke={C.wire} strokeWidth="2.2" />
      <path d="M352 405 V370 M334 375 L352 340 L370 375 Z" fill="rgba(242,239,245,0.14)" stroke={C.wire} strokeWidth="1.5" />
      <path d="M176 405 V377 H218 V405 M184 377 V356 H210 V377" fill="rgba(242,239,245,0.10)" stroke={C.wire} strokeWidth="1.4" />
      <path d="M512 405 V366 H550 V405 M519 366 L531 346 L543 366" fill="rgba(242,239,245,0.10)" stroke={C.wire} strokeWidth="1.4" />
    </g>
  );
}

function DirectionArrow({
  x,
  y1,
  y2,
  color,
  label,
}: {
  x: number;
  y1: number;
  y2: number;
  color: string;
  label: string;
}) {
  const down = y2 > y1;
  return (
    <g stroke={color} fill="none" strokeLinecap="round">
      <line x1={x} y1={y1} x2={x} y2={y2} strokeWidth="2.5" />
      <path
        d={down ? `M${x - 7} ${y2 - 12} L${x} ${y2} L${x + 7} ${y2 - 12}` : `M${x - 7} ${y2 + 12} L${x} ${y2} L${x + 7} ${y2 + 12}`}
        strokeWidth="2.5"
      />
      <text
        x={x + 14}
        y={(y1 + y2) / 2}
        fill={color}
        stroke="none"
        fontSize="11"
        fontWeight="800"
        letterSpacing="0.08em"
      >
        {label}
      </text>
    </g>
  );
}

export default function StreamerAttachmentExplorer() {
  const [phase, setPhase] = useState(0);
  const current = PHASES[phase];
  const showGroundStreamers = phase >= 1;
  const connected = phase >= 2;
  const returnStroke = phase === 3;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
          Обикновена отрицателна мълния облак-земя
        </p>
        <h3 className="mt-1 font-serif text-[21px] font-bold text-ink">
          Кой канал накъде се движи?
        </h3>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Фази на свързването">
        {PHASES.map((item, index) => (
          <button
            key={item.short}
            type="button"
            onClick={() => setPhase(index)}
            aria-pressed={phase === index}
            className={`cursor-pointer rounded-lg border-[1.5px] border-ink px-3 py-2 text-[12.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus ${
              phase === index ? "bg-ink text-white" : "bg-surface text-ink hover:bg-hl"
            }`}
          >
            {item.short}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[10px]">
        <div className="min-w-[560px]">
          <svg
            viewBox="0 0 720 448"
            className={`${STAGE_CLASS} select-none`}
            role="img"
            aria-label={`${current.title}. ${current.body}`}
          >
            <rect width="720" height="448" fill={STAGE_BG} />
            <Cloud />
            <ChargeMarks />
            <GroundObjects />

            <text x="28" y="34" fill={C.mut} fontSize="11" fontWeight="800" letterSpacing="0.12em">
              ОБЛАК
            </text>
            <text x="28" y="430" fill={C.mut} fontSize="11" fontWeight="800" letterSpacing="0.12em">
              ЗЕМЯ
            </text>

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                d={phase === 0 ? LEADER_TOP : LEADER_LOW}
                stroke={returnStroke ? C.faint : C.minus}
                strokeWidth={returnStroke ? 2 : 4}
              />
              <path d="M344 187 L382 208 L371 236" stroke={returnStroke ? C.faint : C.minus} strokeWidth="2.5" opacity="0.72" />
              <path d="M347 249 L305 269 L291 298" stroke={returnStroke ? C.faint : C.minus} strokeWidth="2.5" opacity="0.58" />
            </g>

            {phase === 0 && (
              <>
                <g fill="none" stroke={C.minus} strokeWidth="1.7" strokeLinecap="round" opacity="0.7">
                  <path d="M334 280 L319 297 M334 280 L341 301 M334 280 L356 294" />
                </g>
                <circle cx="334" cy="280" r="17" fill={C.minus} opacity="0.13" />
                <DirectionArrow x={112} y1={150} y2={286} color={C.minus} label="ЛИДЕР НАДОЛУ" />
              </>
            )}

            {showGroundStreamers && (
              <g fill="none" stroke={returnStroke ? C.faint : C.plus} strokeLinecap="round" strokeLinejoin="round">
                <path d="M199 356 L194 339 L204 325" strokeWidth="2.4" opacity={connected ? 0.35 : 0.85} />
                <path d="M352 340 L347 323 L355 307 L350 291" strokeWidth={connected ? 3.4 : 2.8} />
                <path d="M531 346 L522 330 L530 314" strokeWidth="2.4" opacity={connected ? 0.35 : 0.85} />
              </g>
            )}

            {phase === 1 && (
              <>
                <circle cx="350" cy="291" r="18" fill={C.plus} opacity="0.13" />
                <DirectionArrow x={590} y1={386} y2={274} color={C.plus} label="СТРИМЕРИ НАГОРЕ" />
              </>
            )}

            {connected && !returnStroke && (
              <>
                <path d={CHANNEL} fill="none" stroke={C.warn} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="350" cy="291" r="24" fill={C.warn} opacity="0.20" />
                <circle cx="350" cy="291" r="6" fill={C.warn} />
                <text x="382" y="300" fill={C.warn} fontSize="11" fontWeight="800" letterSpacing="0.08em">
                  СВЪРЗВАНЕ
                </text>
              </>
            )}

            {returnStroke && (
              <>
                <path d={CHANNEL} fill="none" stroke={C.warn} strokeWidth="15" opacity="0.20" strokeLinecap="round" strokeLinejoin="round" />
                <path d={CHANNEL} fill="none" stroke={C.warn} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
                <DirectionArrow x={590} y1={386} y2={150} color={C.ok} label="ЯРЪК ФРОНТ НАГОРЕ" />
              </>
            )}

            <g transform="translate(24 368)">
              <rect width="275" height="25" rx="12.5" fill="rgba(0,0,0,0.42)" />
              <circle cx="15" cy="12.5" r="4" fill={phase === 0 ? C.minus : phase === 1 ? C.plus : phase === 2 ? C.warn : C.ok} />
              <text x="28" y="17" fill={C.wire} fontSize="11.5" fontWeight="700">
                {current.direction}
              </text>
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-rule bg-hl px-4 py-3" aria-live="polite">
        <p className="font-bold text-ink">{current.title}</p>
        <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{current.body}</p>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Важно: посоката на растежа на канала и посоката на яркия фронт са различни неща.
        Частиците също не трябва да се представят като една топка, която изминава целия път.
      </p>
    </div>
  );
}
