import { Arrow, C, STAGE_BG } from "./svg";
import type { GuidedProblemData } from "./GuidedProblem";
import SvgTex from "./SvgTex";

/**
 * Три водени задачи към урока „Проводници в електростатично равновесие“.
 * Фигурите се достроява по фази: 0 геометрия → 1 гаусовата повърхност →
 * 2 индуцираните заряди → 3 резултатът отвън.
 *
 * Числените стойности и прозата остават във figureCaption и в стъпките;
 * в сцената влизат само символи през SvgTex.
 */

const q = (v: number) => Math.round(v * 1000) / 1000;

/* ---------- Общи глифове ---------- */

function PlusGlyph({ x, y, color = C.plus }: { x: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2} strokeLinecap="round">
      <line x1={q(x - 4)} y1={q(y)} x2={q(x + 4)} y2={q(y)} />
      <line x1={q(x)} y1={q(y - 4)} x2={q(x)} y2={q(y + 4)} />
    </g>
  );
}

function MinusGlyph({ x, y, color = C.minus }: { x: number; y: number; color?: string }) {
  return (
    <line
      x1={q(x - 4)}
      y1={q(y)}
      x2={q(x + 4)}
      y2={q(y)}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  );
}

/** Равномерно разпределени точки по окръжност. */
function onCircle(cx: number, cy: number, r: number, count: number, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = phase + (i * 2 * Math.PI) / count;
    return { x: q(cx + r * Math.cos(a)), y: q(cy + r * Math.sin(a)), a };
  });
}

/* ---------- Обща геометрия за задачи 1 и 2 ---------- */

const SHELL_CX = 230;
const SHELL_CY = 150;
const CAVITY_R = 52;
const OUTER_R = 96;
const GAUSS_R = 74;

/** Черупка с кухина и точков заряд в центъра; общо за задачи 1 и 2. */
function shellBase() {
  return (
    <g>
      {/* Металът */}
      <circle
        cx={SHELL_CX}
        cy={SHELL_CY}
        r={OUTER_R}
        fill={C.wire}
        fillOpacity={0.13}
        stroke={C.wire}
        strokeWidth={2}
      />
      {/* Кухината */}
      <circle
        cx={SHELL_CX}
        cy={SHELL_CY}
        r={CAVITY_R}
        fill={STAGE_BG}
        stroke={C.wire}
        strokeWidth={2}
      />

      {/* Радиусите */}
      <line
        x1={SHELL_CX}
        y1={SHELL_CY}
        x2={SHELL_CX - CAVITY_R}
        y2={SHELL_CY}
        stroke={C.faint}
        strokeWidth={1.3}
        strokeDasharray="4 4"
      />
      <line
        x1={SHELL_CX}
        y1={SHELL_CY}
        x2={SHELL_CX + OUTER_R}
        y2={SHELL_CY}
        stroke={C.faint}
        strokeWidth={1.3}
        strokeDasharray="4 4"
      />
      <SvgTex x={204} y={138} tex="a" color={C.mut} fontSize={13} width={24} anchor="middle" />
      <SvgTex x={288} y={138} tex="b" color={C.mut} fontSize={13} width={24} anchor="middle" />

      {/* Зарядът в кухината */}
      <circle cx={SHELL_CX} cy={SHELL_CY} r={7} fill={C.plus} />
      <SvgTex
        x={SHELL_CX}
        y={124}
        tex="+2q"
        color={C.plus}
        fontSize={13}
        width={44}
        anchor="middle"
      />
    </g>
  );
}

/** Гаусовата повърхност; сама носи и етикета си. */
function gaussCircle(
  r: number,
  label: { x: number; y: number; anchor: "start" | "middle" },
  dim: boolean,
) {
  return (
    <g
      className="animate-rise"
      opacity={dim ? 0.25 : 1}
      style={{ transition: "opacity 180ms ease-out" }}
    >
      <circle
        cx={SHELL_CX}
        cy={SHELL_CY}
        r={r}
        fill="none"
        stroke={C.warn}
        strokeWidth={2}
        strokeDasharray="6 4"
      />
      <SvgTex
        x={label.x}
        y={label.y}
        tex="S"
        color={C.warn}
        fontSize={13}
        width={24}
        anchor={label.anchor}
      />
    </g>
  );
}

