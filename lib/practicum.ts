import type { RichTextString } from "./types";

export type PracticumDifficulty = "Начално" | "Средно" | "Напреднало";
export type PracticumStatus = "planned" | "draft" | "published";

export interface PracticumMaterial {
  name: string;
  quantity?: string;
  alternatives?: string[];
}

export interface PracticumGuide {
  slug: string;
  title: string;
  summary: RichTextString;
  subject: "Физика" | "Математика" | "Химия" | "Биология";
  topic: string;
  difficulty: PracticumDifficulty;
  durationMinutes: number;
  status: PracticumStatus;
  observation: RichTextString[];
  physics: RichTextString[];
  materials: PracticumMaterial[];
  setup: RichTextString[];
  steps: RichTextString[];
  prediction: {
    prompt: RichTextString;
    options: { text: RichTextString; correct: boolean }[];
    explanation: RichTextString;
  };
  measurements: {
    columns: string[];
    exampleRows?: string[][];
  };
  processing: RichTextString[];
  questions: RichTextString[];
  commonErrors: RichTextString[];
  safety: RichTextString[];
  teacherNotes: RichTextString[];
}

export interface PracticumPreview {
  id: string;
  title: string;
  summary: string;
  subject: "Физика";
  topic: "Магнетизъм";
  difficulty: PracticumDifficulty;
  equipment: "Без лабораторно захранване" | "Със захранване";
}

/**
 * Кандидати за първите ръководства. Те са само каталог — процедурите и
 * безопасността ще се попълнят след преглед на реално наличните уреди.
 */
export const practicumPreviews: PracticumPreview[] = [
  {
    id: "magnetic-field-map",
    title: "Карта на магнитното поле",
    summary: "Наблюдение на формата и посоката на полето около постоянни магнити.",
    subject: "Физика",
    topic: "Магнетизъм",
    difficulty: "Начално",
    equipment: "Без лабораторно захранване",
  },
  {
    id: "current-and-compass",
    title: "Поле около проводник с ток",
    summary: "Проверка на правилото на дясната ръка чрез измерима промяна в посоката на полето.",
    subject: "Физика",
    topic: "Магнетизъм",
    difficulty: "Средно",
    equipment: "Със захранване",
  },
  {
    id: "electromagnet-strength",
    title: "От какво зависи силата на електромагнита?",
    summary: "Сравнение на влиянието на тока, броя навивки и сърцевината.",
    subject: "Физика",
    topic: "Магнетизъм",
    difficulty: "Средно",
    equipment: "Със захранване",
  },
];

export const practicumGuides: PracticumGuide[] = [];
