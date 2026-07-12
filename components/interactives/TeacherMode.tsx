"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Режим преподавател: глобален превключвател за методическите бележки.
 * Изключен (по подразбиране) — страницата е чист учебник за ученици.
 * Включен — <TeacherNote> блоковете (чести грешки, диагностични въпроси,
 * идеи за водене) се показват. Преизползваем за всички бъдещи глави.
 */

const TeacherModeContext = createContext<{ on: boolean; toggle: () => void }>({
  on: false,
  toggle: () => {},
});

export function TeacherModeProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  return (
    <TeacherModeContext.Provider value={{ on, toggle: () => setOn((o) => !o) }}>
      {children}
    </TeacherModeContext.Provider>
  );
}

export function useTeacherMode() {
  return useContext(TeacherModeContext);
}

/** Малък pill-бутон за навигационната лента. */
export function TeacherModeToggle() {
  const { on, toggle } = useTeacherMode();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title="Показва методически бележки за преподавателя"
      className={
        on
          ? "shrink-0 cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3 py-1 text-[12.5px] font-bold text-white"
          : "shrink-0 cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-3 py-1 text-[12.5px] font-semibold text-ink transition-colors hover:bg-hl"
      }
    >
      <span className="sm:hidden">{on ? "✓ Учител" : "Учител"}</span>
      <span className="hidden sm:inline">{on ? "✓ Режим преподавател" : "Режим преподавател"}</span>
    </button>
  );
}

/** Методическа бележка — вижда се само в режим преподавател. */
export function TeacherNote({
  title = "Методически бележки",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const { on } = useTeacherMode();
  if (!on) return null;
  return (
    <div className="mt-4 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 animate-rise">
      <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-plus">{title}</p>
      <div className="text-[15px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}
