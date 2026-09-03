"use client";

import { useEffect, useRef, useState } from "react";
import RichText from "@/components/RichText";
import SvgTex from "./SvgTex";
import { Arrow, BTN_PRI, BTN_SEC, C, CurrentSymbol, PANEL_CLASS, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Анимираните опити към урока по Фарадей. Сцените са SVG, за да могат
 * всички величини да се набират с KaTeX; числените стойности живеят в
 * readout лентите под сцената, както в останалите глави.
 */

const W = 660;
const H = 340;
const q = (v: number) => Math.round(v * 100) / 100;

function Stage({ title }: { title: string }) {
  return (
    <>
      <rect width={W} height={H} fill={STAGE_BG} />
      {Array.from({ length: Math.ceil(W / 25) }, (_, i) => (
        <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2={H} stroke={C.faint} opacity="0.1" />
      ))}
      {Array.from({ length: Math.ceil(H / 25) }, (_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 25} x2={W} y2={i * 25} stroke={C.faint} opacity="0.1" />
      ))}
      <text x="24" y="30" fill={C.mut} fontSize="12" fontWeight="800" letterSpacing="0.05em">{title}</text>
    </>
  );
}

function Readout({ cells }: { cells: { label: string; tex: string; tone: string }[] }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
      {cells.map((c) => (
        <div key={c.label} className="min-w-0 bg-surface px-3 py-2.5">
          <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{c.label}</dt>
          <dd className={`mt-0.5 text-[15px] font-bold tabular-nums ${c.tone}`}>
            <RichText text={c.tex} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ============ Опитът на Фарадей: магнит и намотка ============ */

export function MagnetCoilLab() {
  const [position, setPosition] = useState(0.25);
  const [direction, setDirection] = useState<"in" | "out" | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);
  useEffect(() => {
    if (!direction) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPosition((p) => {
        const next = p + (direction === "in" ? 1 : -1) * dt * 0.38;
        if (next >= 1 || next <= 0) { setDirection(null); return Math.max(0, Math.min(1, next)); }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [direction]);

  const proximity = 0.25 + position * 0.75;
  const emf = (direction ? (direction === "in" ? 1 : -1) : 0) * proximity * 8;
  const coilX = 210;
  const magX = 620 - position * 300;
  const needle = emf * 0.12;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={direction === "in" ? BTN_PRI : BTN_SEC} onClick={() => setDirection("in")}>Приближете магнита</button>
        <button type="button" className={direction === "out" ? BTN_PRI : BTN_SEC} onClick={() => setDirection("out")}>Отдалечете магнита</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS + " select-none"} role="img" aria-label="Опит на Фарадей: магнит, движещ се спрямо намотка, свързана с галванометър">
        <Stage title="ОПИТ НА ФАРАДЕЙ · МАГНИТ И НАМОТКА" />

        {/* намотката */}
        {Array.from({ length: 7 }, (_, i) => (
          <ellipse key={i} cx={coilX + i * 8} cy="162" rx="38" ry="92" fill="none" stroke={C.warn} strokeWidth="3.5" />
        ))}
        {/* веригата към галванометъра */}
        <polyline points={`190,254 108,254 108,300 176,300`} fill="none" stroke={C.warn} strokeWidth="3.5" />
        <polyline points={`262,254 336,254 336,300 268,300`} fill="none" stroke={C.warn} strokeWidth="3.5" />
        <circle cx="222" cy="300" r="30" fill={C.mut} fillOpacity="0.14" stroke={C.wire} strokeWidth="2" />
        <line x1="222" y1="300" x2={q(222 + 22 * Math.sin(needle))} y2={q(300 - 22 * Math.cos(needle))} stroke={emf > 0 ? C.ok : emf < 0 ? C.plus : C.mut} strokeWidth="2.6" strokeLinecap="round" />
        <text x="222" y="326" textAnchor="middle" fill={C.mut} fontSize="11" fontWeight="800">G</text>

        {/* магнитът */}
        <rect x={q(magX)} y="124" width="62" height="72" rx="4" fill={C.plus} />
        <rect x={q(magX + 62)} y="124" width="62" height="72" rx="4" fill={C.minus} />
        <text x={q(magX + 31)} y="168" textAnchor="middle" fill={STAGE_BG} fontSize="24" fontWeight="900">N</text>
        <text x={q(magX + 93)} y="168" textAnchor="middle" fill={STAGE_BG} fontSize="24" fontWeight="900">S</text>

        {/* силови линии от магнита към намотката */}
        {Array.from({ length: 6 }, (_, i) => (
          <Arrow key={i} x1={q(magX - 8 - i * 10)} y1={q(120 + i * 16)} x2={q(coilX + 48)} y2={q(126 + i * 12)} color={C.minus} width={1.3} />
        ))}

        {direction && (
          <Arrow x1={q(magX + 62)} y1={90} x2={q(magX + 62 + (direction === "in" ? -66 : 66))} y2={90} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-12} texLabelWidth={26} />
        )}
        <text x={W - 24} y="30" textAnchor="end" fill={C.mut} fontSize="12" fontWeight="700">
          {direction ? "ПОТОКЪТ СЕ МЕНИ → ТЕЧЕ ТОК" : "МАГНИТЪТ Е НЕПОДВИЖЕН → НЯМА ТОК"}
        </text>
      </svg>

      <Readout
        cells={[
          { label: "Движение", tex: direction === "in" ? "приближава" : direction === "out" ? "отдалечава" : "покой", tone: "text-ink" },
          { label: "Промяна на потока", tex: direction === "in" ? "$\\Phi_B\\uparrow$" : direction === "out" ? "$\\Phi_B\\downarrow$" : "$\\Phi_B=\\text{const}$", tone: "text-minus" },
          { label: "Индуцирано ЕДН", tex: `$\\mathcal{E}=${emf.toFixed(1)}\\,\\mathrm{V}$`, tone: emf === 0 ? "text-muted" : "text-ok" },
          { label: "Ток", tex: emf === 0 ? "$I=0$" : emf > 0 ? "положителен" : "отрицателен", tone: emf === 0 ? "text-muted" : "text-ok" },
        ]}
      />

      <label className="mt-4 block text-[13px] font-medium text-muted">
        <span className="flex justify-between"><span>Положение на магнита</span><strong className="text-minus">{(position * 100).toFixed(0)}%</strong></span>
        <input className="w-full accent-(--color-minus)" type="range" min="0" max="1" step="0.01" value={position}
          onChange={(e) => { setDirection(null); setPosition(+e.target.value); }} />
      </label>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Спрете магнита на произволно място: потокът през намотката е голям, но **постоянен** — и стрелката пада на нула. Ток има само докато потокът се мени." />
      </p>
    </div>
  );
}

/* ============ Плъзгаща пръчка върху релси ============ */

export function SlidingRodLab() {
  const [speed, setSpeed] = useState(0.65);
  const [running, setRunning] = useState(false);
  const [x, setX] = useState(0.3);
  const sign = useRef(1);
  const raf = useRef<number | null>(null);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setX((old) => {
        let next = old + sign.current * dt * speed * 0.3;
        if (next > 1 || next < 0) { sign.current *= -1; next = Math.max(0, Math.min(1, next)); }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [running, speed]);

  const B = 0.8, l = 0.55, R = 2.2;
  const v = running ? speed * sign.current : 0;
  const flux = B * l * (0.2 + x * 0.9);
  const emf = B * l * Math.abs(v);
  const current = emf / R;
  const force = B * l * current;

  const railL = 150, railR = 620;
  const rodX = railL + 60 + x * (railR - railL - 110);

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={BTN_PRI} onClick={() => setRunning((r) => !r)}>{running ? "Пауза" : "Пуснете ▶"}</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS + " select-none"} role="img" aria-label="Пръчка, плъзгаща се по релси в магнитно поле, с поток, ЕДН, ток и спирачна сила">
        <Stage title="ПЛЪЗГАЩА ПРЪЧКА · ПОТОК → ЕДН → ТОК → СПИРАНЕ" />

        {/* поле навътре в екрана */}
        <g stroke={C.minus} strokeWidth="1.6" opacity="0.5" strokeLinecap="round">
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 13 }, (_, c) => {
              const cx = 170 + c * 36, cy = 96 + r * 30;
              return (
                <g key={`${r}-${c}`}>
                  <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} />
                  <line x1={cx + 4} y1={cy - 4} x2={cx - 4} y2={cy + 4} />
                </g>
              );
            }),
          )}
        </g>

        {/* релсите и резисторът */}
        <line x1={railL} y1="88" x2={railR} y2="88" stroke={C.wire} strokeWidth="5" />
        <line x1={railL} y1="272" x2={railR} y2="272" stroke={C.wire} strokeWidth="5" />
        <line x1={railL} y1="88" x2={railL} y2="132" stroke={C.wire} strokeWidth="4" />
        <polyline points={Array.from({ length: 9 }, (_, i) => `${railL + (i === 0 || i === 8 ? 0 : i % 2 ? 9 : -9)},${132 + i * 12}`).join(" ")} fill="none" stroke={C.warn} strokeWidth="3" strokeLinejoin="round" />
        <line x1={railL} y1="228" x2={railL} y2="272" stroke={C.wire} strokeWidth="4" />
        <SvgTex x={railL - 16} y={180} tex="R" color={C.warn} fontSize={16} width={24} anchor="end" />

        {/* пръчката */}
        <line x1={q(rodX)} y1="84" x2={q(rodX)} y2="276" stroke={C.warn} strokeWidth="10" />
        <SvgTex x={q(rodX + 16)} y={180} tex="\ell" color={C.warn} fontSize={17} width={20} />
        {v !== 0 && (
          <Arrow x1={q(rodX)} y1={62} x2={q(rodX + v * 90)} y2={62} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-12} texLabelWidth={26} />
        )}
        {v !== 0 && (
          <Arrow x1={q(rodX)} y1={300} x2={q(rodX - v * 90)} y2={300} color={C.plus} width={3} texLabel="\vec F_B" texLabelDy={16} texLabelWidth={32} />
        )}
        {v !== 0 && (
          <Arrow x1={q(rodX - 22)} y1={236} x2={q(rodX - 22)} y2={130} color={C.ok} width={2.4} texLabel="I" texLabelDx={-18} texLabelDy={0} texLabelWidth={18} />
        )}
        <text x={W - 24} y="30" textAnchor="end" fill={C.mut} fontSize="12" fontWeight="700">
          {v === 0 ? "ПРЪЧКАТА СТОИ → ЕДН = 0" : "ВЪНШНАТА РАБОТА СТАВА ТОПЛИНА"}
        </text>
      </svg>

      <Readout
        cells={[
          { label: "Поток", tex: `$\\Phi_B=${flux.toFixed(2)}\\,\\mathrm{T\\,m^2}$`, tone: "text-minus" },
          { label: "ЕДН", tex: `$|\\mathcal{E}|=${emf.toFixed(2)}\\,\\mathrm{V}$`, tone: "text-ok" },
          { label: "Ток", tex: `$I=${current.toFixed(2)}\\,\\mathrm{A}$`, tone: "text-ok" },
          { label: "Спирачна сила", tex: `$F_B=${force.toFixed(2)}\\,\\mathrm{N}$`, tone: "text-plus" },
        ]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Скорост</span><strong className="text-minus">{speed.toFixed(2)}</strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0.1" max="1.5" step="0.05" value={speed} onChange={(e) => setSpeed(+e.target.value)} />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="flex justify-between"><span>Положение на пръчката</span><strong className="text-minus">{(x * 100).toFixed(0)}%</strong></span>
          <input className="w-full accent-(--color-minus)" type="range" min="0" max="1" step="0.01" value={x}
            onChange={(e) => { setRunning(false); setX(+e.target.value); }} />
        </label>
      </div>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Спирачната сила $F_B=BI\ell$ винаги сочи срещу движението — затова токът сменя посока, когато пръчката тръгне обратно. Външната работа се превръща в топлина $I^2R$." />
      </p>
    </div>
  );
}

