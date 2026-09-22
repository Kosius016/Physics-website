import RichText from "@/components/RichText";
import SvgTex from "@/components/interactives/SvgTex";
import { Arrow, C, DRAWING_FONT_FAMILY, STAGE_BG, STAGE_CLASS } from "@/components/interactives/svg";

/** Reference directions only. The sign of each current is found in the solution. */
export default function KirchhoffReviewFigure() {
  return (
    <figure className="my-5 w-full min-w-0">
      <div className="overflow-x-auto rounded-[10px]">
        <svg
          viewBox="0 0 560 400"
          role="img"
          aria-label="Верига с два възела и три успоредни клона. Ляво: резистор R1 и източник E1. Среда: резистор R3. Дясно: резистор R2 и източник E2. Двата източника са с плюс нагоре. Избраните посоки на I1 и I2 са нагоре, а на I3 надолу."
          className={`${STAGE_CLASS} min-w-[460px]`}
          style={{ background: STAGE_BG, fontFamily: DRAWING_FONT_FAMILY }}
        >
          <g stroke={C.wire} strokeWidth={2.5} fill="none" strokeLinecap="round">
            <path d="M90 50 H470 M90 350 H470" />
            <path d="M90 50 V85 M90 135 V230 M90 250 V350" />
            <path d="M470 50 V85 M470 135 V230 M470 250 V350" />
            <path d="M280 50 V175 M280 225 V350" />
            <rect x={77} y={85} width={26} height={50} rx={2} />
            <rect x={457} y={85} width={26} height={50} rx={2} />
            <rect x={267} y={175} width={26} height={50} rx={2} />
          </g>
          {[90, 470].map((x) => (
            <g key={x}>
              <line x1={x - 20} y1={230} x2={x + 20} y2={230} stroke={C.warn} strokeWidth={3} />
              <line x1={x - 10} y1={250} x2={x + 10} y2={250} stroke={C.warn} strokeWidth={3} />
              <SvgTex x={x === 90 ? x + 32 : x - 32} y={223} tex="+" color={C.warn} width={22} anchor="middle" />
              <SvgTex x={x === 90 ? x + 32 : x - 32} y={253} tex="-" color={C.warn} width={22} anchor="middle" />
            </g>
          ))}
          <circle cx={280} cy={50} r={5} fill={C.wire} />
          <circle cx={280} cy={350} r={5} fill={C.wire} />
          <SvgTex x={280} y={26} tex="1" color={C.wire} width={24} anchor="middle" fontSize={17} />
          <SvgTex x={280} y={376} tex="2" color={C.wire} width={24} anchor="middle" fontSize={17} />
          <SvgTex x={48} y={110} tex="R_1" color={C.wire} width={48} anchor="middle" fontSize={17} />
          <SvgTex x={512} y={110} tex="R_2" color={C.wire} width={48} anchor="middle" fontSize={17} />
          <SvgTex x={329} y={200} tex="R_3" color={C.wire} width={48} anchor="middle" fontSize={17} />
          <SvgTex x={45} y={240} tex={String.raw`\mathcal E_1`} color={C.warn} width={50} anchor="middle" fontSize={17} />
          <SvgTex x={515} y={240} tex={String.raw`\mathcal E_2`} color={C.warn} width={50} anchor="middle" fontSize={17} />
          <Arrow x1={126} y1={192} x2={126} y2={151} color={C.minus} />
          <Arrow x1={434} y1={192} x2={434} y2={151} color={C.minus} />
          <Arrow x1={243} y1={144} x2={243} y2={185} color={C.minus} />
          <SvgTex x={153} y={171} tex="I_1" color={C.minus} width={40} anchor="middle" fontSize={17} />
          <SvgTex x={407} y={171} tex="I_2" color={C.minus} width={40} anchor="middle" fontSize={17} />
          <SvgTex x={216} y={164} tex="I_3" color={C.minus} width={40} anchor="middle" fontSize={17} />
        </svg>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-rule bg-rule sm:grid-cols-3">
        {[
          ["Ляв източник", String.raw`$\mathcal E_1=12\,\mathrm V$`],
          ["Десен източник", String.raw`$\mathcal E_2=4\,\mathrm V$`],
          ["Ляв резистор", String.raw`$R_1=2\,\Omega$`],
          ["Десен резистор", String.raw`$R_2=4\,\Omega$`],
          ["Среден резистор", String.raw`$R_3=4\,\Omega$`],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 bg-surface px-3 py-2.5">
            <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="mt-1 text-[15px] font-semibold text-ink"><RichText text={value} /></dd>
          </div>
        ))}
      </dl>
      <figcaption className="mt-3 text-[14px] leading-relaxed text-muted">
        Сините стрелки задават избраните положителни посоки. Дългата черта на всеки източник
        е положителният му полюс. При отрицателен ток действителната посока е обратна на стрелката.
      </figcaption>
    </figure>
  );
}
