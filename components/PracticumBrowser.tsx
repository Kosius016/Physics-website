"use client";

import { useState } from "react";
import { practicumPreviews, type PracticumDifficulty } from "@/lib/practicum";

function FilterPill({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        active
          ? "cursor-pointer rounded-full border-[1.5px] border-ink bg-ink px-3.5 py-1.5 text-[13px] font-bold text-white shadow-hard-sm"
          : "cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:bg-hl"
      }
    >
      {label}
    </button>
  );
}

export default function PracticumBrowser() {
  const [difficulty, setDifficulty] = useState<PracticumDifficulty | "Всички">("Всички");
  const [equipment, setEquipment] = useState<"Всички" | "Без лабораторно захранване" | "Със захранване">("Всички");

  const visible = practicumPreviews.filter(
    (guide) =>
      (difficulty === "Всички" || guide.difficulty === difficulty) &&
      (equipment === "Всички" || guide.equipment === equipment),
  );

  return (
    <div>
      <div className="grid gap-4 border-y-[1.5px] border-rule py-5 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Трудност</p>
          <div className="flex flex-wrap gap-2">
            {(["Всички", "Начално", "Средно", "Напреднало"] as const).map((value) => (
              <FilterPill key={value} label={value} active={difficulty === value} onClick={() => setDifficulty(value)} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Оборудване</p>
          <div className="flex flex-wrap gap-2">
            {(["Всички", "Без лабораторно захранване", "Със захранване"] as const).map((value) => (
              <FilterPill key={value} label={value} active={equipment === value} onClick={() => setEquipment(value)} />
            ))}
          </div>
        </div>
      </div>

      <section className="pt-9" aria-labelledby="magnetism-practicum">
        <h2 id="magnetism-practicum" className="mb-4 border-b-2 border-ink pb-1.5 font-serif text-[26px] font-bold text-ink">
          <span className="mr-2.5 align-[0.15em] text-[0.62em] tracking-[0.1em] text-muted">§1</span>
          Магнетизъм
        </h2>
        {visible.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((guide) => (
              <article key={guide.id} className="flex min-h-52 flex-col rounded-[10px] border-[1.5px] border-ink bg-surface p-5 shadow-hard">
                <div className="flex flex-wrap gap-2 text-[10.5px] font-bold uppercase tracking-wide text-muted">
                  <span>{guide.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guide.equipment}</span>
                </div>
                <h3 className="mt-3 font-serif text-[21px] font-bold leading-tight text-ink">{guide.title}</h3>
                <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{guide.summary}</p>
                <span className="mt-4 w-fit rounded-full border-[1.5px] border-rule px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">
                  Очаква оборудването
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[10px] border-[1.5px] border-dashed border-rule bg-surface px-6 py-12 text-center text-[15px] text-muted">
            Няма ръководства с тази комбинация от филтри.
          </div>
        )}
      </section>
    </div>
  );
}
