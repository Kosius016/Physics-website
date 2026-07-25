/**
 * Регистър на научнопопулярните статии. Всяка статия е самостоятелна
 * страница под /statii/<slug>; тук стоят само метаданните за списъка.
 */
export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  tag: "Физика" | "Математика" | "Астрономия" | "Технологии";
  topic: string;
  date: string; // ISO, за сортиране
  dateLabel: string;
  minutes: number;
}

export const articles: Article[] = [
  {
    slug: "malniyata",
    title: "Мълнията: най-познатата загадка в небето",
    subtitle:
      "Въздухът е изолатор, но въпреки това бурята прекарва ток през километри от него. Как точно започва мълнията още е отворен въпрос.",
    tag: "Физика",
    topic: "Атмосферно електричество",
    date: "2026-07-14",
    dateLabel: "юли 2026",
    minutes: 9,
  },
];
