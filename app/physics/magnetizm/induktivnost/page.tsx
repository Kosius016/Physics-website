import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import {
  BasicInductorCircuitDiagram,
  CoaxialCableDiagram,
  OscillationCircuitDiagram,
  SwitchingRLCircuitDiagram,
  WirelessChargerDiagram,
} from "@/components/interactives/InductanceDiagrams";
import {
  LCEnergyLab,
  MutualInductanceLab,
  RLCircuitLab,
  RLCDampingLab,
} from "@/components/interactives/InductanceLabs";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Индуктивност - токът има електромагнитна инерция · STEM Платформа",
  description:
    "Самоиндукция, RL контури, енергия на магнитното поле, взаимна индуктивност и LC/RLC трептения с пълни извеждания и интерактивни SVG модели.",
};

const SECTION_NAV = [
  { id: "self", n: "§1", label: "Самоинд." },
  { id: "rl", n: "§2", label: "С резистор" },
  { id: "energy", n: "§3", label: "Енергия" },
  { id: "mutual", n: "§4", label: "Взаимна" },
  { id: "lc", n: "§5", label: "Трептения" },
  { id: "rlc", n: "§6", label: "Затихване" },
  { id: "recap", n: "§7", label: "Финал" },
] as const;

const BLEED = "xl:-mr-[11rem] 2xl:-mr-[19rem]";

