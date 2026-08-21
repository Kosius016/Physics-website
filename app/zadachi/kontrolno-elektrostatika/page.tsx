import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import {
  Prereq,
  ProblemStatement,
  ResultBox,
  Solution,
  SolutionPart,
} from "@/components/problem-sets/SolutionParts";
import {
  ChargedDiskLab,
  ChargedSphereLab,
  DielectricSlabFigure,
  DielectricSlabLab,
  DiskRingFigure,
  EarnshawSaddleFigure,
  FigurePanel,
  SphereDensityFigure,
  SphereInFieldFigure,
  SphereInFieldLab,
} from "@/components/problem-sets/ElectrostaticsExamLabs";

export const metadata = {
  title: "Контролно по електростатика с подробни решения · STEM Платформа",
  description:
    "Седем въпроса от теорията и четири задачи по електростатика с пълни решения, интерактивни графики и ясно означено ниво спрямо уроците в платформата.",
};

const NAV = [
  { id: "gauss", n: "§1", label: "Гаус и потенциал" },
  { id: "dipole", n: "§2", label: "Дипол и проводник" },
  { id: "dielectric", n: "§3", label: "Диелектрици" },
  { id: "earnshaw", n: "§4", label: "Ърншоу" },
  { id: "sphere", n: "§5", label: "Сфера с плътност" },
  { id: "disk", n: "§6", label: "Зареден диск" },
  { id: "slab", n: "§7", label: "Пластина в кондензатор" },
  { id: "induced", n: "§8", label: "Сфера във външно поле" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

const LESSON = {
  potential: { label: "Потенциал", href: "/physics/elektrichestvo/potencial" },
  conductors: { label: "Проводници", href: "/physics/elektrichestvo/provodnici" },
  capacitors: { label: "Кондензатори", href: "/physics/elektrichestvo/kondenzatori" },
  dielectrics: { label: "Диелектрици", href: "/physics/elektrichestvo/dielektrici" },
  taylor: { label: "Редове на Тейлър", href: "/materiali/redove-na-teylar" },
  lightning: { label: "Статия: мълнията", href: "/statii/malniyata" },
} as const;

function QuestionCard({
  code,
  title,
  children,
}: {
  code: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mt-8 first:mt-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="rounded-full border-[1.5px] border-ink bg-ink px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {code}
        </span>
        <h3 className="font-serif text-[21px] font-bold leading-tight text-ink">{title}</h3>
      </div>
      <div className="mt-3">{children}</div>
    </article>
  );
}

export default function ElectrostaticsExamPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pb-2 pt-11">
        <Link href="/zadachi" className="text-[13px] font-semibold text-minus hover:underline">
          Задачи / Електростатика
        </Link>
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[.22em] text-minus">
          Контролно с подробни решения
        </p>
        <h1 className="mt-2 font-serif text-[clamp(38px,7vw,58px)] font-bold leading-[1.04] text-ink">
          Електростатика: контролно
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Седем въпроса от теорията и четири задачи, давани на реално контролно. Решенията са
          написани като пълни модели на разсъждение и се отключват стъпка по стъпка.
        </p>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-muted">
          Под всяко условие стои ред с уроците, на които стъпва задачата. Част от тях още не са
          публикувани; ще бъдат качени в близко бъдеще. Дотогава решението въвежда нужното на
          място, така че всеки въпрос остава решим.
        </p>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
          <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
            Университетско ниво · <RichText text="$1$-$2$ курс" />
          </span>
          <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
            <RichText text="Част I: $7$ въпроса" />
          </span>
          <span className="rounded-full border-[1.5px] border-ink bg-surface px-3 py-1.5">
            <RichText text="Част II: $4$ задачи" />
          </span>
        </div>

      </header>

      <LessonNav items={NAV} />

      {/* ─────────────────────────  Част I  ───────────────────────── */}

      <Section id="gauss" n="§1" title="Закон на Гаус и потенциал">
        <QuestionCard code="T1" title="Двете форми на закона на Гаус">
          <ProblemStatement>
            <p>
              Формулирайте закона на Гаус в интегрална и в диференциална форма. Обяснете какво
              свързва всяка от двете и как се преминава от едната към другата.
            </p>
          </ProblemStatement>
          <Prereq
            links={[LESSON.conductors]}
            note="Интегралната форма е изведена и използвана в урока за проводници. Отделен урок за закона на Гаус, който стига до диференциалната форма, предстои."
          />
          <Solution
            hint={
              <RichText text="Интегралната форма свързва величини за цяла затворена повърхност, а диференциалната казва нещо за една-единствена точка." />
            }
          >
            <SolutionPart label="a" title="Интегралната форма">
              <Formula
                latex={String.raw`\oint_S\vec E\cdot d\vec A=\frac{Q_{\text{вътр}}}{\varepsilon_0}
                =\frac1{\varepsilon_0}\int_{\mathcal V}\rho\,dV`}
              />
              <p>
                Тя свързва потока през цялата затворена повърхност с пълния заряд, ограден от
                нея. Зарядите извън повърхността създават поле върху нея, но общият им принос
                към потока е нула: колкото линии влизат, толкова излизат.
              </p>
            </SolutionPart>

            <SolutionPart label="b" title="Диференциалната форма">
              <Formula latex={String.raw`\nabla\cdot\vec E=\frac{\rho}{\varepsilon_0}`} />
              <p>
                Това е локално твърдение. Дивергенцията на полето в една точка се определя от
                обемната плътност на заряда в същата точка, а не от заряди някъде далече.
              </p>
            </SolutionPart>

            <SolutionPart label="c" title="Преходът между двете">
              <p>Теоремата за дивергенцията превръща повърхностния интеграл в обемен:</p>
              <Formula
                latex={String.raw`\oint_S\vec E\cdot d\vec A=\int_{\mathcal V}\nabla\cdot\vec E\,dV`}
              />
              <p>
                Понеже равенството важи за произволен обем, а не за някакъв избран, двете
                подинтегрални функции трябва да съвпадат навсякъде.
              </p>
              <ResultBox>
                Интегралната форма е инструментът, когато има симетрия. Диференциалната е самият
                закон, записан точка по точка, и от нея тръгват уравненията на Максуел.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>

        <QuestionCard code="T2" title="Защо работата не зависи от пътя">
          <ProblemStatement>
            <p>
              Обяснете защо работата на електростатичното поле не зависи от пътя и как оттам
              следва въвеждането на потенциал. Запишете връзката между{" "}
              <RichText text={String.raw`$\vec E$`} /> и <RichText text="$V$" /> в двете посоки.
            </p>
          </ProblemStatement>
          <Prereq links={[LESSON.potential]} />
          <Solution
            hint={
              <RichText text="Разгледайте два различни пътя от $A$ до $B$. Единият, изминат наобратно след другия, образува един затворен контур." />
            }
          >
            <SolutionPart label="a" title="Нулева циркулация">
              <p>В електростатиката полето е безвихрово:</p>
              <Formula latex={String.raw`\oint_C\vec E\cdot d\vec\ell=0,\qquad \nabla\times\vec E=\vec 0`} />
            </SolutionPart>

            <SolutionPart label="b" title="Оттук следва независимостта от пътя">
              <p>
                Нека има два пътя от <RichText text="$A$" /> до <RichText text="$B$" />. Първият,
                следван от втория в обратна посока, образува затворен контур. Нулевата циркулация
                означава, че интегралите по двата пътя са равни. Следователно работата
              </p>
              <Formula latex={String.raw`A_{A\to B}=q\int_A^B\vec E\cdot d\vec\ell`} />
              <p>зависи само от крайните точки, а не от начина, по който сме стигнали до тях.</p>
            </SolutionPart>

            <SolutionPart label="c" title="Дефиниция на потенциала">
              <Formula latex={String.raw`V(B)-V(A)=-\int_A^B\vec E\cdot d\vec\ell`} />
              <p>
                Минусът е избран така, че полето да сочи натам, накъдето потенциалът намалява.
                Точно затова положителният заряд се движи спонтанно към по-нисък потенциал.
              </p>
            </SolutionPart>

            <SolutionPart label="d" title="Двете посоки на връзката">
              <Formula
                latex={String.raw`\vec E=-\nabla V,\qquad
                V(\vec r)-V(\vec r_0)=-\int_{\vec r_0}^{\vec r}\vec E\cdot d\vec\ell`}
              />
              <ResultBox>
                Едната посока е диференциране, другата е интегриране. Затова{" "}
                <RichText text="$V$" /> е скалар, който събира приноси наум, а{" "}
                <RichText text={String.raw`$\vec E$`} /> се възстановява от него по-късно.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>
      </Section>

      <Section id="dipole" n="§2" title="Дипол и проводник в равновесие">
        <QuestionCard code="T3" title="Електричен дипол">
          <ProblemStatement>
            <p>
              Какво е електричен дипол? Запишете дипълния момент{" "}
              <RichText text={String.raw`$\vec p$`} /> на система от точкови заряди и потенциала
              на дипол на голямо разстояние от нея.
            </p>
          </ProblemStatement>
          <Prereq
            links={[LESSON.potential, LESSON.dielectrics]}
            note="Диполът се появява в двата урока като физическа картина. Урок за диполния момент на произволна система и за далечното развитие на потенциала предстои."
          />
          <Solution
            hint={
              <RichText text="Идеалният дипол е границата, в която разстоянието клони към нула, а зарядът расте така, че произведението $q\ell$ да остане същото." />
            }
          >
            <SolutionPart label="a" title="Определение">
              <p>
                Идеален дипол се получава от заряди <RichText text="$+q$" /> и{" "}
                <RichText text="$-q$" />, разделени от малък вектор{" "}
                <RichText text={String.raw`$\vec\ell$`} />, насочен от отрицателния към
                положителния заряд.
              </p>
              <Formula latex={String.raw`\vec p=q\vec\ell`} />
            </SolutionPart>

            <SolutionPart label="b" title="Система от точкови заряди">
              <Formula latex={String.raw`\vec p=\sum_i q_i\vec r_i`} />
              <p>
                За неутрална система тази сума не зависи от избора на начало: преместването на
                началото добавя член <RichText text={String.raw`$-\vec a\sum_i q_i$`} />, който е
                нула.
              </p>
            </SolutionPart>

            <SolutionPart label="c" title="Потенциалът на голямо разстояние">
              <p>Развитието на потенциала на локализирана система започва с</p>
              <Formula
                latex={String.raw`V(\vec r)=\frac1{4\pi\varepsilon_0}
                \left(\frac{Q}{r}+\frac{\vec p\cdot\hat r}{r^2}+\cdots\right)`}
              />
              <p>
                Когато системата е неутрална, <RichText text="$Q=0$" /> и водещият ненулев член е
                диполният:
              </p>
              <Formula latex={String.raw`V_{\text{дипол}}(\vec r)=\frac1{4\pi\varepsilon_0}\frac{\vec p\cdot\hat r}{r^2}`} />
              <ResultBox>
                Диполният потенциал спада като <RichText text="$1/r^2$" />, а полето му като{" "}
                <RichText text="$1/r^3$" />: по-бързо от точков заряд, защото отдалече двата
                заряда почти се компенсират.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>

        <QuestionCard code="T4" title="Проводник в електростатично равновесие">
          <ProblemStatement>
            <p>
              Обосновете защо полето вътре в проводник е нула, потенциалът му е постоянен, а
              полето непосредствено до повърхността е перпендикулярно на нея. С помощта на малка
              гаусова повърхност изведете <RichText text={String.raw`$E_n=\sigma/\varepsilon_0$`} />.
            </p>
          </ProblemStatement>
          <Prereq links={[LESSON.conductors]} />
          <Solution
            hint={
              <RichText text="Ако имаше тангенциална компонента, свободните заряди щяха да продължат да се движат. Използвайте тънка цилиндрична гаусова повърхност." />
            }
          >
            <SolutionPart label="a" title="Полето вътре">
              <p>
                В проводника има свободни заряди. Ако в обема му съществуваше ненулево поле, върху
                тях щеше да действа сила <RichText text={String.raw`$q\vec E$`} /> и те щяха да
                продължат да се движат. Това противоречи на равновесието, затова
              </p>
              <Formula latex={String.raw`\vec E_{\text{вътре}}=\vec 0`} />
            </SolutionPart>

            <SolutionPart label="b" title="Постоянен потенциал и нормално поле">
              <p>
                От <RichText text={String.raw`$\vec E=-\nabla V$`} /> следва, че потенциалът е
                постоянен в целия проводник. Тангенциалната компонента върху повърхността също
                трябва да е нула, иначе зарядите биха се движили по нея. Остава само нормална
                компонента.
              </p>
            </SolutionPart>

            <SolutionPart label="c" title="Гаусовата кутийка">
              <p>
                Избираме тънка цилиндрична повърхност с едната основа в проводника, а другата
                непосредствено отвън. Страничният поток изчезва в границата на малка височина, а
                вътрешната основа има нулев поток, защото там полето е нула.
              </p>
              <Formula
                latex={String.raw`E_nA=\frac{\sigma A}{\varepsilon_0}
                \quad\Longrightarrow\quad
                \boxed{E_n=\frac{\sigma}{\varepsilon_0}}`}
              />
              <ResultBox>
                Обърнете внимание на разликата с безкрайната заредена равнина, където полето е{" "}
                <RichText text={String.raw`$\sigma/2\varepsilon_0$`} />. При проводника цялото
                поле излиза от едната страна, защото от другата то е нула.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>
      </Section>

      <Section id="dielectric" n="§3" title="Диелектрик между плочите">
        <QuestionCard code="T5" title="Поляризация на диелектрика">
          <ProblemStatement>
            <p>
              Диелектрик се внася в кондензатор. Обяснете поотделно какво се случва с неполярните
              молекули и с молекулите, които имат постоянен диполен момент. Защо полето вътре в
              диелектрика отслабва? Как се дефинира{" "}
              <RichText text={String.raw`$\varepsilon_r$`} /> чрез капацитета?
            </p>
          </ProblemStatement>
          <Prereq links={[LESSON.dielectrics]} />
          <Solution
            hint={
              <RichText text="При едните молекули полето индуцира дипол, а при другите само подрежда частично вече съществуващи диполи. И в двата случая резултатът е подредба по посока на полето." />
            }
          >
            <SolutionPart label="a" title="Двата механизма">
              <p>
                При неполярна молекула външното поле леко измества положителния и отрицателния
                заряд в противоположни посоки и така индуцира диполен момент. При полярна молекула
                постоянен диполен момент вече съществува, но хаотичното топлинно движение пречи на
                пълното му подреждане. Полето създава само частична ориентация.
              </p>
            </SolutionPart>

            <SolutionPart label="b" title="Защо полето отслабва">
              <p>
                Подредените диполи сочат по посока на външното поле. Собственото поле на един
                дипол в пространството между двата му заряда обаче е насочено срещу неговия
                момент, тоест срещу външното поле.
              </p>
              <p>
                Сборът от полетата на всички подредени диполи затова е противоположен на
                външното. Резултантното поле в материала намалява и това е причината същото
                напрежение да задържа повече заряд.
              </p>
            </SolutionPart>

            <SolutionPart label="c" title="Определение на проницаемостта">
              <p>При напълно запълнен кондензатор със същата геометрия</p>
              <Formula latex={String.raw`C=\varepsilon_rC_0,\qquad \boxed{\varepsilon_r=\frac{C}{C_0}}`} />
            </SolutionPart>
          </Solution>
        </QuestionCard>

        <QuestionCard code="T6" title="Изолиран кондензатор или свързан към батерия">
          <ProblemStatement>
            <p>
              Плосък кондензатор е зареден и <strong>изолиран</strong>. В него се вкарва
              диелектрична пластина. Как се изменят{" "}
              <RichText text={String.raw`$Q$, $E$, $\Delta V$, $C$`} /> и енергията{" "}
              <RichText text="$U$" />? Отговорете на същия въпрос, ако кондензаторът остане
              свързан към батерия.
            </p>
          </ProblemStatement>
          <Prereq links={[LESSON.dielectrics, LESSON.capacitors]} />
          <Solution
            hint={<RichText text="Решете първо коя величина е фиксирана във всеки от двата случая. Всичко останало следва от нея." />}
          >
            <SolutionPart label="a" title="Общото за двата случая">
              <p>
                След вкарването капацитетът винаги става{" "}
                <RichText text={String.raw`$C'=\varepsilon_rC_0$`} />. Това е чиста геометрия и
                свойство на материала. Останалите величини зависят от това коя от тях е закрепена.
              </p>
            </SolutionPart>

            <SolutionPart label="b" title="Изолиран кондензатор">
              <p>
                Зарядът няма къде да отиде, затова <RichText text="$Q$" /> е фиксиран. Свързаните
                заряди отслабват полето <RichText text={String.raw`$\varepsilon_r$`} /> пъти, с
                него намалява и напрежението. Енергията е
              </p>
              <Formula latex={String.raw`U=\frac{Q^2}{2C}\ \longrightarrow\ \frac{U_0}{\varepsilon_r}`} />
              <p>Загубената енергия отива в работата, с която пластината се втегля навътре.</p>
            </SolutionPart>

            <SolutionPart label="c" title="Свързан към батерия">
              <p>
                Сега напрежението е фиксирано, следователно{" "}
                <RichText text={String.raw`$E=\Delta V/d$`} /> остава същото, а батерията доставя
                допълнителен заряд. Тогава
              </p>
              <Formula latex={String.raw`U=\tfrac12C(\Delta V)^2\ \longrightarrow\ \varepsilon_rU_0`} />
              <p>Енергията нараства, въпреки че полето остава същото.</p>
            </SolutionPart>

            <SolutionPart label="d" title="Двата случая едно до друго">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[430px] border-collapse text-[14.5px]">
                  <thead>
                    <tr className="border-b-[1.5px] border-ink text-left">
                      <th className="py-2 pr-3 font-bold">Случай</th>
                      <th className="py-2 pr-3 font-bold">
                        <RichText text="$Q'$" />
                      </th>
                      <th className="py-2 pr-3 font-bold">
                        <RichText text="$E'$" />
                      </th>
                      <th className="py-2 pr-3 font-bold">
                        <RichText text={String.raw`$\Delta V'$`} />
                      </th>
                      <th className="py-2 pr-3 font-bold">
                        <RichText text="$C'$" />
                      </th>
                      <th className="py-2 font-bold">
                        <RichText text="$U'$" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="tabular-nums">
                    <tr className="border-b border-rule">
                      <td className="py-2 pr-3">изолиран</td>
                      <td className="py-2 pr-3">
                        <RichText text="$Q_0$" />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$E_0/\varepsilon_r$`} />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$\Delta V_0/\varepsilon_r$`} />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$\varepsilon_rC_0$`} />
                      </td>
                      <td className="py-2">
                        <RichText text={String.raw`$U_0/\varepsilon_r$`} />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-3">към батерия</td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$\varepsilon_rQ_0$`} />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text="$E_0$" />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$\Delta V_0$`} />
                      </td>
                      <td className="py-2 pr-3">
                        <RichText text={String.raw`$\varepsilon_rC_0$`} />
                      </td>
                      <td className="py-2">
                        <RichText text={String.raw`$\varepsilon_rU_0$`} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ResultBox>
                Един и същ диелектрик, една и съща геометрия, а енергията веднъж намалява и веднъж
                нараства. Първият въпрос при всяка такава задача е коя величина е закрепена.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>
      </Section>

      <Section id="earnshaw" n="§4" title="Защо неподвижни заряди не могат да задържат заряд">
        <QuestionCard code="T7" title="Теорема на Ърншоу">
          <ProblemStatement>
            <p>
              Обяснете защо в празна област потенциалът не може да има нито локален максимум, нито
              локален минимум. Какъв извод следва оттук за възможността заряд да бъде задържан
              устойчиво само чрез неподвижни заряди?
            </p>
          </ProblemStatement>
          <Prereq
            links={[LESSON.potential]}
            note="Въпросът ползва вторите производни на потенциала и закона на Гаус в диференциална форма. Урок по темата предстои; дотогава всичко нужно се извежда в самото решение."
          />

          <Solution
            hint={
              <RichText text="Помислете за минимум по всяка ос поотделно, както при обикновена функция на една променлива. После сравнете какво искат трите условия с това, което законът на Гаус казва за сбора на същите три втори производни." />
            }
          >
            <SolutionPart label="a" title="Условието за равновесие">
              <p>
                Върху заряд <RichText text="$q$" /> в точка{" "}
                <RichText text={String.raw`$\vec r_0$`} /> действа сила{" "}
                <RichText text={String.raw`$\vec F=q\vec E=-q\nabla V$`} />. Равновесие означава
                нулева сила, тоест
              </p>
              <Formula
                latex={String.raw`\left.\frac{\partial V}{\partial x}\right|_{\vec r_0}
                =\left.\frac{\partial V}{\partial y}\right|_{\vec r_0}
                =\left.\frac{\partial V}{\partial z}\right|_{\vec r_0}=0`}
              />
              <p>
                Това е само равновесие. Дали то е устойчиво, решават вторите производни.
              </p>
            </SolutionPart>

            <SolutionPart label="b" title="Условието за устойчивост">
              <p>
                Устойчиво равновесие означава, че при малко отместване се появява връщаща сила,
                тоест потенциалната енергия <RichText text="$U=qV$" /> расте. Достатъчно е да
                проверим поотделно по трите оси.
              </p>
              <p>
                Ако замразим <RichText text="$y$" /> и <RichText text="$z$" /> и мръднем само по{" "}
                <RichText text="$x$" />, оставаме с обикновена функция на една променлива. За неин
                минимум са нужни точно двете познати условия: първата производна е нула (това вече
                го имаме от подточка а) и втората производна е положителна.
              </p>
              <p>
                Същото важи и по другите две оси. За положителен заряд устойчивостта изисква и
                трите условия едновременно:
              </p>
              <Formula
                latex={String.raw`\frac{\partial^2V}{\partial x^2}>0,\qquad
                \frac{\partial^2V}{\partial y^2}>0,\qquad
                \frac{\partial^2V}{\partial z^2}>0`}
              />
              <p>
                Ако някоя от трите е отрицателна, по тази ос има максимум вместо минимум и зарядът
                се изплъзва натам.
              </p>
            </SolutionPart>

            <SolutionPart label="c" title="Какво казва законът на Гаус за същите производни">
              <p>
                В празна област <RichText text={String.raw`$\rho=0$`} />, следователно{" "}
                <RichText text={String.raw`$\nabla\cdot\vec E=0$`} />. Замествайки{" "}
                <RichText text={String.raw`$\vec E=-\nabla V$`} />, получаваме точно сбора на трите
                втори производни:
              </p>
              <Formula
                latex={String.raw`\nabla^2V
                =\frac{\partial^2V}{\partial x^2}
                +\frac{\partial^2V}{\partial y^2}
                +\frac{\partial^2V}{\partial z^2}=0`}
              />
            </SolutionPart>

            <SolutionPart label="d" title="Противоречието">
              <p>
                Подточка б) иска три положителни числа. Подточка в) казва, че сборът им е нула. Три
                положителни числа никога не дават сбор нула, затова поне едно от тях е отрицателно
                или нула. И двата случая убиват устойчивостта:
              </p>
              <ul className="list-disc space-y-1.5 pl-6">
                <li>
                  отрицателно означава, че по тази ос има максимум и зарядът си тръгва при
                  най-малкото побутване;
                </li>
                <li>
                  нула означава, че по тази ос потенциалът е плосък и връщаща сила просто няма.
                </li>
              </ul>
              <p>
                За <RichText text="$q<0$" /> всички знаци се обръщат и разсъждението е дословно
                същото.
              </p>
              <FigurePanel
                eyebrow="Схема към решението"
                title="Сборът на вторите производни е нула"
                caption={
                  <>
                    Вляво: през една и съща точка потенциалът може да извива нагоре по едната ос и
                    надолу по другата, защото трите извивки трябва да се съберат до нула. Вдясно:
                    затова всяка точка в празно пространство е седло, а не яма.
                  </>
                }
              >
                <EarnshawSaddleFigure />
              </FigurePanel>
            </SolutionPart>

            <SolutionPart label="e" title="Изводът">
              <p>
                Няма точка в празна област, около която потенциалната енергия да расте във всички
                посоки. Следователно потенциалът няма нито локален минимум, нито локален максимум
                там, а само седлови точки.
              </p>
              <ResultBox>
                Заряд не може да бъде задържан устойчиво само от неподвижни електрични заряди. Това
                е теоремата на Ърншоу. Реалните капани нарушават някое от условията ѝ: използват
                променливи във времето полета, диамагнетизъм или активна обратна връзка.
              </ResultBox>
            </SolutionPart>
          </Solution>
        </QuestionCard>
      </Section>

      {/* ─────────────────────────  Част II  ───────────────────────── */}

      <Section id="sphere" n="§5" title="Задача 1: сфера с растяща плътност">
        <ProblemStatement>
          <p>
            Непроводяща сфера с радиус <RichText text="$R$" /> е заредена с обемна плътност, която
            расте линейно от центъра навън:
          </p>
          <Formula latex={String.raw`\rho(r)=\rho_0\frac rR,\qquad r\le R`} />
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>
              Намерете пълния заряд <RichText text="$Q$" /> на сферата.
            </li>
            <li>
              Изведете <RichText text="$E(r)$" /> за <RichText text="$r<R$" /> и за{" "}
              <RichText text="$r>R$" /> и проверете, че двата израза съвпадат при{" "}
              <RichText text="$r=R$" />.
            </li>
            <li>
              Намерете потенциала в центъра <RichText text="$V(0)$" />, ако{" "}
              <RichText text={String.raw`$V(\infty)=0$`} />.
            </li>
            <li>
              Като използвате <RichText text={String.raw`$U=\frac{\varepsilon_0}2\int E^2\,dV$`} />,
              покажете, че пълната електростатична енергия е{" "}
              <RichText text={String.raw`$U=Q^2/7\pi\varepsilon_0R$`} />.
            </li>
          </ol>
        </ProblemStatement>
        <Prereq
          links={[LESSON.conductors, LESSON.capacitors]}
          note="Законът на Гаус и плътността на енергията $u=\varepsilon_0E^2/2$ са в уроците. Урок за интегрирането по сферични слоеве предстои."
        />

        <div className="mt-6">
          <FigurePanel
            title="Плътността расте навън"
            caption={
              <>
                Един тънък слой с дебелина <RichText text="$dr$" /> има лице{" "}
                <RichText text={String.raw`$4\pi r^2$`} />, но и плътност, пропорционална на{" "}
                <RichText text="$r$" />. Затова зарядът на слоя расте като{" "}
                <RichText text="$r^3$" />, а обхванатият заряд като{" "}
                <RichText text="$r^4$" />. Точно тази четвърта степен обяснява защо полето вътре
                расте, вместо да спада.
              </>
            }
          >
            <SphereDensityFigure />
          </FigurePanel>
        </div>

        <div className="mt-6">
          <PredictionQuestion
            prompt="Как се променя полето вътре в сферата, докато се движим от центъра към повърхността?"
            options={[
              {
                text: "Расте, защото обхванатият заряд расте по-бързо от лицето на гаусовата сфера",
                correct: true,
                why: String.raw`$Q_{\text{вътр}}\propto r^4$, а лицето е $4\pi r^2$. Отношението дава $E\propto r^2$.`,
              },
              {
                text: String.raw`Спада като $1/r^2$, както при точков заряд`,
                correct: false,
                why: String.raw`Този закон важи само вън от разпределението, където гаусовата сфера огражда целия заряд.`,
              },
              {
                text: "Остава постоянно, както между плочите на кондензатор",
                correct: false,
                why: "Постоянно поле дава равномерно заредена равнина, а не сферично разпределение.",
              },
              {
                text: "Расте линейно, както при равномерно заредена сфера",
                correct: false,
                why: String.raw`Линейният закон следва от постоянна $\rho$. Тук плътността сама расте с $r$ и добавя още една степен.`,
              },
            ]}
            explanation={String.raw`Полето вътре не се определя от целия заряд, а само от този под гаусовата повърхност. Затова начинът, по който зарядът е разпределен, се вижда точно във вътрешната област.`}
          />
        </div>

        <Solution
          hint={
            <RichText text="Работете със сферични слоеве с обем $dV=4\pi r^2\,dr$. За потенциала в центъра интегрирайте полето от $0$ до $\infty$ и разделете интеграла при $r=R$." />
          }
        >
          <SolutionPart label="a" title="Пълен заряд">
            <Formula
              latex={String.raw`Q=\int_0^R\rho(r)\,4\pi r^2\,dr
              =\frac{4\pi\rho_0}{R}\int_0^Rr^3\,dr
              =\frac{4\pi\rho_0}{R}\frac{R^4}{4}`}
            />
            <Formula latex={String.raw`\boxed{Q=\pi\rho_0R^3}`} />
          </SolutionPart>

          <SolutionPart label="b" title="Поле вътре и вън">
            <p>
              За гаусова сфера с радиус <RichText text="$r<R$" /> обграденият заряд е
            </p>
            <Formula
              latex={String.raw`Q_{\text{вътр}}(r)=\frac{4\pi\rho_0}{R}\int_0^rs^3\,ds
              =\frac{\pi\rho_0r^4}{R}=Q\frac{r^4}{R^4}`}
            />
            <p>
              По симетрия полето е радиално и постоянно по големина върху гаусовата сфера, затова{" "}
              <RichText text={String.raw`$E(r)\,4\pi r^2=Q_{\text{вътр}}(r)/\varepsilon_0$`} /> и
            </p>
            <Formula
              latex={String.raw`\vec E(r)=
              \begin{cases}
              \dfrac{Q\,r^2}{4\pi\varepsilon_0R^4}\,\hat r, & r<R,\\[2ex]
              \dfrac{Q}{4\pi\varepsilon_0r^2}\,\hat r, & r>R.
              \end{cases}`}
            />
            <p>
              При <RichText text="$r=R$" /> и двата израза дават{" "}
              <RichText text={String.raw`$E(R)=Q/4\pi\varepsilon_0R^2$`} />, тоест нормалната
              компонента е непрекъсната. Това е очаквано: при <RichText text="$r=R$" /> няма
              отделен безкрайно тънък слой с повърхностен заряд.
            </p>
            <div className="mt-4">
              <ChargedSphereLab />
            </div>
          </SolutionPart>

          <SolutionPart label="c" title="Потенциал в центъра">
            <p>
              При <RichText text={String.raw`$V(\infty)=0$`} /> потенциалът в центъра е работата на
              полето по целия път навън:
            </p>
            <Formula
              latex={String.raw`V(0)=\int_0^\infty E(s)\,ds
              =\int_0^RE_{\text{вътре}}(s)\,ds+\int_R^\infty E_{\text{вън}}(s)\,ds`}
            />
            <Formula
              latex={String.raw`\int_0^R\frac{Qs^2}{4\pi\varepsilon_0R^4}\,ds=\frac{Q}{12\pi\varepsilon_0R},
              \qquad
              \int_R^\infty\frac{Q}{4\pi\varepsilon_0s^2}\,ds=\frac{Q}{4\pi\varepsilon_0R}`}
            />
            <Formula latex={String.raw`\boxed{V(0)=\frac{Q}{3\pi\varepsilon_0R}=\frac{\rho_0R^2}{3\varepsilon_0}}`} />
            <p>За проверка целият вътрешен потенциал може да се запише като</p>
            <Formula latex={String.raw`V(r)=\frac{Q}{12\pi\varepsilon_0R}\left(4-\frac{r^3}{R^3}\right),\qquad r\le R`} />
          </SolutionPart>

          <SolutionPart label="d" title="Енергия на полето">
            <p>Разделяме интеграла на вътрешна и външна област:</p>
            <Formula
              latex={String.raw`U_{\text{вътр}}=\frac{\varepsilon_0}2\,4\pi\int_0^R
              \left(\frac{Qr^2}{4\pi\varepsilon_0R^4}\right)^2r^2\,dr
              =\frac{Q^2}{56\pi\varepsilon_0R}`}
            />
            <p>
              защото <RichText text={String.raw`$\int_0^Rr^6\,dr=R^7/7$`} />. Отвън
            </p>
            <Formula
              latex={String.raw`U_{\text{вън}}=\frac{\varepsilon_0}2\,4\pi\int_R^\infty
              \left(\frac{Q}{4\pi\varepsilon_0r^2}\right)^2r^2\,dr
              =\frac{Q^2}{8\pi\varepsilon_0R}`}
            />
            <Formula
              latex={String.raw`U=U_{\text{вътр}}+U_{\text{вън}}
              =\left(\frac1{56}+\frac18\right)\frac{Q^2}{\pi\varepsilon_0R}`}
            />
            <Formula latex={String.raw`\boxed{U=\frac{Q^2}{7\pi\varepsilon_0R}}`} />
            <ResultBox>
              Само една седма от енергията седи вътре в сферата. Полето вън спада бавно и носи
              останалото, макар да изглежда по-слабо.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="disk" n="§6" title="Задача 2: от пръстен до диск">
        <ProblemStatement>
          <p>
            Тънък кръгъл <strong>изолиращ</strong> диск с радиус <RichText text="$R$" /> носи
            равномерно разпределен положителен заряд с повърхностна плътност{" "}
            <RichText text={String.raw`$\sigma$`} />. Разглеждаме точка <RichText text="$P$" /> върху
            оста на диска на разстояние <RichText text="$z>0$" /> от центъра и избираме{" "}
            <RichText text={String.raw`$V(\infty)=0$`} />. Представете си диска като сбор от
            концентрични пръстени с радиус <RichText text="$r$" /> и широчина{" "}
            <RichText text={String.raw`$dr$`} />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>
              Покажете, че зарядът на един тесен пръстен е{" "}
              <RichText text={String.raw`$dq=\sigma2\pi r\,dr$`} />, и запишете приноса му{" "}
              <RichText text={String.raw`$dV$`} /> към потенциала в <RichText text="$P$" />.
              Обяснете защо напречните компоненти на полето се унищожават.
            </li>
            <li>
              Интегрирайте по всички пръстени и намерете <RichText text="$V(z)$" /> и{" "}
              <RichText text={String.raw`$\vec E(z)$`} /> върху оста.
            </li>
            <li>
              Проверете двата гранични случая: <RichText text={String.raw`$z\to0^+$`} /> и{" "}
              <RichText text={String.raw`$z\gg R$`} />. Покажете, че далече дискът се държи като
              точков заряд <RichText text={String.raw`$Q=\pi R^2\sigma$`} />.
            </li>
            <li>
              На какво разстояние <RichText text="$z$" /> полето е два пъти по-слабо от полето
              непосредствено над центъра на диска?
            </li>
          </ol>
        </ProblemStatement>
        <Prereq
          links={[LESSON.potential, LESSON.taylor]}
          note="Суперпозицията и връзката $E=-dV/dz$ са от урока за потенциала, а развитието при $z\gg R$ е от материала за редове на Тейлър. Урок за полето на непрекъснати разпределения предстои."
        />

        <div className="mt-6">
          <FigurePanel
            title="Дискът като сбор от пръстени"
            caption={
              <>
                Всички точки на един пръстен са на едно и също разстояние{" "}
                <RichText text={String.raw`$s=\sqrt{r^2+z^2}$`} /> от <RichText text="$P$" />.
                Точно затова се тръгва от потенциала: той е скалар и приносът на целия пръстен се
                събира наум, без разлагане по компоненти.
              </>
            }
          >
            <DiskRingFigure />
          </FigurePanel>
        </div>

        <Solution
          hint={
            <RichText text="Тръгнете от потенциала, не от полето: така избягвате разлагането по компоненти. Полето се получава накрая чрез $E_z=-dV/dz$." />
          }
        >
          <SolutionPart label="a" title="Един пръстен и ролята на симетрията">
            <p>
              Тесният пръстен с радиус <RichText text="$r$" /> и широчина{" "}
              <RichText text={String.raw`$dr$`} /> има лице{" "}
              <RichText text={String.raw`$dA=2\pi r\,dr$`} />. Понеже плътността е постоянна,
            </p>
            <Formula latex={String.raw`dq=\sigma\,dA=\sigma2\pi r\,dr`} />
            <p>
              Всички елементи на пръстена са на едно и също разстояние{" "}
              <RichText text={String.raw`$s=\sqrt{r^2+z^2}$`} /> от <RichText text="$P$" />, затова
            </p>
            <Formula
              latex={String.raw`dV=\frac1{4\pi\varepsilon_0}\frac{dq}{\sqrt{r^2+z^2}}
              =\frac{\sigma}{2\varepsilon_0}\frac{r\,dr}{\sqrt{r^2+z^2}}`}
            />
            <p>
              За всеки заряд от едната страна на пръстена има диаметрално противоположен заряд.
              Напречните компоненти на полетата им са равни и противоположни и се унищожават.
              Остава само <RichText text={String.raw`$\vec E=E_z\hat z$`} />.
            </p>
          </SolutionPart>

          <SolutionPart label="b" title="Интегриране по всички пръстени">
            <Formula
              latex={String.raw`V(z)=\frac{\sigma}{2\varepsilon_0}\int_0^R\frac{r\,dr}{\sqrt{r^2+z^2}}
              =\frac{\sigma}{2\varepsilon_0}\Big[\sqrt{r^2+z^2}\Big]_0^R`}
            />
            <p>
              Понеже <RichText text="$z>0$" />, имаме{" "}
              <RichText text={String.raw`$\sqrt{z^2}=z$`} /> и
            </p>
            <Formula latex={String.raw`\boxed{V(z)=\frac{\sigma}{2\varepsilon_0}\left(\sqrt{R^2+z^2}-z\right)}`} />
            <p>Полето се получава чрез диференциране:</p>
            <Formula
              latex={String.raw`E_z(z)=-\frac{dV}{dz}
              =\boxed{\frac{\sigma}{2\varepsilon_0}\left(1-\frac{z}{\sqrt{R^2+z^2}}\right)}`}
            />
            <p>
              За <RichText text={String.raw`$\sigma>0$`} /> резултатът е положителен: полето сочи от
              диска навън.
            </p>
          </SolutionPart>

          <SolutionPart label="c" title="Двата гранични случая">
            <p>
              Непосредствено над центъра, <RichText text={String.raw`$z\to0^+$`} />:
            </p>
            <Formula
              latex={String.raw`V(0)=\frac{\sigma R}{2\varepsilon_0},\qquad
              E_z(0^+)=\frac{\sigma}{2\varepsilon_0}`}
            />
            <p>
              Вторият резултат е полето на безкрайна равномерно заредена равнина. Много близо до
              диска неговият край просто не се вижда.
            </p>
            <p>
              За <RichText text={String.raw`$z\gg R$`} /> развиваме корена:
            </p>
            <Formula
              latex={String.raw`\sqrt{z^2+R^2}=z\sqrt{1+\frac{R^2}{z^2}}\approx z+\frac{R^2}{2z}`}
            />
            <Formula
              latex={String.raw`V(z)\approx\frac{\sigma R^2}{4\varepsilon_0z}
              =\frac1{4\pi\varepsilon_0}\frac{\pi R^2\sigma}{z},\qquad
              E_z(z)\approx\frac1{4\pi\varepsilon_0}\frac{Q}{z^2}`}
            />
            <p>
              Отдалече размерът на диска не може да се различи и той се държи като точков заряд{" "}
              <RichText text={String.raw`$Q=\pi R^2\sigma$`} />.
            </p>
            <div className="mt-4">
              <ChargedDiskLab />
            </div>
          </SolutionPart>

          <SolutionPart label="d" title="Къде полето намалява наполовина">
            <p>
              Поставяме <RichText text={String.raw`$E_z(z)=E_z(0^+)/2$`} />:
            </p>
            <Formula
              latex={String.raw`1-\frac{z}{\sqrt{R^2+z^2}}=\frac12
              \quad\Longrightarrow\quad
              \frac{z}{\sqrt{R^2+z^2}}=\frac12`}
            />
            <Formula latex={String.raw`4z^2=R^2+z^2\quad\Longrightarrow\quad 3z^2=R^2`} />
            <Formula latex={String.raw`\boxed{z=\frac{R}{\sqrt3}\approx0{,}577R}`} />
            <ResultBox>
              Половината от полето изчезва още преди да сме се отдалечили на един радиус. Оттам
              нататък дискът бързо престава да прилича на равнина.
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="slab" n="§7" title="Задача 3: диелектрик, вкаран наполовина">
        <ProblemStatement>
          <p>
            В началото кондензаторът е незареден. Той има правоъгълни плочи с дължина{" "}
            <RichText text="$L$" />, широчина <RichText text="$b$" /> и разстояние{" "}
            <RichText text="$d$" /> между тях. Пластина от диелектрик с относителна диелектрична
            проницаемост <RichText text={String.raw`$\varepsilon_r$`} /> е вкарана на дълбочина{" "}
            <RichText text="$x$" />. Ефектите от краищата се пренебрегват.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>
              Обяснете защо двете части (с и без диелектрик) са свързани{" "}
              <strong>успоредно</strong>, и изведете{" "}
              <RichText text={String.raw`$C(x)=\frac{\varepsilon_0b}{d}\left[L+(\varepsilon_r-1)x\right]$`} />
              .
            </li>
            <li>
              Кондензаторът е свързан към източник с постоянно напрежение{" "}
              <RichText text={String.raw`$\Delta V_0$`} />. Намерете енергията на полето{" "}
              <RichText text="$U_E(x)$" /> и заряда <RichText text="$Q(x)$" />.
            </li>
            <li>
              Използвайте енергийния баланс{" "}
              <RichText text={String.raw`$F_x\,dx=dA_{\text{бат}}-dU_E$`} />, за да намерите силата
              върху пластината. Втегля ли се тя навътре, или се изтласква навън?
            </li>
            <li>
              Сега кондензаторът е <strong>изолиран</strong> с постоянен заряд{" "}
              <RichText text="$Q_0$" />. Намерете отново силата и сравнете двата случая: в кой от
              тях силата зависи от <RichText text="$x$" />?
            </li>
          </ol>
        </ProblemStatement>
        <Prereq
          links={[LESSON.dielectrics, LESSON.capacitors]}
          note="Задачата стъпва изцяло на публикувани уроци: частично запълненият кондензатор е в „Диелектрици“ §6, а енергийните баланси в §5."
        />

        <div className="mt-6">
          <FigurePanel
            title="Геометрията на частично запълнения кондензатор"
            caption={
              <>
                Границата между диелектрика и вакуума е успоредна на полето, а не напречна на
                него. Двете области виждат едни и същи плочи и една и съща потенциална разлика.
                Силата не е нарисувана: тя е търсеното в подточки в) и г).
              </>
            }
          >
            <DielectricSlabFigure />
          </FigurePanel>
        </div>

        <div className="mt-6">
          <PredictionQuestion
            prompt="При постоянно напрежение пластината се втегля навътре или се изтласква навън?"
            options={[
              {
                text: "Втегля се навътре, защото капацитетът расте с дълбочината",
                correct: true,
                why: String.raw`$F_x=\tfrac12(\Delta V_0)^2\,dC/dx$, а $dC/dx=\varepsilon_0b(\varepsilon_r-1)/d>0$.`,
              },
              {
                text: "Изтласква се навън, защото енергията на полето расте",
                correct: false,
                why: "Енергията наистина расте, но батерията върши двойно повече работа от този прираст. Излишъкът е точно механичната работа.",
              },
              {
                text: "Не действа сила, защото полето е перпендикулярно на движението",
                correct: false,
                why: "Идеализираното поле е перпендикулярно, но силата идва от разсеяното поле в края на плочите. Енергийният баланс я дава, без то да се смята.",
              },
              {
                text: "Зависи от знака на заряда върху плочите",
                correct: false,
                why: "Свързаните заряди се подреждат според посоката на полето, затова притеглянето е едно и също при двата знака.",
              },
            ]}
            explanation={String.raw`Общото правило: при постоянно напрежение системата се стреми да увеличи капацитета си, защото $U=\tfrac12C(\Delta V)^2$ и батерията плаща двойно.`}
          />
        </div>

        <Solution
          hint={
            <RichText text="Работата на батерията е $dA_{\text{бат}}=\Delta V_0\,dQ$ и тя не е нула. Точно тя прави отговора различен от простото „силата сочи натам, накъдето енергията намалява“." />
          }
        >
          <SolutionPart label="a" title="Еквивалентен капацитет">
            <p>
              Границата между двете области е успоредна на полето. И двете области имат едни и същи
              плочи и една и съща потенциална разлика, затова са свързани успоредно. Площите им са
            </p>
            <Formula latex={String.raw`A_{\text{д}}=bx,\qquad A_{\text{в}}=b(L-x)`} />
            <Formula
              latex={String.raw`C_{\text{д}}=\frac{\varepsilon_0\varepsilon_rbx}{d},\qquad
              C_{\text{в}}=\frac{\varepsilon_0b(L-x)}{d}`}
            />
            <p>При успоредно свързване капацитетите се събират:</p>
            <Formula latex={String.raw`\boxed{C(x)=\frac{\varepsilon_0b}{d}\left[L+(\varepsilon_r-1)x\right]}`} />
            <p>Полезната производна е</p>
            <Formula latex={String.raw`\boxed{\frac{dC}{dx}=\frac{\varepsilon_0b}{d}(\varepsilon_r-1)>0}`} />
          </SolutionPart>

          <SolutionPart label="b" title="При постоянно напрежение">
            <Formula
              latex={String.raw`Q(x)=C(x)\Delta V_0
              =\frac{\varepsilon_0b\Delta V_0}{d}\left[L+(\varepsilon_r-1)x\right]`}
            />
            <Formula
              latex={String.raw`U_E(x)=\tfrac12C(x)(\Delta V_0)^2
              =\frac{\varepsilon_0b(\Delta V_0)^2}{2d}\left[L+(\varepsilon_r-1)x\right]`}
            />
            <p>
              Когато пластината навлиза, батерията доставя допълнителен заряд{" "}
              <RichText text={String.raw`$dQ=\Delta V_0\,dC$`} />.
            </p>
          </SolutionPart>

          <SolutionPart label="c" title="Силата при постоянно напрежение">
            <p>
              За малко преместване <RichText text={String.raw`$dx$`} /> батерията извършва работа
            </p>
            <Formula latex={String.raw`dA_{\text{бат}}=\Delta V_0\,dQ=(\Delta V_0)^2\,dC`} />
            <p>а промяната на енергията на полето е само половината от нея:</p>
            <Formula latex={String.raw`dU_E=\tfrac12(\Delta V_0)^2\,dC`} />
            <p>
              От <RichText text={String.raw`$F_x\,dx=dA_{\text{бат}}-dU_E$`} /> следва
            </p>
            <Formula
              latex={String.raw`\boxed{F_x=\frac12(\Delta V_0)^2\frac{dC}{dx}
              =\frac{\varepsilon_0b(\varepsilon_r-1)}{2d}(\Delta V_0)^2}`}
            />
            <p>
              Силата е положителна по избраната ос: пластината се втегля навътре. В идеалния модел
              тя е постоянна, защото <RichText text={String.raw`$dC/dx$`} /> е постоянна.
            </p>
            <ResultBox>
              Половината от работата на батерията увеличава енергията на полето, а другата половина
              е механичната работа върху пластината. Точно този дележ прави отговора неочакван.
            </ResultBox>
          </SolutionPart>

          <SolutionPart label="d" title="Изолиран кондензатор">
            <p>
              Сега <RichText text="$Q_0$" /> е постоянен и няма работа от батерия. Енергията е
            </p>
            <Formula latex={String.raw`U_E(x)=\frac{Q_0^2}{2C(x)}`} />
            <p>
              При квазистатично движение работата на електричната сила е{" "}
              <RichText text={String.raw`$F_x\,dx=-dU_E$`} />, следователно
            </p>
            <Formula
              latex={String.raw`F_x=-\frac{d}{dx}\left(\frac{Q_0^2}{2C}\right)
              =\frac{Q_0^2}{2C^2}\frac{dC}{dx}`}
            />
            <Formula
              latex={String.raw`\boxed{F_x(x)=\frac{Q_0^2(\varepsilon_r-1)d}
              {2\varepsilon_0b\left[L+(\varepsilon_r-1)x\right]^2}}`}
            />
            <ResultBox>
              Силата пак е навътре, но този път намалява с <RichText text="$x$" />. При постоянно
              напрежение тя не зависи от дълбочината, при постоянен заряд зависи. Една и съща
              геометрия, два различни отговора.
            </ResultBox>
            <div className="mt-4">
              <DielectricSlabLab />
            </div>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="induced" n="§8" title="Задача 4: проводяща сфера във външно поле">
        <ProblemStatement>
          <p>
            Незаредена проводяща сфера с радиус <RichText text="$R$" /> е поставена в първоначално
            еднородно поле <RichText text={String.raw`$\vec E_0=E_0\hat z$`} />. Може да се покаже,
            че потенциалът извън сферата е
          </p>
          <Formula
            latex={String.raw`V(r,\theta)=-E_0\left(r-\frac{R^3}{r^2}\right)\cos\theta,\qquad r\ge R`}
          />
          <p>
            а вътре в нея е постоянен. Ъгълът <RichText text={String.raw`$\theta$`} /> се брои от
            оста <RichText text="$z$" />.
          </p>
          <ol className="list-[lower-alpha] space-y-2 pl-6">
            <li>
              Проверете двете гранични условия: при <RichText text={String.raw`$r\to\infty$`} />{" "}
              полето клони към <RichText text={String.raw`$\vec E_0$`} />, а при{" "}
              <RichText text="$r=R$" /> повърхността е еквипотенциална.
            </li>
            <li>
              Покажете, че вторият член е точно потенциал на дипол в центъра, и намерете
              индуцирания диполен момент <RichText text={String.raw`$\vec p$`} />.
            </li>
            <li>
              Намерете радиалната компонента при <RichText text="$r=R$" /> и оттам повърхностната
              плътност <RichText text={String.raw`$\sigma(\theta)$`} />.
            </li>
            <li>
              Проверете чрез интегриране, че пълният индуциран заряд е нула, и пресметнете диполния
              момент директно от <RichText text={String.raw`$\sigma(\theta)$`} />.
            </li>
            <li>
              В коя точка полето е най-силно и колко пъти надвишава{" "}
              <RichText text="$E_0$" />? Достатъчен ли е този резултат, за да обясни действието на
              гръмоотвода?
            </li>
          </ol>
        </ProblemStatement>
        <Prereq
          links={[LESSON.conductors, LESSON.lightning]}
          note="Граничните условия за проводник са от урока за проводници. Урок за уравнението на Лаплас в сферични координати и за мултиполния език предстои. Подточка д) продължава директно в статията за мълнията."
        />

        <div className="mt-6">
          <FigurePanel
            title="Постановката на задачата"
            caption={
              <>
                Далеч от сферата полето е еднородно и сочи по оста <RichText text="$z$" />.
                Ъгълът <RichText text={String.raw`$\theta$`} /> се брои от тази ос. Плътните жълти
                криви са силовите линии, пунктираните сини са еквипотенциалите. Двете семейства се
                пресичат под прав ъгъл навсякъде, а самата сфера е еквипотенциална.
              </>
            }
            extra={
              <>
                Нищо тук не е рисувано на око. Силовите линии са нивата на{" "}
                <RichText text={String.raw`$\psi=\left(\frac{r^2}2+\frac{R^3}r\right)\sin^2\theta$`} />
                , функцията на тока на сбора „еднородно поле плюс дипол в центъра“, а
                еквипотенциалите излизат направо от{" "}
                <RichText text={String.raw`$r-R^3/r^2=\mathrm{const}/\cos\theta$`} />. Същият
                похват описва и обтичането на сфера от флуид, само че там диполният член влиза с
                обратен знак. Затова при флуида линиите се изтласкват навън, а тук се стесняват към
                сферата и завършват перпендикулярно на нея: на повърхността{" "}
                <RichText text={String.raw`$E_\theta=0$`} />, значи линия не може да се плъзне
                покрай нея. Само тези, минали на повече от{" "}
                <RichText text={String.raw`$\sqrt3\,R$`} /> от оста, се промушват покрай екватора,
                без да я докоснат. Самият индуциран заряд нарочно липсва: той е търсеното в
                подточки в) и г).
              </>
            }
          >
            <SphereInFieldFigure />
          </FigurePanel>
        </div>

        <div className="mt-6">
          <PredictionQuestion
            prompt="Колко пъти полето върху повърхността надвишава външното поле в най-силната точка?"
            options={[
              {
                text: "$3$ пъти",
                correct: true,
                why: String.raw`$E_r(R,\theta)=3E_0\cos\theta$, а максимумът е при полюсите, където $|\cos\theta|=1$.`,
              },
              {
                text: "$2$ пъти",
                correct: false,
                why: String.raw`Множителят $2$ идва от члена $2R^3/r^3$, но към него се добавя и единицата от самото външно поле.`,
              },
              {
                text: "$1$ път, полето остава същото",
                correct: false,
                why: "Индуцираният заряд създава собствено поле и на полюсите то се прибавя към външното, вместо да го компенсира.",
              },
              {
                text: "Неограничено, заради върха на проводника",
                correct: false,
                why: "Сферата има един и същ краен радиус на кривина навсякъде. Неограничено усилване се появява при връх с много малък радиус, не при сфера.",
              },
            ]}
            explanation={String.raw`Числото $3$ е характерно за сферата. За силно издължен проводник усилването се определя от отношението дължина към радиус на кривина и може да е с порядъци по-голямо.`}
          />
        </div>

        <Solution
          hint={
            <RichText text="Разделете потенциала на два члена: външното еднородно поле и коригиращ член. Сравнете втория с $V_{\text{дипол}}=p\cos\theta/4\pi\varepsilon_0r^2$." />
          }
        >
          <SolutionPart label="a" title="Граничните условия">
            <Formula latex={String.raw`V(r,\theta)=-E_0r\cos\theta+E_0\frac{R^3}{r^2}\cos\theta`} />
            <p>
              При <RichText text={String.raw`$r\to\infty$`} /> вторият член намалява като{" "}
              <RichText text="$1/r^2$" /> и остава{" "}
              <RichText text={String.raw`$V\to-E_0r\cos\theta=-E_0z$`} />. Понеже{" "}
              <RichText text={String.raw`$\vec E=-\nabla V$`} />, това е точно еднородното поле{" "}
              <RichText text={String.raw`$\vec E_0=E_0\hat z$`} />.
            </p>
            <p>
              На повърхността <RichText text="$r=R$" />:
            </p>
            <Formula latex={String.raw`V(R,\theta)=-E_0\left(R-\frac{R^3}{R^2}\right)\cos\theta=0`} />
            <p>
              Стойността не зависи от <RichText text={String.raw`$\theta$`} />, следователно
              повърхността е еквипотенциална. Постоянният вътрешен потенциал може да бъде избран
              равен на нула, така че потенциалът е непрекъснат.
            </p>
          </SolutionPart>

          <SolutionPart label="b" title="Индуцираният диполен момент">
            <p>Коригиращият член е</p>
            <Formula latex={String.raw`V_{\text{инд}}=E_0\frac{R^3}{r^2}\cos\theta`} />
            <p>Сравняваме го с потенциала на дипол, насочен по оста:</p>
            <Formula
              latex={String.raw`V_{\text{дипол}}=\frac1{4\pi\varepsilon_0}\frac{p\cos\theta}{r^2}
              \quad\Longrightarrow\quad
              \frac{p}{4\pi\varepsilon_0}=E_0R^3`}
            />
            <Formula latex={String.raw`\boxed{\vec p=4\pi\varepsilon_0E_0R^3\,\hat z}`} />
            <p>
              Сферата не е заредена, но отвън изглежда точно като идеален дипол, поставен в центъра
              ѝ.
            </p>
          </SolutionPart>

          <SolutionPart label="c" title="Поле и повърхностна плътност">
            <Formula
              latex={String.raw`E_r=-\frac{\partial V}{\partial r}
              =E_0\left(1+2\frac{R^3}{r^3}\right)\cos\theta`}
            />
            <p>
              При <RichText text="$r=R$" /> това дава{" "}
              <RichText text={String.raw`$E_r(R,\theta)=3E_0\cos\theta$`} />. Тангенциалната
              компонента е
            </p>
            <Formula
              latex={String.raw`E_\theta=-\frac1r\frac{\partial V}{\partial\theta}
              =-E_0\left(1-\frac{R^3}{r^3}\right)\sin\theta`}
            />
            <p>
              и наистина изчезва при <RichText text="$r=R$" />, както се изисква за проводник.
              Непосредствено отвън <RichText text={String.raw`$E_n=\sigma/\varepsilon_0$`} />, затова
            </p>
            <Formula latex={String.raw`\boxed{\sigma(\theta)=3\varepsilon_0E_0\cos\theta}`} />
            <p>
              Северното полукълбо е положително, южното отрицателно, а на екватора{" "}
              <RichText text={String.raw`$\sigma=0$`} />.
            </p>
            <div className="mt-4">
              <SphereInFieldLab />
            </div>
          </SolutionPart>

          <SolutionPart label="d" title="Пълен заряд и проверка на момента">
            <p>
              С <RichText text={String.raw`$dA=R^2\sin\theta\,d\theta\,d\varphi$`} />:
            </p>
            <Formula
              latex={String.raw`Q_{\text{инд}}=3\varepsilon_0E_0R^2\int_0^{2\pi}d\varphi
              \int_0^\pi\cos\theta\sin\theta\,d\theta=0`}
            />
            <p>
              Това е очаквано: сферата е била незаредена и външното поле само е разделило
              положителния от отрицателния заряд. По симетрия диполният момент е по оста{" "}
              <RichText text="$z$" />:
            </p>
            <Formula
              latex={String.raw`p_z=\int z\,dq=\int (R\cos\theta)\,\sigma(\theta)\,dA
              =3\varepsilon_0E_0R^3\int_0^{2\pi}d\varphi\int_0^\pi\cos^2\theta\sin\theta\,d\theta`}
            />
            <p>
              Ъгловият интеграл е <RichText text={String.raw`$2/3$`} />, затова
            </p>
            <Formula latex={String.raw`p_z=3\varepsilon_0E_0R^3(2\pi)\frac23=4\pi\varepsilon_0E_0R^3`} />
            <p>Съвпада с резултата от подточка б).</p>
          </SolutionPart>

          <SolutionPart label="e" title="Максимално поле и гръмоотводът">
            <p>
              На повърхността тангенциалната компонента е нула, така че{" "}
              <RichText text={String.raw`$|\vec E(R,\theta)|=3E_0|\cos\theta|$`} />. Максимумът е при
              полюсите:
            </p>
            <Formula latex={String.raw`\boxed{E_{\max}=3E_0}`} />
            <p>
              На екватора полето върху повърхността е нула. Сферата обаче има един и същ краен
              радиус на кривина навсякъде и усилването ѝ е ограничено до множител{" "}
              <RichText text="$3$" />. Реалният връх на гръмоотвод е част от силно издължен
              проводник с много малък радиус на кривина. За да остане целият проводник
              еквипотенциален, зарядът се концентрира около върха, а от{" "}
              <RichText text={String.raw`$E_n=\sigma/\varepsilon_0$`} /> следва много голямо локално
              поле.
            </p>
            <ResultBox>
              Множителят <RichText text="$3$" /> не е достатъчен, за да обясни гръмоотвода. Той
              показва посоката на разсъждението: усилването расте, когато радиусът на кривина
              намалява. Същественото е, че гръмоотводът дава на тока надежден път към земята, а не
              че върхът му е остър. Продължението е в{" "}
              <Link href="/statii/malniyata" className="font-bold text-minus hover:underline">
                статията за мълнията
              </Link>
              .
            </ResultBox>
          </SolutionPart>
        </Solution>
      </Section>

      <Section id="recap" n="§9" title="Какво трябва да остане след контролното">
        <div className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-5 text-white shadow-hard">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-hl">Обобщение</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px]">
            <li>
              Интегралната форма на закона на Гаус е инструмент при симетрия, диференциалната е
              самият закон, записан точка по точка.
            </li>
            <li>
              Потенциалът съществува само защото циркулацията на електростатичното поле е нула.
            </li>
            <li>
              Вътре в разпределение полето се определя от обхванатия заряд, затова начинът на
              разпределение се вижда именно там.
            </li>
            <li>
              За непрекъснато разпределение тръгвайте от потенциала: той е скалар и спестява
              разлагането по компоненти.
            </li>
            <li>
              При механична промяна първият въпрос е коя величина е закрепена: зарядът или
              напрежението.
            </li>
            <li>
              Проводник във външно поле се преразпределя така, че повърхността му да остане
              еквипотенциална. Оттам идва и усилването на полето при малък радиус на кривина.
            </li>
            <li>
              В празна област потенциалът няма екстремуми, затова неподвижни заряди не могат да
              задържат заряд устойчиво.
            </li>
          </ul>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-[14.5px] font-semibold">
          <Link href="/zadachi" className="text-minus hover:underline">
            ← Всички задачи
          </Link>
          <Link href="/zadachi/kondenzatori" className="text-minus hover:underline">
            Задачи за кондензатори →
          </Link>
          <Link href="/materiali/elektrichestvo-i-magnetizam" className="text-minus hover:underline">
            Справочникът за преговор →
          </Link>
        </div>
      </Section>
    </main>
  );
}
