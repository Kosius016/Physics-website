import Link from "next/link";
import { getRecentLessons, type Level } from "@/lib/courseMaps";

function levelLabel(level: Level) {
  return level === "Университетско" ? "университетско" : level;
}

export default function RecentLessons() {
  const lessons = getRecentLessons(3);

  if (lessons.length === 0) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-hl shadow-hard">
      <div className="border-b-[1.5px] border-ink px-[18px] py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ink">
        Последно добавени
      </div>
      {lessons.map((lesson, index) => (
        <Link
          key={lesson.href}
          href={lesson.href}
          className={`flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 px-[18px] py-3 transition-colors hover:bg-surface ${
            index < lessons.length - 1 ? "border-b-[1.5px] border-rule" : ""
          }`}
        >
          <span className="min-w-[220px] flex-1 text-[15.5px] font-semibold leading-snug text-ink">
            {lesson.title}
          </span>
          <span className="text-[13px] text-muted">
            {lesson.subject} · {levelLabel(lesson.level)}
          </span>
        </Link>
      ))}
    </div>
  );
}
