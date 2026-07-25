import Link from "next/link";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import { Figure, PhotoFrame } from "@/components/articles/ArticleFigure";
import {
  CloudChargeDiagram,
  LightningStagesDiagram,
  ParticleCascadeDiagram,
  SafetyInfographic,
} from "@/components/articles/LightningFigures";

export const metadata = {
  title: "Мълнията: най-познатата загадка в небето · STEM Платформа",
  description:
    "Въздухът е изолатор — и въпреки това бурята прекарва ток през километри от него. Как точно започва мълнията още е отворен въпрос.",
};

const SECTION_NAV = [
  { id: "bateriya", n: "§1", label: "Батерията" },
  { id: "iskra", n: "§2", label: "Искрата" },
  { id: "kanal", n: "§3", label: "Каналът" },
  { id: "udar", n: "§4", label: "Ударът" },
  { id: "pat", n: "§5", label: "Пътят" },
  { id: "uskoritel", n: "§6", label: "Ускорителят" },
  { id: "mikrosekundi", n: "§7", label: "Микросекундите" },
] as const;

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[16px] leading-relaxed text-ink">
      {children}
    </div>
  );
}

const NUMBERS: { label: string; value: string }[] = [
  { label: "Температура в канала", value: String.raw`$\approx 28\,000\,^{\circ}\mathrm{C}$` },
  { label: "Скорост на удара", value: String.raw`$\sim 10^{8}\ \mathrm{m/s}$` },
  { label: "Ток", value: String.raw`десетки хиляди $\mathrm{A}$` },
  { label: "Скорост на звука", value: String.raw`$340\ \mathrm{m/s}$` },
];

