import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import { Check, Derive, Meaning, Steps } from "@/components/DerivationBlocks";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import { ExpansionComparisonFigure } from "@/components/interactives/RealGasFigures";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Главните връзки: уравнението на състоянието определя всичко · SingularityLab",
  description:
    "Термодинамично уравнение на състоянието, законът на Стефан-Болцман, зависимостта на топлинните капацитети, адиабатите и ентропията на газа на Ван дер Ваалс, свободно разширение и ефект на Джаул-Томсън.",
};

const raw = String.raw;

const SECTION_NAV = [
  { id: "energy", n: "§1", label: "Енергията" },
  { id: "stefan", n: "§2", label: "Стефан-Болцман" },
  { id: "enthalpy", n: "§3", label: "Енталпията" },
  { id: "cv", n: "§4", label: "Капацитетът и обемът" },
  { id: "cpcv", n: "§5", label: "Разликата" },
  { id: "adiabat", n: "§6", label: "Адиабати" },
  { id: "entropy", n: "§7", label: "Ентропия" },
  { id: "free", n: "§8", label: "Свободно разширение" },
  { id: "throttle", n: "§9", label: "Дроселиране" },
  { id: "recap", n: "§10", label: "Обобщение" },
] as const;

function P({ text }: { text: string }) {
  return (
    <p className="my-4 text-[16.5px] leading-relaxed text-ink/90">
      <RichText text={text} />
    </p>
  );
}

