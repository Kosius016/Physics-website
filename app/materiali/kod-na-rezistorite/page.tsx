import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";
import ResistorCodeLab from "@/components/materiali/ResistorCodeLab";
import {
  DIGIT_COLOR_NAMES,
  RESISTOR_COLORS,
  type ResistorColorName,
} from "@/components/materiali/resistorPalette";
import {
  ProblemStatement,
  ResultBox,
  Solution,
  SolutionPart,
} from "@/components/problem-sets/SolutionParts";

export const metadata = {
  title: "Цветен код и стойности на резисторите · SingularityLab",
  description:
    "Интерактивен справочник за четири- и петлентови резистори, множители, толеранс и проверка с мултицет.",
};

const SECTION_NAV = [
  { id: "direction", n: "§1", label: "Посока" },
  { id: "decoder", n: "§2", label: "Декодер" },
  { id: "table", n: "§3", label: "Таблица" },
  { id: "tolerance", n: "§4", label: "Толеранс" },
  { id: "practice", n: "§5", label: "Упражнение" },
  { id: "recap", n: "§6", label: "Обобщение" },
] as const;

const MULTIPLIER_LABELS: Partial<Record<ResistorColorName, string>> = {
  silver: "10^{-2}",
  gold: "10^{-1}",
  black: "10^0",
  brown: "10^1",
  red: "10^2",
  orange: "10^3",
  yellow: "10^4",
  green: "10^5",
  blue: "10^6",
  violet: "10^7",
};

const TOLERANCE_ROWS: readonly [ResistorColorName, string][] = [
  ["brown", "\\pm1\\%"],
  ["red", "\\pm2\\%"],
  ["green", "\\pm0{,}5\\%"],
  ["blue", "\\pm0{,}25\\%"],
  ["violet", "\\pm0{,}1\\%"],
  ["gray", "\\pm0{,}05\\%"],
  ["gold", "\\pm5\\%"],
  ["silver", "\\pm10\\%"],
];

function ColorSwatch({ color }: { color: ResistorColorName }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-4 w-4 rounded-full border border-ink/40"
        style={{ backgroundColor: RESISTOR_COLORS[color].hex }}
      />
      <span>{RESISTOR_COLORS[color].label}</span>
    </span>
  );
}

