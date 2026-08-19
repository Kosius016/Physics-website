import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProgressiveSolution from "@/components/materiali/ProgressiveSolution";
import type { RichTextString } from "@/lib/types";
import {
  BeatsLab,
  HarmonicSampleLab,
  InterferenceLab,
  LambdaFreqLab,
  RotationLab,
} from "@/components/interactives/WaveProblemLabs";

export const metadata = {
  title: "Честота, период и вълни: задачи с решения · STEM Платформа",
  description:
    "Двадесет задачи за въртеливо движение, честота, период, дължина и скорост на вълната, фаза, интерференция и биения, с решения, които се отключват стъпка по стъпка.",
};

const NAV = [
  { id: "rotation", n: "§1", label: "Въртене" },
  { id: "period", n: "§2", label: "Честота и период" },
  { id: "waves", n: "§3", label: "Дължина и скорост" },
  { id: "phase", n: "§4", label: "Фаза" },
  { id: "interference", n: "§5", label: "Интерференция" },
  { id: "beats", n: "§6", label: "Биения" },
  { id: "ac", n: "§7", label: "Променлив ток" },
  { id: "recap", n: "§8", label: "Обобщение" },
] as const;

/* ------------------------------------------------------------- скелети */

function ProblemStatement({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
      <p className="text-[11px] font-bold uppercase tracking-[.16em] text-plus">Условие</p>
      <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

function ProblemTitle({ n, title }: { n: number; title: RichTextString }) {
  return (
    <h3 className="mb-3 mt-9 font-serif text-[21px] font-bold text-ink">
      <span className="mr-2 text-[13px] font-bold uppercase tracking-[.16em] text-minus">
        Задача {n}
      </span>
      <RichText text={title} />
    </h3>
  );
}

function SolutionPart({
  label,
  title,
  children,
}: {
  label: string;
  title: RichTextString;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[2.5rem_1fr]">
      <div
        aria-hidden="true"
        data-solution-step={label}
        className="flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] border-ink bg-hl text-[13px] font-bold text-ink"
      >
        {label}
      </div>
      <div className="min-w-0">
        <h4 className="font-serif text-[19px] font-bold">
          <span className="sr-only">Подточка {label}: </span>
          <RichText text={title} />
        </h4>
        <div className="mt-2 space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
      </div>
    </div>
  );
}

function ResultBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-r-lg border-l-4 border-ok bg-ok/10 px-4 py-3 text-[15px] font-semibold">
      {children}
    </div>
  );
}