export default function LightningArticlePage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24">
      <header className="pt-11 pb-2">
        <nav aria-label="Път до статията" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[.22em] text-muted">
          <Link href="/statii" className="rounded-sm transition-colors hover:text-minus">Статии</Link>
          <span aria-hidden="true">·</span>
          <span>Физика</span>
        </nav>
        <h1 className="mt-2 mb-3 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
          Мълнията: най-познатата загадка в небето
        </h1>
        <p className="text-[18px] leading-relaxed text-muted">
          Знаем какво се случва, след като мълнията вече е тръгнала. Трудният въпрос е как се
          ражда първата искра.
        </p>
      </header>

      <LessonNav items={SECTION_NAV} />

      <div className="space-y-4 pt-8 text-[17px] leading-relaxed text-ink/90">
        <p>
          Въздухът е изолатор. Затова оголеният кабел не се разрежда в стаята, а батерията в
          чекмеджето не се изпразва през атмосферата.
        </p>
        <p>После идва бурята — и електричеството прекосява километри от същия този въздух.</p>

        <Figure
          wide
          caption="Разклонен разряд между облак и земя. Ослепителният канал е последната фаза на процес, чието начало остава невидимо."
        >
          <PhotoFrame
            ratio="16 / 9"
            alt="Ярка разклонена мълния между буреносен облак и земята над нощен пейзаж"
            brief="Нощна снимка на разклонена мълния облак–земя над силует на пейзаж или град, дълга експозиция."
          />
        </Figure>

        <p>
          Мълнията не е предмет, паднал от небето. Тя е бързо растяща мрежа от плазмени канали,
          лавини от електрони, радиовълни, ударни вълни, рентгенови лъчи — а понякога и
          антиматерия.
        </p>
        <p>
          И въпреки вековете наблюдения един от най-основните ѝ моменти още е открит научен
          проблем: <strong>как всъщност започва мълнията?</strong>
        </p>
        <Callout>
          „Разбираме едно явление“ не значи „всички въпроси имат отговор“. Мълнията е
          най-ясният пример.
        </Callout>
      </div>

      <Section id="bateriya" n="§1" title="Батерия, широка няколко километра">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>Преди да падне мълния, бурята трябва да раздели заряд.</p>
          <p>
            Зрялата гръмотевична буря е огромна вертикална машина. Топъл влажен въздух се издига
            и отнася водни капки до височини, където температурата е под нулата. Част от капките
            остават течни — <strong>преохладени капки</strong>. Те съжителстват с дребни ледени
            кристали и с по-едри меки ледени зърна, наричани <strong>граупел</strong> (нещо
            средно между сняг и дребна градушка).
          </p>
          <p>
            Частиците се сблъскват непрекъснато и при много от сблъсъците се прехвърля заряд: в
            типичните условия ледените кристали излизат положителни, а граупелът — отрицателен.
            Възходящото течение вдига леките кристали нагоре; тежкият граупел остава ниско.
          </p>
          <p>Бурята сортира заряд по маса.</p>

          <Figure
            wide
            caption="Зрялата буря се разслоява електрически: положителен заряд горе, отрицателен по-надолу, често и малка положителна област в основата. Отрицателният слой изтласква електроните в почвата и повърхността под бурята остава относително положителна."
          >
            <CloudChargeDiagram />
          </Figure>

          <p>
            Резултатът е гигантска атмосферна батерия — между заредените области се натрупва
            разлика от стотици милиони волтове. (Истинските бури рядко са толкова спретнати:
            значимите заредени области може да са три, четири или повече.)
          </p>
          <p>
            Но дори това напрежение не прави мълния. Напрежението е налична енергия. За да
            протече ток, изолаторът трябва да стане проводник.
          </p>
        </div>
      </Section>

      <Section id="iskra" n="§2" title="Невъзможната искра">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            В лабораторни условия въздухът се пробива при поле около{" "}
            <strong>три милиона волта на метър</strong>. Дотогава молекулите му си стоят
            неутрални: свободни носители на заряд почти няма и ток не може да протече.
          </p>
          <p>
            Измерванията вътре в буреносни облаци обаче рядко откриват толкова силно поле в
            голям обем — обикновено намереното е осезаемо по-слабо от прага за пробив.
          </p>
          <p>Бурята сякаш пали искра във въздух, който още не е готов да искри.</p>
          <p>
            Точно това разминаване — между измереното поле и полето, което теорията изисква —
            движи изследванията от десетилетия. Нарича се{" "}
            <strong>проблем за инициирането на мълнията</strong>.
          </p>
        </div>
      </Section>

      <Section id="kanal" n="§3" title="От един електрон до цял канал">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>Да допуснем, че някъде в облака вече има един свободен електрон.</p>
          <p>
            Полето го ускорява. Той се блъска в молекула азот или кислород и ако е набрал
            достатъчно енергия, избива от нея втори електрон. Двата стават четири, четири —
            осем. Започва <strong>електронна лавина</strong>: въздухът се йонизира и се
            превръща в <strong>плазма</strong>, която провежда несравнимо по-добре от неутралния
            газ.
          </p>
          <p>Но лавината още не е мълния. Разрядът трябва да се организира.</p>
          <p>
            <strong>Стримерът</strong> е тънка, бързо растяща нишка йонизиран въздух. Зарядът,
            събран на върха ѝ, усилва локалното поле и ѝ позволява да йонизира въздуха точно
            пред себе си.
          </p>
          <Callout>
            Йонизацията концентрира заряд. Зарядът усилва полето. По-силното поле прави още
            йонизация. Кръгът се затваря и нишката се самоподдържа.
          </Callout>
          <p>
            Повечето стримери умират бързо. Някои се сливат и нагряват въздуха достатъчно, за да
            се роди дълготраен проводящ канал — <strong>лидер</strong>.
          </p>
          <p>
            Отрицателният лидер напредва на пресекулки: спира, изстрелва сноп стримери, скача
            напред с десетки метри, пак спира. Това е <strong>стъпаловидният лидер</strong> и
            всяка негова стъпка ражда разклонения.
          </p>
          <p>Мълнията не „знае“ къде е земята. Тя опипва.</p>

          <Figure
            wide
            caption="Четирите фази. Окото различава само последната — всичко преди нея се разиграва за милисекунди и е почти невидимо."
          >
            <LightningStagesDiagram />
          </Figure>
        </div>
      </Section>

      <Section id="udar" n="§4" title="Ослепителният миг и гърмът след него">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            Когато лидерът наближи повърхността, полето около високите и остри обекти става
            особено силно: дървета, кули, стълбове, било на хълм, понякога хора. От тях нагоре
            тръгват положителни <strong>възходящи стримери</strong> и за един кратък миг няколко
            от тях се състезават.
          </p>
          <p>
            Един среща един клон на лидера. Между облака и земята вече има непрекъснат проводящ
            път — и небето избухва.
          </p>
          <p>
            По готовия канал се понася <strong>възвратният удар</strong>: огромен ток, който
            нагрява канала и го прави ослепителен. И макар лидерът да се е движел надолу,
            светлината се разпространява <strong>нагоре</strong> — от точката на съединяване към
            облака, с около една трета от скоростта на светлината.
          </p>
          <p>
            Тоест най-яркото, което виждате, не е електричество, „падащо от небето“. Това е
            вълна, която тича нагоре по път, построен тихо мигове по-рано.
          </p>
          <p>
            Ако в облака е останал заряд, по същия канал слиза нов лидер и следва втори удар.
            Затова мълнията видимо трепти. <strong>Светкавицата</strong> е цялото електрическо
            събитие; <strong>ударът</strong> е един от импулсите в него.
          </p>

          <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border-[1.5px] border-ink bg-rule sm:grid-cols-4">
            {NUMBERS.map((n) => (
              <div key={n.label} className="min-w-0 bg-surface px-3 py-2.5">
                <dt className="text-[10.5px] font-bold uppercase tracking-wide text-muted">{n.label}</dt>
                <dd className="mt-0.5 text-[15px] font-bold tabular-nums text-ink">
                  <RichText text={n.value} />
                </dd>
              </div>
            ))}
          </dl>

          <p>
            Каналът е тесен, но се нагрява невъобразимо бързо — до близо 28 000 °C, няколко пъти
            повече от повърхността на Слънцето. Горещият въздух се разширява яростно и изстрелва
            вълна от налягане: близо до канала тя е ударна вълна, по-далеч става звукът, който
            наричаме гръм.
          </p>
          <p>
            Дългият канал не звучи от една точка — звукът от отделните му участъци пристига по
            различно време. Затова близката мълния изплющява остро, а далечната се търкаля.
          </p>
          <Callout>
            Светлината пътува с <RichText text="$3\times10^8\ \mathrm{m/s}$" />, звукът — с около{" "}
            <RichText text="$340\ \mathrm{m/s}$" />. Три секунди между блясъка и гърма отговарят
            на около километър. Но ако изобщо чувате гръм, вече сте достатъчно близо, за да сте в
            опасност.
          </Callout>

          <Figure wide caption="Всяко от правилата е пряко следствие от физиката в §3 и §4.">
            <SafetyInfographic />
          </Figure>
        </div>
      </Section>

      <Section id="pat" n="§5" title="Митът за най-лесния път">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            „Мълнията върви по пътя на най-малкото съпротивление“ звучи логично и е подвеждащо.
          </p>
          <p>
            Преди каналът да се появи, не съществува нито един завършен път, чието съпротивление
            да бъде измерено и сравнено с другите. Вместо това тръгват много клона. Всеки клон
            променя полето около себе си: едни попадат в области, където йонизацията върви
            по-лесно, други остават на гладна дажба и спират.
          </p>
          <p>
            Мълнията не избира най-лесния маршрут. Тя{" "}
            <strong>създава маршрутите в движение</strong>, а оцеляват онези, които подхранват
            собствения си растеж. Оттам е и дървовидната ѝ форма — същата обратна връзка, която
            оформя речните мрежи, корените и пукнатините в материалите.
          </p>
          <p>
            Затова пътят ѝ е практически непредсказуем, макар законите зад него да са напълно
            детерминистични: микроскопична флуктуация може да порасне дотам, че да премести
            километричен канал.
          </p>

          <Figure wide caption="Един и същ механизъм, различна геометрия: според това къде са зарядите, разрядът остава в облака, тръгва към земята или се разстила хоризонтално.">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <PhotoFrame
                  ratio="3 / 4"
                  alt="Класическа разклонена мълния от облак към земята"
                  brief="Разклонена мълния облак–земя с ясно видими странични клони."
                />
                <p className="mt-1.5 text-[12.5px] font-semibold text-ink">Облак–земя</p>
              </div>
              <div>
                <PhotoFrame
                  ratio="3 / 4"
                  alt="Вътрешнооблачен разряд, който осветява облака отвътре"
                  brief="Вътрешнооблачен разряд: облакът свети отвътре, без видим канал."
                />
                <p className="mt-1.5 text-[12.5px] font-semibold text-ink">Вътрешнооблачна</p>
              </div>
              <div>
                <PhotoFrame
                  ratio="3 / 4"
                  alt="Хоризонтален разряд, който се разстила по основата на облачния слой"
                  brief="Хоризонтален разряд между облаци, разстлан по основата на облачния слой."
                />
                <p className="mt-1.5 text-[12.5px] font-semibold text-ink">Между облаци</p>
              </div>
            </div>
          </Figure>
        </div>
      </Section>

      <Section id="uskoritel" n="§6" title="Ускорител на частици над главите ни">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>Мълнията не е просто уголемена искра от дръжката на вратата.</p>
          <p>
            Бурите ускоряват електрони до релативистки енергии. Когато такъв електрон се отклони
            от молекула въздух, той излъчва — процесът се нарича{" "}
            <strong>спирачно лъчение</strong> (на немски <em>Bremsstrahlung</em>). Така се раждат
            рентгенови лъчи, а при най-енергичните събития и гама-лъчи: спътниците ги
            регистрират като кратки, интензивни{" "}
            <strong>земни гама-изблици</strong>.
          </p>
          <p>
            Някои гама-кванти носят достатъчно енергия, за да родят двойка частица и античастица:
          </p>
          <p className="text-center text-[19px]"><RichText text="$\gamma \rightarrow e^- + e^+$" /></p>
          <p>
            Тук <RichText text="$e^-$" /> е електрон, а <RichText text="$e^+$" /> е позитрон —
            антиматериалният му партньор. Над една наглед обикновена буря природата за кратко
            произвежда релативистки снопове, гама-лъчи и антиматерия.
          </p>

          <Figure
            wide
            caption="Веригата, която превръща буря в ускорител: поле → бърз електрон → високоенергетичен фотон → нова двойка частици."
          >
            <ParticleCascadeDiagram />
          </Figure>
        </div>
      </Section>

      <Section id="mikrosekundi" n="§7" title="Първите микросекунди">
        <div className="space-y-4 text-[17px] leading-relaxed text-ink/90">
          <p>
            Растежът на лидера, съединяването, възвратният удар, гръмът — всичко това е разбрано
            добре. Неизвестното е по-рано.
          </p>
          <Callout>
            <strong>Какво създава първия самоподдържащ се разряд вътре в облака?</strong>
          </Callout>
          <p>
            Мястото на раждане е километри високо, скрито в непрозрачен облак. Процесът обхваща
            мащаби от единичен електрон до стотици метри и трае микросекунди. Никой не може да
            чака с прибор точно там. Вероятно допринасят няколко механизма:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Локално усилване на полето.</strong> Не е нужно целият облак да достигне
              прага. Достатъчно е острите ръбове на ледените частици и малките джобове заряд да
              го достигнат в мънички обеми.
            </li>
            <li>
              <strong>Семена от космоса.</strong> Космичните лъчи раждат в атмосферата енергични
              електрони. Електрон, който вече лети достатъчно бързо, може да „избяга“ — да печели
              от полето повече, отколкото губи при сблъсъци — и да породи{" "}
              <strong>релативистка лавина от убягващи електрони</strong>.
            </li>
            <li>
              <strong>Каскада от стримери.</strong> С радиотелескопа LOFAR изследователи
              проследиха иницииране, при което първият радиоизточник усили интензитета си около
              сто пъти само за <strong>15 микросекунди</strong>, докато активната област се
              разрасна на десетки метри.
            </li>
          </ul>
          <p>
            През почти цялата човешка история това начало беше напълно невидимо. Днес го
            разчитаме с точност до милионни от секундата. Но да видиш каскадата не значи да
            знаеш кой е запалил първия ѝ стример.
          </p>
          <p>
            През 2025 г. екип около Виктор Пасков (Victor Pasko) предложи механизъм, който
            затваря кръга: енергични електрони излъчват рентгенови лъчи, лъчите избиват нови
            електрони от молекулите чрез фотоелектричен ефект, новите електрони раждат нови
            лавини. Моделът обяснява наведнъж бързото иницииране, характерните радиоизлъчвания,
            рентгеновите изблици и земните гама-изблици.
          </p>
          <p>
            Решен ли е с това проблемът? Не още. Един модел печели доверие едва когато предскаже
            наблюдения, които не са били използвани при построяването му — а това предложение
            тепърва ще се сравнява с много бури и много видове мълнии. Знанието има слоеве: може
            да знаем уравненията, процесите и реда на събитията и въпреки това да не знаем коя
            микроскопична флуктуация отключва конкретната мълния.
          </p>

          <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface shadow-hard">
            <table className="w-full min-w-140 border-collapse text-[15px]">
              <caption className="sr-only">Степен на разбиране по въпроси около мълнията</caption>
              <thead className="bg-hl">
                <tr>
                  <th className="p-3 text-left">Въпрос</th>
                  <th className="p-3 text-left">Къде сме днес</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                <tr>
                  <td className="p-3">Кои закони управляват зарядите и полетата?</td>
                  <td className="p-3 font-semibold text-ok">Много добре разбрано</td>
                </tr>
                <tr>
                  <td className="p-3">Как се развива зряла мълния от облак към земя?</td>
                  <td className="p-3 font-semibold text-ok">Разбрано и пряко наблюдавано</td>
                </tr>
                <tr>
                  <td className="p-3">Как бурята създава и подрежда зарядите?</td>
                  <td className="p-3 font-semibold text-minus">Механизмът е ясен, детайлите — активна тема</td>
                </tr>
                <tr>
                  <td className="p-3">Какво пали първия самоподдържащ се разряд?</td>
                  <td className="p-3 font-semibold text-plus">Няколко силни модела, без общоприет отговор</td>
                </tr>
                <tr>
                  <td className="p-3">Кога и къде ще падне следващата мълния?</td>
                  <td className="p-3 font-semibold text-plus">Непредсказуемо с днешните измервания</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Section>

      <div className="mt-14 rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-5 shadow-hard">
        <p className="text-[12px] font-bold uppercase tracking-[.15em] text-minus">Финална мисъл</p>
        <div className="mt-3 space-y-3 text-[17px] leading-relaxed text-ink/90">
          <p>Следващия път, когато небето светне, не гледате едно събитие.</p>
          <p>
            Гледате как ледени зърна строят батерия, широка километри. Как невидими нишки се
            борят за оцеляване. Как въздухът става плазма. Как електрическа вълна тича нагоре със
            скорост, съизмерима със светлинната. Чувате газ, нагрят до десетки хиляди градуси.
          </p>
          <p>
            Първите хора са виждали в бурята оръжие на боговете. Франклин разпознал електрически
            разряд. Днешните инструменти виждат рентгенови лъчи, гама-изблици и антиматерия.
          </p>
          <p className="font-semibold text-ink">
            Загадката не се смали с растежа на знанието — само стана по-точна. Днес тя се побира
            в първите микросекунди.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 border-b-2 border-ink pb-1.5 font-serif text-[22px] font-bold text-ink">Източници</h2>
        <ol className="list-decimal space-y-2 pl-6 text-[14.5px] leading-relaxed text-muted">
          <li><a className="text-minus hover:underline" href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2007JD009036" target="_blank" rel="noopener noreferrer">A brief review of the problem of lightning initiation (Journal of Geophysical Research)</a></li>
          <li><a className="text-minus hover:underline" href="https://www.nssl.noaa.gov/education/svrwx101/lightning/" target="_blank" rel="noopener noreferrer">Severe Weather 101: Lightning Basics (NOAA NSSL)</a></li>
          <li><a className="text-minus hover:underline" href="https://www.weather.gov/wrn/spring-lightning-sm" target="_blank" rel="noopener noreferrer">Lightning facts (US National Weather Service)</a></li>
          <li><a className="text-minus hover:underline" href="https://www.nesdis.noaa.gov/about/k-12-education/severe-weather/what-causes-lightning-and-thunder" target="_blank" rel="noopener noreferrer">What Causes Lightning and Thunder? (NOAA NESDIS)</a></li>
          <li><a className="text-minus hover:underline" href="https://www.weather.gov/safety/lightning-science-thunder" target="_blank" rel="noopener noreferrer">Understanding Lightning: Thunder (US National Weather Service)</a></li>
          <li><a className="text-minus hover:underline" href="https://ntrs.nasa.gov/citations/20120011846" target="_blank" rel="noopener noreferrer">Earth&apos;s Most Powerful Natural Particle Accelerator (NASA)</a></li>
          <li><a className="text-minus hover:underline" href="https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2021GL095511" target="_blank" rel="noopener noreferrer">The Spontaneous Nature of Lightning Initiation Revealed (Geophysical Research Letters, LOFAR)</a></li>
          <li><a className="text-minus hover:underline" href="https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025JD043897" target="_blank" rel="noopener noreferrer">Photoelectric Effect in Air Explains Lightning Initiation (Journal of Geophysical Research, 2025)</a></li>
          <li><a className="text-minus hover:underline" href="https://fermi.gsfc.nasa.gov/science/eteu/tgfs/" target="_blank" rel="noopener noreferrer">Spotting Terrestrial Gamma-Ray Flashes (NASA Fermi)</a></li>
        </ol>
      </div>

      <p className="mt-10 text-[15.5px] text-muted">
        Свързан урок в платформата:{" "}
        <Link href="/physics/elektrichestvo/potencial" className="font-semibold text-minus hover:underline">
          Електричен потенциал
        </Link>{" "}
        обяснява какво стои зад „стотиците милиони волтове“ между облака и земята.
      </p>
    </main>
  );
}
