/**
 * Математиката на реалния газ: приведено уравнение на Ван дер Ваалс,
 * конструкция на Максуел, спинодала и бинодала, крива на инверсия.
 *
 * Държим я извън компонентите, защото е чиста и проверима: скриптът
 * `scripts/verify-real-gas.mjs` сверява критичната точка, равните площи и
 * характерните точки на кривата на инверсия срещу аналитичните стойности.
 *
 * Навсякъде `v` е приведен моларен обем \nu/\nu_c, `T` е T/T_c и `p` е p/p_c.
 */

export const R = 8.314; // J/(mol·K)

/** Приведено уравнение: p_r = 8T_r/(3\nu_r-1) - 3/\nu_r^2. */
export function reducedPressure(v: number, T: number): number {
  return (8 * T) / (3 * v - 1) - 3 / (v * v);
}

/** Първообразна на p_r по \nu_r — лицето под изотермата. */
export function reducedWork(v: number, T: number): number {
  return ((8 * T) / 3) * Math.log(3 * v - 1) + 3 / v;
}

/** Температурата, при която даден приведен обем лежи на спинодалата. */
export function spinodalTemperature(v: number): number {
  return ((3 * v - 1) * (3 * v - 1)) / (4 * v * v * v);
}

/** Спинодала в координати (\nu_r, p_r): p_r = (3\nu_r-2)/\nu_r^3. */
export function spinodalPressure(v: number): number {
  return (3 * v - 2) / (v * v * v);
}

/** Половинене на интервал за монотонен участък; 90 стъпки стигат за double. */
export function bisect(f: (x: number) => number, a: number, b: number, steps = 90): number {
  let lo = a;
  let hi = b;
  let flo = f(lo);
  for (let i = 0; i < steps; i += 1) {
    const mid = 0.5 * (lo + hi);
    const fmid = f(mid);
    if (fmid > 0 === flo > 0) {
      lo = mid;
      flo = fmid;
    } else {
      hi = mid;
    }
  }
  return 0.5 * (lo + hi);
}

/** Двата обема, в които изотермата има минимум и максимум (краищата на неустойчивия участък). */
export function spinodalVolumes(T: number): [number, number] {
  const low = bisect((v) => spinodalTemperature(v) - T, 1 / 3 + 1e-9, 1);
  const high = bisect((v) => spinodalTemperature(v) - T, 1, 1e4);
  return [low, high];
}

export interface MaxwellState {
  /** Приведено налягане на насищане. */
  ps: number;
  /** Моларен обем на течността и на парата. */
  vLiquid: number;
  vVapour: number;
  /** Средният корен — вътре в неустойчивия участък. */
  vMiddle: number;
  /** Краищата на неустойчивия участък (спинодала). */
  vSpinLiquid: number;
  vSpinVapour: number;
  /** Двете площи, които конструкцията изравнява. */
  areaBelow: number;
  areaAbove: number;
}

/**
 * Конструкция на Максуел: търси хоризонталата, за която площта на примката
 * над нея е равна на площта под нея. Еквивалентно условие е равенството на
 * потенциала на Гибс в двете фази.
 */
export function maxwellConstruction(T: number): MaxwellState | null {
  if (T >= 1) return null;
  const [vSpinLiquid, vSpinVapour] = spinodalVolumes(T);
  const pLow = reducedPressure(vSpinLiquid, T);
  const pHigh = reducedPressure(vSpinVapour, T);

  const roots = (p: number): [number, number, number] => {
    const liquid = bisect((v) => reducedPressure(v, T) - p, 1 / 3 + 1e-12, vSpinLiquid);
    let hi = vSpinVapour * 2;
    while (reducedPressure(hi, T) > p) hi *= 2;
    const vapour = bisect((v) => reducedPressure(v, T) - p, vSpinVapour, hi);
    const middle = bisect((v) => reducedPressure(v, T) - p, vSpinLiquid, vSpinVapour);
    return [liquid, middle, vapour];
  };

  const mismatch = (p: number) => {
    const [liquid, , vapour] = roots(p);
    return reducedWork(vapour, T) - reducedWork(liquid, T) - p * (vapour - liquid);
  };

  const ps = bisect(mismatch, Math.max(pLow, 1e-9), pHigh, 70);
  const [vLiquid, vMiddle, vVapour] = roots(ps);
  return {
    ps,
    vLiquid,
    vVapour,
    vMiddle,
    vSpinLiquid,
    vSpinVapour,
    areaBelow: ps * (vMiddle - vLiquid) - (reducedWork(vMiddle, T) - reducedWork(vLiquid, T)),
    areaAbove: reducedWork(vVapour, T) - reducedWork(vMiddle, T) - ps * (vVapour - vMiddle),
  };
}

export interface BinodalBranches {
  liquid: readonly [number, number][];
  vapour: readonly [number, number][];
}

let binodalCache: BinodalBranches | null = null;

