/**
 * Типове за съдържателния модел на платформата.
 *
 * RichTextString е обикновен string с лек inline-синтаксис:
 *   **удебелен текст**  и  $inline KaTeX формула$
 * Рендва се от компонента <RichText />.
 */
export type RichTextString = string;

/* ---------- 7-те педагогически секции ---------- */

/** 1. Мотивация — защо темата си заслужава. */
export interface MotivationSection {
  paragraphs: RichTextString[];
}

/** Статична илюстрация/диаграма към интуицията (inline SVG). */
export interface Figure {
  /** Суров SVG markup — рендва се директно. */
  svg: string;
  caption?: RichTextString;
}

/** 2. Интуиция — концептуалното обяснение преди формулите. */
export interface IntuitionSection {
  paragraphs: RichTextString[];
  /** Опционален callout (напр. кратък recap на нужно предзнание). */
  callout?: {
    title?: string;
    text: RichTextString;
  };
  figure?: Figure;
}

/** Една формула (display KaTeX) с опционален придружаващ текст преди нея. */
export interface MathItem {
  text?: RichTextString;
  /** KaTeX синтаксис, без делимитери. */
  latex: string;
}

/** 3. Математика — формалният апарат. */
export interface MathSection {
  items: MathItem[];
  /** Заключителен коментар след формулите. */
  note?: RichTextString;
}

/** Дефиниция на плъзгач-параметър за симулация. */
export interface SliderParam {
  /** Ключ, под който стойността се подава на симулационния компонент. */
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

/** 4. Симулация — референция към регистриран компонент + параметри. */
export interface SimulationSection {
  /** Id на компонент от регистъра в components/simulations/registry.ts */
  componentId: string;
  description?: RichTextString;
  params: SliderParam[];
}

/** 5. Пример — задача с решение, скрито зад "Покажи решение". */
export interface Example {
  title: string;
  problem: RichTextString;
  solution: RichTextString[];
}

/** 6. Задача за самостоятелна работа — без решение. */
export interface Problem {
  title: string;
  text: RichTextString;
}

/** 7. Проверка — quiz въпрос с опции. */
export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

/* ---------- Урок ---------- */

export interface Lesson {
  /** URL slug на темата, напр. "kinematika". */
  topicSlug: string;
  /** URL slug на урока, напр. "dvizhenie-pod-agal". */
  slug: string;
  /** Надзаглавие, напр. "Физика · Механика · Кинематика". */
  kicker: string;
  title: string;
  subtitle?: string;

  motivation: MotivationSection;
  intuition: IntuitionSection;
  math: MathSection;
  simulation: SimulationSection;
  examples: Example[];
  problems: Problem[];
  check: QuizQuestion[];
}

/* ---------- Договор за симулационен компонент ---------- */

/**
 * Всеки симулационен компонент приема текущите стойности на параметрите
 * (ключовете съответстват на SliderParam.key от урока) и callback, с който
 * може сам да променя параметри (напр. preset бутони).
 * Плъзгачите се рендват от SimulationHost — компонентът получава готовите стойности.
 */
export interface SimulationProps {
  params: Record<string, number>;
  onParamsChange: (params: Record<string, number>) => void;
}
