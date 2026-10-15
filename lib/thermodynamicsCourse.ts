import type { CourseSection } from "./courseMaps";

/** Textbook order from the supplied contents. No route means forthcoming. */
export const thermodynamicsCourse: CourseSection[] = [
  { title: "Термодинамика · Физични свойства на газовете", lessons: [
    { number: "1", title: "Топлинни явления (тест за входно ниво)" },
    { number: "2", title: "Температура и топлина (преговор с допълнения)" },
    { number: "3", title: "Уравнение за състояние на идеалния газ" },
    { number: "4", title: "Закони при идеалните газове (решаване на задачи)" },
  ] },
  { title: "Термодинамика · Молекулно-кинетичен модел на идеален газ", lessons: [
    { number: "5", title: "Основни понятия на молекулно-кинетичната теория", href: "/physics/termodinamika/molekulno-kinetichen-model", publishedAt: "2026-10-15" },
  ] },
  { title: "Термодинамика · Принципи на термодинамиката", lessons: [
    { number: "6", title: "Основни понятия в термодинамиката", href: "/physics/termodinamika/osnovni-ponyatiya", publishedAt: "2026-10-15" },
    { number: "7", title: "Първи принцип на термодинамиката", href: "/physics/termodinamika/parvi-printsip", publishedAt: "2026-10-15" },
    { number: "8", title: "Енергетични превръщания при процеси с идеален газ", href: "/physics/termodinamika/protsesi-idealen-gaz", publishedAt: "2026-10-15" },
    { number: "9", title: "Ентропия. Втори принцип на термодинамиката" },
  ] },
  { title: "Термодинамика · Топлинни машини", lessons: [
    { number: "10", title: "Енергетични превръщания в топлинните двигатели" },
    { number: "11", title: "КПД на топлинни двигатели (решаване на задачи)" },
    { number: "12", title: "Хладилни машини и топлинни помпи" },
    { number: "13", title: "Молекулен строеж на веществата (проверете знанията си)" },
  ] },
];
export const thermoEntries = thermodynamicsCourse.flatMap(section => section.lessons);
export function thermoEntry(slug: string) {
  return thermoEntries.find(entry => entry.href?.endsWith("/" + slug));
}