/** Границата на областта течност + пара, построена от конструкцията на Максуел. */
export function binodal(): BinodalBranches {
  if (binodalCache) return binodalCache;
  const liquid: [number, number][] = [];
  const vapour: [number, number][] = [];
  for (let T = 0.7; T < 0.9995; T += 0.004) {
    const state = maxwellConstruction(T);
    if (!state) continue;
    liquid.push([state.vLiquid, state.ps]);
    vapour.push([state.vVapour, state.ps]);
  }
  binodalCache = { liquid, vapour };
  return binodalCache;
}

/**
 * Кривата на инверсия на Джаул–Томсън в приведени единици, параметризирана
 * с x = b/\nu от 0 (разреден газ) до 2/3 (откъм течността):
 * T_r = 27(1-x)^2/4, p_r = 27x(2-3x).
 */
export function inversionCurve(points = 240): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i <= points; i += 1) {
    const x = ((2 / 3) * i) / points;
    out.push([(27 / 4) * (1 - x) * (1 - x), 27 * x * (2 - 3 * x)]);
  }
  return out;
}

/**
 * Приведеният моларен обем на устойчивата фаза при дадени T_r и p_r.
 * Под критичната температура избира течност или пара според налягането на
 * насищане; неустойчивият среден корен никога не се връща.
 */
export function stableReducedVolume(T: number, p: number): number | null {
  const f = (v: number) => reducedPressure(v, T) - p;
  const roots: number[] = [];
  const logLow = Math.log(1 / 3 + 1e-9);
  const logHigh = Math.log(3e4);
  const steps = 700;
  let prev = 1 / 3 + 1e-9;
  let fPrev = f(prev);
  for (let i = 1; i <= steps; i += 1) {
    const next = Math.exp(logLow + ((logHigh - logLow) * i) / steps);
    const fNext = f(next);
    if (fPrev > 0 !== fNext > 0) roots.push(bisect(f, prev, next, 60));
    prev = next;
    fPrev = fNext;
  }
  if (roots.length === 0) return null;
  if (roots.length === 1 || T >= 1) return roots[roots.length - 1];
  const state = maxwellConstruction(T);
  if (!state) return roots[roots.length - 1];
  return p > state.ps ? roots[0] : roots[roots.length - 1];
}

export interface GasData {
  /** Означение за надписи. */
  symbol: string;
  /** Име за падащото меню. */
  name: string;
  /** Константи на Ван дер Ваалс: a в Pa·m^6/mol^2, b в m^3/mol. */
  a: number;
  b: number;
  /** Моларен топлинен капацитет при постоянен обем, J/(mol·K), около 300 K. */
  cV: number;
  /** Измерена горна температура на инверсия, K (ако е известна). */
  measuredInversion?: number;
}

export const GASES: Record<string, GasData> = {
  N2: { symbol: "N_2", name: "азот", a: 0.137, b: 3.87e-5, cV: 20.8, measuredInversion: 621 },
  O2: { symbol: "O_2", name: "кислород", a: 0.1382, b: 3.186e-5, cV: 21.1, measuredInversion: 764 },
  CO2: { symbol: "CO_2", name: "въглероден диоксид", a: 0.364, b: 4.267e-5, cV: 28.8 },
  H2: { symbol: "H_2", name: "водород", a: 0.02476, b: 2.661e-5, cV: 20.4, measuredInversion: 202 },
  He: { symbol: "He", name: "хелий", a: 0.00346, b: 2.38e-5, cV: 12.5, measuredInversion: 51 },
};

export interface CriticalPoint {
  /** K */
  T: number;
  /** Pa */
  p: number;
  /** m^3/mol */
  v: number;
}

/** Критичната точка от константите: \nu_c=3b, T_c=8a/(27Rb), p_c=a/(27b^2). */
export function criticalPoint(gas: GasData): CriticalPoint {
  return {
    T: (8 * gas.a) / (27 * R * gas.b),
    p: gas.a / (27 * gas.b * gas.b),
    v: 3 * gas.b,
  };
}

/**
 * Коефициент на Джаул–Томсън по модела на Ван дер Ваалс, в K/Pa:
 * \mu = [T(\partial\nu/\partial T)_p - \nu]/c_p, където производната идва от
 * цикличното правило, а c_p - c_V от уравнението на състоянието.
 */
export function jouleThomson(gas: GasData, T: number, p: number): number | null {
  const crit = criticalPoint(gas);
  const vr = stableReducedVolume(T / crit.T, p / crit.p);
  if (vr === null) return null;
  const v = crit.v * vr;
  const dpdT = R / (v - gas.b);
  const dpdv = (-R * T) / ((v - gas.b) * (v - gas.b)) + (2 * gas.a) / (v * v * v);
  const dvdT = -dpdT / dpdv;
  const cp = gas.cV + R / (1 - (2 * gas.a * (v - gas.b) * (v - gas.b)) / (R * T * v * v * v));
  return (T * dvdT - v) / cp;
}
