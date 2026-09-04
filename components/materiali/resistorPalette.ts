/**
 * Цветовете тук са данни от маркировката на резисторите, а не част от
 * декоративната палитра на сайта. Затова пазят физическите си цветове и в
 * светла, и в тъмна SVG сцена.
 */
export const RESISTOR_COLORS = {
  black: { label: "черно", hex: "#161616", digit: 0, multiplier: 1 },
  brown: { label: "кафяво", hex: "#6b3f25", digit: 1, multiplier: 10, tolerance: 1 },
  red: { label: "червено", hex: "#c83b35", digit: 2, multiplier: 100, tolerance: 2 },
  orange: { label: "оранжево", hex: "#df7a1c", digit: 3, multiplier: 1_000 },
  yellow: { label: "жълто", hex: "#dfbd27", digit: 4, multiplier: 10_000 },
  green: { label: "зелено", hex: "#2f8a55", digit: 5, multiplier: 100_000, tolerance: 0.5 },
  blue: { label: "синьо", hex: "#2d67ad", digit: 6, multiplier: 1_000_000, tolerance: 0.25 },
  violet: { label: "виолетово", hex: "#7750a8", digit: 7, multiplier: 10_000_000, tolerance: 0.1 },
  gray: { label: "сиво", hex: "#7f858d", digit: 8, multiplier: 100_000_000, tolerance: 0.05 },
  white: { label: "бяло", hex: "#f4f1e8", digit: 9, multiplier: 1_000_000_000 },
  gold: { label: "златно", hex: "#bf942a", multiplier: 0.1, tolerance: 5 },
  silver: { label: "сребърно", hex: "#adb3bb", multiplier: 0.01, tolerance: 10 },
} as const;

export type ResistorColorName = keyof typeof RESISTOR_COLORS;

export type DigitColorName =
  | "black"
  | "brown"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "violet"
  | "gray"
  | "white";

export const DIGIT_COLOR_NAMES: readonly DigitColorName[] = [
  "black",
  "brown",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "violet",
  "gray",
  "white",
];

export const MULTIPLIER_COLOR_NAMES: readonly ResistorColorName[] = [
  "silver",
  "gold",
  ...DIGIT_COLOR_NAMES,
];

export const TOLERANCE_COLOR_NAMES: readonly ResistorColorName[] = [
  "brown",
  "red",
  "green",
  "blue",
  "violet",
  "gray",
  "gold",
  "silver",
];