/* ============ Закон на Ленц: магнит и проводящ пръстен ============ */

export function MagnetRingLab() {
  const [position, setPosition] = useState(0.15);
  const [mode, setMode] = useState<"in" | "out" | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);
  useEffect(() => {
    if (!mode) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPosition((p) => {
        const next = p + (mode === "in" ? 1 : -1) * dt * 0.32;
        if (next >= 1 || next <= 0) { setMode(null); return Math.max(0, Math.min(1, next)); }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [mode]);

  const ringX = 210;
  const ringRy = 96;
  const ringRx = 34;
  // магнитът спира преди пръстена, за да не се застъпват
  const magW = 118;
  const magX = 560 - position * 250;
  const gap = magX - (ringX + ringRx);

  // Приближаване (N напред): потокът расте → лицето срещу магнита става N → отблъскване.
  // Отдалечаване: потокът намалява → лицето става S → привличане.
  const facePole = mode === "in" ? "N" : mode === "out" ? "S" : null;
  const repel = mode === "in";
  // Индуцираният ток: гледано откъм магнита, обратно на часовниковата при "in"
  const currentOut = mode === "in";
  const strength = mode ? 0.3 + (1 - gap / 340) * 0.7 : 0;

  return (
    <div className={PANEL_CLASS}>
      <div className="mb-3 flex flex-wrap gap-2">
        <button type="button" className={mode === "in" ? BTN_PRI : BTN_SEC} onClick={() => setMode("in")}>Приближете → отблъскване</button>
        <button type="button" className={mode === "out" ? BTN_PRI : BTN_SEC} onClick={() => setMode("out")}>Отдалечете → привличане</button>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className={STAGE_CLASS + " select-none"} role="img" aria-label="Магнит и проводящ пръстен: индуцираният ток отблъсква приближаващия и привлича отдалечаващия се магнит">
        <Stage title="ЗАКОН НА ЛЕНЦ · МАГНИТ ↔ ПРОВОДЯЩ ПРЪСТЕН" />

        {/* силовите линии на магнита, минаващи през пръстена */}
        {mode && Array.from({ length: 5 }, (_, i) => {
          const y = 120 + i * 24;
          return <Arrow key={i} x1={q(magX - 6)} y1={y} x2={q(ringX + ringRx + 8)} y2={q(168 + (y - 168) * 0.55)} color={C.minus} width={1.4} />;
        })}

        {/* пръстенът, видян под ъгъл */}
        <ellipse cx={ringX} cy="168" rx={ringRx} ry={ringRy} fill={C.warn} fillOpacity="0.08" stroke={C.warn} strokeWidth="9" />

        {/* индуцираният ток: ⊙ горе и ⊗ долу (или обратно) */}
        {mode && (
          <>
            <CurrentSymbol x={ringX} y={168 - ringRy} out={currentOut} r={11} color={C.ok} />
            <CurrentSymbol x={ringX} y={168 + ringRy} out={!currentOut} r={11} color={C.ok} />
            <SvgTex x={ringX - ringRx - 14} y={168} tex="I_{\text{инд}}" color={C.ok} fontSize={14} width={48} anchor="end" />
          </>
        )}

        {/* полюсът, който пръстенът показва към магнита */}
        {facePole && (
          <>
            <circle cx={q(ringX + ringRx + 24)} cy="168" r="19" fill={repel ? C.plus : C.minus} fillOpacity="0.22" stroke={repel ? C.plus : C.minus} strokeWidth="2" />
            <text x={q(ringX + ringRx + 24)} y="175" textAnchor="middle" fill={repel ? C.plus : C.minus} fontSize="20" fontWeight="900">{facePole}</text>
          </>
        )}

        {/* магнитът */}
        <rect x={q(magX)} y="132" width={magW / 2} height="72" rx="4" fill={C.plus} />
        <rect x={q(magX + magW / 2)} y="132" width={magW / 2} height="72" rx="4" fill={C.minus} />
        <text x={q(magX + magW / 4)} y="176" textAnchor="middle" fill={STAGE_BG} fontSize="24" fontWeight="900">N</text>
        <text x={q(magX + (3 * magW) / 4)} y="176" textAnchor="middle" fill={STAGE_BG} fontSize="24" fontWeight="900">S</text>

        {/* скорост на магнита (горе) и сила върху него (долу) — разделени, за да не се застъпват */}
        {mode && (
          <Arrow x1={q(magX + magW / 2)} y1={102} x2={q(magX + magW / 2 + (mode === "in" ? -70 : 70))} y2={102} color={C.warn} width={3} texLabel="\vec v" texLabelDy={-12} texLabelWidth={26} />
        )}
        {mode && (
          <Arrow x1={q(magX + magW / 2)} y1={234} x2={q(magX + magW / 2 + (repel ? 70 : -70) * strength)} y2={234} color={repel ? C.plus : C.ok} width={3} texLabel="\vec F" texLabelDy={16} texLabelWidth={26} />
        )}

        <text x={W - 24} y="30" textAnchor="end" fill={C.mut} fontSize="12" fontWeight="700">
          {mode === "in" ? "ПОТОКЪТ РАСТЕ → ПОЛЕ СРЕЩУ НЕГО" : mode === "out" ? "ПОТОКЪТ НАМАЛЯВА → ПОЛЕ В ПОДКРЕПА" : "ЗАДВИЖЕТЕ МАГНИТА"}
        </text>
      </svg>

      <Readout
        cells={[
          { label: "Движение", tex: mode === "in" ? "приближава" : mode === "out" ? "отдалечава" : "покой", tone: "text-ink" },
          { label: "Поток през пръстена", tex: mode === "in" ? "$\\Phi_B\\uparrow$" : mode === "out" ? "$\\Phi_B\\downarrow$" : "$\\Phi_B=\\text{const}$", tone: "text-minus" },
          { label: "Лице към магнита", tex: facePole ? `$${facePole}$` : "—", tone: repel ? "text-plus" : mode ? "text-minus" : "text-muted" },
          { label: "Сила върху магнита", tex: mode === "in" ? "отблъскване" : mode === "out" ? "привличане" : "$F=0$", tone: mode ? (repel ? "text-plus" : "text-ok") : "text-muted" },
        ]}
      />

      <label className="mt-4 block text-[13px] font-medium text-muted">
        <span className="flex justify-between"><span>Положение на магнита</span><strong className="text-minus">{(position * 100).toFixed(0)}%</strong></span>
        <input className="w-full accent-(--color-minus)" type="range" min="0" max="1" step="0.01" value={position}
          onChange={(e) => { setMode(null); setPosition(+e.target.value); }} />
      </label>
      <p className="mt-3 text-[13.5px] text-muted">
        <RichText text="Пръстенът винаги се противи на **промяната**: при приближаване обръща към магнита едноименен полюс ($N$ срещу $N$) и го отблъсква; при отдалечаване обръща разноименен ($S$ срещу $N$) и го дърпа обратно. Спрете магнита — потокът е постоянен и токът изчезва." />
      </p>
    </div>
  );
}
