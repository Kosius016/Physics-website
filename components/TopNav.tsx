import Link from "next/link";

const TABS = ["Уроци", "Задачи", "Материали", "Симулации", "Статии"] as const;

/**
 * Горна навигационна лента: лого вляво, табове за тип съдържание вдясно.
 * Засега функционира само "Уроци"; останалите табове са визуални placeholder-и.
 */
export default function TopNav({ active = "Уроци" }: { active?: (typeof TABS)[number] }) {
  return (
    <header className="border-b-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 px-5">
        <Link href="/physics" className="py-4 text-[18px] font-extrabold tracking-tight text-ink">
          STEM <span className="text-plus">Платформа</span>
        </Link>
        <nav className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) =>
            tab === active ? (
              <Link
                key={tab}
                href="/physics"
                className="-mb-0.5 whitespace-nowrap border-b-[3px] border-plus px-3 py-4 text-[15px] font-bold text-ink"
              >
                {tab}
              </Link>
            ) : (
              <span
                key={tab}
                className="-mb-0.5 cursor-default whitespace-nowrap border-b-[3px] border-transparent px-3 py-4 text-[15px] text-muted"
                title="Секцията се подготвя"
              >
                {tab}
              </span>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
