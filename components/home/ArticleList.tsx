import Link from "next/link";
import { articles } from "@/lib/articles";

export default function ArticleList() {
  const latestArticles = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <div className="overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
      {latestArticles.map((article, index) => (
        <Link
          key={article.slug}
          href={`/statii/${article.slug}`}
          className={`flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5 px-[18px] py-3.5 transition-colors hover:bg-hl ${
            index < latestArticles.length - 1 ? "border-b-[1.5px] border-rule" : ""
          }`}
        >
          <span className="min-w-[240px] flex-1 font-serif text-[17.5px] font-bold leading-snug text-ink">
            {article.title}
          </span>
          <span className="text-[13px] text-muted">
            {article.topic} · {article.minutes} мин
          </span>
        </Link>
      ))}
    </div>
  );
}
