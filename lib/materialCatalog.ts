import { practicumPreviews } from "./practicum";

export type MaterialKind = "pregovor" | "zadachi" | "praktikum";
export type MaterialLevel = "11" | "12" | "university";

export interface MaterialCatalogItem {
  id: string;
  kind: MaterialKind;
  title: string;
  summary: string;
  subject: "Физика" | "Математика";
  level: MaterialLevel;
  topic: string;
  meta: readonly string[];
  href?: string;
}

export const MATERIAL_FILTERS: readonly {
  value: "all" | MaterialKind;
  label: string;
}[] = [
  { value: "all", label: "Всички" },
  { value: "pregovor", label: "Преговор" },
  { value: "zadachi", label: "Задачи" },
  { value: "praktikum", label: "Практикуми" },
];

const publishedMaterials: readonly MaterialCatalogItem[] = [
  {
    id: "elektrichestvo-i-magnetizam",
    kind: "pregovor",
    title: "Електричество и магнетизъм: голям справочник",
    summary:
      "Величини, закони, условия за приложимост, стандартни резултати, стратегии за задачи и типични грешки.",
    subject: "Физика",
    level: "university",
    topic: "Електричество и магнетизъм",
    meta: ["40–50 мин преговор", "14 секции", "10 въпроса"],
    href: "/materiali/elektrichestvo-i-magnetizam",
  },
  {
    id: "provodnitsi-kondenzatori-dielektritsi",
    kind: "pregovor",
    title: "Проводници, кондензатори и диелектрици",
    summary:
      "От електростатичното равновесие и теоремата на Гаус до избора между фиксиран заряд и фиксиран потенциал.",
    subject: "Физика",
    level: "university",
    topic: "Електростатика",
    meta: ["15–20 мин преговор", "3 интерактива", "7 въпроса"],
    href: "/materiali/provodnitsi-kondenzatori-dielektritsi",
  },
  {
    id: "kontrolno-elektrostatika",
    kind: "zadachi",
    title: "Електростатика: контролно",
    summary:
      "Реално контролно с пълни решения и ясна връзка към уроците, върху които стъпва всяка задача.",
    subject: "Физика",
    level: "university",
    topic: "Електростатика",
    meta: ["7 въпроса", "4 задачи", "Пълни решения"],
    href: "/zadachi/kontrolno-elektrostatika",
  },
  {
    id: "kondenzatori",
    kind: "zadachi",
    title: "Плосък и коаксиален кондензатор",
    summary:
      "Енергия, пробив, плоско приближение и енергийни баланси с решения стъпка по стъпка.",
    subject: "Физика",
    level: "university",
    topic: "Електростатика",
    meta: ["6 задачи", "6 интерактивни проверки", "Водени решения"],
    href: "/zadachi/kondenzatori",
  },
  {
    id: "chestota-period-valni",
    kind: "zadachi",
    title: "Честота, период и вълни",
    summary:
      "От въртеливо движение към честота, дължина и скорост на вълната, фаза, интерференция и биения.",
    subject: "Физика",
    level: "university",
    topic: "Трептения и вълни",
    meta: ["20 задачи", "5 интерактивни проверки", "Водени решения"],
    href: "/zadachi/chestota-period-valni",
  },
  {
    id: "redove-na-teylar",
    kind: "zadachi",
    title: "Редове на Тейлър и Маклорен",
    summary:
      "Стандартни редове, граници и приложения за потенциала на дипол, двойка заряди и зареден пръстен.",
    subject: "Математика",
    level: "university",
    topic: "Анализ и електростатика",
    meta: ["20 задачи", "4 графики", "Водени решения"],
    href: "/zadachi/redove-na-teylar",
  },
  {
    id: "lineina-algebra-tazhdestva",
    kind: "zadachi",
    title: "Детерминанти и векторни тъждества",
    summary:
      "Доказателства и решения за Лагранж, BAC–CAB, Якоби, Бине–Коши, смесено произведение и Вандермонд.",
    subject: "Математика",
    level: "university",
    topic: "Линейна алгебра",
    meta: ["10 задачи", "Доказателства", "Пълни решения"],
    href: "/zadachi/lineina-algebra-tazhdestva",
  },
];

const plannedPracticums: readonly MaterialCatalogItem[] = practicumPreviews.map((guide) => ({
  id: guide.id,
  kind: "praktikum",
  title: guide.title,
  summary: guide.summary,
  subject: guide.subject,
  level: "university",
  topic: guide.topic,
  meta: [guide.difficulty, guide.equipment, "Скоро"],
}));

export const materialCatalog: readonly MaterialCatalogItem[] = [
  ...publishedMaterials,
  ...plannedPracticums,
];

export function getMaterials({
  kind,
  subject,
  level,
}: {
  kind: "all" | MaterialKind;
  subject: MaterialCatalogItem["subject"];
  level: MaterialLevel;
}) {
  return materialCatalog.filter(
    (item) =>
      (kind === "all" || item.kind === kind) && item.subject === subject && item.level === level,
  );
}
