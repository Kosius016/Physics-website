import type { ReactNode } from "react";

export function LabPart({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-7">
      <h3 className="mb-3 flex items-center gap-2 font-serif text-[21px] font-bold text-ink">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink bg-hl font-sans text-[12px] font-bold">
          {number}
        </span>
        {title}
      </h3>
      <div className="space-y-3 text-[15px] leading-relaxed text-ink">{children}</div>
    </section>
  );
}

export function AsciiSchematic({ children }: { children: string }) {
  return (
    <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-ink p-4 shadow-hard-sm">
      <pre className="min-w-[34rem] whitespace-pre font-mono text-[13px] leading-6 text-white">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function ConnectionTable({
  rows,
}: {
  rows: readonly (readonly [string, string])[];
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink shadow-hard-sm">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[14px]">
        <thead className="bg-ink text-white">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">Извод на компонента</th>
            <th scope="col" className="px-3 py-2 font-semibold">Свържете към</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([lead, destination], index) => (
            <tr key={`${lead}-${destination}`} className={index % 2 === 0 ? "bg-surface" : "bg-paper"}>
              <td className="border-t border-rule px-3 py-2.5 font-semibold text-ink">{lead}</td>
              <td className="border-t border-rule px-3 py-2.5 text-muted">{destination}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CodeBlock({
  title,
  language,
  code,
}: {
  title: string;
  language: string;
  code: string;
}) {
  return (
    <details className="group overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-minus">
        <span>{title}</span>
        <span className="rounded border border-rule bg-paper px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-muted">
          {language}
        </span>
      </summary>
      <div className="border-t-[1.5px] border-ink bg-ink p-4">
        <pre className="max-h-[34rem] overflow-auto whitespace-pre font-mono text-[12.5px] leading-5 text-white">
          <code>{code}</code>
        </pre>
      </div>
    </details>
  );
}

export function SafetyBox({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-plus bg-plus/10 px-4 py-3 text-[14.5px] leading-relaxed text-ink">
      {children}
    </div>
  );
}
