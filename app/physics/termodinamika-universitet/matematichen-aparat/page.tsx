import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import { Check, Derive, Meaning, Steps } from "@/components/DerivationBlocks";
import PathWorkLab from "@/components/interactives/PathWorkLab";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import { FlowDeviceFigure, MaxwellBridgeFigure } from "@/components/interactives/RealGasFigures";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Математическият апарат и термодинамичните потенциали · SingularityLab",
  description:
    "Пълен диференциал и критерият за функция на състоянието, циклично правило, коефициентите на разширение и свиваемост, четирите термодинамични потенциала и съотношенията на Максуел.",
};

const raw = String.raw;

const SECTION_NAV = [
  { id: "path", n: "§1", label: "Път и състояние" },
  { id: "cyclic", n: "§2", label: "Циклично правило" },
  { id: "coeff", n: "§3", label: "Коефициентите" },
  { id: "first", n: "§4", label: "Първи принцип" },
  { id: "second", n: "§5", label: "Втори принцип" },
  { id: "enthalpy", n: "§6", label: "Енталпия" },
  { id: "potentials", n: "§7", label: "Потенциали" },
  { id: "maxwell", n: "§8", label: "Максуел" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

function P({ text }: { text: string }) {
  return (
    <p className="my-4 text-[16.5px] leading-relaxed text-ink/90">
      <RichText text={text} />
    </p>
  );
}

export default function MathApparatusLessonPage() {
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
            Математическият апарат и термодинамичните потенциали
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Какво следва само от това, че една величина е функция на състоянието: пълен диференциал,
            циклично правило и четирите съотношения на Максуел
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="path" n="§1" title="Какво зависи от пътя и какво - не">
          <P text="В курса за идеален газ работата и топлината се пресмятат за всеки процес поотделно: изотермен, изохорен, адиабатен. Тук сменяме въпроса. Вместо да питаме какво става при даден процес, питаме **кои връзки важат за всяко вещество** - за газ, за течност, за гумен ластик, дори за топлинното излъчване в затворена кухина. Отговорът почти винаги идва от едно и също наблюдение: някои величини зависят от изминатия път, а други - само от началното и крайното състояние." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Газ минава от състояние 1 до състояние 2 по два различни пътя и извършва различна работа. Какво следва за приетата топлина?"
              options={[
                {
                  text: "Също е различна, защото промяната на вътрешната енергия е една и съща",
                  correct: true,
                  why: raw`Точно така. Първият принцип е $Q=\Delta u+A$. Щом $\Delta u$ зависи само от двата края, а $A$ се мени, то и $Q$ трябва да се мени със същата разлика.`,
                },
                {
                  text: "Също е различна, но промяната на вътрешната енергия компенсира разликата",
                  correct: false,
                  why: raw`Вътрешната енергия е функция на състоянието: между едни и същи състояния $\Delta u$ е едно и също число, независимо от пътя. Няма какво да компенсира.`,
                },
                {
                  text: "Еднаква е, защото началното и крайното състояние са еднакви",
                  correct: false,
                  why: raw`Това важи за функциите на състоянието, а топлината не е такава. Ако $Q$ беше еднаква, а $A$ - различна, първият принцип щеше да е нарушен.`,
                },
                {
                  text: "Еднаква е, защото топлината е функция на състоянието",
                  correct: false,
                  why: raw`Топлината не е функция на състоянието. Няма смисъл да се говори за „топлината на газа“ в дадено състояние, а само за топлината, обменена по даден път. Точно затова пишем $\delta Q$, а не $dQ$.`,
                },
              ]}
              explanation={raw`Запазващата се сметка е $\Delta u$, а не поотделно $Q$ и $A$. Проверете го на симулацията: площта под пътя се мени, двете дясни полета стоят неподвижни.`}
            />
          </div>

          <div className="my-6">
            <PathWorkLab />
          </div>

          <P text="Симулацията показва и нещо повече от очакваното. Работата се мени, топлината се мени заедно с нея, но **ентропията също стои неподвижна** - точно като вътрешната енергия. Това не е съвпадение и не е допускане: ще го получим като извод." />

          <P text="Нужният инструмент е записът на малка промяна. Величина на състоянието има определена стойност във всяко равновесно състояние, независимо как сме стигнали дотам. Ако $z$ зависи от две променливи, $z=z(x,y)$, малката ѝ промяна е сума от двата приноса:" />
          <Formula
            latex={raw`dz=\left(\frac{\partial z}{\partial x}\right)_{\!y}dx+\left(\frac{\partial z}{\partial y}\right)_{\!x}dy\equiv M\,dx+N\,dy`}
          />
          <P text="Индексът казва коя променлива държим постоянна: при $(\partial z/\partial x)_y$ диференцираме по $x$ и третираме $y$ като число." />

          <Derive title="Извод: критерий за пълен диференциал">
            <Steps>
              <>
                <p>
                  За гладка функция смесените втори производни не зависят от реда на диференциране
                  (теорема на Шварц):
                </p>
                <Formula
                  latex={raw`\frac{\partial}{\partial y}\left(\frac{\partial z}{\partial x}\right)=\frac{\partial}{\partial x}\left(\frac{\partial z}{\partial y}\right)`}
                />
              </>
              <p>
                Но <RichText text={raw`$(\partial z/\partial x)_y=M$`} /> и{" "}
                <RichText text={raw`$(\partial z/\partial y)_x=N$`} />. Заместваме и получаваме
                критерия.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`M\,dx+N\,dy\ \text{е пълен диференциал}\iff\left(\frac{\partial M}{\partial y}\right)_{\!x}=\left(\frac{\partial N}{\partial x}\right)_{\!y}`}
          />
          <P text="Този ред ще използваме навсякъде: **всеки път, когато знаем, че нещо е функция на състоянието, получаваме безплатно едно уравнение** - равенството на смесените производни." />

          <h3 className="mt-8 mb-2 font-serif text-[21px] font-bold text-ink">
            Топлината не е функция на състоянието, но <RichText text={raw`$\delta Q/T$`} /> е
          </h3>
          <Derive>
            <Steps>
              <>
                <p>
                  За <RichText text={raw`$1\,\mathrm{mol}$`} /> идеален газ първият принцип дава{" "}
                  <RichText text={raw`$\delta Q=du+p\,d\nu$`} />, а{" "}
                  <RichText text={raw`$du=c_V\,dT$`} /> и <RichText text={raw`$p=RT/\nu$`} />:
                </p>
                <Formula latex={raw`\delta Q=c_V\,dT+\frac{RT}{\nu}\,d\nu`} />
              </>
              <>
                <p>
                  Тук <RichText text="$M=c_V$" /> и <RichText text={raw`$N=RT/\nu$`} />. Проверяваме
                  критерия:
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial c_V}{\partial\nu}\right)_{\!T}=0,\qquad\left(\frac{\partial}{\partial T}\frac{RT}{\nu}\right)_{\!\nu}=\frac{R}{\nu}\neq0`}
                />
                <p>
                  Критерият не е изпълнен, значи <RichText text="$Q$" /> зависи от пътя. Точно това
                  видяхме на симулацията.
                </p>
              </>
              <>
                <p>
                  Делим на <RichText text="$T$" />:
                </p>
                <Formula
                  latex={raw`\frac{\delta Q}{T}=\frac{c_V}{T}\,dT+\frac{R}{\nu}\,d\nu,\qquad\left(\frac{\partial}{\partial\nu}\frac{c_V}{T}\right)_{\!T}=0=\left(\frac{\partial}{\partial T}\frac{R}{\nu}\right)_{\!\nu}`}
                />
                <p>Сега критерият е изпълнен.</p>
              </>
              <>
                <p>
                  Значи съществува функция на състоянието <RichText text="$s$" /> с{" "}
                  <RichText text={raw`$ds=\delta Q/T$`} />. Интегрираме:
                </p>
                <Formula latex={raw`s=c_V\ln T+R\ln\nu+s_0`} />
              </>
            </Steps>
          </Derive>

          <Meaning>
            <p>
              Топлината, която газът поема между две състояния, зависи от пътя. Но топлината,
              разделена на температурата, при която е поета, не зависи. Тази величина е{" "}
              <strong>ентропията</strong>. Тук я „открихме“ за идеалния газ: едно деление на{" "}
              <RichText text="$T$" /> превърна неинтегруем израз в пълен диференциал. Вторият принцип
              твърди, че <RichText text="$1/T$" /> върши същото за всяко вещество.
            </p>
            <p>
              Затова и в симулацията <RichText text={raw`$\Delta s$`} /> беше едно и също по всички
              пътища: <RichText text={raw`$R\ln(\nu_2/\nu_1)=7{,}62\,\mathrm{J/(mol\cdot K)}$`} />.
            </p>
          </Meaning>

          <TeacherNote>
            <p>
              Диагностичен въпрос преди симулацията: „има ли смисъл изразът топлината на този газ в
              това състояние?“ Отговорът „да“ издава точно грешката, която{" "}
              <RichText text={raw`$\delta Q$`} /> се опитва да предотврати. Полезно е да се поиска от
              ученика да намери двата крайни пътя сам, преди да види плъзгача.
            </p>
            <p>
              Честа грешка: смесване на „не зависи от пътя“ с „е постоянно“. Вътрешната енергия
              зависи от състоянието, тоест се мени - но не и от начина, по който сме стигнали дотам.
            </p>
          </TeacherNote>
        </Section>

        <Section id="cyclic" n="§2" title="Цикличното правило: третият опит е предсказан">
          <P text="Трите величини $p$, $\nu$ и $T$ са свързани с уравнението на състоянието. Значи всяка е функция на другите две и трите производни между тях не могат да са независими. Преди извода си струва да се заложи на отговора." />

          <div className="my-6">
            <PredictionQuestion
              prompt="Колко е произведението на трите производни $(\partial p/\partial T)_\nu\,(\partial T/\partial\nu)_p\,(\partial\nu/\partial p)_T$?"
              options={[
                {
                  text: raw`$-1$`,
                  correct: true,
                  why: raw`Да. Частните производни не са дроби, които се съкращават: всяка е взета при различна постоянна величина, и остатъкът е точно един знак минус.`,
                },
                {
                  text: raw`$+1$`,
                  correct: false,
                  why: raw`Това се получава, ако $\partial p$, $\partial T$ и $\partial\nu$ се съкратят като числители и знаменатели. Но $(\partial p/\partial T)_\nu$ и $(\partial p/\partial T)_s$ са различни числа, значи символът $\partial p$ не е един и същ множител.`,
                },
                {
                  text: "Зависи от веществото",
                  correct: false,
                  why: "Не зависи. Изводът използва само това, че съществува уравнение на състоянието, без да го конкретизира. Затова резултатът важи и за вода, и за хелий.",
                },
                {
                  text: raw`$0$`,
                  correct: false,
                  why: raw`Нула би значело, че една от трите производни е нула за всяко вещество. За водата при $4\,^\circ\mathrm{C}$ наистина $(\partial\nu/\partial T)_p=0$, но това е изключение, не правило.`,
                },
              ]}
              explanation="Минусът не е технически детайл: той е следствие от това, че всяка производна описва различен опит."
            />
          </div>

          <Derive>
            <Steps>
              <>
                <p>
                  Записваме пълния диференциал на <RichText text={raw`$\nu(T,p)$`} />:
                </p>
                <Formula
                  latex={raw`d\nu=\left(\frac{\partial\nu}{\partial T}\right)_{\!p}dT+\left(\frac{\partial\nu}{\partial p}\right)_{\!T}dp`}
                />
              </>
              <>
                <p>
                  Избираме процес при постоянен обем, <RichText text={raw`$d\nu=0$`} />. Тогава{" "}
                  <RichText text="$dT$" /> и <RichText text="$dp$" /> вече не са независими:
                  отношението им е точно <RichText text={raw`$(\partial p/\partial T)_\nu$`} />.
                </p>
                <Formula
                  latex={raw`\left(\frac{\partial p}{\partial T}\right)_{\!\nu}=-\,\frac{(\partial\nu/\partial T)_p}{(\partial\nu/\partial p)_T}`}
                />
              </>
              <p>
                Умножаваме по{" "}
                <RichText
                  text={raw`$(\partial T/\partial\nu)_p\,(\partial\nu/\partial p)_T$`}
                />{" "}
                и използваме, че{" "}
                <RichText text={raw`$(\partial T/\partial\nu)_p=1/(\partial\nu/\partial T)_p$`} />.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\left(\frac{\partial p}{\partial T}\right)_{\!\nu}\left(\frac{\partial T}{\partial\nu}\right)_{\!p}\left(\frac{\partial\nu}{\partial p}\right)_{\!T}=-1`}
          />

          <P text="Същият ред, приложен към $p(T,\nu)$ при $dp=0$, дава производната, която ни трябва за газа на Ван дер Ваалс:" />
          <Formula
            latex={raw`\left(\frac{\partial\nu}{\partial T}\right)_{\!p}=-\,\frac{(\partial p/\partial T)_\nu}{(\partial p/\partial\nu)_T}`}
          />

          <Check title="Проверка с идеалния газ и прилагане за Ван дер Ваалс">
            <p>
              Идеален газ: <RichText text={raw`$(\partial p/\partial T)_\nu=R/\nu$`} /> и{" "}
              <RichText text={raw`$(\partial p/\partial\nu)_T=-RT/\nu^2$`} />. Връзката дава{" "}
              <RichText text={raw`$\nu/T=R/p$`} /> - същото, което идва от директното диференциране на{" "}
              <RichText text={raw`$\nu=RT/p$`} />.
            </p>
            <p>
              Ван дер Ваалс: <RichText text={raw`$\nu(T,p)$`} /> е корен на кубично уравнение и не се
              изразява удобно. Но <RichText text={raw`$p(T,\nu)$`} /> имаме наготово:
            </p>
            <Formula
              latex={raw`\left(\frac{\partial p}{\partial T}\right)_{\!\nu}=\frac{R}{\nu-b},\qquad\left(\frac{\partial p}{\partial\nu}\right)_{\!T}=-\frac{RT}{(\nu-b)^2}+\frac{2a}{\nu^3}`}
            />
            <p>Заместваме и обръщаме знаците в знаменателя:</p>
            <Formula
              latex={raw`\left(\frac{\partial\nu}{\partial T}\right)_{\!p}=\frac{\dfrac{R}{\nu-b}}{\dfrac{RT}{(\nu-b)^2}-\dfrac{2a}{\nu^3}}`}
            />
          </Check>

          <Meaning>
            <p>
              Трите производни описват три различни опита: нагряване в затворен съд, нагряване при
              постоянно налягане и свиване при постоянна температура. Правилото казва, че ако сме
              направили два от тях, третият е предсказан - няма нужда да се измерва.
            </p>
            <p>
              Това не е формалност. За течност и твърдо тяло третият опит (нагряване в затворен обем)
              е почти невъзможен: налягането скача с хиляди бара и съдът се пука. Първите два са
              лесни и стоят в таблиците. В <RichText text={raw`$\S3$`} /> точно оттам ще пресметнем
              налягането в затворена отоплителна инсталация.
            </p>
          </Meaning>
        </Section>

        <Section id="coeff" n="§3" title="Двата коефициента, които стоят в таблиците">
          <P text="За течности и твърди тела в справочниците стоят две лесно измерими величини:" />
          <ul className="my-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-ink/90">
            <li>
              <RichText text={raw`$\alpha=\frac{1}{\nu}(\partial\nu/\partial T)_p$`} /> - с каква
              относителна част расте обемът при нагряване с{" "}
              <RichText text={raw`$1\,\mathrm{K}$`} />;
            </li>
            <li>
              <RichText text={raw`$\kappa_T=-\frac{1}{\nu}(\partial\nu/\partial p)_T$`} /> - с каква
              относителна част намалява обемът при увеличаване на налягането с{" "}
              <RichText text={raw`$1\,\mathrm{Pa}$`} />.
            </li>
          </ul>
          <P text="Минусът в $\kappa_T$ прави свиваемостта положителна: при натиск обемът намалява. Устойчивото вещество винаги има $\kappa_T>0$. Ако натискът увеличаваше обема, всяко случайно свиване щеше да се самоусилва - в $\S3$ на урока за Ван дер Ваалс точно това ще разцепи веществото на течност и пара." />
          <P text="Заместваме определенията в цикличното правило:" />
          <Formula
            latex={raw`\left(\frac{\partial p}{\partial T}\right)_{\!\nu}=-\,\frac{\nu\alpha}{-\nu\kappa_T}=\frac{\alpha}{\kappa_T}`}
          />
          <Check>
            <p>
              За идеалния газ <RichText text={raw`$\alpha=\frac{1}{\nu}\cdot\frac{R}{p}=\frac1T$`} /> и{" "}
              <RichText text={raw`$\kappa_T=\frac{1}{\nu}\cdot\frac{RT}{p^2}=\frac1p$`} />, значи{" "}
              <RichText text={raw`$\alpha/\kappa_T=p/T=R/\nu$`} /> - съвпада с директното
              диференциране на <RichText text={raw`$p=RT/\nu$`} />.
            </p>
            <p>
              За вода при <RichText text={raw`$20\,^\circ\mathrm{C}$`} /> таблиците дават{" "}
              <RichText text={raw`$\alpha=2{,}07\cdot10^{-4}\,\mathrm{K^{-1}}$`} /> и{" "}
              <RichText text={raw`$\kappa_T=4{,}59\cdot10^{-10}\,\mathrm{Pa^{-1}}$`} />, откъдето{" "}
              <RichText
                text={raw`$(\partial p/\partial T)_\nu\approx4{,}5\cdot10^{5}\,\mathrm{Pa/K}$`}
              />{" "}
              - около <RichText text={raw`$4{,}5\,\mathrm{bar}$`} /> на всеки градус. За въздух при
              същото налягане е 1300 пъти по-малко.
            </p>
          </Check>
          <TeacherNote>
            <p>
              Тук е най-подходящото място за задача 1 от{" "}
              <Link href="/zadachi/termodinamika-realen-gaz#zadacha-1" className="font-semibold text-minus hover:underline">
                страницата със задачи
              </Link>
              : разширителният съд на отоплението. Ученик, който е видял числото{" "}
              <RichText text={raw`$4{,}5\,\mathrm{bar/K}$`} />, разбира защо предпазният клапан не е
              излишен.
            </p>
          </TeacherNote>
        </Section>

        <Section id="first" n="§4" title="Първият принцип като диференциал">
          <P text="Приетата от газа топлина отива за промяна на вътрешната енергия и за работа на газа:" />
          <Formula latex={raw`Q=\Delta U+A,\qquad \delta Q=dU+\delta A,\qquad \delta A=p\,dV`} />
          <P text="За $1\,\mathrm{mol}$ при бавен (квазистатичен) процес:" />
          <Formula latex={raw`\delta Q=du+p\,d\nu`} />
          <Meaning>
            <p>
              Енергията се запазва. Топлина и работа са два начина да се пренесе енергия, а{" "}
              <RichText text="$u$" /> е сметката, в която се записва резултатът. Символите{" "}
              <RichText text={raw`$\delta Q$`} /> и <RichText text={raw`$\delta A$`} /> напомнят, че
              двата начина поотделно зависят от пътя, а сборът им - не.
            </p>
            <p>
              Записът <RichText text={raw`$\delta A=p\,dV$`} /> предполага механично равновесие на
              границата. При необратим процес работата срещу съпротивление се определя от външното
              налягане, а не от равновесната крива на газа: не прилагайте{" "}
              <RichText text={raw`$\int p\,d\nu$`} /> към свободно разширение.
            </p>
          </Meaning>
        </Section>

        <Section id="second" n="§5" title="Вторият принцип и основното уравнение">
          <P text="Вторият принцип в записа на Клаузиус: съществува функция на състоянието $s$, за която при обратим процес $ds=\delta Q/T$, а при всеки процес $ds\ge\delta Q/T$. Равенство има само при обратим процес. В $\S1$ видяхме как това изглежда за идеален газ; сега го приемаме за всяко вещество." />
          <Derive>
            <Steps>
              <p>
                При обратим процес <RichText text={raw`$\delta Q=T\,ds$`} />. Заместваме в първия
                принцип: <RichText text={raw`$T\,ds=du+p\,d\nu$`} />.
              </p>
              <p>
                Изразяваме <RichText text="$du$" /> и получаваме основното уравнение.
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`du=T\,ds-p\,d\nu`} />
          <P text="Изведохме го за обратим процес, но то свързва само функции на състоянието. Затова е вярно за промяна между всеки две равновесни състояния, по какъвто и път да се стигне. Сравнението с пълния диференциал на $u(s,\nu)$ дава двете производни:" />
          <Formula
            latex={raw`T=\left(\frac{\partial u}{\partial s}\right)_{\!\nu},\qquad p=-\left(\frac{\partial u}{\partial\nu}\right)_{\!s}`}
          />
          <Meaning>
            <p>
              <RichText text={raw`$p=-(\partial u/\partial\nu)_s$`} />: налягането показва колко
              енергия губи газът при единица увеличение на обема, когато не обменя топлина. При
              адиабатно разширение цялата работа идва от вътрешната енергия.
            </p>
            <p>
              <RichText text={raw`$T=(\partial u/\partial s)_\nu$`} />: температурата е „цената“ на
              ентропията - колко енергия трябва да внесем, за да увеличим ентропията с единица при
              постоянен обем. Студеното тяло приема ентропия евтино, горещото - скъпо. Затова
              топлината тече от горещо към студено: така общата ентропия расте. Този прочит ще е
              целият извод за границите на машините в последния урок.
            </p>
          </Meaning>
        </Section>

        <Section id="enthalpy" n="§6" title="Енталпия: сметката за течащо вещество">
          <P text="Определяме $h=u+p\nu$. Диференцираме и заместваме основното уравнение:" />
          <Formula latex={raw`dh=du+p\,d\nu+\nu\,dp=(T\,ds-p\,d\nu)+p\,d\nu+\nu\,dp=T\,ds+\nu\,dp`} />
          <Meaning title="Първа роля: топлина при постоянно налягане">
            <p>
              При <RichText text="$dp=0$" /> и обратим процес{" "}
              <RichText text={raw`$dh=T\,ds=\delta Q$`} />. Енталпията е топлината, която веществото
              поема при постоянно налягане - затова таблиците за изпарение и горене дават{" "}
              <RichText text={raw`$\Delta h$`} />, а не{" "}
              <RichText text={raw`$\Delta u$`} />. На открито налягането е атмосферното, тоест
              постоянно.
            </p>
          </Meaning>

          <P text="Втората, по-важна роля на $h$ е в устройствата, през които газът тече: компресор, турбина, вентил, тръба." />
          <div className="my-6">
            <FlowDeviceFigure />
          </div>
          <Derive title="Извод: енергиен баланс за поток">
            <Steps>
              <p>
                Проследяваме <RichText text={raw`$1\,\mathrm{mol}$`} />, докато минава през
                устройството. Той приема топлина <RichText text="$Q$" />, извършва полезна
                (техническа) работа <RichText text={raw`$A_{\text{техн}}$`} /> върху вала, получава
                работа <RichText text={raw`$p_1\nu_1$`} /> на входа и извършва{" "}
                <RichText text={raw`$p_2\nu_2$`} /> на изхода.
              </p>
              <>
                <p>Първият принцип за този мол:</p>
                <Formula latex={raw`u_2-u_1=Q+p_1\nu_1-p_2\nu_2-A_{\text{техн}}`} />
              </>
              <p>
                Групираме:{" "}
                <RichText
                  text={raw`$(u_2+p_2\nu_2)-(u_1+p_1\nu_1)=Q-A_{\text{техн}}$`}
                />
                , тоест работата на избутване се прибира към енергията.
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`h_2-h_1=Q-A_{\text{техн}}`} />
          <P text="Вентил или порьозна преграда (дросел) е топлоизолиран и няма вал: $Q=0$ и $A_{\text{техн}}=0$. Следователно" />
          <Formula latex={raw`h_2=h_1\qquad\text{(дроселиране)}`} />
          <Meaning title="Втора роля: какво пренася потокът">
            <p>
              В поток <RichText text="$u$" /> не е достатъчна - всеки мол носи със себе си и
              работата, нужна да бъде избутан. Затова величината, която течащото вещество „пренася“,
              е <RichText text="$h$" />. Оттук идват и двете най-полезни приложения в целия раздел:
              втечняването на газове с вентил и парокомпресионният хладилник.
            </p>
          </Meaning>
        </Section>

        <Section id="potentials" n="§7" title="Свободна енергия и потенциал на Гибс">
          <P text="Определяме $f=u-Ts$. Диференцираме и заместваме основното уравнение:" />
          <Formula latex={raw`df=du-T\,ds-s\,dT=-s\,dT-p\,d\nu`} />
          <P text="Оттук $s=-(\partial f/\partial T)_\nu$ и $p=-(\partial f/\partial\nu)_T$." />
          <Derive title="Извод: максималната работа при постоянна температура">
            <Steps>
              <p>
                За всеки процес, и необратим, първият принцип дава{" "}
                <RichText text={raw`$\delta A=\delta Q-du$`} />, а вторият -{" "}
                <RichText text={raw`$\delta Q\le T\,ds$`} />.
              </p>
              <p>
                Значи <RichText text={raw`$\delta A\le T\,ds-du$`} />.
              </p>
              <>
                <p>
                  При <RichText text={raw`$T=\text{const}$`} /> имаме{" "}
                  <RichText text={raw`$df=du-T\,ds$`} />, тоест{" "}
                  <RichText text={raw`$T\,ds-du=-df$`} />. Интегрираме:
                </p>
                <Formula latex={raw`A\le-\Delta f\qquad(T=\text{const})`} />
              </>
            </Steps>
          </Derive>
          <Meaning>
            <p>
              При постоянна температура веществото може да извърши най-много{" "}
              <RichText text={raw`$-\Delta f$`} /> работа. „Свободна“ е частта от енергията,
              достъпна за работа; останалата част <RichText text={raw`$T\Delta s$`} /> е „свързана“ -
              тя задължително се обменя като топлина с околната среда.
            </p>
          </Meaning>

          <P text="Определяме и $g=h-Ts$. Диференцираме и заместваме $dh$:" />
          <Formula latex={raw`dg=dh-T\,ds-s\,dT=-s\,dT+\nu\,dp`} />
          <Derive title="Извод: накъде вървят процесите при постоянна температура и налягане">
            <Steps>
              <p>
                При постоянно налягане от първия принцип{" "}
                <RichText text={raw`$dh=du+p\,d\nu=\delta Q$`} />.
              </p>
              <p>
                При постоянна температура{" "}
                <RichText text={raw`$dg=dh-T\,ds=\delta Q-T\,ds$`} />.
              </p>
              <p>
                Вторият принцип <RichText text={raw`$\delta Q\le T\,ds$`} /> дава{" "}
                <RichText text={raw`$dg\le0$`} />: самопроизволните процеси при постоянни{" "}
                <RichText text="$T$" /> и <RichText text="$p$" /> намаляват{" "}
                <RichText text="$g$" />, а в равновесие <RichText text="$g$" /> е минимален.
              </p>
            </Steps>
          </Derive>
          <Meaning>
            <p>
              Течност и пара при една и съща <RichText text="$T$" /> и <RichText text="$p$" /> могат
              да съществуват заедно само ако{" "}
              <RichText text={raw`$g_{\text{течн}}=g_{\text{пара}}$`} />. Иначе веществото би
              преминавало в онази фаза, където <RichText text="$g$" /> е по-малък, докато едната фаза
              изчезне. От това условие ще изведем правилото на Максуел за изотермите на Ван дер
              Ваалс - най-неочакваното място, където потенциалът на Гибс върши видима работа.
            </p>
          </Meaning>
        </Section>

        <Section id="maxwell" n="§8" title="Съотношенията на Максуел">
          <P text="Имаме четири пълни диференциала. Критерият от $\S1$ казва: щом всеки от тях е пълен, смесените производни са равни. Четири диференциала дават четири уравнения." />
          <Derive title="Извод (подробно за третото, останалите по същия ред)">
            <Steps>
              <p>
                <RichText text={raw`$df=-s\,dT-p\,d\nu$`} />. Тук променливите са{" "}
                <RichText text="$x=T$" /> и <RichText text={raw`$y=\nu$`} />, а{" "}
                <RichText text="$M=-s$" />, <RichText text="$N=-p$" />.
              </p>
              <p>
                Критерият дава{" "}
                <RichText
                  text={raw`$\left(\partial(-s)/\partial\nu\right)_T=\left(\partial(-p)/\partial T\right)_\nu$`}
                />
                .
              </p>
              <p>
                Умножаваме по <RichText text="$-1$" />:{" "}
                <RichText
                  text={raw`$(\partial s/\partial\nu)_T=(\partial p/\partial T)_\nu$`}
                />
                .
              </p>
              <p>
                По същия начин от <RichText text="$du$" /> (променливи{" "}
                <RichText text={raw`$s,\nu$`} />), от <RichText text="$dh$" /> (променливи{" "}
                <RichText text="$s,p$" />) и от <RichText text="$dg$" /> (променливи{" "}
                <RichText text="$T,p$" />) получаваме другите три.
              </p>
            </Steps>
          </Derive>

          <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-[15.5px]">
              <thead>
                <tr className="border-b-2 border-ink text-left">
                  <th className="py-2 pr-3 font-semibold">От кой диференциал</th>
                  <th className="py-2 pr-3 font-semibold">Съотношение</th>
                  <th className="py-2 font-semibold">Номер</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    from: raw`du=T\,ds-p\,d\nu`,
                    rel: raw`\left(\frac{\partial T}{\partial\nu}\right)_{\!s}=-\left(\frac{\partial p}{\partial s}\right)_{\!\nu}`,
                    id: "M1",
                  },
                  {
                    from: raw`dh=T\,ds+\nu\,dp`,
                    rel: raw`\left(\frac{\partial T}{\partial p}\right)_{\!s}=\left(\frac{\partial\nu}{\partial s}\right)_{\!p}`,
                    id: "M2",
                  },
                  {
                    from: raw`df=-s\,dT-p\,d\nu`,
                    rel: raw`\left(\frac{\partial s}{\partial\nu}\right)_{\!T}=\left(\frac{\partial p}{\partial T}\right)_{\!\nu}`,
                    id: "M3",
                  },
                  {
                    from: raw`dg=-s\,dT+\nu\,dp`,
                    rel: raw`\left(\frac{\partial s}{\partial p}\right)_{\!T}=-\left(\frac{\partial\nu}{\partial T}\right)_{\!p}`,
                    id: "M4",
                  },
                ].map((row) => (
                  <tr key={row.id} className="border-b border-rule">
                    <td className="py-3 pr-3 align-middle">
                      <RichText text={`$${row.from}$`} />
                    </td>
                    <td className="py-3 pr-3 align-middle">
                      <RichText text={`$${row.rel}$`} />
                    </td>
                    <td className="py-3 align-middle font-semibold text-minus">{row.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <P text="Остава най-важният въпрос: това математика ли е, или физика? Четири отговора." />

          <Meaning title="1. Ентропия от манометър">
            <p>
              Няма уред, който мери ентропия. Но имаме манометър, термометър и мерителен съд. M3 и M4
              изразяват промяната на <RichText text="$s$" /> само чрез{" "}
              <RichText text={raw`$p$, $\nu$, $T$`} /> - тоест чрез неща, които мерим директно. Без
              тях ентропията щеше да остане абстракция в учебника.
            </p>
          </Meaning>

          <Meaning title="2. Два несвързани опита дават едно и също число">
            <p>
              M3, умножено по <RichText text="$T$" />, гласи: топлината, която газът поема при
              изотермно разширение, се определя от това колко бързо расте налягането му при нагряване
              в затворен съд. Първото е калориметрия, второто - механика.
            </p>
          </Meaning>
          <div className="my-6">
            <MaxwellBridgeFigure />
          </div>
          <P text="За $1\,\mathrm{mol}$ при $T=\text{const}$ сметката е на един ред:" />
          <Formula
            latex={raw`Q=T\int\left(\frac{\partial p}{\partial T}\right)_{\!\nu}d\nu=\begin{cases}RT\ln\dfrac{\nu_2}{\nu_1}&\text{идеален газ}\\[2ex]RT\ln\dfrac{\nu_2-b}{\nu_1-b}&\text{Ван дер Ваалс}\end{cases}`}
          />
          <P text="Вторият резултат обикновено се получава през $\Delta u$ и $A$ поотделно. Тук идва направо, и то без да сме допускали нищо за вътрешната енергия." />

          <Meaning title="3. Неочаквано предсказание">
            <p>
              От M4 ще изведем, че при адиабатно свиване температурата се променя пропорционално на{" "}
              <RichText text={raw`$\alpha$`} />. Вещество, което се разширява при нагряване, се
              нагрява при свиване - като въздуха в помпата за колело. Водата между{" "}
              <RichText text={raw`$0$`} /> и <RichText text={raw`$4\,^\circ\mathrm{C}$`} /> се свива
              при нагряване, тоест <RichText text={raw`$\alpha<0$`} />; затова при адиабатно свиване
              тя <em>се охлажда</em>. Без термодинамика никой не би го предположил.
            </p>
          </Meaning>

          <Meaning title="4. Гуменият ластик">
            <p>
              За ластик ролята на <RichText text="$-p$" /> играе силата на опън{" "}
              <RichText text="$F$" />, а на <RichText text={raw`$\nu$`} /> - дължината{" "}
              <RichText text="$L$" />. M3 става{" "}
              <RichText text={raw`$(\partial s/\partial L)_T=-(\partial F/\partial T)_L$`} />.
            </p>
            <p>
              Опит: окачете тежест на ластик и го нагрейте със сешоар - ластикът се скъсява. Значи при
              постоянна дължина опънът расте с температурата,{" "}
              <RichText text={raw`$(\partial F/\partial T)_L>0$`} />, и тогава{" "}
              <RichText text={raw`$(\partial s/\partial L)_T<0$`} />. Разтягането намалява ентропията,
              затова при бързо разтягане ластикът се затопля. Опитайте с устни; задача 2 го пресмята
              и дава около <RichText text={raw`$1\,\mathrm{K}$`} />.
            </p>
          </Meaning>

          <TeacherNote>
            <p>
              Съотношенията на Максуел се запомнят лесно и се разбират трудно. Вместо мнемоники
              искайте от ученика да каже за всяко от четирите кои два опита свързва. Ако не може,
              запомненото е безполезно.
            </p>
            <p>
              Диагностичен въпрос: „защо в M4 има минус, а в M3 - не?“ Отговорът изисква да се
              проследи знакът в съответния диференциал, а не да се помни таблица.
            </p>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§9" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Работата и топлината зависят от пътя, вътрешната енергия и ентропията - не. Затова се
                пише <RichText text={raw`$\delta Q$`} />, но <RichText text="$du$" />.
              </li>
              <li>
                Щом нещо е функция на състоянието, смесените му производни са равни. Всяко такова
                равенство е безплатно уравнение между измерими величини.
              </li>
              <li>
                Цикличното правило свързва трите производни на{" "}
                <RichText text={raw`$p$, $\nu$, $T$`} />: два опита определят третия, а{" "}
                <RichText text={raw`$(\partial p/\partial T)_\nu=\alpha/\kappa_T$`} /> го прави
                практично.
              </li>
              <li>
                Четирите потенциала са едно и също съдържание в четири удобни форми:{" "}
                <RichText text={raw`$du=T\,ds-p\,d\nu$`} />,{" "}
                <RichText text={raw`$dh=T\,ds+\nu\,dp$`} />,{" "}
                <RichText text={raw`$df=-s\,dT-p\,d\nu$`} />,{" "}
                <RichText text={raw`$dg=-s\,dT+\nu\,dp$`} />.
              </li>
              <li>
                <RichText text="$h$" /> е сметката за течащо вещество; при дроселиране{" "}
                <RichText text={raw`$h=\text{const}$`} />. <RichText text="$g$" /> е сметката за
                фазово равновесие; в равновесие той е минимален.
              </li>
              <li>
                Съотношенията на Максуел изразяват ентропията чрез уред с циферблат. Това е
                инструментът, с който следващият урок превръща уравнението на състоянието в енергия,
                топлинни капацитети и охлаждане.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/90">
            <strong>Следващ урок:</strong>{" "}
            <Link
              href="/physics/termodinamika-universitet/glavnite-vrazki"
              className="font-semibold text-minus hover:underline"
            >
              Главните връзки: уравнението на състоянието определя всичко
            </Link>{" "}
            - вътрешната енергия, топлинните капацитети, адиабатите и ентропията на реален газ, все от{" "}
            <RichText text={raw`$p(T,\nu)$`} /> и няколко производни.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
