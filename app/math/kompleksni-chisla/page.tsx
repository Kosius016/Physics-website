import Link from "next/link";
import { complexChapters } from "@/lib/complexCourse";

export const metadata = { title: "Комплексни числа: пълен курс за физици · SingularityLab", description: "Четири части от основите до формулата на Ойлер, комплексни корени, фазори и резонанс. Шест интерактивни фигури и 32 задачи с решения." };

export default function ComplexCoursePage() {
  return <main className="mx-auto max-w-3xl px-5 pb-24">
    <header className="pb-8 pt-11">
      <Link href="/physics?subject=math&level=university" className="text-sm font-semibold text-minus hover:underline">Математика / Университетско</Link>
      <p className="mt-8 text-xs font-bold uppercase tracking-[.2em] text-minus">Математически инструменти за физици</p>
      <h1 className="mt-3 font-serif text-[clamp(40px,8vw,64px)] font-bold leading-[1.05]">Комплексни числа</h1>
      <p className="mt-5 text-xl leading-relaxed text-muted">От точка в равнината до език за въртене, вълни и трептения.</p>
      <p className="mt-5 text-base leading-[1.8]">Този курс започва от въпроса защо ни трябват нови числа. Всяка важна формула идва след идея, геометрия и обяснение. Ще се научите да смятате, да преминавате между представянията и да извеждате формулата на Ойлер, а след това да използвате същите инструменти във физиката.</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">{["4 части", "6 интерактивни фигури", "32 задачи с решения"].map(t => <span key={t} className="rounded-full border border-ink bg-hl px-3 py-2">{t}</span>)}</div>
      <Link href="/math/kompleksni-chisla/osnovi" className="mt-7 inline-block rounded-lg border-[1.5px] border-ink bg-ink px-5 py-3 font-semibold text-white shadow-hard-sm">Започнете с основите →</Link>
    </header>
    <section aria-labelledby="route" className="border-t-2 border-ink pt-7">
      <h2 id="route" className="font-serif text-2xl font-bold">Учебен маршрут</h2>
      <p className="my-4 leading-relaxed text-muted">Предвидете около 6–8 занятия по 45–60 минути и отделно време за задачи. Основният маршрут е части I–III и първите четири раздела на част IV. Фурие и квантовите амплитуди са надграждане.</p>
      <div className="space-y-4">{complexChapters.map((c, i) => <Link key={c.slug} href={`/math/kompleksni-chisla/${c.slug}`} className="block rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-hard-sm transition-colors hover:bg-hl">
        <span className="text-xs font-bold uppercase tracking-widest text-minus">Част {i + 1} · Задачи {c.practice[0]}–{c.practice[1]}</span><h3 className="mt-2 font-serif text-2xl font-bold">{c.title} →</h3><p className="mt-2 leading-relaxed text-muted">{c.subtitle}</p>
      </Link>)}</div>
    </section>
    <section className="mt-10" aria-labelledby="how"><h2 id="how" className="font-serif text-2xl font-bold">Как да използвате курса</h2><ol className="mt-4 list-decimal space-y-3 pl-6 leading-relaxed"><li>Отговорете на прогнозата, преди да продължите към сметката.</li><li>Във фигурите проверете нула, крайни стойности и случаи, които можете да пресметнете наум.</li><li>Възпроизведете извеждането на празен лист. Разпознаването на формула не е същото като извеждането ѝ.</li><li>След всяка част решете съответната група задачи. Отворете първо указание, а решението само при нужда.</li></ol>
      <p className="mt-5 leading-relaxed">За началото стигат училищна алгебра и координати. Тригонометрията е нужна от част II. Производните, редовете и интегралите са ясно обозначени там, където се използват.</p>
      <div className="mt-5 flex flex-wrap gap-4 font-semibold text-minus"><Link className="hover:underline" href="/zadachi/kompleksni-chisla">Към всички 32 задачи →</Link><Link className="hover:underline" href="/materiali/redove-na-teylar">Подготовка: редове на Тейлър →</Link></div>
    </section>
  </main>;
}
