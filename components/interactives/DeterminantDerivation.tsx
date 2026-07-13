import { Arrow, C, STAGE_BG, STAGE_CLASS } from "./svg";

/**
 * Геометрично извеждане на det в 2D с конкретни числа.
 * Срязването y' = y - x/3 изправя u=(3,1), без да променя площта.
 */
export default function DeterminantDerivation() {
  const grid = Array.from({ length: 13 }, (_, i) => i * 25);

  return (
    <div className="rounded-xl border-[1.5px] border-ink bg-surface p-4 shadow-hard">
      <svg viewBox="0 0 640 300" className={STAGE_CLASS + " select-none"} role="img" aria-label="Успоредник преди и след срязване, което запазва площта">
        <rect width="640" height="300" fill={STAGE_BG} />
        <g stroke="rgba(242,239,245,.075)" strokeWidth="1">
          {grid.map((v) => <line key={`v-${v}`} x1={v} y1="0" x2={v} y2="300" />)}
          {grid.map((v) => <line key={`h-${v}`} x1="0" y1={v} x2="640" y2={v} />)}
        </g>

        <text x="26" y="30" fill={C.mut} fontSize="13" fontWeight="700">ПРЕДИ: u = (3,1), v = (1,2)</text>
        <polygon points="90,220 195,185 230,115 125,150" fill="rgba(255,211,77,.18)" stroke={C.warn} strokeWidth="2.2" />
        <Arrow x1={90} y1={220} x2={195} y2={185} color={C.plus} label="u" labelDx={8} labelDy={2} />
        <Arrow x1={90} y1={220} x2={125} y2={150} color={C.ok} label="v" labelDx={8} labelDy={-4} />
        <text x="157" y="250" fill={C.mut} fontSize="12.5" textAnchor="middle">наклонен успоредник</text>

        <Arrow x1={270} y1={150} x2={350} y2={150} color={C.minus} width={2.2} />
        <text x="310" y="126" fill={C.minus} fontSize="12.5" fontWeight="700" textAnchor="middle">срязване</text>
        <text x="310" y="174" fill={C.mut} fontSize="11.5" textAnchor="middle">площта не се мени</text>

        <text x="370" y="30" fill={C.mut} fontSize="13" fontWeight="700">СЛЕД: u′ = (3,0), v′ = (1,5/3)</text>
        <polygon points="380,220 485,220 520,162 415,162" fill="rgba(255,211,77,.18)" stroke={C.warn} strokeWidth="2.2" />
        <Arrow x1={380} y1={220} x2={485} y2={220} color={C.plus} label="u′" labelDx={8} labelDy={-8} />
        <Arrow x1={380} y1={220} x2={415} y2={162} color={C.ok} label="v′" labelDx={8} labelDy={-5} />
        <line x1="415" y1="162" x2="415" y2="220" stroke={C.faint} strokeWidth="1.5" strokeDasharray="5 4" />
        <text x="431" y="194" fill={C.mut} fontSize="12">h = 5/3</text>
        <line x1="380" y1="240" x2="485" y2="240" stroke={C.faint} strokeWidth="1.4" />
        <text x="432" y="258" fill={C.mut} fontSize="12" textAnchor="middle">основа = 3</text>
        <text x="450" y="286" fill={C.warn} fontSize="14" fontWeight="700" textAnchor="middle">S = 3 · 5/3 = 5</text>
      </svg>
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
        Конкретният пример показва механизма: срязването изправя първата колона, но запазва площта.
        Общото извеждане отдолу прави същото с буквите <strong className="text-ink">a, b, c, d</strong>.
      </p>
    </div>
  );
}