/* ---------- Задача 1 · Черупка със собствен заряд ---------- */

function p1Figure(phase: number) {
  return (
    <g>
      {shellBase()}

      {phase >= 1 && gaussCircle(GAUSS_R, { x: SHELL_CX, y: 60, anchor: "middle" }, phase >= 3)}

      {phase >= 2 && (
        <g className="animate-rise">
          {onCircle(SHELL_CX, SHELL_CY, CAVITY_R + 9, 8).map((p, i) => (
            <MinusGlyph key={`in-${i}`} x={p.x} y={p.y} />
          ))}
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          {onCircle(SHELL_CX, SHELL_CY, OUTER_R - 10, 12, 0.26).map((p, i) => (
            <MinusGlyph key={`out-${i}`} x={p.x} y={p.y} color={C.ok} />
          ))}
          {[0.25, 0.75, 1.25, 1.75].map((k) => {
            const a = k * Math.PI;
            return (
              <Arrow
                key={k}
                x1={q(SHELL_CX + 140 * Math.cos(a))}
                y1={q(SHELL_CY + 140 * Math.sin(a))}
                x2={q(SHELL_CX + 112 * Math.cos(a))}
                y2={q(SHELL_CY + 112 * Math.sin(a))}
                color={C.ok}
                width={2.4}
              />
            );
          })}
          <SvgTex x={344} y={44} tex={String.raw`\vec E`} color={C.ok} fontSize={13} width={32} />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 2 · Заземена черупка ---------- */

function groundSymbol() {
  return (
    <g stroke={C.wire} strokeWidth={2.2} strokeLinecap="round">
      <line x1={SHELL_CX} y1={SHELL_CY + OUTER_R} x2={SHELL_CX} y2={280} />
      <line x1={SHELL_CX - 26} y1={284} x2={SHELL_CX + 26} y2={284} />
      <line x1={SHELL_CX - 17} y1={292} x2={SHELL_CX + 17} y2={292} />
      <line x1={SHELL_CX - 8} y1={300} x2={SHELL_CX + 8} y2={300} />
    </g>
  );
}

function p2Figure(phase: number) {
  return (
    <g>
      {shellBase()}
      {groundSymbol()}

      {phase >= 1 && gaussCircle(126, { x: 364, y: 150, anchor: "start" }, phase >= 3)}

      {phase >= 2 && (
        <g className="animate-rise">
          {onCircle(SHELL_CX, SHELL_CY, CAVITY_R + 9, 8).map((p, i) => (
            <MinusGlyph key={`in-${i}`} x={p.x} y={p.y} />
          ))}
        </g>
      )}

      {phase >= 3 && (
        <g className="animate-rise">
          <SvgTex
            x={344}
            y={44}
            tex={String.raw`\vec E=0`}
            color={C.ok}
            fontSize={13}
            width={70}
          />
        </g>
      )}
    </g>
  );
}

/* ---------- Задача 3 · Свързване на две сфери ---------- */

const S1 = { x: 105, y: 160, r: 30 };
const S2 = { x: 330, y: 160, r: 90 };

function p3Figure(phase: number) {
  const done = phase >= 2;
  return (
    <g>
      {/* Жицата */}
      <line
        x1={S1.x + S1.r}
        y1={S1.y}
        x2={S2.x - S2.r}
        y2={S2.y}
        stroke={C.wire}
        strokeWidth={2.5}
      />

      <circle
        cx={S1.x}
        cy={S1.y}
        r={S1.r}
        fill={C.wire}
        fillOpacity={0.13}
        stroke={done ? C.ok : C.wire}
        strokeWidth={2}
        style={{ transition: "stroke 200ms ease-out" }}
      />
      <circle
        cx={S2.x}
        cy={S2.y}
        r={S2.r}
        fill={C.wire}
        fillOpacity={0.13}
        stroke={done ? C.ok : C.wire}
        strokeWidth={2}
        style={{ transition: "stroke 200ms ease-out" }}
      />

      <SvgTex x={S1.x} y={208} tex="R" color={C.mut} fontSize={13} width={28} anchor="middle" />
      <SvgTex x={S2.x} y={268} tex="3R" color={C.mut} fontSize={13} width={34} anchor="middle" />

      {done ? (
        <g className="animate-rise">
          <SvgTex
            x={S1.x}
            y={105}
            tex={String.raw`\tfrac{q}{2}`}
            color={C.ok}
            fontSize={14}
            width={40}
            anchor="middle"
          />
          <SvgTex
            x={S2.x}
            y={45}
            tex={String.raw`\tfrac{3q}{2}`}
            color={C.ok}
            fontSize={14}
            width={46}
            anchor="middle"
          />
        </g>
      ) : (
        <g>
          <SvgTex x={S1.x} y={108} tex="q" color={C.warn} fontSize={14} width={28} anchor="middle" />
          <SvgTex x={S2.x} y={48} tex="q" color={C.warn} fontSize={14} width={28} anchor="middle" />
        </g>
      )}

      {phase >= 1 && (
        <g
          className="animate-rise"
          opacity={phase === 1 ? 1 : 0.25}
          style={{ transition: "opacity 180ms ease-out" }}
        >
          <Arrow x1={152} y1={138} x2={230} y2={138} color={C.plus} width={2.6} />
        </g>
      )}
    </g>
  );
}

/* ---------- Данните ---------- */

export const conductorProblems: GuidedProblemData[] = [
  {
    title: "Черупка със собствен заряд",
    statement:
      "**Заряд в кухина.** Точков заряд $+2q$ стои в центъра на сферична кухина с радиус $a$ вътре в дебела проводяща черупка с външен радиус $b$. Черупката носи собствен заряд $-3q$. Намерете зарядите по двете ѝ повърхности и полето в трите области.",
    figure: p1Figure,
    figureHeight: 320,
    figureCaption: (phase) =>
      phase >= 3
        ? "По външната повърхност остава $-q$. Пълният заряд на системата е отрицателен, затова полето отвън сочи навътре."
        : phase >= 2
          ? "По вътрешната повърхност се събира точно $-2q$: толкова, колкото да компенсира заряда в кухината."
          : phase >= 1
            ? "Гаусовата сфера $S$ лежи изцяло в металния материал, където полето е нула."
            : undefined,
    directionQuestion: {
      prompt: "Гаусова сфера лежи изцяло в метала на черупката. Какъв пълен заряд обхваща тя?",
      options: [
        {
          text: "Нула",
          correct: true,
          why: "Полето в металния материал е нула, значи потокът през повърхността е нула. По закона на Гаус тогава и обхванатият заряд е нула.",
        },
        {
          text: "$+2q$",
          correct: false,
          why: "Това е само зарядът в кухината. Гаусовата сфера обхваща и вътрешната повърхност на черупката, а нейният заряд също влиза в сбора.",
        },
        {
          text: "$-3q$",
          correct: false,
          why: "$-3q$ е собственият заряд на цялата черупка. Той стои по двете ѝ повърхности, а гаусова сфера в метала обхваща само вътрешната от тях.",
        },
      ],
      explanation:
        "Това е единственият аргумент, който е нужен в цялата задача, и той не зависи от стойността на нито един заряд.",
    },
    additionQuestion: {
      prompt: "Какъв заряд стои тогава по вътрешната повърхност с радиус $a$?",
      options: [
        {
          text: "$-2q$",
          correct: true,
          why: "От $+2q+Q_{\\text{вътр}}=0$ следва точно $Q_{\\text{вътр}}=-2q$.",
        },
        {
          text: "$+2q$",
          correct: false,
          why: "При същия знак сборът щеше да е $+4q$, а не нула. Индуцираният заряд е винаги противоположен на този в кухината.",
        },
        {
          text: "$-3q$",
          correct: false,
          why: "$-3q$ е пълният собствен заряд на черупката. Вътрешната повърхност взима само толкова, колкото компенсира кухината, а остатъкът отива навън.",
        },
      ],
      explanation:
        "Обърнете внимание, че отговорът зависи само от заряда в кухината, не от собствения заряд на черупката.",
    },
    hints: [
      "Единственото, което е нужно, е че полето в проводящия материал е нула.",
      "Собственият заряд на черупката се разпределя само по двете ѝ повърхности - в обема ѝ заряд не остава.",
      "Проверка накрая: сборът на всички заряди трябва да е $2q-3q=-q$.",
    ],
    steps: [
      {
        text: "Гаусова сфера в метала не обхваща никакъв пълен заряд, защото полето там е нула.",
        latex: String.raw`\oint\vec E\cdot d\vec A=0\ \Rightarrow\ +2q+Q_{\text{вътр}}=0\ \Rightarrow\ Q_{\text{вътр}}=-2q`,
      },
      {
        text: "Собственият заряд на черупката е $-3q$ и се разпределя по двете повърхности.",
        latex: String.raw`Q_{\text{вътр}}+Q_{\text{външ}}=-3q\ \Rightarrow\ Q_{\text{външ}}=-3q+2q=-q`,
      },
      {
        text: "Сферичната симетрия прави всяко разпределение равномерно, затова плътностите излизат с просто деление на площта.",
        latex: String.raw`\sigma_{\text{вътр}}=-\frac{2q}{4\pi a^2},\qquad \sigma_{\text{външ}}=-\frac{q}{4\pi b^2}`,
      },
      {
        text: "Полето по области следва от обхванатия заряд. Извън черупката то е насочено навътре.",
        latex: String.raw`E(r<a)=\frac{2q}{4\pi\varepsilon_0r^2},\qquad E(a<r<b)=0,\qquad E(r>b)=\frac{-q}{4\pi\varepsilon_0r^2}`,
      },
    ],
    teacherNotes: [
      "Честа грешка: събиране на собствения заряд с индуцирания и отговор $-5q$ по вътрешната повърхност. Върнете ги към въпроса какво точно налага гаусовата сфера в метала.",
      "Контролен въпрос: ако черупката беше неутрална, какво щеше да се промени? Само външната повърхност - вътрешната винаги носи $-2q$.",
      "Знакът на полето отвън е диагностичен: то сочи навътре, макар зарядът в кухината да е положителен.",
    ],
  },
  {
    title: "Заземена черупка",
    statement:
      "**Заземяване.** Същата конфигурация: $+2q$ в кухината и черупка със собствен заряд $-3q$. Сега свързваме черупката със Земята. Кой заряд се променя и какво става с полето отвън?",
    figure: p2Figure,
    figureHeight: 330,
    figureCaption: (phase) =>
      phase >= 3
        ? "Външната повърхност е празна и полето извън черупката изчезва. Полето в кухината остава непроменено."
        : phase >= 2
          ? "По вътрешната повърхност пак стои $-2q$: заземяването не променя този аргумент."
          : phase >= 1
            ? "Гаусова сфера с $r>b$ обхваща всичко: заряда в кухината и двете повърхности."
            : "Черупката е свързана със Земята.",
    directionQuestion: {
      prompt: "Кой заряд може да напусне черупката през заземяващия проводник?",
      options: [
        {
          text: "Само този по външната повърхност",
          correct: true,
          why: "Той не е задържан от нищо: полето на $+2q$ е вече компенсирано от вътрешната повърхност и не стига до него.",
        },
        {
          text: "Само индуцираният по вътрешната повърхност",
          correct: false,
          why: "Точно обратното. Докато $+2q$ стои в кухината, вътрешната повърхност е длъжна да носи $-2q$, иначе полето в металния материал няма да е нула.",
        },
        {
          text: "И двата - черупката остава напълно празна",
          correct: false,
          why: "Ако вътрешната повърхност се изпразнеше, гаусова сфера в метала щеше да обхваща $+2q$ и там щеше да има поле. Това не е равновесие.",
        },
      ],
      explanation:
        "Заземяването дава на заряда път навън, но не отменя условието за равновесие вътре в метала.",
    },
    additionQuestion: {
      prompt: "Какво обхваща гаусова сфера с радиус $r>b$ след заземяването?",
      options: [
        {
          text: "$Q_{\\text{обхв}}=0$, следователно $E=0$",
          correct: true,
          why: "Обхванати са $+2q$ от кухината и $-2q$ по вътрешната повърхност, а външната вече е празна.",
        },
        {
          text: "$Q_{\\text{обхв}}=+2q$",
          correct: false,
          why: "Пропуснат е индуцираният $-2q$ по вътрешната повърхност. Той също лежи вътре в тази гаусова сфера.",
        },
        {
          text: "$Q_{\\text{обхв}}=-q$, както преди заземяването",
          correct: false,
          why: "$-q$ беше зарядът по външната повърхност, но точно той изтече в Земята. Затова сборът вече е друг.",
        },
      ],
      explanation:
        "Оттук идва и практическото приложение: заземената черупка екранира и навън, не само навътре.",
    },
    hints: [
      "Заземяването не пипа аргумента за полето в металния материал: то си остава нула.",
      "Земята е резервоар - дава или приема точно толкова заряд, колкото трябва, за да стане $V=0$.",
      "Полето в кухината се определя само от това, което е вътре в нея.",
    ],
    steps: [
      {
        text: "Аргументът за вътрешната повърхност не се променя от заземяването.",
        latex: String.raw`+2q+Q_{\text{вътр}}=0\ \Rightarrow\ Q_{\text{вътр}}=-2q`,
      },
      {
        text: "Заземяването позволява заряд да тече, докато потенциалът на черупката стане нула. При тази конфигурация това изпразва външната повърхност.",
        latex: String.raw`Q_{\text{външ}}=0`,
      },
      {
        text: "Черупката вече не носи $-3q$: през проводника към Земята са изтекли $-q$.",
        latex: String.raw`Q_{\text{черупка}}=Q_{\text{вътр}}+Q_{\text{външ}}=-2q`,
      },
      {
        text: "Гаусова сфера извън черупката вече не обхваща пълен заряд.",
        latex: String.raw`Q_{\text{обхв}}=+2q-2q=0\ \Rightarrow\ E(r>b)=0`,
      },
      {
        text: "В кухината нищо не се е променило.",
        latex: String.raw`E(r<a)=\frac{2q}{4\pi\varepsilon_0r^2}`,
      },
    ],
    teacherNotes: [
      "Заземеният проводник не е задължително незареден: тук по него остава $-2q$. Питайте къде точно седи този заряд.",
      "Отговорът „изтича целият заряд“ е най-честият. Диагностичен въпрос: какво държи индуцирания заряд на мястото му?",
      "Подчертайте условието: изводът $E=0$ отвън важи за тази сферична конфигурация без други външни заряди.",
    ],
  },
  {
    title: "Свързване на две сфери",
    statement:
      "**Две сфери.** Достатъчно отдалечени проводящи сфери с радиуси $R$ и $3R$ носят по заряд $q$. Свързваме ги с дълга тънка жица. Намерете крайните заряди, отношението на повърхностните плътности и загубената енергия.",
    figure: p3Figure,
    figureHeight: 300,
    figureCaption: (phase) =>
      phase >= 3
        ? "Плътността по малката сфера излиза 3 пъти по-голяма, а $\\Delta U=kq^2/(6R)$ се е разсеяла в жицата."
        : phase >= 2
          ? "Накрая малката носи $q/2$, а голямата $3q/2$: зарядите се отнасят като радиусите."
          : phase >= 1
            ? "Малката сфера е с по-висок потенциал, затова зарядът тръгва по жицата към голямата."
            : undefined,
    directionQuestion: {
      prompt: "Преди свързването коя сфера е с по-висок потенциал?",
      options: [
        {
          text: "Малката",
          correct: true,
          why: "Потенциалът на изолирана сфера е $V=kQ/R$. При равни заряди по-малкият радиус дава по-голям потенциал: $kq/R>kq/(3R)$.",
        },
        {
          text: "Голямата",
          correct: false,
          why: "Голямата носи същия заряд, но разпределен по-надалеч от центъра. Затова потенциалът ѝ е три пъти по-нисък, а не по-висок.",
        },
        {
          text: "Потенциалите са равни",
          correct: false,
          why: "Равни щяха да бъдат, ако зарядите се отнасяха като радиусите, тоест $q$ и $3q$. Тук и двете сфери носят по $q$.",
        },
      ],
      explanation:
        "Този въпрос решава посоката на тока, преди да е започнала каквато и да е сметка.",
    },
    additionQuestion: {
      prompt: "Накъде тече зарядът след свързването и кога спира?",
      options: [
        {
          text: "От малката към голямата, докато потенциалите се изравнят",
          correct: true,
          why: "Зарядът тече от по-високия към по-ниския потенциал и спира точно когато разликата стане нула.",
        },
        {
          text: "От голямата към малката, докато зарядите се изравнят",
          correct: false,
          why: "И посоката, и условието са сгрешени: голямата сфера е с по-нисък потенциал, а накрая зарядите не са равни, а се отнасят като радиусите.",
        },
        {
          text: "Никъде - зарядите вече са равни",
          correct: false,
          why: "Равни заряди не значат равни потенциали. Токът спира при равни потенциали, а те тук се различават три пъти.",
        },
      ],
      explanation:
        "Разликата между „изравняват се зарядите“ и „изравняват се потенциалите“ е най-скъпо струващата грешка в тази глава.",
    },
    hints: [
      "Две неща определят отговора: пълният заряд се запазва, а накрая потенциалите са равни.",
      "За изолирана сфера $V=kQ/R$, а електростатичната ѝ енергия е $U=kQ^2/(2R)$.",
      "$\\sigma=Q/(4\\pi R^2)$ - площта е с квадрата на радиуса.",
    ],
    steps: [
      {
        text: "Пълният заряд на системата се запазва.",
        latex: String.raw`Q_1'+Q_2'=q+q=2q`,
      },
      {
        text: "Жицата свързва двата проводника в един, затова потенциалите се изравняват.",
        latex: String.raw`\frac{kQ_1'}{R}=\frac{kQ_2'}{3R}\ \Rightarrow\ Q_2'=3Q_1'`,
      },
      {
        text: "Двете условия дават крайните заряди.",
        latex: String.raw`4Q_1'=2q\ \Rightarrow\ Q_1'=\frac{q}{2},\qquad Q_2'=\frac{3q}{2}`,
      },
      {
        text: "Плътностите се получават с деление на съответната площ.",
        latex: String.raw`\frac{\sigma_1}{\sigma_2}=\frac{Q_1'/R^2}{Q_2'/(9R^2)}=\frac{q/2}{q/6}=3`,
      },
      {
        text: "Началната и крайната енергия се смятат поотделно, а не се приема, че се запазват.",
        latex: String.raw`U_i=\frac{kq^2}{2R}+\frac{kq^2}{6R}=\frac{2kq^2}{3R},\qquad
        U_f=\frac{k(q/2)^2}{2R}+\frac{k(3q/2)^2}{6R}=\frac{kq^2}{2R}`,
      },
      {
        text: "Разликата се разсейва в жицата, докато зарядът тече.",
        latex: String.raw`\Delta U=U_i-U_f=\frac{kq^2}{R}\left(\frac{2}{3}-\frac{1}{2}\right)=\frac{kq^2}{6R}`,
      },
    ],
    teacherNotes: [
      "Най-честата грешка е изравняване на зарядите. Диагностичен въпрос: какво точно кара заряда да спре да тече?",
      "Резултатът $\\sigma\\propto1/R$ обяснява защо полето е най-силно при острите върхове - оттам тръгва короната и оттам работи гръмоотводът.",
      "Ако сферите бяха с $q$ и $3q$, потенциалите щяха да са равни още в началото, заряд нямаше да протече и енергията щеше да се запази. Струва си да се провери.",
    ],
  },
];
