"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type NavSubject = "Физика" | "Математика";
type NavLevel = "11" | "12" | "university";

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

function catalogHref(subject: NavSubject, level: NavLevel) {
  const subjectParam = subject === "Математика" ? "math" : "physics";
  return `/physics?subject=${subjectParam}&level=${level}`;
}

function subjectFromRoute(pathname: string, subjectParam: string | null): NavSubject | null {
  if (pathname.startsWith("/math")) return "Математика";
  if (pathname.startsWith("/physics")) {
    return subjectParam === "math" ? "Математика" : "Физика";
  }
  return null;
}

function levelFromRoute(pathname: string, levelParam: string | null): NavLevel | null {
  if (pathname === "/physics") {
    if (levelParam === "11" || levelParam === "12" || levelParam === "university") {
      return levelParam;
    }
    return "11";
  }
  if (pathname.startsWith("/physics/kinematika")) return "11";
  if (pathname.startsWith("/physics") || pathname.startsWith("/math")) return "university";
  return null;
}

interface TopNavViewProps {
  pathname: string;
  subjectOpen: boolean;
  activeSubject: NavSubject | null;
  activeLevel: NavLevel;
  onToggleSubject: () => void;
  onPickSubject: (subject: NavSubject) => void;
  onPickLevel: (level: NavLevel) => void;
  onLeaveLearning: () => void;
}

function TopNavView({
  pathname,
  subjectOpen,
  activeSubject,
  activeLevel,
  onToggleSubject,
  onPickSubject,
  onPickLevel,
  onLeaveLearning,
}: TopNavViewProps) {
  const lessonsActive = subjectOpen || activeSubject !== null;
  const materialsActive =
    pathname.startsWith("/materiali") ||
    pathname.startsWith("/zadachi") ||
    pathname.startsWith("/praktikum");
  const articlesActive = pathname.startsWith("/statii");

  const navItem =
    "-mb-0.5 whitespace-nowrap border-b-[3px] px-1.5 py-3 text-[13.5px] font-semibold transition-colors sm:px-3 sm:py-4 sm:text-[15px]";
  const activeNavItem = "border-plus text-ink";
  const idleNavItem = "border-transparent text-muted hover:text-ink";

  return (
    <header className="border-b-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-[1040px] flex-wrap items-center gap-x-4 px-5 lg:flex-nowrap lg:gap-x-7">
        <Link
          href="/"
          aria-label="SingularityLab - начало"
          onClick={onLeaveLearning}
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
          <button
            type="button"
            aria-expanded={subjectOpen}
            aria-controls="subject-panel"
            onClick={onToggleSubject}
            className={`${navItem} flex cursor-pointer items-center gap-1.5 bg-transparent ${lessonsActive ? activeNavItem : idleNavItem}`}
          >
            Уроци
            <Caret open={subjectOpen} />
          </button>
          <Link
            href="/materiali"
            onClick={onLeaveLearning}
            className={`${navItem} ${materialsActive ? activeNavItem : idleNavItem}`}
          >
            Материали
          </Link>
          <Link
            href="/statii"
            onClick={onLeaveLearning}
            className={`${navItem} ${articlesActive ? activeNavItem : idleNavItem}`}
          >
            Статии
          </Link>
          <Link
            href="/#za-proekta"
            onClick={onLeaveLearning}
            className={`${navItem} ${idleNavItem}`}
          >
            За проекта
          </Link>
        </nav>

        <Link
          href="/#podkrepi"
          onClick={onLeaveLearning}
          className="order-2 ml-auto whitespace-nowrap rounded-[9px] border-[1.5px] border-ink bg-hl px-3.5 py-2 text-[13.5px] font-bold text-ink transition-colors hover:bg-surface lg:order-3 lg:text-[14px]"
        >
          Подкрепи
        </Link>
      </div>

      <div
        id="subject-panel"
        hidden={!subjectOpen}
        className="border-t-[1.5px] border-rule bg-paper"
      >
        <div className="mx-auto flex max-w-[1040px] items-center gap-3 px-5 py-2.5">
          <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            Материя
          </span>
          {(["Физика", "Математика"] as const).map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => onPickSubject(subject)}
              className="cursor-pointer whitespace-nowrap rounded-full border-[1.5px] border-ink bg-surface px-4 py-1.5 text-[14px] font-semibold text-ink transition-colors hover:bg-hl sm:text-[14.5px]"
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      {activeSubject ? (
        <div className="overflow-x-auto border-t-[1.5px] border-ink bg-hl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max min-w-full max-w-[1040px] items-center px-5">
            <button
              type="button"
              onClick={onToggleSubject}
              className="mr-1.5 flex cursor-pointer items-center gap-1.5 whitespace-nowrap border-r-[1.5px] border-hl-rule bg-transparent py-2.5 pr-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:text-plus"
            >
              {activeSubject}
              <Caret small />
            </button>
            {LEVELS.map((level) => {
              const active = activeLevel === level.value;
              return (
                <Link
                  key={level.value}
                  href={catalogHref(activeSubject, level.value)}
                  aria-current={active ? "page" : undefined}
                  onClick={() => onPickLevel(level.value)}
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
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [chosenSubject, setChosenSubject] = useState<NavSubject | null>(null);
  const [chosenLevel, setChosenLevel] = useState<NavLevel>("university");

  const routeSubject = subjectFromRoute(pathname, searchParams.get("subject"));
  const routeLevel = levelFromRoute(pathname, searchParams.get("level"));
  const learningSurface =
    pathname === "/" || pathname.startsWith("/physics") || pathname.startsWith("/math");
  const activeSubject = learningSurface ? chosenSubject ?? routeSubject : null;
  const activeLevel = chosenSubject ? chosenLevel : routeLevel ?? chosenLevel;

  function pickSubject(subject: NavSubject) {
    setChosenSubject(subject);
    setChosenLevel("university");
    setSubjectOpen(false);
  }

  function leaveLearning() {
    setChosenSubject(null);
    setSubjectOpen(false);
  }

  return (
    <TopNavView
      pathname={pathname}
      subjectOpen={subjectOpen}
      activeSubject={activeSubject}
      activeLevel={activeLevel}
      onToggleSubject={() => setSubjectOpen((open) => !open)}
      onPickSubject={pickSubject}
      onPickLevel={setChosenLevel}
      onLeaveLearning={leaveLearning}
    />
  );
}

export default function TopNav() {
  return (
    <Suspense
      fallback={
        <TopNavView
          pathname="/"
          subjectOpen={false}
          activeSubject={null}
          activeLevel="university"
          onToggleSubject={noop}
          onPickSubject={noop}
          onPickLevel={noop}
          onLeaveLearning={noop}
        />
      }
    >
      <TopNavInteractive />
    </Suspense>
  );
}
