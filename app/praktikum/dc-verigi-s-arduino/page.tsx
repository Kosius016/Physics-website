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
import { Readouts } from "@/components/problem-sets/LabShell";
import DcLabDiagram from "@/components/praktikum/DcLabDiagrams";
import {
  AsciiSchematic,
  CodeBlock,
  ConnectionTable,
  LabPart,
  SafetyBox,
} from "@/components/praktikum/LabParts";
import {
  DIODE_ARDUINO,
  DIODE_PYTHON,
  DIVIDER_ARDUINO,
  DIVIDER_PYTHON,
  KVL_ARDUINO,
  KVL_PYTHON,
  LED_ARDUINO,
  LED_PYTHON,
  LOADING_ARDUINO,
  LOADING_PYTHON,
  RC_ARDUINO,
  RC_PYTHON,
} from "@/components/praktikum/dcLabCode";

export const metadata = {
  title: "DC вериги с Arduino: шест лабораторни експеримента · SingularityLab",
  description:
    "Практикум за делител на напрежение, закона на Кирхоф, RC преходен процес и I-V характеристики на диод и LED с Arduino и автоматично построяване на графики.",
};

const NAV = [
  { id: "setup", n: "§0", label: "Обща подготовка" },
  { id: "divider", n: "§1", label: "Делител" },
  { id: "kvl", n: "§2", label: "Кирхоф" },
  { id: "rc", n: "§3", label: "RC процес" },
  { id: "diode", n: "§4", label: "Диод" },
  { id: "led", n: "§5", label: "LED" },
  { id: "loading", n: "§6", label: "Натоварване" },
  { id: "recap", n: "§7", label: "Ред и обобщение" },
] as const;

const INSTALL_COMMAND = "py -m pip install pyserial matplotlib";

