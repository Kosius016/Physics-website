import Link from "next/link";
import {
  MATERIAL_FILTERS,
  getMaterialCount,
  getMaterialsByKind,
  type MaterialCatalogItem,
  type MaterialKind,
} from "@/lib/materialCatalog";

export const metadata = {
  title: "Материали · SingularityLab",
  description:
    "Материали за преговор, задачи с решения и практически ръководства по физика и математика.",
};

const KIND_LABELS: Record<MaterialKind, string> = {
  pregovor: "Преговор",
  zadachi: "Задачи",
  praktikum: "Практикум",
};

const SECTION_TITLES: Record<"all" | MaterialKind, string> = {
  all: "Всички материали",
  pregovor: "Материали за преговор",
  zadachi: "Задачи с решения",
  praktikum: "Практикуми",
};

function normalizeFilter(value: string | string[] | undefined): "all" | MaterialKind {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === "pregovor" || candidate === "zadachi" || candidate === "praktikum"
    ? candidate
    : "all";
}

function filterHref(value: "all" | MaterialKind) {
  return value === "all" ? "/materiali" : `/materiali?type=${value}`;
}

function MaterialCard({ item }: { item: MaterialCatalogItem }) {
  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border-[1.5px] border-ink bg-paper px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink">
          {KIND_LABELS[item.kind]}
        </span>
        <span className="text-[11.5px] font-semibold text-muted">
          {item.subject} · {item.topic}
        </span>
      </div>

      <h2
        className={`mt-4 font-serif text-[23px] font-bold leading-[1.12] text-ink sm:text-[26px] ${
          item.href ? "transition-colors group-hover:text-minus" : ""
        }`}
      >
        {item.title}
      </h2>
      <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">{item.summary}</p>

      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[12px] font-semibold text-ink">
        {item.meta.map((meta) => (
          <span key={meta} className="rounded-full bg-hl px-2.5 py-1">
            {meta}
          </span>
        ))}
      </div>

      <p className="mt-5 text-[13px] font-bold text-minus">
        {item.href
          ? item.kind === "zadachi"
            ? "Отворете задачите →"
            : "Отворете материала →"
          : "Подготвя се"}
      </p>
    </>
  );

  const cardClass =
    "group flex min-h-[290px] flex-col rounded-[11px] border-[1.5px] border-ink bg-surface p-5 shadow-hard sm:p-6";

  return item.href ? (
    <Link
      href={item.href}
      className={`${cardClass} transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5`}
    >
      {content}
    </Link>
  ) : (
    <article className={cardClass}>{content}</article>
  );
}

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string | string[] }>;
}) {
  const { type } = await searchParams;
  const activeFilter = normalizeFilter(type);
  const visibleMaterials = getMaterialsByKind(activeFilter);

  return (
    <main className="mx-auto max-w-[1040px] px-5 pb-24">
      <header className="max-w-3xl pb-8 pt-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-minus">
          Библиотека
        </p>
        <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
          Материали за учене и практика
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">
          Преговор, задачи с пълни решения и практически ръководства на едно място.
          Изберете вида материал, който Ви трябва сега.
        </p>
      </header>

      <nav
        aria-label="Филтър по вид материал"
        className="flex flex-wrap gap-2 border-y-[1.5px] border-rule py-4"
      >
        {MATERIAL_FILTERS.map((filter) => {
          const active = activeFilter === filter.value;
          return (
            <Link
              key={filter.value}
              href={filterHref(filter.value)}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-full border-[1.5px] border-ink bg-ink px-4 py-2 text-[13px] font-bold text-white shadow-hard-sm"
                  : "rounded-full border-[1.5px] border-ink bg-surface px-4 py-2 text-[13px] font-semibold text-ink transition-colors hover:bg-hl"
              }
            >
              {filter.label}
              <span className={`ml-2 tabular-nums ${active ? "text-white/70" : "text-muted"}`}>
                {getMaterialCount(filter.value)}
              </span>
            </Link>
          );
        })}
      </nav>

      <section aria-labelledby="materials-heading" className="pt-9">
        <h2
          id="materials-heading"
          className="mb-5 border-b-2 border-ink pb-1.5 font-serif text-[26px] font-bold text-ink"
        >
          <span
            aria-hidden="true"
            className="mr-2.5 align-[0.15em] text-[0.62em] tracking-[0.1em] text-muted"
          >
            §1
          </span>
          {SECTION_TITLES[activeFilter]}
        </h2>

        <div className="grid gap-[18px] md:grid-cols-2">
          {visibleMaterials.map((item) => (
            <MaterialCard key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
