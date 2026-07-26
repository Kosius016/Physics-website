/** Число, готово за вмъкване в LaTeX, с десетична запетая. */
export function texNumber(value: number, digits = 2, trim = false): string {
  const normalized = Math.abs(value) < 10 ** (-digits) / 2 ? 0 : value;
  let text = normalized.toFixed(digits);
  if (trim) text = text.replace(/\.?0+$/, "");
  return text.replace(".", "{,}");
}