function Wide({ children }: { children: React.ReactNode }) {
  return <div className={BLEED}>{children}</div>;
}
function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[16px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

function Derivation({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 rounded-[10px] border-[1.5px] border-rule bg-paper px-5 py-4">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
        {title}
      </p>
      <div className="space-y-4 text-[16px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

function Example({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-7 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">
        Пример {number}
      </p>
      <h3 className="mt-1 mb-4 font-serif text-[21px] font-bold text-ink">{title}</h3>
      <div className="space-y-4 text-[16px] leading-relaxed text-ink/90">{children}</div>
    </div>
  );
}

export default function InductanceLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav
            aria-label="Път до урока"
            className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted"
          >
            <Link
              href="/physics"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Физика
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/physics?level=university#magnetism"
              className="rounded-sm transition-colors hover:text-minus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-minus"
            >
              Електромагнитна индукция
            </Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
            Индуктивност: токът има електромагнитна инерция
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Защо лампа с намотка не реагира мигновено? Как токът може да продължи и след
            изключване на батерията? Отговорът е, че токът създава магнитно поле, а промяната
            на това поле поражда напрежение, което се противопоставя на самата промяна.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <div className="space-y-4 pt-8 text-[17px] leading-relaxed text-ink/90">
          <p>
            Представете си батерия, резистор и намотка, свързани последователно. Затваряме
            ключа. Ако имаше само резистор, токът веднага би станал{" "}
            <RichText text="$\mathcal E/R$" />. С намотка токът нараства постепенно. Значи
            намотката създава ефект, който съществува само докато токът се променя.
          </p>
          <p>
            Червената нишка на урока е:{" "}
            <strong>индукторът не се противопоставя на тока, а на промяната на тока</strong>.
            Първо ще разберем как собственото магнитно поле на една намотка поражда
            напрежение в същата намотка. После ще добавим последователно резистор, втора
            намотка и кондензатор. Така всяко ново означение ще се появява заедно с
            физическия компонент, който означава.
          </p>
        </div>

        <Section id="self" n="§1" title="Самоиндукция и индуктивност">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Свържете батерия, резистор и намотка. В мига на затваряне на ключа токът{" "}
              <strong>не скача</strong> до установената стойност. Нарастващият ток усилва
              магнитното поле; потокът през повърхността, ограничена от намотката, нараства
              и по закона на Фарадей поражда ЕДН, насочено срещу промяната. Затова го наричаме{" "}
              <strong>обратно ЕДН</strong>, а явлението - <strong>самоиндукция</strong>.
            </p>
            <p>
              Разграничаваме ЕДН от физически източник (батерия) и{" "}
              <em>индуцирано</em> ЕДН, създадено от променящо се поле. Тук полето и ЕДН
              възникват в една и съща верига.
            </p>
            <p>
              В схемата <RichText text="$\mathcal E$" /> означава ЕДН на батерията, а{" "}
              <RichText text="$R$" /> - съпротивлението на резистора. Буквата{" "}
              <RichText text="$L$" /> до намотката е величината, която предстои да
              дефинираме: нейната индуктивност.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <BasicInductorCircuitDiagram />
          </div>

          <Derivation title="Поток, потокосцепление и индуктивност - в този ред">
            <p>
              Всяка витка огражда повърхност. <strong>Магнитният поток</strong> през
              повърхността на витка <RichText text="$k$" /> измерва каква част от
              магнитното поле я пресича:
            </p>
            <Formula latex={String.raw`\Phi_k=\int_{S_k}\vec B\cdot d\vec A`} />
            <p>
              Намотката обаче има много витки. За закона на Фарадей трябва да съберем
              потока през всяка от тях. Тази сума наричаме{" "}
              <strong>потокосцепление</strong> и я означаваме с{" "}
              <RichText text="$\lambda$" />:
            </p>
            <Formula
              latex={String.raw`\lambda\equiv\Phi_1+\Phi_2+\cdots+\Phi_N=\sum_{k=1}^{N}\Phi_k`}
            />
            <p>
              Потокосцеплението не е ново магнитно поле. То е удобна обща мярка за това
              колко поток е „свързан“ с всички витки. Ако през всяка витка преминава един и
              същ поток <RichText text="$\Phi_B$" />, сумата се опростява до:
            </p>
            <Formula latex={String.raw`\lambda=N\Phi_B`} />
            <p>
              Законът на Фарадей за цялата намотка тогава се записва кратко:
            </p>
            <Formula
              latex={String.raw`\mathcal E_L=-\frac{d\lambda}{dt}`}
            />
            <p>
              Минусът е законът на Ленц: индуцираното ЕДН противодейства на{" "}
              <em>промяната</em> на потокосцеплението.
            </p>
            <p>
              Сега свързваме потока с тока. При фиксирана геометрия и линейна магнитна
              среда полето е пропорционално на тока. Както пропорционалността{" "}
              <RichText text="$F_{\mathrm{net}}\propto a$" /> се превръща в уравнението{" "}
              <RichText text="$F_{\mathrm{net}}=ma$" /> чрез константата{" "}
              <RichText text="$m$" />, тук въвеждаме константа, която съдържа геометрията и
              материала:
            </p>
            <Formula
              latex={String.raw`\vec B(\vec r)\propto I\quad\Longrightarrow\quad\vec B(\vec r)=\vec k_B(\vec r)\,I`}
            />
            <p>
              Понеже повърхностите не се променят, всеки поток също е пропорционален на
              тока: <RichText text="$\Phi_k=k_{\Phi,k}I$" />. Сумираме по всички витки:
            </p>
            <Formula
              latex={String.raw`\lambda=\left(\sum_{k=1}^{N}k_{\Phi,k}\right)I\equiv LI`}
            />
            <p>
              Константата <RichText text="$L$" /> наричаме{" "}
              <strong>индуктивност</strong>. Тя характеризира намотката, а не моментната
              стойност на тока:
            </p>
            <Formula latex={String.raw`L\equiv\frac{\lambda}{I}`} />
            <p>
              При постоянна <RichText text="$L$" /> диференцираме{" "}
              <RichText text="$\lambda=LI$" /> и го поставяме в закона на Фарадей:
            </p>
            <Formula
              latex={String.raw`\mathcal E_L=-\frac{d\lambda}{dt}=-\frac{d(LI)}{dt}=-L\frac{dI}{dt}`}
            />
            <p>
              Единицата е <strong>хенри</strong>:{" "}
              <RichText text="$1\,\mathrm H=1\,\mathrm{V\,s/A}$" />. Ако{" "}
              <RichText text="$dI/dt=0$" />, индуцираното ЕДН е нула, макар токът и
              магнитното поле да не са нула.
            </p>
            <p>
              При нелинейна феромагнитна сърцевина, особено близо до насищане,{" "}
              <RichText text="$\Phi_B\propto I$" /> престава да е точно и ефективната
              индуктивност може да зависи от тока. В този урок първо работим с линейния
              идеален модел.
            </p>
          </Derivation>

          <Callout>
            <strong>Физична интерпретация на L: паралел с масата.</strong> В механиката{" "}
            <RichText text="$F=m\,dv/dt$" />: при една и съща сила по-голямата маса променя
            скоростта си по-бавно. За намотката{" "}
            <RichText text="$|\mathcal E_L|=L|dI/dt|$" />: при едно и също напрежение по-голямата
            индуктивност променя тока по-бавно. Скок на тока за нулево време би изисквал
            безкрайно <RichText text="$dI/dt$" /> и следователно безкрайно напрежение.
            Затова токът през идеален индуктор е непрекъснат. Аналогията не означава, че
            токът има механична маса; тя показва еднаква математическа роля -{" "}
            <RichText text="$m$" /> е инерцията срещу промяна на скоростта, а{" "}
            <RichText text="$L$" /> е електромагнитната инерция срещу промяна на тока.
          </Callout>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Удвояваме тока в дълга намотка без магнитна сърцевина, без да променяме геометрията. Какво става с $L=\lambda/I$?"
              options={[
                { text: "$L$ остава същата", correct: true },
                { text: "$L$ се удвоява", correct: false },
                { text: "$L$ намалява два пъти", correct: false },
              ]}
              explanation="В линейна среда $B\propto I$, следователно $\Phi_B\propto I$. Числителят и знаменателят се удвояват заедно и отношението остава геометрична константа."
            />
          </div>

          <Example number="1" title="Как геометрията определя индуктивността на дълга намотка">
            <p>
              <strong>Дадено:</strong> дълга цилиндрична намотка (соленоид) с{" "}
              <RichText text="$N$" /> навивки, дължина <RichText text="$\ell$" /> и
              напречно сечение <RichText text="$A$" />. Вътре няма феромагнитна сърцевина,
              затова магнитната проницаемост е приблизително{" "}
              <RichText text="$\mu_0$" />.
            </p>
            <p>
              <strong>Концептуализирайте.</strong> Полето на всяка навивка свързва всички
              останали; при достатъчно дълга и плътно навита намотка полето вътре е почти
              равномерно, а крайният ефект може да се пренебрегне.
            </p>
            <p>
              <strong>Търсим:</strong> първо геометричната индуктивност{" "}
              <RichText text="$L$" />, после знака и големината на ЕДН при намаляващ ток.
              Моделът приема пренебрежимо крайно поле и линейна връзка между поток и ток.
            </p>
            <p>
              <strong>Анализирайте.</strong> Нека{" "}
              <RichText text="$n=N/\ell$" /> е броят навивки на единица дължина. От закона
              на Ампер за контур, който минава по оста на намотката:
            </p>
            <Formula
              latex={String.raw`B\ell=\mu_0NI\quad\Longrightarrow\quad B=\mu_0\frac{N}{\ell}I=\mu_0nI`}
            />
            <Formula
              latex={String.raw`\Phi_B=BA=\mu_0nIA=\mu_0\frac{N}{\ell}IA`}
            />
            <Formula
              latex={String.raw`L=\frac{N\Phi_B}{I}=\mu_0\frac{N^2}{\ell}A`}
            />
            <p>
              За <RichText text="$N=300$" />,{" "}
              <RichText text="$\ell=25{,}0\,\mathrm{cm}$" /> и{" "}
              <RichText text="$A=4{,}00\,\mathrm{cm^2}$" />:
            </p>
            <Formula
              latex={String.raw`\ell=0{,}250\,\mathrm m,\qquad A=4{,}00\times10^{-4}\,\mathrm{m^2}`}
            />
            <Formula
              latex={String.raw`L=(4\pi\times10^{-7})\frac{300^2}{25{,}0\times10^{-2}}(4{,}00\times10^{-4})=1{,}81\times10^{-4}\,\mathrm H=0{,}181\,\mathrm{mH}`}
            />
            <p>
              Ако токът намалява със скорост{" "}
              <RichText text="$dI/dt=-50{,}0\,\mathrm{A/s}$" />:
            </p>
            <Formula
              latex={String.raw`\mathcal E_L=-L\frac{dI}{dt}=-(1{,}81\times10^{-4})(-50{,}0)=9{,}05\,\mathrm{mV}`}
            />
            <p>
              Понеже <RichText text="$N=n\ell$" /> и <RichText text="$V=A\ell$" />,
              същият резултат може да се запише:
            </p>
            <Formula
              latex={String.raw`L=\mu_0n^2A\ell=\mu_0n^2V`}
            />
            <p>
              <strong>Тълкуване.</strong> Положителното{" "}
              <RichText text="$\mathcal E_L$" /> означава, че при намаляващ ток индукторът
              обръща полярността си така, че да поддържа старата посока на тока. Резултатът
              <RichText text="$0{,}181\,\mathrm{mH}$" /> е малък, което е очаквано за
              намотка без феромагнитна сърцевина.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Диагностичен въпрос: „намотката пречи ли на постоянния ток?“ Правилният
                отговор е „не в идеалния модел; тя пречи на <em>промяната</em>“.
              </li>
              <li>
                Честа грешка е да се каже, че <RichText text="$L$" /> расте с{" "}
                <RichText text="$I$" />, понеже потокът расте. Изисквайте да се проследи и
                знаменателят в <RichText text="$N\Phi_B/I$" />.
              </li>
              <li>
                За проверка на знака дайте намаляващ ток: обратното ЕДН трябва да е по
                посоката на стария ток.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="rl" n="§2" title="Резистор и индуктор при последователно свързване">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              <strong>Индуктор</strong> е компонент, проектиран да има определена
              индуктивност. В идеалния модел той няма съпротивление; реалната намотка има и
              съпротивление на проводника.
            </p>
            <p>
              Сега свързваме резистор със съпротивление <RichText text="$R$" /> и индуктор
              с индуктивност <RichText text="$L$" /> един след друг, без разклонение между
              тях. Това е <strong>последователно свързване</strong>: зарядът няма
              алтернативен път и през двата елемента преминава един и същ ток{" "}
              <RichText text="$I(t)$" />. За краткост такава верига се нарича{" "}
              <RichText text="$RL$" /> верига.
            </p>
            <p>
              При включване ключът свързва батерията към затворения{" "}
              <RichText text="$R$" />–<RichText text="$L$" /> контур. При изключване не
              прекъсваме просто проводника: ключът премахва батерията, но оставя затворен
              контур през <RichText text="$R$" /> и <RichText text="$L$" />. Така
              магнитното поле може да поддържа същата посока на тока, докато енергията се
              превръща в топлина в резистора.
            </p>
            <p>
              Ще използваме пасивната знакова конвенция. Напрежителният спад върху индуктора
              по посока на тока е <RichText text="$V_L=L\,dI/dt$" />, а индуцираното ЕДН,
              което обхожда контура, е <RichText text="$\mathcal E_L=-L\,dI/dt$" />. Това са
              два записа на един и същ Ленцов ефект, не две различни физики.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <SwitchingRLCircuitDiagram />
          </div>

          <Callout>
            <strong>Защо прекъсвач понякога искри?</strong> Ако вместо да дадем на тока
            затворен път, разтворим контакта рязко, намотката пак се опитва да запази{" "}
            <RichText text="$I$" />. Много голямото по модул{" "}
            <RichText text="$dI/dt$" /> поражда кратък импулс с високо напрежение; въздухът
            между контактите може да се йонизира и да се появи дъга. Затова около релета и
            мотори често има <em>flyback</em> диод: при нормална работа той е запушен, а при
            изключване осигурява безопасен затворен път за намаляващия ток.
          </Callout>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Резистор и индуктор са свързани последователно към идеална батерия. Къде е цялото напрежение веднага след включването и къде е след много време?"
              options={[
                {
                  text: "Първо върху индуктора; след много време върху резистора",
                  correct: true,
                },
                {
                  text: "Първо върху резистора; след много време върху индуктора",
                  correct: false,
                },
                { text: "Винаги се дели поравно", correct: false },
              ]}
              explanation="При $t=0$ токът още е нула, затова $V_R=IR=0$ и $V_L=\mathcal E$. След много време $dI/dt=0$, следователно $V_L=0$ и $V_R=\mathcal E$."
            />
          </div>

          <Derivation title="Включване: разделяне на променливите">
            <p>
              Обхождаме контура по посока на тока. Батерията дава повишение{" "}
              <RichText text="$+\mathcal E$" />, а резисторът и индукторът дават спадове{" "}
              <RichText text="$-IR$" /> и <RichText text="$-L\,dI/dt$" />. Законът на
              Кирхоф дава:
            </p>
            <Formula
              latex={String.raw`\mathcal E-IR-L\frac{dI}{dt}=0`}
            />
            <p>
              Установената стойност след много време е{" "}
              <RichText text="$I_\infty=\mathcal E/R$" />. Пренареждаме уравнението:
            </p>
            <Formula
              latex={String.raw`L\frac{dI}{dt}=R(I_\infty-I)\quad\Longrightarrow\quad\frac{dI}{dt}=\frac{R}{L}(I_\infty-I)`}
            />
            <p>
              Отношението <RichText text="$L/R$" /> има размерност време. Означаваме го с{" "}
              <RichText text="$\tau$" /> и го наричаме <strong>времеконстанта</strong>:
            </p>
            <Formula latex={String.raw`\tau\equiv\frac LR`} />
            <p>
              Физически <RichText text="$\tau$" /> задава времевия мащаб на промяната.
              Голямо <RichText text="$L$" /> прави тока по-инертен и увеличава{" "}
              <RichText text="$\tau$" />; голямо <RichText text="$R$" /> разсейва
              енергията по-бързо и намалява <RichText text="$\tau$" />. Уравнението вече е:
            </p>
            <Formula
              latex={String.raw`\frac{dI}{I_\infty-I}=\frac{dt}{\tau}`}
            />
            <p>
              Интегрираме неопределено. Константата означаваме с{" "}
              <RichText text="$C_{\mathrm{on}}$" />, защото принадлежи на процеса на
              включване:
            </p>
            <Formula
              latex={String.raw`-\ln(I_\infty-I)=\frac{t}{\tau}+C_{\mathrm{on}}`}
            />
            <p>
              Началното условие <RichText text="$I(0)=0$" /> дава{" "}
              <RichText text="$C_{\mathrm{on}}=-\ln I_\infty$" />. Следователно:
            </p>
            <Formula
              latex={String.raw`\ln\!\left(\frac{I_\infty}{I_\infty-I}\right)=\frac{t}{\tau}\quad\Longrightarrow\quad I(t)=I_\infty\left(1-e^{-t/\tau}\right)=\frac{\mathcal E}{R}\left(1-e^{-t/\tau}\right)`}
            />
            <p>
              След една времеконстанта остава само{" "}
              <RichText text="$e^{-1}=0{,}368$" /> от първоначалната разлика{" "}
              <RichText text="$I_\infty-I$" />. Затова токът вече е достигнал{" "}
              <RichText text="$1-e^{-1}=0{,}632$" />, или{" "}
              <RichText text="$63{,}2\%$" />, от крайната си стойност. Производната е:
            </p>
            <Formula
              latex={String.raw`\frac{dI}{dt}=\frac{\mathcal E}{L}e^{-t/\tau}`}
            />
            <p>
              <strong>Проверка чрез заместване:</strong>
            </p>
            <Formula
              latex={String.raw`RI+L\frac{dI}{dt}=\mathcal E(1-e^{-t/\tau})+\mathcal E e^{-t/\tau}=\mathcal E`}
            />
            <p>
              Решението удовлетворява и двете крайни условия:{" "}
              <RichText text="$I(0)=0$" /> и{" "}
              <RichText text="$I(\infty)=\mathcal E/R$" />.
            </p>
          </Derivation>

          <Derivation title="Изключване: енергията на индуктора поддържа тока">
            <p>
              След отстраняване на батерията остават резисторът и индукторът:
            </p>
            <Formula
              latex={String.raw`IR+L\frac{dI}{dt}=0\quad\Longrightarrow\quad\frac{dI}{I}=-\frac{dt}{\tau}`}
            />
            <p>
              Отново интегрираме неопределено, но този път наричаме константата{" "}
              <RichText text="$C_{\mathrm{off}}$" />:
            </p>
            <Formula
              latex={String.raw`\ln I=-\frac{t}{\tau}+C_{\mathrm{off}}`}
            />
            <p>
              Началното условие <RichText text="$I(0)=I_0$" /> дава{" "}
              <RichText text="$C_{\mathrm{off}}=\ln I_0$" /> и следователно:
            </p>
            <Formula
              latex={String.raw`I(t)=I_0e^{-t/\tau}`}
            />
            <p>
              <strong>Проверка:</strong>{" "}
              <RichText text="$dI/dt=-I/\tau=-RI/L$" />, следователно{" "}
              <RichText text="$IR+L\,dI/dt=IR-IR=0$" />.
            </p>
          </Derivation>

          <Callout>
            <strong>Граничните случаи са проверка, не украса.</strong> При{" "}
            <RichText text="$L\to0$" /> времеконстантата отива към нула и веригата се държи
            като чист резистор: <RichText text="$I\to\mathcal E/R$" /> почти мигновено. При{" "}
            <RichText text="$R\to0$" /> не бива сляпо да говорим за „установен ток“ - от
            Кирхоф остава <RichText text="$L\,dI/dt=\mathcal E$" />, следователно{" "}
            <RichText text="$I=\mathcal Et/L$" /> расте линейно. И размерността потвърждава
            формулата: <RichText text="$[L/R]=\mathrm s$" />.
          </Callout>

          <Wide>
            <div className="mt-6">
              <RLCircuitLab />
            </div>
          </Wide>

          <Example number="2" title="Колко бързо нараства токът?">
            <p>
              <strong>Дадено:</strong>{" "}
              <RichText text="$\mathcal E=9{,}00\,\mathrm V$" />,{" "}
              <RichText text="$R=4{,}50\,\Omega$" /> и{" "}
              <RichText text="$L=36{,}0\,\mathrm{mH}$" />.
            </p>
            <p>
              <strong>(A) Времеконстанта:</strong>
            </p>
            <Formula
              latex={String.raw`\tau=\frac LR=\frac{36{,}0\times10^{-3}}{4{,}50}=8{,}00\,\mathrm{ms}`}
            />
            <p>
              <strong>(B) Токът при </strong>
              <RichText text="$t=6{,}00\,\mathrm{ms}$" />:
            </p>
            <Formula
              latex={String.raw`I=\frac{9{,}00}{4{,}50}\left(1-e^{-6{,}00/8{,}00}\right)=2{,}00(1-e^{-0{,}750})=1{,}06\,\mathrm A`}
            />
            <p>
              <strong>(C) Напреженията:</strong>
            </p>
            <Formula
              latex={String.raw`V_R=IR=\mathcal E(1-e^{-t/\tau}),\qquad V_L=L\frac{dI}{dt}=\mathcal E e^{-t/\tau}`}
            />
            <Formula
              latex={String.raw`V_R(6{,}00\,\mathrm{ms})=4{,}75\,\mathrm V,\qquad V_L(6{,}00\,\mathrm{ms})=4{,}25\,\mathrm V`}
            />
            <p>
              Във всеки момент <RichText text="$V_R+V_L=9{,}00\,\mathrm V$" />. Двете
              напрежения са равни, когато{" "}
              <RichText text="$e^{-t/\tau}=1/2$" />, тоест при{" "}
              <RichText text="$t=\tau\ln2=5{,}55\,\mathrm{ms}$" />.
            </p>
            <p>
              <strong>Какво ако</strong> искаме равенството на напреженията да настъпи при{" "}
              <RichText text="$t_{1/2}=12{,}0\,\mathrm{ms}$" />? Тогава:
            </p>
            <Formula
              latex={String.raw`\tau=\frac{t_{1/2}}{\ln2}=\frac{12{,}0\,\mathrm{ms}}{0{,}693147\ldots}=17{,}3\,\mathrm{ms}`}
            />
            <p>
              При запазено <RichText text="$L=36{,}0\,\mathrm{mH}$" /> трябва{" "}
              <RichText text="$R=L/\tau=2{,}08\,\Omega$" /> - намаление с около{" "}
              <RichText text="$54\%$" />. При запазено{" "}
              <RichText text="$R=4{,}50\,\Omega$" /> трябва{" "}
              <RichText text="$L=R\tau=77{,}9\,\mathrm{mH}$" /> - увеличение с около{" "}
              <RichText text="$116\%$" />. По-малката процентна промяна е тази на{" "}
              <RichText text="$R$" />.
            </p>
            <p>
              <strong>Проверка на смисъла.</strong> По-малко <RichText text="$R$" /> или
              по-голямо <RichText text="$L$" /> увеличава{" "}
              <RichText text="$\tau=L/R$" />, затова преходът действително става по-бавен.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Питайте първо кои величини са непрекъснати: токът през индуктор не може да
                скочи, но напрежението върху него може.
              </li>
              <li>
                Честа грешка е <RichText text="$\tau=R/L$" />. Проверете размерността:
                хенри върху ом е секунда.
              </li>
              <li>
                Диагностика: ученикът трябва да обясни защо при изключване токът запазва
                старата си посока, а не се обръща.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="energy" n="§3" title="Енергия в магнитно поле">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Батерията в <RichText text="$RL$" /> контур доставя повече енергия, отколкото
              резисторът превръща в топлина, докато токът нараства. Разликата не изчезва:
              тя се натрупва в магнитното поле на индуктора и може по-късно да се върне към
              веригата.
            </p>
            <p>
              Причината се вижда от мощностите. Батерията доставя{" "}
              <RichText text="$P_{\mathrm{bat}}=\mathcal EI$" />, резисторът разсейва{" "}
              <RichText text="$P_R=I^2R$" />, а разликата е мощността, нужна за изграждане
              на полето. Така няма „липсваща“ енергия.
            </p>
          </div>

          <Derivation title="Как работата на източника се превръща в енергия на полето">
            <p>
              Започваме от уравнението на контура и го умножаваме по{" "}
              <RichText text="$I$" />:
            </p>
            <Formula
              latex={String.raw`\mathcal E I=I^2R+LI\frac{dI}{dt}`}
            />
            <p>
              Това е енергиен баланс. Лявата страна е мощността, която източникът подава
              към веригата. Първият член вдясно е мощността, която резисторът необратимо
              превръща в топлина. Оставащият член не се губи: той е скоростта, с която
              нараства енергията на магнитното поле:
            </p>
            <Formula
              latex={String.raw`\frac{dU_B}{dt}=LI\frac{dI}{dt}\quad\Longrightarrow\quad dU_B=LI\,dI`}
            />
            <p>
              Интегрираме от ненамагнитено състояние <RichText text="$I=0$" /> до ток{" "}
              <RichText text="$I$" />:
            </p>
            <Formula
              latex={String.raw`U_B=\int_0^I LI'\,dI'=\frac12LI^2`}
            />
            <p>
              Тук няма две различни енергии. <strong>Работата на източника</strong> описва
              как енергията е прехвърлена към системата;{" "}
              <strong>енергията на магнитното поле</strong>{" "}
              <RichText text="$U_B$" /> описва къде е запасена след прехвърлянето. Когато
              изключим източника, полето се свива и може да върне същата енергия към
              електрическата верига.
            </p>
          </Derivation>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Вече знаем, че $U_B=\tfrac12LI^2$. Ако удвоим тока, без да променяме $L$, колко пъти нараства запасената енергия?"
              options={[
                { text: "Нараства четири пъти", correct: true },
                { text: "Нараства два пъти", correct: false },
                { text: "Не се променя", correct: false },
              ]}
              explanation="Токът участва на квадрат: $(2I)^2=4I^2$, следователно $U_B$ става четири пъти по-голяма."
            />
          </div>

          <Derivation title="Енергията е разпределена в пространството, където има поле">
            <p>
              Формулата <RichText text="$U_B=\tfrac12LI^2$" /> приписва една обща енергия
              на цялата верига, но не казва къде в пространството се намира тя. За да
              отговорим, използваме дългата намотка от пример 1, защото полето ѝ е почти
              равномерно в обем <RichText text="$V$" />. За нея{" "}
              <RichText text="$L=\mu_0n^2V$" /> и{" "}
              <RichText text="$B=\mu_0nI$" />, следователно{" "}
              <RichText text="$I=B/(\mu_0n)$" />. Замествайки в енергията:
            </p>
            <Formula
              latex={String.raw`U_B=\frac12LI^2=\frac12\mu_0n^2V\left(\frac{B}{\mu_0n}\right)^2=\frac{B^2}{2\mu_0}V`}
            />
            <p>
              Ако еднакво поле изпълва обема, енергията на единица обем -{" "}
              <strong>плътността на магнитната енергия</strong> - е:
            </p>
            <Formula
              latex={String.raw`u_B\equiv\frac{U_B}{V}=\frac{B^2}{2\mu_0}`}
            />
            <p>
              Използвахме дълга намотка само защото равномерното ѝ поле прави сметката
              прозрачна. Резултатът е локален и важи във всяка област на вакуум с магнитно
              поле. Аналогът за електрично поле е{" "}
              <RichText text="$u_E=\tfrac12\varepsilon_0E^2$" />.
            </p>
          </Derivation>

          <Callout>
            <strong>Къде всъщност е енергията?</strong> Формулата{" "}
            <RichText text="$U_B=\tfrac12LI^2$" /> е удобна за вериги, но локалният запис{" "}
            <RichText text="$u_B=B^2/(2\mu_0)$" /> казва повече: енергията е разпределена в
            пространството, където има поле, а не е „скрита в електроните“ или само в
            медната жица. Ако полето е два пъти по-силно в дадена област, плътността на
            енергия там е четири пъти по-голяма.
          </Callout>

          <Example number="3" title="Къде отива енергията на индуктора?">
            <p>
              След изключване на батерията токът е{" "}
              <RichText text="$I(t)=I_0e^{-Rt/L}$" />. Показваме, че цялата начална
              магнитна енергия се превръща във вътрешна енергия на резистора.
            </p>
            <Formula
              latex={String.raw`\frac{dE_{\mathrm{int}}}{dt}=I^2R=I_0^2R\,e^{-2Rt/L}`}
            />
            <Formula
              latex={String.raw`E_{\mathrm{int}}=I_0^2R\left[-\frac{L}{2R}e^{-2Rt/L}\right]_0^\infty=\frac12LI_0^2`}
            />
            <p>
              Резултатът е точно началната магнитна енергия{" "}
              <RichText text="$U_B(0)=\tfrac12LI_0^2$" />; енергийният баланс се затваря.
            </p>
          </Example>

          <Example number="4" title="Индуктивност на коаксиален кабел">
            <div className="mx-auto mb-5 max-w-xl">
                <CoaxialCableDiagram />
            </div>
            <p>
              Тънка вътрешна цилиндрична жила с радиус{" "}
              <RichText text="$a$" /> и външна цилиндрична обвивка с радиус{" "}
              <RichText text="$b$" /> носят равни противоположни токове. За дължина{" "}
              <RichText text="$\ell$" /> цилиндричната симетрия прави{" "}
              <RichText text="$B$" /> постоянно по окръжност с радиус{" "}
              <RichText text="$r$" />. Законът на Ампер дава:
            </p>
            <Formula latex={String.raw`\oint\vec B\cdot d\vec\ell=B(2\pi r)=\mu_0I`} />
            <Formula latex={String.raw`B(r)=\frac{\mu_0I}{2\pi r},\qquad a<r<b`} />
            <p>
              В идеалния модел полето е нула извън външния проводник, защото амперовият
              контур обхваща токове <RichText text="$+I$" /> и{" "}
              <RichText text="$-I$" /> с нулева сума. Затова потокът се събира само в
              областта <RichText text="$a<r<b$" />.
            </p>
            <p>
              Потокът през радиална ивица с ширина{" "}
              <RichText text="$dr$" /> е <RichText text="$d\Phi_B=B\ell\,dr$" />:
            </p>
            <Formula
              latex={String.raw`\Phi_B=\int_a^b\frac{\mu_0I}{2\pi r}\ell\,dr=\frac{\mu_0I\ell}{2\pi}\ln\!\frac ba`}
            />
            <Formula
              latex={String.raw`L=\frac{\Phi_B}{I}=\frac{\mu_0\ell}{2\pi}\ln\!\frac ba`}
            />
            <p>
              Геометрията е всичко: <RichText text="$L$" /> нараства с{" "}
              <RichText text="$\ell$" /> и <RichText text="$b$" />, и намалява при
              нарастване на <RichText text="$a$" />. Размерностната проверка също работи:
              <RichText text="$\mu_0\ell$" /> има единица хенри, а{" "}
              <RichText text="$\ln(b/a)$" /> е безразмерен.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Диагностичен въпрос: „къде е енергията - в електроните, в жицата или в
                полето?“ Очакваният отговор е „в магнитното поле в пространството“.
              </li>
              <li>
                При извеждането на <RichText text="$u_B$" /> не позволявайте просто
                цитиране на формулата: проследете работата на батерията,{" "}
                <RichText text="$U_B$" />, обема и едва тогава плътността.
              </li>
              <li>
                Честа грешка в коаксиалния кабел е да се приеме постоянно{" "}
                <RichText text="$B$" />; зависимостта <RichText text="$1/r$" /> налага
                логаритъм.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="mutual" n="§4" title="Взаимна индуктивност">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Две близки, електрически несвързани намотки могат да обменят енергия чрез
              общо магнитно поле. Токът <RichText text="$I_1$" /> в първата създава поток{" "}
              <RichText text="$\Phi_{12}$" /> през втората; ако токът се мени, във втората
              възниква ЕДН. Това е <strong>взаимна индукция</strong>.
            </p>
            <p>
              Индексите ще четем като „източник 1 → приемник 2“:{" "}
              <RichText text="$\Phi_{12}$" /> е частта от полето на намотка 1, която пресича
              една навивка на намотка 2. Не целият поток на първата намотка непременно достига
              втората.
            </p>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Преместваме две съосни намотки по-близо една до друга, без да ги завъртаме. Какво става с взаимната им индуктивност?"
              options={[
                { text: "Нараства - повече поток свързва двете намотки", correct: true },
                { text: "Намалява", correct: false },
                { text: "Не се променя, защото токът е същият", correct: false },
              ]}
              explanation="$M$ е геометрична мярка за свързания поток. По-малкото разстояние обикновено увеличава частта от полето на едната намотка, която пресича другата."
            />
          </div>

          <Derivation title="Двата начина да опишем една и съща връзка">
            <p>
              Ако намотка 2 има <RichText text="$N_2$" /> навивки:
            </p>
            <Formula
              latex={String.raw`M_{12}=\frac{N_2\Phi_{12}}{I_1}`}
            />
            <p>
              От закона на Фарадей и постоянната геометрия:
            </p>
            <Formula
              latex={String.raw`\mathcal E_2=-N_2\frac{d\Phi_{12}}{dt}=-M_{12}\frac{dI_1}{dt}`}
            />
            <p>
              Ако ролите се разменят:
            </p>
            <Formula
              latex={String.raw`\mathcal E_1=-M_{21}\frac{dI_2}{dt}`}
            />
            <p>
              Единицата на <RichText text="$M$" /> също е хенри.
            </p>
          </Derivation>

          <Derivation title="Защо M₁₂ = M₂₁: енергиен аргумент">
            <p>
              Нека установим крайните токове{" "}
              <RichText text="$(I_1,I_2)$" /> по два различни пътя. Ако първо изградим{" "}
              <RichText text="$I_1$" />, а после увеличаваме{" "}
              <RichText text="$I_2$" />, промяната на втория ток поражда напрежение в първата
              намотка: <RichText text="$\mathcal E_1=-M_{21}\,dI_2/dt$" />. За да удържа{" "}
              <RichText text="$I_1$" /> в избраната посока, външният източник трябва да
              компенсира това ЕДН, тоест да приложи{" "}
              <RichText text="$V_{\mathrm{ext}}=-\mathcal E_1$" />. От{" "}
              <RichText text="$P=VI$" /> неговата допълнителна мощност е{" "}
              <RichText text="$P_{\mathrm{mut}}=M_{21}I_1\,dI_2/dt$" />. Следователно
              взаимната част на работата е:
            </p>
            <Formula latex={String.raw`W_{\mathrm{mut},A}=\int_0^{I_2}M_{21}I_1\,dI_2'=M_{21}I_1I_2`} />
            <Formula
              latex={String.raw`U_A=\frac12L_1I_1^2+M_{21}I_1I_2+\frac12L_2I_2^2`}
            />
            <p>
              Ако разменим реда, аналогично получаваме:
            </p>
            <Formula latex={String.raw`W_{\mathrm{mut},B}=\int_0^{I_1}M_{12}I_2\,dI_1'=M_{12}I_1I_2`} />
            <Formula
              latex={String.raw`U_B=\frac12L_2I_2^2+M_{12}I_1I_2+\frac12L_1I_1^2`}
            />
            <p>
              Енергията на крайното поле не може да зависи от реда, по който сме включили
              източниците. От <RichText text="$U_A=U_B$" /> следва:
            </p>
            <Formula latex={String.raw`\boxed{M_{12}=M_{21}\equiv M}`} />
            <p>
              Знакът зависи от избраните положителни посоки на двата тока и нормалите на
              намотките. В схемите това често се кодира с точки: токове, които влизат
              едновременно в означените с точка краища, се приемат с еднаква взаимна
              полярност. При обръщане на една намотка взаимният член сменя знак, но
              реципрочността на подписаните коефициенти остава.
            </p>
            <p>
              Същата енергия налага и важна граница върху големината на взаимната
              индуктивност. За всякакви възможни токове полевата енергия не може да е
              отрицателна:
            </p>
            <Formula
              latex={String.raw`U=\frac12L_1I_1^2+MI_1I_2+\frac12L_2I_2^2`}
            />
            <p>
              Допълваме квадрат по <RichText text="$I_2$" />:
            </p>
            <Formula
              latex={String.raw`U=\frac12L_2\left(I_2+\frac{M}{L_2}I_1\right)^2+\frac12\left(L_1-\frac{M^2}{L_2}\right)I_1^2`}
            />
            <p>
              Първият член е неотрицателен. За да не стане вторият отрицателен при някой{" "}
              <RichText text="$I_1$" />, трябва{" "}
              <RichText text="$L_1-M^2/L_2\ge0$" />. Следователно:
            </p>
            <Formula
              latex={String.raw`\boxed{|M|\le\sqrt{L_1L_2}},\qquad k\equiv\frac{|M|}{\sqrt{L_1L_2}},\quad0\le k\le1`}
            />
          </Derivation>

          <Wide>
            <div className="mt-6">
              <MutualInductanceLab />
            </div>
          </Wide>

          <Example number="5" title="Безконтактно зарядно за електрическа четка">
            <div className="mx-auto mb-5 max-w-xl">
                <WirelessChargerDiagram />
            </div>
            <p>
              На схемата жълтата намотка е <strong>първичната</strong>: тя се намира в
              зарядната основа и е свързана към променливия ток. Зелената е{" "}
              <strong>вторичната</strong>: тя е физически отделена и се намира в дръжката.
              Синият канал показва общата област на магнитното поле, не проводник между
              двете части.
            </p>
            <p>
              Първичната намотка се моделира като дълга намотка с дължина{" "}
              <RichText text="$\ell$" />, <RichText text="$N_{\mathrm B}$" /> навивки,
              площ <RichText text="$A$" /> и ток <RichText text="$I$" />. Намотката в
              дръжката има <RichText text="$N_{\mathrm H}$" /> навивки и обгръща почти
              цялото поле на основата.
            </p>
            <Formula
              latex={String.raw`B=\mu_0\frac{N_{\mathrm B}}{\ell}I`}
            />
            <Formula
              latex={String.raw`M=\frac{N_{\mathrm H}\Phi_{\mathrm{BH}}}{I}=\frac{N_{\mathrm H}BA}{I}=\mu_0\frac{N_{\mathrm B}N_{\mathrm H}}{\ell}A`}
            />
            <p>
              Променливият ток в основата поражда ЕДН в дръжката без метален контакт.
              Този резултат е идеализиран: приема, че почти целият поток на основата свързва
              дръжката. В реално устройство част от потока е разсеян и се въвежда коефициент
              на свързване <RichText text="$0\le k\le1$" />:
            </p>
            <Formula latex={String.raw`|M|=k\sqrt{L_1L_2}`} />
            <p>
              При еднакво избрани ориентации тук <RichText text="$M>0$" />. При
              раздалечаване или разцентроване <RichText text="$k$" /> намалява, затова
              зарядното предава по-малко мощност.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Разграничете <RichText text="$\Phi_{12}$" /> от целия поток на намотка 1:
                важна е само частта, която свързва намотка 2.
              </li>
              <li>
                Диагностичен въпрос: „може ли постоянен ток в първата намотка да поддържа
                постоянно ЕДН във втората?“ Не - нужен е{" "}
                <RichText text="$dI_1/dt\neq0$" />.
              </li>
              <li>
                При реципрочността поискайте обяснение защо енергията е функция на
                състоянието, а не на пътя.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="lc" n="§5" title="Кондензатор и индуктор: LC трептения">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Добавяме <strong>кондензатор</strong> с капацитет{" "}
              <RichText text="$C$" /> към индуктор с индуктивност{" "}
              <RichText text="$L$" />, без резистор между тях. Такава верига се нарича{" "}
              <RichText text="$LC$" /> верига. Зареденият кондензатор започва да се разрежда.
              Електричното поле отслабва, токът и магнитното поле нарастват. Когато зарядът
              стане нула, токът е максимален и цялата енергия е магнитна; индуктивността
              продължава тока и зарежда кондензатора с обратна полярност. Процесът се
              повтаря.
            </p>
            <p>
              В идеалния модел няма съпротивление и излъчване, затова общата енергия е
              постоянна. Това е електромагнитният аналог на маса върху пружина:{" "}
              <RichText text="$L\leftrightarrow m$" /> и{" "}
              <RichText text="$1/C\leftrightarrow k$" />.
            </p>
            <p>
              За да няма скрити знаци, избираме <RichText text="$q$" /> като подписания заряд
              на плочата, в която влиза положителният ток. Тогава по дефиниция{" "}
              <RichText text="$I=dq/dt$" />. При първоначалното разреждане токът може да е
              отрицателен спрямо тази стрелка; това не е отрицателна големина, а обратна
              посока.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <OscillationCircuitDiagram mode="lc" />
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="В идеален $LC$ контур токът е максимален. Какъв е зарядът на кондензатора и къде е енергията?"
              options={[
                {
                  text: "$q=0$ и цялата енергия е в магнитното поле на индуктора",
                  correct: true,
                },
                {
                  text: "$|q|=Q_{\max}$ и енергията е в кондензатора",
                  correct: false,
                },
                { text: "Енергията е загубена като топлина", correct: false },
              ]}
              explanation="$I=dq/dt$ е най-голям, когато зарядът минава през нула. Тогава $U_E=q^2/(2C)=0$ и $U_B=\tfrac12LI_{\max}^2$."
            />
          </div>

          <Derivation title="От енергийния баланс до диференциалното уравнение">
            <p>
              За кондензатора <RichText text="$V_C=q/C$" />. Малката работа за добавяне на
              заряд <RichText text="$dq$" /> е <RichText text="$dU_E=V_C\,dq$" />, затова:
            </p>
            <Formula latex={String.raw`U_E=\int_0^q\frac{q'}{C}\,dq'=\frac{q^2}{2C}`} />
            <p>
              При начален заряд <RichText text="$Q_{\max}$" /> и нулев ток общата енергия е
              <RichText text="$Q_{\max}^2/(2C)$" />. В произволен момент:
            </p>
            <Formula
              latex={String.raw`U=U_E+U_B=\frac{q^2}{2C}+\frac12LI^2=\frac{Q_{\max}^2}{2C}`}
            />
            <p>
              Диференцираме по времето:
            </p>
            <Formula
              latex={String.raw`\frac{dU}{dt}=\frac qC\frac{dq}{dt}+LI\frac{dI}{dt}=0`}
            />
            <p>
              С <RichText text="$I=dq/dt$" /> и{" "}
              <RichText text="$dI/dt=d^2q/dt^2$" /> получаваме:
            </p>
            <Formula
              latex={String.raw`I\left(\frac qC+L\frac{d^2q}{dt^2}\right)=0`}
            />
            <p>
              Между обръщателните точки <RichText text="$I\neq0$" />, а непрекъснатостта
              продължава уравнението и през тях. Същото следва директно от закона на
              Кирхоф:
            </p>
            <Formula
              latex={String.raw`V_C+V_L=0\quad\Longrightarrow\quad\frac qC+L\frac{dI}{dt}=0`}
            />
            <p>
              Понеже избраната стрелка определя <RichText text="$I=dq/dt$" />, имаме{" "}
              <RichText text="$dI/dt=d^2q/dt^2$" /> и затова:
            </p>
            <Formula
              latex={String.raw`L\frac{d^2q}{dt^2}+\frac qC=0\quad\Longrightarrow\quad\frac{d^2q}{dt^2}=-\frac{1}{LC}q`}
            />
            <p>
              Това е уравнението на хармоничен осцилатор.
            </p>
          </Derivation>

          <Derivation title="Защо се появяват комплексни числа и как накрая получаваме реален заряд">
            <p>
              Получихме уравнение от вида{" "}
              <RichText text="$q''=-\omega^2q$" />: втората производна винаги е насочена
              обратно на самата величина. Вече познаваме функции с точно това свойство -
              синусът и косинусът. Можем директно да ги проверим, но има систематичен
              алгебричен метод, който ще е полезен и при затихването в следващия раздел.
            </p>
            <Formula
              latex={String.raw`\frac{d^2}{dt^2}\cos\omega t=-\omega^2\cos\omega t,\qquad\frac{d^2}{dt^2}\sin\omega t=-\omega^2\sin\omega t`}
            />
            <p>
              Избираме пробна функция <RichText text="$q=e^{st}$" />, защото
              диференцирането не променя формата ѝ:
            </p>
            <Formula
              latex={String.raw`\frac{dq}{dt}=se^{st},\qquad\frac{d^2q}{dt^2}=s^2e^{st}`}
            />
            <p>
              Това не означава, че физическият заряд непременно е експонента или комплексно
              число. Пробната функция е временен математически инструмент. Замествайки я в
              диференциалното уравнение:
            </p>
            <Formula
              latex={String.raw`\left(s^2+\frac1{LC}\right)e^{st}=0`}
            />
            <p>
              Експонентата никога не е нула, затова трябва да е нула скобата:
            </p>
            <Formula
              latex={String.raw`s^2+\frac1{LC}=0\quad\Longrightarrow\quad s^2=-\frac1{LC}`}
            />
            <p>
              Тук комплексните числа не се появяват произволно. Няма реално число, чийто
              квадрат е отрицателен, затова използваме имагинерната единица{" "}
              <RichText text="$i$" />, дефинирана чрез{" "}
              <RichText text="$i^2=-1$" />. Ако въведем:
            </p>
            <Formula
              latex={String.raw`\omega\equiv\frac1{\sqrt{LC}}`}
            />
            <p>
              двата корена са <RichText text="$s=+i\omega$" /> и{" "}
              <RichText text="$s=-i\omega$" />. Съответните комплексни експоненти са
              свързани със синус и косинус чрез формулата на Ойлер:
            </p>
            <Formula
              latex={String.raw`e^{i\theta}=\cos\theta+i\sin\theta,\qquad e^{-i\theta}=\cos\theta-i\sin\theta`}
            />
            <p>
              Когато съберем комплексно решение и неговото комплексно спрегнато, имагинерните
              части се унищожават. Така получаваме общото <em>реално</em> решение:
            </p>
            <Formula
              latex={String.raw`q(t)=A\cos\omega t+B\sin\omega t`}
            />
            <p>
              Същата комбинация може да се опише с една амплитуда и една фаза:
            </p>
            <Formula
              latex={String.raw`q(t)=Q_{\max}\cos(\omega t+\phi),\qquad Q_{\max}=\sqrt{A^2+B^2}`}
            />
            <p>
              Това не е ново решение, а друг запис на същите две константи. По-точно{" "}
              <RichText text="$A=Q_{\max}\cos\phi$" /> и{" "}
              <RichText text="$B=-Q_{\max}\sin\phi$" />. Диференцирането дава тока:
            </p>
            <Formula
              latex={String.raw`I(t)=\frac{dq}{dt}=-\omega Q_{\max}\sin(\omega t+\phi)`}
            />
            <p>
              При <RichText text="$q(0)=Q_{\max}$" /> и{" "}
              <RichText text="$I(0)=dq/dt=0$" /> получаваме{" "}
              <RichText text="$A=Q_{\max}$" />, <RichText text="$B=0$" /> и{" "}
              <RichText text="$\phi=0$" />:
            </p>
            <Formula
              latex={String.raw`q(t)=Q_{\max}\cos\omega t`}
            />
            <Formula
              latex={String.raw`I(t)=-\omega Q_{\max}\sin\omega t=-I_{\max}\sin\omega t`}
            />
            <p>
              <strong>Проверка:</strong>
            </p>
            <Formula
              latex={String.raw`\frac{d^2q}{dt^2}=-\omega^2Q_{\max}\cos\omega t=-\frac1{LC}q`}
            />
            <p>
              Зарядът и токът са изместени по фаза с{" "}
              <RichText text="$90^\circ$" />.
            </p>
          </Derivation>

          <Derivation title="Енергията трепти между C и L, но сумата не">
            <p>
              Поставяме намерените <RichText text="$q(t)$" /> и{" "}
              <RichText text="$I(t)$" /> в двете енергии:
            </p>
            <Formula
              latex={String.raw`U_E=\frac{q^2}{2C}=\frac{Q_{\max}^2}{2C}\cos^2\omega t`}
            />
            <p>
              Понеже <RichText text="$I_{\max}=\omega Q_{\max}$" /> и{" "}
              <RichText text="$\omega^2=1/(LC)$" />, магнитната енергия става:
            </p>
            <Formula
              latex={String.raw`U_B=\frac12LI_{\max}^2\sin^2\omega t=\frac12L\omega^2Q_{\max}^2\sin^2\omega t=\frac{Q_{\max}^2}{2C}\sin^2\omega t`}
            />
            <p>
              Двете части се изменят, но сумата им не:
            </p>
            <Formula
              latex={String.raw`U=U_E+U_B=\frac{Q_{\max}^2}{2C}\left(\cos^2\omega t+\sin^2\omega t\right)=\frac{Q_{\max}^2}{2C}`}
            />
            <p>
              Комплексните числа вече не присъстват никъде във физическия резултат. Те
              бяха само кратък път до реалните синусоидални функции.
            </p>
          </Derivation>

          <Wide>
            <div className="mt-6">
              <LCEnergyLab />
            </div>
          </Wide>

          <Example number="6" title="Трептения в LC верига">
            <p>
              <strong>Дадено:</strong>{" "}
              <RichText text="$\mathcal E=10{,}0\,\mathrm V$" />,{" "}
              <RichText text="$L=4{,}00\,\mathrm{mH}$" /> и{" "}
              <RichText text="$C=10{,}0\,\mathrm{pF}$" />. Кондензаторът първо се зарежда
              от батерията, после се свързва само към индуктора.
            </p>
            <p>
              <strong>(A) Честота:</strong>
            </p>
            <Formula
              latex={String.raw`f=\frac{\omega}{2\pi}=\frac{1}{2\pi\sqrt{LC}}=\frac{1}{2\pi\sqrt{(4{,}00\times10^{-3})(10{,}0\times10^{-12})}}=7{,}96\times10^5\,\mathrm{Hz}`}
            />
            <p>
              <strong>(B) Максимален заряд и максимален ток:</strong>
            </p>
            <Formula
              latex={String.raw`Q_{\max}=C\mathcal E=(10{,}0\times10^{-12})(10{,}0)=1{,}00\times10^{-10}\,\mathrm C`}
            />
            <Formula
              latex={String.raw`I_{\max}=\omega Q_{\max}=2\pi fQ_{\max}=5{,}00\times10^{-4}\,\mathrm A`}
            />
            <p>
              <strong>Проверка.</strong> Честота от порядък{" "}
              <RichText text="$10^6\,\mathrm{Hz}$" /> е разумна, защото и{" "}
              <RichText text="$L$" />, и <RichText text="$C$" /> са много малки. От
              енергийния баланс също следва{" "}
              <RichText text="$Q_{\max}^2/(2C)=LI_{\max}^2/2$" />, което възпроизвежда
              същия <RichText text="$I_{\max}$" />.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Преди формулите попитайте къде е енергията в четирите четвърти на периода.
                Ако ученикът казва, че енергията „тече като ток“, върнете разграничението
                между енергия и заряд.
              </li>
              <li>
                Честа грешка е <RichText text="$I=q/t$" /> вместо{" "}
                <RichText text="$I=dq/dt$" />. Наклонът на графиката на заряда определя
                тока.
              </li>
              <li>
                Аналогията е структурна:{" "}
                <RichText text="$q\leftrightarrow x$" />,{" "}
                <RichText text="$I\leftrightarrow v$" />,{" "}
                <RichText text="$L\leftrightarrow m$" />,{" "}
                <RichText text="$1/C\leftrightarrow k$" />.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="rlc" n="§6" title="Резистор, индуктор и кондензатор: RLC затихване">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Към предишната <RichText text="$LC$" /> верига добавяме последователен
              резистор със съпротивление <RichText text="$R$" />. Вече имаме резистор{" "}
              <RichText text="$R$" />, индуктор <RichText text="$L$" /> и кондензатор{" "}
              <RichText text="$C$" />, затова използваме краткото име{" "}
              <RichText text="$RLC$" /> верига.
            </p>
            <p>
              Реалните проводници винаги имат поне малко съпротивление. То превръща част от
              полевата енергия във вътрешна енергия с мощност{" "}
              <RichText text="$I^2R$" />. Затова трептенията намаляват, а при достатъчно голямо{" "}
              <RichText text="$R$" /> изобщо не преминават през противоположна полярност.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <OscillationCircuitDiagram mode="rlc" />
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Увеличаваме $R$ в последователен $RLC$ контур. Как се променя връщането към равновесие?"
              options={[
                {
                  text: "Трептенията затихват по-бързо; над критично $R$ изчезват",
                  correct: true,
                },
                {
                  text: "Честотата расте и трептенията се усилват",
                  correct: false,
                },
                {
                  text: "Нищо не се променя, защото $R$ не съхранява енергия",
                  correct: false,
                },
              ]}
              explanation="Резисторът не съхранява, а необратимо преобразува енергията с мощност $I^2R$. При $R_c=2\sqrt{L/C}$ системата е критично затихваща; над тази стойност няма осцилации."
            />
          </div>

          <Derivation title="От енергийния баланс до уравнението на затихването">
            <p>
              Понеже енергията на полетата намалява със скоростта, с която резисторът я
              превръща в топлина:
            </p>
            <Formula latex={String.raw`\frac{dU}{dt}=-I^2R`} />
            <p>
              С <RichText text="$U=q^2/(2C)+LI^2/2$" />:
            </p>
            <Formula
              latex={String.raw`\frac qC\frac{dq}{dt}+LI\frac{dI}{dt}=-I^2R`}
            />
            <p>
              Замествайки <RichText text="$I=dq/dt$" /> и делейки на{" "}
              <RichText text="$I$" /> (с продължение по непрекъснатост през точките{" "}
              <RichText text="$I=0$" />):
            </p>
            <Formula
              latex={String.raw`L\frac{d^2q}{dt^2}+R\frac{dq}{dt}+\frac qC=0`}
            />
            <p>
              Механичният аналог е:
            </p>
            <Formula
              latex={String.raw`m\frac{d^2x}{dt^2}+b\frac{dx}{dt}+kx=0`}
            />
          </Derivation>

          <div className="my-6 overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard-sm">
            <table className="w-full min-w-[600px] border-collapse text-left text-[14.5px]">
              <caption className="border-b-[1.5px] border-rule px-4 py-3 text-left font-serif text-[18px] font-bold text-ink">
                Таблица 1 · Аналогия между RLC верига и затихващ осцилатор
              </caption>
              <thead>
                <tr className="border-b-[1.5px] border-rule bg-hl">
                  <th className="px-4 py-2 font-bold">RLC контур</th>
                  <th className="px-4 py-2 font-bold">Механична система</th>
                </tr>
              </thead>
              <tbody className="[&_tr:not(:last-child)]:border-b [&_tr:not(:last-child)]:border-rule">
                <tr>
                  <td className="px-4 py-2"><RichText text="$q$ - заряд" /></td>
                  <td className="px-4 py-2"><RichText text="$x$ - положение" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$I=dq/dt$ - ток" /></td>
                  <td className="px-4 py-2"><RichText text="$v=dx/dt$ - скорост" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$\Delta V$ - потенциална разлика" /></td>
                  <td className="px-4 py-2"><RichText text="$F_x$ - сила" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$L$ - индуктивност" /></td>
                  <td className="px-4 py-2"><RichText text="$m$ - маса" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$R$ - съпротивление" /></td>
                  <td className="px-4 py-2"><RichText text="$b$ - вискозно триене" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$1/C$" /></td>
                  <td className="px-4 py-2"><RichText text="$k$ - пружинна константа" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$\tfrac12LI^2$" /></td>
                  <td className="px-4 py-2"><RichText text="$\tfrac12mv^2$" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$q^2/(2C)$" /></td>
                  <td className="px-4 py-2"><RichText text="$kx^2/2$" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$I^2R$" /></td>
                  <td className="px-4 py-2"><RichText text="$bv^2$" /></td>
                </tr>
                <tr>
                  <td className="px-4 py-2"><RichText text="$dI/dt=d^2q/dt^2$" /></td>
                  <td className="px-4 py-2"><RichText text="$a=d^2x/dt^2$" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <Derivation title="Характеристично уравнение и трите режима">
            <p>
              Както при идеалния <RichText text="$LC$" /> контур, пробваме{" "}
              <RichText text="$q=e^{st}$" />, защото производните отново са кратни на същата
              функция. След заместване в диференциалното уравнение по-горе:
            </p>
            <Formula
              latex={String.raw`Ls^2+Rs+\frac1C=0`}
            />
            <p>
              Въвеждаме:
            </p>
            <Formula
              latex={String.raw`\alpha=\frac{R}{2L},\qquad\omega_0=\frac1{\sqrt{LC}},\qquad s=-\alpha\pm\sqrt{\alpha^2-\omega_0^2}`}
            />
            <p>
              <strong>Подкритично затихване</strong>,{" "}
              <RichText text="$R<R_c$" />: корените са комплексни,
              <RichText text="$s=-\alpha\pm i\omega_d$" />, където:
            </p>
            <Formula
              latex={String.raw`q(t)=e^{-\alpha t}\left(A\cos\omega_dt+B\sin\omega_dt\right)`}
            />
            <p>
              Константите <RichText text="$A$" /> и <RichText text="$B$" /> могат
              еквивалентно да се запишат чрез амплитуда и фаза:
            </p>
            <Formula
              latex={String.raw`q(t)=Q_{\max}e^{-Rt/(2L)}\cos(\omega_dt+\phi)`}
            />
            <p>
              Ъгловата честота на затихващото трептене е:
            </p>
            <Formula
              latex={String.raw`\omega_d=\sqrt{\omega_0^2-\alpha^2}=\left[\frac1{LC}-\left(\frac{R}{2L}\right)^2\right]^{1/2}`}
            />
            <p>
              Фазата <RichText text="$\phi$" /> се определя от <em>двете</em> начални
              условия. Например за{" "}
              <RichText text="$q(0)=Q_0$" /> и{" "}
              <RichText text="$I(0)=0$" /> точният реален запис е:
            </p>
            <Formula
              latex={String.raw`q(t)=Q_0e^{-\alpha t}\left(\cos\omega_dt+\frac{\alpha}{\omega_d}\sin\omega_dt\right)`}
            />
            <p>
              Това е важно: ако просто сложим <RichText text="$\phi=0$" /> в
              амплитудно-фазовия запис, производната на експоненциалната обвивка прави{" "}
              <RichText text="$I(0)\ne0$" />. Началният нулев ток изисква и синусния член
              по-горе.
            </p>
            <p>
              <strong>Критично затихване</strong>,{" "}
              <RichText text="$R=R_c$" />: двата корена съвпадат,
              <RichText text="$s=-\omega_0$" />, и:
            </p>
            <Formula
              latex={String.raw`q(t)=(A+Bt)e^{-\omega_0t}`}
            />
            <p>
              За същите начални условия <RichText text="$q(0)=Q_0$" /> и{" "}
              <RichText text="$I(0)=0$" /> получаваме{" "}
              <RichText text="$A=Q_0$" /> и <RichText text="$B=\omega_0Q_0$" />:
            </p>
            <Formula latex={String.raw`q(t)=Q_0(1+\omega_0t)e^{-\omega_0t}`} />
            <p>
              <strong>Свръхкритично затихване</strong>,{" "}
              <RichText text="$R>R_c$" />: двата корена са реални и отрицателни:
            </p>
            <Formula
              latex={String.raw`q(t)=Ae^{(-\alpha+\sqrt{\alpha^2-\omega_0^2})t}+Be^{(-\alpha-\sqrt{\alpha^2-\omega_0^2})t}`}
            />
            <details className="rounded-lg border border-rule bg-hl/40 px-4 py-3">
              <summary className="cursor-pointer font-semibold text-ink">
                Пълен извод на коефициентите при свръхкритично затихване
              </summary>
              <div className="mt-3 space-y-3">
                <p>
                  Ако означим <RichText text="$\delta=\sqrt{\alpha^2-\omega_0^2}$" /> и
                  наложим <RichText text="$q(0)=Q_0$" />,{" "}
                  <RichText text="$I(0)=0$" />, получаваме две линейни уравнения за{" "}
                  <RichText text="$A$" /> и <RichText text="$B$" />. Решението им е:
                </p>
                <Formula
                  latex={String.raw`A=\frac{\alpha+\delta}{2\delta}Q_0,\qquad B=-\frac{\alpha-\delta}{2\delta}Q_0`}
                />
              </div>
            </details>
            <p>
              Границата се получава от{" "}
              <RichText text="$\alpha=\omega_0$" />:
            </p>
            <Formula
              latex={String.raw`R_c=2\sqrt{\frac LC}=\sqrt{\frac{4L}{C}}`}
            />
            <p>
              <strong>Проверка чрез заместване:</strong> за всеки член{" "}
              <RichText text="$q=e^{st}$" /> лявата страна на диференциалното уравнение става{" "}
              <RichText text="$(Ls^2+Rs+1/C)e^{st}=0$" />, защото{" "}
              <RichText text="$s$" /> е корен на характеристичното уравнение. Линейната
              комбинация също е решение.
            </p>
          </Derivation>

          <Callout>
            <strong>Три полезни проверки.</strong> При <RichText text="$R\to0$" /> имаме{" "}
            <RichText text="$\alpha\to0$" /> и уравнението точно се връща към идеалния{" "}
            <RichText text="$LC$" /> осцилатор. При{" "}
            <RichText text="$R=R_c$" /> системата се връща към равновесие най-бързо без
            пресичане. А много голямо <RichText text="$R$" /> не означава безкрайно бързо
            установяване: бавният корен става приблизително{" "}
            <RichText text="$s_{\mathrm{slow}}\approx-1/(RC)$" />, така че прекалено
            голямото съпротивление всъщност забавя последната част на процеса.
          </Callout>

          <Wide>
            <div className="mt-6">
              <RLCDampingLab />
            </div>
          </Wide>

          <Example number="7" title="Кой режим ще наблюдаваме?">
            <p>
              <strong>Дадено:</strong> <RichText text="$L=40{,}0\,\mathrm{mH}$" />,{" "}
              <RichText text="$C=100\,\mu\mathrm F$" /> и{" "}
              <RichText text="$R=14{,}0\,\Omega$" />. Първо намираме границата между
              режимите:
            </p>
            <Formula
              latex={String.raw`R_c=2\sqrt{\frac LC}=2\sqrt{\frac{40{,}0\times10^{-3}}{100\times10^{-6}}}=40{,}0\,\Omega`}
            />
            <p>
              Понеже <RichText text="$R<R_c$" />, контурът е подкритично затихващ. Неговите
              характерни честоти са:
            </p>
            <Formula
              latex={String.raw`\omega_0=\frac1{\sqrt{LC}}=500\,\mathrm{rad/s},\qquad\alpha=\frac{R}{2L}=175\,\mathrm{s^{-1}}`}
            />
            <Formula
              latex={String.raw`\omega_d=\sqrt{\omega_0^2-\alpha^2}=468\,\mathrm{rad/s}`}
            />
            <p>
              <strong>Тълкуване.</strong> Зарядът сменя знак, но върховете му спадат с
              обвивка <RichText text="$e^{-175t}$" />. Ако увеличим{" "}
              <RichText text="$R$" /> до <RichText text="$40\,\Omega$" />, ще достигнем
              най-бързото връщане без осцилации.
            </p>
          </Example>

          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Не отъждествявайте „по-голямо затихване“ с „по-бързо във всеки смисъл“:
                критичното затихване е най-бързото връщане без пресичане; при много голямо{" "}
                <RichText text="$R$" /> бавният експоненциален режим доминира.
              </li>
              <li>
                Диагностичен въпрос: „кое в механичния аналог играе ролята на{" "}
                <RichText text="$R$" />?“ - коефициентът на вискозно триене, не
                пружинната константа.
              </li>
              <li>
                Честа грешка е да се използва{" "}
                <RichText text="$1/\sqrt{LC}$" /> като реална честота при всяко{" "}
                <RichText text="$R$" />. При подкритично затихване честотата е{" "}
                <RichText text="$\omega_d<\omega_0$" />; при критично и свръхкритично
                затихване осцилация няма.
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§7" title="Обобщение">
          <Derivation title="Една причинна верига зад целия урок">
            <Formula
              latex={String.raw`I\longrightarrow \vec B\longrightarrow \Phi_B\longrightarrow \lambda=LI\longrightarrow \mathcal E_L=-L\frac{dI}{dt}`}
            />
            <p>
              Токът създава поле; геометрията определя колко поток се свързва с веригата;
              промяната на потокосцеплението поражда обратно ЕДН. Оттук следват и
              непрекъснатостта на тока, и магнитната енергия, и възможността за
              електромагнитни трептения.
            </p>
          </Derivation>

          <div className="mb-6 rounded-[10px] border-[1.5px] border-ink bg-hl px-5 py-4">
            <h3 className="font-serif text-[20px] font-bold text-ink">
              Как да изберете правилния модел
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Ако се пита за поток, геометрия или обратно ЕДН на една намотка - започнете
                от <RichText text="$L=\lambda/I$" /> и{" "}
                <RichText text="$\mathcal E_L=-L\,dI/dt$" />.
              </li>
              <li>
                Ако има батерия, резистор и индуктор - използвайте{" "}
                <RichText text="$RL$" /> модел и първо определете дали токът нараства или
                намалява.
              </li>
              <li>
                Ако енергията се обменя между кондензатор и индуктор без загуби - това е
                идеален <RichText text="$LC$" /> осцилатор.
              </li>
              <li>
                Ако присъства и съпротивление - сравнете{" "}
                <RichText text="$R$" /> с <RichText text="$R_c=2\sqrt{L/C}$" />, преди да
                избирате формата на решението.
              </li>
            </ul>
          </div>

          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                <strong>Самоиндукция:</strong>{" "}
                <RichText text="$\mathcal E_L=-L\,dI/dt$" />. Индукторът се
                противопоставя на промяната на тока, не на постоянния ток.
              </li>
              <li>
                <strong>Геометрична мярка:</strong>{" "}
                <RichText text="$L=\lambda/I$" />; за дълга намотка без магнитна сърцевина{" "}
                <RichText text="$L=\mu_0N^2A/\ell=\mu_0n^2V$" />.
              </li>
              <li>
                <strong>RL отговор:</strong> при включване{" "}
                <RichText text="$I=(\mathcal E/R)(1-e^{-t/\tau})$" />, при изключване{" "}
                <RichText text="$I=I_0e^{-t/\tau}$" />, с{" "}
                <RichText text="$\tau=L/R$" />.
              </li>
              <li>
                <strong>Енергия:</strong> <RichText text="$U_B=LI^2/2$" /> и във вакуум{" "}
                <RichText text="$u_B=B^2/(2\mu_0)$" />.
              </li>
              <li>
                <strong>Взаимна индукция:</strong>{" "}
                <RichText text="$\mathcal E_2=-M\,dI_1/dt$" /> и по реципрочност{" "}
                <RichText text="$M_{12}=M_{21}$" />.
              </li>
              <li>
                <strong>LC трептения:</strong>{" "}
                <RichText text="$q''+q/(LC)=0$" />,{" "}
                <RichText text="$\omega_0=1/\sqrt{LC}$" />; енергията се прехвърля между
                електрично и магнитно поле.
              </li>
              <li>
                <strong>RLC затихване:</strong>{" "}
                <RichText text="$Lq''+Rq'+q/C=0$" />. При{" "}
                <RichText text="$R<R_c$" /> има затихващи трептения; при{" "}
                <RichText text="$R=R_c$" /> връщането е критично; при{" "}
                <RichText text="$R>R_c$" /> е свръхкритично, с{" "}
                <RichText text="$R_c=2\sqrt{L/C}$" />.
              </li>
            </ul>
          </div>

          <p className="mt-5 text-[17px] leading-relaxed text-ink/90">
            Главата започна от закона на Фарадей и стигна до собствената динамика на
            електромагнитните вериги: полето пази енергия, индуктивността забавя промяната,
            а комбинацията с капацитет превръща тази „инерция“ в трептене.
          </p>

          <Callout>
            <strong>Последна проверка преди решение.</strong> Запитайте се: каква е избраната
            положителна посока; коя величина е непрекъсната; къде е енергията; какво става
            при <RichText text="$t=0$" /> и при <RichText text="$t\to\infty$" />; и имат ли
            крайният резултат и единиците физически смисъл.
          </Callout>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href="/physics/magnetizm/faraday"
              className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3 shadow-hard-sm transition-transform hover:-translate-y-0.5"
            >
              <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                Предишна глава
              </span>
              <span className="mt-1 block font-semibold text-minus">
                Законът на Фарадей
              </span>
            </Link>
            <div className="rounded-[10px] border-[1.5px] border-rule bg-paper px-4 py-3">
              <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-muted">
                Следваща глава
              </span>
              <span className="mt-1 block font-semibold text-ink">
                Променливотокови вериги и резонанс
              </span>
              <span className="mt-1 block text-[13px] text-muted">предстои</span>
            </div>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
