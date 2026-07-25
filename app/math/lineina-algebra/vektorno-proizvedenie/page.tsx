import Link from "next/link";
import Formula from "@/components/Formula";
import LessonNav from "@/components/LessonNav";
import RichText from "@/components/RichText";
import Section from "@/components/Section";
import ProblemSetLinkCard from "@/components/problem-sets/ProblemSetLinkCard";
import CrossProductComponents from "@/components/interactives/CrossProductComponents";
import CrossProductGeometry from "@/components/interactives/CrossProductGeometry";
import CrossProductProblemSet from "@/components/interactives/CrossProductProblemSet";
import PredictionQuestion from "@/components/interactives/PredictionQuestion";
import RightHandCross from "@/components/interactives/RightHandCross";
import TripleProductLab from "@/components/interactives/TripleProductLab";
import {
  TeacherModeProvider,
  TeacherModeToggle,
  TeacherNote,
} from "@/components/interactives/TeacherMode";

export const metadata = {
  title: "Векторно и смесено произведение · STEM Платформа",
  description: "Геометричен и координатен урок за векторно произведение, нормали, площи и смесено произведение.",
};

const SECTION_NAV = [
  { id: "why", n: "§1", label: "Защо" },
  { id: "geometry", n: "§2", label: "Геометрия" },
  { id: "direction", n: "§3", label: "Посока" },
  { id: "coordinates", n: "§4", label: "Координати" },
  { id: "properties", n: "§5", label: "Свойства" },
  { id: "applications", n: "§6", label: "Приложения" },
  { id: "triple", n: "§7", label: "Смесено" },
  { id: "problems", n: "§8", label: "Задачи" },
  { id: "recap", n: "§9", label: "Обобщение" },
] as const;

