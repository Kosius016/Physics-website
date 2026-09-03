import Link from "next/link";
import { Children } from "react";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import FluxExplorer from "@/components/interactives/FluxExplorer";
import GeneratorEMF from "@/components/interactives/GeneratorEMF";
import ElectromagneticMachine3D from "@/components/interactives/ElectromagneticMachine3D";
import FaradayDiagram, { type FaradayDiagramKind } from "@/components/interactives/FaradayDiagram";
import { MagnetCoilLab, MagnetRingLab, SlidingRodLab } from "@/components/interactives/InductionLabs";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import { TeacherModeProvider, TeacherModeToggle, TeacherNote } from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Законът на Фарадей — индукция от променящ се поток · SingularityLab",
  description:
    "Как променящото се магнитно поле поражда ЕДН и ток без батерия: закон на Фарадей, двигателно ЕДН, закон на Ленц, индуцирани полета, генератори, двигатели и вихрови токове.",
};

const SECTION_NAV = [
  { id: "faraday", n: "§1", label: "Фарадей" },
  { id: "motional", n: "§2", label: "Двигателно ЕДН" },
  { id: "lenz", n: "§3", label: "Ленц" },
  { id: "field", n: "§4", label: "Вихрово поле" },
  { id: "generators", n: "§5", label: "Генератори" },
  { id: "eddy", n: "§6", label: "Вихрови токове" },
  { id: "recap", n: "§7", label: "Обобщение" },
] as const;

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[16px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

/**
 * Визуалните блокове излизат от текстовата колона навътре в дясното поле на
 * страницата, за да са едри на голям екран. Отстъпите са с ~80 px запас
 * спрямо свободното поле при 1280 px и 1536 px, за да няма хоризонтален скрол.
 */
const BLEED = "xl:-mr-[11rem] 2xl:-mr-[19rem]";

/** Самостоятелен интерактив/фигура на пълна ширина, изнесен в полето. */
function Wide({ children }: { children: React.ReactNode }) {
  return <div className={BLEED}>{children}</div>;
}

function Example({
  tag,
  title,
  visual,
  visualCaption,
  children,
}: {
  tag: string;
  title: string;
  visual?: FaradayDiagramKind;
  visualCaption?: string;
  children: React.ReactNode;
}) {
  const parts = Children.toArray(children);

  return (
    <div className={`my-6 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard ${visual ? BLEED : ""}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">{tag}</p>
      <h3 className="mt-1 mb-3 font-serif text-[21px] font-bold text-ink">{title}</h3>
      {visual ? (
        <>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_300px] md:items-start lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_460px] 2xl:grid-cols-[minmax(0,1fr)_580px]">
            <div className="space-y-3 text-[16px] leading-relaxed text-ink/90">{parts[0]}</div>
            <div className="order-first md:order-last">
              <FaradayDiagram kind={visual} caption={visualCaption} />
            </div>
          </div>
          <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-ink/90">{parts.slice(1)}</div>
        </>
      ) : (
        <div className="space-y-3 text-[16px] leading-relaxed text-ink/90">{children}</div>
      )}
    </div>
  );
}

function AppBox({
  title,
  visual,
  visualCaption,
  children,
}: {
  title: string;
  visual: FaradayDiagramKind;
  visualCaption?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`my-5 rounded-[10px] border-[1.5px] border-rule bg-paper px-5 py-4 ${BLEED}`}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_310px] md:items-start lg:grid-cols-[minmax(0,1fr)_430px] xl:grid-cols-[minmax(0,1fr)_500px] 2xl:grid-cols-[minmax(0,1fr)_620px]">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-plus">Приложение</p>
          <h3 className="mt-1 mb-2 font-serif text-[19px] font-bold text-ink">{title}</h3>
          <div className="space-y-3 text-[15.5px] leading-relaxed text-ink/90">{children}</div>
        </div>
        <FaradayDiagram kind={visual} caption={visualCaption} />
      </div>
    </div>
  );
}

export default function FaradayLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav aria-label="Път до урока" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.22em] text-muted">
            <Link href="/physics" className="rounded-sm transition-colors hover:text-minus">Физика</Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics?level=university#magnetism" className="rounded-sm transition-colors hover:text-minus">Магнетизъм</Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(32px,6.5vw,46px)] leading-[1.08] font-bold text-ink">
            Законът на Фарадей: индукция от променящ се поток
          </h1>
          <p className="text-[17px] leading-relaxed text-muted">
            Досега зарядите създаваха полета в покой или чрез постоянни токове. Тук е новото:
            когато магнитното поле <strong className="text-ink">се променя с времето</strong>, то
            може да задвижи заряди — да породи ЕДН и ток — без никаква батерия.
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <div className="space-y-3 pt-8 text-[17px] leading-relaxed text-ink/90">
          <p>
            През <strong>1831 г.</strong> Майкъл Фарадей в Англия и независимо от него Джоузеф
            Хенри в САЩ откриват, че <strong>ЕДН може да бъде индуцирано в контур от променящо
            се магнитно поле</strong>. От този закон следва, че ЕДН — а значи и ток — може да
            възникне във всеки процес, при който магнитният поток се променя.
          </p>
          <p>
            Ще използваме няколко термина последователно: <strong>ЕДН</strong> (електродвижещо
            напрежение), <strong>индуцирано ЕДН</strong> и <strong>индуциран ток</strong>,{" "}
            <strong>магнитен поток</strong>, <strong>двигателно ЕДН</strong>,{" "}
            <strong>обратно ЕДН</strong> и <strong>вихрови токове</strong>.
          </p>
        </div>

        <Section id="faraday" n="§1" title="Закон на Фарадей за електромагнитната индукция">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Представете си контур от проводяща жица, свързан към чувствителен амперметър. Няма
              батерия. Приближаваме магнит: стрелката се отклонява — тече ток. Магнитът стои
              неподвижно близо до контура: <strong>ток няма</strong>, макар през контура да минава
              поле. Отдалечаваме магнита: стрелката се отклонява в <strong>обратната</strong>
              посока. Държим магнита неподвижен, но движим контура: пак има ток.
            </p>
            <p>
              Изводът: амперметърът реагира на <strong>относителното движение</strong>. Ток има
              винаги, когато магнитът и контурът се движат един спрямо друг — и то без никаква
              батерия. Токът наричаме <strong>индуциран</strong>, а причината за него —{" "}
              <strong>индуцирано ЕДН</strong>.
            </p>
            <Callout>
              Не е достатъчно през контура да <em>минава</em> поле. Не е достатъчно потокът дори да
              е <em>ненулев</em>. Необходимо е потокът да <strong>се променя с времето</strong>.
              Неподвижен магнит вътре в контура дава голям, но постоянен поток — и ток няма.
            </Callout>
            <p>
              Опитът на Фарадей с две намотки около общ железен пръстен показва същото. Двете
              намотки не са свързани с проводник. В мига на <strong>затваряне</strong> на ключа
              във вторичната се появява ток и бързо изчезва; при <strong>отваряне</strong> — ток в
              обратна посока. Докато през първичната тече <strong>постоянен</strong> ток,
              вторичната мълчи. Само докато полето през вторичната се <strong>променя</strong>,
              в нея тече ток.
            </p>
          </div>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Магнитен поток</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>За да формулираме закона количествено, ни трябва магнитният поток през повърхнина, ограничена от контура:</p>
            <Formula latex={String.raw`\Phi_B=\int_S \vec{B}\cdot d\vec{A}`} />
            <p>
              Скаларното произведение отчита само съставката на полето,{" "}
              <strong>перпендикулярна на повърхнината</strong> — само тя „минава през“ контура. За
              равномерно поле и плоска площ <RichText text="$A$" /> под ъгъл{" "}
              <RichText text="$\theta$" /> между <RichText text="$\vec B$" /> и нормалата:
            </p>
            <Formula latex={String.raw`\Phi_B=BA\cos\theta`} />
            <p>
              При <RichText text="$\theta=0$" /> (поле перпендикулярно на равнината на контура)
              потокът е максимален; при <RichText text="$\theta=90^\circ$" /> полето лежи в
              равнината и <RichText text="$\Phi_B=0$" />. Единицата за поток, която използваме, е{" "}
              <RichText text="$\mathrm{T\,m^2}$" />.
            </p>
          </div>

          <div className={`mt-6 ${BLEED}`}>
            <FluxExplorer />
          </div>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Живият опит на Фарадей</h3>
          <p className="text-[16px] leading-relaxed text-ink/90">
            Натиснете „Приближи“ или „Отдалечи“ и следете стрелката на галванометъра. Тя се отклонява
            само докато магнитът се движи — посоката се обръща при обръщане на движението.
          </p>
          <Wide><MagnetCoilLab /></Wide>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Формулировка на закона</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              <strong>Индуцираното ЕДН е равно на скоростта на изменение на магнитния поток,
              взета с отрицателен знак:</strong>
            </p>
            <Formula latex={String.raw`\mathcal{E}=-\frac{d\Phi_B}{dt}\qquad(31.1)`} />
            <p>
              За намотка от <RichText text="$N$" /> навивки всяка навивка „вижда“ същия променящ се
              поток, а навивките са свързани последователно — затова ЕДН-тата се събират:
            </p>
            <Formula latex={String.raw`\mathcal{E}=-N\frac{d\Phi_B}{dt}\qquad(31.2)`} />
            <p>
              Отрицателният знак носи физичен смисъл: индуцираното ЕДН се противопоставя на
              промяната на потока. Пълното обяснение идва от закона на Ленц (§3); дотогава работим
              с модула <RichText text="$|\mathcal{E}|$" />.
            </p>
          </div>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Трите начина да промениш потока</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>Замествайки <RichText text="$\Phi_B=BA\cos\theta$" />, за един контур:</p>
            <Formula latex={String.raw`\mathcal{E}=-\frac{d}{dt}\big(BA\cos\theta\big)\qquad(31.3)`} />
            <ul className="list-disc space-y-1.5 pl-6">
              <li>промяна на <strong>големината <RichText text="$B$" /></strong> (опитът с намотките);</li>
              <li>промяна на <strong>площта <RichText text="$A$" /></strong> (плъзгащата пръчка в §2);</li>
              <li>промяна на <strong>ъгъла <RichText text="$\theta$" /></strong> (генераторът в §5);</li>
              <li>всяка комбинация от трите.</li>
            </ul>
            <p>Обединяващата идея: няма значение <strong>как</strong> променяш потока — важно е че го променяш.</p>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Кръгъл контур е в равномерно поле, с равнина перпендикулярна на силовите линии. Кое НЯМА да индуцира ток?"
              options={[
                { text: "Смачкване на контура (мени площта)", correct: false },
                { text: "Въртене около ос, перпендикулярна на линиите (мени ъгъла)", correct: false },
                { text: "Преместване встрани, без завъртане, в равномерното поле", correct: true },
                { text: "Изваждане на контура от полето", correct: false },
              ]}
              explanation={String.raw`В равномерно поле преместването встрани не мени нито $B$, нито $A$, нито $\theta$ — потокът е постоянен и ток няма. Смачкването мени $A$, въртенето мени $\theta$, изваждането намалява площта в полето — и трите дават ток.`}
            />
          </div>

          <TeacherNote>
            <p><RichText text="$\Phi_B=BA\cos\theta$" />: разигравайте всяка от опциите и питайте „кой от трите множителя се мени?“. Целта е ученикът да свикне да разлага потока, вместо да помни отговори наизуст.</p>
          </TeacherNote>

          <AppBox title="Дефектнотокова защита (GFI)" visual="gfi" visualCaption="Двата еднакви противоположни тока взаимно унищожават потока. Утечката нарушава равновесието.">
            <p>
              През железен пръстен минават два проводника — единият носи тока към уреда, другият го
              връща. Около пръстена е навита сензорна намотка.
            </p>
            <p>
              При изправна работа двата тока са равни и противоположни → полетата им се компенсират
              → потокът през сензора е нула. При <strong>утечка</strong> (например намокрен уред)
              токовете вече не са равни → появява се ненулево поле. Понеже битовият ток е{" "}
              <strong>променлив</strong>, този поток се мени във времето → индуцира се ЕДН, което
              задейства прекъсвач, преди токът да стане опасен.
            </p>
          </AppBox>

          <AppBox title="Адаптер (пикъп) на електрическа китара" visual="pickup" visualCaption="Струната не докосва намотката — движението ѝ променя магнитния поток и създава сигнал.">
            <p>
              Под всяка метална струна има намотка с постоянен магнит. Магнитът намагнитва парчето
              струна над него. Когато струната <strong>вибрира</strong>, намагнитеното парче се
              движи → потокът през намотката се мени → индуцира се напрежение → усилвател →
              високоговорител. Звукът на електрическата китара е буквално „закон на Фарадей на живо“.
            </p>
          </AppBox>

          <Example tag="Пример 31.1" title="Индуциране на ЕДН в намотка" visual="coil-emf" visualCaption="Полето е перпендикулярно на всяка от 200-те квадратни навивки.">
            <p>
              Намотка от <RichText text="$N=200$" /> навивки, всяка квадрат със страна{" "}
              <RichText text="$d=0{,}18\ \mathrm{m}$" />. Перпендикулярно поле расте линейно от 0 до{" "}
              <RichText text="$0{,}50\ \mathrm{T}$" /> за <RichText text="$\Delta t=0{,}80\ \mathrm{s}$" />.
              Мени се само <RichText text="$B$" /> (<RichText text="$\cos\theta=1$" />):
            </p>
            <Formula latex={String.raw`|\mathcal{E}|=N\frac{\Delta(BA)}{\Delta t}=Nd^2\frac{B_f-B_i}{\Delta t}=(200)(0{,}18)^2\frac{0{,}50}{0{,}80}\approx 4{,}0\ \mathrm{V}`} />
            <p>
              Резултатът е сравним с батерия — толкова силна индукция дава дори умерено поле при
              много навивки. Проверка на единиците:{" "}
              <RichText text="$[\mathrm{T\cdot m^2/s}]=[\mathrm V]$" />. ✓
            </p>
            <Callout>
              <strong>Ами токът?</strong> Ако краищата не са свързани в затворена верига — токът е{" "}
              <strong>нула</strong>: зарядите нямат път. При съпротивление{" "}
              <RichText text="$R=2{,}0\ \Omega$" /> обаче{" "}
              <RichText text="$I=\mathcal{E}/R=2{,}0\ \mathrm{A}$" />. ЕДН е причината, но токът
              изисква затворен контур.
            </Callout>
          </Example>

          <Example tag="Пример 31.2" title="Експоненциално намаляващо поле" visual="exponential" visualCaption="И полето, и модулът на ЕДН затихват експоненциално.">
            <p>
              Един контур с площ <RichText text="$A$" /> е в перпендикулярно поле{" "}
              <RichText text="$B=B_{\max}e^{-\alpha t}$" />. Мени се само <RichText text="$B$" />, но
              вече не линейно — трябва производна:
            </p>
            <Formula latex={String.raw`\mathcal{E}=-\frac{d}{dt}\big(AB_{\max}e^{-\alpha t}\big)=\alpha AB_{\max}\,e^{-\alpha t}`} />
            <p>
              Максимумът е при <RichText text="$t=0$" />: <RichText text="$\mathcal{E}_{\max}=\alpha AB_{\max}$" />.
              ЕДН затихва със същата скорост като полето — графиките на <RichText text="$B(t)$" /> и{" "}
              <RichText text="$\mathcal{E}(t)$" /> имат еднаква форма, защото производната на
              експонентата е пропорционална на самата нея.
            </p>
          </Example>
        </Section>

        <Section id="motional" n="§2" title="Двигателно ЕДН">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Досега контурът беше неподвижен, а полето се менеше. Сега — обратното: проводник,{" "}
              <strong>който се движи</strong> в постоянно поле. Възникващото ЕДН наричаме{" "}
              <strong>двигателно</strong>.
            </p>
            <p>
              Права пръчка с дължина <RichText text="$\ell$" /> се движи със скорост{" "}
              <RichText text="$\vec v$" /> през поле <RichText text="$\vec B$" /> (навътре в
              страницата), перпендикулярно на движението. Всеки свободен заряд изпитва магнитна сила:
            </p>
            <Formula latex={String.raw`\vec{F}_B=q\vec{v}\times\vec{B}`} />
            <p>
              Силата е по дължината на пръчката и избутва електроните към единия край. Там се
              натрупва отрицателен заряд, отсреща — положителен. Разделянето създава вътрешно
              електрично поле, което расте, докато уравновеси магнитната сила:{" "}
              <RichText text="$qE=qvB\Rightarrow E=vB$" />. Разликата в потенциала между краищата:
            </p>
            <Formula latex={String.raw`\Delta V=E\ell=B\ell v\qquad(31.4)`} />
            <p>
              По-висок потенциал има краят, към който отива положителният заряд. Полярността може да
              се определи по посоката, в която <RichText text="$\vec v\times\vec B$" /> избутва
              електроните, или по силата върху пробен положителен заряд — двата метода винаги
              съвпадат.
            </p>
            <Callout>
              <strong>При обръщане:</strong> сменяме само <RichText text="$\vec v$" /> → полярността
              се обръща; сменяме само <RichText text="$\vec B$" /> → обръща се; сменяме{" "}
              <strong>и двете</strong> → двете обръщания се компенсират и полярността остава същата.
            </Callout>
          </div>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Плъзгаща пръчка върху две релси</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Сега пръчката е част от затворена верига: плъзга се със скорост{" "}
              <RichText text="$\vec v$" /> по две релси, затворени с резистор <RichText text="$R$" />,
              в поле навътре в страницата. Зарядите обикалят затворения път → тече ток. Причината е
              промяната на <strong>площта</strong>. Ако <RichText text="$x$" /> е положението на
              пръчката, <RichText text="$\Phi_B=B\ell x$" /> и понеже{" "}
              <RichText text="$dx/dt=v$" />:
            </p>
            <Formula latex={String.raw`|\mathcal{E}|=\left|\frac{d\Phi_B}{dt}\right|=B\ell\frac{dx}{dt}=B\ell v\qquad(31.5)`} />
            <Formula latex={String.raw`I=\frac{|\mathcal{E}|}{R}=\frac{B\ell v}{R}\qquad(31.6)`} />
            <p>
              Същият израз <RichText text="$B\ell v$" /> както при единичната пръчка — но сега вече
              има реален ток. Посоката му следва от закона на Ленц (§3): движение надясно → площта и
              потокът навътре растат → индуцираният ток тече <strong>обратно на часовниковата
              стрелка</strong>, за да създаде поле навън и да се противопостави.
            </p>
          </div>

          <Wide><SlidingRodLab /></Wide>

          <TeacherNote title="Диагностични въпроси за плъзгащата пръчка">
            <p><strong>Преди да пуснете симулацията:</strong> „Кой множител във <RichText text="$\Phi_B=B\ell x$" /> се мени и защо?“</p>
            <p className="mt-2"><strong>Честа грешка:</strong> учениците казват, че всяко движение в поле поражда ток. Нека спрат пръчката в средата: полето остава, но <RichText text="$d\Phi_B/dt=0$" />, следователно ток няма.</p>
          </TeacherNote>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Откъде идва енергията</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Няма батерия — енергията идва от <strong>механичната работа</strong> на външния агент,
              който движи пръчката. През пръчката тече ток <RichText text="$I$" /> в поле{" "}
              <RichText text="$B$" />, затова върху нея действа магнитна сила{" "}
              <RichText text="$F_B=I\ell B=B^2\ell^2v/R$" />, насочена <strong>срещу
              движението</strong>. Ако беше по посока на движението, пръчката щеше да ускорява и
              да набира енергия от нищото — невъзможно. Мощностите се изравняват:
            </p>
            <Formula latex={String.raw`P_{\text{мех}}=F_{app}v=\frac{B^2\ell^2v^2}{R}=I^2R=\frac{\mathcal{E}^2}{R}\qquad(31.7)`} />
            <p>Вложената механична мощност точно се равнява на топлината в резистора. Енергия нито се губи, нито се появява — само се преобразува.</p>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Сила $F_{app}$ дава постоянна скорост $v$ и мощност $P$. Увеличаваме силата така, че скоростта се удвоява до $2v$. Новата сила и мощност?"
              options={[
                { text: "$2F$ и $4P$", correct: true },
                { text: "$2F$ и $2P$", correct: false },
                { text: "$4F$ и $2P$", correct: false },
                { text: "$4F$ и $4P$", correct: false },
              ]}
              explanation={String.raw`Силата $F_B\propto v$ → удвоява се ($2F$). Мощността $P\propto v^2$ → учетворява се ($4P$). Логично: $P=Fv$, а тук и $F$, и $v$ се удвояват, значи $2\times2=4$.`}
            />
          </div>

          <Example tag="Пример 31.3" title="Свободно движеща се пръчка" visual="sliding-rod" visualCaption="Токът през подвижната пръчка създава сила, насочена срещу скоростта.">
            <p>
              Пръчка с маса <RichText text="$m$" /> се движи без триене по релси в поле{" "}
              <RichText text="$B$" />, пусната с начална скорост <RichText text="$v_i$" /> при{" "}
              <RichText text="$t=0$" />, без външна сила. Единствената хоризонтална сила е магнитната
              (спъва движението):
            </p>
            <Formula latex={String.raw`m\frac{dv}{dt}=-I\ell B=-\frac{B^2\ell^2}{R}\,v`} />
            <p>Разделяме променливите и интегрираме с <RichText text="$v=v_i$" /> при <RichText text="$t=0$" />:</p>
            <Formula latex={String.raw`v(t)=v_i\,e^{-t/\tau},\qquad \tau=\frac{mR}{B^2\ell^2}`} />
            <p>
              <RichText text="$\tau$" /> е времето, за което скоростта пада{" "}
              <RichText text="$e$" /> пъти. Голяма маса или голямо <RichText text="$R$" /> →{" "}
              бавно спиране; силно поле или дълга пръчка → бързо спиране. Същото уравнение излиза и
              от енергийния баланс <RichText text="$I^2R=-\tfrac{d}{dt}(\tfrac12 mv^2)$" />.
            </p>
            <p>Пръчката теоретично не спира напълно, но изминава крайно разстояние:</p>
            <Formula latex={String.raw`x_{\max}=\int_0^\infty v_i e^{-t/\tau}\,dt=v_i\tau=\frac{mRv_i}{B^2\ell^2}`} />
            <Callout>
              За да увеличим разстоянието: удвояване на <RichText text="$v_i$" /> или на{" "}
              <RichText text="$R$" /> го удвоява, но намаляване на <RichText text="$B$" /> наполовина
              го прави <strong>четири пъти</strong> по-голямо — защото <RichText text="$B$" /> влиза
              на квадрат (веднъж в тока <RichText text="$\propto B$" />, веднъж в силата{" "}
              <RichText text="$\propto B$" />).
            </Callout>
          </Example>

          <Example tag="Пример 31.4" title="Въртяща се проводяща пръчка" visual="rotating-rod" visualCaption="Колкото по-далеч е точката от оста, толкова по-голяма е нейната линейна скорост.">
            <p>
              Пръчка с дължина <RichText text="$\ell$" /> се върти с ъглова скорост{" "}
              <RichText text="$\omega$" /> около единия си край в перпендикулярно поле. Различните ѝ
              точки имат различна скорост, затова я делим на елементи <RichText text="$dr$" />; всеки
              е малка движеща се пръчка и приносите им се събират (последователно):
            </p>
            <Formula latex={String.raw`\mathcal{E}=\int_0^\ell B\,v(r)\,dr=\int_0^\ell B\omega r\,dr=\tfrac{1}{2}B\omega\ell^2`} />
            <p>
              Зависимостта от <RichText text="$\ell$" /> е <strong>квадратична</strong>: по-дългата
              пръчка има повече елементи и външните се движат по-бързо (<RichText text="$v=\omega r$" />).
              Затова удвояване на <RichText text="$\ell$" /> учетворява ЕДН, докато удвояване на{" "}
              <RichText text="$B$" /> или <RichText text="$\omega$" /> само го удвоява.
            </p>
            <Callout>
              <strong>Виенското колело като генератор?</strong> С{" "}
              <RichText text="$B\approx0{,}5\times10^{-4}\ \mathrm{T}$" />,{" "}
              <RichText text="$\ell\sim10\ \mathrm{m}$" />, <RichText text="$\omega\sim1\ \mathrm{s^{-1}}$" />:{" "}
              <RichText text="$\mathcal{E}=\tfrac12 B\omega\ell^2\approx2{,}5\ \mathrm{mV}$" /> — само
              миливолт, далеч под нужното за лампа. А и спицата в поле изпитва спирачна сила, тъй че
              двигателят на колелото пак ще плаща енергията. Безплатна енергия няма.
            </Callout>
          </Example>
        </Section>

        <Section id="lenz" n="§3" title="Закон на Ленц">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>Отрицателният знак у Фарадей има физичен смисъл, изразен от закона на Ленц:</p>
            <Callout>
              Индуцираният ток е насочен така, че полето, което той създава, да се{" "}
              <strong>противопоставя на промяната</strong> на магнитния поток през контура.
            </Callout>
            <p>
              Тънкост: токът се противопоставя на <strong>промяната на потока</strong>, не на самото
              поле. Ако потокът <strong>расте</strong>, токът създава поле в обратна посока; ако{" "}
              <strong>намалява</strong>, токът създава поле в същата посока, за да го „подкрепи“.
              Токът винаги се опитва да запази първоначалния поток.
            </p>
            <p><strong>Алгоритъм за посоката на индуцирания ток:</strong></p>
            <ol className="list-decimal space-y-1.5 pl-6">
              <li>определи посоката на <strong>външното</strong> поле;</li>
              <li>установи дали потокът <strong>расте или намалява</strong>;</li>
              <li>определи посоката на <strong>индуцираното поле</strong> (обратно на външното при растеж; същото при намаление);</li>
              <li>приложи <strong>правилото на дясната ръка</strong> за посоката на тока.</li>
            </ol>
          </div>

          <Wide><MagnetRingLab /></Wide>

          <TeacherNote title="Диагностични въпроси за закона на Ленц">
            <p>Попитайте първо: „Какво се променя — посоката на полето или големината на потока?“ Едва след това: „Какво поле трябва да създаде пръстенът?“</p>
            <p className="mt-2"><strong>Честа грешка:</strong> „Ленц казва, че системата винаги отблъсква.“ Не — при отдалечаване пръстенът привлича магнита, защото се противопоставя на <em>намаляването</em> на потока.</p>
          </TeacherNote>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Защо е точно така: запазване на енергията</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Да допуснем обратното. Пръчката получава тласък надясно и (уж) се появява ток, чиято
              магнитна сила е <strong>по посока</strong> на движението. Тогава силата ускорява
              пръчката → площта расте по-бързо → токът расте → силата расте → скоростта расте... —
              положителна обратна връзка, която набира енергия <strong>без източник</strong>. Това
              нарушава запазването на енергията. Следователно силата задължително спъва движението —
              точно както казва Ленц. Законът на Ленц е <strong>следствие</strong> от запазването на
              енергията.
            </p>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Метален пръстен приближава магнит с северния му полюс. Как реагира пръстенът?"
              options={[
                { text: "Отблъсква магнита (лицето срещу него става северен полюс)", correct: true },
                { text: "Привлича магнита (лицето срещу него става южен полюс)", correct: false },
                { text: "Не реагира — няма ток", correct: false },
              ]}
              explanation="Приближаването увеличава потока през пръстена. По Ленц индуцираният ток създава поле, което се противопоставя — обърнатото към магнита лице става северен полюс и еднаквите полюси се отблъскват. При отдалечаване е обратното: потокът намалява, лицето става южен полюс и пръстенът привлича магнита. Пръстенът винаги се противи на промяната."
            />
          </div>

          <Example tag="Концептуален пример 31.6" title="Контур, минаващ през полева област" visual="field-region" visualCaption="ЕДН има само при влизане и излизане — когато припокритата площ се изменя.">
            <p>
              Правоъгълен контур (страни <RichText text="$\ell$" /> и <RichText text="$w$" />) се
              движи с постоянна скорост <RichText text="$v$" /> надясно през област с поле навътре в
              страницата, широка <RichText text="$3w$" />.
            </p>
            <p>
              <strong>Поток.</strong> Преди влизане: нула. При влизане: расте линейно. Изцяло вътре:{" "}
              постоянен (максимален, <RichText text="$B\ell w$" />). При излизане: намалява до нула.
              Графиката е трапец.
            </p>
            <p>
              <strong>ЕДН.</strong> Импулс <RichText text="$-B\ell v$" /> при влизане, <strong>нула
              на платото</strong> (потокът е постоянен!), импулс <RichText text="$+B\ell v$" /> с
              обратен знак при излизане. Ключово: докато контурът е изцяло в равномерното поле,{" "}
              двигателните ЕДН на двете напречни страни се компенсират.
            </p>
            <Callout>
              Двигателно ЕДН може да е <strong>нула дори при движение през полето</strong> — то се
              индуцира само когато потокът се изменя във времето. Механична мощност се харчи само при
              влизане и излизане.
            </Callout>
          </Example>
        </Section>

        <Section id="field" n="§4" title="Индуцирано ЕДН и електрични полета">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Досега казвахме „в проводника се индуцира ток“. По-дълбоката истина:{" "}
              <strong>променящото се магнитно поле създава електрично поле в самото пространство</strong> —
              дори там, където няма проводник. Проводникът само ни позволява да го наблюдаваме.
            </p>
            <p>
              Това индуцирано поле е <strong>принципно различно</strong> от електростатичното.
              Електростатичното е консервативно — линиите му тръгват от + и свършват на − заряди,
              описва се с потенциал, а работата по затворен контур е нула. Индуцираното е{" "}
              <strong>вихрово и неконсервативно</strong> — линиите му са <strong>затворени
              примки</strong>, а работата по затворен контур не е нула.
            </p>
            <p>
              За кръгъл контур с радиус <RichText text="$r$" /> в менящо се поле работата на
              електричната сила по обиколката е <RichText text="$qE(2\pi r)=q\mathcal{E}$" />, откъдето:
            </p>
            <Formula latex={String.raw`E=\frac{1}{2\pi r}\left|\frac{d\Phi_B}{dt}\right|=\frac{r}{2}\left|\frac{dB}{dt}\right|\qquad(31.8)`} />
            <p>Най-общата (интегрална) форма на закона на Фарадей замества ЕДН с интеграла на полето по контура:</p>
            <Formula latex={String.raw`\oint_C \vec{E}\cdot d\vec{l}=-\frac{d\Phi_B}{dt}\qquad(31.9)`} />
            <Callout>
              За индуцираното поле <RichText text="$\oint\vec E\cdot d\vec l\neq0$" />, докато за
              всяко електростатично поле този интеграл е нула. Затова индуцираното поле не може
              глобално да се опише с обикновен потенциал. Освен това <strong>то съществува и там,
              където самото <RichText text="$\vec B$" /> е нула</strong> — стига да „обхваща“ променящ се поток.
            </Callout>
            <p className="text-[15.5px] text-muted">
              Локалният еквивалент на (31.9) е една от уравненията на Максуел,{" "}
              <RichText text="$\nabla\times\vec E=-\partial\vec B/\partial t$" />: завихреността на{" "}
              <RichText text="$\vec E$" /> в дадена точка е равна на скоростта на изменение на{" "}
              <RichText text="$\vec B$" /> там. (Допълнение за по-нататък.)
            </p>
          </div>

          <Example tag="Пример 31.7" title="Електрично поле, индуцирано в соленоид" visual="solenoid" visualCaption="Индуцираното електрично поле образува затворени примки и извън соленоида.">
            <p>
              Дълъг соленоид с радиус <RichText text="$R$" /> и <RichText text="$n$" /> навивки на
              метър носи ток <RichText text="$I=I_{\max}\cos\omega t$" />; полето вътре е{" "}
              <RichText text="$B=\mu_0 nI$" />. Избираме кръгов контур с радиус <RichText text="$r$" />.
            </p>
            <p><strong>Извън соленоида</strong> (<RichText text="$r>R$" />): поле има само вътре, затова потокът е през площта <RichText text="$\pi R^2$" />, не <RichText text="$\pi r^2$" />:</p>
            <Formula latex={String.raw`E(2\pi r)=\pi R^2\mu_0 nI_{\max}\omega\sin\omega t\;\Rightarrow\; E=\frac{\mu_0 nI_{\max}\omega R^2}{2r}\sin\omega t`} />
            <p>Амплитудата спада като <RichText text="$1/r$" /> навън.</p>
            <p><strong>Вътре в соленоида</strong> (<RichText text="$r<R$" />): целият кръг е в полето, потокът е <RichText text="$B\pi r^2$" />:</p>
            <Formula latex={String.raw`E=\frac{\mu_0 nI_{\max}\omega}{2}\,r\,\sin\omega t`} />
            <p>
              Вътре <RichText text="$E$" /> расте линейно с <RichText text="$r$" />. Забележете
              фазата: токът и полето са <RichText text="$\propto\cos\omega t$" />, а индуцираното
              поле е <RichText text="$\propto\sin\omega t$" /> — то е максимално точно когато{" "}
              <strong>скоростта на изменение</strong> на тока е максимална.
            </p>
          </Example>
        </Section>

        <Section id="generators" n="§5" title="Генератори и двигатели">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              <strong>Генераторът приема механична енергия и я отдава като електрически ток.</strong>{" "}
              Той не създава енергия — преобразува я. Механичното въртене идва от турбина: падаща вода
              (ВЕЦ), пара от изгаряне (ТЕЦ) или от ядрена реакция (АЕЦ) удря лопатките ѝ, а валът
              върти намотката.
            </p>
            <p>
              Най-простият <strong>генератор за променлив ток</strong> е правоъгълна намотка, въртяна
              с постоянна ъглова скорост в равномерно поле. Ъгълът е <RichText text="$\theta=\omega t$" />,
              потокът през навивка е <RichText text="$\Phi_B=BA\cos\omega t$" />, а ЕДН за{" "}
              <RichText text="$N$" /> навивки:
            </p>
            <Formula latex={String.raw`\mathcal{E}=-N\frac{d\Phi_B}{dt}=NAB\omega\sin\omega t\qquad(31.10)`} />
            <Formula latex={String.raw`\mathcal{E}_{\max}=NAB\omega\qquad(31.11)`} />
            <p>
              Плъзгащите пръстени се въртят с намотката (за да не се усукват изходните проводници), а
              неподвижните четки се плъзгат по тях и поддържат контакт.
            </p>
          </div>

          <div className={`mt-6 ${BLEED}`}>
            <GeneratorEMF />
          </div>

          <Callout>
            <strong>Най-честото объркване:</strong> ЕДН е <strong>нула</strong>, когато потокът е{" "}
            максимален или минимален (наклонът на косинуса там е нула), и <strong>максимално</strong>,
            когато потокът е нула (там косинусът се мени най-бързо). Максимален поток{" "}
            <em>не</em> означава максимално ЕДН — важна е скоростта на изменение.
          </Callout>

          <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Честотата е <RichText text="$\omega=2\pi f$" />: битовият ток е 60 Hz в САЩ и{" "}
              <strong>50 Hz</strong> в Европа (включително България).
            </p>
          </div>

          <div className="mt-6">
            <PredictionQuestion
              prompt="В генератор с намотка от $N$ навивки — кое НЕ увеличава генерираното ЕДН?"
              options={[
                { text: "Жица с по-ниско съпротивление", correct: true },
                { text: "По-бързо въртене (по-голямо $\\omega$)", correct: false },
                { text: "По-силно поле $B$", correct: false },
                { text: "Повече навивки $N$", correct: false },
              ]}
              explanation="От $\mathcal{E}_{\max}=NAB\omega$ следва, че $N$, $B$ и $\omega$ увеличават ЕДН. Съпротивлението не влиза в израза — по-ниско $R$ увеличава тока $I=\mathcal{E}/R$, но не и самото ЕДН."
            />
          </div>

          <Example tag="Пример 31.8" title="ЕДН в генератор" visual="generator-values" visualCaption="Въртящата се намотка непрекъснато променя ъгъла между площта и магнитното поле.">
            <p>
              <RichText text="$N=8$" />, <RichText text="$A=0{,}0900\ \mathrm{m^2}$" />,{" "}
              <RichText text="$R=12{,}0\ \Omega$" />, <RichText text="$B=0{,}500\ \mathrm{T}$" />,{" "}
              <RichText text="$f=60{,}0\ \mathrm{Hz}$" />:
            </p>
            <Formula latex={String.raw`\mathcal{E}_{\max}=NAB(2\pi f)=8(0{,}0900)(0{,}500)(2\pi)(60{,}0)\approx136\ \mathrm{V}`} />
            <Formula latex={String.raw`I_{\max}=\frac{\mathcal{E}_{\max}}{R}=\frac{136}{12{,}0}\approx11{,}3\ \mathrm{A}`} />
            <p className="text-[15.5px] text-muted">
              Това е максималната моментна стойност; средната квадратична, която мери волтметърът, е{" "}
              <RichText text="$\mathcal{E}_{\max}/\sqrt2$" />. При товар през намотката тече ток →
              полето създава противодействащ момент → турбината харчи повече „гориво“. Пак запазване
              на енергията.
            </p>
          </Example>

          <h3 className="mt-8 mb-3 font-serif text-[22px] font-bold text-ink">Генератор за постоянен ток и двигател</h3>
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              <strong>Генераторът за постоянен ток</strong> заменя двата пръстена с{" "}
              <strong>комутатор</strong> (разделен пръстен). Вътре в намотката ЕДН остава променливо,
              но комутаторът сменя четките на всеки половин оборот и „изправя“ изхода — той е
              еднопосочен, но <strong>пулсиращ</strong>. Много намотки с различни фази изглаждат
              пулсациите до почти постоянно напрежение.
            </p>
            <p>
              <strong>Двигателят е генератор наобратно:</strong> подаден ток → въртящ момент →
              движение. Но докато намотката се върти, тя <strong>сама действа като генератор</strong>{" "}
              и индуцира <strong>обратно ЕДН</strong>, което се противопоставя на захранването:
            </p>
            <Formula latex={String.raw`I=\frac{\mathcal{E}_{\text{захр}}-\mathcal{E}_{\text{обр}}}{R},\qquad \mathcal{E}_{\text{обр}}\propto\omega`} />
            <Callout>
              При <strong>пускане</strong> (<RichText text="$\omega=0$" />) обратно ЕДН няма → токът е
              голям (голям момент, двигателят ускорява). С оборотите обратното ЕДН расте и токът пада.
              При <strong>блокиране</strong> обратното ЕДН изчезва → токът е много голям →{" "}
              <RichText text="$P=I^2R$" /> може да изгори намотката. Затова блокиран двигател опасно
              загрява.
            </Callout>
            <p>
              В <strong>хибридния автомобил</strong> при спиране електродвигателят минава в генераторен
              режим (<strong>регенеративно спиране</strong>) и връща част от кинетичната енергия в
              батерията, вместо тя да се губи като топлина в спирачките.
            </p>
          </div>

          <h3 className="mt-9 mb-3 font-serif text-[22px] font-bold text-ink">3D модел: генератор и двигател</h3>
          <p className="text-[16px] leading-relaxed text-ink/90">
            Превключете режима и завъртете гледната точка с мишка или пръст. Движещите се точки
            показват тока в намотката; при двигателя разделеният комутатор обръща тока на всеки
            половин оборот, за да запази въртящия момент в една посока.
          </p>
          <Wide><ElectromagneticMachine3D /></Wide>

          <Example tag="Пример 31.9" title="Ток в двигател" visual="motor-current" visualCaption="Обратното ЕДН е срещу захранването, затова при въртене токът намалява.">
            <p>
              Двигател с <RichText text="$R=10\ \Omega$" />, захранван с{" "}
              <RichText text="$120\ \mathrm{V}$" />; при максимална скорост обратното ЕДН е{" "}
              <RichText text="$70\ \mathrm{V}$" />.
            </p>
            <p>При включване (<RichText text="$\omega=0$" />, няма обратно ЕДН): <RichText text="$I=120/10=12\ \mathrm{A}$" />.</p>
            <p>При максимална скорост: <RichText text="$I=(120-70)/10=5{,}0\ \mathrm{A}$" /> — значително по-малко.</p>
            <Callout>
              <strong>Блокиран циркуляр:</strong> <RichText text="$\omega=0$" /> → ток{" "}
              <RichText text="$12\ \mathrm{A}$" /> вместо <RichText text="$5{,}0\ \mathrm{A}$" />.
              Отношението на мощностите е{" "}
              <RichText text="$(12/5{,}0)^2=5{,}76$" /> — тоест 576% от нормалната, което е{" "}
              <strong>увеличение с 476%</strong> (внимавайте с процентите!). Тази топлина може да
              повреди намотката.
            </Callout>
          </Example>
        </Section>

        <Section id="eddy" n="§6" title="Вихрови токове">
          <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
            <p>
              Променящ се поток индуцира ЕДН и в <strong>масивно парче метал</strong>, без
              предварителна верига — тогава в обема му текат затворени{" "}
              <strong>вихрови токове</strong>.
            </p>
            <p>
              Плоска медна или алуминиева плоча, люлееща се през област с поле, <strong>бързо
              затихва</strong> — сякаш се движи през нещо гъсто. При влизане потокът расте → вихров
              ток обратно на часовниковата стрелка; при излизане потокът намалява → ток по
              часовниковата стрелка. <strong>И в двата случая</strong> магнитната сила спъва
              движението (иначе плочата би набирала енергия — нарушение на запазването). Кинетичната
              енергия се превръща във <strong>вътрешна</strong>: плочата се нагрява от{" "}
              <RichText text="$I^2R$" />.
            </p>
            <p>
              Ако в плочата се изрежат <strong>прорези</strong>, те прекъсват големите токови контури
              → вихровите токове намаляват → спирането отслабва и плочата се люлее по-свободно.
            </p>
          </div>

          <AppBox title="Електромагнитни спирачки и ламиниране" visual="eddy-brake" visualCaption="Вляво: вихровите токове спират движещия се метал. Вдясно: изолацията между пластините прекъсва големите токови контури.">
            <p>
              Спирачките на метро и влакове разполагат електромагнит близо до стоманените релси;
              относителното движение индуцира вихрови токове, които спъват влака. Силата е{" "}
              <strong>пропорционална на скоростта</strong> — затова спирането е плавно и отслабва при
              забавяне (само по себе си не спира влака напълно).
            </p>
            <p>
              Като загуба вихровите токове са <strong>нежелани</strong> в трансформатори и двигатели.
              Затова сърцевините се <strong>ламинират</strong> — правят се от тънки проводящи пластини
              с изолация помежду им, която прекъсва големите контури и намалява загубите{" "}
              <RichText text="$I^2R$" />.
            </p>
          </AppBox>

          <div className="mt-6">
            <PredictionQuestion
              prompt="Алуминиев лист виси от рамо на везна и минава между полюсите на магнит. Трептенията бързо затихват. Защо?"
              options={[
                { text: "Вихрови токове в листа създават поле, което се противопоставя на движението", correct: true },
                { text: "Алуминият се привлича силно от магнита", correct: false },
                { text: "Алуминият е парамагнитен", correct: false },
              ]}
              explanation="Движейки се в полето, листът изпитва променящ се поток → индуцират се вихрови токове → по Ленц полето им спъва движението. Това е магнитно демпфиране. Алуминият не е феромагнитен (не се привлича значимо), а парамагнетизмът е твърде слаб, за да обясни затихването."
            />
          </div>
        </Section>

        <Section id="recap" n="§7" title="Обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li><strong>Фарадей:</strong> <RichText text="$\mathcal{E}=-N\,d\Phi_B/dt$" />, с <RichText text="$\Phi_B=\int\vec B\cdot d\vec A$" />. Потокът се мени чрез <RichText text="$B$" />, <RichText text="$A$" /> или <RichText text="$\theta$" />; само промяната поражда ЕДН.</li>
              <li><strong>Ленц:</strong> индуцираните ток и ЕДН се противопоставят на промяната — пряко следствие от запазването на енергията.</li>
              <li><strong>Двигателно ЕДН:</strong> <RichText text="$\mathcal{E}=B\ell v$" /> за плъзгаща пръчка, <RichText text="$\mathcal{E}=\tfrac12 B\omega\ell^2$" /> за въртяща. Магнитната сила винаги спъва движението.</li>
              <li><strong>Вихрово поле:</strong> <RichText text="$\oint\vec E\cdot d\vec l=-d\Phi_B/dt$" /> — неконсервативно поле, съществуващо и там, където <RichText text="$\vec B=0$" />.</li>
              <li><strong>Генератор:</strong> <RichText text="$\mathcal{E}=NAB\omega\sin\omega t$" />; ЕДН е нула при максимален поток и максимално при нулев.</li>
              <li><strong>Двигател:</strong> обратно ЕДН <RichText text="$\propto\omega$" /> ограничава тока; при пускане и блокиране токът е опасно голям.</li>
              <li><strong>Вихрови токове:</strong> спъват движението и раждат топлина — полезни за спирачки, нежелани като загуби (намаляват се с ламиниране).</li>
            </ul>
          </div>
          <p className="mt-5 text-ink/90">
            Червената нишка на главата е <strong>запазването на енергията</strong>: индукцията
            никога не създава енергия от нищото — само преобразува механична в електрическа и
            обратно, а законът на Ленц е гаранцията, че сметката винаги излиза.
          </p>
          <p className="mt-5 text-ink/90">
            <strong>Предишна глава:</strong>{" "}
            <Link href="/physics/magnetizm/lorentz" className="font-semibold text-minus hover:underline">
              силата на Лоренц
            </Link>{" "}
            — как полето действа върху движещи се заряди. Оттам взехме магнитната сила{" "}
            <RichText text="$q\vec v\times\vec B$" />, която стои зад двигателното ЕДН тук.
          </p>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
