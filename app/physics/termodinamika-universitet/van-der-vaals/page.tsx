import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import { Check, Derive, Meaning, Steps } from "@/components/DerivationBlocks";
import JouleThomsonLab from "@/components/interactives/JouleThomsonLab";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import VdwIsothermLab from "@/components/interactives/VdwIsothermLab";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Газът на Ван дер Ваалс докрай · SingularityLab",
  description:
    "Критичната точка, приведеното уравнение и законът за съответните състояния, правилото на равните площи на Максуел, метастабилни състояния и пълната крива на инверсия на Джаул-Томсън, с две симулации.",
};

const raw = String.raw;

const SECTION_NAV = [
  { id: "critical", n: "§1", label: "Критична точка" },
  { id: "reduced", n: "§2", label: "Приведено уравнение" },
  { id: "maxwell", n: "§3", label: "Правило на Максуел" },
  { id: "metastable", n: "§4", label: "Метастабилни" },
  { id: "inversion", n: "§5", label: "Крива на инверсия" },
  { id: "recap", n: "§6", label: "Обобщение" },
] as const;

function P({ text }: { text: string }) {
  return (
    <p className="my-4 text-[16.5px] leading-relaxed text-ink/90">
      <RichText text={text} />
    </p>
  );
}

export default function VanDerWaalsLessonPage() {
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
            Газът на Ван дер Ваалс докрай
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Едно уравнение с две константи крие критична точка, течност, прегрята вода и границата, под
            която газът може да се втечни с вентил
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="critical" n="§1" title="Критичната точка">
          <P text="Досега използвахме уравнението на Ван дер Ваалс като източник на производни. Сега го разглеждаме като крива. Поведението ѝ се сменя качествено: при висока температура изотермата е монотонна, както за идеален газ, а при ниска има максимум и минимум. Между двете има една гранична температура." />

          <div className="my-6">
            <PredictionQuestion
              prompt="На участък от изотермата свиването на газа намалява налягането му, тоест $(\partial p/\partial\nu)_T>0$. Какво значи това физически?"
              options={[
                {
                  text: "Такова състояние не може да се наблюдава: всяко случайно свиване се самоусилва",
                  correct: true,
                  why: raw`Точно така. Там $\kappa_T<0$. Ако малка област случайно се свие, налягането в нея пада и околният газ я натиска още повече. Веществото не остава еднородно, а се разделя на течност и пара.`,
                },
                {
                  text: "Газът става много по-лесно свиваем, но остава еднороден",
                  correct: false,
                  why: raw`Лесно свиваем значи голямо, но **положително** $\kappa_T$. Отрицателна свиваемост не е „много лесно“, а неустойчиво: няма състояние, към което системата да се върне.`,
                },
                {
                  text: "Там газът кондензира и налягането остава постоянно",
                  correct: false,
                  why: raw`Налягането наистина остава постоянно при кондензация, но това е наблюдаваното поведение, а не кривата на модела. Задачата на $\S3$ е да намери точно къде минава хоризонталата, която заменя примката.`,
                },
                {
                  text: "Моделът е грешен и този участък трябва да се изтрие",
                  correct: false,
                  why: raw`Неустойчивият участък наистина не се наблюдава, но съседните на него се наблюдават: прегрята течност и преохладена пара. Примката не е дефект, а съдържа реална физика - $\S4$.`,
                },
              ]}
              explanation="Задръжте този отговор: той ще се окаже причината моделът да описва не само газ, но и течност."
            />
          </div>

          <P text="На граничната изотерма максимумът и минимумът се сливат в точка на инфлексия с хоризонтална допирателна. Това дава две уравнения." />

          <Derive>
            <Steps>
              <>
                <p>
                  Условията са{" "}
                  <RichText text={raw`$(\partial p/\partial\nu)_T=0$`} /> и{" "}
                  <RichText text={raw`$(\partial^2p/\partial\nu^2)_T=0$`} />:
                </p>
                <Formula
                  latex={raw`-\frac{RT}{(\nu-b)^2}+\frac{2a}{\nu^3}=0\ \Longrightarrow\ RT=\frac{2a(\nu-b)^2}{\nu^3}`}
                />
                <Formula
                  latex={raw`\frac{2RT}{(\nu-b)^3}-\frac{6a}{\nu^4}=0\ \Longrightarrow\ RT=\frac{3a(\nu-b)^3}{\nu^4}`}
                />
              </>
              <p>
                Делим първото на второто:{" "}
                <RichText text={raw`$1=\tfrac23\cdot\dfrac{\nu}{\nu-b}$`} />, откъдето{" "}
                <RichText text={raw`$3(\nu-b)=2\nu$`} /> и{" "}
                <RichText text={raw`$\nu_c=3b$`} />.
              </p>
              <p>
                Заместваме в първото:{" "}
                <RichText text={raw`$RT_c=\dfrac{2a\,(2b)^2}{27b^3}=\dfrac{8a}{27b}$`} />.
              </p>
              <p>
                Налягането - от самото уравнение:{" "}
                <RichText
                  text={raw`$p_c=\dfrac{RT_c}{\nu_c-b}-\dfrac{a}{\nu_c^2}=\dfrac{4a-3a}{27b^2}$`}
                />
                .
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`\nu_c=3b,\qquad T_c=\frac{8a}{27Rb},\qquad p_c=\frac{a}{27b^2}`} />

          <P text="Обратната посока е по-полезна: критичната точка се мери лесно, а константите - не. От $T_c/p_c=8b/R$:" />
          <Formula latex={raw`b=\frac{RT_c}{8p_c},\qquad a=27p_cb^2=\frac{27R^2T_c^2}{64\,p_c}`} />

          <Meaning>
            <p>
              Над <RichText text="$T_c$" /> няма разлика между течност и пара - има само едно
              свръхкритично флуидно състояние, колкото и да свиваме. Свръхкритичният въглероден
              диоксид (над <RichText text={raw`$31\,^\circ\mathrm{C}$`} /> и{" "}
              <RichText text={raw`$74\,\mathrm{bar}$`} />) е плътен като течност, но прониква като
              газ; с него се извлича кофеинът от кафето.
            </p>
            <p>
              Обърнатите връзки показват откъде идват табличните{" "}
              <RichText text="$a$" /> и <RichText text="$b$" />: от критичната точка, не от
              микроскопичен модел. Задача 6 го проверява за въглеродния диоксид и разликата е под един
              процент.
            </p>
            <p>
              <strong>Ограничение на модела.</strong>{" "}
              <RichText text={raw`$z_c=p_c\nu_c/(RT_c)=3/8=0{,}375$`} /> за всеки газ на Ван дер
              Ваалс, а реалните газове имат{" "}
              <RichText text={raw`$0{,}23$ - $0{,}29$`} />. Две константи не могат да опишат точно и
              трите критични величини: напасваме{" "}
              <RichText text="$T_c$" /> и <RichText text="$p_c$" />, а{" "}
              <RichText text={raw`$\nu_c$`} /> излиза с около 37 процента грешка.
            </p>
          </Meaning>
        </Section>

        <Section id="reduced" n="§2" title="Приведеното уравнение: всички газове стават един">
          <Derive>
            <Steps>
              <p>
                Мерим всичко в „критични единици“:{" "}
                <RichText text={raw`$p=p_c\,p_r$`} />,{" "}
                <RichText text={raw`$\nu=\nu_c\,\nu_r$`} />,{" "}
                <RichText text={raw`$T=T_c\,T_r$`} />.
              </p>
              <>
                <p>Заместваме критичните стойности в уравнението:</p>
                <Formula
                  latex={raw`\left(\frac{a}{27b^2}\,p_r+\frac{a}{9b^2\nu_r^2}\right)(3b\,\nu_r-b)=R\cdot\frac{8a}{27Rb}\,T_r`}
                />
              </>
              <>
                <p>
                  Изнасяме <RichText text={raw`$\dfrac{a}{27b^2}$`} /> от първата скоба и{" "}
                  <RichText text="$b$" /> от втората:
                </p>
                <Formula
                  latex={raw`\frac{a}{27b^2}\left(p_r+\frac3{\nu_r^2}\right)\cdot b\,(3\nu_r-1)=\frac{8a}{27b}\,T_r`}
                />
              </>
              <p>
                Съкращаваме <RichText text={raw`$\dfrac{a}{27b}$`} /> - и константите изчезват.
              </p>
            </Steps>
          </Derive>
          <Formula
            latex={raw`\left(p_r+\frac3{\nu_r^2}\right)(3\nu_r-1)=8T_r\qquad\Longleftrightarrow\qquad p_r=\frac{8T_r}{3\nu_r-1}-\frac3{\nu_r^2}`}
          />
          <Meaning>
            <p>
              Константите <RichText text="$a$" /> и <RichText text="$b$" /> ги няма. В критични
              единици всички газове на Ван дер Ваалс са един и същ газ. Това е{" "}
              <strong>законът за съответните състояния</strong>: две вещества при еднакви{" "}
              <RichText text="$T_r$" /> и <RichText text="$p_r$" /> имат еднакво{" "}
              <RichText text={raw`$\nu_r$`} />.
            </p>
            <p>
              Реалните газове го следват приблизително: азот и въглероден диоксид при{" "}
              <RichText text={raw`$T_r=0{,}9$`} /> имат близки приведени налягания на насищане,
              въпреки че абсолютните им температури се различават повече от два пъти. Затова
              инженерите имат една обща диаграма за много вещества, вместо по една за всяко.
            </p>
            <p>
              И за нас има практическа полза: всички сметки и симулации по-долу могат да се направят
              веднъж, в приведени единици, и после да се преведат за конкретен газ.
            </p>
          </Meaning>
        </Section>

        <Section id="maxwell" n="§3" title="Правилото на равните площи">
          <P text="Под критичната температура изотермата има участък с $(\partial p/\partial\nu)_T>0$ - неустойчивият участък от въпроса в $\S1$. Наблюдава се не той, а хоризонтала: налягането на насищане, при което течност и пара съществуват заедно. Къде точно минава тази хоризонтала?" />
          <P text="Отговорът идва от потенциала на Гибс. В съвместно съществуване двете фази имат една и съща температура, едно и също налягане и **еднакъв** $g$." />

          <Derive title="Извод: правило на Максуел">
            <Steps>
              <p>
                Вървим по теоретичната изотерма от течността (
                <RichText text={raw`$\nu_l$`} />) до парата (<RichText text={raw`$\nu_v$`} />),
                минавайки през примката. Търсим условието{" "}
                <RichText text="$g_v=g_l$" />.
              </p>
              <>
                <p>
                  При <RichText text={raw`$T=\text{const}$`} /> от{" "}
                  <RichText text={raw`$dg=-s\,dT+\nu\,dp$`} /> остава{" "}
                  <RichText text={raw`$dg=\nu\,dp$`} />, значи
                </p>
                <Formula latex={raw`0=g_v-g_l=\int_l^v\nu\,dp`} />
              </>
              <>
                <p>Интегрираме по части:</p>
                <Formula
                  latex={raw`\int_l^v\nu\,dp=\big[p\nu\big]_l^v-\int_{\nu_l}^{\nu_v}p\,d\nu=p_s(\nu_v-\nu_l)-\int_{\nu_l}^{\nu_v}p\,d\nu`}
                />
              </>
              <p>Приравняваме на нула.</p>
            </Steps>
          </Derive>
          <Formula latex={raw`\int_{\nu_l}^{\nu_v}p\,d\nu=p_s\,(\nu_v-\nu_l)`} />
          <P text="Лицето под примката е равно на лицето на правоъгълника под хоризонталата. Оттук следва и геометричният прочит: **площта на примката над линията е равна на площта под нея** - затова правилото се нарича правило на равните площи." />

          <Derive title="Какво точно смята симулацията">
            <Steps>
              <>
                <p>За приведеното уравнение интегралът е елементарен:</p>
                <Formula
                  latex={raw`\int p_r\,d\nu_r=\frac{8T_r}{3}\ln(3\nu_r-1)+\frac3{\nu_r}+\text{const}`}
                />
              </>
              <p>
                За дадено <RichText text="$p_s$" /> се намират най-малкият и най-големият корен на{" "}
                <RichText text="$p_r(\nu_r)=p_s$" /> и се проверява равенството. Налягането се мени,
                докато двете площи се изравнят - това е числена конструкция на Максуел.
              </p>
              <>
                <p>
                  Границата на метастабилните участъци (<strong>спинодалата</strong>) е там, където{" "}
                  <RichText text={raw`$(\partial p_r/\partial\nu_r)_T=0$`} />:
                </p>
                <Formula
                  latex={raw`T_r=\frac{(3\nu_r-1)^2}{4\nu_r^3}\quad\Longrightarrow\quad p_r^{\text{спин}}=\frac{3\nu_r-2}{\nu_r^3}`}
                />
              </>
              <p>
                Границата на съвместното съществуване (<strong>бинодалата</strong>) е множеството от
                точки <RichText text={raw`$(\nu_l,p_s)$`} /> и{" "}
                <RichText text={raw`$(\nu_v,p_s)$`} /> за всички температури.
              </p>
            </Steps>
          </Derive>

          <div className="my-7">
            <VdwIsothermLab />
          </div>

          <TeacherNote>
            <p>
              Поискайте от ученика да намери температурата, при която минимумът на изотермата пада под
              нулата (
              <RichText text={raw`$T_r=27/32\approx0{,}844$`} />
              ). Плъзгачът го показва веднага и въвежда темата за отрицателно налягане в течност.
            </p>
            <p>
              Втора задача за плъзгача: да се намери температурата, при която{" "}
              <RichText text={raw`$\nu_v/\nu_l$`} /> стане около 10. Това е нагледна мярка за
              „колко по-рядка е парата от течността“ и показва как разликата изчезва към критичната
              точка.
            </p>
          </TeacherNote>
        </Section>

        <Section id="metastable" n="§4" title="Прекъснатите участъци са истински">
          <P text="Правилото на Максуел казва какво се наблюдава при равновесие. Но между бинодалата и спинодалата има състояния, които се наблюдават, макар да не са равновесни - достатъчно е да липсват зародиши." />
          <ul className="my-5 space-y-3 text-[16px] leading-relaxed text-ink/90">
            <li>
              <strong>Прегрята течност.</strong> Течност над точката на кипене, която още не е кипнала.
              Така водата в чиста гладка чаша в микровълновата може внезапно да изкипи - задача 7
              пресмята докъде стига това по модела. Мехурчестата камера на Глейзър (1952) използва
              точно прегрята течност: частиците оставят следа от мехурчета.
            </li>
            <li>
              <strong>Преохладена пара.</strong> Пара под точката на кондензация. В камерата на Уилсън
              (1911) по следите на частиците се образуват капчици - същият механизъм, обърнат.
            </li>
            <li>
              <strong>Отрицателно налягане.</strong> При{" "}
              <RichText text={raw`$T_r<27/32$`} /> минимумът на изотермата пада под нулата: течността
              може да бъде опъната. Водата в съдовете на високите дървета е под опън и така се изтегля
              нагоре, без помпа.
            </li>
            <li>
              <strong>Неустойчивият участък</strong> между двата върха никога не се наблюдава: там{" "}
              <RichText text={raw`$\kappa_T<0$`} /> и най-малката флуктуация разцепва веществото.
            </li>
          </ul>
          <Meaning>
            <p>
              Това е най-силният аргумент, че уравнението на Ван дер Ваалс е повече от поправка към
              идеалния газ. Две константи, напаснати по критичната точка, предсказват съществуването
              на течност, на граница между фазите, на прегряване и на опънната вода. Нито едно от тези
              неща не е вложено в модела.
            </p>
          </Meaning>
        </Section>

        <Section id="inversion" n="§5" title="Кривата на инверсия на Джаул-Томсън">
          <P text="В предишния урок намерихме, че $\mu$ сменя знака при $T_{\text{инв}}=2a/(Rb)$, но само в границата $p\to0$. Сега имаме критичната точка и можем да намерим цялата крива." />
          <Derive>
            <Steps>
              <>
                <p>
                  Търсим <RichText text={raw`$\mu=0$`} />, тоест{" "}
                  <RichText text={raw`$T(\partial\nu/\partial T)_p=\nu$`} />. Заместваме
                  производната от цикличното правило:
                </p>
                <Formula
                  latex={raw`\frac{TR}{\nu-b}=\nu\left[\frac{RT}{(\nu-b)^2}-\frac{2a}{\nu^3}\right]`}
                />
              </>
              <>
                <p>
                  Събираме членовете с <RichText text="$RT$" />; в скобата остава{" "}
                  <RichText text="$-b$" />:
                </p>
                <Formula
                  latex={raw`\frac{RT\,[(\nu-b)-\nu]}{(\nu-b)^2}=-\frac{2a}{\nu^2}\quad\Longrightarrow\quad T_{\text{инв}}=\frac{2a}{Rb}\left(1-\frac{b}{\nu}\right)^{\!2}`}
                />
              </>
              <>
                <p>Налягането в същата точка идва от уравнението на състоянието:</p>
                <Formula
                  latex={raw`p_{\text{инв}}=\frac{RT_{\text{инв}}}{\nu-b}-\frac{a}{\nu^2}=\frac{a}{\nu^2}\left(\frac{2\nu}{b}-3\right)`}
                />
              </>
              <p>
                Въвеждаме <RichText text={raw`$x=b/\nu$`} /> и делим на критичните стойности.
              </p>
            </Steps>
          </Derive>
          <Formula latex={raw`T_r=\frac{27}4\,(1-x)^2,\qquad p_r=27\,x\,(2-3x),\qquad 0\le x\le\tfrac23`} />
          <Check title="Трите характерни точки">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <RichText text={raw`$x\to0$`} /> (разреден газ):{" "}
                <RichText text={raw`$T_r=27/4=6{,}75$`} /> и{" "}
                <RichText text={raw`$p_r=0$`} />. Това е{" "}
                <RichText text={raw`$T_{\text{инв}}=2a/(Rb)$`} /> от предишния урок - двата резултата
                се съгласуват.
              </li>
              <li>
                <RichText text={raw`$x=1/3$`} />: максималното налягане{" "}
                <RichText text={raw`$p_r=9$`} /> при <RichText text="$T_r=3$" />. Над{" "}
                <RichText text={raw`$9p_c$`} /> газът никога не изстива при дроселиране, каквато и да
                е температурата.
              </li>
              <li>
                <RichText text={raw`$x=2/3$`} />:{" "}
                <RichText text={raw`$T_r=3/4$`} /> и <RichText text={raw`$p_r=0$`} /> - долният край
                откъм течността.
              </li>
            </ul>
          </Check>

          <div className="my-7">
            <JouleThomsonLab />
          </div>

          <Meaning>
            <p>
              За да се втечни газ с дросел, той трябва да започне вътре в кривата. За азота горната
              температура на инверсия е <RichText text={raw`$6{,}75\cdot126\approx850\,\mathrm{K}$`} />{" "}
              по модела (измерено:{" "}
              <RichText text={raw`$621\,\mathrm{K}$`} />) - стайната температура е дълбоко вътре и
              машината на Линде работи направо. За водорода моделът дава около{" "}
              <RichText text={raw`$224\,\mathrm{K}$`} /> (измерено:{" "}
              <RichText text={raw`$202\,\mathrm{K}$`} />), за хелия - около{" "}
              <RichText text={raw`$35\,\mathrm{K}$`} /> (измерено: около{" "}
              <RichText text={raw`$51\,\mathrm{K}$`} />).
            </p>
            <p>
              Затова водородът първо се охлажда с течен азот, а хелият - с течен водород. Моделът дава
              вярната картина и верния ред на газовете, но числата са приблизителни: за хелия
              подценява, за азота надценява. Задача 8 пресмята колко азот наистина се втечнява.
            </p>
          </Meaning>

          <TeacherNote>
            <p>
              Изберете хелий в симулацията: стайната температура изобщо не влиза в графиката.
              Това обяснява по-добре от всякакъв текст защо хелият се втечнява последен в историята
              (1908 г., Камерлинг-Онес) и защо е нужна каскада.
            </p>
          </TeacherNote>
        </Section>

        <Section id="recap" n="§6" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2.5 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>
                Критичната точка е точка на инфлексия с хоризонтална допирателна:{" "}
                <RichText text={raw`$\nu_c=3b$`} />,{" "}
                <RichText text={raw`$T_c=8a/(27Rb)$`} />,{" "}
                <RichText text={raw`$p_c=a/(27b^2)$`} />. Оттам идват табличните константи.
              </li>
              <li>
                В критични единици уравнението не съдържа{" "}
                <RichText text="$a$" /> и <RichText text="$b$" />: всички газове на Ван дер Ваалс са
                един газ. Цената е{" "}
                <RichText text={raw`$z_c=3/8$`} /> за всички, докато реалните имат около{" "}
                <RichText text={raw`$0{,}27$`} />.
              </li>
              <li>
                Хоризонталата на насищане се намира от{" "}
                <RichText text={raw`$g_l=g_v$`} />, което дава правилото на равните площи.
              </li>
              <li>
                Между бинодалата и спинодалата живеят прегрятата течност и преохладената пара -
                реални състояния, на които работят мехурчестата камера и камерата на Уилсън. Между
                двата върха <RichText text={raw`$\kappa_T<0$`} /> и състояние няма.
              </li>
              <li>
                Кривата на инверсия{" "}
                <RichText text={raw`$T_r=\tfrac{27}4(1-x)^2$`} />,{" "}
                <RichText text={raw`$p_r=27x(2-3x)$`} /> огражда областта, в която дроселирането
                охлажда. Над <RichText text={raw`$9p_c$`} /> такава област няма.
              </li>
            </ul>
          </div>
          <p className="mt-5 text-[16px] leading-relaxed text-ink/90">
            <strong>Следващ урок:</strong>{" "}
            <Link
              href="/physics/termodinamika-universitet/mashini"
              className="font-semibold text-minus hover:underline"
            >
              Топлинни и хладилни машини
            </Link>{" "}
            - там изводите няма да използват никакво уравнение на състоянието, а само двата принципа.
            Затова границите ще важат еднакво за пара, за идеален газ и за агента в кухненския
            хладилник.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