export default function CrossProductLessonPage() {
  return (
    <TeacherModeProvider>
      <main className="mx-auto max-w-3xl px-5 pb-24">
        <header className="pt-11 pb-2">
          <nav aria-label="Път до урока" className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-muted">
            <Link href="/physics?subject=math&level=university" className="rounded-sm transition-colors hover:text-minus">Математика</Link>
            <span aria-hidden="true">·</span>
            <Link href="/physics?subject=math&level=university#linear-algebra" className="rounded-sm transition-colors hover:text-minus">Линейна алгебра</Link>
          </nav>
          <h1 className="mt-2 mb-2 font-serif text-[clamp(34px,7vw,48px)] leading-[1.08] font-bold text-ink">
            Векторно произведение: площ с посока
          </h1>
          <p className="text-[17px] text-muted">
            От успоредника и правилото на дясната ръка до нормали, моменти, сила на Лоренц и ориентиран обем
          </p>
        </header>

        <LessonNav items={SECTION_NAV} right={<TeacherModeToggle />} />

        <Section id="why" n="§1" title="Какъв вектор липсва?">
          <div className="space-y-4">
            <p className="text-[18px] text-ink">
              Два непаралелни вектора в пространството определят равнина. Но в инженерството често ни
              трябва не още един вектор <em>в</em> нея, а вектор, който сочи <strong>перпендикулярно</strong>
              на нея: посоката на въртене, лицето на повърхнина, ориентацията на магнитна сила.
            </p>
            <p className="text-ink/90">
              В <Link href="/math/lineina-algebra/determinanti" className="font-semibold text-minus hover:underline">предишния урок</Link>{" "}
              детерминантата на два вектора даде площта на успоредника им. Сега пазим тази площ, но я
              превръщаме в дължина на нов вектор и добавяме посока.
            </p>
            <PredictionQuestion
              prompt={String.raw`Дадени са два непаралелни вектора $\vec a$ и $\vec b$. Колко посоки са перпендикулярни едновременно и на двата?`}
              options={[
                { text: "Две противоположни посоки, затова трябва още едно правило за избор", correct: true },
                { text: "Точно една посока, определена еднозначно от двата вектора", correct: false },
                { text: "Безкрайно много посоки, по една за всяка точка на равнината", correct: false },
              ]}
              explanation={String.raw`Нормалната права към равнината има две ориентации. Редът $\vec a\times\vec b$ и правилото на дясната ръка избират едната; $\vec b\times\vec a$ избира противоположната.`}
            />
          </div>
          <TeacherNote>
            <p>
              Започнете с въпроса за двете нормали. Ако посоката се представи чак след формулата,
              антикомутативността изглежда като капан. Тук тя става неизбежен избор на ориентация.
            </p>
          </TeacherNote>
        </Section>

        <Section id="geometry" n="§2" title="Определение: три условия, един вектор">
          <div className="space-y-4">
            <p className="text-ink/90">
              Векторното произведение <RichText text={String.raw`$\vec a\times\vec b$`} /> е векторът,
              който едновременно изпълнява три условия:
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Перпендикулярност", String.raw`Перпендикулярен е и на $\vec a$, и на $\vec b$.`],
                ["Големина", String.raw`Дължината му е площта на успоредника: $|\vec a|\,|\vec b|\sin\theta$.`],
                ["Ориентация", String.raw`Посоката се избира от реда $\vec a\to\vec b$ с дясната ръка.`],
              ].map(([title, text], i) => (
                <div key={title} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-minus">Условие {i + 1}</span>
                  <p className="mt-1 font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink/80"><RichText text={text} /></p>
                </div>
              ))}
            </div>
            <Formula latex={String.raw`\boxed{\vec a\times\vec b\perp\vec a,\ \vec a\times\vec b\perp\vec b,\qquad |\vec a\times\vec b|=|\vec a|\,|\vec b|\sin\theta}`} />
            <p className="text-ink/90">
              Ъгълът <RichText text={String.raw`$\theta\in[0,\pi]$`} /> е по-малкият ъгъл между
              векторите. Височината на успоредника е <RichText text={String.raw`$|\vec b|\sin\theta$`} />,
              затова основа по височина дава точно формулата за големината.
            </p>
          </div>
          <div className="mt-5"><CrossProductGeometry /></div>
          <TeacherNote>
            <p>
              Накарайте учащия първо да предскаже какво става при θ = 0°, 90° и 180°, после да го
              провери с плъзгача. Критичната идея е, че големината не различава 0° от 180° — и в двата
              случая успоредникът е смачкан и произведението е нулевият вектор.
            </p>
          </TeacherNote>
        </Section>

        <Section id="direction" n="§3" title="Правилото на дясната ръка — без догадки">
          <div className="space-y-4">
            <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard-sm">
              <ol className="list-decimal space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
                <li>Поставете началата на двата вектора в една точка.</li>
                <li>Свийте пръстите на <strong>дясната</strong> ръка по по-малкото завъртане от първия към втория вектор.</li>
                <li>Палецът сочи посоката на векторното произведение.</li>
              </ol>
            </div>
            <p className="text-ink/90">
              Редът е част от операцията. Площта остава същата, но посоката се обръща:
            </p>
            <Formula latex={String.raw`\boxed{\vec b\times\vec a=-(\vec a\times\vec b)}`} />
            <h3 className="pt-2 font-serif text-[21px] font-bold text-ink">Базисният цикъл</h3>
            <Formula latex={String.raw`\vec i\times\vec j=\vec k,\qquad \vec j\times\vec k=\vec i,\qquad \vec k\times\vec i=\vec j`} />
            <p className="text-ink/90">
              Движение напред по цикъла <RichText text={String.raw`$\vec i\to\vec j\to\vec k\to\vec i$`} /> дава
              плюс. Назад дава минус. Вектор по себе си дава нула:
              <RichText text={String.raw`$\ \vec i\times\vec i=\vec0$`} />.
            </p>
            <PredictionQuestion
              prompt={String.raw`Без координатна сметка: накъде сочи $\vec k\times\vec j$?`}
              options={[
                { text: String.raw`$-\vec i$, тоест обратно на положителната ос $x$`, correct: true },
                { text: String.raw`$+\vec i$, по положителната ос $x$`, correct: false },
                { text: String.raw`$\vec0$, защото множителите са перпендикулярни`, correct: false },
              ]}
              explanation={String.raw`$\vec j\times\vec k=\vec i$ е напред по цикъла. Размяната на реда обръща знака, следователно $\vec k\times\vec j=-\vec i$. Нулев вектор се получава при **успоредни** множители, не при перпендикулярни.`}
            />
            <p className="text-ink/90">
              Тренажорът долу дава двойката, вие давате посоката. Сцената дорисува резултата чак
              след отговора, за да не се превърне познаването в разчитане на картинката.
            </p>
          </div>
          <div className="mt-5">
            <RightHandCross />
          </div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Изисквайте физическото движение с ръка при всяка двойка, не само мисленото. Ученик,
                който върти дясната ръка над чина, прави много по-малко знакови грешки от този,
                който помни цикъла наизуст.
              </li>
              <li>
                Задължителна спирка: една и съща двойка в двата реда. Разликата в палеца е цялата
                антикомутативност.
              </li>
              <li>
                Диагностичен въпрос: „кога резултатът е нулевият вектор и защо това не значи, че
                векторите са перпендикулярни?“ (нула се получава при успоредни).
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="coordinates" n="§4" title="Координатната формула е детерминанта">
          <div className="space-y-4">
            <p className="text-ink/90">
              Нека <RichText text={String.raw`$\vec a=(a_1,a_2,a_3)$`} /> и
              <RichText text={String.raw`$\ \vec b=(b_1,b_2,b_3)$`} />. Всяка компонента на новия
              вектор е 2×2 детерминанта — ориентираната площ на съответната координатна проекция:
            </p>
            <Formula latex={String.raw`\vec a\times\vec b=\begin{vmatrix}\vec i&\vec j&\vec k\\a_1&a_2&a_3\\b_1&b_2&b_3\end{vmatrix}`} />
            <p className="text-ink/90">
              Разгъваме формално по първия ред със знаците <strong>+ − +</strong>:
            </p>
            <Formula latex={String.raw`\boxed{\vec a\times\vec b=\bigl(a_2b_3-a_3b_2,\;a_3b_1-a_1b_3,\;a_1b_2-a_2b_1\bigr)}`} />
            <div className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15px] leading-relaxed text-ink/90">
              <strong>Средната компонента:</strong> при разгъването е
              <RichText text={String.raw`$-(a_1b_3-a_3b_1)=a_3b_1-a_1b_3$`} />. Това е най-честата
              знакова грешка; вторият запис я прави видима.
            </div>
            <h3 className="pt-2 font-serif text-[21px] font-bold text-ink">Две автоматични проверки</h3>
            <Formula latex={String.raw`\vec a\cdot(\vec a\times\vec b)=0,\qquad \vec b\cdot(\vec a\times\vec b)=0`} />
            <p className="text-ink/90">
              Ако някое от скаларните произведения не е нула, компонентната сметка е грешна. Тази
              проверка е по-надеждна от повторно прочитане на същите знаци.
            </p>
          </div>
          <div className="mt-5"><CrossProductComponents /></div>
          <TeacherNote>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                Записът с <RichText text={String.raw`$\vec i,\vec j,\vec k$`} /> на първия ред е
                мнемоника, не същинска детерминанта: първият ред съдържа вектори, не числа. Кажете
                го веднъж честно, вместо ученикът да го открие сам и да се обърка.
              </li>
              <li>
                Задължителен ред при сметка: първо схемата <strong>+ − +</strong> на хартия, после
                числата. Средната компонента се проверява отделно.
              </li>
              <li>
                Диагностика с preset-а „Успоредни“: питайте защо и трите компоненти стават нула
                едновременно (всеки минор е детерминанта на пропорционални редове).
              </li>
            </ul>
          </TeacherNote>
        </Section>

        <Section id="properties" n="§5" title="Свойства и гранични случаи">
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-[10px] border-[1.5px] border-ink bg-surface">
              <table className="w-full min-w-[620px] border-collapse text-left text-[14.5px]">
                <thead className="bg-hl text-[11px] uppercase tracking-wide text-muted">
                  <tr><th className="px-4 py-3">Свойство</th><th className="px-4 py-3">Формула</th><th className="px-4 py-3">Смисъл</th></tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/90">
                  <tr><td className="px-4 py-3">Антикомутативност</td><td className="px-4 py-3"><RichText text={String.raw`$\vec a\times\vec b=-\vec b\times\vec a$`} /></td><td className="px-4 py-3">размяната обръща нормалата</td></tr>
                  <tr><td className="px-4 py-3">Дистрибутивност</td><td className="px-4 py-3"><RichText text={String.raw`$\vec a\times(\vec b+\vec c)=\vec a\times\vec b+\vec a\times\vec c$`} /></td><td className="px-4 py-3">разпределя се върху сума</td></tr>
                  <tr><td className="px-4 py-3">Скалар</td><td className="px-4 py-3"><RichText text={String.raw`$(\lambda\vec a)\times\vec b=\lambda(\vec a\times\vec b)$`} /></td><td className="px-4 py-3">мащабира площта и евентуално посоката</td></tr>
                  <tr><td className="px-4 py-3">Нулев случай</td><td className="px-4 py-3"><RichText text={String.raw`$\vec a\times\vec b=\vec0\iff\vec a\parallel\vec b$`} /></td><td className="px-4 py-3">за ненулеви вектори</td></tr>
                </tbody>
              </table>
            </div>
            <p className="rounded-r-lg border-l-4 border-plus bg-hl px-4 py-3 text-[15px] leading-relaxed text-ink/90">
              <strong>Не е асоциативно:</strong> изразите
              <RichText text={String.raw`$\ (\vec a\times\vec b)\times\vec c$`} /> и
              <RichText text={String.raw`$\ \vec a\times(\vec b\times\vec c)$`} /> по принцип са различни.
              Скобите не могат да се местят свободно.
            </p>

            <h3 className="pt-2 font-serif text-[21px] font-bold text-ink">Скаларно срещу векторно произведение</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3">
                <p className="font-semibold text-ink">Скаларно: <RichText text={String.raw`$\vec a\cdot\vec b$`} /></p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/85">Резултатът е число; използва cos θ; мери успоредната компонента; комутативно е.</p>
              </div>
              <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-4 py-3">
                <p className="font-semibold text-ink">Векторно: <RichText text={String.raw`$\vec a\times\vec b$`} /></p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink/85">Резултатът е вектор; използва sin θ; мери перпендикулярната площ; антикомутативно е.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section id="applications" n="§6" title="Четири употреби на една и съща идея">
          <div className="space-y-4">
            {[
              { tag: "Площ", formula: String.raw`S_{\parallel}=|\vec a\times\vec b|,\qquad S_{\triangle}=\frac12|\vec a\times\vec b|`, text: "Два ръба определят успоредник; три точки дават два ръба от общ връх." },
              { tag: "Нормала и равнина", formula: String.raw`\vec n=(Q-P)\times(R-P),\qquad \vec n\cdot(X-P)=0`, text: "Два вектора в равнината дават нормала, а нормалата дава уравнението ѝ." },
              { tag: "Момент на сила", formula: String.raw`\vec\tau=\vec r\times\vec F`, text: "Само перпендикулярната част на силата завърта; посоката задава оста и смисъла на въртене." },
              { tag: "Магнитна сила", formula: String.raw`\vec F=q\,\vec v\times\vec B`, text: "Силата е перпендикулярна на движението и полето; знакът на заряда обръща посоката." },
            ].map((item) => (
              <div key={item.tag} className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-minus">{item.tag}</span>
                <div className="mt-2"><Formula latex={item.formula} /></div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/90">{item.text}</p>
              </div>
            ))}
            <p className="text-ink/90">
              Физичната връзка е развита подробно в урока за
              <Link href="/physics/magnetizm/lorentz" className="ml-1 font-semibold text-minus hover:underline">силата на Лоренц</Link>,
              а същата ориентация участва и в
              <Link href="/physics/magnetizm/bio-savar" className="ml-1 font-semibold text-minus hover:underline">закона на Био–Савар</Link>.
            </p>
          </div>
        </Section>

        <Section id="triple" n="§7" title="Смесено произведение: от площ към обем">
          <div className="space-y-4">
            <p className="text-ink/90">
              Векторът <RichText text={String.raw`$\vec a\times\vec b$`} /> е перпендикулярен на
              основата и дължината му е нейната площ. Скаларното произведение с
              <RichText text={String.raw`$\ \vec c$`} /> взима само перпендикулярната височина на
              третия ръб. Получаваме знаков обем:
            </p>
            <Formula latex={String.raw`[\vec a,\vec b,\vec c]=\vec c\cdot(\vec a\times\vec b)=\det\begin{pmatrix}a_1&b_1&c_1\\a_2&b_2&c_2\\a_3&b_3&c_3\end{pmatrix}`} />
            <Formula latex={String.raw`\boxed{V=\left|\vec c\cdot(\vec a\times\vec b)\right|}`} />
            <ul className="list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>Цикличните размествания пазят стойността: <RichText text={String.raw`$\vec a\cdot(\vec b\times\vec c)=\vec b\cdot(\vec c\times\vec a)$`} />.</li>
              <li>Размяна само на два вектора сменя знака — както размяна на две колони в детерминанта.</li>
              <li>Смесеното произведение е нула точно когато трите вектора са компланарни.</li>
            </ul>
          </div>
          <div className="mt-5"><TripleProductLab /></div>
          <TeacherNote>
            <p>
              Плъзгачът за странично отместване е ключов: той променя ръба c, но не и височината му
              над основата, затова обемът остава постоянен. Това е пространственият аналог на
              срязването с det = 1 от предишния урок.
            </p>
          </TeacherNote>
        </Section>

        <Section id="problems" n="§8" title="Задачи от основни до сложни">
          <p className="mb-5 text-ink/90">
            Всяка задача налага един и същи ред: <strong>какъв е типът на резултата</strong>,{" "}
            <strong>накъде сочи той</strong>, и чак тогава — компонентната сметка. Стъпките на
            решението се отключват едва след двата въпроса, а фигурата се достроява с всеки отговор.
          </p>
          <CrossProductProblemSet />
          <ProblemSetLinkCard note="Problem set 01 надгражда този урок с тъждествата на Лагранж, Якоби и Бине-Коши, формулата BAC-CAB, компланарност и двойно кръстосване." />
        </Section>

        <Section id="recap" n="§9" title="Работен алгоритъм и обобщение">
          <div className="rounded-[10px] border-[1.5px] border-ink bg-surface px-5 py-4 shadow-hard">
            <ol className="list-decimal space-y-2 pl-5 text-[15.5px] leading-relaxed text-ink/90">
              <li>Подредете множителите — редът определя знака и посоката.</li>
              <li>Предскажете нормалата с правилото на дясната ръка.</li>
              <li>Сметнете трите компоненти като 2×2 детерминанти със знаци + − +.</li>
              <li>Проверете перпендикулярността с две скаларни произведения.</li>
              <li>Интерпретирайте: дължината е площ; половината е площ на триъгълник; скаларно произведение с трети вектор дава ориентиран обем.</li>
            </ol>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] border-[1.5px] border-ok bg-ok/10 px-4 py-3">
              <p className="font-semibold text-ink">Можете да продължите, ако…</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink/85">обяснявате защо има sin θ, защо размяната обръща знака и защо резултатът е перпендикулярен.</p>
            </div>
            <div className="rounded-[10px] border-[1.5px] border-plus bg-plus/10 px-4 py-3">
              <p className="font-semibold text-ink">Върнете се към §4, ако…</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink/85">помните формулата, но не можете да проверите резултата или обърквате средната компонента.</p>
            </div>
          </div>
        </Section>
      </main>
    </TeacherModeProvider>
  );
}
