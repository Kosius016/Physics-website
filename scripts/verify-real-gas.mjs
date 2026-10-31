/**
 * Проверка на математиката за реалния газ срещу аналитичните стойности.
 * Пуска се с: "C:\Program Files\nodejs\node.exe" scripts/verify-real-gas.mjs
 *
 * Файлът е .mjs и повтаря функциите от lib/realGas.ts, за да не въвеждаме
 * TypeScript в скриптовете. Всяка промяна в модела трябва да мине и тук.
 */

const R = 8.314;
const pr = (v, T) => (8 * T) / (3 * v - 1) - 3 / (v * v);
const work = (v, T) => ((8 * T) / 3) * Math.log(3 * v - 1) + 3 / v;
const spinT = (v) => ((3 * v - 1) * (3 * v - 1)) / (4 * v * v * v);
const spinP = (v) => (3 * v - 2) / (v * v * v);

function bisect(f, a, b, steps = 90) {
  let lo = a, hi = b, flo = f(lo);
  for (let i = 0; i < steps; i += 1) {
    const mid = 0.5 * (lo + hi), fmid = f(mid);
    if (fmid > 0 === flo > 0) { lo = mid; flo = fmid; } else { hi = mid; }
  }
  return 0.5 * (lo + hi);
}

function maxwell(T) {
  if (T >= 1) return null;
  const vL = bisect((v) => spinT(v) - T, 1 / 3 + 1e-9, 1);
  const vG = bisect((v) => spinT(v) - T, 1, 1e4);
  const roots = (p) => {
    const liquid = bisect((v) => pr(v, T) - p, 1 / 3 + 1e-12, vL);
    let hi = vG * 2;
    while (pr(hi, T) > p) hi *= 2;
    const vapour = bisect((v) => pr(v, T) - p, vG, hi);
    const middle = bisect((v) => pr(v, T) - p, vL, vG);
    return [liquid, middle, vapour];
  };
  const mismatch = (p) => {
    const [l, , g] = roots(p);
    return work(g, T) - work(l, T) - p * (g - l);
  };
  const ps = bisect(mismatch, Math.max(pr(vL, T), 1e-9), pr(vG, T), 70);
  const [l, m, g] = roots(ps);
  return {
    ps, l, m, g, vL, vG,
    below: ps * (m - l) - (work(m, T) - work(l, T)),
    above: work(g, T) - work(m, T) - ps * (g - m),
  };
}

let failures = 0;
function check(label, got, want, tol) {
  const ok = Math.abs(got - want) <= tol;
  if (!ok) failures += 1;
  console.log(`${ok ? "ok  " : "FAIL"} ${label}: ${got.toPrecision(6)} (очаквано ${want} ±${tol})`);
}

console.log("— критична точка в приведени единици —");
check("p_r(1, 1)", pr(1, 1), 1, 1e-12);
check("(dp/dv) в K", (pr(1.0001, 1) - pr(0.9999, 1)) / 0.0002, 0, 1e-6);
check("(d2p/dv2) в K", (pr(1.001, 1) - 2 * pr(1, 1) + pr(0.999, 1)) / 1e-6, 0, 1e-3);

console.log("\n— спинодала —");
check("T_r при v_r = 1", spinT(1), 1, 1e-12);
check("p_r = 0 при v_r = 2/3", spinP(2 / 3), 0, 1e-12);
check("T_r на спинодалата при v_r = 2/3", spinT(2 / 3), 27 / 32, 1e-12);

console.log("\n— конструкция на Максуел —");
for (const T of [0.85, 0.9, 0.95, 0.99]) {
  const m = maxwell(T);
  check(`равни площи при T_r = ${T}`, m.below - m.above, 0, 1e-6);
  const inside = m.l > 1 / 3 && m.l < m.vL && m.g > m.vG;
  if (!inside) { failures += 1; console.log(`FAIL корените при T_r = ${T} са извън очаквания ред`); }
}
check("p_s при T_r = 0,9 (таблично 0,647)", maxwell(0.9).ps, 0.6468, 2e-3);

