import Link from "next/link";
import RichText from "@/components/RichText";

export default function ProblemSetLinkCard({
  note,
}: {
  note: string;
}) {
  return (
    <aside className="my-6 rounded-[10px] border-[1.5px] border-ink bg-hl px-5 py-4 shadow-hard-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-minus">Problem set 01</p>
      <h3 className="mt-1 font-serif text-[20px] font-bold text-ink">
        Детерминанти и векторни тъждества
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-ink/85"><RichText text={note} /></p>
      <Link
        href="/zadachi/lineina-algebra-tazhdestva"
        className="mt-3 inline-flex rounded-lg border-[1.5px] border-ink bg-ink px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
      >
        Отворете problem set 01
      </Link>
    </aside>
  );
}
