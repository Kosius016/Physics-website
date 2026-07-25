/**
 * Твърдо закодирани course map данни, показвани според избраните филтри
 * (предмет + ниво). По-късно ще идват от истински източник на данни.
 */

export const SUBJECTS = ["Физика", "Математика"] as const;
export const LEVELS = ["11. клас", "12. клас", "Университетско"] as const;

export type Subject = (typeof SUBJECTS)[number];
export type Level = (typeof LEVELS)[number];

export interface CourseLessonEntry {
  /** Номер в раздела, напр. "1.1". */
  number: string;
  title: string;
  /** Линк към урока; липсва → урокът предстои. */
  href?: string;
}

export interface CourseSection {
  title: string;
  lessons: CourseLessonEntry[];
}

const physics11: CourseSection[] = [
  {
    title: "Механика · Кинематика",
    lessons: [
      {
        number: "1.1",
        title: "Движение под ъгъл към хоризонта",
        href: "/physics/kinematika/dvizhenie-pod-agal",
      },
      { number: "1.2", title: "Свободно падане и хвърляне нагоре" },
      { number: "1.3", title: "Относителност на движението" },
    ],
  },
  {
    title: "Механика · Динамика",
    lessons: [
      { number: "2.1", title: "Закони на Нютон" },
      { number: "2.2", title: "Сили на триене" },
    ],
  },
];

const physicsUni: CourseSection[] = [
  {
    title: "Електричество",
    lessons: [
      {
        number: "1.1",
        title: "Електростатичен потенциал",
        href: "/physics/elektrichestvo/potencial",
      },
    ],
  },
  {
    title: "Магнетизъм",
    lessons: [
      {
        number: "2.1",
        title: "Закон на Био-Савар — геометрията зад формулата",
        href: "/physics/magnetizm/bio-savar",
      },
      {
        number: "2.2",
        title: "Законът на Ампер — симетрия вместо интегриране",
        href: "/physics/magnetizm/amper",
      },
      {
        number: "2.3",
        title: "Силата на Лоренц — как полето отклонява заряд",
        href: "/physics/magnetizm/lorentz",
      },
      {
        number: "2.4",
        title: "Сила между два успоредни проводника",
        href: "/physics/magnetizm/usporeni-provodnici",
      },
    ],
  },
  {
    title: "Електромагнитна индукция",
    lessons: [
      {
        number: "3.1",
        title: "Законът на Фарадей — индукция от променящ се поток",
        href: "/physics/magnetizm/faraday",
      },
      {
        number: "3.2",
        title: "Индуктивност: токът има електромагнитна инерция",
        href: "/physics/magnetizm/induktivnost",
      },
    ],
  },
];

const mathUni: CourseSection[] = [
  {
    title: "Линейна алгебра",
    lessons: [
      {
        number: "1.1",
        title: "Матрици — езикът на трансформациите",
        href: "/math/lineina-algebra/matrici",
      },
      {
        number: "1.2",
        title: "Детерминанти — площта на трансформацията",
        href: "/math/lineina-algebra/determinanti",
      },
      {
        number: "1.3",
        title: "Векторно и смесено произведение",
        href: "/math/lineina-algebra/vektorno-proizvedenie",
      },
    ],
  },
];

const courseMaps: Partial<Record<Subject, Partial<Record<Level, CourseSection[]>>>> = {
  Физика: {
    "11. клас": physics11,
    Университетско: physicsUni,
  },
  Математика: {
    Университетско: mathUni,
  },
};

export function getCourseMap(subject: Subject, level: Level): CourseSection[] {
  return courseMaps[subject]?.[level] ?? [];
}
