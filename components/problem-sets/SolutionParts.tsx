import Link from "next/link";
import type { ReactNode } from "react";
import RichText from "@/components/RichText";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import type { RichTextString } from "@/lib/types";

/**
 * Общите градивни части на страниците със задачи: сбито условие, стъпка от
 * решение с жълто кръгче, подчертан резултат и ред с предпоставките.
 *
 * Редът е фиксиран от CLAUDE.md §7: условието е видимо веднага, решението
 * никога не започва разгънато, а стъпките се отключват една по една.
 */

export function ProblemStatement({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">Условие</p>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export function SolutionPart({
  label,
  title,
  children,
}: {
  label: string;
  title: RichTextString;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
      <div
        aria-hidden="true"
        data-solution-step={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink bg-hl text-[13px] font-bold text-ink"
      >
        {label}
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-[20px] font-bold">
          <span className="sr-only">Подточка {label}: </span>
          <RichText text={title} />
        </h3>
        <div className="mt-2 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
      </div>
    </div>
  );
}

export function Solution({ hint, children }: { hint: ReactNode; children: ReactNode }) {
  return <ProgressiveSolution hint={hint}>{children}</ProgressiveSolution>;
}

export function ResultBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] font-semibold">
      {children}
    </div>
  );
}

export interface PrereqLink {
  label: string;
  href: string;
}

/**
 * Ред под условието: кои уроци стоят зад задачата. Целта е ученикът да вижда
 * какво да отвори, преди да опита, вместо да гадае откъде идва нужното.
 */
export function Prereq({
  links,
  note,
}: {
  links?: PrereqLink[];
  note?: RichTextString;
}) {
  return (
    <div className="mt-3 rounded-[10px] border border-rule bg-hl/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {links?.length ? (
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-muted">Стъпва на</span>
        ) : null}
        {links?.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-rule bg-surface px-2.5 py-0.5 text-[12px] font-semibold text-minus hover:border-minus"
          >
            {link.label}
          </Link>
        ))}
      </div>
      {note ? (
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">
          <RichText text={note} />
        </p>
      ) : null}
    </div>
  );
}
