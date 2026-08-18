/**
 * Декоративен фон за картата на материала по електричество и магнетизъм.
 *
 * Композицията е самата червена нишка на материала: радиалното поле на
 * точков заряд срещу кръговото поле около ток. Двете най-разпознаваеми
 * картини в раздела, поставени по диагонала на платното.
 *
 * Чист SVG в палитрата на платформата: остава остър при всякакъв размер и
 * не носи растерна тежест. Чертежът е фон, затова няма етикети и всичко е
 * с ниска непрозрачност, за да не спори с текста върху него.
 */

const INK = "#1b2430";
const E_COLOR = "#c94a3d"; // електрично поле (plus)
const B_COLOR = "#2e6fd8"; // магнитно поле (minus)

/** Точков заряд: център на радиалното поле. */
const Q = { x: 150, y: 140 };
/** Проводник с ток към наблюдателя: център на кръговото поле. */
const W = { x: 492, y: 320 };

const RAY_COUNT = 18;
const RAY_START = 34;
const RAY_END = 162;
const RAY_HEAD = 106;

const B_RADII = [46, 88, 132, 176] as const;

/** Триъгълна връхна стрелка в точка (x,y) с посока `ang` в радиани. */
function head(x: number, y: number, ang: number, s = 7) {
  const c = Math.cos(ang);
  const n = Math.sin(ang);
  const tip = `${x + c * s},${y + n * s}`;
  const a = `${x - c * s * 0.55 - n * s * 0.5},${y - n * s * 0.55 + c * s * 0.5}`;
  const b = `${x - c * s * 0.55 + n * s * 0.5},${y - n * s * 0.55 - c * s * 0.5}`;
  return `${tip} ${a} ${b}`;
}

export default function FieldAtlas({ className = "" }: { className?: string }) {
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => (i * 2 * Math.PI) / RAY_COUNT);

  return (
    <svg
      viewBox="0 0 640 460"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* --- Магнитно поле около ток към наблюдателя --- */}
      <g fill="none">
        {B_RADII.map((r, i) => (
          <circle
            key={r}
            cx={W.x}
            cy={W.y}
            r={r}
            stroke={B_COLOR}
            strokeWidth={1.7}
            strokeOpacity={0.3 - i * 0.045}
          />
        ))}
        {B_RADII.map((r, i) =>
          [-1.15 + i * 0.3, Math.PI - 0.55 + i * 0.3].map((t) => {
            const x = W.x + r * Math.cos(t);
            const y = W.y + r * Math.sin(t);
            // Ток навън от листа: полето обикаля обратно на часовниковата
            // стрелка. В SVG оста y сочи надолу, затова допирателната в тази
            // посока е (sin t, −cos t).
            const dir = Math.atan2(-Math.cos(t), Math.sin(t));
            return (
              <polygon
                key={`${r}-${t}`}
                points={head(x, y, dir, 8)}
                fill={B_COLOR}
                fillOpacity={0.34 - i * 0.045}
              />
            );
          }),
        )}
        <circle cx={W.x} cy={W.y} r={16} stroke={INK} strokeOpacity={0.34} strokeWidth={2} />
        <circle cx={W.x} cy={W.y} r={4} fill={INK} fillOpacity={0.34} />
      </g>

      {/* --- Електрично поле на положителен заряд --- */}
      <g>
        {rays.map((a) => {
          const c = Math.cos(a);
          const n = Math.sin(a);
          return (
            <line
              key={a}
              x1={Q.x + RAY_START * c}
              y1={Q.y + RAY_START * n}
              x2={Q.x + RAY_END * c}
              y2={Q.y + RAY_END * n}
              stroke={E_COLOR}
              strokeOpacity={0.24}
              strokeWidth={1.7}
              strokeLinecap="round"
            />
          );
        })}
        {rays.map((a) => (
          <polygon
            key={`h-${a}`}
            points={head(Q.x + RAY_HEAD * Math.cos(a), Q.y + RAY_HEAD * Math.sin(a), a, 8)}
            fill={E_COLOR}
            fillOpacity={0.3}
          />
        ))}
        <circle
          cx={Q.x}
          cy={Q.y}
          r={22}
          fill="none"
          stroke={E_COLOR}
          strokeOpacity={0.46}
          strokeWidth={2.2}
        />
        <path
          d={`M${Q.x - 9.5} ${Q.y} H${Q.x + 9.5} M${Q.x} ${Q.y - 9.5} V${Q.y + 9.5}`}
          stroke={E_COLOR}
          strokeOpacity={0.46}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
