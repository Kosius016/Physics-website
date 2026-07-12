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
      <div className="flex items-center py-2">
        <div
          className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Секции в урока"
        >
          <div className="flex w-max items-center gap-1 pr-3">
            {items.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="whitespace-nowrap rounded-md px-2.5 py-1.5 text-[13.5px] font-medium text-muted transition-colors hover:bg-hl hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-minus"
              >
                <span className="mr-1 text-[11.5px] text-rule">{s.n}</span>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        {right && (
          <div className="relative shrink-0 border-l border-rule bg-paper/95 pl-2 before:absolute before:inset-y-0 before:-left-5 before:w-5 before:bg-gradient-to-r before:from-transparent before:to-paper">
            {right}
          </div>
        )}
      </div>
    </nav>
  );
}