export default function WaveHomeworkPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pb-2 pt-11">
        <Link href="/zadachi" className="text-[13px] font-semibold text-minus hover:underline">
          Задачи / Трептения и вълни
        </Link>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-minus">
          Практикум с водени решения
        </p>
        <h1 className="mt-2 font-serif text-[clamp(36px,7vw,54px)] font-bold leading-[1.04] text-ink">
          Честота, период и вълни
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Двадесет задачи със сбити условия и решения, които се отключват стъпка по стъпка.
          Където условието иска графика, тя е налична като симулация в текстовата колона.
        </p>

        <div className="mt-6 rounded-[10px] border-[1.5px] border-rule bg-hl px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-minus">
            Полезни зависимости
          </p>
          <div className="mt-3 space-y-3">
            <Formula latex={String.raw`v=R\omega,\qquad \omega=\frac{d\theta}{dt}`} />
            <Formula latex={String.raw`\omega=2\pi f=\frac{2\pi}{T},\qquad T=\frac1f`} />
            <Formula latex={String.raw`v_{\text{вълна}}=\lambda f=\frac{\lambda}{T}`} />
          </div>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink/90">
            В <RichText text="§4" /> и <RichText text="§5" /> се добавят{" "}
            <RichText text={String.raw`$\Delta\varphi=2\pi\dfrac{\Delta t}{T}$`} /> и{" "}
            <RichText text={String.raw`$\Delta\varphi=2\pi\dfrac{\Delta r}{\lambda}$`} />, а
            резултантната амплитуда на две трептения с еднаква амплитуда е{" "}
            <RichText text={String.raw`$A_{\text{рез}}=2A\cos\dfrac{\Delta\varphi}{2}$`} />.
          </p>
        </div>
      </header>

      <LessonNav items={NAV} />

      {/* =========================================================== §1 */}
      <Section id="rotation" n="§1" title="От въртеливо движение към честота">
        <ProblemTitle n={1} title="Въртяща се точка" />
        <ProblemStatement>
          <p>
            Точка се движи по окръжност с радиус <RichText text={String.raw`$R=0{,}25\,\mathrm{m}$`} /> и
            прави <RichText text="$3$" /> пълни обиколки за секунда.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              Намерете честотата <RichText text="$f$" />.
            </li>
            <li>
              Намерете периода <RichText text="$T$" />.
            </li>
            <li>
              Намерете ъгловата честота <RichText text={String.raw`$\omega$`} />.
            </li>
            <li>
              Намерете линейната скорост <RichText text="$v$" />.
            </li>
            <li>
              Намерете ъгъла за <RichText text={String.raw`$0{,}40\,\mathrm{s}$`} />.
            </li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <RotationLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`„Три обиколки за секунда“ е буквално определението на честотата. Всичко останало следва от $T=1/f$, $\omega=2\pi f$ и $v=R\omega$.`}
            />
          }
        >
          <SolutionPart label="a" title="Честотата се чете направо">
            <p>Честотата е броят пълни обиколки за единица време, тоест данните вече я дават.</p>
            <Formula latex={String.raw`f=3\ \mathrm{Hz}`} />
          </SolutionPart>

          <SolutionPart label="b" title="Периодът е обратната стойност">
            <p>Периодът е времето за една обиколка.</p>
            <Formula latex={String.raw`T=\frac1f=\frac13=0{,}33\ \mathrm{s}`} />
          </SolutionPart>

          <SolutionPart label="c" title={String.raw`Ъглова честота`}>
            <p>
              За една обиколка ъгълът нараства с <RichText text={String.raw`$2\pi$`} />, затова
              ъгловата честота е <RichText text={String.raw`$2\pi$`} /> пъти честотата.
            </p>
            <Formula latex={String.raw`\omega=2\pi f=6\pi=18{,}85\ \mathrm{rad/s}`} />
          </SolutionPart>

          <SolutionPart label="d" title="Линейна скорост">
            <p>Линейната скорост е изминатата дъга за единица време.</p>
            <Formula latex={String.raw`v=R\omega=0{,}25\cdot6\pi=1{,}5\pi=4{,}71\ \mathrm{m/s}`} />
          </SolutionPart>

          <SolutionPart label="e" title="Изминат ъгъл">
            <p>Ъгълът расте равномерно, значи е произведение на ъгловата честота и времето.</p>
            <Formula latex={String.raw`\theta=\omega t=6\pi\cdot0{,}40=2{,}4\pi=7{,}54\ \mathrm{rad}`} />
            <ResultBox>
              <RichText
                text={String.raw`Проверка: $2{,}4\pi/2\pi=1{,}2$ обиколки, тоест $432^\circ$. При $3$ обиколки в секунда за $0{,}40\,\mathrm{s}$ наистина се очакват $1{,}2$ обиколки.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={2} title="От ъглова честота към период" />
        <ProblemStatement>
          <p>
            Колело се върти с ъглова честота{" "}
            <RichText text={String.raw`$\omega=8\pi\ \mathrm{rad/s}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете честотата.</li>
            <li>Намерете периода.</li>
            <li>
              Намерете броя пълни завъртания за <RichText text={String.raw`$15\,\mathrm{s}$`} />.
            </li>
            <li>
              Намерете ъгъла за <RichText text={String.raw`$0{,}125\,\mathrm{s}$`} />.
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Всички въпроси излизат от една връзка: $\omega=2\pi f$. Обърнете я и продължавайте.`}
            />
          }
        >
          <SolutionPart label="a" title="Обръщаме връзката">
            <Formula latex={String.raw`f=\frac{\omega}{2\pi}=\frac{8\pi}{2\pi}=4\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Период">
            <Formula latex={String.raw`T=\frac1f=0{,}25\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Брой завъртания">
            <p>Времето, разделено на времето за едно завъртане.</p>
            <Formula
              latex={String.raw`N=\frac{t}{T}=\frac{15}{0{,}25}=60\qquad\left(\text{или }N=ft=4\cdot15=60\right)`}
            />
          </SolutionPart>
          <SolutionPart label="d" title="Изминат ъгъл">
            <Formula latex={String.raw`\theta=\omega t=8\pi\cdot0{,}125=\pi\ \mathrm{rad}=180^\circ`} />
            <ResultBox>
              <RichText
                text={String.raw`Числото си струва да се прочете: $0{,}125\,\mathrm{s}$ е точно половин период, а за половин период колелото прави половин оборот.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={3} title="Сравнение на две въртящи се точки" />
        <ProblemStatement>
          <p>Две точки се движат по окръжности:</p>
          <Formula
            latex={String.raw`R_1=0{,}10\,\mathrm{m},\ \ \omega_1=20\,\mathrm{rad/s};\qquad R_2=0{,}25\,\mathrm{m},\ \ \omega_2=8\,\mathrm{rad/s}`}
          />
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Коя точка има по-голяма честота?</li>
            <li>Коя има по-голям период?</li>
            <li>Сравнете линейните им скорости.</li>
            <li>
              Възможно ли е две точки да имат различни <RichText text={String.raw`$\omega$`} />, но
              еднакви линейни скорости?
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Честотата и периодът зависят само от $\omega$. Линейната скорост зависи и от радиуса: $v=R\omega$.`}
            />
          }
        >
          <SolutionPart label="a" title="Честоти">
            <Formula
              latex={String.raw`f_1=\frac{20}{2\pi}=3{,}18\ \mathrm{Hz},\qquad f_2=\frac{8}{2\pi}=1{,}27\ \mathrm{Hz}`}
            />
            <p>Първата точка има по-голяма честота.</p>
          </SolutionPart>
          <SolutionPart label="b" title="Периоди">
            <p>
              Периодът е обратно пропорционален на <RichText text={String.raw`$\omega$`} />, затова
              редът се обръща.
            </p>
            <Formula
              latex={String.raw`T_1=\frac{2\pi}{20}=0{,}31\ \mathrm{s},\qquad T_2=\frac{2\pi}{8}=0{,}79\ \mathrm{s}`}
            />
            <p>Втората точка има по-голям период.</p>
          </SolutionPart>
          <SolutionPart label="c" title="Линейни скорости">
            <Formula
              latex={String.raw`v_1=0{,}10\cdot20=2{,}0\ \mathrm{m/s},\qquad v_2=0{,}25\cdot8=2{,}0\ \mathrm{m/s}`}
            />
            <ResultBox>
              Скоростите са равни, въпреки че всички останали величини се различават.
            </ResultBox>
          </SolutionPart>
          <SolutionPart label="d" title="Кога съвпадат скоростите">
            <p>
              Да, и предната подточка е точно такъв пример. Условието е произведението да
              съвпада.
            </p>
            <Formula latex={String.raw`R_1\omega_1=R_2\omega_2`} />
            <p>
              Смисълът: <RichText text={String.raw`$\omega$`} /> казва колко бързо се мени{" "}
              <strong>ъгълът</strong>, а <RichText text="$v$" /> колко бързо се изминава{" "}
              <strong>дъгата</strong>. По-малка окръжност с по-бързо въртене дава същата дъга за
              единица време.
            </p>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §2 */}
      <Section id="period" n="§2" title="Честота и период">
        <ProblemTitle n={4} title="Махало" />
        <ProblemStatement>
          <p>
            Махало извършва <RichText text="$24$" /> пълни трептения за{" "}
            <RichText text={String.raw`$12\,\mathrm{s}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете честотата.</li>
            <li>Намерете периода.</li>
            <li>Намерете ъгловата честота.</li>
            <li>Колко трептения ще извърши за една минута?</li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={<RichText text={String.raw`Честотата е брой трептения, разделен на времето: $f=N/t$.`} />}
        >
          <SolutionPart label="a" title="Честота">
            <Formula latex={String.raw`f=\frac{N}{t}=\frac{24}{12}=2\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Период">
            <Formula latex={String.raw`T=\frac1f=0{,}5\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Ъглова честота">
            <Formula latex={String.raw`\omega=2\pi f=4\pi=12{,}57\ \mathrm{rad/s}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Трептения за минута">
            <Formula latex={String.raw`N=ft=2\cdot60=120`} />
            <ResultBox>
              <RichText
                text={String.raw`Проверка по друг път: $60/0{,}5=120$. Двете сметки са едно и също нещо, погледнато веднъж през честотата и веднъж през периода.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={5} title="Как се променят величините" />
        <ProblemStatement>
          <p>
            Източник има честота <RichText text="$f$" />, период <RichText text="$T$" /> и ъглова
            честота <RichText text={String.raw`$\omega$`} />. Определете какво става с{" "}
            <RichText text="$T$" /> и <RichText text={String.raw`$\omega$`} />, ако:
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>честотата стане два пъти по-голяма;</li>
            <li>честотата стане три пъти по-малка;</li>
            <li>периодът стане четири пъти по-голям;</li>
            <li>ъгловата честота стане два пъти по-малка.</li>
          </ol>
          <p className="text-[14.5px] text-muted">Не използвайте конкретни числа.</p>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Двете връзки казват всичко: $T=1/f$ прави периода **обратно** пропорционален, а $\omega=2\pi f$ прави ъгловата честота **право** пропорционална.`}
            />
          }
        >
          <SolutionPart label="a" title={String.raw`Честотата се удвоява`}>
            <Formula latex={String.raw`f\to2f\quad\Longrightarrow\quad T\to\frac T2,\qquad \omega\to2\omega`} />
          </SolutionPart>
          <SolutionPart label="b" title="Честотата пада три пъти">
            <Formula latex={String.raw`f\to\frac f3\quad\Longrightarrow\quad T\to3T,\qquad \omega\to\frac{\omega}{3}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Периодът расте четири пъти">
            <Formula latex={String.raw`T\to4T\quad\Longrightarrow\quad f\to\frac f4,\qquad \omega\to\frac{\omega}{4}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Ъгловата честота пада двойно">
            <Formula latex={String.raw`\omega\to\frac{\omega}{2}\quad\Longrightarrow\quad f\to\frac f2,\qquad T\to2T`} />
            <ResultBox>
              <RichText
                text={String.raw`Общото правило: $f$ и $\omega$ **винаги** се менят по един и същ множител, защото се различават само с постоянното $2\pi$. Периодът се мени по обратния множител.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={6} title={String.raw`Източник с $y(t)=4\sin(10\pi t)\ \mathrm{cm}$`} />
        <ProblemStatement>
          <p>Източник извършва хармонично трептене по закона от заглавието.</p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              Намерете амплитудата <RichText text="$A$" />.
            </li>
            <li>
              Намерете ъгловата честота <RichText text={String.raw`$\omega$`} />.
            </li>
            <li>
              Намерете честотата <RichText text="$f$" />.
            </li>
            <li>
              Намерете периода <RichText text="$T$" />.
            </li>
            <li>
              Намерете <RichText text="$y$" /> при{" "}
              <RichText
                text={String.raw`$t=0$, $0{,}05\,\mathrm{s}$, $0{,}10\,\mathrm{s}$ и $0{,}15\,\mathrm{s}$`}
              />
              .
            </li>
            <li>Начертайте графиката за два пълни периода.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <HarmonicSampleLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Сравнете записа с общия вид $y=A\sin(\omega t)$ и просто прочетете кое число къде стои.`}
            />
          }
        >
          <SolutionPart label="a" title="Амплитуда">
            <p>Множителят пред синуса.</p>
            <Formula latex={String.raw`A=4\ \mathrm{cm}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Ъглова честота">
            <p>
              Множителят пред <RichText text="$t$" /> в аргумента.
            </p>
            <Formula latex={String.raw`\omega=10\pi=31{,}42\ \mathrm{rad/s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Честота">
            <Formula latex={String.raw`f=\frac{\omega}{2\pi}=\frac{10\pi}{2\pi}=5\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Период">
            <Formula latex={String.raw`T=\frac1f=0{,}2\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="e" title="Стойностите в четирите момента">
            <p>
              Преди сметките забелязваме, че зададените моменти са точно четвъртини от периода:{" "}
              <RichText
                text={String.raw`$0{,}05=T/4$, $0{,}10=T/2$, $0{,}15=3T/4$`}
              />
              .
            </p>
            <Formula
              latex={String.raw`\begin{aligned}
y(0)&=4\sin 0=0\\
y(0{,}05)&=4\sin\tfrac\pi2=+4\ \mathrm{cm}\\
y(0{,}10)&=4\sin\pi=0\\
y(0{,}15)&=4\sin\tfrac{3\pi}{2}=-4\ \mathrm{cm}
\end{aligned}`}
            />
          </SolutionPart>
          <SolutionPart label="f" title="Графиката">
            <p>
              Два периода са <RichText text={String.raw`$0{,}4\,\mathrm{s}$`} />. Кривата тръгва от
              нулата нагоре и се повтаря два пъти, както в симулацията над решението.
            </p>
            <ResultBox>
              <RichText
                text={String.raw`Схемата $0,\ +A,\ 0,\ -A$ не зависи от конкретните числа: тя следва само от това, че моментите падат на четвъртините.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §3 */}
      <Section id="waves" n="§3" title="Дължина и скорост на вълната">
        <ProblemTitle n={7} title="Вълна по въже" />
        <ProblemStatement>
          <p>
            По въже се разпространява вълна със скорост{" "}
            <RichText text={String.raw`$v=12\,\mathrm{m/s}$`} />. Източникът извършва{" "}
            <RichText text="$4$" /> трептения за секунда.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете честотата.</li>
            <li>Намерете периода.</li>
            <li>Намерете дължината на вълната.</li>
            <li>
              Колко дължини на вълната се побират в <RichText text={String.raw`$15\,\mathrm{m}$`} />?
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Дължината на вълната е разстоянието, изминато за **един период**: $\lambda=vT=v/f$.`}
            />
          }
        >
          <SolutionPart label="a" title="Честота">
            <Formula latex={String.raw`f=4\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Период">
            <Formula latex={String.raw`T=\frac1f=0{,}25\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Дължина на вълната">
            <Formula latex={String.raw`\lambda=vT=\frac vf=\frac{12}{4}=3\ \mathrm{m}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Колко се побират">
            <Formula latex={String.raw`N=\frac{15}{3}=5`} />
            <ResultBox>
              Честотата е свойство на източника, скоростта е свойство на средата, а дължината на
              вълната се получава от двете.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={8} title="Промяна на честотата в същата среда" />
        <ProblemStatement>
          <p>
            Вълна се разпространява в една и съща среда със скорост{" "}
            <RichText text={String.raw`$20\,\mathrm{m/s}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              Намерете <RichText text={String.raw`$\lambda$`} /> при{" "}
              <RichText text={String.raw`$f=2\,\mathrm{Hz}$`} />.
            </li>
            <li>
              Намерете <RichText text={String.raw`$\lambda$`} /> при{" "}
              <RichText text={String.raw`$f=5\,\mathrm{Hz}$`} />.
            </li>
            <li>
              Намерете <RichText text={String.raw`$\lambda$`} /> при{" "}
              <RichText text={String.raw`$f=10\,\mathrm{Hz}$`} />.
            </li>
            <li>
              Начертайте графика на <RichText text={String.raw`$\lambda(f)$`} />.
            </li>
            <li>
              Каква пропорционалност има между <RichText text={String.raw`$\lambda$`} /> и{" "}
              <RichText text="$f$" /> при постоянна скорост?
            </li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <LambdaFreqLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Скоростта е фиксирана от средата, затова навсякъде важи едно и също: $\lambda=v/f$.`}
            />
          }
        >
          <SolutionPart label="a" title="Първата стойност">
            <Formula latex={String.raw`\lambda=\frac{20}{2}=10\ \mathrm{m}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Втората стойност">
            <Formula latex={String.raw`\lambda=\frac{20}{5}=4\ \mathrm{m}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Третата стойност">
            <Formula latex={String.raw`\lambda=\frac{20}{10}=2\ \mathrm{m}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Видът на графиката">
            <p>
              Графиката е <strong>хипербола</strong>: при малки честоти върви високо и стръмно
              пада, а при големи се снишава и се доближава до оста, без да я достига. Бутонът
              „Задача 8“ в симулацията поставя точно тази скорост.
            </p>
          </SolutionPart>
          <SolutionPart label="e" title="Каква е пропорционалността">
            <Formula
              latex={String.raw`\lambda f=v=\mathrm{const}\quad\Longrightarrow\quad \lambda\propto\frac1f`}
            />
            <ResultBox>
              <RichText
                text={String.raw`Обратна пропорционалност. Проверка с числата: $10\cdot2=4\cdot5=2\cdot10=20$.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={9} title="Звукова вълна" />
        <ProblemStatement>
          <p>
            Скоростта на звука във въздуха приемете за{" "}
            <RichText text={String.raw`$v=340\,\mathrm{m/s}$`} />. Намерете дължината на вълната при:
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              <RichText text={String.raw`$f=100\,\mathrm{Hz}$`} />;
            </li>
            <li>
              <RichText text={String.raw`$f=500\,\mathrm{Hz}$`} />;
            </li>
            <li>
              <RichText text={String.raw`$f=1000\,\mathrm{Hz}$`} />.
            </li>
          </ol>
          <p>Кой от трите звука има най-голям период, най-голяма дължина на вълната и най-висок тон?</p>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Скоростта е една и съща и за трите, затова $\lambda$ зависи само от честотата.`}
            />
          }
        >
          <SolutionPart label="a" title="Трите дължини">
            <Formula
              latex={String.raw`\lambda_1=\frac{340}{100}=3{,}4\ \mathrm{m},\qquad \lambda_2=\frac{340}{500}=0{,}68\ \mathrm{m},\qquad \lambda_3=\frac{340}{1000}=0{,}34\ \mathrm{m}`}
            />
          </SolutionPart>
          <SolutionPart label="b" title="Най-голям период">
            <p>
              Най-ниската честота, тоест <RichText text={String.raw`$100\,\mathrm{Hz}$`} /> с{" "}
              <RichText text={String.raw`$T=0{,}01\,\mathrm{s}$`} />.
            </p>
          </SolutionPart>
          <SolutionPart label="c" title="Най-голяма дължина и най-висок тон">
            <p>
              Най-голяма дължина има пак <RichText text={String.raw`$100\,\mathrm{Hz}$`} />, и това не
              е съвпадение: при фиксирана скорост <RichText text={String.raw`$\lambda=vT$`} />, тоест{" "}
              <RichText text={String.raw`$\lambda$`} /> и <RichText text="$T$" /> са пропорционални.
              Най-висок тон има най-високата честота, <RichText text={String.raw`$1000\,\mathrm{Hz}$`} />.
            </p>
            <ResultBox>
              Ниските тонове са дълги вълни от няколко метра, високите са къси от десетки
              сантиметри. Затова басите заобикалят препятствия по-лесно.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={10} title="Разстояние между гребените" />
        <ProblemStatement>
          <p>
            На снимка на водна повърхност разстоянието от първия до петия гребен е{" "}
            <RichText text={String.raw`$1{,}20\,\mathrm{m}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Колко пълни дължини на вълната има между първия и петия гребен?</li>
            <li>
              Намерете <RichText text={String.raw`$\lambda$`} />.
            </li>
            <li>
              Ако честотата е <RichText text={String.raw`$2{,}5\,\mathrm{Hz}$`} />, намерете скоростта.
            </li>
            <li>
              За колко време вълната ще измине <RichText text={String.raw`$3\,\mathrm{m}$`} />?
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Внимавайте с броенето: между $5$ гребена има $4$ междини. Това е най-честата грешка в задачата.`}
            />
          }
        >
          <SolutionPart label="a" title="Брой междини">
            <Formula latex={String.raw`N=5-1=4`} />
          </SolutionPart>
          <SolutionPart label="b" title="Дължина на вълната">
            <Formula latex={String.raw`\lambda=\frac{1{,}20}{4}=0{,}30\ \mathrm{m}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Скорост">
            <Formula latex={String.raw`v=\lambda f=0{,}30\cdot2{,}5=0{,}75\ \mathrm{m/s}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Време за три метра">
            <Formula latex={String.raw`t=\frac{s}{v}=\frac{3}{0{,}75}=4\ \mathrm{s}`} />
            <ResultBox>
              <RichText
                text={String.raw`Ако някой раздели на $5$ вместо на $4$, ще получи $\lambda=0{,}24\,\mathrm{m}$ и $v=0{,}60\,\mathrm{m/s}$, тоест около $20\%$ грешка само от преброяването.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={11} title="Какво се променя в нова среда" />
        <ProblemStatement>
          <p>
            Вълна преминава от първа във втора среда. Честотата на източника е{" "}
            <RichText text={String.raw`$5\,\mathrm{Hz}$`} />, а скоростите са{" "}
            <RichText text={String.raw`$v_1=10\,\mathrm{m/s}$`} /> и{" "}
            <RichText text={String.raw`$v_2=6\,\mathrm{m/s}$`} />. Намерете{" "}
            <RichText text={String.raw`$\lambda_1$`} /> и <RichText text={String.raw`$\lambda_2$`} /> и
            отговорете:
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Променя ли се честотата при преминаването?</li>
            <li>Променя ли се периодът?</li>
            <li>Коя величина причинява промяната на дължината на вълната?</li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Запитайте се кое се задава от **източника** и кое от **средата**. Едното от двете не може да се промени на границата.`}
            />
          }
        >
          <SolutionPart label="a" title="Двете дължини и честотата">
            <Formula
              latex={String.raw`\lambda_1=\frac{10}{5}=2{,}0\ \mathrm{m},\qquad \lambda_2=\frac{6}{5}=1{,}2\ \mathrm{m}`}
            />
            <p>
              Честотата <strong>не се променя</strong>. Границата между двете среди трепти
              толкова пъти в секунда, колкото я разклаща падащата вълна. Ако честотата се
              променяше, на границата щяха да се появяват или изчезват трептения, а няма откъде.
            </p>
          </SolutionPart>
          <SolutionPart label="b" title="Периодът">
            <p>
              Също не се променя, защото <RichText text="$T=1/f$" />. И в двете среди{" "}
              <RichText text={String.raw`$T=0{,}2\,\mathrm{s}$`} />.
            </p>
          </SolutionPart>
          <SolutionPart label="c" title="Кое причинява промяната">
            <p>
              Промяната идва изцяло от <strong>скоростта</strong>, която е свойство на средата.
            </p>
            <Formula latex={String.raw`\frac{\lambda_2}{\lambda_1}=\frac{v_2}{v_1}=\frac{6}{10}=0{,}6`} />
            <ResultBox>
              Картината: за един и същ период вълната изминава по-малко разстояние в по-бавната
              среда, затова гребените се сгъстяват.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §4 */}
      <Section id="phase" n="§4" title="Фаза и сравняване на вълни">
        <ProblemTitle n={12} title="Еднаква честота, различна фаза" />
        <ProblemStatement>
          <p>Дадени са двете трептения</p>
          <Formula
            latex={String.raw`y_1(t)=3\sin(4\pi t)\ \mathrm{cm},\qquad y_2(t)=3\sin\left(4\pi t+\frac{\pi}{2}\right)\ \mathrm{cm}`}
          />
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              Намерете <RichText text="$f$" /> и <RichText text="$T$" />.
            </li>
            <li>Каква е фазовата разлика?</li>
            <li>На каква част от периода съответства тя?</li>
            <li>Коя вълна достига максимума си първа?</li>
            <li>Начертайте двете функции в една координатна система за един период.</li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <InterferenceLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Максимумът на синуса е там, където целият аргумент стане $\pi/2$. Сравнете кога това се случва за всяка от двете.`}
            />
          }
        >
          <SolutionPart label="a" title="Честота и период">
            <Formula
              latex={String.raw`\omega=4\pi\ \mathrm{rad/s}\quad\Longrightarrow\quad f=2\ \mathrm{Hz},\qquad T=0{,}5\ \mathrm{s}`}
            />
            <p>
              И двете имат един и същ множител пред <RichText text="$t$" />, значи една и съща
              честота. Само затова изобщо има смисъл да говорим за постоянна фазова разлика.
            </p>
          </SolutionPart>
          <SolutionPart label="b" title="Фазова разлика">
            <Formula latex={String.raw`\Delta\varphi=\frac\pi2-0=\frac\pi2=90^\circ`} />
          </SolutionPart>
          <SolutionPart label="c" title="Част от периода">
            <Formula
              latex={String.raw`\frac{\Delta\varphi}{2\pi}=\frac14\quad\Longrightarrow\quad \Delta t=\frac T4=0{,}125\ \mathrm{s}`}
            />
          </SolutionPart>
          <SolutionPart label="d" title="Коя е първа">
            <Formula
              latex={String.raw`\begin{aligned}
y_2:\quad &4\pi t+\frac\pi2=\frac\pi2\ \Longrightarrow\ t=0\\
y_1:\quad &4\pi t=\frac\pi2\ \Longrightarrow\ t=0{,}125\ \mathrm{s}
\end{aligned}`}
            />
            <ResultBox>
              <RichText
                text={String.raw`Първа е $y_2$, с една четвърт период по-рано. Правилото: положителна добавка в аргумента измества кривата **наляво**, тоест напред във времето.`}
              />
            </ResultBox>
          </SolutionPart>
          <SolutionPart label="e" title="Графиката">
            <p>
              Двете криви са с еднаква форма и амплитуда, изместени с{" "}
              <RichText text="$T/4$" />. В симулацията поставете{" "}
              <RichText text={String.raw`$\Delta\varphi=90^\circ$`} />: оранжевата е{" "}
              <RichText text="$y_1$" />, синята е <RichText text="$y_2$" />, а оранжевата отсечка
              долу е отместването <RichText text={String.raw`$\Delta t$`} />.
            </p>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={13} title="Закъсняла вълна" />
        <ProblemStatement>
          <p>
            Една вълна има период <RichText text={String.raw`$T=0{,}80\,\mathrm{s}$`} />. Втората
            закъснява спрямо нея с <RichText text={String.raw`$\Delta t=0{,}20\,\mathrm{s}$`} />.
            Използвайте <RichText text={String.raw`$\Delta\varphi=2\pi\dfrac{\Delta t}{T}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете фазовата разлика.</li>
            <li>Конструктивна или деструктивна интерференция се получава при еднакви амплитуди?</li>
            <li>
              Какво ще бъде закъснението за фазова разлика <RichText text={String.raw`$\pi$`} />?
            </li>
            <li>
              А за <RichText text={String.raw`$2\pi$`} />?
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Внимавайте с втората подточка: между „конструктивна“ и „деструктивна“ има цял непрекъснат диапазон.`}
            />
          }
        >
          <SolutionPart label="a" title="Фазова разлика">
            <Formula
              latex={String.raw`\Delta\varphi=2\pi\cdot\frac{0{,}20}{0{,}80}=\frac\pi2=90^\circ`}
            />
          </SolutionPart>
          <SolutionPart label="b" title="Какъв вид интерференция">
            <p>
              <strong>Нито едното, нито другото.</strong> Резултантната амплитуда е
            </p>
            <Formula
              latex={String.raw`A_{\text{рез}}=2A\cos\frac{\Delta\varphi}{2}=2A\cos\frac\pi4=A\sqrt2\approx1{,}41\,A`}
            />
            <p>
              Това е между нулата и <RichText text="$2A$" />, тоест междинен случай. Конструктивна
              интерференция изисква <RichText text={String.raw`$\Delta\varphi=0,\ 2\pi,\ 4\pi,\dots$`} />,
              а деструктивна изисква <RichText text={String.raw`$\Delta\varphi=\pi,\ 3\pi,\dots$`} />
            </p>
          </SolutionPart>
          <SolutionPart label="c" title="Закъснение за половин оборот на фазата">
            <Formula
              latex={String.raw`\Delta t=\frac{\Delta\varphi}{2\pi}\,T=\frac{\pi}{2\pi}\cdot0{,}80=\frac T2=0{,}40\ \mathrm{s}`}
            />
          </SolutionPart>
          <SolutionPart label="d" title="Закъснение за пълен оборот">
            <Formula latex={String.raw`\Delta t=\frac{2\pi}{2\pi}\cdot0{,}80=T=0{,}80\ \mathrm{s}`} />
            <ResultBox>
              Закъснение с цял период не се различава по нищо от липса на закъснение. Затова
              фазовата разлика има смисъл само с точност до <RichText text={String.raw`$2\pi$`} />.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §5 */}
      <Section id="interference" n="§5" title="Интерференция">
        <ProblemTitle n={14} title="Две еднакви вълни" />
        <ProblemStatement>
          <p>Намерете резултантната вълна и вида на интерференцията:</p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              <RichText text={String.raw`$y_1=2\sin\omega t$, $y_2=2\sin\omega t$`} />;
            </li>
            <li>
              <RichText text={String.raw`$y_1=2\sin\omega t$, $y_2=2\sin(\omega t+\pi)$`} />;
            </li>
            <li>
              <RichText
                text={String.raw`$y_1=2\sin\omega t$, $y_2=2\sin\left(\omega t+\frac\pi2\right)$`}
              />
              .
            </li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <InterferenceLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`За третия случай ползвайте $\sin\alpha+\sin\beta=2\sin\left(\dfrac{\alpha+\beta}{2}\right)\cos\left(\dfrac{\alpha-\beta}{2}\right)$.`}
            />
          }
        >
          <SolutionPart label="a" title="Еднакви фази">
            <Formula latex={String.raw`y=2\sin\omega t+2\sin\omega t=4\sin\omega t`} />
            <p>
              Амплитуда <RichText text="$4$" />, тоест <strong>конструктивна</strong>{" "}
              интерференция. Това е максимумът, който изобщо може да се получи от амплитуди{" "}
              <RichText text="$2$" /> и <RichText text="$2$" />.
            </p>
          </SolutionPart>
          <SolutionPart label="b" title="Противоположни фази">
            <Formula
              latex={String.raw`y=2\sin\omega t+2\sin(\omega t+\pi)=2\sin\omega t-2\sin\omega t=0`}
            />
            <p>
              Амплитуда нула, тоест <strong>пълна деструктивна</strong> интерференция: във всеки
              момент отклоненията са равни по големина и противоположни.
            </p>
          </SolutionPart>
          <SolutionPart label="c" title="Четвърт период разлика">
            <p>
              С <RichText text={String.raw`$\alpha=\omega t$`} /> и{" "}
              <RichText text={String.raw`$\beta=\omega t+\frac\pi2$`} /> пресмятаме двата аргумента
              на тъждеството.
            </p>
            <Formula
              latex={String.raw`\frac{\alpha+\beta}{2}=\omega t+\frac\pi4,\qquad \frac{\alpha-\beta}{2}=-\frac\pi4`}
            />
            <Formula
              latex={String.raw`y=2\left[2\sin\left(\omega t+\frac\pi4\right)\cos\left(-\frac\pi4\right)\right]=2\sqrt2\,\sin\left(\omega t+\frac\pi4\right)`}
            />
            <p>
              Амплитуда <RichText text={String.raw`$2\sqrt2\approx2{,}83$`} />, тоест междинен
              случай. Резултантната фаза е <RichText text={String.raw`$\pi/4$`} />, точно по средата
              между фазите на двете съставящи.
            </p>
          </SolutionPart>
          <SolutionPart label="d" title="Трите случая като едно правило">
            <Formula latex={String.raw`A_{\text{рез}}=2A\cos\frac{\Delta\varphi}{2}`} />
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <RichText
                  text={String.raw`$\Delta\varphi=0$: $\cos0=1$, значи $A_{\text{рез}}=4$.`}
                />
              </li>
              <li>
                <RichText
                  text={String.raw`$\Delta\varphi=\pi$: $\cos\frac\pi2=0$, значи $A_{\text{рез}}=0$.`}
                />
              </li>
              <li>
                <RichText
                  text={String.raw`$\Delta\varphi=\frac\pi2$: $\cos\frac\pi4=\frac{\sqrt2}{2}$, значи $A_{\text{рез}}=2\sqrt2$.`}
                />
              </li>
            </ul>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={15} title="Разлика в изминатите пътища" />
        <ProblemStatement>
          <p>
            Две вълни с еднаква честота и дължина{" "}
            <RichText text={String.raw`$\lambda=0{,}80\,\mathrm{m}$`} /> тръгват във фаза от два
            източника. Определете вида на интерференцията при разлика в пътищата:
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              <RichText text={String.raw`$\Delta r=0$`} />;
            </li>
            <li>
              <RichText text={String.raw`$\Delta r=0{,}40\,\mathrm{m}$`} />;
            </li>
            <li>
              <RichText text={String.raw`$\Delta r=0{,}80\,\mathrm{m}$`} />;
            </li>
            <li>
              <RichText text={String.raw`$\Delta r=1{,}20\,\mathrm{m}$`} />;
            </li>
            <li>
              <RichText text={String.raw`$\Delta r=2{,}00\,\mathrm{m}$`} />.
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Изразете всяка разлика в **дължини на вълната**. Дробната част на $\Delta r/\lambda$ решава всичко.`}
            />
          }
        >
          <SolutionPart label="a" title="Разликите в дължини на вълната">
            <Formula
              latex={String.raw`\frac{\Delta r}{\lambda}:\quad 0,\qquad \frac12,\qquad 1,\qquad \frac32,\qquad \frac52`}
            />
          </SolutionPart>
          <SolutionPart label="b" title="Съответните фазови разлики">
            <Formula latex={String.raw`\Delta\varphi=2\pi\frac{\Delta r}{\lambda}:\quad 0,\qquad \pi,\qquad 2\pi,\qquad 3\pi,\qquad 5\pi`} />
          </SolutionPart>
          <SolutionPart label="c" title="Видът във всеки случай">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <RichText text={String.raw`$\Delta r=0$ и $\Delta r=0{,}80\,\mathrm{m}$: **конструктивна**.`} />
              </li>
              <li>
                <RichText
                  text={String.raw`$\Delta r=0{,}40$, $1{,}20$ и $2{,}00\,\mathrm{m}$: **деструктивна**.`}
                />
              </li>
            </ul>
          </SolutionPart>
          <SolutionPart label="d" title="Общото правило">
            <Formula
              latex={String.raw`\Delta r=k\lambda\ \Rightarrow\ \text{максимум},\qquad \Delta r=\left(k+\tfrac12\right)\lambda\ \Rightarrow\ \text{минимум}`}
            />
            <ResultBox>
              Правилото важи само защото източниците тръгват във фаза. Ако между тях има собствена
              начална фазова разлика, тя се добавя към{" "}
              <RichText text={String.raw`$2\pi\Delta r/\lambda$`} />.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §6 */}
      <Section id="beats" n="§6" title="Различни честоти и биения">
        <ProblemTitle n={16} title="Двете вълни съвпадат ли постоянно" />
        <ProblemStatement>
          <p>
            Дадени са <RichText text={String.raw`$y_1(t)=\sin(4\pi t)$`} /> и{" "}
            <RichText text={String.raw`$y_2(t)=\sin(6\pi t)$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>
              Намерете <RichText text="$f_1$" /> и <RichText text="$f_2$" />.
            </li>
            <li>
              Намерете <RichText text="$T_1$" /> и <RichText text="$T_2$" />.
            </li>
            <li>
              Изчислете <RichText text={String.raw`$y_1$, $y_2$ и $y_1+y_2$`} /> при{" "}
              <RichText
                text={String.raw`$t=0$, $0{,}25\,\mathrm{s}$, $0{,}50\,\mathrm{s}$ и $1{,}00\,\mathrm{s}$`}
              />
              .
            </li>
            <li>Може ли двете вълни да са постоянно в конструктивна интерференция?</li>
            <li>След колко време ще се върнат едновременно в първоначалното си състояние?</li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Проследете фазовата разлика като функция от времето: тук тя не е константа, а $\Delta\varphi(t)=(\omega_2-\omega_1)t$.`}
            />
          }
        >
          <SolutionPart label="a" title="Честоти и периоди">
            <Formula
              latex={String.raw`f_1=2\ \mathrm{Hz},\ T_1=0{,}5\ \mathrm{s};\qquad f_2=3\ \mathrm{Hz},\ T_2=\tfrac13=0{,}33\ \mathrm{s}`}
            />
          </SolutionPart>
          <SolutionPart label="b" title="Стойностите в четирите момента">
            <Formula
              latex={String.raw`\begin{array}{c|c|c|c}
t\ (\mathrm{s}) & y_1 & y_2 & y_1+y_2\\ \hline
0 & 0 & 0 & 0\\
0{,}25 & \sin\pi=0 & \sin\tfrac{3\pi}{2}=-1 & -1\\
0{,}50 & \sin 2\pi=0 & \sin 3\pi=0 & 0\\
1{,}00 & \sin 4\pi=0 & \sin 6\pi=0 & 0
\end{array}`}
            />
          </SolutionPart>
          <SolutionPart label="c" title="Възможна ли е постоянна интерференция">
            <p>
              Не. Конструктивната интерференция изисква <strong>постоянна</strong> фазова разлика,
              а тук тя расте с времето.
            </p>
            <Formula latex={String.raw`\Delta\varphi(t)=6\pi t-4\pi t=2\pi t`} />
            <p>
              За <RichText text={String.raw`$t=0{,}25\,\mathrm{s}$`} /> тя е{" "}
              <RichText text={String.raw`$\pi/2$`} />, за{" "}
              <RichText text={String.raw`$0{,}5\,\mathrm{s}$`} /> е <RichText text={String.raw`$\pi$`} />,
              за <RichText text={String.raw`$1\,\mathrm{s}$`} /> е{" "}
              <RichText text={String.raw`$2\pi$`} />.
            </p>
          </SolutionPart>
          <SolutionPart label="d" title="Кога се връщат заедно">
            <p>Търсим най-малкото време, което е цял брой периоди и на двете.</p>
            <Formula
              latex={String.raw`t=\mathrm{HOK}\left(0{,}5;\ \tfrac13\right)=1\ \mathrm{s}\qquad\left(1=2\cdot0{,}5=3\cdot\tfrac13\right)`}
            />
            <ResultBox>
              <RichText
                text={String.raw`Проверка по другия път: искаме $\Delta\varphi=2\pi t$ да стане точно $2\pi$, откъдето отново $t=1\,\mathrm{s}$. За тази секунда първата вълна прави $2$ трептения, а втората $3$.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={17} title="Биения" />
        <ProblemStatement>
          <p>
            Два звукови източника имат честоти{" "}
            <RichText text={String.raw`$f_1=256\,\mathrm{Hz}$`} /> и{" "}
            <RichText text={String.raw`$f_2=260\,\mathrm{Hz}$`} />, а честотата на биенията е{" "}
            <RichText text={String.raw`$f_{\text{биене}}=|f_1-f_2|$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете честотата на биенията.</li>
            <li>Намерете времето между два последователни максимума на силата на звука.</li>
            <li>
              Колко увеличавания на силата ще се чуят за <RichText text={String.raw`$10\,\mathrm{s}$`} />?
            </li>
            <li>
              Какво ще стане с биенията, ако втората честота се доближи до{" "}
              <RichText text={String.raw`$256\,\mathrm{Hz}$`} />?
            </li>
          </ol>
        </ProblemStatement>

        <div className="mt-6">
          <BeatsLab />
        </div>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Честотата на биенията е разликата на двете честоти, а времето между максимумите е нейният период.`}
            />
          }
        >
          <SolutionPart label="a" title="Честота на биенията">
            <Formula latex={String.raw`f_{\text{биене}}=|256-260|=4\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Време между максимумите">
            <Formula latex={String.raw`T_{\text{биене}}=\frac{1}{f_{\text{биене}}}=0{,}25\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Брой усилвания за десет секунди">
            <Formula latex={String.raw`N=f_{\text{биене}}\cdot t=4\cdot10=40`} />
          </SolutionPart>
          <SolutionPart label="d" title="Когато честотите се изравняват">
            <p>
              Разликата намалява, значи биенията стават все по-редки, а времето между максимумите
              расте. В границата <RichText text={String.raw`$f_2\to256\,\mathrm{Hz}$`} /> имаме{" "}
              <RichText text={String.raw`$f_{\text{биене}}\to0$`} />: биенията изчезват и звукът
              става равен.
            </p>
            <ResultBox>
              Точно това прави настройчикът на инструмент: не сравнява честоти на слух, а слуша
              дали има биене. Изчезването на биенето е много по-чувствителен признак.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §7 */}
      <Section id="ac" n="§7" title="Връзка с променливия ток">
        <ProblemTitle n={18} title="Напрежение в електрическата мрежа" />
        <ProblemStatement>
          <p>
            Променливото напрежение има честота <RichText text={String.raw`$f=50\,\mathrm{Hz}$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете периода.</li>
            <li>Намерете ъгловата честота.</li>
            <li>
              Колко пълни трептения извършва напрежението за{" "}
              <RichText text={String.raw`$3\,\mathrm{s}$`} />?
            </li>
            <li>
              За колко време фазата се променя с <RichText text={String.raw`$\pi/2$`} />?
            </li>
            <li>
              А с <RichText text={String.raw`$\pi$`} />?
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Фазата расте като $\varphi=\omega t$, затова времето за дадена промяна на фазата е $\Delta t=\Delta\varphi/\omega$.`}
            />
          }
        >
          <SolutionPart label="a" title="Период">
            <Formula latex={String.raw`T=\frac1f=0{,}02\ \mathrm{s}=20\ \mathrm{ms}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Ъглова честота">
            <Formula latex={String.raw`\omega=2\pi f=100\pi=314\ \mathrm{rad/s}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Трептения за три секунди">
            <Formula latex={String.raw`N=ft=50\cdot3=150`} />
          </SolutionPart>
          <SolutionPart label="d" title="Четвърт оборот на фазата">
            <Formula latex={String.raw`\Delta t=\frac{\pi/2}{100\pi}=0{,}005\ \mathrm{s}=5\ \mathrm{ms}`} />
          </SolutionPart>
          <SolutionPart label="e" title="Половин оборот на фазата">
            <Formula latex={String.raw`\Delta t=\frac{\pi}{100\pi}=0{,}01\ \mathrm{s}=10\ \mathrm{ms}`} />
            <ResultBox>
              <RichText
                text={String.raw`Двата отговора се четат и без деление: $\pi/2$ е четвърт от $2\pi$, значи четвърт период, а $\pi$ е половин период. Затова в главата за променливия ток фазовите разлики $\pm\pi/2$ се наричат „изместване с четвърт период“.`}
              />
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>

        <ProblemTitle n={19} title="Две променливи напрежения" />
        <ProblemStatement>
          <p>Дадени са</p>
          <Formula
            latex={String.raw`U_1(t)=10\sin(100\pi t)\ \mathrm{V},\qquad U_2(t)=6\sin\left(100\pi t+\frac\pi2\right)\ \mathrm{V}`}
          />
          <ol className="list-[lower-alpha] space-y-1.5 pl-6">
            <li>Намерете амплитудите.</li>
            <li>Намерете честотите.</li>
            <li>Намерете периодите.</li>
            <li>Намерете фазовата разлика.</li>
            <li>Намерете времевото отместване.</li>
            <li>
              Намерете стойностите при <RichText text="$t=0$" />.
            </li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Различните амплитуди $10$ и $6\,\mathrm{V}$ нямат нищо общо с фазата: тя се чете само от добавката в аргумента.`}
            />
          }
        >
          <SolutionPart label="a" title="Амплитуди">
            <Formula latex={String.raw`U_{1,\max}=10\ \mathrm{V},\qquad U_{2,\max}=6\ \mathrm{V}`} />
          </SolutionPart>
          <SolutionPart label="b" title="Честоти">
            <Formula latex={String.raw`f_1=f_2=\frac{100\pi}{2\pi}=50\ \mathrm{Hz}`} />
          </SolutionPart>
          <SolutionPart label="c" title="Периоди">
            <Formula latex={String.raw`T_1=T_2=0{,}02\ \mathrm{s}`} />
          </SolutionPart>
          <SolutionPart label="d" title="Фазова разлика">
            <Formula
              latex={String.raw`\Delta\varphi=\frac\pi2-0=\frac\pi2=90^\circ\quad(U_2\ \text{изпреварва}\ U_1)`}
            />
          </SolutionPart>
          <SolutionPart label="e" title="Времево отместване">
            <Formula
              latex={String.raw`\Delta t=\frac{\Delta\varphi}{\omega}=\frac{\pi/2}{100\pi}=0{,}005\ \mathrm{s}=\frac T4`}
            />
          </SolutionPart>
          <SolutionPart label="f" title="Стойностите в началния момент">
            <Formula
              latex={String.raw`U_1(0)=10\sin 0=0\ \mathrm{V},\qquad U_2(0)=6\sin\frac\pi2=6\ \mathrm{V}`}
            />
            <ResultBox>
              В момента, в който първото напрежение е нула, второто вече е в максимума си. Точно
              това е смисълът на „изместени с четвърт период“.
            </ResultBox>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      {/* =========================================================== §8 */}
      <Section id="recap" n="§8" title="Обобщение без смятане">
        <ProblemTitle n={20} title="Седем въпроса с обяснение" />
        <ProblemStatement>
          <p>Отговорете с обяснение, а не само с формула:</p>
          <ol className="list-decimal space-y-1.5 pl-6">
            <li>Ако честотата се увеличи, какво става с периода?</li>
            <li>Ако честотата се увеличи в една и съща среда, какво става с дължината на вълната?</li>
            <li>Може ли вълни с различни честоти да имат еднаква дължина на вълната?</li>
            <li>Може ли вълни с еднакви честоти да имат различни дължини?</li>
            <li>Защо две вълни с различни честоти не остават постоянно в една и съща фазова връзка?</li>
            <li>
              Каква е разликата между скоростта на трептене на частицата и скоростта на
              разпространение на вълната?
            </li>
            <li>Какво точно се събира при интерференция?</li>
          </ol>
        </ProblemStatement>

        <ProgressiveSolution
          hint={
            <RichText
              text={String.raw`Три от седемте въпроса се свеждат до $\lambda=v/f$: винаги питайте кое от трите е фиксирано и кое се мени.`}
            />
          }
        >
          <SolutionPart label="1" title="Честота нагоре, период надолу">
            <p>
              Периодът намалява, защото <RichText text="$T=1/f$" />. Смисълът зад формулата:
              честотата брои трептенията за секунда, а периодът е времето за едно трептене. Ако за
              секунда се съберат повече трептения, всяко трябва да отнема по-малко време.
            </p>
          </SolutionPart>
          <SolutionPart label="2" title="Честота нагоре в същата среда">
            <p>
              Дължината на вълната намалява, защото <RichText text={String.raw`$\lambda=v/f$`} />, а{" "}
              <RichText text="$v$" /> е фиксирана от средата. Картината: за един период вълната
              изминава едно и също разстояние за по-малко време, значи гребените се сгъстяват.
            </p>
          </SolutionPart>
          <SolutionPart label="3" title="Различни честоти, еднаква дължина">
            <p>
              <strong>Да, но не в една и съща среда.</strong> От{" "}
              <RichText text={String.raw`$\lambda=v/f$`} /> се вижда, че ако честотата се удвои и
              скоростта също се удвои, дължината остава същата. Пример: звук с{" "}
              <RichText text="$f$" /> във въздуха и звук с <RichText text="$4f$" /> във вода могат да
              имат близки дължини на вълната.
            </p>
          </SolutionPart>
          <SolutionPart label="4" title="Еднакви честоти, различни дължини">
            <p>
              Да, и това е точно задача 11. Вълна, преминала в среда с друга скорост, запазва
              честотата си, но сменя дължината си.
            </p>
          </SolutionPart>
          <SolutionPart label="5" title="Защо различните честоти не пазят фазата">
            <p>
              Защото фазовата разлика между тях е{" "}
              <RichText text={String.raw`$\Delta\varphi(t)=(\omega_2-\omega_1)t$`} />. Тя е постоянна
              само ако <RichText text={String.raw`$\omega_1=\omega_2$`} />. Иначе расте линейно и
              двете вълни последователно минават през конструктивно и деструктивно съотношение.
              Точно това видяхме в задача 16 и точно това се чува като биения в задача 17.
            </p>
          </SolutionPart>
          <SolutionPart label="6" title="Скорост на частицата срещу скорост на вълната">
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <strong>Скоростта на частицата</strong> е колко бързо се движи една точка от
                средата около равновесното си положение. Мени се през периода: нула в крайните
                положения и максимална при преминаване през равновесие,{" "}
                <RichText text={String.raw`$v_{\max}=\omega A$`} />.
              </li>
              <li>
                <strong>Скоростта на вълната</strong> е колко бързо се придвижва самата картина
                през пространството. Определя се от средата и не зависи нито от амплитудата, нито
                от честотата.
              </li>
            </ul>
            <ResultBox>
              Частиците не пътуват с вълната. Те трептят на място, а през пространството се пренася
              смущението и енергията. Коркова тапа на вода се клати нагоре-надолу, но не заминава с
              вълната.
            </ResultBox>
          </SolutionPart>
          <SolutionPart label="7" title="Какво се събира при интерференция">
            <p>
              Събират се <strong>моментните отклонения</strong>. Това е принципът на
              суперпозицията: в даден момент и в дадена точка резултантното отклонение е
              алгебричната сума на отклоненията, които всяка вълна би създала сама.
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              <li>
                <RichText
                  text={String.raw`**Честотите не се събират никога.** При различни честоти се получава по-сложна картина (биения), но нова честота $f_1+f_2$ не възниква.`}
                />
              </li>
              <li>
                <RichText
                  text={String.raw`**Амплитудите се събират само в частния случай** на еднакви честоти и нулева фазова разлика. Иначе важи $A_{\text{рез}}=2A\cos\dfrac{\Delta\varphi}{2}$, което при $\Delta\varphi=\pi$ дава нула въпреки две ненулеви амплитуди.`}
                />
              </li>
            </ul>
          </SolutionPart>
        </ProgressiveSolution>
      </Section>

      <section className="mt-12 rounded-[12px] border-[1.5px] border-ink bg-surface px-5 py-5 shadow-hard">
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
          Трите неща, които решават почти всичко тук
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
          <li>
            <RichText
              text={String.raw`**$f$ и $\omega$ вървят заедно, $T$ върви срещу тях.** Различават се само с постоянния множител $2\pi$.`}
            />
          </li>
          <li>
            <RichText
              text={String.raw`**Честотата идва от източника, скоростта от средата.** Дължината на вълната не е независима величина: тя е частното $\lambda=v/f$.`}
            />
          </li>
          <li>
            <RichText
              text={String.raw`**Фазовата разлика е постоянна само при равни честоти.** Иначе расте като $(\omega_2-\omega_1)t$, което прави постоянната интерференция невъзможна и поражда биенията.`}
            />
          </li>
        </ul>
        <p className="mt-4 text-[15px]">
          <Link
            href="/physics/promenliv-tok/impedans-i-rezonans"
            className="font-semibold text-minus underline decoration-2 underline-offset-2 hover:text-ink"
          >
            Продължение: фаза, фазори и резонанс в променливотокова верига
          </Link>
        </p>
      </section>
    </main>
  );
}
