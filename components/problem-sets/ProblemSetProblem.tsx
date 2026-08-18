import type { ReactNode } from "react";
import Formula from "@/components/Formula";
import RichText from "@/components/RichText";

export type ProblemBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "formula"; latex: string }
  | { kind: "list"; items: string[] }
  | { kind: "subheading"; text: string }
  /** Интерактивна фигура вътре в условието или решението. */
  | { kind: "figure"; node: ReactNode; caption?: string };

export interface ProblemSetProblemData {
  number: number;
  title: string;
  tags: string[];
  starred?: boolean;
  statement: ProblemBlock[];
  hint?: ProblemBlock[];
  solution: ProblemBlock[];
}

function Blocks({ blocks }: { blocks: ProblemBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.kind === "formula") {
          return <Formula key={index} latex={block.latex} />;
        }
        if (block.kind === "list") {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-6 text-[15px] leading-relaxed text-ink/90">
              {block.items.map((item) => (
                <li key={item}>
                  <RichText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.kind === "figure") {
          return (
            <figure key={index} className="my-4">
              {block.node}
              {block.caption && (
                <figcaption className="mt-2 text-[13.5px] leading-relaxed text-muted">
                  <RichText text={block.caption} />
                </figcaption>
              )}
            </figure>
          );
        }
        if (block.kind === "subheading") {
          return (
            <h4 key={index} className="pt-1 font-serif text-[18px] font-bold text-ink">
              {block.text}
            </h4>
          );
        }
        return (
          <p key={index} className="text-[15.5px] leading-relaxed text-ink/90">
            <RichText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

export default function ProblemSetProblem({ problem }: { problem: ProblemSetProblemData }) {
  return (
    <article
      id={`zadacha-${problem.number}`}
      className="scroll-mt-20 rounded-[12px] border-[1.5px] border-ink bg-surface shadow-hard"
    >
      <header className="border-b-[1.5px] border-ink px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-minus">
            Задача {problem.number}
            {problem.starred ? " ★" : ""}
          </span>
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-rule bg-hl px-2.5 py-0.5 text-[10.5px] font-semibold text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-1.5 font-serif text-[22px] font-bold leading-tight text-ink">
          {problem.title}
        </h3>
      </header>

      <div className="px-5 py-5">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted">Условие</p>
        <Blocks blocks={problem.statement} />

        {problem.hint && (
          <details className="group mt-5 rounded-[9px] border border-rule bg-hl px-4 py-3 open:border-ink">
            <summary className="cursor-pointer font-semibold text-ink">
              <span className="group-open:hidden">Покажи указание</span>
              <span className="hidden group-open:inline">Скрий указанието</span>
            </summary>
            <div className="mt-3 border-t border-rule pt-3">
              <Blocks blocks={problem.hint} />
            </div>
          </details>
        )}

        <details className="group mt-3 rounded-[9px] border-[1.5px] border-ink bg-surface px-4 py-3 open:shadow-hard-sm">
          <summary className="cursor-pointer font-bold text-minus">
            <span className="group-open:hidden">Покажи решението</span>
            <span className="hidden group-open:inline">Скрий решението</span>
          </summary>
          <div className="mt-4 border-t border-rule pt-4">
            <Blocks blocks={problem.solution} />
          </div>
        </details>
      </div>
    </article>
  );
}
