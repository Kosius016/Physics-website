"use client";

import { useEffect, useRef, useState } from "react";
import { BTN_PRI, BTN_SEC, C, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";

/**
 * Забавена реконструкция на отрицателна мълния облак-земя.
 *
 * Състоянието е едно число `t` (0 до 1 през целия цикъл). Анимацията и
 * плъзгачът движат точно него, затова всеки момент от събитието е достъпен и
 * проверим без анимация (CLAUDE.md §4). Прозата е под сцената, не в нея (§3).
 */

const DURATION_MS = 11000;

/** Дял от интервала [a, b], в който се намира t; извън него 0 или 1. */
function seg(t: number, a: number, b: number) {
  if (t <= a) return 0;
  if (t >= b) return 1;
  return (t - a) / (b - a);
}

/** Плавен връх: 0 в краищата, 1 в средата на интервала. */
function pulse(t: number, a: number, b: number) {
  const p = seg(t, a, b);
  return p === 0 || p === 1 ? 0 : Math.sin(Math.PI * p);
}

const MAIN_CHANNEL = "M382 88 L367 126 L385 153 L369 187 L391 218 L375 252 L397 282 L389 304";
const RETURN_CHANNEL =
  "M385 362 L380 343 L391 323 L389 304 L397 282 L375 252 L391 218 L369 187 L385 153 L367 126 L382 88";

const BRANCHES = [
  { d: "M385 153 L430 176 L447 205 L475 220", from: 0.16, to: 0.31, width: 2.4, peak: 0.78 },
  { d: "M391 218 L337 239 L311 270 L276 284", from: 0.25, to: 0.39, width: 2.6, peak: 0.7 },
  { d: "M397 282 L446 301 L469 329", from: 0.33, to: 0.47, width: 2.2, peak: 0.62 },
  { d: "M397 282 L352 308 L332 337", from: 0.39, to: 0.49, width: 2.1, peak: 0.55 },
];

const GROUND_STREAMERS = [
  { d: "M211 342 L205 323 L214 306", width: 2.4 },
  { d: "M385 362 L380 343 L391 323 L389 304", width: 3 },
  { d: "M542 350 L534 330 L544 310", width: 2.4 },
];

/** Разказът върви под сцената, за да е четим и на телефон. */
const NARRATION: { from: number; label: string; text: string }[] = [
  { from: 0, label: "Лидер надолу", text: "Разклоненията опипват въздуха и строят пътя надолу." },
  { from: 0.44, label: "Стримери нагоре", text: "От високите предмети се протягат къси канали нагоре." },
  { from: 0.55, label: "Свързване", text: "Един от тях среща клон на лидера. Пътят е затворен." },
  { from: 0.62, label: "Възвратен удар", text: "Яркият фронт пробягва нагоре по вече построения канал." },
];

function narrationAt(t: number) {
  let current = NARRATION[0];
  for (const n of NARRATION) if (t >= n.from) current = n;
  return current;
}

function Drawn({
  d,
  progress,
  stroke,
  width,
  opacity = 1,
}: {
  d: string;
  progress: number;
  stroke: string;
  width: number;
  opacity?: number;
}) {
  if (progress <= 0 || opacity <= 0) return null;
  return (
    <path
      d={d}
      fill="none"
      pathLength={1}
      opacity={opacity}
      stroke={stroke}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={width}
    />
  );
}

function Cloud() {
  return (
    <g fill="rgba(242,239,245,0.08)" stroke={C.faint} strokeWidth={1.2}>
      <ellipse cx={280} cy={73} rx={122} ry={48} />
      <ellipse cx={410} cy={63} rx={138} ry={54} />
      <ellipse cx={535} cy={82} rx={112} ry={46} />
      <rect x={154} y={77} width={492} height={58} rx={29} />
    </g>
  );
}

function Ground() {
  return (
    <g>
      <path d="M0 418 H760 V450 H0 Z" fill="rgba(242,239,245,0.07)" />
      <path d="M0 418 H760" fill="none" stroke={C.wire} strokeWidth={2} />
      <path
        d="M188 418 V384 H238 V418 M197 384 V360 H229 V384"
        fill="rgba(242,239,245,0.1)"
        stroke={C.wire}
        strokeWidth={1.4}
      />
      <path d="M211 360 V342" stroke={C.wire} strokeWidth={2} />
      <path
        d="M360 418 V390 H410 V418 M369 390 L385 362 L401 390"
        fill="rgba(242,239,245,0.11)"
        stroke={C.wire}
        strokeWidth={1.4}
      />
      <path
        d="M542 418 V381 M522 388 L542 350 L562 388 Z"
        fill="rgba(242,239,245,0.12)"
        stroke={C.wire}
        strokeWidth={1.4}
      />
    </g>
  );
}

function Arrow({ x, y1, y2, color, opacity }: { x: number; y1: number; y2: number; color: string; opacity: number }) {
  if (opacity <= 0.01) return null;
  const down = y2 > y1;
  const head = down ? `M${x - 9} ${y2 - 14} L${x} ${y2} L${x + 9} ${y2 - 14}` : `M${x - 9} ${y2 + 14} L${x} ${y2} L${x + 9} ${y2 + 14}`;
  return (
    <g fill="none" opacity={opacity} stroke={color} strokeLinecap="round" strokeWidth={2.5}>
      <line x1={x} y1={y1} x2={x} y2={y2} />
      <path d={head} />
    </g>
  );
}

export default function SlowMotionLightning() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  /* Автоматичен старт само ако потребителят не е поискал по-малко движение. */
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) setT(0.72);
    else setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;

    startRef.current = performance.now() - t * DURATION_MS;

    const step = (now: number) => {
      const elapsed = (now - startRef.current) % DURATION_MS;
      setT(elapsed / DURATION_MS);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // t нарочно не е зависимост: той се чете само при стартиране на цикъла.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const leader = seg(t, 0.05, 0.42);
  const streamers = seg(t, 0.44, 0.54);
  const contact = pulse(t, 0.54, 0.72);
  const returnStroke = seg(t, 0.6, 0.74);
  const flash = pulse(t, 0.58, 0.7);
  /* В края каналът гасне, но не изчезва: така плъзгачът никога не показва празна сцена. */
  const fade = 1 - 0.82 * seg(t, 0.92, 1);
  const leaderFade = returnStroke > 0 ? 0.3 : 1;
  const narration = narrationAt(t);

  return (
    <div className={PANEL_CLASS}>
      <div className="overflow-x-auto rounded-[10px]">
        <div className="min-w-[540px]">
          <svg
            viewBox="0 0 760 450"
            className={`${STAGE_CLASS} select-none`}
            role="img"
            aria-label={`Забавена реконструкция на мълния. ${narration.label}: ${narration.text}`}
          >
            <defs>
              <radialGradient id="lm-sky-glow" cx="50%" cy="54%" r="54%">
                <stop offset="0%" stopColor={C.wire} stopOpacity={0.1} />
                <stop offset="100%" stopColor={C.wire} stopOpacity={0} />
              </radialGradient>
              <filter id="lm-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation={8} />
              </filter>
            </defs>

            <rect width={760} height={450} fill={STAGE_BG} />
            <rect width={760} height={450} fill="url(#lm-sky-glow)" />
            <rect width={760} height={450} fill={C.wire} opacity={flash * 0.3} />

            <Cloud />
            <g stroke={C.minus} strokeLinecap="round" strokeWidth={3}>
              {[300, 354, 408, 462, 516].map((x) => (
                <line key={x} x1={x - 7} x2={x + 7} y1={108} y2={108} />
              ))}
            </g>
            <Ground />

            <g opacity={fade}>
              <Drawn d={MAIN_CHANNEL} progress={leader} stroke={C.minus} width={4.2} opacity={leaderFade} />
              {BRANCHES.map((b) => (
                <Drawn
                  key={b.d}
                  d={b.d}
                  progress={seg(t, b.from, b.to)}
                  stroke={C.minus}
                  width={b.width}
                  opacity={b.peak * leaderFade}
                />
              ))}

              {GROUND_STREAMERS.map((s) => (
                <Drawn key={s.d} d={s.d} progress={streamers} stroke={C.plus} width={s.width} opacity={leaderFade} />
              ))}

              {contact > 0 && (
                <g opacity={contact}>
                  <circle cx={389} cy={304} r={27} fill={C.warn} opacity={0.16} filter="url(#lm-soft-glow)" />
                  <circle cx={389} cy={304} r={7} fill={C.warn} />
                </g>
              )}

              <Drawn d={RETURN_CHANNEL} progress={returnStroke} stroke={C.warn} width={17} opacity={0.2} />
              <Drawn d={RETURN_CHANNEL} progress={returnStroke} stroke={C.warn} width={6} />

              <Arrow x={112} y1={156} y2={300} color={C.minus} opacity={fade * (1 - seg(t, 0.42, 0.5))} />
              <Arrow x={642} y1={384} y2={256} color={C.plus} opacity={fade * seg(t, 0.42, 0.48) * (1 - seg(t, 0.58, 0.64))} />
              <Arrow x={642} y1={384} y2={160} color={C.ok} opacity={fade * seg(t, 0.6, 0.66)} />
            </g>

            <text x={26} y={34} fill={C.mut} fontSize={11.5} fontWeight={800} letterSpacing="0.12em">
              ЗАБАВЕНО ДВИЖЕНИЕ
            </text>
            <text x={26} y={438} fill={C.mut} fontSize={11} fontWeight={800} letterSpacing="0.12em">
              ЗЕМЯ
            </text>
          </svg>
        </div>
      </div>

      <label className="mt-4 block">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Момент от събитието</span>
        <input
          type="range"
          min={0}
          max={1000}
          value={Math.round(t * 1000)}
          onChange={(e) => {
            setPlaying(false);
            setT(Number(e.target.value) / 1000);
          }}
          className="mt-1.5 h-6 w-full cursor-pointer accent-minus"
          aria-label="Преместете се във времето на разряда"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setPlaying((v) => !v)} className={BTN_PRI}>
          {playing ? "Пауза" : "Пуснете"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setT(0);
          }}
          className={BTN_SEC}
        >
          Отначало
        </button>
      </div>

      <div className="mt-4 rounded-[10px] border border-rule bg-hl px-4 py-3" aria-live="polite">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-minus">{narration.label}</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink">{narration.text}</p>
      </div>
    </div>
  );
}
