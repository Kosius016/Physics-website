"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type NavSurface = "lessons" | "materials";
type NavSubject = "Физика" | "Математика";
type NavLevel = "11" | "12" | "university";
type MaterialType = "pregovor" | "zadachi" | "praktikum";

const SUBJECTS: readonly NavSubject[] = ["Физика", "Математика"];
const LEVELS: readonly { label: string; value: NavLevel }[] = [
  { label: "11. клас", value: "11" },
  { label: "12. клас", value: "12" },
  { label: "Университет", value: "university" },
];

const noop = () => {};

function Caret({ open = false, small = false }: { open?: boolean; small?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width={small ? 9 : 10}
      height={small ? 6 : 7}
      viewBox="0 0 10 7"
      fill="none"
      className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M1 1.5 5 5.5 9 1.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThreadMarks({ current, targeted }: { current: boolean; targeted: boolean }) {
  return (
    <>
      {current ? (
        <span aria-hidden="true" className="absolute inset-x-1.5 bottom-0 h-[3px] bg-plus" />
      ) : null}
      {targeted ? (
        <span
          aria-hidden="true"
          className={`absolute inset-x-1.5 h-[1.5px] bg-minus ${current ? "bottom-[4px]" : "bottom-0"}`}
        />
      ) : null}
    </>
  );
}

function subjectParam(subject: NavSubject) {
  return subject === "Математика" ? "math" : "physics";
}

function lessonHref(subject: NavSubject, level: NavLevel) {
  return `/physics?subject=${subjectParam(subject)}&level=${level}`;
}

function materialHref(
  subject: NavSubject,
  level: NavLevel,
  materialType: MaterialType | null,
) {
  const params = new URLSearchParams({ subject: subjectParam(subject), level });
  if (materialType) params.set("type", materialType);
  return `/materiali?${params.toString()}`;
}

function surfaceFromRoute(pathname: string): NavSurface | null {
  if (pathname.startsWith("/physics") || pathname.startsWith("/math")) return "lessons";
  if (
    pathname.startsWith("/materiali") ||
    pathname.startsWith("/zadachi") ||
    pathname.startsWith("/praktikum")
  ) {
    return "materials";
  }
  return null;
}

function levelFromParam(level: string | null): NavLevel | null {
  return level === "11" || level === "12" || level === "university" ? level : null;
}

function lessonSubject(pathname: string, subject: string | null): NavSubject {
  if (pathname.startsWith("/math") || subject === "math") return "Математика";
  return "Физика";
}

function lessonLevel(pathname: string, level: string | null): NavLevel {
  const queryLevel = levelFromParam(level);
  if (pathname === "/physics" && queryLevel) return queryLevel;
  if (pathname.startsWith("/physics/kinematika")) return "11";
  if (pathname === "/physics") return "11";
  return "university";
}

function materialSubject(pathname: string, subject: string | null): NavSubject {
  if (
    pathname.startsWith("/zadachi/redove-na-teylar") ||
    pathname.startsWith("/zadachi/lineina-algebra-tazhdestva") ||
    subject === "math"
  ) {
    return "Математика";
  }
  return "Физика";
}

function materialTypeFromRoute(pathname: string, type: string | null): MaterialType | null {
  if (pathname.startsWith("/zadachi")) return "zadachi";
  if (pathname.startsWith("/praktikum")) return "praktikum";
  if (pathname !== "/materiali" && pathname.startsWith("/materiali")) return "pregovor";
  return type === "pregovor" || type === "zadachi" || type === "praktikum" ? type : null;
}

interface TopNavViewProps {
  pathname: string;
  currentSurface: NavSurface | null;
  openMenu: NavSurface | null;
  activeSubject: NavSubject;
  activeLevel: NavLevel;
  materialType: MaterialType | null;
  onToggleMenu: (surface: NavSurface) => void;
  onCloseMenu: () => void;
}

function TopNavView({
  pathname,
  currentSurface,
  openMenu,
  activeSubject,
  activeLevel,
  materialType,
  onToggleMenu,
  onCloseMenu,
}: TopNavViewProps) {
  const articlesCurrent = pathname.startsWith("/statii");
  const menuLevel = currentSurface ? activeLevel : "university";
  const navItem =
    "relative -mb-0.5 whitespace-nowrap px-1.5 py-3 text-[13.5px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-minus sm:px-3 sm:py-4 sm:text-[15px]";
  const currentText = "font-bold text-ink";
  const idleText = "text-muted hover:text-ink";

  function menuHref(surface: NavSurface, subject: NavSubject) {
    return surface === "lessons"
      ? lessonHref(subject, menuLevel)
      : materialHref(subject, menuLevel, materialType);
  }

  function levelHref(level: NavLevel) {
    return currentSurface === "lessons"
      ? lessonHref(activeSubject, level)
      : materialHref(activeSubject, level, materialType);
  }

  return (
    <header className="border-b-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center gap-x-4 px-5 lg:flex-nowrap lg:gap-x-7">
        <Link
          href="/"
          aria-label="SingularityLab - начало"
          onClick={onCloseMenu}
          className="order-1 mr-auto flex items-center gap-2.5 py-3.5 text-ink"
        >
          <Image src="/brand/mark-ink.svg" width={24} height={24} alt="" aria-hidden="true" />
          <span className="font-brand text-[18px] font-extrabold tracking-[-0.02em]">
            Singularity<span className="text-plus">Lab</span>
          </span>
        </Link>

        <nav
          aria-label="Основна навигация"
          className="order-3 flex w-full min-w-0 justify-between overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-2 lg:w-auto lg:flex-1 lg:justify-start"
        >
          {(["lessons", "materials"] as const).map((surface) => {
            const label = surface === "lessons" ? "Уроци" : "Материали";
            const current = currentSurface === surface;
            const targeted = openMenu === surface;
            return (
              <button
                key={surface}
                type="button"
                aria-expanded={targeted}
                aria-controls="subject-panel"
                onClick={() => onToggleMenu(surface)}
                className={`${navItem} flex cursor-pointer items-center gap-1.5 bg-transparent ${
                  current ? currentText : idleText
                }`}
              >
                {label}
                <Caret open={targeted} />
                <ThreadMarks current={current} targeted={targeted} />
              </button>
            );
          })}

          <Link
            href="/statii"
            onClick={onCloseMenu}
            className={`${navItem} ${articlesCurrent ? currentText : idleText}`}
          >
            Статии
            <ThreadMarks current={articlesCurrent} targeted={false} />
          </Link>
          <Link href="/#za-proekta" onClick={onCloseMenu} className={`${navItem} ${idleText}`}>
            За проекта
          </Link>
        </nav>

        <Link
          href="/#podkrepi"
          onClick={onCloseMenu}
          className="order-2 ml-auto whitespace-nowrap rounded-[9px] border-[1.5px] border-ink bg-hl px-3.5 py-2 text-[13.5px] font-bold text-ink transition-colors hover:bg-surface lg:order-3 lg:text-[14px]"
        >
          Подкрепи
        </Link>
      </div>

      <div id="subject-panel" hidden={!openMenu} className="border-t-[1.5px] border-rule bg-paper">
        <div className="mx-auto flex max-w-[1040px] items-center gap-3 px-5 py-2.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Предмет
          </span>
          {openMenu
            ? SUBJECTS.map((subject) => {
                const selected = currentSurface === openMenu && activeSubject === subject;
                return (
                  <Link
                    key={subject}
                    href={menuHref(openMenu, subject)}
                    aria-current={selected ? "page" : undefined}
                    onClick={onCloseMenu}
                    className={
                      selected
                        ? "whitespace-nowrap rounded-full border-[1.5px] border-ink bg-ink px-4 py-1.5 text-[14px] font-bold text-white shadow-hard-sm sm:text-[14.5px]"
                        : "whitespace-nowrap rounded-full border-[1.5px] border-ink bg-surface px-4 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:bg-hl sm:text-[14.5px]"
                    }
                  >
                    {subject}
                  </Link>
                );
              })
            : null}
        </div>
      </div>

      {currentSurface ? (
        <div className="overflow-x-auto border-t-[1.5px] border-ink bg-hl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full max-w-[1040px] items-center px-5">
            <button
              type="button"
              aria-expanded={openMenu === currentSurface}
              aria-controls="subject-panel"
              onClick={() => onToggleMenu(currentSurface)}
              className="mr-1.5 flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-r-[1.5px] border-hl-rule bg-transparent py-2.5 pr-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-minus"
            >
              {activeSubject}
              <Caret open={openMenu === currentSurface} small />
            </button>
            {LEVELS.map((level) => {
              const active = activeLevel === level.value;
              return (
                <Link
                  key={level.value}
                  href={levelHref(level.value)}
                  aria-current={active ? "page" : undefined}
                  onClick={onCloseMenu}
                  className={`-mb-px whitespace-nowrap border-b-[3px] px-3 py-2.5 text-[14px] transition-colors sm:text-[14.5px] ${
                    active
                      ? "border-plus font-bold text-ink"
                      : "border-transparent font-semibold text-muted hover:text-ink"
                  }`}
                >
                  {level.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function TopNavInteractive() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenu, setOpenMenu] = useState<NavSurface | null>(null);
  const currentSurface = surfaceFromRoute(pathname);
  const activeSubject =
    currentSurface === "materials"
      ? materialSubject(pathname, searchParams.get("subject"))
      : lessonSubject(pathname, searchParams.get("subject"));
  const activeLevel =
    currentSurface === "lessons"
      ? lessonLevel(pathname, searchParams.get("level"))
      : levelFromParam(searchParams.get("level")) ?? "university";
  const materialType = materialTypeFromRoute(pathname, searchParams.get("type"));

  return (
    <TopNavView
      pathname={pathname}
      currentSurface={currentSurface}
      openMenu={openMenu}
      activeSubject={activeSubject}
      activeLevel={activeLevel}
      materialType={materialType}
      onToggleMenu={(surface) => setOpenMenu((open) => (open === surface ? null : surface))}
      onCloseMenu={() => setOpenMenu(null)}
    />
  );
}

export default function TopNav() {
  return (
    <Suspense
      fallback={
        <TopNavView
          pathname="/"
          currentSurface={null}
          openMenu={null}
          activeSubject="Физика"
          activeLevel="university"
          materialType={null}
          onToggleMenu={noop}
          onCloseMenu={noop}
        />
      }
    >
      <TopNavInteractive />
    </Suspense>
  );
}