console.log("\n— крива на инверсия —");
const Tinv = (x) => (27 / 4) * (1 - x) ** 2;
const Pinv = (x) => 27 * x * (2 - 3 * x);
check("T_r при x = 0", Tinv(0), 6.75, 1e-12);
check("p_r при x = 1/3", Pinv(1 / 3), 9, 1e-12);
check("T_r при x = 1/3", Tinv(1 / 3), 3, 1e-12);
check("p_r при x = 2/3", Pinv(2 / 3), 0, 1e-12);
check("T_r при x = 2/3", Tinv(2 / 3), 0.75, 1e-12);

console.log("\n— числата в текста на уроците —");
const gases = {
  N2: { a: 0.137, b: 3.87e-5, cV: 20.8 },
  H2: { a: 0.02476, b: 2.661e-5, cV: 20.4 },
  He: { a: 0.00346, b: 2.38e-5, cV: 12.5 },
  CO2: { a: 0.364, b: 4.267e-5, cV: 28.8 },
};
const Tc = (g) => (8 * g.a) / (27 * R * g.b);
const pcBar = (g) => g.a / (27 * g.b * g.b) / 1e5;
check("T_c на азота, K", Tc(gases.N2), 126.2, 1.5);
check("p_c на азота, bar", pcBar(gases.N2), 34.0, 1.5);
check("T_c на CO2, K", Tc(gases.CO2), 304.1, 1.5);
check("T_инв на азота при p → 0, K", (2 * gases.N2.a) / (R * gases.N2.b), 851, 2);
check("T_инв на водорода при p → 0, K", (2 * gases.H2.a) / (R * gases.H2.b), 224, 2);
check("T_инв на хелия при p → 0, K", (2 * gases.He.a) / (R * gases.He.b), 35, 1);
const muN2 = ((2 * gases.N2.a) / (R * 300) - gases.N2.b) / 29.1 * 1e5;
check("mu на азота при 300 K, K/bar", muN2, 0.244, 5e-3);
const b2a = gases.H2.b - (2 * gases.H2.a) / (R * 300);
check("b - 2a/RT за водород при 300 K, m^3/mol", b2a, 6.76e-6, 1e-7);
check("ΔT при свободно разширение на CO2 от 1 до 2 L, K",
  -(gases.CO2.a / gases.CO2.cV) * (1 / 1e-3 - 1 / 2e-3), -6.32, 0.02);
check("b на CO2 от критичната точка, m^3/mol", (R * 304.1) / (8 * 73.8e5), 4.28e-5, 2e-7);
check("a на CO2 от критичната точка, Pa·m^6/mol^2",
  (27 * R * R * 304.1 * 304.1) / (64 * 73.8e5), 0.365, 2e-3);
check("z_c по модела", (3 / 8), 0.375, 1e-12);
check("alpha/kappa на водата, Pa/K", 2.07e-4 / 4.59e-10, 4.51e5, 2e3);
check("вътрешно налягане на водата, bar", (293 * (2.07e-4 / 4.59e-10) - 1e5) / 1e5, 1321, 2);
check("c_p - c_V за вода, J/(mol·K)",
  (293 * 1.8e-5 * (2.07e-4) ** 2) / 4.59e-10, 0.49, 5e-3);
check("(dT/dp)_s за вода, K/bar", (293 * 1.8e-5 * 2.07e-4) / 75.4 * 1e5, 1.45e-3, 5e-5);
check("добив на машината на Линде", 1.416 / 12.07, 0.117, 2e-3);
check("x във вентила на хладилника", (256.4 - 173.6) / (386.6 - 173.6), 0.389, 2e-3);
check("eps на хладилника", (386.6 - 256.4) / (429.0 - 386.6), 3.07, 2e-2);
check("eps на Карно за хладилника", 253 / (313 - 253), 4.22, 2e-2);
check("eps на термопомпата при 35 °C и -5 °C", 308.15 / 40, 7.70, 2e-2);
check("r^k за въздушния цикъл", 2 ** 0.286, 1.219, 1e-3);
check("eps на въздушния цикъл", 1 / (2 ** 0.286 - 1), 4.56, 2e-2);
check("прегряване на водата по спинодалата, °C", (27 / 32) * 647 - 273.15, 273, 1);
check("топлина на изпарение на водата по модела, kJ/mol",
  0.554 / (0.018 / 958) / 1000 + (R * 373) / 1000, 32.6, 0.1);
check("разширение на Вселената", 3000 / 2.725, 1101, 2);

console.log(failures === 0 ? "\nВсички проверки минават." : `\n${failures} проверки не минават.`);
process.exit(failures === 0 ? 0 : 1);