export default function MainRelationsLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav
            aria-label="Път до урока"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link href="/physics" className="transition-colors hover:text-minus">
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics/termodinamika-universitet" className="transition-colors hover:text-minus">
              Реален газ
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(32px,6.4vw,46px)] leading-[1.08] font-bold text-ink">
            Главните връзки: уравнението на състоянието определя всичко
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Всяка величина, която трудно се мери - енергия, ентропия, топлинен капацитет - изразена
            чрез <RichText text={raw`$p(T,\nu)$`} /> и няколко производни
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="energy" n="§1" title="Вътрешната енергия от манометър и термометър">
          <P text="В предишния урок получихме инструментите. Сега всички връзки тук ще имат една и съща структура: отляво стои величина, която трудно се мери, а отдясно - само уравнението на състоянието. Започваме от най-важната: как вътрешната енергия зависи от обема при постоянна температура." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Газ се разширява изотермно. Променя ли се вътрешната му енергия?"
              options={[
                {
                  text: "За идеален газ не, за реален - да, защото молекулите се привличат",
                  correct: true,
                  why: raw`Точно така, и ще го докажем, а не само ще го твърдим. При раздалечаване молекулите плащат с кинетичната си енергия, за да преодолеят привличането, затова $u$ зависи и от обема.`,
                },
                {
                  text: "Не, защото температурата е постоянна, а температурата е мярка за вътрешната енергия",
                  correct: false,
                  why: raw`Температурата е мярка само за кинетичната част. При реален газ има и потенциална част от взаимодействието между молекулите, а тя зависи от разстоянията, тоест от обема.`,
                },
                {
                  text: "Да, при всеки газ, защото работата при разширение идва от вътрешната енергия",
                  correct: false,
                  why: raw`При изотермно разширение работата идва от приетата топлина, не задължително от $u$. За идеален газ $\Delta u=0$ и цялата топлина става работа.`,
                },
                {
                  text: "Не, защото при постоянна температура газът не обменя топлина",
                  correct: false,
                  why: raw`Обменя, и то много: $Q=RT\ln(\nu_2/\nu_1)$. Процес без обмен на топлина е адиабатният, а при него температурата се мени.`,
                },
              ]}
              explanation="Въпросът е колко точно, а не само дали. Отговорът ще дойде от едно съотношение на Максуел."
            />
          </div>

          <Derive title="Извод чрез съотношение на Максуел">
            <Steps>
              <p>
                Започваме от основното уравнение{" "}
                <RichText text={raw`$du=T\,ds-p\,d\nu$`} />.
              </p>
              <>
                <p>
                  Гледаме на <RichText text="$u$" /> и <RichText text="$s$" /> като функции на{" "}
                  <RichText text="$T$" /> и <RichText text={raw`$\nu$`} />. Делим на{" "}
                  <RichText text={raw`$d\nu$`} /> при постоянна температура:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial u}{\partial\nu}\right)_{\!T}=T\left(\frac{\partial s}{\partial\nu}\right)_{\!T}-p`}
                />
              </>
              <p>
                <RichText text={raw`$(\partial s/\partial\nu)_T$`} /> не се мери. Заменяме го с M3:{" "}
                <RichText
                  text={raw`$(\partial s/\partial\nu)_T=(\partial p/\partial T)_\nu$`}
                />
                .
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\left(\frac{\partial u}{\partial\nu}\right)_{\!T}=T\left(\frac{\partial p}{\partial T}\right)_{\!\nu}-p`}
          />
          <p className="my-4 text-[15px] leading-relaxed text-muted">
            Тази връзка се нарича <strong>термодинамично уравнение на състоянието</strong>. Името е
            точно: обикновеното уравнение на състоянието свързва{" "}
            <RichText text={raw`$p$, $\nu$, $T$`} />, а това добавя и енергията.
          </p>

          <details className="group my-6 rounded-[8px] border-[1.5px] border-rule px-4 py-2.5 open:border-ink">
            <summary className="cursor-pointer text-[15px] font-semibold text-ink select-none">
              Втори извод: само от това, че ентропията е функция на състоянието
            </summary>
            <div className="mt-3 space-y-3 border-t-[1.5px] border-dashed border-rule pt-3">
              <Steps>
                <>
                  <p>
                    От основното уравнение:{" "}
                    <RichText text={raw`$ds=\frac1T\,du+\frac{p}{T}\,d\nu$`} />. Заместваме пълния
                    диференциал на <RichText text="$u$" />:
                  </p>
                  <Formula
                    latex={raw`ds=\underbrace{\frac{c_V}{T}}_{M}\,dT+\underbrace{\frac1T\left[\left(\frac{\partial u}{\partial\nu}\right)_{\!T}+p\right]}_{N}\,d\nu`}
                  />
                </>
                <p>
                  <RichText text="$s$" /> е функция на състоянието, значи{" "}
                  <RichText
                    text={raw`$(\partial M/\partial\nu)_T=(\partial N/\partial T)_\nu$`}
                  />
                  .
                </p>
                <>
                  <p>Двете страни поотделно:</p>
                  <Formula
                    latex={raw`\left(\frac{\partial M}{\partial\nu}\right)_{\!T}=\frac1T\frac{\partial^2u}{\partial\nu\,\partial T}`}
                  />
                  <Formula
                    latex={raw`\left(\frac{\partial N}{\partial T}\right)_{\!\nu}=-\frac1{T^2}\left[\left(\frac{\partial u}{\partial\nu}\right)_{\!T}+p\right]+\frac1T\left[\frac{\partial^2u}{\partial T\,\partial\nu}+\left(\frac{\partial p}{\partial T}\right)_{\!\nu}\right]`}
                  />
                </>
                <p>
                  Приравняваме. Смесените производни на <RichText text="$u$" /> са равни и се
                  съкращават; умножаваме по <RichText text="$T^2$" /> и получаваме същата връзка. Тоест
                  тя не зависи от избора на потенциал - следва направо от втория принцип.
                </p>
              </Steps>
            </div>
          </details>

          <Meaning title="Какво реално ни дава тази връзка">
            <p>
              <strong>а) Енергия от механични измервания.</strong> Дясната страна съдържа само{" "}
              <RichText text="$p$" />, <RichText text="$T$" /> и наклона на{" "}
              <RichText text="$p(T)$" /> при постоянен обем - неща, които мерим с манометър и
              термометър върху затворен съд. Лявата страна е как енергията зависи от обема, което
              иначе изисква калориметрия.
            </p>
            <p>
              <strong>
                б) Законът на Джаул следва от втория принцип.
              </strong>{" "}
              За идеалния газ <RichText text={raw`$T\cdot R/\nu-p=0$`} />, значи{" "}
              <RichText text="$u$" /> зависи само от <RichText text="$T$" />. Джаул го установява
              опитно през 1845 г., но то не е отделен закон: следва от това, че при постоянен обем{" "}
              <RichText text={raw`$p\propto T$`} />. По-общо, при всяко уравнение от вида{" "}
              <RichText text={raw`$p=T\varphi(\nu)$`} /> енергията не зависи от обема - упражнение 2.
            </p>
            <p>
              <strong>в) Енергията на газа на Ван дер Ваалс, строго.</strong>
            </p>
            <Formula
              latex={raw`\left(\frac{\partial u}{\partial\nu}\right)_{\!T}=T\cdot\frac{R}{\nu-b}-\left(\frac{RT}{\nu-b}-\frac{a}{\nu^2}\right)=\frac{a}{\nu^2}`}
            />
            <p>
              Кинетичните членове се унищожават и остава само привличането. Интегрираме по{" "}
              <RichText text={raw`$\nu$`} /> при постоянна <RichText text="$T$" />:{" "}
              <RichText text={raw`$u=u_0(T)-a/\nu$`} />. В <RichText text={raw`$\S4$`} /> ще докажем,
              че <RichText text="$c_V$" /> зависи само от <RichText text="$T$" />, значи при
              постоянен капацитет:
            </p>
            <Formula latex={raw`u=c_VT-\frac{a}{\nu}`} />
            <p>
              Величината <RichText text={raw`$\pi_T=(\partial u/\partial\nu)_T$`} /> се нарича{" "}
              <strong>вътрешно налягане</strong> и показва колко силно молекулите се държат една за
              друга. В курса за идеален газ тя се въвежда с правдоподобен аргумент; тук се получава
              като следствие.
            </p>
          </Meaning>

          <Check title="Защо течността е течност">
            <p>
              За течности от цикличното правило{" "}
              <RichText text={raw`$\pi_T=T\alpha/\kappa_T-p$`} />. За вода при{" "}
              <RichText text={raw`$20\,^\circ\mathrm{C}$`} />:
            </p>
            <Formula
              latex={raw`\pi_T\approx293\cdot\frac{2{,}07\cdot10^{-4}}{4{,}59\cdot10^{-10}}\approx1{,}3\cdot10^{8}\,\mathrm{Pa}\approx1300\,\mathrm{bar}`}
            />
            <p>
              За азот при <RichText text={raw`$1\,\mathrm{bar}$`} />:{" "}
              <RichText
                text={raw`$\pi_T=a/\nu^2\approx0{,}137/(0{,}0249)^2\approx220\,\mathrm{Pa}$`}
              />{" "}
              - около 600 000 пъти по-малко. Това вътрешно налягане държи молекулите на водата
              заедно, а го получихме само от две таблични числа.
            </p>
          </Check>

          <TeacherNote>
            <p>
              Тук е най-силното място да се покаже разликата между „правдоподобен аргумент“ и
              „извод“. Поискайте от ученика да сравни двата начина, по които се въвежда{" "}
              <RichText text={raw`$a/\nu^2$`} />: като вътрешно налягане по аналогия и като резултат
              от съотношение на Максуел.
            </p>
          </TeacherNote>
        </Section>

        <Section id="stefan" n="§2" title="Най-красивото приложение: законът на Стефан-Болцман">
          <P text="Връзката от $\S1$ важи за всяко вещество. Най-неочакваното ѝ приложение е към нещо, което изобщо не е газ: топлинното излъчване в затворена кухина със стени при температура $T$." />
          <Derive>
            <Steps>
              <p>
                Енергията в единица обем <RichText text="$e$" /> зависи само от{" "}
                <RichText text="$T$" />. Иначе две кухини от различен материал при една температура
                биха обменяли енергия сами, тоест щяхме да имаме вечен двигател от втори род. Значи{" "}
                <RichText text="$U=e(T)\,V$" />.
              </p>
              <>
                <p>
                  Светлината натиска стените. Фотон с енергия <RichText text="$E$" /> има импулс{" "}
                  <RichText text="$E/c$" />. Повтаряме сметката от молекулно-кинетичната теория,{" "}
                  <RichText text={raw`$p=\tfrac13n\langle p_{\text{имп}}v\rangle$`} />, с{" "}
                  <RichText text={raw`$p_{\text{имп}}v=(E/c)\,c=E$`} />:
                </p>
                <Formula latex={raw`p=\frac{e}{3}`} />
                <p>
                  За едноатомен газ същата сметка дава{" "}
                  <RichText text={raw`$p=\tfrac23e_{\text{кин}}$`} />, защото там{" "}
                  <RichText text={raw`$p_{\text{имп}}v=2E_{\text{кин}}$`} />.
                </p>
              </>
              <>
                <p>
                  Прилагаме връзката от <RichText text={raw`$\S1$`} /> за пълните величини:
                </p>
                <Formula latex={raw`e=\frac{T}{3}\frac{de}{dT}-\frac{e}{3}`} />
              </>
              <>
                <p>Преместваме и разделяме променливите:</p>
                <Formula
                  latex={raw`\frac43\,e=\frac{T}{3}\frac{de}{dT}\quad\Longrightarrow\quad\frac{de}{e}=4\,\frac{dT}{T}\quad\Longrightarrow\quad e=\text{const}\cdot T^4`}
                />
              </>
              <p>
                През малък отвор излиза поток, пропорционален на <RichText text="$e$" />, тоест{" "}
                <RichText text={raw`$j=\sigma T^4$`} />.
              </p>
            </Steps>
          </Derive>
          <Meaning>
            <p>
              Болцман прави точно тази сметка през 1884 г. От един ред термодинамика и факта, че
              светлината натиска, следва законът <RichText text="$T^4$" />. Затова Слънцето (около{" "}
              <RichText text={raw`$5800\,\mathrm{K}$`} />) излъчва от всеки квадратен метър около{" "}
              <RichText text={raw`$(5800/300)^4\approx140\,000$`} /> пъти повече от тяло със стайна
              температура.
            </p>
            <p>
              Същият ред, приложен към разширяваща се Вселена, дава охлаждането на реликтовото
              лъчение - задача 5.
            </p>
          </Meaning>
        </Section>

        <Section id="enthalpy" n="§3" title="Близнакът за постоянно налягане">
          <P text="Същият ход, но от $dh=T\,ds+\nu\,dp$ и с M4 вместо M3." />
          <Derive>
            <Steps>
              <>
                <p>
                  Делим на <RichText text="$dp$" /> при постоянна температура:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial h}{\partial p}\right)_{\!T}=T\left(\frac{\partial s}{\partial p}\right)_{\!T}+\nu`}
                />
              </>
              <p>
                Заменяме неизмеримото <RichText text={raw`$(\partial s/\partial p)_T$`} /> с M4:{" "}
                <RichText text={raw`$(\partial s/\partial p)_T=-(\partial\nu/\partial T)_p$`} />.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\left(\frac{\partial h}{\partial p}\right)_{\!T}=\nu-T\left(\frac{\partial\nu}{\partial T}\right)_{\!p}`}
          />
          <Meaning>
            <p>
              Това е връзката за процеси при постоянно налягане и за потоци. Идеален газ:{" "}
              <RichText text={raw`$\nu-T\cdot R/p=0$`} />, значи и <RichText text="$h$" /> зависи само
              от <RichText text="$T$" />. Реален газ: енталпията зависи от налягането, и точно затова
              дроселирането променя температурата (<RichText text={raw`$\S9$`} />).
            </p>
          </Meaning>
        </Section>

        <Section id="cv" n="§4" title="Как топлинният капацитет зависи от обема">
          <Derive>
            <Steps>
              <>
                <p>
                  <RichText text={raw`$c_V=(\partial u/\partial T)_\nu$`} />. Диференцираме по{" "}
                  <RichText text={raw`$\nu$`} /> и разменяме реда на диференциране:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial c_V}{\partial\nu}\right)_{\!T}=\frac{\partial^2u}{\partial\nu\,\partial T}=\frac{\partial}{\partial T}\left[\left(\frac{\partial u}{\partial\nu}\right)_{\!T}\right]_{\nu}`}
                />
              </>
              <>
                <p>
                  Заместваме връзката от <RichText text={raw`$\S1$`} /> и диференцираме по{" "}
                  <RichText text="$T$" />; двата еднакви члена се съкращават:
                </p>
                <Formula
                  latex={raw`\frac{\partial}{\partial T}\left[T\left(\frac{\partial p}{\partial T}\right)_{\!\nu}-p\right]_{\nu}=\left(\frac{\partial p}{\partial T}\right)_{\!\nu}+T\left(\frac{\partial^2p}{\partial T^2}\right)_{\!\nu}-\left(\frac{\partial p}{\partial T}\right)_{\!\nu}`}
                />
              </>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\left(\frac{\partial c_V}{\partial\nu}\right)_{\!T}=T\left(\frac{\partial^2p}{\partial T^2}\right)_{\!\nu}`}
          />
          <Meaning>
            <p>
              Уравнението на състоянието казва и как топлинният капацитет се променя с плътността. При
              Ван дер Ваалс <RichText text="$p$" /> е линейно по <RichText text="$T$" />, значи{" "}
              <RichText text={raw`$\partial^2p/\partial T^2=0$`} /> и{" "}
              <RichText text="$c_V$" /> не зависи от обема.
            </p>
            <p>
              Това, че газът на Ван дер Ваалс има същото <RichText text="$c_V$" /> като идеалния, не е
              допускане, което правим за удобство - то е следствие от вида на уравнението. Ако
              уравнението беше квадратно по <RichText text="$T$" />, нямаше да е вярно.
            </p>
          </Meaning>
        </Section>

        <Section id="cpcv" n="§5" title="Разликата между двата топлинни капацитета">
          <P text="Училищната формула $c_p-c_V=R$ важи за идеален газ. Преди да видим общия вид, един въпрос за знака." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Съществува ли вещество, за което $c_p<c_V$?"
              options={[
                {
                  text: "Не, никога - това следва от устойчивостта на веществото",
                  correct: true,
                  why: raw`Да. Общият резултат е $c_p-c_V=T\nu\alpha^2/\kappa_T$. Устойчивото вещество има $\kappa_T>0$, а $\alpha^2\ge0$, значи разликата не може да е отрицателна.`,
                },
                {
                  text: raw`Да, вещество с $\alpha<0$, например водата между $0$ и $4\,^\circ\mathrm{C}$`,
                  correct: false,
                  why: raw`Точно този случай проверява дали резултатът е разбран: $\alpha$ влиза **на квадрат**. Отрицателното $\alpha$ дава положителна разлика, точно както положителното.`,
                },
                {
                  text: "Да, за течности, където разликата е под един процент",
                  correct: false,
                  why: "Малка разлика не значи разлика с променлив знак. За вода при 20 °C тя е около половин джаул на мол и келвин - малка, но положителна.",
                },
                {
                  text: "Не за газове, но за твърди тела въпросът няма смисъл",
                  correct: false,
                  why: raw`Има смисъл и за твърди тела: $\alpha$ и $\kappa_T$ са таблични и за стомана. Там разликата е просто много малка, затова справочниците дават един капацитет.`,
                },
              ]}
              explanation={raw`Общият резултат важи за всяко вещество, защото в извода не влиза никакво уравнение на състоянието - само двата принципа и устойчивостта.`}
            />
          </div>

          <Derive>
            <Steps>
              <p>
                При постоянен обем <RichText text={raw`$\delta Q=T\,ds=c_V\,dT$`} />, значи{" "}
                <RichText text={raw`$c_V=T(\partial s/\partial T)_\nu$`} />. Аналогично{" "}
                <RichText text={raw`$c_p=T(\partial s/\partial T)_p$`} />.
              </p>
              <p>
                Пълният диференциал на <RichText text={raw`$s(T,\nu)$`} /> е{" "}
                <RichText
                  text={raw`$ds=(\partial s/\partial T)_\nu\,dT+(\partial s/\partial\nu)_T\,d\nu$`}
                />
                .
              </p>
              <>
                <p>
                  Делим на <RichText text="$dT$" /> при постоянно налягане - тогава и{" "}
                  <RichText text={raw`$\nu$`} /> се променя:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial s}{\partial T}\right)_{\!p}=\left(\frac{\partial s}{\partial T}\right)_{\!\nu}+\left(\frac{\partial s}{\partial\nu}\right)_{\!T}\left(\frac{\partial\nu}{\partial T}\right)_{\!p}`}
                />
              </>
              <p>
                Умножаваме по <RichText text="$T$" /> и заместваме M3.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`c_p-c_V=T\left(\frac{\partial p}{\partial T}\right)_{\!\nu}\left(\frac{\partial\nu}{\partial T}\right)_{\!p}=\frac{T\nu\alpha^2}{\kappa_T}`}
          />
          <p className="my-4 text-[15px] leading-relaxed text-muted">
            Вторият запис идва от{" "}
            <RichText text={raw`$(\partial p/\partial T)_\nu=\alpha/\kappa_T$`} /> и{" "}
            <RichText text={raw`$(\partial\nu/\partial T)_p=\nu\alpha$`} />. От първия принцип
            обикновено се получава{" "}
            <RichText
              text={raw`$c_p-c_V=\left[(\partial u/\partial\nu)_T+p\right](\partial\nu/\partial T)_p$`}
            />
            ; скобата е точно{" "}
            <RichText text={raw`$T(\partial p/\partial T)_\nu$`} />, тоест двата пътя дават едно и
            също.
          </p>

          <Meaning>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <RichText text={raw`$\kappa_T>0$`} /> за всяко устойчиво вещество, а{" "}
                <RichText text={raw`$\alpha^2\ge0$`} />, значи <strong>винаги</strong>{" "}
                <RichText text={raw`$c_p\ge c_V$`} />. Дори вещество, което се свива при нагряване,
                има <RichText text={raw`$c_p\ge c_V$`} />: знакът на{" "}
                <RichText text={raw`$\alpha$`} /> влиза на квадрат.
              </li>
              <li>
                Водата при <RichText text={raw`$4\,^\circ\mathrm{C}$`} /> има{" "}
                <RichText text={raw`$\alpha=0$`} />, значи точно там{" "}
                <RichText text="$c_p=c_V$" />.
              </li>
              <li>
                За течности разликата е малка. Вода при{" "}
                <RichText text={raw`$20\,^\circ\mathrm{C}$`} />:{" "}
                <RichText text={raw`$c_p-c_V\approx0{,}49\,\mathrm{J/(mol\cdot K)}$`} /> при{" "}
                <RichText text={raw`$c_p=75{,}4$`} /> - под един процент. Затова за течности и твърди
                тела в таблиците стои просто „специфичен топлинен капацитет“, без да се уточнява при
                какво.
              </li>
            </ul>
          </Meaning>

          <Check>
            <p>
              Идеален газ:{" "}
              <RichText text={raw`$T\cdot\frac{R}{\nu}\cdot\frac{R}{p}=R$`} />. Ван дер Ваалс, с
              производните от предишния урок:
            </p>
            <Formula
              latex={raw`c_p-c_V=\frac{R}{1-\dfrac{2a(\nu-b)^2}{RT\nu^3}}`}
            />
            <p>
              За разреден газ (<RichText text={raw`$\nu\gg b$`} />) това е{" "}
              <RichText text={raw`$c_p-c_V\approx R\left(1+\dfrac{2a}{RT\nu}\right)$`} />, тоест малко
              повече от <RichText text="$R$" />. Знаменателят става нула точно когато{" "}
              <RichText text={raw`$(\partial p/\partial\nu)_T=0$`} />: в критичната точка{" "}
              <RichText text={raw`$c_p\to\infty$`} />. Там безкрайно малка топлина променя обема
              колкото си иска, защото налягането не се съпротивлява.
            </p>
          </Check>
        </Section>

        <Section id="adiabat" n="§6" title="Адиабатните процеси">
          <Derive>
            <Steps>
              <p>
                Обратим адиабатен процес е процес при <RichText text="$ds=0$" />.
              </p>
              <>
                <p>
                  С <RichText text={raw`$s(T,\nu)$`} /> и M3:{" "}
                  <RichText
                    text={raw`$ds=\frac{c_V}{T}dT+\left(\frac{\partial p}{\partial T}\right)_\nu d\nu$`}
                  />
                  . Полагаме нула:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial T}{\partial\nu}\right)_{\!s}=-\frac{T}{c_V}\left(\frac{\partial p}{\partial T}\right)_{\!\nu}`}
                />
              </>
              <>
                <p>
                  С <RichText text="$s(T,p)$" /> и M4:{" "}
                  <RichText
                    text={raw`$ds=\frac{c_p}{T}dT-\left(\frac{\partial\nu}{\partial T}\right)_p dp$`}
                  />
                  . Полагаме нула:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial T}{\partial p}\right)_{\!s}=\frac{T}{c_p}\left(\frac{\partial\nu}{\partial T}\right)_{\!p}=\frac{T\nu\alpha}{c_p}`}
                />
              </>
            </Steps>
          </Derive>

          <div className="my-6">
            <PredictionQuestion
              prompt="Вода при $2\,^\circ\mathrm{C}$ се свива бързо и без обмен на топлина. Какво става с температурата ѝ?"
              options={[
                {
                  text: "Намалява, защото при тази температура водата се свива при нагряване",
                  correct: true,
                  why: raw`Да. Между $0$ и $4\,^\circ\mathrm{C}$ водата има $\alpha<0$, а $(\partial T/\partial p)_s=T\nu\alpha/c_p$ носи знака на $\alpha$. Адиабатното свиване охлажда водата.`,
                },
                {
                  text: "Нараства, както при всяко вещество, защото работата на свиване увеличава вътрешната енергия",
                  correct: false,
                  why: raw`Работата наистина увеличава $u$, но температурата не е просто пропорционална на $u$: при $\alpha<0$ част от енергията отива в потенциалната част и температурата пада. Връзката е $(\partial T/\partial p)_s=T\nu\alpha/c_p$, а не нещо със задължително положителен знак.`,
                },
                {
                  text: "Не се променя, защото процесът е адиабатен",
                  correct: false,
                  why: raw`Адиабатен значи без обмен на топлина, не без промяна на температурата. Точно при адиабатните процеси температурата се мени най-силно.`,
                },
                {
                  text: "Нараства, но много слабо, защото водата почти не се свива",
                  correct: false,
                  why: raw`Малката свиваемост наистина прави ефекта слаб (около $1{,}5\,\mathrm{mK/bar}$ при $20\,^\circ\mathrm{C}$), но тук въпросът е за знака, а при $2\,^\circ\mathrm{C}$ той е отрицателен.`,
                },
              ]}
              explanation={raw`Това е предсказанието от M4, за което стана дума в предишния урок: знакът на температурния ефект при адиабатно свиване е знакът на $\alpha$.`}
            />
          </div>

          <Meaning>
            <p>
              При адиабатно свиване температурата расте пропорционално на{" "}
              <RichText text={raw`$\alpha$`} />. Помпата за колело се нагрява. За вода при{" "}
              <RichText text={raw`$20\,^\circ\mathrm{C}$`} /> ефектът е{" "}
              <RichText text={raw`$\approx1{,}5\,\mathrm{mK/bar}$`} />: свиване до{" "}
              <RichText text={raw`$1000\,\mathrm{bar}$`} /> я затопля само с около{" "}
              <RichText text={raw`$1{,}5\,\mathrm{K}$`} />. При{" "}
              <RichText text={raw`$2\,^\circ\mathrm{C}$`} /> обаче{" "}
              <RichText text={raw`$\alpha\approx-3{,}3\cdot10^{-5}\,\mathrm{K^{-1}}$`} /> и водата при
              свиване изстива.
            </p>
          </Meaning>

          <Check title="Адиабатата на газа на Ван дер Ваалс">
            <p>
              От първата връзка с{" "}
              <RichText text={raw`$(\partial p/\partial T)_\nu=R/(\nu-b)$`} />:
            </p>
            <Formula
              latex={raw`c_V\,\frac{dT}{T}=-R\,\frac{d\nu}{\nu-b}\quad\Longrightarrow\quad T\,(\nu-b)^{R/c_V}=\text{const}`}
            />
            <p>
              При <RichText text={raw`$b\to0$`} /> и идеален газ{" "}
              <RichText text={raw`$R/c_V=(c_p-c_V)/c_V=\gamma-1$`} />, тоест познатото{" "}
              <RichText text={raw`$T\nu^{\gamma-1}=\text{const}$`} />. За реалния газ показателят
              остава <RichText text={raw`$R/c_V$`} />, защото там{" "}
              <RichText text={raw`$c_p-c_V\neq R$`} />.
            </p>
          </Check>
        </Section>

        <Section id="entropy" n="§7" title="Ентропията на газа на Ван дер Ваалс">
          <Derive>
            <Steps>
              <>
                <p>
                  Както в <RichText text={raw`$\S6$`} />, но без да полагаме нула:
                </p>
                <Formula
                  latex={raw`ds=\frac{c_V}{T}\,dT+\left(\frac{\partial p}{\partial T}\right)_{\!\nu}d\nu=\frac{c_V}{T}\,dT+\frac{R}{\nu-b}\,d\nu`}
                />
              </>
              <p>
                Интегрираме при постоянен <RichText text="$c_V$" />.
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`s=c_V\ln T+R\ln(\nu-b)+s_0`} />
          <Meaning>
            <p>
              В логаритъма стои <strong>свободният обем</strong>{" "}
              <RichText text={raw`$\nu-b$`} /> - мястото, в което молекулите наистина могат да се
              движат. Константата <RichText text="$a$" /> не влиза: в този модел привличането променя
              енергията, но не и броя на начините, по които молекулите могат да се подредят при
              дадени <RichText text="$T$" /> и <RichText text={raw`$\nu$`} />.
            </p>
            <p>
              Адиабатата от <RichText text={raw`$\S6$`} /> е просто{" "}
              <RichText text={raw`$s=\text{const}$`} /> - добра проверка, че двата резултата са
              съгласувани.
            </p>
          </Meaning>
        </Section>

        <Section id="free" n="§8" title="Свободно разширение: опитът на Джаул">
          <P text="Газът се разширява във вакуум в топлоизолиран съд. Няма обмен на топлина и няма работа навън, значи $u=\text{const}$. Това е първият от два почти еднакви на вид опита, които се различават по запазваната величина." />
          <div className="my-6">
            <ExpansionComparisonFigure />
          </div>
          <Derive>
            <Steps>
              <>
                <p>
                  Прилагаме цикличното правило към тройката{" "}
                  <RichText text={raw`$T$, $\nu$, $u$`} />:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial T}{\partial\nu}\right)_{\!u}=-\,\frac{(\partial u/\partial\nu)_T}{(\partial u/\partial T)_\nu}`}
                />
              </>
              <>
                <p>
                  Числителят е връзката от <RichText text={raw`$\S1$`} />, знаменателят е{" "}
                  <RichText text="$c_V$" />:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial T}{\partial\nu}\right)_{\!u}=-\,\frac{T(\partial p/\partial T)_\nu-p}{c_V}`}
                />
              </>
              <>
                <p>
                  За Ван дер Ваалс числителят е <RichText text={raw`$a/\nu^2$`} />. Интегрираме:
                </p>
                <Formula
                  latex={raw`\Delta T=-\frac{a}{c_V}\left(\frac1{\nu_1}-\frac1{\nu_2}\right)<0`}
                />
              </>
            </Steps>
          </Derive>
          <Meaning>
            <p>
              Молекулите се раздалечават срещу взаимното привличане и плащат с кинетичната си енергия
              - както топка, хвърлена нагоре, се забавя. Охлаждането идва само от{" "}
              <RichText text="$a$" />: идеалният газ не променя температурата си при свободно
              разширение.
            </p>
            <p>
              Пример: <RichText text={raw`$1\,\mathrm{mol}$`} /> въглероден диоксид от{" "}
              <RichText text={raw`$1{,}0\,\mathrm{L}$`} /> до{" "}
              <RichText text={raw`$2{,}0\,\mathrm{L}$`} /> изстива с около{" "}
              <RichText text={raw`$6{,}3\,\mathrm{K}$`} />.
            </p>
          </Meaning>
        </Section>

        <Section id="throttle" n="§9" title="Дроселиране: ефектът на Джаул-Томсън">
          <P text="Сега газът не се разширява в затворен съд, а **тече** през вентил от по-високо към по-ниско налягане. От баланса за поток $h=\text{const}$." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Водород при стайна температура минава през дроселен вентил и налягането му пада. Какво става с температурата?"
              options={[
                {
                  text: "Нараства, защото при водорода собственият обем на молекулите надделява над привличането",
                  correct: true,
                  why: raw`Да. Знакът на $\mu$ се определя от $2a/(RT)-b$, а за водорода при $300\,\mathrm{K}$ тази разлика е отрицателна: $a$ е много малко. Затова водородът се затопля при дроселиране и машината на Линде не го втечнява направо.`,
                },
                {
                  text: "Намалява, както при всеки реален газ, защото молекулите се раздалечават срещу привличането",
                  correct: false,
                  why: raw`Това важи за свободното разширение, където $u=\text{const}$. При дроселиране постоянна е енталпията, а в нея влиза и работата на избутване; тогава членът с $b$ може да надделее. Водородът е точно такъв случай.`,
                },
                {
                  text: "Не се променя, защото процесът е адиабатен и без работа навън",
                  correct: false,
                  why: raw`Такъв е резултатът само за идеален газ, където $h$ зависи само от $T$. За реален газ $h$ зависи и от налягането, затова постоянната енталпия не значи постоянна температура.`,
                },
                {
                  text: "Намалява, но много по-слабо отколкото при азота",
                  correct: false,
                  why: raw`Посоката е грешна, а не само големината. Водородът при стайна температура е над своята температура на инверсия (около $220\,\mathrm{K}$ по модела), тоест е в областта, където дроселирането затопля.`,
                },
              ]}
              explanation="Оттук идва цялата промишлена криогеника: водородът първо се охлажда с течен азот, а хелият - с течен водород."
            />
          </div>

          <Derive title="Извод: общият коефициент">
            <Steps>
              <>
                <p>
                  Цикличното правило за тройката <RichText text="$T$, $p$, $h$" />:
                </p>
                <Formula
                  latex={raw`\mu\equiv\left(\frac{\partial T}{\partial p}\right)_{\!h}=-\,\frac{(\partial h/\partial p)_T}{(\partial h/\partial T)_p}`}
                />
              </>
              <p>
                Числителят е връзката от <RichText text={raw`$\S3$`} />, знаменателят е{" "}
                <RichText text="$c_p$" />.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\mu=\left(\frac{\partial T}{\partial p}\right)_{\!h}=\frac{T(\partial\nu/\partial T)_p-\nu}{c_p}`}
          />
          <Meaning>
            <p>
              При дроселиране налягането пада (<RichText text="$dp<0$" />). При{" "}
              <RichText text={raw`$\mu>0$`} /> газът изстива, при{" "}
              <RichText text={raw`$\mu<0$`} /> се затопля. Знакът зависи от сравнението на{" "}
              <RichText text={raw`$T(\partial\nu/\partial T)_p$`} /> с{" "}
              <RichText text={raw`$\nu$`} />: за идеалния газ те са равни и{" "}
              <RichText text={raw`$\mu=0$`} />. Реалният газ изстива, ако при нагряване се разширява
              „повече от идеален“, тоест ако привличането надделява над собствения обем на
              молекулите.
            </p>
          </Meaning>

          <Derive title="Извод: Ван дер Ваалс при ниско налягане">
            <Steps>
              <>
                <p>
                  Развиваме{" "}
                  <RichText
                    text={raw`$\dfrac1{\nu-b}=\dfrac1\nu\cdot\dfrac1{1-b/\nu}\approx\dfrac1\nu\left(1+\dfrac{b}\nu\right)$`}
                  />{" "}
                  при <RichText text={raw`$\nu\gg b$`} />:
                </p>
                <Formula latex={raw`p\approx\frac{RT}{\nu}+\frac{RTb-a}{\nu^2}`} />
              </>
              <>
                <p>
                  Умножаваме по <RichText text={raw`$\nu$`} /> и в малкия член заместваме{" "}
                  <RichText text={raw`$1/\nu\approx p/(RT)$`} />:
                </p>
                <Formula latex={raw`\nu\approx\frac{RT}{p}+b-\frac{a}{RT}`} />
              </>
              <>
                <p>
                  Диференцираме по <RichText text="$T$" /> при постоянно налягане и образуваме
                  числителя:
                </p>
                <Formula
                  latex={raw`T\left(\frac{\partial\nu}{\partial T}\right)_{\!p}-\nu\approx\frac{2a}{RT}-b`}
                />
              </>
            </Steps>
          </Derive>
          <Formula latex={raw`\mu\approx\frac1{c_p}\left(\frac{2a}{RT}-b\right),\qquad T_{\text{инв}}=\frac{2a}{Rb}\quad(p\to0)`} />

          <Check title="Проверка с числа">
            <p>
              Азот при <RichText text={raw`$300\,\mathrm{K}$`} />:
            </p>
            <Formula
              latex={raw`\mu\approx\frac1{29{,}1}\left(\frac{2\cdot0{,}137}{8{,}314\cdot300}-3{,}87\cdot10^{-5}\right)\approx2{,}4\cdot10^{-6}\,\frac{\mathrm K}{\mathrm{Pa}}=0{,}24\,\frac{\mathrm K}{\mathrm{bar}}`}
            />
            <p>
              Измерената стойност е около{" "}
              <RichText text={raw`$0{,}21\,\mathrm{K/bar}$`} /> - моделът уцелва с 15 процента.
              Водород при същата температура:{" "}
              <RichText
                text={raw`$2a/(RT)-b\approx-6{,}8\cdot10^{-6}\,\mathrm{m^3/mol}<0$`}
              />
              , тоест отговорът на въпроса по-горе.
            </p>
          </Check>

          <P text="Това е границата при $p\to0$. Пълната крива на инверсия, на която $\mu$ сменя знака при всяко налягане, извеждаме в следващия урок, след като имаме критичната точка." />

          <TeacherNote>
            <p>
              Двата опита от <RichText text={raw`$\S8$`} /> и <RichText text={raw`$\S9$`} /> се
              смесват много често. Най-бързата диагностика: „коя величина е постоянна?“ Ако ученикът
              отговори „вътрешната енергия“ и за дроселирането, фигурата с двете сцени си струва да
              се погледне отново.
            </p>
            <p>
              Второ недоразумение: ефектът на Джаул-Томсън не е „същото като свободното разширение, но
              бавно“. Разликата не е в скоростта, а в това, че при поток веществото внася и изнася
              работа на избутване.
            </p>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§10" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                <RichText
                  text={raw`$(\partial u/\partial\nu)_T=T(\partial p/\partial T)_\nu-p$`}
                />{" "}
                превръща манометър и термометър в калориметър. За Ван дер Ваалс дава{" "}
                <RichText text={raw`$\pi_T=a/\nu^2$`} /> и{" "}
                <RichText text={raw`$u=c_VT-a/\nu$`} />.
              </li>
              <li>
                Същата връзка, приложена към фотонен газ, дава{" "}
                <RichText text={raw`$e\propto T^4$`} /> - законът на Стефан-Болцман.
              </li>
              <li>
                <RichText text={raw`$c_p-c_V=T\nu\alpha^2/\kappa_T\ge0$`} /> винаги; за течности е под
                един процент, а в критичната точка{" "}
                <RichText text={raw`$c_p$`} /> се разбягва.
              </li>
              <li>
                Знакът на температурния ефект при адиабатно свиване е знакът на{" "}
                <RichText text={raw`$\alpha$`} />. Адиабатата на реалния газ е{" "}
                <RichText text={raw`$T(\nu-b)^{R/c_V}=\text{const}$`} />, а ентропията му зависи от
                свободния обем <RichText text={raw`$\nu-b$`} />.
              </li>
              <li>
                Свободно разширение: <RichText text={raw`$u=\text{const}$`} />, газът винаги изстива,
                и то заради <RichText text="$a$" />. Дроселиране:{" "}
                <RichText text={raw`$h=\text{const}$`} />, знакът зависи от{" "}
                <RichText text={raw`$2a/(RT)-b$`} /> и може да е и в двете посоки.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/90">
            <strong>Следващ урок:</strong>{" "}
            <Link
              href="/physics/termodinamika-universitet/van-der-vaals"
              className="font-semibold text-minus hover:underline"
            >
              Газът на Ван дер Ваалс докрай
            </Link>{" "}
            - критичната точка, течността, метастабилните състояния и пълната крива на инверсия, с две
            симулации.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
