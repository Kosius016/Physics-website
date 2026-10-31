import { Children, type ReactNode } from "react";

/**
 * Градивните блокове на изводите в университетските уроци.
 *
 * Редът е един и същ през целия раздел: <Derive> показва как се получава
 * връзката, <Formula> е резултатът, <Meaning> казва какво ни дава на практика,
 * <Check> я сверява с идеалния газ или с газа на Ван дер Ваалс. Така ученикът
 * разпознава структурата и знае къде да търси какво.
 */

export function Derive({ title = "Извод", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-6 border-l-[3px] border-minus pl-5">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-minus">{title}</p>
      <div className="space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export function Meaning({
  title = "Физичен смисъл",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="my-6 rounded-[10px] border-[1.5px] border-hl-rule bg-hl px-5 py-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-warn">{title}</p>
      <div className="space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export function Check({ title = "Проверка", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-6 rounded-[10px] border-l-4 border-ok bg-ok/10 px-5 py-4">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.15em] text-ok">{title}</p>
      <div className="space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

/** Номерирани стъпки с жълто кръгче - същият знак като в решенията на задачите. */
export function Steps({ start = 1, children }: { start?: number; children: ReactNode }) {
  return (
    <ol className="my-3 space-y-4">
      {Children.map(children, (child, index) => (
        <li className="grid grid-cols-[1.9rem_1fr] gap-3">
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-ink bg-hl text-[12.5px] font-bold text-ink"
          >
            {start + index}
          </span>
          <div className="min-w-0 space-y-3">{child}</div>
        </li>
      ))}
    </ol>
  );
}
