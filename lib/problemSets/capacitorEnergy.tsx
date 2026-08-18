import type { ProblemSetProblemData } from "@/components/problem-sets/ProblemSetProblem";
import {
  BreakdownOptimumLab,
  ChargeSharingLab,
  ChargingWorkLab,
  CoaxialLimitLab,
  EnergyEnclosedLab,
  PlateSeparationLab,
} from "@/components/interactives/CapacitorProblemLabs";

/**
 * Задачи за плосък и цилиндричен кондензатор с пълни решения.
 *
 * Всяко решение върви по същия ред както условието (a), (b), (c)…, за да може
 * ученикът да разгъне решението и да сравни своята стъпка със същата стъпка
 * тук. Числата са проверени независимо: енергийните баланси в задача 4 и
 * задача 5 се затварят точно, без закръгляне.
 */
export const capacitorEnergyProblems: ProblemSetProblemData[] = [
  /* ------------------------------------------------------------------ 1 */
  {
    number: 1,
    title: "Каква енергия е запасена в един кондензатор?",
    tags: ["Енергия", "Извеждане", "Задължителна"],
    statement: [
      {
        kind: "paragraph",
        text: "Тази задача извежда израза за енергията, който ще ползвате в останалите. Не тръгвайте от готова формула, изведете всяка стъпка.",
      },
      {
        kind: "paragraph",
        text: String.raw`**(a)** Нека в еднородното поле между плочите има тънка заредена нишка с текуща дължина $l$ и линейна плътност на заряда $\lambda$. Започнете от $\mathrm{d}A=F\,\mathrm{d}l$ и като използвате $F=qE$ и $E=\Delta V/l$, изведете стъпка по стъпка, че $\mathrm{d}A=\Delta V\,\mathrm{d}q$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Защо тогава пълната работа за зареждане до заряд $Q$ *не* е просто $Q\,\Delta V$? Отговорете с едно изречение.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(c)** Изразете $\Delta V$ чрез моментния заряд $q$ върху плочите и капацитета $C$. Начертайте графика на $\Delta V$ срещу $q$ при зареждане от $0$ до $Q$. Каква линия се получава?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** Пълната работа е сумата от всички $\mathrm{d}A=\Delta V\,\mathrm{d}q$, тоест *лицето под графиката*. Пресметнете това лице геометрично и получете $A=\tfrac12 Q\,\Delta V$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** Проверете резултата по втори начин: тъй като $\Delta V$ расте линейно от нула до крайната си стойност, средното напрежение по време на зареждането е $\langle\Delta V\rangle=\tfrac12\Delta V$. Съгласува ли се това с $(d)$?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(f)** Като използвате $Q=C\,\Delta V$, запишете още два еквивалентни израза за $A$: единия само чрез $C$ и $\Delta V$, другия само чрез $Q$ и $C$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(g)** *Обемна плътност на енергията.* За плосък кондензатор заместете $C=\varepsilon_0S/d$ и $\Delta V=Ed$ в израза от $(f)$ и покажете, че $A=\tfrac12\varepsilon_0E^2\cdot(Sd)$, откъдето $u=\tfrac12\varepsilon_0E^2$.`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`В $(a)$ зарядът на нишката е $q=\lambda l$, а полето е $E=\Delta V/l$. Запишете произведението $qE$ и вижте кое се съкращава.`,
      },
      {
        kind: "paragraph",
        text: String.raw`В $(d)$ използвайте същия похват, с който се намира работата на еластична сила от графиката $F(x)$: лицето на триъгълник.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "(a) Работата за пренасяне на елемент заряд" },
      {
        kind: "paragraph",
        text: String.raw`Нишката носи заряд $q=\lambda l$, а полето между плочите е $E=\Delta V/l$. Заместваме и двете в $\mathrm{d}A=F\,\mathrm{d}l$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\mathrm{d}A=F\,\mathrm{d}l=qE\,\mathrm{d}l=(\lambda l)\cdot\frac{\Delta V}{l}\,\mathrm{d}l=\Delta V\,(\lambda\,\mathrm{d}l)`,
      },
      {
        kind: "paragraph",
        text: String.raw`Дължината $l$ се съкращава. Понеже $\mathrm{d}q=\lambda\,\mathrm{d}l$, остава`,
      },
      { kind: "formula", latex: String.raw`\boxed{\mathrm{d}A=\Delta V\,\mathrm{d}q}` },
      {
        kind: "paragraph",
        text: String.raw`Съкращаването на $l$ е същината: резултатът не помни геометрията на нишката. Работата за пренасяне на елемент заряд през разлика на потенциалите е винаги $\Delta V\,\mathrm{d}q$.`,
      },

      { kind: "subheading", text: "(b) Защо не $Q\\,\\Delta V$" },
      {
        kind: "paragraph",
        text: String.raw`Защото $\Delta V$ **не е постоянно** по време на зареждането: то расте заедно с натрупания заряд от нула до крайната си стойност, така че първите порции заряд се пренасят почти безплатно, а последните са най-скъпи.`,
      },

      { kind: "subheading", text: "(c) Графиката е права" },
      {
        kind: "paragraph",
        text: String.raw`Във всеки момент от зареждането важи определението на капацитета, приложено към моментните стойности:`,
      },
      { kind: "formula", latex: String.raw`\Delta V(q)=\frac{q}{C}` },
      {
        kind: "paragraph",
        text: String.raw`Понеже $C$ е константа (зависи само от геометрията), това е **права през началото** с наклон $1/C$.`,
      },
      {
        kind: "figure",
        node: <ChargingWorkLab />,
        caption:
          "Плъзнете заряда: зеленото лице е извършената работа, пунктираният правоъгълник е наивното $q\\,\\Delta V$. Отношението им е точно $1/2$ при всяко положение.",
      },

      { kind: "subheading", text: "(d) Лицето под правата" },
      {
        kind: "paragraph",
        text: String.raw`Сумата от всички $\mathrm{d}A=\Delta V\,\mathrm{d}q$ е лицето под графиката от $0$ до $Q$. Това е правоъгълен триъгълник с катети $Q$ по хоризонтала и $Q/C=\Delta V$ по вертикала:`,
      },
      {
        kind: "formula",
        latex: String.raw`A=\frac12\cdot Q\cdot\frac{Q}{C}=\boxed{\tfrac12\,Q\,\Delta V}`,
      },

      { kind: "subheading", text: "(e) Проверка чрез средното напрежение" },
      {
        kind: "paragraph",
        text: String.raw`За линейно нарастваща величина средната стойност е средното аритметично на краищата: $\langle\Delta V\rangle=\tfrac12(0+\Delta V)=\tfrac12\Delta V$. Понеже пренесеният заряд е $Q$,`,
      },
      { kind: "formula", latex: String.raw`A=Q\,\langle\Delta V\rangle=\tfrac12\,Q\,\Delta V` },
      {
        kind: "paragraph",
        text: "Съвпада с $(d)$. Двата подхода са един и същ: средната височина по ширината дава лицето.",
      },

      { kind: "subheading", text: "(f) Трите еквивалентни записа" },
      {
        kind: "paragraph",
        text: String.raw`Заместваме $Q=C\,\Delta V$ веднъж за $Q$ и веднъж за $\Delta V$:`,
      },
      {
        kind: "formula",
        latex: String.raw`A=\tfrac12\,Q\,\Delta V=\tfrac12\,C\,(\Delta V)^2=\frac{Q^2}{2C}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Изборът не е козметичен: при **изключен** кондензатор постоянен е $Q$, затова е удобен $Q^2/(2C)$; при **свързан** към източник постоянно е $\Delta V$, затова е удобен $\tfrac12C(\Delta V)^2$. Задача 4 живее точно от тази разлика.`,
      },

      { kind: "subheading", text: "(g) Енергията на единица обем" },
      {
        kind: "paragraph",
        text: String.raw`За плосък кондензатор $C=\varepsilon_0S/d$ и $\Delta V=Ed$. Заместваме в $A=\tfrac12C(\Delta V)^2$:`,
      },
      {
        kind: "formula",
        latex: String.raw`A=\frac12\cdot\frac{\varepsilon_0S}{d}\cdot(Ed)^2=\frac12\,\varepsilon_0E^2\cdot\frac{S d^2}{d}=\tfrac12\varepsilon_0E^2\cdot(Sd)`,
      },
      {
        kind: "paragraph",
        text: String.raw`Множителят $Sd$ е точно обемът между плочите, значи енергията на единица обем е`,
      },
      { kind: "formula", latex: String.raw`\boxed{u=\tfrac12\varepsilon_0E^2}` },
      {
        kind: "paragraph",
        text: String.raw`Изразът вече не съдържа нито $S$, нито $d$, нито $C$: остава само полето. Това е първият знак, че енергията е локална характеристика на полето, а не свойство на плочите, и точно затова ще можем да я разпределяме по слоеве в задача 6.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 2 */
  {
    number: 2,
    title: "Кога коаксиалният кондензатор става плосък?",
    tags: ["Ред на Тейлър", "Приближения", "Задължителна"],
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Цилиндричен кондензатор с вътрешен радиус $a=5{,}0\,\mathrm{mm}$ и дължина $L=1{,}0\,\mathrm{m}$. Външният радиус $b$ ще променяме. Ако $d=b-a\ll a$, коаксиалният кондензатор трябва да се държи като плосък, „навит на руло“. Ще намерим систематичното приближение чрез ред на Тейлър, вместо да избираме площ по догадка.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(a)** Поставете $b=a+d$ и въведете малкия безразмерен параметър $x=d/a$. Покажете, че точната формула става $C=\dfrac{2\pi\varepsilon_0L}{\ln(1+x)}$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Разложете $\ln(1+x)=x-\dfrac{x^2}{2}+\dfrac{x^3}{3}+O(x^4)$ и обърнете реда до член от ред $x^2$. Докажете, че $C=\dfrac{2\pi\varepsilon_0aL}{d}\left(1+\dfrac{x}{2}-\dfrac{x^2}{12}+O(x^3)\right)$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(c)** Задръжте първо само водещия член, а после и линейната поправка. Кои плоски капацитети се получават: $C_{\text{вътр}}=\dfrac{\varepsilon_0(2\pi aL)}{d}$ и $C_{\text{ср}}=\dfrac{\varepsilon_0(2\pi\bar rL)}{d}$ с $\bar r=a+\dfrac d2$? Обяснете защо средният радиус възниква естествено.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** От реда намерете първите ненулеви членове на относителните грешки $\dfrac{C_{\text{вътр}}-C}{C}$ и $\dfrac{C_{\text{ср}}-C}{C}$. Покажете, че първата е от ред $x$, а втората от ред $x^2$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** За $x=0{,}1$ и $x=0{,}01$ сравнете предсказанията на реда с точните грешки. При десетократно намаляване на $d/a$ колко пъти намалява всяка от двете грешки?`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`За обръщането ползвайте $(1+y)^{-1}=1-y+y^2+O(y^3)$ с $y=-\dfrac x2+\dfrac{x^2}{3}$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Работете символно с $x=d/a$ до самия край. За числената проверка използвайте точната формула $C=2\pi\varepsilon_0L/\ln(1+x)$ и пресмятайте грешките с незакръглените стойности.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "(a) Точната формула чрез малкия параметър" },
      {
        kind: "paragraph",
        text: String.raw`Точният капацитет на коаксиален кондензатор е $C=2\pi\varepsilon_0L/\ln(b/a)$. При $b=a+d$`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac ba=\frac{a+d}{a}=1+\frac da=1+x\quad\Longrightarrow\quad C=\frac{2\pi\varepsilon_0L}{\ln(1+x)}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Целият проблем вече зависи от **едно** безразмерно число $x$. Границата „плосък кондензатор“ е $x\to0$.`,
      },

      { kind: "subheading", text: "(b) Обръщане на реда" },
      { kind: "paragraph", text: String.raw`Изнасяме $x$ пред скобата в разложението:` },
      {
        kind: "formula",
        latex: String.raw`\ln(1+x)=x\left(1-\frac x2+\frac{x^2}{3}+O(x^3)\right)`,
      },
      {
        kind: "paragraph",
        text: String.raw`Тогава с $y=-\dfrac x2+\dfrac{x^2}{3}$ и $(1+y)^{-1}=1-y+y^2+O(y^3)$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
\frac{1}{\ln(1+x)}&=\frac1x\left(1+y\right)^{-1}=\frac1x\left(1-y+y^2+O(y^3)\right)\\[2pt]
&=\frac1x\left(1+\frac x2-\frac{x^2}{3}+\frac{x^2}{4}+O(x^3)\right)=\frac1x\left(1+\frac x2-\frac{x^2}{12}+O(x^3)\right)
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Понеже $x=d/a$, множителят пред скобата е $\dfrac{2\pi\varepsilon_0L}{x}=\dfrac{2\pi\varepsilon_0aL}{d}$, откъдето`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{C=\frac{2\pi\varepsilon_0aL}{d}\left(1+\frac x2-\frac{x^2}{12}+O(x^3)\right)}`,
      },

      { kind: "subheading", text: "(c) Двете плоски приближения" },
      {
        kind: "paragraph",
        text: String.raw`**Само водещият член.** $C\approx\dfrac{2\pi\varepsilon_0aL}{d}=\dfrac{\varepsilon_0(2\pi aL)}{d}$. Това е плосък кондензатор с площ $2\pi aL$, тоест площта на **вътрешната** повърхност.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**С линейната поправка.** Внасяме множителя в скобите обратно:`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac{2\pi\varepsilon_0aL}{d}\left(1+\frac{d}{2a}\right)=\frac{2\pi\varepsilon_0L}{d}\left(a+\frac d2\right)=\frac{\varepsilon_0\left(2\pi\bar rL\right)}{d},\qquad \bar r=a+\frac d2`,
      },
      {
        kind: "paragraph",
        text: String.raw`Средният радиус **не е избран по догадка**: той е точно това, което линейният член на реда произвежда. Смисълът е геометричен - площта на цилиндъра расте линейно с радиуса, затова „средната“ площ между вътрешната и външната се пада на средния радиус.`,
      },

      { kind: "subheading", text: "(d) Двете грешки" },
      {
        kind: "paragraph",
        text: String.raw`Означаваме $S=1+\dfrac x2-\dfrac{x^2}{12}$, така че $C=\dfrac{2\pi\varepsilon_0aL}{d}\,S$. Тогава`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac{C_{\text{вътр}}}{C}=\frac1S=1-\frac x2+\frac{x^2}{3}+O(x^3)\quad\Longrightarrow\quad \frac{C_{\text{вътр}}-C}{C}=-\frac x2+\frac{x^2}{3}+O(x^3)`,
      },
      {
        kind: "paragraph",
        text: String.raw`Първият ненулев член е $-x/2$: грешката е **от ред $x$** и приближението подценява капацитета. За второто отношение:`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac{C_{\text{ср}}}{C}=\frac{1+\dfrac x2}{S}=1+\frac{\dfrac{x^2}{12}}{S}=1+\frac{x^2}{12}+O(x^3)\quad\Longrightarrow\quad \frac{C_{\text{ср}}-C}{C}=+\frac{x^2}{12}+O(x^3)`,
      },
      {
        kind: "paragraph",
        text: String.raw`Тук линейният член се съкращава изцяло и остава **ред $x^2$**. Точно това прави средният радиус качествено по-добър избор, а не просто „малко по-точен“.`,
      },
      {
        kind: "figure",
        node: <CoaxialLimitLab />,
        caption:
          "Плътните криви са точните грешки, пунктирите са предсказанията на реда. Оранжевата тръгва под наклон от началото, зелената е допирателна към нулата: така изглежда разликата между ред $x$ и ред $x^2$.",
      },

      { kind: "subheading", text: "(e) Числената проверка" },
      {
        kind: "paragraph",
        text: String.raw`За $x=0{,}1$: точните грешки са $-4{,}690\%$ и $+0{,}0757\%$, а редът предсказва $-4{,}667\%$ и $+0{,}0833\%$. За $x=0{,}01$: точните са $-0{,}4967\%$ и $+0{,}00083\%$, а редът дава $-0{,}4967\%$ и $+0{,}00083\%$, тоест съвпадение до всички показани цифри.`,
      },
      {
        kind: "list",
        items: [
          String.raw`Първата грешка пада $9{,}44$ пъти, тоест **около $10$ пъти**, както изисква зависимост от ред $x$.`,
          String.raw`Втората пада $91{,}7$ пъти, тоест **около $100$ пъти**, както изисква зависимост от ред $x^2$.`,
        ],
      },
      {
        kind: "paragraph",
        text: String.raw`Отклоненията от точно $10$ и точно $100$ идват от следващите членове на реда и сами намаляват при по-малко $x$. Практическият извод: при $d/a=1\%$ приближението със средния радиус греши с по-малко от една стохилядна, тоест далеч под всяка производствена точност.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 3 */
  {
    number: 3,
    title: "По-дебелата изолация винаги ли пази от пробив?",
    tags: ["Оптимизация", "Пробив", "Задължителна"],
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Проектирате въздушен коаксиален кабел. Външният му радиус е ограничен от корпуса: $b=10\,\mathrm{mm}$. Трябва да изберете радиуса $a$ на вътрешното жило така, че кабелът да издържа възможно най-високо напрежение. Пробивното поле на въздуха е $E_{\text{пр}}=3{,}0\,\mathrm{MV/m}$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Колега предлага: „Нека направим жилото възможно най-тънко, така въздушната междина $b-a$ ще е най-дебела.“ Преди да смятате, запишете дали очаквате това решение да повиши или да понижи пробивното напрежение.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(a)** Като използвате $\Delta V=\int_a^b E(r)\,\mathrm{d}r$, покажете, че $E(r)=\dfrac{\Delta V}{r\ln(b/a)}$. Къде полето е най-силно?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Проверете предложението на колегата при $\Delta V=10\,\mathrm{kV}$. Сравнете максималното поле за $a=1{,}0\,\mathrm{mm}$ и $a=0{,}5\,\mathrm{mm}$. Междината се увеличава, какво става с полето?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(c)** Покажете, че пробивното напрежение е $\Delta V_{\text{пр}}=E_{\text{пр}}\,a\ln\dfrac ba$. После, без таблица и пробване на стойности, намерете радиуса $a$, при който $\Delta V_{\text{пр}}$ е максимално. Проверете, че наистина е максимум.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** Пресметнете оптималния радиус и максималното пробивно напрежение. Би ли издържал кабел с $a=1{,}0\,\mathrm{mm}$ на $10\,\mathrm{kV}$?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** Производството никога не е идеално. С колко процента пада пробивното напрежение, ако реалният радиус се отклонява с $\pm20\%$ от оптималния? Кое е по-изненадващо: съществуването на оптимум или колко „плосък“ е той?`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`Полето на коаксиален кабел зависи от радиуса като $1/r$, затова максимумът му е там, където $r$ е най-малко.`,
      },
      {
        kind: "paragraph",
        text: String.raw`В $(c)$ производната на $a\ln(b/a)$ по $a$ съдържа $\ln(b/a)-1$. Оттам оптимумът е едно-единствено число.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "(a) Полето между жилото и обвивката" },
      {
        kind: "paragraph",
        text: String.raw`От теоремата на Гаус за цилиндър с дължина $L$ и радиус $r$ следва $E(r)=\dfrac{\lambda}{2\pi\varepsilon_0 r}$. Интегрираме от $a$ до $b$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\Delta V=\int_a^b\frac{\lambda}{2\pi\varepsilon_0 r}\,\mathrm{d}r=\frac{\lambda}{2\pi\varepsilon_0}\ln\frac ba`,
      },
      {
        kind: "paragraph",
        text: String.raw`Оттук изразяваме неудобната константа $\dfrac{\lambda}{2\pi\varepsilon_0}=\dfrac{\Delta V}{\ln(b/a)}$ и я връщаме в израза за полето:`,
      },
      { kind: "formula", latex: String.raw`\boxed{E(r)=\frac{\Delta V}{r\ln(b/a)}}` },
      {
        kind: "paragraph",
        text: String.raw`Полето е обратно пропорционално на $r$, значи е **най-силно при $r=a$**, тоест точно върху повърхността на вътрешното жило. Там ще започне и пробивът.`,
      },

      { kind: "subheading", text: "(b) Проверка на предложението" },
      {
        kind: "paragraph",
        text: String.raw`При $\Delta V=10\,\mathrm{kV}$ и $b=10\,\mathrm{mm}$ максималното поле е $E_{\max}=\dfrac{\Delta V}{a\ln(b/a)}$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
a=1{,}0\,\mathrm{mm}:\quad &E_{\max}=\frac{10^4}{(1{,}0\times10^{-3})\ln 10}=4{,}34\,\mathrm{MV/m}\\[3pt]
a=0{,}5\,\mathrm{mm}:\quad &E_{\max}=\frac{10^4}{(0{,}5\times10^{-3})\ln 20}=6{,}68\,\mathrm{MV/m}
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Междината нараства от $9{,}0$ на $9{,}5\,\mathrm{mm}$, а максималното поле **се увеличава** с над $50\%$. И двете стойности са над $3{,}0\,\mathrm{MV/m}$, значи и двата кабела пробиват. Предложението на колегата влошава нещата.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Причината: в знаменателя $a\ln(b/a)$ намаляването на $a$ действа **линейно**, а разширяването на междината влиза само през **логаритъма**. Линейното губене печели над логаритмичното печелене.`,
      },

      { kind: "subheading", text: "(c) Оптимумът" },
      {
        kind: "paragraph",
        text: String.raw`Кабелът издържа, докато $E_{\max}\le E_{\text{пр}}$. Полагаме равенство и изразяваме напрежението:`,
      },
      {
        kind: "formula",
        latex: String.raw`E_{\text{пр}}=\frac{\Delta V_{\text{пр}}}{a\ln(b/a)}\quad\Longrightarrow\quad \boxed{\Delta V_{\text{пр}}=E_{\text{пр}}\,a\ln\frac ba}`,
      },
      { kind: "paragraph", text: String.raw`Диференцираме по $a$ при фиксирано $b$:` },
      {
        kind: "formula",
        latex: String.raw`\frac{\mathrm{d}}{\mathrm{d}a}\left[a(\ln b-\ln a)\right]=\ln\frac ba+a\cdot\left(-\frac1a\right)=\ln\frac ba-1`,
      },
      { kind: "paragraph", text: String.raw`Приравняваме на нула:` },
      {
        kind: "formula",
        latex: String.raw`\ln\frac ba=1\quad\Longrightarrow\quad \boxed{a_{\text{опт}}=\frac be}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Проверка, че е максимум: втората производна е $\dfrac{\mathrm{d}^2}{\mathrm{d}a^2}\left[a\ln\dfrac ba\right]=-\dfrac1a<0$ за всяко $a>0$, значи функцията е вдлъбната навсякъде и намерената точка е максимум.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Забележете колко чист е резултатът: оптималното отношение $b/a=e$ не зависи нито от $b$, нито от пробивното поле, нито от материала.`,
      },

      { kind: "subheading", text: "(d) Числата" },
      {
        kind: "formula",
        latex: String.raw`a_{\text{опт}}=\frac{10\,\mathrm{mm}}{e}=3{,}68\,\mathrm{mm},\qquad \Delta V_{\text{пр}}^{\max}=E_{\text{пр}}\cdot a_{\text{опт}}\cdot 1=3{,}0\times10^6\cdot3{,}68\times10^{-3}=11{,}0\,\mathrm{kV}`,
      },
      { kind: "paragraph", text: String.raw`За кабела с $a=1{,}0\,\mathrm{mm}$:` },
      {
        kind: "formula",
        latex: String.raw`\Delta V_{\text{пр}}=3{,}0\times10^6\cdot1{,}0\times10^{-3}\cdot\ln 10=6{,}91\,\mathrm{kV}<10\,\mathrm{kV}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Не издържа, което е същият извод като в $(b)$, но получен от другата страна. Оптималният кабел издържа $11{,}0\,\mathrm{kV}$, тоест изборът на радиус сам по себе си вдига поносимото напрежение с около $60\%$, без нито един нов материал.`,
      },
      {
        kind: "figure",
        node: <BreakdownOptimumLab />,
        caption:
          "Плъзнете $a$ през целия диапазон. Вляво от върха тънкото жило концентрира полето, вдясно междината става твърде тясна. Пунктираната линия е изискваните $10\\,\\mathrm{kV}$.",
      },

      { kind: "subheading", text: "(e) Колко плосък е оптимумът" },
      {
        kind: "paragraph",
        text: String.raw`Удобно е да работим с отношението $k=a/a_{\text{опт}}$. Понеже $a_{\text{опт}}=b/e$,`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac{\Delta V_{\text{пр}}(k\,a_{\text{опт}})}{\Delta V_{\text{пр}}^{\max}}=\frac{k\,a_{\text{опт}}\ln\dfrac{b}{k\,a_{\text{опт}}}}{a_{\text{опт}}}=k\left(1-\ln k\right)`,
      },
      {
        kind: "list",
        items: [
          String.raw`$k=1{,}2$: $\;1{,}2(1-\ln 1{,}2)=0{,}981$, тоест **$-1{,}9\%$**.`,
          String.raw`$k=0{,}8$: $\;0{,}8(1+0{,}223)=0{,}979$, тоест **$-2{,}1\%$**.`,
        ],
      },
      {
        kind: "paragraph",
        text: String.raw`Разложението около $k=1$ обяснява защо: $k(1-\ln k)\approx 1-\dfrac{(k-1)^2}{2}$, тоест загубата е **квадратична** по отклонението. Двадесет процента грешка в радиуса струват едва два процента напрежение.`,
      },
      {
        kind: "paragraph",
        text: String.raw`По-изненадващото е именно плоскостта. Съществуването на оптимум се очаква, щом две противоположни тенденции се борят. Но плоскостта има практическа стойност: производството може да си позволи груб допуск по радиуса, стига да не се отклонява **в пъти**. За сравнение, кабелът с $a=1{,}0\,\mathrm{mm}$ е на $k=0{,}27$ и вече губи $37\%$.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 4 */
  {
    number: 4,
    title: "Дърпаме плочите, а енергията намалява?",
    tags: ["Енергиен баланс", "Сила", "Случай А задължителен"],
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Плосък кондензатор с площ $S=100\,\mathrm{cm^2}$ и разстояние $d_1=1{,}0\,\mathrm{mm}$ е зареден до $\Delta V=1000\,\mathrm{V}$. Плочите бавно се раздалечават до $d_2=3{,}0\,\mathrm{mm}$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Външната сила върши положителна работа, защото дърпа срещу електричното привличане. Следователно изглежда естествено енергията на кондензатора да нарасне. Ще се окаже ли това вярно и когато кондензаторът остава свързан към източника?`,
      },
      { kind: "subheading", text: "Случай А: изключен от източника ($Q=\\mathrm{const}$)" },
      {
        kind: "paragraph",
        text: String.raw`**(a)** Намерете $C_1$, $Q$, $C_2$, $\Delta V_2$ и промяната на енергията $A_2-A_1$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Намерете силата на привличане между плочите. Зависи ли тя от разстоянието? От нея пресметнете работата на външната сила и проверете енергийния баланс.`,
      },
      { kind: "subheading", text: "Случай Б: свързан към източника ($\\Delta V=\\mathrm{const}$)" },
      {
        kind: "paragraph",
        text: String.raw`**(c)** Намерете $C_2$, $Q_2$ и $A_2-A_1$. Зарядът и енергията на кондензатора нарастват ли или намаляват? Съгласува ли се това с първоначалната ви интуиция?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** Намерете енергията, която източникът получава обратно. После намерете работата на външната сила **без да интегрирате**, само от енергийния баланс $A_{\text{външна}}+A_{\text{от източника}}=A_2-A_1$. Внимавайте със знаците: източникът тук *приема* енергия.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** Проследете с думи всеки джаул: защо външната сила върши положителна работа, докато енергията на кондензатора намалява? Кой е третият участник?`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`**Указание за силата.** Не бъркайте полето *между* плочите с полето, което действа *върху* една плоча. Всяка плоча създава поле $\sigma/2\varepsilon_0$ от двете си страни. Между плочите двете полета се събират и дават $E=\sigma/\varepsilon_0$. Но върху лявата плоча действа само полето на **дясната**, тоест $E_{\text{чуждо}}=\sigma/2\varepsilon_0$. Оттук $F=Q\cdot\dfrac{\sigma}{2\varepsilon_0}=\dfrac{Q^2}{2\varepsilon_0S}$.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "Изходни числа" },
      {
        kind: "formula",
        latex: String.raw`C_1=\frac{\varepsilon_0S}{d_1}=\frac{8{,}85\times10^{-12}\cdot10^{-2}}{10^{-3}}=88{,}5\,\mathrm{pF},\qquad Q=C_1\Delta V=88{,}5\,\mathrm{nC}`,
      },
      {
        kind: "formula",
        latex: String.raw`A_1=\tfrac12C_1(\Delta V)^2=44{,}25\,\mu\mathrm{J},\qquad C_2=\frac{\varepsilon_0S}{d_2}=29{,}5\,\mathrm{pF}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Забележете, че $C_2=C_1/3$ и в двата случая: капацитетът зависи само от геометрията, не от режима на захранване. Различното е **какво остава постоянно**.`,
      },

      { kind: "subheading", text: "(a) Случай А: постоянен заряд" },
      {
        kind: "paragraph",
        text: String.raw`Кондензаторът е изключен, зарядът няма къде да отиде: $Q=88{,}5\,\mathrm{nC}$ остава.`,
      },
      {
        kind: "formula",
        latex: String.raw`\Delta V_2=\frac{Q}{C_2}=\frac{88{,}5\times10^{-9}}{29{,}5\times10^{-12}}=3000\,\mathrm{V}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Това е очаквано и по друг път: при постоянен заряд полето $E=\sigma/\varepsilon_0$ не се мени, значи $\Delta V=Ed$ расте пропорционално на разстоянието, тоест три пъти. Енергията:`,
      },
      {
        kind: "formula",
        latex: String.raw`A_2=\frac{Q^2}{2C_2}=132{,}75\,\mu\mathrm{J}\quad\Longrightarrow\quad A_2-A_1=+88{,}5\,\mu\mathrm{J}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Енергията **нараства** три пъти, точно както очаква интуицията: $A=Q^2x/(2\varepsilon_0S)$ е линейна по разстоянието.`,
      },

      { kind: "subheading", text: "(b) Силата и балансът в случай А" },
      {
        kind: "paragraph",
        text: String.raw`Според указанието върху всяка плоча действа полето на другата, тоест $\sigma/2\varepsilon_0$:`,
      },
      {
        kind: "formula",
        latex: String.raw`F=Q\cdot\frac{\sigma}{2\varepsilon_0}=\frac{Q^2}{2\varepsilon_0S}=\frac{(88{,}5\times10^{-9})^2}{2\cdot8{,}85\times10^{-12}\cdot10^{-2}}=44{,}25\,\mathrm{mN}`,
      },
      {
        kind: "paragraph",
        text: String.raw`В този запис влизат само $Q$ и $S$, а те не се менят. Значи силата **не зависи от разстоянието**: това е и отговорът на въпроса. Причината е, че при постоянен заряд полето между плочите не отслабва с раздалечаването.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Понеже силата е постоянна, работата на външната сила е просто произведение:`,
      },
      {
        kind: "formula",
        latex: String.raw`A_{\text{външна}}=F\,(d_2-d_1)=44{,}25\times10^{-3}\cdot2{,}0\times10^{-3}=88{,}5\,\mu\mathrm{J}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Съвпада точно с $A_2-A_1=88{,}5\,\mu\mathrm{J}$. Балансът е затворен: цялата работа на ръката отива в полето, защото няма трети участник, който да вземе или даде енергия.`,
      },

      { kind: "subheading", text: "(c) Случай Б: постоянно напрежение" },
      {
        kind: "paragraph",
        text: String.raw`Сега източникът държи $\Delta V=1000\,\mathrm{V}$, а зарядът е свободен да се преразпредели:`,
      },
      {
        kind: "formula",
        latex: String.raw`Q_2=C_2\Delta V=29{,}5\,\mathrm{nC},\qquad A_2=\tfrac12C_2(\Delta V)^2=14{,}75\,\mu\mathrm{J}`,
      },
      {
        kind: "formula",
        latex: String.raw`A_2-A_1=14{,}75-44{,}25=\boxed{-29{,}5\,\mu\mathrm{J}}`,
      },
      {
        kind: "paragraph",
        text: String.raw`И зарядът, и енергията **намаляват**. Това противоречи на първоначалната интуиция: дърпаме, вършим положителна работа, а енергията на кондензатора пада. Разликата с случай А е, че сега има кой да поеме заряда - източникът.`,
      },
      {
        kind: "figure",
        node: <PlateSeparationLab />,
        caption:
          "Една и съща геометрия, два режима. Оранжевата крива расте линейно, синята пада като $1/x$. Превключвателят сменя кои числа се показват в лентите.",
      },

      { kind: "subheading", text: "(d) Енергията, върната на източника" },
      {
        kind: "paragraph",
        text: String.raw`През източника обратно преминава заряд $\Delta Q=Q-Q_2=88{,}5-29{,}5=59{,}0\,\mathrm{nC}$, и то при постоянно напрежение $1000\,\mathrm{V}$. Затова`,
      },
      {
        kind: "formula",
        latex: String.raw`A_{\text{към източника}}=\Delta Q\cdot\Delta V=59{,}0\times10^{-9}\cdot1000=59{,}0\,\mu\mathrm{J}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Източникът **приема** тази енергия, значи работата, която той върши върху веригата, е отрицателна: $A_{\text{от източника}}=-59{,}0\,\mu\mathrm{J}$. Заместваме в баланса:`,
      },
      {
        kind: "formula",
        latex: String.raw`A_{\text{външна}}=(A_2-A_1)-A_{\text{от източника}}=(-29{,}5)-(-59{,}0)=\boxed{+29{,}5\,\mu\mathrm{J}}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Положителна, както изисква здравият разум: ръката пак дърпа срещу привличането. Проверка с интегриране (което задачата разрешава да пропуснем): при постоянно напрежение $F=\dfrac{\varepsilon_0S(\Delta V)^2}{2x^2}$, откъдето`,
      },
      {
        kind: "formula",
        latex: String.raw`A_{\text{външна}}=\int_{d_1}^{d_2}\frac{\varepsilon_0S(\Delta V)^2}{2x^2}\,\mathrm{d}x=\frac{\varepsilon_0S(\Delta V)^2}{2}\left(\frac{1}{d_1}-\frac{1}{d_2}\right)=29{,}5\,\mu\mathrm{J}`,
      },
      { kind: "paragraph", text: "Съвпада точно." },

      { kind: "subheading", text: "(e) Къде отива всеки джаул" },
      {
        kind: "list",
        items: [
          String.raw`Ръката внася $+29{,}5\,\mu\mathrm{J}$ механична работа.`,
          String.raw`Полето между плочите отдава $29{,}5\,\mu\mathrm{J}$ (енергията му пада от $44{,}25$ на $14{,}75\,\mu\mathrm{J}$).`,
          String.raw`Двата приноса се събират и отиват в източника: $29{,}5+29{,}5=59{,}0\,\mu\mathrm{J}$, точно колкото пресметнахме.`,
        ],
      },
      {
        kind: "paragraph",
        text: String.raw`**Третият участник е източникът.** В случай А той липсва и затова цялата работа отива в полето. В случай Б батерията се дозарежда: тя работи като приемник, а не като източник. Парадоксът изчезва в момента, в който спрем да гледаме кондензатора като изолирана система.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Полезна проверка на разбирането: в случай Б външната работа $29{,}5\,\mu\mathrm{J}$ е точно колкото **намалява** енергията на кондензатора. Това не е съвпадение - при $\Delta V=\mathrm{const}$ и двете величини са $\tfrac12\varepsilon_0S(\Delta V)^2\left(\frac1{d_1}-\frac1{d_2}\right)$.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 5 */
  {
    number: 5,
    title: "Парадоксът на изчезналата енергия",
    tags: ["Запазване на заряда", "Дисипация", "Допълнителна"],
    starred: true,
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Два еднакви кондензатора с капацитет $C$ са изолирани от източници. Първият е зареден до $\Delta V_0$, а вторият е незареден. Свързваме едноименните им плочи с проводници, чието общо съпротивление е $R$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Зарядът не може да напусне системата. Преди да смятате, решете: очаквате ли пълната енергия на електричното поле също да се запази?`,
      },
      { kind: "paragraph", text: String.raw`**(a)** От запазването на заряда намерете общото крайно напрежение.` },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Сравнете енергията преди и след свързването. Покажете, че точно **половината** от началната енергия на полето липсва.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(c)** При крайно съпротивление токът е $I(t)=\dfrac{\Delta V_0}{R}\exp\left(-\dfrac{2t}{RC}\right)$. Пресметнете $\int_0^\infty I^2R\,\mathrm{d}t$. Къде се е появила липсващата енергия и защо резултатът не зависи от $R$?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** Какво става в идеализираната граница $R\to0$? Защо „идеален проводник“ не връща липсващата енергия?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** Обобщете за произволни $C_1,C_2$ и начални напрежения $\Delta V_1,\Delta V_2$ с еднаква полярност. Изведете $A_{\text{загуба}}=\dfrac12\dfrac{C_1C_2}{C_1+C_2}\left(\Delta V_1-\Delta V_2\right)^2$. Кога няма загуба? Как се изменя формулата при противоположни полярности?`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`В $(c)$ използвайте $\int_0^\infty e^{-\alpha t}\,\mathrm{d}t=1/\alpha$ и внимавайте, че квадратът на експонентата удвоява показателя.`,
      },
      {
        kind: "paragraph",
        text: String.raw`В $(e)$ след като напишете двете енергии, приведете разликата под общ знаменател $C_1+C_2$ и вижте, че числителят е пълен квадрат.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "(a) Крайното напрежение" },
      {
        kind: "paragraph",
        text: String.raw`Началният заряд $Q_0=C\,\Delta V_0$ се разпределя между двата кондензатора. След установяването напреженията им са равни (иначе би текъл ток), а сумарният капацитет е $2C$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\Delta V_f=\frac{Q_0}{2C}=\frac{C\,\Delta V_0}{2C}=\boxed{\frac{\Delta V_0}{2}}`,
      },

      { kind: "subheading", text: "(b) Изчезналата половина" },
      {
        kind: "formula",
        latex: String.raw`A_{\text{преди}}=\tfrac12C\,\Delta V_0^2,\qquad A_{\text{след}}=2\cdot\tfrac12C\left(\frac{\Delta V_0}{2}\right)^2=\tfrac14C\,\Delta V_0^2`,
      },
      {
        kind: "formula",
        latex: String.raw`A_{\text{след}}=\tfrac12A_{\text{преди}}\quad\Longrightarrow\quad A_{\text{загуба}}=\tfrac14C\,\Delta V_0^2`,
      },
      {
        kind: "paragraph",
        text: String.raw`Зарядът се запазва точно, енергията - не. Причината е, че енергията зависи **квадратично** от напрежението: разделянето на един и същ заряд на две половини по $\Delta V_0/2$ дава $2\times\left(\tfrac12\right)^2=\tfrac12$ от началната енергия.`,
      },

      { kind: "subheading", text: "(c) Къде отива тя" },
      {
        kind: "paragraph",
        text: String.raw`Разсеяната в съпротивлението енергия е интегралът от мигновената мощност $p=I^2R$:`,
      },
      {
        kind: "formula",
        latex: String.raw`\int_0^\infty I^2R\,\mathrm{d}t=R\cdot\frac{\Delta V_0^2}{R^2}\int_0^\infty \exp\left(-\frac{4t}{RC}\right)\mathrm{d}t=\frac{\Delta V_0^2}{R}\cdot\frac{RC}{4}=\boxed{\tfrac14C\,\Delta V_0^2}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Съвпада **точно** с липсващата енергия от $(b)$. Тя е отишла в джаулова топлина в свързващите проводници.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Защо $R$ отпада: началната мощност е $\Delta V_0^2/R$, тоест обратно пропорционална на $R$, а характерното време на процеса е $RC/4$, тоест право пропорционално на $R$. В произведението двете зависимости се съкращават.`,
      },
      {
        kind: "figure",
        node: <ChargeSharingLab />,
        caption:
          "Менете $R$: върхът се вдига и стеснява или се снишава и разширява, но защрихованото лице остава едно и също. Това е геометричният вид на съкращаването на $R$.",
      },

      { kind: "subheading", text: "(d) Границата на идеалния проводник" },
      {
        kind: "paragraph",
        text: String.raw`Резултатът $\tfrac14C\,\Delta V_0^2$ **не зависи от $R$**, значи не клони към нула при $R\to0$. Границата е особена: колкото и да намаляваме съпротивлението, загубата остава същата.`,
      },
      {
        kind: "paragraph",
        text: String.raw`Физически това означава, че моделът „идеален проводник“ е непълен. При много малко $R$ енергията напуска системата по другите налични канали:`,
      },
      {
        kind: "list",
        items: [
          "Всяка реална верига има индуктивност, така че вместо апериодично изравняване се получава затихващо трептене, което пак завършва с разсейване.",
          "При много бърз процес контурът излъчва електромагнитни вълни, тоест работи като антена.",
        ],
      },
      {
        kind: "paragraph",
        text: String.raw`Общото между двата канала: енергията трябва да отиде някъде и математиката ни казва **колко**, преди изобщо да сме решили по какъв механизъм. Идеализация, която едновременно приема $R=0$, нулева индуктивност и нулево излъчване, е противоречива, а не просто приблизителна.`,
      },

      { kind: "subheading", text: "(e) Общият случай" },
      {
        kind: "paragraph",
        text: String.raw`Запазването на заряда дава крайното напрежение, а оттам и двете енергии:`,
      },
      {
        kind: "formula",
        latex: String.raw`\Delta V_f=\frac{C_1\Delta V_1+C_2\Delta V_2}{C_1+C_2},\qquad A_{\text{след}}=\frac{(C_1\Delta V_1+C_2\Delta V_2)^2}{2(C_1+C_2)}`,
      },
      { kind: "paragraph", text: String.raw`Изваждаме от началната енергия и привеждаме под общ знаменател:` },
      {
        kind: "formula",
        latex: String.raw`\begin{aligned}
2(C_1+C_2)\,A_{\text{загуба}}&=\left(C_1\Delta V_1^2+C_2\Delta V_2^2\right)(C_1+C_2)-\left(C_1\Delta V_1+C_2\Delta V_2\right)^2\\[2pt]
&=C_1C_2\left(\Delta V_1^2-2\Delta V_1\Delta V_2+\Delta V_2^2\right)=C_1C_2\left(\Delta V_1-\Delta V_2\right)^2
\end{aligned}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Членовете с $C_1^2$ и $C_2^2$ се унищожават напълно и остава пълен квадрат:`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{A_{\text{загуба}}=\frac12\,\frac{C_1C_2}{C_1+C_2}\left(\Delta V_1-\Delta V_2\right)^2}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Проверка с частния случай: при $C_1=C_2=C$, $\Delta V_1=\Delta V_0$ и $\Delta V_2=0$ се получава $\tfrac12\cdot\tfrac C2\cdot\Delta V_0^2=\tfrac14C\Delta V_0^2$, както в $(b)$.`,
      },
      {
        kind: "list",
        items: [
          String.raw`**Загуба няма** само при $\Delta V_1=\Delta V_2$: тогава нищо не тече. Обърнете внимание, че условието е за равни **напрежения**, не за равни заряди.`,
          String.raw`При **противоположни полярности** заместваме $\Delta V_2\to-\Delta V_2$ и разликата става сума: $A_{\text{загуба}}=\dfrac12\dfrac{C_1C_2}{C_1+C_2}\left(\Delta V_1+\Delta V_2\right)^2$, тоест загубата е по-голяма.`,
          String.raw`Ако при това $C_1\Delta V_1=C_2\Delta V_2$, крайният заряд е нула и **цялата** начална енергия се разсейва.`,
        ],
      },
      {
        kind: "paragraph",
        text: String.raw`Множителят $\dfrac{C_1C_2}{C_1+C_2}$ е последователната комбинация на двата капацитета. Появата ѝ не е случайна: за тока веригата е точно последователно свързване на двата кондензатора, а движещото напрежение е разликата $\Delta V_1-\Delta V_2$.`,
      },
    ],
  },

  /* ------------------------------------------------------------------ 6 */
  {
    number: 6,
    title: "Бонус: половината енергия в един процент от обема",
    tags: ["Плътност на енергията", "Коаксиален", "Бонус"],
    starred: true,
    statement: [
      {
        kind: "paragraph",
        text: String.raw`Може ли половината от енергията на един кондензатор да е натъпкана само в един процент от обема му? Проверете това за коаксиален кондензатор с радиуси $a$ и $b$, заряд $Q$ и дължина $L$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(a)** Разгледайте тънък цилиндричен слой между $r$ и $r+\Delta r$. Обемът му е $\Delta\mathcal V=2\pi rL\,\Delta r$. Като използвате $u=\tfrac12\varepsilon_0E^2$ от задача $1(g)$, покажете, че енергията в слоя е $\Delta A\propto\dfrac{\Delta r}{r}$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(b)** Сумата на $\Delta r/r$ от $a$ до $r$ дава $\ln(r/a)$. Оттук напишете каква част от пълната енергия се съдържа между $a$ и $r$.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(c)** Намерете радиуса $r_{1/2}$, вътре в който е точно **половината** енергия. Отговорът е изненадващо прост.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(d)** За $a=1\,\mathrm{mm}$ и $b=100\,\mathrm{mm}$ пресметнете $r_{1/2}$. Каква част от обема заема тази област?`,
      },
      {
        kind: "paragraph",
        text: String.raw`**(e)** Направете същия анализ за плосък кондензатор. Каква е качествената разлика и какво практическо следствие има тя за изолацията около вътрешното жило?`,
      },
    ],
    hint: [
      {
        kind: "paragraph",
        text: String.raw`В $(a)$ квадратът $r^2$ от $E^2$ се съкращава срещу $r$ от обема и остава само $1/r$.`,
      },
    ],
    solution: [
      { kind: "subheading", text: "(a) Енергията в тънък слой" },
      {
        kind: "paragraph",
        text: String.raw`От теоремата на Гаус за коаксиалната геометрия с линейна плътност $\lambda=Q/L$:`,
      },
      { kind: "formula", latex: String.raw`E(r)=\frac{Q}{2\pi\varepsilon_0 L\,r}` },
      { kind: "paragraph", text: String.raw`Плътността на енергията от задача $1(g)$ е` },
      {
        kind: "formula",
        latex: String.raw`u=\tfrac12\varepsilon_0E^2=\frac{Q^2}{8\pi^2\varepsilon_0L^2r^2}`,
      },
      { kind: "paragraph", text: String.raw`Умножаваме по обема на слоя $\Delta\mathcal V=2\pi rL\,\Delta r$:` },
      {
        kind: "formula",
        latex: String.raw`\Delta A=u\,\Delta\mathcal V=\frac{Q^2}{8\pi^2\varepsilon_0L^2r^2}\cdot2\pi rL\,\Delta r=\frac{Q^2}{4\pi\varepsilon_0L}\cdot\frac{\Delta r}{r}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Ето го съкращаването: $r^2$ от знаменателя срещу $r$ от обема. **Остава $\Delta A\propto\Delta r/r$**, тоест всеки слой с еднакво *относително* нарастване на радиуса носи еднаква енергия.`,
      },

      { kind: "subheading", text: "(b) Каква част седи между $a$ и $r$" },
      {
        kind: "paragraph",
        text: String.raw`Сумирането на $\Delta r/r$ дава логаритъм, затова`,
      },
      {
        kind: "formula",
        latex: String.raw`A(a\to r)=\frac{Q^2}{4\pi\varepsilon_0L}\ln\frac ra,\qquad A_{\text{пълна}}=\frac{Q^2}{4\pi\varepsilon_0L}\ln\frac ba`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{\frac{A(a\to r)}{A_{\text{пълна}}}=\frac{\ln(r/a)}{\ln(b/a)}}`,
      },
      {
        kind: "paragraph",
        text: String.raw`Всички физични константи и самият заряд отпадат: делът зависи само от геометрията, и то само през отношения на радиуси.`,
      },

      { kind: "subheading", text: "(c) Радиусът на половината енергия" },
      { kind: "paragraph", text: String.raw`Полагаме дела равен на $\tfrac12$:` },
      {
        kind: "formula",
        latex: String.raw`\frac{\ln(r_{1/2}/a)}{\ln(b/a)}=\frac12\quad\Longrightarrow\quad \ln\frac{r_{1/2}}{a}=\frac12\ln\frac ba=\ln\sqrt{\frac ba}`,
      },
      {
        kind: "formula",
        latex: String.raw`\boxed{r_{1/2}=a\sqrt{\frac ba}=\sqrt{ab}}`,
      },
      {
        kind: "paragraph",
        text: String.raw`**Геометричната средна** на двата радиуса. Простотата не е случайна: върху логаритмична скала енергията се натрупва равномерно, затова половината пада точно в средата на логаритмичната скала, а средата в логаритми е геометрична средна.`,
      },
      {
        kind: "figure",
        node: <EnergyEnclosedLab />,
        caption:
          "Вляво е напречното сечение с оцветената област до $r$, вдясно същото като дял от енергията върху логаритмична ос. Правата линия е математическото съдържание на задачата: всяка декада носи еднакъв дял енергия.",
      },

      { kind: "subheading", text: "(d) Числата" },
      {
        kind: "formula",
        latex: String.raw`r_{1/2}=\sqrt{1\cdot100}=10\,\mathrm{mm}`,
      },
      { kind: "paragraph", text: String.raw`Съответната част от обема е отношение на площите на пръстените:` },
      {
        kind: "formula",
        latex: String.raw`\frac{\mathcal V(a\to r_{1/2})}{\mathcal V(a\to b)}=\frac{r_{1/2}^2-a^2}{b^2-a^2}=\frac{100-1}{10^4-1}=\frac{99}{9999}=0{,}99\%`,
      },
      {
        kind: "paragraph",
        text: String.raw`Отговорът на въпроса от заглавието е **да**: половината от енергията седи в под един процент от обема. Причината е сблъсъкът на две зависимости - енергийната плътност пада като $1/r^2$, а обемът расте като $r^2$, но първата печели, защото е концентрирана точно там, където обемът е най-малък.`,
      },

      { kind: "subheading", text: "(e) Сравнение с плоския кондензатор" },
      {
        kind: "paragraph",
        text: String.raw`При плосък кондензатор полето е еднородно, значи $u=\tfrac12\varepsilon_0E^2$ е една и съща навсякъде. Тогава енергията в слой с дебелина $\Delta x$ е $\Delta A=u\,S\,\Delta x\propto\Delta x$, тоест`,
      },
      {
        kind: "formula",
        latex: String.raw`\frac{A(0\to x)}{A_{\text{пълна}}}=\frac{x}{d}\quad\Longrightarrow\quad x_{1/2}=\frac d2`,
      },
      {
        kind: "paragraph",
        text: String.raw`**Качествената разлика:** при плоския кондензатор половината енергия заема точно половината обем, защото няма отделено място. При коаксиалния енергията е рязко концентрирана около вътрешното жило.`,
      },
      {
        kind: "paragraph",
        text: String.raw`**Практическото следствие** затваря кръга със задача 3. Щом и полето, и енергията са най-големи точно върху повърхността на вътрешното жило, там е и най-натоварената изолация. Оттам започва пробивът, там имат значение чистотата на повърхността и липсата на микроостриета, и там си струва да се сложи по-качественият изолационен слой. Дебела изолация далеч от жилото добавя обем, но почти не добавя устойчивост.`,
      },
    ],
  },
];
