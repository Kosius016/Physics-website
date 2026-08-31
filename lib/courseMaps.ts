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
  /** ISO дата за секциите „Последно добавени“ и бъдещи каталози. */
  publishedAt?: string;
  /** Черновите се виждат само при локална разработка. */
  draft?: boolean;
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
        publishedAt: "2026-07-12",
        draft: true,
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
        draft: true,
      },
      {
        number: "1.2",
        title: "Проводници в електростатично равновесие",
        href: "/physics/elektrichestvo/provodnici",
      },
      {
        number: "1.3",
        title: "Кондензатори: капацитет, свързване и енергия",
        href: "/physics/elektrichestvo/kondenzatori",
      },
      {
        number: "1.4",
        title: "Диелектрици: поляризация, капацитет и енергия",
        href: "/physics/elektrichestvo/dielektrici",
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
        publishedAt: "2026-07-21",
      },
      {
        number: "3.2",
        title: "Индуктивност: токът има електромагнитна инерция",
        href: "/physics/magnetizm/induktivnost",
        publishedAt: "2026-07-25",
      },
    ],
  },
  {
    title: "Променлив ток",
    lessons: [
      {
        number: "4.1",
        title: "Променлив ток: от фазата до импеданса и резонанса",
        href: "/physics/promenliv-tok/impedans-i-rezonans",
        publishedAt: "2026-08-18",
      },
      {
        number: "4.2",
        title: "Трансформаторът и преносът на електроенергия",
        href: "/physics/promenliv-tok/transformator",
        publishedAt: "2026-08-31",
      },
      { number: "4.3", title: "Изправители и филтри: от мрежовото AC до гладко DC" },
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
        publishedAt: "2026-07-14",
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
  const sections = courseMaps[subject]?.[level] ?? [];
  if (process.env.NODE_ENV !== "production") return sections;

  return sections
    .map((section) => ({
      ...section,
      lessons: section.lessons.filter((lesson) => !lesson.draft),
    }))
    .filter((section) => section.lessons.length > 0);
}

export interface CourseLessonSummary extends CourseLessonEntry {
  subject: Subject;
  level: Level;
  section: string;
  href: string;
}

export function getLessonCount(subject: Subject, level: Level): number {
  return getCourseMap(subject, level).reduce(
    (total, section) => total + section.lessons.filter((lesson) => lesson.href).length,
    0,
  );
}

export function getSubjectLessonCount(subject: Subject): number {
  return LEVELS.reduce((total, level) => total + getLessonCount(subject, level), 0);
}

export function getRecentLessons(limit = 3): CourseLessonSummary[] {
  const lessons: CourseLessonSummary[] = [];

  for (const subject of SUBJECTS) {
    for (const level of LEVELS) {
      for (const section of getCourseMap(subject, level)) {
        for (const lesson of section.lessons) {
          if (!lesson.href || !lesson.publishedAt) continue;
          lessons.push({
            ...lesson,
            subject,
            level,
            section: section.title,
            href: lesson.href,
          });
        }
      }
    }
  }

  return lessons
    .sort((a, b) => b.publishedAt!.localeCompare(a.publishedAt!))
    .slice(0, limit);
}
