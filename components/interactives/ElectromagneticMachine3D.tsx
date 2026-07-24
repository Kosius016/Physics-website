"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "generator" | "motor";
type Vec3 = { x: number; y: number; z: number };
type ScreenPoint = { x: number; y: number; depth: number; scale: number };

const CW = 900;
const CH = 500;

const colors = {
  bg: "#07101c",
  bg2: "#101d2d",
  panel: "#132338",
  grid: "#27415f",
  white: "#f5f9ff",
  muted: "#9eb0c7",
  red: "#f05c54",
  redDark: "#8d292d",
  blue: "#4386e9",
  blueDark: "#214986",
  copper: "#ffad5b",
  copperDark: "#a35424",
  yellow: "#ffd66f",
  green: "#62d493",
  steel: "#9aabc0",
};

function shade(hex: string, amount: number) {
  const value = hex.replace("#", "");
  const n = parseInt(value, 16);
  const r = Math.max(0, Math.min(255, (n >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amount));
  const b = Math.max(0, Math.min(255, (n & 255) + amount));
  return `rgb(${r}, ${g}, ${b})`;
}

function rotateAroundY(p: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
}

function makeProjector(yaw: number, pitch: number) {
  return (p: Vec3): ScreenPoint => {
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const cp = Math.cos(pitch);
    const sp = Math.sin(pitch);
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    const y2 = p.y * cp - z1 * sp;
    const z2 = p.y * sp + z1 * cp;
    const distance = 9.6;
    const scale = 78 / (distance - z2);
    return { x: 365 + x1 * scale * 9.7, y: 245 - y2 * scale * 9.7, depth: z2, scale };
  };
}

function polygon(ctx: CanvasRenderingContext2D, points: ScreenPoint[], fill: string, stroke = "rgba(255,255,255,.13)") {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawBox(
  ctx: CanvasRenderingContext2D,
  project: (p: Vec3) => ScreenPoint,
  center: Vec3,
  size: Vec3,
  color: string,
) {
  const { x, y, z } = center;
  const hx = size.x / 2;
  const hy = size.y / 2;
  const hz = size.z / 2;
  const v: Vec3[] = [
    { x: x - hx, y: y - hy, z: z - hz },
    { x: x + hx, y: y - hy, z: z - hz },
    { x: x + hx, y: y + hy, z: z - hz },
    { x: x - hx, y: y + hy, z: z - hz },
    { x: x - hx, y: y - hy, z: z + hz },
    { x: x + hx, y: y - hy, z: z + hz },
    { x: x + hx, y: y + hy, z: z + hz },
    { x: x - hx, y: y + hy, z: z + hz },
  ];
  const faces = [
    { ids: [0, 1, 2, 3], delta: -32 },
    { ids: [4, 5, 6, 7], delta: 24 },
    { ids: [0, 4, 7, 3], delta: -18 },
    { ids: [1, 5, 6, 2], delta: 8 },
    { ids: [3, 2, 6, 7], delta: 36 },
    { ids: [0, 1, 5, 4], delta: -42 },
  ].map((face) => {
    const pts = face.ids.map((i) => project(v[i]));
    return { ...face, pts, depth: pts.reduce((sum, p) => sum + p.depth, 0) / pts.length };
  });
  faces.sort((a, b) => a.depth - b.depth).forEach((face) => polygon(ctx, face.pts, shade(color, face.delta)));
}

function drawLine3D(
  ctx: CanvasRenderingContext2D,
  project: (p: Vec3) => ScreenPoint,
  a: Vec3,
  b: Vec3,
  color: string,
  width = 4,
  alpha = 1,
) {
  const pa = project(a);
  const pb = project(b);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(0,0,0,.45)";
  ctx.lineWidth = width + 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(pa.x + 2, pa.y + 3);
  ctx.lineTo(pb.x + 2, pb.y + 3);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
  ctx.restore();
}

function drawArrow3D(
  ctx: CanvasRenderingContext2D,
  project: (p: Vec3) => ScreenPoint,
  a: Vec3,
  b: Vec3,
  color: string,
  alpha = 1,
) {
  const pa = project(a);
  const pb = project(b);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(pa.x, pa.y);
  ctx.lineTo(pb.x, pb.y);
  ctx.stroke();
  const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
  ctx.beginPath();
  ctx.moveTo(pb.x, pb.y);
  ctx.lineTo(pb.x - 11 * Math.cos(ang - 0.5), pb.y - 11 * Math.sin(ang - 0.5));
  ctx.lineTo(pb.x - 11 * Math.cos(ang + 0.5), pb.y - 11 * Math.sin(ang + 0.5));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRing3D(
  ctx: CanvasRenderingContext2D,
  project: (p: Vec3) => ScreenPoint,
  y: number,
  radius: number,
  angle: number,
  color: string,
  start = 0,
  end = Math.PI * 2,
  width = 7,
) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const segments = 44;
  for (let i = 0; i < segments; i++) {
    const t1 = start + ((end - start) * i) / segments + angle;
    const t2 = start + ((end - start) * (i + 1)) / segments + angle;
    const p1 = project({ x: Math.cos(t1) * radius, y, z: Math.sin(t1) * radius });
    const p2 = project({ x: Math.cos(t2) * radius, y, z: Math.sin(t2) * radius });
    ctx.strokeStyle = "rgba(0,0,0,.45)";
    ctx.lineWidth = width + 4;
    ctx.beginPath();
    ctx.moveTo(p1.x + 1, p1.y + 2);
    ctx.lineTo(p2.x + 1, p2.y + 2);
    ctx.stroke();
    ctx.strokeStyle = shade(color, Math.round((p1.depth + 1) * 13));
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r = 10) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function label(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, color = colors.white, size = 15, align: CanvasTextAlign = "left", weight = 700) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(value, x, y);
  ctx.restore();
}

function pill(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, color: string) {
  ctx.save();
  ctx.font = "800 12px system-ui, sans-serif";
  const w = ctx.measureText(value).width + 20;
  roundRect(ctx, x, y, w, 28, 14);
  ctx.fillStyle = `${color}22`;
  ctx.fill();
  ctx.strokeStyle = `${color}bb`;
  ctx.lineWidth = 1;
  ctx.stroke();
  label(ctx, value, x + w / 2, y + 14, color, 12, "center", 800);
  ctx.restore();
}

function loopPoint(t: number, angle: number): Vec3 {
  const u = ((t % 1) + 1) % 1;
  let p: Vec3;
  if (u < 0.25) p = { x: -1.28 + (u / 0.25) * 2.56, y: 1.08, z: 0 };
  else if (u < 0.5) p = { x: 1.28, y: 1.08 - ((u - 0.25) / 0.25) * 2.16, z: 0 };
  else if (u < 0.75) p = { x: 1.28 - ((u - 0.5) / 0.25) * 2.56, y: -1.08, z: 0 };
  else p = { x: -1.28, y: -1.08 + ((u - 0.75) / 0.25) * 2.16, z: 0 };
  return rotateAroundY(p, angle);
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  angle: number,
  yaw: number,
  pitch: number,
  mode: Mode,
  speed: number,
) {
  const bg = ctx.createLinearGradient(0, 0, CW, CH);
  bg.addColorStop(0, colors.bg2);
  bg.addColorStop(0.65, colors.bg);
  bg.addColorStop(1, "#050a11");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CW, CH);

  ctx.save();
  ctx.strokeStyle = colors.grid;
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 1;
  for (let x = 20; x < CW; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CH);
    ctx.stroke();
  }
  for (let y = 20; y < CH; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CW, y);
    ctx.stroke();
  }
  ctx.restore();

  const project = makeProjector(yaw, pitch);

  // Основа и две полюсни тела.
  drawBox(ctx, project, { x: 0, y: -1.85, z: 0 }, { x: 6.9, y: 0.28, z: 3.7 }, "#34465c");
  drawBox(ctx, project, { x: -3.05, y: 0, z: 0 }, { x: 0.95, y: 3.15, z: 2.45 }, colors.red);
  drawBox(ctx, project, { x: 3.05, y: 0, z: 0 }, { x: 0.95, y: 3.15, z: 2.45 }, colors.blue);

  // Магнитно поле N → S.
  [-0.78, 0, 0.78].forEach((z) => {
    [-0.75, 0, 0.75].forEach((y) => {
      drawArrow3D(ctx, project, { x: -2.35, y, z }, { x: 2.35, y, z }, colors.blue, 0.38);
    });
  });

  // Валът и опорите.
  drawLine3D(ctx, project, { x: 0, y: -1.76, z: 0 }, { x: 0, y: 1.8, z: 0 }, colors.steel, 9);
  drawBox(ctx, project, { x: 0, y: 1.66, z: 0 }, { x: 0.72, y: 0.28, z: 0.72 }, "#6f8197");

  // Въртящата се намотка — истински 3D точки, завъртени около оста y.
  const base: Vec3[] = [
    { x: -1.28, y: 1.08, z: 0 },
    { x: 1.28, y: 1.08, z: 0 },
    { x: 1.28, y: -1.08, z: 0 },
    { x: -1.28, y: -1.08, z: 0 },
  ];
  const coil = base.map((p) => rotateAroundY(p, angle));
  const segments = coil.map((p, i) => {
    const q = coil[(i + 1) % coil.length];
    const depth = (project(p).depth + project(q).depth) / 2;
    return { p, q, depth };
  });
  segments.sort((a, b) => a.depth - b.depth).forEach((s) => drawLine3D(ctx, project, s.p, s.q, colors.copper, 11));
  // Светъл кант подсилва металния обем.
  segments.forEach((s) => drawLine3D(ctx, project, s.p, s.q, "#ffd08c", 2.2, 0.9));

  // Движещи се носители на заряд. При двигателя комутаторът обръща посоката всеки половин оборот.
  const commutatorSign = mode === "motor" && Math.cos(angle) < 0 ? -1 : 1;
  for (let i = 0; i < 12; i++) {
    const phase = (angle * 0.12 + i / 12) * commutatorSign;
    const p = project(loopPoint(phase, angle));
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4.2, 0, Math.PI * 2);
    ctx.fillStyle = mode === "motor" ? colors.yellow : colors.green;
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Плъзгащи пръстени или комутатор и четки.
  if (mode === "generator") {
    drawRing3D(ctx, project, -1.35, 0.46, angle, colors.copper, 0, Math.PI * 2, 7);
    drawRing3D(ctx, project, -1.58, 0.46, angle, colors.copper, 0, Math.PI * 2, 7);
  } else {
    drawRing3D(ctx, project, -1.47, 0.49, angle, colors.red, 0.12, Math.PI - 0.12, 9);
    drawRing3D(ctx, project, -1.47, 0.49, angle, colors.blue, Math.PI + 0.12, Math.PI * 2 - 0.12, 9);
  }
  drawBox(ctx, project, { x: -0.72, y: -1.48, z: 0 }, { x: 0.42, y: 0.34, z: 0.48 }, "#202a37");
  drawBox(ctx, project, { x: 0.72, y: -1.48, z: 0 }, { x: 0.42, y: 0.34, z: 0.48 }, "#202a37");

  // Етикети на полюсите, прикрепени към проектираните центрове.
  const n = project({ x: -3.08, y: 0.15, z: 1.25 });
  const s = project({ x: 3.08, y: 0.15, z: 1.25 });
  label(ctx, "N", n.x, n.y, colors.white, 32, "center", 900);
  label(ctx, "S", s.x, s.y, colors.white, 32, "center", 900);
  const axis = project({ x: 0, y: 1.92, z: 0 });
  label(ctx, "вал", axis.x + 10, axis.y - 6, colors.muted, 13, "left", 700);

  // Въртящ момент / механично задвижване.
  ctx.save();
  ctx.strokeStyle = mode === "generator" ? colors.yellow : colors.green;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(365, 238, 96, -2.25, -0.45);
  ctx.stroke();
  const aa = -0.45;
  const ax = 365 + 96 * Math.cos(aa);
  const ay = 238 + 96 * Math.sin(aa);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(ax - 15, ay - 3);
  ctx.lineTo(ax - 5, ay + 12);
  ctx.fill();
  label(ctx, mode === "generator" ? "механично въртене" : "въртящ момент", 365, 123, ctx.strokeStyle, 14, "center", 800);
  ctx.restore();

  // Информационен осцилоскоп вдясно.
  roundRect(ctx, 682, 32, 190, 406, 16);
  ctx.fillStyle = "rgba(10,20,33,.86)";
  ctx.fill();
  ctx.strokeStyle = "rgba(158,176,199,.32)";
  ctx.lineWidth = 1.3;
  ctx.stroke();
  pill(ctx, mode === "generator" ? "AC ГЕНЕРАТОР" : "DC ДВИГАТЕЛ", 700, 52, mode === "generator" ? colors.green : colors.yellow);
  label(ctx, mode === "generator" ? "Механична →" : "Електрическа →", 701, 108, colors.muted, 13);
  label(ctx, mode === "generator" ? "електрическа" : "механична", 701, 131, colors.white, 18, "left", 800);

  const signal = mode === "generator" ? Math.sin(angle) : Math.min(0.94, speed / 2.3);
  label(ctx, mode === "generator" ? "Индуцирано ЕДН" : "Обратно ЕДН", 701, 179, colors.muted, 12);
  label(ctx, `${signal >= 0 ? "+" : ""}${signal.toFixed(2)} Emax`, 701, 204, mode === "generator" ? colors.green : colors.yellow, 22, "left", 900);

  const gx = 704;
  const gy = 255;
  const gw = 146;
  const gh = 72;
  ctx.strokeStyle = "rgba(158,176,199,.2)";
  ctx.lineWidth = 1;
  ctx.strokeRect(gx, gy, gw, gh);
  ctx.beginPath();
  ctx.moveTo(gx, gy + gh / 2);
  ctx.lineTo(gx + gw, gy + gh / 2);
  ctx.stroke();
  ctx.strokeStyle = mode === "generator" ? colors.green : colors.yellow;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let i = 0; i <= gw; i++) {
    const x = gx + i;
    const phase = angle - 2.7 + (i / gw) * 5.4;
    const value = mode === "generator" ? Math.sin(phase) : Math.max(0.08, 0.62 + 0.22 * Math.sin(phase * 2));
    const y = gy + gh / 2 - value * (gh * 0.39);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  label(ctx, mode === "generator" ? "синусоидален изход" : "ток след комутация", 777, 344, colors.muted, 11.5, "center", 700);
  label(ctx, `скорост × ${speed.toFixed(2)}`, 701, 383, colors.white, 14, "left", 700);
  label(ctx, mode === "generator" ? "пръстени + четки" : "комутатор + четки", 701, 411, colors.copper, 13, "left", 800);

  label(ctx, "Плъзнете модела, за да смените гледната точка", 28, 472, colors.muted, 12, "left", 650);
  label(ctx, `ъгъл ${(angle * 180 / Math.PI % 360 + 360) % 360 | 0}°`, 650, 472, colors.muted, 12, "right", 650);
}

