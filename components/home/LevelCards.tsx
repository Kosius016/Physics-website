import Link from "next/link";
import {
  getLessonCount,
  getSubjectLessonCount,
  type Level,
  type Subject,
} from "@/lib/courseMaps";

const SUBJECT_CARDS: readonly {
  subject: Subject;
  levels: readonly { level: Level; meta: string }[];
}[] = [
  {
    subject: "Физика",
    levels: [
      { level: "11. клас", meta: "Механика" },
      { level: "12. клас", meta: "От есента" },
      { level: "Университетско", meta: "Електромагнетизъм" },
    ],
  },
  {
    subject: "Математика",
    levels: [
      { level: "11. клас", meta: "От есента" },
      { level: "12. клас", meta: "От есента" },
      { level: "Университетско", meta: "Линейна алгебра, анализ" },
    ],
  },
];

function countLabel(count: number) {
  return count === 1 ? "1 урок" : `${count} урока`;
}

function levelLabel(level: Level) {
  return level === "Университетско" ? "Университет" : level;
}

function levelHref(subject: Subject, level: Level) {
  const subjectParam = subject === "Математика" ? "math" : "physics";
  const levelParam = level === "11. клас" ? "11" : level === "12. клас" ? "12" : "university";
  return `/physics?subject=${subjectParam}&level=${levelParam}`;
}

export default function LevelCards() {
  return (
    <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2">
      {SUBJECT_CARDS.map(({ subject, levels }) => {
        const total = getSubjectLessonCount(subject);
        return (
          <article
            key={subject}
            className="overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard"
          >
            <div className="flex items-baseline justify-between gap-3 border-b-[1.5px] border-ink px-[18px] py-3">
              <h3 className="font-serif text-[20px] font-bold text-ink">{subject}</h3>
              <span className="text-[12.5px] text-muted">{countLabel(total)}</span>
            </div>
            <div>
              {levels.map(({ level, meta }, index) => {
                const count = getLessonCount(subject, level);
                const rowClass = `flex flex-wrap items-baseline gap-x-3.5 gap-y-1 px-[18px] py-3 ${
                  index < levels.length - 1 ? "border-b-[1.5px] border-rule" : ""
                }`;
                const content = (
                  <>
                    <span className={`min-w-[132px] text-[15.5px] font-semibold ${count ? "text-ink" : "text-muted"}`}>
                      {levelLabel(level)}
                    </span>
                    <span className="min-w-[110px] flex-1 text-[13.5px] text-muted">{meta}</span>
                    {count ? (
                      <span className="whitespace-nowrap text-[13px] tabular-nums text-muted">
                        {countLabel(count)}
                      </span>
                    ) : (
                      <span className="rounded-full border-[1.5px] border-rule px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.06em] text-muted">
                        Скоро
                      </span>
                    )}
                  </>
                );

                return count ? (
                  <Link
                    key={level}
                    href={levelHref(subject, level)}
                    className={`${rowClass} transition-colors hover:bg-hl`}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={level} className={rowClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </div>
  );
}
