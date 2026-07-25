"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS: readonly { label: string; href?: string }[] = [
  { label: "Уроци", href: "/physics" },
  { label: "Задачи", href: "/zadachi" },
  { label: "Материали" },
  { label: "Симулации" },
  { label: "Практикум", href: "/praktikum" },
  { label: "Статии", href: "/statii" },
];

/** Горна навигационна лента: лого вляво, табове за тип съдържание вдясно. */
export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 px-5">
        <Link href="/physics" className="py-4 text-[18px] font-extrabold tracking-tight text-ink">
          STEM <span className="text-plus">Платформа</span>
        </Link>
        <nav className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((tab) => {
            const active =
              tab.href === "/physics"
                ? !pathname.startsWith("/praktikum") &&
                  !pathname.startsWith("/statii") &&
                  !pathname.startsWith("/zadachi")
                : tab.href
                  ? pathname.startsWith(tab.href)
                  : false;
            return tab.href ? (
              <Link
                key={tab.label}
                href={tab.href}
                className={
                  active
                    ? "-mb-0.5 whitespace-nowrap border-b-[3px] border-plus px-3 py-4 text-[15px] font-bold text-ink"
                    : "-mb-0.5 whitespace-nowrap border-b-[3px] border-transparent px-3 py-4 text-[15px] font-semibold text-muted transition-colors hover:text-ink"
                }
              >
                {tab.label}
              </Link>
            ) : (
              <span
                key={tab.label}
                className="-mb-0.5 cursor-default whitespace-nowrap border-b-[3px] border-transparent px-3 py-4 text-[15px] text-muted"
                title="Секцията се подготвя"
              >
                {tab.label}
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
