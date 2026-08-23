import Link from "next/link";
import ArticleList from "@/components/home/ArticleList";
import DailyQuestionSoon from "@/components/home/DailyQuestionSoon";
import HomeFooter from "@/components/home/HomeFooter";
import LessonAnatomy from "@/components/home/LessonAnatomy";
import LevelCards from "@/components/home/LevelCards";
import RecentLessons from "@/components/home/RecentLessons";
import SectionHeading from "@/components/home/SectionHeading";

export const metadata = {
  title: "SingularityLab · Физика и математика",
  description:
    "Уроци, задачи с пълни решения и интерактивни фигури по физика и математика.",
};

export default function HomePage() {
  return (
    <>
      <main className="mx-auto max-w-[1040px] px-5 pb-24">
        <section className="flex max-w-[820px] flex-col gap-[22px] pb-2 pt-[72px]">
          <h1 className="text-pretty font-serif text-[clamp(38px,6.4vw,64px)] font-bold leading-[1.04] tracking-[-0.01em] text-ink">
            Физика и математика, които наистина разбираш.
          </h1>
          <p className="max-w-[62ch] text-pretty text-[clamp(18px,2.2vw,21px)] leading-[1.55] text-ink">
            Уроци, задачи с пълни решения и интерактивни фигури: от 11. клас до първите
            университетски курсове.
          </p>
          <div className="flex flex-wrap gap-3.5 pt-1.5">
            <Link
              href="#temi"
              className="rounded-[10px] border-[1.5px] border-ink bg-ink px-6 py-3 text-[16px] font-bold text-surface shadow-hard transition-opacity hover:opacity-90 active:translate-x-px active:translate-y-px active:shadow-none"
            >
              Разгледай темите
            </Link>
            <Link
              href="/materiali?type=zadachi"
              className="rounded-[10px] border-[1.5px] border-ink bg-surface px-6 py-3 text-[16px] font-bold text-ink shadow-hard transition-colors hover:bg-hl active:translate-x-px active:translate-y-px active:shadow-none"
            >
              Решавай задачи
            </Link>
          </div>
        </section>

        <DailyQuestionSoon />

        <section id="temi" aria-labelledby="topics-title" className="scroll-mt-5 pt-[72px]">
          <SectionHeading
            id="topics-title"
            number="§2"
            title="Откъде да започнеш"
            action={{ href: "/physics", label: "Пълен каталог" }}
          />
          <p className="mb-[22px] max-w-[70ch] text-muted">
            Всяко ниво съдържа раздели, а всеки раздел съдържа уроци. Започни оттам, където
            учиш сега.
          </p>
          <LevelCards />
          <RecentLessons />
        </section>

        <section aria-labelledby="articles-title" className="pt-[72px]">
          <SectionHeading
            id="articles-title"
            number="§3"
            title="Статии"
            action={{ href: "/statii", label: "Всички статии" }}
          />
          <p className="mb-[22px] max-w-[70ch] text-muted">
            По-дълги текстове извън учебния план: за неща, които си струва да знаеш.
          </p>
          <ArticleList />
        </section>

        <section aria-labelledby="lesson-anatomy-title" className="pt-[72px]">
          <SectionHeading
            id="lesson-anatomy-title"
            number="§4"
            title="Как е устроен един урок"
          />
          <p className="mb-[22px] max-w-[70ch] text-muted">
            Всеки урок минава по един и същи път. Знаеш какво следва, преди да го отвориш.
          </p>
          <LessonAnatomy />
        </section>
      </main>

      <HomeFooter />
    </>
  );
}