export default function ResistorCodePage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <nav
            aria-label="Път до материала"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/materiali?subject=physics&level=university&type=pregovor"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Материали
            </Link>
            <span aria-hidden="true">·</span>
            <span>Електрични вериги</span>
          </nav>
          <h1 className="mb-2 mt-2 font-serif text-[clamp(34px,7vw,48px)] font-bold leading-[1.08] text-ink">
            Цветен код и стойности на резисторите
          </h1>
          <p className="max-w-2xl text-[17px] text-muted">
            Коя лента е цифра, коя е множител и колко различно число може да покаже истинският
            резистор.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="direction" n="§1" title="От кой край се чете">
          <div className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15.5px] leading-relaxed">
            Намерете лентата, отделена по-далеч от останалите. Обикновено тя е златна, сребърна
            или друг цвят за толеранс. Поставете я вдясно и четете от противоположния край.
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="При четирилентов резистор отделената златна лента е вляво. Какво правите първо?"
              options={[
                {
                  text: "Завъртате резистора, така че златната лента да остане вдясно.",
                  correct: true,
                  why: "Златната лента не е значеща цифра. Тя означава толеранс и стои последна.",
                },
                {
                  text: "Записвате златната лента като първата цифра.",
                  correct: false,
                  why: "Златното няма цифрова стойност в позиция за значеща цифра.",
                },
                {
                  text: "Посоката няма значение, защото кодът е симетричен.",
                  correct: false,
                  why: "Позициите имат различни роли. Обратното четене разменя цифри, множител и толеранс.",
                },
              ]}
            />
          </div>

          <TeacherNote>
            <p>
              При неясни или избледнели ленти не гадайте по цвят. Проверете предполагаемата
              стойност с мултицет и я сравнете с наличната стандартна редица.
            </p>
          </TeacherNote>
        </Section>

        <Section id="decoder" n="§2" title="Сменете цветовете и сметнете">
          <ResistorCodeLab />

          <div className="mt-6 space-y-3 text-ink/90">
            <p>
              При четири ленти първите две са цифри, третата е множител, а четвъртата е
              толеранс:
            </p>
            <Formula latex={String.raw`R=(10a+b)\,10^m`} />
            <p>
              При пет ленти се добавя още една значеща цифра. Множителят се измества на четвърта
              позиция:
            </p>
            <Formula latex={String.raw`R=(100a+10b+c)\,10^m`} />
          </div>
        </Section>

        <Section id="table" n="§3" title="Цифри, множители и толеранс">
          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
            <table className="w-full min-w-[560px] border-collapse text-left text-[14px]">
              <thead className="bg-hl">
                <tr>
                  <th className="border-b-[1.5px] border-ink px-4 py-3 font-bold">Цвят</th>
                  <th className="border-b-[1.5px] border-ink px-4 py-3 font-bold">Цифра</th>
                  <th className="border-b-[1.5px] border-ink px-4 py-3 font-bold">Множител</th>
                </tr>
              </thead>
              <tbody>
                {DIGIT_COLOR_NAMES.map((color) => (
                  <tr key={color} className="border-b border-rule last:border-b-0">
                    <td className="px-4 py-2.5 font-semibold"><ColorSwatch color={color} /></td>
                    <td className="px-4 py-2.5"><RichText text={`$${RESISTOR_COLORS[color].digit}$`} /></td>
                    <td className="px-4 py-2.5"><RichText text={`$${MULTIPLIER_LABELS[color]}$`} /></td>
                  </tr>
                ))}
                {(["gold", "silver"] as ResistorColorName[]).map((color) => (
                  <tr key={color} className="border-b border-rule last:border-b-0">
                    <td className="px-4 py-2.5 font-semibold"><ColorSwatch color={color} /></td>
                    <td className="px-4 py-2.5 text-muted">няма</td>
                    <td className="px-4 py-2.5"><RichText text={`$${MULTIPLIER_LABELS[color]}$`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {TOLERANCE_ROWS.map(([color, tolerance]) => (
              <div key={color} className="flex items-center justify-between gap-3 rounded-lg border-[1.5px] border-rule bg-surface px-4 py-3">
                <ColorSwatch color={color} />
                <span className="font-bold text-ink"><RichText text={`$${tolerance}$`} /></span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="tolerance" n="§4" title="Стойността е интервал, не обещание">
          <ProblemStatement>
            <p>
              Резистор е означен като{" "}
              <RichText text={String.raw`$4{,}7\,\mathrm{k\Omega}\pm5\%$`} />. Намерете
              най-малката и най-голямата допустима стойност, после проверете истинския компонент
              с мултицет.
            </p>
          </ProblemStatement>

          <Solution hint={<span>Пет процента означава, че границите са <RichText text="$0{,}95R$" /> и <RichText text="$1{,}05R$" />.</span>}>
            <SolutionPart label="а" title="Намерете абсолютното отклонение">
              <Formula latex={String.raw`\Delta R=0{,}05\cdot4{,}7\,\mathrm{k\Omega}=0{,}235\,\mathrm{k\Omega}`} />
            </SolutionPart>
            <SolutionPart label="б" title="Запишете интервала">
              <Formula latex={String.raw`R_{\min}=4{,}465\,\mathrm{k\Omega},\qquad R_{\max}=4{,}935\,\mathrm{k\Omega}`} />
              <ResultBox>Показание вътре в този интервал е нормално за изправен резистор.</ResultBox>
            </SolutionPart>
            <SolutionPart label="в" title="Измерете правилно">
              <p>
                Извадете резистора от веригата или повдигнете единия му крак. При малки
                съпротивления първо допрете сондите една до друга и отчетете тяхното собствено
                съпротивление.
              </p>
            </SolutionPart>
          </Solution>
        </Section>

        <Section id="practice" n="§5" title="Три бързи упражнения">
          <ProblemStatement>
            <ol className="list-decimal space-y-3 pl-5">
              <li>Жълто, виолетово, червено, златно.</li>
              <li>Кафяво, черно, черно, кафяво, кафяво.</li>
              <li>Червено, червено, сребърно, златно.</li>
            </ol>
            <p>За всеки резистор намерете номиналната стойност, толеранса и допустимия интервал.</p>
          </ProblemStatement>

          <Solution hint={<span>Първо решете дали имате две или три значещи цифри. Едва след това приложете множителя.</span>}>
            <SolutionPart label="а" title="Жълто, виолетово, червено, златно">
              <Formula latex={String.raw`47\cdot10^2\,\Omega=4{,}7\,\mathrm{k\Omega}\pm5\%`} />
              <p><RichText text={String.raw`$4{,}465\,\mathrm{k\Omega}\le R\le4{,}935\,\mathrm{k\Omega}$`} /></p>
            </SolutionPart>
            <SolutionPart label="б" title="Кафяво, черно, черно, кафяво, кафяво">
              <Formula latex={String.raw`100\cdot10^1\,\Omega=1{,}00\,\mathrm{k\Omega}\pm1\%`} />
              <p><RichText text={String.raw`$990\,\Omega\le R\le1010\,\Omega$`} /></p>
            </SolutionPart>
            <SolutionPart label="в" title="Червено, червено, сребърно, златно">
              <Formula latex={String.raw`22\cdot10^{-2}\,\Omega=0{,}22\,\Omega\pm5\%`} />
              <p>
                При толкова малка стойност съпротивлението на сондите е сравнимо с това на
                компонента. Обикновеното двупроводно измерване може да е неточно.
              </p>
            </SolutionPart>
          </Solution>
        </Section>

        <Section id="recap" n="§6" title="Кратък алгоритъм">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
            <ol className="list-decimal space-y-2 pl-5 text-[15px]">
              <li>Поставете отделената лента за толеранс вдясно.</li>
              <li>Прочетете две или три значещи цифри.</li>
              <li>Умножете по множителя.</li>
              <li>Превърнете толеранса в допустим интервал.</li>
              <li>Проверете резистора извън веригата или с повдигнат крак.</li>
            </ol>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-[14.5px] font-semibold">
            <Link href="/zadachi/rezistorni-verigi" className="text-minus hover:underline">
              Задачи с резисторни вериги →
            </Link>
            <Link href="/materiali?subject=physics&level=university&type=pregovor" className="text-minus hover:underline">
              Всички материали за преговор →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
