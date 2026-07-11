/**
 * Лепкава навигация с котви към секциите на урок/глава.
 * Извадена като споделен компонент (LessonRenderer + самостоятелните глави);
 * `right` е опционален слот в десния край (напр. превключвател за режим).
 */
export interface LessonNavItem {
  id: string;
  n: string;
  label: string;
}

export default function LessonNav({
  items,
  right,
}: {
  items: readonly LessonNavItem[];
  right?: React.ReactNode;
}) {
  return (
    <nav className="sticky top-0 z-10 -mx-5 mt-4 border-y-[1.5px] border-rule bg-paper/95 px-5 backdrop-blur">
      <div className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13.5px] font-medium text-muted transition-colors hover:bg-hl hover:text-ink"
          >
            <span className="mr-1 text-[11.5px] text-rule">{s.n}</span>
            {s.label}
          </a>
        ))}
        {right && <div className="ml-auto shrink-0 pl-2">{right}</div>}
      </div>
    </nav>
  );
}