export default function DcArduinoLabsPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pb-2 pt-11">
          <nav
            aria-label="Път до практикума"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/materiali?subject=physics&level=university&type=praktikum"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Практикум
            </Link>
            <span aria-hidden="true">·</span>
            <span>Постояннотокови вериги</span>
          </nav>
          <h1 className="mb-2 mt-2 font-serif text-[clamp(34px,7vw,48px)] font-bold leading-[1.08] text-ink">
            DC вериги с Arduino: от делителя до диодната характеристика
          </h1>
          <p className="max-w-2xl text-[17px] leading-relaxed text-muted">
            Шест експеримента, които първо се предсказват и пресмятат, после се сглобяват на
            breadboard и накрая се проверяват с мултицет, Arduino и автоматична графика.
          </p>
        </header>

        <LessonNav items={NAV} right={<TeacherModeToggle />} />

        <Section id="setup" n="§0" title="Обща подготовка и измервателен стандарт">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface p-5 shadow-hard">
            <p className="text-[15px] leading-relaxed">
              Във всички експерименти Arduino и веригата имат обща маса. Аналоговите входове
              измерват само напрежения спрямо <RichText text={String.raw`$\mathrm{GND}$`} /> в
              интервала от <RichText text={String.raw`$0$`} /> до{" "}
              <RichText text={String.raw`$5\,\mathrm{V}$`} />. Премествайте проводници само при
              изключен USB кабел.
            </p>
            <Readouts
              columns="sm:grid-cols-3"
              items={[
                { label: "ADC на Uno", tex: String.raw`10\,\mathrm{bit}=1024\,\text{нива}` },
                { label: String.raw`Една стъпка при $5\,\mathrm{V}$`, tex: String.raw`4{,}89\,\mathrm{mV}` },
                { label: "Serial скорост", tex: String.raw`115200\,\mathrm{bit/s}` },
              ]}
            />
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-paper p-4">
              <h3 className="font-serif text-[19px] font-bold">Преди първото измерване</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-[14.5px] leading-relaxed">
                <li>Измерете реалната шина от <RichText text={String.raw`$5\,\mathrm{V}$`} /> с мултицет.</li>
                <li>Ако тя не е точно <RichText text={String.raw`$5{,}00\,\mathrm{V}$`} />, сменете константата <code>VREF</code> в кода.</li>
                <li>Затворете Serial Monitor преди стартиране на Python. Един порт се използва от една програма.</li>
              </ul>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-ink bg-paper p-4">
              <h3 className="font-serif text-[19px] font-bold">Софтуер на лаптопа</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed">
                Инсталирайте библиотеките веднъж, после сменяйте само <code>COM3</code> с порта,
                който Arduino IDE показва.
              </p>
              <pre className="mt-3 overflow-x-auto rounded-md bg-ink px-3 py-2 font-mono text-[13px] text-white"><code>{INSTALL_COMMAND}</code></pre>
            </div>
          </div>
          <TeacherNote title="Проверка преди включване">
            <p>
              Поискайте ученикът да посочи общата маса, измерваните възли и най-голямото възможно
              напрежение на всеки аналогов вход. Ако не може, схемата още не се включва.
            </p>
          </TeacherNote>
        </Section>

        <Section id="divider" n="§1" title="1. Делител на напрежение">
          <LabPart number={2} title="Цел">
            <p>
              Да се види как една последователна резисторна верига превръща входното напрежение в
              предвидима част от него и защо отношението зависи от резисторите, а не от абсолютния ток.
            </p>
          </LabPart>

          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Arduino Uno и USB кабел</li>
              <li><RichText text={String.raw`$R_1=4{,}7\,\mathrm{k\Omega}$`} /></li>
              <li><RichText text={String.raw`$R_2=10\,\mathrm{k\Omega}$`} /></li>
              <li>Breadboard, три джъмпера и мултицет</li>
            </ul>
          </LabPart>

          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="divider" />
            <Readouts
              columns="sm:grid-cols-4"
              items={[
                { label: "$R_1$", tex: String.raw`4{,}7\,\mathrm{k\Omega}` },
                { label: "$R_2$", tex: String.raw`10\,\mathrm{k\Omega}` },
                { label: "Очаквано отношение", tex: String.raw`V_{\mathrm{out}}/V_{\mathrm{in}}=0{,}680`, tone: "text-ok" },
                { label: "Очакван ток", tex: String.raw`I\approx0{,}34\,\mathrm{mA}`, tone: "text-minus" },
              ]}
            />
            <AsciiSchematic>{String.raw`D8 / Vin o--R1 4.7 kΩ--o Vout--R2 10 kΩ--GND
          |             |
          A1            A0`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["D8 и A1", "Горният край на R1, възел Vin"],
                ["Долният край на R1", "Възел Vout"],
                ["Горният край на R2 и A0", "Същият възел Vout, но в отделни дупки от колоната"],
                ["Долният край на R2", "GND"],
                ["Черна сонда на мултицета", "GND"],
                ["Червена сонда", "Първо Vin, после Vout"],
              ]}
            />
          </LabPart>

          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt={String.raw`Ако $R_2$ се увеличи при неизменно $R_1$, какво става с $V_{\mathrm{out}}$?`}
              options={[
                { text: String.raw`Приближава се към $V_{\mathrm{in}}$.`, correct: true, why: "По-голяма част от общия спад е върху $R_2$, а изходът се измерва върху него." },
                { text: "Приближава се към нула.", correct: false, why: "Това би станало при намаляване на $R_2$ към късо съединение." },
                { text: "Не се променя.", correct: false, why: "Отношението на съпротивленията определя деленето на напрежението." },
              ]}
            />
            <p>През двата последователни резистора тече един и същ ток:</p>
            <Formula latex={String.raw`I=\frac{V_{\mathrm{in}}}{R_1+R_2}`} />
            <p>Изходът е спадът върху втория резистор:</p>
            <Formula latex={String.raw`V_{\mathrm{out}}=IR_2=V_{\mathrm{in}}\frac{R_2}{R_1+R_2}`} />
          </LabPart>

          <LabPart number={6} title="Какво прави Arduino">
            <p>
              Пин <code>D8</code> подава постоянна логическа HIGH стойност. <code>A1</code> измерва
              реалното входно напрежение, <code>A0</code> измерва изхода, а Serial изпраща CSV редове към лаптопа.
            </p>
          </LabPart>

          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за делителя" language="arduino" code={DIVIDER_ARDUINO} />
          </LabPart>

          <LabPart number={8} title="Очаквани резултати">
            <p>
              При вход близо до <RichText text={String.raw`$5\,\mathrm{V}$`} /> очаквайте изход
              около <RichText text={String.raw`$3{,}40\,\mathrm{V}$`} /> и почти хоризонтална
              графика. Малкото отклонение идва от толеранса на резисторите, неточната референция и ADC квантуването.
            </p>
          </LabPart>

          <LabPart number={9} title="Автоматично построяване на графика">
            <p>Скриптът чертае измерения изход и теоретичната стойност, изчислена от едновременно измерения вход.</p>
            <CodeBlock title="Python: измерено срещу теория" language="python" code={DIVIDER_PYTHON} />
          </LabPart>

          <LabPart number={10} title="Интерпретация">
            <p>
              Усреднете колоната <code>ratio</code> и я сравнете с{" "}
              <RichText text={String.raw`$k=R_2/(R_1+R_2)$`} />. От измерено отношение може да
              намерите и отношението на резисторите:
            </p>
            <Formula latex={String.raw`\frac{R_2}{R_1}=\frac{k}{1-k}`} />
          </LabPart>

          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Токът през изход <code>D8</code> е само около{" "}
              <RichText text={String.raw`$0{,}34\,\mathrm{mA}$`} />. Не свързвайте <code>D8</code>
              директно към GND и не премествайте резистори при включен USB кабел.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="kvl" n="§2" title="1. Закон на Кирхоф за напреженията в резисторна верига">
          <LabPart number={2} title="Цел">
            <p>
              Да се провери експериментално, че алгебричната сума на измененията на потенциала по
              затворен контур е нула и че отделните спадове се събират до напрежението на източника.
            </p>
          </LabPart>
          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Arduino Uno, breadboard, джъмпери и мултицет</li>
              <li><RichText text={String.raw`$R_1=1{,}0\,\mathrm{k\Omega}$`} /></li>
              <li><RichText text={String.raw`$R_2=2{,}2\,\mathrm{k\Omega}$`} /></li>
              <li><RichText text={String.raw`$R_3=3{,}3\,\mathrm{k\Omega}$`} /></li>
            </ul>
          </LabPart>
          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="kvl" />
            <AsciiSchematic>{String.raw`D8 / V0 o--R1--o V1--R2--o V2--R3--GND
          |       |        |
          A0      A1       A2`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["D8, A0 и горният край на R1", "Възел V0"],
                ["Долният край на R1, горният край на R2 и A1", "Възел V1, три различни дупки от една колона"],
                ["Долният край на R2, горният край на R3 и A2", "Възел V2, три различни дупки от една колона"],
                ["Долният край на R3", "GND"],
              ]}
            />
          </LabPart>
          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt="Кой резистор трябва да има най-голям спад на напрежение?"
              options={[
                { text: "$R_3$", correct: true, why: String.raw`Токът е един и същ, затова $\Delta V_i=IR_i$ и най-големият резистор има най-голям спад.` },
                { text: "$R_1$", correct: false, why: "$R_1$ е най-малкият резистор и при общ ток върху него пада най-малко напрежение." },
                { text: "Трите спада са еднакви.", correct: false, why: "Това би било вярно само при три еднакви съпротивления." },
              ]}
            />
            <Formula latex={String.raw`\Delta V_1=V_0-V_1,\qquad \Delta V_2=V_1-V_2,\qquad \Delta V_3=V_2`} />
            <p>Събирането телескопира междинните потенциали:</p>
            <Formula latex={String.raw`\Delta V_1+\Delta V_2+\Delta V_3=V_0`} />
            <p>Това е същото като <RichText text={String.raw`$\sum_{\text{контур}}\Delta V=0$`} />, ако включим повишението на потенциала в източника с обратен знак.</p>
          </LabPart>
          <LabPart number={6} title="Какво прави Arduino">
            <p><code>D8</code> захранва веригата, а <code>A0</code>, <code>A1</code> и <code>A2</code> измерват трите възлови потенциала. Кодът изчислява спадовете, сумата и остатъчната KVL грешка.</p>
          </LabPart>
          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за закона на Кирхоф" language="arduino" code={KVL_ARDUINO} />
          </LabPart>
          <LabPart number={8} title="Очаквани резултати">
            <p>
              При вход <RichText text={String.raw`$5\,\mathrm{V}$`} /> токът е приблизително{" "}
              <RichText text={String.raw`$0{,}769\,\mathrm{mA}$`} />. Очакваните спадове са около{" "}
              <RichText text={String.raw`$0{,}77\,\mathrm{V}$`} />,{" "}
              <RichText text={String.raw`$1{,}69\,\mathrm{V}$`} /> и{" "}
              <RichText text={String.raw`$2{,}54\,\mathrm{V}$`} />. Сумата им трябва да следва входа.
            </p>
          </LabPart>
          <LabPart number={9} title="Автоматично построяване на графика">
            <CodeBlock title="Python: KVL сума и остатъчна грешка" language="python" code={KVL_PYTHON} />
          </LabPart>
          <LabPart number={10} title="Интерпретация">
            <p>
              Освен KVL сравнете токовете <RichText text={String.raw`$I_i=\Delta V_i/R_i$`} />.
              Те трябва да съвпадат в границите на ADC стъпката и толеранса. Систематична разлика
              обикновено означава грешен възел или резистор.
            </p>
          </LabPart>
          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Общото съпротивление е <RichText text={String.raw`$6{,}5\,\mathrm{k\Omega}$`} />,
              затова токът от <code>D8</code> е под <RichText text={String.raw`$1\,\mathrm{mA}$`} />.
              Всички аналогови входове са между GND и напрежението на <code>D8</code>.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="rc" n="§3" title="1. Зареждане и разреждане на RC верига">
          <LabPart number={2} title="Цел">
            <p>Да се наблюдава как кондензаторът превръща рязката промяна на източника в плавен експоненциален преход и как времеконстантата задава естествения мащаб на процеса.</p>
          </LabPart>
          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li><RichText text={String.raw`$R=10\,\mathrm{k\Omega}$`} /></li>
              <li>Електролитен кондензатор <RichText text={String.raw`$C=100\,\mu\mathrm{F}$`} />, поне <RichText text={String.raw`$10\,\mathrm{V}$`} /></li>
              <li>Arduino Uno, breadboard, джъмпери и мултицет</li>
            </ul>
          </LabPart>
          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="rc" />
            <Readouts
              columns="sm:grid-cols-3"
              items={[
                { label: "$R$", tex: String.raw`10\,\mathrm{k\Omega}` },
                { label: "$C$", tex: String.raw`100\,\mu\mathrm{F}` },
                { label: "Времеконстанта", tex: String.raw`\tau=RC=1{,}0\,\mathrm{s}`, tone: "text-ok" },
              ]}
            />
            <AsciiSchematic>{String.raw`D8 / Vs o--R 10 kΩ--o Vc
          |            |+
          A1       C 100 µF
                       |-
          GND──────────o
                       |
                       A0`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["D8, A1 и единият край на R", "Възел Vs"],
                ["Другият край на R, плюсът на C и A0", "Възел Vc, отделни дупки от една колона"],
                ["Минусът на C", "GND"],
              ]}
            />
          </LabPart>
          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt="Кога при зареждане токът през резистора е най-голям?"
              options={[
                { text: "Непосредствено след включването.", correct: true, why: String.raw`Тогава $V_C\approx0$ и почти цялото напрежение е върху резистора.` },
                { text: "След много времеконстанти.", correct: false, why: String.raw`Тогава $V_C\approx V_s$, спадът върху резистора е почти нула и токът затихва.` },
                { text: "Токът е постоянен.", correct: false, why: "Нарастващото $V_C$ непрекъснато намалява напрежението върху резистора." },
              ]}
            />
            <p>Законът на Кирхоф и връзката <RichText text={String.raw`$I=C\,dV_C/dt$`} /> дават:</p>
            <Formula latex={String.raw`V_s-RC\frac{dV_C}{dt}-V_C=0`} />
            <p>За незареден кондензатор при включване:</p>
            <Formula latex={String.raw`V_C(t)=V_s\left(1-e^{-t/(RC)}\right)`} />
            <p>При разреждане от начална стойност <RichText text="$V_0$" />:</p>
            <Formula latex={String.raw`V_C(t)=V_0e^{-t/(RC)},\qquad \tau=RC`} />
          </LabPart>
          <LabPart number={6} title="Какво прави Arduino">
            <p><code>D8</code> превключва от LOW към HIGH за зареждане и обратно към LOW за разреждане. <code>A0</code> записва <RichText text="$V_C(t)$" />, <code>A1</code> проверява източника, а Serial изпраща фаза, време и напрежения.</p>
          </LabPart>
          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за един RC цикъл" language="arduino" code={RC_ARDUINO} />
          </LabPart>
          <LabPart number={8} title="Очаквани резултати">
            <p>
              При <RichText text={String.raw`$t=\tau$`} /> зареждането достига{" "}
              <RichText text={String.raw`$63{,}2\%$`} /> от крайната стойност, а разреждането
              остава на <RichText text={String.raw`$36{,}8\%$`} /> от началната. Реалната крива
              може да се измести заради толеранса и утечката на електролитния кондензатор.
            </p>
          </LabPart>
          <LabPart number={9} title="Автоматично построяване на графика">
            <CodeBlock title="Python: зареждане, разреждане и теоретична крива" language="python" code={RC_PYTHON} />
          </LabPart>
          <LabPart number={10} title="Интерпретация">
            <p>
              Отчетете времето до <RichText text={String.raw`$0{,}632V_{\infty}$`} /> като
              експериментална <RichText text={String.raw`$\tau$`} />. По-точно преобразуване е{" "}
              <RichText text={String.raw`$\ln(V_{\infty}-V_C)$`} /> спрямо{" "}
              <RichText text="$t$" />. Наклонът е <RichText text={String.raw`$-1/(RC)$`} /> и дава
              <RichText text={String.raw`$C=-1/(R\,\text{наклон})$`} />.
            </p>
          </LabPart>
          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Спазвайте полярността на електролитния кондензатор: плюс към възела{" "}
              <RichText text="$V_C$" />, минус към GND. Разредете го през резистора преди промяна
              на схемата. Не го свързвайте обратно.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="diode" n="§4" title="1. I-V характеристика на силициев диод">
          <LabPart number={2} title="Цел">
            <p>Да се измери нелинейната връзка между тока и напрежението на PN преход и да се сравнят линейна и полулогаритмична графика.</p>
          </LabPart>
          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Силициев диод 1N4148</li>
              <li><RichText text={String.raw`$R_f=1\,\mathrm{k\Omega}$`} /> и <RichText text={String.raw`$R_s=1\,\mathrm{k\Omega}$`} /></li>
              <li>Електролитен кондензатор <RichText text={String.raw`$C_f=47\,\mu\mathrm{F}$`} />, поне <RichText text={String.raw`$10\,\mathrm{V}$`} /></li>
              <li>Arduino Uno, breadboard, джъмпери и мултицет</li>
            </ul>
          </LabPart>
          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="diode" />
            <Readouts
              columns="sm:grid-cols-3"
              items={[
                { label: "PWM филтър", tex: String.raw`R_fC_f=47\,\mathrm{ms}` },
                { label: "Измервателен резистор", tex: String.raw`R_s=1\,\mathrm{k\Omega}` },
                { label: "Горна граница на тока", tex: String.raw`I<5\,\mathrm{mA}`, tone: "text-ok" },
              ]}
            />
            <AsciiSchematic>{String.raw`D9 PWM--Rf 1 kΩ--o Vs--Rs 1 kΩ--o Vd--|>|--GND
                   | A0             | A1     D
                 Cf 47 µF
                   |
                  GND`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["D9", "Единият край на Rf"],
                ["Другият край на Rf, плюсът на Cf и A0", "Възел Vs"],
                ["Минусът на Cf", "GND"],
                ["Единият край на Rs", "Възел Vs"],
                ["Другият край на Rs, A1 и анодът на диода", "Възел Vd"],
                ["Катодът с маркиращата лента", "GND"],
              ]}
            />
          </LabPart>
          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt="Защо токът не трябва да се намира като $V_d/R_s$?"
              options={[
                { text: "Защото върху $R_s$ пада $V_s-V_d$.", correct: true, why: "Двата края на резистора са при потенциали $V_s$ и $V_d$." },
                { text: "Защото диодът няма напрежение.", correct: false, why: "Именно напрежението $V_d$ управлява силно тока през PN прехода." },
                { text: "Защото токът през $R_s$ е нула.", correct: false, why: "$R_s$ и диодът са последователни и през тях тече един и същ ток." },
              ]}
            />
            <p>Токът се получава без отделен амперметър от измерения спад върху серийния резистор:</p>
            <Formula latex={String.raw`I=\frac{V_s-V_d}{R_s}`} />
            <p>Идеализираният модел на Шокли е:</p>
            <Formula latex={String.raw`I=I_s\left(e^{qV_d/(nkT)}-1\right)`} />
            <p>При достатъчно прав ток полулогаритмичната зависимост е приблизително линейна:</p>
            <Formula latex={String.raw`\ln I\approx\ln I_s+\frac{q}{nkT}V_d`} />
          </LabPart>
          <LabPart number={6} title="Какво прави Arduino">
            <p>
              <code>D9</code> създава PWM, а <RichText text={String.raw`$R_fC_f$`} /> го изглажда.
              След изчакване всяка точка е установено положително DC напрежение. <code>A0</code>
              измерва <RichText text="$V_s$" />, <code>A1</code> измерва <RichText text="$V_d$" />,
              а токът се изчислява от <RichText text={String.raw`$(V_s-V_d)/R_s$`} />.
            </p>
          </LabPart>
          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за двупосочен DC sweep" language="arduino" code={DIODE_ARDUINO} />
          </LabPart>
          <LabPart number={8} title="Очаквани резултати">
            <p>
              Токът остава малък при ниско напрежение и после нараства рязко. Няма една точна
              „прагова“ стойност. При токове от порядъка на милиампери силициевият диод често е
              около <RichText text={String.raw`$0{,}6$`} /> до <RichText text={String.raw`$0{,}75\,\mathrm{V}$`} />.
              Недостатъчното изчакване личи като разлика между sweep нагоре и надолу.
            </p>
          </LabPart>
          <LabPart number={9} title="Автоматично построяване на графика">
            <CodeBlock title="Python: линейна и полулогаритмична I-V графика" language="python" code={DIODE_PYTHON} />
          </LabPart>
          <LabPart number={10} title="Интерпретация">
            <p>
              Сравнете двете посоки на sweep. В линейната графика определете областта на бърз
              растеж, а в графиката <RichText text={String.raw`$\ln I$`} /> спрямо{" "}
              <RichText text="$V_d$" /> потърсете прав участък. Неговият наклон{" "}
              <RichText text="$m$" /> дава приблизително <RichText text={String.raw`$n=q/(mkT)$`} />.
            </p>
          </LabPart>
          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Лентата на 1N4148 е катодът и отива към GND. <RichText text="$R_s$" /> никога не се
              премахва. Филтърният резистор ограничава тока от <code>D9</code>, а A0 и A1 остават
              между <RichText text="$0$" /> и <RichText text={String.raw`$5\,\mathrm{V}$`} />.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="led" n="§5" title="1. I-V характеристика на светодиод">
          <LabPart number={2} title="Цел">
            <p>Да се сравни LED с обикновен силициев диод и да се свърже електрическата характеристика с енергията на излъчвания фотон.</p>
          </LabPart>
          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Червен LED</li>
              <li><RichText text={String.raw`$R_f=1\,\mathrm{k\Omega}$`} /> и <RichText text={String.raw`$R_s=330\,\Omega$`} /></li>
              <li><RichText text={String.raw`$C_f=47\,\mu\mathrm{F}$`} />, поне <RichText text={String.raw`$10\,\mathrm{V}$`} /></li>
              <li>Arduino Uno, breadboard, джъмпери и мултицет</li>
            </ul>
          </LabPart>
          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="led" />
            <Readouts
              columns="sm:grid-cols-3"
              items={[
                { label: "PWM филтър", tex: String.raw`R_fC_f=47\,\mathrm{ms}` },
                { label: "Измервателен резистор", tex: String.raw`R_s=330\,\Omega` },
                { label: "Очакван максимален ток", tex: String.raw`I\lesssim2{,}5\,\mathrm{mA}`, tone: "text-ok" },
              ]}
            />
            <AsciiSchematic>{String.raw`D9 PWM--Rf 1 kΩ--o Vs--Rs 330 Ω--o Vled--|>|--GND
                   | A0              | A1     LED
                 Cf 47 µF
                   |
                  GND`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["D9, Rf, Cf и A0", "Същият филтър като при силициевия диод"],
                ["Другият край на Rs, A1 и дългият крак на LED", "Възел Vled, анод"],
                ["Късият крак и плоската страна на LED", "GND, катод"],
              ]}
            />
          </LabPart>
          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt="Кой е по-подходящ модел за светването на LED?"
              options={[
                { text: "Токът нараства плавно и светлината става постепенно видима.", correct: true, why: "Диодната характеристика е експоненциална, а човешкото око има собствен праг на забелязване." },
                { text: "LED е идеален ключ с една точна прагова стойност.", correct: false, why: "Реалният PN преход няма рязък математически ъгъл в I-V кривата." },
                { text: "LED свети еднакво при всеки положителен ток.", correct: false, why: "Излъчената мощност и видимата яркост зависят от тока." },
              ]}
            />
            <Formula latex={String.raw`I=\frac{V_s-V_{\mathrm{LED}}}{R_s}`} />
            <p>Енергията на фотона е свързана с дължината на вълната:</p>
            <Formula latex={String.raw`E_\gamma=hf=\frac{hc}{\lambda}`} />
            <p>
              За пряка рекомбинация <RichText text={String.raw`$E_\gamma$`} /> е от порядъка на ширината на
              забранената зона <RichText text="$E_g$" />. Затова <RichText text="$E_g/e$" /> и
              правото напрежение са сходни по мащаб, но не са тъждествено равни за реален LED.
            </p>
          </LabPart>
          <LabPart number={6} title="Какво прави Arduino">
            <p><code>D9</code> прави същия филтриран DC sweep. <code>A0</code> и <code>A1</code> измерват двете страни на <RichText text="$R_s$" />, кодът намира тока, а Serial изпраща готови точки за I-V графиката.</p>
          </LabPart>
          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за LED sweep" language="arduino" code={LED_ARDUINO} />
          </LabPart>
          <LabPart number={8} title="Очаквани резултати">
            <p>
              Червеният LED започва да се вижда слабо преди токът да достигне няколко милиампера.
              Типичният прав спад е приблизително от <RichText text={String.raw`$1{,}6$`} /> до{" "}
              <RichText text={String.raw`$2{,}2\,\mathrm{V}$`} />, но зависи от конкретния LED,
              тока и температурата. Тук филтърът и резисторите ограничават тока до няколко милиампера.
            </p>
          </LabPart>
          <LabPart number={9} title="Автоматично построяване на графика">
            <CodeBlock title="Python: I-V характеристика на LED" language="python" code={LED_PYTHON} />
          </LabPart>
          <LabPart number={10} title="Интерпретация">
            <p>
              Отбележете напрежението, при което светлината става видима, но не го обявявайте за
              универсален праг. Ако имате LED с различни цветове, повторете и сравнете{" "}
              <RichText text={String.raw`$V_{\mathrm{LED}}$`} /> при един и същ ток.
            </p>
          </LabPart>
          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Никога не включвайте LED без серийния <RichText text="$R_s$" />. Проверете
              полярността преди USB захранване. Ако LED не свети, първо намалете PWM до нула,
              изключете кабела и проверете посоката му.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="loading" n="§6" title="1. Натоварване на делител на напрежение">
          <LabPart number={2} title="Цел">
            <p>Да се разбере защо делителят дава правилното напрежение само когато свързаният товар не отнема значителен ток, и да се въведе еквивалентът на Тевенен.</p>
          </LabPart>
          <LabPart number={3} title="Необходими компоненти">
            <ul className="list-disc space-y-1.5 pl-5">
              <li><RichText text={String.raw`$R_1=R_2=10\,\mathrm{k\Omega}$`} /></li>
              <li>Товарни резистори <RichText text={String.raw`$100\,\mathrm{k\Omega}$`} />, <RichText text={String.raw`$47\,\mathrm{k\Omega}$`} />, <RichText text={String.raw`$10\,\mathrm{k\Omega}$`} />, <RichText text={String.raw`$4{,}7\,\mathrm{k\Omega}$`} /> и <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} /></li>
              <li>Arduino Uno, breadboard, джъмпери и мултицет</li>
            </ul>
          </LabPart>
          <LabPart number={4} title="Електрическа схема">
            <DcLabDiagram kind="loading" />
            <AsciiSchematic>{String.raw`5 V--R1 10 kΩ--o Vout--R2 10 kΩ--GND
 |              |
 A1             +--RL--GND
                |
                A0`}</AsciiSchematic>
            <ConnectionTable
              rows={[
                ["5 V и A1", "Горният край на R1, възел Vin"],
                ["Долният край на R1, горният край на R2 и A0", "Възел Vout, отделни дупки"],
                ["Долният край на R2", "GND"],
                ["RL", "Между Vout и GND, по един резистор за измерване"],
              ]}
            />
          </LabPart>
          <LabPart number={5} title="Теория">
            <PredictionQuestion
              prompt="Кой товар променя най-малко изходното напрежение?"
              options={[
                { text: String.raw`$R_L=100\,\mathrm{k\Omega}$`, correct: true, why: "Големият товар черпи най-малък ток и е най-близо до отворена верига." },
                { text: String.raw`$R_L=1\,\mathrm{k\Omega}$`, correct: false, why: "Малкият товар е силен допълнителен път към GND и сваля изхода най-много." },
                { text: "Всички товари дават еднакво напрежение.", correct: false, why: "$R_L$ участва успоредно на $R_2$ и променя долното еквивалентно съпротивление." },
              ]}
            />
            <Formula latex={String.raw`R_{\text{долу}}=R_2\parallel R_L=\frac{R_2R_L}{R_2+R_L}`} />
            <Formula latex={String.raw`V_L=V_{\mathrm{in}}\frac{R_{\text{долу}}}{R_1+R_{\text{долу}}}`} />
            <p>Същата схема като източник на Тевенен има:</p>
            <Formula latex={String.raw`V_{\mathrm{Th}}=V_{\mathrm{in}}\frac{R_2}{R_1+R_2},\qquad R_{\mathrm{Th}}=R_1\parallel R_2`} />
            <Formula latex={String.raw`V_L=V_{\mathrm{Th}}\frac{R_L}{R_{\mathrm{Th}}+R_L}`} />
          </LabPart>
          <LabPart number={6} title="Какво прави Arduino">
            <p>Шината <code>5V</code> захранва делителя. <code>A1</code> измерва входа, <code>A0</code> измерва натоварения изход. Python подсказва кой товар да поставите и изпраща стойността му към Arduino заедно с измерването.</p>
          </LabPart>
          <LabPart number={7} title="Arduino код">
            <CodeBlock title="Готов sketch за измерване на избран товар" language="arduino" code={LOADING_ARDUINO} />
          </LabPart>
          <LabPart number={8} title="Очаквани резултати">
            <p>
              Без товар очаквайте около <RichText text={String.raw`$2{,}5\,\mathrm{V}$`} />.
              При <RichText text={String.raw`$R_L=10\,\mathrm{k\Omega}$`} /> резултатът е около{" "}
              <RichText text={String.raw`$1{,}67\,\mathrm{V}$`} />, а при{" "}
              <RichText text={String.raw`$R_L=1\,\mathrm{k\Omega}$`} /> около{" "}
              <RichText text={String.raw`$0{,}42\,\mathrm{V}$`} /> за идеален вход от{" "}
              <RichText text={String.raw`$5\,\mathrm{V}$`} />.
            </p>
          </LabPart>
          <LabPart number={9} title="Автоматично построяване на графика">
            <p>Скриптът спира преди всяка точка, за да смените безопасно товара, после чертае измерената и теоретичната зависимост.</p>
            <CodeBlock title="Python: изходно напрежение срещу товар" language="python" code={LOADING_PYTHON} />
          </LabPart>
          <LabPart number={10} title="Интерпретация">
            <p>
              Постройте <RichText text="$V_L$" /> спрямо <RichText text="$R_L$" /> в логаритмична
              скала. Натоварването е слабо, когато <RichText text={String.raw`$R_L\gg R_{\mathrm{Th}}$`} />.
              Тук <RichText text={String.raw`$R_{\mathrm{Th}}=5\,\mathrm{k\Omega}$`} />, затова{" "}
              <RichText text={String.raw`$100\,\mathrm{k\Omega}$`} /> почти не влияе, а{" "}
              <RichText text={String.raw`$1\,\mathrm{k\Omega}$`} /> влияе силно.
            </p>
          </LabPart>
          <LabPart number={11} title="Безопасност и практически бележки">
            <SafetyBox>
              Изключвайте USB кабела преди всяка смяна на <RichText text="$R_L$" />. Не използвайте
              омметър върху захранена верига. Ако измервате резистора, първо го извадете или повдигнете единия му крак.
            </SafetyBox>
          </LabPart>
        </Section>

        <Section id="recap" n="§7" title="Препоръчителен ред, идеи и чести грешки">
          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink shadow-hard">
            <table className="w-full min-w-[40rem] border-collapse text-left text-[14px]">
              <thead className="bg-ink text-white">
                <tr>
                  <th className="px-3 py-2" scope="col">Ред</th>
                  <th className="px-3 py-2" scope="col">Експеримент</th>
                  <th className="px-3 py-2" scope="col">Основна идея</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Делител", "Едно отношение на съпротивления задава едно отношение на напрежения."],
                  ["2", "Закон на Кирхоф", "Спадовете по контура възстановяват напрежението на източника."],
                  ["3", "Натоварване", "Измервателят или следващото стъпало може да промени самата схема."],
                  ["4", "RC процес", "Натрупването на заряд въвежда време и експоненциален закон."],
                  ["5", "Силициев диод", "Нелинейният елемент се описва с цяла I-V крива, не с едно съпротивление."],
                  ["6", "LED", "Електрическата енергия се свързва с фотонната енергия и цвета."],
                ].map(([order, title, idea], index) => (
                  <tr key={title} className={index % 2 === 0 ? "bg-surface" : "bg-paper"}>
                    <td className="border-t border-rule px-3 py-2.5 font-bold text-minus">{order}</td>
                    <td className="border-t border-rule px-3 py-2.5 font-semibold">{title}</td>
                    <td className="border-t border-rule px-3 py-2.5 text-muted">{idea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 rounded-[10px] border-[1.5px] border-ink bg-paper p-5 shadow-hard-sm">
            <h3 className="font-serif text-[21px] font-bold">Чести начинаещи грешки</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed">
              <li>Липсва общ GND между Arduino и веригата.</li>
              <li>Два извода са поставени в една и съща дупка или в несвързани breadboard колони.</li>
              <li>Аналоговият вход се свързва към точка извън интервала от <RichText text="$0$" /> до <RichText text={String.raw`$5\,\mathrm{V}$`} />.</li>
              <li>Диодът, LED или електролитният кондензатор е обърнат.</li>
              <li>LED или диод се включва без токограничаващ резистор.</li>
              <li>Омметърът се използва върху захранена схема.</li>
              <li>Serial Monitor остава отворен и Python не може да заеме COM порта.</li>
              <li>Една приблизителна „прагова“ стойност се приема за цял модел на диода.</li>
            </ul>
          </div>

          <TeacherNote title="Една добра лабораторна логика">
            <p>
              Преди всеки USB контакт поискайте три неща: прогноза за графиката, оценка на
              максималния ток и посочване на двата възела, между които се измерва. Това превръща
              Arduino от черна кутия в измервателен инструмент.
            </p>
          </TeacherNote>

          <div className="mt-6 flex flex-wrap gap-4 text-[14.5px] font-semibold">
            <Link href="/zadachi/rezistorni-verigi" className="text-minus hover:underline">
              Задачи за резисторни вериги →
            </Link>
            <Link href="/materiali?subject=physics&level=university&type=praktikum" className="text-minus hover:underline">
              Всички практикуми →
            </Link>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