export default function ElectromagneticMachine3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef(0.55);
  const dragRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const [mode, setMode] = useState<Mode>("motor");
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [yaw, setYaw] = useState(-0.48);
  const [pitch, setPitch] = useState(0.2);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;
    let last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      if (playing) angleRef.current = (angleRef.current + dt * 0.00135 * speed) % (Math.PI * 2);
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      drawScene(ctx, angleRef.current, yaw, pitch, mode, speed);
      if (playing) frame = requestAnimationFrame(render);
    };
    render(last);
    return () => cancelAnimationFrame(frame);
  }, [mode, pitch, playing, speed, yaw]);

  const setAngle = (degrees: number) => {
    angleRef.current = (degrees * Math.PI) / 180;
    setPlaying(false);
    // Предизвиква еднократно прерисуване, без отделно визуално състояние за всеки кадър.
    setYaw((v) => v + 0.000001);
  };

  return (
    <div className="my-6 rounded-[12px] border-[1.5px] border-ink bg-surface p-3 shadow-hard sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("motor")}
          aria-pressed={mode === "motor"}
          className={`rounded-md border-[1.5px] px-3 py-1.5 text-[13px] font-bold transition ${mode === "motor" ? "border-ink bg-hl text-ink shadow-hard-sm" : "border-rule bg-paper text-muted hover:border-ink"}`}
        >
          DC двигател
        </button>
        <button
          type="button"
          onClick={() => setMode("generator")}
          aria-pressed={mode === "generator"}
          className={`rounded-md border-[1.5px] px-3 py-1.5 text-[13px] font-bold transition ${mode === "generator" ? "border-ink bg-hl text-ink shadow-hard-sm" : "border-rule bg-paper text-muted hover:border-ink"}`}
        >
          AC генератор
        </button>
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className="rounded-md border-[1.5px] border-ink bg-ink px-3 py-1.5 text-[13px] font-bold text-white shadow-hard-sm active:translate-x-px active:translate-y-px active:shadow-none"
        >
          {playing ? "Пауза" : "Пусни ▶"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={CW * 2}
        height={CH * 2}
        className="block aspect-[9/5] w-full touch-none rounded-[9px] border border-ink bg-ink"
        role="img"
        aria-label={mode === "motor" ? "Интерактивна триизмерна анимация на електродвигател с ротор, постоянни магнити, комутатор и четки" : "Интерактивна триизмерна анимация на генератор с въртяща се намотка, магнитни полюси, пръстени и четки"}
        onPointerDown={(e) => {
          dragRef.current = { x: e.clientX, y: e.clientY, yaw, pitch };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragRef.current) return;
          setYaw(dragRef.current.yaw + (e.clientX - dragRef.current.x) * 0.008);
          setPitch(Math.max(-0.48, Math.min(0.58, dragRef.current.pitch + (e.clientY - dragRef.current.y) * 0.006)));
        }}
        onPointerUp={(e) => {
          dragRef.current = null;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => { dragRef.current = null; }}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr]">
        <label className="text-[13px] font-medium text-muted">
          <span className="mb-1 flex justify-between gap-3">
            <span>Скорост на въртене</span>
            <strong className="text-ink">× {speed.toFixed(2)}</strong>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0.25"
            max="2.2"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(+e.target.value)}
          />
        </label>
        <label className="text-[13px] font-medium text-muted">
          <span className="mb-1 flex justify-between gap-3">
            <span>Положение на ротора</span>
            <span className="text-muted">0° — 360°</span>
          </span>
          <input
            className="w-full accent-(--color-minus)"
            type="range"
            min="0"
            max="360"
            step="1"
            defaultValue="32"
            onChange={(e) => setAngle(+e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-px overflow-hidden rounded-[9px] border border-rule bg-rule sm:grid-cols-3">
        <div className="bg-paper px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Какво влиза</p>
          <p className="text-[13.5px] font-bold text-ink">{mode === "motor" ? "електрическа енергия" : "механично въртене"}</p>
        </div>
        <div className="bg-paper px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Ключов детайл</p>
          <p className="text-[13.5px] font-bold text-ink">{mode === "motor" ? "комутаторът обръща тока" : "пръстените извеждат ЕДН"}</p>
        </div>
        <div className="bg-paper px-3 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Какво излиза</p>
          <p className="text-[13.5px] font-bold text-ink">{mode === "motor" ? "въртящ момент" : "променливо напрежение"}</p>
        </div>
      </div>
    </div>
  );
}
